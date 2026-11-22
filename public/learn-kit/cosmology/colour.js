// Colours for light: the visible colour of a wavelength (Dan Bruton's well-known approximation, 1996) and the
// colour a blackbody looks at a temperature (a fit to the CIE blackbody locus, after Tanner Helland, 2012).
// Both are approximations for pictures, not for measurement.
export function waveRGB(nm) {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
  else if (nm <= 780) { r = 1; }
  // fade at the edges of vision
  const f = nm < 380 || nm > 780 ? 0 : nm < 420 ? 0.3 + (0.7 * (nm - 380)) / 40 : nm > 700 ? 0.3 + (0.7 * (780 - nm)) / 80 : 1;
  const c = (v) => Math.round(255 * Math.pow(v * f, 0.8));
  return [c(r), c(g), c(b)];
}
export const waveCSS = (nm, a = 1) => { const [r, g, b] = waveRGB(nm); return `rgba(${r},${g},${b},${a})`; };
export const isVisible = (nm) => nm >= 380 && nm <= 750;

export function blackbodyRGB(T) {
  const t = T / 100;
  let r, g, b;
  if (t <= 66) { r = 255; g = 99.4708025861 * Math.log(t) - 161.1195681661; }
  else { r = 329.698727446 * Math.pow(t - 60, -0.1332047592); g = 288.1221695283 * Math.pow(t - 60, -0.0755148492); }
  if (t >= 66) b = 255; else if (t <= 19) b = 0; else b = 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  const c = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return [c(r), c(g), c(b)];
}
export const blackbodyCSS = (T) => { const [r, g, b] = blackbodyRGB(T); return `rgb(${r},${g},${b})`; };
