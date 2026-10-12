import { defineRules } from './helpers'

export default defineRules('threats', 'Threat Analyzer', {
  accountThreat: {
    label: 'Account threat',
    color: 'danger',
    weight: 13,
    technique: 'Fear',
    explain: {
      why: 'Threatens that your account will be suspended, locked, restricted, or permanently disabled.',
      use: 'Losing access to money or email feels catastrophic, so the threat pushes instant compliance.',
      respond: 'Log in through the official app or website yourself. If nothing is wrong there, nothing is wrong.',
    },
    patterns: [
      /\b(account (will be |has been |is )?(suspended|closed|blocked|frozen|locked|restricted|terminated|permanently disabled))\b/gi,
      /\b(permanently (deleted|banned|disabled)|lose (all your|your) (money|funds|account|files|data))\b/gi,
    ],
  },
  legalThreat: {
    label: 'Legal threat',
    color: 'danger',
    weight: 18,
    technique: 'Fear',
    explain: {
      why: 'Threatens arrest, lawsuits, fines, warrants, or a criminal investigation.',
      use: 'Fear of law enforcement is primal: real agencies send letters and never demand payment in chat.',
      respond: 'Police, courts, and tax offices do not settle cases over messages. Disengage and report it.',
    },
    patterns: [
      /\b(arrest(ed)?|warrant (for|issued|out)|legal action|lawsuit|sue you|criminal (investigation|charges)|court order|penalty|fine of|prosecut(e|ion))\b/gi,
    ],
  },
  personalThreat: {
    label: 'Coercion',
    color: 'danger',
    weight: 15,
    technique: 'Fear',
    explain: {
      why: 'Uses direct intimidation: exposure, reporting you, or vague "consequences".',
      use: 'When persuasion fails, scammers escalate to coercion to keep you from walking away.',
      respond: 'Threats are a sign to stop engaging completely. Save the messages and tell someone you trust.',
    },
    patterns: [
      /\b(expose (you|your)|report you|you will regret|or else|face (the )?consequences|we know where you)\b/gi,
    ],
  },
})
