import { motion } from 'framer-motion'

/* ---------------------------------------------------------------------------
   NeuraShield SG mark
   A shield whose interior is a four-node lattice, now carrying the crescent
   and five stars of the Singapore flag's canton in place of the top node.
   Colours come from CSS variables so the mark follows the active theme.
--------------------------------------------------------------------------- */

const RED = 'rgb(var(--c-primary))'
const DEEP = 'rgb(var(--c-accent))'

export function LogoMark({ size = 32, draw = false, className = '' }) {
  const shield = 'M32 4 56 13v17c0 14.5-10 24.6-24 30C18 54.6 8 44.5 8 30V13L32 4Z'
  const links = 'M32 24 22 34m10-10 10 10M22 34l10 10m10-10-10 10'
  const anim = (opts) => (draw ? opts : {})

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} role="img" aria-label="NeuraShield SG logo">
      <defs>
        <linearGradient id="ns-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: RED }} />
          <stop offset="1" style={{ stopColor: DEEP }} />
        </linearGradient>
        {/* Crescent = a disc with an offset disc cut out of it */}
        <mask id="ns-crescent">
          <circle cx="30" cy="18.5" r="5.6" fill="#fff" />
          <circle cx="32.6" cy="17.4" r="4.7" fill="#000" />
        </mask>
      </defs>
      <motion.path
        d={shield}
        stroke="url(#ns-grad)"
        strokeWidth="4.5"
        strokeLinejoin="round"
        {...anim({ initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 1.4, ease: 'easeInOut' } })}
      />
      <motion.path
        d={links}
        stroke="url(#ns-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        {...anim({ initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 1, delay: 0.7, ease: 'easeInOut' } })}
      />
      {/* Crescent: the top node of the lattice */}
      <motion.rect
        x="22"
        y="10"
        width="18"
        height="18"
        mask="url(#ns-crescent)"
        style={{ fill: RED, transformOrigin: '30px 18.5px' }}
        {...anim({ initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { delay: 0.9, type: 'spring', stiffness: 300 } })}
      />
      {[
        [22, 34, 3],
        [42, 34, 3],
        [32, 44, 3.4],
      ].map(([cx, cy, r], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          style={{ fill: i === 2 ? RED : DEEP }}
          {...anim({ initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { delay: 1.02 + i * 0.12, type: 'spring', stiffness: 300 } })}
        />
      ))}
    </svg>
  )
}

/* Wordmark: "NeuraShield" with an SG tag */
export function Wordmark({ compact = false }) {
  return (
    <span className="inline-flex items-baseline gap-2 select-none">
      <span className="font-display font-bold tracking-tight text-[1.05rem] text-white">NeuraShield</span>
      {!compact && (
        <span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-onbrand">SG</span>
      )}
    </span>
  )
}

export function Logo({ size = 30 }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <Wordmark />
    </span>
  )
}
