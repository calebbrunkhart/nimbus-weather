const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

export async function searchCities(query) {
  const res = await fetch(
    `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("City search failed");
  return res.json();
}

export async function getCurrentWeather(lat, lon) {
  const res = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
  );
  if (!res.ok) throw new Error("Weather fetch failed");
  return res.json();
}

export async function getForecast(lat, lon) {
  const res = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
  );
  if (!res.ok) throw new Error("Forecast fetch failed");
  return res.json();
}

export function getWeatherIcon(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Group 5-day/3-hour forecast into daily summaries
export function groupForecastByDay(forecastList) {
  const days = {};
  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    if (!days[dayKey]) {
      days[dayKey] = { items: [], dayKey, date };
    }
    days[dayKey].items.push(item);
  });

  return Object.values(days).map(({ dayKey, date, items }) => {
    const temps = items.map((i) => i.main.temp);
    const icons = items.map((i) => i.weather[0].icon);
    // pick midday icon or most common
    const noonItem = items.find((i) => {
      const h = new Date(i.dt * 1000).getHours();
      return h >= 11 && h <= 14;
    }) || items[Math.floor(items.length / 2)];

    return {
      dayKey,
      date,
      high: Math.round(Math.max(...temps)),
      low: Math.round(Math.min(...temps)),
      icon: noonItem.weather[0].icon,
      description: noonItem.weather[0].description,
      humidity: Math.round(items.reduce((a, b) => a + b.main.humidity, 0) / items.length),
      windSpeed: Math.round(noonItem.wind.speed),
    };
  });
}

export function getWeatherGradient(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return "storm";
  if (weatherId >= 300 && weatherId < 600) return "rain";
  if (weatherId >= 600 && weatherId < 700) return "snow";
  if (weatherId >= 700 && weatherId < 800) return "fog";
  if (weatherId === 800) return "clear";
  if (weatherId > 800) return "cloudy";
  return "clear";
}
