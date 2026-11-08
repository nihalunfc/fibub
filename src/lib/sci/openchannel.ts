// Uniform open-channel flow by Manning's equation, critical depth, specific energy, and weir discharge. No DOM.

export const G = 9.80665;
export type Shape =
  | { kind: 'rect'; b: number }
  | { kind: 'trap'; b: number; z1: number; z2: number }
  | { kind: 'tri'; z1: number; z2: number }
  | { kind: 'circ'; D: number };

/** Flow area A, wetted perimeter P and top width T at depth y. */
export function section(s: Shape, y: number) {
  if (s.kind === 'rect') return { A: s.b * y, P: s.b + 2 * y, T: s.b };
  if (s.kind === 'trap' || s.kind === 'tri') {
    const b = s.kind === 'trap' ? s.b : 0;
    return { A: b * y + 0.5 * (s.z1 + s.z2) * y * y, P: b + y * (Math.sqrt(1 + s.z1 * s.z1) + Math.sqrt(1 + s.z2 * s.z2)), T: b + (s.z1 + s.z2) * y };
  }
  const r = s.D / 2, yy = Math.min(y, s.D), th = 2 * Math.acos(1 - yy / r); // central angle of the wetted arc
  return { A: (r * r * (th - Math.sin(th))) / 2, P: r * th, T: yy >= s.D ? 0 : 2 * Math.sqrt(yy * (s.D - yy)) };
}

/** Manning discharge: Q = (k/n) A R^(2/3) √S, with k = 1 for SI and 1.486 for US customary units. */
export function manningQ(s: Shape, y: number, n: number, S: number, k = 1) {
  const { A, P } = section(s, y);
  return P > 0 ? (k / n) * A * Math.pow(A / P, 2 / 3) * Math.sqrt(S) : 0;
}

/** Depth of full flow or the channel's maximum, for searching. */
const maxDepth = (s: Shape, guess: number) => (s.kind === 'circ' ? s.D : guess);

/** Normal depth for a discharge Q by bisection (for a circular pipe, the lower root below the peak at y/D ≈ 0.938). */
export function normalDepth(s: Shape, Q: number, n: number, S: number, k = 1) {
  let lo = 0, hi: number;
  if (s.kind === 'circ') {
    hi = peakDepth(s, n, S, k);
    if (Q > manningQ(s, hi, n, S, k)) return NaN;
  } else {
    hi = 1; while (manningQ(s, hi, n, S, k) < Q && hi < 1e6) hi *= 2;
  }
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (manningQ(s, m, n, S, k) < Q) lo = m; else hi = m; if (hi - lo < 1e-12 * hi) break; }
  return (lo + hi) / 2;
}

/** Depth of the largest Manning discharge in a circular pipe (golden-section search). */
export function peakDepth(s: Shape & { kind: 'circ' }, n: number, S: number, k = 1) {
  let a = 0.5 * s.D, b = s.D; const gr = (Math.sqrt(5) - 1) / 2;
  for (let i = 0; i < 100; i++) { const c = b - gr * (b - a), d = a + gr * (b - a); if (manningQ(s, c, n, S, k) > manningQ(s, d, n, S, k)) b = d; else a = c; }
  return (a + b) / 2;
}

/** Critical depth: Q² T / (g A³) = 1 (Froude number 1), by bisection. g in the unit system's length per s². */
export function criticalDepth(s: Shape, Q: number, g = G) {
  const F = (y: number) => { const { A, T } = section(s, y); return (Q * Q * T) / (g * A * A * A) - 1; };
  let lo = 1e-9, hi = s.kind === 'circ' ? s.D * 0.999999 : 1;
  if (s.kind !== 'circ') while (F(hi) > 0 && hi < 1e6) hi *= 2;
  else if (F(hi) > 0) return NaN;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (F(m) > 0) lo = m; else hi = m; if (hi - lo < 1e-12 * hi) break; }
  return (lo + hi) / 2;
}

/** Everything at depth y for discharge Q: velocity, hydraulic radius and depth, Froude number, specific energy and bed shear. */
export function flowAt(s: Shape, y: number, Q: number, S: number, g = G, rhoG = 9806.65) {
  const { A, P, T } = section(s, y), V = Q / A, R = A / P, D = T > 0 ? A / T : NaN;
  return { A, P, T, R, V, Dh: D, Fr: T > 0 ? V / Math.sqrt(g * D) : NaN, E: y + (V * V) / (2 * g), tau: rhoG * R * S };
}

// Weirs. H is the head above the crest (or the notch vertex), measured upstream. Units consistent with g.
/** Sharp-crested rectangular weir: Q = Cd (2/3) √(2g) L′ H^1.5, with Francis's end contraction L′ = L − 0.1 · contractions · H. */
export const rectWeir = (L: number, H: number, Cd = 0.62, contractions = 0, g = G) => Cd * (2 / 3) * Math.sqrt(2 * g) * Math.max(0, L - 0.1 * contractions * H) * Math.pow(H, 1.5);
/** Sharp-crested V-notch (triangular) weir: Q = Cd (8/15) √(2g) tan(θ/2) H^2.5. */
export const vNotch = (thetaDeg: number, H: number, Cd = 0.58, g = G) => Cd * (8 / 15) * Math.sqrt(2 * g) * Math.tan((thetaDeg * Math.PI) / 360) * Math.pow(H, 2.5);
/** Broad-crested weir with critical flow on the crest: Q = Cd L √g (2H/3)^1.5. */
export const broadWeir = (L: number, H: number, Cd = 0.95, g = G) => Cd * L * Math.sqrt(g) * Math.pow((2 * H) / 3, 1.5);
/** Cipolletti (trapezoidal 1 : 4 sides) weir, written as a rectangular weir without contraction: Q = Cd (2/3) √(2g) L H^1.5 with Cd ≈ 0.63. */
export const cipolletti = (L: number, H: number, Cd = 0.63, g = G) => Cd * (2 / 3) * Math.sqrt(2 * g) * L * Math.pow(H, 1.5);

/** The head that gives discharge Q for any weir formula f(H), by bisection. */
export function headFor(f: (H: number) => number, Q: number) {
  let lo = 0, hi = 1;
  while (f(hi) < Q && hi < 1e6) hi *= 2;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (f(m) < Q) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
