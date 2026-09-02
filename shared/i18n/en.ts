/*
 * CHALET BEYOND — English copy.
 *
 * The fallback for everyone the other three languages do not cover. Same policy
 * as German: functional copy translated exactly, atmospheric copy rewritten so
 * it reads as English rather than as translated Slovak.
 */
import type { Dict } from "./sk";

export const en: Dict = {
  nav: {
    chalet: "Chalet",
    priestory: "Spaces",
    okolie: "Area",
    cennik: "Rates",
    rezervacia: "Booking",
    book: "Book now",
    bookStay: "Book your stay",
    writeUs: "Write to us",
    home: "Chalet Beyond — home",
    menuOpen: "Open menu",
    menuClose: "Close menu",
  },

  hero: {
    tagline: "High Tatras · Black Stork Golf · Slovakia",
    coords: "49°08'N 20°20'E — VEĽKÁ LOMNICA",
    chapters: [
      { title: "BLACK STORK GOLF COURSE", subtitle: "the shot that started it all" },
      { title: "BEYOND EVERY HORIZON", subtitle: "27 holes · the only PGA course in Slovakia" },
      { title: "YOUR PRIVATE RETREAT", subtitle: "four seasons · one address" },
    ],
  },

  intro: {
    eyebrow: "What is Chalet Beyond?",
    headlineA: "NOT A HOTEL.",
    headlineB: "NOT AN AIRBNB.",
    body: "A private mountain retreat for those who want the Tatras to themselves. A few steps from the Black Stork fairway. An open view of Lomnický štít. No reception, no shared spaces – just the chalet and the mountains.",
    features: [
      {
        title: "GOLF",
        desc: "Black Stork golf resort – the only PGA golf course in Slovakia. 27 holes, certified to PGA quality standards since 2011. Two minutes from your front door.",
      },
      {
        title: "PRIVACY",
        desc: "The whole property is yours alone. Arrive, disappear, reset.",
      },
      {
        title: "WELLNESS",
        desc: "Private sauna and outdoor hot tub. Open year-round, heated and ready.",
      },
      {
        title: "TATRAS",
        desc: "Lomnický štít on the horizon. Ski lifts ten minutes away. The slopes start at the garden gate.",
      },
    ],
  },

  textReveal:
    "In the heart of the High Tatras, where the quiet of the mountains meets uncompromising design. This is not about a place to sleep. It is about the experience. About still winter evenings by the fire, about the hot tub under a sky full of stars. About the first coffee of the day in front of a view that stops you. About a place where the building and the landscape speak the same language.",

  gallery: {
    eyebrow: "Architecture",
    headlineA: "BUILT FOR",
    headlineB: "THIS LANDSCAPE",
    body: "Dark metal roof. Vertical timber cladding. Floor-to-ceiling glazing. Choose a space and browse the gallery.",
    photos: "PHOTOS",
    close: "Close",
    prev: "Previous",
    next: "Next",
    albums: {
      interior: "Interior",
      spalne: "Bedrooms",
      wellness: "Sauna & wellness",
      exterior: "Exterior",
      okolie: "Golf & Tatras",
    },
  },

  quote: {
    l1: "About still winter evenings by the fire,",
    l2: "about the hot tub under a sky full of stars.",
    l3: "About the first coffee of the day in front of a view that stops you.",
    l4: "About a place where the building and the landscape speak the same language.",
  },

  amenities: {
    eyebrow: "Amenities",
    headlineA: "EVERYTHING",
    headlineB: "YOU NEED",
    specsTitle: "Key facts",
    items: {
      wifi: "Free WiFi",
      parking: "Private parking",
      transfer: "Airport transfer",
      sauna: "Finnish sauna",
      hotTub: "Hot tub",
      fireplace: "Fireplace",
      kitchen: "Fully equipped kitchen",
      coffee: "Coffee machine",
      tv: "Projector, TV & Netflix",
      laundry: "Washer & dryer",
      bathrooms: "3 bathrooms, bathrobes",
      skiStorage: "Ski storage",
      bbq: "Outdoor grill (BBQ)",
      mountainView: "Mountain view",
      garden: "Garden & terrace",
      highChair: "High chair",
    },
    specs: {
      area: "Floor area",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      maxGuests: "Max. guests",
      checkIn: "Check-in",
      checkOut: "Check-out",
    },
  },

  location: {
    eyebrow: "Location",
    headlineA: "HEART OF",
    headlineB: "THE TATRAS",
    body: "Chalet Beyond sits directly on the Black Stork course — the only course in Slovakia with PGA certification. A place where world-class golf meets the unmistakable scenery of the Tatras.",
    imageAlt: "View of Lomnický štít",
    places: [
      {
        name: "Golf Black Stork PGA",
        distance: "on the course",
        desc: "The only golf course in Slovakia with PGA certification.",
      },
      {
        name: "Tatranská Lomnica",
        distance: "10 min by car",
        desc: "Skalnaté pleso, Lomnické sedlo — a winter sports paradise.",
      },
      {
        name: "Cycling & hiking",
        distance: "from the chalet",
        desc: "A network of breathtaking cycling and hiking trails in the heart of the Tatras.",
      },
      {
        name: "AquaCity Poprad",
        distance: "10 min by car",
        desc: "Thermal water park — ideal for families with children.",
      },
      {
        name: "Poprad-Tatry Airport",
        distance: "15 min by car",
        desc: "Direct flights from Vienna, Prague, Warsaw and other cities.",
      },
    ],
  },

  pricing: {
    eyebrow: "Rates",
    headlineA: "10 % CHEAPER",
    headlineB: "THAN ON BOOKING",
    body: "Book directly with us and you pay no intermediary commission. Rates are for the whole property, taxes and fees included.",
    colGuests: "Guests",
    colBooking: "Booking.com",
    colDirect: "Direct with us",
    colSaving: "You save",
    guestsFew: "guests",
    guestsMany: "guests",
    onBooking: "on Booking.com",
    youSave: "you save",
    finePrint:
      "Rates per night for the whole property. Minimum stay 2 nights · Free cancellation up to 14 days before arrival.",
  },

  booking: {
    eyebrow: "Booking",
    headlineA: "BEYOND YOUR",
    headlineB: "EXPECTATIONS",
    intro: "Direct booking only – no platform fees, no intermediaries.",
    pickDates: "Choose your dates",
    availabilityLoading: "Loading availability…",
    availabilityFailed: "Availability could not be loaded — we will confirm it by email.",
    checkIn: "Check-in",
    checkOut: "Check-out",
    propertyName: "Chalet Beyond",
    propertyPlace: "Veľká Lomnica, High Tatras",
    ratingLabel: "Rating on Booking.com",
    onBooking: "On Booking.com",
    youSave: "You save",
    guests: "Guests",
    maxGuests: "Max. 8 guests",
    nameField: "Full name",
    emailField: "Email",
    phoneField: "Phone",
    messageField: "Note (optional)",
    submit: "Send a no-obligation enquiry",
    sending: "Sending…",
    sentTitle: "Enquiry sent",
    sentBody: "We will reply within 24 hours. A confirmation went to",
    sentBodyNoEmail: "We will reply within 24 hours.",
    needTwoNights: "Choose a stay of at least 2 nights",
    sendFailed: "Sending failed",
    datesTaken: "These dates have just been taken. Please choose another stay.",
    callUs: "Call us on",
    orWrite: "or write to",
    finePrint:
      "Minimum stay 2 nights · Whole property · Free cancellation up to 14 days before arrival",
    nights1: "night",
    nightsFew: "nights",
    nightsMany: "nights",
  },

  rules: {
    title: "House rules",
    checkIn: "Check-in",
    checkOut: "Check-out",
    smoking: "Smoking",
    smokingValue: "Not permitted",
    pets: "Pets",
    petsValue: "Not permitted",
    quiet: "Quiet hours",
    children: "Children",
    childrenValue: "Welcome, 16+ charged as adults",
    cribs: "Cots",
    cribsValue: "Not available",
    capacity: "Capacity",
    capacityValue: "Max. 8 people",
  },

  footer: {
    tagline: "Beyond your expectations. In the heart of the High Tatras.",
    addressLabel: "Address",
    addressStreet: "Kamenná 2004/25A",
    addressCity: "059 52 Veľká Lomnica",
    addressCountry: "Slovakia",
    bookingLabel: "Booking",
    directOnly: "Direct booking only – no intermediaries.",
    airport: "Poprad-Tatry Airport",
    airportDistance: "15 min by car",
    strip: "Chalet Beyond · High Tatras, Slovakia",
    copyright: "© 2025 Chalet Beyond. All rights reserved.",
  },

  contact: {
    call: "Call",
    whatsapp: "WhatsApp",
    callAria: "Call",
    whatsappAria: "Message on WhatsApp",
  },
};
