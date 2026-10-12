import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UploadCloud,
  ScanSearch,
  Sparkles,
  ImageIcon,
  Trash2,
  Lock,
} from 'lucide-react'
import { Button, Card, Badge, SectionHeading, Alert } from '../components/ui'
import { SAMPLES } from '../engine/samples'
import { analyzeConversation } from '../engine/ruleEngine'
import { fireConfetti } from '../components/Effects'
import Dashboard from '../components/analysis/Dashboard'

/* OCR status copy shown while Tesseract works */
const OCR_STAGES = [
  'Scanning screenshot…',
  'Extracting text…',
  'Almost done…',
  'OCR complete',
]

function OcrProgress({ progress, stage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="glass card-sheen rounded-2xl p-6"
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
          className="h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center"
        >
          <ScanSearch size={17} className="text-primary-ink" />
        </motion.div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{stage}</p>
          <p className="text-xs text-zinc-500">Running locally with Tesseract.js. Nothing is uploaded.</p>
        </div>
        <span className="font-mono text-sm text-zinc-300 tabular-nums">
          {Math.round(progress * 100)}%
        </span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-brand-gradient shimmer"
          animate={{ width: `${Math.max(6, progress * 100)}%` }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

export default function Analyzer() {
  const [text, setText] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [ocr, setOcr] = useState(null) // { progress, stage }
  const [ocrError, setOcrError] = useState(null)
  const [result, setResult] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const fileRef = useRef(null)
  const resultsRef = useRef(null)

  /* ---- OCR ---------------------------------------------------------- */
  const runOcr = useCallback(async (file) => {
    setResult(null)
    setOcrError(null)
    setImagePreview(URL.createObjectURL(file))
    setOcr({ progress: 0, stage: OCR_STAGES[0] })
    // Served by `npm run dev` / `npm run preview`: use the OCR engine and
    // language data bundled in public/tesseract/, so no internet is needed.
    // Opened as a local file: browsers block workers from file:// pages, so
    // fall back to Tesseract's own CDN (needs a connection the first time).
    const served = window.location.protocol.startsWith('http')
    const base = new URL('tesseract/', window.location.href).href
    const paths = served ? { workerPath: base + 'worker.min.js', corePath: base, langPath: base, gzip: true } : {}
    try {
      const Tesseract = (await import('tesseract.js')).default
      const { data } = await Tesseract.recognize(file, 'eng', {
        ...paths,
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const p = m.progress || 0
            setOcr({
              progress: p,
              stage: p < 0.4 ? OCR_STAGES[0] : p < 0.8 ? OCR_STAGES[1] : OCR_STAGES[2],
            })
          }
        },
      })
      const extracted = data.text.trim()
      setOcr({ progress: 1, stage: OCR_STAGES[3] })
      setTimeout(() => setOcr(null), 700)
      if (!extracted) {
        setOcrError('No text was found in that image. Try a sharper, uncropped screenshot, or paste the chat instead.')
        return
      }
      setText(extracted)
    } catch (err) {
      console.error('OCR failed:', err)
      setOcr(null)
      setOcrError(
        served
          ? 'Could not read text from that image. Try a sharper, uncropped screenshot, or paste the chat instead.'
          : 'Reading screenshots from this file needs an internet connection the first time. Connect to the internet, or run the app with npm run preview to read screenshots offline. Pasting the chat works offline either way.',
      )
    }
  }, [])

  const onFile = (file) => {
    if (file && file.type.startsWith('image/')) runOcr(file)
  }

  /* ---- Analysis ------------------------------------------------------ */
  const analyze = () => {
    if (!text.trim()) return
    setAnalyzing(true)
    setResult(null)
    // Brief pause so the analysis feels deliberate (and lets the UI animate)
    setTimeout(() => {
      const r = analyzeConversation(text)
      setResult(r)
      setAnalyzing(false)
      if (r.level === 'LOW' && r.riskScore < 20) fireConfetti()
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
    }, 650)
  }

  const clearAll = () => {
    setOcrError(null)
    setText('')
    setImagePreview(null)
    setResult(null)
  }

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 pt-36 pb-24">
      <SectionHeading
        eyebrow="Analyzer"
        title="Check a conversation"
        sub="Upload a chat screenshot or paste the messages. NeuraShield SG checks for Singapore scam scripts and grooming patterns, in English or Singlish, without sending anything off this device."
      />

      {/* Privacy reassurance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6 flex justify-center no-print"
      >
        <Badge tone="success">
          <Lock size={12} /> Processed on this device. Nothing is uploaded.
        </Badge>
      </motion.div>

      {/* Upload zone */}
      <Card hover={false} className="p-5 sm:p-6 no-print">
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload a chat screenshot"
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            onFile(e.dataTransfer.files?.[0])
          }}
          className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-300 ${
            dragOver
              ? 'border-primary bg-primary-soft scale-[1.01]'
              : 'border-white/10 hover:border-primary/50 hover:bg-white/[0.03]'
          }`}
        >
          <motion.div
            animate={dragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow"
          >
            <UploadCloud size={24} className="text-onbrand" />
          </motion.div>
          <p className="mt-4 font-display font-semibold text-white">
            Drop a chat screenshot here
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            or <span className="text-primary-ink">browse files</span>. PNG or JPG, read on this device with OCR
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </div>

        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3"
          >
            <img src={imagePreview} alt="Uploaded screenshot" className="h-14 w-14 rounded-lg object-cover" />
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <ImageIcon size={15} /> Screenshot read. Check the text below, and put "You:" before your own messages for the most accurate result
            </div>
          </motion.div>
        )}

        {/* Divider */}
        <div className="my-6 flex items-center gap-4 text-xs text-zinc-500">
          <span className="h-px flex-1 bg-white/5" /> or paste chat <span className="h-px flex-1 bg-white/5" />
        </div>

        {/* Paste area */}
        <label htmlFor="chat-input" className="sr-only">
          Paste conversation
        </label>
        <textarea
          id="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          placeholder={'Paste the conversation, one message per line:\n\nUnknown: Your Singpass account has been suspended...\nYou: Who is this?'}
          className="w-full resize-y rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed text-zinc-200 placeholder:text-zinc-600 focus:border-primary/60 focus:outline-none transition-colors"
        />

        {/* Sample conversations */}
        <p className="mt-5 mb-2.5 text-xs font-semibold text-zinc-500">Or try a sample</p>
        <div className="flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <motion.button
              key={s.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setText(s.text)
                setResult(null)
                setImagePreview(null)
              }}
              className="glass rounded-xl px-3.5 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/[0.07] transition-colors"
            >
              <span className="mr-1.5">{s.emoji}</span>
              {s.label}
            </motion.button>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={analyze} disabled={!text.trim() || analyzing || !!ocr}>
            <Sparkles size={17} />
            {analyzing ? 'Checking…' : 'Check conversation'}
          </Button>
          {(text || imagePreview) && (
            <Button variant="ghost" onClick={clearAll}>
              <Trash2 size={15} /> Clear
            </Button>
          )}
        </div>
      </Card>

      {/* OCR progress */}
      <AnimatePresence>{ocr && <div className="mt-5"><OcrProgress {...ocr} /></div>}</AnimatePresence>
      {ocrError && (
        <div className="mt-5" role="alert">
          <Alert tone="warning" title="Screenshot not read">
            {ocrError}
          </Alert>
        </div>
      )}

      {/* Results */}
      <div ref={resultsRef} className="mt-8 scroll-mt-28">
        <AnimatePresence mode="wait">
          {analyzing && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ repeat: Infinity, duration: 1.1 }}
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow"
              >
                <Sparkles size={20} className="text-onbrand" />
              </motion.div>
              <p className="mt-4 text-sm text-zinc-400">Running twelve analyzers…</p>
            </motion.div>
          )}
          {result && <Dashboard key="dash" result={result} />}
        </AnimatePresence>

        {/* Empty state */}
        {!result && !analyzing && !ocr && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-zinc-600"
          >
            Your result appears here: the verdict, risk score, flagged phrases, and what to do next.
          </motion.p>
        )}
      </div>
    </div>
  )
}
