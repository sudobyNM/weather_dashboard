import { Sunrise, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { WeatherChart } from "./HourlyChart";
import { cn } from "../lib/utils";
import { type HistoricalData } from "../services/weatherApi";

interface HistoricalDataProps {
  historicalData: HistoricalData | null;
  historicalRange: { start: Date; end: Date };
  setHistoricalRange: (range: { start: Date; end: Date }) => void;
  unit: "C" | "F";
  setUnit: (unit: "C" | "F") => void;
  histLoading: boolean;
  historicalChartData: Record<string, string | number>[];
}

export function HistoricalView({
  historicalData,
  historicalRange,
  setHistoricalRange,
  unit,
  setUnit,
  histLoading,
  historicalChartData,
}: HistoricalDataProps) {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      {/* Historical Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Historical Trends
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Weather analysis over time
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm">
            <input
              type="date"
              value={format(historicalRange.start, "yyyy-MM-dd")}
              onChange={(e) =>
                setHistoricalRange({
                  ...historicalRange,
                  start: new Date(e.target.value),
                })
              }
              className="px-3 py-1.5 text-sm font-bold text-gray-700 outline-none bg-transparent font-mono"
              max={format(historicalRange.end, "yyyy-MM-dd")}
            />
            <span className="text-gray-300 mx-1 font-bold">→</span>
            <input
              type="date"
              value={format(historicalRange.end, "yyyy-MM-dd")}
              onChange={(e) =>
                setHistoricalRange({
                  ...historicalRange,
                  end: new Date(e.target.value),
                })
              }
              className="px-3 py-1.5 text-sm font-bold text-gray-700 outline-none bg-transparent font-mono"
              min={format(historicalRange.start, "yyyy-MM-dd")}
              max={format(new Date(), "yyyy-MM-dd")}
            />
          </div>

          <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm">
            <button
              onClick={() => setUnit("C")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                unit === "C"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-gray-400",
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
                  : "text-gray-400",
              )}
            >
              °F
            </button>
          </div>
        </div>
      </div>

      {histLoading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-gray-400 text-sm font-medium tracking-wide animate-pulse">
            Processing historical data...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12">
          <WeatherChart
            title="Temperature Extremes & Mean"
            unit={`°${unit}`}
            data={historicalChartData}
            xKey="time"
            isHourly={false}
            yKeys={[
              { key: "tempMax", color: "#ef4444", name: "Max Temp" },
              { key: "tempMean", color: "#3b82f6", name: "Mean Temp" },
              { key: "tempMin", color: "#10b981", name: "Min Temp" },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <WeatherChart
              title="Precipitation Accumulation"
              unit="mm"
              data={historicalChartData}
              xKey="time"
              isHourly={false}
              yKeys={[
                {
                  key: "precipSum",
                  color: "#6366f1",
                  name: "Total Precipitation",
                },
              ]}
            />
            <WeatherChart
              title="Wind Velocity Extremes"
              unit="km/h"
              data={historicalChartData}
              xKey="time"
              isHourly={false}
              yKeys={[
                {
                  key: "windSpeedMax",
                  color: "#64748b",
                  name: "Max Wind Speed",
                },
              ]}
            />

            <WeatherChart
              title="Dominant Wind Direction"
              unit="°"
              data={historicalChartData}
              xKey="time"
              isHourly={false}
              yKeys={[
                {
                  key: "windDirDominant",
                  color: "#f59e0b",
                  name: "Wind Direction",
                },
              ]}
            />

            <WeatherChart
              title="Air Quality Trends (Daily Mean)"
              unit="µg/m³"
              data={historicalChartData}
              xKey="time"
              isHourly={false}
              yKeys={[
                { key: "pm10", color: "#ef4444", name: "PM10 Mean" },
                { key: "pm2_5", color: "#ec4899", name: "PM2.5 Mean" },
              ]}
            />

            {/* Sun Cycle */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                  <Sunrise size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Solar Cycle (IST)
                  </h3>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                    UTC+5:30 conversion
                  </p>
                </div>
              </div>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100">
                    <th className="pb-4 font-bold meta-label">Date</th>
                    <th className="pb-4 font-bold meta-label">Sunrise</th>
                    <th className="pb-4 font-bold meta-label">Sunset</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {historicalData?.daily.time
                    .slice(-7)
                    .reverse()
                    .map((time, i) => {
                      const idx = historicalData.daily.time.length - 1 - i;
                      const formatIST = (dateStr: string) => {
                        const date = new Date(dateStr);
                        const utc =
                          date.getTime() + date.getTimezoneOffset() * 60000;
                        const istDate = new Date(utc + 3600000 * 5.5);
                        return format(istDate, "HH:mm");
                      };
                      return (
                        <tr
                          key={time}
                          className="text-gray-700 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-4 font-bold">
                            {format(new Date(time), "MMM dd")}
                          </td>
                          <td className="py-4 font-mono text-blue-600">
                            {formatIST(historicalData.daily.sunrise[idx])}
                          </td>
                          <td className="py-4 font-mono text-orange-600">
                            {formatIST(historicalData.daily.sunset[idx])}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
                <p className="text-[11px] text-gray-400 italic leading-relaxed">
                  Displaying the most recent 7 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
