/*
 * CHALET BEYOND — Slovak copy. Source of truth for the key shape.
 *
 * Every other language implements `Dict`, so a missing key fails `pnpm check`
 * rather than showing a blank on the live page.
 *
 * Keys are grouped by the section that renders them. Proper nouns that stay the
 * same in every language (Chalet Beyond, Black Stork, Lomnický štít, the
 * address) are still listed here — a translator may need to inflect them.
 */
export const sk = {
  nav: {
    chalet: "Chalet",
    priestory: "Priestory",
    okolie: "Okolie",
    cennik: "Cenník",
    rezervacia: "Rezervácia",
    book: "Rezervovať",
    bookStay: "Rezervovať pobyt",
    writeUs: "Napíšte nám",
    home: "Chalet Beyond — domov",
    menuOpen: "Otvoriť menu",
    menuClose: "Zavrieť menu",
  },

  hero: {
    tagline: "Vysoké Tatry · Black Stork Golf · Slovakia",
    coords: "49°08'N 20°20'E — VEĽKÁ LOMNICA",
    chapters: [
      { title: "GOLFOVÉ IHRISKO BLACK STORK", subtitle: "úder, ktorý všetko začal" },
      { title: "ZA KAŽDÝM HORIZONTOM", subtitle: "27 jamiek · jediné PGA ihrisko na Slovensku" },
      { title: "VAŠE SÚKROMNÉ ÚTOČISKO", subtitle: "štyri ročné obdobia · jedna adresa" },
    ],
  },

  intro: {
    eyebrow: "Čo je Chalet Beyond?",
    headlineA: "NIE JE TO HOTEL.",
    headlineB: "NIE JE TO AIRBNB.",
    body: "Súkromný horský rezort určený pre tých, ktorí chcú mať Tatry úplne pre seba. Pár krokov od ihriska Black Stork fairway. Priamy výhľad na Lomnický štít. Žiadna recepcia, žiadne spoločné priestory – len chata a hory.",
    features: [
      {
        title: "GOLF",
        desc: "Golfový rezort Black Stork – jediné golfové ihrisko PGA na Slovensku. 27 jamiek certifikovaných podľa štandardov kvality PGA od roku 2011. Dve minúty od vchodových dverí.",
      },
      {
        title: "SÚKROMIE",
        desc: "Celý pozemok je výhradne váš. Príďte, zmiznite, resetujte sa.",
      },
      {
        title: "WELLNESS",
        desc: "Súkromná sauna a vonkajšia vírivka. Otvorené celoročne, vyhrievané a pripravené.",
      },
      {
        title: "TATRY",
        desc: "Lomnický štít na obzore. Lyžiarske vleky 10 minút odtiaľto. Zjazdovky od záhradnej bránky.",
      },
    ],
  },

  textReveal:
    "V srdci Vysokých Tatier, tam kde sa pokoj prírody stretáva s výnimočným dizajnom. Tu nejde len o bývanie. Ide o zážitok. O ticho zimných večerov pri kozube, v horúcej vírivke pod hviezdami. O rannú kávu s panorámou, ktorá berie dych. O priestor, kde architektúra a príroda hovoria jedným jazykom.",

  gallery: {
    eyebrow: "Architektúra",
    headlineA: "POSTAVENÉ PRE",
    headlineB: "TÚTO KRAJINU",
    body: "Tmavá kovová strecha. Vertikálny drevený obklad. Zasklenie od podlahy až po strop. Vyberte si priestor a prezrite si galériu.",
    photos: "FOTIEK",
    close: "Zavrieť",
    prev: "Predchádzajúca",
    next: "Ďalšia",
    albums: {
      interior: "Interiér",
      spalne: "Spálne",
      wellness: "Sauna & wellness",
      exterior: "Exteriér",
      okolie: "Golf & Tatry",
    },
  },

  quote: {
    l1: "O ticho zimných večerov pri kozube,",
    l2: "v horúcej vírivke pod hviezdami.",
    l3: "O rannú kávu s panorámou, ktorá berie dych.",
    l4: "O priestor, kde architektúra a príroda hovoria jedným jazykom.",
  },

  amenities: {
    eyebrow: "Vybavenie",
    headlineA: "VŠETKO, ČO",
    headlineB: "POTREBUJETE",
    specsTitle: "Parametre",
    items: {
      wifi: "Bezplatné WiFi",
      parking: "Súkromné parkovanie",
      transfer: "Letiskový transfer",
      sauna: "Fínska sauna",
      hotTub: "Vírivka / Hot tub",
      fireplace: "Kozub",
      kitchen: "Plne vybavená kuchyňa",
      coffee: "Kávovar",
      tv: "Projektor, TV & Netflix",
      laundry: "Práčka & sušička",
      bathrooms: "3 kúpeľne, župany",
      skiStorage: "Lyžiareň",
      bbq: "Vonkajší gril (BBQ)",
      mountainView: "Výhľad na hory",
      garden: "Záhrada & terasa",
      highChair: "Detská stolička",
    },
    specs: {
      area: "Rozloha",
      bedrooms: "Spálne",
      bathrooms: "Kúpeľne",
      maxGuests: "Max. hostí",
      checkIn: "Check-in",
      checkOut: "Check-out",
    },
  },

  location: {
    eyebrow: "Poloha",
    headlineA: "SRDCE",
    headlineB: "TATIER",
    body: "Chalet Beyond sa nachádza priamo na ihrisku Black Stork — jedinom golfovom ihrisku na Slovensku s prestížnym certifikátom PGA. Miesto, kde sa stretáva svetová úroveň golfu s neopakovateľnou scenériou Tatier.",
    imageAlt: "Výhľad na Lomnický štít",
    places: [
      {
        name: "Golf Black Stork PGA",
        distance: "priamo na ihrisku",
        desc: "Jediné golfové ihrisko na Slovensku s certifikátom PGA.",
      },
      {
        name: "Tatranská Lomnica",
        distance: "10 min autom",
        desc: "Skalnaté pleso, Lomnické sedlo — raj pre zimné športy.",
      },
      {
        name: "Cyklotrasy & turistika",
        distance: "priamo z chaletu",
        desc: "Sieť dychberúcich cyklotrás a turistických chodníkov v srdci Tatier.",
      },
      {
        name: "AquaCity Poprad",
        distance: "10 min autom",
        desc: "Termálne kúpalisko — ideálne pre rodiny s deťmi.",
      },
      {
        name: "Poprad-Tatry Airport",
        distance: "15 min autom",
        desc: "Priame lety z Viedne, Prahy, Varšavy a ďalších miest.",
      },
    ],
  },

  pricing: {
    eyebrow: "Cenník",
    headlineA: "O 10 % LACNEJŠIE",
    headlineB: "AKO NA BOOKINGU",
    body: "Rezerváciou priamo u nás neplatíte províziu sprostredkovateľa. Ceny sú za celý objekt vrátane daní a poplatkov.",
    colGuests: "Hostí",
    colBooking: "Booking.com",
    colDirect: "Priamo u nás",
    colSaving: "Ušetríte",
    guestsFew: "hostia",
    guestsMany: "hostí",
    onBooking: "na Booking.com",
    youSave: "ušetríte",
    finePrint:
      "Ceny za noc pri prenájme celého objektu. Minimálna dĺžka pobytu 2 noci · Bezplatné storno do 14 dní pred príchodom.",
  },

  booking: {
    eyebrow: "Rezervácia",
    headlineA: "PREKONÁVA VAŠE",
    headlineB: "OČAKÁVANIA",
    intro: "Iba priama rezervácia – žiadne poplatky za platformu, žiadni sprostredkovatelia.",
    pickDates: "Vyberte dátumy",
    availabilityFailed: "Obsadenosť sa nepodarilo načítať — dostupnosť overíme e-mailom.",
    checkIn: "Check-in",
    checkOut: "Check-out",
    propertyName: "Chalet Beyond",
    propertyPlace: "Veľká Lomnica, Vysoké Tatry",
    ratingLabel: "Hodnotenie na Booking.com",
    onBooking: "Na Booking.com",
    youSave: "Ušetríte",
    guests: "Hostia",
    maxGuests: "Max. 8 hostí",
    nameField: "Meno a priezvisko",
    emailField: "E-mail",
    phoneField: "Telefón",
    messageField: "Poznámka (nepovinné)",
    submit: "Odoslať nezáväzný dopyt",
    sending: "Odosielam…",
    sentTitle: "Dopyt odoslaný",
    sentBody: "Ozveme sa do 24 hodín. Potvrdenie sme poslali na",
    needTwoNights: "Vyberte termín aspoň na 2 noci",
    sendFailed: "Odoslanie zlyhalo",
    callUs: "Zavolajte nám na",
    orWrite: "alebo napíšte na",
    finePrint:
      "Minimálna dĺžka pobytu 2 noci · Celý objekt · Bezplatné storno do 14 dní pred príchodom",
    nights1: "noc",
    nightsFew: "noci",
    nightsMany: "nocí",
  },

  rules: {
    title: "Pravidlá domu",
    checkIn: "Check-in",
    checkOut: "Check-out",
    smoking: "Fajčenie",
    smokingValue: "Zakázané",
    pets: "Domáce zvieratá",
    petsValue: "Nie sú povolené",
    quiet: "Ticho",
    children: "Deti",
    childrenValue: "Vítané, od 16 r. ako dospelí",
    cribs: "Postieľky",
    cribsValue: "Nie sú k dispozícii",
    capacity: "Kapacita",
    capacityValue: "Max. 8 osôb",
  },

  footer: {
    tagline: "Beyond your expectations. V srdci Vysokých Tatier.",
    addressLabel: "Adresa",
    addressStreet: "Kamenná 2004/25A",
    addressCity: "059 52 Veľká Lomnica",
    addressCountry: "Slovensko",
    bookingLabel: "Rezervácia",
    directOnly: "Iba priama rezervácia – bez sprostredkovateľov.",
    airport: "Letisko Poprad-Tatry",
    airportDistance: "15 min autom",
    strip: "Chalet Beyond · Vysoké Tatry, Slovensko",
    copyright: "© 2025 Chalet Beyond. Všetky práva vyhradené.",
  },

  contact: {
    call: "Zavolať",
    whatsapp: "WhatsApp",
    callAria: "Zavolať na",
    whatsappAria: "Napísať cez WhatsApp",
  },
};

/**
 * The shape every language must satisfy. Deliberately no `as const`: a literal
 * type would demand the exact Slovak strings from every translation.
 */
export type Dict = typeof sk;
