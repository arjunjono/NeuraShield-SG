import { defineRules } from './helpers'

export default defineRules('emotional', 'Emotional Pressure Analyzer', {
  fear: {
    label: 'Fear',
    color: 'danger',
    weight: 11,
    technique: 'Fear',
    explain: {
      why: 'Frightening language: hacked accounts, compromised data, unauthorized activity, being "at risk".',
      use: 'A scared brain narrows its options; fear makes the scammer\u2019s "solution" look like the only exit.',
      respond: 'Notice the fear, then verify the claim independently before doing anything it demands.',
    },
    patterns: [
      /\b(compromised|hacked|breach(ed)?|unauthorized (access|activity|transaction)|suspicious activity|at (serious )?risk|your (files|data|savings) (are|is) (at risk|in danger))\b/gi,
    ],
  },
  guilt: {
    label: 'Guilt',
    color: 'danger',
    weight: 10,
    technique: 'Guilt',
    explain: {
      why: 'Makes refusing feel like a betrayal: "after everything I\u2019ve done", "if you really loved me".',
      use: 'Guilt reframes your caution as cruelty, so protecting yourself feels like hurting them.',
      respond: 'Someone who genuinely cares about you will never punish you for being careful.',
    },
    patterns: [
      /\b(after (everything|all) i('ve| have) done|if you (really|truly) (loved|cared about|trusted) me|you('re| are) letting me down|i thought you (loved|trusted) me|don'?t you (love|trust) me)\b/gi,
    ],
  },
  flattery: {
    label: 'Flattery / love bombing',
    color: 'danger',
    weight: 9,
    technique: 'Flattery',
    explain: {
      why: 'Overwhelming affection or praise very early: soulmates, destiny, "the only one who understands".',
      use: 'Intense manufactured intimacy builds trust fast, so later requests for money feel like helping a partner.',
      respond: 'Real relationships build slowly. Be wary of intense devotion from someone you have never met.',
    },
    patterns: [
      /\b(my (love|darling|dearest|queen|king)|you'?re the only one( i (trust|have))?|soul ?mate|we('re| are) meant to be|destiny brought us|i('ve| have) never felt this way|love of my life)\b/gi,
    ],
  },
  falseReassurance: {
    label: 'False reassurance',
    color: 'danger',
    weight: 9,
    technique: 'False reassurance',
    explain: {
      why: 'Preemptively dismisses your doubts: "trust me", "completely safe", "standard procedure".',
      use: 'Answering an objection before you raise it is a script; honest people rarely need to insist they are honest.',
      respond: 'The more someone insists something is safe and normal, the more it deserves independent checking.',
    },
    patterns: [
      /\b(trust me|(this is |it'?s )?(completely|totally|100%) (safe|legit|normal)|nothing to worry about|standard (procedure|practice)|everyone (does|says) (this|that))\b/gi,
    ],
  },
})
