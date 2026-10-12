import { defineRules } from './helpers'

export default defineRules('credentials', 'Credential Theft Analyzer', {
  otp: {
    label: 'OTP / verification code',
    color: 'yellow',
    weight: 22,
    technique: 'Authority',
    explain: {
      why: 'Asks you to share a one-time passcode, 2FA code, or verification code.',
      use: 'The code is the last lock on your account: the attacker has your password and needs you to open the door.',
      respond: 'Never read a code to anyone, for any reason. The request itself is the attack.',
    },
    patterns: [
      /\b(otp|one.?time (pass)?code|(verification|authentication|security|sms|2fa) code|6.?digit code|code (we|i) (just )?sent|read (me|out|back) the code)\b/gi,
      /\b((the |a )?(security|verification|one.?time|confirmation) (number|code|pin)|(number|code) (we|i) (just )?(sent|messaged)|code (sent|texted) to your (phone|mobile)|confirm the code|read (it|the number) (out|to me)|pass ?code|authenticate (by|with|yourself)|provide the (code|number|passcode))\b/gi,
      /\b(send (it|the code|them|the sms) back( to me)?|(accidentally|wrongly|mistakenly) sent (my|a|the) [\w ]{0,20}(code|otp)|6.?digit (one|number|pin)|(code|otp|sms) (that )?you (just )?(got|received|receive))\b/gi,
    ],
  },
  password: {
    label: 'Password / PIN request',
    color: 'yellow',
    weight: 18,
    technique: 'Authority',
    explain: {
      why: 'Requests your password, PIN, login details, or security answers.',
      use: 'Support staff at real companies cannot even see your password: only impostors ask for it.',
      respond: 'Refuse, then change the password from the official site if you shared anything.',
    },
    patterns: [
      /\b((your|the|his|her) password|account password|pin (number|code)|security (question|answer)s?|login (details|credentials)|confirm your (identity|details) (by|with)|verification link)\b/gi,
      /\b((ibanking|internet banking|online banking|digibank|singpass|bank) (login|password|details|credentials|id and password)|(enter|key in|provide|update|verify|give me) (your )?(credit |debit |bank )?card (details|number|info)|card (details|number) (and|&) (cvv|expiry|pin))\b/gi,
    ],
  },
  personalInfo: {
    label: 'Personal information',
    color: 'yellow',
    weight: 8,
    technique: 'Authority',
    contextual: true, // "what's your new phone number?" from Mum is normal
    explain: {
      why: 'Fishes for identity data: social security numbers, passport, license, card numbers, or date of birth.',
      use: 'Identity fragments are assembled into full profiles for account takeover and credit fraud.',
      respond: 'Share identity documents only through official, verified channels you initiated.',
    },
    patterns: [
      /\b(social security( number)?|ssn|passport (number|details)|driver'?s? licen[sc]e|credit card number|card number and cvv|date of birth|mother'?s maiden name)\b/gi,
    ],
  },
})
