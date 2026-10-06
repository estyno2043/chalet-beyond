# Google Mapy — ako dostať chaletbeyond.sk namiesto Bookingu

Stav k 6. 10. 2026: na Mapách je „Chalet Beyond" ako **rekreačný prenájom (Vila)**.
Google ho nevytvoril z profilu firmy, ale z **feedu Booking.com**: web = booking.com,
jediná možnosť rezervácie = Booking.com, fotky z Bookingu, telefón chýba a vybavenie
je čiastočne zlé (Fitcentrum, Bezbariérový prístup, Zvieratá vítané).

Na webe je už nasadené: štruktúrované dáta (LodgingBusiness) s oficiálnou stránkou,
telefónom, e-mailom, adresou a súradnicami miesta na Mapách. To Googlu pomáha spojiť
miesto s naším webom, ale samo o sebe Booking zo záznamu nevymení.

## 1. Hneď (zadarmo, robí majiteľ — 10 minút)

1. Prihlásiť sa do Google účtu majiteľa, otvoriť Chalet Beyond na Mapách.
2. **Navrhnúť úpravu** → web `https://chaletbeyond.sk`, telefón `+421 905 111 061`,
   opraviť vybavenie (odstrániť fitcentrum a čo nesedí).
   Google návrh posúdi sám; pri prenájmoch z Bookingu ho nemusí prijať.
3. **Pridať fotky** → vlastné fotky chaty (z `assets/photos/lomnica`). Pribudnú medzi
   fotky; tie z Bookingu tam zostanú, kým je inzerát na Bookingu aktívny.
4. **Booking extranet** → opraviť vybavenie a údaje tam. Google ich preberá odtiaľ.

## 2. Náš web ako možnosť rezervácie na Mapách (plné riešenie)

Majiteľ sám záznam na Mapách prevziať nemôže: Google Vacation Rentals prijíma ponuky
len cez **schválených partnerov** (channel manager / rezervačný systém), napr.
Hostaway, Hospitable, OwnerRez, Rentals United. Postup:

1. Vybrať partnera (mesačný poplatok), napojiť ho na Booking (obsadenosť, ceny).
2. U partnera zapnúť Google Vacation Rentals.
3. Na Mapách sa pri chate objaví naša ponuka ako ďalšia možnosť rezervácie
   s odkazom na chaletbeyond.sk (alebo na rezervačnú stránku partnera).

Booking zo záznamu zmizne úplne len vtedy, ak sa inzerát na Bookingu zruší.

## 3. Čo nerobiť

**Profil firmy Google (Google Business Profile)** pre samotnú chatu nezakladať:
podľa pravidiel Googlu sú rekreačné domy („vacation homes") neoprávnené, profil
môže byť zrušený a môže to poškodiť aj súčasný záznam.
