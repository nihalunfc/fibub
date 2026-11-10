// Optical fibre for school (Class 12 ray optics): critical angle at the core-cladding boundary, numerical aperture,
// acceptance angle, and a 2D ray traced along a fibre that is straight or has one 90° bend. Plain maths, no DOM.
// Drawing units are arbitrary (the picture is not to scale); the core is 2a wide.

const R2D = 180 / Math.PI;
/** Critical angle (degrees) for light in a medium of index n1 meeting one of index n2 < n1; null if n1 ≤ n2. */
export const critical = (n1: number, n2: number) => (n1 > n2 ? Math.asin(n2 / n1) * R2D : null);
/** Numerical aperture NA = √(n1² − n2²). */
export const numericalAperture = (n1: number, n2: number) => Math.sqrt(Math.max(0, n1 * n1 - n2 * n2));
/** Acceptance half-angle (degrees) in a medium of index n0: sin θa = NA / n0, capped at 90°. */
export const acceptance = (n1: number, n2: number, n0 = 1) => { const s = numericalAperture(n1, n2) / n0; return s >= 1 ? 90 : Math.asin(s) * R2D; };

export type Pt = [number, number];
export type Trace = { pts: Pt[]; reflections: number; fate: 'out' | 'leak' | 'lost'; leakDir?: Pt; minIncidence: number };
export type Fibre = { a: number; L1: number; R: number | null; L2: number };

/** Total length of the fibre's centre line. */
export const fibreLength = (f: Fibre) => f.L1 + (f.R === null ? 0 : (Math.PI / 2) * f.R + f.L2);

/**
 * Trace a ray that enters the flat end face (x = 0) at height y0 from air (index n0) at angle thetaDeg to the axis
 * (positive = aimed upward). Straight fibre: core |y| ≤ a from x = 0 to L1. Bent fibre: straight to x = L1, then a
 * quarter circle of centre-line radius R bending upward (centre at (L1, R)), then straight up for L2.
 * At every wall hit the angle of incidence is compared with the critical angle: total internal reflection, or
 * the ray leaks into the cladding and the trace stops.
 */
export function traceFibre(f: Fibre, n1: number, n2: number, thetaDeg: number, y0 = 0, n0 = 1, maxHits = 2000): Trace {
  const { a, L1, R, L2 } = f;
  const sr = (n0 * Math.sin(thetaDeg / R2D)) / n1, r = Math.asin(sr);
  let p: Pt = [0, y0], d: Pt = [Math.cos(r), Math.sin(r)];
  const pts: Pt[] = [p];
  const crit = critical(n1, n2);
  let reflections = 0, minInc = 90;
  const eps = 1e-9;
  for (let k = 0; k < maxHits; k++) {
    let best = Infinity, normal: Pt | null = null, exit = false;
    const tryLine = (t: number, ok: boolean, nrm: Pt | null, isExit = false) => { if (ok && t > eps && t < best) { best = t; normal = nrm; exit = isExit; } };
    // Straight section 1: walls y = ±a for 0 ≤ x ≤ L1.
    if (Math.abs(d[1]) > 1e-15) for (const s of [1, -1]) { const t = (s * a - p[1]) / d[1], x = p[0] + t * d[0]; tryLine(t, x >= -eps && x <= L1 + eps, [0, s]); }
    if (R === null) {
      if (d[0] > 1e-15) { const t = (L1 - p[0]) / d[0], y = p[1] + t * d[1]; tryLine(t, Math.abs(y) <= a + eps, null, true); }
    } else {
      // Bend: circles of radius R − a (inner) and R + a (outer) around (L1, R), for the quarter where x ≥ L1, y ≤ R.
      const cx = L1, cy = R;
      for (const [rad, sign] of [[R - a, -1], [R + a, 1]] as [number, number][]) {
        const ox = p[0] - cx, oy = p[1] - cy, B = ox * d[0] + oy * d[1], C = ox * ox + oy * oy - rad * rad, D = B * B - C;
        if (D < 0) continue;
        for (const t of [-B - Math.sqrt(D), -B + Math.sqrt(D)]) {
          const x = p[0] + t * d[0], y = p[1] + t * d[1];
          if (x >= cx - eps && y <= cy + eps) tryLine(t, true, [sign * (x - cx) / rad, sign * (y - cy) / rad]);
        }
      }
      // Straight section 2: walls x = L1 + R ± a for R ≤ y ≤ R + L2, exit face y = R + L2.
      if (Math.abs(d[0]) > 1e-15) for (const s of [1, -1]) { const t = (L1 + R + s * a - p[0]) / d[0], y = p[1] + t * d[1]; tryLine(t, y >= R - eps && y <= R + L2 + eps, [s, 0]); }
      if (d[1] > 1e-15) { const t = (R + L2 - p[1]) / d[1], x = p[0] + t * d[0]; tryLine(t, Math.abs(x - (L1 + R)) <= a + eps, null, true); }
    }
    if (!Number.isFinite(best)) return { pts, reflections, fate: 'lost', minIncidence: minInc };
    p = [p[0] + best * d[0], p[1] + best * d[1]];
    pts.push(p);
    if (exit) return { pts, reflections, fate: 'out', minIncidence: minInc };
    const nv = normal as unknown as Pt;
    const dn = d[0] * nv[0] + d[1] * nv[1];
    const inc = Math.acos(Math.min(1, Math.abs(dn))) * R2D;
    minInc = Math.min(minInc, inc);
    if (crit === null || inc < crit) {
      // Refracted out into the cladding: n1 sin i = n2 sin t, along the outward normal (nv points outward).
      const st = (n1 / n2) * Math.sin(inc / R2D), ct = Math.sqrt(Math.max(0, 1 - st * st));
      const tang: Pt = [d[0] - dn * nv[0], d[1] - dn * nv[1]], tl = Math.hypot(tang[0], tang[1]) || 1;
      const leakDir: Pt = [ct * nv[0] + st * tang[0] / tl, ct * nv[1] + st * tang[1] / tl];
      return { pts, reflections, fate: 'leak', leakDir, minIncidence: minInc };
    }
    d = [d[0] - 2 * dn * nv[0], d[1] - 2 * dn * nv[1]];
    reflections++;
  }
  return { pts, reflections, fate: 'lost', minIncidence: minInc };
}
