---
name: Chalet Beyond
description: Dark Timber identity with real chalet photography, restrained editorial layouts and functional amber actions.
colors:
  primary: "oklch(0.72 0.12 65)"
  background: "oklch(0.06 0.008 55)"
  foreground: "oklch(0.92 0.008 75)"
  muted-foreground: "oklch(0.78 0.008 75)"
  secondary-text: "oklch(0.8 0.008 75)"
  description-text: "oklch(0.82 0.008 75)"
  border: "rgb(245 244 239 / 0.2)"
  control-border: "rgb(245 244 239 / 0.4)"
  hero-ink: "oklch(0.97 0.007 75)"
  hero-dark: "oklch(0.12 0.01 55)"
  hero-sand: "oklch(0.85 0.06 74)"
  validation: "oklch(0.84 0.09 35)"
  photo-timeline-line: "rgb(255 255 255 / 0.5)"
  photo-control-line: "rgb(255 255 255 / 0.6)"
  photo-control-hover: "rgb(255 255 255 / 0.12)"
  control-hover: "rgb(245 244 239 / 0.12)"
  gallery-surface: "rgb(255 255 255 / 0.04)"
typography:
  display:
    fontFamily: "Thunder, sans-serif"
    fontSize: "clamp(5.5rem, min(30vw, 17svh), 9.5rem)"
    fontWeight: 600
    lineHeight: 0.84
    letterSpacing: "0.004em"
  headline:
    fontFamily: "Thunder, sans-serif"
    fontSize: "clamp(3rem, 6vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.018em"
  body:
    fontFamily: "Karla, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  description:
    fontFamily: "Karla, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  data:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "1rem"
  action:
    fontFamily: "Karla, sans-serif"
    fontSize: "0.78125rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.16em"
  navigation:
    fontFamily: "Karla, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.01em"
  field:
    fontFamily: "Karla, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  headline-compact:
    fontFamily: "Thunder, sans-serif"
    fontSize: "clamp(3rem, 10.8vw, 5rem)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.018em"
  photographic-display:
    fontFamily: "Thunder, sans-serif"
    fontSize: "clamp(3.75rem, 7vw, 7rem)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.018em"
  photographic-display-compact:
    fontFamily: "Thunder, sans-serif"
    fontSize: "clamp(3.5rem, 12vw, 5rem)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.018em"
  content-title:
    fontFamily: "Thunder, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 600
    lineHeight: 1
  gallery-lead-title:
    fontFamily: "Thunder, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 600
    lineHeight: 1
  location-place:
    fontFamily: "Thunder, sans-serif"
    fontSize: "clamp(2rem, 2.7vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1
  compact-title:
    fontFamily: "Thunder, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1
  starting-price:
    fontFamily: "Thunder, sans-serif"
    fontSize: "clamp(5rem, 9vw, 8rem)"
    fontWeight: 600
    lineHeight: 0.95
  starting-price-compact:
    fontFamily: "Thunder, sans-serif"
    fontSize: "6.5rem"
    fontWeight: 600
    lineHeight: 0.95
  calculated-price:
    fontFamily: "Thunder, sans-serif"
    fontSize: "clamp(3.5rem, 5vw, 5rem)"
    fontWeight: 600
    lineHeight: 1
  booking-total:
    fontFamily: "Thunder, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 600
    lineHeight: 1
  guest-control-glyph:
    fontFamily: "Karla, sans-serif"
    fontSize: "1.375rem"
    lineHeight: 1
  guest-value:
    fontFamily: "Karla, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.65
  disclosure-glyph:
    fontFamily: "Karla, sans-serif"
    fontSize: "1.5rem"
  caption:
    fontFamily: "Karla, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.4
  inventory:
    fontFamily: "Karla, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  rate-table:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  rate-table-compact:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.65
  footer-contact:
    fontFamily: "Karla, sans-serif"
    fontSize: "clamp(1.125rem, 2vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.65
  footer-legal:
    fontFamily: "Karla, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  mobile-contact-action:
    fontFamily: "Karla, sans-serif"
    fontSize: "0.68rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.08em"
rounded:
  control: "3px"
  thumbnail: "2px"
  pill: "999px"
  circle: "50%"
spacing:
  gutter-compact: "24px"
  gutter-medium: "40px"
  gutter-wide: "clamp(64px, 10vw, 176px)"
  section: "clamp(88px, 10vw, 160px)"
  header-gap: "48px"
  inventory-gap: "64px"
  gallery-gap: "16px"
  booking-gap: "32px"
components:
  roll-outline:
    backgroundColor: "transparent"
    textColor: "{colors.hero-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "0 30px"
    height: "58px"
  roll-solid:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "0 30px"
    height: "58px"
  roll-ghost:
    backgroundColor: "rgb(12 14 12 / 0.3)"
    textColor: "{colors.hero-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "44px"
  navigation-link:
    textColor: "rgb(245 244 239 / 0.82)"
    typography: "{typography.navigation}"
    padding: "6px 12px"
    height: "44px"
  language-trigger:
    backgroundColor: "transparent"
    textColor: "{colors.hero-ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  inquiry-field:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    typography: "{typography.field}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
    height: "48px"
  guest-control:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.circle}"
    size: "44px"
  calendar-day:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.circle}"
    size: "44px"
  gallery-cover:
    backgroundColor: "rgb(255 255 255 / 0.04)"
    textColor: "{colors.hero-ink}"
    rounded: "{rounded.control}"
    padding: "0"
---

# Design System: Chalet Beyond

## Overview

**Creative North Star: "Dark Timber"**

The established Dark Timber identity pairs a near-black ground, pale type and the existing chalet logo with real property photography. The owner-approved premium refinement lets the chalet carry the page: generous space, condensed headings, quiet prose and functional controls.

The hero retains its supplied footage, two-tone property name and authored letter entrance. Below it, the same identity becomes an editorial sequence of rooms, amenities, location and a direct inquiry. Motion clarifies arrival, image changes and user input; it does not add ornaments.

**Key Characteristics:**
- A continuous dark ground with photography carrying the product.
- Thunder headings, Karla prose and JetBrains Mono for actual tabular price data.
- Amber for actions, money and calendar selection below the hero.
- Stationary action targets, visible focus and reduced-motion alternatives.

Scope: merged with the existing hero documentation on 2026-10-01 against the implemented frontend. `PRODUCT.md` records property and hero authority; `docs/frontend-premium-implementation.md` pins the approved below-hero contract. The frontmatter records reusable values actually used on shipped surfaces, not the dormant UI catalogue.

## Colors

Warm low-chroma neutrals support one functional amber accent. Keep the source CSS color notation; the frontmatter is normative.

### Primary
- **Amber (`primary`)** carries below-hero actions, prices, savings and selected dates. The header changes from pale to amber once the hero is behind it.

### Neutral
- **Dark timber (`background`)** unifies the document, page sheet and footer.
- **Pale text (`foreground`)** is the main reading color. **Muted text**, **secondary text** and **description text** support hierarchy without using amber.
- **Quiet divider (`border`)** separates summaries, inventories and footer details; **control edge (`control-border`)** outlines form fields and circular controls.
- **Hero ink**, **hero dark** and **hero sand** retain the existing hero's local text, control and two-tone title treatment.
- **Validation (`validation`)** communicates date and inquiry errors; it is a semantic state, not a decorative accent.

#### Photographic overlays and control states

- **Photographic timeline line (`photo-timeline-line`)** keeps the location timeline visible against its photograph. **Photographic control line (`photo-control-line`)** outlines the gallery open affordance. These white-alpha edges are distinct from readable prose colors.
- **Photographic control hover (`photo-control-hover`)** is the lightbox navigation hover surface; **control hover (`control-hover`)** is the pale circular guest/day hover surface. Neither is a text color.
- **Gallery surface (`gallery-surface`)** is the faint neutral ground under a gallery photograph while it loads. It does not establish a reusable raised card palette.

**The Functional Amber Rule.** Below the hero, amber marks actions, money and calendar selection. Keep editorial prose and descriptive headings neutral; retain the existing hero and navigation exceptions.

## Typography

**Display:** Thunder SemiBold LC, supplied by the owner. **Body:** Karla. **Data:** JetBrains Mono. All are locally served with `font-display: swap`; Thunder supplies the Latin Extended glyphs and Karla/Mono have Latin and Latin Extended files. All heading levels use Thunder. Body defaults to Karla (400, 1.65 leading); recurring prose uses the `body` and `description` roles above.

- `display` is the hero title only: two lines with the existing two-tone treatment. Its viewport-height cap leaves space under the header on short screens.
- `headline` is the section heading, with `headline-compact` below 768px. `photographic-display` and its compact variant belong to the photographic interlude. `content-title` is the shared amenity/gallery/summary/lightbox title; `gallery-lead-title` enlarges the leading cover. `location-place` names locations and becomes `compact-title` below 768px, as does the lightbox heading.
- Short section descriptions use `description`, becoming `body` size below 768px. Longer prose stays near 17–18px with generous leading; section descriptions cap at 44ch.
- `starting-price`, `starting-price-compact`, `calculated-price` and `booking-total` record the actual monetary hierarchy; they do not form a general heading scale. `guest-control-glyph` and `guest-value` belong to the controls. `disclosure-glyph` sizes a plus indicator, not the inventory or table text.
- `inventory` records regular property-list copy. `caption` records photograph captions. `footer-contact` scales telephone/email prominence, while `footer-legal` retains normal readable text. `mobile-contact-action` is a constrained button label only and must not be reused for body or legal copy.
- JetBrains Mono appears in the detailed rate table's price cells through `rate-table`, becoming `rate-table-compact` below 370px. Dates, counters and summary values otherwise use Karla with tabular numerals; large prices use Thunder. Do not turn every label into a mono eyebrow.
- RollButton uses the action role, uppercase; its small variant uses 0.71875rem and 0.14em tracking. Navigation uses Karla. The language trigger is Karla 600 at 0.75rem with 0.06em tracking.
- Hero description is Karla 400 at 1.0625rem/1.5, increasing to 1.1875rem from 1024px. Hero facts retain Thunder values and Karla labels.

## Layout

The shared editorial container is centered with a 1600px maximum. Gutters are 24px, 40px from 640px and the responsive hero inset from 1024px. Section padding scales between 88px and 160px. Editorial splits, large photographs and open inventories establish hierarchy; section boundaries keep the continuous ground.

The intro uses a 1.1fr/1fr split and a 4:5 photograph; its facts form three columns. The gallery uses four columns and two 260px rows with its leading photograph spanning two columns and two rows. Below 1024px it becomes two columns; below 768px it becomes one. Featured amenities are three columns above 768px and one below. The location timeline has four columns, then two below 768px. Price narrative and calculator are paired columns, then stack below 768px.

Booking stays in one column below 1280px. At 1280px it reserves at least 648px for two calendar months, a 32px gap and a 330px summary. Day buttons and navigation controls remain 44px. The summary sticks at `calc(var(--nav-height) + 24px)` (124px at desktop widths). At 1280px and wider on viewports at most 750px tall, its title margin contracts to 16px and summary-list bottom margin to 24px. All summary stages return to static flow at heights at most 700px; contact and success stages do so at heights at most 1000px. Narrow calendars below 370px use an 18px negative inline margin to preserve target width.

Hero and navigation keep their distinct layout. The hero is at least 100svh; desktop layout is at least `max(700px, 100svh)`. Hero copy indents from the header gutter on desktop, actions share a row from 640px, and four bottom facts become a 2×2 grid below it. The header's inner bar is 72px high; the 28px contact strip appears from 768px, making `--nav-height` 100px. Full navigation links appear from 1280px. Header gutters remain 24/40/64px rather than inheriting the wider editorial inset.

The fixed mobile contact bar appears below 768px after the hero, gives its inquiry action a larger column than its phone action and respects safe-area insets. The footer reserves space for that bar. Anchor offsets read the shared header height.

## Elevation & Depth

Photography and static contrast scrims supply depth; text and controls remain flat. The below-hero sections use no repeating raised panels or decorative shadow vocabulary. The existing hero handoff is the structural exception: the page sheet casts an upward shadow and amber hairline as it overlaps the hero, then its rounded top corners straighten. The language popup retains its localized floating shadow.

Navigation begins transparent, gains a near-opaque dark surface after scrolling and uses a dark menu overlay. There is no backdrop blur. Gallery scrims stay on photographs; location adds shade behind its text while retaining mountain detail on the right.

## Shapes

Pills belong to RollButton, language and contact controls. Circular shapes belong to guest/date controls, gallery navigation and the existing hero pointer. Form fields and gallery covers use the small control radius; thumbnails use the smaller thumbnail radius. Photographs otherwise remain rectangular. Do not promote the handoff's animated sheet corners into a card style.

## Components

**RollButton / RollLink:** one shared action primitive with outline, solid and ghost tones, and large/small sizes. The hero CTA remains outline; the header is pale solid over the hero and amber below it; below-hero solid actions are amber. A wider ellipse rises to fill the pill over 560ms while the label rolls; the hit area stays in place. The pressed state scales to 0.98. Reduced motion uses a color change with the label stationary. Inquiry actions use the same primitive at 56px height and full summary width.

**SectionHeader and RevealPhoto:** heading lines reveal through masks once (520ms, 60ms stagger); their description rises 14px with a brief blur. Photographs decode before a downward wipe and 1.08→1 scale settle (1000ms). Reduced motion uses 240ms opacity. Content starts visible so animation is progressive enhancement. Two photographic backgrounds use native view timelines for −6%→6% vertical drift; unsupported browsers and reduced motion keep them static.

**Gallery:** five category covers use real photographs, neutral captions and a circular open affordance. Desktop hover scales the inner photograph to 1.04; reduced motion omits the scale. The lightbox opens from the clicked photograph's geometry (FLIP), supports keyboard navigation, Escape, focus containment/return and touch drag. Controls and captions fade in; reduced motion uses opacity. These are functional media interactions, not a general modal/card template.

**Guest controls, values and inquiry fields:** pricing and booking share guest state; circular controls enforce the property capacity. Values crossfade with at most a 4px rise and brief blur over 240ms; they never count through intermediate amounts. Inputs use a transparent ground, quiet border, visible labels, pale focus and amber caret. Error text remains close to the relevant interaction. A date selection is an inquiry step and does not claim a confirmed booking.

**Navigation:** retain the recolored existing logo at 46px, Karla links with a directional amber underline, the pill flag/code language dropdown and circular menu toggle. Selected languages have a pale translucent fill. The mobile menu uses Thunder links; closed contents remain inert and hidden from accessibility navigation. Pale focus outlines use a 4px offset in hero/header and 5px in the editorial surface.

**Preserved hero media and entrance:** video starts at every width, using 720p60 from 1024px and 720p30 below; Save-Data or reduced motion keeps the poster. Playback pauses offscreen or when hidden and preserves a manual pause. The footage has cuts and is not a seamless loop. Scroll does not seek it. Each title letter starts at the hero center, fades/scales through the first 16% of its 680ms and glides into place, 34ms apart. BEYOND starts when CHALET's last letter is halfway in. The curtain lifts after the first decoded frame between 650ms and 1.6s; footage settles from 1.07 to 1 over 2.4s. Copy, CTA and facts rise behind the title (820ms, 620–1060ms delays); the header arrives after 280ms. Reduced motion skips the entrance.

The existing 30px pointer ring follows a fine mouse pointer within the hero (0.3 of remaining distance per frame) and dissolves over links/buttons. It writes directly to the DOM and runs only while catching up. Tab, pointer exit, scroll, blur or hiding the page clears it. It is confined to the hero.

**Motion and loading:** CSS and `lib/motion.ts` share UI/state/modal/section/cinematic durations (160/240/420/520/1000ms) and UI/enter/move/drawer easing. HeroHandoff uses the shared lazy Motion features. Below-intro PageStory loads when within 600px, on a known anchor or large scroll jump, or after 4s plus idle; anchor positions are restored after mounting. Booking loads separately within 1200px while its heading/anchor remain available. These boundaries protect first-screen motion without hiding the rest of the document indefinitely.

**The Real Property Rule.** Use the owner-selected chalet photographs with truthful localized descriptions. Preserve the originals and do not substitute stock or generated interiors.

**The Motion Purpose Rule.** Use the shared motion vocabulary for content arrival and functional state changes. Add no new cursor effect, ornamental panel, counting number, glow or magnetic action below the hero.

The sidecar contains visual extracts of actual reusable primitives, with expanded CSS and inline icons. It does not simulate booking, calendar selection, video, gestures or application state. Owner photographs are served as AVIF/WebP at 640/1024/1600/2400px with intrinsic dimensions and localized alt text.

## Do's and Don'ts

- Do retain the existing logo and the Thunder, Karla and JetBrains Mono role separation.
- Do keep photographs, heading masks and motion wrappers separate so effects do not overwrite one another.
- Do preserve 44px calendar and guest controls, visible focus and reduced-motion behavior.
- Do keep prices and inquiry details consistent with the shared pricing and guest state.
- Do preserve the hero composition and its specific entrance as an existing authored exception.
- Don't reintroduce Bebas Neue, legacy amber/ghost button utilities or decorative glow.
- Don't turn descriptive sections into repeated bordered cards or add new ornaments below the hero.
- Don't make the hero's two-line title, local sand color or lower-left composition mandatory for every section.
- Don't invent ratings, distances, payment conditions, response times or instant-booking guarantees.
- Don't gate hero autoplay on network guesses; Save-Data and reduced motion remain the opt-outs.
