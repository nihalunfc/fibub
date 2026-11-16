// "Solve my numbers" for the photoelectric effect: photon energy, maximum kinetic energy, stopping potential and
// fastest speed from the light and the metal's work function; the work function from K_max; the threshold frequency
// and wavelength. Plain maths, no DOM. Work functions are the rounded values in learnphoto.ts.
import { eng, sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { METALS, H, E_CHARGE, C_LIGHT } from './learnphoto.ts';

const M_E = 9.1093837015e-31; // kg
const HC_EVNM = 1240; // eV nm, the figure school books use
const photonEV = (f: number) => (H * f) / E_CHARGE;

export function photo(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const find = c.find, lines: string[] = [];
  const mt = METALS.find((m) => m.id === c.ch.mat);
  const phi = find === 'phi' || find === 'photon' ? NaN : mt ? mt.phi : i.phi?.v;
  if (mt && find !== 'phi' && find !== 'photon') lines.push(`${mt.name}: φ = ${mt.phi} eV (a rounded textbook value; real surfaces vary)`);
  const conv = (x: SIn | undefined, base: string, what: string) => { if (x && !x.blank && x.u !== base && x.typed !== x.v) lines.push(`Convert ${what}: ${sf(x.typed)} ${x.u} = ${sf(x.v, 4)} ${base}`); };
  conv(i.lam, 'm', 'the wavelength'); conv(i.f, 'Hz', 'the frequency'); conv(i.phi, 'eV', 'the work function'); conv(i.K, 'eV', 'the energy');
  if (i.lam && !i.lam.blank && !(i.lam.v > 0) || i.f && !i.f.blank && !(i.f.v > 0)) return { error: 'The wavelength or frequency of the light must be above zero.' };
  if (phi !== undefined && !Number.isNaN(phi) && !(phi > 0)) return { error: 'The work function must be above 0 eV.' };
  if (find === 'thr') {
    const f0 = (phi * E_CHARGE) / H, l0 = C_LIGHT / f0;
    lines.push('Formula: f₀ = φ / h and λ₀ = c / f₀ = h c / φ', `f₀ = ${sf(phi)} eV × 1.602 × 10⁻¹⁹ ÷ 6.626 × 10⁻³⁴ = ${sf(f0)} Hz`, `λ₀ = c ÷ f₀ = ${sf(l0 * 1e9)} nm   (shortcut: 1240 ÷ ${sf(phi)} = ${sf(HC_EVNM / phi)} nm)`);
    return { answer: `The threshold frequency is ${sf(f0 / 1e14)} × 10¹⁴ Hz, so any light with a wavelength shorter than ${sf(l0 * 1e9)} nm frees electrons.`, lines, tip: 'Common mistake: mixing up the two thresholds. Electrons come out only when the frequency is above f₀, which means the wavelength is below λ₀. Brighter light of too low a frequency does nothing.' };
  }
  const lightFreq = c.ch.light === 'f' ? i.f?.v : i.lam ? C_LIGHT / i.lam.v : NaN;
  const E = photonEV(lightFreq);
  if (c.ch.light === 'f') lines.push('Photon energy: E = h f'); else lines.push(`Frequency: f = c / λ = 2.998 × 10⁸ ÷ ${sf(i.lam.v)} = ${sf(lightFreq)} Hz`, 'Photon energy: E = h f = h c / λ');
  lines.push(`E = 6.626 × 10⁻³⁴ × ${sf(lightFreq)} = ${sf(H * lightFreq)} J = ${sf(E)} eV${c.ch.light === 'f' ? '' : `   (shortcut: 1240 ÷ ${sf(i.lam.v * 1e9)} nm = ${sf(HC_EVNM / (i.lam.v * 1e9))} eV)`}`);
  if (find === 'photon') return { answer: `Each photon carries ${sf(E)} eV (${sf(H * lightFreq)} J).`, lines, tip: 'Common mistake: mixing eV and joules. 1 eV = 1.602 × 10⁻¹⁹ J. Photon energy depends only on the frequency, never on the brightness.' };
  if (find === 'phi') {
    const K = i.K.v;
    if (!(K >= 0)) return { error: 'The largest kinetic energy cannot be negative.' };
    const p = E - K;
    lines.push('Einstein: hf = φ + K_max, so φ = hf − K_max', `φ = ${sf(E)} − ${sf(K)} = ${sf(p)} eV`);
    if (!(p > 0)) return { error: `K_max (${sf(K)} eV) is bigger than the photon energy (${sf(E)} eV), which cannot be. Check the numbers.` };
    const near = METALS.find((m) => Math.abs(m.phi - p) < 0.08);
    return { answer: `The work function is ${sf(p)} eV (${sf(p * E_CHARGE)} J).${near ? ` That is close to ${near.name.toLowerCase()}.` : ''}`, lines, tip: 'Common mistake: a stopping potential of V₀ volts means K_max = V₀ electron-volts. No conversion is needed when you work in eV.' };
  }
  const K = E - phi, f0 = (phi * E_CHARGE) / H;
  lines.push('Einstein: K_max = hf − φ', `K_max = ${sf(E)} − ${sf(phi)} = ${sf(K)} eV`);
  if (!(K > 0)) {
    lines.push(`Threshold frequency f₀ = ${sf(f0)} Hz (λ₀ = ${sf((C_LIGHT / f0) * 1e9)} nm): this light is below it.`);
    return { answer: `No electrons come out: each photon carries ${sf(E)} eV, less than the work function ${sf(phi)} eV. Making the light brighter does not help; the frequency must be higher.`, lines, tip: 'This is the surprise of the photoelectric effect: below the threshold frequency there is no emission, however bright the light.' };
  }
  const v = Math.sqrt((2 * K * E_CHARGE) / M_E);
  lines.push(`Stopping potential: V₀ = K_max / e = ${sf(K)} V`, `K_max in joules = ${sf(K)} × 1.602 × 10⁻¹⁹ = ${sf(K * E_CHARGE)} J`, `Fastest electron: v = √(2 K / m) = √(2 × ${sf(K * E_CHARGE)} ÷ 9.109 × 10⁻³¹) = ${sf(v)} m/s${v > 3e7 ? ' (the school formula is only rough this close to light speed)' : ''}`);
  return { answer: `The largest kinetic energy is ${sf(K)} eV, so the stopping potential is ${sf(K)} V (the fastest electrons leave at ${eng(v, 'm/s')}).`, lines, tip: 'Common mistake: using the brightness. K_max and V₀ depend only on the frequency and the metal; brightness changes only how many electrons (the current).' };
}

const LIGHT = (c: { ch: Record<string, string> }) => c.ch.light !== 'f';
export const PHOTO_SPEC: SSpec = {
  id: 'photo',
  finds: [['kmax', 'Kmax and stopping potential'], ['phi', 'Work function φ'], ['thr', 'Threshold f₀ and λ₀'], ['photon', 'Photon energy']],
  fields: [
    { k: 'light', kind: 'choice', label: 'Light is given as', def: 'lam', show: (c) => c.find !== 'thr', options: [['lam', 'Wavelength λ'], ['f', 'Frequency f']] },
    { k: 'lam', label: 'Wavelength λ', units: [['nm', 1e-9], ['Å', 1e-10], ['µm', 1e-6], ['m', 1]], show: (c) => c.find !== 'thr' && LIGHT(c), ph: 'e.g. 400' },
    { k: 'f', label: 'Frequency f', units: [['× 10¹⁴ Hz', 1e14], ['THz', 1e12], ['Hz', 1]], show: (c) => c.find !== 'thr' && !LIGHT(c), ph: 'e.g. 7.5' },
    { k: 'mat', kind: 'choice', label: 'Metal', def: 'cs', show: (c) => c.find === 'kmax' || c.find === 'thr', options: [...METALS.map((m) => [m.id, `${m.name} (φ ≈ ${m.phi} eV)`] as [string, string]), ['custom', 'Other (type φ)']] },
    { k: 'phi', label: 'Work function φ', units: [['eV', 1], ['J', 1 / E_CHARGE]], show: (c) => (c.find === 'kmax' || c.find === 'thr') && c.ch.mat === 'custom', ph: 'e.g. 2.5' },
    { k: 'K', label: 'Largest kinetic energy (or V₀)', units: [['eV', 1], ['J', 1 / E_CHARGE], ['V (stopping potential)', 1]], show: (c) => c.find === 'phi', ph: 'e.g. 0.8' },
  ],
  presets: [
    { name: '400 nm light on caesium', find: 'kmax', vals: { lam: '400' }, ch: { mat: 'cs', light: 'lam' } },
    { name: 'Ultraviolet 200 nm on zinc', find: 'kmax', vals: { lam: '200' }, ch: { mat: 'zn', light: 'lam' } },
    { name: 'Red 700 nm light on potassium (no emission)', find: 'kmax', vals: { lam: '700' }, ch: { mat: 'k', light: 'lam' } },
    { name: 'Threshold of sodium', find: 'thr', vals: {}, ch: { mat: 'na' } },
    { name: '5 × 10¹⁴ Hz light stops at 0.3 V: find φ', find: 'phi', vals: { f: '5', K: ['0.3', 'V (stopping potential)'] }, ch: { light: 'f' } },
  ],
  solve: (i, c) => photo(i, c),
};
