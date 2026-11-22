// Round 4 extras for residues: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
import { simpson } from './_more.js';
const R = String.raw;

export default {
  items: [
    { id: 'res-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'computing residues',
      q: R`The residue of $\dfrac{z + 1}{z - 2}$ at $z = 2$ is`,
      options: [R`$1$`, R`$3$`, R`$2$`, R`$0$`], answer: 1,
      sol: R`At a simple pole $z_0$, $\text{Res} = \lim_{z\to z_0}(z - z_0)f(z)$. Here that is the numerator at $z = 2$: $2 + 1 = 3$.`,
      trap: R`The residue is the value of the rest of the function at the pole, not the coefficient 1 in front of $z$.` },
    { id: 'res-r4-02', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'computing residues',
      q: R`The residue of $\dfrac{e^{2z}}{(z - 1)^2}$ at $z = 1$ is ______ (two decimal places).`,
      answer: 14.78, tol: 0.02, calc: () => 2 * Math.exp(2),
      sol: R`For a pole of order 2, $\text{Res} = \lim_{z\to1}\frac{d}{dz}\left[(z - 1)^2f(z)\right] = \frac{d}{dz}e^{2z}\Big|_{z=1} = 2e^2\approx14.78$.`,
      trap: R`Evaluating $e^{2z}$ at the pole ($e^2\approx7.39$) treats a double pole as a simple one.` },
    { id: 'res-r4-03', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'computing residues',
      q: R`The residue of $\dfrac{1}{\sin z}$ at $z = \pi$ is`,
      options: [R`$1$`, R`$\pi$`, R`$0$`, R`$-1$`], answer: 3,
      sol: R`$\sin z$ has a simple zero at $\pi$, so for $p/q$ with $q(\pi) = 0$, $q'(\pi)\ne0$: $\text{Res} = \frac{1}{\cos\pi} = -1$. (Near $\pi$, $\sin z = -(z - \pi) + \dots$)`,
      trap: R`Copying the residue at $z = 0$ (which is $+1$) to every zero of $\sin z$; the sign alternates.` },
    { id: 'res-r4-04', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'trigonometric integrals',
      q: R`The value of $\displaystyle\int_0^{2\pi}\frac{\cos\theta}{5 + 3\cos\theta}\,d\theta$ is ______ (three decimal places).`,
      answer: -0.524, tol: 0.002, calc: () => -Math.PI / 6,
      sol: R`Write $\frac{\cos\theta}{5 + 3\cos\theta} = \frac13\left(1 - \frac{5}{5 + 3\cos\theta}\right)$. With the standard result $\int_0^{2\pi}\frac{d\theta}{a + b\cos\theta} = \frac{2\pi}{\sqrt{a^2 - b^2}}$ (from $z = e^{i\theta}$ and the residue inside $|z| = 1$): $\int\frac{d\theta}{5 + 3\cos\theta} = \frac{2\pi}{4} = \frac\pi2$. So the integral is $\frac13\left(2\pi - \frac{5\pi}{2}\right) = -\frac\pi6\approx-0.524$.`,
      trap: R`The answer is negative: the integrand is largest in size where $\cos\theta < 0$ and the denominator is small.` },
    { id: 'res-r4-05', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'rational integrals',
      q: R`The value of $\displaystyle\int_{-\infty}^{\infty}\frac{x^2}{(x^2 + 1)^2}\,dx$ is`,
      options: [R`$\dfrac\pi2$`, R`$\dfrac\pi4$`, R`$\pi$`, R`$2\pi$`], answer: 0,
      sol: R`Close in the upper half-plane (the integrand falls as $1/x^2$). The only pole there is $z = i$, of order 2. $\text{Res} = \frac{d}{dz}\frac{z^2}{(z + i)^2}\Big|_{z=i} = \frac{2iz}{(z + i)^3}\Big|_{z=i} = \frac{-2}{-8i} = \frac{1}{4i}$. Integral $= 2\pi i\cdot\frac1{4i} = \frac\pi2$. Check: $\int\frac{dx}{x^2 + 1} - \int\frac{dx}{(x^2 + 1)^2} = \pi - \frac\pi2$.`,
      trap: R`Treating $z = i$ as a simple pole gives a wrong residue; differentiate once for a double pole.` },
    { id: 'res-r4-06', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'classifying poles', format: 'statements',
      q: R`For $f(z) = \dfrac{z}{1 - \cos z}$, which statements are true?`,
      options: [R`$z = 0$ is a simple pole with residue 2`, R`$z = 0$ is a pole of order 2`, R`$z = 2\pi$ is a pole of order 2`, R`The residue at $z = 2\pi$ is $2\pi$`], answer: [0, 2],
      sol: R`$1 - \cos w = \frac{w^2}{2}\left(1 - \frac{w^2}{12} + \dots\right)$, so $\frac{1}{1 - \cos w} = \frac{2}{w^2} + \frac16 + \dots$ (no $1/w$ term, as it is even). At $z = 0$: $f = z\left(\frac2{z^2} + \frac16 + \dots\right) = \frac2z + \dots$, a simple pole with residue 2 (the numerator's zero lowers the order). At $z = 2\pi$, with $w = z - 2\pi$: $f = (2\pi + w)\left(\frac2{w^2} + \frac16 + \dots\right) = \frac{4\pi}{w^2} + \frac{2}{w} + \dots$: a double pole with residue 2, not $2\pi$.`,
      trap: R`At a double pole the residue comes from the derivative of the numerator, not from the numerator's value.` },
    { id: 'res-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Fourier-type integrals',
      q: R`The value of $\displaystyle\int_{-\infty}^{\infty}\frac{\cos x}{(x^2 + 1)(x^2 + 4)}\,dx$ is ______ (three decimal places).`,
      answer: 0.314, tol: 0.002, calc: () => (Math.PI / 3) * (Math.exp(-1) - Math.exp(-2) / 2),
      sol: R`Partial fractions: $\frac{1}{(x^2 + 1)(x^2 + 4)} = \frac13\left(\frac{1}{x^2 + 1} - \frac{1}{x^2 + 4}\right)$. For $a > 0$, $\int\frac{\cos x}{x^2 + a^2}dx = \text{Re}\,2\pi i\,\text{Res}_{z = ia}\frac{e^{iz}}{z^2 + a^2} = \frac{\pi e^{-a}}{a}$ (close upward, since $e^{iz}$ decays there). So the integral is $\frac\pi3\left(e^{-1} - \frac{e^{-2}}{2}\right)\approx0.314$.`,
      trap: R`Using $\cos z$ instead of $e^{iz}$ on the contour fails: $\cos z$ grows in both half-planes.` },
    { id: 'res-r4-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'summing series',
      q: R`The sum $\displaystyle\sum_{n=-\infty}^{\infty}\frac{1}{(n + \frac12)^2}$ equals`,
      options: [R`$\dfrac{\pi^2}{2}$`, R`$\pi^2$`, R`$\dfrac{\pi^2}{4}$`, R`$2\pi^2$`], answer: 1,
      sol: R`Sum the residues of $\pi\cot(\pi z)\,g(z)$ with $g = 1/(z + \frac12)^2$: the poles at integers give $\sum g(n)$, and the double pole at $z = -\frac12$ gives $\frac{d}{dz}\pi\cot\pi z\big|_{-1/2} = -\pi^2\csc^2(-\pi/2) = -\pi^2$. The total vanishes, so the sum is $\pi^2$. (General: $\sum_n\frac{1}{(n + a)^2} = \frac{\pi^2}{\sin^2\pi a}$.) Check: it is $2\cdot4\sum_{k\ge0}\frac{1}{(2k + 1)^2} = 8\cdot\frac{\pi^2}{8}$.`,
      trap: R`Summing only $n\ge0$ gives $\pi^2/2$; the sum here runs over all integers.` },
    { id: 'res-r4-09', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'computing residues',
      q: R`Which of these functions have residue 0 at $z = 0$?`,
      options: [R`$\dfrac{1}{z^2}$`, R`$\dfrac{\sin z}{z^4}$`, R`$\dfrac{\cot z}{z}$`, R`$\dfrac{1 - \cos z}{z^3}$`], answer: [0, 2],
      sol: R`Find the $1/z$ coefficient of each Laurent series. $1/z^2$: none, residue 0. $\frac{\sin z}{z^4} = \frac{1}{z^3} - \frac{1}{6z} + \dots$: residue $-\tfrac16$. $\cot z = \frac1z - \frac z3 - \dots$, so $\frac{\cot z}{z} = \frac{1}{z^2} - \frac13 - \dots$: residue 0 (it is even). $\frac{1 - \cos z}{z^3} = \frac{z^2/2 - z^4/24 + \dots}{z^3} = \frac{1}{2z} - \dots$: residue $\tfrac12$.`,
      trap: R`A pole with zero residue is still a pole: residue 0 does not mean the function is analytic there.` },
    { id: 'res-r4-10', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'logarithmic integrals',
      q: R`The value of $\displaystyle\int_0^{\infty}\frac{\ln x}{(1 + x^2)^2}\,dx$ is ______ (three decimal places).`,
      answer: -0.785, tol: 0.002, calc: () => -Math.PI / 4,
      sol: R`Let $I(a) = \int_0^\infty\frac{x^{a}}{1 + x^2}dx = \frac{\pi}{2\cos(\pi a/2)}$ for $|a| < 1$ (keyhole contour). Then $J(a) = \int_0^\infty\frac{x^a}{(1 + x^2)^2}dx$ satisfies $J = I - \int\frac{x^{a+2}}{(1 + x^2)^2}$, and integrating by parts gives $J(a) = \frac{1 - a}{2}I(a)$. Differentiate at $a = 0$: $J'(0) = \frac12I'(0) - \frac12I(0) = 0 - \frac\pi4$, since $I'(0) = 0$ ($I$ is even in $a$). So the integral is $-\pi/4\approx-0.785$. (A rectangle or semicircle contour with $\ln z$ gives the same.)`,
      trap: R`The substitution $x\to1/x$ makes $\int\frac{\ln x}{1 + x^2}dx = 0$, but the squared denominator breaks that symmetry; the answer is not 0.` },
    { id: 'res-r4-11', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'principal value',
      q: R`The Cauchy principal value of $\displaystyle\int_{-\infty}^{\infty}\frac{\sin x}{x - 1}\,dx$ is`,
      options: [R`$\pi\sin1$`, R`$-\pi\sin1$`, R`$\pi\cos1$`, R`$\pi$`], answer: 2,
      sol: R`Shift $x = 1 + t$: $\sin(1 + t) = \sin1\cos t + \cos1\sin t$. The principal value of $\int\frac{\cos t}{t}dt$ is 0 (odd integrand), and $\int\frac{\sin t}{t}dt = \pi$. So the result is $\pi\cos1$. With contours: $\text{PV}\int\frac{e^{ix}}{x - 1}dx = i\pi e^{i}$ (half the residue for a pole on the path), whose imaginary part is $\pi\cos1$.`,
      trap: R`Taking the real part of $i\pi e^i$ gives $-\pi\sin1$, the principal value of the cosine integral.` },
    { id: 'res-r4-12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'residue theorem',
      q: R`The value of $\dfrac{1}{2\pi i}\displaystyle\oint_{|z| = 4}\frac{dz}{z^2\sin z}$ (anticlockwise) is ______ (four decimal places).`,
      answer: -0.036, tol: 0.0005, calc: () => 1 / 6 - 2 / Math.PI ** 2,
      sol: R`Inside $|z| = 4$ the poles are $z = 0$ and $z = \pm\pi$ ($2\pi > 4$ is outside). At 0: $\frac{1}{z^2\sin z} = \frac{1}{z^3}\left(1 + \frac{z^2}{6} + \dots\right)$, residue $\tfrac16$. At $\pm\pi$ (simple zeros of $\sin z$): residue $\frac{1}{z^2\cos z} = \frac{1}{\pi^2(-1)} = -\frac1{\pi^2}$ each. Sum: $\frac16 - \frac{2}{\pi^2}\approx-0.0360$.`,
      trap: R`Forgetting the poles at $\pm\pi$ gives $\tfrac16$; they lie inside the circle of radius 4.` },
  ],
  gens: [
    { id: 'res-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'rational integrals',
      make(r) {
        const a = int(r, 1, 3), b = a + int(r, 1, 3), v = Math.PI / (a * b * (a + b));
        return { q: R`The value of $\displaystyle\int_{-\infty}^{\infty}\frac{dx}{(x^2 + ${a * a})(x^2 + ${b * b})}$ is ______ (four decimal places).`,
          answer: round(v, 4), tol: Math.max(0.0002, round(v * 0.003, 4)), a, b,
          sol: R`Close in the upper half-plane; the poles there are $z = ${a === 1 ? '' : a}i$ and $z = ${b}i$. Residues: at $${a === 1 ? '' : a}i$, $\frac{1}{2(${a})i\,(${b * b} - ${a * a})}$; at $${b}i$, $\frac{1}{2(${b})i\,(${a * a} - ${b * b})}$. Times $2\pi i$ and added: $\frac{\pi}{${b * b - a * a}}\left(\frac1{${a}} - \frac1{${b}}\right) = \frac{\pi}{${a}\cdot${b}\cdot(${a} + ${b})} = \frac{\pi}{${a * b * (a + b)}}\approx${round(v, 4)}$. (Equivalently, partial fractions and $\int\frac{dx}{x^2 + c^2} = \frac\pi c$.)`,
          trap: 'Including the lower half-plane poles as well doubles-counts; close the contour on one side only.' };
      },
      verify: (p) => simpson((t) => { const c = Math.cos(t), s = Math.sin(t); return (c * c) / ((s * s + p.a * p.a * c * c) * (s * s + p.b * p.b * c * c)); }, -Math.PI / 2, Math.PI / 2, 4000) },
    { id: 'res-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'trigonometric integrals',
      make(r) {
        const [a, b] = choose(r, [[2, 1], [3, 1], [3, 2], [4, 1], [5, 3], [5, 4], [4, 3], [5, 2]]), sg = choose(r, [1, -1]);
        const v = (2 * Math.PI * a) / (a * a - b * b) ** 1.5;
        return { q: R`The value of $\displaystyle\int_0^{2\pi}\frac{d\theta}{(${a} ${sg > 0 ? '+' : '-'} ${b === 1 ? '' : b}\cos\theta)^2}$ is ______ (three decimal places).`,
          answer: round(v, 3), tol: Math.max(0.002, round(v * 0.002, 3)), a, b: sg * b,
          sol: R`Start from $F(a) = \int_0^{2\pi}\frac{d\theta}{a + b\cos\theta} = \frac{2\pi}{\sqrt{a^2 - b^2}}$ ($a > |b|$; from $z = e^{i\theta}$ and the one residue inside $|z| = 1$). Differentiating under the integral, $\int_0^{2\pi}\frac{d\theta}{(a + b\cos\theta)^2} = -F'(a) = \frac{2\pi a}{(a^2 - b^2)^{3/2}}$. The sign of $b$ does not matter (shift $\theta$ by $\pi$). With $a = ${a}$, $|b| = ${b}$: $\frac{2\pi\cdot${a}}{${a * a - b * b}^{3/2}}\approx${round(v, 3)}$.`,
          trap: 'Squaring the first-power result, $(2\\pi)^2/(a^2 - b^2)$, is wrong: the square of an integral is not the integral of the square.' };
      },
      verify: (p) => simpson((t) => 1 / (p.a + p.b * Math.cos(t)) ** 2, 0, 2 * Math.PI, 4000) },
    { id: 'res-r4g3', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'computing residues',
      make(r) {
        const c = choose(r, [2, 3, -2, -3]), m = int(r, 1, 3);
        const fr = (num, den) => { const s = num * den < 0 ? '-' : ''; return `$${s}\\tfrac{${Math.abs(num)}}{${Math.abs(den)}}$`; };
        const correct = fr(-1, c ** m);
        const wrongs = [fr(1, c ** m), fr(-1, c ** (m + 1)), fr(1, c ** (m + 1)), fr(-1, c ** (m - 1) * (m === 1 ? 2 : 1))];
        const opts = mcqOptions(r, correct, wrongs, (s) => s);
        const zc = c < 0 ? `z + ${-c}` : `z - ${c}`;
        return { q: R`The residue of $f(z) = \dfrac{1}{${m === 1 ? 'z' : `z^{${m}}`}(${zc})}$ at $z = 0$ is`, ...opts,
          sol: R`Near $z = 0$, $\frac{1}{${zc}} = -\frac{1}{${c < 0 ? `(${c})` : c}}\cdot\frac{1}{1 - z/(${c})} = -\frac1{${c < 0 ? `(${c})` : c}}\sum_{k\ge0}\frac{z^k}{(${c})^k}$. Dividing by $z^{${m}}$, the $1/z$ term comes from $k = ${m - 1}$: coefficient $-\frac{1}{(${c})^{${m}}} = ${correct.slice(1, -1)}$. Check: the residue at $z = ${c}$ is $\frac1{(${c})^{${m}}}$, and the residues of a rational function that falls like $1/z^2$ or faster add up to zero.`,
          trap: 'Taking the residue at the other pole ($z = c$) instead, which has the opposite sign.' };
      } },
  ],
};
