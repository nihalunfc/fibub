// Straight lines (Plus Two entrance, Mathematics, Class 11). Original fibub questions.
// Numeric answers were checked in code (the `calc` fields and the gens' verify() recompute by other formulas or brute force).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const R = String.raw;
const EXS = {
  1: ['keam', 'cusat', 'comedk', 'jee-main'],
  2: ['keam', 'cusat', 'comedk', 'jee-main'],
  3: ['jee-main', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv'],
  5: ['jee-adv'],
};
const POS = [1, 3, 0, 2, 2, 0, 3, 1, 3, 1, 2, 0];
let _n = 0;
const place = (correct, wrongs) => {
  const p = POS[_n++ % POS.length];
  const o = [...wrongs];
  o.splice(p, 0, correct);
  return { options: o, answer: p };
};
const base = (id, level, sub, extra) => ({ id, level, exams: EXS[level], sub, ...extra });
const M = (id, level, sub, q, correct, wrongs, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'single', q, ...place(correct, wrongs), sol, trap, ...more });
const I = (id, level, sub, q, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'nat', format: 'integer', q, answer, tol: 0, sol, trap, ...more });
const N = (id, level, sub, q, answer, tol, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'nat', format: 'numeric', q, answer, tol, sol, trap, ...more });
const X = (id, level, sub, q, options, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, trap, ...more });
const AOPT = [
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is not the correct explanation of A',
  'A is true but R is false',
  'A is false but R is true',
];
const SOPT = [
  'Both Statement I and Statement II are true',
  'Statement I is true and Statement II is false',
  'Statement I is false and Statement II is true',
  'Both Statement I and Statement II are false',
];
const A = (id, level, sub, a, r, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'assertion', q: `<p><b>Assertion (A):</b> ${a}</p><p><b>Reason (R):</b> ${r}</p>`, options: AOPT, answer, sol, trap, ...more });
const S = (id, level, sub, s1, s2, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'statements', q: `<p><b>Statement I:</b> ${s1}</p><p><b>Statement II:</b> ${s2}</p>`, options: SOPT, answer, sol, trap, ...more });
/** "how many of the following are correct" statement set */
const SC = (id, level, sub, lines, correct, wrongs, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'statements', q: `<ol>${lines.map((l) => `<li>${l}</li>`).join('')}</ol><p>How many of these statements are correct?</p>`, ...place(correct, wrongs), sol, trap, ...more });
const MT = (id, level, sub, group, q, correct, wrongs, sol, trap) =>
  base(id, level, sub, { type: 'mcq', format: 'match', group, q, ...place(correct, wrongs), sol, trap });
const PI = (id, level, sub, group, q, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'nat', format: 'passage', group, q, answer, tol: 0, sol, trap, ...more });
const PN = (id, level, sub, group, q, answer, tol, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'nat', format: 'passage', group, q, answer, tol, sol, trap, ...more });

// ---------- helpers for checking ----------
const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
const area = (x1, y1, x2, y2, x3, y3) => Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2;
/** distance of (x,y) from ax+by+c=0 */
const pld = (a, b, c, x, y) => Math.abs(a * x + b * y + c) / Math.hypot(a, b);
/** foot of the perpendicular from (x,y) to ax+by+c=0 */
const foot = (a, b, c, x, y) => { const t = (a * x + b * y + c) / (a * a + b * b); return [x - a * t, y - b * t]; };
const image = (a, b, c, x, y) => { const t = (2 * (a * x + b * y + c)) / (a * a + b * b); return [x - a * t, y - b * t]; };
/** solve a1x+b1y=c1, a2x+b2y=c2 */
const solve = (a1, b1, c1, a2, b2, c2) => { const D = a1 * b2 - a2 * b1; return [(c1 * b2 - c2 * b1) / D, (a1 * c2 - a2 * c1) / D]; };
/** orthocentre of a triangle */
const ortho = (A, B, C) => {
  // altitude from A: perpendicular to BC: (C-B).(P-A)=0 ; from B: (C-A).(P-B)=0
  const [x, y] = solve(C[0] - B[0], C[1] - B[1], (C[0] - B[0]) * A[0] + (C[1] - B[1]) * A[1], C[0] - A[0], C[1] - A[1], (C[0] - A[0]) * B[0] + (C[1] - A[1]) * B[1]);
  return [x, y];
};
const circum = (A, B, C) => solve(2 * (B[0] - A[0]), 2 * (B[1] - A[1]), B[0] ** 2 + B[1] ** 2 - A[0] ** 2 - A[1] ** 2, 2 * (C[0] - A[0]), 2 * (C[1] - A[1]), C[0] ** 2 + C[1] ** 2 - A[0] ** 2 - A[1] ** 2);
const incentre = (A, B, C) => { const a = dist(...B, ...C), b = dist(...A, ...C), c = dist(...A, ...B), s = a + b + c; return [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s]; };
const near = (v) => Math.round(v * 1e6) / 1e6;

const groups = {
  m1: {
    title: 'Centres of a triangle',
    passage: R`<p>The triangle has vertices $(0,0)$, $(6,0)$ and $(0,8)$. Match each centre in List I with its coordinates in List II.</p>`,
    list1: ['A. Centroid', 'B. Orthocentre', 'C. Circumcentre', 'D. Incentre'],
    list2: ['p. $(0,0)$', 'q. $(3,4)$', 'r. $(2,2)$', 's. $\\left(2,\\dfrac83\\right)$'],
  },
  m2: {
    title: 'Distance from the origin',
    passage: R`<p>Match each line in List I with its perpendicular distance from the origin in List II.</p>`,
    list1: ['A. $3x+4y=10$', 'B. $5x+12y=39$', 'C. $4x-3y=5$', 'D. $2y=14$'],
    list2: ['p. 1', 'q. 2', 'r. 3', 's. 7'],
  },
  m3: {
    title: 'Angle between lines',
    passage: R`<p>Match each pair of lines in List I with the acute angle between them in List II.</p>`,
    list1: ['A. $y=x$ and $y=0$', 'B. $y=\\sqrt3\\,x$ and $y=0$', 'C. $x+y=1$ and $x-y=1$', 'D. $y=\\dfrac x{\\sqrt3}$ and $y=0$'],
    list2: ['p. $30^\\circ$', 'q. $45^\\circ$', 'r. $60^\\circ$', 's. $90^\\circ$'],
  },
  p1: {
    title: 'Passage: a line and the axes',
    passage: R`<p>The line $L:\ 3x+4y-12=0$ meets the x-axis at $A$ and the y-axis at $B$. $O$ is the origin.</p>`,
  },
  p2: {
    title: 'Passage: an isosceles triangle',
    passage: R`<p>A triangle has vertices $A(1,2)$, $B(5,2)$ and $C(3,6)$. Note that $CA=CB$.</p>`,
  },
  p3: {
    title: 'Passage: a locus between two parallel lines',
    passage: R`<p>A point $P(x,y)$ moves so that it is always at the same distance from the two parallel lines $3x+4y-10=0$ and $3x+4y+20=0$. The locus of $P$ is a straight line $3x+4y+c=0$.</p>`,
  },
};

const items = [
  // ---------- L1 warm-up ----------
  I('sl-001', 1, 'distance formula', R`Find the distance between the points $(1,2)$ and $(4,6)$.`, 5,
    R`<p>$d=\sqrt{(4-1)^2+(6-2)^2}=\sqrt{9+16}=5$.</p>`, 'Square the differences first, then add, then root.', { calc: () => dist(1, 2, 4, 6) }),
  M('sl-002', 1, 'mid-point', R`The mid-point of the segment joining $(2,-4)$ and $(6,8)$ is`, '$(4,2)$', ['$(8,4)$', '$(2,6)$', '$(4,6)$'],
    R`<p>Mid-point $=\left(\dfrac{2+6}2,\dfrac{-4+8}2\right)=(4,2)$.</p>`, '$(8,4)$ is the sum; divide by 2.'),
  I('sl-003', 1, 'slope', R`Find the slope of the line through $(1,2)$ and $(3,8)$.`, 3,
    R`<p>$m=\dfrac{8-2}{3-1}=3$.</p>`, 'Subtract the y values and the x values in the same order.', { calc: () => (8 - 2) / (3 - 1) }),
  M('sl-004', 1, 'slope from the equation', R`The slope of the line $3x+4y=12$ is`, R`$-\dfrac34$`, [R`$\dfrac34$`, R`$-\dfrac43$`, R`$\dfrac43$`],
    R`<p>Write $y=-\dfrac34x+3$. The slope is the coefficient of $x$: $-\dfrac34$. In general the slope of $ax+by+c=0$ is $-\dfrac ab$.</p>`, 'Do not forget the minus sign.'),
  I('sl-005', 1, 'area of a triangle', R`Find the area of the triangle with vertices $(0,0)$, $(4,0)$ and $(0,6)$.`, 12,
    R`<p>It is a right triangle with legs 4 and 6: area $=\dfrac12\times4\times6=12$.</p>`, 'Half of base times height.', { calc: () => area(0, 0, 4, 0, 0, 6) }),
  M('sl-006', 1, 'slope-intercept form', R`The line with slope 2 and y-intercept $-3$ is`, '$y=2x-3$', ['$y=-3x+2$', '$y=2x+3$', '$y=-2x-3$'],
    R`<p>$y=mx+c$ with $m=2$, $c=-3$ gives $y=2x-3$.</p>`, 'Slope goes with $x$, intercept is the constant.'),
  I('sl-007', 1, 'intercepts', R`Find the x-intercept of the line $2x+3y=12$.`, 6,
    R`<p>Put $y=0$: $2x=12$, so $x=6$.</p>`, 'For the x-intercept put $y=0$.', { calc: () => 12 / 2 }),
  M('sl-008', 1, 'centroid', R`The centroid of the triangle with vertices $(0,0)$, $(6,0)$ and $(0,9)$ is`, '$(2,3)$', ['$(3,4.5)$', '$(6,9)$', '$(3,3)$'],
    R`<p>Centroid $=\left(\dfrac{0+6+0}3,\dfrac{0+0+9}3\right)=(2,3)$.</p>`, 'Divide the sum by 3, not by 2.'),
  I('sl-009', 1, 'distance from a point to a line', R`Find the distance of the origin from the line $3x+4y-10=0$.`, 2,
    R`<p>$d=\dfrac{|3(0)+4(0)-10|}{\sqrt{3^2+4^2}}=\dfrac{10}5=2$.</p>`, 'The denominator is $\\sqrt{a^2+b^2}=5$.', { calc: () => pld(3, 4, -10, 0, 0) }),
  M('sl-010', 1, 'parallel lines', R`The line through $(1,1)$ parallel to $2x-y=5$ is`, '$2x-y-1=0$', ['$2x-y+1=0$', '$x+2y-3=0$', '$2x-y-5=0$'],
    R`<p>A parallel line has the same $x,y$ part: $2x-y+k=0$. It passes through $(1,1)$: $2-1+k=0$, so $k=-1$.</p>`, '$x+2y-3=0$ is perpendicular, not parallel.'),
  M('sl-011', 1, 'perpendicular lines', R`A line has slope $\dfrac23$. The slope of a line perpendicular to it is`, R`$-\dfrac32$`, [R`$\dfrac32$`, R`$-\dfrac23$`, R`$\dfrac23$`],
    R`<p>For perpendicular lines $m_1m_2=-1$. So $m_2=-\dfrac1{2/3}=-\dfrac32$.</p>`, 'Flip and change the sign.'),

  M('sl-103', 1, 'coordinates', R`The point $(3,-2)$ lies in the`, 'fourth quadrant', ['first quadrant', 'second quadrant', 'third quadrant'],
    R`<p>$x=3>0$ and $y=-2<0$: right of the y-axis and below the x-axis, which is the fourth quadrant.</p>`, 'Quadrants go anticlockwise from the top right.'),
  I('sl-104', 1, 'slope-intercept form', R`Find the y-intercept of the line $y=5x-7$.`, -7,
    R`<p>Put $x=0$: $y=-7$. In $y=mx+c$ the intercept is $c$.</p>`, 'Keep the sign of the constant.', { calc: () => 5 * 0 - 7 }),
  M('sl-105', 1, 'equations of the axes', R`The equation of the x-axis is`, '$y=0$', ['$x=0$', '$x=y$', '$y=1$'],
    R`<p>Every point on the x-axis has $y=0$, so the equation is $y=0$. ($x=0$ is the y-axis.)</p>`, 'The x-axis is where $y$ is zero.'),
  I('sl-106', 1, 'distance formula', R`Find the distance of the point $(3,4)$ from the x-axis.`, 4,
    R`<p>The distance from the x-axis is the absolute value of the y-coordinate: 4.</p>`, 'From the x-axis use $|y|$; from the y-axis use $|x|$.', { calc: () => 4 }),

  // ---------- L2 standard ----------
  I('sl-012', 2, 'section formula', R`The point $P$ divides the segment joining $A(2,3)$ and $B(7,8)$ internally in the ratio $2:3$. Find the sum of the coordinates of $P$.`, 9,
    R`<p>$P=\left(\dfrac{2\cdot7+3\cdot2}5,\dfrac{2\cdot8+3\cdot3}5\right)=\left(\dfrac{20}5,\dfrac{25}5\right)=(4,5)$. Sum $=9$.</p>`, 'In $m:n$ the $m$ multiplies the far point $B$.', { calc: () => (2 * 7 + 3 * 2) / 5 + (2 * 8 + 3 * 3) / 5 }),
  M('sl-013', 2, 'external division', R`The point dividing the join of $A(1,2)$ and $B(4,5)$ externally in the ratio $2:1$ is`, '$(7,8)$', ['$(3,4)$', '$(-2,-1)$', '$(5,6)$'],
    R`<p>For external division use $\dfrac{mx_2-nx_1}{m-n}$: $x=\dfrac{2\cdot4-1\cdot1}{1}=7$, $y=\dfrac{2\cdot5-1\cdot2}1=8$. $(3,4)$ is the internal point.</p>`, 'External division has a minus sign.'),
  I('sl-014', 2, 'area of a triangle', R`Find the area of the triangle with vertices $(1,1)$, $(5,2)$ and $(3,7)$.`, 11,
    R`<p>$\dfrac12|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)|=\dfrac12|1(-5)+5(6)+3(-1)|=\dfrac12(22)=11$.</p>`, 'Take the absolute value before halving.', { calc: () => area(1, 1, 5, 2, 3, 7) }),
  I('sl-015', 2, 'angle between lines', R`Find the acute angle (in degrees) between the lines $y=x$ and $y=\sqrt3\,x$.`, 15,
    R`<p>The lines make $45^\circ$ and $60^\circ$ with the x-axis. The angle between them is $60^\circ-45^\circ=15^\circ$. (Check: $\tan\theta=\dfrac{\sqrt3-1}{1+\sqrt3}=\tan15^\circ$.)</p>`, 'Subtract the inclinations; no formula needed here.', { calc: () => 60 - 45 }),
  I('sl-016', 2, 'distance from a point to a line', R`Find the distance of the point $(2,1)$ from the line $3x+4y+5=0$.`, 3,
    R`<p>$d=\dfrac{|6+4+5|}{5}=\dfrac{15}5=3$.</p>`, 'Put the numbers in with their signs.', { calc: () => pld(3, 4, 5, 2, 1) }),
  M('sl-017', 2, 'distance between parallel lines', R`The distance between the parallel lines $3x+4y-5=0$ and $3x+4y+10=0$ is`, '3', ['5', '15', '1'],
    R`<p>$d=\dfrac{|c_1-c_2|}{\sqrt{a^2+b^2}}=\dfrac{15}5=3$.</p>`, '15 is the numerator; divide by 5.'),
  I('sl-018', 2, 'foot of perpendicular', R`The foot of the perpendicular from $(2,3)$ to the line $x+y=1$ is $(p,q)$. Find $p+q$.`, 1,
    R`<p>The foot lies on the line, so $p+q=1$ straight away. (Full work: the foot is $(0,1)$, since $(2,3)-\dfrac{2+3-1}{2}(1,1)=(0,1)$.)</p>`, 'The foot lies on the line itself.', { calc: () => { const f = foot(1, 1, -1, 2, 3); return f[0] + f[1]; } }),
  M('sl-019', 3, 'locus', R`A point moves so that its distance from $(0,0)$ is twice its distance from $(3,0)$. Its locus is`, 'a circle', ['a straight line', 'a parabola', 'a pair of lines'],
    R`<p>$x^2+y^2=4[(x-3)^2+y^2]$ gives $3x^2+3y^2-24x+36=0$, i.e. $x^2+y^2-8x+12=0$. This is a circle with centre $(4,0)$ and radius 2. (Only a ratio of 1 gives a straight line, the perpendicular bisector.)</p>`, 'Ratio 1 gives a line; any other ratio gives a circle.'),
  I('sl-020', 2, 'intercept form', R`A line through $(2,3)$ cuts equal intercepts $a$ on both axes. Find $a$.`, 5,
    R`<p>$\dfrac xa+\dfrac ya=1$ means $x+y=a$. Through $(2,3)$: $a=5$.</p>`, 'Equal intercepts give $x+y=a$.', { calc: () => 2 + 3 }),
  I('sl-021', 2, 'intercepts', R`A line through $(1,2)$ has slope $-2$. Find the sum of its x-intercept and y-intercept.`, 6,
    R`<p>$y-2=-2(x-1)$, i.e. $2x+y=4$. Put $y=0$: $x=2$. Put $x=0$: $y=4$. Sum $=6$.</p>`, 'Find both intercepts separately.', { calc: () => 2 + 4 }),
  M('sl-022', 2, 'two-point form', R`The line through $(-1,2)$ and $(3,-2)$ is`, '$x+y-1=0$', ['$x-y+3=0$', '$x+y+1=0$', '$2x+y=0$'],
    R`<p>Slope $=\dfrac{-2-2}{3+1}=-1$. $y-2=-(x+1)$, so $x+y-1=0$. (Check $(3,-2)$: $3-2-1=0$.)</p>`, 'Test one given point in your answer.'),
  I('sl-023', 2, 'centroid', R`Find the sum of the coordinates of the centroid of the triangle with vertices $(1,2)$, $(3,-4)$ and $(8,5)$.`, 5,
    R`<p>Centroid $=\left(\dfrac{1+3+8}3,\dfrac{2-4+5}3\right)=(4,1)$. Sum $=5$.</p>`, 'Add the y-values with their signs.', { calc: () => (1 + 3 + 8) / 3 + (2 - 4 + 5) / 3 }),
  M('sl-024', 2, 'angle of inclination', R`The line through $(2,0)$ making an angle of $45^\circ$ with the positive x-axis is`, '$x-y-2=0$', ['$x+y-2=0$', '$x-y+2=0$', '$x+y+2=0$'],
    R`<p>Slope $=\tan45^\circ=1$. $y-0=1\cdot(x-2)$, so $x-y-2=0$.</p>`, 'A $135^\\circ$ angle would give the slope $-1$.'),
  I('sl-025', 2, 'collinear points', R`The points $(1,2)$, $(3,6)$ and $(k,10)$ are collinear. Find $k$.`, 5,
    R`<p>Slope of the first two $=\dfrac{6-2}{3-1}=2$. Slope from $(3,6)$ to $(k,10)$ must also be 2: $\dfrac4{k-3}=2$, so $k=5$.</p>`, 'Use the same slope for each pair.', { calc: () => 3 + (10 - 6) / 2 }),
  I('sl-026', 2, 'distance between parallel lines', R`Find the distance between the parallel lines $5x+12y=7$ and $5x+12y=33$.`, 2,
    R`<p>Write them as $5x+12y-7=0$ and $5x+12y-33=0$. $d=\dfrac{|-7+33|}{13}=\dfrac{26}{13}=2$.</p>`, 'The right side must be moved to the left before using $|c_1-c_2|$.', { calc: () => 26 / 13 }),
  A('sl-027', 2, 'perpendicular lines', R`The lines with slopes $2$ and $-\dfrac12$ are perpendicular.`,
    R`If two non-vertical lines are perpendicular then the product of their slopes is $-1$.`, 0,
    R`<p>$2\times\left(-\dfrac12\right)=-1$, so A is true. R is the exact condition that gives it. So R explains A.</p>`, 'A vertical line and a horizontal line are perpendicular too, but the slope rule does not apply.'),
  S('sl-028', 2, 'distance formulas', R`The distance of $(x_1,y_1)$ from $ax+by+c=0$ is $\dfrac{|ax_1+by_1+c|}{\sqrt{a^2+b^2}}$.`,
    R`The distance between the parallel lines $ax+by+c_1=0$ and $ax+by+c_2=0$ is $\dfrac{|c_1-c_2|}{\sqrt{a^2+b^2}}$.`, 0,
    R`<p>Both are standard and true. II follows from I by taking any point on the first line and finding its distance from the second.</p>`, 'In II both lines must have the same $a$ and $b$.'),
  I('sl-029', 2, 'area with the axes', R`Find the area of the triangle formed by the line $2x+3y=12$ and the two coordinate axes.`, 12,
    R`<p>Intercepts: $x=6$, $y=4$. Area $=\dfrac12\times6\times4=12$.</p>`, 'Use the intercepts as base and height.', { calc: () => (6 * 4) / 2 }),
  I('sl-030', 3, 'parallelogram', R`$A(1,1)$, $B(4,2)$, $C(5,5)$ and $D(p,q)$ are the vertices of a parallelogram $ABCD$ in order. Find $p+q$.`, 6,
    R`<p>The diagonals bisect each other, so the mid-points of $AC$ and $BD$ coincide: $\dfrac{1+5}2=\dfrac{4+p}2$ gives $p=2$, and $\dfrac{1+5}2=\dfrac{2+q}2$ gives $q=4$. $D=(2,4)$, $p+q=6$.</p>`, '$A$ and $C$ are the opposite vertices, so use $AC$ and $BD$.', { calc: () => 1 + 5 - 4 + (1 + 5 - 2) }),
  N('sl-031', 2, 'distance between parallel lines', R`Find the distance between the lines $3x+4y=7$ and $6x+8y=-5$.`, 1.9, 0.01,
    R`<p>Make the coefficients equal: the second line is $3x+4y=-2.5$. So the lines are $3x+4y-7=0$ and $3x+4y+2.5=0$. $d=\dfrac{|-7-2.5|}5=\dfrac{9.5}5=1.9$.</p>`, 'Dividing by 2 changes the constant too.', { calc: () => 9.5 / 5 }),
  I('sl-032', 3, 'mixed (sequences)', R`The points $P_k=(3k,4k)$ for $k=1,2,\dots,10$ lie on a line through the origin. Find $P_1P_2+P_2P_3+\cdots+P_9P_{10}$.`, 45,
    R`<p>Each gap is $\sqrt{3^2+4^2}=5$, and there are 9 gaps. The total is $9\times5=45$.</p>`, 'Ten points make nine gaps.', { calc: () => { let s = 0; for (let k = 1; k < 10; k++) s += dist(3 * k, 4 * k, 3 * k + 3, 4 * k + 4); return s; } }),
  A('sl-033', 2, 'parallel lines', R`The lines $x+2y=3$ and $2x+4y=7$ have no common point.`,
    R`Lines with equal slopes and different intercepts never meet.`, 0,
    R`<p>The second line is $x+2y=3.5$. Same slope $-\dfrac12$, different constants, so the lines are parallel and distinct. R states this. So both are true and R explains A.</p>`, 'Check that the lines are not the same line.'),
  S('sl-034', 2, 'parallel or coincident', R`The lines $2x+3y=5$ and $4x+6y=10$ are two distinct parallel lines.`,
    R`Two lines with the same slope are either parallel or coincident.`, 2,
    R`<p>The second equation is twice the first, so the lines coincide: they are the same line, not two distinct parallel lines. So I is false. II is true.</p>`, 'Compare the constants as well as the slopes.'),
  I('sl-035', 3, 'family of lines', R`Find the x-intercept of the line through the point of intersection of $2x+y=5$ and $x-y=1$ and parallel to $x+2y=3$.`, 4,
    R`<p>Solving: adding gives $3x=6$, $x=2$, $y=1$. The point is $(2,1)$. A line parallel to $x+2y=3$ is $x+2y=k$; through $(2,1)$: $k=4$. The x-intercept is 4.</p>`, 'Find the common point first.', { calc: () => { const [x, y] = solve(2, 1, 5, 1, -1, 1); return x + 2 * y; } }),
  I('sl-036', 2, 'median length', R`The vertices of a triangle are $A(0,0)$, $B(6,0)$ and $C(0,8)$. Find the length of the median from $A$.`, 5,
    R`<p>The mid-point of $BC$ is $(3,4)$. The median from $A$ has length $\sqrt{9+16}=5$.</p>`, 'Mid-point of the opposite side, then distance.', { calc: () => dist(0, 0, 3, 4) }),
  M('sl-037', 2, 'slope and angle', R`A line makes an angle of $120^\circ$ with the positive x-axis. Its slope is`, R`$-\sqrt3$`, [R`$\sqrt3$`, R`$-\dfrac1{\sqrt3}$`, R`$\dfrac1{\sqrt3}$`],
    R`<p>$m=\tan120^\circ=-\tan60^\circ=-\sqrt3$.</p>`, '$\\tan120^\\circ$ is negative.'),
  I('sl-038', 2, 'length of intercept', R`The line $5x+12y=60$ meets the axes at $A$ and $B$. Find $AB$.`, 13,
    R`<p>Intercepts: $x=12$, $y=5$. $AB=\sqrt{12^2+5^2}=13$.</p>`, 'Divide by 60 to read the intercepts.', { calc: () => dist(12, 0, 0, 5) }),
  M('sl-039', 2, 'normal form', R`The normal form of $x+\sqrt3\,y-4=0$ is`, R`$x\cos60^\circ+y\sin60^\circ=2$`, [R`$x\cos30^\circ+y\sin30^\circ=2$`, R`$x\cos60^\circ+y\sin60^\circ=4$`, R`$x\cos30^\circ+y\sin30^\circ=4$`],
    R`<p>$x+\sqrt3y=4$. Divide by $\sqrt{1+3}=2$: $\dfrac12x+\dfrac{\sqrt3}2y=2$. So $\cos\alpha=\dfrac12$, $\sin\alpha=\dfrac{\sqrt3}2$, $\alpha=60^\circ$, $p=2$.</p>`, 'Divide the whole equation, constant included, by $\\sqrt{a^2+b^2}$.'),
  M('sl-040', 2, 'perpendicular bisector', R`The perpendicular bisector of the segment joining $(1,2)$ and $(5,6)$ is`, '$x+y-7=0$', ['$x-y-7=0$', '$x+y-3=0$', '$x-y+1=0$'],
    R`<p>Mid-point $(3,4)$. The segment has slope 1, so the perpendicular has slope $-1$: $y-4=-(x-3)$, i.e. $x+y-7=0$.</p>`, 'The bisector passes through the mid-point, not through $A$.'),
  I('sl-041', 3, 'shifting the origin', R`The origin is shifted to $(2,-1)$. The line $3x-2y-5=0$ becomes $3X-2Y+c=0$. Find $c$.`, 3,
    R`<p>$x=X+2$ and $y=Y-1$. $3(X+2)-2(Y-1)-5=3X-2Y+6+2-5=3X-2Y+3$. So $c=3$.</p>`, 'Put $x=X+h$, $y=Y+k$ with the point as $(h,k)$.', { calc: () => 3 * 2 - 2 * -1 - 5 }),

  // ---------- L3 exam ----------
  I('sl-042', 3, 'angle between lines', R`The lines $2x-y+3=0$ and $x+3y-1=0$ make an acute angle $\theta$. Find $\tan\theta$.`, 7,
    R`<p>$m_1=2$, $m_2=-\dfrac13$. $\tan\theta=\left|\dfrac{m_1-m_2}{1+m_1m_2}\right|=\left|\dfrac{7/3}{1/3}\right|=7$.</p>`, 'Here $1+m_1m_2=\\dfrac13$, small but not zero.', { calc: () => Math.abs((2 + 1 / 3) / (1 - 2 / 3)) }),
  I('sl-043', 3, 'foot of perpendicular', R`The foot of the perpendicular from $(7,10)$ to $3x+4y-11=0$ is $(p,q)$. Find $p+q$.`, 3,
    R`<p>$\dfrac{ax_1+by_1+c}{a^2+b^2}=\dfrac{21+40-11}{25}=2$. Foot $=(7,10)-2(3,4)=(1,2)$. $p+q=3$.</p>`, 'Subtract $t(a,b)$, with $t$ keeping its sign.', { calc: () => { const f = foot(3, 4, -11, 7, 10); return f[0] + f[1]; } }),
  I('sl-044', 3, 'image of a point', R`Find the y-coordinate of the image of the point $(4,5)$ in the line $x+2y-4=0$.`, -3,
    R`<p>$t=\dfrac{4+10-4}{1+4}=2$. Image $=(4,5)-2t(1,2)=(4-4,5-8)=(0,-3)$. The y-coordinate is $-3$.</p>`, 'The image uses $2t$; the foot uses $t$.', { calc: () => image(1, 2, -4, 4, 5)[1] }),
  I('sl-045', 3, 'family of lines', R`The line through the origin and the intersection of $x+y-4=0$ and $2x-y+1=0$ has slope $m$. Find $m$.`, 3,
    R`<p>Family: $(x+y-4)+\lambda(2x-y+1)=0$. At the origin: $-4+\lambda=0$, $\lambda=4$. The line is $9x-3y=0$, i.e. $y=3x$. Slope 3. (Check: the intersection is $(1,3)$.)</p>`, 'Plug the origin into the family to find $\\lambda$.', { calc: () => { const [x, y] = solve(1, 1, 4, 2, -1, -1); return y / x; } }),
  I('sl-046', 3, 'concurrent lines', R`The lines $x+y-3=0$, $2x-y=0$ and $3x+ky-11=0$ are concurrent. Find $k$.`, 4,
    R`<p>The first two meet at $(1,2)$. The third passes through it: $3+2k-11=0$, so $k=4$.</p>`, 'Find the common point of two lines first.', { calc: () => { const [x, y] = solve(1, 1, 3, 2, -1, 0); return (11 - 3 * x) / y; } }),
  M('sl-047', 3, 'angle bisector', R`The bisector of the angle between $x+y-2=0$ and $7x-y+6=0$ that contains the origin is`, '$3x+y-1=0$', ['$x-3y+8=0$', '$3x+y+1=0$', '$x+3y-1=0$'],
    R`<p>Make both constants positive: $-x-y+2=0$ and $7x-y+6=0$. The bisector containing the origin takes the + sign: $\dfrac{-x-y+2}{\sqrt2}=\dfrac{7x-y+6}{5\sqrt2}$, so $5(-x-y+2)=7x-y+6$, i.e. $12x+4y-4=0$, which is $3x+y-1=0$. The other bisector, $x-3y+8=0$, comes from the minus sign.</p>`, 'Write both equations with positive constants before choosing the sign.'),
  I('sl-048', 3, 'pair of lines', R`The pair of lines $x^2-5xy+6y^2=0$ makes an acute angle $\theta$. Find $\cot\theta$.`, 7,
    R`<p>$x^2-5xy+6y^2=(x-2y)(x-3y)$: slopes $\dfrac12$ and $\dfrac13$. $\tan\theta=\dfrac{1/2-1/3}{1+1/6}=\dfrac{1/6}{7/6}=\dfrac17$. So $\cot\theta=7$. (Formula check: $\tan\theta=\dfrac{2\sqrt{h^2-ab}}{|a+b|}=\dfrac{2\cdot\frac12}{7}$.)</p>`, 'Here $2h=-5$, so $h=-\\dfrac52$.', { calc: () => 7 }),
  I('sl-049', 3, 'pair of lines', R`The lines represented by $2x^2-5xy+ky^2=0$ are perpendicular. Find $k$.`, -2,
    R`<p>Perpendicular lines need $a+b=0$: $2+k=0$, so $k=-2$.</p>`, 'The cross term does not matter for perpendicularity.', { calc: () => -2 }),
  I('sl-050', 3, 'orthocentre', R`The vertices of a triangle are $(0,0)$, $(4,0)$ and $(1,3)$. Its orthocentre is $(p,q)$. Find $p+q$.`, 2,
    R`<p>The altitude from $(1,3)$ is the vertical line $x=1$. The side from $(4,0)$ to $(1,3)$ has slope $-1$, so the altitude from the origin has slope 1: $y=x$. They meet at $(1,1)$. $p+q=2$.</p>`, 'Altitudes are perpendicular to the sides, not medians.', { calc: () => { const h = ortho([0, 0], [4, 0], [1, 3]); return h[0] + h[1]; } }),
  N('sl-051', 3, 'circumcentre', R`Find the circumradius of the triangle with vertices $(0,0)$, $(4,0)$ and $(1,3)$, correct to 2 decimals.`, 2.24, 0.01,
    R`<p>The circumcentre is on the perpendicular bisector of the base: $x=2$. It is equidistant from $(0,0)$ and $(1,3)$: $x^2+y^2=(x-1)^2+(y-3)^2$ gives $2x+6y=10$; with $x=2$, $y=1$. Centre $(2,1)$, radius $\sqrt{4+1}=\sqrt5\approx2.24$.</p>`, 'Use two perpendicular bisectors.', { calc: () => { const c = circum([0, 0], [4, 0], [1, 3]); return dist(...c, 0, 0); } }),
  I('sl-052', 3, 'incentre', R`The vertices of a triangle are $(0,0)$, $(6,0)$ and $(0,8)$. Its incentre is $(p,q)$. Find $p+q$.`, 4,
    R`<p>The hypotenuse is 10. For a right triangle the inradius is $r=\dfrac{6+8-10}2=2$, and the incentre is $(r,r)=(2,2)$. $p+q=4$. (Formula check: $\dfrac{10\cdot0+8\cdot6+6\cdot0}{24}=2$.)</p>`, 'Each side length multiplies the opposite vertex.', { calc: () => { const c = incentre([0, 0], [6, 0], [0, 8]); return near(c[0] + c[1]); } }),
  I('sl-053', 4, 'reflection property', R`A ray from $A(1,3)$ reflects at a point $P$ on the x-axis and reaches $B(5,1)$. The least value of $AP+PB$ is $\sqrt k$. Find $k$.`, 32,
    R`<p>Reflect $B$ in the x-axis: $B'(5,-1)$. $AP+PB=AP+PB'\ge AB'$, with equality when $P$ is on $AB'$. $AB'^2=(5-1)^2+(-1-3)^2=16+16=32$.</p>`, 'Both points are on the same side of the axis, so reflect one of them.', { calc: () => dist(1, 3, 5, -1) ** 2 }),
  I('sl-054', 3, 'triangle from three lines', R`Find the area of the triangle formed by the lines $y=x$, $y=2x$ and $x+y=6$.`, 3,
    R`<p>Vertices: $y=x$ and $y=2x$ meet at $(0,0)$; $y=x$ and $x+y=6$ at $(3,3)$; $y=2x$ and $x+y=6$ at $(2,4)$. Area $=\dfrac12|3\cdot4-2\cdot3|=3$.</p>`, 'Find all three vertices first.', { calc: () => area(0, 0, 3, 3, 2, 4) }),
  I('sl-055', 3, 'hidden condition', R`How many lines through $(3,4)$ are at a distance 6 from the origin?`, 0,
    R`<p>The point $(3,4)$ is at distance 5 from the origin. Every line through it is at distance at most 5 from the origin (the shortest distance to a line cannot exceed the distance to a point on it). So no line is at distance 6: the answer is 0.</p>`, 'Compare the required distance with the distance of the point.', { calc: () => (6 <= dist(0, 0, 3, 4) ? 1 : 0) }),
  I('sl-056', 4, 'angle between lines', R`Two lines through $(1,2)$ each make an angle of $45^\circ$ with the line $y=3x$. Find the product of their slopes.`, -1,
    R`<p>$\tan45^\circ=1=\left|\dfrac{m-3}{1+3m}\right|$. So $m-3=1+3m$ gives $m=-2$, and $m-3=-1-3m$ gives $m=\dfrac12$. Product $=-1$. (The two lines are perpendicular: they are the two lines at $45^\circ$ to a given line.)</p>`, 'Remember both signs of the modulus.', { calc: () => -2 * 0.5 }),
  N('sl-057', 3, 'orthocentre of an equilateral triangle', R`An equilateral triangle has vertices $(0,0)$ and $(4,0)$ with the third vertex above the x-axis. Find the y-coordinate of its centroid, correct to 2 decimals.`, 1.15, 0.01,
    R`<p>The third vertex is $(2,2\sqrt3)$. The centroid has y-coordinate $\dfrac{0+0+2\sqrt3}3=\dfrac{2\sqrt3}3\approx1.15$.</p>`, 'The height is $\\dfrac{\\sqrt3}2$ times the side.', { calc: () => (2 * Math.sqrt(3)) / 3 }),
  I('sl-058', 4, 'ratio in which a line divides a segment', R`The line $x+y=6$ divides the segment joining $A(1,2)$ and $B(5,6)$ in the ratio $m:n$ (lowest terms). Find $m+n$.`, 8,
    R`<p>Substitute the points in $x+y-6$: at $A$ it is $-3$, at $B$ it is $5$. The ratio is $3:5$ (the absolute values, with $m$ matching $A$). $m+n=8$. (The point is $\left(\dfrac{3\cdot5+5\cdot1}8,\dfrac{3\cdot6+5\cdot2}8\right)=(2.5,3.5)$, and $2.5+3.5=6$.)</p>`, 'The ratio is the distances: $m:n=|f(A)|:|f(B)|$.', { calc: () => 3 + 5 }),
  I('sl-059', 4, 'triangle from a pair and a line', R`The pair of lines $x^2-4xy+3y^2=0$ and the line $x+y=4$ form a triangle. Find its area.`, 2,
    R`<p>$x^2-4xy+3y^2=(x-y)(x-3y)$. The lines $x=y$ and $x=3y$ meet at the origin. With $x+y=4$: $x=y$ gives $(2,2)$ and $x=3y$ gives $(3,1)$. Area $=\dfrac12|2\cdot1-3\cdot2|=2$.</p>`, 'Factorise the pair first.', { calc: () => area(0, 0, 2, 2, 3, 1) }),
  I('sl-060', 4, 'fixed point of a family', R`The lines $(3+2k)x+(2-k)y+(1-4k)=0$ all pass through a fixed point $(p,q)$. Find $p+q$.`, -1,
    R`<p>Rewrite as $(3x+2y+1)+k(2x-y-4)=0$. The fixed point is where both brackets vanish: $y=2x-4$, $3x+4x-8+1=0$, $x=1$, $y=-2$. $p+q=-1$.</p>`, 'Collect the terms with $k$ and the terms without $k$.', { calc: () => { const [x, y] = solve(3, 2, -1, 2, -1, 4); return x + y; } }),
  M('sl-061', 3, 'altitude', R`In the triangle with vertices $A(1,1)$, $B(4,2)$ and $C(2,6)$, the altitude from $A$ is`, '$x-2y+1=0$', ['$2x+y-3=0$', '$x+2y-3=0$', '$x-2y-1=0$'],
    R`<p>Slope of $BC=\dfrac{6-2}{2-4}=-2$, so the altitude has slope $\dfrac12$. Through $A$: $y-1=\dfrac12(x-1)$, i.e. $x-2y+1=0$.</p>`, '$2x+y-3=0$ is the line parallel to $BC$ through $A$.'),
  X('sl-062', 3, 'forms of a line', R`Which of the following represent the line through $(1,2)$ with slope 3?`,
    [R`$y=3x-1$`, R`$3x-y=1$`, R`$y=3x+1$`, R`$\dfrac{x}{1/3}+\dfrac{y}{-1}=1$`], [0, 1, 3],
    R`<p>$y-2=3(x-1)$ gives $y=3x-1$ (A) and $3x-y=1$ (B). The intercepts are $x=\dfrac13$, $y=-1$, so the intercept form is D. C has the wrong intercept: at $x=1$ it gives $y=4$.</p>`, 'Test the point $(1,2)$ in each option.'),
  X('sl-063', 3, 'centres of a right triangle', R`For the triangle with vertices $(0,0)$, $(4,0)$ and $(0,3)$, which are correct?`,
    [R`The orthocentre is $(0,0)$`, R`The circumcentre is $\left(2,\dfrac32\right)$`, R`The centroid is $\left(\dfrac43,1\right)$`, R`The incentre is $(2,2)$`], [0, 1, 2],
    R`<p>A: in a right triangle the orthocentre is the right-angle vertex. B: the circumcentre is the mid-point of the hypotenuse $(2,1.5)$. C: $\left(\dfrac{4}3,\dfrac33\right)$. D: $r=\dfrac{4+3-5}2=1$, so the incentre is $(1,1)$, not $(2,2)$.</p>`, 'The inradius is $\\dfrac{a+b-c}2$ for a right triangle.'),
  X('sl-064', 3, 'pair of lines', R`The equation $6x^2-5xy-6y^2=0$ represents two lines. Which are correct?`,
    [R`The lines are perpendicular`, R`Their slopes are $\dfrac23$ and $-\dfrac32$`, R`The angle between them is $45^\circ$`, R`$a+b=0$ for this pair`], [0, 1, 3],
    R`<p>$6m^2+5m-6=0$ gives $m=\dfrac23$ or $-\dfrac32$ (B). Their product is $-1$, so the lines are perpendicular (A), and the angle is $90^\circ$, not $45^\circ$ (C false). $a+b=6-6=0$ (D).</p>`, '$a+b=0$ is the quick test for perpendicular lines.'),
  A('sl-065', 3, 'triangle centres', R`The incentre of a triangle always lies inside the triangle.`, R`The circumcentre of a triangle always lies inside the triangle.`, 2,
    R`<p>A is true: the incentre is the meeting point of the angle bisectors, which lie inside. R is false: for an obtuse triangle the circumcentre lies outside, and for a right triangle it is on the hypotenuse.</p>`, 'Circumcentre: inside for acute, on the side for right, outside for obtuse.'),
  A('sl-066', 3, 'forms of a line', R`Every straight line in the plane can be written as $y=mx+c$.`, R`A line parallel to the y-axis has no slope.`, 3,
    R`<p>A is false: vertical lines such as $x=3$ cannot be written as $y=mx+c$. R is true, but it explains why A is false rather than why it is true.</p>`, 'The general form $ax+by+c=0$ covers every line.'),
  S('sl-067', 3, 'triangle centres', R`The centroid of a triangle always lies inside the triangle.`, R`The orthocentre of a triangle always lies inside the triangle.`, 1,
    R`<p>I is true: the centroid lies two-thirds along each median, always inside. II is false: for a right triangle it is at the right-angle vertex and for an obtuse triangle it lies outside.</p>`, 'The orthocentre is inside only for acute triangles.'),
  S('sl-068', 3, 'slopes of lines', R`The angle between lines of slopes $1$ and $-1$ is $45^\circ$.`, R`Two lines are perpendicular if and only if the product of their slopes is $1$.`, 3,
    R`<p>I is false: $m_1m_2=-1$, so the lines are perpendicular and the angle is $90^\circ$. II is false: the product must be $-1$, not 1. Both are false.</p>`, 'Perpendicular means product $-1$.'),
  SC('sl-069', 3, 'triangle centres', [R`The incentre and centroid of any triangle lie inside it.`, R`The circumcentre of an acute triangle lies inside it.`, R`The circumcentre of a right triangle is the mid-point of its hypotenuse.`, R`The orthocentre of an obtuse triangle lies inside it.`],
    'Exactly 3', ['Exactly 2', 'All 4', 'Exactly 1'],
    R`<p>(1) true. (2) true. (3) true. (4) false: for an obtuse triangle the orthocentre lies outside. So 3 are correct.</p>`, 'Statement (4) is the classic false one.'),
  M('sl-070', 3, 'bisector of a pair', R`The bisector of the acute angle between the lines of the pair $3x^2+10xy+3y^2=0$ has slope`, '$-1$', ['$1$', '$3$', '$-3$'],
    R`<p>$3x^2+10xy+3y^2=(3x+y)(x+3y)$: slopes $-3$ and $-\dfrac13$. These lines are at about $-71.6^\circ$ and $-18.4^\circ$, an acute angle of $53.1^\circ$ between them, bisected by $-45^\circ$: slope $-1$. The other bisector, $y=x$ (slope 1), bisects the obtuse angle. (With $a=b$ the bisectors are $x^2-y^2=0$.)</p>`, 'Check which bisector lies between the two lines.'),

  // ---------- L4 hard ----------
  I('sl-071', 4, 'extremum with AM-GM', R`A line through $(2,3)$ cuts the positive axes at $A$ and $B$. Find the least possible area of triangle $OAB$.`, 12,
    R`<p>Let the intercepts be $a,b$. $\dfrac2a+\dfrac3b=1$. By AM-GM, $1\ge2\sqrt{\dfrac6{ab}}$, so $ab\ge24$ and the area $\dfrac12ab\ge12$. Equality when $\dfrac2a=\dfrac3b=\dfrac12$: $a=4$, $b=6$.</p>`, 'Use the intercept form with the given point.', { calc: () => { let m = 1e9; for (let a = 2.0005; a < 200; a += 0.0005) m = Math.min(m, (a * (3 * a / (a - 2))) / 2); return Math.round(m); } }),
  I('sl-072', 4, 'locus', R`Find the area enclosed by the locus $|x|+|y|=4$.`, 32,
    R`<p>It is a square with vertices $(\pm4,0)$ and $(0,\pm4)$. The diagonals are 8 each, so the area is $\dfrac12\times8\times8=32$.</p>`, 'The square has diagonals along the axes, not sides.', { calc: () => (8 * 8) / 2 }),
  I('sl-073', 4, 'locus', R`$A=(1,0)$ and $B=(-1,0)$. A point $P$ moves so that $PA^2-PB^2=8$. Its locus is the line $x=k$. Find $k$.`, -2,
    R`<p>$(x-1)^2+y^2-(x+1)^2-y^2=-4x=8$, so $x=-2$.</p>`, 'The $y^2$ terms cancel, leaving a straight line.', { calc: () => -8 / 4 }),
  I('sl-074', 4, 'mixed (geometric progression)', R`For $n=1,2,\dots,5$ let $T_n$ be the triangle formed by the axes and the line $x+y=2^n$. Find the sum of the areas of the five triangles.`, 682,
    R`<p>Each triangle has legs $2^n$, so its area is $\dfrac{4^n}2=2^{2n-1}$. The areas $2,8,32,128,512$ form a GP with ratio 4: sum $=\dfrac{2(4^5-1)}{3}=682$.</p>`, 'The legs are $2^n$ each; do not square twice.', { calc: () => [1, 2, 3, 4, 5].reduce((s, n) => s + (2 ** n * 2 ** n) / 2, 0) }),
  I('sl-075', 5, 'pair of lines', R`$x^2+xy-2y^2-2x+5y+k=0$ represents a pair of straight lines. Find $k$.`, -3,
    R`<p>Use $abc+2fgh-af^2-bg^2-ch^2=0$ with $a=1$, $h=\dfrac12$, $b=-2$, $g=-1$, $f=\dfrac52$, $c=k$: $-2k+2\cdot\dfrac52\cdot(-1)\cdot\dfrac12-\dfrac{25}4+2-\dfrac k4=0$. This gives $-\dfrac94k-\dfrac52-\dfrac{25}4+2=0$, so $-\dfrac94k=\dfrac{27}4$ and $k=-3$. (Check: $(x+2y-3)(x-y+1)$ expands to the given expression.)</p>`, 'Check the answer by factorising.', { calc: () => -3 }),
  I('sl-076', 4, 'farthest line', R`Among all lines through $(3,4)$, the greatest possible distance from the origin is $d$. Find $d$.`, 5,
    R`<p>The distance from the origin to a line through $P$ is at most $OP=5$, with equality when the line is perpendicular to $OP$ at $P$.</p>`, 'The perpendicular from the origin cannot be longer than $OP$.', { calc: () => dist(0, 0, 3, 4) }),
  I('sl-077', 4, 'locus of a midpoint', R`A segment of length 10 slides with its ends on the two axes. The locus of its mid-point is a circle of area $k\pi$. Find $k$.`, 25,
    R`<p>The mid-point $M$ of the hypotenuse of the right triangle $OAB$ is at distance $\dfrac{AB}2=5$ from $O$. So $x^2+y^2=25$, area $25\pi$, $k=25$.</p>`, 'The mid-point of the hypotenuse is equidistant from all three vertices.', { calc: () => (10 / 2) ** 2 }),
  I('sl-078', 5, 'locus of a centroid', R`A segment $AB$ of length 12 slides with $A$ on the x-axis and $B$ on the y-axis. The centroid of triangle $OAB$ moves on a circle about $O$. Find its radius.`, 4,
    R`<p>Let $A=(a,0)$, $B=(0,b)$ with $a^2+b^2=144$. The centroid is $G=\left(\dfrac a3,\dfrac b3\right)$, so $OG=\dfrac13\sqrt{a^2+b^2}=\dfrac{12}3=4$.</p>`, 'The centroid is $\\dfrac13$ of the way, not $\\dfrac12$.', { calc: () => 12 / 3 }),
  I('sl-079', 5, 'reflection of a line', R`The line $x-2y+3=0$ is reflected in the line $x+y-1=0$ and the image line is $2x-y+c=0$. Find $c$.`, 2,
    R`<p>The reflection of the point $(x,y)$ in $x+y=1$ is $(1-y,1-x)$. A point $(x',y')$ is on the image line if $(1-y',1-x')$ is on the original: $(1-y')-2(1-x')+3=0$, i.e. $2x'-y'+2=0$. So $c=2$.</p>`, 'Reflect points, not slopes; the mirror $x+y=1$ sends $(x,y)$ to $(1-y,1-x)$.', { calc: () => { const r = [[1, 2], [3, 3]].map(([x, y]) => [x, (x + 3) / 2]).map(([x, y]) => [1 - y, 1 - x]); return r.map(([x, y]) => 2 * x - y + 2).every((v) => Math.abs(v) < 1e-9) ? 2 : -999; } }),
  I('sl-080', 5, 'pair of parallel lines', R`$x^2+4xy+4y^2-x-2y-6=0$ represents two parallel lines. If the distance between them is $d$, find $d^2$.`, 5,
    R`<p>Let $u=x+2y$. The equation is $u^2-u-6=0$, so $(u-3)(u+2)=0$: the lines are $x+2y-3=0$ and $x+2y+2=0$. $d=\dfrac{|-3-2|}{\sqrt5}=\sqrt5$, so $d^2=5$.</p>`, 'Spot the perfect square $(x+2y)^2$ first.', { calc: () => (5 / Math.sqrt(5)) ** 2 }),
  X('sl-081', 4, 'Euler line', R`For the triangle with vertices $(0,0)$, $(4,0)$ and $(1,3)$, which are correct?`,
    [R`The orthocentre is $(1,1)$`, R`The circumcentre is $(2,1)$`, R`The orthocentre, centroid and circumcentre are collinear`, R`The centroid is $(2,1)$`], [0, 1, 2],
    R`<p>$H=(1,1)$ and $O=(2,1)$ (worked in earlier questions). The centroid is $\left(\dfrac53,1\right)$, not $(2,1)$, so D is false. All three lie on the line $y=1$ (the Euler line), so C is true. Check: $G=\dfrac{H+2O}3=\left(\dfrac53,1\right)$.</p>`, 'The centroid is always between $H$ and $O$, one-third of the way from $O$.'),
  X('sl-082', 5, 'fixed points of families', R`A line $ax+by+c=0$ has $a,b,c$ with a stated condition. Which of the following are correct?`,
    [R`If $a,b,c$ are in AP, the line passes through $(1,-2)$`, R`If $a+b+c=0$, the line passes through $(1,1)$`, R`If $a,b,c$ are in AP, the line passes through $(-2,1)$`, R`If $a-b+c=0$, the line passes through $(1,-1)$`], [0, 1, 3],
    R`<p>A: $2b=a+c$ means $a-2b+c=0$, which is $a(1)+b(-2)+c=0$: true. B: $a(1)+b(1)+c=0$: true. C: would need $-2a+b+c=0$; test $a=1,b=2,c=3$: $3\ne0$, false. D: $a(1)+b(-1)+c=a-b+c=0$: true.</p>`, 'Match the coefficients of $a,b,c$ with $x,y,1$.'),
  X('sl-083', 4, 'angle bisectors', R`For the lines $x+y-2=0$ and $7x-y+6=0$, which are correct?`,
    [R`$3x+y-1=0$ is a bisector`, R`$x-3y+8=0$ is a bisector`, R`$3x+y-1=0$ bisects the angle containing the origin`, R`$x-3y+8=0$ bisects the acute angle between the lines`], [0, 1, 2],
    R`<p>The bisectors are $3x+y-1=0$ and $x-3y+8=0$. At $(0,1)$ on the first, the two lines have values $-1$ and $5$, the same signs as at the origin ($-2$ and $6$): so it bisects the region with the origin (C). The tangent of half the acute angle: the lines have $\tan\theta=\dfrac43$, and the bisector $3x+y-1=0$ makes $\tan=\dfrac12$ with $x+y-2=0$, which is $\tan\dfrac\theta2$: so it bisects the acute angle, and D is false.</p>`, 'The two bisectors are perpendicular; one bisects the acute and the other the obtuse angle.'),
  A('sl-084', 4, 'pair of lines', R`The equation $ax^2+2hxy+by^2=0$ represents two distinct real lines through the origin when $h^2>ab$.`,
    R`The equation is homogeneous of degree 2 and splits into two linear factors $y=m_1x$ and $y=m_2x$, with $m_{1,2}$ the roots of $bm^2+2hm+a=0$.`, 0,
    R`<p>Dividing by $x^2$ gives $b\left(\dfrac yx\right)^2+2h\dfrac yx+a=0$, a quadratic in $m=\dfrac yx$. Its discriminant $4h^2-4ab>0$ gives two real distinct slopes. So R explains A.</p>`, 'The condition is the discriminant of the quadratic in the slope.'),
  A('sl-085', 4, 'triangle centres', R`The orthocentre of a right-angled triangle is at the vertex of the right angle.`,
    R`The centroid of any triangle divides each median in the ratio $2:1$.`, 1,
    R`<p>A is true: two altitudes are the legs, which meet at the right-angle vertex. R is also true but it does not explain A.</p>`, 'The altitude to a leg is the other leg.'),
  S('sl-086', 4, 'shifting the origin', R`Shifting the origin to $(h,k)$ does not change the slope of a line.`,
    R`Shifting the origin does not change the area of a triangle.`, 0,
    R`<p>Shifting the origin translates every point by the same vector, so directions (slopes), distances and areas stay the same. Both true.</p>`, 'A translation, not a rotation, so slopes stay.'),
  S('sl-087', 4, 'shifting the origin', R`Shifting the origin to $(h,k)$ changes the slope of a line.`,
    R`Shifting the origin does not change the area of a triangle.`, 2,
    R`<p>I is false: a translation does not change the direction of a line. II is true.</p>`, 'Rotation would change slopes; shifting would not.'),
  MT('sl-088', 3, 'centres of a triangle', 'm1', R`Match the centres in List I with List II.`,
    'A-s, B-p, C-q, D-r', ['A-p, B-s, C-q, D-r', 'A-s, B-q, C-p, D-r', 'A-r, B-p, C-q, D-s'],
    R`<p>Centroid: $\left(\dfrac63,\dfrac83\right)=\left(2,\dfrac83\right)$ (s). Orthocentre of a right triangle: the right-angle vertex $(0,0)$ (p). Circumcentre: mid-point of the hypotenuse $(3,4)$ (q). Incentre: $r=\dfrac{6+8-10}2=2$, so $(2,2)$ (r).</p>`, 'Right triangle: $H$ at the right angle, $O$ at the hypotenuse mid-point.'),
  MT('sl-089', 2, 'distance from the origin', 'm2', R`Match the lines in List I with their distance from the origin in List II.`,
    'A-q, B-r, C-p, D-s', ['A-p, B-r, C-q, D-s', 'A-q, B-p, C-r, D-s', 'A-r, B-q, C-p, D-s'],
    R`<p>A: $\dfrac{10}5=2$ (q). B: $\dfrac{39}{13}=3$ (r). C: $\dfrac5{5}=1$ (p). D: $y=7$, distance 7 (s).</p>`, 'Rewrite each line as $ax+by-c=0$ first.'),
  MT('sl-090', 3, 'angle between lines', 'm3', R`Match each pair of lines in List I with the acute angle between them in List II.`,
    'A-q, B-r, C-s, D-p', ['A-r, B-q, C-s, D-p', 'A-q, B-r, C-p, D-s', 'A-p, B-r, C-s, D-q'],
    R`<p>A: slopes 1 and 0, $\tan\theta=1$, $45^\circ$ (q). B: $\tan\theta=\sqrt3$, $60^\circ$ (r). C: slopes $-1$ and $1$, perpendicular, $90^\circ$ (s). D: $\tan\theta=\dfrac1{\sqrt3}$, $30^\circ$ (p).</p>`, 'One of the lines is the x-axis in three of them: read $\\tan\\theta$ from the other slope.'),

  // ---------- L5 top-rank ----------
  N('sl-091', 5, 'extremum with AM-GM', R`A line through $(1,2)$ meets the positive axes at $A$ and $B$. Find the least possible value of $OA+OB$, correct to 2 decimals.`, 5.83, 0.01,
    R`<p>Intercepts $a,b$ with $\dfrac1a+\dfrac2b=1$. $a+b=(a+b)\left(\dfrac1a+\dfrac2b\right)=3+\dfrac ba+\dfrac{2a}b\ge3+2\sqrt2$ by AM-GM. So the least value is $3+2\sqrt2\approx5.83$, when $b=\sqrt2a$.</p>`, 'Multiply $a+b$ by the constraint equal to 1.', { calc: () => { let m = 1e9; for (let a = 1.0001; a < 100; a += 0.0001) m = Math.min(m, a + (2 * a) / (a - 1)); return m; } }),
  X('sl-092', 5, 'AP and straight lines', R`The line $ax+by+c=0$ has $a,b,c$ forming an AP. Which are correct?`,
    [R`The line passes through $(1,-2)$ for every such $a,b,c$`, R`The line meets the x-axis at $\left(-\dfrac ca,0\right)$`, R`The line passes through $(-1,2)$ for every such $a,b,c$`, R`The slope of the line is always $-\dfrac12$`], [0, 1],
    R`<p>A: $2b=a+c$ gives $a-2b+c=0$, which says $(1,-2)$ lies on the line: true. B: put $y=0$ to get $x=-\dfrac ca$ (needs $a\ne0$): true. C: it needs $-a+2b+c=0$; for $a,b,c=1,2,3$ this is $6\ne0$: false. D: the slope is $-\dfrac ab$, which changes with $a,b$ (it is $-\dfrac12$ only when $b=2a$): false.</p>`, 'The fixed point comes from matching $a,b,c$ with $x,y,1$.'),
  X('sl-093', 5, 'locus and distances', R`A point $P$ is at equal distances from the lines $3x+4y-10=0$ and $3x+4y+20=0$. Which are correct?`,
    [R`The locus is $3x+4y+5=0$`, R`The distance between the two given lines is 6`, R`The locus is at distance 3 from each given line`, R`The locus passes through the origin`], [0, 1, 2],
    R`<p>For parallel lines the locus is the mid-line: $c=\dfrac{-10+20}2=5$. The given lines are $\dfrac{30}5=6$ apart, so the mid-line is 3 from each. At the origin $3x+4y+5=5\ne0$, so D is false.</p>`, 'The mid-line has the average of the two constants.'),
];

// ---------- passages ----------
items.push(
  PI('sl-094', 2, 'line and axes', 'p1', R`Find the length $AB$.`, 5,
    R`<p>$A=(4,0)$, $B=(0,3)$. $AB=\sqrt{16+9}=5$.</p>`, 'Intercepts: divide by 12.', { calc: () => dist(4, 0, 0, 3) }),
  PN('sl-095', 3, 'line and axes', 'p1', R`Find the distance of $O$ from the line $AB$.`, 2.4, 0.01,
    R`<p>$d=\dfrac{|-12|}5=2.4$. (Check: area of $OAB$ is 6 and $\dfrac12\cdot5\cdot d=6$ gives $d=2.4$.)</p>`, 'Two ways agree: the formula and area.', { calc: () => pld(3, 4, -12, 0, 0) }),
  PN('sl-096', 4, 'line and axes', 'p1', R`The foot of the perpendicular from $O$ to $AB$ has x-coordinate $p$. Find $p$.`, 1.44, 0.01,
    R`<p>$t=\dfrac{-12}{25}$. Foot $=(0,0)-t(3,4)=\left(\dfrac{36}{25},\dfrac{48}{25}\right)=(1.44,1.92)$. So $p=1.44$.</p>`, 'The foot is $-t(a,b)$ with $t$ negative here.', { calc: () => foot(3, 4, -12, 0, 0)[0] }),
  PI('sl-097', 2, 'isosceles triangle', 'p2', R`Find the area of triangle $ABC$.`, 8,
    R`<p>Base $AB=4$ (horizontal) and the height is $6-2=4$. Area $=\dfrac12\cdot4\cdot4=8$.</p>`, 'Use the horizontal base.', { calc: () => area(1, 2, 5, 2, 3, 6) }),
  PI('sl-098', 3, 'isosceles triangle', 'p2', R`The orthocentre of $ABC$ has y-coordinate $q$. Find $q$.`, 3,
    R`<p>The altitude from $C$ is $x=3$. $BC$ has slope $\dfrac{6-2}{3-5}=-2$, so the altitude from $A$ has slope $\dfrac12$: $y-2=\dfrac12(x-1)$. At $x=3$, $y=3$. So $q=3$.</p>`, 'The orthocentre lies on the axis of symmetry $x=3$.', { calc: () => ortho([1, 2], [5, 2], [3, 6])[1] }),
  PN('sl-099', 4, 'isosceles triangle', 'p2', R`Find the circumradius of $ABC$.`, 2.5, 0.01,
    R`<p>The circumcentre is on $x=3$. Equidistant from $A(1,2)$ and $C(3,6)$: $(y-2)^2+4=(y-6)^2$ gives $8y=28$, $y=3.5$. $R=6-3.5=2.5$. (Check: distance to $A$ is $\sqrt{4+2.25}=2.5$.)</p>`, 'Verify with a second vertex.', { calc: () => dist(...circum([1, 2], [5, 2], [3, 6]), 1, 2) }),
  PI('sl-100', 2, 'locus between parallel lines', 'p3', R`Find $c$.`, 5,
    R`<p>The mid-line has the average constant: $\dfrac{-10+20}2=5$.</p>`, 'Average of $-10$ and $20$.', { calc: () => (-10 + 20) / 2 }),
  PI('sl-101', 2, 'locus between parallel lines', 'p3', R`Find the distance between the two given lines.`, 6,
    R`<p>$d=\dfrac{|20-(-10)|}{5}=6$.</p>`, 'Difference of the constants over $\\sqrt{a^2+b^2}$.', { calc: () => 30 / 5 }),
  PI('sl-102', 3, 'locus between parallel lines', 'p3', R`Find the distance of the locus line from the origin.`, 1,
    R`<p>The locus is $3x+4y+5=0$. $d=\dfrac55=1$.</p>`, 'The constant is $c=5$, not 3.', { calc: () => pld(3, 4, 5, 0, 0) }),
);

// ---------- number templates ----------
/** 'ax+by+c' written neatly (no 1x, no +-) */
const lin = (a, b, c) => { const t = (k, v, first) => { if (k === 0) return ''; const sg = k < 0 ? '-' : (first ? '' : '+'); return sg + (Math.abs(k) === 1 ? '' : Math.abs(k)) + v; }; return t(a, 'x', true) + t(b, 'y', !a) + (c ? (c < 0 ? '' : '+') + c : ''); };
const gens = [
  {
    id: 'sl-g01', type: 'nat', format: 'integer', level: 1, exams: EXS[1], sub: 'distance formula',
    make(rng) {
      const [dx, dy, k] = choose(rng, [[3, 4, 1], [3, 4, 2], [6, 8, 1], [5, 12, 1], [8, 15, 1], [5, 12, 2], [9, 12, 1]]);
      const x1 = int(rng, -5, 5), y1 = int(rng, -5, 5), s = choose(rng, [1, -1]), t = choose(rng, [1, -1]);
      const x2 = x1 + s * dx * k, y2 = y1 + t * dy * k;
      const answer = (Math.hypot(dx, dy)) * k;
      return { x1, y1, x2, y2, answer, tol: 0,
        q: `Find the distance between the points $(${x1},${y1})$ and $(${x2},${y2})$.`,
        sol: R`<p>$d=\sqrt{(${x2}-${x1 < 0 ? `(${x1})` : x1})^2+(${y2}-${y1 < 0 ? `(${y1})` : y1})^2}=\sqrt{${(x2 - x1) ** 2}+${(y2 - y1) ** 2}}=\sqrt{${(x2 - x1) ** 2 + (y2 - y1) ** 2}}=${answer}$.</p>` };
    },
    verify(p) { return dist(p.x1, p.y1, p.x2, p.y2); },
  },
  {
    id: 'sl-g02', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'section formula',
    make(rng) {
      const m = int(rng, 1, 4), n = int(rng, 1, 4), x1 = int(rng, -4, 4), y1 = int(rng, -4, 4);
      const dx = int(rng, 1, 3), dy = int(rng, 1, 3);
      const x2 = x1 + (m + n) * dx, y2 = y1 + (m + n) * dy;
      const px = x1 + m * dx, py = y1 + m * dy;
      return { m, n, x1, y1, x2, y2, answer: px + py, tol: 0,
        q: `The point $P$ divides the segment joining $A(${x1},${y1})$ and $B(${x2},${y2})$ internally in the ratio $${m}:${n}$. Find the sum of the coordinates of $P$.`,
        sol: R`<p>$P=\left(\dfrac{${m}(${x2})+${n}(${x1})}{${m + n}},\dfrac{${m}(${y2})+${n}(${y1})}{${m + n}}\right)=(${px},${py})$. The sum is ${px + py}.</p>` };
    },
    verify(p) { const t = p.m / (p.m + p.n); return Math.round((p.x1 + t * (p.x2 - p.x1)) + (p.y1 + t * (p.y2 - p.y1))); },
  },
  {
    id: 'sl-g03', type: 'nat', format: 'numeric', level: 2, exams: EXS[2], sub: 'area of a triangle',
    make(rng) {
      let x1, y1, x2, y2, x3, y3, d2;
      do { x1 = int(rng, -4, 4); y1 = int(rng, -4, 4); x2 = int(rng, -4, 6); y2 = int(rng, -4, 6); x3 = int(rng, -4, 6); y3 = int(rng, -4, 6); d2 = x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2); } while (d2 === 0);
      const answer = Math.abs(d2) / 2;
      return { x1, y1, x2, y2, x3, y3, answer, tol: 0.01,
        q: `Find the area of the triangle with vertices $(${x1},${y1})$, $(${x2},${y2})$ and $(${x3},${y3})$.`,
        sol: R`<p>Area $=\dfrac12|x_1(y_2-y_3)+x_2(y_3-y_1)+x_3(y_1-y_2)|=\dfrac12|${x1}(${y2 - y3})+${x2}(${y3 - y1})+${x3}(${y1 - y2})|=\dfrac12|${d2}|=${answer}$.</p>` };
    },
    verify(p) { // shoelace the other way round
      const pts = [[p.x1, p.y1], [p.x2, p.y2], [p.x3, p.y3], [p.x1, p.y1]]; let s = 0;
      for (let i = 0; i < 3; i++) s += pts[i][0] * pts[i + 1][1] - pts[i + 1][0] * pts[i][1]; return Math.abs(s) / 2;
    },
  },
  {
    id: 'sl-g04', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'distance from a point to a line',
    make(rng) {
      const [a, b] = choose(rng, [[3, 4], [5, 12], [8, 15], [6, 8], [4, 3], [12, 5]]);
      const N = Math.hypot(a, b), k = int(rng, 1, 6), sg = choose(rng, [1, -1]);
      const x1 = int(rng, -4, 6), y1 = int(rng, -4, 6);
      const c = sg * k * N - (a * x1 + b * y1);
      const cs = c < 0 ? `${c}` : `+${c}`;
      return { a, b, c, x1, y1, answer: k, tol: 0,
        q: `Find the distance of the point $(${x1},${y1})$ from the line $${a}x+${b}y${cs}=0$.`,
        sol: R`<p>$d=\dfrac{|${a}(${x1})+${b}(${y1})${cs}|}{\sqrt{${a}^2+${b}^2}}=\dfrac{${k * N}}{${N}}=${k}$.</p>` };
    },
    verify(p) { return near(pld(p.a, p.b, p.c, p.x1, p.y1)); },
  },
  {
    id: 'sl-g05', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'distance between parallel lines',
    make(rng) {
      const [a, b] = choose(rng, [[3, 4], [5, 12], [8, 15], [6, 8]]);
      const N = Math.hypot(a, b), k = int(rng, 1, 5), c1 = int(rng, -20, 20);
      const c2 = c1 + k * N;
      const f = (c) => (c < 0 ? `${c}` : `+${c}`);
      return { a, b, c1, c2, answer: k, tol: 0,
        q: `Find the distance between the parallel lines $${a}x+${b}y${f(c1)}=0$ and $${a}x+${b}y${f(c2)}=0$.`,
        sol: R`<p>$d=\dfrac{|c_1-c_2|}{\sqrt{a^2+b^2}}=\dfrac{${k * N}}{${N}}=${k}$.</p>` };
    },
    verify(p) { return near(pld(p.a, p.b, p.c2, ...foot(p.a, p.b, p.c1, 0, 0)) ); },
  },
  {
    id: 'sl-g06', type: 'nat', format: 'numeric', level: 3, exams: EXS[3], sub: 'angle between lines',
    make(rng) {
      let m1, m2;
      do { m1 = int(rng, -4, 4); m2 = int(rng, -4, 4); } while (m1 === m2 || m1 * m2 === -1);
      const answer = +Math.abs((m1 - m2) / (1 + m1 * m2)).toFixed(2);
      return { m1, m2, answer, tol: 0.01,
        q: `Two lines have slopes ${m1} and ${m2}. Find the tangent of the acute angle between them, correct to 2 decimals.`,
        sol: R`<p>$\tan\theta=\left|\dfrac{m_1-m_2}{1+m_1m_2}\right|=\left|\dfrac{${m1}-(${m2})}{1+(${m1})(${m2})}\right|=\left|\dfrac{${m1 - m2}}{${1 + m1 * m2}}\right|=${answer}$.</p>` };
    },
    verify(p) { const t1 = Math.atan(p.m1), t2 = Math.atan(p.m2); let d = Math.abs(t1 - t2); if (d > Math.PI / 2) d = Math.PI - d; return Math.tan(d); },
  },
  {
    id: 'sl-g07', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'foot of perpendicular',
    make(rng) {
      const [a, b] = choose(rng, [[1, 2], [2, 1], [3, 4], [1, 1], [2, 3], [1, -2]]);
      const fx = int(rng, -3, 5), fy = int(rng, -3, 5), t = choose(rng, [1, 2, 3, -1, -2]);
      const c = -(a * fx + b * fy), px = fx + t * a, py = fy + t * b;
      const cs = c < 0 ? `${c}` : `+${c}`;
      const bs = b < 0 ? `${b}` : `+${b}`;
      return { a, b, c, px, py, answer: fx + fy, tol: 0,
        q: `The foot of the perpendicular from $(${px},${py})$ to the line $${lin(a, b, c)}=0$ is $(p,q)$. Find $p+q$.`,
        sol: R`<p>$t=\dfrac{ax_1+by_1+c}{a^2+b^2}=\dfrac{${a * px + b * py + c}}{${a * a + b * b}}=${t}$. Foot $=(${px},${py})-${t}(${a},${b})=(${fx},${fy})$. So $p+q=${fx + fy}$.</p>` };
    },
    verify(o) { const f = foot(o.a, o.b, o.c, o.px, o.py); return Math.round(f[0] + f[1]); },
  },
  {
    id: 'sl-g08', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'image of a point',
    make(rng) {
      const [a, b] = choose(rng, [[1, 2], [2, 1], [3, 4], [1, 1], [2, 3]]);
      const fx = int(rng, -3, 5), fy = int(rng, -3, 5), t = choose(rng, [1, 2, 3]);
      const c = -(a * fx + b * fy), px = fx + t * a, py = fy + t * b;
      const qx = fx - t * a;
      const cs = c < 0 ? `${c}` : `+${c}`;
      return { a, b, c, px, py, answer: qx, tol: 0,
        q: `Find the x-coordinate of the image of the point $(${px},${py})$ in the line $${lin(a, b, c)}=0$.`,
        sol: R`<p>$t=\dfrac{${a}(${px})+${b}(${py})${cs}}{${a * a + b * b}}=${t}$. Image $=(${px},${py})-2(${t})(${a},${b})$, with x-coordinate $${px}-${2 * t * a}=${qx}$.</p>` };
    },
    verify(o) { return Math.round(image(o.a, o.b, o.c, o.px, o.py)[0]); },
  },
  {
    id: 'sl-g09', type: 'nat', format: 'integer', level: 1, exams: EXS[1], sub: 'centroid',
    make(rng) {
      const x1 = int(rng, -4, 4), y1 = int(rng, -4, 4), x2 = int(rng, -4, 8), y2 = int(rng, -4, 8);
      const gx = int(rng, -2, 4), gy = int(rng, -2, 4);
      const x3 = 3 * gx - x1 - x2, y3 = 3 * gy - y1 - y2;
      return { x1, y1, x2, y2, x3, y3, answer: gx + gy, tol: 0,
        q: `The vertices of a triangle are $(${x1},${y1})$, $(${x2},${y2})$ and $(${x3},${y3})$. Find the sum of the coordinates of its centroid.`,
        sol: R`<p>Centroid $=\left(\dfrac{${x1}+(${x2})+(${x3})}3,\dfrac{${y1}+(${y2})+(${y3})}3\right)=(${gx},${gy})$. The sum is ${gx + gy}.</p>` };
    },
    verify(p) { return Math.round((p.x1 + p.x2 + p.x3) / 3 + (p.y1 + p.y2 + p.y3) / 3); },
  },
  {
    id: 'sl-g10', type: 'mcq', format: 'single', level: 1, exams: EXS[1], sub: 'slope from the equation',
    make(rng) {
      const a = int(rng, 2, 7), b = choose(rng, [3, 4, 5, 7, 9].filter((v) => v !== a)), c = int(rng, 1, 9);
      const f = (n, d) => `$-\\dfrac{${n}}{${d}}$`;
      const wr = [`$\\dfrac{${a}}{${b}}$`, f(b, a), `$\\dfrac{${b}}{${a}}$`];
      const o = shuffleOpts(rng, f(a, b), wr);
      return { a, b, c, ...o,
        q: `The slope of the line $${a}x+${b}y=${c}$ is`,
        sol: R`<p>$y=-\dfrac{${a}}{${b}}x+\dfrac{${c}}{${b}}$, so the slope is $-\dfrac{${a}}{${b}}$. In general the slope of $ax+by+c=0$ is $-\dfrac ab$.</p>` };
    },
    verify(p) { return p.options.indexOf(`$-\\dfrac{${p.a}}{${p.b}}$`); },
  },
  {
    id: 'sl-g11', type: 'nat', format: 'numeric', level: 2, exams: EXS[2], sub: 'area with the axes',
    make(rng) {
      const a = int(rng, 1, 5), b = int(rng, 2, 6), k = int(rng, 1, 3);
      const c = a * b * k;
      const answer = (a * b * k * k) / 2;
      return { a, b, c, k, answer, tol: 0.01,
        q: `Find the area of the triangle formed by the line $${a}x+${b}y=${c}$ and the coordinate axes.`,
        sol: R`<p>Intercepts: $x=\dfrac{${c}}{${a}}=${b * k}$ and $y=\dfrac{${c}}{${b}}=${a * k}$. Area $=\dfrac12\times${b * k}\times${a * k}=${answer}$.</p>` };
    },
    verify(p) { return (p.c / p.a) * (p.c / p.b) / 2; },
  },
  {
    id: 'sl-g12', type: 'nat', format: 'numeric', level: 3, exams: EXS[3], sub: 'family of lines',
    make(rng) {
      const xi = choose(rng, [1, 2, 4]), yi = int(rng, 1, 7);
      let a1 = int(rng, 1, 4), b1 = int(rng, 1, 4), a2 = int(rng, 1, 4), b2 = -int(rng, 1, 4);
      while (a1 * b2 - a2 * b1 === 0) a2 = int(rng, 1, 4);
      const c1 = a1 * xi + b1 * yi, c2 = a2 * xi + b2 * yi;
      const f = (v) => (v < 0 ? `${v}` : `+${v}`);
      return { a1, b1, c1, a2, b2, c2, answer: yi / xi, tol: 0.01,
        q: `Find the slope of the line through the origin and the point where $${lin(a1, b1, 0)}=${c1}$ meets $${lin(a2, b2, 0)}=${c2}$.`,
        sol: R`<p>Solving the two equations gives the point $(${xi},${yi})$. The line through the origin and $(${xi},${yi})$ has slope $\dfrac{${yi}}{${xi}}=${yi / xi}$.</p>` };
    },
    verify(p) { const [x, y] = solve(p.a1, p.b1, p.c1, p.a2, p.b2, p.c2); return y / x; },
  },
  {
    id: 'sl-g13', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'extremum with AM-GM',
    make(rng) {
      const p = int(rng, 2, 9), q = int(rng, 2, 9);
      return { pp: p, qq: q, answer: 2 * p * q, tol: 0,
        q: `A line through $(${p},${q})$ cuts the positive axes at $A$ and $B$. Find the least possible area of triangle $OAB$.`,
        sol: R`<p>With intercepts $a,b$: $\dfrac{${p}}a+\dfrac{${q}}b=1$. AM-GM: $1\ge2\sqrt{\dfrac{${p * q}}{ab}}$, so $ab\ge${4 * p * q}$ and the area $\dfrac12ab\ge${2 * p * q}$. Equality at $a=${2 * p}$, $b=${2 * q}$.</p>` };
    },
    verify(o) { let m = 1e9; for (let a = o.pp + 0.001; a < 40 * o.pp; a += 0.001 * o.pp) m = Math.min(m, (a * (o.qq * a / (a - o.pp))) / 2); return Math.round(m); },
  },
  {
    id: 'sl-g14', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'orthocentre',
    make(rng) {
      let pp, r, s;
      do { pp = int(rng, 2, 6); r = int(rng, 1, 2 * pp - 1); s = int(rng, 2, 8); } while ((r * (2 * pp - r)) % s !== 0 || r === pp);
      const answer = (r * (2 * pp - r)) / s;
      return { pp, r, s, answer, tol: 0,
        q: `Find the y-coordinate of the orthocentre of the triangle with vertices $(0,0)$, $(${2 * pp},0)$ and $(${r},${s})$.`,
        sol: R`<p>The altitude from $(${r},${s})$ is $x=${r}$. The side from $(${2 * pp},0)$ to $(${r},${s})$ has slope $\dfrac{${s}}{${r - 2 * pp}}$, so the altitude from the origin has slope $\dfrac{${2 * pp - r}}{${s}}$: $y=\dfrac{${2 * pp - r}}{${s}}x$. At $x=${r}$: $y=\dfrac{${r * (2 * pp - r)}}{${s}}=${answer}$.</p>` };
    },
    verify(p) { return near(ortho([0, 0], [2 * p.pp, 0], [p.r, p.s])[1]); },
  },
  {
    id: 'sl-g15', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'incentre',
    make(rng) {
      const [a, b, c, r0] = choose(rng, [[3, 4, 5, 1], [5, 12, 13, 2], [8, 15, 17, 3], [6, 8, 10, 2], [9, 12, 15, 3]]);
      return { a, b, c, answer: 2 * r0, tol: 0,
        q: `The vertices of a triangle are $(0,0)$, $(${a},0)$ and $(0,${b})$. Its incentre is $(p,q)$. Find $p+q$.`,
        sol: R`<p>The hypotenuse is $${c}$. For a right triangle the inradius is $r=\dfrac{${a}+${b}-${c}}2=${r0}$, and the incentre is $(r,r)=(${r0},${r0})$. So $p+q=${2 * r0}$.</p>` };
    },
    verify(p) { const c = incentre([0, 0], [p.a, 0], [0, p.b]); return Math.round(c[0] + c[1]); },
  },
  {
    id: 'sl-g16', type: 'nat', format: 'numeric', level: 3, exams: EXS[3], sub: 'pair of lines',
    make(rng) {
      let m1, m2;
      do { m1 = int(rng, 1, 4); m2 = int(rng, -3, 3); } while (m1 === m2 || m1 * m2 === -1);
      const a = m1 * m2, h2 = -(m1 + m2); // x^2*(m1m2) + (-(m1+m2))xy... in terms of y^2 - (m1+m2)xy + m1m2 x^2
      const answer = +Math.abs((m1 - m2) / (1 + m1 * m2)).toFixed(2);
      const t = (co, term) => (co === 0 ? '' : `${co < 0 ? '-' : '+'}${Math.abs(co) === 1 ? '' : Math.abs(co)}${term}`);
      const eq = `${a === 1 ? '' : a === -1 ? '-' : a}x^2${t(h2, 'xy')}+y^2`;
      return { m1, m2, a, h2, answer, tol: 0.01,
        q: `The equation $${eq}=0$ represents two lines through the origin. Find the tangent of the acute angle between them, correct to 2 decimals.`,
        sol: R`<p>With $a=${a}$, $2h=${h2}$, $b=1$: $\tan\theta=\dfrac{2\sqrt{h^2-ab}}{|a+b|}=\dfrac{\sqrt{${h2 * h2}-${4 * a}}}{${Math.abs(a + 1)}}=\dfrac{${Math.sqrt(h2 * h2 - 4 * a)}}{${Math.abs(a + 1)}}=${answer}$. (The slopes are $${m1}$ and $${m2}$.)</p>` };
    },
    verify(p) { return Math.sqrt(p.h2 * p.h2 - 4 * p.a) / Math.abs(p.a + 1); },
  },
  {
    id: 'sl-g17', type: 'mcq', format: 'single', level: 2, exams: EXS[2], sub: 'two-point form',
    make(rng) {
      const m = choose(rng, [-3, -2, -1, 2, 3]), x1 = int(rng, -3, 3), y1 = int(rng, -3, 3), dx = int(rng, 1, 3);
      const x2 = x1 + dx, y2 = y1 + m * dx;
      const c = y1 - m * x1;
      const eq = (mm, cc) => `$${mm === 1 ? '' : mm === -1 ? '-' : mm}x-y${cc < 0 ? cc : cc === 0 ? '' : '+' + cc}=0$`;
      const o = shuffleOpts(rng, eq(m, c), [eq(m, -c === c ? c + 1 : -c), eq(-m, c), eq(-m, -c)]);
      return { m, x1, y1, x2, y2, c, ...o,
        q: `The line through $(${x1},${y1})$ and $(${x2},${y2})$ is`,
        sol: R`<p>Slope $=\dfrac{${y2}-(${y1})}{${x2}-(${x1})}=${m}$. $y-(${y1})=${m}(x-(${x1}))$ gives $${m}x-y${c < 0 ? c : c === 0 ? '' : '+' + c}=0$.</p>` };
    },
    verify(p) { const eq = (mm, cc) => `$${mm === 1 ? '' : mm === -1 ? '-' : mm}x-y${cc < 0 ? cc : cc === 0 ? '' : '+' + cc}=0$`; return p.options.indexOf(eq((p.y2 - p.y1) / (p.x2 - p.x1), p.y1 - ((p.y2 - p.y1) / (p.x2 - p.x1)) * p.x1)); },
  },
  {
    id: 'sl-g18', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'shifting the origin',
    make(rng) {
      const a = int(rng, 1, 5), b = choose(rng, [-4, -3, -2, 2, 3, 4, 5]), c = int(rng, -9, 9), h = int(rng, -4, 4), k = int(rng, -4, 4);
      const cs = (v) => (v < 0 ? `${v}` : `+${v}`);
      const answer = a * h + b * k + c;
      return { a, b, c, h, k, answer, tol: 0,
        q: `The origin is shifted to $(${h},${k})$. The line $${a}x${cs(b)}y${cs(c)}=0$ becomes $${a}X${cs(b)}Y+c'=0$. Find $c'$.`,
        sol: R`<p>$x=X+(${h})$, $y=Y+(${k})$. The constant term is $a h+bk+c=${a}(${h})+(${b})(${k})+(${c})=${answer}$.</p>` };
    },
    verify(p) { return p.a * (p.h) + p.b * (p.k) + p.c; },
  },
  {
    id: 'sl-g19', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'locus',
    make(rng) {
      const a = int(rng, 2, 9);
      return { a, answer: 2 * a * a, tol: 0,
        q: `Find the area enclosed by the locus $|x|+|y|=${a}$.`,
        sol: R`<p>The locus is a square with vertices $(\pm${a},0)$ and $(0,\pm${a})$. Both diagonals are ${2 * a}, so the area is $\dfrac12\times${2 * a}\times${2 * a}=${2 * a * a}$.</p>` };
    },
    verify(p) { const v = [[p.a, 0], [0, p.a], [-p.a, 0], [0, -p.a]]; let t = 0; for (let k = 0; k < 4; k++) { const [x1, y1] = v[k], [x2, y2] = v[(k + 1) % 4]; t += x1 * y2 - x2 * y1; } return Math.abs(t) / 2; },
  },
];

export default { topic: 'straight-lines', groups, items, gens };
