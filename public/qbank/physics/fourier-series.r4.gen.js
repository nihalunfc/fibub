// Round 4 extras for fourier-series: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'fs-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'periodic functions',
      q: R`A steady periodic signal (not a pure sine) repeats every 5 ms. The frequencies that can appear in its Fourier series are`,
      options: ['any frequency at all, with a continuous spread', '0, 200, 400, 600, ... Hz (whole multiples of 200 Hz)', 'only 200 Hz', '0, 100, 300, 500, ... Hz (odd multiples of 100 Hz)'], answer: 1,
      sol: R`A function of period $T$ is a sum of $\cos(2\pi nt/T)$ and $\sin(2\pi nt/T)$ for $n = 0, 1, 2, \dots$, so only $n/T$ can appear: $1/T = 200$ Hz and its whole multiples, plus a possible constant ($n = 0$). Which of them are actually present depends on the shape; a continuous spread belongs to signals that do not repeat.`,
      trap: R`A non-sinusoidal shape adds harmonics, but they are still locked to multiples of $1/T$.` },
    { id: 'fs-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'convergence',
      q: R`Each function is defined on $(-\pi, \pi)$ and repeated with period $2\pi$. Which one does NOT meet the Dirichlet conditions for a Fourier series?`,
      options: [R`$|x|$`, R`$\operatorname{sgn}x$ (the sign of $x$)`, R`$x^2$`, R`$\tan x$`], answer: 3,
      sol: R`The Dirichlet conditions ask for a function that is absolutely integrable over a period, with finitely many jumps and finitely many maxima and minima. $|x|$ and $x^2$ are continuous; $\operatorname{sgn}x$ has finite jumps only. $\tan x$ blows up at $x = \pm\pi/2$ and $\int|\tan x|\,dx$ diverges there, so its coefficients are not even defined.`,
      trap: R`Jumps are allowed; infinities that make the integral diverge are not.` },
    { id: 'fs-r4-03', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'coefficients',
      q: R`A pulse train equals 1 for $|x| < \pi/3$ and 0 for $\pi/3 < |x| < \pi$, repeated with period $2\pi$. Which harmonics are missing from its Fourier series (apart from all sine terms)?`,
      options: [R`every multiple of 3: $n = 3, 6, 9, \dots$`, 'every even harmonic', 'every odd harmonic', 'none: every cosine harmonic is present'], answer: 0,
      sol: R`The function is even, so only cosines appear, with $a_n = \dfrac1\pi\displaystyle\int_{-\pi/3}^{\pi/3}\cos nx\,dx = \dfrac{2\sin(n\pi/3)}{n\pi}$. This vanishes when $n\pi/3$ is a multiple of $\pi$, that is for $n = 3, 6, 9, \dots$. In general a pulse of width $2d$ loses the harmonics with $nd$ a multiple of $\pi$; only a 50% duty cycle loses all the even ones.`,
      trap: R`"Only odd harmonics" is true for a 50% duty cycle, not for this narrower pulse.` },
    { id: 'fs-r4-04', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'complex form',
      q: R`A $2\pi$-periodic function $f(x) = \sum c_ne^{inx}$ is shifted to $g(x) = f(x - x_0)$. In the series $g(x) = \sum d_ne^{inx}$,`,
      options: [R`$|d_n|$ differ from $|c_n|$, but the phases are the same`, R`$d_n = c_n$ for every $n$`, R`$|d_n| = |c_n|$, and the phase of the $n$th term changes by $-nx_0$`, R`only the constant term $d_0$ changes`], answer: 2,
      sol: R`$g(x) = \sum c_ne^{in(x - x_0)} = \sum(c_ne^{-inx_0})e^{inx}$, so $d_n = c_ne^{-inx_0}$. The modulus is unchanged and the phase shifts by an amount proportional to $n$. That is why the power in each harmonic (Parseval) does not depend on where you start the clock. The constant term, $n = 0$, is the one coefficient that does not change.`,
      trap: R`A delay does not change how much of each harmonic there is, only its phase, and the phase shift grows with $n$.` },
    { id: 'fs-r4-05', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'even and odd functions',
      q: R`A $2\pi$-periodic function is odd, $f(-x) = -f(x)$, and also symmetric about $x = \pi/2$, $f(\pi - x) = f(x)$. Its Fourier series can contain only`,
      options: [R`$\sin nx$ with $n$ even`, R`$\sin nx$ with $n$ odd`, R`$\cos nx$ with $n$ odd`, R`$\cos nx$ with $n$ even`], answer: 1,
      sol: R`Oddness removes the constant and all cosines. For the sines, $\sin n(\pi - x) = \sin n\pi\cos nx - \cos n\pi\sin nx = (-1)^{n+1}\sin nx$. The condition $f(\pi - x) = f(x)$ keeps only terms with $(-1)^{n+1} = 1$, that is $n$ odd. The square wave and $\sin^3x$ are examples.`,
      trap: R`$\sin2x$ is odd but is anti-symmetric about $\pi/2$, so even $n$ drop out.` },
    { id: 'fs-r4-06', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'coefficients', format: 'statements',
      q: R`The half-wave rectified sine is $f(x) = \sin x$ for $0 < x < \pi$ and $0$ for $\pi < x < 2\pi$, repeated with period $2\pi$. Which statements about its Fourier series are true?`,
      options: [R`The constant term is $1/\pi$`, R`It contains the term $\tfrac12\sin x$`, R`It contains $\cos3x$ with a non-zero coefficient`, R`$\sin x$ is the only sine term`], answer: [0, 1, 3],
      sol: R`Write $f = \tfrac12(\sin x + |\sin x|)$. Using $|\sin x| = \dfrac2\pi - \dfrac4\pi\sum_{k\ge1}\dfrac{\cos2kx}{4k^2 - 1}$, $f = \dfrac1\pi + \dfrac12\sin x - \dfrac2\pi\sum_{k\ge1}\dfrac{\cos2kx}{4k^2 - 1}$. So the constant is $1/\pi$ (the average of a half sine over a full period), the only sine is $\tfrac12\sin x$, and the cosines are all of even order: no $\cos3x$.`,
      trap: R`Splitting into $\tfrac12\sin x$ plus half of $|\sin x|$ avoids the integrals and shows at once that only even cosines remain.` },
    { id: 'fs-r4-07', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'periodic functions', format: 'statements',
      q: R`A $2\pi$-periodic function $f$ has Fourier coefficients $a_n$, $b_n$. Let $g(x) = f(x) + f(x + \pi)$. Which statements are true?`,
      options: [R`$g$ has period $\pi$`, R`The series of $g$ has only even harmonics ($n = 0, 2, 4, \dots$)`, R`The constant term of $g$ is twice that of $f$`, R`The odd harmonics of $g$ are twice those of $f$`], answer: [0, 1, 2],
      sol: R`$g(x + \pi) = f(x + \pi) + f(x + 2\pi) = g(x)$, so the period is $\pi$. Term by term, $\cos n(x + \pi) = (-1)^n\cos nx$ and likewise for sines, so $g$ has coefficients $(1 + (-1)^n)a_n$ and $(1 + (-1)^n)b_n$: doubled for even $n$ (including $n = 0$), zero for odd $n$.`,
      trap: R`Shifting by half a period flips the sign of every odd harmonic, so they cancel in the sum.` },
    { id: 'fs-r4-08', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'coefficients',
      q: R`A pulse train equals 1 for $|x| < \pi/3$ and 0 for $\pi/3 < |x| < \pi$, repeated with period $2\pi$. In $f = \tfrac{a_0}{2} + \sum(a_n\cos nx + b_n\sin nx)$, the coefficient $a_1$ is ______ (to three decimal places).`,
      answer: 0.551, tol: 0.002, calc: () => 2 * Math.sin(Math.PI / 3) / Math.PI,
      sol: R`$a_1 = \dfrac1\pi\displaystyle\int_{-\pi/3}^{\pi/3}\cos x\,dx = \dfrac{2\sin(\pi/3)}{\pi} = \dfrac{\sqrt3}{\pi} = 0.551$.`,
      trap: R`Integrate only where the pulse is on; the factor in front is $1/\pi$, not $1/2\pi$.` },
    { id: 'fs-r4-09', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'Parseval',
      q: R`The function $f(x) = x$ on $(-\pi, \pi)$ is approximated by a single term $b\sin x$, with $b$ chosen to make the mean-square error $\dfrac1{2\pi}\displaystyle\int_{-\pi}^{\pi}(f - b\sin x)^2dx$ as small as possible. The smallest mean-square error is ______ (to three decimal places).`,
      answer: 1.29, tol: 0.003, calc: () => Math.PI ** 2 / 3 - 2,
      sol: R`The best $b$ is the Fourier coefficient: $b_1 = \dfrac1\pi\displaystyle\int_{-\pi}^{\pi}x\sin x\,dx = \dfrac{2\pi}{\pi} = 2$. The error is the mean of $f^2$ minus the mean power in the kept term: $\dfrac{\pi^2}{3} - \dfrac{b_1^2}{2} = 3.290 - 2 = 1.290$. (Directly: the mean of $x^2$ is $\pi^2/3$, the mean of $-2bx\sin x$ is $-2b\cdot1 = -4$, and the mean of $b^2\sin^2x$ is $b^2/2 = 2$; total $\pi^2/3 - 2$.) Keeping more harmonics shrinks the error towards zero, by Parseval.`,
      trap: R`The mean of $\sin^2x$ is $\tfrac12$, so a term of amplitude 2 carries mean square 2, not 4.` },
    { id: 'fs-r4-10', type: 'nat', level: 5, exams: ['gate'], sub: 'summing series',
      q: R`Apply Parseval's theorem to the pulse train equal to 1 for $|x| < \pi/3$ and 0 for $\pi/3 < |x| < \pi$ (period $2\pi$). It gives $\displaystyle\sum_{n=1}^{\infty}\frac{\sin^2(n\pi/3)}{n^2} =$ ______ (to three decimal places).`,
      answer: 1.097, tol: 0.002, calc: () => Math.PI ** 2 / 9,
      sol: R`With $a_0/2 = 1/3$ and $a_n = \dfrac{2\sin(n\pi/3)}{n\pi}$, Parseval reads $\dfrac1{2\pi}\displaystyle\int f^2dx = \left(\dfrac{a_0}{2}\right)^2 + \dfrac12\sum a_n^2$. The left side is the fraction of time the pulse is on, $\tfrac13$. So $\tfrac13 - \tfrac19 = \dfrac{2}{\pi^2}\sum\dfrac{\sin^2(n\pi/3)}{n^2}$, giving $\sum = \dfrac{2}{9}\cdot\dfrac{\pi^2}{2} = \dfrac{\pi^2}{9} = 1.097$.`,
      trap: R`$\int f^2$ is the on-time; forgetting to subtract the square of the constant term gives $\pi^2/6$.` },
  ],
  gens: [
    { id: 'fs-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'coefficients',
      make(r) {
        const [k, lab] = choose(r, [[1 / 6, R`\pi/6`], [1 / 4, R`\pi/4`], [1 / 3, R`\pi/3`], [1 / 2, R`\pi/2`], [2 / 3, R`2\pi/3`], [3 / 4, R`3\pi/4`], [5 / 6, R`5\pi/6`]]);
        const A = int(r, 1, 5), n = int(r, 1, 5), d = k * Math.PI;
        let answer = round(2 * A * Math.sin(n * d) / (n * Math.PI), 4); if (Math.abs(answer) < 1e-9) answer = 0;
        return { q: R`A pulse train equals ${A} for $|x| < ${lab}$ and 0 for $${lab} < |x| < \pi$, repeated with period $2\pi$. Find the cosine coefficient $a_{${n}}$ in $f = \tfrac{a_0}{2} + \sum(a_n\cos nx + b_n\sin nx)$ (to four decimal places).`,
          answer, tol: 0.0005, A, n, k,
          sol: R`$a_n = \dfrac1\pi\displaystyle\int_{-d}^{d}${A === 1 ? '' : A}\cos nx\,dx = \dfrac{${2 * A}\sin(nd)}{n\pi}$ with $d = ${lab}$, $n = ${n}$: $a_{${n}} = \dfrac{${2 * A}\sin(${n === 1 ? '' : n + '\\cdot'}${lab})}{${n === 1 ? '' : n}\pi} = ${answer}$.`,
          trap: 'The function is even, so there are no sine terms; a harmonic vanishes when $nd$ is a multiple of $\\pi$.' };
      },
      verify: (p) => 2 * p.A * Math.sin(p.n * p.k * Math.PI) / (p.n * Math.PI) },
    { id: 'fs-r4g2', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'Parseval',
      make(r) {
        const c = int(r, 1, 4), N = int(r, 1, 5);
        let s = 0; for (let n = 1; n <= N; n++) s += 2 / (n * n);
        const answer = round(c * c * (Math.PI ** 2 / 3 - s), 4);
        return { q: R`The function $f(x) = ${c === 1 ? '' : c}x$ on $(-\pi, \pi)$ (period $2\pi$) is approximated by its Fourier partial sum with the ${N === 1 ? 'single term $b_1\\sin x$' : `terms $b_1\\sin x$ to $b_{${N}}\\sin ${N}x$`}. Find the mean-square error $\dfrac1{2\pi}\displaystyle\int_{-\pi}^{\pi}(f - S_{${N}})^2dx$ (to four decimal places).`,
          answer, tol: Math.max(0.0005, answer * 0.002), c, N,
          sol: R`For $f = ${c === 1 ? '' : c}x$, $b_n = \dfrac{${2 * c}(-1)^{n+1}}{n}$ and the mean of $f^2$ is $${c * c}\pi^2/3$. By Parseval the error is what the kept terms leave out: $${c * c}\left(\dfrac{\pi^2}{3} - \displaystyle\sum_{n=1}^{${N}}\dfrac{2}{n^2}\right) = ${c * c}(3.2899 - ${round(s, 4)}) = ${answer}$.`,
          trap: 'Each harmonic of amplitude $b_n$ carries mean square $b_n^2/2$.' };
      },
      verify: (p) => { let s = 0; for (let n = 1; n <= p.N; n++) s += 2 / (n * n); return p.c * p.c * (Math.PI ** 2 / 3 - s); } },
    { id: 'fs-r4g3', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'even and odd functions',
      make(r) {
        const even = r() < 0.5, half = r() < 0.5;
        const all = ['only $\\cos nx$ with $n$ odd', 'only $\\cos nx$ with $n$ even (and the constant)', 'only $\\sin nx$ with $n$ odd', 'only $\\sin nx$ with $n$ even', 'cosines of every order and no sines', 'sines of every order and no cosines'];
        const ci = even ? (half ? 0 : 1) : (half ? 2 : 3);
        const wr = [0, 1, 2, 3, 4, 5].filter((i) => i !== ci).map((i) => all[i]);
        const { options, answer } = mcqOptions(r, all[ci], wr);
        return { q: R`A $2\pi$-periodic function satisfies $f(-x) = ${even ? '' : '-'}f(x)$ and $f(x + \pi) = ${half ? '-' : ''}f(x)$ (and is not identically zero). Its Fourier series contains`,
          options, answer,
          sol: R`${even ? 'An even function has only cosines (and a constant).' : 'An odd function has only sines.'} Shifting by $\pi$ multiplies the $n$th harmonic by $(-1)^n$, so $f(x + \pi) = ${half ? '-' : ''}f(x)$ keeps only the ${half ? 'odd' : 'even'} $n$${half ? ' (this "half-wave symmetry" also removes the constant)' : ' (the function really has period $\\pi$)'}. Together: ${all[ci]}.`,
          trap: 'Each symmetry removes half the terms; apply both.' };
      },
      verify: (p) => p.answer },
  ],
};
