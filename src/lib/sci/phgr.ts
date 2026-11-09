// Geodesics of the Schwarzschild metric (non-rotating black hole or the outside of any spherical mass), in units
// with G = c = 1 and lengths in M (= GM/c²). Plain maths, no DOM.

/** GM☉/c² in metres and GM☉/c³ in seconds (IAU nominal solar mass parameter, rounded). */
export const M_SUN_M = 1476.625, M_SUN_S = 4.925491e-6;

/** Complete elliptic integral of the first kind K(m), m = k², by the arithmetic-geometric mean. */
export function ellipK(m: number): number {
  let a = 1, b = Math.sqrt(1 - m);
  for (let i = 0; i < 60 && Math.abs(a - b) > 1e-16 * a; i++) [a, b] = [(a + b) / 2, Math.sqrt(a * b)];
  return Math.PI / (2 * a);
}

/** Circular orbit at radius r (in M): energy and angular momentum per unit mass, periods, stability. */
export function circular(r: number) {
  if (!(r > 3)) return null;
  const E = (1 - 2 / r) / Math.sqrt(1 - 3 / r), L = Math.sqrt(r) / Math.sqrt(1 - 3 / r);
  const Tcoord = 2 * Math.PI * Math.pow(r, 1.5), Tproper = Tcoord * Math.sqrt(1 - 3 / r);
  return { E, L, Tcoord, Tproper, stable: r >= 6, bound: E < 1, v: 1 / Math.sqrt(r - 2) };
}

/** Effective potential for massive particles, V² = (1 − 2/r)(1 + L²/r²), so that E² = ṙ² + V². */
export const veff2 = (r: number, L: number) => (1 - 2 / r) * (1 + (L * L) / (r * r));

export type Bound = { E: number; L: number; u1: number; u2: number; u3: number; dphi: number; precession: number; weak: number; e: number; p: number };
/**
 * Bound orbit between periapsis rp and apoapsis ra (in M). With u = 1/r, (du/dφ)² = 2(u − u1)(u2 − u)(u3 − u) where
 * u1 = 1/ra, u2 = 1/rp and u3 = 1/2 − u1 − u2, giving 1/L² = u1u2 + (u1 + u2)u3 and E² = 1 − 2u1u2u3L². The angle
 * from one periapsis to the next is 4K(k²)/√(2(u3 − u1)) with k² = (u2 − u1)/(u3 − u1). Null if the orbit is not stable.
 */
export function bound(rp: number, ra: number): Bound | null {
  const u1 = 1 / ra, u2 = 1 / rp, u3 = 0.5 - u1 - u2;
  if (!(ra >= rp && rp > 2) || !(u3 > u2)) return null;
  const L = 1 / Math.sqrt(u1 * u2 + (u1 + u2) * u3), E = Math.sqrt(1 - 2 * u1 * u2 * u3 * L * L);
  const m = (u2 - u1) / (u3 - u1), dphi = (4 * ellipK(m)) / Math.sqrt(2 * (u3 - u1));
  const a = (rp + ra) / 2, e = (ra - rp) / (ra + rp), p = a * (1 - e * e);
  return { E, L, u1, u2, u3, dphi, precession: dphi - 2 * Math.PI, weak: (6 * Math.PI) / p, e, p };
}

/** Integrate the orbit equation u'' = 1/L² − u + 3u² (massive) or u'' = −u + 3u² (light, k = 0) by RK4 in φ. */
export function trace(u0: number, du0: number, L2inv: number, phiMax: number, h = 0.002, stop?: (u: number) => boolean): [number, number][] {
  const f = (u: number) => L2inv - u + 3 * u * u;
  let u = u0, v = du0, phi = 0;
  const pts: [number, number][] = [[phi, u]];
  while (phi < phiMax) {
    const k1u = v, k1v = f(u), k2u = v + (h / 2) * k1v, k2v = f(u + (h / 2) * k1u), k3u = v + (h / 2) * k2v, k3v = f(u + (h / 2) * k2u), k4u = v + h * k3v, k4v = f(u + h * k3u);
    u += (h / 6) * (k1u + 2 * k2u + 2 * k3u + k4u); v += (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v); phi += h;
    pts.push([phi, u]);
    if (stop && stop(u)) break;
  }
  return pts;
}

/** Light ray with impact parameter b (in M): captured if b < 3√3, else the closest approach and the deflection angle. */
export function lightRay(b: number) {
  const bc = 3 * Math.sqrt(3);
  if (!(b > bc)) return { captured: true, bc, rmin: NaN, deflection: NaN, weak: 4 / b };
  // Closest approach: the smallest positive root of 1/b² − u² + 2u³ = 0 (u below 1/3), by bisection.
  const g = (u: number) => 1 / (b * b) - u * u + 2 * u * u * u;
  let lo = 0, hi = 1 / 3;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (g(m) > 0) lo = m; else hi = m; }
  const u0 = (lo + hi) / 2;
  // Deflection = 2∫₀^{u0} du/√g(u) − π, with u = u0(1 − s²) so the integrand stays finite at the turning point.
  const n = 20000, hs = 1 / n;
  const F = (s: number) => { const u = u0 * (1 - s * s), gu = g(u); return s === 0 ? (2 * u0) / Math.sqrt(u0 * (2 * u0 - 6 * u0 * u0)) : (2 * u0 * s) / Math.sqrt(Math.max(gu, 1e-300)); };
  let sum = F(0) + F(1);
  for (let i = 1; i < n; i++) sum += F(i * hs) * (i % 2 ? 4 : 2);
  const I = (sum * hs) / 3;
  return { captured: false, bc, rmin: 1 / u0, deflection: 2 * I - Math.PI, weak: 4 / b };
}
