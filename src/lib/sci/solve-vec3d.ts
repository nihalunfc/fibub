// "Solve my numbers" for vectors in space (Class 12): a + b and a − b, dot product with angle and projection, cross
// product with area, magnitude with unit vector and direction cosines, and the shortest distance between two lines.
// Vectors are typed as three numbers, such as 2, 1, -2. No DOM.
import { type SSpec, type SIn, type SOut, sf } from '../learn/solvecore-b.ts';

type V = [number, number, number];
const z0 = (x: number) => (Math.abs(x) < 1e-10 ? 0 : x);
const t = (v: V, n = 5) => `(${v.map((x) => sf(z0(x), n)).join(', ')})`;
const mag = (v: V) => Math.hypot(v[0], v[1], v[2]);
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const D = 180 / Math.PI;
const pp = (x: number) => (x < 0 ? `(${sf(x, 5)})` : sf(x, 5));

function vec(list: number[], name: string): V | string {
  if (list.length !== 3) return `${name} needs exactly three numbers (x, y, z), for example 2, 1, -2. You gave ${list.length}.`;
  return list as V;
}
const two = (i: Record<string, SIn>, a = 'a', b = 'b'): [V, V] | SOut => {
  const A = vec(i[a].list, a === 'a' ? 'Vector a' : 'The first vector'), B = vec(i[b].list, b === 'b' ? 'Vector b' : 'The second vector');
  if (typeof A === 'string') return { error: A };
  if (typeof B === 'string') return { error: B };
  return [A, B];
};
const isErr = (x: [V, V] | SOut): x is SOut => !Array.isArray(x);

export function sumDiff(a: V, b: V): SOut {
  const s: V = [a[0] + b[0], a[1] + b[1], a[2] + b[2]], d = sub(a, b);
  return { answer: `a + b = ${t(s)}, with size ${sf(mag(s), 4)}.`, lines: [`a + b = (${pp(a[0])} + ${pp(b[0])}, ${pp(a[1])} + ${pp(b[1])}, ${pp(a[2])} + ${pp(b[2])}) = ${t(s)}`, `|a + b| = √(${sf(s[0] ** 2, 5)} + ${sf(s[1] ** 2, 5)} + ${sf(s[2] ** 2, 5)}) = ${sf(mag(s), 4)}`, `a − b = ${t(d)} (subtract part by part), with size ${sf(mag(d), 4)}`, `The sizes are |a| = ${sf(mag(a), 4)} and |b| = ${sf(mag(b), 4)}; note |a + b| is not |a| + |b| unless a and b point the same way.`], tip: 'Common mistake: adding the sizes. Add the x, y and z parts separately, then find the size of the result.' };
}

export function dotProduct(a: V, b: V): SOut {
  const d = dot(a, b), ma = mag(a), mb = mag(b);
  const lines = [`a · b = a₁b₁ + a₂b₂ + a₃b₃ = (${sf(a[0], 5)})(${sf(b[0], 5)}) + (${sf(a[1], 5)})(${sf(b[1], 5)}) + (${sf(a[2], 5)})(${sf(b[2], 5)}) = ${sf(d, 5)}`];
  if (ma === 0 || mb === 0) return { answer: `a · b = ${sf(d, 4)}. The angle is not defined because one vector is zero.`, lines, tip: 'The zero vector has no direction, so there is no angle with it.' };
  const c = Math.max(-1, Math.min(1, d / (ma * mb))), th = Math.acos(c) * D, perp = Math.abs(d) < 1e-9 * ma * mb;
  lines.push(`|a| = ${sf(ma, 5)}, |b| = ${sf(mb, 5)}`, `cos θ = a · b / (|a||b|) = ${sf(d, 5)} / (${sf(ma, 5)} × ${sf(mb, 5)}) = ${sf(c, 5)}`, `θ = ${sf(th, 5)}°`);
  const k = d / (mb * mb);
  lines.push(`Scalar projection of a on b = a · b / |b| = ${sf(d / mb, 5)}`, `Vector projection of a on b = (a · b / |b|²) b = ${t([k * b[0], k * b[1], k * b[2]])}`);
  return { answer: perp ? `a · b = 0, so a and b are perpendicular (θ = 90°).` : `a · b = ${sf(d, 4)} and the angle between them is ${sf(th, 5)}°.`, lines, tip: 'Common mistake: the dot product is a number, not a vector. If it is 0 the vectors are at right angles. Use the cross product when you need a vector.' };
}

export function crossProduct(a: V, b: V): SOut {
  const c = cross(a, b), m = mag(c);
  const lines = [`a × b = (a₂b₃ − a₃b₂, a₃b₁ − a₁b₃, a₁b₂ − a₂b₁)`, `= (${pp(a[1])}×${pp(b[2])} − ${pp(a[2])}×${pp(b[1])}, ${pp(a[2])}×${pp(b[0])} − ${pp(a[0])}×${pp(b[2])}, ${pp(a[0])}×${pp(b[1])} − ${pp(a[1])}×${pp(b[0])})`, `= ${t(c)}`, `|a × b| = ${sf(m, 5)}`];
  if (m < 1e-9) return { answer: 'a × b = (0, 0, 0): a and b are parallel (or one is zero).', lines, tip: 'A zero cross product means the two vectors lie along the same line, so the parallelogram they make is flat.' };
  lines.push(`Area of the parallelogram on a and b = |a × b| = ${sf(m, 5)}`, `Area of the triangle with sides a and b = ½|a × b| = ${sf(m / 2, 5)}`, `Unit vector perpendicular to both = a × b / |a × b| = ${t([c[0] / m, c[1] / m, c[2] / m])}`, `Check: (a × b) · a = ${sf(z0(dot(c, a)), 4)} and (a × b) · b = ${sf(z0(dot(c, b)), 4)}, both 0, so it is perpendicular to each.`);
  return { answer: `a × b = ${t(c)}, with size ${sf(m, 4)} (the parallelogram's area).`, lines, tip: 'Common mistake: order. b × a = −(a × b) points the opposite way. Swapping the rows of the determinant changes the sign.' };
}

export function magnitude(a: V): SOut {
  const m = mag(a);
  if (m === 0) return { error: 'The zero vector has no direction, so it has no unit vector. Try a vector that is not all zeros.' };
  const u: V = [a[0] / m, a[1] / m, a[2] / m], ang = u.map((x) => Math.acos(Math.max(-1, Math.min(1, x))) * D);
  return { answer: `|a| = ${sf(m, 4)} and the unit vector is ${t(u, 4)}.`, lines: [`|a| = √(x² + y² + z²) = √(${sf(a[0] ** 2, 6)} + ${sf(a[1] ** 2, 6)} + ${sf(a[2] ** 2, 6)}) = ${sf(m, 5)}`, `Unit vector â = a / |a| = ${t(u)}`, `Direction cosines l, m, n = ${t(u)} (the cosines of the angles with the x, y and z axes)`, `Angles with the axes: ${sf(ang[0], 4)}°, ${sf(ang[1], 4)}°, ${sf(ang[2], 4)}°`, `Check: l² + m² + n² = ${sf(u[0] ** 2 + u[1] ** 2 + u[2] ** 2, 4)} = 1`], tip: 'Common mistake: dividing by |a|² instead of |a|. A unit vector must have size exactly 1.' };
}

export function lineDistance(p: V, a: V, q: V, b: V): SOut {
  if (mag(a) === 0 || mag(b) === 0) return { error: 'A direction vector cannot be (0, 0, 0). Check both directions.' };
  const c = cross(a, b), m = mag(c), w = sub(q, p);
  const lines = [`Line 1: r = ${t(p)} + λ${t(a)};  line 2: r = ${t(q)} + μ${t(b)}`, `q − p = ${t(w)}`];
  if (m < 1e-9 * mag(a) * mag(b)) {
    const cw = cross(w, a), d = mag(cw) / mag(a);
    lines.push('a × b = 0, so the lines are parallel.', `Distance = |(q − p) × a| / |a| = ${sf(mag(cw), 5)} / ${sf(mag(a), 5)} = ${sf(d, 4)}`);
    return { answer: d < 1e-9 ? 'The lines are parallel and coincide (the same line): the distance is 0.' : `The lines are parallel, ${sf(d, 4)} units apart.`, lines, tip: 'For parallel lines use |(q − p) × a| / |a|. The skew-line formula would divide by zero.' };
  }
  const tri = dot(w, c), d = Math.abs(tri) / m;
  lines.push(`a × b = ${t(c)}, |a × b| = ${sf(m, 5)}`, `(q − p) · (a × b) = ${sf(tri, 5)}`, `Shortest distance = |(q − p) · (a × b)| / |a × b| = ${sf(Math.abs(tri), 5)} / ${sf(m, 5)} = ${sf(d, 4)}`);
  return { answer: d < 1e-9 ? 'The lines meet (intersect): the shortest distance is 0.' : `The shortest distance between the lines is ${sf(d, 4)} units.`, lines, tip: 'Common mistake: using a to b as the vector to project onto. Use the vector q − p between a point on each line, and the common perpendicular direction a × b.' };
}

export const VEC3D_SPEC: SSpec = {
  id: 'vec3d',
  finds: [['sum', 'a + b and a − b'], ['dot', 'Dot product, angle, projection'], ['cross', 'Cross product and area'], ['mag', 'Size, unit vector, direction cosines'], ['lines', 'Distance between two lines']],
  fields: [
    { k: 'a', label: 'Vector a: x, y, z', kind: 'list', neg: true, ph: 'e.g. 2, 1, -2', show: (c) => c.find !== 'lines' },
    { k: 'b', label: 'Vector b: x, y, z', kind: 'list', neg: true, ph: 'e.g. 1, 3, 1', show: (c) => c.find === 'sum' || c.find === 'dot' || c.find === 'cross' },
    { k: 'p', label: 'Point on line 1', kind: 'list', neg: true, ph: 'e.g. 1, 2, 3', show: (c) => c.find === 'lines' },
    { k: 'da', label: 'Direction of line 1', kind: 'list', neg: true, ph: 'e.g. 2, 3, 4', show: (c) => c.find === 'lines' },
    { k: 'q', label: 'Point on line 2', kind: 'list', neg: true, ph: 'e.g. 2, 4, 5', show: (c) => c.find === 'lines' },
    { k: 'db', label: 'Direction of line 2', kind: 'list', neg: true, ph: 'e.g. 3, 4, 5', show: (c) => c.find === 'lines' },
  ],
  presets: [
    { name: 'a = (2, 1, −2), b = (1, 3, 1): sum', find: 'sum', vals: { a: '2, 1, -2', b: '1, 3, 1' } },
    { name: 'Same vectors: dot product and angle', find: 'dot', vals: { a: '2, 1, -2', b: '1, 3, 1' } },
    { name: 'Same vectors: cross product', find: 'cross', vals: { a: '2, 1, -2', b: '1, 3, 1' } },
    { name: 'Unit vector of (3, −4, 12)', find: 'mag', vals: { a: '3, -4, 12' } },
    { name: 'Distance between two skew lines', find: 'lines', vals: { p: '1, 2, 3', da: '2, 3, 4', q: '2, 4, 5', db: '3, 4, 5' } },
  ],
  solve: (i, c) => {
    if (c.find === 'lines') {
      const L = [['p', 'Point on line 1'], ['da', 'The direction of line 1'], ['q', 'Point on line 2'], ['db', 'The direction of line 2']].map(([k, n]) => vec(i[k].list, n));
      const bad = L.find((x) => typeof x === 'string'); if (bad) return { error: bad as string };
      return lineDistance(L[0] as V, L[1] as V, L[2] as V, L[3] as V);
    }
    if (c.find === 'mag') { const A = vec(i.a.list, 'Vector a'); return typeof A === 'string' ? { error: A } : magnitude(A); }
    const ab = two(i); if (isErr(ab)) return ab;
    return c.find === 'sum' ? sumDiff(ab[0], ab[1]) : c.find === 'dot' ? dotProduct(ab[0], ab[1]) : crossProduct(ab[0], ab[1]);
  },
};
