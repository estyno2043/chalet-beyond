# Booking.com — iCal kalendár

## Dva smery, nezamieňať ich

Booking má v extranete pod *Rates & Availability → Sync calendars* dve oddelené funkcie:

| Smer | Kto komu dáva odkaz | Čo to robí | Potrebujeme? |
|---|---|---|---|
| **Export calendar** | **Booking dá odkaz nám** | Booking zverejní svoju obsadenosť ako `.ics` súbor na URL, ktorú si stiahneme | ✅ **Áno, hneď** |
| **Import calendar** | My dáme odkaz Bookingu | Booking si sťahuje obsadenosť z **nášho** kalendára a blokuje si podľa neho termíny | ❌ Zatiaľ nie |

**Pre `ICAL_URLS` potrebujeme Export.** Ten nevyžaduje od nás žiadnu URL, žiadny kalendár, žiadnu hotovú stránku — Booking ho vygeneruje sám a hneď.

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
6. V sekcii **Export kalendára** skopírovať zobrazenú URL — vyzerá približne takto:
   ```
   https://ical.booking.com/v1/export?t=<dlhý-token>
   ```
7. Odkaz je **tajný** — kto ho má, vidí obsadenosť objektu. Neposielať ho v chate, needovávať do repa.

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

## Na čo si dať pozor

**Synchronizácia nie je okamžitá.** Booking a Airbnb obnovujú iCal typicky každých 1–2 hodiny. Náš endpoint navyše cachuje odpoveď 30 minút na CDN. Medzi rezerváciou na Bookingu a jej zobrazením na našom webe teda môže uplynúť aj ~2,5 hodiny — v tom okne existuje riziko dvojitej rezervácie. Preto formulár posiela **nezáväzný dopyt**, nie potvrdenú rezerváciu; dostupnosť potvrdzuje majiteľ.

**Export nezahŕňa priame rezervácie.** Booking vie len o svojich vlastných. Ak si niekto rezervuje priamo cez náš web, Booking o tom nevie a môže ten termín predať znova. Toto vyrieši až Import (opačný smer), keď budeme mať kde priame rezervácie ukladať.

**Odkaz môže expirovať.** Ak Booking token zruší alebo sa zmení, feed začne vracať HTML. Endpoint to zaloguje ako `feed invalid` a vráti `ical_invalid` — čiže v logoch je jasne vidieť, že treba vygenerovať novú URL, nie hľadať výpadok siete.

---

## Zdroje

- [How to export or import a calendar — Booking.com Partner Help](https://partnerhelp.booking.com/hc/en-us/articles/115005213509-How-to-export-or-import-a-calendar)
- [Syncing your Booking.com calendar to third-party calendars](https://partner.booking.com/en-us/help/rates-availability/extranet-calendar/syncing-your-bookingcom-calendar-third-party-calendars)
