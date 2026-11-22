// Round 5 extras for residues: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
import { simpson, frac } from './_more.js';
const R = String.raw;
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
// integral over the whole real line, mapped to (-pi/2, pi/2) by x = tan t
const realLine = (f) => simpson((t) => f(Math.tan(t)) / Math.cos(t) ** 2, -Math.PI / 2 + 1e-9, Math.PI / 2 - 1e-9, 4000);

export default {
  items: [
    { id: 'res-r5-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'simple poles',
      q: R`The residue of $\dfrac{e^{z}}{z - 2}$ at $z = 2$ is`,
      options: [R`$1$`, R`$e^2$`, R`$2e^2$`, R`$0$`], answer: 1,
      sol: R`At a simple pole $z_0$ of $g(z)/(z - z_0)$ with $g$ analytic, the residue is $g(z_0)$. Here $g = e^{z}$, so the residue is $e^2$.`,
      trap: R`The residue is the value of the rest of the function at the pole, not the coefficient 1 in front of $1/(z - 2)$.` },
    { id: 'res-r5-02', type: 'nat', level: 2, exams: ['jam'], sub: 'simple poles',
      q: R`The residue of $\dfrac{z^2 + 3}{z(z - 1)}$ at $z = 0$ is ______.`,
      answer: -3, tol: 0, calc: () => (0 + 3) / (0 - 1),
      sol: R`At the simple pole $z = 0$, cover up the factor $z$ and put $z = 0$ in what is left: $\frac{z^2 + 3}{z - 1}\big|_{z = 0} = \frac{3}{-1} = -3$. (At $z = 1$ the same method gives $\frac{4}{1} = 4$; the two residues add to 1, the residue sum of a function that behaves like $1 + 1/z$ for large $z$.)`,
      trap: R`Leaving out the factor $(z - 1) = -1$ gives $+3$.` },
    { id: 'res-r5-03', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'laurent series',
      q: R`The residue of $\dfrac{\sin z}{z^4}$ at $z = 0$ is`,
      options: [R`$\tfrac16$`, R`$0$`, R`$\tfrac1{24}$`, R`$-\tfrac16$`], answer: 3,
      sol: R`$\sin z = z - \frac{z^3}{6} + \frac{z^5}{120} - \dots$, so $\frac{\sin z}{z^4} = \frac1{z^3} - \frac{1}{6z} + \frac{z}{120} - \dots$. The coefficient of $1/z$ is $-\tfrac16$.`,
      trap: R`Dropping the minus sign of the $z^3$ term in the sine series gives $+\tfrac16$.` },
    { id: 'res-r5-04', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'simple poles', format: 'statements',
      q: R`For $f(z) = \tan z$, which statements are true?`,
      options: [R`Every pole of $\tan z$ is simple`, R`The residue at $z = \pi/2$ is $-1$`, R`$\displaystyle\oint_{|z| = 2}\tan z\,dz = -4\pi i$ (anticlockwise)`, R`$\tan z$ has a pole at $z = 0$`], answer: [0, 1, 2],
      sol: R`Poles are the zeros of $\cos z$, at $z = \frac\pi2 + n\pi$; each is a simple zero of $\cos$ (its derivative $-\sin z = \mp1\ne0$ there), so each pole is simple. Residue $= \frac{\sin z}{(\cos z)'} = \frac{\sin z}{-\sin z} = -1$ at every pole. Inside $|z| = 2$ lie $\pm\pi/2$ ($\approx\pm1.57$), so the integral is $2\pi i(-1 - 1) = -4\pi i$. At $z = 0$, $\tan z = 0$: a zero, not a pole.`,
      trap: R`Taking the residue of $\tan z$ as $+1$ forgets that the derivative of $\cos z$ is $-\sin z$.` },
    { id: 'res-r5-05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'real integrals',
      q: R`The value of $\displaystyle\int_{-\infty}^{\infty}\frac{x^2}{x^4 + 16}\,dx$ is ______ (three decimal places).`,
      answer: 1.111, tol: 0.002, calc: () => Math.PI / (2 * Math.SQRT2),
      sol: R`Close in the upper half-plane (the integrand falls like $1/x^2$). The poles there are $z_1 = 2e^{i\pi/4}$ and $z_2 = 2e^{3i\pi/4}$. At a simple root of $z^4 + 16$, $\text{Res}\frac{z^2}{z^4 + 16} = \frac{z^2}{4z^3} = \frac1{4z}$. Sum: $\frac14\left(\frac{1}{z_1} + \frac{1}{z_2}\right) = \frac18\left(e^{-i\pi/4} + e^{-3i\pi/4}\right) = \frac18(-i\sqrt2)$. Times $2\pi i$: $\frac{2\pi\sqrt2}{8} = \frac{\pi}{2\sqrt2}\approx1.111$.`,
      trap: R`Including the lower half-plane poles as well doubles the count and gives zero (the residues add to zero overall).` },
    { id: 'res-r5-06', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'trigonometric integrals',
      q: R`The value of $\displaystyle\int_0^{2\pi}\frac{d\theta}{(3 - 2\cos\theta)^2}$ is`,
      options: [R`$\dfrac{6\pi}{5\sqrt5}$`, R`$\dfrac{2\pi}{\sqrt5}$`, R`$\dfrac{3\pi}{5\sqrt5}$`, R`$\dfrac{2\pi}{5}$`], answer: 0,
      sol: R`Start from $I(a) = \int_0^{2\pi}\frac{d\theta}{a - b\cos\theta} = \frac{2\pi}{\sqrt{a^2 - b^2}}$ (unit circle, one pole inside). Differentiate in $a$: $\int_0^{2\pi}\frac{d\theta}{(a - b\cos\theta)^2} = -I'(a) = \frac{2\pi a}{(a^2 - b^2)^{3/2}}$. With $a = 3$, $b = 2$: $\frac{6\pi}{5^{3/2}} = \frac{6\pi}{5\sqrt5}\approx1.686$.`,
      trap: R`$\frac{2\pi}{\sqrt5}$ is the integral of the first power; squaring the denominator does not simply square the answer either.` },
    { id: 'res-r5-07', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'higher order poles',
      q: R`The value of $\displaystyle\int_{-\infty}^{\infty}\frac{dx}{(x^2 + 1)^3}$ is ______ (three decimal places).`,
      answer: 1.178, tol: 0.002, calc: () => 3 * Math.PI / 8,
      sol: R`Close upward; the only pole inside is $z = i$, of order 3. With $g(z) = (z + i)^{-3}$, the residue is $\frac{g''(i)}{2!} = \frac{12(2i)^{-5}}{2} = \frac{6}{32i} = \frac{3}{16i}$. Times $2\pi i$: $\frac{3\pi}{8}\approx1.178$.`,
      trap: R`Forgetting the $1/2!$ in the order-3 residue formula doubles the answer.` },
    { id: 'res-r5-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'laurent series',
      q: R`The residue of $\dfrac{\cot z}{z^2}$ at $z = 0$ is`,
      options: [R`$\tfrac13$`, R`$0$`, R`$-\tfrac13$`, R`$-\tfrac1{45}$`], answer: 2,
      sol: R`$\cot z = \frac1z - \frac z3 - \frac{z^3}{45} - \dots$, so $\frac{\cot z}{z^2} = \frac{1}{z^3} - \frac{1}{3z} - \frac{z}{45} - \dots$. The coefficient of $1/z$ is $-\tfrac13$.`,
      trap: R`$-\tfrac1{45}$ is the residue of $\cot z/z^4$; count the powers carefully.` },
    { id: 'res-r5-09', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'residue at infinity', format: 'statements',
      q: R`Let $n\ge2$ and $f(z) = \dfrac{1}{z^n - 1}$, with $\omega_k = e^{2\pi ik/n}$. Which statements are true?`,
      options: [R`The residue at $\omega_k$ is $\omega_k/n$`, R`The residues at the $n$ roots of unity add up to 0`, R`$\displaystyle\oint_{|z| = 2}f(z)\,dz = 0$`, R`The residue of $f$ at infinity is $-1$`], answer: [0, 1, 2],
      sol: R`At a simple pole, $\text{Res} = \frac{1}{(z^n - 1)'} = \frac{1}{n\omega_k^{n-1}} = \frac{\omega_k}{n\omega_k^n} = \frac{\omega_k}{n}$. The roots of unity add to 0 for $n\ge2$, so the residues add to 0, and the circle $|z| = 2$ encloses them all: the integral is 0. The residue at infinity is minus the sum of the finite residues, which is 0 (also seen from $f\sim z^{-n}$ with $n\ge2$: no $1/z$ term at infinity).`,
      trap: R`A residue at infinity of $-1$ belongs to functions behaving like $1/z$ for large $z$, which needs $n = 1$.` },
    { id: 'res-r5-10', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'fourier type integrals',
      q: R`The value of $\displaystyle\int_0^{\infty}\frac{\cos x}{(x^2 + 1)^2}\,dx$ is ______ (three decimal places).`,
      answer: 0.578, tol: 0.002, calc: () => Math.PI / (2 * Math.E),
      sol: R`The integrand is even, so it is half of $\text{Re}\int_{-\infty}^{\infty}\frac{e^{ix}}{(x^2 + 1)^2}dx$. Close upward (Jordan's lemma); the pole at $z = i$ is double. With $g = \frac{e^{iz}}{(z + i)^2}$: $g' = e^{iz}\frac{i(z + i) - 2}{(z + i)^3}$, and at $z = i$: $e^{-1}\frac{i\cdot2i - 2}{(2i)^3} = e^{-1}\frac{-4}{-8i} = \frac{1}{2ie}$. Times $2\pi i$: $\frac{\pi}{e}$. Half of it: $\frac{\pi}{2e}\approx0.578$.`,
      trap: R`Closing with $\cos z$ instead of $e^{iz}$ fails: $\cos z$ grows like $e^{|y|}$ in both half-planes.` },
  ],
  gens: [
    { id: 'res-r5g1', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'trigonometric integrals',
      make(r) {
        const a = int(r, 2, 5), b = int(r, 1, a - 1), sg = choose(r, [1, -1]);
        const v = 2 * Math.PI * a / (a * a - b * b) ** 1.5;
        return { q: R`Find $\displaystyle\int_0^{2\pi}\frac{d\theta}{(${a} ${sg > 0 ? '-' : '+'} ${b === 1 ? '' : b}\cos\theta)^2}$ (three decimal places).`,
          answer: round(v, 3), tol: Math.max(0.002, round(v * 0.002, 3)), a, b, sg,
          sol: R`Use $\int_0^{2\pi}\frac{d\theta}{a - b\cos\theta} = \frac{2\pi}{\sqrt{a^2 - b^2}}$ (from the one residue inside the unit circle with $z = e^{i\theta}$; the sign of $b$ does not matter, as $\theta\to\theta + \pi$ flips it). Differentiating in $a$ gives $\int_0^{2\pi}\frac{d\theta}{(a - b\cos\theta)^2} = \frac{2\pi a}{(a^2 - b^2)^{3/2}} = \frac{2\pi\cdot${a}}{${a * a - b * b}^{3/2}}\approx${round(v, 3)}$.`,
          trap: 'Squaring the first-power answer $2\\pi/\\sqrt{a^2 - b^2}$ is not the same as squaring the denominator.' };
      },
      verify: (p) => simpson((t) => 1 / (p.a - p.sg * p.b * Math.cos(t)) ** 2, 0, 2 * Math.PI, 4000) },
    { id: 'res-r5g2', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'laurent series',
      make(r) {
        const m = int(r, 0, 3), k = int(r, 1, 3);
        const num = (m % 2 ? -1 : 1) * k ** (2 * m), den = fact(2 * m);
        const show = ([n, d]) => `$${frac(n, d)}$`;
        const o = mcqOptions(r, [num, den], [[-num, den], [num * k, fact(2 * m + 1)], [num, fact(2 * m + 2)], [0, 1]], show);
        return { q: R`The residue of $\dfrac{\cos ${k === 1 ? '' : k}z}{z^{${2 * m + 1}}}$ at $z = 0$ is`, ...o,
          sol: R`$\cos(kz) = \sum_j\frac{(-1)^j(kz)^{2j}}{(2j)!}$. Dividing by $z^{${2 * m + 1}}$, the $1/z$ term comes from $j = ${m}$: coefficient $\frac{(-1)^{${m}}${k}^{${2 * m}}}{${2 * m}!} = ${frac(num, den)}$.`,
          trap: 'The sign alternates with each term of the cosine series; and the factorial goes with the power of $z$ that is picked out.' };
      } },
    { id: 'res-r5g3', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'real integrals',
      make(r) {
        const a = int(r, 1, 4), b0 = int(r, 1, 4), b = b0 === a ? 5 : b0;
        const v = Math.PI / (a + b);
        return { q: R`Find $\displaystyle\int_{-\infty}^{\infty}\frac{x^2\,dx}{(x^2 + ${a * a})(x^2 + ${b * b})}$ (three decimal places).`,
          answer: round(v, 3), tol: 0.002, a, b,
          sol: R`Close in the upper half-plane (the integrand falls like $1/x^2$). Simple poles at $i${a}$ and $i${b}$. With $a = ${a}$, $b = ${b}$: $\text{Res}_{ia} = \frac{(ia)^2}{2ia\,(b^2 - a^2)} = \frac{ia}{2(b^2 - a^2)}$ and likewise $\text{Res}_{ib} = \frac{ib}{2(a^2 - b^2)}$. Their sum is $\frac{i(a - b)}{2(b^2 - a^2)} = \frac{-i}{2(a + b)}$. Times $2\pi i$: $\frac{\pi}{a + b} = \frac{\pi}{${a + b}}\approx${round(v, 3)}$. (Partial fractions check: $\frac{x^2}{(x^2 + a^2)(x^2 + b^2)} = \frac{1}{b^2 - a^2}\left[\frac{b^2}{x^2 + b^2} - \frac{a^2}{x^2 + a^2}\right]$, integrating to $\frac{\pi(b - a)}{b^2 - a^2}$.)`,
          trap: 'Using $\\pi/(ab(a + b))$, the formula for the integrand without $x^2$ on top.' };
      },
      verify: (p) => realLine((x) => x * x / ((x * x + p.a * p.a) * (x * x + p.b * p.b))) },
  ],
};
