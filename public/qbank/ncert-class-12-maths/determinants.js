// Class 12 Maths, Chapter 4 Determinants: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('dt');
const d2 = (a, b, c, d) => a * d - b * c;
const d3 = (M) => M[0][0] * d2(M[1][1], M[1][2], M[2][1], M[2][2]) - M[0][1] * d2(M[1][0], M[1][2], M[2][0], M[2][2]) + M[0][2] * d2(M[1][0], M[1][1], M[2][0], M[2][1]);
const tex3 = (M) => '$\\begin{vmatrix}' + M.map((r) => r.join('&')).join('\\\\') + '\\end{vmatrix}$';
const sarrus = (M) => M[0][0] * M[1][1] * M[2][2] + M[0][1] * M[1][2] * M[2][0] + M[0][2] * M[1][0] * M[2][1] - M[0][2] * M[1][1] * M[2][0] - M[0][0] * M[1][2] * M[2][1] - M[0][1] * M[1][0] * M[2][2];
const M3 = [[[2, 1, 3], [0, -1, 4], [1, 2, 5]], [[1, 2, 0], [3, -1, 2], [4, 0, 1]], [[3, 0, 2], [1, 4, -1], [2, 5, 1]], [[2, -1, 1], [0, 3, 2], [1, 1, 4]], [[1, 4, 2], [2, 0, 3], [-1, 3, 1]]];

export default {
  topic: 'determinants', name: 'Determinants', n: 4,
  items: [
    m.mcq(1, 'basic', '<p>The value of $\\begin{vmatrix} 4 & 3 \\\\ 2 & 5 \\end{vmatrix}$ is:</p>', '14', ['26', '−14', '20'], '<p>$4\\times5 - 3\\times2 = 20 - 6 = 14$.</p>'),
    m.mcq(1, 'basic', '<p>A square matrix $A$ is singular when:</p>', '$|A| = 0$', ['$|A| = 1$', '$A = I$', '$A$ has no zero entries'], '<p>Singular means the determinant is 0; such a matrix has no inverse.</p>'),
    m.mcq(2, 'basic', '<p>The determinant of a $3\\times3$ matrix $A$ is 5. Then $|2A|$ equals:</p>', '40', ['10', '20', '25'], '<p>All three rows are doubled: $2^3\\times5 = 40$.</p>', { trap: 'Writing $2\\times5$: the factor is $k^n$, not $k$.' }),
    m.mcq(2, 'basic', '<p>For which value of $x$ is $\\begin{vmatrix} x & 3 \\\\ 4 & 6 \\end{vmatrix} = 0$?</p>', '2', ['−2', '0', '4'], '<p>$6x - 12 = 0$ gives $x = 2$.</p>'),
    m.mcq(2, 'expand', '<p>The cofactor of the entry in row 2, column 3 of a matrix is $(-1)^{k}M_{23}$ where $k$ is:</p>', '5', ['6', '1', '23'], '<p>The sign is $(-1)^{i+j} = (-1)^{2+3} = -1$, since $k = 5$ is odd.</p>'),
    m.mcq(2, 'expand', '<p>Expanding a $3\\times3$ determinant along the first row, the signs of the three terms are:</p>', '$+, -, +$', ['$+, +, +$', '$-, +, -$', '$+, -, -$'], '<p>The checkerboard pattern starts with $+$ at the top left and alternates.</p>'),
    m.mcq(3, 'expand', '<p>A student expands a $3\\times3$ determinant once along row 1 and once along column 2. The two answers:</p>', 'are always equal', ['differ by a sign', 'are equal only for symmetric matrices', 'are equal only if the determinant is 0'], '<p>The value does not depend on the row or column chosen, as long as each term carries its checkerboard sign.</p>'),
    m.mcq(2, 'area', '<p>The area of the triangle with vertices $(0,0)$, $(4,0)$ and $(0,6)$ is:</p>', '12 square units', ['24 square units', '10 square units', '6 square units'], '<p>$\\tfrac12\\left|\\begin{vmatrix}0&0&1\\\\4&0&1\\\\0&6&1\\end{vmatrix}\\right| = \\tfrac12\\times24 = 12$.</p>'),
    m.mcq(3, 'area', '<p>The points $(1,2)$, $(3,k)$ and $(5,6)$ are collinear. Then $k$ is:</p>', '4', ['3', '5', '6'], '<p>The determinant with rows $(1,2,1),(3,k,1),(5,6,1)$ must be 0: $1(k-6) - 2(3-5) + 1(18-5k) = 0$, so $-4k + 16 = 0$ and $k = 4$.</p>'),
    m.mcq(2, 'inverse', '<p>If $A = \\begin{bmatrix} 2 & 1 \\\\ 5 & 3 \\end{bmatrix}$, then $\\operatorname{adj}A$ is:</p>', '$\\begin{bmatrix} 3 & -1 \\\\ -5 & 2 \\end{bmatrix}$', ['$\\begin{bmatrix} 3 & 1 \\\\ 5 & 2 \\end{bmatrix}$', '$\\begin{bmatrix} 2 & -1 \\\\ -5 & 3 \\end{bmatrix}$', '$\\begin{bmatrix} -3 & 1 \\\\ 5 & -2 \\end{bmatrix}$'], '<p>Swap the diagonal entries and change the signs of the other two.</p>'),
    m.mcq(3, 'inverse', '<p>If $A$ is a $3\\times3$ non-singular matrix with $|A| = 3$, then $|\\operatorname{adj}A|$ is:</p>', '9', ['3', '27', '1/3'], '<p>$|\\operatorname{adj}A| = |A|^{n-1} = 3^2 = 9$.</p>'),
    m.mcq(3, 'inverse', '<p>If $A$ and $B$ are invertible of the same order, $(AB)^{-1}$ equals:</p>', '$B^{-1}A^{-1}$', ['$A^{-1}B^{-1}$', '$A^{-1}+B^{-1}$', '$(A+B)^{-1}$'], '<p>The order reverses, like taking off shoes after socks.</p>'),
    m.mcq(2, 'inverse', '<p>The matrix $\\begin{bmatrix} 1 & 2 \\\\ 2 & 4 \\end{bmatrix}$:</p>', 'has no inverse', ['has inverse $\\begin{bmatrix} 4 & -2 \\\\ -2 & 1 \\end{bmatrix}$', 'has determinant 8', 'is the identity'], '<p>$|A| = 4 - 4 = 0$, so it is singular.</p>'),
    m.mcq(3, 'equations', '<p>The system $x + y = 2$, $2x + 2y = 5$ has:</p>', 'no solution', ['one solution', 'two solutions', 'infinitely many solutions'], '<p>$D = 0$ but the second equation is not twice the first (2 × 2 = 4 ≠ 5): parallel lines, inconsistent.</p>'),
    m.mcq(3, 'equations', '<p>For $AX = B$ with $|A| = 0$ and $(\\operatorname{adj}A)B = O$, the system has:</p>', 'infinitely many solutions', ['a unique solution', 'no solution', 'exactly two solutions'], '<p>$|A| = 0$ and $(\\operatorname{adj}A)B = 0$ is the consistent case with infinitely many solutions.</p>'),
    m.mcq(2, 'equations', '<p>In Cramer’s rule, $D_x$ is the determinant formed by:</p>', 'replacing the x-column of $D$ with the constants', ['replacing the x-row of $D$ with the constants', 'adding the constants to $D$', 'multiplying $D$ by $x$'], '<p>$D_x$ keeps the other columns of $D$ and puts $b_1, b_2, b_3$ in the x-column.</p>'),
    m.ar(2, 'inverse', 'A square matrix with $|A| = 0$ has no inverse.', 'The inverse is $\\operatorname{adj}A / |A|$, which needs division by $|A|$.', 0, '<p>Both true and R explains A: dividing by $|A| = 0$ is impossible.</p>'),
    m.ar(3, 'basic', 'For a $3\\times3$ matrix, $|3A| = 3|A|$.', 'Multiplying one row by 3 multiplies the determinant by 3.', 3, '<p>A is false: all three rows are multiplied by 3, so $|3A| = 27|A|$. R is true for a single row.</p>'),
    m.ar(3, 'area', 'The area of a triangle can come out as a negative number from the determinant formula.', 'The determinant of the rows $(x, y, 1)$ can be negative.', 3, '<p>The determinant can be negative, so R is true, but the area uses $\\tfrac12|\\det|$ with absolute value, so the area is never negative and A is false.</p>'),
    m.nat(2, 'basic', '<p>Find the value of $\\begin{vmatrix} 6 & -2 \\\\ 3 & 4 \\end{vmatrix}$.</p>', () => 30, 0, '<p>$6\\times4 - (-2)(3) = 24 + 6 = 30$.</p>'),
    m.nat(3, 'expand', '<p>Find $\\begin{vmatrix} 2 & 1 & 3 \\\\ 0 & -1 & 4 \\\\ 1 & 2 & 5 \\end{vmatrix}$.</p>', () => -19, 0, '<p>Along row 1: $2(-5-8) - 1(0-4) + 3(0+1) = -26 + 4 + 3 = -19$.</p>'),
    m.nat(2, 'area', '<p>Find the area (in square units) of the triangle with corners $(2, 3)$, $(6, 3)$ and $(4, 9)$.</p>', () => 12, 0.01, '<p>Base 4 along $y=3$, height $6$: area $=\\tfrac12\\times4\\times6 = 12$. Determinant: rows $(2,3,1),(6,3,1),(4,9,1)$ gives $2(3-9) - 3(6-4) + 1(54-12) = -12 - 6 + 42 = 24$, half is 12.</p>', { unit: 'sq units' }),
    m.nat(3, 'inverse', '<p>If $A$ is $3\\times3$ with $|A| = -2$, find $|\\operatorname{adj}A|$.</p>', () => 4, 0, '<p>$|\\operatorname{adj}A| = |A|^2 = 4$.</p>'),
    m.nat(3, 'equations', '<p>Solve $2x + y = 8$, $x - y = 1$ by Cramer’s rule. Find $x$.</p>', () => 3, 0, '<p>$D = -2 - 1 = -3$, $D_x = -8 - 1 = -9$, so $x = 3$ (and $y = 2$).</p>'),
    m.msq(3, 'inverse', '<p>Which of these are true for $3\\times3$ invertible matrices $A$, $B$? (Choose all that apply.)</p>', ['$A(\\operatorname{adj}A) = |A|I$', '$|A^{-1}| = 1/|A|$', '$(AB)^{-1} = A^{-1}B^{-1}$', '$|\\operatorname{adj}A| = |A|^2$'], [0, 1, 3], '<p>Only $(AB)^{-1} = B^{-1}A^{-1}$ has the order reversed; the option with $A^{-1}B^{-1}$ is false.</p>'),
  ],
  gens: [
    { id: 'dt-g01', type: 'nat', level: 1, exams: ['board'], sub: 'basic',
      make(rng) { const a = pick(rng, 2, 9, 1), b = pick(rng, 1, 6, 1), c = pick(rng, 1, 6, 1), d = pick(rng, 2, 9, 1); return { a, b, c, d, q: '<p>Find $\\begin{vmatrix} ' + a + ' & ' + b + ' \\\\ ' + c + ' & ' + d + ' \\end{vmatrix}$.</p>', answer: a * d - b * c, tol: 0, unit: '', sol: '<p>$' + a + '\\times' + d + ' - ' + b + '\\times' + c + ' = ' + (a * d - b * c) + '$.</p>' }; },
      verify: (p) => p.a * p.d - p.c * p.b },
    { id: 'dt-g02', type: 'nat', level: 3, exams: ['board'], sub: 'expand',
      make(rng) { const M = choose(rng, M3); const v = d3(M); return { M, q: '<p>Find ' + tex3(M) + '.</p>', answer: v, tol: 0, unit: '', sol: '<p>Expanding along row 1 with signs $+,-,+$ gives $' + v + '$.</p>' }; },
      verify: (p) => sarrus(p.M) },
    { id: 'dt-g03', type: 'nat', level: 2, exams: ['board'], sub: 'area',
      make(rng) { const b = pick(rng, 2, 9, 1), h = pick(rng, 2, 9, 1), x = pick(rng, -3, 3, 1), y = pick(rng, -3, 3, 1); return { b, h, x, y, q: '<p>Find the area of the triangle with corners $(' + x + ',' + y + ')$, $(' + (x + b) + ',' + y + ')$ and $(' + x + ',' + (y + h) + ')$ using a determinant.</p>', answer: (b * h) / 2, tol: 0.01, unit: 'sq units', sol: '<p>Area $=\\tfrac12|\\det|$ of rows $(x,y,1)$. The determinant works out to $' + b * h + '$, so the area is $' + (b * h) / 2 + '$ square units.</p>' }; },
      verify: (p) => { const P = [[p.x, p.y], [p.x + p.b, p.y], [p.x, p.y + p.h]]; const u = [P[1][0] - P[0][0], P[1][1] - P[0][1]], v = [P[2][0] - P[0][0], P[2][1] - P[0][1]]; return Math.abs(u[0] * v[1] - u[1] * v[0]) / 2; } },
    { id: 'dt-g04', type: 'nat', level: 2, exams: ['board'], sub: 'basic',
      make(rng) { const k = pick(rng, 2, 4, 1), D = pick(rng, 2, 6, 1), n = choose(rng, [2, 3]); return { k, D, n, q: '<p>$A$ is a $' + n + '\\times' + n + '$ matrix with $|A| = ' + D + '$. Find $|' + k + 'A|$.</p>', answer: D * k ** n, tol: 0, unit: '', sol: '<p>$|kA| = k^n|A| = ' + k + '^' + n + '\\times' + D + ' = ' + D * k ** n + '$.</p>' }; },
      verify: (p) => { let v = p.D; for (let i = 0; i < p.n; i++) v *= p.k; return v; } },
    { id: 'dt-g05', type: 'nat', level: 3, exams: ['board'], sub: 'inverse',
      make(rng) { const D = choose(rng, [2, 3, 4, -2, -3]); return { D, q: '<p>$A$ is a $3\\times3$ matrix with $|A| = ' + D + '$. Find $|\\operatorname{adj}A|$.</p>', answer: D * D, tol: 0, unit: '', sol: '<p>$|\\operatorname{adj}A| = |A|^{n-1} = (' + D + ')^2 = ' + D * D + '$.</p>' }; },
      verify: (p) => Math.exp(2 * Math.log(Math.abs(p.D))) },
    { id: 'dt-g06', type: 'nat', level: 3, exams: ['board'], sub: 'equations',
      make(rng) { const x = pick(rng, 1, 5, 1), y = pick(rng, 1, 5, 1), a = pick(rng, 1, 4, 1), b = pick(rng, 1, 4, 1), c = pick(rng, 1, 4, 1), d = pick(rng, 1, 4, 1) + 4; const e = a * x + b * y, f = c * x - d * y, D = -a * d - b * c; return { x, y, a, b, c, d, e, f, q: '<p>Using Cramer’s rule, find $x$ if $' + a + 'x + ' + b + 'y = ' + e + '$ and $' + c + 'x - ' + d + 'y = ' + f + '$.</p>', answer: x, tol: 0, unit: '', sol: '<p>$D = ' + D + '$, $D_x = ' + (-e * d - b * f) + '$, so $x = ' + x + '$.</p>' }; },
      verify: (p) => { const k = p.c / p.a, yv = (p.f - k * p.e) / (-p.d - k * p.b); return (p.e - p.b * yv) / p.a; } },
    { id: 'dt-g07', type: 'nat', level: 3, exams: ['board'], sub: 'area',
      make(rng) { const m0 = pick(rng, 1, 4, 1), c0 = pick(rng, -3, 3, 1), x1 = pick(rng, -2, 0, 1), x2 = pick(rng, 1, 3, 1), x3 = pick(rng, 4, 6, 1); return { m0, c0, x1, x2, x3, q: '<p>The points $(' + x1 + ',' + (m0 * x1 + c0) + ')$, $(' + x2 + ',' + (m0 * x2 + c0) + ')$ and $(' + x3 + ', k)$ are collinear. Find $k$.</p>', answer: m0 * x3 + c0, tol: 0, unit: '', sol: '<p>The first two points lie on a line of slope $' + m0 + '$, and the determinant of the three points is 0 only if the third lies on it: $k = ' + (m0 * x3 + c0) + '$.</p>' }; },
      verify: (p) => { const y1 = p.m0 * p.x1 + p.c0, y2 = p.m0 * p.x2 + p.c0; return y1 + ((y2 - y1) / (p.x2 - p.x1)) * (p.x3 - p.x1); } },
  ],
};
