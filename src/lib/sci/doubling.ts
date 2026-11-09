// Cell doubling time and passage planning. Growth in the exponential phase is N(t) = N0 · e^(r·t), so ln N
// is a straight line in time with slope r (the specific growth rate) and the doubling time is ln 2 / r.
// Two counts give r = ln(N2/N1) / (t2 − t1); a series is fitted by least squares on ln N, with a t-based
// interval on the slope. The planner runs the same law forwards and backwards: to reach a target number of
// cells after h hours (the first `lag` of them with no growth), seed target · 2^−((h − lag) / Td).
// Times are in hours throughout. No DOM.
import { fitLine } from './fit.ts';
import { tInv } from './stats.ts';

export type Point = { t: number; n: number; use?: boolean };
export type Step = { t0: number; t1: number; n0: number; n1: number; td: number; r: number };
export type Growth = {
  method: 'two' | 'fit';
  /** Points used (in time order). */
  used: Point[];
  /** Specific growth rate per hour, its interval (fit only) and the doubling time in hours. */
  r: number; rLo: number; rHi: number;
  td: number; tdLo: number; tdHi: number;
  /** ln N at t = 0 on the fitted line (or through the first point for two points). */
  lnN0: number;
  r2: number; seR: number; df: number; conf: number;
  tStart: number; tEnd: number;
  /** Generations (doublings) and fold increase over the fitted span, from the line. */
  generations: number; fold: number;
  /** Doubling time between each pair of neighbouring points (all points, used or not). */
  steps: Step[];
  warn: string[];
};

export const LN2 = Math.LN2;
export const tdFromRate = (r: number) => LN2 / r;
export const rateFromTd = (td: number) => LN2 / td;
/** Doublings to go from n0 to n1. */
export const doublings = (n0: number, n1: number) => Math.log2(n1 / n0);

/** Doubling time from two counts: Td = (t2 − t1) · ln 2 / ln(N2 / N1). */
export function twoPoint(t1: number, n1: number, t2: number, n2: number): number {
  return ((t2 - t1) * LN2) / Math.log(n2 / n1);
}

function clean(pts: Point[]): Point[] {
  return pts.filter((p) => Number.isFinite(p.t) && Number.isFinite(p.n)).sort((a, b) => a.t - b.t);
}

/** Doubling time from two or more counts (only points with use !== false are fitted). */
export function fitGrowth(points: Point[], conf = 0.95): Growth {
  const all = clean(points);
  if (all.some((p) => !(p.n > 0))) throw new Error('Every count must be above 0.');
  const used = all.filter((p) => p.use !== false);
  if (used.length < 2) throw new Error('Tick at least two counts to work out a doubling time.');
  if (new Set(used.map((p) => p.t)).size < 2) throw new Error('The counts need at least two different times.');
  const steps: Step[] = [];
  for (let i = 1; i < all.length; i++) {
    const a = all[i - 1], b = all[i], r = Math.log(b.n / a.n) / (b.t - a.t);
    steps.push({ t0: a.t, t1: b.t, n0: a.n, n1: b.n, r, td: b.t > a.t ? LN2 / r : NaN });
  }
  const warn: string[] = [];
  let r: number, lnN0: number, rLo = NaN, rHi = NaN, r2 = 1, seR = NaN, df = 0;
  if (used.length === 2) {
    const [a, b] = used;
    r = Math.log(b.n / a.n) / (b.t - a.t);
    lnN0 = Math.log(a.n) - r * a.t;
  } else {
    const f = fitLine(used.map((p) => p.t), used.map((p) => Math.log(p.n)));
    r = f.slope; lnN0 = f.intercept; r2 = f.r2; seR = f.seSlope; df = f.df;
    const q = tInv(1 - (1 - conf) / 2, df);
    rLo = r - q * seR; rHi = r + q * seR;
    if (r2 < 0.95 && r > 0) warn.push(`The ticked counts do not lie on a straight line on a log scale (R² = ${r2.toFixed(3)}). Untick counts from the slow start (lag) or the flat end (plateau) and fit only the steady growth.`);
  }
  if (!(r > 0)) throw new Error('These counts do not go up over time, so there is no doubling time. Check the counts and times, or untick the counts after the cells stopped growing.');
  const td = LN2 / r;
  const tdLo = rHi > 0 ? LN2 / rHi : NaN, tdHi = rLo > 0 ? LN2 / rLo : Infinity;
  const tStart = used[0].t, tEnd = used[used.length - 1].t;
  const generations = (r * (tEnd - tStart)) / LN2;
  if (steps.some((s, i) => i > 0 && s.r > 0 && steps[i - 1].r > 0 && s.td > 2 * steps[i - 1].td && all[i + 1].use !== false)) {
    warn.push('Growth slows down towards the end: the cells may be reaching confluence. Untick the last counts to fit only the steady growth.');
  }
  return { method: used.length === 2 ? 'two' : 'fit', used, r, rLo, rHi, td, tdLo: used.length === 2 ? NaN : tdLo, tdHi: used.length === 2 ? NaN : tdHi, lnN0, r2, seR, df, conf, tStart, tEnd, generations, fold: 2 ** generations, steps, warn };
}

/** Count on the fitted line at time t. */
export const predict = (g: Pick<Growth, 'r' | 'lnN0'>, t: number) => Math.exp(g.lnN0 + g.r * t);

// ---------- Passage planner ----------

/** Typical, rounded growth areas and medium volumes (makers differ: check your own vessel's label). */
export type Vessel = { id: string; name: string; area: number; medium: number };
export const VESSELS: Vessel[] = [
  { id: 't25', name: 'T25 flask', area: 25, medium: 5 },
  { id: 't75', name: 'T75 flask', area: 75, medium: 15 },
  { id: 't175', name: 'T175 flask', area: 175, medium: 30 },
  { id: 'd35', name: '35 mm dish', area: 9, medium: 2 },
  { id: 'd60', name: '60 mm dish', area: 20, medium: 4 },
  { id: 'd100', name: '100 mm dish', area: 55, medium: 10 },
  { id: 'w6', name: '6-well plate (per well)', area: 10, medium: 2 },
  { id: 'w12', name: '12-well plate (per well)', area: 4, medium: 1 },
  { id: 'w24', name: '24-well plate (per well)', area: 2, medium: 0.5 },
  { id: 'w96', name: '96-well plate (per well)', area: 0.3, medium: 0.1 },
];

/** Growth factor over h hours when the first `lag` hours have no growth. */
export const growthFactor = (td: number, hours: number, lag = 0) => 2 ** (Math.max(0, hours - Math.max(0, lag)) / td);

export type PlanIn = {
  /** Doubling time and lag after seeding, hours. */
  td: number; lag: number;
  /** Cells per cm² at 100 % confluence. */
  full: number;
  /** Cells you have (total) and the area they came from (cm², all vessels together). */
  haveCells: number; haveArea: number;
  /** Volume the cells are resuspended in, mL. */
  resuspendMl: number;
  /** Target confluence (%) after `hours` hours, in vessels of `area` cm² with `medium` mL each, `vessels` of them. */
  targetPct: number; hours: number; area: number; medium: number; vessels: number;
};
export type Plan = {
  growth: number; doublings: number;
  targetCells: number; seedCells: number; seedDensity: number; seedPct: number;
  haveDensity: number; havePct: number; split: number;
  conc: number; suspMl: number; topUpMl: number;
  needCells: number; needMl: number; maxVessels: number;
  warn: string[];
};

export function planPassage(p: PlanIn): Plan {
  const bad = (x: number) => !(x > 0) || !Number.isFinite(x);
  if (bad(p.td)) throw new Error('Type a doubling time above 0 hours.');
  if (!(p.lag >= 0)) throw new Error('The lag must be 0 hours or more.');
  if (bad(p.full)) throw new Error('Type how many cells cover 1 cm² at 100 % confluence.');
  if (bad(p.haveCells)) throw new Error('Type how many cells you have now (or how confluent they are).');
  if (bad(p.haveArea)) throw new Error('Type the growth area of the vessel the cells are in now.');
  if (bad(p.resuspendMl)) throw new Error('Type the volume you resuspend the cells in.');
  if (bad(p.targetPct) || p.targetPct > 100) throw new Error('Type a target confluence between 1 and 100 %.');
  if (bad(p.hours)) throw new Error('Type when the cells should be ready (in days, above 0).');
  if (bad(p.area)) throw new Error('Type the growth area of the new vessel.');
  if (bad(p.medium)) throw new Error('Type the medium volume per new vessel.');
  if (!(p.vessels >= 1) || !Number.isInteger(p.vessels)) throw new Error('Type a whole number of new vessels (1 or more).');
  const growth = growthFactor(p.td, p.hours, p.lag), doublingsN = Math.log2(growth);
  const targetCells = (p.targetPct / 100) * p.full * p.area;
  const seedCells = targetCells / growth, seedDensity = seedCells / p.area, seedPct = (100 * seedDensity) / p.full;
  const haveDensity = p.haveCells / p.haveArea, havePct = (100 * haveDensity) / p.full;
  const split = haveDensity / seedDensity;
  const conc = p.haveCells / p.resuspendMl, suspMl = seedCells / conc, topUpMl = p.medium - suspMl;
  const needCells = seedCells * p.vessels, needMl = suspMl * p.vessels, maxVessels = Math.floor(p.haveCells / seedCells + 1e-9);
  const warn: string[] = [];
  if (p.hours <= p.lag) warn.push('The cells will not have started growing by then (the time is within the lag), so seed them at the target confluence.');
  if (p.targetPct > 90) warn.push('Growth slows as cells fill the surface, so a target above 90 % will be reached later than this plan says.');
  if (havePct > 100) warn.push(`That is ${havePct.toFixed(0)} % of a full layer in the vessel the cells are in now: check the count, the vessel area or the cells per cm² at 100 %.`);
  if (seedPct < 5 && p.hours > p.lag) warn.push(`Seeding at ${seedPct < 1 ? seedPct.toFixed(2) : seedPct.toFixed(1)} % confluence is very sparse; many cells grow more slowly (or not at all) when this sparse, so allow extra time or a longer lag.`);
  if (needCells > p.haveCells) warn.push(`${p.vessels} vessels need more cells than you have: you have enough for ${maxVessels}.`);
  if (suspMl > p.medium) warn.push('The cell suspension per vessel is more than its medium volume: spin the cells down and resuspend them in less medium.');
  else if (suspMl < 0.005) warn.push('Less than 5 µL of suspension per vessel is hard to pipette accurately: dilute the cells first or resuspend them in more medium.');
  return { growth, doublings: doublingsN, targetCells, seedCells, seedDensity, seedPct, haveDensity, havePct, split, conc, suspMl, topUpMl, needCells, needMl, maxVessels, warn };
}

export type ScheduleRow = { passage: number; hours: number; harvestPct: number; harvestCells: number; split: number; seedCells: number; doublings: number; totalIfKept: number };

/**
 * The next `count` passages if every passage reseeds at the plan's density and grows for the same time.
 * Row 0 is today's split; row k is the passage after k growth periods. `doublings` is the population doublings
 * since today, and `totalIfKept` the cells you would have if no cells were thrown away.
 */
export function schedule(p: PlanIn, plan: Plan, startPassage: number, count = 6): ScheduleRow[] {
  const rows: ScheduleRow[] = [{ passage: startPassage, hours: 0, harvestPct: plan.havePct, harvestCells: plan.haveDensity * p.area, split: plan.split, seedCells: plan.seedCells, doublings: 0, totalIfKept: p.haveCells }];
  for (let k = 1; k < count; k++) {
    rows.push({ passage: startPassage + k, hours: k * p.hours, harvestPct: p.targetPct, harvestCells: plan.targetCells, split: plan.growth, seedCells: plan.seedCells, doublings: k * plan.doublings, totalIfKept: p.haveCells * plan.growth ** k });
  }
  return rows;
}

/** Predicted confluence (%) through `cycles` growth periods, for the sawtooth plot. */
export function confluenceCurve(p: PlanIn, plan: Plan, cycles: number, perCycle = 40): { x: number[]; y: number[] } {
  const x: number[] = [], y: number[] = [];
  for (let c = 0; c < cycles; c++) {
    for (let i = 0; i <= perCycle; i++) {
      const h = (i / perCycle) * p.hours;
      x.push(c * p.hours + h); y.push(plan.seedPct * growthFactor(p.td, h, p.lag));
    }
  }
  return { x, y };
}

/** Times typed in days or hours, to hours. */
export const toHours = (t: number, unit: 'h' | 'd') => (unit === 'd' ? t * 24 : t);

/** Made-up example counts (cells/mL, hours): steady growth with a 23 h doubling time, then a plateau. */
export const EXAMPLE: Point[] = [
  { t: 0, n: 1.0e5 },
  { t: 24, n: 1.8e5 },
  { t: 48, n: 4.1e5 },
  { t: 72, n: 8.2e5 },
  { t: 96, n: 1.6e6 },
  { t: 120, n: 1.9e6, use: false },
];

/** Read a pasted table of time, count and an optional third "use" column (yes/no, 1/0, x). */
export function parseCounts(rows: string[][], num: (s: string) => number): { points: Point[]; errors: string[] } {
  const points: Point[] = [], errors: string[] = [];
  rows.forEach((r, i) => {
    const t = num(r[0]), n = num(r[1]);
    if (!Number.isFinite(t) || !Number.isFinite(n)) { if (i > 0 || (Number.isFinite(t) || Number.isFinite(n))) errors.push(`Line ${i + 1}: needs a time and a count.`); return; }
    const u = (r[2] ?? '').trim().toLowerCase();
    points.push({ t, n, use: !/^(no|n|0|false|-|skip)$/.test(u) });
  });
  return { points, errors };
}
