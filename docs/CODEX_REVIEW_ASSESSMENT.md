# Posúdenie Codex review

**Predmet:** `docs/superpowers/plans/2026-08-30-full-release-remediation.md`
**Posúdené:** 2026-08-30, proti `HEAD` na vetve `wave1-konverzia`
**Stav:** body 1–5 z poradia nižšie **opravené 2026-09-02**; zostáva 6

Review je vecný a väčšina nálezov je pravdivá. Nižšie je overenie každého z nich
proti skutočnému kódu, nie proti tvrdeniu, plus body, v ktorých s ním nesúhlasím.

> ⚠️ Review beží proti commitu `39972d7`, čo je **pred** opravou kalendára
> (`8511483`) a **pred** celou Vlnou 2. Časť nálezov je tým už neaktuálna.

---

## Už opravené — nález neplatí

| Nález | Stav |
|---|---|
| P0 „Date range can cross occupied nights" | **Opravené** v `8511483` funkciou `rangeIsFree`. Overené: `BookingSection.tsx:120`. |

## Potvrdené a neopravené

| Priorita | Nález | Overenie proti kódu |
|---|---|---|
| **P0** | Server neoveruje dostupnosť | `inquiry.ts` má **0** referencií na dostupnosť. Kontroluje dátumy, hostí aj cenu, ale nie či je termín voľný. |
| **P0** | Kalendár je klikateľný skôr než príde feed | `blocked` štartuje ako `[]` a kalendár sa vykreslí okamžite. Preteky sú reálne. |
| **P0** | Falošné telefónne číslo | `+421000000000` stále v `shared/contact.ts`. Chráni to len grep v Úlohe 16. |
| **P1** | Tajná iCal URL sa loguje | `availability.ts:66` loguje `failure.url` **vrátane tokenu**. Kto má prístup k logom, vidí obsadenosť objektu. |
| **P1** | UI klame o odoslaní potvrdenky | Endpoint vracia `{ok:true}` aj keď potvrdenka hosťovi zlyhala; panel tvrdí „Potvrdenie sme poslali na …". |
| **P1** | Formulár bez labelov a autocomplete | **0** výskytov `<label>` aj `autoComplete` v `BookingSection.tsx`. |
| **P1** | Prettier zlyháva | Na **56** súboroch (review hlásil 44 — rozdiel sú súbory pridané po jeho vzniku). |
| **P1** | 71 advisories | Potvrdené: 8 low, 47 moderate, 16 high. |

**Najzávažnejší je P0 „server neoveruje dostupnosť."** Je to presne zásada
„never trust the client", ktorá je uplatnená na cenu, ale na dostupnosť sa
zabudla. V kombinácii s pretekmi pri načítaní sa dá odoslať dopyt na obsadený
termín aj bez zlého úmyslu.

---

## V čom s review nesúhlasím

### „16 high advisories" znie horšie, než to je

Overené, čo za tým stojí: `axios`, `lodash`, `lodash-es`, `path-to-regexp`,
`form-data`. Kontrola produkčného bundle: **ani jeden sa doň nedostane**
(0 výskytov v `dist/public/assets/*.js`). `path-to-regexp` ťahá `express`,
ktorý beží len ako lokálny statický server — v produkcii servíruje Netlify
priamo `dist/public`.

Sú to skutočné CVE a treba ich riešiť, ale nie sú v ceste, ktorou prechádza
návštevník. Nie je to release blocker.

### Turnstile je predčasný

Review chce Cloudflare Turnstile na endpoint dopytov. Pre jeden objekt s
jednotkami dopytov týždenne je to tretia strana, ďalší skript a trenie pre
hosťa. Honeypot a limity, ktoré tam sú, sú primerané. Vrátiť sa k tomu, až keď
sa reálny spam objaví v logoch.

### Expirácia cenových tvrdení je prekombinovaná

Riziko je reálne — tvrdenie „o 10 % lacnejšie" je viazané na ceny Bookingu
zachytené v jeden deň. Ale mechanizmus, ktorý tvrdenie po expirácii *vypne*,
ticho odstráni hlavný predajný argument stránky.

Jednoduchšie a čestnejšie: preformulovať nadpis na „bez provízie
sprostredkovateľa" a konkrétne čísla nechať len v tabuľke, kde sú zjavne
orientačné.

### Pri oprave pretekov pozor na smer zlyhania

Review chce, aby kalendár zostal nedostupný, kým nepríde dôveryhodný feed.
Správne pre stav načítavania — ale ak feed spadne úplne, **rezervácia sa nesmie
zablokovať natrvalo**, inak počas výpadku Bookingu prídeme o všetky dopyty.

Musí to byť „neisté → pusti ďalej s varovaním", nie „neisté → zamkni".
To isté platí pre serverovú kontrolu z P0: neoveriteľná dostupnosť nesmie
znamenať odmietnutý dopyt.

---

## Navrhované poradie, keď sa do toho pustíme

| # | Práca | Prečo prvé |
|---|---|---|
| ~~1~~ | ~~iCal URL preč z logov~~ | **hotové** — `aba3d0c`, redakcia v `lib/feeds` |
| ~~2~~ | ~~Server overí dostupnosť~~ | **hotové** — `e3c9c78`, fail-open |
| ~~3~~ | ~~`confirmationSent` v odpovedi~~ | **hotové** — `e3c9c78` |
| ~~4~~ | ~~Stav načítania kalendára~~ | **hotové** — `9150f3d` |
| ~~5~~ | ~~Labely a `autocomplete`~~ | **hotové** — `1049def`, plus honeypot, ktorý dovtedy nebol vo formulári |
| 6 | Prettier, skrytie telefónu keď nie je nastavený | upratovanie |

Body 1–3 sú malé a patria do jednej dávky.
