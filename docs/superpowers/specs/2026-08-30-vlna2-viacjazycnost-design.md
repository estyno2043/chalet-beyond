# Chalet Beyond — Vlna 2: Viacjazyčnosť (SK / DE / EN / PL)

**Dátum:** 2026-08-30
**Stav:** návrh na schválenie

---

## 1. Kontext

Web je výhradne po slovensky. Majiteľ uvádza, že väčšina hostí hovorí po nemecky — tí dnes prídu na stránku, ktorej nerozumejú, a odídu. Je to najväčšia neadresovaná strata trhu z pôvodného auditu.

Poľština je štvrtý jazyk zámerne: Poľsko je dve hodiny cesty a najväčší zdrojový trh Tatier, väčší než Nemecko.

**Cieľ:** sprístupniť web v štyroch jazykoch tak, aby ho vyhľadávače indexovali samostatne a aby cudzojazyčný hosť dostal text, ktorý neznie strojovo.

## 2. Rozsah

### V rozsahu

| # | Položka |
|---|---|
| 1 | Prekladová vrstva bez knižnice — kontext + `useT()` |
| 2 | Štyri jazykové súbory, typované podľa slovenčiny |
| 3 | URL na jazyk: `/`, `/de/`, `/en/`, `/pl/` |
| 4 | Prepínač jazykov s SVG vlajkami a názvom jazyka |
| 5 | `<html lang>` podľa jazyka |
| 6 | `hreflang` odkazy medzi jazykovými verziami |
| 7 | Preklad všetkých textov v 10 komponentoch |

### Mimo rozsahu

- **E-maily z `/api/inquiry`** — zostávajú po slovensky. Chodia majiteľovi; potvrdenka hosťovi sa preloží až keď bude Resend funkčný, aby sa to dalo overiť odoslaním.
- **Preklad chybových hlášok endpointov** — rovnaký dôvod.
- **Automatické presmerovanie podľa jazyka prehliadača** — zámerne nie, viď §5.

## 3. Jazyky

| Jazyk | Kód | URL | Vlajka | Poznámka |
|---|---|---|---|---|
| Slovenčina | `sk` | `/` | 🇸🇰 | východiskový, bez prefixu |
| Nemčina | `de` | `/de/` | 🇩🇪 | **primárny cieľový trh** |
| Angličtina | `en` | `/en/` | 🇬🇧 | záchytný pre ostatných |
| Poľština | `pl` | `/pl/` | 🇵🇱 | najväčší zdrojový trh regiónu |

Slovenčina zostáva na koreni bez prefixu — web už na tej adrese beží a presúvať ho na `/sk/` by zahodilo existujúce odkazy.

## 4. Politika textu

**Funkčný obsah sa prekladá presne.** Ceny, vybavenie, pravidlá domu, formulár, storno podmienky, chybové hlášky. Tu je presnosť dôležitejšia než štýl a nesmie vzniknúť rozpor medzi jazykmi.

**Atmosférický obsah sa píše nanovo.** Hero, `TextRevealSection`, citáty. Doslovný preklad poetickej slovenčiny znie v nemčine strojovo — a pri cene 675 €/noc je to presne ten dojem, ktorý odrádza. Cieľom je rovnaký zmysel a rovnaký register, nie rovnaké slová.

**Nemčina používa vykanie (`Sie`)** a uvádza ceny s tým, čo je zahrnuté. Nemecký prémiový hosť to očakáva a jeho absencia pôsobí neprofesionálne.

> ⚠️ Nemecké texty by mal pred nasadením prečítať majiteľ alebo rodený hovoriaci. Je to primárny trh a preklad, ktorý „takmer sedí", tam škodí viac než inde.

## 5. Prečo bez automatického presmerovania

Presmerovanie podľa `Accept-Language` sa javí ako ústretové, ale robí dve škody: vyhľadávačom sťažuje indexáciu (crawler dostane inú stránku než používateľ) a hosťovi berie kontrolu — Slovák s anglickým systémom skončí na `/en/` bez možnosti to čakať.

Jazyk sa preto mení výhradne kliknutím a voľba sa pamätá v `localStorage` len na to, aby prepínač pri návrate ukázal rovnaký jazyk.

## 6. Architektúra

```
shared/i18n/
  types.ts        NOVÉ  Lang, tvar slovníka odvodený zo sk
  sk.ts           NOVÉ  zdroj pravdy pre kľúče
  de.ts           NOVÉ
  en.ts           NOVÉ
  pl.ts           NOVÉ
  index.ts        NOVÉ  dictionaries, langFromPath, pathForLang

client/src/i18n/
  LanguageProvider.tsx  NOVÉ  kontext + useT()
  flags.tsx             NOVÉ  štyri inline SVG vlajky

client/src/components/
  LanguageSwitcher.tsx  NOVÉ  vlajka + názov jazyka
  Navigation.tsx        ÚPRAVA  vloženie prepínača
  (9 ďalších)           ÚPRAVA  nahradenie textov za t.*

client/src/App.tsx      ÚPRAVA  routy pre /de/, /en/, /pl/
client/index.html       ÚPRAVA  hreflang
```

Typovanie je podstatné: `de.ts`, `en.ts` a `pl.ts` implementujú typ odvodený zo `sk.ts`, takže **chýbajúci kľúč zhodí `pnpm check`**. Bez toho by sa neúplný preklad prejavil až prázdnym miestom na produkčnej stránke.

## 7. Rozhranie

```ts
export type Lang = "sk" | "de" | "en" | "pl";
export type Dict = typeof sk;

/** Jazyk z cesty; "/" a neznáme prefixy dávajú sk. */
export function langFromPath(pathname: string): Lang;

/** Cesta pre daný jazyk pri zachovaní zvyšku URL. */
export function pathForLang(pathname: string, lang: Lang): string;
```

```tsx
const t = useT();          // vráti slovník aktuálneho jazyka
<h2>{t.booking.heading}</h2>
```

## 8. Vlajky a prístupnosť

Vlajka označuje krajinu, nie jazyk — nemecky sa hovorí aj v Rakúsku a Švajčiarsku, angličtina vlajku nemá vôbec. Prepínač preto zobrazuje **vlajku aj názov jazyka** (`Deutsch`, `English`, `Polski`, `Slovenčina`); vlajka je vizuálna kotva, nie jediná informácia.

Každý odkaz nesie `hreflang` a `aria-label` s názvom jazyka. Vlajky sú inline SVG — bez sieťových požiadaviek, ostré v každej veľkosti, prejdú CSP.

## 9. Kritériá úspechu

1. **Štyri jazyky sa načítajú** — `/`, `/de/`, `/en/`, `/pl/` vrátia stránku v danom jazyku, žiadny slovenský text neprerazí.
2. **Chýbajúci preklad neprejde** — odstránenie kľúča z `de.ts` zhodí `pnpm check`.
3. **`<html lang>` sedí** — na `/de/` je `lang="de"`.
4. **`hreflang` je úplný** — každá verzia odkazuje na ostatné tri aj na seba.
5. **Prepínač zachová pozíciu** — prepnutie z `/de/#rezervacia` vedie na `/#rezervacia`, nie na vrch stránky.
6. **Mobil** — prepínač je dosiahnuteľný v mobilnom menu a nepretečie pri 375 px.
7. **Ceny sa nerozídu** — cenník aj súhrn ukazujú vo všetkých jazykoch rovnaké čísla zo `shared/pricing.ts`.

## 10. Otvorené

| Vec | Kto |
|---|---|
| Kontrola nemeckých textov rodeným hovoriacim | majiteľ |
| Preklad e-mailov hosťovi | po sprevádzkovaní Resend |
