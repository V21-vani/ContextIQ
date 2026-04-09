import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Storefront from './pages/Storefront'
import Metrics from './pages/Metrics'
import './App.css'

function AppShell() {
  const { pathname } = useLocation()
  const hideNav = pathname === '/onboarding'

  return (
    <>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/storefront" element={<Storefront />} />
        <Route path="/metrics" element={<Metrics />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
