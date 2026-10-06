# Chalet Beyond — project instructions

## Začni tu

**[PLAYBOOK.md](PLAYBOOK.md)** — stav projektu, čo je ďalej, ako sa tu pracuje,
architektúra a pasce, ktoré nás už stáli čas. Prečítať pred novou prácou.

## Dizajn a UI

**Záväzný dizajn je [DESIGN.md](DESIGN.md)** (verzia z 2026-10-01, Dark Timber + fotografie objektu). Kontext produktu a hero je v [PRODUCT.md](PRODUCT.md), schválené zadanie pre sekcie pod hero v [docs/frontend-premium-implementation.md](docs/frontend-premium-implementation.md).

Pri vizuálnej práci používať v tomto poradí — podrobnosti v [docs/UI_LIBRARIES.md](docs/UI_LIBRARIES.md):

1. **Impeccable** (`/impeccable audit`, `/impeccable polish`) na rozloženie, spacing a typografiu. Na začiatku vizuálnej úlohy a pri prehodnocovaní hotového layoutu. Kontext projektu berie z `DESIGN.md`, `PRODUCT.md` a `.impeccable/design.json` — `init` už znova nespúšťať.
2. **Emilove skills** (`emil-design-eng`, `animate`, `improve-animations`, `review-animations`) na animácie a detaily.
3. **Knižnice komponentov** (Cult UI, Aceternity, Magic UI, Motion Primitives, Eldora, Animata, Coss, Kibo, shadcn/ui) až nakoniec, na konkrétny komponent.

Z knižníc preberať markup a logiku, štýly prepísať na projektovú paletu z `DESIGN.md` (oklch, Thunder / Karla / JetBrains Mono) — nekopírovať cudzí design systém.
