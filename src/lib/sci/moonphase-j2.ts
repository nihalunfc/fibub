// Moon phase simulator maths (#1227): the Sun-Moon angle (elongation) gives the Moon's age, how much of its face is
// lit, the phase name, the Indian tithi and paksha, and rough rise and set times. A date gives the mean phase from a
// reference new moon. Mean motion only: real phases can be up to about half a day earlier or later.

export const SYNODIC = 29.530588853;   // days, new moon to new moon (mean)
export const SIDEREAL = 27.321661;     // days, once round against the stars (mean)
/** Julian Day of the mean new moon of 2000 January 6, 18:14 TT (Meeus, Astronomical Algorithms, ch. 49, k = 0). */
export const NEW_MOON_JD = 2451550.09766;

const norm = (a: number) => ((a % 360) + 360) % 360;

/** Age in days since new moon, for an elongation in degrees (0 new, 90 first quarter, 180 full, 270 last quarter). */
export const ageOf = (theta: number) => (norm(theta) / 360) * SYNODIC;
export const thetaOfAge = (age: number) => norm((age / SYNODIC) * 360);

/** Fraction of the Moon's face that is lit, 0 to 1. */
export const litFraction = (theta: number) => (1 - Math.cos((norm(theta) * Math.PI) / 180)) / 2;

export const waxing = (theta: number) => { const t = norm(theta); return t > 0 && t < 180; };

/** The phase name; the four main phases get a window of ±6° (about half a day). */
export function phaseName(theta: number): string {
  const t = norm(theta), near = (c: number) => Math.min(Math.abs(t - c), 360 - Math.abs(t - c)) < 6;
  if (near(0)) return 'New moon';
  if (near(90)) return 'First quarter';
  if (near(180)) return 'Full moon';
  if (near(270)) return 'Last quarter';
  if (t < 90) return 'Waxing crescent';
  if (t < 180) return 'Waxing gibbous';
  if (t < 270) return 'Waning gibbous';
  return 'Waning crescent';
}

/** Tithi: each 12° the Moon gains on the Sun is one tithi (1 to 30). Shukla paksha is 1 to 15 (Purnima at 15),
 *  Krishna paksha 16 to 30 (Amavasya at 30). */
export function tithi(theta: number): { n: number; paksha: 'Shukla' | 'Krishna'; inPaksha: number; name: string } {
  const n = Math.min(30, Math.floor(norm(theta) / 12) + 1), paksha = n <= 15 ? 'Shukla' : 'Krishna', inPaksha = n <= 15 ? n : n - 15;
  const names = ['Pratipada', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dvadashi', 'Trayodashi', 'Chaturdashi'];
  const name = n === 15 ? 'Purnima' : n === 30 ? 'Amavasya' : names[inPaksha - 1];
  return { n, paksha, inPaksha, name };
}

/** Rough moonrise and moonset, hours of local solar time (new moon rises with the Sun at 6:00 and sets at 18:00;
 *  each day it is 24/29.53 h, about 49 minutes, later). Ignores the seasons and the Moon's tilted path. */
export function riseSet(theta: number): { rise: number; set: number; lagMin: number } {
  const shift = (norm(theta) / 360) * 24;
  return { rise: (6 + shift) % 24, set: (18 + shift) % 24, lagMin: (24 * 60) / SYNODIC };
}

export const clock = (h: number) => { const m = Math.round(h * 60) % 1440; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };

/** Julian Day from a JavaScript time in milliseconds (UTC). */
export const jdOf = (ms: number) => ms / 86400000 + 2440587.5;

/** Mean Moon age in days at a time (ms, UTC). */
export const meanAge = (ms: number) => { const d = (jdOf(ms) - NEW_MOON_JD) % SYNODIC; return d < 0 ? d + SYNODIC : d; };

/** The SVG path of the lit part of a Moon disc of radius r centred at (0, 0), as seen from the northern hemisphere
 *  (waxing Moon lit on the right). */
export function litPath(theta: number, r: number): string {
  const t = norm(theta), c = Math.cos((t * Math.PI) / 180), rx = Math.abs(c) * r;
  if (t < 0.01 || t > 359.99) return '';
  if (t < 180) return `M0 ${-r}A${r} ${r} 0 0 1 0 ${r}A${rx} ${r} 0 0 ${c > 0 ? 0 : 1} 0 ${-r}Z`;
  return `M0 ${-r}A${r} ${r} 0 0 0 0 ${r}A${rx} ${r} 0 0 ${c > 0 ? 1 : 0} 0 ${-r}Z`;
}
