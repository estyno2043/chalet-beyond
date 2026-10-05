# Frontend premium validation — 2026-10-01

Implemented against the owner-supplied [plan](../source/frontend-premium-plan.md)
and [implementation contract](../frontend-premium-implementation.md), on
`claude/brave-davinci-udk7jh`. Local previews: development `http://localhost:3000/`,
production build `http://localhost:4180/`. No public deployment or push.

## Delivered surface

Owner photography replaces the legacy Booking library: 20 selected originals,
AVIF/WebP at 640/1024/1600/2400px, versioned filenames, responsive picture sources,
explicit dimensions and immutable photo cache. Source originals are preserved.

Thunder/Karla, one dark timber base, shared editorial gutters and RollButton
actions replace the repeated ornamental cards/labels. Sections: introduction,
asymmetric gallery, photographic pause, three amenities plus inventory,
surroundings, family pricing, two-step inquiry and contact footer. The old text
reveal, quote, progress bar, dead hero implementation, unused GSAP/Lenis and Bebas
assets are removed.

Motion uses once-only masked headings, decoded photo reveals, CSS scroll-photo
motion, spatial gallery transitions and functional state crossfades. Reduced
motion uses opacity and static scroll photographs. Hero composition and title
choreography are preserved.

Prices and inquiry share adult/child state. Verified family example: two adults
and four children = €475/night; three nights = €1,425. Booking comparison reflects
repository rates, not a live quote. Phone is optional. Calendar is localized in
SK/DE/EN/PL, Monday first, with 44px targets. Occupied arrivals and spans are
rejected; a first occupied night can be a checkout date.

At 1280×720, two months and the adjacent summary fit without overflow: calendar
right edge 790px, summary left edge 822px, sticky top 124px, summary height
580.55px. Taller contact/success states release sticky positioning; very short
windows use normal flow.

## Automated and browser checks

- `pnpm check`, `pnpm build`: pass. Existing analytics-placeholder comment warning
  remains; no undefined analytics URL is requested.
- `pnpm test`: 69 tests across 7 files pass.
- `scripts/verify-premium-browser.cjs`: family pricing, shared guests, three-night
  total, inline date validation, optional-phone payload, mocked success focus,
  gallery portal/scroll lock/focus return, immediate keyboard navigation, pointer
  gestures and reduced motion pass.
- `scripts/verify-premium-edge-cases.cjs`: occupied nights, checkout boundary,
  blocked spans, `dates_taken` 409, field-focus mobile-bar hiding, CDP touch swipe,
  downward dismissal and failed-availability notice pass.
- `scripts/verify-premium-loading.cjs`: cold hero CTA, cold pricing hash, adjacent
  1280px layout, entire sticky summary at 720px height, 44px targets and no overflow
  pass. Deferred editorial content also loads after 4s + idle without a scroll;
  large scroll jumps and anchor clicks trigger loading immediately.
- EN/PL locale smoke checks, German404 and reduced-motion mobile checks pass.

Browser scripts accept `PLAYWRIGHT_PATH` and `TEST_BASE_URL`. Chrome is used via
Playwright. All inquiry POSTs are mocked; no owner or guest email was sent.

## Performance

[Lighthouse results](premium-lighthouse.json) preserve every final run, method,
timestamp, LCP, TBT and CLS. Final mobile scores: **92, 92, 92** (median **92**); desktop **100**.
Accessibility **100** and CLS **0** in every run. Both performance gates pass.
Three serial cold simulated-mobile runs and one desktop run use production Vite
preview, without concurrent browser checks.

Critical CSS fell from 138.2KB to 52.2KB (gzip 23.6KB to 11.5KB); initial JavaScript
from 166.5KB to 105.6KB gzip. Below-intro code is deferred until near the viewport,
direct navigation or background idle; the calendar and gallery gesture code load
separately. Each anchor remains available while code loads.

[Production 4× CPU trace](premium-scroll-4x.json): 144 frames, p95 ≈ 16.8ms, zero frames
over 50ms across a 2.4s hero-to-intro scroll. This is a short desktop trace, not
proof for every device or the entire page. Invalid paint-bound sentinel
coordinates are omitted; no full-sheet repaint claim is made.

## Visual evidence and review

Section and actual-viewport captures are stored locally under
`.impeccable/review/final/{sk,de}-{1440,1280,900,390,320}/`. The full matrix includes
SK/DE desktop 1440, desktop 1280×720, tablet 900, mobile 390 and mobile 320.
Full-section captures hide fixed navigation/action bars to avoid screenshot
artifacts; `viewport-*.png` captures retain them. Gallery, inquiry success,
reduced-motion and 404 captures are stored under `.impeccable/review/`.

The independent finish reviewer initially returned `fix`: restore adjacent
booking at 1280 and raise mobile Lighthouse above 85. Final fix-list verdict is
**ship**, both fixes **resolved**, after refreshed captures. This verdict covers
the two scored material fixes. See [review record](premium-review.md).

The initial Impeccable detector reported 37 design-system advisories against stale
documentation, zero hard antipatterns. DESIGN.md and its sidecar are refreshed
from the built surface, including observed responsive typography and photographic
overlay roles. Final owner-plan acceptance scan reports **0 findings** on the
changed below-hero surface. No runtime styles were changed to silence advisories;
the documentation now describes the implemented system. The pinned plan's final
zero-findings requirement took precedence over the skill's usual single-scan
workflow.

## Limits and owner facts

Local Netlify functions run on 8888. Live read-only availability returns
`ical_not_configured`; the page states that dates must be confirmed by email.
Production calendar/email configuration and live delivery were not validated.
Physical iPhone/Safari remains untested; Chromium touch emulation is not an iPhone.

Unconfirmed bed types, distances, payment conditions and 24h response promises
are omitted. Hero rating/count remains outside this below-hero redesign and
needs its separate owner decision. Existing rates/cancellation terms should be
reverified when the owner changes the offer.
