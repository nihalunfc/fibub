// Class 11 Maths, Chapter 11 Introduction to Three-dimensional Geometry: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('tg');
const R = String.raw;

export default {
  topic: 'introduction-to-three-dimensional-geometry', name: 'Introduction to Three-dimensional Geometry', n: 11,
  items: [
    m.mcq(1, 'planes', R`<p>The point $(3, -2, 0)$ lies in the:</p>`, R`XY-plane`, [R`YZ-plane`, R`ZX-plane`, R`z-axis`], R`<p>Its $z$-coordinate is 0, and the XY-plane is $z = 0$.</p>`),
    m.mcq(1, 'octants', R`<p>The point $(-2, 3, -5)$ lies in octant:</p>`, R`VI`, [R`V`, R`VII`, R`II`], R`<p>Signs $(-, +, -)$ match octant VI.</p>`, { trap: 'Mixing up the order of signs (x, y, z).' }),
    m.mcq(1, 'planes', R`<p>Every point on the YZ-plane has $x$-coordinate:</p>`, R`$0$`, [R`$1$`, R`any value, but $y = 0$`, R`equal to $y$`], R`<p>The YZ-plane is the plane $x = 0$.</p>`),
    m.mcq(2, 'distance', R`<p>The distance of $(2, -3, 6)$ from the origin is:</p>`, R`$7$`, [R`$11$`, R`$\sqrt{11}$`, R`$5$`], R`<p>$\sqrt{4 + 9 + 36} = \sqrt{49} = 7$.</p>`),
    m.mcq(2, 'distance', R`<p>The distance of $(1, 2, 3)$ from the x-axis is:</p>`, R`$\sqrt{13}$`, [R`$\sqrt{14}$`, R`$1$`, R`$\sqrt{5}$`], R`<p>The foot is $(1, 0, 0)$, so the distance is $\sqrt{2^2 + 3^2} = \sqrt{13}$.</p>`, { trap: 'Using all three coordinates, which gives the distance from the origin.' }),
    m.mcq(2, 'section', R`<p>The midpoint of $(2, -4, 6)$ and $(-6, 2, 8)$ is:</p>`, R`$(-2, -1, 7)$`, [R`$(-4, -2, 14)$`, R`$(-2, 1, 7)$`, R`$(4, -3, 1)$`], R`<p>Average each coordinate: $(-4/2, -2/2, 14/2)$.</p>`),
    m.mcq(2, 'section', R`<p>The point that divides the segment from $A(1, 2, 3)$ to $B(7, 8, 9)$ internally in the ratio $1 : 2$ is:</p>`, R`$(3, 4, 5)$`, [R`$(5, 6, 7)$`, R`$(4, 5, 6)$`, R`$(2, 3, 4)$`], R`<p>$\dfrac{1 \cdot 7 + 2 \cdot 1}{3} = 3$, $\dfrac{8 + 4}{3} = 4$, $\dfrac{9 + 6}{3} = 5$.</p>`, { trap: 'Swapping the weights, which gives the point at the 2 : 1 position.' }),
    m.mcq(2, 'planes', R`<p>The image of $(3, -2, 5)$ in the XY-plane is:</p>`, R`$(3, -2, -5)$`, [R`$(-3, 2, 5)$`, R`$(3, 2, 5)$`, R`$(-3, -2, -5)$`], R`<p>A mirror in the XY-plane flips only the sign of $z$.</p>`),
    m.mcq(3, 'distance', R`<p>The points $A(1, 2, 3)$, $B(2, 3, 4)$ and $C(3, 4, 5)$ are:</p>`, R`collinear`, [R`the vertices of an equilateral triangle`, R`the vertices of a right-angled triangle`, R`the vertices of an isosceles triangle that is not equilateral`], R`<p>$AB = BC = \sqrt3$ and $AC = 2\sqrt3 = AB + BC$, so they are on one line.</p>`),
    m.mcq(3, 'section', R`<p>The YZ-plane divides the segment joining $A(-2, 3, 1)$ and $B(4, -1, 5)$ in the ratio:</p>`, R`$1 : 2$ internally`, [R`$2 : 1$ internally`, R`$1 : 2$ externally`, R`$1 : 1$`], R`<p>On the YZ-plane $x = 0$: $\dfrac{4m - 2n}{m + n} = 0$ gives $m : n = 1 : 2$. Positive, so internal.</p>`),
    m.mcq(3, 'section', R`<p>The centroid of the triangle with vertices $(3, -1, 2)$, $(-2, 5, 4)$ and $(5, 2, -3)$ is:</p>`, R`$(2, 2, 1)$`, [R`$(6, 6, 3)$`, R`$(2, 2, 3)$`, R`$(1, 2, 2)$`], R`<p>Add each coordinate and divide by 3: $(6/3, 6/3, 3/3)$.</p>`),
    m.ar(1, 'planes', R`Every point on the z-axis has the form $(0, 0, z)$.`, R`On the z-axis the distances from the YZ-plane and the ZX-plane are both 0.`, 0, R`<p>Both true: those two distances are $|x|$ and $|y|$.</p>`),
    m.ar(2, 'distance', R`The distance of $(3, 4, 12)$ from the origin is 13.`, R`$OP = \sqrt{x^2 + y^2 + z^2}$.`, 0, R`<p>$\sqrt{9 + 16 + 144} = 13$. Both true and R explains A.</p>`),
    m.ar(2, 'octants', R`Space is divided into eight octants.`, R`The three coordinate planes each cut space into two halves.`, 0, R`<p>$2 \times 2 \times 2 = 8$. Both true and R explains A.</p>`),
    m.ar(3, 'section', R`A point can divide a segment externally in the ratio $1 : 1$.`, R`In the external formula the denominator is $m - n$.`, 3, R`<p>A is false: with $m = n$ the denominator is 0, so there is no such point. R is true.</p>`),
    m.nat(2, 'distance', R`<p>Find the distance between $(1, 2, 3)$ and $(4, 6, 15)$.</p>`, () => 13, 0, R`<p>$\sqrt{9 + 16 + 144} = 13$.</p>`),
    m.nat(2, 'section', R`<p>Find the z-coordinate of the point dividing $(1, 2, 3)$ and $(7, 8, 9)$ internally in the ratio $2 : 1$.</p>`, () => 7, 0, R`<p>$\dfrac{2 \cdot 9 + 1 \cdot 3}{3} = 7$.</p>`),
    m.nat(1, 'octants', R`<p>How many octants does space have?</p>`, () => 8, 0, R`<p>Three planes give $2^3 = 8$ parts.</p>`),
    m.nat(3, 'distance', R`<p>Find the distance of $(3, 4, 5)$ from the z-axis.</p>`, () => 5, 0, R`<p>The foot is $(0, 0, 5)$: $\sqrt{9 + 16} = 5$.</p>`),
    m.nat(2, 'planes', R`<p>Find the distance of $(2, -3, 4)$ from the YZ-plane.</p>`, () => 2, 0, R`<p>It is $|x| = 2$.</p>`),
    m.msq(2, 'planes', R`<p>Which points lie on a coordinate plane? (Choose all that apply.)</p>`, [R`$(0, 3, -2)$`, R`$(1, 0, 0)$`, R`$(2, 3, 4)$`, R`$(-1, -1, 0)$`], [0, 1, 3], R`<p>A zero coordinate puts a point on a coordinate plane. $(2, 3, 4)$ has none.</p>`),
    m.msq(2, 'octants', R`<p>Which points lie in octant VII (all coordinates negative)? (Choose all that apply.)</p>`, [R`$(-1, -2, -3)$`, R`$(-4, -1, 2)$`, R`$(-5, -5, -1)$`, R`$(1, -1, -1)$`], [0, 2], R`<p>Octant VII needs $(-, -, -)$.</p>`),
  ],
  gens: [
    { id: 'tg-g01', type: 'nat', level: 2, exams: ['board'], sub: 'distance',
      make(rng) { const A = [pick(rng, -5, 5), pick(rng, -5, 5), pick(rng, -5, 5)], d = [choose(rng, [3, -4, 6, 2, -2, 8]), choose(rng, [4, 12, -3, 6, 2, 1]), choose(rng, [12, 0, 4, -6, 9, 2])], B = A.map((v, i) => v + d[i]); return { A, B, q: `<p>Find the distance between $(${A.join(', ')})$ and $(${B.join(', ')})$ (2 decimal places).</p>`, answer: Math.sqrt(d[0] ** 2 + d[1] ** 2 + d[2] ** 2), tol: 0.01, sol: `<p>$\\sqrt{${d[0] ** 2} + ${d[1] ** 2} + ${d[2] ** 2}} = ${Math.sqrt(d[0] ** 2 + d[1] ** 2 + d[2] ** 2).toFixed(2)}$.</p>` }; },
      verify: (p) => Math.hypot(Math.hypot(p.B[0] - p.A[0], p.B[1] - p.A[1]), p.B[2] - p.A[2]) },
    { id: 'tg-g02', type: 'nat', level: 2, exams: ['board'], sub: 'distance',
      make(rng) { const P = [pick(rng, -6, 6), pick(rng, -6, 6), pick(rng, -6, 6)]; return { P, q: `<p>Find the distance of $(${P.join(', ')})$ from the origin (2 decimal places).</p>`, answer: Math.sqrt(P[0] ** 2 + P[1] ** 2 + P[2] ** 2), tol: 0.01, sol: `<p>$\\sqrt{${P[0] ** 2} + ${P[1] ** 2} + ${P[2] ** 2}}$.</p>` }; },
      verify: (p) => Math.hypot(p.P[0], p.P[1], p.P[2]) },
    { id: 'tg-g03', type: 'nat', level: 2, exams: ['board'], sub: 'section',
      make(rng) { const mm = pick(rng, 1, 4), nn = pick(rng, 1, 4), k = mm + nn, A = [pick(rng, -4, 4) * k, pick(rng, -4, 4) * k, pick(rng, -4, 4) * k], B = [pick(rng, -4, 4) * k, pick(rng, -4, 4) * k, pick(rng, -4, 4) * k], ax = pick(rng, 0, 2); return { A, B, mm, nn, ax, q: `<p>P divides the segment from $(${A.join(', ')})$ to $(${B.join(', ')})$ internally in the ratio $${mm} : ${nn}$. Find the ${'xyz'[ax]}-coordinate of P.</p>`, answer: (mm * B[ax] + nn * A[ax]) / k, tol: 0.01, sol: `<p>$\\dfrac{${mm} \\cdot ${B[ax]} + ${nn} \\cdot ${A[ax]}}{${k}}$.</p>` }; },
      verify: (p) => p.A[p.ax] + (p.mm / (p.mm + p.nn)) * (p.B[p.ax] - p.A[p.ax]) },
    { id: 'tg-g04', type: 'nat', level: 3, exams: ['board'], sub: 'section',
      make(rng) { const T = [0, 1, 2].map(() => [pick(rng, -3, 3) * 3, pick(rng, -3, 3) * 3, pick(rng, -3, 3) * 3]), ax = pick(rng, 0, 2); return { T, ax, q: `<p>The vertices of a triangle are $(${T[0].join(', ')})$, $(${T[1].join(', ')})$ and $(${T[2].join(', ')})$. Find the ${'xyz'[ax]}-coordinate of its centroid.</p>`, answer: (T[0][ax] + T[1][ax] + T[2][ax]) / 3, tol: 0.01, sol: `<p>$(${T[0][ax]} + ${T[1][ax]} + ${T[2][ax]})/3$.</p>` }; },
      verify: (p) => (p.T[0][p.ax] + 2 * ((p.T[1][p.ax] + p.T[2][p.ax]) / 2)) / 3 },
    { id: 'tg-g05', type: 'nat', level: 3, exams: ['board'], sub: 'distance',
      make(rng) { const P = [pick(rng, -6, 6), pick(rng, -6, 6), pick(rng, -6, 6)], ax = pick(rng, 0, 2), o = [0, 1, 2].filter((i) => i !== ax); return { P, ax, q: `<p>Find the distance of $(${P.join(', ')})$ from the ${'xyz'[ax]}-axis (2 decimal places).</p>`, answer: Math.hypot(P[o[0]], P[o[1]]), tol: 0.01, sol: `<p>$\\sqrt{${P[o[0]] ** 2} + ${P[o[1]] ** 2}}$.</p>` }; },
      verify: (p) => { const F = [0, 1, 2].map((i) => (i === p.ax ? p.P[i] : 0)); return Math.sqrt(p.P.reduce((s, v, i) => s + (v - F[i]) ** 2, 0)); } },
    { id: 'tg-g06', type: 'nat', level: 3, exams: ['board'], sub: 'planes',
      make(rng) { const P = [pick(rng, -6, 6), pick(rng, -6, 6), pick(rng, -6, 6)], pl = pick(rng, 0, 2), nm = ['YZ-plane', 'ZX-plane', 'XY-plane'][pl], co = P[pl]; return { P, pl, q: `<p>Find the distance between $(${P.join(', ')})$ and its image in the ${nm}.</p>`, answer: 2 * Math.abs(co), tol: 0.01, sol: `<p>The image flips the sign of ${'xyz'[pl]} only, so the distance is $2|${co}|$.</p>` }; },
      verify: (p) => { const M = [...p.P]; M[p.pl] = -M[p.pl]; return Math.hypot(p.P[0] - M[0], p.P[1] - M[1], p.P[2] - M[2]); } },
  ],
};
