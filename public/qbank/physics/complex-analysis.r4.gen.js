// Round 4 extras for complex-analysis: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;

/** a + bi as TeX, e.g. "2 - 3i", "-i", "4". */
const cz = (a, b) => {
  const im = b === 0 ? '' : `${Math.abs(b) === 1 ? '' : Math.abs(b)}i`;
  if (a === 0) return b === 0 ? '0' : `${b < 0 ? '-' : ''}${im}`;
  return b === 0 ? `${a}` : `${a} ${b < 0 ? '-' : '+'} ${im}`;
};

export default {
  items: [
    { id: 'cax-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'analytic functions',
      q: R`The derivative of $f(z) = z^3$ at $z = i$ is`,
      options: [R`$3i$`, R`$-3$`, R`$3$`, R`$-3i$`], answer: 1,
      sol: R`$f$ is analytic everywhere with $f'(z) = 3z^2$, exactly as for real polynomials. At $z = i$: $3i^2 = -3$.`,
      trap: R`$i^2 = -1$, so the factor $i$ does not survive.` },
    { id: 'cax-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'complex logarithm',
      q: R`The principal value of $i^{\,i}$ is`,
      options: [R`$e^{\pi/2}$`, R`$-1$`, R`$e^{-\pi/2}$`, R`$i$`], answer: 2,
      sol: R`$i^{\,i} = e^{i\,\text{Log}\,i}$ with the principal logarithm $\text{Log}\,i = \ln1 + i\tfrac\pi2 = i\tfrac\pi2$. So $i^{\,i} = e^{i\cdot i\pi/2} = e^{-\pi/2}\approx0.208$, a real number. Other branches give $e^{-\pi/2 - 2\pi k}$.`,
      trap: R`$i\cdot i = -1$ in the exponent, so the result is $e^{-\pi/2}$, not $e^{+\pi/2}$.` },
    { id: 'cax-r4-03', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'complex logarithm',
      q: R`The imaginary part of the principal logarithm $\text{Log}(-1 + i)$ is ______ (three decimal places).`,
      answer: 2.356, tol: 0.002, calc: () => Math.atan2(1, -1),
      sol: R`$\text{Log}\,z = \ln|z| + i\,\text{Arg}\,z$ with $-\pi < \text{Arg}\,z\le\pi$. The point $-1 + i$ lies in the second quadrant at $135^\circ$, so $\text{Arg} = 3\pi/4\approx2.356$ (and the real part is $\ln\sqrt2$).`,
      trap: R`$\tan^{-1}(1/(-1)) = -\pi/4$ puts the point in the wrong quadrant; add $\pi$.` },
    { id: 'cax-r4-04', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'roots of unity',
      q: R`The product of all six sixth roots of unity (the roots of $z^6 = 1$) is`,
      options: [R`$-1$`, R`$1$`, R`$0$`, R`$6$`], answer: 0,
      sol: R`The roots are those of $z^6 - 1$, so their product is $(-1)^6\times(\text{constant term}) = -1$. Directly: the roots $e^{i\pi k/3}$, $k = 0..5$, multiply to $e^{i\pi(0 + 1 + \dots + 5)/3} = e^{5\pi i} = -1$. (Their SUM is 0.)`,
      trap: R`Pairing each root with its conjugate seems to give 1, but $z = -1$ is its own conjugate.` },
    { id: 'cax-r4-05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'power series',
      q: R`The coefficient of $z^4$ in the Taylor series of $\dfrac{e^{z}}{1 - z}$ about $z = 0$ is ______ (three decimal places).`,
      answer: 2.708, tol: 0.002, calc: () => 1 + 1 + 1 / 2 + 1 / 6 + 1 / 24,
      sol: R`Multiply the series $e^z = \sum z^k/k!$ and $\frac{1}{1 - z} = \sum z^m$. The coefficient of $z^4$ collects every $k\le4$ once: $\sum_{k=0}^{4}\frac1{k!} = 1 + 1 + \tfrac12 + \tfrac16 + \tfrac1{24} = \tfrac{65}{24}\approx2.708$. (As $n\to\infty$ the coefficients tend to $e$; the series converges only for $|z| < 1$.)`,
      trap: R`Taking only the $k = 4$ term ($1/24$) forgets that the geometric series supplies every lower power.` },
    { id: 'cax-r4-06', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'Cauchy-Riemann', format: 'statements',
      q: R`Let $f(x + iy) = x^2 + iy^2$. Which statements are true?`,
      options: [R`$f$ is complex-differentiable at $z = 1 + i$`, R`$f$ is analytic at $z = 1 + i$`, R`$f$ is complex-differentiable at $z = 1 + 2i$`, R`$f'(1 + i) = 2$`], answer: [0, 3],
      sol: R`$u = x^2$, $v = y^2$. Cauchy-Riemann: $u_x = v_y$ needs $2x = 2y$; $u_y = -v_x$ is $0 = 0$. The partials are continuous, so $f$ is differentiable exactly on the line $y = x$: at $1 + i$ yes, at $1 + 2i$ no. Analytic means differentiable on a whole neighbourhood, which a line never contains, so $f$ is analytic nowhere. On the line, $f' = u_x + iv_x = 2x$, which is 2 at $1 + i$.`,
      trap: R`Differentiable at a point is weaker than analytic there.` },
    { id: 'cax-r4-07', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'conformal maps',
      q: R`The map $w = e^{z}$ sends the horizontal strip $0 < \text{Im}\,z < \pi$ onto`,
      options: [R`the right half-plane $\text{Re}\,w > 0$`, R`the unit disc $|w| < 1$`, R`the upper half-plane $\text{Im}\,w > 0$`, R`the plane with the negative real axis removed`], answer: 2,
      sol: R`With $z = x + iy$, $w = e^xe^{iy}$: $|w| = e^x$ takes every positive value and $\arg w = y$ runs over $(0, \pi)$. Every point with argument between 0 and $\pi$ is the upper half-plane. (The strip $-\pi < y < \pi$ would give the plane cut along the negative axis.)`,
      trap: R`Mapping only the left half of the strip ($x < 0$) gives the upper half of the unit disc, not the whole disc.` },
    { id: 'cax-r4-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Laurent series',
      q: R`In the annulus $1 < |z| < 2$, the coefficient of $z^{1}$ in the Laurent series of $f(z) = \dfrac{z}{(z - 1)(z + 2)}$ is ______ (three decimal places).`,
      answer: -0.167, tol: 0.002, calc: () => (2 / 3) * (1 / 2) * (-1 / 2),
      sol: R`Partial fractions: $f = \frac{1/3}{z - 1} + \frac{2/3}{z + 2}$. For $|z| > 1$, $\frac1{z - 1} = \sum_{k\ge0}z^{-k-1}$ has only negative powers. For $|z| < 2$, $\frac{1}{z + 2} = \frac12\sum_{k\ge0}\left(-\frac z2\right)^k$. The $z^1$ term comes from the second only: $\tfrac23\cdot\tfrac12\cdot\left(-\tfrac12\right) = -\tfrac16\approx-0.167$.`,
      trap: R`Expanding $\frac1{z - 1}$ in positive powers is valid only for $|z| < 1$, outside this annulus.` },
    { id: 'cax-r4-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Cauchy estimates',
      q: R`$f$ is analytic on the closed disc $|z|\le2$ and $|f(z)|\le5$ on the circle $|z| = 2$. The largest possible value of $|f'(0)|$ is`,
      options: [R`$5$`, R`$\tfrac54$`, R`$10$`, R`$\tfrac52$`], answer: 3,
      sol: R`Cauchy's formula $f'(0) = \frac{1}{2\pi i}\oint_{|z| = 2}\frac{f(z)}{z^2}dz$ gives $|f'(0)|\le\frac{1}{2\pi}\cdot\frac{5}{4}\cdot2\pi\cdot2 = \frac52$. The bound is reached by $f(z) = \tfrac52z$, which has $|f| = 5$ on the circle.`,
      trap: R`Forgetting the length $2\pi R$ of the contour, or using $R^2$ instead of $R$ in the final bound $M/R$.` },
    { id: 'cax-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'analytic continuation',
      q: R`Each power series below converges for $|z| < 1$. Which one cannot be continued analytically across ANY point of the circle $|z| = 1$?`,
      options: [R`$\displaystyle\sum_{n\ge1}\frac{z^n}{n^2}$`, R`$\displaystyle\sum_{n\ge0}z^{2^n}$`, R`$\displaystyle\sum_{n\ge1}nz^n$`, R`$\displaystyle\sum_{n\ge0}z^n$`], answer: 1,
      sol: R`$\sum z^n = \frac1{1 - z}$ and $\sum nz^n = \frac{z}{(1 - z)^2}$ continue to everything except $z = 1$. $\sum z^n/n^2$ is the dilogarithm, continuable except along a branch cut from $z = 1$. The lacunary series $g(z) = \sum z^{2^n}$ satisfies $g(z) = z + g(z^2)$; it blows up as $z\to1$ radially, hence also towards every root of unity of order $2^k$, and these points are dense on the circle. So $|z| = 1$ is a natural boundary.`,
      trap: R`Convergence ON the circle (the $1/n^2$ series converges absolutely there) says nothing about continuation; a series can diverge on the circle and still continue (like $\sum z^n$).` },
    { id: 'cax-r4-11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'identity theorem', format: 'integer',
      q: R`An entire function satisfies $f(1/n) = 1/n^2$ for every positive integer $n$. The value of $f(3)$ is ______.`,
      answer: 9, tol: 0, calc: () => 3 ** 2,
      sol: R`$g(z) = f(z) - z^2$ is entire and vanishes at the points $1/n$, which pile up at $0$ inside the domain. By the identity theorem $g\equiv0$, so $f(z) = z^2$ and $f(3) = 9$.`,
      trap: R`Thinking many entire functions could pass through these points: zeros of a non-zero analytic function are isolated, so the values on a sequence with a limit point fix $f$.` },
    { id: 'cax-r4-12', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'singularities', format: 'statements',
      q: R`For $f(z) = \dfrac{1}{e^{z} - 1}$, which statements are true?`,
      options: [R`Its singularities are simple poles at $z = 2\pi ik$, $k\in\mathbb Z$`, R`The residue at each of these poles is 1`, R`The Taylor series of $f$ about $z = \pi i$ has radius of convergence $\pi$`, R`The constant term of its Laurent series about $z = 0$ is $+\tfrac12$`], answer: [0, 1, 2],
      sol: R`$e^z = 1$ exactly at $z = 2\pi ik$, and there $(e^z)' = 1\ne0$, so each zero is simple and $f$ has simple poles with residue $1/e^{2\pi ik} = 1$. The point $\pi i$ is at distance $\pi$ from the nearest poles ($0$ and $2\pi i$), so the radius is $\pi$. Near 0, $e^z - 1 = z(1 + z/2 + z^2/6 + \dots)$, so $f = \frac1z(1 - \frac z2 + \frac{z^2}{12} - \dots) = \frac1z - \frac12 + \frac{z}{12} - \dots$: the constant term is $-\tfrac12$.`,
      trap: R`The sign of the $-\tfrac12$ (from $1/(1 + w)\approx1 - w$) is easy to drop.` },
  ],
  gens: [
    { id: 'cax-r4g1', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'complex logarithm',
      make(r) {
        const a = choose(r, [-4, -3, -2, -1, 1, 2, 3, 4]), b = choose(r, [-4, -3, -2, -1, 1, 2, 3, 4]), part = choose(r, ['Re', 'Im']);
        const v = part === 'Re' ? 0.5 * Math.log(a * a + b * b) : Math.atan2(b, a);
        const quad = a > 0 ? (b > 0 ? 'first' : 'fourth') : b > 0 ? 'second' : 'third';
        return { q: R`The ${part === 'Re' ? 'real' : 'imaginary'} part of the principal logarithm $\text{Log}(${cz(a, b)})$ is ______ (three decimal places).`,
          answer: round(v, 3), tol: 0.002, a, b, part,
          sol: R`$\text{Log}\,z = \ln|z| + i\,\text{Arg}\,z$ with $-\pi < \text{Arg}\,z\le\pi$. Here $|z| = \sqrt{${a * a + b * b}}$, so the real part is $\tfrac12\ln${a * a + b * b}\approx${round(0.5 * Math.log(a * a + b * b), 3)}$. The point is in the ${quad} quadrant, so $\text{Arg}\,z\approx${round(Math.atan2(b, a), 3)}$ rad. The ${part === 'Re' ? 'real' : 'imaginary'} part is ${round(v, 3)}.`,
          trap: 'Using $\\tan^{-1}(b/a)$ without checking the quadrant gives the wrong argument whenever the real part is negative.' };
      },
      verify: (p) => (p.part === 'Re' ? Math.log(Math.hypot(p.a, p.b)) : Math.sign(p.b) * Math.acos(p.a / Math.hypot(p.a, p.b))) },
    { id: 'cax-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Laurent series',
      make(r) {
        const a = choose(r, [1, -1, 2, -2]), b = choose(r, [3, -3, 4, -4]), n = int(r, -3, 2);
        const v = n <= -1 ? a ** (-n - 1) / (a - b) : 1 / ((a - b) * b ** (n + 1));
        const fz = (p) => (p < 0 ? `(z + ${-p})` : `(z - ${p})`);
        return { q: R`In the annulus $${Math.abs(a)} < |z| < ${Math.abs(b)}$, the coefficient of $z^{${n}}$ in the Laurent series of $f(z) = \dfrac{1}{${fz(a)}${fz(b)}}$ is ______ (four decimal places).`,
          answer: round(v, 4), tol: 0.0002, a, b, n,
          sol: R`Partial fractions: $f = \dfrac{1}{${a - b}}\left[\dfrac{1}{z - (${a})} - \dfrac{1}{z - (${b})}\right]$. In this annulus $|z| > ${Math.abs(a)}$, so $\dfrac{1}{z - (${a})} = \sum_{k\ge0}\dfrac{(${a})^k}{z^{k+1}}$ (negative powers only), and $|z| < ${Math.abs(b)}$, so $-\dfrac{1}{z - (${b})} = \sum_{k\ge0}\dfrac{z^k}{(${b})^{k+1}}$ (non-negative powers only). ${n <= -1 ? `The power $z^{${n}}$ comes from the first sum with $k = ${-n - 1}$: coefficient $\\dfrac{(${a})^{${-n - 1}}}{${a - b}}$` : `The power $z^{${n}}$ comes from the second sum with $k = ${n}$: coefficient $\\dfrac{1}{(${a - b})(${b})^{${n + 1}}}$`} $\approx ${round(v, 4)}$.`,
          trap: 'Each piece must be expanded in the form that converges in the annulus: the inner pole in powers of $1/z$, the outer pole in powers of $z$.' };
      },
      verify: (p) => {
        // c_n = (1/2pi) * integral of f(rho e^{it}) rho^{-n} e^{-int} dt on a circle inside the annulus (trapezoid rule)
        const rho = (Math.abs(p.a) + Math.abs(p.b)) / 2, N = 4000; let s = 0;
        for (let j = 0; j < N; j++) {
          const t = (2 * Math.PI * j) / N, x = rho * Math.cos(t), y = rho * Math.sin(t);
          const ur = x - p.a, vr = x - p.b, dr = ur * vr - y * y, di = y * (ur + vr); // (z-a)(z-b)
          const fr = dr / (dr * dr + di * di), fi = -di / (dr * dr + di * di);
          const er = Math.cos(-p.n * t), ei = Math.sin(-p.n * t);
          s += (fr * er - fi * ei) * rho ** -p.n;
        }
        return s / N;
      } },
    { id: 'cax-r4g3', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'power series',
      make(r) {
        const p1 = [int(r, -3, 3), choose(r, [-2, -1, 1, 2])], fixed = [int(r, -3, 3), choose(r, [-3, 3])];
        const z0 = [int(r, -2, 2), 0];
        const d1 = Math.hypot(p1[0] - z0[0], p1[1]), d2f = Math.hypot(fixed[0] - z0[0], fixed[1]), v = Math.min(d1, d2f);
        const fac = (q) => `(z - (${cz(q[0], q[1])}))`;
        return { q: R`The Taylor series of $f(z) = \dfrac{1}{${fac(p1)}${fac(fixed)}}$ about $z_0 = ${z0[0]}$ has radius of convergence ______ (three decimal places).`,
          answer: round(v, 3), tol: 0.002, p1, p2: fixed, z0,
          sol: R`A Taylor series converges in the largest disc about $z_0$ that contains no singularity, so the radius is the distance to the nearest pole. Distances from $${z0[0]}$: to $${cz(p1[0], p1[1])}$ it is $\sqrt{${(p1[0] - z0[0]) ** 2} + ${p1[1] ** 2}}\approx${round(d1, 3)}$; to $${cz(fixed[0], fixed[1])}$ it is $\sqrt{${(fixed[0] - z0[0]) ** 2} + ${fixed[1] ** 2}}\approx${round(d2f, 3)}$. The smaller is ${round(v, 3)}.`,
          trap: 'The function is smooth on the whole real axis here, but the series still stops at the nearest COMPLEX pole.' };
      },
      verify: (p) => Math.min(Math.sqrt((p.p1[0] - p.z0[0]) ** 2 + p.p1[1] ** 2), Math.sqrt((p.p2[0] - p.z0[0]) ** 2 + p.p2[1] ** 2)) },
  ],
};
