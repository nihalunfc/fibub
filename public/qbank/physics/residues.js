// The residue theorem and real integrals: computing residues, trigonometric integrals on the unit circle, rational
// and Fourier-type integrals with Jordan's lemma, poles on the axis and principal values, keyhole and rectangular
// contours, branch points, residue at infinity and sums of series (GATE level).
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round } from '../_util.js';
import more from './residues.more.gen.js';
import more2 from './residues.more2.gen.js';
import r4 from './residues.r4.gen.js';
import r5 from './residues.r5.gen.js';

const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q) || 1; p /= g; q /= g; return q === 1 ? `${p}` : `${p < 0 ? '-' : ''}\\tfrac{${Math.abs(p)}}{${q}}`; };

import { tidyPhys } from './_signs.js';

const topicBank = {
  topic: 'residues',
  items: [
    // ---------- level 1 ----------
    { id: 'res-001', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'computing residues',
      q: 'The residue of $\\dfrac{1}{z(z - 3)}$ at $z = 0$ is ______ (to three decimal places).',
      answer: -0.333, tol: 0.002, calc: () => -1 / 3,
      sol: 'At a simple pole, $\\text{Res}_{z_0}f = \\lim_{z\\to z_0}(z - z_0)f(z)$. Here $\\lim_{z\\to0}\\frac{1}{z - 3} = -\\frac13 \\approx -0.333$.',
      trap: 'Evaluating at the other pole: $\\frac{1}{3}$ is the residue at $z = 3$.' },
    { id: 'res-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'computing residues',
      q: 'The residue of $\\dfrac{e^{z}}{z^3}$ at $z = 0$ is',
      options: ['$1$', '$\\tfrac12$', '$\\tfrac16$', '$0$'], answer: 1,
      sol: '$\\frac{e^z}{z^3} = \\frac{1}{z^3}\\left(1 + z + \\frac{z^2}{2} + \\cdots\\right)$. The coefficient of $1/z$ comes from the $z^2/2$ term: $\\tfrac12$.',
      trap: 'The residue is the coefficient of $z^{-1}$, not of $z^{-3}$.' },
    { id: 'res-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'residue theorem',
      q: 'The integral $\\oint_{|z| = 2}\\dfrac{3z + 1}{z(z - 1)}\\,dz$ (anticlockwise) equals $k\\pi i$. The value of $k$ is ______.',
      answer: 6, tol: 0,
      sol: 'Both poles are inside. $\\text{Res}_0 = \\frac{1}{0 - 1} = -1$ and $\\text{Res}_1 = \\frac{3 + 1}{1} = 4$. The integral is $2\\pi i(-1 + 4) = 6\\pi i$.',
      trap: 'The residue theorem has $2\\pi i$, so $k$ is twice the sum of residues.' },
    { id: 'res-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'computing residues',
      q: 'If $p(z_0) \\ne 0$, $q(z_0) = 0$ and $q\'(z_0) \\ne 0$, the residue of $p(z)/q(z)$ at $z_0$ is',
      options: ['$p\'(z_0)/q(z_0)$', '$p(z_0)\\,q\'(z_0)$', '$p\'(z_0)/q\'(z_0)$', '$p(z_0)/q\'(z_0)$'], answer: 3,
      sol: '$z_0$ is a simple pole, and $\\lim (z - z_0)\\frac{p}{q} = \\frac{p(z_0)}{\\lim\\frac{q(z) - q(z_0)}{z - z_0}} = \\frac{p(z_0)}{q\'(z_0)}$.',
      trap: 'This is not L\'Hôpital on $p/q$: only the denominator is differentiated.' },
    { id: 'res-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'computing residues',
      q: 'The residue of $\\cot z$ at $z = 0$ is',
      options: ['$0$', '$-1$', '$1$', '$\\pi$'], answer: 2,
      sol: '$\\cot z = \\cos z/\\sin z$; with $p = \\cos z$ and $q = \\sin z$, $p(0)/q\'(0) = 1/1 = 1$. In fact $\\cot z$ has residue 1 at every $n\\pi$, which is why $\\pi\\cot\\pi z$ is used to sum series.',
      trap: 'Even though $\\cot$ is an odd function, its residue is not zero: odd functions have only odd powers, and $1/z$ is odd.' },
    { id: 'res-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'computing residues',
      q: 'The residue of $\\dfrac{1}{z^2 + 1}$ at $z = i$ is',
      options: ['$\\tfrac{i}{2}$', '$-\\tfrac{i}{2}$', '$\\tfrac12$', '$-\\tfrac12$'], answer: 1,
      sol: '$\\frac{1}{(z - i)(z + i)}$, so the residue is $\\frac{1}{2i} = -\\frac{i}{2}$ (multiply top and bottom by $-i$).',
      trap: '$1/i = -i$, not $+i$.' },

    // ---------- level 2 ----------
    { id: 'res-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'rational integrals',
      q: 'The value of $\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{dx}{x^2 + 4}$ is ______ (to two decimal places).',
      answer: 1.57, tol: 0.01, calc: () => Math.PI / 2,
      sol: 'Close with a large semicircle in the upper half-plane; the arc contributes nothing because the integrand falls like $1/R^2$ while the arc length grows like $R$. The only enclosed pole is $2i$, with residue $\\frac{1}{4i}$. So the integral is $2\\pi i\\cdot\\frac{1}{4i} = \\frac{\\pi}{2} \\approx 1.57$.',
      trap: 'Including the pole at $-2i$ too: only poles inside the chosen contour count.' },
    { id: 'res-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'computing residues',
      q: 'The residue of $\\dfrac{z}{(z - 1)^2}$ at $z = 1$ is',
      options: ['$1$', '$0$', '$2$', '$\\tfrac12$'], answer: 0,
      sol: 'For a double pole, $\\text{Res} = \\frac{d}{dz}\\left[(z - 1)^2f\\right]_{z=1} = \\frac{d}{dz}z = 1$. (Or write $z = 1 + (z - 1)$: $f = \\frac{1}{(z - 1)^2} + \\frac{1}{z - 1}$.)',
      trap: 'Using the simple-pole formula on a double pole: $(z - 1)f$ still blows up.' },
    { id: 'res-009', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Jordan lemma',
      q: 'For $\\int_{-\\infty}^{\\infty}e^{ikx}f(x)\\,dx$ with $f(z) \\to 0$ uniformly as $|z| \\to \\infty$, which statements are true?',
      options: ['For $k > 0$, the integral over the large upper semicircle tends to 0 (Jordan\'s lemma)', 'For $k > 0$ we close in the upper half-plane because $|e^{ikz}| = e^{-k\\,\\text{Im}z}$ decays there', 'For $k < 0$ we close in the lower half-plane, and the result is $-2\\pi i$ times the sum of residues there', 'Jordan\'s lemma needs $f$ to fall faster than $1/|z|^2$'], answer: [0, 1, 2],
      sol: 'Jordan\'s lemma: $\\int_0^\\pi e^{-kR\\sin\\theta}d\\theta < \\pi/(kR)$, so the arc integral is at most $\\frac{\\pi}{k}\\max_{\\text{arc}}|f| \\to 0$ whenever $f \\to 0$; $f \\sim 1/z$ is enough. That is the whole point: without the exponential you would need faster decay. For $k < 0$ the exponential decays in the lower half-plane, and that contour runs clockwise, hence the minus sign.',
      trap: 'The $1/|z|^2$ condition is for integrals without an oscillating factor.' },
    { id: 'res-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'trigonometric integrals',
      q: 'The value of $\\displaystyle\\int_0^{2\\pi}\\frac{d\\theta}{2 + \\cos\\theta}$ is ______ (to two decimal places).',
      answer: 3.63, tol: 0.01, calc: () => (2 * Math.PI) / Math.sqrt(3),
      sol: 'Put $z = e^{i\\theta}$: $\\cos\\theta = \\frac{z + z^{-1}}{2}$, $d\\theta = \\frac{dz}{iz}$. The integral becomes $\\oint_{|z|=1}\\frac{2\\,dz}{i(z^2 + 4z + 1)}$. The roots are $-2 \\pm \\sqrt3$; only $z_+ = -2 + \\sqrt3$ is inside, with residue $\\frac{2}{i(z_+ - z_-)} = \\frac{2}{2\\sqrt3\\,i}$. So the integral is $2\\pi i\\cdot\\frac{1}{\\sqrt3\\,i} = \\frac{2\\pi}{\\sqrt3} \\approx 3.63$. (General: $\\int_0^{2\\pi}\\frac{d\\theta}{a + b\\cos\\theta} = \\frac{2\\pi}{\\sqrt{a^2 - b^2}}$.)',
      trap: 'Picking the root $-2 - \\sqrt3$, which lies outside the unit circle.' },
    { id: 'res-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'computing residues',
      q: 'The residue of $\\dfrac{e^{iz}}{z^2 + 1}$ at $z = i$ is',
      options: ['$\\dfrac{e}{2i}$', '$\\dfrac{e^{-1}}{2}$', '$\\dfrac{e^{-1}}{2i}$', '$ie^{-1}$'], answer: 2,
      sol: 'Simple pole: $\\frac{e^{iz}}{z + i}$ at $z = i$ gives $\\frac{e^{i\\cdot i}}{2i} = \\frac{e^{-1}}{2i}$.',
      trap: '$e^{i\\cdot i} = e^{-1}$, not $e$.' },
    { id: 'res-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Fourier-type integrals',
      q: 'The value of $\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{\\cos x}{x^2 + 1}\\,dx$ is ______ (to two decimal places).',
      answer: 1.16, tol: 0.01, calc: () => Math.PI / Math.E,
      sol: 'Write $\\cos x = \\text{Re}\\,e^{ix}$ and integrate $\\frac{e^{iz}}{z^2 + 1}$ round the upper semicircle (Jordan\'s lemma kills the arc). Residue at $i$: $\\frac{e^{-1}}{2i}$. So $\\int\\frac{e^{ix}}{x^2 + 1}dx = 2\\pi i\\cdot\\frac{e^{-1}}{2i} = \\frac{\\pi}{e}$, which is already real. Answer $\\pi/e \\approx 1.16$.',
      trap: 'Using $\\cos z$ itself on the contour fails: $\\cos z$ grows like $e^{|\\text{Im}z|}$ on both half-planes.' },
    { id: 'res-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'contour choice',
      q: 'To evaluate $\\int_0^{2\\pi}R(\\cos\\theta, \\sin\\theta)\\,d\\theta$ for a rational function $R$, the usual contour is',
      options: ['a large semicircle in the upper half-plane', 'a keyhole contour round the positive real axis', 'a rectangle of height $2\\pi$', 'the unit circle, with $z = e^{i\\theta}$'], answer: 3,
      sol: 'With $z = e^{i\\theta}$, $\\cos\\theta = (z + 1/z)/2$, $\\sin\\theta = (z - 1/z)/(2i)$ and $d\\theta = dz/(iz)$, so the integral over one period becomes a closed contour integral round $|z| = 1$ of a rational function of $z$. Only poles inside the unit circle count.',
      trap: 'Semicircles are for integrals along the whole real line; keyholes for $x^a$ or $\\ln x$ on $(0, \\infty)$.' },
    { id: 'res-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'residue at infinity',
      q: 'The sum of the residues of $\\dfrac{z^2 + 1}{z(z - 2)(z + 3)}$ at its three poles is',
      options: ['$0$', '$1$', '$-1$', '$\\tfrac16$'], answer: 1,
      sol: 'Directly: $\\text{Res}_0 = \\frac{1}{(-2)(3)} = -\\frac16$, $\\text{Res}_2 = \\frac{5}{2\\cdot5} = \\frac12$, $\\text{Res}_{-3} = \\frac{10}{(-3)(-5)} = \\frac23$; sum $= 1$. Quick check: for large $|z|$, $f \\approx 1/z$, so a big circle gives $2\\pi i\\cdot1$; the residue at infinity is $-1$ and all residues add to zero.',
      trap: 'Assuming the finite residues always add to 0: that needs $f$ to fall faster than $1/z$.' },
    { id: 'res-015', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'contour choice',
      q: 'For which integrals does closing along the real axis with a large semicircle in the UPPER half-plane work (the arc contribution vanishes)?',
      options: ['$\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{dx}{x^2 + 1}$', '$\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{e^{2ix}}{x^2 + 9}dx$', '$\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{e^{-2ix}}{x^2 + 9}dx$', '$\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{dx}{x^4 + 1}$'], answer: [0, 1, 3],
      sol: 'Rational integrands falling like $1/R^2$ or faster give vanishing arcs in either half-plane. $e^{2iz}$ decays for $\\text{Im}z > 0$, so the upper arc vanishes. But $|e^{-2iz}| = e^{2\\,\\text{Im}z}$ blows up in the upper half-plane; that one must be closed below.',
      trap: 'Sign of $k$ in $e^{ikz}$ decides the half-plane: $k > 0$ up, $k < 0$ down.' },
    { id: 'res-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'residue at infinity',
      q: 'The residue of $f(z) = 1/z$ at $z = \\infty$ is',
      options: ['$0$', '$1$', '$-1$', '$2\\pi i$'], answer: 2,
      sol: 'The residue at infinity is $-\\frac{1}{2\\pi i}\\oint f\\,dz$ round a large anticlockwise circle (anticlockwise as seen from infinity means clockwise for us), equal to minus the coefficient of $1/z$ in the expansion at large $|z|$: $-1$. With the residue $+1$ at 0, the total is 0, as it must be.',
      trap: '$1/z$ is perfectly regular at infinity (it tends to 0), yet its residue there is not 0.' },

    // ---------- level 3 ----------
    { id: 'res-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rational integrals',
      q: 'The value of $\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{dx}{x^4 + 1}$ is ______ (to two decimal places).',
      answer: 2.22, tol: 0.01, calc: () => Math.PI / Math.SQRT2,
      sol: 'Poles in the upper half-plane: $z_1 = e^{i\\pi/4}$ and $z_2 = e^{3i\\pi/4}$. At a root of $z^4 = -1$, $\\text{Res} = \\frac{1}{4z^3} = \\frac{z}{4z^4} = -\\frac z4$. Sum: $-\\frac14(e^{i\\pi/4} + e^{3i\\pi/4}) = -\\frac14\\cdot i\\sqrt2$. Times $2\\pi i$: $\\frac{2\\pi\\sqrt2}{4} = \\frac{\\pi}{\\sqrt2} \\approx 2.22$.',
      trap: 'The trick $\\frac{1}{4z^3} = -\\frac z4$ (using $z^4 = -1$) saves a lot of algebra.' },
    { id: 'res-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Fourier-type integrals',
      q: 'The value of $\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{x\\sin x}{x^2 + 4}\\,dx$ is ______ (to three decimal places).',
      answer: 0.425, tol: 0.003, calc: () => Math.PI * Math.exp(-2),
      sol: 'It is $\\text{Im}\\int\\frac{xe^{ix}}{x^2 + 4}dx$. Here $\\frac{z}{z^2 + 4}$ falls only like $1/z$, but Jordan\'s lemma still kills the upper arc because of $e^{iz}$. Residue at $2i$: $\\frac{2ie^{-2}}{4i} = \\frac{e^{-2}}{2}$. So $\\int\\frac{xe^{ix}}{x^2 + 4} = 2\\pi i\\cdot\\frac{e^{-2}}{2} = i\\pi e^{-2}$, and the imaginary part is $\\pi e^{-2} \\approx 0.425$.',
      trap: 'Without Jordan\'s lemma the $1/R$ decay would look too slow; the exponential is what makes the arc vanish.' },
    { id: 'res-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'principal value',
      q: 'The value of $\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{\\sin 3x}{x}\\,dx$ is',
      options: ['$3\\pi$', '$\\pi$', '$\\pi/3$', '$0$'], answer: 1,
      sol: 'Substitute $u = 3x$: $\\int\\frac{\\sin u}{u/3}\\frac{du}{3} = \\int\\frac{\\sin u}{u}du = \\pi$. By contour integration: the principal value of $\\int\\frac{e^{iax}}{x}dx$ is $i\\pi$ for any $a > 0$ (half a residue from the indented pole at 0), and its imaginary part is $\\pi$.',
      trap: 'The scale factor cancels; only the sign of $a$ matters ($-\\pi$ for $a < 0$).' },
    { id: 'res-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'principal value',
      q: 'The Cauchy principal value of $\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{dx}{(x - 1)(x^2 + 1)}$ is ______ (to two decimal places).',
      answer: -1.57, tol: 0.01, calc: () => -Math.PI / 2,
      sol: 'Pole on the axis at 1 (counts with $\\pi i$, half of $2\\pi i$) and pole at $i$ in the upper half-plane. $\\text{Res}_1 = \\frac{1}{2}$; $\\text{Res}_i = \\frac{1}{(i - 1)2i} = \\frac{1}{-2 - 2i} = -\\frac{1 - i}{4}$. PV $= 2\\pi i\\left(-\\frac{1 - i}{4}\\right) + \\pi i\\cdot\\frac12 = \\frac{-\\pi i - \\pi}{2} + \\frac{\\pi i}{2} = -\\frac{\\pi}{2} \\approx -1.57$. The imaginary parts cancel, as they must for a real integrand.',
      trap: 'Giving the axis pole a full $2\\pi i$ leaves an imaginary part, a sure sign of a slip.' },
    { id: 'res-021', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'computing residues',
      q: 'For $f(z) = \\dfrac{1}{z^2(z - 1)}$, which statements are true?',
      options: ['$\\text{Res}_{z=0}f = -1$', '$\\text{Res}_{z=1}f = 1$', '$\\oint_{|z| = 2}f\\,dz = 0$', '$\\oint_{|z| = 1/2}f\\,dz = 2\\pi i$'], answer: [0, 1, 2],
      sol: 'Double pole at 0: $\\frac{d}{dz}\\frac{1}{z - 1}\\big|_0 = -\\frac{1}{(0 - 1)^2} = -1$. Simple pole at 1: $\\frac{1}{1^2} = 1$. The big circle encloses both: $2\\pi i(-1 + 1) = 0$ (also because $f \\sim 1/z^3$). The small circle encloses only 0: $-2\\pi i$.',
      trap: 'Forgetting the minus sign from differentiating $1/(z - 1)$.' },
    { id: 'res-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'rational integrals',
      q: 'For $a > 0$, $\\displaystyle\\int_0^{\\infty}\\frac{dx}{(x^2 + a^2)^2}$ equals',
      options: ['$\\dfrac{\\pi}{4a^3}$', '$\\dfrac{\\pi}{2a^3}$', '$\\dfrac{\\pi}{4a^2}$', '$\\dfrac{\\pi}{2a}$'], answer: 0,
      sol: 'The integrand is even, so take half the integral over the whole line. Double pole at $ia$: $\\text{Res} = \\frac{d}{dz}(z + ia)^{-2}\\big|_{ia} = -2(2ia)^{-3} = \\frac{1}{4ia^3}$. Whole line: $2\\pi i\\cdot\\frac{1}{4ia^3} = \\frac{\\pi}{2a^3}$; half: $\\frac{\\pi}{4a^3}$. Dimension check: $[x]^{-3}$ ✓.',
      trap: 'Forgetting to halve for the range $0$ to $\\infty$ gives $\\pi/(2a^3)$.' },
    { id: 'res-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'trigonometric integrals',
      q: 'The value of $\\displaystyle\\int_0^{2\\pi}\\frac{\\cos2\\theta}{5 - 4\\cos\\theta}\\,d\\theta$ is ______ (to three decimal places).',
      answer: 0.524, tol: 0.003, calc: () => Math.PI / 6,
      sol: 'Write $\\cos2\\theta = \\text{Re}\\,z^2$ and $5 - 4\\cos\\theta = 5 - 2(z + 1/z) = -\\frac{(2z - 1)(z - 2)}{z}$. Then $\\int\\frac{e^{2i\\theta}d\\theta}{5 - 4\\cos\\theta} = \\oint\\frac{z^2}{-(2z - 1)(z - 2)}\\frac{dz}{i}$. Only $z = \\tfrac12$ is inside: residue of $\\frac{-z^2}{i(2z - 1)(z - 2)}$ there is $\\frac{-1/4}{i\\cdot2\\cdot(-3/2)} = \\frac{1}{12i}$. Times $2\\pi i$: $\\frac{\\pi}{6} \\approx 0.524$, real, so this is the answer.',
      trap: 'Replacing $\\cos2\\theta$ by $(z^2 + z^{-2})/2$ brings a pole at 0 as well; using $\\text{Re}\\,z^2$ avoids it.' },
    { id: 'res-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'computing residues',
      q: 'The residue of $\\dfrac{1}{z^2\\sin z}$ at $z = 0$ is',
      options: ['$0$', '$-\\tfrac16$', '$1$', '$\\tfrac16$'], answer: 3,
      sol: '$z^2\\sin z = z^3\\left(1 - \\frac{z^2}{6} + \\cdots\\right)$, so $\\frac{1}{z^2\\sin z} = \\frac{1}{z^3}\\left(1 + \\frac{z^2}{6} + \\cdots\\right)$. The $z^{-1}$ coefficient is $\\tfrac16$.',
      trap: 'Inverting $1 - z^2/6$ gives $1 + z^2/6$, not $1 - z^2/6$.' },
    { id: 'res-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rational integrals',
      q: 'The value of $\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{dx}{x^2 + 2x + 2}$ is ______ (to two decimal places).',
      answer: 3.14, tol: 0.01, calc: () => Math.PI,
      sol: 'Roots of $z^2 + 2z + 2$: $-1 \\pm i$. Upper one: $-1 + i$, residue $\\frac{1}{(-1 + i) - (-1 - i)} = \\frac{1}{2i}$. Integral $= 2\\pi i\\cdot\\frac{1}{2i} = \\pi$. (Check: completing the square gives $\\int\\frac{dx}{(x + 1)^2 + 1} = \\pi$.)',
      trap: 'Shifting the pole sideways does not change the answer; only the imaginary part of the pole matters here.' },
    { id: 'res-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Fourier-type integrals',
      q: 'The value of $\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{e^{-3ix}}{x^2 + 1}\\,dx$ is',
      options: ['$\\pi e^{-3}$', '$\\pi e^{3}$', '$2\\pi e^{-3}$', '$-\\pi e^{-3}$'], answer: 0,
      sol: '$|e^{-3iz}| = e^{3\\,\\text{Im}z}$ decays in the lower half-plane, so close there; the contour then runs clockwise, giving $-2\\pi i\\times$ the residue at $-i$: $\\frac{e^{-3i(-i)}}{-2i} = \\frac{e^{-3}}{-2i}$. Result: $-2\\pi i\\cdot\\frac{e^{-3}}{-2i} = \\pi e^{-3}$. (As expected, since the integral is $\\int\\frac{\\cos3x}{x^2 + 1}dx$, the same for $\\pm3$.)',
      trap: 'Closing in the upper half-plane picks up $e^{+3}$, a huge value for a bounded integrand.' },
    { id: 'res-027', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'residue at infinity',
      q: 'Let $f = P/Q$ be rational with $\\deg Q \\ge \\deg P + 2$. Which statements are true?',
      options: ['The residues of $f$ at all its finite poles add up to zero', 'The residue of $f$ at infinity is zero', 'The integral of $f$ round any circle enclosing all its poles is zero', '$f$ has no poles'], answer: [0, 1, 2],
      sol: 'For large $|z|$, $|f| \\lesssim C/|z|^2$, so the integral round a circle of radius $R$ is at most $2\\pi R\\cdot C/R^2 \\to 0$; but it is the same for every $R$ large enough, so it is exactly 0. Hence the finite residues add to zero, and so does the residue at infinity (no $1/z$ term). $f$ can have poles, e.g. $1/(z^2 - 1)$ with residues $\\pm\\tfrac12$.',
      trap: 'The sum vanishing does not mean each residue vanishes.' },
    { id: 'res-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'computing residues',
      q: 'The residue of $z\\cos(1/z)$ at $z = 0$ is',
      options: ['$-\\tfrac12$', '$\\tfrac12$', '$0$', '$1$'], answer: 0,
      sol: 'An essential singularity: no formula, only the Laurent series. $z\\cos\\frac1z = z\\left(1 - \\frac{1}{2z^2} + \\frac{1}{24z^4} - \\cdots\\right) = z - \\frac{1}{2z} + \\cdots$. The $z^{-1}$ coefficient is $-\\tfrac12$.',
      trap: 'The limit formulas for poles do not apply at an essential singularity.' },

    // ---------- level 4 ----------
    { id: 'res-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'keyhole contour',
      q: 'The value of $\\displaystyle\\int_0^{\\infty}\\frac{dx}{x^{1/3}(1 + x)}$ is ______ (to two decimal places).',
      answer: 3.63, tol: 0.01, calc: () => Math.PI / Math.sin((2 * Math.PI) / 3),
      sol: 'This is $\\int_0^\\infty\\frac{x^{a-1}}{1 + x}dx$ with $a = \\tfrac23$. Use a keyhole round the branch cut on the positive axis: below the cut $z^{a-1}$ picks up $e^{2\\pi i(a-1)}$, so $(1 - e^{2\\pi ia})I = 2\\pi i\\,\\text{Res}_{z=-1} = 2\\pi i\\,e^{i\\pi(a-1)}$, which gives $I = \\frac{\\pi}{\\sin\\pi a}$. With $a = \\tfrac23$: $\\frac{\\pi}{\\sin(2\\pi/3)} = \\frac{2\\pi}{\\sqrt3} \\approx 3.63$.',
      trap: 'Taking $a = 1/3$ instead of $a - 1 = -1/3$ happens to give the same value here because $\\sin(\\pi/3) = \\sin(2\\pi/3)$; do not rely on it.' },
    { id: 'res-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'summing series',
      q: 'Using $\\pi\\cot(\\pi z)$, the sum $\\displaystyle\\sum_{n=-\\infty}^{\\infty}\\frac{1}{n^2 + 1}$ equals',
      options: ['$\\pi\\tanh\\pi$', '$\\pi\\coth\\pi$', '$\\dfrac{\\pi}{\\sinh\\pi}$', '$\\coth\\pi$'], answer: 1,
      sol: '$\\pi\\cot\\pi z$ has residue 1 at every integer. For $f = \\frac{1}{z^2 + 1}$, the integral of $\\pi\\cot(\\pi z)f(z)$ round a large square vanishes, so $\\sum_nf(n) = -(\\text{residues of }\\pi\\cot(\\pi z)f\\text{ at } \\pm i)$. At $z = i$: $\\frac{\\pi\\cot(i\\pi)}{2i} = \\frac{-i\\pi\\coth\\pi}{2i} = -\\frac{\\pi}{2}\\coth\\pi$, and the same at $-i$. So the sum is $\\pi\\coth\\pi \\approx 3.15$.',
      trap: '$\\cot(i\\pi) = -i\\coth\\pi$; dropping the $i$ ruins the result.' },
    { id: 'res-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'keyhole contour',
      q: 'The value of $\\displaystyle\\int_0^{\\infty}\\frac{\\ln x}{x^2 + 1}\\,dx$ is ______.',
      answer: 0, tol: 0.001,
      sol: 'Substitute $x = 1/t$: $dx = -dt/t^2$ and $x^2 + 1 = (1 + t^2)/t^2$, so the integral becomes $\\int_0^\\infty\\frac{-\\ln t}{1 + t^2}dt$, minus itself. Hence it is 0. (A contour proof uses a half-annulus in the upper half-plane with the branch of $\\ln z$ cut along the negative imaginary axis; the real part of the result is 0 and the imaginary part gives $\\int_0^\\infty\\frac{dx}{1 + x^2} = \\frac\\pi2$.)',
      trap: 'The integrand is negative on $(0, 1)$ and positive on $(1, \\infty)$; the two parts cancel exactly.' },
    { id: 'res-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'principal value',
      q: 'Consider $\\int_{-\\infty}^{\\infty}\\frac{e^{ix}}{x}dx$ with a small semicircle of radius $\\varepsilon$ indenting round $x = 0$. Which statements are true?',
      options: ['A small semicircle going above the pole contributes $-\\pi i\\times\\text{Res}$ as $\\varepsilon \\to 0$', 'The principal value equals $i\\pi$', 'The principal value of $\\int\\frac{\\cos x}{x}dx$ is 0', 'The small semicircle contributes $+\\pi i\\times\\text{Res}$ whether it passes above or below the pole'], answer: [0, 1, 2],
      sol: 'On a small arc round a simple pole, $\\int f\\,dz \\to i\\Delta\\theta\\,\\text{Res}$, where $\\Delta\\theta$ is the angle swept: $-\\pi$ for the arc above (clockwise), $+\\pi$ below. With the arc above, no poles are enclosed: $\\text{PV} - i\\pi\\cdot1 = 0$, so $\\text{PV} = i\\pi$. Real part: PV of $\\int\\frac{\\cos x}{x}$ is 0 (odd integrand); imaginary part: $\\int\\frac{\\sin x}{x} = \\pi$.',
      trap: 'The sign of the half-residue depends on which way the arc goes round; the final PV does not.' },
    { id: 'res-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'rectangular contour',
      q: 'For $0 < a < 1$, a rectangle with sides on $\\text{Im}z = 0$ and $\\text{Im}z = 2\\pi$ gives $\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{e^{ax}}{1 + e^{x}}\\,dx =$',
      options: ['$\\dfrac{\\pi}{\\cos\\pi a}$', '$\\pi\\cot\\pi a$', '$\\dfrac{\\pi}{\\sin\\pi a}$', '$\\dfrac{2\\pi}{\\sin\\pi a}$'], answer: 2,
      sol: 'Shifting $z \\to z + 2\\pi i$ leaves $1 + e^z$ unchanged and multiplies $e^{az}$ by $e^{2\\pi ia}$, so the top side gives $-e^{2\\pi ia}I$; the short sides vanish for $0 < a < 1$. The only pole inside is $z = i\\pi$, with residue $\\frac{e^{i\\pi a}}{e^{i\\pi}} = -e^{i\\pi a}$. So $(1 - e^{2\\pi ia})I = -2\\pi ie^{i\\pi a}$, and $I = \\frac{2\\pi i}{e^{i\\pi a} - e^{-i\\pi a}} = \\frac{\\pi}{\\sin\\pi a}$.',
      trap: 'At $a = \\tfrac12$ the answer must be $\\pi$ (substitute $u = e^{x/2}$); $\\pi\\cot(\\pi/2) = 0$ fails that check.' },
    { id: 'res-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Fourier-type integrals',
      q: 'The value of $\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{\\cos2x}{(x^2 + 1)^2}\\,dx$ is ______ (to three decimal places).',
      answer: 0.638, tol: 0.003, calc: () => (3 * Math.PI * Math.exp(-2)) / 2,
      sol: 'Integrate $\\frac{e^{2iz}}{(z^2 + 1)^2}$ round the upper semicircle. Double pole at $i$: $\\frac{d}{dz}\\left[\\frac{e^{2iz}}{(z + i)^2}\\right]_i = e^{-2}\\left[\\frac{2i}{(2i)^2} - \\frac{2}{(2i)^3}\\right] = e^{-2}\\left[-\\frac{i}{2} - \\frac{i}{4}\\right] = -\\frac{3i}{4}e^{-2}$. Times $2\\pi i$: $\\frac{3\\pi}{2}e^{-2} \\approx 0.638$. (General: $\\frac{\\pi(1 + ka)}{2a^3}e^{-ka}$.)',
      trap: 'At a double pole the derivative hits both $e^{2iz}$ and $(z + i)^{-2}$; missing either term changes the factor 3.' },
    { id: 'res-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'principal value',
      q: 'The value of $\\displaystyle\\int_0^{\\infty}\\frac{\\sin^2x}{x^2}\\,dx$ is',
      options: ['$\\pi$', '$\\pi/4$', '$1$', '$\\pi/2$'], answer: 3,
      sol: 'Write $\\sin^2x = \\frac{1 - \\cos2x}{2} = \\frac12\\text{Re}(1 - e^{2ix})$. The function $\\frac{1 - e^{2iz}}{z^2}$ has a simple pole at 0 with residue $-2i$. Indenting above it: $\\text{PV}\\int_{-\\infty}^{\\infty}\\frac{1 - e^{2ix}}{x^2}dx = \\pi i(-2i) = 2\\pi$. So $\\int_{-\\infty}^{\\infty}\\frac{\\sin^2x}{x^2} = \\pi$, and half of that, $\\pi/2$, from 0 to $\\infty$.',
      trap: 'Forgetting the factor $\\tfrac12$ in $\\sin^2x$ or forgetting to halve the range.' },
    { id: 'res-036', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Fourier-type integrals',
      q: 'For $a > 0$ and real $k$, consider $I(k) = \\displaystyle\\int_{-\\infty}^{\\infty}\\frac{e^{ikx}}{x^2 + a^2}dx$. Which statements are true?',
      options: ['$I(k) = \\dfrac{\\pi}{a}e^{-|k|a}$ for every real $k$', '$I(k)$ is an even function of $k$', 'For $k < 0$ one can still close in the upper half-plane', 'At $k = 0$ it reduces to $\\pi/a$'], answer: [0, 1, 3],
      sol: 'For $k > 0$ close up: $2\\pi i\\frac{e^{-ka}}{2ia} = \\frac\\pi ae^{-ka}$. For $k < 0$ close down (clockwise) round $-ia$: $\\frac\\pi ae^{ka}$. Together $\\frac{\\pi}{a}e^{-|k|a}$, even in $k$ and real (the sine part cancels by symmetry), equal to $\\pi/a$ at $k = 0$. For $k < 0$ the upper arc grows like $e^{|k|R}$, so closing up fails.',
      trap: 'The $|k|$ comes from choosing the right half-plane for each sign; a single formula with $e^{-ka}$ blows up for $k < 0$.' },

    // ---------- level 5 ----------
    { id: 'res-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'summing series',
      q: 'Using $\\pi\\cot(\\pi z)/z^4$, the sum $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{1}{n^4}$ is found to be ______ (to three decimal places).',
      answer: 1.082, tol: 0.002, calc: () => Math.PI ** 4 / 90,
      sol: 'The integral of $\\pi\\cot(\\pi z)/z^4$ round large squares vanishes, so all residues add to 0. At $n \\ne 0$ the residue is $1/n^4$, giving $2\\sum_{n\\ge1}n^{-4}$. At 0, use $\\pi z\\cot\\pi z = 1 - \\frac{(\\pi z)^2}{3} - \\frac{(\\pi z)^4}{45} - \\cdots$, so $\\frac{\\pi\\cot\\pi z}{z^4} = \\frac{1}{z^5}\\left(1 - \\frac{\\pi^2z^2}{3} - \\frac{\\pi^4z^4}{45} - \\cdots\\right)$, with residue $-\\frac{\\pi^4}{45}$. Hence $\\sum n^{-4} = \\frac{\\pi^4}{90} \\approx 1.082$.',
      trap: 'The pole at 0 is of order 5, not 4: $\\cot$ adds one more.' },
    { id: 'res-038', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'wedge contour',
      q: 'Integrating $\\dfrac{1}{1 + z^3}$ round the wedge $0 \\le \\arg z \\le 2\\pi/3$ gives $\\displaystyle\\int_0^{\\infty}\\frac{dx}{1 + x^3} =$',
      options: ['$\\dfrac{2\\pi}{3\\sqrt3}$', '$\\dfrac{\\pi}{3\\sqrt3}$', '$\\dfrac{\\pi}{3}$', '$\\dfrac{2\\pi}{3}$'], answer: 0,
      sol: 'On the ray $z = re^{2\\pi i/3}$, $z^3 = r^3$, so that side gives $-e^{2\\pi i/3}I$. Inside the wedge is one pole, $z_0 = e^{i\\pi/3}$, with residue $\\frac{1}{3z_0^2} = \\frac13e^{-2\\pi i/3}$. So $(1 - e^{2\\pi i/3})I = \\frac{2\\pi i}{3}e^{-2\\pi i/3}$, which simplifies to $I = \\frac{\\pi/3}{\\sin(\\pi/3)} = \\frac{2\\pi}{3\\sqrt3} \\approx 1.21$. (General: $\\int_0^\\infty\\frac{dx}{1 + x^n} = \\frac{\\pi/n}{\\sin(\\pi/n)}$.)',
      trap: 'A full semicircle does not work: the integrand is not even, so the negative axis tells you nothing.' },
    { id: 'res-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'wedge contour',
      q: 'The Fresnel integral $\\displaystyle\\int_0^{\\infty}\\sin(x^2)\\,dx$ equals ______ (to three decimal places).',
      answer: 0.627, tol: 0.003, calc: () => Math.sqrt(Math.PI / 8),
      sol: 'Integrate the entire function $e^{iz^2}$ round the wedge $0 \\le \\arg z \\le \\pi/4$ (no poles; the arc vanishes by a Jordan-type bound). On the ray $z = re^{i\\pi/4}$, $iz^2 = -r^2$, so $\\int_0^\\infty e^{ix^2}dx = e^{i\\pi/4}\\int_0^\\infty e^{-r^2}dr = e^{i\\pi/4}\\frac{\\sqrt\\pi}{2}$. Imaginary part: $\\frac{\\sqrt\\pi}{2}\\cdot\\frac{1}{\\sqrt2} = \\sqrt{\\pi/8} \\approx 0.627$ (the cosine integral has the same value).',
      trap: 'A full semicircle fails: $e^{iz^2}$ grows in parts of the upper half-plane. The $\\pi/4$ wedge is exactly where it stays bounded.' },
    { id: 'res-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'branch points',
      q: 'To find $\\int_0^\\infty\\frac{\\sqrt x}{x^2 + 1}dx$, one integrates $\\frac{\\sqrt z}{z^2 + 1}$ round a keyhole contour. Which statements are true?',
      options: ['$z = 0$ is a branch point of the integrand, not a pole', 'Above and below the cut the two straight-line integrals are equal and cancel', 'The residue theorem cannot be used on a closed contour that winds round $z = 0$ without crossing a cut', '$\\int_0^\\infty\\frac{\\sqrt x}{x^2 + 1}dx = \\frac{\\pi}{\\sqrt2}$'], answer: [0, 2, 3],
      sol: 'Round $z = 0$, $\\sqrt z$ changes sign: a branch point, where no residue is defined; a closed contour must not encircle it unless a cut is crossed, which is why the keyhole hugs the cut. Below the cut $\\sqrt z = -\\sqrt x$ and the path runs inwards, so the two line integrals add: $2I = 2\\pi i(\\text{Res}_i + \\text{Res}_{-i})$ with $\\sqrt i = e^{i\\pi/4}$, $\\sqrt{-i} = e^{3i\\pi/4}$ on this branch: $\\frac{e^{i\\pi/4}}{2i} + \\frac{e^{3i\\pi/4}}{-2i} = \\frac{\\sqrt2}{2i}$. So $I = \\frac{\\pi\\sqrt2}{2} = \\frac{\\pi}{\\sqrt2}$.',
      trap: 'Using $\\sqrt{-i} = e^{-i\\pi/4}$ (the principal value) is wrong on the keyhole branch, where $0 < \\arg z < 2\\pi$.' },
    ...more2,
    ...r4.items,
    ...r5.items,
  ],
  gens: [
    { id: 'res-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'rational integrals',
      make(r) {
        const a = int(r, 1, 6), c = int(r, 1, 3);
        const answer = round((c * Math.PI) / a, 3);
        return { q: `Find $\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{${c}\\,dx}{x^2 + ${a * a}}$ (to three decimal places).`,
          answer, tol: 0.003, a, c,
          sol: `Close in the upper half-plane. The pole at $${a}i$ has residue $\\frac{${c}}{2\\cdot${a}i}$, so the integral is $2\\pi i\\cdot\\frac{${c}}{${2 * a}i} = \\frac{${c}\\pi}{${a}} \\approx ${answer}$.`,
          trap: 'Only the pole in the upper half-plane is enclosed.' };
      },
      verify: (p) => { let s = 0; const N = 200000, L = 2000; for (let i = 0; i < N; i++) { const x = -L + (2 * L * (i + 0.5)) / N; s += p.c / (x * x + p.a * p.a); } return s * (2 * L) / N + (2 * p.c) / L; } },
    { id: 'res-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'trigonometric integrals',
      make(r) {
        const b = int(r, 1, 4), a = b + int(r, 1, 3);
        const answer = round((2 * Math.PI) / Math.sqrt(a * a - b * b), 3);
        return { q: `Find $\\displaystyle\\int_0^{2\\pi}\\frac{d\\theta}{${a} + ${b === 1 ? '' : b}\\cos\\theta}$ (to three decimal places).`,
          answer, tol: 0.003, a, b,
          sol: `With $z = e^{i\\theta}$ the integral becomes $\\oint\\frac{2\\,dz}{i(${b}z^2 + ${2 * a}z + ${b})}$. The roots of $${b}z^2 + ${2 * a}z + ${b}$ multiply to 1, so exactly one is inside the unit circle, and the residue there gives $\\frac{2\\pi}{\\sqrt{${a}^2 - ${b}^2}} = \\frac{2\\pi}{\\sqrt{${a * a - b * b}}} \\approx ${answer}$.`,
          trap: 'Only the root inside $|z| = 1$ counts.' };
      },
      verify: (p) => { let s = 0; const N = 4000; for (let i = 0; i < N; i++) s += 1 / (p.a + p.b * Math.cos((2 * Math.PI * (i + 0.5)) / N)); return (s * 2 * Math.PI) / N; } },
    { id: 'res-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Fourier-type integrals',
      make(r) {
        const a = int(r, 1, 3), k = int(r, 1, 3);
        const answer = round((Math.PI / a) * Math.exp(-k * a), 4);
        return { q: `Find $\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{\\cos ${k === 1 ? '' : k}x}{x^2 + ${a * a}}\\,dx$ (to four decimal places).`,
          answer, tol: Math.max(1e-4, answer * 0.005), a, k,
          sol: `Integrate $\\frac{e^{${k}iz}}{z^2 + ${a * a}}$ round the upper semicircle (Jordan's lemma removes the arc). Residue at $${a}i$: $\\frac{e^{-${k * a}}}{${2 * a}i}$. Result: $2\\pi i\\cdot\\frac{e^{-${k * a}}}{${2 * a}i} = \\frac{\\pi}{${a}}e^{-${k * a}} \\approx ${answer}$, already real.`,
          trap: '$\\cos kz$ itself grows in both half-planes; use $e^{ikz}$ and take the real part.' };
      },
      verify: (p) => (Math.PI / p.a) * Math.exp(-p.k * p.a) },
    { id: 'res-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'computing residues',
      make(r) {
        const al = int(r, -3, 3), be = al + int(r, 1, 4), c = int(r, 1, 3), d = int(r, -3, 3);
        const answer = round((c * al + d) / (al - be), 4);
        return { q: `Find the residue of $\\dfrac{${c === 1 ? '' : c}z ${d < 0 ? '- ' + -d : '+ ' + d}}{(z ${al < 0 ? '+ ' + -al : '- ' + al})(z ${be < 0 ? '+ ' + -be : '- ' + be})}$ at $z = ${al}$ (to four decimal places).`,
          answer, tol: Math.max(1e-4, Math.abs(answer) * 0.005), al, be, c, d,
          sol: `Simple pole: multiply by $(z - (${al}))$ and set $z = ${al}$: $\\frac{${c}(${al}) + (${d})}{${al} - (${be})} = \\frac{${c * al + d}}{${al - be}} \\approx ${answer}$.`,
          trap: 'Watch the signs in $z - \\alpha$ when $\\alpha$ is negative.' };
      },
      verify: (p) => { const e = 1e-6, z = p.al + e; return (e * (p.c * z + p.d)) / ((z - p.al) * (z - p.be)) * 1 + 0 * e; } },
    { id: 'res-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'wedge contour',
      make(r) {
        const n = int(r, 3, 8);
        const answer = round((Math.PI / n) / Math.sin(Math.PI / n), 4);
        return { q: `Find $\\displaystyle\\int_0^{\\infty}\\frac{dx}{1 + x^{${n}}}$ (to four decimal places).`,
          answer, tol: 2e-4, n,
          sol: `Use the wedge $0 \\le \\arg z \\le 2\\pi/${n}$: on its second side $z^{${n}} = r^{${n}}$, and the only pole inside is $z_0 = e^{i\\pi/${n}}$ with residue $\\frac{1}{${n}z_0^{${n - 1}}} = -\\frac{z_0}{${n}}$. Then $(1 - e^{2\\pi i/${n}})I = -\\frac{2\\pi i}{${n}}e^{i\\pi/${n}}$, so $I = \\frac{\\pi/${n}}{\\sin(\\pi/${n})} \\approx ${answer}$.`,
          trap: 'For odd $n$ the integrand is not even, so a semicircle cannot be used.' };
      },
      verify: (p) => { // substitute x = t/(1-t) on (0,1), midpoint rule
        let s = 0; const N = 200000; for (let i = 0; i < N; i++) { const t = (i + 0.5) / N, x = t / (1 - t); s += 1 / (1 + x ** p.n) / (1 - t) ** 2; } return s / N; } },
    { id: 'res-g06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'principal value',
      make(r) {
        const a = choose(r, [-3, -2, -1, 1, 2, 3, 0.5, -0.5]);
        const answer = round((-Math.PI * a) / (1 + a * a), 4);
        return { q: `Find the principal value of $\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{dx}{(x ${a < 0 ? '+ ' + -a : '- ' + a})(x^2 + 1)}$ (to four decimal places).`,
          answer, tol: 2e-4, a,
          sol: `The pole on the axis at $x = ${a}$ counts with $\\pi i$ and the pole at $i$ with $2\\pi i$. $\\text{Res}_{${a}} = \\frac{1}{${a}^2 + 1} = \\frac{1}{${1 + a * a}}$; $\\text{Res}_i = \\frac{1}{(i - ${a})2i} = -\\frac{1 - ${a}i}{2(1 + ${a * a})}$. Adding $2\\pi i\\,\\text{Res}_i + \\pi i\\,\\text{Res}_{${a}}$, the imaginary parts cancel and the PV is $-\\frac{\\pi(${a})}{1 + ${a * a}} \\approx ${answer}$.`,
          trap: 'A pole on the real axis contributes half of $2\\pi i\\,\\text{Res}$.' };
      },
      verify: (p) => { // symmetric PV numerically: integrate g(t) = f(a+t) + f(a-t) over t > 0
        const f = (x) => 1 / ((x - p.a) * (x * x + 1)); let s = 0; const N = 400000, L = 4000;
        for (let i = 0; i < N; i++) { const t = (L * (i + 0.5)) / N; s += f(p.a + t) + f(p.a - t); } return (s * L) / N; } },
    { id: 'res-g07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'computing residues',
      make(r) {
        const a = int(r, 1, 3), n = int(r, 2, 4);
        const show = (p, q) => `$${frac(p, q)}$`;
        const right = show(a ** (n - 1), fact(n - 1));
        const o = mcqOptions(r, right, [show(a ** n, fact(n)), show(a ** (n - 1), fact(n)), show(a ** (n - 1), 1), show(a ** (n + 1), fact(n + 1)), show(2 * a ** (n - 1), fact(n - 1)), show(-(a ** (n - 1)), fact(n - 1)), show(a ** (n - 1), 2 * fact(n - 1))]);
        return { q: `The residue of $\\dfrac{e^{${a === 1 ? '' : a}z}}{z^{${n}}}$ at $z = 0$ is`, ...o,
          sol: `$\\frac{e^{${a}z}}{z^{${n}}} = \\sum_k\\frac{${a}^kz^{k - ${n}}}{k!}$. The $z^{-1}$ term has $k = ${n - 1}$: coefficient $\\frac{${a}^{${n - 1}}}{${n - 1}!} = ${frac(a ** (n - 1), fact(n - 1))}$.`,
          trap: 'For a pole of order $n$ the residue uses the $(n-1)$th derivative, divided by $(n-1)!$.' };
      } },
    { id: 'res-g08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'summing series',
      make(r) {
        const a = int(r, 1, 3);
        const answer = round((Math.PI / a) / Math.tanh(Math.PI * a), 4);
        return { q: `Using $\\pi\\cot(\\pi z)$, find $\\displaystyle\\sum_{n=-\\infty}^{\\infty}\\frac{1}{n^2 + ${a * a}}$ (to four decimal places).`,
          answer, tol: 2e-4, a,
          sol: `The sum equals minus the residues of $\\frac{\\pi\\cot\\pi z}{z^2 + ${a * a}}$ at $z = \\pm${a}i$. At $${a}i$: $\\frac{\\pi\\cot(${a}\\pi i)}{${2 * a}i} = \\frac{-i\\pi\\coth(${a}\\pi)}{${2 * a}i} = -\\frac{\\pi}{${2 * a}}\\coth(${a}\\pi)$; the same at $-${a}i$. So the sum is $\\frac{\\pi}{${a}}\\coth(${a}\\pi) \\approx ${answer}$.`,
          trap: '$\\cot(ix) = -i\\coth x$.' };
      },
      verify: (p) => { let s = 1 / (p.a * p.a); for (let n = 1; n < 200000; n++) s += 2 / (n * n + p.a * p.a); return s + 2 / 200000; } },
    ...more,
    ...r4.gens,
    ...r5.gens,
  ],
};

// Tidy signs in generated text ("+ -3" -> "- 3", "1x" -> "x"); see _signs.js.
export default tidyPhys(topicBank, ["res-g01","res-g02","res-g03","res-g06","res-g07","res-g08","res-m33","res-m34","res-m35"], { neg: ["res-g06"] });
