// Extra question shapes for multiple-integrals (templates mi-t21..t26). Imported by multiple-integrals.js.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import { msqOf, simpson, terms } from './_more.js';

const I2 = (lo1, hi1, lo2, hi2, inner = 'dx', outer = 'dy') => `$\\displaystyle\\int_{${lo1}}^{${hi1}}\\!\\int_{${lo2}}^{${hi2}} f\\,${inner}\\,${outer}$`;

export default [
  { id: 'mi-t21', type: 'mcq', level: 3, exams: ['jam'], sub: 'changing the order',
    make(r) {
      const a = int(r, 1, 4);
      const forms = [
        { orig: I2(0, a, 0, 'x', 'dy', 'dx'), region: `$0\\le y\\le x\\le ${a}$`, right: I2(0, a, 'y', a), wrong: [I2(0, a, 0, 'y'), I2(0, a, 0, a), I2(0, 'x', 'y', a)] },
        { orig: I2(0, a, 'x', a, 'dy', 'dx'), region: `$0\\le x\\le y\\le ${a}$`, right: I2(0, a, 0, 'y'), wrong: [I2(0, a, 'y', a), I2(0, a, 0, a), I2(0, a, 'x', a)] },
        { orig: I2(0, 1, 'x^2', 'x', 'dy', 'dx'), region: '$x^2\\le y\\le x$ for $0\\le x\\le1$, that is $y\\le x\\le\\sqrt y$ for $0\\le y\\le 1$', right: I2(0, 1, 'y', '\\sqrt y'), wrong: [I2(0, 1, '\\sqrt y', 'y'), I2(0, 1, 'y^2', 'y'), I2(0, 1, 'y', 'y^2')] },
        { orig: I2(0, a, 0, `\\sqrt{${a * a}-x^2}`, 'dy', 'dx'), region: `the quarter disc $x, y\\ge0$, $x^2 + y^2\\le ${a * a}$`, right: I2(0, a, 0, `\\sqrt{${a * a}-y^2}`), wrong: [I2(0, a, 0, `\\sqrt{${a * a}-x^2}`), I2(0, a, `\\sqrt{${a * a}-y^2}`, a), I2(0, a, 0, a)] },
        { orig: I2(0, a, 0, '2x', 'dy', 'dx'), region: `$0\\le y\\le 2x$, $0\\le x\\le ${a}$, that is $y/2\\le x\\le ${a}$ for $0\\le y\\le ${2 * a}$`, right: I2(0, 2 * a, 'y/2', a), wrong: [I2(0, a, 'y/2', a), I2(0, 2 * a, 0, 'y/2'), I2(0, 2 * a, '2y', a)] },
      ];
      const F = choose(r, forms);
      const o = mcqOptions(r, F.right, F.wrong);
      return { q: `Reversing the order of integration in ${F.orig} gives`, ...o,
        sol: `Sketch the region first. It is ${F.region}. Now let $y$ run over its full range on the outside and, for each $y$, let $x$ run from the left edge of the region to the right edge. This gives ${F.right}.`,
        trap: 'Swapping the limits without redrawing the region: the new inner limits must be functions of $y$.' };
    } },
  { id: 'mi-t22', type: 'nat', level: 2, exams: ['jam'], sub: 'areas',
    make(r) {
      const line = r() < 0.5;
      if (line) {
        const k = pick(r, 1, 6, 0.5), v = k ** 3 / 6;
        return { q: `The area enclosed between the line $y = ${k}x$ and the parabola $y = x^2$ is ______ (to three decimal places).`,
          answer: round(v, 3), tol: Math.max(0.002, round(v * 0.002, 3)), k, line,
          sol: `They meet where $x^2 = ${k}x$: at $x = 0$ and $x = ${k}$. Between them the line is above, so $A = \\int_0^{${k}}(${k}x - x^2)\\,dx = \\dfrac{${k}^3}{2} - \\dfrac{${k}^3}{3} = \\dfrac{${k}^3}{6} = ${round(v, 3)}$.`,
          trap: 'Integrating $x^2 - ' + k + 'x$ gives a negative area: subtract the lower curve from the upper.' };
      }
      const c = pick(r, 1, 9, 1), v = (4 / 3) * c ** 1.5;
      return { q: `The area enclosed between the parabola $y = x^2$ and the line $y = ${c}$ is ______ (to three decimal places).`,
        answer: round(v, 3), tol: Math.max(0.002, round(v * 0.002, 3)), c, line,
        sol: `They meet at $x = \\pm\\sqrt{${c}}$. $A = \\int_{-\\sqrt{${c}}}^{\\sqrt{${c}}}(${c} - x^2)\\,dx = 2\\left(${c}\\sqrt{${c}} - \\dfrac{${c}\\sqrt{${c}}}{3}\\right) = \\dfrac43\\,${c}^{3/2} = ${round(v, 3)}$.`,
        trap: 'Forgetting the left half: the region is symmetric about the $y$-axis.' };
    },
    verify: (p) => (p.line ? simpson((x) => p.k * x - x * x, 0, p.k) : simpson((x) => p.c - x * x, -Math.sqrt(p.c), Math.sqrt(p.c))) },
  { id: 'mi-t23', type: 'msq', level: 2, exams: ['jam'], sub: 'symmetry',
    make(r) {
      const disc = r() < 0.5, R = int(r, 1, 3);
      const reg = disc ? `the disc $x^2 + y^2\\le ${R * R}$` : `the square $|x|\\le ${R}$, $|y|\\le ${R}$`;
      const S = (f) => `$\\displaystyle\\iint_D ${f}\\,dA = 0$`;
      const odd = 'The region is unchanged by $x\\to -x$ and by $y\\to -y$, and the integrand changes sign under one of them, so its integral is zero.';
      const not = r() < 0.4;
      const m = msqOf(r, [
        [S('x'), true, odd],
        [S('xy'), true, odd],
        [S('x^2y'), true, 'Under $y\\to -y$ the integrand changes sign while the region does not, so the integral is zero.'],
        [S('x^2'), false, 'The integrand is never negative and is positive almost everywhere, so the integral is positive.'],
        [S('(x^2 - y^2)'), true, 'The region is also unchanged by swapping $x$ and $y$, so $\\iint x^2\\,dA = \\iint y^2\\,dA$ and the difference is zero.'],
        [S('(x + y)^2'), false, 'Expanding, the $2xy$ part integrates to zero but $x^2 + y^2$ is positive, so the integral is positive.'],
        [S('|x|'), false, 'The integrand is never negative, so the integral is positive.'],
        [S('x^2y^2'), false, 'The integrand is never negative and not identically zero, so the integral is positive.'],
        [S('\\sin x'), true, '$\\sin x$ is odd in $x$ and the region is symmetric under $x\\to -x$, so the integral is zero.'],
        [S('(y^3 + 2)'), false, `The $y^3$ part integrates to zero but the constant gives $2\\times$ (area of $D$) $\\ne 0$.`],
      ], { not });
      return { q: `Let $D$ be ${reg}. Which of the following statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Symmetry kills odd parts only; any even, positive part (or a constant) survives.' };
    } },
  { id: 'mi-t24', type: 'nat', level: 3, exams: ['jam'], sub: 'spherical coordinates',
    make(r) {
      const al = choose(r, [30, 45, 60]), R = int(r, 1, 5), t = (al * Math.PI) / 180;
      const v = ((2 * Math.PI * R ** 3) / 3) * (1 - Math.cos(t));
      return { q: `A solid "ice-cream cone" is the part of the ball $r\\le ${R}$ that lies inside the cone $\\theta\\le ${al}^\\circ$ ($\\theta$ measured from the $+z$ axis, vertex at the centre). Its volume is ______ (to three decimal places).`,
        answer: round(v, 3), tol: Math.max(0.002, round(v * 0.002, 3)), al, R,
        sol: `In spherical coordinates $dV = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\phi$. So $V = \\int_0^{2\\pi}d\\phi\\int_0^{${al}^\\circ}\\sin\\theta\\,d\\theta\\int_0^{${R}}r^2dr = 2\\pi(1 - \\cos ${al}^\\circ)\\dfrac{${R}^3}{3} = ${round(v, 3)}$.`,
        trap: 'Leaving out the $\\sin\\theta$ in the volume element gives $2\\pi\\theta R^3/3$, which is wrong.' };
    },
    verify: (p) => {
      const t = (p.al * Math.PI) / 180, h = p.R * Math.cos(t);
      return (Math.PI * Math.tan(t) ** 2 * h ** 3) / 3 + simpson((z) => Math.PI * (p.R * p.R - z * z), h, p.R);
    } },
  { id: 'mi-t25', type: 'mcq', level: 2, exams: ['jam'], sub: 'Jacobians',
    make(r) {
      const a = int(r, 1, 4), b = int(r, -3, 3), c = int(r, -3, 3);
      let d = int(r, 1, 4); if (a * d - b * c === 0) d += 1;
      const J = Math.abs(a * d - b * c);
      const show = (v) => `$dx\\,dy = ${v}\\,du\\,dv$`;
      const o = mcqOptions(r, J, [Math.abs(a * d + b * c), Math.abs(a + d), Math.abs(a * c - b * d), J * J, Math.abs(a * b - c * d) || J + 1].filter((v) => v !== J && v !== 0), show);
      return { q: `New variables are defined by $x = ${terms([[a, 'u'], [b, 'v']])}$, $y = ${terms([[c, 'u'], [d, 'v']])}$. In a double integral the area element becomes`, ...o,
        sol: `The Jacobian is $\\dfrac{\\partial(x, y)}{\\partial(u, v)} = \\begin{vmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{vmatrix} = ${a * d} - (${b * c}) = ${a * d - b * c}$. The area element uses its absolute value: $dx\\,dy = ${J}\\,du\\,dv$.`,
        trap: 'The Jacobian is $ad - bc$, a determinant, not $ad + bc$; and take its absolute value.' };
    } },
  { id: 'mi-t26', type: 'nat', level: 3, exams: ['jam'], sub: 'centre of mass',
    make(r) {
      const n = int(r, 1, 4), a = int(r, 1, 6), k = int(r, 1, 3), askX = r() < 0.5;
      const v = askX ? (a * (n + 1)) / (n + 2) : (k * a ** n * (n + 1)) / (2 * (2 * n + 1));
      const curve = `y = ${k === 1 ? '' : k}x^{${n}}`.replace('x^{1}', 'x');
      return { q: `A uniform lamina fills the region under $${curve}$, above the $x$-axis, for $0\\le x\\le ${a}$. The ${askX ? '$x$' : '$y$'}-coordinate of its centre of mass is ______ (to three decimal places).`,
        answer: round(v, 3), tol: Math.max(0.002, round(v * 0.002, 3)), n, a, k, askX,
        sol: `Area $A = \\int_0^{${a}}${k}x^{${n}}dx = \\dfrac{${k}\\cdot${a}^{${n + 1}}}{${n + 1}}$. ${askX
          ? `$\\bar x = \\dfrac1A\\int_0^{${a}} x\\cdot ${k}x^{${n}}dx = \\dfrac{${k}\\cdot${a}^{${n + 2}}/${n + 2}}{${k}\\cdot${a}^{${n + 1}}/${n + 1}} = \\dfrac{${n + 1}}{${n + 2}}\\times${a} = ${round(v, 3)}$.`
          : `Each vertical strip of height $y$ has its centre at $y/2$, so $\\bar y = \\dfrac1A\\int_0^{${a}}\\dfrac{y^2}{2}dx = \\dfrac{${k * k}\\cdot${a}^{${2 * n + 1}}/(2\\times${2 * n + 1})}{${k}\\cdot${a}^{${n + 1}}/${n + 1}} = ${round(v, 3)}$.`}`,
        trap: askX ? 'The centroid lies towards the tall end, not at the midpoint $' + a / 2 + '$.' : 'Each strip contributes $y^2/2$, not $y^2$: its own centre is halfway up.' };
    },
    verify: (p) => {
      const f = (x) => p.k * x ** p.n, A = simpson(f, 0, p.a);
      return p.askX ? simpson((x) => x * f(x), 0, p.a) / A : simpson((x) => f(x) ** 2 / 2, 0, p.a) / A;
    } },
];
