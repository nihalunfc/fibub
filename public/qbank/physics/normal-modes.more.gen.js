// Extra question shapes for normal-modes (templates nm-m31..m35). Imported by normal-modes.js.
import { int, choose, mcqOptions, shuffle, round } from '../_util.js';
import { msqOf } from './_more.js';
import { matchOne, orderOpts } from './_odd.js';

export default [
  { id: 'nm-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'coupled oscillators', format: 'statements',
    make(r) {
      const m = choose(r, [0.5, 1, 2]), k = choose(r, [8, 18, 32, 50]), kc = choose(r, [1, 2, 4]), not = r() < 0.5;
      const w1 = Math.sqrt(k / m), w2 = Math.sqrt((k + 2 * kc) / m), wbad = Math.sqrt((k + kc) / m);
      const s = msqOf(r, [
        ['in the lower mode the two masses move in step (same displacement)', true, 'With equal displacements the middle spring is never stretched, so it plays no part.'],
        [`the lower mode has angular frequency $${round(w1, 3)}$ rad/s`, true, `$\\omega_1 = \\sqrt{k/m} = \\sqrt{${k}/${m}} = ${round(w1, 3)}$ rad/s.`],
        [`the higher mode has angular frequency $${round(w2, 3)}$ rad/s`, true, `In the opposite-phase mode each mass feels $k + 2k_c$: $\\omega_2 = \\sqrt{(${k} + ${2 * kc})/${m}} = ${round(w2, 3)}$ rad/s.`],
        [`the higher mode has angular frequency $${round(wbad, 3)}$ rad/s`, false, `The middle spring is stretched by twice each displacement, giving $k + 2k_c$, not $k + k_c$: $${round(w2, 3)}$ rad/s.`],
        ['in the higher mode the masses move in step', false, 'They move in opposite directions with equal amplitude.'],
        ['if only one mass is displaced and released, its energy passes completely to the other and back, again and again', true, 'Equal masses: the motion is an equal mix of the two modes, which beat with complete exchange.'],
        [`the time for the energy to pass completely from one mass to the other is $${round(Math.PI / (w2 - w1), 2)}$ s`, true, `Half a beat period: $\\pi/(\\omega_2 - \\omega_1) = \\pi/${round(w2 - w1, 4)} = ${round(Math.PI / (w2 - w1), 2)}$ s.`],
        ['any motion is a superposition of the two normal modes', true, 'The two mode vectors form a basis for the two coordinates.'],
      ], { not });
      return { q: `Two masses of ${m} kg on a smooth track are each tied to a wall by a spring of stiffness ${k} N/m and to each other by a spring of stiffness ${kc} N/m (wall-spring-mass-spring-mass-spring-wall). Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...s,
        trap: 'In the antisymmetric mode the coupling spring is stretched by twice the displacement, so it adds $2k_c$.' };
    } },
  { id: 'nm-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'ring of masses',
    make(r) {
      const N = int(r, 3, 9), ans = Math.floor(N / 2);
      const o = mcqOptions(r, ans, shuffle(r, [N, N - 1, ans + 1, N - 2, Math.ceil(N / 2) === ans ? ans - 1 : Math.ceil(N / 2)].filter((v) => v > 0 && v !== ans)));
      return { q: `${N} identical masses slide on a smooth circular hoop, each joined to its two neighbours by identical springs (a closed ring). How many <b>different non-zero</b> normal-mode frequencies are there?`, ...o,
        sol: `Modes are waves round the ring, $x_j \\propto e^{2\\pi ijn/${N}}$ with $n = 0, 1, \\dots, ${N - 1}$ and $\\omega_n = 2\\sqrt{k/m}\\,|\\sin(\\pi n/${N})|$. $n = 0$ is rigid rotation ($\\omega = 0$). Modes $n$ and $${N} - n$ (waves going opposite ways) have the same frequency, so the distinct non-zero frequencies are $n = 1, \\dots, ${ans}$: ${ans} of them${N % 2 === 0 ? `, the highest ($n = ${N / 2}$, neighbours in antiphase) being non-degenerate` : ', each doubly degenerate'}.`,
        trap: 'Waves going clockwise and anticlockwise have equal frequencies; and the rigid rotation has $\\omega = 0$.' };
    } },
  { id: 'nm-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'checking answers', format: 'limiting case',
    make(r) {
      const S = choose(r, [
        ['Two masses $m_1$ and $m_2$ on a smooth surface are joined by a spring $k$ and are otherwise free. The non-zero normal-mode frequency',
          '$\\sqrt{\\dfrac{k(m_1 + m_2)}{m_1m_2}}$',
          ['$\\sqrt{\\dfrac{k}{m_1 + m_2}}$', '$\\sqrt{\\dfrac{2k}{m_1 + m_2}}$', '$\\sqrt{\\dfrac{km_1m_2}{m_1 + m_2}}$', '$\\sqrt{\\dfrac{k(m_1 + m_2)}{m_1^2}}$'],
          'Checks: as $m_2 \\to \\infty$ (a wall) it must become $\\sqrt{k/m_1}$; for equal masses each half-spring of stiffness $2k$ holds one mass, giving $\\sqrt{2k/m}$; it must be symmetric in $m_1, m_2$ and have dimensions of $\\sqrt{k/m}$. Only $\\sqrt{k/\\mu}$ with $\\mu = m_1m_2/(m_1 + m_2)$ passes all of these.'],
        ['A pendulum (bob $m$, length $l$) hangs from a cart of mass $M$ that rolls freely on a horizontal track. The small-oscillation frequency',
          '$\\sqrt{\\dfrac{(M + m)g}{Ml}}$',
          ['$\\sqrt{\\dfrac{(M + m)g}{ml}}$', '$\\sqrt{\\dfrac{Mg}{(M + m)l}}$', '$\\sqrt{\\dfrac{g}{l}}$', '$\\sqrt{\\dfrac{(M + m)g}{M}}$'],
          'Checks: as $M \\to \\infty$ (fixed support) it must become $\\sqrt{g/l}$; for a light bob $m \\to 0$ also $\\sqrt{g/l}$; a light cart lets the bob swing about the centre of mass, which raises the frequency; dimensions must be those of $\\sqrt{g/l}$. Only the answer passes all of them ($\\sqrt{g/l}$ itself fails to depend on $M$ at all, which is wrong for a light cart).'],
        ['A mass $m$ hangs from two springs $k_1$ and $k_2$ joined end to end (in series). The oscillation frequency',
          '$\\sqrt{\\dfrac{k_1k_2}{m(k_1 + k_2)}}$',
          ['$\\sqrt{\\dfrac{k_1 + k_2}{m}}$', '$\\sqrt{\\dfrac{k_1k_2}{m}}$', '$\\sqrt{\\dfrac{k_1 + k_2}{mk_1k_2}}$', '$\\sqrt{\\dfrac{k_1 - k_2}{m}}$'],
          'Checks: if $k_2 \\to \\infty$ (a rigid link) it must become $\\sqrt{k_1/m}$; it must be symmetric in $k_1, k_2$; two equal springs in series are half as stiff, giving $\\sqrt{k/2m}$; dimensions must be $\\sqrt{k/m}$. Only the series combination $k_1k_2/(k_1 + k_2)$ passes.'],
      ]);
      const o = mcqOptions(r, S[1], shuffle(r, S[2]));
      return { q: `${S[0]} is one of the expressions below. Using only dimensions and limiting cases, which one can it be?`, ...o, sol: S[3],
        trap: 'Send one parameter to zero or infinity and see whether a familiar simpler system appears.' };
    } },
  { id: 'nm-m34', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'molecules', format: 'order of magnitude',
    make(r) {
      const u = 1.66053906660e-27;
      const M = choose(r, [['H$_2$', 575, 0.504], ['HCl', 516, 0.980], ['CO', 1902, 6.86], ['N$_2$', 2294, 7.00], ['I$_2$', 172, 63.45]]);
      const nu = Math.sqrt(M[1] / (M[2] * u)) / (2 * Math.PI), o = orderOpts(r, nu, '\\text{Hz}');
      return { q: `The bond of the ${M[0]} molecule acts like a spring of stiffness about ${M[1]} N/m, and the reduced mass of the pair is ${M[2]} u ($1\\ \\text{u} = 1.66\\times10^{-27}$ kg). The vibration frequency $\\nu$ is of order`, ...o,
        sol: `$\\nu = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{k}{\\mu}} = \\dfrac{1}{2\\pi}\\sqrt{\\dfrac{${M[1]}}{${M[2]}\\times1.66\\times10^{-27}}} \\approx ${(nu / 10 ** o.n).toFixed(1)}\\times10^{${o.n}}$ Hz, of order $10^{${o.n}}$ Hz: infrared, as molecular vibrations are.`,
        trap: 'Use the reduced mass in kilograms and do not forget the $2\\pi$ between $\\omega$ and $\\nu$.' };
    } },
  { id: 'nm-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'stability of equilibrium', format: 'match',
    make(r) {
      const a = int(r, 2, 6), kind = choose(r, ['two', 'zero', 'deg', 'unst']);
      const b = { two: int(r, 1, a - 1), zero: a, deg: 0, unst: a + int(r, 1, 3) }[kind];
      const L = { two: 'two different positive values of $\\omega^2$: stable oscillation in two distinct modes', zero: 'one mode with $\\omega = 0$: the system can drift freely', deg: 'one repeated frequency: every displacement vector is a normal mode', unst: 'one negative $\\omega^2$: that mode grows exponentially, so the equilibrium is unstable' };
      return { q: `Small oscillations of a system with unit masses obey $\\ddot{\\vec q} = -K\\vec q$ with $K = \\begin{pmatrix} ${a} & ${-b} \\\\ ${-b} & ${a} \\end{pmatrix}$. The normal-mode spectrum has`, ...matchOne(r, L, [null, kind, `$K$ has eigenvalues $\\omega^2 = ${a} \\mp ${b}$, i.e. $${a - b}$ and $${a + b}$, with eigenvectors $(1, 1)$ and $(1, -1)$. ${kind === 'two' ? 'Both are positive and different.' : kind === 'zero' ? 'One is zero: the in-step motion $(1, 1)$ costs no restoring force.' : kind === 'deg' ? 'They are equal, so any combination of the two eigenvectors is also a mode.' : `$${a - b} \\lt 0$: the in-step mode grows like $e^{${'\\sqrt{' + (b - a) + '}'}t}$.`}`]),
        trap: 'Look at the eigenvalues of $K$ (here $a \\mp b$): their signs decide stability, and equal values mean degeneracy.' };
    } },
];
