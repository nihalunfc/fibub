// Complex numbers (Plus Two entrance, Mathematics). Original fibub questions.
import { pick, int, choose, fmt, shuffleOpts } from '../_entrance.js';

const R = String.raw;
const EXS = {
  1: ['keam', 'cusat', 'comedk', 'jee-main'],
  2: ['keam', 'cusat', 'comedk', 'jee-main'],
  3: ['jee-main', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv'],
  5: ['jee-adv'],
};
const POS = [1, 3, 0, 2, 2, 0, 3, 1];
let _n = 0;
const place = (correct, wrongs) => {
  const p = POS[_n++ % POS.length];
  const o = [...wrongs];
  o.splice(p, 0, correct);
  return { options: o, answer: p };
};
const base = (id, level, sub, extra) => ({ id, level, exams: EXS[level], sub, ...extra });
const M = (id, level, sub, q, correct, wrongs, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'single', q, ...place(correct, wrongs), sol, trap, ...more });
const I = (id, level, sub, q, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'nat', format: 'integer', q, answer, tol: 0, sol, trap, ...more });
const N = (id, level, sub, q, answer, tol, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'nat', format: 'numeric', q, answer, tol, sol, trap, ...more });
const X = (id, level, sub, q, options, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, trap, ...more });
const AOPT = [
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is not the correct explanation of A',
  'A is true but R is false',
  'A is false but R is true',
];
const SOPT = [
  'Both Statement I and Statement II are true',
  'Statement I is true and Statement II is false',
  'Statement I is false and Statement II is true',
  'Both Statement I and Statement II are false',
];
const A = (id, level, sub, a, r, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'assertion', q: `<p><b>Assertion (A):</b> ${a}</p><p><b>Reason (R):</b> ${r}</p>`, options: AOPT, answer, sol, trap, ...more });
const S = (id, level, sub, s1, s2, answer, sol, trap, more = {}) =>
  base(id, level, sub, { type: 'mcq', format: 'statements', q: `<p><b>Statement I:</b> ${s1}</p><p><b>Statement II:</b> ${s2}</p>`, options: SOPT, answer, sol, trap, ...more });
const MT = (id, level, sub, group, q, correct, wrongs, sol, trap) =>
  base(id, level, sub, { type: 'mcq', format: 'match', group, q, ...place(correct, wrongs), sol, trap });
const P = (id, level, sub, group, q, correct, wrongs, sol, trap) =>
  base(id, level, sub, { type: 'mcq', format: 'passage', group, q, ...place(correct, wrongs), sol, trap });
const PI = (id, level, sub, group, q, answer, sol, trap) =>
  base(id, level, sub, { type: 'nat', format: 'passage', group, q, answer, tol: 0, sol, trap });

const groups = {
  m1: {
    title: 'Powers of i',
    passage: R`<p>Match each expression in List I with its value in List II.</p>`,
    list1: ['A. $i^{23}$', 'B. $i^{-10}$', 'C. $\\dfrac{(1+i)^2}{2}$', 'D. $(1-i)^4$'],
    list2: ['p. $i$', 'q. $-1$', 'r. $-i$', 's. $-4$'],
  },
  m2: {
    title: 'Loci in the Argand plane',
    passage: R`<p>$z=x+iy$. Match each condition in List I with the curve it represents in List II.</p>`,
    list1: ['A. $|z-1|=|z+1|$', 'B. $|z-1|+|z+1|=4$', 'C. $|z-i|=2$', 'D. $|z|=\\mathrm{Re}(z)+1$'],
    list2: ['p. an ellipse', 'q. a circle', 'r. a straight line', 's. a parabola'],
  },
  m3: {
    title: 'Cube roots of unity',
    passage: R`<p>$\omega$ is a non-real cube root of unity. Match each expression in List I with its value in List II.</p>`,
    list1: ['A. $1+\\omega+\\omega^2$', 'B. $\\omega^{3}$', 'C. $\\omega^{50}$', 'D. $(1+\\omega)^2$'],
    list2: ['p. $0$', 'q. $1$', 'r. $\\omega^2$', 's. $\\omega$'],
  },
  m4: {
    title: 'Principal arguments',
    passage: R`<p>Match each number in List I with its principal argument in List II (the argument lies in $(-\\pi,\\pi]$).</p>`,
    list1: ['A. $-\\sqrt3+i$', 'B. $-1-i$', 'C. $2-2i$', 'D. $-4$'],
    list2: ['p. $\\pi$', 'q. $-\\dfrac\\pi4$', 'r. $\\dfrac{5\\pi}6$', 's. $-\\dfrac{3\\pi}4$'],
  },
  p1: {
    title: 'Passage: a triangle in the Argand plane',
    passage: R`<p>The points $A$, $B$, $C$ represent the complex numbers $1+i$, $4+i$ and $4+5i$.</p>`,
  },
  p2: {
    title: 'Passage: numbers of the form a + b&omega;',
    passage: R`<p>Let $\omega=\dfrac{-1+i\sqrt3}2$. For integers $a,b$ let $z=a+b\omega$. Then $|z|^2=(a+b\omega)(a+b\bar\omega)=a^2-ab+b^2$, since $\bar\omega=\omega^2$ and $\omega+\omega^2=-1$.</p>`,
  },
};

const items = [
  // ---------- L1 warm-up ----------
  M('cn-001', 1, 'powers of i', R`The value of $i^{25}$ is`, '$i$', ['$-i$', '$1$', '$-1$'],
    R`<p>Powers of $i$ repeat in a cycle of 4: $i,-1,-i,1$. $25=4\times6+1$, so $i^{25}=i^1=i$.</p>`,
    'Divide the power by 4 and use the remainder.'),
  M('cn-002', 1, 'modulus', R`The modulus of $3+4i$ is`, '5', ['7', '25', '1'],
    R`<p>$|3+4i|=\sqrt{3^2+4^2}=\sqrt{25}=5$.</p>`,
    '25 is the square of the modulus.'),
  M('cn-003', 1, 'conjugate', R`The conjugate of $2-5i$ is`, '$2+5i$', ['$-2+5i$', '$-2-5i$', '$5-2i$'],
    R`<p>The conjugate changes only the sign of the imaginary part: $\overline{2-5i}=2+5i$.</p>`,
    'The real part keeps its sign.'),
  M('cn-004', 1, 'algebra', R`$(2+3i)(1-i)$ equals`, '$5+i$', ['$-1+5i$', '$2-3i$', '$5-i$'],
    R`<p>$(2+3i)(1-i)=2-2i+3i-3i^2=2+i+3=5+i$.</p>`,
    'The last term −3i² = +3, not −3.'),
  M('cn-005', 1, 'division', R`$\dfrac1{1+i}$ equals`, R`$\dfrac{1-i}2$`, [R`$\dfrac{1+i}2$`, R`$1-i$`, R`$\dfrac{-1+i}{2}$`],
    R`<p>Multiply top and bottom by the conjugate: $\dfrac{1-i}{(1+i)(1-i)}=\dfrac{1-i}{1+1}=\dfrac{1-i}2$.</p>`,
    'The denominator becomes 2, not 1 − i².'),
  I('cn-006', 1, 'algebra', R`Find the imaginary part of $(2+i)^2$.`, 4,
    R`<p>$(2+i)^2=4+4i+i^2=3+4i$. The imaginary part is 4 (the coefficient of $i$, not $4i$).</p>`,
    'The imaginary part is a real number.'),
  M('cn-007', 1, 'powers of i', R`The value of $i^{-7}$ is`, '$i$', ['$-i$', '$1$', '$-1$'],
    R`<p>$i^{-7}=\dfrac1{i^7}$ and $i^7=i^3=-i$. So $i^{-7}=\dfrac1{-i}=\dfrac{i}{-i\cdot i}=\dfrac i1=i$. (Or add 8 to the power: $i^{-7}=i^{1}$.)</p>`,
    'A negative power also follows the cycle of 4: add a multiple of 4 to make it positive.'),
  M('cn-008', 1, 'argument', R`The principal argument of $-1+i$ is`, R`$\dfrac{3\pi}4$`, [R`$-\dfrac\pi4$`, R`$\dfrac\pi4$`, R`$-\dfrac{3\pi}4$`],
    R`<p>The point $(-1,1)$ is in the second quadrant. The reference angle is $\dfrac\pi4$, so $\arg=\pi-\dfrac\pi4=\dfrac{3\pi}4$.</p>`,
    'tan⁻¹(−1) alone gives −π/4, which is in the wrong quadrant.'),
  I('cn-009', 1, 'modulus', R`If $z=(1+i)^4$, find $|z|$.`, 4,
    R`<p>$(1+i)^2=2i$ and $(2i)^2=-4$. So $z=-4$ and $|z|=4$. (Also $|z|=|1+i|^4=(\sqrt2)^4=4$.)</p>`,
    'The modulus of a power is the power of the modulus.'),
  M('cn-010', 1, 'cube roots of unity', R`If $\omega$ is a non-real cube root of unity, $1+\omega+\omega^2$ equals`, '0', ['1', '$-1$', '$\\omega$'],
    R`<p>$\omega$ satisfies $\omega^3-1=0$, i.e. $(\omega-1)(\omega^2+\omega+1)=0$. Since $\omega\ne1$, $1+\omega+\omega^2=0$.</p>`,
    'The sum of all three cube roots (1, ω, ω²) is 0.'),
  M('cn-011', 1, 'polar form', R`The polar form of $1+i$ is`, R`$\sqrt2\left(\cos\dfrac\pi4+i\sin\dfrac\pi4\right)$`, [R`$2\left(\cos\dfrac\pi4+i\sin\dfrac\pi4\right)$`, R`$\sqrt2\left(\cos\dfrac\pi2+i\sin\dfrac\pi2\right)$`, R`$\sqrt2\left(\cos\dfrac\pi4-i\sin\dfrac\pi4\right)$`],
    R`<p>$r=\sqrt{1+1}=\sqrt2$ and $\theta=\tan^{-1}1=\dfrac\pi4$ (first quadrant).</p>`,
    'The modulus is √2, not 2.'),
  M('cn-012', 1, 'algebra', R`The real part of $\dfrac{1+i}{1-i}$ is`, '0', ['1', '$-1$', '$i$'],
    R`<p>$\dfrac{1+i}{1-i}=\dfrac{(1+i)^2}{2}=\dfrac{2i}2=i$. The real part is 0 (the number is purely imaginary).</p>`,
    '"i" is not a real part: the real part of i is 0.'),
  I('cn-013', 1, 'powers of i', R`Find the value of $i+i^2+i^3+i^4$.`, 0,
    R`<p>$i-1-i+1=0$. Four consecutive powers of $i$ always add to 0.</p>`,
    'A block of four consecutive powers cancels.'),
  M('cn-014', 1, 'square roots', R`The square roots of $-9$ are`, R`$\pm3i$`, [R`$3i$ only`, R`$\pm3$`, R`$\pm9i$`],
    R`<p>$(3i)^2=-9$ and $(-3i)^2=-9$. There are two roots: $\pm3i$.</p>`,
    'Every non-zero number has two square roots.'),

  // ---------- L2 standard ----------
  I('cn-015', 2, 'powers', R`Find $(1+i)^8$.`, 16,
    R`<p>$(1+i)^2=2i$. Then $(1+i)^8=(2i)^4=16i^4=16$.</p>`,
    'Square repeatedly rather than expanding.'),
  I('cn-016', 2, 'powers of i', R`Find the value of $1+i+i^2+i^3+\cdots+i^{100}$.`, 1,
    R`<p>There are 101 terms. The first 100 terms ($i^0$ to $i^{99}$) form 25 blocks of four, each adding to 0. What is left is $i^{100}=(i^4)^{25}=1$.</p>`,
    'Count the terms: 101, not 100.'),
  I('cn-017', 2, 'division', R`If $z=\dfrac{3+4i}{1-2i}$, find $|z|^2$.`, 5,
    R`<p>$z=\dfrac{(3+4i)(1+2i)}{5}=\dfrac{3+6i+4i-8}5=\dfrac{-5+10i}5=-1+2i$. So $|z|^2=1+4=5$.</p><p>Shortcut: $|z|=\dfrac{|3+4i|}{|1-2i|}=\dfrac5{\sqrt5}=\sqrt5$.</p>`,
    'The modulus of a quotient is the quotient of the moduli.'),
  M('cn-018', 2, 'division', R`The multiplicative inverse of $3-4i$ is`, R`$\dfrac{3+4i}{25}$`, [R`$\dfrac{3+4i}{5}$`, R`$\dfrac{3-4i}{25}$`, R`$\dfrac{-3+4i}{25}$`],
    R`<p>$\dfrac1z=\dfrac{\bar z}{|z|^2}=\dfrac{3+4i}{25}$.</p>`,
    'Divide by |z|² (25), not by |z| (5).'),
  I('cn-019', 2, 'equations', R`Real numbers $x,y$ satisfy $(x+iy)(1-2i)=8-i$. Find $x+y$.`, 5,
    R`<p>$x+iy=\dfrac{8-i}{1-2i}=\dfrac{(8-i)(1+2i)}5=\dfrac{8+16i-i+2}5=\dfrac{10+15i}5=2+3i$. So $x=2,y=3$ and $x+y=5$.</p><p>Check: $(2+3i)(1-2i)=2-4i+3i+6=8-i$ ✓.</p>`,
    'Divide by 1 − 2i by using its conjugate.'),
  M('cn-020', 2, 'argument', R`The principal argument of $-1-\sqrt3\,i$ is`, R`$-\dfrac{2\pi}3$`, [R`$\dfrac{2\pi}3$`, R`$\dfrac{4\pi}3$`, R`$-\dfrac\pi3$`],
    R`<p>The point $(-1,-\sqrt3)$ is in the third quadrant. The reference angle is $\tan^{-1}\sqrt3=\dfrac\pi3$. Measured from the positive x-axis: $\pi+\dfrac\pi3=\dfrac{4\pi}3$, which is outside $(-\pi,\pi]$; subtract $2\pi$: $-\dfrac{2\pi}3$.</p>`,
    '4π/3 is a valid argument but not the principal one.'),
  M('cn-021', 2, 'loci', R`The locus of $z$ satisfying $|z-1|=|z+1|$ is`, 'the imaginary axis', ['the real axis', 'a circle of radius 1', 'the line $x=1$'],
    R`<p>The points are equidistant from $1$ and $-1$: the perpendicular bisector of the segment joining them, which is the line $x=0$.</p>`,
    'The two fixed points are on the real axis, so the bisector is the imaginary axis.'),
  M('cn-022', 2, 'cube roots of unity', R`If $\omega$ is a non-real cube root of unity, $(1+\omega)^3$ equals`, '$-1$', ['$1$', '$0$', '$\\omega$'],
    R`<p>$1+\omega=-\omega^2$. So $(1+\omega)^3=-\omega^6=-(\omega^3)^2=-1$.</p>`,
    'Use 1 + ω = −ω² before cubing.'),
  M('cn-023', 2, 'polar form', R`The modulus and principal argument of $-\sqrt3+i$ are`, R`$2$ and $\dfrac{5\pi}6$`, [R`$2$ and $\dfrac\pi6$`, R`$4$ and $\dfrac{5\pi}6$`, R`$2$ and $-\dfrac{\pi}6$`],
    R`<p>$r=\sqrt{3+1}=2$. The point $(-\sqrt3,1)$ is in the second quadrant with reference angle $\tan^{-1}\dfrac1{\sqrt3}=\dfrac\pi6$. So $\theta=\pi-\dfrac\pi6=\dfrac{5\pi}6$.</p>`,
    'The reference angle is not the argument in the second quadrant.'),
  N('cn-024', 2, 'modulus', R`Find $|(1+2i)(3-4i)|$ to two decimals.`, 11.18, 0.01,
    R`<p>$|z_1z_2|=|z_1||z_2|=\sqrt5\times5=5\sqrt5\approx11.18$.</p>`,
    'No need to multiply out first.'),
  M('cn-025', 2, 'polar form', R`If $z+\dfrac1z=1$ and $z$ is a complex number, then $z^3$ equals`, '$-1$', ['$1$', '$i$', '$\\omega$'],
    R`<p>$z^2-z+1=0$, so $z=\dfrac{1\pm i\sqrt3}2=e^{\pm i\pi/3}$. Then $z^3=e^{\pm i\pi}=-1$. (Algebraically: $(z+1)(z^2-z+1)=z^3+1=0$.)</p>`,
    'Multiplying by (z + 1) turns the quadratic into z³ + 1.'),
  M('cn-026', 2, 'square roots', R`A square root of $3+4i$ is`, '$2+i$', ['$1+2i$', '$2-i$ only', '$\\sqrt3+2i$'],
    R`<p>$(2+i)^2=4+4i+i^2=3+4i$ ✓. The other root is $-(2+i)$. Option $1+2i$ squares to $-3+4i$; $2-i$ squares to $3-4i$.</p>`,
    'Check by squaring.'),
  M('cn-027', 2, 'square roots', R`The square roots of $-5+12i$ are`, R`$\pm(2+3i)$`, [R`$\pm(3+2i)$`, R`$\pm(2-3i)$`, R`$\pm(1+6i)$`],
    R`<p>Let $(a+bi)^2=-5+12i$: $a^2-b^2=-5$, $2ab=12$. $|{-5+12i}|=13$ so $a^2+b^2=13$. Then $a^2=4,b^2=9$, and $ab>0$ gives $a=2,b=3$ or $a=-2,b=-3$.</p>`,
    'The sign of ab must match the sign of the imaginary part.'),
  I('cn-028', 2, 'roots of unity', R`Find the product of all the fourth roots of unity.`, -1,
    R`<p>The roots are $1,i,-1,-i$. Product $=1\cdot i\cdot(-1)\cdot(-i)$: $1\cdot i=i$; $i\cdot(-1)=-i$; $(-i)(-i)=i^2=-1$. So the product is $-1$. (For $z^4-1=0$ the product of roots is $(-1)^4\cdot(-1)=-1$.)</p>`,
    'The product of roots of z^n − 1 = 0 is (−1)^(n+1).'),
  I('cn-029', 2, 'modulus', R`Find $|(1-i)^{10}|$.`, 32,
    R`<p>$|1-i|=\sqrt2$, so $|(1-i)^{10}|=(\sqrt2)^{10}=2^5=32$.</p>`,
    'Do not expand.'),
  M('cn-030', 2, 'loci', R`The locus of $z$ with $|z|=|z-2|$ is`, R`the line $x=1$`, [R`the line $y=1$`, R`a circle with centre $1$`, R`the real axis`],
    R`<p>Equidistant from $0$ and $2$: the perpendicular bisector, $x=1$.</p>`,
    'The bisector of a horizontal segment is vertical.'),
  I('cn-031', 2, 'powers', R`Find the real part of $(1+i)^{20}$.`, -1024,
    R`<p>$(1+i)^2=2i$, so $(1+i)^{20}=(2i)^{10}=2^{10}i^{10}=1024\cdot i^{2}=-1024$.</p>`,
    'i^10: 10 = 4×2 + 2, so i^10 = i^2 = −1.'),
  M('cn-032', 2, "De Moivre", R`$\left(\cos\dfrac\pi6+i\sin\dfrac\pi6\right)^{12}$ equals`, '1', ['$-1$', '$i$', '$\\dfrac{\\sqrt3}2+\\dfrac i2$'],
    R`<p>By De Moivre's theorem, the value is $\cos2\pi+i\sin2\pi=1$.</p>`,
    '12 × π/6 = 2π: a full turn.'),
  I('cn-033', 2, "De Moivre", R`Find $(1+i\sqrt3)^6$.`, 64,
    R`<p>$1+i\sqrt3=2\left(\cos\dfrac\pi3+i\sin\dfrac\pi3\right)$. Raise to 6: $2^6(\cos2\pi+i\sin2\pi)=64$.</p>`,
    'Use polar form for powers.'),
  I('cn-034', 2, 'distance', R`Find the distance between the points $2+3i$ and $-1+7i$.`, 5,
    R`<p>$|(2+3i)-(-1+7i)|=|3-4i|=5$.</p>`,
    'Subtract the numbers, then take the modulus.'),
  M('cn-035', 2, 'section formula', R`The point dividing the segment from $A(1+2i)$ to $B(7-4i)$ internally in the ratio $1:2$ is`, '$3$', ['$5-2i$', '$4-i$', '$3+2i$'],
    R`<p>For ratio $m:n$ the point is $\dfrac{mB+nA}{m+n}=\dfrac{(7-4i)+2(1+2i)}3=\dfrac{9+0i}3=3$.</p>`,
    'The ratio 1:2 puts the point closer to A: A gets the weight 2.'),
  I('cn-036', 2, 'area', R`The points $1+i$, $4+i$ and $1+5i$ are the vertices of a triangle. Find its area.`, 6,
    R`<p>The points are $(1,1),(4,1),(1,5)$: a right angle at $(1,1)$, with legs $3$ and $4$. Area $=\tfrac12\cdot3\cdot4=6$.</p>`,
    'Plot the points: this is a right triangle.'),
  I('cn-037', 2, 'powers of i', R`The smallest positive integer $n$ for which $\left(\dfrac{1+i}{1-i}\right)^n=1$ is`, 4,
    R`<p>$\dfrac{1+i}{1-i}=i$. $i^n=1$ first when $n=4$.</p>`,
    'i, i², i³ are not 1.'),
  I('cn-038', 2, 'roots of unity', R`If $\omega$ is a non-real cube root of unity, find $(1-\omega+\omega^2)(1+\omega-\omega^2)$.`, 4,
    R`<p>$1+\omega^2=-\omega$, so $1-\omega+\omega^2=-2\omega$. Also $1+\omega=-\omega^2$, so $1+\omega-\omega^2=-2\omega^2$. Product $=4\omega^3=4$.</p>`,
    'Replace each pair by the third root with a minus sign.'),

  // ---------- L3 exam ----------
  I('cn-039', 3, 'equations', R`Find the number of complex numbers $z$ with $z^2=\bar z$.`, 4,
    R`<p>Taking modulus: $|z|^2=|z|$, so $|z|=0$ or $1$. If $|z|=1$, then $\bar z=1/z$ and $z^3=1$: three solutions ($1,\omega,\omega^2$). Add $z=0$. Total $4$.</p>`,
    'Do not forget z = 0.'),
  I('cn-040', 3, 'equations', R`How many complex numbers $z$ satisfy $z^2+|z|=0$?`, 3,
    R`<p>$z^2=-|z|$ is real and $\le0$, so $z=iy$ with $y$ real ($z^2=-y^2$). Then $-y^2=-|y|$, i.e. $|y|(|y|-1)=0$: $y=0,\pm1$. The solutions are $0,i,-i$: three.</p>`,
    'z² must be a negative or zero real number, so z is purely imaginary.'),
  I('cn-041', 3, 'roots of unity', R`Find the product of the roots of $z^4+16=0$.`, 16,
    R`<p>For a polynomial $z^4+0z^3+0z^2+0z+16$, the product of the four roots is $(-1)^4\cdot16=16$.</p>`,
    'Sign of the product is (−1)^degree times the constant term.'),
  I('cn-042', 3, 'powers', R`If $z+\dfrac1z=\sqrt3$, find $z^{12}+\dfrac1{z^{12}}$.`, 2,
    R`<p>$z+\dfrac1z=2\cos\theta=\sqrt3$ gives $\theta=\dfrac\pi6$ and $z=e^{\pm i\pi/6}$. Then $z^{12}+\dfrac1{z^{12}}=2\cos12\theta=2\cos2\pi=2$.</p>`,
    'Use z^n + 1/z^n = 2cos nθ.'),
  I('cn-043', 3, 'cube roots of unity', R`If $\omega$ is a non-real cube root of unity, find $(1+2\omega+3\omega^2)(1+2\omega^2+3\omega)$.`, 3,
    R`<p>$(a+b\omega+c\omega^2)(a+b\omega^2+c\omega)=a^2+b^2+c^2-ab-bc-ca$. With $a,b,c=1,2,3$: $1+4+9-2-6-3=3$.</p>`,
    'This is the complex form of a² + b² + c² − ab − bc − ca.'),
  I('cn-044', 3, 'cube roots of unity', R`Find $1+\omega^{2023}+\omega^{4046}$, where $\omega$ is a non-real cube root of unity.`, 0,
    R`<p>$2023=3\cdot674+1$, so $\omega^{2023}=\omega$. $4046=2\cdot2023=3\cdot1348+2$, so $\omega^{4046}=\omega^2$. The sum is $1+\omega+\omega^2=0$.</p>`,
    'Reduce the exponents mod 3 first.'),
  I('cn-045', 3, 'cube roots of unity', R`Find $(1+\omega)(1+\omega^2)(1+\omega^4)(1+\omega^8)$, where $\omega$ is a non-real cube root of unity.`, 1,
    R`<p>$\omega^4=\omega$ and $\omega^8=\omega^2$. $(1+\omega)(1+\omega^2)=1+\omega+\omega^2+\omega^3=0+1=1$. So the product is $1\cdot1=1$.</p>`,
    'Do not just multiply by 4; reduce the exponents.'),
  M('cn-046', 3, 'cube roots of unity', R`If $\omega$ is a non-real cube root of unity, $\dfrac{a+b\omega+c\omega^2}{c+a\omega+b\omega^2}$ equals`, R`$\omega^2$`, [R`$\omega$`, '$1$', '$-1$'],
    R`<p>Multiply the denominator by $\omega^2$: $c\omega^2+a\omega^3+b\omega^4=a+b\omega+c\omega^2$, which is the numerator. So the ratio is $\omega^2$.</p>`,
    'Spot that the numerator is the denominator times ω² before computing anything.'),
  M('cn-047', 3, 'rotation', R`The point $3+i$ is rotated through $90^\circ$ anticlockwise about the point $1+i$. The new point is`, '$1+3i$', ['$-1+3i$', '$3-i$', '$-1-i$'],
    R`<p>$z-c=2$. Rotating by $90^\circ$ multiplies by $i$: $2i$. Add the centre: $1+i+2i=1+3i$.</p><p>(Option $-1+3i$ is the rotation about the origin: $i(3+i)=-1+3i$.)</p>`,
    'Subtract the centre first, rotate, then add it back.'),
  M('cn-048', 3, 'geometry', R`The vertices of an equilateral triangle are $0$, $2$ and $z$ (with $\operatorname{Im}z>0$). Then $z$ is`, R`$1+i\sqrt3$`, [R`$1+i$`, R`$2+i\sqrt3$`, R`$\sqrt3+i$`],
    R`<p>The third vertex is at distance 2 from both: it lies on $x=1$ with $1+y^2=4$, so $y=\sqrt3$. Using rotation: $z=2e^{i\pi/3}=1+i\sqrt3$.</p>`,
    'The height of an equilateral triangle of side 2 is √3.'),
  M('cn-049', 3, 'geometry', R`$A=1+i$ and $C=5+3i$ are opposite vertices of a square. The other two vertices are`, R`$4$ and $2+4i$`, [R`$1+3i$ and $5+i$`, R`$3+2i$ and $4+4i$`, R`$5+i$ and $4+3i$`],
    R`<p>Centre $c=\dfrac{(1+i)+(5+3i)}2=3+2i$. $A-c=-2-i$. The other vertices are $c\pm i(A-c)$. $i(-2-i)=-2i+1=1-2i$. So $c+(1-2i)=4$ and $c-(1-2i)=2+4i$.</p><p>Check: diagonals both have length $\sqrt{20}$.</p>`,
    'The diagonals of a square are equal and perpendicular, and bisect each other.'),
  M('cn-050', 3, 'loci', R`The locus of $z$ satisfying $|z-1|+|z+1|=4$ is an ellipse with eccentricity`, R`$\dfrac12$`, [R`$\dfrac1{\sqrt3}$`, R`$\dfrac{\sqrt3}2$`, R`$\dfrac14$`],
    R`<p>The foci are $\pm1$ so $c=1$, and the constant sum is $2a=4$, so $a=2$. $e=\dfrac ca=\dfrac12$.</p>`,
    'The sum is 2a, not a.'),
  N('cn-051', 3, 'loci', R`Find the area enclosed by the locus $|z-1|+|z+1|=4$, to two decimals.`, 10.88, 0.02,
    R`<p>$a=2$, $c=1$, so $b^2=a^2-c^2=3$. Area $=\pi ab=2\sqrt3\,\pi\approx10.88$.</p>`,
    'Semi-minor axis is √3, not 1.'),
  I('cn-052', 3, 'triangle inequality', R`If $|z-25i|\le15$, find the least possible value of $|z|$.`, 10,
    R`<p>$z$ lies in a disc of radius 15 about $25i$. The nearest point to the origin is on the line from the origin through $25i$, at distance $25-15=10$.</p>`,
    'The disc does not contain the origin, since 15 < 25.'),
  M('cn-053', 3, 'loci', R`The equation $z^2+\bar z^2=2$ represents`, 'a rectangular hyperbola', ['a circle', 'a pair of lines', 'an ellipse'],
    R`<p>With $z=x+iy$, $z^2+\bar z^2=2(x^2-y^2)=2$, i.e. $x^2-y^2=1$: a rectangular hyperbola.</p>`,
    'z² + z̄² = 2Re(z²), which is 2(x² − y²).'),
  M('cn-054', 3, 'polar form', R`If $z=1+\cos\dfrac{2\pi}3+i\sin\dfrac{2\pi}3$, then the modulus and the argument of $z$ are`, R`$1$ and $\dfrac\pi3$`, [R`$2$ and $\dfrac{2\pi}3$`, R`$\dfrac12$ and $\dfrac\pi3$`, R`$1$ and $\dfrac{2\pi}3$`],
    R`<p>$z=1-\tfrac12+i\tfrac{\sqrt3}2=\tfrac12+i\tfrac{\sqrt3}2$. So $|z|=1$ and $\arg z=\dfrac\pi3$. (General: $1+\cos\theta+i\sin\theta=2\cos\dfrac\theta2\,e^{i\theta/2}$.)</p>`,
    'The half-angle appears: the argument is θ/2, not θ.'),
  I('cn-055', 3, 'powers', R`Find the smallest positive integer $n$ for which $(\sqrt3+i)^n$ is a real number.`, 6,
    R`<p>$\sqrt3+i=2e^{i\pi/6}$. $(\sqrt3+i)^n=2^ne^{in\pi/6}$ is real when $\dfrac{n\pi}6$ is a multiple of $\pi$: $n=6$.</p>`,
    'n = 3 gives a purely imaginary number, not a real one.'),
  I('cn-056', 3, 'powers', R`The smallest positive integer $n$ with $(\sqrt3+i)^n+(\sqrt3-i)^n=0$ is`, 3,
    R`<p>The sum is $2\cdot2^n\cos\dfrac{n\pi}6$. It is 0 when $\cos\dfrac{n\pi}6=0$, i.e. $\dfrac{n\pi}6=\dfrac\pi2$: $n=3$.</p>`,
    'The conjugate adds: the sum of a number and its conjugate is 2Re.'),
  I('cn-057', 3, 'polar form', R`Let $z_k=\cos\dfrac{k\pi}{10}+i\sin\dfrac{k\pi}{10}$. Find the real value of $z_1z_2z_3z_4$.`, -1,
    R`<p>Angles add: $\dfrac{\pi}{10}(1+2+3+4)=\pi$. So the product is $\cos\pi+i\sin\pi=-1$.</p>`,
    'The argument of a product is the sum of the arguments.'),
  M('cn-058', 3, 'De Moivre', R`$\cos5\theta$ in terms of $c=\cos\theta$ is`, R`$16c^5-20c^3+5c$`, [R`$16c^5+20c^3+5c$`, R`$5c-20c^3+16c^5-1$`, R`$c^5-10c^3+5c$`],
    R`<p>$\cos5\theta=\operatorname{Re}(c+is)^5=c^5-10c^3s^2+5cs^4$. Put $s^2=1-c^2$: $c^5-10c^3+10c^5+5c(1-2c^2+c^4)=16c^5-20c^3+5c$. Check at $c=1$: $16-20+5=1$ ✓.</p>`,
    'Test with θ = 0 (c = 1): the answer must be 1.'),
  M('cn-059', 3, 'loci', R`If $z$ is a complex number with $\arg\dfrac{z-1}{z+1}=\dfrac\pi2$, then $z$ lies on`, R`the circle $|z|=1$ (the part above the real axis)`, [R`the real axis`, R`the line $x=0$`, R`the circle $|z|=1$ (the part below the real axis)`],
    R`<p>The angle subtended at $z$ by the segment joining $-1$ and $1$ is $90^\circ$ (angle in a semicircle). The locus is therefore on the circle with diameter $[-1,1]$, which is $|z|=1$. $\arg=+\dfrac\pi2$ (not $-\dfrac\pi2$) means the upper semicircle.</p>`,
    'The sign of the argument selects which half.'),
  M('cn-060', 3, 'conjugate and modulus', R`If $|z_1+z_2|=|z_1-z_2|$ for non-zero $z_1,z_2$, then $\dfrac{z_1}{z_2}$ is`, 'purely imaginary', ['purely real', 'of modulus 2', 'equal to 1'],
    R`<p>Squaring: $|z_1+z_2|^2-|z_1-z_2|^2=4\operatorname{Re}(z_1\bar z_2)=0$. So $z_1\bar z_2$, hence $z_1/z_2=\dfrac{z_1\bar z_2}{|z_2|^2}$, has zero real part: purely imaginary. (The diagonals of the parallelogram are equal: a rectangle.)</p>`,
    'Equal diagonals mean perpendicular vectors.'),
  I('cn-061', 3, 'conjugate and modulus', R`If $|z_1|=|z_2|=1$, find $|z_1+z_2|^2+|z_1-z_2|^2$.`, 4,
    R`<p>Parallelogram law: $|z_1+z_2|^2+|z_1-z_2|^2=2(|z_1|^2+|z_2|^2)=2(1+1)=4$.</p>`,
    'No need to know the arguments.'),
  M('cn-062', 3, 'conjugate and modulus', R`For $|z|=1$ and $z\ne\pm1$, the number $\dfrac{z-1}{z+1}$ is`, 'purely imaginary', ['purely real', 'equal to $z$', 'of modulus 2'],
    R`<p>With $z=e^{i\theta}$: $\dfrac{e^{i\theta}-1}{e^{i\theta}+1}=\dfrac{2i\sin(\theta/2)}{2\cos(\theta/2)}=i\tan\dfrac\theta2$. Purely imaginary (and non-zero).</p>`,
    'z = ±1 are excluded because the numerator or denominator becomes 0.'),
  M('cn-063', 3, 'roots', R`Which of the following is the value of $\sqrt{-4}\cdot\sqrt{-9}$?`, '$-6$', ['$6$', '$6i$', '$-6i$'],
    R`<p>$\sqrt{-4}=2i$ and $\sqrt{-9}=3i$. Product $=6i^2=-6$. The rule $\sqrt a\sqrt b=\sqrt{ab}$ holds only when at least one of $a,b$ is non-negative.</p>`,
    'Convert to i first; do not multiply under the root.'),
  I('cn-065', 3, 'roots of unity', R`Let $\alpha$ be a primitive 8th root of unity $e^{2\pi i/8}$. Find $\displaystyle\sum_{k=0}^{7}\alpha^{12k}$.`, 0,
    R`<p>$\alpha^{12}=e^{3\pi i}=-1$. The sum is $\displaystyle\sum_{k=0}^7(-1)^k=0$. (A sum of $r$-th powers of the $n$th roots of unity is $n$ if $n\mid r$ and 0 otherwise; $8\nmid12$.)</p>`,
    'Check whether the exponent is a multiple of n.'),
  M('cn-066', 3, 'conjugate and modulus', R`Which of these is always true for complex $z$?`, R`$|z|^2=z\bar z$`, [R`$|z|=z\bar z$`, R`$z^2=|z|^2$`, R`$\bar z^2=\overline{z}\cdot z$`],
    R`<p>$z\bar z=(x+iy)(x-iy)=x^2+y^2=|z|^2$. Test the others with $z=2i$: $|z|=2$ but $z\bar z=4$; $z^2=-4\ne|z|^2=4$; $\bar z^2=-4$ but $\bar zz=4$. All three fail.</p>`,
    '|z| and |z|² are different numbers except when |z| = 1.'),
  M('cn-067', 3, 'reflection', R`The reflection of the point $1+3i$ in the line $y=x$ is`, '$3+i$', ['$-1-3i$', '$1-3i$', '$-3+i$'],
    R`<p>Reflection in the line through 0 with angle $\alpha$ is $z\mapsto\bar ze^{2i\alpha}$. With $\alpha=\dfrac\pi4$: $\bar z\cdot i=(1-3i)i=i+3$. So $3+i$. (Swapping coordinates does the same thing.)</p>`,
    'Conjugate first, then rotate by 2α.'),
  N('cn-068', 3, 'triangle inequality', R`If $|z-3-4i|=2$, find the greatest value of $|z|$.`, 7, 0.001,
    R`<p>$z$ is on a circle of radius 2 about $3+4i$, whose distance from the origin is 5. The greatest $|z|$ is $5+2=7$ and the least is $5-2=3$.</p>`,
    'Greatest: centre distance plus radius; least: centre distance minus radius.'),
  // ---------- L4 hard ----------
  N('cn-070', 4, 'triangle inequality', R`If $\left|z-\dfrac4z\right|=2$, find the greatest value of $|z|$ to three decimals.`, 3.236, 0.002,
    R`<p>$|z|-\dfrac4{|z|}\le\left|z-\dfrac4z\right|=2$. Let $r=|z|$: $r^2-2r-4\le0$, so $r\le1+\sqrt5\approx3.236$.</p><p>It is attained: $z=1+\sqrt5$ (real) gives $z-\dfrac4z=2$.</p>`,
    'The inequality |a − b| ≥ |a| − |b| is what turns the condition into a bound.'),
  N('cn-071', 5, 'triangle inequality', R`If $\left|z-\dfrac4z\right|=2$, find the least value of $|z|$ to three decimals.`, 1.236, 0.002,
    R`<p>$\dfrac4{|z|}-|z|\le\left|z-\dfrac4z\right|=2$. With $r=|z|$: $4-r^2\le2r$, so $r^2+2r-4\ge0$ and $r\ge-1+\sqrt5\approx1.236$. Equality for $z=\sqrt5-1$ (real): $z-\dfrac4z=(\sqrt5-1)-(\sqrt5+1)=-2$, modulus 2 ✓.</p>`,
    'Use the reverse form: |a − b| ≥ |b| − |a|.'),
  N('cn-072', 4, 'sums', R`Find $\left|\displaystyle\sum_{k=1}^{12}\left(\dfrac{1+i}{\sqrt2}\right)^k\right|$ to three decimals.`, 2.613, 0.002,
    R`<p>Let $\zeta=\dfrac{1+i}{\sqrt2}=e^{i\pi/4}$, an 8th root of unity. The first 8 terms add to 0, so the sum equals the last four: $\zeta^9+\cdots+\zeta^{12}=\zeta+\zeta^2+\zeta^3+\zeta^4=\dfrac{\zeta(1-\zeta^4)}{1-\zeta}=\dfrac{2\zeta}{1-\zeta}$. $|1-\zeta|=2\sin\dfrac\pi8$, so the modulus is $\dfrac{2}{2\sin(\pi/8)}=\dfrac1{\sin22.5^\circ}\approx2.613$.</p>`,
    'Cancel full cycles of 8 first.'),
  N('cn-073', 4, 'sums', R`Find $\left|1+2\omega+3\omega^2+4\omega^3+5\omega^4+6\omega^5\right|$ to three decimals, where $\omega$ is a non-real cube root of unity.`, 3.464, 0.002,
    R`<p>Since $\omega^3=1$, group the terms: $(1+4)+(2+5)\omega+(3+6)\omega^2=5+7\omega+9\omega^2$. Use $\omega^2=-1-\omega$: $5-9+(7-9)\omega=-4-2\omega$. For $|a+b\omega|^2=a^2-ab+b^2$ with $a=-4,b=-2$: $16-8+4=12$. So the modulus is $\sqrt{12}\approx3.464$. (Also $\dfrac6{|\omega-1|}=\dfrac6{\sqrt3}$.)</p>`,
    'Reduce ω³ = 1 before anything else.'),
  N('cn-074', 4, 'argument range', R`The complex number $z$ satisfies $|z-25i|\le15$. Find $\tan\theta_{\min}$, where $\theta_{\min}$ is the least possible argument of $z$ (to three decimals).`, 1.333, 0.002,
    R`<p>The disc has centre $25i$ and radius 15. The extreme arguments come from the tangent lines through the origin. The angle between the tangent and the line to the centre (the imaginary axis) is $\varphi$ with $\sin\varphi=\dfrac{15}{25}=\dfrac35$. So the least argument is $\dfrac\pi2-\varphi$, and $\tan\theta_{\min}=\cot\varphi=\dfrac{4/5}{3/5}=\dfrac43\approx1.333$.</p>`,
    'Tangent length is 20: draw the 15-20-25 right triangle.'),
  I('cn-075', 4, 'roots of unity', R`If $\omega=e^{2\pi i/12}$, find $\displaystyle\prod_{k=1}^{11}(1-\omega^k)$.`, 12,
    R`<p>$z^{12}-1=\prod_{k=0}^{11}(z-\omega^k)$, so $\dfrac{z^{12}-1}{z-1}=1+z+\cdots+z^{11}=\prod_{k=1}^{11}(z-\omega^k)$. Put $z=1$: the product is $12$.</p>`,
    'Evaluate the sum 1 + z + … + z^11 at z = 1.'),
  I('cn-076', 4, 'roots of unity', R`If $\omega=e^{2\pi i/n}$, then $\displaystyle\sum_{k=0}^{n-1}|1-\omega^k|^2=2n$. Using this, find the value of the sum for $n=15$.`, 30,
    R`<p>$|1-\omega^k|^2=2-\omega^k-\omega^{-k}$. Summing over $k$ from $0$ to $n-1$: $2n-0-0=2n$ (each of $\sum\omega^k$ and $\sum\omega^{-k}$ is 0). For $n=15$: $30$.</p>`,
    'The sums of ω^k and ω^(−k) both vanish.'),
  I('cn-077', 4, 'geometry', R`Let $|z_1|=|z_2|=|z_3|=1$ and $z_1+z_2+z_3=0$. Find $|z_1-z_2|^2+|z_2-z_3|^2+|z_3-z_1|^2$.`, 9,
    R`<p>Three unit vectors adding to zero are $120^\circ$ apart. Each side has length $\sqrt3$ ($|z_1-z_2|^2=2-2\cos120^\circ=3$). Total $=3\times3=9$.</p><p>Algebra: $\sum|z_i-z_j|^2=3\cdot2-2\operatorname{Re}\sum z_i\bar z_j$ and $\left|\sum z_i\right|^2=0=3+2\operatorname{Re}\sum z_i\bar z_j$ gives the same.</p>`,
    'The three points form an equilateral triangle inscribed in the unit circle.'),
  I('cn-078', 4, 'equations', R`How many complex numbers $z$ satisfy $z^5=\bar z$?`, 7,
    R`<p>$|z|^5=|z|$ so $|z|=0$ or $1$. For $|z|=1$: $\bar z=1/z$ so $z^6=1$: six solutions. With $z=0$: $7$.</p>`,
    'For |z| = 1 use z̄ = 1/z.'),
  N('cn-079', 5, 'loci', R`The point $z$ moves on $|z|=1$. Find the greatest value of $|1+z|+|1-z|$ (three decimals).`, 2.828, 0.002,
    R`<p>$|1+z|^2+|1-z|^2=2(1+|z|^2)=4$. By Cauchy-Schwarz (or QM-AM), $|1+z|+|1-z|\le\sqrt{2\cdot4}=2\sqrt2\approx2.828$, attained when $|1+z|=|1-z|$, i.e. $z=\pm i$.</p>`,
    'The sum of the two moduli is not 4: only the sum of their squares is.'),
  M('cn-080', 4, 'loci', R`The locus of $z$ with $\arg\dfrac{z-1}{z+1}=\dfrac\pi4$ is an arc of a circle of radius`, R`$\sqrt2$`, [R`$1$`, R`$2$`, R`$\dfrac1{\sqrt2}$`],
    R`<p>The segment from $-1$ to $1$ (length 2) subtends the angle $\dfrac\pi4$ at $z$. By the sine rule in the circle through $-1,1,z$: $2=2R\sin\dfrac\pi4$, so $R=\sqrt2$. (The centre is $i$.)</p>`,
    'The inscribed angle equals half the central angle.'),
  M('cn-081', 4, 'mixed', R`The value of $\cos\dfrac{2\pi}7+\cos\dfrac{4\pi}7+\cos\dfrac{6\pi}7$ is`, R`$-\dfrac12$`, [R`$\dfrac12$`, R`$-1$`, R`$0$`],
    R`<p>Let $\alpha=e^{2\pi i/7}$. $1+\alpha+\cdots+\alpha^6=0$. Taking real parts, $1+2\left(\cos\dfrac{2\pi}7+\cos\dfrac{4\pi}7+\cos\dfrac{6\pi}7\right)=0$ (since $\cos\dfrac{2k\pi}7=\cos\dfrac{2(7-k)\pi}7$). So the sum is $-\dfrac12$.</p>`,
    'The six non-trivial roots pair up as conjugates, giving the factor 2.', { sub: 'mixed' }),
  M('cn-083', 4, 'rotation', R`$A,B,C$ are the points $0$, $1$, $z$, and triangle $ABC$ is equilateral. The possible values of $z$ are`, R`$\dfrac12\pm\dfrac{\sqrt3}2i$`, [R`$\dfrac12\pm\dfrac12i$`, R`$1\pm i\sqrt3$`, R`$\pm\dfrac{\sqrt3}2+\dfrac i2$`],
    R`<p>$z$ is $B$ rotated about $A$ by $\pm60^\circ$: $z=e^{\pm i\pi/3}=\dfrac12\pm\dfrac{\sqrt3}2i$. (Check $|z|=1$ and $|z-1|=1$.)</p>`,
    'There are two such triangles, one on each side of the segment.'),
  X('cn-084', 4, 'conjugate and modulus', R`$|z|=1$ and $z\ne\pm1$. Which of the following are real?`,
    [R`$z+\bar z$`, R`$z-\bar z$`, R`$\dfrac{z-1}{z+1}$`, R`$z^2+\dfrac1{z^2}$`], [0, 3],
    R`<p>$z=e^{i\theta}$. $z+\bar z=2\cos\theta$ real. $z-\bar z=2i\sin\theta$ (non-zero imaginary). $\dfrac{z-1}{z+1}=i\tan\dfrac\theta2$ (imaginary). $z^2+\dfrac1{z^2}=2\cos2\theta$ real.</p>`,
    'On the unit circle 1/z = z̄, so any sum of z^n and 1/z^n is real.'),

  // ---------- L5 top rank ----------
  I('cn-085', 5, 'roots of unity', R`Let $\omega$ be a primitive 7th root of unity and $\alpha=\omega+\omega^2+\omega^4$. Then $\alpha^2+\alpha+2=0$. Using this, find $|\alpha|^2$ (an integer).`, 2,
    R`<p>$\alpha=\dfrac{-1\pm i\sqrt7}2$, because the roots of $x^2+x+2=0$ are $\dfrac{-1\pm\sqrt{1-8}}2$. Then $|\alpha|^2=\dfrac{1+7}4=2$.</p><p>Independent check: $|\alpha|^2=\alpha\bar\alpha=\alpha\beta$ where $\beta=\bar\alpha=\omega^6+\omega^5+\omega^3$. The product of the roots of $x^2+x+2$ is 2 ✓.</p>`,
    'ᾱ is the other root, so |α|² is the product of the roots.'),
  X('cn-086', 5, 'geometry', R`$|z_1|=|z_2|=|z_3|=1$ and $z_1+z_2+z_3=0$. Which of the following are true?`,
    ['the points form an equilateral triangle', R`$z_1^2+z_2^2+z_3^2=0$`, R`$z_1z_2+z_2z_3+z_3z_1=0$`, R`$z_1z_2z_3=1$`], [0, 1, 2],
    R`<p>Three unit vectors with zero sum are $120^\circ$ apart: equilateral. Squaring the sum: $\sum z_i^2+2\sum z_iz_j=0$. Also $z_1z_2+z_2z_3+z_3z_1=z_1z_2z_3\left(\dfrac1{z_1}+\dfrac1{z_2}+\dfrac1{z_3}\right)=z_1z_2z_3\,\overline{(z_1+z_2+z_3)}=0$. So the third and then second hold. $z_1z_2z_3$ is any unit number: e.g. $1,\omega,\omega^2$ give $1$, but rotating all three by $e^{i\alpha}$ gives $e^{3i\alpha}\ne1$.</p>`,
    'Rotating the whole triangle keeps all the given conditions but changes z₁z₂z₃.'),
  X('cn-087', 5, 'triangle inequality', R`$z$ satisfies $|z-3-4i|=2$. Which of the following are true?`,
    [R`the greatest value of $|z|$ is $7$`, R`the least value of $|z|$ is $3$`, R`$|z|$ takes every value in $[3,7]$`, R`$|z|=5$ for exactly one $z$`], [0, 1, 2],
    R`<p>The circle has centre at distance 5 from the origin and radius 2: $|z|$ ranges over $[3,7]$ continuously. For any value strictly between 3 and 7 there are two points (symmetric about the line through the origin and the centre). So $|z|=5$ occurs at two points, not one.</p>`,
    'Only the extreme values 3 and 7 occur once.'),
  X('cn-088', 4, 'loci', R`Which of the following represent a circle?`,
    [R`$|z-2i|=3$`, R`$|z-1|+|z+1|=2$`, R`$|z-1|=2|z+1|$`, R`$|z-1|=|z+1|$`], [0, 2],
    R`<p>A: circle (centre $2i$, radius 3). B: the sum of distances equals the distance between the foci, so $z$ lies on the segment from $-1$ to $1$, not a circle. C: Apollonius circle (ratio $\ne1$). D: perpendicular bisector, a line.</p>`,
    'The ellipse equation degenerates to a segment when the sum equals the distance between the foci.'),
  N('cn-089', 4, 'locus', R`Find the least value of $|z-1|^2+|z-i|^2+|z+1|^2$ over all complex $z$, to three decimals.`, 2.667, 0.002,
    R`<p>For fixed points $a_1,a_2,a_3$ with centroid $g$: $\sum|z-a_k|^2=3|z-g|^2+\sum|a_k-g|^2$. The least value is the second part, at $z=g$.</p><p>$g=\dfrac{1+i-1}3=\dfrac i3$. $\sum|a_k|^2=1+1+1=3$ and $\sum|a_k-g|^2=\sum|a_k|^2-3|g|^2=3-\dfrac13=\dfrac83\approx2.667$.</p>`,
    'The minimum is at the centroid of the three points.'),

  I('cn-117', 5, 'roots of unity', R`Let $\omega$ be a primitive 7th root of unity, $\alpha=\omega+\omega^2+\omega^4$ and $\beta=\omega^3+\omega^5+\omega^6$. Find $(\alpha-\beta)^2$.`, -7,
    R`<p>$\alpha+\beta=-1$ (all six non-trivial roots) and $\alpha\beta=2$ (the nine products are $\omega^4,\omega^6,1,\omega^5,1,\omega,1,\omega^2,\omega^3$, which add to $3+(\omega+\cdots+\omega^6)=3-1=2$). So $(\alpha-\beta)^2=(\alpha+\beta)^2-4\alpha\beta=1-8=-7$.</p><p>So $\alpha-\beta=i\sqrt7$, a purely imaginary number.</p>`,
    'The result is negative, so α − β is not real, which fits α and β being conjugates.'),
  N('cn-118', 5, 'triangle inequality', R`For $|z|=1$, find the greatest value of $|z^3-3z-2|$ to three decimals.`, 5.196, 0.002,
    R`<p>$z^3-3z-2=(z+1)^2(z-2)$. With $z=e^{it}$ and $c=\cos t$: $|z+1|^2=2+2c$ and $|z-2|=\sqrt{5-4c}$. So the modulus is $f=(2+2c)\sqrt{5-4c}$ with $-1\le c\le1$.</p><p>$f^2=(2+2c)^2(5-4c)$. Its derivative is $(2+2c)(12-24c)$, zero at $c=\tfrac12$, where $f^2=9\cdot3=27$. The ends give 0 (at $c=-1$) and $16\cdot1=16$ (at $c=1$). So the greatest value is $\sqrt{27}=3\sqrt3\approx5.196$.</p>`,
    'Factorise the cubic first: (z + 1)²(z − 2).'),
  I('cn-119', 5, 'mixed', R`Find $\dfrac1{2^{48}}\left[\dbinom{100}{0}-\dbinom{100}{2}+\dbinom{100}{4}-\cdots+\dbinom{100}{100}\right]$.`, -4,
    R`<p>The bracket is the real part of $(1+i)^{100}$ (the even-index terms, with $i^{2k}=(-1)^k$). $(1+i)^2=2i$, so $(1+i)^{100}=(2i)^{50}=2^{50}i^{50}=-2^{50}$. The real part is $-2^{50}$. Dividing by $2^{48}$ gives $-4$.</p>`,
    'i^50 = i^2 = −1 because 50 = 4 × 12 + 2.', { sub: 'mixed' }),
  I('cn-120', 5, 'mixed', R`Find $\displaystyle\sum_{k=0}^{12}\dbinom{12}{k}\cos\dfrac{k\pi}3$.`, 729,
    R`<p>The sum is $\operatorname{Re}\sum\dbinom{12}k e^{ik\pi/3}=\operatorname{Re}\left(1+e^{i\pi/3}\right)^{12}$. $1+e^{i\pi/3}=2\cos\dfrac\pi6\,e^{i\pi/6}=\sqrt3\,e^{i\pi/6}$. Raise to 12: $(\sqrt3)^{12}e^{2\pi i}=729$.</p>`,
    'Factor out the half angle: 1 + e^(iθ) = 2cos(θ/2)e^(iθ/2).', { sub: 'mixed' }),
  I('cn-121', 4, 'equations', R`Find the number of complex numbers $z$ with $z^{12}=\bar z^{\,4}$.`, 17,
    R`<p>Moduli: $|z|^{12}=|z|^4$, so $|z|=0$ or $1$. For $|z|=1$, $\bar z=1/z$, so $z^{12}=z^{-4}$, i.e. $z^{16}=1$: 16 solutions. With $z=0$: $17$.</p>`,
    'Do not forget z = 0, and the 16 roots of z^16 = 1 all have modulus 1.'),
  I('cn-122', 4, 'geometry', R`The roots $z_1,z_2$ of $z^2+3z+b=0$ and the origin are the vertices of an equilateral triangle. Find $b$.`, 3,
    R`<p>For an equilateral triangle with vertices $0,z_1,z_2$: $z_1^2+z_2^2=z_1z_2$. Using $z_1+z_2=-3$ and $z_1z_2=b$: $(z_1+z_2)^2-2z_1z_2=z_1z_2$, so $9=3b$ and $b=3$.</p><p>Check: roots $\dfrac{-3\pm i\sqrt3}2$, each of modulus $\sqrt3$, and $|z_1-z_2|=\sqrt3$ ✓.</p>`,
    'The condition for 0, z₁, z₂ is a² = 3b.'),
  I('cn-123', 4, 'powers', R`How many integers $n$ with $1\le n\le100$ make $(\sqrt3+i)^n$ purely imaginary?`, 17,
    R`<p>$(\sqrt3+i)^n=2^ne^{in\pi/6}$. It is purely imaginary when $\dfrac{n\pi}6=\dfrac\pi2+k\pi$, i.e. $n=3+6k$. In $[1,100]$: $3,9,\dots,99$, which is $\dfrac{99-3}6+1=17$ values.</p>`,
    'Both +i and −i directions count, so n ≡ 3 (mod 6), not n ≡ 3 (mod 12).'),
  N('cn-124', 3, 'roots of unity', R`The three cube roots of $-27$ are plotted in the Argand plane. Find the area of the triangle they form, to two decimals.`, 11.69, 0.02,
    R`<p>The roots are $3e^{i\pi/3},3e^{i\pi},3e^{-i\pi/3}$, an equilateral triangle inscribed in a circle of radius 3. Area $=\dfrac{3\sqrt3}4R^2=\dfrac{3\sqrt3}4\cdot9=\dfrac{27\sqrt3}4\approx11.69$.</p>`,
    'The roots lie on a circle of radius 3 (the cube root of 27), not 27.'),
  X('cn-125', 3, 'algebra', R`Which of the following are purely imaginary (non-zero real part is 0, imaginary part non-zero)?`,
    [R`$(1+i)^2$`, R`$(1+i)^4$`, R`$(3+4i)-(3-4i)$`, R`$i^{101}$`], [0, 2, 3],
    R`<p>$(1+i)^2=2i$ ✓. $(1+i)^4=-4$ is real. $(3+4i)-(3-4i)=8i$ ✓. $101=4\cdot25+1$ so $i^{101}=i$ ✓.</p>`,
    'Powers of (1 + i) alternate between imaginary and real.'),
  X('cn-126', 4, 'roots', R`Which of the following are roots of $z^4=-4$?`,
    ['$1+i$', '$-1+i$', '$2i$', R`$\sqrt2\,i$`], [0, 1],
    R`<p>$(1+i)^2=2i$, $(2i)^2=-4$, so $(1+i)^4=-4$ ✓. $(-1+i)^2=-2i$ and $(-2i)^2=-4$ ✓. $(2i)^4=16$ and $(\sqrt2i)^4=4$, neither is $-4$.</p>`,
    'Four roots: ±1 ± i.'),

  // ---------- assertion-reason ----------
  A('cn-090', 2, 'conjugate and modulus', R`For every complex number $z$, $z\bar z$ is a non-negative real number.`, R`$z\bar z=|z|^2$.`, 0,
    R`<p>$z\bar z=x^2+y^2=|z|^2\ge0$. R is exactly why A holds.</p>`,
    'It is zero only for z = 0.'),
  A('cn-091', 3, 'argument', R`For every non-zero $z$, the principal argument satisfies $\arg\bar z=-\arg z$.`, R`$\bar z$ is the reflection of $z$ in the real axis.`, 3,
    R`<p>R is true. But for a negative real $z$, e.g. $z=-1$: $\bar z=-1$ with $\arg=\pi$, not $-\pi$ (the principal argument is in $(-\pi,\pi]$). So A fails there. A is false.</p>`,
    'Negative real numbers are the one exception.'),
  A('cn-092', 3, 'roots of unity', R`The sum of the three cube roots of $-1$ is $0$.`, R`The sum of the roots of $z^n=a$ ($n\ge2$) is $0$.`, 0,
    R`<p>The cube roots of $-1$ are roots of $z^3+1=0$, which has no $z^2$ term, so their sum is 0. R states the general fact (no $z^{n-1}$ term), so R explains A.</p>`,
    'Compare with the cube roots of unity: same idea.'),
  A('cn-093', 4, 'loci', R`The equation $|z-1|+|z+1|=2$ represents an ellipse.`, R`The locus of points whose distances from two fixed points have a constant sum greater than the distance between the points is an ellipse.`, 3,
    R`<p>R is a correct statement of the ellipse definition. In A the constant sum 2 equals the distance between the foci, so the locus is just the segment joining $-1$ and $1$. A is false.</p>`,
    'The condition "greater than the distance between the foci" in R is the point.'),
  A('cn-094', 3, 'conjugate and modulus', R`If $|z_1+z_2|=|z_1-z_2|$ and $z_2\ne0$, then $\dfrac{z_1}{z_2}$ is purely imaginary (or zero).`, R`$|z_1+z_2|^2-|z_1-z_2|^2=4\operatorname{Re}(z_1\bar z_2)$.`, 0,
    R`<p>The equal moduli make the left side of R zero, so $\operatorname{Re}(z_1\bar z_2)=0$, and the real part of $z_1/z_2=\dfrac{z_1\bar z_2}{|z_2|^2}$ is 0. R explains A.</p>`,
    '"Or zero" because z₁ could be 0.'),
  A('cn-095', 4, 'triangle inequality', R`The equation $|z-i|+|z+i|=1$ has no solution.`, R`$|z-i|+|z+i|\ge|(z-i)-(z+i)|=2$ for all $z$.`, 0,
    R`<p>The triangle inequality gives $|a|+|b|\ge|a-b|$. With $a=z-i$, $b=z+i$ the right side is $|-2i|=2$. So the sum is at least 2 and can never equal 1.</p>`,
    'The fixed points are 2 apart; any sum of distances is at least 2.'),
  A('cn-096', 4, 'argument', R`For all non-zero $z_1,z_2$, $\arg(z_1z_2)=\arg z_1+\arg z_2$ (principal arguments).`, R`$\arg(z_1z_2)=\arg z_1+\arg z_2+2k\pi$ for some integer $k$.`, 3,
    R`<p>R is true. A is false because the sum of two principal arguments can go outside $(-\pi,\pi]$. Example: $z_1=z_2=-1-i$, each with $\arg=-\dfrac{3\pi}4$, sum $-\dfrac{3\pi}2$; but $z_1z_2=2i$ has $\arg=\dfrac\pi2$ ($k=1$).</p>`,
    'Principal arguments are reduced to (−π, π] after adding.'),
  A('cn-097', 3, 'square roots', R`$\sqrt{-4}\sqrt{-9}=-6$.`, R`$\sqrt a\sqrt b=\sqrt{ab}$ holds for all real $a,b$.`, 2,
    R`<p>$2i\cdot3i=-6$ so A is true. R is false: the rule fails when both $a,b$ are negative ($\sqrt{36}=6\ne-6$).</p>`,
    'The rule works only if at least one of the numbers is non-negative.'),

  // ---------- statements ----------
  S('cn-098', 2, 'roots of unity', R`The sum of the $n$th roots of unity is $0$ for every integer $n\ge2$.`, R`The product of the $n$th roots of unity is $(-1)^{n-1}$.`, 0,
    R`<p>The roots of $z^n-1=0$ have sum $0$ (no $z^{n-1}$ term) and product $(-1)^n\cdot(-1)=(-1)^{n-1}$. Check with $n=4$: product $-1$ ✓; $n=3$: product $1$ ✓.</p>`,
    'The product depends on whether n is even or odd.'),
  S('cn-099', 3, 'triangle inequality', R`$|z_1+z_2|\le|z_1|+|z_2|$ for all complex $z_1,z_2$.`, R`$|z_1-z_2|\ge|z_1|-|z_2|$ for all complex $z_1,z_2$.`, 0,
    R`<p>Both are forms of the triangle inequality. For II: $|z_1|=|(z_1-z_2)+z_2|\le|z_1-z_2|+|z_2|$.</p>`,
    'Equality in I holds when z₁ and z₂ have the same argument.'),
  S('cn-100', 3, 'equations', R`If $z^2$ is real, then $z$ is real.`, R`If $z$ is real, then $z^2$ is real.`, 2,
    R`<p>I is false: $z=i$ has $z^2=-1$, real, but $z$ is not real. II is true.</p>`,
    'A statement and its converse are different claims.'),
  S('cn-101', 3, 'order', R`The inequality $3+i<4+2i$ has no meaning in the complex numbers.`, R`Complex numbers can be ordered by modulus: $z_1<z_2$ means $|z_1|<|z_2|$.`, 1,
    R`<p>I is true: there is no ordering of $\mathbb C$ compatible with addition and multiplication. II is false: the "order by modulus" is not an order, since distinct numbers like $1$ and $i$ would be neither equal nor ordered.</p>`,
    'Only the real numbers and the moduli (which are real) can be compared.'),
  S('cn-102', 4, 'roots of unity', R`The $n$th roots of a non-zero complex number $a$ lie on a circle of radius $|a|^{1/n}$.`, R`The $n$th roots of $a$ are the vertices of a regular $n$-gon.`, 0,
    R`<p>Each root has modulus $|a|^{1/n}$ and arguments $\dfrac{\arg a+2k\pi}n$, equally spaced by $\dfrac{2\pi}n$: the vertices of a regular $n$-gon on that circle.</p>`,
    'The first root is not special: all n have the same status.'),
  S('cn-103', 4, 'conjugate and modulus', R`If $|z|=1$ and $z\ne\pm1$, then $\dfrac{z-1}{z+1}$ is purely imaginary.`, R`If $|z|=1$ then $\bar z=\dfrac1z$.`, 0,
    R`<p>With $\bar z=\dfrac1z$: $\overline{\left(\dfrac{z-1}{z+1}\right)}=\dfrac{\bar z-1}{\bar z+1}=\dfrac{1/z-1}{1/z+1}=\dfrac{1-z}{1+z}=-\dfrac{z-1}{z+1}$. A number equal to minus its conjugate is purely imaginary. Both true.</p>`,
    'w̄ = −w means the real part is zero.'),
  S('cn-104', 2, 'conjugate and modulus', R`$z+\bar z$ is real for every complex $z$.`, R`$z-\bar z$ is purely imaginary or zero for every complex $z$.`, 0,
    R`<p>$z+\bar z=2x$ (real) and $z-\bar z=2iy$ (purely imaginary, zero when $y=0$). Both true.</p>`,
    'The "or zero" matters: real z gives z − z̄ = 0.'),
  S('cn-105', 3, 'equations', R`The equation $\bar z=z^2$ has exactly 4 solutions.`, R`The solutions of $\bar z=z^2$ are $0$ and the three cube roots of unity.`, 0,
    R`<p>$|z|^2=|z|$ gives $|z|=0,1$. For $|z|=1$, $\bar z=1/z$, so $z^3=1$. Solutions: $0,1,\omega,\omega^2$: four. Both statements say the same thing and both are true.</p>`,
    'The modulus equation alone does not tell you the arguments.'),
  base('cn-106', 3, 'mixed', { type: 'mcq', format: 'statements',
    q: R`<p>How many of the following are correct?</p><p>(i) $|i^{2024}|=1$<br>(ii) $(1+i)^{10}$ is purely imaginary<br>(iii) the sum of the cube roots of unity is $0$<br>(iv) the principal argument of $-5$ is $-\pi$</p>`,
    ...place('3', ['1', '2', '4']),
    sol: R`<p>(i) $|i|=1$ so the power has modulus 1: true. (ii) $(1+i)^{10}=(2i)^5=32i$: true. (iii) true. (iv) the principal argument lies in $(-\pi,\pi]$, so $\arg(-5)=\pi$: false. Three are correct.</p>`,
    trap: 'The principal argument interval includes π and excludes −π.' }),

  // ---------- match ----------
  MT('cn-107', 2, 'powers of i', 'm1', 'Match List I with List II.', 'A-r, B-q, C-p, D-s', ['A-p, B-q, C-r, D-s', 'A-r, B-p, C-q, D-s', 'A-r, B-q, C-s, D-p'],
    R`<p>A: $i^{23}=i^3=-i$ (r). B: $i^{-10}=\dfrac1{i^{10}}=\dfrac1{-1}=-1$ (q). C: $\dfrac{2i}2=i$ (p). D: $(1-i)^2=-2i$, $(-2i)^2=-4$ (s).</p>`,
    'i^-10: 10 leaves remainder 2, and the reciprocal of −1 is −1.'),
  MT('cn-108', 3, 'loci', 'm2', 'Match List I with List II.', 'A-r, B-p, C-q, D-s', ['A-p, B-r, C-q, D-s', 'A-r, B-p, C-s, D-q', 'A-q, B-p, C-r, D-s'],
    R`<p>A: perpendicular bisector of $\pm1$, a line (r). B: sum of distances $4>2$: an ellipse (p). C: circle centre $i$, radius 2 (q). D: $x^2+y^2=(x+1)^2$ gives $y^2=2x+1$: a parabola (s).</p>`,
    'Square both sides in D, and watch the x² terms cancel.'),
  MT('cn-109', 3, 'cube roots of unity', 'm3', 'Match List I with List II.', 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    R`<p>A: 0 (p). B: $\omega^3=1$ (q). C: $50=3\cdot16+2$, so $\omega^{50}=\omega^2$ (r). D: $(1+\omega)^2=(-\omega^2)^2=\omega^4=\omega$ (s).</p>`,
    'Reduce exponents mod 3.'),
  MT('cn-110', 3, 'argument', 'm4', 'Match List I with List II.', 'A-r, B-s, C-q, D-p', ['A-s, B-r, C-q, D-p', 'A-r, B-s, C-p, D-q', 'A-r, B-q, C-s, D-p'],
    R`<p>A: second quadrant, $\pi-\dfrac\pi6=\dfrac{5\pi}6$ (r). B: third quadrant, $-\pi+\dfrac\pi4=-\dfrac{3\pi}4$ (s). C: fourth quadrant, $-\dfrac\pi4$ (q). D: negative real axis: $\pi$ (p).</p>`,
    'Third-quadrant principal arguments are negative.'),

  // ---------- passages ----------
  P('cn-111', 3, 'geometry', 'p1', R`The centre of the circle through $A$, $B$ and $C$ is`, R`$\dfrac52+3i$`, [R`$4+i$`, R`$\dfrac72+3i$`, R`$\dfrac52+i$`],
    R`<p>$AB=3$ (horizontal), $BC=4$ (vertical): a right angle at $B$. The hypotenuse $AC$ is a diameter, so the centre is the midpoint $\dfrac{(1+i)+(4+5i)}2=\dfrac52+3i$.</p>`,
    'The circumcentre of a right triangle is the midpoint of the hypotenuse.'),
  PI('cn-112', 3, 'geometry', 'p1', R`Find the area of triangle $ABC$.`, 6,
    R`<p>Legs 3 and 4 at the right angle $B$: area $=\tfrac12\cdot3\cdot4=6$.</p>`,
    'Area is half the product of the legs, not the hypotenuse-based formula.'),
  P('cn-113', 3, 'rotation', 'p1', R`The point $C$ is rotated about $A$ through $90^\circ$ anticlockwise. The new point is`, '$-3+4i$', ['$3+4i$', '$-3-4i$', '$5-4i$'],
    R`<p>$C-A=3+4i$. Multiply by $i$: $(3+4i)i=3i+4i^2=-4+3i$. Add $A=1+i$: $-3+4i$.</p>`,
    'Subtract A, multiply by i, add A back.'),
  PI('cn-114', 3, 'roots of unity', 'p2', R`Find $|z|^2$ for $a=2$, $b=3$.`, 7,
    R`<p>$|z|^2=a^2-ab+b^2=4-6+9=7$.</p>`,
    'The middle term is −ab, not +ab.'),
  PI('cn-115', 4, 'roots of unity', 'p2', R`How many integer pairs $(a,b)$ satisfy $|a+b\omega|=1$?`, 6,
    R`<p>Solve $a^2-ab+b^2=1$. Multiply by 4: $(2a-b)^2+3b^2=4$. So $b^2\le\tfrac43$, $b\in\{-1,0,1\}$. $b=0$: $a=\pm1$. $b=1$: $(2a-1)^2=1$, $a=0,1$. $b=-1$: $(2a+1)^2=1$, $a=0,-1$. Total: $(\pm1,0),(0,1),(1,1),(0,-1),(-1,-1)$: six pairs (the six unit numbers $\pm1,\pm\omega,\pm\omega^2$ in disguise).</p>`,
    'Complete the square in a to bound b.'),
  PI('cn-116', 5, 'roots of unity', 'p2', R`How many integer pairs $(a,b)$ satisfy $|a+b\omega|^2=7$?`, 12,
    R`<p>$(2a-b)^2+3b^2=28$. $b^2\le9$, so $|b|\le3$. $b=0$: $4a^2=28$ no. $b=\pm1$: $(2a\mp1)^2=25$, $2a\mp1=\pm5$: two values of $a$ for each $b$: 4 pairs. $b=\pm2$: $(2a\mp2)^2=16$, $2a\mp2=\pm4$: 4 pairs. $b=\pm3$: $(2a\mp3)^2=1$: 4 pairs. Total 12.</p>`,
    'Check every b from −3 to 3 separately.'),
];

// ---------- number templates ----------
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
const C = (a, b = 0) => ({ a, b });
const cadd = (x, y) => C(x.a + y.a, x.b + y.b);
const cmul = (x, y) => C(x.a * y.a - x.b * y.b, x.a * y.b + x.b * y.a);
const cconj = (x) => C(x.a, -x.b);
const cabs = (x) => Math.hypot(x.a, x.b);
const cdiv = (x, y) => { const d = y.a * y.a + y.b * y.b; const n = cmul(x, cconj(y)); return C(n.a / d, n.b / d); };
const cexp = (t) => C(Math.cos(t), Math.sin(t));
const cpow = (x, n) => { let r = C(1); for (let i = 0; i < n; i++) r = cmul(r, x); return r; };
const cs = (a, b) => { // text for a+bi
  const re = a === 0 ? '' : `${a}`;
  if (b === 0) return a === 0 ? '0' : re;
  const im = (Math.abs(b) === 1 ? '' : `${Math.abs(b)}`) + 'i';
  return `${re}${b < 0 ? '-' : (a === 0 ? '' : '+')}${im}`.replace(/^\+/, '');
};
const csFull = (a, b) => (b === 0 ? `${a}` : cs(a, b));

const gens = [
  {
    id: 'cn-g01', type: 'nat', format: 'integer', level: 1, exams: EXS[1], sub: 'algebra',
    make(rng) {
      const a = int(rng, 1, 9), b = int(rng, 1, 9); const answer = a * a - b * b;
      return { a, b, answer, tol: 0,
        q: R`Find the real part of $(${a}+${b}i)^2$.`,
        sol: R`<p>$(${a}+${b}i)^2=${a * a}+${2 * a * b}i+${b * b}i^2=${a * a - b * b}+${2 * a * b}i$. The real part is $${answer}$.</p>` };
    },
    verify(p) { return cmul(C(p.a, p.b), C(p.a, p.b)).a; },
  },
  {
    id: 'cn-g02', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'modulus',
    make(rng) {
      const t1 = choose(rng, TRI), t2 = choose(rng, TRI); const s1 = choose(rng, [1, -1]), s2 = choose(rng, [1, -1]);
      const z1 = C(t1[0], s1 * t1[1]), z2 = C(-t2[1], s2 * t2[0]);
      const answer = t1[2] * t2[2];
      return { z1, z2, answer, tol: 0,
        q: R`Find $\left|(${csFull(z1.a, z1.b)})(${csFull(z2.a, z2.b)})\right|$.`,
        sol: R`<p>$|z_1z_2|=|z_1||z_2|$. $|${csFull(z1.a, z1.b)}|=\sqrt{${t1[0] ** 2}+${t1[1] ** 2}}=${t1[2]}$ and $|${csFull(z2.a, z2.b)}|=\sqrt{${t2[1] ** 2}+${t2[0] ** 2}}=${t2[2]}$.</p><p>Product $=${t1[2]}\times${t2[2]}=${answer}$.</p>` };
    },
    verify(p) { return Math.round(cabs(cmul(p.z1, p.z2))); },
  },
  {
    id: 'cn-g03', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'division',
    make(rng) {
      const x = int(rng, -5, 6), y = int(rng, 1, 6), c = int(rng, 1, 4), d = choose(rng, [-3, -2, -1, 1, 2, 3]);
      const num = cmul(C(x, y), C(c, d));
      const answer = x + y;
      return { x, y, c, d, num, answer, tol: 0,
        q: R`$\dfrac{${csFull(num.a, num.b)}}{${csFull(c, d)}}=x+iy$ with $x,y$ real. Find $x+y$.`,
        sol: R`<p>Multiply top and bottom by the conjugate $${csFull(c, -d)}$. Denominator: $${c * c + d * d}$. Numerator: $(${csFull(num.a, num.b)})(${csFull(c, -d)})=${csFull(num.a * c + num.b * d, num.b * c - num.a * d)}$.</p><p>So $x+iy=${csFull(x, y)}$ and $x+y=${answer}$.</p>` };
    },
    verify(p) { const q = cdiv(p.num, C(p.c, p.d)); return Math.round(q.a + q.b); },
  },
  {
    id: 'cn-g04', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'powers',
    make(rng) {
      const m = int(rng, 2, 9); const part = choose(rng, ['real', 'imaginary']); const sgn = [1, 0, -1, 0]; // i^m real part
      const ir = [1, 0, -1, 0][m % 4], ii = [0, 1, 0, -1][m % 4];
      const answer = 2 ** m * (part === 'real' ? ir : ii);
      return { m, part, answer, tol: 0,
        q: R`Find the ${part} part of $(1+i)^{${2 * m}}$.`,
        sol: R`<p>$(1+i)^2=2i$, so $(1+i)^{${2 * m}}=(2i)^{${m}}=2^{${m}}i^{${m}}=${2 ** m}i^{${m}}$.</p><p>$i^{${m}}=i^{${m % 4}}=${csFull(ir, ii) === '0' ? '0' : csFull(ir, ii)}$, so the number is $${csFull(2 ** m * ir, 2 ** m * ii)}$ and its ${part} part is $${answer}$.</p>` };
    },
    verify(p) { const v = cpow(C(1, 1), 2 * p.m); return Math.round(p.part === 'real' ? v.a : v.b); },
  },
  {
    id: 'cn-g05', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'powers of i',
    make(rng) {
      const n = int(rng, 5, 150);
      const sums = [C(0, 0), C(0, 1), C(-1, 1), C(-1, 0)]; const s = sums[n % 4];
      const answer = s.a + s.b;
      return { n, answer, tol: 0,
        q: R`Let $S=i+i^2+i^3+\cdots+i^{${n}}=a+bi$. Find $a+b$.`,
        sol: R`<p>Every block of four consecutive powers adds to 0. $${n}=4\times${Math.floor(n / 4)}+${n % 4}$, so only the last ${n % 4 === 0 ? 'zero' : n % 4} term${n % 4 === 1 ? '' : 's'} remain${n % 4 === 0 ? ': $S=0$' : ''}.</p><p>$S=${csFull(s.a, s.b)}$, so $a+b=${answer}$.</p>` };
    },
    verify(p) { let S = C(0); for (let k = 1; k <= p.n; k++) S = cadd(S, cpow(C(0, 1), k)); return Math.round(S.a + S.b); },
  },
  {
    id: 'cn-g06', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'cube roots of unity',
    make(rng) {
      const a = int(rng, 1, 9), b = int(rng, 1, 9), c = int(rng, 1, 9);
      const answer = a * a + b * b + c * c - a * b - b * c - c * a;
      return { a, b, c, answer, tol: 0,
        q: R`$\omega$ is a non-real cube root of unity. Find $(${a}+${b}\omega+${c}\omega^2)(${a}+${b}\omega^2+${c}\omega)$.`,
        sol: R`<p>The product is $a^2+b^2+c^2-ab-bc-ca$ (because $\omega^3=1$ and $1+\omega+\omega^2=0$).</p><p>$=${a * a}+${b * b}+${c * c}-${a * b}-${b * c}-${c * a}=${answer}$.</p>` };
    },
    verify(p) { const w = cexp(2 * Math.PI / 3), w2 = cmul(w, w); const f = (x, y) => cadd(cadd(C(p.a), cmul(C(p.b), x)), cmul(C(p.c), y)); return Math.round(cmul(f(w, w2), f(w2, w)).a); },
  },
  {
    id: 'cn-g07', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'triangle inequality',
    make(rng) {
      const [a, b, c] = choose(rng, TRI); const k = choose(rng, [1, 2]); const r = int(rng, 1, 3 * c * k); const which = choose(rng, ['greatest', 'least']);
      const d = c * k; const answer = which === 'greatest' ? d + r : Math.abs(d - r);
      return { a: a * k, b: b * k, r, which, d, answer, tol: 0,
        q: R`$|z-(${a * k}+${b * k}i)|=${r}$. Find the ${which} value of $|z|$.`,
        sol: R`<p>$z$ lies on a circle of radius $${r}$ with centre $${a * k}+${b * k}i$, which is $\sqrt{${(a * k) ** 2}+${(b * k) ** 2}}=${d}$ from the origin.</p><p>${which === 'greatest' ? `Greatest $|z|=${d}+${r}=${answer}$.` : `Least $|z|=|${d}-${r}|=${answer}$ (if the origin is inside the circle, the least distance is $r-d$).`}</p>` };
    },
    verify(p) { let best = which0(p.which); for (let t = 0; t < 6.2832; t += 0.0004) { const v = cabs(cadd(C(p.a, p.b), C(p.r * Math.cos(t), p.r * Math.sin(t)))); best = p.which === 'greatest' ? Math.max(best, v) : Math.min(best, v); } return Math.round(best); },
  },
  {
    id: 'cn-g08', type: 'nat', format: 'numeric', level: 2, exams: EXS[2], sub: 'area',
    make(rng) {
      const pts = []; for (let i = 0; i < 3; i++) pts.push(C(int(rng, -4, 6), int(rng, -4, 6)));
      const cr = (pts[1].a - pts[0].a) * (pts[2].b - pts[0].b) - (pts[1].b - pts[0].b) * (pts[2].a - pts[0].a);
      if (cr === 0) pts[2] = C(pts[2].a + 1, pts[2].b + 2);
      const cr2 = (pts[1].a - pts[0].a) * (pts[2].b - pts[0].b) - (pts[1].b - pts[0].b) * (pts[2].a - pts[0].a);
      const answer = Math.abs(cr2) / 2;
      return { pts, cr2, answer, tol: 0.01,
        q: R`Find the area of the triangle whose vertices are $${csFull(pts[0].a, pts[0].b)}$, $${csFull(pts[1].a, pts[1].b)}$ and $${csFull(pts[2].a, pts[2].b)}$ in the Argand plane.`,
        sol: R`<p>The points are $(${pts[0].a},${pts[0].b})$, $(${pts[1].a},${pts[1].b})$, $(${pts[2].a},${pts[2].b})$. Area $=\tfrac12|(x_2-x_1)(y_3-y_1)-(y_2-y_1)(x_3-x_1)|=\tfrac12|${pts[1].a - pts[0].a}\cdot${pts[2].b - pts[0].b}-${pts[1].b - pts[0].b}\cdot${pts[2].a - pts[0].a}|=\tfrac12\cdot${Math.abs(cr2)}=${answer}$.</p>` };
    },
    verify(p) { const u = C(p.pts[1].a - p.pts[0].a, p.pts[1].b - p.pts[0].b), v = C(p.pts[2].a - p.pts[0].a, p.pts[2].b - p.pts[0].b); return Math.abs(cmul(cconj(u), v).b) / 2; },
  },
  {
    id: 'cn-g09', type: 'mcq', format: 'single', level: 3, exams: EXS[3], sub: 'rotation',
    make(rng) {
      const c = C(int(rng, -3, 3), int(rng, -3, 3)); const z = C(int(rng, -4, 5), int(rng, -4, 5)); const k = choose(rng, [1, 2, 3]);
      const ang = ['', '$90^\\circ$ anticlockwise', '$180^\\circ$', '$90^\\circ$ clockwise'][k];
      const mult = [C(1), C(0, 1), C(-1), C(0, -1)][k];
      const d = C(z.a - c.a, z.b - c.b);
      if (d.a === 0 && d.b === 0) z.a += 1;
      const dd = C(z.a - c.a, z.b - c.b);
      const rot = cadd(cmul(dd, mult), c);
      const ok = `$${csFull(rot.a, rot.b)}$`;
      const w1 = cadd(cmul(dd, [C(1), C(0, -1), C(-1), C(0, 1)][k]), c); // wrong direction
      const w2 = cmul(z, mult); // about origin
      const w3 = cadd(cmul(C(dd.a, -dd.b), mult), c);
      const { options, answer } = shuffleOpts(rng, ok, [w1, w2, w3].map((w) => `$${csFull(w.a, w.b)}$`));
      return { c, z: C(z.a, z.b), k, rot, options, answer,
        q: R`The point $${csFull(z.a, z.b)}$ is rotated through ${ang} about the point $${csFull(c.a, c.b)}$. The new point is`,
        sol: R`<p>New $=c+(z-c)\times(\text{rotation factor})$. $z-c=${csFull(dd.a, dd.b)}$. The factor for this turn is $${['', 'i', '-1', '-i'][k]}$, giving $${csFull(cmul(dd, mult).a, cmul(dd, mult).b)}$. Add $c$: $${csFull(rot.a, rot.b)}$.</p>` };
    },
    verify(p) { const ang = [0, Math.PI / 2, Math.PI, -Math.PI / 2][p.k]; const v = cadd(cmul(C(p.z.a - p.c.a, p.z.b - p.c.b), cexp(ang)), p.c); return Math.abs(v.a - p.rot.a) < 1e-9 && Math.abs(v.b - p.rot.b) < 1e-9 ? p.answer : -1; },
  },
  {
    id: 'cn-g10', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'argument',
    make(rng) {
      const m = int(rng, 1, 6); const choice = choose(rng, [
        [m, m, 45, `${m}+${m}i`], [-m, m, 135, `-${m}+${m}i`], [-m, -m, -135, `-${m}-${m}i`], [m, -m, -45, `${m}-${m}i`],
        [0, m, 90, `${m}i`], [0, -m, -90, `-${m}i`], [-m, 0, 180, `-${m}`],
        [m * Math.sqrt(3), m, 30, `${m}\\sqrt3+${m}i`], [-m * Math.sqrt(3), m, 150, `-${m}\\sqrt3+${m}i`], [-m * Math.sqrt(3), -m, -150, `-${m}\\sqrt3-${m}i`], [m, -m * Math.sqrt(3), -60, `${m}-${m}\\sqrt3\\,i`]]);
      const [a, b, deg, txt] = choice;
      return { a, b, answer: deg, tol: 0,
        q: R`Find the principal argument of $${txt}$ in degrees (between $-180^\circ$ and $180^\circ$, $180^\circ$ included).`,
        sol: R`<p>Locate the point $(${+a.toFixed(3)},${+b.toFixed(3)})$: quadrant ${a > 0 && b > 0 ? 'I' : a < 0 && b > 0 ? 'II' : a < 0 && b < 0 ? 'III' : a > 0 && b < 0 ? 'IV' : 'on an axis'}. The reference angle from $\tan^{-1}\left|\dfrac ba\right|$ and the quadrant give $${deg}^\circ$.</p>` };
    },
    verify(p) { return Math.round(Math.atan2(p.b, p.a) * 180 / Math.PI); },
  },
  {
    id: 'cn-g11', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'roots of unity',
    make(rng) {
      const n = int(rng, 5, 12); const r = int(rng, 1, 30); const answer = r % n === 0 ? n : 0;
      return { n, r, answer, tol: 0,
        q: R`Let $\omega=e^{2\pi i/${n}}$. Find $\displaystyle\sum_{k=0}^{${n - 1}}\omega^{${r}k}$.`,
        sol: R`<p>The terms are $(\omega^{${r}})^k$, a geometric series with ratio $q=\omega^{${r}}$. ${r % n === 0 ? `Here $${n}$ divides $${r}$, so $q=1$ and every term is 1: the sum is $${n}$.` : `Here $${n}\nmid${r}$, so $q\ne1$ and $q^{${n}}=1$. The sum is $\dfrac{1-q^{${n}}}{1-q}=0$.`}</p><p>Answer: $${answer}$.</p>` };
    },
    verify(p) { let S = C(0); for (let k = 0; k < p.n; k++) S = cadd(S, cexp(2 * Math.PI * p.r * k / p.n)); return Math.round(S.a); },
  },
  {
    id: 'cn-g12', type: 'nat', format: 'numeric', level: 4, exams: EXS[4], sub: 'triangle inequality',
    make(rng) {
      const a = choose(rng, [2, 3, 4, 5, 6]), k = choose(rng, [1, 2, 3]);
      const answer = +((k + Math.sqrt(k * k + 4 * a)) / 2).toFixed(4);
      return { a, k, answer, tol: 0.005,
        q: R`If $\left|z-\dfrac{${a}}z\right|=${k}$, find the greatest value of $|z|$ to three decimals.`,
        sol: R`<p>$|z|-\dfrac{${a}}{|z|}\le\left|z-\dfrac{${a}}z\right|=${k}$. With $r=|z|$: $r^2-${k}r-${a}\le0$, so $r\le\dfrac{${k}+\sqrt{${k * k + 4 * a}}}2\approx${answer}$.</p><p>It is attained for real $z=r$.</p>` };
    },
    verify(p) { let r = 5; for (let i = 0; i < 100; i++) r = r - (r * r - p.k * r - p.a) / (2 * r - p.k); return Math.abs(Math.abs(r - p.a / r) - p.k) < 1e-9 ? r : -1; },
  },
  {
    id: 'cn-g13', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'roots of unity',
    make(rng) {
      const n = int(rng, 3, 16);
      return { n, answer: 2 * n, tol: 0,
        q: R`If $\omega=e^{2\pi i/${n}}$, find $\displaystyle\sum_{k=0}^{${n - 1}}\left|1-\omega^k\right|^2$.`,
        sol: R`<p>$|1-\omega^k|^2=(1-\omega^k)(1-\omega^{-k})=2-\omega^k-\omega^{-k}$.</p><p>Sum over $k=0..${n - 1}$: $2\cdot${n}-\sum\omega^k-\sum\omega^{-k}=${2 * n}-0-0=${2 * n}$, since the ${n} roots of unity add to 0.</p>` };
    },
    verify(p) { let S = 0; for (let k = 0; k < p.n; k++) { const w = cexp(2 * Math.PI * k / p.n); S += cabs(C(1 - w.a, -w.b)) ** 2; } return Math.round(S); },
  },
  {
    id: 'cn-g14', type: 'mcq', format: 'single', level: 3, exams: EXS[3], sub: 'loci',
    make(rng) {
      const z1 = C(int(rng, -4, 4), int(rng, -4, 4)); let z2 = C(int(rng, -4, 4), int(rng, -4, 4));
      if (z1.a === z2.a && z1.b === z2.b) z2 = C(z2.a + 2, z2.b - 1);
      const A = 2 * (z2.a - z1.a), B = 2 * (z2.b - z1.b), Cc = (z2.a ** 2 + z2.b ** 2) - (z1.a ** 2 + z1.b ** 2);
      const eq = (a, b, c) => `$${a === 0 ? '' : (a === 1 ? '' : a === -1 ? '-' : a) + 'x'}${b === 0 ? '' : (b > 0 && a !== 0 ? '+' : '') + (b === 1 ? '' : b === -1 ? '-' : b) + 'y'}=${c}$`;
      const ok = eq(A, B, Cc);
      const wr = [eq(A, B, -Cc), eq(B, A, Cc), eq(A, -B, Cc)];
      const { options, answer } = shuffleOpts(rng, ok, wr);
      return { z1, z2, A, B, Cc, options, answer,
        q: R`The locus of $z=x+iy$ with $|z-(${csFull(z1.a, z1.b)})|=|z-(${csFull(z2.a, z2.b)})|$ is the line`,
        sol: R`<p>Square both sides: $(x-${z1.a})^2+(y-${z1.b})^2=(x-${z2.a})^2+(y-${z2.b})^2$. The $x^2$ and $y^2$ terms cancel, leaving $${A}x+${B}y=${Cc}$ (the perpendicular bisector of the two points).</p>` };
    },
    verify(p) { // pick a point on the line and check it is equidistant; and a point off it is not
      let x, y; if (p.B !== 0) { x = 1.5; y = (p.Cc - p.A * x) / p.B; } else { y = 1.5; x = p.Cc / p.A; }
      const d1 = Math.hypot(x - p.z1.a, y - p.z1.b), d2 = Math.hypot(x - p.z2.a, y - p.z2.b);
      return Math.abs(d1 - d2) < 1e-9 ? p.answer : -1;
    },
  },
  {
    id: 'cn-g15', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'equations',
    make(rng) {
      const n = int(rng, 2, 12);
      return { n, answer: n + 2, tol: 0,
        q: R`Find the number of complex numbers $z$ satisfying $z^{${n}}=\bar z$.`,
        sol: R`<p>Taking moduli: $|z|^{${n}}=|z|$, so $|z|=0$ or $|z|=1$.</p><p>If $|z|=1$ then $\bar z=\dfrac1z$ and $z^{${n + 1}}=1$: ${n + 1} solutions. Adding $z=0$ gives $${n + 2}$.</p>` };
    },
    verify(p) { let cnt = 1; for (let k = 0; k <= p.n; k++) { const z = cexp(2 * Math.PI * k / (p.n + 1)); if (cabs(C(cpow(z, p.n).a - z.a, cpow(z, p.n).b + z.b)) < 1e-9) cnt++; } return cnt; },
  },
];
function which0(w) { return w === 'greatest' ? -1e9 : 1e9; }

export default { topic: 'complex-numbers', groups, items, gens };
