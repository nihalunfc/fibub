// Tree height from clinometer readings, and basal area from trunk diameters (single trees, fixed-area plots and
// prism or angle-gauge sweeps). Standard forest mensuration formulas; no tables.

export type Reading = { value: number; unit: 'deg' | 'pct' };
/** Tangent of a clinometer reading: degrees, or percent (rise over run × 100). */
export const tanOf = (r: Reading) => (r.unit === 'pct' ? r.value / 100 : Math.tan((r.value * Math.PI) / 180));
/** Angle in degrees of a reading. */
export const degOf = (r: Reading) => (r.unit === 'pct' ? (Math.atan(r.value / 100) * 180) / Math.PI : r.value);

/**
 * Horizontal distance to the tree. If the distance was taped along the slope, it is the slope distance × cos(slope).
 */
export function horizontal(dist: number, slope?: Reading): number {
  if (!slope) return dist;
  const a = (degOf(slope) * Math.PI) / 180;
  return dist * Math.cos(a);
}

/**
 * Tangent method: H = D × (tan top − tan base), with D the horizontal distance and readings signed (above eye level
 * positive, below negative). On level ground with no base reading, H = D × tan top + eye height.
 */
export function tangentHeight(o: { dist: number; slope?: Reading; top: Reading; base?: Reading; eye?: number }) {
  const D = horizontal(o.dist, o.slope), tt = tanOf(o.top);
  if (o.base) { const tb = tanOf(o.base); return { H: D * (tt - tb), D, above: D * tt, below: -D * tb }; }
  const eye = o.eye ?? 0;
  return { H: D * tt + eye, D, above: D * tt, below: eye };
}

/**
 * Sine method (Larjavaara and Muller-Landau 2013): with line-of-sight distances to the top and to the base (a laser
 * rangefinder) and the two angles, H = Lt sin(top) − Lb sin(base). Leaning trees and uneven ground do not matter,
 * because no horizontal distance is assumed.
 */
export function sineHeight(o: { lTop: number; top: Reading; lBase: number; base: Reading }) {
  const s = (r: Reading) => Math.sin((degOf(r) * Math.PI) / 180);
  const above = o.lTop * s(o.top), below = -o.lBase * s(o.base);
  return { H: above + below, above, below, D: o.lTop * Math.cos((degOf(o.top) * Math.PI) / 180) };
}

export type Units = 'metric' | 'imperial';
/** Basal area of one stem: m² from DBH in cm, or ft² from DBH in inches (π/(4×144) = 0.005454). */
export const basalArea = (dbh: number, u: Units) => (u === 'metric' ? (Math.PI / 4) * (dbh / 100) ** 2 : (Math.PI / 576) * dbh * dbh);
/** Area per hectare (m²) or per acre (ft²). */
export const UNIT_AREA = { metric: 10000, imperial: 43560 } as const;

/** Fixed-area plot: stems and basal area per hectare (or per acre) from the DBHs in a plot of `area` m² (or ft²). */
export function plot(dbhs: number[], area: number, u: Units) {
  const f = UNIT_AREA[u] / area, ba = dbhs.map((d) => basalArea(d, u)), sum = ba.reduce((s, v) => s + v, 0);
  const n = dbhs.length, baPer = sum * f, stems = n * f;
  return { n, baTrees: ba, sumBA: sum, factor: f, baPer, stems, qmd: n ? quadraticMean(dbhs) : NaN };
}
export const quadraticMean = (d: number[]) => Math.sqrt(d.reduce((s, v) => s + v * v, 0) / d.length);

/**
 * Prism (angle-gauge) sweep: each tree counted "in" stands for BAF of basal area per hectare (m²/ha) or per acre
 * (ft²/ac). Borderline trees count as half. Over several points, BA = BAF × mean count, with a standard error from
 * the spread of counts. If the DBH of each in-tree is given, each one also stands for BAF / (its basal area) stems
 * per unit area (its tree factor).
 */
export function prism(counts: number[], baf: number, u: Units, dbhs?: number[][]) {
  const k = counts.length, mean = counts.reduce((s, v) => s + v, 0) / k;
  const perPoint = counts.map((c) => c * baf);
  const sd = k > 1 ? Math.sqrt(perPoint.reduce((s, v) => s + (v - mean * baf) ** 2, 0) / (k - 1)) : NaN;
  let stems = NaN, stemsPer: number[] = [];
  if (dbhs && dbhs.length === k) {
    stemsPer = dbhs.map((pt) => pt.reduce((s, d) => s + baf / basalArea(d, u), 0));
    stems = stemsPer.reduce((s, v) => s + v, 0) / k;
  }
  const ba = mean * baf;
  return { points: k, meanCount: mean, ba, perPoint, sd, se: sd / Math.sqrt(k), stems, stemsPer, qmd: Number.isFinite(stems) && stems > 0 ? diameterFromBA(ba / stems, u) : NaN };
}
/** Diameter (cm or in) of a stem with basal area `ba` (m² or ft²). */
export const diameterFromBA = (ba: number, u: Units) => (u === 'metric' ? 200 * Math.sqrt(ba / Math.PI) : Math.sqrt((576 * ba) / Math.PI));
/**
 * Limiting distance: a tree further than this from the point is "out". R = DBH(cm) / (2√BAF) m, or
 * R = DBH(in) × √(10890/BAF) / 12 ft (the plot radius factor, 2.75 ft per inch for BAF 10).
 */
export const limitDistance = (dbh: number, baf: number, u: Units) => (u === 'metric' ? dbh / (2 * Math.sqrt(baf)) : (dbh * Math.sqrt(10890 / baf)) / 12);
