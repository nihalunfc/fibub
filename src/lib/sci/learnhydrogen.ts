// Bohr model of hydrogen and its spectral series for the school tool hydrogen-spectrum: energy levels,
// photon energy and wavelength of a jump from the Rydberg formula, series names, Bohr radius and speed.
// Plain maths, no DOM.
export const H = 6.62607015e-34; // J s, exact
export const E_CHARGE = 1.602176634e-19; // C, exact
export const C_LIGHT = 299792458; // m/s, exact
export const R_INF = 10973731.568160; // m⁻¹, CODATA 2018
export const MASS_RATIO = 1836.15267343; // proton / electron mass, CODATA 2018
/** Rydberg constant for hydrogen, corrected for the moving nucleus: R_H = R∞ / (1 + mₑ/mₚ). */
export const R_H = R_INF / (1 + 1 / MASS_RATIO);
/** Ionisation energy of hydrogen in this model, h c R_H, in eV (13.598 eV). */
export const RY_EV = (H * C_LIGHT * R_H) / E_CHARGE;
export const A0_NM = 0.0529177210903; // Bohr radius, nm (CODATA 2018)
export const V1 = 2187691.26364; // speed in the first Bohr orbit, m/s (α c)
export const energyEV = (n: number) => -RY_EV / (n * n);
/** 1/λ = R_H (1/n₁² − 1/n₂²) for a jump between n₂ > n₁ (n₂ = Infinity for the series limit). */
export const waveNumber = (n1: number, n2: number) => R_H * (1 / (n1 * n1) - (n2 === Infinity ? 0 : 1 / (n2 * n2)));
export const wavelengthNm = (n1: number, n2: number) => 1e9 / waveNumber(n1, n2);
export const photonEV = (n1: number, n2: number) => energyEV(n2 === Infinity ? 1e9 : n2) - energyEV(n1);
export const SERIES = ['', 'Lyman', 'Balmer', 'Paschen', 'Brackett', 'Pfund', 'Humphreys'];
export const seriesName = (nLower: number) => SERIES[nLower] ?? `n = ${nLower} series`;
export const region = (nm: number) => (nm < 10 ? 'X-ray' : nm < 380 ? 'ultraviolet' : nm <= 750 ? 'visible' : 'infrared');
export const radiusNm = (n: number) => n * n * A0_NM;
export const speed = (n: number) => V1 / n;
