/* ---------------------------------------------------------------------------
   context.js: telling safety advice apart from a request

   Rule patterns match words, so on their own they cannot tell
     "Do not share this OTP with anyone"      (what a real bank sends)
   from
     "Read me the OTP we just sent"            (what a scammer sends).
   This file holds the patterns the engine uses to set such matches aside
   BEFORE scoring. Every set-aside phrase is returned to the UI with its
   reason, so the decision stays explainable.

   Three kinds of context:
   1. PROTECTIVE: safety advice. "Never share your OTP", "We will never ask
      for your password", "If you did not request this...".
   2. CODE DELIVERY: a message that hands you a code ("Your OTP is 482913")
      and contains no request to send it anywhere. Real OTP texts look like
      this. A scam asks for the code; it does not deliver one. In a delivery
      message, credential and expiry-urgency matches are set aside.
   3. THIRD-PARTY: a code or password that belongs to someone else in the
      sentence ("they asked for her OTP", "I won't give you my OTP"). That is
      somebody describing a scam, not somebody running one.
--------------------------------------------------------------------------- */

const CODE = '(?:otps?|one.?time (?:pass(?:word|code)|pin|code)|(?:verification|security|sms|2fa|authentication) codes?|pass ?codes?|passwords?|pins?|codes?)'

/** Safety-advice spans. Any rule match inside one of these is set aside. */
export const PROTECTIVE_PATTERNS = [
  // "Do not share this OTP with anyone", "never give your password to anyone"
  new RegExp(
    `\\b(?:do not|don'?t|never|not to|pls don'?t|please do not|please don'?t)\\s+(?:ever\\s+)?(?:share|give|disclose|reveal|tell|send|forward|read out)\\s+(?:out\\s+)?(?:this |the |your |any |these )?(?:\\w+ )?${CODE}(?:\\s*(?:with|to)\\s+(?:anyone|anybody|any ?one|others|other people|someone)[^.!?\\n]*)?`,
    'gi',
  ),
  // "We will never ask for your password", "Banks will never ask you to transfer funds or share your OTP"
  /\b(?:will|would|does|do|shall|can|should)\s+never\s+(?:ever\s+)?(?:ask|call|request|message|sms|email|contact)\b[^.!?\n]{0,80}/gi,
  // "Never share OTP with anyone", "never click links from strangers"
  /\bnever\s+(?:share|give|click|tap|open|transfer|send)\b[^.!?\n]{0,60}\b(?:anyone|anybody|strangers?|unknown|others)\b/gi,
  // "If you did not request this, call..." / "If unauthorised, call..."
  /\bif (?:you )?(?:did not|didn'?t|have not|haven'?t) (?:request|make|authori[sz]e|initiate|perform)\b[^.!?\n]{0,80}/gi,
  /\bif (?:this (?:was|is) not you|unauthori[sz]ed|not you)\b[^.!?\n]{0,60}/gi,
]

/** Inside a code-delivery message only: "Don't share it with anyone". Outside
    one, the same words from a stranger are a secrecy tactic, so they score. */
export const DELIVERY_PROTECTIVE = /\b(?:do not|don'?t|never)\s+(?:share|give|forward|disclose|tell)\s+(?:it|this)\s+(?:with|to)\s+(?:anyone|anybody|any ?one|others)\b[^.!?\n]*/gi

/** A message that hands over a code: "Your OTP is 482913", "482913 is your code". */
export const CODE_DELIVERY = new RegExp(
  `(?:\\b${CODE}\\b(?:[^.!?\\n]|\\.(?=\\d)){0,80}?\\bis:?\\s*\\d{4,8}\\b)|(?:\\b\\d{4,8}\\b[^.!?\\n]{0,15}\\bis your\\b)`,
  'i',
)

/** Asking the reader to pass something on. Checked outside protective spans. */
export const REQUEST_CUE =
  /\b(?:send|share|give|tell|read|provide|providing|key in|enter|type in|forward|reply(?: with)?|confirm|let me (?:have|know)|what(?:'?s| is) the (?:code|otp|number))\b/i

/** A code or password owned by someone other than the reader. */
export const THIRD_PARTY_OWNER = /\b(?:her|his|their|my|our|its)\s+(?:\w+\s+)?$/i

/** Analyzers whose matches the code-delivery and third-party checks apply to. */
export const CREDENTIAL_CATEGORIES = new Set(['otp', 'password'])
