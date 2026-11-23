// Class 10 Maths, Chapter 4 Quadratic Equations: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose, tidyGens } from '../_util.js';
const m = maker('qe');
const R = String.raw;
// "ax^2 + bx + c" as TeX
const tex = (a, b, c) => `${a === 1 ? '' : a === -1 ? '-' : a}x^2${b === 0 ? '' : (b < 0 ? ' - ' : ' + ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'x'}${c === 0 ? '' : (c < 0 ? ' - ' : ' + ') + Math.abs(c)}`;

export default tidyGens({
  topic: 'quadratic-equations', name: 'Quadratic Equations', n: 4,
  items: [
    m.mcq(1, 'form', R`<p>Which of these is a quadratic equation?</p>`, R`$x(x+2)=3$`, [R`$x(x+2)=x^2+5$`, R`$x^3+x=0$`, R`$2x+3=0$`], R`<p>$x(x+2)=3$ becomes $x^2+2x-3=0$, which has $x^2$ as its highest power. In $x(x+2)=x^2+5$ the $x^2$ cancels on both sides, leaving the linear equation $2x=5$.</p>`, { trap: 'Always expand and simplify first: the x² can cancel.' }),
    m.mcq(1, 'form', R`<p>The standard form of $3x^2 = 5x - 2$ is:</p>`, R`$3x^2-5x+2=0$`, [R`$3x^2+5x-2=0$`, R`$3x^2-5x-2=0$`, R`$3x^2+5x+2=0$`], R`<p>Move everything to the left: $3x^2 - 5x + 2 = 0$. Moving a term across the equals sign changes its sign.</p>`),
    m.mcq(1, 'word', R`<p>The sum of a number and its square is 42. Which equation does this give?</p>`, R`$x^2+x=42$`, [R`$2x=42$`, R`$x^2-x=42$`, R`$x^2+x^2=42$`], R`<p>The number is $x$ and its square is $x^2$, so $x + x^2 = 42$.</p>`),
    m.mcq(1, 'factor', R`<p>The roots of $x^2-7x+12=0$ are:</p>`, R`3 and 4`, [R`$-3$ and $-4$`, R`2 and 6`, R`$-2$ and $-6$`], R`<p>Two numbers with product 12 and sum $-7$ are $-3$ and $-4$, so $(x-3)(x-4)=0$ and $x = 3$ or $4$.</p>`),
    m.mcq(1, 'factor', R`<p>The solutions of $x^2 - 9 = 0$ are:</p>`, R`$x = 3$ and $x = -3$`, [R`$x = 3$ only`, R`$x = 9$ only`, R`$x = 9$ and $x = -9$`], R`<p>$x^2 = 9$, so $x = \pm 3$. A positive number has two square roots.</p>`, { trap: 'Writing only the positive square root.' }),
    m.mcq(2, 'factor', R`<p>The roots of $2x^2 - 5x - 3 = 0$ are:</p>`, R`$3$ and $-\tfrac12$`, [R`$-3$ and $\tfrac12$`, R`$3$ and $\tfrac12$`, R`$\tfrac52$ and $-3$`], R`<p>Split $-5x$ as $-6x + x$: $2x^2 - 6x + x - 3 = 2x(x-3) + 1(x-3) = (2x+1)(x-3)$. So $x = -\tfrac12$ or $x = 3$.</p>`),
    m.mcq(2, 'nature', R`<p>The roots of $2x^2 - 3x + 5 = 0$ are:</p>`, R`not real`, [R`real and equal`, R`real and distinct`, R`both positive integers`], R`<p>$D = (-3)^2 - 4(2)(5) = 9 - 40 = -31 < 0$, so there are no real roots.</p>`),
    m.mcq(2, 'nature', R`<p>For which positive value of $k$ does $x^2 - kx + 9 = 0$ have equal roots?</p>`, R`6`, [R`3`, R`9`, R`12`], R`<p>Equal roots need $D = 0$: $k^2 - 36 = 0$, so $k = 6$ (taking the positive value).</p>`, { trap: 'Forgetting that D = 0 means b² = 4ac, not b = 2ac.' }),
    m.mcq(2, 'formula', R`<p>The roots of $x^2 + 2x - 1 = 0$ are:</p>`, R`$-1 \pm \sqrt2$`, [R`$1 \pm \sqrt2$`, R`$-1 \pm \sqrt3$`, R`$-2 \pm \sqrt2$`], R`<p>$D = 4 + 4 = 8$, so $x = \dfrac{-2 \pm \sqrt8}{2} = -1 \pm \sqrt2$.</p>`),
    m.mcq(3, 'word', R`<p>The product of two consecutive positive odd integers is 63. If the smaller is $x$, the equation and the integers are:</p>`, R`$x(x+2)=63$; 7 and 9`, [R`$x(x+1)=63$; 7 and 8`, R`$x(x+2)=63$; 6 and 8`, R`$x(x+2)=63$; 9 and 11`], R`<p>Consecutive odd integers differ by 2. $x^2 + 2x - 63 = 0$ gives $(x+9)(x-7)=0$, so $x = 7$ and the integers are 7 and 9.</p>`),
    m.mcq(3, 'nature', R`<p>If $x = 2$ is a root of $x^2 + kx - 10 = 0$, then $k$ equals:</p>`, R`3`, [R`$-3$`, R`7`, R`5`], R`<p>Put $x = 2$: $4 + 2k - 10 = 0$, so $2k = 6$ and $k = 3$.</p>`),
    m.ar(2, 'nature', R`The equation $x^2 + 1 = 0$ has no real roots.`, R`Its discriminant is $-4$, which is negative.`, 0, R`<p>Both true, and R explains A: a negative discriminant means no real roots.</p>`),
    m.ar(2, 'nature', R`The equation $x^2 - 2x + 1 = 0$ has two distinct real roots.`, R`Its discriminant is zero.`, 3, R`<p>$D = 4 - 4 = 0$, so R is true. But D = 0 means the roots are equal ($x = 1$ twice), so A is false.</p>`),
    m.ar(2, 'form', R`A quadratic equation has at most two real roots.`, R`The highest power of $x$ in a quadratic equation is 2.`, 0, R`<p>Both true. A polynomial equation of degree 2 cannot cross the x-axis more than twice, and R is the reason.</p>`),
    m.ar(3, 'factor', R`$2x^2 + 3x + 1 = 0$ can be solved by factorisation.`, R`Its discriminant, 1, is a perfect square.`, 0, R`<p>$D = 9 - 8 = 1 = 1^2$. When D is a perfect square the roots are rational and the quadratic factorises: $(2x+1)(x+1) = 0$. Both true and R explains A.</p>`),
    m.nat(1, 'nature', R`<p>Find the discriminant of $x^2 - 6x + 5 = 0$.</p>`, () => 36 - 20, 0, R`<p>$D = b^2 - 4ac = 36 - 20 = 16$.</p>`),
    m.nat(2, 'factor', R`<p>Find the larger root of $x^2 - 5x - 14 = 0$.</p>`, () => 7, 0, R`<p>$(x - 7)(x + 2) = 0$, so the roots are 7 and $-2$. The larger is 7.</p>`),
    m.nat(2, 'word', R`<p>A rectangle is 4 m longer than it is wide and its area is 60 m². Find its breadth in metres.</p>`, () => 6, 0, R`<p>$x(x+4) = 60$, so $x^2 + 4x - 60 = 0$, which factorises as $(x+10)(x-6) = 0$. Breadth $= 6$ m (the negative root is rejected).</p>`, { unit: 'm' }),
    m.nat(3, 'nature', R`<p>Find the value of $k$ for which $kx^2 - 12x + 9 = 0$ has equal roots.</p>`, () => 144 / 36, 0, R`<p>$D = 144 - 36k = 0$, so $k = 4$.</p>`),
    m.nat(3, 'word', R`<p>A train covers 120 km at a steady speed. If its speed were 10 km/h more, the journey would take 1 hour less. Find its usual speed in km/h.</p>`, () => 30, 0, R`<p>$\dfrac{120}{x} - \dfrac{120}{x+10} = 1$ gives $1200 = x(x+10)$, so $x^2 + 10x - 1200 = 0$, $(x+40)(x-30) = 0$. The speed is 30 km/h.</p>`, { unit: 'km/h' }),
    m.msq(2, 'nature', R`<p>Which of these equations have two distinct real roots? (Choose all that apply.)</p>`, [R`$x^2 - 3x + 1 = 0$`, R`$x^2 + 2x + 5 = 0$`, R`$2x^2 - x - 3 = 0$`, R`$x^2 - 4x + 4 = 0$`], [0, 2], R`<p>Discriminants: 5, $-16$, 25, 0. Only the first and third are positive.</p>`),
    m.msq(2, 'form', R`<p>Which of these are quadratic equations? (Choose all that apply.)</p>`, [R`$x^2 + 3x = 0$`, R`$x(x-1) = x^2 + 4$`, R`$(x+2)^2 = 3$`, R`$x^3 - x^2 = x$`], [0, 2], R`<p>$x(x-1) = x^2+4$ simplifies to $-x = 4$ (linear). $x^3 - x^2 = x$ has degree 3. The others reduce to $x^2 + 3x = 0$ and $x^2 + 4x + 1 = 0$.</p>`),
    m.nat(3, 'formula', R`<p>Use the formula to find the positive root of $x^2 - 3x - 2 = 0$, correct to 2 decimal places.</p>`, () => (3 + Math.sqrt(17)) / 2, 0.01, R`<p>$D = 9 + 8 = 17$, $x = \dfrac{3 \pm \sqrt{17}}{2}$. The positive root is $\dfrac{3 + 4.123}{2} \approx 3.56$.</p>`),
  ],
  gens: [
    { id: 'qe-g01', type: 'nat', level: 1, exams: ['board'], sub: 'nature',
      make(rng) { const a = pick(rng, 1, 5), b = pick(rng, -9, 9), c = pick(rng, -6, 6); return { a, b, c, q: `<p>Find the discriminant of $${tex(a, b, c)} = 0$.</p>`, answer: b * b - 4 * a * c, tol: 0, sol: `<p>$a = ${a}$, $b = ${b}$, $c = ${c}$. $D = (${b})^2 - 4(${a})(${c}) = ${b * b} ${4 * a * c < 0 ? '+' : '-'} ${Math.abs(4 * a * c)} = ${b * b - 4 * a * c}$.</p>` }; },
      verify: (p) => p.b ** 2 - 4 * p.a * p.c },
    { id: 'qe-g02', type: 'nat', level: 2, exams: ['board'], sub: 'factor',
      make(rng) { let p = pick(rng, -9, 9), s = pick(rng, -9, 9); if (!p) p = 5; if (!s) s = -4; const b = -(p + s), c = p * s; return { b, c, q: `<p>Solve $${tex(1, b, c)} = 0$ by factorisation and give the larger root.</p>`, answer: Math.max(p, s), tol: 0, sol: `<p>Two numbers with product ${c} and sum ${b} are ${-p} and ${-s}. So the roots are ${p} and ${s}; the larger is ${Math.max(p, s)}.</p>` }; },
      verify: (p) => Math.max(...[1, -1].map((g) => (-p.b + g * Math.sqrt(p.b * p.b - 4 * p.c)) / 2)) },
    { id: 'qe-g03', type: 'nat', level: 2, exams: ['board'], sub: 'nature',
      make(rng) { const b = pick(rng, 2, 20, 2); return { b, q: `<p>For what value of $k$ does $x^2 - ${b}x + k = 0$ have equal roots?</p>`, answer: (b * b) / 4, tol: 0.001, sol: `<p>Equal roots: $D = 0$, so $${b}^2 - 4k = 0$ and $k = ${b * b}/4 = ${(b * b) / 4}$.</p>` }; },
      verify: (p) => (p.b / 2) ** 2 },
    { id: 'qe-g04', type: 'nat', level: 2, exams: ['board'], sub: 'word',
      make(rng) { const x = pick(rng, 4, 16), d = pick(rng, 2, 9), A = x * (x + d); return { x, d, A, q: `<p>A rectangular field is ${d} m longer than it is wide and its area is ${A} m². Find its breadth in metres.</p>`, answer: x, tol: 0, unit: 'm', sol: `<p>$x(x+${d}) = ${A}$ gives $x^2 + ${d}x - ${A} = 0$, i.e. $(x + ${x + d})(x - ${x}) = 0$. Breadth $= ${x}$ m.</p>` }; },
      verify: (p) => (-p.d + Math.sqrt(p.d * p.d + 4 * p.A)) / 2 },
    { id: 'qe-g05', type: 'nat', level: 2, exams: ['board'], sub: 'word',
      make(rng) { const x = pick(rng, 3, 25), P = x * (x + 1); return { x, P, q: `<p>The product of two consecutive positive integers is ${P}. Find the smaller integer.</p>`, answer: x, tol: 0, sol: `<p>$x(x+1) = ${P}$, so $x^2 + x - ${P} = 0$, $(x + ${x + 1})(x - ${x}) = 0$. The smaller integer is ${x}.</p>` }; },
      verify: (p) => (-1 + Math.sqrt(1 + 4 * p.P)) / 2 },
    { id: 'qe-g06', type: 'nat', level: 3, exams: ['board'], sub: 'word',
      make(rng) { const x = pick(rng, 20, 80, 10), D = (x * (x + 10)) / 10; return { x, D, q: `<p>A bus covers ${D} km at a steady speed. If it went 10 km/h faster it would take 1 hour less. Find its usual speed in km/h.</p>`, answer: x, tol: 0, unit: 'km/h', sol: `<p>$\\dfrac{${D}}{x} - \\dfrac{${D}}{x+10} = 1$ gives $${10 * D} = x(x+10)$, i.e. $x^2 + 10x - ${10 * D} = 0$. The positive root is $x = ${x}$ km/h.</p>` }; },
      verify: (p) => (-10 + Math.sqrt(100 + 40 * p.D)) / 2 },
    { id: 'qe-g07', type: 'nat', level: 3, exams: ['board'], sub: 'nature',
      make(rng) { const r = pick(rng, 1, 8), s = pick(rng, 1, 8); return { r, s, q: `<p>If $x = ${r}$ is a root of $x^2 + kx + ${r * s} = 0$, find $k$.</p>`, answer: -(r + s), tol: 0, sol: `<p>Put $x = ${r}$: $${r * r} + ${r}k + ${r * s} = 0$, so ${r === 1 ? '' : `$${r}k = ${-(r * r + r * s)}$ and `}$k = ${-(r + s)}$.</p>` }; },
      verify: (p) => -(p.r * p.r + p.r * p.s) / p.r },
    { id: 'qe-g08', type: 'nat', level: 3, exams: ['board'], sub: 'formula',
      make(rng) { const a = pick(rng, 1, 3), b = pick(rng, 2, 9), c = pick(rng, 1, 6), D = b * b + 4 * a * c; const ans = Math.round(((-b + Math.sqrt(D)) / (2 * a)) * 100) / 100; return { a, b, c, q: `<p>Find the positive root of $${tex(a, b, -c)} = 0$, correct to 2 decimal places.</p>`, answer: ans, tol: 0.01, sol: `<p>$D = ${b}^2 + 4(${a})(${c}) = ${D}$. $x = \\dfrac{-${b} + \\sqrt{${D}}}{${2 * a}} \\approx ${ans}$.</p>` }; },
      verify: (p) => { const x = (-p.b + Math.sqrt(p.b * p.b + 4 * p.a * p.c)) / (2 * p.a); return Math.round(x * 100) / 100; } },
  ],
}, ['qe-g07']);
