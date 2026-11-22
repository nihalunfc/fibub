// Extra question shapes for ensembles (templates ensm-m31..m35). Imported by ensembles.js.
import { int, choose, round } from '../_util.js';
import { msqOf, pickMcq, factMcq } from './_more.js';

const binom = (n, k) => { let c = 1; for (let i = 1; i <= k; i++) c = (c * (n - k + i)) / i; return Math.round(c); };

export default [
  { id: 'ensm-m31', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'which quantity fluctuates',
    make(r) {
      const E = choose(r, [
        ['canonical', 'contact with a heat bath through rigid, impermeable walls', ['the energy $E$'], ['the temperature $T$', 'the volume $V$', 'the particle number $N$'], 'Energy is exchanged with the bath, so $E$ fluctuates; $T$ is set by the bath and $V$, $N$ are fixed by the walls.'],
        ['grand canonical', 'contact with a heat and particle reservoir through rigid, permeable walls', ['the particle number $N$', 'the energy $E$'], ['the temperature $T$', 'the volume $V$', 'the chemical potential $\\mu$'], 'Both energy and particles are exchanged, so $E$ and $N$ fluctuate; $T$ and $\\mu$ are fixed by the reservoir and $V$ by the walls.'],
        ['isothermal-isobaric', 'contact with a heat bath through a freely moving, impermeable piston at fixed outside pressure', ['the volume $V$', 'the energy $E$'], ['the temperature $T$', 'the pressure $P$', 'the particle number $N$'], 'The piston moves, so $V$ fluctuates, and heat flows, so $E$ fluctuates; $T$, $P$ and $N$ are fixed.'],
      ]);
      const o = pickMcq(r, choose(r, E[2]), E[3]);
      return { q: `A system is described by the ${E[0]} ensemble (${E[1]}). Which ONE of these quantities fluctuates?`, ...o, sol: E[4],
        trap: 'The variable that is "controlled" (set by the reservoir) is fixed; its conjugate partner is the one that fluctuates.' };
    } },
  { id: 'ensm-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'two-level systems and negative temperature', format: 'statements',
    make(r) {
      const N = int(r, 6, 10), n = int(r, 1, N - 1), W = binom(N, n);
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`The number of microstates is $${W}$`, true, `Choose which $${n}$ of the $${N}$ units are excited: $\\binom{${N}}{${n}} = ${W}$.`],
        [`The number of microstates is $${N ** 2 === W ? N * n : N ** 2}$`, false, `It is $\\binom{${N}}{${n}} = ${W}$.`],
        ['The entropy is largest when half of the units are excited', true, '$\\binom{N}{n}$ peaks at $n = N/2$.'],
        ['The temperature of this macrostate is negative', n > N / 2, n > N / 2 ? `More than half are excited (${n} of ${N}), so adding energy lowers $S$: $1/T = \\partial S/\\partial E < 0$.` : `${n} of ${N} is not more than half, so $\\partial S/\\partial E \\ge 0$.`],
        ['Exciting one more unit increases the entropy', binom(N, n + 1) > W, `$\\binom{${N}}{${n + 1}} = ${binom(N, n + 1)}$ compared with $${W}$ now.`],
        ['Every microstate with the same energy is equally likely in an isolated system', true, 'The postulate of equal a priori probabilities.'],
      ], { not });
      return { q: `An isolated system has ${N} distinguishable two-level units (energies $0$ and $\\varepsilon$), of which exactly ${n} are excited. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Negative temperature means "hotter than infinite": it appears only when the energy spectrum is bounded above and more than half the units are excited.' };
    } },
  { id: 'ensm-m33', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'fluctuations and probability', format: 'order of magnitude',
    make(r) {
      const N = choose(r, [20, 50, 100, 200, 300, 1000]), F = choose(r, [[2, 'the left half'], [3, 'the left third'], [4, 'one quarter']]);
      const k = N * Math.log10(F[0]);
      const ex = (x) => `$10^{-${Math.round(x)}}$`;
      const o = pickMcq(r, ex(k), [ex(N), ex(N * Math.log10(Math.E)), ex(k / 2), ex(2 * k), ex(Math.log10(N))].filter((s) => s !== ex(k)));
      return { q: `$${N}$ ideal-gas molecules move independently in a box. The probability of finding all of them at one instant in ${F[1]} of the box is closest to`, ...o,
        sol: `Each molecule is in that region with probability $1/${F[0]}$, independently, so $P = ${F[0]}^{-${N}} = 10^{-${N}\\log_{10}${F[0]}} = 10^{-${round(k, 1)}}$. Such tiny probabilities are why the second law looks absolute for macroscopic $N$.`,
        trap: 'Using $e^{-N}$ or $10^{-N}$ instead of $(1/' + F[0] + ')^N$ gives the wrong power of ten.' };
    } },
  { id: 'ensm-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'limiting cases', format: 'which is NOT',
    make(r) {
      const M = int(r, 2, 4), lv = Array.from({ length: M }, (_, i) => (i === 0 ? '0' : i === 1 ? '\\varepsilon' : `${i}\\varepsilon`)).join(', ');
      const hi = (M - 1) / 2, hiS = hi === 1 ? '' : Number.isInteger(hi) ? `${hi}` : `\\tfrac{${M - 1}}{2}`;
      const T = [
        ['As $T \\to 0$ only the lowest level is occupied', 'All Boltzmann factors except the ground one vanish.'],
        ['As $T \\to \\infty$ all levels become equally occupied', 'All Boltzmann factors tend to 1.'],
        [`As $T \\to \\infty$ the mean energy tends to $${hiS}\\varepsilon$`, `The average of $0, \\varepsilon, \\ldots, ${M - 1}\\varepsilon$ with equal weights.`],
        [`As $T \\to \\infty$ the entropy tends to $k\\ln${M}$`, `$${M}$ equally likely states.`],
        ['The heat capacity tends to zero both as $T \\to 0$ and as $T \\to \\infty$', 'At low $T$ excitations are frozen out; at high $T$ the populations saturate.'],
        ['The ratio of populations of neighbouring levels is $e^{-\\varepsilon/kT}$', 'Boltzmann factor for a gap $\\varepsilon$ with equal degeneracies.'],
      ];
      const F = [
        [`As $T \\to \\infty$ the mean energy tends to $${M === 2 ? '' : M - 1}\\varepsilon$`, 'That would need everything in the top level; at infinite $T$ the levels are equally occupied.'],
        ['As $T \\to \\infty$ the upper levels become more populated than the lower ones', 'At any positive $T$ lower levels are at least as populated; equality is reached only as $T \\to \\infty$.'],
        [`As $T \\to 0$ the entropy tends to $k\\ln${M}$`, 'With only the non-degenerate ground state occupied, $S \\to 0$.'],
        ['The heat capacity grows without limit as $T \\to \\infty$', 'A bounded spectrum saturates, so $C \\to 0$ at high $T$ (Schottky behaviour).'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `A system has ${M} non-degenerate levels at $${lv}$ and is in equilibrium with a heat bath at temperature $T > 0$. Which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'Infinite temperature means equal populations, not population inversion.' };
    } },
  { id: 'ensm-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'entropy and temperature', format: 'graph in words',
    make(r) {
      const O = {
        hump: 'it rises from zero to a maximum at $E = N\\varepsilon/2$, then falls back to zero at $E = N\\varepsilon$',
        conc: 'it rises monotonically and without bound, ever more slowly (concave)',
        cross: 'it falls monotonically from $+\\infty$, passes through zero at $E = N\\varepsilon/2$ and goes to $-\\infty$',
        pos: 'it falls monotonically from $+\\infty$ towards zero but stays positive',
        jump: 'it rises from 0 to $+\\infty$ as $E \\to N\\varepsilon/2$, then continues from $-\\infty$ up towards $0^-$',
        lin: 'it rises linearly from zero',
      };
      const C = choose(r, [
        ['$N$ two-level units (gap $\\varepsilon$), as $E$ goes from 0 to $N\\varepsilon$', 'S', 'hump', '$S = k\\ln\\binom{N}{E/\\varepsilon}$, symmetric about half filling.'],
        ['$N$ two-level units (gap $\\varepsilon$), as $E$ goes from 0 to $N\\varepsilon$', '1/T', 'cross', '$1/T = \\partial S/\\partial E = \\tfrac{k}{\\varepsilon}\\ln\\tfrac{N\\varepsilon - E}{E}$: $+\\infty$ at $E = 0$, zero at half filling, $-\\infty$ at full.'],
        ['$N$ two-level units (gap $\\varepsilon$), as $E$ goes from 0 to $N\\varepsilon$', 'T', 'jump', 'Inverting $1/T$: $T$ rises from $0^+$ to $+\\infty$ at half filling, then is negative, climbing from $-\\infty$ to $0^-$ at full excitation.'],
        ['a classical monatomic ideal gas of $N$ atoms in a fixed volume, as $E$ increases from 0', 'S', 'conc', '$S = \\tfrac32Nk\\ln E + \\text{const}$: increasing and concave.'],
        ['a classical monatomic ideal gas of $N$ atoms in a fixed volume, as $E$ increases from 0', '1/T', 'pos', '$1/T = \\tfrac{3Nk}{2E}$: positive, decreasing.'],
        ['a classical monatomic ideal gas of $N$ atoms in a fixed volume, as $E$ increases from 0', 'T', 'lin', '$T = \\tfrac{2E}{3Nk}$.'],
      ]);
      const o = pickMcq(r, O[C[2]], Object.keys(O).filter((k) => k !== C[2]).map((k) => O[k]));
      return { q: `For ${C[0]}, how does $${C[1]}$ behave?`, ...o, sol: C[3],
        trap: '$1/T$ is the natural variable: it passes smoothly through zero, while $T$ itself jumps from $+\\infty$ to $-\\infty$.' };
    } },
];
