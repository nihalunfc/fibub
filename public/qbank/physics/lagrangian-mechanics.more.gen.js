// Extra question shapes for lagrangian-mechanics (templates lag-m31..m35). Imported by lagrangian-mechanics.js.
import { int, choose, mcqOptions, shuffle, round } from '../_util.js';
import { msqOf } from './_more.js';
import { matchOne } from './_odd.js';

export default [
  { id: 'lag-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'pendulum on a sliding support', format: 'statements',
    make(r) {
      const M = choose(r, [1, 2, 3, 4]), m = choose(r, [0.5, 1, 2]), l = choose(r, [0.5, 1, 2]), g = 9.8, not = r() < 0.5;
      const w = Math.sqrt(((M + m) * g) / (M * l)), w0 = Math.sqrt(g / l);
      const m2 = msqOf(r, [
        ['the system has 2 degrees of freedom', true, 'The block position $x$ and the pendulum angle $\\theta$.'],
        ['the total horizontal momentum is conserved', true, '$x$ is cyclic: no horizontal external force acts, so $p_x = (M + m)\\dot x + ml\\cos\\theta\\,\\dot\\theta$ is constant.'],
        ['the total energy is conserved', true, 'The Lagrangian has no explicit time dependence and the constraints are fixed.'],
        [`the small-oscillation angular frequency is $${round(w, 2)}$ rad/s`, true, `$\\omega = \\sqrt{\\dfrac{(M + m)g}{Ml}} = \\sqrt{\\dfrac{${M + m}\\times9.8}{${M}\\times${l}}} = ${round(w, 2)}$ rad/s: the block recoils, which stiffens the motion.`],
        [`the small-oscillation angular frequency is $${round(w0, 2)}$ rad/s`, false, `$\\sqrt{g/l} = ${round(w0, 2)}$ would hold only for a fixed support ($M \\to \\infty$); here it is $${round(w, 2)}$ rad/s.`],
        ['the horizontal momentum of the bob alone is conserved', false, 'The string tension has a horizontal component that pushes the bob back and forth.'],
        ['if released from rest, the centre of mass of the whole system moves only vertically', true, 'Total horizontal momentum is conserved and starts at zero.'],
        ['the angle $\\theta$ is a cyclic coordinate', false, 'Gravity gives a potential $-mgl\\cos\\theta$ that depends on $\\theta$.'],
      ], { not });
      return { q: `A block of mass ${M} kg slides freely on a smooth horizontal rail. A simple pendulum (bob ${m} kg, light string ${l} m) hangs from it and swings in the vertical plane containing the rail ($g = 9.8$ m/s²). Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m2,
        trap: 'With a movable support the frequency is $\\sqrt{(M + m)g/(Ml)}$, not $\\sqrt{g/l}$.' };
    } },
  { id: 'lag-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Euler-Lagrange equations',
    make(r) {
      const a = int(r, 1, 4), b = int(r, 1, 3), k = int(r, 1, 5);
      const A = `(${a} + ${b === 1 ? '' : b}q^2)`;
      const ok = `$${A}\\ddot q + ${b === 1 ? '' : b}q\\dot q^2 + ${k === 1 ? '' : k}q = 0$`;
      const w = [
        `$${A}\\ddot q + ${2 * b}q\\dot q^2 + ${k === 1 ? '' : k}q = 0$`,
        `$${A}\\ddot q + ${k === 1 ? '' : k}q = 0$`,
        `$${A}\\ddot q - ${b === 1 ? '' : b}q\\dot q^2 + ${k === 1 ? '' : k}q = 0$`,
        `$${A}\\ddot q + ${3 * b}q\\dot q^2 + ${k === 1 ? '' : k}q = 0$`,
      ];
      const o = mcqOptions(r, ok, shuffle(r, w));
      return { q: `The Lagrangian of a system is $L = \\tfrac12${A}\\dot q^2 - \\tfrac{${k}}{2}q^2$. Its equation of motion is`, ...o,
        sol: `$\\partial L/\\partial\\dot q = ${A}\\dot q$, so $\\dfrac{d}{dt}\\dfrac{\\partial L}{\\partial\\dot q} = ${A}\\ddot q + ${2 * b}q\\dot q^2$. Also $\\partial L/\\partial q = ${b === 1 ? '' : b}q\\dot q^2 - ${k === 1 ? '' : k}q$ (the kinetic term depends on $q$). Subtracting: $${A}\\ddot q + ${2 * b}q\\dot q^2 - ${b === 1 ? '' : b}q\\dot q^2 + ${k === 1 ? '' : k}q = 0$, which is the answer.`,
        trap: 'A position-dependent mass contributes twice: through $d/dt$ of the momentum and through $\\partial L/\\partial q$. They partly cancel.' };
    } },
  { id: 'lag-m33', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'checking answers', format: 'limiting case',
    make(r) {
      const S = choose(r, [
        ['A block of mass $m$ slides on the smooth sloping face (angle $\\theta$) of a wedge of mass $M$, which itself slides on a smooth floor. The magnitude of the wedge\'s acceleration',
          '$\\dfrac{mg\\sin\\theta\\cos\\theta}{M + m\\sin^2\\theta}$',
          ['$\\dfrac{mg\\sin\\theta}{M + m\\sin^2\\theta}$', '$\\dfrac{Mg\\sin\\theta\\cos\\theta}{M + m\\sin^2\\theta}$', '$\\dfrac{mg\\sin\\theta\\cos\\theta}{M - m\\sin^2\\theta}$', '$\\dfrac{m\\sin\\theta\\cos\\theta}{M + m\\sin^2\\theta}$'],
          'Checks: it must vanish for $m \\to 0$ (no push), for $\\theta \\to 0$ (flat face) and for $\\theta \\to 90^\\circ$ (a vertical face: the block falls freely without pressing on it), must tend to 0 as $M \\to \\infty$, must never blow up, and must have the dimensions of an acceleration. Only the answer passes all of these; it follows from horizontal momentum conservation plus the constraint that the block stays on the face. The others fail: one is non-zero at $\\theta = 90^\\circ$, one survives $m \\to 0$, one diverges when $M = m\\sin^2\\theta$, and one lacks $g$ (wrong dimensions).'],
        ['Two masses $m_1 \\gt m_2$ hang over a pulley of radius $R$ and moment of inertia $I$ (no slipping, frictionless axle). The acceleration of the masses',
          '$\\dfrac{(m_1 - m_2)g}{m_1 + m_2 + I/R^2}$',
          ['$\\dfrac{(m_1 - m_2)g}{m_1 + m_2 - I/R^2}$', '$\\dfrac{(m_1 + m_2)g}{m_1 + m_2 + I/R^2}$', '$\\dfrac{(m_1 - m_2)g}{m_1 + m_2 + IR^2}$', '$\\dfrac{(m_1 - m_2)}{m_1 + m_2 + I/R^2}$'],
          'Checks: zero for $m_1 = m_2$; $g$ for $m_2 = 0$ and $I = 0$; smaller for a heavier pulley (never infinite); dimensions of acceleration ($I/R^2$ is a mass, $IR^2$ is not). Only the answer passes all; it comes from $L = \\tfrac12(m_1 + m_2 + I/R^2)\\dot x^2 + (m_1 - m_2)gx$.'],
        ['A body of mass $m$, radius $R$ and moment of inertia $I$ about its axis rolls without slipping down a slope of angle $\\theta$. Its acceleration',
          '$\\dfrac{g\\sin\\theta}{1 + I/(mR^2)}$',
          ['$\\dfrac{g\\sin\\theta}{1 - I/(mR^2)}$', '$\\dfrac{g\\sin\\theta}{1 + I/(mR)}$', '$\\dfrac{g\\cos\\theta}{1 + I/(mR^2)}$', '$g\\sin\\theta\\left(1 + \\dfrac{I}{mR^2}\\right)$'],
          'Checks: $g\\sin\\theta$ for $I = 0$ (a sliding point mass); zero on a flat surface ($\\theta = 0$); less than $g\\sin\\theta$ for $I \\gt 0$, never infinite; and $I/(mR^2)$ must be dimensionless. Only the answer passes; it follows from $L = \\tfrac12(m + I/R^2)\\dot x^2 + mgx\\sin\\theta$.'],
        ['A bead slides on a smooth circular hoop of radius $R$ spinning at $\\omega \\gt \\sqrt{g/R}$ about its vertical diameter. The polar angle $\\theta$ (from the bottom) of its off-axis equilibrium satisfies',
          '$\\cos\\theta = \\dfrac{g}{\\omega^2R}$',
          ['$\\cos\\theta = \\dfrac{\\omega^2R}{g}$', '$\\sin\\theta = \\dfrac{g}{\\omega^2R}$', '$\\cos\\theta = \\dfrac{g}{\\omega R}$', '$\\cos\\theta = 1 - \\dfrac{g}{\\omega^2R}$'],
          'Checks: as $\\omega \\to \\infty$ the bead should be flung to the equator ($\\theta \\to 90^\\circ$, $\\cos\\theta \\to 0$); at $\\omega^2 = g/R$ the equilibrium should merge with the bottom ($\\cos\\theta = 1$); the ratio must be dimensionless and at most 1. Only the answer passes; it comes from minimising $V_{\\text{eff}} = -mgR\\cos\\theta - \\tfrac12m\\omega^2R^2\\sin^2\\theta$.'],
      ]);
      const o = mcqOptions(r, S[1], shuffle(r, S[2]));
      return { q: `${S[0]} can be found with a Lagrangian. Without solving, use dimensions and limiting cases to decide which expression can be correct.`, ...o, sol: S[3],
        trap: 'Test every option: dimensions first, then the obvious limits (one mass to zero, angle to $0$ or $90^\\circ$, a parameter to infinity).' };
    } },
  { id: 'lag-m34', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'setting up Lagrangians', format: 'match',
    make(r) {
      const L = {
        pend: '$\\tfrac12ml^2\\dot\\theta^2 + mgl\\cos\\theta$',
        rod: '$\\tfrac12m(\\dot r^2 + \\omega^2r^2)$',
        hoop: '$\\tfrac12mR^2(\\dot\\theta^2 + \\omega^2\\sin^2\\theta) + mgR\\cos\\theta$',
        cone: '$\\tfrac12m(\\dot r^2\\csc^2\\alpha + r^2\\dot\\phi^2) - mgr\\cot\\alpha$',
        sph: '$\\tfrac12ml^2(\\dot\\theta^2 + \\sin^2\\theta\\,\\dot\\phi^2) + mgl\\cos\\theta$',
        atw: '$\\tfrac12(m_1 + m_2)\\dot x^2 + (m_1 - m_2)gx$',
      };
      const cas = choose(r, [
        ['a simple pendulum swinging in a fixed vertical plane ($\\theta$ from the downward vertical)', 'pend', 'One coordinate; the bob moves on a circle of radius $l$ and its height is $-l\\cos\\theta$.'],
        ['a bead sliding on a smooth straight horizontal rod that is turned at constant $\\omega$ about a vertical axis through one end ($r$ along the rod)', 'rod', 'Velocity components $\\dot r$ along the rod and $\\omega r$ across it; no change of height, so no potential.'],
        ['a bead on a smooth vertical hoop of radius $R$ spun at constant $\\omega$ about its vertical diameter ($\\theta$ from the bottom)', 'hoop', 'Speed along the hoop $R\\dot\\theta$ and around the axis $\\omega R\\sin\\theta$; height $-R\\cos\\theta$.'],
        ['a particle sliding on the inside of a smooth cone of half-angle $\\alpha$, vertex down and axis vertical ($r$ the distance from the axis)', 'cone', 'Along the surface $ds = dr/\\sin\\alpha$; around the axis $r\\dot\\phi$; height $z = r\\cot\\alpha$.'],
        ['a spherical pendulum ($\\theta$ from the downward vertical, $\\phi$ the azimuth)', 'sph', 'The bob moves on a sphere of radius $l$; height $-l\\cos\\theta$.'],
        ['an Atwood machine with a massless pulley ($x$ the drop of $m_1$)', 'atw', 'Both masses move with speed $\\dot x$; $m_1$ falls by $x$ while $m_2$ rises by $x$.'],
      ]);
      return { q: `Which Lagrangian describes ${cas[0]}?`, ...matchOne(r, L, cas),
        trap: 'Write the speed in the chosen coordinates first (including any imposed motion), then the height for the potential.' };
    } },
  { id: 'lag-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Noether\'s theorem', format: 'match',
    make(r) {
      const b = int(r, 1, 5);
      const L = {
        px: '$p_x$', lz: '$L_z$', sum: '$p_x + p_y$', helix: `$L_z + \\dfrac{${b}}{2\\pi}p_z$`, pz: '$p_z$', none: 'none of the momentum components or angular momenta listed',
      };
      const cas = choose(r, [
        ['$V = V(y, z)$ only', 'px', 'Translations along $x$ leave $L$ unchanged, so $p_x$ is conserved.'],
        ['$V = V(\\sqrt{x^2 + y^2},\\ z)$ only', 'lz', 'Rotations about the $z$-axis leave $L$ unchanged, so $L_z$ is conserved.'],
        ['$V = V(x - y,\\ z)$ only', 'sum', 'Shifting $x$ and $y$ by the same amount leaves $x - y$ unchanged; the generator is $p_x + p_y$.'],
        [`$V = V(\\rho,\\ z - ${b}\\phi/2\\pi)$ only (cylindrical coordinates)`, 'helix', `A screw motion (rotate by $\\delta\\phi$ and shift $z$ by $${b}\\,\\delta\\phi/2\\pi$) leaves $V$ unchanged; the conserved quantity is $p_\\phi + \\tfrac{${b}}{2\\pi}p_z = L_z + \\tfrac{${b}}{2\\pi}p_z$, though neither part is conserved alone.`],
        ['$V = V(x, y)$ only', 'pz', 'Nothing depends on $z$, so $p_z$ is conserved.'],
      ]);
      return { q: `A particle moves with $L = \\tfrac12m(\\dot x^2 + \\dot y^2 + \\dot z^2) - V$, where ${cas[1] === 'helix' ? 'in cylindrical coordinates $(\\rho, \\phi, z)$ ' : ''}${cas[0]}. Which quantity is conserved because of a symmetry of $V$?`, ...matchOne(r, L, cas),
        trap: 'Find the continuous transformation that leaves $V$ unchanged; its generator is the conserved quantity (Noether).' };
    } },
];
