// Extra question shapes for waveguides (templates wvg-m31..m35). Imported by waveguides.js.
import { choose, mcqOptions, shuffle, round } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne, orderOpts } from './_odd.js';

export default [
  { id: 'wvg-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'rectangular guides', format: 'statements',
    make(r) {
      const a = choose(r, [2, 2.5, 3, 4, 5]), b = a / 2, fc = round(15 / a, 2), not = r() < 0.5;
      const f = round(fc * choose(r, [1.25, 1.5, 1.8]), 2), g = Math.sqrt(1 - (fc / f) ** 2);
      const m = msqOf(r, [
        [`the lowest mode is TE$_{10}$ with cutoff ${fc} GHz`, true, `$f_c = c/2a = 3\\times10^8/(2\\times${a}\\times10^{-2})$ Hz $= ${fc}$ GHz.`],
        [`TE$_{01}$ and TE$_{20}$ have the same cutoff, ${round(2 * fc, 2)} GHz`, true, `With $b = a/2$: $c/2b = c/a = 2f_c$.`],
        ['TM$_{10}$ is the lowest TM mode', false, 'TM modes need both indices non-zero; the lowest is TM$_{11}$.'],
        [`at ${f} GHz the group velocity is about $${round(g, 2)}c$`, true, `$v_g = c\\sqrt{1 - (f_c/f)^2} = ${round(g, 2)}c$.`],
        [`at ${f} GHz the phase velocity is about $${round(g, 2)}c$`, false, `$v_p = c/\\sqrt{1 - (f_c/f)^2} = ${round(1 / g, 2)}c$; it is the group velocity that is $${round(g, 2)}c$.`],
        [`a ${round(fc * 0.8, 2)} GHz signal travels down the guide with reduced speed`, false, 'Below cutoff the field decays exponentially and no power travels.'],
        ['the guide can carry a TEM mode', false, 'A hollow single conductor has no TEM mode.'],
      ], { not });
      return { q: `An air-filled rectangular metal waveguide has inner sides $a = ${a}$ cm and $b = ${b}$ cm. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'TE$_{10}$ cutoff is $c/2a$; $v_pv_g = c^2$ with $v_g \\lt c \\lt v_p$.' };
    } },
  { id: 'wvg-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'guided modes', format: 'match',
    make(r) {
      const L = {
        tem: 'a TEM mode with no cutoff frequency',
        te10: 'TE$_{10}$, with cutoff $c/2a$ set by the wider side',
        te11: 'TE$_{11}$, with cutoff $\\approx 1.84c/(2\\pi R)$',
        hyb: 'a hybrid HE$_{11}$ mode with no cutoff',
        tm01: 'TM$_{01}$, with cutoff $\\approx 2.405c/(2\\pi R)$',
      };
      const cas = choose(r, [
        ['a coaxial cable', 'tem', 'Two separate conductors allow a TEM mode at any frequency.'],
        ['a parallel two-wire line', 'tem', 'Two conductors again: TEM down to DC.'],
        ['a hollow rectangular metal guide of sides $a \\gt b$', 'te10', 'The lowest cutoff belongs to TE$_{10}$.'],
        ['a hollow circular metal guide of radius $R$', 'te11', 'The smallest Bessel-derivative zero, $1.841$ of $J_1\'$, gives TE$_{11}$, lower than TM$_{01}$ (zero 2.405 of $J_0$).'],
        ['a step-index optical fibre', 'hyb', 'Dielectric guides have the HE$_{11}$ mode with no cutoff, which is why single-mode fibres exist.'],
      ]);
      return { q: `The lowest (fundamental) mode of ${cas[0]} is`, ...matchOne(r, L, cas),
        trap: 'Hollow single-conductor guides have no TEM mode and so always have a cutoff.' };
    } },
  { id: 'wvg-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'cutoff behaviour', format: 'limiting case',
    make(r) {
      const L = {
        below: 'the field decays exponentially along the guide and carries no power (evanescent)',
        at: 'the guide wavelength becomes infinite and the group velocity goes to zero',
        just: 'the wave travels slowly, with a long guide wavelength and phase velocity far above $c$',
        far: 'the wave travels almost as in free space, with $v_p$ and $v_g$ both close to $c$',
      };
      const cas = choose(r, [
        ['$f$ is well below the cutoff $f_c$', 'below', '$k_z = \\sqrt{\\omega^2/c^2 - \\omega_c^2/c^2}$ is imaginary.'],
        ['$f$ equals the cutoff $f_c$ exactly', 'at', '$k_z = 0$: $\\lambda_g = 2\\pi/k_z \\to \\infty$ and $v_g = c^2k_z/\\omega \\to 0$.'],
        ['$f$ is just above the cutoff $f_c$', 'just', '$k_z$ is small, so $\\lambda_g$ is long, $v_g$ small and $v_p = c^2/v_g$ large.'],
        ['$f$ is many times the cutoff $f_c$', 'far', '$k_z \\to \\omega/c$: the guide walls barely matter.'],
      ]);
      return { q: `In a hollow metal waveguide, when ${cas[0]} for a given mode,`, ...matchOne(r, L, cas),
        trap: 'Use $k_z^2 = (\\omega^2 - \\omega_c^2)/c^2$ and follow it through each limit.' };
    } },
  { id: 'wvg-m34', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'cutoff frequency', format: 'order of magnitude',
    make(r) {
      const C = choose(r, [[0.5, '5 mm'], [2.3, '2.3 cm'], [7, '7 cm'], [25, '25 cm'], [100, '1 m (a mine tunnel)']]);
      const fc = 3e8 / (2 * C[0] * 1e-2), o = orderOpts(r, fc, '\\text{Hz}');
      return { q: `A hollow rectangular metal duct has its wider side ${C[1]}. Below about what frequency can no electromagnetic wave travel down it?`, ...o,
        sol: `TE$_{10}$ cutoff: $f_c = \\dfrac{c}{2a} = \\dfrac{3\\times10^8}{2\\times${C[0] / 100}}$ Hz $\\approx ${(fc / 10 ** o.n).toFixed(1)}\\times10^{${o.n}}$ Hz. A guide passes only waves whose half-wavelength fits across it.`,
        trap: 'The free-space wavelength at cutoff is twice the wide side: $\\lambda_c = 2a$.' };
    } },
  { id: 'wvg-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'optical fibres', format: 'which is NOT',
    make(r) {
      const [n1, n2] = choose(r, [[1.48, 1.46], [1.5, 1.48], [1.46, 1.45], [1.5, 1.45]]), not = r() < 0.6;
      const NA = round(Math.sqrt(n1 * n1 - n2 * n2), 3), acc = round((Math.asin(Math.min(1, NA)) * 180) / Math.PI, 1);
      const m = oneOf(r, [
        [`the numerical aperture is about ${NA}`, true, `$\\mathrm{NA} = \\sqrt{n_1^2 - n_2^2} = ${NA}$.`],
        [`rays entering from air within about $${acc}^\\circ$ of the axis are guided`, true, `$\\sin\\theta_{\\max} = \\mathrm{NA}$.`],
        ['a thinner core can make the fibre single-mode at a given wavelength', true, 'The $V$ number $2\\pi a\\,\\mathrm{NA}/\\lambda$ must fall below 2.405.'],
        ['light is guided by total internal reflection at the core-cladding boundary', true, 'The core has the higher index.'],
        [`the numerical aperture is about ${round(n1 - n2, 3)}`, false, `That is $n_1 - n_2$; the NA is $\\sqrt{n_1^2 - n_2^2} = ${NA}$.`],
        ['guiding would still work with the cladding index above the core index', false, 'Total internal reflection needs $n_{\\text{core}} \\gt n_{\\text{clad}}$.'],
        ['a multimode step-index fibre has no spreading of short pulses', false, 'Different rays (modes) take different times: modal dispersion.'],
      ], not);
      return { q: `A step-index fibre has core index $${n1}$ and cladding index $${n2}$. Which statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'NA $= \\sqrt{n_1^2 - n_2^2}$, not $n_1 - n_2$.' };
    } },
];
