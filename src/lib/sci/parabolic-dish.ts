// A parabolic dish for school (Class 11 conic sections): the mirror x² = 4ay (focus (0, a)), rays parallel to the
// axis reflecting through the focus, a spherical (circle) mirror with the same near-axis focus for comparison,
// and the focal length of a real dish from its width and depth. Plain TypeScript, no DOM.

export type V = [number, number];

/** Height of the dish x² = 4ay at x. */
export const dishY = (x: number, a: number) => (x * x) / (4 * a);

/** Reflect direction d off a surface with normal n (any length): d − 2(d·n̂)n̂. */
export function reflect(d: V, n: V): V {
  const l = Math.hypot(n[0], n[1]), u: V = [n[0] / l, n[1] / l], k = d[0] * u[0] + d[1] * u[1];
  return [d[0] - 2 * k * u[0], d[1] - 2 * k * u[1]];
}

/** A ray coming straight down at x0 hits the parabola: hit point and reflected direction. */
export function parabolaRay(x0: number, a: number): { hit: V; out: V } {
  const hit: V = [x0, dishY(x0, a)];
  return { hit, out: reflect([0, -1], [x0 / (2 * a), -1]) };
}

/** Circle mirror of radius R = 2a with its lowest point at the origin (centre (0, 2a)), same near-axis focus a. */
export function circleRay(x0: number, a: number): { hit: V; out: V } | null {
  const R = 2 * a;
  if (Math.abs(x0) >= R) return null;
  const hit: V = [x0, R - Math.sqrt(R * R - x0 * x0)];
  return { hit, out: reflect([0, -1], [hit[0], hit[1] - R]) };
}

/** Where a ray from p along d crosses the axis x = 0 (its height), NaN if it runs parallel to the axis. */
export function axisCrossing(p: V, d: V): number {
  if (Math.abs(d[0]) < 1e-12) return NaN;
  const t = -p[0] / d[0];
  return p[1] + t * d[1];
}

/** A ray leaving the focus (0, a) toward the dish point at x0 reflects to this direction (straight up for a parabola). */
export function fromFocus(x0: number, a: number): V {
  const hit: V = [x0, dishY(x0, a)], d: V = [hit[0], hit[1] - a], l = Math.hypot(d[0], d[1]);
  return reflect([d[0] / l, d[1] / l], [x0 / (2 * a), -1]);
}

/** Focal length of a dish from its full width D (rim to rim) and depth d: f = D²/(16 d). */
export const focusFromDish = (D: number, d: number) => (D * D) / (16 * d);
/** Depth of a dish of width D and focal length f: d = D²/(16 f). */
export const depthOf = (D: number, f: number) => (D * D) / (16 * f);
