// Top-of-atmosphere insolation for any orbit (Berger 1978 formulas), with the Sun's true longitude found from the
// calendar day by solving Kepler's equation exactly. No orbital solution tables are bundled: the user types the
// eccentricity, obliquity and longitude of perihelion.
//
// Conventions (as in Berger 1978 and the Berger & Loutre / Laskar tables):
//  - λ, the true solar longitude, is 0° at the March (vernal) equinox, 90° at the June solstice.
//  - ϖ (peri) is the longitude of perihelion measured from the moving vernal equinox in the heliocentric sense, so the
//    Sun's longitude at perihelion is ϖ + 180° (today ϖ ≈ 103°, perihelion in early January, λ ≈ 283°).
//  - Calendar days follow the common climate-model convention: the March equinox is fixed on day 80 (21 March) and the
//    year is one tropical year long.

export type Orbit = { e: number; obl: number; peri: number; S0: number };
export const YEAR = 365.2422;
export const EQUINOX_DAY = 80;
/** Today's values (general astronomical facts, J2000 epoch) and a round total solar irradiance. */
export const PRESENT: Orbit = { e: 0.016708, obl: 23.439, peri: 102.937, S0: 1361 };
const D = Math.PI / 180;
const wrap = (x: number) => ((x % 360) + 360) % 360;

export function checkOrbit(o: Orbit): string | null {
  if (!(o.e >= 0 && o.e < 0.3)) return 'Eccentricity must be from 0 to 0.3 (Earth stays between 0 and about 0.07).';
  if (!(o.obl >= 0 && o.obl <= 90)) return 'Obliquity must be from 0° to 90°.';
  if (!Number.isFinite(o.peri)) return 'Type a longitude of perihelion in degrees.';
  if (!(o.S0 > 0 && o.S0 < 1e5)) return 'The solar constant must be a positive number of W/m².';
  return null;
}

/** Sun's true longitude λ (degrees, 0 to 360) at calendar day `day` (equinox on day 80). */
export function lambdaOfDay(o: Orbit, day: number): number {
  const ps = (o.peri + 180) * D, e = o.e;
  const mean = (v: number) => { const E = 2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan(v / 2)); return E - e * Math.sin(E); };
  const M = mean(-ps) + (2 * Math.PI * (day - EQUINOX_DAY)) / YEAR;
  let E = M;
  for (let k = 0; k < 50; k++) { const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= dE; if (Math.abs(dE) < 1e-15) break; }
  const v = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
  return wrap((v + ps) / D);
}
/** Calendar day (80 to 445.2422, then wrapped to 0 to 365.2422) at which the Sun reaches longitude λ. */
export function dayOfLambda(o: Orbit, lam: number): number {
  const ps = (o.peri + 180) * D, e = o.e;
  const mean = (v: number) => { const E = 2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan(v / 2)); return E - e * Math.sin(E); };
  let dM = mean(lam * D - ps) - mean(-ps);
  dM = ((dM % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const d = EQUINOX_DAY + (dM / (2 * Math.PI)) * YEAR;
  return d > YEAR ? d - YEAR : d;
}
/** Solar declination (degrees) at longitude λ. */
export const declination = (o: Orbit, lam: number) => Math.asin(Math.sin(o.obl * D) * Math.sin(lam * D)) / D;
/** Earth–Sun distance in units of the semi-major axis. */
export const distance = (o: Orbit, lam: number) => (1 - o.e * o.e) / (1 + o.e * Math.cos(lam * D - (o.peri + 180) * D));
/** Hour angle of sunset (degrees, 0 = polar night, 180 = polar day). */
export function sunsetAngle(latDeg: number, decDeg: number): number {
  const c = -Math.tan(latDeg * D) * Math.tan(decDeg * D);
  if (Math.abs(latDeg) >= 90) return decDeg * Math.sign(latDeg) > 0 ? 180 : 0;
  return c >= 1 ? 0 : c <= -1 ? 180 : Math.acos(c) / D;
}
/** Day length in hours (sunrise to sunset of the Sun's centre, no refraction). */
export const dayLength = (o: Orbit, lat: number, lam: number) => (2 * sunsetAngle(lat, declination(o, lam))) / 15;
/** Daily-mean insolation (W/m²) at latitude `lat` (degrees) when the Sun is at longitude λ (degrees). */
export function dailyMean(o: Orbit, lat: number, lam: number): number {
  const dec = declination(o, lam) * D, p = lat * D, h0 = sunsetAngle(lat, dec / D) * D, r = distance(o, lam);
  const q = (o.S0 / Math.PI / (r * r)) * (h0 * Math.sin(p) * Math.sin(dec) + Math.cos(p) * Math.cos(dec) * Math.sin(h0));
  return Math.max(0, q);
}
/** Instantaneous insolation (W/m²) at local apparent solar time `hours` (12 = noon). */
export function instant(o: Orbit, lat: number, lam: number, hours: number): number {
  const dec = declination(o, lam) * D, p = lat * D, h = (hours - 12) * 15 * D, r = distance(o, lam);
  const cz = Math.sin(p) * Math.sin(dec) + Math.cos(p) * Math.cos(dec) * Math.cos(h);
  return cz > 0 ? (o.S0 * cz) / (r * r) : 0;
}

/** Daily-mean insolation over a latitude × day grid (rows = latitudes). */
export function grid(o: Orbit, lats: number[], days: number[]): number[][] {
  const lams = days.map((d) => lambdaOfDay(o, d));
  return lats.map((lat) => lams.map((l) => dailyMean(o, lat, l)));
}

/** The Sun's longitude at `n` evenly spaced instants of the year (the middles of n equal steps from day 0). */
export function yearLambdas(o: Orbit, n = 1460): Float64Array {
  const out = new Float64Array(n), dt = YEAR / n;
  for (let k = 0; k < n; k++) out[k] = lambdaOfDay(o, (k + 0.5) * dt);
  return out;
}

export type HalfYears = {
  annualMean: number; summerMean: number; winterMean: number;
  /** Totals over each half-year in GJ/m². */
  summerGJ: number; winterGJ: number; annualGJ: number;
  /** Calendar days where the caloric summer starts and ends. */
  summerStart: number; summerEnd: number;
  /** Energy received on days with a daily mean at or above `threshold`, GJ/m², and how many days. */
  aboveGJ: number; aboveDays: number;
};
/**
 * Annual mean, Milankovitch's caloric half-years (the half of the year, in time, with the most insolation, and the
 * other half) and the energy over days above a threshold (Huybers 2006), from `n` evenly spaced instants in the year.
 */
export function halfYears(o: Orbit, lat: number, threshold = 275, n = 1460, lams = yearLambdas(o, n)): HalfYears {
  n = lams.length;
  const q = new Float64Array(n), dt = YEAR / n;
  for (let k = 0; k < n; k++) q[k] = dailyMean(o, lat, lams[k]);
  let total = 0, above = 0, aboveN = 0;
  for (let k = 0; k < n; k++) { total += q[k]; if (q[k] >= threshold) { above += q[k]; aboveN++; } }
  const half = n / 2;
  let s = 0; for (let k = 0; k < half; k++) s += q[k];
  let best = s, bi = 0;
  for (let k = 1; k < n; k++) { s += q[(k + half - 1) % n] - q[k - 1]; if (s > best + 1e-9 * Math.abs(best)) { best = s; bi = k; } }
  const sec = dt * 86400 / 1e9;
  return {
    annualMean: total / n, summerMean: best / half, winterMean: (total - best) / half,
    summerGJ: best * sec, winterGJ: (total - best) * sec, annualGJ: total * sec,
    summerStart: bi * dt, summerEnd: ((bi + half) % n) * dt,
    aboveGJ: above * sec, aboveDays: aboveN * dt,
  };
}

/** Global and annual mean insolation, S0 / (4 √(1 − e²)). */
export const globalMean = (o: Orbit) => o.S0 / (4 * Math.sqrt(1 - o.e * o.e));
/** Climatic precession index e·sin ϖ. */
export const precessionIndex = (o: Orbit) => o.e * Math.sin(o.peri * D);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const LEN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
/** "21 Jun" for calendar day 172 (a 365-day year; fractional days round down; day 0 and 365+ wrap). */
export function dateOf(day: number): string {
  let d = Math.floor(day);
  d = ((d - 1) % 365 + 365) % 365;
  let m = 0; while (d >= LEN[m]) { d -= LEN[m]; m++; }
  return `${d + 1} ${MONTHS[m]}`;
}
