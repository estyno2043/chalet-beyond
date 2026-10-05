# Cenník a časové akcie

Základné ceny webu podľa dodaného cenníka: 1–2 dospelí 300 €, 3 dospelí 350 €, 4 dospelí 400 €, 5 dospelí 500 €, 6 dospelí 600 €, 7 dospelí 650 €, 8 dospelí 700 € za noc. Pri nasadení sa tieto sadzby používajú priamo; screenshot neberieme ako podklad na ďalší neodsúhlasený odpočet.

Dieťa vo veku 0–15 rokov: základná sadzba 40 € za noc. Najviac 8 hostí spolu, najmenej jeden dospelý a dve noci. Pri 7 a viac nociach sa automaticky odpočíta 20 % z celého pobytu vrátane detí.

Príklad: 2 dospelí + 2 deti, 7 nocí. Základ 380 × 7 = 2 660 €, zľava 532 €, spolu **2 128 €**.

## Pridanie akcie

Upravte `ACTIVE_PROMOTIONS` v `shared/pricing-promotions.ts`. Súbor používajú kalkulačka webu aj server, ktorý cenu prepočíta pri odoslaní dopytu. Aktuálne je zoznam prázdny; žiadna termínová akcia nie je aktívna.

Percentuálna zľava z ceny celej noci, vrátane detí:

```ts
export const ACTIVE_PROMOTIONS: readonly DatePromotion[] = [
  {
    id: "januar-2027",
    label: "Januárová ponuka",
    from: "2027-01-10",
    through: "2027-01-31",
    percentOff: 15,
  },
];
```

Alebo akciová cena za dospelých podľa obsadenosti. Deti sa pripočítajú po 40 € za noc:

```ts
export const ACTIVE_PROMOTIONS: readonly DatePromotion[] = [
  {
    id: "februar-2027",
    label: "Februárová ponuka",
    from: "2027-02-01",
    through: "2027-02-28",
    adultRateByGuests: { 2: 250, 3: 300, 4: 350 },
  },
];
```

Jedna akcia má buď `percentOff`, alebo `adultRateByGuests`. Pre ďalšiu akciu pridajte ďalší objekt do zoznamu s unikátnym `id`. Chýbajúca sadzba pre počet dospelých ponechá základnú cenu. Jeden dospelý zdedí sadzbu dvoch, pokiaľ výslovne nenastavíte aj sadzbu `1`.

`from` je prvá zlacnená noc, `through` posledná zlacnená noc. Príklad január: noc 31. januára je zlacnená aj pri odchode 1. februára. Deň odchodu sa neúčtuje. Zľava platí iba na noci v danom období, aj keď pobyt zasahuje mimo neho.

Pri prekrývajúcich sa akciách sa vyberie najnižšia cena každej noci. Pri pobyte na 7+ nocí sa porovná cena s akciami a cena s týždňovou zľavou 20 %; použije sa lacnejšia celková ponuka. Zľavy sa nesčítavajú. Rekapitulácia a oba e-maily ukazujú základ, použitú zľavu a výslednú cenu.

## Zverejnenie

1. Upravte konfiguráciu a spustite `pnpm test` a `pnpm check`.
2. Spustite nový build a nasaďte web aj Netlify funkcie z rovnakého commitu.
3. Overte termín pred akciou, počas nej a na hranici poslednej zlacnenej noci.

Ide o konfiguráciu v repozitári. Nejde o prihlasovací administračný formulár a úprava vyžaduje nový build. Dopyt stále podlieha osobnému potvrdeniu dostupnosti a konečnej ceny.
