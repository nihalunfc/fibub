import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';
import { tidyGens } from '../_util.js';

const R = String.raw;
const EXS = {
  1: ['keam', 'cusat', 'comedk', 'jee-main'],
  2: ['keam', 'cusat', 'comedk', 'jee-main'],
  3: ['jee-main', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv'],
  5: ['jee-adv'],
};
const POS = [1, 3, 0, 2, 2, 0, 3, 1, 3, 1, 2, 0, 0, 2, 1, 3];
let _n = 0;
const place = (correct, wrongs) => {
  const p = POS[_n++ % POS.length];
  const o = [...wrongs];
  o.splice(p, 0, correct);
  return { options: o, answer: p };
};
let _k = 0;
const nid = () => `ci-${String(++_k).padStart(3, '0')}`;
const base = (level, sub, extra) => ({ id: nid(), level, exams: EXS[level], sub, ...extra });
const M = (level, sub, q, correct, wrongs, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'single', q, ...place(correct, wrongs), sol, trap, ...more });
const I = (level, sub, q, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'nat', format: 'integer', q, answer, tol: 0, sol, trap, ...more });
const N = (level, sub, q, answer, tol, sol, trap, more = {}) =>
  base(level, sub, { type: 'nat', format: 'numeric', q, answer, tol, sol, trap, ...more });
const X = (level, sub, q, options, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, trap, ...more });
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
const A = (level, sub, a, r, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'assertion', q: `<p><b>Assertion (A):</b> ${a}</p><p><b>Reason (R):</b> ${r}</p>`, options: AOPT, answer, sol, trap, ...more });
const S = (level, sub, s1, s2, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'statements', q: `<p><b>Statement I:</b> ${s1}</p><p><b>Statement II:</b> ${s2}</p>`, options: SOPT, answer, sol, trap, ...more });
const SC = (level, sub, lines, correct, wrongs, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'statements', q: `<ol>${lines.map((l) => `<li>${l}</li>`).join('')}</ol><p>How many of these statements are correct?</p>`, ...place(correct, wrongs), sol, trap, ...more });
const MT = (level, sub, group, q, correct, wrongs, sol, trap) =>
  base(level, sub, { type: 'mcq', format: 'match', group, q, ...place(correct, wrongs), sol, trap });
const PI = (level, sub, group, q, answer, sol, trap, more = {}) =>
  base(level, sub, { type: 'nat', format: 'passage', group, q, answer, tol: 0, sol, trap, ...more });
const PN = (level, sub, group, q, answer, tol, sol, trap, more = {}) =>
  base(level, sub, { type: 'nat', format: 'passage', group, q, answer, tol, sol, trap, ...more });
/** 'x^2+y^2+ax+by+c=0' written neatly */
const t = (k, v) => (k === 0 ? '' : (k < 0 ? '-' : '+') + (Math.abs(k) === 1 && v ? '' : Math.abs(k)) + v);
const gen2 = (a, b, c) => `x^2+y^2${t(a, 'x')}${t(b, 'y')}${t(c, '')}=0`;
const near = (v) => Math.round(v * 1e6) / 1e6;
const groups = {
  m1: {
    title: 'Centres of circles',
    passage: R`<p>Match each circle in List I with its centre in List II.</p>`,
    list1: ['A. $x^2+y^2-4x+6y=0$', 'B. $x^2+y^2+8x=0$', 'C. $x^2+y^2-10y+3=0$', 'D. $2x^2+2y^2+6x-4y=0$'],
    list2: ['p. $(0,5)$', 'q. $(2,-3)$', 'r. $(-4,0)$', 's. $\\left(-\\dfrac32,1\\right)$'],
  },
  m2: {
    title: 'Number of common tangents',
    passage: R`<p>Match each pair of circles in List I with the number of common tangents in List II.</p>`,
    list1: ['A. $x^2+y^2=1$ and $(x-5)^2+y^2=1$', 'B. $x^2+y^2=4$ and $(x-5)^2+y^2=9$', 'C. $x^2+y^2=4$ and $(x-1)^2+y^2=9$', 'D. $x^2+y^2=25$ and $(x-1)^2+y^2=4$'],
    list2: ['p. 0', 'q. 1', 'r. 3', 's. 4'],
  },
  m3: {
    title: 'Lines and the circle $x^2+y^2=25$',
    passage: R`<p>Match each line in List I with how it meets the circle $x^2+y^2=25$ (List II).</p>`,
    list1: ['A. $3x+4y=25$', 'B. $x+y=0$', 'C. $3x+4y=50$', 'D. $x=3$'],
    list2: ['p. Touches the circle', 'q. Cuts the circle along a diameter', 'r. Does not meet the circle', 's. Cuts the circle in a chord that is not a diameter'],
  },
  m4: {
    title: 'Loci that are circles',
    passage: R`<p>Match each locus in List I with its radius in List II.</p>`,
    list1: ['A. Points $P$ with $PA=2PB$, where $A(0,0)$, $B(3,0)$', 'B. Mid-points of chords of $x^2+y^2=100$ through $(6,8)$', 'C. Points $P$ with $PA^2+PB^2=50$, where $A(3,0)$, $B(-3,0)$', 'D. Centres of circles of radius 2 that touch $x^2+y^2=9$ from the inside'],
    list2: ['p. 2', 'q. 5', 'r. 4', 's. 1'],
  },
  p1: {
    title: 'Passage: tangents from the origin',
    passage: R`<p>The circle $C:\ x^2+y^2-6x-8y+9=0$ is given. Tangents are drawn to it from the origin $O$, touching it at $A$ and $B$. Let $K$ be the centre of $C$.</p>`,
  },
  p2: {
    title: 'Passage: two circles that cross',
    passage: R`<p>$C_1:\ x^2+y^2-4x-4y+4=0$ and $C_2:\ x^2+y^2-8x-8y+28=0$ intersect at two points.</p>`,
  },
  p3: {
    title: 'Passage: a moving point and two fixed points',
    passage: R`<p>A point $P$ moves so that its distance from $A(0,0)$ is always twice its distance from $B(3,0)$. The locus of $P$ is a circle $\Gamma$.</p>`,
  },
};

const items = [
  // ---------- L1 ----------
  I(1, 'centre and radius', R`Find the radius of the circle $x^2+y^2-6x+8y-11=0$.`, 6,
    R`<p>Compare with $x^2+y^2+2gx+2fy+c=0$: $g=-3$, $f=4$, $c=-11$.</p><p>$r=\sqrt{g^2+f^2-c}=\sqrt{9+16+11}=\sqrt{36}=6$.</p>`, 'The constant is $-11$, so $-c=+11$.', { calc: () => Math.sqrt(9 + 16 + 11) }),
  M(1, 'standard form', R`The equation of the circle with centre $(2,-3)$ and radius 4 is`, '$(x-2)^2+(y+3)^2=16$', ['$(x+2)^2+(y-3)^2=16$', '$(x-2)^2+(y+3)^2=4$', '$(x-2)^2+(y-3)^2=16$'],
    R`<p>Use $(x-h)^2+(y-k)^2=r^2$ with $h=2$, $k=-3$, $r=4$: $(x-2)^2+(y+3)^2=16$.</p>`, 'The right side is $r^2$, not $r$.'),
  M(1, 'centre and radius', R`The centre of the circle $x^2+y^2+4x-10y+1=0$ is`, '$(-2,5)$', ['$(2,-5)$', '$(4,-10)$', '$(-4,10)$'],
    R`<p>Centre $=(-g,-f)$ where $2g=4$ and $2f=-10$. So $g=2$, $f=-5$ and the centre is $(-2,5)$.</p>`, 'Half the coefficient, with the sign changed.'),
  I(1, 'centre and radius', R`Find the radius of the circle $x^2+y^2-2x-4y-4=0$.`, 3,
    R`<p>$g=-1$, $f=-2$, $c=-4$. $r=\sqrt{1+4+4}=3$.</p>`, 'Do not forget to add $-c$.', { calc: () => Math.sqrt(1 + 4 + 4) }),
  M(1, 'diameter form', R`The circle with the points $(1,2)$ and $(5,6)$ as ends of a diameter is`, '$x^2+y^2-6x-8y+17=0$', ['$x^2+y^2-6x-8y+5=0$', '$x^2+y^2+6x+8y+17=0$', '$x^2+y^2-3x-4y+17=0$'],
    R`<p>Diameter form: $(x-1)(x-5)+(y-2)(y-6)=0$.</p><p>$x^2-6x+5+y^2-8y+12=0$, so $x^2+y^2-6x-8y+17=0$.</p>`, 'Add the constants $5+12$.'),
  M(1, 'standard form', R`The circle with centre at the origin that passes through $(3,4)$ is`, '$x^2+y^2=25$', ['$x^2+y^2=5$', '$x^2+y^2=7$', '$x^2+y^2=49$'],
    R`<p>$r^2=3^2+4^2=25$, so the circle is $x^2+y^2=25$.</p>`, '$x^2+y^2=r^2$, so write 25 not 5.'),
  I(1, 'touching axes', R`A circle has centre $(3,5)$ and touches the x-axis. Find its radius.`, 5,
    R`<p>The distance from the centre to the x-axis is $|5|=5$. A circle touching the x-axis has radius equal to that distance, so $r=5$.</p>`, 'For the x-axis use the y-coordinate.'),
  M(1, 'position of a point', R`The point $(1,1)$ with respect to the circle $x^2+y^2=4$ lies`, 'inside the circle', ['on the circle', 'outside the circle', 'on the x-axis only'],
    R`<p>$S_1=1+1-4=-2<0$, so the point is inside. (Also its distance from the centre is $\sqrt2<2$.)</p>`, '$S_1<0$ means inside.'),
  I(1, 'length of tangent', R`Find the length of the tangent from $(5,0)$ to the circle $x^2+y^2=9$.`, 4,
    R`<p>$L=\sqrt{S_1}=\sqrt{25+0-9}=4$.</p>`, 'Put the point in the equation, do not square twice.', { calc: () => Math.sqrt(25 - 9) }),
  M(1, 'condition for a circle', R`Which of these equations does NOT represent a real circle?`, '$x^2+y^2+2x+2y+5=0$', ['$x^2+y^2-4x-6y+4=0$', '$2x^2+2y^2-8=0$', '$x^2+y^2+6x=0$'],
    R`<p>For $x^2+y^2+2x+2y+5=0$: $g^2+f^2-c=1+1-5=-3<0$, so no real circle.</p><p>The others give $r^2=9$, $r^2=4$ and $r^2=9$.</p>`, 'Check $g^2+f^2-c>0$.'),
  I(1, 'general form', R`The circle $x^2+y^2+2gx+2fy+c=0$ has centre $(2,-5)$. Find $g+f$.`, 3,
    R`<p>Centre $=(-g,-f)=(2,-5)$, so $g=-2$ and $f=5$. $g+f=3$.</p>`, 'The centre is $(-g,-f)$.', { calc: () => -2 + 5 }),
  M(1, 'touching axes', R`The circle of radius 3 that touches both axes and lies in the first quadrant is`, '$(x-3)^2+(y-3)^2=9$', ['$(x-3)^2+(y-3)^2=3$', '$(x+3)^2+(y+3)^2=9$', '$x^2+y^2=9$'],
    R`<p>The centre is at distance 3 from both axes, in the first quadrant: $(3,3)$. Equation: $(x-3)^2+(y-3)^2=9$.</p>`, '$x^2+y^2=9$ has centre at the origin and touches nothing.'),
  I(1, 'centre and radius', R`Find the diameter of the circle $x^2+y^2-4x+6y-3=0$.`, 8,
    R`<p>$g=-2$, $f=3$, $c=-3$: $r=\sqrt{4+9+3}=4$. The diameter is $2r=8$.</p>`, 'The question asks the diameter.', { calc: () => 2 * Math.sqrt(4 + 9 + 3) }),
  M(1, 'touching axes', R`The circle $x^2+y^2-6x-4y+9=0$`, 'touches the x-axis only', ['touches the y-axis only', 'touches both axes', 'touches neither axis'],
    R`<p>$g=-3$, $f=-2$, $c=9$. Put $y=0$: $x^2-6x+9=(x-3)^2=0$, a double root, so it touches the x-axis ($g^2=c$: $9=9$). Put $x=0$: $y^2-4y+9=0$ has discriminant $16-36<0$, so it never meets the y-axis ($f^2=4\ne9$).</p><p>(Check: centre $(3,2)$ and radius $2$, so the distance to the x-axis equals the radius.)</p>`, 'x-axis uses $g^2=c$, y-axis uses $f^2=c$.'),
  I(1, 'general form', R`Find the radius of the circle $2x^2+2y^2-8x+12y-6=0$.`, 4,
    R`<p>Divide by 2: $x^2+y^2-4x+6y-3=0$. $g=-2$, $f=3$, $c=-3$. $r=\sqrt{4+9+3}=4$.</p>`, 'Divide by the coefficient of $x^2$ first.', { calc: () => Math.sqrt(4 + 9 + 3) }),
  I(1, 'standard form', R`The circle $(x+1)^2+(y-2)^2=49$ has radius $r$. Find $r$.`, 7,
    R`<p>The right side is $r^2=49$, so $r=7$.</p>`, 'Take the square root of the right side.'),
  M(1, 'point circle', R`The equation $x^2+y^2=0$ represents`, 'a single point, the origin', ['a circle of radius 1', 'two lines $y=\\pm x$', 'no points at all'],
    R`<p>Sum of two squares is zero only when $x=0$ and $y=0$. This is a point circle ($r=0$).</p>`, '$y^2=-x^2$ has no real lines.'),

  // ---------- L2 ----------
  M(2, 'circle through points', R`The circle through $(0,0)$, $(4,0)$ and $(0,6)$ is`, '$x^2+y^2-4x-6y=0$', ['$x^2+y^2+4x+6y=0$', '$x^2+y^2-4x-6y+13=0$', '$x^2+y^2-8x-12y=0$'],
    R`<p>It passes through the origin, so $c=0$. Put $(4,0)$: $16+4g=0$, $g=-2$. Put $(0,6)$: $36+12f=0$, $f=-3$.</p><p>Equation: $x^2+y^2-4x-6y=0$.</p>`, 'A circle through the origin has no constant term.'),
  I(2, 'circle through points', R`A circle passes through $(1,2)$ and $(3,4)$ and its centre lies on the x-axis. Find the x-coordinate of the centre.`, 5,
    R`<p>Let the centre be $(h,0)$. Equal distances: $(h-1)^2+4=(h-3)^2+16$.</p><p>$h^2-2h+5=h^2-6h+25$, so $4h=20$ and $h=5$.</p>`, 'Radius to both points must be equal.', { calc: () => (25 - 5) / 4 }),
  M(2, 'tangent condition', R`The line $y=x+k$ touches the circle $x^2+y^2=8$ for $k=$`, '$\\pm4$', ['$\\pm2\\sqrt2$', '$\\pm8$', '$\\pm2$'],
    R`<p>Write $x-y+k=0$. Distance from the origin $=\dfrac{|k|}{\sqrt2}=r=2\sqrt2$, so $|k|=4$.</p>`, 'The radius is $\\sqrt8$, not 8.'),
  I(2, 'chord length', R`Find the length of the chord cut from $x^2+y^2=25$ by the line $3x+4y=15$.`, 8,
    R`<p>Distance of the centre from the line: $d=\dfrac{15}{5}=3$.</p><p>Half chord $=\sqrt{r^2-d^2}=\sqrt{25-9}=4$. Chord $=8$.</p>`, 'The chord is twice the half-chord.', { calc: () => 2 * Math.sqrt(25 - 9) }),
  M(2, 'tangent at a point', R`The tangent to $x^2+y^2=25$ at $(3,4)$ is`, '$3x+4y=25$', ['$3x+4y=5$', '$4x+3y=25$', '$3x-4y=25$'],
    R`<p>Tangent at $(x_1,y_1)$ is $xx_1+yy_1=r^2$: $3x+4y=25$.</p>`, 'The right side is $r^2=25$.'),
  I(2, 'length of tangent', R`Find the length of the tangent from $(7,1)$ to $x^2+y^2-4x-2y-4=0$.`, 4,
    R`<p>$S_1=49+1-28-2-4=16$. $L=\sqrt{16}=4$.</p>`, 'Replace $x$ by 7 and $y$ by 1 everywhere.', { calc: () => Math.sqrt(49 + 1 - 28 - 2 - 4) }),
  I(2, 'intercepts', R`Find the length of the intercept made on the x-axis by $x^2+y^2-10x-6y+9=0$.`, 8,
    R`<p>Put $y=0$: $x^2-10x+9=0$, so $x=1$ or $9$. Intercept $=8$. (Formula: $2\sqrt{g^2-c}=2\sqrt{25-9}=8$.)</p>`, 'The x-axis intercept uses $g^2-c$.', { calc: () => 2 * Math.sqrt(25 - 9) }),
  I(2, 'circle through points', R`Find the radius of the circle through $(3,4)$, $(-3,4)$ and $(0,-5)$.`, 5,
    R`<p>By symmetry the centre is on the y-axis, $(0,k)$. Then $9+(4-k)^2=(-5-k)^2$, so $25-8k=25+10k$ and $k=0$.</p><p>The centre is the origin and $r=\sqrt{9+16}=5$.</p>`, 'Symmetry about the y-axis puts the centre on it.'),
  M(2, 'position of a point', R`The point $(2,3)$ with respect to $x^2+y^2-4x-6y+9=0$ lies`, 'inside the circle', ['outside the circle', 'on the circle', 'on the line $y=x$ but outside'],
    R`<p>$S_1=4+9-8-18+9=-4<0$, so the point is inside. (The centre is $(2,3)$ itself, so of course it is inside.)</p>`, 'Spot that the point is the centre.'),
  I(2, 'nearest and farthest points', R`Find the shortest distance from $(8,6)$ to the circle $x^2+y^2=25$.`, 5,
    R`<p>Distance from the centre $=10$. Shortest distance $=10-5=5$.</p>`, 'Subtract the radius from the distance to the centre.', { calc: () => 10 - 5 }),
  M(2, 'concentric circles', R`The circle concentric with $x^2+y^2-4x+6y-3=0$ and passing through $(1,1)$ is`, '$x^2+y^2-4x+6y-4=0$', ['$x^2+y^2-4x+6y+3=0$', '$x^2+y^2+4x-6y-4=0$', '$x^2+y^2-4x+6y-17=0$'],
    R`<p>Concentric circles differ only in the constant: $x^2+y^2-4x+6y+k=0$. Put $(1,1)$: $1+1-4+6+k=0$, so $k=-4$.</p>`, '$-17$ is $r^2$, not $c$.'),
  I(2, 'normal', R`The line $2x+3y=k$ passes through the centre of $x^2+y^2-2x-4y-4=0$. Find $k$.`, 8,
    R`<p>The centre is $(1,2)$. $k=2(1)+3(2)=8$.</p>`, 'A line bisects the circle if it passes through the centre.', { calc: () => 2 + 6 }),
  M(2, 'tangent conditions', R`The radius of the circle with centre $(1,2)$ that touches the line $3x+4y+5=0$ is`, R`$\dfrac{16}{5}$`, [R`$\dfrac{8}{5}$`, R`$\dfrac{11}{5}$`, '$16$'],
    R`<p>$r=\dfrac{|3+8+5|}{\sqrt{9+16}}=\dfrac{16}{5}$.</p>`, 'Remember the denominator $\\sqrt{a^2+b^2}$.'),
  I(2, 'tangent condition', R`The line $4x-3y=k$ ($k>0$) touches the circle $x^2+y^2=25$. Find $k$.`, 25,
    R`<p>Distance from the origin $=\dfrac{k}{5}=5$, so $k=25$.</p>`, 'Distance equals radius.', { calc: () => 25 }),
  M(2, 'chord of contact', R`The chord of contact of the point $(4,3)$ with respect to $x^2+y^2=16$ is`, '$4x+3y=16$', ['$4x+3y=25$', '$3x+4y=16$', '$4x+3y=4$'],
    R`<p>Chord of contact $T=0$: $x(4)+y(3)=16$.</p>`, 'The right side is $r^2=16$.'),
  I(2, 'radical axis', R`The radical axis of $x^2+y^2-4x=0$ and $x^2+y^2-6y=0$ passes through $(3,k)$. Find $k$.`, 2,
    R`<p>Subtract: $-4x+6y=0$, so $2x=3y$. Put $x=3$: $y=2$. So $k=2$.</p>`, 'Radical axis is $S_1-S_2=0$.', { calc: () => (2 * 3) / 3 }),
  I(2, 'common tangents', R`How many common tangents do the circles $x^2+y^2=4$ and $(x-3)^2+y^2=1$ have?`, 3,
    R`<p>Centres at distance 3, radii 2 and 1. $d=r_1+r_2$, so they touch externally: 3 common tangents.</p>`, 'Touching externally gives 3 common tangents.'),
  M(2, 'parametric form', R`On the circle $x^2+y^2=25$, the point with parameter $\theta=60^\circ$ is`, R`$\left(\dfrac52,\dfrac{5\sqrt3}{2}\right)$`, [R`$\left(\dfrac{5\sqrt3}{2},\dfrac52\right)$`, R`$\left(5,5\sqrt3\right)$`, R`$\left(\dfrac12,\dfrac{\sqrt3}2\right)$`],
    R`<p>$(r\cos\theta,r\sin\theta)=\left(5\cos60^\circ,5\sin60^\circ\right)=\left(\dfrac52,\dfrac{5\sqrt3}2\right)$.</p>`, 'Remember to multiply by $r=5$.'),
  N(2, 'chord with given mid-point', R`The chord of $x^2+y^2=25$ with mid-point $(1,2)$ meets the y-axis at a point. Find its y-coordinate.`, 2.5, 0.01,
    R`<p>Chord with mid-point $(x_1,y_1)$: $T=S_1$, i.e. $x+2y=1+4=5$.</p><p>Put $x=0$: $y=2.5$.</p>`, 'Use $T=S_1$ here, not $T=0$.', { calc: () => 5 / 2 }),
  I(2, 'diameter form', R`The circle $(x-2)(x-6)+(y-1)(y-5)=0$ has centre $(h,k)$. Find $h+k$.`, 7,
    R`<p>The ends of a diameter are $(2,1)$ and $(6,5)$. The centre is the mid-point $(4,3)$. $h+k=7$.</p>`, 'The centre is the mid-point of the diameter ends.', { calc: () => 4 + 3 }),
  M(2, 'normal', R`The normal at $(3,4)$ to the circle $x^2+y^2-2x-4y-3=0$ is`, '$x-y+1=0$', ['$x+y-7=0$', '$x-y-1=0$', '$2x+y-10=0$'],
    R`<p>Check: $9+16-6-16-3=0$, so $(3,4)$ lies on the circle. The centre is $(1,2)$. The normal passes through the centre and $(3,4)$: slope $1$, so $y-2=x-1$, i.e. $x-y+1=0$.</p><p>($x+y-7=0$ is the tangent.)</p>`, 'The normal passes through the centre; the tangent is perpendicular to it.'),
  I(2, 'concentric circles', R`The circles $x^2+y^2+kx-6y+1=0$ and $x^2+y^2-4x-6y+9=0$ are concentric. Find $k$.`, -4,
    R`<p>Centres: $\left(-\dfrac k2,3\right)$ and $(2,3)$. So $-\dfrac k2=2$ and $k=-4$.</p>`, 'Centre x-coordinate is $-k/2$.', { calc: () => -4 }),
  N(2, 'intercepts', R`Find the length of the intercept on the y-axis made by $x^2+y^2-6x-8y+9=0$. Give your answer to 2 decimal places.`, 5.29, 0.01,
    R`<p>$f=-4$, $c=9$. Intercept $=2\sqrt{f^2-c}=2\sqrt{16-9}=2\sqrt7\approx5.29$.</p>`, 'Use $f^2-c$ for the y-axis.', { calc: () => 2 * Math.sqrt(7) }),
  M(2, 'circle through points', R`The circle through $(0,0)$ and $(2,0)$ with its centre on the line $y=x$ is`, '$x^2+y^2-2x-2y=0$', ['$x^2+y^2-2x+2y=0$', '$x^2+y^2-2x-2y+2=0$', '$x^2+y^2-4x-4y=0$'],
    R`<p>The centre lies on the perpendicular bisector $x=1$ of the two points, and on $y=x$, so it is $(1,1)$. $r^2=1+1=2$.</p><p>$(x-1)^2+(y-1)^2=2$ gives $x^2+y^2-2x-2y=0$.</p>`, 'Perpendicular bisector first.'),
  I(2, 'inscribed figures', R`A square is inscribed in the circle $x^2+y^2-4x-6y-3=0$. Find its area.`, 32,
    R`<p>$r^2=4+9+3=16$. The diagonal is $2r=8$. Area of a square $=\dfrac{d^2}{2}=\dfrac{64}2=32$.</p>`, 'The diagonal equals the diameter.', { calc: () => (8 * 8) / 2 }),
  M(2, 'touching axes', R`The circle $x^2+y^2+2gx+2fy+c=0$ touches the x-axis. Then`, '$g^2=c$', ['$f^2=c$', '$g^2=f^2$', '$c=0$'],
    R`<p>Put $y=0$: $x^2+2gx+c=0$. For a circle that touches the x-axis this has equal roots: $4g^2-4c=0$, so $g^2=c$.</p><p>(The y-axis gives $f^2=c$. $c=0$ means the circle passes through the origin.)</p>`, 'The x-axis condition involves $g$, not $f$.'),

  // ---------- L3 ----------
  I(3, 'director circle', R`Tangents from a point $P$ to $x^2+y^2=9$ are perpendicular. $P$ lies on a circle $x^2+y^2=k$. Find $k$.`, 18,
    R`<p>The point lies at distance $r\sqrt2=3\sqrt2$ from the centre, so $x^2+y^2=18$.</p>`, 'The director circle has radius $r\sqrt2$, so $k=2r^2$.', { calc: () => 2 * 9 }),
  I(3, 'angle between tangents', R`Tangents are drawn from $(4,0)$ to the circle $x^2+y^2=4$. Find the angle between them in degrees.`, 60,
    R`<p>$\sin\dfrac{\theta}{2}=\dfrac rd=\dfrac24=\dfrac12$, so $\dfrac\theta2=30^\circ$ and $\theta=60^\circ$.</p>`, 'Half the angle has sine $r/d$.', { calc: () => 2 * (Math.asin(2 / 4) * 180) / Math.PI }),
  N(3, 'chord of contact', R`The tangents from $(5,0)$ to $x^2+y^2=9$ touch it at $A$ and $B$. Find the length $AB$.`, 4.8, 0.01,
    R`<p>$L=\sqrt{25-9}=4$. $AB=\dfrac{2rL}{d}=\dfrac{2\cdot3\cdot4}{5}=4.8$.</p><p>Check by chord of contact: $5x=9$, $x=1.8$; $y^2=9-3.24=5.76$, $y=\pm2.4$; $AB=4.8$.</p>`, 'Two ways agree.', { calc: () => 2 * Math.sqrt(9 - 1.8 * 1.8) }),
  N(4, 'tangent triangle', R`Tangents from $P(5,0)$ touch $x^2+y^2=9$ at $A$ and $B$. Find the area of triangle $PAB$.`, 7.68, 0.01,
    R`<p>$AB=4.8$ (chord of contact $x=1.8$). The height from $P$ to this chord is $5-1.8=3.2$.</p><p>Area $=\dfrac12\times4.8\times3.2=7.68$.</p>`, 'The chord is vertical, so the height is horizontal.', { calc: () => 0.5 * 4.8 * 3.2 }),
  M(3, 'pair of tangents', R`The pair of tangents drawn from the origin to $x^2+y^2-6x-8y+21=0$ is`, '$12x^2-24xy+5y^2=0$', ['$12x^2+24xy+5y^2=0$', '$5x^2-24xy+12y^2=0$', '$21x^2-24xy+21y^2=0$'],
    R`<p>Use $SS_1=T^2$. $S_1=21$, $T=-3x-4y+21$.</p><p>$21(x^2+y^2-6x-8y+21)=(21-3x-4y)^2=441+9x^2+16y^2-126x-168y+24xy$.</p><p>Cancel: $21x^2+21y^2=9x^2+16y^2+24xy$, so $12x^2-24xy+5y^2=0$.</p>`, 'The pair of tangents from the origin is homogeneous.'),
  I(3, 'orthogonal circles', R`The circles $x^2+y^2+4x-6y+9=0$ and $x^2+y^2-2x+2y+k=0$ cut orthogonally. Find $k$.`, -19,
    R`<p>Orthogonal: $2g_1g_2+2f_1f_2=c_1+c_2$. $g_1=2$, $f_1=-3$, $g_2=-1$, $f_2=1$.</p><p>$2(-2)+2(-3)=-10=9+k$, so $k=-19$.</p>`, 'Orthogonality uses $2(g_1g_2+f_1f_2)$.', { calc: () => 2 * (2 * -1 + -3 * 1) - 9 }),
  I(3, 'common chord', R`The circles $x^2+y^2=25$ and $x^2+y^2-16x+39=0$ meet at two points. Find the length of their common chord.`, 6,
    R`<p>Subtract: $16x-64=0$, so the common chord lies on $x=4$.</p><p>On the first circle $y^2=25-16=9$, $y=\pm3$. Length $=6$.</p>`, 'Common chord = radical axis.', { calc: () => 2 * Math.sqrt(25 - 16) }),
  M(3, 'family of circles', R`The circle through the points of intersection of $x^2+y^2=4$ and $x+y=2$ and through $(3,0)$ has centre`, R`$\left(\dfrac52,\dfrac52\right)$`, [R`$\left(\dfrac52,-\dfrac52\right)$`, '$(5,5)$', R`$\left(\dfrac32,\dfrac32\right)$`],
    R`<p>Family: $x^2+y^2-4+\lambda(x+y-2)=0$. Put $(3,0)$: $5+\lambda=0$, $\lambda=-5$.</p><p>$x^2+y^2-5x-5y+6=0$. Centre $=\left(\dfrac52,\dfrac52\right)$.</p>`, 'Find $\\lambda$ before the centre.'),
  I(3, 'locus', R`A point $P$ moves so that $PA=2PB$, where $A=(0,0)$ and $B=(3,0)$. The locus is a circle. Find its radius.`, 2,
    R`<p>$x^2+y^2=4[(x-3)^2+y^2]$ gives $3x^2+3y^2-24x+36=0$, i.e. $x^2+y^2-8x+12=0$.</p><p>Radius $=\sqrt{16-12}=2$.</p>`, 'Square both sides first.', { calc: () => Math.sqrt(16 - 12) }),
  M(3, 'locus', R`The mid-points of chords of $x^2+y^2=25$ that pass through $(4,0)$ lie on`, '$x^2+y^2-4x=0$', ['$x^2+y^2=16$', '$x^2+y^2-8x=0$', '$x^2+y^2+4x=0$'],
    R`<p>Let the mid-point be $M(h,k)$ and $O$ the centre. Then $OM\perp MP$ with $P=(4,0)$: $(h)(h-4)+k\cdot k=0$, i.e. $h^2+k^2-4h=0$.</p><p>So the locus is the circle on $OP$ as diameter: $x^2+y^2-4x=0$.</p>`, 'The angle in a semicircle is $90^\\circ$.'),
  I(3, 'chord subtending a right angle', R`The line $3x+4y=k$ ($k>0$) cuts $x^2+y^2=50$ at $A$ and $B$ with $\angle AOB=90^\circ$, where $O$ is the origin. Find $k$.`, 25,
    R`<p>Chord $AB$ subtends $90^\circ$ at the centre, so the distance from $O$ to $AB$ is $\dfrac{r}{\sqrt2}=\dfrac{\sqrt{50}}{\sqrt2}=5$.</p><p>$\dfrac{k}{5}=5$, so $k=25$.</p>`, 'Right-angled isosceles triangle $OAB$.', { calc: () => 5 * 5 }),
  M(3, 'tangent in slope form', R`The tangents to $(x-1)^2+(y-2)^2=5$ with slope 2 are`, '$y=2x\\pm5$', ['$y=2x\\pm\\sqrt5$', '$y=2x\\pm10$', '$y=2x+5$ only'],
    R`<p>Tangent with slope $m$: $y-2=m(x-1)\pm r\sqrt{1+m^2}$ with $r=\sqrt5$, $m=2$: $\pm\sqrt5\cdot\sqrt5=\pm5$.</p><p>$y-2=2(x-1)\pm5$, so $y=2x\pm5$.</p>`, 'The centre is $(1,2)$, so use $y-2=m(x-1)$.'),
  I(3, 'touching axes', R`A circle touches the x-axis at $(3,0)$ and passes through $(1,2)$. Find its radius.`, 2,
    R`<p>The centre is $(3,k)$ with $r=|k|$. $(1-3)^2+(2-k)^2=k^2$, so $4+4-4k=0$ and $k=2$. Radius $=2$.</p>`, 'The centre is directly above the point of contact.', { calc: () => 2 }),
  M(3, 'tangents from a point', R`The tangents from $(3,5)$ to $x^2+y^2=9$ are $x=3$ and`, '$8x-15y+51=0$', ['$8x+15y-99=0$', '$15x-8y+5=0$', '$5x-3y+6=0$'],
    R`<p>One tangent is $x=3$ (distance 3 from the origin). Let the other be $y-5=m(x-3)$: $mx-y+5-3m=0$.</p><p>$\dfrac{|5-3m|}{\sqrt{1+m^2}}=3$: $25-30m+9m^2=9+9m^2$, so $m=\dfrac{8}{15}$.</p><p>$15y-75=8x-24$, i.e. $8x-15y+51=0$.</p>`, 'A vertical tangent is missed when you only use $y=mx+c$.'),
  I(3, 'common tangents', R`Two circles have centres 17 apart and radii 10 and 2. Find the length of a direct common tangent.`, 15,
    R`<p>Direct tangent $=\sqrt{d^2-(r_1-r_2)^2}=\sqrt{289-64}=\sqrt{225}=15$.</p>`, 'Direct tangent uses the difference of radii.', { calc: () => Math.sqrt(289 - 64) }),
  I(3, 'common tangents', R`Two circles have centres 13 apart and radii 3 and 2. Find the length of a transverse (internal) common tangent.`, 12,
    R`<p>Transverse tangent $=\sqrt{d^2-(r_1+r_2)^2}=\sqrt{169-25}=12$.</p>`, 'Transverse tangent uses the sum of radii.', { calc: () => Math.sqrt(169 - 25) }),
  I(3, 'touching axes', R`Circles touching both axes pass through $(2,1)$. Find the sum of their radii.`, 6,
    R`<p>Centre $(r,r)$: $(2-r)^2+(1-r)^2=r^2$ gives $r^2-6r+5=0$. The roots $r=1,5$ have sum 6.</p>`, 'Sum of roots, no need to find both.', { calc: () => 6 }),
  I(3, 'invariants', R`$P$ is any point on $x^2+y^2=9$, and $A=(2,0)$, $B=(-2,0)$. Find $PA^2+PB^2$.`, 26,
    R`<p>$PA^2=(x-2)^2+y^2=13-4x$ and $PB^2=13+4x$ (using $x^2+y^2=9$). Sum $=26$.</p>`, 'The $x$-terms cancel.', { calc: () => 26 }),
  M(3, 'normals', R`Through a point $P$ (not the centre) in the plane, the number of different normals to a circle is`, '1', ['2', '4', 'infinite'],
    R`<p>Every normal of a circle passes through the centre $C$. A normal through $P$ must be the line $CP$. So only one line works. (It meets the circle at two points where it is the normal.)</p>`, 'Count lines, not points.'),
  N(3, 'parametric form', R`Find the maximum value of $x+y$ on the circle $(x-1)^2+(y+2)^2=9$. Give your answer to 2 decimal places.`, 3.24, 0.01,
    R`<p>Put $x=1+3\cos\theta$, $y=-2+3\sin\theta$. $x+y=-1+3(\cos\theta+\sin\theta)$, with maximum $-1+3\sqrt2\approx3.24$.</p>`, 'Max of $\\cos\\theta+\\sin\\theta$ is $\\sqrt2$.', { calc: () => -1 + 3 * Math.SQRT2 }),
  I(3, 'least chord', R`Find the length of the shortest chord of $x^2+y^2-2x-4y-4=0$ through the point $(2,4)$.`, 4,
    R`<p>Centre $(1,2)$, $r=3$. Distance from the centre to $(2,4)$ is $\sqrt{1+4}=\sqrt5$. The shortest chord is perpendicular to this line: $2\sqrt{r^2-5}=2\sqrt4=4$.</p>`, 'The shortest chord is perpendicular to the line from the centre.', { calc: () => 2 * Math.sqrt(9 - 5) }),
  I(3, 'radical centre', R`The circles $x^2+y^2-1=0$, $x^2+y^2-4x+3=0$ and $x^2+y^2-6y+5=0$ have radical centre $(p,q)$. Find the length of the tangent from $(p,q)$ to any of them.`, 1,
    R`<p>$S_1-S_2=4x-4=0$ gives $x=1$. $S_1-S_3=6y-6=0$ gives $y=1$. Radical centre $(1,1)$.</p><p>Tangent length $=\sqrt{S_1(1,1)}=\sqrt{1+1-1}=1$.</p>`, 'It is the same for all three circles.', { calc: () => Math.sqrt(1 + 1 - 1) }),
  M(3, 'position of a line', R`The line $y=x+1$ with respect to the circle $x^2+y^2=1$`, 'cuts the circle at two points', ['touches the circle', 'misses the circle', 'passes through the centre'],
    R`<p>Distance of the origin from $x-y+1=0$ is $\dfrac{1}{\sqrt2}\approx0.71<1$. So it cuts the circle at two points $(0,1)$ and $(-1,0)$.</p>`, 'Compare the distance with the radius.'),
  I(3, 'mixed: complex numbers', R`The locus of $z$ with $|z-1|=2|z+2|$ is a circle. Find its radius.`, 2,
    R`<p>Put $z=x+iy$: $(x-1)^2+y^2=4[(x+2)^2+y^2]$, so $3x^2+3y^2+18x+15=0$, i.e. $x^2+y^2+6x+5=0$.</p><p>$r=\sqrt{9-5}=2$.</p>`, 'Same Apollonius idea as the point locus.', { sub: 'mixed', calc: () => Math.sqrt(9 - 5) }),
  M(3, 'mixed: parabola', R`A circle passes through $(0,2)$ and touches the x-axis. The locus of its centre is`, '$x^2=4y-4$', ['$x^2=4y+4$', '$y^2=4x-4$', '$x^2+y^2=4$'],
    R`<p>Let the centre be $(h,k)$. It touches the x-axis, so $r=|k|$. Passing through $(0,2)$: $h^2+(2-k)^2=k^2$, so $h^2=4k-4$.</p><p>The locus is $x^2=4y-4$, a parabola.</p>`, 'Distance to the point equals the distance to the line.', { sub: 'mixed' }),
  M(3, 'smallest tangent length', R`The length of the tangent from the point $(h,0)$ on the x-axis to $x^2+y^2=4$ is 5. Then $h=$`, R`$\pm\sqrt{29}$`, ['$\\pm5$', '$\\pm\\sqrt{21}$', '$\\pm3$'],
    R`<p>$L^2=h^2-4=25$, so $h^2=29$ and $h=\pm\sqrt{29}$.</p>`, 'Square the length: $25$, then add the radius squared.'),
  I(3, 'mixed: straight lines', R`The sides of a triangle lie along $x=0$, $y=0$ and $3x+4y=12$. Find the radius of its incircle.`, 1,
    R`<p>Right triangle with legs 4 and 3 and hypotenuse 5. $r=\dfrac{a+b-c}{2}=\dfrac{4+3-5}2=1$. (Check: centre $(1,1)$ is at distance $\dfrac{|3+4-12|}{5}=1$ from the line.)</p>`, 'The incentre of a right triangle at the origin is $(r,r)$.', { sub: 'mixed', calc: () => (4 + 3 - 5) / 2 }),
  M(3, 'circle through three points', R`The circle through $(1,0)$, $(0,1)$ and $(1,1)$ has centre`, R`$\left(\dfrac12,\dfrac12\right)$`, ['$(1,1)$', '$(0,0)$', R`$\left(1,\dfrac12\right)$`],
    R`<p>The three points are three corners of the unit square. The right angle is at $(1,1)$ and the hypotenuse is from $(1,0)$ to $(0,1)$, a diameter. Centre $=\left(\dfrac12,\dfrac12\right)$.</p>`, 'A right angle is inscribed in a semicircle.'),
  I(3, 'pair of tangents', R`How many tangents can be drawn from $(3,4)$ to the circle $x^2+y^2=25$?`, 1,
    R`<p>$S_1=9+16-25=0$, so the point lies on the circle. Only one tangent: $3x+4y=25$.</p>`, 'On the circle gives one tangent, outside two, inside none.'),
  I(3, 'equation of circle', R`The circle with intercepts 4 and 6 on the x-axis and y-axis (measured from the origin, through the origin) is $x^2+y^2-ax-by=0$. Find $a+b$.`, 10,
    R`<p>A circle through the origin meeting the axes again at $(4,0)$ and $(0,6)$ is $x^2+y^2-4x-6y=0$. So $a=4$, $b=6$ and $a+b=10$.</p>`, 'The intercepts are the sums of roots.', { calc: () => 4 + 6 }),

  // ---------- L4 ----------
  I(4, 'family of circles', R`The smallest circle that passes through the intersection points of $x^2+y^2-4x-6y-12=0$ and the line $x+y-1=0$ has radius squared equal to`, 17,
    R`<p>The smallest circle has the common chord as diameter, so its centre lies on the line. Family: $x^2+y^2-4x-6y-12+\lambda(x+y-1)=0$. Centre $\left(\dfrac{4-\lambda}2,\dfrac{6-\lambda}2\right)$ on $x+y=1$: $5-\lambda=1$, $\lambda=4$.</p><p>Circle: $x^2+y^2-2y-16=0$, $r^2=1+16=17$.</p><p>Check: distance of $(2,3)$ from the line is $2\sqrt2$, half-chord$^2=25-8=17$.</p>`, 'Centre on the common chord.', { calc: () => 1 + 16 }),
  I(4, 'tangent at a given point', R`A circle touches the line $x-y=0$ at $(1,1)$ and passes through $(3,1)$. Find the x-coordinate of its centre.`, 2,
    R`<p>Family of circles touching $L$ at $P$: $(x-1)^2+(y-1)^2+\lambda(x-y)=0$. Put $(3,1)$: $4+2\lambda=0$, $\lambda=-2$.</p><p>$x^2+y^2-4x+2=0$. Centre $(2,0)$.</p>`, 'A point circle plus $\\lambda$ times the tangent.', { calc: () => 2 }),
  I(4, 'two circles', R`Circles of radius 3 and $r$ have their centres 10 apart. For how many positive integers $r$ do the circles have exactly two common tangents?`, 5,
    R`<p>Exactly two common tangents means the circles cut at two points: $|r-3|<10<r+3$.</p><p>$r+3>10$ gives $r>7$. $|r-3|<10$ gives $r<13$. So $r=8,9,10,11,12$: five values.</p>`, 'Check the ends: 7 and 13 give touching.', { calc: () => [...Array(40).keys()].filter((r) => r > 0 && Math.abs(r - 3) < 10 && 10 < r + 3).length }),
  N(4, 'orthogonal circles', R`Two circles of radii 5 and 12 cut each other orthogonally. Find the length of their common chord to 2 decimal places.`, 9.23, 0.01,
    R`<p>Orthogonal: $d^2=5^2+12^2=169$, $d=13$. The radii to a common point form a right triangle with legs 5, 12; the common chord is twice the altitude to the hypotenuse.</p><p>Altitude $=\dfrac{5\cdot12}{13}$, chord $=\dfrac{120}{13}\approx9.23$.</p>`, 'Twice the altitude, not the altitude.', { calc: () => 120 / 13 }),
  N(4, 'locus of tangent lengths', R`The tangent length from $P$ to $x^2+y^2=1$ is twice the tangent length from $P$ to $x^2+y^2-4x+3=0$. The locus of $P$ is a circle. Find its radius to 2 decimal places.`, 1.67, 0.01,
    R`<p>$S_1=4S_2$: $x^2+y^2-1=4(x^2+y^2-4x+3)$, so $3x^2+3y^2-16x+13=0$, i.e. $x^2+y^2-\dfrac{16}3x+\dfrac{13}3=0$.</p><p>$r^2=\dfrac{64}9-\dfrac{13}3=\dfrac{25}{9}$, $r=\dfrac53\approx1.67$.</p>`, 'Square the lengths: $L_1^2=4L_2^2$.', { calc: () => 5 / 3 }),
  N(4, 'fixed point of chords of contact', R`Tangents are drawn to $x^2+y^2=25$ from points on the line $3x+4y=50$. Every chord of contact passes through a fixed point $(p,q)$. Find $p+q$.`, 3.5, 0.01,
    R`<p>For $P(x_1,y_1)$ the chord of contact is $x_1x+y_1y=25$. Since $P$ is on the line, $3x_1+4y_1=50$; divide by 2: $\dfrac32x_1+2y_1=25$.</p><p>This says that $(x,y)=\left(\dfrac32,2\right)$ satisfies the chord of contact for every such $P$. So the fixed point is $\left(\dfrac32,2\right)$ and $p+q=3.5$.</p>`, 'Divide the line by 2 to get 25 on the right.', { calc: () => 1.5 + 2 }),
  I(4, 'locus from tangency', R`Circles touch the circle $x^2+y^2=1$ externally and the line $x=3$. The locus of their centres is a parabola. Find the length of its latus rectum.`, 8,
    R`<p>Let the centre be $(h,k)$ with radius $r=3-h$. External contact: $\sqrt{h^2+k^2}=1+r=4-h$. So $h^2+k^2=(4-h)^2$ and $k^2=16-8h$.</p><p>$y^2=-8(x-2)$. Latus rectum $=8$. (Equivalently the focus is $(0,0)$ and the directrix is $x=4$.)</p>`, 'The centre is the same distance from a point and a line.', { sub: 'mixed', calc: () => 8 }),
  M(4, 'two circles', R`The circles $x^2+y^2-2x-4y-4=0$ and $x^2+y^2+6x+4y-12=0$ have`, '2 common tangents', ['3 common tangents', '4 common tangents', '1 common tangent'],
    R`<p>Centres $(1,2)$ and $(-3,-2)$, so $d=\sqrt{16+16}=4\sqrt2\approx5.66$. Radii: $r_1=3$, $r_2=\sqrt{9+4+12}=5$.</p><p>$r_1+r_2=8$, $r_2-r_1=2$. Since $2<5.66<8$, the circles cut at two points: 2 common tangents.</p>`, 'Compute $d$ before comparing.'),
  I(4, 'orthogonal circles', R`A circle with centre $(3,4)$ and radius $r$ cuts $x^2+y^2=16$ orthogonally. Find $r$.`, 3,
    R`<p>Orthogonal: $d^2=r_1^2+r_2^2$. $d^2=25$, $r_1^2=16$. So $r^2=9$ and $r=3$.</p>`, 'Radii squared add up to $d^2$.', { calc: () => Math.sqrt(25 - 16) }),
  I(4, 'chord of contact', R`The chord of contact of $P(h,k)$ with respect to $x^2+y^2=4$ touches the circle $x^2+y^2=1$. If $P$ lies on the line $y=0$ with $h>0$, find $h$.`, 4,
    R`<p>Chord of contact: $hx=4$, i.e. $x=\dfrac4h$. This touches the unit circle when $\dfrac4h=1$, so $h=4$.</p>`, 'Distance from the origin to $x=4/h$ is $4/h$.', { calc: () => 4 }),
  M(4, 'tangent conditions', R`For the line $y=mx+c$ to be a tangent to $(x-a)^2+(y-b)^2=r^2$, the condition is`, '$(ma-b+c)^2=r^2(1+m^2)$', ['$(ma-b+c)^2=r^2$', '$(ma+b+c)^2=r^2(1+m^2)$', '$(mb-a+c)^2=r^2(1+m^2)$'],
    R`<p>The line is $mx-y+c=0$. Distance from $(a,b)$ is $\dfrac{|ma-b+c|}{\sqrt{1+m^2}}=r$. Square it.</p>`, 'Keep $-b$, not $+b$.'),
  X(4, 'tangents', R`Which of the following lines touch the circle $x^2+y^2-2x-4y+1=0$?`, ['$x=0$', '$y=0$', '$y=4$', '$x=2$'], [1, 2],
    R`<p>Centre $(1,2)$, $r^2=1+4-1=4$, so $r=2$. A line touches when its distance from the centre is 2.</p><p>$x=0$: distance 1, cuts. $y=0$: distance 2, touches. $y=4$: distance 2, touches. $x=2$: distance 1, cuts.</p>`, 'Compare each distance with $r=2$, not with 1.'),
  N(4, 'touching axes', R`Two circles touch both axes and pass through $(2,1)$. Find the distance between their centres to 2 decimal places.`, 5.66, 0.01,
    R`<p>Centres $(1,1)$ and $(5,5)$ (radii 1 and 5). Distance $=\sqrt{16+16}=4\sqrt2\approx5.66$.</p>`, 'Roots 1 and 5 from $r^2-6r+5=0$.', { calc: () => Math.sqrt(32) }),
  N(4, 'angle between circles', R`Circles of radii 4 and 5 have centres $\sqrt{21}$ apart. They intersect at an angle $\phi$ (the angle between the radii at a common point). Find $\phi$ in degrees.`, 60, 0.01,
    R`<p>In the triangle with sides $4$, $5$, $\sqrt{21}$ at the common point: $\cos\phi=\dfrac{16+25-21}{2\cdot4\cdot5}=\dfrac{20}{40}=\dfrac12$, so $\phi=60^\circ$.</p>`, 'Use the cosine rule on the triangle of the two radii and the line of centres.', { calc: () => (Math.acos(0.5) * 180) / Math.PI }),
  I(4, 'parametric form', R`Find the maximum value of $3x+4y$ on the circle $(x-2)^2+(y-1)^2=25$.`, 35,
    R`<p>$3x+4y=3(2+5\cos\theta)+4(1+5\sin\theta)=10+5(3\cos\theta+4\sin\theta)$. The maximum of $3\cos\theta+4\sin\theta$ is 5, so the answer is $10+25=35$.</p>`, 'Add the value at the centre, $3(2)+4(1)=10$.', { calc: () => 10 + 5 * 5 }),
  I(4, 'smallest and largest distance', R`A point $P$ moves on the circle $x^2+y^2=25$ and $Q=(6,8)$. Find the product of the largest and smallest values of $PQ$.`, 75,
    R`<p>$OQ=10$. Largest $PQ=15$, smallest $=5$. Product $=75$.</p>`, 'Largest is $d+r$, smallest is $d-r$.', { calc: () => (10 + 5) * (10 - 5) }),
  I(4, 'chord midpoint', R`Chords of $x^2+y^2=100$ pass through $(6,8)$. The locus of their mid-points is a circle. Find its radius.`, 5,
    R`<p>The mid-point $M$ satisfies $OM\perp MP$ where $P=(6,8)$, so $M$ lies on the circle with $OP$ as diameter. $OP=10$, so the radius is 5.</p>`, '$P$ lies on the circle $x^2+y^2=100$ here (on it, not inside).', { calc: () => 10 / 2 }),
  I(4, 'chord with given mid-point', R`The chord of $x^2+y^2-6x+4y-12=0$ whose mid-point is $(2,-1)$ is $x-y=k$. Find $k$.`, 3,
    R`<p>$T=S_1$: $2x-y-3(x+2)+2(y-1)-12=4+1-12-4-12$, i.e. $-x+y-20=-23$.</p><p>So $x-y=3$ and $k=3$. (Check: the centre $(3,-2)$ to $(2,-1)$ has slope $-1$, so the chord has slope $1$.)</p>`, 'Use $T=S_1$, because the mid-point is inside.', { calc: () => 3 }),
  N(4, 'family of circles', R`A circle passes through the common points of $x^2+y^2=4$ and $x^2+y^2-2x-2y=0$ and through $(1,0)$. Find its radius squared.`, 2.5, 0.01,
    R`<p>Family: $S_1+\lambda S_2=0$. At $(1,0)$: $S_1=-3$, $S_2=-1$, so $-3-\lambda=0$ and $\lambda=-3$.</p><p>$x^2+y^2-4-3(x^2+y^2-2x-2y)=0$ gives $-2x^2-2y^2+6x+6y-4=0$, i.e. $x^2+y^2-3x-3y+2=0$.</p><p>$r^2=\dfrac94+\dfrac94-2=\dfrac52=2.5$. (Check with the common points $(2,0)$ and $(0,2)$: both satisfy it.)</p>`, 'A family $S_1+\lambda S_2$ is a circle only if $\lambda\ne-1$.', { calc: () => 9 / 4 + 9 / 4 - 2 }),
  I(4, 'circle touching a line at a point', R`A circle touches the line $y=x$ at the origin and passes through $(4,2)$. Find the y-coordinate of its centre.`, -5,
    R`<p>Family touching $y=x$ at the origin: $x^2+y^2+\lambda(x-y)=0$. Put $(4,2)$: $20+2\lambda=0$, $\lambda=-10$.</p><p>$x^2+y^2-10x+10y=0$. Centre $(5,-5)$.</p><p>Check: distance from $(5,-5)$ to $y=x$ is $\dfrac{10}{\sqrt2}=\sqrt{50}=r$.</p>`, 'The centre lies on the normal $y=-x$, not $y=x$.', { calc: () => -5 }),

  // ---------- assertion-reason ----------
  A(2, 'condition for a circle', R`The equation $x^2+y^2+2x+4y+10=0$ does not represent a real circle.`, R`For $x^2+y^2+2gx+2fy+c=0$ the radius squared is $g^2+f^2-c$, which here is $1+4-10<0$.`, 0,
    R`<p>$g=1$, $f=2$, $c=10$, so $r^2=1+4-10=-5<0$. No real point satisfies the equation. A is true and R gives exactly the reason.</p>`, 'Radius squared must be positive.'),
  A(3, 'common tangents', R`Two circles that touch internally have exactly one common tangent.`, R`At the point of contact, the common tangent is also the radical axis of the two circles.`, 0,
    R`<p>Touching internally: $d=|r_1-r_2|$. The circles meet at one point and the only line touching both is the tangent at that point. That tangent is also the radical axis (the common chord shrinks to a point). So A is true, R is true and R explains why only one line is common.</p>`, 'Touching internally gives 1, externally 3.'),
  A(3, 'length of tangent', R`No tangent can be drawn from a point inside a circle.`, R`For a point inside, $S_1<0$, so $\sqrt{S_1}$, the "length of the tangent", is not real.`, 0,
    R`<p>A line through an inside point must cut the circle at two points. So no tangent exists, and A is true. R states $S_1<0$ inside, so $L=\sqrt{S_1}$ is imaginary: this is exactly the algebraic reason.</p>`, 'Inside means $S_1<0$.'),
  A(3, 'common tangents', R`Two circles with no common point always have exactly 4 common tangents.`, R`Two circles that lie outside each other have 2 direct and 2 transverse common tangents.`, 3,
    R`<p>R is true: for separate circles (one outside the other) there are 2 direct and 2 transverse tangents. But "no common point" also covers one circle inside the other, which has 0 common tangents. So A is false.</p>`, 'Nested circles also have no common point.'),
  A(4, 'pair of tangents', R`The pair of tangents from the origin to $x^2+y^2-6x-8y+21=0$ is $12x^2-24xy+5y^2=0$.`, R`The pair of tangents from $(x_1,y_1)$ to $S=0$ is $SS_1=T^2$.`, 0,
    R`<p>With $S_1=21$ and $T=21-3x-4y$: $21(x^2+y^2-6x-8y+21)=(21-3x-4y)^2$ gives $12x^2-24xy+5y^2=0$. So A is true, and it was found by using R.</p>`, 'Expand carefully; the linear terms cancel.'),
  A(3, 'radical axis', R`Two distinct concentric circles have no radical axis.`, R`For concentric circles $S_1-S_2=c_1-c_2$, a non-zero constant, which cannot equal 0.`, 0,
    R`<p>The radical axis is $S_1-S_2=0$. For concentric circles the $x$ and $y$ terms cancel, leaving $c_1-c_2=0$, which is false. So no points have equal power: no radical axis. R is the reason.</p>`, 'The line "at infinity" is not a real line.'),
  A(3, 'circle through points', R`A circle can be drawn through any three given points.`, R`Three non-collinear points lie on exactly one circle.`, 3,
    R`<p>R is true. A is false: three collinear points (for example $(0,0)$, $(1,1)$, $(2,2)$) lie on no circle.</p>`, 'Check collinearity.'),
  A(4, 'two circles', R`The circles $x^2+y^2-2x=0$ and $x^2+y^2+2x=0$ touch each other.`, R`The centres of both circles lie on the x-axis.`, 1,
    R`<p>Centres $(1,0)$ and $(-1,0)$, radii 1 and 1. $d=2=r_1+r_2$, so they touch externally: A is true. R is also true but it does not explain the touching: the centres lie on the x-axis for many pairs that do not touch.</p>`, 'True statements need not explain each other.'),
  A(3, 'chord of contact', R`The chord of contact of a point on the circle is the tangent at that point.`, R`The chord of contact is $T=0$, which for a point on the circle becomes the tangent equation.`, 0,
    R`<p>If $P(x_1,y_1)$ is on the circle, the two tangents from $P$ coincide, so the chord of contact is that tangent. Algebraically $T=0$ is the tangent at $(x_1,y_1)$. R explains A.</p>`, 'The two points of contact merge into one.'),
  A(4, 'tangent', R`The tangent at $(a\cos\theta,a\sin\theta)$ to $x^2+y^2=a^2$ is $x\cos\theta+y\sin\theta=a$.`, R`A tangent to a circle is parallel to the radius through the point of contact.`, 2,
    R`<p>A is true: $xx_1+yy_1=a^2$ with $x_1=a\cos\theta$, $y_1=a\sin\theta$ gives $x\cos\theta+y\sin\theta=a$. R is false: the tangent is perpendicular to the radius.</p>`, 'Perpendicular, not parallel.'),
  A(5, 'touching axes', R`Exactly one circle touches both axes and passes through $(1,1)$.`, R`A circle touching both axes in the first quadrant has its centre at $(r,r)$.`, 3,
    R`<p>R is true. With centre $(r,r)$ through $(1,1)$: $2(1-r)^2=r^2$, so $r^2-4r+2=0$ and $r=2\pm\sqrt2$. There are two such circles, so A is false.</p>`, 'Count the roots of the quadratic in $r$.'),

  // ---------- statements ----------
  S(2, 'tangent condition', R`The line $y=x+4$ touches the circle $x^2+y^2=8$.`, R`The distance of the origin from $y=x+4$ equals $2\sqrt2$, the radius.`, 0,
    R`<p>Distance $=\dfrac{4}{\sqrt2}=2\sqrt2=\sqrt8=r$. So the line touches the circle and both statements are true.</p>`, 'Radius is $\\sqrt8=2\\sqrt2$.'),
  S(3, 'orthogonal circles', R`Two circles of equal radii cannot cut orthogonally.`, R`The circles with centres $(0,0)$ and $(1,1)$ and each of radius 1 cut orthogonally.`, 2,
    R`<p>Orthogonal means $d^2=r_1^2+r_2^2$. For the circles in II: $d^2=2=1+1$, so they are orthogonal: II is true. That shows I is false (equal radii can cut orthogonally when $d=r\sqrt2$).</p>`, 'Equal radii still allow $d^2=2r^2$.'),
  S(3, 'common tangents', R`The circles $x^2+y^2=1$ and $x^2+y^2-6x-8y+9=0$ have exactly 3 common tangents.`, R`The two circles touch internally.`, 1,
    R`<p>Second circle: centre $(3,4)$, $r^2=9+16-9=16$, $r=4$. Distance between centres $=5=1+4$. So they touch externally, giving 3 common tangents. Statement I is true; II is false.</p>`, 'Compare $d$ with the sum, not the difference.'),
  S(3, 'radical axis', R`The radical axis of $x^2+y^2=4$ and $x^2+y^2=9$ is the line $x=0$.`, R`The origin has equal power with respect to both circles.`, 3,
    R`<p>These circles are concentric: $S_1-S_2=5$, never zero, so no radical axis exists. I is false. Power of the origin: $-4$ and $-9$, not equal, so II is false.</p>`, 'Concentric circles have no radical axis.'),
  SC(3, 'radical axis', [R`The radical axis of two intersecting circles is their common chord.`, R`The radical axis is perpendicular to the line joining the centres.`, R`Any two circles have a radical axis.`, R`The length of the tangent from any point $P$ to a circle $S=0$ is $\sqrt{S_1}$.`], '2', ['0', '1', '3'],
    R`<p>(1) True. (2) True. (3) False: concentric circles have none. (4) False: for a point inside the circle $S_1<0$ and there is no tangent. Two statements are correct.</p>`, 'Check the special cases.'),
  SC(3, 'condition for a circle', [R`$x^2+y^2+2x+2y+2=0$ is a point circle.`, R`$x^2+y^2-2x+4=0$ has no real points.`, R`$x^2+y^2-6x+5=0$ touches the y-axis.`, R`$2x^2+2y^2-4x-8y+2=0$ has centre $(1,2)$.`], '3', ['1', '2', '4'],
    R`<p>(1) $r^2=1+1-2=0$, true. (2) $(x-1)^2+y^2=-3$, true. (3) False: at $x=0$ we get $y^2+5=0$, no real point, so it does not even meet the y-axis. (4) Divide by 2: $x^2+y^2-2x-4y+1=0$, centre $(1,2)$, true. Three are correct.</p>`, 'Divide by the coefficient of $x^2$.'),
  SC(4, 'tangents and normals', [R`The normal at any point of a circle passes through the centre.`, R`The tangents at the ends of a diameter are parallel.`, R`The length of the tangent from an external point $P$ equals $PC-r$.`, R`The chord of contact of $P$ is perpendicular to $CP$.`, R`From an external point exactly two tangents can be drawn.`], '4', ['2', '3', '5'],
    R`<p>(1), (2), (4) and (5) are true. (3) is false: the length is $\sqrt{PC^2-r^2}$, and $PC-r$ is only the shortest distance to the circle. So 4.</p>`, 'Tangent length uses Pythagoras.'),
  SC(4, 'common tangents', [R`Two circles touching externally have 3 common tangents.`, R`Concentric circles have no common tangent.`, R`Two circles meeting at two points have exactly 2 common tangents.`, R`One circle inside another without touching has exactly 1 common tangent.`], '3', ['1', '2', '4'],
    R`<p>(1), (2), (3) are true. (4) is false: a circle strictly inside another has 0 common tangents (touching internally gives 1). So 3.</p>`, 'Count carefully for nested circles.'),

  // ---------- multi ----------
  X(3, 'condition for a circle', R`Which of the following equations represent a circle of non-zero real radius?`, ['$x^2+y^2-2x-2y+2=0$', '$x^2+y^2+2x+2y-2=0$', '$3x^2+3y^2-6x+9y=0$', '$x^2+y^2+xy-4=0$'], [1, 2],
    R`<p>(A) $(x-1)^2+(y-1)^2=0$: a point circle, radius 0. (B) $r^2=1+1+2=4$: a circle. (C) $x^2+y^2-2x+3y=0$, $r^2=1+\dfrac94>0$: a circle. (D) has an $xy$ term, so it is not a circle.</p>`, 'A point circle has zero radius.'),
  X(4, 'radical axis', R`Two circles intersect at two points. Which statements about their radical axis are true?`, ['It is the line through the common points.', 'It is perpendicular to the line joining the centres.', 'Tangents from any point of it to the two circles are equal in length.', 'It always passes through both centres.'], [0, 1, 2],
    R`<p>(A), (B) and (C) are true by definition ($S_1=S_2$ means equal tangent lengths). (D) is false: it passes through a centre only in special cases.</p>`, 'Equal power means equal tangent lengths.'),
  X(4, 'tangent condition', R`Which lines touch the circle $x^2+y^2=25$?`, ['$3x+4y=25$', '$x+y=5$', '$x+y=5\\sqrt2$', '$y=-5$'], [0, 2, 3],
    R`<p>Distance from the origin must be 5. $3x+4y=25$: $25/5=5$. $x+y=5$: $5/\sqrt2\approx3.54$, so it cuts. $x+y=5\sqrt2$: $5\sqrt2/\sqrt2=5$. $y=-5$: 5.</p>`, '$x+y=5$ is a trap: divide by $\\sqrt2$.'),
  X(4, 'position', R`For the circle $x^2+y^2-6x-8y+9=0$, which are true?`, ['It touches the x-axis.', 'It touches the y-axis.', 'The length of the tangent from the origin is 3.', 'The origin lies inside the circle.'], [0, 2],
    R`<p>Centre $(3,4)$, $r=\sqrt{9+16-9}=4$. Distance from the centre to the x-axis is 4, equal to $r$: touches. To the y-axis is 3, less than 4: cuts. $S_1(0,0)=9>0$: the origin is outside, tangent length 3.</p>`, 'Compare each axis distance with $r=4$.'),
  X(5, 'common tangents', R`Consider the circles $x^2+y^2=1$ and $x^2+y^2-6x+8=0$. Which are true?`, ['They have exactly 4 common tangents.', 'Their radical axis is $x=\\dfrac32$.', 'The transverse common tangents meet at $\\left(\\dfrac32,0\\right)$.', 'The direct common tangents meet at $(3,0)$.'], [0, 1, 2],
    R`<p>Second circle: centre $(3,0)$, $r=1$. $d=3>2$, so 4 common tangents. Radical axis: $S_1-S_2=6x-9=0$, $x=\dfrac32$. Transverse tangents meet at the point dividing the centres internally in the ratio of radii, $1:1$: the mid-point $\left(\dfrac32,0\right)$. The direct tangents are parallel (equal radii) and do not meet, so D is false.</p>`, 'Equal radii make the direct tangents parallel.'),
  X(5, 'touching axes', R`Which circles touch both axes and pass through $(1,2)$?`, ['$(x-1)^2+(y-1)^2=1$', '$(x-2)^2+(y-2)^2=4$', '$(x-5)^2+(y-5)^2=25$', '$(x-3)^2+(y-3)^2=9$'], [0, 2],
    R`<p>Centre $(r,r)$ and $(1-r)^2+(2-r)^2=r^2$ gives $r^2-6r+5=0$, so $r=1$ or $5$. Test (B): $(1-2)^2+(2-2)^2=1\ne4$. Test (D): $4+1=5\ne9$.</p>`, 'Test each option by substituting the point.'),

  // ---------- match ----------
  MT(2, 'centre of a circle', 'm1', R`Match each circle with its centre.`, 'A-q, B-r, C-p, D-s', ['A-r, B-q, C-p, D-s', 'A-q, B-r, C-s, D-p', 'A-p, B-q, C-r, D-s'],
    R`<p>A: $(2,-3)$ (q). B: $(-4,0)$ (r). C: $(0,5)$ (p). D: divide by 2 to get $x^2+y^2+3x-2y=0$, centre $\left(-\dfrac32,1\right)$ (s).</p>`, 'Divide by the leading coefficient first.'),
  MT(3, 'common tangents', 'm2', R`Match each pair of circles with the number of common tangents.`, 'A-s, B-r, C-q, D-p', ['A-s, B-q, C-r, D-p', 'A-r, B-s, C-q, D-p', 'A-s, B-r, C-p, D-q'],
    R`<p>A: $d=5>1+1$, separate: 4. B: $d=5=2+3$, external touch: 3. C: $d=1=3-2$, internal touch: 1. D: $d=1<5-2=3$, one inside the other: 0.</p>`, 'Compare $d$ with $r_1+r_2$ and $|r_1-r_2|$.'),
  MT(3, 'position of a line', 'm3', R`Match each line with how it meets $x^2+y^2=25$.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
    R`<p>A: distance $\dfrac{25}5=5$: touches. B: through the centre, a diameter. C: distance $\dfrac{50}{5}=10>5$: misses. D: distance 3 from the centre, a chord that is not a diameter.</p>`, 'Compare distance with 5.'),
  MT(4, 'locus', 'm4', R`Match each locus with the radius of the circle it gives.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    R`<p>A: $x^2+y^2-8x+12=0$, radius 2. B: circle on $OP$ as diameter, $OP=10$, radius 5. C: $2(x^2+y^2)+18=50$ gives $x^2+y^2=16$, radius 4. D: the centre is at distance $3-2=1$ from the origin: radius 1.</p>`, 'Inside contact uses the difference of radii.'),

  // ---------- passages ----------
  PI(3, 'tangent length', 'p1', R`Find the length $OA$ of a tangent.`, 3,
    R`<p>$S_1=9$ at the origin, so $OA=\sqrt9=3$.</p>`, 'Put the origin into the equation: only the constant remains.', { calc: () => Math.sqrt(9) }),
  PI(3, 'quadrilateral', 'p1', R`Find the area of the quadrilateral $OAKB$.`, 12,
    R`<p>$K=(3,4)$, $r=4$. $OA=3$ and $KA=4$ with a right angle at $A$. Area of one triangle $=\dfrac12\cdot3\cdot4=6$. Two of them: $12$.</p>`, 'Two right triangles.', { calc: () => 2 * 0.5 * 3 * 4 }),
  PN(4, 'chord of contact', 'p1', R`Find the length of $AB$.`, 4.8, 0.01,
    R`<p>$OK=5$. $AB=\dfrac{2\cdot OA\cdot KA}{OK}=\dfrac{2\cdot3\cdot4}{5}=4.8$. (Check: $T=0$ gives $3x+4y=9$; the distance from $K$ is $\dfrac{16}5$ and $AB=2\sqrt{16-\frac{256}{25}}=\dfrac{24}5$.)</p>`, 'The altitude of the right triangle is $\\dfrac{OA\\cdot KA}{OK}$.', { calc: () => 2 * Math.sqrt(16 - 256 / 25) }),
  PI(2, 'common tangents', 'p2', R`How many common tangents do $C_1$ and $C_2$ have?`, 2,
    R`<p>$C_1$: centre $(2,2)$, $r=2$. $C_2$: centre $(4,4)$, $r^2=16+16-28=4$, $r=2$. $d=2\sqrt2\approx2.83$ and $0<d<4$: the circles cut at two points, so 2 common tangents.</p>`, 'Equal radii with $d<4$ cross.'),
  PI(3, 'radical axis', 'p2', R`The common chord of the circles lies on $x+y=k$. Find $k$.`, 6,
    R`<p>$S_1-S_2=(-4x-4y+4)-(-8x-8y+28)=4x+4y-24=0$, so $x+y=6$.</p>`, 'Subtract the equations.', { calc: () => 24 / 4 }),
  PN(4, 'common chord', 'p2', R`Find the length of the common chord, to 2 decimal places.`, 2.83, 0.01,
    R`<p>The distance from $(2,2)$ to $x+y=6$ is $\dfrac{|2+2-6|}{\sqrt2}=\sqrt2$. Half-chord $=\sqrt{4-2}=\sqrt2$. Chord $=2\sqrt2\approx2.83$.</p>`, 'Use the radius of one circle only.', { calc: () => 2 * Math.sqrt(2) }),
  PI(2, 'locus', 'p3', R`Find the x-coordinate of the centre of $\Gamma$.`, 4,
    R`<p>$x^2+y^2=4[(x-3)^2+y^2]$ gives $x^2+y^2-8x+12=0$. Centre $(4,0)$.</p>`, 'Expand, then halve the x-coefficient.', { calc: () => 8 / 2 }),
  PI(3, 'locus', 'p3', R`Find the radius of $\Gamma$.`, 2,
    R`<p>$r=\sqrt{16-12}=2$. (Check: the points $(2,0)$ and $(6,0)$ lie on the locus: $2=2\cdot1$ and $6=2\cdot3$.)</p>`, 'Check using points on the x-axis.', { calc: () => Math.sqrt(4) }),
  PI(4, 'locus', 'p3', R`What is the largest distance from $A$ to a point of $\Gamma$?`, 6,
    R`<p>The centre is at distance 4 from $A$ and the radius is 2, so the largest distance is $4+2=6$.</p>`, 'Distance to the centre plus the radius.', { calc: () => 4 + 2 }),

  // ---------- more L3 to L5 ----------
  N(3, 'tangent at a point', R`The tangent at $(3,4)$ to $x^2+y^2=25$ and the axes form a triangle. Find its area to 2 decimal places.`, 26.04, 0.01,
    R`<p>Tangent: $3x+4y=25$. Intercepts $\dfrac{25}3$ and $\dfrac{25}4$. Area $=\dfrac12\cdot\dfrac{25}3\cdot\dfrac{25}4=\dfrac{625}{24}\approx26.04$.</p>`, 'Intercept form: $x/a+y/b=1$.', { calc: () => 0.5 * (25 / 3) * (25 / 4) }),
  N(3, 'director circle', R`Tangents are drawn to $x^2+y^2=4$ from points of $x^2+y^2=16$. Find the area of the quadrilateral formed by one such point $P$, the two points of contact and the centre. Give your answer to 2 decimal places.`, 6.93, 0.01,
    R`<p>$OP=4$, $r=2$, so the tangent length is $\sqrt{16-4}=2\sqrt3$. The kite $OAPB$ has area $r\cdot L=2\cdot2\sqrt3=4\sqrt3\approx6.93$.</p>`, 'Area of the kite is $r\\times L$.', { calc: () => 4 * Math.sqrt(3) }),
  N(4, 'common tangents', R`The circles $x^2+y^2=9$ and $(x-12)^2+(y-5)^2=4$ have their transverse common tangents meeting at the point $(p,q)$. Find $p$.`, 7.2, 0.01,
    R`<p>The transverse tangents meet at the point dividing the line of centres internally in the ratio of the radii $3:2$ from the first centre.</p><p>$p=\dfrac{3\cdot12+2\cdot0}{5}=7.2$ and $q=3$.</p>`, 'The ratio is $r_1:r_2$, measured from the first centre.', { calc: () => 36 / 5 }),
  I(5, 'common tangents', R`The circles $x^2+y^2=9$ and $(x-12)^2+(y-5)^2=4$ have direct common tangents meeting at $(p,q)$. Find $p+q$.`, 51,
    R`<p>The direct tangents meet at the external centre of similitude, dividing the centres externally in the ratio $3:2$.</p><p>$P=\dfrac{3(12,5)-2(0,0)}{3-2}=(36,15)$. Check: $PC_1=39$ and $PC_2=26$, ratio $3:2$. So $p+q=51$.</p>`, 'External division uses a minus sign.', { calc: () => 36 + 15 }),
  N(5, 'locus', R`Tangents are drawn to $x^2+y^2=4$ from the points of the line $x=4$. The mid-points of the chords of contact lie on a circle. Find its radius.`, 0.5, 0.001,
    R`<p>For $P(4,t)$ the chord of contact is $4x+ty=4$. Its mid-point $M$ is the foot of the perpendicular from $O$: $M=\dfrac{4}{16+t^2}(4,t)$.</p><p>$x=\dfrac{16}{16+t^2}$ and $x^2+y^2=\dfrac{16(16+t^2)}{(16+t^2)^2}=\dfrac{16}{16+t^2}=x$.</p><p>So the locus is $x^2+y^2-x=0$ with radius $\dfrac12$.</p>`, 'The mid-point is the foot from the centre.', { calc: () => 0.5 }),
  I(5, 'touching circles', R`Two circles touch both axes and touch the circle $(x-2)^2+(y-2)^2=4$ externally. Find the product of their radii.`, 4,
    R`<p>Centre $(r,r)$ and external contact: $\sqrt2|r-2|=r+2$. Squaring: $2(r-2)^2=(r+2)^2$, so $r^2-12r+4=0$.</p><p>The roots are $6\pm4\sqrt2$ (both positive), and their product is $4$.</p>`, 'Squaring removes the modulus; use the product of roots.', { calc: () => (6 + 4 * Math.SQRT2) * (6 - 4 * Math.SQRT2) }),
  I(4, 'orthogonal circles', R`A circle through $(1,0)$ and $(0,1)$ cuts $x^2+y^2=4$ orthogonally. Its centre is $(p,p)$. Find $2p$.`, 5,
    R`<p>Let it be $x^2+y^2+2gx+2fy+c=0$. Through $(1,0)$: $1+2g+c=0$. Through $(0,1)$: $1+2f+c=0$, so $g=f$.</p><p>Orthogonal to $x^2+y^2-4=0$: $2(g\cdot0+f\cdot0)=c-4$, so $c=4$. Then $g=-\dfrac52$ and the centre is $\left(\dfrac52,\dfrac52\right)$.</p><p>So $p=\dfrac52$ and $2p=5$.</p>`, 'Use both point conditions first.', { calc: () => 5 }),
  M(4, 'mixed: straight lines', R`A circle with its centre on the x-axis touches both lines $3x+4y-10=0$ and $3x+4y+30=0$. Its centre is`, R`$\left(-\dfrac{10}3,0\right)$`, [R`$\left(\dfrac{10}3,0\right)$`, R`$\left(-\dfrac{20}3,0\right)$`, R`$\left(-10,0\right)$`],
    R`<p>The lines are parallel, so the centre lies on the middle line $3x+4y+10=0$ (average of $-10$ and $30$). With $y=0$: $x=-\dfrac{10}3$.</p><p>(The radius is half the distance between the lines, $\dfrac{40}{5}\cdot\dfrac12=4$.)</p>`, 'The centre is on the mid-line of the two tangents.', { sub: 'mixed' }),
  I(4, 'lattice points', R`How many points with integer coordinates lie strictly inside the circle $x^2+y^2=25$?`, 69,
    R`<p>Count $(x,y)$ with $x^2+y^2<25$. For $x=0$: $y$ from $-4$ to $4$ gives 9. $x=\pm1$: $y^2<24$, $|y|\le4$: 9 each. $x=\pm2$: $y^2<21$, 9 each. $x=\pm3$: $y^2<16$, $|y|\le3$: 7 each. $x=\pm4$: $y^2<9$, $|y|\le2$: 5 each.</p><p>Total $=9+2(9+9+7+5)=9+60=69$.</p>`, 'Strictly inside leaves out the 12 boundary points.', { calc: () => { let n = 0; for (let x = -5; x <= 5; x++) for (let y = -5; y <= 5; y++) if (x * x + y * y < 25) n++; return n; } }),
  N(3, 'chord of contact', R`The line $x+y=4$ meets the circle $x^2+y^2=10$ at two points. Find the length of the chord, to 2 decimal places.`, 2.83, 0.01,
    R`<p>Distance of the centre from the line $=\dfrac{4}{\sqrt2}=2\sqrt2$, so $d^2=8$. Chord $=2\sqrt{10-8}=2\sqrt2\approx2.83$.</p>`, 'Chord is $2\\sqrt{r^2-d^2}$.', { calc: () => 2 * Math.sqrt(10 - 8) }),
  I(2, 'line and circle', R`The line $y=2x+1$ meets the circle $x^2+y^2=1$ at $A(0,1)$ and another point $B$. Find $AB^2\times5$.`, 16,
    R`<p>Substitute: $x^2+(2x+1)^2=1$ gives $5x^2+4x=0$, so $x=0$ or $-\dfrac45$. $B=\left(-\dfrac45,-\dfrac35\right)$.</p><p>$AB^2=\dfrac{16}{25}+\dfrac{64}{25}=\dfrac{80}{25}=\dfrac{16}5$. Multiply by 5: 16.</p>`, 'Substitute the line into the circle.', { calc: () => 5 * (16 / 25 + 64 / 25) }),
  N(3, 'tangent condition', R`A circle passes through the origin and $(2,0)$ and touches the line $y=2$. Find its radius.`, 1.25, 0.01,
    R`<p>The centre lies on the perpendicular bisector $x=1$: $(1,k)$. Through the origin: $r^2=1+k^2$. Touching $y=2$: $r=|2-k|$.</p><p>$1+k^2=4-4k+k^2$, so $k=\dfrac34$ and $r=2-\dfrac34=\dfrac54=1.25$.</p>`, 'The centre is on $x=1$ by symmetry.', { calc: () => 2 - 3 / 4 }),

  I(4, 'mixed: straight lines', String.raw`Four circles touch all three lines $x=0$, $y=0$ and $3x+4y=12$. Find the sum of their radii.`, 12,
    String.raw`<p>The triangle has legs 3 and 4 and hypotenuse 5, so its area is 6 and $s=6$. The incircle has radius $\dfrac{\Delta}{s}=1$. The three excircles have radii $\dfrac{\Delta}{s-a}$ for $a=5,4,3$: $\dfrac61=6$, $\dfrac62=3$, $\dfrac63=2$.</p><p>Sum $=1+6+3+2=12$.</p>`, 'Remember the three excircles.', { sub: 'mixed', calc: () => 1 + 6 / 1 + 6 / 2 + 6 / 3 }),
  N(4, 'pair of tangents', String.raw`The pair of tangents from the origin to $x^2+y^2-6x-8y+21=0$ is $12x^2-24xy+5y^2=0$. Find $\tan\theta$ for the acute angle $\theta$ between the tangents, to 2 decimal places.`, 1.08, 0.01,
    String.raw`<p>For $ax^2+2hxy+by^2=0$: $\tan\theta=\dfrac{2\sqrt{h^2-ab}}{a+b}$. Here $a=12$, $h=-12$, $b=5$.</p><p>$\tan\theta=\dfrac{2\sqrt{144-60}}{17}=\dfrac{2\sqrt{84}}{17}\approx1.08$. (Check: $r=2$ and $d=5$ give $\sin\dfrac\theta2=\dfrac25$, which gives the same $\tan\theta$.)</p>`, 'Take $h$ as half the coefficient of $xy$.', { calc: () => (2 * Math.sqrt(84)) / 17 }),
  N(4, 'circle on a diameter', String.raw`Tangents from the origin touch $x^2+y^2-6x-8y+9=0$ at $A$ and $B$. A circle passes through $O$, $A$ and $B$. Find its radius.`, 2.5, 0.01,
    String.raw`<p>The centre of the given circle is $K(3,4)$. Angles $OAK$ and $OBK$ are right angles, so $A$ and $B$ lie on the circle with $OK$ as diameter. $OK=5$, so the radius is $2.5$.</p>`, 'Angle in a semicircle.', { calc: () => 5 / 2 }),
  I(4, 'line and circle', String.raw`For how many integer values of $k$ does the line $y=x+k$ cut the circle $x^2+y^2=50$ at two distinct points?`, 19,
    String.raw`<p>Distance from the origin to $x-y+k=0$ is $\dfrac{|k|}{\sqrt2}$. We need it less than $\sqrt{50}$: $|k|<10$.</p><p>So $k=-9,\dots,9$: 19 values.</p>`, 'The ends $k=\pm10$ touch the circle.', { calc: () => { let n = 0; for (let k = -30; k <= 30; k++) if (Math.abs(k) / Math.SQRT2 < Math.sqrt(50) - 1e-9) n++; return n; } }),
  N(5, 'touching lines', String.raw`Circles with centres on the positive x-axis touch both lines $y=x$ and $y=-x$ and pass through $(4,0)$. Find the sum of their radii to 2 decimal places.`, 11.31, 0.01,
    String.raw`<p>Centre $(a,0)$. Distance to $y=x$ is $\dfrac{a}{\sqrt2}=r$. Through $(4,0)$: $(4-a)^2=\dfrac{a^2}2$, so $a^2-16a+32=0$.</p><p>The roots $a=8\pm4\sqrt2$ are both positive. Sum of radii $=\dfrac{a_1+a_2}{\sqrt2}=\dfrac{16}{\sqrt2}=8\sqrt2\approx11.31$.</p>`, 'Check that both roots are positive.', { calc: () => 16 / Math.SQRT2 }),
  N(4, 'family of circles', String.raw`A circle passes through $(0,0)$ and $(6,0)$ and touches the line $y=5$. Find its radius.`, 3.4, 0.01,
    String.raw`<p>The centre is $(3,k)$ and $r^2=9+k^2$. Touching $y=5$: $r=5-k$. So $9+k^2=25-10k+k^2$, giving $k=1.6$.</p><p>$r=5-1.6=3.4$. (Check: $\sqrt{9+2.56}=3.4$.)</p>`, 'Perpendicular bisector first.', { calc: () => 5 - 1.6 }),
  N(4, 'tangent triangle', String.raw`Tangents from $P(5,5)$ touch $x^2+y^2=25$ at $A$ and $B$. Find the area of triangle $PAB$ to 2 decimal places.`, 12.5, 0.01,
    String.raw`<p>Chord of contact: $5x+5y=25$, i.e. $x+y=5$. Its distance from the origin is $\dfrac5{\sqrt2}$, so $AB=2\sqrt{25-12.5}\approx7.07$.</p><p>Distance of $P$ from the chord: $\dfrac{|5+5-5|}{\sqrt2}\approx3.54$.</p><p>Area $=\dfrac12(7.07)(3.54)=12.5$.</p>`, 'The chord of contact is a line, so use point-to-line distance.', { calc: () => 0.5 * 2 * Math.sqrt(12.5) * (5 / Math.SQRT2) }),
  I(3, 'mixed: complex numbers', String.raw`A complex number $z$ satisfies $|z-3-4i|=2$. Find the product of the greatest and least values of $|z|$.`, 21,
    String.raw`<p>$z$ lies on the circle with centre $(3,4)$ and radius 2. The origin is at distance 5 from the centre. Greatest $|z|=5+2=7$, least $=5-2=3$. Product $=21$.</p>`, 'Distance to the centre plus or minus the radius.', { sub: 'mixed', calc: () => 7 * 3 }),
];

// ---------- number templates ----------
const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
// distance d, integer offsets of that length, and (r, L) pairs with r^2 + L^2 = d^2
const DT = [
  [5, [[3, 4], [4, 3], [5, 0], [0, 5]], [[3, 4], [4, 3]]],
  [10, [[6, 8], [8, 6], [10, 0], [0, 10]], [[6, 8], [8, 6]]],
  [13, [[5, 12], [12, 5], [13, 0]], [[5, 12], [12, 5]]],
  [15, [[9, 12], [12, 9], [15, 0]], [[9, 12], [12, 9]]],
  [17, [[8, 15], [15, 8], [17, 0]], [[8, 15], [15, 8]]],
];
const sg = (rng) => choose(rng, [1, -1]);
const lin2 = (a, b, c) => { const r = `${t(a, 'x')}${t(b, 'y')}${t(c, '')}`; return r.replace(/^\+/, '') || '0'; };
const sn = (v) => (v < 0 ? `-${-v}` : `+${v}`);
const sq = (v, w) => (v === 0 ? `${w}^2` : `(${w}${v < 0 ? '+' + -v : '-' + v})^2`);
const sh = (n) => (n < 0 ? `(${n})` : `${n}`);
const cform = (h, k, r) => `(x${h < 0 ? '+' + -h : h > 0 ? '-' + h : ''})^2+(y${k < 0 ? '+' + -k : k > 0 ? '-' + k : ''})^2=${r * r}`;
const gens = [
  {
    id: 'ci-g01', type: 'nat', format: 'integer', level: 1, exams: EXS[1], sub: 'centre and radius',
    make(rng) {
      const h = int(rng, -6, 6), k = int(rng, -6, 6), r = int(rng, 2, 9);
      const a = -2 * h, b = -2 * k, c = h * h + k * k - r * r;
      return { a, b, c, answer: r, tol: 0,
        q: `Find the radius of the circle $${gen2(a, b, c)}$.`,
        sol: R`<p>$g=${a / 2}$, $f=${b / 2}$, $c=${c}$. $r=\sqrt{g^2+f^2-c}=\sqrt{${(a / 2) ** 2}+${(b / 2) ** 2}${c < 0 ? '+' + -c : '-' + c}}=\sqrt{${r * r}}=${r}$.</p>` };
    },
    verify(p) { return Math.round(Math.sqrt((p.a / 2) ** 2 + (p.b / 2) ** 2 - p.c)); },
  },
  {
    id: 'ci-g02', type: 'nat', format: 'integer', level: 1, exams: EXS[1], sub: 'centre and radius',
    make(rng) {
      const h = int(rng, -7, 7), k = int(rng, -7, 7), r = int(rng, 2, 8), m = choose(rng, ['h+k', 'h-k', '2h+k', 'hk']);
      const a = -2 * h, b = -2 * k, c = h * h + k * k - r * r;
      const f = { 'h+k': h + k, 'h-k': h - k, '2h+k': 2 * h + k, hk: h * k }[m];
      const txt = { 'h+k': 'h+k', 'h-k': 'h-k', '2h+k': '2h+k', hk: 'hk' }[m];
      return { a, b, c, m, answer: f, tol: 0,
        q: `The circle $${gen2(a, b, c)}$ has centre $(h,k)$. Find $${txt}$.`,
        sol: R`<p>The centre is $(-g,-f)=\left(-\dfrac{${a}}2,-\dfrac{${b}}2\right)=(${h},${k})$. So $${txt}=${f}$.</p>` };
    },
    verify(p) { const h = -p.a / 2, k = -p.b / 2; return { 'h+k': h + k, 'h-k': h - k, '2h+k': 2 * h + k, hk: h * k }[p.m]; },
  },
  {
    id: 'ci-g03', type: 'nat', format: 'numeric', level: 2, exams: EXS[2], sub: 'diameter form',
    make(rng) {
      const [dx, dy] = choose(rng, [[3, 4], [6, 8], [5, 12], [8, 6], [4, 3], [12, 5], [9, 12]]);
      const x1 = int(rng, -5, 5), y1 = int(rng, -5, 5), x2 = x1 + sg(rng) * dx, y2 = y1 + sg(rng) * dy;
      const d = Math.hypot(dx, dy);
      return { x1, y1, x2, y2, answer: d / 2, tol: 0.01,
        q: `The points $(${x1},${y1})$ and $(${x2},${y2})$ are the ends of a diameter of a circle. Find its radius.`,
        sol: R`<p>The diameter is $\sqrt{(${x2 - x1})^2+(${y2 - y1})^2}=\sqrt{${dx * dx + dy * dy}}=${d}$. The radius is half of it: ${fmt(d / 2)}.</p>` };
    },
    verify(p) { return Math.hypot(p.x2 - p.x1, p.y2 - p.y1) / 2; },
  },
  {
    id: 'ci-g04', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'length of tangent',
    make(rng) {
      const [d, offs, rls] = choose(rng, DT);
      const [ox, oy] = choose(rng, offs), [r, L] = choose(rng, rls);
      const h = int(rng, -4, 4), k = int(rng, -4, 4), p = h + sg(rng) * ox, q = k + sg(rng) * oy;
      const a = -2 * h, b = -2 * k, c = h * h + k * k - r * r;
      const form = rng() < 0.5;
      const circ = form ? cform(h, k, r) : gen2(a, b, c);
      const s1 = p * p + q * q + a * p + b * q + c;
      return { a, b, c, px: p, py: q, answer: L, tol: 0,
        q: `Find the length of the tangent from $(${p},${q})$ to the circle $${circ}$.`,
        sol: form
          ? R`<p>Centre $(${h},${k})$, $r=${r}$. Distance from the point to the centre: $\sqrt{${(p - h) ** 2}+${(q - k) ** 2}}=${d}$. $L=\sqrt{d^2-r^2}=\sqrt{${d * d}-${r * r}}=${L}$.</p>`
          : R`<p>Put $x=${p}$ and $y=${q}$ in the left side: $S_1=${p * p}${sn(q * q)}${sn(a * p)}${sn(b * q)}${sn(c)}=${s1}$. So $L=\sqrt{S_1}=${L}$.</p>` };
    },
    verify(p) { return Math.round(Math.sqrt(p.px * p.px + p.py * p.py + p.a * p.px + p.b * p.py + p.c)); },
  },
  {
    id: 'ci-g05', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'chord length',
    make(rng) {
      const [a, b] = choose(rng, [[3, 4], [4, 3], [5, 12], [12, 5], [8, 15]]); const n = Math.hypot(a, b);
      const [d, half, r] = choose(rng, [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15], [15, 8, 17]]);
      const c = d * n * sg(rng), bb = b * sg(rng);
      return { a, b: bb, c, r, answer: 2 * half, tol: 0,
        q: `Find the length of the chord that the line $${a}x${bb < 0 ? '-' : '+'}${Math.abs(bb)}y=${c}$ cuts from the circle $x^2+y^2=${r * r}$.`,
        sol: R`<p>Distance of the centre from the line: $d=\dfrac{|${c}|}{\sqrt{${a}^2+${b}^2}}=\dfrac{${Math.abs(c)}}{${n}}=${d}$.</p><p>Half chord $=\sqrt{r^2-d^2}=\sqrt{${r * r}-${d * d}}=${half}$. Chord $=${2 * half}$.</p>` };
    },
    verify(p) { return Math.round(2 * Math.sqrt(p.r * p.r - (p.c * p.c) / (p.a * p.a + p.b * p.b))); },
  },
  {
    id: 'ci-g06', type: 'mcq', format: 'single', level: 3, exams: EXS[3], sub: 'tangent condition',
    make(rng) {
      const [a, b] = choose(rng, [[3, 4], [5, 12], [8, 15], [6, 8], [4, 3]]); const n = Math.hypot(a, b);
      const r = int(rng, 2, 9), k = r * n;
      const { options, answer } = numOpts(rng, k, [r, r * n * n, k / 2 + r], '', 4);
      return { a, b, r, k, options, answer,
        q: `The line $${a}x+${b}y+k=0$ with $k>0$ touches the circle $x^2+y^2=${r * r}$. Then $k=$`,
        sol: R`<p>Distance of the origin from the line $=\dfrac{k}{\sqrt{${a}^2+${b}^2}}=\dfrac k{${n}}$. Touching: this equals $r=${r}$. So $k=${k}$.</p>` };
    },
    verify(p) { return p.answer === p.options.indexOf(String(fmt(Math.hypot(p.a, p.b) * p.r, 4))) ? p.answer : -1; },
  },
  {
    id: 'ci-g07', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'locus',
    make(rng) {
      const kk = choose(rng, [2, 3]), m = int(rng, 1, 4), b = (kk === 2 ? 3 : 8) * m, r = (kk * b) / (kk * kk - 1);
      return { kk, b, answer: r, tol: 0,
        q: `A point $P$ moves so that $PA=${kk}\\,PB$, where $A=(0,0)$ and $B=(${b},0)$. The locus is a circle. Find its radius.`,
        sol: R`<p>$x^2+y^2=${kk * kk}[(x-${b})^2+y^2]$ gives $${kk * kk - 1}(x^2+y^2)-${2 * kk * kk * b}x+${kk * kk * b * b}=0$.</p><p>Divide by ${kk * kk - 1}: $x^2+y^2-${fmt((2 * kk * kk * b) / (kk * kk - 1))}x+${fmt((kk * kk * b * b) / (kk * kk - 1))}=0$. Radius $=\sqrt{\left(${fmt((kk * kk * b) / (kk * kk - 1))}\right)^2-${fmt((kk * kk * b * b) / (kk * kk - 1))}}=${r}$.</p>` };
    },
    verify(p) { const x1 = (p.kk * p.b) / (p.kk + 1), x2 = (p.kk * p.b) / (p.kk - 1); return (x2 - x1) / 2; },
  },
  {
    id: 'ci-g08', type: 'nat', format: 'numeric', level: 3, exams: EXS[3], sub: 'radical axis',
    make(rng) {
      const a1 = 2 * int(rng, -4, 4), b1 = 2 * int(rng, -4, 4), c1 = int(rng, -9, 3), a2 = 2 * int(rng, -4, 4), b2 = 2 * int(rng, -4, 4), c2 = int(rng, -9, 3);
      if (a1 === a2) return this.make(rng);
      const x = (c2 - c1) / (a1 - a2);
      return { a1, b1, c1, a2, b2, c2, answer: x, tol: 0.01,
        q: `Find the x-coordinate of the point where the radical axis of $${gen2(a1, b1, c1)}$ and $${gen2(a2, b2, c2)}$ meets the x-axis. Give it to 2 decimal places.`,
        sol: R`<p>Radical axis $S_1-S_2=0$: $${a1 - a2}x${t(b1 - b2, 'y')}${t(c1 - c2, '')}=0$.</p><p>Put $y=0$: $x=\dfrac{${c2 - c1}}{${a1 - a2}}=${fmt(x, 4)}$.</p>` };
    },
    verify(p) { return (p.c2 - p.c1) / (p.a1 - p.a2); },
  },
  {
    id: 'ci-g09', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'orthogonal circles',
    make(rng) {
      const g1 = int(rng, -4, 4), f1 = int(rng, -4, 4), c1 = int(rng, -8, 8), g2 = int(rng, -4, 4), f2 = int(rng, -4, 4);
      const k = 2 * (g1 * g2 + f1 * f2) - c1;
      return { g1, f1, c1, g2, f2, answer: k, tol: 0,
        q: `The circles $${gen2(2 * g1, 2 * f1, c1)}$ and $x^2+y^2${t(2 * g2, 'x')}${t(2 * f2, 'y')}+k=0$ cut each other orthogonally. Find $k$.`,
        sol: R`<p>Orthogonal circles satisfy $2g_1g_2+2f_1f_2=c_1+c_2$. Here $g_1=${g1}$, $f_1=${f1}$, $c_1=${c1}$, $g_2=${g2}$, $f_2=${f2}$.</p><p>$2(${g1 * g2})+2(${f1 * f2})=${c1}+k$, so $k=${k}$.</p>` };
    },
    verify(p) { const r1 = p.g1 ** 2 + p.f1 ** 2 - p.c1, d2 = (p.g1 - p.g2) ** 2 + (p.f1 - p.f2) ** 2; return p.g2 ** 2 + p.f2 ** 2 - (d2 - r1); },
  },
  {
    id: 'ci-g10', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'common tangents',
    make(rng) {
      const [d, offs] = choose(rng, DT), [ox, oy] = choose(rng, offs), cs = int(rng, 0, 4);
      let r1, r2;
      if (cs === 3) { r1 = int(rng, 1, d - 1); r2 = d - r1; }
      else if (cs === 1) { r1 = int(rng, 1, 8); r2 = r1 + d; }
      else if (cs === 0) { r1 = int(rng, 1, 6); r2 = r1 + d + int(rng, 1, 5); }
      else if (cs === 4) { r1 = int(rng, 1, Math.floor(d / 2) - 1); r2 = int(rng, 1, d - r1 - 1); }
      else { do { r1 = int(rng, 2, d); r2 = int(rng, 2, d); } while (!(Math.abs(r1 - r2) < d && d < r1 + r2)); }
      const px = ox * sg(rng) , qy = oy * sg(rng);
      const cnt = d > r1 + r2 ? 4 : d === r1 + r2 ? 3 : d > Math.abs(r1 - r2) ? 2 : d === Math.abs(r1 - r2) ? 1 : 0;
      const nm = { 4: 'separate, so 4', 3: 'touch externally, so 3', 2: 'cut at two points, so 2', 1: 'touch internally, so 1', 0: 'one inside the other, so 0' }[cnt];
      return { px, qy, r1, r2, answer: cnt, tol: 0,
        q: `Find the number of common tangents of the circles $x^2+y^2=${r1 * r1}$ and $${sq(px, 'x')}+${sq(qy, 'y')}=${r2 * r2}$.`,
        sol: R`<p>Centres $(0,0)$ and $(${px},${qy})$: $d=\sqrt{${px * px}+${qy * qy}}=${d}$. Radii ${r1} and ${r2}: sum $=${r1 + r2}$, difference $=${Math.abs(r1 - r2)}$.</p><p>Compare $d=${d}$ with these: the circles ${nm} common tangents.</p>` };
    },
    verify(p) { const d = Math.hypot(p.px, p.qy); const s = p.r1 + p.r2, df = Math.abs(p.r1 - p.r2); const e = 1e-9; return d > s + e ? 4 : Math.abs(d - s) < e ? 3 : d > df + e ? 2 : Math.abs(d - df) < e ? 1 : 0; },
  },
  {
    id: 'ci-g11', type: 'nat', format: 'numeric', level: 2, exams: EXS[2], sub: 'length of tangent',
    make(rng) {
      let h, k, r, p, q, s1;
      do { h = int(rng, -4, 4); k = int(rng, -4, 4); r = int(rng, 2, 6); p = int(rng, -8, 8); q = int(rng, -8, 8); s1 = (p - h) ** 2 + (q - k) ** 2 - r * r; } while (s1 <= 0 || Number.isInteger(Math.sqrt(s1)));
      return { h, k, r, px: p, py: q, answer: Math.sqrt(s1), tol: 0.01,
        q: `Find the length of the tangent from $(${p},${q})$ to the circle $${cform(h, k, r)}$. Give it to 2 decimal places.`,
        sol: R`<p>Distance from the point to the centre $(${h},${k})$ squared: $(${p - h})^2+(${q - k})^2=${(p - h) ** 2 + (q - k) ** 2}$.</p><p>$L^2=d^2-r^2=${(p - h) ** 2 + (q - k) ** 2}-${r * r}=${s1}$, so $L=\sqrt{${s1}}\approx${fmt(Math.sqrt(s1), 4)}$.</p>` };
    },
    verify(p) { const g = -p.h, f = -p.k, c = p.h * p.h + p.k * p.k - p.r * p.r; return Math.sqrt(p.px * p.px + p.py * p.py - 2 * p.h * p.px - 2 * p.k * p.py + c); },
  },
  {
    id: 'ci-g12', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'chord with given mid-point',
    make(rng) {
      const [a0, b0, r, half] = choose(rng, [[3, 4, 13, 12], [0, 3, 5, 4], [0, 6, 10, 8], [0, 8, 17, 15], [1, 2, 3, 2], [2, 2, 3, 1], [2, 3, 7, 6], [3, 0, 5, 4]]);
      const a = a0 * sg(rng), b = b0 * sg(rng);
      return { a, b, r, answer: 2 * half, tol: 0,
        q: `A chord of the circle $x^2+y^2=${r * r}$ has mid-point $(${a},${b})$. Find the length of the chord.`,
        sol: R`<p>The mid-point is at distance $\sqrt{${a * a}+${b * b}}=\sqrt{${a * a + b * b}}$ from the centre, and the chord is perpendicular to this line. Half chord $=\sqrt{r^2-d^2}=\sqrt{${r * r}-${a * a + b * b}}=${half}$.</p><p>Chord $=${2 * half}$.</p>` };
    },
    verify(p) { // chord x*a+y*b=a^2+b^2: intersect numerically
      const s = p.a * p.a + p.b * p.b, n = Math.sqrt(s), ux = -p.b / n, uy = p.a / n; const t = Math.sqrt(p.r * p.r - s);
      return Math.round(Math.hypot(2 * t * ux, 2 * t * uy));
    },
  },
  {
    id: 'ci-g13', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'parametric form',
    make(rng) {
      const [a, b0] = choose(rng, [[3, 4], [5, 12], [6, 8], [4, 3], [8, 6]]), b = b0 * sg(rng), n = Math.hypot(a, b0);
      const h = int(rng, -4, 4), k = int(rng, -4, 4), r = int(rng, 1, 6), mx = rng() < 0.5;
      const v = a * h + b * k + (mx ? 1 : -1) * r * n;
      return { a, b, h, k, r, mx, answer: v, tol: 0,
        q: `For points $(x,y)$ on the circle $${cform(h, k, r)}$, find the ${mx ? 'maximum' : 'minimum'} value of $${a}x${b < 0 ? '-' : '+'}${Math.abs(b)}y$.`,
        sol: R`<p>Put $x=${h}+${r}\cos\theta$, $y=${k}+${r}\sin\theta$. Then $${a}x${b < 0 ? '-' : '+'}${Math.abs(b)}y=${a * h + b * k}+${r}(${a}\cos\theta${b < 0 ? '-' : '+'}${Math.abs(b)}\sin\theta)$.</p><p>The bracket ranges over $\pm\sqrt{${a}^2+${b0}^2}=\pm${n}$. So the ${mx ? 'maximum' : 'minimum'} is $${a * h + b * k}${mx ? '+' : '-'}${r * n}=${v}$.</p>` };
    },
    verify(p) { let best = p.mx ? -1e9 : 1e9; for (let i = 0; i < 40000; i++) { const th = (i / 40000) * 2 * Math.PI; const v = p.a * (p.h + p.r * Math.cos(th)) + p.b * (p.k + p.r * Math.sin(th)); best = p.mx ? Math.max(best, v) : Math.min(best, v); } return Math.round(best); },
  },
  {
    id: 'ci-g14', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'nearest and farthest points',
    make(rng) {
      const [d, offs] = choose(rng, DT), [ox, oy] = choose(rng, offs);
      const h = int(rng, -4, 4), k = int(rng, -4, 4), p = h + sg(rng) * ox, q = k + sg(rng) * oy;
      let r; do { r = int(rng, 2, 20); } while (r === d);
      const far = rng() < 0.5, ans = far ? d + r : Math.abs(d - r);
      return { h, k, r, px: p, py: q, far, answer: ans, tol: 0,
        q: `A point $P=(${p},${q})$ and a circle $${cform(h, k, r)}$ are given. Find the ${far ? 'greatest' : 'least'} distance from $P$ to a point on the circle.`,
        sol: R`<p>The distance from $P$ to the centre $(${h},${k})$ is $\sqrt{${(p - h) ** 2}+${(q - k) ** 2}}=${d}$. The radius is ${r}, so $P$ is ${d > r ? 'outside' : 'inside'} the circle.</p><p>${far ? `Greatest distance $=d+r=${d + r}$.` : `Least distance $=${d > r ? `d-r=${d - r}` : `r-d=${r - d}`}$.`}</p>` };
    },
    verify(p) { const d = Math.hypot(p.px - p.h, p.py - p.k); return Math.round(p.far ? d + p.r : Math.abs(d - p.r)); },
  },
  {
    id: 'ci-g15', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'touching axes',
    make(rng) {
      let [p, q] = choose(rng, [[1, 2], [2, 4], [3, 6], [4, 8], [1, 8], [2, 9], [5, 10], [1, 18]]);
      if (rng() < 0.5) [p, q] = [q, p];
      const rs = []; for (let r = 1; r <= 80; r++) if ((p - r) ** 2 + (q - r) ** 2 === r * r) rs.push(r);
      const [lo, hi] = rs; const w = choose(rng, ['sum', 'product', 'larger', 'smaller']);
      const ans = { sum: lo + hi, product: lo * hi, larger: hi, smaller: lo }[w];
      const ask = { sum: 'the sum of the radii of the circles', product: 'the product of the radii of the circles', larger: 'the radius of the larger circle', smaller: 'the radius of the smaller circle' }[w];
      return { px: p, py: q, w, answer: ans, tol: 0,
        q: `Circles touching both coordinate axes in the first quadrant pass through the point $(${p},${q})$. Find ${ask}.`,
        sol: R`<p>A circle touching both axes in the first quadrant has centre $(r,r)$ and radius $r$. Through $(${p},${q})$: $(${p}-r)^2+(${q}-r)^2=r^2$, i.e. $r^2-${2 * (p + q)}r+${p * p + q * q}=0$.</p><p>Roots: $r=${lo}$ and $r=${hi}$ (sum $${lo + hi}$, product $${lo * hi}$). So ${ask} is ${ans}.</p>` };
    },
    verify(p) { const rs = []; for (let r = 1; r <= 200; r++) if ((p.px - r) ** 2 + (p.py - r) ** 2 === r * r) rs.push(r); return { sum: rs[0] + rs[1], product: rs[0] * rs[1], larger: rs[1], smaller: rs[0] }[p.w]; },
  },
  {
    id: 'ci-g16', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'angle between tangents',
    make(rng) {
      const r = int(rng, 2, 9), h = int(rng, -4, 4), k = int(rng, -4, 4), is60 = rng() < 0.5, atC = rng() < 0.5;
      const [ox, oy] = is60 ? choose(rng, [[2 * r, 0], [0, 2 * r], [-2 * r, 0], [0, -2 * r]]) : choose(rng, [[r, r], [r, -r], [-r, r], [-r, -r]]);
      const tan = is60 ? 60 : 90, ans = atC ? 180 - tan : tan;
      return { r, ox, oy, atC, answer: ans, tol: 0,
        q: `Tangents are drawn from the point $(${h + ox},${k + oy})$ to the circle $${cform(h, k, r)}$ and touch it at $A$ and $B$. Find ${atC ? 'the angle $\\angle AOB$ in degrees, where $O$ is the centre' : 'the angle between the tangents in degrees'}.`,
        sol: R`<p>Distance of the point from the centre $=\sqrt{${ox * ox}+${oy * oy}}=${fmt(Math.hypot(ox, oy), 4)}$ and $r=${r}$. $\sin\dfrac{\theta}{2}=\dfrac rd=${is60 ? '\\dfrac12' : '\\dfrac1{\\sqrt2}'}$, so the angle between the tangents is $\theta=${tan}^\circ$.</p>${atC ? `<p>The angle at the centre is $180^\\circ-${tan}^\\circ=${ans}^\\circ$.</p>` : ''}` };
    },
    verify(p) { const th = (2 * Math.asin(p.r / Math.hypot(p.ox, p.oy)) * 180) / Math.PI; return Math.round(p.atC ? 180 - th : th); },
  },
  {
    id: 'ci-g17', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'tangents from a point',
    make(rng) {
      const [d, offs, rls] = choose(rng, DT), [ox, oy] = choose(rng, offs), [r, L] = choose(rng, rls);
      const h = int(rng, -4, 4), k = int(rng, -4, 4), p = h + sg(rng) * ox, q = k + sg(rng) * oy;
      return { r, L, d, answer: r * L, tol: 0,
        q: `Tangents from $P=(${p},${q})$ touch the circle $${cform(h, k, r)}$ at $A$ and $B$. Find the area of the quadrilateral $PACB$, where $C$ is the centre.`,
        sol: R`<p>$PC=\sqrt{${ox * ox}+${oy * oy}}=${d}$, $r=${r}$, so the tangent length is $\sqrt{${d * d}-${r * r}}=${L}$.</p><p>The quadrilateral is two right triangles with legs ${r} and ${L}: area $=2\cdot\dfrac12\cdot${r}\cdot${L}=${r * L}$.</p>` };
    },
    verify(p) { return Math.round(2 * 0.5 * p.r * Math.sqrt(p.d * p.d - p.r * p.r)); },
  },
  {
    id: 'ci-g18', type: 'nat', format: 'numeric', level: 4, exams: EXS[4], sub: 'chord of contact',
    make(rng) {
      const [d, offs, rls] = choose(rng, DT), [ox, oy] = choose(rng, offs), [r, L] = choose(rng, rls);
      const h = int(rng, -3, 3), k = int(rng, -3, 3), p = h + sg(rng) * ox, q = k + sg(rng) * oy;
      return { r, L, d, answer: (2 * r * L) / d, tol: 0.01,
        q: `Tangents from $(${p},${q})$ touch the circle $${cform(h, k, r)}$ at $A$ and $B$. Find the length $AB$ to 2 decimal places.`,
        sol: R`<p>Distance from the point to the centre is $d=${d}$; tangent length $L=\sqrt{${d * d}-${r * r}}=${L}$.</p><p>$AB=\dfrac{2rL}{d}=\dfrac{2\cdot${r}\cdot${L}}{${d}}=${fmt((2 * r * L) / d, 4)}$.</p>` };
    },
    verify(p) { const x = (p.r * p.r) / p.d; return 2 * Math.sqrt(p.r * p.r - x * x); },
  },
  {
    id: 'ci-g19', type: 'nat', format: 'numeric', level: 3, exams: EXS[3], sub: 'director circle',
    make(rng) {
      const h = int(rng, -4, 4), k = int(rng, -4, 4), r = int(rng, 2, 9), sqd = rng() < 0.5;
      return { r, sqd, answer: sqd ? 2 * r * r : r * Math.SQRT2, tol: 0.01,
        q: `The locus of the point from which perpendicular tangents can be drawn to the circle $${cform(h, k, r)}$ is a circle. Find ${sqd ? 'the square of its radius' : 'its radius to 2 decimal places'}.`,
        sol: R`<p>This is the director circle: same centre, radius $r\sqrt2=${r}\sqrt2$.</p><p>${sqd ? `Square of the radius $=2r^2=${2 * r * r}$.` : `Radius $\\approx${fmt(r * Math.SQRT2, 4)}$.`}</p>` };
    },
    verify(p) { return p.sqd ? 2 * p.r ** 2 : Math.hypot(p.r, p.r); },
  },
  {
    id: 'ci-g20', type: 'mcq', format: 'single', level: 2, exams: EXS[2], sub: 'circle through the origin',
    make(rng) {
      let a = int(rng, 2, 9) * sg(rng), b = int(rng, 2, 9) * sg(rng); if (a === b) b = -b;
      const ok = `$${gen2(-a, -b, 0)}$`;
      const { options, answer } = shuffleOpts(rng, ok, [`$${gen2(a, b, 0)}$`, `$${gen2(-b, -a, 0)}$`, `$${gen2(-2 * a, -2 * b, 0)}$`]);
      return { a, b, options, answer,
        q: `A circle passes through the origin and cuts off intercepts ${a} on the x-axis and ${b} on the y-axis (signed, measured from the origin). Its equation is`,
        sol: R`<p>The circle passes through $(0,0)$, $(${a},0)$ and $(0,${b})$. Since $c=0$, put $(${a},0)$: $${a * a}+2g(${a})=0$ so $2g=${-a}$. Put $(0,${b})$: $2f=${-b}$.</p><p>Equation: $${gen2(-a, -b, 0)}$.</p>` };
    },
    verify(p) { const g = -p.a, f = -p.b; return p.options[p.answer] === `$${gen2(g, f, 0)}$` ? p.answer : -1; },
  },
  {
    id: 'ci-g21', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'radical centre',
    make(rng) {
      const p = int(rng, -3, 3), q = int(rng, -3, 3), L = int(rng, 1, 5), tt = L * L, cs = [];
      let det;
      do { cs.length = 0; for (let i = 0; i < 3; i++) cs.push([int(rng, -4, 4), int(rng, -4, 4)]); det = (cs[1][0] - cs[0][0]) * (cs[2][1] - cs[0][1]) - (cs[2][0] - cs[0][0]) * (cs[1][1] - cs[0][1]); } while (det === 0);
      const eqs = cs.map(([g, f]) => ({ g, f, c: tt - p * p - q * q - 2 * g * p - 2 * f * q }));
      const sum = rng() < 0.5;
      return { px: p, py: q, L, eqs, sum, answer: sum ? p + q : L, tol: 0,
        q: `The circles $${eqs.map((e) => gen2(2 * e.g, 2 * e.f, e.c)).join('$, $')}$ have a radical centre $(p,q)$. Find ${sum ? '$p+q$' : 'the length of the tangent drawn from $(p,q)$ to any one of the circles'}.`,
        sol: R`<p>The radical centre lies on the radical axes $S_1-S_2=0$ and $S_1-S_3=0$.</p><p>$S_1-S_2$: $${lin2(2 * (eqs[0].g - eqs[1].g), 2 * (eqs[0].f - eqs[1].f), eqs[0].c - eqs[1].c)}=0$. $S_1-S_3$: $${lin2(2 * (eqs[0].g - eqs[2].g), 2 * (eqs[0].f - eqs[2].f), eqs[0].c - eqs[2].c)}=0$. Solving both gives $(p,q)=(${p},${q})$.</p><p>The power of this point is $S_1(${p},${q})=${tt}$, so the tangent length is $\sqrt{${tt}}=${L}$, and $p+q=${p + q}$.</p>` };
    },
    verify(p) {
      const [e1, e2, e3] = p.eqs; // (S1-S2): 2(g1-g2)x+2(f1-f2)y+(c1-c2)=0
      const a1 = 2 * (e1.g - e2.g), b1 = 2 * (e1.f - e2.f), k1 = -(e1.c - e2.c), a2 = 2 * (e1.g - e3.g), b2 = 2 * (e1.f - e3.f), k2 = -(e1.c - e3.c);
      const D = a1 * b2 - a2 * b1, x = (k1 * b2 - k2 * b1) / D, y = (a1 * k2 - a2 * k1) / D;
      const pw = x * x + y * y + 2 * e1.g * x + 2 * e1.f * y + e1.c;
      return Math.round(p.sum ? x + y : Math.sqrt(pw));
    },
  },
  {
    id: 'ci-g22', type: 'nat', format: 'numeric', level: 3, exams: EXS[3], sub: 'tangent at a point',
    make(rng) {
      const [a, b, r] = choose(rng, [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 6, 10], [6, 8, 10]]);
      const sa = sg(rng), sb = sg(rng), x1 = a * sa, y1 = b * sb;
      const area = Math.pow(r, 4) / (2 * a * b);
      return { x1, y1, r, answer: area, tol: 0.01,
        q: `The tangent at $(${x1},${y1})$ to the circle $x^2+y^2=${r * r}$ and the two coordinate axes form a triangle. Find its area to 2 decimal places.`,
        sol: R`<p>Tangent: $${x1}x${y1 < 0 ? '-' : '+'}${Math.abs(y1)}y=${r * r}$. Intercepts: $\dfrac{${r * r}}{${Math.abs(x1)}}$ and $\dfrac{${r * r}}{${Math.abs(y1)}}$.</p><p>Area $=\dfrac12\cdot\dfrac{${r * r}}{${Math.abs(x1)}}\cdot\dfrac{${r * r}}{${Math.abs(y1)}}=${fmt(area, 5)}$.</p>` };
    },
    verify(p) { const ix = p.r * p.r / Math.abs(p.x1), iy = p.r * p.r / Math.abs(p.y1); return (ix * iy) / 2; },
  },
  {
    id: 'ci-g23', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'orthogonal circles',
    make(rng) {
      const [d, offs, rls] = choose(rng, DT), [ox, oy] = choose(rng, offs), [r, R2] = choose(rng, rls);
      const h = sg(rng) * ox, k = sg(rng) * oy;
      return { h, k, R2, answer: r, tol: 0,
        q: `A circle with centre $(${h},${k})$ cuts the circle $x^2+y^2=${R2 * R2}$ orthogonally. Find its radius.`,
        sol: R`<p>For orthogonal circles $d^2=r_1^2+r_2^2$. $d^2=${h * h}+${k * k}=${d * d}$ and one radius squared is ${R2 * R2}.</p><p>$r^2=${d * d}-${R2 * R2}=${r * r}$, so $r=${r}$.</p>` };
    },
    verify(p) { return Math.round(Math.sqrt(p.h * p.h + p.k * p.k - p.R2 * p.R2)); },
  },
  {
    id: 'ci-g24', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'locus',
    make(rng) {
      const [a0, b0] = choose(rng, [[6, 8], [8, 6], [12, 16], [10, 24], [0, 10], [16, 12]]); const a = a0 * sg(rng), b = b0 * sg(rng);
      const R2 = int(rng, 12, 30);
      return { a, b, R2, answer: Math.hypot(a0, b0) / 2, tol: 0,
        q: `Chords of the circle $x^2+y^2=${R2 * R2}$ are drawn through the point $P(${a},${b})$. The mid-points of these chords lie on a circle. Find its radius.`,
        sol: R`<p>If $M$ is the mid-point of a chord through $P$, then $OM\perp MP$. So $M$ lies on the circle with $OP$ as diameter.</p><p>$OP=\sqrt{${a * a}+${b * b}}=${Math.hypot(a, b)}$. Radius $=${Math.hypot(a, b) / 2}$.</p>` };
    },
    verify(p) { return Math.sqrt(p.a * p.a + p.b * p.b) / 2; },
  },
  {
    id: 'ci-g25', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'common tangents',
    make(rng) {
      const direct = rng() < 0.5;
      const [d, df, len] = choose(rng, [[13, 5, 12], [17, 8, 15], [10, 6, 8], [25, 7, 24], [25, 15, 20], [26, 10, 24], [5, 3, 4], [17, 15, 8]]);
      let r1, r2;
      if (direct) { r2 = int(rng, 1, 5); r1 = r2 + df; } else { r1 = int(rng, 1, df - 1); r2 = df - r1; }
      return { d, r1, r2, direct, answer: len, tol: 0,
        q: `Two circles have radii ${r1} and ${r2}, and their centres are ${d} units apart (neither circle meets the other). Find the length of a ${direct ? 'direct' : 'transverse (internal)'} common tangent.`,
        sol: R`<p>${direct ? `Direct tangent $=\\sqrt{d^2-(r_1-r_2)^2}=\\sqrt{${d * d}-${(r1 - r2) ** 2}}=${len}$.` : `Transverse tangent $=\\sqrt{d^2-(r_1+r_2)^2}=\\sqrt{${d * d}-${(r1 + r2) ** 2}}=${len}$.`}</p>` };
    },
    verify(p) { return Math.round(Math.sqrt(p.d * p.d - (p.direct ? (p.r1 - p.r2) ** 2 : (p.r1 + p.r2) ** 2))); },
  },
];

// ---- Expansion 2026-11-22: extra questions (ids ci-x001 and on). Everything above this line is unchanged.
{
const R = String.raw;
const XEX = { 1: ['keam', 'cusat', 'comedk', 'jee-main'], 2: ['keam', 'cusat', 'comedk', 'jee-main'], 3: ['jee-main', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const XCUET = false;
const XPOS = [2, 0, 3, 1, 1, 3, 0, 2, 3, 2, 0, 1, 0, 3, 1, 2];
let xn = 0, xk = 0;
const xplace = (c, w) => { const p = XPOS[xk++ % XPOS.length]; const o = [...w]; o.splice(p, 0, c); return { options: o, answer: p }; };
const xb = (level, sub, extra) => ({ id: `ci-x${String(++xn).padStart(3, '0')}`, level, exams: [...XEX[level], ...(XCUET && extra.type === 'mcq' && level <= 3 ? ['cuet'] : [])], sub, ...extra });
const XAOPT = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const XSOPT = ['Both Statement I and Statement II are true', 'Statement I is true and Statement II is false', 'Statement I is false and Statement II is true', 'Both Statement I and Statement II are false'];
const M = (level, sub, q, correct, wrongs, sol, trap, more = {}) => xb(level, sub, { type: 'mcq', format: 'single', q, ...xplace(correct, wrongs), sol, trap, ...more });
const I = (level, sub, q, answer, sol, trap, more = {}) => xb(level, sub, { type: 'nat', format: 'integer', q, answer, tol: 0, sol, trap, ...more });
const N = (level, sub, q, answer, tol, sol, trap, more = {}) => xb(level, sub, { type: 'nat', format: 'numeric', q: `${q} (2 decimal places)`, answer, tol, sol, trap, ...more });
const X = (level, sub, q, options, answer, sol, trap, more = {}) => xb(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, trap, ...more });
const A = (level, sub, a, r, answer, sol, trap, more = {}) => xb(level, sub, { type: 'mcq', format: 'assertion', q: `<p><b>Assertion (A):</b> ${a}</p><p><b>Reason (R):</b> ${r}</p>`, options: XAOPT, answer, sol, trap, ...more });
const S = (level, sub, s1, s2, answer, sol, trap, more = {}) => xb(level, sub, { type: 'mcq', format: 'statements', q: `<p><b>Statement I:</b> ${s1}</p><p><b>Statement II:</b> ${s2}</p>`, options: XSOPT, answer, sol, trap, ...more });
const SC = (level, sub, lines, correct, wrongs, sol, trap, more = {}) => xb(level, sub, { type: 'mcq', format: 'statements', q: `<ol>${lines.map((l) => `<li>${l}</li>`).join('')}</ol><p>How many of these statements are correct?</p>`, ...xplace(correct, wrongs), sol, trap, ...more });
const LET = 'pqrst';
// Match the lists: map = the List II letter for A, B, C, D (e.g. 'qrps'); wrong codes are made by swaps.
const MT = (level, sub, gk, grp, map, sol, trap, q = 'Match each entry of List I with the correct entry of List II.') => {
  groups[gk] = grp;
  const code = (m) => [...m].map((c, i) => `${'ABCD'[i]}-${c}`).join(', ');
  const sw = (m, i, j) => { const a = [...m]; [a[i], a[j]] = [a[j], a[i]]; return a.join(''); };
  const cands = [sw(map, 0, 1), sw(map, 2, 3), sw(map, 0, 2), sw(map, 1, 3), sw(map, 0, 3), sw(map, 1, 2), map.slice(1) + map[0]];
  const wr = []; for (const c of cands) if (c !== map && !wr.includes(c) && wr.length < 3) wr.push(c);
  return xb(level, sub, { type: 'mcq', format: 'match', group: gk, q, ...xplace(code(map), wr.map(code)), sol, trap });
};
const PG = (gk, title, passage) => { groups[gk] = { title, passage }; };
const PI = (level, sub, group, q, answer, sol, trap, more = {}) => xb(level, sub, { type: 'nat', format: 'passage', group, q, answer, tol: 0, sol, trap, ...more });
const PN = (level, sub, group, q, answer, tol, sol, trap, more = {}) => xb(level, sub, { type: 'nat', format: 'passage', group, q: `${q} (2 decimal places)`, answer, tol, sol, trap, ...more });
const PM = (level, sub, group, q, correct, wrongs, sol, trap, more = {}) => xb(level, sub, { type: 'mcq', format: 'passage', group, q, ...xplace(correct, wrongs), sol, trap, ...more });
const gen = (id, level, type, format, sub, make, verify) => ({ id, type, format, level, exams: [...XEX[level], ...(XCUET && type === 'mcq' && level <= 3 ? ['cuet'] : [])], sub, make, ...(verify ? { verify } : {}) });
const r2 = (x) => +x.toFixed(2), r4 = (x) => +x.toFixed(4);
const PIE = Math.PI, sq = Math.sqrt, sin = Math.sin, cos = Math.cos, acos = Math.acos, asin = Math.asin;
const hyp = (a, b) => Math.hypot(a, b);
const dg = (r) => (r * 180) / PIE;
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const area3 = (P, Q, R_) => Math.abs((Q[0] - P[0]) * (R_[1] - P[1]) - (R_[0] - P[0]) * (Q[1] - P[1])) / 2;
const term = (c, v, first) => (c === 0 ? '' : (c < 0 ? '-' : first ? '' : '+') + (Math.abs(c) === 1 && v ? '' : Math.abs(c)) + v);
// x^2 + y^2 + a x + b y + c = 0 as TeX
const circ = (a, b, c) => `x^2+y^2${term(a, 'x', false)}${term(b, 'y', false)}${term(c, '', false)}=0`;
// intersection of a line p x + q y = c with a circle centre (h,k) radius r: the two points
const lineCircle = (p, q, c, h, k, r) => { const n = hyp(p, q), d = (p * h + q * k - c) / n, L2 = r * r - d * d; if (L2 < 0) return null; const fx = h - (d * p) / n, fy = k - (d * q) / n, t = sq(L2); return [[fx + (t * -q) / n, fy + (t * p) / n], [fx - (t * -q) / n, fy - (t * p) / n]]; };
PG('xp1', 'A circle and an outside point', R`<p>The circle $C$ is $x^2+y^2-6x-8y+9=0$ (centre $(3,4)$, radius $4$) and the point $P$ is $(8,4)$.</p>`);
PG('xp2', 'Two circles', R`<p>The circles $S_1:\ x^2+y^2=25$ and $S_2:\ x^2+y^2-8x-6y=0$ meet at two points.</p>`);
const add = [
  // ---------- level 2
  I(2, 'centre and radius', R`The radius of the circle $x^2+y^2-6x+8y-11=0$ is`, 6, R`<p>$g=-3$, $f=4$, $c=-11$. $r=\sqrt{g^2+f^2-c}=\sqrt{9+16+11}=\sqrt{36}=6$.</p>`, 'Subtract c, which is negative here.', { calc: () => sq(9 + 16 + 11) }),
  M(2, 'standard form', R`The circle with centre $(1,-2)$ and radius $3$ is`, '$x^2+y^2-2x+4y-4=0$', ['$x^2+y^2+2x-4y-4=0$', '$x^2+y^2-2x+4y+4=0$', '$x^2+y^2-2x+4y-9=0$'], R`<p>$(x-1)^2+(y+2)^2=9\Rightarrow x^2-2x+1+y^2+4y+4=9\Rightarrow x^2+y^2-2x+4y-4=0$.</p>`, 'Expand and move 9 across.'),
  I(2, 'length of tangent', R`The length of the tangent from $(6,8)$ to $x^2+y^2=64$ is`, 6, R`<p>$\sqrt{36+64-64}=\sqrt{36}=6$.</p>`, 'Length = square root of S1.', { calc: () => sq(36 + 64 - 64) }),
  M(2, 'diameter form', R`The circle on the join of $(1,2)$ and $(5,6)$ as diameter is`, '$x^2+y^2-6x-8y+17=0$', ['$x^2+y^2+6x+8y+17=0$', '$x^2+y^2-6x-8y-17=0$', '$x^2+y^2-3x-4y+17=0$'], R`<p>$(x-1)(x-5)+(y-2)(y-6)=0\Rightarrow x^2-6x+5+y^2-8y+12=0\Rightarrow x^2+y^2-6x-8y+17=0$.</p>`, 'Use the diameter-form equation directly.'),
  I(2, 'two circles', R`Two circles with radii $3$ and $2$ have centres $10$ units apart. The number of common tangents is`, 4, R`<p>$d=10>r_1+r_2=5$: the circles are separate, so there are $4$ common tangents (2 direct and 2 transverse).</p>`, 'Compare d with r1 + r2.', { calc: () => 4 }),
  I(2, 'position of a line', R`The distance of the centre $(2,3)$ of a circle from the line $3x+4y-3=0$ is`, 3, R`<p>$\dfrac{|3\cdot2+4\cdot3-3|}{\sqrt{9+16}}=\dfrac{15}5=3$.</p>`, 'Divide by 5, the length of the normal.', { calc: () => Math.abs(6 + 12 - 3) / 5 }),
  // ---------- level 3
  M(3, 'circle through points', R`The circle through $(0,0)$, $(4,0)$ and $(0,6)$ is`, '$x^2+y^2-4x-6y=0$', ['$x^2+y^2+4x+6y=0$', '$x^2+y^2-4x-6y+12=0$', '$x^2+y^2-6x-4y=0$'], R`<p>Through the origin: $c=0$. Write the circle as $x^2+y^2+ax+by=0$. Through $(4,0)$: $16+4a=0\Rightarrow a=-4$; $36+6b=0\Rightarrow b=-6$.</p>`, 'The x-intercept goes with the x term.'),
  I(3, 'circumradius', R`The circumradius of the triangle with vertices $(0,0)$, $(6,0)$ and $(0,8)$ is`, 5, R`<p>The right angle is at the origin, so the hypotenuse (length $10$) is a diameter. Radius $=5$.</p>`, 'A right angle sits in a semicircle.', { calc: () => hyp(6, 8) / 2 }),
  I(3, 'touching axes', R`The number of circles of radius $5$ that touch both coordinate axes is`, 4, R`<p>The centre is $(\pm5,\pm5)$: one circle in each quadrant, so $4$.</p>`, 'Count all four quadrants.', { calc: () => 4 }),
  M(3, 'radical axis', R`The radical axis of $x^2+y^2-4x+6y-12=0$ and $x^2+y^2+2x-6y-4=0$ is`, '$3x-6y+4=0$', ['$3x+6y-4=0$', '$x-2y+4=0$', '$x+2y-3=0$'], R`<p>Subtract: $(-4x-2x)+(6y+6y)+(-12+4)=0\Rightarrow-6x+12y-8=0$, i.e. $3x-6y+4=0$.</p>`, 'Subtract S2 from S1 term by term.'),
  I(3, 'orthogonal circles', R`The circles $x^2+y^2-4x-6y+k=0$ and $x^2+y^2-2x+4y-3=0$ cut orthogonally. Then $k=$`, -5, R`<p>Orthogonal: $2g_1g_2+2f_1f_2=c_1+c_2$. $g_1=-2$, $f_1=-3$, $c_1=k$; $g_2=-1$, $f_2=2$, $c_2=-3$. Left $=2(2)+2(-6)=4-12=-8$. So $k-3=-8$, $k=-5$.</p>`, 'The condition uses 2g1g2 + 2f1f2.', { calc: () => 2 * (-2) * (-1) + 2 * (-3) * 2 + 3 }),
  N(3, 'chord length', R`Find the length of the chord cut from $x^2+y^2=25$ by the line $3x+4y=10$.`, 9.17, 0.01, R`<p>Distance of the centre from the line $=\dfrac{10}5=2$. Chord $=2\sqrt{25-4}=2\sqrt{21}=9.17$.</p>`, 'Chord = 2 sqrt(r^2 - d^2).', { calc: () => { const P = lineCircle(3, 4, 10, 0, 0, 5); return hyp(P[0][0] - P[1][0], P[0][1] - P[1][1]); } }),
  M(3, 'tangent at a point', R`The tangent to $x^2+y^2=25$ at $(3,4)$ is`, '$3x+4y=25$', ['$4x+3y=25$', '$3x+4y=0$', '$3x-4y=25$'], R`<p>Tangent at $(x_1,y_1)$: $xx_1+yy_1=r^2$, so $3x+4y=25$.</p>`, 'Coefficients are the point itself.'),
  M(3, 'position of a point', R`The point $(5,5)$ with respect to the circle $x^2+y^2-6x-8y+9=0$ is`, 'inside the circle', ['on the circle', 'outside the circle', 'the centre'], R`<p>$S_1=25+25-30-40+9=-11<0$, so the point is inside.</p>`, 'Negative S1 means inside.'),
  A(3, 'tangents', R`The two tangents from an external point to a circle are equal in length.`, R`The length of a tangent from $(x_1,y_1)$ is $\sqrt{S_1}$, which is the same for both points of contact.`, 0, R`<p>Both true: the length depends only on the point, through $\sqrt{S_1}$, so it is the same for both tangents.</p>`, 'Equal because they are both sqrt(S1).'),
  S(3, 'point circle', R`The equation $x^2+y^2-2x-4y+5=0$ represents a point circle.`, R`A point circle has radius $0$.`, 0, R`<p>$r^2=1+4-5=0$. Both statements are true.</p>`, 'Radius zero means a single point (1, 2).'),
  SC(3, 'basics', [R`The centre of $x^2+y^2+2gx+2fy+c=0$ is $(-g,-f)$.`, R`Its radius is $\sqrt{g^2+f^2-c}$.`, R`The radical axis of two circles is perpendicular to the line joining their centres.`, R`Two circles touching externally have $2$ common tangents.`, R`The tangent at a point of a circle is perpendicular to the radius through it.`], '4', ['3', '5', '2'], R`<p>1, 2, 3, 5 are true. Externally touching circles have $3$ common tangents. So four are correct.</p>`, 'Touching externally: 2 outer plus 1 inner tangent.'),
  I(3, 'common chord', R`The circles $x^2+y^2=25$ and $x^2+y^2-12x+11=0$ meet at two points. The length of their common chord is`, 8, R`<p>Radical axis: subtract: $12x-36=0\Rightarrow x=3$. On $x=3$: $y^2=16$, $y=\pm4$. The chord from $(3,-4)$ to $(3,4)$ has length $8$.</p>`, 'The common chord lies on the radical axis.', { calc: () => { const P = lineCircle(1, 0, 3, 0, 0, 5); return hyp(P[0][0] - P[1][0], P[0][1] - P[1][1]); } }),
  N(3, 'area', R`Find the area of the circle $x^2+y^2+4x-6y-12=0$.`, 78.54, 0.01, R`<p>$g=2$, $f=-3$, $c=-12$. $r^2=4+9+12=25$. Area $=\pi r^2=25\pi=78.54$.</p>`, 'Radius is 5, not 25.', { calc: () => PIE * 25 }),
  N(3, 'chord and angle', R`A chord of length $6$ is drawn in a circle of radius $5$. Find the angle (in degrees) it subtends at the centre.`, 73.74, 0.01, R`<p>Half the chord is $3$. $\sin\dfrac\theta2=\dfrac35$, so $\dfrac\theta2=36.87^\circ$ and $\theta=73.74^\circ$.</p>`, 'Use half the chord and half the angle.', { calc: () => dg(2 * asin(3 / 5)) }),
  I(3, 'line and circle', R`For how many integer values of $k$ does the line $3x+4y=k$ meet the circle $x^2+y^2=25$ (touching counts as meeting)?`, 51, R`<p>The distance of the centre from the line is $\dfrac{|k|}5$. We need $\dfrac{|k|}5\le5$, so $|k|\le25$. Integers from $-25$ to $25$: $51$.</p>`, 'Tangency is included.', { calc: () => { let c = 0; for (let k = -60; k <= 60; k++) if (Math.abs(k) / 5 <= 5) c++; return c; } }),
  // ---------- level 4
  I(4, 'circle through points', R`A circle passes through $(1,2)$ and $(3,4)$ and its centre lies on the $x$-axis. Its radius squared is`, 20, R`<p>Centre $(h,0)$. $(h-1)^2+4=(h-3)^2+16\Rightarrow-2h+5=-6h+25\Rightarrow4h=20$, $h=5$. $r^2=(5-1)^2+4=20$.</p>`, 'Equate the squared distances to the two points.', { calc: () => { const h = 5; return (h - 1) ** 2 + 4; } }),
  I(4, 'touching axes', R`A circle touches the $y$-axis at $(0,3)$ and passes through $(5,-2)$. Its radius is`, 5, R`<p>Centre $(h,3)$ with radius $|h|$. $(5-h)^2+(-2-3)^2=h^2\Rightarrow25-10h+25=0\Rightarrow h=5$. Radius $=5$.</p>`, 'The centre is at the same height as the point of contact.', { calc: () => { for (let h = -30; h <= 30; h += 0.5) if (Math.abs((5 - h) ** 2 + 25 - h * h) < 1e-9) return Math.abs(h); } }),
  N(4, 'angle between circles', R`The circles $x^2+y^2=16$ and $(x-6)^2+y^2=9$ intersect. Find the acute angle (in degrees) between their tangents at a point of intersection.`, 62.73, 0.02, R`<p>$r_1=4$, $r_2=3$, $d=6$. The angle $\theta$ between the radii satisfies $\cos\theta=\dfrac{r_1^2+r_2^2-d^2}{2r_1r_2}=\dfrac{25-36}{24}=-\dfrac{11}{24}$. The angle between the tangents equals the angle between the radii or its supplement, so the acute angle is $\cos^{-1}\dfrac{11}{24}=62.73^\circ$.</p>`, 'Take the acute angle.', { calc: () => { // intersect: x = (d^2 + r1^2 - r2^2) / (2 d)
    const d = 6, x = (d * d + 16 - 9) / (2 * d), y = sq(16 - x * x); const n1 = [x, y], n2 = [x - 6, y]; const c = Math.abs(n1[0] * n2[0] + n1[1] * n2[1]) / (hyp(...n1) * hyp(...n2)); return dg(acos(c)); } }),
  N(4, 'radical centre', R`The circles $x^2+y^2-6x-4y+5=0$, $x^2+y^2-2x-8y+7=0$ and $x^2+y^2-4x+2y-3=0$ have a radical centre. Find the sum of its coordinates.`, 1.75, 0.01, R`<p>$S_1-S_2$: $-4x+4y-2=0\Rightarrow2x-2y+1=0$. $S_1-S_3$: $-2x-6y+8=0\Rightarrow x+3y=4$. From the first, $x=y-\frac12$; then $y-\frac12+3y=4$, $y=\frac98$, $x=\frac58$. Sum $=\dfrac{14}8=1.75$.</p>`, 'Any two radical axes meet at the radical centre.', { calc: () => { const S = [[-6, -4, 5], [-2, -8, 7], [-4, 2, -3]]; // radical axes: (a1-a2) x + (b1-b2) y + (c1-c2) = 0
    const l1 = [S[0][0] - S[1][0], S[0][1] - S[1][1], -(S[0][2] - S[1][2])], l2 = [S[0][0] - S[2][0], S[0][1] - S[2][1], -(S[0][2] - S[2][2])]; const D = l1[0] * l2[1] - l2[0] * l1[1]; const x = (l1[2] * l2[1] - l2[2] * l1[1]) / D, y = (l1[0] * l2[2] - l2[0] * l1[2]) / D; return x + y; } }),
  I(4, 'locus', R`A point $P$ moves so that $PA=2\,PB$ where $A=(0,0)$ and $B=(3,0)$. The locus is a circle. Its radius is`, 2, R`<p>$x^2+y^2=4\left[(x-3)^2+y^2\right]\Rightarrow3x^2+3y^2-24x+36=0\Rightarrow x^2+y^2-8x+12=0$. $r=\sqrt{16-12}=2$.</p>`, 'Square both sides of the ratio.', { calc: () => sq(16 - 12) }),
  N(4, 'chord with given mid-point', R`The chord of $x^2+y^2=25$ is bisected at $(1,2)$. Find its length.`, 8.94, 0.01, R`<p>The distance of the centre from the chord is $OM=\sqrt{1+4}=\sqrt5$. Chord $=2\sqrt{25-5}=2\sqrt{20}=8.94$.</p>`, 'The mid-point is the foot of the perpendicular from the centre.', { calc: () => 2 * sq(25 - 5) }),
  N(4, 'chord of contact', R`Tangents are drawn from $(10,0)$ to $x^2+y^2=36$. Find the length of the chord of contact.`, 9.6, 0.01, R`<p>Tangent length $L=\sqrt{100-36}=8$. Chord of contact $=\dfrac{2rL}{d}=\dfrac{2\cdot6\cdot8}{10}=9.6$.</p>`, 'The formula is 2 r L / d.', { calc: () => { const x = 36 / 10, y = sq(36 - x * x); return 2 * y; } }),
  N(4, 'tangent triangle', R`Tangents from $P(5,0)$ touch $x^2+y^2=9$ at $A$ and $B$. Find the area of triangle $PAB$.`, 7.68, 0.01, R`<p>$L=\sqrt{25-9}=4$. Contact points: $x=\dfrac95$, $y=\pm\dfrac{12}5$ (chord of contact $5x=9$). Base $AB=\dfrac{24}5$, height $=5-\dfrac95=\dfrac{16}5$. Area $=\dfrac12\cdot\dfrac{24}5\cdot\dfrac{16}5=7.68$.</p>`, 'Height is from P to the chord of contact.', { calc: () => { const x = 9 / 5, y = sq(9 - x * x); return area3([5, 0], [x, y], [x, -y]); } }),
  I(4, 'tangent quadrilateral', R`Tangents from $P(5,0)$ touch $x^2+y^2=9$ at $A$ and $B$. The area of the quadrilateral $OAPB$ ($O$ the origin) is`, 12, R`<p>Each of the two right triangles has legs $r=3$ and $L=4$: area $6$ each. Total $12$.</p>`, 'Two congruent right triangles.', { calc: () => { const x = 9 / 5, y = sq(9 - x * x); return area3([0, 0], [x, y], [5, 0]) + area3([0, 0], [x, -y], [5, 0]); } }),
  I(4, 'circle on intercepts', R`A circle through the origin cuts intercepts $4$ and $6$ on the coordinate axes. Its radius squared is`, 13, R`<p>The circle is $x^2+y^2-4x-6y=0$ (it meets the axes at the points $(4,0)$ and $(0,6)$). $r^2=4+9=13$. Equivalently, the diameter is the segment $(4,0)$-$(0,6)$ of length $\sqrt{52}$.</p>`, 'The chord joining the intercepts is a diameter (right angle at O).', { calc: () => (16 + 36) / 4 }),
  N(4, 'incircle', R`Find the distance between the incentre and the circumcentre of the triangle with vertices $(0,0)$, $(6,0)$, $(0,8)$.`, 2.24, 0.01, R`<p>Inradius $=\dfrac{6+8-10}2=2$, incentre $(2,2)$. Circumcentre $=$ mid-point of the hypotenuse $=(3,4)$. Distance $=\sqrt{1+4}=\sqrt5=2.24$.</p>`, 'In a right triangle the circumcentre is the mid-point of the hypotenuse.', { calc: () => hyp(3 - 2, 4 - 2) }),
  I(4, 'circles touching lines', R`The number of circles that touch all three sides (extended) of a triangle is`, 4, R`<p>One incircle and three excircles: $4$.</p>`, 'Include the excircles.', { calc: () => 4 }),
  I(4, 'circles touching a line', R`Two circles touch the $x$-axis and pass through $(1,2)$ and $(3,4)$. The product of their radii is`, 20, R`<p>Centre $(h,k)$, radius $k$. $(h-1)^2+(k-2)^2=k^2$ and $(h-3)^2+(k-4)^2=k^2$ give $4k=h^2-2h+5$ and $8k=h^2-6h+25$. Eliminating $k$: $h^2+2h-15=0$, $h=3$ or $-5$. Then $k=2$ or $10$. The radii are $2$ and $10$; product $20$.</p>`, 'Radius equals the height of the centre.', { calc: () => { const r = []; for (let h = -50; h <= 50; h += 0.5) { const k = (h * h - 2 * h + 5) / 4; if (Math.abs(8 * k - (h * h - 6 * h + 25)) < 1e-9 && k > 0) r.push(k); } return r.reduce((p, x) => p * x, 1); } }),
  I(4, 'distance from a point to a circle', R`The least distance of the point $(9,9)$ from the circle $x^2+y^2+6x-8y=0$ is`, 8, R`<p>Centre $(-3,4)$, radius $\sqrt{9+16}=5$. Distance from $(9,9)$ to the centre $=\sqrt{144+25}=13$. Least distance $=13-5=8$.</p>`, 'Subtract the radius from the distance to the centre.', { calc: () => hyp(12, 5) - 5 }),
  I(4, 'angle between tangents', R`The tangents from $P$ to a circle of radius $5$ meet at an angle of $60^\circ$. The distance of $P$ from the centre is`, 10, R`<p>Half the angle is $30^\circ$: $\sin30^\circ=\dfrac rd$, so $d=\dfrac5{1/2}=10$.</p>`, 'Use half the angle between tangents.', { calc: () => 5 / sin(PIE / 6) }),
  I(4, 'locus', R`The tangents from $P$ to $x^2+y^2=9$ are perpendicular. The locus of $P$ is $x^2+y^2=k$. Find $k$.`, 18, R`<p>The angle between tangents is $90^\circ$, so half is $45^\circ$: $OP=\dfrac r{\sin45^\circ}=3\sqrt2$, $OP^2=18$.</p>`, 'The director circle has radius r sqrt 2.', { calc: () => 9 / sin(PIE / 4) ** 2 }),
  I(4, 'secants', R`For how many integer values of $c$ is the line $y=x+c$ a secant (meeting in two distinct points) of $x^2+y^2=8$?`, 7, R`<p>Distance of the centre from $y=x+c$ is $\dfrac{|c|}{\sqrt2}<\sqrt8$, so $|c|<4$. Integers: $-3,\dots,3$: $7$.</p>`, 'Strict inequality: the tangents c = +-4 do not count.', { calc: () => { let c = 0; for (let k = -10; k <= 10; k++) if (Math.abs(k) / sq(2) < sq(8) - 1e-12) c++; return c; } }),
  I(4, 'mixed', R`A circle passes through $(1,0)$ and $(0,1)$ and cuts $x^2+y^2=4$ orthogonally. If its radius squared is $r^2$, find $2r^2$.`, 17, R`<p>Let it be $x^2+y^2+2gx+2fy+c=0$. $1+2g+c=0$ and $1+2f+c=0$, so $g=f$. Orthogonality with $x^2+y^2-4=0$: $0+0=c-4\Rightarrow c=4$. Then $g=-\dfrac52$. $r^2=g^2+f^2-c=\dfrac{25}4+\dfrac{25}4-4=\dfrac{17}2$. $2r^2=17$.</p>`, 'Orthogonality with a centred circle gives c directly.', { calc: () => { const c = 4, g = -(1 + c) / 2; return 2 * (g * g + g * g - c); } }),
  N(4, 'smallest circle', R`Find the radius of the smallest circle through the common points of $x^2+y^2=25$ and $x+y=7$.`, 0.71, 0.01, R`<p>The smallest circle has the common chord as a diameter. The distance of the centre $O$ from the line is $\dfrac7{\sqrt2}$, so the half-chord is $\sqrt{25-\dfrac{49}2}=\sqrt{\dfrac12}$. Radius $=0.71$.</p>`, 'The common chord is the diameter.', { calc: () => { const P = lineCircle(1, 1, 7, 0, 0, 5); return hyp(P[0][0] - P[1][0], P[0][1] - P[1][1]) / 2; } }),
  X(4, 'real circles', R`Which equations represent circles of positive radius?`, [R`$x^2+y^2-2x+4y+1=0$`, R`$x^2+y^2+2x+2y+5=0$`, R`$x^2+y^2-6x=0$`, R`$x^2+y^2-2x-4y+5=0$`], [0, 2], R`<p>$r^2=g^2+f^2-c$: (1) $1+4-1=4$ yes; (2) $1+1-5=-3$ no; (3) $9$ yes; (4) $1+4-5=0$ (a point only).</p>`, 'Radius zero is only a point.'),
  X(4, 'through the origin', R`Which of these circles pass through the origin?`, [R`$x^2+y^2-4x+6y=0$`, R`$x^2+y^2+2x-3=0$`, R`$x^2+y^2-y=0$`, R`$x^2+y^2-5=0$`], [0, 2], R`<p>A circle passes through $(0,0)$ exactly when its constant term is $0$.</p>`, 'Put x = y = 0.'),
  X(4, 'tangent lines', R`Which lines touch $x^2+y^2=25$?`, [R`$3x+4y=25$`, R`$4x-3y=25$`, R`$x+y=5$`, R`$y=x+5\sqrt2$`], [0, 1, 3], R`<p>Distance of the centre from the line must be $5$. (1) $\frac{25}5=5$ yes. (2) $5$ yes. (3) $\frac5{\sqrt2}=3.54$ no. (4) $\frac{5\sqrt2}{\sqrt2}=5$ yes.</p>`, 'Compare the distance with the radius.'),
  X(4, 'position of points', R`For the circle $x^2+y^2-4x-6y+9=0$ (centre $(2,3)$, radius $2$), which statements are true?`, [R`$(2,5)$ lies on it`, R`$(3,3)$ lies inside it`, R`$(4,4)$ lies inside it`, R`$(0,0)$ lies outside it`], [0, 1, 3], R`<p>Distances from $(2,3)$: $2$, $1$, $\sqrt5=2.24$, $\sqrt{13}$. So (1) on, (2) inside, (3) outside (not inside), (4) outside.</p>`, 'Compare each distance with 2.'),
  X(4, 'circle properties', R`For $x^2+y^2-6x+8y-11=0$, which statements are true?`, [R`The centre is $(3,-4)$`, R`The radius is $6$`, R`It passes through $(3,2)$`, R`It touches the $x$-axis`], [0, 1, 2], R`<p>$r=\sqrt{9+16+11}=6$. $(3,2)$: $0+36=36$. It would touch the $x$-axis if $r=|{-4}|=4$, but $r=6$.</p>`, 'Touching the x-axis needs radius equal to |k|.'),
  X(4, 'orthogonal circles', R`Which of these circles cut $x^2+y^2=9$ orthogonally?`, [R`$x^2+y^2-4x+6y+9=0$`, R`$x^2+y^2-10x+4=0$`, R`$x^2+y^2+8y+9=0$`, R`$x^2+y^2-6x-2y+9=0$`], [0, 2, 3], R`<p>For $x^2+y^2-9=0$ ($g=f=0$) orthogonality needs $0=c_1+c_2=c-9$, so $c=9$. Options 1, 3 and 4 have constant term $9$; option 2 has $4$.</p>`, 'The condition with g = f = 0 on one circle fixes the constant term.'),
  A(4, 'touching circles', R`Two circles with centres $5$ apart and radii $3$ and $2$ touch each other.`, R`Two circles touch externally when the distance between the centres equals the sum of the radii.`, 0, R`<p>$d=5=3+2$, so they touch externally. Both statements are true and R is the criterion.</p>`, 'Compare with the difference of radii for internal touching.'),
  S(4, 'tangent length', R`The length of the tangent from $(6,8)$ to $x^2+y^2=64$ is $6$.`, R`The length of the tangent from $(x_1,y_1)$ to $S=0$ is $\sqrt{S_1}$.`, 0, R`<p>$S_1=36+64-64=36$, so $L=6$. Both true.</p>`, 'Check S1 is positive first.'),
  SC(4, 'radical axis', [R`The radical axis of two intersecting circles is their common chord (extended).`, R`From any point on the radical axis the tangent lengths to the two circles are equal.`, R`The three radical axes of three circles taken in pairs are concurrent or parallel.`, R`Two circles touching internally have two common tangents.`], '3', ['2', '4', '1'], R`<p>1, 2, 3 are true. Internally touching circles have exactly $1$ common tangent. So three are correct.</p>`, 'Count common tangents by the position.'),
  // ---------- level 5
  N(5, 'Soddy circle', R`Three circles of radii $1$, $2$ and $3$ touch each other externally. Find the radius of the small circle that touches all three externally.`, 0.26, 0.01, R`<p>By Descartes' circle theorem with curvatures $k_1=1$, $k_2=\frac12$, $k_3=\frac13$: $k_4=k_1+k_2+k_3+2\sqrt{k_1k_2+k_2k_3+k_3k_1}=\dfrac{11}6+2\sqrt1=\dfrac{23}6$. So $r=\dfrac6{23}=0.26$.</p><p>(Check with coordinates: centres at distance $3,4,5$; the new centre is $1+r$, $2+r$, $3+r$ from them.)</p>`, 'The small circle fills the gap between the three.', { calc: () => { const A = [0, 0], B = [3, 0], C = [0, 4]; let x = 0.8, y = 0.8, r = 0.2; for (let it = 0; it < 200; it++) { const f = [hyp(x - A[0], y - A[1]) - (1 + r), hyp(x - B[0], y - B[1]) - (2 + r), hyp(x - C[0], y - C[1]) - (3 + r)]; // Newton with numerical Jacobian
      const J = []; const e = 1e-7; const F = (xx, yy, rr) => [hyp(xx - A[0], yy - A[1]) - (1 + rr), hyp(xx - B[0], yy - B[1]) - (2 + rr), hyp(xx - C[0], yy - C[1]) - (3 + rr)]; const f0 = F(x, y, r), fx = F(x + e, y, r), fy = F(x, y + e, r), fr = F(x, y, r + e); for (let i = 0; i < 3; i++) J.push([(fx[i] - f0[i]) / e, (fy[i] - f0[i]) / e, (fr[i] - f0[i]) / e]); const det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]); const D = det(J); const col = (j) => J.map((row, i) => row.map((v, c) => (c === j ? -f0[i] : v))); const dx = det(col(0)) / D, dy = det(col(1)) / D, dr = det(col(2)) / D; x += dx; y += dy; r += dr; } return r; } }),
  N(5, 'lens area', R`Two circles of radius $2$ have centres $2$ units apart. Find the area common to both circles.`, 4.91, 0.01, R`<p>Each circle contributes a segment on the common chord. With $d=2$, $r=2$: half-angle at the centre $\alpha=\cos^{-1}\dfrac d{2r}=\cos^{-1}\dfrac12=\dfrac\pi3$. Lens area $=2r^2\alpha-\dfrac d2\sqrt{4r^2-d^2}=8\cdot\dfrac\pi3-1\cdot\sqrt{12}=8.378-3.464=4.91$.</p>`, 'The lens is two circular segments.', { calc: () => { let a = 0; const n = 400000; for (let i = 0; i < n; i++) { const x = -0 + ((i + 0.5) / n) * 4 - 1; /* x from -1 to 3 */ const y1 = x * x <= 4 ? sq(4 - x * x) : 0, y2 = (x - 2) ** 2 <= 4 ? sq(4 - (x - 2) ** 2) : 0; a += (2 * Math.min(y1, y2) * 4) / n; } return a; } }),
  N(5, 'inscribed triangle', R`Find the greatest possible area of a triangle inscribed in a circle of radius $4$.`, 20.78, 0.01, R`<p>The largest inscribed triangle is equilateral. Area $=\dfrac{3\sqrt3}4r^2=\dfrac{3\sqrt3}4\cdot16=12\sqrt3=20.78$.</p>`, 'Equilateral gives the maximum.', { calc: () => { let m = 0; for (let i = 1; i < 700; i++) for (let j = i + 1; j < 700; j++) { const a = (i / 700) * 2 * PIE, b = (j / 700) * 2 * PIE; const P = [4, 0], Q = [4 * cos(a), 4 * sin(a)], R_ = [4 * cos(b), 4 * sin(b)]; m = Math.max(m, area3(P, Q, R_)); } return m; } }),
  I(5, 'lattice points', R`The number of points $(x,y)$ with integer coordinates satisfying $x^2+y^2\le25$ is`, 81, R`<p>For each integer $x$ from $-5$ to $5$ count the integers $y$ with $|y|\le\sqrt{25-x^2}$: $x=0$: $11$; $x=\pm1$: $|y|\le4$, $9$ each; $x=\pm2$: $|y|\le4$, $9$ each; $x=\pm3$: $|y|\le4$, $9$ each; $x=\pm4$: $|y|\le3$, $7$ each; $x=\pm5$: $1$ each.</p><p>Total $=11+6\cdot9+2\cdot7+2=11+54+14+2=81$.</p>`, 'Include the boundary points.', { calc: () => { let c = 0; for (let x = -8; x <= 8; x++) for (let y = -8; y <= 8; y++) if (x * x + y * y <= 25) c++; return c; } }),
  X(5, 'common tangents', R`For which of the following pairs of circles (radii $r_1,r_2$, centres $d$ apart) are there exactly $3$ common tangents?`, [R`$r_1=3,\ r_2=2,\ d=5$`, R`$r_1=5,\ r_2=1,\ d=4$`, R`$r_1=4,\ r_2=4,\ d=8$`, R`$r_1=2,\ r_2=3,\ d=6$`], [0, 2], R`<p>Three common tangents occur when the circles touch externally ($d=r_1+r_2$). (1) $5=3+2$ yes. (2) $d=r_1-r_2$: internal touching, one tangent. (3) $8=4+4$ yes. (4) $6>5$: four tangents.</p>`, 'Internal touching gives only one.'),
  X(5, 'touching the axis', R`Which circles touch the $x$-axis?`, [R`$x^2+y^2-6x-4y+9=0$`, R`$x^2+y^2-4x-2y+1=0$`, R`$(x-1)^2+(y+3)^2=9$`, R`$x^2+y^2=1$`], [0, 2], R`<p>A circle touches the $x$-axis if $r=|k|$. (1) centre $(3,2)$, $r=\sqrt{9+4-9}=2$: yes. (2) centre $(2,1)$, $r=\sqrt{4+1-1}=2\ne1$: no. (3) centre $(1,-3)$, $r=3$: yes. (4) centre $(0,0)$, $r=1\ne0$: no.</p>`, 'Radius must equal the distance of the centre from the axis.'),
  X(5, 'radical axis', R`For two circles $S_1=0$ and $S_2=0$, which statements about the radical axis are true?`, [R`It is perpendicular to the line joining the centres`, R`If the circles touch, it is the common tangent at the point of contact`, R`If the circles meet, it passes through their common points`, R`It is parallel to the line joining the centres`], [0, 1, 2], R`<p>The radical axis is $S_1-S_2=0$, a line perpendicular to the line of centres. At a touching point and at intersection points $S_1=S_2=0$, so it passes through them.</p>`, 'It is perpendicular, not parallel.'),
  X(5, 'locus', R`Which statements about loci connected with a circle of radius $r$ are true?`, [R`Points from which the tangents are perpendicular lie on a circle of radius $r\sqrt2$ about the centre`, R`Mid-points of chords through a fixed point $P$ of the circle lie on the circle with $OP$ as diameter`, R`Points with equal tangent lengths to two circles lie on a line`, R`Mid-points of chords that subtend a right angle at the centre lie on a circle of radius $\dfrac r2$`], [0, 1, 2], R`<p>1, 2, 3 are standard. For 4, the mid-point is at distance $r\cos45^\circ=\dfrac r{\sqrt2}$ from the centre, not $\dfrac r2$.</p>`, 'The radius of the mid-point circle is r over sqrt 2.'),
  A(5, 'radical axis', R`Two concentric circles have no radical axis (the equation $S_1-S_2=0$ gives no line).`, R`Subtracting the equations of two concentric circles leaves a non-zero constant.`, 0, R`<p>For concentric circles $g$ and $f$ are equal, so $S_1-S_2=c_1-c_2\ne0$: a contradiction, not a line. Both statements are true and R explains A.</p>`, 'There are no points with equal tangent lengths.'),
  A(5, 'touching circles', R`The circles $x^2+y^2=1$ and $x^2+y^2-2x-2y+1=0$ touch each other.`, R`Two circles touch if the distance between the centres equals the sum or the difference of the radii.`, 3, R`<p>Centres $(0,0)$ and $(1,1)$: $d=\sqrt2$. Radii $1$ and $1$ ($r^2=1+1-1$). Sum $2$, difference $0$. $d$ equals neither, so the circles intersect in two points. A is false; R is true.</p>`, 'Compute d and both radii.'),
  S(5, 'common tangents', R`Two intersecting circles have $3$ common tangents.`, R`Two circles touching externally have $3$ common tangents.`, 2, R`<p>Statement I is false: intersecting circles have exactly $2$ common tangents. Statement II is true.</p>`, 'Count by position: 4, 3, 2, 1, 0.'),
  SC(5, 'basics', [R`A circle can be drawn through any three non-collinear points.`, R`Exactly one circle passes through any three collinear points.`, R`The angle in a semicircle is a right angle.`, R`A circle through the origin with intercepts $a$ and $b$ on the axes is $x^2+y^2-ax-by=0$.`], '3', ['2', '4', '1'], R`<p>1, 3, 4 are true. Three collinear points lie on no circle. So three are correct.</p>`, 'Collinear points give no circle.'),
  // ---------- passages
  PI(3, 'length of tangent', 'xp1', R`The length of the tangent from $P$ to $C$ is`, 3, R`<p>$S_1=64+16-48-32+9=9$, so $L=3$.</p>`, 'Length is the square root of S1.', { calc: () => sq(64 + 16 - 48 - 32 + 9) }),
  PN(4, 'chord of contact', 'xp1', R`The length of the chord of contact of the tangents from $P$ is`, 4.8, 0.01, R`<p>Chord of contact: $5x-31=0$, so $x=6.2$. Distance from the centre $(3,4)$: $3.2$. Length $=2\sqrt{16-10.24}=2\cdot2.4=4.8$. (Also $\dfrac{2rL}d=\dfrac{2\cdot4\cdot3}5=4.8$.)</p>`, 'Use 2 r L over d with d = 5.', { calc: () => { const P = lineCircle(1, 0, 6.2, 3, 4, 4); return hyp(P[0][0] - P[1][0], P[0][1] - P[1][1]); } }),
  PI(4, 'tangent quadrilateral', 'xp1', R`The area of the quadrilateral formed by the centre of $C$, the point $P$ and the two points of contact is`, 12, R`<p>Two right triangles with legs $r=4$ and $L=3$: area $6$ each. Total $12$.</p>`, 'The area is r L.', { calc: () => 4 * 3 }),
  PI(3, 'distance between centres', 'xp2', R`The distance between the centres of $S_1$ and $S_2$ is`, 5, R`<p>$S_1$ has centre $(0,0)$; $S_2$ has centre $(4,3)$. Distance $=5$.</p>`, 'The centre of S2 is (-g, -f).', { calc: () => hyp(4, 3) }),
  PN(4, 'common chord', 'xp2', R`The length of the common chord of $S_1$ and $S_2$ is`, 8.66, 0.01, R`<p>Radical axis: $S_1-S_2=0\Rightarrow8x+6y-25=0$. Distance from $O$: $\dfrac{25}{10}=2.5$. Chord $=2\sqrt{25-6.25}=2\sqrt{18.75}=8.66$.</p>`, 'Subtract the equations to get the common chord line.', { calc: () => { const P = lineCircle(8, 6, 25, 0, 0, 5); return hyp(P[0][0] - P[1][0], P[0][1] - P[1][1]); } }),
  PI(3, 'common tangents', 'xp2', R`The number of common tangents to $S_1$ and $S_2$ is`, 2, R`<p>Radii: $5$ and $5$ ($r_2^2=16+9-0=25$). $d=5$, $|r_1-r_2|=0<5<10$. The circles intersect in two points, so there are $2$ common tangents.</p>`, 'Intersecting circles have two common tangents.', { calc: () => 2 }),
  // ---------- matches
  MT(3, 'common tangents', 'xm1', { title: 'Common tangents', passage: R`<p>Two circles have radii $r_1$, $r_2$ and centres $d$ apart. Match each case in List I with the number of common tangents in List II.</p>`, list1: [R`A. $r_1=3,\ r_2=2,\ d=10$`, R`B. $r_1=3,\ r_2=2,\ d=5$`, R`C. $r_1=3,\ r_2=2,\ d=3.5$`, R`D. $r_1=5,\ r_2=2,\ d=3$`], list2: [R`p. $0$`, R`q. $1$`, R`r. $2$`, R`s. $3$`, R`t. $4$`] }, 'tsrq', R`<p>A: separate, $4$. B: $d=r_1+r_2$, $3$. C: $1<3.5<5$, intersecting, $2$. D: $d=r_1-r_2$, internal touching, $1$.</p>`, 'Compare d with the sum and the difference.'),
  MT(4, 'circle features', 'xm2', { title: 'The circle x^2 + y^2 - 6x - 8y + 9 = 0', passage: R`<p>Match each item in List I with its value in List II.</p>`, list1: [R`A. Centre`, R`B. Radius`, R`C. Length of the tangent from the origin`, R`D. Distance of the origin from the centre`], list2: [R`p. $3$`, R`q. $(3,4)$`, R`r. $5$`, R`s. $4$`] }, 'qspr', R`<p>Centre $(3,4)$, $r=\sqrt{9+16-9}=4$. Tangent from origin $=\sqrt{S_1}=\sqrt9=3$. Distance to centre $5$.</p>`, 'Tangent length is sqrt of the constant term from the origin.'),
  MT(4, 'formulae', 'xm3', { title: 'Formulae for x^2 + y^2 = r^2', passage: R`<p>Match each item in List I with the matching expression in List II.</p>`, list1: [R`A. Length of the tangent from $(x_1,y_1)$`, R`B. Equation of the chord with mid-point $(x_1,y_1)$`, R`C. Tangents of slope $m$`, R`D. Director circle`], list2: [R`p. $x^2+y^2=2r^2$`, R`q. $\sqrt{x_1^2+y_1^2-r^2}$`, R`r. $y=mx\pm r\sqrt{1+m^2}$`, R`s. $xx_1+yy_1=x_1^2+y_1^2$`] }, 'qsrp', R`<p>Standard results from the circle chapter.</p>`, 'The chord with mid-point uses T = S1.'),
  MT(4, 'chord and radius', 'xm4', { title: 'Radius from a chord', passage: R`<p>A chord of the given length lies at the given distance from the centre. Match each case in List I with the radius in List II.</p>`, list1: [R`A. chord $8$, distance $3$`, R`B. chord $12$, distance $8$`, R`C. chord $30$, distance $8$`, R`D. chord $14$, distance $24$`], list2: [R`p. $10$`, R`q. $17$`, R`r. $5$`, R`s. $25$`] }, 'rpqs', R`<p>$r^2=\left(\frac{\text{chord}}2\right)^2+d^2$: $16+9$; $36+64$; $225+64$; $49+576$.</p>`, 'Half the chord, not the whole chord.'),
  MT(3, 'centres', 'xm5', { title: 'Centres of circles', passage: R`<p>Match each circle in List I with its centre in List II.</p>`, list1: [R`A. $x^2+y^2-6x+4y=0$`, R`B. $2x^2+2y^2-8x-12y+5=0$`, R`C. $x^2+y^2+10x=0$`, R`D. $x^2+y^2-y-1=0$`], list2: [R`p. $(2,3)$`, R`q. $(3,-2)$`, R`r. $(-5,0)$`, R`s. $\left(0,\dfrac12\right)$`] }, 'qprs', R`<p>Centre $(-g,-f)$ after dividing by the coefficient of $x^2$. A: $(3,-2)$. B: $x^2+y^2-4x-6y+\frac52=0$, $(2,3)$. C: $(-5,0)$. D: $\left(0,\frac12\right)$.</p>`, 'Divide by 2 first in B.'),
  MT(5, 'loci', 'xm6', { title: 'Loci', passage: R`<p>Match each locus in List I with the curve in List II.</p>`, list1: [R`A. Points with equal tangent lengths to two circles`, R`B. Mid-points of chords of a circle through a fixed point $P$ on it`, R`C. Points $X$ with $XA:XB=2:1$ for fixed $A\ne B$`, R`D. Points from which the tangents to a circle are at right angles`], list2: [R`p. A concentric circle`, R`q. A straight line`, R`r. A circle through the centre of the given circle`, R`s. A circle with centre on the line $AB$`] }, 'qrsp', R`<p>A: the radical axis. B: circle with $OP$ as diameter, so it passes through $O$. C: Apollonius circle, centre on $AB$. D: director circle, concentric.</p>`, 'Equal ratios other than 1 give circles.'),
  MT(4, 'tangent lengths', 'xm7', { title: 'Tangent lengths', passage: R`<p>The circle is $x^2+y^2-4x-6y+9=0$ (centre $(2,3)$, radius $2$). Match each point in List I with the length of the tangent from it in List II.</p>`, list1: [R`A. $(4,6)$`, R`B. $(6,5)$`, R`C. $(7,5)$`, R`D. $(2,5.5)$`], list2: [R`p. $5$`, R`q. $1.5$`, R`r. $3$`, R`s. $4$`] }, 'rspq', R`<p>$S_1$ at each point: $9$, $16$, $25$, $2.25$. Lengths $3,4,5,1.5$.</p>`, 'The length is the square root of S1.'),
  MT(5, 'line and circle', 'xm8', { title: 'A line and a circle', passage: R`<p>The circle is $x^2+y^2=8$. Match each line in List I with how it meets the circle in List II.</p>`, list1: [R`A. $y=x+4$`, R`B. $y=x$`, R`C. $y=x+2$`, R`D. $y=x+6$`], list2: [R`p. A diameter (secant through the centre)`, R`q. A tangent`, R`r. A secant that does not pass through the centre`, R`s. No common point`] }, 'qprs', R`<p>Distance of the centre from $y=x+c$ is $\dfrac{|c|}{\sqrt2}$; radius $2\sqrt2=\dfrac4{\sqrt2}\cdot\sqrt2$. For $c=4$: distance $2\sqrt2=r$ (tangent). $c=0$: through the centre. $c=2$: $\sqrt2<r$. $c=6$: $3\sqrt2>r$.</p>`, 'Compare |c|/sqrt 2 with 2 sqrt 2.'),
];
items.push(...add);
const xgens = [
  gen('ci-gx1', 3, 'nat', 'numeric', 'length of tangent', (rng) => {
    const g_ = int(rng, -5, 5), f_ = int(rng, -5, 5), c_ = int(rng, -10, 8), x1 = int(rng, -9, 9), y1 = int(rng, -9, 9);
    const S1 = x1 * x1 + y1 * y1 + 2 * g_ * x1 + 2 * f_ * y1 + c_, rr = g_ * g_ + f_ * f_ - c_;
    if (rr <= 0 || S1 <= 0) throw RETRY;
    return { g_, f_, c_, x1, y1, answer: r2(sq(S1)), tol: 0.01, q: R`Find the length of the tangent from $(${x1},${y1})$ to the circle $${circ(2 * g_, 2 * f_, c_)}$. (2 decimal places)`, sol: R`<p>$S_1=${x1}^2+${y1}^2+${2 * g_}(${x1})+${2 * f_}(${y1})+(${c_})=${S1}$. Length $=\sqrt{${S1}}=${r2(sq(S1))}$.</p>` };
  }, (p) => { const d = hyp(p.x1 + p.g_, p.y1 + p.f_), r = sq(p.g_ ** 2 + p.f_ ** 2 - p.c_); return sq(d * d - r * r); }),
  gen('ci-gx2', 3, 'mcq', 'single', 'position of a point', (rng) => {
    const h = int(rng, -4, 4), k = int(rng, -4, 4), [a, b, c] = choose(rng, [[3, 4, 5], [5, 12, 13], [6, 8, 10]]), r = c, kind = int(rng, 0, 2);
    const [dx, dy] = kind === 0 ? [a, b] : kind === 1 ? [a - 1, b - 1] : [a + 1, b + 1];
    const P = [h + dx, k + dy], d2 = dx * dx + dy * dy, ans = d2 === r * r ? 'On the circle' : d2 < r * r ? 'Inside the circle' : 'Outside the circle';
    const o = shuffleOpts(rng, ans, ['On the circle', 'Inside the circle', 'Outside the circle', 'At the centre'].filter((x) => x !== ans));
    return { h, k, r, P, options: o.options, answer: o.answer, q: R`The point $(${P[0]},${P[1]})$ with respect to the circle $(x${h < 0 ? '+' + -h : h === 0 ? '' : '-' + h})^2+(y${k < 0 ? '+' + -k : k === 0 ? '' : '-' + k})^2=${r * r}$ is`, sol: R`<p>Distance squared from the centre $(${h},${k})$: $${dx}^2+${dy}^2=${d2}$. Radius squared $=${r * r}$. ${d2 === r * r ? 'Equal: the point is on the circle.' : d2 < r * r ? 'Smaller: inside.' : 'Larger: outside.'}</p>` };
  }, (p) => { const d = hyp(p.P[0] - p.h, p.P[1] - p.k); const ans = Math.abs(d - p.r) < 1e-9 ? 'On the circle' : d < p.r ? 'Inside the circle' : 'Outside the circle'; return p.options.indexOf(ans); }),
  gen('ci-gx3', 3, 'mcq', 'single', 'common tangents', (rng) => {
    const r1 = int(rng, 2, 8), r2_ = int(rng, 1, r1), kind = int(rng, 0, 4);
    let d;
    if (kind === 0) d = r1 + r2_ + int(rng, 1, 5); else if (kind === 1) d = r1 + r2_; else if (kind === 2) d = r1 - r2_ + 1 + int(rng, 0, Math.max(0, 2 * r2_ - 2)); else if (kind === 3) d = r1 - r2_; else d = Math.max(0, r1 - r2_ - 1);
    const n = d > r1 + r2_ ? 4 : d === r1 + r2_ ? 3 : d > r1 - r2_ ? 2 : d === r1 - r2_ ? 1 : 0;
    const ans = String(n);
    const o = shuffleOpts(rng, ans, ['0', '1', '2', '3', '4'].filter((x) => x !== ans).slice(0, 4).sort(() => rng() - 0.5).slice(0, 3));
    return { r1, r2: r2_, d, options: o.options, answer: o.answer, q: R`Two circles have radii $${r1}$ and $${r2_}$ and their centres are $${d}$ apart. How many common tangents do they have?`, sol: R`<p>Compare $d=${d}$ with $r_1+r_2=${r1 + r2_}$ and $|r_1-r_2|=${r1 - r2_}$. ${n === 4 ? 'd is larger than the sum: 4.' : n === 3 ? 'd equals the sum: 3.' : n === 2 ? 'd lies between the difference and the sum: 2.' : n === 1 ? 'd equals the difference: 1.' : 'd is smaller than the difference (one inside the other): 0.'}</p>` };
  }, (p) => { const s = p.r1 + p.r2, df = Math.abs(p.r1 - p.r2); const n = p.d > s ? 4 : p.d === s ? 3 : p.d > df ? 2 : p.d === df ? 1 : 0; return p.options.indexOf(String(n)); }),
  gen('ci-gx4', 4, 'nat', 'numeric', 'chord length', (rng) => {
    const h = int(rng, -4, 4), k = int(rng, -4, 4), r = int(rng, 4, 9), [p, q] = choose(rng, [[3, 4], [1, 1], [1, 2], [2, 1], [1, -1], [3, -4], [5, 12], [1, 0], [0, 1]]), cc = p * h + q * k + int(rng, -6, 6);
    const d = Math.abs(p * h + q * k - cc) / hyp(p, q); if (d >= r) throw RETRY;
    const len = 2 * sq(r * r - d * d);
    return { h, k, r, pp: p, qq: q, cc, answer: r2(len), tol: 0.01, q: R`Find the length of the chord cut from the circle with centre $(${h},${k})$ and radius $${r}$ by the line $${p === 0 ? '' : (p === 1 ? '' : p) + 'x'}${q === 0 ? '' : (q < 0 ? '-' : p === 0 ? '' : '+') + (Math.abs(q) === 1 ? '' : Math.abs(q)) + 'y'}=${cc}$. (2 decimal places)`, sol: R`<p>Distance of the centre from the line: $\dfrac{|${p}(${h})+${q}(${k})-${cc}|}{${r4(hyp(p, q))}}=${r4(d)}$.</p><p>Chord $=2\sqrt{r^2-d^2}=2\sqrt{${r * r}-${r4(d * d)}}=${r2(len)}$.</p>` };
  }, (p) => { const P = lineCircle(p.pp, p.qq, p.cc, p.h, p.k, p.r); return hyp(P[0][0] - P[1][0], P[0][1] - P[1][1]); }),
  gen('ci-gx5', 4, 'nat', 'numeric', 'chord of contact', (rng) => {
    const r = int(rng, 2, 7), d = int(rng, r + 1, r + 8), L = sq(d * d - r * r), ans = (2 * r * L) / d;
    return { r, d, answer: r2(ans), tol: 0.01, q: R`Tangents are drawn from the point $(${d},0)$ to the circle $x^2+y^2=${r * r}$. Find the length of the chord of contact. (2 decimal places)`, sol: R`<p>Tangent length $L=\sqrt{${d * d}-${r * r}}=${r4(L)}$. Chord of contact $=\dfrac{2rL}{d}=\dfrac{2\cdot${r}\cdot${r4(L)}}{${d}}=${r2(ans)}$.</p>` };
  }, (p) => { const x = (p.r * p.r) / p.d, y = sq(p.r * p.r - x * x); return 2 * y; }),
  gen('ci-gx6', 4, 'nat', 'integer', 'locus', (rng) => {
    const [k, d] = choose(rng, [[2, 3], [2, 6], [2, 9], [3, 8], [3, 16], [4, 15], [5, 12], [5, 24]]);
    const r = (k * d) / Math.abs(k * k - 1);
    if (!Number.isInteger(r)) throw RETRY;
    return { k, d, answer: r, tol: 0, q: R`A point $P$ moves so that $PA=${k}\,PB$ where $A=(0,0)$ and $B=(${d},0)$. The locus is a circle. Find its radius.`, sol: R`<p>$x^2+y^2=${k * k}\left[(x-${d})^2+y^2\right]$ gives $${k * k - 1}(x^2+y^2)-${2 * k * k * d}x+${k * k * d * d}=0$. Dividing: $x^2+y^2-\dfrac{${2 * k * k * d}}{${k * k - 1}}x+\dfrac{${k * k * d * d}}{${k * k - 1}}=0$.</p><p>Radius $=\dfrac{k\,d}{k^2-1}=\dfrac{${k}\cdot${d}}{${k * k - 1}}=${r}$.</p>` };
  }, (p) => { // the locus meets the x-axis where x^2 = k^2 (x - d)^2 : internal and external division points
    const x1 = (p.k * p.d) / (p.k + 1), x2 = (p.k * p.d) / (p.k - 1); return Math.round(Math.abs(x2 - x1) / 2); }),
  gen('ci-gx7', 4, 'nat', 'integer', 'circle through points', (rng) => {
    const h = int(rng, -4, 6), pts = choose(rng, [[[3, 4], [5, 0]], [[3, 4], [-3, 4]], [[0, 5], [4, 3]], [[5, 12], [13, 0]], [[3, 4], [4, 3]], [[0, 5], [-4, 3]], [[3, -4], [4, 3]]]);
    const P1 = [h + pts[0][0], pts[0][1]], P2 = [h + pts[1][0], pts[1][1]];
    if (P1[0] === P2[0]) throw RETRY;
    const r2v = pts[0][0] ** 2 + pts[0][1] ** 2;
    return { P1, P2, h, answer: r2v, tol: 0, q: R`A circle passes through $(${P1[0]},${P1[1]})$ and $(${P2[0]},${P2[1]})$ and its centre lies on the $x$-axis. Find the square of its radius.`, sol: R`<p>Centre $(a,0)$. $(a-${P1[0]})^2+${P1[1] ** 2}=(a-${P2[0]})^2+${P2[1] ** 2}$ gives $a=${h}$. $r^2=(${h}-${P1[0]})^2+${P1[1] ** 2}=${r2v}$.</p>` };
  }, (p) => { const a = (p.P2[0] ** 2 + p.P2[1] ** 2 - p.P1[0] ** 2 - p.P1[1] ** 2) / (2 * (p.P2[0] - p.P1[0])); return Math.round((a - p.P1[0]) ** 2 + p.P1[1] ** 2); }),
  gen('ci-gx8', 5, 'nat', 'numeric', 'common region', (rng) => {
    const r = int(rng, 1, 5), dd = choose(rng, [r, r * 1.5]);
    const al = acos(dd / (2 * r)), ans = 2 * r * r * al - (dd / 2) * sq(4 * r * r - dd * dd);
    return { r, d: dd, answer: r2(ans), tol: 0.01, q: R`Two circles of radius $${r}$ have centres $${dd}$ apart. Find the area common to both circles. (2 decimal places)`, sol: R`<p>Half-angle at each centre: $\alpha=\cos^{-1}\dfrac{d}{2r}=${r4(al)}$. Lens area $=2r^2\alpha-\dfrac d2\sqrt{4r^2-d^2}=${r4(2 * r * r * al)}-${r4((dd / 2) * sq(4 * r * r - dd * dd))}=${r2(ans)}$.</p>` };
  }, (p) => { let a = 0; const n = 300000, r = p.r, d = p.d; const lo = d - r, hi = r; for (let i = 0; i < n; i++) { const x = lo + ((i + 0.5) / n) * (hi - lo); a += (2 * Math.min(sq(Math.max(0, r * r - x * x)), sq(Math.max(0, r * r - (x - d) ** 2))) * (hi - lo)) / n; } return a; }),
  gen('ci-gx9', 5, 'nat', 'integer', 'lattice points', (rng) => {
    const N_ = choose(rng, [10, 13, 20, 25, 30, 36, 40, 50]);
    let c = 0; for (let x = -9; x <= 9; x++) for (let y = -9; y <= 9; y++) if (x * x + y * y <= N_) c++;
    return { N_, answer: c, tol: 0, q: R`Find the number of points $(x,y)$ with integer coordinates satisfying $x^2+y^2\le${N_}$.`, sol: R`<p>For each integer $x$ with $x^2\le${N_}$, the integers $y$ satisfy $|y|\le\lfloor\sqrt{${N_}-x^2}\rfloor$, giving $2\lfloor\sqrt{${N_}-x^2}\rfloor+1$ values. Adding over all $x$ gives $${c}$.</p>` };
  }, (p) => { let t = 0; for (let x = -Math.floor(sq(p.N_)); x <= Math.floor(sq(p.N_)); x++) t += 2 * Math.floor(sq(p.N_ - x * x) + 1e-9) + 1; return t; }),
  gen('ci-gx10', 4, 'mcq', 'single', 'diameter form', (rng) => {
    const x1 = int(rng, -5, 5), y1 = int(rng, -5, 5), x2 = int(rng, -5, 5), y2 = int(rng, -5, 5);
    if (x1 === x2 || y1 === y2) throw RETRY;
    const a = -(x1 + x2), b = -(y1 + y2), c = x1 * x2 + y1 * y2;
    const txt = (a_, b_, c_) => `$${circ(a_, b_, c_)}$`;
    const ans = txt(a, b, c);
    const o = shuffleOpts(rng, ans, [txt(-a, -b, c), txt(a, b, -c), txt(a / 2 === Math.round(a / 2) ? a / 2 : a + 1, b, c)]);
    return { x1, y1, x2, y2, a, b, c, options: o.options, answer: o.answer, q: R`The circle on the join of $(${x1},${y1})$ and $(${x2},${y2})$ as diameter is`, sol: R`<p>$(x-${x1})(x-${x2})+(y-${y1})(y-${y2})=0$ expands to ${ans}.</p>` };
  }, (p) => { // check the two end points satisfy the stated option and are diametrically opposite
    const want = `$${circ(-(p.x1 + p.x2), -(p.y1 + p.y2), p.x1 * p.x2 + p.y1 * p.y2)}$`; return p.options.indexOf(want); }),
];
const RETRY = new Error("retry");
const rtry = (make) => (rng) => { for (let i = 0; i < 200; i++) { try { return make(rng); } catch (e) { if (e !== RETRY) throw e; } } throw new Error('too many retries'); };
xgens.forEach((g_) => { g_.make = rtry(g_.make); });
gens.push(...xgens);

}

// ==L5-BEGIN (level 5 round: new top-rank items, groups and templates)
{
const LR = String.raw;
const LEX = ['jee-adv'];
let _v = 0; const LPOS = [1, 3, 0, 2, 2, 0, 3, 1, 3, 1];
let _vp = 0;
const lid = () => `ci-v5${String(++_v).padStart(2, '0')}`;
const lpl = (c, w) => { const p = LPOS[_vp++ % LPOS.length]; const o = [...w]; o.splice(p, 0, c); return { options: o, answer: p }; };
const lmk = (sub, extra) => ({ id: lid(), level: 5, exams: LEX, sub, ...extra });
const LI = (s, q, a, sol, trap, calc) => lmk(s, { type: 'nat', format: 'integer', q, answer: a, tol: 0, sol, trap, ...(calc ? { calc } : {}) });
const LN = (s, q, a, tol, sol, trap, calc) => lmk(s, { type: 'nat', format: 'numeric', q, answer: a, tol, sol, trap, ...(calc ? { calc } : {}) });
const LX = (s, q, options, answer, sol, trap) => lmk(s, { type: 'msq', format: 'multi', q, options, answer, sol, trap });
const LAO = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const LA = (s, a, r, answer, sol, trap) => lmk(s, { type: 'mcq', format: 'assertion', q: `<p><b>Assertion (A):</b> ${a}</p><p><b>Reason (R):</b> ${r}</p>`, options: LAO, answer, sol, trap });
const LSC = (s, lines, c, w, sol, trap) => lmk(s, { type: 'mcq', format: 'statements', q: `<ol>${lines.map((x) => `<li>${x}</li>`).join('')}</ol><p>How many of these statements are correct?</p>`, ...lpl(c, w), sol, trap });
const LMT = (s, group, c, w, sol, trap) => lmk(s, { type: 'mcq', format: 'match', group, q: 'Match List I with List II.', ...lpl(c, w), sol, trap });
const LPM = (s, group, q, c, w, sol, trap) => lmk(s, { type: 'mcq', format: 'passage', group, q, ...lpl(c, w), sol, trap });
const LPI = (s, group, q, a, sol, trap, calc) => lmk(s, { type: 'nat', format: 'passage', group, q, answer: a, tol: 0, sol, trap, ...(calc ? { calc } : {}) });
const LPN = (s, group, q, a, tol, sol, trap, calc) => lmk(s, { type: 'nat', format: 'passage', group, q, answer: a, tol, sol, trap, ...(calc ? { calc } : {}) });
const LG = (id, type, format, sub, make, verify) => ({ id, type, format, level: 5, exams: LEX, sub, make, ...(verify ? { verify } : {}) });

Object.assign(groups, {
  v5m1: { title: 'Loci of centres of touching circles', passage: LR`<p>A variable circle touches the given circles or line as described in List I. Match each description with the curve traced by the centre of the variable circle (List II).</p>`,
    list1: ['A. touches $x^2+y^2=1$ and $(x-8)^2+y^2=9$, both externally', 'B. touches $x^2+y^2=1$ externally and the line $x=3$, lying to the left of that line', 'C. touches $x^2+y^2=1$ and $(x-4)^2+y^2=1$, both externally', 'D. touches $(x-2)^2+y^2=36$ internally and $x^2+y^2=1$ externally'],
    list2: ['p. a straight line', 'q. one branch of a hyperbola', 'r. an ellipse', 's. a circle', 't. a parabola'] },
  v5m2: { title: 'Two circles and a parameter', passage: LR`<p>Let $S_1:\ x^2+y^2=4$ and $S_2:\ x^2+y^2-6x-8y+k=0$. Match each condition in List I with the value of $k$ in List II.</p>`,
    list1: ['A. $S_2$ touches $S_1$ externally', 'B. $S_2$ touches $S_1$ internally', 'C. $S_2$ cuts $S_1$ orthogonally', 'D. $S_2$ bisects the circumference of $S_1$'],
    list2: ['p. $-24$', 'q. $-4$', 'r. $4$', 's. $16$', 't. $25$'] },
  v5p1: { title: 'Passage: chords that subtend a right angle', passage: LR`<p>A variable chord $AB$ of the circle $x^2+y^2=25$ subtends a right angle at the point $P(2,0)$ inside the circle (that is, $\angle APB=90^\circ$). Let $M$ be the mid-point of $AB$.</p>` },
});

items.push(
  LI('lattice points', LR`How many points $(x,y)$ with integer coordinates lie <b>on</b> the circle $x^2+y^2=325$?`, 24,
    LR`<p>Idea: list the ways to write $325$ as a sum of two squares, then count sign and order changes.</p><p>$325=1+324=36+289=100+225$, i.e. $(1,18)$, $(6,17)$, $(10,15)$. None of these has a zero coordinate or equal coordinates, so each gives $8$ points ($\pm$ signs, and swapping $x,y$).</p><p>Total $3\times8=24$. (Check with the formula: $325=5^2\cdot13$ has $6$ divisors, all of the form $4m+1$, so $r_2=4\cdot6=24$.)</p>`,
    'Counting only the first-quadrant points, or forgetting the swap $(x,y)\\to(y,x)$ that doubles the count.',
    () => { let c = 0; for (let x = -18; x <= 18; x++) for (let y = -18; y <= 18; y++) if (x * x + y * y === 325) c++; return c; }),
  LI('chords through a point', LR`Through the point $(3,0)$, chords are drawn in the circle $x^2+y^2=25$. How many of these chords have an integer length?`, 4,
    LR`<p>Idea: the shortest chord through an interior point is perpendicular to the line from the centre; the longest is the diameter.</p><p>Shortest: $2\sqrt{25-3^2}=8$. Longest: $10$. Lengths between $8$ and $10$ occur on both sides of the shortest chord (two chords each), the extreme lengths only once.</p><p>Length $8$: $1$ chord. Length $9$: $2$ chords. Length $10$: $1$ chord (the diameter).</p><p>Total $1+2+1=4$.</p>`,
    'Counting length 9 only once (the answer 3), or counting 8 and 10 twice.',
    () => { let c = 0; for (let L = 1; L <= 10; L++) { const h = Math.sqrt(25 - L * L / 4); if (Math.abs(h - 3) < 1e-9) c += 1; else if (h < 3) c += h < 1e-9 ? 1 : 2; } return c; }),
  LI('circles bisecting a circumference', LR`A circle bisects the circumference of $x^2+y^2=4$ and its centre lies on the line $3x+4y=25$. Find the square of the least possible radius of such a circle.`, 29,
    LR`<p>Idea: the circle $S$ with centre $C$ and radius $\rho$ bisects the circumference of the circle $S'$ (centre $O$, radius $2$) when their common chord is a diameter of $S'$, so $O$ is on the radical axis.</p><p>Then the power of $O$ with respect to $S$ equals its power with respect to $S'$: $OC^2-\rho^2=0-2^2$, so $\rho^2=OC^2+4$.</p><p>$OC$ is smallest when $C$ is the foot of the perpendicular from $O$ to $3x+4y=25$: $OC=\dfrac{25}{5}=5$.</p><p>$\rho^2=25+4=29$.</p>`,
    'Taking $\\rho=OC$ (the smallest circle centred on the line) and forgetting the extra $r^2=4$.',
    () => { let best = 1e9; for (let t = -20; t < 20; t += 0.001) { const y = (25 - 3 * t) / 4; best = Math.min(best, t * t + y * y + 4); } return Math.round(best); }),
  LN('concyclic points on the axes', LR`The line $\dfrac x4+\dfrac y3=1$ meets the axes at $A,B$, and the line $\dfrac x6+\dfrac yk=1$ meets them at $C,D$ ($A,C$ on the $x$-axis). The four points $A,B,C,D$ are concyclic. Find the radius of the circle through them (2 decimal places).`, 5.59, 0.01,
    LR`<p>Idea: use the power of the origin. $O$ lies on lines $AC$ and $BD$ (the two axes), so $OA\cdot OC=OB\cdot OD$.</p><p>$4\cdot6=3\cdot k$, so $k=8$. The points are $(4,0),(6,0),(0,3),(0,8)$.</p><p>Circle $x^2+y^2+Dx+Ey+F=0$: on the $x$-axis the roots of $x^2+Dx+F=0$ are $4,6$, so $D=-10$, $F=24$; on the $y$-axis the roots of $y^2+Ey+F=0$ are $3,8$, so $E=-11$ and $F=24$ agrees.</p><p>Centre $(5,5.5)$, $r^2=25+30.25-24=31.25$, $r=\sqrt{31.25}\approx5.59$.</p>`,
    'Forgetting that the intercepts on one axis must multiply to the same constant $F$; any other $k$ gives no common circle.',
    () => +Math.sqrt(31.25).toFixed(2)),
  LN('touching circles', LR`Three circles of radius $1$ touch one another externally. A larger circle touches all three of them internally (all three lie inside it). Find the radius of the larger circle (2 decimal places).`, 2.15, 0.01,
    LR`<p>Idea: the three centres form an equilateral triangle of side $2$; the large circle's centre is the triangle's centre.</p><p>Circumradius of the triangle $=\dfrac{2}{\sqrt3}\approx1.1547$.</p><p>The big circle touches each small circle internally, so its radius is the distance to a small centre plus the small radius: $1+\dfrac2{\sqrt3}\approx2.15$.</p>`,
    'Using $\\frac{2}{\\sqrt3}$ alone (forgetting the radius $1$ of the small circle) gives $1.15$.',
    () => +(1 + 2 / Math.sqrt(3)).toFixed(2)),
  LX('family of circles', LR`Consider the family of circles $x^2+y^2-4+\lambda(x+y-2)=0$, $\lambda$ real, through the intersection of $x^2+y^2=4$ and $x+y=2$. Which statements are true?`,
    ['Every member passes through $(2,0)$ and $(0,2)$', 'The member of least radius has radius $\\sqrt2$', 'Some member passes through $(1,1)$', 'Some member touches both coordinate axes'],
    [0, 1, 3],
    LR`<p>The line meets the circle where $x+y=2$ and $x^2+y^2=4$: at $(2,0)$ and $(0,2)$. Every member passes through both.</p><p>Radius: centre $(-\frac\lambda2,-\frac\lambda2)$, $\rho^2=\frac{\lambda^2}2+2\lambda+4=\frac{(\lambda+2)^2}2+2\ge2$, least at $\lambda=-2$: radius $\sqrt2$. True.</p><p>$(1,1)$: substitute: $2-4+\lambda(0)=-2\ne0$ for every $\lambda$. False. (It lies on the line but is not one of the two common points.)</p><p>$\lambda=-4$ gives $x^2+y^2-4x-4y+4=0$: centre $(2,2)$, radius $2$, so it touches both axes (at $(2,0)$ and $(0,2)$). True.</p>`,
    '$(1,1)$ is on the line $x+y=2$, but the line term vanishes there, so the circle part $-2$ never cancels.'),
  LX('pole and polar', LR`For the circle $S:\ x^2+y^2=25$, which statements are true?`,
    ['The points $(1,2)$ and $(3,11)$ are conjugate points with respect to $S$', 'The circle on the join of $(1,2)$ and $(3,11)$ as diameter cuts $S$ orthogonally', 'The chord of contact of the tangents from $(10,0)$ has length $5\\sqrt3$', 'The points $(3,4)$ and $(4,3)$ are conjugate points with respect to $S$'],
    [0, 1, 2],
    LR`<p>Points $(x_1,y_1)$ and $(x_2,y_2)$ are conjugate when $x_1x_2+y_1y_2=r^2$ (each lies on the other's polar).</p><ul><li>$1\cdot3+2\cdot11=25$: conjugate. True.</li><li>Circle on the join as diameter: $(x-1)(x-3)+(y-2)(y-11)=0$, i.e. $x^2+y^2-4x-13y+25=0$. For orthogonality with $x^2+y^2-25=0$: $2g_1g_2+2f_1f_2=0$ and $c_1+c_2=25-25=0$. They agree, so it is orthogonal. True.</li><li>Chord of contact of $(10,0)$: $x=2.5$; length $2\sqrt{25-6.25}=2\sqrt{18.75}=5\sqrt3$. True.</li><li>$3\cdot4+4\cdot3=24\ne25$: not conjugate. False.</li></ul>`,
    'Mixing up "on the circle" with "conjugate": both $(3,4)$ and $(4,3)$ lie on $S$, yet they are not conjugate to each other.'),
  LX('tangent lengths', LR`Tangents are drawn to $x^2+y^2=9$ from points $P$ on the line $x+y=8$. Which statements are true?`,
    ['The least length of a tangent is $\\sqrt{23}$', 'The least tangent length occurs at $P=(4,4)$', 'Every chord of contact passes through the fixed point $\\left(\\dfrac94,\\dfrac94\\right)$', 'Every chord of contact passes through a fixed point that lies inside the circle'],
    [0, 1, 3],
    LR`<p>Tangent length from $P$: $\sqrt{OP^2-9}$. It is least when $OP$ is least, i.e. at the foot of the perpendicular from $O$: $P=(4,4)$, $OP^2=32$, length $\sqrt{23}$. First two true.</p><p>Chord of contact of $P(h,8-h)$: $hx+(8-h)y=9$, i.e. $h(x-y)+8y-9=0$ for all $h$. So $x=y$ and $8y=9$: the fixed point is $\left(\frac98,\frac98\right)$. So the third option is false.</p><p>Is $\left(\frac98,\frac98\right)$ inside $x^2+y^2=9$? $2\cdot\frac{81}{64}\approx2.53<9$. Yes. True.</p>`,
    'The fixed point is the pole of the line, $\\frac{9}{8}$ in each coordinate (it is $r^2/8$), not $\\frac{9}{4}$.'),
  LMT('loci of centres', 'v5m1', 'A-q, B-t, C-p, D-r', ['A-t, B-q, C-p, D-r', 'A-q, B-p, C-t, D-s', 'A-r, B-t, C-p, D-q'],
    LR`<p>A. Radii $1$ and $3$: $CC_2=\rho+3$, $CC_1=\rho+1$, so $CC_2-CC_1=2$, less than the distance $8$ between centres: one branch of a hyperbola (q).</p><p>B. $CO=\rho+1$ and the distance to the line $x=3$ is $\rho$, so $CO=(3-x)+1=4-x$: $C$ is equidistant from $O$ and the line $x=4$: a parabola (t).</p><p>C. $CC_1=\rho+1=CC_2$: the perpendicular bisector $x=2$ (p).</p><p>D. Centre $C$ inside the big circle: $CC_2=6-\rho$ and $CC_1=1+\rho$, sum $7$, greater than $C_1C_2=2$: an ellipse (r).</p>`,
    'Treating "touch internally" like "touch externally" in D: the sum of the focal distances is constant, not the difference.'),
  LMT('two circles and a parameter', 'v5m2', 'A-s, B-p, C-r, D-q', ['A-p, B-s, C-r, D-q', 'A-s, B-p, C-q, D-r', 'A-s, B-r, C-p, D-q'],
    LR`<p>$S_2$ has centre $(3,4)$ and radius $\sqrt{25-k}$; the distance between centres is $5$; $S_1$ has radius $2$.</p><p>A. External touch: $5=2+\sqrt{25-k}$, radius $3$, $k=16$ (s).</p><p>B. Internal touch: $5=\sqrt{25-k}-2$, radius $7$, $k=25-49=-24$ (p). (The other case, $\sqrt{25-k}=-3$, is impossible.)</p><p>C. Orthogonal: $2g_1g_2+2f_1f_2=c_1+c_2$ gives $0=-4+k$, $k=4$ (r).</p><p>D. Bisecting: the common chord $S_2-S_1=-6x-8y+k+4=0$ must pass through the centre $O$ of $S_1$: $k=-4$ (q).</p>`,
    'Mixing up the orthogonal condition (which has $c_1+c_2$) with the bisecting condition (radical axis through the other centre).'),
  LPM('locus', 'v5p1', LR`The locus of $M$ is`, '$2x^2+2y^2-4x-21=0$', ['$x^2+y^2-4x-21=0$', '$2x^2+2y^2-4x-29=0$', '$2x^2+2y^2+4x-21=0$'],
    LR`<p>In the right triangle $APB$ the mid-point $M$ of the hypotenuse is its circumcentre, so $MP=MA$.</p><p>In the circle, $OM\perp AB$, so $OM^2+MA^2=25$. With $M=(x,y)$:</p><p>$x^2+y^2+(x-2)^2+y^2=25\Rightarrow2x^2+2y^2-4x-21=0$, a circle with centre $(1,0)$ and radius squared $1+\dfrac{21}2=\dfrac{23}2$.</p>`,
    'Writing $MA=MP$ but then using $OM^2+MA^2=100$ or forgetting the half-chord.'),
  LPN('locus', 'v5p1', LR`Find the greatest possible length of $AB$ (2 decimal places).`, 8.78, 0.01,
    LR`<p>$AB=2\,MA=2\,MP$. $M$ lies on the circle of centre $(1,0)$ and radius $\sqrt{23/2}\approx3.391$ (from the locus).</p><p>$MP$ is greatest when $M$ is the point of that circle farthest from $P(2,0)$: $MP_{\max}=1+3.391=4.391$ ($P$ is $1$ unit from the centre).</p><p>$AB_{\max}=2\times4.391\approx8.78$.</p>`,
    'The greatest chord of the big circle is $10$, but a chord that subtends a right angle at $P$ cannot be the diameter.',
    () => +(2 * (1 + Math.sqrt(11.5))).toFixed(2)),
  LPI('locus', 'v5p1', LR`For how many whole numbers $L$ is there a chord $AB$ of length exactly $L$ subtending a right angle at $P$?`, 4,
    LR`<p>$AB=2MP$ and $MP$ takes every value between $r-1$ and $r+1$ as $M$ goes round the locus circle (radius $r=\sqrt{23/2}\approx3.391$, centre $1$ unit from $P$).</p><p>So $AB$ takes every value from $2(r-1)\approx4.78$ to $2(r+1)\approx8.78$.</p><p>The whole numbers in that range: $5,6,7,8$. Answer $4$.</p>`,
    'The range of $AB$ is closed and continuous, so each whole number inside it is attained; do not stop at 5 and 8 only.',
    () => { const r = Math.sqrt(11.5); let c = 0; for (let L = 1; L <= 10; L++) if (L >= 2 * (r - 1) && L <= 2 * (r + 1)) c++; return c; }),
  LA('loci of centres', LR`The locus of the centre of a circle of radius $2$ that touches $x^2+y^2=1$ is the single circle $x^2+y^2=9$.`,
    LR`If two circles touch internally, the distance between their centres equals the difference of their radii.`, 3,
    LR`<p>R is true.</p><p>A: touching externally gives $OC=2+1=3$, the circle $x^2+y^2=9$. But the circle of radius $2$ can also touch the unit circle internally (the unit circle inside it): $OC=2-1=1$, the circle $x^2+y^2=1$. The full locus is both circles, so "the single circle $x^2+y^2=9$" is false.</p>`,
    'Taking "touches" to mean externally only.'),
  LSC('pole and polar and tangents', ['The polar of a point inside a circle lies entirely outside the circle.', 'The shortest chord through an interior point $P$ (not the centre) is perpendicular to the line joining $P$ to the centre.', 'If two circles touch externally, their radical axis is one of their three common tangents.', 'Two circles that cut each other orthogonally have exactly four common tangents.'],
    '3', ['1', '2', '4'],
    LR`<p>(1) True: for a point at distance $d<r$ from the centre the polar is at distance $r^2/d>r$.</p><p>(2) True: the chord at distance $h$ from the centre has length $2\sqrt{r^2-h^2}$; $h$ is greatest, $=OP$, when the chord is perpendicular to $OP$.</p><p>(3) True: the radical axis is the common tangent at the point of contact, one of the three.</p><p>(4) False: orthogonal circles intersect at two points, so they have only two (direct) common tangents.</p><p>Three are correct.</p>`,
    'Four common tangents need the circles to be completely separate; intersecting circles (even orthogonal ones) have only 2.'),
);

gens.push(
  LG('ci-v5g1', 'nat', 'integer', 'lattice points', (rng) => {
    const n = choose(rng, [25, 50, 65, 85, 100, 125, 130, 145, 169, 185, 205, 225, 325, 425, 625]);
    let a = 0; for (let d = 1; d <= n; d++) if (n % d === 0) { if (d % 4 === 1) a++; else if (d % 4 === 3) a--; } const ans = 4 * a;
    return { n, answer: ans, tol: 0, q: LR`How many points with integer coordinates lie on the circle $x^2+y^2=${n}$?`,
      sol: LR`<p>The number of ways to write $${n}$ as $x^2+y^2$ with integers $x,y$ (counting signs and order) is $4\,(d_1-d_3)$, where $d_1$ and $d_3$ count the divisors of $${n}$ leaving remainder $1$ and $3$ on division by $4$. Here $d_1-d_3=${a}$, so the answer is $${ans}$.</p><p>(Check by listing: find the squares $a^2$ up to $${n}$ for which $${n}-a^2$ is also a square, then count signs and the swap of the two coordinates.)</p>` };
  }, (p) => { let c = 0; const r = Math.floor(Math.sqrt(p.n)); for (let x = -r; x <= r; x++) for (let y = -r; y <= r; y++) if (x * x + y * y === p.n) c++; return c; }),
  LG('ci-v5g2', 'nat', 'integer', 'chords through a point', (rng) => {
    const [R, d] = choose(rng, [[5, 3], [13, 5], [13, 12], [10, 6], [15, 9], [17, 8], [25, 7], [20, 12], [26, 10]]);
    const lo2 = 4 * (R * R - d * d); const rt = Math.sqrt(lo2); const loInt = Number.isInteger(rt);
    let c = 0; for (let L = Math.ceil(rt) + (loInt ? 1 : 0); L < 2 * R; L++) c += 2; c += 1; if (loInt) c += 1;
    const minL = loInt ? `${rt}` : `2\\sqrt{${R * R - d * d}}\\approx${(rt).toFixed(2)}`;
    return { R, d, answer: c, tol: 0, q: LR`Chords of the circle $x^2+y^2=${R * R}$ are drawn through the point $(${d},0)$. How many of them have integer length?`,
      sol: LR`<p>The shortest chord through the point is perpendicular to the x-axis: length $${minL}$. The longest is the diameter, $${2 * R}$. Each integer length strictly between these occurs for two chords (one on each side of the shortest); the shortest chord (if its length is an integer) and the diameter occur once each.</p><p>Total $=${c}$.</p>` };
  }, (p) => { let c = 0; for (let L = 1; L <= 2 * p.R; L++) { const h2 = p.R * p.R - L * L / 4; const h = Math.sqrt(Math.max(h2, 0)); if (Math.abs(h - p.d) < 1e-9) c += 1; else if (h < p.d) c += h < 1e-9 ? 1 : 2; } return c; }),
  LG('ci-v5g3', 'nat', 'numeric', 'circles bisecting a circumference', (rng) => {
    const [p, q, nn] = choose(rng, [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]); const m = int(rng, 2, 6); const r0 = int(rng, 2, 7);
    const c = nn * m; const dist = m; const rho = Math.sqrt(dist * dist + r0 * r0);
    return { pp: p, qq: q, c, r0, answer: +rho.toFixed(2), tol: 0.01, q: LR`A circle bisects the circumference of $x^2+y^2=${r0 * r0}$ and its centre lies on the line $${p}x+${q}y=${c}$. Find the least possible radius (2 decimal places).`,
      sol: LR`<p>A circle (centre $C$, radius $\rho$) bisecting the circumference of the circle centred at $O$ with radius $${r0}$ satisfies $\rho^2=OC^2+${r0}^2$. The least $OC$ is the distance from $O$ to the line: $\dfrac{${c}}{\sqrt{${p}^2+${q}^2}}=\dfrac{${c}}{${nn}}=${dist}$.</p><p>$\rho=\sqrt{${dist}^2+${r0}^2}=\sqrt{${dist * dist + r0 * r0}}\approx${rho.toFixed(2)}$.</p>` };
  }, (p) => { let best = 1e18; for (let t = -60; t < 60; t += 0.002) { const x = t, y = (p.c - p.pp * x) / p.qq; best = Math.min(best, x * x + y * y + p.r0 * p.r0); } return +Math.sqrt(best).toFixed(2); }),
);
}
// ==L5-END
// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({ topic: 'circles', groups, items, gens }, ['ci-g13', 'ci-gx1', 'ci-gx4', 'ci-gx7', 'ci-gx10']);
