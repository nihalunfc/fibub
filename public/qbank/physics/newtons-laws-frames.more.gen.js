// Extra question shapes for newtons-laws-frames (templates nlf-t21..t26). Imported by newtons-laws-frames.js.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import { msqOf } from './_more.js';

const g = 9.8, deg = (x) => (x * 180) / Math.PI, rad = (d) => (d * Math.PI) / 180;
const n3 = (x) => String(+x.toPrecision(3));

export default [
  { id: 'nlf-t21', type: 'msq', level: 2, exams: ['jam'], sub: 'pseudo forces',
    make(r) {
      const a = pick(r, 1, 5, 0.5), m = int(r, 1, 5), th = deg(Math.atan(a / g)), T = m * Math.hypot(g, a);
      const not = r() < 0.35;
      const res = msqOf(r, [
        [`In the car's frame a pendulum bob hangs tilted backwards at $${round(th, 1)}^\\circ$ to the vertical`, true, `In the car frame the bob feels $mg$ down and a pseudo-force $ma$ backwards; the string lines up with their sum, at $\\tan^{-1}(a/g) = \\tan^{-1}(${a}/9.8) = ${round(th, 1)}^\\circ$ behind the vertical.`],
        [`In the car's frame a pendulum bob hangs tilted forwards at $${round(th, 1)}^\\circ$ to the vertical`, false, 'The pseudo-force points opposite to the acceleration, so the bob swings back, not forward.'],
        [`In the car's frame a pendulum bob hangs at $${round(90 - th, 1)}^\\circ$ to the vertical`, false, `$\\tan\\theta = a/g$, not $g/a$: the angle is $${round(th, 1)}^\\circ$.`],
        ['A ball released from rest in the car moves backwards relative to the car while it falls', true, 'No horizontal real force acts on the ball once released, so the car accelerates forward past it; in the car frame it drifts back with acceleration $a$.'],
        ["The car's frame is an inertial frame", false, 'It accelerates, so Newton\'s laws need a pseudo-force there.'],
        [`The string tension on the ${m} kg bob is $${round(T, 2)}$ N`, true, `$T = m\\sqrt{g^2 + a^2} = ${m}\\sqrt{9.8^2 + ${a}^2} = ${round(T, 2)}$ N.`],
        [`The string tension on the ${m} kg bob is $${round(m * g, 2)}$ N`, false, `That is $mg$ alone; the string must also supply the horizontal force $ma$, so $T = ${round(T, 2)}$ N.`],
        [`The pseudo-force on the ${m} kg bob is $${round(m * a, 1)}$ N pointing forwards`, false, `Its size is $ma = ${round(m * a, 1)}$ N, but it points backwards, opposite to the acceleration.`],
      ], { not });
      return { q: `A car accelerates forward at $${a}$ m/s² on a level road. A ${m} kg bob hangs on a string from its roof and is at rest relative to the car ($g = 9.8$ m/s²). Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...res,
        trap: 'The pseudo-force is $-m\\vec a$: opposite to the frame\'s acceleration.' };
    } },
  { id: 'nlf-t22', type: 'nat', level: 2, exams: ['jam'], sub: 'pseudo forces', unit: 'm/s²', format: 'reverse',
    make(r) {
      const th = choose(r, [10, 15, 20, 25, 30, 37, 45, 53, 60]), a = g * Math.tan(rad(th));
      return { q: `A smooth wedge with a $${th}^\\circ$ face rests in a truck. The truck accelerates horizontally, in the direction that pushes the face into the block, so that a small block on the face stays at rest relative to the wedge. The truck's acceleration is ______ m/s² ($g = 9.8$ m/s², two decimal places).`,
        answer: round(a, 2), tol: Math.max(0.01, round(a * 0.002, 2)), unit: 'm/s²', th,
        sol: `In the truck's frame the block feels $mg$ down, the normal force $N$ perpendicular to the face, and the pseudo-force $ma$ horizontally. Balance along the face: $ma\\cos\\theta = mg\\sin\\theta$, so $a = g\\tan\\theta = 9.8\\tan ${th}^\\circ = ${round(a, 2)}$ m/s².`,
        trap: 'Using $g\\sin\\theta$ (the sliding acceleration on a fixed incline) instead of $g\\tan\\theta$.' };
    },
    verify: (p) => { const t = rad(p.th), N = g / Math.cos(t); return N * Math.sin(t); } },
  { id: 'nlf-t23', type: 'mcq', level: 3, exams: ['jam'], sub: 'constraints', format: 'limiting case',
    make(r) {
      const m1 = int(r, 1, 6), W = round(m1 * g, 2), N = (x) => `$${round(x, 2)}$ N`, A = (x) => `$${round(x, 2)}$ m/s²`;
      const C = choose(r, [
        [`Two masses hang over a light frictionless pulley: $m_1 = ${m1}$ kg and $m_2$. As $m_2$ is made much larger than $m_1$, the string tension approaches`, N(2 * W), [N(W), N(0), N(4 * W), N(W / 2)], `$T = \\dfrac{2m_1m_2g}{m_1 + m_2}\\to 2m_1g = ${round(2 * W, 2)}$ N: $m_1$ is pulled up with acceleration close to $g$, so the string must supply $m_1(g + g)$.`],
        [`Two masses hang over a light frictionless pulley: $m_1 = ${m1}$ kg and $m_2$. As $m_2$ is made much larger than $m_1$, the acceleration approaches`, A(g), [A(0), A(g / 2), A(2 * g), A(g / m1)], '$a = \\dfrac{m_2 - m_1}{m_1 + m_2}g\\to g$: the heavy mass almost falls freely.'],
        [`A block of mass $m_1 = ${m1}$ kg on a smooth table is tied by a string over the edge pulley to a hanging mass $m_2$. As $m_2$ is made very large, the tension approaches`, N(W), [N(0), N(2 * W), N(W / 2), N(3 * W)], `$T = \\dfrac{m_1m_2g}{m_1 + m_2}\\to m_1g = ${round(W, 2)}$ N: the table block is dragged with acceleration close to $g$, which needs $m_1g$.`],
        [`A block of mass $m_2 = ${m1}$ kg hangs from a string that runs over a table-edge pulley to a block $m_1$ on a smooth table. As $m_1$ is made very large, the tension approaches`, N(W), [N(0), N(2 * W), N(W / 2), N(W / 4)], `$T = \\dfrac{m_1m_2g}{m_1 + m_2}\\to m_2g = ${round(W, 2)}$ N: the heavy table block barely moves, so the hanging mass is almost in equilibrium.`],
        [`A ${m1} kg block slides down a smooth incline. As the incline angle approaches $90^\\circ$, the normal force on the block approaches`, N(0), [N(W), N(W / 2), N(2 * W), N(W * 0.7071)], `$N = mg\\cos\\theta\\to 0$: a vertical wall does not push on a block falling beside it.`],
      ]);
      const o = mcqOptions(r, C[1], C[2]);
      return { q: `${C[0]} ($g = 9.8$ m/s²)`, ...o, sol: C[3],
        trap: 'Check limiting cases on the general formula rather than guessing: the answer is often finite and simple.' };
    } },
  { id: 'nlf-t24', type: 'msq', level: 2, exams: ['jam'], sub: 'friction',
    make(r) {
      const m = int(r, 2, 10), mus = pick(r, 0.3, 0.6, 0.05), muk = round(mus - 0.1, 2), f = choose(r, [0.5, 0.8, 1.2, 1.5]);
      const Fs = mus * m * g, F = round(f * Fs, 1), moving = F > Fs, fr = moving ? muk * m * g : F, acc = moving ? (F - muk * m * g) / m : 0;
      const not = r() < 0.35;
      const res = msqOf(r, [
        ['The block moves', moving, `The greatest static friction is $\\mu_smg = ${mus}\\times${m}\\times9.8 = ${round(Fs, 2)}$ N, and the push is ${F} N, ${moving ? 'larger' : 'smaller'}.`],
        [`The friction force on the block is $${round(fr, 2)}$ N`, true, moving ? `It slides, so kinetic friction acts: $\\mu_kmg = ${muk}\\times${m}\\times9.8 = ${round(fr, 2)}$ N.` : `It stays at rest, so static friction just balances the push: ${F} N.`],
        [`The friction force on the block is $${round(moving ? Fs : Fs, 2)}$ N`, false, moving ? 'Once sliding, kinetic friction ($\\mu_k$) acts, not the static maximum.' : 'Static friction only rises as far as needed; it equals the push, not its maximum.'],
        [`The block's acceleration is $${round(acc, 2)}$ m/s²`, true, moving ? `$a = (F - \\mu_kmg)/m = (${F} - ${round(muk * m * g, 2)})/${m} = ${round(acc, 2)}$ m/s².` : 'It does not move.'],
        [`The block's acceleration is $${round(F / m, 2)}$ m/s²`, false, `That ignores friction; the correct value is $${round(acc, 2)}$ m/s².`],
        [`The largest possible static friction here is $${round(Fs, 2)}$ N`, true, `$\\mu_smg = ${round(Fs, 2)}$ N.`],
      ], { not });
      return { q: `A ${m} kg block rests on a level floor ($\\mu_s = ${mus}$, $\\mu_k = ${muk}$, $g = 9.8$ m/s²). A horizontal push of ${F} N is applied. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...res,
        trap: 'Static friction is not always $\\mu_sN$; that is only its largest possible value.' };
    } },
  { id: 'nlf-t25', type: 'nat', level: 3, exams: ['jam'], sub: 'circular motion', unit: 's',
    make(r) {
      const L = pick(r, 0.5, 2, 0.1), th = choose(r, [15, 20, 30, 37, 45, 53, 60]), T = 2 * Math.PI * Math.sqrt((L * Math.cos(rad(th))) / g);
      return { q: `A conical pendulum has a string ${L} m long and swings in a horizontal circle with the string at $${th}^\\circ$ to the vertical. Its period is ______ s ($g = 9.8$ m/s², three decimal places).`,
        answer: round(T, 3), tol: Math.max(0.002, round(T * 0.002, 3)), unit: 's', L, th,
        sol: `Vertical: $T_s\\cos\\theta = mg$. Horizontal: $T_s\\sin\\theta = m\\omega^2 L\\sin\\theta$. Dividing, $\\omega^2 = g/(L\\cos\\theta)$, so the period is $2\\pi\\sqrt{L\\cos\\theta/g} = 2\\pi\\sqrt{${L}\\cos ${th}^\\circ/9.8} = ${round(T, 3)}$ s.`,
        trap: 'The radius is $L\\sin\\theta$, but it cancels; the period depends on the height $L\\cos\\theta$ of the cone.' };
    },
    verify: (p) => { const t = rad(p.th), rr = p.L * Math.sin(t), v = Math.sqrt(g * rr * Math.tan(t)); return (2 * Math.PI * rr) / v; } },
  { id: 'nlf-t26', type: 'mcq', level: 2, exams: ['jam'], sub: 'galilean transformations',
    make(r) {
      const d = int(r, 1, 5) * 100, vb = int(r, 3, 6), vr = int(r, 1, vb - 1);
      const kind = int(r, 0, 2), s = (x) => `$${n3(x)}$ s`, mm = (x) => `$${n3(x)}$ m`;
      const C = [
        ['the least possible time to cross', s(d / vb), [s(d / Math.sqrt(vb * vb - vr * vr)), s(d / Math.hypot(vb, vr)), s(d / (vb - vr)), s(d / vr)], `Head straight across: the current only carries the boat sideways and does not change the across-speed $${vb}$ m/s. Time $= ${d}/${vb} = ${n3(d / vb)}$ s.`],
        ['the time to cross along the straight line to the point directly opposite', s(d / Math.sqrt(vb * vb - vr * vr)), [s(d / vb), s(d / Math.hypot(vb, vr)), s(d / (vb - vr)), s(d / vr)], `Aim upstream so the current is cancelled: across-speed $\\sqrt{${vb}^2 - ${vr}^2} = ${n3(Math.sqrt(vb * vb - vr * vr))}$ m/s. Time $= ${n3(d / Math.sqrt(vb * vb - vr * vr))}$ s.`],
        ['the distance it is carried downstream if it heads straight across', mm((vr * d) / vb), [mm((vb * d) / vr), mm((vr * d) / Math.sqrt(vb * vb - vr * vr)), mm(d), mm((vr * d) / Math.hypot(vb, vr))], `Time to cross $= ${d}/${vb}$ s; in that time the current carries it $${vr}\\times${d}/${vb} = ${n3((vr * d) / vb)}$ m.`],
      ][kind];
      const o = mcqOptions(r, C[1], C[2]);
      return { q: `A river ${d} m wide flows at ${vr} m/s. A boat moves at ${vb} m/s relative to the water. Find ${C[0]}.`, ...o, sol: C[3],
        trap: 'Least time and shortest path are different headings: straight across versus angled upstream.' };
    } },
];
