// Walter-Lieth climate diagram (Walter and Lieth, Klimadiagramm-Weltatlas, 1960 to 1967), drawn from 12 monthly
// mean temperatures and precipitation totals, with the optional mean daily maximum, mean daily minimum and absolute
// minimum of each month. Conventions: 10 °C on the left matches 20 mm on the right (P = 2T), so the curves cross where
// Walter's rule puts the edge of the dry season; above 100 mm the precipitation scale is compressed ten times
// (10 °C = 200 mm) and drawn solid. Dry periods (temperature above precipitation) are dotted, humid periods hatched.
// Frost: months whose mean daily minimum is below 0 °C (sure frost, solid) and months whose absolute minimum is below
// 0 °C (probable frost, hatched). The curves run straight from mid-month to mid-month and wrap from December to January.
// The dry-season length is found exactly from those straight pieces (checked against dense sampling in NumPy).
import type { Painter } from './plot.ts';

export type Monthly = { T: number[]; P: number[]; tmax?: number[]; tmin?: number[]; amin?: number[] };
export const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Precipitation (mm) to the diagram's y scale in °C units: P/2 up to 100 mm, then 10 °C per 200 mm. */
export const pScale = (p: number) => (p <= 100 ? p / 2 : 50 + (p - 100) / 20);
/** Inverse of pScale. */
export const pUnscale = (y: number) => (y <= 50 ? y * 2 : 100 + (y - 50) * 20);

/** Order the 12 months for the diagram: July first in the southern hemisphere, so summer sits in the middle. */
export function order<T>(a: T[], south: boolean): T[] { return south ? [...a.slice(6), ...a.slice(0, 6)] : [...a]; }

/** Value at x (0..12) of the straight-line curve through mid-month points v[i] at x = i + 0.5, wrapping Dec to Jan. */
export function at(v: number[], x: number) {
  const u = x - 0.5, i = Math.floor(u), f = u - i;
  const a = v[(i + 12) % 12], b = v[(i + 13) % 12];
  return a + (b - a) * f;
}

/** The pieces of the year (as x ranges in 0..12) where temperature is above P/2: the dry periods. */
export function dryPeriods(T: number[], P: number[]) {
  // Knots at 0, 0.5, 1.5, ..., 11.5, 12; between knots both curves are straight, so d = P/2 − T is too.
  const knots = [0, ...Array.from({ length: 12 }, (_, i) => i + 0.5), 12];
  const d = (x: number) => at(P, x) / 2 - at(T, x);
  const out: [number, number][] = [], cross: number[] = [];
  let start: number | null = d(0) < 0 ? 0 : null;
  for (let k = 0; k < knots.length - 1; k++) {
    const x0 = knots[k], x1 = knots[k + 1], d0 = d(x0), d1 = d(x1);
    if ((d0 < 0) !== (d1 < 0)) {
      const xc = d0 === d1 ? x0 : x0 + (x1 - x0) * (d0 / (d0 - d1));
      cross.push(xc);
      if (d1 < 0) start = xc; else if (start != null) { out.push([start, xc]); start = null; }
    }
  }
  if (start != null) out.push([start, 12]);
  // Join a period that runs over the year end (Dec into Jan) into one.
  if (out.length > 1 && out[0][0] === 0 && out[out.length - 1][1] === 12) { const last = out.pop()!; out[0] = [last[0], out[0][1] + 12]; }
  const length = out.reduce((s, [a, b]) => s + (b - a), 0);
  return { periods: out, length, crossings: cross };
}

export type Layout = {
  T: number[]; P: number[]; labels: string[]; yMin: number; yMax: number;
  /** Vertical lines [x, y0, y1] in data units: dotted for dry, hatched for humid. */
  dry: [number, number, number][]; humid: [number, number, number][];
  /** Polygons (data units) where precipitation is above 100 mm, drawn solid. */
  solid: [number, number][][];
  tCurve: [number, number][]; pCurve: [number, number][];
  frostSure: boolean[]; frostProb: boolean[];
  stats: {
    annualT: number; annualP: number; dryMonths: number; wetMonths: number; dryLength: number; periods: [number, number][];
    warmMax: number | null; coldMin: number | null; absMin: number | null; frostSure: number; frostProb: number;
  };
};

/** Everything needed to draw the diagram, in data units: x from 0 to 12, y in °C (precipitation through pScale). */
export function layout(m: Monthly, south = false, step = 1 / 12): Layout {
  const T = order(m.T, south), P = order(m.P, south);
  const tmin = m.tmin && order(m.tmin, south), amin = m.amin && order(m.amin, south), tmax = m.tmax && order(m.tmax, south);
  const xs: number[] = []; for (let x = 0; x <= 12 + 1e-9; x += step) xs.push(+x.toFixed(9));
  const dp = dryPeriods(T, P);
  // Insert the exact crossings so the shading meets the curves there.
  const all = [...new Set([...xs, ...dp.crossings])].sort((a, b) => a - b);
  const dry: [number, number, number][] = [], humid: [number, number, number][] = [];
  for (const x of xs) {
    const t = at(T, x), p = at(P, x), py = pScale(p), ph = p / 2;
    if (t > ph) dry.push([x, ph, t]); else if (ph > t) humid.push([x, t, Math.min(py, 50)]);
  }
  const solid: [number, number][][] = [];
  let cur: [number, number][] | null = null;
  const fine: number[] = []; for (let x = 0; x <= 12 + 1e-9; x += 1 / 96) fine.push(+x.toFixed(9));
  for (const x of fine) {
    const p = at(P, x);
    if (p > 100) { if (!cur) { cur = []; solid.push(cur); } cur.push([x, pScale(p)]); }
    else if (cur) { closeSolid(cur); cur = null; }
  }
  if (cur) closeSolid(cur);
  function closeSolid(c: [number, number][]) { const a = c[0][0], b = c[c.length - 1][0]; c.push([b, 50], [a, 50]); }
  const tCurve = all.map((x) => [x, at(T, x)] as [number, number]);
  const pCurve = fine.map((x) => [x, pScale(at(P, x))] as [number, number]);
  const frostSure = tmin ? tmin.map((v) => v < 0) : T.map(() => false);
  const frostProb = amin ? amin.map((v, i) => v < 0 && !frostSure[i]) : T.map(() => false);
  const yTop = Math.max(...pCurve.map((p) => p[1]), ...T, 0);
  const yMin = Math.min(0, Math.floor(Math.min(...T) / 10) * 10);
  const yMax = Math.max(30, Math.ceil((yTop + 1e-9) / 10) * 10);
  return {
    T, P, labels: order(MONTHS, south), yMin, yMax, dry, humid, solid, tCurve, pCurve, frostSure, frostProb,
    stats: {
      annualT: T.reduce((s, v) => s + v, 0) / 12, annualP: P.reduce((s, v) => s + v, 0),
      dryMonths: T.filter((t, i) => P[i] < 2 * t).length, wetMonths: P.filter((p) => p > 100).length,
      dryLength: dp.length, periods: dp.periods,
      warmMax: tmax ? Math.max(...tmax) : null, coldMin: tmin ? Math.min(...tmin) : null, absMin: amin ? Math.min(...amin) : null,
      frostSure: frostSure.filter(Boolean).length, frostProb: frostProb.filter(Boolean).length,
    },
  };
}

/** Reads a dry period as words, such as "mid-May to early October". Uses the order the diagram is drawn in. */
export function periodText(a: number, b: number, south = false) {
  const names = order(MONTH_NAMES, south);
  const part = (x: number) => { const i = Math.floor(((x % 12) + 12) % 12), f = (((x % 12) + 12) % 12) - i; return `${f < 1 / 3 ? 'early' : f < 2 / 3 ? 'mid' : 'late'} ${names[Math.min(11, i)]}`; };
  return `${part(a)} to ${part(b - 1e-9)}`;
}

/** Reads 12 monthly rows: optional month label, then T, P and optionally mean daily max, mean daily min, absolute min. */
export function parseMonthly(rows: string[][], toNum: (s: string) => number): { m: Monthly; notes: string[] } | { error: string } {
  const notes: string[] = [];
  const data: number[][] = [];
  for (const r of rows) {
    const cells = r.map((c) => c.trim());
    if (!cells.some((c) => c !== '')) continue;
    const label = cells.filter((c) => c !== '' && !Number.isFinite(toNum(c))).join(' ').toLowerCase();
    const first = cells.findIndex((c) => Number.isFinite(toNum(c)));
    if (first < 0) continue; // a header row
    if (/\b(year|annual|total|mean|avg|average|sum)\b/.test(label) && data.length >= 12) continue;
    // Keep positions after the first number so empty optional cells stay empty. A month number may come first.
    let vals = cells.slice(first).map((c) => (c === '' ? NaN : toNum(c)));
    const nums = vals.filter(Number.isFinite);
    if (label === '' && nums.length >= 3 && Number.isInteger(vals[0]) && vals[0] === data.length + 1) vals = vals.slice(1);
    data.push(vals);
  }
  if (data.length !== 12) return { error: `Found ${data.length} month rows; the diagram needs exactly 12 (January to December).` };
  const col = (k: number) => data.map((r) => r[k]);
  const T = col(0), P = col(1);
  if (T.some((v) => !Number.isFinite(v)) || P.some((v) => !Number.isFinite(v))) return { error: 'Every month needs a mean temperature and a precipitation total (the first two numbers in each row).' };
  if (P.some((v) => v < 0)) return { error: 'Precipitation cannot be negative.' };
  if (T.some((v) => v < -70 || v > 50)) return { error: 'A monthly mean temperature is outside −70 to 50 °C. Check the columns and the unit.' };
  if (P.some((v) => v > 3000)) return { error: 'A monthly precipitation total is over 3000 mm. Check the columns and the unit.' };
  const m: Monthly = { T, P };
  const names = ['mean daily maximum', 'mean daily minimum', 'absolute minimum'] as const;
  (['tmax', 'tmin', 'amin'] as const).forEach((key, j) => {
    const v = col(2 + j), n = v.filter(Number.isFinite).length;
    if (n === 12) m[key] = v; else if (n > 0) notes.push(`The ${names[j]} column has ${n} of 12 months, so it is left out.`);
  });
  if (m.tmax && m.tmax.some((v, i) => v < T[i] - 1e-9)) notes.push('Some mean daily maxima are below the monthly mean: check the column order (mean, precipitation, max, min, absolute min).');
  if (m.tmin && m.tmin.some((v, i) => v > T[i] + 1e-9)) notes.push('Some mean daily minima are above the monthly mean: check the column order.');
  if (m.amin && m.tmin && m.amin.some((v, i) => v > m.tmin![i] + 1e-9)) notes.push('Some absolute minima are above the mean daily minimum: check the column order.');
  return { m, notes };
}

export type Colors = { bg: string; ink: string; muted: string; grid: string; t: string; p: string; dry: string; wet: string; solid: string; frost: string };
export type Header = { name: string; sub: string; right: string; right2: string };

/** Draws the diagram with any painter (canvas, SVG). */
export function draw(Pt: Painter, L: Layout, w: number, h: number, c: Colors, hd: Header) {
  const fs = 12, s = L.stats, foot = s.warmMax != null || s.coldMin != null || s.absMin != null;
  const pad = { l: 40, r: 46, t: 66, b: foot ? 50 : 34 };
  const x0 = pad.l, x1 = w - pad.r, y0 = pad.t, y1 = h - pad.b;
  const X = (x: number) => x0 + ((x1 - x0) * x) / 12, Y = (y: number) => y1 - ((y1 - y0) * (y - L.yMin)) / (L.yMax - L.yMin);
  if (c.bg) Pt.poly([[0, 0], [w, 0], [w, h], [0, h]], c.bg, null);
  // Header.
  Pt.text(8, 8, hd.name, 13, c.ink, 'start', 'top', 0, true);
  if (hd.sub) Pt.text(8, 25, hd.sub, 11, c.muted, 'start', 'top');
  Pt.text(w - 8, 8, hd.right, 12, c.ink, 'end', 'top', 0, true);
  Pt.text(w - 8, 25, hd.right2, 12, c.ink, 'end', 'top', 0, true);
  // Zero line and grid at every 10 °C.
  for (let y = L.yMin; y <= L.yMax + 1e-9; y += 10) Pt.line([[x0, Y(y)], [x1, Y(y)]], y === 0 ? c.muted : c.grid, y === 0 ? 1 : 0.6);
  Pt.clip(x0, y0, x1 - x0, y1 - y0);
  for (const [x, a, b] of L.humid) Pt.line([[X(x), Y(a)], [X(x), Y(b)]], c.wet, 0.8);
  for (const [x, a, b] of L.dry) Pt.line([[X(x), Y(a)], [X(x), Y(b)]], c.dry, 1.4, [1.4, 2.6]);
  for (const s of L.solid) Pt.poly(s.map(([x, y]) => [X(x), Y(y)] as [number, number]), c.solid, null);
  Pt.line(L.pCurve.map(([x, y]) => [X(x), Y(y)] as [number, number]), c.p, 2);
  Pt.line(L.tCurve.map(([x, y]) => [X(x), Y(y)] as [number, number]), c.t, 2);
  Pt.unclip();
  // Axes.
  Pt.line([[x0, y0], [x0, y1]], c.t, 1.2); Pt.line([[x1, y0], [x1, y1]], c.p, 1.2); Pt.line([[x0, Y(L.yMin)], [x1, Y(L.yMin)]], c.ink, 1);
  for (let y = L.yMin; y <= L.yMax + 1e-9; y += 10) {
    if (y <= 50) Pt.text(x0 - 5, Y(y), String(y), fs, c.t, 'end', 'middle');
    if (y >= 0) Pt.text(x1 + 5, Y(y), String(pUnscale(y)), fs, c.p, 'start', 'middle');
  }
  Pt.text(x0 - 5, y0 - 12, '°C', fs, c.t, 'end', 'middle', 0, true);
  Pt.text(x1 + 5, y0 - 12, 'mm', fs, c.p, 'start', 'middle', 0, true);
  // Month letters and frost bars under the axis.
  const fy = Y(L.yMin) + 4, fh = 7;
  L.labels.forEach((lab, i) => {
    const a = X(i) + 1, b = X(i + 1) - 1;
    if (L.frostSure[i]) Pt.poly([[a, fy], [b, fy], [b, fy + fh], [a, fy + fh]], c.frost, null);
    else if (L.frostProb[i]) { Pt.poly([[a, fy], [b, fy], [b, fy + fh], [a, fy + fh]], null, c.frost, 1); for (let k = a + 3; k < b; k += 4) Pt.line([[k, fy + fh], [Math.min(b, k + fh), fy]], c.frost, 0.8); }
    Pt.text(X(i + 0.5), fy + fh + 4, lab, fs, c.ink, 'middle', 'top');
  });
  // Extremes in a footer line.
  if (foot) Pt.text(w / 2, h - 6, extremes(s), 11, c.ink, 'middle', 'bottom');
}
/** The footer line of extremes, such as "Warmest month max 31.2 · coldest month min −4.1 · absolute min −12.0 °C". */
export function extremes(s: Layout['stats']) {
  const parts: string[] = [];
  if (s.warmMax != null) parts.push(`warmest month max ${fmt(s.warmMax)}`);
  if (s.coldMin != null) parts.push(`coldest month min ${fmt(s.coldMin)}`);
  if (s.absMin != null) parts.push(`absolute min ${fmt(s.absMin)}`);
  const t = parts.join(' · ') + ' °C';
  return t[0].toUpperCase() + t.slice(1);
}
const fmt = (v: number) => (Math.round(v * 10) / 10).toFixed(1).replace('-', '−');
