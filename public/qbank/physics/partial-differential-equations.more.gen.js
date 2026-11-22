// Extra question shapes for partial-differential-equations (templates pde-m31..m35). Imported by partial-differential-equations.js.
import { int, choose, mcqOptions, shuffle } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne } from './_odd.js';

export default [
  { id: 'pde-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'heat equation', format: 'statements',
    make(r) {
      const m = int(r, 2, 4), k = int(r, 2, 3), not = r() < 0.5;
      const s = msqOf(r, [
        [`the mode $\\sin(${m}\\pi x/L)$ decays ${m * m} times faster than $\\sin(\\pi x/L)$`, true, `Mode $n$ decays as $e^{-\\kappa(n\\pi/L)^2t}$, so the rate grows as $n^2 = ${m * m}$.`],
        [`the mode $\\sin(${m}\\pi x/L)$ decays ${m} times faster than $\\sin(\\pi x/L)$`, false, `The rate goes as $n^2$, so it is ${m * m} times faster, not ${m}.`],
        [`making the rod ${k} times longer makes the slowest decay time ${k * k} times longer`, true, `The slowest time is $L^2/(\\pi^2\\kappa)$, which scales as $L^2$.`],
        [`making the rod ${k} times longer makes the slowest decay time ${k} times longer`, false, `Diffusion times scale as $L^2$: a factor ${k * k}.`],
        ['the total heat $\\int_0^L u\\,dx$ stays constant in time', false, 'Heat flows out through the ends held at zero, so the total falls.'],
        ['the maximum of $u$ over the rod can never increase', true, 'Maximum principle: with no sources and zero boundary values, a new interior maximum cannot form.'],
        ['for large $t$ the profile approaches a multiple of $\\sin(\\pi x/L)$', true, 'All higher modes have died away faster than the first.'],
        ['the solution can be run backwards in time for any smooth initial profile', false, 'Backwards, high modes grow as $e^{+\\kappa n^2\\pi^2t/L^2}$: the backward heat problem is ill-posed.'],
      ], { not });
      return { q: `A rod $0 \\le x \\le L$ obeys $u_t = \\kappa u_{xx}$ with $u = 0$ at both ends and a smooth positive initial profile. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...s,
        trap: 'Heat-equation rates go as (wavenumber)$^2$, so lengths enter squared.' };
    } },
  { id: 'pde-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'behaviour of solutions', format: 'match',
    make(r) {
      const c = int(r, 2, 6), v = int(r, 2, 6), g = int(r, 1, 3);
      const L = {
        diff: 'an initial bump spreads out and flattens, irreversibly',
        wave: `an initial bump splits into two halves travelling at speed ${c} in opposite directions, keeping their shape`,
        adv: `an initial bump moves at speed ${v} in one direction without changing shape`,
        lap: 'nothing evolves: the solution is an equilibrium and equals the average of its values on any circle around a point',
        disp: 'a wavepacket moves and spreads, while $\\int|u|^2dx$ stays constant',
        damp: 'disturbances travel as waves whose amplitude dies away in time',
      };
      const cas = choose(r, [
        [`u_t = ${c}u_{xx}`, 'diff', 'The heat (diffusion) equation: each Fourier mode decays as $e^{-Dk^2t}$, short wavelengths fastest, so bumps smooth out.'],
        [`u_{tt} = ${c * c}u_{xx}`, 'wave', `The wave equation: d'Alembert's solution $f(x - ${c}t) + g(x + ${c}t)$; released from rest, a bump splits into two equal halves.`],
        [`u_t + ${v}u_x = 0`, 'adv', `The advection equation: $u = f(x - ${v}t)$, constant along the lines $x - ${v}t = $ const.`],
        ['u_{xx} + u_{yy} = 0', 'lap', 'Laplace\'s equation has no time: harmonic functions have the mean-value property.'],
        ['iu_t = -u_{xx}', 'disp', 'The free Schrödinger equation: modes $e^{i(kx - k^2t)}$ have $k$-dependent speeds (dispersion), and the norm is conserved.'],
        [`u_{tt} + ${2 * g}u_t = ${c * c}u_{xx}`, 'damp', `The telegraph (damped wave) equation: waves at speed ${c}, with amplitudes falling roughly as $e^{-${g}t}$.`],
      ]);
      return { q: `Which description fits solutions of $${cas[0]}$?`, ...matchOne(r, L, cas),
        trap: 'One time derivative (with a second space derivative) means diffusion; two means waves.' };
    } },
  { id: 'pde-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'steady states', format: 'limiting case',
    make(r) {
      const T1 = choose(r, [10, 20, 30, 40]), T2 = T1 + choose(r, [20, 40, 60]);
      const L = {
        uni1: `uniform at ${T1} °C`,
        lin: `linear, from ${T1} °C at one end to ${T2} °C at the other`,
        para: `a parabola, highest in the middle, with ${T1} °C at both ends`,
        unimid: `uniform at ${(T1 + T2) / 2} °C`,
        exp: `sagging below the end values in the middle, like $\\cosh$`,
      };
      const cas = choose(r, [
        [`one end is held at ${T1} °C and the other end is insulated`, 'uni1', `Steady: $u'' = 0$, so $u = A + Bx$. The insulated end needs $u' = 0$, so $B = 0$ and $u = ${T1}$ everywhere.`],
        [`the ends are held at ${T1} °C and ${T2} °C`, 'lin', '$u\'\' = 0$ with two fixed end values gives a straight line.'],
        [`both ends are held at ${T1} °C and heat is generated uniformly inside the rod`, 'para', 'Steady: $\\kappa u\'\' = -q$, a constant, so $u$ is a downward parabola with equal end values: hottest in the middle.'],
        [`both ends are held at ${T2} °C and the surface loses heat to surrounding air at ${T1} °C`, 'exp', `Steady: $u'' = h(u - ${T1})$ gives $u - ${T1} \\propto \\cosh(\\sqrt h(x - L/2))$, lowest in the middle, between ${T1} and ${T2} °C.`],
      ]);
      return { q: `A rod has no heat loss through its sides unless stated, and ${cas[0]}. Long after, the temperature profile along the rod is`, ...matchOne(r, L, cas),
        trap: 'An insulated end means zero gradient there, not zero temperature.' };
    } },
  { id: 'pde-m34', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'wave equation', format: 'which is NOT',
    make(r) {
      const c = int(r, 2, 4), k = int(r, 2, 3), not = r() < 0.6;
      const m = oneOf(r, [
        [`$\\sin ${k}x\\,\\cos ${k * c}t$`, true, `$u_{tt} = -${k * k * c * c}u$ and $${c * c}u_{xx} = ${c * c}(-${k * k})u$: equal.`],
        [`$e^{-(x - ${c}t)^2}$`, true, `Any $f(x - ${c}t)$ is a right-moving solution.`],
        [`$\\cosh(x + ${c}t)$`, true, `Any $g(x + ${c}t)$ is a left-moving solution.`],
        [`$x^2 + ${c * c}t^2$`, true, `$u_{tt} = ${2 * c * c}$ and $${c * c}u_{xx} = ${2 * c * c}$.`],
        ['$xt$', true, 'Both $u_{tt}$ and $u_{xx}$ vanish.'],
        [`$\\sin ${k}x\\,\\cos ${k}t$`, false, `$u_{tt} = -${k * k}u$ but $${c * c}u_{xx} = -${k * k * c * c}u$: the frequency must be $${k * c}$, not $${k}$.`],
        [`$x^2 - ${c * c}t^2$`, false, `$u_{tt} = -${2 * c * c}$ but $${c * c}u_{xx} = +${2 * c * c}$.`],
        [`$e^{-${k * k}t}\\sin ${k}x$`, false, `This solves a heat equation: $u_{tt} = ${k ** 4}u$ while $${c * c}u_{xx} = -${k * k * c * c}u$.`],
      ], not);
      return { q: `Which function is ${not ? '<b>NOT</b> a solution' : 'a solution'} of $u_{tt} = ${c * c}u_{xx}$?`, ...m,
        trap: 'Substitute: the wave equation needs $\\omega = ck$ for products $\\sin kx\\cos\\omega t$, and any function of $x \\pm ct$ works.' };
    } },
  { id: 'pde-m35', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'membrane modes', format: 'degeneracy',
    make(r) {
      const S = choose(r, [5, 8, 10, 13, 18, 25, 50, 65, 85]);
      let cnt = 0; const pairs = [];
      for (let a = 1; a * a < S; a++) { const b = Math.round(Math.sqrt(S - a * a)); if (b >= 1 && a * a + b * b === S) { cnt++; pairs.push(`(${a}, ${b})`); } }
      const o = mcqOptions(r, cnt, shuffle(r, [cnt + 1, cnt - 1, cnt + 2, 2 * cnt, 1].filter((v) => v >= 1 && v !== cnt)));
      const ratio = Math.sqrt(S / 2).toFixed(3);
      return { q: `A square drum of side $L$ (edges fixed) has modes $\\sin(m\\pi x/L)\\sin(n\\pi y/L)$, $m, n \\ge 1$. How many modes $(m, n)$ have frequency $\\sqrt{${S}/2} \\approx ${ratio}$ times the fundamental?`, ...o,
        sol: `The frequencies are $\\omega_{mn} = \\dfrac{c\\pi}{L}\\sqrt{m^2 + n^2}$, and the fundamental (1, 1) has $\\sqrt2$. So we need $m^2 + n^2 = ${S}$ with $m, n \\ge 1$: ${pairs.join(', ')}. That is ${cnt} mode${cnt === 1 ? '' : 's'}. (Pairs $(m, n)$ and $(n, m)$ are different modes with the same frequency: the square's symmetry causes the degeneracy.)`,
        trap: 'Count $(m, n)$ and $(n, m)$ separately, and remember some numbers are sums of two squares in more than one way.' };
    } },
];
