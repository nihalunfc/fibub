// Extra question shapes for rigid-body-rotation (templates rbr-t21..t26). Imported by rigid-body-rotation.js.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import { msqOf } from './_more.js';

const g = 9.8, n3 = (x) => String(+x.toPrecision(3)), rad = (d) => (d * Math.PI) / 180;

export default [
  { id: 'rbr-t21', type: 'mcq', level: 2, exams: ['jam'], sub: 'rotational energy',
    make(r) {
      const [body, b, bt] = choose(r, [['thin ring', 1, '1'], ['uniform disc', 0.5, '\\tfrac12'], ['solid sphere', 0.4, '\\tfrac25'], ['thin hollow sphere', 2 / 3, '\\tfrac23']]);
      const K = int(r, 2, 18) * 5, rot = r() < 0.6, f = rot ? b / (1 + b) : 1 / (1 + b);
      const J = (x) => `$${n3(x)}$ J`;
      const others = [1 / 2, 1 / 3, 2 / 7, 2 / 5, 2 / 3, 5 / 7, 3 / 5].filter((x) => Math.abs(x - f) > 1e-9);
      const o = mcqOptions(r, J(K * f), shuffle(r, others).map((x) => J(K * x)));
      return { q: `A ${body} rolls without slipping with total kinetic energy ${K} J. Its ${rot ? 'rotational' : 'translational'} kinetic energy is`, ...o,
        sol: `With $I = \\beta mR^2$ and $v = \\omega R$: $K_\\text{rot} = \\tfrac12\\beta mv^2$ and $K_\\text{trans} = \\tfrac12mv^2$. For a ${body} $\\beta = ${bt}$, so the ${rot ? 'rotational' : 'translational'} share is $${rot ? '\\beta/(1 + \\beta)' : '1/(1 + \\beta)'} = ${round(f, 4)}$ and the energy is $${K}\\times${round(f, 4)} = ${n3(K * f)}$ J.`,
        trap: 'The rotational share is $\\beta/(1 + \\beta)$, not $\\beta$ itself.' };
    } },
  { id: 'rbr-t22', type: 'nat', level: 3, exams: ['jam'], sub: 'collisions with rotation', unit: 'rad/s',
    make(r) {
      const M = int(r, 1, 5), L = pick(r, 0.5, 2, 0.1), mg = int(r, 1, 5) * 10, m = mg / 1000, v = int(r, 1, 4) * 100;
      const w = (m * v * L) / ((M * L * L) / 3 + m * L * L);
      return { q: `A uniform rod of mass ${M} kg and length ${L} m hangs at rest from a frictionless hinge at its top end. A ${mg} g bullet moving horizontally at ${v} m/s hits the bottom end and stays in it. The angular speed just after impact is ______ rad/s (three decimal places).`,
        answer: round(w, 3), tol: Math.max(0.002, round(w * 0.002, 3)), unit: 'rad/s', M, L, m, v,
        sol: `The hinge force acts through the axis, so angular momentum about the hinge is conserved (linear momentum is not). Before: $mvL = ${m}\\times${v}\\times${L} = ${round(m * v * L, 4)}$. After: $(ML^2/3 + mL^2)\\omega = ${round((M * L * L) / 3 + m * L * L, 5)}\\,\\omega$. So $\\omega = ${round(w, 3)}$ rad/s.`,
        trap: 'Conserving linear momentum is wrong here: the hinge pushes on the rod during the impact.' };
    },
    verify: (p) => (3 * p.m * p.v) / ((p.M + 3 * p.m) * p.L) },
  { id: 'rbr-t23', type: 'msq', level: 2, exams: ['jam'], sub: 'rolling',
    make(r) {
      const v = pick(r, 1, 6, 0.5), not = r() < 0.4;
      const res = msqOf(r, [
        [`The top of the wheel moves at $${2 * v}$ m/s`, true, 'Top point: $v + \\omega R = 2v$.'],
        [`The top of the wheel moves at $${v}$ m/s`, false, `The rotation adds $\\omega R = v$ to the forward motion: $2v = ${2 * v}$ m/s.`],
        ['The point touching the ground is momentarily at rest', true, 'Bottom point: $v - \\omega R = 0$, the rolling condition.'],
        [`A point on the rim level with the axle moves at $${n3(v * Math.SQRT2)}$ m/s`, true, `Its velocity is $v$ forward plus $\\omega R = v$ vertically: $\\sqrt2\\,v$.`],
        ['Static friction does no work on a wheel rolling without slipping', true, 'It acts at a point that is momentarily at rest.'],
        ['Friction always points opposite to the motion of the centre', false, 'For a wheel rolling down a slope it points up the slope, but for a wheel driven by its axle (or pulled at the top) it can point forward.'],
        ['On a level floor with no other horizontal force, friction is needed to keep it rolling at steady speed', false, 'With nothing to change $v$ or $\\omega$, no friction is needed at all.'],
      ], { not });
      return { q: `A wheel rolls without slipping on level ground with its centre moving at ${v} m/s. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...res,
        trap: 'Rolling is rotation about the contact point: speeds grow with the distance from it.' };
    } },
  { id: 'rbr-t24', type: 'nat', level: 4, exams: ['jam'], sub: 'pulleys', unit: 'N',
    make(r) {
      const M = pick(r, 0.1, 1, 0.1), Rc = int(r, 3, 8), rc = int(r, 1, Rc - 1);
      const a = g / (1 + (Rc * Rc) / (2 * rc * rc)), T = M * (g - a);
      return { q: `A yo-yo is a uniform disc of mass ${M} kg and radius ${Rc} cm with a thin axle of radius ${rc} cm (axle mass negligible). Its string is held fixed and it unwinds as it falls. The string tension is ______ N ($g = 9.8$ m/s², three decimal places).`,
        answer: round(T, 3), tol: Math.max(0.002, round(T * 0.002, 3)), unit: 'N', M, Rc, rc,
        sol: `Translation: $Mg - T = Ma$. Rotation about the centre: $Tr = I\\alpha = \\tfrac12MR^2(a/r)$. So $T = \\tfrac12Ma(R/r)^2$ and $a = \\dfrac{g}{1 + R^2/(2r^2)} = \\dfrac{9.8}{1 + ${Rc * Rc}/${2 * rc * rc}} = ${round(a, 4)}$ m/s². Then $T = M(g - a) = ${round(T, 3)}$ N.`,
        trap: 'The string acts at the axle radius $r$, not the outer radius $R$.' };
    },
    verify: (p) => { const I = 0.5 * p.M * (p.Rc / 100) ** 2, r = p.rc / 100, a = (p.M * g * r * r) / (I + p.M * r * r); return p.M * (g - a); } },
  { id: 'rbr-t25', type: 'mcq', level: 2, exams: ['jam'], sub: 'angular momentum', format: 'graph in words',
    make(r) {
      const m = int(r, 1, 5), v = int(r, 1, 6), b = int(r, 1, 5), x0 = -int(r, 2, 8), L = m * v * b;
      const right = `It stays constant at $${L}$ kg m²/s`;
      const o = mcqOptions(r, right, ['It is zero throughout', 'It grows steadily with time', 'It is least when the particle is closest to the origin and grows afterwards', `It stays constant at $${n3(m * v * Math.hypot(x0, b))}$ kg m²/s`]);
      return { q: `A ${m} kg particle moves at a constant ${v} m/s along the line $y = ${b}$ m, starting at $x = ${x0}$ m and heading in the $+x$ direction. How does its angular momentum about the origin behave as time passes?`, ...o,
        sol: `$\\vec L = \\vec r\\times m\\vec v$ has magnitude $m v\\,r\\sin\\phi$, and $r\\sin\\phi$ is the perpendicular distance from the origin to the line of motion, which is always $${b}$ m. No force acts, so there is no torque and $L = mvb = ${m}\\times${v}\\times${b} = ${L}$ kg m²/s at every instant.`,
        trap: 'A body need not move in a circle to have angular momentum; and it is the perpendicular distance that counts, not $r$.' };
    } },
  { id: 'rbr-t26', type: 'nat', level: 3, exams: ['jam'], sub: 'hinged rods', unit: 'm/s',
    make(r) {
      const L = pick(r, 0.5, 3, 0.1), th = choose(r, [30, 45, 60, 90]), v = Math.sqrt(3 * g * L * (1 - Math.cos(rad(th))));
      return { q: `A uniform rod ${L} m long stands upright with its lower end on a hinge and starts to fall from (almost) vertical. When it makes $${th}^\\circ$ with the vertical, the speed of its top end is ______ m/s ($g = 9.8$ m/s², three decimal places).`,
        answer: round(v, 3), tol: Math.max(0.002, round(v * 0.002, 3)), unit: 'm/s', L, th,
        sol: `The centre drops by $\\tfrac{L}{2}(1 - \\cos\\theta)$. Energy: $\\tfrac12\\cdot\\tfrac13ML^2\\omega^2 = Mg\\tfrac{L}{2}(1 - \\cos\\theta)$, so $\\omega^2 = \\dfrac{3g}{L}(1 - \\cos\\theta)$. The top moves at $\\omega L = \\sqrt{3gL(1 - \\cos\\theta)} = \\sqrt{3\\times9.8\\times${L}(1 - \\cos ${th}^\\circ)} = ${round(v, 3)}$ m/s.`,
        trap: 'Using $\\tfrac12Mv^2$ for the whole rod at the top speed: different parts move at different speeds.' };
    },
    verify: (p) => {
      const N = 2000, dl = p.L / N; let s1 = 0, s2 = 0;
      for (let i = 0; i < N; i++) { const s = (i + 0.5) * dl; s1 += s * dl; s2 += s * s * dl; }
      return Math.sqrt((2 * g * (1 - Math.cos(rad(p.th))) * s1) / s2) * p.L;
    } },
];
