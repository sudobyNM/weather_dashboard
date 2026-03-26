import { format, subDays } from "date-fns";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";

export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    precipitation: number;
    windSpeed: number;
    weatherCode: number;
  };
  daily: {
    tempMax: number;
    tempMin: number;
    sunrise: string;
    sunset: string;
    uvIndex: number;
    precipProbMax: number;
    windSpeedMax: number;
  };
  hourly: {
    time: string[];
    temp: number[];
    humidity: number[];
    precipitation: number[];
    visibility: number[];
    windSpeed: number[];
  };
  airQuality: {
    aqi: number;
    pm10: number;
    pm2_5: number;
    co: number;
    no2: number;
    so2: number;
    co2: number;
    hourly: {
      time: string[];
      pm10: number[];
      pm2_5: number[];
    };
  };
}

export interface HistoricalData {
  daily: {
    time: string[];
    tempMean: number[];
    tempMax: number[];
    tempMin: number[];
    sunrise: string[];
    sunset: string[];
    precipSum: number[];
    windSpeedMax: number[];
    windDirDominant: number[];
  };
  airQuality?: {
    time: string[];
    pm10: number[];
    pm2_5: number[];
  };
}

export async function getWeatherData(
  lat: number,
  lon: number,
  date?: Date,
): Promise<WeatherData> {
  const dateStr = date
    ? format(date, "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd");

  const forecastParams = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current:
      "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
    hourly:
      "temperature_2m,relative_humidity_2m,precipitation,visibility,wind_speed_10m",
    daily:
      "temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max",
    timezone: "auto",
    start_date: dateStr,
    end_date: dateStr,
  });

  const aqParams = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    hourly:
      "pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,european_aqi",
    timezone: "auto",
    start_date: dateStr,
    end_date: dateStr,
  });

  const [forecastRes, aqRes] = await Promise.all([
    fetch(`${FORECAST_URL}?${forecastParams}`),
    fetch(`${AIR_QUALITY_URL}?${aqParams}`),
  ]);

  const forecastData = await forecastRes.json();
  const aqData = await aqRes.json();

  // Find the index for current hour in hourly data if it's today
  const currentHourIdx = new Date().getHours();

  return {
    current: {
      temp: forecastData.current.temperature_2m,
      humidity: forecastData.current.relative_humidity_2m,
      precipitation: forecastData.current.precipitation,
      windSpeed: forecastData.current.wind_speed_10m,
      weatherCode: forecastData.current.weather_code,
    },
    daily: {
      tempMax: forecastData.daily.temperature_2m_max[0],
      tempMin: forecastData.daily.temperature_2m_min[0],
      sunrise: forecastData.daily.sunrise[0],
      sunset: forecastData.daily.sunset[0],
      uvIndex: forecastData.daily.uv_index_max[0],
      precipProbMax: forecastData.daily.precipitation_probability_max[0],
      windSpeedMax: forecastData.daily.wind_speed_10m_max[0],
    },
    hourly: {
      time: forecastData.hourly.time,
      temp: forecastData.hourly.temperature_2m,
      humidity: forecastData.hourly.relative_humidity_2m,
      precipitation: forecastData.hourly.precipitation,
      visibility: forecastData.hourly.visibility,
      windSpeed: forecastData.hourly.wind_speed_10m,
    },
    airQuality: {
      aqi:
        aqData.hourly.european_aqi[currentHourIdx] ||
        aqData.hourly.european_aqi[0],
      pm10: aqData.hourly.pm10[currentHourIdx] || aqData.hourly.pm10[0],
      pm2_5: aqData.hourly.pm2_5[currentHourIdx] || aqData.hourly.pm2_5[0],
      co:
        aqData.hourly.carbon_monoxide[currentHourIdx] ||
        aqData.hourly.carbon_monoxide[0],
      no2:
        aqData.hourly.nitrogen_dioxide[currentHourIdx] ||
        aqData.hourly.nitrogen_dioxide[0],
      so2:
        aqData.hourly.sulphur_dioxide[currentHourIdx] ||
        aqData.hourly.sulphur_dioxide[0],
      co2: 415, // Atmospheric CO2 level (not available from API)
      hourly: {
        time: aqData.hourly.time,
        pm10: aqData.hourly.pm10,
        pm2_5: aqData.hourly.pm2_5,
      },
    },
  };
}

export async function getHistoricalData(
  lat: number,
  lon: number,
  startDate: Date,
  endDate: Date,
): Promise<HistoricalData> {
  const maxAllowedEnd = subDays(new Date(), 1);
  const safeEndDate = endDate > maxAllowedEnd ? maxAllowedEnd : endDate;
  const safeStartDate = startDate > safeEndDate ? safeEndDate : startDate;

  const startStr = format(safeStartDate, "yyyy-MM-dd");
  const endStr = format(safeEndDate, "yyyy-MM-dd");

  const archiveParams = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    start_date: startStr,
    end_date: endStr,
    daily:
      "temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,precipitation_sum,windspeed_10m_max,winddirection_10m_dominant",
    timezone: "auto",
  });

  // Air Quality Archive is sometimes limited
  const aqParams = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    start_date: startStr,
    end_date: endStr,
    hourly: "pm10,pm2_5",
    timezone: "auto",
  });

  const [archiveRes, aqRes] = await Promise.all([
    fetch(`${ARCHIVE_URL}?${archiveParams}`),
    fetch(`${AIR_QUALITY_URL}?${aqParams}`),
  ]);

  if (!archiveRes.ok) {
    const err = await archiveRes.text();
    throw new Error(`Archive API error ${archiveRes.status}: ${err}`);
  }

  if (!aqRes.ok) {
    const err = await aqRes.text();
    throw new Error(`Air Quality API error ${aqRes.status}: ${err}`);
  }

  const archiveData = await archiveRes.json();
  const aqData = await aqRes.json();

  // Aggregate AQ hourly to daily mean for PM10/PM2.5
  const dailyAQ = {
    time: [] as string[],
    pm10: [] as number[],
    pm2_5: [] as number[],
  };

  if (aqData.hourly) {
    const times = aqData.hourly.time;
    const pm10s = aqData.hourly.pm10;
    const pm25s = aqData.hourly.pm2_5;

    for (let i = 0; i < times.length; i += 24) {
      const dayTime = times[i].split("T")[0];
      const dayPm10 =
        pm10s.slice(i, i + 24).reduce((a: number, b: number) => a + b, 0) / 24;
      const dayPm25 =
        pm25s.slice(i, i + 24).reduce((a: number, b: number) => a + b, 0) / 24;

      dailyAQ.time.push(dayTime);
      dailyAQ.pm10.push(dayPm10);
      dailyAQ.pm2_5.push(dayPm25);
    }
  }

  return {
    daily: {
      time: archiveData.daily.time ?? [],
      tempMean: archiveData.daily.temperature_2m_mean,
      tempMax: archiveData.daily.temperature_2m_max,
      tempMin: archiveData.daily.temperature_2m_min,
      sunrise: archiveData.daily.sunrise,
      sunset: archiveData.daily.sunset,
      precipSum: archiveData.daily.precipitation_sum,
      windSpeedMax: archiveData.daily.windspeed_10m_max,
      windDirDominant: archiveData.daily.winddirection_10m_dominant,
    },
    airQuality: dailyAQ,
  };
}
