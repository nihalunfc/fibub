// Miller indices in any crystal system: the metric tensor of a cell, d-spacings and angles between planes and
// directions, zone axes, Miller-Bravais (four-index) conversion for hexagonal cells, Cartesian cell vectors and the
// polygons a family of planes cuts in the unit cell. Plain TypeScript with no DOM; checked against NumPy.

const RAD = Math.PI / 180;
export type Vec3 = [number, number, number];
export type Mat3 = [Vec3, Vec3, Vec3];
export type Cell = { a: number; b: number; c: number; alpha: number; beta: number; gamma: number };
export type System = 'cubic' | 'tetragonal' | 'orthorhombic' | 'hexagonal' | 'trigonal' | 'monoclinic' | 'triclinic';
export const SYSTEMS: { id: System; name: string; free: (keyof Cell)[]; rule: string }[] = [
  { id: 'cubic', name: 'Cubic', free: ['a'], rule: 'a = b = c, α = β = γ = 90°' },
  { id: 'tetragonal', name: 'Tetragonal', free: ['a', 'c'], rule: 'a = b, α = β = γ = 90°' },
  { id: 'orthorhombic', name: 'Orthorhombic', free: ['a', 'b', 'c'], rule: 'α = β = γ = 90°' },
  { id: 'hexagonal', name: 'Hexagonal (also trigonal on hexagonal axes)', free: ['a', 'c'], rule: 'a = b, α = β = 90°, γ = 120°' },
  { id: 'trigonal', name: 'Trigonal, rhombohedral axes', free: ['a', 'alpha'], rule: 'a = b = c, α = β = γ' },
  { id: 'monoclinic', name: 'Monoclinic (b unique)', free: ['a', 'b', 'c', 'beta'], rule: 'α = γ = 90°' },
  { id: 'triclinic', name: 'Triclinic', free: ['a', 'b', 'c', 'alpha', 'beta', 'gamma'], rule: 'no rules' },
];

/** The full cell from the free parameters of a crystal system. */
export function cellFor(sys: System, p: Partial<Cell>): Cell {
  const a = p.a ?? NaN, b = p.b ?? NaN, c = p.c ?? NaN;
  switch (sys) {
    case 'cubic': return { a, b: a, c: a, alpha: 90, beta: 90, gamma: 90 };
    case 'tetragonal': return { a, b: a, c, alpha: 90, beta: 90, gamma: 90 };
    case 'orthorhombic': return { a, b, c, alpha: 90, beta: 90, gamma: 90 };
    case 'hexagonal': return { a, b: a, c, alpha: 90, beta: 90, gamma: 120 };
    case 'trigonal': return { a, b: a, c: a, alpha: p.alpha ?? NaN, beta: p.alpha ?? NaN, gamma: p.alpha ?? NaN };
    case 'monoclinic': return { a, b, c, alpha: 90, beta: p.beta ?? NaN, gamma: 90 };
    default: return { a, b, c, alpha: p.alpha ?? NaN, beta: p.beta ?? NaN, gamma: p.gamma ?? NaN };
  }
}

/** Why a cell is impossible, or '' if it is fine. */
export function cellProblem(c: Cell): string {
  if (![c.a, c.b, c.c].every((x) => x > 0 && Number.isFinite(x))) return 'Cell lengths must be positive numbers.';
  if (![c.alpha, c.beta, c.gamma].every((x) => x > 0 && x < 180)) return 'Cell angles are between 0 and 180°.';
  const ca = Math.cos(c.alpha * RAD), cb = Math.cos(c.beta * RAD), cg = Math.cos(c.gamma * RAD);
  if (1 - ca * ca - cb * cb - cg * cg + 2 * ca * cb * cg <= 1e-10) return 'These three angles cannot make a cell (each must be less than the sum of the other two, and all three add to under 360°).';
  return '';
}

/** Direct metric tensor G (Gᵢⱼ = aᵢ · aⱼ). */
export function metric(c: Cell): Mat3 {
  const ca = Math.cos(c.alpha * RAD), cb = Math.cos(c.beta * RAD), cg = Math.cos(c.gamma * RAD);
  return [[c.a * c.a, c.a * c.b * cg, c.a * c.c * cb], [c.a * c.b * cg, c.b * c.b, c.b * c.c * ca], [c.a * c.c * cb, c.b * c.c * ca, c.c * c.c]];
}
export const det3 = (m: Mat3) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
export function inv3(m: Mat3): Mat3 {
  const d = det3(m);
  const c = (i: number, j: number) => { const r = [0, 1, 2].filter((x) => x !== i), s = [0, 1, 2].filter((x) => x !== j); return m[r[0]][s[0]] * m[r[1]][s[1]] - m[r[0]][s[1]] * m[r[1]][s[0]]; };
  return [0, 1, 2].map((i) => [0, 1, 2].map((j) => (((i + j) % 2 ? -1 : 1) * c(j, i)) / d)) as Mat3;
}
/** Reciprocal metric tensor G* = G⁻¹. */
export const recipMetric = (c: Cell) => inv3(metric(c));
export const volume = (c: Cell) => Math.sqrt(det3(metric(c)));
const quad = (m: Mat3, u: number[], v: number[]) => u.reduce((s, ui, i) => s + ui * (m[i][0] * v[0] + m[i][1] * v[1] + m[i][2] * v[2]), 0);

/** Interplanar spacing d(hkl) = 1/√(h G* hᵀ). */
export const dSpacing = (c: Cell, h: number[]) => 1 / Math.sqrt(quad(recipMetric(c), h, h));
/** Angle between the normals of planes h1 and h2, degrees (0 to 180). */
export function planeAngle(c: Cell, h1: number[], h2: number[]): number {
  const g = recipMetric(c);
  return acosD(quad(g, h1, h2) / Math.sqrt(quad(g, h1, h1) * quad(g, h2, h2)));
}
/** Length of direction [uvw] in the cell's length unit. */
export const dirLength = (c: Cell, u: number[]) => Math.sqrt(quad(metric(c), u, u));
/** Angle between directions u1 and u2, degrees. */
export function dirAngle(c: Cell, u1: number[], u2: number[]): number {
  const g = metric(c);
  return acosD(quad(g, u1, u2) / Math.sqrt(quad(g, u1, u1) * quad(g, u2, u2)));
}
/** Angle between direction [uvw] and the normal of plane (hkl), degrees: 90 means the direction lies in the plane. */
export function dirPlaneAngle(c: Cell, u: number[], h: number[]): number {
  const dot = h[0] * u[0] + h[1] * u[1] + h[2] * u[2];
  return acosD(dot / (dirLength(c, u) / dSpacing(c, h)));
}
const acosD = (x: number) => Math.acos(Math.max(-1, Math.min(1, x))) / RAD;

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
/** Smallest whole numbers in the same ratio (keeps signs). */
export function reduce(v: number[]): number[] {
  const g = v.reduce((s, x) => gcd(s, Math.round(x)), 0);
  return g ? v.map((x) => Math.round(x) / g) : v.map(() => 0);
}
/** Zone axis [uvw] shared by planes h1 and h2: their cross product, in lowest terms. All zeros if the planes are parallel. */
export const zoneAxis = (h1: number[], h2: number[]) => reduce([h1[1] * h2[2] - h1[2] * h2[1], h1[2] * h2[0] - h1[0] * h2[2], h1[0] * h2[1] - h1[1] * h2[0]]);

// ---------- Miller-Bravais (four-index) ----------
/** Plane (hkl) to (hkil), i = −(h + k). */
export const toBravaisPlane = (h: number[]) => [h[0], h[1], -(h[0] + h[1]), h[2]];
/** Plane (hkil) to (hkl); null if i ≠ −(h + k). */
export const fromBravaisPlane = (h: number[]) => (h[0] + h[1] + h[2] === 0 ? [h[0], h[1], h[3]] : null);
/** Direction [UVW] to [uvtw]: u = (2U − V)/3, v = (2V − U)/3, t = −(u + v), w = W, in lowest whole numbers. */
export const toBravaisDir = (d: number[]) => reduce([2 * d[0] - d[1], 2 * d[1] - d[0], -(d[0] + d[1]), 3 * d[2]]);
/** Direction [uvtw] to [UVW]: U = u − t, V = v − t, W = w; null if t ≠ −(u + v). */
export const fromBravaisDir = (d: number[]) => (d[0] + d[1] + d[2] === 0 ? reduce([d[0] - d[2], d[1] - d[2], d[3]]) : null);

/** Index text such as "1 -1 0", "(1,-1,0)", "1-10", "[2-1-10]" or "1 1 -2 0" as numbers; null if not readable. */
export function parseIndices(s: string): number[] | null {
  const t = s.replace(/[−–]/g, '-').replace(/[()[\]{}<>]/g, ' ').trim();
  if (!t) return null;
  const parts = /[\s,;]/.test(t) ? t.split(/[\s,;]+/).filter(Boolean) : t.match(/-?\d/g) ?? [];
  if (/[\s,;]/.test(t) ? !parts.every((p) => /^[-+]?\d+$/.test(p)) : parts.join('') !== t.replace(/\+/g, '')) return null;
  const v = parts.map(Number);
  return v.length === 3 || v.length === 4 ? v : null;
}
/** Indices as crystallographers write them, e.g. "1 −1 0" or "1−10". */
export const fmtIdx = (v: number[]) => (v.every((x) => Math.abs(x) < 10) ? v.map((x) => (x < 0 ? '−' + -x : String(x))).join('') : v.map((x) => String(x).replace('-', '−')).join(' '));

// ---------- Geometry for the picture ----------
/** Cell vectors in Cartesian ångström: a along x, b in the xy plane (rows a, b, c). */
export function cartesian(c: Cell): Mat3 {
  const ca = Math.cos(c.alpha * RAD), cb = Math.cos(c.beta * RAD), cg = Math.cos(c.gamma * RAD), sg = Math.sin(c.gamma * RAD);
  const cx = c.c * cb, cy = (c.c * (ca - cb * cg)) / sg, cz = Math.sqrt(Math.max(0, c.c * c.c - cx * cx - cy * cy));
  return [[c.a, 0, 0], [c.b * cg, c.b * sg, 0], [cx, cy, cz]];
}
export const toCart = (m: Mat3, f: number[]): Vec3 => [0, 1, 2].map((j) => f[0] * m[0][j] + f[1] * m[1][j] + f[2] * m[2][j]) as Vec3;

const CORNERS: Vec3[] = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
export const EDGES: [number, number][] = [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 4], [2, 6], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7]];
export const corners = () => CORNERS.map((c) => c.slice() as Vec3);

/**
 * The polygons the planes hx + ky + lz = n (n whole) cut from the unit cell, in fractional coordinates, each in
 * order around its edge. Planes that only touch the cell at a corner or along an edge are left out.
 */
export function planePolygons(h: number[], cell?: Cell): { n: number; pts: Vec3[] }[] {
  if (!h[0] && !h[1] && !h[2]) return [];
  const val = (p: Vec3) => h[0] * p[0] + h[1] * p[1] + h[2] * p[2];
  const vals = CORNERS.map(val), lo = Math.min(...vals), hi = Math.max(...vals);
  const M = cell ? cartesian(cell) : ([[1, 0, 0], [0, 1, 0], [0, 0, 1]] as Mat3);
  const out: { n: number; pts: Vec3[] }[] = [];
  for (let n = lo; n <= hi; n++) {
    const pts: Vec3[] = [];
    const add = (p: Vec3) => { if (!pts.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) < 1e-9)) pts.push(p); };
    for (const [i, j] of EDGES) {
      const A = CORNERS[i], B = CORNERS[j], va = val(A) - n, vb = val(B) - n;
      if (va === 0) add(A.slice() as Vec3);
      if (vb === 0) add(B.slice() as Vec3);
      if (va * vb < 0) { const t = va / (va - vb); add([A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1]), A[2] + t * (B[2] - A[2])]); }
    }
    if (pts.length < 3) continue;
    // Order around the centre, in Cartesian space so the polygon is not twisted.
    const C = pts.map((p) => toCart(M, p)), cen = [0, 1, 2].map((k) => C.reduce((s, p) => s + p[k], 0) / C.length);
    const nrm = cross(sub(C[1], C[0]), sub(C[2], C[0]));
    let e1 = sub(C[0], cen as Vec3); if (Math.hypot(...e1) < 1e-12) e1 = sub(C[1], cen as Vec3);
    const e2 = cross(nrm, e1);
    const ang = C.map((p) => { const d = sub(p, cen as Vec3); return Math.atan2(dot(d, e2), dot(d, e1)); });
    const order = pts.map((_, i) => i).sort((x, y) => ang[x] - ang[y]);
    out.push({ n, pts: order.map((i) => pts[i]) });
  }
  return out;
}
const sub = (a: number[], b: number[]): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: number[], b: number[]): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
/** The plane of a family to highlight: n = 1 if it cuts the cell, else −1, else 0, else the first. */
export function mainPlane(polys: { n: number; pts: Vec3[] }[]) {
  return polys.find((p) => p.n === 1) ?? polys.find((p) => p.n === -1) ?? polys.find((p) => p.n === 0) ?? polys[0];
}

// ---------- Reflection list ----------
/** All planes with |h|, |k|, |l| ≤ max, grouped by equal d (to 1 part in 10⁶), largest d first. */
export function reflections(c: Cell, max: number): { d: number; hkl: number[]; count: number }[] {
  const g = recipMetric(c), groups: { d: number; hkl: number[]; count: number }[] = [];
  for (let h = -max; h <= max; h++) for (let k = -max; k <= max; k++) for (let l = -max; l <= max; l++) {
    if (!h && !k && !l) continue;
    const d = 1 / Math.sqrt(quad(g, [h, k, l], [h, k, l]));
    const grp = groups.find((x) => Math.abs(x.d / d - 1) < 1e-6);
    const better = (a: number[], b: number[]) => { const s = (v: number[]) => [v.filter((x) => x < 0).length, -v[0], -v[1], -v[2]]; const A = s(a), B = s(b); for (let i = 0; i < 4; i++) if (A[i] !== B[i]) return A[i] < B[i]; return false; };
    if (grp) { grp.count++; if (better([h, k, l], grp.hkl)) grp.hkl = [h, k, l]; } else groups.push({ d, hkl: [h, k, l], count: 1 });
  }
  return groups.sort((a, b) => b.d - a.d);
}
