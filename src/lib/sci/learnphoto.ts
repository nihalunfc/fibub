// Photoelectric effect for the school tool photoelectric-lab: Einstein's equation K_max = hf − φ, stopping
// potential, threshold frequency and wavelength, a simple teaching model of the current against voltage, and a
// straight-line fit of stopping potential against frequency that gives h/e and the work function.
// Plain maths, no DOM.
export const H = 6.62607015e-34; // J s, exact
export const E_CHARGE = 1.602176634e-19; // C, exact
export const C_LIGHT = 299792458; // m/s, exact
/** Work functions in eV: typical rounded values (measured values vary with the surface). */
export const METALS = [
  { id: 'cs', name: 'Caesium', phi: 2.1 },
  { id: 'k', name: 'Potassium', phi: 2.3 },
  { id: 'na', name: 'Sodium', phi: 2.4 },
  { id: 'zn', name: 'Zinc', phi: 4.3 },
  { id: 'cu', name: 'Copper', phi: 4.7 },
  { id: 'pt', name: 'Platinum', phi: 5.6 },
];
export const photonEV = (f: number) => (H * f) / E_CHARGE;
export const freqFromNm = (nm: number) => C_LIGHT / (nm * 1e-9);
export const nmFromFreq = (f: number) => (C_LIGHT / f) * 1e9;
/** Largest kinetic energy of the electrons, eV (0 or less means no emission). */
export const kmaxEV = (f: number, phi: number) => photonEV(f) - phi;
/** Stopping potential in volts (0 when there is no emission). */
export const stoppingV = (f: number, phi: number) => Math.max(0, kmaxEV(f, phi));
export const thresholdFreq = (phi: number) => (phi * E_CHARGE) / H;
export const thresholdNm = (phi: number) => nmFromFreq(thresholdFreq(phi));
/**
 * Teaching model of the photocurrent (arbitrary units, 100 = saturation at full brightness) at collector voltage V.
 * Saturation current ∝ intensity. Electrons leave with energies spread evenly from 0 to K_max, so a retarding voltage
 * stops a growing share of them: the current falls in a straight line to zero at −V₀. A small positive voltage
 * collects the last few that would have missed the collector.
 */
export function current(V: number, f: number, phi: number, intensity: number) {
  const k = kmaxEV(f, phi);
  if (k <= 0 || intensity <= 0) return 0;
  const sat = 100 * intensity;
  if (V >= 0) return sat * (0.85 + 0.15 * (1 - Math.exp(-V / 0.6)));
  if (-V >= k) return 0;
  return sat * 0.85 * (1 + V / k);
}
/** Least-squares straight line y = a + b x. */
export function lineFit(xs: number[], ys: number[]) {
  const n = xs.length, mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  const b = sxy / sxx; return { a: my - b * mx, b };
}
/** Colour of visible light of a wavelength (nm), as r, g, b 0..255 (rough, for drawing). Outside 380..750 nm: null. */
export function nmToRgb(nm: number): [number, number, number] | null {
  if (nm < 380 || nm > 750) return null;
  let r = 0, g = 0, b = 0;
  if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else r = 1;
  const f = nm < 420 ? 0.3 + (0.7 * (nm - 380)) / 40 : nm > 700 ? 0.3 + (0.7 * (750 - nm)) / 50 : 1;
  return [Math.round(255 * r * f), Math.round(255 * g * f), Math.round(255 * b * f)];
}
