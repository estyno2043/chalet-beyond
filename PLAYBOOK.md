# Chalet Beyond — príručka

**Jeden súbor na plánovanie a stavanie.** Otvor ho pred každou novou prácou.
Aktualizované: 2026-09-02.

---

## 1. O čo ide

Súkromný chalet vo Veľkej Lomnici, 250 m², až 8 hostí, priamo pri golfovom
ihrisku Black Stork. Web má jeden cieľ: **priame rezervácie namiesto Bookingu**,
kde odchádza 15 % provízie.

Východiskový stav pri prevzatí: krásna brožúra bez ceny, bez telefónu, bez
reálnej dostupnosti. Tlačidlo „Skontrolovať dostupnosť" otváralo e-mailový
koncept.

**Kto sú hostia:** väčšina hovorí po nemecky (podľa majiteľa). Poľsko je dve
hodiny cesty a najväčší zdrojový trh Tatier. Odtiaľ štyri jazyky.

---

## 2. Stav

| Vlna | Obsah | Stav |
|---|---|---|
| **1 — Konverzia** | ceny, kalendár z Bookingu, formulár dopytu, mobilná lišta, obsahové opravy, analytika | kód hotový, **nenasadené** |
| **2 — Jazyky** | SK / DE / EN / PL, vlajky, hreflang | hotové |

Vetva `wave1-konverzia`, 39 commitov nad `main`, všetko pushnuté.
Testy 53/53, typy čisté, build prechádza.

### Prečo Vlna 1 ešte nebeží

Nie je to o kóde. Dve veci by na živom webe boli **rozbité**:

- **formulár dopytu** — hosť vyplní, klikne, dostane „Dopyt sa nepodarilo
  odoslať". Dopyt sa stratí a majiteľ o ňom nevie.
- **`contact@chaletbeyond.sk`** v pätičke — doména neexistuje, e-mail sa odrazí.

Formulár, ktorý ticho zahadzuje dopyty, je horší než žiadny formulár.

### Blokátory

| Čo | Odblokuje | Kto |
|---|---|---|
| 🔴 **doména** (~15 €/rok, `chaletbeyond.sk` je voľná) | Resend, kontaktný e-mail, dôveryhodnosť | registrácia |
| 🔴 **Resend kľúč** + `OWNER_EMAIL` | **všetky dopyty** | po doméne |
| 🟡 Umami endpoint + ID | meranie | inštancia Umami |
| 🟡 % provízie Bookingu | overenie cenníka | extranet → Finance |
| 🟡 vzdialenosť na golf | text v úvode | majiteľ |

Hotové: **telefón** `+421 905 111 061`, **iCal feed** (beží na ostrých dátach).

---

## 3. Čo ďalej

| # | Práca | Veľkosť | Blokované? |
|---|---|---|---|
| ~~1~~ | ~~**Opravy z review** — iCal v logoch, server overí dostupnosť, `confirmationSent`, stav načítania kalendára~~ | — | **hotové 2026-09-02** |
| 2 | **Obojsmerný kalendár** — úložisko + `/api/calendar.ics`, potvrdzovacie odkazy | veľká | polovica čaká na Resend |
| 3 | Prístupnosť a upratovanie — labely, `autocomplete`, prettier (58 súborov), advisories | malá | nie |
| 4 | **Vlna 3** — skrátenie hero, 20 MB videí, SEO meta a JSON-LD | veľká | SEO čiastočne po doméne |
| 5 | Sekcia recenzií | malá | čaká na 5+ recenzií |

Podrobnosti k bodu 1: [docs/CODEX_REVIEW_ASSESSMENT.md](docs/CODEX_REVIEW_ASSESSMENT.md).
Zostáva z neho už len bod 3 vyššie — labely, `autocomplete`, prettier a advisories.

---

## 4. Ako sa tu pracuje

Postup, ktorý sa osvedčil a odhalil skutočné chyby:

```
brainstorming → špecifikácia → plán → úloha po úlohe → code review → oprava
```

1. **Špecifikácia** do `docs/superpowers/specs/RRRR-MM-DD-nazov-design.md` —
   rozsah, čo je mimo rozsahu, rozhrania, kritériá úspechu, blokátory.
2. **Plán** do `docs/superpowers/plans/` — úlohy s reálnym kódom a overovacím
   krokom. Žiadne „doplň validáciu" bez toho, ako.
3. **Jedna úloha = jeden commit.** Po každej `pnpm check` a `pnpm test`.
4. **Overuj meraním, nie čítaním.** Viď §7 — všetky vážne chyby vyšli odtiaľ.
5. **Code review** (`/code-review`) po dávke, opraviť, až potom ďalej.

**Veľkosť dávky: 3–5 malých súvisiacich zmien.** Limit nie je v písaní kódu, ale
v overovaní — pri väčšej dávke overovanie zhrubne a chyby prejdú.

### Príkazy

```bash
pnpm exec netlify dev      # jediný správny spôsob — potom otvárať :3000, NIE :8888
pnpm check                 # typy
pnpm test                  # 53 testov
pnpm build                 # produkčný build
pnpm exec prettier --write .
```

> **Vývoj beží na `:3000`, nie `:8888`.** SPA catch-all v `netlify.toml`
> prepisuje aj Vite dev moduly — `/src/main.tsx` príde ako `text/html` a
> aplikácia sa nenaštartuje. Vo `vite.config.ts` je preto proxy `/api → :8888`.

---

## 5. Architektúra

```
shared/                    zdieľané klientom aj funkciami
  pricing.ts               ceny + calcTotal — jediný zdroj pravdy
  availability.ts          pravidlá výberu termínu (exkluzívny odchod)
  contact.ts               telefón, WhatsApp, e-mail, Booking listing
  i18n/{sk,de,en,pl}.ts    slovníky, typované podľa sk

netlify/functions/
  availability.ts          GET /api/availability — iCal → obsadené noci
  inquiry.ts               POST /api/inquiry — validácia + Resend
  lib/                     čistá logika: ical, inquiry-schema, rate-limit

client/src/
  i18n/                    LanguageProvider, vlajky
  components/              13 komponentov, všetky čítajú z t.*
```

**Princípy, ktoré platia:**

- Ceny sú **len** v `shared/pricing.ts`. Web, e-maily aj cenník ich berú odtiaľ,
  takže sa nemôžu rozísť.
- Slovníky sú typované podľa `sk.ts` — **chýbajúci preklad zhodí `pnpm check`**,
  neobjaví sa ako prázdne miesto na živej stránke.
- Čistá logika je oddelená od handlerov, aby sa dala testovať bez servera.
- `netlify/**` **musí** byť v `tsconfig.json`. Keď tam nebolo, `pnpm check`
  hlásil čisto aj s hrubými chybami vo funkciách.

### Premenné prostredia

`ICAL_URLS`, `RESEND_API_KEY`, `OWNER_EMAIL`, `VITE_ANALYTICS_ENDPOINT`,
`VITE_ANALYTICS_WEBSITE_ID` — vzor v `.env.example`, do produkcie cez
Netlify → *Site configuration → Environment variables*.

`.env` je v `.gitignore`. **iCal URL je tajná** — kto ju má, vidí obsadenosť.

---

## 6. Dizajn

**Poradie je záväzné.** Skills rozhodujú *ako*, knižnice dodávajú *čo*. Siahnuť
najprv do knižnice komponentov znamená poskladané kusy, nie dizajn.

1. **Impeccable** — `/impeccable audit`, `/impeccable polish` na rozloženie,
   spacing, typografiu. ⚠️ `/impeccable init` sa ešte nespúšťal; kým nevznikne
   `DESIGN.md`, ostatné príkazy nemajú kontext projektu.
2. **Emilove skills** — `emil-design-eng`, `animate`, `improve-animations`,
   `review-animations` na pohyb a detaily.
3. **Knižnice** — Cult UI, Aceternity, Magic UI, Motion Primitives, Eldora,
   Animata, Coss, Kibo, shadcn/ui. Prebrať markup a logiku, **štýly prepísať**
   na projektovú paletu.

Podrobne: [docs/UI_LIBRARIES.md](docs/UI_LIBRARIES.md).

### Vizuálny jazyk

Nordic Brutalism / Dark Timber. Pozadie `oklch(0.06–0.14 …)`, jantárový akcent
`oklch(0.72 0.12 65)`, `border-radius: 2px`.
Bebas Neue (nadpisy) · Karla (text) · JetBrains Mono (štítky).

### Mobile-first je pravidlo, nie odporúčanie

Každá vizuálna zmena sa navrhuje **najprv na 375 px**, potom na desktop.
Cenník to raz porušil: 480 px tabuľka v scrolli nechala na telefóne viditeľnú
len **vyššiu cenu Bookingu**, kým priama cena bola orezaná a úspora mimo
obrazovky — pod nadpisom „O 10 % lacnejšie". Sekcia argumentovala proti sebe.

---

## 7. Pasce, ktoré nás už stáli čas

Toto sú skutočné chyby z tohto projektu. Každá vyšla z **merania**, nie z
čítania kódu.

| Pasca | Ako sa prejaví |
|---|---|
| **`DTEND` v iCal je exkluzívny** | deň odchodu je voľný pre ďalšieho hosťa; zle → blokuje sa noc navyše pri každej rezervácii |
| **`toISOString()` na lokálny dátum** | v našom pásme posunie deň o jeden dozadu — hosť rezervuje inú noc, než vybral |
| **react-day-picker vráti pri prvom kliku `from === to`** | test „má oba konce" považoval rozostavaný výber za hotový a mazal ho |
| **Inline `style` prebíja Tailwind triedu** | `display: "grid"` v style porazil `md:hidden` — mobilná lišta svietila aj na desktope |
| **`as const` v slovníku** | robil z hodnôt literálne typy; nemčina musela mať doslovne slovenské reťazce |
| **`%VITE_*%` sa nahradí len keď premenná existuje** | inak sa do stránky dostal doslovný reťazec ako URL a zhodil `netlify dev` |
| **Resend nehádže výnimky** | vracia `{data, error}`; bez kontroly `error` sa stratený e-mail tvári ako úspech |
| **`typeof [] === "object"`** | JSON pole prešlo guardom až do Zodu a hosť videl anglickú hlášku |
| **`rAF` v skrytom preview pane nebeží** | framer-motion zamrzne na štartovnej transformácii; vyzerá to ako rozbitý komponent |
| **HMR websocket po reštarte servera** | prehliadač drží starú verziu; „oprava" funkčného kódu |

**Z toho plynie jedno pravidlo:** keď niečo vyzerá rozbité, najprv sa pozri do
konzoly a siete. Dvakrát som takmer „opravoval" funkčný kód, lebo bol zastaraný
alebo prostredie nevykresľovalo.

---

## 8. Fakty o objekte

Overené z Booking listingu 2026-08-19.

| | |
|---|---|
| Adresa | Kamenná 2004/25A, 059 52 Veľká Lomnica |
| Rozloha | 250 m², 3 spálne, 3 kúpeľne, max. 8 hostí |
| Check-in / out | 15:00–23:00 / 08:00–11:00 |
| Minimálny pobyt | 2 noci |
| Storno | zdarma do 14 dní pred príchodom |
| Hodnotenie | 10/10 na Bookingu, **1 recenzia** |
| Telefón | +421 905 111 061 |

**Ceny** (Booking má celoročne rovnakú sadzbu; priama cena je −10 %, zaokrúhlené
nadol na päťky, aby tvrdenie „−10 %" bolo vždy pravdivé):

| Hostí | Booking | Priamo | Ušetrí |
|---|---|---|---|
| 2 | 353 € | **315 €** | 38 € |
| 4 | 453 € | 405 € | 48 € |
| 6 | 653 € | 585 € | 68 € |
| 8 | 753 € | **675 €** | 78 € |

Týždeň pre 8: hosť zaplatí 4 725 € namiesto 5 271 €, **majiteľ zarobí o 245 €
viac** než cez províziu.

**Nesľubovať:** detské postieľky ani prístelky (Booking uvádza, že nie sú),
sezónne ceny (neexistujú), „vhodné pre rodiny" bez výhrady.

---

## 9. Kam sa pozrieť

| Súbor | Na čo |
|---|---|
| [docs/BOOKING_ICAL.md](docs/BOOKING_ICAL.md) | ako získať iCal export, plán obojsmernej synchronizácie |
| [docs/CODEX_REVIEW_ASSESSMENT.md](docs/CODEX_REVIEW_ASSESSMENT.md) | otvorené nálezy z review + kde s ním nesúhlasím |
| [docs/UI_LIBRARIES.md](docs/UI_LIBRARIES.md) | skills a knižnice, poradie použitia |
| `docs/superpowers/specs/` | špecifikácie Vlny 1 a 2 |
| `docs/superpowers/plans/` | implementačné plány |
| [CLAUDE.md](CLAUDE.md) | stále pokyny, načítajú sa automaticky |
