// Plain maths for the school tools added for the United States map (Common Core maths, NGSS science).
// No DOM, so tests/sci.mjs can check every function against worked examples. Teaching models, not lab-grade code.
import { normCdf } from '../sci/stats.ts';

// ---- Statistics (CCSS S-ID, S-IC) ----------------------------------------------------------------------------
const sorted = (xs: number[]) => [...xs].sort((a, b) => a - b);
export const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
export const median = (s: number[]) => { const n = s.length, m = n >> 1; return n % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
/** Sample standard deviation (n - 1). */
export const sd = (xs: number[]) => { const m = mean(xs); return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1)); };

/**
 * Five-number summary the way US textbooks teach it: Q1 and Q3 are the medians of the lower and upper halves
 * (the middle value is left out of both halves when the count is odd). Outliers lie beyond 1.5 × IQR from the quartiles.
 */
export function fiveNumber(xs: number[]) {
  const s = sorted(xs), n = s.length, half = n >> 1;
  const lower = s.slice(0, half), upper = s.slice(n % 2 ? half + 1 : half);
  const q1 = median(lower), q3 = median(upper), iqr = q3 - q1, lo = q1 - 1.5 * iqr, hi = q3 + 1.5 * iqr;
  const inside = s.filter((x) => x >= lo && x <= hi);
  return { min: s[0], q1, median: median(s), q3, max: s[n - 1], iqr, lowFence: lo, highFence: hi, outliers: s.filter((x) => x < lo || x > hi), whiskerLow: inside[0], whiskerHigh: inside[inside.length - 1] };
}

/** Share of a normal distribution below x (mean mu, standard deviation sigma). */
export const normalBelow = (x: number, mu: number, sigma: number) => normCdf((x - mu) / sigma);
export const zScore = (x: number, mu: number, sigma: number) => (x - mu) / sigma;
/** Share within k standard deviations of the mean: 68, 95 and 99.7 % for k = 1, 2, 3. */
export const withinK = (k: number) => normCdf(k) - normCdf(-k);

/** Least-squares line through (x, y) pairs, with Pearson's r and r². */
export function fitLine(pts: [number, number][]) {
  const n = pts.length, mx = mean(pts.map((p) => p[0])), my = mean(pts.map((p) => p[1]));
  let sxx = 0, sxy = 0, syy = 0;
  for (const [x, y] of pts) { sxx += (x - mx) ** 2; sxy += (x - mx) * (y - my); syy += (y - my) ** 2; }
  const slope = sxy / sxx, intercept = my - slope * mx, r = sxy / Math.sqrt(sxx * syy);
  const residuals = pts.map(([x, y]) => y - (intercept + slope * x));
  return { n, slope, intercept, r, r2: r * r, residuals, sse: residuals.reduce((a, e) => a + e * e, 0) };
}
/** Sum of squared residuals for a line you drew yourself, to compare with the best-fit line. */
export const sseFor = (pts: [number, number][], slope: number, intercept: number) => pts.reduce((a, [x, y]) => a + (y - (intercept + slope * x)) ** 2, 0);

/** 95 % margin of error for a sample proportion p̂ from n people (the simple p̂ ± 1.96 √(p̂(1 - p̂)/n) rule). */
export const marginOfError = (p: number, n: number, z = 1.96) => z * Math.sqrt(p * (1 - p) / n);
/** Sample size that gives a wanted margin of error (worst case p = 0.5). */
export const sampleSizeFor = (moe: number, z = 1.96) => Math.ceil((z / (2 * moe)) ** 2);

// ---- Geometry (CCSS G-CO, 8.G) -------------------------------------------------------------------------------
export type Pt = [number, number];
export const translate = (p: Pt[], dx: number, dy: number): Pt[] => p.map(([x, y]) => [x + dx, y + dy]);
/** Rotate about (cx, cy) by degrees, counter-clockwise. */
export const rotate = (p: Pt[], deg: number, cx = 0, cy = 0): Pt[] => {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  return p.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]);
};
export const reflect = (p: Pt[], axis: 'x' | 'y' | 'y=x'): Pt[] => p.map(([x, y]) => (axis === 'x' ? [x, -y] : axis === 'y' ? [-x, y] : [y, x]));
/** Dilate about (cx, cy) by scale factor k. */
export const dilate = (p: Pt[], k: number, cx = 0, cy = 0): Pt[] => p.map(([x, y]) => [cx + k * (x - cx), cy + k * (y - cy)]);
export const area = (p: Pt[]) => Math.abs(p.reduce((a, [x, y], i) => { const [x2, y2] = p[(i + 1) % p.length]; return a + x * y2 - x2 * y; }, 0)) / 2;
export const perimeter = (p: Pt[]) => p.reduce((a, [x, y], i) => { const [x2, y2] = p[(i + 1) % p.length]; return a + Math.hypot(x2 - x, y2 - y); }, 0);

// ---- Earth and space (NGSS MS-ESS1-1) --------------------------------------------------------------------------
/** Sun's declination (degrees) on a day of the year: ±23.44° swing, zero at the March equinox (about day 80). */
export const declination = (day: number, tilt = 23.44) => tilt * Math.sin(2 * Math.PI * (day - 80) / 365);
/** Hours of daylight at latitude (degrees) on a day of the year; 0 or 24 in polar night and midnight sun. */
export function daylightHours(lat: number, day: number, tilt = 23.44) {
  const x = -Math.tan(lat * Math.PI / 180) * Math.tan(declination(day, tilt) * Math.PI / 180);
  return x >= 1 ? 0 : x <= -1 ? 24 : 2 * Math.acos(x) * 180 / Math.PI / 15;
}
/** Sun's height above the horizon at noon, in degrees (negative: it stays below the horizon). */
export const noonElevation = (lat: number, day: number, tilt = 23.44) => 90 - Math.abs(lat - declination(day, tilt));

// ---- Chemistry and heat (NGSS HS-PS1-7, MS-PS3-4) ----------------------------------------------------------------
export const MOLAR: Record<string, number> = { H2: 2.016, O2: 31.998, H2O: 18.015, N2: 28.014, NH3: 17.031, CH4: 16.043, CO2: 44.009, Mg: 24.305, MgO: 40.304 };
export type Reaction = { name: string; a: string; ca: number; b: string; cb: number; p: string; cp: number; eq: string };
export const REACTIONS: Reaction[] = [
  { name: 'Making water', a: 'H2', ca: 2, b: 'O2', cb: 1, p: 'H2O', cp: 2, eq: '2 H₂ + O₂ → 2 H₂O' },
  { name: 'Making ammonia', a: 'N2', ca: 1, b: 'H2', cb: 3, p: 'NH3', cp: 2, eq: 'N₂ + 3 H₂ → 2 NH₃' },
  { name: 'Burning methane', a: 'CH4', ca: 1, b: 'O2', cb: 2, p: 'CO2', cp: 1, eq: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O' },
  { name: 'Burning magnesium', a: 'Mg', ca: 2, b: 'O2', cb: 1, p: 'MgO', cp: 2, eq: '2 Mg + O₂ → 2 MgO' },
];
/** Limiting reagent from grams of A and B: which runs out, the most product, and the leftover of the other. */
export function limiting(rx: Reaction, gA: number, gB: number) {
  const nA = gA / MOLAR[rx.a], nB = gB / MOLAR[rx.b];
  const extentA = nA / rx.ca, extentB = nB / rx.cb, ext = Math.min(extentA, extentB), aLimits = extentA <= extentB;
  const leftoverMol = aLimits ? nB - ext * rx.cb : nA - ext * rx.ca;
  const leftSpecies = aLimits ? rx.b : rx.a;
  return { nA, nB, limiter: aLimits ? rx.a : rx.b, productMol: ext * rx.cp, productG: ext * rx.cp * MOLAR[rx.p], leftSpecies, leftoverG: leftoverMol * MOLAR[leftSpecies] };
}
/** Heat in joules for mass (g), specific heat (J/g°C) and temperature change (°C). */
export const heatQ = (m: number, c: number, dT: number) => m * c * dT;
/** Final temperature when two bodies at T1 and T2 share heat with no loss. */
export const mixTemp = (m1: number, c1: number, t1: number, m2: number, c2: number, t2: number) => (m1 * c1 * t1 + m2 * c2 * t2) / (m1 * c1 + m2 * c2);
/** Specific heat of a hot metal dropped into cooler water, from the final temperature. */
export const metalSpecificHeat = (mWater: number, tWater: number, mMetal: number, tMetal: number, tFinal: number, cWater = 4.184) => mWater * cWater * (tFinal - tWater) / (mMetal * (tMetal - tFinal));
export const SPECIFIC_HEAT: Record<string, number> = { Water: 4.184, Aluminium: 0.897, Iron: 0.449, Copper: 0.385, Lead: 0.129 };
