// City street-parking rules for Parking Finder (#T954), shown for the city the chosen spot is in.
// Only rules read on the city's own page (or a news report quoting the city) are listed, with the link and the date
// checked. Cities whose default rules could not be confirmed are left out rather than guessed.
// To add a city: one entry here with its centre and a radius that covers it.

export interface CityRules {
  id: string;
  name: string;
  lat: number;
  lon: number;
  km: number; // the city counts as "here" within this distance of its centre
  rules: string[];
  pay?: string; // how paid street parking is paid, when known
  winter?: string;
  link: string; // official page for current rules, bans and permits
  source: string;
  checked: string;
}

export const CHECKED = '2026-11-14';

export const CITIES: CityRules[] = [
  {
    id: 'toronto', name: 'Toronto', lat: 43.6532, lon: -79.3832, km: 24,
    rules: [
      'Unsigned streets: at most 3 hours, unless a sign says otherwise. Signs can set shorter limits, like 1 hour or 15 minutes.',
      'Never within 3 metres of a fire hydrant.',
      'No Parking: you may only stop to load or unload passengers or goods. No Standing: only to pick up or drop off passengers. No Stopping: do not stop at all.',
    ],
    pay: 'Green P street machines and car parks; you can also pay with the Green P app.',
    link: 'https://www.toronto.ca/services-payments/streets-parking-transportation/parking/parking-regulations/',
    source: 'City of Toronto, Parking regulations', checked: CHECKED,
  },
  {
    id: 'ottawa', name: 'Ottawa', lat: 45.4215, lon: -75.6972, km: 30,
    rules: [
      'Unsigned streets: at most 3 hours, Monday to Friday, 7 a.m. to 7 p.m.; 6 hours on weekends and holidays.',
      'Street parking from the City of Ottawa below shows each pay machine\'s hours and rates, and the time-limited free blocks.',
    ],
    winter: 'From November 15 to April 1 the city can declare an overnight ban, 7 p.m. to 7 a.m., when 7 cm or more of snow (or freezing rain) is forecast. Check before you park overnight.',
    link: 'https://ottawa.ca/winterparking',
    source: 'City of Ottawa, Winter weather parking bans; Traffic and Parking By-law 2017-301 (3-hour rule as reported by CTV News)', checked: CHECKED,
  },
  {
    id: 'mississauga', name: 'Mississauga', lat: 43.589, lon: -79.6441, km: 14,
    rules: [
      'Unsigned streets: at most 5 hours.',
      'No street parking from 2 a.m. to 6 a.m., all year, without a permit.',
      'Temporary permits (5 days, up to 14 a year per address) are free to request from the city.',
    ],
    link: 'https://www.mississauga.ca/services-and-programs/transportation-and-streets/parking/apply-for-a-temporary-parking-permit/',
    source: 'City of Mississauga, as quoted in "Ask The City" (Modern Mississauga, 2021)', checked: CHECKED,
  },
  {
    id: 'brampton', name: 'Brampton', lat: 43.7315, lon: -79.7624, km: 12,
    rules: [
      'Street parking: at most 3 hours at a time.',
      'No street parking from 2 a.m. to 6 a.m. The city has no permit parking on streets.',
      'You can ask for a "consideration" up to 14 days a year per licence plate for those two rules.',
      'Never within 3 metres of a fire hydrant.',
    ],
    link: 'https://www.brampton.ca/EN/residents/By-Law-Enforcement/Pages/parking-enforcement.aspx',
    source: 'City of Brampton, Parking enforcement', checked: CHECKED,
  },
  {
    id: 'kitchener', name: 'Kitchener', lat: 43.4516, lon: -80.4925, km: 10,
    rules: [
      'Unsigned streets: at most 3 hours in a row between 6 a.m. and 11 p.m.',
      'Never within 3 metres of a fire hydrant or 1.5 metres of a driveway.',
    ],
    winter: 'From December 1 to March 31 you need an overnight parking exemption to park on the street overnight.',
    link: 'https://www.kitchener.ca/parkingbylaws',
    source: 'City of Kitchener, Parking bylaws', checked: CHECKED,
  },
  {
    id: 'london', name: 'London', lat: 42.9849, lon: -81.2453, km: 14,
    rules: ['Signs and no-parking zones apply as posted.'],
    winter: 'From November 1 to April 30 there is no street parking from 3 a.m. to 5 a.m. without a free overnight pass (up to 15 per licence plate a season, not valid when a snow event is forecast).',
    link: 'https://london.ca/newsroom/overnight-parking-restrictions-return-november-1',
    source: 'City of London, Overnight parking restrictions', checked: CHECKED,
  },
  {
    id: 'niagara-falls', name: 'Niagara Falls', lat: 43.0896, lon: -79.0849, km: 11,
    rules: [
      'No parking on city and regional roads from 2 a.m. to 6 a.m., unless signs say otherwise. This applies all year, with stricter enforcement in winter.',
      'Residents can ask for up to 7 nights a year per licence plate (11 p.m. to 7 a.m.), at least 12 hours ahead. Free; not during snow clearing.',
    ],
    link: 'https://niagarafalls.ca/roads-parking-and-transportation/parking/overnight-parking/',
    source: 'City of Niagara Falls, Overnight parking', checked: CHECKED,
  },
];

export const GENERAL = [
  'Each town sets its own street rules, so the signs on the block always win.',
  'Many Ontario towns ban overnight street parking in winter so ploughs can clear roads; check the town\'s website before leaving a car out overnight.',
  'Most towns ban parking close to fire hydrants, crosswalks, intersections and driveways.',
];

const toRad = (d: number) => (d * Math.PI) / 180;
/** Great-circle distance in metres. */
export function metres(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371008.8;
  const a = Math.sin(toRad(lat2 - lat1) / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(toRad(lon2 - lon1) / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Compass direction from one point to another: N, NE, E ... */
export function bearing(lat1: number, lon1: number, lat2: number, lon2: number) {
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  const deg = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  return { deg, name: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8] };
}

/** Walking minutes at 4.8 km/h (80 m a minute), rounded up, at least 1. */
export const walkMin = (m: number) => Math.max(1, Math.ceil(m / 80));

export function cityAt(lat: number, lon: number): CityRules | null {
  let best: CityRules | null = null, bd = Infinity;
  for (const c of CITIES) {
    const d = metres(lat, lon, c.lat, c.lon) / 1000;
    if (d <= c.km && d < bd) { best = c; bd = d; }
  }
  return best;
}

/** Ontario, roughly (the data covers Ontario only). */
export const inOntario = (lat: number, lon: number) => lat > 41.6 && lat < 57 && lon > -95.2 && lon < -74.3;
