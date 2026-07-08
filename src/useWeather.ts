import { useState, useEffect } from "react";

// WMO weather-interpretation codes -> emoji / label.
// https://open-meteo.com/en/docs (no API key required)
const WMO_ICONS: Record<number, string> = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌦️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "❄️", 73: "❄️", 75: "❄️",
  80: "🌦️", 81: "🌦️", 82: "⛈️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

const WMO_LABELS: Record<number, string> = {
  0: "Clear", 1: "Mostly Clear", 2: "Partly Cloudy", 3: "Overcast",
  45: "Foggy", 48: "Foggy",
  51: "Light Drizzle", 53: "Drizzle", 55: "Heavy Drizzle",
  61: "Light Rain", 63: "Rain", 65: "Heavy Rain",
  71: "Light Snow", 73: "Snow", 75: "Heavy Snow",
  80: "Showers", 81: "Showers", 82: "Heavy Showers",
  95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm",
};

export interface WeatherData {
  temp: number;
  icon: string;
  label: string;
  wind: number;
}

export interface UseWeatherOptions {
  latitude: number;
  longitude: number;
  /** IANA timezone, e.g. "America/New_York". Defaults to "auto". */
  timezone?: string;
  /** "fahrenheit" | "celsius". Defaults to "fahrenheit". */
  temperatureUnit?: "fahrenheit" | "celsius";
  /** "mph" | "kmh" | "ms" | "kn". Defaults to "mph". */
  windSpeedUnit?: "mph" | "kmh" | "ms" | "kn";
}

/**
 * Fetch current conditions for a fixed location from the free Open-Meteo API
 * (no API key). Great for an event/venue "what's it like right now" widget.
 */
export function useWeather(options: UseWeatherOptions) {
  const {
    latitude,
    longitude,
    timezone = "auto",
    temperatureUnit = "fahrenheit",
    windSpeedUnit = "mph",
  } = options;

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current: "temperature_2m,weather_code,wind_speed_10m",
      temperature_unit: temperatureUnit,
      wind_speed_unit: windSpeedUnit,
      timezone,
    });

    fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const { temperature_2m, weather_code, wind_speed_10m } = data.current;
        setWeather({
          temp: Math.round(temperature_2m),
          icon: WMO_ICONS[weather_code] ?? "🌡️",
          label: WMO_LABELS[weather_code] ?? "Unknown",
          wind: Math.round(wind_speed_10m),
        });
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, timezone, temperatureUnit, windSpeedUnit]);

  return { weather, loading, error };
}
