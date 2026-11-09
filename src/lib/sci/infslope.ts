// Infinite slope factor of safety for a shallow slide parallel to the ground surface, with a water table at a height
// m·z above the slip surface and seepage parallel to the slope (the textbook Skempton and DeLory form), effective
// cohesion, root cohesion and effective friction angle. For study, not a slope stability assessment.
//   FS = [c' + c_r + ((1 − m)γ + m(γsat − γw)) z cos²β tan φ'] / [((1 − m)γ + m γsat) z sin β cos β]
// with z the vertical depth of the slip surface, β the slope angle, γ the unit weight above the water table and
// γsat below it. Units: kPa and kN/m³ (any consistent set works).

export type Slope = {
  c: number; // effective cohesion c' (kPa)
  cr: number; // root cohesion (kPa)
  phi: number; // effective friction angle φ' (degrees)
  gamma: number; // unit weight above the water table (kN/m³)
  gsat: number; // saturated unit weight (kN/m³)
  gw: number; // unit weight of water (kN/m³)
  z: number; // vertical depth of the slip surface (m)
  beta: number; // slope angle (degrees)
  m: number; // water table height above the slip surface ÷ z, 0 (dry) to 1 (water at the surface)
};
const R = Math.PI / 180;

/** The parts of the factor of safety (per unit area of slip surface, kPa). */
export function parts(s: Slope) {
  const b = s.beta * R, cos = Math.cos(b), sin = Math.sin(b);
  const W = ((1 - s.m) * s.gamma + s.m * s.gsat) * s.z; // vertical stress at the slip depth
  const sigma = W * cos * cos, u = s.gw * s.m * s.z * cos * cos, tau = W * sin * cos;
  const resist = s.c + s.cr + (sigma - u) * Math.tan(s.phi * R);
  return { sigma, u, sigmaEff: sigma - u, tau, resist, cohesion: s.c + s.cr, friction: (sigma - u) * Math.tan(s.phi * R) };
}

/** Factor of safety; Infinity on flat ground. */
export function fs(s: Slope): number {
  const p = parts(s);
  return p.tau > 0 ? p.resist / p.tau : Infinity;
}

function bisect(f: (x: number) => number, a: number, b: number): number {
  let fa = f(a);
  for (let i = 0; i < 200; i++) { const m = (a + b) / 2, fm = f(m); if ((fm > 0) === (fa > 0)) { a = m; fa = fm; } else b = m; if (b - a < 1e-12) break; }
  return (a + b) / 2;
}

/**
 * Slope angles (degrees) where FS = 1, going up from flat ground. With cohesion, FS is high on gentle and on very
 * steep slopes (the soil column gets thin), so there may be two; `min` is the slope angle with the lowest FS.
 */
export function criticalAngles(s: Slope) {
  const f = (b: number) => fs({ ...s, beta: b }) - 1;
  const roots: number[] = [];
  let min = { beta: 0, fs: Infinity }, prev = 0.01, fp = f(prev);
  for (let b = 0.05; b <= 89.99; b += 0.05) {
    const v = f(b);
    if (v + 1 < min.fs) min = { beta: b, fs: v + 1 };
    if ((v > 0) !== (fp > 0)) roots.push(bisect(f, prev, b));
    prev = b; fp = v;
  }
  if (Number.isFinite(min.fs)) { const g = (b: number) => fs({ ...s, beta: b }); let a = Math.max(0.01, min.beta - 0.05), c = Math.min(89.99, min.beta + 0.05); for (let i = 0; i < 100; i++) { const m1 = a + (c - a) / 3, m2 = c - (c - a) / 3; if (g(m1) < g(m2)) c = m2; else a = m1; } min = { beta: (a + c) / 2, fs: g((a + c) / 2) }; }
  return { roots, min };
}

/** The water table ratio m at which FS = 1 (FS falls as m rises); null when FS = 1 is not reached between 0 and 1. */
export function criticalM(s: Slope): { m: number; always: boolean; never: boolean } {
  // FS is a ratio of two straight lines in m; FS(m) = 1 is linear.
  const b = s.beta * R, cos = Math.cos(b), sin = Math.sin(b), t = Math.tan(s.phi * R);
  const N0 = s.c + s.cr + s.gamma * s.z * cos * cos * t, N1 = (s.gsat - s.gw - s.gamma) * s.z * cos * cos * t;
  const D0 = s.gamma * s.z * sin * cos, D1 = (s.gsat - s.gamma) * s.z * sin * cos;
  // N0 + m N1 = D0 + m D1
  const m = (D0 - N0) / (N1 - D1);
  const f0 = fs({ ...s, m: 0 }), f1 = fs({ ...s, m: 1 });
  return { m, always: f0 < 1 && f1 < 1, never: f0 >= 1 && f1 >= 1 };
}

/** The depth z at which FS = 1 for this slope and water ratio; null if FS stays above 1 at any depth, or without cohesion (then FS does not depend on depth). */
export function criticalDepth(s: Slope): number | null {
  const b = s.beta * R, cos = Math.cos(b), sin = Math.sin(b), t = Math.tan(s.phi * R);
  const per = ((1 - s.m) * s.gamma + s.m * s.gsat) * sin * cos - ((1 - s.m) * s.gamma + s.m * (s.gsat - s.gw)) * cos * cos * t;
  if (!(per > 0) || !(s.c + s.cr > 0)) return null;
  return (s.c + s.cr) / per;
}

/** Check the inputs; returns a plain message or ''. */
export function check(s: Slope): string {
  if (![s.c, s.cr, s.phi, s.gamma, s.gsat, s.gw, s.z, s.beta, s.m].every(Number.isFinite)) return 'Fill in every box with a number.';
  if (s.c < 0 || s.cr < 0) return 'Cohesion and root cohesion are zero or more.';
  if (!(s.phi >= 0 && s.phi < 90)) return 'The friction angle is from 0 up to (not including) 90°.';
  if (!(s.beta > 0 && s.beta < 90)) return 'The slope angle is above 0 and below 90°.';
  if (!(s.z > 0)) return 'The depth of the slip surface is above zero.';
  if (!(s.m >= 0 && s.m <= 1)) return 'm is from 0 (dry) to 1 (water table at the ground surface).';
  if (!(s.gamma > 0 && s.gsat > 0 && s.gw > 0)) return 'Unit weights are above zero.';
  if (s.gsat < s.gw) return 'The saturated unit weight should be more than the unit weight of water.';
  return '';
}
