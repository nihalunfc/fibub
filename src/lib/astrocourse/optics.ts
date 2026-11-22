// Sums for the astronomy course, Modules 4-6 (telescopes, observing, astrophotography). Plain TypeScript, no DOM,
// checked by tests/astrocourse.mjs. Lengths in millimetres, angles in arcseconds unless a name says otherwise.
export const ARCSEC_PER_RAD = 206264.806;

/** Thin lens or mirror: image distance for an object at distance u (same units as f); Infinity at the focus. */
export const imageDistance = (f: number, u: number) => (Math.abs(u - f) < 1e-12 ? Infinity : (f * u) / (u - f));
/** Light grasp: how many times more light an aperture D collects than a pupil p (both mm). */
export const lightGrasp = (D: number, pupil = 7) => (D / pupil) ** 2;
/** Rough faintest star visible through an aperture D (mm), from the naked-eye limit and the light grasp. */
export const scopeLimit = (D: number, nelm = 6.5, pupil = 7) => nelm + 5 * Math.log10(D / pupil);
export const focalRatio = (F: number, D: number) => F / D;
export const magnification = (F: number, fe: number) => F / fe;
export const exitPupil = (D: number, M: number) => D / M;
/** True field of view in degrees from the eyepiece's apparent field (degrees) and the magnification. */
export const trueField = (afov: number, M: number) => afov / M;
/** Useful magnification range for aperture D (mm): about D/7 (7 mm exit pupil) to 2 D (0.5 mm exit pupil). */
export const magRange = (D: number) => ({ min: D / 7, max: 2 * D });
/** Dawson's limit (arcsec): the closest equal pair of 6th-magnitude stars a skilled observer splits. */
export const dawson = (D: number) => 116 / D;
/** Rayleigh limit (arcsec) at wavelength λ (nm). */
export const rayleigh = (D: number, lambdaNm = 550) => (1.22 * lambdaNm * 1e-6 / D) * ARCSEC_PER_RAD;
/** Airy pattern intensity at angle x (arcsec) from the centre, for aperture D (mm), normalised to 1 at the centre. */
export function airy(x: number, D: number, lambdaNm = 550) {
  const v = (Math.PI * D * (x / ARCSEC_PER_RAD)) / (lambdaNm * 1e-6);
  if (Math.abs(v) < 1e-6) return 1;
  return ((2 * besselJ1(v)) / v) ** 2;
}
/** Bessel function J1 (series for small x, asymptotic for large; good to about 1e-6 for this use). */
export function besselJ1(x: number): number {
  const ax = Math.abs(x);
  if (ax < 8) {
    let sum = 0, term = x / 2; // k = 0
    for (let k = 0; k < 30; k++) { sum += term; term *= -(x * x) / (4 * (k + 1) * (k + 2)); }
    return sum;
  }
  const z = 8 / ax, y = z * z, xx = ax - 2.356194491;
  const p = 1 + y * (0.183105e-2 + y * (-0.3516396496e-4 + y * (0.2457520174e-5 + y * -0.240337019e-6)));
  const q = 0.04687499995 + y * (-0.2002690873e-3 + y * (0.8449199096e-5 + y * (-0.88228987e-6 + y * 0.105787412e-6)));
  const r = Math.sqrt(0.636619772 / ax) * (Math.cos(xx) * p - z * Math.sin(xx) * q);
  return x < 0 ? -r : r;
}
/** Declination drift (arcsec) after t seconds from a polar alignment error of err arcminutes (worst case, target near the meridian and equator). */
export const polarDrift = (errArcmin: number, tSec: number) => errArcmin * 60 * (2 * Math.PI / 86164.1) * tSec;

// ---- Module 5: what to observe
/** Apparent angular size (arcsec) of an object of diameter d at distance r (same units). */
export const angularSize = (d: number, r: number) => 2 * Math.atan(d / (2 * r)) * ARCSEC_PER_RAD;
/** Average surface brightness (mag/arcsec²) of an object of total magnitude m covering an ellipse a × b arcminutes. */
export const surfaceBrightness = (m: number, aArcmin: number, bArcmin: number) => m + 2.5 * Math.log10(Math.PI * (aArcmin * 30) * (bArcmin * 30));
/** Fractional (Pogson step) variable star estimate: V lies a/(a+b) of the way from comparison c1 to c2. */
export const fractionalEstimate = (c1: number, c2: number, a: number, b: number) => c1 + ((c2 - c1) * a) / (a + b);
/** Zenithal hourly rate (IMO standard): n meteors in teff hours, limiting magnitude lm, radiant altitude hr (deg), population index r, fraction of field obstructed k. */
export const zhr = (n: number, teff: number, lm: number, hr: number, r = 2.5, k = 0) => (n / teff) * (1 / (1 - k)) * r ** (6.5 - lm) / Math.sin((hr * Math.PI) / 180);
/** Length of the Moon's umbra (km) at the Moon, and whether a solar eclipse can be total for an Earth-Moon distance (km, centre to centre). */
export function eclipseType(moonDistKm: number) {
  const RS = 696000, RM = 1737.4, AU = 149597870.7, RE = 6371;
  const sunAng = Math.atan(RS / AU), moonAng = Math.atan(RM / (moonDistKm - RE));
  const umbraLen = (RM * AU) / (RS - RM); // length of the umbra cone from the Moon
  return { sunArcmin: (2 * sunAng * ARCSEC_PER_RAD) / 60, moonArcmin: (2 * moonAng * ARCSEC_PER_RAD) / 60, umbraLen, total: moonAng > sunAng };
}

// ---- Module 6: astrophotography
/** Image scale (arcsec per pixel) for pixel size p (µm) and focal length F (mm). */
export const imageScale = (pUm: number, F: number) => (ARCSEC_PER_RAD * pUm * 1e-3) / F;
/** Field of view (degrees) along a sensor side of s mm at focal length F mm. */
export const fieldDeg = (s: number, F: number) => (2 * Math.atan(s / (2 * F)) * 180) / Math.PI;
/** Signal-to-noise for a star: signal rate S (e⁻/s), sky rate B (e⁻/s over the aperture), dark rate Dk, read noise R (e⁻) per frame, npix pixels, t seconds, N frames. */
export function snr(S: number, B: number, t: number, R = 0, npix = 1, Dk = 0, N = 1) {
  const sig = S * t * N;
  return sig / Math.sqrt(sig + (B + Dk * npix) * t * N + N * npix * R * R);
}
/** Classic "500 rule": longest untrailed exposure (s) for focal length F on a sensor with crop factor c. */
export const rule500 = (F: number, crop = 1) => 500 / (F * crop);
/** Simplified NPF rule (Frédéric Michaud, Société Astronomique de France): aperture f-number N, pixel pitch p (µm), focal length F (mm), declination dec. */
export const npfRule = (N: number, pUm: number, F: number, dec = 0) => (35 * N + 30 * pUm) / F / Math.cos((dec * Math.PI) / 180);
/** Star trail length (arcsec) on the sky after t seconds at declination dec. */
export const trailArcsec = (t: number, dec: number) => 15.041 * t * Math.cos((dec * Math.PI) / 180);
/** Panels needed to cover a target w × h (degrees) with a field fw × fh (degrees) and fractional overlap. */
export function mosaicPanels(w: number, h: number, fw: number, fh: number, overlap = 0.15) {
  const step = (f: number) => f * (1 - overlap);
  const n = (t: number, f: number) => (t <= f ? 1 : Math.ceil((t - f) / step(f)) + 1);
  return { cols: n(w, fw), rows: n(h, fh) };
}
/** Stretches for display, input and output 0..1. */
export const stretch = {
  linear: (x: number, black = 0, white = 1) => Math.max(0, Math.min(1, (x - black) / (white - black))),
  gamma: (x: number, g = 2.2) => Math.max(0, x) ** (1 / g),
  asinh: (x: number, beta = 10) => Math.asinh(beta * Math.max(0, x)) / Math.asinh(beta),
};
/** Calibrate one pixel: (light − dark) / (normalised flat − its dark). */
export const calibrate = (light: number, dark: number, flat: number, flatDark: number, flatMean: number) => (light - dark) / ((flat - flatDark) / flatMean);
