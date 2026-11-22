// Extra question shapes for rigid-body-dynamics (templates rbd-m31..m35). Imported by rigid-body-dynamics.js.
import { int, choose, mcqOptions, shuffle, round } from '../_util.js';
import { msqOf, frac } from './_more.js';
import { oneOf, matchOne } from './_odd.js';

export default [
  { id: 'rbd-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'stability of free rotation', format: 'statements',
    make(r) {
      const sides = shuffle(r, [1, 2, 3, 4, 5]).slice(0, 3).sort((x, y) => x - y), [a, b, c] = sides, not = r() < 0.5;
      const M = int(r, 1, 6), Ia = (M * (b * b + c * c)) / 12;
      const s = msqOf(r, [
        [`spin about the axis parallel to the ${a} cm edges is stable`, true, `That axis has the largest moment, $M(b^2 + c^2)/12$.`],
        [`spin about the axis parallel to the ${c} cm edges is stable`, true, 'That axis has the smallest moment, $M(a^2 + b^2)/12$; free rotation about it is also stable (ignoring energy loss).'],
        [`spin about the axis parallel to the ${b} cm edges is unstable`, true, 'The intermediate axis: small wobbles grow exponentially (the tennis-racket effect).'],
        [`spin about the axis parallel to the ${b} cm edges is stable`, false, 'It is the intermediate axis, which is unstable.'],
        [`the moment of inertia about the axis parallel to the ${a} cm edges is ${frac(M * (b * b + c * c), 12)} kg cm$^2$`, true, `$M(b^2 + c^2)/12 = ${M}(${b * b} + ${c * c})/12 = ${round(Ia, 3)}$ kg cm$^2$.`],
        ['the angular momentum vector is fixed in space during the free motion', true, 'No external torque acts.'],
        ['the angular velocity vector is fixed in space during any free motion', false, 'Only for rotation exactly about a principal axis; otherwise $\\vec\\omega$ moves (Poinsot motion).'],
        ['the rotational kinetic energy is conserved', true, 'No torque and no dissipation: Euler\'s equations conserve $T$.'],
      ], { not });
      return { q: `A solid uniform box of mass ${M} kg with edges ${a} cm, ${b} cm and ${c} cm is thrown spinning about one of its central principal axes, with no external torque. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...s,
        trap: 'The axis parallel to the shortest edge has the largest moment; the middle edge gives the unstable axis.' };
    } },
  { id: 'rbd-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'types of top', format: 'match',
    make(r) {
      const R = int(r, 1, 3), long = r() < 0.5, Lc = long ? R * int(r, 3, 5) : R;
      const L = { sph: 'a spherical top ($I_1 = I_2 = I_3$)', pro: 'a prolate symmetric top ($I_3 \\lt I_1 = I_2$)', obl: 'an oblate symmetric top ($I_3 \\gt I_1 = I_2$)', asym: 'an asymmetric top (three different principal moments)' };
      const cas = choose(r, [
        ['a uniform cube (about its centre)', 'sph', 'By symmetry all three principal moments are equal, $Ma^2/6$, so every axis through the centre is principal.'],
        ['the methane molecule CH$_4$ (tetrahedral)', 'sph', 'Tetrahedral symmetry forces all three moments to be equal.'],
        ['a thin uniform coin', 'obl', 'About the symmetry axis $I_3 = MR^2/2$; about a diameter $I_1 = MR^2/4$, so $I_3 = 2I_1$.'],
        ['the benzene molecule (flat hexagon)', 'obl', 'A planar body with sixfold symmetry: $I_3 = I_1 + I_2 = 2I_1$.'],
        ['the water molecule', 'asym', 'A bent, planar molecule with no axis of threefold or higher symmetry: three different moments.'],
        [`a uniform solid cylinder of radius ${R} cm and length ${Lc} cm (about its centre)`, long ? 'pro' : 'obl', `$I_3 = MR^2/2 = ${frac(R * R, 2)}M$ and $I_1 = M(3R^2 + L^2)/12 = ${frac(3 * R * R + Lc * Lc, 12)}M$ (in cm$^2$). ${long ? 'Here $L^2 \\gt 3R^2$, so $I_3 \\lt I_1$: prolate.' : 'Here $L^2 \\lt 3R^2$, so $I_3 \\gt I_1$: oblate.'}`],
        ['the methyl chloride molecule CH$_3$Cl', 'pro', 'A threefold axis through C-Cl; the light H atoms lie close to it, so the moment about that axis is the smallest: prolate.'],
        [`a uniform box with edges ${R} cm, ${R + 1} cm and ${R + 3} cm`, 'asym', 'Three different edges give three different principal moments.'],
      ]);
      return { q: `As a free rigid rotor, ${cas[0]} is`, ...matchOne(r, L, cas),
        trap: 'A symmetry axis of order 3 or more makes two moments equal; cubic or tetrahedral symmetry makes all three equal.' };
    } },
  { id: 'rbd-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'free precession',
    make(r) {
      const w3 = choose(r, [14, 21, 28, 42, 56]);
      const B = choose(r, [['a thin uniform disc', 2, 1, 'I_3 = MR^2/2,\\ I_1 = MR^2/4'], ['a uniform cylinder whose length equals its radius', 3, 2, 'I_3 = MR^2/2,\\ I_1 = M(3R^2 + R^2)/12 = MR^2/3'], ['a uniform cylinder whose length is twice its radius', 6, 7, 'I_3 = MR^2/2 = 6MR^2/12,\\ I_1 = M(3R^2 + 4R^2)/12 = 7MR^2/12']]);
      const ratio = B[1] / B[2], Om = Math.abs((ratio - 1) * w3);
      const o = mcqOptions(r, round(Om, 2), shuffle(r, [w3, round(ratio * w3, 2), round(Math.abs(((ratio - 1) / ratio) * w3), 2), round(Om * 2, 2)]), (v) => `$${v}$ rad/s`);
      return { q: `${B[0][0].toUpperCase() + B[0].slice(1)} spins freely in space with $\\omega_3 = ${w3}$ rad/s about its symmetry axis and a small wobble. In the body frame, the perpendicular part of $\\vec\\omega$ circles the symmetry axis at the rate`, ...o,
        sol: `Euler's equations for a symmetric body give $\\Omega = \\dfrac{I_3 - I_1}{I_1}\\omega_3$ in the body frame. Here $${B[3]}$, so $I_3/I_1 = ${frac(B[1], B[2])}$ and $|\\Omega| = |${frac(B[1], B[2])} - 1|\\times${w3} = ${round(Om, 2)}$ rad/s${ratio < 1 ? ', in the opposite sense to the spin (a prolate body)' : ''}.`,
        trap: 'The body-frame rate uses $(I_3 - I_1)/I_1$, which vanishes for a sphere; it is not $\\omega_3$ itself.' };
    } },
  { id: 'rbd-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'principal axes',
    make(r) {
      const A = int(r, 4, 9), c = int(r, 1, A - 1), C = int(r, 2, 12);
      const tri = (x, y, z) => `$${[x, y, z].sort((p, q) => p - q).join(',\\ ')}$`;
      const o = mcqOptions(r, tri(A - c, A + c, C), shuffle(r, [tri(A, A, C), tri(A - c, A, C), tri(A, A + c, C + c), tri(A - c, A + c, C + c)]));
      return { q: `About a point, a body has inertia tensor (kg m$^2$) $I = \\begin{pmatrix} ${A} & ${-c} & 0 \\\\ ${-c} & ${A} & 0 \\\\ 0 & 0 & ${C} \\end{pmatrix}$. Its principal moments are`, ...o,
        sol: `The $z$-axis is already principal (no products with $z$), giving ${C}. The $xy$ block $\\begin{pmatrix} ${A} & ${-c} \\\\ ${-c} & ${A} \\end{pmatrix}$ has eigenvalues $${A} \\mp ${c}$, with principal axes along $(1, 1, 0)$ and $(1, -1, 0)$: moments $${A - c}$ and $${A + c}$. (Check: the trace ${2 * A + C} is unchanged.)`,
        trap: 'Products of inertia shift the moments; the trace (sum of principal moments) stays the same.' };
    } },
  { id: 'rbd-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Euler equations', format: 'which is NOT',
    make(r) {
      const obl = r() < 0.5, not = r() < 0.6;
      const m = oneOf(r, [
        ['$\\omega_3$ stays constant', true, 'With $I_1 = I_2$ and no torque, Euler\'s third equation gives $I_3\\dot\\omega_3 = 0$.'],
        ['the magnitude $|\\vec\\omega|$ stays constant', true, '$\\omega_3$ is constant and $\\omega_\\perp$ only rotates.'],
        ['the angular momentum $\\vec L$ is fixed in space', true, 'No external torque.'],
        ['$\\vec L$, $\\vec\\omega$ and the symmetry axis always lie in one plane', true, '$\\vec L = I_1\\vec\\omega_\\perp + I_3\\omega_3\\hat e_3$ is a combination of $\\vec\\omega_\\perp$ and $\\hat e_3$.'],
        ['the kinetic energy stays constant', true, 'No torque, no dissipation.'],
        [`in the body frame $\\vec\\omega_\\perp$ turns ${obl ? 'in the same sense as' : 'opposite to'} the spin`, true, `The rate $(I_3 - I_1)\\omega_3/I_1$ is ${obl ? 'positive for an oblate body' : 'negative for a prolate body'}.`],
        ['$\\vec L$ is fixed in the body frame', false, 'In the body frame $\\vec L$ (like $\\vec\\omega$) circles the symmetry axis.'],
        ['$\\vec\\omega$ is always parallel to $\\vec L$', false, 'Only when the body spins exactly about a principal axis; with $I_3 \\ne I_1$ a wobble makes them differ.'],
        [`in the body frame $\\vec\\omega_\\perp$ turns ${obl ? 'opposite to' : 'in the same sense as'} the spin`, false, `For ${obl ? 'an oblate' : 'a prolate'} body $(I_3 - I_1)/I_1$ is ${obl ? 'positive' : 'negative'}.`],
      ], not);
      return { q: `A torque-free ${obl ? 'oblate' : 'prolate'} symmetric body ($I_1 = I_2 ${obl ? '\\lt' : '\\gt'} I_3$) spins about an axis slightly off its symmetry axis. Which statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Fixed in space is not fixed in the body: $\\vec L$ is constant in space but moves relative to the body.' };
    } },
];
