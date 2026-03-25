import { useState, useEffect } from 'react'
import { useWeather } from '../hooks/useWeather'
import SearchBar from '../components/SearchBar'
import { getWeatherIcon, getWeatherGradient } from '../utils/weather'
import { addFavorite, isFavorite, removeFavorite } from '../utils/favorites'
import { Link } from 'react-router-dom'

export default function Home({ user }) {
  const { city, current, forecast, loading, error, selectCity } = useWeather()
  const [favLoading, setFavLoading] = useState(false)
  const [favId, setFavId] = useState(null)
  const [toast, setToast] = useState(null)

  // Check fav status whenever city or user changes
  useEffect(() => {
    if (!city || !user) { setFavId(null); return }
    isFavorite(user.uid, city.name, city.country).then(result => {
      setFavId(result ? result.id : null)
    })
  }, [city, user])

  async function handleCitySelect(c) {
    selectCity(c)
  }

  async function toggleFavorite() {
    if (!user) { showToast('Sign in to save favorites'); return }
    if (favLoading) return
    setFavLoading(true)
    try {
      if (favId) {
        await removeFavorite(favId)
        setFavId(null)
        showToast('Removed from favorites')
      } else {
        const id = await addFavorite(user.uid, city)
        if (id) setFavId(id)
        showToast('Added to favorites ★')
      }
    } catch {
      showToast('Error updating favorites')
    } finally {
      setFavLoading(false)
    }
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const weatherCondition = current ? getWeatherGradient(current.weather[0].id) : 'clear'

  return (
    <main className="page">
      {toast && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(10,16,28,0.95)', border: '1px solid var(--border-active)',
          borderRadius: '50px', padding: '0.6rem 1.5rem', zIndex: 300,
          backdropFilter: 'blur(20px)', fontSize: '0.875rem', color: 'var(--text-primary)',
          animation: 'pageIn 0.3s ease both', boxShadow: 'var(--shadow-glow)'
        }}>
          {toast}
        </div>
      )}

      {/* Search row */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <SearchBar onSelect={handleCitySelect} placeholder="Search any city..." />
        <button
          className={`btn-icon ${favId ? 'active' : ''}`}
          onClick={toggleFavorite}
          disabled={favLoading || !current}
          title={user ? (favId ? 'Remove from favorites' : 'Add to favorites') : 'Sign in to save favorites'}
          style={{ width: 44, height: 44, fontSize: '1.2rem' }}
        >
          {favId ? '★' : '☆'}
        </button>
        <Link to="/forecast" className="btn btn-ghost" style={{ marginLeft: 'auto' }}>
          View Forecast →
        </Link>
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {loading ? (
        <div className="loader">
          <div className="loader-dots">
            <div className="loader-dot" /><div className="loader-dot" /><div className="loader-dot" />
          </div>
        </div>
      ) : current ? (
        <>
          <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '1.5rem' }}>
            <div className="weather-hero">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div className="chip">{weatherCondition.toUpperCase()}</div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{city.country}</span>
                </div>
                <div className="weather-location">{current.name}</div>
                <div className="weather-date">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="weather-temp-display" style={{ marginTop: '1.5rem' }}>
                  {Math.round(current.main.temp)}<span className="weather-unit">°F</span>
                </div>
                <div className="weather-condition">{current.weather[0].description}</div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Feels like {Math.round(current.main.feels_like)}°F
                </div>
              </div>
              <img className="weather-icon-large" src={getWeatherIcon(current.weather[0].icon)} alt={current.weather[0].description} />
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Humidity</div>
                <div className="stat-value">{current.main.humidity}<span className="stat-unit">%</span></div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Wind</div>
                <div className="stat-value">{Math.round(current.wind.speed)}<span className="stat-unit">mph</span></div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Pressure</div>
                <div className="stat-value">{current.main.pressure}<span className="stat-unit">hPa</span></div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Visibility</div>
                <div className="stat-value">{current.visibility ? Math.round(current.visibility / 1609) : '—'}<span className="stat-unit">mi</span></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div>
                <div className="stat-label">Today's High</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800 }}>
                  {Math.round(current.main.temp_max)}°
                </div>
              </div>
              <div style={{ width: '1px', background: 'var(--border)', alignSelf: 'stretch' }} />
              <div>
                <div className="stat-label">Today's Low</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                  {Math.round(current.main.temp_min)}°
                </div>
              </div>
            </div>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div>
                <div className="stat-label">Sunrise</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700 }}>
                  {new Date(current.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div style={{ width: '1px', background: 'var(--border)', alignSelf: 'stretch' }} />
              <div>
                <div className="stat-label">Sunset</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700 }}>
                  {new Date(current.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>

          {forecast.length > 0 && (
            <>
              <div className="section-header">
                <span className="section-title">5-Day Outlook</span>
                <Link to="/forecast" className="btn btn-ghost" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                  Full Forecast →
                </Link>
              </div>
              <div className="forecast-grid">
                {forecast.slice(0, 5).map((day, i) => (
                  <div className="forecast-card" key={i}>
                    <div className="forecast-day">
                      {i === 0 ? 'Today' : day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <img className="forecast-icon" src={getWeatherIcon(day.icon)} alt={day.description} />
                    <div className="forecast-temps">
                      <span className="forecast-high">{day.high}°</span>
                      <span className="forecast-low">{day.low}°</span>
                    </div>
                    <div className="forecast-desc">{day.description}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : null}
    </main>
  )
}
