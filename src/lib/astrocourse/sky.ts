// Sums for the astronomy course, Modules 1-3 (the naked-eye sky, coordinates and time, dark skies).
// Plain TypeScript with no DOM, checked by tests/astrocourse.mjs. Angles in degrees unless a name says otherwise.
// These are the simple textbook forms used to teach the idea; the observing tools use astronomy-engine for
// full precision.
export const D2R = Math.PI / 180, R2D = 180 / Math.PI;
const sin = (d: number) => Math.sin(d * D2R), cos = (d: number) => Math.cos(d * D2R);
export const norm360 = (a: number) => ((a % 360) + 360) % 360;
export const norm24 = (h: number) => ((h % 24) + 24) % 24;

/** Altitude and azimuth (azimuth from north through east) of a star at hour angle H (degrees) and declination dec, seen from latitude lat. */
export function altAz(H: number, dec: number, lat: number) {
  const sa = sin(dec) * sin(lat) + cos(dec) * cos(lat) * cos(H);
  const alt = Math.asin(Math.max(-1, Math.min(1, sa))) * R2D;
  const az = norm360(Math.atan2(-cos(dec) * sin(H), sin(dec) * cos(lat) - cos(dec) * sin(lat) * cos(H)) * R2D);
  return { alt, az };
}
/** Highest altitude a star reaches (when it crosses the meridian). */
export const transitAlt = (dec: number, lat: number) => 90 - Math.abs(lat - dec);
/** Never sets (circumpolar), never rises, or rises and sets, from latitude lat. */
export function visibility(dec: number, lat: number): 'circumpolar' | 'never rises' | 'rises and sets' {
  if (lat >= 0 ? dec > 90 - lat : dec < -90 - lat) return 'circumpolar';
  if (lat >= 0 ? dec < lat - 90 : dec > 90 + lat) return 'never rises';
  return 'rises and sets';
}
/** Hours a star spends above the horizon each sidereal day (ignores refraction). */
export function hoursUp(dec: number, lat: number) {
  const c = -Math.tan(dec * D2R) * Math.tan(lat * D2R);
  if (c <= -1) return 24; if (c >= 1) return 0;
  return (2 * Math.acos(c) * R2D) / 15;
}

/** The Sun's declination on day n of the year (1 = 1 January), a simple cosine form good to about 1°. */
export const sunDec = (n: number) => -23.44 * Math.cos((2 * Math.PI * (n + 10)) / 365.25);
/** Day length in hours for the Sun's centre at declination dec (no refraction; real days are a few minutes longer). */
export const dayLength = (dec: number, lat: number) => hoursUp(dec, lat);
/** Sun's altitude at local solar noon. */
export const noonAlt = (dec: number, lat: number) => transitAlt(dec, lat);
/** Sun's altitude at a given local solar time (hours, 12 = noon). */
export const sunAltAt = (solarHour: number, dec: number, lat: number) => altAz((solarHour - 12) * 15, dec, lat).alt;
/** Solar hour (before noon) when the Sun's centre is at altitude h, or NaN if it never gets there. */
export function hourAtAlt(h: number, dec: number, lat: number) {
  const c = (sin(h) - sin(lat) * sin(dec)) / (cos(lat) * cos(dec));
  if (c < -1 || c > 1) return NaN;
  return 12 - (Math.acos(c) * R2D) / 15;
}

/** Fraction of the Moon's disc lit, for a phase angle (0 = new, 180 = full) as seen from Earth. */
export const litFraction = (elong: number) => (1 - cos(elong)) / 2;
export const SYNODIC_MONTH = 29.530589; // days, new Moon to new Moon
export const SIDEREAL_MONTH = 27.321662; // days, back to the same stars
/** Synodic period from two sidereal periods (days): 1/S = |1/P1 − 1/P2|. */
export const synodic = (p1: number, p2: number) => 1 / Math.abs(1 / p1 - 1 / p2);

/** Brightness ratio for a magnitude difference: m2 − m1 = dm means star 1 is 10^(0.4 dm) times brighter. */
export const fluxRatio = (dm: number) => 10 ** (0.4 * dm);
/** Magnitude difference for a flux ratio F1/F2: m1 − m2 = −2.5 log10(F1/F2). */
export const dMag = (ratio: number) => -2.5 * Math.log10(ratio);
/** Combined magnitude of two stars too close to separate. */
export const combinedMag = (m1: number, m2: number) => -2.5 * Math.log10(10 ** (-0.4 * m1) + 10 ** (-0.4 * m2));

// ---- Module 2: coordinates and time

/** Julian date at 0h UT plus the fraction of the day (Meeus, Astronomical Algorithms, ch. 7), Gregorian calendar. */
export function julianDate(y: number, m: number, d: number, hourUT = 0) {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5 + hourUT / 24;
}
export const mjd = (jd: number) => jd - 2400000.5;
/** Greenwich mean sidereal time in hours for a Julian date (IAU 1982 form, as in Meeus eq. 12.4). */
export function gmst(jd: number) {
  const T = (jd - 2451545) / 36525;
  return norm24((280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T - (T * T * T) / 38710000) / 15);
}
/** Local sidereal time in hours for an east-positive longitude. */
export const lstHours = (jd: number, lonEast: number) => norm24(gmst(jd) + lonEast / 15);
/** Hour angle in hours: LST − RA. */
export const hourAngle = (lst: number, ra: number) => norm24(lst - ra + 12) - 12;
export const SIDEREAL_DAY_H = 23.9344696; // hours of solar time per turn relative to the stars

export const OBLIQUITY = 23.4393; // degrees, J2000
/** Equatorial (RA hours, Dec degrees) to ecliptic longitude and latitude (degrees). */
export function toEcliptic(raH: number, dec: number, eps = OBLIQUITY) {
  const a = raH * 15;
  const lam = norm360(Math.atan2(sin(a) * cos(eps) + Math.tan(dec * D2R) * sin(eps), cos(a)) * R2D);
  const beta = Math.asin(sin(dec) * cos(eps) - cos(dec) * sin(eps) * sin(a)) * R2D;
  return { lam, beta };
}
/** Ecliptic to equatorial (RA hours, Dec degrees). */
export function fromEcliptic(lam: number, beta: number, eps = OBLIQUITY) {
  const ra = norm360(Math.atan2(sin(lam) * cos(eps) - Math.tan(beta * D2R) * sin(eps), cos(lam)) * R2D) / 15;
  const dec = Math.asin(sin(beta) * cos(eps) + cos(beta) * sin(eps) * sin(lam)) * R2D;
  return { ra, dec };
}
export const PRECESSION_ARCSEC_YR = 50.29; // general precession in ecliptic longitude
export const precessionPeriod = () => (360 * 3600) / PRECESSION_ARCSEC_YR;
/** Where the north celestial pole points in a given year, as RA/Dec of today's (J2000) sky. Simple model: the pole circles the ecliptic pole at 23.44°, ignoring the slow change of tilt. */
export function poleAt(year: number) {
  const dlam = ((year - 2000) * PRECESSION_ARCSEC_YR) / 3600;
  // The pole sits at ecliptic latitude 90 − ε, longitude 90° behind the vernal point, which slides back by dlam.
  return fromEcliptic(norm360(90 - dlam), 90 - OBLIQUITY);
}
/** Angle between two sky positions (RA hours, Dec degrees). */
export function separation(ra1: number, d1: number, ra2: number, d2: number) {
  const c = sin(d1) * sin(d2) + cos(d1) * cos(d2) * cos((ra1 - ra2) * 15);
  return Math.acos(Math.max(-1, Math.min(1, c))) * R2D;
}

/** Airmass: plane-parallel sec z, and Kasten and Young (1989) which stays finite at the horizon. */
export const airmassSec = (alt: number) => 1 / sin(alt);
export const airmassKY = (alt: number) => 1 / (sin(alt) + 0.50572 * (alt + 6.07995) ** -1.6364);
/** Magnitude after atmospheric extinction k (mag per airmass). */
export const extincted = (m0: number, k: number, X: number) => m0 + k * X;

// ---- Module 3: dark skies and your eyes

/** Rough naked-eye limiting magnitude from sky brightness in mag/arcsec² (a widely used fit after Schaefer 1990). */
export const nelm = (sqm: number) => 7.93 - 5 * Math.log10(10 ** (4.316 - sqm / 5) + 1);
/** Rough number of stars in the whole sky brighter than magnitude m (a teaching fit: about 4,800 at m = 6.5). */
export const starsBrighter = (m: number) => 10 ** (0.41 * m + 1.0);
/** Walker's law: sky glow from a town grows with population P and falls as distance^−2.5 (relative units). */
export const walker = (pop: number, km: number) => pop * km ** -2.5;
/** Seeing (arcsec) from the Fried parameter r0 (metres) at wavelength λ (metres): ≈ 0.98 λ / r0. */
export const seeingArcsec = (r0: number, lambda = 550e-9) => (0.98 * lambda / r0) * R2D * 3600;
/** Diffraction limit (Rayleigh, arcsec) of an aperture D (metres): 1.22 λ / D. */
export const rayleighArcsec = (D: number, lambda = 550e-9) => (1.22 * lambda / D) * R2D * 3600;
export const TWILIGHT = { civil: -6, nautical: -12, astronomical: -18 } as const;
/** Hours of full darkness (Sun below −18°) in a night, at latitude lat and solar declination dec. */
export function darkHours(dec: number, lat: number) {
  const h = hourAtAlt(-18, dec, lat);
  // Never crosses −18°: either dark all day (polar night) or never fully dark (summer far north).
  if (Number.isNaN(h)) return sunAltAt(0, dec, lat) < -18 ? 24 : 0;
  return 2 * h; // dark from (24 − h) in the evening to h in the morning
}

/** A small seeded random number generator (mulberry32), so made-up star fields look the same every visit. */
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** Approximate Bortle class from sky brightness (mag/arcsec²); the class is a description, so treat the edges as rough. */
export function bortle(sqm: number) {
  const edges = [21.99, 21.89, 21.69, 20.49, 19.5, 18.94, 18.38, 17.8];
  const i = edges.findIndex((e) => sqm >= e);
  return i < 0 ? 9 : i + 1;
}
/** Sun's right ascension (hours) and declination on day n, from a circular orbit (good to about 1-2°, for pictures). */
export function sunRaDec(n: number) {
  const lam = norm360((360 * (n - 80)) / 365.25);
  return fromEcliptic(lam, 0);
}
