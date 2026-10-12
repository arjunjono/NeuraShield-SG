import { motion } from 'framer-motion'
import { MapPin, BrainCircuit, Chrome, Smartphone, Users, Lock, ListChecks, Scale, FlaskConical, Terminal } from 'lucide-react'
import { Card, SectionHeading, Reveal, Badge } from '../components/ui'

/* Measured with evaluation/eval.mjs on evaluation/dataset.json (npm run eval). */
const results = [
  ['Overall accuracy', '87%', '87 of 100 chats classified as safe, scam, or grooming'],
  ['Grooming recall', '100%', 'all 25 grooming chats flagged, each with the safeguarding flag'],
  ['False alarms', '0', 'across the 50 normal chats, including bank, PayNow and Singlish near-misses'],
  ['Scam precision', '100%', 'every chat it called a scam was one'],
  ['Scam recall', '48%', 'heavily paraphrased scams are the main gap'],
  ['vs keyword blocklist', '87% vs 68%', 'harmful-versus-safe accuracy on the same 100 chats'],
  ['Held-out stress set', '87%', '33 of 38 harder chats never used for tuning, with no false alarms'],
  ['Real OTP texts', '0 flagged', 'genuine bank, Singpass and Grab codes read as safe'],
  ['Singlish', '86%', 'accuracy on the 44 Singlish chats, against 88% on plain English'],
]

const roadmap = [
  {
    icon: MapPin,
    title: 'NeuraShield SG',
    when: 'Today',
    desc: 'Twelve rule-based analyzers with Singapore scam scripts, the grooming ladder, and Singlish awareness, running entirely in the browser.',
    now: true,
  },
  {
    icon: BrainCircuit,
    title: 'Semantic layer for paraphrased scams',
    when: 'Next',
    desc: 'A lightweight on-device model that recognises scam intent however it is worded, alongside the rule engine, which keeps its precise and explainable detection.',
  },
  {
    icon: Chrome,
    title: 'Chrome extension',
    when: 'Then',
    desc: 'Checks web chats as they happen, with the user\u2019s consent, instead of needing text to be pasted in.',
  },
  {
    icon: Smartphone,
    title: 'Background app',
    when: 'Then',
    desc: 'The same engine across messaging apps on a phone, still analysing only on the device.',
  },
  {
    icon: Users,
    title: 'Beyond students',
    when: 'Later',
    desc: 'Scam protection for elderly relatives, phishing-awareness training at work, and live teaching for community digital-literacy sessions.',
  },
]

const principles = [
  {
    icon: Lock,
    title: 'Private by construction',
    body: 'There is no server to send a chat to. If a feature would need one, it does not get built.',
  },
  {
    icon: ListChecks,
    title: 'Every flag explained',
    body: 'Each highlighted phrase shows why it was flagged and what to do. Nothing is a black-box score.',
  },
  {
    icon: Scale,
    title: 'Precision first',
    body: 'A safety tool that cries wolf gets switched off. Every rule we widened was re-tested against all 50 normal chats before it was kept.',
  },
  {
    icon: FlaskConical,
    title: 'Honest about the gap',
    body: 'Rules match wording, not meaning, so a scammer who rephrases everything can slip past. That is exactly what the semantic layer is for.',
  },
]

export default function Vision() {
  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 pt-36 pb-24">
      <SectionHeading
        eyebrow="Roadmap and results"
        title="What works today, and what comes next"
        sub="NeuraShield SG already runs end to end. These are the numbers from our own test set, and the plan for closing the gaps they show."
      />

      {/* Results */}
      <Reveal className="mb-20">
        <Card hover={false} className="p-6 sm:p-8">
          <h3 className="font-display text-xl font-bold text-white">How we tested it</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
            100 labelled conversations written to reflect Singapore youth chat: 50 normal, 25 scam and 25 grooming,
            44 of them in Singlish. Each one was run through the same engine that powers this site. A second, harder
            stress set (real OTP texts, people describing scams, teachers and parents, WhatsApp exports) checks the
            cases most likely to trip it up, with part of it held out from all tuning.
          </p>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(([label, value, note]) => (
              <div key={label} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                <dt className="text-xs text-zinc-500">{label}</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-white tabular-nums">{value}</dd>
                <dd className="mt-1 text-xs leading-relaxed text-zinc-500">{note}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 flex items-center gap-2 text-xs text-zinc-500">
            <Terminal size={14} className="text-primary-ink" />
            Reproduce with <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-zinc-300">npm run eval</code>
            and <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-zinc-300">npm run stress</code>
          </p>
        </Card>
      </Reveal>

      {/* Roadmap: a real sequence, so it is drawn as a timeline */}
      <div className="relative mb-20">
        <div
          aria-hidden="true"
          className="absolute left-[26px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-accent/50 to-transparent sm:left-1/2"
        />
        <div className="space-y-8">
          {roadmap.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.05}>
              <div className={`relative flex gap-5 sm:w-1/2 ${i % 2 ? 'sm:ml-auto sm:pl-10' : 'sm:pr-10 sm:text-right sm:flex-row-reverse'}`}>
                <div className="relative z-10 mt-1">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`flex h-[52px] w-[52px] items-center justify-center rounded-2xl border ${
                      step.now ? 'bg-brand-gradient border-primary/40 shadow-glow' : 'bg-ink glass border-white/10'
                    }`}
                  >
                    <step.icon size={20} className={step.now ? 'text-onbrand' : 'text-primary-ink'} />
                  </motion.div>
                </div>
                <Card className="flex-1 p-5">
                  <div className={`flex items-center gap-2 ${i % 2 ? '' : 'sm:justify-end'}`}>
                    <Badge tone={step.now ? 'primary' : 'neutral'}>{step.when}</Badge>
                    <h3 className="font-display font-semibold text-white">{step.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.desc}</p>
                </Card>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Principles */}
      <div className="grid gap-5 sm:grid-cols-2">
        {principles.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <Card className="p-6 h-full">
              <p.icon size={20} className="text-primary-ink" />
              <h3 className="mt-3 font-display font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.body}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
