import { describe, expect, it } from "vitest";
import { formatWeatherCondition, parseWeatherData } from "./useJasnaWeather";

describe("parseWeatherData", () => {
  it("formats positive temperature correctly", () => {
    const raw = {
      current: {
        temperature_2m: 2.4,
        weather_code: 3,
      },
    };
    const parsed = parseWeatherData(raw);
    expect(parsed.tempString).toBe("+2°C");
    expect(parsed.conditionIcon).toBe("cloud");
    expect(parsed.rawTemp).toBe(2.4);
  });

  it("formats freezing temperature correctly with snow icon", () => {
    const raw = {
      current: {
        temperature_2m: -4.1,
        weather_code: 71,
      },
    };
    const parsed = parseWeatherData(raw);
    expect(parsed.tempString).toBe("-4°C");
    expect(parsed.conditionIcon).toBe("snow");
    expect(parsed.rawTemp).toBe(-4.1);
  });

  it("handles null or invalid payload safely", () => {
    const parsed = parseWeatherData(null);
    expect(parsed.tempString).toBeNull();
    expect(parsed.conditionIcon).toBe("snow");
    expect(parsed.summary).toBe("Jasná · 1 220 m n.m.");
  });
});

describe("formatWeatherCondition", () => {
  it("identifies snow codes", () => {
    expect(formatWeatherCondition(71, -2)).toBe("snow");
    expect(formatWeatherCondition(85, -5)).toBe("snow");
    expect(formatWeatherCondition(77, 0)).toBe("snow");
  });

  it("identifies rain codes", () => {
    expect(formatWeatherCondition(61, 5)).toBe("rain");
    expect(formatWeatherCondition(51, 8)).toBe("rain");
  });

  it("identifies clear sun codes", () => {
    expect(formatWeatherCondition(0, 10)).toBe("sun");
    expect(formatWeatherCondition(1, 2)).toBe("sun");
  });

  it("defaults to snow for cold mountain weather without code", () => {
    expect(formatWeatherCondition(null, -1)).toBe("snow");
  });
});
