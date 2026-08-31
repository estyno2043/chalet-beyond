# UI zdroje — skills a knižnice

Dva druhy zdrojov: **skills**, ktoré určujú *ako* o dizajne rozhodovať, a **knižnice**, z ktorých sa berú hotové komponenty. Skills idú prvé — knižnica bez úsudku dá poskladané kusy, nie dizajn.

---

## Skills (nainštalované, používať priebežne)

### Impeccable — layout a spacing

**Kedy:** na začiatku každej vizuálnej úlohy a pri prehodnocovaní hotového rozloženia.

Plugin `impeccable@impeccable`. 23 príkazov cez `/impeccable <príkaz> <cieľ>` a 61 deterministických pravidiel na odhalenie typických AI vzorov — všade Inter, fialovo-modré gradienty, karty v kartách, ikona v zaoblenom štvorci nad každým nadpisom.

| Príkaz | Na čo |
|---|---|
| `/impeccable init` | raz na projekt — vytvorí `PRODUCT.md` a `DESIGN.md`, z ktorých čerpajú ostatné príkazy |
| `/impeccable audit` | nájde problémy v existujúcom rozložení |
| `/impeccable polish` | doladí spacing, hierarchiu, typografiu |
| `/impeccable critique` | dizajnová kritika s odôvodnením |

> ⚠️ `init` sa ešte **nespúšťal**. Kým nevznikne `DESIGN.md`, ostatné príkazy nemajú kontext o tomto projekte a budú hádať. Spustiť pred prvým väčším vizuálnym zásahom.

### Emil Kowalski — animácie a design engineering

**Kedy:** pri akejkoľvek animácii a pri detailoch, ktoré rozhodujú, či rozhranie pôsobí drahé alebo lacné.

Inštalované cez `npx skills add emilkowalski/skills`, verzie pinnuté v `skills-lock.json`.

| Skill | Na čo |
|---|---|
| `emil-design-eng` | hlavný — filozofia UI polish a rozhodovanie o detailoch |
| `animate` | postaví animáciu od nuly so správnou krivkou, trvaním a vlastnosťami |
| `improve-animations` | zlepší existujúce |
| `review-animations` | posúdi hotové |
| `find-animation-opportunities` | nájde miesta, kde animácia dáva zmysel |
| `animation-vocabulary` | spoločný slovník na popis pohybu |
| `pick-ui-library` | výber knižnice pre konkrétny prípad |
| `apple-design` | Apple HIG princípy |

Rieši presne to, čo agenti kazia najčastejšie — `ease-in` na nábehovú animáciu tam, kde patrí `ease-out`, alebo plný border namiesto poloprehľadného tieňa.

### Poradie pri vizuálnej práci

1. `/impeccable init` (raz), potom `audit` alebo `polish` na rozloženie a spacing
2. Emilove skills na pohyb a detaily
3. Až potom siahnuť do knižníc nižšie po konkrétny komponent

---

## Knižnice komponentov

| Knižnica | URL | Zameranie |
|---|---|---|
| Cult UI | https://www.cult-ui.com/ | Animované komponenty s výraznými mikro-interakciami, karty, dock, textové efekty |
| Aceternity UI | https://ui.aceternity.com/components | Veľká sada vizuálne bohatých efektov — 3D karty, spotlight, background beams, parallax |
| Magic UI | https://magicui.design/docs/components | Marketingové/landing komponenty — animované tlačidlá, particles, meteor efekty, bento grids |
| Motion Primitives | https://motion-primitives.com/ | Nízkoúrovňové animačné primitívy nad Motion (Framer Motion nástupca) — skladateľné, menej „hotové" |
| Eldora UI | https://www.eldoraui.site/ | Animované komponenty podobné Aceternity/Magic UI |
| Animata | https://animata.design/components | Copy-paste animácie zamerané na jemné detaily (hover, loading, text reveal) |
| Coss UI | https://coss.com/ui | Komponentová knižnica, širší katalóg |
| Kibo UI | https://www.kibo-ui.com/ | Komponenty nad shadcn/ui — rozširuje shadcn o zložitejšie prípady (kanban, gantt, editor) |
| shadcn/ui | https://ui.shadcn.com/ | Základná vrstva — projekt ju **už používa** (`client/src/components/ui/`, Radix + Tailwind). Ostatné knižnice v zozname sú buď nad ňou postavené, alebo ju dopĺňajú. |

## Ako s tým pracovať v tomto projekte

- Projekt má vlastný vizuálny jazyk (Nordic Brutalism / Dark Timber — pozri `client/src/pages/Home.tsx` hlavičkový komentár, `Bebas Neue` / `Karla` / `JetBrains Mono`, oklch farby, `amber-rule`). Komponenty z týchto knižníc **preniesť do existujúceho štýlu**, nekopírovať ich vlastné farby/fonty/border-radius.
- `client/src/components/ui/` už obsahuje veľkú časť shadcn katalógu (`button`, `card`, `dialog`, `calendar`, ...) — pred pridaním nového komponentu skontrolovať, či ekvivalent už nie je v projekte.
- Animácie stavať na `framer-motion` (už závislosť) a existujúcich helperoch `FadeUp`, `useScrollAnimation`, `TextRevealSection` — nepridávať druhú animačnú knižnicu popri Motion, ak sa dá to isté spraviť s tým, čo tu je.
- Pri kopírovaní komponentu z ktorejkoľvek knižnice vyššie: preniesť len markup + logiku, prepísať štýly na projektové oklch premenné a existujúce Tailwind utility triedy, nie vkladať cudzí design token systém.
