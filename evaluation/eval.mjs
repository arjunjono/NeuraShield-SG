/* ---------------------------------------------------------------------------
   NeuraShield SG evaluation harness
   Runs the real detection engine (src/lib/detectionEngine.js, bundled by
   `npm run eval`) over the 100 labelled conversations in dataset.json and
   reports accuracy, per-class precision/recall/F1, the confusion matrix,
   Singlish vs plain-English accuracy, a keyword-blocklist baseline, and a
   small held-out check on conversations that are not in the dataset.

   Run:  npm run eval
   Writes: evaluation/results.json and evaluation/RESULTS.md
--------------------------------------------------------------------------- */
import { readFileSync, writeFileSync } from 'node:fs'
import { analyzeConversation } from './.engine.mjs'

const here = (f) => new URL(f, import.meta.url)
const dataset = JSON.parse(readFileSync(here('./dataset.json')))
const LABELS = ['legit', 'scam', 'grooming']

/* The engine's category maps straight onto the three labels. */
const decide = (report) => (report.category === 'safe' ? 'legit' : report.category)

/* Baseline: a naive keyword blocklist. Harmful if any listed token appears.
   It cannot tell scams from grooming, so it is scored on harmful vs safe. */
const BLOCKLIST = [
  'otp', 'password', 'verify your account', 'click here', 'gift card',
  'bitcoin', 'usdt', 'wire transfer', 'suspended', 'urgent', 'prize',
  'guaranteed', 'http://', '.xyz', '.top', '.online', 'anydesk', 'paynow',
  'send me', 'secret', 'alone', 'selfie',
]
const baseline = (text) =>
  BLOCKLIST.some((k) => text.toLowerCase().includes(k)) ? 'harmful' : 'safe'

const confusion = Object.fromEntries(LABELS.map((a) => [a, Object.fromEntries(LABELS.map((p) => [p, 0]))]))
const rows = []
for (const conv of dataset) {
  const r = analyzeConversation(conv.text)
  const predicted = decide(r)
  confusion[conv.label][predicted]++
  rows.push({
    id: conv.id,
    actual: conv.label,
    predicted,
    correct: predicted === conv.label,
    singlish: conv.singlish,
    riskScore: r.riskScore,
    level: r.level,
    safeguarding: r.safeguarding,
    signals: r.signals.map((s) => s.label),
    baseline: baseline(conv.text),
  })
}

const prf = (label) => {
  let tp = 0, fp = 0, fn = 0
  for (const a of LABELS) for (const p of LABELS) {
    const n = confusion[a][p]
    if (a === label && p === label) tp += n
    else if (p === label) fp += n
    else if (a === label) fn += n
  }
  const precision = tp + fp ? tp / (tp + fp) : 0
  const recall = tp + fn ? tp / (tp + fn) : 0
  const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0
  return { tp, fp, fn, precision, recall, f1 }
}

const binary = (predHarm) => {
  let tp = 0, tn = 0, fp = 0, fn = 0
  rows.forEach((r, i) => {
    const truth = r.actual !== 'legit'
    const pred = predHarm(r, i)
    if (truth && pred) tp++
    else if (!truth && !pred) tn++
    else if (!truth && pred) fp++
    else fn++
  })
  const precision = tp / (tp + fp || 1)
  const recall = tp / (tp + fn || 1)
  return {
    tp, tn, fp, fn,
    accuracy: (tp + tn) / rows.length,
    precision, recall,
    f1: (2 * precision * recall) / (precision + recall || 1),
  }
}

const correct = rows.filter((r) => r.correct).length
const sl = rows.filter((r) => r.singlish)
const pl = rows.filter((r) => !r.singlish)

/* Held-out check: conversations written after the dataset and rules were
   finalised, worded differently from anything above. */
const HELD_OUT = [
  ['legit-brand-money', 'legit', `Jason: eh the UOB app updated already, quite nice
You: ya i saw the new layout
Jason: i paynow you back for lunch btw
You: ok received thanks`],
  ['scam-reworded', 'scam', `Unknown: Good day, this is a courtesy call from your bank's risk unit regarding irregular charges.
You: which bank
Unknown: We cannot disclose over chat. Kindly authenticate by providing the passcode sent to your mobile so we may reverse the charge.
You: hmm
Unknown: Please be quick, the transaction posts in ten minutes and cannot be undone.`],
  ['grooming-soft', 'grooming', `Stranger: you're honestly wiser than most people i talk to
You: haha thanks i'm only 14
Stranger: age doesn't matter, minds like ours are rare, this feels easier just the two of us
You: what do you mean
Stranger: maybe shift over to a private app, and let's keep this our own thing, no need to mention it at home`],
  ['legit-singlish', 'legit', `Ah Meng: eh later go kopitiam anot
You: can lah damn hungry sia
Ah Meng: i paynow you for drinks first
You: ok confirm see you there`],
].map(([id, truth, text]) => {
  const r = analyzeConversation(text)
  const predicted = decide(r)
  return { id, truth, predicted, correct: predicted === truth, riskScore: r.riskScore }
})

const summary = {
  total: rows.length,
  correct,
  accuracy: correct / rows.length,
  perClass: Object.fromEntries(LABELS.map((l) => [l, prf(l)])),
  confusion,
  engineBinary: binary((r) => r.predicted !== 'legit'),
  baselineBinary: binary((r) => r.baseline === 'harmful'),
  singlish: { count: sl.length, accuracy: sl.filter((r) => r.correct).length / sl.length },
  plainEnglish: { count: pl.length, accuracy: pl.filter((r) => r.correct).length / pl.length },
  heldOut: HELD_OUT,
}
writeFileSync(here('./results.json'), JSON.stringify({ summary, rows }, null, 2))

/* ---- Human-readable report ---- */
const pct = (x) => (x * 100).toFixed(1) + '%'
const md = []
md.push('# NeuraShield SG evaluation results', '')
md.push(`Dataset: ${rows.length} conversations (50 legitimate, 25 scam, 25 grooming), ${sl.length} in Singlish, ${pl.length} in plain English.`, '')
md.push(`**Overall three-class accuracy: ${correct}/${rows.length} (${pct(summary.accuracy)})**`, '')
md.push('## Per class', '', '| Class | Precision | Recall | F1 | TP | FP | FN |', '|---|---|---|---|---|---|---|')
for (const l of LABELS) {
  const m = summary.perClass[l]
  md.push(`| ${l} | ${pct(m.precision)} | ${pct(m.recall)} | ${pct(m.f1)} | ${m.tp} | ${m.fp} | ${m.fn} |`)
}
md.push('', '## Confusion matrix (rows actual, columns predicted)', '', '| | legit | scam | grooming |', '|---|---|---|---|')
for (const a of LABELS) md.push(`| ${a} | ${confusion[a].legit} | ${confusion[a].scam} | ${confusion[a].grooming} |`)
const e = summary.engineBinary, b = summary.baselineBinary
md.push('', '## Harmful vs safe, against a keyword blocklist', '', '| Metric | Keyword blocklist | NeuraShield SG |', '|---|---|---|')
md.push(`| Accuracy | ${pct(b.accuracy)} | ${pct(e.accuracy)} |`)
md.push(`| Precision | ${pct(b.precision)} | ${pct(e.precision)} |`)
md.push(`| Recall | ${pct(b.recall)} | ${pct(e.recall)} |`)
md.push(`| False positives (of 50 legit) | ${b.fp} | ${e.fp} |`)
md.push('', '## Register', '', `- Singlish: ${sl.length} conversations, ${pct(summary.singlish.accuracy)}`, `- Plain English: ${pl.length} conversations, ${pct(summary.plainEnglish.accuracy)}`)
md.push('', '## Held-out check (not in the dataset)', '')
for (const h of HELD_OUT) md.push(`- ${h.correct ? 'PASS' : 'MISS'} \`${h.id}\`: expected ${h.truth}, got ${h.predicted} (risk ${h.riskScore})`)
md.push('', '## Misclassified', '')
const missed = rows.filter((r) => !r.correct)
if (!missed.length) md.push('None.')
for (const r of missed) md.push(`- \`${r.id}\`: ${r.actual} predicted as ${r.predicted} (risk ${r.riskScore}; signals: ${r.signals.join(', ') || 'none'})`)
writeFileSync(here('./RESULTS.md'), md.join('\n') + '\n')
console.log(md.join('\n'))
