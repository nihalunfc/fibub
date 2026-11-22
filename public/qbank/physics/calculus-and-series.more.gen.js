// Extra question shapes for calculus-and-series (templates cal-t21..t26). Imported by calculus-and-series.js.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import { msqOf, gcd, bisect } from './_more.js';

export default [
  { id: 'cal-t21', type: 'msq', level: 2, exams: ['jam'], sub: 'convergence', format: 'statements',
    make(r) {
      const p = choose(r, [0.5, 0.8, 1, 1.5, 2, 3]);
      const [qt, qv] = choose(r, [['\\tfrac12', 0.5], ['-\\tfrac34', -0.75], ['\\tfrac32', 1.5], ['-1', -1], ['\\tfrac23', 2 / 3], ['\\tfrac54', 1.25]]);
      const k = int(r, 2, 9);
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`$\\sum_{n\\ge1} 1/n^{${p}}$ converges`, p > 1, `A $p$-series converges exactly when $p > 1$; here $p = ${p}$.`],
        [`$\\sum_{n\\ge0} \\left(${qt}\\right)^n$ converges`, Math.abs(qv) < 1, `A geometric series converges exactly when its ratio has modulus below 1; here $|r| = ${round(Math.abs(qv), 3)}$.`],
        ['$\\sum_{n\\ge1} (-1)^{n+1}/n$ converges', true, 'The terms alternate in sign, shrink and tend to zero, so the alternating series test gives convergence (to $\\ln 2$, conditionally).'],
        ['$\\sum_{n\\ge1} 1/n$ converges', false, 'The harmonic series diverges: its terms can be grouped into infinitely many blocks each larger than $1/2$.'],
        [`$\\sum_{n\\ge0} ${k}^n/n!$ converges`, true, `The ratio of successive terms is $${k}/(n+1)\\to 0$, so the ratio test gives convergence (the sum is $e^{${k}}$).`],
        [`$\\sum_{n\\ge1} \\dfrac{n}{n+${k}}$ converges`, false, 'The terms tend to 1, not 0, so the series diverges by the $n$th-term test.'],
        ['$\\sum_{n\\ge2} \\dfrac{1}{n\\ln n}$ converges', false, 'Integral test: $\\int dx/(x\\ln x) = \\ln(\\ln x)$ grows without bound, so the series diverges.'],
        [`$\\sum_{n\\ge1} \\dfrac{1}{n^2+${k}}$ converges`, true, 'Each term is smaller than $1/n^2$ and $\\sum 1/n^2$ converges, so this converges by comparison.'],
      ], { not });
      return { q: `About the convergence of infinite series, which of the following statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Terms tending to zero is necessary but not enough: the harmonic series is the classic counter-example.' };
    } },
  { id: 'cal-t22', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'convergence',
    make(r) {
      const k = int(r, 2, 9), mm = int(r, 1, 3);
      const vals = { k: `$${k}$`, inv: `$1/${k}$`, sq: `$\\sqrt{${k}}$`, k2: `$${k * k}$`, inf: 'every $x$ (radius unlimited)' };
      const form = choose(r, [
        { s: `\\sum_{n\\ge1} \\dfrac{${mm === 1 ? 'n' : `n^{${mm}}`}x^n}{${k}^n}`, c: 'k', why: `The ratio test: $|a_{n+1}x^{n+1}/a_nx^n| = \\left(\\tfrac{n+1}{n}\\right)^{${mm}}\\dfrac{|x|}{${k}}\\to\\dfrac{|x|}{${k}}$. This is below 1 for $|x| < ${k}$, so $R = ${k}$. The power $n^{${mm}}$ does not change the radius.` },
        { s: `\\sum_{n\\ge0} \\dfrac{x^{2n}}{${k}^n}`, c: 'sq', why: `This is a geometric series in $x^2/${k}$. It converges when $x^2/${k} < 1$, that is $|x| < \\sqrt{${k}}$.` },
        { s: `\\sum_{n\\ge1} \\dfrac{${k}^n x^n}{n}`, c: 'inv', why: `Ratio test: $\\dfrac{n}{n+1}${k}|x|\\to ${k}|x|$, below 1 when $|x| < 1/${k}$.` },
        { s: `\\sum_{n\\ge0} \\dfrac{${k}^n x^n}{n!}`, c: 'inf', why: `Ratio test: $\\dfrac{${k}|x|}{n+1}\\to 0$ for every $x$, so the series (it is $e^{${k}x}$) converges everywhere.` },
      ]);
      const o = mcqOptions(r, vals[form.c], shuffle(r, Object.keys(vals).filter((x) => x !== form.c)).map((x) => vals[x]));
      return { q: `The power series $\\displaystyle ${form.s}$ converges for $|x| < R$. The radius of convergence $R$ is`, ...o,
        sol: form.why, trap: 'Polynomial factors such as $n$ or $1/n$ never change the radius; only the geometric part does.' };
    } },
  { id: 'cal-t23', type: 'nat', level: 3, exams: ['jam'], sub: 'Maclaurin series',
    make(r) {
      const a = choose(r, [-3, -2, -1, 1, 2, 3, 4]), b = int(r, 1, 4);
      const v = (a * a - b * b) / 2;
      return { q: `The Maclaurin series of $f(x) = e^{${a}x}\\cos ${b === 1 ? '' : b}x$ is $1 + c_1x + c_2x^2 + \\dots$. The coefficient $c_2$ is ______.`,
        answer: v, tol: 0.01, a, b,
        sol: `Multiply the two series. $e^{${a}x} = 1 + ${a}x + \\tfrac{${a * a}}{2}x^2 + \\dots$ and $\\cos ${b}x = 1 - \\tfrac{${b * b}}{2}x^2 + \\dots$ (no $x$ term). The $x^2$ terms of the product come from $1\\cdot(-\\tfrac{${b * b}}{2}x^2)$ and $\\tfrac{${a * a}}{2}x^2\\cdot 1$; the $x$ term of $e^{${a}x}$ meets no $x$ term of the cosine. So $c_2 = \\tfrac{${a * a} - ${b * b}}{2} = ${v}$.`,
        trap: 'The cosine has no $x^1$ term, so there is no cross term $(' + a + 'x)(\\dots x)$ to add.' };
    },
    verify: (p) => { const f = (x) => Math.exp(p.a * x) * Math.cos(p.b * x), h = 1e-3; return (f(h) - 2 * f(0) + f(-h)) / (2 * h * h); } },
  { id: 'cal-t24', type: 'nat', level: 2, exams: ['jam'], sub: 'limits by series', format: 'reverse',
    make(r) {
      const a = pick(r, 0.5, 6, 0.5), L = a * a / 2;
      return { q: `For a positive constant $a$, $\\displaystyle\\lim_{x\\to0}\\frac{1-\\cos(ax)}{x^2} = ${L}$. The value of $a$ is ______ (to two decimal places).`,
        answer: a, tol: 0.01, L,
        sol: `For small $x$, $1-\\cos(ax)\\approx\\dfrac{a^2x^2}{2}$, so the limit is $a^2/2$. Setting $a^2/2 = ${L}$ gives $a^2 = ${2 * L}$ and $a = ${a}$ (the positive root).`,
        trap: 'Solving $a/2 = L$ forgets that the cosine expansion carries $a^2$.' };
    },
    verify: (p) => bisect((a) => (1 - Math.cos(a * 1e-3)) / 1e-6 - p.L, 0, 10) },
  { id: 'cal-t25', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'limits by series', format: 'limiting case',
    make(r) {
      const a = int(r, 2, 4);
      const [f, cn, cd, pw, why] = choose(r, [
        ['\\sqrt{1+U}-1', 1, 2, 1, '$\\sqrt{1+u} = 1 + u/2 - u^2/8 + \\dots$'],
        ['1-\\cos U', 1, 2, 2, '$\\cos u = 1 - u^2/2 + \\dots$'],
        ['\\tan U-\\sin U', 1, 2, 3, '$\\tan u = u + u^3/3 + \\dots$ and $\\sin u = u - u^3/6 + \\dots$, so the difference starts at $u^3/2$'],
        ['\\ln(1+U)-U', -1, 2, 2, '$\\ln(1+u) = u - u^2/2 + \\dots$'],
        ['e^{U}-1-U', 1, 2, 2, '$e^u = 1 + u + u^2/2 + \\dots$'],
        ['U-\\sin U', 1, 6, 3, '$\\sin u = u - u^3/6 + \\dots$'],
        ['\\sinh U-U', 1, 6, 3, '$\\sinh u = u + u^3/6 + \\dots$'],
        ['\\dfrac{1}{1-U}-1-U', 1, 1, 2, '$1/(1-u) = 1 + u + u^2 + \\dots$'],
      ]);
      const fx = f.replace(/U/g, `${a}x`);
      const term = (n, d, p) => {
        const g = gcd(n, d); n /= g; d /= g;
        const xs = p === 1 ? 'x' : `x^{${p}}`;
        const c = d === 1 ? (Math.abs(n) === 1 ? '' : `${Math.abs(n)}`) : `\\tfrac{${Math.abs(n)}}{${d}}`;
        return `$${n < 0 ? '-' : ''}${c}${xs}$`;
      };
      const right = term(cn * a ** pw, cd, pw);
      const o = mcqOptions(r, right, [term(cn, cd, pw), term(-cn * a ** pw, cd, pw), term(cn * a ** (pw + 1), cd, pw + 1), term(cn * a, cd, pw), term(cn * a ** pw, cd, pw + 1)]);
      return { q: `For $|x|\\ll 1$, the leading (lowest-order non-zero) term of $${fx}$ is`, ...o,
        sol: `Put $u = ${a}x$. ${why}, so the expression starts with $${frac0(cn, cd)}u^{${pw}}$. With $u = ${a}x$ this is ${right}: the factor $${a}$ is raised to the power $${pw}$ as well.`,
        trap: `Forgetting to raise the $${a}$ in $u = ${a}x$ to the same power as $x$.` };
    } },
  { id: 'cal-t26', type: 'msq', level: 2, exams: ['jam'], sub: 'even and odd functions',
    make(r) {
      const a = int(r, 1, 3);
      const I = (f) => `$\\displaystyle\\int_{-${a}}^{${a}} ${f}\\,dx = 0$`;
      const not = r() < 0.4;
      const m = msqOf(r, [
        [I('x^3\\cos x'), true, '$x^3$ is odd and $\\cos x$ even, so the product is odd and its integral over a symmetric interval is zero.'],
        [I('x\\sin x'), false, `$x$ and $\\sin x$ are both odd, so the product is even: the integral is $2\\int_0^{${a}}x\\sin x\\,dx = 2(\\sin ${a} - ${a}\\cos ${a}) = ${round(2 * (Math.sin(a) - a * Math.cos(a)), 3)}$, not zero.`],
        [I('x\\,e^{x^2}'), true, 'An odd function times an even one is odd, so the integral is zero.'],
        [I('x^2\\sinh x'), true, '$\\sinh x$ is odd and $x^2$ even, so the integrand is odd: zero.'],
        [I('\\sin^2 x'), false, 'The integrand is even and never negative (and not identically zero), so the integral is positive.'],
        [I('x|x|'), true, '$x|x|$ changes sign with $x$: it is odd, so the integral is zero.'],
        [I('(x^4+1)'), false, 'The integrand is positive everywhere, so the integral is positive.'],
        [I('\\sin x\\cos x'), true, 'Odd times even is odd (it is $\\tfrac12\\sin 2x$), so the integral is zero.'],
        [I('e^{x}'), false, `$e^x$ is neither even nor odd and is always positive; the integral is $e^{${a}} - e^{-${a}} = ${round(Math.exp(a) - Math.exp(-a), 3)}$.`],
      ], { not });
      return { q: `Which of the following statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The product of two odd functions is even, not odd.' };
    } },
];

function frac0(n, d) { const g = gcd(n, d); n /= g; d /= g; return d === 1 ? `${n}` : `${n < 0 ? '-' : ''}\\tfrac{${Math.abs(n)}}{${d}}`; }
