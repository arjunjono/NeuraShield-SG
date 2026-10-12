import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Background from './components/Background'
import { Navbar, Footer } from './components/Chrome'
import { LoadingScreen } from './components/Effects'
import { useTheme } from './hooks/useTheme'
import Landing from './pages/Landing'
import Analyzer from './pages/Analyzer'
import Vision from './pages/Vision'

const pages = { home: Landing, analyzer: Analyzer, vision: Vision }

export default function App() {
  const [booting, setBooting] = useState(true)
  const [theme, toggleTheme] = useTheme()
  const [page, setPage] = useState(() => window.location.hash.replace('#', '') || 'home')

  // Boot splash: long enough for the mark to draw, short enough to respect the user
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1900)
    return () => clearTimeout(t)
  }, [])

  // Hash-based routing keeps the app a single static bundle
  useEffect(() => {
    const onHash = () => setPage(window.location.hash.replace('#', '') || 'home')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (id) => {
    window.location.hash = id === 'home' ? '' : id
    setPage(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const Page = pages[page] || Landing

  return (
    <div className="noise min-h-screen">
      <AnimatePresence>{booting && <LoadingScreen />}</AnimatePresence>

      <Background />
      <Navbar page={page} onNavigate={navigate} theme={theme} onToggleTheme={toggleTheme} />

      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Page onNavigate={navigate} />
        </motion.main>
      </AnimatePresence>

      <Footer onNavigate={navigate} />
    </div>
  )
}
