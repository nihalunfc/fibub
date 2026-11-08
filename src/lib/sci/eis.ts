// Electrochemical impedance spectroscopy: equivalent circuit models (resistors, capacitors, constant phase
// elements, Warburg diffusion), complex non-linear least-squares fitting with modulus weighting, and the usual
// derived quantities (effective capacitance of a CPE, time constant, exchange current density).
import { levenbergMarquardt } from './fit.ts';

export type C = [number, number]; // complex number [re, im]
const cadd = (a: C, b: C): C => [a[0] + b[0], a[1] + b[1]];
const cinv = (a: C): C => { const d = a[0] * a[0] + a[1] * a[1]; return [a[0] / d, -a[1] / d]; };
const par = (a: C, b: C): C => cinv(cadd(cinv(a), cinv(b)));
/** Constant phase element: Z = 1 / (Q (jω)^α). α = 1 is a capacitor. */
export const zQ = (w: number, Q: number, a: number): C => cinv([Q * w ** a * Math.cos((a * Math.PI) / 2), Q * w ** a * Math.sin((a * Math.PI) / 2)]);
/** Semi-infinite Warburg element: Z = σ (1 − j) / √ω. */
export const zW = (w: number, s: number): C => [s / Math.sqrt(w), -s / Math.sqrt(w)];

export type Param = { key: string; label: string; unit: string; log: boolean; lo?: number; hi?: number };
export type Model = { id: string; name: string; code: string; params: Param[]; z: (w: number, p: number[]) => C };

const R = (key: string, label: string): Param => ({ key, label, unit: 'Ω', log: true });
const Qp = (key: string): Param => ({ key, label: `${key} (CPE)`, unit: 'F·s^(α−1)', log: true });
const Ap = (key: string): Param => ({ key, label: key, unit: '', log: false, lo: 0.3, hi: 1 });

export const MODELS: Model[] = [
  { id: 'RC', name: 'Rs + (Rct ‖ C): one ideal semicircle', code: 'R(RC)', params: [R('Rs', 'Rs (solution)'), R('Rct', 'Rct (charge transfer)'), { key: 'C', label: 'C (double layer)', unit: 'F', log: true }], z: (w, [Rs, Rct, Cd]) => cadd([Rs, 0], par([Rct, 0], zQ(w, Cd, 1))) },
  { id: 'RQ', name: 'Rs + (Rct ‖ CPE): one depressed semicircle', code: 'R(RQ)', params: [R('Rs', 'Rs (solution)'), R('Rct', 'Rct (charge transfer)'), Qp('Q'), Ap('α')], z: (w, [Rs, Rct, Q, a]) => cadd([Rs, 0], par([Rct, 0], zQ(w, Q, a))) },
  { id: 'Randles', name: 'Randles: Rs + (CPE ‖ (Rct + W)), semicircle then a 45° tail', code: 'R(Q(RW))', params: [R('Rs', 'Rs (solution)'), R('Rct', 'Rct (charge transfer)'), Qp('Q'), Ap('α'), { key: 'σ', label: 'σ (Warburg coefficient)', unit: 'Ω·s^−½', log: true }], z: (w, [Rs, Rct, Q, a, s]) => cadd([Rs, 0], par(zQ(w, Q, a), cadd([Rct, 0], zW(w, s)))) },
  { id: 'RQRQ', name: 'Rs + (R1 ‖ CPE1) + (R2 ‖ CPE2): two semicircles', code: 'R(RQ)(RQ)', params: [R('Rs', 'Rs (solution)'), R('R1', 'R1 (first arc)'), Qp('Q1'), Ap('α1'), R('R2', 'R2 (second arc)'), Qp('Q2'), Ap('α2')], z: (w, [Rs, R1, Q1, a1, R2, Q2, a2]) => cadd(cadd([Rs, 0], par([R1, 0], zQ(w, Q1, a1))), par([R2, 0], zQ(w, Q2, a2))) },
  { id: 'RQ-blocking', name: 'Rs + CPE: blocking electrode or coating (no Rct)', code: 'RQ', params: [R('Rs', 'Rs (solution)'), Qp('Q'), Ap('α')], z: (w, [Rs, Q, a]) => cadd([Rs, 0], zQ(w, Q, a)) },
];

export type Point = { f: number; re: number; im: number };

/** Read columns f, Z', Z'' (sign detected or set) or f, |Z|, phase in degrees. Returns points sorted by falling frequency. */
export function toPoints(cols: number[][], format: 'reim' | 'modphase', sign: 'auto' | 'z' | 'minus'): { pts: Point[]; flipped: boolean } {
  const [f, a, b] = cols;
  let pts: Point[] = f.map((fi, i) => (format === 'modphase' ? { f: fi, re: a[i] * Math.cos((b[i] * Math.PI) / 180), im: a[i] * Math.sin((b[i] * Math.PI) / 180) } : { f: fi, re: a[i], im: b[i] }));
  let flipped = false;
  // Most electrochemical cells are capacitive (Z'' < 0). If most values are positive the file holds −Z'' (or −phase).
  const pos = pts.filter((p) => p.im > 0).length;
  if (sign === 'minus' || (sign === 'auto' && pos > pts.length / 2)) { pts = pts.map((p) => ({ ...p, im: -p.im })); flipped = true; }
  return { pts: pts.filter((p) => p.f > 0 && Number.isFinite(p.re) && Number.isFinite(p.im)).sort((x, y) => y.f - x.f), flipped };
}

/** Starting values from the shape of the spectrum. */
function guess(m: Model, pts: Point[]): number[][] {
  const hi = pts[0], lo = pts[pts.length - 1];
  const Rs = Math.max(hi.re, 1e-6 * Math.abs(lo.re) + 1e-9);
  // The top of the first arc: the first local maximum of −Z″ going down in frequency (a diffusion tail can rise higher later).
  const sm = pts.map((p, i) => -(pts[Math.max(0, i - 1)].im + p.im + pts[Math.min(pts.length - 1, i + 1)].im) / 3);
  let ai = sm.findIndex((v, i) => i > 0 && i < sm.length - 1 && v > sm[i - 1] && v >= sm[i + 1]);
  if (ai < 0) ai = sm.indexOf(Math.max(...sm));
  const apex = pts[ai];
  const Rarc = Math.max(2 * (apex.re - Rs), (lo.re - Rs) * 0.5, 1e-6 * Rs + 1e-9);
  const Cg = 1 / (2 * Math.PI * apex.f * Rarc);
  // Warburg tail: at low frequency Z′ ≈ Rs + Rct + σ/√ω, so fit Z′ against 1/√ω over the lowest points.
  const tail = pts.slice(-Math.max(4, Math.floor(pts.length / 6))), tx = tail.map((p) => 1 / Math.sqrt(2 * Math.PI * p.f)), ty = tail.map((p) => p.re);
  const mx = tx.reduce((a, b) => a + b, 0) / tx.length, my = ty.reduce((a, b) => a + b, 0) / ty.length;
  const slope = tx.reduce((a, x, i) => a + (x - mx) * (ty[i] - my), 0) / Math.max(tx.reduce((a, x) => a + (x - mx) ** 2, 0), 1e-30);
  const sigma = Math.max(1e-6, slope), RctW = Math.max(my - slope * mx - Rs, 1e-6 * Rs + 1e-9);
  const sets: number[][] = [];
  for (const k of [1, 0.5, 2]) {
    if (m.id === 'RC') sets.push([Rs, Rarc * k, Cg / k]);
    if (m.id === 'RQ') sets.push([Rs, Rarc * k, Cg / k, 0.9]);
    if (m.id === 'Randles') { sets.push([Rs, RctW * k, 1 / (2 * Math.PI * apex.f * RctW) / k, 0.9, sigma]); sets.push([Rs, Rarc * k, Cg / k, 0.9, sigma * k]); }
    if (m.id === 'RQRQ') sets.push([Rs, Rarc * k * 0.5, Cg / k, 0.9, Math.max(lo.re - Rs - Rarc * k * 0.5, Rarc * 0.5), Cg * 100 / k, 0.85]);
    if (m.id === 'RQ-blocking') { const w = 2 * Math.PI * lo.f; sets.push([Rs, (1 / (w * Math.max(-lo.im, 1e-12))) * k, 0.9]); }
  }
  return sets;
}

export type EisFit = { model: Model; p: number[]; rel: number[]; chi2: number; rmsPct: number; converged: boolean; runaway: boolean };

/** Complex non-linear least squares, modulus weighted (each point counts by its relative error), fitting log values. */
export function fitEIS(m: Model, pts: Point[]): EisFit {
  const n = pts.length, k = m.params.length;
  if (2 * n <= k) throw new Error(`Need more than ${Math.ceil(k / 2)} frequencies to fit ${k} values`);
  const enc = (p: number[]) => p.map((v, i) => { const pr = m.params[i]; if (pr.log) return Math.log(v); const lo = pr.lo!, hi = pr.hi!; const t = Math.min(Math.max((v - lo) / (hi - lo), 1e-6), 1 - 1e-6); return Math.log(t / (1 - t)); });
  const dec = (u: number[]) => u.map((v, i) => { const pr = m.params[i]; if (pr.log) return Math.exp(v); return pr.lo! + (pr.hi! - pr.lo!) / (1 + Math.exp(-v)); });
  const xs = Array.from({ length: 2 * n }, (_, i) => i), ys = pts.flatMap((p) => [p.re]).concat(pts.map((p) => p.im));
  const wts = pts.map((p) => 1 / (p.re * p.re + p.im * p.im)); const W = [...wts, ...wts];
  const fz = (i: number, u: number[]) => { const p = dec(u), j = i < n ? i : i - n, z = m.z(2 * Math.PI * pts[j].f, p); return i < n ? z[0] : z[1]; };
  let best: ReturnType<typeof levenbergMarquardt> | null = null;
  for (const g of guess(m, pts)) {
    try { const r = levenbergMarquardt(fz, xs, ys, enc(g), { w: W, maxIter: 400 }); if (!best || r.sse < best.sse) best = r; } catch { /* try the next start */ }
  }
  if (!best) throw new Error('The fit did not start: check that the columns are frequency, Z′ and Z″.');
  let p = dec(best.p), se = best.se;
  // Two RQ arcs can be swapped without changing Z: list the faster (high-frequency) arc first.
  if (m.id === 'RQRQ' && p[1] * p[2] ** (1 / p[3]) > p[4] * p[5] ** (1 / p[6])) { const o = [0, 4, 5, 6, 1, 2, 3]; p = o.map((i) => p[i]); se = o.map((i) => best!.se[i]); }
  // Relative standard error: exact for log-fitted values; for α, propagate through the logistic transform.
  const rel = se.map((s, i) => { const pr = m.params[i]; if (pr.log) return s; const t = (p[i] - pr.lo!) / (pr.hi! - pr.lo!); return (s * (pr.hi! - pr.lo!) * t * (1 - t)) / p[i]; });
  const chi2 = best.sse / (2 * n - k);
  // A value that ran to a limit (huge R, α at its bound) or has no defined error means the data cannot pin it down.
  const runaway = p.some((v, i) => { const pr = m.params[i]; return !Number.isFinite(rel[i]) || rel[i] > 10 || (pr.log ? v > 1e12 || v < 1e-15 : v <= pr.lo! + 1e-3 || v >= pr.hi! - 1e-4); });
  return { model: m, p, rel, chi2, rmsPct: 100 * Math.sqrt(best.sse / (2 * n)), converged: best.converged, runaway };
}

/** Effective capacitance of a CPE in parallel with a resistance (Hsu and Mansfeld): C = Q^(1/α) R^((1 − α)/α). */
export const cEff = (Q: number, a: number, Rp: number) => Q ** (1 / a) * Rp ** ((1 - a) / a);
/** Exchange current density from Rct (Ω·cm²): i0 = RT / (nF Rct). A/cm². */
export const exchangeCurrent = (RctArea: number, n: number, T: number) => (8.314462618 * T) / (n * 96485.33212 * RctArea);

/** A simulated Randles cell for the example (made by fibub): Rs 20 Ω, Rct 100 Ω, Q 20 µF·s^(α−1), α 0.9, σ 30 Ω·s^−½. */
export function exampleData(): Point[] {
  const m = MODELS.find((x) => x.id === 'Randles')!, out: Point[] = [];
  let seed = 3; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 - 0.5; };
  for (let k = 0; k <= 50; k++) {
    const f = 10 ** (5 - (k * 6.5) / 50), z = m.z(2 * Math.PI * f, [20, 100, 2e-5, 0.9, 30]), e = 1 + 0.004 * rnd();
    out.push({ f: +f.toPrecision(5), re: +(z[0] * e).toPrecision(5), im: +(z[1] * (1 + 0.004 * rnd())).toPrecision(5) });
  }
  return out;
}

/** A value with an SI prefix, e.g. 2.004e-5 F → "20.04 µF". */
export function eng(v: number, unit: string, digits = 4) {
  if (!Number.isFinite(v)) return '—';
  if (v === 0) return `0 ${unit}`;
  const P: [number, string][] = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p']];
  const a = Math.abs(v), [k, pre] = P.find(([f]) => a >= f * 0.99995) ?? P[P.length - 1];
  return `${(v / k).toPrecision(digits)} ${pre}${unit}`.trim();
}
