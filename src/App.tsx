import { useState, useEffect, useMemo } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { subDays } from "date-fns";
import { Layout } from "./components/Layout";
import { ForecastView } from "./components/ForecastView";
import { HistoricalView } from "./components/HistoricalData";
import {
  getWeatherData,
  getHistoricalData,
  type WeatherData,
  type HistoricalData,
} from "./services/weatherApi";

// Main Application Component

export default function App() {
  const [activeTab, setActiveTab] = useState<"current" | "historical">(
    "current",
  );
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [locationName, setLocationName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Page 1 (Forecast)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<"C" | "F">("C");

  // Page 2 (Historical)
  const [historicalRange, setHistoricalRange] = useState<{
    start: Date;
    end: Date;
  }>({
    start: subDays(new Date(), 7),
    end: subDays(new Date(), 1),
  });
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(
    null,
  );
  const [histLoading, setHistLoading] = useState(false);

  // Get Location on page load
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocationName(
          `${position.coords.latitude.toFixed(2)}°, ${position.coords.longitude.toFixed(2)}°`,
        );
      },
      (err) => {
        console.error("Location Error:", err);
        setError(
          "Location access denied. Please enable GPS to see local weather.",
        );
        setLoading(false);
      },
    );
  }, []);

  // Fetch Current Weather Data when location or selected date changes
  useEffect(() => {
    if (!location) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getWeatherData(
          location.lat,
          location.lon,
          selectedDate,
        );
        setWeatherData(data);
        setError(null);
      } catch (err) {
        console.error("Weather Fetch Error:", err);
        setError("Failed to fetch weather data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [location, selectedDate]);

  // fetch historical data when location, active tab
  useEffect(() => {
    if (!location || activeTab !== "historical") return;

    const loadHistData = async () => {
      try {
        setHistLoading(true);
        const data = await getHistoricalData(
          location.lat,
          location.lon,
          historicalRange.start,
          historicalRange.end,
        );
        setHistoricalData(data);
      } catch (err) {
        console.error("Historical Fetch Error:", err);
      } finally {
        setHistLoading(false);
      }
    };

    loadHistData();
  }, [location, activeTab, historicalRange]);

  // convert temperature based on selected unit
  const convertTemp = (c: number) => {
    if (unit === "F") return (c * 9) / 5 + 32;
    return c;
  };

  // Memoized hourly data for charts
  const hourlyChartData = useMemo(() => {
    if (!weatherData) return [];
    return weatherData.hourly.time.map((time, i) => ({
      time,
      temp: convertTemp(weatherData.hourly.temp[i]),
      humidity: weatherData.hourly.humidity[i],
      precipitation: weatherData.hourly.precipitation[i],
      visibility: weatherData.hourly.visibility[i] / 1000,
      windSpeed: weatherData.hourly.windSpeed[i],
      pm10: weatherData.airQuality.hourly.pm10[i],
      pm2_5: weatherData.airQuality.hourly.pm2_5[i],
    }));
  }, [weatherData, unit]);

  // Memoized historical data for charts
  const historicalChartData = useMemo(() => {
    if (!historicalData) return [];
    return historicalData.daily.time.map((time, i) => ({
      time,
      tempMean: convertTemp(historicalData.daily.tempMean?.[i] ?? 0),
      tempMax: convertTemp(historicalData.daily.tempMax?.[i] ?? 0),
      tempMin: convertTemp(historicalData.daily.tempMin?.[i] ?? 0),
      precipSum: historicalData.daily.precipSum?.[i] ?? 0,
      windSpeedMax: historicalData.daily.windSpeedMax?.[i] ?? 0,
      windDirDominant: historicalData.daily.windDirDominant?.[i] ?? 0,
      pm10: historicalData.airQuality?.pm10?.[i] ?? 0,
      pm2_5: historicalData.airQuality?.pm2_5?.[i] ?? 0,
    }));
  }, [historicalData, unit]);

  // Loading State
  if (loading && !weatherData) {
    return (
      <div className="min-h-screen bg-[#d4ebff4f] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="animate-spin text-blue-600" size={64} />
        </div>
        <p className="text-gray-400 font-bold tracking-[0.2em] uppercase text-xs animate-pulse">
          Getting the weather reports...
        </p>
      </div>
    );
  }

  // Error State
  if (error && !weatherData) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 shadow-xl shadow-red-100">
          <AlertTriangle size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            System Error
          </h2>
          <p className="text-gray-500 max-w-sm font-medium leading-relaxed">
            {error}
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-8 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-2xl shadow-green-200 hover:bg-green-600/90 transition-all active:scale-95"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      locationName={locationName}
    >
      {activeTab === "current" && weatherData ? (
        <ForecastView
          weatherData={weatherData}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          unit={unit}
          setUnit={setUnit}
          convertTemp={convertTemp}
          hourlyChartData={hourlyChartData}
        />
      ) : (
        <HistoricalView
          historicalData={historicalData}
          historicalRange={historicalRange}
          setHistoricalRange={setHistoricalRange}
          unit={unit}
          setUnit={setUnit}
          histLoading={histLoading}
          historicalChartData={historicalChartData}
        />
      )}
    </Layout>
  );
}
