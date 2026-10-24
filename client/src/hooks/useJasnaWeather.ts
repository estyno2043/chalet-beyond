import { useEffect, useState } from "react";

export type WeatherIconType = "snow" | "rain" | "cloud" | "sun";

export interface JasnaWeatherData {
  tempString: string | null;
  rawTemp: number | null;
  conditionIcon: WeatherIconType;
  summary: string;
  loading: boolean;
}

const CACHE_KEY = "chalet_beyond_weather_v1";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export function formatWeatherCondition(
  code: number | null,
  temp: number | null,
): WeatherIconType {
  if (code === null) {
    return temp !== null && temp <= 1 ? "snow" : "cloud";
  }

  // WMO Snow codes: 71, 73, 75, 77, 85, 86
  if ([71, 73, 75, 77, 85, 86].includes(code) || (temp !== null && temp <= 0 && [51, 53, 55, 61, 63, 65, 80].includes(code))) {
    return "snow";
  }

  // WMO Rain codes
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
    return "rain";
  }

  // WMO Clear / Partly cloudy
  if (code === 0 || code === 1) {
    return "sun";
  }

  return "cloud";
}

export function parseWeatherData(data: any): Omit<JasnaWeatherData, "loading"> {
  const current = data?.current;
  const temp = typeof current?.temperature_2m === "number" ? current.temperature_2m : null;
  const code = typeof current?.weather_code === "number" ? current.weather_code : null;

  if (temp === null) {
    return {
      tempString: null,
      rawTemp: null,
      conditionIcon: "snow",
      summary: "Jasná · 1 220 m n.m.",
    };
  }

  const rounded = Math.round(temp);
  const tempString = rounded > 0 ? `+${rounded}°C` : `${rounded}°C`;
  const conditionIcon = formatWeatherCondition(code, temp);

  return {
    tempString,
    rawTemp: temp,
    conditionIcon,
    summary: `Jasná · 1 220 m n.m. · ${tempString}`,
  };
}

export function useJasnaWeather(): JasnaWeatherData {
  const [weather, setWeather] = useState<JasnaWeatherData>(() => {
    // Attempt to hydrate from sessionStorage if available
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL_MS && data) {
            return { ...data, loading: false };
          }
        }
      } catch {
        /* Ignore cache read errors */
      }
    }
    return {
      tempString: null,
      rawTemp: null,
      conditionIcon: "snow",
      summary: "Jasná · 1 220 m n.m.",
      loading: true,
    };
  });

  useEffect(() => {
    let cancelled = false;

    // Check if we already have fresh cached data
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL_MS && data) {
            setWeather({ ...data, loading: false });
            return;
          }
        }
      } catch {
        /* Ignore cache error */
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000); // 4s timeout

    // Demänovská Dolina / Jasná coordinates: 48.966°N, 19.583°E (~1188-1220m)
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=48.966&longitude=19.583&current=temperature_2m,weather_code&timezone=Europe%2FBratislava",
      { signal: controller.signal },
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        clearTimeout(timer);
        if (cancelled) return;
        const parsed = parseWeatherData(data);
        const nextState: JasnaWeatherData = { ...parsed, loading: false };
        setWeather(nextState);

        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), data: parsed }),
          );
        } catch {
          /* Ignore storage quota errors */
        }
      })
      .catch(() => {
        clearTimeout(timer);
        if (!cancelled) {
          setWeather((prev) => ({ ...prev, loading: false }));
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return weather;
}
