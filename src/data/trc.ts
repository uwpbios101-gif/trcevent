import eventImg1 from "@/assets/event-1.jpg";
import eventImg2 from "@/assets/event-2.jpg";
import venueImg1 from "@/assets/venue-1.jpg";
import venueImg2 from "@/assets/venue-2.jpg";

export type Genre =
  | "Roots Reggae"
  | "Dancehall"
  | "Dub"
  | "Lovers Rock"
  | "Ska"
  | "Rocksteady"
  | "Reggae Revival"
  | "Sound Clash";

export const GENRES: Genre[] = [
  "Roots Reggae",
  "Dancehall",
  "Dub",
  "Lovers Rock",
  "Ska",
  "Rocksteady",
  "Reggae Revival",
  "Sound Clash",
];

export const NEIGHBORHOODS = [
  "South Shore",
  "Hyde Park",
  "Bronzeville",
  "Wicker Park",
  "Pilsen",
  "Logan Square",
  "Rogers Park",
  "Uptown",
];

export const GALLERY = [eventImg1, eventImg2, venueImg1, venueImg2];

export interface DJ {
  slug: string;
  artistName: string;
  realName: string;
  bio: string;
  neighborhood: string;
  city: string;
  genres: Genre[];
  yearsActive: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  premium: boolean;
  equipment: string;
  social: { instagram?: string; youtube?: string; soundcloud?: string };
  audioEmbed: string; // youtube embed id
  gallery: string[];
  accent: string; // gradient for avatar
}

export interface Venue {
  slug: string;
  name: string;
  address: string;
  neighborhood: string;
  capacity: number;
  stageSize: string;
  soundRestrictions: string;
  techRider: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  website: string;
  contactEmail: string;
  image: string;
  gallery: string[];
}

export interface LineupSlot {
  djSlug: string;
  setTime: string;
}

export interface TRCEvent {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  startTime: string;
  endTime: string;
  venueSlug: string;
  promoter: string;
  genre: Genre;
  status: "Draft" | "Published" | "Cancelled" | "Completed";
  featured: boolean;
  ticketUrl: string;
  image: string;
  lineup: LineupSlot[];
}

export interface Sponsor {
  slug: string;
  name: string;
  level: "Bronze" | "Silver" | "Gold" | "Platinum";
  website: string;
  description: string;
  featured: boolean;
}

export interface Review {
  id: string;
  djSlug: string;
  reviewer: string;
  rating: number;
  text: string;
  date: string;
}

export const djs: DJ[] = [
  {
    slug: "jah-warrior",
    artistName: "Jah Warrior",
    realName: "Marcus Brown",
    bio: "South Shore selector and founder of the Lion's Den sound. Two decades deep in roots and dub, Jah Warrior is known for marathon sets that move a room from meditation to fire.",
    neighborhood: "South Shore",
    city: "Chicago",
    genres: ["Roots Reggae", "Dub", "Sound Clash"],
    yearsActive: 21,
    rating: 4.9,
    reviewCount: 38,
    featured: true,
    premium: true,
    equipment: "Custom Lion's Den 4-stack sound system, Technics 1210s, dub siren, valve pre-amps.",
    social: { instagram: "jahwarrior_chi", soundcloud: "jahwarrior" },
    audioEmbed: "wTP2RUD_cL0",
    gallery: [eventImg1, eventImg2, venueImg2],
    accent: "linear-gradient(135deg,#C9A84C,#7a5c1e)",
  },
  {
    slug: "empress-ria",
    artistName: "Empress Ria",
    realName: "Maria Campbell",
    bio: "Hyde Park's queen of Lovers Rock. Empress Ria curates warm, vinyl-first sets that pull on every heartstring in the dance.",
    neighborhood: "Hyde Park",
    city: "Chicago",
    genres: ["Lovers Rock", "Rocksteady", "Roots Reggae"],
    yearsActive: 12,
    rating: 4.8,
    reviewCount: 27,
    featured: true,
    premium: true,
    equipment: "All-vinyl rig, rotary mixer, Ortofon needles.",
    social: { instagram: "empressria", youtube: "empressria" },
    audioEmbed: "zOzx6Cee9Lw",
    gallery: [eventImg2, venueImg1, eventImg1],
    accent: "linear-gradient(135deg,#d98f5f,#7a3b1e)",
  },
  {
    slug: "selecta-blaze",
    artistName: "Selecta Blaze",
    realName: "Andre Wallace",
    bio: "Bronzeville dancehall specialist. Selecta Blaze brings juggling skills and the freshest dubplates to every clash.",
    neighborhood: "Bronzeville",
    city: "Chicago",
    genres: ["Dancehall", "Sound Clash"],
    yearsActive: 9,
    rating: 4.7,
    reviewCount: 31,
    featured: true,
    premium: false,
    equipment: "CDJ-3000s, DJM-900, exclusive dubplate library.",
    social: { instagram: "selectablaze", soundcloud: "selectablaze" },
    audioEmbed: "Y2Ic3Mng9NU",
    gallery: [eventImg1, venueImg2, eventImg2],
    accent: "linear-gradient(135deg,#c94c4c,#5a1e1e)",
  },
  {
    slug: "dub-architect",
    artistName: "Dub Architect",
    realName: "Kwame Osei",
    bio: "Wicker Park sound engineer turned selector. Builds towering dub soundscapes live with tape delay and spring reverb.",
    neighborhood: "Wicker Park",
    city: "Chicago",
    genres: ["Dub", "Roots Reggae"],
    yearsActive: 15,
    rating: 4.6,
    reviewCount: 19,
    featured: false,
    premium: false,
    equipment: "Roland Space Echo, custom dub mixer, 2x 18\" subs.",
    social: { instagram: "dubarchitect", youtube: "dubarchitect" },
    audioEmbed: "1jB2nLpu6Zk",
    gallery: [venueImg2, eventImg2],
    accent: "linear-gradient(135deg,#4c8fc9,#1e3a5a)",
  },
  {
    slug: "sister-nyah",
    artistName: "Sister Nyah",
    realName: "Janet Powell",
    bio: "Pilsen-based selector championing Reggae Revival and conscious roots. A community organizer as much as a DJ.",
    neighborhood: "Pilsen",
    city: "Chicago",
    genres: ["Reggae Revival", "Roots Reggae"],
    yearsActive: 8,
    rating: 4.8,
    reviewCount: 22,
    featured: true,
    premium: false,
    equipment: "Serato setup, Rane Seventy, condenser mic for live toasting.",
    social: { instagram: "sisternyah" },
    audioEmbed: "Cbk980jV7Ao",
    gallery: [eventImg1, venueImg1],
    accent: "linear-gradient(135deg,#4cc98f,#1e5a3a)",
  },
  {
    slug: "king-tafari",
    artistName: "King Tafari",
    realName: "Delroy Bennett",
    bio: "Logan Square veteran with deep Jamaican roots. King Tafari's archive of original pressings is legendary on the circuit.",
    neighborhood: "Logan Square",
    city: "Chicago",
    genres: ["Roots Reggae", "Ska", "Rocksteady"],
    yearsActive: 28,
    rating: 4.9,
    reviewCount: 41,
    featured: false,
    premium: true,
    equipment: "Vintage valve amplification, rare 7\" collection, Technics 1200 MK2.",
    social: { instagram: "kingtafari", soundcloud: "kingtafari" },
    audioEmbed: "DkAGfm6f1ZI",
    gallery: [eventImg2, venueImg2],
    accent: "linear-gradient(135deg,#c9a84c,#5a4a1e)",
  },
  {
    slug: "lady-saw-tooth",
    artistName: "Lady Sawtooth",
    realName: "Crystal Reid",
    bio: "Rogers Park dancehall and ska selector with a high-energy, genre-bending style.",
    neighborhood: "Rogers Park",
    city: "Chicago",
    genres: ["Dancehall", "Ska"],
    yearsActive: 6,
    rating: 4.5,
    reviewCount: 14,
    featured: false,
    premium: false,
    equipment: "CDJ setup, MIDI controller, live FX pads.",
    social: { instagram: "ladysawtooth" },
    audioEmbed: "rGL9D9JJg5Y",
    gallery: [eventImg1, eventImg2],
    accent: "linear-gradient(135deg,#9f4cc9,#3a1e5a)",
  },
  {
    slug: "ras-marvin",
    artistName: "Ras Marvin",
    realName: "Marvin Clarke",
    bio: "Uptown selector with a meditative roots and dub catalogue. A fixture of Chicago's Sunday session culture.",
    neighborhood: "Uptown",
    city: "Chicago",
    genres: ["Roots Reggae", "Dub"],
    yearsActive: 17,
    rating: 4.7,
    reviewCount: 20,
    featured: false,
    premium: false,
    equipment: "Analog mixer, dual turntables, dub siren.",
    social: { instagram: "rasmarvin", youtube: "rasmarvin" },
    audioEmbed: "j9V78UbdzWI",
    gallery: [venueImg1, eventImg1],
    accent: "linear-gradient(135deg,#4cc9c0,#1e5a55)",
  },
  {
    slug: "mighty-vibez",
    artistName: "Mighty Vibez",
    realName: "Terrence Hall",
    bio: "South Shore party-starter blending dancehall and reggae revival for the new generation.",
    neighborhood: "South Shore",
    city: "Chicago",
    genres: ["Dancehall", "Reggae Revival"],
    yearsActive: 5,
    rating: 4.4,
    reviewCount: 11,
    featured: false,
    premium: false,
    equipment: "Pioneer XDJ, wireless mic, portable PA.",
    social: { instagram: "mightyvibez" },
    audioEmbed: "5pHc5BfdJpg",
    gallery: [eventImg2, venueImg2],
    accent: "linear-gradient(135deg,#c9784c,#5a2e1e)",
  },
  {
    slug: "queen-melodica",
    artistName: "Queen Melodica",
    realName: "Patricia Grant",
    bio: "Hyde Park selector and live melodica player. Bridges rocksteady classics with modern lovers rock.",
    neighborhood: "Hyde Park",
    city: "Chicago",
    genres: ["Rocksteady", "Lovers Rock"],
    yearsActive: 10,
    rating: 4.6,
    reviewCount: 16,
    featured: false,
    premium: false,
    equipment: "Vinyl + live melodica, rotary mixer.",
    social: { instagram: "queenmelodica", soundcloud: "queenmelodica" },
    audioEmbed: "kqYxV5Jtv9k",
    gallery: [eventImg1, venueImg1],
    accent: "linear-gradient(135deg,#c94c8f,#5a1e3a)",
  },
];

export const venues: Venue[] = [
  {
    slug: "caribbean-palace",
    name: "Caribbean Palace",
    address: "7100 S Stony Island Ave, Chicago, IL 60649",
    neighborhood: "South Shore",
    capacity: 450,
    stageSize: "24ft x 16ft raised stage",
    soundRestrictions: "Indoor — no curfew. Full PA permitted.",
    techRider: "House PA: 4x tops, 4x subs. 32-channel desk. Monitor engineer on request.",
    rating: 4.8,
    reviewCount: 24,
    featured: true,
    website: "https://caribbeanpalace.example.com",
    contactEmail: "booking@caribbeanpalace.example.com",
    image: venueImg2,
    gallery: [venueImg2, eventImg1, eventImg2],
  },
  {
    slug: "the-lakeside-room",
    name: "The Lakeside Room",
    address: "1530 E Hyde Park Blvd, Chicago, IL 60615",
    neighborhood: "Hyde Park",
    capacity: 220,
    stageSize: "18ft x 12ft stage",
    soundRestrictions: "Sound limited to 11pm on weeknights.",
    techRider: "House PA: 2x tops, 2x subs. 16-channel desk. DJ booth with CDJs.",
    rating: 4.6,
    reviewCount: 17,
    featured: true,
    website: "https://lakesideroom.example.com",
    contactEmail: "events@lakesideroom.example.com",
    image: venueImg1,
    gallery: [venueImg1, eventImg2],
  },
  {
    slug: "bronzeville-sound-hall",
    name: "Bronzeville Sound Hall",
    address: "320 E 47th St, Chicago, IL 60653",
    neighborhood: "Bronzeville",
    capacity: 600,
    stageSize: "30ft x 20ft stage with rigging",
    soundRestrictions: "Indoor warehouse — no curfew.",
    techRider: "Bring-your-own sound friendly. 200A power. Loading dock access.",
    rating: 4.7,
    reviewCount: 21,
    featured: true,
    website: "https://bronzevillesoundhall.example.com",
    contactEmail: "info@bronzevillesoundhall.example.com",
    image: venueImg2,
    gallery: [venueImg2, eventImg1],
  },
  {
    slug: "the-corner-pilsen",
    name: "The Corner Pilsen",
    address: "1858 W 18th St, Chicago, IL 60608",
    neighborhood: "Pilsen",
    capacity: 150,
    stageSize: "Floor-level DJ riser",
    soundRestrictions: "Sound limited to midnight Fri/Sat.",
    techRider: "House PA: 2x tops, 1x sub. DJ booth only.",
    rating: 4.4,
    reviewCount: 12,
    featured: false,
    website: "https://thecornerpilsen.example.com",
    contactEmail: "hello@thecornerpilsen.example.com",
    image: venueImg1,
    gallery: [venueImg1, eventImg2],
  },
  {
    slug: "logan-warehouse",
    name: "Logan Warehouse",
    address: "2545 N Kedzie Ave, Chicago, IL 60647",
    neighborhood: "Logan Square",
    capacity: 800,
    stageSize: "Open warehouse floor, modular staging",
    soundRestrictions: "Permitted events only — no curfew with permit.",
    techRider: "Raw space. 400A three-phase power. Full production load-in.",
    rating: 4.5,
    reviewCount: 15,
    featured: false,
    website: "https://loganwarehouse.example.com",
    contactEmail: "book@loganwarehouse.example.com",
    image: venueImg2,
    gallery: [venueImg2, eventImg1],
  },
];

export const events: TRCEvent[] = [
  {
    slug: "chicago-reggae-fest-2027",
    title: "Chicago Reggae Fest 2027",
    description:
      "The flagship night of the Chicago reggae calendar returns to Bronzeville Sound Hall. Three sound systems, a full roots-to-dancehall lineup, and a Caribbean kitchen on site. This is the right connection — and the reggae one.",
    date: "2027-07-10",
    startTime: "20:00",
    endTime: "03:00",
    venueSlug: "bronzeville-sound-hall",
    promoter: "TRC Events",
    genre: "Roots Reggae",
    status: "Published",
    featured: true,
    ticketUrl: "https://www.tickettailor.com/events/trcevents",
    image: eventImg1,
    lineup: [
      { djSlug: "jah-warrior", setTime: "20:00" },
      { djSlug: "sister-nyah", setTime: "21:30" },
      { djSlug: "selecta-blaze", setTime: "23:00" },
      { djSlug: "king-tafari", setTime: "01:00" },
    ],
  },
  {
    slug: "lovers-rock-sundays",
    title: "Lovers Rock Sundays",
    description:
      "A warm, vinyl-only Sunday session at The Lakeside Room. Slow it down with the finest lovers rock and rocksteady selections in the city.",
    date: "2027-06-27",
    startTime: "18:00",
    endTime: "23:00",
    venueSlug: "the-lakeside-room",
    promoter: "Empress Ria",
    genre: "Lovers Rock",
    status: "Published",
    featured: true,
    ticketUrl: "https://www.tickettailor.com/events/trcevents",
    image: eventImg2,
    lineup: [
      { djSlug: "empress-ria", setTime: "18:00" },
      { djSlug: "queen-melodica", setTime: "20:30" },
    ],
  },
  {
    slug: "dub-frequency-night",
    title: "Dub Frequency Night",
    description:
      "Feel the bass in your chest. A dedicated dub session built around a custom 4-stack at Caribbean Palace, with live effects and dub sirens all night.",
    date: "2027-07-03",
    startTime: "21:00",
    endTime: "02:00",
    venueSlug: "caribbean-palace",
    promoter: "Lion's Den Sound",
    genre: "Dub",
    status: "Published",
    featured: true,
    ticketUrl: "https://www.tickettailor.com/events/trcevents",
    image: venueImg2,
    lineup: [
      { djSlug: "dub-architect", setTime: "21:00" },
      { djSlug: "jah-warrior", setTime: "23:00" },
      { djSlug: "ras-marvin", setTime: "01:00" },
    ],
  },
  {
    slug: "bronzeville-sound-clash",
    title: "Bronzeville Sound Clash",
    description:
      "Four sounds, one champion. The annual clash returns with dubplate specials and bragging rights on the line. Bring your tissue — somebody's getting buried.",
    date: "2027-08-14",
    startTime: "22:00",
    endTime: "04:00",
    venueSlug: "bronzeville-sound-hall",
    promoter: "TRC Events",
    genre: "Sound Clash",
    status: "Published",
    featured: false,
    ticketUrl: "https://www.tickettailor.com/events/trcevents",
    image: eventImg1,
    lineup: [
      { djSlug: "selecta-blaze", setTime: "22:00" },
      { djSlug: "jah-warrior", setTime: "23:30" },
      { djSlug: "king-tafari", setTime: "01:00" },
    ],
  },
  {
    slug: "pilsen-ska-social",
    title: "Pilsen Ska Social",
    description:
      "An early-doors, all-ages ska and rocksteady social at The Corner Pilsen. Skank the night away with vintage selections.",
    date: "2027-06-20",
    startTime: "17:00",
    endTime: "22:00",
    venueSlug: "the-corner-pilsen",
    promoter: "Sister Nyah",
    genre: "Ska",
    status: "Completed",
    featured: false,
    ticketUrl: "https://www.tickettailor.com/events/trcevents",
    image: eventImg2,
    lineup: [
      { djSlug: "king-tafari", setTime: "17:00" },
      { djSlug: "lady-saw-tooth", setTime: "19:30" },
    ],
  },
  {
    slug: "reggae-revival-showcase",
    title: "Reggae Revival Showcase",
    description:
      "Spotlighting the new wave of conscious reggae. A community-driven showcase at Logan Warehouse with proceeds supporting youth music programs.",
    date: "2027-09-05",
    startTime: "20:00",
    endTime: "01:00",
    venueSlug: "logan-warehouse",
    promoter: "Sister Nyah",
    genre: "Reggae Revival",
    status: "Published",
    featured: true,
    ticketUrl: "https://www.tickettailor.com/events/trcevents",
    image: venueImg1,
    lineup: [
      { djSlug: "sister-nyah", setTime: "20:00" },
      { djSlug: "mighty-vibez", setTime: "22:00" },
      { djSlug: "ras-marvin", setTime: "23:30" },
    ],
  },
  {
    slug: "dancehall-takeover",
    title: "Dancehall Takeover",
    description:
      "Pure dancehall energy from open to close. Juggling, dubplates, and the freshest riddims at Caribbean Palace.",
    date: "2027-07-24",
    startTime: "22:00",
    endTime: "03:00",
    venueSlug: "caribbean-palace",
    promoter: "Mighty Vibez",
    genre: "Dancehall",
    status: "Published",
    featured: false,
    ticketUrl: "https://www.tickettailor.com/events/trcevents",
    image: eventImg1,
    lineup: [
      { djSlug: "mighty-vibez", setTime: "22:00" },
      { djSlug: "selecta-blaze", setTime: "23:30" },
      { djSlug: "lady-saw-tooth", setTime: "01:30" },
    ],
  },
  {
    slug: "rocksteady-revue",
    title: "Rocksteady Revue",
    description:
      "A refined evening of rocksteady and early reggae at The Lakeside Room. Seated session with a live melodica set.",
    date: "2027-08-01",
    startTime: "19:00",
    endTime: "23:30",
    venueSlug: "the-lakeside-room",
    promoter: "Queen Melodica",
    genre: "Rocksteady",
    status: "Published",
    featured: false,
    ticketUrl: "https://www.tickettailor.com/events/trcevents",
    image: eventImg2,
    lineup: [
      { djSlug: "queen-melodica", setTime: "19:00" },
      { djSlug: "empress-ria", setTime: "21:00" },
    ],
  },
  {
    slug: "warehouse-roots-session",
    title: "Warehouse Roots Session",
    description:
      "An all-night roots meditation in the raw expanse of Logan Warehouse. Heavyweight sound, conscious vibrations.",
    date: "2027-10-09",
    startTime: "21:00",
    endTime: "04:00",
    venueSlug: "logan-warehouse",
    promoter: "Lion's Den Sound",
    genre: "Roots Reggae",
    status: "Draft",
    featured: false,
    ticketUrl: "https://www.tickettailor.com/events/trcevents",
    image: venueImg2,
    lineup: [
      { djSlug: "jah-warrior", setTime: "21:00" },
      { djSlug: "ras-marvin", setTime: "23:30" },
    ],
  },
  {
    slug: "new-year-reggae-ball",
    title: "New Year Reggae Ball",
    description:
      "Ring in the new year the right way. A black-and-gold dress-code celebration spanning every corner of the reggae spectrum.",
    date: "2027-12-31",
    startTime: "21:00",
    endTime: "04:00",
    venueSlug: "bronzeville-sound-hall",
    promoter: "TRC Events",
    genre: "Roots Reggae",
    status: "Published",
    featured: true,
    ticketUrl: "https://www.tickettailor.com/events/trcevents",
    image: eventImg1,
    lineup: [
      { djSlug: "empress-ria", setTime: "21:00" },
      { djSlug: "king-tafari", setTime: "22:30" },
      { djSlug: "selecta-blaze", setTime: "00:30" },
      { djSlug: "jah-warrior", setTime: "02:00" },
    ],
  },
];

export const sponsors: Sponsor[] = [
  {
    slug: "island-rum-co",
    name: "Island Rum Co.",
    level: "Platinum",
    website: "https://islandrum.example.com",
    description: "Premium Caribbean rum, proudly pouring at TRC nights.",
    featured: true,
  },
  {
    slug: "south-side-sound",
    name: "South Side Sound",
    level: "Gold",
    website: "https://southsidesound.example.com",
    description: "Chicago's go-to pro audio rental and sound system specialists.",
    featured: true,
  },
  {
    slug: "windy-city-vinyl",
    name: "Windy City Vinyl",
    level: "Silver",
    website: "https://windycityvinyl.example.com",
    description: "Independent record store stocking the deepest reggae crates in the Midwest.",
    featured: true,
  },
  {
    slug: "jerk-junction",
    name: "Jerk Junction",
    level: "Bronze",
    website: "https://jerkjunction.example.com",
    description: "Authentic Jamaican kitchen catering the dance.",
    featured: false,
  },
  {
    slug: "lakefront-media",
    name: "Lakefront Media",
    level: "Gold",
    website: "https://lakefrontmedia.example.com",
    description: "Event photography and video built for the culture.",
    featured: true,
  },
];

export const reviews: Review[] = [
  { id: "r1", djSlug: "jah-warrior", reviewer: "DJ Promoter Kofi", rating: 5, text: "Booked Jah Warrior for our festival closer. The room was electric from the first selection. The right connection, every time.", date: "2027-05-12" },
  { id: "r2", djSlug: "jah-warrior", reviewer: "Lakeside Room", rating: 5, text: "Professional, on time, and reads a crowd like nobody else. Booking again.", date: "2027-04-02" },
  { id: "r3", djSlug: "jah-warrior", reviewer: "Marsha T.", rating: 5, text: "Best dub set I've heard in Chicago, period.", date: "2027-03-18" },
  { id: "r4", djSlug: "empress-ria", reviewer: "Hyde Park Socials", rating: 5, text: "Empress Ria turned our Sunday into something magical. Pure class.", date: "2027-05-01" },
  { id: "r5", djSlug: "empress-ria", reviewer: "Devon W.", rating: 5, text: "The lovers rock selections had everyone holding their partner close.", date: "2027-04-14" },
  { id: "r6", djSlug: "empress-ria", reviewer: "The Corner Pilsen", rating: 4, text: "Wonderful set and lovely to work with.", date: "2027-02-20" },
  { id: "r7", djSlug: "selecta-blaze", reviewer: "Clash Promotions", rating: 5, text: "Dubplates for days. Blaze came to win and he did.", date: "2027-05-09" },
  { id: "r8", djSlug: "selecta-blaze", reviewer: "Tasha M.", rating: 4, text: "High energy juggling all night. Crowd never stopped.", date: "2027-03-30" },
  { id: "r9", djSlug: "dub-architect", reviewer: "Caribbean Palace", rating: 5, text: "The live dub mixing was something special. A true craftsman.", date: "2027-04-22" },
  { id: "r10", djSlug: "dub-architect", reviewer: "Errol B.", rating: 4, text: "Deep, hypnotic, heavy. Loved it.", date: "2027-02-11" },
  { id: "r11", djSlug: "sister-nyah", reviewer: "Logan Warehouse", rating: 5, text: "More than a DJ — a community builder. Our showcase sold out.", date: "2027-05-15" },
  { id: "r12", djSlug: "sister-nyah", reviewer: "Aisha K.", rating: 5, text: "Conscious selections that mean something. Beautiful energy.", date: "2027-03-05" },
  { id: "r13", djSlug: "king-tafari", reviewer: "Bronzeville Sound Hall", rating: 5, text: "The man's record collection is a museum. Unmatched depth.", date: "2027-04-28" },
  { id: "r14", djSlug: "king-tafari", reviewer: "Winston P.", rating: 5, text: "Original pressings all night. A masterclass.", date: "2027-02-26" },
  { id: "r15", djSlug: "lady-saw-tooth", reviewer: "Pilsen Social", rating: 4, text: "Brought serious energy to the ska social. Crowd loved her.", date: "2027-03-12" },
  { id: "r16", djSlug: "ras-marvin", reviewer: "Uptown Sundays", rating: 5, text: "Ras Marvin's Sunday sessions are a Chicago institution.", date: "2027-04-09" },
  { id: "r17", djSlug: "ras-marvin", reviewer: "Camille R.", rating: 4, text: "Meditative and heavy. Exactly what I needed.", date: "2027-01-30" },
  { id: "r18", djSlug: "mighty-vibez", reviewer: "South Shore Block", rating: 4, text: "Got the whole block moving. Reliable party-starter.", date: "2027-05-04" },
  { id: "r19", djSlug: "queen-melodica", reviewer: "Lakeside Room", rating: 5, text: "The live melodica over rocksteady was unforgettable.", date: "2027-04-18" },
  { id: "r20", djSlug: "queen-melodica", reviewer: "Junior A.", rating: 4, text: "Smooth, soulful, classy throughout.", date: "2027-02-08" },
];

// ---- Helpers ----
const sortFeatured = <T extends { featured: boolean }>(arr: T[]) =>
  [...arr].sort((a, b) => Number(b.featured) - Number(a.featured));

export const getDJ = (slug: string) => djs.find((d) => d.slug === slug);
export const getVenue = (slug: string) => venues.find((v) => v.slug === slug);
export const getEvent = (slug: string) => events.find((e) => e.slug === slug);

export const featuredDJs = () => sortFeatured(djs).filter((d) => d.featured);
export const topDJs = () => [...djs].sort((a, b) => b.rating - a.rating).slice(0, 5);
export const featuredVenues = () => sortFeatured(venues).filter((v) => v.featured);
export const featuredSponsors = () => sponsors.filter((s) => s.featured);

export const publishedEvents = () =>
  sortFeatured(events.filter((e) => e.status === "Published")).sort(
    (a, b) => Number(b.featured) - Number(a.featured),
  );

export const upcomingEvents = () =>
  events
    .filter((e) => e.status === "Published")
    .sort((a, b) => a.date.localeCompare(b.date));

export const djReviews = (slug: string) =>
  reviews.filter((r) => r.djSlug === slug).sort((a, b) => b.date.localeCompare(a.date));

export const eventsAtVenue = (venueSlug: string) =>
  events.filter((e) => e.venueSlug === venueSlug && e.status !== "Draft");

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const formatShortDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const sponsorOrder: Sponsor["level"][] = ["Platinum", "Gold", "Silver", "Bronze"];