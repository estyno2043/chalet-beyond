# Owner feedback round — 2026-10-05

Source: owner review of the merged Codex frontend (screenshots of the SK page).
Workflow: DESIGN-BUILD.md (Impeccable → Emil Kowalski → libraries), mobile-first
(design 375 px first, then desktop), surgical changes, verify by measuring.
Less text is better ("čím viac textu, tým menej zaujímavé").

## Batch A — hero bar + section under the hero
A1. Hero top bar: remove the section links (Chalet, Priestory, Okolie, Cenník,
    Rezervácia) from the desktop bar. In their place a second CTA button
    (ghost/secondary next to the primary "Rezervovať"). Section links stay in
    the mobile/burger menu.
A2. After the visitor scrolls past the hero, the contact info (phone, e-mail)
    appears in the bar with an animation (it is not shown over the hero).
A3. Section directly under the hero ("250 m² len pre vašu partiu."): the empty
    black background gets a panoramic photo of the chalet with the Magic UI
    Meteors effect, at low opacity so the content on top stays readable. The
    owner will supply a NIGHT version of the chalet photo later — use the best
    wide exterior from `assets/photos/lomnica/` now, behind one constant so the
    swap is a one-line change.
A4. Centre the headline of that section and give it an effect — Magic UI
    "Line Shadow Text" (owner's first suggestion; slide-up-by-word was the
    alternative).
A5. Remove the text "Celý chalet pre najviac osem hostí. Súkromná sauna,
    vírivka a Tatry za oknom." (all 4 languages).

## Batch B — gallery + amenities
B1. Remove "Prezrite si priestory ešte pred príchodom." (gallery section
    description, all languages) — the heading already says it.
B2. Gallery lightbox: the prev/next arrows overlap the photo — move them
    beside each other at the bottom, below the photo.
B3. Keyboard arrow navigation in the lightbox must animate the transition the
    same way as clicking/swiping (now it jumps).
B4. Amenities cards (Sauna / Vírivka / Kozub): the "Vírivka" card shows the
    wrong photo (a car under the carport) — use a real hot-tub photo; remove
    the descriptions under the card titles.

## Batch C — Okolie + map
C1. "Hory na dosah. Domov v Lomnici." section: remove the description
    paragraph under the headline.
C2. Under the divider line the place titles (Black Stork, Tatranská Lomnica,
    AquaCity Poprad, Poprad–Tatry) keep their descriptions; animate those
    descriptions with Magic UI "Text Reveal".
C3. Move "Otvoriť mapu" one section lower and put the Magic UI animated
    "Globe" next to it (desktop: side by side). Mobile: the globe, and the
    "Otvoriť mapu" button below it.

## Round 2 (owner, same day)

### Batch D — pricing section ("Vaša priama cena.")
D1. The dark empty background gets a subtle effect or a photo at low opacity
    (same family as A3; keep text readable).
D2. The big per-night price figures ("315 €", left hero price and right
    "Vaša cena") get the Line Shadow Text effect.
D3. Fix the spacing below the big "315 €" figures and above the small "od"
    label (too much air between "od" / figure / "/ noc").
D4. Highlight and underline "Porovnanie podľa zverejneného cenníka. Konečný
    termín a cenu potvrdíme pri dopyte." (all languages).
D5. "Zobraziť všetky ceny" disclosure opens like a dropping blind (height +
    slats/clip reveal), the "+" rotates into "×", and back on close.

### Batch E — booking section ("… voľný termín.")
E1. The right "Váš pobyt" summary starts higher (aligned with the top of the
    section) and stays sticky on screen while scrolling, settling at the
    calendar — fills the empty space.
E2. Remove "Vyberte dátumy a pošlite dopyt priamo majiteľovi." (all languages).
E3. Underline "Bezplatné storno do 14 dní pred príchodom · Min. 2 noci".
E4. "Pravidlá domu" disclosure uses the same blind animation + "+"→"×" as D5
    (one shared component).

### Batch F — footer
F1. Background with a low-opacity photo/texture instead of flat black.
F2. Replace the logo with the text "CHALET BEYOND" that fills on scroll like
    water poured into the letters (wave effect), plus the house SVG icon.
F3. Underline the important info (phone, e-mail) and fix spacing.
F4. Add company name and IČO (owner to supply — render from one constant,
    hidden while empty). Legal pages are out of scope (later review).
