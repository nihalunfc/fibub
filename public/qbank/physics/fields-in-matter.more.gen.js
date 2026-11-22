// Extra question shapes for fields-in-matter (templates fim-m31..m35). Imported by fields-in-matter.js.
import { int, choose, mcqOptions, shuffle, round } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne, orderOpts } from './_odd.js';

export default [
  { id: 'fim-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'capacitors with dielectrics', format: 'statements',
    make(r) {
      const k = choose(r, [2, 3, 4, 5]), bat = r() < 0.5, not = r() < 0.5;
      const m = msqOf(r, [
        [`the capacitance becomes ${k} times larger`, true, 'Filling the gap multiplies $C$ by $\\varepsilon_r$ whatever is connected.'],
        [`the charge on the plates becomes ${k} times larger`, bat, bat ? `$V$ is fixed, so $Q = CV$ grows by ${k}.` : 'The plates are isolated, so $Q$ cannot change.'],
        [`the voltage between the plates falls to $1/${k}$ of its value`, !bat, bat ? 'The battery holds $V$ fixed.' : `$Q$ is fixed, so $V = Q/C$ drops by ${k}.`],
        [`the stored energy becomes ${k} times larger`, bat, bat ? `$U = \\tfrac12CV^2$ with $V$ fixed grows by ${k}.` : `$U = Q^2/2C$ with $Q$ fixed falls by ${k}.`],
        [`the stored energy falls to $1/${k}$ of its value`, !bat, bat ? `$U = \\tfrac12CV^2$ grows by ${k}.` : `$U = Q^2/2C$ falls by ${k}.`],
        ['the field $E$ in the gap is unchanged', bat, bat ? '$E = V/d$ and both $V$ and $d$ are fixed.' : `$E = V/d$ falls by ${k} with $V$.`],
        ['the slab is pushed out of the gap while being inserted', false, 'Fringing fields pull a dielectric into the gap in both cases.'],
      ], { not });
      return { q: `An air-filled parallel-plate capacitor is ${bat ? 'kept connected to a battery' : 'charged and then disconnected from the battery'}. A slab of dielectric with $\\varepsilon_r = ${k}$ is slid in to fill the gap completely. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'First ask what is held fixed: $V$ (battery connected) or $Q$ (isolated).' };
    } },
  { id: 'fim-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'bound charges',
    make(r) {
      const k = int(r, 2, 6), R = int(r, 1, 4), n = choose(r, [1, 2]);
      const rho = -(n + 2) * k, sig = k * R ** n;
      const rr = n === 1 ? '' : 'r', pair = (a, b) => `$\\rho_b = ${a}${a === 0 ? '' : rr}$, $\\sigma_b = ${b}$`;
      const o = mcqOptions(r, pair(rho, sig), shuffle(r, [pair(-rho, -sig), pair(-k * n, sig), pair(rho, -sig), pair(-3 * k, k * R), pair(0, sig)]));
      return { q: `A sphere of radius ${R} carries a frozen-in polarisation $\\vec P = ${k}${n === 1 ? 'r' : 'r^2'}\\,\\hat r$ (SI units). The bound volume charge density inside and the bound surface charge density on its surface are`, ...o,
        sol: `$\\rho_b = -\\nabla\\cdot\\vec P = -\\dfrac{1}{r^2}\\dfrac{d}{dr}\\left(r^2\\cdot${k}r^{${n}}\\right) = -${n + 2}\\cdot${k}r^{${n - 1}} ${n === 1 ? `= ${rho}` : `= ${rho}r`}$. $\\sigma_b = \\vec P\\cdot\\hat n = ${k}\\times${R}^{${n}} = ${sig}$. Check: total bound charge $\\sigma_b4\\pi R^2 + \\int\\rho_b\\,dV = 0$.`,
        trap: 'Bound volume charge is $-\\nabla\\cdot\\vec P$ (note the minus); surface charge is $\\vec P\\cdot\\hat n$.' };
    } },
  { id: 'fim-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'cavities in dielectrics', format: 'match',
    make(r) {
      const er = choose(r, [2, 3, 4, 5, 7]);
      const L = { needle: '$E_0$', disc: `$${er}E_0$`, sph: `$${round((3 * er) / (2 * er + 1), 3)}E_0$`, zero: '$0$', inv: `$E_0/${er}$` };
      const cas = choose(r, [
        ['a long thin needle-shaped cavity along the field', 'needle', '$E_\\parallel$ is continuous across the long sides, so the field inside equals $E_0$.'],
        ['a thin disc-shaped cavity with its faces perpendicular to the field', 'disc', `$D_\\perp$ is continuous across the faces, so $\\varepsilon_0E = \\varepsilon_0\\varepsilon_rE_0$: $E = ${er}E_0$.`],
        ['a small spherical cavity', 'sph', `Solving Laplace's equation for a spherical hole gives a uniform field $E = \\dfrac{3\\varepsilon_r}{2\\varepsilon_r + 1}E_0 = ${round((3 * er) / (2 * er + 1), 3)}E_0$, between the needle and disc values.`],
      ]);
      return { q: `A large block of linear dielectric ($\\varepsilon_r = ${er}$) has a uniform field $E_0$ inside. A cavity is cut out. Using the boundary conditions, the field at the centre of ${cas[0]} is about`, ...matchOne(r, L, cas),
        trap: 'Needle: $E_\\parallel$ continuous. Disc: $D_\\perp$ continuous. Sphere: in between.' };
    } },
  { id: 'fim-m34', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'atomic polarisability', format: 'order of magnitude',
    make(r) {
      const E = choose(r, [1e3, 1e5, 3e6, 1e8]);
      const alpha = 7.4e-41, d = (alpha * E) / 1.6e-19, o = orderOpts(r, d, '\\text{m}');
      const show = E >= 1e6 ? `${E / 10 ** Math.floor(Math.log10(E)) === 1 ? '' : `${E / 10 ** Math.floor(Math.log10(E))}\\times`}10^{${Math.floor(Math.log10(E))}}` : `10^{${Math.log10(E)}}`;
      return { q: `A hydrogen atom (polarisability $\\alpha \\approx 7.4\\times10^{-41}$ C m$^2$/V) sits in a field of $${show}$ V/m. The shift of the electron cloud's centre relative to the nucleus is of order`, ...o,
        sol: `$p = \\alpha E = qd$, so $d = \\alpha E/e = \\dfrac{7.4\\times10^{-41}\\times${show}}{1.6\\times10^{-19}} \\approx ${(d / 10 ** o.n).toFixed(1)}\\times10^{${o.n}}$ m. Even at breakdown fields this is a tiny fraction of the Bohr radius ($5\\times10^{-11}$ m), which is why linear response works so well.`,
        trap: 'Divide the dipole moment by the electron charge; compare with the atom size $\\sim10^{-10}$ m.' };
    } },
  { id: 'fim-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'boundary conditions', format: 'which is NOT',
    make(r) {
      const not = r() < 0.6;
      const m = oneOf(r, [
        ['the normal component of $\\vec D$ jumps by the free surface charge', true, '$D_{1\\perp} - D_{2\\perp} = \\sigma_f$.'],
        ['the tangential component of $\\vec E$ is continuous', true, '$\\oint\\vec E\\cdot d\\vec l = 0$ for a thin loop.'],
        ['the normal component of $\\vec E$ jumps by the total surface charge over $\\varepsilon_0$', true, 'Free plus bound: $\\sigma/\\varepsilon_0$.'],
        ['field lines bend away from the normal on entering a medium of higher $\\varepsilon_r$ (no free charge)', true, '$\\tan\\theta_2/\\tan\\theta_1 = \\varepsilon_2/\\varepsilon_1$.'],
        ['the normal component of $\\vec E$ is always continuous', false, 'It jumps whenever there is any surface charge, bound or free.'],
        ['the tangential component of $\\vec D$ is always continuous', false, '$D_\\parallel = \\varepsilon E_\\parallel$ jumps with $\\varepsilon$ (and with any tangential $\\vec P$).'],
        ['$\\nabla\\times\\vec D = 0$ in every electrostatic problem', false, '$\\nabla\\times\\vec D = \\nabla\\times\\vec P$, which need not vanish.'],
      ], not);
      return { q: `Which statement about electrostatic fields at the boundary between two dielectrics is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: '$D_\\perp$ follows free charge; $E_\\parallel$ is always continuous; $\\vec D$ is not a curl-free field in general.' };
    } },
];
