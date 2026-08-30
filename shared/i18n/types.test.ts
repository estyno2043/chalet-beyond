import { describe, expect, it } from "vitest";
import { DEFAULT_LANG, LANGS, langFromPath, pathForLang } from "./types";

describe("langFromPath", () => {
  it("reads each language from its prefix", () => {
    expect(langFromPath("/de/")).toBe("de");
    expect(langFromPath("/en")).toBe("en");
    expect(langFromPath("/pl/nieco")).toBe("pl");
  });

  it("treats the root as Slovak", () => {
    expect(langFromPath("/")).toBe("sk");
    expect(langFromPath("")).toBe("sk");
  });

  it("falls back to Slovak for an unknown prefix", () => {
    // /fr/ is not a language we serve; it must not read as a language at all.
    expect(langFromPath("/fr/")).toBe("sk");
    expect(langFromPath("/rezervacia")).toBe("sk");
  });
});

describe("pathForLang", () => {
  it("moves between languages", () => {
    expect(pathForLang("/", "de")).toBe("/de");
    expect(pathForLang("/de", "pl")).toBe("/pl");
    expect(pathForLang("/de/", "en")).toBe("/en");
  });

  it("returns Slovak to the root rather than /sk", () => {
    expect(pathForLang("/de/", "sk")).toBe("/");
    expect(pathForLang("/en", "sk")).toBe("/");
  });

  it("keeps whatever follows the language prefix", () => {
    expect(pathForLang("/de/nieco", "en")).toBe("/en/nieco");
    expect(pathForLang("/nieco", "de")).toBe("/de/nieco");
  });

  it("round-trips every language", () => {
    for (const lang of LANGS) {
      expect(langFromPath(pathForLang("/", lang))).toBe(lang);
    }
  });

  it("is idempotent for the language already in the path", () => {
    expect(pathForLang("/de/", "de")).toBe("/de");
    expect(pathForLang("/", DEFAULT_LANG)).toBe("/");
  });
});
