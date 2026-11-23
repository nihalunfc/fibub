// Class 12 Maths, Chapter 8 Application of Integrals: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose, tidyGens } from '../_util.js';
const m = maker('ai');
const R = String.raw;
const simp = (f, a, b, N = 4000) => { const h = (b - a) / N; let s = f(a) + f(b); for (let i = 1; i < N; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };

export default tidyGens({
  topic: 'application-of-integrals', name: 'Application of Integrals', n: 8,
  items: [
    m.mcq(1, 'under', R`<p>The area under $y = x$ from $x = 0$ to $x = 4$ is:</p>`, R`8`, [R`16`, R`4`, R`2`], R`<p>$\int_0^4 x\,dx = \frac{16}{2} = 8$, the triangle with base 4 and height 4.</p>`),
    m.mcq(2, 'under', R`<p>The area bounded by $y = x^2$, the x-axis and $x = 3$ is:</p>`, R`9`, [R`27`, R`3`, R`18`], R`<p>$\left[\frac{x^3}{3}\right]_0^3 = 9$.</p>`),
    m.mcq(2, 'under', R`<p>The area under $y = e^x$ from $x = 0$ to $x = 1$ is:</p>`, R`$e - 1$`, [R`$e$`, R`$1$`, R`$e + 1$`], R`<p>$[e^x]_0^1 = e - 1$.</p>`),
    m.mcq(2, 'under', R`<p>The area under $y = \cos x$ from $0$ to $\pi/2$ is:</p>`, R`1`, [R`0`, R`2`, R`$\dfrac\pi2$`], R`<p>$[\sin x]_0^{\pi/2} = 1$.</p>`),
    m.mcq(2, 'strip', R`<p>A thin vertical strip under $y = f(x)$ has area:</p>`, R`$f(x)\,dx$`, [R`$f'(x)\,dx$`, R`$x\,dy$`, R`$\dfrac{dx}{f(x)}$`], R`<p>Height $f(x)$ times width $dx$.</p>`),
    m.mcq(2, 'strip', R`<p>The area bounded by $x = y^2$, the y-axis and $y = 3$ is found by:</p>`, R`$\int_0^3 y^2\,dy$ (horizontal strips)`, [R`$\int_0^3 x^2\,dx$`, R`$\int_0^3 \sqrt y\,dy$`, R`$\int_0^3 y\,dx$`], R`<p>A horizontal strip at height $y$ has length $x = y^2$ and thickness $dy$, giving $\int_0^3 y^2 dy = 9$.</p>`),
    m.mcq(3, 'strip', R`<p>For the region between $y = \sqrt x$ and $y = x$, vertical strips have height:</p>`, R`$\sqrt x - x$`, [R`$x - \sqrt x$`, R`$x + \sqrt x$`, R`$\sqrt x\cdot x$`], R`<p>The curves meet at $x = 0$ and $x = 1$. On $(0, 1)$, $\sqrt x > x$, so top minus bottom is $\sqrt x - x$.</p>`, { trap: 'Subtracting the wrong way round gives a negative area.' }),
    m.mcq(2, 'between', R`<p>The area enclosed by $y = x^2$ and $y = x$ is:</p>`, R`$\dfrac16$`, [R`$\dfrac13$`, R`$\dfrac12$`, R`$\dfrac56$`], R`<p>$\int_0^1(x - x^2)dx = \frac12 - \frac13 = \frac16$.</p>`),
    m.mcq(3, 'between', R`<p>The area enclosed by $y = x^2$ and $y = 2x$ is:</p>`, R`$\dfrac43$`, [R`$\dfrac83$`, R`$\dfrac23$`, R`$4$`], R`<p>They meet at $0$ and $2$. $\int_0^2(2x - x^2)dx = 4 - \frac83 = \frac43$.</p>`),
    m.mcq(3, 'between', R`<p>The area between $y = 4 - x^2$ and $y = x^2 - 4$ is:</p>`, R`$\dfrac{64}{3}$`, [R`$\dfrac{32}{3}$`, R`$16$`, R`$\dfrac{16}{3}$`], R`<p>They meet at $x = \pm2$. Top minus bottom $= 8 - 2x^2$, so $A = 2\int_0^2 (8 - 2x^2)dx = 2\left(16 - \frac{16}{3}\right) = \frac{64}{3}$.</p>`),
    m.mcq(3, 'between', R`<p>The limits of integration for the area between $y = x + 2$ and $y = x^2$ are:</p>`, R`$x = -1$ and $x = 2$`, [R`$x = 1$ and $x = 2$`, R`$x = -2$ and $x = 1$`, R`$x = 0$ and $x = 2$`], R`<p>$x^2 = x + 2$ gives $(x - 2)(x + 1) = 0$.</p>`),
    m.mcq(2, 'circle', R`<p>The area of the ellipse $\dfrac{x^2}{16} + \dfrac{y^2}{9} = 1$ is:</p>`, R`$12\pi$`, [R`$25\pi$`, R`$7\pi$`, R`$144\pi$`], R`<p>$a = 4$, $b = 3$, so the area is $\pi ab = 12\pi$.</p>`),
    m.mcq(1, 'circle', R`<p>The area of the circle $x^2 + y^2 = 9$ is:</p>`, R`$9\pi$`, [R`$3\pi$`, R`$18\pi$`, R`$81\pi$`], R`<p>Radius 3, area $\pi r^2 = 9\pi$.</p>`),
    m.mcq(3, 'circle', R`<p>In finding the area of the circle $x^2 + y^2 = a^2$, the integral $4\int_0^a \sqrt{a^2 - x^2}dx$ is used because:</p>`, R`the circle is symmetric, so four equal quarters`, [R`the integrand is always positive for all x`, R`the radius is 4`, R`a circle has four tangents`], R`<p>The first-quadrant area is repeated four times by symmetry about both axes.</p>`),
    m.mcq(2, 'sign', R`<p>$\int_0^{2\pi}\sin x\,dx$ and the area between $y = \sin x$ and the x-axis over $[0, 2\pi]$ are, respectively:</p>`, R`0 and 4`, [R`4 and 4`, R`0 and 0`, R`2 and 2`], R`<p>The parts above and below the axis cancel in the integral but add in the area.</p>`),
    m.mcq(3, 'sign', R`<p>The total area between $y = x^3$ and the x-axis from $-1$ to $1$ is:</p>`, R`$\dfrac12$`, [R`0`, R`1`, R`$\dfrac14$`], R`<p>$x^3$ is odd: the two pieces each have area $\frac14$, and they add, so $\frac12$ (not 0).</p>`),
    m.mcq(3, 'sign', R`<p>To find the area between $y = x^2 - 1$ and the x-axis from $x = 0$ to $x = 2$ you should split at:</p>`, R`$x = 1$`, [R`$x = 0$`, R`$x = 2$`, R`$x = 1/2$`], R`<p>The curve crosses the axis where $x^2 - 1 = 0$, so $x = 1$ in the range.</p>`),
    m.mcq(3, 'parabola', R`<p>The area enclosed by $y^2 = 4x$ and $x = 1$ is:</p>`, R`$\dfrac83$`, [R`$\dfrac43$`, R`$4$`, R`$\dfrac{16}{3}$`], R`<p>$2\int_0^1 2\sqrt x\,dx = 4\cdot\frac23 = \frac83$.</p>`),
    m.ar(2, 'sign', R`The area bounded by $y = \sin x$ and the x-axis between $0$ and $2\pi$ equals $\int_0^{2\pi}\sin x\,dx$.`, R`Area counted below the x-axis is negative in a definite integral.`, 3, R`<p>R is true, but A is false: the integral is 0 and the area is 4.</p>`),
    m.ar(2, 'between', R`The area between two curves $y = f(x)$ and $y = g(x)$ with $f \ge g$ is $\int_a^b (f - g)\,dx$.`, R`A thin vertical strip has height $f(x) - g(x)$ and width $dx$.`, 0, R`<p>Both true, and R explains A.</p>`),
    m.ar(3, 'circle', R`The area of the ellipse $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$ is $\pi ab$.`, R`The ellipse is the circle of radius $a$ stretched vertically by the factor $b/a$.`, 0, R`<p>Every strip's height is multiplied by $b/a$, so the area $\pi a^2$ becomes $\pi a^2 \cdot \frac ba = \pi ab$.</p>`),
    m.nat(2, 'under', R`<p>Find the area under $y = 3x^2$ from $x = 0$ to $x = 2$ (in square units).</p>`, () => 8, 0.01, R`<p>$[x^3]_0^2 = 8$.</p>`, { unit: 'sq. units' }),
    m.nat(3, 'between', R`<p>Find the area enclosed by $y = x^2$ and $y = 6x$ (in square units).</p>`, () => 36, 0.01, R`<p>Meet at $0$ and $6$. $\int_0^6(6x - x^2)dx = 108 - 72 = 36$.</p>`, { unit: 'sq. units' }),
    m.nat(3, 'circle', R`<p>Find the area of the ellipse $\frac{x^2}{4} + \frac{y^2}{25} = 1$ in terms of $\pi$ (give the coefficient of $\pi$).</p>`, () => 10, 0.01, R`<p>$a = 2$, $b = 5$, so area $= 10\pi$. The coefficient is 10.</p>`),
    m.nat(3, 'sign', R`<p>Find the total area between $y = x^2 - 1$ and the x-axis from $x = 0$ to $x = 2$.</p>`, () => 2, 0.01, R`<p>Below the axis on $[0,1]$: $\left|\frac13 - 1\right| = \frac23$. Above on $[1,2]$: $\left(\frac83 - 2\right) - \left(\frac13 - 1\right) = \frac23 + \frac23 = \frac43$. Total $\frac23 + \frac43 = 2$.</p>`, { unit: 'sq. units' }),
    m.msq(3, 'between', R`<p>For the region between $y = x^2$ and $y = x + 2$, which statements are true? (Choose all that apply.)</p>`, [R`The line is above the parabola between the intersection points`, R`The area is $\frac92$`, R`The intersections are at $x = -1$ and $x = 2$`, R`The area is $\frac{9}{4}$`], [0, 1, 2], R`<p>The curves meet at $-1$ and $2$; the line is on top between them; $A = \int_{-1}^2 (x + 2 - x^2)dx = \frac92$.</p>`),
  ],
  gens: [
    { id: 'ai-g01', type: 'nat', level: 2, exams: ['board'], sub: 'under',
      make(rng) { const p = pick(rng, 1, 4), c = pick(rng, 0, 5), a = pick(rng, 0, 2), b = a + pick(rng, 1, 3); const F = (x) => p * x ** 3 / 3 + c * x, ans = F(b) - F(a); return { p, c, a, b, q: `<p>Find the area under $y = ${p}x^2 + ${c}$ between $x = ${a}$ and $x = ${b}$.</p>`, answer: +ans.toPrecision(6), tol: 0.01, unit: 'sq. units', sol: `<p>$\\left[\\tfrac{${p}x^3}{3} + ${c}x\\right]_{${a}}^{${b}} = ${ans.toFixed(3)}$.</p>` }; },
      verify: (q) => simp((t) => q.p * t * t + q.c, q.a, q.b) },
    { id: 'ai-g02', type: 'nat', level: 3, exams: ['board'], sub: 'between',
      make(rng) { const k = pick(rng, 2, 9); const ans = k ** 3 / 6; return { k, q: `<p>Find the area enclosed by $y = x^2$ and $y = ${k}x$.</p>`, answer: +ans.toPrecision(6), tol: 0.01, unit: 'sq. units', sol: `<p>They meet at $0$ and $${k}$. $\\int_0^{${k}}(${k}x - x^2)dx = \\tfrac{${k}^3}{6} = ${ans.toFixed(3)}$.</p>` }; },
      verify: (q) => simp((t) => Math.abs(q.k * t - t * t), 0, q.k) },
    { id: 'ai-g03', type: 'nat', level: 2, exams: ['board'], sub: 'circle',
      make(rng) { const a = pick(rng, 2, 9), b = pick(rng, 2, 9); return { a, b, q: `<p>Find the area of the ellipse $\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1$ as a multiple of $\\pi$ (give the coefficient of $\\pi$).</p>`, answer: a * b, tol: 0.01, unit: '', sol: `<p>$a = ${a}$, $b = ${b}$, area $= \\pi ab = ${a * b}\\pi$.</p>` }; },
      verify: (q) => 4 * simp((t) => (q.b / q.a) * Math.sqrt(Math.max(0, q.a * q.a - t * t)), 0, q.a, 20000) / Math.PI },
    { id: 'ai-g04', type: 'nat', level: 3, exams: ['board'], sub: 'sign',
      make(rng) { const c = pick(rng, 1, 5); const ans = 4 * c ** 3 / 3; return { c, q: `<p>Find the total area between $y = x^2 - ${c * c}$ and the x-axis.</p>`, answer: +ans.toPrecision(6), tol: 0.01, unit: 'sq. units', sol: `<p>The curve is below the axis between $-${c}$ and $${c}$, and $\\left|\\int_{-${c}}^{${c}}(x^2 - ${c * c})dx\\right| = \\tfrac{4\\cdot ${c}^3}{3} = ${ans.toFixed(3)}$.</p>` }; },
      verify: (q) => simp((t) => Math.abs(t * t - q.c * q.c), -q.c, q.c) },
    { id: 'ai-g05', type: 'nat', level: 3, exams: ['board'], sub: 'parabola',
      make(rng) { const a = choose(rng, [1, 2, 3, 4]), h = choose(rng, [1, 4, 9]); const ans = (8 / 3) * Math.sqrt(a) * h ** 1.5; return { a, h, q: `<p>Find the area enclosed by $y^2 = ${4 * a}x$ and $x = ${h}$.</p>`, answer: +ans.toPrecision(6), tol: 0.01, unit: 'sq. units', sol: `<p>$A = 2\\int_0^{${h}} 2\\sqrt{${a}x}\\,dx = \\tfrac83\\sqrt{${a}}\\cdot ${h}^{3/2} = ${ans.toFixed(3)}$.</p>` }; },
      verify: (q) => 2 * simp((t) => Math.sqrt(4 * q.a * Math.max(0, t)), 0, q.h, 20000) },
    { id: 'ai-g06', type: 'nat', level: 2, exams: ['board'], sub: 'strip',
      make(rng) { const p = choose(rng, [6, 8, 12]), T = choose(rng, [2, 3, 4].filter((x) => 3 * x <= p)); const ans = p * T * T / 2 - T ** 3; return { p, T, q: `<p>A speed is $v = ${p}t - 3t^2$ m/s. Find the distance covered from $t = 0$ to $t = ${T}$ s using area under the graph.</p>`, answer: ans, tol: 0.01, unit: 'm', sol: `<p>$\\int_0^{${T}}(${p}t - 3t^2)dt = \\left[${p / 2}t^2 - t^3\\right]_0^{${T}} = ${ans}$ m.</p>` }; },
      verify: (q) => simp((t) => q.p * t - 3 * t * t, 0, q.T) },
  ],
}, ['ai-g01', 'ai-g05']);
