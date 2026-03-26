# Weather Dashboard

## A responsive React + TypeScript dashboard that displays current and historical weather + air quality using the Open-Meteo API with Geolocation API.

## UI library: Tailwind CSS + custom responsive layout

## Charts: Recharts (area charts, brush zoom, tooltip, legend)

## Icons: lucide-react

# Features

### Current location weather (geolocation fallback available)

### Current weather metrics:temperature, humidity, precipitation, wind speed / direction, air quality, hourly trends (6 charts, per-hour detail)

### Historical range trends (with date picker)

# Project Structure

```
├── README.md
├── src
│   ├── App.tsx    // Main Application Component
│   ├── components // UI components
|   |    ├── ForecastView.tsx
|   |    ├── HistoricalData.tsx
|   |    ├── HourlyChart.tsx
|   |    ├── Layout.tsx
|   |    └── WeatherCard.tsx
|   |
│   │── lib        // Utility functions
│   │── services   // API services
│   │── types      // Types definitions
│   │── index.html // HTML template
│   └── main.tsx   // Main entry point

```

# API

## Weather source: https://api.open-meteo.com/v1/forecast

## Air quality source: https://air-quality-api.open-meteo.com/v1/air-quality

# Deployment

## Netlify:
