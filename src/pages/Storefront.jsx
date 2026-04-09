import { useMemo } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Link } from 'react-router-dom'
import useStorefrontStore from '../store/useStorefrontStore'
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

/* ─── sub-components ─── */
function ProductCard({ product, index, theme, contextLabel }) {
  return (
    <motion.div
      layout
      layoutId={`product-${product.id}-${contextLabel}`}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 340, damping: 28, delay: index * 0.03 }}
      className="sf-card"
      style={{ '--card-accent': theme.accent, '--card-glow': theme.glow }}
    >
      <div className="sf-card-emoji">{product.emoji}</div>
      <div className="sf-card-body">
        <h3 className="sf-card-name">{product.name}</h3>
        <p className="sf-card-desc">{product.desc}</p>
        <div className="sf-card-footer">
          <span className="sf-card-price" style={{ color: theme.accentLight }}>
            ${product.price.toFixed(2)}
          </span>
          <div className="sf-card-tags">
            {product.tags.slice(0, 3).map((t) => (
              <span key={t} className="sf-tag">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function FeedColumn({ title, products: list, theme, contextLabel, subtitle }) {
  return (
    <div className="sf-feed">
      <div className="sf-feed-header">
        <h2 className="sf-feed-title">{title}</h2>
        {subtitle && <p className="sf-feed-sub">{subtitle}</p>}
      </div>
      <LayoutGroup id={contextLabel}>
        <motion.div className="sf-grid" layout>
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                theme={theme}
                contextLabel={contextLabel}
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

  /* adaptive (context-ranked) feed */
  const rankedProducts = useMemo(() => {
    return [...products].sort((a, b) => scoreProduct(b, context) - scoreProduct(a, context))
  }, [context])

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
            onChange={(e) => setHour(Number(e.target.value))}
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
      <div className={`sf-feeds ${compareMode ? 'sf-feeds--split' : ''}`}>
        <FeedColumn
          title={compareMode ? '🎯 ContextIQ Feed' : copy.cta}
          subtitle={compareMode ? 'Ranked by your current context' : undefined}
          products={rankedProducts}
          theme={theme}
          contextLabel="adaptive"
        />
        {compareMode && (
          <FeedColumn
            title="📋 Generic Baseline"
            subtitle="Alphabetical, no personalization"
            products={genericProducts}
            theme={genericTheme}
            contextLabel="generic"
          />
        )}
      </div>
    </div>
  )
}
