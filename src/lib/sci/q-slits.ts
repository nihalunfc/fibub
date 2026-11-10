// Young's double slit and single-slit diffraction for school (Class 12 wave optics). Plain maths, no DOM.
// Lengths in metres unless a name says otherwise. Positions x on the screen are measured from the centre line.

/** Fringe width β = λD/d. */
export const fringeWidth = (lambda: number, D: number, d: number) => (lambda * D) / d;
/** Position of the nth bright fringe x = nλD/d (n = 0, ±1, …) and the nth dark fringe x = (n − ½)λD/d (n = 1, 2, …). */
export const brightAt = (n: number, lambda: number, D: number, d: number) => (n * lambda * D) / d;
export const darkAt = (n: number, lambda: number, D: number, d: number) => ((n - 0.5) * lambda * D) / d;
/** Angular fringe width θ = λ/d (radians). */
export const angularWidth = (lambda: number, d: number) => lambda / d;
/** Single slit of width a: nth minimum at a sin θ = nλ, on the screen x = D tan θ; null when nλ > a. */
export function singleMin(n: number, lambda: number, D: number, a: number): number | null {
  const s = (n * lambda) / a;
  if (Math.abs(s) >= 1) return null;
  return D * Math.tan(Math.asin(s));
}
/** Width of the central maximum (between the first minima), ≈ 2λD/a for small angles. */
export const centralWidth = (lambda: number, D: number, a: number) => { const m = singleMin(1, lambda, D, a); return m === null ? Infinity : 2 * m; };
/** Path difference S₂P − S₁P at a point x on the screen (exact geometry), ≈ dx/D. */
export const pathDiff = (x: number, D: number, d: number) => Math.hypot(x + d / 2, D) - Math.hypot(x - d / 2, D);

const sinc = (u: number) => (Math.abs(u) < 1e-12 ? 1 : Math.sin(u) / u);
/** Relative intensity at x (0 to 1): single slit sinc²(πa sinθ/λ); double slit adds cos²(πd sinθ/λ). a = 0 means ideal narrow slits. */
export function intensity(kind: 'double' | 'single', x: number, lambda: number, D: number, d: number, a: number): number {
  const s = x / Math.hypot(x, D);
  const env = a > 0 ? sinc((Math.PI * a * s) / lambda) ** 2 : 1;
  if (kind === 'single') return env;
  return env * Math.cos((Math.PI * d * s) / lambda) ** 2;
}

/** Approximate on-screen colour of a wavelength (380 to 780 nm), as linear 0..1 RGB with the usual fall-off at the ends. */
export function wavelengthRGB(nm: number): [number, number, number] {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
  else if (nm <= 780) { r = 1; }
  const f = nm < 420 ? 0.3 + (0.7 * (nm - 380)) / 40 : nm > 700 ? 0.3 + (0.7 * (780 - nm)) / 80 : 1;
  return [Math.max(0, r * f), Math.max(0, g * f), Math.max(0, b * f)];
}
