/* ---------------------------------------------------------------------------
   Rule definition helpers
   Rules are pure data. Analyzers and the engine never hard-code a keyword,
   weight, or explanation: everything lives in these files, so new rules
   can be added (or the whole layer swapped for an on-device NLP model)
   without touching the engine or the UI.
--------------------------------------------------------------------------- */

/**
 * defineRules(id, name, categories) → validated rule set for one analyzer.
 * Each category:
 *   label       human-readable name shown in the UI
 *   color       highlight tone key (see HIGHLIGHT_COLORS)
 *   weight      points per hit before diminishing returns
 *   technique   manipulation technique this signal expresses
 *   contextual  true → only counts when non-contextual signals also exist
 *               (prevents "Amazon" or "bank" in normal chat from scoring)
 *   explain     { why, use, respond }: full explainability payload
 *   patterns    array of global regexes
 */
export function defineRules(id, name, categories) {
  for (const [key, c] of Object.entries(categories)) {
    if (!c.label || !c.patterns?.length || !c.explain?.why) {
      throw new Error(`Rule category "${key}" in ${id} is incomplete`)
    }
    c.key = key
    c.analyzer = id
    c.contextual = !!c.contextual
  }
  return { id, name, categories }
}
