// Round 4 extras for complex-numbers: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const cstr = (a, b) => { // a + bi as TeX
  a = round(a, 3); b = round(b, 3);
  if (b === 0) return `${a}`;
  const bi = Math.abs(b) === 1 ? 'i' : `${Math.abs(b)}i`;
  if (a === 0) return `${b < 0 ? '-' : ''}${bi}`;
  return `${a} ${b < 0 ? '-' : '+'} ${bi}`;
};

export default {
  items: [
    { id: 'cx-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'geometry',
      q: R`For $z = 3 - 2i$, the number $iz$ is`,
      options: [R`$-2 + 3i$`, R`$2 + 3i$`, R`$3 + 2i$`, R`$2 - 3i$`], answer: 1,
      sol: R`$iz = 3i - 2i^2 = 2 + 3i$. Multiplying by $i$ turns the point $(3, -2)$ by $90^\circ$ anticlockwise about the origin, to $(2, 3)$; the length stays $\sqrt{13}$.`,
      trap: R`$i^2 = -1$ turns $-2i^2$ into $+2$.` },
    { id: 'cx-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'geometry',
      q: R`For all complex $z$ with $|z - 2i| \le 1$, the greatest and least values of $|z|$ are`,
      options: ['greatest 3, least 1', 'greatest 3, least 0', 'greatest 2, least 1', R`greatest $\sqrt5$, least 1`], answer: 0,
      sol: R`The region is a disc of radius 1 centred at $2i$, a distance 2 from the origin. The farthest point is $3i$ ($|z| = 3$) and the nearest is $i$ ($|z| = 1$), both on the line through the origin and the centre. In general $\big||c| - \rho\big| \le |z| \le |c| + \rho$.`,
      trap: R`The origin is not inside the disc, so the least value is not 0.` },
    { id: 'cx-r4-03', type: 'nat', level: 2, exams: ['jam'], sub: 'algebra',
      q: R`The imaginary part of $(1 + 2i)^3$ is ______.`,
      answer: -2, tol: 0, calc: () => { const s = [-3, 4]; return s[0] * 2 + s[1] * 1; },
      sol: R`$(1 + 2i)^2 = 1 + 4i + 4i^2 = -3 + 4i$. Then $(-3 + 4i)(1 + 2i) = -3 - 6i + 4i + 8i^2 = -11 - 2i$. Imaginary part $-2$. (Check: $|{-11 - 2i}|^2 = 125 = 5^3 = |1 + 2i|^6$.)`,
      trap: R`$8i^2 = -8$ belongs to the real part; it is easy to leave it in the imaginary part.` },
    { id: 'cx-r4-04', type: 'msq', level: 3, exams: ['jam'], sub: 'polar form', format: 'statements',
      q: R`A non-zero complex number satisfies $\bar z = -z$. Which statements are true?`,
      options: [R`$z^2$ is a negative real number`, R`$|z| = |\operatorname{Im}z|$`, R`$|e^{z}| = 1$`, R`$z + \bar z \ne 0$`], answer: [0, 1, 2],
      sol: R`$\bar z = -z$ means the real part is zero: $z = iy$ with $y \ne 0$. Then $z^2 = -y^2 < 0$, $|z| = |y|$, and $e^{iy}$ lies on the unit circle. But $z + \bar z = 2\operatorname{Re}z = 0$.`,
      trap: R`$\bar z = -z$ says "purely imaginary", so $z + \bar z$ vanishes.` },
    { id: 'cx-r4-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'phasors',
      q: R`A $2\ \Omega$ resistor is connected in parallel with an inductor of reactance $2\ \Omega$ (impedance $2i\ \Omega$). The impedance of the combination is`,
      options: [R`$(2 + 2i)\ \Omega$`, R`$(1 - i)\ \Omega$`, R`$\sqrt2\ \Omega$, purely resistive`, R`$(1 + i)\ \Omega$`], answer: 3,
      sol: R`$Z = \dfrac{Z_1Z_2}{Z_1 + Z_2} = \dfrac{2\cdot2i}{2 + 2i} = \dfrac{4i(2 - 2i)}{(2 + 2i)(2 - 2i)} = \dfrac{8 + 8i}{8} = 1 + i$ Ω. Its size is $\sqrt2$ Ω and the current through the pair lags the voltage by $45^\circ$: still inductive.`,
      trap: R`$2 + 2i$ is the series combination; $\sqrt2$ is only the modulus of the right answer.` },
    { id: 'cx-r4-06', type: 'mcq', level: 3, exams: ['jam'], sub: 'geometry',
      q: R`A square has consecutive corners $0$ and $2 + i$, and goes round anticlockwise. Its other two corners are`,
      options: [R`$-1 + 2i$ and $1 - 2i$`, R`$3 - i$ and $1 - 2i$`, R`$1 + 3i$ and $-1 + 2i$`, R`$1 + 3i$ and $3 + 2i$`], answer: 2,
      sol: R`The side from $0$ to $2 + i$, turned by $90^\circ$ anticlockwise, is $i(2 + i) = -1 + 2i$. Going round: $0 \to 2 + i \to (2 + i) + (-1 + 2i) = 1 + 3i \to -1 + 2i \to 0$. All sides have length $\sqrt5$.`,
      trap: R`Multiplying by $-i$ instead builds the square on the other (clockwise) side: $3 - i$ and $1 - 2i$.` },
    { id: 'cx-r4-07', type: 'nat', level: 3, exams: ['jam'], sub: 'geometry',
      q: R`For $z = 3 + 4i$, the triangle with corners $0$, $z$ and $iz$ has area ______.`,
      answer: 12.5, tol: 0.01, calc: () => 0.5 * 25,
      sol: R`$iz$ is $z$ turned by $90^\circ$, with the same length $|z| = 5$. So the triangle is right-angled at $0$ with both legs 5: area $\tfrac12\cdot5\cdot5 = 12.5$. (Check by coordinates: $iz = -4 + 3i$, and $\tfrac12|3\cdot3 - 4\cdot(-4)| = 12.5$.)`,
      trap: R`The area uses $|z|^2 = 25$, not $|z| = 5$.` },
    { id: 'cx-r4-08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'roots',
      q: R`Every root of $(z + 1)^5 = z^5$ has the same real part. Its value is ______.`,
      answer: -0.5, tol: 0.001, calc: () => -0.5,
      sol: R`Taking moduli, $|z + 1| = |z|$: $z$ is equally far from $0$ and $-1$, so it lies on the perpendicular bisector $\operatorname{Re}z = -\tfrac12$. (Explicitly, $(z + 1)/z = \omega^k$ with $\omega = e^{2\pi i/5}$, $k = 1, \dots, 4$, gives $z = 1/(\omega^k - 1) = -\tfrac12 - \tfrac i2\cot(\pi k/5)$.) The equation has only 4 roots, because the $z^5$ terms cancel.`,
      trap: R`It looks like a fifth-degree equation, but it has four roots.` },
    { id: 'cx-r4-09', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'hyperbolic functions', format: 'statements',
      q: R`For complex $z$, which statements are true?`,
      options: [R`$|\sin z| \le 1$ for every $z$`, R`$\sin z = 0$ only at $z = n\pi$ with $n$ an integer`, R`$e^z$ is never zero`, R`$e^z$ has period $2\pi i$`], answer: [1, 2, 3],
      sol: R`$\sin(iy) = i\sinh y$ grows without bound, so the first is false. $|\sin(x + iy)|^2 = \sin^2x + \sinh^2y$, which is zero only when $\sinh y = 0$ and $\sin x = 0$: $z = n\pi$, no new complex zeros. $|e^z| = e^{\operatorname{Re}z} > 0$. $e^{z + 2\pi i} = e^ze^{2\pi i} = e^z$.`,
      trap: R`The bound $|\sin| \le 1$ holds only on the real axis.` },
    { id: 'cx-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'series',
      q: R`Using $-\operatorname{Log}(1 - w) = \displaystyle\sum_{k\ge1}\frac{w^k}{k}$ for $|w| \le 1$, $w \ne 1$, the value of $\displaystyle\sum_{k=1}^{\infty}\frac{\cos(2\pi k/3)}{k}$ is ______ (to three decimal places).`,
      answer: -0.549, tol: 0.002, calc: () => -Math.log(Math.sqrt(3)),
      sol: R`Put $w = e^{i\theta}$ with $\theta = 2\pi/3$ and take real parts: $\sum\cos k\theta/k = -\ln|1 - e^{i\theta}|$. Now $|1 - e^{i\theta}| = 2\sin(\theta/2) = 2\sin60^\circ = \sqrt3$. So the sum is $-\ln\sqrt3 = -0.549$. (The terms run $-\tfrac12, -\tfrac14, +\tfrac13, -\tfrac18, \dots$; the series converges, slowly.)`,
      trap: R`Only the modulus of $1 - w$ enters the real part; its argument gives the matching sine series.` },
  ],
  gens: [
    { id: 'cx-r4g1', type: 'nat', level: 3, exams: ['jam'], sub: 'geometry',
      make(r) {
        const a = [int(r, -4, 4), int(r, -4, 4)], b = [int(r, -4, 4), int(r, -4, 4)], c = [int(r, -4, 4), int(r, -4, 4)];
        const u = [b[0] - a[0], b[1] - a[1]], v = [c[0] - a[0], c[1] - a[1]], im = u[0] * v[1] - u[1] * v[0];
        const answer = Math.abs(im) / 2;
        return { q: R`Find the area of the triangle with corners $${cstr(...a)}$, $${cstr(...b)}$ and $${cstr(...c)}$ in the complex plane.`,
          answer, tol: 0, a, b, c,
          sol: R`With $u = z_2 - z_1 = ${cstr(...u)}$ and $v = z_3 - z_1 = ${cstr(...v)}$, the area is $\tfrac12|\operatorname{Im}(\bar u\,v)| = \tfrac12|${u[0]}\cdot${v[1] < 0 ? `(${v[1]})` : v[1]} - ${u[1] < 0 ? `(${u[1]})` : u[1]}\cdot${v[0] < 0 ? `(${v[0]})` : v[0]}| = ${answer}$.${answer === 0 ? ' The three points lie on one line.' : ''}`,
          trap: '$\\operatorname{Im}(\\bar uv)$ is the 2D cross product; halve it for a triangle.' };
      },
      verify: (p) => Math.abs((p.b[0] - p.a[0]) * (p.c[1] - p.a[1]) - (p.b[1] - p.a[1]) * (p.c[0] - p.a[0])) / 2 },
    { id: 'cx-r4g2', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'series',
      make(r) {
        const [m, N] = choose(r, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 6], [5, 6], [1, 5], [2, 5]]), th = 2 * Math.PI * m / N;
        const sine = r() < 0.5;
        const answer = round(sine ? (Math.PI - th) / 2 : -Math.log(2 * Math.sin(th / 2)), 4);
        const g = (x, y) => (y ? g(y, x % y) : x), gg = g(2 * m, N), num = 2 * m / gg, den = N / gg;
        const lab = den === 1 ? `${num === 1 ? '' : num}\\pi` : `\\tfrac{${num === 1 ? '' : num}\\pi}{${den}}`, fn = sine ? '\\sin' : '\\cos';
        return { q: R`Using $-\operatorname{Log}(1 - e^{i\theta}) = \displaystyle\sum_{k\ge1}\frac{e^{ik\theta}}{k}$ ($0 < \theta < 2\pi$), find $\displaystyle\sum_{k=1}^{\infty}\frac{${fn}(k\theta)}{k}$ for $\theta = ${lab}$ (to four decimal places).`,
          answer: answer === 0 ? 0 : answer, tol: 0.0005, m, N, sine,
          sol: R`$1 - e^{i\theta} = -2i\sin(\theta/2)\,e^{i\theta/2} = 2\sin(\theta/2)\,e^{i(\theta - \pi)/2}$. So $-\operatorname{Log}(1 - e^{i\theta}) = -\ln(2\sin\tfrac\theta2) + i\,\dfrac{\pi - \theta}{2}$. ${sine ? R`The imaginary part gives $\sum\sin k\theta/k = (\pi - \theta)/2$` : R`The real part gives $\sum\cos k\theta/k = -\ln(2\sin\tfrac\theta2)$`} $= ${answer === 0 ? 0 : answer}$.`,
          trap: 'Real part for the cosine sum, imaginary part for the sine sum.' };
      },
      verify: (p) => { const th = 2 * Math.PI * p.m / p.N; return p.sine ? (Math.PI - th) / 2 : -Math.log(2 * Math.sin(th / 2)); } },
    { id: 'cx-r4g3', type: 'mcq', level: 3, exams: ['jam'], sub: 'phasors',
      make(r) {
        const Rr = choose(r, [1, 2, 3, 4, 5, 6]), X = choose(r, [1, 2, 3, 4, 6, -1, -2, -3, -4]), d = Rr * Rr + X * X;
        const re = Rr * X * X / d, im = Rr * Rr * X / d;
        const show = ([a, b]) => `$(${cstr(a, b)})\\ \\Omega$`;
        const { options, answer } = mcqOptions(r, show([re, im]), [show([Rr, X]), show([Rr / 2, X / 2]), show([re, -im]), show([im, re])]);
        return { q: R`A ${Rr} Ω resistor is connected in parallel with ${X > 0 ? 'an inductor' : 'a capacitor'} of impedance $${cstr(0, X)}\ \Omega$. The impedance of the combination is`,
          options, answer,
          sol: R`$Z = \dfrac{R\cdot iX}{R + iX} = \dfrac{iRX(R - iX)}{R^2 + X^2} = \dfrac{RX^2 + iR^2X}{R^2 + X^2} = \dfrac{${Rr * X * X} ${X < 0 ? '-' : '+'} ${Math.abs(Rr * Rr * X)}i}{${d}} = ${cstr(re, im)}$ Ω.`,
          trap: 'Parallel impedances combine as product over sum, with complex arithmetic; the reactive part keeps its sign.' };
      },
      verify: (p) => p.answer },
  ],
};
