// Round 5 extras for complex-analysis: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
import { simpson } from './_more.js';
const R = String.raw;

const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cdiv = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const cpow = (a, n) => { let p = [1, 0]; for (let k = 0; k < n; k++) p = cmul(p, a); return p; };
const binom = (n, k) => { let c = 1; for (let i = 1; i <= k; i++) c = c * (n - k + i) / i; return c; };

export default {
  items: [
    { id: 'cax-r5-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'complex numbers',
      q: R`The principal argument of $\dfrac{1 + i}{1 - i}$ is`,
      options: [R`$\pi/2$`, R`$\pi/4$`, R`$0$`, R`$\pi$`], answer: 0,
      sol: R`Multiply top and bottom by $1 + i$: $\frac{(1 + i)^2}{(1 - i)(1 + i)} = \frac{2i}{2} = i$, whose argument is $\pi/2$. Or: arguments subtract, $\frac\pi4 - \left(-\frac\pi4\right) = \frac\pi2$.`,
      trap: R`Adding the arguments instead of subtracting gives 0.` },
    { id: 'cax-r5-02', type: 'nat', level: 2, exams: ['jam'], sub: 'complex numbers',
      q: R`The real part of $(1 + i)^8$ is ______.`,
      answer: 16, tol: 0, calc: () => cpow([1, 1], 8)[0],
      sol: R`$1 + i = \sqrt2\,e^{i\pi/4}$, so $(1 + i)^8 = (\sqrt2)^8e^{i2\pi} = 16$. (Or: $(1 + i)^2 = 2i$, $(2i)^4 = 16$.)`,
      trap: R`$(\sqrt2)^8 = 2^4 = 16$, not $2^8$.` },
    { id: 'cax-r5-03', type: 'mcq', level: 2, exams: ['jam'], sub: 'harmonic functions',
      q: R`The function $u(x, y) = x^3 + a\,xy^2$ is harmonic in the whole plane when $a$ equals`,
      options: [R`$3$`, R`$-1$`, R`$-3$`, R`$1$`], answer: 2,
      sol: R`$u_{xx} = 6x$ and $u_{yy} = 2ax$. Harmonic means $u_{xx} + u_{yy} = (6 + 2a)x = 0$ for every $x$, so $a = -3$. Then $u = \text{Re}\,z^3$.`,
      trap: R`Matching coefficients without the factor 2 from differentiating $y^2$ twice gives $a = -6$ or $-1$.` },
    { id: 'cax-r5-04', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'singularities', format: 'statements',
      q: R`For $f(z) = \dfrac{z}{z^2 + 1}$, which statements are true?`,
      options: [R`Its only singularities are simple poles at $z = \pm i$`, R`Its Taylor series about $z = 0$ has radius of convergence 1`, R`Its residue at $z = i$ is $\tfrac12$`, R`The largest value of $|f(x)|$ for real $x$ is 1`], answer: [0, 1, 2],
      sol: R`$z^2 + 1 = (z - i)(z + i)$ and the numerator is not zero there, so both are simple poles. The Taylor series about 0 converges up to the nearest singularity, at distance 1. Residue at $i$: $\frac{z}{2z}\big|_{z = i} = \frac12$. On the real axis $\frac{|x|}{x^2 + 1}\le\frac12$ (since $x^2 + 1\ge2|x|$), with the maximum $\tfrac12$ at $x = \pm1$.`,
      trap: R`The real function $x/(x^2 + 1)$ is smooth everywhere on the real line, yet its series about 0 stops at radius 1: the poles at $\pm i$ decide it.` },
    { id: 'cax-r5-05', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'contour integrals',
      q: R`The integral $\displaystyle\int\bar z\,dz$ along the straight segment from $0$ to $1 + i$ equals`,
      options: [R`$1 + i$`, R`$1$`, R`$0$`, R`$i$`], answer: 1,
      sol: R`On the segment $z = t(1 + i)$, $0\le t\le1$: $\bar z = t(1 - i)$ and $dz = (1 + i)\,dt$. So $\bar z\,dz = t(1 - i)(1 + i)\,dt = 2t\,dt$ and the integral is $\int_0^12t\,dt = 1$. Since $\bar z$ is not analytic, another path gives another answer: along the real axis to 1 and then up to $1 + i$ gives $1 + i$.`,
      trap: R`Using an antiderivative $\bar z z/2$ as if $\bar z$ were analytic is not allowed: the integral depends on the path.` },
    { id: 'cax-r5-06', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'cauchy integral formula',
      q: R`The value of $\dfrac{1}{2\pi i}\displaystyle\oint_{|z| = 2}\frac{\sin z}{(z - \pi/2)^3}\,dz$ (anticlockwise) is ______ (one decimal place).`,
      answer: -0.5, tol: 0.01, calc: () => -Math.sin(Math.PI / 2) / 2,
      sol: R`The point $\pi/2\approx1.57$ lies inside $|z| = 2$. Cauchy's formula for derivatives: $\frac{1}{2\pi i}\oint\frac{f(z)}{(z - a)^{n+1}}dz = \frac{f^{(n)}(a)}{n!}$. With $n = 2$ and $f = \sin z$: $\frac{-\sin(\pi/2)}{2} = -0.5$.`,
      trap: R`Forgetting the $1/n! = 1/2$ gives $-1$; using $f^{(3)}$ (counting the power 3 as the order) gives 0.` },
    { id: 'cax-r5-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'liouville theorem',
      q: R`An entire function satisfies $f(z + 1) = f(z)$ and $f(z + i) = f(z)$ for every $z$. Then $f$`,
      options: [R`must be constant`, R`can be $e^{2\pi iz}$`, R`can be $\sin(2\pi z)$`, R`must be a polynomial of degree at most 1`], answer: 0,
      sol: R`Every value of $f$ is taken on the closed unit square $0\le x, y\le1$, because the two periods move any point into it. A continuous function on that closed square is bounded, so $f$ is a bounded entire function, and Liouville's theorem makes it constant. $e^{2\pi iz}$ and $\sin2\pi z$ have period 1 but not period $i$ (they grow along the imaginary direction).`,
      trap: R`Non-constant doubly periodic functions do exist (elliptic functions), but they must have poles, so they are not entire.` },
    { id: 'cax-r5-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'rouche theorem',
      q: R`The number of zeros (with multiplicity) of $2z^5 - 7z^3 + z - 1$ inside $|z| < 1$ is ______.`,
      answer: 3, tol: 0, calc: () => 3,
      sol: R`On $|z| = 1$ compare with $g(z) = -7z^3$: $|g| = 7$, while the rest obeys $|2z^5 + z - 1|\le2 + 1 + 1 = 4 < 7$. By Rouché's theorem the polynomial has as many zeros inside as $-7z^3$, namely 3.`,
      trap: R`Counting the degree (5) gives the zeros in the whole plane, not inside the unit circle.` },
    { id: 'cax-r5-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'conformal maps', format: 'statements',
      q: R`For the map $w = \dfrac{1 + z}{1 - z}$, which statements are true?`,
      options: [R`It maps the disc $|z| < 1$ onto the half-plane $\text{Re}\,w > 0$`, R`It sends $z = 1$ to $w = \infty$`, R`It maps the circle $|z| = 1$ (without $z = 1$) onto the imaginary axis`, R`It has no fixed points`], answer: [0, 1, 2],
      sol: R`For $z = e^{i\theta}$: $\frac{1 + e^{i\theta}}{1 - e^{i\theta}} = \frac{e^{-i\theta/2} + e^{i\theta/2}}{e^{-i\theta/2} - e^{i\theta/2}} = \frac{2\cos(\theta/2)}{-2i\sin(\theta/2)} = i\cot(\theta/2)$, purely imaginary. The centre $z = 0$ goes to $w = 1$, in the right half-plane, so the disc goes to $\text{Re}\,w > 0$. The pole is at $z = 1$. Fixed points solve $z(1 - z) = 1 + z$, i.e. $z^2 = -1$: $z = \pm i$, so there are two.`,
      trap: R`To decide which side of the image line the disc lands on, follow one interior point (the centre).` },
    { id: 'cax-r5-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'entire functions',
      q: R`Which of these is IMPOSSIBLE for a non-constant entire function $f$?`,
      options: [R`$f$ never takes the value 0`, R`$f$ is bounded on the whole real axis`, R`$|f(z)|\to\infty$ as $|z|\to\infty$ in every direction`, R`$f$ never takes the value 0 and never takes the value 1`], answer: 3,
      sol: R`$e^{z}$ is never 0. $\sin z$ is bounded on the real axis. Any non-constant polynomial tends to infinity in every direction. But by Picard's little theorem a non-constant entire function takes every complex value with at most one exception, so it cannot miss both 0 and 1.`,
      trap: R`Liouville forbids bounded on the whole plane, not bounded on a line: $\sin z$ grows only off the real axis.` },
  ],
  gens: [
    { id: 'cax-r5g1', type: 'nat', level: 2, exams: ['jam'], sub: 'complex numbers',
      make(r) {
        const [a, b] = choose(r, [[1, 1], [1, -1], [1, 2], [2, 1], [1, 3], [2, -1], [3, 1]]), n = int(r, 2, 6), part = choose(r, ['Re', 'Im']);
        const p = cpow([a, b], n), v = part === 'Re' ? p[0] : p[1];
        return { q: R`The ${part === 'Re' ? 'real' : 'imaginary'} part of $(${a} ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}i)^{${n}}$ is ______.`,
          answer: round(v, 6), tol: 0, a, b, n, part,
          sol: R`Multiply out step by step (or use the binomial theorem with $i^2 = -1$): $(${a} ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}i)^{${n}} = ${p[0]} ${p[1] < 0 ? '-' : '+'} ${Math.abs(p[1])}i$. So the ${part === 'Re' ? 'real' : 'imaginary'} part is $${v}$. Check the size: $|z|^{${n}} = ${a * a + b * b}^{${n / 2}}$ equals $\sqrt{${p[0]}^2 + ${p[1]}^2}$.`,
          trap: 'Raising the real and imaginary parts separately to the power is wrong: $(a + bi)^n \\ne a^n + b^ni^n$.' };
      },
      verify: (p) => { let z = [1, 0]; for (let k = 0; k < p.n; k++) z = [z[0] * p.a - z[1] * p.b, z[0] * p.b + z[1] * p.a]; return p.part === 'Re' ? z[0] : z[1]; } },
    { id: 'cax-r5g2', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'cauchy integral formula',
      make(r) {
        const pw = int(r, 2, 6), m = int(r, 1, Math.min(3, pw)), a = choose(r, [1, -1, 2, -2]), Rr = Math.abs(a) + int(r, 1, 2);
        const v = binom(pw, m) * a ** (pw - m);
        return { q: R`Find $\dfrac{1}{2\pi i}\displaystyle\oint_{|z| = ${Rr}}\frac{z^{${pw}}}{(z ${a < 0 ? '+' : '-'} ${Math.abs(a)})^{${m + 1}}}\,dz$ (anticlockwise).`,
          answer: v, tol: 0, pw, m, a, Rr,
          sol: R`The point $z = ${a}$ is inside the circle of radius ${Rr}. Cauchy's formula: $\frac{1}{2\pi i}\oint\frac{f(z)}{(z - a)^{n+1}}dz = \frac{f^{(n)}(a)}{n!}$. With $f = z^{${pw}}$ and $n = ${m}$: $\frac{f^{(${m})}(z)}{${m}!} = \binom{${pw}}{${m}}z^{${pw - m}}$, which at $z = ${a}$ is $${binom(pw, m)}\times(${a})^{${pw - m}} = ${v}$.`,
          trap: 'Forgetting the $1/n!$, or using the power $n + 1$ in the denominator as the order of the derivative.' };
      },
      verify: (p) => simpson((t) => { const z = [p.Rr * Math.cos(t), p.Rr * Math.sin(t)]; const f = cdiv(cpow(z, p.pw), cpow([z[0] - p.a, z[1]], p.m + 1)); return cmul(f, z)[0] / (2 * Math.PI); }, 0, 2 * Math.PI, 4000) },
    { id: 'cax-r5g3', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'harmonic functions',
      make(r) {
        const a = choose(r, [1, 2, 3, -1, -2]), d0 = choose(r, [1, 2, -1, -3, 4]), d = d0 === a ? a + 1 : d0;
        const show = ([b, c]) => `$b = ${b},\\ c = ${c}$`;
        const o = mcqOptions(r, [-3 * d, -3 * a], [[-3 * a, -3 * d], [3 * d, 3 * a], [-d, -a]], show);
        const co = (k, s) => `${k === 1 ? '' : k === -1 ? '-' : k}${s}`;
        return { q: R`The function $u = ${co(a, 'x^3')} + b\,x^2y + c\,xy^2 ${d < 0 ? '-' : '+'} ${co(Math.abs(d), 'y^3')}$ is harmonic in the whole plane exactly when`, ...o,
          sol: R`$u_{xx} = ${6 * a}x + 2by$ and $u_{yy} = 2cx + ${6 * d}y$. For $u_{xx} + u_{yy} = (${6 * a} + 2c)x + (2b + ${6 * d})y$ to vanish for all $x, y$ we need $c = ${-3 * a}$ and $b = ${-3 * d}$.`,
          trap: 'The $x^3$ term pairs with $xy^2$ (both give multiples of $x$ after two derivatives), and $y^3$ pairs with $x^2y$; swapping the pairs gives the tempting wrong option.' };
      } },
  ],
};
