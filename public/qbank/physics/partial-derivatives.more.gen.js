// Extra question shapes for partial-derivatives (templates pd-t21..t26). Imported by partial-derivatives.js.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import { msqOf, terms, goldenMin } from './_more.js';

const D = (a, b, c) => `\\left(\\dfrac{\\partial ${a}}{\\partial ${b}}\\right)_{${c}}`;

export default [
  { id: 'pd-t21', type: 'mcq', level: 2, exams: ['jam'], sub: 'stationary points',
    make(r) {
      let a, b, c;
      if (r() < 0.2) [a, b, c] = choose(r, [[1, 2, 1], [1, -2, 1], [1, 4, 4], [2, -4, 2], [-1, 2, -1], [-1, -4, -4], [3, 6, 3]]);
      else { a = choose(r, [-4, -3, -2, -1, 1, 2, 3, 4]); c = choose(r, [-4, -3, -2, -1, 1, 2, 3, 4]); b = int(r, -6, 6); if (b * b === 4 * a * c) b += 1; }
      const det = 4 * a * c - b * b;
      const kind = det < 0 ? 'a saddle point' : det === 0 ? 'not decided by the second-derivative test' : a > 0 ? 'a local minimum' : 'a local maximum';
      const o = mcqOptions(r, kind, ['a local minimum', 'a local maximum', 'a saddle point', 'not decided by the second-derivative test'].filter((x) => x !== kind));
      return { q: `For $f(x, y) = ${terms([[a, 'x^2'], [b, 'xy'], [c, 'y^2']])}$, the origin is a stationary point. According to the second-derivative test, the origin is`, ...o,
        sol: `$f_{xx} = ${2 * a}$, $f_{yy} = ${2 * c}$, $f_{xy} = ${b}$. The test uses $D = f_{xx}f_{yy} - f_{xy}^2 = ${4 * a * c} - ${b * b} = ${det}$. ${det < 0 ? 'A negative $D$ means the surface curves up in one direction and down in another: a saddle.' : det === 0 ? 'When $D = 0$ the test gives no verdict (here the form is a perfect square times a constant, so $f$ is zero along a whole line).' : `A positive $D$ means a true extremum; since $f_{xx} = ${2 * a}$ is ${a > 0 ? 'positive it is a minimum' : 'negative it is a maximum'}.`}`,
        trap: 'Looking only at the signs of $f_{xx}$ and $f_{yy}$ and ignoring the mixed term $f_{xy}$.' };
    } },
  { id: 'pd-t22', type: 'nat', level: 3, exams: ['jam'], sub: 'cyclic relation',
    make(r) {
      const a = int(r, 1, 3), b = int(r, 1, 3), c = int(r, 1, 3), x0 = int(r, 1, 5), y0 = int(r, 1, 5), z0 = int(r, 1, 4);
      const K = x0 ** a * y0 ** b * z0 ** c, v = -(b * x0) / (a * y0);
      const pw = (s, n) => (n === 1 ? s : `${s}^{${n}}`);
      return { q: `Positive variables $x, y, z$ are related by $${pw('x', a)}${pw('y', b)}${pw('z', c)} = ${K}$. At the point $(${x0}, ${y0}, ${z0})$ the partial derivative $${D('x', 'y', 'z')}$ is ______ (to three decimal places).`,
        answer: round(v, 3), tol: Math.max(0.002, round(Math.abs(v) * 0.002, 3)), a, b, c, x0, y0, z0, K,
        sol: `Take logs: $${a}\\ln x + ${b}\\ln y + ${c}\\ln z = \\text{const}$. Differentiate at constant $z$: $${a}\\dfrac{dx}{x} + ${b}\\dfrac{dy}{y} = 0$, so $${D('x', 'y', 'z')} = -\\dfrac{${b}x}{${a}y} = -\\dfrac{${b}\\times${x0}}{${a}\\times${y0}} = ${round(v, 3)}$.`,
        trap: 'The sign: increasing $y$ at fixed $z$ must decrease $x$ to keep the product constant.' };
    },
    verify: (p) => { const X = (y) => (p.K / (y ** p.b * p.z0 ** p.c)) ** (1 / p.a), h = 1e-5; return (X(p.y0 + h) - X(p.y0 - h)) / (2 * h); } },
  { id: 'pd-t23', type: 'msq', level: 2, exams: ['jam'], sub: 'exact differentials',
    make(r) {
      const a = int(r, 2, 5), b = choose(r, [2, 3, 4, 5, 6].filter((x) => x !== a));
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`$${a}y\\,dx + ${a}x\\,dy$ is exact`, true, `$\\partial M/\\partial y = ${a} = \\partial N/\\partial x$; it is $d(${a}xy)$.`],
        [`$${a}y\\,dx + ${b}x\\,dy$ is exact`, false, `$\\partial M/\\partial y = ${a}$ but $\\partial N/\\partial x = ${b}$.`],
        ['$2xy\\,dx + x^2\\,dy$ is exact', true, '$\\partial M/\\partial y = 2x = \\partial N/\\partial x$; it is $d(x^2y)$.'],
        ['$y\\,dx - x\\,dy$ is exact', false, '$\\partial M/\\partial y = 1$ but $\\partial N/\\partial x = -1$ (it becomes exact only after dividing by $y^2$ or $x^2$).'],
        ['$y^2\\,dx + 2xy\\,dy$ is exact', true, '$\\partial M/\\partial y = 2y = \\partial N/\\partial x$; it is $d(xy^2)$.'],
        ['$x^2y\\,dx + xy^2\\,dy$ is exact', false, '$\\partial M/\\partial y = x^2$ but $\\partial N/\\partial x = y^2$.'],
        ['$e^{y}\\,dx + xe^{y}\\,dy$ is exact', true, '$\\partial M/\\partial y = e^y = \\partial N/\\partial x$; it is $d(xe^y)$.'],
        ['$\\cos y\\,dx + x\\sin y\\,dy$ is exact', false, '$\\partial M/\\partial y = -\\sin y$ but $\\partial N/\\partial x = \\sin y$: the signs differ.'],
        ['$\\sin y\\,dx + x\\cos y\\,dy$ is exact', true, '$\\partial M/\\partial y = \\cos y = \\partial N/\\partial x$; it is $d(x\\sin y)$.'],
      ], { not });
      return { q: `Write each differential as $M\\,dx + N\\,dy$. Which of the following statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Compare $\\partial M/\\partial y$ with $\\partial N/\\partial x$ (crossed), not $\\partial M/\\partial x$ with $\\partial N/\\partial y$.' };
    } },
  { id: 'pd-t24', type: 'nat', level: 2, exams: ['jam'], sub: 'total differential',
    make(r) {
      const m = int(r, 1, 2), n = choose(r, [-1, 1, 2]), x0 = int(r, 1, 4), y0 = int(r, 1, 4);
      const dx = pick(r, 0.01, 0.05, 0.01) * (r() < 0.5 ? -1 : 1), dy = pick(r, 0.01, 0.05, 0.01) * (r() < 0.5 ? -1 : 1);
      const f0 = x0 ** m * y0 ** n, fx = m * x0 ** (m - 1) * y0 ** n, fy = n * x0 ** m * y0 ** (n - 1);
      const v = f0 + fx * dx + fy * dy;
      const pw = (s, k) => (k === 1 ? s : `${s}^{${k}}`);
      const sg = (u) => (u < 0 ? `- ${Math.abs(u)}` : `+ ${u}`);
      return { q: `For $f(x, y) = ${pw('x', m)}${pw('y', n)}$, use the total differential (linear approximation) at $(${x0}, ${y0})$ to estimate $f(${x0} ${sg(dx)},\\ ${y0} ${sg(dy)})$. The estimate is ______ (to four decimal places).`,
        answer: round(v, 4), tol: Math.max(0.0005, round(Math.abs(v) * 0.0002, 4)), m, n, x0, y0, dx, dy,
        sol: `$f(${x0}, ${y0}) = ${round(f0, 6)}$, $f_x = ${m}x^{${m - 1}}y^{${n}} = ${round(fx, 6)}$, $f_y = ${n}x^{${m}}y^{${n - 1}} = ${round(fy, 6)}$ at the point. Then $df = f_x\\,dx + f_y\\,dy = ${round(fx, 6)}(${dx}) + ${round(fy, 6)}(${dy}) = ${round(fx * dx + fy * dy, 6)}$, and the estimate is $${round(f0, 6)} + (${round(fx * dx + fy * dy, 6)}) = ${round(v, 4)}$.`,
        trap: 'Using percentage errors here adds magnitudes; a linear estimate keeps the signs of $dx$ and $dy$.' };
    },
    verify: (p) => { const f0 = p.x0 ** p.m * p.y0 ** p.n; return f0 * (1 + p.m * p.dx / p.x0 + p.n * p.dy / p.y0); } },
  { id: 'pd-t25', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'Maxwell relations',
    make(r) {
      const rel = {
        U: [`${D('T', 'V', 'S')} = -${D('P', 'S', 'V')}`, `${D('T', 'V', 'S')} = ${D('P', 'S', 'V')}`, `${D('T', 'S', 'V')} = -${D('P', 'V', 'S')}`],
        H: [`${D('T', 'P', 'S')} = ${D('V', 'S', 'P')}`, `${D('T', 'P', 'S')} = -${D('V', 'S', 'P')}`, `${D('T', 'S', 'P')} = ${D('V', 'P', 'S')}`],
        F: [`${D('S', 'V', 'T')} = ${D('P', 'T', 'V')}`, `${D('S', 'V', 'T')} = -${D('P', 'T', 'V')}`, `${D('S', 'T', 'V')} = ${D('P', 'V', 'T')}`],
        G: [`${D('S', 'P', 'T')} = -${D('V', 'T', 'P')}`, `${D('S', 'P', 'T')} = ${D('V', 'T', 'P')}`, `${D('S', 'T', 'P')} = -${D('V', 'P', 'T')}`],
      };
      const info = { U: ['U', 'T\\,dS - P\\,dV', 'S', 'V'], H: ['H', 'T\\,dS + V\\,dP', 'S', 'P'], F: ['F', '-S\\,dT - P\\,dV', 'T', 'V'], G: ['G', '-S\\,dT + V\\,dP', 'T', 'P'] };
      const k = choose(r, ['U', 'H', 'F', 'G']), [X, dX, u, w] = info[k];
      const other = choose(r, ['U', 'H', 'F', 'G'].filter((x) => x !== k));
      const o = mcqOptions(r, `$${rel[k][0]}$`, [`$${rel[k][1]}$`, `$${rel[k][2]}$`, `$${rel[other][1]}$`]);
      return { q: `A simple fluid has $d${X} = ${dX}$. Equating the mixed second partial derivatives of $${X}(${u}, ${w})$ gives which relation?`, ...o,
        sol: `Read off the first derivatives from $d${X} = ${dX}$, then use $\\dfrac{\\partial^2 ${X}}{\\partial ${w}\\,\\partial ${u}} = \\dfrac{\\partial^2 ${X}}{\\partial ${u}\\,\\partial ${w}}$. This gives $${rel[k][0]}$. The relation with the opposite sign is false, and the one with the variables paired the other way does not even have matching units.`,
        trap: 'Dropping the minus sign that comes with $-P\\,dV$ or $-S\\,dT$.' };
    } },
  { id: 'pd-t26', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'Lagrange multipliers', unit: 'cm²',
    make(r) {
      const V = pick(r, 250, 8000, 250), s = Math.cbrt(2 * V), A = 3 * s * s;
      return { q: `An open-top rectangular box (no lid) must hold $${V}$ cm³. The least possible total area of its base and four sides is ______ cm² (to one decimal place).`,
        answer: round(A, 1), tol: Math.max(0.5, round(A * 0.002, 1)), unit: 'cm²', V,
        sol: `Minimise $S = xy + 2xz + 2yz$ with $xyz = ${V}$. Lagrange conditions: $y + 2z = \\lambda yz$, $x + 2z = \\lambda xz$, $2x + 2y = \\lambda xy$. The first two give $x = y$; the third then gives $z = x/2$. So $x^3/2 = ${V}$, $x = y = \\sqrt[3]{${2 * V}} = ${round(s, 3)}$ cm, $z = ${round(s / 2, 3)}$ cm, and $S = x^2 + 4xz = 3x^2 = ${round(A, 1)}$ cm².`,
        trap: 'A cube is optimal only for a closed box; with no lid the best height is half the base side.' };
    },
    verify: (p) => goldenMin((x) => x * x + (4 * p.V) / x, 1, 100)[1] },
];
