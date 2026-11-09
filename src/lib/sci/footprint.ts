// Household carbon footprint arithmetic: every line is amount × emission factor, grouped into categories, with
// flights from great-circle distances (WGS84 ellipsoid, Vincenty's inverse method) times trips and an optional
// routing uplift. No emission factors are built in as data: the defaults are rounded example values that the
// page labels as examples to replace. Plain TypeScript, no DOM.

export type Line = { label: string; amount: number; unit: string; factor: number };
export type Category = { id: string; name: string; perPerson: boolean; lines: Line[] };
export type Flight = { label: string; from: string; to: string; km: number | null; trips: number; ret: boolean };
export type State = {
  people: number;
  cats: Category[];
  flights: Flight[];
  flightFactor: number;
  /** Extra distance for routing and holding, as a fraction (0.08 = 8 %). */
  uplift: number;
};

const RAD = Math.PI / 180;
/** WGS84 ellipsoid. */
const A = 6378137, F = 1 / 298.257223563, B = A * (1 - F);
export const R_MEAN = 6371008.8;

/** Great-circle distance on a sphere of mean radius (metres), by the haversine formula. */
export function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const p1 = lat1 * RAD, p2 = lat2 * RAD, dp = p2 - p1, dl = (lon2 - lon1) * RAD;
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R_MEAN * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Shortest distance on the WGS84 ellipsoid (metres), Vincenty (1975) inverse formula. Falls back to the
 *  sphere for nearly antipodal points where the iteration does not settle. */
export function geodesic(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const L = (((lon2 - lon1 + 540) % 360) - 180) * RAD;
  const U1 = Math.atan((1 - F) * Math.tan(lat1 * RAD)), U2 = Math.atan((1 - F) * Math.tan(lat2 * RAD));
  const sU1 = Math.sin(U1), cU1 = Math.cos(U1), sU2 = Math.sin(U2), cU2 = Math.cos(U2);
  let lam = L, prev: number, iter = 0;
  let sS = 0, cS = 0, sig = 0, c2a = 0, c2sm = 0;
  do {
    const sl = Math.sin(lam), cl = Math.cos(lam);
    sS = Math.sqrt((cU2 * sl) ** 2 + (cU1 * sU2 - sU1 * cU2 * cl) ** 2);
    if (sS === 0) return 0;
    cS = sU1 * sU2 + cU1 * cU2 * cl;
    sig = Math.atan2(sS, cS);
    const sa = (cU1 * cU2 * sl) / sS;
    c2a = 1 - sa * sa;
    c2sm = c2a !== 0 ? cS - (2 * sU1 * sU2) / c2a : 0;
    const C = (F / 16) * c2a * (4 + F * (4 - 3 * c2a));
    prev = lam;
    lam = L + (1 - C) * F * sa * (sig + C * sS * (c2sm + C * cS * (-1 + 2 * c2sm * c2sm)));
  } while (Math.abs(lam - prev) > 1e-12 && ++iter < 200);
  if (iter >= 200) return haversine(lat1, lon1, lat2, lon2);
  const u2 = (c2a * (A * A - B * B)) / (B * B);
  const AA = 1 + (u2 / 16384) * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
  const BB = (u2 / 1024) * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
  const dS = BB * sS * (c2sm + (BB / 4) * (cS * (-1 + 2 * c2sm * c2sm) - (BB / 6) * c2sm * (-3 + 4 * sS * sS) * (-3 + 4 * c2sm * c2sm)));
  return B * AA * (sig - dS);
}

/** Read "43.68, -79.63" (or with a space or semicolon) as [lat, lon]; null if it is not a valid pair. */
export function parseLatLon(s: string): [number, number] | null {
  const m = s.trim().replace(/−/g, '-').split(/[\s,;]+/).filter(Boolean);
  if (m.length !== 2) return null;
  const lat = Number(m[0]), lon = Number(m[1]);
  return Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180 ? [lat, lon] : null;
}

export type FlightResult = { label: string; km: number; legs: number; kg: number; error?: string };
/** One flight line: distance (typed, or from coordinates) × (1 + uplift) × legs × factor. */
export function flightLine(f: Flight, factor: number, uplift: number): FlightResult {
  const legs = Math.max(0, f.trips) * (f.ret ? 2 : 1);
  let km = f.km != null && f.km > 0 ? f.km : NaN, error: string | undefined;
  if (!Number.isFinite(km)) {
    const a = parseLatLon(f.from), b = parseLatLon(f.to);
    if (a && b) km = geodesic(a[0], a[1], b[0], b[1]) / 1000;
    else if (f.from.trim() || f.to.trim()) error = `${f.label || 'A flight'}: type both ends as latitude, longitude (for example 43.68, -79.63), or a distance in km.`;
    else km = 0;
  }
  const kg = Number.isFinite(km) ? km * (1 + uplift) * legs * factor : 0;
  return { label: f.label, km: Number.isFinite(km) ? km : 0, legs, kg, error };
}

export type CatResult = { id: string; name: string; kg: number; lines: (Line & { kg: number })[] };
export type Result = { cats: CatResult[]; flights: FlightResult[]; flightKg: number; total: number; perPerson: number; errors: string[] };

export function footprint(s: State): Result {
  const people = s.people > 0 ? s.people : 1;
  const errors: string[] = [];
  const cats: CatResult[] = s.cats.map((c) => {
    const lines = c.lines.map((l) => {
      const ok = Number.isFinite(l.amount) && Number.isFinite(l.factor);
      if (!ok) errors.push(`${c.name}, ${l.label || 'a line'}: the amount and the factor must be numbers.`);
      if (ok && (l.amount < 0)) errors.push(`${c.name}, ${l.label || 'a line'}: the amount cannot be negative.`);
      const kg = ok && l.amount >= 0 ? l.amount * l.factor * (c.perPerson ? people : 1) : 0;
      return { ...l, kg };
    });
    return { id: c.id, name: c.name, kg: lines.reduce((a, l) => a + l.kg, 0), lines };
  });
  const flights = s.flights.map((f) => flightLine(f, s.flightFactor, s.uplift));
  for (const f of flights) if (f.error) errors.push(f.error);
  const flightKg = flights.reduce((a, f) => a + f.kg, 0);
  const all = [...cats];
  if (s.flights.length) all.splice(Math.min(2, all.length), 0, { id: 'flights', name: 'Flights', kg: flightKg, lines: [] });
  const total = all.reduce((a, c) => a + c.kg, 0);
  return { cats: all, flights, flightKg, total, perPerson: total / people, errors };
}

/** The example household. Every factor is a rounded example value, not official data. */
export function exampleState(): State {
  return {
    people: 2,
    cats: [
      { id: 'home', name: 'Home energy', perPerson: false, lines: [
        { label: 'Electricity', amount: 4000, unit: 'kWh', factor: 0.4 },
        { label: 'Natural gas', amount: 12000, unit: 'kWh', factor: 0.2 },
      ] },
      { id: 'travel', name: 'Car and transit', perPerson: false, lines: [
        { label: 'Petrol car', amount: 12000, unit: 'km', factor: 0.17 },
        { label: 'Bus and train', amount: 1500, unit: 'km', factor: 0.05 },
      ] },
      { id: 'food', name: 'Food (per person)', perPerson: true, lines: [
        { label: 'Meat and fish', amount: 365, unit: 'days', factor: 2 },
        { label: 'Dairy and eggs', amount: 365, unit: 'days', factor: 1 },
        { label: 'Plant foods and drinks', amount: 365, unit: 'days', factor: 1.5 },
      ] },
      { id: 'goods', name: 'Goods and services', perPerson: false, lines: [
        { label: 'Clothes and shoes', amount: 1500, unit: 'spent', factor: 0.4 },
        { label: 'Electronics and furniture', amount: 2000, unit: 'spent', factor: 0.3 },
        { label: 'Services', amount: 5000, unit: 'spent', factor: 0.1 },
      ] },
    ],
    flights: [{ label: 'Toronto to Vancouver', from: '43.68, -79.63', to: '49.19, -123.18', km: null, trips: 1, ret: true }],
    flightFactor: 0.15,
    uplift: 0,
  };
}

/** Rows for a CSV of every line. */
export function csvRows(s: State, r: Result): (string | number)[][] {
  const out: (string | number)[][] = [['category', 'item', 'amount', 'unit', 'factor_kg_co2e_per_unit', 'people_multiplier', 'kg_co2e']];
  const round = (x: number) => Math.round(x * 1000) / 1000;
  for (const c of s.cats) {
    const rc = r.cats.find((x) => x.id === c.id)!;
    rc.lines.forEach((l) => out.push([c.name, l.label, l.amount, l.unit, l.factor, c.perPerson ? s.people : 1, round(l.kg)]));
  }
  r.flights.forEach((f) => out.push(['Flights', f.label, round(f.km * (1 + s.uplift) * f.legs), 'passenger-km', s.flightFactor, 1, round(f.kg)]));
  out.push(['Total', '', '', '', '', '', round(r.total)]);
  return out;
}
