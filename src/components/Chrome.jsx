import { motion } from 'framer-motion'
import { ShieldCheck, Sun, Moon } from 'lucide-react'
import { Logo, LogoMark, Wordmark } from '../brand/Logo'

const links = [
  { id: 'home', label: 'Home' },
  { id: 'analyzer', label: 'Analyzer' },
  { id: 'vision', label: 'Roadmap' },
]

function ThemeToggle({ theme, onToggle }) {
  const light = theme === 'light'
  return (
    <button
      onClick={onToggle}
      aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}
      title={light ? 'Dark mode' : 'Light mode'}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
    >
      <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.25 }}>
        {light ? <Moon size={17} /> : <Sun size={17} />}
      </motion.span>
    </button>
  )
}

export function Navbar({ page, onNavigate, theme, onToggleTheme }) {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 inset-x-0 z-50 no-print"
    >
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <nav className="glass card-sheen flex h-14 items-center justify-between gap-1 rounded-2xl bg-ink/70 px-2.5 min-[360px]:gap-2 min-[360px]:px-3 sm:px-5">
          <button onClick={() => onNavigate('home')} className="flex shrink-0 items-center gap-2.5" aria-label="NeuraShield SG home">
            <LogoMark size={26} />
            {/* The wordmark is hidden on phones so the links and theme toggle fit */}
            <span className="hidden sm:inline-flex">
              <Wordmark />
            </span>
          </button>

          <div className="flex items-center gap-0.5 min-[360px]:gap-1">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => onNavigate(l.id)}
                className={`relative rounded-lg px-1.5 py-1.5 text-[13px] transition-colors min-[360px]:px-2 min-[360px]:text-sm sm:px-3 ${
                  page === l.id ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {page === l.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-white/[0.07] border border-white/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden md:flex items-center gap-1.5 text-xs text-zinc-500">
              <ShieldCheck size={14} className="text-success" /> Runs on your device
            </span>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </nav>
      </div>
    </motion.header>
  )
}

export function Footer({ onNavigate }) {
  return (
    <footer className="relative z-10 mt-24 border-t border-white/5 no-print">
      <div className="mx-auto max-w-6xl px-4 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-2">
          <Logo size={24} />
          <p className="text-xs text-zinc-500 max-w-sm text-center sm:text-left">
            Conversation safety for Singapore. Every analysis runs in your browser, and no message
            is sent to a server.
          </p>
        </div>
        <div className="flex flex-col items-center gap-1 text-xs text-zinc-500 sm:items-end">
          <button onClick={() => onNavigate('vision')} className="text-sm text-zinc-400 hover:text-white transition-colors">
            Roadmap and test results
          </button>
          <span>Samsung Solve for Tomorrow 2026, Trust, Security and Privacy</span>
        </div>
      </div>
      <div className="pb-6 text-center text-[11px] text-zinc-600">
        Scam in progress? Call the ScamShield Helpline at 1799. In an emergency, call 999.
      </div>
    </footer>
  )
}
