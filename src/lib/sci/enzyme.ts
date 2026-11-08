// Enzyme kinetics: Michaelis–Menten, substrate inhibition and Hill fits to initial rates; reversible inhibition
// (competitive, uncompetitive, non-competitive, mixed) fitted globally to rates at several inhibitor levels; the
// classic linear plots (Lineweaver–Burk, Eadie–Hofstee, Hanes–Woolf) for comparison; and model choice by AICc.
import { levenbergMarquardt, fitLine } from './fit.ts';

export type Model = { id: string; name: string; params: { key: string; label: string }[]; needsI?: boolean; v: (S: number, I: number, p: number[]) => number };

export const MODELS: Model[] = [
  { id: 'mm', name: 'Michaelis–Menten', params: [{ key: 'Vmax', label: 'Vmax' }, { key: 'Km', label: 'Km' }], v: (S, _I, [V, K]) => (V * S) / (K + S) },
  { id: 'subinh', name: 'Substrate inhibition', params: [{ key: 'Vmax', label: 'Vmax' }, { key: 'Km', label: 'Km' }, { key: 'Ksi', label: 'Ksi (substrate inhibition)' }], v: (S, _I, [V, K, Ki]) => (V * S) / (K + S * (1 + S / Ki)) },
  { id: 'hill', name: 'Hill (cooperative)', params: [{ key: 'Vmax', label: 'Vmax' }, { key: 'K0.5', label: 'K₀.₅ (half-saturation)' }, { key: 'h', label: 'Hill coefficient h' }], v: (S, _I, [V, K, h]) => (V * S ** h) / (K ** h + S ** h) },
  { id: 'comp', name: 'Competitive inhibition', needsI: true, params: [{ key: 'Vmax', label: 'Vmax' }, { key: 'Km', label: 'Km' }, { key: 'Ki', label: 'Ki' }], v: (S, I, [V, K, Ki]) => (V * S) / (K * (1 + I / Ki) + S) },
  { id: 'uncomp', name: 'Uncompetitive inhibition', needsI: true, params: [{ key: 'Vmax', label: 'Vmax' }, { key: 'Km', label: 'Km' }, { key: "Ki'", label: "Ki′ (binds ES)" }], v: (S, I, [V, K, Ki]) => (V * S) / (K + S * (1 + I / Ki)) },
  { id: 'noncomp', name: 'Non-competitive inhibition', needsI: true, params: [{ key: 'Vmax', label: 'Vmax' }, { key: 'Km', label: 'Km' }, { key: 'Ki', label: 'Ki' }], v: (S, I, [V, K, Ki]) => (V * S) / ((K + S) * (1 + I / Ki)) },
  { id: 'mixed', name: 'Mixed inhibition', needsI: true, params: [{ key: 'Vmax', label: 'Vmax' }, { key: 'Km', label: 'Km' }, { key: 'Ki', label: 'Ki (binds E)' }, { key: "Ki'", label: "Ki′ (binds ES)" }], v: (S, I, [V, K, Ki, Kip]) => (V * S) / (K * (1 + I / Ki) + S * (1 + I / Kip)) },
];

export type Obs = { S: number; I: number; v: number };
export type Fit = { model: Model; p: number[]; se: number[]; sse: number; n: number; aicc: number; r2: number; s: number; ok: boolean };

/** Fit a model by least squares in log parameters (all positive). weighting 'relative' uses 1/v². */
export function fitEnzyme(m: Model, d: Obs[], weighting: 'constant' | 'relative' = 'constant'): Fit {
  const k = m.params.length, n = d.length;
  if (n <= k) throw new Error(`Need more than ${k} rates to fit ${m.name}`);
  const Smax = Math.max(...d.map((o) => o.S)), vmax = Math.max(...d.map((o) => o.v)), Is = d.map((o) => o.I).filter((x) => x > 0);
  // Starting values: Vmax a bit above the top rate, Km near the substrate giving half of it.
  const half = d.filter((o) => o.I === 0 || !m.needsI).sort((a, b) => Math.abs(a.v - vmax / 2) - Math.abs(b.v - vmax / 2))[0] ?? d[0];
  const Km0 = Math.max(half.S, Smax * 1e-3), Ki0 = Is.length ? Is.reduce((a, b) => a + b, 0) / Is.length : 1;
  const starts: number[][] = [];
  for (const f of [1, 0.3, 3]) {
    const base = [vmax * 1.2, Km0 * f];
    if (m.id === 'mm') starts.push(base);
    else if (m.id === 'subinh') starts.push([vmax * 1.5, Km0 * f, Smax * 2]);
    else if (m.id === 'hill') starts.push([vmax * 1.2, Km0 * f, 1.5], [vmax * 1.2, Km0 * f, 0.8]);
    else if (m.id === 'mixed') starts.push([...base, Ki0, Ki0 * 3], [...base, Ki0 * 3, Ki0]);
    else starts.push([...base, Ki0]);
  }
  const x = d.map((_, i) => i), y = d.map((o) => o.v), w = d.map((o) => (weighting === 'relative' ? 1 / Math.max(o.v * o.v, 1e-300) : 1));
  const f = (i: number, u: number[]) => m.v(d[i].S, d[i].I, u.map(Math.exp));
  let best: ReturnType<typeof levenbergMarquardt> | null = null;
  for (const s of starts) { try { const r = levenbergMarquardt(f, x, y, s.map((v) => Math.log(Math.max(v, 1e-30))), { w, maxIter: 400 }); if (!best || r.sse < best.sse) best = r; } catch { /* next start */ } }
  if (!best) throw new Error('The fit could not start: check the columns.');
  const p = best.p.map(Math.exp), se = best.se.map((s, i) => s * p[i]);
  const aicc = n * Math.log(Math.max(best.sse, 1e-300) / n) + 2 * k + (2 * k * (k + 1)) / Math.max(n - k - 1, 1);
  const ok = p.every((v) => Number.isFinite(v) && v < 1e9 * Math.max(Smax, vmax) && v > 1e-9 * Math.min(Smax, vmax)) && se.every((s, i) => Number.isFinite(s) && s < 5 * p[i]);
  return { model: m, p, se, sse: best.sse, n, aicc, r2: best.r2, s: best.s, ok };
}

/** Akaike weights: how strongly the data support each model compared with the others. */
export function akaikeWeights(fits: Fit[]) {
  const a = Math.min(...fits.map((f) => f.aicc)), e = fits.map((f) => Math.exp(-(f.aicc - a) / 2)), t = e.reduce((x, y) => x + y, 0);
  return e.map((v) => v / t);
}

/** Vmax and Km from the three classic straight-line plots (no inhibitor rows). */
export function linearised(d: Obs[]) {
  const S = d.map((o) => o.S), v = d.map((o) => o.v);
  const lb = fitLine(S.map((s) => 1 / s), v.map((r) => 1 / r)); // 1/v = (Km/Vmax)(1/S) + 1/Vmax
  const eh = fitLine(v.map((r, i) => r / S[i]), v); // v = Vmax − Km (v/S)
  const hw = fitLine(S, S.map((s, i) => s / v[i])); // S/v = S/Vmax + Km/Vmax
  return {
    lineweaver: { Vmax: 1 / lb.intercept, Km: lb.slope / lb.intercept },
    eadie: { Vmax: eh.intercept, Km: -eh.slope },
    hanes: { Vmax: 1 / hw.slope, Km: hw.intercept / hw.slope },
  };
}

/** Rates from a simulated competitive inhibitor study (made by fibub): Vmax 100, Km 20, Ki 10, 2 % noise. */
export function exampleData(): Obs[] {
  let seed = 5; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 - 0.5; };
  const out: Obs[] = [];
  for (const I of [0, 10, 30]) for (const S of [2.5, 5, 10, 20, 40, 80, 160]) out.push({ S, I, v: +(((100 * S) / (20 * (1 + I / 10) + S)) * (1 + 0.04 * rnd())).toFixed(2) });
  return out;
}
