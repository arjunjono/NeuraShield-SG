import { defineRules } from './helpers'

export default defineRules('secrecy', 'Secrecy & Isolation Analyzer', {
  secrecy: {
    label: 'Secrecy',
    color: 'danger',
    weight: 13,
    technique: 'Isolation',
    explain: {
      why: 'Demands the conversation stay hidden: secret, confidential, "between us", delete the messages.',
      use: 'Secrecy exists for one reason: so nobody who would recognize the scam ever hears about it.',
      respond: 'Legitimate business survives daylight. A demand for secrecy is a demand to tell someone.',
    },
    patterns: [
      /\b(keep (this|it) (a )?secret|(just )?between (us|you and me)|don'?t (tell|mention|share|discuss) (this|it|anyone)|confidential matter|delete (this|these|our) (message|chat)s?)\b/gi,
    ],
  },
  isolation: {
    label: 'Isolation',
    color: 'danger',
    weight: 15,
    technique: 'Isolation',
    explain: {
      why: 'Cuts you off from your safety net: family, friends, your bank, or real support.',
      use: 'The people around you are the scam\u2019s biggest threat; isolating you removes every chance of a warning.',
      respond: 'Do exactly what they forbid: tell a trusted adult, call your bank, hang up and think.',
    },
    patterns: [
      /\b(don'?t (tell|trust|listen to|contact) (anyone|your (family|friends|parents|mum|mom|dad|bank))|they won'?t understand|only i can help( you)?|no one else (can|will)|don'?t (hang up|contact support)|stay on the line)\b/gi,
    ],
  },
})
