// Extra question shapes for nonlinear-dynamics-chaos (templates chs-m31..m35). Imported by nonlinear-dynamics-chaos.js.
import { choose, mcqOptions, shuffle, round } from '../_util.js';
import { msqOf } from './_more.js';
import { matchOne } from './_odd.js';

export default [
  { id: 'chs-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'tent map', format: 'statements',
    make(r) {
      const mu = choose(r, [0.8, 1.5, 2]), not = r() < 0.5, ch = mu > 1, xs = round(mu / (1 + mu), 3);
      const m = msqOf(r, [
        [`the Lyapunov exponent is $\\ln ${mu} \\approx ${round(Math.log(mu), 3)}$`, true, `$|T'(x)| = ${mu}$ at every point, so $\\lambda = \\langle\\ln|T'|\\rangle = \\ln ${mu}$.`],
        ['typical orbits are chaotic', ch, ch ? `$\\lambda = \\ln ${mu} \\gt 0$ and the orbit stays bounded.` : `$\\lambda = \\ln ${mu} \\lt 0$: orbits are drawn to 0.`],
        ['$x = 0$ is a stable fixed point', !ch, ch ? `$|T'(0)| = ${mu} \\gt 1$: unstable.` : `$|T'(0)| = ${mu} \\lt 1$: stable.`],
        [`there is a second fixed point at $x^* = ${xs}$`, ch, ch ? `On the right branch $${mu}(1 - x) = x$ gives $x^* = ${mu}/${1 + mu} = ${xs}$, which lies in $(\\tfrac12, 1]$.` : `$${mu}(1 - x) = x$ gives $${xs} \\lt \\tfrac12$, which is not on the right branch, so there is no second fixed point.`],
        ['the invariant density is uniform on $[0, 1]$', mu === 2, mu === 2 ? 'Each half of $[0, 1]$ is stretched evenly onto the whole interval, so a uniform density maps to itself.' : `For $\\mu = ${mu}$ ${ch ? 'the orbit lives on a smaller interval with a non-uniform density' : 'there is no spread-out invariant density; orbits collapse to 0'}.`],
        ['the map is invertible', false, 'Every value in its range has two pre-images, one on each branch.'],
        ['two nearby starting points separate, on average, by the factor $\\mu$ per step', ch, ch ? 'Each step stretches small distances by $\\mu \\gt 1$ (while they stay small).' : `Here $\\mu = ${mu} \\lt 1$ shrinks distances.`],
      ], { not });
      return { q: `Consider the tent map $x_{n+1} = ${mu}\\min(x_n, 1 - x_n)$ on $[0, 1]$. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'For the tent map the slope has the same size everywhere, so the Lyapunov exponent is simply $\\ln\\mu$.' };
    } },
  { id: 'chs-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'predictability', format: 'estimation',
    make(r) {
      const lam = choose(r, [0.3, 0.5, 1]), e = choose(r, [3, 6, 9]), t = (e * Math.log(10)) / lam;
      const o = mcqOptions(r, round(t, 1), shuffle(r, [round(t / 2, 1), round(1 / lam, 1), round(e * Math.log(10) * lam, 1), round(t * 2, 1), round(e / lam, 1)]), (v) => `about ${v} days`);
      return { q: `In a chaotic model, small errors grow as $e^{\\lambda t}$ with $\\lambda = ${lam}$ per day. The initial state is known to a relative accuracy of $10^{-${e}}$, and the forecast is useless once the relative error reaches 1. The forecast horizon is`, ...o,
        sol: `$10^{-${e}}e^{\\lambda t} = 1$ gives $t = \\dfrac{\\ln 10^{${e}}}{\\lambda} = \\dfrac{${e}\\times2.303}{${lam}} = ${round(t, 1)}$ days. The horizon grows only logarithmically with accuracy: a thousand times better data adds just $\\ln 1000/\\lambda = ${round(Math.log(1000) / lam, 1)}$ days.`,
        trap: 'Use the natural logarithm of the error ratio, divided by $\\lambda$; the horizon is not $1/\\lambda$.' };
    } },
  { id: 'chs-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Lyapunov exponents', format: 'match',
    make(r) {
      const L = { fp: '$(-, -, -)$', lc: '$(0, -, -)$', tor: '$(0, 0, -)$', sa: '$(+, 0, -)$, with negative sum', ham: '$(+, 0, -)$, with sum exactly zero' };
      const cas = choose(r, [
        ['a stable fixed point of a dissipative flow', 'fp', 'All nearby trajectories converge: every direction contracts.'],
        ['a stable limit cycle of a dissipative flow', 'lc', 'Displacements along the cycle neither grow nor shrink (zero exponent); the two transverse directions contract.'],
        ['quasi-periodic motion on an attracting 2-torus', 'tor', 'Two neutral directions along the torus, one contracting towards it.'],
        ['a strange attractor of a dissipative flow (such as Lorenz)', 'sa', 'One stretching direction (chaos), one neutral along the flow, one strongly contracting; volumes shrink, so the sum is negative.'],
        ['a chaotic orbit of a conservative (Hamiltonian-like, volume-preserving) three-dimensional flow', 'ham', 'Stretching and neutral directions as for chaos, but volume preservation forces the exponents to add to zero.'],
      ]);
      return { q: `For a three-dimensional autonomous flow, the signs of the three Lyapunov exponents for ${cas[0]} are`, ...matchOne(r, L, cas),
        trap: 'Every bounded orbit of a flow (other than a fixed point) has one zero exponent, along the direction of motion.' };
    } },
  { id: 'chs-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'fractal dimension',
    make(r) {
      const C = choose(r, [
        ['Start with a segment; remove its middle third; repeat on every remaining piece for ever.', 2, 3],
        ['Start with a segment; divide it into five equal parts and keep only the first, third and fifth; repeat on every piece.', 3, 5],
        ['Start with a segment; divide it into five equal parts and keep only the first and last; repeat on every piece.', 2, 5],
        ['Replace each segment by four segments each one third as long (the Koch curve); repeat.', 4, 3],
        ['Divide a filled triangle into four half-size triangles and remove the middle one; repeat (Sierpinski).', 3, 2],
        ['Divide a filled square into nine equal squares and remove the centre one; repeat (Sierpinski carpet).', 8, 3],
      ]);
      const [txt, N, s] = C, D = Math.log(N) / Math.log(s);
      const o = mcqOptions(r, round(D, 3), shuffle(r, [round(Math.log(s) / Math.log(N), 3), round(N / s, 3), round(Math.log(N) / s, 3), round(D + 0.5, 3)]));
      return { q: `${txt} The box-counting (similarity) dimension of the resulting set is`, ...o,
        sol: `Each step makes $N = ${N}$ copies scaled by $1/${s}$. A self-similar set obeys $N = s^D$, so $D = \\dfrac{\\ln ${N}}{\\ln ${s}} = ${round(D, 3)}$.`,
        trap: 'The dimension is $\\ln(\\text{number of pieces})/\\ln(\\text{magnification})$, not the other way round.' };
    } },
  { id: 'chs-m35', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'period doubling', format: 'estimation',
    make(r) {
      const r1 = choose(r, [1, 2, 3]), gap = choose(r, [0.3, 0.45, 0.6]), r2 = r1 + gap, d = 4.669, inf = r() < 0.5;
      const ans = inf ? r2 + gap / (d - 1) : r2 + gap / d;
      const o = mcqOptions(r, round(ans, 3), shuffle(r, [round(inf ? r2 + gap / d : r2 + gap / (d - 1), 3), round(r2 + gap / 2, 3), round(r2 + gap * d / 10, 3), round(r2 + gap, 3)]));
      return { q: `A one-parameter family of smooth one-hump maps has its first period doubling (1 to 2) at $r_1 = ${r1}$ and the second (2 to 4) at $r_2 = ${round(r2, 2)}$. Using Feigenbaum's constant $\\delta \\approx 4.669$, estimate ${inf ? 'the parameter $r_\\infty$ where the cascade accumulates (onset of chaos)' : 'the third period doubling (4 to 8), $r_3$'}.`, ...o,
        sol: `Successive gaps shrink by $\\delta$: $r_3 - r_2 \\approx (r_2 - r_1)/\\delta = ${gap}/4.669 = ${round(gap / d, 3)}$.${inf ? ` Summing the geometric series of all later gaps, $r_\\infty \\approx r_2 + \\dfrac{r_2 - r_1}{\\delta - 1} = ${round(r2, 2)} + ${round(gap / (d - 1), 3)} = ${round(ans, 3)}$.` : ` So $r_3 \\approx ${round(r2, 2)} + ${round(gap / d, 3)} = ${round(ans, 3)}$.`}`,
        trap: 'The gaps form a geometric series with ratio $1/\\delta$; the accumulation point needs the whole series, $1/(\\delta - 1)$.' };
    } },
];
