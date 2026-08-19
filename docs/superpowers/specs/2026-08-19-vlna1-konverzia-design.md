# Chalet Beyond — Vlna 1: Konverzia

**Dátum:** 2026-08-19
**Stav:** návrh na schválenie

---

## 1. Kontext

Web má silnú značku a vizuál nad úrovňou konkurencie v regióne, ale nemá ani jeden transakčný signál: žiadnu cenu, žiadny telefón, žiadnu reálnu dostupnosť a žiadny funkčný rezervačný krok. Tlačidlo „Skontrolovať dostupnosť" otvorí e-mailový koncept — dostupnosť nekontroluje.

Priamy konkurent vo Veľkej Lomnici (`chatatatrylomnica.sk`) uvádza ceny, dve telefónne čísla, recenzie aj rezervačný formulár. Booking.com a Airbnb odpovedajú na otázky, ktoré tento web necháva visieť, a berú za to 15 % provízie.

**Cieľ Vlny 1:** premeniť web z brožúry na kanál priamej rezervácie, ktorý obchádza províziu Bookingu.

---

## 2. Cenový model

Ceny na Booking.com zistené živým dopytom 2026-08-19 pre termíny 11.–13. 9. 2026 a 12.–14. 2. 2027. Základná sadzba je v oboch termínoch identická — sezónnosť nastavená nie je. Ceny sú vrátane daní a poplatkov.

Priama cena = Booking mínus 10 %, zaokrúhlené **nadol** na násobok 5 €. Zaokrúhľuje sa nadol zámerne, aby skutočná zľava bola vždy ≥ 10 % a tvrdenie „−10 %" bolo pravdivé.

| Hostí | Booking €/noc | **Priamo €/noc** | Úspora €/noc | Skutočná zľava |
|---|---|---|---|---|
| 2 | 353 | **315** | 38 | 10,8 % |
| 3 | 403 | **360** | 43 | 10,7 % |
| 4 | 453 | **405** | 48 | 10,6 % |
| 5 | 553 | **495** | 58 | 10,5 % |
| 6 | 653 | **585** | 68 | 10,4 % |
| 7 | 703 | **630** | 73 | 10,4 % |
| 8 | 753 | **675** | 78 | 10,4 % |

Kontrolný príklad — týždeň pre 8 osôb: hosť zaplatí 4 725 € namiesto 5 271 € (ušetrí 546 €), majiteľ dostane 4 725 € namiesto 4 480 € po provízii (zarobí o 245 € viac).

**Podmienky prevzaté z Bookingu:**
- Minimálna dĺžka pobytu: 2 noci
- Bezplatné storno do 14 dní pred príchodom
- Ceny vrátane daní a poplatkov

**Predpoklad na overenie pred nasadením:** provízia Bookingu je braná ako 15 %. Skutočná sadzba je v extranete (*Finance → Commission*) a môže byť 12–20 % plus Preferred Partner. Ak sa líši, tabuľka sa prepočíta — logika ostáva.

---

## 3. Rozsah

### V rozsahu

| # | Položka |
|---|---|
| 1 | Cenník s porovnaním voči Bookingu |
| 2 | Cena a celková suma v súhrne rezervácie |
| 3 | Telefón + WhatsApp, lepiaca lišta na mobile |
| 4 | Funkčný formulár dopytu s doručením e-mailom |
| 5 | Blokované termíny ťahané z iCal |
| 6 | Odznak hodnotenia 10/10 Booking.com |
| 7 | Oprava obsahových rozporov a doplnenie chýbajúceho vybavenia |
| 8 | Oprava merania návštevnosti |

### Mimo rozsahu

- **Stripe Checkout** — príde, keď bude účet hotový. Vlna 1 stavia cenovú logiku tak, aby ju Stripe vedel použiť bez prepisovania, ale žiadny platobný kód sa teraz nepíše.
- **Viacjazyčnosť (DE/EN/SK)** — Vlna 2. Texty sa preto sústreďujú do `data/` súborov, aby sa neskôr prekladali na jednom mieste.
- **Sekcia recenzií** — objekt má na Bookingu 1 recenziu. Sekcia s jednou recenziou znižuje dôveru viac než jej absencia. Vráti sa, keď bude recenzií aspoň 5.
- **Skrátenie hero sekcie, optimalizácia videí, SEO meta a JSON-LD** — Vlna 3.

---

## 4. Architektúra

```
client/src/
  data/
    pricing.ts               NOVÉ   ceny + výpočet súm, jediný zdroj pravdy
  components/
    PricingSection.tsx       NOVÉ   tabuľka cien + porovnanie s Bookingom
    StickyContactBar.tsx     NOVÉ   mobil: telefón, WhatsApp, rezervácia
    BookingSection.tsx       ÚPRAVA formulár, dostupnosť, ceny, odznak
    AmenitiesSection.tsx     ÚPRAVA doplnené vybavenie
  pages/Home.tsx             ÚPRAVA vloženie PricingSection a StickyContactBar

netlify/functions/
  inquiry.ts                 NOVÉ   POST — validácia + odoslanie cez Resend
  availability.ts            NOVÉ   GET — stiahnutie a parsovanie iCal

netlify.toml                 ÚPRAVA presmerovanie /api/*
client/index.html            ÚPRAVA oprava premenných merania
```

### Tok dát — dostupnosť

1. `BookingSection` pri načítaní zavolá `GET /api/availability`
2. `availability.ts` stiahne iCal URL z premennej prostredia, sparsuje bloky `VEVENT`, vráti zoznam obsadených dní
3. Odpoveď sa cachuje 30 minút
4. Kalendár dostane obsadené dni ako `disabled` — hosť ich nevie vybrať

### Tok dát — dopyt

1. Hosť vyberie termín a počet hostí → `pricing.ts` prepočíta sumu → súhrn ukáže cenu, úsporu a celkovú sumu
2. Hosť vyplní meno, e-mail, telefón, poznámku
3. Odoslanie → `POST /api/inquiry`
4. `inquiry.ts` overí vstup a cez Resend pošle dva e-maily: majiteľovi s termínom a kontaktom, hosťovi potvrdenku

---

## 5. Rozhrania

### `data/pricing.ts`

```ts
export const MIN_NIGHTS = 2;

/** Priama cena za noc podľa počtu hostí (€). */
export const PRICE_PER_NIGHT: Record<number, number>;

/** Cena Booking.com za noc — slúži na zobrazenie úspory. */
export const BOOKING_PRICE_PER_NIGHT: Record<number, number>;

export function calcTotal(
  from: Date,
  to: Date,
  guests: number,
): {
  nights: number;
  perNight: number;
  total: number;
  bookingTotal: number;
  savings: number;
};
```

Tú istú funkciu bude neskôr volať Stripe Checkout na výpočet sumy. Preto vracia hotové čísla, nie polotovar.

### `GET /api/availability`

Odpoveď 200:
```json
{ "blocked": ["2026-08-20", "2026-08-21"], "updated": "2026-08-19T10:00:00Z", "degraded": false }
```

`degraded: true` znamená, že časť zdrojov neodpovedala a zoznam je neúplný. Termíny zo zdrojov, ktoré odpovedali, sa aj tak vrátia — zahodiť ich by ukázalo obsadené noci ako voľné.

Odpoveď 502 nastáva, až keď zlyhajú **všetky** zdroje:
```json
{ "error": "ical_unreachable" }
```

`ical_invalid` namiesto toho, keď zdroj odpovedal, ale neposlal kalendár — typicky zrušená export URL vracajúca prihlasovaciu stránku. Iná príčina, iná oprava.

Hlavičky: `Cache-Control: no-store` (prehliadač nesmie držať vlastnú kópiu, inak hosť s otvorenou stránkou vidí noci predané pred chvíľou) a `Netlify-CDN-Cache-Control: public, max-age=1800` (záťaž absorbuje CDN). Neúplná odpoveď sa necachuje vôbec.

### `POST /api/inquiry`

Telo požiadavky:
```json
{
  "from": "2026-09-11",
  "to": "2026-09-13",
  "guests": 4,
  "name": "…",
  "email": "…",
  "phone": "…",
  "message": "…"
}
```

Odpovede: `200 { "ok": true }`, `400 { "error": "…" }`, `429 { "error": "…" }`, `502 { "error": "…" }`

Voliteľné pole `website` je honeypot — v formulári skryté, takže ho vyplní iba bot. Pri vyplnení sa nič neodošle a vráti sa `200`, aby útočník nedostal návod skúsiť to znova.

Limity: 5 dopytov na IP za 15 minút a 3 na tú istú adresu príjemcu za hodinu → `429`. Bez nich by ktokoľvek mohol z overenej domény posielať e-maily na ľubovoľnú adresu, koľkokrát chce — potvrdenka ide na adresu z tela požiadavky. Limity sú v pamäti inštancie, takže brzdia zaplavenie z jedného zdroja, nie distribuovaný útok.

Validácia na serveri: povinné `from`, `to`, `guests`, `name`, `email`, `phone`; `guests` v rozsahu 1–8; `to` neskôr než `from`; počet nocí ≥ `MIN_NIGHTS`. Validácia na klientovi je len pohodlie, server jej neverí.

### Premenné prostredia

| Premenná | Použitie |
|---|---|
| `RESEND_API_KEY` | odosielanie e-mailov |
| `OWNER_EMAIL` | adresa majiteľa pre dopyty |
| `ICAL_URLS` | zdroje obsadenosti, oddelené čiarkou |
| `VITE_ANALYTICS_ENDPOINT` | meranie návštevnosti |
| `VITE_ANALYTICS_WEBSITE_ID` | meranie návštevnosti |

### `netlify.toml`

Presmerovanie `/api/*` na funkcie musí byť **pred** existujúcim SPA pravidlom — Netlify použije prvé vyhovujúce pravidlo, takže pri opačnom poradí by `/api/*` skončilo na `index.html`.

```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

---

## 6. Obsahové opravy

Zistené porovnaním webu s listingom na Booking.com.

### Rozpory na odstránenie

| Web teraz tvrdí | Skutočnosť podľa Bookingu | Riešenie |
|---|---|---|
| „Vhodné pre rodiny" bez výhrady | Detské postieľky ani prístelky nie sú k dispozícii | Doplniť do pravidiel domu |
| — | Deti od 16 rokov sa účtujú ako dospelí | Doplniť do pravidiel domu |
| „Sezónne ceny" | Jedna sadzba celoročne | Odstrániť tvrdenie |
| Golf „dve minúty od vchodových dverí" | Ihrisko do 3,2 km | Overiť u majiteľa, zosúladiť |

Prvé dva riadky sú prevencia zlých recenzií: rodina s dieťaťom si rezervuje a na mieste zistí, že postieľka nie je.

### Vybavenie na doplnenie

Je na Bookingu, na webe chýba: **letiskový transfer**, **lyžiareň**, práčka a sušička, Netflix, detská stolička, kávovar, umývačka riadu, župany a papuče, vonkajšie ohnisko, balkón, samostatný vchod.

Letiskový transfer je pri zahraničných hosťoch letiacich do Popradu silný argument a momentálne nie je na webe vôbec.

---

## 7. Ošetrenie chýb

Zámerne minimálne. Žiadne opakované pokusy, žiadne fronty.

| Situácia | Správanie |
|---|---|
| `/api/availability` zlyhá | Kalendár ostane bez blokovania, pod ním tichá poznámka „dostupnosť overíme e-mailom". Stránka funguje ďalej. |
| `/api/inquiry` zlyhá | Chybová hláška s telefónom a e-mailom ako náhradnou cestou. Vyplnené údaje sa nestratia. |
| iCal vráti poškodený obsah | Funkcia vráti 502, klient sa správa ako pri zlyhaní vyššie. |

---

## 8. Kritériá úspechu

Overiteľné, nie dojmové.

1. **Dostupnosť sa premietne do kalendára** — zablokovať testovací termín v Booking extranete, počkať na obnovu cache, načítať web: daný deň je v kalendári neklikateľný.
2. **Dopyt sa doručí** — odoslať formulár s reálnymi údajmi: majiteľovi príde e-mail s termínom, počtom hostí, sumou a kontaktom; odosielateľovi príde potvrdenka.
3. **Cena je viditeľná** — v sekcii Rezervácia je cena za noc, celková suma a úspora voči Bookingu bez ďalšieho scrollovania.
4. **Výpočet sedí** — 8 hostí × 7 nocí = 4 725 €, úspora 546 €.
5. **Meranie funguje** — požiadavka na endpoint merania vráti 200, v logoch nie je `Malformed URI sequence`.
6. **Web prežije výpadok** — vypnúť funkciu `availability`: stránka sa načíta, kalendár funguje, formulár sa dá odoslať.
7. **Validácia drží** — odoslanie požiadavky s 1 nocou alebo 9 hosťami priamo na endpoint vráti 400.

---

## 9. Blokátory

Bez týchto údajov sa Vlna 1 nedá nasadiť. Komponenty sa dajú postaviť s dočasnými hodnotami, ale zverejniť takto by bolo horšie než súčasný stav.

| Údaj | Kde ho majiteľ získa |
|---|---|
| Telefónne číslo a či je na ňom WhatsApp | — |
| iCal URL obsadenosti | Booking extranet → *Rates & Availability → Sync calendars* |
| Skutočné % provízie | Booking extranet → *Finance → Commission* |
| `RESEND_API_KEY` + overená doména | resend.com |
| Endpoint a ID merania | inštancia Umami |
| Potvrdenie vzdialenosti na golfové ihrisko | — |

---

## 10. Poznámka k cenovej parite

Booking mal v partnerských zmluvách klauzuly zakazujúce nižšiu cenu na vlastnom webe. Od mája 2024 je Booking.com podľa nariadenia Digital Markets Act označený za „gatekeepera" a článok 5(3) tieto klauzuly v EHP zakazuje. Slovensko je členom EÚ, takže nižšia priama cena je prípustná.

Napriek tomu odporúčame potvrdiť si to s account manažérom Bookingu pred zverejnením — nie kvôli právu, ale aby nasadenie neprekvapil zásah do viditeľnosti listingu.
