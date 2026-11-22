// Extra question shapes for ising-landau (templates netis-m31..m35). Imported by ising-landau.js.
import { choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'netis-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'mean field', format: 'statements',
    make(r) {
      const [lat, z] = choose(r, [['square', 4], ['triangular', 6], ['simple cubic', 6], ['body-centred cubic', 8], ['face-centred cubic', 12]]), not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `mean-field theory gives $kT_c = ${z}J$ for the Ising model on the ${lat} lattice`, `mean-field theory gives $kT_c = ${z / 2}J$ for the Ising model on the ${lat} lattice`, `Mean field: $kT_c = zJ$ with coordination number $z = ${z}$ (for $H = -J\\sum_{\\langle ij\\rangle}s_is_j$, $s = \\pm1$).`),
        ['the one-dimensional Ising model with short-range coupling has no phase transition at $T \\gt 0$', true, 'A single domain wall costs finite energy but gains entropy $\\propto \\ln N$.'],
        ['the square-lattice Ising model orders below $kT_c = 2J/\\ln(1 + \\sqrt2) \\approx 2.27J$', true, 'Onsager\'s exact result.'],
        ['mean-field theory overestimates $T_c$', true, 'It ignores fluctuations, which destabilise order.'],
        ['the order-parameter exponent of the 2D Ising model is $\\beta = 1/8$', true, 'Exact, from Onsager and Yang.'],
        ['mean-field theory correctly predicts no transition in the 1D Ising chain', false, 'It predicts $kT_c = 2J$ in 1D, which is wrong.'],
        ['the 2D Ising order-parameter exponent equals the mean-field value 1/2', false, 'It is 1/8.'],
        ['mean-field exponents become exact above the upper critical dimension 4', true, 'Fluctuations are then irrelevant (Ginzburg criterion).'],
      ], { not });
      return { q: `Which of the following statements about the Ising model are ${nt(not)}?`, ...m,
        trap: 'Mean field ignores fluctuations: it predicts transitions even where none exist (1D).' };
    } },
  { id: 'netis-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Landau theory',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['$F = a(T - T_c)m^2 + bm^4$ with $b \\gt 0$ describes a continuous transition', true, 'The minimum moves smoothly away from $m = 0$ below $T_c$.'],
        ['Landau theory gives $m \\propto (T_c - T)^{1/2}$', true, 'Minimise: $m^2 = a(T_c - T)/(2b)$.'],
        ['Landau theory gives a finite jump (not a divergence) in the specific heat at $T_c$', true, '$\\Delta C = a^2T_c/(2b)$.'],
        ['a cubic term $cm^3$ in the free energy makes the transition first order', true, 'The minimum then jumps discontinuously.'],
        ['a negative quartic coefficient with a positive sixth-order term gives a first-order transition', true, 'The free energy develops a second minimum away from zero.'],
        ['Landau theory is exact for the 2D Ising model', false, 'Landau theory gives mean-field exponents; 2D Ising has $\\beta = 1/8$, $\\alpha = 0$ (log).'],
        ['Landau theory predicts a logarithmically divergent specific heat', false, 'It predicts a finite jump.'],
        ['in Landau theory the susceptibility stays finite at $T_c$', false, 'It diverges as $|T - T_c|^{-1}$.'],
      ], not);
      return { q: `Which statement about Landau theory is ${nt(not)}?`, ...m,
        trap: 'Landau = mean field: $\\beta = 1/2$, $\\gamma = 1$, jump in $C$.' };
    } },
  { id: 'netis-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'universality', format: 'match',
    make(r) {
      const L = { half: '$(T_c - T)^{1/2}$', inv: '$|T - T_c|^{-1}$', jump: 'a finite jump at $T_c$', third: '$h^{1/3}$', xi: '$|T - T_c|^{-1/2}$' };
      const cas = choose(r, [
        ['the order parameter just below $T_c$', 'half', 'Minimising $a(T - T_c)m^2 + bm^4$.'],
        ['the susceptibility near $T_c$ (either side)', 'inv', 'Curie-Weiss: $\\gamma = 1$.'],
        ['the specific heat at $T_c$', 'jump', '$\\alpha = 0$ with a discontinuity.'],
        ['the order parameter at $T = T_c$ as a function of the field $h$', 'third', 'At $T_c$, $4bm^3 = h$: $\\delta = 3$.'],
        ['the correlation length near $T_c$ (Ornstein-Zernike)', 'xi', '$\\nu = 1/2$ from the gradient term.'],
      ]);
      return { q: `In mean-field (Landau) theory, ${cas[0]} behaves as`, ...matchOne(r, L, cas),
        trap: 'Mean-field exponents: $\\alpha = 0$, $\\beta = 1/2$, $\\gamma = 1$, $\\delta = 3$, $\\nu = 1/2$.' };
    } },
  { id: 'netis-m34', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'mean field', format: 'limiting case',
    make(r) {
      const Tc = choose(r, [100, 200, 300, 600]), d1 = choose(r, [5, 10, 20]), d2 = choose(r, [40, 50, 100]);
      const T1 = Tc + d1, T2 = Tc + d2, ratio = d2 / d1, show = (x) => `${+x.toPrecision(3)}`;
      const o = mcqOptions(r, ratio, [T2 / T1, Math.sqrt(ratio), ratio * ratio, T1 / T2], show);
      return { q: `A ferromagnet with $T_c = ${Tc}$ K obeys the Curie-Weiss law above $T_c$. The ratio of its susceptibilities $\\chi(${T1}\\text{ K})/\\chi(${T2}\\text{ K})$ is`,
        options: o.options, answer: o.answer,
        sol: `$\\chi = C/(T - T_c)$, so the ratio is $(${T2} - ${Tc})/(${T1} - ${Tc}) = ${d2}/${d1} = ${show(ratio)}$. A paramagnet (Curie law) would give only $${T2}/${T1} = ${show(T2 / T1)}$.`,
        trap: 'Measure temperatures from $T_c$, not from zero.' };
    } },
  { id: 'netis-m35', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Monte Carlo', format: 'order of magnitude',
    make(r) {
      const Lsz = choose(r, [4, 5, 6, 8, 10]), x = 2 ** (Lsz * Lsz), o = orderOpts(r, x);
      return { q: `The number of spin configurations of an Ising model on a ${Lsz}$\\times$${Lsz} lattice is of order`,
        options: o.options, answer: o.answer,
        sol: `Each of the $${Lsz * Lsz}$ spins has 2 states: $2^{${Lsz * Lsz}} = 10^{${(Lsz * Lsz * Math.log10(2)).toFixed(1)}} \\approx ${sci(x)}$. This is why exact enumeration fails beyond tiny lattices and Monte Carlo sampling is used.`,
        trap: '$2^{10} \\approx 10^3$: each 10 spins add three powers of ten.' };
    } },
];
