// Lab fume hood and room ventilation sums: face velocity traverse statistics, hood exhaust flow from the
// sash opening, room air changes per hour, dilution ventilation (well-mixed room with a mixing factor K),
// steady-state concentration from a constant source, and ppm <-> mg/m³. Plain maths, no DOM.
// For study and planning only: no agency limits are built in; the user types any target band.

export const R_GAS = 8.314462618; // J/(mol K), exact SI value
export const FPM = 0.00508; // 1 ft/min in m/s (exact)
export const FT = 0.3048; // m (exact)
export const INCH = 0.0254; // m (exact)
export const CFM = FT ** 3 / 60; // 1 ft³/min in m³/s

export type Point = { row: number; col: number; v: number; dev: number; outTol: boolean; outBand: boolean };
export type Traverse = {
  n: number; rows: number; cols: number; mean: number; sd: number; cv: number; min: number; max: number;
  minAt: [number, number]; maxAt: [number, number]; devMax: number; devMin: number; points: Point[];
  meanInBand: boolean | null; tolOk: boolean | null; nOutTol: number; nOutBand: number;
};

/** Read a grid of numbers, one row per line (spaces, tabs, commas or semicolons between numbers). Lines with
 * text before the first row of numbers are taken as headers; later ones are an error. */
export function parseGrid(text: string): number[][] {
  const rows: number[][] = [];
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    const cells = t.split(/[\s,;]+/).filter(Boolean);
    const v = cells.map((c) => Number(c.replace(/^\+/, '').replace('−', '-')));
    if (!rows.length && v.some((x) => !Number.isFinite(x))) continue; // header lines before the numbers
    if (v.some((x) => !Number.isFinite(x))) throw new Error(`"${t}" has something that is not a number`);
    rows.push(v);
  }
  return rows;
}

/**
 * Statistics of a face velocity traverse. `tol` (per cent) flags any reading further than that from the mean;
 * `lo`/`hi` is a target band for the mean (and flags readings outside it). Leave them undefined for no flags.
 * The standard deviation is the sample one (n − 1).
 */
export function traverse(grid: number[][], o: { lo?: number; hi?: number; tol?: number } = {}): Traverse {
  const vals = grid.flat();
  const n = vals.length;
  if (!n) throw new Error('No readings');
  const mean = vals.reduce((s, v) => s + v, 0) / n;
  const sd = n > 1 ? Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1)) : 0;
  let min = Infinity, max = -Infinity, minAt: [number, number] = [0, 0], maxAt: [number, number] = [0, 0];
  const hasBand = o.lo !== undefined || o.hi !== undefined;
  const lo = o.lo ?? -Infinity, hi = o.hi ?? Infinity;
  const points: Point[] = [];
  grid.forEach((r, i) => r.forEach((v, j) => {
    if (v < min) { min = v; minAt = [i, j]; }
    if (v > max) { max = v; maxAt = [i, j]; }
    const dev = mean !== 0 ? ((v - mean) / mean) * 100 : NaN;
    points.push({ row: i, col: j, v, dev, outTol: o.tol !== undefined && Math.abs(dev) > o.tol + 1e-9, outBand: hasBand && (v < lo || v > hi) });
  }));
  const nOutTol = points.filter((p) => p.outTol).length, nOutBand = points.filter((p) => p.outBand).length;
  return {
    n, rows: grid.length, cols: Math.max(...grid.map((r) => r.length)), mean, sd, cv: mean ? (sd / mean) * 100 : NaN, min, max, minAt, maxAt,
    devMax: ((max - mean) / mean) * 100, devMin: ((min - mean) / mean) * 100, points,
    meanInBand: hasBand ? mean >= lo && mean <= hi : null, tolOk: o.tol === undefined ? null : nOutTol === 0, nOutTol, nOutBand,
  };
}

/** Exhaust flow through the sash opening (m³/s) from width and height (m) and mean face velocity (m/s). */
export const hoodFlow = (width: number, height: number, v: number) => width * height * v;

/**
 * Face velocity at other sash heights. Constant volume (CAV): the flow stays at q, so velocity = q ÷ area.
 * Variable volume (VAV): the velocity is held at v, so the flow needed = v × area.
 */
export function sashTable(width: number, heights: number[], q: number, v: number) {
  return heights.map((h) => ({ h, area: width * h, vCav: q / (width * h), qVav: v * width * h }));
}

/** Air changes per hour from a flow (m³/s) and a room volume (m³). */
export const ach = (q: number, vol: number) => (q * 3600) / vol;

/** Time constant of a well-mixed room (s): τ = K V / Q. K ≥ 1 allows for imperfect mixing. */
export const tau = (vol: number, q: number, k = 1) => (k * vol) / q;

/** Steady-state concentration (mg/m³) from a source g (mg/s) with clean supply air: C = g K / Q. */
export const steady = (g: number, q: number, k = 1) => (g * k) / q;

/** Concentration after time t (s), first-order approach to the steady state: C = Css + (C0 − Css) e^(−t/τ). */
export const concAt = (t: number, c0: number, css: number, tc: number) => css + (c0 - css) * Math.exp(-t / tc);

/**
 * Time (s) for the concentration to go from c0 to c1: t = τ ln((C0 − Css) ÷ (C1 − Css)).
 * NaN when c1 cannot be reached (it is beyond the steady state or on the wrong side of it).
 */
export function timeTo(c0: number, c1: number, css: number, tc: number): number {
  const a = c0 - css, b = c1 - css;
  if (a === 0 || b === 0 || Math.sign(a) !== Math.sign(b) || Math.abs(b) > Math.abs(a)) return a === b && a !== 0 ? 0 : NaN;
  return tc * Math.log(a / b);
}

/** The concentration curve from 0 to tEnd (s), n + 1 points. */
export function curve(c0: number, css: number, tc: number, tEnd: number, n = 120) {
  const t: number[] = [], c: number[] = [];
  for (let i = 0; i <= n; i++) { const x = (tEnd * i) / n; t.push(x); c.push(concAt(x, c0, css, tc)); }
  return { t, c };
}

/** Molar volume of an ideal gas in L/mol at temperature (°C) and pressure (kPa); 24.465 L/mol at 25 °C, 101.325 kPa. */
export const molarVolume = (tC: number, pKpa: number) => (R_GAS * (tC + 273.15)) / pKpa;

/** ppm (by volume) to mg/m³ and back, for a gas or vapour of molar mass mw (g/mol). */
export const ppmToMg = (ppm: number, mw: number, vm: number) => (ppm * mw) / vm;
export const mgToPpm = (mg: number, mw: number, vm: number) => (mg * vm) / mw;

export type RateUnit = 'mg/s' | 'mg/min' | 'g/min' | 'g/h' | 'mL/min' | 'mL/h';
/** A generation or evaporation rate in mg/s. Liquid volume rates need the density in g/mL. */
export function rateMgS(x: number, unit: RateUnit, density = NaN): number {
  switch (unit) {
    case 'mg/s': return x;
    case 'mg/min': return x / 60;
    case 'g/min': return (x * 1000) / 60;
    case 'g/h': return (x * 1000) / 3600;
    case 'mL/min': return (x * density * 1000) / 60;
    case 'mL/h': return (x * density * 1000) / 3600;
  }
}

export type FlowUnit = 'm3/s' | 'm3/h' | 'L/s' | 'cfm';
export const FLOW: Record<FlowUnit, number> = { 'm3/s': 1, 'm3/h': 1 / 3600, 'L/s': 1e-3, cfm: CFM };
export type LenUnit = 'm' | 'cm' | 'mm' | 'ft' | 'in';
export const LEN: Record<LenUnit, number> = { m: 1, cm: 0.01, mm: 0.001, ft: FT, in: INCH };
