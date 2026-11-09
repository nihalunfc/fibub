// Project scheduling for the project scheduler tool: the critical path method (forward and backward pass with
// finish-to-start, start-to-start, finish-to-finish and start-to-finish links and lags), total and free float,
// PERT three-point estimates with the chance of finishing by a date, and a seeded Monte Carlo run with beta-PERT
// durations. Plain TypeScript, no DOM.
import { parseCsv } from '../convert/table.ts';
import { normCdf, normInv } from './stats.ts';

export type LinkType = 'FS' | 'SS' | 'FF' | 'SF';
export interface Link { from: number; type: LinkType; lag: number }
export interface Task { id: string; name: string; d: number; preds: Link[]; o?: number; m?: number; p?: number; row: number }
export interface Project { tasks: Task[]; pert: boolean; notes: string[] }
export interface Row extends Task { es: number; ef: number; ls: number; lf: number; tf: number; ff: number; critical: boolean; sd: number }
export interface Schedule { rows: Row[]; T: number; order: number[]; path: number[]; pathVar: number; paths: number }
export const MAX_TASKS = 2000;

const num = (s: string) => { const t = s.trim().replace(/,(?=\d{3}\b)/g, ''); return t === '' ? NaN : Number(t); };
const HEAD: [RegExp, string][] = [
  [/^(id|code|#|no\.?|wbs|activity\s*id)$/i, 'id'],
  [/^(name|task|activity|description|title)$/i, 'name'],
  [/^(duration|dur\.?|d|days|time|length)$/i, 'd'],
  [/^(predecessors?|preds?|depends(\s+on)?|dependencies|after|prerequisites?)$/i, 'pred'],
  [/^(optimistic|o|a|best|min)$/i, 'o'],
  [/^(most\s*likely|likely|m|ml|normal|mode)$/i, 'm'],
  [/^(pessimistic|p|b|worst|max)$/i, 'p'],
];

/** Read the task table: ID, name, duration, predecessors, and optionally optimistic, most likely and pessimistic. */
export function parseProject(text: string): Project {
  const table = parseCsv(text.replace(/\r/g, '')).map((r) => r.map((c) => (c ?? '').trim())).filter((r) => r.some((c) => c !== ''));
  if (!table.length) throw new Error('Type or paste the tasks: one row each with an ID, a name, a duration and the predecessors.');
  const notes: string[] = [];
  let col: Record<string, number> = { id: 0, name: 1, d: 2, pred: 3 };
  let start = 0;
  const h = table[0].map((c) => HEAD.find(([re]) => re.test(c))?.[1]);
  if (h.filter(Boolean).length >= 2 && !table[0].some((c) => c !== '' && Number.isFinite(num(c)))) {
    col = {}; h.forEach((k, i) => { if (k && col[k] === undefined) col[k] = i; }); start = 1;
    if (col.id === undefined) throw new Error('The header row needs an ID column.');
    if (col.d === undefined && !(col.o !== undefined && col.m !== undefined && col.p !== undefined)) throw new Error('The header row needs a Duration column, or Optimistic, Most likely and Pessimistic columns.');
  }
  const pert = col.o !== undefined && col.m !== undefined && col.p !== undefined;
  const rows = table.slice(start);
  if (rows.length > MAX_TASKS) throw new Error(`There are ${rows.length} tasks; this tool takes up to ${MAX_TASKS}.`);
  const tasks: Task[] = [], idx = new Map<string, number>();
  rows.forEach((r, k) => {
    const line = k + start + 1, id = (r[col.id] ?? '').trim();
    if (!id) throw new Error(`Row ${line}: the task has no ID.`);
    if (/[\s,;]/.test(id)) throw new Error(`Row ${line}: the ID "${id}" has a space or comma; use short IDs such as A, B or T1.`);
    if (idx.has(id)) throw new Error(`Row ${line}: the ID "${id}" is used twice.`);
    const t: Task = { id, name: col.name !== undefined ? r[col.name] ?? '' : '', d: NaN, preds: [], row: line };
    if (pert) {
      const o = num(r[col.o] ?? ''), m = num(r[col.m] ?? ''), p = num(r[col.p] ?? '');
      if (![o, m, p].every((v) => v >= 0)) throw new Error(`Row ${line} (${id}): type the optimistic, most likely and pessimistic times as numbers, 0 or more.`);
      if (!(o <= m && m <= p)) throw new Error(`Row ${line} (${id}): the times must run optimistic ≤ most likely ≤ pessimistic.`);
      Object.assign(t, { o, m, p, d: (o + 4 * m + p) / 6 });
    } else {
      t.d = num(r[col.d] ?? '');
      if (!(t.d >= 0)) throw new Error(`Row ${line} (${id}): the duration must be a number, 0 or more.`);
    }
    idx.set(id, tasks.length); tasks.push(t);
  });
  // Predecessors: "A B", "A, B", "A+2" (finish-to-start with a lag), "B SS", "C FF-1", "DSS+3".
  rows.forEach((r, k) => {
    const t = tasks[k], s = col.pred !== undefined ? (r[col.pred] ?? '') : '';
    const toks = s.split(/[\s,;]+/).filter(Boolean);
    for (const tok of toks) {
      const ty = /^(FS|SS|FF|SF)\s*([+-]\s*\d*\.?\d+)?$/i.exec(tok), lg = /^[+-]\d*\.?\d+$/.exec(tok);
      const last = t.preds[t.preds.length - 1];
      if (ty && last) { last.type = ty[1].toUpperCase() as LinkType; if (ty[2]) last.lag = Number(ty[2].replace(/\s/g, '')); continue; }
      if (lg && last) { last.lag = Number(tok); continue; }
      let id = tok, type: LinkType = 'FS', lag = 0;
      if (!idx.has(id)) {
        const m = /^(.+?)(FS|SS|FF|SF)?([+-]\d*\.?\d+)?$/i.exec(tok);
        if (m && idx.has(m[1])) { id = m[1]; if (m[2]) type = m[2].toUpperCase() as LinkType; if (m[3]) lag = Number(m[3]); }
        else throw new Error(`Row ${t.row} (${t.id}): the predecessor "${tok}" is not a task ID.`);
      }
      const from = idx.get(id)!;
      if (from === k) throw new Error(`Row ${t.row} (${t.id}): a task cannot come after itself.`);
      t.preds.push({ from, type, lag });
    }
  });
  if (tasks.some((t) => t.preds.some((p) => p.type !== 'FS' || p.lag !== 0))) notes.push('Links other than plain finish-to-start, or lags, are used.');
  return { tasks, pert, notes };
}

/** Order the tasks so every predecessor comes first; throws naming a loop if there is one. */
export function topo(tasks: Task[]): number[] {
  const n = tasks.length, indeg = new Array(n).fill(0), succ: number[][] = tasks.map(() => []);
  tasks.forEach((t, j) => t.preds.forEach((p) => { succ[p.from].push(j); indeg[j]++; }));
  const q: number[] = []; indeg.forEach((d, i) => { if (!d) q.push(i); });
  const out: number[] = [];
  while (q.length) { const i = q.shift()!; out.push(i); for (const j of succ[i]) if (!--indeg[j]) q.push(j); }
  if (out.length < n) {
    // Find one loop to name it.
    const left = new Set(tasks.map((_, i) => i).filter((i) => !out.includes(i)));
    let i = [...left][0]; const seen: number[] = [];
    while (!seen.includes(i)) { seen.push(i); i = tasks[i].preds.map((p) => p.from).find((f) => left.has(f))!; }
    const loop = seen.slice(seen.indexOf(i)).reverse().map((k) => tasks[k].id);
    throw new Error(`The predecessors go round in a loop: ${[...loop, loop[0]].join(' → ')}. Remove one of these links.`);
  }
  return out;
}

/** Forward and backward pass with the given durations. */
export function schedule(tasks: Task[], dur = tasks.map((t) => t.d)): Schedule {
  const n = tasks.length, order = topo(tasks);
  const es = new Array(n).fill(0), succ: { to: number; type: LinkType; lag: number }[][] = tasks.map(() => []);
  tasks.forEach((t, j) => t.preds.forEach((p) => succ[p.from].push({ to: j, type: p.type, lag: p.lag })));
  // Earliest start S_j from a link i → j: FS S_i+d_i+lag, SS S_i+lag, FF S_i+d_i+lag-d_j, SF S_i+lag-d_j.
  const need = (i: number, j: number, type: LinkType, lag: number, Si: number) => type === 'FS' ? Si + dur[i] + lag : type === 'SS' ? Si + lag : type === 'FF' ? Si + dur[i] + lag - dur[j] : Si + lag - dur[j];
  for (const j of order) { let s = 0; for (const p of tasks[j].preds) s = Math.max(s, need(p.from, j, p.type, p.lag, es[p.from])); es[j] = s; }
  const ef = es.map((s, i) => s + dur[i]);
  const T = n ? Math.max(...ef) : 0;
  // Latest start: S_i ≤ bound from each successor j at its latest start.
  const ls = new Array(n).fill(0);
  const bound = (i: number, j: number, type: LinkType, lag: number, Sj: number) => type === 'FS' ? Sj - dur[i] - lag : type === 'SS' ? Sj - lag : type === 'FF' ? Sj + dur[j] - dur[i] - lag : Sj + dur[j] - lag;
  for (let k = n - 1; k >= 0; k--) { const i = order[k]; let s = T - dur[i]; for (const e of succ[i]) s = Math.min(s, bound(i, e.to, e.type, e.lag, ls[e.to])); ls[i] = s; }
  const eps = 1e-9 * (1 + T);
  const rows: Row[] = tasks.map((t, i) => {
    let ff = succ[i].length ? Infinity : T - ef[i];
    for (const e of succ[i]) ff = Math.min(ff, es[e.to] - need(i, e.to, e.type, e.lag, es[i]));
    const tf = ls[i] - es[i];
    const sd = t.o !== undefined ? (t.p! - t.o) / 6 : 0;
    return { ...t, d: dur[i], es: es[i], ef: ef[i], ls: ls[i], lf: ls[i] + dur[i], tf: Math.abs(tf) < eps ? 0 : tf, ff: Math.abs(ff) < eps ? 0 : Math.max(0, ff), critical: Math.abs(tf) < eps, sd };
  });
  // A critical path: walk back from a critical task finishing at T along tight links between critical tasks;
  // when several critical paths exist, take the one with the largest variance (PERT practice).
  const best: { v: number; path: number[] }[] = new Array(n);
  let paths = 0;
  const tight = (p: Link, j: number) => Math.abs(need(p.from, j, p.type, p.lag, es[p.from]) - es[j]) < eps;
  const cnt = new Array(n).fill(0);
  for (const j of order) {
    if (!rows[j].critical) continue;
    const v = rows[j].sd ** 2;
    let b: { v: number; path: number[] } = { v, path: [j] }, c = 0;
    for (const p of tasks[j].preds) if (rows[p.from].critical && tight(p, j) && best[p.from]) { c += cnt[p.from]; if (best[p.from].v + v > b.v - 1e-15 || b.path.length === 1) b = { v: best[p.from].v + v, path: [...best[p.from].path, j] }; }
    if (es[j] < eps) { c = Math.max(c, 1); }
    cnt[j] = c; best[j] = b;
  }
  let end = -1;
  for (const j of order) if (rows[j].critical && Math.abs(rows[j].ef - T) < eps && cnt[j] > 0 && (end < 0 || best[j].v > best[end].v)) end = j;
  for (const j of order) if (rows[j].critical && Math.abs(rows[j].ef - T) < eps) paths += cnt[j];
  return { rows, T, order, path: end >= 0 ? best[end].path : [], pathVar: end >= 0 ? best[end].v : 0, paths };
}

/** PERT: chance of finishing by `D` (normal approximation on the critical path), and the date for a chance `q`. */
export function pertChance(s: Schedule, D: number): number { const sd = Math.sqrt(s.pathVar); return sd > 0 ? normCdf((D - s.T) / sd) : D >= s.T - 1e-9 ? 1 : 0; }
export function pertDate(s: Schedule, q: number): number { return s.T + Math.sqrt(s.pathVar) * normInv(q); }

// ---------- Monte Carlo with beta-PERT durations ----------
function rng(seed: number) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function gamma(k: number, r: () => number): number {
  if (k < 1) return gamma(k + 1, r) * r() ** (1 / k);
  const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
  for (;;) { let x, v; do { let u = 0; while (u === 0) u = r(); x = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); v = 1 + c * x; } while (v <= 0); v = v * v * v; const u = r(); if (u < 1 - 0.0331 * x ** 4 || Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v; }
}
/** Beta-PERT sample on [o, p] with mode m (mean (o + 4m + p)/6). */
export function betaPert(o: number, m: number, p: number, r: () => number): number {
  if (p - o <= 0) return m;
  const a = 1 + (4 * (m - o)) / (p - o), b = 1 + (4 * (p - m)) / (p - o), x = gamma(a, r), y = gamma(b, r);
  return o + ((p - o) * x) / (x + y);
}
export interface MonteCarlo { totals: number[]; mean: number; sd: number; pBy: number; critIndex: number[] }
/** Simulate the project `runs` times with beta-PERT durations; returns sorted finish times and how often each task was critical. */
export function monteCarlo(tasks: Task[], D: number, runs = 5000, seed = 1): MonteCarlo {
  const r = rng(seed), totals: number[] = [], crit = new Array(tasks.length).fill(0);
  for (let k = 0; k < runs; k++) {
    const dur = tasks.map((t) => (t.o !== undefined ? betaPert(t.o, t.m!, t.p!, r) : t.d));
    const s = schedule(tasks, dur); totals.push(s.T); s.rows.forEach((x, i) => { if (x.critical) crit[i]++; });
  }
  totals.sort((a, b) => a - b);
  const mean = totals.reduce((s, v) => s + v, 0) / runs, sd = Math.sqrt(totals.reduce((s, v) => s + (v - mean) ** 2, 0) / (runs - 1));
  return { totals, mean, sd, pBy: totals.filter((t) => t <= D + 1e-9).length / runs, critIndex: crit.map((c) => c / runs) };
}

/** Working-day calendar: the date of day offset `x` (0 = start of the first day) from `start`, optionally skipping Saturdays and Sundays. */
export function addDays(start: Date, x: number, weekdays: boolean): Date {
  const d = new Date(start.getTime());
  let n = Math.floor(x + 1e-9);
  if (!weekdays) { d.setUTCDate(d.getUTCDate() + n); return d; }
  while (d.getUTCDay() === 0 || d.getUTCDay() === 6) d.setUTCDate(d.getUTCDate() + 1);
  while (n > 0) { d.setUTCDate(d.getUTCDate() + 1); if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) n--; }
  return d;
}

export const EXAMPLE = `ID,Task,Optimistic,Most likely,Pessimistic,Predecessors
A,Agree the brief,1,2,4,
B,Survey the site,2,3,6,A
C,Draw the plans,4,6,10,A
D,Order materials,1,2,3,C
E,Get approval,3,5,12,C
F,Prepare the site,2,4,6,B
G,Build,8,10,16,D E F
H,Fit out,3,4,7,G
I,Inspect and hand over,1,1,2,H
`;
export const EXAMPLE_PLAIN = `ID,Task,Duration,Predecessors
A,Agree the brief,2,
B,Survey the site,3,A
C,Draw the plans,6,A
D,Order materials,2,C
E,Get approval,5,C SS+2
F,Prepare the site,4,B
G,Build,10,D E F
H,Fit out,4,G FF+1
I,Inspect and hand over,1,H
`;
