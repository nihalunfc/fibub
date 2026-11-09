// Flat-plate boundary layer at zero pressure gradient: Blasius laminar solution (integrated here), 1/7-power-law
// turbulent layer, and the mixed laminar-turbulent plate drag. Schlichting, Boundary-Layer Theory; White, Viscous Fluid Flow.

/** Integrate the Blasius equation f''' + ½ f f'' = 0 (RK4) from η = 0 with f''(0) = s; returns f'(ηmax). */
function blasiusShoot(s: number, etaMax = 10, h = 0.005) {
  let f = 0, fp = 0, fpp = s; const out: [number, number, number][] = [[0, 0, 0]];
  const d = (a: number, b: number, c: number): [number, number, number] => [b, c, -0.5 * a * c];
  for (let e = 0; e < etaMax - 1e-12; e += h) {
    const k1 = d(f, fp, fpp), k2 = d(f + (h / 2) * k1[0], fp + (h / 2) * k1[1], fpp + (h / 2) * k1[2]);
    const k3 = d(f + (h / 2) * k2[0], fp + (h / 2) * k2[1], fpp + (h / 2) * k2[2]), k4 = d(f + h * k3[0], fp + h * k3[1], fpp + h * k3[2]);
    f += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); fp += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); fpp += (h / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
    out.push([e + h, f, fp]);
  }
  return { fp, out };
}
/** The Blasius solution by shooting (bisection on f''(0) so that f'(∞) = 1). */
export function blasius() {
  let lo = 0.2, hi = 0.5;
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; blasiusShoot(m).fp > 1 ? (hi = m) : (lo = m); }
  const s = (lo + hi) / 2, { out } = blasiusShoot(s);
  // η where f' = 0.99, displacement and momentum integrals (trapezoid).
  let eta99 = NaN, dstar = 0, theta = 0;
  for (let i = 1; i < out.length; i++) {
    const [e0, , u0] = out[i - 1], [e1, , u1] = out[i], h = e1 - e0;
    dstar += (h * (1 - u0 + 1 - u1)) / 2; theta += (h * (u0 * (1 - u0) + u1 * (1 - u1))) / 2;
    if (Number.isNaN(eta99) && u0 < 0.99 && u1 >= 0.99) eta99 = e0 + ((0.99 - u0) / (u1 - u0)) * h;
  }
  return { fpp0: s, eta99, dstar, theta, profile: out.map((r) => [r[0], r[2]] as [number, number]) };
}
let B: ReturnType<typeof blasius> | null = null;
export const blasiusCached = () => (B ??= blasius());

export type Mode = 'auto' | 'laminar' | 'turbulent';
export type TurbLaw = 'power' | 'schlichting';

/** Local boundary layer at distance x (m) for free stream U (m/s) and kinematic viscosity nu (m²/s). */
export function local(x: number, U: number, nu: number, mode: Mode, reCrit: number) {
  const Re = (U * x) / nu, lam = mode === 'laminar' || (mode === 'auto' && Re < reCrit), b = blasiusCached();
  if (lam) {
    const s = x / Math.sqrt(Re);
    return { Re, laminar: true, delta: b.eta99 * s, dstar: b.dstar * s, theta: b.theta * s, cf: (2 * b.fpp0) / Math.sqrt(Re), H: b.dstar / b.theta };
  }
  const delta = 0.37 * x * Re ** -0.2;
  return { Re, laminar: false, delta, dstar: delta / 8, theta: (7 * delta) / 72, cf: 0.0592 * Re ** -0.2, H: (1 / 8) / (7 / 72) };
}

/** Average drag coefficient of one side of a plate of length L. */
export function plateCD(ReL: number, mode: Mode, reCrit: number, law: TurbLaw = 'power') {
  const lam = (r: number) => (2 * 2 * blasiusCached().fpp0) / Math.sqrt(r); // 1.328 / √Re
  const turb = (r: number) => (law === 'power' ? 0.074 * r ** -0.2 : 0.455 / Math.log10(r) ** 2.58);
  if (mode === 'laminar') return { CD: lam(ReL), A: 0 };
  if (mode === 'turbulent') return { CD: turb(ReL), A: 0 };
  if (ReL <= reCrit) return { CD: lam(ReL), A: 0 };
  // Mixed: turbulent from the leading edge, minus the turbulent drag that the laminar part does not have.
  const A = reCrit * (turb(reCrit) - lam(reCrit));
  return { CD: turb(ReL) - A / ReL, A };
}

/** Rounded fluid properties near 20 °C (general values; editable on the page). */
export const FLUIDS = [
  { id: 'air', name: 'Air, 20 °C, 1 atm', rho: 1.204, nu: 1.516e-5 },
  { id: 'water', name: 'Water, 20 °C', rho: 998, nu: 1.004e-6 },
  { id: 'sea', name: 'Sea water, 20 °C', rho: 1025, nu: 1.05e-6 },
  { id: 'oil', name: 'Light oil (rounded, typical)', rho: 870, nu: 1.15e-4 },
];
