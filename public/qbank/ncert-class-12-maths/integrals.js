// Class 12 Maths, Chapter 7 Integrals: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose, tidyGens } from '../_util.js';
const m = maker('ig');
const R = String.raw;
// Simpson's rule, used by the templates to check their own answers without an antiderivative.
const simp = (f, a, b, N = 2000) => { const h = (b - a) / N; let s = f(a) + f(b); for (let i = 1; i < N; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };

export default tidyGens({
  topic: 'integrals', name: 'Integrals', n: 7,
  items: [
    m.mcq(1, 'basic', R`<p>$\int \left(x^3 + \dfrac1x\right)dx$ equals:</p>`, R`$\dfrac{x^4}{4} + \ln|x| + C$`, [R`$3x^2 - \dfrac1{x^2} + C$`, R`$\dfrac{x^4}{4} + \dfrac{1}{x^2} + C$`, R`$x^4 + \ln x + C$`], R`<p>Use $\int x^n dx = \frac{x^{n+1}}{n+1}$ and $\int \frac1x dx = \ln|x|$.</p>`),
    m.mcq(1, 'basic', R`<p>$\int \sin x\,dx$ is:</p>`, R`$-\cos x + C$`, [R`$\cos x + C$`, R`$\sin x + C$`, R`$-\sin x + C$`], R`<p>$\frac{d}{dx}(-\cos x) = \sin x$.</p>`, { trap: 'Losing the minus sign.' }),
    m.mcq(2, 'basic', R`<p>$\int \dfrac{dx}{\sqrt{1 - x^2}}$ equals:</p>`, R`$\sin^{-1}x + C$`, [R`$\tan^{-1}x + C$`, R`$\cos x + C$`, R`$\sec^{-1}x + C$`], R`<p>This is the standard form $\int\frac{dx}{\sqrt{a^2-x^2}} = \sin^{-1}\frac xa$ with $a = 1$.</p>`),
    m.mcq(2, 'basic', R`<p>If $\dfrac{d}{dx}F(x) = 3x^2 + 2$ and $F(0) = 5$, then $F(1)$ equals:</p>`, R`8`, [R`3`, R`6`, R`10`], R`<p>$F(x) = x^3 + 2x + C$ and $F(0) = C = 5$. So $F(1) = 1 + 2 + 5 = 8$.</p>`),
    m.mcq(2, 'subst', R`<p>$\int \dfrac{2x}{x^2 + 1}\,dx$ equals:</p>`, R`$\ln(x^2 + 1) + C$`, [R`$\tan^{-1}x + C$`, R`$\dfrac{1}{x^2+1} + C$`, R`$2\ln x + C$`], R`<p>The top is the derivative of the bottom: put $u = x^2+1$.</p>`),
    m.mcq(2, 'subst', R`<p>$\int e^{3x}\,dx$ equals:</p>`, R`$\dfrac{e^{3x}}{3} + C$`, [R`$3e^{3x} + C$`, R`$e^{3x} + C$`, R`$\dfrac{e^{x}}{3} + C$`], R`<p>Put $u = 3x$, $dx = du/3$.</p>`, { trap: 'Forgetting to divide by the inner derivative 3.' }),
    m.mcq(3, 'subst', R`<p>$\int \tan x\,dx$ equals:</p>`, R`$-\ln|\cos x| + C$`, [R`$\ln|\sin x| + C$`, R`$\sec^2 x + C$`, R`$\ln|\cos x| + C$`], R`<p>$\tan x = \frac{\sin x}{\cos x}$. With $u = \cos x$, $du = -\sin x\,dx$, the integral is $-\ln|u|$.</p>`),
    m.mcq(3, 'subst', R`<p>$\int \dfrac{dx}{x^2 + 4x + 13}$ equals:</p>`, R`$\dfrac13\tan^{-1}\dfrac{x+2}{3} + C$`, [R`$\tan^{-1}(x+2) + C$`, R`$\dfrac12\tan^{-1}\dfrac{x+2}{3} + C$`, R`$\dfrac13\tan^{-1}\dfrac{x+4}{13} + C$`], R`<p>Complete the square: $x^2+4x+13 = (x+2)^2 + 3^2$, so the integral is $\frac13\tan^{-1}\frac{x+2}{3}$.</p>`),
    m.mcq(2, 'parts', R`<p>For $\int x\cos x\,dx$ the best choice is:</p>`, R`$u = x,\ dv = \cos x\,dx$`, [R`$u = \cos x,\ dv = x\,dx$`, R`$u = x\cos x,\ dv = dx$`, R`$u = 1,\ dv = x\cos x\,dx$`], R`<p>ILATE: algebraic before trigonometric. Then $du = dx$, $v = \sin x$, and the answer is $x\sin x + \cos x + C$.</p>`),
    m.mcq(3, 'parts', R`<p>$\int \ln x\,dx$ equals:</p>`, R`$x\ln x - x + C$`, [R`$\dfrac1x + C$`, R`$x\ln x + x + C$`, R`$\dfrac{(\ln x)^2}{2} + C$`], R`<p>Write it as $1\cdot\ln x$ and take $u = \ln x$, $dv = dx$: $x\ln x - \int x\cdot\frac1x dx = x\ln x - x$.</p>`),
    m.mcq(3, 'parts', R`<p>$\int e^x(\sin x + \cos x)\,dx$ equals:</p>`, R`$e^x\sin x + C$`, [R`$e^x\cos x + C$`, R`$e^x(\sin x - \cos x) + C$`, R`$2e^x\sin x + C$`], R`<p>Use $\int e^x[f + f'] = e^x f$ with $f = \sin x$, $f' = \cos x$.</p>`),
    m.mcq(2, 'partial', R`<p>The partial fractions of $\dfrac{1}{(x-1)(x+1)}$ are:</p>`, R`$\dfrac{1/2}{x-1} - \dfrac{1/2}{x+1}$`, [R`$\dfrac{1}{x-1} - \dfrac{1}{x+1}$`, R`$\dfrac{1/2}{x-1} + \dfrac{1/2}{x+1}$`, R`$\dfrac{1}{x-1} + \dfrac{1}{x+1}$`], R`<p>Cover-up: $A = \frac{1}{1+1} = \frac12$, $B = \frac{1}{-1-1} = -\frac12$.</p>`),
    m.mcq(3, 'partial', R`<p>$\int \dfrac{dx}{x^2 - 1}$ equals:</p>`, R`$\dfrac12\ln\left|\dfrac{x-1}{x+1}\right| + C$`, [R`$\ln|x^2-1| + C$`, R`$\dfrac12\ln\left|\dfrac{x+1}{x-1}\right| + C$`, R`$\tan^{-1}x + C$`], R`<p>Using $\frac{1}{x^2-1} = \frac12\left(\frac1{x-1} - \frac1{x+1}\right)$ and integrating gives $\frac12\ln|x-1| - \frac12\ln|x+1|$.</p>`),
    m.mcq(2, 'definite', R`<p>$\int_0^2 3x^2\,dx$ equals:</p>`, R`8`, [R`12`, R`6`, R`4`], R`<p>$[x^3]_0^2 = 8$.</p>`),
    m.mcq(2, 'definite', R`<p>The fundamental theorem of calculus says that if $A(x) = \int_a^x f(t)\,dt$ then:</p>`, R`$A'(x) = f(x)$`, [R`$A'(x) = f'(x)$`, R`$A(x) = f(x)$`, R`$A'(x) = 0$`], R`<p>The area grows at a rate equal to the height of the curve.</p>`),
    m.mcq(3, 'definite', R`<p>$\int_0^1 2x\,e^{x^2}\,dx$ equals:</p>`, R`$e - 1$`, [R`$e$`, R`$\dfrac{e-1}{2}$`, R`$2e$`], R`<p>$u = x^2$, limits 0 to 1: $\int_0^1 e^u du = e - 1$.</p>`),
    m.mcq(2, 'props', R`<p>$\int_{-1}^{1} (x^5 + x^3 + x)\,dx$ equals:</p>`, R`0`, [R`1`, R`2`, R`$\dfrac{11}{6}$`], R`<p>Every term is odd and the limits are symmetric.</p>`),
    m.mcq(3, 'props', R`<p>$\int_{-2}^{2} (x^2 + 1)\,dx$ equals:</p>`, R`$\dfrac{28}{3}$`, [R`0`, R`$\dfrac{14}{3}$`, R`4`], R`<p>Even function: $2\int_0^2(x^2+1)dx = 2\left(\frac83 + 2\right) = \frac{28}{3}$.</p>`),
    m.mcq(3, 'props', R`<p>The value of $\int_0^{\pi/2}\dfrac{\cos x}{\sin x + \cos x}\,dx$ is:</p>`, R`$\dfrac\pi4$`, [R`$\dfrac\pi2$`, R`1`, R`0`], R`<p>By $\int_0^a f(x)dx = \int_0^a f(a-x)dx$ it equals $\int_0^{\pi/2}\frac{\sin x}{\sin x+\cos x}dx$; the two add to $\int_0^{\pi/2}1\,dx = \frac\pi2$, so each is $\frac\pi4$.</p>`),
    m.ar(2, 'basic', R`$\int \dfrac{dx}{x} = \ln|x| + C$ is true for $x < 0$ as well as $x > 0$.`, R`$\dfrac{d}{dx}\ln|x| = \dfrac1x$ for every $x \ne 0$.`, 0, R`<p>Both true, and R explains A.</p>`),
    m.ar(2, 'parts', R`In $\int x e^x\,dx$ choosing $u = x$ makes the problem simpler.`, R`The derivative of $x$ is $1$, so the remaining integral is $\int e^x dx$.`, 0, R`<p>Both true; R is exactly why u = x is a good choice.</p>`),
    m.ar(3, 'props', R`$\int_{-1}^{3} x^3\,dx = 0$.`, R`$x^3$ is an odd function.`, 3, R`<p>R is true, but the limits are not symmetric, so A is false: $[x^4/4]_{-1}^{3} = \frac{81}{4} - \frac14 = 20$.</p>`),
    m.ar(3, 'definite', R`The definite integral $\int_0^{2\pi}\sin x\,dx$ equals the area between the sine curve and the x-axis.`, R`The integral counts area below the x-axis as negative.`, 3, R`<p>R is true and explains why A is false: the integral is $0$, but the area is $4$.</p>`),
    m.nat(2, 'definite', R`<p>Find $\int_1^3 (2x + 1)\,dx$.</p>`, () => 10, 0, R`<p>$[x^2 + x]_1^3 = 12 - 2 = 10$.</p>`),
    m.nat(3, 'subst', R`<p>Find $\int_0^1 x(x^2+1)^3\,dx$ (give a decimal).</p>`, () => (16 - 1) / 8, 0.01, R`<p>$u = x^2+1$: $\frac12\int_1^2 u^3du = \frac12\cdot\frac{16-1}{4} = \frac{15}{8} = 1.875$.</p>`),
    m.nat(3, 'parts', R`<p>Find $\int_0^1 x e^{x}\,dx$.</p>`, () => 1, 0.01, R`<p>$[(x-1)e^x]_0^1 = 0 - (-1) = 1$.</p>`),
    m.nat(3, 'definite', R`<p>Find $\int_0^{\pi/2}\cos x\,dx + \int_0^{\pi/2}\sin x\,dx$.</p>`, () => 2, 0.01, R`<p>Each integral is 1: $[\sin x]_0^{\pi/2} = 1$ and $[-\cos x]_0^{\pi/2} = 1$.</p>`),
    m.msq(3, 'props', R`<p>Which of these integrals are zero? (Choose all that apply.)</p>`, [R`$\int_{-2}^{2} x^3\,dx$`, R`$\int_{-\pi}^{\pi}\sin x\,dx$`, R`$\int_{-1}^{1}x^2\,dx$`, R`$\int_{-3}^{3}x\cos x\,dx$`], [0, 1, 3], R`<p>$x^3$, $\sin x$ and $x\cos x$ (odd times even) are odd functions with symmetric limits, so each integral is 0. $x^2$ is even and gives $\frac23$.</p>`),
  ],
  gens: [
    { id: 'ig-g01', type: 'nat', level: 2, exams: ['board'], sub: 'definite',
      make(rng) { const a = pick(rng, 0, 2), b = a + pick(rng, 1, 3), p = pick(rng, 1, 5), c = pick(rng, 0, 6); const F = (x) => p * x ** 3 / 3 + c * x; return { a, b, p, c, q: `<p>Evaluate $\\int_{${a}}^{${b}} (${p}x^2 + ${c})\\,dx$.</p>`, answer: +(F(b) - F(a)).toPrecision(6), tol: 0.01, unit: '', sol: `<p>$\\left[\\tfrac{${p}x^3}{3} + ${c}x\\right]_{${a}}^{${b}} = ${(F(b) - F(a)).toFixed(3)}$.</p>` }; },
      verify: (p) => simp((t) => p.p * t * t + p.c, p.a, p.b) },
    { id: 'ig-g02', type: 'nat', level: 3, exams: ['board'], sub: 'subst',
      make(rng) { const k = pick(rng, 1, 6), n = pick(rng, 2, 5); const ans = k / (2 * (n + 1)) * (2 ** (n + 1) - 1); return { k, n, q: `<p>Evaluate $\\int_0^1 ${k}x(x^2+1)^{${n}}\\,dx$.</p>`, answer: +ans.toPrecision(6), tol: 0.01, unit: '', sol: `<p>$u = x^2 + 1$, $du = 2x\\,dx$, limits 1 to 2: $\\tfrac{${k}}{2}\\int_1^2 u^{${n}}du = \\tfrac{${k}}{${2 * (n + 1)}}(2^{${n + 1}} - 1) = ${ans.toFixed(3)}$.</p>` }; },
      verify: (p) => simp((t) => p.k * t * (t * t + 1) ** p.n, 0, 1) },
    { id: 'ig-g03', type: 'nat', level: 3, exams: ['board'], sub: 'parts',
      make(rng) { const c = pick(rng, 1, 3), A = pick(rng, 1, 4); const ans = A * ((c - 1) * Math.exp(c) + 1); return { A, c, q: `<p>Evaluate $\\int_0^{${c}} ${A}x e^{x}\\,dx$ as a decimal.</p>`, answer: +ans.toPrecision(6), tol: 0.01, unit: '', sol: `<p>By parts, $\\int xe^x dx = (x-1)e^x$. So the value is $${A}[(${c}-1)e^{${c}} + 1] = ${ans.toFixed(3)}$.</p>` }; },
      verify: (p) => simp((t) => p.A * t * Math.exp(t), 0, p.c) },
    { id: 'ig-g04', type: 'nat', level: 2, exams: ['board'], sub: 'props',
      make(rng) { const a = pick(rng, 1, 5), p = pick(rng, 1, 4), s = pick(rng, 1, 5); const ans = 2 * (p * a ** 3 / 3 + s * a); return { a, p, s, q: `<p>Evaluate $\\int_{-${a}}^{${a}} (x^3 + ${p}x^2 + ${s})\\,dx$.</p>`, answer: +ans.toPrecision(6), tol: 0.01, unit: '', sol: `<p>$x^3$ is odd and gives 0. The even part doubles: $2\\left[\\tfrac{${p}x^3}{3} + ${s}x\\right]_0^{${a}} = ${ans.toFixed(3)}$.</p>` }; },
      verify: (p) => simp((t) => t ** 3 + p.p * t * t + p.s, -p.a, p.a) },
    { id: 'ig-g05', type: 'nat', level: 3, exams: ['board'], sub: 'partial',
      make(rng) { const [r1, r2] = choose(rng, [[1, 2], [1, 3], [2, 3], [1, 4]]), c = pick(rng, 1, 4), d = pick(rng, 1, 5), L = r2 + 1, U = L + choose(rng, [2, 4, 6]); const A = (c * r1 + d) / (r1 - r2), B = (c * r2 + d) / (r2 - r1), ans = A * Math.log((U - r1) / (L - r1)) + B * Math.log((U - r2) / (L - r2)); return { r1, r2, c, d, L, U, q: `<p>Evaluate $\\int_{${L}}^{${U}} \\dfrac{${c}x + ${d}}{(x - ${r1})(x - ${r2})}\\,dx$ as a decimal.</p>`, answer: +ans.toPrecision(6), tol: 0.01, unit: '', sol: `<p>$A = ${A.toFixed(3)}$, $B = ${B.toFixed(3)}$. The integral is $A\\ln|x - ${r1}| + B\\ln|x - ${r2}|$ between the limits $= ${ans.toFixed(3)}$.</p>` }; },
      verify: (p) => simp((t) => (p.c * t + p.d) / ((t - p.r1) * (t - p.r2)), p.L, p.U) },
    { id: 'ig-g06', type: 'nat', level: 2, exams: ['board'], sub: 'basic',
      make(rng) { const c = pick(rng, 1, 5), k = choose(rng, [1, 2, 3]), b = c * k; const ans = Math.atan(b / c) / c; return { c, b, q: `<p>Evaluate $\\int_0^{${b}} \\dfrac{dx}{x^2 + ${c * c}}$ as a decimal (radians).</p>`, answer: +ans.toPrecision(6), tol: 0.01, unit: '', sol: `<p>$\\tfrac1{${c}}\\tan^{-1}\\tfrac{x}{${c}}$ from 0 to ${b} $= \\tfrac1{${c}}\\tan^{-1}(${k}) = ${ans.toFixed(3)}$.</p>` }; },
      verify: (p) => simp((t) => 1 / (t * t + p.c * p.c), 0, p.b) },
    { id: 'ig-g07', type: 'nat', level: 2, exams: ['board'], sub: 'definite',
      make(rng) { const k = pick(rng, 1, 4); return { k, q: `<p>Evaluate $\\int_1^{e^{${k}}} \\dfrac{dx}{x}$.</p>`, answer: k, tol: 0.01, unit: '', sol: `<p>$[\\ln x]_1^{e^{${k}}} = ${k} - 0 = ${k}$.</p>` }; },
      verify: (p) => simp((t) => 1 / t, 1, Math.exp(p.k), 20000) },
  ],
}, ['ig-g01', 'ig-g03', 'ig-g04', 'ig-g05']);
