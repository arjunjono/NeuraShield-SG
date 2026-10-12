import { motion } from 'framer-motion'
import {
  ShieldCheck,
  MapPin,
  Siren,
  Image as ImageIcon,
  ScanText,
  MessagesSquare,
  Radar,
  Gauge,
  Lightbulb,
  ArrowRight,
  Landmark,
  Package,
  Briefcase,
  Wallet,
  MessageCircle,
  Users,
} from 'lucide-react'
import { Button, Card, SectionHeading, Reveal, Badge } from '../components/ui'
import { useCountUp } from '../hooks/useCountUp'

/* ------------------------------- Hero ----------------------------------- */

const features = [
  {
    icon: ShieldCheck,
    title: 'Nothing leaves your device',
    body: 'OCR and detection both run in the browser. No server, no account, no stored chats.',
    tone: 'text-success',
    className: 'lg:-rotate-2 animate-float',
  },
  {
    icon: MapPin,
    title: 'Tuned for Singapore',
    body: 'Knows DBS, Singpass, IRAS, SingPost and PayNow scam scripts, and reads Singlish.',
    tone: 'text-primary-ink',
    className: 'lg:rotate-1 animate-float-slow',
  },
  {
    icon: Siren,
    title: 'Grooming is never downplayed',
    body: 'A recognised grooming pattern is always flagged high risk, however softly it is worded.',
    tone: 'text-danger-ink',
    className: 'lg:-rotate-1 animate-float',
  },
]

function Stat({ value, suffix = '', label }) {
  const [ref, v] = useCountUp(value)
  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-3xl sm:text-4xl font-bold text-primary-ink tabular-nums">
        {v}
        {suffix}
      </p>
      <p className="mt-1 text-xs leading-snug text-zinc-500">{label}</p>
    </div>
  )
}

/* --------------------------- How it works -------------------------------- */

const pipeline = [
  { icon: ImageIcon, label: 'Screenshot or paste', desc: 'Drop in a chat screenshot from any app, or paste the messages.' },
  { icon: ScanText, label: 'Local OCR', desc: 'Tesseract.js reads the screenshot inside your browser tab.' },
  { icon: MessagesSquare, label: 'Conversation rebuilt', desc: 'Lines become messages, so the engine can follow the chat in order.' },
  { icon: Radar, label: 'Twelve analyzers', desc: 'Scam, Singapore-local, grooming, urgency, authority, money, threats, credentials, emotion, secrecy, links, and Singlish. Safety advice like "never share your OTP" is recognised and not counted.' },
  { icon: Gauge, label: 'Pattern scoring', desc: 'Combination bonuses, context gating and diminishing returns turn matches into one risk score.' },
  { icon: Lightbulb, label: 'Verdict and next steps', desc: 'Safe, scam, or grooming, with every flagged phrase explained.' },
]

/* ------------------------ What it knows locally ---------------------------- */

const local = [
  { icon: Landmark, title: 'Bank, Singpass and agency impersonation', body: 'DBS, POSB, OCBC, UOB, Singtel, StarHub, Singpass, IRAS, CPF, MOM and ICA, especially when paired with a code request or a login link.' },
  { icon: Package, title: 'Parcel and refund scripts', body: 'SingPost, Ninja Van, J&T, Shopee and Lazada "parcel on hold" and redelivery-fee messages.' },
  { icon: Briefcase, title: 'Job and task scams', body: 'Like-and-earn and review tasks that turn into "top up to unlock your commission".' },
  { icon: Wallet, title: 'PayNow and PayLah! pressure', body: 'Instant, irreversible local transfers requested by a stranger or an "official".' },
  { icon: Users, title: 'The grooming ladder', body: 'Age and school probing, a move to a private app, secrecy from parents, photo requests, and a meet-up at a void deck or MRT station.' },
  { icon: MessageCircle, title: 'Singlish, without depending on it', body: 'Lah, leh, sia and "trust me can" add confidence to a real warning sign, but never trigger a flag on their own.' },
]

export default function Landing({ onNavigate }) {
  return (
    <div className="relative z-10">
      {/* ------------------------------ HERO ------------------------------ */}
      <section className="mx-auto max-w-6xl px-4 pt-40 pb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
          <Badge tone="primary" className="mb-6">
            <MapPin size={13} /> Built for Singapore. Runs on your device.
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="mx-auto max-w-3xl font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]"
        >
          Catch the scam or the groomer while the chat is still going.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.22 }}
          className="mx-auto mt-6 max-w-xl text-lg text-zinc-400"
        >
          NeuraShield SG reads a whole conversation, not just one link or keyword, because that is how
          manipulation actually builds. It knows Singapore&rsquo;s scam scripts and Singlish, and your
          messages never leave your browser.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg" onClick={() => onNavigate('analyzer')}>
            Check a conversation <ArrowRight size={17} />
          </Button>
          <Button size="lg" variant="secondary" onClick={() => onNavigate('vision')}>
            See the test results
          </Button>
        </motion.div>

        <div className="mt-20 grid gap-5 sm:grid-cols-3 max-w-4xl mx-auto">
          {features.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.14, duration: 0.7, ease: 'easeOut' }}
            >
              <Card className={`p-6 text-left h-full ${c.className}`}>
                <c.icon size={22} className={c.tone} />
                <h3 className="mt-3 font-display font-semibold text-white">{c.title}</h3>
                <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">{c.body}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Measured results from evaluation/ (npm run eval) */}
        <Reveal delay={0.1} className="mt-20">
          <div className="glass card-sheen mx-auto max-w-3xl rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-4">
              <Stat value={87} suffix="%" label="accuracy across 100 test chats" />
              <Stat value={25} suffix="/25" label="grooming chats flagged" />
              <Stat value={0} label="false alarms on 50 normal chats" />
              <Stat value={0} label="messages uploaded" />
            </div>
            <p className="mt-6 text-xs text-zinc-500">
              Measured on our own labelled set of Singapore youth chats; a keyword blocklist scored 68% on the same set. On a separate held-out set of harder chats, including real bank OTP texts, it scored 87% with no false alarms.
            </p>
          </div>
        </Reveal>
      </section>

      {/* --------------------------- LOCAL KNOWLEDGE ------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading
          eyebrow="Singapore context"
          title="What a global filter misses"
          sub="Generic tools look for generic scams. These are the local scripts and patterns NeuraShield SG is built to recognise."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {local.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <Card className="p-6 h-full">
                <item.icon size={20} className="text-primary-ink" />
                <h3 className="mt-3 font-display font-semibold text-white">{item.title}</h3>
                <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">{item.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------- HOW IT WORKS -------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading
          eyebrow="How it works"
          title="From screenshot to verdict in six steps"
          sub="Every step runs in your browser tab. Close it, and nothing remains anywhere."
        />

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/40 via-accent/30 to-transparent lg:block"
          />
          <div className="grid gap-5 lg:grid-cols-2 lg:gap-x-16">
            {pipeline.map((step, i) => (
              <Reveal key={step.label} delay={i * 0.06} className={i % 2 ? 'lg:mt-16' : ''}>
                <Card className="p-6 flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <step.icon size={20} className="text-primary-ink" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-zinc-500">{i + 1}</span>
                      <h3 className="font-display font-semibold text-white">{step.label}</h3>
                    </div>
                    <p className="mt-1 text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.15} className="mt-16 text-center">
          <Button size="lg" onClick={() => onNavigate('analyzer')}>
            Check a conversation <ArrowRight size={17} />
          </Button>
        </Reveal>
      </section>
    </div>
  )
}
