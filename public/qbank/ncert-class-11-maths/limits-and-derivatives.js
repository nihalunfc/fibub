// Class 11 Maths, Chapter 12 Limits and Derivatives: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('ld');
const R = String.raw;
const cd = (f, x) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;

export default {
  topic: 'limits-and-derivatives', name: 'Limits and Derivatives', n: 12,
  items: [
    m.mcq(1, 'limits', R`<p>$\displaystyle\lim_{x\to 2}(x^2 + 3x)$ equals:</p>`, R`$10$`, [R`$6$`, R`$4$`, R`$8$`], R`<p>A polynomial is continuous, so substitute: $4 + 6 = 10$.</p>`),
    m.mcq(1, 'derivative', R`<p>The derivative of $x^5$ is:</p>`, R`$5x^4$`, [R`$x^4$`, R`$5x^5$`, R`$4x^5$`], R`<p>$\dfrac{d}{dx}x^n = nx^{n-1}$.</p>`),
    m.mcq(1, 'derivative', R`<p>The derivative of the constant function $f(x) = 7$ is:</p>`, R`$0$`, [R`$7$`, R`$1$`, R`$7x$`], R`<p>A constant has a flat graph, so its slope is 0 everywhere.</p>`),
    m.mcq(2, 'limits', R`<p>$\displaystyle\lim_{x\to 4}\dfrac{x^2 - 16}{x - 4}$ equals:</p>`, R`$8$`, [R`$0$`, R`$4$`, R`$16$`], R`<p>Substituting gives 0/0. Factorise: $\dfrac{(x-4)(x+4)}{x-4} = x + 4 \to 8$.</p>`, { trap: 'Concluding the answer is 0 or "no answer" from the 0/0 form.' }),
    m.mcq(2, 'trig', R`<p>$\displaystyle\lim_{x\to 0}\dfrac{\sin 3x}{x}$ equals:</p>`, R`$3$`, [R`$1$`, R`$\dfrac13$`, R`$0$`], R`<p>$\dfrac{\sin 3x}{x} = 3\cdot\dfrac{\sin 3x}{3x} \to 3 \times 1$.</p>`),
    m.mcq(2, 'derivative', R`<p>The derivative of $\sin x$ is:</p>`, R`$\cos x$`, [R`$-\cos x$`, R`$-\sin x$`, R`$\tan x$`], R`<p>A standard result from first principles, using $\lim \sin h / h = 1$.</p>`),
    m.mcq(2, 'derivative', R`<p>The derivative of $\cos x$ is:</p>`, R`$-\sin x$`, [R`$\sin x$`, R`$-\cos x$`, R`$\cos x$`], R`<p>The graph of cosine slopes downward just after 0, so the derivative is negative there: $-\sin x$.</p>`),
    m.mcq(2, 'limits', R`<p>$\displaystyle\lim_{x\to 0}\dfrac{|x|}{x}$:</p>`, R`does not exist`, [R`equals 1`, R`equals $-1$`, R`equals 0`], R`<p>From the right it is $1$, from the left $-1$. The one-sided limits differ.</p>`),
    m.mcq(3, 'derivative', R`<p>The derivative of $x^2\sin x$ is:</p>`, R`$2x\sin x + x^2\cos x$`, [R`$2x\cos x$`, R`$x^2\cos x$`, R`$2x\sin x - x^2\cos x$`], R`<p>Product rule: $(uv)' = u'v + uv'$ with $u = x^2$, $v = \sin x$.</p>`, { trap: 'Differentiating each factor and multiplying.' }),
    m.mcq(3, 'derivative', R`<p>The derivative of $\dfrac{x^2 + 1}{x - 1}$ is:</p>`, R`$\dfrac{x^2 - 2x - 1}{(x-1)^2}$`, [R`$\dfrac{2x}{1}$`, R`$\dfrac{x^2 + 2x + 1}{(x-1)^2}$`, R`$\dfrac{2x(x-1) + (x^2+1)}{(x-1)^2}$`], R`<p>Quotient rule: $\dfrac{2x(x-1) - (x^2+1)\cdot 1}{(x-1)^2} = \dfrac{x^2 - 2x - 1}{(x-1)^2}$.</p>`),
    m.mcq(3, 'trig', R`<p>$\displaystyle\lim_{x\to 0}\dfrac{\tan x}{x}$ equals:</p>`, R`$1$`, [R`$0$`, R`$\infty$`, R`$-1$`], R`<p>$\dfrac{\tan x}{x} = \dfrac{\sin x}{x}\cdot\dfrac{1}{\cos x} \to 1 \cdot 1$.</p>`),
    m.mcq(3, 'derivative', R`<p>The slope of the tangent to $y = x^3$ at $x = -2$ is:</p>`, R`$12$`, [R`$-12$`, R`$-8$`, R`$6$`], R`<p>$y' = 3x^2 = 3 \times 4 = 12$.</p>`, { trap: 'Writing 3x² at x = −2 as −12 (forgetting the square makes the sign positive).' }),
    m.mcq(3, 'first principles', R`<p>From first principles, the derivative of $f(x) = \dfrac1x$ is:</p>`, R`$-\dfrac{1}{x^2}$`, [R`$\dfrac{1}{x^2}$`, R`$-\dfrac1x$`, R`$\ln x$`], R`<p>$\dfrac{\frac{1}{x+h} - \frac1x}{h} = \dfrac{-h}{x(x+h)h} = \dfrac{-1}{x(x+h)} \to -\dfrac{1}{x^2}$.</p>`),
    m.ar(2, 'limits', R`$\displaystyle\lim_{x\to 1}\dfrac{x^2-1}{x-1} = 2$ even though the fraction is not defined at $x = 1$.`, R`A limit depends on the values of the function near the point, not on its value at the point.`, 0, R`<p>Both true; R explains A.</p>`),
    m.ar(3, 'derivative', R`$f(x) = |x|$ has no derivative at $x = 0$.`, R`The slope from the left is $-1$ and from the right is $+1$.`, 0, R`<p>Both true: the left and right derivatives differ at the corner.</p>`),
    m.ar(3, 'derivative', R`The derivative of $x\cdot x$ is not the product of the derivatives of the two factors.`, R`$(x\cdot x)' = 2x$, but $(x)'\cdot(x)' = 1\cdot 1 = 1$.`, 0, R`<p>Both true, and R is a counter-example that explains A. The correct rule is $(uv)' = u'v + uv'$.</p>`),
    m.ar(2, 'trig', R`$\displaystyle\lim_{x\to 0}\dfrac{\sin x}{x} = 1$ also when $x$ is measured in degrees.`, R`The inequality $\sin x < x < \tan x$ used in the proof holds for $x$ in radians.`, 3, R`<p>A is false: in degrees the limit is $\pi/180$. R is true and is why radians are needed.</p>`),
    m.nat(2, 'limits', R`<p>Find $\displaystyle\lim_{x\to 3}\dfrac{x^3 - 27}{x - 3}$.</p>`, () => 27, 0, R`<p>$x^2 + 3x + 9$ at 3 is $27$.</p>`),
    m.nat(2, 'derivative', R`<p>Find the derivative of $x^4 - 3x^2 + 2$ at $x = 2$.</p>`, () => 20, 0, R`<p>$4x^3 - 6x = 32 - 12 = 20$.</p>`),
    m.nat(3, 'trig', R`<p>Find $\displaystyle\lim_{x\to 0}\dfrac{\sin 5x}{2x}$.</p>`, () => 2.5, 0.001, R`<p>$\dfrac52\cdot\dfrac{\sin 5x}{5x} \to \dfrac52$.</p>`),
    m.nat(3, 'trig', R`<p>Find $\displaystyle\lim_{x\to 0}\dfrac{1 - \cos 2x}{x^2}$.</p>`, () => 2, 0.001, R`<p>$1 - \cos 2x = 2\sin^2 x$, so the fraction is $2\left(\dfrac{\sin x}{x}\right)^2 \to 2$.</p>`),
    m.nat(2, 'derivative', R`<p>Find the derivative of $(x+1)(x+2)$ at $x = 1$.</p>`, () => 5, 0, R`<p>Product rule: $(x+2) + (x+1) = 3 + 2 = 5$. (Or expand: $x^2 + 3x + 2$ gives $2x + 3 = 5$.)</p>`),
    m.msq(2, 'trig', R`<p>Which of these limits (as $x \to 0$) equal 1? (Choose all that apply.)</p>`, [R`$\dfrac{\sin x}{x}$`, R`$\dfrac{\tan x}{x}$`, R`$\dfrac{1 - \cos x}{x}$`, R`$\dfrac{x}{\sin x}$`], [0, 1, 3], R`<p>$\dfrac{1 - \cos x}{x} \to 0$. The others are 1.</p>`),
    m.msq(2, 'derivative', R`<p>Which functions are not differentiable at $x = 0$? (Choose all that apply.)</p>`, [R`$|x|$`, R`$\dfrac1x$ (not defined there)`, R`$x^2$`, R`$\sin x$`], [0, 1], R`<p>$|x|$ has a corner; $1/x$ is not even defined at 0.</p>`),
  ],
  gens: [
    { id: 'ld-g01', type: 'nat', level: 2, exams: ['board'], sub: 'limits',
      make(rng) { const a = pick(rng, 2, 9); return { a, q: `<p>Find $\\displaystyle\\lim_{x\\to ${a}}\\dfrac{x^3 - ${a ** 3}}{x - ${a}}$.</p>`, answer: 3 * a * a, tol: 0.01, sol: `<p>Cancel $(x - ${a})$: $x^2 + ${a}x + ${a * a} \\to ${3 * a * a}$.</p>` }; },
      verify: (p) => { const x = p.a + 1e-5; return (x ** 3 - p.a ** 3) / (x - p.a); } },
    { id: 'ld-g02', type: 'nat', level: 2, exams: ['board'], sub: 'limits',
      make(rng) { const a = pick(rng, 1, 8), b = pick(rng, 1, 6); return { a, b, q: `<p>Find $\\displaystyle\\lim_{x\\to ${a}}\\dfrac{x^2 - ${a + b}x + ${a * b}}{x - ${a}}$.</p>`, answer: a - b, tol: 0.01, sol: `<p>The top is $(x - ${a})(x - ${b})$; the limit is $${a} - ${b} = ${a - b}$.</p>` }; },
      verify: (p) => { const x = p.a + 1e-6; return (x * x - (p.a + p.b) * x + p.a * p.b) / (x - p.a); } },
    { id: 'ld-g03', type: 'nat', level: 2, exams: ['board'], sub: 'trig',
      make(rng) { const k = pick(rng, 1, 9), mm = pick(rng, 2, 8); return { k, mm, q: `<p>Find $\\displaystyle\\lim_{x\\to 0}\\dfrac{\\sin ${k}x}{${mm}x}$ (3 decimal places).</p>`, answer: k / mm, tol: 0.002, sol: `<p>$\\dfrac{${k}}{${mm}}\\cdot\\dfrac{\\sin ${k}x}{${k}x} \\to ${(k / mm).toFixed(3)}$.</p>` }; },
      verify: (p) => { const x = 1e-5; return Math.sin(p.k * x) / (p.mm * x); } },
    { id: 'ld-g04', type: 'nat', level: 3, exams: ['board'], sub: 'derivative',
      make(rng) { const A = pick(rng, 1, 5), B = pick(rng, -6, 6), C = pick(rng, -8, 8), x0 = pick(rng, -3, 3); return { A, B, C, x0, q: `<p>$f(x) = ${A}x^3 ${B < 0 ? '-' : '+'} ${Math.abs(B)}x^2 ${C < 0 ? '-' : '+'} ${Math.abs(C)}x$. Find $f'(${x0})$.</p>`, answer: 3 * A * x0 * x0 + 2 * B * x0 + C, tol: 0.01, sol: `<p>$f'(x) = ${3 * A}x^2 + ${2 * B}x + ${C}$, so $f'(${x0}) = ${3 * A * x0 * x0 + 2 * B * x0 + C}$.</p>` }; },
      verify: (p) => cd((x) => p.A * x ** 3 + p.B * x * x + p.C * x, p.x0) },
    { id: 'ld-g05', type: 'nat', level: 3, exams: ['board'], sub: 'derivative',
      make(rng) { const a = pick(rng, 1, 4), b = pick(rng, -4, 4), c = pick(rng, 1, 4), d = pick(rng, -4, 4), x0 = pick(rng, -3, 3); return { a, b, c, d, x0, q: `<p>Find the derivative of $(${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)})(${c}x ${d < 0 ? '-' : '+'} ${Math.abs(d)})$ at $x = ${x0}$.</p>`, answer: a * (c * x0 + d) + c * (a * x0 + b), tol: 0.01, sol: `<p>$u'v + uv' = ${a}(${c * x0 + d}) + ${c}(${a * x0 + b})$.</p>` }; },
      verify: (p) => cd((x) => (p.a * x + p.b) * (p.c * x + p.d), p.x0) },
    { id: 'ld-g06', type: 'nat', level: 3, exams: ['board'], sub: 'trig',
      make(rng) { const k = pick(rng, 1, 6); return { k, q: `<p>Find $\\displaystyle\\lim_{x\\to 0}\\dfrac{1 - \\cos ${k}x}{x^2}$.</p>`, answer: (k * k) / 2, tol: 0.01, sol: `<p>$1 - \\cos ${k}x = 2\\sin^2(${k}x/2)$, giving $${k * k}/2$.</p>` }; },
      verify: (p) => { const x = 1e-3; return (1 - Math.cos(p.k * x)) / (x * x); } },
    { id: 'ld-g07', type: 'nat', level: 3, exams: ['board'], sub: 'derivative',
      make(rng) { const a = pick(rng, 1, 6), b = choose(rng, [-5, -3, -2, -1, 1, 2, 3, 5]), x0 = choose(rng, [-4, 0, 2, 4, 6].filter((v) => v !== b)); return { a, b, x0, q: `<p>Find $f'(${x0})$ for $f(x) = \\dfrac{x + ${a}}{x ${b < 0 ? '+' : '-'} ${Math.abs(b)}}$ (3 decimal places).</p>`, answer: -(a + b) / (x0 - b) ** 2, tol: 0.002, sol: `<p>$f'(x) = \\dfrac{-(${a} + ${b})}{(x - ${b})^2}$, so $f'(${x0}) = ${(-(a + b) / (x0 - b) ** 2).toFixed(3)}$.</p>` }; },
      verify: (p) => cd((x) => (x + p.a) / (x - p.b), p.x0) },
  ],
};
