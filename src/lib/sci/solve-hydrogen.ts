// "Solve my numbers" for the hydrogen spectrum: photon of a jump between levels, energy and size of a level, the limit of a
// series, and which jump gives a measured wavelength. Textbook constants (R = 1.097 × 10⁷ m⁻¹, 13.6 eV). No DOM.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { SERIES } from './learnhydrogen.ts';

export const R_TEXT = 1.097e7; // m⁻¹, the value most textbooks use
export const RY_TEXT = 13.6; // eV
const EV_J = 1.602176634e-19, HC_EVNM = 1239.84198; // h c in eV nm
const series = (n: number) => SERIES[n] ?? `n = ${n} series`;
const region = (nm: number) => (nm < 10 ? 'X-ray' : nm < 380 ? 'ultraviolet' : nm <= 750 ? 'visible' : 'infrared');
export function colour(nm: number) {
  const r = region(nm);
  if (r !== 'visible') return r;
  return nm < 425 ? 'violet' : nm < 480 ? 'blue' : nm < 500 ? 'blue-green' : nm < 570 ? 'green' : nm < 590 ? 'yellow' : nm < 620 ? 'orange' : 'red';
}
const isLevel = (x: number) => Number.isInteger(x) && x >= 1 && x <= 1000;
const bad = 'A level n must be a whole number such as 1, 2, 3 ...';

export function hydrogen(i: Record<string, SIn>, find: string): SOut {
  const lines: string[] = [];
  if (find === 'jump') {
    const a = i.ni.v, b = i.nf.v;
    if (!isLevel(a) || !isLevel(b)) return { error: bad };
    if (a === b) return { error: 'The two levels are the same, so there is no jump and no photon. Choose different levels.' };
    const lo = Math.min(a, b), hi = Math.max(a, b), down = a > b, inv = R_TEXT * (1 / (lo * lo) - 1 / (hi * hi)), nm = 1e9 / inv;
    const E = RY_TEXT * (1 / (lo * lo) - 1 / (hi * hi));
    lines.push(`The electron goes from n = ${a} to n = ${b}, so it ${down ? 'drops and gives out' : 'rises and takes in'} a photon. Lower level n₁ = ${lo}, upper level n₂ = ${hi}.`,
      'Rydberg formula: 1/λ = R (1/n₁² − 1/n₂²) with R = 1.097 × 10⁷ m⁻¹',
      `1/λ = 1.097 × 10⁷ × (1/${lo}² − 1/${hi}²) = ${sf(inv, 4)} m⁻¹`,
      `λ = 1 / (${sf(inv, 4)}) = ${sf(nm / 1e9, 4)} m = ${sf(nm, 4)} nm`,
      `Energy: E = 13.6 × (1/${lo}² − 1/${hi}²) = ${sf(E, 4)} eV = ${sf(E * EV_J, 3)} J`,
      `Frequency: f = c / λ = ${sf(299792458 / (nm * 1e-9), 3)} Hz. It belongs to the ${series(lo)} series (jumps ending on n = ${lo}).`);
    return { answer: `The photon has wavelength ${sf(nm, 4)} nm (${colour(nm)}) and energy ${sf(E, 3)} eV, and it is ${down ? 'given out' : 'absorbed'} (${series(lo)} series).`, lines,
      tip: 'Common mistake: swapping the levels in the bracket. n₁ is always the lower level, so 1/n₁² − 1/n₂² is positive. A jump between two different levels gives out a photon when it goes down and takes one in when it goes up.' };
  }
  if (find === 'level') {
    const n = i.n.v;
    if (!isLevel(n)) return { error: bad };
    const E = -RY_TEXT / (n * n), r = 0.0529 * n * n, v = 2.19e6 / n;
    lines.push('Energy of level n: Eₙ = −13.6 / n² eV', `E${n} = −13.6 / ${n}² = ${sf(E, 4)} eV = ${sf(E * EV_J, 3)} J`,
      `Orbit radius: rₙ = 0.0529 n² nm = 0.0529 × ${n * n} = ${sf(r, 3)} nm`, `Speed: vₙ = 2.19 × 10⁶ ÷ n = ${sf(v, 3)} m/s`,
      `Energy needed to remove the electron from level ${n} (ionisation): ${sf(RY_TEXT / (n * n), 4)} eV`);
    return { answer: `The energy of level n = ${n} is ${sf(E, 4)} eV, and ${sf(-E, 4)} eV is needed to free the electron.`, lines,
      tip: 'Common mistake: dropping the minus sign. Bound levels have negative energy (zero is a free electron), so the ground state is −13.6 eV, and higher levels are less negative.' };
  }
  if (find === 'limit') {
    const n = i.nf.v;
    if (!isLevel(n)) return { error: bad };
    const lim = (n * n) / R_TEXT * 1e9, first = 1e9 / (R_TEXT * (1 / (n * n) - 1 / ((n + 1) ** 2))), E = RY_TEXT / (n * n);
    lines.push(`The ${series(n)} series is every jump that ends on n = ${n}.`, `Series limit (jump from n = ∞): 1/λ = R / ${n}², so λ = ${n}² / R`,
      `λ = ${n * n} / (1.097 × 10⁷) = ${sf(lim / 1e9, 4)} m = ${sf(lim, 4)} nm`,
      `Longest wavelength (first line, n = ${n + 1} → ${n}): λ = 1 / (1.097 × 10⁷ × (1/${n}² − 1/${n + 1}²)) = ${sf(first, 4)} nm`, `Energy at the limit: ${sf(E, 4)} eV`);
    return { answer: `The ${series(n)} series runs from ${sf(first, 4)} nm (longest) down to its limit of ${sf(lim, 4)} nm (${region(lim)}).`, lines,
      tip: 'The limit is the shortest wavelength of the series, found with n₂ = ∞, so 1/n₂² = 0. The first line has the longest wavelength.' };
  }
  // which jump: find the upper level from a wavelength
  const nm = i.lam.v, n1 = i.nf.v;
  if (!isLevel(n1)) return { error: bad };
  if (!(nm > 0)) return { error: 'The wavelength must be above zero.' };
  const inv = 1e9 / nm, rest = 1 / (n1 * n1) - inv / R_TEXT;
  lines.push(`The wavelength is ${sf(nm, 4)} nm = ${sf(nm / 1e9, 4)} m, and the lower level is n₁ = ${n1}.`, 'Rydberg formula: 1/λ = R (1/n₁² − 1/n₂²), so 1/n₂² = 1/n₁² − 1/(λ R)',
    `1/n₂² = 1/${n1}² − 1 / (${sf(nm / 1e9, 4)} × 1.097 × 10⁷) = ${sf(rest, 4)}`);
  if (!(rest > 0)) return { error: `A wavelength of ${sf(nm, 4)} nm is shorter than the series limit of the ${series(n1)} series (${sf((n1 * n1) / R_TEXT * 1e9, 4)} nm), so no jump ending on n = ${n1} makes it.` };
  const n2 = Math.sqrt(1 / rest), r = Math.round(n2);
  lines.push(`n₂ = √(1 / ${sf(rest, 4)}) = ${sf(n2, 4)}`);
  if (r <= n1 || Math.abs(n2 - r) > 0.015 * r) return { error: `That works out to n₂ = ${sf(n2, 3)}, which is not a whole number above ${n1}, so no line of the ${series(n1)} series has this wavelength. Check the wavelength and the series.`, lines };
  return { answer: `A wavelength of ${sf(nm, 4)} nm comes from the jump n = ${r} → n = ${n1} (${series(n1)} series, ${colour(nm)}).`, lines,
    tip: 'Common mistake: forgetting to convert nm to metres before using R in m⁻¹. 486 nm is 486 × 10⁻⁹ m.' };
}

export const HYDROGEN_SPEC: SSpec = {
  id: 'hydrogen',
  finds: [['jump', 'Photon of a jump'], ['level', 'Energy of a level'], ['limit', 'Series limit'], ['which', 'Which jump? (from λ)']],
  fields: [
    { k: 'ni', label: 'From level n', show: (c) => c.find === 'jump', ph: 'e.g. 3' },
    { k: 'nf', label: 'To level n', show: (c) => c.find === 'jump', ph: 'e.g. 2' },
    { k: 'n', label: 'Level n', show: (c) => c.find === 'level', ph: 'e.g. 1' },
    { k: 'nl', label: 'Series ends on level n₁ (1 Lyman, 2 Balmer, 3 Paschen)', show: (c) => c.find === 'limit', ph: 'e.g. 2' },
    { k: 'lam', label: 'Wavelength λ', units: [['nm', 1], ['Å', 0.1], ['µm', 1000], ['m', 1e9]], show: (c) => c.find === 'which', ph: 'e.g. 486' },
    { k: 'nw', label: 'Series ends on level n₁ (2 for Balmer)', show: (c) => c.find === 'which', ph: 'e.g. 2' },
  ],
  presets: [
    { name: 'Electron drops from n = 3 to n = 2', find: 'jump', vals: { ni: '3', nf: '2' } },
    { name: 'Electron jumps up from n = 1 to n = 3', find: 'jump', vals: { ni: '1', nf: '3' } },
    { name: 'Energy of the second level, n = 2', find: 'level', vals: { n: '2' } },
    { name: 'Limit of the Balmer series', find: 'limit', vals: { nl: '2' } },
    { name: 'Which Balmer jump gives 486 nm?', find: 'which', vals: { lam: '486', nw: '2' } },
  ],
  solve: (i, c) => {
    // The shared engine keys inputs by field; map the per-find level fields onto the names the maths uses.
    const m: Record<string, SIn> = { ...i };
    if (c.find === 'limit') m.nf = i.nl; if (c.find === 'which') m.nf = i.nw;
    return hydrogen(m, c.find);
  },
};
