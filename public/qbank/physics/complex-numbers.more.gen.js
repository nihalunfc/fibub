// Extra question shapes for complex-numbers (templates cx-t21..t26). Imported by complex-numbers.js.
import { int, choose, mcqOptions, round, shuffle } from '../_util.js';
import { msqOf } from './_more.js';

const cz = (x, y) => { x += 0; y += 0; if (y === 0) return `${x}`; const im = `${Math.abs(y) === 1 ? '' : Math.abs(y)}i`; return x === 0 ? `${y < 0 ? '-' : ''}${im}` : `${x} ${y < 0 ? '-' : '+'} ${im}`; };

export default [
  { id: 'cx-t21', type: 'mcq', level: 2, exams: ['jam'], sub: 'geometry',
    make(r) {
      const x1 = int(r, -3, 2), y1 = int(r, -3, 3), dx = int(r, 2, 4), x2 = x1 + dx;
      const A = cz(x1, y1), B = cz(x2, y1);
      const L = { line: 'a straight line', circle: 'a circle', ellipse: 'an ellipse', hyper: 'one branch of a hyperbola', para: 'a parabola', ray: 'a half-line (ray)' };
      const za = (w) => (w === '0' ? 'z' : `z - (${w})`);
      const C = choose(r, [
        ['line', `|${za(A)}| = |${za(B)}|`, `The points are equally far from $${A}$ and $${B}$: the perpendicular bisector of the segment joining them, a straight line (here $\\mathrm{Re}\\,z = ${x1 + dx / 2}$).`],
        ['circle', `|${za(A)}| = ${dx}`, `All points at distance ${dx} from $${A}$: a circle of radius ${dx}.`],
        ['ellipse', `|${za(A)}| + |${za(B)}| = ${dx + 2}`, `The sum of the distances from two fixed points (${dx} apart) is a constant ${dx + 2} larger than ${dx}: an ellipse with foci $${A}$ and $${B}$.`],
        ['hyper', `|${za(A)}| - |${za(B)}| = 1`, `The difference of the distances from two foci is a constant 1, smaller than their separation ${dx}: a hyperbola. Since the difference has a fixed sign (closer to $${B}$), only one branch.`],
        ['circle', `|${za(A)}| = 2|${za(B)}|`, `The ratio of distances to two fixed points is a constant other than 1: a circle (the circle of Apollonius).`],
        ['ray', `\\arg(${za(A)}) = \\pi/4`, `All points reached from $${A}$ by moving in the direction at $45^\\circ$: a half-line starting at $${A}$ (the point itself is excluded).`],
      ]);
      const o = mcqOptions(r, L[C[0]], shuffle(r, Object.keys(L).filter((k) => k !== C[0]).map((k) => L[k])));
      return { q: `In the complex plane, the set of points $z$ with $${C[1]}$ is`, ...o,
        sol: `Read $|z - w|$ as the distance from $z$ to the point $w$. ${C[2]}`,
        trap: 'Equal distances give a line, a fixed ratio $\\ne 1$ gives a circle, a fixed sum gives an ellipse.' };
    } },
  { id: 'cx-t22', type: 'msq', level: 2, exams: ['jam'], sub: 'roots of unity',
    make(r) {
      const n = int(r, 3, 8), not = r() < 0.35;
      const m = msqOf(r, [
        [`The ${n} roots of $z^{${n}} = 1$ add up to $0$`, true, `By Vieta, the sum of the roots of $z^{${n}} - 1 = 0$ is minus the coefficient of $z^{${n - 1}}$, which is $0$.`],
        [`The product of the ${n} roots is $1$`, n % 2 === 1, `The product of the roots of $z^n - 1 = 0$ is $(-1)^{n+1}$, which for $n = ${n}$ is $${n % 2 ? 1 : -1}$.`],
        [`The product of the ${n} roots is $-1$`, n % 2 === 0, `The product is $(-1)^{n+1} = ${n % 2 ? 1 : -1}$ for $n = ${n}$.`],
        [`Neighbouring roots are $${round(360 / n, 2)}^\\circ$ apart on the unit circle`, true, `The roots are $e^{2\\pi ik/${n}}$: spacing $360^\\circ/${n}$.`],
        [`Neighbouring roots are $${round(180 / n, 2)}^\\circ$ apart on the unit circle`, false, `The spacing is $360^\\circ/${n} = ${round(360 / n, 2)}^\\circ$.`],
        ['$-1$ is one of the roots', n % 2 === 0, `$(-1)^{${n}} = ${n % 2 ? -1 : 1}$.`],
        ['$i$ is one of the roots', n % 4 === 0, `$i^{${n}} = ${['1', 'i', '-1', '-i'][n % 4]}$.`],
        ['The roots are the vertices of a regular polygon inscribed in the unit circle', true, 'They all have modulus 1 and are equally spaced in angle.'],
      ], { not });
      return { q: `Consider the roots of $z^{${n}} = 1$. Which of the following statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The product of the $n$th roots of unity depends on whether $n$ is odd or even.' };
    } },
  { id: 'cx-t23', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'complex powers',
    make(r) {
      const a = int(r, -3, 3); let b = int(r, -3, 3); if (a === 0 && b === 0) b = 1;
      const th = Math.atan2(b, a), v = Math.exp(-th);
      return { q: `Using the principal branch of the logarithm, the modulus $|(${cz(a, b)})^{i}|$ is ______ (to four decimal places).`,
        answer: round(v, 4), tol: Math.max(0.0005, round(v * 0.002, 4)), a, b,
        sol: `$z^i = e^{i\\,\\mathrm{Log}\\,z}$ with $\\mathrm{Log}\\,z = \\ln|z| + i\\,\\mathrm{Arg}\\,z$. Then $i\\,\\mathrm{Log}\\,z = -\\mathrm{Arg}\\,z + i\\ln|z|$, so $|z^i| = e^{-\\mathrm{Arg}\\,z}$: only the argument matters. Here $\\mathrm{Arg}(${cz(a, b)}) = ${round(th, 4)}$ rad, so $|z^i| = e^{${round(-th, 4)}} = ${round(v, 4)}$.`,
        trap: 'The modulus of $z$ does not enter at all; and the principal argument lies in $(-\\pi, \\pi]$.' };
    },
    verify: (p) => { const m = Math.hypot(p.a, p.b); const th = p.b === 0 ? (p.a > 0 ? 0 : Math.PI) : Math.sign(p.b) * Math.acos(p.a / m); return Math.exp(-th); } },
  { id: 'cx-t24', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'hyperbolic functions',
    make(r) {
      const a = choose(r, [0.5, 1, 1.5, 2, 2.5]), b = choose(r, [0.5, 1, 1.5, 2]), isSin = r() < 0.5;
      const v = Math.sqrt((isSin ? Math.sin(a) ** 2 : Math.cos(a) ** 2) + Math.sinh(b) ** 2);
      const f = isSin ? '\\sin' : '\\cos';
      return { q: `The modulus $|${f}(${a} + ${b}i)|$ is ______ (to three decimal places).`,
        answer: round(v, 3), tol: Math.max(0.002, round(v * 0.002, 3)), a, b, isSin,
        sol: isSin
          ? `$\\sin(x + iy) = \\sin x\\cosh y + i\\cos x\\sinh y$, so $|\\sin(x + iy)|^2 = \\sin^2x\\cosh^2y + \\cos^2x\\sinh^2y = \\sin^2x + \\sinh^2y$ (using $\\cosh^2 = 1 + \\sinh^2$). With $x = ${a}$, $y = ${b}$: $\\sqrt{${round(Math.sin(a) ** 2, 4)} + ${round(Math.sinh(b) ** 2, 4)}} = ${round(v, 3)}$.`
          : `$\\cos(x + iy) = \\cos x\\cosh y - i\\sin x\\sinh y$, so $|\\cos(x + iy)|^2 = \\cos^2x + \\sinh^2y$. With $x = ${a}$, $y = ${b}$: $\\sqrt{${round(Math.cos(a) ** 2, 4)} + ${round(Math.sinh(b) ** 2, 4)}} = ${round(v, 3)}$.`,
        trap: 'Unlike real sines, complex sines are not bounded by 1: the $\\sinh^2 y$ term grows without limit.' };
    },
    verify: (p) => {
      // sin z = (e^{iz} - e^{-iz})/(2i), cos z = (e^{iz} + e^{-iz})/2, with iz = -b + ia
      const e1 = [Math.exp(-p.b) * Math.cos(p.a), Math.exp(-p.b) * Math.sin(p.a)], e2 = [Math.exp(p.b) * Math.cos(-p.a), Math.exp(p.b) * Math.sin(-p.a)];
      const s = p.isSin ? [e1[0] - e2[0], e1[1] - e2[1]] : [e1[0] + e2[0], e1[1] + e2[1]];
      return Math.hypot(s[0], s[1]) / 2;
    } },
  { id: 'cx-t25', type: 'mcq', level: 2, exams: ['jam'], sub: 'geometry',
    make(r) {
      const a = int(r, 1, 5) * (r() < 0.5 ? -1 : 1), b = int(r, 1, 5) * (r() < 0.5 ? -1 : 1);
      const ops = [
        ['rotated by $90^\\circ$ anticlockwise about the origin', ([x, y]) => [-y, x], 'multiplying by $i$'],
        ['rotated by $90^\\circ$ clockwise about the origin', ([x, y]) => [y, -x], 'multiplying by $-i$'],
        ['reflected in the real axis', ([x, y]) => [x, -y], 'taking the conjugate'],
        ['reflected in the imaginary axis', ([x, y]) => [-x, y], 'replacing $z$ by $-\\bar z$'],
      ];
      const [o1, o2] = shuffle(r, ops).slice(0, 2);
      const res = o2[1](o1[1]([a, b])), rev = o1[1](o2[1]([a, b])), only1 = o1[1]([a, b]), only2 = o2[1]([a, b]);
      const show = (p) => `$${cz(p[0], p[1])}$`;
      const o = mcqOptions(r, show(res), [show(rev), show(only1), show(only2), show([-res[0], -res[1]]), show([res[1], res[0]]), show([res[0], -res[1]]), show([-res[0], res[1]])]);
      return { q: `The point $z = ${cz(a, b)}$ is first ${o1[0]} and then ${o2[0]}. The result is`, ...o,
        sol: `First step (${o1[2]}): $${cz(a, b)}\\to ${cz(...only1)}$. Second step (${o2[2]}): $${cz(...only1)}\\to ${cz(...res)}$.${show(rev) !== show(res) ? ` Doing the steps in the other order would give $${cz(...rev)}$: the order matters.` : ''}`,
        trap: 'Rotations and reflections do not commute in general, so apply them in the stated order.' };
    } },
  { id: 'cx-t26', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'analytic functions',
    make(r) {
      const not = r() < 0.4;
      const m = msqOf(r, [
        ['$f(z) = e^z$', true, 'It satisfies the Cauchy-Riemann equations everywhere (entire).'],
        ['$f(z) = z^3 + 2z$', true, 'Every polynomial in $z$ is entire.'],
        ['$f(z) = \\bar z$', false, '$u = x$, $v = -y$: $u_x = 1 \\ne v_y = -1$.'],
        ['$f(z) = |z|^2$', false, '$u = x^2 + y^2$, $v = 0$: Cauchy-Riemann holds only at $z = 0$, so it is analytic nowhere.'],
        ['$f(z) = \\sin z$', true, 'Entire: it is a power series in $z$ converging everywhere.'],
        ['$f(z) = \\mathrm{Re}\\,z$', false, '$u = x$, $v = 0$: $u_x = 1\\ne v_y = 0$.'],
        ['$f(x + iy) = x^2 - y^2 + 2ixy$', true, 'This is $z^2$ written out; $u_x = 2x = v_y$, $u_y = -2y = -v_x$.'],
        ['$f(x + iy) = x^2 + y^2 + 2ixy$', false, '$u_y = 2y$ but $-v_x = -2y$: Cauchy-Riemann fails except on $y = 0$, which is not an open set.'],
        ['$f(z) = 1/z$', false, 'It is analytic except at $z = 0$, where it is not defined, so not analytic in the whole plane.'],
        ['$f(z) = \\cosh z$', true, 'Entire: $(e^z + e^{-z})/2$.'],
        ['$f(z) = e^{\\bar z}$', false, '$u = e^x\\cos y$, $v = -e^x\\sin y$: $u_x = e^x\\cos y\\ne v_y = -e^x\\cos y$ (except where $\\cos y = 0$).'],
      ], { not });
      return { q: `Which of the following functions are ${not ? '<b>NOT</b> analytic' : 'analytic'} in the whole complex plane?`, ...m,
        sol: m.sol.replace('statements that are true', 'functions that are analytic everywhere (marked true)').replace('statements that are false', 'functions that are not analytic everywhere (marked false)'),
        trap: 'Any appearance of $\\bar z$ (or of $x$ and $y$ not combined as $x + iy$) usually breaks analyticity.' };
    } },
];
