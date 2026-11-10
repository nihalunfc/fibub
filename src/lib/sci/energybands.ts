// Energy bands (school level, Class 12 semiconductors): conductor, semiconductor and insulator band pictures,
// intrinsic carrier density with temperature, doping (n-type and p-type, n·p = ni²) and the colour of an LED
// from its band gap. Pure functions, no DOM.

export const HC = 1239.84198; // eV nm (CODATA h·c / e)
export const KB = 8.617333262e-5; // eV/K (CODATA)
/** One rough effective density of states used for every material at 300 K (cm⁻³); a teaching value. */
export const N300 = 2.5e19;

export type Material = { id: string; name: string; eg: number; kind: 'conductor' | 'semiconductor' | 'insulator' };
/** Band gaps near room temperature, rounded (general facts). */
export const MATERIALS: Material[] = [
  { id: 'cu', name: 'Copper (a metal)', eg: 0, kind: 'conductor' },
  { id: 'ge', name: 'Germanium', eg: 0.66, kind: 'semiconductor' },
  { id: 'si', name: 'Silicon', eg: 1.12, kind: 'semiconductor' },
  { id: 'gaas', name: 'Gallium arsenide', eg: 1.42, kind: 'semiconductor' },
  { id: 'diamond', name: 'Diamond (carbon)', eg: 5.5, kind: 'insulator' },
];

/** School rule of thumb: no gap = conductor, under 3 eV = semiconductor, above = insulator. */
export function classify(eg: number): Material['kind'] {
  if (!(eg >= 0)) throw new Error('The band gap cannot be negative.');
  return eg === 0 ? 'conductor' : eg < 3 ? 'semiconductor' : 'insulator';
}

/** Photon wavelength (nm) for an energy in eV, and back. */
export function lambdaNm(eV: number): number {
  if (!(eV > 0)) throw new Error('The energy must be above zero.');
  return HC / eV;
}
export function egFromLambda(nm: number): number {
  if (!(nm > 0)) throw new Error('The wavelength must be above zero.');
  return HC / nm;
}

/** Name of the colour of light with this wavelength. */
export function colourName(nm: number): string {
  if (nm < 380) return 'ultraviolet';
  if (nm < 450) return 'violet';
  if (nm < 495) return 'blue';
  if (nm < 570) return 'green';
  if (nm < 590) return 'yellow';
  if (nm < 620) return 'orange';
  if (nm <= 750) return 'red';
  return 'infrared';
}

/** Approximate sRGB for a visible wavelength (Dan Bruton's piecewise fit); black outside 380–750 nm. */
export function wavelengthRGB(nm: number): [number, number, number] {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = (440 - nm) / 60; b = 1; }
  else if (nm >= 440 && nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm >= 490 && nm < 510) { g = 1; b = (510 - nm) / 20; }
  else if (nm >= 510 && nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm >= 580 && nm < 645) { r = 1; g = (645 - nm) / 65; }
  else if (nm >= 645 && nm <= 750) { r = 1; }
  let f = 0;
  if (nm >= 380 && nm < 420) f = 0.3 + 0.7 * (nm - 380) / 40;
  else if (nm >= 420 && nm <= 700) f = 1;
  else if (nm > 700 && nm <= 750) f = 0.3 + 0.7 * (750 - nm) / 50;
  const c = (x: number) => Math.round(255 * Math.pow(x * f, 0.8));
  return [c(r), c(g), c(b)];
}

/** Intrinsic carrier density (cm⁻³) in a rough model: ni = N300 (T/300)^1.5 exp(−Eg / 2kT). */
export function ni(eg: number, T: number): number {
  if (!(T > 0)) throw new Error('The temperature must be above 0 K.');
  if (!(eg > 0)) throw new Error('A conductor has no band gap.');
  return N300 * Math.pow(T / 300, 1.5) * Math.exp(-eg / (2 * KB * T));
}

/** How many times more carriers at T than at T0 (same material). */
export const niRatio = (eg: number, T: number, T0 = 300) => ni(eg, T) / ni(eg, T0);

/** Electron and hole densities with N dopant atoms per cm³, all ionised: n·p = ni². */
export function carriers(eg: number, T: number, type: 'none' | 'n' | 'p', N = 0): { n: number; p: number; ni: number } {
  const i = ni(eg, T);
  if (type === 'none' || !(N > 0)) return { n: i, p: i, ni: i };
  // charge neutrality: majority = N/2 + sqrt(N²/4 + ni²), exact for full ionisation
  const maj = N / 2 + Math.sqrt((N * N) / 4 + i * i), min = (i * i) / maj;
  return type === 'n' ? { n: maj, p: min, ni: i } : { n: min, p: maj, ni: i };
}

/** Dots to draw in the conduction band: two per factor of ten above 10⁶ cm⁻³, at most 30. */
export const dots = (n: number) => Math.max(0, Math.min(30, Math.round(2 * (Math.log10(Math.max(n, 1)) - 6))));
