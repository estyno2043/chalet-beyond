/*
 * CHALET BEYOND — German copy.
 *
 * The primary market: the owner reports most guests are German-speaking.
 *
 * Functional copy (prices, amenities, rules, form) is translated exactly —
 * a discrepancy between languages here is a complaint on arrival. Atmospheric
 * copy is rewritten rather than translated: word-for-word German of poetic
 * Slovak reads as machine output, which is the wrong impression at 675 EUR a
 * night. Formal "Sie" throughout, as a German premium guest expects.
 *
 * Should be read by a native speaker before launch.
 */
import type { Dict } from "./sk";

export const de: Dict = {
  nav: {
    chalet: "Chalet",
    priestory: "Räume",
    okolie: "Umgebung",
    cennik: "Preise",
    rezervacia: "Buchung",
    book: "Buchen",
    bookStay: "Aufenthalt buchen",
    writeUs: "Schreiben Sie uns",
    home: "Chalet Beyond — Startseite",
    menuOpen: "Menü öffnen",
    menuClose: "Menü schließen",
  },

  hero: {
    tagline: "Hohe Tatra · Black Stork Golf · Slowakei",
    coords: "49°08'N 20°20'E — VEĽKÁ LOMNICA",
    chapters: [
      { title: "GOLFPLATZ BLACK STORK", subtitle: "der Schlag, mit dem alles begann" },
      { title: "HINTER JEDEM HORIZONT", subtitle: "27 Löcher · der einzige PGA-Platz der Slowakei" },
      { title: "IHR PRIVATER RÜCKZUGSORT", subtitle: "vier Jahreszeiten · eine Adresse" },
    ],
  },

  intro: {
    eyebrow: "Was ist Chalet Beyond?",
    headlineA: "KEIN HOTEL.",
    headlineB: "KEIN AIRBNB.",
    body: "Ein privates Bergrefugium für alle, die die Tatra für sich allein haben möchten. Wenige Schritte vom Fairway des Black Stork entfernt. Freier Blick auf die Lomnitzer Spitze. Keine Rezeption, keine geteilten Bereiche – nur das Chalet und die Berge.",
    features: [
      {
        title: "GOLF",
        desc: "Golfresort Black Stork – der einzige PGA-Golfplatz der Slowakei. 27 Löcher, seit 2011 nach PGA-Qualitätsstandards zertifiziert. Zwei Minuten von Ihrer Haustür.",
      },
      {
        title: "PRIVATSPHÄRE",
        desc: "Das gesamte Grundstück gehört Ihnen allein. Ankommen, abtauchen, auftanken.",
      },
      {
        title: "WELLNESS",
        desc: "Private Sauna und Außen-Whirlpool. Ganzjährig geöffnet, beheizt und bereit.",
      },
      {
        title: "TATRA",
        desc: "Die Lomnitzer Spitze am Horizont. Skilifte zehn Minuten entfernt. Die Pisten beginnen hinter dem Gartentor.",
      },
    ],
  },

  textReveal:
    "Im Herzen der Hohen Tatra, wo die Stille der Berge auf klare Architektur trifft. Hier geht es nicht ums Übernachten. Es geht um das Erlebnis. Um stille Winterabende am Kamin, um den heißen Whirlpool unter dem Sternenhimmel. Um den ersten Kaffee vor einem Panorama, das den Atem anhält. Um einen Ort, an dem Bauwerk und Landschaft dieselbe Sprache sprechen.",

  gallery: {
    eyebrow: "Architektur",
    headlineA: "GEBAUT FÜR",
    headlineB: "DIESE LANDSCHAFT",
    body: "Dunkles Metalldach. Vertikale Holzverschalung. Verglasung vom Boden bis zur Decke. Wählen Sie einen Bereich und sehen Sie sich die Galerie an.",
    photos: "FOTOS",
    close: "Schließen",
    prev: "Zurück",
    next: "Weiter",
    albums: {
      interior: "Innenräume",
      spalne: "Schlafzimmer",
      wellness: "Sauna & Wellness",
      exterior: "Außenbereich",
      okolie: "Golf & Tatra",
    },
  },

  quote: {
    l1: "Um stille Winterabende am Kamin,",
    l2: "um den heißen Whirlpool unter den Sternen.",
    l3: "Um den ersten Kaffee vor einem Panorama, das den Atem anhält.",
    l4: "Um einen Ort, an dem Bauwerk und Landschaft dieselbe Sprache sprechen.",
  },

  amenities: {
    eyebrow: "Ausstattung",
    headlineA: "ALLES, WAS",
    headlineB: "SIE BRAUCHEN",
    specsTitle: "Eckdaten",
    items: {
      wifi: "Kostenloses WLAN",
      parking: "Privater Parkplatz",
      transfer: "Flughafentransfer",
      sauna: "Finnische Sauna",
      hotTub: "Whirlpool / Hot Tub",
      fireplace: "Kamin",
      kitchen: "Voll ausgestattete Küche",
      coffee: "Kaffeemaschine",
      tv: "Beamer, TV & Netflix",
      laundry: "Waschmaschine & Trockner",
      bathrooms: "3 Bäder, Bademäntel",
      skiStorage: "Skiraum",
      bbq: "Außengrill (BBQ)",
      mountainView: "Bergblick",
      garden: "Garten & Terrasse",
      highChair: "Kinderhochstuhl",
    },
    specs: {
      area: "Wohnfläche",
      bedrooms: "Schlafzimmer",
      bathrooms: "Bäder",
      maxGuests: "Max. Gäste",
      checkIn: "Check-in",
      checkOut: "Check-out",
    },
  },

  location: {
    eyebrow: "Lage",
    headlineA: "HERZ",
    headlineB: "DER TATRA",
    body: "Chalet Beyond liegt direkt am Golfplatz Black Stork — dem einzigen Platz der Slowakei mit PGA-Zertifikat. Ein Ort, an dem Golf auf Weltniveau und die unverwechselbare Kulisse der Tatra aufeinandertreffen.",
    imageAlt: "Blick auf die Lomnitzer Spitze",
    places: [
      {
        name: "Golf Black Stork PGA",
        distance: "direkt am Platz",
        desc: "Der einzige Golfplatz der Slowakei mit PGA-Zertifikat.",
      },
      {
        name: "Tatranská Lomnica",
        distance: "10 Min. mit dem Auto",
        desc: "Skalnaté pleso, Lomnické sedlo — ein Paradies für den Wintersport.",
      },
      {
        name: "Radwege & Wandern",
        distance: "direkt vom Chalet",
        desc: "Ein Netz atemberaubender Rad- und Wanderwege im Herzen der Tatra.",
      },
      {
        name: "AquaCity Poprad",
        distance: "10 Min. mit dem Auto",
        desc: "Thermalbad — ideal für Familien mit Kindern.",
      },
      {
        name: "Flughafen Poprad-Tatry",
        distance: "15 Min. mit dem Auto",
        desc: "Direktflüge aus Wien, Prag, Warschau und weiteren Städten.",
      },
    ],
  },

  pricing: {
    eyebrow: "Preise",
    headlineA: "10 % GÜNSTIGER",
    headlineB: "ALS AUF BOOKING",
    body: "Wenn Sie direkt bei uns buchen, zahlen Sie keine Vermittlungsprovision. Die Preise gelten für das gesamte Objekt inklusive Steuern und Gebühren.",
    colGuests: "Gäste",
    colBooking: "Booking.com",
    colDirect: "Direkt bei uns",
    colSaving: "Sie sparen",
    guestsFew: "Gäste",
    guestsMany: "Gäste",
    onBooking: "auf Booking.com",
    youSave: "Sie sparen",
    finePrint:
      "Preise pro Nacht bei Anmietung des gesamten Objekts. Mindestaufenthalt 2 Nächte · Kostenfreie Stornierung bis 14 Tage vor Anreise.",
  },

  booking: {
    eyebrow: "Buchung",
    headlineA: "ÜBERTRIFFT IHRE",
    headlineB: "ERWARTUNGEN",
    intro: "Nur Direktbuchung – keine Plattformgebühren, keine Vermittler.",
    pickDates: "Zeitraum wählen",
    availabilityLoading: "Belegte Termine werden geladen …",
    availabilityFailed: "Die Belegung konnte nicht geladen werden — wir bestätigen die Verfügbarkeit per E-Mail.",
    checkIn: "Check-in",
    checkOut: "Check-out",
    propertyName: "Chalet Beyond",
    propertyPlace: "Veľká Lomnica, Hohe Tatra",
    ratingLabel: "Bewertung auf Booking.com",
    onBooking: "Auf Booking.com",
    youSave: "Sie sparen",
    guests: "Gäste",
    maxGuests: "Max. 8 Gäste",
    nameField: "Vor- und Nachname",
    emailField: "E-Mail",
    phoneField: "Telefon",
    messageField: "Anmerkung (optional)",
    submit: "Unverbindlich anfragen",
    sending: "Wird gesendet…",
    sentTitle: "Anfrage gesendet",
    sentBody: "Wir melden uns innerhalb von 24 Stunden. Eine Bestätigung ging an",
    sentBodyNoEmail: "Wir melden uns innerhalb von 24 Stunden.",
    needTwoNights: "Wählen Sie einen Zeitraum von mindestens 2 Nächten",
    sendFailed: "Senden fehlgeschlagen",
    datesTaken: "Dieser Zeitraum ist inzwischen belegt. Bitte wählen Sie einen anderen.",
    callUs: "Rufen Sie uns an unter",
    orWrite: "oder schreiben Sie an",
    finePrint:
      "Mindestaufenthalt 2 Nächte · Gesamtes Objekt · Kostenfreie Stornierung bis 14 Tage vor Anreise",
    nights1: "Nacht",
    nightsFew: "Nächte",
    nightsMany: "Nächte",
  },

  rules: {
    title: "Hausordnung",
    checkIn: "Check-in",
    checkOut: "Check-out",
    smoking: "Rauchen",
    smokingValue: "Nicht gestattet",
    pets: "Haustiere",
    petsValue: "Nicht gestattet",
    quiet: "Ruhezeit",
    children: "Kinder",
    childrenValue: "Willkommen, ab 16 J. als Erwachsene",
    cribs: "Kinderbetten",
    cribsValue: "Nicht verfügbar",
    capacity: "Kapazität",
    capacityValue: "Max. 8 Personen",
  },

  footer: {
    tagline: "Beyond your expectations. Im Herzen der Hohen Tatra.",
    addressLabel: "Adresse",
    addressStreet: "Kamenná 2004/25A",
    addressCity: "059 52 Veľká Lomnica",
    addressCountry: "Slowakei",
    bookingLabel: "Buchung",
    directOnly: "Nur Direktbuchung – ohne Vermittler.",
    airport: "Flughafen Poprad-Tatry",
    airportDistance: "15 Min. mit dem Auto",
    strip: "Chalet Beyond · Hohe Tatra, Slowakei",
    copyright: "© 2025 Chalet Beyond. Alle Rechte vorbehalten.",
  },

  contact: {
    call: "Anrufen",
    whatsapp: "WhatsApp",
    callAria: "Anrufen unter",
    whatsappAria: "Über WhatsApp schreiben",
  },
};
