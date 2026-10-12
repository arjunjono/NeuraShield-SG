import { useCallback, useEffect, useState } from 'react'

/* Light / dark theme. The initial class is set by an inline script in
   index.html (before React loads) so the page never flashes the wrong theme.
   This hook keeps React in sync and persists the choice. */
const KEY = 'neurashield-sg-theme'

function current() {
  return document.documentElement.classList.contains('light') ? 'light' : 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState(current)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#FFFFFF' : '#000000')
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      /* storage unavailable: the choice simply won't persist */
    }
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), [])
  return [theme, toggle]
}
