// Extra question shapes for covariant-electrodynamics (templates ced-m31..m35). Imported by covariant-electrodynamics.js.
import { int, choose, mcqOptions, shuffle, round } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne, orderOpts } from './_odd.js';

export default [
  { id: 'ced-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'field invariants', format: 'statements',
    make(r) {
      // Fields in units where c = 1: E = (Ex, Ey, 0), B = (0, 0, Bz) or along x.
      const Ex = int(r, 0, 4), Ey = int(r, 1, 4), Bz = int(r, 1, 5), Bx = r() < 0.5 ? 0 : int(r, 1, 3), not = r() < 0.5;
      const dot = Ex * Bx, inv = Ex * Ex + Ey * Ey - Bx * Bx - Bz * Bz;
      const m = msqOf(r, [
        [`$\\vec E\\cdot\\vec B = ${dot}$ in every inertial frame`, true, `$\\vec E\\cdot\\vec B = ${Ex}\\times${Bx} = ${dot}$, a Lorentz invariant.`],
        [`$E^2 - c^2B^2 = ${inv}$ in every inertial frame`, true, `$${Ex * Ex + Ey * Ey} - ${Bx * Bx + Bz * Bz} = ${inv}$, a Lorentz invariant.`],
        ['some frame sees a purely magnetic field', dot === 0 && inv < 0, dot === 0 && inv < 0 ? '$\\vec E\\cdot\\vec B = 0$ and $E^2 \\lt c^2B^2$.' : 'That needs $\\vec E\\cdot\\vec B = 0$ and $E^2 \\lt c^2B^2$.'],
        ['some frame sees a purely electric field', dot === 0 && inv > 0, dot === 0 && inv > 0 ? '$\\vec E\\cdot\\vec B = 0$ and $E^2 \\gt c^2B^2$.' : 'That needs $\\vec E\\cdot\\vec B = 0$ and $E^2 \\gt c^2B^2$.'],
        ['some frame sees $\\vec E$ and $\\vec B$ perpendicular', dot === 0, dot === 0 ? 'They are already perpendicular, and $\\vec E\\cdot\\vec B$ is invariant.' : '$\\vec E\\cdot\\vec B \\ne 0$ in every frame, so they can never be perpendicular.'],
        ['some frame sees both fields vanish', false, '$F^{\\mu\\nu}$ transforms linearly, so a field that is non-zero in one frame is non-zero in every frame.'],
        ['the magnitude $|\\vec E|$ is the same in every inertial frame', false, 'Only the combinations $\\vec E\\cdot\\vec B$ and $E^2 - c^2B^2$ are invariant.'],
      ], { not });
      return { q: `In one inertial frame $\\vec E = (${Ex}, ${Ey}, 0)$ and $c\\vec B = (${Bx}, 0, ${Bz})$ in the same units. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The two invariants are $\\vec E\\cdot\\vec B$ and $E^2 - c^2B^2$; their signs decide what other observers can see.' };
    } },
  { id: 'ced-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'field transformations',
    make(r) {
      const beta = choose(r, [0.6, 0.8]), g = beta === 0.6 ? 1.25 : 5 / 3, Ey = int(r, 2, 9) * 3, cBz = int(r, 1, 9) * 3;
      const ans = round(g * (Ey - beta * cBz), 2);
      const o = mcqOptions(r, ans, shuffle(r, [round(g * (Ey + beta * cBz), 2), round(Ey - beta * cBz, 2), round((Ey - beta * cBz) / g, 2), Ey, round(g * Ey, 2)]), (v) => `$${v}$ kV/m`);
      return { q: `In frame S, $E_y = ${Ey}$ kV/m and $cB_z = ${cBz}$ kV/m (all other components zero). Frame S$'$ moves at $v = ${beta}c$ along $+x$. In S$'$, $E'_y$ is`, ...o,
        sol: `$E'_y = \\gamma(E_y - vB_z) = \\gamma(E_y - \\beta cB_z) = ${g === 1.25 ? '1.25' : '\\tfrac53'}\\times(${Ey} - ${beta}\\times${cBz}) = ${ans}$ kV/m. The parallel component $E_x$ would be unchanged; the perpendicular ones mix with $\\vec B$.`,
        trap: 'Perpendicular components get the factor $\\gamma$ and mix with $\\vec v\\times\\vec B$; parallel ones do not change.' };
    } },
  { id: 'ced-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'covariant objects', format: 'match',
    make(r) {
      const L = {
        cons: 'charge conservation (the continuity equation)',
        inhom: 'Gauss\'s law and the Ampère-Maxwell law',
        hom: 'Faraday\'s law and $\\nabla\\cdot\\vec B = 0$',
        lor: 'the Lorenz gauge condition',
        force: 'the Lorentz force law',
        inv: 'the invariant $-2(E^2/c^2 - B^2)$, up to sign convention',
      };
      const cas = choose(r, [
        ['$\\partial_\\mu J^\\mu = 0$', 'cons', '$\\partial_t\\rho + \\nabla\\cdot\\vec J = 0$.'],
        ['$\\partial_\\mu F^{\\mu\\nu} = \\mu_0J^\\nu$', 'inhom', 'Its time component is Gauss\'s law, its space components Ampère-Maxwell.'],
        ['$\\partial_\\lambda F_{\\mu\\nu} + \\partial_\\mu F_{\\nu\\lambda} + \\partial_\\nu F_{\\lambda\\mu} = 0$', 'hom', 'The Bianchi identity holds automatically once $F = dA$; it contains the two source-free equations.'],
        ['$\\partial_\\mu A^\\mu = 0$', 'lor', 'In components $\\dfrac{1}{c^2}\\partial_tV + \\nabla\\cdot\\vec A = 0$.'],
        ['$\\dfrac{dp^\\mu}{d\\tau} = qF^{\\mu\\nu}u_\\nu$', 'force', 'Its space part is $q(\\vec E + \\vec v\\times\\vec B)$ times $\\gamma$; the time part is the power.'],
        ['$F_{\\mu\\nu}F^{\\mu\\nu}$', 'inv', 'A full contraction is a scalar; it equals $2(B^2 - E^2/c^2)$.'],
      ]);
      return { q: `The covariant expression ${cas[0]} is equivalent to`, ...matchOne(r, L, cas),
        trap: 'Sources appear only in $\\partial_\\mu F^{\\mu\\nu} = \\mu_0J^\\nu$; the other pair follow from $F = \\partial A - \\partial A$.' };
    } },
  { id: 'ced-m34', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'moving frames', format: 'order of magnitude',
    make(r) {
      const C = choose(r, [[1e4, 90, '10 kV/m', '90 m/s'], [1e6, 250, '1 MV/m', '250 m/s (an airliner)'], [300, 3e4, '300 V/m', '30 km/s (the Earth\'s orbital speed)'], [3e6, 3e6, '3 MV/m', '3000 km/s'], [1e3, 1e3, '1 kV/m', '1 km/s']]);
      const [E, v, es, vs] = C, B = (v * E) / 9e16, o = orderOpts(r, B, '\\text{T}');
      return { q: `A region has a static electric field of ${es} and no magnetic field. An observer moving at ${vs} perpendicular to the field measures a magnetic field of order`, ...o,
        sol: `For $v \\ll c$, $\\vec B' \\approx -\\vec v\\times\\vec E/c^2$, so $B' \\approx vE/c^2 = ${v}\\times${E}/(9\\times10^{16}) \\approx ${(B / 10 ** o.n).toFixed(1)}\\times10^{${o.n}}$ T. The $1/c^2$ makes it tiny at everyday speeds.`,
        trap: 'Divide by $c^2$, not $c$: $B\' \\approx vE/c^2$.' };
    } },
  { id: 'ced-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'four-vectors', format: 'which is NOT',
    make(r) {
      const not = r() < 0.6;
      const m = oneOf(r, [
        ['$(c\\rho, \\vec J)$ is a four-vector', true, 'The four-current $J^\\mu$.'],
        ['$(V/c, \\vec A)$ is a four-vector', true, 'The four-potential $A^\\mu$.'],
        ['$F^{\\mu\\nu}$ is antisymmetric with 6 independent components', true, 'Three of $\\vec E$ and three of $\\vec B$.'],
        ['electric charge is a Lorentz invariant', true, 'It follows from $\\partial_\\mu J^\\mu = 0$.'],
        ['$(\\vec E, \\vec B)$ together form a four-vector', false, 'They are the six components of the tensor $F^{\\mu\\nu}$.'],
        ['charge density $\\rho$ is a Lorentz invariant', false, 'It is the time part of $J^\\mu$ and grows by $\\gamma$ (length contraction).'],
        ['$F^{\\mu\\nu}$ is symmetric', false, 'It is antisymmetric: $F^{\\nu\\mu} = -F^{\\mu\\nu}$.'],
      ], not);
      return { q: `Which statement about the relativistic formulation of electrodynamics is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Charge is invariant, but charge density is not; fields form a rank-2 tensor, not a four-vector.' };
    } },
];
