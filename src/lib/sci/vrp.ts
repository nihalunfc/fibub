// Vehicle routing for small instances (#586): Clarke-Wright savings, then 2-opt and or-opt improvement (within and
// between routes), exact route order by Held-Karp dynamic programming for routes of up to 12 stops, and an exact
// capacitated solution (subset dynamic programming) when there are at most 12 customers. Plain TypeScript, no DOM.
// Node 0 is the depot. Checked against brute force and PuLP in tests/sci-tools/vehicle-routing.mjs.

export type Instance = { names: string[]; d: number[][]; demand: number[]; cap: number; vehicles: number; xy?: [number, number][] };
export type Solution = { routes: number[][]; length: number; loads: number[]; lengths: number[] };

export const EXACT_MAX = 12;

/** Straight-line distances between points. */
export function euclid(xy: [number, number][]): number[][] {
  return xy.map((a) => xy.map((b) => Math.hypot(a[0] - b[0], a[1] - b[1])));
}

/** Length of one route depot → stops → depot. */
export function routeLength(d: number[][], r: number[]): number {
  if (!r.length) return 0;
  let s = d[0][r[0]] + d[r[r.length - 1]][0];
  for (let k = 0; k + 1 < r.length; k++) s += d[r[k]][r[k + 1]];
  return s;
}

export function summarise(inst: Instance, routes: number[][]): Solution {
  const rs = routes.filter((r) => r.length);
  const lengths = rs.map((r) => routeLength(inst.d, r)), loads = rs.map((r) => r.reduce((s, i) => s + inst.demand[i], 0));
  return { routes: rs, lengths, loads, length: lengths.reduce((a, b) => a + b, 0) };
}

/** Check an instance: square matrix, demands not above capacity. Throws plain messages. */
export function validate(inst: Instance) {
  const n = inst.d.length;
  if (n < 2) throw new Error('Give a depot and at least one customer.');
  if (inst.d.some((r) => r.length !== n || r.some((v) => !(v >= 0) || !Number.isFinite(v)))) throw new Error('Distances must be a square table of numbers of 0 or more.');
  if (!(inst.cap > 0)) throw new Error('Vehicle capacity must be more than 0.');
  const big = inst.demand.findIndex((q, i) => i > 0 && q > inst.cap);
  if (big > 0) throw new Error(`${inst.names[big]} needs ${inst.demand[big]}, more than one vehicle carries (${inst.cap}).`);
  if (inst.demand.some((q, i) => i > 0 && !(q >= 0))) throw new Error('Demands must be numbers of 0 or more.');
}

/** Clarke-Wright savings, parallel version: join route ends in order of saving d(0,i) + d(0,j) − d(i,j) while the load fits. */
export function savings(inst: Instance): number[][] {
  const n = inst.d.length, d = inst.d;
  const route = new Array(n).fill(-1), routes: (number[] | null)[] = [], load: number[] = [];
  for (let i = 1; i < n; i++) { route[i] = routes.length; routes.push([i]); load.push(inst.demand[i]); }
  const pairs: [number, number, number][] = [];
  for (let i = 1; i < n; i++) for (let j = i + 1; j < n; j++) pairs.push([d[0][i] + d[0][j] - d[i][j], i, j]);
  pairs.sort((a, b) => b[0] - a[0] || a[1] - b[1] || a[2] - b[2]);
  for (const [s, i, j] of pairs) {
    if (s <= 1e-12) break;
    const a = route[i], b = route[j];
    if (a === b || load[a] + load[b] > inst.cap + 1e-9) continue;
    let ra = routes[a]!, rb = routes[b]!;
    // i must be an end of its route and j an end of its route; orient so i is last of ra and j first of rb.
    if (ra[ra.length - 1] !== i) { if (ra[0] === i) ra = ra.slice().reverse(); else continue; }
    if (rb[0] !== j) { if (rb[rb.length - 1] === j) rb = rb.slice().reverse(); else continue; }
    const merged = [...ra, ...rb];
    routes[a] = merged; routes[b] = null; load[a] += load[b];
    for (const k of rb) route[k] = a;
  }
  return routes.filter((r): r is number[] => !!r);
}

/** Best order of one route's stops (Held-Karp, exact) for up to EXACT_MAX stops. */
export function heldKarp(d: number[][], stops: number[]): { order: number[]; length: number } {
  const k = stops.length;
  if (k === 0) return { order: [], length: 0 };
  if (k > EXACT_MAX) throw new Error(`Exact ordering is for up to ${EXACT_MAX} stops.`);
  const full = 1 << k, dp = new Float64Array(full * k).fill(Infinity), par = new Int8Array(full * k).fill(-1);
  for (let a = 0; a < k; a++) dp[(1 << a) * k + a] = d[0][stops[a]];
  for (let m = 1; m < full; m++) for (let a = 0; a < k; a++) {
    const cur = dp[m * k + a]; if (!(m & (1 << a)) || cur === Infinity) continue;
    for (let b = 0; b < k; b++) {
      if (m & (1 << b)) continue;
      const nm = m | (1 << b), v = cur + d[stops[a]][stops[b]];
      if (v < dp[nm * k + b] - 1e-12) { dp[nm * k + b] = v; par[nm * k + b] = a; }
    }
  }
  let best = Infinity, last = -1;
  for (let a = 0; a < k; a++) { const v = dp[(full - 1) * k + a] + d[stops[a]][0]; if (v < best - 1e-12) { best = v; last = a; } }
  const order: number[] = []; let m = full - 1, a = last;
  while (a >= 0) { order.push(stops[a]); const p = par[m * k + a]; m ^= 1 << a; a = p; }
  return { order: order.reverse(), length: best };
}

/** 2-opt inside one route: reverse a stretch while that shortens it. */
export function twoOpt(d: number[][], r: number[]): number[] {
  const t = [0, ...r, 0];
  for (let improved = true; improved;) {
    improved = false;
    for (let i = 1; i < t.length - 2; i++) for (let j = i + 1; j < t.length - 1; j++) {
      const delta = d[t[i - 1]][t[j]] + d[t[i]][t[j + 1]] - d[t[i - 1]][t[i]] - d[t[j]][t[j + 1]];
      if (delta < -1e-10) { const seg = t.slice(i, j + 1).reverse(); t.splice(i, seg.length, ...seg); improved = true; }
    }
  }
  return t.slice(1, -1);
}

/**
 * Or-opt: move a run of 1 to 3 consecutive stops (kept in order or reversed) to the best other place, in the same
 * route or another one with room. Repeats while it shortens the total.
 */
export function orOpt(inst: Instance, routes: number[][]): number[][] {
  const d = inst.d, R = routes.map((r) => r.slice()), load = R.map((r) => r.reduce((s, i) => s + inst.demand[i], 0));
  const at = (r: number[], k: number) => (k < 0 || k >= r.length ? 0 : r[k]);
  for (let pass = 0, improved = true; improved && pass < 5000; pass++) {
    improved = false;
    outer: for (let a = 0; a < R.length; a++) for (let L = 1; L <= 3; L++) for (let i = 0; i + L <= R[a].length; i++) {
      const ra = R[a], seg = ra.slice(i, i + L), first = seg[0], last = seg[L - 1], q = seg.reduce((s, x) => s + inst.demand[x], 0);
      const prev = at(ra, i - 1), next = at(ra, i + L);
      const removeGain = d[prev][first] + d[last][next] - d[prev][next];
      for (let b = 0; b < R.length; b++) {
        if (b !== a && load[b] + q > inst.cap + 1e-9) continue;
        const base = b === a ? [...ra.slice(0, i), ...ra.slice(i + L)] : R[b];
        for (let p = 0; p <= base.length; p++) {
          if (b === a && p === i) continue;
          const x = at(base, p - 1), y = at(base, p);
          for (const rev of L > 1 ? [false, true] : [false]) {
            const s0 = rev ? last : first, s1 = rev ? first : last;
            const gain = removeGain - (d[x][s0] + d[s1][y] - d[x][y]);
            if (gain > 1e-9) {
              const piece = rev ? seg.slice().reverse() : seg, nb = [...base.slice(0, p), ...piece, ...base.slice(p)];
              if (b === a) R[a] = nb; else { R[a] = [...ra.slice(0, i), ...ra.slice(i + L)]; R[b] = nb; load[a] -= q; load[b] += q; }
              improved = true; break outer;
            }
          }
        }
      }
    }
  }
  return R.filter((r) => r.length);
}

/** Savings, then 2-opt and or-opt until nothing improves, then exact order for routes of up to 12 stops. */
export function heuristic(inst: Instance) {
  validate(inst);
  const cw = savings(inst);
  let routes = cw.map((r) => twoOpt(inst.d, r));
  for (let round = 0; round < 20; round++) {
    const before = summarise(inst, routes).length;
    routes = orOpt(inst, routes).map((r) => twoOpt(inst.d, r));
    if (summarise(inst, routes).length > before - 1e-9) break;
  }
  routes = routes.map((r) => (r.length <= EXACT_MAX ? heldKarp(inst.d, r).order : r));
  return { savings: summarise(inst, cw), improved: summarise(inst, routes) };
}

/**
 * Exact capacitated routing for up to 12 customers: the shortest closed tour of every set of customers that fits a
 * vehicle (one Held-Karp table from the depot), then the cheapest split of all customers into at most `vehicles` such
 * sets (dynamic programming over subsets). Returns null if no split uses few enough vehicles.
 */
export function exact(inst: Instance): Solution | null {
  validate(inst);
  const n = inst.d.length - 1;
  if (n > EXACT_MAX) throw new Error(`The exact method is for up to ${EXACT_MAX} customers.`);
  const d = inst.d, full = 1 << n, K = Math.max(1, Math.min(inst.vehicles || n, n));
  // dp[m][a]: shortest path from the depot through set m ending at customer a (1-based a+1).
  const dp = new Float64Array(full * n).fill(Infinity), par = new Int8Array(full * n).fill(-1);
  for (let a = 0; a < n; a++) dp[(1 << a) * n + a] = d[0][a + 1];
  const dem = new Float64Array(full);
  for (let m = 1; m < full; m++) { const low = m & -m, a = 31 - Math.clz32(low); dem[m] = dem[m ^ low] + inst.demand[a + 1]; }
  for (let m = 1; m < full; m++) {
    if (dem[m] > inst.cap + 1e-9) continue;
    for (let a = 0; a < n; a++) {
      const cur = dp[m * n + a]; if (!(m & (1 << a)) || cur === Infinity) continue;
      for (let b = 0; b < n; b++) {
        if (m & (1 << b)) continue;
        const nm = m | (1 << b); if (dem[nm] > inst.cap + 1e-9) continue;
        const v = cur + d[a + 1][b + 1];
        if (v < dp[nm * n + b] - 1e-12) { dp[nm * n + b] = v; par[nm * n + b] = a; }
      }
    }
  }
  const tour = new Float64Array(full).fill(Infinity), tourEnd = new Int8Array(full).fill(-1);
  for (let m = 1; m < full; m++) for (let a = 0; a < n; a++) { const v = dp[m * n + a] + d[a + 1][0]; if (v < tour[m] - 1e-12) { tour[m] = v; tourEnd[m] = a; } }
  // f[k][m]: cheapest cover of set m with k routes. Each step takes a route containing the lowest customer left.
  let prev = new Float64Array(full).fill(Infinity); prev[0] = 0;
  const choice: Int32Array[] = [];
  let best = Infinity, bestK = -1;
  const layers: Float64Array[] = [prev];
  for (let k = 1; k <= K; k++) {
    const cur = new Float64Array(full).fill(Infinity), ch = new Int32Array(full).fill(-1);
    for (let m = 1; m < full; m++) {
      const low = m & -m, rest = m ^ low;
      // Subsets s of m that contain the lowest bit.
      for (let t = rest; ; t = (t - 1) & rest) {
        const s = t | low, v = prev[m ^ s] + tour[s];
        if (v < cur[m] - 1e-12) { cur[m] = v; ch[m] = s; }
        if (t === 0) break;
      }
    }
    choice.push(ch); layers.push(cur); prev = cur;
    if (cur[full - 1] < best - 1e-12) { best = cur[full - 1]; bestK = k; }
  }
  if (bestK < 0) return null;
  const routes: number[][] = [];
  let m = full - 1;
  for (let k = bestK; k >= 1; k--) {
    const s = choice[k - 1][m];
    const order: number[] = []; let mm = s, a = tourEnd[s];
    while (a >= 0) { order.push(a + 1); const p = par[mm * n + a]; mm ^= 1 << a; a = p; }
    routes.push(order.reverse()); m ^= s;
  }
  return summarise(inst, routes);
}

/** A rough 2-D picture of points from a distance table (classical multidimensional scaling, top two axes). */
export function mds(d: number[][]): [number, number][] {
  const n = d.length;
  if (n === 1) return [[0, 0]];
  const D2 = d.map((r) => r.map((v) => v * v)), rm = D2.map((r) => r.reduce((a, b) => a + b, 0) / n), all = rm.reduce((a, b) => a + b, 0) / n;
  const B = D2.map((r, i) => r.map((v, j) => -0.5 * (v - rm[i] - rm[j] + all)));
  const vecs: number[][] = [], vals: number[] = [];
  for (let k = 0; k < 2; k++) {
    let v = Array.from({ length: n }, (_, i) => Math.sin(i * 1.7 + k * 0.9 + 0.3)), lam = 0;
    for (let it = 0; it < 500; it++) {
      let w = B.map((r) => r.reduce((s, x, j) => s + x * v[j], 0));
      for (let p = 0; p < vecs.length; p++) { const dot = w.reduce((s, x, j) => s + x * vecs[p][j], 0); w = w.map((x, j) => x - dot * vecs[p][j]); }
      const nrm = Math.hypot(...w) || 1; lam = nrm; v = w.map((x) => x / nrm);
    }
    vecs.push(v); vals.push(lam);
  }
  return Array.from({ length: n }, (_, i) => [vecs[0][i] * Math.sqrt(Math.max(0, vals[0])), vecs[1][i] * Math.sqrt(Math.max(0, vals[1]))]);
}

/** Made-up example: a depot and 10 shops on a 100 × 100 km map, with crates to deliver. */
export const EXAMPLE = `name,x,y,demand
Depot,50,50,0
Shop 1,20,80,4
Shop 2,35,90,3
Shop 3,70,85,5
Shop 4,85,70,2
Shop 5,90,40,6
Shop 6,75,15,3
Shop 7,45,10,4
Shop 8,15,25,5
Shop 9,10,55,2
Shop 10,60,65,3`;
