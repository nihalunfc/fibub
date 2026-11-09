// Diffusion in solids: Fick's second law solutions for a semi-infinite body with a constant surface concentration
// (erfc), a thin-film (Gaussian) source, and a diffusion couple (erf); the Arrhenius law D = D0 exp(−Q/RT); case
// depth for a target concentration and time to reach a depth; and an explicit finite-difference (FTCS) solver used
// as an independent check. Textbook forms (Crank, The Mathematics of Diffusion; Shewmon, Diffusion in Solids;
// Porter and Easterling, ch. 2). Units: D in m²/s, x in m, t in s; concentrations in any one unit.

export const R_GAS = 8.314462618; // J/(mol·K), exact SI value

/** Error function, accurate to about 1e-15 (Taylor series below 2.5, continued fraction for erfc above). */
export function erf(x: number): number {
  if (Number.isNaN(x)) return NaN;
  const a = Math.abs(x);
  if (a < 2.5) {
    let term = a, sum = a; const x2 = a * a;
    for (let n = 1; n < 200; n++) { term *= -x2 / n; const add = term / (2 * n + 1); sum += add; if (Math.abs(add) < 1e-17 * Math.abs(sum)) break; }
    const r = (2 / Math.sqrt(Math.PI)) * sum;
    return x < 0 ? -r : r;
  }
  const r = 1 - erfcLarge(a);
  return x < 0 ? -r : r;
}
/** Complementary error function, keeping precision for large x. */
export function erfc(x: number): number {
  if (x >= 2) return erfcLarge(x);
  return 1 - erf(x);
}
function erfcLarge(x: number): number {
  // Lentz's continued fraction: erfc(x) = exp(−x²)/√π · 1/(x + (1/2)/(x + 1/(x + (3/2)/(x + 2/(x + ...)))))
  const tiny = 1e-300;
  let f = x, C = x, D = 0;
  for (let n = 1; n < 5000; n++) {
    const an = n / 2;
    D = x + an * D; D = Math.abs(D) < tiny ? tiny : D; C = x + an / C; C = Math.abs(C) < tiny ? tiny : C;
    D = 1 / D; const d = C * D; f *= d; if (Math.abs(d - 1) < 1e-16) break;
  }
  return Math.exp(-x * x) / Math.sqrt(Math.PI) / f;
}
/** Inverse error function for −1 < y < 1 (Halley-polished starting guess). */
export function erfinv(y: number): number {
  if (!(y > -1 && y < 1)) return y === 1 ? Infinity : y === -1 ? -Infinity : NaN;
  if (y === 0) return 0;
  // Giles' single-precision approximation as the start.
  let w = -Math.log((1 - y) * (1 + y)), x: number;
  if (w < 5) { w -= 2.5; x = 2.81022636e-08; for (const c of [3.43273939e-07, -3.5233877e-06, -4.39150654e-06, 0.00021858087, -0.00125372503, -0.00417768164, 0.246640727, 1.50140941]) x = c + x * w; }
  else { w = Math.sqrt(w) - 3; x = -0.000200214257; for (const c of [0.000100950558, 0.00134934322, -0.00367342844, 0.00573950773, -0.0076224613, 0.00943887047, 1.00167406, 2.83297682]) x = c + x * w; }
  x *= y;
  for (let i = 0; i < 6; i++) {
    const e = y > 0.9 || y < -0.9 ? (y > 0 ? (1 - y) - erfc(x) : erfc(-x) - (1 + y)) : erf(x) - y;
    const d = (2 / Math.sqrt(Math.PI)) * Math.exp(-x * x);
    x -= e / (d + x * e); // Halley: f/f' / (1 − f f''/(2f'²)) with f'' = −2x f'
  }
  return x;
}

/** D = D0 exp(−Q/RT), Q in J/mol, T in kelvin. */
export const arrhenius = (D0: number, Q: number, T: number) => D0 * Math.exp(-Q / (R_GAS * T));

export type Case =
  | { kind: 'surface'; C0: number; Cs: number }
  | { kind: 'film'; C0: number; M: number; sides: 1 | 2 }
  | { kind: 'couple'; C1: number; C2: number };

/** Concentration at x (m) after time t (s). For 'surface' and a one-sided film, x ≥ 0 is the depth below the
 *  surface; for a two-sided film x is the distance from the film; for a couple x is measured from the interface,
 *  with C1 on the negative side and C2 on the positive side. */
export function conc(c: Case, D: number, x: number, t: number): number {
  const L = 2 * Math.sqrt(D * t);
  if (c.kind === 'surface') return c.C0 + (c.Cs - c.C0) * erfc(x / L);
  if (c.kind === 'film') return c.C0 + ((c.sides === 1 ? 1 : 0.5) * c.M) / Math.sqrt(Math.PI * D * t) * Math.exp(-(x * x) / (L * L));
  return (c.C1 + c.C2) / 2 + ((c.C2 - c.C1) / 2) * erf(x / L);
}

/** Depth or position where the concentration equals Ct at time t, or a reason it never does. */
export function depthFor(c: Case, D: number, t: number, Ct: number): number | string {
  const L = 2 * Math.sqrt(D * t);
  if (c.kind === 'surface') {
    const th = (Ct - c.C0) / (c.Cs - c.C0);
    if (!(th > 0 && th < 1)) return 'The target must lie between the starting and surface concentrations.';
    return L * erfinv(1 - th);
  }
  if (c.kind === 'film') {
    const peak = conc(c, D, 0, t), excess = Ct - c.C0;
    if (!(excess > 0)) return 'The target must be above the starting concentration.';
    if (excess >= peak - c.C0) return `At this time the concentration is at most ${+peak.toPrecision(4)}, at the film itself: the target is never reached.`;
    return L * Math.sqrt(Math.log((peak - c.C0) / excess));
  }
  const z = (2 * Ct - c.C1 - c.C2) / (c.C2 - c.C1);
  if (!(z > -1 && z < 1)) return 'The target must lie between the two concentrations of the couple.';
  return L * erfinv(z);
}

/** Time for the concentration at x to reach Ct (the first time, for a film). */
export function timeFor(c: Case, D: number, x: number, Ct: number): number | string {
  if (c.kind === 'surface') {
    const th = (Ct - c.C0) / (c.Cs - c.C0);
    if (!(th > 0 && th < 1)) return 'The target must lie between the starting and surface concentrations.';
    if (x === 0) return 0;
    const z = erfinv(1 - th);
    return (x * x) / (4 * D * z * z);
  }
  if (c.kind === 'couple') {
    const z = (2 * Ct - c.C1 - c.C2) / (c.C2 - c.C1);
    if (!(z > -1 && z < 1) || z === 0 || Math.sign(z) !== Math.sign(x)) return 'At this position the concentration never passes the target: it moves from its starting value towards the mean of the two.';
    const w = erfinv(z);
    return (x * x) / (4 * D * w * w);
  }
  // Film: C(x, t) rises to a peak at t* = x²/(2D), then falls.
  if (!(Ct > c.C0)) return 'The target must be above the starting concentration.';
  if (x === 0) return 'At the film itself the concentration starts infinite and only falls.';
  const tp = (x * x) / (2 * D), peak = conc(c, D, x, tp);
  if (Ct > peak) return `At this depth the concentration peaks at ${+peak.toPrecision(4)} after ${+(tp / 3600).toPrecision(4)} h: the target is never reached.`;
  let lo = Math.log(tp) - 60, hi = Math.log(tp);
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (conc(c, D, x, Math.exp(m)) < Ct) lo = m; else hi = m; }
  return Math.exp((lo + hi) / 2);
}

/** Diffusion length √(Dt). */
export const diffLength = (D: number, t: number) => Math.sqrt(D * t);

/** Explicit (FTCS) finite-difference solution of ∂C/∂t = D ∂²C/∂x² on a grid, as an independent check of the erf
 *  solutions. Returns positions and concentrations at time t. r = DΔt/Δx² (≤ 0.5 for stability). */
export function finiteDiff(c: Case, D: number, t: number, xMax: number, n = 200, r = 0.4, film = 1e-9) {
  const couple = c.kind === 'couple', x0 = couple ? -xMax : 0, dx = (xMax - x0) / n;
  const steps = Math.max(1, Math.ceil((D * t) / (r * dx * dx))), dt = t / steps, rr = (D * dt) / (dx * dx);
  const x = Array.from({ length: n + 1 }, (_, i) => x0 + i * dx);
  let u: number[];
  if (c.kind === 'surface') u = x.map((xi, i) => (i === 0 ? c.Cs : c.C0));
  else if (c.kind === 'couple') u = x.map((xi) => (xi < -1e-15 * xMax ? c.C1 : xi > 1e-15 * xMax ? c.C2 : (c.C1 + c.C2) / 2));
  else {
    // The film is a narrow Gaussian at the given small width (one-sided: mirror at x = 0, two-sided: symmetric).
    const w = Math.max(film, dx * 1.5), amp = ((c.sides === 1 ? 2 : 1) * c.M) / (Math.sqrt(Math.PI) * w);
    u = x.map((xi) => c.C0 + amp * Math.exp(-(xi * xi) / (w * w)));
  }
  const t0 = c.kind === 'film' ? (Math.max(film, dx * 1.5) ** 2) / (4 * D) : 0; // the starting Gaussian equals the exact solution at t0
  const nSteps = c.kind === 'film' ? Math.max(1, Math.ceil((D * Math.max(t - t0, 0)) / (r * dx * dx))) : steps;
  const ddt = c.kind === 'film' ? Math.max(t - t0, 0) / nSteps : dt, q = (D * ddt) / (dx * dx);
  const v = u.slice();
  for (let s = 0; s < nSteps; s++) {
    for (let i = 1; i < n; i++) v[i] = u[i] + q * (u[i + 1] - 2 * u[i] + u[i - 1]);
    // Boundaries: fixed surface for 'surface'; zero flux (mirror) at x = 0 for a film; far ends held at the far-field value.
    if (c.kind === 'surface') { v[0] = c.Cs; v[n] = c.C0; }
    else if (c.kind === 'film') { v[0] = u[0] + 2 * q * (u[1] - u[0]); v[n] = c.C0; }
    else { v[0] = c.C1; v[n] = c.C2; }
    for (let i = 0; i <= n; i++) u[i] = v[i];
  }
  return { x, c: u, steps: nSteps, r: c.kind === 'film' ? q : rr, dx };
}
