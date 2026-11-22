// Extra question shapes for fourier-series (templates fs-t21..t26). Imported by fourier-series.js.
import { int, choose, mcqOptions, round, shuffle } from '../_util.js';
import { msqOf, simpson } from './_more.js';

export default [
  { id: 'fs-t21', type: 'mcq', level: 2, exams: ['jam'], sub: 'even and odd functions',
    make(r) {
      const L = { sin: 'only sine terms', cos: 'a constant term and cosine terms only', cos0: 'cosine terms only, with zero constant term', both: 'both sine and cosine terms' };
      const k = int(r, 2, 5);
      const F = choose(r, [
        [`${k}x`, 'sin', 'odd'], [`${k}x^3`, 'sin', 'odd'], [`x^2`, 'cos', 'even with a positive average'], [`${k}|x|`, 'cos', 'even with a positive average'],
        ['e^{x}', 'both', 'neither even nor odd'], [`x + ${k}x^2`, 'both', 'the sum of an odd part and an even part'],
        ['x^2 - \\pi^2/3', 'cos0', 'even, and its average over a period is $\\pi^2/3 - \\pi^2/3 = 0$'], [`${k}\\sin^3 x`, 'sin', 'odd'],
        ['|x| - \\pi/2', 'cos0', 'even, with average $\\pi/2 - \\pi/2 = 0$'],
      ]);
      const o = mcqOptions(r, L[F[1]], shuffle(r, Object.keys(L).filter((x) => x !== F[1]).map((x) => L[x])));
      return { q: `The function $f(x) = ${F[0]}$ on $(-\\pi, \\pi)$ is extended with period $2\\pi$. Its Fourier series contains`, ...o,
        sol: `$f$ is ${F[2]}. An odd function has $a_n = 0$ for all $n$ (only sines); an even function has $b_n = 0$ (constant and cosines), and the constant $a_0/2$ is the average of $f$ over a period. A function that is neither has both kinds.`,
        trap: 'An even function can still have zero constant term: the constant is the average value, not automatically non-zero.' };
    } },
  { id: 'fs-t22', type: 'nat', level: 3, exams: ['jam'], sub: 'finite series',
    make(r) {
      const A = int(r, 1, 5), N = choose(r, [1, 3, 5, 7, 9]);
      let s = 0; const parts = [];
      for (let k = 1; k <= N; k += 2) { const t = Math.sin((k * Math.PI) / 2) / k; s += t; parts.push(`${t < 0 ? '-' : '+'} \\tfrac{1}{${k}}`); }
      const v = ((4 * A) / Math.PI) * s;
      return { q: `A square wave equals $+${A}$ on $(0, \\pi)$ and $-${A}$ on $(-\\pi, 0)$, repeated with period $2\\pi$. Its series is $\\dfrac{${4 * A}}{\\pi}\\left(\\sin x + \\dfrac{\\sin 3x}{3} + \\dfrac{\\sin 5x}{5} + \\dots\\right)$. Keeping only the terms up to and including $\\sin ${N}x$, the partial sum at $x = \\pi/2$ is ______ (to three decimal places).`,
        answer: round(v, 3), tol: Math.max(0.002, round(v * 0.002, 3)), A, N,
        sol: `At $x = \\pi/2$, $\\sin(k\\pi/2) = +1, -1, +1, \\dots$ for $k = 1, 3, 5, \\dots$. The bracket is $${parts.join(' ').replace(/^\+ /, '')} = ${round(s, 5)}$, so the partial sum is $\\dfrac{${4 * A}}{\\pi}\\times${round(s, 5)} = ${round(v, 3)}$. As more terms are added it approaches $${A}$ (the bracket tends to $\\pi/4$).`,
        trap: 'The signs alternate at $x = \\pi/2$; adding all the terms as positive overshoots badly.' };
    },
    verify: (p) => { let s = 0; for (let n = 1; n <= p.N; n++) { const bn = (2 / Math.PI) * simpson((x) => p.A * Math.sin(n * x), 0, Math.PI, 400); s += bn * Math.sin((n * Math.PI) / 2); } return s; } },
  { id: 'fs-t23', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'convergence',
    make(r) {
      const Lv = int(r, -4, 2); let Rv = int(r, -3, 4); if (Rv === Lv) Rv += 3;
      const mid = round((Lv + Rv) / 2, 2), not = r() < 0.35;
      const m = msqOf(r, [
        [`At $x = 0$ the series converges to $${mid}$`, true, `At a jump the series converges to the average of the one-sided limits: $(${Lv} + ${Rv})/2 = ${mid}$.`],
        [`At $x = 0$ the series converges to $${Rv}$`, false, `It converges to the midpoint $${mid}$ of the jump, not to the right-hand value.`],
        [`At $x = \\pi$ the series converges to $${mid}$`, true, `The periodic extension also jumps at $x = \\pi$ (from $${Rv}$ to $${Lv}$), so again the midpoint $${mid}$.`],
        [`At $x = \\pi/2$ the series converges to $${Rv}$`, true, 'The function is continuous there, so the series converges to the function value.'],
        ['The coefficients fall off like $1/n$', true, 'A function with jumps has coefficients of order $1/n$.'],
        ['The coefficients fall off like $1/n^2$', false, 'That rate needs a continuous function (corners allowed); a jump gives $1/n$.'],
        ['The overshoot of the partial sums next to the jump shrinks to zero as more terms are added', false, `The Gibbs overshoot stays at about 9% of the jump ($\\approx ${round(0.0895 * Math.abs(Rv - Lv), 2)}$ here); it only gets narrower.`],
        [`The constant term $a_0/2$ equals $${mid}$`, true, 'The constant term is the average value over a period, which is the mean of the two levels.'],
      ], { not });
      return { q: `The function $f(x) = ${Lv}$ for $-\\pi < x < 0$ and $f(x) = ${Rv}$ for $0 < x < \\pi$ is extended with period $2\\pi$. About its Fourier series, which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'At a jump the series picks the midpoint, and the Gibbs overshoot never dies away.' };
    } },
  { id: 'fs-t24', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'complex form',
    make(r) {
      const n = int(r, 1, 4), A0 = int(r, -3, 3), B = int(r, 1, 6) * (r() < 0.5 ? -1 : 1), C = int(r, 1, 6) * (r() < 0.5 ? -1 : 1), D = int(r, 1, 5);
      let mm = int(r, 1, 4); if (mm === n) mm = n + 1;
      const v = Math.hypot(B, C) / 2;
      return { q: `For $f(x) = ${A0 === 0 ? '' : `${A0} `}${B < 0 ? '-' : A0 === 0 ? '' : '+'} ${Math.abs(B)}\\cos ${n === 1 ? '' : n}x ${C < 0 ? '-' : '+'} ${Math.abs(C)}\\sin ${n === 1 ? '' : n}x + ${D}\\cos ${mm}x$, written as $\\sum_n c_ne^{inx}$, the modulus $|c_{${n}}|$ is ______ (to three decimal places).`,
        answer: round(v, 3), tol: Math.max(0.002, round(v * 0.002, 3)), n, A0, B, C, D, mm,
        sol: `$c_n = \\tfrac12(a_n - ib_n)$ for $n > 0$. Only the frequency-${n} terms contribute: $a_{${n}} = ${B}$, $b_{${n}} = ${C}$. So $c_{${n}} = \\tfrac12(${B} - (${C})i)$ and $|c_{${n}}| = \\tfrac12\\sqrt{${B * B} + ${C * C}} = ${round(v, 3)}$. The $\\cos ${mm}x$ term only feeds $c_{\\pm${mm}}$.`,
        trap: 'Forgetting the factor $\\tfrac12$: each real cosine or sine splits between $c_n$ and $c_{-n}$.' };
    },
    verify: (p) => {
      const f = (x) => p.A0 + p.B * Math.cos(p.n * x) + p.C * Math.sin(p.n * x) + p.D * Math.cos(p.mm * x);
      const re = simpson((x) => f(x) * Math.cos(p.n * x), -Math.PI, Math.PI) / (2 * Math.PI), im = -simpson((x) => f(x) * Math.sin(p.n * x), -Math.PI, Math.PI) / (2 * Math.PI);
      return Math.hypot(re, im);
    } },
  { id: 'fs-t25', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'decay of coefficients',
    make(r) {
      const L = {
        1: 'the sawtooth $f(x) = x$ on $(-\\pi, \\pi)$, repeated (it has jumps)',
        2: 'the triangle wave $f(x) = |x|$ on $(-\\pi, \\pi)$, repeated (continuous, with corners)',
        3: 'the odd periodic extension of $x(\\pi - x)$ from $(0, \\pi)$ (smooth slope, but the curvature jumps)',
        9: '$f(x) = e^{\\cos x}$ (smooth everywhere)',
      };
      const k = choose(r, [1, 2, 3, 9]);
      const ask = k === 9 ? 'fall off faster than any power of $1/n$' : `fall off like $1/n^{${k}}$ for large $n$`;
      const o = mcqOptions(r, L[k], shuffle(r, Object.keys(L).filter((x) => +x !== k).map((x) => L[x])));
      return { q: `For which of these $2\\pi$-periodic functions do the Fourier coefficients ${ask}?`, ...o,
        sol: 'Each extra degree of smoothness gains one power of $1/n$ (integrate by parts once more before a jump appears). A jump in $f$ gives $1/n$ (sawtooth: $b_n = 2(-1)^{n+1}/n$); a jump in $f\'$ (a corner) gives $1/n^2$ (triangle: $a_n = -4/(\\pi n^2)$ for odd $n$); a jump in $f\'\'$ gives $1/n^3$ ($b_n = 8/(\\pi n^3)$ for odd $n$ for the extended $x(\\pi - x)$); a function smooth everywhere has coefficients that fall faster than any power.',
        trap: 'The odd extension of $x(\\pi - x)$ looks like a sine wave and has a continuous slope, so its coefficients fall fast, like $1/n^3$.' };
    } },
  { id: 'fs-t26', type: 'nat', level: 2, exams: ['jam'], sub: 'coefficients',
    make(r) {
      const A = int(r, 1, 6), n = int(r, 1, 6);
      const v = (2 * A * ((-1) ** n - 1)) / (Math.PI * n * n);
      return { q: `For $f(x) = ${A === 1 ? '' : A}|x|$ on $(-\\pi, \\pi)$, repeated with period $2\\pi$, the cosine coefficient $a_{${n}} = \\dfrac1\\pi\\displaystyle\\int_{-\\pi}^{\\pi}f(x)\\cos ${n}x\\,dx$ is ______ (to four decimal places).`,
        answer: round(v, 4) + 0, tol: Math.max(0.0005, round(Math.abs(v) * 0.002, 4)), A, n,
        sol: `$f$ is even, so $a_n = \\dfrac2\\pi\\int_0^\\pi ${A}x\\cos nx\\,dx$. By parts, $\\int_0^\\pi x\\cos nx\\,dx = \\left[\\dfrac{x\\sin nx}{n}\\right]_0^\\pi + \\left[\\dfrac{\\cos nx}{n^2}\\right]_0^\\pi = \\dfrac{(-1)^n - 1}{n^2}$. So $a_{${n}} = \\dfrac{${2 * A}((-1)^{${n}} - 1)}{\\pi\\cdot${n * n}} = ${round(v, 4) + 0}$${n % 2 === 0 ? ' (all even harmonics vanish)' : ''}.`,
        trap: 'For even $n$, $(-1)^n - 1 = 0$: the even cosine coefficients of $|x|$ are zero.' };
    },
    verify: (p) => (2 / Math.PI) * simpson((x) => p.A * x * Math.cos(p.n * x), 0, Math.PI) },
];
