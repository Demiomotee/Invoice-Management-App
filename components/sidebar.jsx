import { useTheme } from '../context/ThemeContext'
import './Sidebar.css'

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="10" cy="10" r="4" fill="#858BB2"/>
    <path d="M10 1V3M10 17V19M1 10H3M17 10H19M3.22 3.22L4.64 4.64M15.36 15.36L16.78 16.78M16.78 3.22L15.36 4.64M4.64 15.36L3.22 16.78" stroke="#858BB2" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M9.14 1.07C5.05 1.62 1.9 5.1 1.9 9.33c0 4.6 3.73 8.33 8.33 8.33 3.84 0 7.08-2.6 8.07-6.16-.8.26-1.65.4-2.54.4-4.6 0-8.33-3.73-8.33-8.33 0-.17 0-.34.01-.5z" fill="#858BB2"/>
  </svg>
)

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="sidebar" role="navigation" aria-label="Main navigation">
      <div className="sidebar-logo" aria-label="Invoice App">
        <div className="logo-shape">
          <svg width="28" height="30" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0 0h28v26l-14 4L0 26V0z" fill="#7C5DFA"/>
            <path d="M0 14l14 4 14-4" fill="#9277FF" opacity="0.7"/>
          </svg>
        </div>
      </div>

      <div className="sidebar-actions">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        <div className="sidebar-divider" role="separator" />

        <div className="avatar" aria-label="User profile">
          <span aria-hidden="true">AB</span>
        </div>
      </div>
    </nav>
  )
}
