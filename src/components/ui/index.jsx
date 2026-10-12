import { motion } from 'framer-motion'

/* ---------------------------------------------------------------------------
   Design system primitives
   Every page composes these: one source of truth for radii, borders,
   shadows and motion so the whole product feels like one hand made it.
--------------------------------------------------------------------------- */

const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium ' +
  'transition-colors duration-200 focus-visible:outline-primary ' +
  'disabled:opacity-50 disabled:pointer-events-none select-none'

const btnSizes = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px]',
}

const btnVariants = {
  primary:
    'text-onbrand bg-brand-gradient shadow-glow hover:brightness-110 ' +
    'border border-primary/40',
  secondary:
    'text-zinc-100 glass hover:bg-white/[0.07] border border-white/10',
  ghost: 'text-zinc-300 hover:text-white hover:bg-white/[0.05]',
  danger: 'text-onbrand bg-danger hover:brightness-110 border border-danger/40',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`${btnBase} ${btnSizes[size]} ${btnVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function Card({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`glass card-sheen rounded-2xl shadow-card print-card ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

const badgeTones = {
  neutral: 'bg-white/5 text-zinc-300 border-white/10',
  primary: 'bg-primary-soft text-primary-ink border-primary/30',
  accent: 'bg-accent-soft text-accent-ink border-accent/30',
  success: 'bg-success-soft text-success-ink border-success/30',
  warning: 'bg-warning-soft text-warning-ink border-warning/30',
  danger: 'bg-danger-soft text-danger-ink border-danger/30',
  cyan: 'bg-cyan-400/10 text-cyan-ink border-cyan-400/30',
  yellow: 'bg-yellow-400/10 text-yellow-ink border-yellow-400/30',
}

export function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${badgeTones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

const alertTones = {
  info: { ring: 'border-primary/30', dot: 'bg-primary', text: 'text-primary-ink' },
  success: { ring: 'border-success/30', dot: 'bg-success', text: 'text-success-ink' },
  warning: { ring: 'border-warning/30', dot: 'bg-warning', text: 'text-warning-ink' },
  danger: { ring: 'border-danger/30', dot: 'bg-danger', text: 'text-danger-ink' },
}

export function Alert({ title, children, tone = 'info', icon: Icon }) {
  const t = alertTones[tone]
  return (
    <div className={`glass rounded-xl border ${t.ring} p-4 flex gap-3`}>
      {Icon ? (
        <Icon size={18} className={`${t.text} mt-0.5 shrink-0`} />
      ) : (
        <span className={`mt-1.5 h-2 w-2 rounded-full ${t.dot} shrink-0`} />
      )}
      <div>
        {title && <p className={`text-sm font-semibold ${t.text}`}>{title}</p>}
        {children && <p className="text-sm text-zinc-400 mt-0.5">{children}</p>}
      </div>
    </div>
  )
}

/* Section eyebrow + heading, used identically on every page */
export function SectionHeading({ eyebrow, title, sub, center = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`max-w-2xl ${center ? 'mx-auto text-center' : ''} mb-12`}
    >
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold text-primary-ink">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
        {title}
      </h2>
      {sub && <p className="mt-4 text-zinc-400 leading-relaxed">{sub}</p>}
    </motion.div>
  )
}

/* Shared fade-up reveal wrapper for scroll-triggered sections */
export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
