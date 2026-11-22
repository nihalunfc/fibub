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

// ==XP-BEGIN (expansion block: new items, groups and templates; ids continue after the originals)
{
const XR = String.raw;
const XEXS = { 1: ['keam', 'cusat', 'comedk', 'jee-main'], 2: ['keam', 'cusat', 'comedk', 'jee-main'], 3: ['jee-main', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const XCUET = false;
const xex = (l, t) => [...XEXS[l], ...(XCUET && t === 'mcq' && l <= 3 ? ['cuet'] : [])];
let _k = 0, _p = 0; const XPS = [2, 0, 3, 1, 3, 1, 0, 2, 1, 3, 2, 0];
const xid = () => `cn-x${String(++_k).padStart(3, '0')}`;
const xpl = (c, w) => { const p = XPS[_p++ % XPS.length]; const o = [...w]; o.splice(p, 0, c); return { options: o, answer: p }; };
const mk = (level, sub, extra) => ({ id: xid(), level, exams: xex(level, extra.type), sub, ...extra });
const M = (l, s, q, c, w, sol, trap) => mk(l, s, { type: 'mcq', format: 'single', q, ...xpl(c, w), sol, trap });
const I = (l, s, q, a, sol, trap, calc) => mk(l, s, { type: 'nat', format: 'integer', q, answer: a, tol: 0, sol, trap, ...(calc ? { calc } : {}) });
const N = (l, s, q, a, tol, sol, trap, calc) => mk(l, s, { type: 'nat', format: 'numeric', q, answer: a, tol, sol, trap, ...(calc ? { calc } : {}) });
const X = (l, s, q, options, answer, sol, trap) => mk(l, s, { type: 'msq', format: 'multi', q, options, answer, sol, trap });
const XAO = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const XSO = ['Both Statement I and Statement II are true', 'Statement I is true and Statement II is false', 'Statement I is false and Statement II is true', 'Both Statement I and Statement II are false'];
const A = (l, s, a, r, answer, sol, trap) => mk(l, s, { type: 'mcq', format: 'assertion', q: `<p><b>Assertion (A):</b> ${a}</p><p><b>Reason (R):</b> ${r}</p>`, options: XAO, answer, sol, trap });
const S = (l, s, s1, s2, answer, sol, trap) => mk(l, s, { type: 'mcq', format: 'statements', q: `<p><b>Statement I:</b> ${s1}</p><p><b>Statement II:</b> ${s2}</p>`, options: XSO, answer, sol, trap });
const SC = (l, s, lines, c, w, sol, trap) => mk(l, s, { type: 'mcq', format: 'statements', q: `<ol>${lines.map((x) => `<li>${x}</li>`).join('')}</ol><p>How many of these statements are correct?</p>`, ...xpl(c, w), sol, trap });
const MT = (l, s, group, c, w, sol, trap) => mk(l, s, { type: 'mcq', format: 'match', group, q: 'Match List I with List II.', ...xpl(c, w), sol, trap });
const PM = (l, s, group, q, c, w, sol, trap) => mk(l, s, { type: 'mcq', format: 'passage', group, q, ...xpl(c, w), sol, trap });
const PI = (l, s, group, q, a, sol, trap, calc) => mk(l, s, { type: 'nat', format: 'passage', group, q, answer: a, tol: 0, sol, trap, ...(calc ? { calc } : {}) });
const PN = (l, s, group, q, a, tol, sol, trap, calc) => mk(l, s, { type: 'nat', format: 'passage', group, q, answer: a, tol, sol, trap, ...(calc ? { calc } : {}) });
const GX = (id, level, type, format, sub, make, verify) => ({ id, type, format, level, exams: xex(level, type), sub, make, ...(verify ? { verify } : {}) });
const frac = (n, d) => { const g = ((a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; })(n, d); n /= g; d /= g; const sgn = n < 0 ? '-' : ''; n = Math.abs(n); return d === 1 ? `${sgn}${n}` : `${sgn}\\dfrac{${n}}{${d}}`; };
const OPT = (c, w) => ({ c, w });
const CC = (a, b = 0) => ({ a, b });
const cm = (x, y) => CC(x.a * y.a - x.b * y.b, x.a * y.b + x.b * y.a);
const cp = (x, n) => { let r = CC(1); for (let i = 0; i < n; i++) r = cm(r, x); return r; };
const ce = (t) => CC(Math.cos(t), Math.sin(t));
Object.assign(groups, {
  xm1: { title: 'Numbers of solutions', passage: XR`<p>Match each equation in List I with the number of complex numbers $z$ that satisfy it, from List II.</p>`,
    list1: ['A. $z^5=1$', 'B. $z^4=\\bar z$', 'C. $z^2=-1$', 'D. $z^6=1$ and $\\mathrm{Re}(z)>0$'], list2: ['p. 2', 'q. 3', 'r. 5', 's. 6'] },
  xm2: { title: 'Cube roots of unity', passage: XR`<p>$\omega$ is a non-real cube root of unity. Match each expression in List I with its value in List II.</p>`,
    list1: ['A. $(1-\\omega)(1-\\omega^2)$', 'B. $\\omega^{100}+\\omega^{200}$', 'C. $\\omega^{100}\\cdot\\omega^{200}$', 'D. $(3+\\omega)(3+\\omega^2)$'], list2: ['p. $3$', 'q. $-1$', 'r. $0$', 's. $1$', 't. $7$'] },
  xm3: { title: 'Loci', passage: XR`<p>$z=x+iy$. Match each condition in List I with the curve it describes in List II.</p>`,
    list1: ['A. $\\mathrm{Re}(z^2)=0$', 'B. $|z-i|=|z-1|$', 'C. $|z-1|+|z+1|=4$', 'D. $\\big||z-1|-|z+1|\\big|=1$'], list2: ['p. an ellipse', 'q. a hyperbola', 'r. a pair of straight lines', 's. a circle', 't. a single straight line'] },
  xm4: { title: 'Principal arguments of powers', passage: XR`<p>Match each number in List I with its principal argument (in $(-\pi,\pi]$) in List II.</p>`,
    list1: ['A. $(1+i)^5$', 'B. $(\\sqrt3-i)^3$', 'C. $(-1+i)^4$', 'D. $i^{-3}$'], list2: ['p. $\\pi$', 'q. $-\\dfrac\\pi2$', 'r. $-\\dfrac{3\\pi}4$', 's. $\\dfrac\\pi2$', 't. $\\dfrac{3\\pi}4$'] },
  xm5: { title: 'Roots of unity: sums and products', passage: XR`<p>Match each quantity in List I with its value in List II.</p>`,
    list1: ['A. $\\sum_{k=0}^{11}\\cos\\dfrac{2\\pi k}{12}$', 'B. $\\sum_{k=0}^{11}\\cos^2\\dfrac{2\\pi k}{12}$', 'C. $\\prod_{k=1}^{11}\\left(1-e^{2\\pi ik/12}\\right)$', 'D. $\\sum_{k=1}^{5}\\dfrac{1}{1-e^{2\\pi ik/6}}$'], list2: ['p. $0$', 'q. $6$', 'r. $\\dfrac52$', 's. $12$'] },
  xm6: { title: 'Transformations of the point 2 + i', passage: XR`<p>Match each transformation of the point $z=2+i$ in List I with the image in List II.</p>`,
    list1: ['A. rotation by $90^\\circ$ anticlockwise about the origin', 'B. reflection in the real axis', 'C. reflection in the imaginary axis', 'D. rotation by $90^\\circ$ anticlockwise about the point $1$'], list2: ['p. $i$', 'q. $-1+2i$', 'r. $2-i$', 's. $-2+i$'] },
  xm7: { title: 'Moduli', passage: XR`<p>Match each modulus in List I with its value in List II.</p>`,
    list1: ['A. $|(1+i)^4|$', 'B. $\\left|\\dfrac{3+4i}{12+5i}\\right|$', 'C. $|(1+i\\sqrt3)^3|$', 'D. $|i^{101}|$'], list2: ['p. $1$', 'q. $4$', 'r. $8$', 's. $\\dfrac5{13}$'] },
  xm8: { title: 'A quadratic with complex roots', passage: XR`<p>The roots of $z^2-4z+13=0$ are $\alpha$ and $\beta$, with $\alpha=2+3i$. Match each quantity in List I with its value in List II.</p>`,
    list1: ['A. $\\alpha+\\beta$', 'B. $\\alpha\\beta$', 'C. $|\\alpha-\\beta|$', 'D. $\\mathrm{Re}(\\alpha^2)$'], list2: ['p. $13$', 'q. $-5$', 'r. $4$', 's. $6$'] },
  xp1: { title: 'Passage: seventh roots of unity', passage: XR`<p>Let $\alpha=e^{2\pi i/7}$, $A=\alpha+\alpha^2+\alpha^4$ and $B=\alpha^3+\alpha^5+\alpha^6$. Remember $1+\alpha+\alpha^2+\dots+\alpha^6=0$ and $\alpha^7=1$.</p>` },
  xp2: { title: 'Passage: a square in the Argand plane', passage: XR`<p>$ABCD$ is a square, with its vertices taken anticlockwise. $A$ represents $2+i$ and the opposite vertex $C$ represents $4+7i$.</p>` },
});
items.push(
  // ---- L2 ----
  M(2, 'division', XR`The imaginary part of $\dfrac{3+i}{1-2i}$ is`, XR`$\dfrac75$`, [XR`$\dfrac15$`, '$7$', XR`$-\dfrac75$`],
    XR`<p>Multiply top and bottom by the conjugate $1+2i$. Numerator: $(3+i)(1+2i)=3+6i+i+2i^2=1+7i$. Denominator: $1+4=5$. So the number is $\dfrac{1+7i}5$ and the imaginary part is $\dfrac75$.</p>`,
    'Imaginary part means the coefficient of i, here 7/5 (not 7).'),
  M(2, 'argument', XR`The principal argument of $(1+i)^6$ is`, XR`$-\dfrac\pi2$`, [XR`$\dfrac\pi2$`, XR`$\dfrac{3\pi}2$`, XR`$\dfrac{3\pi}4$`],
    XR`<p>$(1+i)^2=2i$, so $(1+i)^6=(2i)^3=8i^3=-8i$. This lies on the negative imaginary axis, so its principal argument is $-\dfrac\pi2$. (Adding the angles gives $6\cdot\dfrac\pi4=\dfrac{3\pi}2$, which is not in $(-\pi,\pi]$; subtract $2\pi$.)</p>`,
    'The principal argument must lie in (−π, π].'),
  A(2, 'conjugate', XR`For every complex number $z$, $z+\bar z$ is a real number.`, XR`If $z=x+iy$ then $z+\bar z=2x$.`, 0,
    XR`<p>$z+\bar z=(x+iy)+(x-iy)=2x$, which is real. So A is true and R is exactly the reason.</p>`, 'The imaginary parts cancel because the conjugate flips only the sign of y.'),
  I(2, 'modulus', XR`If $(x+iy)^2=-5+12i$ for real $x,y$, find $x^2+y^2$.`, 13,
    XR`<p>Take moduli: $|z|^2=|z^2|=|-5+12i|=\sqrt{25+144}=13$. So $x^2+y^2=|z|^2=13$. (Solving gives $z=\pm(2+3i)$, and $4+9=13$.)</p>`,
    'x² + y² is the modulus squared, which equals |z²|.', () => Math.hypot(-5, 12)),
  S(2, 'powers of i', XR`$i^{4n+2}=-1$ for every integer $n$.`, XR`The powers $i^k$ repeat in a cycle of length $4$.`, 0,
    XR`<p>$i^{4n+2}=(i^4)^n\cdot i^2=1\cdot(-1)=-1$, so Statement I is true. $i,-1,-i,1$ repeat, so Statement II is true.</p>`, 'This also works for negative n.'),
  M(2, 'roots', XR`The sum of all the cube roots of $-1$ is`, '$0$', ['$-1$', '$1$', '$-3$'],
    XR`<p>The cube roots of $-1$ are the roots of $z^3+1=0$. There is no $z^2$ term, so their sum is $0$. (Directly: $-1+e^{i\pi/3}+e^{-i\pi/3}=-1+2\cos60^\circ=0$.)</p>`,
    'One root is −1, but the other two are not real: do not stop at −1.'),
  // ---- L3 ----
  M(3, 'argument', XR`The principal argument of $-\sin40^\circ+i\cos40^\circ$ is`, XR`$\dfrac{13\pi}{18}$`, [XR`$\dfrac{2\pi}9$`, XR`$\dfrac{5\pi}{18}$`, XR`$-\dfrac{5\pi}{18}$`],
    XR`<p>Write $-\sin40^\circ+i\cos40^\circ=i(\cos40^\circ+i\sin40^\circ)=e^{i90^\circ}e^{i40^\circ}=e^{i130^\circ}$. It has modulus 1 and argument $130^\circ=\dfrac{13\pi}{18}$, already in $(-\pi,\pi]$.</p><p>Check: real part negative, imaginary part positive, so the point is in the second quadrant. $130^\circ$ is.</p>`,
    'Do not read $\tan\theta=-\cot40^\circ$ and take $-50^\circ$; use the quadrant.'),
  I(3, 'roots of unity', XR`Let $\omega\ne1$ be a fifth root of unity. Find $(2-\omega)(2-\omega^2)(2-\omega^3)(2-\omega^4)$.`, 31,
    XR`<p>The fifth roots of unity are the roots of $z^5-1=(z-1)(z-\omega)(z-\omega^2)(z-\omega^3)(z-\omega^4)$. So $(z-\omega)\cdots(z-\omega^4)=\dfrac{z^5-1}{z-1}$. Put $z=2$: $\dfrac{32-1}{1}=31$.</p>`,
    'Use the factorised form of z⁵ − 1; do not multiply out.', () => { let r = CC(1); for (let k = 1; k <= 4; k++) r = cm(r, CC(2 - Math.cos(2 * Math.PI * k / 5), -Math.sin(2 * Math.PI * k / 5))); return r.a; }),
  N(3, 'geometry', XR`The three cube roots of $8$ are the vertices of a triangle. Find its area (2 decimal places).`, 5.2, 0.01,
    XR`<p>The cube roots of 8 are $2,\,2\omega,\,2\omega^2$, all on the circle of radius $r=2$ at $120^\circ$ apart: an equilateral triangle inscribed in that circle.</p><p>Side $=r\sqrt3=2\sqrt3$. Area $=\dfrac{\sqrt3}4(2\sqrt3)^2=\dfrac{\sqrt3}4\cdot12=3\sqrt3\approx5.20$.</p>`,
    'The side is r√3, not r.', () => 3 * Math.sqrt(3)),
  I(3, 'loci', XR`The points $z$ with $|z-2|=2|z+1|$ lie on a circle with centre $c$ and radius $r$. Find $|c|+r$.`, 4,
    XR`<p>Square both sides with $z=x+iy$: $(x-2)^2+y^2=4\big[(x+1)^2+y^2\big]$, which gives $3x^2+3y^2+12x=0$, i.e. $x^2+y^2+4x=0$.</p><p>Complete the square: $(x+2)^2+y^2=4$. Centre $-2$, radius $2$. So $|c|+r=2+2=4$.</p>`,
    'Apollonius circle: the centre is not the midpoint.', () => 4),
  S(3, 'triangle inequality', XR`For non-zero $z_1,z_2$: $|z_1+z_2|=|z_1|+|z_2|$ exactly when $\arg z_1=\arg z_2$.`, XR`For non-zero $z_1,z_2$: $|z_1+z_2|=|z_1-z_2|$ exactly when $\arg z_1=\arg z_2$.`, 1,
    XR`<p>Statement I is true: equality in the triangle inequality means the two vectors point the same way.</p><p>Statement II is false. $|z_1+z_2|=|z_1-z_2|$ means the diagonals of the parallelogram are equal, so it is a rectangle: $z_1\perp z_2$, i.e. $z_1/z_2$ is purely imaginary. (If the arguments were equal, $|z_1-z_2|$ would be $\big||z_1|-|z_2|\big|$, smaller than $|z_1+z_2|$.)</p>`,
    'Equal diagonals mean perpendicular sides, not parallel ones.'),
  M(3, 'cube roots of unity', XR`If $\omega$ is a non-real cube root of unity, then $(1+\omega)^{10}$ equals`, XR`$\omega^2$`, ['$\\omega$', '$-\\omega^2$', '$1$'],
    XR`<p>$1+\omega+\omega^2=0$ gives $1+\omega=-\omega^2$. So $(1+\omega)^{10}=(-\omega^2)^{10}=\omega^{20}=\omega^{18}\omega^2=\omega^2$ (even power kills the minus sign).</p>`,
    'An even power removes the minus sign; reduce the power of ω modulo 3.'),
  I(3, 'powers', XR`How many integers $n$ with $1\le n\le100$ make $(\sqrt3+i)^n$ a real number?`, 16,
    XR`<p>$\sqrt3+i=2e^{i\pi/6}$, so $(\sqrt3+i)^n=2^ne^{in\pi/6}$. It is real when $\dfrac{n\pi}6$ is a multiple of $\pi$, i.e. $6\mid n$. Multiples of 6 up to 100: $6,12,\dots,96$, that is $16$.</p>`,
    '16 × 6 = 96 ≤ 100 but 17 × 6 = 102 is too big.', () => { let c = 0; for (let n = 1; n <= 100; n++) if (Math.abs(cp(CC(Math.sqrt(3), 1), n).b) < 1e-6 * Math.pow(2, n)) c++; return c; }),
  I(3, 'square roots', XR`If $\sqrt{8-6i}=a+ib$ with $a>0$ and $a,b$ real, find $a+b$.`, 2,
    XR`<p>$(a+ib)^2=8-6i$: $a^2-b^2=8$ and $2ab=-6$. Try integers: $a=3,b=-1$ gives $9-1=8$ and $2\cdot3\cdot(-1)=-6$. So $a+ib=3-i$ and $a+b=2$.</p><p>Check by modulus: $a^2+b^2=\sqrt{64+36}=10=9+1$.</p>`,
    'The sign of b follows from 2ab = −6 with a > 0.', () => 3 + -1),
  A(3, 'ordering', XR`There is no meaningful way to say $i>0$ and still keep the usual rules for inequalities.`, XR`If $i>0$ then $i^2>0$, but $i^2=-1<0$.`, 0,
    XR`<p>If $i>0$, multiplying two positive numbers gives a positive number, so $i\cdot i=-1>0$: a contradiction. The same happens if $i<0$ (then $-i>0$ and $(-i)^2=-1>0$). So no ordering respects the rules, and R is the explanation of A.</p>`,
    'Complex numbers can be compared only through their moduli or real parts.'),
  SC(3, 'conjugate and modulus', ['$\\arg(\\bar z)=-\\arg z$ for every $z$ that is not a negative real number.', '$|z|^2=z\\bar z$.', '$\\mathrm{Re}(z)\\le|z|$.', '$\\arg(z_1z_2)=\\arg z_1+\\arg z_2$ for all non-zero $z_1,z_2$ (principal arguments).'], '3', ['1', '2', '4'],
    XR`<p>(1) true. For a negative real, $\arg z=\pi$ but $\arg\bar z=\pi$ too, which is why it is excluded. (2) true. (3) true, since $|x|\le\sqrt{x^2+y^2}$. (4) false: the sum of two principal arguments may fall outside $(-\pi,\pi]$. For $z_1=z_2=-1+i$ the arguments add to $\tfrac{3\pi}4+\tfrac{3\pi}4=\tfrac{3\pi}2$, but $z_1z_2=-2i$ has principal argument $-\tfrac\pi2$.</p><p>Three are correct.</p>`,
    'The argument of a product is the sum only up to a multiple of 2π.'),
  MT(3, 'number of solutions', 'xm1', 'A-r, B-s, C-p, D-q', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-p, B-s, C-r, D-q'],
    XR`<p>A: five fifth roots of unity, so 5 (r). B: $|z|^4=|z|$ gives $|z|=0$ or $1$; for $|z|=1$, $\bar z=1/z$ so $z^5=1$: five solutions, plus $z=0$: 6 (s). C: $z=\pm i$: 2 (p). D: sixth roots of unity are at $0^\circ,60^\circ,\dots,300^\circ$; real part positive for $0^\circ,60^\circ,300^\circ$: 3 (q).</p>`,
    'Do not forget the solution z = 0 in B.'),
  MT(3, 'moduli', 'xm7', 'A-q, B-s, C-r, D-p', ['A-q, B-r, C-s, D-p', 'A-s, B-q, C-r, D-p', 'A-q, B-s, C-p, D-r'],
    XR`<p>$|z_1z_2|=|z_1||z_2|$ and $|z_1/z_2|=|z_1|/|z_2|$. A: $(\sqrt2)^4=4$. B: $\dfrac{5}{13}$. C: $2^3=8$. D: $|i|^{101}=1$.</p>`,
    'Take the modulus of each factor first.'),
  MT(3, 'quadratic with complex roots', 'xm8', 'A-r, B-p, C-s, D-q', ['A-p, B-r, C-s, D-q', 'A-r, B-p, C-q, D-s', 'A-s, B-p, C-r, D-q'],
    XR`<p>$\alpha=2+3i$, $\beta=2-3i$. A: sum $=4$. B: product $=13$. C: $|\alpha-\beta|=|6i|=6$. D: $\alpha^2=4-9+12i=-5+12i$, real part $-5$.</p>`,
    'Real part of α² is not (Re α)².'),
  M(3, 'loci', XR`If $\dfrac{z-1}{z+1}$ is purely imaginary, then $z$ lies on`, XR`the circle $|z|=1$ (excluding $z=\pm1$)`, ['the real axis', 'the line $x=1$', XR`the circle $|z-1|=1$`],
    XR`<p>$\dfrac{z-1}{z+1}=\dfrac{(z-1)(\bar z+1)}{|z+1|^2}$. Its real part is the real part of $(z-1)(\bar z+1)=|z|^2+z-\bar z-1$, i.e. $|z|^2-1$. Zero real part gives $|z|=1$. The points $z=\pm1$ give the quotient the value $0$ (at $z=1$) or no value at all (at $z=-1$), so they are excluded.</p>`,
    'Purely imaginary means real part zero (and the number non-zero).'),
  M(3, 'geometry', XR`If $|z_1|=|z_2|=1$ and $|z_1+z_2|=\sqrt3$, then $|z_1-z_2|$ equals`, '$1$', [XR`$\sqrt3$`, '$2$', XR`$\sqrt2$`],
    XR`<p>Parallelogram law: $|z_1+z_2|^2+|z_1-z_2|^2=2\big(|z_1|^2+|z_2|^2\big)=4$. So $|z_1-z_2|^2=4-3=1$ and $|z_1-z_2|=1$.</p>`,
    'The law uses squares of the moduli.'),
  // ---- L4 ----
  X(4, 'triangle inequality', XR`Let $z_1,z_2$ be non-zero complex numbers with $|z_1+z_2|=|z_1|+|z_2|$. Which of the following must be true?`,
    [XR`$\arg z_1=\arg z_2$`, XR`$z_1/z_2$ is a positive real number`, XR`$z_1\bar z_2$ is a positive real number`, XR`$|z_1-z_2|=|z_1|+|z_2|$`], [0, 1, 2],
    XR`<p>Equality in $|z_1+z_2|\le|z_1|+|z_2|$ holds exactly when $z_1,z_2$ point in the same direction: $z_1=\lambda z_2$ with $\lambda>0$. Then A and B hold, and $z_1\bar z_2=\lambda|z_2|^2>0$ so C holds.</p><p>D is false: with the same direction $|z_1-z_2|=\big||z_1|-|z_2|\big|$, which is less than the sum for non-zero numbers.</p>`,
    'Same direction gives the smallest |z1 − z2|, not the largest.'),
  X(5, 'roots of unity', XR`Let $\alpha=e^{2\pi i/7}$. Which of the following are true?`,
    [XR`$\mathrm{Re}(\alpha+\alpha^2+\alpha^3)=-\tfrac12$`, XR`$\displaystyle\sum_{k=1}^{6}\frac1{1-\alpha^k}=3$`, XR`$\displaystyle\prod_{k=1}^{6}(1-\alpha^k)=7$`, XR`$\alpha+\alpha^2+\alpha^4$ is a real number`], [0, 1, 2],
    XR`<p>A: $\alpha^{7-k}=\bar\alpha^k$, so $\alpha+\dots+\alpha^6=-1$ pairs up as $2\mathrm{Re}(\alpha+\alpha^2+\alpha^3)=-1$. True.</p><p>B: pair $k$ with $7-k$: $\dfrac1{1-\alpha^k}+\dfrac1{1-\bar\alpha^k}=1$ (since $\mathrm{Re}\,\dfrac1{1-e^{i\theta}}=\tfrac12$), three pairs give $3$. True.</p><p>C: $\dfrac{z^7-1}{z-1}=\prod(z-\alpha^k)$ at $z=1$ is $1+1+\dots+1=7$. True.</p><p>D: $\alpha+\alpha^2+\alpha^4=\dfrac{-1+i\sqrt7}2$, not real. False.</p>`,
    'The three-term sum of 7th roots is complex: it is a Gauss sum.'),
  X(4, 'loci', XR`Which of the following equations represent a circle in the Argand plane?`,
    [XR`$|z-1|=2|z-i|$`, XR`$|z-1|=|z-i|$`, XR`$z\bar z+(1+i)z+(1-i)\bar z=3$`, XR`$|z-1|+|z-i|=1$`], [0, 2],
    XR`<p>A: Apollonius locus with ratio $2\ne1$: a circle. B: ratio 1: the perpendicular bisector, a line. C: with $z=x+iy$, $(1+i)z+(1-i)\bar z=2\mathrm{Re}\big((1+i)z\big)=2(x-y)$, so $x^2+y^2+2x-2y=3$, i.e. $(x+1)^2+(y-1)^2=5$: a circle. D: the points $1$ and $i$ are $\sqrt2>1$ apart, but a sum of distances is at least $\sqrt2$: no points at all.</p>`,
    'A sum of distances smaller than the gap between the foci gives the empty set.'),
  X(4, 'roots', XR`The equation $z^3=8i$ has roots $z_1,z_2,z_3$. Which statements are true?`,
    [XR`$-2i$ is one of the roots`, XR`$z_1+z_2+z_3=8i$`, XR`$z_1z_2z_3=8i$`, XR`the roots are the vertices of an equilateral triangle`], [0, 2, 3],
    XR`<p>$(-2i)^3=-8i^3=8i$: true. The polynomial $z^3-8i$ has no $z^2$ term, so the sum of roots is $0$: B is false. The product of roots of $z^3+0z^2+0z-8i$ is $-(-8i)=8i$: C true. The three roots are $2e^{i\pi/6},2e^{i5\pi/6},2e^{i3\pi/2}$, spaced $120^\circ$ apart on a circle: D true.</p>`,
    'Sum of roots uses the z² coefficient, product uses the constant term with sign.'),
  X(4, 'De Moivre', XR`Let $z=\cos\theta+i\sin\theta$. Which of these hold?`,
    [XR`$z^n+z^{-n}=2\cos n\theta$`, XR`$z^n-z^{-n}=2\sin n\theta$`, XR`$\dfrac{1+z}{1+\bar z}=z$ (when $z\ne-1$)`, XR`$|1+z|=2\left|\cos\dfrac\theta2\right|$`], [0, 2, 3],
    XR`<p>A: $z^{-n}=\overline{z^n}$ so the sum is $2\mathrm{Re}(z^n)$. B false: the difference is $2i\sin n\theta$. C: $1+\bar z=1+\dfrac1z=\dfrac{z+1}z$, so the ratio is $z$. D: $1+z=2\cos\dfrac\theta2\,e^{i\theta/2}$ whose modulus is $2\left|\cos\dfrac\theta2\right|$.</p>`,
    'The i is missing in option B.'),
  X(4, 'conjugate and modulus', XR`$z$ is a non-real complex number and $z+\dfrac1z$ is real. Which statements must be true?`,
    [XR`$|z|=1$`, XR`$\bar z=\dfrac1z$`, XR`$\mathrm{Re}(z)=0$`, XR`$|\mathrm{Re}(z)|<1$`], [0, 1, 3],
    XR`<p>With $z=x+iy$, $y\ne0$: $\mathrm{Im}\left(z+\dfrac1z\right)=y-\dfrac{y}{x^2+y^2}=y\cdot\dfrac{x^2+y^2-1}{x^2+y^2}=0$, so $|z|=1$ (A). Then $z\bar z=1$ gives B. Since $y\ne0$ and $x^2+y^2=1$, $|x|<1$ (D). C is false (for instance $z=\dfrac{1+i\sqrt3}{2}$).</p>`,
    'z = ±i is allowed, but so are other unit complex numbers.'),
  X(5, 'geometry', XR`The complex number $z$ satisfies $|z-2i|\le1$. Which statements are always true?`,
    [XR`$|z|\le3$`, XR`$|z|\ge1$`, XR`$1\le\mathrm{Im}(z)\le3$`, XR`$|\mathrm{Re}(z)|<1$`], [0, 1, 2],
    XR`<p>$z$ lies in the closed disc of centre $2i$, radius 1. The farthest point from the origin is at distance $2+1=3$, the nearest at $2-1=1$: A, B true. The imaginary part ranges over $[1,3]$: C true. The real part ranges over $[-1,1]$ and the extreme $\mathrm{Re}(z)=\pm1$ is reached at $z=\pm1+2i$: D is false (it needs $<1$).</p>`,
    'The disc is closed, so the boundary points count.'),
  X(5, 'cube roots of unity', XR`$\omega$ is a non-real cube root of unity. Which of the following are true?`,
    [XR`$(1+\omega)^3=-1$`, XR`$(1+\omega^2)^3=-1$`, XR`$\dfrac1{1+\omega}=\omega$`, XR`$(1-\omega)^2=-3\omega$`], [0, 1, 3],
    XR`<p>$1+\omega=-\omega^2$ and $1+\omega^2=-\omega$. A: $(-\omega^2)^3=-1$. B: $(-\omega)^3=-1$. C: $\dfrac1{1+\omega}=\dfrac1{-\omega^2}=-\omega$, not $\omega$: false. D: $(1-\omega)^2=1-2\omega+\omega^2=(1+\omega+\omega^2)-3\omega=-3\omega$: true.</p>`,
    'Three of four are tempting; check C by direct division.'),
  X(5, 'roots of unity', XR`Let $\zeta=e^{2\pi i/5}$. Which of the following are true?`,
    [XR`$\zeta+\zeta^4=\dfrac{1+\sqrt5}2$`, XR`$\zeta^2+\zeta^3=\dfrac{-1-\sqrt5}2$`, XR`$(\zeta+\zeta^4)(\zeta^2+\zeta^3)=-1$`, XR`$\zeta+\zeta^4$ is a root of $x^2+x-1=0$`], [1, 2, 3],
    XR`<p>$\zeta+\zeta^4=2\cos72^\circ=\dfrac{\sqrt5-1}2$ (not $\dfrac{1+\sqrt5}2$): A false. $\zeta^2+\zeta^3=2\cos144^\circ=-\dfrac{1+\sqrt5}2$: B true. Sum $=-1$ and product: $\zeta^3+\zeta^4+\zeta^6+\zeta^7=\zeta^3+\zeta^4+\zeta+\zeta^2=-1$: C true. So the two numbers are roots of $x^2+x-1=0$: D true.</p>`,
    '2cos72° is about 0.618, the golden ratio minus one.'),
  X(4, 'geometry', XR`Which of these sets of three points in the Argand plane are vertices of an equilateral triangle?`,
    [XR`$0,\ 2,\ 1+i\sqrt3$`, XR`$1,\ \omega,\ \omega^2$ (cube roots of unity)`, XR`$0,\ 1,\ 1+i$`, XR`$0,\ 4,\ 2+2\sqrt3\,i$`], [0, 1, 3],
    XR`<p>A: sides $2$, $|1+i\sqrt3|=2$, $|{-1}+i\sqrt3|=2$: equilateral. B: the three cube roots of unity are $120^\circ$ apart on a circle. C: sides $1$, $1$, $\sqrt2$: a right isosceles triangle. D: sides $4$, $|2+2\sqrt3i|=4$, $|{-2}+2\sqrt3i|=4$: equilateral.</p>`,
    'Check all three sides, not two.'),
  I(5, 'powers', XR`If $z+\dfrac1z=1$, find the value of $z^{2024}+\dfrac1{z^{2024}}$.`, -1,
    XR`<p>$z+\dfrac1z=1$ gives $z^2-z+1=0$, so $z=e^{\pm i\pi/3}$ and $z^{n}+z^{-n}=2\cos\dfrac{n\pi}3$. This has period 6 in $n$. $2024=6\cdot337+2$, so it equals $2\cos\dfrac{2\pi}3=-1$.</p>`,
    'Reduce the exponent modulo 6, not 3 (the roots are primitive 6th roots of unity).', () => 2 * Math.cos(2024 * Math.PI / 3)),
  I(4, 'modulus', XR`For $|z|=1$, find the maximum value of $|z^2-z+1|$.`, 3,
    XR`<p>For $|z|=1$: $|z^2-z+1|=|z|\left|z-1+\dfrac1z\right|=|2\cos\theta-1|$ (with $z=e^{i\theta}$, $z+\dfrac1z=2\cos\theta$). Its largest value is at $\cos\theta=-1$: $|-2-1|=3$.</p>`,
    'The expression is real after dividing by z; do not use the triangle inequality for the minimum.', () => { let m = 0; for (let i = 0; i < 100000; i++) { const t = i / 100000 * 2 * Math.PI; const z = ce(t); const v = cm(z, z); m = Math.max(m, Math.hypot(v.a - z.a + 1, v.b - z.b)); } return Math.round(m); }),
  I(4, 'loci', XR`If $|z-(4+3i)|=2$, find $(\text{greatest value of }|z|)^2-(\text{least value of }|z|)^2$.`, 40,
    XR`<p>The centre is $4+3i$ with $|4+3i|=5$ and the radius is 2. The greatest $|z|$ is $5+2=7$ and the least is $5-2=3$. So $49-9=40$.</p>`,
    'Distance to the centre ± radius; then square.', () => 49 - 9),
  I(4, 'roots of unity', XR`Let $\omega_0,\omega_1,\dots,\omega_9$ be the tenth roots of unity. Find $\displaystyle\sum_{k=0}^{9}|1+\omega_k|^2$.`, 20,
    XR`<p>$|1+\omega_k|^2=(1+\omega_k)(1+\bar\omega_k)=2+\omega_k+\bar\omega_k=2+2\cos\dfrac{2\pi k}{10}$. The cosines of equally spaced angles over a full turn add to zero, so the sum is $10\cdot2+0=20$.</p>`,
    'The sum of all nth roots of unity is 0.', () => { let s = 0; for (let k = 0; k < 10; k++) s += 2 + 2 * Math.cos(2 * Math.PI * k / 10); return Math.round(s); }),
  I(4, 'equations', XR`Find the number of complex numbers $z$ with $z^2+|z|=0$.`, 3,
    XR`<p>$z^2=-|z|$ is a real number $\le0$. Taking moduli: $|z|^2=|z|$, so $|z|=0$ or $|z|=1$. If $|z|=0$ then $z=0$. If $|z|=1$ then $z^2=-1$ and $z=\pm i$. Total: $3$ solutions.</p>`,
    'Do not lose z = 0.', () => 3),
  I(4, 'sums', XR`Find $\displaystyle\sum_{k=0}^{17}\cos^2\dfrac{k\pi}9$.`, 9,
    XR`<p>$\cos^2x=\dfrac{1+\cos2x}2$. So the sum is $\dfrac{18}2+\dfrac12\sum_{k=0}^{17}\cos\dfrac{2k\pi}9$. The angles $\dfrac{2k\pi}9$, $k=0,\dots,17$, run twice round the circle (they are the real parts of the 9th roots of unity, taken twice), so their cosines sum to $0$. Total $9$.</p>`,
    'Count the terms: k runs from 0 to 17, which is 18 terms.', () => { let s = 0; for (let k = 0; k < 18; k++) s += Math.cos(k * Math.PI / 9) ** 2; return Math.round(s); }),
  I(5, 'powers', XR`Find the smallest positive integer $n$ for which $\left(\dfrac{1+i\sqrt3}{1-i}\right)^n$ is a positive real number.`, 24,
    XR`<p>$1+i\sqrt3=2e^{i\pi/3}$ and $1-i=\sqrt2\,e^{-i\pi/4}$. The quotient is $\sqrt2\,e^{i(\pi/3+\pi/4)}=\sqrt2\,e^{i7\pi/12}$. Its $n$th power is positive real when $\dfrac{7n\pi}{12}=2\pi k$, i.e. $7n=24k$. Since $\gcd(7,24)=1$, the smallest $n$ is $24$.</p>`,
    'Positive real needs a multiple of 2π; real alone would need a multiple of π (n = 12).', () => { for (let n = 1; n < 100; n++) { const t = 7 * n / 12; if (Math.abs(t - 2 * Math.round(t / 2)) < 1e-9) return n; } }),
  N(5, 'modulus', XR`If $\left|z-\dfrac4z\right|=2$, find the greatest possible value of $|z|$ (2 decimal places).`, 3.24, 0.01,
    XR`<p>Let $|z|=r$. By the triangle inequality, $r-\dfrac4r\le\left|z-\dfrac4z\right|=2$, so $r^2-2r-4\le0$ and $r\le1+\sqrt5\approx3.24$. Equality holds when $z$ and $\dfrac4z$ point in opposite directions, i.e. for $z$ real and positive, $z=1+\sqrt5$: $z-\dfrac4z=2$.</p>`,
    'Use |a − b| ≥ |a| − |b|.', () => 1 + Math.sqrt(5)),
  N(4, 'geometry', XR`Let $z=3+4i$. Find the area of the triangle whose vertices are $z$, $iz$ and $z+iz$.`, 12.5, 0.01,
    XR`<p>$|iz|=|z|=5$. The side from $z$ to $z+iz$ is $iz$ (length 5), and the side from $iz$ to $z+iz$ is $z$ (length 5). The side from $z$ to $iz$ is $|z-iz|=5\sqrt2$. So $5,5,5\sqrt2$ is a right isosceles triangle, area $\dfrac12\cdot5\cdot5=12.5$.</p>`,
    'Find the right angle first: it is at z + iz.', () => 12.5),
  N(3, 'argument', XR`Find the principal argument of $(-1-i)^3$ in radians (2 decimal places).`, -0.79, 0.01,
    XR`<p>$-1-i=\sqrt2\,e^{-3i\pi/4}$. Cubing multiplies the argument by 3: $-\dfrac{9\pi}4$. Add $2\pi$: $-\dfrac\pi4\approx-0.785$. Direct check: $(-1-i)^2=2i$, $(-1-i)^3=2i(-1-i)=-2i+2=2-2i$, argument $-\dfrac\pi4$.</p>`,
    'Bring the angle back into (−π, π].', () => Math.atan2(cp(CC(-1, -1), 3).b, cp(CC(-1, -1), 3).a)),
  N(4, 'geometry', XR`The point $z$ moves on the circle $|z-(1+2i)|=1$. Find the least value of $|z-(3+i)|$ (2 decimal places).`, 1.24, 0.01,
    XR`<p>The distance between the circle's centre $1+2i$ and the point $3+i$ is $\sqrt{4+1}=\sqrt5\approx2.236$. This is larger than the radius 1, so the point is outside the circle and the least distance is $\sqrt5-1\approx1.24$.</p>`,
    'Subtract the radius; add it for the greatest value.', () => Math.sqrt(5) - 1),
  N(4, 'roots of unity', XR`Find $\displaystyle\sum_{k=1}^{5}\left|1-e^{2\pi ik/6}\right|$ (2 decimal places).`, 7.46, 0.01,
    XR`<p>$|1-e^{i\theta}|=2\sin\dfrac\theta2$ for $0<\theta<2\pi$. With $\theta=\dfrac{\pi k}3$: $2\sin\dfrac{\pi}6,\,2\sin\dfrac\pi3,\,2\sin\dfrac\pi2,\,2\sin\dfrac{2\pi}3,\,2\sin\dfrac{5\pi}6=1,\sqrt3,2,\sqrt3,1$. Sum $=1+\sqrt3+2+\sqrt3+1=4+2\sqrt3\approx7.46$.</p>`,
    'These are the five distances from the point 1 to the other vertices of a regular hexagon.', () => { let s = 0; for (let k = 1; k <= 5; k++) s += Math.hypot(1 - Math.cos(Math.PI * k / 3), Math.sin(Math.PI * k / 3)); return s; }),
  N(4, 'modulus', XR`If $\left|z+\dfrac1z\right|=2$, find the greatest possible value of $|z|$ (2 decimal places).`, 2.41, 0.01,
    XR`<p>With $|z|=r$: $2=\left|z+\dfrac1z\right|\ge r-\dfrac1r$, so $r^2-2r-1\le0$ and $r\le1+\sqrt2\approx2.41$. It is reached at $z=i(1+\sqrt2)$: then $z+\dfrac1z=i(1+\sqrt2)-\dfrac i{1+\sqrt2}=i(1+\sqrt2-(\sqrt2-1))=2i$, modulus 2.</p>`,
    'The extreme occurs when z and 1/z point in opposite directions.', () => 1 + Math.SQRT2),
  I(4, 'sums', XR`If $z=\omega$ is a non-real cube root of unity, find $\displaystyle\sum_{k=1}^{20}\left(z^k+\dfrac1{z^k}\right)^2$.`, 38,
    XR`<p>$z^k+z^{-k}=2$ when $3\mid k$, and $=\omega^k+\omega^{-k}=-1$ otherwise. In $1\ldots20$ there are $6$ multiples of 3 (each term $2^2=4$, total $24$) and $14$ other values (each term $(-1)^2=1$, total $14$). Sum $=24+14=38$.</p>`,
    'There are 6 multiples of 3 in 1..20, not 7.', () => { let s = 0; for (let k = 1; k <= 20; k++) { const v = 2 * Math.cos(2 * Math.PI * k / 3); s += v * v; } return Math.round(s); }),
  M(4, 'argument', XR`The principal argument of $1+\cos\dfrac{4\pi}3+i\sin\dfrac{4\pi}3$ is`, XR`$-\dfrac\pi3$`, [XR`$\dfrac{2\pi}3$`, XR`$\dfrac\pi3$`, XR`$\dfrac{4\pi}3$`],
    XR`<p>$1+\cos\theta+i\sin\theta=2\cos\dfrac\theta2\left(\cos\dfrac\theta2+i\sin\dfrac\theta2\right)$. Here $\theta=\dfrac{4\pi}3$, $\dfrac\theta2=\dfrac{2\pi}3$ and $2\cos\dfrac{2\pi}3=-1$. So the number is $-1\cdot e^{i2\pi/3}=e^{i(2\pi/3-\pi)}=e^{-i\pi/3}$. Check numerically: $1-\tfrac12=\tfrac12$ and $\sin240^\circ=-\tfrac{\sqrt3}2$: the point is $\tfrac12-\tfrac{\sqrt3}2i$ in the fourth quadrant.</p>`,
    'When 2cos(θ/2) is negative the argument is θ/2 − π, not θ/2.'),
  M(4, 'geometry', XR`If $|z_1|=|z_2|=|z_3|=1$ and $z_1+z_2+z_3=0$, the triangle with vertices $z_1,z_2,z_3$ is`, 'equilateral', ['right-angled and isosceles', 'isosceles but not equilateral', 'scalene'],
    XR`<p>The centroid is $\dfrac{z_1+z_2+z_3}3=0$ and the circumcentre is also $0$ (all three points are at distance 1 from the origin). A triangle whose centroid and circumcentre coincide is equilateral. (Also: $|z_1+z_2|=|-z_3|=1$ and the parallelogram law gives $|z_1-z_2|^2=4-1=3$, the same for every pair.)</p>`,
    'Centroid = circumcentre forces equal medians and equal sides.'),
  M(4, 'conjugate and modulus', XR`If $|z|=1$ and $z\ne1$, then $\mathrm{Re}\left(\dfrac1{1-z}\right)$ equals`, XR`$\dfrac12$`, ['$0$', '$1$', XR`$\dfrac1{2}\cot\dfrac\theta2$`],
    XR`<p>$\dfrac1{1-z}=\dfrac{1-\bar z}{|1-z|^2}=\dfrac{1-\cos\theta+i\sin\theta}{2-2\cos\theta}$. The real part is $\dfrac{1-\cos\theta}{2(1-\cos\theta)}=\dfrac12$ for every $\theta\ne0$. The imaginary part is the $\dfrac12\cot\dfrac\theta2$ term.</p>`,
    'Option D is the imaginary part, not the real part.'),
  A(4, 'loci', XR`The equation $|z-1|+|z+1|=1$ has no solution.`, XR`For all $z$, $|z-1|+|z+1|\ge|(z-1)-(z+1)|=2$.`, 0,
    XR`<p>By the triangle inequality, $|a|+|b|\ge|a-b|$ with $a=z-1$, $b=z+1$: the sum is at least $2$ (the distance between the foci). So it can never equal $1$. A is true and R is the reason.</p>`,
    'An ellipse needs a sum greater than the distance between the foci.'),
  A(4, 'conjugate and modulus', XR`If $|z_1|=|z_2|=1$ and $z_1z_2\ne-1$, then $\dfrac{z_1+z_2}{1+z_1z_2}$ is a real number.`, XR`For $|z|=1$ we have $\bar z=\dfrac1z$.`, 0,
    XR`<p>Let $w=\dfrac{z_1+z_2}{1+z_1z_2}$. Then $\bar w=\dfrac{\bar z_1+\bar z_2}{1+\bar z_1\bar z_2}=\dfrac{\frac1{z_1}+\frac1{z_2}}{1+\frac1{z_1z_2}}$. Multiply top and bottom by $z_1z_2$: $\dfrac{z_2+z_1}{z_1z_2+1}=w$. So $w=\bar w$, real. R is used in exactly this way.</p>`,
    'Show w equals its conjugate.'),
  A(5, 'roots of unity', XR`The sum of the fourth powers of the four fourth roots of unity is $0$.`, XR`For $n\ge2$, the sum of the $k$th powers of the $n$th roots of unity is $0$ if $n\nmid k$ and is $n$ if $n\mid k$.`, 3,
    XR`<p>The fourth roots are $1,i,-1,-i$. Their fourth powers are all $1$, so the sum is $4$, not $0$: A is false. R is the correct general rule (a geometric series), so R is true.</p>`,
    'When n divides k every term is 1.'),
  A(4, 'argument', XR`For all non-zero $z_1,z_2$ (principal arguments), $\arg\dfrac{z_1}{z_2}=\arg z_1-\arg z_2$.`, XR`$\arg\dfrac{z_1}{z_2}=\arg z_1-\arg z_2+2k\pi$ for some integer $k$.`, 3,
    XR`<p>R is true: arguments are defined only up to multiples of $2\pi$, so the difference can differ from the principal value by $2k\pi$. A is false: take $z_1=-1$ ($\arg=\pi$) and $z_2=i$ ($\arg=\frac\pi2$): fine here, but $z_1=-1,\ z_2=-i$ gives $\arg\dfrac{z_1}{z_2}=\arg(-i)=-\dfrac\pi2$ while $\pi-\left(-\dfrac\pi2\right)=\dfrac{3\pi}2$.</p>`,
    'Check whether the difference stays inside (−π, π].'),
  S(4, 'powers', XR`If $z^2$ is real, then $z$ is real or purely imaginary.`, XR`If $z^3$ is real, then $z$ is real.`, 1,
    XR`<p>Statement I: $z=re^{i\theta}$, $z^2=r^2e^{2i\theta}$ real means $2\theta=k\pi$, so $\theta=0,\frac\pi2,\pi,\dots$: real or imaginary. True. Statement II is false: $z=\omega$ (a cube root of unity) has $z^3=1$ but is not real.</p>`,
    'z³ real allows angles that are multiples of 60°.'),
  S(5, 'equations', XR`$\bar z=z^2$ has exactly $4$ solutions.`, XR`$\bar z=z^3$ has exactly $5$ solutions.`, 0,
    XR`<p>Taking moduli: $|z|=|z|^2$ (resp. $|z|^3$), so $|z|=0$ or $1$. For $|z|=1$, $\bar z=\dfrac1z$: I: $z^3=1$ gives 3 solutions, plus $z=0$: 4. II: $z^4=1$ gives 4 solutions, plus $z=0$: 5. Both true.</p>`,
    'Do not forget z = 0.'),
  SC(4, 'conjugate and modulus', ['$\\{z:|z-1|=|z+1|\\}$ is the imaginary axis.', '$|z+1|^2+|z-1|^2=2|z|^2+2$ for every $z$.', 'If $|z|=|w|$ then $z=w$ or $z=-w$.', 'The principal argument of a positive real number is $0$.'], '3', ['1', '2', '4'],
    XR`<p>(1) true: the perpendicular bisector of $-1$ and $1$. (2) true: expand $(z+1)(\bar z+1)+(z-1)(\bar z-1)=2z\bar z+2$. (3) false: $|z|=|w|=1$ allows $z=1,w=i$. (4) true. Three are correct.</p>`,
    'Equal moduli do not force equal or opposite numbers.'),
  MT(4, 'cube roots of unity', 'xm2', 'A-p, B-q, C-s, D-t', ['A-p, B-q, C-t, D-s', 'A-q, B-p, C-s, D-t', 'A-p, B-r, C-s, D-t'],
    XR`<p>A: $(1-\omega)(1-\omega^2)=1-\omega-\omega^2+\omega^3=2-(\omega+\omega^2)=2+1=3$. B: $\omega^{100}=\omega$ ($100=3\cdot33+1$), $\omega^{200}=\omega^2$ ($200=3\cdot66+2$); sum $=-1$. C: $\omega^{300}=1$. D: $(3+\omega)(3+\omega^2)=9+3(\omega+\omega^2)+\omega^3=9-3+1=7$.</p>`,
    'Reduce exponents mod 3 before adding.'),
  MT(4, 'loci', 'xm3', 'A-r, B-t, C-p, D-q', ['A-r, B-t, C-q, D-p', 'A-t, B-r, C-p, D-q', 'A-r, B-s, C-p, D-q'],
    XR`<p>A: $\mathrm{Re}(z^2)=x^2-y^2=0$, the lines $y=\pm x$. B: equidistant from $i$ and $1$: a line. C: sum of focal distances $4>2$: an ellipse. D: difference of focal distances $1<2$: a hyperbola.</p>`,
    'A difference of distances makes a hyperbola, a sum an ellipse.'),
  MT(4, 'argument', 'xm4', 'A-r, B-q, C-p, D-s', ['A-t, B-q, C-p, D-s', 'A-r, B-q, C-s, D-p', 'A-r, B-s, C-p, D-q'],
    XR`<p>A: $(1+i)^5$ has argument $\dfrac{5\pi}4$, minus $2\pi$ gives $-\dfrac{3\pi}4$. B: $\arg(\sqrt3-i)=-\dfrac\pi6$, times 3 gives $-\dfrac\pi2$. C: $(-1+i)^4=(-2i)^2=-4$, argument $\pi$. D: $i^{-3}=i$, argument $\dfrac\pi2$.</p>`,
    'Subtract 2π when the multiplied angle leaves (−π, π].'),
  MT(4, 'transformations', 'xm6', 'A-q, B-r, C-s, D-p', ['A-q, B-r, C-p, D-s', 'A-r, B-q, C-s, D-p', 'A-q, B-s, C-r, D-p'],
    XR`<p>A: $i(2+i)=-1+2i$. B: $\bar z=2-i$. C: reflection in the imaginary axis is $-\bar z=-2+i$. D: $1+i(z-1)=1+i(1+i)=1+i-1=i$.</p>`,
    'Rotation about a point other than the origin: translate, rotate, translate back.'),
  // ---- L5 ----
  I(5, 'roots of unity', XR`Let $\omega$ be a primitive 11th root of unity. Find $\displaystyle\prod_{k=1}^{10}(3-\omega^k)$.`, 88573,
    XR`<p>$z^{11}-1=\prod_{k=0}^{10}(z-\omega^k)=(z-1)\prod_{k=1}^{10}(z-\omega^k)$. So $\prod_{k=1}^{10}(z-\omega^k)=\dfrac{z^{11}-1}{z-1}$. At $z=3$: $\dfrac{3^{11}-1}2=\dfrac{177147-1}2=88573$.</p>`,
    '3¹¹ = 177147.', () => (3 ** 11 - 1) / 2),
  I(5, 'Gaussian integers', XR`Find the number of ordered pairs of integers $(a,b)$ with $a^2+b^2=65$.`, 16,
    XR`<p>$65=1+64=16+49=4^2+7^2=1^2+8^2$. Representations as a sum of two squares: $65=1^2+8^2=4^2+7^2$. For each unordered pair $\{p,q\}$ with $p\ne q$, both non-zero, we get $2\cdot2\cdot2=8$ ordered signed pairs ($\pm p,\pm q$ in either order). Two pairs: $16$.</p>`,
    'Signs and order both matter: 8 solutions from each pair.', () => { let c = 0; for (let a = -9; a <= 9; a++) for (let b = -9; b <= 9; b++) if (a * a + b * b === 65) c++; return c; }),
  N(5, 'modulus', XR`For $|z|=1$, find the greatest value of $|z^3-z+2|$ (2 decimal places).`, 3.61, 0.01,
    XR`<p>Put $z=e^{i\theta}$ and $c=\cos\theta$. Then $|z^3-z+2|^2=|z^3-z|^2+4\mathrm{Re}(z^3-z)+4=(2-2\cos2\theta)+4(\cos3\theta-\cos\theta)+4$. Using $\cos2\theta=2c^2-1$ and $\cos3\theta=4c^3-3c$ this is $16c^3-4c^2-16c+8$.</p><p>On $[-1,1]$ the derivative $48c^2-8c-16=0$ gives $6c^2-c-2=0$, $c=\dfrac23$ or $-\dfrac12$. Values: $c=-1:4$, $c=-\tfrac12:13$, $c=\tfrac23\approx0.30$, $c=1:4$. Greatest $=13$, so the maximum modulus is $\sqrt{13}\approx3.61$.</p>`,
    'It is not at z = 1 or z = −1; check the interior critical points.', () => { let m = 0; for (let i = 0; i < 400000; i++) { const t = i / 400000 * 2 * Math.PI; m = Math.max(m, Math.hypot(Math.cos(3 * t) - Math.cos(t) + 2, Math.sin(3 * t) - Math.sin(t))); } return m; }),
  MT(5, 'roots of unity', 'xm5', 'A-p, B-q, C-s, D-r', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-p, B-s, C-q, D-r'],
    XR`<p>A: the real parts of the 12th roots of unity add to $0$. B: $\cos^2x=\dfrac{1+\cos2x}2$, so the sum is $\dfrac{12}2+\dfrac12\cdot0=6$. C: $\dfrac{z^{12}-1}{z-1}$ at $z=1$ is $12$. D: $\sum_{k=1}^{n-1}\dfrac1{1-\omega^k}=\dfrac{n-1}2$ (pair $k$ with $n-k$: each pair adds to 1), so for $n=6$ it is $\dfrac52$.</p>`,
    'Pair each root with its conjugate.'),
  // ---- passages ----
  PI(4, 'roots of unity', 'xp1', XR`Find $A+B$.`, -1,
    XR`<p>$A+B=\alpha+\alpha^2+\dots+\alpha^6=-1$ (all seventh roots except 1).</p>`, 'The six numbers together are every root except 1.', () => -1),
  PI(5, 'roots of unity', 'xp1', XR`Find $AB$.`, 2,
    XR`<p>$AB=(\alpha+\alpha^2+\alpha^4)(\alpha^3+\alpha^5+\alpha^6)$. The nine products are $\alpha^4,\alpha^6,\alpha^7,\alpha^5,\alpha^7,\alpha^8,\alpha^7,\alpha^9,\alpha^{10}$, i.e. $\alpha^4,\alpha^6,1,\alpha^5,1,\alpha,1,\alpha^2,\alpha^3$. That is $3$ ones plus $\alpha+\alpha^2+\dots+\alpha^6=-1$: $AB=3-1=2$.</p>`, 'Reduce every exponent modulo 7.', () => 2),
  PM(5, 'roots of unity', 'xp1', XR`$A$ is a root of the quadratic`, '$x^2+x+2=0$', ['$x^2-x+2=0$', '$x^2+x-2=0$', '$x^2+2x+1=0$'],
    XR`<p>$A$ and $B$ have sum $-1$ and product $2$, so they are the roots of $x^2-(A+B)x+AB=x^2+x+2=0$. The roots are $\dfrac{-1\pm i\sqrt7}2$.</p>`, 'The sign of the middle term is minus the sum.'),
  PI(4, 'geometry', 'xp2', XR`Find the area of the square $ABCD$.`, 20,
    XR`<p>The diagonal $AC$ goes from $2+i$ to $4+7i$: $|AC|^2=2^2+6^2=40$. Area of a square $=\dfrac{d^2}2=20$.</p>`, 'Area of a square is half the diagonal squared.', () => 20),
  PM(4, 'geometry', 'xp2', XR`The vertex $D$ represents`, '$5i$', ['$6+3i$', '$-2+3i$', '$2+5i$'],
    XR`<p>The centre is the midpoint of $AC$: $c=3+4i$. $A-c=-1-3i$. Anticlockwise order $A,B,C,D$ means $B$ is $A$ rotated $+90^\circ$ about $c$ and $D$ is $A$ rotated $-90^\circ$: $D=c-i(A-c)=3+4i-i(-1-3i)=3+4i+i-3=5i$. (And $B=c+i(A-c)=3+4i+(-i+3)=6+3i$, which option B uses as a distractor.)</p>`, 'Anticlockwise order decides which rotation gives B and which gives D.'),
  PI(5, 'geometry', 'xp2', XR`Find the square of the radius of the circle through all four vertices.`, 10,
    XR`<p>The circumcircle has the diagonal $AC$ as diameter: $d^2=40$, so $r^2=\dfrac{d^2}4=10$.</p>`, 'The radius is half the diagonal.', () => 10),
);
gens.push(
  GX('cn-g16', 3, 'nat', 'integer', 'powers', (rng) => {
    const b = choose(rng, [[1, 1, 4, '1+i'], [1, 'r3', 3, '1+i\\sqrt3'], ['r3', 1, 6, '\\sqrt3+i']]); const N0 = int(rng, 60, 150);
    const m = b[2]; const ans = Math.floor(N0 / m);
    return { N0, m, ans, answer: ans, tol: 0, q: XR`How many integers $n$ with $1\le n\le ${N0}$ make $(${b[3]})^n$ a real number?`,
      sol: XR`<p>$${b[3]}$ has argument $\dfrac{\pi}{${m}}$ (it is $r\,e^{i\pi/${m}}$). Its $n$th power is real when $\dfrac{n\pi}{${m}}$ is a multiple of $\pi$, i.e. ${m} divides $n$. The multiples of ${m} up to ${N0} number $\lfloor ${N0}/${m}\rfloor=${ans}$.</p>` };
  }, (p) => { let c = 0; const [re, im] = p.m === 4 ? [1, 1] : p.m === 3 ? [1, Math.sqrt(3)] : [Math.sqrt(3), 1]; const th = Math.atan2(im, re); for (let n = 1; n <= p.N0; n++) if (Math.abs(Math.sin(n * th)) < 1e-9) c++; return c; }),
  GX('cn-g17', 4, 'nat', 'integer', 'modulus', (rng) => {
    const m = int(rng, 1, 6); const k = m + 1;
    return { m, k, answer: m + 1, tol: 0, q: XR`If $\left|z-\dfrac{${k}}z\right|=${m}$, find the greatest possible value of $|z|$.`,
      sol: XR`<p>With $r=|z|$: $r-\dfrac{${k}}r\le\left|z-\dfrac{${k}}z\right|=${m}$, so $r^2-${m}r-${k}\le0$, i.e. $(r-${m + 1})(r+1)\le0$ and $r\le${m + 1}$. It is attained at $z=${m + 1}$: $${m + 1}-\dfrac{${k}}{${m + 1}}=${m}$.</p>` };
  }, (p) => { const f = (r) => Math.abs(r - p.k / r); let best = 0; for (let r = 0.01; r < 20; r += 0.001) if (f(r) <= p.m + 1e-9) best = r; return Math.round(best); }),
  GX('cn-g18', 4, 'mcq', 'single', 'loci', (rng) => {
    const b = int(rng, -3, 3), d = 3 * int(rng, 1, 3), a = b + d * (rng() < 0.5 ? 1 : -1); const r = 2 * Math.abs(a - b) / 3;
    const { options, answer } = shuffleOpts(rng, `${fmt(r)}`, [`${fmt(2 * Math.abs(a - b))}`, `${fmt(Math.abs(a - b) / 3)}`, `${fmt(Math.abs(a - b))}`]);
    return { a, b, r, options, answer, q: XR`The locus of $z$ with $|z-(${a})|=2|z-(${b})|$ is a circle. Its radius is`,
      sol: XR`<p>Apollonius circle for the ratio $k=2$: radius $=\dfrac{k\,|a-b|}{|k^2-1|}=\dfrac{2\cdot${Math.abs(a - b)}}{3}=${fmt(r)}$. (Derivation: square both sides, $(x-${a})^2+y^2=4(x-${b})^2+4y^2$, and complete the square.)</p>` };
  }, (p) => { const x0 = (4 * p.b - p.a) / 3; const rr = Math.sqrt(x0 * x0 - (4 * p.b * p.b - p.a * p.a) / 3); const pts = [x0 + rr, x0 - rr]; for (const x of pts) if (Math.abs(Math.abs(x - p.a) - 2 * Math.abs(x - p.b)) > 1e-9) return -1; return p.answer; }),
  GX('cn-g19', 4, 'mcq', 'single', 'roots of unity', (rng) => {
    const n = int(rng, 3, 12), c = int(rng, 2, 5); const val = n * (1 + c * c);
    const { options, answer } = shuffleOpts(rng, `${val}`, [`${n * (1 - c * c)}`.replace('-', '−'), `${n * (1 + c) ** 2}`, `${n * c * c}`]);
    return { n, c, val, options, answer, q: XR`Let $\omega_0,\dots,\omega_{${n - 1}}$ be the ${n}th roots of unity. Find $\displaystyle\sum_{k=0}^{${n - 1}}|\omega_k-${c}|^2$.`,
      sol: XR`<p>$|\omega_k-${c}|^2=(\omega_k-${c})(\bar\omega_k-${c})=1+${c * c}-${c}(\omega_k+\bar\omega_k)$. The sum of the roots is $0$, so the cross term vanishes and the total is $${n}(1+${c * c})=${val}$.</p>` };
  }, (p) => { let s = 0; for (let k = 0; k < p.n; k++) s += (Math.cos(2 * Math.PI * k / p.n) - p.c) ** 2 + Math.sin(2 * Math.PI * k / p.n) ** 2; return Math.abs(s - p.val) < 1e-9 ? p.answer : -1; }),
  GX('cn-g20', 3, 'nat', 'integer', 'roots of unity', (rng) => {
    const n = int(rng, 3, 7), c = int(rng, 2, 4); const ans = (c ** n - 1) / (c - 1);
    return { n, c, answer: ans, tol: 0, q: XR`Let $\omega$ be a primitive ${n}th root of unity. Find $\displaystyle\prod_{k=1}^{${n - 1}}(${c}-\omega^k)$.`,
      sol: XR`<p>$\prod_{k=1}^{${n - 1}}(z-\omega^k)=\dfrac{z^{${n}}-1}{z-1}$. At $z=${c}$: $\dfrac{${c ** n}-1}{${c - 1}}=${ans}$.</p>` };
  }, (p) => { let re = 1, im = 0; for (let k = 1; k < p.n; k++) { const t = 2 * Math.PI * k / p.n; const a = p.c - Math.cos(t), b = -Math.sin(t); [re, im] = [re * a - im * b, re * b + im * a]; } return Math.round(re); }),
  GX('cn-g21', 4, 'nat', 'numeric', 'area', (rng) => {
    const a = int(rng, 1, 6), b = int(rng, 1, 6); const m2 = a * a + b * b; const area = 3 * Math.sqrt(3) / 4 * m2;
    return { a, b, m2, answer: +area.toFixed(2), tol: 0.01, area, q: XR`The points $z$, $\omega z$ and $\omega^2z$, with $z=${a}+${b}i$ and $\omega$ a non-real cube root of unity, form a triangle. Find its area (2 decimal places).`,
      sol: XR`<p>The three points lie on the circle of radius $|z|$, $120^\circ$ apart: an equilateral triangle with circumradius $R=|z|$, $R^2=${a}^2+${b}^2=${m2}$. Area $=\dfrac{3\sqrt3}4R^2=\dfrac{3\sqrt3}4\cdot${m2}\approx${area.toFixed(2)}$.</p>` };
  }, (p) => { const w = [-0.5, Math.sqrt(3) / 2]; const z1 = [p.a, p.b]; const m = (x, y) => [x[0] * y[0] - x[1] * y[1], x[0] * y[1] + x[1] * y[0]]; const z2 = m(w, z1), z3 = m(w, z2); return Math.abs((z1[0] * (z2[1] - z3[1]) + z2[0] * (z3[1] - z1[1]) + z3[0] * (z1[1] - z2[1])) / 2); }),
  GX('cn-g22', 4, 'mcq', 'single', 'argument', (rng) => {
    const b = choose(rng, [[1, 1, 1, 4, '1+i'], [1, 1, 1, 3, '1+i\\sqrt3'], [-1, 1, 3, 4, '-1+i'], [1, -1, -1, 3, '1-i\\sqrt3']]); // [re sign, im sign..] handled below
    const defs = { '1+i': [1, 1], '1+i\\sqrt3': [1, Math.sqrt(3)], '-1+i': [-1, 1], '1-i\\sqrt3': [1, -Math.sqrt(3)] };
    const th = { '1+i': [1, 4], '1+i\\sqrt3': [1, 3], '-1+i': [3, 4], '1-i\\sqrt3': [-1, 3] }[b[4]]; const n = int(rng, 3, 11);
    let num = th[0] * n, den = th[1]; while (num > den) num -= 2 * den; while (num <= -den) num += 2 * den;
    const un = th[0] * n;
    const { options, answer } = shuffleOpts(rng, `$${frac(num, den)}\\pi$`, [`$${frac(un, den)}\\pi$`, `$${frac(-num, den)}\\pi$`, `$${frac(num + den, den)}\\pi$`]);
    return { re: defs[b[4]][0], im: defs[b[4]][1], n, num, den, options, answer, q: XR`The principal argument of $(${b[4]})^{${n}}$ is`,
      sol: XR`<p>$${b[4]}$ has argument $${frac(th[0], th[1])}\pi$. Multiplying by ${n}: $${frac(un, den)}\pi$. Bring it into $(-\pi,\pi]$ by adding or subtracting multiples of $2\pi$: $${frac(num, den)}\pi$.</p>` };
  }, (p) => { let z = [1, 0]; const m = (x, y) => [x[0] * y[0] - x[1] * y[1], x[0] * y[1] + x[1] * y[0]]; for (let i = 0; i < p.n; i++) z = m(z, [p.re, p.im]); const t = Math.atan2(z[1], z[0]); const u = Math.PI * p.num / p.den; const nz = Math.hypot(z[0], z[1]); return Math.abs(z[0] / nz - Math.cos(u)) < 1e-9 && Math.abs(z[1] / nz - Math.sin(u)) < 1e-9 && u > -Math.PI + 1e-9 && u <= Math.PI + 1e-9 ? p.answer : -1; }),
  GX('cn-g23', 5, 'nat', 'integer', 'roots of unity', (rng) => {
    const n = int(rng, 3, 14);
    return { n, answer: 2 * n, tol: 0, q: XR`How many complex numbers $z$ with $|z|=1$ satisfy $z^{${n}}+z^{-${n}}=1$?`,
      sol: XR`<p>Put $z=e^{i\theta}$, $0\le\theta<2\pi$. The equation is $2\cos(${n}\theta)=1$, i.e. $\cos(${n}\theta)=\dfrac12$. As $\theta$ runs through $[0,2\pi)$, $${n}\theta$ runs through $[0,${2 * n}\pi)$, which is ${n} full turns. In each turn $\cos x=\dfrac12$ has 2 solutions ($x=\pm\dfrac\pi3$). Total: $2\cdot${n}=${2 * n}$.</p>` };
  }, (p) => { let c = 0; const f = (t) => 2 * Math.cos(p.n * t) - 1; const K = 200000; let prev = f(0); for (let i = 1; i <= K; i++) { const v = f(2 * Math.PI * i / K); if (prev === 0 || (prev < 0) !== (v < 0)) c++; prev = v; } return c; }),
);

}
// ==XP-END
export default { topic: 'complex-numbers', groups, items, gens };
