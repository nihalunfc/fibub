// Two-body problem in a plane: orbital elements of the relative orbit, exact positions at any time by the universal-variable
// Kepler solver (works for ellipses, parabolas and hyperbolas), and an independent direct RK4 integration of both bodies
// used to check energy, angular momentum and the analytic positions. SI units inside. No DOM.

export type V2 = [number, number];
export const G_SI = 6.6743e-11; // CODATA 2018

/** Stumpff functions C(z) and S(z). */
export function stumpff(z: number): [number, number] {
  if (z > 1e-6) { const s = Math.sqrt(z); return [(1 - Math.cos(s)) / z, (s - Math.sin(s)) / (s * s * s)]; }
  if (z < -1e-6) { const s = Math.sqrt(-z); return [(Math.cosh(s) - 1) / -z, (Math.sinh(s) - s) / (s * s * s)]; }
  return [1 / 2 - z / 24 + (z * z) / 720, 1 / 6 - z / 120 + (z * z) / 5040];
}

/** Elements of the relative orbit (r, v of body 2 relative to body 1, μ = G(m1 + m2)). */
export function elements(mu: number, r: V2, v: V2) {
  const rn = Math.hypot(r[0], r[1]), v2 = v[0] * v[0] + v[1] * v[1];
  const eps = v2 / 2 - mu / rn, h = r[0] * v[1] - r[1] * v[0];
  const rv = r[0] * v[0] + r[1] * v[1];
  const ex = ((v2 - mu / rn) * r[0] - rv * v[0]) / mu, ey = ((v2 - mu / rn) * r[1] - rv * v[1]) / mu, e = Math.hypot(ex, ey);
  const p = (h * h) / mu, a = Math.abs(eps) > 1e-300 ? -mu / (2 * eps) : Infinity;
  const rp = p / (1 + e), ra = e < 1 ? p / (1 - e) : Infinity;
  const T = eps < 0 ? 2 * Math.PI * Math.sqrt(a ** 3 / mu) : Infinity;
  const kind = e < 1e-9 ? 'circle' : eps < 0 ? 'ellipse' : Math.abs(e - 1) < 1e-9 ? 'parabola' : 'hyperbola';
  const omega = Math.atan2(ey, ex); // direction of periapsis
  const vesc = Math.sqrt((2 * mu) / rn);
  return { eps, h, e, ex, ey, p, a, rp, ra, T, kind, omega, vesc, r: rn, v: Math.sqrt(v2), dir: h >= 0 ? 1 : -1 };
}

/** Relative position and velocity after time t from (r0, v0), universal-variable Kepler (Curtis, Orbital Mechanics, ch. 3). */
export function kepler(mu: number, r0: V2, v0: V2, t: number): { r: V2; v: V2 } {
  if (t === 0) return { r: [...r0] as V2, v: [...v0] as V2 };
  const rn = Math.hypot(r0[0], r0[1]), vr = (r0[0] * v0[0] + r0[1] * v0[1]) / rn, sm = Math.sqrt(mu);
  const alpha = 2 / rn - (v0[0] ** 2 + v0[1] ** 2) / mu; // 1/a
  let x = alpha > 1e-12 ? sm * Math.abs(alpha) * t : sm * t / rn; // initial guess
  if (alpha > 1e-12) { const T = (2 * Math.PI) / (sm * alpha ** 1.5); const tt = ((t % T) + T) % T; x = sm * alpha * tt; t = tt; }
  for (let i = 0; i < 200; i++) {
    const z = alpha * x * x, [C, S] = stumpff(z);
    const F = ((rn * vr) / sm) * x * x * C + (1 - alpha * rn) * x ** 3 * S + rn * x - sm * t;
    const dF = ((rn * vr) / sm) * x * (1 - z * S) + (1 - alpha * rn) * x * x * C + rn;
    let dx = F / dF;
    if (!Number.isFinite(dx)) break;
    if (Math.abs(dx) > Math.abs(x) + 1) dx = Math.sign(dx) * (Math.abs(x) + 1) * 0.5; // damp wild steps on hyperbolas
    x -= dx;
    if (Math.abs(dx) < 1e-13 * (Math.abs(x) + 1e-30)) break;
  }
  const z = alpha * x * x, [C, S] = stumpff(z);
  const f = 1 - (x * x / rn) * C, g = t - (x ** 3 / sm) * S;
  const r: V2 = [f * r0[0] + g * v0[0], f * r0[1] + g * v0[1]], r1 = Math.hypot(r[0], r[1]);
  const fd = (sm / (r1 * rn)) * (alpha * x ** 3 * S - x), gd = 1 - ((x * x) / r1) * C;
  return { r, v: [fd * r0[0] + gd * v0[0], fd * r0[1] + gd * v0[1]] };
}

export type Body = { m: number; p: V2; v: V2 };

/** The whole system: centre of mass, reduced problem and conserved quantities (in the centre-of-mass frame). */
export function system(b1: Body, b2: Body, G = G_SI) {
  const M = b1.m + b2.m, mu = G * M;
  const cm: V2 = [(b1.m * b1.p[0] + b2.m * b2.p[0]) / M, (b1.m * b1.p[1] + b2.m * b2.p[1]) / M];
  const vcm: V2 = [(b1.m * b1.v[0] + b2.m * b2.v[0]) / M, (b1.m * b1.v[1] + b2.m * b2.v[1]) / M];
  const r: V2 = [b2.p[0] - b1.p[0], b2.p[1] - b1.p[1]], v: V2 = [b2.v[0] - b1.v[0], b2.v[1] - b1.v[1]];
  const el = elements(mu, r, v), red = (b1.m * b2.m) / M;
  return { M, mu, cm, vcm, r, v, el, reduced: red, E: red * el.eps, L: red * el.h };
}

/** Positions of both bodies at time t, in the centre-of-mass frame (the centre of mass at the origin, at rest). */
export function positionsAt(b1: Body, b2: Body, t: number, G = G_SI) {
  const s = system(b1, b2, G), k = kepler(s.mu, s.r, s.v, t);
  return { p1: [(-b2.m / s.M) * k.r[0], (-b2.m / s.M) * k.r[1]] as V2, p2: [(b1.m / s.M) * k.r[0], (b1.m / s.M) * k.r[1]] as V2, r: k.r, v: k.v };
}

/** Total energy and angular momentum (about the centre of mass) of two bodies given in any frame. */
export function conserved(b1: Body, b2: Body, G = G_SI) {
  const M = b1.m + b2.m, vcm = [(b1.m * b1.v[0] + b2.m * b2.v[0]) / M, (b1.m * b1.v[1] + b2.m * b2.v[1]) / M], cm = [(b1.m * b1.p[0] + b2.m * b2.p[0]) / M, (b1.m * b1.p[1] + b2.m * b2.p[1]) / M];
  let K = 0, L = 0;
  for (const b of [b1, b2]) { const vx = b.v[0] - vcm[0], vy = b.v[1] - vcm[1], x = b.p[0] - cm[0], y = b.p[1] - cm[1]; K += 0.5 * b.m * (vx * vx + vy * vy); L += b.m * (x * vy - y * vx); }
  const d = Math.hypot(b2.p[0] - b1.p[0], b2.p[1] - b1.p[1]);
  return { E: K - (G * b1.m * b2.m) / d, L };
}

/**
 * Direct RK4 integration of both bodies (not using the reduced problem) for time `tEnd` in `steps` steps of equal
 * "eccentric" length: the step shrinks near close approach (dt ∝ r^1.5). Returns the drift in energy and angular momentum
 * and the final positions, to compare with the exact Kepler solution.
 */
export function integrate(b1: Body, b2: Body, tEnd: number, steps = 4000, G = G_SI) {
  const m1 = b1.m, m2 = b2.m;
  let s = [b1.p[0], b1.p[1], b1.v[0], b1.v[1], b2.p[0], b2.p[1], b2.v[0], b2.v[1]];
  const der = (u: number[]) => { const dx = u[4] - u[0], dy = u[5] - u[1], r3 = Math.hypot(dx, dy) ** 3; return [u[2], u[3], (G * m2 * dx) / r3, (G * m2 * dy) / r3, u[6], u[7], (-G * m1 * dx) / r3, (-G * m1 * dy) / r3]; };
  const add = (u: number[], k: number[], h: number) => u.map((x, i) => x + h * k[i]);
  const c0 = conserved(b1, b2, G), sy = system(b1, b2, G);
  const r0 = Math.hypot(sy.r[0], sy.r[1]), base = tEnd / steps, scale = Number.isFinite(sy.el.a) && sy.el.a > 0 ? sy.el.a : r0;
  let t = 0, maxE = 0, maxL = 0, n = 0;
  while (t < tEnd && n < steps * 50) {
    const r = Math.hypot(s[4] - s[0], s[5] - s[1]);
    const h = Math.min(tEnd - t, base * Math.min(1, (r / scale) ** 1.5));
    const k1 = der(s), k2 = der(add(s, k1, h / 2)), k3 = der(add(s, k2, h / 2)), k4 = der(add(s, k3, h));
    s = s.map((x, i) => x + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    t += h; n++;
    const c = conserved({ m: m1, p: [s[0], s[1]], v: [s[2], s[3]] }, { m: m2, p: [s[4], s[5]], v: [s[6], s[7]] }, G);
    maxE = Math.max(maxE, Math.abs((c.E - c0.E) / c0.E)); maxL = Math.max(maxL, Math.abs(c0.L) > 0 ? Math.abs((c.L - c0.L) / c0.L) : Math.abs(c.L));
  }
  return { p1: [s[0], s[1]] as V2, p2: [s[4], s[5]] as V2, v1: [s[2], s[3]] as V2, v2: [s[6], s[7]] as V2, dE: maxE, dL: maxL, steps: n, t };
}
