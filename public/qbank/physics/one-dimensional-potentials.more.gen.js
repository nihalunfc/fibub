// Extra question shapes for one-dimensional-potentials (templates q1d-m31..m35). Imported by one-dimensional-potentials.js.
import { int, choose, round } from '../_util.js';
import { msqOf, pickMcq, oomMcq } from './_more.js';

const ord = (n) => ['ground state', 'first excited state', 'second excited state', 'third excited state', 'fourth excited state', 'fifth excited state'][n - 1];

export default [
  { id: 'q1d-m31', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'nodes and parity',
    make(r) {
      const n = int(r, 1, 6), well = choose(r, ['finite square well $V = -V_0$ for $|x| < a/2$', 'harmonic potential $V = \\tfrac12m\\omega^2x^2$', 'symmetric double well', 'infinite square well $-L/2 < x < L/2$']);
      const par = (p) => (p ? 'even' : 'odd');
      const s = (k, p) => `${k} node${k === 1 ? '' : 's'}, ${par(p)} parity`;
      const ev = n % 2 === 1;
      const o = pickMcq(r, s(n - 1, ev), [s(n - 1, !ev), s(n, ev), s(n, !ev), n > 1 ? s(n - 2, ev) : s(2, ev)]);
      return { q: `A particle is in the ${ord(n)} (state number ${n} in order of increasing energy) of a ${well}. Not counting the points at infinity${well.startsWith('infinite') ? ' or the walls' : ''}, its wavefunction has`, ...o,
        sol: `In one dimension the $n$-th bound state has $n - 1$ nodes (oscillation theorem), so state ${n} has ${n - 1}. For a potential symmetric about $x = 0$ the bound states alternate in parity starting with an even ground state, so state ${n} is ${par(ev)}. (An even function has an even number of interior nodes, symmetric about the origin; an odd one has a node at $x = 0$.)`,
        trap: 'Counting the ground state as "state 0" shifts both the node count and the parity by one.' };
    } },
  { id: 'q1d-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'transmission', format: 'graph in words',
    make(r) {
      const D = {
        step: 'it is exactly zero below a threshold energy, then rises monotonically from zero towards 1',
        bar: 'it is small but non-zero below a threshold energy, then oscillates above it, reaching exactly 1 at a set of energies and tending to 1',
        delta: 'it rises smoothly and monotonically from 0 (as $E \\to 0$) towards 1, with no oscillations',
        well: 'it tends to 0 as $E \\to 0$, then rises with peaks reaching exactly 1 at a set of energies, tending to 1',
      };
      const C = choose(r, [
        ['a potential step up of height $V_0$', 'step', 'Below $V_0$ the wave is evanescent on the far side and carries no current, so $T = 0$. Above, $T = 4k_1k_2/(k_1 + k_2)^2$ rises monotonically from 0 at $E = V_0$ towards 1.'],
        ['a rectangular barrier of height $V_0$ and width $a$', 'bar', 'Below $V_0$ the particle tunnels with $T \\sim e^{-2\\kappa a}$. Above $V_0$, $T = 1$ whenever $k_2a = n\\pi$ (an integer number of half-wavelengths fits the barrier) and dips between these resonances.'],
        ['a repulsive delta barrier $+\\alpha\\delta(x)$', 'delta', '$T = 1/(1 + m\\alpha^2/2\\hbar^2E)$, a smooth monotonic function from 0 to 1.'],
        ['an attractive delta well $-\\alpha\\delta(x)$', 'delta', '$T = 1/(1 + m\\alpha^2/2\\hbar^2E)$ is the same as for the barrier (it depends on $\\alpha^2$), so it rises smoothly from 0 to 1.'],
        ['a finite square well of depth $V_0$ and width $a$', 'well', 'At very low energy the sudden change of wave number reflects almost everything, so $T \\to 0$. Transmission resonances ($T = 1$) occur when $k_2a = n\\pi$ inside the well, as in the Ramsauer-Townsend effect.'],
      ]);
      const o = pickMcq(r, D[C[1]], Object.keys(D).filter((k) => k !== C[1]).map((k) => D[k]));
      return { q: `Particles of energy $E > 0$ arrive from the left at ${C[0]}. Which describes the transmission coefficient $T(E)$?`, ...o, sol: C[2],
        trap: 'Classical intuition says a well always transmits fully; quantum mechanically even a well reflects, and strongly at low energy.' };
    } },
  { id: 'q1d-m33', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'bound states', format: 'statements',
    make(r) {
      const P = choose(r, [
        ['an attractive delta well $-\\alpha\\delta(x)$', [1, 0, 0, 1, 1], 'it has exactly one bound state for any $\\alpha > 0$', 'the delta function makes $\\psi\'$ jump by $-2m\\alpha\\psi(0)/\\hbar^2$'],
        ['an infinite square well $0 < x < L$', [1, 1, 0, 1, 1], 'it has the levels $n^2\\pi^2\\hbar^2/2mL^2$ for every $n = 1, 2, \\ldots$', '$\\psi$ goes to zero at the walls with a non-zero slope inside and zero slope outside'],
        ['a finite symmetric square well $V = -V_0$ for $|x| < a/2$', [1, 0, 1, 1, 1], 'a symmetric 1D well always binds at least one (even) state, but only finitely many for finite depth', 'the potential has only finite jumps, so $\\psi\'$ is continuous'],
        ['a well with a hard wall, $V = \\infty$ for $x < 0$, $V = -V_0$ for $0 < x < a$, $V = 0$ for $x > a$', [0, 0, 0, 1, 1], 'it binds only if $V_0a^2 > \\pi^2\\hbar^2/8m$ (it behaves like the odd states of a symmetric well), so a shallow one has none', 'the hard wall forces $\\psi(0) = 0$ with a non-zero slope inside'],
      ]);
      const [atLeast, infinite, cont] = P[1];
      const not = r() < 0.4;
      const m = msqOf(r, [
        ['It has at least one bound state however weak (or shallow) it is', !!atLeast, atLeast ? `True: ${P[2]}.` : `False: ${P[2]}.`],
        ['It has infinitely many bound states', !!infinite, infinite ? `True: ${P[2]}.` : 'False: only finitely many states fit below the top of the well.'],
        ['$\\psi\'(x)$ is continuous at every point', !!cont, cont ? `True: ${P[3]}.` : `False: ${P[3]}.`],
        ['Its bound states are non-degenerate', true, 'True for every 1D potential: two bound states with the same energy would have a constant, hence zero, Wronskian and so be proportional.'],
        ['$\\psi(x)$ is continuous at every point', true, 'True: even at a delta function or an infinite wall, $\\psi$ itself is continuous.'],
      ], { not });
      return { q: `A particle moves in ${P[0]}. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'A symmetric 1D well always binds, but a well next to a hard wall need not: the wall makes it act like the odd sector.' };
    } },
  { id: 'q1d-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'limiting cases', format: 'limiting case',
    make(r) {
      const O = {
        inf: 'the levels, measured from the bottom, approach $n^2\\pi^2\\hbar^2/2ma^2$ (infinite well)',
        delta: 'exactly one bound state survives, with energy $-m\\alpha^2/2\\hbar^2$ (delta well)',
        shallow: 'exactly one bound state survives, with binding energy going to zero as $V_0^2$',
        wide: 'the number of bound states grows in proportion to $a$ and the low levels crowd together',
        none: 'no bound state survives',
      };
      const C = choose(r, [
        ['$V_0 \\to \\infty$ with $a$ fixed', 'inf', 'The decay length $1/\\kappa$ outside goes to zero, so $\\psi \\to 0$ at the edges: the infinite-well boundary condition.'],
        ['$a \\to 0$ and $V_0 \\to \\infty$ with $V_0a = \\alpha$ fixed', 'delta', 'The well becomes $-\\alpha\\delta(x)$, which has one bound state at $-m\\alpha^2/2\\hbar^2$.'],
        ['$V_0 \\to 0$ with $a$ fixed', 'shallow', 'A symmetric 1D well always binds one even state; for weak binding $E \\approx -m(V_0a)^2/2\\hbar^2$, quadratic in $V_0$.'],
        ['$a \\to \\infty$ with $V_0$ fixed', 'wide', 'The number of bound states is about $1 + \\tfrac{2}{\\pi}\\cdot\\tfrac a2\\sqrt{2mV_0}/\\hbar$, growing linearly with $a$; spacings shrink as $1/a^2$.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `A finite square well has depth $V_0$ and width $a$. In the limit ${C[0]},`, ...o, sol: C[2],
        trap: 'In one dimension "too shallow to bind" never happens for a symmetric well; in three dimensions it does.' };
    } },
  { id: 'q1d-m35', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'tunnelling', format: 'order of magnitude',
    make(r) {
      const prot = r() < 0.3;
      const U = int(r, 1, 6), L = prot ? round(0.01 * int(r, 3, 10), 2) : round(0.1 * int(r, 3, 12), 1);
      const kap = (prot ? 219.5 : 5.123) * Math.sqrt(U), x = 2 * kap * L, T = Math.exp(-x);
      const o = oomMcq(r, T);
      return { q: `${prot ? 'A proton' : 'An electron'} meets a rectangular barrier whose top is $${U}$ eV above its energy and whose width is $${L}$ nm. Using $T \\approx e^{-2\\kappa L}$, the transmission probability is closest to`, ...o,
        sol: `$\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar = ${prot ? 219.5 : 5.123}\\sqrt{${U}}\\ \\text{nm}^{-1} = ${round(kap, 2)}$ nm$^{-1}$ (for ${prot ? 'a proton, $\\sqrt{1836}$ times the electron value $5.123$' : 'an electron, $5.123$'} nm$^{-1}$ per $\\sqrt{\\text{eV}}$). Then $2\\kappa L = ${round(x, 2)}$ and $T \\approx e^{-${round(x, 2)}} = 10^{-${round(x / Math.LN10, 2)}}$, nearest $10^{${o.k}}$.`,
        trap: 'Converting $e^{-x}$ to a power of ten: divide the exponent by $\\ln 10 = 2.303$, not by 10.' };
    } },
];
