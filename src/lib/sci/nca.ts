// Non-compartmental pharmacokinetic (NCA) analysis of one measured concentration-time profile, following the
// conventions of PKNCA (Denney, Duvvuri and Buckeridge 2015) and Phoenix WinNonlin: linear or linear-up/log-down
// trapezoids, lambda_z from a log-linear fit of the terminal points (best adjusted R², ties within 1e-4 go to the
// fit with more points), and the usual derived values. Plain maths, no DOM. Units are whatever the user's are.

export type Route = 'ev' | 'bolus' | 'infusion';
export type AucMethod = 'linear' | 'linlog';
export type LambdaChoice = { mode: 'best' } | { mode: 'range'; from: number; to: number };
export type NcaOpts = { route: Route; method: AucMethod; dose?: number; tinf?: number; lambda?: LambdaChoice };
export type Pt = { t: number; c: number; added?: 'zero' | 'c0' };
export type Terminal = { lambda: number; intercept: number; r2: number; adjR2: number; n: number; from: number; to: number; used: number[] };
export type NcaResult = {
  pts: Pt[]; cmax: number; tmax: number; tlast: number; clast: number; c0?: number;
  aucLast: number; aumcLast: number; mrtLast: number;
  term: Terminal | null; halfLife: number; clastPred: number;
  aucInf: number; aucInfPred: number; extrap: number; aumcInf: number; mrtInf: number;
  cl: number; vz: number; vss: number; spanRatio: number;
  /** AUC and AUMC piece by piece, for the table. */
  pieces: { t1: number; t2: number; auc: number; aumc: number; log: boolean }[];
  notes: string[];
};

/** One trapezoid piece of AUC and AUMC between two points. */
export function piece(t1: number, c1: number, t2: number, c2: number, method: AucMethod) {
  const dt = t2 - t1;
  if (method === 'linlog' && c2 < c1 && c2 > 0 && c1 > 0) {
    const L = Math.log(c2 / c1);
    return { auc: ((c1 - c2) * dt) / -L, aumc: (dt * (t2 * c2 - t1 * c1)) / L - (dt * dt * (c2 - c1)) / (L * L), log: true };
  }
  return { auc: ((c1 + c2) * dt) / 2, aumc: ((t1 * c1 + t2 * c2) * dt) / 2, log: false };
}

/** Least-squares line through ln(c) against t. */
export function logLinear(t: number[], c: number[]) {
  const n = t.length, y = c.map(Math.log);
  const mt = t.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
  let sxx = 0, sxy = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxx += (t[i] - mt) ** 2; sxy += (t[i] - mt) * (y[i] - my); syy += (y[i] - my) ** 2; }
  const slope = syy > 0 ? sxy / sxx : 0, intercept = my - slope * mt;
  const r2 = syy > 0 ? (sxy * sxy) / (sxx * syy) : NaN;
  const adjR2 = n > 2 ? 1 - ((1 - r2) * (n - 1)) / (n - 2) : NaN;
  return { slope, intercept, r2, adjR2 };
}

/** Read a pasted profile: [time, conc] rows, sorted, checked. Throws plain-English errors. */
export function cleanProfile(rows: [number, number][]): Pt[] {
  const pts = rows.filter(([t, c]) => Number.isFinite(t) && Number.isFinite(c)).map(([t, c]) => ({ t, c })).sort((a, b) => a.t - b.t);
  if (pts.length < 3) throw new Error('Enter at least 3 rows of time and concentration.');
  if (pts.length > 5000) throw new Error('That is more than 5,000 time points. Is this one profile?');
  if (pts.some((p) => p.t < 0)) throw new Error('Times must be zero or more (time after the start of administration).');
  if (pts.some((p) => p.c < 0)) throw new Error('Concentrations cannot be negative. Enter values below the limit of quantification as 0.');
  for (let i = 1; i < pts.length; i++) if (pts[i].t === pts[i - 1].t) throw new Error(`The time ${pts[i].t} appears twice. Use one row per time (average replicates first).`);
  if (!pts.some((p) => p.c > 0)) throw new Error('Every concentration is zero.');
  return pts;
}

export function nca(raw: Pt[], o: NcaOpts): NcaResult {
  const obs = raw.map((p) => ({ t: p.t, c: p.c }));
  const notes: string[] = [];
  const pts: Pt[] = obs.slice();
  let c0: number | undefined;
  if (o.route === 'infusion' && !(o.tinf! > 0)) throw new Error('Enter the infusion duration (longer than 0).');
  if (o.route === 'bolus') {
    if (obs[0].t === 0) c0 = obs[0].c;
    else {
      const [a, b] = obs;
      if (a.c > 0 && b.c > 0 && b.c < a.c) { c0 = Math.exp(Math.log(a.c) - ((Math.log(b.c) - Math.log(a.c)) / (b.t - a.t)) * a.t); notes.push('C0 back-extrapolated (log-linear) from the first two points.'); }
      else { c0 = obs.find((p) => p.c > 0)!.c; notes.push('C0 set to the first measured concentration (the first two points do not fall).'); }
      pts.unshift({ t: 0, c: c0, added: 'c0' });
    }
  } else if (obs[0].t > 0) { pts.unshift({ t: 0, c: 0, added: 'zero' }); notes.push('A concentration of 0 at time 0 was added (pre-dose).'); }
  else if (obs[0].c > 0) notes.push('The time-0 concentration is not 0: check for a pre-dose level or carry-over.');

  // Cmax and Tmax from the measured points (first time the maximum is reached).
  let im = 0;
  obs.forEach((p, i) => { if (p.c > obs[im].c) im = i; });
  const cmax = obs[im].c, tmax = obs[im].t;
  let il = obs.length - 1;
  while (obs[il].c <= 0) il--;
  const tlast = obs[il].t, clast = obs[il].c;

  // AUC and AUMC from 0 to Tlast.
  const pieces: NcaResult['pieces'] = [];
  let aucLast = 0, aumcLast = 0;
  for (let i = 1; i < pts.length && pts[i].t <= tlast; i++) {
    const p = piece(pts[i - 1].t, pts[i - 1].c, pts[i].t, pts[i].c, o.method);
    pieces.push({ t1: pts[i - 1].t, t2: pts[i].t, ...p });
    aucLast += p.auc; aumcLast += p.aumc;
  }
  const mrtCorr = o.route === 'infusion' ? o.tinf! / 2 : 0;

  // Terminal phase.
  let term: Terminal | null = null;
  const choice = o.lambda ?? { mode: 'best' };
  const cand = obs.map((p, i) => ({ ...p, i })).filter((p) => p.c > 0 && p.t <= tlast);
  if (choice.mode === 'best') {
    const start = o.route === 'bolus' ? tmax : tmax + 1e-12; // Cmax may be used after a bolus, not after absorption or infusion.
    const pool = cand.filter((p) => p.t >= start && (o.route !== 'infusion' || p.t >= o.tinf!));
    // PKNCA rule: of the fits within 1e-4 of the best adjusted R², take the one with the most points.
    const all: Terminal[] = [];
    for (let n = 3; n <= pool.length; n++) {
      const use = pool.slice(pool.length - n), f = logLinear(use.map((p) => p.t), use.map((p) => p.c));
      if (f.slope < 0) all.push({ lambda: -f.slope, intercept: f.intercept, r2: f.r2, adjR2: f.adjR2, n, from: use[0].t, to: use[n - 1].t, used: use.map((p) => p.i) });
    }
    const top = Math.max(...all.map((a) => a.adjR2));
    term = all.filter((a) => a.adjR2 >= top - 1e-4).sort((a, b) => b.n - a.n)[0] ?? null;
    if (!term) notes.push(pool.length < 3 ? 'Fewer than 3 positive points after Cmax: lambda_z cannot be estimated, so AUC0-inf and the values from it are not given.' : 'No set of the last points falls with time: lambda_z cannot be estimated.');
  } else {
    const use = cand.filter((p) => p.t >= choice.from && p.t <= choice.to);
    if (use.length < 3) throw new Error('Choose at least 3 points with a concentration above 0 for the terminal phase.');
    const f = logLinear(use.map((p) => p.t), use.map((p) => p.c));
    if (!(f.slope < 0)) throw new Error('The chosen points do not fall with time, so there is no terminal half-life. Choose later points.');
    term = { lambda: -f.slope, intercept: f.intercept, r2: f.r2, adjR2: f.adjR2, n: use.length, from: use[0].t, to: use[use.length - 1].t, used: use.map((p) => p.i) };
    if (use.some((p) => p.t <= tmax) && o.route !== 'bolus') notes.push('The chosen points include Cmax or earlier: the terminal phase usually starts after the peak.');
  }

  const L = term?.lambda ?? NaN;
  const halfLife = Math.LN2 / L;
  const clastPred = term ? Math.exp(term.intercept - L * tlast) : NaN;
  const aucInf = aucLast + clast / L, aucInfPred = aucLast + clastPred / L;
  const extrap = ((aucInf - aucLast) / aucInf) * 100;
  const aumcInf = aumcLast + (tlast * clast) / L + clast / (L * L);
  const mrtInf = aumcInf / aucInf - mrtCorr;
  const dose = o.dose && o.dose > 0 ? o.dose : NaN;
  const cl = dose / aucInf, vz = cl / L, vss = o.route === 'ev' ? NaN : mrtInf * cl;
  const spanRatio = term ? (term.to - term.from) / halfLife : NaN;
  if (term) {
    if (extrap > 20) notes.push(`${extrap.toFixed(1)} % of AUC0-inf is extrapolated (over 20 %): AUC0-inf, CL and V are unreliable; sample for longer.`);
    if (term.adjR2 < 0.9) notes.push('The adjusted R² of the terminal fit is below 0.9: check the terminal points.');
    if (spanRatio < 2) notes.push('The terminal points span less than 2 half-lives, so the half-life is uncertain.');
  }
  return { pts, cmax, tmax, tlast, clast, c0, aucLast, aumcLast, mrtLast: aumcLast / aucLast - mrtCorr, term, halfLife, clastPred, aucInf, aucInfPred, extrap, aumcInf, mrtInf, cl, vz, vss, spanRatio, pieces, notes };
}

/** Units: dose to mg, concentration to mg/L, so CL comes out in L per time unit and V in L. */
export const DOSE_MG: Record<string, number> = { mg: 1, 'µg': 1e-3, ng: 1e-6, g: 1000 };
export const CONC_MGL: Record<string, number> = { 'ng/mL': 1e-3, 'µg/mL': 1, 'mg/L': 1, 'µg/L': 1e-3, 'ng/L': 1e-6, 'mg/mL': 1000 };
