// Drug-combination reference models on a dose matrix of % inhibition: Bliss independence (Bliss 1939),
// highest single agent (HSA; Gaddum), Loewe additivity (Loewe and Muischnek 1926) with single-agent Hill fits, and
// the combination index CI = a/Dx_A + b/Dx_B (Chou and Talalay 1984; Berenbaum 1989). Bliss and HSA use the
// observed single-agent responses in the matrix's zero row and column, as SynergyFinder does (Ianevski et al. 2017).
// Plain maths, no DOM.
import { levenbergMarquardt } from './fit.ts';

export type Hill = { ec50: number; h: number; emax: number; r2: number; n: number; converged: boolean; capped?: boolean };
export type Matrix = { a: number[]; b: number[]; e: number[][] }; // e[i][j]: % inhibition at a[i] and b[j]
export type Cell = {
  i: number; j: number; a: number; b: number; obs: number;
  bliss: number; blissEx: number; hsa: number; hsaEx: number; loewe: number; loeweEx: number; ci: number;
};
export type SynergyResult = { hillA: Hill; hillB: Hill; cells: Cell[]; summary: Record<'bliss' | 'hsa' | 'loewe', { mean: number; max: number; at: [number, number] }> & { ci: { geoMean: number; n: number; syn: number; add: number; ant: number } } };

export const hill = (d: number, p: Hill) => (d > 0 ? (p.emax * d ** p.h) / (p.ec50 ** p.h + d ** p.h) : 0);
/** Dose of one drug alone that gives effect e (% inhibition); NaN when e is outside (0, Emax). */
export const hillInv = (e: number, p: Hill) => (e > 0 && e < p.emax ? p.ec50 * (e / (p.emax - e)) ** (1 / p.h) : NaN);

/** Fit E = Emax·dʰ / (EC50ʰ + dʰ) to one drug alone (doses above 0). Emax is fixed (e.g. 100) or fitted. */
export function fitHill(d: number[], e: number[], emaxFixed?: number): Hill {
  const x: number[] = [], y: number[] = [];
  d.forEach((v, i) => { if (v > 0 && Number.isFinite(e[i])) { x.push(v); y.push(e[i]); } });
  const np = emaxFixed === undefined ? 3 : 2;
  if (x.length <= np) throw new Error(`Each drug needs at least ${np + 1} doses above 0 given alone (the zero row and column of the matrix) to fit its curve.`);
  if (Math.max(...y) - Math.min(...y) < 1) throw new Error('A drug alone hardly changes the response across its doses, so its curve cannot be fitted.');
  // Start: EC50 where the response crosses half of the top, by log interpolation.
  const top = emaxFixed ?? Math.min(100, Math.max(...y) * 1.05);
  const order = x.map((_, i) => i).sort((p, q) => x[p] - x[q]);
  let ec = Math.sqrt(x[order[0]] * x[order[order.length - 1]]);
  for (let k = 1; k < order.length; k++) {
    const [i0, i1] = [order[k - 1], order[k]];
    if ((y[i0] - top / 2) * (y[i1] - top / 2) <= 0 && y[i0] !== y[i1]) { ec = 10 ** (Math.log10(x[i0]) + ((top / 2 - y[i0]) / (y[i1] - y[i0])) * (Math.log10(x[i1]) - Math.log10(x[i0]))); break; }
  }
  const f = (xi: number, p: number[]) => { const em = emaxFixed ?? p[2], c = 10 ** p[0]; return (em * xi ** p[1]) / (c ** p[1] + xi ** p[1]); };
  let best: ReturnType<typeof levenbergMarquardt> | null = null;
  for (const h0 of [1, 0.5, 2, 3]) {
    try {
      const r = levenbergMarquardt(f, x, y, emaxFixed === undefined ? [Math.log10(ec), h0, top] : [Math.log10(ec), h0], { maxIter: 1000 });
      if (r.p[1] > 0 && (!best || r.sse < best.sse - 1e-12)) best = r;
    } catch { /* try the next start */ }
  }
  if (!best) throw new Error('The single-drug curve could not be fitted. Check that the response rises with dose.');
  const emax = emaxFixed ?? best.p[2];
  // A free top far above 100 % means the curve does not level off within the doses: fall back to a top of 100 %.
  if (emaxFixed === undefined && emax > 150) return { ...fitHill(d, e, 100), capped: true };
  if (!(emax > 0)) throw new Error('A fitted maximum effect is not above 0. Check the single-drug responses.');
  return { ec50: 10 ** best.p[0], h: best.p[1], emax, r2: best.r2, n: x.length, converged: best.converged };
}

/** Loewe-additive effect at (a, b): the e with a/Dx_A(e) + b/Dx_B(e) = 1 (a drug past its Emax adds a/∞ = 0). */
export function loeweExpected(a: number, b: number, A: Hill, B: Hill): number {
  if (a <= 0) return hill(b, B);
  if (b <= 0) return hill(a, A);
  const g = (e: number) => {
    const da = e < A.emax ? hillInv(e, A) : Infinity, db = e < B.emax ? hillInv(e, B) : Infinity;
    return a / da + b / db - 1;
  };
  let lo = 1e-12, hi = Math.max(A.emax, B.emax) * (1 - 1e-12);
  if (g(hi) > 0) return hi; // the combination is beyond what either drug alone can reach
  for (let k = 0; k < 200 && hi - lo > 1e-12 * Math.max(1, hi); k++) { const m = (lo + hi) / 2; if (g(m) > 0) lo = m; else hi = m; }
  return (lo + hi) / 2;
}

export function analyse(m: Matrix, emaxFixed?: number): SynergyResult {
  const { a, b, e } = m;
  const i0 = a.indexOf(0), j0 = b.indexOf(0);
  if (i0 < 0 || j0 < 0) throw new Error('The matrix needs a dose of 0 for both drugs (a row and a column of single-drug responses).');
  const hillA = fitHill(a, a.map((_, i) => e[i][j0]), emaxFixed);
  const hillB = fitHill(b, b.map((_, j) => e[i0][j]), emaxFixed);
  const cells: Cell[] = [];
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) {
    const obs = e[i][j];
    if (!Number.isFinite(obs)) continue;
    const ea = e[i][j0] / 100, eb = e[i0][j] / 100;
    const bliss = (ea + eb - ea * eb) * 100, hsa = Math.max(e[i][j0], e[i0][j]);
    const loewe = loeweExpected(a[i], b[j], hillA, hillB);
    let ci = NaN;
    if (a[i] > 0 && b[j] > 0) {
      const da = hillInv(obs, hillA), db = hillInv(obs, hillB);
      if (Number.isFinite(da) && Number.isFinite(db)) ci = a[i] / da + b[j] / db;
    }
    cells.push({ i, j, a: a[i], b: b[j], obs, bliss, blissEx: obs - bliss, hsa, hsaEx: obs - hsa, loewe, loeweEx: obs - loewe, ci });
  }
  const combo = cells.filter((c) => c.a > 0 && c.b > 0);
  if (!combo.length) throw new Error('The matrix has no combination wells (both doses above 0).');
  const sum = (k: 'blissEx' | 'hsaEx' | 'loeweEx') => {
    let best = combo[0];
    for (const c of combo) if (c[k] > best[k]) best = c;
    return { mean: combo.reduce((s, c) => s + c[k], 0) / combo.length, max: best[k], at: [best.a, best.b] as [number, number] };
  };
  const cis = combo.map((c) => c.ci).filter((v) => v > 0 && Number.isFinite(v));
  return {
    hillA, hillB, cells,
    summary: {
      bliss: sum('blissEx'), hsa: sum('hsaEx'), loewe: sum('loeweEx'),
      ci: { geoMean: cis.length ? Math.exp(cis.reduce((s, v) => s + Math.log(v), 0) / cis.length) : NaN, n: cis.length, syn: cis.filter((v) => v < 0.9).length, add: cis.filter((v) => v >= 0.9 && v <= 1.1).length, ant: cis.filter((v) => v > 1.1).length },
    },
  };
}

/** Read a pasted matrix: first row = drug B doses (after a corner cell), first column = drug A doses. */
export function parseMatrix(rows: string[][], num: (s: string) => number): Matrix {
  if (rows.length < 3) throw new Error('Paste a matrix: a header row of drug B doses, then one row per drug A dose.');
  const b = rows[0].slice(1).map(num);
  if (b.length < 3 || b.some((v) => !Number.isFinite(v))) throw new Error('The first row must hold drug B doses after the corner cell (at least 3, numbers only).');
  if (b.some((v) => v < 0)) throw new Error('Doses cannot be negative.');
  const a: number[] = [], e: number[][] = [];
  for (const r of rows.slice(1)) {
    const d = num(r[0]);
    if (!Number.isFinite(d)) throw new Error(`"${r[0]}" in the first column is not a dose.`);
    if (d < 0) throw new Error('Doses cannot be negative.');
    a.push(d);
    e.push(b.map((_, j) => num(r[j + 1] ?? '')));
  }
  if (a.length < 3) throw new Error('Give at least 3 drug A doses (rows), including 0.');
  if (new Set(a).size !== a.length || new Set(b).size !== b.length) throw new Error('Each dose may appear once per drug.');
  if (a.length * b.length > 400) throw new Error('That is more than 400 wells. This tool takes matrices up to 20 × 20.');
  if (e.flat().some((v) => Number.isFinite(v) && (v < -50 || v > 150))) throw new Error('Responses should be % inhibition (about 0 to 100). Values far outside that look like raw signal: convert them first.');
  // Sort both axes ascending.
  const ia = a.map((_, i) => i).sort((p, q) => a[p] - a[q]), jb = b.map((_, j) => j).sort((p, q) => b[p] - b[q]);
  return { a: ia.map((i) => a[i]), b: jb.map((j) => b[j]), e: ia.map((i) => jb.map((j) => e[i][j])) };
}
