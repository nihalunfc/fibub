// Solar cell I-V analysis: short-circuit current, open-circuit voltage, maximum power point, fill factor and
// efficiency from measured points; series and shunt resistance from the slopes at Voc and Isc; and a fit of the
// single-diode model I = Iph − I0[exp((V + I·Rs)/(n·Ns·Vt)) − 1] − (V + I·Rs)/Rsh, written explicitly with the
// Lambert W function (Jain and Kapoor's form), for the ideality factor and saturation current.
import { fitLine, levenbergMarquardt } from './fit.ts';

export const Q = 1.602176634e-19, KB = 1.380649e-23;
export const thermalVoltage = (tC: number) => (KB * (tC + 273.15)) / Q;

/** Principal branch W₀ of the Lambert W function for x ≥ −1/e (Halley's method). */
export function lambertW(x: number): number {
  if (x === 0) return 0;
  if (x < -1 / Math.E) return NaN;
  if (x > 1e300) return lambertWlog(Math.log(x));
  let w = x < 1 ? (x < -0.3 ? -1 + Math.sqrt(2 * (1 + Math.E * x)) : x * (1 - x)) : Math.log(1 + x) * (1 - Math.log(1 + Math.log(1 + x)) / (2 + Math.log(1 + x)));
  for (let i = 0; i < 60; i++) {
    const e = Math.exp(w), f = w * e - x;
    const dw = f / (e * (w + 1) - ((w + 2) * f) / (2 * w + 2));
    w -= dw;
    if (Math.abs(dw) <= 1e-15 * (1 + Math.abs(w))) break;
  }
  return w;
}

/** W₀(e^L) for any real L, without forming e^L (so very large arguments work): solves w + ln w = L. */
export function lambertWlog(L: number): number {
  if (L < 0) return lambertW(Math.exp(L));
  let w = L < 2 ? lambertW(Math.exp(L)) : L - Math.log(L) + Math.log(L) / L;
  for (let i = 0; i < 60; i++) {
    const f = w + Math.log(w) - L, dw = f / (1 + 1 / w);
    w -= dw;
    if (Math.abs(dw) <= 1e-15 * w) break;
  }
  return w;
}

export type Diode = { Iph: number; I0: number; n: number; Rs: number; Rsh: number };

/** Current at voltage V from the single-diode model; a = n·Ns·Vt (V). Explicit Lambert W form. */
export function currentAt(V: number, d: Diode, a: number): number {
  const { Iph, I0, Rs, Rsh } = d;
  if (Rs < 1e-12) return Iph - I0 * Math.expm1(V / a) - V / Rsh;
  const g = Rs + Rsh;
  const L = Math.log((Rs * Rsh * I0) / (a * g)) + (Rsh * (Rs * (Iph + I0) + V)) / (a * g);
  return (Rsh * (Iph + I0) - V) / g - (a / Rs) * lambertWlog(L);
}

/** Voltage where the model current is zero (open circuit), by bisection. */
export function modelVoc(d: Diode, a: number): number {
  let lo = 0, hi = Math.max(a * Math.log(d.Iph / d.I0 + 1) * 1.5, a);
  while (currentAt(hi, d, a) > 0 && hi < 1e4) hi *= 2;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (currentAt(m, d, a) > 0) lo = m; else hi = m; }
  return (lo + hi) / 2;
}

/** Maximum power point of the model (golden-section search on P = V·I between 0 and Voc). */
export function modelMpp(d: Diode, a: number): { V: number; I: number; P: number; Voc: number; Isc: number; FF: number } {
  const Voc = modelVoc(d, a), Isc = currentAt(0, d, a);
  const P = (V: number) => V * currentAt(V, d, a);
  let lo = 0, hi = Voc;
  const r = (Math.sqrt(5) - 1) / 2;
  let x1 = hi - r * (hi - lo), x2 = lo + r * (hi - lo), f1 = P(x1), f2 = P(x2);
  for (let i = 0; i < 200 && hi - lo > 1e-13; i++) {
    if (f1 < f2) { lo = x1; x1 = x2; f1 = f2; x2 = lo + r * (hi - lo); f2 = P(x2); }
    else { hi = x2; x2 = x1; f2 = f1; x1 = hi - r * (hi - lo); f1 = P(x1); }
  }
  const V = (lo + hi) / 2, I = currentAt(V, d, a);
  return { V, I, P: V * I, Voc, Isc, FF: (V * I) / (Voc * Isc) };
}

export type IV = { V: number[]; I: number[] };
export type Metrics = {
  Isc: number; Voc: number; Vmp: number; Imp: number; Pmax: number; FF: number;
  RsSlope: number; RshSlope: number; flipped: boolean;
};

/** Sort by voltage and make the photocurrent positive (generator convention). */
export function normalise(V: number[], I: number[]): IV & { flipped: boolean } {
  const pts = V.map((v, i) => [v, I[i]]).sort((a, b) => a[0] - b[0]);
  const v = pts.map((p) => p[0]), i = pts.map((p) => p[1]);
  // Current near V = 0 (the point with the smallest |V|) tells the sign convention.
  let k = 0; for (let j = 1; j < v.length; j++) if (Math.abs(v[j]) < Math.abs(v[k])) k = j;
  const flipped = i[k] < 0;
  return { V: v, I: flipped ? i.map((x) => -x) : i, flipped };
}

/** Linear interpolation of y at x along sorted xs. NaN if outside. */
function interp(xs: number[], ys: number[], x: number): number {
  for (let j = 0; j + 1 < xs.length; j++) if ((xs[j] - x) * (xs[j + 1] - x) <= 0 && xs[j + 1] !== xs[j]) return ys[j] + ((ys[j + 1] - ys[j]) * (x - xs[j])) / (xs[j + 1] - xs[j]);
  return NaN;
}

/** Indices of the k points nearest to a value of an array. */
const nearest = (arr: number[], at: number, k: number) => arr.map((x, i) => [Math.abs(x - at), i]).sort((a, b) => a[0] - b[0]).slice(0, k).map((p) => p[1]).sort((a, b) => a - b);

/**
 * Figures of merit from the measured points (generator convention, sorted). Isc and Voc are linear
 * interpolations at V = 0 and I = 0; Pmax is the exact maximum of V·I along the straight segments between
 * points; Rs and Rsh are −dV/dI from straight lines through the k points nearest Voc and V = 0.
 */
export function metrics(iv: IV & { flipped?: boolean }, k = 5): Metrics {
  const { V, I } = iv;
  const Isc = interp(V, I, 0);
  // Voc: first sign change of I as V rises.
  let Voc = NaN;
  for (let j = 0; j + 1 < V.length; j++) if (I[j] > 0 && I[j + 1] <= 0) { Voc = V[j] + (I[j] * (V[j + 1] - V[j])) / (I[j] - I[j + 1]); break; }
  let Pmax = -Infinity, Vmp = NaN, Imp = NaN;
  for (let j = 0; j + 1 < V.length; j++) {
    const consider = (v: number, i: number) => { if (v >= 0 && i >= 0 && v * i > Pmax) { Pmax = v * i; Vmp = v; Imp = i; } };
    consider(V[j], I[j]); consider(V[j + 1], I[j + 1]);
    // Inside the segment, P(t) = (V0 + t dV)(I0 + t dI) is a parabola; its vertex.
    const dV = V[j + 1] - V[j], dI = I[j + 1] - I[j];
    if (dV * dI !== 0) { const t = -(V[j] * dI + I[j] * dV) / (2 * dV * dI); if (t > 0 && t < 1) consider(V[j] + t * dV, I[j] + t * dI); }
  }
  const slope = (idx: number[]) => { if (idx.length < 2) return NaN; try { return fitLine(idx.map((j) => I[j]), idx.map((j) => V[j])).slope; } catch { return NaN; } };
  // dV/dI near Voc and near V = 0; resistance = −dV/dI.
  const kk = Math.max(2, Math.min(k, V.length));
  const RsSlope = Number.isFinite(Voc) ? -slope(nearest(V, Voc, kk)) : NaN;
  const RshSlope = -slope(nearest(V, 0, kk));
  return { Isc, Voc, Vmp, Imp, Pmax, FF: Pmax / (Voc * Isc), RsSlope, RshSlope, flipped: !!iv.flipped };
}

export type DiodeFit = { d: Diode; se: Diode; a: number; rmse: number; converged: boolean; model: ReturnType<typeof modelMpp> };

/**
 * Fit the single-diode model to the points (current residuals) with Levenberg-Marquardt on
 * [Iph, ln I0, n, ln Rs, ln Rsh], from starting values built from the measured Isc, Voc and slopes, trying
 * several ideality factors and keeping the best. Vt is set by the cell temperature, Ns cells in series.
 */
export function fitDiode(iv: IV, m: Metrics, tC = 25, Ns = 1): DiodeFit {
  const Vt = thermalVoltage(tC) * Ns;
  const unpack = (p: number[]): Diode => ({ Iph: p[0], I0: Math.exp(p[1]), n: p[2], Rs: Math.exp(p[3]), Rsh: Math.exp(p[4]) });
  const f = (V: number, p: number[]) => currentAt(V, unpack(p), p[2] * Vt);
  const Rsh0 = m.RshSlope > 0 && Number.isFinite(m.RshSlope) ? m.RshSlope : 1000 * (m.Voc / m.Isc);
  let best: ReturnType<typeof levenbergMarquardt> | null = null;
  for (const n0 of [1, 1.3, 1.6, 2]) {
    const a = n0 * Vt;
    // At Voc the diode carries Iph − Voc/Rsh; near Voc, dV/dI ≈ −(Rs + a/(I0 e^{Voc/a})).
    const I0 = Math.max((m.Isc - m.Voc / Rsh0) / Math.expm1(m.Voc / a), 1e-30);
    const Rs0 = Math.max(m.RsSlope - a / (I0 * Math.exp(m.Voc / a)), 0.02 * Math.max(m.RsSlope, 1e-3), 1e-6);
    try {
      const r = levenbergMarquardt(f, iv.V, iv.I, [m.Isc, Math.log(I0), n0, Math.log(Rs0), Math.log(Rsh0)], { maxIter: 400 });
      if (r.p[2] > 0 && Number.isFinite(r.sse) && (!best || r.sse < best.sse)) best = r;
    } catch { /* try the next start */ }
  }
  if (!best) throw new Error('The single-diode model could not be fitted to these points.');
  const d = unpack(best.p);
  // Standard errors back from the log scale (delta method).
  const se: Diode = { Iph: best.se[0], I0: d.I0 * best.se[1], n: best.se[2], Rs: d.Rs * best.se[3], Rsh: d.Rsh * best.se[4] };
  const a = d.n * Vt;
  return { d, se, a, rmse: Math.sqrt(best.sse / iv.V.length), converged: best.converged, model: modelMpp(d, a) };
}

/** Made-up example: a 4 cm² cell, Iph 150 mA, I0 1 nA, n 1.3, Rs 0.5 Ω, Rsh 300 Ω, 25 °C, with a little noise. */
export const EXAMPLE = { d: { Iph: 0.15, I0: 1e-9, n: 1.3, Rs: 0.5, Rsh: 300 } as Diode, tC: 25, area: 4, irr: 1000 };
export function exampleIV(): IV {
  let s = 2024; const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648) - 0.5;
  const a = EXAMPLE.d.n * thermalVoltage(EXAMPLE.tC), V: number[] = [], I: number[] = [];
  for (let k = -5; k <= 66; k++) { const v = k / 100; V.push(v); I.push(+(currentAt(v, EXAMPLE.d, a) * 1000 + 0.05 * rnd()).toFixed(3)); }
  return { V, I }; // I in mA
}
