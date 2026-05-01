import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth }  from '../context/AuthContext'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout }       = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const isActive = (to) => location.pathname === to

  const links = [
    { to:'/about',   label:'About' },
    { to:'/contact', label:'Contact' },
    { to:'/blog',    label:'Blog' },
  ]

  return (
    <>
      <nav>
        <div className="nav-inner">
          <Link to="/" className="logo">Techvoto</Link>

          <ul className="nav-links">
            {links.map(l => (
              <li key={l.to}>
                <Link to={l.to} className={isActive(l.to) ? 'active' : ''}>{l.label}</Link>
              </li>
            ))}
          </ul>

          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>

            {user ? (
              <>
                <Link to="/lms"   className="btn btn-outline btn-sm">Dashboard</Link>
                <button className="btn btn-ghost btn-sm" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login"  className="btn btn-ghost btn-sm">Log In</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}

            <button className="hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
        <Link to="/"          onClick={() => setMobileOpen(false)}>Home</Link>
        <Link to="/about"     onClick={() => setMobileOpen(false)}>About</Link>
        <Link to="/blog"      onClick={() => setMobileOpen(false)}>Blog</Link>
        <Link to="/contact"   onClick={() => setMobileOpen(false)}>Contact</Link>
        {user ? (
          <>
            <Link to="/lms" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            <button onClick={() => { logout(); setMobileOpen(false) }}
              style={{display:'block',padding:'14px 20px',background:'none',border:'none',
                      color:'var(--text-muted)',cursor:'pointer',textAlign:'left',width:'100%',
                      borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"  onClick={() => setMobileOpen(false)}>Log In</Link>
            <Link to="/signup" onClick={() => setMobileOpen(false)}>Sign Up Free</Link>
          </>
        )}
      </div>
    </>
  )
}
