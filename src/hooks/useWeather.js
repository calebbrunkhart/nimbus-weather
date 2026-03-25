import { useState, useEffect, useCallback } from 'react'
import { getCurrentWeather, getForecast, groupForecastByDay } from '../utils/weather'

const STORAGE_KEY = 'nimbus_last_city'

const DEFAULT_CITY = {
  name: 'New York',
  country: 'US',
  lat: 40.7128,
  lon: -74.0060,
}

export function useWeather() {
  const [city, setCity] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_CITY
    } catch {
      return DEFAULT_CITY
    }
  })
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWeather = useCallback(async (c) => {
    setLoading(true)
    setError(null)
    try {
      const [w, f] = await Promise.all([
        getCurrentWeather(c.lat, c.lon),
        getForecast(c.lat, c.lon),
      ])
      setCurrent(w)
      setForecast(groupForecastByDay(f.list))
    } catch (err) {
      setError('Unable to fetch weather. Check your connection.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWeather(city)
  }, [city, fetchWeather])

  function selectCity(newCity) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCity))
    setCity(newCity)
  }

  return { city, current, forecast, loading, error, selectCity }
}
