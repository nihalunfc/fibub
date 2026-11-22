// Round 5 extras for fourier-laplace-transforms: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
import { simpson } from './_more.js';
const R = String.raw;

export default {
  items: [
    { id: 'flt-r5-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'laplace basics',
      q: R`The Laplace transform of $t^3$ is`,
      options: [R`$\dfrac{6}{s^4}$`, R`$\dfrac{3}{s^4}$`, R`$\dfrac{1}{s^4}$`, R`$\dfrac{6}{s^3}$`], answer: 0,
      sol: R`$\mathcal L\{t^n\} = \dfrac{n!}{s^{n+1}}$. For $n = 3$: $\dfrac{3!}{s^4} = \dfrac{6}{s^4}$.`,
      trap: R`The power of $s$ is $n + 1$, and the numerator is $n!$, not $n$.` },
    { id: 'flt-r5-02', type: 'nat', level: 2, exams: ['jam'], sub: 'shifting theorem',
      q: R`If $F(s)$ is the Laplace transform of $e^{2t}\sin3t$, the value of $F(4)$ is ______ (three decimal places).`,
      answer: 0.231, tol: 0.001, calc: () => 3 / ((4 - 2) ** 2 + 9),
      sol: R`$\mathcal L\{\sin3t\} = \frac{3}{s^2 + 9}$, and multiplying by $e^{2t}$ shifts $s\to s - 2$: $F(s) = \frac{3}{(s - 2)^2 + 9}$. At $s = 4$: $\frac{3}{4 + 9} = \frac3{13}\approx0.231$.`,
      trap: R`Shifting the wrong way, $s\to s + 2$, gives $\frac{3}{45}$.` },
    { id: 'flt-r5-03', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'fourier properties',
      q: R`With $\tilde f(k) = \displaystyle\int_{-\infty}^{\infty}f(x)e^{-ikx}dx$, the transform of $f(x - 3)$ is`,
      options: [R`$e^{3ik}\tilde f(k)$`, R`$\tilde f(k - 3)$`, R`$e^{-3ik}\tilde f(k)$`, R`$\tfrac13\tilde f(k/3)$`], answer: 2,
      sol: R`Put $u = x - 3$: $\int f(u)e^{-ik(u + 3)}du = e^{-3ik}\tilde f(k)$. A shift in $x$ multiplies the transform by a phase; it does not change $|\tilde f|$.`,
      trap: R`$\tilde f(k - 3)$ is the transform of $e^{3ix}f(x)$: a phase in $x$ shifts $k$, and the reverse.` },
    { id: 'flt-r5-04', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'inverse laplace', format: 'statements',
      q: R`$f(t)$ has Laplace transform $F(s) = \dfrac{s + 3}{(s + 1)(s + 2)}$. Which statements are true?`,
      options: [R`$f(t) = 2e^{-t} - e^{-2t}$`, R`$f(0) = 1$`, R`$f(t)\to0$ as $t\to\infty$`, R`$f(t) < 0$ for some $t > 0$`], answer: [0, 1, 2],
      sol: R`Partial fractions: $\frac{s + 3}{(s + 1)(s + 2)} = \frac{A}{s + 1} + \frac{B}{s + 2}$ with $A = \frac{-1 + 3}{-1 + 2} = 2$ and $B = \frac{-2 + 3}{-2 + 1} = -1$. So $f = 2e^{-t} - e^{-2t}$, giving $f(0) = 1$ (also from $\lim_{s\to\infty}sF = 1$), and $f\to0$. Since $2e^{-t} > e^{-t}\ge e^{-2t}$ for $t\ge0$, $f$ is never negative.`,
      trap: R`Getting $B = +1$ (a sign slip in the cover-up) gives $f(0) = 3$, which the initial-value theorem rules out.` },
    { id: 'flt-r5-05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'inverse laplace',
      q: R`If $\mathcal L\{f\} = \dfrac{s}{(s^2 + 4)^2}$, the value of $f(\pi/4)$ is ______ (three decimal places).`,
      answer: 0.196, tol: 0.001, calc: () => (Math.PI / 4) * Math.sin(Math.PI / 2) / 4,
      sol: R`Differentiate $\mathcal L\{\sin2t\} = \frac{2}{s^2 + 4}$ with respect to $s$: $\mathcal L\{t\sin2t\} = -\frac{d}{ds}\frac{2}{s^2 + 4} = \frac{4s}{(s^2 + 4)^2}$. So $f(t) = \frac{t\sin2t}{4}$, and $f(\pi/4) = \frac{(\pi/4)\cdot1}{4} = \frac{\pi}{16}\approx0.196$.`,
      trap: R`Forgetting the factor $\tfrac14$ (from $4s$ in the numerator) gives $\pi/4$.` },
    { id: 'flt-r5-06', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'fourier transforms',
      q: R`With $\tilde f(k) = \displaystyle\int_{-\infty}^{\infty}f(x)e^{-ikx}dx$, the transform of $f(x) = \dfrac{1}{1 + x^2}$ is`,
      options: [R`$e^{-|k|}$`, R`$\dfrac{2}{1 + k^2}$`, R`$\pi e^{-k^2}$`, R`$\pi e^{-|k|}$`], answer: 3,
      sol: R`The transform of $e^{-|x|}$ is $\frac{2}{1 + k^2}$. By the symmetry of the Fourier pair, the transform of $\frac{2}{1 + x^2}$ is $2\pi e^{-|k|}$, so that of $\frac{1}{1 + x^2}$ is $\pi e^{-|k|}$. Check at $k = 0$: $\int\frac{dx}{1 + x^2} = \pi$.`,
      trap: R`$\frac{2}{1 + k^2}$ is the transform in the other direction; the $k = 0$ value (the area $\pi$) settles it.` },
    { id: 'flt-r5-07', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'laplace integrals',
      q: R`The value of $\displaystyle\int_0^{\infty}t\,e^{-t}\cos t\,dt$ is ______.`,
      answer: 0, tol: 0.001, calc: () => simpson((t) => t * Math.exp(-t) * Math.cos(t), 0, 60, 6000),
      sol: R`This is $\mathcal L\{t\cos t\}$ at $s = 1$. $\mathcal L\{\cos t\} = \frac{s}{s^2 + 1}$ and $\mathcal L\{t\cos t\} = -\frac{d}{ds}\frac{s}{s^2 + 1} = \frac{s^2 - 1}{(s^2 + 1)^2}$. At $s = 1$: $\frac{0}{4} = 0$. The positive and negative parts of the integrand cancel exactly.`,
      trap: R`Evaluating $\frac{s}{s^2 + 1}$ (forgetting the factor $t$) gives $\tfrac12$.` },
    { id: 'flt-r5-08', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'convolution',
      q: R`With $u(t)$ the unit step, the Laplace convolution $(f * f)(t) = \displaystyle\int_0^tf(\tau)f(t - \tau)\,d\tau$ for $f(t) = e^{-t}u(t)$ is`,
      options: [R`$e^{-2t}$`, R`$t\,e^{-t}$`, R`$\tfrac12e^{-t}$`, R`$\tfrac12t^2e^{-t}$`], answer: 1,
      sol: R`Directly: $e^{-\tau}e^{-(t - \tau)} = e^{-t}$ for every $\tau$, so the integral is $t\,e^{-t}$. With transforms: $\left(\frac1{s + 1}\right)^2$ is the transform of $te^{-t}$.`,
      trap: R`Multiplying the functions ($e^{-2t}$) is not convolving them; it is the transforms that multiply.` },
    { id: 'flt-r5-09', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'fourier symmetry', format: 'statements',
      q: R`With $\tilde f(k) = \int f(x)e^{-ikx}dx$, which statements are true for every (integrable) function described?`,
      options: [R`If $f$ is real and odd, $\tilde f$ is purely imaginary and odd`, R`If $f$ is real, $\tilde f(-k) = \tilde f(k)^*$`, R`If $f$ is real and even, $\tilde f$ is real and even`, R`For any complex $f$, $|\tilde f(k)|$ is an even function of $k$`], answer: [0, 1, 2],
      sol: R`Write $e^{-ikx} = \cos kx - i\sin kx$. Real odd $f$: only $-i\int f\sin kx\,dx$ survives, which is imaginary and odd in $k$. Real $f$: $\tilde f(-k) = \int fe^{ikx}dx = \left(\int fe^{-ikx}dx\right)^*$. Real even $f$: only $\int f\cos kx\,dx$ survives, real and even. For complex $f$ there is no such rule: $f = e^{-x^2}e^{ix}$ has $|\tilde f|$ centred at $k = 1$, not even.`,
      trap: R`The evenness of $|\tilde f|$ comes from $f$ being real; a complex phase like $e^{ik_0x}$ shifts the spectrum off centre.` },
    { id: 'flt-r5-10', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'laplace integrals',
      q: R`The value of $\displaystyle\int_0^{\infty}t^2e^{-2t}\sin t\,dt$ is ______ (three decimal places).`,
      answer: 0.176, tol: 0.001, calc: () => simpson((t) => t * t * Math.exp(-2 * t) * Math.sin(t), 0, 60, 6000),
      sol: R`It is $\text{Im}\,\mathcal L\{t^2e^{it}\}$ at $s = 2$. Since $\mathcal L\{t^2e^{it}\} = \frac{2}{(s - i)^3}$, we need $\frac{2}{(2 - i)^3}$. $(2 - i)^2 = 3 - 4i$ and $(2 - i)^3 = (3 - 4i)(2 - i) = 2 - 11i$. So $\frac{2}{2 - 11i} = \frac{2(2 + 11i)}{125}$, whose imaginary part is $\frac{22}{125} = 0.176$.`,
      trap: R`$|2 - i|^2 = 5$, so $|2 - 11i|^2 = 125$; using 25 or $\sqrt{125}$ in the denominator is the usual slip.` },
  ],
  gens: [
    { id: 'flt-r5g1', type: 'nat', level: 2, exams: ['jam'], sub: 'shifting theorem',
      make(r) {
        const a = choose(r, [-2, -1, 1, 2]), b = int(r, 1, 4), fn = choose(r, ['sin', 'cos']), s = a + int(r, 1, 3);
        const fnT = fn === "sin" ? "\\sin" : "\\cos";
        const v = fn === 'sin' ? b / ((s - a) ** 2 + b * b) : (s - a) / ((s - a) ** 2 + b * b);
        return { q: R`If $F(s) = \mathcal L\left\{e^{${a === 1 ? '' : a === -1 ? '-' : a}t}${fnT} ${b === 1 ? '' : b}t\right\}$, find $F(${s})$ (four decimal places).`,
          answer: round(v, 4), tol: 0.0002, a, b, fn, s,
          sol: R`$\mathcal L\{${fnT}\,bt\} = ${fn === 'sin' ? '\\frac{b}{s^2 + b^2}' : '\\frac{s}{s^2 + b^2}'}$, and the factor $e^{at}$ shifts $s\to s - a$: $F(s) = ${fn === 'sin' ? `\\frac{${b}}{(s ${a < 0 ? '+' : '-'} ${Math.abs(a)})^2 + ${b * b}}` : `\\frac{s ${a < 0 ? '+' : '-'} ${Math.abs(a)}}{(s ${a < 0 ? '+' : '-'} ${Math.abs(a)})^2 + ${b * b}}`}$. At $s = ${s}$: $${round(v, 4)}$.`,
          trap: 'The shift is $s \\to s - a$ for $e^{at}$; shifting the other way is the usual slip.' };
      },
      verify: (p) => simpson((t) => Math.exp((p.a - p.s) * t) * Math[p.fn](p.b * t), 0, 80, 16000) },
    { id: 'flt-r5g2', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'inverse laplace',
      make(r) {
        const b = int(r, 1, 3), t = choose(r, [0.5, 1, 1.5, 2]);
        const v = t * Math.sin(b * t) / (2 * b);
        return { q: R`If $\mathcal L\{f\} = \dfrac{s}{(s^2 + ${b * b})^2}$, find $f(${t})$ (four decimal places).`,
          answer: round(v, 4), tol: 0.0002, b, t,
          sol: R`$\mathcal L\{t\sin bt\} = -\frac{d}{ds}\frac{b}{s^2 + b^2} = \frac{2bs}{(s^2 + b^2)^2}$. So $f(t) = \frac{t\sin bt}{2b}$ with $b = ${b}$: $f(${t}) = \frac{${t}\sin(${b * t})}{${2 * b}}\approx${round(v, 4)}$ (angle in radians).`,
          trap: 'Forgetting the $1/(2b)$, or working the sine in degrees.' };
      },
      verify: (p) => simpson((u) => Math.cos(p.b * u) * Math.sin(p.b * (p.t - u)) / p.b, 0, p.t) },
    { id: 'flt-r5g3', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'fourier properties',
      make(r) {
        const a = choose(r, [2, 3]), c = choose(r, [1, 2, 3, -1, -2]);
        // phase e^{s * i * m k / den}, s = +1 or -1
        const ph = (s, m, den) => { const v = s * m; return `e^{${v < 0 ? '-' : ''}i${Math.abs(v) === 1 ? '' : Math.abs(v)}k${den === 1 ? '' : `/${den}`}}`; };
        const wr = [
          `$\\tfrac1${a}\\,${ph(-1, c, 1)}\\tilde f(k/${a})$`,
          `$${a}\\,${ph(-1, c, a)}\\tilde f(${a}k)$`,
          `$\\tfrac1${a}\\,${ph(1, c, a)}\\tilde f(k/${a})$`,
        ];
        const o = mcqOptions(r, `$\\tfrac1${a}\\,${ph(-1, c, a)}\\tilde f(k/${a})$`, wr);
        return { q: R`With $\tilde f(k) = \displaystyle\int_{-\infty}^{\infty}f(x)e^{-ikx}dx$, the transform of $f(${a}x ${c < 0 ? '+' : '-'} ${Math.abs(c)})$ is`, ...o,
          sol: R`Put $u = ${a}x ${c < 0 ? '+' : '-'} ${Math.abs(c)}$, so $x = (u ${c < 0 ? '-' : '+'} ${Math.abs(c)})/${a}$ and $dx = du/${a}$: $\int f(u)\,e^{-ik(u + (${c}))/${a}}\,\frac{du}{${a}} = \frac1${a}e^{-i(${c})k/${a}}\tilde f(k/${a})$. Squeezing $f$ by ${a} stretches $\tilde f$ by ${a}, and the shift by ${c}/${a} in $x$ gives the phase.`,
          trap: 'The shift inside $f(ax - c)$ is $c/a$, not $c$; and squeezing in $x$ means $\\tilde f(k/a)$, not $\\tilde f(ak)$.' };
      } },
  ],
};
