# Mobile Safari follow-up — 2026-10-01

User evidence: iPhone screenshots showed hero facts behind expanded Safari controls, a jumping hero handoff during reverse/inertial scroll, and a partially hidden gallery image. Source of truth for the new tariff: attached Standard Rate screenshot and explicit child/weekly-discount instructions.

Implementation used GPT-6 Sol / High agents for hero layout and handoff, photo reveal, pricing, plus an independent read-only motion audit. Root integrated server pricing, i18n, scripts and the final checks.

## Changes and diagnosis

| Before                                                                                                                                               | After                                                                                                                                                                  | Why                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile hero used the full desktop handoff: scroll-driven translation, scale, corner radius, dim layer and large sheet shadow.                        | Below 768 px hero and sheet use ordinary document flow. Desktop handoff is preserved.                                                                                  | Removes those scrolling style updates and layers from touch scrolling. A migration to Next.js or GSAP would not itself fix Safari viewport behavior.                                        |
| Mobile headline, direct phone block and proof spacing exceeded the short initial viewport. Missing sheet could also mark the hero as already passed. | Compact mobile rhythm, stable `100svh`, phone available through existing contact paths, missing-sheet state stays false.                                               | CTA and all four facts fit the tested short viewport; the web contact bar stays absent at cold load and after returning to the top. Safari controls themselves are outside website control. |
| Clip-path shutter animation waited for decode; start timing depended on image loading and stagger delay.                                             | A 1px midpoint marker triggers a CSS opacity/scale reveal when the photo midpoint reaches 75% viewport height. IO prewarms 800 px ahead; late decode skips the reveal. | No continuous per-photo scroll reads. Fast jumps have a card-entry fallback; reverse scrolling never hides an already revealed photo. Reduced motion uses opacity only.                     |
| Old hardcoded 315 € starting price, stale Booking comparison and no weekly/datetime offer engine.                                                    | Base tariff 300/300/350/400/500/600/650/700 €, children 40 €/night, 7+ nights −20%, shared dated offers.                                                               | One quote engine serves browser and server. Base, applied discount and final price reconcile in the summary and both emails.                                                                |
| New discount row initially made the desktop summary exceed a 720 px viewport.                                                                        | Short desktop heights use tighter vertical spacing.                                                                                                                    | Discounted German summary now spans y=124–682.94 at 1280×720 in both engines.                                                                                                               |

The exact cause of physical Safari jitter is not proven by these tests. The installed Framer implementation measures `offsetTop`/`clientHeight`; a transformed-bounding-rect feedback loop was considered and rejected as an explanation. The verified change is removal of the mobile hero's scroll-linked Framer styles. Native CSS photo parallax remains in later sections.

## Pricing policy and assumptions

The supplied table is used directly as the website base tariff. Whether it was originally a Booking extranet table remains unconfirmed; no additional marketplace discount or comparison is inferred. Minimum stay is 2 nights, at least 1 adult, maximum 8 total guests. Children aged 0–15 have a base €40 nightly surcharge.

Weekly discount applies to the entire base stay, including children. Dated percentage offers apply only to eligible nights; fixed offers replace the adult tier and retain child surcharges. Overlapping offers choose the lowest night rate. The dated-offer whole quote is compared with the weekly whole quote and the lower total wins; discounts do not stack. Checkout day is not billed. Monetary values round to cents and calendar-day calculations handle DST.

`shared/pricing-promotions.ts` is the versioned entry point. No dated offer is active by default. Updating it requires rebuilding/deploying browser and server together. This is not a protected admin UI. See `docs/pricing-promotions.md` for examples and date-boundary rules.

The new nightly breakdown allocates one row per night. A shared 3,660-night resource bound rejects implausibly long requests before allocation or availability checks. Such requests require an individual quote; ordinary stay pricing is unaffected.

## Current verification

- `pnpm check`, `pnpm build`, `git diff --check`: pass. Build still reports the pre-existing unset `VITE_ANALYTICS_ENDPOINT` placeholder warning.
- `pnpm test`: **70 tests in 8 files pass**, including 15 pricing cases and 4 real-handler tests with mocked email delivery. Forged frontend totals do not affect the server quote; weekly and dated offers appear consistently in owner and guest emails.
- `verify-mobile-followup.cjs`: **8 Chrome/WebKit cases**, SK/DE/EN/PL, 430×740 / 390×664 / 375×600 / 320×568. Cold CTA/facts fit, no initial contact bar or horizontal overflow, stable hero/sheet document coordinates during down/up scroll, viewport resize and return-to-top state. Photo midpoint, fast jump, once-only reveal and reduced motion pass.
- `verify-pricing-followup.cjs`: **4 Chrome/WebKit cases**, German 1280×720 and Slovak 390×664. Two adults + two children: 6 nights €2,280, 7 nights €2,128 (base €2,660 minus €532). Eight adults for 7 nights: €3,920. Capacity including children and desktop summary geometry pass.
- Existing production browser, edge-case and loading scripts pass: cold hero booking navigation, shared guest state, optional-phone inquiry success, localized 409 dates conflict, occupied-night handling, gallery portal/focus/keyboard, pointer and CDP touch gestures, keyboard-contact-bar hiding and 44px calendar targets. Inquiry APIs are mocked; no real emails were sent.
- Independent motion review: no concrete hero/reveal defect found. Physical Safari remains outside verification scope.
- Impeccable static detector: one advisory for the existing desktop `1.1875rem` type step in `hero.css`, no other findings. Raw advisory retained in `mobile-followup-detector.json`.

## Performance evidence

Three fresh Chrome touch-fling runs at 390×664 and 4× CPU throttling: hero document geometry stable; rAF p95 **16.7 / 16.8 / 16.7 ms**, zero rAF samples above 50 ms and no observed long tasks. Captures include measurement overhead and the first hero-to-intro transition. This measures browser rAF cadence, not physical iPhone/compositor FPS or the whole page.

Serial production Lighthouse cold runs: mobile **92 / 92 / 92**, desktop **100**, accessibility **100** in each run, CLS **0**. Simulated mobile LCP **3.23 s**, TBT **46 / 1 / 36 ms**. Desktop LCP **0.62 s**, TBT **0 ms**. These load metrics do not prove Safari inertia behavior.

Raw evidence: `mobile-followup-browser.json`, `mobile-followup-pricing.json`, `mobile-followup-scroll.json`, `mobile-followup-lighthouse.json`. Local screenshots: `.impeccable/review/mobile-followup/` (ignored by Git).

## Device limit and local preview

Chrome and Playwright WebKit render tests do not reproduce iOS Safari's changing toolbar, rubber-band behavior, GPU budget or physical touch physics. A physical iPhone retest is required for those specific symptoms.

Updated production preview: `http://192.168.68.101:4180/`, HTTP 200 verified through LAN IP. Devices must share the network. No public deployment or remote push was performed.
