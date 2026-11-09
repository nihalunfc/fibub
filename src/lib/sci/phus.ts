// Diagnostic ultrasound physics: wavelength, acoustic impedance, reflection and transmission at a boundary
// (normal and oblique incidence), attenuation, resolution, near field, timing and the Doppler shift.
// Plain TypeScript, no DOM. Material values offered in the tool are rounded and illustrative.

export type Medium = { name: string; rho: number; c: number; alpha: number }; // kg/m³, m/s, dB/(cm·MHz)

/** Rounded, illustrative teaching values (they vary with temperature, frequency and from source to source). */
export const MEDIA: Medium[] = [
  { name: 'Water (about 20 °C)', rho: 1000, c: 1480, alpha: 0.002 },
  { name: 'Soft tissue (average)', rho: 1060, c: 1540, alpha: 0.5 },
  { name: 'Fat', rho: 950, c: 1450, alpha: 0.6 },
  { name: 'Muscle', rho: 1070, c: 1580, alpha: 1 },
  { name: 'Blood', rho: 1060, c: 1570, alpha: 0.2 },
  { name: 'Liver', rho: 1060, c: 1570, alpha: 0.5 },
  { name: 'Bone (cortical)', rho: 1900, c: 4000, alpha: 10 },
  { name: 'Air', rho: 1.2, c: 343, alpha: 10 },
];

/** Acoustic impedance Z = ρc in rayl (kg m⁻² s⁻¹). */
export const impedance = (m: Medium) => m.rho * m.c;
/** Wavelength in mm for c in m/s and f in MHz. */
export const wavelength = (c: number, fMHz: number) => c / (fMHz * 1e6) * 1000;

/**
 * Reflection at a flat boundary from medium 1 into medium 2 at incidence angle θi (degrees, from the normal).
 * r is the pressure amplitude coefficient, R the intensity (power) reflection coefficient and T = 1 − R.
 * Beyond the critical angle (when c2 > c1) the wave is totally reflected.
 */
export function boundary(m1: Medium, m2: Medium, thetaDeg = 0) {
  const Z1 = impedance(m1), Z2 = impedance(m2), ti = (thetaDeg * Math.PI) / 180;
  const s = (Math.sin(ti) * m2.c) / m1.c;
  const critical = m2.c > m1.c ? (Math.asin(m1.c / m2.c) * 180) / Math.PI : null;
  if (s >= 1) return { Z1, Z2, r: 1, R: 1, T: 0, thetaT: NaN, critical, total: true };
  const tt = Math.asin(s), a = Z2 * Math.cos(ti), b = Z1 * Math.cos(tt);
  const r = (a - b) / (a + b), R = r * r;
  return { Z1, Z2, r, R, T: 1 - R, thetaT: (tt * 180) / Math.PI, critical, total: false };
}

/** One-way attenuation in dB over depth (cm) at f (MHz) for α in dB/(cm·MHz), assuming loss ∝ frequency. */
export const attenuationDb = (alpha: number, fMHz: number, depthCm: number) => alpha * fMHz * depthCm;
/** Half-value layer (cm): the depth that halves the intensity, 10 log10 2 ≈ 3.01 dB. */
export const halfValueLayer = (alpha: number, fMHz: number) => (10 * Math.log10(2)) / (alpha * fMHz);
/** Deepest echo (cm) inside a dynamic range DR (dB), counting the round trip. */
export const penetration = (alpha: number, fMHz: number, drDb: number) => drDb / (2 * alpha * fMHz);
/** Fraction of intensity left after L dB. */
export const fromDb = (db: number) => Math.pow(10, -db / 10);

/** Axial resolution (mm) = spatial pulse length / 2 = cycles × λ / 2. */
export const axialRes = (cycles: number, c: number, fMHz: number) => (cycles * wavelength(c, fMHz)) / 2;
/** Near-field (Fresnel) length (mm) of a flat circular transducer of diameter D (mm): D² / (4λ). */
export const nearField = (Dmm: number, c: number, fMHz: number) => (Dmm * Dmm) / (4 * wavelength(c, fMHz));
/** Far-field half-angle of divergence (degrees): sin θ = 1.22 λ / D; NaN if λ is too large. */
export const divergence = (Dmm: number, c: number, fMHz: number) => { const s = (1.22 * wavelength(c, fMHz)) / Dmm; return s < 1 ? (Math.asin(s) * 180) / Math.PI : NaN; };
/** Round-trip echo time (µs) to depth d (cm). */
export const echoTime = (dCm: number, c: number) => ((2 * dCm) / 100 / c) * 1e6;
/** Highest pulse repetition frequency (Hz) that lets echoes from depth d (cm) return first. */
export const maxPrf = (dCm: number, c: number) => c / (2 * (dCm / 100));
/** Doppler shift (Hz) for a reflector moving at v (m/s) at angle θ (degrees) to the beam: 2 f v cos θ / c. */
export const doppler = (fMHz: number, v: number, thetaDeg: number, c: number) => (2 * fMHz * 1e6 * v * Math.cos((thetaDeg * Math.PI) / 180)) / c;
/** Highest velocity (m/s) measurable without aliasing at a PRF (Hz): Nyquist limit PRF/2. */
export const vMaxDoppler = (prf: number, fMHz: number, thetaDeg: number, c: number) => (prf / 2) * c / (2 * fMHz * 1e6 * Math.cos((thetaDeg * Math.PI) / 180));
