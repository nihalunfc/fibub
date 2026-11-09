// #977 Physical constants. Every value and uncertainty was compared with the CODATA 2018 and 2022 tables shipped in
// scipy.constants (no differences); here the published values are checked against the physics that links them.
import * as C from '../../src/lib/sci/phconstants.ts';
export default async (check) => {
  for (const ed of ['2018', '2022']) {
    const g = (sym, unit) => { const c = C.CONSTANTS.find((k) => k.sym === sym && (!unit || k.unit === unit)); if (!c) throw new Error(sym); return C.value(c, ed); };
    const rel = (a, b, t) => Math.abs(a / b - 1) <= t;
    const c = g('c'), h = g('h', 'J Hz⁻¹'), hb = g('ħ', 'J s'), e = g('e'), k = g('k', 'J K⁻¹'), NA = g('N_A'), a = g('α'), me = g('m_e', 'kg'), mu0 = g('μ₀'), eps0 = g('ε₀');
    check(`constants ${ed}: exact SI defining values`, c === 299792458 && h === 6.62607015e-34 && e === 1.602176634e-19 && k === 1.380649e-23 && NA === 6.02214076e23 && g('Δν_Cs') === 9192631770 && g('K_cd') === 683);
    check(`constants ${ed}: ħ = h/2π, R = N_A k, F = N_A e`, rel(hb, h / (2 * Math.PI), 1e-9) && rel(g('R'), NA * k, 1e-9) && rel(g('F'), NA * e, 1e-9));
    check(`constants ${ed}: ε₀ μ₀ c² = 1 and Z₀ = μ₀ c`, rel(eps0 * mu0 * c * c, 1, 1e-9) && rel(g('Z₀'), mu0 * c, 1e-9));
    check(`constants ${ed}: α = e²/(4π ε₀ ħ c), α⁻¹`, rel(a, (e * e) / (4 * Math.PI * eps0 * hb * c), 1e-9) && rel(g('α⁻¹'), 1 / a, 1e-9));
    check(`constants ${ed}: Bohr radius, Rydberg, Hartree from α and m_e`, rel(g('a₀'), hb / (me * c * a), 1e-9) && rel(g('R∞'), (a * a * me * c) / (2 * h), 1e-9) && rel(g('E_h', 'J'), a * a * me * c * c, 1e-9));
    check(`constants ${ed}: r_e, Compton wavelength, Thomson cross section`, rel(g('r_e'), a * a * g('a₀'), 1e-9) && rel(g('λ_C'), h / (me * c), 1e-9) && rel(g('σ_e'), (8 * Math.PI / 3) * g('r_e') ** 2, 1e-9));
    check(`constants ${ed}: Josephson, von Klitzing, flux and conductance quanta`, rel(g('K_J'), 2 * e / h, 1e-9) && rel(g('R_K'), h / (e * e), 1e-9) && rel(g('Φ₀'), h / (2 * e), 1e-9) && rel(g('G₀'), 2 * e * e / h, 1e-9));
    check(`constants ${ed}: Stefan-Boltzmann and radiation constants`, rel(g('σ'), (2 * Math.PI ** 5 * k ** 4) / (15 * h ** 3 * c * c), 1e-9) && rel(g('c₁'), 2 * Math.PI * h * c * c, 1e-9) && rel(g('c₂'), (h * c) / k, 1e-9));
    check(`constants ${ed}: mass energies and ratios`, rel(g('m_e c²'), (me * c * c) / e / 1e6, 1e-9) && rel(g('m_p/m_e'), g('m_p', 'kg') / me, 1e-9) && rel(g('μ_B', 'J T⁻¹'), (e * hb) / (2 * me), 1e-9) && rel(g('μ_N'), (e * hb) / (2 * g('m_p', 'kg')), 1e-9));
  }
  const find = (n) => C.CONSTANTS.find((c) => c.name === n);
  check('constants: published strings', C.plain(find('Newtonian constant of gravitation'), '2018') === '6.67430e-11' && C.plain(find('Fine-structure constant'), '2022') === '7.2973525643e-3' && C.plain(find('Electron mass'), '2022') === '9.1093837139e-31' && C.plain(find('Electron mass'), '2018') === '9.1093837015e-31');
  check('constants: concise notation and grouping', C.concise(find('Newtonian constant of gravitation'), '2018') === '6.674 30(15) × 10⁻¹¹' && C.concise(find('Vacuum electric permittivity'), '2018') === '8.854 187 8128(13) × 10⁻¹²' && C.show(find('Reduced Planck constant'), '2022') === '1.054 571 817… × 10⁻³⁴' && C.show(find('Speed of light in vacuum'), '2022') === '299 792 458');
  check('constants: search and groups', C.search('electron mass').length >= 3 && C.search('', 'Adopted values').length === 5 && C.search('BOLTZMANN').length === 3 && C.CONSTANTS.every((c) => C.GROUPS.includes(c.group)));
  check('constants: changes between 2018 and 2022', C.changed(find('Electron mass')) && !C.changed(find('Planck constant')) && !C.changed(find('Newtonian constant of gravitation')));
};
