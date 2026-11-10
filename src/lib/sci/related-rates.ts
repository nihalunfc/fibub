// Related rates for school: a ladder sliding down a wall, a balloon being blown up and a cone-shaped tank
// filling. Each story gives its shape at time t and the rates found by differentiating the link between the
// quantities (implicit differentiation with respect to t). Plain TypeScript, no DOM.
// Checked against sympy 1.14 in tests/sci-tools/related-rates.mjs.

export type Ladder = { L: number; x0: number; v: number };
/** Ladder of length L whose foot starts x0 from the wall and slides out at v (m/s). x² + y² = L². */
export function ladder(p: Ladder, t: number) {
  const x = p.x0 + p.v * t;
  if (x >= p.L) return { x: p.L, y: 0, dxdt: p.v, dydt: -Infinity, angle: 0, dAngle: NaN, done: true };
  const y = Math.sqrt(p.L * p.L - x * x);
  // 2x dx/dt + 2y dy/dt = 0  →  dy/dt = −(x/y) dx/dt.  θ = angle with the ground: cos θ = x/L → dθ/dt = −(dx/dt)/(L sin θ) = −v/y.
  return { x, y, dxdt: p.v, dydt: (-x / y) * p.v, angle: Math.acos(x / p.L), dAngle: -p.v / y, done: false };
}
/** Time when the top of the ladder reaches the ground. */
export const ladderEnd = (p: Ladder) => (p.L - p.x0) / p.v;

export type Balloon = { V0: number; q: number };
/** Balloon (a sphere) with volume V0 cm³ at t = 0, air pumped in at q cm³/s. */
export function balloon(p: Balloon, t: number) {
  const V = p.V0 + p.q * t, r = Math.cbrt((3 * V) / (4 * Math.PI));
  // V = 4/3 π r³ → dV/dt = 4π r² dr/dt.  S = 4π r² → dS/dt = 8π r dr/dt.
  const drdt = p.q / (4 * Math.PI * r * r);
  return { V, r, S: 4 * Math.PI * r * r, dVdt: p.q, drdt, dSdt: 8 * Math.PI * r * drdt };
}

export type Cone = { R: number; H: number; q: number };
/** Cone tank, point down, top radius R and height H (m), filling at q m³/min from empty. */
export function cone(p: Cone, t: number) {
  const V = p.q * t, k = p.R / p.H;
  // r = k h, V = 1/3 π k² h³ → dV/dt = π k² h² dh/dt = π r² dh/dt.
  const h = Math.cbrt((3 * V) / (Math.PI * k * k)), r = k * h;
  const full = h >= p.H;
  return { V, h: Math.min(h, p.H), r: Math.min(r, p.R), dhdt: full ? 0 : h > 0 ? p.q / (Math.PI * r * r) : Infinity, drdt: full ? 0 : h > 0 ? (k * p.q) / (Math.PI * r * r) : Infinity, full };
}
/** Time to fill the cone. */
export const coneEnd = (p: Cone) => (Math.PI * p.R * p.R * p.H) / 3 / p.q;
