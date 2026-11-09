// Plane trusses and frames by the direct stiffness method. Three degrees of freedom per node (ux, uy, rz).
// Truss members carry axial force only, and in truss mode every rotation is held, so a pin-jointed truss
// solves on the same system. Frame members are Euler-Bernoulli beam-columns with an optional uniform load
// wy (global y direction, per metre along the member). Consistent units: m, kN, kN/m², m², m⁴.

export type Node = { id: string; x: number; y: number };
export type Member = { id: string; i: string; j: string; E: number; A: number; I: number; wy: number };
export type Support = { node: string; ux: boolean; uy: boolean; rz: boolean };
export type Load = { node: string; fx: number; fy: number; m: number };
export type Model = { mode: 'truss' | 'frame'; nodes: Node[]; members: Member[]; supports: Support[]; loads: Load[] };

export type MemberResult = { id: string; L: number; N1: number; V1: number; M1: number; N2: number; V2: number; M2: number; axial: number };
export type Result = {
  disp: { id: string; ux: number; uy: number; rz: number }[];
  reactions: { node: string; rx: number; ry: number; mz: number }[];
  members: MemberResult[];
  check: { fx: number; fy: number; m: number }; // sum of applied loads + reactions (should be ~0)
};

/** Solve K x = f by Gaussian elimination with partial pivoting; throws on a singular (unstable) system. */
export function solve(K: number[][], f: number[]): number[] {
  const n = f.length, A = K.map((r, i) => [...r, f[i]]);
  const scale = Math.max(1e-300, ...K.map((r, i) => Math.abs(r[i])));
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    if (Math.abs(A[p][c]) < scale * 1e-11) throw new Error('unstable');
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = c + 1; r < n; r++) { const k = A[r][c] / A[c][c]; if (k) for (let j = c; j <= n; j++) A[r][j] -= k * A[c][j]; }
  }
  const x = Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = A[r][n]; for (let j = r + 1; j < n; j++) s -= A[r][j] * x[j]; x[r] = s / A[r][r]; }
  return x;
}

/** Local stiffness of a member (6 × 6, local axes). */
function kLocal(m: Member, L: number, truss: boolean): number[][] {
  const a = (m.E * m.A) / L, k = Array.from({ length: 6 }, () => Array(6).fill(0));
  k[0][0] = k[3][3] = a; k[0][3] = k[3][0] = -a;
  if (!truss) {
    const EI = m.E * m.I, b = (12 * EI) / L ** 3, c = (6 * EI) / L ** 2, d = (4 * EI) / L, e = (2 * EI) / L;
    k[1][1] = k[4][4] = b; k[1][4] = k[4][1] = -b;
    k[1][2] = k[2][1] = k[1][5] = k[5][1] = c; k[4][2] = k[2][4] = k[4][5] = k[5][4] = -c;
    k[2][2] = k[5][5] = d; k[2][5] = k[5][2] = e;
  }
  return k;
}
const T = (c: number, s: number) => { const t = Array.from({ length: 6 }, () => Array(6).fill(0)); for (const o of [0, 3]) { t[o][o] = c; t[o][o + 1] = s; t[o + 1][o] = -s; t[o + 1][o + 1] = c; t[o + 2][o + 2] = 1; } return t; };
const mul = (A: number[][], v: number[]) => A.map((r) => r.reduce((s, x, j) => s + x * v[j], 0));
const tr = (A: number[][]) => A[0].map((_, j) => A.map((r) => r[j]));
const mm = (A: number[][], B: number[][]) => A.map((r) => B[0].map((_, j) => r.reduce((s, x, k) => s + x * B[k][j], 0)));

/** Equivalent nodal loads (local) of a uniform load with local components ax (along) and ay (across) per metre. */
function fixedEnd(ax: number, ay: number, L: number): number[] { return [ax * L / 2, ay * L / 2, ay * L * L / 12, ax * L / 2, ay * L / 2, -ay * L * L / 12]; }

export function analyse(model: Model): Result {
  const truss = model.mode === 'truss';
  const idx = new Map(model.nodes.map((n, k) => [n.id, k]));
  const nd = model.nodes.length * 3, K = Array.from({ length: nd }, () => Array(nd).fill(0)), F = Array(nd).fill(0);
  const info = model.members.map((m) => {
    const a = model.nodes[idx.get(m.i)!], b = model.nodes[idx.get(m.j)!], dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy), c = dx / L, s = dy / L;
    const kl = kLocal(m, L, truss), t = T(c, s), kg = mm(tr(t), mm(kl, t));
    const dofs = [idx.get(m.i)! * 3, idx.get(m.i)! * 3 + 1, idx.get(m.i)! * 3 + 2, idx.get(m.j)! * 3, idx.get(m.j)! * 3 + 1, idx.get(m.j)! * 3 + 2];
    const fe = !truss && m.wy ? fixedEnd(s * m.wy, c * m.wy, L) : Array(6).fill(0);
    const feg = mul(tr(t), fe);
    dofs.forEach((p, r) => { F[p] += feg[r]; dofs.forEach((q, col) => { K[p][q] += kg[r][col]; }); });
    return { m, L, kl, t, dofs, fe };
  });
  for (const l of model.loads) { const k = idx.get(l.node)! * 3; F[k] += l.fx; F[k + 1] += l.fy; F[k + 2] += l.m; }
  const fixed = new Set<number>();
  for (const s of model.supports) { const k = idx.get(s.node)! * 3; if (s.ux) fixed.add(k); if (s.uy) fixed.add(k + 1); if (s.rz || truss) fixed.add(k + 2); }
  if (truss) model.nodes.forEach((_, k) => fixed.add(k * 3 + 2));
  const free = [...Array(nd).keys()].filter((d) => !fixed.has(d));
  const u = Array(nd).fill(0);
  if (free.length) {
    const x = solve(free.map((p) => free.map((q) => K[p][q])), free.map((p) => F[p]));
    free.forEach((p, k) => { u[p] = x[k]; });
  }
  // Reactions: R = K u − F at restrained dofs (excluding the dummy truss rotations).
  const Ku = mul(K, u);
  const reactions = model.supports.map((s) => { const k = idx.get(s.node)! * 3; return { node: s.node, rx: s.ux ? Ku[k] - F[k] : 0, ry: s.uy ? Ku[k + 1] - F[k + 1] : 0, mz: !truss && s.rz ? Ku[k + 2] - F[k + 2] : 0 }; });
  const members = info.map(({ m, L, kl, t, dofs, fe }) => {
    const f = mul(kl, mul(t, dofs.map((d) => u[d]))).map((v, r) => v - fe[r]);
    // Internal force convention: N positive in tension, V and M as the end forces on the member.
    return { id: m.id, L, N1: f[0], V1: f[1], M1: f[2], N2: f[3], V2: f[4], M2: f[5], axial: -f[0] };
  });
  let fx = 0, fy = 0, mz = 0;
  const all: { x: number; y: number; fx: number; fy: number; m: number }[] = [];
  for (const l of model.loads) { const n = model.nodes[idx.get(l.node)!]; all.push({ x: n.x, y: n.y, fx: l.fx, fy: l.fy, m: l.m }); }
  for (const r of reactions) { const n = model.nodes[idx.get(r.node)!]; all.push({ x: n.x, y: n.y, fx: r.rx, fy: r.ry, m: r.mz }); }
  for (const { m, L } of info) if (!truss && m.wy) { const a = model.nodes[idx.get(m.i)!], b = model.nodes[idx.get(m.j)!]; all.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, fx: 0, fy: m.wy * L, m: 0 }); }
  for (const p of all) { fx += p.fx; fy += p.fy; mz += p.m + p.x * p.fy - p.y * p.fx; }
  return { disp: model.nodes.map((n, k) => ({ id: n.id, ux: u[k * 3], uy: u[k * 3 + 1], rz: truss ? 0 : u[k * 3 + 2] })), reactions, members, check: { fx, fy, m: mz } };
}

/** Deflected position along a frame member (cubic shape functions) at n points, in global coordinates. */
export function deflectedMember(a: Node, b: Node, ua: number[], ub: number[], scale: number, truss: boolean, n = 16): [number, number][] {
  const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy), c = dx / L, s = dy / L;
  const loc = (g: number[]) => [c * g[0] + s * g[1], -s * g[0] + c * g[1], g[2]];
  const p = loc(ua), q = loc(ub), out: [number, number][] = [];
  for (let k = 0; k <= n; k++) {
    const x = k / n, u = p[0] * (1 - x) + q[0] * x;
    const v = truss ? p[1] * (1 - x) + q[1] * x : p[1] * (1 - 3 * x * x + 2 * x ** 3) + p[2] * L * (x - 2 * x * x + x ** 3) + q[1] * (3 * x * x - 2 * x ** 3) + q[2] * L * (-x * x + x ** 3);
    const X = a.x + dx * x + scale * (c * u - s * v), Y = a.y + dy * x + scale * (s * u + c * v);
    out.push([X, Y]);
  }
  return out;
}

/** Parse the four pasted tables into a model; throws an Error with a plain message. */
export function buildModel(mode: 'truss' | 'frame', nodes: string[][], members: string[][], supports: string[][], loads: string[][], num: (s: string) => number, units = { E: 1e6, A: 1e-4, I: 1e-8 }): Model {
  const seen = new Set<string>();
  // A first row whose number column holds words is a header and is skipped.
  const types = ['pin', 'fixed', 'roller', 'roller-x', 'roller-y'];
  const body = (rows: string[][], col: number, isType = false) => {
    const r = rows.filter((x) => x.some((c) => (c ?? '').trim() !== ''));
    const h = r[0]?.[col]?.trim() ?? '';
    const header = isType ? !types.includes(h.toLowerCase()) && !seen.has((r[0]?.[0] ?? '').trim()) : h !== '' && Number.isNaN(num(h));
    return header ? r.slice(1) : r;
  };
  const N: Node[] = [];
  for (const r of body(nodes, 1)) {
    const id = r[0].trim(), x = num(r[1]), y = num(r[2]);
    if (!id || !Number.isFinite(x) || !Number.isFinite(y)) throw new Error(`Node row "${r.join(', ')}": give a name, x and y.`);
    if (seen.has(id)) throw new Error(`Node ${id} is listed twice.`);
    seen.add(id); N.push({ id, x, y });
  }
  if (N.length < 2) throw new Error('Give at least two nodes.');
  const M: Member[] = [];
  for (const r of body(members, 3)) {
    const [id, i, j] = [r[0], r[1], r[2]].map((c) => (c ?? '').trim());
    const E = num(r[3]), A = num(r[4]), I = mode === 'frame' ? num(r[5]) : 0, wy = mode === 'frame' && (r[6] ?? '').trim() ? num(r[6]) : 0;
    if (!seen.has(i) || !seen.has(j)) throw new Error(`Member ${id}: node ${seen.has(i) ? j : i} is not in the node list.`);
    if (i === j) throw new Error(`Member ${id} starts and ends at the same node.`);
    if (!(E > 0) || !(A > 0) || (mode === 'frame' && !(I > 0))) throw new Error(`Member ${id}: give E (GPa) and A (cm²)${mode === 'frame' ? ' and I (cm⁴)' : ''}, all above 0.`);
    if (!Number.isFinite(wy)) throw new Error(`Member ${id}: the uniform load is not a number.`);
    M.push({ id, i, j, E: E * units.E, A: A * units.A, I: I * units.I, wy });
  }
  if (!M.length) throw new Error('Give at least one member.');
  const S: Support[] = [];
  for (const r of body(supports, 1, true)) {
    const node = (r[0] ?? '').trim(), t = (r[1] ?? '').trim().toLowerCase();
    if (!seen.has(node)) throw new Error(`Support at node ${node}: that node is not in the list.`);
    const map: Record<string, [boolean, boolean, boolean]> = { pin: [true, true, false], fixed: [true, true, true], roller: [false, true, false], 'roller-x': [false, true, false], 'roller-y': [true, false, false] };
    if (!map[t]) throw new Error(`Support at node ${node}: type "${r[1] ?? ''}" is not one of pin, roller, roller-y, fixed.`);
    const [ux, uy, rz] = map[t]; S.push({ node, ux, uy, rz });
  }
  if (!S.length) throw new Error('Give at least one support.');
  const Ld: Load[] = [];
  for (const r of body(loads, 1)) {
    const node = (r[0] ?? '').trim(), fx = (r[1] ?? '').trim() ? num(r[1]) : 0, fy = (r[2] ?? '').trim() ? num(r[2]) : 0, m = (r[3] ?? '').trim() ? num(r[3]) : 0;
    if (!seen.has(node)) throw new Error(`Load at node ${node}: that node is not in the list.`);
    if (![fx, fy, m].every(Number.isFinite)) throw new Error(`Load at node ${node}: Fx, Fy and M must be numbers.`);
    Ld.push({ node, fx, fy, m });
  }
  return { mode, nodes: N, members: M, supports: S, loads: Ld };
}
