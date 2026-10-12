import { defineRules } from './helpers'

/* ---------------------------------------------------------------------------
   singlish.rules: Singlish register AUGMENTATION layer, not a detector.

   Every category here is contextual and low-weight. Through the context gate
   in detectionEngine.js, a contextual match scores zero unless a
   non-contextual manipulation signal is already present. So Singlish alone
   never raises risk and the engine works fully on plain English. When a real
   scam or grooming signal is present and the sender code-switches into
   Singlish to sound local and trustworthy, these add a small bump.
--------------------------------------------------------------------------- */

export default defineRules('singlish', 'Singlish Register Analyzer', {
  singlishParticle: {
    label: 'Singlish register',
    color: 'yellow',
    weight: 3,
    technique: 'Flattery',
    contextual: true,
    explain: {
      why: 'Uses Singlish particles and slang (lah, leh, lor, sia, meh, hor, aiyo, paiseh) to sound local and familiar.',
      use: 'Switching into Singlish makes an impersonator or stranger read as a fellow Singaporean rather than an outsider.',
      respond: 'Sounding local proves nothing. Judge the request, not the accent, and verify through official channels.',
    },
    patterns: [
      /\b(lah|leh|lor|sia|meh|hor|aiyo|aiyah|paiseh|walao|wah lao|bojio|shiok|sian|kiasu|steady lah|can anyhow|confirm plus chop|catch no ball|blur like sotong)\b/gi,
    ],
  },
  singlishUrgencyReassure: {
    label: 'Singlish reassurance or push',
    color: 'yellow',
    weight: 4,
    technique: 'False reassurance',
    contextual: true,
    explain: {
      why: 'Local-flavoured reassurance or pressure: "can one lah", "sure can", "don\u2019t worry lah", "fast fast", "trust me can".',
      use: 'Brushing off doubt in a casual local voice lowers your guard faster than a formal script would.',
      respond: 'A friendly local tone does not make a request safe. The more casually you are rushed, the more it deserves a pause.',
    },
    patterns: [
      /\b(can one( lah)?|sure can|confirm can|don'?t worry( lah)?|no need (worry|scared)|fast fast|quickly (lah|leh)|trust me can|steady one|die die must|swee swee)\b/gi,
    ],
  },
})
