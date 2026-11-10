// The electromagnetic spectrum (school level): band of a wavelength, frequency f = c/λ, photon energy E = hc/λ,
// everyday examples, and an approximate on-screen colour for visible light. No DOM.
// Band edges are the usual school-book conventions; neighbouring bands overlap in reality.
import { C_LIGHT, H_PLANCK, E_CHARGE, n3 } from './em-p34.ts';
import { pick, type Question } from './elec-quiz.ts';

export type Band = { id: string; name: string; min: number; max: number; uses: string };
export const BANDS: Band[] = [
  { id: 'gamma', name: 'Gamma rays', min: 0, max: 1e-12, uses: 'Given out by atomic nuclei. Used to kill cancer cells and to sterilise medical tools and some foods.' },
  { id: 'xray', name: 'X-rays', min: 1e-12, max: 1e-9, uses: 'Pass through soft tissue but not bone: medical images, airport baggage scanners, studying crystals.' },
  { id: 'uv', name: 'Ultraviolet', min: 1e-9, max: 400e-9, uses: 'From the Sun; causes sunburn and helps the skin make vitamin D. Germ-killing lamps, checking banknotes. Mostly stopped by the ozone layer.' },
  { id: 'visible', name: 'Visible light', min: 400e-9, max: 700e-9, uses: 'The only band our eyes see: violet, blue, green, yellow, orange, red. Plants use it for photosynthesis.' },
  { id: 'ir', name: 'Infrared', min: 700e-9, max: 1e-3, uses: 'Felt as heat. TV remote controls, night-vision and thermal cameras, optical fibre links, physiotherapy lamps.' },
  { id: 'micro', name: 'Microwaves', min: 1e-3, max: 1, uses: 'Microwave ovens, Wi-Fi, mobile phones, radar for aircraft and weather, satellite links.' },
  { id: 'radio', name: 'Radio waves', min: 1, max: Infinity, uses: 'AM and FM radio, TV broadcasts, walkie-talkies; long waves follow the curve of the Earth.' },
];
/** Everyday examples placed at their wavelength (m). Values are typical, rounded. */
export const EXAMPLES: { name: string; lam: number }[] = [
  { name: 'Cobalt-60 gamma (1.17 MeV)', lam: 1.06e-12 }, { name: 'Medical X-ray (about 40 keV)', lam: 3.1e-11 },
  { name: 'Germ-killing UV lamp', lam: 254e-9 }, { name: 'UV-A in sunlight', lam: 365e-9 },
  { name: 'Blue', lam: 450e-9 }, { name: 'Green', lam: 530e-9 }, { name: 'Red', lam: 650e-9 },
  { name: 'TV remote', lam: 940e-9 }, { name: 'Heat from your body', lam: 10e-6 },
  { name: 'Microwave oven (2.45 GHz)', lam: 0.122 }, { name: 'Wi-Fi (5 GHz)', lam: 0.06 }, { name: 'Mobile phone (1.8 GHz)', lam: 0.167 },
  { name: 'FM radio (100 MHz)', lam: 3 }, { name: 'AM radio (1 MHz)', lam: 300 },
];

export const bandOf = (lam: number) => BANDS.find((b) => lam >= b.min && lam < b.max) ?? BANDS[BANDS.length - 1];
export function photon(lam: number) {
  const f = C_LIGHT / lam, E = (H_PLANCK * C_LIGHT) / lam;
  return { f, E, eV: E / E_CHARGE };
}

/** Approximate screen colour for 380 to 780 nm as [r, g, b] in 0 to 255 (a simple piecewise fit, dimmed at the
 *  ends where the eye is less sensitive). Outside that range it returns null. */
export function visibleRGB(nm: number): [number, number, number] | null {
  if (nm < 380 || nm > 780) return null;
  let r = 0, g = 0, b = 0;
  if (nm < 440) { r = (440 - nm) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = (645 - nm) / 65; }
  else r = 1;
  const k = nm < 420 ? 0.3 + (0.7 * (nm - 380)) / 40 : nm > 700 ? 0.3 + (0.7 * (780 - nm)) / 80 : 1;
  return [Math.round(255 * r * k), Math.round(255 * g * k), Math.round(255 * b * k)];
}

export function questions(rng: () => number = Math.random): Question[] {
  const lam = pick(rng, [500, 600, 400]), f = C_LIGHT / (lam * 1e-9);
  const fm = pick(rng, [88, 100, 106]), lfm = C_LIGHT / (fm * 1e6);
  const l2 = pick(rng, [400, 500, 620]), eV = (H_PLANCK * C_LIGHT) / (l2 * 1e-9) / E_CHARGE;
  const g = pick(rng, [2.4, 5]), lg = C_LIGHT / (g * 1e9);
  return [
    { text: `What is the frequency of light of wavelength ${lam} nm, in hertz?`, answer: f, unit: 'Hz', tol: 0.02,
      steps: ['f = c / λ, with c = 3 × 10⁸ m/s', `f = 3 × 10⁸ / (${lam} × 10⁻⁹) = ${n3(f)} Hz`] },
    { text: `An FM station broadcasts at ${fm} MHz. What is its wavelength, in metres?`, answer: lfm, unit: 'm', tol: 0.02,
      steps: ['λ = c / f', `λ = 3 × 10⁸ / (${fm} × 10⁶) = ${n3(lfm)} m`] },
    { text: `What is the energy of one photon of ${l2} nm light, in electronvolts?`, answer: eV, unit: 'eV', tol: 0.02,
      steps: ['E = hc / λ; then divide by 1.6 × 10⁻¹⁹ J/eV (a handy shortcut: E in eV ≈ 1240 / λ in nm)', `E = 1240 / ${l2} = ${n3(eV)} eV`] },
    { text: `Wi-Fi uses ${g} GHz. What is its wavelength, in metres?`, answer: lg, unit: 'm', tol: 0.02,
      steps: ['λ = c / f', `λ = 3 × 10⁸ / (${g} × 10⁹) = ${n3(lg)} m (microwaves)`] },
  ];
}
