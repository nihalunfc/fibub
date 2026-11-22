// Complex numbers: algebra, modulus and argument, polar form, Euler's formula, De Moivre, roots of unity,
// complex logarithm and powers, hyperbolic links, phasors and AC impedance, first steps of analytic functions.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round } from '../_util.js';
import more from './complex-numbers.more.gen.js';
import more2 from './complex-numbers.more2.gen.js';

const deg = (x) => x * 180 / Math.PI;

export default {
  topic: 'complex-numbers',
  items: [
    // ---- level 1 ----
    { id: 'cx-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'modulus and argument',
      q: 'The modulus of $z = 3 + 4i$ is',
      options: ['$7$', '$25$', '$5$', '$\\sqrt7$'], answer: 2,
      sol: '$|z| = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$: the distance of the point $(3, 4)$ from the origin.',
      trap: '25 is $|z|^2 = z\\bar z$, not $|z|$.' },
    { id: 'cx-002', type: 'nat', level: 1, exams: ['jam'], sub: 'algebra',
      q: 'The real part of $(1 + i)(2 - 3i)$ is ______.',
      answer: 5, tol: 0, calc: () => 1 * 2 - 1 * -3,
      sol: '$(1 + i)(2 - 3i) = 2 - 3i + 2i - 3i^2 = 2 - i + 3 = 5 - i$. Real part 5.',
      trap: 'Forgetting $i^2 = -1$ gives $-1$ instead of $+3$.' },
    { id: 'cx-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'algebra',
      q: 'The value of $i^{103}$ is',
      options: ['$1$', '$i$', '$-1$', '$-i$'], answer: 3,
      sol: 'Powers of $i$ repeat every 4: $i, -1, -i, 1$. $103 = 4\\times25 + 3$, so $i^{103} = i^3 = -i$.' },
    { id: 'cx-004', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'euler formula',
      q: 'By Euler\'s formula, $e^{i\\pi}$ equals',
      options: ['$1$', '$-1$', '$i$', '$0$'], answer: 1,
      sol: '$e^{i\\theta} = \\cos\\theta + i\\sin\\theta$, so $e^{i\\pi} = \\cos\\pi + i\\sin\\pi = -1$. On the unit circle this is half a turn from 1.' },
    { id: 'cx-005', type: 'nat', level: 1, exams: ['jam'], sub: 'modulus and argument',
      q: 'The principal argument of $z = -1 + i\\sqrt3$ is ______ degrees.',
      answer: 120, tol: 0.5, calc: () => deg(Math.atan2(Math.sqrt(3), -1)),
      sol: 'The point $(-1, \\sqrt3)$ is in the second quadrant. $\\tan^{-1}(\\sqrt3/1) = 60^\\circ$ measured back from the negative real axis, so $\\arg z = 180^\\circ - 60^\\circ = 120^\\circ$.',
      trap: 'Calculator $\\tan^{-1}(\\sqrt3/(-1)) = -60^\\circ$ puts the point in the wrong quadrant. Always check the signs of the real and imaginary parts.' },
    { id: 'cx-006', type: 'msq', level: 1, exams: ['jam'], sub: 'polar form',
      q: 'For $z = 2e^{i\\pi/3}$, which are correct?',
      options: ['$z = 1 + i\\sqrt3$', '$z = 2(\\cos60^\\circ + i\\sin60^\\circ)$', '$\\bar z = 2e^{-i\\pi/3}$', '$|z|^2 = 2$'], answer: [0, 1, 2],
      sol: '$2(\\cos60^\\circ + i\\sin60^\\circ) = 2(\\tfrac12 + i\\tfrac{\\sqrt3}{2}) = 1 + i\\sqrt3$ (A, B). Conjugating flips the sign of the angle (C). $|z|^2 = 4$, so D is wrong.' },

    // ---- level 2 ----
    { id: 'cx-007', type: 'mcq', level: 2, exams: ['jam'], sub: 'algebra',
      q: '$\\dfrac{1}{1 + i}$ equals',
      options: ['$1 - i$', '$\\dfrac{1 + i}{2}$', '$\\dfrac{1 - i}{2}$', '$\\dfrac{-1 + i}{2}$'], answer: 2,
      sol: 'Multiply top and bottom by the conjugate: $\\dfrac{1 - i}{(1 + i)(1 - i)} = \\dfrac{1 - i}{2}$.' },
    { id: 'cx-008', type: 'nat', level: 2, exams: ['jam'], sub: 'modulus and argument',
      q: 'The modulus of $\\dfrac{3 + 4i}{1 - i}$ is ______ (to two decimal places).',
      answer: 3.54, tol: 0.01, calc: () => 5 / Math.SQRT2,
      sol: 'Moduli divide: $\\dfrac{|3 + 4i|}{|1 - i|} = \\dfrac{5}{\\sqrt2} \\approx 3.54$. No need to simplify the fraction first.' },
    { id: 'cx-009', type: 'mcq', level: 2, exams: ['jam'], sub: 'de moivre',
      q: '$(1 + i)^8$ equals',
      options: ['$16$', '$16i$', '$-16$', '$256$'], answer: 0,
      sol: '$1 + i = \\sqrt2\\,e^{i\\pi/4}$, so $(1 + i)^8 = (\\sqrt2)^8e^{i2\\pi} = 16$.',
      trap: '$2^8 = 256$ uses $|1 + i| = 2$; the modulus is $\\sqrt2$.' },
    { id: 'cx-010', type: 'nat', level: 2, exams: ['jam'], sub: 'roots of unity',
      q: 'How many of the sixth roots of unity lie strictly in the upper half-plane ($\\operatorname{Im} z > 0$)?',
      answer: 2, tol: 0, calc: () => [0, 1, 2, 3, 4, 5].filter((k) => Math.sin(k * Math.PI / 3) > 1e-9).length,
      sol: 'The roots are $e^{ik\\pi/3}$ for $k = 0, \\dots, 5$: angles $0^\\circ, 60^\\circ, 120^\\circ, 180^\\circ, 240^\\circ, 300^\\circ$. Only $60^\\circ$ and $120^\\circ$ have positive imaginary part ($0^\\circ$ and $180^\\circ$ are on the real axis). Answer: 2.',
      trap: 'Counting $1$ and $-1$, which lie on the real axis, gives 4.' },
    { id: 'cx-011', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'euler formula',
      q: 'In terms of exponentials, $\\sin\\theta$ equals',
      options: ['$\\dfrac{e^{i\\theta} + e^{-i\\theta}}{2}$', '$\\dfrac{e^{i\\theta} - e^{-i\\theta}}{2}$', '$\\dfrac{e^{i\\theta} + e^{-i\\theta}}{2i}$', '$\\dfrac{e^{i\\theta} - e^{-i\\theta}}{2i}$'], answer: 3,
      sol: 'Subtract $e^{-i\\theta} = \\cos\\theta - i\\sin\\theta$ from $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$: $2i\\sin\\theta$. Divide by $2i$.',
      trap: 'Option B (without the $i$) is $\\sinh$-like and is imaginary: $i\\sin\\theta$.' },
    { id: 'cx-012', type: 'msq', level: 2, exams: ['jam'], sub: 'modulus and argument',
      q: 'For any complex numbers $z_1, z_2$, which always hold?',
      options: ['$|z_1z_2| = |z_1||z_2|$', '$\\arg(z_1z_2) = \\arg z_1 + \\arg z_2$ (up to a multiple of $2\\pi$)', '$|z_1 + z_2| \\le |z_1| + |z_2|$', '$|z_1 + z_2| = |z_1| + |z_2|$'], answer: [0, 1, 2],
      sol: 'Multiplying multiplies moduli and adds angles (A, B). C is the triangle inequality. D holds only when $z_1$ and $z_2$ point the same way.' },
    { id: 'cx-013', type: 'nat', level: 2, exams: ['jam'], sub: 'euler formula',
      q: 'The real part of $e^{\\ln2 + i\\pi/3}$ is ______.',
      answer: 1, tol: 0.01, calc: () => 2 * Math.cos(Math.PI / 3),
      sol: '$e^{\\ln2 + i\\pi/3} = e^{\\ln2}e^{i\\pi/3} = 2(\\cos60^\\circ + i\\sin60^\\circ) = 1 + i\\sqrt3$. Real part 1.' },
    { id: 'cx-014', type: 'mcq', level: 2, exams: ['jam'], sub: 'geometry',
      q: 'The set of points $z$ with $|z - 1| = |z + 1|$ is',
      options: ['the unit circle', 'the real axis', 'the imaginary axis', 'a single point'], answer: 2,
      sol: '$|z - 1|$ is the distance from $1$ and $|z + 1|$ the distance from $-1$. Points equally far from both lie on the perpendicular bisector of the segment between them: the imaginary axis. Algebra: $(x - 1)^2 + y^2 = (x + 1)^2 + y^2$ gives $x = 0$.' },
    { id: 'cx-015', type: 'nat', level: 2, exams: ['jam'], sub: 'algebra',
      q: 'For $z = 2 - 5i$, the value of $z\\bar z$ is ______.',
      answer: 29, tol: 0, calc: () => 4 + 25,
      sol: '$z\\bar z = (2 - 5i)(2 + 5i) = 4 + 25 = 29 = |z|^2$. It is always real and non-negative.' },
    { id: 'cx-016', type: 'mcq', level: 2, exams: ['jam'], sub: 'roots',
      q: 'The square roots of $i$ are',
      options: ['$\\pm\\dfrac{1 + i}{\\sqrt2}$', '$\\pm\\dfrac{1 - i}{\\sqrt2}$', '$\\pm(1 + i)$', '$\\pm\\sqrt{i}\\,i$'], answer: 0,
      sol: '$i = e^{i\\pi/2}$, so $\\sqrt i = \\pm e^{i\\pi/4} = \\pm\\dfrac{1 + i}{\\sqrt2}$. Check: $\\left(\\dfrac{1 + i}{\\sqrt2}\\right)^2 = \\dfrac{1 + 2i - 1}{2} = i$ ✓.',
      trap: '$(1 + i)^2 = 2i$, not $i$: the factor $1/\\sqrt2$ matters.' },

    // ---- level 3 ----
    { id: 'cx-017', type: 'nat', level: 3, exams: ['jam'], sub: 'roots',
      q: 'The product of all the roots of $z^4 = 16$ is ______.',
      answer: -16, tol: 0, calc: () => 2 * -2 * -(2 * 2) * -1,
      sol: 'The roots are $2, 2i, -2, -2i$. Product: $(2)(-2)(2i)(-2i) = (-4)(-4i^2) = (-4)(4) = -16$. Or from $z^4 - 16 = 0$: for a degree-4 polynomial the product of roots is (constant term)/(leading coefficient) $= -16$.',
      trap: 'Answering $+16$ by assuming the product of roots equals the right-hand side.' },
    { id: 'cx-018', type: 'mcq', level: 3, exams: ['jam'], sub: 'de moivre',
      q: 'Using De Moivre\'s theorem, $\\cos3\\theta$ equals',
      options: ['$3\\cos\\theta - 4\\cos^3\\theta$', '$4\\cos^3\\theta - 3\\cos\\theta$', '$\\cos^3\\theta - 3\\cos\\theta\\sin^2\\theta + \\sin^3\\theta$', '$3\\cos^2\\theta - \\sin^2\\theta$'], answer: 1,
      sol: '$\\cos3\\theta = \\operatorname{Re}(\\cos\\theta + i\\sin\\theta)^3 = \\cos^3\\theta - 3\\cos\\theta\\sin^2\\theta = \\cos^3\\theta - 3\\cos\\theta(1 - \\cos^2\\theta) = 4\\cos^3\\theta - 3\\cos\\theta$.',
      trap: 'Option A is minus the right answer (and is close to the formula for $\\sin3\\theta = 3\\sin\\theta - 4\\sin^3\\theta$).' },
    { id: 'cx-019', type: 'nat', level: 3, exams: ['jam'], sub: 'de moivre',
      q: 'The real part of $(1 + i\\sqrt3)^5$ is ______.',
      answer: 16, tol: 0, calc: () => 32 * Math.cos(5 * Math.PI / 3),
      sol: '$1 + i\\sqrt3 = 2e^{i\\pi/3}$, so the fifth power is $32e^{i5\\pi/3} = 32(\\tfrac12 - i\\tfrac{\\sqrt3}{2})$. Real part 16.' },
    { id: 'cx-020', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'complex powers',
      q: 'The principal value of $i^{\\,i}$ is',
      options: ['$-1$', '$e^{\\pi/2}$', '$i$', '$e^{-\\pi/2}$'], answer: 3,
      sol: '$i^i = e^{i\\operatorname{Log}i}$ and $\\operatorname{Log}i = i\\pi/2$ (principal). So $i^i = e^{i\\cdot i\\pi/2} = e^{-\\pi/2} \\approx 0.208$, a real number. (Other branches give $e^{-\\pi/2 - 2\\pi k}$.)' },
    { id: 'cx-021', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'complex logarithm',
      q: 'The principal logarithm $\\operatorname{Log}(-2) = a + ib$. The value of $b$ is ______ (to two decimal places).',
      answer: 3.14, tol: 0.01, calc: () => Math.PI,
      sol: '$-2 = 2e^{i\\pi}$, so $\\operatorname{Log}(-2) = \\ln2 + i\\pi$. $b = \\pi \\approx 3.14$ (and $a = \\ln2$). Negative numbers do have logarithms once complex values are allowed.' },
    { id: 'cx-022', type: 'msq', level: 3, exams: ['jam'], sub: 'polar form',
      q: 'If $|z| = 1$, which are always true?',
      options: ['$\\bar z = 1/z$', '$|z^n| = 1$ for every integer $n$', '$z + \\bar z$ is real', '$z - \\bar z$ is real'], answer: [0, 1, 2],
      sol: 'A: $z\\bar z = |z|^2 = 1$. B: $|z^n| = |z|^n$. C: $z + \\bar z = 2\\operatorname{Re}z$. D: $z - \\bar z = 2i\\operatorname{Im}z$ is purely imaginary (real only when it is 0).' },
    { id: 'cx-023', type: 'nat', level: 3, exams: ['jam'], sub: 'phasors',
      q: 'A coil has resistance $3\\ \\Omega$ and inductive reactance $4\\ \\Omega$, so its impedance is $Z = 3 + 4i\\ \\Omega$. The current lags the voltage by ______ degrees (to two decimal places).',
      answer: 53.13, tol: 0.05, calc: () => deg(Math.atan2(4, 3)), unit: '°',
      sol: '$I = V/Z$, so the current\'s phase is that of $V$ minus $\\arg Z$. $\\arg Z = \\tan^{-1}(4/3) = 53.13^\\circ$, the lag. ($|Z| = 5\\ \\Omega$ sets the size.)' },
    { id: 'cx-024', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'roots of unity',
      q: 'For an integer $N \\ge 2$, $\\displaystyle\\sum_{k=0}^{N-1}\\cos\\frac{2\\pi k}{N}$ equals',
      options: ['$1$', '$N$', '$0$', '$-1$'], answer: 2,
      sol: 'It is the real part of $\\sum_{k=0}^{N-1}\\omega^k$ with $\\omega = e^{2\\pi i/N}$, a geometric series: $\\dfrac{1 - \\omega^N}{1 - \\omega} = 0$ since $\\omega^N = 1$. The $N$ roots of unity balance around the origin.' },
    { id: 'cx-025', type: 'nat', level: 3, exams: ['jam'], sub: 'algebra',
      q: 'The imaginary part of $\\dfrac{2 + i}{1 - 2i}$ is ______.',
      answer: 1, tol: 0, calc: () => ((1 * 1) + (2 * 2)) / 5,
      sol: '$\\dfrac{(2 + i)(1 + 2i)}{(1 - 2i)(1 + 2i)} = \\dfrac{2 + 4i + i + 2i^2}{5} = \\dfrac{5i}{5} = i$. Imaginary part 1 (real part 0).' },
    { id: 'cx-026', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'hyperbolic functions',
      q: 'For real $x$, $\\cosh(ix)$ equals',
      options: ['$\\cosh x$', '$i\\sin x$', '$\\cos x$', '$i\\cos x$'], answer: 2,
      sol: '$\\cosh(ix) = \\tfrac12(e^{ix} + e^{-ix}) = \\cos x$. Likewise $\\sinh(ix) = i\\sin x$ and $\\cos(ix) = \\cosh x$.' },
    { id: 'cx-027', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'euler formula',
      q: 'For $z = 2 + 3i$, the modulus $|e^{iz}|$ is ______ (to three decimal places).',
      answer: 0.050, tol: 0.001, calc: () => Math.exp(-3),
      sol: '$iz = 2i + 3i^2 = -3 + 2i$, so $e^{iz} = e^{-3}e^{2i}$ and $|e^{iz}| = e^{-3} \\approx 0.050$. Only the real part of the exponent sets the modulus.',
      trap: 'Thinking $|e^{i(\\text{anything})}| = 1$: that holds only for a real exponent multiplied by $i$.' },
    { id: 'cx-028', type: 'msq', level: 3, exams: ['jam'], sub: 'roots of unity',
      q: 'For the equation $z^2 + z + 1 = 0$, which are correct?',
      options: ['Its roots are $\\omega$ and $\\omega^2$ with $\\omega = e^{2\\pi i/3}$.', 'Its roots are complex conjugates of each other.', 'Each root satisfies $z^3 = 1$.', 'The sum of its roots is 1.'], answer: [0, 1, 2],
      sol: '$z^3 - 1 = (z - 1)(z^2 + z + 1)$, so the roots are the two non-real cube roots of unity, $\\omega$ and $\\omega^2 = \\bar\\omega$ (A, B, C). Sum of roots $= -(\\text{coefficient of } z)/1 = -1$, so D is wrong.' },

    // ---- level 4 ----
    { id: 'cx-029', type: 'nat', level: 4, exams: ['jam'], sub: 'de moivre',
      q: 'The imaginary part of $(1 + i)^{10}$ is ______.',
      answer: 32, tol: 0, calc: () => 2 ** 5 * Math.sin(10 * Math.PI / 4),
      sol: '$(1 + i)^{10} = (\\sqrt2)^{10}e^{i10\\pi/4} = 32e^{i5\\pi/2} = 32e^{i\\pi/2} = 32i$. Imaginary part 32. (Faster: $(1 + i)^2 = 2i$, so $(1 + i)^{10} = (2i)^5 = 32i$.)' },
    { id: 'cx-030', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'hyperbolic functions',
      q: 'The value of $\\cos(i)$ is approximately',
      options: ['$0.540$', '$1.543$', '$1.175\\,i$', '$1$'], answer: 1,
      sol: '$\\cos(i) = \\tfrac12(e^{i\\cdot i} + e^{-i\\cdot i}) = \\tfrac12(e^{-1} + e) = \\cosh1 \\approx 1.543$. A complex cosine can exceed 1.',
      trap: '0.540 is $\\cos(1)$ in radians.' },
    { id: 'cx-031', type: 'nat', level: 4, exams: ['gate', 'jam'], sub: 'hyperbolic functions',
      q: 'The equation $\\sin z = 2$ has solutions $z = \\tfrac{\\pi}{2} + 2\\pi n \\pm iy$. The positive value of $y$ is ______ (to two decimal places).',
      answer: 1.32, tol: 0.01, calc: () => Math.log(2 + Math.sqrt(3)),
      sol: 'With $z = x + iy$: $\\sin z = \\sin x\\cosh y + i\\cos x\\sinh y$. The imaginary part must vanish; $y \\ne 0$ forces $\\cos x = 0$, and then $\\sin x\\cosh y = 2$ needs $\\sin x = 1$, $\\cosh y = 2$. So $y = \\cosh^{-1}2 = \\ln(2 + \\sqrt3) \\approx 1.32$.',
      trap: 'Saying "no solution": $|\\sin z| \\le 1$ only for real $z$.' },
    { id: 'cx-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'analytic functions',
      q: 'Which functions of $z = x + iy$ are analytic (satisfy the Cauchy-Riemann equations) everywhere?',
      options: ['$z^2$', '$e^{z}$', '$\\bar z$', '$|z|^2$'], answer: [0, 1],
      sol: 'Cauchy-Riemann: $u_x = v_y$, $u_y = -v_x$. A: $u = x^2 - y^2$, $v = 2xy$: $2x = 2x$, $-2y = -2y$ ✓. B: $u = e^x\\cos y$, $v = e^x\\sin y$ ✓. C: $u = x$, $v = -y$: $u_x = 1 \\ne v_y = -1$ ✗. D: $u = x^2 + y^2$, $v = 0$: only at the origin ✗.',
      trap: 'Functions that need $\\bar z$ to be written are not analytic.' },
    { id: 'cx-033', type: 'nat', level: 4, exams: ['jam'], sub: 'phasors',
      q: 'Two waves $2\\cos\\omega t$ and $2\\cos(\\omega t + \\pi/3)$ are added. The amplitude of the sum is ______ (to two decimal places).',
      answer: 3.46, tol: 0.01, calc: () => Math.hypot(2 + 2 * Math.cos(Math.PI / 3), 2 * Math.sin(Math.PI / 3)),
      sol: 'Add the phasors: $2 + 2e^{i\\pi/3} = 2 + 1 + i\\sqrt3 = 3 + i\\sqrt3$, of modulus $\\sqrt{9 + 3} = \\sqrt{12} = 2\\sqrt3 \\approx 3.46$. Or use $A = \\sqrt{A_1^2 + A_2^2 + 2A_1A_2\\cos\\phi} = \\sqrt{4 + 4 + 4} = \\sqrt{12}$.',
      trap: 'Adding amplitudes (4) works only when the waves are in phase.' },
    { id: 'cx-034', type: 'mcq', level: 4, exams: ['jam'], sub: 'roots',
      q: 'Which of these is NOT a cube root of $8i$?',
      options: ['$\\sqrt3 + i$', '$-\\sqrt3 + i$', '$-2i$', '$2i$'], answer: 3,
      sol: '$8i = 8e^{i\\pi/2}$, so the cube roots are $2e^{i(\\pi/6 + 2\\pi k/3)}$: $2e^{i\\pi/6} = \\sqrt3 + i$, $2e^{i5\\pi/6} = -\\sqrt3 + i$, $2e^{i3\\pi/2} = -2i$. And $(2i)^3 = 8i^3 = -8i$, not $8i$.',
      trap: '$2i$ looks natural, but $i^3 = -i$ flips the sign.' },
    { id: 'cx-035', type: 'nat', level: 4, exams: ['jam'], sub: 'geometry',
      q: 'The point $z = 3 + 4i$ is rotated by $90^\\circ$ anticlockwise about the point $1 + i$. The real part of the image is ______.',
      answer: -2, tol: 0, calc: () => 1 - (4 - 1),
      sol: 'Shift so the centre is at 0, rotate (multiply by $i$), shift back: $(z - c)i + c = (2 + 3i)i + 1 + i = (-3 + 2i) + 1 + i = -2 + 3i$. Real part $-2$.',
      trap: 'Multiplying $z$ itself by $i$ rotates about the origin, giving $-4 + 3i$.' },
    { id: 'cx-036', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'euler formula',
      q: 'For real $\\theta$ not a multiple of $2\\pi$, the real part of $\\dfrac{1}{1 - e^{i\\theta}}$ is',
      options: ['$\\tfrac12\\cot\\tfrac\\theta2$', '$\\tfrac12$', '$0$', '$\\dfrac{1}{1 - \\cos\\theta}$'], answer: 1,
      sol: 'Factor out the half angle: $1 - e^{i\\theta} = e^{i\\theta/2}(e^{-i\\theta/2} - e^{i\\theta/2}) = -2i\\sin\\tfrac\\theta2\\,e^{i\\theta/2}$. So $\\dfrac{1}{1 - e^{i\\theta}} = \\dfrac{ie^{-i\\theta/2}}{2\\sin(\\theta/2)} = \\dfrac{\\sin\\frac\\theta2 + i\\cos\\frac\\theta2}{2\\sin\\frac\\theta2} = \\tfrac12 + \\tfrac i2\\cot\\tfrac\\theta2$. The real part is $\\tfrac12$ for every such $\\theta$.',
      trap: 'Option A is the imaginary part.' },
    { id: 'cx-043', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'de moivre',
      q: 'Writing $\\cos^4\\theta = a + b\\cos2\\theta + c\\cos4\\theta$, the constant $a$ is ______ (to three decimal places).',
      answer: 0.375, tol: 0.001, calc: () => 6 / 16,
      sol: '$\\cos\\theta = \\tfrac12(e^{i\\theta} + e^{-i\\theta})$, so $\\cos^4\\theta = \\tfrac1{16}(e^{4i\\theta} + 4e^{2i\\theta} + 6 + 4e^{-2i\\theta} + e^{-4i\\theta}) = \\tfrac18(\\cos4\\theta + 4\\cos2\\theta + 3)$. So $a = \\tfrac38 = 0.375$; it is also the average of $\\cos^4\\theta$ over a period.' },

    // ---- level 5 ----
    { id: 'cx-037', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'series',
      q: 'The value of $\\displaystyle\\sum_{k=0}^{6}\\binom{6}{k}\\cos\\frac{k\\pi}{3}$ is ______.',
      answer: -27, tol: 0, calc: () => { let s = 0, c = 1; for (let k = 0; k <= 6; k++) { s += c * Math.cos(k * Math.PI / 3); c = c * (6 - k) / (k + 1); } return Math.round(s); },
      sol: 'It is $\\operatorname{Re}\\sum\\binom6k e^{ik\\pi/3} = \\operatorname{Re}(1 + e^{i\\pi/3})^6$. Factor the half angle: $1 + e^{i\\theta} = 2\\cos\\tfrac\\theta2\\,e^{i\\theta/2}$, so the sum is $(2\\cos\\tfrac\\pi6)^6\\cos\\pi = (\\sqrt3)^6(-1) = -27$.' },
    { id: 'cx-038', type: 'mcq', level: 5, exams: ['gate', 'jam'], sub: 'complex powers',
      q: 'The principal value of $(-1)^{1/\\pi}$ is',
      options: ['$-1$', '$e^{-1}$', '$\\cos1 + i\\sin1$', '$\\cos\\pi^2 + i\\sin\\pi^2$'], answer: 2,
      sol: '$(-1)^{1/\\pi} = e^{\\frac1\\pi\\operatorname{Log}(-1)} = e^{\\frac1\\pi\\cdot i\\pi} = e^{i} = \\cos1 + i\\sin1$ (angle 1 radian).',
      trap: 'Real-number rules like "an odd root of $-1$ is $-1$" do not apply to the irrational power $1/\\pi$.' },
    { id: 'cx-039', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'series',
      q: 'The value of $\\displaystyle\\sum_{k=1}^{\\infty}\\frac{\\sin(k\\pi/2)}{2^k}$ is ______ (to one decimal place).',
      answer: 0.4, tol: 0.01, calc: () => { let s = 0; for (let k = 1; k < 60; k++) s += Math.sin(k * Math.PI / 2) / 2 ** k; return s; },
      sol: 'It is $\\operatorname{Im}\\sum w^k$ with $w = \\tfrac12e^{i\\pi/2} = \\tfrac i2$. The geometric series gives $\\dfrac{w}{1 - w} = \\dfrac{i/2}{1 - i/2} = \\dfrac{i}{2 - i} = \\dfrac{i(2 + i)}{5} = \\dfrac{-1 + 2i}{5}$. Imaginary part $0.4$. Check: $\\tfrac12 - \\tfrac18 + \\tfrac1{32} - \\dots = \\tfrac{1/2}{1 + 1/4} = 0.4$.' },
    { id: 'cx-040', type: 'msq', level: 5, exams: ['gate', 'net', 'jam'], sub: 'complex logarithm',
      q: 'With $\\operatorname{Log}$ the principal logarithm ($-\\pi < \\operatorname{Im}\\operatorname{Log}z \\le \\pi$), which are true?',
      options: ['$\\operatorname{Log}(z_1z_2) = \\operatorname{Log}z_1 + \\operatorname{Log}z_2$ for all non-zero $z_1, z_2$.', '$e^{\\operatorname{Log}z} = z$ for every $z \\ne 0$.', '$\\operatorname{Log}(e^{z}) = z$ only when $-\\pi < \\operatorname{Im}z \\le \\pi$.', '$\\operatorname{Log}1 = 0$.'], answer: [1, 2, 3],
      sol: 'A fails: $z_1 = z_2 = -1$ gives $\\operatorname{Log}1 = 0$ on the left but $2i\\pi$ on the right. B: the exponential undoes any branch. C: $e^z$ forgets multiples of $2\\pi i$, and Log returns the representative in the principal strip. D: yes.' },
    { id: 'cx-041', type: 'nat', level: 5, exams: ['gate', 'net', 'jam'], sub: 'roots of unity',
      q: 'With $\\omega = e^{2\\pi i/7}$, the value of $\\displaystyle\\prod_{k=1}^{6}\\left|1 - \\omega^k\\right|$ is ______.',
      answer: 7, tol: 0.01, calc: () => { let p = 1; for (let k = 1; k <= 6; k++) p *= Math.hypot(1 - Math.cos(2 * Math.PI * k / 7), Math.sin(2 * Math.PI * k / 7)); return p; },
      sol: '$z^7 - 1 = (z - 1)\\prod_{k=1}^{6}(z - \\omega^k)$, so $\\prod_{k=1}^6(z - \\omega^k) = 1 + z + \\dots + z^6$. At $z = 1$: $\\prod(1 - \\omega^k) = 7$. Take the modulus: 7.',
      trap: 'Trying to multiply six chord lengths numerically is slow; the polynomial identity gives it in one line.' },
    { id: 'cx-042', type: 'mcq', level: 5, exams: ['jam', 'gate'], sub: 'roots',
      q: 'How many complex numbers $z$ satisfy $z^4 = \\bar z$?',
      options: ['$4$', '$5$', '$6$', 'infinitely many'], answer: 2,
      sol: 'Take moduli: $|z|^4 = |z|$, so $|z| = 0$ or $|z| = 1$. $z = 0$ is one solution. If $|z| = 1$ then $\\bar z = 1/z$, so $z^4 = 1/z$, i.e. $z^5 = 1$: five solutions. Total 6.',
      trap: 'Forgetting $z = 0$ gives 5.' },
    ...more2,
  ],
  gens: [
    { id: 'cx-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'modulus and argument',
      make(r) {
        const a = int(r, -5, 5) || 1, b = int(r, -5, 5) || 2, c = int(r, -4, 4) || 3, d = int(r, -4, 4) || 1;
        const answer = round(Math.hypot(a, b) * Math.hypot(c, d), 3);
        const z = (x, y) => `${x} ${y < 0 ? '-' : '+'} ${Math.abs(y) === 1 ? '' : Math.abs(y)}i`;
        return { q: `The modulus of $(${z(a, b)})(${z(c, d)})$ is ______ (to three decimal places).`, answer, tol: 0.002, a, b, c, d,
          sol: `Moduli multiply: $|z_1z_2| = \\sqrt{${a * a} + ${b * b}}\\times\\sqrt{${c * c} + ${d * d}} = \\sqrt{${(a * a + b * b) * (c * c + d * d)}} = ${answer}$.` };
      },
      verify: (p) => Math.hypot(p.a * p.c - p.b * p.d, p.a * p.d + p.b * p.c) },
    { id: 'cx-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'modulus and argument',
      make(r) {
        const [x, y] = choose(r, [[1, 1], [1, Math.sqrt(3)], [Math.sqrt(3), 1], [0, 1], [1, 0]]);
        const sx = choose(r, [1, -1]), sy = choose(r, [1, -1]);
        const X = x === 0 ? 0 : sx * x, Y = y === 0 ? 0 : sy * y;
        const show = (v) => (Math.abs(Math.abs(v) - Math.sqrt(3)) < 1e-9 ? `${v < 0 ? '-' : ''}\\sqrt3` : String(v));
        const answer = round(deg(Math.atan2(Y, X)), 2);
        const zs = X === 0 ? (Y < 0 ? '-i' : 'i') : Y === 0 ? show(X) : `${show(X)} ${Y < 0 ? '-' : '+'} ${show(Math.abs(Y)) === '1' ? '' : show(Math.abs(Y))}i`;
        return { q: `The principal argument (in degrees, between $-180^\\circ$ and $180^\\circ$) of $z = ${zs}$ is ______.`, answer, tol: 0.5, X, Y,
          sol: `The point is $(${show(X)}, ${show(Y)})$. The reference angle is $\\tan^{-1}|y/x|$ (or $90^\\circ$ on an axis); placing it in the right quadrant gives $\\arg z = ${answer}^\\circ$.`,
          trap: 'Check the quadrant from the signs of the real and imaginary parts: a calculator\'s $\\tan^{-1}(y/x)$ cannot tell $(1,1)$ from $(-1,-1)$.' };
      },
      verify: (p) => deg(Math.atan2(p.Y, p.X)) },
    { id: 'cx-g03', type: 'nat', level: 3, exams: ['jam'], sub: 'de moivre',
      make(r) {
        const [name, R, th] = choose(r, [['1 + i', Math.SQRT2, 45], ['\\sqrt3 + i', 2, 30], ['1 + i\\sqrt3', 2, 60], ['1 - i', Math.SQRT2, -45], ['-1 + i', Math.SQRT2, 135]]);
        const n = int(r, 3, 9), part = choose(r, ['real', 'imaginary']);
        const val = R ** n * (part === 'real' ? Math.cos(n * th * Math.PI / 180) : Math.sin(n * th * Math.PI / 180));
        const answer = round(val, 2);
        return { q: `The ${part} part of $(${name})^{${n}}$ is ______ (to two decimal places).`, answer, tol: 0.01, R, th, n, part,
          sol: `$${name} = ${R === 2 ? 2 : '\\sqrt2'}\\,e^{i(${th}^\\circ)}$. By De Moivre, $(${name})^{${n}} = ${R === 2 ? 2 : '\\sqrt2'}^{${n}}e^{i(${n * th}^\\circ)}$, whose ${part} part is $${round(R ** n, 3)}\\times${part === 'real' ? '\\cos' : '\\sin'}(${n * th}^\\circ) = ${answer}$.` };
      },
      verify: (p) => p.R ** p.n * (p.part === 'real' ? Math.cos(p.n * p.th * Math.PI / 180) : Math.sin(p.n * p.th * Math.PI / 180)) },
    { id: 'cx-g04', type: 'nat', level: 2, exams: ['jam'], sub: 'algebra',
      make(r) {
        const a = int(r, -5, 5), b = int(r, -5, 5) || 1, c = int(r, -4, 4) || 2, d = int(r, -4, 4) || 1;
        const part = choose(r, ['real', 'imaginary']);
        const den = c * c + d * d, re = (a * c + b * d) / den, im = (b * c - a * d) / den;
        const answer = round(part === 'real' ? re : im, 3);
        return { q: `The ${part} part of $\\dfrac{${a} ${b < 0 ? '-' : '+'} ${Math.abs(b)}i}{${c} ${d < 0 ? '-' : '+'} ${Math.abs(d)}i}$ is ______ (to three decimal places).`.replace(/ 1i/g, ' i'), answer, tol: 0.002, a, b, c, d, part,
          sol: `Multiply top and bottom by the conjugate $${c} ${d < 0 ? '+' : '-'} ${Math.abs(d)}i$. Denominator: $${c}^2 + ${d}^2 = ${den}$. Numerator: $(${a}\\cdot${c} + ${b}\\cdot${d}) + i(${b}\\cdot${c} - ${a}\\cdot${d}) = ${a * c + b * d} ${b * c - a * d < 0 ? '-' : '+'} ${Math.abs(b * c - a * d)}i$. So the ${part} part is $${part === 'real' ? a * c + b * d : b * c - a * d}/${den} = ${answer}$.` };
      },
      verify: (p) => { const D = p.c * p.c + p.d * p.d; return p.part === 'real' ? (p.a * p.c + p.b * p.d) / D : (p.b * p.c - p.a * p.d) / D; } },
    { id: 'cx-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'roots',
      make(r) {
        const n = int(r, 2, 7), a = choose(r, [1, 2, 3, 5, 8, 16, 27, 32]);
        const answer = (n % 2 === 0 ? -1 : 1) * a;
        return { q: `The product of all ${n} roots of $z^{${n}} = ${a}$ is ______.`, answer, tol: 0, n, a,
          sol: `$z^{${n}} - ${a} = 0$ is monic of degree ${n}, so the product of its roots is $(-1)^{${n}}\\times(-${a}) = ${answer}$. (Geometrically: the roots are $${a}^{1/${n}}e^{2\\pi ik/${n}}$, and the angles add up to $(${n} - 1)\\pi$.)`,
          trap: 'The product is not simply the right-hand side: the sign depends on whether the degree is even or odd.' };
      },
      verify: (p) => { let ang = 0; for (let k = 0; k < p.n; k++) ang += 2 * Math.PI * k / p.n; return p.a * Math.cos(ang); } },
    { id: 'cx-g06', type: 'nat', level: 2, exams: ['jam'], sub: 'phasors',
      make(r) {
        const R = int(r, 1, 20), X = int(r, 1, 20), cap = r() < 0.5;
        const answer = round(deg(Math.atan2(X, R)), 2);
        return { q: `A circuit has impedance $Z = ${R} ${cap ? '-' : '+'} ${X}i\\ \\Omega$ (${cap ? 'capacitive' : 'inductive'}). The current ${cap ? 'leads' : 'lags'} the voltage by ______ degrees (to two decimal places).`, answer, tol: 0.05, unit: '°', R, X,
          sol: `$I = V/Z$, so the phase difference is $|\\arg Z| = \\tan^{-1}(${X}/${R}) = ${answer}^\\circ$, with the current ${cap ? 'ahead (capacitor)' : 'behind (inductor)'}.` };
      },
      verify: (p) => deg(Math.atan2(p.X, p.R)) },
    { id: 'cx-g07', type: 'nat', level: 3, exams: ['jam'], sub: 'phasors',
      make(r) {
        const A1 = int(r, 1, 6), A2 = int(r, 1, 6), ph = choose(r, [30, 45, 60, 90, 120, 135, 150]);
        const p = ph * Math.PI / 180;
        const answer = round(Math.sqrt(A1 * A1 + A2 * A2 + 2 * A1 * A2 * Math.cos(p)), 3);
        return { q: `The amplitude of $${A1}\\cos\\omega t + ${A2}\\cos(\\omega t + ${ph}^\\circ)$ is ______ (to three decimal places).`, answer, tol: 0.002, A1, A2, ph,
          sol: `Add phasors: $${A1} + ${A2}e^{i\\,${ph}^\\circ}$. Its modulus is $\\sqrt{A_1^2 + A_2^2 + 2A_1A_2\\cos\\phi} = \\sqrt{${A1 * A1} + ${A2 * A2} + ${2 * A1 * A2}\\cos${ph}^\\circ} = ${answer}$.`,
          trap: 'Amplitudes add directly only for waves in phase.' };
      },
      verify: (p) => { const t = p.ph * Math.PI / 180; return Math.hypot(p.A1 + p.A2 * Math.cos(t), p.A2 * Math.sin(t)); } },
    { id: 'cx-g08', type: 'mcq', level: 1, exams: ['jam'], sub: 'algebra',
      make(r) {
        const n = int(r, 5, 999), neg = r() < 0.3;
        const vals = ['1', 'i', '-1', '-i'];
        const m = ((neg ? -n : n) % 4 + 4) % 4;
        const o = mcqOptions(r, vals[m], vals.filter((v, k) => k !== m), (v) => `$${v}$`);
        return { q: `The value of $i^{${neg ? -n : n}}$ is`, ...o,
          sol: `Powers of $i$ repeat every 4 ($i^0 = 1, i^1 = i, i^2 = -1, i^3 = -i$). $${neg ? -n : n} \\equiv ${m} \\pmod 4$, so $i^{${neg ? -n : n}} = i^{${m}} = ${vals[m]}$.${neg ? ' (For negative powers use $i^{-1} = -i$, which the remainder rule handles automatically.)' : ''}`,
          trap: 'For a negative exponent take the remainder that lies in 0 to 3, not the negative remainder.' };
      } },
    ...more,
  ],
};
