# Chalet Beyond — project instructions

## Začni tu

**[PLAYBOOK.md](PLAYBOOK.md)** — stav projektu, čo je ďalej, ako sa tu pracuje,
architektúra a pasce, ktoré nás už stáli čas. Prečítať pred novou prácou.

## Dizajn a UI

Pri vizuálnej práci používať v tomto poradí — podrobnosti v [docs/UI_LIBRARIES.md](docs/UI_LIBRARIES.md):

1. **Impeccable** (`/impeccable audit`, `/impeccable polish`) na rozloženie, spacing a typografiu. Na začiatku vizuálnej úlohy a pri prehodnocovaní hotového layoutu. `/impeccable init` sa ešte nespúšťal — spustiť pred prvým väčším zásahom, inak ostatné príkazy nemajú kontext projektu.
2. **Emilove skills** (`emil-design-eng`, `animate`, `improve-animations`, `review-animations`) na animácie a detaily.
3. **Knižnice komponentov** (Cult UI, Aceternity, Magic UI, Motion Primitives, Eldora, Animata, Coss, Kibo, shadcn/ui) až nakoniec, na konkrétny komponent.

Z knižníc preberať markup a logiku, štýly prepísať na projektovú paletu (oklch, Bebas Neue / Karla / JetBrains Mono) — nekopírovať cudzí design systém.
