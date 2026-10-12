/* Aggregates every rule set. Adding a new analyzer = add a rule file here. */
import urgency from './urgency.rules'
import authority from './authority.rules'
import financial from './financial.rules'
import threats from './threats.rules'
import credentials from './credentials.rules'
import emotional from './emotional.rules'
import secrecy from './secrecy.rules'
import links from './links.rules'
import scam from './scam.rules'
import sg from './sg.rules'
import grooming from './grooming.rules'
import singlish from './singlish.rules'

export const RULE_SETS = [
  scam,
  sg,
  grooming,
  urgency,
  authority,
  financial,
  threats,
  credentials,
  emotional,
  secrecy,
  links,
  singlish,
]

/* Flat category map (key -> category) used for highlighting and tooltips. */
export const ALL_CATEGORIES = Object.fromEntries(
  RULE_SETS.flatMap((set) => Object.entries(set.categories)),
)

export { COMBINATIONS } from './combinations'
export {
  RECOMMENDATION_RULES,
  SAFE_RECOMMENDATIONS,
  ESCALATION_RECOMMENDATION,
} from './recommendations'
