/*
 * CHALET BEYOND — Polish copy.
 *
 * Poland is two hours away and the largest inbound market for the Tatras,
 * bigger than Germany. Same policy: functional copy translated exactly,
 * atmospheric copy rewritten so it reads as Polish.
 *
 * Slovak place names are kept in their Polish forms where these are established
 * (Tatry Wysokie, Łomnicki Szczyt); the address stays as written on the door.
 */
import type { Dict } from "./sk";

export const pl: Dict = {
  nav: {
    chalet: "Chalet",
    priestory: "Wnętrza",
    okolie: "Okolica",
    cennik: "Cennik",
    rezervacia: "Rezerwacja",
    book: "Rezerwuj",
    bookStay: "Zarezerwuj pobyt",
    writeUs: "Napisz do nas",
    home: "Chalet Beyond — strona główna",
    menuOpen: "Otwórz menu",
    menuClose: "Zamknij menu",
  },

  hero: {
    tagline: "Tatry Wysokie · Black Stork Golf · Słowacja",
    coords: "49°08'N 20°20'E — VEĽKÁ LOMNICA",
    chapters: [
      { title: "POLE GOLFOWE BLACK STORK", subtitle: "uderzenie, od którego się zaczęło" },
      { title: "ZA KAŻDYM HORYZONTEM", subtitle: "27 dołków · jedyne pole PGA na Słowacji" },
      { title: "TWOJE PRYWATNE SCHRONIENIE", subtitle: "cztery pory roku · jeden adres" },
    ],
  },

  intro: {
    eyebrow: "Czym jest Chalet Beyond?",
    headlineA: "TO NIE HOTEL.",
    headlineB: "TO NIE AIRBNB.",
    body: "Prywatny górski azyl dla tych, którzy chcą mieć Tatry wyłącznie dla siebie. Kilka kroków od fairwaya Black Stork. Otwarty widok na Łomnicki Szczyt. Bez recepcji, bez części wspólnych – tylko dom i góry.",
    features: [
      {
        title: "GOLF",
        desc: "Resort golfowy Black Stork – jedyne pole golfowe PGA na Słowacji. 27 dołków z certyfikatem jakości PGA od 2011 roku. Dwie minuty od drzwi wejściowych.",
      },
      {
        title: "PRYWATNOŚĆ",
        desc: "Cała posesja należy wyłącznie do Ciebie. Przyjedź, zniknij, zresetuj się.",
      },
      {
        title: "WELLNESS",
        desc: "Prywatna sauna i zewnętrzne jacuzzi. Czynne cały rok, ogrzane i gotowe.",
      },
      {
        title: "TATRY",
        desc: "Łomnicki Szczyt na horyzoncie. Wyciągi dziesięć minut stąd. Stoki zaczynają się za furtką.",
      },
    ],
  },

  textReveal:
    "W sercu Tatr Wysokich, tam gdzie cisza gór spotyka się z bezkompromisowym projektem. Nie chodzi tu o nocleg. Chodzi o przeżycie. O ciche zimowe wieczory przy kominku, o gorące jacuzzi pod rozgwieżdżonym niebem. O poranną kawę z panoramą, która zapiera dech. O miejsce, w którym architektura i krajobraz mówią jednym językiem.",

  gallery: {
    eyebrow: "Architektura",
    headlineA: "ZBUDOWANY DLA",
    headlineB: "TEGO KRAJOBRAZU",
    body: "Ciemny dach z metalu. Pionowa okładzina drewniana. Przeszklenia od podłogi po sufit. Wybierz przestrzeń i obejrzyj galerię.",
    photos: "ZDJĘĆ",
    close: "Zamknij",
    prev: "Poprzednie",
    next: "Następne",
    albums: {
      interior: "Wnętrza",
      spalne: "Sypialnie",
      wellness: "Sauna i wellness",
      exterior: "Na zewnątrz",
      okolie: "Golf i Tatry",
    },
  },

  quote: {
    l1: "O ciche zimowe wieczory przy kominku,",
    l2: "o gorące jacuzzi pod rozgwieżdżonym niebem.",
    l3: "O poranną kawę z panoramą, która zapiera dech.",
    l4: "O miejsce, w którym architektura i krajobraz mówią jednym językiem.",
  },

  amenities: {
    eyebrow: "Wyposażenie",
    headlineA: "WSZYSTKO,",
    headlineB: "CZEGO POTRZEBUJESZ",
    specsTitle: "Parametry",
    items: {
      wifi: "Bezpłatne WiFi",
      parking: "Prywatny parking",
      transfer: "Transfer z lotniska",
      sauna: "Sauna fińska",
      hotTub: "Jacuzzi / Hot tub",
      fireplace: "Kominek",
      kitchen: "W pełni wyposażona kuchnia",
      coffee: "Ekspres do kawy",
      tv: "Projektor, TV i Netflix",
      laundry: "Pralka i suszarka",
      bathrooms: "3 łazienki, szlafroki",
      skiStorage: "Narciarnia",
      bbq: "Grill zewnętrzny (BBQ)",
      mountainView: "Widok na góry",
      garden: "Ogród i taras",
      highChair: "Krzesełko dla dziecka",
    },
    specs: {
      area: "Powierzchnia",
      bedrooms: "Sypialnie",
      bathrooms: "Łazienki",
      maxGuests: "Maks. gości",
      checkIn: "Zameldowanie",
      checkOut: "Wymeldowanie",
    },
  },

  location: {
    eyebrow: "Lokalizacja",
    headlineA: "SERCE",
    headlineB: "TATR",
    body: "Chalet Beyond leży bezpośrednio przy polu Black Stork — jedynym na Słowacji z prestiżowym certyfikatem PGA. Miejsce, w którym golf światowego poziomu spotyka się z niepowtarzalną scenerią Tatr.",
    imageAlt: "Widok na Łomnicki Szczyt",
    places: [
      {
        name: "Golf Black Stork PGA",
        distance: "przy samym polu",
        desc: "Jedyne pole golfowe na Słowacji z certyfikatem PGA.",
      },
      {
        name: "Tatranská Lomnica",
        distance: "10 min autem",
        desc: "Skalnaté pleso, Lomnické sedlo — raj dla sportów zimowych.",
      },
      {
        name: "Trasy rowerowe i piesze",
        distance: "prosto z domu",
        desc: "Sieć zapierających dech tras rowerowych i szlaków w sercu Tatr.",
      },
      {
        name: "AquaCity Poprad",
        distance: "10 min autem",
        desc: "Baseny termalne — idealne dla rodzin z dziećmi.",
      },
      {
        name: "Lotnisko Poprad-Tatry",
        distance: "15 min autem",
        desc: "Bezpośrednie loty z Wiednia, Pragi, Warszawy i innych miast.",
      },
    ],
  },

  pricing: {
    eyebrow: "Cennik",
    headlineA: "10 % TANIEJ",
    headlineB: "NIŻ NA BOOKINGU",
    body: "Rezerwując bezpośrednio u nas, nie płacisz prowizji pośrednika. Ceny dotyczą całego obiektu i zawierają podatki oraz opłaty.",
    colGuests: "Gości",
    colBooking: "Booking.com",
    colDirect: "Bezpośrednio",
    colSaving: "Oszczędzasz",
    guestsFew: "gości",
    guestsMany: "gości",
    onBooking: "na Booking.com",
    youSave: "oszczędzasz",
    finePrint:
      "Ceny za noc przy wynajmie całego obiektu. Minimalny pobyt 2 noce · Bezpłatne odwołanie do 14 dni przed przyjazdem.",
  },

  booking: {
    eyebrow: "Rezerwacja",
    headlineA: "PRZEKRACZA TWOJE",
    headlineB: "OCZEKIWANIA",
    intro: "Tylko rezerwacja bezpośrednia – bez opłat platformy, bez pośredników.",
    pickDates: "Wybierz terminy",
    availabilityLoading: "Wczytuję zajęte terminy…",
    availabilityFailed: "Nie udało się wczytać dostępności — potwierdzimy ją e-mailem.",
    checkIn: "Zameldowanie",
    checkOut: "Wymeldowanie",
    propertyName: "Chalet Beyond",
    propertyPlace: "Veľká Lomnica, Tatry Wysokie",
    ratingLabel: "Ocena na Booking.com",
    onBooking: "Na Booking.com",
    youSave: "Oszczędzasz",
    guests: "Goście",
    maxGuests: "Maks. 8 gości",
    nameField: "Imię i nazwisko",
    emailField: "E-mail",
    phoneField: "Telefon",
    messageField: "Uwagi (opcjonalnie)",
    submit: "Wyślij niezobowiązujące zapytanie",
    sending: "Wysyłanie…",
    sentTitle: "Zapytanie wysłane",
    sentBody: "Odezwiemy się w ciągu 24 godzin. Potwierdzenie wysłaliśmy na",
    sentBodyNoEmail: "Odezwiemy się w ciągu 24 godzin.",
    needTwoNights: "Wybierz termin na co najmniej 2 noce",
    sendFailed: "Wysyłanie nie powiodło się",
    datesTaken: "Ten termin został właśnie zajęty. Prosimy wybrać inny.",
    guestsDecrease: "Mniej gości",
    guestsIncrease: "Więcej gości",
    callUs: "Zadzwoń do nas pod",
    orWrite: "lub napisz na",
    finePrint:
      "Minimalny pobyt 2 noce · Cały obiekt · Bezpłatne odwołanie do 14 dni przed przyjazdem",
    nights1: "noc",
    nightsFew: "noce",
    nightsMany: "nocy",
  },

  rules: {
    title: "Regulamin",
    checkIn: "Zameldowanie",
    checkOut: "Wymeldowanie",
    smoking: "Palenie",
    smokingValue: "Zabronione",
    pets: "Zwierzęta",
    petsValue: "Niedozwolone",
    quiet: "Cisza nocna",
    children: "Dzieci",
    childrenValue: "Mile widziane, od 16 lat jak dorośli",
    cribs: "Łóżeczka",
    cribsValue: "Niedostępne",
    capacity: "Pojemność",
    capacityValue: "Maks. 8 osób",
  },

  footer: {
    tagline: "Beyond your expectations. W sercu Tatr Wysokich.",
    addressLabel: "Adres",
    addressStreet: "Kamenná 2004/25A",
    addressCity: "059 52 Veľká Lomnica",
    addressCountry: "Słowacja",
    bookingLabel: "Rezerwacja",
    directOnly: "Tylko rezerwacja bezpośrednia – bez pośredników.",
    airport: "Lotnisko Poprad-Tatry",
    airportDistance: "15 min autem",
    strip: "Chalet Beyond · Tatry Wysokie, Słowacja",
    copyright: "© 2025 Chalet Beyond. Wszelkie prawa zastrzeżone.",
  },

  contact: {
    call: "Zadzwoń",
    whatsapp: "WhatsApp",
    callAria: "Zadzwoń pod",
    whatsappAria: "Napisz przez WhatsApp",
  },
};
