/* ---------------------------------------------------------------------------
   BaseAnalyzer
   One analyzer = one domain of rules. Analyzers are pure and stateless:
   text in, structured evidence out. The detection engine composes them,
   which means any analyzer can later be swapped for an on-device NLP model
   that returns the same { score, confidence, indicators, matchedPhrases,
   explanations } shape without touching the engine or UI.
--------------------------------------------------------------------------- */

export class BaseAnalyzer {
  constructor(ruleSet) {
    this.id = ruleSet.id
    this.name = ruleSet.name
    this.categories = ruleSet.categories
  }

  /** Scan one message; returns raw match spans (may overlap across analyzers). */
  analyzeMessage(text) {
    const matches = []
    for (const cat of Object.values(this.categories)) {
      for (const pattern of cat.patterns) {
        pattern.lastIndex = 0
        let m
        while ((m = pattern.exec(text)) !== null) {
          matches.push({
            analyzer: this.id,
            category: cat.key,
            start: m.index,
            end: m.index + m[0].length,
            phrase: m[0],
            contextual: cat.contextual,
          })
          if (m.index === pattern.lastIndex) pattern.lastIndex++ // zero-width safety
        }
      }
    }
    return matches
  }

  /**
   * Summarize this analyzer's evidence across the whole conversation.
   * `matches` = final (deduped, context-gated) matches belonging to this analyzer.
   */
  report(matches) {
    const counts = {}
    for (const m of matches) counts[m.category] = (counts[m.category] || 0) + 1

    // Weighted points with diminishing returns per repeated category
    let points = 0
    for (const [key, n] of Object.entries(counts)) {
      const w = this.categories[key].weight
      for (let i = 0; i < n; i++) points += w * Math.pow(0.6, i)
    }

    const indicators = Object.entries(counts).map(([key, count]) => ({
      key,
      label: this.categories[key].label,
      color: this.categories[key].color,
      technique: this.categories[key].technique,
      weight: this.categories[key].weight,
      count,
    }))

    const diversity = indicators.length
    const total = matches.length

    return {
      analyzer: this.id,
      name: this.name,
      // 0 to 100 squash of raw points; each analyzer saturates independently
      score: Math.min(99, Math.round(100 * (1 - Math.exp(-points / 30)))),
      confidence:
        total === 0 ? 0 : Math.min(95, 50 + diversity * 10 + Math.min(25, total * 5)),
      indicators,
      matchedPhrases: [...new Set(matches.map((m) => m.phrase))],
      explanations: indicators.map((i) => ({
        indicator: i.label,
        technique: i.technique,
        ...this.categories[i.key].explain,
      })),
      points, // raw points, consumed by the master engine
    }
  }
}
