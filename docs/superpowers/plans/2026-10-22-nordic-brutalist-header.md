# Nordic Brutalist Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a refined Nordic Brutalist luxury header for Chalet Beyond featuring live Jasná weather/temperature, numerated architectural navigation, refined amber luxury CTA, and an elevated mobile drawer experience.

**Architecture:** Client-side React hook `useJasnaWeather` fetches real-time temperature and condition data for Jasná from Open-Meteo with a 15-minute `sessionStorage` cache. `Navigation.tsx` integrates the live weather chip, coordinates, numerated desktop links, and an upgraded mobile bar & drawer, styled via `navigation.css`.

**Tech Stack:** React 19, TypeScript, Lucide React, Open-Meteo REST API, Vitest.

**Spec:** file:///Users/goat/.gemini/antigravity/brain/d311fa93-7ae1-4e35-9ff0-bfa2b012a5c0/header_nordic_brutalist_spec.md

---

## Global Constraints
- Zero layout shift (CLS = 0): Weather chip must have reserved space and graceful fallback (`1 220 m n.m. · Jasná`).
- Strict TypeScript: No `any`, clean build with `tsc --noEmit`.
- Mobile first: Mobile header must never crowd or overflow on screens down to 360px.
- Keep test suite 100% green: Existing 70 Vitest tests must continue passing.

---

## Tasks

### Task 1: Create `useJasnaWeather` Hook with Tests
**Files:**
- Create: `client/src/hooks/useJasnaWeather.ts`
- Create: `client/src/hooks/useJasnaWeather.test.ts`

- [x] **Step 1.1: Write failing unit tests for weather hook**
  - Test initial state, successful Open-Meteo fetch & temperature rounding, 15-minute `sessionStorage` caching, and offline/fetch error fallback.
- [x] **Step 1.2: Run test to confirm it fails**
  - Run `pnpm vitest run client/src/hooks/useJasnaWeather.test.ts`.
- [x] **Step 1.3: Implement `useJasnaWeather.ts`**
  - Coordinate: Lat 48.966, Lon 19.583.
  - Fetch `temperature_2m,weather_code`.
  - Format output: `{ temp: string | null, condition: string, rawTemp: number | null, loading: boolean }`.
  - Cache result in `sessionStorage` with timestamp.
- [x] **Step 1.4: Run test to confirm it passes**
  - Run `pnpm vitest run client/src/hooks/useJasnaWeather.test.ts`.

---

### Task 2: Implement Nordic Brutalist Header in `Navigation.tsx` and `navigation.css`
**Files:**
- Modify: `client/src/components/Navigation.tsx`
- Modify: `client/src/components/navigation.css`

- [x] **Step 2.1: Update `Navigation.tsx` markup and components**
  - Incorporate `useJasnaWeather` hook.
  - Left desktop cluster: Logo + brass vertical rule + live status chip with pulsing dot, `JASNÁ · 1 220 M N.M.` and live weather badge.
  - Center desktop cluster: Numerated architectural links (`01 CHALET`, `02 PRIESTORY`, `03 OKOLIE`, `04 CENNÍK`, `05 REZERVÁCIA`).
  - Right desktop cluster: Language dropdown + phone/email on scroll + refined luxury CTA button (amber border, roll/lift, no brackets).
  - Mobile header cluster: Logo + compact weather chip (`❄️ 2°C`) + language selector + burger toggle.
  - Mobile drawer overlay: Fullscreen architectural panel with live coordinates, weather, large numerated links, and quick contact cards.
- [x] **Step 2.2: Update `navigation.css`**
  - Implement brutalist hairline borders (`border-bottom: 1px solid oklch(0.72 0.12 65 / 0.18)`).
  - Add pulsing indicator animation for live status.
  - Style numerated links with subtle letter-spacing and amber hover accents.
  - Style refined luxury CTA button with amber glow and dark timber backdrop.
  - Style responsive mobile bar and drawer elements.
- [x] **Step 2.3: Verify TypeScript and bundle check**
  - Run `pnpm check`.

---

### Task 3: Full Verification & Integration Test
**Files:**
- All changed files

- [x] **Step 3.1: Run full Vitest suite**
  - Run `pnpm test`.
- [x] **Step 3.2: Run production build**
  - Run `pnpm build`.
