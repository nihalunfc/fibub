// Grain-size statistics from sieve data: the cumulative curve, percentiles by linear interpolation in φ,
// Folk and Ward (1957) graphic measures with their verbal classes, the method of moments (arithmetic,
// geometric and logarithmic, as written out by Blott and Pye 2001 for GRADISTAT) and Udden-Wentworth class
// percentages. φ = −log2(d / 1 mm). Plain TypeScript, no DOM.

export const phiOf = (mm: number) => -Math.log2(mm);
export const mmOf = (phi: number) => Math.pow(2, -phi);

/** One sieve: the φ of its opening and the mass retained on it. The pan is a sieve with φ = Infinity. */
export type Sieve = { phi: number; mass: number };
/** One size class: φ from (coarse) to (fine), weight %. */
export type Klass = { from: number; to: number; mid: number; pct: number; pan?: boolean };

export type Analysis = {
  total: number;
  classes: Klass[];
  /** The cumulative curve: φ and cumulative weight % coarser, from 0 to 100. */
  curve: { phi: number[]; cum: number[] };
  pctl: (p: number) => number;
  /** φ at the percentiles Folk and Ward use. */
  P: Record<5 | 10 | 16 | 25 | 50 | 75 | 84 | 90 | 95, number>;
  fw: { mean: number; sorting: number; skew: number; kurt: number };
  mom: {
    arith: { mean: number; sd: number; skew: number; kurt: number };
    geo: { mean: number; sd: number; skew: number; kurt: number };
    log: { mean: number; sd: number; skew: number; kurt: number };
  };
  /** Weight % finer than the finest sieve plus coarser than the coarsest: how much of the curve is assumed. */
  openPan: number; openTop: number;
};

/**
 * Analyse one sample. `sieves` are the sieves (any order) with their retained masses, `pan` the mass that passed
 * the finest sieve. The coarsest class is taken to reach `topW` φ coarser than the top sieve and the pan class
 * `panW` φ finer than the finest sieve; mass in those two open classes is spread evenly across them.
 */
export function analyse(sieves: Sieve[], pan: number, topW = 1, panW = 1): Analysis | { error: string } {
  const s = sieves.filter((x) => Number.isFinite(x.phi)).sort((a, b) => a.phi - b.phi);
  if (s.length < 2) return { error: 'Type at least two sieves.' };
  for (let i = 1; i < s.length; i++) if (s[i].phi - s[i - 1].phi < 1e-9) return { error: 'Two sieves have the same size.' };
  if (s.some((x) => !(x.mass >= 0)) || !(pan >= 0)) return { error: 'Masses must be zero or more.' };
  const total = s.reduce((a, x) => a + x.mass, 0) + pan;
  if (!(total > 0)) return { error: 'The masses add up to zero.' };
  if (!(topW > 0 && panW > 0)) return { error: 'The open-class widths must be above zero.' };
  const classes: Klass[] = s.map((x, i) => {
    const from = i ? s[i - 1].phi : x.phi - topW;
    return { from, to: x.phi, mid: (from + x.phi) / 2, pct: (x.mass / total) * 100 };
  });
  const last = s[s.length - 1].phi;
  if (pan > 0) classes.push({ from: last, to: last + panW, mid: last + panW / 2, pct: (pan / total) * 100, pan: true });
  const phi = [classes[0].from], cum = [0];
  let c = 0;
  for (const k of classes) { c += k.pct; phi.push(k.to); cum.push(c); }
  cum[cum.length - 1] = 100;
  const pctl = (p: number) => {
    for (let j = 0; j < cum.length - 1; j++) {
      if (cum[j + 1] >= p && cum[j + 1] > cum[j]) {
        if (cum[j] >= p) return phi[j];
        return phi[j] + ((p - cum[j]) / (cum[j + 1] - cum[j])) * (phi[j + 1] - phi[j]);
      }
    }
    return phi[phi.length - 1];
  };
  const P = Object.fromEntries([5, 10, 16, 25, 50, 75, 84, 90, 95].map((p) => [p, pctl(p)])) as Analysis['P'];
  const fw = folkWard(P);
  const f = classes.map((k) => k.pct / 100);
  const mphi = classes.map((k) => k.mid);
  const mom = (m: number[]) => {
    const mean = m.reduce((a, x, i) => a + f[i] * x, 0);
    const m2 = m.reduce((a, x, i) => a + f[i] * (x - mean) ** 2, 0), sd = Math.sqrt(m2);
    const m3 = m.reduce((a, x, i) => a + f[i] * (x - mean) ** 3, 0), m4 = m.reduce((a, x, i) => a + f[i] * (x - mean) ** 4, 0);
    return { mean, sd, skew: m3 / sd ** 3, kurt: m4 / sd ** 4 };
  };
  const log = mom(mphi);
  const arithMm = mom(mphi.map(mmOf));
  // Geometric moments: logs of the class mid-points (the geometric mid-point of each class in mm).
  const g = mom(mphi.map((x) => Math.log(mmOf(x))));
  const geo = { mean: Math.exp(g.mean), sd: Math.exp(g.sd), skew: g.skew, kurt: g.kurt };
  return {
    total, classes, curve: { phi, cum }, pctl, P, fw,
    mom: { arith: arithMm, geo, log },
    openTop: classes[0].pct,
    openPan: pan > 0 ? (pan / total) * 100 : 0,
  };
}

/** Folk and Ward (1957) graphic measures, in φ. */
export function folkWard(P: Record<number, number>) {
  return {
    mean: (P[16] + P[50] + P[84]) / 3,
    sorting: (P[84] - P[16]) / 4 + (P[95] - P[5]) / 6.6,
    skew: (P[16] + P[84] - 2 * P[50]) / (2 * (P[84] - P[16])) + (P[5] + P[95] - 2 * P[50]) / (2 * (P[95] - P[5])),
    kurt: (P[95] - P[5]) / (2.44 * (P[75] - P[25])),
  };
}

/** Folk and Ward (1957) verbal classes. Limits are the published ones; a value on a limit takes the upper class. */
export function sortingClass(s: number) {
  return s < 0.35 ? 'very well sorted' : s < 0.5 ? 'well sorted' : s < 0.71 ? 'moderately well sorted' : s < 1 ? 'moderately sorted' : s < 2 ? 'poorly sorted' : s < 4 ? 'very poorly sorted' : 'extremely poorly sorted';
}
export function skewClass(k: number) {
  return k > 0.3 ? 'strongly fine skewed' : k > 0.1 ? 'fine skewed' : k >= -0.1 ? 'symmetrical' : k >= -0.3 ? 'coarse skewed' : 'strongly coarse skewed';
}
export function kurtClass(k: number) {
  return k < 0.67 ? 'very platykurtic' : k < 0.9 ? 'platykurtic' : k < 1.11 ? 'mesokurtic' : k < 1.5 ? 'leptokurtic' : k < 3 ? 'very leptokurtic' : 'extremely leptokurtic';
}

/** Udden-Wentworth classes, coarse to fine, as φ ranges [from, to). */
export const WENTWORTH: { name: string; from: number; to: number; group: 'gravel' | 'sand' | 'mud' }[] = [
  { name: 'Boulders', from: -Infinity, to: -8, group: 'gravel' },
  { name: 'Cobbles', from: -8, to: -6, group: 'gravel' },
  { name: 'Pebbles', from: -6, to: -2, group: 'gravel' },
  { name: 'Granules', from: -2, to: -1, group: 'gravel' },
  { name: 'Very coarse sand', from: -1, to: 0, group: 'sand' },
  { name: 'Coarse sand', from: 0, to: 1, group: 'sand' },
  { name: 'Medium sand', from: 1, to: 2, group: 'sand' },
  { name: 'Fine sand', from: 2, to: 3, group: 'sand' },
  { name: 'Very fine sand', from: 3, to: 4, group: 'sand' },
  { name: 'Coarse silt', from: 4, to: 5, group: 'mud' },
  { name: 'Medium silt', from: 5, to: 6, group: 'mud' },
  { name: 'Fine silt', from: 6, to: 7, group: 'mud' },
  { name: 'Very fine silt', from: 7, to: 8, group: 'mud' },
  { name: 'Clay', from: 8, to: Infinity, group: 'mud' },
];
/** The Wentworth name for a size in φ. */
export const sizeName = (phi: number) => (WENTWORTH.find((w) => phi >= w.from && phi < w.to) ?? WENTWORTH[WENTWORTH.length - 1]).name.toLowerCase();

/** Cumulative % coarser than φ, read off the (piecewise linear) curve. */
export function cumAt(curve: { phi: number[]; cum: number[] }, x: number) {
  const { phi, cum } = curve;
  if (x <= phi[0]) return 0;
  if (x >= phi[phi.length - 1]) return 100;
  let j = 0;
  while (phi[j + 1] < x) j++;
  // phi is non-decreasing; equal neighbours are a step (never happens between distinct sieves).
  return phi[j + 1] === phi[j] ? cum[j + 1] : cum[j] + ((x - phi[j]) / (phi[j + 1] - phi[j])) * (cum[j + 1] - cum[j]);
}
/** Weight % in each Wentworth class, plus gravel, sand, silt, clay and mud totals. */
export function wentworth(curve: { phi: number[]; cum: number[] }) {
  const cls = WENTWORTH.map((w) => ({ name: w.name, group: w.group, pct: cumAt(curve, w.to) - cumAt(curve, w.from) }));
  const sum = (g: string) => cls.filter((c) => c.group === g).reduce((a, c) => a + c.pct, 0);
  return { cls, gravel: sum('gravel'), sand: sum('sand'), mud: sum('mud'), silt: cumAt(curve, 8) - cumAt(curve, 4), clay: 100 - cumAt(curve, 8) };
}

/** Read a sieve column: a size in mm, µm or φ, or the word "pan". Returns φ (Infinity for the pan) or NaN. */
export function sieveCell(s: string, unit: 'mm' | 'um' | 'phi', toNum: (s: string) => number): number {
  if (/^\s*(pan|<|receiver|bottom)/i.test(s)) return Infinity;
  const v = toNum(s);
  if (!Number.isFinite(v)) return NaN;
  if (unit === 'phi') return v;
  if (!(v > 0)) return NaN;
  return phiOf(unit === 'mm' ? v : v / 1000);
}
