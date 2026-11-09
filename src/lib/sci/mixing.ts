// End-member mixing: unmix samples into 2 or 3 sources from several tracers (concentrations and δ values, optionally
// weighted by a concentration), by least squares with fractions that are non-negative and sum to 1. Plain maths.

export type Tracer = { name: string; delta: boolean; weight?: number };
export type Model = { tracers: Tracer[]; names: string[]; em: number[][] };

/** Predicted tracer values for fractions f (one per end-member). */
export function predict(m: Model, f: number[]): number[] {
  return m.tracers.map((t, j) => {
    if (!t.delta || t.weight === undefined) return f.reduce((s, fi, i) => s + fi * m.em[i][j], 0);
    const w = t.weight, num = f.reduce((s, fi, i) => s + fi * m.em[i][w] * m.em[i][j], 0), den = f.reduce((s, fi, i) => s + fi * m.em[i][w], 0);
    return num / den;
  });
}

/** Linear rows a·f = b for one sample: a weighted δ becomes Σ f_i W_i (δ_i − δ_sample) = 0. Each row is scaled to unit size. */
function rows(m: Model, y: number[]) {
  return m.tracers.map((t, j) => {
    let a: number[], b: number;
    if (t.delta && t.weight !== undefined) { a = m.em.map((e) => e[t.weight!] * (e[j] - y[j])); b = 0; }
    else { a = m.em.map((e) => e[j]); b = y[j]; }
    const spread = Math.max(...m.em.map((e) => e[j])) - Math.min(...m.em.map((e) => e[j]));
    const s = t.delta && t.weight !== undefined ? Math.max(...m.em.map((e) => Math.abs(e[t.weight!]))) * (spread || 1) : spread || Math.max(1e-12, Math.abs(b));
    return { a: a.map((v) => v / s), b: b / s };
  });
}

function solveSub(R: { a: number[]; b: number }[], idx: number[], k: number): number[] | null {
  // Least squares over the end-members in idx with Σf = 1: substitute f_last = 1 − Σ others.
  const n = idx.length, f = new Array(k).fill(0);
  if (n === 1) { f[idx[0]] = 1; return f; }
  const last = idx[n - 1], free = idx.slice(0, n - 1);
  const A = R.map((r) => free.map((i) => r.a[i] - r.a[last])), B = R.map((r) => r.b - r.a[last]);
  // Normal equations.
  const p = free.length, M = Array.from({ length: p }, () => new Array(p).fill(0)), v = new Array(p).fill(0);
  A.forEach((row, r) => { for (let i = 0; i < p; i++) { v[i] += row[i] * B[r]; for (let j = 0; j < p; j++) M[i][j] += row[i] * row[j]; } });
  let x: number[];
  if (p === 1) { if (!(Math.abs(M[0][0]) > 1e-15)) return null; x = [v[0] / M[0][0]]; }
  else { const det = M[0][0] * M[1][1] - M[0][1] * M[1][0]; if (!(Math.abs(det) > 1e-15)) return null; x = [(v[0] * M[1][1] - v[1] * M[0][1]) / det, (M[0][0] * v[1] - M[1][0] * v[0]) / det]; }
  free.forEach((i, j) => { f[i] = x[j]; });
  f[last] = 1 - x.reduce((s, q) => s + q, 0);
  return f;
}

/**
 * Unmix one sample. Returns fractions (≥ 0, sum 1), the unconstrained fractions, whether a bound was hit,
 * the predicted tracer values and the scaled RMS misfit.
 */
export function unmix(m: Model, y: number[]) {
  const k = m.em.length;
  if (k < 2 || k > 3) throw new Error('Use two or three end-members');
  if (m.tracers.length < k - 1) throw new Error(`${k} end-members need at least ${k - 1} tracer${k - 1 > 1 ? 's' : ''}`);
  const R = rows(m, y);
  const cost = (f: number[]) => R.reduce((s, r) => s + (r.a.reduce((t, a, i) => t + a * f[i], 0) - r.b) ** 2, 0);
  const all = [...Array(k).keys()];
  const free = solveSub(R, all, k);
  if (!free) throw new Error('The end-members cannot be told apart with these tracers (two of them look the same)');
  let best = free, clipped = false;
  if (free.some((v) => v < -1e-12)) {
    clipped = true;
    const subsets = k === 3 ? [[0, 1], [0, 2], [1, 2], [0], [1], [2]] : [[0], [1]];
    let bc = Infinity;
    for (const s of subsets) { const f = solveSub(R, s, k); if (f && f.every((v) => v >= -1e-12)) { const c = cost(f); if (c < bc) { bc = c; best = f; } } }
    best = best.map((v) => Math.max(0, v));
  }
  const pred = predict(m, best);
  return { f: best, free, clipped, pred, rms: Math.sqrt(cost(best) / R.length) };
}

/** Parse a table whose first column is a name and whose header row names the tracers. */
export function parseNamed(text: string, split: (t: string) => string[][]): { names: string[]; header: string[]; rows: number[][] } {
  const t = split(text);
  if (t.length < 2) throw new Error('Give a header row and at least one data row');
  const header = t[0].slice(1).map((h) => h.trim());
  const rows: number[][] = [], names: string[] = [];
  for (const r of t.slice(1)) {
    const v = r.slice(1).map((c) => Number(String(c).replace(/[−–]/g, '-').trim()));
    if (v.length !== header.length || v.some((x) => !Number.isFinite(x))) throw new Error(`Row "${r[0]}" needs a number for each of ${header.join(', ')}`);
    names.push(String(r[0]).trim()); rows.push(v);
  }
  return { names, header, rows };
}

/** δ-like tracer names: start with d, δ or "delta" followed by a digit. */
export const looksDelta = (name: string) => /^(δ|d|delta)\s*\d/i.test(name.trim());
