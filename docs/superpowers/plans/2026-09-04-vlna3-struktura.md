# Vlna 3 — štruktúra (Threshold Story)

**Spec:** `2026-08-30-threshold-story-redesign-design.md` (Codex, posúdený 2026-09-03)
**Rozsah tohto plánu:** len štruktúra. Animácie a mobilný pohyb sú Vlna 3B.
**Rozhodnutie:** používateľ zvolil „najprv štruktúra, potom animácie" — inak by sme
ladili pohyb na komponentoch, ktoré tento plán maže.

---

## Prečo v tomto poradí

Spec **odstraňuje z behu** `HeroSCV`, `HeroMobile`, `QuoteSection`, `StickyContactBar`
a mení poradie sekcií. Každá animácia dorobená na týchto komponentoch pred prestavbou
je zahodená práca.

**Mobile-first platí aj tu:** `HeroCompact` (mobil) sa stavia **pred** desktopovým
`HeroThresholdStory`.

## Východiskové fakty (odmerané 2026-09-04)

| Vec | Stav |
|---|---|
| GSAP | v `package.json` (`^3.15.0`), **nikde neimportovaný** |
| `logo.png` | **911 kB** (1024×1024) — sám prekročí polovicu mobilného rozpočtu |
| `hero-mobile.mp4` | 6,6 MB, `preload="auto"`, bez posteru |
| Desktop hero | 520svh, `currentTime` zápis v nekonečnom rAF |
| Navigácia | CTA odrezané ~52 px mimo obrazovku v pásme 768–940 px |
| `prefers-reduced-motion` | blok existuje v `index.css:328` |

---

## Úlohy

### 1. Motion tokeny a reduced-motion základ
`client/src/index.css` — tokeny zo spec §11: `--motion-ui` 160 ms,
`--motion-section` 520 ms, `--motion-cinematic` 1000 ms, easing
`cubic-bezier(0.2,0,0,1)` a `cubic-bezier(0.16,1,0.3,1)`.
Rozšíriť existujúci reduced-motion blok.
**Overenie:** `getComputedStyle(document.documentElement).getPropertyValue('--motion-ui')`.

### 2. Zmenšiť logo
Z 1024×1024 PNG spraviť variant primeraný zobrazovanej veľkosti (44 px výška).
**Overenie:** nový súbor pod 30 kB, vizuálne bez rozdielu pri 2× DPI.

### 3. `HeroActions`
`client/src/components/hero/HeroActions.tsx` — zdieľané CTA, Booking rating
z `BOOKING_RATING`, hlavné benefity. Používajú ho oba heroy.
**Overenie:** `pnpm check`, komponent sa vykreslí v oboch heroch.

### 4. `HeroCompact` — mobil (pred desktopom)
`client/src/components/hero/HeroCompact.tsx`. Výška 88svh, prvý paint zo
statického posteru, CTA a rating viditeľné bez scrollu.
**Rozpočet médií: max 2 MB pred prvou interakciou** (spec §6).
Video len ak sa zmestí, nikdy nie ako podmienka zobrazenia obsahu.
**Overenie:** DevTools Network na 375 px — súčet hero médií pred interakciou < 2 MB;
CTA v prvom viewporte.

### 5. `HeroThresholdStory` — desktop
`client/src/components/hero/HeroThresholdStory.tsx`. Aktívny od 1024 px.
Celkovo **240svh**, sticky scéna 100svh, tri kapitoly z fotografií.
GSAP `ScrollTrigger` cez `gsap.context()` + `gsap.matchMedia()`, pin len pre
`min-width: 1024px` a `prefers-reduced-motion: no-preference`.
Animovať výhradne `transform`, `opacity`, `clip-path`.
**Žiadny zápis `video.currentTime`, žiadny vlastný nekonečný rAF.**
**Overenie:** výška ≤ 240svh; `grep currentTime` v komponente prázdny;
po zmene breakpointu sa inline GSAP štýly vyčistia.

### 6. `Home.tsx` — prepnutie a odstránenie starých heroov
Breakpoint render `HeroCompact` / `HeroThresholdStory`.
Až po overení oboch zmazať `HeroSCV.tsx` a `HeroMobile.tsx`.
**Overenie:** `pnpm build`, žiadne osirelé importy.

### 7. `ProofStrip`
Štyri overiteľné fakty: rating `10`, max 8 hostí, súkromná sauna a vírivka,
Black Stork — jediné PGA ihrisko na Slovensku.
Mobil: horizontálny snap strip s viditeľným kúskom ďalšej položky.
Desktop: jedna línia.
**Overenie:** na 375 px nie je horizontálny pretok stránky.

### 8. Nové poradie sekcií + odstránenie `QuoteSection`
Podľa spec §8. Najsilnejšia veta z citátu môže prejsť do manifesto copy;
druhý samostatný citátový blok nevzniká.
**Overenie:** vizuálna kontrola poradia, `pnpm build`.

### 9. Navigácia — tri responzívne režimy
Spec §7. **Toto opravuje odmeranú chybu**, keď je CTA v pásme 768–940 px
52 px mimo obrazovku a nedá sa naň kliknúť.
Logo dostane explicitnú šírku, výšku a `flex: none`.
Dotykové ciele min. 44×44 px.
**Overenie:** zmerať `getBoundingClientRect().right` CTA pri 768, 820, 900, 1024,
1280 a 1440 px — vždy `<= window.innerWidth`.

### 10. i18n pre všetky nové texty
`shared/i18n/{sk,de,en,pl}.ts` — hero kapitoly, proof strip, CTA.
**Overenie:** `pnpm check` (typ `Dict` chytí chýbajúci kľúč v ktoromkoľvek jazyku).

---

## Dávky

| Dávka | Úlohy | Prečo spolu |
|---|---|---|
| A | 1, 2, 9 | základ a dve nezávislé opravy, nič nemažú |
| B | 3, 4, 10 | mobilný hero end-to-end vrátane prekladov |
| C | 5, 6 | desktop hero a odstránenie starých |
| D | 7, 8 | proof strip a nové poradie |

Po každej dávke `pnpm check`, `pnpm test`, `pnpm build` a overenie v prehliadači
na 375 px, potom až ďalej.

## Mimo rozsahu

Animácie sekcií, galéria carousel, dvojkrokový booking, cenník prestavba,
`BookingIntentProvider`, sticky booking bar. To je **Vlna 3B a 3C**.

## Poznámka k mobilnému pohybu

Rozpočet 2 MB v úlohe 4 je o **hmotnosti médií**, nie zákaz animácie.
Futuristický pohyb, ktorý si používateľ praje, patrí do `transform`/`opacity` —
tie nič nesťahujú. Ťažké video v hero a plynulý pohyb sa nevylučujú preto,
že by boli v spore, ale preto, že video zožerie rozpočet, ktorý pohyb nepotrebuje.
