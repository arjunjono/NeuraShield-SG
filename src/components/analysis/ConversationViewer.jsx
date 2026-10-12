import { motion } from 'framer-motion'
import { CATEGORIES, HIGHLIGHT_COLORS } from '../../engine/ruleEngine'

/* Split a message into plain and highlighted segments from its match spans. */
function segment(text, matches) {
  const parts = []
  let cursor = 0
  for (const m of matches) {
    if (m.start > cursor) parts.push({ text: text.slice(cursor, m.start) })
    parts.push({ text: text.slice(m.start, m.end), category: m.category })
    cursor = m.end
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor) })
  return parts
}

function Highlight({ text, category }) {
  const cat = CATEGORIES[category]
  const c = HIGHLIGHT_COLORS[cat.color]
  return (
    <span className="group/hl relative inline">
      <mark
        className="rounded-[5px] px-1 py-px font-medium cursor-help transition-shadow"
        style={{
          background: c.bg,
          color: c.text,
          boxShadow: `inset 0 -1.5px 0 ${c.border}`,
        }}
        tabIndex={0}
      >
        {text}
      </mark>
      {/* Tooltip: why this phrase was flagged */}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-60 -translate-x-1/2 rounded-xl border border-white/10 bg-card p-3 text-left opacity-0 shadow-lift transition-all duration-200 group-hover/hl:opacity-100 group-hover/hl:-translate-y-1 group-focus-within/hl:opacity-100"
      >
        <span className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold" style={{ color: c.text }}>
            {cat.label}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400">
            {cat.technique}
          </span>
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-zinc-300">{cat.explain.why}</span>
        <span className="mt-1.5 block text-[11px] leading-relaxed text-zinc-500 border-t border-white/5 pt-1.5">
          <span className="font-semibold text-zinc-400">What to do: </span>
          {cat.explain.respond}
        </span>
      </span>
    </span>
  )
}

export default function ConversationViewer({ messages }) {
  return (
    <div className="space-y-3">
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.45, ease: 'easeOut' }}
          className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-[85%] sm:max-w-[75%] ${msg.isUser ? 'text-right' : 'text-left'}`}>
            <p className="mb-1 px-1 text-[11px] text-zinc-500">{msg.sender}</p>
            <div
              className={`rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
                msg.isUser
                  ? 'bg-brand-gradient text-onbrand rounded-br-md'
                  : 'glass text-zinc-200 rounded-bl-md'
              }`}
            >
              {msg.isUser
                ? msg.text
                : segment(msg.text, msg.matches).map((p, j) =>
                    p.category ? (
                      <Highlight key={j} text={p.text} category={p.category} />
                    ) : (
                      <span key={j}>{p.text}</span>
                    ),
                  )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
