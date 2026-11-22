// Round 5 extras for delta-greens-functions: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'dgf-r5-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'sifting',
      q: R`The value of $\displaystyle\int_{-\infty}^{\infty}\sin x\;\delta\!\left(x - \frac\pi2\right)dx$ is`,
      options: [R`$1$`, R`$0$`, R`$\pi/2$`, R`$-1$`], answer: 0,
      sol: R`The delta function picks out the value of the rest of the integrand at the point where its argument is zero, $x = \pi/2$: $\sin(\pi/2) = 1$.`,
      trap: R`Answering with the location $\pi/2$ instead of the value of $\sin x$ there.` },
    { id: 'dgf-r5-02', type: 'nat', level: 2, exams: ['jam'], sub: 'scaling',
      q: R`The value of $\displaystyle\int_{-\infty}^{\infty}e^{x}\,\delta(2x - 4)\,dx$ is ______ (three decimal places).`,
      answer: 3.695, tol: 0.003, calc: () => Math.exp(2) / 2,
      sol: R`$\delta(2x - 4) = \delta(2(x - 2)) = \tfrac12\delta(x - 2)$. So the integral is $\tfrac12e^2\approx3.695$.`,
      trap: R`Forgetting the factor $\tfrac12$ gives $e^2\approx7.389$; putting $x = 4$ gives $e^4$.` },
    { id: 'dgf-r5-03', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'composition',
      q: R`As a distribution, $\delta(x^2 - 9)$ equals`,
      options: [R`$\tfrac13\left[\delta(x - 3) + \delta(x + 3)\right]$`, R`$\delta(x - 3) + \delta(x + 3)$`, R`$\tfrac16\delta(x - 3)$`, R`$\tfrac16\left[\delta(x - 3) + \delta(x + 3)\right]$`], answer: 3,
      sol: R`$\delta(g(x)) = \sum_i\frac{\delta(x - x_i)}{|g'(x_i)|}$ over the simple zeros of $g$. Here $g = x^2 - 9$ has zeros $\pm3$ with $|g'| = |2x| = 6$ at both. So $\delta(x^2 - 9) = \tfrac16[\delta(x - 3) + \delta(x + 3)]$.`,
      trap: R`Keeping only the positive root drops half the weight; $|g'| = 2|x| = 6$, not 3.` },
    { id: 'dgf-r5-04', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'properties', format: 'statements',
      q: R`Which statements about the Dirac delta are true (as distributions, $f$ smooth)?`,
      options: [R`$x\,\delta(x) = 0$`, R`$\delta(-x) = \delta(x)$`, R`$\displaystyle\int f(x)\,\delta'(x)\,dx = -f'(0)$`, R`$[\delta(x)]^2$ is a well-defined distribution`], answer: [0, 1, 2],
      sol: R`$\int f\,x\,\delta(x)dx = 0\cdot f(0) = 0$ for every $f$. Substituting $x\to-x$ shows $\delta(-x)$ acts like $\delta(x)$. Integrating by parts, $\int f\delta'dx = -\int f'\delta\,dx = -f'(0)$. The square of the delta has no meaning: for a narrow spike of width $\varepsilon$ and height $1/\varepsilon$, the square has area $1/\varepsilon\to\infty$.`,
      trap: R`Products of distributions at the same point are not defined in general, even though $\delta$ times a smooth function is fine.` },
    { id: 'dgf-r5-05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'composition',
      q: R`The value of $\displaystyle\int_0^{10}x\,\delta(\cos x)\,dx$ is ______ (two decimal places).`,
      answer: 14.14, tol: 0.02, calc: () => (0.5 + 1.5 + 2.5) * Math.PI,
      sol: R`$\cos x = 0$ at $x = \frac\pi2, \frac{3\pi}2, \frac{5\pi}2\approx1.57, 4.71, 7.85$ inside $(0, 10)$; the next zero, $\frac{7\pi}2\approx11.0$, is outside. At each zero $|(\cos x)'| = |\sin x| = 1$. So the integral is $\frac\pi2 + \frac{3\pi}2 + \frac{5\pi}2 = \frac{9\pi}2\approx14.14$.`,
      trap: R`Including $7\pi/2$ (outside the range) or using $|\sin x|$ values other than 1.` },
    { id: 'dgf-r5-06', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'properties',
      q: R`For real numbers $a$ and $b$, $\displaystyle\int_{-\infty}^{\infty}\delta(x - a)\,\delta(x - b)\,dx$ equals`,
      options: [R`$1$`, R`$\delta(a - b)$`, R`$0$`, R`$\delta(a)\,\delta(b)$`], answer: 1,
      sol: R`Treat $\delta(x - b)$ as the test function for $\delta(x - a)$: the integral is $\delta(a - b)$. It is zero when $a\ne b$ and infinitely concentrated at $a = b$; integrated over $a$ it gives 1. This is the continuum version of $\sum_k\delta_{ik}\delta_{kj} = \delta_{ij}$.`,
      trap: R`Answering 1 treats the result as a number; it is still a delta function of the remaining variables.` },
    { id: 'dgf-r5-07', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'composition',
      q: R`The value of $\displaystyle\int_{-\infty}^{\infty}x^2\,\delta(x^2 - 3x + 2)\,dx$ is ______.`,
      answer: 5, tol: 0, calc: () => 1 / 1 + 4 / 1,
      sol: R`$g = x^2 - 3x + 2 = (x - 1)(x - 2)$ has zeros 1 and 2, with $g' = 2x - 3$ equal to $-1$ and $+1$. So $\delta(g) = \delta(x - 1) + \delta(x - 2)$ and the integral is $1^2 + 2^2 = 5$.`,
      trap: R`Using $g'$ with its sign gives $-1 + 4 = 3$; the formula needs $|g'|$.` },
    { id: 'dgf-r5-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'greens functions',
      q: R`The Green's function of $\dfrac{d^2y}{dx^2} = f(x)$ for $x > 0$ with initial conditions $y(0) = 0$, $y'(0) = 0$ (so that $y = \int_0^\infty G(x, x')f(x')\,dx'$) is`,
      options: [R`$\tfrac12|x - x'|$`, R`$x_<(x_> - 1)$`, R`$(x - x')\,\theta(x - x')$`, R`$\theta(x - x')$`], answer: 2,
      sol: R`$G$ must vanish for $x < x'$ (nothing has happened yet, given zero initial data), be continuous at $x = x'$, and have a slope jump of 1 there. $G = (x - x')\theta(x - x')$ does all three: $G'' = \delta(x - x')$. Then $y = \int_0^x(x - x')f(x')\,dx'$, the familiar double integral.`,
      trap: R`$x_<(x_> - 1)$ belongs to the boundary-value problem $y(0) = y(1) = 0$; $\tfrac12|x - x'|$ is the whole-line solution with no conditions imposed.` },
    { id: 'dgf-r5-09', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'greens functions', format: 'statements',
      q: R`$G$ solves $\nabla^2G = \delta(\mathbf r - \mathbf r')$ in the whole space of the stated dimension, with the usual choice of constant. Which statements are true?`,
      options: [R`In 3D, $G = -\dfrac{1}{4\pi|\mathbf r - \mathbf r'|}$, and $G(\mathbf r, \mathbf r') = G(\mathbf r', \mathbf r)$`, R`In 3D, the Fourier transform of $\dfrac1r$ is $\dfrac{4\pi}{k^2}$`, R`In 2D, $G = \dfrac{1}{2\pi}\ln|\mathbf r - \mathbf r'|$`, R`In 1D, $G = -\tfrac12|x - x'|$`], answer: [0, 1, 2],
      sol: R`3D: $\nabla^2(1/r) = -4\pi\delta^3$, so $G = -1/(4\pi r)$, symmetric in its two points. Transforming $\nabla^2G = \delta$ gives $-k^2\tilde G = 1$, so the transform of $-1/(4\pi r)$ is $-1/k^2$ and that of $1/r$ is $4\pi/k^2$. 2D: the flux of $\nabla\left(\frac{\ln r}{2\pi}\right) = \frac{\hat r}{2\pi r}$ through a circle is 1. 1D: $\frac{d^2}{dx^2}\tfrac12|x| = \delta(x)$, so $G = +\tfrac12|x - x'|$, not minus.`,
      trap: R`The sign in 1D: $|x|$ has a kink pointing down, so its second derivative is a positive delta.` },
    { id: 'dgf-r5-10', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'derivative of delta',
      q: R`The value of $\displaystyle\int_{-\infty}^{\infty}x^3e^{x}\,\delta'(x - 1)\,dx$ is ______ (two decimal places).`,
      answer: -10.87, tol: 0.02, calc: () => -(3 + 1) * Math.E,
      sol: R`$\int f\delta'(x - a)dx = -f'(a)$. With $f = x^3e^x$: $f' = (3x^2 + x^3)e^x$, and $f'(1) = 4e$. So the integral is $-4e\approx-10.87$.`,
      trap: R`Forgetting the minus sign from integrating by parts gives $+10.87$.` },
  ],
  gens: [
    { id: 'dgf-r5g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'composition',
      make(r) {
        const a = int(r, -3, 2), b = a + int(r, 1, 3), n = int(r, 1, 3);
        const s = a + b, p = a * b;
        const v = (a ** n + b ** n) / (b - a);
        const poly = `x^2${s === 0 ? '' : ` ${s > 0 ? '-' : '+'} ${Math.abs(s) === 1 ? '' : Math.abs(s)}x`}${p === 0 ? '' : ` ${p > 0 ? '+' : '-'} ${Math.abs(p)}`}`;
        return { q: R`Find $\displaystyle\int_{-\infty}^{\infty}x^{${n}}\,\delta(${poly})\,dx$ (three decimal places).`,
          answer: round(v, 3), tol: 0.001, a, b, n,
          sol: R`$${poly} = (x - (${a}))(x - (${b}))$, with zeros $${a}$ and $${b}$. There $|g'| = |2x - (${s})| = ${b - a}$ at both. So the integral is $\dfrac{(${a})^{${n}} + (${b})^{${n}}}{${b - a}} = ${round(v, 4)}$.`,
          trap: 'Use $|g\'(x_i)|$, never $g\'$ with its sign; and include every zero.' };
      },
      verify: (p) => (p.a ** p.n) / Math.abs(2 * p.a - p.a - p.b) + (p.b ** p.n) / Math.abs(2 * p.b - p.a - p.b) },
    { id: 'dgf-r5g2', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'derivative of delta',
      make(r) {
        const n = int(r, 2, 5), a = choose(r, [-2, -1, 1, 2, 3]), k = choose(r, [1, 2]);
        const v = -k * n * a ** (n - 1);
        return { q: R`Find $\displaystyle\int_{-\infty}^{\infty}${k === 1 ? '' : k}x^{${n}}\,\delta'(x ${a < 0 ? '+' : '-'} ${Math.abs(a)})\,dx$.`,
          answer: v, tol: 0, n, a, k,
          sol: R`Integrate by parts: $\int f(x)\delta'(x - a)\,dx = -f'(a)$. Here $f = ${k === 1 ? '' : k}x^{${n}}$, $f' = ${k * n}x^{${n - 1}}$, so the answer is $-${k * n}\times(${a})^{${n - 1}} = ${v}$.`,
          trap: 'Dropping the minus sign, or evaluating $f$ instead of $f\'$.' };
      },
      verify: (p) => -p.k * p.n * p.a ** (p.n - 1) },
    { id: 'dgf-r5g3', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'three dimensions',
      make(r) {
        const R0 = int(r, 1, 4), v0 = [int(r, -3, 3), int(r, -3, 3), int(r, -2, 2)], c = int(r, 1, 5);
        const d2 = v0[0] ** 2 + v0[1] ** 2 + v0[2] ** 2, inside = d2 < R0 * R0;
        const v = inside ? d2 + c : 0;
        return { q: R`Find $\displaystyle\int_{r < ${R0}}(r^2 + ${c})\,\delta^3(\mathbf r - \mathbf a)\,d^3r$ for $\mathbf a = (${v0.join(', ')})$, the integral taken over the ball of radius ${R0} centred at the origin.`,
          answer: v, tol: 0, R0, v0, c,
          sol: R`$|\mathbf a|^2 = ${d2}$, so $|\mathbf a| ${inside ? '<' : '\\ge'} ${R0}$: the point is ${inside ? 'inside' : 'outside (or on the edge of)'} the ball. ${inside ? `The delta function picks out $r^2 + ${c}$ at $\\mathbf a$: $${d2} + ${c} = ${v}$.` : 'The delta function then has no support in the region, and the integral is 0.'}`,
          trap: 'Check whether the point lies in the region first; a delta outside the region contributes nothing.' };
      },
      verify: (p) => { const d2 = p.v0[0] ** 2 + p.v0[1] ** 2 + p.v0[2] ** 2; return d2 < p.R0 * p.R0 ? d2 + p.c : 0; } },
  ],
};
