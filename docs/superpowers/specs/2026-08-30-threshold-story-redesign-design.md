# Chalet Beyond — Threshold Story UX Redesign

**Dátum:** 2026-08-30

**Stav:** Smer A schválený; detailná špecifikácia čaká na kontrolu

**Vizuálny koncept:** Alpine Noir → Amber Refuge

## 1. Cieľ

Prebudovať prvý dojem a mobilnú konverznú cestu tak, aby stránka:

- okamžite vysvetlila hodnotu Chalet Beyond,
- ponúkla rezerváciu bez otvorenia menu,
- motivovala pokračovať v scrollovaní novou informáciou alebo interakciou v každej sekcii,
- odstránila sekanie desktopového scroll hero,
- zachovala tmavú prémiovú identitu, amber akcent a existujúce fotografie,
- fungovala rovnako zrozumiteľne s obmedzeným pohybom, pomalou sieťou a dotykovým ovládaním.

Primárny produktový výsledok: viac návštevníkov sa dostane od hero k výberu termínu. Analytika nie je súčasťou tohto zásahu; úspech sa preto overí výkonnostnými, funkčnými a použiteľnostnými kritériami v časti 13.

## 2. Rozsah

### Súčasť redesignu

- nový desktop hero `Threshold Story`,
- nový ľahký mobile/tablet hero,
- responzívna navigácia bez kolízií,
- zdieľaný motion systém,
- viditeľné CTA a proof strip,
- skrátené poradie landing page,
- kompaktnejšia galéria, vybavenie, poloha a cenník,
- dvojkrokový booking flow,
- mobilný sticky booking bar,
- plná podpora `prefers-reduced-motion`,
- responzívne a dotykové overenie.

### Mimo rozsahu

- nový rezervačný backend,
- online platba,
- nový CMS,
- zmena cien alebo storno pravidiel,
- nový foto/video shooting,
- prerábka serverových API mimo úprav potrebných pre existujúci booking flow,
- všeobecný refactor komponentov nesúvisiacich s týmto redesignom,
- pridanie Lenisu alebo iného smooth-scroll runtime.

## 3. Východiskový problém

Desktop hero dnes zaberá `520svh`, prednačítava tri MP4 súbory a v nekonečnom `requestAnimationFrame` cykle zapisuje `video.currentTime`. Browser musí počas scrollu opakovane seekovať komprimované video. Výsledok je oneskorená odozva, viditeľné skoky a zbytočná dekódovacia záťaž.

Mobile hero načítava 6,6 MB video bez posteru. Prvý viewport nemá viditeľné CTA. Stred stránky opakuje podobné card gridy a rovnaký fade-up pohyb. Booking zostáva dlhý jeden blok na konci stránky.

Po pridaní štyroch jazykov sa desktop navigácia nezmestí do dostupnej šírky a logo sa pri niektorých breakpointoch stlačí takmer na nulu.

## 4. Vizuálny smer

### Alpine Noir → Amber Refuge

Stránka začne chladnou majestátnosťou Tatier a postupne sa presunie do teplého súkromného interiéru. Amber farba znamená teplo, pohostinnosť a akciu. Nemá byť dekoráciou na každej karte.

Vizuálne pravidlá:

- čierna a tmavé drevo ostávajú základom,
- amber solid výplň patrí primárne rezervačným CTA a aktívnemu progresu,
- Bebas Neue sa používa na krátke titulky, nie dlhé odseky,
- JetBrains Mono ostáva na súradnice, proof údaje a malé technické popisy,
- veľké fotografie a negatívny priestor nahradia časť orámovaných kariet,
- každá sekcia dostane odlišnú kompozíciu; amber čiara + nadpis + grid sa nebude opakovať bez zmeny,
- text musí byť čitateľný bez animácie a bez prekrytia kľúčového predmetu fotografie.

## 5. Desktop Threshold Story

### Rozsah a breakpoint

- Aktívny od šírky `1024px`.
- Celková scroll dĺžka: `240svh` vrátane sticky viewportu.
- Sticky scéna: `100svh`.
- Tri kapitoly, každá približne tretina progresu.
- Žiadne scroll-seek video, zápis `currentTime` ani vlastný nekonečný rAF loop.

### Scény

#### 01 — Krajina

- Full-bleed exteriér: `/gallery/booking/856619975.jpg`.
- Eyebrow: existujúce súradnice a Veľká Lomnica.
- Hlavný benefit: súkromný chalet vo Vysokých Tatrách.
- Primárne CTA: lokalizovaný ekvivalent „Overiť dostupnosť“.
- Sekundárne CTA: lokalizovaný ekvivalent „Objaviť chalet“.
- Proof: hodnotenie `10` z `BOOKING_RATING`, kapacita 8 hostí, súkromný wellness.

CTA a proof zostanú dostupné počas celej hero sekcie. Text sa môže medzi kapitolami skrátiť, ale primárna akcia nezmizne.

#### 02 — Prah

- Tmavé pozadie a vertikálny obrazový otvor s `/gallery/booking/856619250.jpg`.
- Otvor sa rozšíri z približne 34 % na 56 % šírky viewportu.
- Pohyb vytvorí pocit otvorenia dverí, nie zoomu kamery.
- Copy komunikuje celý objekt, súkromie a priestor pre skupinu.

#### 03 — Útočisko

- Framed wellness obraz `/gallery/booking/846907929.jpg`.
- Amber svetlo sa rozšíri do spodnej časti scény a pripraví prechod do proof/intro obsahu.
- Copy komunikuje saunu, vírivku a pokoj po dni v Tatrách.
- Koniec hero nepoužije druhý obrovský `BrandReveal`. Logo zostane v navigácii; obsah prejde plynulo do nasledujúcej sekcie.

### Motion implementácia

- GSAP `ScrollTrigger` sa použije iba v desktop hero.
- Timeline vznikne cez `gsap.context()` a zanikne pri unmount alebo zmene media query.
- `gsap.matchMedia()` zapne pin len pre `min-width: 1024px` a `prefers-reduced-motion: no-preference`.
- Animované vlastnosti: `transform`, `opacity`, `clip-path`.
- Kapitoly sa prepnú v jasných prahoch. Žiadne kontinuálne seekovanie médií.
- Progres bude textový `01 / 03` s amber čiarou, nie päťpixelové body.
- Po zmene breakpointu sa inline GSAP štýly vyčistia.

### Reduced motion

Pri `prefers-reduced-motion: reduce`:

- hero nie je pinned,
- zobrazí sa prvá exteriérová fotografia,
- headline, proof a CTA sú okamžite viditeľné,
- interiér a wellness sa zobrazia ako statické obsahové karty pod prvým viewportom,
- navigácia a anchor odkazy používajú okamžitý scroll.

## 6. Mobile a tablet hero

Aktívny pod `1024px`.

- Výška `88svh` na mobile a maximálne `760px` na tablete.
- Prvý paint používa statický poster/fotografiu.
- Video nie je podmienkou zobrazenia obsahu.
- Ak zostane ambient video, spustí sa až po prvom painte, má komprimovaný mobilný variant a nepoužije sa pri reduced motion alebo `Save-Data`.
- Headline, rating a CTA sú viditeľné bez scrollovania a bez čakania na brand animáciu.
- Primárne CTA smeruje na `#rezervacia`.
- Sekundárna akcia smeruje na prvý obsahový blok.
- Brand reveal môže prebehnúť raz, ale nesmie blokovať text ani CTA.

Mobilný hero media budget: najviac 2 MB prenesených hero médií pred prvou interakciou. Logo musí dostať veľkostne primeraný variant namiesto 1024×1024 PNG.

## 7. Navigácia

- `>= 1200px`: plná navigácia, kompaktný jazykový prepínač a CTA.
- `768–1199px`: logo, aktívny jazyk, CTA a menu button; odkazy a ostatné jazyky v menu.
- `< 768px`: rovnaký kompaktný model s menšími horizontálnymi rozostupmi.
- Logo má explicitnú šírku, výšku a `flex: none`.
- Navigácia sa nesmie horizontálne scrollovať ani stláčať logo.
- Menu button, jazykové voľby a CTA majú minimálne `44×44px` interakčnú plochu.
- Pri otvorenom menu sa pozadie vyradí z focus poradia; Escape menu zavrie a focus sa vráti na button.

## 8. Nové poradie stránky

1. Hero.
2. Proof strip: Booking rating, 8 hostí, súkromný wellness, Black Stork PGA.
3. Skrátený intro blok.
4. Galéria.
5. Jeden manifesto/text reveal blok.
6. Prioritné vybavenie.
7. Poloha a aktivity.
8. Kompaktný cenník/odhad ceny.
9. Dvojkroková rezervácia.
10. FAQ alebo existujúce pravidlá v kompaktnom accordion tvare.
11. Footer.

`QuoteSection` sa odstráni z toku, pretože opakuje obsah manifesto textu. Jeho najsilnejšia veta môže nahradiť časť manifesto copy; nevznikne druhý samostatný citátový blok.

## 9. Sekcie a retencia

### Proof strip

Nový `ProofStrip` zobrazí štyri overiteľné fakty:

- `10` na Booking.com z `BOOKING_RATING`,
- maximálne 8 hostí,
- súkromná sauna a vírivka,
- Black Stork — jediné PGA ihrisko na Slovensku.

Na mobile ide o horizontálny snap strip s viditeľným kúskom ďalšej položky. Na desktope jedna rovná línia.

### Galéria

- Mobile album covers budú horizontálny snap carousel, nie päť vysokých blokov.
- Ďalšia karta zostane čiastočne viditeľná ako swipe affordance.
- Lightbox reaguje na drag počas gesta; nečaká až na touch-end threshold.
- Prednačí sa aktuálny, predchádzajúci a nasledujúci obrázok, nie všetky plné fotografie.
- Close, next a previous majú minimálne `44×44px`.

### Manifesto

- Reveal sa robí po riadkoch alebo slovách, nie po písmenách.
- Na mobile maximálne tri krátke bloky.
- Žiadne `transition: all`.
- Reduced-motion verzia je okamžite plne čitateľná.

### Vybavenie

- Prvých 6–8 najdôležitejších položiek zostane viditeľných.
- Zvyšok sa otvorí cez lokalizované „Zobraziť všetko“.
- Rozbalenie nemení scroll pozíciu skokom.

### Poloha

- Primárne sa zobrazí Black Stork, Tatry a letisko/doprava.
- Ostatné body sa presunú do kompaktného accordion alebo swipe stripu.
- Každá položka obsahuje konkrétny čas alebo vzdialenosť.

### Cena

- Sedem samostatných cenových kariet nahradí guest selector a jeden výsledok.
- Výsledok ukáže cenu priamo, cenu Booking.com a presnú úsporu.
- Zdroj cien ostáva `shared/pricing.ts`.
- Zmena počtu hostí sa okamžite premietne do booking summary.

## 10. Booking flow a zdieľaný stav

Vznikne úzko zameraný `BookingIntentProvider`, ktorý vlastní:

- `guestCount: number`, rozsah 1–8,
- `dateRange: { from?: Date; to?: Date }`,
- odvodený počet nocí,
- odvodenú priamu cenu a úsporu cez existujúce pricing utility.

Availability fetch, kontaktné polia a odoslanie dopytu zostanú v booking feature. Provider nesmie obsahovať sieťové volania ani form validation.

### Krok 1 — Termín a hostia

- Jasný loading stav dostupnosti.
- Kým feed čaká, dátumy nie sú prezentované ako potvrdené.
- Pri úspechu sa blokované termíny aplikujú pred potvrdením rozsahu.
- Pri zlyhaní feedu zostane výber povolený, ale stav bude označený „Termín overíme e-mailom“.
- Minimálne 2 noci a existujúce pravidlá ostávajú.
- Po platnom výbere sa objaví CTA s počtom nocí a cenou.

### Krok 2 — Kontakt a kontrola

- Zhrnutie termínu, hostí, ceny a úspory.
- Meno, e-mail a telefón používajú minimálne 16px text.
- Nepovinná poznámka ostáva.
- Submit jasne komunikuje nezáväzný dopyt.
- Po úspechu sa zobrazí existujúce potvrdenie a e-mail.

### Sticky booking bar

- Mobile-only, zobrazí sa po opustení hero.
- Pred výberom termínu: „Overiť dostupnosť“.
- Po výbere: počet nocí, celková cena a „Pokračovať“.
- Vedie na aktuálny booking krok.
- Call a WhatsApp ostanú v menu, booking sekcii alebo footeri; nebudú hlavnou dvojicou sticky akcií.

## 11. Motion systém

Globálne kategórie:

- `--motion-ui`: `160ms`, pre button, tab, accordion a focus feedback,
- `--motion-section`: `520ms`, pre jednorazové sekčné reveal,
- `--motion-cinematic`: `1000ms`, iba pre hero a jeden dominantný obrazový prechod,
- UI easing: `cubic-bezier(0.2, 0, 0, 1)`,
- vstupný easing: `cubic-bezier(0.16, 1, 0.3, 1)`.

Pravidlá:

- žiadne `transition: all`,
- žiadna sekcia nečaká na dlhý stagger; celý reveal skončí do 800 ms,
- hover pohyb nepresiahne 4 px,
- scroll-driven pohyb sa používa iba tam, kde vysvetľuje prechod medzi scénami,
- Framer Motion dostane `MotionConfig reducedMotion="user"`,
- GSAP a Framer Motion neanimujú rovnaký element,
- každý animovaný komponent musí byť prerušiteľný bez návratu do starej polohy.

## 12. Komponentová architektúra

### Nové komponenty

- `client/src/components/hero/HeroThresholdStory.tsx` — desktop sticky story a GSAP lifecycle.
- `client/src/components/hero/HeroCompact.tsx` — mobile/tablet hero a media fallback.
- `client/src/components/hero/HeroActions.tsx` — spoločné CTA, rating a hlavné benefity.
- `client/src/components/ProofStrip.tsx` — overiteľné proof údaje.
- `client/src/contexts/BookingIntentContext.tsx` — dátumy, hostia a odvodená cena.
- `client/src/components/StickyBookingBar.tsx` — mobilný stav rezervácie.

### Upravené komponenty

- `Home.tsx` — provider, breakpoint renderovanie a nové poradie sekcií.
- `Navigation.tsx` a `LanguageSwitcher.tsx` — tri responzívne režimy.
- `GallerySection.tsx` — mobilný carousel a lazy lightbox.
- `TextRevealSection.tsx` a `text-gradient-scroll.tsx` — word/line reveal.
- `AmenitiesSection.tsx` — prioritný zoznam a rozbalenie.
- `LocationSection.tsx` — kompaktné mobilné zobrazenie.
- `PricingSection.tsx` — jeden cenový výsledok nad spoločným booking intentom.
- `BookingSection.tsx` — dva kroky a availability states.
- `index.css` — motion tokeny, focus a reduced-motion pravidlá.
- `shared/i18n/{sk,en,de,pl}.ts` — nové lokalizované hero, proof, expand a booking texty.

### Odstránené z runtime toku

- `HeroSCV.tsx`,
- `HeroMobile.tsx`,
- `StickyContactBar.tsx`,
- `QuoteSection.tsx`.

Súbory sa odstránia až keď nové komponenty prejdú buildom a browser overením. `BrandReveal` môže zostať len ak ho používa `HeroCompact`; inak sa odstráni spolu so vzniknutými nepoužitými importmi.

## 13. Kritériá úspechu

### Funkčnosť

- Primárne rezervačné CTA je viditeľné na prvom viewporte pri `390×844`, `768×1024` a `1440×900`.
- CTA vedie na lokalizovaný booking anchor.
- Navigácia sa neprekrýva a nepresahuje šírku pri 390, 768, 1024, 1280 a 1440 px.
- Jazyková zmena zachová aktuálny hash.
- Cenový selector a booking summary používajú rovnaký počet hostí a cenu.
- Booking rozlišuje loading, loaded a fallback availability stav.
- Lightbox funguje klávesnicou, buttonmi aj swipe/drag gestom.

### Výkon a pohyb

- Desktop hero má najviac `240svh`.
- Hero neobsahuje zápis `video.currentTime` ani vlastný nekonečný rAF loop.
- Pred prvou mobilnou interakciou sa neprenesie viac než 2 MB hero médií.
- Žiadny dlhý text sa neanimuje po písmenách.
- Produkčný kód neobsahuje `transition: all` v menených komponentoch.
- Reduced-motion režim nemá pin, scrub, smooth anchor scroll ani oneskorené odhalenie obsahu.

### Prístupnosť

- Všetky hlavné dotykové ovládače majú minimálne `44×44px`.
- Form text má minimálne 16px na mobile.
- Zoom nie je obmedzený cez `maximum-scale=1`.
- Focus je viditeľný a po zatvorení menu/lightboxu sa vracia na spúšťač.
- Všetok podstatný obsah zostáva dostupný bez animácie a bez autoplay videa.

### Verifikácia

- `pnpm check` prejde.
- `pnpm test` prejde.
- `pnpm build` prejde.
- Browser overenie prebehne na šírkach 390, 768, 1024, 1280 a 1440 px.
- Browser audit skontroluje prvý viewport, všetky tri desktop kapitoly, handoff do intro, gallery swipe, booking oba kroky a reduced-motion variant.

## 14. Implementačné obmedzenia

- Použiť existujúci React, Tailwind, Framer Motion a GSAP stack.
- Nepridať novú animation dependency.
- Nevytvárať všeobecný design-system framework pre jednu stránku.
- Zachovať existujúce pricing, availability, i18n a inquiry kontrakty.
- Komponenty z verejných knižníc uvedených v `docs/UI_LIBRARIES.md` slúžia ako zdroj vzorov; prenesený kód sa musí prispôsobiť existujúcim tokenom, prístupnosti a licencii.
- Každá zmena musí priamo podporovať hero, motion, retenciu, responzivitu alebo booking flow definovaný v tomto dokumente.
