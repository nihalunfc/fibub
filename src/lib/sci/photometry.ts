// Magnitudes and fluxes across photometric bands. Vega zero points: Johnson-Cousins UBVRI and JHK
// from Bessell, Castelli and Plez (1998, Table A2); 2MASS from Cohen, Wheaton and Megeath (2003);
// WISE from Jarrett et al. (2011). AB magnitudes use 3631 Jy for every band (Oke and Gunn 1983).

export type Band = { id: string; name: string; system: string; lam: number /* µm, effective */; vegaJy: number | null };
export const BANDS: Band[] = [
  { id: 'U', name: 'U', system: 'Johnson-Cousins', lam: 0.366, vegaJy: 1790 },
  { id: 'B', name: 'B', system: 'Johnson-Cousins', lam: 0.438, vegaJy: 4063 },
  { id: 'V', name: 'V', system: 'Johnson-Cousins', lam: 0.545, vegaJy: 3636 },
  { id: 'R', name: 'R', system: 'Johnson-Cousins', lam: 0.641, vegaJy: 3064 },
  { id: 'I', name: 'I', system: 'Johnson-Cousins', lam: 0.798, vegaJy: 2416 },
  { id: 'J2', name: 'J', system: '2MASS', lam: 1.235, vegaJy: 1594 },
  { id: 'H2', name: 'H', system: '2MASS', lam: 1.662, vegaJy: 1024 },
  { id: 'K2', name: 'Ks', system: '2MASS', lam: 2.159, vegaJy: 666.7 },
  { id: 'W1', name: 'W1', system: 'WISE', lam: 3.4, vegaJy: 309.54 },
  { id: 'W2', name: 'W2', system: 'WISE', lam: 4.6, vegaJy: 171.79 },
  { id: 'W3', name: 'W3', system: 'WISE', lam: 12, vegaJy: 31.67 },
  { id: 'W4', name: 'W4', system: 'WISE', lam: 22, vegaJy: 8.36 },
  { id: 'u', name: 'u', system: 'SDSS (AB)', lam: 0.3551, vegaJy: null },
  { id: 'g', name: 'g', system: 'SDSS (AB)', lam: 0.4686, vegaJy: null },
  { id: 'r', name: 'r', system: 'SDSS (AB)', lam: 0.6166, vegaJy: null },
  { id: 'i', name: 'i', system: 'SDSS (AB)', lam: 0.7480, vegaJy: null },
  { id: 'z', name: 'z', system: 'SDSS (AB)', lam: 0.8932, vegaJy: null },
  { id: 'custom', name: 'Any wavelength', system: '', lam: 0.55, vegaJy: null },
];

const C = 2.99792458e8, H = 6.62607015e-34, AB_JY = 3631;
export type Unit = 'Jy' | 'mJy' | 'uJy' | 'cgs_nu' | 'si_nu' | 'cgs_lam' | 'si_um' | 'phot' | 'ab' | 'vega';
export const UNITS: { id: Unit; label: string }[] = [
  { id: 'vega', label: 'magnitude (Vega)' }, { id: 'ab', label: 'magnitude (AB)' },
  { id: 'Jy', label: 'Jy' }, { id: 'mJy', label: 'mJy' }, { id: 'uJy', label: 'µJy' },
  { id: 'cgs_nu', label: 'erg s⁻¹ cm⁻² Hz⁻¹' }, { id: 'si_nu', label: 'W m⁻² Hz⁻¹' },
  { id: 'cgs_lam', label: 'erg s⁻¹ cm⁻² Å⁻¹' }, { id: 'si_um', label: 'W m⁻² µm⁻¹' },
  { id: 'phot', label: 'photons s⁻¹ cm⁻² Å⁻¹' },
];

/** Flux density in Jy from a value in any unit, at wavelength lam (µm) with an optional Vega zero point (Jy). */
export function toJy(value: number, unit: Unit, lam: number, vegaJy: number | null): number {
  const lamM = lam * 1e-6, nuFromLam = (flam_si_per_m: number) => (flam_si_per_m * lamM * lamM) / C / 1e-26; // W m⁻² m⁻¹ → Jy
  switch (unit) {
    case 'Jy': return value;
    case 'mJy': return value * 1e-3;
    case 'uJy': return value * 1e-6;
    case 'cgs_nu': return value * 1e23;
    case 'si_nu': return value * 1e26;
    case 'cgs_lam': return nuFromLam(value * 1e-7 * 1e4 * 1e10); // erg/s/cm²/Å → W/m²/m
    case 'si_um': return nuFromLam(value * 1e6);
    case 'phot': return nuFromLam(value * 1e4 * 1e10 * (H * C) / lamM);
    case 'ab': return AB_JY * 10 ** (-0.4 * value);
    case 'vega': if (!vegaJy) throw new Error('This band has no Vega zero point here: use AB magnitudes'); return vegaJy * 10 ** (-0.4 * value);
  }
}
export function fromJy(jy: number, lam: number, vegaJy: number | null) {
  const lamM = lam * 1e-6, flamSI = (jy * 1e-26 * C) / (lamM * lamM); // W m⁻² m⁻¹
  return {
    Jy: jy, mJy: jy * 1e3, uJy: jy * 1e6, cgs_nu: jy * 1e-23, si_nu: jy * 1e-26,
    cgs_lam: flamSI * 1e7 * 1e-4 * 1e-10, si_um: flamSI * 1e-6,
    phot: (flamSI * 1e-4 * 1e-10) / ((H * C) / lamM),
    ab: jy > 0 ? -2.5 * Math.log10(jy / AB_JY) : NaN,
    vega: vegaJy && jy > 0 ? -2.5 * Math.log10(jy / vegaJy) : NaN,
  } as Record<Unit, number>;
}
