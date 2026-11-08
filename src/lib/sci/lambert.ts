// Lambert's problem by universal variables (Curtis, Orbital Mechanics for Engineering Students, Algorithm 5.2):
// the orbit that joins two positions in a given time.

export type Vec = [number, number, number];
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a: Vec) => Math.sqrt(dot(a, a));
const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** Stumpff functions. */
export function stumpffC(z: number) { if (z > 1e-8) return (1 - Math.cos(Math.sqrt(z))) / z; if (z < -1e-8) return (Math.cosh(Math.sqrt(-z)) - 1) / -z; return 0.5 - z / 24; }
export function stumpffS(z: number) { if (z > 1e-8) { const s = Math.sqrt(z); return (s - Math.sin(s)) / s ** 3; } if (z < -1e-8) { const s = Math.sqrt(-z); return (Math.sinh(s) - s) / s ** 3; } return 1 / 6 - z / 120; }

/**
 * Velocities at r1 and r2 for a transfer of duration dt, single revolution.
 * `normal` picks the direction of motion: the transfer goes the way that keeps r1 × r2 along it (prograde).
 */
export function lambert(r1v: Vec, r2v: Vec, dt: number, mu: number, normal: Vec = [0, 0, 1]): { v1: Vec; v2: Vec } {
  const r1 = norm(r1v), r2 = norm(r2v), c = cross(r1v, r2v);
  let dth = Math.acos(Math.max(-1, Math.min(1, dot(r1v, r2v) / (r1 * r2))));
  if (dot(c, normal) < 0) dth = 2 * Math.PI - dth;
  const A = Math.sin(dth) * Math.sqrt((r1 * r2) / (1 - Math.cos(dth)));
  if (!Number.isFinite(A) || Math.abs(A) < 1e-12) throw new Error('The two positions are lined up; Lambert has no unique answer');
  const y = (z: number) => r1 + r2 + (A * (z * stumpffS(z) - 1)) / Math.sqrt(stumpffC(z));
  const F = (z: number) => { const yy = y(z); return (yy / stumpffC(z)) ** 1.5 * stumpffS(z) + A * Math.sqrt(yy) - Math.sqrt(mu) * dt; };
  // Bracket the root: z below which y < 0 is not allowed; F rises with z for a single revolution.
  const hi = 4 * Math.PI * Math.PI - 1e-6;
  let a = -4 * Math.PI * Math.PI, b = hi;
  for (let i = 0; i < 400 && !(y(a) > 0); i++) a += (hi - a) / 50; // y must be positive
  if (!(F(a) < 0 && F(b) > 0)) throw new Error('No single-revolution transfer for that time');
  for (let i = 0; i < 200; i++) { const m = (a + b) / 2; if (F(m) < 0) a = m; else b = m; if (b - a < 1e-12) break; }
  const z = (a + b) / 2, yy = y(z);
  const f = 1 - yy / r1, g = A * Math.sqrt(yy / mu), gd = 1 - yy / r2;
  return { v1: [(r2v[0] - f * r1v[0]) / g, (r2v[1] - f * r1v[1]) / g, (r2v[2] - f * r1v[2]) / g], v2: [(gd * r2v[0] - r1v[0]) / g, (gd * r2v[1] - r1v[1]) / g, (gd * r2v[2] - r1v[2]) / g] };
}
