// Analytic functions and Cauchy's theorem: Cauchy-Riemann equations, harmonic functions, contour integrals, Cauchy's
// integral formula, Taylor and Laurent series, zeros and singularities, Liouville, maximum modulus, Rouche and the
// argument principle, branch points and conformal maps (GATE level). Algebra of complex numbers: JAM topic
// `complex-numbers`. Residue calculus: topic `residues`.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round } from '../_util.js';
import more from './complex-analysis.more.gen.js';
import more2 from './complex-analysis.more2.gen.js';
import r4 from './complex-analysis.r4.gen.js';
import r5 from './complex-analysis.r5.gen.js';

const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));

import { tidyPhys } from './_signs.js';

const topicBank = {
  topic: 'complex-analysis',
  items: [
    // ---------- level 1 ----------
    { id: 'cax-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'analytic functions',
      q: 'Which of these functions of $z = x + iy$ is analytic in the whole complex plane?',
      options: ['$|z|^2$', '$\\bar z$', '$z^2e^{z}$', '$\\text{Re}\\,z$'], answer: 2,
      sol: 'Products and compositions of entire functions are entire, and $z^2$ and $e^z$ are both entire. The others depend on $\\bar z$: for $\\bar z = x - iy$, $u_x = 1$ but $v_y = -1$, so Cauchy-Riemann fails everywhere. $|z|^2 = z\\bar z$ satisfies CR only at $z = 0$, and $\\text{Re}\\,z = (z + \\bar z)/2$ nowhere.',
      trap: 'A function that is real-valued and non-constant (like $\\text{Re}\\,z$ or $|z|^2$) can never be analytic on an open set.' },
    { id: 'cax-002', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Cauchy-Riemann',
      q: '$f = u + iv$ is analytic with $u = x^2 - y^2 + 3x$ and $v(0, 0) = 0$. The value of $v(1, 1)$ is ______.',
      answer: 5, tol: 0,
      sol: 'Cauchy-Riemann: $v_y = u_x = 2x + 3$, so $v = 2xy + 3y + g(x)$. Then $v_x = 2y + g\'(x)$ must equal $-u_y = 2y$, so $g$ is a constant, zero by $v(0,0) = 0$. $v = 2xy + 3y$ and $v(1, 1) = 5$. (Indeed $f = z^2 + 3z$.)',
      trap: 'Forgetting the $3y$ from integrating the constant 3 in $u_x$.' },
    { id: 'cax-003', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'contour integrals',
      q: 'The integral $\\oint_{|z| = 1} \\dfrac{dz}{z}$, taken anticlockwise, equals',
      options: ['$0$', '$2\\pi i$', '$\\pi i$', '$2\\pi$'], answer: 1,
      sol: 'On the circle $z = e^{i\\theta}$, $dz = ie^{i\\theta}d\\theta$, so the integrand is $i\\,d\\theta$ and the integral is $\\int_0^{2\\pi} i\\,d\\theta = 2\\pi i$. This single integral is the seed of the whole residue theorem.',
      trap: 'Cauchy\'s theorem does not give 0 here: $1/z$ is not analytic at the origin inside the circle.' },
    { id: 'cax-004', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'power series',
      q: 'The radius of convergence of $\\displaystyle\\sum_{n=0}^{\\infty}\\frac{z^n}{2^n}$ is',
      options: ['$1/2$', '$1$', '$2$', '$\\infty$'], answer: 2,
      sol: 'Ratio test: $|a_{n+1}/a_n| = |z|/2 < 1$ for $|z| < 2$. Equivalently the sum is $1/(1 - z/2)$, whose only singularity is at $z = 2$, a distance 2 from the centre.',
      trap: 'Reading the radius as the ratio of coefficients upside down gives $1/2$.' },
    { id: 'cax-005', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Cauchy theorem',
      q: 'The value of $\\oint_{|z| = 3} (z^3 + 2z)\\,dz$, taken anticlockwise, is ______.',
      answer: 0, tol: 0,
      sol: 'A polynomial is entire, so by Cauchy\'s theorem its integral round any closed curve is 0. (Each power $z^n$ with $n \\ge 0$ has the antiderivative $z^{n+1}/(n+1)$, which returns to its starting value.)',
      trap: 'Only $z^{-1}$ survives a closed loop; positive powers always give 0.' },
    { id: 'cax-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'singularities',
      q: 'The singularity of $\\dfrac{\\sin z}{z}$ at $z = 0$ is',
      options: ['a simple pole', 'an essential singularity', 'a branch point', 'removable'], answer: 3,
      sol: '$\\dfrac{\\sin z}{z} = 1 - \\dfrac{z^2}{3!} + \\dfrac{z^4}{5!} - \\cdots$ has no negative powers, so defining its value at 0 as 1 makes it analytic there.',
      trap: 'Division by $z$ does not make a pole when the numerator also vanishes at $z = 0$.' },

    // ---------- level 2 ----------
    { id: 'cax-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Cauchy integral formula',
      q: 'The value of $\\dfrac{1}{2\\pi i}\\oint_{|z| = 2}\\dfrac{e^{z}}{z - 1}\\,dz$ (anticlockwise) is ______ (to two decimal places).',
      answer: 2.72, tol: 0.01, calc: () => Math.E,
      sol: 'Cauchy\'s integral formula: $f(a) = \\frac{1}{2\\pi i}\\oint\\frac{f(z)}{z - a}dz$ for $a$ inside the curve and $f$ analytic. Here $f = e^z$ and $a = 1$ lies inside $|z| = 2$, so the value is $e \\approx 2.72$.',
      trap: 'Check that the point is inside the contour: with $|z| = 1/2$ the answer would be 0.' },
    { id: 'cax-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'harmonic functions',
      q: 'A harmonic conjugate of $u(x, y) = e^{x}\\cos y$ (so that $u + iv$ is analytic) is',
      options: ['$e^{x}\\sin y$', '$-e^{x}\\sin y$', '$e^{-x}\\sin y$', '$e^{x}\\cos y$'], answer: 0,
      sol: '$v_y = u_x = e^x\\cos y$ gives $v = e^x\\sin y + g(x)$, and $v_x = e^x\\sin y + g\' = -u_y = e^x\\sin y$, so $g$ is constant. Then $u + iv = e^x(\\cos y + i\\sin y) = e^{z}$.',
      trap: 'The sign: $-e^x\\sin y$ satisfies Laplace\'s equation too, but pairs with $u$ to make $\\overline{e^{z}}$, which is not analytic.' },
    { id: 'cax-009', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'harmonic functions',
      q: 'Which of these functions are harmonic ($\\nabla^2 u = 0$) in the whole $xy$-plane?',
      options: ['$x^2 - y^2$', '$x^2 + y^2$', '$e^{x}\\sin y$', '$x^3 - 3xy^2$'], answer: [0, 2, 3],
      sol: 'Real and imaginary parts of entire functions are harmonic: $x^2 - y^2 = \\text{Re}\\,z^2$, $e^x\\sin y = \\text{Im}\\,e^z$, $x^3 - 3xy^2 = \\text{Re}\\,z^3$. But $\\nabla^2(x^2 + y^2) = 4 \\ne 0$.',
      trap: 'Check $u_{xx} + u_{yy}$ directly: $x^2 + y^2$ gives $2 + 2$, not $2 - 2$.' },
    { id: 'cax-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Cauchy integral formula',
      q: 'The integral $\\oint_{|z| = 1}\\dfrac{\\cos z}{z^3}\\,dz$ (anticlockwise) equals $k\\pi i$. The value of $k$ is ______.',
      answer: -1, tol: 0,
      sol: 'The derivative form of Cauchy\'s formula: $\\oint\\frac{f(z)}{(z - a)^{n+1}}dz = \\frac{2\\pi i}{n!}f^{(n)}(a)$. With $f = \\cos z$, $n = 2$, $a = 0$: $f\'\'(0) = -\\cos0 = -1$, so the integral is $\\frac{2\\pi i}{2}(-1) = -\\pi i$ and $k = -1$.',
      trap: 'Forgetting the $1/n!$ gives $-2\\pi i$.' },
    { id: 'cax-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Laurent series',
      q: 'For $0 < |z| < 1$, the Laurent series of $\\dfrac{1}{z(1 - z)}$ is',
      options: ['$-\\dfrac1z - 1 - z - z^2 - \\cdots$', '$\\dfrac1z + 1 + z + z^2 + \\cdots$', '$\\dfrac1z - 1 + z - z^2 + \\cdots$', '$1 + z + z^2 + \\cdots$'], answer: 1,
      sol: 'For $|z| < 1$, $\\frac{1}{1 - z} = 1 + z + z^2 + \\cdots$. Dividing by $z$: $\\frac1z + 1 + z + \\cdots$. The coefficient of $1/z$ is 1, the residue at 0.',
      trap: 'The alternating signs belong to $1/(1 + z)$.' },
    { id: 'cax-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'singularities',
      q: 'The order of the pole of $\\dfrac{1}{z^2\\sin z}$ at $z = 0$ is',
      options: ['$1$', '$2$', '$3$', 'it is an essential singularity'], answer: 2,
      sol: '$\\sin z = z(1 - z^2/6 + \\cdots)$ has a simple zero at 0, so $z^2\\sin z$ has a zero of order 3 and its reciprocal a pole of order 3.',
      trap: 'Counting only the visible $z^2$ gives 2.' },
    { id: 'cax-013', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'power series',
      q: 'The Taylor series of $\\dfrac{1}{z^2 + 4}$ about $z = 1$ has radius of convergence ______ (to two decimal places).',
      answer: 2.24, tol: 0.01, calc: () => Math.sqrt(5),
      sol: 'A Taylor series converges out to the nearest singularity. The singularities are $z = \\pm2i$, both at distance $|1 - 2i| = \\sqrt5 \\approx 2.24$ from the centre.',
      trap: 'On the real axis the function is perfectly smooth; the complex poles still limit the series.' },
    { id: 'cax-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Cauchy-Riemann',
      q: 'In polar form $z = re^{i\\theta}$, the Cauchy-Riemann equations for $f = u(r, \\theta) + iv(r, \\theta)$ are',
      options: ['$u_r = v_\\theta$, $v_r = -u_\\theta$', '$u_r = rv_\\theta$, $v_r = -ru_\\theta$', '$u_r = -\\tfrac1r v_\\theta$, $v_r = \\tfrac1r u_\\theta$', '$u_r = \\tfrac1r v_\\theta$, $v_r = -\\tfrac1r u_\\theta$'], answer: 3,
      sol: 'Moving a distance $dr$ radially or $r\\,d\\theta$ round must give the same derivative: $f\'(z) = e^{-i\\theta}(u_r + iv_r) = \\frac{e^{-i\\theta}}{ir}(u_\\theta + iv_\\theta)$. Equating real and imaginary parts: $u_r = \\frac1r v_\\theta$ and $v_r = -\\frac1r u_\\theta$. Check with $\\ln z = \\ln r + i\\theta$: $u_r = 1/r = \\frac1r\\cdot1$ ✓.',
      trap: 'Dropping the $1/r$: an angle is not a length.' },
    { id: 'cax-015', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Liouville',
      q: 'Which statements are true?',
      options: ['A bounded entire function is constant', 'Every non-constant polynomial has a zero in $\\mathbb C$', '$\\sin z$ is bounded on $\\mathbb C$', '$|e^{z}| = e^{\\text{Re}\\,z}$'], answer: [0, 1, 3],
      sol: 'Liouville\'s theorem gives the first; applied to $1/p(z)$ it proves the fundamental theorem of algebra. $\\sin(iy) = i\\sinh y$ grows without bound, so $\\sin z$ is not bounded (consistent with Liouville, since it is entire and not constant). $|e^{x + iy}| = e^x|e^{iy}| = e^x$.',
      trap: '$|\\sin x| \\le 1$ on the real line does not survive off it.' },
    { id: 'cax-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Cauchy integral formula',
      q: 'The integral $\\oint_{|z - 1| = 1}\\dfrac{dz}{z^2 - 1}$ (anticlockwise) equals $k\\pi i$. The value of $k$ is ______.',
      answer: 1, tol: 0,
      sol: 'The circle has centre 1 and radius 1, so it encloses $z = 1$ but not $z = -1$ (distance 2). Write $\\frac{1}{z^2 - 1} = \\frac{1/(z + 1)}{z - 1}$; Cauchy\'s formula gives $2\\pi i\\cdot\\frac{1}{1 + 1} = \\pi i$, so $k = 1$.',
      trap: 'Including $z = -1$ as well makes the two contributions cancel and gives 0.' },

    // ---------- level 3 ----------
    { id: 'cax-017', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'analytic functions',
      q: 'The function $f(z) = |z|^2$ is',
      options: ['analytic everywhere', 'complex-differentiable only at $z = 0$, and analytic nowhere', 'differentiable nowhere', 'analytic on the real axis'], answer: 1,
      sol: '$u = x^2 + y^2$, $v = 0$. CR needs $u_x = v_y$: $2x = 0$, and $u_y = -v_x$: $2y = 0$. Both hold only at the origin, and the partial derivatives are continuous there, so $f\'(0)$ exists. Analytic means differentiable in a whole neighbourhood, which fails at every point.',
      trap: 'Differentiable at a point is not the same as analytic at that point.' },
    { id: 'cax-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Cauchy-Riemann',
      q: '$f = u + iv$ is analytic with $v = 2xy + y$ and $f(0) = 0$. The value of $\\text{Re}\\,f(2 + i)$ is ______.',
      answer: 5, tol: 0,
      sol: '$u_x = v_y = 2x + 1$ gives $u = x^2 + x + h(y)$, and $u_y = h\'(y) = -v_x = -2y$ gives $h = -y^2 + C$, with $C = 0$ from $f(0) = 0$. So $u = x^2 - y^2 + x$ and $f = z^2 + z$. At $2 + i$: $(2 + i)^2 + (2 + i) = 5 + 5i$, real part 5.',
      trap: 'Finding $f$ as a function of $z$ (Milne-Thomson: set $y = 0$, $x = z$) is quicker than finding $u$.' },
    { id: 'cax-019', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'singularities',
      q: 'For $f(z) = \\dfrac{1}{z(z - 2)^2}$, which statements are true?',
      options: ['$z = 0$ is a simple pole', '$z = 2$ is a pole of order 2', 'The Laurent series about $0$ converges in $0 < |z| < 2$', 'The residue at $z = 2$ is $\\tfrac14$'], answer: [0, 1, 2],
      sol: 'The orders of the poles are the orders of the zeros of the denominator: 1 at 0, 2 at 2. A Laurent series about 0 converges out to the next singularity, at distance 2. Residue at 2: $\\frac{d}{dz}\\left(\\frac1z\\right)_{z=2} = -\\frac{1}{4}$, not $+\\frac14$.',
      trap: 'For the double pole, differentiate $1/z$: the derivative brings a minus sign.' },
    { id: 'cax-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Cauchy integral formula',
      q: 'The integral $\\oint_{|z| = 3}\\dfrac{z e^{z}}{(z - 1)^3}\\,dz$ (anticlockwise) equals $k\\pi i$. The value of $k$ is ______ (to two decimal places).',
      answer: 8.15, tol: 0.02, calc: () => 3 * Math.E,
      sol: 'With $f = ze^z$: $f\' = (z + 1)e^z$, $f\'\' = (z + 2)e^z$, so $f\'\'(1) = 3e$. Then $\\oint = \\frac{2\\pi i}{2!}f\'\'(1) = 3e\\,\\pi i$ and $k = 3e \\approx 8.15$.',
      trap: 'Forgetting the product rule when differentiating $ze^z$ twice.' },
    { id: 'cax-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'branch points',
      q: 'Which of these functions has a branch point at $z = 0$?',
      options: ['$\\dfrac{\\sin z}{z}$', '$e^{1/z}$', '$\\dfrac{1}{z^2}$', '$z^{1/2}$'], answer: 3,
      sol: 'Going once round the origin, $z^{1/2} = r^{1/2}e^{i\\theta/2}$ comes back multiplied by $e^{i\\pi} = -1$: it does not return to its starting value, which is what a branch point means. The others are single-valued: removable, essential and a double pole respectively.',
      trap: 'An essential singularity like $e^{1/z}$ is wild, but it is single-valued, so it is not a branch point.' },
    { id: 'cax-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'singularities',
      q: 'The singularity of $e^{1/z}$ at $z = 0$ is',
      options: ['removable', 'a simple pole', 'essential', 'a branch point'], answer: 2,
      sol: '$e^{1/z} = 1 + \\frac1z + \\frac{1}{2!z^2} + \\frac{1}{3!z^3} + \\cdots$ has infinitely many negative powers: an essential singularity. Near such a point the function takes every complex value except possibly one (here 0) infinitely often (Picard).',
      trap: 'Along the positive real axis $e^{1/x} \\to \\infty$ like a pole, but along the negative axis it tends to 0: no pole behaves like that.' },
    { id: 'cax-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Laurent series',
      q: 'The coefficient of $z^{-1}$ in the Laurent series of $z^2e^{1/z}$ about $z = 0$ is ______ (to three decimal places).',
      answer: 0.167, tol: 0.002, calc: () => 1 / 6,
      sol: '$z^2e^{1/z} = z^2\\sum_{n\\ge0}\\frac{z^{-n}}{n!} = \\sum_n\\frac{z^{2-n}}{n!}$. The power $z^{-1}$ needs $n = 3$, with coefficient $1/3! = 1/6 \\approx 0.167$.',
      trap: 'Taking $n = 1$ (the coefficient of $1/z$ in $e^{1/z}$ itself) ignores the $z^2$ in front.' },
    { id: 'cax-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'conformal maps',
      q: 'Under $w = 1/z$, the circle $|z - 1| = 1$ is mapped to',
      options: ['the line $\\text{Re}\\,w = \\tfrac12$', 'the circle $|w - 1| = 1$', 'the line $\\text{Im}\\,w = \\tfrac12$', 'the line $\\text{Re}\\,w = 2$'], answer: 0,
      sol: '$|z - 1|^2 = 1$ means $z\\bar z - z - \\bar z = 0$. Put $z = 1/w$ and multiply by $w\\bar w$: $1 - \\bar w - w = 0$, i.e. $\\text{Re}\\,w = \\tfrac12$. The circle passes through $z = 0$, which goes to $w = \\infty$, so its image is a line. ($z = 2$ goes to $w = \\tfrac12$ ✓.)',
      trap: 'Circles through the origin become lines under inversion, not circles.' },
    { id: 'cax-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'maximum modulus',
      q: 'The maximum value of $|z^2 + 2z|$ on the closed disc $|z| \\le 1$ is ______.',
      answer: 3, tol: 0,
      sol: 'By the maximum modulus principle the maximum is on the boundary $|z| = 1$. There $|z^2 + 2z| = |z|\\,|z + 2| = |z + 2| \\le 3$, with equality at $z = 1$.',
      trap: 'Checking only the centre (value 0) or a random interior point.' },
    { id: 'cax-026', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'singularities',
      q: 'Let $f(z) = \\dfrac{\\sin z}{z}$ for $z \\ne 0$ and $f(0) = 1$. Which statements are true?',
      options: ['$f$ is entire', '$f$ has a Taylor series about 0 that converges for every $z$', '$|f(z)| \\le 1$ for every complex $z$', '$f$ has zeros only at $z = n\\pi$, $n = \\pm1, \\pm2, \\dots$'], answer: [0, 1, 3],
      sol: 'The singularity at 0 is removable, and $f = \\sum(-1)^nz^{2n}/(2n+1)!$ converges everywhere: $f$ is entire. Zeros of $\\sin z$ are exactly $n\\pi$ (all real), and $n = 0$ is removed by the division. But $f(iy) = \\sinh y/y$, which exceeds 1 for $y \\ne 0$, so the bound fails off the real axis (it must, by Liouville).',
      trap: 'Bounds that hold on the real line rarely hold in the complex plane.' },
    { id: 'cax-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'contour integrals',
      q: 'The integral $\\oint_{|z| = 1}\\bar z\\,dz$, taken anticlockwise, equals',
      options: ['$0$, by Cauchy\'s theorem', '$-2\\pi i$', '$\\pi$', '$2\\pi i$'], answer: 3,
      sol: '$\\bar z$ is not analytic, so Cauchy\'s theorem does not apply. On the unit circle $\\bar z = 1/z$, so the integral equals $\\oint dz/z = 2\\pi i$. (By Green\'s theorem, $\\oint\\bar z\\,dz = 2i\\times\\text{area} = 2\\pi i$.)',
      trap: 'Cauchy\'s theorem needs analyticity; $\\bar z$ fails Cauchy-Riemann everywhere.' },
    { id: 'cax-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'contour integrals',
      q: 'The value of $\\text{Im}\\displaystyle\\int_0^{1+i} z^2\\,dz$, along any path, is ______ (to three decimal places).',
      answer: 0.667, tol: 0.003, calc: () => 2 / 3,
      sol: '$z^2$ is entire, so the integral depends only on the end points: $\\left[\\frac{z^3}{3}\\right]_0^{1+i} = \\frac{(1 + i)^3}{3} = \\frac{-2 + 2i}{3}$. Imaginary part $\\tfrac23 \\approx 0.667$.',
      trap: '$(1 + i)^3 = (2i)(1 + i) = -2 + 2i$; slipping a sign gives $-2/3$.' },

    // ---------- level 4 ----------
    { id: 'cax-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Rouche theorem',
      q: 'The number of zeros of $z^5 + 6z + 1$ (with multiplicity) in the annulus $1 < |z| < 2$ is ______.',
      answer: 4, tol: 0,
      sol: 'Rouché: if $|g| > |h|$ on a circle, $g + h$ and $g$ have the same number of zeros inside. On $|z| = 1$: $|6z| = 6 > |z^5 + 1| \\le 2$, so there is one zero in $|z| < 1$ (like $6z$). On $|z| = 2$: $|z^5| = 32 > |6z + 1| \\le 13$, so five zeros in $|z| < 2$ (like $z^5$). No zeros lie on $|z| = 1$ (the inequality is strict), so the annulus holds $5 - 1 = 4$.',
      trap: 'Answering 5 forgets the zero inside the unit disc.' },
    { id: 'cax-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'harmonic functions',
      q: 'An analytic function on $\\mathbb C\\setminus\\{0\\}$ has real part $\\dfrac{x}{x^2 + y^2}$. The function is ($c$ a real constant)',
      options: ['$z^2 + ic$', '$\\ln z + ic$', '$\\dfrac{i}{z} + c$', '$\\dfrac1z + ic$'], answer: 3,
      sol: '$\\frac1z = \\frac{\\bar z}{|z|^2} = \\frac{x - iy}{x^2 + y^2}$, whose real part is $\\frac{x}{x^2 + y^2}$. An analytic function is fixed by its real part up to an imaginary constant. Check the others: $\\text{Re}(i/z) = \\frac{y}{x^2 + y^2}$, $\\text{Re}\\ln z = \\ln r$.',
      trap: 'Adding a real constant changes the real part; only $ic$ is free.' },
    { id: 'cax-031', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Liouville',
      q: 'An entire function satisfies $|f(z)| \\le 3|z|^2$ for every $z$. Which statements must be true?',
      options: ['$f$ is a polynomial of degree at most 2', '$f(0) = 0$', '$f\'(0) = 0$', '$f$ is identically zero'], answer: [0, 1, 2],
      sol: 'At $z = 0$ the bound forces $f(0) = 0$; then $|f(z)/z| \\le 3|z| \\to 0$ forces $f\'(0) = 0$. So $g = f/z^2$ has a removable singularity at 0, is entire, and $|g| \\le 3$: by Liouville $g = a$ with $|a| \\le 3$. Hence $f = az^2$, a polynomial of degree at most 2, not necessarily zero ($f = 2z^2$ works).',
      trap: 'Liouville applies to $f/z^2$, not to $f$ itself, which is unbounded.' },
    { id: 'cax-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Laurent series',
      q: 'In the annulus $1 < |z| < 2$, the coefficient of $z^2$ in the Laurent series of $\\dfrac{1}{(z - 1)(z - 2)}$ is ______ (to three decimal places).',
      answer: -0.125, tol: 0.001, calc: () => -1 / 8,
      sol: 'Partial fractions: $\\frac{1}{z - 2} - \\frac{1}{z - 1}$. In the annulus $|z| < 2$, so $\\frac{1}{z - 2} = -\\frac12\\sum_{n\\ge0}(z/2)^n$ (non-negative powers). And $|z| > 1$, so $-\\frac{1}{z - 1} = -\\frac1z\\sum_{n\\ge0}z^{-n}$ (only negative powers). The $z^2$ coefficient comes from the first part alone: $-\\frac12\\cdot\\frac14 = -\\frac18$.',
      trap: 'Expanding $1/(z - 1)$ in positive powers is wrong for $|z| > 1$: that series diverges there.' },
    { id: 'cax-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'maximum modulus',
      q: 'The minimum value of $|e^{z}|$ on the closed disc $|z| \\le 1$ is',
      options: ['$0$', '$e^{-1}$', '$1$', '$e^{-\\pi}$'], answer: 1,
      sol: '$e^z$ has no zeros, so the minimum modulus principle applies (it is the maximum principle for $1/e^z$): the minimum is on the boundary. $|e^z| = e^{x}$ is smallest where $x = \\text{Re}\\,z$ is smallest, at $z = -1$: $e^{-1}$.',
      trap: 'The minimum principle needs a function without zeros; $e^z$ qualifies.' },
    { id: 'cax-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Cauchy integral formula',
      q: 'The integral $\\oint_{|z| = 2}\\dfrac{e^{2z}}{(z + 1)^4}\\,dz$ (anticlockwise) equals $k\\pi i$. The value of $k$ is ______ (to three decimal places).',
      answer: 0.361, tol: 0.003, calc: () => 8 / (3 * Math.E ** 2),
      sol: 'With $f = e^{2z}$, $n = 3$, $a = -1$ (inside): $f\'\'\'(z) = 8e^{2z}$, so $f\'\'\'(-1) = 8e^{-2}$. Then $\\oint = \\frac{2\\pi i}{3!}\\cdot8e^{-2} = \\frac{8}{3e^2}\\pi i$, and $k = 8/(3e^2) \\approx 0.361$.',
      trap: 'Each derivative of $e^{2z}$ brings a factor 2; forgetting them gives $1/(3e^2)$.' },
    { id: 'cax-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'branch points',
      q: 'The branch points of $f(z) = \\sqrt{z(z - 1)}$, including the point at infinity, are',
      options: ['$0$ and $1$ only', '$0$, $1$ and $\\infty$', '$0$ only', 'there are none'], answer: 0,
      sol: 'A small loop round 0 (or round 1) changes the phase of the product by $2\\pi$ and of the square root by $\\pi$: a sign flip, so both are branch points. A huge loop enclosing both changes the phase of $z(z - 1)$ by $4\\pi$ and of $f$ by $2\\pi$: no change, so $\\infty$ is not a branch point ($f \\approx z$ there). One cut joining 0 to 1 makes $f$ single-valued.',
      trap: 'Compare $\\sqrt z$, where $\\infty$ is a branch point; with two square-root factors the phases at infinity cancel.' },
    { id: 'cax-036', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'conformal maps',
      q: 'For the map $w = z^2$, which statements are true?',
      options: ['It preserves angles at every point except $z = 0$', 'It maps the first quadrant onto the upper half $w$-plane', 'It is one-to-one on the whole $z$-plane', 'It maps the circle $|z| = 2$ onto the circle $|w| = 4$'], answer: [0, 1, 3],
      sol: 'An analytic map is conformal wherever $f\' \\ne 0$; $f\' = 2z$ vanishes only at 0, where angles are doubled. In polar form $w = r^2e^{2i\\theta}$, so the quadrant $0 < \\theta < \\pi/2$ becomes $0 < \\arg w < \\pi$, and $|z| = 2$ becomes $|w| = 4$. But $z$ and $-z$ have the same image, so it is two-to-one.',
      trap: 'Angles at the origin double; that is how a quarter-plane opens into a half-plane.' },

    // ---------- level 5 ----------
    { id: 'cax-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'argument principle',
      q: 'For $f(z) = \\dfrac{z^2 + 1}{z^3(z - 3)}$, the value of $\\dfrac{1}{2\\pi i}\\oint_{|z| = 2}\\dfrac{f\'(z)}{f(z)}\\,dz$ (anticlockwise) is ______.',
      answer: -1, tol: 0,
      sol: 'The argument principle: the integral counts zeros minus poles inside, with multiplicity. Inside $|z| = 2$: zeros at $\\pm i$ (two), a pole of order 3 at 0, and the pole at 3 is outside. So the value is $2 - 3 = -1$.',
      trap: 'Counting the triple pole once gives $+1$.' },
    { id: 'cax-038', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'Liouville',
      q: 'An entire function $f$ satisfies $\\text{Re}\\,f(z) < 1$ for every $z$. Then',
      options: ['$f$ is constant', '$f$ is a polynomial of degree at most 1', '$f$ must be $e^{z}$ times a constant', 'nothing more can be concluded'], answer: 0,
      sol: 'Consider $g = e^{f}$: it is entire and $|g| = e^{\\text{Re}f} < e$, so $g$ is bounded and constant by Liouville. Then $g\' = f\'e^{f} = 0$ forces $f\' = 0$: $f$ is constant. (Equally, $1/(f - 1)$ or $(f - 2)^{-1}$ can be used.)',
      trap: 'Liouville needs boundedness of the modulus; a bound on the real part alone is turned into one by exponentiating.' },
    { id: 'cax-039', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'power series',
      q: 'For the power series $\\displaystyle\\sum_{n=1}^{\\infty}\\frac{z^n}{n}$, which statements are true?',
      options: ['Its radius of convergence is 1', 'It converges at $z = -1$', 'It diverges at $z = 1$', 'It converges absolutely at every point of $|z| = 1$'], answer: [0, 1, 2],
      sol: 'The ratio $n/(n + 1) \\to 1$ gives radius 1. At $z = 1$ it is the harmonic series (diverges). At $z = -1$ it is the alternating harmonic series, which converges (to $-\\ln2$). On the circle, $\\sum|z^n|/n = \\sum1/n$ diverges, so convergence there is never absolute. (The sum is $-\\ln(1 - z)$, singular only at $z = 1$.)',
      trap: 'Behaviour on the circle of convergence varies from point to point; the radius says nothing about it.' },
    { id: 'cax-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Cauchy integral formula',
      q: 'The value of $\\displaystyle\\int_0^{2\\pi} e^{\\cos\\theta}\\cos(\\sin\\theta - \\theta)\\,d\\theta$ is ______ (to two decimal places).',
      answer: 6.28, tol: 0.01, calc: () => 2 * Math.PI,
      sol: 'On the unit circle $z = e^{i\\theta}$, $e^{z} = e^{\\cos\\theta}e^{i\\sin\\theta}$ and $dz = iz\\,d\\theta$. Then $\\oint\\frac{e^z}{z^2}dz = \\int_0^{2\\pi} e^{\\cos\\theta}e^{i\\sin\\theta}e^{-2i\\theta}\\,ie^{i\\theta}d\\theta = i\\int_0^{2\\pi} e^{\\cos\\theta}e^{i(\\sin\\theta - \\theta)}d\\theta$. By Cauchy\'s formula the left side is $2\\pi i\\cdot(e^z)\'|_0 = 2\\pi i$. So $\\int e^{\\cos\\theta}e^{i(\\sin\\theta - \\theta)}d\\theta = 2\\pi$, and its real part is the required integral: $2\\pi \\approx 6.28$.',
      trap: 'Picking $\\oint e^z/z\\,dz$ instead gives the integral of $e^{\\cos\\theta}\\cos(\\sin\\theta)$, which is a different (though also $2\\pi$-valued) integral; match the $-\\theta$ in the phase.' },
    ...more2,
    ...r4.items,
    ...r5.items,
  ],
  gens: [
    { id: 'cax-g01', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Cauchy-Riemann',
      make(r) {
        const a = int(r, 1, 4), b = int(r, 1, 4), x = int(r, 1, 3), y = int(r, -2, 2);
        // u = x^2 - y^2 + a x + b y = Re(z^2 + (a - i b) z); v = 2xy + a y - b x
        const answer = 2 * x * y + a * y - b * x;
        return { q: `$f = u + iv$ is analytic with $u = x^2 - y^2 + ${a}x + ${b}y$ and $v(0, 0) = 0$. Find $v(${x}, ${y})$.`,
          answer, tol: 0, a, b, x, y,
          sol: `$v_y = u_x = 2x + ${a}$ gives $v = 2xy + ${a}y + g(x)$. Then $v_x = 2y + g'(x) = -u_y = 2y - ${b}$, so $g = -${b}x$ (constant 0 from $v(0,0) = 0$). So $v = 2xy + ${a}y - ${b}x$ and $v(${x}, ${y}) = ${2 * x * y} + ${a * y} - ${b * x} = ${answer}$.`,
          trap: 'The $by$ term in $u$ feeds a $-bx$ term into $v$ through $v_x = -u_y$; it is easy to lose.' };
      },
      verify: (p) => { // integrate v_x = -u_y along y = 0 then v_y = u_x up in y
        const vx0 = -(p.b); const vAtX = vx0 * p.x; return vAtX + (2 * p.x + p.a) * p.y; } },
    { id: 'cax-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Cauchy integral formula',
      make(r) {
        const k = int(r, 1, 3), a = int(r, -2, 2), R = Math.abs(a) + int(r, 1, 2);
        const answer = round(Math.exp(k * a), 3);
        return { q: `Find $\\dfrac{1}{2\\pi i}\\oint_{|z| = ${R}}\\dfrac{e^{${k === 1 ? '' : k}z}}{z ${a < 0 ? '+ ' + -a : '- ' + a}}\\,dz$ (anticlockwise, to three decimal places).`,
          answer, tol: Math.max(0.002, answer * 0.005), k, a,
          sol: `The point $z = ${a}$ lies inside $|z| = ${R}$ and $e^{${k}z}$ is entire, so Cauchy's integral formula gives $e^{${k}\\cdot(${a})} = e^{${k * a}} \\approx ${answer}$.`,
          trap: 'Check that the pole is inside the contour before using the formula.' };
      },
      verify: (p) => Math.exp(p.k * p.a) },
    { id: 'cax-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'power series',
      make(r) {
        const x0 = int(r, -3, 3), b = int(r, 1, 4);
        const answer = round(Math.hypot(x0, b), 3);
        return { q: `Find the radius of convergence of the Taylor series of $\\dfrac{1}{z^2 + ${b * b}}$ about $z = ${x0}$ (to three decimal places).`,
          answer, tol: 0.003, x0, b,
          sol: `The singularities are at $z = \\pm${b}i$. The series converges out to the nearest one: $|${x0} - ${b}i| = \\sqrt{${x0 * x0} + ${b * b}} \\approx ${answer}$.`,
          trap: 'The function is smooth on the whole real line; the complex poles set the radius.' };
      },
      verify: (p) => Math.sqrt(p.x0 ** 2 + p.b ** 2) },
    { id: 'cax-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Laurent series',
      make(r) {
        const m = int(r, 1, 5);
        const answer = round(1 / fact(m + 1), 5);
        return { q: `Find the coefficient of $z^{-1}$ in the Laurent series of $z^{${m}}e^{1/z}$ about $z = 0$ (to five decimal places).`,
          answer, tol: Math.max(1e-5, answer * 0.01), m,
          sol: `$z^{${m}}e^{1/z} = \\sum_{n\\ge0}\\frac{z^{${m} - n}}{n!}$. The power $-1$ needs $n = ${m + 1}$, so the coefficient is $1/${m + 1}! = 1/${fact(m + 1)} \\approx ${answer}$.`,
          trap: 'The factor in front shifts which term of $e^{1/z}$ gives $z^{-1}$.' };
      },
      verify: (p) => { let s = 1; for (let k = 2; k <= p.m + 1; k++) s *= k; return 1 / s; } },
    { id: 'cax-g05', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'singularities',
      make(r) {
        const a = int(r, 0, 3), b = int(r, 1, 3), c = int(r, 0, 2);
        // 1 / (z^a sin^b z) * (1 - cos z)^c ... order = a + b - 2c  (if > 0)
        const order = a + b - 2 * c;
        const top = c === 0 ? '1' : c === 1 ? '1 - \\cos z' : `(1 - \\cos z)^{${c}}`;
        const bot = `${a === 0 ? '' : a === 1 ? 'z\\,' : `z^{${a}}`}\\sin${b === 1 ? '' : `^{${b}}`} z`;
        const expr = `\\dfrac{${top}}{${bot}}`;
        if (order <= 0) {
          const o = mcqOptions(r, 'removable (no pole)', ['a simple pole', 'a pole of order 2', 'an essential singularity']);
          return { q: `At $z = 0$, the function $${expr}$ has`, ...o, a, b, c,
            sol: `Near 0: $1 - \\cos z \\approx z^2/2$ (a zero of order 2) and $\\sin z \\approx z$. The numerator has a zero of order $${2 * c}$ and the denominator one of order $${a} + ${b} = ${a + b}$, so the quotient has no pole: the singularity is removable${order < 0 ? ' (the function even vanishes there)' : ''}.`,
            trap: 'Count orders of zeros on top and bottom before deciding.' };
        }
        const name = (n) => (n === 1 ? 'a simple pole' : `a pole of order ${n}`);
        const o = mcqOptions(r, name(order), [name(order + 1), order > 1 ? name(order - 1) : 'removable (no pole)', 'an essential singularity']);
        return { q: `At $z = 0$, the function $${expr}$ has`, ...o, a, b, c,
          sol: `Near 0: $1 - \\cos z \\approx z^2/2$ (a zero of order 2) and $\\sin z \\approx z$ (a zero of order 1). Top: order $${2 * c}$; bottom: order $${a} + ${b} = ${a + b}$. The quotient has ${name(order)}.`,
          trap: '$1 - \\cos z$ vanishes to second order, not first.' };
      } },
    { id: 'cax-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Cauchy integral formula',
      make(r) {
        const a = int(r, 1, 3), n = int(r, 1, 4), R = int(r, 1, 3);
        const answer = round((2 * a ** n) / fact(n), 4);
        return { q: `The integral $\\oint_{|z| = ${R}}\\dfrac{e^{${a === 1 ? '' : a}z}}{z^{${n + 1}}}\\,dz$ (anticlockwise) equals $k\\pi i$. Find $k$ (to four decimal places).`,
          answer, tol: Math.max(1e-4, answer * 0.005), a, n,
          sol: `By the derivative form of Cauchy's formula, $\\oint\\frac{f(z)}{z^{n+1}}dz = \\frac{2\\pi i}{n!}f^{(n)}(0)$ with $f = e^{${a}z}$ and $n = ${n}$: $f^{(${n})}(0) = ${a}^{${n}} = ${a ** n}$. So the integral is $\\frac{2\\cdot${a ** n}}{${fact(n)}}\\pi i$ and $k \\approx ${answer}$.`,
          trap: 'Each derivative of $e^{az}$ brings a factor $a$, and do not forget the $1/n!$.' };
      },
      verify: (p) => { let s = 0, t = 1; for (let k = 0; k < 40; k++) { if (k === p.n) s = t; t *= p.a / (k + 1); } return 2 * s; } },
    { id: 'cax-g07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Laurent series',
      make(r) {
        const neg = r() < 0.4, m = int(r, neg ? 1 : 0, neg ? 4 : 4);
        const answer = neg ? -1 : round(-1 / 2 ** (m + 1), 4);
        const pw = neg ? `z^{-${m}}` : m === 0 ? 'z^0 (the constant term)' : m === 1 ? 'z' : `z^{${m}}`;
        return { q: `In the annulus $1 < |z| < 2$, find the coefficient of $${pw}$ in the Laurent series of $\\dfrac{1}{(z - 1)(z - 2)}$${neg ? '' : ' (to four decimal places)'}.`.replace('$z^0 (the constant term)$', 'the constant term'),
          answer, tol: neg ? 0 : 1e-4, neg, m,
          sol: `$\\frac{1}{(z - 1)(z - 2)} = \\frac{1}{z - 2} - \\frac{1}{z - 1}$. For $|z| < 2$: $\\frac{1}{z - 2} = -\\sum_{n\\ge0}\\frac{z^n}{2^{n+1}}$. For $|z| > 1$: $-\\frac{1}{z - 1} = -\\sum_{n\\ge1}z^{-n}$. ${neg ? `So every negative power, including $z^{-${m}}$, has coefficient $-1$.` : `So the coefficient of $z^{${m}}$ is $-1/2^{${m + 1}} \\approx ${answer}$.`}`,
          trap: 'In the annulus $1/(z - 1)$ must be expanded in powers of $1/z$.' };
      },
      verify: (p) => (p.neg ? -1 : -1 / 2 ** (p.m + 1)) },
    { id: 'cax-g08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Rouche theorem',
      make(r) {
        const n = int(r, 4, 7), a = int(r, 3, n === 4 ? 7 : 8);
        return { q: `How many zeros (with multiplicity) does $z^{${n}} + ${a}z + 1$ have in the annulus $1 < |z| < 2$?`,
          answer: n - 1, tol: 0, n, a,
          sol: `On $|z| = 1$: $|${a}z| = ${a} > 2 \\ge |z^{${n}} + 1|$, so by Rouché there is exactly one zero in $|z| < 1$ (as for $${a}z$), and none on the circle. On $|z| = 2$: $|z^{${n}}| = ${2 ** n} > ${2 * a + 1} \\ge |${a}z + 1|$, so all ${n} zeros lie in $|z| < 2$. The annulus holds $${n} - 1 = ${n - 1}$.`,
          trap: 'Subtract the zero inside the unit disc.' };
      },
      verify: (p) => { // Durand-Kerner roots, then count 1 < |z| < 2
        const n = p.n, a = p.a, f = (z) => { let re = 1, im = 0; for (let k = 0; k < n; k++) [re, im] = [re * z[0] - im * z[1], re * z[1] + im * z[0]]; return [re + a * z[0] + 1, im + a * z[1]]; };
        let zs = Array.from({ length: n }, (_, k) => { const t = 0.4 + (2 * Math.PI * k) / n; return [1.3 * Math.cos(t), 1.3 * Math.sin(t)]; });
        for (let it = 0; it < 300; it++) zs = zs.map((z, i) => { let d = [1, 0]; zs.forEach((w, j) => { if (j !== i) { const e = [z[0] - w[0], z[1] - w[1]]; d = [d[0] * e[0] - d[1] * e[1], d[0] * e[1] + d[1] * e[0]]; } });
          const fz = f(z), m = d[0] * d[0] + d[1] * d[1]; return [z[0] - (fz[0] * d[0] + fz[1] * d[1]) / m, z[1] - (fz[1] * d[0] - fz[0] * d[1]) / m]; });
        return zs.filter((z) => { const m = Math.hypot(...z); return m > 1 && m < 2; }).length; } },
    ...more,
    ...r4.gens,
    ...r5.gens,
  ],
};

// Tidy signs in generated text ("+ -3" -> "- 3", "1x" -> "x"); see _signs.js.
export default tidyPhys(topicBank, ["cax-g01","cax-g02","cax-g03","cax-g06","cax-r5g1","cax-r5g3"], { neg: ["cax-r5g1"] });
