// Phone clinometer: from the phone's orientation angles (W3C DeviceOrientation: alpha, beta, gamma in degrees,
// rotation R = Rz(alpha)·Rx(beta)·Ry(gamma) taking device axes to earth axes east, north, up) to the strike and dip of
// a plane the phone lies on, or the trend and plunge of a line along the phone's long edge. Plain maths, no DOM.

const D = Math.PI / 180;
export type V3 = [number, number, number];
export type M3 = [V3, V3, V3];
export const norm360 = (a: number) => ((a % 360) + 360) % 360;
const pad3 = (a: number) => String(Math.round(norm360(a)) % 360).padStart(3, '0');
export { pad3 };

/** Device-to-earth rotation matrix (rows: east, north, up) for alpha, beta, gamma in degrees. */
export function rotation(alpha: number, beta: number, gamma: number): M3 {
  const cA = Math.cos(alpha * D), sA = Math.sin(alpha * D), cB = Math.cos(beta * D), sB = Math.sin(beta * D), cG = Math.cos(gamma * D), sG = Math.sin(gamma * D);
  return [
    [cA * cG - sA * sB * sG, -cB * sA, cG * sA * sB + cA * sG],
    [cG * sA + cA * sB * sG, cA * cB, sA * sG - cA * cG * sB],
    [-cB * sG, sB, cB * cG],
  ];
}

/** Column k of a matrix: where device axis k (0 = x across the screen, 1 = y along it, 2 = z out of the screen) points. */
export const axis = (R: M3, k: 0 | 1 | 2): V3 => [R[0][k], R[1][k], R[2][k]];

/** Alpha for a compass heading (clockwise from north, as iOS gives it): alpha runs anticlockwise. */
export const alphaFromHeading = (h: number) => norm360(360 - h);

/** Plane with normal n (east, north, up): dip and dip direction (clockwise from north), strike by the right-hand rule. */
export function planeOf(n: V3, decl = 0) {
  let [e, nn, u] = n;
  if (u < 0) { e = -e; nn = -nn; u = -u; }
  const len = Math.hypot(e, nn, u), h = Math.hypot(e, nn);
  const dip = Math.atan2(h, u) / D;
  const dipdir = h < 1e-9 * len ? 0 : norm360(Math.atan2(e, nn) / D + decl);
  return { dip, dipdir, strike: norm360(dipdir - 90) };
}

/** Line along direction v (east, north, up): trend (clockwise from north) and plunge, pointing down. */
export function lineOf(v: V3, decl = 0) {
  let [e, n, u] = v;
  if (u > 0) { e = -e; n = -n; u = -u; }
  const len = Math.hypot(e, n, u), h = Math.hypot(e, n);
  const plunge = Math.atan2(-u, h) / D;
  const trend = h < 1e-9 * len ? 0 : norm360(Math.atan2(e, n) / D + decl);
  return { trend, plunge };
}

/** Plane the phone lies on (back flat on the surface; screen up or down). */
export const planeFromAngles = (a: number, b: number, g: number, decl = 0) => planeOf(axis(rotation(a, b, g), 2), decl);
/** Line along the phone's long edge. */
export const lineFromAngles = (a: number, b: number, g: number, decl = 0) => lineOf(axis(rotation(a, b, g), 1), decl);

/**
 * Mean of unit vectors as axes (a vector and its opposite are the same orientation), with the spread: the largest
 * and the root-mean-square angle (degrees) of the vectors from the mean.
 */
export function meanAxis(vs: V3[]) {
  if (!vs.length) throw new Error('No readings to average');
  const ref = vs[0]; let s: V3 = [0, 0, 0];
  for (const v of vs) { const sg = v[0] * ref[0] + v[1] * ref[1] + v[2] * ref[2] < 0 ? -1 : 1; s = [s[0] + sg * v[0], s[1] + sg * v[1], s[2] + sg * v[2]]; }
  const L = Math.hypot(...s), m: V3 = [s[0] / L, s[1] / L, s[2] / L];
  const ang = vs.map((v) => Math.acos(Math.min(1, Math.abs(v[0] * m[0] + v[1] * m[1] + v[2] * m[2]) / Math.hypot(...v))) / D);
  return { mean: m, max: Math.max(...ang), rms: Math.sqrt(ang.reduce((a, b) => a + b * b, 0) / ang.length), n: vs.length };
}

/** Angles that put the phone flat on a plane (dip direction, dip; magnetic), turned by `spin` degrees about its normal. */
export function anglesForPlane(dipdir: number, dip: number, spin = 0) {
  // Build the device frame: z = upward normal; y = the up-dip direction turned by spin about z; x = y × z.
  const z: V3 = [Math.sin(dip * D) * Math.sin(dipdir * D), Math.sin(dip * D) * Math.cos(dipdir * D), Math.cos(dip * D)];
  const updip: V3 = dip < 1e-9 ? [0, 1, 0] : [-Math.cos(dip * D) * Math.sin(dipdir * D), -Math.cos(dip * D) * Math.cos(dipdir * D), Math.sin(dip * D)];
  const xz = cross(updip, z), c = Math.cos(spin * D), s = Math.sin(spin * D);
  const y: V3 = [updip[0] * c - xz[0] * s, updip[1] * c - xz[1] * s, updip[2] * c - xz[2] * s];
  return anglesFromMatrix([[0, 0, 0], [0, 0, 0], [0, 0, 0]].map((_, r) => { const x = cross(y, z); return [x[r], y[r], z[r]] as V3; }) as M3);
}
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** alpha, beta, gamma (beta in −180..180, gamma in −90..90, as the spec gives them) for a rotation matrix. */
export function anglesFromMatrix(R: M3) {
  const sB = Math.max(-1, Math.min(1, R[2][1]));
  let beta = Math.asin(sB) / D, alpha: number, gamma: number;
  const cB = Math.cos(beta * D);
  if (Math.abs(cB) < 1e-9) { gamma = 0; alpha = Math.atan2(R[1][0], R[0][0]) / D; }
  else { alpha = Math.atan2(-R[0][1], R[1][1]) / D; gamma = Math.atan2(-R[2][0], R[2][2]) / D; }
  // Keep gamma in −90..90 by the equivalent set (beta → 180 − beta, gamma ± 180, alpha + 180).
  if (gamma > 90 || gamma < -90) { beta = (beta >= 0 ? 180 : -180) - beta; gamma = gamma > 0 ? gamma - 180 : gamma + 180; alpha = alpha + 180; }
  return { alpha: norm360(alpha), beta, gamma };
}
