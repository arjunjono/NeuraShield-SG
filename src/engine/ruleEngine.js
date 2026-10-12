/* ---------------------------------------------------------------------------
   Compatibility shim.
   The rule engine now lives in src/lib (modular analyzers + rule files +
   master detectionEngine). This file re-exports the same names the UI has
   always imported, so no component needed to change.
--------------------------------------------------------------------------- */
export {
  analyzeConversation,
  parseConversation,
  CATEGORIES,
  HIGHLIGHT_COLORS,
} from '../lib/detectionEngine'
