// Extra question shapes for vector-algebra (templates va-t21..t26). Imported by vector-algebra.js.
import { int, choose, mcqOptions, round } from '../_util.js';
import { msqOf } from './_more.js';

const nz = (r, lo, hi) => { const v = int(r, lo, hi - 1); return v >= 0 ? v + 1 : v; };
const vec = (v) => `(${v.join(', ')})`;
const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
const norm = (u) => Math.sqrt(dot(u, u));

export default [
  { id: 'va-t21', type: 'msq', level: 2, exams: ['jam'], sub: 'vector identities',
    make(r) {
      const not = r() < 0.5;
      const m = msqOf(r, [
        ['$\\vec a\\times\\vec b = -\\,\\vec b\\times\\vec a$', true, 'The cross product is anti-commutative: swapping the order reverses the right-hand-rule direction.'],
        ['$\\vec a\\cdot(\\vec a\\times\\vec b) = 0$', true, '$\\vec a\\times\\vec b$ is perpendicular to $\\vec a$ (a triple product with a repeated vector vanishes).'],
        ['$\\vec a\\times(\\vec b\\times\\vec c) = \\vec b(\\vec a\\cdot\\vec c) - \\vec c(\\vec a\\cdot\\vec b)$', true, 'This is the BAC-CAB rule.'],
        ['$(\\vec a\\times\\vec b)\\times\\vec c = \\vec a\\times(\\vec b\\times\\vec c)$ for all vectors', false, 'The cross product is not associative: for example $(\\hat i\\times\\hat i)\\times\\hat j = 0$ but $\\hat i\\times(\\hat i\\times\\hat j) = -\\hat j$.'],
        ['$\\vec a\\times\\vec b = \\vec 0$ implies $\\vec a = \\vec 0$ or $\\vec b = \\vec 0$', false, 'Any two parallel non-zero vectors have zero cross product.'],
        ['$|\\vec a\\times\\vec b|^2 + (\\vec a\\cdot\\vec b)^2 = |\\vec a|^2|\\vec b|^2$', true, 'This is Lagrange\'s identity: $a^2b^2\\sin^2\\theta + a^2b^2\\cos^2\\theta = a^2b^2$.'],
        ['$\\vec a\\cdot(\\vec b\\times\\vec c) = (\\vec a\\times\\vec b)\\cdot\\vec c$', true, 'The dot and cross can be swapped in a scalar triple product (both equal the same determinant).'],
        ['$\\vec a\\cdot(\\vec b\\times\\vec c) = \\vec b\\cdot(\\vec a\\times\\vec c)$', false, 'Swapping two vectors in a triple product changes its sign: $\\vec b\\cdot(\\vec a\\times\\vec c) = -\\vec a\\cdot(\\vec b\\times\\vec c)$.'],
        ['$\\vec a\\times\\vec a = |\\vec a|^2$', false, 'The cross product of a vector with itself is the zero vector (and a cross product is a vector, not a number).'],
        ['$\\vec a\\cdot\\vec b = \\vec b\\cdot\\vec a$', true, 'The dot product is commutative.'],
      ], { not });
      return { q: `For arbitrary vectors $\\vec a$, $\\vec b$, $\\vec c$, which of the following statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The cross product is neither commutative nor associative; the dot product is commutative.' };
    } },
  { id: 'va-t22', type: 'nat', level: 2, exams: ['jam'], sub: 'perpendicular vectors', format: 'reverse',
    make(r) {
      const a = int(r, -5, 5), b = nz(r, -5, 5), c = int(r, -5, 5), p = nz(r, -4, 4), qq = int(r, -4, 4);
      const k = -(a * p + c * qq) / b, P = (x) => (x < 0 ? `(${x})` : x);
      return { q: `The vectors $(${p}, k, ${qq})$ and $(${a}, ${b}, ${c})$ are perpendicular. The value of $k$ is ______ (to three decimal places).`,
        answer: round(k, 3), tol: 0.002, a, b, c, p, qq,
        sol: `Perpendicular means the dot product is zero: $${P(p)}\\times${P(a)} + k\\times${P(b)} + ${P(qq)}\\times${P(c)} = 0$, so $${b}k = ${-(a * p + c * qq)}$ and $k = ${round(k, 3)}$.`,
        trap: 'Setting the cross product to zero instead tests for parallel vectors.' };
    },
    verify: (p) => { const f = (k) => p.p * p.a + k * p.b + p.qq * p.c; return -f(0) / (f(1) - f(0)); } },
  { id: 'va-t23', type: 'mcq', level: 2, exams: ['jam'], sub: 'direction cosines',
    make(r) {
      const [al, be, ga] = choose(r, [[60, 60, 45], [45, 60, 60], [60, 45, 60], [45, 45, 90], [90, 45, 45], [30, 90, 60], [90, 60, 30], [60, 90, 30], [30, 60, 90], [120, 45, 60], [135, 60, 60], [120, 120, 45]]);
      const c = (d) => round(Math.cos((d * Math.PI) / 180) ** 2, 4);
      const o = mcqOptions(r, ga, [30, 45, 60, 90].filter((x) => x !== ga), (v) => `$${v}^\\circ$`);
      return { q: `A line makes angles $${al}^\\circ$ with the $x$-axis and $${be}^\\circ$ with the $y$-axis. The angle it makes with the $z$-axis (taking the value between $0^\\circ$ and $90^\\circ$) is`, ...o,
        sol: `Direction cosines satisfy $\\cos^2\\alpha + \\cos^2\\beta + \\cos^2\\gamma = 1$. Here $\\cos^2 ${al}^\\circ + \\cos^2 ${be}^\\circ = ${c(al)} + ${c(be)} = ${round(c(al) + c(be), 4)}$, so $\\cos^2\\gamma = ${round(1 - c(al) - c(be), 4)}$ and $\\gamma = ${ga}^\\circ$${ga === 90 ? '' : ` (or $${180 - ga}^\\circ$ for the opposite sense)`}.`,
        trap: 'The angles themselves do not add to $180^\\circ$; it is the squares of their cosines that add to 1.' };
    } },
  { id: 'va-t24', type: 'nat', level: 3, exams: ['jam'], sub: 'torque', unit: 'N m',
    make(r) {
      const P = [int(r, -3, 4), int(r, -3, 4), int(r, -2, 3)], Q = [int(r, -2, 2), int(r, -2, 2), int(r, -2, 2)];
      const F = [nz(r, -4, 4), int(r, -4, 4), int(r, -3, 3)];
      let rv = P.map((x, i) => x - Q[i]);
      if (norm(cross(rv, F)) === 0) { P[2] += 1; rv = P.map((x, i) => x - Q[i]); if (norm(cross(rv, F)) === 0) { P[1] += 1; rv = P.map((x, i) => x - Q[i]); } }
      const t = cross(rv, F), v = norm(t);
      return { q: `A force $\\vec F = ${vec(F)}$ N acts at the point $P${vec(P)}$ m. The magnitude of its torque about the point $Q${vec(Q)}$ m is ______ N m (to three decimal places).`,
        answer: round(v, 3), tol: Math.max(0.002, round(v * 0.001, 3)), unit: 'N m', rv, F,
        sol: `Use the position of $P$ relative to $Q$: $\\vec r = P - Q = ${vec(rv)}$ m. Then $\\vec\\tau = \\vec r\\times\\vec F = ${vec(t)}$ N m, and $|\\vec\\tau| = \\sqrt{${t.map((x) => x * x).join(' + ')}} = ${round(v, 3)}$ N m.`,
        trap: 'Using the position vector of $P$ from the origin gives the torque about the origin, not about $Q$.' };
    },
    verify: (p) => { const c = dot(p.rv, p.F) / (norm(p.rv) * norm(p.F)); return norm(p.rv) * norm(p.F) * Math.sqrt(Math.max(0, 1 - c * c)); } },
  { id: 'va-t25', type: 'msq', level: 2, exams: ['jam'], sub: 'products',
    make(r) {
      const a = [nz(r, -3, 3), int(r, -3, 3), int(r, -3, 3)], b = [int(r, -3, 3), nz(r, -3, 3), int(r, -3, 3)];
      const d = dot(a, b), c = cross(a, b), A2 = dot(a, a), B2 = dot(b, b), off = choose(r, [-2, -1, 1, 2]);
      const ang = d > 0 ? 'acute' : d < 0 ? 'obtuse' : 'a right angle';
      const m = msqOf(r, [
        [`$\\vec a\\cdot\\vec b = ${d}$`, true, `$${a[0]}\\times${b[0]} + ${a[1]}\\times${b[1]} + ${a[2]}\\times${b[2]} = ${d}$.`],
        [`$\\vec a\\cdot\\vec b = ${d + off}$`, false, `The dot product is $${d}$.`],
        ['The angle between $\\vec a$ and $\\vec b$ is acute', d > 0, `The sign of $\\vec a\\cdot\\vec b = ${d}$ decides it: the angle is ${ang}.`],
        ['The angle between $\\vec a$ and $\\vec b$ is obtuse', d < 0, `The sign of $\\vec a\\cdot\\vec b = ${d}$ decides it: the angle is ${ang}.`],
        ['$|\\vec a| > |\\vec b|$', A2 > B2, `$|\\vec a|^2 = ${A2}$ and $|\\vec b|^2 = ${B2}$.`],
        [`The $z$-component of $\\vec a\\times\\vec b$ is $${c[2]}$`, true, `$(\\vec a\\times\\vec b)_z = a_xb_y - a_yb_x = ${a[0]}\\times${b[1]} - (${a[1]})\\times${b[0]} = ${c[2]}$.`],
        [`The $z$-component of $\\vec a\\times\\vec b$ is $${-c[2] === c[2] ? c[2] + 1 : -c[2]}$`, false, `It is $a_xb_y - a_yb_x = ${c[2]}$ (the order matters).`],
        ['$\\vec a\\times\\vec b$ is perpendicular to $\\vec a + \\vec b$', true, '$\\vec a\\times\\vec b$ is perpendicular to both $\\vec a$ and $\\vec b$, hence to any combination of them.'],
        [`$|\\vec a\\times\\vec b|^2 = ${A2 * B2 - d * d}$`, true, `Lagrange's identity: $|\\vec a|^2|\\vec b|^2 - (\\vec a\\cdot\\vec b)^2 = ${A2 * B2} - ${d * d} = ${A2 * B2 - d * d}$ (check: $${c.map((x) => `(${x})^2`).join(' + ')} = ${dot(c, c)}$).`],
      ]);
      return { q: `For $\\vec a = ${vec(a)}$ and $\\vec b = ${vec(b)}$, which of the following statements are correct?`, ...m,
        trap: 'Swapping the order in a cross-product component flips its sign.' };
    } },
  { id: 'va-t26', type: 'nat', level: 3, exams: ['jam'], sub: 'area',
    make(r) {
      const d1 = [int(r, 1, 4), int(r, -3, 3), int(r, -3, 3)], d2 = [int(r, -3, 3), int(r, -3, 3), int(r, -3, 3)];
      if (norm(cross(d1, d2)) === 0) d2[1] += 1;
      const c = cross(d1, d2), v = norm(c) / 2;
      return { q: `The diagonals of a parallelogram are $\\vec d_1 = ${vec(d1)}$ and $\\vec d_2 = ${vec(d2)}$. Its area is ______ (to three decimal places).`,
        answer: round(v, 3), tol: Math.max(0.002, round(v * 0.001, 3)), d1, d2,
        sol: `If the sides are $\\vec a$ and $\\vec b$, then $\\vec d_1 = \\vec a + \\vec b$ and $\\vec d_2 = \\vec a - \\vec b$ (up to sign), so $\\vec d_1\\times\\vec d_2 = -2\\,\\vec a\\times\\vec b$ and the area is $|\\vec d_1\\times\\vec d_2|/2$. Here $\\vec d_1\\times\\vec d_2 = ${vec(c)}$, of magnitude $${round(norm(c), 4)}$, so the area is $${round(v, 3)}$.`,
        trap: 'Forgetting the factor $\\tfrac12$: the cross product of the diagonals is twice the area.' };
    },
    verify: (p) => { const a = p.d1.map((x, i) => (x + p.d2[i]) / 2), b = p.d1.map((x, i) => (x - p.d2[i]) / 2); return norm(cross(a, b)); } },
];
