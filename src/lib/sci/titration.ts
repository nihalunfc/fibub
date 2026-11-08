// Acid–base titration curves from the exact charge balance (any number of pKa values, strong or weak, acid or
// base analyte), equivalence points, indicator choice, and the end point of a measured curve by derivatives.

export const KW = 1e-14; // at 25 °C
export const STRONG = -20; // a pKa standing in for "fully dissociated"

export type Analyte = { kind: 'acid' | 'base'; pKa: number[]; conc: number; volume: number };
export type Titrant = { conc: number };

/** Fractions of each species: index i = number of protons lost from the fully protonated form. */
export function alphas(h: number, pKa: number[]): number[] {
  const Ka = pKa.map((p) => 10 ** -p), n = Ka.length;
  const terms: number[] = [];
  for (let i = 0; i <= n; i++) { let t = h ** (n - i); for (let j = 0; j < i; j++) t *= Ka[j]; terms.push(t); }
  const s = terms.reduce((a, b) => a + b, 0);
  return s > 0 && Number.isFinite(s) ? terms.map((t) => t / s) : terms.map((_, i) => (i === n ? 1 : 0));
}

/** Charge-balance residual for a trial [H+]. */
function balance(h: number, a: Analyte, t: Titrant, vt: number): number {
  const V = a.volume + vt, C = (a.conc * a.volume) / V, Ct = (t.conc * vt) / V, n = a.pKa.length;
  const z0 = a.kind === 'acid' ? 0 : n;
  const al = alphasSafe(h, a.pKa);
  let q = 0; al.forEach((x, i) => (q += x * (z0 - i)));
  const cation = a.kind === 'acid' ? Ct : 0, anion = a.kind === 'base' ? Ct : 0;
  return h + cation + C * q - KW / h - anion;
}
/** alphas computed in log space so pKa values far apart (or "strong") don't overflow. */
function alphasSafe(h: number, pKa: number[]): number[] {
  const n = pKa.length, lh = Math.log10(h), logs: number[] = [];
  for (let i = 0; i <= n; i++) { let l = (n - i) * lh; for (let j = 0; j < i; j++) l -= pKa[j]; logs.push(l); }
  const m = Math.max(...logs), e = logs.map((l) => 10 ** (l - m)), s = e.reduce((x, y) => x + y, 0);
  return e.map((x) => x / s);
}

/** pH after adding vt of titrant, by bisection on the charge balance (exact within activity-free theory). */
export function pHAt(a: Analyte, t: Titrant, vt: number): number {
  let lo = -2, hi = 16;
  for (let k = 0; k < 100; k++) { const mid = (lo + hi) / 2; if (balance(10 ** -mid, a, t, vt) > 0) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}

/** Number of titratable protons that show up as separate steps (strong ones merge into the first). */
export const equivalenceVolumes = (a: Analyte, t: Titrant) => a.pKa.map((_, i) => ((i + 1) * a.conc * a.volume) / t.conc);

export function curve(a: Analyte, t: Titrant, vmax: number, points = 400): { v: number[]; pH: number[] } {
  const v: number[] = [], pH: number[] = [];
  const veq = equivalenceVolumes(a, t);
  const xs = new Set<number>();
  for (let i = 0; i <= points; i++) xs.add((vmax * i) / points);
  for (const e of veq) for (let d = -0.02; d <= 0.02 + 1e-12; d += 0.002) { const x = e * (1 + d); if (x >= 0 && x <= vmax) xs.add(x); }
  for (const x of [...xs].sort((p, q) => p - q)) { v.push(x); pH.push(pHAt(a, t, x)); }
  return { v, pH };
}

export const INDICATORS: { name: string; from: number; to: number; colours: string }[] = [
  { name: 'Thymol blue (acid range)', from: 1.2, to: 2.8, colours: 'red to yellow' },
  { name: 'Methyl orange', from: 3.1, to: 4.4, colours: 'red to yellow' },
  { name: 'Bromocresol green', from: 3.8, to: 5.4, colours: 'yellow to blue' },
  { name: 'Methyl red', from: 4.4, to: 6.2, colours: 'red to yellow' },
  { name: 'Bromothymol blue', from: 6.0, to: 7.6, colours: 'yellow to blue' },
  { name: 'Phenol red', from: 6.8, to: 8.4, colours: 'yellow to red' },
  { name: 'Phenolphthalein', from: 8.2, to: 10.0, colours: 'colourless to pink' },
  { name: 'Thymolphthalein', from: 9.3, to: 10.5, colours: 'colourless to blue' },
  { name: 'Alizarin yellow R', from: 10.1, to: 12.0, colours: 'yellow to red' },
];

/** Indicators whose colour change falls inside the steep part of the curve around an equivalence point. */
export function indicatorsFor(a: Analyte, t: Titrant, veq: number): { name: string; from: number; to: number; colours: string; error: number }[] {
  return INDICATORS.map((ind) => {
    // Volume at which the curve passes the middle of the indicator's range, as a % error from equivalence.
    const mid = (ind.from + ind.to) / 2;
    let lo = 0, hi = veq * 2;
    const rising = a.kind === 'acid';
    for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2, p = pHAt(a, t, m); if ((p < mid) === rising) lo = m; else hi = m; }
    return { ...ind, error: (100 * ((lo + hi) / 2 - veq)) / veq };
  }).filter((x) => Math.abs(x.error) <= 0.5).sort((x, y) => Math.abs(x.error) - Math.abs(y.error));
}

export type Endpoint = { volume: number; pH: number; slope: number };
/** End points of a measured curve: peaks of |ΔpH/ΔV|, refined where the second derivative crosses zero. */
export function endpoints(v: number[], pH: number[], minRise = 1): Endpoint[] {
  const n = v.length; if (n < 5) return [];
  const mid: number[] = [], d1: number[] = [];
  for (let i = 0; i < n - 1; i++) { const dv = v[i + 1] - v[i]; if (dv <= 0) continue; mid.push((v[i] + v[i + 1]) / 2); d1.push((pH[i + 1] - pH[i]) / dv); }
  const abs = d1.map(Math.abs), out: Endpoint[] = [];
  const typical = [...abs].sort((x, y) => x - y)[Math.floor(abs.length / 2)] || 1e-9;
  for (let i = 1; i < abs.length - 1; i++) {
    if (!(abs[i] >= abs[i - 1] && abs[i] > abs[i + 1] && abs[i] > 4 * typical)) continue;
    // pH must change by at least minRise over the neighbouring points for a real step.
    const lo = Math.max(0, i - 2), hi = Math.min(n - 1, i + 3);
    if (Math.abs(pH[hi] - pH[lo]) < minRise) continue;
    // Second derivative between midpoints i-1, i, i+1: interpolate its zero crossing.
    const s1 = (d1[i] - d1[i - 1]) / (mid[i] - mid[i - 1]), s2 = (d1[i + 1] - d1[i]) / (mid[i + 1] - mid[i]);
    const xa = (mid[i - 1] + mid[i]) / 2, xb = (mid[i] + mid[i + 1]) / 2;
    let vol = mid[i];
    if (s1 !== s2 && s1 > 0 !== s2 > 0) vol = xa + ((xb - xa) * s1) / (s1 - s2);
    else {
      // Vertex of the parabola through the three slopes around the peak.
      const [x0, x1, x2] = [mid[i - 1], mid[i], mid[i + 1]], [y0, y1, y2] = [abs[i - 1], abs[i], abs[i + 1]];
      const den = (x0 - x1) * (x0 - x2) * (x1 - x2), A = (x2 * (y1 - y0) + x1 * (y0 - y2) + x0 * (y2 - y1)) / den, B = (x2 * x2 * (y0 - y1) + x1 * x1 * (y2 - y0) + x0 * x0 * (y1 - y2)) / den;
      if (A < 0) { const xv = -B / (2 * A); if (xv > x0 && xv < x2) vol = xv; }
    }
    const j = v.findIndex((x) => x >= vol), ph = j <= 0 ? pH[0] : pH[j - 1] + ((pH[j] - pH[j - 1]) * (vol - v[j - 1])) / (v[j] - v[j - 1]);
    out.push({ volume: vol, pH: ph, slope: d1[i] });
  }
  return out;
}

/** pH read off a measured curve at a given volume (straight-line interpolation). */
export function interp(v: number[], pH: number[], x: number): number {
  if (x <= v[0]) return pH[0];
  for (let i = 1; i < v.length; i++) if (v[i] >= x) return pH[i - 1] + ((pH[i] - pH[i - 1]) * (x - v[i - 1])) / (v[i] - v[i - 1]);
  return pH[pH.length - 1];
}

/** Common analytes: pKa values of the fully protonated form (strong ones as STRONG). */
export const PRESETS: { id: string; label: string; kind: 'acid' | 'base'; pKa: number[] }[] = [
  { id: 'hcl', label: 'Hydrochloric acid (strong)', kind: 'acid', pKa: [STRONG] },
  { id: 'acetic', label: 'Acetic acid (vinegar)', kind: 'acid', pKa: [4.76] },
  { id: 'formic', label: 'Formic acid', kind: 'acid', pKa: [3.75] },
  { id: 'benzoic', label: 'Benzoic acid', kind: 'acid', pKa: [4.20] },
  { id: 'oxalic', label: 'Oxalic acid', kind: 'acid', pKa: [1.25, 4.27] },
  { id: 'carbonic', label: 'Carbonic acid (CO₂ in water)', kind: 'acid', pKa: [6.35, 10.33] },
  { id: 'phosphoric', label: 'Phosphoric acid', kind: 'acid', pKa: [2.15, 7.20, 12.35] },
  { id: 'citric', label: 'Citric acid', kind: 'acid', pKa: [3.13, 4.76, 6.40] },
  { id: 'khp', label: 'Potassium hydrogen phthalate (KHP standard)', kind: 'acid', pKa: [5.41] },
  { id: 'naoh', label: 'Sodium hydroxide (strong base)', kind: 'base', pKa: [-STRONG] },
  { id: 'ammonia', label: 'Ammonia', kind: 'base', pKa: [9.25] },
  { id: 'carbonate', label: 'Sodium carbonate', kind: 'base', pKa: [6.35, 10.33] },
  { id: 'custom', label: 'Your own pKa values', kind: 'acid', pKa: [4.76] },
];
