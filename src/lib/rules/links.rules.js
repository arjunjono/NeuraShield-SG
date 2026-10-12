import { defineRules } from './helpers'

export default defineRules('links', 'Suspicious Link Analyzer', {
  suspiciousLink: {
    label: 'Suspicious link',
    color: 'cyan',
    weight: 12,
    technique: 'Urgency',
    explain: {
      why: 'Pushes you to click, verify, or log in through a link it provides.',
      use: 'The link leads to a credential-stealing copy of a real login page; the pressure exists to stop you inspecting it.',
      respond: 'Never log in from a link sent to you. Type the official address into your browser yourself.',
    },
    patterns: [
      /\b(click (the |this )?link( below)?|follow (the |this )?link|verify (your account )?(here|at|now at)|log ?in here|claim (here|now|your prize at))\b/gi,
      /\b(tap (the |this )?link|(the |through the |on the |via the )(payment|billing|reactivation|claims?|secure|verification|restore|login) (page|portal)( (here|below|linked|we('?ve| have)? linked))?|page (here|below|we linked)|link (is )?below|use the link)\b/gi,
      /\bhttp:\/\/\S+/gi,
    ],
  },
  shortener: {
    label: 'Link shortener',
    color: 'cyan',
    weight: 10,
    technique: 'Urgency',
    explain: {
      why: 'Uses a URL shortener (bit.ly, tinyurl, is.gd) that hides the real destination.',
      use: 'Shorteners let a malicious address masquerade as a tidy link and evade casual inspection.',
      respond: 'Treat shortened links from unknown senders as opaque boxes: do not open them.',
    },
    patterns: [/\b(bit\.ly|tinyurl\.com|is\.gd|t\.co|rb\.gy|shorturl\.at|cutt\.ly)\/\S+/gi],
  },
  lookalikeDomain: {
    label: 'Look-alike domain',
    color: 'cyan',
    weight: 15,
    technique: 'Authority',
    explain: {
      why: 'The domain mimics a real brand with extra words, hyphens, odd endings, or a raw IP address.',
      use: 'Typosquatting and "secure-verify" compounds exploit the split second in which a domain looks right.',
      respond: 'Read domains right-to-left: the part before the final dot is who really owns it.',
    },
    patterns: [
      /\b[\w-]+[-.](secure|verify|support|login|account|help|repair|claim)[-.]?[\w-]*\.(com|net|org|xyz|club|online|site|live|icu|top|buzz)\b/gi,
      /\b(secure|verify|login|support)[-.][\w-]+\.(com|net|org|xyz|club|online|site|live|icu|top|buzz)\b/gi,
      /\b[\w-]+\.(xyz|top|club|online|icu|buzz|rest|click)\b/gi,
      /\bhttps?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi,
    ],
  },
})
