// Beer–Lambert law and absorption spectra: A = ε·l·c, absorbance ↔ transmittance, peaks, and absorbance read
// off a spectrum at any wavelength.

/** A = −log10(T), T as a fraction. */
export const absFromT = (T: number) => -Math.log10(T);
export const tFromAbs = (A: number) => 10 ** -A;

export type BL = { A?: number; eps?: number; l?: number; c?: number };
/** Fill in the one missing value of A = ε l c (ε in L/(mol·cm), l in cm, c in mol/L). */
export function solveBL(x: BL): Required<BL> & { solved: keyof BL } {
  const miss = (['A', 'eps', 'l', 'c'] as const).filter((k) => x[k] === undefined);
  if (miss.length !== 1) throw new Error('Leave exactly one of absorbance, ε, path length and concentration empty.');
  const k = miss[0], { A, eps, l, c } = x;
  const out = { A: A ?? eps! * l! * c!, eps: eps ?? A! / (l! * c!), l: l ?? A! / (eps! * c!), c: c ?? A! / (eps! * l!), solved: k };
  if (![out.eps, out.l, out.c].every((v) => Number.isFinite(v) && v > 0) || !(out.A >= 0) || !Number.isFinite(out.A)) throw new Error('ε, path length and concentration must be above zero, and absorbance zero or more.');
  return out;
}

/** How trustworthy an absorbance reading is on an ordinary spectrophotometer. */
export function absQuality(A: number): { level: 'good' | 'warn' | 'bad'; text: string } {
  if (A < 0.05) return { level: 'warn', text: 'very low: noise and the blank matter a lot; use a longer cell or a stronger solution' };
  if (A <= 1.0) return { level: 'good', text: 'in the most accurate range (about 0.1 to 1)' };
  if (A <= 2.0) return { level: 'warn', text: 'high: under 10 % of the light gets through, so stray light starts to bend the line; dilute if you can' };
  return { level: 'bad', text: 'too high: under 1 % of the light gets through and most instruments are no longer linear; dilute the sample' };
}

/** Straight-line interpolation of y at x (x sorted ascending). NaN outside the range. */
export function interpAt(x: number[], y: number[], at: number): number {
  if (!x.length || at < x[0] || at > x[x.length - 1]) return NaN;
  let lo = 0, hi = x.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (x[m] <= at) lo = m; else hi = m; }
  return x[hi] === x[lo] ? y[lo] : y[lo] + ((y[hi] - y[lo]) * (at - x[lo])) / (x[hi] - x[lo]);
}

/** Absorption maxima: local maxima that stand at least `prominence` (as a fraction of the range) above both neighbouring minima, refined by a parabola. */
export function peaks(x: number[], y: number[], prominence = 0.05): { x: number; y: number }[] {
  const n = y.length; if (n < 3) return [];
  const range = Math.max(...y) - Math.min(...y) || 1, out: { x: number; y: number }[] = [];
  for (let i = 1; i < n - 1; i++) {
    if (!(y[i] > y[i - 1] && y[i] >= y[i + 1])) continue;
    let l = y[i], r = y[i];
    for (let j = i - 1; j >= 0 && y[j] <= y[i]; j--) l = Math.min(l, y[j]);
    for (let j = i + 1; j < n && y[j] <= y[i]; j++) r = Math.min(r, y[j]);
    if (y[i] - Math.max(l, r) < prominence * range) continue;
    const d = y[i - 1] - 2 * y[i] + y[i + 1], off = d < 0 ? (0.5 * (y[i - 1] - y[i + 1])) / d : 0, h = (x[i + 1] - x[i - 1]) / 2;
    out.push({ x: x[i] + off * h, y: y[i] - 0.25 * (y[i - 1] - y[i + 1]) * off });
  }
  return out;
}

/** A simulated spectrum of NADH, 0.100 mmol/L in a 1 cm cell: bands at 259 nm (ε 14,400) and 340 nm (ε 6,220). */
export function simulatedNadh(): { wl: number[]; A: number[] } {
  const wl: number[] = [], A: number[] = [], c = 1e-4;
  const g = (x: number, mu: number, fw: number) => Math.exp(-4 * Math.LN2 * ((x - mu) / fw) ** 2);
  for (let w = 220; w <= 450; w += 2) {
    const eps = 14400 * g(w, 259, 34) + 6220 * g(w, 340, 58) + 9000 * g(w, 215, 30);
    wl.push(w); A.push(+(eps * c + 0.004 * Math.sin(w * 1.7)).toFixed(4));
  }
  return { wl, A };
}
