import {
  Thermometer,
  Droplets,
  CloudRain,
  Sun,
  Sunrise,
  Sunset,
  Wind,
  Activity,
  Zap,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format, subDays, addDays } from "date-fns";
import { WeatherCard } from "./WeatherCard";
import { WeatherChart } from "./HourlyChart";
import { cn } from "../lib/utils";
import { type WeatherData } from "../services/weatherApi";

interface ForecastViewProps {
  weatherData: WeatherData;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  unit: "C" | "F";
  setUnit: (unit: "C" | "F") => void;
  convertTemp: (c: number) => number;
  hourlyChartData: Record<string, string | number>[];
}

export function ForecastView({
  weatherData,
  selectedDate,
  setSelectedDate,
  unit,
  setUnit,
  convertTemp,
  hourlyChartData,
}: ForecastViewProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Forecast
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Precision forecast data for your coordinates
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm">
            <button
              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
              className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-4 flex items-center gap-2.5 text-sm font-bold text-gray-700">
              <CalendarIcon size={18} className="text-blue-500" />
              <span className="font-mono">
                {format(selectedDate, "MMM dd, yyyy")}
              </span>
            </div>
            <button
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-blue-600 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm">
            <button
              onClick={() => setUnit("C")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                unit === "C"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-gray-400 hover:text-gray-600",
              )}
            >
              °C
            </button>
            <button
              onClick={() => setUnit("F")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                unit === "F"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-gray-400 hover:text-gray-600",
              )}
            >
              °F
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <WeatherCard
          title="Ambient Temp"
          value={convertTemp(weatherData.current.temp).toFixed(1)}
          unit={`°${unit}`}
          icon={<Thermometer size={20} />}
          description={`Range: ${convertTemp(weatherData.daily.tempMin).toFixed(1)}° — ${convertTemp(weatherData.daily.tempMax).toFixed(1)}°`}
        />
        <WeatherCard
          title="Precipitation"
          value={weatherData.current.precipitation}
          unit="mm"
          icon={<CloudRain size={20} />}
          description={`Probability: ${weatherData.daily.precipProbMax}%`}
        />
        <WeatherCard
          title="Rel. Humidity"
          value={weatherData.current.humidity}
          unit="%"
          icon={<Droplets size={20} />}
        />
        <WeatherCard
          title="UV Intensity"
          value={weatherData.daily.uvIndex}
          icon={<Sun size={20} />}
          description={
            weatherData.daily.uvIndex > 5 ? "High Exposure" : "Low Exposure"
          }
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WeatherCard
          title="Solar Sunrise"
          value={format(new Date(weatherData.daily.sunrise), "HH:mm")}
          icon={<Sunrise size={20} />}
        />
        <WeatherCard
          title="Solar Sunset"
          value={format(new Date(weatherData.daily.sunset), "HH:mm")}
          icon={<Sunset size={20} />}
        />
        <WeatherCard
          title="Wind Velocity"
          value={weatherData.current.windSpeed}
          unit="km/h"
          icon={<Wind size={20} />}
          description={`Gusts up to ${weatherData.daily.windSpeedMax} km/h`}
        />
        <WeatherCard
          title="Air Quality"
          value={weatherData.airQuality.aqi}
          icon={<Activity size={20} />}
          description="European AQI Standard"
        />
      </div>

      {/* Air Quality Detailed Grid */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Atmospheric Composition
            </h3>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Real-time sensor data
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {[
            { label: "PM10", val: weatherData.airQuality.pm10, unit: "µg/m³" },
            {
              label: "PM2.5",
              val: weatherData.airQuality.pm2_5,
              unit: "µg/m³",
            },
            { label: "CO", val: weatherData.airQuality.co, unit: "µg/m³" },
            { label: "NO2", val: weatherData.airQuality.no2, unit: "µg/m³" },
            { label: "SO2", val: weatherData.airQuality.so2, unit: "µg/m³" },
            { label: "CO2", val: weatherData.airQuality.co2, unit: "ppm" },
          ].map((m) => (
            <div key={m.label} className="space-y-1">
              <p className="meta-label">{m.label}</p>
              <p className="text-2xl font-bold text-gray-900 data-value">
                {m.val}
              </p>
              <p className="text-[10px] text-gray-400 font-mono">{m.unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Charts Grid */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WeatherChart
          title="Temperature Gradient"
          unit={`°${unit}`}
          data={hourlyChartData}
          xKey="time"
          isHourly={true}
          yKeys={[{ key: "temp", color: "#3b82f6", name: "Temp" }]}
        />
        <WeatherChart
          title="Humidity Profile"
          unit="%"
          data={hourlyChartData}
          xKey="time"
          isHourly={true}
          yKeys={[{ key: "humidity", color: "#10b981", name: "Humidity" }]}
        />
        <WeatherChart
          title="Precipitation Volume"
          unit="mm"
          data={hourlyChartData}
          xKey="time"
          isHourly={true}
          yKeys={[
            { key: "precipitation", color: "#6366f1", name: "Precipitation" },
          ]}
        />
        <WeatherChart
          title="Atmospheric Visibility"
          unit="km"
          data={hourlyChartData}
          xKey="time"
          isHourly={true}
          yKeys={[{ key: "visibility", color: "#f59e0b", name: "Visibility" }]}
        />
        <WeatherChart
          title="Wind Velocity (10m)"
          unit="km/h"
          data={hourlyChartData}
          xKey="time"
          isHourly={true}
          yKeys={[{ key: "windSpeed", color: "#64748b", name: "Wind Speed" }]}
        />
        <WeatherChart
          title="Particulate Matter Trends"
          unit="µg/m³"
          data={hourlyChartData}
          xKey="time"
          isHourly={true}
          yKeys={[
            { key: "pm10", color: "#ef4444", name: "PM10" },
            { key: "pm2_5", color: "#ec4899", name: "PM2.5" },
          ]}
        />
      </div>
    </div>
  );
}

export default ForecastView;
