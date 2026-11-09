// Reciprocal lattices and first Brillouin zones (Wigner-Seitz cells of the reciprocal lattice) for 2D and 3D
// lattices, with the usual high-symmetry points. Plain maths, no DOM.

export type V3 = [number, number, number];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
export const norm = (a: V3) => Math.sqrt(dot(a, a));
export { dot, cross };

export type LatticeKind = 'square' | 'rect' | 'hex2' | 'crect' | 'oblique' | 'sc' | 'fcc' | 'bcc' | 'hex' | 'tet' | 'orth' | 'tric';
export const IS2D = (k: LatticeKind) => k === 'square' || k === 'rect' || k === 'hex2' || k === 'crect' || k === 'oblique';
export type Params = { a: number; b?: number; c?: number; alpha?: number; beta?: number; gamma?: number };

/** Primitive vectors (rows) in the usual textbook setting; 2D lattices have a zero third component and a3 = ẑ. */
export function primitive(kind: LatticeKind, p: Params): [V3, V3, V3] {
  const a = p.a, b = p.b ?? a, c = p.c ?? a, r = Math.PI / 180, s3 = Math.sqrt(3);
  switch (kind) {
    case 'square': return [[a, 0, 0], [0, a, 0], [0, 0, 1]];
    case 'rect': return [[a, 0, 0], [0, b, 0], [0, 0, 1]];
    case 'hex2': return [[a, 0, 0], [a / 2, (a * s3) / 2, 0], [0, 0, 1]];
    case 'crect': return [[a / 2, -b / 2, 0], [a / 2, b / 2, 0], [0, 0, 1]];
    case 'oblique': { const g = (p.gamma ?? 90) * r; return [[a, 0, 0], [b * Math.cos(g), b * Math.sin(g), 0], [0, 0, 1]]; }
    case 'sc': return [[a, 0, 0], [0, a, 0], [0, 0, a]];
    case 'fcc': return [[0, a / 2, a / 2], [a / 2, 0, a / 2], [a / 2, a / 2, 0]];
    case 'bcc': return [[-a / 2, a / 2, a / 2], [a / 2, -a / 2, a / 2], [a / 2, a / 2, -a / 2]];
    case 'hex': return [[a / 2, (-a * s3) / 2, 0], [a / 2, (a * s3) / 2, 0], [0, 0, c]];
    case 'tet': return [[a, 0, 0], [0, a, 0], [0, 0, c]];
    case 'orth': return [[a, 0, 0], [0, b, 0], [0, 0, c]];
    case 'tric': {
      const al = (p.alpha ?? 90) * r, be = (p.beta ?? 90) * r, ga = (p.gamma ?? 90) * r;
      const cx = c * Math.cos(be), cy = (c * (Math.cos(al) - Math.cos(be) * Math.cos(ga))) / Math.sin(ga);
      const cz2 = c * c - cx * cx - cy * cy;
      return [[a, 0, 0], [b * Math.cos(ga), b * Math.sin(ga), 0], [cx, cy, Math.sqrt(Math.max(0, cz2))]];
    }
  }
}

/** Is the triclinic cell possible (the three angles can close a cell)? */
export function tricValid(al: number, be: number, ga: number): boolean {
  const r = Math.PI / 180, [x, y, z] = [Math.cos(al * r), Math.cos(be * r), Math.cos(ga * r)];
  return 1 - x * x - y * y - z * z + 2 * x * y * z > 1e-9;
}

/** Reciprocal vectors bᵢ = f (aⱼ × aₖ) / V with f = 2π (physics) or 1 (crystallography). */
export function reciprocal(A: [V3, V3, V3], f = 2 * Math.PI): { B: [V3, V3, V3]; vol: number } {
  const vol = dot(A[0], cross(A[1], A[2]));
  return { B: [scale(cross(A[1], A[2]), f / vol), scale(cross(A[2], A[0]), f / vol), scale(cross(A[0], A[1]), f / vol)], vol: Math.abs(vol) };
}

/**
 * Voronoi-relevant lattice vectors: the G whose perpendicular bisector bounds the Wigner-Seitz cell. G is relevant
 * when ±G are the only shortest vectors in G + 2L (Voronoi's criterion).
 */
export function relevant(B: V3[], range = 3): V3[] {
  const d = B.length, pts: { n: number[]; v: V3; l: number }[] = [];
  const rec = (n: number[]) => {
    if (n.length === d) { if (n.some((x) => x)) { let v: V3 = [0, 0, 0]; n.forEach((x, i) => { v = add(v, scale(B[i], x)); }); pts.push({ n: [...n], v, l: dot(v, v) }); } return; }
    for (let x = -range; x <= range; x++) rec([...n, x]);
  };
  rec([]);
  const all = [...pts, { n: new Array(d).fill(0), v: [0, 0, 0] as V3, l: 0 }];
  const out: V3[] = [];
  for (const p of pts) {
    const eps = 1e-9 * p.l;
    const ok = all.every((q) => q === p || q.n.some((x, i) => (x - p.n[i]) % 2 !== 0) || q.n.every((x, i) => x === -p.n[i]) || q.l > p.l + eps);
    if (ok) out.push(p.v);
  }
  return out;
}

export type Cell2 = { vertices: [number, number][]; normals: V3[]; area: number };
/** The 2D Wigner-Seitz cell of the lattice spanned by b1, b2 (vertices counter-clockwise). */
export function wsCell2(b1: V3, b2: V3): Cell2 {
  const G = relevant([b1, b2], 4);
  const verts: [number, number][] = [];
  for (let i = 0; i < G.length; i++) for (let j = i + 1; j < G.length; j++) {
    const [a1, a2] = [G[i][0], G[i][1]], [c1, c2] = [G[j][0], G[j][1]], det = a1 * c2 - a2 * c1;
    if (Math.abs(det) < 1e-12) continue;
    const r1 = dot(G[i], G[i]) / 2, r2 = dot(G[j], G[j]) / 2, x = (r1 * c2 - r2 * a2) / det, y = (a1 * r2 - c1 * r1) / det;
    if (G.every((g) => g[0] * x + g[1] * y <= dot(g, g) / 2 + 1e-9 * dot(g, g)) && !verts.some((v) => Math.hypot(v[0] - x, v[1] - y) < 1e-9 * Math.sqrt(r1))) verts.push([x, y]);
  }
  verts.sort((p, q) => Math.atan2(p[1], p[0]) - Math.atan2(q[1], q[0]));
  let area = 0; verts.forEach((v, i) => { const w = verts[(i + 1) % verts.length]; area += v[0] * w[1] - w[0] * v[1]; });
  return { vertices: verts, normals: G, area: Math.abs(area) / 2 };
}

export type Cell3 = { vertices: V3[]; faces: { g: V3; idx: number[]; area: number }[]; edges: [number, number][]; volume: number };
function solve3(M: V3[], r: number[]): V3 | null {
  const det = dot(M[0], cross(M[1], M[2]));
  if (Math.abs(det) < 1e-12 * norm(M[0]) * norm(M[1]) * norm(M[2])) return null;
  const c0 = cross(M[1], M[2]), c1 = cross(M[2], M[0]), c2 = cross(M[0], M[1]);
  return scale(add(add(scale(c0, r[0]), scale(c1, r[1])), scale(c2, r[2])), 1 / det);
}
/** The 3D Wigner-Seitz cell of the lattice spanned by the rows of B: vertices, faces (one per relevant G), edges, volume. */
export function wsCell3(B: [V3, V3, V3]): Cell3 {
  const G = relevant(B, 3), R = G.map((g) => dot(g, g) / 2), L = Math.sqrt(Math.max(...R));
  const verts: V3[] = [];
  for (let i = 0; i < G.length; i++) for (let j = i + 1; j < G.length; j++) for (let k = j + 1; k < G.length; k++) {
    const x = solve3([G[i], G[j], G[k]], [R[i], R[j], R[k]]);
    if (!x) continue;
    if (!G.every((g, m) => dot(g, x) <= R[m] + 1e-9 * R[m])) continue;
    if (!verts.some((v) => norm(add(v, scale(x, -1))) < 1e-7 * L)) verts.push(x);
  }
  const faces: Cell3['faces'] = [];
  G.forEach((g, m) => {
    const on = verts.map((v, i) => [v, i] as [V3, number]).filter(([v]) => Math.abs(dot(g, v) - R[m]) < 1e-7 * R[m]);
    if (on.length < 3) return;
    const c = scale(on.reduce((s, [v]) => add(s, v), [0, 0, 0] as V3), 1 / on.length), n = scale(g, 1 / norm(g));
    const u0 = add(on[0][0], scale(c, -1)), u = scale(u0, 1 / norm(u0)), w = cross(n, u);
    on.sort((p, q) => { const dp = add(p[0], scale(c, -1)), dq = add(q[0], scale(c, -1)); return Math.atan2(dot(dp, w), dot(dp, u)) - Math.atan2(dot(dq, w), dot(dq, u)); });
    let ar: V3 = [0, 0, 0]; on.forEach(([v], i) => { ar = add(ar, cross(v, on[(i + 1) % on.length][0])); });
    faces.push({ g, idx: on.map(([, i]) => i), area: Math.abs(dot(ar, n)) / 2 });
  });
  const es = new Set<string>(), edges: [number, number][] = [];
  for (const f of faces) f.idx.forEach((a, i) => { const b = f.idx[(i + 1) % f.idx.length], key = a < b ? `${a},${b}` : `${b},${a}`; if (!es.has(key)) { es.add(key); edges.push(a < b ? [a, b] : [b, a]); } });
  const volume = faces.reduce((s, f) => s + (f.area * norm(f.g)) / 2 / 3, 0);
  return { vertices: verts, faces, edges, volume };
}

/** Standard high-symmetry points in fractional coordinates of the reciprocal primitive vectors (textbook settings). */
export function highSym(kind: LatticeKind): [string, number[]][] {
  const t = 1 / 3;
  switch (kind) {
    case 'square': return [['Γ', [0, 0]], ['X', [0.5, 0]], ['M', [0.5, 0.5]]];
    case 'rect': return [['Γ', [0, 0]], ['X', [0.5, 0]], ['Y', [0, 0.5]], ['S', [0.5, 0.5]]];
    case 'hex2': return [['Γ', [0, 0]], ['M', [0.5, 0]], ['K', [2 * t, t]]];
    case 'sc': return [['Γ', [0, 0, 0]], ['X', [0, 0.5, 0]], ['M', [0.5, 0.5, 0]], ['R', [0.5, 0.5, 0.5]]];
    case 'fcc': return [['Γ', [0, 0, 0]], ['X', [0.5, 0, 0.5]], ['L', [0.5, 0.5, 0.5]], ['W', [0.5, 0.25, 0.75]], ['K', [0.375, 0.375, 0.75]], ['U', [0.625, 0.25, 0.625]]];
    case 'bcc': return [['Γ', [0, 0, 0]], ['H', [0.5, -0.5, 0.5]], ['N', [0, 0, 0.5]], ['P', [0.25, 0.25, 0.25]]];
    case 'hex': return [['Γ', [0, 0, 0]], ['M', [0.5, 0, 0]], ['K', [t, t, 0]], ['A', [0, 0, 0.5]], ['L', [0.5, 0, 0.5]], ['H', [t, t, 0.5]]];
    case 'tet': return [['Γ', [0, 0, 0]], ['X', [0, 0.5, 0]], ['M', [0.5, 0.5, 0]], ['Z', [0, 0, 0.5]], ['R', [0, 0.5, 0.5]], ['A', [0.5, 0.5, 0.5]]];
    case 'orth': return [['Γ', [0, 0, 0]], ['X', [0.5, 0, 0]], ['Y', [0, 0.5, 0]], ['Z', [0, 0, 0.5]], ['S', [0.5, 0.5, 0]], ['U', [0.5, 0, 0.5]], ['T', [0, 0.5, 0.5]], ['R', [0.5, 0.5, 0.5]]];
    default: return [['Γ', IS2D(kind) ? [0, 0] : [0, 0, 0]]];
  }
}
/** Fractional reciprocal coordinates to a Cartesian wavevector. */
export const toCart = (B: V3[], f: number[]): V3 => f.reduce((s, x, i) => add(s, scale(B[i], x)), [0, 0, 0] as V3);
/** Where a point sits relative to the zone: max over relevant G of G·k / (|G|²/2): 1 on the surface, below 1 inside. */
export function zoneRatio(G: V3[], k: V3): number { return Math.max(0, ...G.map((g) => dot(g, k) / (dot(g, g) / 2))); }
