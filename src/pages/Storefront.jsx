import { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Link } from 'react-router-dom'
import useStorefrontStore from '../store/useStorefrontStore'
import useDashboardStore from '../store/useDashboardStore'
import products from '../data/products'

/* ─── helpers ─── */
function formatHour(h) {
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12} ${suffix}`
}

/** Score a product by how many of its tags match the current context signals. */
function scoreProduct(product, ctx) {
  const signals = [ctx.period, ctx.location, ctx.mood]
  return product.tags.reduce((s, t) => s + (signals.includes(t) ? 1 : 0), 0)
}

/** Pick the product with the LOWEST score for the current context — the most "wrong" pick. */
function pickWrongProduct(rankedProducts, ctx) {
  let worst = rankedProducts[rankedProducts.length - 1]
  let worstScore = scoreProduct(worst, ctx)
  // Walk backwards for the lowest-scoring product
  for (let i = rankedProducts.length - 2; i >= 0; i--) {
    const s = scoreProduct(rankedProducts[i], ctx)
    if (s < worstScore) {
      worstScore = s
      worst = rankedProducts[i]
      if (worstScore === 0) break // can't do worse
    }
  }
  return worst
}

/* ─── sub-components ─── */
function ProductCard({ product, index, theme, contextLabel, isWrong, onCorrect, isRetraining }) {
  return (
    <motion.div
      layout
      layoutId={`product-${product.id}-${contextLabel}`}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, y: -30, transition: { duration: 0.45, ease: 'easeIn' } }}
      transition={{ type: 'spring', stiffness: 340, damping: 28, delay: index * 0.03 }}
      className={`sf-card ${isWrong ? 'sf-card--wrong' : ''}`}
      style={{ '--card-accent': theme.accent, '--card-glow': theme.glow }}
    >
      {/* Wrong product badge */}
      {isWrong && (
        <motion.div
          className="sf-wrong-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.3 }}
        >
          <span className="sf-wrong-badge-icon">⚠️</span>
          <span className="sf-wrong-badge-text">AI Pick</span>
        </motion.div>
      )}

      <div className="sf-card-emoji">{product.emoji}</div>
      <div className="sf-card-body">
        <h3 className="sf-card-name">{product.name}</h3>
        <p className="sf-card-desc">{product.desc}</p>
        <div className="sf-card-footer">
          <span className="sf-card-price" style={{ color: theme.accentLight }}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <div className="sf-card-tags">
            {product.tags.slice(0, 3).map((t) => (
              <span key={t} className="sf-tag">{t}</span>
            ))}
          </div>
        </div>

        {/* "That's wrong" button */}
        {isWrong && !isRetraining && (
          <motion.button
            className="sf-wrong-btn"
            onClick={onCorrect}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="sf-wrong-btn-icon">✕</span>
            That's wrong
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

/* ─── Retraining overlay ─── */
function RetrainingOverlay({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="sf-retrain-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="sf-retrain-card"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Spinning neural network icon */}
            <div className="sf-retrain-spinner">
              <motion.div
                className="sf-retrain-ring sf-retrain-ring--1"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="sf-retrain-ring sf-retrain-ring--2"
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="sf-retrain-ring sf-retrain-ring--3"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              <span className="sf-retrain-brain">🧠</span>
            </div>

            <motion.h3
              className="sf-retrain-title"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Retraining model…
            </motion.h3>

            {/* Animated progress dots */}
            <div className="sf-retrain-dots">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="sf-retrain-dot"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>

            {/* Fake log lines */}
            <div className="sf-retrain-log">
              {[
                'Adjusting context weights…',
                'Recalculating relevance scores…',
                'Updating product rankings…',
              ].map((line, i) => (
                <motion.p
                  key={i}
                  className="sf-retrain-log-line"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.35 }}
                >
                  <span className="sf-retrain-check">✓</span> {line}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Toast notification ─── */
function Toast({ show, message, points }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="sf-toast"
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <span className="sf-toast-icon">✨</span>
          <div className="sf-toast-body">
            <span className="sf-toast-msg">{message}</span>
            {points && <span className="sf-toast-pts">+{points} pts</span>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function FeedColumn({ title, products: list, theme, contextLabel, subtitle, gridClass, wrongProductId, onCorrect, isRetraining }) {
  return (
    <div className="sf-feed">
      <div className="sf-feed-header">
        <h2 className="sf-feed-title">{title}</h2>
        {subtitle && <p className="sf-feed-sub">{subtitle}</p>}
      </div>
      <LayoutGroup id={contextLabel}>
        <motion.div className={`sf-grid ${gridClass || ''}`} layout>
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                theme={theme}
                contextLabel={contextLabel}
                isWrong={p.id === wrongProductId}
                onCorrect={onCorrect}
                isRetraining={isRetraining}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </div>
  )
}

/* ═══════════════════════════════════════════ */
/*               STOREFRONT PAGE              */
/* ═══════════════════════════════════════════ */
export default function Storefront() {
  const {
    simulatedHour, context, theme, copy, compareMode,
    setHour, toggleCompare,
  } = useStorefrontStore()

  const addPoints = useDashboardStore((s) => s.addPoints)

  /* ── "Correct the AI" state machine ── */
  const [correctionState, setCorrectionState] = useState('idle') // idle | retraining | corrected
  const [showToast, setShowToast] = useState(false)

  /* adaptive (context-ranked) feed */
  const rankedProducts = useMemo(() => {
    return [...products].sort((a, b) => scoreProduct(b, context) - scoreProduct(a, context))
  }, [context])

  /* The deliberately wrong product — lowest score for current context */
  const wrongProduct = useMemo(() => pickWrongProduct(rankedProducts, context), [rankedProducts, context])

  /* The feed with the wrong product injected at position 0 (only if not yet corrected) */
  const displayProducts = useMemo(() => {
    if (correctionState === 'corrected') return rankedProducts

    // Remove the wrong product from its natural position, then place it at index 0
    const withoutWrong = rankedProducts.filter((p) => p.id !== wrongProduct.id)
    return [wrongProduct, ...withoutWrong]
  }, [rankedProducts, wrongProduct, correctionState])

  /* Handle "That's wrong" click */
  const handleCorrect = useCallback(() => {
    setCorrectionState('retraining')

    // Phase 1: Show retraining overlay for 1.8s
    setTimeout(() => {
      setCorrectionState('corrected')
      addPoints(20)

      // Phase 2: Show toast
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }, 1800)
  }, [addPoints])

  /* Reset correction when context changes (slider moved) */
  const handleSetHour = useCallback(
    (hour) => {
      setHour(hour)
      setCorrectionState('idle')
      setShowToast(false)
    },
    [setHour]
  )

  /* generic (alphabetical) feed */
  const genericProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  /* default theme for generic column */
  const genericTheme = {
    accent: '#64748b',
    accentLight: '#94a3b8',
    glow: 'rgba(100,116,139,0.2)',
    bg: '#0b0f1a',
  }

  return (
    <div className="sf-root" style={{ '--sf-accent': theme.accent, '--sf-accent-light': theme.accentLight, '--sf-glow': theme.glow, '--sf-bg': theme.bg }}>
      {/* ambient blobs */}
      <div className="sf-blob sf-blob--1" style={{ background: `radial-gradient(circle, ${theme.glow}, transparent 70%)` }} />
      <div className="sf-blob sf-blob--2" style={{ background: `radial-gradient(circle, ${theme.glow}, transparent 70%)` }} />

      {/* ── top bar ── */}
      <header className="sf-topbar">
        <Link to="/dashboard" className="sf-back">← Dashboard</Link>
        <Link to="/metrics" className="sf-back">View Metrics →</Link>
        <span className="sf-logo">ContextIQ <span className="sf-logo-sub">Storefront</span></span>
        <div className="sf-context-pills">
          <span className="sf-pill">{context.periodIcon} {context.periodLabel}</span>
          <span className="sf-pill">{context.locationIcon} {context.location}</span>
          <span className="sf-pill">{context.moodIcon} {context.mood}</span>
        </div>
      </header>

      {/* ── adaptive headline ── */}
      <motion.section
        className="sf-hero"
        key={context.period}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="sf-headline" style={{ color: theme.accentLight }}>{copy.headline}</h1>
        <p className="sf-subline">{copy.sub}</p>
      </motion.section>

      {/* ── controls bar ── */}
      <div className="sf-controls">
        {/* time slider */}
        <div className="sf-slider-wrap">
          <label className="sf-slider-label">
            <span>Time Simulator</span>
            <strong style={{ color: theme.accentLight }}>{formatHour(simulatedHour)}</strong>
          </label>
          <input
            type="range"
            min={0}
            max={23}
            value={simulatedHour}
            onChange={(e) => handleSetHour(Number(e.target.value))}
            className="sf-slider"
            style={{ '--slider-accent': theme.accent }}
          />
          <div className="sf-slider-ticks">
            <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span>
          </div>
        </div>

        {/* compare toggle */}
        <button className="sf-compare-btn" onClick={toggleCompare}>
          {compareMode ? '✕  Close comparison' : '⚡  Compare vs Baseline'}
        </button>
      </div>

      {/* ── product feeds ── */}
      <div className="sf-feeds">
        <FeedColumn
          title={compareMode ? '🎯 ContextIQ Feed' : copy.cta}
          subtitle={compareMode ? 'Ranked by your current context' : undefined}
          products={displayProducts}
          theme={theme}
          contextLabel="adaptive"
          gridClass={compareMode ? 'sf-grid--compare' : ''}
          wrongProductId={correctionState === 'idle' ? wrongProduct.id : null}
          onCorrect={handleCorrect}
          isRetraining={correctionState === 'retraining'}
        />
        {compareMode && (
          <>
            <div className="sf-compare-divider">
              <span className="sf-compare-divider-label">vs Generic Baseline</span>
            </div>
            <FeedColumn
              title="📋 Generic Baseline"
              subtitle="Alphabetical, no personalization"
              products={genericProducts}
              theme={genericTheme}
              contextLabel="generic"
              gridClass="sf-grid--compare"
            />
          </>
        )}
      </div>

      {/* ── Retraining overlay ── */}
      <RetrainingOverlay show={correctionState === 'retraining'} />

      {/* ── Success toast ── */}
      <Toast show={showToast} message="AI updated!" points={20} />
    </div>
  )
}
