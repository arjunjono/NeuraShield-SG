/* ---------------------------------------------------------------------------
   NeuraShield SG stress test runner
   Runs SET_A (diagnostic) and SET_B (held out) from stress-cases.mjs through
   the real engine and reports accuracy per set and per group, crashes,
   parsing problems, and timing.

   Run:  npm run stress            (summary + every miss)
--------------------------------------------------------------------------- */
import { writeFileSync } from 'node:fs'
import { analyzeConversation } from './.engine.mjs'
import { SET_A, SET_B } from './stress-cases.mjs'

const decide = (r) => (r.category === 'safe' ? 'legit' : r.category)

function run(cases) {
  return cases.map((tc) => {
    const t0 = performance.now()
    let r, error = null
    try {
      r = analyzeConversation(tc.text)
    } catch (e) {
      error = String(e)
    }
    const ms = performance.now() - t0
    if (error) return { ...tc, predicted: 'CRASH', correct: false, error, ms }
    const predicted = decide(r)
    const parseOk = !tc.minMessages || r.messages.length >= tc.minMessages
    return {
      ...tc,
      predicted,
      correct: predicted === tc.expect && parseOk,
      parseOk,
      messages: r.messages.length,
      riskScore: r.riskScore,
      level: r.level,
      safeguarding: r.safeguarding,
      signals: r.signals.map((s) => s.label),
      ms,
    }
  })
}

const pct = (n, d) => (d ? ((100 * n) / d).toFixed(1) + '%' : 'n/a')

function report(name, rows) {
  const scored = rows.filter((r) => !r.ambiguous)
  const ok = scored.filter((r) => r.correct).length
  const lines = [`## ${name}`, '', `Headline accuracy (excluding ambiguous): ${ok}/${scored.length} (${pct(ok, scored.length)})`, '']
  const groups = [...new Set(rows.map((r) => r.group))]
  lines.push('| Group | Correct | Accuracy |', '|---|---|---|')
  for (const g of groups) {
    const gr = scored.filter((r) => r.group === g)
    const gok = gr.filter((r) => r.correct).length
    lines.push(`| ${g} | ${gok}/${gr.length} | ${pct(gok, gr.length)} |`)
  }
  const legit = scored.filter((r) => r.expect === 'legit')
  const fps = legit.filter((r) => r.predicted !== 'legit')
  const harmful = scored.filter((r) => r.expect !== 'legit')
  const caught = harmful.filter((r) => r.predicted !== 'legit')
  const wrongType = harmful.filter((r) => r.predicted !== 'legit' && r.predicted !== r.expect)
  lines.push('', `False alarms on legitimate chats: ${fps.length}/${legit.length}`)
  lines.push(`Harmful chats flagged at all: ${caught.length}/${harmful.length} (${wrongType.length} flagged under the wrong type)`)
  const amb = rows.filter((r) => r.ambiguous)
  if (amb.length) {
    lines.push('', 'Ambiguous by design (reported, not scored):')
    for (const r of amb) lines.push(`- \`${r.id}\` ${r.note || ''}: expected ${r.expect}, got ${r.predicted} (risk ${r.riskScore})`)
  }
  const misses = scored.filter((r) => !r.correct)
  lines.push('', misses.length ? 'Misses:' : 'Misses: none')
  for (const r of misses) {
    const why = r.error ? `CRASH ${r.error}` : !r.parseOk ? `parsed into ${r.messages} message(s)` : `risk ${r.riskScore} ${r.level}; signals: ${r.signals.join(', ') || 'none'}`
    lines.push(`- \`${r.id}\` ${r.note ? `(${r.note}) ` : ''}expected ${r.expect}, got ${r.predicted}. ${why}`)
  }
  const slow = Math.max(...rows.map((r) => r.ms))
  lines.push('', `Slowest single analysis: ${slow.toFixed(1)} ms`, '')
  return { text: lines.join('\n'), ok, total: scored.length, fps: fps.length, legit: legit.length }
}

const a = report('Set A (diagnostic)', run(SET_A))
const b = report('Set B (held out, never used for tuning)', run(SET_B))
const out = ['# NeuraShield SG stress test', '', a.text, b.text].join('\n')
writeFileSync(new URL('./STRESS.md', import.meta.url), out)
console.log(out)
