import { defineRules } from './helpers'

export default defineRules('authority', 'Authority Analyzer', {
  authority: {
    label: 'Authority',
    color: 'primary',
    weight: 10,
    technique: 'Authority',
    explain: {
      why: 'Claims to be an institution: a bank department, government agency, police, or official support.',
      use: 'Borrowed authority makes demands feel non-negotiable and discourages you from questioning them.',
      respond: 'Real institutions never mind being verified. Hang up and call the official number yourself.',
    },
    patterns: [
      /\b(bank security|security (team|department)|fraud (team|department|prevention|desk|unit)|risk (team|unit|desk)|government|irs|tax (office|authority|department)|police|court order|customs|official support|compliance (team|department)|legal department|account (team|manager))\b/gi,
      /\b(this is (microsoft|apple|google|amazon|paypal|windows) (support|security|team)|microsoft technician|certified (agent|technician))\b/gi,
      /\b((from|calling from|contacting you (from|on behalf of)) (your|the) (bank|telco|provider|the manpower|the tax)|your (bank|telco|provider)('?s)? (fraud|risk|security|support|billing)|official (notice|reminder|billing page|portal|page)|manpower authority|the authorities)\b/gi,
    ],
  },
  brandMention: {
    label: 'Brand reference',
    color: 'primary',
    weight: 5,
    technique: 'Authority',
    contextual: true, // "I ordered from Amazon" in normal chat must not score
    explain: {
      why: 'Names a trusted company or figure (Amazon, PayPal, Apple, a boss or principal) to borrow its credibility.',
      use: 'A familiar brand lowers your guard; impersonation works because the name does the persuading.',
      respond: 'Contact the company or person through a channel you already know, never through the one that messaged you.',
    },
    patterns: [
      /\b(amazon|paypal|apple|microsoft|google|netflix|windows)\b/gi,
      /\b(your (teacher|principal|employer|manager|boss|ceo)|the (principal|ceo|headmaster))\b/gi,
    ],
  },
})
