// Heat exchangers: log-mean temperature difference with the 1-2 shell-and-tube correction factor F, and the
// effectiveness-NTU relations for parallel flow, counterflow, shell-and-tube (n shell passes) and crossflow.

export type Config = 'counter' | 'parallel' | 'shell' | 'cross-unmixed' | 'cross-cmax-mixed' | 'cross-cmin-mixed';

/** LMTD from the two end temperature differences (equal ends give the plain difference). */
export function lmtd(dT1: number, dT2: number) {
  if (!(dT1 > 0 && dT2 > 0)) return NaN;
  return Math.abs(dT1 - dT2) < 1e-9 * Math.max(dT1, dT2) ? (dT1 + dT2) / 2 : (dT1 - dT2) / Math.log(dT1 / dT2);
}
/** End differences for counterflow (or the counterflow basis used with F) and parallel flow. */
export const ends = (Thi: number, Tho: number, Tci: number, Tco: number, parallel: boolean) => (parallel ? [Thi - Tci, Tho - Tco] : [Thi - Tco, Tho - Tci]);

/** F for one shell pass and an even number of tube passes (Bowman, Mueller and Nagle), with R = (T1 − T2)/(t2 − t1)
 * and P = (t2 − t1)/(T1 − t1), T the shell side and t the tube side. NaN if the duty is impossible in one shell. */
export function F12(P: number, R: number) {
  if (!(P > 0 && P < 1 && R >= 0)) return NaN;
  const S = Math.sqrt(R * R + 1);
  if (Math.abs(R - 1) < 1e-6) {
    const a = 2 - P * (2 - Math.SQRT2), b = 2 - P * (2 + Math.SQRT2);
    return a > 0 && b > 0 ? (P * Math.SQRT2 / (1 - P)) / Math.log(a / b) : NaN;
  }
  const num = 1 - P * R, a = 2 - P * (R + 1 - S), b = 2 - P * (R + 1 + S);
  if (!(num > 0 && a > 0 && b > 0)) return NaN;
  const F = (S * Math.log((1 - P) / num)) / ((R - 1) * Math.log(a / b));
  return F > 0 && F <= 1 + 1e-12 ? F : NaN;
}

const fact = (n: number) => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
/** Effectiveness ε = Q / Qmax for capacity ratio Cr = Cmin/Cmax and NTU = UA/Cmin. */
export function effectiveness(cfg: Config, NTU: number, Cr: number, shells = 1): number {
  if (!(NTU >= 0)) return NaN;
  if (NTU === 0) return 0;
  if (Cr < 1e-12) return 1 - Math.exp(-NTU);
  switch (cfg) {
    case 'parallel': return (1 - Math.exp(-NTU * (1 + Cr))) / (1 + Cr);
    case 'counter':
      if (Math.abs(1 - Cr) < 1e-9) return NTU / (1 + NTU);
      { const e = Math.exp(-NTU * (1 - Cr)); return (1 - e) / (1 - Cr * e); }
    case 'shell': {
      // One shell pass with NTU per shell, then n shells in counterflow series.
      const n1 = NTU / shells, S = Math.sqrt(1 + Cr * Cr), e = Math.exp(-n1 * S);
      const e1 = 2 / (1 + Cr + (S * (1 + e)) / (1 - e));
      if (shells === 1) return e1;
      if (Math.abs(1 - Cr) < 1e-9) return (shells * e1) / (1 + (shells - 1) * e1);
      const z = ((1 - e1 * Cr) / (1 - e1)) ** shells;
      return (z - 1) / (z - Cr);
    }
    case 'cross-unmixed': {
      // Exact series for both fluids unmixed (Mason, 1954).
      const a = NTU, b = Cr * NTU; let sum = 0, sa = 0, sb = 0;
      for (let n = 0; n < 400; n++) {
        sa += a ** n / fact(n); sb += b ** n / fact(n);
        if (!Number.isFinite(sa) || !Number.isFinite(sb)) break;
        const t = (1 - Math.exp(-a) * sa) * (1 - Math.exp(-b) * sb);
        sum += t;
        if (t < 1e-16 && n > a + b) break;
      }
      return sum / b;
    }
    case 'cross-cmax-mixed': return (1 - Math.exp(-Cr * (1 - Math.exp(-NTU)))) / Cr;
    case 'cross-cmin-mixed': return 1 - Math.exp(-(1 - Math.exp(-Cr * NTU)) / Cr);
  }
}
/** The widely quoted approximation for crossflow with both fluids unmixed. */
export const crossApprox = (NTU: number, Cr: number) => 1 - Math.exp((Math.pow(NTU, 0.22) / Cr) * (Math.exp(-Cr * Math.pow(NTU, 0.78)) - 1));

/** NTU for a wanted effectiveness (bisection; NaN if out of reach for this arrangement). */
export function ntuFor(cfg: Config, eps: number, Cr: number, shells = 1): number {
  if (!(eps > 0 && eps < 1)) return NaN;
  let lo = 0, hi = 1;
  while (effectiveness(cfg, hi, Cr, shells) < eps) { hi *= 2; if (hi > 200) return NaN; }
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (effectiveness(cfg, m, Cr, shells) < eps) lo = m; else hi = m; }
  return (lo + hi) / 2;
}

export type Streams = { Thi: number; Tci: number; Ch: number; Cc: number };
/** Rating: outlet temperatures and duty from U·A (W/K) and capacity rates C = m cp (W/K). */
export function rate(cfg: Config, UA: number, s: Streams, shells = 1) {
  const Cmin = Math.min(s.Ch, s.Cc), Cmax = Math.max(s.Ch, s.Cc), Cr = Cmin / Cmax, NTU = UA / Cmin;
  const eps = effectiveness(cfg, NTU, Cr, shells), Q = eps * Cmin * (s.Thi - s.Tci);
  return { Cmin, Cmax, Cr, NTU, eps, Q, Tho: s.Thi - Q / s.Ch, Tco: s.Tci + Q / s.Cc };
}
