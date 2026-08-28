# Booking.com — iCal kalendár

## Dva smery, nezamieňať ich

Booking má v extranete pod *Rates & Availability → Sync calendars* dve oddelené funkcie:

| Smer | Kto komu dáva odkaz | Čo to robí | Potrebujeme? |
|---|---|---|---|
| **Export calendar** | **Booking dá odkaz nám** | Booking zverejní svoju obsadenosť ako `.ics` súbor na URL, ktorú si stiahneme | ✅ **Áno, hneď** |
| **Import calendar** | My dáme odkaz Bookingu | Booking si sťahuje obsadenosť z **nášho** kalendára a blokuje si podľa neho termíny | ❌ Zatiaľ nie |

**Pre `ICAL_URLS` potrebujeme Export.** Ten nevyžaduje od nás žiadnu URL, žiadny kalendár, žiadnu hotovú stránku — Booking ho vygeneruje sám a hneď.

Booking to sám potvrdzuje: v extranete v paneli **„Vysvetlenie stavov"** je samostatný stav **„Len export"** — *„Druhej platforme posielame iba informácie o rezervácii. Do vášho kalendára na Booking.com sa nič neimportuje."* Export bez importu je teda podporovaný režim, nie provizórium. Cieľový stav je **„OK"** (*„Prepojenie importu a exportu funguje bez problémov"*), ku ktorému sa dostaneme po doplnení importu.

Import je opačný smer a **teraz ho spraviť nedá**: aby sme Bookingu dali odkaz, museli by sme publikovať vlastný `.ics` feed s našimi priamymi rezerváciami. Lenže priame rezervácie zatiaľ nikde neukladáme — `/api/inquiry` pošle e-mail a skončí, žiadna databáza nie je. Import má zmysel až keď budú priame rezervácie niekde uložené (Stripe checkout, Vlna 2+); vtedy Bookingu dáme URL v tvare `https://chaletbeyond.sk/api/calendar.ics`.

**Obojsmerné prepojenie je správny cieľ, len nie je podmienkou prvého kroku.** Export sa dá zapnúť hneď a funguje samostatne. Import sa doplní neskôr a nič na exporte nemení.

---

## Postup: získať Export odkaz (to, čo treba teraz)

> **Dôležité:** extranet otvorí sprievodcu „Pridať kalendár", kde je **1. Importovať kalendár** a **2. Export kalendára**. Vyzerá to, že bez vyplnenia kroku 1 sa ku kroku 2 nedá dostať — **nie je to tak**. Pod tlačidlami *Ďalší krok / Zrušiť* je odkaz **„Prejdite rovno na export"**. Ten krok 1 preskočí.
>
> Krok 1 (import) od nás chce URL nášho kalendára, ktorú zatiaľ nemáme čo poskytnúť. Krok 2 (export) od nás nechce nič.

1. Prihlásiť sa do [Booking.com Extranet](https://admin.booking.com)
2. Vybrať ubytovanie **Chalet Beyond**
3. Menu **Ceny a dostupnosť** → **Synchronizácia kalendárov**
4. Vybrať izbu **Vila s 3 spálňami** (jediný typ, ktorý objekt má)
5. Otvorí sa „Pridať kalendár pre: Vila s 3 spálňami" → kliknúť **„Prejdite rovno na export"**
   *(Nevypĺňať polia „Skopírujte odkaz na kalendár nižšie" ani „Názov kalendára" — to je import, opačný smer.)*
6. V sekcii **Vyberte si, čo chcete exportovať** zvoliť **rezervácie aj zatvorené termíny**, nie len rezervácie.

   > ⚠️ **Toto je jediné miesto, kde sa dá nastavenie pokaziť tak, že to nikto hneď nezbadá.** Ak sa exportujú len rezervácie, termíny, ktoré majiteľ zavrel ručne (údržba, vlastný pobyt, rodina), sa do nášho feedu nedostanú. Náš kalendár ich ukáže ako voľné, hosť si taký termín vyberie a odošle dopyt — a nikde to nevyhodí chybu, lebo feed je technicky v poriadku. Vyzerá to ako funkčná synchronizácia až do prvého konfliktu.

7. Skopírovať zobrazenú URL — vyzerá približne takto:
   ```
   https://ical.booking.com/v1/export?t=<dlhý-token>
   ```
8. Odkaz je **tajný** — kto ho má, vidí obsadenosť objektu. Neposielať ho v chate, needovávať do repa.

### Kam ho zapísať

**Lokálne** — súbor `.env` v koreni projektu (je v `.gitignore`, do gitu sa nedostane):
```bash
ICAL_URLS=https://ical.booking.com/v1/export?t=<token>
```

**Na produkcii** — Netlify: *Site configuration → Environment variables → Add a variable*, kľúč `ICAL_URLS`, tá istá hodnota.

Viac zdrojov naraz sa oddeľuje čiarkou (napr. keď pribudne Airbnb):
```bash
ICAL_URLS=https://ical.booking.com/v1/export?t=<token>,https://www.airbnb.com/calendar/ical/<id>.ics
```

### Overenie, že to funguje

```bash
curl -s "<URL z Bookingu>" | head -20
```
Očakávaný začiatok výstupu:
```
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART;VALUE=DATE:...
```

Ak príde HTML alebo prihlasovacia stránka, odkaz je neplatný alebo expirovaný — vygenerovať nanovo. Náš parser (`netlify/functions/lib/ical.ts`) takýto prípad zámerne odmietne výnimkou a endpoint vráti `ical_invalid` namiesto toho, aby tvrdil, že nie je nič obsadené.

Potom lokálne:
```bash
pnpm exec netlify dev
curl -s http://localhost:8888/api/availability
```
Očakávané: `{"blocked":["2026-..-..",...],"updated":"...","degraded":false}`

---

## Plán pre import (obojsmerné prepojenie)

Rozhodnuté: **až po dokončení Vlny 1**, ako samostatná špecifikácia. Do vtedy beží „Len export" a majiteľ potvrdzuje dopyty ručne, tak ako doteraz — čiže oproti dnešku nevzniká žiadne nové riziko.

Chýbajúci diel nie je URL, ale **úložisko potvrdených priamych rezervácií**. Dnes si neukladáme nič.

Dve cesty, ako ho naplniť:

| | Kto zapisuje | Kedy |
|---|---|---|
| **B — potvrdenie majiteľom** | tlačidlo *Potvrdiť rezerváciu* v dopytovom e-maile | dá sa hneď, bez Stripe |
| **A — cez Stripe** | webhook po úspešnej platbe | Vlna 2 |

Úložisko je v oboch prípadoch to isté (**Netlify Blobs** — súčasť Netlify, free plán, žiadna databáza navyše), takže `/api/calendar.ics` sa pri prechode z B na A nemení. Postaviť B, neskôr pripojiť A.

### Dve podmienky, bez ktorých sa to ticho pokazí

**Náš feed smie obsahovať výhradne priame rezervácie.** Nikdy nie termíny stiahnuté z Bookingu. Inak vznikne slučka: Booking vyexportuje termín → my si ho stiahneme → vydáme ho vo vlastnom feede → Booking si ho naimportuje späť ako cudzí blok. Toto je najčastejšia príčina, prečo obojsmerné iCal prepojenia začnú robiť neporiadok. `/api/availability` (čítanie z Bookingu) a `/api/calendar.ics` (zápis pre Booking) preto musia mať **oddelené zdroje dát** — nikdy sa nesmú kŕmiť navzájom.

**Dvojitú rezerváciu to nevylúči úplne.** Obe strany sťahujú každých 1–2 h. Dvaja hostia si môžu rezervovať ten istý týždeň na dvoch platformách v rámci toho okna a prejdú obaja. Riziko výrazne klesne, nezmizne. Úplne to rieši až channel manager s push API (Smoobu, Beds24) — mesačný poplatok, pre jeden objekt zatiaľ neopodstatnený.

---

## Na čo si dať pozor

**Synchronizácia nie je okamžitá.** Booking a Airbnb obnovujú iCal typicky každých 1–2 hodiny. Náš endpoint navyše cachuje odpoveď 30 minút na CDN. Medzi rezerváciou na Bookingu a jej zobrazením na našom webe teda môže uplynúť aj ~2,5 hodiny — v tom okne existuje riziko dvojitej rezervácie. Preto formulár posiela **nezáväzný dopyt**, nie potvrdenú rezerváciu; dostupnosť potvrdzuje majiteľ.

**Export nezahŕňa priame rezervácie.** Booking vie len o svojich vlastných. Ak si niekto rezervuje priamo cez náš web, Booking o tom nevie a môže ten termín predať znova. Toto vyrieši až Import (opačný smer), keď budeme mať kde priame rezervácie ukladať.

**Odkaz môže expirovať.** Ak Booking token zruší alebo sa zmení, feed začne vracať HTML. Endpoint to zaloguje ako `feed invalid` a vráti `ical_invalid` — čiže v logoch je jasne vidieť, že treba vygenerovať novú URL, nie hľadať výpadok siete.

---

## Zdroje

- [How to export or import a calendar — Booking.com Partner Help](https://partnerhelp.booking.com/hc/en-us/articles/115005213509-How-to-export-or-import-a-calendar)
- [Syncing your Booking.com calendar to third-party calendars](https://partner.booking.com/en-us/help/rates-availability/extranet-calendar/syncing-your-bookingcom-calendar-third-party-calendars)
