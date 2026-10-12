/* ---------------------------------------------------------------------------
   Analyzer registry
   Twelve rule-driven analyzers plus the composite ManipulationAnalyzer.
   The engine iterates this list; adding an analyzer here is the only change
   needed to extend detection.
--------------------------------------------------------------------------- */
import { BaseAnalyzer } from './BaseAnalyzer'
import { ManipulationAnalyzer } from './ManipulationAnalyzer'
import scam from '../rules/scam.rules'
import sg from '../rules/sg.rules'
import grooming from '../rules/grooming.rules'
import urgency from '../rules/urgency.rules'
import authority from '../rules/authority.rules'
import financial from '../rules/financial.rules'
import threats from '../rules/threats.rules'
import credentials from '../rules/credentials.rules'
import emotional from '../rules/emotional.rules'
import secrecy from '../rules/secrecy.rules'
import links from '../rules/links.rules'
import singlish from '../rules/singlish.rules'

export const ScamAnalyzer = new BaseAnalyzer(scam)
export const SgAnalyzer = new BaseAnalyzer(sg)
export const GroomingAnalyzer = new BaseAnalyzer(grooming)
export const UrgencyAnalyzer = new BaseAnalyzer(urgency)
export const AuthorityAnalyzer = new BaseAnalyzer(authority)
export const FinancialAnalyzer = new BaseAnalyzer(financial)
export const ThreatAnalyzer = new BaseAnalyzer(threats)
export const CredentialAnalyzer = new BaseAnalyzer(credentials)
export const EmotionalAnalyzer = new BaseAnalyzer(emotional)
export const SecrecyAnalyzer = new BaseAnalyzer(secrecy)
export const LinkAnalyzer = new BaseAnalyzer(links)
export const SinglishAnalyzer = new BaseAnalyzer(singlish)

/** Pattern analyzers, run against raw text. */
export const TEXT_ANALYZERS = [
  ScamAnalyzer,
  SgAnalyzer,
  GroomingAnalyzer,
  UrgencyAnalyzer,
  AuthorityAnalyzer,
  FinancialAnalyzer,
  ThreatAnalyzer,
  CredentialAnalyzer,
  EmotionalAnalyzer,
  SecrecyAnalyzer,
  LinkAnalyzer,
  SinglishAnalyzer,
]

/** Composite analyzer, run against the other analyzers' reports. */
export const manipulationAnalyzer = new ManipulationAnalyzer()
