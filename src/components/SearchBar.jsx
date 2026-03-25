import { useState, useRef, useEffect } from 'react'
import { searchCities } from '../utils/weather'

export default function SearchBar({ onSelect, placeholder = "Search city..." }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleChange(e) {
    const val = e.target.value
    setQuery(val)
    clearTimeout(timeoutRef.current)
    if (val.length < 2) { setResults([]); setOpen(false); return }
    timeoutRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchCities(val)
        setResults(data)
        setOpen(data.length > 0)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)
  }

  function handleSelect(city) {
    setQuery(`${city.name}, ${city.country}`)
    setOpen(false)
    onSelect(city)
  }

  return (
    <div className="search-wrap" ref={wrapRef}>
      <span className="search-icon">🔍</span>
      <input
        className="search-input"
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        onFocus={() => results.length > 0 && setOpen(true)}
        autoComplete="off"
      />
      {open && results.length > 0 && (
        <div className="search-results">
          {results.map((city, i) => (
            <div
              key={i}
              className="search-result-item"
              onMouseDown={() => handleSelect(city)}
            >
              <div>
                <div className="search-result-name">{city.name}</div>
                <div className="search-result-region">
                  {[city.state, city.country].filter(Boolean).join(', ')}
                </div>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>→</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
