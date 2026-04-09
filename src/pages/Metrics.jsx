import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'

/* ─── animated counter ─── */
function Counter({ from, to, duration = 1.6, suffix = '%', prefix = '', active }) {
  const [val, setVal] = useState(from)
  useEffect(() => {
    if (!active) { setVal(from); return }
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / (duration * 1000), 1)
      const ease = 1 - Math.pow(1 - p, 4)
      setVal(Math.round(from + (to - from) * ease))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, from, to, duration])
  return <>{prefix}{val}{suffix}</>
}

/* ─── single metric card ─── */
function MetricCard({ metric, index, revealed }) {
  return (
    <motion.div
      className="mx-card"
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      animate={revealed ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ type: 'spring', stiffness: 200, damping: 22, delay: index * 0.22 }}
    >
      {/* before */}
      <div className="mx-before">
        <p className="mx-phase-label">Before</p>
        <p className="mx-phase-value mx-phase-value--before">
          {metric.beforePrefix}{metric.before}{metric.suffix}
        </p>
      </div>

      {/* arrow */}
      <div className="mx-arrow">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
        </svg>
      </div>

      {/* after (animated) */}
      <div className="mx-after">
        <p className="mx-phase-label">After ContextIQ</p>
        <p className={`mx-phase-value mx-phase-value--after mx-phase-value--${metric.color}`}>
          <Counter
            from={metric.before}
            to={metric.after}
            duration={1.8}
            suffix={metric.suffix}
            prefix={metric.afterPrefix ?? ''}
            active={revealed}
          />
        </p>
      </div>

      {/* bottom label  */}
      <div className="mx-card-footer">
        <span className={`mx-badge mx-badge--${metric.color}`}>{metric.badge}</span>
        <h3 className="mx-card-title">{metric.title}</h3>
        <p className="mx-card-desc">{metric.desc}</p>
      </div>
    </motion.div>
  )
}

/* ─── data ─── */
const metrics = [
  {
    title: 'Irrelevant Recommendations',
    desc: 'Noise in the feed dropped dramatically with context-aware ranking.',
    before: 67,
    after: 18,
    suffix: '%',
    beforePrefix: '',
    afterPrefix: '',
    badge: '↓ 73% reduction',
    color: 'red',
  },
  {
    title: 'Engagement Lift',
    desc: 'Users interact more when content matches their real-time context.',
    before: 0,
    after: 41,
    suffix: '%',
    beforePrefix: '+',
    afterPrefix: '+',
    badge: '↑ 41 pp lift',
    color: 'green',
  },
  {
    title: 'Privacy Score',
    desc: 'Zero third-party tracking. All signals stay on-device.',
    before: 94,
    after: 94,
    suffix: '%',
    beforePrefix: '',
    afterPrefix: '',
    badge: '🛡️ Maintained',
    color: 'teal',
  },
]

/* ═══════════════════════════════════════════ */
/*               METRICS PAGE                 */
/* ═══════════════════════════════════════════ */
export default function Metrics() {
  const [revealed, setRevealed] = useState(false)
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.35 })

  /* auto-reveal on scroll OR manual button */
  useEffect(() => {
    if (inView && !revealed) setRevealed(true)
  }, [inView, revealed])

  const handleReveal = useCallback(() => setRevealed(true), [])

  return (
    <div className="mx-root">
      {/* background effects */}
      <div className="mx-glow mx-glow--1" />
      <div className="mx-glow mx-glow--2" />

      {/* nav */}
      <nav className="mx-nav">
        <Link to="/storefront" className="mx-nav-link">← Storefront</Link>
        <Link to="/dashboard" className="mx-nav-link">Dashboard</Link>
      </nav>

      {/* hero */}
      <motion.header
        className="mx-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <p className="mx-eyebrow">The Results</p>
        <h1 className="mx-title">Context changes<br /><span className="mx-title-accent">everything.</span></h1>
        <p className="mx-subtitle">
          Side-by-side impact of ContextIQ's adaptive engine —<br />
          fewer irrelevant items, higher engagement, zero privacy cost.
        </p>

        {!revealed && (
          <motion.button
            className="mx-reveal-btn"
            onClick={handleReveal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Reveal metrics ✦
          </motion.button>
        )}
      </motion.header>

      {/* metrics cards */}
      <section className="mx-cards" ref={sectionRef}>
        {metrics.map((m, i) => (
          <MetricCard key={m.title} metric={m} index={i} revealed={revealed} />
        ))}
      </section>

      {/* closing line */}
      <motion.footer
        className="mx-closing"
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <p className="mx-closing-text">
          Built with on-device signals. No cookies. No tracking pixels.<br />
          <span className="mx-closing-highlight">Privacy-first personalisation.</span>
        </p>
      </motion.footer>
    </div>
  )
}
