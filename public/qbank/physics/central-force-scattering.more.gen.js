// Extra question shapes for central-force-scattering (templates cfs-m31..m35). Imported by central-force-scattering.js.
import { int, choose, mcqOptions, shuffle, round } from '../_util.js';
import { msqOf, frac } from './_more.js';
import { oneOf, matchOne, orderOpts } from './_odd.js';

export default [
  { id: 'cfs-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Kepler orbits', format: 'statements',
    make(r) {
      const e = choose(r, [0.2, 0.5, 0.6, 0.8]), not = r() < 0.5;
      const ratio = round((1 + e) / (1 - e), 2);
      const m = msqOf(r, [
        ['the total energy is negative', true, `An ellipse ($e = ${e} \\lt 1$) is a bound orbit.`],
        [`the ratio of the farthest to the nearest distance from the centre is ${ratio}`, true, `$r_{\\max}/r_{\\min} = (1 + e)/(1 - e) = ${1 + e}/${round(1 - e, 2)} = ${ratio}$.`],
        [`the ratio of the farthest to the nearest distance from the centre is ${round(1 / (1 - e), 2)}`, false, `That is $1/(1 - e)$; the correct ratio is $(1 + e)/(1 - e) = ${ratio}$.`],
        ['the speed is greatest at the nearest point', true, 'Angular momentum $mvr$ is the same at the two apsides, so $v$ is largest where $r$ is smallest.'],
        ['the Laplace-Runge-Lenz vector points from the centre towards the nearest point', true, 'It is conserved for $1/r$ forces and lies along the major axis towards periapsis.'],
        ['the angular velocity $\\dot\\theta$ is constant', false, `$\\dot\\theta = \\ell/(mr^2)$ varies by the factor $(r_{\\max}/r_{\\min})^2 = ${round(ratio * ratio, 2)}$ round the orbit.`],
        ['the radius vector sweeps out equal areas in equal times', true, 'Kepler\'s second law: $dA/dt = \\ell/(2m)$ is constant for any central force.'],
        ['an orbit of this shape could arise from any attractive central force', false, 'A fixed (non-precessing) ellipse with the centre at a focus needs an inverse-square force.'],
      ], { not });
      return { q: `A body moves on a closed orbit of eccentricity $e = ${e}$ about a fixed centre of attractive inverse-square force. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The apsidal distances are $a(1 - e)$ and $a(1 + e)$; their ratio is $(1 + e)/(1 - e)$.' };
    } },
  { id: 'cfs-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'effective potential', format: 'graph in words',
    make(r) {
      const k = int(r, 2, 6), l = int(r, 1, 3), Um = -(k * k) / (2 * l * l);
      const kind = choose(r, ['circ', 'ell', 'par', 'hyp']);
      const E = { circ: Um, ell: Um / 2, par: 0, hyp: -Um }[kind];
      const L = { circ: 'a circle', ell: 'an ellipse, between two turning points', par: 'a parabola: it just escapes to infinity', hyp: 'a hyperbola: it escapes with speed to spare', fall: 'a spiral into the centre' };
      return { q: `A particle of unit mass moves in $U(r) = -${k}/r$ with angular momentum $\\ell = ${l}$, so $U_{\\text{eff}} = -\\dfrac{${k}}{r} + \\dfrac{${l * l}}{2r^2}$, whose minimum value is $${frac(-k * k, 2 * l * l)}$. With energy $E = ${frac(Math.round(E * 8 * l * l), 8 * l * l)}$ the orbit is`, ...matchOne(r, L, [null, kind, `Compare $E$ with $U_{\\text{eff}}$: ${kind === 'circ' ? 'E equals the minimum, so $r$ cannot change: a circular orbit at $r = \\ell^2/k = ' + frac(l * l, k) + '$.' : kind === 'ell' ? 'E lies between the minimum and 0, so $r$ oscillates between two turning points where $E = U_{\\text{eff}}$: an ellipse.' : kind === 'par' ? '$E = 0$: the particle reaches infinity with zero speed, a parabola ($e = 1$).' : '$E \\gt 0$: one turning point only, and speed left over at infinity, a hyperbola ($e \\gt 1$).'} The centrifugal term $\\ell^2/2r^2$ keeps it from reaching $r = 0$.`]),
        trap: 'Bound orbits have $E \\lt 0$; $E$ at the minimum of $U_{\\text{eff}}$ gives a circle.' };
    } },
  { id: 'cfs-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Rutherford scattering',
    make(r) {
      const A = choose(r, [[60, 90, 4], [60, 180, 16], [90, 180, 4], [60, 120, 9]]), eRatio = choose(r, [1, 2, 3]);
      const [t1, t2, ang] = A, val = ang * eRatio * eRatio;
      const show = (v) => `${v}`;
      const o = mcqOptions(r, val, shuffle(r, [ang, ang * eRatio, val * 2, Math.round(Math.sqrt(ang)) * eRatio * eRatio, val / 4].filter((v) => Number.isInteger(v) && v > 0)), show);
      return { q: `In a Rutherford-scattering experiment, the counting rate per unit solid angle is measured at $${t1}^\\circ$ with beam energy $E$, and at $${t2}^\\circ$ with beam energy ${eRatio === 1 ? '$E$' : `$${eRatio}E$`} (same beam current, target and detector). The ratio of the first rate to the second is`, ...o,
        sol: `$\\dfrac{d\\sigma}{d\\Omega} \\propto \\dfrac{1}{E^2\\sin^4(\\theta/2)}$. The angular factor gives $\\left(\\dfrac{\\sin(${t2 / 2}^\\circ)}{\\sin(${t1 / 2}^\\circ)}\\right)^4 = ${ang}$. ${eRatio === 1 ? 'The energies are equal, so the ratio is ' + val + '.' : `The second run has ${eRatio} times the energy, which lowers its rate by $${eRatio}^2 = ${eRatio * eRatio}$, so the ratio is $${ang}\\times${eRatio * eRatio} = ${val}$.`}`,
        trap: 'Remember both the fourth power of $\\sin(\\theta/2)$ and the $1/E^2$.' };
    } },
  { id: 'cfs-m34', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'distance of closest approach', format: 'order of magnitude',
    make(r) {
      const C = choose(r, [['gold', 79, 5], ['gold', 79, 2], ['aluminium', 13, 5], ['silver', 47, 8], ['gold', 79, 20], ['aluminium', 13, 2], ['copper', 29, 4]]);
      const d = (1.44 * 2 * C[1]) / C[2] * 1e-15, o = orderOpts(r, d, '\\text{m}');
      return { q: `An alpha particle of kinetic energy ${C[2]} MeV heads straight at a ${C[0]} nucleus ($Z = ${C[1]}$). Its distance of closest approach is of order`, ...o,
        sol: `At the turning point all the kinetic energy is electric potential energy: $d = \\dfrac{zZe^2}{4\\pi\\varepsilon_0K}$. With $e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm, $d = \\dfrac{1.44\\times2\\times${C[1]}}{${C[2]}}$ fm $= ${round(d * 1e15, 1)}$ fm $= ${(d).toExponential(1).replace(/e(-?)(\d+)/, '\\times10^{$1$2}')}$ m, of order $10^{${o.n}}$ m. (Nuclear radii are a few fm, so for heavy nuclei at these energies the alpha never touches the nucleus: pure Rutherford scattering.)`,
        trap: 'Use $e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm and remember the alpha has $z = 2$.' };
    } },
  { id: 'cfs-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'two-body scattering', format: 'which is NOT',
    make(r) {
      const m1 = int(r, 3, 6), m2 = int(r, 1, m1 - 1), not = r() < 0.6;
      const mx = round((Math.asin(m2 / m1) * 180) / Math.PI, 1);
      const m = oneOf(r, [
        [`for a projectile of mass ${m1} on a target of mass ${m2} at rest, the projectile is never deflected by more than $${mx}^\\circ$ in the lab`, true, `$\\sin\\theta_{\\max} = m_2/m_1 = ${frac(m2, m1)}$ when the projectile is the heavier body.`],
        ['when equal masses collide elastically with one at rest, the two lab directions afterwards are at right angles (unless the collision is head-on)', true, 'Momentum and energy conservation give $\\vec v_1\'\\cdot\\vec v_2\' = 0$.'],
        ['a light projectile on a heavy target can be scattered through any angle up to $180^\\circ$', true, 'When $m_1 \\lt m_2$ the lab angle covers all values.'],
        ['the classical total cross-section of a hard sphere of radius $a$ (for point projectiles) is $\\pi a^2$', true, 'Every impact parameter $b \\lt a$ scatters: the geometric area.'],
        ['the total Rutherford cross-section is infinite', true, 'Arbitrarily large impact parameters still give some small deflection.'],
        [`for a projectile of mass ${m1} on a target of mass ${m2} at rest, the projectile can bounce straight back`, false, `A heavier projectile always keeps moving forward: its lab angle is at most $${mx}^\\circ$.`],
        ['classical hard-sphere scattering is concentrated at small angles', false, 'It is isotropic: $d\\sigma/d\\Omega = a^2/4$ at every angle.'],
        [`the reduced mass of the pair is $${m1 + m2}$ (the sum of the masses)`, false, `$\\mu = m_1m_2/(m_1 + m_2) = ${frac(m1 * m2, m1 + m2)}$.`],
      ], not);
      return { q: `Which statement about classical elastic scattering is ${not ? '<b>NOT</b> correct' : 'correct'}? (Masses in the same units.)`, ...m,
        trap: 'Heavy projectiles are limited to small lab angles; light ones can bounce back.' };
    } },
];
