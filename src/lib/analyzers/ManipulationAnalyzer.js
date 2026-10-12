/* ---------------------------------------------------------------------------
   ManipulationAnalyzer (composite)
   Rather than matching text itself, it reads the other analyzers' evidence
   and measures how heavily *psychological levers* (as opposed to plain
   requests) are being used. This mirrors how a future NLP model would sit
   on top of raw signals to infer intent.
--------------------------------------------------------------------------- */

/** How strongly each technique indicates deliberate manipulation. */
const TECHNIQUE_WEIGHTS = {
  Fear: 14,
  Pressure: 10,
  Authority: 10,
  Scarcity: 9,
  Isolation: 16,
  Guilt: 12,
  Flattery: 10,
  'False reassurance': 9,
  Greed: 8,
  Urgency: 10,
}

export class ManipulationAnalyzer {
  id = 'manipulation'
  name = 'Manipulation Analyzer'

  /** @param reports: array of per-analyzer reports from BaseAnalyzer.report() */
  report(reports, combos) {
    let points = 0
    const techniqueCounts = {}

    for (const r of reports) {
      for (const ind of r.indicators) {
        const w = TECHNIQUE_WEIGHTS[ind.technique] || 8
        // Diminishing returns per technique across the conversation
        const seen = techniqueCounts[ind.technique] || 0
        for (let i = 0; i < ind.count; i++) points += w * Math.pow(0.65, seen + i)
        techniqueCounts[ind.technique] = seen + ind.count
      }
    }
    // Confirmed combination patterns are strong evidence of orchestration
    points += combos.length * 8

    const techniques = Object.entries(techniqueCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t)

    return {
      analyzer: this.id,
      name: this.name,
      score: Math.min(99, Math.round(100 * (1 - Math.exp(-points / 45)))),
      confidence:
        techniques.length === 0
          ? 0
          : Math.min(95, 55 + techniques.length * 8 + combos.length * 5),
      indicators: techniques.map((t) => ({ key: t, label: t, count: techniqueCounts[t] })),
      matchedPhrases: [],
      explanations: combos.map((c) => ({
        indicator: c.label,
        technique: 'Combination',
        why: c.explain,
      })),
      techniques,
    }
  }
}
