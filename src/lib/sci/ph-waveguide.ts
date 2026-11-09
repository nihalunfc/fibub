// Hollow metal waveguides: cutoff frequencies and propagation of TE and TM modes in rectangular and
// circular guides, with Bessel-function zeros computed here, and wall (conductor) loss. SI units. No DOM.
import { EPS0, MU0 } from './ph-capind.ts';

export const C0 = 299792458;

/** Bessel function J_n(x) for integer n ≥ 0, from J_n(x) = (1/π)∫₀^π cos(nτ − x sin τ) dτ (trapezoid rule, exact to rounding for a smooth periodic integrand). */
export function besselJ(n: number, x: number): number {
  const N = Math.max(64, Math.ceil(Math.abs(x) + n) * 2 + 40);
  let s = 0;
  for (let k = 0; k <= N; k++) {
    const t = (Math.PI * k) / N, w = k === 0 || k === N ? 0.5 : 1;
    s += w * Math.cos(n * t - x * Math.sin(t));
  }
  return s / N;
}
/** J_n'(x) = (J_{n−1}(x) − J_{n+1}(x)) / 2, with J_{−1} = −J_1. */
export const besselJp = (n: number, x: number) => (n === 0 ? -besselJ(1, x) : (besselJ(n - 1, x) - besselJ(n + 1, x)) / 2);

/** The first `count` positive zeros of f, found by scanning in steps of 0.05 from `from` and bisecting each sign change. */
function zeros(f: (x: number) => number, count: number, from = 1e-6): number[] {
  const out: number[] = [];
  let x0 = from, f0 = f(x0);
  for (let x1 = from + 0.05; out.length < count && x1 < 400; x1 += 0.05) {
    const f1 = f(x1);
    if (f0 === 0) out.push(x0);
    else if (f0 * f1 < 0) {
      let lo = x0, hi = x1, flo = f0;
      for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2, fm = f(m); if (flo * fm <= 0) hi = m; else { lo = m; flo = fm; } }
      out.push((lo + hi) / 2);
    }
    x0 = x1; f0 = f1;
  }
  return out;
}
/** Zeros p_nm of J_n (TM modes of a circular guide). */
const memo = new Map<string, number[]>();
const cached = (key: string, count: number, make: () => number[]) => { const c = memo.get(key); if (c && c.length >= count) return c.slice(0, count); const z = make(); memo.set(key, z); return z.slice(0, count); };
export const jZeros = (n: number, count: number) => cached(`j${n}`, count, () => zeros((x) => besselJ(n, x), Math.max(count, 12), 0.01));
/** Zeros p'_nm of J_n' (TE modes of a circular guide); for n = 0 the trivial zero at x = 0 is skipped. */
export const jpZeros = (n: number, count: number) => cached(`p${n}`, count, () => zeros((x) => besselJp(n, x), Math.max(count, 12), 0.01));

export type Mode = { kind: 'TE' | 'TM'; m: number; n: number; kc: number; fc: number; name: string; deg?: number; p?: number };

/** Rectangular guide a × b (a ≥ b): kc = √((mπ/a)² + (nπ/b)²), fc = c kc / (2π √(εr μr)). Modes up to fmax, sorted by cutoff. */
export function rectModes(a: number, b: number, er: number, fmax: number, mr = 1): Mode[] {
  const v = C0 / Math.sqrt(er * mr), out: Mode[] = [];
  for (let m = 0; m < 60; m++) for (let n = 0; n < 60; n++) {
    if (m === 0 && n === 0) continue;
    const kc = Math.hypot((m * Math.PI) / a, (n * Math.PI) / b), fc = (v * kc) / (2 * Math.PI);
    if (fc > fmax) continue;
    out.push({ kind: 'TE', m, n, kc, fc, name: `TE${m}${n}` });
    if (m > 0 && n > 0) out.push({ kind: 'TM', m, n, kc, fc, name: `TM${m}${n}` });
  }
  return out.sort((p, q) => p.fc - q.fc || (p.kind < q.kind ? -1 : 1));
}

/** Circular guide of radius R: TE_nm from p'_nm, TM_nm from p_nm; kc = p/R. Modes up to fmax, sorted by cutoff. */
export function circModes(R: number, er: number, fmax: number, mr = 1): Mode[] {
  const v = C0 / Math.sqrt(er * mr), pmax = (2 * Math.PI * fmax * R) / v, out: Mode[] = [];
  for (let n = 0; n < 40; n++) {
    for (const [kind, zs] of [['TE', jpZeros(n, 12)], ['TM', jZeros(n, 12)]] as const) {
      zs.forEach((p, i) => { if (p <= pmax) out.push({ kind, m: n, n: i + 1, kc: p / R, fc: (v * p) / (2 * Math.PI * R), name: `${kind}${n}${i + 1}`, p }); });
    }
    if (n >= 1 && jpZeros(n, 1)[0] > pmax && jZeros(n, 1)[0] > pmax) break;
  }
  return out.sort((p, q) => p.fc - q.fc);
}

/** Propagation of one mode at frequency f: β, guide wavelength, phase and group speeds, wave impedance; or the evanescent decay. */
export function propagate(mode: Mode, f: number, er: number, mr = 1) {
  const k = (2 * Math.PI * f * Math.sqrt(er * mr)) / C0, eta = Math.sqrt((MU0 * mr) / (EPS0 * er));
  if (f > mode.fc) {
    const beta = Math.sqrt(k * k - mode.kc * mode.kc);
    return { on: true, k, beta, lg: (2 * Math.PI) / beta, vp: (2 * Math.PI * f) / beta, vg: ((C0 / Math.sqrt(er * mr)) * beta) / k, z: mode.kind === 'TE' ? (eta * k) / beta : (eta * beta) / k, alpha: 0, eta };
  }
  const alpha = Math.sqrt(mode.kc * mode.kc - k * k);
  return { on: false, k, beta: 0, lg: Infinity, vp: Infinity, vg: 0, z: NaN, alpha, eta };
}

/** Wall loss of the TE10 mode of a rectangular guide (nepers per metre): Rs (2bπ² + a³k²) / (a³ b β k η). */
export function rectTE10Loss(a: number, b: number, f: number, er: number, Rs: number): number {
  const kc = Math.PI / a, md: Mode = { kind: 'TE', m: 1, n: 0, kc, fc: (C0 / Math.sqrt(er)) / (2 * a), name: 'TE10' };
  const p = propagate(md, f, er);
  if (!p.on) return NaN;
  return (Rs * (2 * b * Math.PI * Math.PI + a * a * a * p.k * p.k)) / (a * a * a * b * p.beta * p.k * p.eta);
}

/** Wall loss of circular-guide modes (nepers per metre). TE_nm: Rs/(R k η β) (kc² + k² n²/(p'² − n²)); TM_nm: Rs k/(R η β). */
export function circLoss(mode: Mode, R: number, f: number, er: number, Rs: number): number {
  const p = propagate(mode, f, er);
  if (!p.on) return NaN;
  if (mode.kind === 'TM') return (Rs * p.k) / (R * p.eta * p.beta);
  const n = mode.m, pp = mode.p!;
  return (Rs / (R * p.k * p.eta * p.beta)) * (mode.kc * mode.kc + (p.k * p.k * n * n) / (pp * pp - n * n));
}
