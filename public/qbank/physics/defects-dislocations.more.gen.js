// Extra question shapes for defects-dislocations (templates def-m31..m35). Imported by defects-dislocations.js.
import { choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'def-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'dislocations', format: 'statements',
    make(r) {
      const k = choose(r, [2, 3]), not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `a dislocation with a Burgers vector ${k} times longer has ${k * k} times the line energy`, `a dislocation with a Burgers vector ${k} times longer has ${k} times the line energy`, `The line energy is about $Gb^2$ per unit length: factor $${k}^2 = ${k * k}$. This is the basis of Frank's rule.`),
        ['vacancies are present in thermal equilibrium at any temperature above zero', true, 'Their formation energy is outweighed by the configurational entropy.'],
        ['dislocations are not equilibrium defects', true, 'Their energy per atom plane is far too large for entropy to pay for.'],
        ['an edge dislocation has its Burgers vector perpendicular to the line', true, 'For a screw dislocation the two are parallel.'],
        ['a screw dislocation can cross-slip onto another plane containing its Burgers vector', true, 'Its slip plane is not uniquely defined.'],
        ['an edge dislocation can climb by absorbing or emitting vacancies', true, 'Climb is non-conservative motion and needs diffusion.'],
        ['a screw dislocation moves out of its slip plane by climb', false, 'Climb applies to edge components; a screw dislocation changes plane by cross-slip.'],
        ['Schottky defects in NaCl change its chemical composition', false, 'They come as cation-anion vacancy pairs, keeping it stoichiometric.'],
      ], { not });
      return { q: `Which of the following statements about crystal defects are ${nt(not)}?`, ...m,
        trap: 'Edge: climb. Screw: cross-slip. Energy goes as $b^2$.' };
    } },
  { id: 'def-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'work hardening',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['cold working raises the yield stress by tangling dislocations', true, 'More dislocations get in each other\'s way.'],
        ['smaller grains make a polycrystal stronger (Hall-Petch)', true, '$\\sigma_y = \\sigma_0 + kd^{-1/2}$.'],
        ['fine precipitates strengthen an alloy by pinning dislocations', true, 'Dislocations must bow around or cut through them (Orowan).'],
        ['the ideal shear strength of a perfect crystal is roughly $G/30$', true, 'Far above measured yield stresses.'],
        ['real crystals yield at low stress because dislocations move one row of atoms at a time', true, 'They avoid breaking all bonds across a plane at once.'],
        ['annealing raises the dislocation density', false, 'Annealing lets dislocations annihilate and recrystallise: density falls, metal softens.'],
        ['larger grains make a polycrystal stronger', false, 'Grain boundaries block slip; fewer boundaries means weaker.'],
        ['measured yield stresses of pure metals are close to the ideal shear strength', false, 'They are hundreds to thousands of times smaller.'],
      ], not);
      return { q: `Which statement about the strength of crystalline solids is ${nt(not)}?`, ...m,
        trap: 'Annealing softens; cold working and fine grains harden.' };
    } },
  { id: 'def-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'classification', format: 'match',
    make(r) {
      const L = { F: 'F centres (electrons trapped at anion vacancies)', cv: 'cation vacancies', sch: 'Schottky defects', disl: 'dislocations', kirk: 'vacancy-mediated diffusion', gb: 'grain boundaries' };
      const cas = choose(r, [
        ['An alkali halide crystal heated in alkali-metal vapour becomes coloured', 'F', 'Excess metal creates anion vacancies that trap electrons; these absorb visible light.'],
        ['Adding a little CaCl$_2$ to NaCl raises its ionic conductivity', 'cv', 'Each Ca$^{2+}$ replacing Na$^+$ brings a cation vacancy to keep charge balance.'],
        ['The measured density of a crystal is slightly less than the density calculated from its X-ray lattice constant', 'sch', 'Missing ions lower the mass without changing the lattice.'],
        ['Etch pits form in rows on a deformed crystal surface', 'disl', 'Strain around dislocation lines makes them etch faster where they meet the surface.'],
        ['Inert markers at a copper-brass interface move during annealing (Kirkendall effect)', 'kirk', 'Zinc and copper diffuse at different rates through vacancies, so the lattice shifts.'],
        ['A fine-grained metal is harder than the same metal with large grains', 'gb', 'Boundaries block slip.'],
      ]);
      return { q: `${cas[0]}. The explanation lies in`, ...matchOne(r, L, cas),
        trap: 'Colour centres need vacancies with trapped electrons, not just vacancies.' };
    } },
  { id: 'def-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'grain boundaries', format: 'scaling',
    make(r) {
      const f = choose(r, [4, 9, 16, 25, 100]), s0 = choose(r, [20, 50, 100]), dHP = choose(r, [50, 100, 150]);
      const ans = s0 + dHP * Math.sqrt(f), show = (x) => `${Math.round(x)} MPa`;
      const o = mcqOptions(r, ans, [s0 + dHP * f, s0 * Math.sqrt(f) + dHP, (s0 + dHP) * Math.sqrt(f), s0 + dHP / Math.sqrt(f)], show);
      return { q: `A metal obeys Hall-Petch, $\\sigma_y = \\sigma_0 + kd^{-1/2}$, with $\\sigma_0 = ${s0}$ MPa. At its present grain size the grain-boundary term is ${dHP} MPa. If the grain size is reduced by a factor ${f}, the yield stress becomes about`,
        options: o.options, answer: o.answer,
        sol: `The boundary term scales as $d^{-1/2}$: dividing $d$ by ${f} multiplies it by $\\sqrt{${f}} = ${Math.sqrt(f)}$, to ${dHP * Math.sqrt(f)} MPa. Then $\\sigma_y = ${s0} + ${dHP * Math.sqrt(f)} = ${show(ans)}$. The friction stress $\\sigma_0$ does not change.`,
        trap: 'Only the grain-size term scales, and as the square root.' };
    } },
  { id: 'def-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'vacancy concentration', format: 'order of magnitude',
    make(r) {
      const Ev = choose(r, [0.6, 0.9, 1.1, 1.4]), T = choose(r, [300, 600, 900, 1300]), x = Math.exp(-Ev / (8.617e-5 * T));
      const o = orderOpts(r, x);
      return { q: `The vacancy formation energy of a metal is ${Ev} eV. Ignoring the formation entropy, the equilibrium fraction of vacant lattice sites at ${T} K is of order`,
        options: o.options, answer: o.answer,
        sol: `$n/N = e^{-E_v/kT}$ with $kT = 8.617\\times10^{-5}\\times${T} = ${(8.617e-5 * T).toFixed(4)}$ eV: $e^{-${(Ev / (8.617e-5 * T)).toFixed(1)}} = ${sci(x)}$.`,
        trap: 'At room temperature $kT \\approx 0.026$ eV, so vacancies are very rare; near melting they reach about $10^{-4}$.' };
    } },
];
