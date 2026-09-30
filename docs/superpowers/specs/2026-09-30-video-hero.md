# Desktop video hero

Scope: replace the home hero inside the established Dark Timber identity. The
user delegated visual direction and requested the supplied AFTER.mp4, a strong
CTA, honest information, minimal premium styling and restrained motion.

## Direction contract

- Visitor mode: Persuade. Read the property name, understand the accommodation,
  then check availability. Secondary action opens the existing gallery.
- Preserve Bebas Neue, Karla, the existing logo, dark surfaces and amber accent.
- Taste dials: DESIGN_VARIANCE 6, MOTION_INTENSITY 4, VISUAL_DENSITY 3.
- First viewport: exterior footage fills the screen. A compact, left-aligned
  two-line CHALET / BEYOND anchors the lower left, followed by a factual sentence,
  capacity information and a clear light CTA. Architecture remains visible on
  the right. No cards, review badges, coordinates, scroll cue or decorative glow.
- Signature interaction: one short, staggered type entrance using opacity and
  transform. Video continues at its own pace; scroll never seeks the video.
- User follow-up: a fine-pointer-only cursor ring expands over hero actions;
  action contents move at most 4 px horizontally and 3 px vertically. Native
  cursor and hit areas remain intact. Coalesced pointer updates, no React state
  on pointer movement, no idle animation loop, disabled for reduced motion.
- Mobile/tablet: poster first, same content and CTA. Playback is opt-in. A small
  landscape viewport may grow vertically to preserve content and touch targets.
- Keep an image visible until the first video frame. Pause offscreen/when hidden,
  respect reduced motion and Save-Data, preserve manual pause on return.
- Copy source: PLAYBOOK.md and existing property data: Velka Lomnica, private
  chalet, 250 square metres, 3 bedrooms, maximum 8 guests. Price and current
  reviews are not newly verified; no price or rating claim in this change.
- No new runtime dependencies. 720p/60 fps desktop video; 720p/30 fps manual
  compact playback. Same-source poster loaded eagerly. Versioned media caching.
- MCP reference: Watermelon hero-26 informed left-aligned grouping and staged
  entrance; its illustration, social proof, glass, spring motion and assets are
  not part of this implementation. Supplied property media is authoritative.

## Implementation and verification

1. Add media and a unified hero with a native playback lifecycle, localized copy,
   accessible controls and anchor links.
2. Tune the existing navigation for contrast and usable intermediate widths.
   Keep routes, section IDs and link meanings.
3. Verify types, existing tests and production build. Browser checks cover
   desktop, mobile, tablet, long German copy, reduced motion, failed video,
   manual pause/resume, offscreen pause, CTA target and media request selection.
4. Capture one desktop/mobile batch, fix material issues together, then confirm.
   Run Lighthouse on the production build; distinguish local lab results from
   live deployment and physical device evidence.

## Honest limits

The provided footage contains cuts and the loop returns from a different final
shot. This change does not claim a seamless loop. The existing inquiry backend's
production configuration is outside the hero scope. The CTA promises an
availability check, not an immediately confirmed booking.

## Media and delivery

Source: user-supplied `/Users/goat/Downloads/BEYOND HERO/AFTER.mp4`, 1920×1080,
approximately 59.67 fps, 12.05 seconds, 43,496,873 bytes including audio.
Original remains untouched. Exported media lives in `client/public/media/hero/`:

- `exterior-720p60-v1.mp4`: 1280×720, 60 fps, H.264 yuv420p, silent,
  faststart, 4,768,234 bytes (4.55 MiB). Desktop autoplay variant.
- `exterior-720p30-v1.mp4`: 1280×720, 30 fps, silent H.264 faststart,
  3,136,819 bytes. Manual compact playback.
- `exterior-poster-v1.webp`: first frame of the same source, 1600×900,
  156,496 bytes. Shown immediately and held until a decoded video frame exists.

The 60 fps export uses FFmpeg `scale=1280:720:flags=lanczos,fps=60`, libx264,
CRF 21, preset slow, maxrate 3M, bufsize 6M, GOP 120, `-an -movflags +faststart`.
It conforms a near-60-fps source to 60 fps; it does not invent additional motion.
Use a new versioned filename whenever replacing an asset because Netlify caches
these URLs for a year. Browser Range requests work in the local preview (206).

The navigation icon is a 96×96 derivative of existing `client/public/logo.png`.
Fonts retain the established families, now served locally; OFL licenses ship
beside their WOFF2 files. Production excludes Manus editor instrumentation;
development retains it.

## Verification, 2026-09-30

- TypeScript passed; existing Vitest suite passed 61/61; production build passed.
- Chrome checks at 1440×900, 1280×720 (German), 768×1024, 390×844 and
  320×568 (German): no horizontal overflow, primary CTA visible in first viewport.
- Desktop uses one 720p60 video. Pause/resume, offscreen pause, return resume and
  manual pause persistence passed. Video error preserves poster, copy and CTA.
- Mobile/tablet, reduced motion and simulated Save-Data issue no initial MP4
  requests. Explicit mobile playback selects 720p30.
- Cursor hover, bounded magnetic content, keyboard reset and no cursor DOM writes
  during a 300 ms idle observation passed. Native hit targets remain stationary.
- Primary CTA reaches `#rezervacia`, 72 px below the fixed navigation.
- Local Lighthouse after production instrumentation removal: desktop performance
  99, accessibility 100, LCP 0.9 s, TBT 10 ms, CLS 0. Simulated mobile performance
  81, accessibility 100, LCP 4.5 s, TBT 80 ms, CLS 0; no MP4 fetched on mobile.
  These are single local lab runs, not live field data or physical-device proof.
  Mobile loading is not fully optimized; the remaining page still has a large
  initial JavaScript bundle. No claim of zero performance cost or universal 60 fps.
- Detector on changed hero/navigation files returned no findings.
- Independent visual review requested the closed mobile menu leave keyboard and
  accessibility navigation. Added `inert` and `aria-hidden` while closed.
  Browser Tab checks passed for both closed and open states. Reviewer scored
  this fix resolved and returned `ship` for the listed fix on recaptured evidence.

Local capture and behavior evidence is kept under `.impeccable/review/` (ignored
by Git). Review covers this hero/navigation scope, not the entire landing page.
