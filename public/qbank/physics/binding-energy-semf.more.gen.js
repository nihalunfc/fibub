// Extra question shapes for binding-energy-semf (templates bse-m31..m35). Imported by binding-energy-semf.js.
import { int, choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'bse-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'liquid-drop terms', format: 'statements',
    make(r) {
      const k = choose(r, [2, 3, 4]), f53 = (k ** (5 / 3)).toFixed(2), not = r() < 0.5;
      const m = msqOf(r, [
        ['the volume term is proportional to $A$', true, 'Each nucleon binds only to its near neighbours (saturation), so the bulk energy grows like the number of nucleons.'],
        ['the surface term is proportional to $A^{2/3}$ and reduces the binding', true, 'Surface nucleons have fewer neighbours; the surface area grows as $R^2 \\propto A^{2/3}$.'],
        ['the asymmetry term is proportional to $(N - Z)^2/A$', true, 'It comes from the Pauli principle (Fermi gas kinetic energy) and favours $N = Z$.'],
        ['the pairing term increases the binding of odd-odd nuclei', false, 'Odd-odd nuclei have an unpaired proton and an unpaired neutron: pairing lowers their binding.'],
        ['the surface term increases the binding energy', false, 'It is subtracted: surface nucleons are less bound.'],
        vs(r, `at fixed $Z/A$, multiplying $A$ by ${k} multiplies the Coulomb energy by about ${f53}`, `at fixed $Z/A$, multiplying $A$ by ${k} multiplies the Coulomb energy by about ${k}`, `$E_C \\propto Z^2/A^{1/3} \\propto A^2/A^{1/3} = A^{5/3}$, so the factor is $${k}^{5/3} = ${f53}$.`),
        ['the binding energy per nucleon reaches its maximum, about 8.8 MeV, near iron and nickel', true, 'The surface term pulls $B/A$ down for light nuclei, the Coulomb term for heavy ones.'],
        ['the Coulomb term vanishes for nuclei with $N = Z$', false, 'It depends on $Z$ alone: $a_CZ(Z - 1)/A^{1/3}$, nonzero whenever $Z \\ge 2$.'],
      ], { not });
      return { q: `Which of the following statements about the semi-empirical mass formula are ${nt(not)}?`, ...m,
        trap: 'Coulomb energy grows faster than $A$ (as $A^{5/3}$ along the valley), which is what ends the periodic table.' };
    } },
  { id: 'bse-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'binding curve',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['fission of a heavy nucleus into two medium nuclei releases energy', true, 'The fragments sit higher on the $B/A$ curve (about 8.5 against 7.6 MeV).'],
        ['fusing two very light nuclei releases energy', true, '$B/A$ rises steeply among the light nuclei.'],
        ['the ${}^4$He nucleus is unusually tightly bound for its mass', true, 'Its $B/A \\approx 7.07$ MeV is far above that of ${}^3$He or ${}^6$Li neighbours.'],
        ['a fission of ${}^{235}$U releases roughly 200 MeV', true, 'About $235\\times(8.5 - 7.6) \\approx 200$ MeV.'],
        ['the near-constant $B/A$ over most of the table shows that nuclear forces saturate', true, 'If every nucleon bound to every other, $B$ would grow like $A^2$.'],
        ['splitting an iron nucleus into two lighter nuclei releases energy', false, 'Iron is near the top of the curve; splitting or fusing it costs energy.'],
        ['$B/A$ rises steadily with $A$ across the whole periodic table', false, 'It peaks near $A \\approx 56$-62 and then falls slowly.'],
        ['the deuteron has a binding energy per nucleon close to 8 MeV', false, 'Only 1.11 MeV per nucleon (2.22 MeV in all).'],
      ], not);
      return { q: `Which statement about the curve of binding energy per nucleon is ${nt(not)}?`, ...m,
        trap: 'Energy is released when nucleons move toward the peak of $B/A$, from either side.' };
    } },
  { id: 'bse-m33', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'fission', format: 'limiting case',
    make(r) {
      const aS = choose(r, [16.8, 17.2, 17.8, 18.3, 18.6]), aC = choose(r, [0.69, 0.71, 0.72, 0.75]);
      const x = (2 * aS) / aC;
      const o = mcqOptions(r, x.toFixed(1), [(aS / aC).toFixed(1), (4 * aS / aC).toFixed(1), (aS / (2 * aC)).toFixed(1), (2 * aC / aS * 100).toFixed(1)]);
      return { q: `Take the surface coefficient $a_S = ${aS}$ MeV and the Coulomb coefficient $a_C = ${aC}$ MeV (Coulomb energy $a_CZ^2/A^{1/3}$). For a small spheroidal deformation the surface energy rises by $\\tfrac25\\epsilon^2E_S$ and the Coulomb energy falls by $\\tfrac15\\epsilon^2E_C$. The value of $Z^2/A$ above which a nucleus has no barrier against spontaneous fission is about`,
        options: o.options, answer: o.answer,
        sol: `The sphere becomes unstable when the energy change $\\epsilon^2(\\tfrac25E_S - \\tfrac15E_C)$ turns negative, i.e. $E_C \\gt 2E_S$: $a_CZ^2/A^{1/3} \\gt 2a_SA^{2/3}$, so $Z^2/A \\gt 2a_S/a_C = 2(${aS})/${aC} = ${x.toFixed(1)}$. Real heavy nuclei ($Z^2/A \\approx 36$ for uranium-238) are below this, so they keep a fission barrier.`,
        trap: 'The surface energy enters with the factor 2/5 and the Coulomb energy with 1/5: the condition is $E_C = 2E_S$, not $E_C = E_S$.' };
    } },
  { id: 'bse-m34', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'stability line', format: 'match',
    make(r) {
      const L = { vol: 'the volume term', surf: 'the surface term', coul: 'the Coulomb term', asym: 'the asymmetry term', pair: 'the pairing term' };
      const cas = choose(r, [
        ['Heavy stable nuclei have many more neutrons than protons.', 'coul', 'Proton repulsion grows as $Z^2$; replacing protons by neutrons lowers it, pushing the valley of stability to $N \\gt Z$.'],
        ['Light stable nuclei have $N \\approx Z$.', 'asym', 'With small $Z$ the Coulomb term is weak, and the asymmetry term $(N - Z)^2/A$ dominates, favouring $N = Z$.'],
        ['Odd-$A$ isobars lie on one mass parabola, but even-$A$ isobars on two.', 'pair', 'The pairing term shifts even-even nuclei down and odd-odd nuclei up by the same amount; odd-$A$ nuclei are unaffected.'],
        ['$B/A$ is much smaller for very light nuclei.', 'surf', 'A large fraction of the nucleons of a small nucleus are on the surface; the surface term per nucleon grows as $A^{-1/3}$.'],
        ['The total binding energy grows roughly in proportion to $A$.', 'vol', 'Saturation: each nucleon adds a fixed amount of binding from its neighbours.'],
        ['Only four stable odd-odd nuclei exist (${}^2$H, ${}^6$Li, ${}^{10}$B, ${}^{14}$N).', 'pair', 'Odd-odd nuclei are pushed up by the pairing term, so they can almost always beta-decay to an even-even neighbour.'],
        ['$B/A$ falls slowly beyond $A \\approx 60$.', 'coul', 'The Coulomb energy per nucleon grows as $Z^2/A^{4/3} \\propto A^{2/3}$ along the valley, overtaking the shrinking surface term per nucleon.'],
      ]);
      return { q: `${cas[0]} Which term of the semi-empirical mass formula is mainly responsible?`, ...matchOne(r, L, cas),
        trap: 'Neutron excess in heavy nuclei is driven by Coulomb repulsion, not by the asymmetry term (which opposes it).' };
    } },
  { id: 'bse-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'order of magnitude',
    make(r) {
      const kind = int(r, 0, 2);
      let q, x, unit, sol;
      if (kind === 0) {
        const g = choose(r, [1, 10, 100, 1000]);
        x = (g / 235) * 6.022e23 * 200 * 1.602e-13; unit = '\\text{J}';
        q = `The energy released when ${g} g of ${'${}^{235}'}$U fissions completely (about 200 MeV per fission) is`;
        sol = `Number of nuclei $= (${g}/235)(6.02\\times10^{23}) = ${sci((g / 235) * 6.022e23)}$. Energy $= N \\times 200\\text{ MeV}\\times1.60\\times10^{-13}\\text{ J/MeV} \\approx ${sci(x)}$ J.`;
      } else if (kind === 1) {
        const P = choose(r, [1, 10, 100, 1000, 3000]);
        x = (P * 1e6) / (200 * 1.602e-13); unit = '\\text{s}^{-1}';
        q = `A reactor produces ${P} MW of thermal power. The number of fissions per second (200 MeV each) is about`;
        sol = `One fission gives $200\\times1.60\\times10^{-13} = 3.2\\times10^{-11}$ J, so $N = ${P}\\times10^6/3.2\\times10^{-11} \\approx ${sci(x)}$ per second.`;
      } else {
        const A = choose(r, [56, 120, 208, 238]), BA = { 56: 8.79, 120: 8.5, 208: 7.87, 238: 7.57 }[A];
        x = (A * BA) / (A * 931.5); unit = '';
        q = `For a nucleus with $A = ${A}$ ($B/A \\approx ${BA}$ MeV), the binding energy as a fraction of the total rest energy of its free nucleons is about`;
        sol = `$B/(Am_uc^2) \\approx ${BA}/931.5 = ${sci(x)}$: below 1%, which is why nuclear masses are nearly whole numbers of u.`;
      }
      const o = orderOpts(r, x, unit);
      return { q, options: o.options, answer: o.answer, sol, trap: 'Use $1\\text{ MeV} = 1.6\\times10^{-13}$ J and $N_A = 6\\times10^{23}$ per mole.' };
    } },
];
