import { useWeather } from '../hooks/useWeather'
import SearchBar from '../components/SearchBar'
import { getWeatherIcon } from '../utils/weather'

export default function Forecast() {
  const { city, current, forecast, loading, error, selectCity } = useWeather()

  return (
    <main className="page">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            5-Day Forecast
          </h1>
          {city && (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              — {city.name}, {city.country}
            </span>
          )}
        </div>
        <SearchBar onSelect={selectCity} placeholder="Change city..." />
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {loading ? (
        <div className="loader">
          <div className="loader-dots">
            <div className="loader-dot" /><div className="loader-dot" /><div className="loader-dot" />
          </div>
        </div>
      ) : forecast.length > 0 ? (
        <>
          {/* Summary row */}
          {current && (
            <div className="glass-card" style={{ padding: '1.5rem 2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <div className="stat-label">Now</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>
                  {Math.round(current.main.temp)}°F
                </div>
              </div>
              <div style={{ width: '1px', background: 'var(--border)', alignSelf: 'stretch', minHeight: 48 }} />
              <div style={{ flex: 1 }}>
                <div className="stat-label">Conditions</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem', textTransform: 'capitalize', marginTop: '0.25rem' }}>
                  {current.weather[0].description}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div>
                  <div className="stat-label">Humidity</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{current.main.humidity}%</div>
                </div>
                <div>
                  <div className="stat-label">Wind</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{Math.round(current.wind.speed)} mph</div>
                </div>
              </div>
            </div>
          )}

          {/* Day cards — vertical detailed layout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {forecast.map((day, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  padding: '1.5rem 2rem',
                  display: 'grid',
                  gridTemplateColumns: '180px 80px 1fr auto auto',
                  alignItems: 'center',
                  gap: '1.5rem',
                  animation: `pageIn 0.4s ease ${i * 0.06}s both`,
                }}
              >
                {/* Day name */}
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem' }}>
                    {i === 0 ? 'Today' : day.date.toLocaleDateString('en-US', { weekday: 'long' })}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>

                {/* Icon */}
                <img
                  src={getWeatherIcon(day.icon)}
                  alt={day.description}
                  style={{ width: 56, height: 56, filter: 'drop-shadow(0 0 8px rgba(79,158,255,0.3))' }}
                />

                {/* Description + humidity */}
                <div>
                  <div style={{ textTransform: 'capitalize', fontWeight: 500, color: 'var(--text-secondary)' }}>
                    {day.description}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    💧 {day.humidity}% humidity · 💨 {day.windSpeed} mph
                  </div>
                </div>

                {/* Temp bar */}
                <div style={{ minWidth: 120 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{day.low}°</span>
                    <span style={{ fontWeight: 700 }}>{day.high}°</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #4f9eff, #7eb8ff)',
                      borderRadius: 2,
                      width: `${Math.min(100, ((day.high - 20) / 80) * 100)}%`,
                    }} />
                  </div>
                </div>

                {/* High badge */}
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem',
                  background: 'linear-gradient(135deg, #e8f0ff, #7eb8ff)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text', minWidth: 60, textAlign: 'right'
                }}>
                  {day.high}°
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </main>
  )
}
