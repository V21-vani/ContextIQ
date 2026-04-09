import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import useDashboardStore from '../store/useDashboardStore'
import { getFormattedTime, getGreeting } from '../utils/contextEngine'

/* ─── animated number counter ─── */
function AnimatedNumber({ value, duration = 1.2 }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const end = value
    const startTime = performance.now()
    const step = (now) => {
      const elapsed = Math.min((now - startTime) / (duration * 1000), 1)
      const ease = 1 - Math.pow(1 - elapsed, 3)          // easeOutCubic
      setDisplay(Math.round(start + (end - start) * ease))
      if (elapsed < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value, duration])
  return <>{display.toLocaleString()}</>
}

/* ─── ring gauge for privacy score ─── */
function PrivacyRing({ score }) {
  const radius = 54
  const stroke = 7
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color =
    score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--accent-light)' : '#fd7998'
  const glow =
    score >= 80 ? 'var(--green-glow)' : score >= 50 ? 'var(--accent-glow)' : 'rgba(253,121,152,0.3)'

  return (
    <div className="privacy-ring-wrapper">
      <svg width="128" height="128" viewBox="0 0 128 128">
        {/* track */}
        <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        {/* fill */}
        <motion.circle
          cx="64" cy="64" r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${glow})`, transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <div className="privacy-ring-label">
        <span className="privacy-ring-value" style={{ color }}>
          <AnimatedNumber value={score} duration={1.4} />%
        </span>
        <span className="privacy-ring-caption">Privacy</span>
      </div>
    </div>
  )
}

/* ─── signal badge (consented / inferred) ─── */
function SignalBadge({ source }) {
  const isConsented = source === 'consented'
  return (
    <span className={`signal-badge ${isConsented ? 'signal-badge--consented' : 'signal-badge--inferred'}`}>
      {isConsented ? '✓ Consented' : '⚡ Inferred'}
    </span>
  )
}

/* ─── stagger container ─── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
}

/* ══════════════════════════════════════════════ */
/*                   DASHBOARD                    */
/* ══════════════════════════════════════════════ */
export default function Dashboard() {
  const {
    timeOfDay, location, mood,
    privacyScore, contextPoints, activeStreak,
    signalMeta, refreshContext,
  } = useDashboardStore()

  const [clock, setClock] = useState(getFormattedTime())

  /* live clock tick */
  useEffect(() => {
    const id = setInterval(() => {
      setClock(getFormattedTime())
      refreshContext()
    }, 30_000) // refresh every 30 s
    return () => clearInterval(id)
  }, [refreshContext])

  const greeting = getGreeting()

  return (
    <div className="dash">
      {/* bg blobs */}
      <div className="onboarding-blob onboarding-blob--1" />
      <div className="onboarding-blob onboarding-blob--2" />
      <div className="onboarding-blob onboarding-blob--3" />

      {/* ── header ── */}
      <header className="dash-header">
        <div>
          <motion.h1
            className="dash-greeting"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {greeting} <span className="dash-wave">👋</span>
          </motion.h1>
          <motion.p
            className="dash-clock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {clock} · <span className="gradient-text">ContextIQ</span>
          </motion.p>
        </div>
        <PrivacyRing score={privacyScore} />
      </header>

      {/* ── context signals row ── */}
      <motion.section className="dash-signals" variants={stagger} initial="hidden" animate="show">
        {/* time of day */}
        <motion.div className="signal-card" variants={fadeUp} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
          <div className="signal-top">
            <span className="signal-icon">{timeOfDay.icon}</span>
            <SignalBadge source={signalMeta.timeOfDay.source} />
          </div>
          <h3 className="signal-value">{timeOfDay.label}</h3>
          <p className="signal-label">Time of Day</p>
          <p className="signal-detail">{signalMeta.timeOfDay.detail}</p>
        </motion.div>

        {/* location */}
        <motion.div className="signal-card" variants={fadeUp} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
          <div className="signal-top">
            <span className="signal-icon">{location.icon}</span>
            <SignalBadge source={signalMeta.location.source} />
          </div>
          <h3 className="signal-value">{location.label}</h3>
          <p className="signal-label">Location</p>
          <p className="signal-detail">{signalMeta.location.detail}</p>
        </motion.div>

        {/* mood */}
        <motion.div className="signal-card" variants={fadeUp} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
          <div className="signal-top">
            <span className="signal-icon">{mood.icon}</span>
            <SignalBadge source={signalMeta.mood.source} />
          </div>
          <h3 className="signal-value">{mood.label}</h3>
          <p className="signal-label">Mood</p>
          <p className="signal-detail">{signalMeta.mood.detail}</p>
        </motion.div>
      </motion.section>

      {/* ── metrics row ── */}
      <motion.section className="dash-metrics" variants={stagger} initial="hidden" animate="show">
        {/* context points */}
        <motion.div className="metric-card metric-card--points" variants={fadeUp} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
          <div className="metric-icon-wrap metric-icon-wrap--purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="metric-info">
            <p className="metric-label">Context Points</p>
            <p className="metric-value metric-value--purple">
              <AnimatedNumber value={contextPoints} />
            </p>
          </div>
          <motion.div
            className="metric-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: Math.min(contextPoints / 2000, 1) }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ background: 'linear-gradient(90deg, var(--accent), #8b5cf6)', transformOrigin: 'left' }}
          />
        </motion.div>

        {/* active streak */}
        <motion.div className="metric-card metric-card--streak" variants={fadeUp} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
          <div className="metric-icon-wrap metric-icon-wrap--orange">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div className="metric-info">
            <p className="metric-label">Active Streak</p>
            <p className="metric-value metric-value--orange">
              <AnimatedNumber value={activeStreak} /> days
            </p>
          </div>
          <motion.div
            className="metric-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: Math.min(activeStreak / 30, 1) }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.15 }}
            style={{ background: 'linear-gradient(90deg, #f9a826, #fd7998)', transformOrigin: 'left' }}
          />
        </motion.div>

        {/* privacy score numeric */}
        <motion.div className="metric-card metric-card--privacy" variants={fadeUp} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
          <div className="metric-icon-wrap metric-icon-wrap--green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="metric-info">
            <p className="metric-label">Privacy Score</p>
            <p className="metric-value metric-value--green">
              <AnimatedNumber value={privacyScore} />%
            </p>
          </div>
          <motion.div
            className="metric-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: privacyScore / 100 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            style={{ background: 'linear-gradient(90deg, var(--green), #55efc4)', transformOrigin: 'left' }}
          />
        </motion.div>
      </motion.section>

      {/* ── nav to storefront ── */}
      <motion.div
        className="dash-nav-row"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Link to="/storefront" className="dash-storefront-link">
          🛍️  Open Adaptive Storefront →
        </Link>
      </motion.div>
    </div>
  )
}
