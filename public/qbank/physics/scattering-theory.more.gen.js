// Extra question shapes for scattering-theory (templates netsc-m31..m35). Imported by scattering-theory.js.
import { choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'netsc-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'hard sphere', format: 'statements',
    make(r) {
      const a = choose(r, [1, 2, 3, 5]), lo = 4 * Math.PI * a * a, hi = 2 * Math.PI * a * a, not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `for a hard sphere of radius ${a} fm, the low-energy cross-section is about ${lo.toFixed(1)} fm$^2$`, `for a hard sphere of radius ${a} fm, the low-energy cross-section is about ${(Math.PI * a * a).toFixed(1)} fm$^2$`, `At low energy only $l = 0$ counts and $\\delta_0 = -ka$, so $\\sigma \\to 4\\pi a^2 = ${lo.toFixed(1)}$ fm$^2$, four times the geometric area.`),
        vs(r, `for a hard sphere of radius ${a} fm, the high-energy total cross-section is about ${hi.toFixed(1)} fm$^2$`, `for a hard sphere of radius ${a} fm, the high-energy total cross-section is about ${(Math.PI * a * a).toFixed(1)} fm$^2$`, `For $ka \\gg 1$, $\\sigma \\to 2\\pi a^2 = ${hi.toFixed(1)}$ fm$^2$: the geometric $\\pi a^2$ plus an equal shadow (diffraction) part.`),
        ['the optical theorem reads $\\sigma_{tot} = (4\\pi/k)\\,\\text{Im}\\,f(0)$', true, 'It expresses conservation of probability (flux).'],
        ['the first Born approximation works best at high energy', true, 'The incident wave is then little distorted by the potential.'],
        ['the first Born approximation works best at low energy for any potential', false, 'At low energy a strong potential distorts the wave a lot; Born needs a weak potential there.'],
        ['the first Born amplitude for a real potential is real, so it cannot satisfy the optical theorem by itself', true, 'Im $f(0)$ appears only at second order, consistent with $\\sigma \\propto |V|^2$.'],
        ['pure s-wave scattering is isotropic in the centre-of-mass frame', true, '$f = e^{i\\delta_0}\\sin\\delta_0/k$ has no angle dependence.'],
        ['the partial cross-section in wave $l$ can grow without limit near a resonance', false, 'Unitarity caps it at $4\\pi(2l + 1)/k^2$.'],
      ], { not });
      return { q: `Which of the following statements about quantum scattering are ${nt(not)}?`, ...m,
        trap: 'Hard sphere: $4\\pi a^2$ at low energy, $2\\pi a^2$ at high energy, never just $\\pi a^2$.' };
    } },
  { id: 'netsc-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'phase shifts',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['a weak attractive potential gives positive phase shifts', true, 'The wave is pulled in: it acquires extra phase.'],
        ['a repulsive potential gives negative phase shifts', true, 'The wave is pushed out.'],
        ['at a sharp resonance the phase shift rises rapidly through $\\pi/2$', true, 'Breit-Wigner: $\\tan\\delta = (\\Gamma/2)/(E_R - E)$.'],
        ['at low energy $\\delta_l \\propto k^{2l + 1}$', true, 'The centrifugal barrier suppresses higher partial waves.'],
        ['Levinson\'s theorem relates $\\delta_0(0) - \\delta_0(\\infty)$ to the number of bound states', true, '$\\delta_l(0) - \\delta_l(\\infty) = n_l\\pi$ (with a half-unit correction for a zero-energy s-wave resonance).'],
        ['the partial cross-section $\\sigma_l$ is largest when $\\delta_l = \\pi/4$', false, '$\\sigma_l \\propto \\sin^2\\delta_l$, largest at $\\delta_l = \\pi/2$.'],
        ['a phase shift of exactly $\\pi$ in the only important partial wave gives maximum scattering', false, '$\\sin^2\\pi = 0$: the target becomes transparent (Ramsauer-Townsend).'],
        ['phase shifts are independent of energy for any potential', false, 'They depend on $k$; only special cases (such as $1/r^2$) give constant shifts.'],
      ], not);
      return { q: `Which statement about partial-wave phase shifts is ${nt(not)}?`, ...m,
        trap: 'Cross-section depends on $\\sin^2\\delta_l$: $\\pi/2$ is maximal, $\\pi$ gives nothing.' };
    } },
  { id: 'netsc-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Born approximation', format: 'match',
    make(r) {
      const mu = choose(r, [1, 2, 3]), b = choose(r, [1, 2]);
      const L = {
        yuk: `proportional to $1/(q^2 + ${mu * mu})$`,
        cou: 'proportional to $1/q^2$',
        gau: `a Gaussian in $q$`,
        well: 'proportional to $(\\sin qa - qa\\cos qa)/q^3$, with zeros',
        del: 'independent of $q$ (isotropic)',
      };
      const cas = choose(r, [
        [`a Yukawa potential $V = V_0e^{-${mu === 1 ? '' : mu}r}/r$`, 'yuk', `$f \\propto \\int_0^\\infty e^{-${mu === 1 ? '' : mu}r}\\sin(qr)\\,dr/q = 1/(q^2 + ${mu * mu})$.`],
        ['a Coulomb potential $V = \\alpha/r$', 'cou', 'The $\\mu \\to 0$ limit of Yukawa: Rutherford scattering.'],
        [`a Gaussian potential $V = V_0e^{-${b === 1 ? '' : b}r^2}$`, 'gau', 'The Fourier transform of a Gaussian is a Gaussian.'],
        ['a spherical square well of radius $a$', 'well', '$\\int_0^a r\\sin(qr)\\,dr$ gives $(\\sin qa - qa\\cos qa)/q^2$, then divide by $q$.'],
        ['a contact potential $V = g\\,\\delta^3(\\vec r)$', 'del', 'The Fourier transform of a delta function is constant.'],
      ]);
      return { q: `In the first Born approximation, the scattering amplitude for ${cas[0]}, as a function of the momentum transfer $q$, is`, ...matchOne(r, L, cas),
        trap: 'The Born amplitude is the Fourier transform of the potential in $q$.' };
    } },
  { id: 'netsc-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Coulomb scattering', format: 'limiting case',
    make(r) {
      const [t1, t2] = choose(r, [[30, 60], [30, 90], [60, 120], [45, 90], [20, 40], [90, 180]]);
      const s = (t) => Math.sin((t * Math.PI) / 360), ratio = (s(t2) / s(t1)) ** 4;
      const show = (x) => `${+x.toPrecision(3)}`;
      const o = mcqOptions(r, ratio, [(s(t2) / s(t1)) ** 2, (t2 / t1) ** 2, (t2 / t1) ** 4, (s(t2) / s(t1)) ** 3], show);
      return { q: `In Rutherford scattering, the ratio of the differential cross-sections $\\dfrac{d\\sigma/d\\Omega\\,(${t1}^\\circ)}{d\\sigma/d\\Omega\\,(${t2}^\\circ)}$ is`,
        options: o.options, answer: o.answer,
        sol: `$d\\sigma/d\\Omega \\propto 1/\\sin^4(\\theta/2)$, so the ratio is $\\left[\\dfrac{\\sin ${t2 / 2}^\\circ}{\\sin ${t1 / 2}^\\circ}\\right]^4 = \\left(\\dfrac{${s(t2).toFixed(4)}}{${s(t1).toFixed(4)}}\\right)^4 = ${show(ratio)}$.`,
        trap: 'It is the half-angle that enters, and to the fourth power.' };
    } },
  { id: 'netsc-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'partial waves', format: 'order of magnitude',
    make(r) {
      const E = choose(r, [0.01, 0.1, 1, 10, 100]), A = choose(r, [27, 64, 125, 208]), R = 1.2 * Math.cbrt(A), k = Math.sqrt(2 * 939.6 * E) / 197.33;
      const x = k * R, o = orderOpts(r, x);
      return { q: `A neutron of kinetic energy ${E} MeV scatters from a nucleus with $A = ${A}$ (radius $1.2A^{1/3}$ fm). The number of partial waves that matter, roughly $kR$, is of order`,
        options: o.options, answer: o.answer,
        sol: `$k = \\sqrt{2mE}/\\hbar = \\sqrt{2(939.6)(${E})}/197.3 = ${sci(k)}$ fm$^{-1}$; $R = ${R.toFixed(2)}$ fm; $kR = ${sci(x)}$. Waves with $l \\lesssim kR$ reach the nucleus${x < 0.5 ? ': here only the s wave' : ''}.`,
        trap: 'Use the non-relativistic $k = \\sqrt{2mE}/\\hbar$ with $\\hbar c = 197$ MeV fm and $mc^2 = 940$ MeV.' };
    } },
];
