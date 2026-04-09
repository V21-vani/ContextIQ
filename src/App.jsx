import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'

import useContextIQStore    from '@/store/useContextIQStore'
import useContextEngine     from '@/hooks/useContextEngine'
import useConsentSync       from '@/hooks/useConsentSync'
import useRecommendations   from '@/hooks/useRecommendations'

import Navbar      from './components/Navbar'
import Onboarding  from './pages/Onboarding'
import Dashboard   from './pages/Dashboard'
import Storefront  from './pages/Storefront'
import Metrics     from './pages/Metrics'
import './App.css'

// ─── Inner shell (needs useLocation, must be inside BrowserRouter) ─────────

function AppShell() {
  const { pathname } = useLocation()
  const hideNav = pathname === '/onboarding'

  return (
    <>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/storefront" element={<Storefront />} />
        <Route path="/metrics"    element={<Metrics />} />
      </Routes>
    </>
  )
}

// ─── App root ──────────────────────────────────────────────────────────────

export default function App() {
  // 1. Context engine — starts collecting signals immediately
  useContextEngine()

  // 2. Consent sync — hydrates store from localStorage on mount
  useConsentSync()

  // 3. AI recommendations — fires once context.timeOfDay is available
  useRecommendations()

  // 4. Theme token — apply data-theme to <html> whenever timeOfDay changes
  const timeOfDay = useContextIQStore((s) => s.context?.timeOfDay)

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      timeOfDay || 'morning'
    )
  }, [timeOfDay])

  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
