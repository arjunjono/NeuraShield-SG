import { motion } from 'framer-motion'
import { useCountUp } from '../../hooks/useCountUp'

const LEVEL_TONE = { LOW: 'success', MEDIUM: 'warning', HIGH: 'danger' }

/* Circular gauge. The arc sweeps and the number counts up together,
   coloured by risk level through the theme's semantic tokens. */
export default function RiskGauge({ score, level, size = 230 }) {
  const t = LEVEL_TONE[level]
  const color = `rgb(var(--c-${t}))`
  const r = 92
  const C = 2 * Math.PI * r
  const [ref, n] = useCountUp(score, { duration: 1600 })

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 220 220" width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx="110" cy="110" r={r} fill="none" style={{ stroke: 'rgb(var(--c-fg) / 0.07)' }} strokeWidth="14" />
        <motion.circle
          cx="110"
          cy="110"
          r={r}
          fill="none"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - score / 100) }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ stroke: color, filter: `drop-shadow(0 0 10px rgb(var(--c-${t}) / 0.45))` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-6xl font-extrabold text-white tabular-nums" aria-label={`Risk score ${score} out of 100`}>
          {n}
        </span>
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-1 rounded-full px-3 py-1 text-xs font-bold tracking-widest"
          style={{
            color: `rgb(var(--c-${t}-ink))`,
            background: `rgb(var(--c-${t}) / 0.14)`,
            border: `1px solid rgb(var(--c-${t}) / 0.35)`,
          }}
        >
          {level}
        </motion.span>
      </div>
    </div>
  )
}
