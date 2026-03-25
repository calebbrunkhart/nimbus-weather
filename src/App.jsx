import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Forecast from './pages/Forecast'
import Favorites from './pages/Favorites'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const { user, signIn, signOut, loading } = useAuth()

  return (
    <div className="app-shell">
      <div className="app-bg" />
      <div className="noise" />

      <nav className="nav">
        <NavLink to="/" className="nav-logo">
          <span className="nav-logo-dot" />
          Nimbus
        </NavLink>
        <ul className="nav-links">
          <li><NavLink to="/" end>Weather</NavLink></li>
          <li><NavLink to="/forecast">Forecast</NavLink></li>
          <li><NavLink to="/favorites">Favorites</NavLink></li>
        </ul>

        <div style={{ marginLeft: 'auto' }}>
          {loading ? null : user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={user.photoURL}
                alt={user.displayName}
                style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid var(--border-active)' }}
              />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {user.displayName?.split(' ')[0]}
              </span>
              <button className="btn btn-ghost" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }} onClick={signOut}>
                Sign out
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }} onClick={signIn}>
              <span>G</span> Sign in with Google
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/favorites" element={<Favorites user={user} />} />
      </Routes>

      <div className="resolution-note">Best viewed on desktop</div>
    </div>
  )
}
