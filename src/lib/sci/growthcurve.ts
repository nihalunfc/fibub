// Bacterial growth curves from OD600 readings: blank subtraction, the exponential phase (the window of
// readings with the steepest slope of ln OD, or a time range chosen by hand), growth rate, doubling time,
// lag time by the tangent method, the highest OD, and optional fits of the logistic or Gompertz model in
// the form of Zwietering et al. (1990), y = ln(OD / OD0) with the parameters A, µm and λ.
// Plain TypeScript, no DOM. The example readings are made up.
import { fitLine, levenbergMarquardt } from './fit.ts';
import { tInv } from './stats.ts';
import { num, parseTable } from './num.ts';

export const LN2 = Math.LN2;
export type Model = 'none' | 'logistic' | 'gompertz';
export type Blank = { kind: 'none' } | { kind: 'value'; value: number } | { kind: 'column'; index: number };

/**
 * A time cell as hours: a plain number in the chosen unit, or a clock duration "h:mm" / "h:mm:ss"
 * (as many plate readers write it), which is always hours, minutes and seconds.
 */
export function parseTime(s: string, unit: 'h' | 'min' = 'h'): number {
  const t = String(s ?? '').trim();
  const m = /^(\d+):([0-5]?\d)(?::([0-5]?\d(?:\.\d+)?))?$/.exec(t);
  if (m) return +m[1] + +m[2] / 60 + (m[3] ? +m[3] / 3600 : 0);
  const v = num(t);
  return unit === 'min' ? v / 60 : v;
}

export type Table = { names: string[]; time: number[]; cols: number[][]; errors: string[] };
/**
 * A pasted table: the first column is time, every other column one culture (or well). A first row
 * that is not numbers gives the names. Rows without a readable time are left out and listed in errors;
 * an empty or unreadable OD cell is a missing reading for that culture only.
 */
export function parseGrowthTable(text: string, unit: 'h' | 'min' = 'h'): Table {
  const rows = parseTable(text);
  const errors: string[] = [];
  if (!rows.length) return { names: [], time: [], cols: [], errors };
  const width = Math.max(...rows.map((r) => r.length));
  const head = rows[0].slice(1).some((c) => c !== '' && Number.isNaN(num(c))) || (rows[0][0] !== '' && Number.isNaN(parseTime(rows[0][0], unit)));
  const names = Array.from({ length: width - 1 }, (_, i) => (head && rows[0][i + 1]?.trim()) || `Culture ${i + 1}`);
  const time: number[] = [], cols: number[][] = names.map(() => []);
  rows.slice(head ? 1 : 0).forEach((r, k) => {
    const t = parseTime(r[0], unit);
    if (!Number.isFinite(t)) { errors.push(`Line ${k + (head ? 2 : 1)}: "${r[0]}" is not a time.`); return; }
    time.push(t);
    names.forEach((_, i) => cols[i].push(num(r[i + 1])));
  });
  return { names, time, cols, errors };
}

/** The OD to take away from every reading. A blank column gives the mean of its readings. */
export function blankValue(b: Blank, cols: number[][]): number {
  if (b.kind === 'value') return b.value;
  if (b.kind === 'column') {
    const v = (cols[b.index] ?? []).filter(Number.isFinite);
    if (!v.length) throw new Error('The blank column has no readings.');
    return v.reduce((s, x) => s + x, 0) / v.length;
  }
  return 0;
}

/** The Zwietering (1990) curves: y = ln(N / N0) against time with asymptote A, rate µm and lag λ. */
export function zwietering(kind: 'logistic' | 'gompertz', t: number, A: number, mu: number, lam: number): number {
  if (kind === 'gompertz') return A * Math.exp(-Math.exp((mu * Math.E / A) * (lam - t) + 1));
  return A / (1 + Math.exp((4 * mu / A) * (lam - t) + 2));
}

export type ModelFit = {
  kind: 'logistic' | 'gompertz'; A: number; mu: number; lag: number; seA: number; seMu: number; seLag: number;
  td: number; odMax: number; r2: number; sse: number; s: number; n: number; converged: boolean;
};
export type Options = {
  /** Readings in the sliding window (3 or more) when the window is found automatically. */
  window: number;
  /** A time range [from, to] in hours chosen by hand; leave out to find the window automatically. */
  manual?: [number, number];
  /** Readings below this OD (after the blank) are too close to the blank for ln OD and are not used. */
  minOd: number;
  model: Model;
  conf?: number;
};
export type Result = {
  name: string;
  /** Sorted readings in hours and OD after the blank; use = at or above the lowest OD. */
  t: number[]; od: number[]; use: boolean[];
  /** Indices (into t and od) of the readings in the exponential window. */
  win: number[]; auto: boolean;
  mu: number; muLo: number; muHi: number; seMu: number; df: number;
  td: number; tdLo: number; tdHi: number;
  intercept: number; r2: number;
  od0: number; t0: number; lag: number;
  odMax: number; tMax: number;
  model: ModelFit | null;
  warn: string[];
};

/** Fit one culture. Throws an Error with a plain message when it cannot be analysed. */
export function analyse(name: string, time: number[], odRaw: number[], blank: number, o: Options): Result {
  const conf = o.conf ?? 0.95;
  const pts = time.map((t, i) => ({ t, od: odRaw[i] - blank })).filter((p) => Number.isFinite(p.t) && Number.isFinite(p.od)).sort((a, b) => a.t - b.t);
  if (pts.length < 3) throw new Error(`${name}: needs at least 3 readings.`);
  const t = pts.map((p) => p.t), od = pts.map((p) => p.od);
  const minOd = o.minOd > 0 ? o.minOd : 1e-9;
  const use = od.map((v) => v >= minOd);
  const ui = use.map((u, i) => (u ? i : -1)).filter((i) => i >= 0);
  if (ui.length < 3) throw new Error(`${name}: fewer than 3 readings are above the lowest OD (${minOd}) after the blank. Check the blank, or lower the lowest OD.`);
  const warn: string[] = [];
  let win: number[];
  if (o.manual) {
    const [a, b] = o.manual[0] <= o.manual[1] ? o.manual : [o.manual[1], o.manual[0]];
    win = ui.filter((i) => t[i] >= a - 1e-9 && t[i] <= b + 1e-9);
    if (win.length < 3) throw new Error(`${name}: only ${win.length} reading${win.length === 1 ? '' : 's'} above the lowest OD between ${a} and ${b} h; the window needs at least 3.`);
  } else {
    const w = Math.round(o.window);
    if (!(w >= 3)) throw new Error('The window needs at least 3 readings.');
    if (ui.length < w) throw new Error(`${name}: only ${ui.length} readings are above the lowest OD, fewer than the ${w} in the window.`);
    let best = -Infinity; win = [];
    for (let s = 0; s + w <= ui.length; s++) {
      const idx = ui.slice(s, s + w);
      if (new Set(idx.map((i) => t[i])).size < 2) continue;
      const f = fitLine(idx.map((i) => t[i]), idx.map((i) => Math.log(od[i])));
      if (f.slope > best + 1e-12) { best = f.slope; win = idx; }
    }
    if (!win.length) throw new Error(`${name}: the readings need at least two different times.`);
  }
  if (new Set(win.map((i) => t[i])).size < 2) throw new Error(`${name}: the window needs readings at two or more different times.`);
  const f = fitLine(win.map((i) => t[i]), win.map((i) => Math.log(od[i])));
  const mu = f.slope;
  if (!(mu > 0)) throw new Error(`${name}: the OD does not rise in the ${o.manual ? 'chosen' : 'steepest'} window, so there is no growth rate.`);
  const q = tInv(1 - (1 - conf) / 2, f.df), muLo = mu - q * f.seSlope, muHi = mu + q * f.seSlope;
  const td = LN2 / mu, tdLo = LN2 / muHi, tdHi = muLo > 0 ? LN2 / muLo : Infinity;
  const i0 = ui[0], od0 = od[i0], t0 = t[i0];
  const lag = (Math.log(od0) - f.intercept) / mu;
  let iMax = 0; od.forEach((v, i) => { if (v > od[iMax]) iMax = i; });
  const odMax = od[iMax], tMax = t[iMax];
  if (f.r2 < 0.98) warn.push(`The readings in the window are not on a straight line on a log scale (R² = ${f.r2.toFixed(3)}). Choose the window by hand, or use more readings in it.`);
  if (!o.manual && win[win.length - 1] === ui[ui.length - 1]) warn.push('Growth is fastest at the last readings, so the culture had not slowed down yet: the highest OD is just the last reading, and a model fit cannot find the plateau. Read for longer next time.');
  if (lag < 0) warn.push('The tangent meets the starting OD before the first reading (lag below 0): the culture was already growing when you started.');
  if (win.some((i) => od[i] + blank > 1)) warn.push('Some readings in the window are above OD 1. Many spectrophotometers stop being linear up there; dilute those samples and multiply back.');
  let model: ModelFit | null = null;
  if (o.model !== 'none') {
    const kind = o.model;
    const x = ui.map((i) => t[i]), y = ui.map((i) => Math.log(od[i] / od0));
    const A0 = Math.log(odMax / od0);
    if (x.length < 5) warn.push(`The ${kind} model needs at least 5 readings above the lowest OD.`);
    else if (!(A0 > 0)) warn.push(`The OD never rises above the first reading, so the ${kind} model cannot be fitted.`);
    else {
      try {
        const nl = levenbergMarquardt((tt, p) => zwietering(kind, tt, p[0], p[1], p[2]), x, y, [A0, mu, Math.max(lag, t0)], { maxIter: 1000 });
        const [A, m, l] = nl.p;
        if (!(A > 0 && m > 0) || !nl.p.every(Number.isFinite)) throw new Error('bad');
        model = { kind, A, mu: m, lag: l, seA: nl.se[0], seMu: nl.se[1], seLag: nl.se[2], td: LN2 / m, odMax: od0 * Math.exp(A), r2: nl.r2, sse: nl.sse, s: nl.s, n: x.length, converged: nl.converged };
        if (nl.r2 < 0.98) warn.push(`The ${kind} curve does not follow the readings closely (R² = ${nl.r2.toFixed(3)}).`);
      } catch {
        warn.push(`The ${kind} model could not be fitted to these readings.`);
      }
    }
  }
  return { name, t, od, use, win, auto: !o.manual, mu, muLo, muHi, seMu: f.seSlope, df: f.df, td, tdLo, tdHi, intercept: f.intercept, r2: f.r2, od0, t0, lag, odMax, tMax, model, warn };
}

/** The tangent (fitted straight line on ln OD) as OD at time t. */
export const tangent = (r: Pick<Result, 'intercept' | 'mu'>, t: number) => Math.exp(r.intercept + r.mu * t);
/** The fitted model as OD at time t. */
export const modelOd = (r: Pick<Result, 'od0' | 'model'>, t: number) => (r.model ? r.od0 * Math.exp(zwietering(r.model.kind, t, r.model.A, r.model.mu, r.model.lag)) : NaN);

/** Made-up readings: OD600 every 30 minutes for three strains and a medium-only blank. */
export const EXAMPLE = `Time (h)	Strain A	Strain B	Strain C	Blank
0	0.064	0.063	0.065	0.043
0.5	0.067	0.066	0.063	0.045
1	0.068	0.065	0.062	0.046
1.5	0.073	0.067	0.064	0.045
2	0.081	0.070	0.064	0.046
2.5	0.095	0.074	0.066	0.045
3	0.115	0.081	0.067	0.044
3.5	0.155	0.089	0.071	0.044
4	0.215	0.108	0.075	0.043
4.5	0.286	0.128	0.080	0.048
5	0.399	0.163	0.091	0.044
5.5	0.520	0.196	0.099	0.044
6	0.657	0.246	0.118	0.047
6.5	0.788	0.307	0.132	0.046
7	0.914	0.385	0.153	0.046
7.5	1.015	0.454	0.184	0.043
8	1.154	0.526	0.211	0.045
8.5	1.280	0.623	0.234	0.044
9	1.348	0.688	0.279	0.045
9.5	1.482	0.747	0.319	0.047
10	1.470	0.835	0.354	0.045
10.5	1.503	0.882	0.398	0.048
11	1.537	0.951	0.434	0.046
11.5	1.563	0.978	0.474	0.045
12	1.584	1.008	0.489	0.045
12.5	1.597	1.072	0.537	0.047
13	1.611	1.127	0.560	0.048
13.5	1.615	1.128	0.584	0.044
14	1.638	1.163	0.615	0.045
`;
