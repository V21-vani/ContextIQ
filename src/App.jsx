import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import useContextIQStore    from '@/store/useContextIQStore'
import useContextEngine     from '@/hooks/useContextEngine'
import useConsentSync       from '@/hooks/useConsentSync'
import useRecommendations   from '@/hooks/useRecommendations'

import OnboardingScreen     from '@/screens/OnboardingScreen'
import DashboardScreen      from '@/screens/DashboardScreen'
import StorefrontScreen     from '@/screens/StorefrontScreen'
import ImpactScreen         from '@/screens/ImpactScreen'

// ─── Loading screen ────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen gap-6"
      style={{ background: 'var(--bg-warm, #F0F9FF)' }}
    >
      {/* Pulsing logo mark */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
        style={{ background: 'var(--gradient, linear-gradient(135deg,#0EA5E9,#38BDF8))' }}
      >
        🧠
      </motion.div>

      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">ContextIQ</p>
        <p className="text-sm text-gray-400 mt-1">Reading your context…</p>
      </div>

      {/* Animated progress bar */}
      <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'var(--accent, #0EA5E9)' }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}

// ─── Route guard ──────────────────────────────────────────────────────────

/**
 * Redirects based on onboarding completion:
 *  - Not complete + any route  → '/'
 *  - Complete + '/'            → '/dashboard'
 */
function GuardedRoutes({ onboardingComplete }) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          onboardingComplete
            ? <Navigate to="/dashboard" replace />
            : <OnboardingScreen />
        }
      />
      <Route
        path="/dashboard"
        element={
          onboardingComplete
            ? <DashboardScreen />
            : <Navigate to="/" replace />
        }
      />
      <Route
        path="/store"
        element={
          onboardingComplete
            ? <StorefrontScreen />
            : <Navigate to="/" replace />
        }
      />
      <Route
        path="/impact"
        element={
          onboardingComplete
            ? <ImpactScreen />
            : <Navigate to="/" replace />
        }
      />
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// ─── App root ──────────────────────────────────────────────────────────────

export default function App() {
  // 1. Context engine — starts collecting signals immediately
  const { isReady } = useContextEngine()

  // 2. Consent sync — hydrates store from localStorage on mount
  useConsentSync()

  // 3. AI recommendations — fires once context.timeOfDay is available
  useRecommendations()

  // 4. Theme token — apply data-theme to <html> whenever timeOfDay changes
  const timeOfDay         = useContextIQStore((s) => s.context.timeOfDay)
  const onboardingComplete = useContextIQStore((s) => s.user.onboardingComplete)

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      timeOfDay || 'morning'
    )
  }, [timeOfDay])

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {!isReady ? (
          <LoadingScreen key="loading" />
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col min-h-screen"
          >
            <GuardedRoutes onboardingComplete={onboardingComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </BrowserRouter>
  )
}
