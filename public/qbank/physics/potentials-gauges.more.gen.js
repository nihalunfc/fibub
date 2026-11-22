// Extra question shapes for potentials-gauges (templates pgx-m31..m35). Imported by potentials-gauges.js.
import { int, choose, mcqOptions, shuffle } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne, orderOpts } from './_odd.js';

export default [
  { id: 'pgx-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'gauge transformations', format: 'statements',
    make(r) {
      const k = int(r, 2, 6), not = r() < 0.5;
      const m = msqOf(r, [
        [`$\\vec A$ changes by $${k}t\\,\\hat x$`, true, `$\\nabla\\chi = ${k}t\\,\\hat x$.`],
        [`$V$ changes by $-${k}x$`, true, `$V' = V - \\partial\\chi/\\partial t = V - ${k}x$.`],
        [`$V$ changes by $+${k}x$`, false, `The rule is $V' = V - \\partial_t\\chi$, giving $-${k}x$.`],
        ['$\\vec E$ and $\\vec B$ are unchanged', true, 'Any gauge transformation leaves the fields alone.'],
        ['the Lorenz condition, if it held before, still holds', true, `$\\nabla^2\\chi - \\dfrac{1}{c^2}\\partial_t^2\\chi = 0 - 0 = 0$, so $\\chi$ solves the wave equation and the condition survives.`],
        ['the Coulomb condition $\\nabla\\cdot\\vec A = 0$, if it held before, still holds', true, `$\\nabla^2\\chi = 0$ for $\\chi = ${k}xt$.`],
        ['the force on a charge changes', false, 'The Lorentz force depends only on $\\vec E$ and $\\vec B$.'],
      ], { not });
      return { q: `Potentials $(V, \\vec A)$ are changed by the gauge function $\\chi = ${k}xt$ (that is, $\\vec A' = \\vec A + \\nabla\\chi$, $V' = V - \\partial\\chi/\\partial t$). Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Watch the sign in $V\' = V - \\partial_t\\chi$; fields never change under a gauge transformation.' };
    } },
  { id: 'pgx-m32', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'fields from potentials',
    make(r) {
      const a = int(r, -4, 4), b = int(r, -4, 4) || 5, c = a === b ? a + 1 : a;
      const f = (v, s) => (v === 0 ? '0' : v === 1 ? s : v === -1 ? `-${s}` : `${v}${s}`);
      const B = (v) => (v === 0 ? '$\\vec B = 0$' : `$${v}\\,\\hat z$ T`);
      const o = mcqOptions(r, B(b - c), shuffle(r, [B(c - b), B(b + c), B(-b - c), B(b), B(c)]));
      return { q: `In a region with $V = 0$ the vector potential is $\\vec A = (${f(c, 'y')},\\ ${f(b, 'x')},\\ 0)$ (constants in tesla). The magnetic field is`, ...o,
        sol: `$\\vec B = \\nabla\\times\\vec A$ has only a $z$-component: $B_z = \\partial_xA_y - \\partial_yA_x = ${b} - ${c < 0 ? `(${c})` : c} = ${b - c}$ T. Since $\\vec A$ does not depend on time, $\\vec E = 0$.`,
        trap: '$B_z = \\partial_xA_y - \\partial_yA_x$: the order of the two terms fixes the sign.' };
    } },
  { id: 'pgx-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'potentials of sources', format: 'match',
    make(r) {
      const L = {
        unifB: 'a uniform magnetic field $B_0\\hat z$',
        unifE: 'a uniform electric field $E_0\\hat z$, static',
        wire: 'the field of a long straight wire along $z$ carrying a current',
        wave: 'a plane electromagnetic wave travelling along $z$',
        none: 'no field at all (pure gauge)',
        sol: 'zero field where the charge moves, but a non-zero flux inside a long solenoid along $z$',
      };
      const cas = choose(r, [
        ['$V = 0$, $\\vec A = \\tfrac12B_0(-y, x, 0)$', 'unifB', '$\\nabla\\times\\vec A = B_0\\hat z$, and nothing depends on time.'],
        ['$V = -E_0z$, $\\vec A = 0$', 'unifE', '$\\vec E = -\\nabla V = E_0\\hat z$.'],
        ['$V = 0$, $\\vec A = -E_0t\\,\\hat z$', 'unifE', '$\\vec E = -\\partial\\vec A/\\partial t = E_0\\hat z$ and $\\nabla\\times\\vec A = 0$: the same field as $V = -E_0z$, in another gauge.'],
        ['$V = 0$, $\\vec A = -\\dfrac{\\mu_0I}{2\\pi}\\ln s\\,\\hat z$', 'wire', '$\\nabla\\times\\vec A = \\dfrac{\\mu_0I}{2\\pi s}\\hat\\phi$.'],
        ['$V = 0$, $\\vec A = A_0\\cos(kz - \\omega t)\\,\\hat x$', 'wave', 'Both $\\vec E$ along $x$ and $\\vec B$ along $y$ are non-zero and depend on $kz - \\omega t$.'],
        ['$V = -\\alpha x$, $\\vec A = \\alpha t\\,\\hat x$', 'none', '$\\vec E = -\\nabla V - \\partial_t\\vec A = \\alpha\\hat x - \\alpha\\hat x = 0$ and $\\nabla\\times\\vec A = 0$: these are the gradient and time derivative of $\\chi = \\alpha xt$, a pure gauge.'],
        ['$V = 0$, $\\vec A = \\dfrac{\\Phi}{2\\pi s}\\hat\\phi$ for $s$ outside a solenoid of radius $R$', 'sol', '$\\nabla\\times\\vec A = 0$ for $s \\gt R$, yet $\\oint\\vec A\\cdot d\\vec l = \\Phi$: the flux is hidden inside.'],
      ]);
      return { q: `The potentials ${cas[0]} describe`, ...matchOne(r, L, cas),
        trap: 'Compute $\\vec B = \\nabla\\times\\vec A$ and $\\vec E = -\\nabla V - \\partial_t\\vec A$; different potentials can give the same field.' };
    } },
  { id: 'pgx-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Aharonov-Bohm effect', format: 'order of magnitude',
    make(r) {
      const C = choose(r, [[1e-3, 1e-6, '1 mT', '1 μm'], [1, 1e-6, '1 T', '1 μm'], [0.1, 1e-5, '0.1 T', '10 μm'], [1e-5, 1e-3, '10 μT', '1 mm'], [5e-5, 1e-2, '50 μT (the Earth\'s field)', '1 cm']]);
      const [B, d, bs, ds] = C, Phi = B * (Math.PI * d * d) / 4, N = Phi / 4.14e-15, o = orderOpts(r, N);
      return { q: `In an Aharonov-Bohm experiment electrons pass either side of a tiny solenoid whose field ${bs} fills a circle of diameter ${ds}. The interference pattern shifts by a number of fringes of order`, ...o,
        sol: `The fringe shift is $\\Phi/(h/e)$ with $h/e = 4.14\\times10^{-15}$ Wb. Here $\\Phi = B\\pi d^2/4 \\approx ${(Phi / 10 ** Math.floor(Math.log10(Phi))).toFixed(1)}\\times10^{${Math.floor(Math.log10(Phi))}}$ Wb, so $N \\approx ${(N / 10 ** o.n).toFixed(1)}\\times10^{${o.n}}$. The flux quantum is tiny, so even weak fields over small areas move the fringes noticeably.`,
        trap: 'Use the flux quantum $h/e \\approx 4\\times10^{-15}$ Wb (or $h/2e$ for Cooper pairs).' };
    } },
  { id: 'pgx-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'gauge invariance', format: 'which is NOT',
    make(r) {
      const not = r() < 0.6;
      const m = oneOf(r, [
        ['$\\oint\\vec A\\cdot d\\vec l$ round a closed loop is gauge invariant', true, 'It equals the flux through the loop.'],
        ['$\\vec E = -\\nabla V - \\partial\\vec A/\\partial t$ is gauge invariant', true, 'The changes $-\\nabla(-\\partial_t\\chi)$ and $-\\partial_t\\nabla\\chi$ cancel.'],
        ['in Coulomb gauge $V$ is the instantaneous Coulomb potential of the charges', true, '$\\nabla^2V = -\\rho/\\varepsilon_0$ with no retardation.'],
        ['in Lorenz gauge both $V$ and $\\vec A$ obey wave equations with sources', true, '$\\Box V = -\\rho/\\varepsilon_0$, $\\Box\\vec A = -\\mu_0\\vec J$.'],
        ['the value of $\\vec A$ at a single point is gauge invariant', false, 'Adding $\\nabla\\chi$ changes it.'],
        ['in Coulomb gauge the potential $V$ travels at speed $c$, so causality is broken', false, '$V$ is instantaneous but not measurable; the fields $\\vec E$ and $\\vec B$ are still retarded.'],
        ['the Lorenz condition fixes the potentials completely', false, 'Any $\\chi$ with $\\Box\\chi = 0$ is still allowed.'],
      ], not);
      return { q: `Which statement about electromagnetic potentials and gauges is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Only quantities built from fields (or loop integrals of $\\vec A$) are physical.' };
    } },
];
