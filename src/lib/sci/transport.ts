// Transportation and assignment problems for #583: starting solutions (northwest corner, least cost, Vogel's
// approximation), the MODI (u-v) method with stepping-stone loops to the optimum, and the Hungarian method for
// assignment (minimise or maximise, rectangular allowed). Plain TypeScript, no DOM. Checked against scipy linprog and
// linear_sum_assignment in tests/sci-tools/transportation-assignment.mjs.

export type Cell = [number, number];
export type Plan = { x: number[][]; basis: Cell[]; cost: number };
export type Step = { enter: Cell; delta: number; loop: Cell[]; theta: number; leave: Cell; cost: number };
export type Balanced = { cost: number[][]; supply: number[]; demand: number[]; dummy: 'none' | 'source' | 'destination'; forbidden: boolean[][] };

const EPS = 1e-9;

/**
 * Balance a problem: if total supply and demand differ, add a dummy source or destination with zero cost for the
 * difference. Forbidden routes (null) get a cost far above the rest, so the optimum avoids them when it can.
 * For maximising, costs are profits and are turned into losses (largest − profit) so the same minimising steps apply.
 */
export function balance(cost: (number | null)[][], supply: number[], demand: number[], maximise = false): Balanced {
  if (!cost.length || !cost[0].length) throw new Error('Give at least one source and one destination.');
  if (cost.some((r) => r.length !== demand.length) || cost.length !== supply.length) throw new Error('The table needs one supply per row and one demand per column.');
  if ([...supply, ...demand].some((v) => !(v >= 0) || !Number.isFinite(v))) throw new Error('Supplies and demands must be numbers of 0 or more.');
  const vals = cost.flat().filter((v): v is number => v !== null);
  if (!vals.length) throw new Error('Every route is forbidden.');
  const top = Math.max(...vals), span = Math.max(1, top - Math.min(...vals), Math.abs(top));
  const big = (maximise ? 0 : top) + 1000 * span;
  const forbidden = cost.map((r) => r.map((v) => v === null));
  let c = cost.map((r) => r.map((v) => (v === null ? big : maximise ? top - v : v)));
  const S = supply.reduce((a, b) => a + b, 0), D = demand.reduce((a, b) => a + b, 0);
  let sup = supply.slice(), dem = demand.slice(), dummy: Balanced['dummy'] = 'none';
  if (Math.abs(S - D) > EPS * Math.max(1, S, D)) {
    if (S > D) { c = c.map((r) => [...r, 0]); dem = [...dem, S - D]; dummy = 'destination'; forbidden.forEach((r) => r.push(false)); }
    else { c = [...c, new Array(dem.length).fill(0)]; sup = [...sup, D - S]; dummy = 'source'; forbidden.push(new Array(dem.length).fill(false)); }
  }
  return { cost: c, supply: sup, demand: dem, dummy, forbidden };
}

const total = (c: number[][], x: number[][]) => x.reduce((s, r, i) => s + r.reduce((t, v, j) => t + v * c[i][j], 0), 0);

/** Add zero-amount basic cells (cheapest first) until the basis has m + n − 1 cells and joins every row and column. */
function completeBasis(c: number[][], basis: Cell[]): Cell[] {
  const m = c.length, n = c[0].length, par = Array.from({ length: m + n }, (_, i) => i);
  const find = (a: number): number => { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; };
  const out = basis.slice();
  for (const [i, j] of basis) par[find(i)] = find(m + j);
  if (out.length === m + n - 1) return out;
  const cand: Cell[] = [];
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) cand.push([i, j]);
  cand.sort((a, b) => c[a[0]][a[1]] - c[b[0]][b[1]] || a[0] - b[0] || a[1] - b[1]);
  for (const [i, j] of cand) {
    if (out.length >= m + n - 1) break;
    const a = find(i), b = find(m + j);
    if (a !== b) { par[a] = b; out.push([i, j]); }
  }
  return out;
}

/** Northwest corner rule. Ties (row and column used up together) step down a row, keeping a zero basic cell. */
export function northwest(p: Balanced): Plan {
  const m = p.supply.length, n = p.demand.length, s = p.supply.slice(), d = p.demand.slice();
  const x = Array.from({ length: m }, () => new Array(n).fill(0)), basis: Cell[] = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    const q = Math.min(s[i], d[j]); x[i][j] = q; s[i] -= q; d[j] -= q; basis.push([i, j]);
    if (i === m - 1 && j === n - 1) break;
    if (s[i] <= EPS && i < m - 1) i++; else j++;
  }
  return { x, basis: completeBasis(p.cost, basis), cost: total(p.cost, x) };
}

/** Least-cost method: fill the cheapest remaining route first (ties: top-left first). */
export function leastCost(p: Balanced): Plan {
  const m = p.supply.length, n = p.demand.length, s = p.supply.slice(), d = p.demand.slice();
  const x = Array.from({ length: m }, () => new Array(n).fill(0)), basis: Cell[] = [], rowDone = new Array(m).fill(false), colDone = new Array(n).fill(false);
  const cells: Cell[] = []; for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) cells.push([i, j]);
  cells.sort((a, b) => p.cost[a[0]][a[1]] - p.cost[b[0]][b[1]] || a[0] - b[0] || a[1] - b[1]);
  for (const [i, j] of cells) {
    if (rowDone[i] || colDone[j]) continue;
    if (s.reduce((a, b) => a + b, 0) <= EPS * Math.max(1, ...p.supply)) break;
    const q = Math.min(s[i], d[j]); x[i][j] = q; s[i] -= q; d[j] -= q; basis.push([i, j]);
    // Close one line only (the row if it is used up and another row is open, else the column), so the basis stays a tree.
    if (s[i] <= EPS && rowDone.filter((r) => !r).length > 1) rowDone[i] = true; else colDone[j] = true;
  }
  return { x, basis: completeBasis(p.cost, basis), cost: total(p.cost, x) };
}

/**
 * Vogel's approximation method: for each open row and column, the penalty is the gap between its two cheapest open
 * routes; fill the cheapest route of the line with the largest penalty (ties: the line with the cheaper route, then
 * rows before columns, then the first).
 */
export function vogel(p: Balanced): Plan {
  const m = p.supply.length, n = p.demand.length, s = p.supply.slice(), d = p.demand.slice(), c = p.cost;
  const x = Array.from({ length: m }, () => new Array(n).fill(0)), basis: Cell[] = [], rowOpen = new Array(m).fill(true), colOpen = new Array(n).fill(true);
  const pen = (vals: number[]) => { const v = vals.slice().sort((a, b) => a - b); return v.length > 1 ? v[1] - v[0] : v[0]; };
  const left = () => s.reduce((a, b) => a + b, 0);
  for (let guard = 0; guard < m + n + 2 && left() > EPS * Math.max(1, ...p.supply); guard++) {
    let best: { pen: number; cost: number; cell: Cell } | null = null;
    const consider = (pv: number, cell: Cell) => {
      const cc = c[cell[0]][cell[1]];
      if (!best || pv > best.pen + EPS || (Math.abs(pv - best.pen) <= EPS && cc < best.cost - EPS)) best = { pen: pv, cost: cc, cell };
    };
    const openCols = [...Array(n).keys()].filter((j) => colOpen[j]), openRows = [...Array(m).keys()].filter((i) => rowOpen[i]);
    if (!openCols.length || !openRows.length) break;
    for (const i of openRows) { const jmin = openCols.reduce((a, b) => (c[i][b] < c[i][a] ? b : a)); consider(pen(openCols.map((j) => c[i][j])), [i, jmin]); }
    for (const j of openCols) { const imin = openRows.reduce((a, b) => (c[b][j] < c[a][j] ? b : a)); consider(pen(openRows.map((i) => c[i][j])), [imin, j]); }
    const [i, j] = (best as unknown as { cell: Cell }).cell, q = Math.min(s[i], d[j]);
    x[i][j] = q; s[i] -= q; d[j] -= q; basis.push([i, j]);
    // Close one line only: the row if it is used up (unless it is the last open row), else the column.
    if (s[i] <= EPS && openRows.length > 1) rowOpen[i] = false; else colOpen[j] = false;
  }
  // Keep only cells that do not close a loop (the zero cells added at the end may), then complete the basis.
  const m2 = m + n, par = Array.from({ length: m2 }, (_, k) => k), find = (a: number): number => { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; };
  const tree: Cell[] = [];
  for (const [i, j] of basis) { const a = find(i), b = find(m + j); if (a !== b || x[i][j] > EPS) { if (a !== b) par[a] = b; tree.push([i, j]); } }
  return { x, basis: completeBasis(c, tree), cost: total(c, x) };
}

/** Row potentials u and column potentials v with u[0] = 0 and c = u + v on every basic cell. */
export function potentials(c: number[][], basis: Cell[]) {
  const m = c.length, n = c[0].length, u = new Array(m).fill(NaN), v = new Array(n).fill(NaN);
  u[0] = 0;
  for (let changed = true; changed;) {
    changed = false;
    for (const [i, j] of basis) {
      if (!Number.isNaN(u[i]) && Number.isNaN(v[j])) { v[j] = c[i][j] - u[i]; changed = true; }
      else if (Number.isNaN(u[i]) && !Number.isNaN(v[j])) { u[i] = c[i][j] - v[j]; changed = true; }
    }
  }
  return { u, v };
}

/** The stepping-stone loop: the entering cell, then basic cells alternating −, +, −, ... (the path through the basis tree). */
function loopFor(m: number, n: number, basis: Cell[], enter: Cell): Cell[] {
  // Nodes 0..m-1 are rows, m..m+n-1 columns; each basic cell is an edge. Find the tree path from column enter[1] to row enter[0].
  const adj: [number, number][][] = Array.from({ length: m + n }, () => []);
  basis.forEach(([i, j], k) => { adj[i].push([m + j, k]); adj[m + j].push([i, k]); });
  const start = m + enter[1], goal = enter[0], prev = new Array(m + n).fill(-1), via = new Array(m + n).fill(-1);
  prev[start] = start; const q = [start];
  for (let a = 0; a < q.length; a++) for (const [b, k] of adj[q[a]]) if (prev[b] < 0) { prev[b] = q[a]; via[b] = k; q.push(b); }
  const path: Cell[] = [];
  for (let b = goal; b !== start; b = prev[b]) path.push(basis[via[b]]);
  // path runs from the entering row back to the entering column: first cell shares the entering row (gets −).
  return [enter, ...path];
}

/** MODI (u-v) method from a starting plan: improve until no route would lower the cost. */
export function modi(p: Balanced, start: Plan, maxSteps = 500) {
  const m = p.supply.length, n = p.demand.length, c = p.cost;
  const x = start.x.map((r) => r.slice());
  let basis = start.basis.slice();
  const steps: Step[] = [];
  for (let it = 0; it < maxSteps; it++) {
    const { u, v } = potentials(c, basis);
    const isBasic = (i: number, j: number) => basis.some(([a, b]) => a === i && b === j);
    let enter: Cell | null = null, best = -1e-9 * Math.max(1, ...c.flat().map(Math.abs));
    for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (!isBasic(i, j)) { const dlt = c[i][j] - u[i] - v[j]; if (dlt < best) { best = dlt; enter = [i, j]; } }
    if (!enter) return { x, basis, cost: total(c, x), steps, u, v, optimal: true };
    const loop = loopFor(m, n, basis, enter);
    let theta = Infinity, leaveK = -1;
    for (let k = 1; k < loop.length; k += 2) { const [i, j] = loop[k]; if (x[i][j] < theta - EPS) { theta = x[i][j]; leaveK = k; } }
    loop.forEach(([i, j], k) => { x[i][j] += k % 2 ? -theta : theta; if (Math.abs(x[i][j]) < EPS) x[i][j] = 0; });
    const leave = loop[leaveK];
    basis = basis.filter(([a, b]) => !(a === leave[0] && b === leave[1])); basis.push(enter);
    steps.push({ enter, delta: best, loop, theta, leave, cost: total(c, x) });
  }
  const { u, v } = potentials(c, basis);
  return { x, basis, cost: total(c, x), steps, u, v, optimal: false };
}

/** Solve a transportation problem from a starting method to the optimum. Costs are in the user's terms (profit when maximising). */
export function solveTransport(cost: (number | null)[][], supply: number[], demand: number[], method: 'nw' | 'least' | 'vogel' = 'vogel', maximise = false) {
  const p = balance(cost, supply, demand, maximise);
  const start = method === 'nw' ? northwest(p) : method === 'least' ? leastCost(p) : vogel(p);
  const end = modi(p, start);
  // Value in the user's own costs (dummy routes cost nothing).
  const userValue = (x: number[][]) => x.reduce((s, r, i) => s + r.reduce((t, q, j) => t + (i < cost.length && j < cost[0].length && cost[i][j] !== null ? q * (cost[i][j] as number) : 0), 0), 0);
  const usesForbidden = end.x.some((r, i) => r.some((q, j) => q > EPS && p.forbidden[i][j]));
  // Other optima: a non-basic route with zero reduced cost.
  const isBasic = (i: number, j: number) => end.basis.some(([a, b]) => a === i && b === j);
  let ties = false;
  for (let i = 0; i < p.cost.length; i++) for (let j = 0; j < p.cost[0].length; j++) if (!isBasic(i, j) && Math.abs(p.cost[i][j] - end.u[i] - end.v[j]) < 1e-9 * Math.max(1, Math.abs(p.cost[i][j]))) ties = true;
  return { problem: p, start, startValue: userValue(start.x), end, value: userValue(end.x), usesForbidden, ties };
}

/**
 * Hungarian method (Kuhn-Munkres with potentials, O(n²m)) for an n × m cost matrix. Each row gets its own column
 * (or each column its own row when there are fewer columns). null = not allowed. maximise = largest total.
 * Returns the column for each row (−1 if the row is left without one) and the total.
 */
export function hungarian(cost: (number | null)[][], maximise = false) {
  const r0 = cost.length, c0 = r0 ? cost[0].length : 0;
  if (!r0 || !c0) throw new Error('Give a table with at least one row and one column.');
  if (cost.some((r) => r.length !== c0)) throw new Error('Every row needs the same number of values.');
  const vals = cost.flat().filter((v): v is number => v !== null);
  if (!vals.length) throw new Error('Every pairing is forbidden.');
  const top = Math.max(...vals), span = Math.max(1, top - Math.min(...vals), Math.abs(top)), big = 1e4 * span * Math.max(r0, c0);
  const conv = (v: number | null) => (v === null ? big : maximise ? top - v : v);
  // Work with rows ≤ columns (transpose if needed), as the potentials algorithm requires.
  const T = r0 > c0, n = T ? c0 : r0, m = T ? r0 : c0;
  const a = (i: number, j: number) => (T ? conv(cost[j - 1][i - 1]) : conv(cost[i - 1][j - 1]));
  const u = new Array(n + 1).fill(0), v = new Array(m + 1).fill(0), p = new Array(m + 1).fill(0), way = new Array(m + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    p[0] = i; let j0 = 0; const minv = new Array(m + 1).fill(Infinity), used = new Array(m + 1).fill(false);
    do {
      used[j0] = true; const i0 = p[j0]; let delta = Infinity, j1 = 0;
      for (let j = 1; j <= m; j++) if (!used[j]) {
        const cur = a(i0, j) - u[i0] - v[j];
        if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
        if (minv[j] < delta) { delta = minv[j]; j1 = j; }
      }
      for (let j = 0; j <= m; j++) if (used[j]) { u[p[j]] += delta; v[j] -= delta; } else minv[j] -= delta;
      j0 = j1;
    } while (p[j0] !== 0);
    do { const j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0);
  }
  const rowTo = new Array(r0).fill(-1);
  for (let j = 1; j <= m; j++) if (p[j]) { if (T) rowTo[j - 1] = p[j] - 1; else rowTo[p[j] - 1] = j - 1; }
  let total = 0, forbidden = false;
  rowTo.forEach((j, i) => { if (j < 0) return; const c = cost[i][j]; if (c === null) forbidden = true; else total += c; });
  return { rowTo, total, forbidden };
}

/** Read a cost cell: a number, or x / - / M / blank for a route that is not allowed. */
export function readCost(s: string): number | null | undefined {
  const t = s.trim().replace(/[−–]/g, '-');
  if (/^(x|-|—|m|big\s*m|n\/?a|∞|inf)$/i.test(t)) return null;
  if (/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)) return Number(t);
  return undefined;
}

/** Made-up example: three factories, four warehouses, cost per unit shipped (supply in the last column, demand in the last row). */
export const EXAMPLE_TRANSPORT = `\tW1\tW2\tW3\tW4\tSupply
F1\t12\t18\t25\t9\t40
F2\t22\t14\t16\t28\t55
F3\t15\t27\t11\t19\t45
Demand\t30\t35\t40\t35\t`;
/** Made-up example: four people, four jobs, minutes each takes. */
export const EXAMPLE_ASSIGN = `\tJob 1\tJob 2\tJob 3\tJob 4
Asha\t14\t22\t9\t17
Ben\t18\t11\t20\t15
Chen\t10\t16\t13\t21
Dara\t19\t12\t17\t8`;
