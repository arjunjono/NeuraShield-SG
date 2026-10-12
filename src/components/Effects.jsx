import { motion } from 'framer-motion'
import { LogoMark, Wordmark } from '../brand/Logo'

/* Boot screen: the mark draws itself, then the app fades in underneath. */
export function LoadingScreen() {
  return (
    <motion.div
      key="loader"
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-ink"
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <LogoMark size={72} draw />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="mt-5 text-lg"
      >
        <Wordmark />
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 1.3, ease: 'easeInOut' }}
        className="mt-6 h-0.5 w-40 origin-left rounded-full bg-brand-gradient"
      />
    </motion.div>
  )
}

/* Small dependency-free confetti burst, fired when a conversation comes back
   clean. Red and white, like the flag. */
export function fireConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const canvas = document.createElement('canvas')
  Object.assign(canvas.style, { position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 70 })
  document.body.appendChild(canvas)
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')
  const light = document.documentElement.classList.contains('light')
  const colors = ['#EF3340', '#C8102E', light ? '#18181B' : '#FFFFFF', '#22C55E']
  const parts = Array.from({ length: 140 }, () => ({
    x: canvas.width / 2 + (Math.random() - 0.5) * 240,
    y: canvas.height * 0.35,
    vx: (Math.random() - 0.5) * 11,
    vy: -Math.random() * 11 - 4,
    size: Math.random() * 7 + 3,
    color: colors[(Math.random() * colors.length) | 0],
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.25,
  }))
  const t0 = performance.now()
  const tick = (now) => {
    const t = now - t0
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const p of parts) {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.28
      p.rot += p.vr
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = Math.max(0, 1 - t / 2400)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
      ctx.restore()
    }
    if (t < 2400) requestAnimationFrame(tick)
    else canvas.remove()
  }
  requestAnimationFrame(tick)
}
