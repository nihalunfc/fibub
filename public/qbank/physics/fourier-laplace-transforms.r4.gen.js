// Round 4 extras for fourier-laplace-transforms: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
import { simpson, rk4 } from './_more.js';
const R = String.raw;

export default {
  items: [
    { id: 'flt-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'Laplace pairs',
      q: R`The Laplace transform of the constant function $f(t) = 5$ (for $t > 0$) is`,
      options: [R`$5$`, R`$\dfrac5s$`, R`$5s$`, R`$\dfrac{5}{s^2}$`], answer: 1,
      sol: R`$\int_0^\infty5e^{-st}dt = 5\left[-\frac{e^{-st}}{s}\right]_0^\infty = \frac5s$ for $s > 0$.`,
      trap: R`$5/s^2$ is the transform of $5t$.` },
    { id: 'flt-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'shifting theorem',
      q: R`The Laplace transform of $e^{-3t}\cos2t$ is`,
      options: [R`$\dfrac{s - 3}{(s - 3)^2 + 4}$`, R`$\dfrac{2}{(s + 3)^2 + 4}$`, R`$\dfrac{s + 3}{(s + 3)^2 + 4}$`, R`$\dfrac{s}{(s + 3)^2 + 4}$`], answer: 2,
      sol: R`$\mathcal L\{\cos2t\} = \frac{s}{s^2 + 4}$, and multiplying by $e^{-3t}$ replaces $s$ by $s + 3$ everywhere: $\frac{s + 3}{(s + 3)^2 + 4}$.`,
      trap: R`Shifting only the denominator gives $\frac{s}{(s + 3)^2 + 4}$; the numerator's $s$ shifts too.` },
    { id: 'flt-r4-03', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'Laplace pairs',
      q: R`The Laplace transform of $\sin^2t$, evaluated at $s = 1$, is ______ (one decimal place).`,
      answer: 0.4, tol: 0.01, calc: () => 1 / 2 - 1 / (2 * 5),
      sol: R`$\sin^2t = \tfrac12(1 - \cos2t)$, so $\mathcal L\{\sin^2t\} = \frac1{2s} - \frac{s}{2(s^2 + 4)} = \frac{2}{s(s^2 + 4)}$. At $s = 1$: $\frac{2}{5} = 0.4$.`,
      trap: R`Squaring the transform of $\sin t$, $1/(s^2 + 1)^2 = 0.25$: the transform of a product is not the product of transforms.` },
    { id: 'flt-r4-04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Fourier rules',
      q: R`With $\tilde f(k) = \int_{-\infty}^{\infty}f(x)e^{-ikx}dx$, the transform of $f(x)\cos k_0x$ is`,
      options: [R`$\tfrac12\left[\tilde f(k - k_0) + \tilde f(k + k_0)\right]$`, R`$\tilde f(k - k_0) + \tilde f(k + k_0)$`, R`$\tfrac12\left[\tilde f(k - k_0) - \tilde f(k + k_0)\right]$`, R`$\tilde f(k)\cos k_0$`], answer: 0,
      sol: R`$\cos k_0x = \tfrac12(e^{ik_0x} + e^{-ik_0x})$, and $\int f(x)e^{ik_0x}e^{-ikx}dx = \tilde f(k - k_0)$. So the spectrum splits into two half-height copies centred at $\pm k_0$ (amplitude modulation).`,
      trap: R`Dropping the $\tfrac12$ from the cosine's exponential form doubles the answer.` },
    { id: 'flt-r4-05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'inverse Laplace', format: 'integer',
      q: R`If $\mathcal L\{f\} = \dfrac{1}{s(s^2 + 1)}$, the value of $f(\pi)$ is ______.`,
      answer: 2, tol: 0, calc: () => 1 - Math.cos(Math.PI),
      sol: R`Partial fractions: $\frac{1}{s(s^2 + 1)} = \frac1s - \frac{s}{s^2 + 1}$, so $f(t) = 1 - \cos t$. (Or: dividing by $s$ integrates $\sin t$ from 0.) At $t = \pi$: $1 - (-1) = 2$.`,
      trap: R`$f = \sin t$ would come from $1/(s^2 + 1)$ alone; the extra $1/s$ integrates it.` },
    { id: 'flt-r4-06', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Fourier existence',
      q: R`Which of these functions are absolutely integrable on the whole real line (so their Fourier transforms exist as ordinary integrals)?`,
      options: [R`$e^{-|x|}$`, R`$\dfrac{1}{1 + x^2}$`, R`$\dfrac{\sin x}{x}$`, R`$xe^{-x^2}$`], answer: [0, 1, 3],
      sol: R`$\int e^{-|x|}dx = 2$, $\int\frac{dx}{1 + x^2} = \pi$ and $\int|x|e^{-x^2}dx = 1$ are finite. But $\int\left|\frac{\sin x}{x}\right|dx$ diverges like $\sum\frac{2}{\pi n}$ (each hump has area about $2/(n\pi)$). The sinc function is square-integrable, and its transform (a box) exists in the $L^2$ sense, but not as an absolutely convergent integral.`,
      trap: R`$\int\frac{\sin x}{x}dx = \pi$ converges, but only conditionally; absolute integrability needs $\int|f| < \infty$.` },
    { id: 'flt-r4-07', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'Laplace and ODEs',
      q: R`Solve $y'' + 4y = \sin2t$ with $y(0) = 0$, $y'(0) = 0$ by Laplace transforms. The value of $y(\pi)$ is ______ (three decimal places).`,
      answer: -0.785, tol: 0.002, calc: () => (Math.sin(2 * Math.PI) - 2 * Math.PI * Math.cos(2 * Math.PI)) / 8,
      sol: R`Transforming, $(s^2 + 4)Y = \frac{2}{s^2 + 4}$, so $Y = \frac{2}{(s^2 + 4)^2}$. Using $\mathcal L\{\sin at - at\cos at\} = \frac{2a^3}{(s^2 + a^2)^2}$ with $a = 2$ ($2a^3 = 16$): $y = \tfrac18(\sin2t - 2t\cos2t)$. At $t = \pi$: $\tfrac18(0 - 2\pi) = -\pi/4\approx-0.785$. The $t\cos2t$ term grows without bound: resonance.`,
      trap: R`A double pole at $s = \pm2i$ means a secular term $t\cos2t$; a plain $\sin2t$ answer misses it.` },
    { id: 'flt-r4-08', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'spectra',
      q: R`With $\tilde f(k) = \int f(x)e^{-ikx}dx$, the magnitude $|\tilde f(k)|$ of $f(x) = e^{-x^2/2}\cos5x$ has its peaks at`,
      options: [R`$k = 0$ only`, R`$k = \pm5$`, R`$k = \pm\tfrac52$`, R`$k = \pm10$`], answer: 1,
      sol: R`$\mathcal F\{e^{-x^2/2}\} = \sqrt{2\pi}\,e^{-k^2/2}$, peaked at $k = 0$. Multiplying by $\cos5x$ shifts half of it to $k = 5$ and half to $k = -5$: $\tilde f = \sqrt{\pi/2}\left[e^{-(k-5)^2/2} + e^{-(k+5)^2/2}\right]$. The two Gaussians barely overlap (width 1, separation 10), so the peaks are at $\pm5$.`,
      trap: R`Thinking the envelope's peak at $k = 0$ survives: modulation moves the whole spectrum.` },
    { id: 'flt-r4-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'poles and behaviour', format: 'statements',
      q: R`$f(t)$ has Laplace transform $F(s) = \dfrac{1}{(s + 1)(s - 2)}$. Which statements are true?`,
      options: [R`The defining integral converges for $\text{Re}\,s > 2$`, R`$f(t)$ grows like $e^{2t}$ for large $t$`, R`$f(0^+) = 0$`, R`The final value theorem gives $\lim_{t\to\infty}f(t) = \lim_{s\to0}sF(s) = 0$`], answer: [0, 1, 2],
      sol: R`Partial fractions: $F = \frac13\left(\frac{1}{s - 2} - \frac{1}{s + 1}\right)$, so $f = \tfrac13(e^{2t} - e^{-t})$. It grows like $e^{2t}$, so its transform exists only for $\text{Re}\,s > 2$ (right of the rightmost pole). $f(0) = 0$, matching the initial value theorem $\lim_{s\to\infty}sF = 0$. The final value theorem needs every pole of $sF$ in the left half-plane; the pole at $s = 2$ breaks it, and indeed $f\to\infty$, not 0.`,
      trap: R`Applying the final value theorem blindly: it gives a finite number even when $f$ blows up.` },
    { id: 'flt-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'Fourier pairs',
      q: R`For $a > 0$ and $\tilde f(k) = \int f(x)e^{-ikx}dx$, the transform of the Lorentzian $f(x) = \dfrac{1}{x^2 + a^2}$ is`,
      options: [R`$\pi e^{-a|k|}$`, R`$\dfrac{2a}{a^2 + k^2}$`, R`$\dfrac{\pi}{a}e^{-a^2k^2}$`, R`$\dfrac{\pi}{a}e^{-a|k|}$`], answer: 3,
      sol: R`For $k > 0$ close in the lower half-plane (where $e^{-ikz}$ decays), picking up the pole $z = -ia$ clockwise: $-2\pi i\cdot\frac{e^{-ik(-ia)}}{-2ia} = \frac\pi ae^{-ak}$. For $k < 0$ close upward to get $\frac\pi ae^{ak}$. Together $\frac\pi ae^{-a|k|}$. Check: at $k = 0$ it gives $\int\frac{dx}{x^2 + a^2} = \pi/a$. It is the dual of $e^{-a|x|}\leftrightarrow\frac{2a}{a^2 + k^2}$.`,
      trap: R`$\frac{2a}{a^2 + k^2}$ is the transform in the other direction (of $e^{-a|x|}$).` },
    { id: 'flt-r4-11', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Laplace rules',
      q: R`Using $\mathcal L\left\{\dfrac{f(t)}{t}\right\} = \displaystyle\int_s^\infty F(\sigma)\,d\sigma$, the value of $\displaystyle\int_0^\infty\frac{e^{-t} - e^{-3t}}{t}\,dt$ is ______ (three decimal places).`,
      answer: 1.099, tol: 0.002, calc: () => Math.log(3),
      sol: R`With $f = e^{-t} - e^{-3t}$, $F(\sigma) = \frac{1}{\sigma + 1} - \frac{1}{\sigma + 3}$. The required integral is the transform of $f/t$ at $s = 0$: $\int_0^\infty\left(\frac{1}{\sigma + 1} - \frac1{\sigma + 3}\right)d\sigma = \left[\ln\frac{\sigma + 1}{\sigma + 3}\right]_0^\infty = 0 - \ln\tfrac13 = \ln3\approx1.099$.`,
      trap: R`Splitting into $\int e^{-t}/t - \int e^{-3t}/t$ gives two divergent integrals; only the difference is finite.` },
    { id: 'flt-r4-12', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'spectra', format: 'integer', unit: 'Hz',
      q: R`A rectangular pulse lasts $T = 2$ ms (constant during the pulse, zero otherwise). The lowest positive frequency $\nu$ at which its Fourier spectrum is zero is ______ Hz.`,
      answer: 500, tol: 0, calc: () => 1 / 2e-3,
      sol: R`For a pulse of height 1 on $|t| < T/2$, $\tilde f(\nu) = \int_{-T/2}^{T/2}e^{-2\pi i\nu t}dt = \frac{\sin(\pi\nu T)}{\pi\nu}$. This first vanishes when $\pi\nu T = \pi$, at $\nu = 1/T = 500$ Hz. Shorter pulses spread over wider bands.`,
      trap: R`Using angular frequency, $\omega = 2\pi/T\approx3142$ rad/s, and reporting it as Hz.` },
  ],
  gens: [
    { id: 'flt-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'Laplace and ODEs',
      make(r) {
        const a = int(r, 1, 4), b = int(r, 2, 8), T = int(r, 1, 3), t1 = T + choose(r, [0.5, 1, 1.5, 2]);
        const v = (b / a) * (1 - Math.exp(-a * (t1 - T)));
        return { q: R`Solve $y' + ${a === 1 ? '' : a}y = ${b}\,u(t - ${T})$ with $y(0) = 0$ ($u$ the unit step) by Laplace transforms. The value of $y(${t1})$ is ______ (three decimal places).`,
          answer: round(v, 3), tol: 0.003, a, b, T, t1,
          sol: R`Transform: $(s + ${a})Y = ${b}\,\frac{e^{-${T}s}}{s}$, so $Y = e^{-${T}s}\cdot\frac{${b}}{s(s + ${a})} = e^{-${T}s}\cdot\frac{${b}}{${a}}\left(\frac1s - \frac{1}{s + ${a}}\right)$. Without the exponential this is $\frac{${b}}{${a}}(1 - e^{-${a}t})$; the factor $e^{-${T}s}$ delays it by ${T}: $y = \frac{${b}}{${a}}\left(1 - e^{-${a}(t - ${T})}\right)u(t - ${T})$. At $t = ${t1}$: $\frac{${b}}{${a}}(1 - e^{-${round(a * (t1 - T), 2)}})\approx${round(v, 3)}$.`,
          trap: 'Forgetting to delay the response (using $t$ instead of $t - T$ in the exponential).' };
      },
      verify: (p) => rk4((t, y) => [p.b * (t >= p.T ? 1 : 0) - p.a * y[0]], [0], p.T, p.t1, 400)[0] },
    { id: 'flt-r4g2', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Fourier rules',
      make(r) {
        const a = choose(r, [2, 3]), b = choose(r, [1, a + 1]), sg = choose(r, [1, -1]);
        const arg = `${a}x ${sg > 0 ? '-' : '+'} ${b}`;
        const ph = (num, den, s) => `e^{${s}ik${den === 1 ? `\\cdot${num}` : `\\cdot${num}/${den}`}}`;
        const sgn = sg > 0 ? '-' : '';
        const correct = `$\\dfrac{1}{${a}}\\,${ph(b, a, sgn)}\\,\\tilde f\\!\\left(\\dfrac{k}{${a}}\\right)$`;
        const wrongs = [`$\\dfrac{1}{${a}}\\,${ph(b, 1, sgn)}\\,\\tilde f\\!\\left(\\dfrac{k}{${a}}\\right)$`, `$${a}\\,${ph(b, a, sgn)}\\,\\tilde f(${a}k)$`, `$\\dfrac{1}{${a}}\\,${ph(b, a, sg > 0 ? '' : '-')}\\,\\tilde f\\!\\left(\\dfrac{k}{${a}}\\right)$`];
        const m = mcqOptions(r, correct, wrongs, (s) => s);
        return { q: R`With $\tilde f(k) = \int_{-\infty}^{\infty}f(x)e^{-ikx}dx$, the Fourier transform of $g(x) = f(${arg})$ is`, ...m,
          sol: R`Substitute $u = ${arg}$, so $x = (u ${sg > 0 ? '+' : '-'} ${b})/${a}$ and $dx = du/${a}$: $\int f(u)e^{-ik(u ${sg > 0 ? '+' : '-'} ${b})/${a}}\frac{du}{${a}} = \frac1{${a}}e^{${sgn}ik\cdot${b}/${a}}\int f(u)e^{-i(k/${a})u}du$. So the shift by $${b}/${a}$ (not ${b}) gives the phase, and squeezing by ${a} stretches the spectrum: $\tilde f(k/${a})/${a}$.`,
          trap: 'Applying the shift rule before the scaling: $f(ax - b)$ is $f$ shifted by $b/a$, not by $b$.' };
      } },
    { id: 'flt-r4g3', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'convolution',
      make(r) {
        const a = int(r, 1, 3), b = a + int(r, 1, 3), t = choose(r, [0.5, 1, 1.5, 2]);
        const v = (Math.exp(-a * t) - Math.exp(-b * t)) / (b - a);
        return { q: R`The convolution $h(t) = \displaystyle\int_0^t e^{-${a === 1 ? '' : a}\tau}e^{-${b}(t - \tau)}\,d\tau$, found with Laplace transforms, has $h(${t})$ = ______ (four decimal places).`,
          answer: round(v, 4), tol: 0.0003, a, b, t,
          sol: R`The transform of a convolution is the product: $H(s) = \frac{1}{s + ${a}}\cdot\frac{1}{s + ${b}} = \frac{1}{${b - a}}\left(\frac{1}{s + ${a}} - \frac{1}{s + ${b}}\right)$. So $h(t) = \frac{e^{-${a}t} - e^{-${b}t}}{${b - a}}$, and $h(${t}) = \frac{${round(Math.exp(-a * t), 5)} - ${round(Math.exp(-b * t), 5)}}{${b - a}}\approx${round(v, 4)}$.`,
          trap: 'Multiplying the two exponentials at time $t$ (giving $e^{-(a+b)t}$) is not the convolution.' };
      },
      verify: (p) => simpson((u) => Math.exp(-p.a * u) * Math.exp(-p.b * (p.t - u)), 0, p.t, 400) },
  ],
};
