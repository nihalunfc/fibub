// Huygens' principle for school (Class 12 wave optics): a plane wavefront meets a flat boundary; every point it
// touches sends out a secondary wavelet, and the common tangent of the wavelets is the new wavefront. Plain maths.
// Geometry: the boundary is the x axis, medium 1 above (y < 0, screen coordinates), medium 2 below (y > 0). The
// wavefront first touches the boundary at A = (0, 0) and last at C = (w, 0). Time t runs from 0 to 1 over the
// interval τ the wavefront takes to sweep from A to C, so the far end B travels BC = w sin i = v1 τ.

const R2D = 180 / Math.PI;
/** Refraction angle (degrees) from sin r / sin i = v2 / v1; null when there is no refracted wave (total internal reflection). */
export function refractedAngle(iDeg: number, v1: number, v2: number): number | null {
  const s = (v2 / v1) * Math.sin(iDeg / R2D);
  return s > 1 ? null : Math.asin(s) * R2D;
}
export type Wavelet = { x: number; r: number };
/** The wavelets alive at time t (0..1): n + 1 sources evenly spaced from A to C, in the medium of speed v (v1 = 1 units). */
export function wavelets(w: number, iDeg: number, v1: number, v: number, t: number, n: number): Wavelet[] {
  const out: Wavelet[] = [], tau = (w * Math.sin(iDeg / R2D)) / v1;
  for (let k = 0; k <= n; k++) { const tk = k / n; if (t >= tk) out.push({ x: tk * w, r: v * tau * (t - tk) }); }
  return out;
}
/** Where the wavefront meets the boundary at time t. */
export const contact = (w: number, t: number) => t * w;
/**
 * The new wavefront at time t: the line from the contact point P = (tw, 0) tangent to every wavelet. Its angle with
 * the boundary is r with sin r = ρ / (P − x) for any wavelet of radius ρ centred at x; this is the same for all of
 * them, which is why one straight wavefront forms. Returns the tangent point on the first wavelet (from A).
 */
export function envelope(w: number, iDeg: number, v1: number, v: number, t: number, below = true): { angle: number; tangent: [number, number] } | null {
  const tau = (w * Math.sin(iDeg / R2D)) / v1, rho = v * tau * t, P = t * w;
  if (t <= 0 || rho > P) return null;
  const s = rho / P, ang = Math.asin(s);
  // Tangent point: from A along the ray direction (sin ang, ±cos ang) at distance ρ.
  return { angle: ang * R2D, tangent: [rho * Math.sin(ang), (below ? 1 : -1) * rho * Math.cos(ang)] };
}
/** Distance from a point to the line through two points (to check tangency). */
export function distToLine(p: [number, number], a: [number, number], b: [number, number]): number {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  return Math.abs(dy * (p[0] - a[0]) - dx * (p[1] - a[1])) / Math.hypot(dx, dy);
}
