import { useEffect, useRef } from 'react'

/* ---------------------------------------------------------------------------
   Ambient background: a sparse mesh of drifting nodes that link when close.
   Colours are read from CSS variables every frame, so the mesh follows the
   theme toggle without re-mounting.
--------------------------------------------------------------------------- */

function readVars() {
  const cs = getComputedStyle(document.documentElement)
  return {
    node: cs.getPropertyValue('--mesh-node').trim() || '239, 51, 64',
    link: cs.getPropertyValue('--mesh-link').trim() || '255, 255, 255',
  }
}

function Mesh() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf, w, h, nodes
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      const count = Math.min(70, Math.floor((w * h) / 26000))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.4 + 0.6,
      }))
    }

    const step = () => {
      const { node, link } = readVars()
      ctx.clearRect(0, 0, w, h)
      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0 || n.x > w) n.vx *= -1
          if (n.y < 0 || n.y > h) n.vy *= -1
        }
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${node},0.45)`
        ctx.fill()
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d2 = dx * dx + dy * dy
          if (d2 < 130 * 130) {
            ctx.strokeStyle = `rgba(${link},${0.1 * (1 - d2 / (130 * 130))})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }
      if (!reduced) raf = requestAnimationFrame(step)
    }

    resize()
    step()
    const onResize = () => {
      resize()
      if (reduced) step()
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 'var(--mesh-opacity)' }}
    />
  )
}

export default function Background() {
  return (
    <>
      <div
        aria-hidden="true"
        className="fixed -top-40 -left-40 h-[34rem] w-[34rem] rounded-full pointer-events-none z-0 animate-pulse-soft"
        style={{ background: 'radial-gradient(circle, rgb(var(--c-primary) / 0.13), transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="fixed -bottom-52 -right-40 h-[38rem] w-[38rem] rounded-full pointer-events-none z-0 animate-pulse-soft"
        style={{ background: 'radial-gradient(circle, rgb(var(--c-accent) / 0.1), transparent 70%)', animationDelay: '1.6s' }}
      />
      <Mesh />
    </>
  )
}
