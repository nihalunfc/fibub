// Feed ration balancing: the Pearson square for two feeds, and a least-cost ration found by linear programming
// (two-phase simplex with Bland's rule, small dense problems). Feeds and requirements are the user's own numbers;
// nutrient contents are on a dry-matter (DM) basis, prices per kg as fed. No DOM.

export type Op = '<=' | '>=' | '=';
export type Row = { a: number[]; op: Op; b: number };
export type LpResult = { status: 'optimal' | 'infeasible' | 'unbounded'; x: number[]; cost: number };

/**
 * Minimise c·x subject to rows and lo ≤ x ≤ hi (hi may be Infinity). Shifts x = lo + y so y ≥ 0, turns upper
 * bounds into rows, then runs a two-phase tableau simplex with Bland's rule (no cycling).
 */
export function lp(c: number[], rows: Row[], lo: number[] = c.map(() => 0), hi: number[] = c.map(() => Infinity)): LpResult {
  const n = c.length, EPS = 1e-9;
  if (lo.some((v, i) => v > hi[i] + EPS)) return { status: 'infeasible', x: [], cost: NaN };
  const R: Row[] = rows.map((r) => ({ a: r.a.slice(), op: r.op, b: r.b - r.a.reduce((s, v, i) => s + v * lo[i], 0) }));
  hi.forEach((h, i) => { if (Number.isFinite(h)) { const a = new Array(n).fill(0); a[i] = 1; R.push({ a, op: '<=', b: h - lo[i] }); } });
  for (const r of R) if (r.b < 0) { r.a = r.a.map((v) => -v); r.b = -r.b; r.op = r.op === '<=' ? '>=' : r.op === '>=' ? '<=' : '='; }
  const m = R.length;
  const nSlack = R.filter((r) => r.op !== '=').length, nArt = R.filter((r) => r.op !== '<=').length;
  const N = n + nSlack + nArt; // columns before the right-hand side
  const T: number[][] = [], basis: number[] = [];
  let s = n, a = n + nSlack;
  const art: number[] = [];
  for (const r of R) {
    const row = new Array(N + 1).fill(0);
    r.a.forEach((v, i) => (row[i] = v)); row[N] = r.b;
    if (r.op === '<=') { row[s] = 1; basis.push(s++); }
    else if (r.op === '>=') { row[s++] = -1; row[a] = 1; art.push(a); basis.push(a++); }
    else { row[a] = 1; art.push(a); basis.push(a++); }
    T.push(row);
  }
  const pivot = (r: number, k: number) => {
    const p = T[r][k]; for (let j = 0; j <= N; j++) T[r][j] /= p;
    for (let i = 0; i < m; i++) if (i !== r && T[i][k] !== 0) { const f = T[i][k]; for (let j = 0; j <= N; j++) T[i][j] -= f * T[r][j]; }
    basis[r] = k;
  };
  // Runs the simplex on objective cost (length N), only over allowed columns. Returns false if unbounded.
  const solve = (cost: number[], allowed: (j: number) => boolean) => {
    for (let it = 0; it < 5000; it++) {
      const cb = basis.map((j) => cost[j]);
      let enter = -1;
      for (let j = 0; j < N; j++) {
        if (!allowed(j) || basis.includes(j)) continue;
        let rc = cost[j]; for (let i = 0; i < m; i++) rc -= cb[i] * T[i][j];
        if (rc < -EPS) { enter = j; break; }
      }
      if (enter < 0) return true;
      let leave = -1, best = Infinity;
      for (let i = 0; i < m; i++) if (T[i][enter] > EPS) {
        const ratio = T[i][N] / T[i][enter];
        if (ratio < best - EPS || (Math.abs(ratio - best) <= EPS && basis[i] < basis[leave])) { best = ratio; leave = i; }
      }
      if (leave < 0) return false;
      pivot(leave, enter);
    }
    return true;
  };
  if (art.length) {
    const c1 = new Array(N).fill(0); art.forEach((j) => (c1[j] = 1));
    solve(c1, () => true);
    const infeas = basis.reduce((t, j, i) => t + (art.includes(j) ? T[i][N] : 0), 0);
    if (infeas > 1e-7 * Math.max(1, ...R.map((r) => Math.abs(r.b)))) return { status: 'infeasible', x: [], cost: NaN };
    // Drive any artificial left in the basis (at zero) out, where a real column can take its place.
    for (let i = 0; i < m; i++) if (art.includes(basis[i])) {
      const k = [...Array(n + nSlack).keys()].find((j) => Math.abs(T[i][j]) > EPS);
      if (k !== undefined) pivot(i, k);
    }
  }
  const c2 = new Array(N).fill(0); c.forEach((v, i) => (c2[i] = v));
  if (!solve(c2, (j) => j < n + nSlack)) return { status: 'unbounded', x: [], cost: -Infinity };
  const y = new Array(n).fill(0);
  basis.forEach((j, i) => { if (j < n) y[j] = T[i][N]; });
  const x = y.map((v, i) => Math.max(lo[i], v + lo[i]));
  return { status: 'optimal', x, cost: x.reduce((t, v, i) => t + v * c[i], 0) };
}

export type Feed = { name: string; dm: number; cp: number; energy: number; ca: number; p: number; price: number; min: number; max: number };
/** Daily requirement limits: DM intake in kg DM; protein, Ca and P in g; energy in the user's unit. NaN = no limit. */
export type Req = { dmMin: number; dmMax: number; cpMin: number; cpMax: number; enMin: number; enMax: number; caMin: number; caMax: number; pMin: number; pMax: number };
export const NUTRIENTS = [
  { key: 'dm', name: 'Dry matter intake', unit: 'kg DM' },
  { key: 'cp', name: 'Crude protein', unit: 'g' },
  { key: 'en', name: 'Energy', unit: '' },
  { key: 'ca', name: 'Calcium', unit: 'g' },
  { key: 'p', name: 'Phosphorus', unit: 'g' },
] as const;
type NKey = (typeof NUTRIENTS)[number]['key'];

/** What 1 kg of DM of a feed supplies, per nutrient (kg DM, g CP, energy, g Ca, g P). */
export const perKgDm = (f: Feed): Record<NKey, number> => ({ dm: 1, cp: f.cp * 10, en: f.energy, ca: f.ca * 10, p: f.p * 10 });
/** Price per kg of DM from the price per kg as fed. */
export const pricePerKgDm = (f: Feed) => f.price / (f.dm / 100);
/** Totals supplied by kg DM of each feed. */
export function supply(feeds: Feed[], x: number[]): Record<NKey, number> {
  const t = { dm: 0, cp: 0, en: 0, ca: 0, p: 0 };
  feeds.forEach((f, i) => { const k = perKgDm(f); for (const n of NUTRIENTS) t[n.key] += k[n.key] * x[i]; });
  return t;
}
const lim = (r: Req, k: NKey): [number, number] => [r[`${k}Min` as keyof Req], r[`${k}Max` as keyof Req]];

export type Ration = { status: LpResult['status']; dmKg: number[]; asFedKg: number[]; cost: number; supplied: Record<NKey, number>; binding: string[]; relax?: string[] };

/** The least-cost ration: kg DM/day of each feed. When none exists, `relax` lists single limits whose removal would make one possible. */
export function leastCost(feeds: Feed[], req: Req, tryRelax = true): Ration {
  const c = feeds.map(pricePerKgDm);
  const lo = feeds.map((f) => (Number.isFinite(f.min) ? Math.max(0, f.min) : 0)), hi = feeds.map((f) => (Number.isFinite(f.max) ? f.max : Infinity));
  const named: { label: string; row: Row }[] = [];
  for (const n of NUTRIENTS) {
    const a = feeds.map((f) => perKgDm(f)[n.key]), [mn, mx] = lim(req, n.key);
    if (Number.isFinite(mn)) named.push({ label: `${n.name} minimum`, row: { a, op: '>=', b: mn } });
    if (Number.isFinite(mx)) named.push({ label: `${n.name} maximum`, row: { a, op: '<=', b: mx } });
  }
  const r = lp(c, named.map((q) => q.row), lo, hi);
  if (r.status !== 'optimal') {
    let relax: string[] | undefined;
    if (tryRelax && r.status === 'infeasible') {
      relax = named.filter((_, k) => lp(c, named.filter((__, j) => j !== k).map((q) => q.row), lo, hi).status === 'optimal').map((q) => q.label);
      feeds.forEach((f, i) => { if (lo[i] > 0 && lp(c, named.map((q) => q.row), lo.map((v, j) => (j === i ? 0 : v)), hi).status === 'optimal') relax!.push(`${f.name} minimum`); });
      feeds.forEach((f, i) => { if (Number.isFinite(hi[i]) && lp(c, named.map((q) => q.row), lo, hi.map((v, j) => (j === i ? Infinity : v))).status === 'optimal') relax!.push(`${f.name} maximum`); });
    }
    return { status: r.status, dmKg: [], asFedKg: [], cost: NaN, supplied: { dm: 0, cp: 0, en: 0, ca: 0, p: 0 }, binding: [], relax };
  }
  const x = r.x.map((v) => (Math.abs(v) < 1e-10 ? 0 : v));
  const sup = supply(feeds, x);
  const tol = (v: number) => 1e-6 * Math.max(1, Math.abs(v));
  const binding = named.filter((q) => Math.abs(q.row.a.reduce((t, v, i) => t + v * x[i], 0) - q.row.b) < tol(q.row.b)).map((q) => q.label);
  feeds.forEach((f, i) => {
    if (lo[i] > 0 && Math.abs(x[i] - lo[i]) < tol(lo[i])) binding.push(`${f.name} minimum`);
    if (Number.isFinite(hi[i]) && Math.abs(x[i] - hi[i]) < tol(hi[i])) binding.push(`${f.name} maximum`);
  });
  return { status: 'optimal', dmKg: x, asFedKg: x.map((v, i) => v / (feeds[i].dm / 100)), cost: r.cost, supplied: sup, binding };
}

export type Square = { ok: boolean; partsA: number; partsB: number; fracA: number; fracB: number; asFedA: number; asFedB: number };
/**
 * Pearson square: the share of feed A and B (DM basis) whose mix has the target concentration. Parts of A are
 * |target − b| and parts of B are |a − target|. Only possible when the target lies between the two feeds.
 * asFed* give the shares as fed, from each feed's DM %.
 */
export function pearson(a: number, b: number, target: number, dmA = 100, dmB = 100): Square {
  const ok = a !== b && target >= Math.min(a, b) && target <= Math.max(a, b);
  const partsA = Math.abs(target - b), partsB = Math.abs(a - target), tot = partsA + partsB;
  const fracA = tot ? partsA / tot : NaN, fracB = tot ? partsB / tot : NaN;
  const fa = fracA / (dmA / 100), fb = fracB / (dmB / 100);
  return { ok, partsA, partsB, fracA, fracB, asFedA: fa / (fa + fb), asFedB: fb / (fa + fb) };
}

/** Feeds from a pasted table: name, DM %, CP % DM, energy per kg DM, Ca % DM, P % DM, price per kg as fed, min and max kg DM/day (optional). */
export function readFeeds(rows: string[][], num: (s: string) => number): { feeds: Feed[]; errors: string[] } {
  const feeds: Feed[] = [], errors: string[] = [];
  rows.forEach((r, k) => {
    if (k === 0 && r.slice(1, 3).some((c) => Number.isNaN(num(c)))) return; // header
    const v = r.slice(1).map((c) => (c === '' || c === undefined ? NaN : num(c)));
    const [dm, cp, energy, ca, p, price, min, max] = v;
    const name = (r[0] || `Feed ${feeds.length + 1}`).trim();
    if (![dm, cp, energy, ca, p, price].every(Number.isFinite)) { errors.push(`Row ${k + 1} (${name}): give DM, CP, energy, Ca, P and price as numbers.`); return; }
    if (!(dm > 0 && dm <= 100)) { errors.push(`Row ${k + 1} (${name}): DM must be above 0 and at most 100 %.`); return; }
    if ([cp, energy, ca, p, price].some((x) => x < 0) || (min < 0) || (max < 0)) { errors.push(`Row ${k + 1} (${name}): values cannot be negative.`); return; }
    if (Number.isFinite(min) && Number.isFinite(max) && min > max) { errors.push(`Row ${k + 1} (${name}): the minimum is above the maximum.`); return; }
    feeds.push({ name, dm, cp, energy, ca, p, price, min: Number.isFinite(min) ? min : NaN, max: Number.isFinite(max) ? max : NaN });
  });
  return { feeds, errors };
}

/** Made-up round example values, for trying the tool. They are not real feed analyses or recommendations. */
export const EXAMPLE_FEEDS = `Feed, DM %, CP % DM, Energy per kg DM, Ca % DM, P % DM, Price per kg as fed, Min kg DM, Max kg DM
Grass hay (example), 88, 10, 9, 0.5, 0.25, 0.15, 4,
Maize silage (example), 35, 8, 11, 0.3, 0.25, 0.05, , 10
Barley grain (example), 88, 12, 13, 0.1, 0.4, 0.25, ,
Soybean meal (example), 89, 48, 13, 0.3, 0.7, 0.5, ,
Limestone (example), 100, 0, 0, 38, 0, 0.1, , 0.3`;
export const EXAMPLE_REQ: Req = { dmMin: 19, dmMax: 21, cpMin: 3000, cpMax: NaN, enMin: 220, enMax: NaN, caMin: 100, caMax: NaN, pMin: 60, pMax: NaN };
