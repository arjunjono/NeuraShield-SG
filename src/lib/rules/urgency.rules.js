import { defineRules } from './helpers'

export default defineRules('urgency', 'Urgency Analyzer', {
  urgency: {
    label: 'Urgency',
    color: 'warning',
    weight: 10,
    technique: 'Pressure',
    explain: {
      why: 'Creates artificial time pressure so you act before you can think or verify.',
      use: 'Scammers know that a real deadline is their best weapon against careful judgement: rushed people skip verification.',
      respond: 'Slow down deliberately. Anything legitimate will still be true in an hour.',
    },
    patterns: [
      /\b(immediately|urgent(ly)?|right now|act now|asap|hurry|respond now|don'?t (wait|delay)|time.?sensitive|before it'?s too late|before your account closes)\b/gi,
      /\b(within (\d+|thirty|one|an?) (minutes?|hours?)|today only|expires? (today|soon|tonight|in \d+)|last chance|final (notice|warning)|deadline is (tonight|today))\b/gi,
    ],
  },
  scarcity: {
    label: 'Scarcity',
    color: 'warning',
    weight: 9,
    technique: 'Scarcity',
    explain: {
      why: 'Manufactures fear of missing out: limited spots, expiring prizes, exclusive windows.',
      use: 'FOMO short-circuits judgement; if you believe the offer vanishes, you stop asking whether it is real.',
      respond: 'Real opportunities survive scrutiny. Treat "only a few left" as a reason to look closer, not to rush.',
    },
    patterns: [
      /\b(only \d+ (left|spots?|slots?|remaining|prizes? remaining)|limited (time|offer|spots?|window)|exclusive (offer|deal|opportunity|access)|one.?time (offer|deal))\b/gi,
      /\b(you('| ha)ve (won|been (chosen|selected))|selected (winner|customer|as one of)|lock in your spot)\b/gi,
      /\b(many (people|buyers) (are )?(asking|interested|waiting)|(must|need to|have to) (be )?(fast|quick)|first come,? first serve(d)?|spots are limited|limited (slots|spots|places))\b/gi,
    ],
  },
})
