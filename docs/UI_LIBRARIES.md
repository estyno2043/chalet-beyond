# UI a animačné knižnice — referenčný zdroj

Pri tvorbe alebo úprave komponentov a animácií čerpať prednostne z týchto knižníc. Sú to väčšinou copy-paste komponenty (nie npm balíčky s runtime závislosťou) postavené na Tailwind CSS a Framer Motion / Motion — rovnaký stack, aký už projekt používa (`client/src/components/ui/*`, `framer-motion` v `package.json`).

## Zoznam

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
