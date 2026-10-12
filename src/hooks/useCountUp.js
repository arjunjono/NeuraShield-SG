import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/**
 * useCountUp: animates a number from 0 to `target` once the element
 * scrolls into view. Returns [ref, value]. Eases out for a premium feel.
 */
export function useCountUp(target, { duration = 1400, decimals = 0, start = true } = {}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView || !start) return
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3) // cubic ease-out
      setValue(+(target * eased).toFixed(decimals))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, duration, decimals, start])

  return [ref, value]
}
