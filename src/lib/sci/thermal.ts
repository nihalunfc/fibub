// Thermal analysis: DSC (glass transition by tangents, peak area and onset, crystallinity) and TGA (DTG, mass loss
// steps with onset and peak temperatures, T at 5 % and 10 % loss, matching a step to a lost fragment).
import { parseFormula, molarMass } from './chem.ts';

export type Pt = { T: number; y: number };

/** Sort by temperature and drop repeats (cooling segments should be split off by the user). */
export const prep = (T: number[], y: number[]): Pt[] => T.map((t, i) => ({ T: t, y: y[i] })).filter((p) => Number.isFinite(p.T) && Number.isFinite(p.y)).sort((a, b) => a.T - b.T);

/** Local straight-line slope dy/dT within ±h of each point (a smoothing derivative). */
export function slope(p: Pt[], h: number) {
  const out = new Array(p.length).fill(0); let a = 0, b = 0;
  for (let i = 0; i < p.length; i++) {
    while (p[a].T < p[i].T - h) a++;
    while (b + 1 < p.length && p[b + 1].T <= p[i].T + h) b++;
    let n = 0, st = 0, sy = 0, stt = 0, sty = 0;
    for (let j = a; j <= b; j++) { n++; st += p[j].T; sy += p[j].y; stt += p[j].T ** 2; sty += p[j].T * p[j].y; }
    const d = n * stt - st * st; out[i] = n > 1 && d > 0 ? (n * sty - st * sy) / d : 0;
  }
  return out;
}
/** Value of the curve at T by linear interpolation. */
export function at(p: Pt[], T: number) {
  if (T <= p[0].T) return p[0].y; if (T >= p[p.length - 1].T) return p[p.length - 1].y;
  let lo = 0, hi = p.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (p[m].T <= T) lo = m; else hi = m; }
  const f = (T - p[lo].T) / (p[hi].T - p[lo].T || 1); return p[lo].y + f * (p[hi].y - p[lo].y);
}
const line = (p: Pt[]) => { const n = p.length, mt = p.reduce((s, q) => s + q.T, 0) / n, my = p.reduce((s, q) => s + q.y, 0) / n; let sxy = 0, sxx = 0; for (const q of p) { sxy += (q.T - mt) * (q.y - my); sxx += (q.T - mt) ** 2; } const m = sxx ? sxy / sxx : 0; return { m, c: my - m * mt }; };
const inWin = (p: Pt[], a: number, b: number) => p.filter((q) => q.T >= a && q.T <= b);

/** Glass transition in [a, b]: baselines fitted to the outer 20 % at each end, tangent at the inflection.
 *  dir = +1 if the heat flow rises through Tg on the plot (endo up), −1 if it falls. */
export function glassTransition(p: Pt[], a: number, b: number, h: number) {
  const w = inWin(p, a, b); if (w.length < 15) return null;
  const span = b - a, pre = line(w.filter((q) => q.T <= a + 0.2 * span)), post = line(w.filter((q) => q.T >= b - 0.2 * span));
  const d = slope(w, h), mid = (a + b) / 2, step = (post.m * mid + post.c) - (pre.m * mid + pre.c), sg = Math.sign(step) || 1;
  let k = 0; for (let i = 0; i < w.length; i++) if (w[i].T > a + 0.1 * span && w[i].T < b - 0.1 * span && sg * d[i] > sg * d[k]) k = i;
  if (!(w[k].T > a + 0.1 * span)) for (let i = 0; i < w.length; i++) if (sg * d[i] > sg * d[k]) k = i;
  const Ti = w[k].T, yi = w[k].y, mi = d[k];
  const cross = (L: { m: number; c: number }) => (yi - mi * Ti - L.c) / (L.m - mi);
  const onset = cross(pre), end = cross(post);
  // midpoint: where the curve is halfway between the two baselines (half-height)
  let Tmid = NaN; const f = (q: Pt) => q.y - ((pre.m * q.T + pre.c) + (post.m * q.T + post.c)) / 2;
  for (let i = 1; i < w.length; i++) { const f0 = f(w[i - 1]), f1 = f(w[i]); if (Math.sign(f0) !== Math.sign(f1) && w[i].T > onset - 0.1 * span && w[i - 1].T < end + 0.1 * span) { Tmid = w[i - 1].T + (f0 / (f0 - f1)) * (w[i].T - w[i - 1].T); break; } }
  const dy = (post.m * Tmid + post.c) - (pre.m * Tmid + pre.c);
  return { onset, mid: Tmid, inflection: Ti, end, step: dy, pre, post, slope: mi, yi };
}

/** Peak in [a, b] above a straight baseline joining the window ends. area = ∫(y − baseline) dT (y units × K).
 *  Returns the extremum away from the baseline, the extrapolated onset on the leading edge and the end set. */
export function peak(p: Pt[], a: number, b: number, h: number) {
  const w = inWin(p, a, b); if (w.length < 10) return null;
  const n = Math.max(2, Math.round(w.length * 0.02)), ya = w.slice(0, n).reduce((s, q) => s + q.y, 0) / n, yb = w.slice(-n).reduce((s, q) => s + q.y, 0) / n;
  const Ta = w.slice(0, n).reduce((s, q) => s + q.T, 0) / n, Tb = w.slice(-n).reduce((s, q) => s + q.T, 0) / n;
  const base = (T: number) => ya + ((yb - ya) * (T - Ta)) / (Tb - Ta || 1);
  let area = 0; for (let i = 1; i < w.length; i++) area += ((w[i].y - base(w[i].T) + w[i - 1].y - base(w[i - 1].T)) / 2) * (w[i].T - w[i - 1].T);
  const sg = Math.sign(area) || 1;
  let k = 0; for (let i = 0; i < w.length; i++) if (sg * (w[i].y - base(w[i].T)) > sg * (w[k].y - base(w[k].T))) k = i;
  const d = slope(w, h);
  let j = 0; for (let i = 0; i <= k; i++) if (sg * (d[i] - (yb - ya) / (Tb - Ta)) > sg * (d[j] - (yb - ya) / (Tb - Ta))) j = i;
  let e = k; for (let i = k; i < w.length; i++) if (sg * (d[i] - (yb - ya) / (Tb - Ta)) < sg * (d[e] - (yb - ya) / (Tb - Ta))) e = i;
  const bm = (yb - ya) / (Tb - Ta || 1), bc = ya - bm * Ta;
  const cross = (i: number) => (w[i].y - d[i] * w[i].T - bc) / (bm - d[i]);
  const height = w[k].y - base(w[k].T);
  let half: number[] = []; for (let i = 1; i < w.length; i++) { const f0 = sg * (w[i - 1].y - base(w[i - 1].T)) - sg * height / 2, f1 = sg * (w[i].y - base(w[i].T)) - sg * height / 2; if (Math.sign(f0) !== Math.sign(f1)) half.push(w[i - 1].T + (f0 / (f0 - f1)) * (w[i].T - w[i - 1].T)); }
  return { Tpeak: w[k].T, height, area, onset: cross(j), endset: cross(e), fwhm: half.length >= 2 ? half[half.length - 1] - half[0] : NaN, base: { ya, yb, Ta, Tb } };
}

/** Heat flow unit conversion to W/g: mW with sample mass in mg, or already W/g. */
export const toWg = (y: number, unit: 'mW' | 'W/g', mass: number) => (unit === 'mW' ? y / mass : y);
/** Enthalpy (J/g) from a peak area in (W/g)·K at a heating rate β (K/min). */
export const enthalpy = (areaWgK: number, beta: number) => areaWgK / (beta / 60);
/** ΔCp (J/(g·K)) from a step in W/g at β (K/min). */
export const deltaCp = (stepWg: number, beta: number) => stepWg / (beta / 60);

/** ΔH of 100 % crystalline polymer (J/g), common literature values (Wunderlich ATHAS and others). */
export const DH100 = [
  { id: 'PET', name: 'PET', dh: 140 }, { id: 'PE', name: 'Polyethylene', dh: 293 }, { id: 'PP', name: 'Polypropylene (isotactic)', dh: 207 },
  { id: 'PLA', name: 'PLA', dh: 93 }, { id: 'PA6', name: 'Nylon 6', dh: 230 }, { id: 'PA66', name: 'Nylon 6,6', dh: 196 },
  { id: 'PEEK', name: 'PEEK', dh: 130 }, { id: 'PBT', name: 'PBT', dh: 140 }, { id: 'PCL', name: 'Polycaprolactone', dh: 139 },
  { id: 'POM', name: 'Polyoxymethylene', dh: 326 }, { id: 'PVDF', name: 'PVDF', dh: 105 }, { id: 'PHB', name: 'PHB', dh: 146 },
];
/** Crystallinity (fraction) = (ΣΔH endotherms − ΣΔH exotherms) / (ΔH100 · polymer weight fraction). */
export const crystallinity = (dhMelt: number, dhCold: number, dh100: number, wPolymer = 1) => (dhMelt - dhCold) / (dh100 * wPolymer);

/** TGA: mass as % of the first value, DTG = −dm/dT (%/°C), and the mass loss steps. */
export function tga(p: Pt[], h: number, minLoss = 0.5) {
  const m0 = p[0].y, pc = p.map((q) => ({ T: q.T, y: (q.y / m0) * 100 })), dtg = slope(pc, h).map((s) => -s);
  const mx = Math.max(...dtg), thr = Math.max(0.05 * mx, 1e-4);
  // peaks of DTG above the threshold, split at the lowest DTG between neighbours
  const peaks: number[] = [];
  for (let i = 1; i < pc.length - 1; i++) if (dtg[i] > thr && dtg[i] >= dtg[i - 1] && dtg[i] > dtg[i + 1]) { if (peaks.length && pc[i].T - pc[peaks[peaks.length - 1]].T < 2 * h) { if (dtg[i] > dtg[peaks[peaks.length - 1]]) peaks[peaks.length - 1] = i; } else peaks.push(i); }
  const bounds: number[] = [0];
  for (let k = 0; k + 1 < peaks.length; k++) { let lo = peaks[k]; for (let i = peaks[k]; i <= peaks[k + 1]; i++) if (dtg[i] < dtg[lo]) lo = i; bounds.push(lo); }
  bounds.push(pc.length - 1);
  const steps: { start: number; end: number; Tpeak: number; rate: number; loss: number; onset: number; endset: number; mStart: number; mEnd: number }[] = [];
  peaks.forEach((pk, k) => {
    let s = bounds[k], e = bounds[k + 1];
    while (s < pk && dtg[s] < 0.02 * dtg[pk] && s + 1 < pk) s++; // tighten to where the loss starts
    while (e > pk && dtg[e] < 0.02 * dtg[pk] && e - 1 > pk) e--;
    const mStart = pc[bounds[k]].y, mEnd = pc[bounds[k + 1]].y; // plateaux either side, so the steps add up to 100 − residue
    const r = dtg[pk], onset = pc[pk].T - (mStart - pc[pk].y) / r, endset = pc[pk].T + (pc[pk].y - mEnd) / r;
    steps.push({ start: pc[s].T, end: pc[e].T, Tpeak: pc[pk].T, rate: r, loss: mStart - mEnd, onset, endset, mStart, mEnd });
  });
  // merge steps smaller than minLoss into the neighbour
  const big = steps.filter((s) => s.loss >= minLoss);
  const Tloss = (x: number) => { for (let i = 1; i < pc.length; i++) if (pc[i].y <= 100 - x) { const f = (pc[i - 1].y - (100 - x)) / (pc[i - 1].y - pc[i].y || 1); return pc[i - 1].T + f * (pc[i].T - pc[i - 1].T); } return NaN; };
  return { pc, dtg, steps: big, residue: pc[pc.length - 1].y, T5: Tloss(5), T10: Tloss(10), m0 };
}

export const FRAGMENTS = ['H2O', 'CO', 'CO2', 'NH3', 'HCl', 'HF', 'HBr', 'SO2', 'SO3', 'NO2', 'N2', 'O2', 'Cl2', 'CH4', 'C2H4', 'CH3OH', 'CH3COOH'];
/** Fragment (n × formula) whose share of the starting formula's molar mass is closest to the loss (%); within tol. */
export function matchFragment(loss: number, M0: number, tol = 1) {
  let best: { frag: string; n: number; pct: number } | null = null;
  for (const f of FRAGMENTS) { const M = molarMass(parseFormula(f)); for (let n = 1; n <= 6; n++) { const pct = (100 * n * M) / M0; if (Math.abs(pct - loss) <= tol && (!best || Math.abs(pct - loss) < Math.abs(best.pct - loss))) best = { frag: f, n, pct }; } }
  return best;
}

/** Simulated DSC of quenched amorphous PET (10 mg, 10 K/min, mW, endo down): Tg 78 °C, ΔCp 0.40 J/(g·K),
 *  cold crystallisation −25 J/g at 135 °C, melting 40 J/g at 250 °C. */
export function exampleDSC() {
  const m = 10, b = 10 / 60, rows: [number, number][] = [];
  const g = (T: number, c: number, s: number) => Math.exp(-((T - c) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI));
  for (let T = 25; T <= 290 + 1e-9; T += 0.25) {
    const cp = 1.1 + 0.002 * (T - 25) + 0.4 / (1 + Math.exp(-(T - 78) / 1.2));
    const endo = m * b * cp - 25 * m * b * g(T, 135, 5) + 40 * m * b * g(T, 250, 4);
    rows.push([+T.toFixed(2), +(-endo + 0.002 * Math.sin(T * 7.3)).toFixed(5)]);
  }
  return rows;
}
/** Simulated TGA of calcium oxalate monohydrate (10.000 mg at 10 K/min): H₂O, then CO, then CO₂. */
export function exampleTGA() {
  const M = 146.11, l = [18.015, 28.01, 44.009].map((x) => (100 * x) / M), rows: [number, number][] = [];
  const S = (T: number, c: number, w: number) => 1 / (1 + Math.exp(-(T - c) / w));
  for (let T = 30; T <= 900 + 1e-9; T += 1) rows.push([T, +(10 * (100 - l[0] * S(T, 175, 9) - l[1] * S(T, 495, 8) - l[2] * S(T, 735, 12)) / 100 + 0.0004 * Math.sin(T)).toFixed(5)]);
  return rows;
}
