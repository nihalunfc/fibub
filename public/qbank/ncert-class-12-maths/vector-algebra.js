// Class 12 Maths, Chapter 10 Vector Algebra: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose, tidyGens } from '../_util.js';
const m = maker('va');
const R = String.raw;
const QD = [[1, 2, 2, 3], [2, 3, 6, 7], [3, 4, 12, 13], [2, 6, 9, 11], [4, 4, 7, 9], [1, 4, 8, 9]];
const vtex = (v) => `${v[0]}\\hat i ${v[1] < 0 ? '-' : '+'} ${Math.abs(v[1])}\\hat j ${v[2] < 0 ? '-' : '+'} ${Math.abs(v[2])}\\hat k`;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

export default tidyGens({
  topic: 'vector-algebra', name: 'Vector Algebra', n: 10,
  items: [
    m.mcq(1, 'basic', R`<p>Which of these is a scalar quantity?</p>`, R`distance travelled`, [R`displacement`, R`velocity`, R`force`], R`<p>Distance has only a size. Displacement, velocity and force all have a direction.</p>`),
    m.mcq(1, 'magnitude', R`<p>The magnitude of $2\hat i - 2\hat j + \hat k$ is:</p>`, R`$3$`, [R`$5$`, R`$1$`, R`$9$`], R`<p>$\sqrt{4 + 4 + 1} = \sqrt 9 = 3$.</p>`, { trap: 'Forgetting the square root and answering 9.' }),
    m.mcq(1, 'unit', R`<p>The unit vector along $3\hat i + 4\hat j$ is:</p>`, R`$\dfrac{3\hat i + 4\hat j}{5}$`, [R`$\dfrac{3\hat i + 4\hat j}{7}$`, R`$\dfrac{3\hat i + 4\hat j}{25}$`, R`$3\hat i + 4\hat j$`], R`<p>$|\vec a| = \sqrt{9 + 16} = 5$, and a unit vector is $\vec a/|\vec a|$.</p>`),
    m.mcq(1, 'types', R`<p>Two vectors with the same magnitude and opposite directions are:</p>`, R`negatives of each other`, [R`equal`, R`perpendicular`, R`unit vectors`], R`<p>$\vec b = -\vec a$: same length, reversed direction.</p>`),
    m.mcq(2, 'dot', R`<p>For $\vec a = \hat i + 2\hat j + 3\hat k$ and $\vec b = 2\hat i - \hat j$, the value of $\vec a\cdot\vec b$ is:</p>`, R`$0$`, [R`$2$`, R`$-2$`, R`$3$`], R`<p>$1\cdot2 + 2\cdot(-1) + 3\cdot 0 = 0$, so the vectors are perpendicular.</p>`),
    m.mcq(2, 'section', R`<p>The position vector of the mid-point of $A(2, 4, 6)$ and $B(4, 0, 2)$ is:</p>`, R`$3\hat i + 2\hat j + 4\hat k$`, [R`$6\hat i + 4\hat j + 8\hat k$`, R`$\hat i - 2\hat j - 2\hat k$`, R`$2\hat i + 4\hat j + 6\hat k$`], R`<p>The mid-point is $\dfrac{\vec a + \vec b}{2} = (3, 2, 4)$.</p>`),
    m.mcq(2, 'dot', R`<p>The angle between $\hat i + \hat j$ and $\hat i - \hat j$ is:</p>`, R`$90°$`, [R`$0°$`, R`$45°$`, R`$180°$`], R`<p>The dot product is $1 - 1 = 0$, so the vectors are perpendicular.</p>`),
    m.mcq(2, 'cross', R`<p>If $|\vec a| = 3$, $|\vec b| = 4$ and the angle between them is $30°$, then $|\vec a\times\vec b|$ is:</p>`, R`$6$`, [R`$12$`, R`$6\sqrt3$`, R`$3$`], R`<p>$3 \times 4 \times \sin30° = 12 \times \tfrac12 = 6$.</p>`, { trap: 'Using cos 30° (the dot product) instead of sin 30°.' }),
    m.mcq(2, 'projection', R`<p>The scalar projection of $3\hat i + 4\hat j$ on $\hat i$ is:</p>`, R`$3$`, [R`$4$`, R`$5$`, R`$7$`], R`<p>$\dfrac{(3\hat i + 4\hat j)\cdot\hat i}{|\hat i|} = 3$.</p>`),
    m.mcq(2, 'add', R`<p>If $\vec a = 2\hat i + \hat j$ and $\vec b = \hat i - 3\hat j$, then $|\vec a - \vec b|$ is:</p>`, R`$\sqrt{17}$`, [R`$\sqrt{5}$`, R`$5$`, R`$\sqrt{13}$`], R`<p>$\vec a - \vec b = \hat i + 4\hat j$, so the magnitude is $\sqrt{1 + 16} = \sqrt{17}$.</p>`),
    m.mcq(3, 'dot', R`<p>The value of $\lambda$ for which $2\hat i + \lambda\hat j + \hat k$ is perpendicular to $\hat i - 2\hat j + 3\hat k$ is:</p>`, R`$\dfrac52$`, [R`$-\dfrac52$`, R`$\dfrac12$`, R`$2$`], R`<p>The dot product must be zero: $2 - 2\lambda + 3 = 0$, so $\lambda = \dfrac52$.</p>`),
    m.mcq(3, 'cross', R`<p>A unit vector perpendicular to both $\hat i + \hat j$ and $\hat j + \hat k$ is:</p>`, R`$\dfrac{\hat i - \hat j + \hat k}{\sqrt3}$`, [R`$\dfrac{\hat i + \hat j + \hat k}{\sqrt3}$`, R`$\dfrac{\hat i - \hat j + \hat k}{3}$`, R`$\hat i - \hat j + \hat k$`], R`<p>The cross product is $(1\cdot1 - 0\cdot1)\hat i - (1\cdot1 - 0\cdot0)\hat j + (1\cdot1 - 1\cdot0)\hat k = \hat i - \hat j + \hat k$, of length $\sqrt3$. Divide by it (either sign works).</p>`),
    m.mcq(3, 'cross', R`<p>The area of the triangle with vertices $(1, 0, 0)$, $(0, 1, 0)$ and $(0, 0, 1)$ is:</p>`, R`$\dfrac{\sqrt3}{2}$`, [R`$\dfrac12$`, R`$\sqrt3$`, R`$\dfrac{\sqrt2}{2}$`], R`<p>$\overrightarrow{AB} = (-1, 1, 0)$ and $\overrightarrow{AC} = (-1, 0, 1)$ give $\overrightarrow{AB}\times\overrightarrow{AC} = (1, 1, 1)$, of length $\sqrt3$. Half of it: $\dfrac{\sqrt3}{2}$.</p>`),
    m.mcq(3, 'dot', R`<p>If $|\vec a| = |\vec b| = |\vec a + \vec b|$, the angle between $\vec a$ and $\vec b$ is:</p>`, R`$120°$`, [R`$60°$`, R`$90°$`, R`$150°$`], R`<p>$|\vec a + \vec b|^2 = a^2 + b^2 + 2ab\cos\theta$ gives $a^2 = 2a^2 + 2a^2\cos\theta$, so $\cos\theta = -\tfrac12$ and $\theta = 120°$.</p>`),
    m.mcq(3, 'section', R`<p>The point dividing the line from $A(1, 2, 3)$ to $B(2, 0, 1)$ externally in the ratio $3 : 1$ is:</p>`, R`$\left(\dfrac52, -1, 0\right)$`, [R`$\left(\dfrac54, \dfrac12, \dfrac32\right)$`, R`$\left(\dfrac74, \dfrac12, \dfrac32\right)$`, R`$\left(\dfrac32, 1, 2\right)$`], R`<p>$\dfrac{3\vec b - \vec a}{3 - 1} = \dfrac{(6, 0, 3) - (1, 2, 3)}{2} = \left(\dfrac52, -1, 0\right)$.</p>`),
    m.ar(2, 'cross', R`$\vec a\times\vec b = -\,\vec b\times\vec a$ for any two vectors.`, R`Swapping the order reverses the way the fingers curl in the right-hand rule, so the thumb points the other way.`, 0, R`<p>Both true and R explains A.</p>`),
    m.ar(2, 'dot', R`$\vec a\cdot\vec b$ is a vector perpendicular to both $\vec a$ and $\vec b$.`, R`$\vec a\cdot\vec b = |\vec a||\vec b|\cos\theta$.`, 3, R`<p>A is false: the dot product is a scalar. R is a true statement of the definition.</p>`),
    m.ar(2, 'add', R`For two vectors, $|\vec a + \vec b|$ can exceed $|\vec a| + |\vec b|$.`, R`One side of a triangle is never longer than the sum of the other two.`, 3, R`<p>A is false because of the triangle inequality $|\vec a + \vec b| \le |\vec a| + |\vec b|$. R is true.</p>`),
    m.ar(3, 'dot', R`A force perpendicular to the displacement does no work.`, R`Work is $\vec F\cdot\vec d$, and the dot product of perpendicular vectors is zero.`, 0, R`<p>Both true; R is exactly why A holds.</p>`),
    m.ar(3, 'cross', R`$\vec a\times\vec b = \vec 0$ for two non-zero vectors means they are parallel.`, R`$|\vec a\times\vec b| = |\vec a||\vec b|\sin\theta$ and $\sin\theta = 0$ only when $\theta = 0°$ or $180°$.`, 0, R`<p>Both true and R explains A.</p>`),
    m.nat(1, 'magnitude', R`<p>Find $|2\hat i + 3\hat j + 6\hat k|$.</p>`, () => 7, 0, R`<p>$\sqrt{4 + 9 + 36} = 7$.</p>`),
    m.nat(2, 'cross', R`<p>Find the area of the parallelogram with adjacent sides $\hat i + 2\hat j$ and $2\hat i + \hat j$ (square units).</p>`, () => 3, 0, R`<p>$\vec a\times\vec b = (1\cdot1 - 2\cdot2)\hat k = -3\hat k$, magnitude 3.</p>`),
    m.nat(2, 'dot', R`<p>Find $\lambda$ if $\hat i + \lambda\hat j + 2\hat k$ is perpendicular to $3\hat i - \hat j + \hat k$.</p>`, () => 5, 0, R`<p>$3 - \lambda + 2 = 0$, so $\lambda = 5$.</p>`),
    m.nat(3, 'projection', R`<p>Find the scalar projection of $\vec a = 2\hat i + 3\hat j + \hat k$ on $\vec b = 2\hat i + 6\hat j - 3\hat k$ (a decimal to 3 places).</p>`, () => 19 / 7, 0.001, R`<p>$\vec a\cdot\vec b = 4 + 18 - 3 = 19$ and $|\vec b| = 7$, so the projection is $\dfrac{19}{7} = 2.714$.</p>`),
    m.nat(3, 'section', R`<p>$P$ divides $A(2, 0, -4)$ to $B(8, 6, 2)$ internally in the ratio $2 : 1$. Find the $y$-coordinate of $P$.</p>`, () => 4, 0, R`<p>$y = \dfrac{1\cdot0 + 2\cdot6}{3} = 4$.</p>`),
    m.msq(3, 'types', R`<p>Which statements are true for non-zero vectors $\vec a$ and $\vec b$? (Choose all that apply.)</p>`, [R`$\vec a\cdot\vec b = \vec b\cdot\vec a$`, R`$\vec a\times\vec b = \vec b\times\vec a$`, R`$\vec a\cdot\vec b = 0$ means $\vec a\perp\vec b$`, R`$|\vec a\times\vec b| = |\vec a||\vec b|$ when $\vec a\perp\vec b$`], [0, 2, 3], R`<p>The dot product is commutative; the cross product is anti-commutative (so the second is false). Zero dot product means perpendicular; and for perpendicular vectors $\sin 90° = 1$.</p>`),
  ],
  gens: [
    { id: 'va-g01', type: 'nat', level: 1, exams: ['board'], sub: 'magnitude',
      make(rng) { const [a, b, c, mm] = choose(rng, QD), s = [choose(rng, [-1, 1]), choose(rng, [-1, 1]), choose(rng, [-1, 1])], v = [a * s[0], b * s[1], c * s[2]]; return { v, mm, q: `<p>Find the magnitude of $${vtex(v)}$.</p>`, answer: mm, tol: 0, sol: `<p>$\\sqrt{${a * a} + ${b * b} + ${c * c}} = ${mm}$.</p>` }; },
      verify: (p) => Math.hypot(...p.v) },
    { id: 'va-g02', type: 'nat', level: 2, exams: ['board'], sub: 'dot',
      make(rng) { const a = [pick(rng, -5, 5), pick(rng, -5, 5), pick(rng, -5, 5)], b = [pick(rng, -5, 5), pick(rng, -5, 5), pick(rng, -5, 5)], d = dot(a, b); return { a, b, q: `<p>Find $\\vec a\\cdot\\vec b$ for $\\vec a = ${vtex(a)}$ and $\\vec b = ${vtex(b)}$.</p>`, answer: d, tol: 0, sol: `<p>$${a[0]}\\cdot${b[0]} + ${a[1]}\\cdot${b[1]} + ${a[2]}\\cdot${b[2]} = ${d}$.</p>` }; },
      verify: (p) => Math.round((Math.hypot(...p.a.map((t, i) => t + p.b[i])) ** 2 - Math.hypot(...p.a) ** 2 - Math.hypot(...p.b) ** 2) / 2) },
    { id: 'va-g03', type: 'nat', level: 3, exams: ['board'], sub: 'cross',
      make(rng) { const a = [pick(rng, -4, 4), pick(rng, -4, 4), pick(rng, -4, 4)], b = [pick(rng, -4, 4), pick(rng, -4, 4), pick(rng, -4, 4)], c = crs(a, b); return { a, b, q: `<p>Find the area of the parallelogram with adjacent sides $${vtex(a)}$ and $${vtex(b)}$ (2 decimal places).</p>`, answer: Math.hypot(...c), tol: 0.01, sol: `<p>$\\vec a\\times\\vec b = (${c[0]}, ${c[1]}, ${c[2]})$, magnitude $\\sqrt{${c[0] ** 2 + c[1] ** 2 + c[2] ** 2}} = ${Math.hypot(...c).toFixed(2)}$.</p>` }; },
      verify: (p) => Math.sqrt(Math.max(0, Math.hypot(...p.a) ** 2 * Math.hypot(...p.b) ** 2 - dot(p.a, p.b) ** 2)) },
    { id: 'va-g04', type: 'nat', level: 3, exams: ['board'], sub: 'projection',
      make(rng) { const [x, y, z, mm] = choose(rng, QD), b = [x * choose(rng, [-1, 1]), y, z * choose(rng, [-1, 1])], a = [pick(rng, -6, 6), pick(rng, -6, 6), pick(rng, -6, 6)], d = dot(a, b); return { a, b, mm, q: `<p>Find the scalar projection of $\\vec a = ${vtex(a)}$ on $\\vec b = ${vtex(b)}$ (3 decimal places).</p>`, answer: d / mm, tol: 0.01, sol: `<p>$\\vec a\\cdot\\vec b = ${d}$, $|\\vec b| = ${mm}$, so the projection is $\\dfrac{${d}}{${mm}} = ${(d / mm).toFixed(3)}$.</p>` }; },
      verify: (p) => { const u = p.b.map((t) => t / Math.hypot(...p.b)); return dot(p.a, u); } },
    { id: 'va-g05', type: 'nat', level: 2, exams: ['board'], sub: 'dot',
      make(rng) { const a1 = pick(rng, 1, 5), b1 = pick(rng, 1, 4), k = pick(rng, -4, 4), a2 = pick(rng, 1, 5), c2 = pick(rng, 1, 4), b2 = -(a1 * a2 + k * c2) / b1; const B2 = Number.isInteger(b2) ? b2 : -(a1 * a2 + k * c2), B1 = Number.isInteger(b2) ? b1 : 1; return { a1, B1, a2, B2, c2, q: `<p>Find $\\lambda$ so that $${a1}\\hat i + ${B1}\\hat j + \\lambda\\hat k$ is perpendicular to $${a2}\\hat i ${B2 < 0 ? '-' : '+'} ${Math.abs(B2)}\\hat j + ${c2}\\hat k$.</p>`, answer: k, tol: 0, sol: `<p>$${a1 * a2} ${B1 * B2 < 0 ? '-' : '+'} ${Math.abs(B1 * B2)} + ${c2}\\lambda = 0$ gives $\\lambda = ${k}$.</p>` }; },
      verify: (p) => -(p.a1 * p.a2 + p.B1 * p.B2) / p.c2 },
    { id: 'va-g06', type: 'nat', level: 2, exams: ['board'], sub: 'section',
      make(rng) { const A = pick(rng, -8, 8), B = pick(rng, -8, 8), mm = pick(rng, 1, 4), nn = pick(rng, 1, 4); return { A, B, mm, nn, q: `<p>A point $P$ divides the segment from $A$ to $B$ internally in the ratio $${mm} : ${nn}$. If the $x$-coordinates of $A$ and $B$ are ${A} and ${B}, find the $x$-coordinate of $P$ (2 decimal places).</p>`, answer: (nn * A + mm * B) / (mm + nn), tol: 0.01, sol: `<p>$x = \\dfrac{${nn}\\cdot${A} + ${mm}\\cdot${B}}{${mm + nn}} = ${((nn * A + mm * B) / (mm + nn)).toFixed(2)}$.</p>` }; },
      verify: (p) => p.A + (p.mm / (p.mm + p.nn)) * (p.B - p.A) },
    { id: 'va-g07', type: 'nat', level: 2, exams: ['board'], sub: 'cross',
      make(rng) { const P = [pick(rng, 0, 7), pick(rng, 0, 7)], Q = [pick(rng, 0, 7), pick(rng, 0, 7)], S = [pick(rng, 0, 7), pick(rng, 0, 7)], cr = (Q[0] - P[0]) * (S[1] - P[1]) - (Q[1] - P[1]) * (S[0] - P[0]); return { P, Q, S, q: `<p>Using vectors, find the area of the triangle with corners $A(${P[0]}, ${P[1]})$, $B(${Q[0]}, ${Q[1]})$ and $C(${S[0]}, ${S[1]})$ (0 if the points are collinear).</p>`, answer: Math.abs(cr) / 2, tol: 0.005, sol: `<p>$\\tfrac12|\\overrightarrow{AB}\\times\\overrightarrow{AC}| = \\tfrac12|${cr}| = ${Math.abs(cr) / 2}$.</p>` }; },
      verify: (p) => Math.abs(p.P[0] * (p.Q[1] - p.S[1]) + p.Q[0] * (p.S[1] - p.P[1]) + p.S[0] * (p.P[1] - p.Q[1])) / 2 },
  ],
}, ['va-g02']);
