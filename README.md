# 🌤 Nimbus Weather

A beautiful, desktop-first weather app built with React + Vite. Search any city, view current conditions and 5-day forecasts, and save your favorite locations — powered by OpenWeatherMap and Firebase Firestore.

> **Best viewed on desktop** (1024px+)

## Live Demo

🔗 [Hosted on Vercel](#) — _update this link after deployment_

## Features

- 🔍 **City Search** — instant autocomplete via OpenWeatherMap Geocoding API
- 🌡 **Current Weather** — temp, feels like, humidity, wind, pressure, visibility, sunrise/sunset
- 📅 **5-Day Forecast** — daily high/low, conditions, and humidity
- ★ **Favorites** — save locations to Firebase Firestore, persisted by browser session
- 🎨 **Atmospheric design** — dark glassmorphism aesthetic with Syne + DM Sans typography

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Weather API | OpenWeatherMap (Current + Forecast + Geocoding) |
| Database | Firebase Firestore |
| Hosting | Vercel |

## Local Development

1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/nimbus-weather.git
   cd nimbus-weather
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then fill in your own keys in `.env` (see `.env.example` for required variables).

4. **Run dev server**
   ```bash
   npm run dev
   ```

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.example` in the Vercel dashboard
4. Deploy!

## Security Note

**Never commit `.env`** — it is in `.gitignore`. Add your secret keys only as environment variables in Vercel's dashboard. The `.env.example` file shows which keys are needed without exposing values.

## Environment Variables

```
VITE_OPENWEATHER_API_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
