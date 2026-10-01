# Chalet Beyond — plán prémiového frontendu

> **Stav:** návrh na schválenie · **Dátum:** 2026-10-01 · **Rozsah:** všetko pod hero sekciou
> (hero, header a prechod z hero sú hotové a slúžia ako latka kvality).

**Ako tento dokument vznikol.** Prešiel som celú stránku v kóde a na screenshotoch: desktop 1440 px a mobil 390 px, každá sekcia zvlášť. Mechanické kontroly urobil detektor Impeccable. Rámce sú zo skills:

- **Impeccable:** critique, craft-floor
- **Emil Kowalski:** find-animation-opportunities, improve-animations
- **taste:** high-end-visual-design
- **marketing:** cro

Paralelne bežali dvaja nezávislí agenti, dizajnový kritik a motion auditor. Ich zistenia som overil priamo v kóde. Tvrdenia bez overenia sú označené *(overiť)*.

---

## 1. Diagnóza v skratke

Hero pôsobí prémiovo. **Všetko pod ním je šablóna prenájmu chaty v tmavých farbách.** Rovnaká kostra sa opakuje 6×:

1. amber linka
2. monospace štítok nad nadpisom
3. dvojfarebný nadpis
4. malý šedý odsek
5. mriežka kartičiek

K tomu emoji, žiara pod kurzorom a rovnaký fade-up na každom bloku.

Dizajnový agent ohodnotil použiteľnosť na **23/40 (57 %)** podľa Nielsenových heuristík. Najslabšie sú tri miesta: zatvorenie galérie (bug, už opravený), jazyk kalendára a estetika sekcií.

**Päť pák s najväčším efektom, v poradí:**

1. **Fotky.** V repozitári leží 79 profesionálnych fotiek (`assets/photos/lomnica/`), ktoré web vôbec nepoužíva. Galéria stále ťahá 33 menších fotiek z Bookingu. Kto porovnáva s Bookingom, vidí tie isté zábery, len menšie.
2. **Jeden vizuálny jazyk sekcií.** Preč so štítkami nad nadpismi, emoji, žiarou a sklenými kartami. Amber len na akciu a peniaze.
3. **Menej obsahu.** Text reveal a citát hovoria doslova tie isté vety. Fakty z hero sa opakujú v troch sekciách.
4. **Rezervačná obrazovka** je koniec cesty, a preto najdôležitejšia. Teraz je najslabšia:
   - kalendár je v angličtine,
   - je malý v prázdnom paneli,
   - tlačidlo vyzerá rozbité,
   - uistenie o storne je na kontraste 2,7 : 1.
5. **Pohyb.** Netreba ho viac, treba ho menej a premyslene. Jeden podpisový pohyb (rovnaký jazyk ako hero) namiesto 45 rovnakých fade-upov.

---

## 2. Princípy (podľa nich sa rozhoduje každá zmena)

| Princíp | Čo to znamená v praxi |
|---|---|
| **Hero je latka** | Každá sekcia musí obstáť vedľa hero. Ak by vedľa neho pôsobila lacno, neprejde. |
| **Fotka je produkt** | Najprv ukázať chatu, až potom ju opisovať. Veľké zábery, nie dlaždice. |
| **Amber = akcia a peniaze** | Amber dostanú len tlačidlá a priama cena s úsporou. Nie štítky, nie polovica každého nadpisu. |
| **Jeden autorský pohyb** | Každá sekcia má jeden nábeh v jazyku hero, nie generický fade-up. Funkčné UI (formulár, kalendár) sa nehýbe kvôli efektu. |
| **Pravdivosť** | Žiadne nepotvrdené vzdialenosti, hodnotenia ani sľuby (PRODUCT.md, „Truth boundaries“). Prémiovo pôsobí presnosť, nie poézia. |
| **Mobil prvý** | Hlavná skupina sú nemecké rodiny na mobile. Akcia musí byť vždy po ruke palca. |

---

## 3. Fáza 0 — chyby, ktoré treba opraviť bez ohľadu na dizajn

| # | Chyba | Dôkaz | Oprava | Stav |
|---|---|---|---|---|
| 0.1 | **Galéria uväznila návštevníka**: tlačidlo Zavrieť bolo pod lištou, na mobile pod burgerom | `GallerySection.tsx`; `.hero-handoff__sheet` má `z-index: 1`, teda vlastný stacking context | Lightbox cez portál do `<body>`, ťuknutie vedľa fotky zavrie | ✅ opravené v tomto commite |
| 0.2 | Kalendár je **po anglicky a týždeň začína nedeľou** na SK/DE/PL | `BookingSection.tsx:396` — chýba `locale` a `weekStartsOn` | `locale` z date-fns podľa jazyka, `weekStartsOn: 1` | otvorené |
| 0.3 | „9 fotiek“ je natvrdo po slovensky aj na /de, /en, /pl; `aria-label="Foto"` tiež | `GallerySection.tsx:354, 239` | Text do i18n slovníkov | otvorené |
| 0.4 | Text reveal **pre čítačky a Google vyzerá ako „VVssrrddccii…“**: každé písmeno 2×, medzi slovami chýbajú medzery | overené cez `textContent`; `ui/text-gradient-scroll.tsx:102-148` | Sekciu zrušiť (viac v kap. 5.2) | otvorené |
| 0.5 | Podpis pod citátom je mimo stredu | globálne `p { max-width: 68ch }` v `index.css:135` bez `margin-inline: auto` | Pridať `margin-inline: auto` pri centrovaných odsekoch | otvorené |
| 0.6 | V pätičke je „© 2025“ | `shared/i18n/*.ts` (`footer.copyright`) | Rok počítať dynamicky | otvorené |
| 0.7 | Pod hero sa **nič neriadi nastavením „obmedziť pohyb“** | v `App.tsx` chýba `MotionConfig` | `<MotionConfig reducedMotion="user">` a jemnejšia náhrada pohybu (kap. 6) | otvorené |
| 0.8 | Hover stavy ostanú „zaseknuté“ po ťuknutí na mobile | `Footer.tsx:137-138` (`onMouseEnter`), `index.css:200, 224` | Hover iba v `@media (hover: hover) and (pointer: fine)` | otvorené |
| 0.9 | Súhrn rezervácie má `position: sticky`, ale nikdy sa neprilepí | `BookingSection.tsx:520-521` (`top: auto`) | `top: calc(var(--nav-height) + 24px)` | otvorené |
| 0.10 | Cenník píše „Hostí“, ale myslí dospelých 16+ | `PricingSection.tsx:168`, `pricing.ts` | Rodina 2 + 4 deti vidí 585 €/noc, reálne zaplatí 475 €. Stĺpec premenovať na „Dospelí (16+)“ (lepšie riešenie v kap. 5.7) | otvorené |
| 0.11 | Text si protirečí a sľubuje nepotvrdené | `sk.ts:89` „Zjazdovky od záhradnej bránky“ vs. „vleky 10 minút“; golf raz „pár krokov“, raz „dve minúty“, raz „priamo na ihrisku“ (`sk.ts:73, 77, 159`), pričom PLAYBOOK vzdialenosť stále vedie ako neoverenú; „Iba priama rezervácia“ (`sk.ts:213, 280`), hoci sme na Bookingu | Zjednotiť po potvrdení od majiteľa (kap. 9) | čaká na majiteľa |
| 0.12 | „10/10 na Booking.com“ je z **jednej recenzie** (PLAYBOOK) | hero štatistika, rezervačný panel | Rozhodnutie v kap. 9 | čaká na rozhodnutie |
| 0.13 | Pri otvorenej galérii sa na dotykových zariadeniach možno dá scrollovať stránka pod ňou *(overiť)* | `GallerySection.tsx:123` + `html { overflow-x: clip }` | Zamknúť scroll cez `html`, nie `body` | overiť |

---

## 4. Systémové zmeny (jeden vizuálny jazyk)

### 4.1 Typografia

- **Nadpisy sekcií prejdú z Bebas Neue na Thunder**, rovnaké písmo ako hero. Overené: Thunder má kompletnú slovenskú, poľskú aj nemeckú diakritiku (Ž Č Š Ľ Ť Ň Ô Ŕ Ĺ Ď Ą Ę Ł Ś Ź Ż ß € ²). Má aj malé písmená, takže zmizne chyba „250 M²“, ktorú robí Bebas.
  - Veľkosť `clamp(3rem, 6vw, 5.5rem)`, `line-height: 0.9`, jedna farba (`--hero-ink`).
  - Viac miesta nad nadpisom ako pod ním.
- **Bebas Neue po migrácii úplne odíde.** Mobilné menu už používa Thunder. Jedno kondenzované písmo, nie dve, a o jeden font (preload) menej.
- **Text:** Karla 400 (nie 300), 1.0625–1.125 rem, svetlosť aspoň 0.78. Dnes je text Karla 300 v 0.95 rem v šedej (L ≈ 0.62), čo na tmavom pôsobí lacno a zle sa číta.
- **JetBrains Mono** len na skutočné dáta: čas check-inu, súradnice, ceny v tabuľke. Nie ako ozdobné štítky.

### 4.2 Hlavička sekcie — jeden vzor

| Preč | Ostáva |
|---|---|
| monospace štítok nad nadpisom („ČO JE CHALET BEYOND?“, „VYBAVENIE“…); Impeccable ho zakazuje (`craft-floor.md`) | nadpis (Thunder, jedna farba) |
| amber linka na začiatku každej sekcie (na jednom mieste je dokonca dvojitá) | najviac jedna veta pod nadpisom |
| dvojfarebný nadpis v 6 zo 7 sekcií | amber len vtedy, ak slovo nesie peniaze alebo akciu |

### 4.3 Amber rozpočet

Amber dostanú len **tlačidlá, priama cena, úspora a aktívny stav v kalendári**. Dnes je amber na štítkoch, polovici nadpisov, ikonách, linkách, vzdialenostiach aj rámikoch, takže prestal niečo znamenať.

### 4.4 Povrchy a efekty — vyhodiť

- **Emoji ako ikony** (`ChaletIntroSection.tsx:10-27`). Nahradia ich fotky (kap. 5.1), nie iné ikony.
- **`.glow-hover`** (žiara pod kurzorom, `index.css:196-204` a znova `309-319`) na kartách, na ktoré sa nedá kliknúť. Hover sľubuje klik, ktorý neexistuje.
- **Žiara na `.btn-amber:hover`** a na progress bare (`ScrollProgressBar.tsx:33`).
- **`backdrop-filter: blur`** na kartách okolia a v galérii. Rozmazanie za nimi nevidno a na slabších mobiloch to stojí výkon.
- **Tvrdé švy medzi sekciami:** pozadia skáču medzi L 0.06 / 0.08 / 0.10 / 0.12. Jedna báza `oklch(0.06 0.008 55)` a zmenu atmosféry nech nesú fotky.

### 4.5 Tlačidlá

Jeden komponent na celom webe: **`RollButton`** (pilulka, ktorá sa pri hoveri zaplní a text sa preroluje). Dnes sú na webe tri štýly: pilulky v hero, Bebas obdĺžnik `.btn-amber` v rezervácii a mono lišta na mobile.

### 4.6 Mriežka a zarovnanie

- **Spoločná ľavá hrana.** Text v hero začína na 128/144/336 px (šírky 1280/1440/1920), nadpisy sekcií na 48/128/240 px, takže keď list s obsahom dorazí, text „skočí“. Sekcie zarovnať na `--hero-inset` (`clamp(64px, 10vw, 176px)`) v rámci 1600 px.
- **`.container` sa reálne správa ako Tailwind 1280/1536 px**, nie 1400 px, ako tvrdí DESIGN.md. Zjednotiť.
- **Päť položiek v troch stĺpcoch nechá dieru** v galérii aj v okolí. Riešenie je v kap. 5.

### 4.7 Fotky — pipeline

1. **Výber:** z `assets/photos/lomnica/` (79 záberov, 2560 px) vybrať zhruba 20 do konkrétnych slotov. Tipy sú v kap. 5.
2. **Export:** AVIF a WebP v šírkach 640 / 1024 / 1600 / 2400, verziované názvy (`…-v1.avif`) kvôli ročnej cache na Netlify.
3. **`<picture>`** so `srcset` + `sizes`, `loading="lazy"` a `decoding="async"` všade okrem prvej fotky pod hero. Explicitné `width` a `height` (CLS 0).
4. **Booking fotky** (`/gallery/booking/`, ~3,7 MB) potom zmazať. Fialovo nasvietená sauna sa bije s paletou a nahradí ju lomnica-58.

---

## 5. Sekcia po sekcii

Každá sekcia má: čo je dnes, návrh (rozloženie, typografia, text) a pohyb s presnými hodnotami. Tokeny pohybu sú v kap. 6.

**Nové poradie stránky:** Hero → Úvod s fotkou → Galéria → Vybavenie (3 hlavné) → Okolie → Cena → Rezervácia → Pätička.
**Vypadnú:** text reveal (5.2) a samostatný citát (5.3), ktorý sa premení na fotografický predel.

### 5.1 Úvod („Nie je to hotel. Nie je to Airbnb.“)

**Dnes.** Nad prvým obsahom je ~240 px prázdnej tmy. Za ním príde nadpis definujúci chatu tým, čím *nie je*, a štyri kartičky s emoji (⛳ 🌲 🧖 🏔). Kartičky majú nerovnakú výšku.

**Návrh: editorial split.**
- **Vľavo** konkrétny sľub namiesto negácie, napríklad *„250 m² len pre vašu partiu.“* a pod tým jedna veta (sauna, vírivka, Lomnický štít za oknom).
- **Vpravo** veľká fotka 4:5. Tip: lomnica-12 (Tatry nad lúkou) alebo lomnica-44 (kozub s ležadlom).
- Pod tým **tri fakty ako text, nie ako dlaždice**, každý s jednou presnou vetou: golf (vzdialenosť po potvrdení), wellness, Tatry.
- Slovo „rezort“ vypustiť. Je to jeden dom a presnosť pôsobí prémiovejšie.

**Pohyb.**
- Nadpis: podpisová hlavička sekcie (kap. 6.3).
- Fotka: odkrytie `clip-path: inset(0 0 100% 0)` → `inset(0)` a zároveň `scale(1.08)` → `1`, 1000 ms `--ease-move`, štart pri `useInView({ once: true, margin: "-100px" })`.

### 5.2 Text reveal — zrušiť

**Dnes.** Odsek sa odhaľuje písmeno po písmene: ~250–320 animovaných hodnôt podľa jazyka a ~800–1 000 `<span>` elementov. Kvôli `transition: all .5s` na každom písmene efekt zaostáva za prstom a pre čítačky a Google je text nečitateľný (bug 0.4). Navyše **jeho posledné tri vety doslova opakuje citát** (`sk.ts` intro vs. quote).

**Návrh.** Zrušiť. Ak by majiteľ trval na scroll efekte, prepísať ho na úroveň slov: jedna hodnota na slovo, skutočné medzery, `opacity 0.12 → 1`, bez CSS transition. Bez „obmedziť pohyb“ len obyčajný `<p>`.

### 5.3 Citát → fotografický predel

**Dnes.** Centrovaný Bebas text na tmavom pozadí: tie isté vety ako text reveal a podpis mimo stredu (bug 0.5).

**Návrh.**
- Fotka na celú šírku (tip: lomnica-12 alebo lomnica-72, terasa cez sklo), výška 80–100 svh, prekrytie 30–40 %.
- **Jedna** atmosférická veta v Thunderi, napríklad *„Ranná káva s Lomnickým štítom za oknom.“*.
- Toto je jediné poetické miesto na celej stránke.

**Pohyb.**
- Fotka sa pri scrolle jemne posúva cez CSS scroll-driven animáciu (`animation-timeline: view()`, `translateY(-6%)` → `6%`, `linear`). Beží mimo hlavného vlákna a bez JS. Kde to prehliadač nevie, fotka ostane statická.
- Veta má rovnaký riadkový nábeh ako nadpisy (kap. 6.3).

### 5.4 Galéria („Postavené pre túto krajinu“)

**Dnes.** Päť rovnakých dlaždíc (300 px) v troch stĺpcoch nechá prázdne miesto. Fotky sú z Bookingu a počet fotiek je zarovnaný doľava pod centrovaným názvom.

**Návrh.**
- **Bento mriežka:** 1 veľká dlaždica (2 × 2, exteriér, tip lomnica-02/38) a 4 menšie (interiér, spálne, wellness, okolie). Päť položiek tak sedí bez diery.
- **Pod názvom albumu jeden fakt** namiesto „9 fotiek“, napríklad *„3 spálne · manželské postele“* (podklady od majiteľa).
- Fotky z novej knižnice: interiér 43–48 a 65–70, spálne 54/55/60/61, wellness 56/58/62/63, exteriér 01–40.

**Pohyb.**
- **Odkrytie obálok:** dva vnorené obaly. Vonkajší má `clip-path: inset(0 0 100% 0)` → `inset(0)`, vnútorný `scale(1.1)` → `1`, 1000 ms `--ease-move`. Štart až po `img.decode()`, aby sa nikdy neodkryla prázdna dlaždica. Stagger 60 ms po stĺpcoch, na mobile žiadny.
- **Hover:** zoom fotky `scale(1.04)`, 520 ms `--ease-enter`, len pre myš. Dnes je 700 ms na defaultnej krivke.
- **Zoom z obálky do galérie (FLIP + clip-path, nie `layoutId`).** Obálky sú výrezy z iného pomeru strán a `layoutId` by fotku počas letu natiahol.
  1. Pri kliknutí zmerať obdĺžnik obálky.
  2. Galéria vykreslí tú istú (už stiahnutú) fotku.
  3. Fotka sa animuje z `translate(dx,dy) scale(s)` s `clip-path: inset(iy ix iy ix round 3px)` do plnej veľkosti, 420 ms `--ease-drawer`.
  4. Pozadie za fotkou sa objaví za 240 ms, ovládanie (lišta, šípky, náhľady) od +180 ms.
  5. Zatvorenie sa vráti do obálky za 240 ms, ak je obálka na obrazovke. Inak fotka zmizne s `scale(0.98)` za 160 ms.
- **Prepínanie fotiek:** dnes `AnimatePresence mode="wait"` robí „blik“ dlhý 500 ms s prázdnym stredom. Nahradiť za `mode="popLayout"`:
  - nová fotka príde z `opacity 0, blur(2px), translateX(±4 %)` za 240 ms `--ease-ui`,
  - stará odíde za 160 ms,
  - susedné fotky sa vopred stiahnu,
  - šípky z klávesnice prepnú okamžite (`duration: 0`).
- **Swipe s fyzikou.** Fotka ide za prstom (`drag="x"`, `dragDirectionLock`). Prepne pri posune ≥ 80 px alebo rýchlosti > 0,11 px/ms, inak sa vráti pružinou `{ type: "spring", duration: 0.5, bounce: 0.2 }`. Ťahom nadol (> 120 px) sa galéria zavrie a pozadie pritom bledne.

### 5.5 Vybavenie („Všetko, čo potrebujete“)

**Dnes.**
- 16 rovnakých dlaždíc s ikonami: Wi-Fi a stolička pre deti majú rovnakú váhu ako súkromná sauna.
- Panel s parametrami opakuje fakty z hero.
- Check-in a check-out sú na stránke dvakrát.

**Návrh.**
- **Tri hlavné veci s fotkami:** sauna (lomnica-58), vírivka a kozub (lomnica-44). Každá ako fotka 4:5 a jedna veta pod ňou.
- **Zvyšok ako obyčajný zoznam v dvoch stĺpcoch:** text bez ikon a bez dlaždíc, oddelený jemnými linkami.
- **Panel s parametrami zrušiť.** Fakty sú v hero a check-in/out v pravidlách domu.
- **Nové:** jeden riadok na spálňu s typom postelí. Rodina na ôsmich zisťuje práve toto, a dnes to nikde nie je (podklady od majiteľa).

**Pohyb.** Fotky majú rovnaké odkrytie ako galéria. Zoznam nastúpi po riadkoch (stagger 60 ms, max. 5 krokov), nie po 16 dlaždiciach (dnes to trvá 1,4 s).

### 5.6 Okolie („Srdce Tatier“)

**Dnes.** Fotka Lomnického štítu v rozlíšení 1024 px je zväčšená 1,25× a pod 75–95 % tmavým prekrytím, takže pôsobí ako blato. Päť sklenených kariet s rozmazaním leží v troch stĺpcoch a nechá dieru.

**Návrh.**
- Ostrá fotka hôr (aspoň 2400 px, z knižnice alebo nová) s prekrytím iba 30–40 % a tmavým prechodom len pod textom.
- **Vzdialenosti ako veľké čísla v Thunderi**, jedna časová os: *2 min* golf (po potvrdení) · *10 min* Tatranská Lomnica · *10 min* AquaCity · *15 min* letisko. Pod číslom jeden riadok textu, bez kariet.
- Nadpis „Srdce Tatier“ vymeniť. Fráza „srdce Tatier“ je na stránke 4×.

**Pohyb.** Fotka sa pri scrolle jemne posúva ako v 5.3. Čísla nabehnú riadkovým nábehom (kap. 6.3), **nepočítajú sa nahor**: sú to fakty, ktoré má človek prečítať hneď.

### 5.7 Cena („O 10 % lacnejšie ako na Bookingu“)

**Dnes.** Najsilnejší argument stránky je vysádzaný ako tabuľka: 4 stĺpce na šírku 1 184 px a priama cena malá (≈ 20 px). Na mobile je to 7 takmer rovnakých kariet. Rodiny si cenu za deti (40 € za noc) musia dopočítať samy.

**Návrh.**
- **Jedno veľké číslo** v jazyku hero: *„od 315 € / noc · celý chalet“* a vedľa prečiarknutá cena z Bookingu.
- **Kalkulačka:** dospelí ± a deti ±, cena sa zobrazí okamžite: *„Vaša cena 475 € / noc · na Bookingu 513 € · ušetríte 38 €“*. Tieto hodnoty sa prenesú do rezervačného formulára.
- Celú tabuľku schovať pod *„Zobraziť všetky ceny“*, so stĺpcom *„Dospelí (16+)“*.
- Amber len na priamu cenu a úsporu.

**Pohyb.**
- Zmena čísla: prelínanie hodnoty `opacity 0, blur(2px), translateY(4px)` → pokoj, 240 ms `--ease-ui`, cez `AnimatePresence mode="popLayout"` s kľúčom podľa hodnoty.
- **Žiadne počítanie nahor** (pôsobí ako automat, kap. 6.5).

### 5.8 Rezervácia („Prekonáva vaše očakávania“)

Toto je **koniec cesty**. Podľa pravidla peak-end tu musí dôvera vrcholiť. Dnes je to najslabšia obrazovka.

**Dnes.**
- Nadpis je prázdna fráza.
- Kalendár je anglický, 250 px široký, v paneli 775 px, s bunkami 32 px (minimum je 44 px). Pod ním je ~550 px prázdnej tmy.
- Tlačidlo je Bebas obdĺžnik so 50 % priehľadnosťou, takže vyzerá rozbité.
- Uistenia sú na kontraste 2,7 : 1.
- Pri výbere dátumu všetko pod kalendárom poskakuje.

**Návrh.**
- **Nadpis pomenuje úlohu:** *„Overte voľný termín“* / *„Freie Termine prüfen“*.
- **Desktop:** kalendár s dvomi mesiacmi v jazyku stránky, týždeň od pondelka, bunky 44–48 px, vypĺňa ľavý stĺpec.
- **Súhrn vpravo sa naozaj prilepí** (bug 0.9). Celková suma v Thunderi, prečiarknutá suma z Bookingu a úspora v amber.
- **Dva kroky:** (1) dátumy a hostia → tlačidlo *„Pokračovať“*, stále aktívne. Ak dátumy chýbajú, posunie ku kalendáru so správou priamo pri ňom. (2) Meno, e-mail, telefón. Stav pre dva kroky už v kóde existuje (`BookingSection.tsx:203`).
- **Odoslanie** cez `RollButton`, 56 px. Pod ním uistenie na kontraste ≥ 4,5 : 1: *„Bezplatné storno do 14 dní · Min. 2 noci · Odpoveď do 24 h“*. Platobné podmienky doplniť až po potvrdení od majiteľa.
- **Telefón voliteľný** (dnes povinný, `:796`). Pre nemeckého hosťa je slovenské číslo bariéra.

**Pohyb.**
- **Rezervovať miesto vopred:** panel dátumov, počet nocí aj riadky ceny sú vždy vykreslené (s „—“), takže nič neposkakuje.
- **Zmena hodnôt** (dátumy, noci, suma, úspora): prelínanie 240 ms `--ease-ui` ako v 5.7.
- **Jediná odmena pri dokončení výberu:** pod riadkom *„ušetríte … €“* sa zľava nakreslí amber linka (`scaleX` 0 → 1, 520 ms `--ease-enter`).
- **Dni v kalendári** pri stlačení `scale(0.95)`. Výber rozsahu sa vyfarbí okamžite: je to pracovný nástroj a efekt by zdržiaval.
- **Úspech po odoslaní** (jediné miesto, kde je pružina zaslúžená):
  - panel drží výšku formulára, formulár odíde za 160 ms,
  - amber krúžok `scale(0.92)` → `1` s pružinou `{ duration: 0.5, bounce: 0.2 }`,
  - fajka sa nakreslí (`pathLength` 0 → 1, 520 ms) od +120 ms,
  - nadpis a text nabehnú od +180/+240 ms,
  - fokus na `role="status"`, scroll k potvrdeniu iba vtedy, keď je mimo obrazovky.
  - **Bez konfiet.**

### 5.9 Pätička

**Dnes.** Značka je v Bebas, chýba telefón a odkazy na sekcie, rok je 2025 a ozdobné súradnice sú v mono. Text je na kontraste 2,1 : 1.

**Návrh.**
- Svetlé logo (to isté ako v lište).
- **Telefón a e-mail** ako hlavný kontakt.
- Odkazy na sekcie a adresa.
- Jeden riadok s právnymi údajmi a aktuálnym rokom.
- Kontrast textu ≥ 4,5 : 1.

### 5.10 Mobilná lišta (Zavolať / WhatsApp)

**Dnes.** Po odscrollovaní hero je jedinou amber akciou na mobile **WhatsApp na slovenské číslo**. Pre nemeckú rodinu je to vysoká bariéra. Lišta sa zobrazí pri inom bode scrollu, než kde tlačidlo Rezervovať v lište zmení farbu.

**Návrh.**
- **Pomer 2 : 1.** Široké amber pole *„Overiť termín · od 315 €“* posunie k rezervácii, malé pole s ikonou telefónu zavolá. WhatsApp sa presunie do menu.
- **Spoločný signál** s lištou (list dorazil pod lištu).
- **Skryť ju, keď je formulár vo fokuse**, aby neprekrývala polia ani klávesnicu.

**Pohyb.** Príchod `translateY(100%)` → `0` za 240 ms `--ease-drawer`, odchod za 160 ms `--ease-ui`. Pri „obmedziť pohyb“ len opacity.

### 5.11 Progress bar hore — zrušiť

Prémiové weby ho nemajú: lišta s tlačidlom Rezervovať je dostatočný orientačný bod. Ak ostane, tak bez žiary a bez pružiny, lineárne naviazaný na scroll.

### 5.12 Prechod z hero (HeroHandoff) — ponechať, doladiť výkon

Pri každom snímku scrollu sa animuje `border-radius` celého listu, ktorý je vysoký ~9 600 px. To môže prekresľovať veľkú plochu *(overiť profilovaním pri 4× spomalenom CPU)*. Ak sa to potvrdí, zaoblenie dať len na tenký horný „okraj“ listu (samostatný element ~48 px) a samotný list nechať bez zaoblenia.

### 5.13 Stránka 404

`NotFound.tsx` používa bielu kartu s rozmazaním, úplne mimo značky. Navrhujem tmavú stránku, nadpis v Thunderi a jedno tlačidlo späť.

---

## 6. Pohybový systém

### 6.1 Diagnóza

- **Rovnaký nábeh na ~45 elementoch:** `FadeUp`, 40 px, 700 ms. Ide aj o funkčné UI (kalendár, formulár, cenník), ktoré je pri odkaze z menu chvíľu prázdne alebo sa ešte posúva.
- **8 kriviek namiesto 2–4.** (0.22,1,0.36,1) a (0.23,1,0.32,1) sa líšia o menej ako 1,1 %. (0.16,1,0.3,1) má tri mená.
- **CSS prechody bojujú s Motion** o tú istú vlastnosť: `.glow-hover` `transform`, `.btn-amber` vs. `whileTap`, pozadie dlaždíc.
- **Pod hero nič nerešpektuje „obmedziť pohyb“.** Globálne CSS pravidlo zároveň vypína aj farebné prechody, takže pohyb nie je jemnejší, ale žiadny.
- **Bez spätnej väzby pri stlačení:** obálky galérie, šípky, ± pri hosťoch, dni v kalendári, mobilná lišta.

### 6.2 Tokeny (nahradia všetky rozhádzané hodnoty)

| Token | Hodnota | Použitie |
|---|---|---|
| `--ease-ui` | `cubic-bezier(0.23, 1, 0.32, 1)` | stlačenie, reakcie UI, všetky odchody, prelínania |
| `--ease-enter` | `cubic-bezier(0.16, 1, 0.3, 1)` | všetky nábehy, kreslenie liniek (hero ho už používa) |
| `--ease-move` | `cubic-bezier(0.77, 0, 0.175, 1)` | odkrývanie fotiek cez `clip-path` |
| `--ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | plochy, ktoré prichádzajú: mobilná lišta, zoom galérie |
| `linear` | — | iba pohyb naviazaný na scroll |
| `--motion-ui` | 160 ms | stlačenie, farba, malé odchody |
| `--motion-state` | 240 ms | prelínania, zmena hodnôt, záloha pre „obmedziť pohyb“ |
| `--motion-modal` | 420 ms | zoom galérie (zatvorenie 240 ms) |
| `--motion-section` | 520 ms | nábehy sekcií, riadkové masky, zoom pri hoveri |
| `--motion-cinematic` | 1000 ms | kreslenie liniek, odkrývanie fotiek |
| `--stagger` | 60 ms, max. 5 krokov | všetky skupiny |
| `--rise` / `--rise-sm` | 14 px / 8 px | posun pri nábehu (ako v hero; dnes 30–40 px) |
| stlačenie | `scale(0.97)` (0.95 malé ciele, 0.98 veľké pilulky) | `:active` |
| `SPRING_GESTURE` | `{ type: "spring", duration: 0.5, bounce: 0.2 }` | iba swipe v galérii a krúžok úspechu |

Motion nevie čítať CSS premenné, preto treba zrkadlovú kópiu v `client/src/lib/motion.ts` (`EASE`, `DUR`, `STAGGER`, `SPRING_GESTURE`).

**Pravidlá:**
- Odchod je vždy o stupeň kratší ako príchod.
- Každú vlastnosť ovláda jeden „vlastník“: buď CSS, alebo Motion, nikdy oboje.
- Animujú sa len `transform`, `opacity`, `clip-path` a `filter`. Žiadne `width`: `.link-amber` animuje `width`, preto zmazať.
- Hover iba v `@media (hover: hover) and (pointer: fine)`.
- „Obmedziť pohyb“ = **jemnejší pohyb, nie žiadny**. `<MotionConfig reducedMotion="user">` a každý nový prvok má pri `useReducedMotion()` záložnú verziu: len opacity, 240 ms. Z `index.css` zmazať `transition-duration: 0.01ms !important`, ktoré zabíja aj farebnú spätnú väzbu.

### 6.3 Podpisový pohyb: nábeh hlavičky sekcie

Nahradí ~20 generických fade-upov **jedným pohybom v jazyku hero**. Štart pri `useInView(ref, { once: true, margin: "-100px" })`, všetky oneskorenia v rastri 60 ms:

1. **Nadpis po riadkoch cez masku.** Obal riadku má `clip-path: inset(-0.35em -0.1em -0.2em -0.1em)`, čo nechá miesto pre diakritiku (Ž, Ś, Ö) aj pre chvosty písmen Ą/Ę. Vnútorný riadok ide z `translateY(110%)` do `0`, 520 ms `--ease-enter`, riadky v časoch 0 / +60 ms.
2. **Veta pod nadpisom:** stúpnutie ako v hero (`opacity 0, translateY(14px), blur(4px)` → pokoj), 520 ms od +180 ms.
3. Všetko je hotové do ~800 ms a nič nebráni čítaniu ani klikaniu. Beží cez WAAPI (`transform`, `opacity`, `filter`, `clip-path`), teda mimo hlavného vlákna.
4. Pri „obmedziť pohyb“ len opacity za 240 ms.

### 6.4 Rozpočet „dopamínových“ momentov (všetky sú v kap. 5)

| Moment | Prečo je zaslúžený |
|---|---|
| Intro hero (hotové) | prvý dojem, raz za návštevu |
| Prechod z hero na list (hotové) | prechod medzi svetmi, raz za návštevu |
| Hlavička sekcie (6.3) | jeden pohyb namiesto 20 |
| Odkrytie fotiek + zoom z obálky do galérie (5.4) | priestorová súvislosť, galériu niekto otvorí raz-dvakrát |
| Linka pod úsporou (5.8) | jediná odmena pri peniazoch |
| Úspech po odoslaní (5.8) | najvzácnejší a najemotívnejší moment |

### 6.5 Zámerne zamietnuté

| Nápad | Prečo nie |
|---|---|
| Počítanie cien a úspor nahor | Sú to čísla, ktoré si človek porovnáva s Bookingom. Rolujúce cifry ich zdržia a pôsobia ako automat, čiže presne ten lacný efekt, ktorého sa chceme zbaviť. |
| Animovaná „výplň“ rozsahu v kalendári | Pracovný nástroj, dátumy sa vyberajú viackrát. Animácia zdrží reálny stav a pri rýchlom klikaní sa hromadí. |
| Rolujúce číslo pri ± hosťoch | Klikne sa naň aj 7× za sebou. Číslo sa má zmeniť hneď, `aria-live` ho už oznamuje. |
| Náklon, spotlight, žiara na kartách | Karty nie sú klikateľné, hover by sľuboval klik, ktorý neexistuje. |
| Animácie pri šípkach a Esc v galérii | Akcie z klávesnice musia reagovať okamžite. |
| Magnetické tlačidlá | Už si ich raz zamietol („shake“). Tlačidlá stoja a reaguje ich výplň. |

---

## 7. Knižnice: anime.js · Motion · GSAP · Three.js

| Knižnica | Verdikt | Prečo |
|---|---|---|
| **Motion** (framer-motion 12, už v projekte) | **áno, hlavný nástroj** | Pokryje všetko z kap. 5–6: scroll, `AnimatePresence`, drag, pružiny. +0 kB. |
| **CSS scroll-driven animácie** | **áno** | Paralaxa fotiek mimo hlavného vlákna, bez JS. Kde nie je podpora, fotka ostane statická. |
| **GSAP 3.15** (nainštalovaný, nepoužitý) | **odinštalovať** | Nič ho nevolá, len zväčšuje závislosti a zvádza k dvom spôsobom, ako robiť to isté. |
| **anime.js 4.5** | **nie** | Všetko, čo vie (split text, kreslenie SVG), zvládne Motion, ktorý už máme. Bola by to tretia knižnica bez nového prínosu. |
| **Three.js** | **neskôr, ako pokus** | Jediný zmysluplný nápad je hmla, ktorá sa pri intre rozplynie nad videom. Stojí ~150 kB a zaťažuje slabé mobily. Ak vôbec, tak len na desktope, načítané až po videu, v samostatnej vetve na porovnanie. |

---

## 8. Poradie práce

| Fáza | Obsah | Odhad | Závislosti |
|---|---|---|---|
| **0 — Chyby** | kap. 3 (okrem 0.11 a 0.12, ktoré čakajú na majiteľa) | 0,5–1 deň | — |
| **1 — Systém a upratovanie** | tokeny (6.2), `MotionConfig`, vlastníci vlastností, preč glow/blur/emoji/štítky/linky, `RollButton` všade, typografia (4.1), zarovnanie (4.6), zmazať mŕtvy kód (`HeroSCV`, `hero/`, `BrandReveal`, `LanguageSwitcher`, `.btn-ghost`, `.link-amber`, `ui/text-reveal.tsx`, GSAP, celý priečinok `client/public/videos/` ~17 MB, ktorý používajú už len mŕtve komponenty) | 1–2 dni | — |
| **2 — Fotky a príbeh** | pipeline fotiek (4.7), úvod (5.1), zrušiť text reveal (5.2), fotografický predel (5.3), galéria (5.4), vybavenie (5.5), okolie (5.6) | 2–3 dni | výber fotiek, podklady od majiteľa (kap. 9) |
| **3 — Peniaze a konverzia** | cenová kalkulačka (5.7), rezervácia v dvoch krokoch (5.8), mobilná lišta (5.10), pätička (5.9) | 2–3 dni | podmienky od majiteľa |
| **4 — Podpisový pohyb** | hlavička sekcie (6.3), odkrytie fotiek, zoom a swipe v galérii, úspech po odoslaní | 1–2 dni | fázy 1–3 |
| **5 — Kontrola** | kap. 10 | 0,5 dňa | všetko |

Každá fáza je samostatný commit a deploy, aby sa dalo kedykoľvek zastaviť s funkčným webom.

---

## 9. Čo treba od majiteľa

1. **Fotky:** súhlas s použitím knižnice `lomnica` na webe a originál v plnom rozlíšení k záberu Tatier (lomnica-12) na fotografický predel.
2. **Postele:** typ postelí v každej spálni (pre 8 hostí v troch spálňach).
3. **Golf:** jedna overená vzdialenosť (dnes „pár krokov“, „2 minúty“ aj „priamo na ihrisku“).
4. **Lyžovanie:** platí „zjazdovky od záhradnej bránky“? Ak nie, vypustiť.
5. **Po odoslaní dopytu:** do kedy príde odpoveď (24 h?), ako a kedy sa platí (záloha? prevod?).
6. **Hodnotenie 10/10 z jednej recenzie.** Dve možnosti:
   - **Ponechať s počtom:** *„10/10 · 1 hodnotenie na Booking.com“*. Je to úprimné, stále silné a nemecký hosť si to aj tak overí.
   - **Dočasne vymeniť** za iný fakt (napríklad *„250 m² · celý chalet“*), kým nebude aspoň 5 recenzií.

   **Odporúčam prvú možnosť.** Číslo bez počtu pôsobí pri porovnávaní s Bookingom vyberavo a ide o dôveru.
7. **„Iba priama rezervácia“** protirečí listingu na Bookingu. Prepísať na *„Priamo u majiteľa o 10 % lacnejšie“*?
8. **Poradie v logu:** logo hovorí **BEYOND CHALET**, web a pätička **CHALET BEYOND**. Ktoré je správne?

---

## 10. Ako overiť, že je to hotové

- [ ] Screenshoty každej sekcie: desktop 1440 a 1280×720, tablet 900, mobil 390 a 320, v jazykoch SK a DE.
- [ ] Detektor Impeccable: 0 nálezov na zmenených súboroch (`impeccable detect --json …`).
- [ ] Kontrast textu ≥ 4,5 : 1, veľkého textu ≥ 3 : 1. Žiadny šedý text pod L 0.7 na tmavom pozadí.
- [ ] Zapnuté „obmedziť pohyb“: nič sa neposúva, opacity áno, všetko funguje.
- [ ] Celý web ovládateľný klávesnicou vrátane galérie a kalendára.
- [ ] Galéria na mobile: otvoriť, prepnúť swipom, zavrieť krížikom, ťuknutím vedľa aj ťahom nadol.
- [ ] Lighthouse na produkčnom builde: mobil ≥ 85, desktop ≥ 95, CLS 0.
- [ ] Profil scrollu pri 4× spomalenom CPU bez dlhých snímok (text reveal je preč, zaoblenie listu na tenkom okraji).
- [ ] Reálny iPhone v Safari: video, prechod z hero, galéria, kalendár, odoslanie dopytu.

---

### Príloha — hodnotenie použiteľnosti (nezávislý agent, Nielsenove heuristiky 0–4)

| Heuristika | Skóre | Hlavný problém |
|---|---|---|
| Viditeľnosť stavu | 3 | v lište nevidno, v ktorej sekcii človek je |
| Zhoda so svetom | 2 | anglický kalendár, „fotiek“ na /de, „Hostí“ = dospelí |
| Kontrola a sloboda | 1 | galéria sa nedala zavrieť (opravené v tomto commite) |
| Konzistencia | 2 | tri štýly tlačidiel, emoji aj ikony, rôzne ľavé hrany |
| Prevencia chýb | 3 | dobré kontroly dátumov, slabé bunky 32 px |
| Rozpoznanie namiesto pamäte | 3 | ceny za deti si treba počítať |
| Flexibilita | 2 | na mobile chýba trvalá akcia „rezervovať“ |
| Estetika a minimalizmus | 2 | duplicitný text, 16 dlaždíc, štítky, žiara |
| Zotavenie z chýb | 3 | konkrétne chybové hlášky, malý text |
| Nápoveda | 2 | chýba, čo sa stane po odoslaní, a rozloženie postelí |
| **Spolu** | **23/40** | **prijateľné (57 %)** |
