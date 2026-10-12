/** @type {import('tailwindcss').Config} */

/* Every colour resolves to a CSS variable defined in src/index.css, so one
   class (text-white, bg-primary, text-zinc-400 ...) renders correctly in
   both themes: black and red in dark mode, white and red in light mode. */
const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`
const zinc = Object.fromEntries(
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((k) => [k, v(`zinc-${k}`)]),
)
const tone = (name) => ({ DEFAULT: v(name), soft: `rgb(var(--c-${name}) / 0.14)`, ink: v(`${name}-ink`) })

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        white: v('fg'),
        black: v('sunk'),
        zinc,
        onbrand: '#FFFFFF',
        ink: v('bg'),
        card: v('card'),
        edge: v('edge'),
        primary: tone('primary'),
        accent: tone('accent'),
        success: tone('success'),
        warning: tone('warning'),
        danger: tone('danger'),
        cyan: { ...Object.fromEntries([200, 400].map((k) => [k, v('cyan')])), ink: v('cyan-ink') },
        yellow: { ...Object.fromEntries([200, 400].map((k) => [k, v('yellow')])), ink: v('yellow-ink') },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: 'var(--shadow-glow)',
        card: 'var(--shadow-card)',
        lift: 'var(--shadow-lift)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(120deg, rgb(var(--c-brand-a)), rgb(var(--c-brand-b)))',
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float 11s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        'pulse-soft': 'pulseSoft 3.2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
