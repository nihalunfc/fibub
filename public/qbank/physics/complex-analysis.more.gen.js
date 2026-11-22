// Extra question shapes for complex-analysis (templates cax-m31..m35). Imported by complex-analysis.js.
import { int, choose, mcqOptions, shuffle, round } from '../_util.js';
import { msqOf, frac } from './_more.js';
import { oneOf, matchOne } from './_odd.js';

export default [
  { id: 'cax-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'analytic functions', format: 'statements',
    make(r) {
      const n = int(r, 2, 5), a = int(r, 2, 6), not = r() < 0.5;
      const m = msqOf(r, [
        [`$z^{${n}}$ is analytic on the whole plane`, true, 'A polynomial in $z$ is entire.'],
        [`$\\bar z^{${n}}$ is analytic in some open disc`, false, `$\\partial f/\\partial\\bar z = ${n}\\bar z^{${n - 1}} \\ne 0$ except at $z = 0$, so it is nowhere analytic (analytic needs a whole neighbourhood).`],
        ['$|z|^2$ is complex-differentiable only at $z = 0$', true, 'With $u = x^2 + y^2$, $v = 0$ the Cauchy-Riemann equations give $2x = 0$ and $2y = 0$.'],
        [`$e^{${a}z}$ never vanishes`, true, `$|e^{${a}z}| = e^{${a}x} \\gt 0$.`],
        ['a bounded entire function is constant', true, 'This is Liouville\'s theorem.'],
        ['$\\sin z$ is bounded on $\\mathbb C$', false, '$\\sin(iy) = i\\sinh y$ grows without bound; only on the real axis is $|\\sin z| \\le 1$.'],
        ['the zeros of a non-constant analytic function on a connected open set are isolated', true, 'Otherwise the Taylor series would vanish identically at a limit point (identity theorem).'],
        ['the real part of a non-constant analytic function can have a strict local maximum inside its domain', false, 'The real part is harmonic and obeys the maximum principle.'],
        [`the equation $\\cos z = ${a}$ has no solution`, false, `$\\cos z$ takes every complex value: $\\cos(iy) = \\cosh y$ reaches ${a} at $y = \\cosh^{-1}${a}$.`],
        ['if $f$ is analytic and $|f|$ is constant on a connected open set, then $f$ is constant', true, 'By the Cauchy-Riemann equations (or the open mapping theorem) a non-constant analytic map cannot keep $|f|$ fixed.'],
      ], { not });
      return { q: `Which of the following statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Functions bounded on the real axis ($\\sin$, $\\cos$) are unbounded in the complex plane.' };
    } },
  { id: 'cax-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'entire functions', format: 'which is NOT',
    make(r) {
      const a = int(r, 2, 5), n = int(r, 2, 4), not = r() < 0.5;
      const m = oneOf(r, [
        [`$\\cos(${a}z)$`, true, 'Its power series converges for every $z$.'],
        [`$z^{${n}}e^{z}$`, true, 'A product of entire functions is entire.'],
        ['$\\sinh z$', true, '$(e^{z} - e^{-z})/2$ is entire.'],
        [`$e^{z^{${n}}}$`, true, 'A composition of entire functions is entire.'],
        ['$\\dfrac{\\sin z}{z}$ (with value 1 at $z = 0$)', true, 'The singularity at 0 is removable: the series is $1 - z^2/3! + \\dots$ everywhere.'],
        ['$\\dfrac{e^{z} - 1}{z}$ (with value 1 at $z = 0$)', true, 'Removable singularity: $1 + z/2! + z^2/3! + \\dots$.'],
        ['$\\tan z$', false, 'Poles where $\\cos z = 0$, at $z = \\pi/2 + k\\pi$.'],
        [`$\\dfrac{1}{z^2 + ${a * a}}$`, false, `Poles at $z = \\pm ${a}i$.`],
        ['$\\text{Log}\\,z$', false, 'Branch point at 0 and a branch cut; not analytic there.'],
        ['$\\bar z$', false, 'Fails the Cauchy-Riemann equations everywhere ($u_x = 1 \\ne v_y = -1$).'],
        [`$e^{${a}/z}$`, false, 'Essential singularity at $z = 0$.'],
      ], not);
      return { q: `Which function is ${not ? '<b>NOT</b> entire' : 'entire'} (analytic at every point of the complex plane)?`, ...m,
        trap: 'A removable singularity, once filled in, does not spoil analyticity; a pole, branch point or essential singularity does.' };
    } },
  { id: 'cax-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Cauchy integral formula', format: 'contour geometry',
    make(r) {
      const a = int(r, -4, 4), b = a + choose(r, [-5, -3, -2, -1, 1, 2, 3, 5]), R = int(r, 0, 4) + 0.5;
      const ia = Math.abs(a) < R, ib = Math.abs(b) < R, d = a - b, ad = Math.abs(d);
      const pi = (num) => { const f = frac(num, ad); return f === '1' ? '\\pi i' : `${f}\\pi i`; };
      const vals = { zero: '$0$', plus: `$${pi(2)}$`, minus: `$-${pi(2)}$`, dbl: `$${pi(4)}$` };
      let key = 'zero';
      if (ia && !ib) key = d > 0 ? 'plus' : 'minus';
      if (ib && !ia) key = d > 0 ? 'minus' : 'plus';
      const o = mcqOptions(r, vals[key], shuffle(r, Object.keys(vals).filter((k) => k !== key).map((k) => vals[k])));
      const zf = (x) => (x === 0 ? 'z' : `(z ${x < 0 ? '+' : '-'} ${Math.abs(x)})`);
      return { q: `The integral $\\displaystyle\\oint_{|z| = ${R}}\\frac{dz}{${zf(a)}${zf(b)}}$, taken anticlockwise, equals`, ...o,
        sol: `The poles are at $z = ${a}$ (${ia ? 'inside' : 'outside'} the circle of radius ${R}) and $z = ${b}$ (${ib ? 'inside' : 'outside'}). Their residues are $\\tfrac{1}{${a} - (${b})} = \\tfrac{1}{${d}}$ and $\\tfrac{1}{${b} - (${a})} = \\tfrac{1}{${-d}}$. ${ia && ib ? 'Both are inside and the residues cancel, so the integral is 0 (as it must be: the integrand falls off like $1/z^2$, so a large circle gives zero).' : !ia && !ib ? 'Neither pole is inside, so by Cauchy\'s theorem the integral is 0.' : `Only one pole is inside, so the integral is $2\\pi i\\times$ its residue $= ${vals[key].replace(/\$/g, '')}$.`}`,
        trap: 'Check which poles lie inside the contour before adding residues; with both inside, they cancel here.' };
    } },
  { id: 'cax-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'power series',
    make(r) {
      const pts = shuffle(r, [[3, 4, 5], [-4, 3, 5], [0, 2, 2], [-2, 0, 2], [6, 8, 10], [0, -3, 3], [1, 0, 1], [-3, -4, 5], [5, 12, 13], [0, 4, 4]]);
      const p1 = pts[0], p2 = pts.find((p) => p[2] !== p1[2]);
      const zs = (p) => (p[0] === 0 ? `${p[1] === 1 ? '' : p[1] === -1 ? '-' : p[1]}i` : p[1] === 0 ? `${p[0]}` : `${p[0]} ${p[1] < 0 ? '-' : '+'} ${Math.abs(p[1])}i`);
      const num = choose(r, ['1', 'e^{z}', '\\sin z', 'z^2 + 1']);
      const ans = Math.min(p1[2], p2[2]), far = Math.max(p1[2], p2[2]), sep = round(Math.hypot(p1[0] - p2[0], p1[1] - p2[1]), 2);
      const o = mcqOptions(r, ans, shuffle(r, [far, sep, (p1[2] + p2[2]) / 2, ans * ans, 1]));
      return { q: `The Taylor series of $f(z) = \\dfrac{${num}}{(z - z_1)(z - z_2)}$ about $z = 0$, with $z_1 = ${zs(p1)}$ and $z_2 = ${zs(p2)}$, has radius of convergence`, ...o,
        sol: `A Taylor series converges in the largest disc about the centre that contains no singularity. The numerator $${num}$ is entire, so the only singularities are the poles at distances $|z_1| = ${p1[2]}$ and $|z_2| = ${p2[2]}$ from 0. The radius is the nearer one: $${ans}$.`,
        trap: 'The radius is set by the nearest singularity in the complex plane, even when the function looks smooth on the real axis.' };
    } },
  { id: 'cax-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'conformal maps', format: 'match',
    make(r) {
      const c = int(r, 1, 3), th = choose(r, [['\\pi/6', '\\pi/3'], ['\\pi/8', '\\pi/4'], ['\\pi/5', '2\\pi/5']]);
      const L = { cO: 'a circle centred at the origin', ray: 'a ray (half-line) starting at the origin', cT: 'a circle passing through the origin (origin itself excluded)', lO: 'a straight line through the origin', par: 'a parabola', ln: 'a straight line not through the origin' };
      const cas = choose(r, [
        [`$w = e^{z}$`, `the vertical line $\\text{Re}\\,z = ${c}$`, 'cO', `$w = e^{${c}}e^{iy}$: as $y$ runs over the reals, $w$ goes round the circle $|w| = e^{${c}}$ (infinitely many times).`],
        [`$w = e^{z}$`, `the horizontal line $\\text{Im}\\,z = ${th[0]}$`, 'ray', `$w = e^{x}e^{i${th[0]}}$: the modulus $e^{x}$ runs over $(0, \\infty)$ at fixed argument $${th[0]}$, an open ray from the origin.`],
        [`$w = 1/z$`, `the line $\\text{Re}\\,z = ${c}$`, 'cT', `Lines not through the origin map to circles through the origin: here $|w - \\tfrac{1}{${2 * c}}| = \\tfrac{1}{${2 * c}}$.`],
        [`$w = 1/z$`, `the circle $|z - ${c}| = ${c}$`, 'ln', `Circles through the origin map to lines not through the origin: here $\\text{Re}\\,w = \\tfrac{1}{${2 * c}}$.`],
        [`$w = 1/z$`, `the line $y = ${c === 1 ? '' : c}x$`, 'lO', `$1/z = \\bar z/|z|^2$ has argument $-\\arg z$, so the line (without the origin) maps to the line through the origin at the opposite angle, $v = -${c === 1 ? '' : c}u$.`],
        [`$w = z^2$`, `the ray $\\arg z = ${th[0]}$`, 'ray', `Squaring doubles the argument: the ray $\\arg w = ${th[1]}$.`],
        [`$w = z^2$`, `the line $\\text{Re}\\,z = ${c}$`, 'par', `With $z = ${c} + iy$, $u = ${c * c} - y^2$ and $v = ${2 * c}y$, so $u = ${c * c} - v^2/${4 * c * c}$: a parabola opening to the left.`],
        [`$w = z^2$`, `the circle $|z| = ${c}$`, 'cO', `$|w| = |z|^2 = ${c * c}$ (traversed twice).`],
      ]);
      return { q: `Under the map ${cas[0]}, the image of ${cas[1]} is`, ...matchOne(r, L, [cas[1], cas[2], cas[3]]),
        trap: 'Under $1/z$, lines and circles swap according to whether they pass through the origin.' };
    } },
];
