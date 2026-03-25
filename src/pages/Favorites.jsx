import { useState, useEffect } from 'react'
import { getFavorites, removeFavorite } from '../utils/favorites'
import { getCurrentWeather, getWeatherIcon } from '../utils/weather'
import { useWeather } from '../hooks/useWeather'
import { Link, useNavigate } from 'react-router-dom'

export default function Favorites({ user }) {
  const [favorites, setFavorites] = useState([])
  const [weatherMap, setWeatherMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState(null)
  const { selectCity } = useWeather()
  const navigate = useNavigate()

  useEffect(() => {
    if (user === undefined) return // still loading auth
    if (!user) { setLoading(false); return }
    loadFavorites()
  }, [user])

  async function loadFavorites() {
    setLoading(true)
    try {
      const favs = await getFavorites(user.uid)
      setFavorites(favs)
      const results = await Promise.allSettled(
        favs.map(fav => getCurrentWeather(fav.lat, fav.lon))
      )
      const map = {}
      results.forEach((r, i) => {
        if (r.status === 'fulfilled') map[favs[i].id] = r.value
      })
      setWeatherMap(map)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove(e, favId) {
    e.stopPropagation()
    setRemoving(favId)
    try {
      await removeFavorite(favId)
      setFavorites(prev => prev.filter(f => f.id !== favId))
    } finally {
      setRemoving(null)
    }
  }

  function handleCardClick(fav) {
    selectCity({ name: fav.name, country: fav.country, state: fav.state, lat: fav.lat, lon: fav.lon })
    navigate('/')
  }

  // Not signed in
  if (!loading && !user) {
    return (
      <main className="page">
        <div className="empty-state">
          <div className="empty-state-icon">★</div>
          <div className="empty-state-title">Sign in to see your favorites</div>
          <div className="empty-state-subtitle">
            Your saved locations are tied to your Google account so they're available on any device.
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Saved Locations
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {favorites.length} {favorites.length === 1 ? 'city' : 'cities'} saved · Click any card to view full weather
          </p>
        </div>
        <Link to="/" className="btn btn-primary">+ Add Location</Link>
      </div>

      {loading ? (
        <div className="loader">
          <div className="loader-dots">
            <div className="loader-dot" /><div className="loader-dot" /><div className="loader-dot" />
          </div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">★</div>
          <div className="empty-state-title">No saved locations yet</div>
          <div className="empty-state-subtitle">
            Search for a city on the Weather page, then tap the star icon to save it here.
          </div>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Search Cities</Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((fav, i) => {
            const w = weatherMap[fav.id]
            return (
              <div
                key={fav.id}
                className="fav-card"
                onClick={() => handleCardClick(fav)}
                style={{ animation: `pageIn 0.4s ease ${i * 0.06}s both` }}
              >
                <div className="fav-card-header">
                  <div>
                    <div className="fav-city-name">{fav.name}</div>
                    <div className="fav-country">{[fav.state, fav.country].filter(Boolean).join(', ')}</div>
                  </div>
                  {w ? (
                    <div className="fav-temp">{Math.round(w.main.temp)}°</div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</div>
                  )}
                </div>
                {w && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                      <img className="fav-icon" src={getWeatherIcon(w.weather[0].icon)} alt="" />
                      <div>
                        <div style={{ textTransform: 'capitalize', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {w.weather[0].description}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Feels like {Math.round(w.main.feels_like)}°F
                        </div>
                      </div>
                    </div>
                    <div className="fav-card-footer">
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>💧 {w.main.humidity}%</span>
                        <span>💨 {Math.round(w.wind.speed)} mph</span>
                      </div>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                        onClick={(e) => handleRemove(e, fav.id)}
                        disabled={removing === fav.id}
                      >
                        {removing === fav.id ? '...' : 'Remove'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
