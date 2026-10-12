/* ---------------------------------------------------------------------------
   detectionEngine: master orchestrator
   Composes the modular analyzers in src/lib/analyzers into one report the
   dashboard consumes. The engine owns *composition* only:

     parse → per-message analysis → context gating → per-analyzer reports
           → combination bonuses → manipulation synthesis → recommendations

   Contract with the UI (stable: an on-device NLP engine can replace this
   file as long as it returns the same shape):
     { messages, riskScore, level, category, safeguarding,
       manipulationScore, confidence, signals, techniques, timeline,
       recommendations, analyzers, combinations }
--------------------------------------------------------------------------- */

import { TEXT_ANALYZERS, manipulationAnalyzer } from './analyzers'
import {
  ALL_CATEGORIES,
  COMBINATIONS,
  RECOMMENDATION_RULES,
  SAFE_RECOMMENDATIONS,
  ESCALATION_RECOMMENDATION,
} from './rules'
import {
  PROTECTIVE_PATTERNS,
  DELIVERY_PROTECTIVE,
  CODE_DELIVERY,
  REQUEST_CUE,
  THIRD_PARTY_OWNER,
  CREDENTIAL_CATEGORIES,
} from './rules/context'

/* Highlight tones for the conversation viewer and dashboard badges.
   Values are CSS variables (see index.css) so every tone adapts to the
   light and dark themes without the engine knowing which one is active. */
const tone = (name) => ({
  bg: `rgb(var(--c-${name}) / 0.18)`,
  border: `rgb(var(--c-${name}))`,
  text: `rgb(var(--c-${name}-ink))`,
})
export const HIGHLIGHT_COLORS = {
  warning: tone('warning'),
  primary: tone('primary'),
  danger: tone('danger'),
  accent: tone('accent'),
  success: tone('success'),
  cyan: tone('cyan'),
  yellow: tone('yellow'),
}

/* Rung categories of the grooming ladder (see rules/grooming.rules.js). */
const GROOMING_CATEGORIES = new Set([
  'ageProbe',
  'platformShift',
  'trustGrooming',
  'secrecyGrooming',
  'boundaryTesting',
  'meetingRequest',
  'meetingMention',
  'giftLure',
  'sextortion',
])

/* Rungs that cut a young person off from oversight. Asking someone's age or
   arranging to meet is something teachers and coaches do every day; doing it
   while moving the chat somewhere private, demanding secrecy, testing
   boundaries, or offering gifts is not. Safeguarding needs one of these. */
const COVERT_RUNGS = new Set(['platformShift', 'secrecyGrooming', 'boundaryTesting', 'giftLure', 'sextortion'])

/* Signals that tip a conversation toward the scam classification. */
const SCAM_CATEGORIES = new Set([
  'bankingAlarm', 'romance', 'investment', 'guaranteedReturns', 'techSupport',
  'remoteAccess', 'giveaway', 'sgBankImpersonation', 'sgTelcoImpersonation',
  'sgGovImpersonation', 'sgParcelScam', 'sgJobScam', 'sgPayNowTransfer',
  'sgMoneyMule', 'sgNewNumber', 'sgEcommerce', 'sgLoanScam',
  'financialRequest', 'paymentMethod', 'otp', 'password',
])

/* Signals with no benign reading from an unknown contact. */
const HARD_SIGNALS = new Set(['otp', 'password', 'remoteAccess', 'lookalikeDomain'])

/* Flat category map: the viewer reads labels/explanations from here. */
export const CATEGORIES = ALL_CATEGORIES

/* ---------------------------- Parsing ------------------------------------ */

/* Leading timestamps from chat exports and screenshots, stripped before the
   sender is read:
     [10/9/26, 10:41:02 PM] Name: ...      iPhone WhatsApp export
     09/10/2026, 22:41 - Name: ...         Android WhatsApp export
     [22:41] Name: ...  /  10:41 pm Name: ... */
const TIMESTAMP = [
  /^\[\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:[ap]\.?m\.?)?\]\s*/i,
  /^\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:[ap]\.?m\.?)?\s*[-\u2013]\s*/i,
  /^\[?\d{1,2}:\d{2}(?::\d{2})?\s*(?:[ap]\.?m\.?)?\]?\s+(?=\S+.*:\s)/i,
]

/* "Name: message". The name may be in any script (妈妈, Ah Beng 🐯) and is at
   most four words, so ordinary sentences containing a colon are not misread
   as names. A colon must be followed by a space, so URLs and times are safe. */
const SENDER = /^([^:\n]{1,32}?):\s+(.*\S)\s*$/u

function readSender(line) {
  const m = line.match(SENDER)
  if (!m) return null
  const name = m[1].trim()
  if (!name || /https?|www\./i.test(name) || name.split(/\s+/).length > 4) return null
  return { sender: name, text: m[2].trim() }
}

const USER_ALIASES = ['you', 'me', 'myself']

export function parseConversation(raw) {
  const lines = String(raw ?? '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => TIMESTAMP.reduce((acc, re) => acc.replace(re, ''), l))
    // Bubble timestamps read from a screenshot ("10:41", "21:02 ✓✓") carry no words.
    .filter((l) => l && !/^\W*\d{1,2}[:.]\d{2}\s*(?:[ap]\.?m\.?)?\W*$/i.test(l))

  const parsed = lines.map(readSender)
  // A labelled chat has a name on most lines (only wrapped lines lack one).
  // Text read from a screenshot rarely does, but one line such as
  // "DBS Security Alert: unusual activity" can look like a name, so a single
  // match is not enough to switch into labelled mode.
  const labelled = parsed.filter(Boolean).length >= Math.max(1, lines.length / 2)
  const messages = []

  lines.forEach((line, i) => {
    const p = parsed[i]
    if (p) {
      messages.push({ ...p, isUser: USER_ALIASES.includes(p.sender.toLowerCase()) })
    } else if (labelled && messages.length) {
      // A wrapped line inside a labelled chat continues the previous message.
      messages[messages.length - 1].text += ' ' + line
    } else {
      // No names anywhere (typical of text read from a screenshot): treat each
      // line as its own message so the timeline and highlights stay per line.
      messages.push({ sender: 'Them', text: line, isUser: false })
    }
  })
  return messages
}

/* ------------------------- Match utilities ------------------------------- */

/** Merge matches from all analyzers for one message, dropping overlaps. */
function dedupe(matches) {
  matches.sort((a, b) => a.start - b.start || b.end - a.end)
  const clean = []
  let cursor = -1
  for (const m of matches) {
    if (m.start >= cursor) {
      clean.push(m)
      cursor = m.end
    }
  }
  return clean
}

/* -------------------------- Context filtering ----------------------------- */

const overlaps = (m, spans) => spans.some(([a, b]) => m.start < b && m.end > a)

function spansOf(text, patterns) {
  const spans = []
  for (const re of patterns) {
    re.lastIndex = 0
    let x
    while ((x = re.exec(text)) !== null) {
      spans.push([x.index, x.index + x[0].length])
      if (x.index === re.lastIndex) re.lastIndex++
    }
  }
  return spans
}

/**
 * Set aside matches that are safety advice, part of a code being delivered
 * to the reader, or about someone else's code. Returns the kept matches and
 * the set-aside ones with a reason (shown in the UI).
 */
function applyContext(text, matches) {
  const blank = (t, spans) => spans.reduce((acc, [a, b]) => acc.slice(0, a) + ' '.repeat(b - a) + acc.slice(b), t)
  const tidy = (t) => t.trim().replace(/[\s,;:]+$/, '')

  let protective = spansOf(text, PROTECTIVE_PATTERNS)
  const deliveryAdvice = spansOf(text, [DELIVERY_PROTECTIVE])
  const outsideAdvice = blank(text, protective.concat(deliveryAdvice))
  const delivery = text.match(CODE_DELIVERY)
  const isDelivery = !!delivery && !REQUEST_CUE.test(outsideAdvice)
  if (isDelivery) protective = protective.concat(deliveryAdvice)

  const kept = []
  const ignored = []
  for (const m of matches) {
    const advice = protective.find(([a, b]) => m.start < b && m.end > a)
    if (advice) {
      ignored.push({ phrase: tidy(text.slice(advice[0], advice[1])), reason: 'safety advice, not a request' })
    } else if (isDelivery && (CREDENTIAL_CATEGORIES.has(m.category) || m.analyzer === 'urgency')) {
      ignored.push({ phrase: tidy(delivery[0]), reason: 'a code being sent to you, not a request for one' })
    } else if (CREDENTIAL_CATEGORIES.has(m.category) && THIRD_PARTY_OWNER.test(text.slice(Math.max(0, m.start - 30), m.start))) {
      const owner = text.slice(Math.max(0, m.start - 30), m.start).match(THIRD_PARTY_OWNER)[0]
      ignored.push({ phrase: tidy(owner + m.phrase), reason: "someone else's code or password, not a request for yours" })
    } else kept.push(m)
  }
  return { kept, ignored }
}

/* --------------------------- Main analysis ------------------------------- */

export function analyzeConversation(raw) {
  const messages = parseConversation(raw)

  // 1) Per-message pattern matching across every analyzer -------------------
  const ignored = []
  let perMessage = messages.map((msg) => {
    if (msg.isUser) return []
    const { kept, ignored: setAside } = applyContext(
      msg.text,
      TEXT_ANALYZERS.flatMap((a) => a.analyzeMessage(msg.text)),
    )
    ignored.push(...setAside)
    return dedupe(kept)
  })

  // 2) Context gating --------------------------------------------------------
  // Contextual categories (brand names, P2P apps, personal-info nouns) are
  // weak alone: "I ordered from Amazon" must not score. They only count when
  // at least one non-contextual manipulation signal exists in the chat.
  const hasStrongSignal = perMessage.some((ms) => ms.some((m) => !m.contextual))
  if (!hasStrongSignal) {
    perMessage = perMessage.map((ms) => ms.filter((m) => !m.contextual))
  }

  const allMatches = perMessage.flat()

  // 3) Per-analyzer structured reports ---------------------------------------
  const analyzerReports = TEXT_ANALYZERS.map((a) =>
    a.report(allMatches.filter((m) => m.analyzer === a.id)),
  )

  // 4) Combination bonuses ----------------------------------------------------
  const present = new Set(allMatches.map((m) => m.category))
  const combos = []
  let comboPoints = 0
  for (const combo of COMBINATIONS) {
    const hitA = combo.a.some((k) => present.has(k))
    const hitB = combo.b.some((k) => present.has(k))
    if (hitA && hitB) {
      // Same-message co-occurrence is stronger evidence than same-chat
      const sameMessage = perMessage.some(
        (ms) =>
          combo.a.some((k) => ms.some((m) => m.category === k)) &&
          combo.b.some((k) => ms.some((m) => m.category === k)),
      )
      const bonus = sameMessage ? combo.bonus * 1.5 : combo.bonus
      comboPoints += bonus
      combos.push({ ...combo, sameMessage, bonus: Math.round(bonus) })
    }
  }

  // 5) Per-message scoring → risk timeline ------------------------------------
  // Each point on the timeline is that message's own intensity, so the chart
  // shows *where* in the conversation the pressure spikes.
  const seenByCategory = {}
  const timeline = perMessage.map((ms) => {
    let pts = 0
    for (const m of ms) {
      const cat = ALL_CATEGORIES[m.category]
      const seen = seenByCategory[m.category] || 0
      pts += cat.weight * Math.pow(0.6, seen)
      seenByCategory[m.category] = seen + 1
    }
    return Math.min(99, Math.round(100 * (1 - Math.exp(-pts / 22))))
  })

  // 6) Overall risk ------------------------------------------------------------
  const totalPoints =
    analyzerReports.reduce((sum, r) => sum + r.points, 0) + comboPoints
  let riskScore = Math.min(99, Math.round(100 * (1 - Math.exp(-totalPoints / 60))))

  // Child-safety floor: grooming is a safeguarding matter, not a points game.
  // The chat is HIGH, however mildly it is worded, if a grooming escalation
  // combination fires, if there is sextortion, or if two rungs of the ladder
  // appear and at least one of them cuts the child off from oversight.
  const groomingHits = [...present].filter((k) => GROOMING_CATEGORIES.has(k))
  const groomingCombo = combos.some((c) => c.id.startsWith('grooming-'))
  const covert = groomingHits.some((k) => COVERT_RUNGS.has(k))
  const safeguarding =
    groomingCombo || present.has('sextortion') || (groomingHits.length >= 2 && covert)
  if (safeguarding) riskScore = Math.max(riskScore, 78)

  // Severity floor: being asked for a one-time code, a password, remote
  // control of your device, or being sent a look-alike domain is never
  // benign, so these alone always surface at least MEDIUM.
  if ([...present].some((k) => HARD_SIGNALS.has(k))) riskScore = Math.max(riskScore, 45)

  const level = riskScore >= 65 ? 'HIGH' : riskScore >= 35 ? 'MEDIUM' : 'LOW'

  // 7) Manipulation synthesis (composite analyzer) ------------------------------
  const manipulation = manipulationAnalyzer.report(analyzerReports, combos)

  // 8) Flat signal list for the dashboard ---------------------------------------
  const counts = {}
  for (const m of allMatches) counts[m.category] = (counts[m.category] || 0) + 1
  const signals = Object.entries(counts)
    .map(([key, count]) => ({ key, count, ...ALL_CATEGORIES[key] }))
    .sort((a, b) => b.weight * b.count - a.weight * a.count)

  // 9) Overall confidence ---------------------------------------------------------
  const totalHits = allMatches.length
  const confidence =
    totalHits === 0
      ? 92 // confident that nothing was found
      : Math.min(
          97,
          55 + signals.length * 4 + Math.min(16, totalHits * 2) + combos.length * 3,
        )

  // 10) Recommendations --------------------------------------------------------
  const recommendations = RECOMMENDATION_RULES.filter((r) =>
    r.when.some((k) => present.has(k)),
  ).map(({ title, body }) => ({ title, body }))
  if (recommendations.length === 0) recommendations.push(...SAFE_RECOMMENDATIONS)
  else if (level !== 'LOW') recommendations.push(ESCALATION_RECOMMENDATION)
  // On a safeguarding flag, the trusted-adult advice always comes first.
  if (safeguarding) {
    const i = recommendations.findIndex((r) => r.title === 'Tell a trusted adult now')
    if (i > 0) recommendations.unshift(...recommendations.splice(i, 1))
  }

  // 11) Category: which kind of harm dominates -------------------------------
  const scamHits = [...present].filter((k) => SCAM_CATEGORIES.has(k)).length
  let category = 'safe'
  if (level !== 'LOW' || safeguarding) {
    const groomingLeads = groomingHits.length > 0 && groomingHits.length >= scamHits
    category = safeguarding || groomingLeads ? 'grooming' : 'scam'
  }

  return {
    messages: messages.map((msg, i) => ({ ...msg, matches: perMessage[i] })),
    riskScore,
    level,
    category,
    safeguarding,
    manipulationScore: manipulation.score,
    confidence,
    signals,
    techniques: manipulation.techniques,
    timeline,
    recommendations: recommendations.slice(0, 8),
    // New structured layers (available to future UI without breaking current one)
    analyzers: Object.fromEntries(
      [...analyzerReports, manipulation].map((r) => [r.analyzer, r]),
    ),
    // Phrases recognised as safety advice or a delivered code and not counted.
    ignored: [...new Map(ignored.map((x) => [x.phrase.toLowerCase(), x])).values()],
    combinations: combos.map(({ id, label, explain, bonus, sameMessage }) => ({
      id,
      label,
      explain,
      bonus,
      sameMessage,
    })),
  }
}
