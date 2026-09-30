---
name: Chalet Beyond
description: Dark Timber identity with a restrained, media-led chalet hero.
colors:
  primary: "oklch(0.72 0.12 65)"
  background: "oklch(0.1 0.012 55)"
  foreground: "oklch(0.92 0.008 75)"
  card: "oklch(0.14 0.012 55)"
  secondary: "oklch(0.18 0.012 55)"
  muted-foreground: "oklch(0.58 0.02 65)"
  border: "oklch(0.72 0.12 65 / 0.18)"
  hero-ink: "oklch(0.97 0.007 75)"
  hero-dark: "oklch(0.12 0.01 55)"
  hero-hover: "oklch(0.84 0.075 75)"
typography:
  display:
    fontFamily: "Bebas Neue, sans-serif"
    fontSize: "clamp(4.5rem, 17vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Bebas Neue, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 5rem)"
    lineHeight: 1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Karla, sans-serif"
    fontWeight: 300
    lineHeight: 1.65
  hero-body:
    fontFamily: "Karla, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.45
  hero-action:
    fontFamily: "Karla, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    letterSpacing: "0.08em"
  navigation:
    fontFamily: "Karla, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
rounded:
  base: "0.25rem"
  hero-control: "2px"
spacing:
  hero-gutter-compact: "24px"
  hero-gutter-medium: "40px"
  hero-gutter-wide: "64px"
  hero-copy-gap: "24px"
  hero-facts-gap: "16px"
components:
  button-amber-inherited:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    padding: "0.75rem 2rem"
  button-ghost-inherited:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    padding: "0.75rem 2rem"
  hero-primary:
    backgroundColor: "{colors.hero-ink}"
    textColor: "{colors.hero-dark}"
    typography: "{typography.hero-action}"
    rounded: "{rounded.hero-control}"
    padding: "14px 20px"
  hero-primary-hover:
    backgroundColor: "{colors.hero-hover}"
  hero-secondary:
    textColor: "{colors.hero-ink}"
  hero-playback:
    backgroundColor: "rgb(12 14 12 / 0.6)"
    textColor: "{colors.hero-ink}"
    rounded: "{rounded.hero-control}"
    padding: "10px 14px"
  navigation-link:
    textColor: "{colors.foreground}"
    typography: "{typography.navigation}"
    padding: "6px 12px"
  navigation-book:
    backgroundColor: "{colors.primary}"
    textColor: "oklch(0.10 0.010 55)"
    rounded: "{rounded.hero-control}"
    padding: "8px 20px"
---

# Design System: Chalet Beyond

## Overview

**Creative North Star: "Dark Timber"**

The inherited identity pairs deep charcoal, warm amber and pale type with the
existing chalet logo. Its source describes arrival at dusk: a warm chalet against
dark pine forest. Condensed display lettering gives the identity weight; lighter
body text keeps information readable.

The implemented hero is a scoped expression of that identity: supplied exterior
footage, a compact two-line property name and a clear availability action. Its
minimal composition and restrained response to input apply to this hero, not to
every future page layout.

**Key Characteristics:**
- Inherited dark surfaces, amber accents and the existing logo.
- Bebas Neue display type, Karla prose and JetBrains Mono data labels.
- Hero-specific pale controls, static contrast shading and brief entrance motion.

Scope: extracted on 2026-09-30 from `client/src/index.css`, `fonts.css`, Hero,
HeroPointer, Navigation and LanguageSwitcher. Product authority is `PRODUCT.md`;
the surface contract is `docs/superpowers/specs/2026-09-30-video-hero.md`.
Other page components were not audited. Global utilities below are inherited
definitions, not a claim that every existing screen uses them consistently.

## Colors

Warm, low-chroma neutrals support a single amber accent. Preserve source OKLCH
values; hero-local colors do not replace global tokens.

### Primary
- **Amber (`primary`)** marks navigation actions, interaction detail and inherited
  amber buttons. The global primary, accent and amber variables share this value.

### Neutral
- **Dark timber (`background`)** is the page base; **pale text (`foreground`)** is
  the inherited reading color.
- **Raised timber (`card`)** and **secondary timber (`secondary`)** are inherited
  surface tokens. **Muted text (`muted-foreground`)** supports data labels.
- **Amber edge (`border`)** is a translucent divider, not a second accent family.
- **Hero ink / hero dark** provide the hero's higher-contrast text and controls.
  **Hero hover** is the primary hero action's warm hover fill.

## Typography

Display: **Bebas Neue**. Body and hero actions: **Karla**. Data and language
labels: **JetBrains Mono**. All are locally served with Latin and Latin Extended
coverage and `font-display: swap`; retain their declared fallback families.

- `display` is the hero title only; it settles at 6rem from 1024px. Its two lines
  and tight leading are local composition decisions.
- `headline` captures the inherited section-heading utility. General headings
  use the same display family with 1.05 leading.
- `body` is inherited base text; paragraphs cap at 68ch.
- `hero-body` grows to 1.25rem from 1024px. Its line length is 32ch, 38ch between
  640px and 1023px, then 32ch on desktop.
- Hero facts use Karla 400 with tabular numerals: 0.875rem/1.5, increasing to
  0.9375rem on desktop. `label` records the inherited mono data utility.
- Language links use mono uppercase text at 0.6875rem; the expanded menu uses
  full language names at 0.8rem. Mobile navigation labels use 2rem Bebas Neue.

## Layout

**Inherited page container:** 100% width, centered; horizontal padding is 1.25rem,
2rem from 640px and 3rem from 1024px, with a 1400px desktop maximum.

**Hero and navigation only:** share a centered 1600px maximum and the three hero
gutter tokens, changing at 640px and 1024px. Navigation is fixed at 72px high.
The hero starts with 112px top padding, bottom-aligns its content and keeps its
content column at most 600px wide. Its minimum height is 100svh, becoming
`max(680px, 100svh)` on desktop; it may grow for short screens or longer copy.

Hero actions wrap. Their minimum heights are 56px primary, 48px secondary and
44px playback. Playback stays in flow below desktop and sits at the lower right
on desktop. Full navigation links appear from 1280px; smaller widths use the
menu. The gallery and inquiry targets reserve 72px above their scroll position.

## Elevation & Depth

The hero builds depth from real footage, two static contrast gradients and
foreground text. It has no card surface or decorative glow. Navigation starts
transparent, becomes almost opaque after a 10px scroll and uses a solid dark
mobile overlay; there is no backdrop blur in this scope.

Inherited global buttons retain amber glow on hover, and the existing mobile
menu CTA retains its gradient and shadow. These are recorded in the sidecar as
inherited treatments; the hero's flatter treatment is not a global shadow ban.

## Shapes

The inherited base radius is small. Hero controls and the desktop navigation CTA
use the `hero-control` radius. The inherited amber and ghost utilities specify
no radius. The hero pointer ring is circular; this is an interaction affordance,
not a general pill-shaped component language.

## Components

**Inherited buttons:** amber fill and transparent ghost variants use Bebas Neue,
warm hover feedback and a small pressed scale. These are existing global CSS
utilities; the sidecar preserves their styles without treating them as hero CTAs.

**Hero actions:** the pale primary action leads to the inquiry section, and the
underlined secondary action leads to the gallery. Primary hover warms the fill
and moves the arrow 3px; pressed scale is 0.98. The playback control is a bordered,
translucent dark button. All hero actions receive a 2px pale focus outline with
5px offset. Transition duration is 180ms; reduced motion removes transitions and
the primary pressed transform.

**Hero media and entrance:** poster and video cover the frame, with a 56% horizontal
crop below desktop and centered crop from 1024px. The poster remains until a
decoded video frame is ready. Native muted looping 720p60 playback is requested
only from 1024px without reduced motion, Save-Data or a reported slow connection
(slow-2g, 2g, 3g). Compact playback is explicit and uses 720p30. Playback pauses
offscreen or when hidden and preserves a manual pause. Footage contains cuts;
the loop is not seamless. Title entrance lasts 700ms with an 80ms second-line
delay; supporting copy lasts 650ms with 100/150ms delays. Both use opacity and
translation, and are omitted for reduced motion. Scroll never seeks the video.

**Hero pointer response:** only from 1024px with hover, a fine mouse pointer and
no reduced motion. A 28px ring follows pointer events and expands to 1.45 times
its size over hero actions. Inner action contents translate at most 4px sideways
and 3px vertically; hit areas and the native cursor stay intact. Updates are
coalesced to a frame, with no idle loop. Tab, leaving, scrolling, resizing, losing
focus or hiding the page clears the effect.

**Navigation:** desktop links gain a warm color and an amber underline on hover;
the amber CTA fades to 0.88 opacity on hover. Focus is a 2px pale outline with
4px offset. The compact menu uses a brief 250ms fade and 8px lift, suppressed for
reduced motion. Closed menu contents are inert and hidden from accessibility
navigation. Language choices combine flags with text and mark the selected
language with a pale translucent fill and border.

The sidecar renders seven extracted button/link variants. It does not simulate
video, menu state or pointer tracking, and does not invent unaudited cards or
form fields.

## Do's and Don'ts

- Do retain the inherited logo, Dark Timber palette and three font families.
- Do keep hero copy and actions legible over both the poster and moving footage.
- Do preserve visible keyboard focus, stationary action hit areas and reduced-motion behavior in the hero and navigation.
- Don't promote the hero's two-line title, lower-left composition or 1600px container into a mandatory site-wide layout.
- Don't add invented ratings, prices or instant-booking promises to the hero.
- Don't replace poster-first compact playback with automatic video loading.
