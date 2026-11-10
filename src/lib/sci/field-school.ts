// #1284 Field area by triangles: a plot of land drawn as a polygon (corners in metres), split into triangles by ear
// clipping, each triangle's area by Heron's formula (Class 9) or the coordinate formula (Class 10), and the total
// checked against the shoelace formula. Pure maths, no DOM.

export type P = [number, number];
const cross = (o: P, a: P, b: P) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
export const dist = (a: P, b: P) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** Signed area by the shoelace formula (positive when the corners go anticlockwise). */
export function shoelace(p: P[]): number {
  let s = 0;
  for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; s += a[0] * b[1] - b[0] * a[1]; }
  return s / 2;
}
export const perimeter = (p: P[]) => p.reduce((t, a, i) => t + dist(a, p[(i + 1) % p.length]), 0);

/** Do segments ab and cd cross (touching at an end counts)? */
function segsMeet(a: P, b: P, c: P, d: P): boolean {
  const d1 = cross(c, d, a), d2 = cross(c, d, b), d3 = cross(a, b, c), d4 = cross(a, b, d);
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) return true;
  const on = (p: P, q: P, r: P) => Math.min(p[0], q[0]) <= r[0] && r[0] <= Math.max(p[0], q[0]) && Math.min(p[1], q[1]) <= r[1] && r[1] <= Math.max(p[1], q[1]);
  return (d1 === 0 && on(c, d, a)) || (d2 === 0 && on(c, d, b)) || (d3 === 0 && on(a, b, c)) || (d4 === 0 && on(a, b, d));
}
/** A simple polygon: at least 3 corners, no repeated corners, sides meet only at their shared corners, area above 0. */
export function isSimple(p: P[]): boolean {
  const n = p.length;
  if (n < 3) return false;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (p[i][0] === p[j][0] && p[i][1] === p[j][1]) return false;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    if (j === i + 1 || (i === 0 && j === n - 1)) continue;
    if (segsMeet(p[i], p[(i + 1) % n], p[j], p[(j + 1) % n])) return false;
  }
  return Math.abs(shoelace(p)) > 1e-12;
}

/** Split a simple polygon into n − 2 triangles (corner indices), by ear clipping. Straight-through corners are kept. */
export function triangulate(p: P[]): [number, number, number][] {
  const sign = shoelace(p) >= 0 ? 1 : -1, idx = p.map((_, i) => i), out: [number, number, number][] = [];
  const inside = (t: P, a: P, b: P, c: P) => { const s1 = sign * cross(a, b, t), s2 = sign * cross(b, c, t), s3 = sign * cross(c, a, t); return s1 >= 0 && s2 >= 0 && s3 >= 0; };
  let guard = 0;
  while (idx.length > 3 && guard++ < 10000) {
    let cut = false;
    for (let k = 0; k < idx.length; k++) {
      const i0 = idx[(k + idx.length - 1) % idx.length], i1 = idx[k], i2 = idx[(k + 1) % idx.length];
      const a = p[i0], b = p[i1], c = p[i2];
      if (sign * cross(a, b, c) <= 1e-12) continue;                       // reflex or straight corner: not an ear
      if (idx.some((j) => j !== i0 && j !== i1 && j !== i2 && inside(p[j], a, b, c))) continue;
      out.push([i0, i1, i2]); idx.splice(k, 1); cut = true; break;
    }
    if (!cut) break;
  }
  if (idx.length === 3) out.push([idx[0], idx[1], idx[2]]);
  return out;
}

/** Heron's formula, with the sides and semi-perimeter for the steps. */
export function heron(a: P, b: P, c: P) {
  const x = dist(b, c), y = dist(c, a), z = dist(a, b), s = (x + y + z) / 2;
  // Kahan's stable ordering for thin triangles.
  const [p, q, r] = [x, y, z].sort((m, n) => n - m);
  const area = 0.25 * Math.sqrt(Math.max(0, (p + (q + r)) * (r - (p - q)) * (r + (p - q)) * (p + (q - r))));
  return { sides: [x, y, z], s, area };
}
/** Coordinate formula ½|x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|. */
export const coordArea = (a: P, b: P, c: P) => Math.abs(a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])) / 2;

export const PRESETS: { id: string; name: string; p: P[] }[] = [
  { id: 'pent', name: 'Five-sided field', p: [[4, 4], [30, 2], [36, 16], [22, 27], [6, 20]] },
  { id: 'L', name: 'L-shaped plot', p: [[4, 4], [34, 4], [34, 12], [16, 12], [16, 26], [4, 26]] },
  { id: 'trap', name: 'Trapezium field', p: [[4, 4], [36, 4], [28, 20], [10, 20]] },
  { id: 'quad', name: 'Four-sided field', p: [[5, 6], [33, 3], [30, 24], [9, 19]] },
];
