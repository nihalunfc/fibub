// Ligand binding: saturation curves (one site, one site with non-specific binding, two sites, Hill) fitted by
// non-linear least squares, a tight-binding (ligand depletion) titration from total concentrations, the Scatchard
// plot for comparison, model choice by AICc, and the Cheng–Prusoff conversion of an IC50 to Ki.
import { levenbergMarquardt, fitLine } from './fit.ts';

/** pos: fitted in log space (must stay positive). */
export type Param = { key: string; label: string; pos: boolean; conc?: boolean; signal?: boolean };
export type Model = { id: string; name: string; params: Param[]; y: (L: number, p: number[], Rt: number) => number; needsRt?: boolean };

/** Bound complex for total ligand Lt and total receptor Rt (exact quadratic). */
export function complexTotal(Lt: number, Rt: number, Kd: number): number {
  const b = Rt + Lt + Kd, disc = Math.max(b * b - 4 * Rt * Lt, 0);
  return (2 * Rt * Lt) / (b + Math.sqrt(disc)); // same root as (b − √disc)/2 without cancellation
}

const Bmax: Param = { key: 'Bmax', label: 'Bmax', pos: true, signal: true }, Kd: Param = { key: 'Kd', label: 'Kd', pos: true, conc: true };
export const MODELS: Model[] = [
  { id: 'one', name: 'One site', params: [Bmax, Kd], y: (L, [B, K]) => (B * L) / (K + L) },
  { id: 'ns', name: 'One site + non-specific', params: [Bmax, Kd, { key: 'NS', label: 'Non-specific slope', pos: true }], y: (L, [B, K, N]) => (B * L) / (K + L) + N * L },
  { id: 'two', name: 'Two sites', params: [{ ...Bmax, key: 'Bmax1', label: 'Bmax (high affinity)' }, { ...Kd, key: 'Kd1', label: 'Kd (high affinity)' }, { ...Bmax, key: 'Bmax2', label: 'Bmax (low affinity)' }, { ...Kd, key: 'Kd2', label: 'Kd (low affinity)' }], y: (L, [B1, K1, B2, K2]) => (B1 * L) / (K1 + L) + (B2 * L) / (K2 + L) },
  { id: 'hill', name: 'Hill (cooperative)', params: [Bmax, { ...Kd, key: 'K0.5', label: 'K₀.₅ (half saturation)' }, { key: 'h', label: 'Hill coefficient h', pos: true }], y: (L, [B, K, h]) => (B * L ** h) / (K ** h + L ** h) },
  { id: 'tight', name: 'Tight binding (total ligand, ligand depletion)', needsRt: true, params: [{ key: 'y0', label: 'Signal with no ligand', pos: false, signal: true }, { key: 'dY', label: 'Signal change at full binding', pos: false, signal: true }, Kd], y: (Lt, [y0, dY, K], Rt) => y0 + (dY * complexTotal(Lt, Rt, K)) / Rt },
];

export type Fit = { model: Model; p: number[]; se: number[]; sse: number; n: number; aicc: number; r2: number; s: number; ok: boolean };

export function fitBinding(m: Model, L: number[], y: number[], Rt = 0): Fit {
  const k = m.params.length, n = L.length;
  if (n <= k) throw new Error(`Need more than ${k} points to fit ${m.name}`);
  if (m.needsRt && !(Rt > 0)) throw new Error('Enter the receptor (or protein) concentration for the tight-binding fit.');
  const Lmax = Math.max(...L), Lpos = L.filter((v) => v > 0), Lmin = Lpos.length ? Math.min(...Lpos) : Lmax / 100;
  const ymax = Math.max(...y), ymin = Math.min(...y), span = ymax - ymin || Math.abs(ymax) || 1;
  // Half-saturation guess: the ligand whose signal is nearest halfway.
  const order = L.map((_, i) => i).sort((a, b) => L[a] - L[b]);
  const half = order.reduce((best, i) => (Math.abs(y[i] - (ymin + ymax) / 2) < Math.abs(y[best] - (ymin + ymax) / 2) ? i : best), order[0]);
  const K0 = Math.max(L[half], Lmin * 0.5);
  const starts: number[][] = [];
  for (const f of [1, 0.2, 5]) {
    if (m.id === 'one') starts.push([ymax * 1.1, K0 * f]);
    else if (m.id === 'ns') { const slope = Math.max((y[order[n - 1]] - y[order[n - 2]]) / Math.max(L[order[n - 1]] - L[order[n - 2]], 1e-30), ymax / Lmax * 0.05); starts.push([ymax * 0.9, K0 * f, Math.max(slope * 0.5, 1e-12)]); }
    else if (m.id === 'two') starts.push([ymax * 0.4, K0 * f * 0.1, ymax * 0.7, K0 * f * 5]);
    else if (m.id === 'hill') starts.push([ymax * 1.1, K0 * f, 1.5], [ymax * 1.1, K0 * f, 0.7]);
    else { const first = y[order[0]], last = y[order[n - 1]]; starts.push([first, (last - first) * 1.1, Math.max(K0 * f - Rt / 2, Lmin * 0.05)]); }
  }
  const enc = (p: number[]) => p.map((v, i) => (m.params[i].pos ? Math.log(Math.max(v, 1e-30)) : v));
  const dec = (u: number[]) => u.map((v, i) => (m.params[i].pos ? Math.exp(v) : v));
  const x = L.map((_, i) => i), f = (i: number, u: number[]) => m.y(L[i], dec(u), Rt);
  let best: ReturnType<typeof levenbergMarquardt> | null = null;
  for (const s of starts) { try { const r = levenbergMarquardt(f, x, y, enc(s), { maxIter: 500 }); if (Number.isFinite(r.sse) && (!best || r.sse < best.sse)) best = r; } catch { /* next start */ } }
  if (!best) throw new Error('The fit could not start: check the columns.');
  const p = dec(best.p), se = best.se.map((s, i) => (m.params[i].pos ? s * p[i] : s));
  const aicc = n * Math.log(Math.max(best.sse, 1e-300) / n) + 2 * k + (2 * k * (k + 1)) / Math.max(n - k - 1, 1);
  const ok = p.every((v, i) => Number.isFinite(v) && (!m.params[i].pos || (v < 1e6 * Math.max(Lmax, span) && v > 1e-9 * Math.min(Lmin, span))))
    && se.every((s, i) => Number.isFinite(s) && s < Math.abs(p[i]) + (m.params[i].pos ? 0 : 0.05 * span));
  return { model: m, p, se, sse: best.sse, n, aicc, r2: best.r2, s: best.s, ok };
}

export function akaikeWeights(fits: Fit[]) {
  const a = Math.min(...fits.map((f) => f.aicc)), e = fits.map((f) => Math.exp(-(f.aicc - a) / 2)), t = e.reduce((x, y) => x + y, 0);
  return e.map((v) => v / t);
}

/** Scatchard: bound/free against bound; slope −1/Kd, x intercept Bmax. Uses points with free ligand and binding above zero. */
export function scatchard(L: number[], B: number[]) {
  const idx = L.map((_, i) => i).filter((i) => L[i] > 0 && B[i] > 0);
  const x = idx.map((i) => B[i]), y = idx.map((i) => B[i] / L[i]);
  const ln = fitLine(x, y);
  return { x, y, Kd: -1 / ln.slope, Bmax: -ln.intercept / ln.slope, line: ln };
}

/** Cheng–Prusoff for competitive binding: Ki = IC50 / (1 + [L]/Kd). */
export const chengPrusoff = (ic50: number, L: number, Kd: number) => ic50 / (1 + L / Kd);

/** Simulated saturation study (made by fibub): Bmax 1200, Kd 2.5, non-specific slope 15 per unit, 3 % noise. */
export function exampleData(): { L: number; total: number; nsb: number }[] {
  let seed = 2; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 - 0.5; };
  return [0.1, 0.25, 0.5, 1, 2, 4, 8, 16, 32].map((L) => {
    const ns = 15 * L, sp = (1200 * L) / (2.5 + L);
    return { L, total: Math.round((sp + ns) * (1 + 0.06 * rnd())), nsb: Math.round(ns * (1 + 0.1 * rnd()) * 10) / 10 };
  });
}
