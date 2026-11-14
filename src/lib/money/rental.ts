// Rent compare (#T953): the true monthly cost of a rental home = rent + bills + getting to the places you go.
// Plain TypeScript, no DOM, so the tool, its tests and the blog figures share one set of maths.
// Distances are straight lines between points (haversine) times a road factor; times use typical speeds per mode.
// Both are estimates: the person can type the real distance and minutes from their own map app for any trip.

export type Point = { lat: number; lon: number; label: string; exact: boolean };
export type Mode = 'car' | 'transit' | 'bike' | 'walk';

/** Typical door-to-door speeds (km/h on road distance) and fixed minutes per trip (parking, waiting, walking to the stop). */
export const MODES: Record<Mode, { name: string; kmh: number; extraMin: number }> = {
  car: { name: 'Car', kmh: 35, extraMin: 5 },
  transit: { name: 'Bus or train', kmh: 20, extraMin: 10 },
  bike: { name: 'Bike', kmh: 15, extraMin: 2 },
  walk: { name: 'Walk', kmh: 4.8, extraMin: 0 },
};

/** Weeks in an average month (52.18 weeks a year / 12). */
export const WEEKS_PER_MONTH = 365.25 / 7 / 12;

export const haversineKm = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) => {
  const R = 6371.0088, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
};

const ok = (lat: number, lon: number) => isFinite(lat) && isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180 && !(lat === 0 && lon === 0);

/** Coordinates from typed text: "43.65, -79.38", or a link copied from Google Maps, Apple Maps or OpenStreetMap. */
export function parseCoords(text: string): Point | null {
  const s = text.trim();
  if (!s) return null;
  const pats = [
    /[?&](?:q|query|ll|destination|daddr|sll)=(-?\d+(?:\.\d+)?)\s*(?:,|%2C)\s*(-?\d+(?:\.\d+)?)/i, // ?q=lat,lon (Google, Apple)
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/, // google.com/maps/@lat,lon,15z
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/, // Google place links
    /[?&]mlat=(-?\d+(?:\.\d+)?)&mlon=(-?\d+(?:\.\d+)?)/, // openstreetmap.org/?mlat=..&mlon=..
    /#map=\d+(?:\.\d+)?\/(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)/, // openstreetmap.org/#map=16/lat/lon
    /^geo:(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/i,
    /^\(?\s*(-?\d{1,2}(?:\.\d+)?)\s*[,;\s]\s*(-?\d{1,3}(?:\.\d+)?)\s*\)?$/, // plain "lat, lon"
  ];
  for (const p of pats) {
    const m = s.match(p);
    if (m) {
      const lat = +m[1], lon = +m[2];
      if (ok(lat, lon)) return { lat, lon, label: `${lat.toFixed(5)}, ${lon.toFixed(5)}`, exact: true };
    }
  }
  return null;
}

/** Canadian postal code -> its first three characters (the FSA), or null. "l2e 6t2" -> "L2E". */
export const caFsa = (text: string) => {
  const m = text.trim().toUpperCase().match(/^([ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z])(?:\s*\d[ABCEGHJ-NPRSTV-Z]\d)?$/);
  return m ? m[1] : null;
};

/** Regions: how a typed place is found without sending it anywhere. More regions (Indian PIN codes) plug in here. */
export type Region = { id: string; name: string; currency: string; postal: (text: string) => string | null; table: string; hint: string };
export const REGIONS: Region[] = [
  { id: 'ca', name: 'Canada (Ontario first)', currency: '$', postal: caFsa, table: '/geo/ca-fsa.json', hint: 'a postal code such as L2E 6T2' },
];

/** Find a place: coordinates or a map link first (exact), then a postal code (the centre of its area, from `table`). */
export function locate(text: string, region: Region, table?: Record<string, [number, number, string]> | null): Point | null {
  const c = parseCoords(text);
  if (c) return c;
  const code = region.postal(text);
  const row = code && table ? table[code] : null;
  return row ? { lat: row[0], lon: row[1], label: `${code} area (${row[2]})`, exact: false } : null;
}

export type Home = { name: string; rent: number; bills: Record<string, number> };
export type Trip = { mode: Mode; perWeek: number; park?: number; km?: number | null; min?: number | null };
export type Settings = { roadFactor: number; fuelPrice: number; l100: number; wearPerKm: number; fare: number; passMonthly: number; timeValue: number };

/** One trip from a home to a place: straight km, road km and minutes (typed values win over estimates). */
export function leg(straightKm: number | null, t: Trip, s: Settings) {
  const m = MODES[t.mode];
  const roadKm = t.km != null && t.km > 0 ? t.km : straightKm != null ? straightKm * (t.mode === 'walk' || t.mode === 'bike' ? Math.min(s.roadFactor, 1.3) : s.roadFactor) : null;
  const min = t.min != null && t.min > 0 ? t.min : roadKm != null ? (roadKm / m.kmh) * 60 + m.extraMin : null;
  return { roadKm, min, estimated: !(t.km && t.km > 0), timeEstimated: !(t.min && t.min > 0) };
}

/** Monthly travel for one home: car money by distance, transit by fares (capped at the pass), time in hours. */
export function travel(legs: { roadKm: number | null; min: number | null; trip: Trip }[], s: Settings) {
  let car = 0, fares = 0, hours = 0, carKm = 0, trips = 0;
  for (const { roadKm, min, trip } of legs) {
    const rounds = Math.max(0, trip.perWeek) * WEEKS_PER_MONTH; // round trips a month
    if (!rounds) continue;
    trips += rounds;
    if (min != null) hours += (rounds * 2 * min) / 60;
    if (trip.mode === 'car' && roadKm != null) {
      const km = rounds * 2 * roadKm;
      carKm += km;
      car += km * ((s.l100 / 100) * s.fuelPrice + s.wearPerKm) + rounds * (trip.park || 0);
    }
    if (trip.mode === 'transit') fares += rounds * 2 * s.fare;
  }
  const transit = s.passMonthly > 0 ? Math.min(fares, s.passMonthly) : fares;
  return { car, transit, money: car + transit, hours, carKm, trips };
}

/** Total monthly cost of a home: rent + bills + travel money, and with time valued at `timeValue` per hour. */
export function monthly(home: Home, tr: ReturnType<typeof travel>, s: Settings) {
  const bills = Object.values(home.bills).reduce((a, b) => a + (isFinite(b) ? b : 0), 0);
  const money = home.rent + bills + tr.money;
  return { rent: home.rent, bills, travel: tr.money, hours: tr.hours, money, withTime: money + tr.hours * s.timeValue };
}
