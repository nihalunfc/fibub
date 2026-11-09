// Protein assay standard curves (Bradford, BCA, Lowry and similar colour assays): standards with replicate
// absorbances, blank subtraction, a straight-line, quadratic or point-to-point curve, unknowns read back with their
// dilution factor, mean / SD / CV of replicates, flags for unknowns outside the standards, and the sample volume
// that holds a chosen amount of protein (for a gel lane, say). The example readings are made up. No DOM.
import { num, parseTable } from './num.ts';
import { solveSPD } from './fit.ts';

export type FitKind = 'linear' | 'quadratic' | 'p2p';
export type BlankMode = 'zero' | 'value' | 'none';
export type Std = { conc: number; reps: number[] };
export type Unk = { name: string; dil: number; reps: number[] };
export type Flag = 'ok' | 'above' | 'below' | 'blank' | 'top' | 'cv';

export const FIT_NAMES: Record<FitKind, string> = { linear: 'Straight line', quadratic: 'Quadratic (curved)', p2p: 'Point to point' };

/** Mean, sample SD (n − 1) and CV % of the finite values. */
export function meanSd(xs: number[]) {
  const v = xs.filter(Number.isFinite), n = v.length;
  const mean = n ? v.reduce((a, b) => a + b, 0) / n : NaN;
  const sd = n > 1 ? Math.sqrt(v.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1)) : NaN;
  return { n, mean, sd, cv: n > 1 && mean !== 0 ? (100 * sd) / Math.abs(mean) : NaN };
}

/** "5", "1:5" and "1/5" all mean a 5-fold dilution (1 part sample in 5 parts in all). */
export function dilution(s: string): number {
  const t = s.trim().replace(/\s+/g, '');
  const m = /^1[:/](.+)$/.exec(t);
  return m ? num(m[1]) : num(t);
}

/** Standards: each line is a concentration then one or more absorbances. A first line that is not a number is a header. */
export function parseStandards(text: string): { rows: Std[]; errors: string[] } {
  const rows: Std[] = [], errors: string[] = [];
  parseTable(text).forEach((r, i) => {
    const c = num(r[0]);
    if (!Number.isFinite(c)) { if (i > 0 || r.slice(1).some((x) => Number.isFinite(num(x)))) errors.push(`Standards line ${i + 1}: "${r[0]}" is not a concentration.`); return; }
    const reps = r.slice(1).filter((x) => x !== '').map(num);
    if (reps.some((x) => !Number.isFinite(x))) { errors.push(`Standards line ${i + 1}: every absorbance must be a number.`); return; }
    if (!reps.length) { errors.push(`Standards line ${i + 1}: give at least one absorbance after the concentration.`); return; }
    if (c < 0) { errors.push(`Standards line ${i + 1}: a concentration cannot be below zero.`); return; }
    rows.push({ conc: c, reps });
  });
  return { rows, errors };
}

/** Unknowns: each line is a name, a dilution factor (1 for undiluted), then one or more absorbances. */
export function parseUnknowns(text: string): { rows: Unk[]; errors: string[] } {
  const rows: Unk[] = [], errors: string[] = [];
  parseTable(text).forEach((r, i) => {
    const d = dilution(r[1] ?? '');
    if (!Number.isFinite(d)) { if (i > 0 || r.slice(2).some((x) => Number.isFinite(num(x)))) errors.push(`Samples line ${i + 1}: "${r[1] ?? ''}" is not a dilution factor (use 1 for undiluted).`); return; }
    const reps = r.slice(2).filter((x) => x !== '').map(num);
    if (reps.some((x) => !Number.isFinite(x))) { errors.push(`Samples line ${i + 1}: every absorbance must be a number.`); return; }
    if (!reps.length) { errors.push(`Samples line ${i + 1}: give at least one absorbance after the dilution factor.`); return; }
    if (!(d >= 1)) { errors.push(`Samples line ${i + 1}: the dilution factor must be 1 or more.`); return; }
    rows.push({ name: r[0] || `Sample ${rows.length + 1}`, dil: d, reps });
  });
  return { rows, errors };
}

/** The blank absorbance: the mean of the zero standard, a typed value, or nothing. */
export function blankOf(stds: Std[], mode: BlankMode, value = 0): number {
  if (mode === 'none') return 0;
  if (mode === 'value') { if (!Number.isFinite(value)) throw new Error('Type the blank absorbance, or choose another blank.'); return value; }
  const z = stds.filter((s) => s.conc === 0).flatMap((s) => s.reps);
  if (!z.length) throw new Error('There is no 0 standard to use as the blank. Add a line starting with 0, type a blank value, or choose no blank.');
  return meanSd(z).mean;
}

export type Curve = {
  kind: FitKind; coef: number[]; r2: number; sy: number; df: number;
  /** Absorbance (blank-subtracted) at a concentration. */
  predict: (x: number) => number;
  /** Concentration at a blank-subtracted absorbance; `top` when a quadratic never reaches it. */
  inverse: (y: number) => { x: number; top: boolean };
  /** Points of the point-to-point curve (mean of each standard). */
  knots: [number, number][];
  /** True when the curve rises over the whole standard range. */
  rising: boolean;
  /** Highest absorbance a quadratic that bends over reaches (Infinity otherwise) and where. */
  peak: { x: number; y: number };
};

/** Least-squares polynomial of the given degree, coefficients from the constant up. */
export function polyfit(x: number[], y: number[], deg: number): number[] {
  const m = deg + 1, A = Array.from({ length: m }, () => new Array(m).fill(0)), b = new Array(m).fill(0);
  // Scale x to about 1 so the normal equations stay well conditioned, then scale back.
  const s = Math.max(...x.map(Math.abs)) || 1;
  for (let i = 0; i < x.length; i++) {
    const t = x[i] / s, p = Array.from({ length: m }, (_, k) => t ** k);
    for (let r = 0; r < m; r++) { b[r] += p[r] * y[i]; for (let c = 0; c < m; c++) A[r][c] += p[r] * p[c]; }
  }
  const c = solveSPD(A, b);
  if (!c) throw new Error('The standards cannot be fitted: they need more different concentrations.');
  return c.map((v, k) => v / s ** k);
}

/** Fit the curve through blank-subtracted points (x = concentration, y = absorbance). */
export function fitCurve(x: number[], y: number[], kind: FitKind): Curve {
  const levels = [...new Set(x)].sort((a, b) => a - b);
  const need = kind === 'quadratic' ? 3 : 2;
  if (levels.length < need) throw new Error(`A ${FIT_NAMES[kind].toLowerCase()} needs standards at ${need} or more different concentrations (you have ${levels.length}).`);
  const knots: [number, number][] = levels.map((c) => [c, meanSd(y.filter((_, i) => x[i] === c)).mean]);
  const xmin = levels[0], xmax = levels[levels.length - 1];
  let coef: number[], predict: (v: number) => number, inverse: Curve['inverse'], rising: boolean, peak = { x: Infinity, y: Infinity };
  if (kind === 'p2p') {
    coef = [];
    for (let i = 1; i < knots.length; i++) if (!(knots[i][1] > knots[i - 1][1])) throw new Error(`Point to point needs every standard to read higher than the one below it; ${knots[i][0]} reads ${knots[i][1].toFixed(3)}, not above ${knots[i - 1][1].toFixed(3)} at ${knots[i - 1][0]}. Check the readings or use a fitted curve.`);
    const seg = (i: number, v: number, by: 0 | 1) => { const [a, b] = [knots[i], knots[i + 1]]; const by1 = 1 - by; return a[by1] + ((v - a[by]) * (b[by1] - a[by1])) / (b[by] - a[by]); };
    const find = (v: number, by: 0 | 1) => { let i = 0; while (i < knots.length - 2 && v > knots[i + 1][by]) i++; return i; };
    predict = (v) => seg(find(v, 0), v, 0);
    inverse = (v) => ({ x: seg(find(v, 1), v, 1), top: false });
    rising = true;
  } else {
    coef = polyfit(x, y, kind === 'linear' ? 1 : 2);
    const [a, b, c = 0] = coef;
    predict = (v) => a + b * v + c * v * v;
    if (kind === 'linear') {
      if (!(b > 0)) throw new Error('The line does not rise with concentration. Check that the standards and their readings are on the right lines.');
      inverse = (v) => ({ x: (v - a) / b, top: false });
      rising = true;
    } else {
      // Rising branch of a + b x + c x² = v: the root where the slope b + 2 c x = +√D, written to stay exact as c → 0.
      inverse = (v) => { const D = b * b - 4 * c * (a - v); return D < 0 || b + Math.sqrt(Math.max(0, D)) <= 0 ? { x: NaN, top: true } : { x: (2 * (v - a)) / (b + Math.sqrt(D)), top: false }; };
      if (c < 0) peak = { x: -b / (2 * c), y: a - (b * b) / (4 * c) };
      rising = b + 2 * c * xmin > 0 && b + 2 * c * xmax > 0;
      if (!rising) throw new Error(`The quadratic turns over inside the standards (it peaks near ${peak.x.toPrecision(3)}), so some readings would give two answers. Leave out the top standards or use point to point.`);
    }
  }
  const pred = x.map(predict), ybar = meanSd(y).mean;
  const sse = y.reduce((t, v, i) => t + (v - pred[i]) ** 2, 0), sst = y.reduce((t, v) => t + (v - ybar) ** 2, 0);
  const df = x.length - (kind === 'linear' ? 2 : kind === 'quadratic' ? 3 : 0);
  return { kind, coef, r2: kind === 'p2p' ? NaN : sst > 0 ? 1 - sse / sst : 1, sy: df > 0 ? Math.sqrt(sse / df) : NaN, df, predict, inverse, knots, rising, peak };
}

export type StdRow = Std & { mean: number; sd: number; cv: number; net: number; back: number; recovery: number };
export type UnkRow = Unk & {
  mean: number; sd: number; cv: number; net: number;
  /** Concentration in the assay well or tube, and in the original sample (× dilution), with the SD of replicates. */
  inAssay: number; conc: number; concSd: number; concCv: number;
  flags: Flag[]; volume: number; buffer: number;
};

export type AssayOptions = { blank: BlankMode; blankValue?: number; fit: FitKind; cvLimit?: number; amount?: number; finalVol?: number; unit?: 'ug/mL' | 'mg/mL' };

/** Volume (µL) of a sample at `conc` (in `unit`) that holds `amountUg` µg of protein. */
export function volumeFor(amountUg: number, conc: number, unit: 'ug/mL' | 'mg/mL' = 'ug/mL') {
  const ugPerUl = unit === 'mg/mL' ? conc : conc / 1000; // 1 mg/mL = 1 µg/µL
  return ugPerUl > 0 ? amountUg / ugPerUl : NaN;
}

/** The whole assay: blank, curve, standards read back, unknowns with flags and loading volumes. */
export function assay(stds: Std[], unks: Unk[], o: AssayOptions) {
  if (!stds.length) throw new Error('Type or paste the standards: a concentration and its absorbances on each line.');
  const blank = blankOf(stds, o.blank, o.blankValue);
  const xs: number[] = [], ys: number[] = [];
  for (const s of stds) for (const r of s.reps) { xs.push(s.conc); ys.push(r - blank); }
  const curve = fitCurve(xs, ys, o.fit);
  const nonzero = stds.map((s) => s.conc).filter((c) => c > 0);
  const lo = nonzero.length ? Math.min(...nonzero) : 0, hi = Math.max(...stds.map((s) => s.conc));
  const cvLimit = o.cvLimit ?? 10, unit = o.unit ?? 'ug/mL';
  const stdRows: StdRow[] = stds.map((s) => {
    const m = meanSd(s.reps), net = m.mean - blank, back = curve.inverse(net).x;
    return { ...s, mean: m.mean, sd: m.sd, cv: m.cv, net, back, recovery: s.conc > 0 ? (100 * back) / s.conc : NaN };
  });
  const unkRows: UnkRow[] = unks.map((u) => {
    const m = meanSd(u.reps), net = m.mean - blank, inv = curve.inverse(net);
    const each = meanSd(u.reps.map((r) => curve.inverse(r - blank).x * u.dil));
    const flags: Flag[] = [];
    if (inv.top) flags.push('top');
    else if (net <= 0 || !(inv.x > 0)) flags.push('blank');
    else if (inv.x > hi) flags.push('above');
    else if (inv.x < lo) flags.push('below');
    if (m.cv > cvLimit) flags.push('cv');
    if (!flags.length) flags.push('ok');
    const conc = inv.top || net <= 0 || !(inv.x > 0) ? NaN : inv.x * u.dil;
    const volume = o.amount && o.amount > 0 ? volumeFor(o.amount, conc, unit) : NaN;
    const buffer = o.finalVol && o.finalVol > 0 && Number.isFinite(volume) ? o.finalVol - volume : NaN;
    return { ...u, mean: m.mean, sd: m.sd, cv: m.cv, net, inAssay: inv.top ? NaN : inv.x, conc, concSd: each.sd, concCv: each.cv, flags, volume, buffer };
  });
  return { blank, curve, stds: stdRows, unks: unkRows, lo, hi, n: xs.length };
}

export const FLAG_TEXT: Record<Flag, string> = {
  ok: 'In range',
  above: 'Above the top standard: dilute more and measure again',
  below: 'Below the lowest standard: less reliable; use less dilution if you can',
  blank: 'At or below the blank (zero on the curve): no protein measured',
  top: 'Above the top of the curve: dilute and measure again',
  cv: 'Replicates disagree (CV above the limit)',
};

export const FLAG_SHORT: Record<Flag, string> = { ok: 'In range', above: 'Above top standard', below: 'Below lowest standard', blank: 'At the blank', top: 'Past top of curve', cv: 'High CV' };

/** Made-up example: a Bradford-style curve that bends at the top, triplicate readings, three samples. */
export const EXAMPLE_STANDARDS = `BSA (µg/mL), A595 1, A595 2, A595 3
0, 0.452, 0.448, 0.455
100, 0.531, 0.524, 0.536
250, 0.642, 0.651, 0.638
500, 0.808, 0.822, 0.815
750, 0.968, 0.957, 0.975
1000, 1.098, 1.112, 1.105
1500, 1.334, 1.318, 1.327
2000, 1.505, 1.521, 1.512`;
export const EXAMPLE_SAMPLES = `Sample, Dilution, A595 1, A595 2, A595 3
Cell lysate, 10, 0.861, 0.874, 0.868
Tissue extract, 5, 1.201, 1.186, 1.452
Purified protein, 1, 1.652, 1.640, 1.661
Wash fraction, 1, 0.471, 0.502, 0.468`;
