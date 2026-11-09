// Pipe flow and pipe networks: Darcy-Weisbach head loss with the Colebrook-White or Swamee-Jain friction
// factor plus minor losses (sum of K), for a single pipe or a looped network with reservoirs and demands,
// solved by Newton's method on the node heads (the global gradient method) or by Hardy Cross loop corrections.
// SI units throughout: m, m³/s, Pa, kg/m³, Pa·s.

export const G = 9.80665;
export type FMethod = 'colebrook' | 'swamee';

/** Colebrook-White friction factor, solved by fixed-point iteration on 1/√f. */
export function colebrook(Re: number, rr: number): number {
  let x = -2 * Math.log10(rr / 3.7 + 5.74 / Math.pow(Re, 0.9)); // Swamee-Jain start, x = 1/√f
  for (let i = 0; i < 100; i++) {
    const nx = -2 * Math.log10(rr / 3.7 + 2.51 * x / Re);
    if (Math.abs(nx - x) < 1e-13 * Math.abs(x)) { x = nx; break; }
    x = nx;
  }
  return 1 / (x * x);
}
/** Swamee-Jain explicit approximation of Colebrook. */
export function swameeJain(Re: number, rr: number): number {
  const t = Math.log10(rr / 3.7 + 5.74 / Math.pow(Re, 0.9));
  return 0.25 / (t * t);
}
/** Darcy friction factor for any Reynolds number: 64/Re below 2000, the turbulent formula above 4000,
 *  and a straight-line blend between the two in the transition zone (so the solver never jumps). */
export function friction(Re: number, rr: number, m: FMethod = 'colebrook'): number {
  if (!(Re > 0)) return 0;
  if (Re <= 2000) return 64 / Re;
  const turb = (r: number) => (m === 'swamee' ? swameeJain(r, rr) : colebrook(r, rr));
  if (Re >= 4000) return turb(Re);
  const t = (Re - 2000) / 2000;
  return (1 - t) * (64 / 2000) + t * turb(4000);
}
export function regime(Re: number): string { return Re <= 2000 ? 'laminar' : Re < 4000 ? 'transitional' : 'turbulent'; }

export type Fluid = { rho: number; mu: number };
export type Pipe = { name: string; from: string; to: string; L: number; D: number; eps: number; K: number };

/** Everything about the flow Q (m³/s, either sign) in one pipe. Head loss carries the sign of Q. */
export function pipeFlow(p: { L: number; D: number; eps: number; K: number }, Q: number, fl: Fluid, m: FMethod = 'colebrook') {
  const A = Math.PI * p.D * p.D / 4, V = Q / A, aV = Math.abs(V);
  const Re = fl.rho * aV * p.D / fl.mu, f = friction(Re, p.eps / p.D, m);
  const vh = V * aV / (2 * G); // signed velocity head
  const hMajor = Re > 0 ? f * p.L / p.D * vh : 0, hMinor = p.K * vh;
  return { A, V, Re, f, hMajor, hMinor, h: hMajor + hMinor, regime: regime(Re) };
}
const headLoss = (p: Pipe, Q: number, fl: Fluid, m: FMethod) => pipeFlow(p, Q, fl, m).h;
/** dh/dQ by a central difference (smooth thanks to the transition blend), never zero. */
function slope(p: Pipe, Q: number, fl: Fluid, m: FMethod) {
  const d = Math.max(1e-9, Math.abs(Q) * 1e-6);
  const g = (headLoss(p, Q + d, fl, m) - headLoss(p, Q - d, fl, m)) / (2 * d);
  return Math.max(g, 1e-9);
}

/** Flow for a given head loss in one pipe (bisection on a monotone function). */
export function flowForHead(p: Pipe | Omit<Pipe, 'name' | 'from' | 'to'>, h: number, fl: Fluid, m: FMethod = 'colebrook'): number {
  const pp = p as Pipe, s = Math.sign(h), H = Math.abs(h);
  if (H === 0) return 0;
  let lo = 0, hi = 1e-6;
  while (headLoss(pp, hi, fl, m) < H) { hi *= 2; if (hi > 1e9) return NaN; }
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (headLoss(pp, mid, fl, m) < H) lo = mid; else hi = mid; if (hi - lo < 1e-15 * hi) break; }
  return s * (lo + hi) / 2;
}

export type Node = { name: string; z: number; demand: number; head?: number; x?: number; y?: number };
export type NetResult = {
  Q: number[]; H: Record<string, number>; iterations: number; converged: boolean;
  pipes: ReturnType<typeof pipeFlow>[]; supply: Record<string, number>; maxImbalance: number; loops: number;
};

/** Check the network: names, links, at least one reservoir, everything connected to one. Returns an error or ''. */
export function checkNetwork(nodes: Node[], pipes: Pipe[]): string {
  const names = new Set<string>();
  for (const n of nodes) { if (names.has(n.name)) return `Node ${n.name} is listed twice.`; names.add(n.name); }
  if (!nodes.some((n) => n.head !== undefined)) return 'Give at least one reservoir or tank: a node with a fixed head.';
  const pn = new Set<string>();
  for (const p of pipes) {
    if (pn.has(p.name)) return `Pipe ${p.name} is listed twice.`; pn.add(p.name);
    if (!names.has(p.from) || !names.has(p.to)) return `Pipe ${p.name} joins a node that is not in the node list (${!names.has(p.from) ? p.from : p.to}).`;
    if (p.from === p.to) return `Pipe ${p.name} starts and ends at the same node.`;
  }
  const adj = new Map<string, string[]>(nodes.map((n) => [n.name, []]));
  for (const p of pipes) { adj.get(p.from)!.push(p.to); adj.get(p.to)!.push(p.from); }
  const seen = new Set<string>(), st = nodes.filter((n) => n.head !== undefined).map((n) => n.name);
  st.forEach((s) => seen.add(s));
  while (st.length) { const a = st.pop()!; for (const b of adj.get(a)!) if (!seen.has(b)) { seen.add(b); st.push(b); } }
  const lost = nodes.find((n) => !seen.has(n.name));
  if (lost) return `Node ${lost.name} is not connected to any reservoir.`;
  return '';
}

/** Solve a small dense linear system (Gaussian elimination with partial pivoting). */
export function solveLinear(A: number[][], b: number[]): number[] {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    if (Math.abs(M[c][c]) < 1e-300) throw new Error('singular');
    for (let r = c + 1; r < n; r++) { const k = M[r][c] / M[c][c]; if (k) for (let j = c; j <= n; j++) M[r][j] -= k * M[c][j]; }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let j = r + 1; j < n; j++) s -= M[r][j] * x[j]; x[r] = s / M[r][r]; }
  return x;
}

function finish(nodes: Node[], pipes: Pipe[], Q: number[], H: Record<string, number>, fl: Fluid, m: FMethod, iterations: number, converged: boolean, loops: number): NetResult {
  const net = new Map<string, number>(nodes.map((n) => [n.name, 0]));
  pipes.forEach((p, i) => { net.set(p.to, net.get(p.to)! + Q[i]); net.set(p.from, net.get(p.from)! - Q[i]); });
  const supply: Record<string, number> = {};
  let maxImbalance = 0;
  for (const n of nodes) {
    if (n.head !== undefined) supply[n.name] = -net.get(n.name)! + n.demand; // outflow from the reservoir into the pipes
    else maxImbalance = Math.max(maxImbalance, Math.abs(net.get(n.name)! - n.demand));
  }
  return { Q, H, iterations, converged, pipes: pipes.map((p, i) => pipeFlow(p, Q[i], fl, m)), supply, maxImbalance, loops };
}

/** Newton's method on the junction heads (Todini and Pilati's global gradient algorithm). */
export function solveNewton(nodes: Node[], pipes: Pipe[], fl: Fluid, m: FMethod = 'colebrook', tol = 1e-10, maxIt = 200): NetResult {
  const junc = nodes.filter((n) => n.head === undefined), idx = new Map(junc.map((n, i) => [n.name, i]));
  const fixed = new Map(nodes.filter((n) => n.head !== undefined).map((n) => [n.name, n.head!]));
  let Q = pipes.map((p) => 0.1 * Math.PI * p.D * p.D / 4); // start at 0.1 m/s
  let H: number[] = junc.map(() => 0), it = 0, ok = false;
  for (it = 1; it <= maxIt; it++) {
    const g = pipes.map((p, i) => slope(p, Q[i], fl, m)), h = pipes.map((p, i) => headLoss(p, Q[i], fl, m));
    const nJ = junc.length, A = Array.from({ length: nJ }, () => new Array(nJ).fill(0)), b = junc.map((n) => n.demand);
    pipes.forEach((p, i) => {
      // Q'_i = Q_i + (H_from - H_to - h_i)/g_i ; continuity: inflow - outflow = demand.
      const w = 1 / g[i], c = Q[i] - h[i] / g[i];
      const a = idx.get(p.from), z = idx.get(p.to);
      for (const [node, s] of [[a, -1], [z, 1]] as [number | undefined, number][]) {
        if (node === undefined) continue;
        b[node] -= s * c;
        // s * w * (H_from - H_to)
        if (a !== undefined) A[node][a] += s * w; else b[node] -= s * w * fixed.get(p.from)!;
        if (z !== undefined) A[node][z] -= s * w; else b[node] += s * w * fixed.get(p.to)!;
      }
    });
    H = nJ ? solveLinear(A, b) : [];
    const head = (nm: string) => (idx.has(nm) ? H[idx.get(nm)!] : fixed.get(nm)!);
    let dmax = 0, qmax = 1e-12;
    const nQ = pipes.map((p, i) => { const q = Q[i] + (head(p.from) - head(p.to) - h[i]) / g[i]; dmax = Math.max(dmax, Math.abs(q - Q[i])); qmax = Math.max(qmax, Math.abs(q)); return q; });
    Q = nQ;
    if (dmax <= tol * Math.max(1, qmax) && it > 1) { ok = true; break; }
  }
  const Hm: Record<string, number> = {};
  nodes.forEach((n) => { Hm[n.name] = n.head !== undefined ? n.head : H[idx.get(n.name)!]; });
  // Loops: pipes - junctions (independent loops plus paths between reservoirs).
  return finish(nodes, pipes, Q, Hm, fl, m, Math.min(it, maxIt), ok, pipes.length - junc.length);
}

/** Hardy Cross: start with flows that meet continuity on a spanning tree, then correct each loop
 *  (and each path between two reservoirs) in turn until the head losses balance. */
export function solveHardyCross(nodes: Node[], pipes: Pipe[], fl: Fluid, m: FMethod = 'colebrook', tol = 1e-10, maxIt = 2000): NetResult {
  // A virtual source S joins every reservoir by a link whose "head loss" S→r is −H_r (fixed).
  const res = nodes.filter((n) => n.head !== undefined);
  type Edge = { from: string; to: string; pipe: number; H?: number };
  const edges: Edge[] = [...pipes.map((p, i) => ({ from: p.from, to: p.to, pipe: i })), ...res.map((r) => ({ from: '\u0000S', to: r.name, pipe: -1, H: r.head! }))];
  const adj = new Map<string, number[]>([['\u0000S', []], ...nodes.map((n) => [n.name, []] as [string, number[]])]);
  edges.forEach((e, k) => { adj.get(e.from)!.push(k); adj.get(e.to)!.push(k); });
  // BFS spanning tree from S.
  const parent = new Map<string, number>(), depth = new Map<string, number>([['\u0000S', 0]]), order: string[] = ['\u0000S'];
  for (let i = 0; i < order.length; i++) {
    const a = order[i];
    for (const k of adj.get(a)!) { const e = edges[k], b = e.from === a ? e.to : e.from; if (!depth.has(b)) { depth.set(b, depth.get(a)! + 1); parent.set(b, k); order.push(b); } }
  }
  const inTree = new Set(parent.values());
  const chords = edges.map((_, k) => k).filter((k) => !inTree.has(k));
  // Loop for each chord: the chord plus the tree path between its ends; sign +1 when the edge points along the loop.
  const loops = chords.map((k) => {
    const e = edges[k], path: [number, number][] = [[k, 1]];
    let a = e.to, b = e.from; const up: [number, number][] = [], down: [number, number][] = [];
    // walk loop direction: chord from→to, then tree path to→...→from
    while (a !== b) {
      if (depth.get(a)! >= depth.get(b)!) { const pk = parent.get(a)!, pe = edges[pk], next = pe.from === a ? pe.to : pe.from; up.push([pk, pe.from === a ? 1 : -1]); a = next; }
      else { const pk = parent.get(b)!, pe = edges[pk], next = pe.from === b ? pe.to : pe.from; down.push([pk, pe.to === b ? 1 : -1]); b = next; }
    }
    return [...path, ...up, ...down.reverse()];
  });
  // Initial flows: chords carry a small flow, tree edges carry what continuity needs.
  const Q = edges.map((e) => (e.pipe >= 0 ? 0.1 * Math.PI * pipes[e.pipe].D ** 2 / 4 : 0));
  inTree.forEach((k) => { Q[k] = 0; });
  const need = new Map<string, number>(nodes.map((n) => [n.name, n.demand]));
  chords.forEach((k) => { const e = edges[k]; need.set(e.to, (need.get(e.to) ?? 0) - Q[k]); need.set(e.from, (need.get(e.from) ?? 0) + Q[k]); });
  for (let i = order.length - 1; i > 0; i--) {
    const nm = order[i], k = parent.get(nm)!, e = edges[k], par = e.from === nm ? e.to : e.from, d = need.get(nm)!;
    Q[k] = e.to === nm ? d : -d; // flow into nm along the tree edge
    if (par !== '\u0000S') need.set(par, need.get(par)! + d);
  }
  const hOf = (k: number, q: number) => (edges[k].pipe >= 0 ? headLoss(pipes[edges[k].pipe], q, fl, m) : -edges[k].H!);
  const gOf = (k: number, q: number) => (edges[k].pipe >= 0 ? slope(pipes[edges[k].pipe], q, fl, m) : 0);
  let it = 0, ok = !loops.length;
  if (loops.length) for (it = 1; it <= maxIt; it++) {
    let dmax = 0, qmax = 1e-12;
    for (const L of loops) {
      let sh = 0, sg = 0;
      for (const [k, s] of L) { sh += s * hOf(k, Q[k]); sg += gOf(k, Q[k]); }
      const dQ = -sh / sg;
      for (const [k, s] of L) Q[k] += s * dQ;
      dmax = Math.max(dmax, Math.abs(dQ));
    }
    Q.forEach((q) => { qmax = Math.max(qmax, Math.abs(q)); });
    if (dmax <= tol * Math.max(1, qmax)) { ok = true; break; }
  }
  // Heads: walk the tree from the reservoirs.
  const H: Record<string, number> = {};
  for (const nm of order.slice(1)) {
    const k = parent.get(nm)!, e = edges[k];
    if (e.pipe < 0) { H[nm] = e.H!; continue; }
    const h = hOf(k, Q[k]);
    H[nm] = e.to === nm ? H[e.from] - h : H[e.to] + h;
  }
  const PQ = pipes.map((_, i) => Q[i]);
  return finish(nodes, pipes, PQ, H, fl, m, Math.min(it, maxIt), ok, loops.length);
}

/** Water density (kg/m³) and dynamic viscosity (Pa·s) at t °C (0 to 100), from smooth fits good to
 *  about 0.1 % (density) and 1 % (viscosity); for other liquids type your own values. */
export function water(tC: number): Fluid {
  const rho = 1000 * (1 - ((tC + 288.9414) / (508929.2 * (tC + 68.12963))) * (tC - 3.9863) ** 2);
  const mu = 2.414e-5 * Math.pow(10, 247.8 / (tC + 273.15 - 140));
  return { rho, mu };
}
