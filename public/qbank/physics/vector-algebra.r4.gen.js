// Round 4 extras for vector-algebra: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => Math.sqrt(dot(a, a));
const tv = (v) => `(${v.map((x) => +x.toFixed(3)).join(', ')})`;

export default {
  items: [
    { id: 'va-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'torque',
      q: R`A small current loop with magnetic moment $\vec m = 2\hat k$ A m² sits in a uniform field $\vec B = 3\hat i$ T. The torque $\vec\tau = \vec m\times\vec B$ on it is`,
      options: [R`$-6\hat j$ N m`, R`$6\hat k$ N m`, R`zero, because $\vec m$ and $\vec B$ are perpendicular`, R`$6\hat j$ N m`], answer: 3,
      sol: R`$\vec m\times\vec B = 2\cdot3\,(\hat k\times\hat i) = 6\hat j$ N m, since the cyclic order $\hat i\to\hat j\to\hat k\to\hat i$ gives $\hat k\times\hat i = +\hat j$. The torque is largest (not zero) when the two vectors are perpendicular, and it points along neither of them.`,
      trap: R`$\hat k\times\hat i = +\hat j$; taking $\hat i\times\hat k$ by mistake flips the sign.` },
    { id: 'va-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'projection',
      q: R`For two non-zero vectors, the scalar projection of $\vec A$ on $\vec B$ equals the scalar projection of $\vec B$ on $\vec A$. Then necessarily`,
      options: [R`either $\vec A\perp\vec B$ or $|\vec A| = |\vec B|$`, R`$\vec A = \vec B$`, R`$\vec A\parallel\vec B$`, R`$|\vec A| = |\vec B|$, and nothing else is possible`], answer: 0,
      sol: R`The projections are $\vec A\cdot\vec B/|\vec B|$ and $\vec A\cdot\vec B/|\vec A|$. Setting them equal: $(\vec A\cdot\vec B)\left(\dfrac1{|\vec B|} - \dfrac1{|\vec A|}\right) = 0$. So either $\vec A\cdot\vec B = 0$ (perpendicular: both projections are zero) or $|\vec A| = |\vec B|$ (any angle). Neither equality of the vectors nor parallelism is needed.`,
      trap: R`Cancelling $\vec A\cdot\vec B$ from both sides loses the perpendicular case.` },
    { id: 'va-r4-03', type: 'mcq', level: 2, exams: ['jam'], sub: 'lines',
      q: R`The line $\vec r = (1, 0, 2) + t(2, 1, -1)$ meets the plane $x + 2y + z = 9$ at the point`,
      options: [R`$(3, 1, 1)$`, R`$(7, 3, -1)$`, R`$(5, 2, 0)$`, R`$(2, 4, 1)$`], answer: 2,
      sol: R`A point of the line is $(1 + 2t,\ t,\ 2 - t)$. Put it into the plane: $(1 + 2t) + 2t + (2 - t) = 3 + 3t = 9$, so $t = 2$ and the point is $(5, 2, 0)$. Check: $5 + 4 + 0 = 9$.`,
      trap: R`$(2, 4, 1)$ also satisfies the plane but is not on the line; check both conditions.` },
    { id: 'va-r4-04', type: 'mcq', level: 3, exams: ['jam'], sub: 'projection',
      q: R`The mirror image (reflection) of the vector $\vec v = (1, 2, 3)$ in the plane $x + y + z = 0$ is`,
      options: [R`$(3, 2, 1)$`, R`$(-3, -2, -1)$`, R`$(-1, 0, 1)$`, R`$(-11, -10, -9)$`], answer: 1,
      sol: R`With the unit normal $\hat n = (1, 1, 1)/\sqrt3$, the reflection keeps the in-plane part and reverses the normal part: $\vec v' = \vec v - 2(\vec v\cdot\hat n)\hat n$. Here $(\vec v\cdot\hat n)\hat n = \tfrac{6}{3}(1, 1, 1) = (2, 2, 2)$, so $\vec v' = (1, 2, 3) - (4, 4, 4) = (-3, -2, -1)$. Its length is still $\sqrt{14}$, as a reflection must keep it. $(-1, 0, 1)$ is only the projection onto the plane.`,
      trap: R`Using the normal $(1, 1, 1)$ without dividing by $|\vec n|^2 = 3$ gives $(-11, -10, -9)$, whose length is wrong.` },
    { id: 'va-r4-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'angle between vectors',
      q: R`Three vectors add to zero, $\vec a + \vec b + \vec c = \vec 0$, with $|\vec a| = 3$, $|\vec b| = 5$ and $|\vec c| = 7$. The angle between $\vec a$ and $\vec b$ is`,
      options: [R`$30^\circ$`, R`$60^\circ$`, R`$90^\circ$`, R`$120^\circ$`], answer: 1,
      sol: R`$\vec c = -(\vec a + \vec b)$, so $|\vec c|^2 = |\vec a|^2 + |\vec b|^2 + 2\vec a\cdot\vec b$: $49 = 9 + 25 + 2\vec a\cdot\vec b$, giving $\vec a\cdot\vec b = 7.5$ and $\cos\theta = 7.5/15 = \tfrac12$, $\theta = 60^\circ$. (Placed head to tail the vectors form a triangle whose interior angle between sides 3 and 5 is $120^\circ$; the angle between the vectors themselves, tail to tail, is its supplement.)`,
      trap: R`$120^\circ$ is the triangle's interior angle, not the angle between the vectors.` },
    { id: 'va-r4-06', type: 'nat', level: 3, exams: ['jam'], sub: 'lines',
      q: R`Particle P starts at the origin and moves with constant velocity $(1, 0, 0)$ m/s. Particle Q starts at the same moment from $(0, 4, 1)$ m with constant velocity $(0, -1, 0)$ m/s. The smallest distance between them is ______ m.`,
      answer: 3, tol: 0.01, unit: 'm', calc: () => { const d = [0, 4, 1], w = [-1, -1, 0]; return norm(cross(d, w)) / norm(w); },
      sol: R`The position of Q relative to P is $\vec d(t) = (0, 4, 1) + t(-1, -1, 0) = (-t,\ 4 - t,\ 1)$. Then $|\vec d|^2 = t^2 + (4 - t)^2 + 1 = 2t^2 - 8t + 17$, smallest at $t = 2$ s where it is $8 - 16 + 17 = 9$. So the closest approach is $3$ m. (Shortcut: distance from a point to a line, $|\vec d_0\times\vec w|/|\vec w| = |(1, -1, 4)|/\sqrt2 = \sqrt{18}/\sqrt2 = 3$.)`,
      trap: R`The starting separation $\sqrt{17}$ is not the minimum; work with the relative velocity.` },
    { id: 'va-r4-07', type: 'nat', level: 2, exams: ['jam'], sub: 'dot product',
      q: R`Two vectors have $|\vec A| = 2$, $|\vec B| = 3$ and $|\vec A + \vec B| = 4$. The value of $\vec A\cdot\vec B$ is ______.`,
      answer: 1.5, tol: 0.01, calc: () => (16 - 4 - 9) / 2,
      sol: R`$|\vec A + \vec B|^2 = |\vec A|^2 + |\vec B|^2 + 2\vec A\cdot\vec B$, so $16 = 4 + 9 + 2\vec A\cdot\vec B$ and $\vec A\cdot\vec B = 1.5$. (Then $|\vec A - \vec B|^2 = 13 - 3 = 10$.)`,
      trap: R`Forgetting the factor 2 in front of the cross term gives 3.` },
    { id: 'va-r4-08', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'products', format: 'statements',
      q: R`Non-zero vectors satisfy $\vec a + \vec b + \vec c = \vec 0$. Which statements must be true?`,
      options: [R`$\vec a\times\vec b = \vec b\times\vec c = \vec c\times\vec a$`, R`$\vec a\times\vec b + \vec b\times\vec c + \vec c\times\vec a = \vec 0$`, R`$\vec a\cdot\vec b + \vec b\cdot\vec c + \vec c\cdot\vec a = -\tfrac12(a^2 + b^2 + c^2)$`, R`$\vec a\cdot(\vec b\times\vec c) = 0$`], answer: [0, 2, 3],
      sol: R`Cross $\vec a + \vec b + \vec c = \vec 0$ with $\vec b$: $\vec a\times\vec b + \vec c\times\vec b = \vec 0$, so $\vec a\times\vec b = \vec b\times\vec c$; crossing with $\vec c$ gives $\vec b\times\vec c = \vec c\times\vec a$. Hence the sum of the three cross products is $3\,\vec a\times\vec b$, which is zero only if $\vec a\parallel\vec b$, not in general. Squaring the sum: $0 = a^2 + b^2 + c^2 + 2(\vec a\cdot\vec b + \vec b\cdot\vec c + \vec c\cdot\vec a)$, which gives the third statement. Since $\vec c = -\vec a - \vec b$ lies in the plane of $\vec a$ and $\vec b$, the triple product is zero.`,
      trap: R`The three cross products are equal, so they add to three times one of them, not to zero.` },
    { id: 'va-r4-09', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'area', format: 'statements',
      q: R`A tetrahedron has vertices $O$ at the origin, $A = (a, 0, 0)$, $B = (0, b, 0)$ and $C = (0, 0, c)$ with $a, b, c > 0$. Let $\vec S_1, \dots, \vec S_4$ be the outward area vectors of its faces ($\vec S_4$ for face $ABC$). Which statements are true?`,
      options: [R`$\vec S_1 + \vec S_2 + \vec S_3 + \vec S_4 = \vec 0$`, R`$|\vec S_4|^2 = |\vec S_1|^2 + |\vec S_2|^2 + |\vec S_3|^2$`, R`$|\vec S_4| = |\vec S_1| + |\vec S_2| + |\vec S_3|$`, R`$\vec S_4 = \tfrac12(bc, ca, ab)$`], answer: [0, 1, 3],
      sol: R`$\vec S_4 = \tfrac12\vec{AB}\times\vec{AC} = \tfrac12(-a, b, 0)\times(-a, 0, c) = \tfrac12(bc, ca, ab)$, pointing away from $O$. The three right-angle faces have outward vectors $-\tfrac12bc\,\hat i$, $-\tfrac12ca\,\hat j$, $-\tfrac12ab\,\hat k$, so the four add to zero (true for any closed surface: $\oint d\vec S = \vec 0$). Because the first three are mutually perpendicular, $|\vec S_4|^2$ is the sum of their squares, a 3D Pythagoras. A plain sum of the areas is too large (the triangle inequality is strict here).`,
      trap: R`Areas add like perpendicular vectors here, so squares add, not the areas themselves.` },
    { id: 'va-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'vector equations',
      q: R`The vector $\vec x$ satisfies $\vec x + \vec a\times\vec x = \vec b$ with $\vec a = (0, 0, 2)$ and $\vec b = (1, 0, 1)$. The value of $|\vec x|^2$ is ______.`,
      answer: 1.2, tol: 0.01, calc: () => { const x = [0.2, -0.4, 1]; return dot(x, x); },
      sol: R`Write $\vec x = (x_1, x_2, x_3)$; then $\vec a\times\vec x = (-2x_2,\ 2x_1,\ 0)$. The three components give $x_1 - 2x_2 = 1$, $x_2 + 2x_1 = 0$, $x_3 = 1$. From the second, $x_2 = -2x_1$, so $5x_1 = 1$: $\vec x = (0.2, -0.4, 1)$ and $|\vec x|^2 = 0.04 + 0.16 + 1 = 1.2$. Check with the general solution $\vec x = \dfrac{\vec b - \vec a\times\vec b + (\vec a\cdot\vec b)\vec a}{1 + a^2} = \dfrac{(1, 0, 1) - (0, 2, 0) + (0, 0, 4)}{5}$, the same vector.`,
      trap: R`Treating $\vec a\times\vec x$ as a scalar multiple of $\vec x$; it mixes the components.` },
  ],
  gens: [
    { id: 'va-r4g1', type: 'nat', level: 3, exams: ['jam'], sub: 'lines',
      make(r) {
        const P = [int(r, -3, 3), int(r, -3, 3), int(r, -3, 3)], u = [int(r, -2, 2), int(r, 0, 2), int(r, -2, 2)];
        const Q = [int(r, -3, 3), int(r, 1, 4), int(r, -3, 3)], v = [int(r, -2, 2), int(r, -2, -1), int(r, -2, 2)];
        const d = Q.map((x, i) => x - P[i]), w = v.map((x, i) => x - u[i]);
        const answer = round(norm(cross(d, w)) / norm(w), 3);
        return { q: R`Particle P starts at ${tv(P)} m with constant velocity ${tv(u)} m/s; particle Q starts at the same moment at ${tv(Q)} m with constant velocity ${tv(v)} m/s. If the motion is extended to all times (past and future), find their smallest separation in metres (to three decimal places).`,
          answer, tol: 0.002, unit: 'm', d, w,
          sol: R`Relative position $\vec d(t) = ${tv(d)} + t\,${tv(w)}$. Its smallest length is the distance from the origin to this line: $\dfrac{|\vec d_0\times\vec w|}{|\vec w|} = \dfrac{|${tv(cross(d, w))}|}{\sqrt{${dot(w, w)}}} = ${answer}$ m, reached at $t = -\vec d_0\cdot\vec w/|\vec w|^2 = ${round(-dot(d, w) / dot(w, w), 3)}$ s.`,
          trap: 'Work in the frame of one particle: only the relative velocity matters.' };
      },
      verify: (p) => { const t = -dot(p.d, p.w) / dot(p.w, p.w); return norm(p.d.map((x, i) => x + t * p.w[i])); } },
    { id: 'va-r4g2', type: 'nat', level: 3, exams: ['jam'], sub: 'angle between vectors',
      make(r) {
        const a = int(r, 2, 9), b = int(r, 2, 9), c = int(r, Math.abs(a - b) + 1, a + b - 1);
        const cos = (c * c - a * a - b * b) / (2 * a * b), answer = round(Math.acos(cos) * 180 / Math.PI, 2);
        return { q: R`Three vectors satisfy $\vec a + \vec b + \vec c = \vec 0$ with $|\vec a| = ${a}$, $|\vec b| = ${b}$ and $|\vec c| = ${c}$. Find the angle between $\vec a$ and $\vec b$ in degrees (to two decimal places).`,
          answer, tol: 0.05, unit: '°', a, b, c,
          sol: R`$|\vec c|^2 = |\vec a + \vec b|^2 = a^2 + b^2 + 2ab\cos\theta$, so $\cos\theta = \dfrac{${c * c} - ${a * a} - ${b * b}}{2\cdot${a}\cdot${b}} = ${round(cos, 4)}$ and $\theta = ${answer}^\circ$.`,
          trap: 'The triangle interior angle is the supplement of the angle between the vectors.' };
      },
      verify: (p) => Math.acos((p.c ** 2 - p.a ** 2 - p.b ** 2) / (2 * p.a * p.b)) * 180 / Math.PI },
    { id: 'va-r4g3', type: 'mcq', level: 3, exams: ['jam'], sub: 'projection',
      make(r) {
        const n = choose(r, [[1, 1, 0], [1, 0, 1], [0, 1, 1], [1, -1, 0], [0, 1, -1], [1, 0, -1]]);
        let v = [int(r, -3, 3), int(r, -3, 3), int(r, -3, 3)];
        if (dot(v, n) === 0) v = v.map((x, i) => x + n[i]);
        const k = dot(v, n); // |n|^2 = 2, so 2 (v.n)/|n|^2 = k
        const refl = v.map((x, i) => x - k * n[i]);
        const { options, answer } = mcqOptions(r, tv(refl), [tv(v.map((x, i) => x - 2 * k * n[i])), tv(v.map((x, i) => x - k * n[i] / 2)), tv(refl.map((x) => -x)), tv(v.map((x, i) => x + k * n[i]))], (s) => `$${s}$`);
        return { q: R`The mirror image of the vector $\vec v = ${tv(v)}$ in the plane through the origin with normal $\vec n = ${tv(n)}$ is`,
          options, answer,
          sol: R`$\vec v' = \vec v - 2\dfrac{\vec v\cdot\vec n}{|\vec n|^2}\vec n$ with $\vec v\cdot\vec n = ${k}$ and $|\vec n|^2 = 2$: $\vec v' = ${tv(v)} ${k < 0 ? '+ ' + -k : '- ' + k}\,${tv(n)} = ${tv(refl)}$. The length is unchanged, $\sqrt{${dot(v, v)}}$.`,
          trap: 'Divide by $|\\vec n|^2$ when the normal is not a unit vector; half the shift gives only the projection onto the plane.' };
      },
      verify: (p) => p.answer },
  ],
};
