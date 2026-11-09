// Crystallisation screen designer: grid screens on 24- and 96-well plates. Each factor is a concentration
// (one stock, C1V1) or a pH (two stocks of one buffer at a low and a high pH, mixed by Henderson–Hasselbalch
// or as a straight line). A factor runs across the columns, down the rows, or is the same in every well (a
// fixed additive). Every well is topped up to the chosen volume with water. Plain maths, no DOM.

export type Dir = 'col' | 'row' | 'all';
export type Spacing = 'lin' | 'log';
export type ConcFactor = { kind: 'conc'; name: string; unit: string; stock: number; from: number; to: number; dir: Dir; spacing?: Spacing };
export type PhFactor = { kind: 'ph'; name: string; unit: string; stock: number; final: number; pHlo: number; pHhi: number; pKa: number; from: number; to: number; dir: Dir; mix?: 'hh' | 'lin' };
export type Factor = ConcFactor | PhFactor;
export type Stock = { label: string; conc: number; unit: string; factor: number; pH?: number };
export type WellRec = { r: number; c: number; name: string; values: number[]; vols: number[]; water: number; over: boolean; small: number[] };
export type Design = { R: number; C: number; volume: number; stocks: Stock[]; wells: WellRec[]; totals: number[]; water: number; over: string[]; small: string[] };
export type Options = { size: 24 | 96; volume: number; round?: number; minPip?: number };

export const PLATE: Record<24 | 96, [number, number]> = { 24: [4, 6], 96: [8, 12] };
export const rowName = (r: number) => String.fromCharCode(65 + r);
export const wellName = (r: number, c: number) => `${rowName(r)}${c + 1}`;
const clean = (x: number) => Math.round(x * 1e9) / 1e9;

/** n values from `from` to `to`: even steps, or even ratios (log spacing, both ends above 0). */
export function levels(from: number, to: number, n: number, spacing: Spacing = 'lin'): number[] {
  if (n <= 1) return [from];
  return Array.from({ length: n }, (_, i) => clean(spacing === 'log' ? from * Math.pow(to / from, i / (n - 1)) : from + ((to - from) * i) / (n - 1)));
}

/** Fraction of the base (deprotonated) form at a pH, from Henderson–Hasselbalch. */
export const baseFraction = (pH: number, pKa: number) => 1 / (1 + Math.pow(10, pKa - pH));

/** Fraction of the high-pH stock in the buffer mix that gives `pH`. Both stocks hold the same total buffer
 * concentration, so the base fraction of the mix is the volume-weighted mean of the two stocks' fractions. */
export function highFraction(pH: number, pHlo: number, pHhi: number, pKa: number, mix: 'hh' | 'lin' = 'hh'): number {
  if (mix === 'lin') return (pH - pHlo) / (pHhi - pHlo);
  const lo = baseFraction(pHlo, pKa), hi = baseFraction(pHhi, pKa);
  return (baseFraction(pH, pKa) - lo) / (hi - lo);
}
/** pH of a mix with fraction x of the high-pH stock (the inverse of highFraction with mix 'hh'). */
export function mixPH(x: number, pHlo: number, pHhi: number, pKa: number): number {
  const f = (1 - x) * baseFraction(pHlo, pKa) + x * baseFraction(pHhi, pKa);
  return pKa + Math.log10(f / (1 - f));
}

/** Problems with a factor, in plain words; empty when it is fine. */
export function factorErrors(f: Factor, i: number): string[] {
  const n = `Factor ${i + 1} (${f.name || 'no name'})`, e: string[] = [];
  const ok = (x: number) => Number.isFinite(x);
  if (![f.from, f.to, f.stock].every(ok)) return [`${n}: fill in every number.`];
  if (f.kind === 'conc') {
    if (f.stock <= 0) e.push(`${n}: the stock concentration must be above 0.`);
    if (f.from < 0 || f.to < 0) e.push(`${n}: concentrations cannot be below 0.`);
    if ((f.spacing ?? 'lin') === 'log' && (f.from <= 0 || f.to <= 0)) e.push(`${n}: even ratios (log) need both ends above 0.`);
    if (f.stock > 0 && Math.max(f.from, f.to) > f.stock) e.push(`${n}: the stock (${f.stock} ${f.unit}) is weaker than the highest final value (${Math.max(f.from, f.to)} ${f.unit}). Use a stronger stock.`);
  } else {
    if (![f.final, f.pHlo, f.pHhi, f.pKa].every(ok)) return [`${n}: fill in every number.`];
    if (f.stock <= 0 || f.final <= 0) e.push(`${n}: the buffer concentrations must be above 0.`);
    else if (f.final > f.stock) e.push(`${n}: the final buffer concentration is above the stock's.`);
    if (!(f.pHhi > f.pHlo)) e.push(`${n}: the high-pH stock must have a higher pH than the low-pH stock.`);
    else if (Math.min(f.from, f.to) < f.pHlo - 1e-9 || Math.max(f.from, f.to) > f.pHhi + 1e-9) e.push(`${n}: pH ${Math.min(f.from, f.to)} to ${Math.max(f.from, f.to)} is outside the two stocks (pH ${f.pHlo} and ${f.pHhi}). Mixing can only reach pH values between them.`);
  }
  return e;
}

/** The stocks a list of factors needs, in factor order. */
export function stocksOf(fs: Factor[]): Stock[] {
  return fs.flatMap((f, i): Stock[] => f.kind === 'conc'
    ? [{ label: f.name, conc: f.stock, unit: f.unit, factor: i }]
    : [{ label: `${f.name} pH ${f.pHlo}`, conc: f.stock, unit: f.unit, factor: i, pH: f.pHlo }, { label: `${f.name} pH ${f.pHhi}`, conc: f.stock, unit: f.unit, factor: i, pH: f.pHhi }]);
}

/** Every well's factor values and stock volumes (µL). Throws with the first problem when the input is bad. */
export function design(fs: Factor[], o: Options): Design {
  if (!fs.length) throw new Error('Add at least one factor.');
  const errs = fs.flatMap(factorErrors);
  if (errs.length) throw new Error(errs.join(' '));
  if (!(o.volume > 0)) throw new Error('Set a volume per well above 0 µL.');
  const [R, C] = PLATE[o.size];
  const round = o.round ?? 0, minPip = o.minPip ?? 0;
  const rnd = (v: number) => (round > 0 ? Math.round(v / round) * round : v);
  const stocks = stocksOf(fs);
  const lv = fs.map((f) => (f.dir === 'col' ? levels(f.from, f.to, C, f.kind === 'conc' ? f.spacing : 'lin') : f.dir === 'row' ? levels(f.from, f.to, R, f.kind === 'conc' ? f.spacing : 'lin') : [f.from]));
  const wells: WellRec[] = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    const values = fs.map((f, i) => lv[i][f.dir === 'col' ? c : f.dir === 'row' ? r : 0]);
    const vols = fs.flatMap((f, i): number[] => {
      if (f.kind === 'conc') return [(values[i] / f.stock) * o.volume];
      const buf = (f.final / f.stock) * o.volume, x = Math.min(1, Math.max(0, highFraction(values[i], f.pHlo, f.pHhi, f.pKa, f.mix)));
      return [buf * (1 - x), buf * x];
    }).map((v) => clean(rnd(v)));
    const water = clean(o.volume - vols.reduce((a, b) => a + b, 0));
    const small = vols.map((v, k) => (v > 0 && v < minPip - 1e-9 ? k : -1)).filter((k) => k >= 0);
    wells.push({ r, c, name: wellName(r, c), values, vols, water, over: water < -1e-9, small });
  }
  const totals = stocks.map((_, k) => clean(wells.reduce((a, w) => a + w.vols[k], 0)));
  const water = clean(wells.reduce((a, w) => a + Math.max(0, w.water), 0));
  return { R, C, volume: o.volume, stocks, wells, totals, water, over: wells.filter((w) => w.over).map((w) => w.name), small: wells.filter((w) => w.small.length).map((w) => w.name) };
}

/** Volume to make of a stock: the plate's total plus a spare percentage. */
export const withSpare = (total: number, sparePct: number) => clean(total * (1 + sparePct / 100));

/** Concentration of each factor in the drop at the start, for protein + reservoir volumes (the protein adds none). */
export const dropFactor = (protein: number, reservoir: number) => reservoir / (protein + reservoir);

/** The made-up example screen: PEG across the columns, pH down the rows, a fixed salt. */
export const EXAMPLE: Factor[] = [
  { kind: 'conc', name: 'PEG 3350', unit: '% w/v', stock: 50, from: 8, to: 30, dir: 'col', spacing: 'lin' },
  { kind: 'ph', name: 'Buffer', unit: 'M', stock: 1, final: 0.1, pHlo: 6.5, pHhi: 8.5, pKa: 7.5, from: 6.6, to: 8.0, dir: 'row', mix: 'hh' },
  { kind: 'conc', name: 'Sodium chloride', unit: 'M', stock: 4, from: 0.2, to: 0.2, dir: 'all', spacing: 'lin' },
];
