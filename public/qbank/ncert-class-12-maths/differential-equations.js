// Class 12 Maths, Chapter 9 Differential Equations: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('de');
const R = String.raw;
// Runge-Kutta 4: a numerical solution, used by the templates to check their own answers without the formula.
const rk4 = (F, x0, y0, x1, N = 400) => { const h = (x1 - x0) / N; let x = x0, y = y0; for (let i = 0; i < N; i++) { const k1 = F(x, y), k2 = F(x + h / 2, y + h * k1 / 2), k3 = F(x + h / 2, y + h * k2 / 2), k4 = F(x + h, y + h * k3); y += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6; x += h; } return y; };

export default {
  topic: 'differential-equations', name: 'Differential Equations', n: 9,
  items: [
    m.mcq(1, 'order', R`<p>The order of $\dfrac{d^3y}{dx^3} + 2\dfrac{dy}{dx} = 0$ is:</p>`, R`3`, [R`1`, R`2`, R`0`], R`<p>The highest derivative is $y'''$.</p>`),
    m.mcq(2, 'order', R`<p>The degree of $\left(\dfrac{d^2y}{dx^2}\right)^3 + \left(\dfrac{dy}{dx}\right)^4 + y = 0$ is:</p>`, R`3`, [R`2`, R`4`, R`7`], R`<p>It is the power of the highest-order derivative $y''$, which is 3.</p>`, { trap: 'Picking the largest power (4) of a lower derivative.' }),
    m.mcq(2, 'order', R`<p>The order and degree of $y = x\dfrac{dy}{dx} + \sqrt{1 + \left(\dfrac{dy}{dx}\right)^2}$ are:</p>`, R`order 1, degree 2`, [R`order 1, degree 1`, R`order 2, degree 1`, R`order 1, degree not defined`], R`<p>Remove the root: $(y - xy')^2 = 1 + (y')^2$, a polynomial in $y'$ of degree 2.</p>`),
    m.mcq(2, 'order', R`<p>The degree of $\sin\left(\dfrac{dy}{dx}\right) = x$ is:</p>`, R`not defined`, [R`1`, R`0`, R`2`], R`<p>$dy/dx$ is inside a sine, so the equation is not a polynomial in the derivative.</p>`),
    m.mcq(1, 'general', R`<p>The general solution of $\dfrac{dy}{dx} = 4x$ is:</p>`, R`$y = 2x^2 + C$`, [R`$y = 4x^2 + C$`, R`$y = 2x^2$`, R`$y = 4 + C$`], R`<p>Integrate: $\int 4x\,dx = 2x^2 + C$.</p>`),
    m.mcq(2, 'general', R`<p>The number of arbitrary constants in the general solution of a second-order equation is:</p>`, R`2`, [R`1`, R`3`, R`0`], R`<p>A general solution has as many arbitrary constants as the order of the equation.</p>`),
    m.mcq(2, 'general', R`<p>If $y = Ce^{2x}$ is the general solution, the particular solution with $y(0) = 5$ is:</p>`, R`$y = 5e^{2x}$`, [R`$y = 2e^{5x}$`, R`$y = e^{2x} + 5$`, R`$y = 5e^{x}$`], R`<p>$C e^0 = 5$ gives $C = 5$.</p>`),
    m.mcq(3, 'general', R`<p>A slope field for $\dfrac{dy}{dx} = x$ shows that solution curves are:</p>`, R`parabolas $y = \dfrac{x^2}{2} + C$`, [R`straight lines through the origin`, R`circles around the origin`, R`exponential curves`], R`<p>The slope at each point depends only on $x$ and is $0$ on the y-axis, so each curve is a vertical shift of $y = \frac{x^2}{2}$.</p>`),
    m.mcq(2, 'sep', R`<p>Separating the variables in $\dfrac{dy}{dx} = xy$ gives:</p>`, R`$\dfrac{dy}{y} = x\,dx$`, [R`$y\,dy = x\,dx$`, R`$\dfrac{dy}{x} = y\,dx$`, R`$dy = xy\,dx$`], R`<p>Divide by $y$ and multiply by $dx$.</p>`),
    m.mcq(2, 'sep', R`<p>The solution of $\dfrac{dy}{dx} = y$ with $y(0) = 2$ is:</p>`, R`$y = 2e^x$`, [R`$y = e^{2x}$`, R`$y = 2 + e^x$`, R`$y = 2x$`], R`<p>$y = Ae^x$ and $A = 2$.</p>`),
    m.mcq(3, 'sep', R`<p>The solution of $\dfrac{dy}{dx} = \dfrac{y}{x}$ ($x, y > 0$) is:</p>`, R`$y = Cx$`, [R`$y = x + C$`, R`$y = Cx^2$`, R`$y = C/x$`], R`<p>$\ln y = \ln x + \ln C$.</p>`),
    m.mcq(3, 'sep', R`<p>The solution of $\dfrac{dy}{dx} = -\dfrac{x}{y}$ is a family of:</p>`, R`circles $x^2 + y^2 = C$`, [R`parabolas`, R`straight lines`, R`hyperbolas $y^2 - x^2 = C$`], R`<p>$y\,dy = -x\,dx$ gives $\frac{y^2}{2} = -\frac{x^2}{2} + K$, so $x^2 + y^2 = C$.</p>`),
    m.mcq(3, 'sep', R`<p>The solution of $\dfrac{dy}{dx} = e^{x - y}$ is:</p>`, R`$e^y = e^x + C$`, [R`$e^{-y} = e^x + C$`, R`$y = x + C$`, R`$e^{y} = e^{-x} + C$`], R`<p>$e^y dy = e^x dx$, so $e^y = e^x + C$.</p>`),
    m.mcq(2, 'growth', R`<p>If $\dfrac{dN}{dt} = kN$ with $k > 0$, then $N$:</p>`, R`grows exponentially`, [R`grows linearly`, R`decays exponentially`, R`stays constant`], R`<p>$N = N_0e^{kt}$.</p>`),
    m.mcq(3, 'growth', R`<p>A population doubles in 5 years under $\dfrac{dP}{dt} = kP$. The value of $k$ is:</p>`, R`$\dfrac{\ln 2}{5}$`, [R`$\dfrac{5}{\ln 2}$`, R`$\dfrac25$`, R`$5\ln 2$`], R`<p>$e^{5k} = 2$.</p>`),
    m.mcq(3, 'growth', R`<p>In Newton's law of cooling $\dfrac{dT}{dt} = -k(T - T_r)$, as $t \to \infty$, $T$ approaches:</p>`, R`$T_r$`, [R`0`, R`$T_0$`, R`$\infty$`], R`<p>$T = T_r + (T_0 - T_r)e^{-kt}$ and the exponential tends to 0.</p>`),
    m.mcq(2, 'homog', R`<p>Which of these is a homogeneous equation?</p>`, R`$\dfrac{dy}{dx} = \dfrac{x^2 + y^2}{xy}$`, [R`$\dfrac{dy}{dx} = x + y^2$`, R`$\dfrac{dy}{dx} = \dfrac{x + 1}{y}$`, R`$\dfrac{dy}{dx} = e^{x}y$`], R`<p>Replacing $(x, y)$ by $(\lambda x, \lambda y)$ leaves $\frac{x^2 + y^2}{xy}$ unchanged.</p>`),
    m.mcq(3, 'homog', R`<p>The substitution used for a homogeneous equation is:</p>`, R`$y = vx$, $\dfrac{dy}{dx} = v + x\dfrac{dv}{dx}$`, [R`$y = v + x$, $\dfrac{dy}{dx} = \dfrac{dv}{dx} + 1$`, R`$v = xy$, $\dfrac{dv}{dx} = x + y$`, R`$y = e^{vx}$`], R`<p>The product rule gives $\frac{dy}{dx} = v + x\frac{dv}{dx}$.</p>`),
    m.mcq(3, 'homog', R`<p>For $\dfrac{dy}{dx} = \dfrac{x + y}{x}$, putting $y = vx$ gives:</p>`, R`$x\dfrac{dv}{dx} = 1$`, [R`$x\dfrac{dv}{dx} = v$`, R`$\dfrac{dv}{dx} = 1 + v$`, R`$x\dfrac{dv}{dx} = 1 + 2v$`], R`<p>$v + x\frac{dv}{dx} = 1 + v$, so $x\frac{dv}{dx} = 1$.</p>`),
    m.mcq(2, 'linear', R`<p>The integrating factor of $\dfrac{dy}{dx} + 2y = e^{-x}$ is:</p>`, R`$e^{2x}$`, [R`$e^{2}$`, R`$e^{-x}$`, R`$2x$`], R`<p>$e^{\int 2\,dx} = e^{2x}$.</p>`),
    m.mcq(3, 'linear', R`<p>The integrating factor of $\dfrac{dy}{dx} + \dfrac{3}{x}y = x^2$ ($x > 0$) is:</p>`, R`$x^3$`, [R`$e^{3/x}$`, R`$3\ln x$`, R`$x^2$`], R`<p>$e^{3\ln x} = x^3$.</p>`, { trap: 'Taking $e^{P}$ instead of $e^{\\int P\\,dx}$.' }),
    m.mcq(3, 'linear', R`<p>The solution of $\dfrac{dy}{dx} + y = 1$ with $y(0) = 0$ is:</p>`, R`$y = 1 - e^{-x}$`, [R`$y = e^{-x}$`, R`$y = 1 + e^{-x}$`, R`$y = x$`], R`<p>IF $= e^x$: $ye^x = e^x + C$, so $y = 1 + Ce^{-x}$; $y(0) = 0$ gives $C = -1$.</p>`),
    m.ar(2, 'order', R`The degree of $\left(y''\right)^2 + \left(y'\right)^7 = 0$ is 2.`, R`Degree is the power of the highest-order derivative.`, 0, R`<p>Both true, and R explains A.</p>`),
    m.ar(2, 'homog', R`$\dfrac{dy}{dx} = \dfrac{y}{x} + \sin\dfrac yx$ is a homogeneous equation.`, R`Its right side depends only on $y/x$.`, 0, R`<p>Both true, and R explains A.</p>`),
    m.ar(3, 'linear', R`The integrating factor of $\dfrac{dy}{dx} + \dfrac{2}{x}y = x$ is $e^{2/x}$.`, R`The integrating factor is $e^{\int P\,dx}$.`, 3, R`<p>R is true, but with $P = 2/x$, $\int P\,dx = 2\ln x$ and the factor is $x^2$, so A is false.</p>`),
    m.nat(2, 'order', R`<p>Find (order) + (degree) of $\left(\dfrac{d^2y}{dx^2}\right)^2 + \dfrac{dy}{dx} = x$.</p>`, () => 4, 0, R`<p>Order 2, degree 2, so the sum is 4.</p>`),
    m.nat(3, 'sep', R`<p>If $\dfrac{dy}{dx} = 2y$ and $y(0) = 1$, find $y(\ln 2)$.</p>`, () => 4, 0.01, R`<p>$y = e^{2x}$, so $y(\ln 2) = e^{2\ln 2} = 4$.</p>`),
    m.nat(3, 'growth', R`<p>A culture doubles every 2 hours. By what factor does it grow in 6 hours?</p>`, () => 8, 0.01, R`<p>Three doublings: $2^3 = 8$.</p>`),
    m.msq(3, 'sep', R`<p>Which of these are solutions of $\dfrac{dy}{dx} = 2y$? (Choose all that apply.)</p>`, [R`$y = e^{2x}$`, R`$y = 5e^{2x}$`, R`$y = e^{2x} + 1$`, R`$y = 0$`], [0, 1, 3], R`<p>$y = e^{2x} + 1$ has $y' = 2e^{2x}$, but $2y = 2e^{2x} + 2$, so it is not a solution. The others satisfy $y' = 2y$, including $y = 0$.</p>`),
  ],
  gens: [
    { id: 'de-g01', type: 'nat', level: 2, exams: ['board'], sub: 'sep',
      make(rng) { const k = choose(rng, [0.1, 0.2, 0.3, -0.1, -0.2]), y0 = pick(rng, 2, 9), a = pick(rng, 2, 5); const ans = y0 * Math.exp(k * a); return { k, y0, a, q: `<p>If $\\dfrac{dy}{dx} = ${k}y$ and $y(0) = ${y0}$, find $y(${a})$.</p>`, answer: +ans.toPrecision(6), tol: 0.01, unit: '', sol: `<p>$y = ${y0}e^{${k}x}$, so $y(${a}) = ${y0}e^{${(k * a).toFixed(2)}} = ${ans.toFixed(3)}$.</p>` }; },
      verify: (q) => rk4((t, y) => q.k * y, 0, q.y0, q.a) },
    { id: 'de-g02', type: 'nat', level: 3, exams: ['board'], sub: 'sep',
      make(rng) { const y0 = pick(rng, 1, 5), a = pick(rng, 2, 6); const ans = Math.sqrt(y0 * y0 + a * a); return { y0, a, q: `<p>Solve $\\dfrac{dy}{dx} = \\dfrac{x}{y}$ with $y(0) = ${y0}$ ($y > 0$) and find $y(${a})$.</p>`, answer: +ans.toPrecision(6), tol: 0.01, unit: '', sol: `<p>$y\\,dy = x\\,dx$ gives $y^2 = x^2 + ${y0 * y0}$, so $y(${a}) = \\sqrt{${a * a} + ${y0 * y0}} = ${ans.toFixed(3)}$.</p>` }; },
      verify: (q) => rk4((t, y) => t / y, 0, q.y0, q.a) },
    { id: 'de-g03', type: 'nat', level: 3, exams: ['board'], sub: 'linear',
      make(rng) { const p = choose(rng, [1, 2, 3]), c = pick(rng, 2, 9), y0 = pick(rng, 0, 5), a = choose(rng, [0.5, 1, 2]); const ans = c / p + (y0 - c / p) * Math.exp(-p * a); return { p, c, y0, a, q: `<p>Solve $\\dfrac{dy}{dx} + ${p}y = ${c}$ with $y(0) = ${y0}$ and find $y(${a})$.</p>`, answer: +ans.toPrecision(6), tol: 0.01, unit: '', sol: `<p>IF $= e^{${p}x}$: $y = \\tfrac{${c}}{${p}} + Ce^{-${p}x}$ with $C = ${y0} - \\tfrac{${c}}{${p}}$. At $x = ${a}$, $y = ${ans.toFixed(3)}$.</p>` }; },
      verify: (q) => rk4((t, y) => q.c - q.p * y, 0, q.y0, q.a) },
    { id: 'de-g04', type: 'nat', level: 3, exams: ['board'], sub: 'homog',
      make(rng) { const c = pick(rng, 1, 4), a = choose(rng, [2, 3, 4]); const ans = a * (Math.log(a) + c); return { c, a, q: `<p>Solve $\\dfrac{dy}{dx} = \\dfrac{x + y}{x}$ with $y(1) = ${c}$ and find $y(${a})$.</p>`, answer: +ans.toPrecision(6), tol: 0.01, unit: '', sol: `<p>$y = vx$ gives $dv = dx/x$, so $y = x(\\ln x + C)$ and $C = ${c}$. $y(${a}) = ${a}(\\ln ${a} + ${c}) = ${ans.toFixed(3)}$.</p>` }; },
      verify: (q) => rk4((t, y) => (t + y) / t, 1, q.c, q.a) },
    { id: 'de-g05', type: 'nat', level: 2, exams: ['board'], sub: 'growth',
      make(rng) { const T = choose(rng, [2, 3, 4, 5, 6]), f = choose(rng, [4, 8, 16]); const ans = T * Math.log2(f); return { T, f, q: `<p>A culture doubles every ${T} hours (rate proportional to size). In how many hours does it become ${f} times as large?</p>`, answer: ans, tol: 0.01, unit: 'h', sol: `<p>${f} = 2<sup>${Math.log2(f)}</sup>, so ${Math.log2(f)} doublings: ${Math.log2(f)} × ${T} = ${ans} hours.</p>` }; },
      verify: (q) => { let t = 0, n = 1; while (n < q.f) { n *= 2; t += q.T; } return t; } },
    { id: 'de-g06', type: 'nat', level: 3, exams: ['board'], sub: 'growth',
      make(rng) { const Tr = pick(rng, 20, 35, 5), t = choose(rng, [10, 20]), T1 = choose(rng, [50, 60, 70]); const k = Math.log((90 - Tr) / (T1 - Tr)) / t, ans = Tr + (90 - Tr) * Math.exp(-k * 2 * t); return { Tr, t, T1, q: `<p>A cup of tea at 90 °C is in a ${Tr} °C room and cools by Newton's law. After ${t} minutes it is ${T1} °C. Find its temperature after ${2 * t} minutes (in °C).</p>`, answer: +ans.toPrecision(6), tol: 0.01, unit: '°C', sol: `<p>$T = ${Tr} + ${90 - Tr}e^{-kt}$ with $e^{-k${t}} = ${((T1 - Tr) / (90 - Tr)).toFixed(3)}$. After ${2 * t} min: $T = ${Tr} + ${90 - Tr}\\times(${((T1 - Tr) / (90 - Tr)).toFixed(3)})^2 = ${ans.toFixed(2)}$ °C.</p>` }; },
      verify: (q) => { const k = Math.log((90 - q.Tr) / (q.T1 - q.Tr)) / q.t; return rk4((s, T) => -k * (T - q.Tr), 0, 90, 2 * q.t); } },
  ],
};
