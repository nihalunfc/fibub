// Visual double stars: separation and position angle from an image, and the apparent orbit of a binary
// from its seven orbital elements (Meeus, Astronomical Algorithms, chapter 57).

const D2R = Math.PI / 180;
const norm = (a: number) => ((a % 360) + 360) % 360;

export type VisualOrbit = { P: number; T: number; e: number; a: number; i: number; node: number; omega: number }; // years, year, -, arcsec, degrees

/** Position angle θ (degrees, north through east) and separation ρ (arcsec) at a decimal year. */
export function orbitAt(o: VisualOrbit, year: number) {
  const n = 360 / o.P, M = norm(n * (year - o.T)) * D2R;
  let E = M; for (let k = 0; k < 60; k++) { const d = (E - o.e * Math.sin(E) - M) / (1 - o.e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-13) break; }
  const r = o.a * (1 - o.e * Math.cos(E)), nu = 2 * Math.atan(Math.sqrt((1 + o.e) / (1 - o.e)) * Math.tan(E / 2));
  const u = nu + o.omega * D2R, i = o.i * D2R;
  const y = Math.sin(u) * Math.cos(i), x = Math.cos(u);
  const theta = norm(Math.atan2(y, x) / D2R + o.node), rho = r * Math.hypot(x, y);
  return { theta, rho, r, east: rho * Math.sin(theta * D2R), north: rho * Math.cos(theta * D2R) };
}

/** Decimal year (Julian epochs) of a moment in ms. */
export const yearOf = (ms: number) => 2000 + (ms / 864e5 + 2440587.5 - 2451545.0) / 365.25;
export const msOfYear = (y: number) => ((y - 2000) * 365.25 + 2451545.0 - 2440587.5) * 864e5;

/** Separation (arcsec) and position angle (degrees) of B from A measured on an image.
 *  scale: arcsec per pixel; pa0: position angle of the image's "up" direction; mirrored: east is to the right. */
export function measure(ax: number, ay: number, bx: number, by: number, scale: number, pa0 = 0, mirrored = false) {
  const dx = bx - ax, dy = -(by - ay); // image y grows downward
  const sep = Math.hypot(dx, dy) * scale;
  // With north up and east left (normal sky view), PA = atan2(−dx, dy).
  const pa = norm(Math.atan2(mirrored ? dx : -dx, dy) / D2R + pa0);
  return { sep, pa };
}

/** Plate scale from a known pair: arcsec per pixel and the image's rotation. */
export function calibrate(pxSep: number, knownSep: number) { return knownSep / pxSep; }

/** Dynamical mass of the system (solar masses) from a (arcsec), P (years) and parallax (arcsec): (a/ϖ)³/P². */
export const systemMass = (a: number, P: number, parallax: number) => (a / parallax) ** 3 / (P * P);
