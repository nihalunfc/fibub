// Hyperbolic geometry in the Poincaré disk model: points are complex numbers z with |z| < 1. Uses the
// disk's isometries z ↦ (z + a) / (1 + ā z) to move any point to the centre, where geodesics through
// it are straight diameters and angles are ordinary angles (the model is conformal). Plain TypeScript.

export type Z = [number, number];
const add = (a: Z, b: Z): Z => [a[0] + b[0], a[1] + b[1]];
const mul = (a: Z, b: Z): Z => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const div = (a: Z, b: Z): Z => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const conj = (a: Z): Z => [a[0], -a[1]];
export const abs = (a: Z) => Math.hypot(a[0], a[1]);
const scale = (a: Z, k: number): Z => [a[0] * k, a[1] * k];

/** The isometry z ↦ (z + a) / (1 + ā z): it sends 0 to a. Its inverse is mobius(−a, ·). */
export function mobius(a: Z, z: Z): Z { return div(add(z, a), add([1, 0], mul(conj(a), z))); }
const toOrigin = (a: Z, z: Z) => mobius([-a[0], -a[1]], z);

/** Hyperbolic distance (curvature −1): arcosh(1 + 2|z − w|² / ((1 − |z|²)(1 − |w|²))). */
export function dist(z: Z, w: Z): number {
  const dz = 1 - z[0] * z[0] - z[1] * z[1], dw = 1 - w[0] * w[0] - w[1] * w[1];
  const e = (z[0] - w[0]) ** 2 + (z[1] - w[1]) ** 2;
  // 2 artanh(|z − w| / |1 − z̄ w|) is better conditioned for nearby points.
  const q = abs([z[0] - w[0], z[1] - w[1]]) / abs(add([1, 0], scale(mul(conj(z), w), -1)));
  return q < 0.5 ? 2 * Math.atanh(q) : Math.acosh(1 + (2 * e) / (dz * dw));
}
/** Points along the geodesic segment from a to b (n + 1 of them, evenly spaced in hyperbolic length). */
export function segment(a: Z, b: Z, n = 48): Z[] {
  const u = toOrigin(a, b), r = abs(u), d = 2 * Math.atanh(r), out: Z[] = [];
  for (let i = 0; i <= n; i++) { const s = r === 0 ? 0 : Math.tanh((d * i) / n / 2) / r; out.push(mobius(a, scale(u, s))); }
  return out;
}
/** The two ideal (boundary) points of the whole geodesic through a and b, in the order a → b. */
export function idealPoints(a: Z, b: Z): [Z, Z] {
  const u = toOrigin(a, b), r = abs(u), h = scale(u, 1 / r);
  return [mobius(a, [-h[0], -h[1]]), mobius(a, h)];
}
/** Points along the whole geodesic line through a and b, out to (almost) the boundary. */
export function line(a: Z, b: Z, n = 120): Z[] {
  const u = toOrigin(a, b), h = scale(u, 1 / abs(u)), out: Z[] = [];
  for (let i = 0; i <= n; i++) { const s = Math.tanh(((i / n) * 2 - 1) * 9); out.push(mobius(a, scale(h, s))); }
  return out;
}
/** The circle that carries the geodesic through a and b: null when it is a diameter. */
export function geodesicCircle(a: Z, b: Z): { c: Z; r: number } | null {
  const [p, q] = idealPoints(a, b);
  const cr = p[0] * q[1] - p[1] * q[0];
  if (Math.abs(cr) < 1e-12) return null;
  // Centre where the tangents to the unit circle at the two ideal points meet: c·p = 1 and c·q = 1.
  const c: Z = [(q[1] - p[1]) / cr, (p[0] - q[0]) / cr];
  return { c, r: Math.sqrt(c[0] * c[0] + c[1] * c[1] - 1) };
}
/** Midpoint (in hyperbolic length) of a and b. */
export function midpoint(a: Z, b: Z): Z {
  const u = toOrigin(a, b), r = abs(u);
  if (r === 0) return a;
  return mobius(a, scale(u, Math.tanh(Math.atanh(r) / 2) / r));
}
/** The angle at v between the geodesics to a and to b, in radians (0 to π). */
export function angleAt(v: Z, a: Z, b: Z): number {
  const p = toOrigin(v, a), q = toOrigin(v, b);
  const t = Math.abs(Math.atan2(p[0] * q[1] - p[1] * q[0], p[0] * q[0] + p[1] * q[1]));
  return t;
}
/** Angles, area (π − angle sum, by Gauss–Bonnet) and sides of a geodesic triangle. */
export function triangle(a: Z, b: Z, c: Z) {
  const A = angleAt(a, b, c), B = angleAt(b, c, a), C = angleAt(c, a, b);
  return { angles: [A, B, C], sum: A + B + C, area: Math.PI - (A + B + C), sides: [dist(b, c), dist(c, a), dist(a, b)] };
}
/** A hyperbolic circle of centre c and radius ρ is a Euclidean circle: its Euclidean centre and radius. */
export function circle(c: Z, rho: number): { centre: Z; r: number; circumference: number; area: number } {
  const t = Math.tanh(rho / 2), c2 = c[0] * c[0] + c[1] * c[1], den = 1 - t * t * c2;
  return { centre: scale(c, (1 - t * t) / den), r: (t * (1 - c2)) / den, circumference: 2 * Math.PI * Math.sinh(rho), area: 4 * Math.PI * Math.sinh(rho / 2) ** 2 };
}
/** Reflect z in the geodesic through u and v. */
export function reflect(z: Z, u: Z, v: Z): Z {
  const w = toOrigin(u, v), e = div(w, conj(w));
  return mobius(u, mul(e, conj(toOrigin(u, z))));
}

// ---------- Regular tilings {p, q} ----------
export const hyperbolicPQ = (p: number, q: number) => (p - 2) * (q - 2) > 4;
/** Measures of the regular p-gon with interior angle 2π/q (right-triangle trigonometry). */
export function tileMeasures(p: number, q: number) {
  const A = Math.PI / p, B = Math.PI / q;
  return {
    angle: 2 * B,
    circumradius: Math.acosh(1 / (Math.tan(A) * Math.tan(B))),
    inradius: Math.acosh(Math.cos(B) / Math.sin(A)),
    side: 2 * Math.acosh(Math.cos(A) / Math.sin(B)),
    area: (p - 2) * Math.PI - p * 2 * B,
  };
}
export type Tile = { v: Z[]; c: Z; gen: number };
/** The tile centred at 0, with a vertex on the positive real axis turned by `turn` radians. */
export function centralTile(p: number, q: number, turn = 0): Tile {
  const r = Math.tanh(tileMeasures(p, q).circumradius / 2), v: Z[] = [];
  for (let k = 0; k < p; k++) { const t = turn + (2 * Math.PI * k) / p; v.push([r * Math.cos(t), r * Math.sin(t)]); }
  return { v, c: [0, 0], gen: 0 };
}
/** Move a tile by an isometry z ↦ mobius(a, z). */
export const moveTile = (t: Tile, a: Z): Tile => ({ v: t.v.map((z) => mobius(a, z)), c: mobius(a, t.c), gen: t.gen });
/**
 * Grow the tiling from one tile by reflecting across edges, breadth first, until tiles are smaller
 * than `minSize` (Euclidean) or `max` tiles are made. Tiles are told apart by their centres.
 */
export function tiling(seed: Tile, minSize = 0.004, max = 4000): Tile[] {
  const key = (z: Z) => `${Math.round(z[0] * 1e7)},${Math.round(z[1] * 1e7)}`;
  const seen = new Set([key(seed.c)]), out: Tile[] = [{ ...seed, gen: 0 }], queue: Tile[] = [out[0]];
  for (let h = 0; h < queue.length && out.length < max; h++) {
    const t = queue[h], n = t.v.length;
    for (let i = 0; i < n && out.length < max; i++) {
      const u = t.v[i], w = t.v[(i + 1) % n];
      const c = reflect(t.c, u, w), k = key(c);
      if (seen.has(k)) continue;
      seen.add(k);
      const nt: Tile = { v: t.v.map((z) => reflect(z, u, w)).reverse(), c, gen: t.gen + 1 };
      out.push(nt);
      let size = 0; for (const z of nt.v) size = Math.max(size, abs([z[0] - c[0], z[1] - c[1]]));
      if (size > minSize && abs(c) < 0.9999) queue.push(nt);
    }
  }
  return out;
}
