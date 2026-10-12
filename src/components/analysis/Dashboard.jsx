import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Fingerprint,
  TrendingUp,
  Lightbulb,
  Copy,
  Check,
  FileDown,
  MessageSquareText,
  ShieldAlert,
  ShieldCheck,
  Siren,
} from 'lucide-react'
import { Card, Badge, Button } from '../ui'
import { HIGHLIGHT_COLORS } from '../../engine/ruleEngine'
import { useCountUp } from '../../hooks/useCountUp'
import RiskGauge from './RiskGauge'
import ConversationViewer from './ConversationViewer'

function MiniStat({ label, value, suffix = '%' }) {
  const [ref, v] = useCountUp(value)
  return (
    <div ref={ref} className="glass rounded-xl p-4 text-center">
      <p className="font-display text-2xl font-bold text-white tabular-nums">
        {v}
        {suffix}
      </p>
      <p className="mt-0.5 text-xs text-zinc-500">{label}</p>
    </div>
  )
}

function SectionCard({ icon: Icon, title, children, className = '' }) {
  return (
    <Card hover={false} className={`p-6 ${className}`}>
      <div className="mb-4 flex items-center gap-2.5">
        <Icon size={17} className="text-primary-ink" />
        <h3 className="font-display font-semibold text-white">{title}</h3>
      </div>
      {children}
    </Card>
  )
}

/* Animated cumulative risk timeline */
function RiskTimeline({ timeline }) {
  if (timeline.length < 2)
    return <p className="text-sm text-zinc-500">Not enough messages to plot a trend.</p>

  const W = 560
  const H = 150
  const pad = 10
  const pts = timeline.map((v, i) => [
    pad + (i / (timeline.length - 1)) * (W - pad * 2),
    H - pad - (v / 100) * (H - pad * 2),
  ])
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')
  const area = `${path} L${pts[pts.length - 1][0]},${H - pad} L${pts[0][0]},${H - pad} Z`

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <linearGradient id="tl-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" style={{ stopColor: 'rgb(var(--c-warning))' }} />
            <stop offset="1" style={{ stopColor: 'rgb(var(--c-primary))' }} />
          </linearGradient>
          <linearGradient id="tl-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: 'rgb(var(--c-primary))', stopOpacity: 0.28 }} />
            <stop offset="1" style={{ stopColor: 'rgb(var(--c-primary))', stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        {[25, 50, 75].map((g) => (
          <line
            key={g}
            x1={pad}
            x2={W - pad}
            y1={H - pad - (g / 100) * (H - pad * 2)}
            y2={H - pad - (g / 100) * (H - pad * 2)}
            style={{ stroke: 'rgb(var(--c-fg) / 0.07)' }}
          />
        ))}
        <motion.path
          d={area}
          fill="url(#tl-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="url(#tl-line)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        />
        {pts.map((p, i) => (
          <motion.circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r="4"
            style={{ fill: 'rgb(var(--c-bg))', stroke: 'rgb(var(--c-primary))' }}
            strokeWidth="2.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.35 + (i / pts.length) * 1.2, type: 'spring', stiffness: 300 }}
          />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-zinc-500">
        <span>Message 1</span>
        <span>Risk over the conversation</span>
        <span>Message {timeline.length}</span>
      </div>
    </div>
  )
}

/* The headline answer: is this chat safe, a scam, or grooming? A grooming
   verdict carries the safeguarding flag and always tells the young person
   to involve a trusted adult, separate from the numeric score. */
const VERDICTS = {
  safe: {
    tone: 'success',
    icon: ShieldCheck,
    title: 'No manipulation pattern found',
    body: 'Nothing in this chat matches the scam or grooming patterns NeuraShield SG checks for. Run it again if money, codes, secrecy, or a meet-up come up later.',
  },
  scam: {
    tone: 'warning',
    icon: ShieldAlert,
    title: 'This looks like a scam',
    body: 'Do not send money, codes, passwords, or personal details. Check with the real organisation through its official app or hotline, or call the ScamShield Helpline at 1799.',
  },
  grooming: {
    tone: 'danger',
    icon: Siren,
    title: 'Grooming warning signs',
    body: 'Stop replying and do not meet this person or send anything. Tell a parent, teacher, or school counsellor now. Help123 (1800 612 3123) gives free advice on online harms. In an emergency, call 999.',
  },
}

function Verdict({ result }) {
  const v = VERDICTS[result.category]
  const scamHigh = result.category === 'scam' && result.level === 'HIGH'
  const tone = scamHigh ? 'danger' : v.tone
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      role={result.category === 'safe' ? 'status' : 'alert'}
      className="rounded-2xl border p-5 sm:p-6 flex gap-4"
      style={{
        background: `rgb(var(--c-${tone}) / 0.1)`,
        borderColor: `rgb(var(--c-${tone}) / 0.4)`,
      }}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ background: `rgb(var(--c-${tone}))` }}
      >
        <v.icon size={21} className="text-onbrand" />
      </span>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-lg font-bold text-white">{v.title}</h2>
          {result.safeguarding && <Badge tone="danger">Safeguarding flag</Badge>}
        </div>
        <p className="mt-1 text-sm leading-relaxed text-zinc-300">{v.body}</p>
      </div>
    </motion.div>
  )
}

export default function Dashboard({ result }) {
  const [copied, setCopied] = useState(false)

  const copyReport = async () => {
    const lines = [
      `NeuraShield SG analysis report`,
      `Verdict: ${VERDICTS[result.category].title}${result.safeguarding ? ' (safeguarding flag)' : ''}`,
      `Risk score: ${result.riskScore}/100 (${result.level})`,
      `Manipulation score: ${result.manipulationScore}/100`,
      `Confidence: ${result.confidence}%`,
      ``,
      `Detected signals: ${result.signals.map((s) => `${s.label} x${s.count}`).join(', ') || 'none'}`,
      `Techniques: ${result.techniques.join(', ') || 'none'}`,
      ...(result.ignored?.length
        ? [`Recognised and not counted: ${result.ignored.map((x) => `"${x.phrase}" (${x.reason})`).join('; ')}`]
        : []),
      ``,
      `Recommendations:`,
      ...result.recommendations.map((r) => `- ${r.title}: ${r.body}`),
      ``,
      `Analyzed entirely on-device. No messages were uploaded.`,
    ]
    const text = lines.join('\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Older browsers, or a page opened from a file: fall back to a hidden textarea.
      const ta = Object.assign(document.createElement('textarea'), { value: text })
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="space-y-5"
    >
      <Verdict result={result} />

      {/* Score header */}
      <Card hover={false} className="p-6 sm:p-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center">
          <RiskGauge score={result.riskScore} level={result.level} />
          <div className="flex-1 w-full">
            <h2 className="font-display text-xl font-bold text-white text-center lg:text-left">
              Risk score
            </h2>
            <p className="mt-1 text-sm text-zinc-400 text-center lg:text-left">
              Weighted across {result.messages.length} {result.messages.length === 1 ? 'message' : 'messages'} and twelve analyzers, computed in your browser.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniStat label="Manipulation" value={result.manipulationScore} suffix="" />
              <MiniStat label="Confidence" value={result.confidence} />
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start no-print">
              <Button variant="secondary" size="sm" onClick={copyReport}>
                {copied ? <Check size={15} className="text-success" /> : <Copy size={15} />}
                {copied ? 'Copied' : 'Copy analysis'}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => window.print()}>
                <FileDown size={15} /> Export report as PDF
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Detected signals */}
        <SectionCard icon={Activity} title="Detected signals">
          {result.signals.length ? (
            <ul className="space-y-2.5">
              {result.signals.map((s, i) => {
                const c = HIGHLIGHT_COLORS[s.color]
                return (
                  <motion.li
                    key={s.key}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3.5 py-2.5"
                  >
                    <span className="flex items-center gap-2.5 text-sm text-zinc-200">
                      <span className="h-2 w-2 rounded-full" style={{ background: c.border }} />
                      {s.label}
                    </span>
                    <Badge tone={s.color}>×{s.count}</Badge>
                  </motion.li>
                )
              })}
            </ul>
          ) : (
            <div className="rounded-xl border border-success/20 bg-success-soft p-4 text-sm text-success-ink">
              No manipulation signals found.
            </div>
          )}
          {result.ignored?.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold text-zinc-400">Recognised and not counted</p>
              <ul className="mt-2 space-y-2">
                {result.ignored.map((x) => (
                  <li key={x.phrase} className="rounded-xl border border-success/20 bg-success-soft px-3.5 py-2.5">
                    <p className="text-sm text-zinc-200">&ldquo;{x.phrase}&rdquo;</p>
                    <p className="mt-0.5 text-xs text-success-ink">Read as {x.reason}.</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </SectionCard>

        {/* Manipulation techniques */}
        <SectionCard icon={Fingerprint} title="Manipulation techniques">
          {result.techniques.length ? (
            <div className="flex flex-wrap gap-2">
              {result.techniques.map((t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 300 }}
                >
                  <Badge tone="accent" className="text-sm px-3.5 py-1.5">
                    {t}
                  </Badge>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              No psychological pressure techniques were used in this conversation.
            </p>
          )}
          {result.combinations.length > 0 && (
            <div className="mt-5 space-y-2">
              <p className="text-xs font-semibold text-zinc-400">Signals that appeared together</p>
              {result.combinations.map((c) => (
                <div key={c.id} className="rounded-xl border border-white/5 bg-white/[0.03] px-3.5 py-2.5">
                  <p className="flex items-center justify-between gap-2 text-sm text-zinc-200">
                    {c.label}
                    <span className="text-xs tabular-nums text-primary-ink">+{c.bonus}</span>
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{c.explain}</p>
                </div>
              ))}
            </div>
          )}
          <p className="mt-4 text-xs leading-relaxed text-zinc-500">
            Techniques are inferred from the pattern of signals. A deadline plus a threat, for
            example, means pressure through fear rather than a real emergency.
          </p>
        </SectionCard>
      </div>

      {/* Timeline */}
      <SectionCard icon={TrendingUp} title="Risk timeline">
        <RiskTimeline timeline={result.timeline} />
      </SectionCard>

      {/* Conversation */}
      <SectionCard icon={MessageSquareText} title="Conversation">
        <p className="mb-4 -mt-1 text-xs text-zinc-500">
          Hover a highlighted phrase to see why it was flagged.
        </p>
        <ConversationViewer messages={result.messages} />
      </SectionCard>

      {/* Recommendations */}
      <SectionCard icon={Lightbulb} title="Recommendations">
        <div className="grid gap-3 sm:grid-cols-2">
          {result.recommendations.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="rounded-xl border border-white/5 bg-white/[0.03] p-4"
            >
              <p className="text-sm font-semibold text-white">{r.title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-zinc-400">{r.body}</p>
            </motion.div>
          ))}
        </div>
      </SectionCard>
    </motion.div>
  )
}
