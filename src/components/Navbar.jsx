import { NavLink } from 'react-router-dom'
import useDashboardStore from '../store/useDashboardStore'

const links = [
  { to: '/onboarding', label: 'Onboarding' },
  { to: '/dashboard',  label: 'Dashboard' },
  { to: '/storefront', label: 'Storefront' },
  { to: '/metrics',    label: 'Metrics' },
]

export default function Navbar() {
  const { contextPoints, privacyScore } = useDashboardStore()

  return (
    <nav className="gnav">
      {/* logo */}
      <NavLink to="/dashboard" className="gnav-logo">
        <span className="gnav-logo-icon">◆</span> ContextIQ
      </NavLink>

      {/* page links */}
      <div className="gnav-links">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `gnav-link ${isActive ? 'gnav-link--active' : ''}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>

      {/* metrics */}
      <div className="gnav-stats">
        <div className="gnav-stat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>{contextPoints.toLocaleString()}</span>
        </div>
        <div className="gnav-stat gnav-stat--privacy">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>{privacyScore}%</span>
        </div>
      </div>
    </nav>
  )
}
