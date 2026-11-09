// Analysis of variance for field trials: completely randomised (CRD), randomised complete block (RCBD) and Latin
// square designs, with F tests, CV %, standard errors, the least significant difference (LSD) and mean separation
// letters. Plain TypeScript, no DOM. Methods: the usual sums of squares for balanced designs (Gomez and Gomez,
// Statistical Procedures for Agricultural Research, ch. 2), Fisher's LSD, and the insert-and-absorb letter
// algorithm (Piepho 2004, J. Comp. Graph. Stat. 13: 456-466).
import { fSf, tInv } from './stats.ts';

export type Design = 'crd' | 'rcbd' | 'latin';
export type Obs = { trt: string; block?: string; col?: string; y: number };
export type Row = { source: string; df: number; ss: number; ms: number; f?: number; p?: number };
export type Mean = { trt: string; n: number; mean: number; letters: string };
export type Result = {
  design: Design; rows: Row[]; grand: number; n: number; cv: number; mse: number; dfe: number;
  means: Mean[]; reps: number | null; sem: number | null; sed: number | null; lsd: number | null; alpha: number; tq: number;
  separated: boolean; sig: boolean[][];
};

const levels = (a: string[]) => [...new Set(a)];
const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;

/** Pull observations out of a parsed table with the chosen columns. Blank or non-numeric responses are dropped. */
export function readObs(table: string[][], cols: { trt: number; block?: number; col?: number; y: number }, num: (s: string) => number): { obs: Obs[]; dropped: number } {
  const obs: Obs[] = []; let dropped = 0;
  for (const r of table) {
    const y = num(r[cols.y] ?? ''), trt = (r[cols.trt] ?? '').trim();
    if (!trt || !Number.isFinite(y)) { dropped++; continue; }
    obs.push({ trt, block: cols.block != null ? (r[cols.block] ?? '').trim() : undefined, col: cols.col != null ? (r[cols.col] ?? '').trim() : undefined, y });
  }
  return { obs, dropped };
}

export function analyse(obs: Obs[], design: Design, alpha = 0.05, protect = true): Result {
  if (obs.length < 3) throw new Error('Add at least 3 plots with a treatment and a number.');
  const trts = levels(obs.map((o) => o.trt));
  if (trts.length < 2) throw new Error('There must be at least 2 treatments.');
  const N = obs.length, G = mean(obs.map((o) => o.y));
  const sst = obs.reduce((s, o) => s + (o.y - G) ** 2, 0);
  const byT = new Map(trts.map((t) => [t, obs.filter((o) => o.trt === t).map((o) => o.y)]));
  const ssOf = (keys: string[], key: (o: Obs) => string) => keys.reduce((s, k) => { const v = obs.filter((o) => key(o) === k).map((o) => o.y); return s + v.length * (mean(v) - G) ** 2; }, 0);
  const sstr = ssOf(trts, (o) => o.trt);
  const rows: Row[] = [];
  const t = trts.length;
  let reps: number | null = null;
  if (design === 'crd') {
    for (const [k, v] of byT) if (v.length < 1) throw new Error(`${k} has no plots.`);
    if (N - t < 1) throw new Error('Each treatment needs at least 2 plots for a completely randomised design (no error degrees of freedom).');
    rows.push({ source: 'Treatments', df: t - 1, ss: sstr, ms: 0 }, { source: 'Error', df: N - t, ss: sst - sstr, ms: 0 });
    const ns = [...byT.values()].map((v) => v.length);
    reps = ns.every((n) => n === ns[0]) ? ns[0] : null;
  } else if (design === 'rcbd') {
    const blocks = levels(obs.map((o) => o.block ?? ''));
    if (blocks.some((b) => !b)) throw new Error('Every plot needs a block (replicate) name or number.');
    if (blocks.length < 2) throw new Error('A randomised complete block design needs at least 2 blocks.');
    for (const b of blocks) for (const tr of trts) {
      const c = obs.filter((o) => o.block === b && o.trt === tr).length;
      if (c !== 1) throw new Error(c ? `${tr} appears ${c} times in block ${b}. Each treatment must be in each block exactly once.` : `${tr} is missing from block ${b}. A randomised complete block analysis needs every treatment in every block; estimate the missing plot first or analyse it as completely randomised.`);
    }
    const ssb = ssOf(blocks, (o) => o.block!), r = blocks.length;
    rows.push({ source: 'Blocks', df: r - 1, ss: ssb, ms: 0 }, { source: 'Treatments', df: t - 1, ss: sstr, ms: 0 }, { source: 'Error', df: (r - 1) * (t - 1), ss: sst - ssb - sstr, ms: 0 });
    reps = r;
  } else {
    const rs = levels(obs.map((o) => o.block ?? '')), cs = levels(obs.map((o) => o.col ?? ''));
    if (rs.some((x) => !x) || cs.some((x) => !x)) throw new Error('Every plot needs a row and a column for a Latin square.');
    if (t < 3) throw new Error('A Latin square needs at least 3 treatments.');
    if (rs.length !== t || cs.length !== t || N !== t * t) throw new Error(`A Latin square of ${t} treatments needs ${t} rows, ${t} columns and ${t * t} plots; this has ${rs.length} rows, ${cs.length} columns and ${N} plots.`);
    const seen = new Set<string>();
    for (const o of obs) { const k = `${o.block}\u0000${o.col}`; if (seen.has(k)) throw new Error(`Row ${o.block}, column ${o.col} has two plots.`); seen.add(k); }
    for (const tr of trts) for (const [what, key, ls] of [['row', 'block', rs], ['column', 'col', cs]] as const) for (const l of ls) {
      const c = obs.filter((o) => o.trt === tr && o[key] === l).length;
      if (c !== 1) throw new Error(`${tr} is in ${what} ${l} ${c} times. In a Latin square each treatment is in every row and every column once.`);
    }
    const ssr = ssOf(rs, (o) => o.block!), ssc = ssOf(cs, (o) => o.col!);
    rows.push({ source: 'Rows', df: t - 1, ss: ssr, ms: 0 }, { source: 'Columns', df: t - 1, ss: ssc, ms: 0 }, { source: 'Treatments', df: t - 1, ss: sstr, ms: 0 }, { source: 'Error', df: (t - 1) * (t - 2), ss: sst - ssr - ssc - sstr, ms: 0 });
    reps = t;
  }
  const err = rows[rows.length - 1];
  err.ss = Math.max(0, err.ss);
  for (const r of rows) r.ms = r.ss / r.df;
  const mse = err.ms, dfe = err.df;
  for (const r of rows.slice(0, -1)) { r.f = mse > 0 ? r.ms / mse : Infinity; r.p = mse > 0 ? fSf(r.f, r.df, dfe) : 0; }
  rows.push({ source: 'Total', df: N - 1, ss: sst, ms: NaN });
  const tq = tInv(1 - alpha / 2, dfe);
  const ms = trts.map((tr) => ({ trt: tr, n: byT.get(tr)!.length, mean: mean(byT.get(tr)!), letters: '' }));
  const pTrt = rows.find((r) => r.source === 'Treatments')!.p!;
  const separated = !protect || pTrt < alpha;
  // Pairwise LSD test (per pair, so unequal replication in a CRD is handled).
  const sig = ms.map((a) => ms.map((b) => separated && a !== b && Math.abs(a.mean - b.mean) > tq * Math.sqrt(mse * (1 / a.n + 1 / b.n)) * (1 + 1e-12)));
  const letters = letterGroups(ms.map((m) => m.mean), sig);
  ms.forEach((m, i) => (m.letters = letters[i]));
  const sem = reps ? Math.sqrt(mse / reps) : null, sed = reps ? Math.sqrt((2 * mse) / reps) : null;
  return { design, rows, grand: G, n: N, cv: (100 * Math.sqrt(mse)) / G, mse, dfe, means: ms, reps, sem, sed, lsd: sed != null ? tq * sed : null, alpha, tq, separated, sig };
}

/**
 * Compact letter display: means that share a letter are not significantly different. Insert-and-absorb
 * (Piepho 2004); letters are given from the highest mean down, so 'a' marks the top group.
 */
export function letterGroups(means: number[], sig: boolean[][]): string[] {
  const n = means.length;
  let cols: Set<number>[] = [new Set(means.map((_, i) => i))];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    if (!sig[i][j]) continue;
    const next: Set<number>[] = [];
    for (const c of cols) {
      if (c.has(i) && c.has(j)) { const a = new Set(c), b = new Set(c); a.delete(i); b.delete(j); next.push(a, b); }
      else next.push(c);
    }
    // Absorb: drop any column contained in another.
    cols = next.filter((c, k) => !next.some((d, m) => m !== k && c.size <= d.size && [...c].every((x) => d.has(x)) && (c.size < d.size || m < k)));
  }
  const order = means.map((_, i) => i).sort((a, b) => means[b] - means[a]);
  const rank = new Map(order.map((i, k) => [i, k]));
  cols.sort((a, b) => Math.min(...[...a].map((i) => rank.get(i)!)) - Math.min(...[...b].map((i) => rank.get(i)!)) || b.size - a.size);
  const L = (k: number) => (k < 26 ? String.fromCharCode(97 + k) : String.fromCharCode(65 + ((k - 26) % 26)) + (k >= 52 ? Math.floor(k / 26) - 1 : ''));
  return means.map((_, i) => cols.map((c, k) => (c.has(i) ? L(k) : '')).join(''));
}

/** Made-up yields (t/ha) of five varieties in four blocks, for the example. */
export const EXAMPLE = `variety\tblock\tyield
Variety A\t1\t4.2
Variety B\t1\t5.1
Variety C\t1\t3.6
Variety D\t1\t4.9
Variety E\t1\t4.0
Variety A\t2\t4.5
Variety B\t2\t5.4
Variety C\t2\t3.9
Variety D\t2\t4.6
Variety E\t2\t4.4
Variety A\t3\t3.9
Variety B\t3\t4.8
Variety C\t3\t3.4
Variety D\t3\t4.4
Variety E\t3\t3.8
Variety A\t4\t4.6
Variety B\t4\t5.6
Variety C\t4\t4.1
Variety D\t4\t5.2
Variety E\t4\t4.5`;
