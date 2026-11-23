// Extra question shapes for phase-space-stability (templates pss-m31..m35). Imported by phase-space-stability.js.
import { int, choose, mcqOptions, shuffle } from '../_util.js';
import { msqOf, frac, terms } from './_more.js';
import { oneOf, matchOne } from './_odd.js';

export default [
  { id: 'pss-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'classification', format: 'statements',
    make(r) {
      const p = choose(r, [-3, -2, -1, 1, 2, 3]), q = int(r, -3, 3), s = int(r, -3, 3);
      let u = int(r, -3, 3); if (p * u - q * s === 0) u += 1;
      const tau = p + u, D = p * u - q * s, disc = tau * tau - 4 * D, not = r() < 0.5;
      const m = msqOf(r, [
        [`the eigenvalues add up to ${tau} and multiply to ${D}`, true, `Trace $\\tau = ${p} + ${u < 0 ? `(${u})` : u} = ${tau}$ and determinant $\\Delta = ${p}\\cdot${u < 0 ? `(${u})` : u} - ${q < 0 ? `(${q})` : q}\\cdot${s < 0 ? `(${s})` : s} = ${D}$.`],
        ['the origin is a saddle', D < 0, D < 0 ? '$\\Delta \\lt 0$: real eigenvalues of opposite signs.' : `$\\Delta = ${D} \\gt 0$, so it is not a saddle.`],
        ['the origin is asymptotically stable', tau < 0 && D > 0, tau < 0 && D > 0 ? '$\\tau \\lt 0$ and $\\Delta \\gt 0$: both eigenvalues have negative real part.' : `Stability needs $\\tau \\lt 0$ and $\\Delta \\gt 0$; here $\\tau = ${tau}$, $\\Delta = ${D}$.`],
        ['nearby trajectories spiral around the origin', D > 0 && disc < 0 && tau !== 0, `$\\tau^2 - 4\\Delta = ${disc}$${disc < 0 ? (tau !== 0 ? ' is negative and $\\tau \\ne 0$: a spiral.' : ' is negative but $\\tau = 0$: closed orbits (a centre), not a spiral.') : ' is not negative: real eigenvalues, no spiralling.'}`],
        ['the origin is a centre (closed orbits)', tau === 0 && D > 0, tau === 0 && D > 0 ? '$\\tau = 0$, $\\Delta \\gt 0$: purely imaginary eigenvalues.' : 'A centre needs $\\tau = 0$ and $\\Delta \\gt 0$.'],
        ['some trajectories are straight lines through the origin', disc >= 0, disc >= 0 ? 'Real eigenvalues have real eigenvectors, along which trajectories run straight in or out.' : 'Complex eigenvalues have no real eigenvectors: no straight-line trajectories.'],
        ['two distinct trajectories can cross at a point away from the origin', false, 'Solutions of an autonomous system are unique, so trajectories never cross.'],
      ], { not });
      return { q: `For the linear system $\\dot x = ${terms([[p, 'x'], [q, 'y']])}$, $\\dot y = ${terms([[s, 'x'], [u, 'y']])}$, which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Classify with the trace $\\tau$ and determinant $\\Delta$: $\\Delta \\lt 0$ saddle; $\\tau^2 \\lt 4\\Delta$ spiral or centre.' };
    } },
  { id: 'pss-m32', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'one-dimensional flows', format: 'graph in words',
    make(r) {
      const a = int(r, -4, -1), b = int(r, 0, 2), c = b + int(r, 1, 3), sg = r() < 0.5 ? 1 : -1;
      const L = { b: `only $x = ${b}$`, ac: `$x = ${a}$ and $x = ${c}$`, a: `only $x = ${a}$`, all: 'all three', none: 'none of them' };
      const key = sg > 0 ? 'b' : 'ac';
      const fx = (v) => (v === 0 ? 'x' : `(x ${v < 0 ? '+' : '-'} ${Math.abs(v)})`);
      return { q: `For $\\dot x = ${sg < 0 ? '-' : ''}${fx(a)}${fx(b)}${fx(c)}$, which fixed points are stable?`, ...matchOne(r, L, [null, key, `Between the roots the sign of $\\dot x$ alternates. For large positive $x$, $\\dot x$ has the sign ${sg > 0 ? '+' : '−'}. ${sg > 0 ? `So flow goes right beyond ${c} (away from it), left between ${b} and ${c}, right between ${a} and ${b}, and left below ${a}: arrows point into $x = ${b}$ and away from ${a} and ${c}.` : `So flow goes left beyond ${c} (towards it), right between ${b} and ${c}, left between ${a} and ${b}, and right below ${a}: arrows point into $x = ${a}$ and $x = ${c}$ and away from ${b}.`} Equivalently, a fixed point is stable where the graph of $f(x)$ crosses zero going downwards.`]),
        trap: 'Stable means $f\'(x^*) \\lt 0$: the graph of $\\dot x$ against $x$ crosses the axis from above to below.' };
    } },
  { id: 'pss-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'population models',
    make(r) {
      const a = int(r, 1, 6), b = int(r, 1, 6), c = int(r, 1, 6), d = int(r, 1, 6);
      const pt = (x, y) => `$(${x},\\ ${y})$`;
      const ans = pt(frac(c, d), frac(a, b));
      const o = mcqOptions(r, ans, [...shuffle(r, [pt(frac(a, b), frac(c, d)), pt(frac(d, c), frac(b, a)), pt(frac(c, b), frac(a, d)), pt(frac(a, d), frac(c, b))]), pt(0, 0), pt(frac(c, d), 0), pt(0, frac(a, b))]);
      return { q: `Prey $x$ and predators $y$ obey $\\dot x = x(${a} - ${b === 1 ? '' : b}y)$, $\\dot y = y(-${c} + ${d === 1 ? '' : d}x)$. The fixed point where both species coexist is`, ...o,
        sol: `$\\dot x = 0$ with $x \\ne 0$ needs $y = ${frac(a, b)}$; $\\dot y = 0$ with $y \\ne 0$ needs $x = ${frac(c, d)}$. So the point is $(${frac(c, d)}, ${frac(a, b)})$. The linearisation there has eigenvalues $\\pm i\\sqrt{${a * c}}$: a centre, and indeed the populations cycle round it on closed orbits (there is a conserved quantity).`,
        trap: 'The prey equation fixes the predator level and vice versa.' };
    } },
  { id: 'pss-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'index theory', format: 'which is NOT',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['a single stable node', true, 'Index $+1$.'],
        ['a single unstable spiral', true, 'Index $+1$.'],
        ['two nodes and one saddle', true, 'Index $1 + 1 - 1 = +1$.'],
        ['three centres and two saddles', true, 'Index $3 - 2 = +1$.'],
        ['a single saddle', false, 'Index $-1$.'],
        ['two stable nodes and nothing else', false, 'Index $+2$.'],
        ['one node and one saddle', false, 'Index $0$.'],
        ['no fixed points at all', false, 'Index 0: a closed orbit must enclose at least one fixed point.'],
      ], not);
      return { q: `A closed orbit of a smooth planar flow encloses only the fixed points listed. Which list is ${not ? '<b>NOT</b> possible' : 'possible'}?`, ...m,
        trap: 'The fixed points inside a closed orbit must have indices adding to $+1$ (node, spiral, centre: $+1$; saddle: $-1$).' };
    } },
  { id: 'pss-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'phase portraits', format: 'match',
    make(r) {
      const mu = int(r, 1, 3), g = int(r, 1, 3);
      const L = { lc: 'an isolated closed orbit (limit cycle) attracting nearby trajectories', sep: 'centres at the bottom positions and saddles at the top, joined by separatrices', damp: 'spirals into the stable equilibria; the saddles remain', fig8: 'two centres and a saddle, with a figure-eight separatrix', grad: 'no closed orbits at all; every trajectory runs downhill to a fixed point or to infinity', nest: 'a family of nested closed orbits around a centre' };
      const cas = choose(r, [
        [`$\\ddot x - ${mu}(1 - x^2)\\dot x + x = 0$ (van der Pol)`, 'lc', 'Energy is pumped in at small amplitude and removed at large amplitude, so all motions settle onto one closed orbit.'],
        ['$\\ddot\\theta + \\sin\\theta = 0$ (undamped pendulum)', 'sep', 'Libration about $\\theta = 0$ (centres) and rotation outside; the separatrices pass through the saddles at $\\theta = \\pm\\pi$.'],
        [`$\\ddot\\theta + ${g / 10}\\dot\\theta + \\sin\\theta = 0$ (damped pendulum)`, 'damp', 'Damping turns the centres into stable spirals; the inverted positions stay saddles.'],
        ['$\\ddot x - x + x^3 = 0$ (undamped double well)', 'fig8', 'Minima of $V = -x^2/2 + x^4/4$ at $x = \\pm1$ (centres) and a maximum at 0 (saddle); the separatrix through the saddle loops round both wells.'],
        [`$\\dot x = -\\partial U/\\partial x$, $\\dot y = -\\partial U/\\partial y$ for a smooth $U(x, y)$ (a gradient flow)`, 'grad', '$U$ decreases strictly along every non-stationary trajectory, so no trajectory can return to its starting point.'],
        ['$\\dot x = x(2 - y)$, $\\dot y = y(x - 1)$ (Lotka-Volterra) in the positive quadrant', 'nest', 'A conserved quantity $x - \\ln x + y - 2\\ln y$ makes the orbits round $(1, 2)$ closed.'],
      ]);
      return { q: `The phase portrait of ${cas[0]} shows`, ...matchOne(r, L, cas),
        trap: 'Limit cycles need energy input and loss (non-conservative); conservative systems give families of closed orbits instead.' };
    } },
];
