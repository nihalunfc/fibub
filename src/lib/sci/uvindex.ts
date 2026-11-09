// Clear-sky UV index estimate. The Sun's position comes from the NOAA solar calculator equations (after Meeus,
// Astronomical Algorithms), the clear-sky UV index from Madronich's analytic formula
// UVI = a · μ^b · (Ω/300)^c with μ the cosine of the solar zenith angle and Ω the total ozone column in Dobson
// units (Madronich 2007: a = 12.5, b = 2.42, c = −1.23), then multiplied by simple editable factors for
// height, ground reflection, clouds and the Earth–Sun distance. An estimate only. Plain TypeScript, no DOM.

const RAD = Math.PI / 180;
const mod = (x: number, m: number) => ((x % m) + m) % m;

/** Julian day for a UTC time given as calendar date plus hours (0–24, may run past). */
export function julianDay(y: number, m: number, d: number, hoursUT = 0): number {
  return Date.UTC(y, m - 1, d) / 864e5 + 2440587.5 + hoursUT / 24;
}

export type SunPos = { zenith: number; mu: number; decl: number; eotMin: number; r: number; hourAngle: number };
/** Solar zenith angle (degrees, geometric, no refraction), declination, equation of time (minutes) and the
 *  Earth–Sun distance (AU) at a UTC moment. NOAA equations, good to about 0.01° for 1900–2100. */
export function sunPosition(jd: number, lat: number, lon: number): SunPos {
  const T = (jd - 2451545) / 36525;
  const L0 = mod(280.46646 + T * (36000.76983 + T * 0.0003032), 360);
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const C = Math.sin(M * RAD) * (1.914602 - T * (0.004817 + 0.000014 * T)) + Math.sin(2 * M * RAD) * (0.019993 - 0.000101 * T) + Math.sin(3 * M * RAD) * 0.000289;
  const trueLong = L0 + C, trueAnom = M + C;
  const r = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(trueAnom * RAD));
  const omega = 125.04 - 1934.136 * T;
  const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(omega * RAD);
  const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
  const eps = eps0 + 0.00256 * Math.cos(omega * RAD);
  const decl = Math.asin(Math.sin(eps * RAD) * Math.sin(lambda * RAD)) / RAD;
  const yy = Math.tan((eps / 2) * RAD) ** 2;
  const eot = 4 / RAD * (yy * Math.sin(2 * L0 * RAD) - 2 * e * Math.sin(M * RAD) + 4 * e * yy * Math.sin(M * RAD) * Math.cos(2 * L0 * RAD)
    - 0.5 * yy * yy * Math.sin(4 * L0 * RAD) - 1.25 * e * e * Math.sin(2 * M * RAD));
  const minUT = mod((jd - 0.5) * 1440, 1440);
  const tst = mod(minUT + eot + 4 * lon, 1440);
  const ha = tst / 4 - 180;
  const mu = Math.sin(lat * RAD) * Math.sin(decl * RAD) + Math.cos(lat * RAD) * Math.cos(decl * RAD) * Math.cos(ha * RAD);
  const muc = Math.max(-1, Math.min(1, mu));
  return { zenith: Math.acos(muc) / RAD, mu: muc, decl, eotMin: eot, r, hourAngle: ha };
}

export type UvModel = {
  /** Madronich's constants: UVI = a · μ^b · (Ω/300)^c. */
  a: number; b: number; c: number;
  /** Total ozone column (Dobson units). */
  ozone: number;
  /** Height above sea level (km) and the fractional rise per km. */
  altKm: number; perKm: number;
  /** Ground UV albedo (0–1) and the sky's reflectance back down (spherical albedo); factor 1/(1 − A·s). */
  albedo: number; skyRefl: number;
  /** Cloud modification factor (1 = clear sky). */
  cmf: number;
  /** Divide by r² (Earth–Sun distance in AU). */
  distance: boolean;
};
export const DEFAULT_MODEL: UvModel = { a: 12.5, b: 2.42, c: -1.23, ozone: 300, altKm: 0, perKm: 0.07, albedo: 0, skyRefl: 0.3, cmf: 1, distance: true };

export type UvFactors = { clear: number; alt: number; ground: number; cloud: number; dist: number; total: number };
/** The UV index for a given μ (cos zenith) and Earth–Sun distance, with each factor shown. */
export function uvIndex(mu: number, r: number, m: UvModel): UvFactors {
  const clear = mu > 0 ? m.a * mu ** m.b * (m.ozone / 300) ** m.c : 0;
  const alt = Math.max(0, 1 + m.perKm * m.altKm);
  const ground = 1 / (1 - Math.min(0.99, Math.max(0, m.albedo) * Math.max(0, m.skyRefl)));
  const cloud = Math.max(0, m.cmf);
  const dist = m.distance ? 1 / (r * r) : 1;
  return { clear, alt, ground, cloud, dist, total: clear * alt * ground * cloud * dist };
}

/** 1 UV index unit = 0.025 W/m² of erythemally weighted irradiance. 1 SED = 100 J/m². */
export const W_PER_UVI = 0.025;
export const J_PER_SED = 100;
/** Minutes to receive `sed` standard erythemal doses at a steady UV index. */
export const minutesToDose = (uvi: number, sed: number) => (uvi > 0 ? (sed * J_PER_SED) / (uvi * W_PER_UVI * 60) : Infinity);

/** WHO UV index bands. */
export function band(uvi: number): { name: string; level: 0 | 1 | 2 | 3 | 4 } {
  const u = Math.round(uvi * 10) / 10;
  if (u < 3) return { name: 'Low', level: 0 };
  if (u < 6) return { name: 'Moderate', level: 1 };
  if (u < 8) return { name: 'High', level: 2 };
  if (u < 11) return { name: 'Very high', level: 3 };
  return { name: 'Extreme', level: 4 };
}

export type Place = { lat: number; lon: number; utcOffset: number };
/** UTC moment (as Julian day) for a local clock time. */
export const jdLocal = (y: number, m: number, d: number, localH: number, utcOffset: number) => julianDay(y, m, d, localH - utcOffset);

export type DayCurve = {
  /** Local clock hours (0..24 step 1 min) and the UV index at each. */
  t: number[]; uvi: number[]; zen: number[];
  peak: { t: number; uvi: number; zenith: number };
  /** Solar noon in local clock hours. */
  noon: number;
  /** Erythemal dose over the whole day, J/m². */
  doseJ: number;
  /** Periods (local hours) with UVI at or above each threshold. */
  above: { level: number; from: number; to: number; hours: number }[];
};

/** The UV index through one local day, every minute, with the peak at solar noon. */
export function dayCurve(y: number, m: number, d: number, p: Place, model: UvModel): DayCurve {
  const t: number[] = [], uvi: number[] = [], zen: number[] = [];
  for (let i = 0; i <= 1440; i++) {
    const h = i / 60, s = sunPosition(jdLocal(y, m, d, h, p.utcOffset), p.lat, p.lon);
    t.push(h); uvi.push(uvIndex(s.mu, s.r, model).total); zen.push(s.zenith);
  }
  // Solar noon: hour angle 0, refined twice (the equation of time barely moves in a day).
  let noon = 12 - p.lon / 15 + p.utcOffset;
  for (let k = 0; k < 3; k++) { const s = sunPosition(jdLocal(y, m, d, noon, p.utcOffset), p.lat, p.lon); noon -= (mod(s.hourAngle + 180, 360) - 180) / 15; }
  const sn = sunPosition(jdLocal(y, m, d, noon, p.utcOffset), p.lat, p.lon);
  const peak = { t: noon, uvi: uvIndex(sn.mu, sn.r, model).total, zenith: sn.zenith };
  let doseJ = 0;
  for (let i = 1; i < t.length; i++) doseJ += ((uvi[i] + uvi[i - 1]) / 2) * W_PER_UVI * 60;
  const above = [3, 6, 8, 11].map((level) => {
    let from = NaN, to = NaN, mins = 0;
    for (let i = 1; i < t.length; i++) {
      const a = uvi[i - 1], b = uvi[i];
      if (a < level && b >= level) from = t[i - 1] + ((level - a) / (b - a)) / 60;
      if (a >= level && b < level) to = t[i - 1] + ((a - level) / (a - b)) / 60;
      if (a >= level && b >= level) mins += 1;
      else if (a >= level || b >= level) mins += a >= level ? (a - level) / (a - b) : (b - level) / (b - a);
    }
    if (uvi[0] >= level && Number.isNaN(from)) from = 0;
    if (uvi[uvi.length - 1] >= level && Number.isNaN(to)) to = 24;
    return { level, from, to, hours: mins / 60 };
  });
  return { t, uvi, zen, peak, noon, doseJ, above };
}

/** Minutes from a start time (local hours) until the dose `sed` is reached on the day's curve; Infinity if never. */
export function minutesToDoseFrom(curve: DayCurve, startH: number, sed: number): number {
  const target = sed * J_PER_SED;
  let acc = 0;
  const { t, uvi } = curve;
  const at = (h: number) => { const i = Math.min(t.length - 2, Math.max(0, Math.floor(h * 60))); const f = h * 60 - i; return uvi[i] + (uvi[i + 1] - uvi[i]) * f; };
  let h = startH;
  const step = 1 / 60;
  while (h < 24) {
    const h2 = Math.min(24, Math.floor(h * 60 + 1e-9) / 60 + step);
    const u1 = at(h), u2 = at(h2), dt = (h2 - h) * 3600;
    const add = ((u1 + u2) / 2) * W_PER_UVI * dt;
    if (acc + add >= target) {
      // Solve inside this piece (dose rate linear in time).
      const r0 = u1 * W_PER_UVI, r1 = u2 * W_PER_UVI, need = target - acc, k = (r1 - r0) / dt;
      const s = Math.abs(k) < 1e-15 ? need / r0 : (-r0 + Math.sqrt(r0 * r0 + 2 * k * need)) / k;
      return (h - startH) * 60 + s / 60;
    }
    acc += add; h = h2;
  }
  return Infinity;
}

/** "13:05" from local clock hours. */
export function clock(h: number): string {
  if (!Number.isFinite(h)) return '–';
  let m = Math.round(h * 60);
  m = mod(m, 1440);
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}
