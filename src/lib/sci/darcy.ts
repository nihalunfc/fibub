// Groundwater flow basics: Darcy's law, seepage velocity, intrinsic permeability, the hydraulic gradient from
// three or more wells, grain-size statistics and the Hazen estimate of K. SI units inside. Plain maths; no DOM.

export const G = 9.80665;
export const DARCY = 9.869233e-13; // m² in one darcy

/** Water viscosity (Pa·s), Vogel-type fit μ = 2.414e-5 · 10^(247.8 / (T + 133.15)), T in °C; about ±2.5 % from 0 to 100 °C. */
export const waterViscosity = (tC: number) => 2.414e-5 * 10 ** (247.8 / (tC + 273.15 - 140));
/** Water density (kg/m³), a widely used approximate fit for 0 to 40 °C. */
export const waterDensity = (tC: number) => 1000 * (1 - ((tC + 288.9414) / (508929.2 * (tC + 68.12963))) * (tC - 3.9863) ** 2);

/** Darcy: specific discharge q = K·i (m/s), discharge Q = q·A, seepage velocity v = q/ne, travel time over L. */
export function darcy(K: number, i: number, A: number, ne: number, L?: number) {
  const q = K * i, Q = q * A, v = ne > 0 ? q / ne : NaN;
  return { q, Q, v, time: L !== undefined && v > 0 ? L / v : NaN };
}

/** Intrinsic permeability k (m²) from K (m/s) and back, at temperature tC. */
export const kFromK = (K: number, tC: number) => (K * waterViscosity(tC)) / (waterDensity(tC) * G);
export const KFromk = (k: number, tC: number) => (k * waterDensity(tC) * G) / waterViscosity(tC);

/**
 * Hydraulic gradient from wells at (x, y) with heads h: plane h = a + b·x + c·y (exact for three wells, least squares
 * for more). Returns |∇h| and the direction water flows (down the gradient) as a bearing in degrees from +y (north),
 * clockwise.
 */
export function gradient3(x: number[], y: number[], h: number[]) {
  const n = x.length;
  if (n < 3) throw new Error('Need at least three wells');
  const mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n, mh = h.reduce((s, v) => s + v, 0) / n;
  let sxx = 0, syy = 0, sxy = 0, sxh = 0, syh = 0;
  for (let i = 0; i < n; i++) { const dx = x[i] - mx, dy = y[i] - my, dh = h[i] - mh; sxx += dx * dx; syy += dy * dy; sxy += dx * dy; sxh += dx * dh; syh += dy * dh; }
  const det = sxx * syy - sxy * sxy;
  if (!(Math.abs(det) > 1e-12 * (sxx * syy + 1e-300))) throw new Error('The wells lie on one straight line, so the gradient direction cannot be found');
  const b = (sxh * syy - syh * sxy) / det, c = (syh * sxx - sxh * sxy) / det, a = mh - b * mx - c * my;
  const mag = Math.hypot(b, c);
  const bearing = ((Math.atan2(-b, -c) * 180) / Math.PI + 360) % 360;
  const resid = h.map((hi, i) => hi - (a + b * x[i] + c * y[i]));
  return { a, b, c, i: mag, bearing, rms: Math.sqrt(resid.reduce((s, r) => s + r * r, 0) / n) };
}

/** Grain size d (same unit as the sizes) at a given percent passing, interpolating linearly in log size. */
export function dAt(size: number[], pass: number[], p: number) {
  const pts = size.map((s, i) => ({ s, p: pass[i] })).filter((q) => q.s > 0 && Number.isFinite(q.p)).sort((a, b) => a.s - b.s);
  for (let i = 0; i + 1 < pts.length; i++) {
    const A = pts[i], B = pts[i + 1];
    if ((A.p <= p && B.p >= p) && B.p > A.p) return 10 ** (Math.log10(A.s) + ((p - A.p) / (B.p - A.p)) * (Math.log10(B.s) - Math.log10(A.s)));
  }
  return NaN;
}

/** d10, d30, d60, uniformity Cu = d60/d10 and curvature Cc = d30² / (d10·d60). */
export function gradation(size: number[], pass: number[]) {
  const d10 = dAt(size, pass, 10), d30 = dAt(size, pass, 30), d60 = dAt(size, pass, 60);
  return { d10, d30, d60, Cu: d60 / d10, Cc: (d30 * d30) / (d10 * d60) };
}

/** Hazen: K (cm/s) = C · d10² with d10 in cm. C is about 100 for clean sand (textbooks give roughly 40 to 150). */
export const hazen = (d10mm: number, C = 100) => (C * (d10mm / 10) ** 2) / 100; // returns m/s
