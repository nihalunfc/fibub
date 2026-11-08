// Redshift and velocity: relativistic Doppler, the optical (cz) and radio conventions, and line positions.

export const C_KMS = 299792.458;
export type Convention = 'relativistic' | 'optical' | 'radio';

/** Line-of-sight velocity in km/s for a redshift, by convention. */
export function velocity(z: number, conv: Convention) {
  if (conv === 'optical') return C_KMS * z;
  if (conv === 'radio') return C_KMS * (1 - 1 / (1 + z));
  const s = (1 + z) ** 2;
  return (C_KMS * (s - 1)) / (s + 1);
}
/** Redshift for a velocity in km/s, by convention. */
export function redshift(v: number, conv: Convention) {
  const b = v / C_KMS;
  if (conv === 'optical') { if (b <= -1) throw new Error('With the optical convention the velocity must be above −c'); return b; }
  if (conv === 'radio') { if (b >= 1) throw new Error('With the radio convention the velocity must be below c'); return 1 / (1 - b) - 1; }
  if (Math.abs(b) >= 1) throw new Error('A relativistic velocity must be below the speed of light');
  return Math.sqrt((1 + b) / (1 - b)) - 1;
}
/** Lorentz factor for the relativistic velocity of a redshift. */
export const gamma = (z: number) => { const b = velocity(z, 'relativistic') / C_KMS; return 1 / Math.sqrt(1 - b * b); };

export type Line = { id: string; name: string; nm: number };
// Rest wavelengths: vacuum for the ultraviolet and radio, air for the optical lines as astronomers usually quote them.
export const LINES: Line[] = [
  { id: 'lya', name: 'Lyman α', nm: 121.567 },
  { id: 'civ', name: 'C IV', nm: 154.9 },
  { id: 'mgii', name: 'Mg II', nm: 279.8 },
  { id: 'oii', name: '[O II]', nm: 372.7 },
  { id: 'cak', name: 'Ca II K', nm: 393.366 },
  { id: 'cah', name: 'Ca II H', nm: 396.847 },
  { id: 'hb', name: 'Hβ', nm: 486.133 },
  { id: 'oiii', name: '[O III]', nm: 500.684 },
  { id: 'mgb', name: 'Mg b', nm: 517.27 },
  { id: 'nad', name: 'Na D', nm: 589.3 },
  { id: 'ha', name: 'Hα', nm: 656.281 },
  { id: 'sii', name: '[S II]', nm: 671.6 },
  { id: 'cat', name: 'Ca II triplet', nm: 854.2 },
  { id: 'paa', name: 'Paschen α', nm: 1875.1 },
  { id: 'co10', name: 'CO (1–0)', nm: 2.6007576e6 },
  { id: 'hi', name: 'H I 21 cm', nm: 2.1106114054e8 },
];
/** Frequency in GHz of a wavelength in nm (vacuum). */
export const nmToGhz = (nm: number) => (C_KMS * 1e3) / (nm * 1e-9) / 1e9;
export const ghzToNm = (ghz: number) => (C_KMS * 1e3) / (ghz * 1e9) / 1e-9;
/** Redshift from an observed and a rest wavelength (any one unit). */
export const zFromLambda = (obs: number, rest: number) => obs / rest - 1;
export const zFromFreq = (obs: number, rest: number) => rest / obs - 1;
