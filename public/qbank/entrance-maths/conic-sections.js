import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

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
const nid = () => `cs-${String(++_k).padStart(3, '0')}`;
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
const R2 = String.raw;
const sh = (n) => (n < 0 ? `(${n})` : `${n}`);
const groups = {
  m1: {
    title: 'Eccentricity',
    passage: String.raw`<p>Match each conic in List I with its eccentricity in List II.</p>`,
    list1: ['A. $\\dfrac{x^2}{25}+\\dfrac{y^2}{16}=1$', 'B. $\\dfrac{x^2}{16}-\\dfrac{y^2}{9}=1$', 'C. $y^2=12x$', 'D. $xy=8$'],
    list2: ['p. $1$', 'q. $\\dfrac35$', 'r. $\\dfrac54$', 's. $\\sqrt2$'],
  },
  m2: {
    title: 'Length of the latus rectum',
    passage: String.raw`<p>Match each parabola in List I with the length of its latus rectum in List II.</p>`,
    list1: ['A. $y^2=4x$', 'B. $x^2=12y$', 'C. $y^2=-6x$', 'D. $(x-1)^2=8(y+2)$'],
    list2: ['p. $4$', 'q. $6$', 'r. $8$', 's. $12$'],
  },
  m3: {
    title: 'Lines and the ellipse $\\dfrac{x^2}{9}+\\dfrac{y^2}{4}=1$',
    passage: String.raw`<p>Match each line in List I with how it meets the ellipse $\dfrac{x^2}{9}+\dfrac{y^2}{4}=1$ (List II).</p>`,
    list1: ['A. $x=3$', 'B. $y=x+\\sqrt{13}$', 'C. $y=x+4$', 'D. $y=x$'],
    list2: ['p. Touches at an end of the major axis', 'q. Touches at a point that is not an end of an axis', 'r. Does not meet the ellipse', 's. Passes through the centre'],
  },
  m4: {
    title: 'Director circles',
    passage: String.raw`<p>The locus of the point from which two perpendicular tangents can be drawn is the director curve. Match each conic in List I with its director curve in List II.</p>`,
    list1: ['A. $\\dfrac{x^2}{16}+\\dfrac{y^2}{9}=1$', 'B. $\\dfrac{x^2}{16}-\\dfrac{y^2}{9}=1$', 'C. $y^2=8x$', 'D. $x^2-y^2=4$'],
    list2: ['p. the line $x=-2$', 'q. $x^2+y^2=25$', 'r. a single point (the origin)', 's. $x^2+y^2=7$'],
  },
  p1: {
    title: 'Passage: a focal chord of a parabola',
    passage: String.raw`<p>$PQ$ is a focal chord of the parabola $y^2=8x$ with $P=(8,8)$ and $F$ is the focus. The tangents at $P$ and $Q$ meet at $R$.</p>`,
  },
  p2: {
    title: 'Passage: an ellipse and its foci',
    passage: String.raw`<p>The ellipse $\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$ has foci $F_1$ and $F_2$. The point $P=\left(4,\dfrac{12}{5}\right)$ lies on it.</p>`,
  },
  p3: {
    title: 'Passage: a hyperbola',
    passage: String.raw`<p>Consider the hyperbola $H:\ \dfrac{x^2}{16}-\dfrac{y^2}{9}=1$.</p>`,
  },
};

const items = [
  // ---------- L1 ----------
  M(1, 'parabola: focus', String.raw`The focus of the parabola $y^2=12x$ is`, '$(3,0)$', ['$(12,0)$', '$(6,0)$', '$(0,3)$'],
    String.raw`<p>Compare with $y^2=4ax$: $4a=12$, so $a=3$. The focus is $(a,0)=(3,0)$.</p>`, 'Divide by 4 to get $a$.'),
  M(1, 'parabola: directrix', String.raw`The directrix of the parabola $y^2=8x$ is`, '$x=-2$', ['$x=2$', '$x=-8$', '$y=-2$'],
    String.raw`<p>$4a=8$, so $a=2$. The directrix is $x=-a=-2$.</p>`, 'The directrix is on the opposite side of the vertex from the focus.'),
  I(1, 'parabola: latus rectum', String.raw`Find the length of the latus rectum of $y^2=20x$.`, 20,
    String.raw`<p>For $y^2=4ax$ the latus rectum is $4a$, which is the coefficient of $x$: $20$.</p>`, 'The latus rectum equals $4a$, not $a$.', { calc: () => 20 }),
  M(1, 'parabola: equation', String.raw`The parabola with vertex at the origin and focus $(2,0)$ is`, '$y^2=8x$', ['$y^2=4x$', '$x^2=8y$', '$y^2=2x$'],
    String.raw`<p>The focus is $(a,0)$ with $a=2$, so $y^2=4ax=8x$.</p>`, 'Use $4a$, not $a$.'),
  M(1, 'parabola: focus', String.raw`The focus of the parabola $x^2=16y$ is`, '$(0,4)$', ['$(4,0)$', '$(0,16)$', '$(0,8)$'],
    String.raw`<p>$x^2=4ay$ with $4a=16$ gives $a=4$. The axis is the y-axis, so the focus is $(0,4)$.</p>`, 'Here the axis is vertical.'),
  I(1, 'ellipse: axes', String.raw`Find the length of the major axis of $\dfrac{x^2}{25}+\dfrac{y^2}{9}=1$.`, 10,
    String.raw`<p>$a^2=25$, so $a=5$ and the major axis is $2a=10$.</p>`, 'The major axis is $2a$, not $a$.', { calc: () => 2 * 5 }),
  M(1, 'ellipse: eccentricity', String.raw`The eccentricity of $\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$ is`, R2`$\dfrac35$`, [R2`$\dfrac45$`, R2`$\dfrac{3}{4}$`, R2`$\dfrac{9}{25}$`],
    String.raw`<p>$e=\sqrt{1-\dfrac{b^2}{a^2}}=\sqrt{1-\dfrac{16}{25}}=\dfrac35$.</p>`, 'Under the root put $1-b^2/a^2$.'),
  I(1, 'hyperbola: foci', String.raw`Find the distance between the foci of $\dfrac{x^2}{9}-\dfrac{y^2}{16}=1$.`, 10,
    String.raw`<p>$e^2=1+\dfrac{b^2}{a^2}$, so $c^2=a^2+b^2=9+16=25$. The foci are $(\pm5,0)$ and are $10$ apart.</p>`, 'For a hyperbola $c^2=a^2+b^2$.', { calc: () => 2 * Math.sqrt(9 + 16) }),
  M(1, 'rectangular hyperbola', String.raw`The eccentricity of a rectangular hyperbola is`, R2`$\sqrt2$`, ['$1$', R2`$\dfrac{1}{\sqrt2}$`, '$2$'],
    String.raw`<p>Rectangular means $a=b$. Then $e=\sqrt{1+\dfrac{b^2}{a^2}}=\sqrt2$.</p>`, 'Ellipses have $e<1$, so $\\dfrac1{\\sqrt2}$ cannot be a hyperbola.'),
  M(1, 'hyperbola: asymptotes', String.raw`The asymptotes of $\dfrac{x^2}{4}-\dfrac{y^2}{9}=1$ are`, R2`$y=\pm\dfrac32x$`, [R2`$y=\pm\dfrac23x$`, R2`$y=\pm\dfrac49x$`, R2`$y=\pm\dfrac94x$`],
    String.raw`<p>The asymptotes are $y=\pm\dfrac bax$ with $a=2$, $b=3$: $y=\pm\dfrac32x$.</p>`, 'Slope is $b/a$ for $x^2/a^2-y^2/b^2=1$.'),
  M(1, 'identifying a conic', String.raw`The equation $4x^2+9y^2=36$ represents`, 'an ellipse', ['a circle', 'a hyperbola', 'a parabola'],
    String.raw`<p>Divide by 36: $\dfrac{x^2}{9}+\dfrac{y^2}{4}=1$. Both terms are positive with different denominators: an ellipse.</p>`, 'Equal denominators would make a circle.'),
  I(1, 'parabola: equation', String.raw`The parabola $y^2=4ax$ passes through $(4,8)$. Find $a$.`, 4,
    String.raw`<p>$64=4a\cdot4$, so $a=4$.</p>`, 'Put $y=8$ and $x=4$.', { calc: () => 64 / 16 }),
  I(1, 'ellipse: foci', String.raw`Find the distance between the foci of $\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$.`, 6,
    String.raw`<p>$c^2=a^2-b^2=25-16=9$, so $c=3$. Foci $(\pm3,0)$ are $6$ apart.</p>`, 'For an ellipse $c^2=a^2-b^2$.', { calc: () => 2 * Math.sqrt(25 - 16) }),
  M(1, 'conic from eccentricity', String.raw`A conic with eccentricity exactly 1 is a`, 'parabola', ['circle', 'ellipse', 'hyperbola'],
    String.raw`<p>A circle has $e=0$, an ellipse $0<e<1$, a parabola $e=1$ and a hyperbola $e>1$.</p>`, 'Remember the order $0,<1,=1,>1$.'),
  I(1, 'hyperbola: axes', String.raw`Find the length of the transverse axis of $\dfrac{x^2}{16}-\dfrac{y^2}{9}=1$.`, 8,
    String.raw`<p>$a^2=16$, $a=4$, transverse axis $=2a=8$.</p>`, 'Transverse axis uses $a$, the denominator under the positive term.', { calc: () => 8 }),

  // ---------- L2 ----------
  I(2, 'parabola: focal distance', String.raw`A point on $y^2=8x$ has x-coordinate 3. Find its distance from the focus.`, 5,
    String.raw`<p>$a=2$. For a point $(x_1,y_1)$ the focal distance is $x_1+a=3+2=5$. (Check: $y_1^2=24$, distance to $(2,0)$ is $\sqrt{1+24}=5$.)</p>`, 'Focal distance is $x+a$, equal to the distance from the directrix.', { calc: () => Math.hypot(3 - 2, Math.sqrt(24)) }),
  I(2, 'parabola: focal distance', String.raw`A point on $y^2=16x$ is 10 units from the focus. Find its x-coordinate.`, 6,
    String.raw`<p>$a=4$. Focal distance $=x+a=10$, so $x=6$.</p>`, 'Use the directrix distance.', { calc: () => 10 - 4 }),
  M(2, 'parabola: tangent', String.raw`The tangent to $y^2=4x$ at $(1,2)$ is`, '$y=x+1$', ['$y=x-1$', '$y=2x$', '$y=-x+3$'],
    String.raw`<p>Tangent at $(x_1,y_1)$: $yy_1=2a(x+x_1)$. With $a=1$: $2y=2(x+1)$, so $y=x+1$.</p>`, 'Check that the line passes through $(1,2)$: $2=1+1$.'),
  M(2, 'parabola: tangent slope', String.raw`The tangent to $y^2=8x$ with slope 2 is`, '$y=2x+1$', ['$y=2x+4$', '$y=2x-1$', '$y=2x+2$'],
    String.raw`<p>Tangent with slope $m$: $y=mx+\dfrac am$. With $a=2$, $m=2$: $y=2x+1$.</p>`, '$a/m=1$, not $am=4$.'),
  I(2, 'parabola: tangent condition', String.raw`The line $y=x+c$ touches $y^2=12x$. Find $c$.`, 3,
    String.raw`<p>$a=3$, $m=1$: $c=\dfrac am=3$. (Check: $(x+3)^2=12x$ gives $(x-3)^2=0$, a double root.)</p>`, 'The condition is $c=a/m$.', { calc: () => 3 / 1 }),
  I(2, 'ellipse: equation', String.raw`The ellipse $\dfrac{x^2}{25}+\dfrac{y^2}{b^2}=1$ passes through $\left(4,\dfrac95\right)$. Find $b^2$.`, 9,
    String.raw`<p>$\dfrac{16}{25}+\dfrac{81/25}{b^2}=1$, so $\dfrac{81}{25b^2}=\dfrac9{25}$ and $b^2=9$.</p>`, 'Square $\\dfrac95$ before dividing.', { calc: () => (81 / 25) / (1 - 16 / 25) }),
  I(2, 'ellipse: focal distances', String.raw`Find the sum of the distances of any point of the ellipse $9x^2+16y^2=144$ from its two foci.`, 8,
    String.raw`<p>Divide by 144: $\dfrac{x^2}{16}+\dfrac{y^2}{9}=1$, so $a=4$. The sum is $2a=8$.</p>`, 'The sum is $2a$ whatever the point.', { calc: () => 2 * 4 }),
  M(2, 'ellipse: equation', String.raw`The ellipse with foci $(\pm4,0)$ and major axis of length 10 is`, R2`$\dfrac{x^2}{25}+\dfrac{y^2}{9}=1$`, [R2`$\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$`, R2`$\dfrac{x^2}{25}+\dfrac{y^2}{41}=1$`, R2`$\dfrac{x^2}{9}+\dfrac{y^2}{25}=1$`],
    String.raw`<p>$2a=10$, so $a=5$ and $c=4$. $b^2=a^2-c^2=25-16=9$. The equation is $\dfrac{x^2}{25}+\dfrac{y^2}{9}=1$.</p>`, '$b^2=a^2-c^2$ for an ellipse.'),
  M(2, 'hyperbola: equation', String.raw`The hyperbola with foci $(\pm5,0)$ and eccentricity $\dfrac54$ is`, R2`$\dfrac{x^2}{16}-\dfrac{y^2}{9}=1$`, [R2`$\dfrac{x^2}{9}-\dfrac{y^2}{16}=1$`, R2`$\dfrac{x^2}{25}-\dfrac{y^2}{16}=1$`, R2`$\dfrac{x^2}{16}+\dfrac{y^2}{9}=1$`],
    String.raw`<p>$ae=5$ and $e=\dfrac54$, so $a=4$. $b^2=c^2-a^2=25-16=9$. Equation: $\dfrac{x^2}{16}-\dfrac{y^2}{9}=1$.</p>`, 'Use $b^2=c^2-a^2$ for a hyperbola.'),
  M(2, 'ellipse: tangent', String.raw`The tangent to $\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$ at $\left(3,\dfrac{16}5\right)$ is`, '$3x+5y=25$', ['$3x+5y=5$', '$5x+3y=25$', '$3x+16y=25$'],
    String.raw`<p>Tangent at $(x_1,y_1)$: $\dfrac{xx_1}{25}+\dfrac{yy_1}{16}=1$. $\dfrac{3x}{25}+\dfrac{16y/5}{16}=1$ gives $\dfrac{3x}{25}+\dfrac y5=1$, i.e. $3x+5y=25$.</p>`, 'Multiply through by 25.'),
  I(2, 'parabola: parametric form', String.raw`On $y^2=12x$ the point with parameter $t=2$ is $(x,y)$ (with $x=at^2$, $y=2at$). Find $x+y$.`, 24,
    String.raw`<p>$a=3$. $x=3\cdot4=12$ and $y=2\cdot3\cdot2=12$. Sum $=24$.</p>`, 'Here $y=2at$, not $at$.', { calc: () => 12 + 12 }),
  M(2, 'ellipse: parametric form', String.raw`The point with eccentric angle $60^\circ$ on $\dfrac{x^2}{16}+\dfrac{y^2}{9}=1$ is`, R2`$\left(2,\dfrac{3\sqrt3}{2}\right)$`, [R2`$\left(2\sqrt3,\dfrac32\right)$`, R2`$\left(4,3\sqrt3\right)$`, R2`$\left(\dfrac12,\dfrac{\sqrt3}2\right)$`],
    String.raw`<p>$(a\cos\theta,b\sin\theta)=(4\cos60^\circ,3\sin60^\circ)=\left(2,\dfrac{3\sqrt3}2\right)$.</p>`, 'Multiply $\\cos\\theta$ by $a$ and $\\sin\\theta$ by $b$.'),
  M(2, 'auxiliary circle', String.raw`The auxiliary circle of $\dfrac{x^2}{16}+\dfrac{y^2}{9}=1$ is`, '$x^2+y^2=16$', ['$x^2+y^2=9$', '$x^2+y^2=25$', '$x^2+y^2=7$'],
    String.raw`<p>The auxiliary circle has the major axis as diameter: $x^2+y^2=a^2=16$.</p>`, '$25=a^2+b^2$ is the director circle.'),
  I(2, 'rectangular hyperbola', String.raw`What is the angle (in degrees) between the asymptotes of $x^2-y^2=a^2$?`, 90,
    String.raw`<p>The asymptotes are $y=\pm x$, with slopes $1$ and $-1$, so they are perpendicular. $90^\circ$.</p>`, 'Product of slopes is $-1$.', { calc: () => 90 }),
  I(2, 'tangents from a point', String.raw`How many tangents can be drawn from $(1,3)$ to the parabola $y^2=4x$?`, 2,
    String.raw`<p>Test the point: $y^2-4x=9-4=5>0$, so the point is outside the parabola and two tangents exist.</p>`, 'Outside: $S_1>0$.'),
  I(2, 'tangents from a point', String.raw`How many tangents can be drawn from $(1,1)$ to the parabola $y^2=4x$?`, 0,
    String.raw`<p>$y^2-4x=1-4=-3<0$, so the point is inside the parabola. No tangent is possible.</p>`, 'Inside means $S_1<0$.'),
  M(2, 'hyperbola: eccentricity', String.raw`The eccentricity of $\dfrac{x^2}{9}-\dfrac{y^2}{16}=1$ is`, R2`$\dfrac53$`, [R2`$\dfrac54$`, R2`$\dfrac{\sqrt7}{3}$`, R2`$\dfrac{25}{9}$`],
    String.raw`<p>$e=\sqrt{1+\dfrac{16}9}=\sqrt{\dfrac{25}9}=\dfrac53$.</p>`, 'Divide by $a^2=9$, not $b^2$.'),
  N(2, 'ellipse: eccentricity', String.raw`Find the eccentricity of $3x^2+4y^2=12$.`, 0.5, 0.001,
    String.raw`<p>Divide by 12: $\dfrac{x^2}{4}+\dfrac{y^2}{3}=1$. $e=\sqrt{1-\dfrac34}=\dfrac12=0.5$.</p>`, 'Divide by 12 first to find $a^2$ and $b^2$.', { calc: () => Math.sqrt(1 - 3 / 4) }),
  M(2, 'ellipse: directrix', String.raw`The directrices of $\dfrac{x^2}{25}+\dfrac{y^2}{9}=1$ are`, R2`$x=\pm\dfrac{25}4$`, ['$x=\\pm5$', R2`$x=\pm\dfrac{5}{4}$`, R2`$y=\pm\dfrac{25}4$`],
    String.raw`<p>$a=5$, $c=4$, $e=\dfrac45$. Directrices $x=\pm\dfrac ae=\pm\dfrac{25}4$.</p>`, '$a/e=a^2/c$.'),
  N(2, 'hyperbola: latus rectum', String.raw`Find the length of the latus rectum of $\dfrac{x^2}{9}-\dfrac{y^2}{16}=1$ to 2 decimal places.`, 10.67, 0.01,
    String.raw`<p>Latus rectum $=\dfrac{2b^2}{a}=\dfrac{2\cdot16}{3}=\dfrac{32}3\approx10.67$.</p>`, '$b^2=16$ goes on top.', { calc: () => 32 / 3 }),
  M(2, 'parabola: vertex form', String.raw`The focus of $(y-2)^2=8(x-1)$ is`, '$(3,2)$', ['$(2,3)$', '$(1,2)$', '$(9,2)$'],
    String.raw`<p>Shift: $Y=y-2$, $X=x-1$, $Y^2=8X$ has $a=2$ and focus $X=2$, $Y=0$. So $x=3$, $y=2$.</p>`, 'Add the shift back.'),
  M(2, 'parabola: focus', String.raw`The focus of the parabola $x^2=-12y$ is`, '$(0,-3)$', ['$(0,3)$', '$(-3,0)$', '$(0,-12)$'],
    String.raw`<p>$x^2=-4ay$ with $a=3$: the parabola opens downward and the focus is $(0,-3)$.</p>`, 'The minus sign flips the direction.'),
  I(2, 'ellipse: reflection', String.raw`A ray leaves one focus of the ellipse $\dfrac{x^2}{25}+\dfrac{y^2}{9}=1$, hits the ellipse and reflects through the other focus. Find the total length of its path.`, 10,
    String.raw`<p>The sum of the focal distances of every point is $2a=10$, and the path is $F_1P+PF_2$.</p>`, 'Reflection property plus the sum rule.', { calc: () => 2 * 5 }),
  M(2, 'parabola: reflection', String.raw`A ray parallel to the axis of $y^2=8x$ strikes the parabola at $(2,4)$. The reflected ray lies along`, '$x=2$', ['$y=4$', '$y=2x$', '$x+y=6$'],
    String.raw`<p>All rays parallel to the axis pass through the focus after reflection. The focus is $(2,0)$. The line from $(2,4)$ to $(2,0)$ is the vertical line $x=2$.</p>`, 'The reflected ray goes through the focus.'),

  // ---------- L3 ----------
  M(3, 'parabola: normal', String.raw`The normal to $y^2=4x$ at $(4,4)$ is`, '$2x+y=12$', ['$x+2y=12$', '$2x-y=4$', '$x-2y=-4$'],
    String.raw`<p>The point is $(at^2,2at)$ with $t=2$. Normal at $t$: $y+tx=2at+at^3$, so $y+2x=4+8=12$.</p><p>Check with calculus: $\dfrac{dy}{dx}=\dfrac{2}{y}=\dfrac12$, so the normal slope is $-2$: $y-4=-2(x-4)$, i.e. $2x+y=12$.</p>`, 'The tangent slope is $1/2$; the normal is perpendicular.'),
  N(3, 'parabola: focal chord', String.raw`$PQ$ is a focal chord of $y^2=8x$ with $P=(8,8)$. Find the length of $PQ$.`, 12.5, 0.01,
    String.raw`<p>$a=2$. $P$ has $t$ with $2at=8$, so $t=2$. A focal chord has $t_1t_2=-1$, so $Q$ has $t=-\dfrac12$: $Q=\left(\dfrac12,-2\right)$.</p><p>$PQ=a\left(t+\dfrac1t\right)^2=2\left(2.5\right)^2=12.5$. (Check: focal distances $8+2=10$ and $\dfrac12+2=2.5$.)</p>`, 'Add the two focal distances.', { calc: () => 10 + 2.5 }),
  I(3, 'parabola: focal chord', String.raw`The focal chord of $y^2=8x$ is divided by the focus into segments of lengths 3 and $q$. Find $q$.`, 6,
    String.raw`<p>For a parabola the semi-latus rectum is the harmonic mean of the focal segments: $\dfrac1p+\dfrac1q=\dfrac1a$. Here $a=2$.</p><p>$\dfrac13+\dfrac1q=\dfrac12$ gives $\dfrac1q=\dfrac16$, so $q=6$.</p>`, '$\\dfrac1p+\\dfrac1q=\\dfrac1a$ for $y^2=4ax$.', { calc: () => 1 / (1 / 2 - 1 / 3) }),
  I(3, 'parabola: normals', String.raw`From the point $(7,2)$, how many normals (real, distinct) can be drawn to $y^2=4x$?`, 3,
    String.raw`<p>Normal at $t$: $y+tx=2t+t^3$. Through $(7,2)$: $2+7t=2t+t^3$, so $t^3-5t-2=0$.</p><p>$t=-2$ is a root: $-8+10-2=0$. Factor: $(t+2)(t^2-2t-1)=0$, and $t=1\pm\sqrt2$ are real. Three distinct real roots, so 3 normals.</p>`, 'Counting roots of the cubic in $t$.', { calc: () => 3 }),
  I(3, 'parabola: normals', String.raw`From the point $(3,1)$, how many normals can be drawn to $y^2=4x$?`, 1,
    String.raw`<p>Through $(3,1)$: $1+3t=2t+t^3$, so $t^3-t-1=0$. Let $f(t)=t^3-t-1$. Its turning points are $t=\pm\dfrac1{\sqrt3}$: $f\left(-\dfrac1{\sqrt3}\right)=-1+\dfrac{2}{3\sqrt3}<0$, so the local maximum is below zero and the graph crosses the axis only once. One normal.</p>`, 'Three normals need the cubic to have three real roots.'),
  I(3, 'parabola: tangents', String.raw`Tangents are drawn from $(-3,5)$ to the parabola $y^2=12x$. Find the angle between them in degrees.`, 90,
    String.raw`<p>The directrix of $y^2=12x$ is $x=-3$, and $(-3,5)$ lies on it. The tangents from a point on the directrix are perpendicular.</p><p>(Check: $y=mx+\dfrac3m$ through $(-3,5)$: $5=-3m+\dfrac3m$, so $3m^2+5m-3=0$ and $m_1m_2=-1$.)</p>`, 'Product of slopes is $-1$.', { calc: () => 90 }),
  M(3, 'parabola: locus', String.raw`The mid-points of the focal chords of $y^2=8x$ lie on`, '$y^2=4x-8$', ['$y^2=4x$', '$y^2=8x-16$', '$y^2=2x-4$'],
    String.raw`<p>For $y^2=4ax$ the mid-point of a focal chord (parameters $t$ and $-\dfrac1t$) is $\left(\dfrac a2\left(t^2+\dfrac1{t^2}\right),a\left(t-\dfrac1t\right)\right)$. Then $y^2=a^2\left(t^2+\dfrac1{t^2}-2\right)=2ax-2a^2$.</p><p>For $a=2$: $y^2=4x-8$.</p>`, 'The vertex of the locus is at the focus.'),
  I(3, 'ellipse: tangent condition', String.raw`The line $y=x+c$ touches $4x^2+9y^2=36$. Find $c^2$.`, 13,
    String.raw`<p>$\dfrac{x^2}{9}+\dfrac{y^2}{4}=1$, $a^2=9$, $b^2=4$, $m=1$. Condition: $c^2=a^2m^2+b^2=9+4=13$.</p>`, 'For an ellipse it is $+b^2$.', { calc: () => 9 + 4 }),
  M(3, 'ellipse: director circle', String.raw`The locus of the point from which perpendicular tangents are drawn to $\dfrac{x^2}{9}+\dfrac{y^2}{4}=1$ is`, '$x^2+y^2=13$', ['$x^2+y^2=5$', '$x^2+y^2=9$', '$x^2+y^2=36$'],
    String.raw`<p>The director circle is $x^2+y^2=a^2+b^2=9+4=13$.</p>`, 'Add $a^2$ and $b^2$, not $a$ and $b$.'),
  I(3, 'ellipse: tangents and foci', String.raw`For the ellipse $\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$, the product of the perpendicular distances of the foci from any tangent is`, 16,
    String.raw`<p>The product of the focal perpendiculars to any tangent is $b^2=16$.</p><p>(Check with the tangent $x=5$: distances from $(\pm3,0)$ are $2$ and $8$, product $16$.)</p>`, 'It equals $b^2$, the square of the semi-minor axis.', { calc: () => 2 * 8 }),
  I(3, 'ellipse: area', String.raw`The area of the ellipse $\dfrac{x^2}{25}+\dfrac{y^2}{9}=1$ is $k\pi$. Find $k$.`, 15,
    String.raw`<p>Area $=\pi ab=\pi\cdot5\cdot3=15\pi$.</p>`, 'Area is $\\pi ab$.', { calc: () => 5 * 3 }),
  N(3, 'ellipse: focal distances', String.raw`$P=\left(4,\dfrac{12}5\right)$ lies on $\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$. Find $PF_1\cdot PF_2$, where $F_1$, $F_2$ are the foci. Give 2 decimal places.`, 19.24, 0.01,
    String.raw`<p>$a=5$, $e=\dfrac35$. The focal distances are $a\mp ex_1=5\mp2.4$, i.e. $2.6$ and $7.4$.</p><p>Product $=2.6\times7.4=19.24$. (Check: $PF$ to $(3,0)$ is $\sqrt{1+5.76}=2.6$.)</p>`, 'Use $a\\pm ex$.', { calc: () => (5 - 0.6 * 4) * (5 + 0.6 * 4) }),
  I(3, 'hyperbola: focal difference', String.raw`For any point $P$ on $\dfrac{x^2}{9}-\dfrac{y^2}{16}=1$, find $|PF_1-PF_2|$.`, 6,
    String.raw`<p>For a hyperbola $|PF_1-PF_2|=2a=6$.</p>`, 'Difference for a hyperbola, sum for an ellipse.', { calc: () => 6 }),
  I(3, 'hyperbola: tangent condition', String.raw`The line $y=2x+c$ touches $\dfrac{x^2}{9}-\dfrac{y^2}{16}=1$. Find $c^2$.`, 20,
    String.raw`<p>$c^2=a^2m^2-b^2=9\cdot4-16=20$.</p>`, 'Minus $b^2$ for a hyperbola.', { calc: () => 9 * 4 - 16 }),
  M(3, 'hyperbola: asymptotes', String.raw`The asymptotes of $9x^2-16y^2=144$ are`, R2`$y=\pm\dfrac34x$`, [R2`$y=\pm\dfrac43x$`, R2`$y=\pm\dfrac{9}{16}x$`, R2`$y=\pm\dfrac{16}{9}x$`],
    String.raw`<p>Divide by 144: $\dfrac{x^2}{16}-\dfrac{y^2}{9}=1$. $a=4$, $b=3$. Asymptotes $y=\pm\dfrac ba x=\pm\dfrac34x$. (Quick: set the right side to zero, $9x^2=16y^2$.)</p>`, 'Slope is $b/a$.'),
  N(3, 'hyperbola: asymptote angle', String.raw`Find the angle (in degrees, to 1 decimal place) between the asymptotes of $\dfrac{x^2}{16}-\dfrac{y^2}{9}=1$ that contains the transverse axis.`, 73.7, 0.1,
    String.raw`<p>Each asymptote makes an angle $\theta$ with the x-axis where $\tan\theta=\dfrac ba=\dfrac34$. The angle between them across the branches is $2\theta=2\arctan(0.75)\approx73.7^\circ$.</p>`, 'The other angle is $180^\circ-73.7^\circ$.', { calc: () => (2 * Math.atan(0.75) * 180) / Math.PI }),
  N(3, 'conjugate hyperbola', String.raw`Find the eccentricity of the conjugate of $\dfrac{x^2}{9}-\dfrac{y^2}{16}=1$.`, 1.25, 0.001,
    String.raw`<p>The conjugate is $-\dfrac{x^2}{9}+\dfrac{y^2}{16}=1$, with transverse semi-axis $4$ (along $y$) and conjugate semi-axis $3$. $e'=\sqrt{1+\dfrac{9}{16}}=\dfrac54=1.25$.</p>`, 'The roles of $a$ and $b$ swap.', { calc: () => Math.sqrt(1 + 9 / 16) }),
  M(3, 'rectangular hyperbola: tangent', String.raw`The tangent at $(4,4)$ to the hyperbola $xy=16$ is`, '$x+y=8$', ['$x+y=4$', '$x-y=0$', '$x+y=16$'],
    String.raw`<p>Tangent at $(x_1,y_1)$ to $xy=c^2$: $xy_1+yx_1=2c^2$. So $4x+4y=32$, i.e. $x+y=8$.</p>`, 'Right side is $2c^2$.'),
  I(3, 'rectangular hyperbola: foci', String.raw`Find the distance between the foci of the rectangular hyperbola $xy=9$.`, 12,
    String.raw`<p>$xy=c^2$ with $c=3$. The transverse semi-axis is $a=c\sqrt2$ and $e=\sqrt2$, so $ae=2c=6$. The foci are at distance 6 from the origin on the line $y=x$, so $12$ apart.</p>`, 'Distance between foci is $4c$.', { calc: () => 4 * 3 }),
  I(3, 'rectangular hyperbola: area', String.raw`The tangent at any point of $xy=9$ cuts the axes forming a triangle with the origin. Find its area.`, 18,
    String.raw`<p>Tangent at $(3t,3/t)$: $\dfrac xt+ty=6$. Intercepts $6t$ and $\dfrac6t$. Area $=\dfrac12\cdot6t\cdot\dfrac6t=18$, whatever $t$.</p>`, 'The area is constant, $2c^2$.', { calc: () => 2 * 9 }),
  I(3, 'parabola: latus rectum tangents', String.raw`The tangents at the ends of the latus rectum of $y^2=12x$ meet at the point $(p,0)$. Find $p$.`, -3,
    String.raw`<p>The tangents at the ends of the latus rectum meet on the directrix at $(-a,0)=(-3,0)$ at a right angle.</p>`, 'They meet on the axis, at the foot of the directrix.', { calc: () => -3 }),
  I(3, 'parabola: chord length', String.raw`The line $y=x-1$ meets the parabola $y^2=4x$ at $A$ and $B$. Find $AB$.`, 8,
    String.raw`<p>Substitute: $(x-1)^2=4x$, so $x^2-6x+1=0$ with $x_1+x_2=6$. The line passes through the focus $(1,0)$, so $AB$ is a focal chord and $AB=x_1+x_2+2a=6+2=8$.</p><p>Check by roots: $x=3\pm2\sqrt2$, so $x_1-x_2=4\sqrt2$, and the slope is 1, so $AB=\sqrt2\cdot4\sqrt2=8$.</p>`, 'The line passes through the focus.', { calc: () => Math.SQRT2 * Math.abs(2 * 2 * Math.SQRT2) }),
  I(3, 'parabola: triangle', String.raw`Find the area of the triangle with vertices $(0,0)$, $(1,2)$ and $(4,4)$, which lie on $y^2=4x$.`, 2,
    String.raw`<p>Area $=\dfrac12|0(2-4)+1(4-0)+4(0-2)|=\dfrac12|4-8|=2$. (Using parameters $t=0,1,2$: area $=a^2|(t_1-t_2)(t_2-t_3)(t_3-t_1)|=1\cdot1\cdot1\cdot2=2$.)</p>`, 'Take the absolute value.', { calc: () => 0.5 * Math.abs(0 * (2 - 4) + 1 * (4 - 0) + 4 * (0 - 2)) }),
  I(3, 'conics meeting', String.raw`How many points do the curves $xy=12$ and $x^2+y^2=25$ have in common?`, 4,
    String.raw`<p>$y=\dfrac{12}x$: $x^2+\dfrac{144}{x^2}=25$, so $x^4-25x^2+144=0$, giving $x^2=9$ or $16$. $x=\pm3,\pm4$ with $y=\pm4,\pm3$: four points $(3,4),(4,3),(-3,-4),(-4,-3)$.</p>`, 'Both signs of $x$ give a point.', { sub: 'mixed', calc: () => 4 }),
  I(3, 'parabola and circle', String.raw`How many points do $y^2=4x$ and $x^2+y^2=5$ have in common?`, 2,
    String.raw`<p>$x^2+4x-5=0$ gives $x=1$ or $-5$. Only $x=1$ is valid ($y^2=4x\ge0$): $y=\pm2$. Two points: $(1,2)$ and $(1,-2)$.</p>`, 'Reject $x=-5$.', { sub: 'mixed', calc: () => 2 }),
  N(3, 'parabola: common chord', String.raw`Find the length of the common chord of $y^2=4x$ and $x^2=4y$, to 2 decimal places.`, 5.66, 0.01,
    String.raw`<p>The curves meet at $(0,0)$ and $(4,4)$. The chord has length $\sqrt{16+16}=4\sqrt2\approx5.66$.</p>`, 'Solve $x^4=64x$.', { sub: 'mixed', calc: () => Math.sqrt(32) }),
  N(3, 'ellipse: eccentricity', String.raw`The latus rectum of an ellipse equals half of its minor axis. Find the eccentricity to 2 decimal places.`, 0.87, 0.01,
    String.raw`<p>Latus rectum $=\dfrac{2b^2}a$ and half the minor axis is $b$. So $\dfrac{2b^2}a=b$, giving $a=2b$.</p><p>$e=\sqrt{1-\dfrac{b^2}{a^2}}=\sqrt{1-\dfrac14}=\dfrac{\sqrt3}2\approx0.87$.</p>`, 'Minor axis is $2b$, half is $b$.', { calc: () => Math.sqrt(3) / 2 }),
  M(3, 'ellipse: normal', String.raw`The normal to $\dfrac{x^2}{25}+\dfrac{y^2}{9}=1$ at $\left(4,\dfrac95\right)$ is`, '$25x-20y=64$', ['$25x+20y=64$', '$4x+5y=25$', '$20x-25y=64$'],
    String.raw`<p>Normal at $(x_1,y_1)$: $\dfrac{a^2x}{x_1}-\dfrac{b^2y}{y_1}=a^2-b^2$. $\dfrac{25x}{4}-\dfrac{9y}{9/5}=16$, i.e. $\dfrac{25x}4-5y=16$. Multiply by 4: $25x-20y=64$.</p><p>Check at the point: $100-36=64$.</p>`, 'The tangent is $\\dfrac{xx_1}{a^2}+\\dfrac{yy_1}{b^2}=1$; the normal swaps them.'),
  I(3, 'ellipse: distance from centre', String.raw`Find the least distance of a point of $\dfrac{x^2}{25}+\dfrac{y^2}{9}=1$ from its centre.`, 3,
    String.raw`<p>$OP^2=25\cos^2\theta+9\sin^2\theta=9+16\cos^2\theta$, with minimum $9$ at $\cos\theta=0$. So the least distance is $3=b$.</p>`, 'The nearest points are the ends of the minor axis.', { calc: () => 3 }),
  I(3, 'ellipse: inscribed rectangle', String.raw`Find the area of the largest rectangle with sides parallel to the axes that can be inscribed in $\dfrac{x^2}{25}+\dfrac{y^2}{9}=1$.`, 30,
    String.raw`<p>Corners $(\pm5\cos\theta,\pm3\sin\theta)$. Area $=4(5\cos\theta)(3\sin\theta)=30\sin2\theta$, with maximum $30$.</p>`, 'Largest is $2ab$.', { calc: () => 2 * 5 * 3 }),
  M(3, 'hyperbola: directrix distance', String.raw`The distance between the directrices of $\dfrac{x^2}{16}-\dfrac{y^2}{9}=1$ is`, R2`$\dfrac{32}{5}$`, [R2`$\dfrac{16}{5}$`, R2`$\dfrac{25}{4}$`, R2`$\dfrac{32}{3}$`],
    String.raw`<p>$a=4$, $c=5$, $e=\dfrac54$. Directrices $x=\pm\dfrac ae=\pm\dfrac{16}5$. Distance $=\dfrac{32}5=6.4$.</p>`, 'The two directrices are $2a/e$ apart.'),
  M(3, 'chord with given mid-point', String.raw`The chord of $y^2=4x$ whose mid-point is $(2,1)$ is`, '$2x-y-3=0$', ['$2x+y-5=0$', '$x-2y=0$', '$x-y-1=0$'],
    String.raw`<p>Use $T=S_1$: $yy_1-2a(x+x_1)=y_1^2-4ax_1$. With $(x_1,y_1)=(2,1)$, $a=1$: $y-2(x+2)=1-8$, so $y-2x-4=-7$ and $2x-y-3=0$.</p><p>Check: the slope is $\dfrac{2a}{y_1}=2$ and the line passes through $(2,1)$.</p>`, 'Mid-point of a chord uses $T=S_1$, not $T=0$.'),
  M(3, 'chord of contact', String.raw`The chord of contact of the tangents from $(-2,3)$ to $y^2=4x$ is`, '$2x-3y-4=0$', ['$2x+3y-4=0$', '$3x-2y+4=0$', '$2x-3y+4=0$'],
    String.raw`<p>$T=0$: $yy_1=2a(x+x_1)$ gives $3y=2(x-2)$, i.e. $2x-3y-4=0$.</p>`, 'Remember $x_1=-2$.'),
  M(3, 'ellipse: chord with mid-point', String.raw`The chord of $\dfrac{x^2}{9}+\dfrac{y^2}{4}=1$ with mid-point $(1,1)$ is`, '$4x+9y=13$', ['$4x+9y=36$', '$9x+4y=13$', '$x+y=2$'],
    String.raw`<p>$T=S_1$: $\dfrac x9+\dfrac y4=\dfrac19+\dfrac14=\dfrac{13}{36}$. Multiply by 36: $4x+9y=13$.</p>`, 'The right side is $S_1$, not 1.'),
  I(3, 'parametric form', String.raw`The normal at the point $P(t^2,2t)$ of $y^2=4x$ meets the x-axis at $(p,0)$. Find $p$ when $t=3$.`, 11,
    String.raw`<p>Normal: $y+tx=2t+t^3$. At $y=0$: $x=2+t^2=11$.</p>`, 'Put $y=0$.', { calc: () => 2 + 9 }),
  X(3, 'ellipse: properties', String.raw`For $9x^2+25y^2=225$ which are true?`, ['The foci are $(\\pm4,0)$.', 'The eccentricity is $\\dfrac45$.', 'The latus rectum has length $\\dfrac{18}5$.', 'The directrices are $x=\\pm5$.'], [0, 1, 2],
    String.raw`<p>$\dfrac{x^2}{25}+\dfrac{y^2}9=1$: $a=5$, $b=3$, $c=4$, $e=\dfrac45$. Latus rectum $\dfrac{2b^2}a=\dfrac{18}5$. Directrices $x=\pm\dfrac ae=\pm\dfrac{25}4$, not $\pm5$.</p>`, 'Directrix is $a/e$, not $a$.'),
  I(3, 'sub-tangent', String.raw`Find the length of the sub-normal at any point of the parabola $y^2=12x$.`, 6,
    String.raw`<p>Sub-normal $=y\dfrac{dy}{dx}=y\cdot\dfrac{6}{y}=6=2a$.</p>`, 'The sub-normal of $y^2=4ax$ is constant, $2a$.', { calc: () => 6 }),
  M(3, 'ellipse: condition', String.raw`The equation $\dfrac{x^2}{9-k}+\dfrac{y^2}{k-1}=1$ represents an ellipse that is not a circle when $k$ equals`, '$2$', ['$5$', '$10$', '$0$'],
    String.raw`<p>We need $9-k>0$, $k-1>0$ and $9-k\ne k-1$. $k=2$: denominators $7$ and $1$, an ellipse. $k=5$: both $4$, a circle. $k=10$: $-1$ and $9$, a hyperbola. $k=0$: $9$ and $-1$, a hyperbola.</p>`, 'Equal denominators make a circle.'),

  // ---------- L4 and L5 ----------
  I(4, 'parabola: normals', String.raw`From the point $(5,3)$, how many normals can be drawn to $y^2=4x$?`, 1,
    String.raw`<p>Normal at $t$: $y+tx=2t+t^3$. Through $(5,3)$: $3+5t=2t+t^3$, so $t^3-3t-3=0$.</p><p>Let $f(t)=t^3-3t-3$. Turning points at $t=\pm1$: $f(-1)=-1+3-3=-1<0$. The local maximum is below the axis, so the graph crosses the axis only once: one real root, one normal.</p>`, 'Compare with $(5,1)$, which gives three: the sign of the local maximum decides.', { calc: () => 1 }),
  I(4, 'parabola: normals', String.raw`The normal at $(1,2)$ to $y^2=4x$ meets the parabola again at $(p,q)$. Find $p+q$.`, 3,
    String.raw`<p>At $t=1$ the normal is $y+x=3$. Substitute $x=\dfrac{y^2}{4}$: $y^2+4y-12=0$, so $y=2$ or $y=-6$.</p><p>The other point is $(9,-6)$. $p+q=3$. (Formula: $t_2=-t_1-\dfrac2{t_1}=-3$, giving $(9,-6)$.)</p>`, 'Use $t_2=-t_1-2/t_1$.', { calc: () => 9 + -6 }),
  I(4, 'parabola: chord at the vertex', String.raw`Chords of $y^2=6x$ that subtend a right angle at the vertex all pass through the fixed point $(p,0)$. Find $p$.`, 6,
    String.raw`<p>For $y^2=4ax$ these chords pass through $(4a,0)$. Here $4a=6$, so $p=6$.</p><p>(Proof sketch: for points with parameters $t_1,t_2$, perpendicular at the vertex gives $t_1t_2=-4$, and the chord through them passes $(4a,0)$.)</p>`, 'The coefficient of $x$ is already $4a$.', { calc: () => 6 }),
  I(4, 'parabola: tangents at focal chord', String.raw`The ends of a focal chord of $y^2=8x$ have parameters $t=2$ and $t=-\dfrac12$. The tangents there meet at $(p,q)$. Find $q$.`, 3,
    String.raw`<p>Tangents at $t_1,t_2$ meet at $(at_1t_2,a(t_1+t_2))$. $a=2$: $x=2(2)\left(-\dfrac12\right)=-2$ and $y=2\left(2-\dfrac12\right)=3$.</p><p>$(p,q)=(-2,3)$, which lies on the directrix $x=-2$. $q=3$.</p>`, 'The meeting point is on the directrix.', { calc: () => 2 * (2 - 0.5) }),
  I(4, 'ellipse: tangent and axes', String.raw`Tangents to $\dfrac{x^2}{16}+\dfrac{y^2}{9}=1$ cut off triangles from the first quadrant by the axes. Find the least possible area.`, 12,
    String.raw`<p>Tangent at $\theta$: $\dfrac{x\cos\theta}{4}+\dfrac{y\sin\theta}3=1$. Intercepts $\dfrac4{\cos\theta}$ and $\dfrac3{\sin\theta}$. Area $=\dfrac12\cdot\dfrac{12}{\sin\theta\cos\theta}=\dfrac{12}{\sin2\theta}\ge12$.</p><p>The minimum is $12=ab$.</p>`, '$\\sin2\\theta\\le1$.', { calc: () => 4 * 3 }),
  I(4, 'hyperbola: tangent and asymptotes', String.raw`A tangent to $\dfrac{x^2}{25}-\dfrac{y^2}{16}=1$ and its two asymptotes form a triangle. Find the area.`, 20,
    String.raw`<p>For $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$ the triangle formed by any tangent and the asymptotes has area $ab$, a constant.</p><p>Here $ab=5\cdot4=20$.</p>`, 'The area is independent of the tangent chosen.', { calc: () => 5 * 4 }),
  N(4, 'hyperbola: asymptote distances', String.raw`For any point on $\dfrac{x^2}{16}-\dfrac{y^2}{9}=1$ the product of its distances from the two asymptotes is constant. Find the constant to 2 decimal places.`, 5.76, 0.01,
    String.raw`<p>Asymptotes $3x-4y=0$ and $3x+4y=0$. For $(x,y)$ on the curve the product of distances $=\dfrac{|9x^2-16y^2|}{25}=\dfrac{144}{25}=5.76$.</p><p>(General value: $\dfrac{a^2b^2}{a^2+b^2}$.)</p>`, 'Multiply the two distance formulas.', { calc: () => 144 / 25 }),
  N(4, 'ellipse: focal chord', String.raw`A focal chord of $\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$ is divided by the focus into segments $2.5$ and $q$. Find $q$ to 2 decimal places.`, 4.44, 0.01,
    String.raw`<p>For an ellipse the segments of a focal chord satisfy $\dfrac1p+\dfrac1q=\dfrac{2a}{b^2}=\dfrac{10}{16}=\dfrac58$.</p><p>$\dfrac1q=\dfrac58-\dfrac25=\dfrac{9}{40}$, so $q=\dfrac{40}9\approx4.44$.</p>`, 'Right side is $2a/b^2$.', { calc: () => 1 / (5 / 8 - 1 / 2.5) }),
  I(4, 'ellipse: circle through foci', String.raw`The ellipse $\dfrac{x^2}{k}+\dfrac{y^2}{9}=1$ ($k>9$) has a circle passing through its foci and the ends of its minor axis. Find $k$.`, 18,
    String.raw`<p>The foci are $(\pm c,0)$ with $c^2=k-9$ and the minor axis ends are $(0,\pm3)$. A circle centred at the origin through all four requires $c=3$.</p><p>$k-9=9$, so $k=18$.</p>`, 'The circle is centred at the origin by symmetry.', { calc: () => 9 + 9 }),
  I(4, 'ellipse: perpendicular tangents', String.raw`How many points on the x-axis have perpendicular tangents to $\dfrac{x^2}{16}+\dfrac{y^2}{9}=1$?`, 2,
    String.raw`<p>The points lie on the director circle $x^2+y^2=25$. It meets the x-axis at $(\pm5,0)$: two points.</p>`, 'Intersect the director circle with the axis.', { calc: () => 2 }),
  M(4, 'hyperbola: director circle', String.raw`Perpendicular tangents to $\dfrac{x^2}{4}-\dfrac{y^2}{9}=1$ from a point`, 'cannot be drawn from any real point', ['are drawn from points of $x^2+y^2=13$', 'are drawn from points of $x^2+y^2=5$', 'are drawn from the asymptotes only'],
    String.raw`<p>The director circle of $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$ is $x^2+y^2=a^2-b^2$. Here $a^2-b^2=4-9=-5<0$, so there is no real director circle.</p>`, '$a^2-b^2$, not $a^2+b^2$ (that is the ellipse).'),
  I(4, 'hyperbola: asymptote angle', String.raw`The angle between the asymptotes of a hyperbola, measured across the branches (the angle that contains the transverse axis), is $120^\circ$. Find its eccentricity.`, 2,
    String.raw`<p>Each asymptote makes angle $60^\circ$ with the transverse axis, so $\dfrac ba=\tan60^\circ=\sqrt3$.</p><p>$e=\sqrt{1+\dfrac{b^2}{a^2}}=\sqrt{1+3}=2$.</p>`, 'If the acute angle $60^\\circ$ were meant, $e=\\dfrac2{\\sqrt3}$.', { calc: () => Math.sqrt(1 + Math.tan(Math.PI / 3) ** 2) }),
  I(4, 'ellipse and hyperbola', String.raw`The ellipse $\dfrac{x^2}{25}+\dfrac{y^2}{9}=1$ and a hyperbola have the same foci. The hyperbola has eccentricity 2 and is $\dfrac{x^2}{A}-\dfrac{y^2}{B}=1$. Find $A$.`, 4,
    String.raw`<p>Foci of the ellipse: $c=\sqrt{25-9}=4$. For the hyperbola $c=ae$ with $e=2$, so $a=2$ and $A=a^2=4$. (Then $B=c^2-a^2=12$.)</p>`, '$A=a^2$, not $a$.', { calc: () => (4 / 2) ** 2 }),
  I(4, 'common tangent', String.raw`The parabolas $y^2=4x$ and $x^2=4y$ have a common tangent $x+y+k=0$. Find $k$.`, 1,
    String.raw`<p>A tangent to $y^2=4x$ is $y=mx+\dfrac1m$. A tangent to $x^2=4y$ is $y=mx-m^2$. For the same line: $\dfrac1m=-m^2$, so $m^3=-1$ and $m=-1$.</p><p>The line is $y=-x-1$, i.e. $x+y+1=0$, so $k=1$.</p>`, 'Write both slope forms and equate the intercepts.', { calc: () => 1 }),
  I(5, 'common tangent', String.raw`How many common tangents (real lines) do the parabolas $y^2=4x$ and $x^2=4y$ have?`, 1,
    String.raw`<p>With a slope $m$ the common tangent needs $\dfrac1m=-m^2$, giving only $m=-1$: the line $x+y+1=0$.</p><p>Vertical or horizontal lines: $x=0$ touches $y^2=4x$ but meets $x^2=4y$ at one point without touching (it is the axis). Similarly $y=0$. So exactly one common tangent.</p>`, 'Check vertical and horizontal lines separately.', { calc: () => 1 }),
  I(4, 'ellipse: pedal', String.raw`The foot of the perpendicular from the focus $(3,0)$ to any tangent of $\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$ lies on a circle $x^2+y^2=r^2$. Find $r$.`, 5,
    String.raw`<p>The feet of the perpendiculars from a focus to tangents lie on the auxiliary circle $x^2+y^2=a^2$. So $r=a=5$.</p><p>(Check with the tangent $x=5$: the foot from $(3,0)$ is $(5,0)$, which is on the circle.)</p>`, 'The auxiliary circle has radius $a$.', { calc: () => 5 }),
  N(5, 'parabola: circle on a focal chord', String.raw`$PQ$ is the focal chord of $y^2=8x$ with $P=(8,8)$. A circle is drawn with $PQ$ as diameter. Find its radius.`, 6.25, 0.01,
    String.raw`<p>$Q=\left(\dfrac12,-2\right)$ and $PQ=12.5$, so the radius is $6.25$.</p><p>Check: the centre is $(4.25,3)$ and its distance from the directrix $x=-2$ is $6.25$. This is the general property that a circle on a focal chord as diameter touches the directrix.</p>`, 'The circle touches the directrix.', { calc: () => 12.5 / 2 }),
  N(4, 'rectangular hyperbola: tangent', String.raw`The tangent at $(2,8)$ to $xy=16$ meets the axes at $A$ and $B$. Find $AB$ to 2 decimal places.`, 16.49, 0.01,
    String.raw`<p>Tangent: $8x+2y=32$, i.e. $4x+y=16$. Intercepts $A=(4,0)$ and $B=(0,16)$.</p><p>$AB=\sqrt{16+256}=\sqrt{272}\approx16.49$. (The point of contact $(2,8)$ is the mid-point of $AB$.)</p>`, 'The point of contact bisects the intercept.', { calc: () => Math.sqrt(272) }),
  I(5, 'confocal conics', String.raw`The ellipse $\dfrac{x^2}{25}+\dfrac{y^2}{9}=1$ and the hyperbola $\dfrac{x^2}{4}-\dfrac{y^2}{12}=1$ have the same foci. At a point where they meet, find the angle between them in degrees.`, 90,
    String.raw`<p>They meet where $x^2=6.25$, $y^2=6.75$. Slope of the ellipse tangent: $-\dfrac{9x}{25y}$. Slope of the hyperbola tangent: $\dfrac{12x}{4y}=\dfrac{3x}y$.</p><p>Product $=-\dfrac{27x^2}{25y^2}=-\dfrac{27\cdot6.25}{25\cdot6.75}=-1$. So they cut at $90^\circ$.</p><p>Confocal conics always cut orthogonally.</p>`, 'Find the intersection first.', { calc: () => { const x2 = 6.25, y2 = 6.75; return Math.abs(-(27 * x2) / (25 * y2) + 1) < 1e-9 ? 90 : -1; } }),
  M(3, 'parabola: chord slope', String.raw`The mid-points of chords of $y^2=8x$ having slope 2 lie on the line`, '$y=2$', ['$y=4$', '$y=1$', '$x=2$'],
    String.raw`<p>For $y^2=4ax$ the chords of slope $m$ have mid-points on $y=\dfrac{2a}m$. Here $a=2$, $m=2$: $y=2$.</p>`, 'A diameter of a parabola is parallel to its axis.'),
  M(4, 'ellipse: diameter', String.raw`The mid-points of the chords of $\dfrac{x^2}{9}+\dfrac{y^2}{4}=1$ with slope 1 lie on`, '$4x+9y=0$', ['$9x+4y=0$', '$4x-9y=0$', '$x+y=0$'],
    String.raw`<p>Let the mid-point be $(h,k)$. The chord is $\dfrac{xh}{9}+\dfrac{yk}{4}=\dfrac{h^2}9+\dfrac{k^2}4$ with slope $-\dfrac{4h}{9k}=1$. So $9k=-4h$: the locus is $4x+9y=0$.</p>`, 'The slope of $T=S_1$ is $-\\dfrac{b^2h}{a^2k}$.'),
  N(4, 'mixed: circle and ellipse', String.raw`A circle centred at the origin passes through the foci of $\dfrac{x^2}{25}+\dfrac{y^2}{9}=1$. Find the length of the chord that the line $x=2$ cuts from the circle, to 2 decimal places.`, 6.93, 0.01,
    String.raw`<p>The foci are $(\pm4,0)$, so the circle is $x^2+y^2=16$. At $x=2$: $y^2=12$ and the chord has length $2\sqrt{12}=4\sqrt3\approx6.93$.</p>`, 'The circle has radius $c=ae$, not $a$.', { sub: 'mixed', calc: () => 2 * Math.sqrt(12) }),
  // ---------- assertion-reason ----------
  A(3, 'parabola: focal chord', String.raw`The tangents at the ends of a focal chord of a parabola are perpendicular.`, String.raw`The tangents at the ends of a focal chord meet on the directrix.`, 1,
    String.raw`<p>For parameters $t$ and $-\dfrac1t$ the tangents have slopes $\dfrac1t$ and $-t$, whose product is $-1$: A is true. They meet at $(-a,a(t-\dfrac1t))$, on the directrix: R is true. But R does not explain perpendicularity; the slopes do.</p>`, 'True facts, different reasons.'),
  A(3, 'parabola: reflection', String.raw`A ray parallel to the axis of a parabola passes through the focus after reflection.`, String.raw`The tangent at any point of a parabola makes equal angles with the focal radius and the line parallel to the axis through that point.`, 0,
    String.raw`<p>The normal bisects the angle between the incident ray (parallel to the axis) and the reflected ray. That is exactly the equal-angle property in R, so R explains A.</p>`, 'Law of reflection plus the tangent property.'),
  A(2, 'rectangular hyperbola', String.raw`The eccentricity of a rectangular hyperbola is $\sqrt2$.`, String.raw`In a rectangular hyperbola $a=b$.`, 0,
    String.raw`<p>$e=\sqrt{1+\dfrac{b^2}{a^2}}=\sqrt{1+1}=\sqrt2$ when $a=b$. R gives the reason for A.</p>`, 'Rectangular means $a=b$.'),
  A(3, 'ellipse: foci', String.raw`The foci of $\dfrac{x^2}{9}+\dfrac{y^2}{16}=1$ are $(\pm\sqrt7,0)$.`, String.raw`For the ellipse $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$ with $a>b$ the foci are $(\pm ae,0)$.`, 3,
    String.raw`<p>R is true. But here $a^2=9<b^2=16$, so the major axis lies along the y-axis and the foci are $(0,\pm\sqrt7)$. A is false.</p>`, 'The larger denominator tells the major axis.'),
  A(2, 'parabola: line meets', String.raw`A line cannot meet a parabola in more than two points.`, String.raw`Substituting a line into $y^2=4ax$ gives an equation of degree at most 2.`, 0,
    String.raw`<p>The substitution gives a quadratic (or a linear equation if the line is parallel to the axis), so at most 2 solutions. R explains A.</p>`, 'Degree of the equation = number of intersections.'),
  A(3, 'conjugate hyperbola', String.raw`A hyperbola and its conjugate have the same asymptotes.`, String.raw`A hyperbola and its conjugate have the same eccentricity.`, 2,
    String.raw`<p>Asymptotes of both are $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=0$: A is true. The eccentricities are $\sqrt{1+\dfrac{b^2}{a^2}}$ and $\sqrt{1+\dfrac{a^2}{b^2}}$, which differ unless $a=b$: R is false.</p>`, 'Eccentricities are equal only for a rectangular hyperbola.'),
  A(3, 'ellipse: definition', String.raw`The sum of the distances of any point of an ellipse from its two foci is constant.`, String.raw`An ellipse is the locus of a point whose distance from a fixed point (focus) is a constant ratio $e<1$ of its distance from a fixed line (directrix).`, 1,
    String.raw`<p>Both are true descriptions of an ellipse, but the focus-directrix definition is a different definition; it does not directly explain the constant sum (though they are equivalent).</p>`, 'Two true definitions.'),
  A(4, 'ellipse: normal', String.raw`The normal at any point $P$ of an ellipse bisects the angle $F_1PF_2$.`, String.raw`The tangent at $P$ bisects the exterior angle between the focal radii $PF_1$ and $PF_2$.`, 0,
    String.raw`<p>The normal is perpendicular to the tangent. If the tangent bisects the exterior angle, the normal bisects the interior angle. So R explains A.</p>`, 'Perpendicular lines bisect supplementary angles.'),
  A(3, 'hyperbola: definition', String.raw`For a point $P$ on a hyperbola, $|PF_1-PF_2|=2a$.`, String.raw`A hyperbola is the locus of a point whose distances from two fixed points differ by a constant smaller than the distance between the points.`, 0,
    String.raw`<p>This is the definition of the hyperbola, with the constant being $2a$. So R explains A.</p>`, 'Difference, not sum.'),
  A(3, 'parabola: opening', String.raw`The equation $y^2=4ax$ with $a<0$ represents a parabola opening to the left.`, String.raw`Its focus $(a,0)$ lies on the negative x-axis.`, 0,
    String.raw`<p>With $a<0$ the focus is at $(a,0)$ to the left of the vertex, and the curve wraps around the focus: it opens left. R is the reason.</p>`, 'The parabola always wraps around its focus.'),
  A(5, 'parabola: normals', String.raw`From any point $(h,0)$ with $h>2a$ on the axis, three distinct real normals can be drawn to $y^2=4ax$.`, String.raw`The cubic $at^3+(2a-h)t-k=0$ from a point $(h,k)$ always has three real roots.`, 2,
    String.raw`<p>For $k=0$: $t(at^2+2a-h)=0$ gives $t=0$ and $t^2=\dfrac{h-2a}a>0$: three real roots. A is true. R is false: for example $t^3-3t-3=0$ has only one real root.</p>`, 'The number of real roots depends on the point.'),

  // ---------- statements ----------
  S(2, 'ellipse: foci', String.raw`The foci of $\dfrac{x^2}{4}+\dfrac{y^2}{9}=1$ lie on the y-axis.`, String.raw`In this ellipse the larger denominator is under $y^2$.`, 0,
    String.raw`<p>$b^2=9>a^2=4$, so the major axis is along the y-axis, and the foci are $(0,\pm\sqrt5)$. Both statements are true.</p>`, 'The foci lie on the major axis.'),
  S(3, 'parabola: latus rectum', String.raw`The tangents at the ends of the latus rectum of $y^2=4ax$ meet at $(-a,0)$.`, String.raw`These two tangents are perpendicular.`, 0,
    String.raw`<p>Ends $(a,\pm2a)$ with $t=\pm1$. Tangents $\pm y=x+a$ meet at $(-a,0)$; slopes $1$ and $-1$ give product $-1$. Both are true.</p>`, 'They meet on the directrix.'),
  S(3, 'conjugate hyperbola', String.raw`The conjugate of a rectangular hyperbola is also a rectangular hyperbola.`, String.raw`The hyperbola $x^2-y^2=a^2$ and its conjugate have the same foci.`, 1,
    String.raw`<p>Conjugate of $x^2-y^2=a^2$ is $y^2-x^2=a^2$, again with equal axes: I is true. Foci of the first: $(\pm a\sqrt2,0)$; of the conjugate: $(0,\pm a\sqrt2)$. They differ: II is false.</p>`, 'The foci of the conjugate lie on the other axis.'),
  S(3, 'parabola: focal chord', String.raw`Among all focal chords of $y^2=4ax$ the latus rectum is the shortest.`, String.raw`The length of a focal chord with end parameter $t$ is $a\left(t-\dfrac1t\right)^2$.`, 1,
    String.raw`<p>The true length is $a\left(t+\dfrac1t\right)^2\ge4a$ with equality at $t=\pm1$ (the latus rectum). I is true. II has a minus sign: it would give 0 at $t=1$, which is wrong. II is false.</p>`, 'The correct formula has a plus sign.'),
  S(4, 'tangent condition', String.raw`The line $y=mx+c$ touches $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$ when $c^2=a^2m^2+b^2$.`, String.raw`The line $y=mx+c$ touches $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$ when $c^2=a^2m^2+b^2$.`, 2,
    String.raw`<p>II is the correct ellipse condition. For the hyperbola it is $c^2=a^2m^2-b^2$, so I is false.</p>`, 'Hyperbola has a minus sign.'),
  S(2, 'parabola: directrix', String.raw`The directrix of $x^2=-8y$ is $y=-2$.`, String.raw`The focus of $x^2=-8y$ is $(0,2)$.`, 3,
    String.raw`<p>$x^2=-4ay$ with $a=2$ opens downward. Focus $(0,-2)$ and directrix $y=2$. Both statements are false.</p>`, 'Minus sign: opens down, focus below the vertex.'),
  SC(3, 'conic basics', [String.raw`A parabola has eccentricity 1.`, String.raw`The foci of $\dfrac{x^2}{9}+\dfrac{y^2}{25}=1$ lie on the x-axis.`, String.raw`The distance between the foci of a hyperbola is $2ae$.`, String.raw`The transverse axis of $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$ has length $2b$.`], '2', ['0', '1', '3'],
    String.raw`<p>(1) True. (2) False: the larger denominator is under $y^2$, so the foci are on the y-axis. (3) True. (4) False: the length is $2a$. Two are correct.</p>`, 'Check which denominator is larger.'),
  SC(4, 'normals from a point', [String.raw`Up to three normals can be drawn from a point to a parabola.`, String.raw`Up to four normals can be drawn from a point to an ellipse.`, String.raw`Up to four normals can be drawn from a point to a hyperbola.`, String.raw`Up to four distinct normals (lines) can be drawn from a point to a circle.`], '3', ['1', '2', '4'],
    String.raw`<p>(1), (2), (3) are true. (4) is false: every normal of a circle passes through the centre, so from a point other than the centre there is only one normal line.</p>`, 'Circle normals all pass through the centre.'),
  SC(4, 'director circle', [String.raw`The director circle of $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$ is $x^2+y^2=a^2+b^2$.`, String.raw`The director circle of $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$ is $x^2+y^2=a^2-b^2$.`, String.raw`A real director circle exists for every hyperbola.`, String.raw`For a rectangular hyperbola the director circle shrinks to the centre.`, String.raw`The director "circle" of a parabola is its directrix.`], '4', ['2', '3', '5'],
    String.raw`<p>(1), (2), (4), (5) are true. (3) is false: if $a<b$ then $a^2-b^2<0$ and there is no real circle.</p>`, 'Need $a>b$ for a real circle.'),

  // ---------- multi ----------
  X(4, 'parabola: tangents', String.raw`Which of these lines touch the parabola $y^2=8x$?`, ['$y=2x+1$', '$y=x+2$', '$y=x+1$', '$y=-x-2$'], [0, 1, 3],
    String.raw`<p>The condition is $c=\dfrac am$ with $a=2$. $y=2x+1$: $m=2$, $c=1$ yes. $y=x+2$: $c=2$ yes. $y=x+1$: need $c=2$, no. $y=-x-2$: $m=-1$, need $c=-2$ yes.</p>`, 'Check each pair $(m,c)$ against $c=a/m$.'),
  X(4, 'hyperbola: properties', String.raw`For $\dfrac{x^2}{9}-\dfrac{y^2}{16}=1$ which are true?`, ['The asymptotes are $y=\\pm\\dfrac43x$.', 'The foci are $(\\pm5,0)$.', 'The conjugate hyperbola has its transverse axis along the y-axis.', 'The eccentricity is $\\dfrac43$.'], [0, 1, 2],
    String.raw`<p>$a=3$, $b=4$, $c=5$. Asymptotes $y=\pm\dfrac43x$ and foci $(\pm5,0)$ are right. The conjugate $-\dfrac{x^2}9+\dfrac{y^2}{16}=1$ has its transverse axis on $y$. $e=\dfrac53$, so (D) is false.</p>`, '$e=c/a=5/3$.'),
  X(4, 'conic type', String.raw`The equation $\dfrac{x^2}{9-k}+\dfrac{y^2}{k-1}=1$ represents a real ellipse that is not a circle for which of these values of $k$?`, ['$2$', '$5$', '$8$', '$10$'], [0, 2],
    String.raw`<p>$k=2$: denominators $7,1$. $k=5$: $4,4$ (circle). $k=8$: $1,7$. $k=10$: $-1,9$ (hyperbola).</p>`, 'Equal denominators give a circle.'),
  X(5, 'parabola: normal and tangent', String.raw`For the point $P(t^2,2t)$ on $y^2=4x$ which statements are true?`, ['The tangent at $P$ meets the x-axis at $(-t^2,0)$.', 'The normal at $P$ meets the x-axis at $(t^2+2,0)$.', 'The sub-normal at $P$ has length 2.', 'The sub-tangent at $P$ has length 2.'], [0, 1, 2],
    String.raw`<p>Tangent $ty=x+t^2$ at $y=0$: $x=-t^2$. Normal $y+tx=2t+t^3$ at $y=0$: $x=2+t^2$. Sub-normal $=(t^2+2)-t^2=2$. Sub-tangent $=t^2-(-t^2)=2t^2$, not constant 2.</p>`, 'Sub-tangent is $2x_1$.'),
  X(5, 'rectangular hyperbola', String.raw`For the hyperbola $xy=4$ which statements are true?`, ['The tangent at $(2,2)$ is $x+y=4$.', 'The normal at $(2,2)$ is $y=x$.', 'Its eccentricity is $\\sqrt2$.', 'Its asymptotes are $y=\\pm x$.'], [0, 1, 2],
    String.raw`<p>Tangent: $2y+2x=8$ gives $x+y=4$. The normal is perpendicular to it through $(2,2)$: $y=x$. $e=\sqrt2$. The asymptotes are the coordinate axes $x=0$ and $y=0$, not $y=\pm x$.</p>`, 'The axes of $xy=c^2$ are the asymptotes.'),
  X(3, 'tangents of a conic', String.raw`Which lines touch $\dfrac{x^2}{9}+\dfrac{y^2}{4}=1$?`, ['$x=3$', '$y=2$', '$y=x+4$', '$y=x+\\sqrt{13}$'], [0, 1, 3],
    String.raw`<p>$x=3$ and $y=2$ touch at the ends of the axes. For $y=x+c$ the condition is $c^2=9+4=13$: $c=\sqrt{13}$ touches, $c=4$ gives $16>13$ and misses.</p>`, 'Check $c^2$ against 13.'),

  // ---------- match ----------
  MT(2, 'eccentricity', 'm1', String.raw`Match each conic with its eccentricity.`, 'A-q, B-r, C-p, D-s', ['A-r, B-q, C-p, D-s', 'A-q, B-r, C-s, D-p', 'A-p, B-q, C-r, D-s'],
    String.raw`<p>A: $\sqrt{1-\dfrac{16}{25}}=\dfrac35$. B: $\sqrt{1+\dfrac9{16}}=\dfrac54$. C: a parabola, $1$. D: a rectangular hyperbola, $\sqrt2$.</p>`, 'Check which denominator is $a^2$.'),
  MT(2, 'latus rectum', 'm2', String.raw`Match each parabola with its latus rectum.`, 'A-p, B-s, C-q, D-r', ['A-s, B-p, C-q, D-r', 'A-p, B-s, C-r, D-q', 'A-q, B-s, C-p, D-r'],
    String.raw`<p>The latus rectum is the numerical coefficient: A $4$, B $12$, C $6$ (sign ignored), D $8$ (the shift does not change the size).</p>`, 'Take the absolute value of the coefficient.'),
  MT(3, 'line and ellipse', 'm3', String.raw`Match each line with how it meets $\dfrac{x^2}{9}+\dfrac{y^2}{4}=1$.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
    String.raw`<p>A: $x=3$ touches at $(3,0)$, the end of the major axis. B: $c^2=13$ meets the tangent condition, with contact at a general point. C: $c^2=16>13$, misses. D: $y=x$ passes through the centre.</p>`, 'Test with $c^2=a^2m^2+b^2$.'),
  MT(4, 'director circle', 'm4', String.raw`Match each conic with its director curve.`, 'A-q, B-s, C-p, D-r', ['A-s, B-q, C-p, D-r', 'A-q, B-s, C-r, D-p', 'A-p, B-s, C-q, D-r'],
    String.raw`<p>A: $a^2+b^2=25$, so $x^2+y^2=25$. B: $a^2-b^2=16-9=7$. C: for a parabola the director curve is the directrix $x=-2$. D: $x^2-y^2=4$ has $a^2-b^2=0$, so only the centre.</p>`, 'Hyperbola uses a minus sign.'),

  // ---------- passages ----------
  PI(2, 'focal chord', 'p1', String.raw`Find the y-coordinate of $Q$.`, -2,
    String.raw`<p>$a=2$. $P=(8,8)$: $2at=8$ gives $t=2$. For a focal chord $t_Q=-\dfrac1t=-\dfrac12$, so $Q=\left(2\cdot\dfrac14,2\cdot2\cdot\left(-\dfrac12\right)\right)=\left(\dfrac12,-2\right)$.</p>`, '$t_1t_2=-1$.', { calc: () => 2 * 2 * -0.5 }),
  PN(3, 'focal chord', 'p1', String.raw`Find the length $PQ$.`, 12.5, 0.01,
    String.raw`<p>Focal distances: $PF=x+a=8+2=10$ and $QF=\dfrac12+2=2.5$. $PQ=12.5$.</p>`, 'Add the two focal distances.', { calc: () => 10 + 2.5 }),
  PI(4, 'focal chord', 'p1', String.raw`Find the y-coordinate of $R$.`, 3,
    String.raw`<p>Tangent at $t$: $ty=x+2t^2$. At $t=2$: $2y=x+8$, so $x=2y-8$. At $t=-\dfrac12$: $-\dfrac y2=x+\dfrac12$, so $x=-\dfrac y2-\dfrac12$.</p><p>Equate: $2y-8=-\dfrac y2-\dfrac12$, so $2.5y=7.5$ and $y=3$ (with $x=-2$).</p>`, 'R lies on the directrix $x=-2$.', { calc: () => 3 }),
  PI(2, 'ellipse and foci', 'p2', String.raw`Find the distance $F_1F_2$.`, 6,
    String.raw`<p>$c=\sqrt{25-16}=3$, so $F_1F_2=2c=6$.</p>`, 'Foci are $(\\pm3,0)$.', { calc: () => 6 }),
  PN(3, 'ellipse and foci', 'p2', String.raw`Find $PF_1\cdot PF_2$.`, 19.24, 0.01,
    String.raw`<p>$e=\dfrac35$. Focal distances are $5\mp0.6\cdot4=2.6$ and $7.4$. Product $=19.24$.</p>`, 'Use $a\\pm ex$.', { calc: () => 2.6 * 7.4 }),
  PI(3, 'ellipse and foci', 'p2', String.raw`Find the perimeter of triangle $PF_1F_2$.`, 16,
    String.raw`<p>$PF_1+PF_2=2a=10$ and $F_1F_2=6$. Perimeter $=16$.</p>`, 'Use the constant sum $2a$.', { calc: () => 10 + 6 }),
  PN(2, 'hyperbola', 'p3', String.raw`Find the eccentricity of $H$.`, 1.25, 0.001,
    String.raw`<p>$e=\sqrt{1+\dfrac9{16}}=\dfrac54=1.25$.</p>`, 'Add, not subtract.', { calc: () => Math.sqrt(1 + 9 / 16) }),
  PN(3, 'hyperbola', 'p3', String.raw`Find the length of the latus rectum of $H$.`, 4.5, 0.01,
    String.raw`<p>$\dfrac{2b^2}{a}=\dfrac{2\cdot9}4=4.5$.</p>`, '$b^2=9$.', { calc: () => 18 / 4 }),
  PI(4, 'hyperbola', 'p3', String.raw`Find the area of the triangle that a tangent to $H$ forms with its asymptotes.`, 12,
    String.raw`<p>The area is the constant $ab=4\cdot3=12$.</p>`, 'The area does not depend on the tangent.', { calc: () => 4 * 3 }),
];

// ---------- number templates ----------
const sg = (rng) => choose(rng, [1, -1]);
/** 'y=mx+c' written neatly */
const yl = (m, c) => `y=${m === 1 ? '' : m === -1 ? '-' : m}x${c === 0 ? '' : c < 0 ? c : '+' + c}`;
const AB_E = [[5, 4, 3], [13, 12, 5], [10, 8, 6], [5, 3, 4], [17, 15, 8], [10, 6, 8], [25, 24, 7], [15, 12, 9], [13, 5, 12]]; // a, b, c with a^2-b^2=c^2
const AB_H = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [4, 3, 5], [12, 5, 13], [7, 24, 25], [9, 12, 15]]; // a, b, c with a^2+b^2=c^2
const ell = (A, B) => String.raw`\dfrac{x^2}{${A}}+\dfrac{y^2}{${B}}=1`;
const hyp = (A, B) => String.raw`\dfrac{x^2}{${A}}-\dfrac{y^2}{${B}}=1`;
const gens = [
  {
    id: 'cs-g01', type: 'nat', format: 'integer', level: 1, exams: EXS[1], sub: 'parabola: basics',
    make(rng) {
      const a = int(rng, 1, 9), K = 4 * a, w = choose(rng, ['focus', 'lr', 'fd']);
      const answer = { focus: a, lr: K, fd: 2 * a }[w];
      const ask = { focus: `the x-coordinate of its focus`, lr: `the length of its latus rectum`, fd: `the distance between its focus and its directrix` }[w];
      return { a, w, answer, tol: 0,
        q: `For the parabola $y^2=${K}x$ find ${ask}.`,
        sol: String.raw`<p>Compare with $y^2=4ax$: $4a=${K}$, so $a=${a}$. The focus is $(${a},0)$, the directrix is $x=-${a}$ and the latus rectum is $4a=${K}$.</p><p>So ${ask} is ${answer}.</p>` };
    },
    verify(p) { return { focus: p.a, lr: 4 * p.a, fd: 2 * p.a }[p.w]; },
  },
  {
    id: 'cs-g02', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'parabola: focal distance',
    make(rng) {
      const a = int(rng, 1, 6), t = int(rng, 1, 5) * sg(rng), x1 = a * t * t, y1 = 2 * a * t;
      return { a, x1, y1, answer: x1 + a, tol: 0,
        q: `The point $(${x1},${y1})$ lies on the parabola $y^2=${4 * a}x$. Find its distance from the focus.`,
        sol: String.raw`<p>$a=${a}$, so the focus is $(${a},0)$ and the directrix is $x=-${a}$. The focal distance equals the distance from the directrix: $x_1+a=${x1}+${a}=${x1 + a}$.</p><p>(Check: $\sqrt{(${x1}-${a})^2+${y1 * y1}}=${x1 + a}$.)</p>` };
    },
    verify(p) { return Math.round(Math.hypot(p.x1 - p.a, p.y1)); },
  },
  {
    id: 'cs-g03', type: 'nat', format: 'numeric', level: 2, exams: EXS[2], sub: 'ellipse: basics',
    make(rng) {
      const [a, b, c] = choose(rng, AB_E), w = choose(rng, ['foci', 'lr', 'e']), horiz = rng() < 0.5;
      const A = horiz ? a * a : b * b, B = horiz ? b * b : a * a;
      const answer = { foci: 2 * c, lr: (2 * b * b) / a, e: c / a }[w];
      const ask = { foci: 'the distance between the foci', lr: 'the length of the latus rectum', e: 'the eccentricity' }[w];
      return { a, b, c, w, A, B, answer, tol: 0.01,
        q: `For the ellipse $${ell(A, B)}$ find ${ask}. Give your answer to 2 decimal places where needed.`,
        sol: String.raw`<p>The larger denominator is $${a * a}$, so $a=${a}$ (the semi-major axis) and $b=${b}$. $c=\sqrt{a^2-b^2}=\sqrt{${a * a}-${b * b}}=${c}$.</p><p>${{ foci: `Distance between the foci $=2c=${2 * c}$.`, lr: `Latus rectum $=\\dfrac{2b^2}{a}=\\dfrac{${2 * b * b}}{${a}}=${fmt(answer, 4)}$.`, e: `$e=\\dfrac ca=\\dfrac{${c}}{${a}}=${fmt(answer, 4)}$.` }[w]}</p>` };
    },
    verify(p) { const aa = Math.sqrt(Math.max(p.A, p.B)), bb = Math.sqrt(Math.min(p.A, p.B)), cc = Math.sqrt(aa * aa - bb * bb); return { foci: 2 * cc, lr: (2 * bb * bb) / aa, e: cc / aa }[p.w]; },
  },
  {
    id: 'cs-g04', type: 'nat', format: 'numeric', level: 2, exams: EXS[2], sub: 'hyperbola: basics',
    make(rng) {
      const [a, b, c] = choose(rng, AB_H), w = choose(rng, ['e', 'lr', 'foci', 'slope']);
      const answer = { e: c / a, lr: (2 * b * b) / a, foci: 2 * c, slope: b / a }[w];
      const ask = { e: 'the eccentricity', lr: 'the length of the latus rectum', foci: 'the distance between the foci', slope: 'the slope of the asymptote with positive slope' }[w];
      return { a, b, c, w, answer, tol: 0.01,
        q: `For the hyperbola $${hyp(a * a, b * b)}$ find ${ask}. Give your answer to 2 decimal places where needed.`,
        sol: String.raw`<p>$a=${a}$, $b=${b}$ and $c=\sqrt{a^2+b^2}=\sqrt{${a * a}+${b * b}}=${c}$.</p><p>${{ e: `$e=\\dfrac ca=${fmt(answer, 4)}$.`, lr: `Latus rectum $=\\dfrac{2b^2}a=\\dfrac{${2 * b * b}}{${a}}=${fmt(answer, 4)}$.`, foci: `Foci $(\\pm${c},0)$ are $${2 * c}$ apart.`, slope: `Asymptotes $y=\\pm\\dfrac bax$, slope $\\dfrac{${b}}{${a}}=${fmt(answer, 4)}$.` }[w]}</p>` };
    },
    verify(p) { const c = Math.hypot(p.a, p.b); return { e: c / p.a, lr: (2 * p.b * p.b) / p.a, foci: 2 * c, slope: p.b / p.a }[p.w]; },
  },
  {
    id: 'cs-g05', type: 'mcq', format: 'single', level: 2, exams: EXS[2], sub: 'parabola: tangent',
    make(rng) {
      const a = choose(rng, [2, 3, 4, 6]), ms = [1, 2, 3, 6, -1, -2, -3].filter((m) => (a * (m > 0 ? 1 : 1)) % Math.abs(m) === 0), m = choose(rng, ms);
      const c = a / m;
      const ok = `$${yl(m, c)}$`;
      const { options, answer } = shuffleOpts(rng, ok, [`$${yl(m, -c)}$`, `$${yl(m, a * m)}$`, `$${yl(m, c + a)}$`]);
      return { a, m, c, options, answer,
        q: `The tangent to the parabola $y^2=${4 * a}x$ with slope $${m}$ is`,
        sol: String.raw`<p>$a=${a}$. The tangent with slope $m$ is $y=mx+\dfrac am$. Here $\dfrac am=\dfrac{${a}}{${m}}=${c}$.</p><p>So the tangent is $${yl(m, c)}$.</p>` };
    },
    verify(p) { // line y=mx+c meets y^2=4ax in a double root: (mx+c)^2=4ax -> disc=0
      const disc = (2 * p.m * p.c - 4 * p.a) ** 2 - 4 * p.m * p.m * p.c * p.c; return Math.abs(disc) < 1e-9 && p.options[p.answer] === `$${yl(p.m, p.c)}$` ? p.answer : -1; },
  },
  {
    id: 'cs-g06', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'parabola: normals',
    make(rng) {
      let a, h, k, D;
      do { a = choose(rng, [1, 2]); h = int(rng, -2, 9); k = int(rng, -5, 5); const p = (2 * a - h) / a, q = -k / a; D = -4 * p ** 3 - 27 * q * q; } while (Math.abs(D) < 1e-9);
      const answer = D > 0 ? 3 : 1;
      return { a, h, k, answer, tol: 0,
        q: `How many distinct real normals can be drawn from the point $(${h},${k})$ to the parabola $y^2=${4 * a}x$?`,
        sol: String.raw`<p>The normal at $(at^2,2at)$ is $y+tx=2at+at^3$. Through $(${h},${k})$: $${a === 1 ? '' : a}t^3+(${2 * a}-${sh(h)})t-${sh(k)}=0$, i.e. $${a === 1 ? '' : a}t^3${t(2 * a - h, 't')}${t(-k, '')}=0$.</p><p>For $t^3+pt+q=0$ the discriminant $-4p^3-27q^2$ decides: positive gives 3 real roots, negative gives 1. Here $p=${fmt((2 * a - h) / a, 4)}$, $q=${fmt(-k / a, 4)}$, and $-4p^3-27q^2=${fmt(D, 5)}$.</p><p>So the number of normals is ${answer}.</p>` };
    },
    verify(p) { const pp = (2 * p.a - p.h) / p.a, qq = -p.k / p.a; if (pp >= 0) return 1; const t1 = Math.sqrt(-pp / 3), f = (x) => x ** 3 + pp * x + qq; return f(-t1) * f(t1) < 0 ? 3 : 1; },
  },
  {
    id: 'cs-g07', type: 'nat', format: 'numeric', level: 3, exams: EXS[3], sub: 'parabola: focal chord',
    make(rng) {
      const a = int(rng, 1, 4), tt = choose(rng, [2, 3, 4, -2, -3]);
      const px = a * tt * tt, py = 2 * a * tt, len = a * (tt + 1 / tt) ** 2;
      return { a, tt, answer: len, tol: 0.01,
        q: `One end of a focal chord of $y^2=${4 * a}x$ is $(${px},${py})$. Find the length of the chord to 2 decimal places.`,
        sol: String.raw`<p>The end has parameter $t=${tt}$ (since $2at=${py}$). The other end of a focal chord has parameter $-\dfrac1t=${fmt(-1 / tt, 4)}$.</p><p>Length $=a\left(t+\dfrac1t\right)^2=${a}\left(${tt}+\dfrac1{${tt}}\right)^2=${fmt(len, 5)}$.</p><p>(Check: focal distances $x_1+a=${px + a}$ and $\dfrac a{t^2}+a=${fmt(a / (tt * tt) + a, 4)}$ add up to the same.)</p>` };
    },
    verify(p) { const t2 = -1 / p.tt; const x2 = p.a * t2 * t2, y2 = 2 * p.a * t2; return Math.hypot(p.a * p.tt * p.tt - x2, 2 * p.a * p.tt - y2); },
  },
  {
    id: 'cs-g08', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'parabola: focal chord',
    make(rng) {
      let a, p, q;
      do { a = choose(rng, [2, 3, 4, 6]); p = int(rng, a + 1, 4 * a); q = (a * p) / (p - a); } while (!Number.isInteger(q));
      const tot = rng() < 0.5;
      return { a, p, q, tot, answer: tot ? p + q : q, tol: 0,
        q: `A focal chord of the parabola $y^2=${4 * a}x$ is divided by the focus into two parts. One part has length ${p}. Find ${tot ? 'the length of the whole chord' : 'the length of the other part'}.`,
        sol: String.raw`<p>$a=${a}$. For a parabola $\dfrac1p+\dfrac1q=\dfrac1a$. So $\dfrac1q=\dfrac1{${a}}-\dfrac1{${p}}=\dfrac{${p - a}}{${a * p}}$ and $q=${q}$.</p>${tot ? `<p>Whole chord $=${p}+${q}=${p + q}$.</p>` : ''}` };
    },
    verify(p) { return Math.round(p.tot ? p.p + 1 / (1 / p.a - 1 / p.p) : 1 / (1 / p.a - 1 / p.p)); },
  },
  {
    id: 'cs-g09', type: 'nat', format: 'numeric', level: 3, exams: EXS[3], sub: 'ellipse: focal distances',
    make(rng) {
      const [a, b, c] = choose(rng, AB_E), x1 = int(rng, -a + 1, a - 1);
      const e = c / a, prod = a * a - e * e * x1 * x1;
      return { a, b, c, x1, answer: prod, tol: 0.01,
        q: `$P$ is a point of the ellipse $${ell(a * a, b * b)}$ with x-coordinate ${x1}, and $F_1$, $F_2$ are the foci. Find $PF_1\\cdot PF_2$ to 2 decimal places.`,
        sol: String.raw`<p>$e=\dfrac ca=\dfrac{${c}}{${a}}$. The focal distances are $a-ex_1$ and $a+ex_1$: $${fmt(a - e * x1, 5)}$ and $${fmt(a + e * x1, 5)}$.</p><p>Product $=a^2-e^2x_1^2=${a * a}-${fmt(e * e * x1 * x1, 5)}=${fmt(prod, 5)}$.</p>` };
    },
    verify(p) { const y1 = p.b * Math.sqrt(1 - p.x1 ** 2 / p.a ** 2); return Math.hypot(p.x1 - p.c, y1) * Math.hypot(p.x1 + p.c, y1); },
  },
  {
    id: 'cs-g10', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'ellipse: tangent condition',
    make(rng) {
      const a = int(rng, 2, 7), b = int(rng, 1, 6), m = int(rng, 1, 3) * sg(rng), c2 = a * a * m * m + b * b;
      return { a, b, m, answer: c2, tol: 0,
        q: `The line $y=${m === 1 ? '' : m === -1 ? '-' : m}x+c$ touches the ellipse $${ell(a * a, b * b)}$. Find $c^2$.`,
        sol: String.raw`<p>For $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$ the line $y=mx+c$ touches when $c^2=a^2m^2+b^2$.</p><p>$c^2=${a * a}\cdot${m * m}+${b * b}=${c2}$.</p>` };
    },
    verify(p) { // substitute y=mx+c: (b^2+a^2m^2)x^2+2a^2mcx+a^2(c^2-b^2)=0, discriminant zero at c^2
      const c = Math.sqrt(p.answer); const disc = (2 * p.a * p.a * p.m * c) ** 2 - 4 * (p.b * p.b + p.a * p.a * p.m * p.m) * p.a * p.a * (c * c - p.b * p.b); return Math.abs(disc) < 1e-6 ? p.answer : -1; },
  },
  {
    id: 'cs-g11', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'hyperbola: tangent condition',
    make(rng) {
      const a = int(rng, 2, 6), b = int(rng, 1, 3), m = int(rng, 2, 4) * sg(rng), c2 = a * a * m * m - b * b;
      return { a, b, m, answer: c2, tol: 0,
        q: `The line $y=${m}x+c$ touches the hyperbola $${hyp(a * a, b * b)}$. Find $c^2$.`,
        sol: String.raw`<p>For $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$ the line $y=mx+c$ touches when $c^2=a^2m^2-b^2$.</p><p>$c^2=${a * a}\cdot${m * m}-${b * b}=${c2}$.</p>` };
    },
    verify(p) { const c = Math.sqrt(p.answer); const disc = (2 * p.a * p.a * p.m * c) ** 2 + 4 * (p.b * p.b - p.a * p.a * p.m * p.m) * p.a * p.a * (c * c + p.b * p.b); return Math.abs(disc) < 1e-6 ? p.answer : -1; },
  },
  {
    id: 'cs-g12', type: 'mcq', format: 'single', level: 2, exams: EXS[2], sub: 'equation of a conic',
    make(rng) {
      const hyper = rng() < 0.5;
      if (!hyper) {
        const [a, , c] = choose(rng, AB_E.filter((r) => r[0] <= 17)), b2 = a * a - c * c;
        const ok = `$${ell(a * a, b2)}$`;
        const { options, answer } = shuffleOpts(rng, ok, [`$${ell(a * a, a * a + c * c)}$`, `$${ell(b2, a * a)}$`, `$${ell(a * a, c * c)}$`]);
        return { hyper, a, c, options, answer, q: `The ellipse with foci $(\\pm${c},0)$ and major axis of length ${2 * a} is`,
          sol: String.raw`<p>$2a=${2 * a}$, so $a=${a}$; $c=${c}$. $b^2=a^2-c^2=${a * a}-${c * c}=${b2}$.</p><p>Equation: $${ell(a * a, b2)}$.</p>` };
      }
      const [a, , c] = choose(rng, AB_H.filter((r) => r[0] <= 12)), b2 = c * c - a * a;
      const ok = `$${hyp(a * a, b2)}$`;
      const { options, answer } = shuffleOpts(rng, ok, [`$${hyp(a * a, c * c + a * a)}$`, `$${hyp(b2, a * a)}$`, `$${ell(a * a, b2)}$`]);
      return { hyper, a, c, options, answer, q: `The hyperbola with foci $(\\pm${c},0)$ and transverse axis of length ${2 * a} is`,
        sol: String.raw`<p>$2a=${2 * a}$, so $a=${a}$; $c=${c}$. $b^2=c^2-a^2=${c * c}-${a * a}=${b2}$.</p><p>Equation: $${hyp(a * a, b2)}$.</p>` };
    },
    verify(p) { const b2 = p.hyper ? p.c * p.c - p.a * p.a : p.a * p.a - p.c * p.c; const exp = `$${p.hyper ? hyp(p.a * p.a, b2) : ell(p.a * p.a, b2)}$`; return p.options[p.answer] === exp ? p.answer : -1; },
  },
  {
    id: 'cs-g13', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'parametric form',
    make(rng) {
      const a = int(rng, 1, 7), tt = int(rng, 1, 5) * sg(rng), w = choose(rng, ['sum', 'diff']);
      const x = a * tt * tt, y = 2 * a * tt, answer = w === 'sum' ? x + y : x - y;
      return { a, tt, w, answer, tol: 0,
        q: `The point with parameter $t=${tt}$ on the parabola $y^2=${4 * a}x$ is $(at^2,2at)$ with the right $a$. Find $x${w === 'sum' ? '+' : '-'}y$ for this point.`,
        sol: String.raw`<p>$4a=${4 * a}$, so $a=${a}$. $x=at^2=${a}\cdot${tt * tt}=${x}$ and $y=2at=2\cdot${a}\cdot${sh(tt)}=${y}$.</p><p>$x${w === 'sum' ? '+' : '-'}y=${x}${w === 'sum' ? '+' : '-'}(${y})=${answer}$.</p>` };
    },
    verify(p) { const x = p.a * p.tt ** 2, y = 2 * p.a * p.tt; return (y * y === 4 * p.a * x) ? (p.w === 'sum' ? x + y : x - y) : NaN; },
  },
  {
    id: 'cs-g14', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'parabola: normals',
    make(rng) {
      const a = int(rng, 1, 4), t1 = choose(rng, [1, 2, -1, -2]), t2 = -t1 - 2 / t1, w = choose(rng, ['x', 'y']);
      const X = a * t2 * t2, Y = 2 * a * t2, answer = w === 'x' ? X : Y;
      return { a, t1, w, answer, tol: 0,
        q: `The normal at the point $(${a * t1 * t1},${2 * a * t1})$ of $y^2=${4 * a}x$ meets the parabola again at a second point. Find its ${w === 'x' ? 'x' : 'y'}-coordinate.`,
        sol: String.raw`<p>$a=${a}$ and the first point has $t_1=${t1}$. The normal meets the parabola again at $t_2=-t_1-\dfrac2{t_1}=${t2}$.</p><p>The point is $(at_2^2,2at_2)=(${X},${Y})$. The ${w === 'x' ? 'x' : 'y'}-coordinate is ${answer}.</p>` };
    },
    verify(p) { // normal: y + t1 x = 2a t1 + a t1^3 with x=y^2/(4a): (t1/(4a)) y^2 + y - (2a t1 + a t1^3)=0; sum of roots = -4a/t1
      const y1 = 2 * p.a * p.t1, y2 = -4 * p.a / p.t1 - y1, x2 = (y2 * y2) / (4 * p.a); return Math.round(p.w === 'x' ? x2 : y2); },
  },
  {
    id: 'cs-g15', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'rectangular hyperbola',
    make(rng) {
      const c = int(rng, 2, 9), K = c * c;
      return { c, answer: 2 * K, tol: 0,
        q: `The tangent at any point of the rectangular hyperbola $xy=${K}$ meets the coordinate axes at $A$ and $B$. Find the area of triangle $OAB$, where $O$ is the origin.`,
        sol: String.raw`<p>With $c^2=${K}$ the tangent at $(ct,c/t)$ is $\dfrac xt+ty=2c$, with intercepts $2ct$ and $\dfrac{2c}t$.</p><p>Area $=\dfrac12\cdot2ct\cdot\dfrac{2c}t=2c^2=${2 * K}$, whatever the point.</p>` };
    },
    verify(p) { const t = 1.7, ix = 2 * p.c * t, iy = (2 * p.c) / t; return Math.round((ix * iy) / 2); },
  },
  {
    id: 'cs-g16', type: 'nat', format: 'numeric', level: 4, exams: EXS[4], sub: 'hyperbola: asymptotes',
    make(rng) {
      const a = int(rng, 2, 9), b = int(rng, 2, 9);
      return { a, b, answer: (a * a * b * b) / (a * a + b * b), tol: 0.01,
        q: `For any point of the hyperbola $${hyp(a * a, b * b)}$ the product of its distances from the two asymptotes is constant. Find it to 2 decimal places.`,
        sol: String.raw`<p>The asymptotes are $bx-ay=0$ and $bx+ay=0$. For a point $(x,y)$ the product of distances is $\dfrac{|b^2x^2-a^2y^2|}{a^2+b^2}$. On the curve $b^2x^2-a^2y^2=a^2b^2$.</p><p>Constant $=\dfrac{a^2b^2}{a^2+b^2}=\dfrac{${a * a * b * b}}{${a * a + b * b}}=${fmt((a * a * b * b) / (a * a + b * b), 5)}$.</p>` };
    },
    verify(p) { const th = 0.7, x = p.a / Math.cos(th), y = p.b * Math.tan(th), n = Math.hypot(p.a, p.b); return (Math.abs(p.b * x - p.a * y) / n) * (Math.abs(p.b * x + p.a * y) / n); },
  },
  {
    id: 'cs-g17', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'hyperbola: tangent and asymptotes',
    make(rng) {
      const a = int(rng, 2, 9), b = int(rng, 2, 9);
      return { a, b, answer: a * b, tol: 0,
        q: `A tangent to the hyperbola $${hyp(a * a, b * b)}$ and the two asymptotes enclose a triangle. Find its area.`,
        sol: String.raw`<p>The tangent at $(a\sec\theta,b\tan\theta)$ meets the asymptotes at $x=\dfrac{a}{\sec\theta-\tan\theta}$ and $x=\dfrac a{\sec\theta+\tan\theta}$. The area works out to the constant $ab$.</p><p>Here $ab=${a}\cdot${b}=${a * b}$.</p>` };
    },
    verify(p) { const th = 0.6, xs = p.a / Math.cos(th), ys = p.b * Math.tan(th); // tangent at P: x*xs/a^2 - y*ys/b^2 = 1
      const xA = p.a / (1 / Math.cos(th) - Math.tan(th)), xB = p.a / (1 / Math.cos(th) + Math.tan(th)); const A = [xA, (p.b / p.a) * xA], B = [xB, -(p.b / p.a) * xB];
      return Math.round(Math.abs(A[0] * B[1] - A[1] * B[0]) / 2); },
  },
  {
    id: 'cs-g18', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'ellipse: extreme values',
    make(rng) {
      const a = int(rng, 2, 9), b = int(rng, 1, 8), tri = rng() < 0.5;
      return { a, b, tri, answer: tri ? a * b : 2 * a * b, tol: 0,
        q: tri
          ? `Tangents to the ellipse $${ell(a * a, b * b)}$ cut off triangles from the first quadrant by the axes. Find the least possible area of such a triangle.`
          : `Find the area of the largest rectangle with sides parallel to the axes that can be inscribed in the ellipse $${ell(a * a, b * b)}$.`,
        sol: tri
          ? String.raw`<p>Tangent at $\theta$: $\dfrac{x\cos\theta}{${a}}+\dfrac{y\sin\theta}{${b}}=1$. Intercepts $\dfrac{${a}}{\cos\theta}$ and $\dfrac{${b}}{\sin\theta}$. Area $=\dfrac{${a * b}}{\sin\theta\cos\theta}=\dfrac{${2 * a * b}}{\sin2\theta}\ge${2 * a * b}\cdot\dfrac12$.</p><p>Minimum area $=ab=${a * b}$.</p>`
          : String.raw`<p>Corners $(\pm${a}\cos\theta,\pm${b}\sin\theta)$. Area $=4\cdot${a}\cos\theta\cdot${b}\sin\theta=${2 * a * b}\sin2\theta$, with maximum $2ab=${2 * a * b}$.</p>` };
    },
    verify(p) { let best = p.tri ? 1e9 : 0; for (let i = 1; i < 20000; i++) { const th = (i / 20000) * (Math.PI / 2); const v = p.tri ? 0.5 * (p.a / Math.cos(th)) * (p.b / Math.sin(th)) : 4 * p.a * Math.cos(th) * p.b * Math.sin(th); best = p.tri ? Math.min(best, v) : Math.max(best, v); } return Math.round(best); },
  },
  {
    id: 'cs-g19', type: 'nat', format: 'numeric', level: 3, exams: EXS[3], sub: 'parabola: focal chord',
    make(rng) {
      const a = int(rng, 1, 4), m = choose(rng, [1, 2, 3, -1, -2]);
      const len = (4 * a * (1 + m * m)) / (m * m);
      return { a, m, answer: len, tol: 0.01,
        q: `A line of slope $${m}$ through the focus of the parabola $y^2=${4 * a}x$ cuts it at $A$ and $B$. Find $AB$ to 2 decimal places.`,
        sol: String.raw`<p>The line is $y=${m}(x-${a})$. Substituting into $y^2=${4 * a}x$ gives $${m * m}x^2-${2 * a * m * m + 4 * a}x+${a * a * m * m}=0$, so $x_1+x_2=\dfrac{${2 * a * m * m + 4 * a}}{${m * m}}$.</p><p>For a focal chord $AB=x_1+x_2+2a=${fmt((2 * a * m * m + 4 * a) / (m * m) + 2 * a, 5)}$.</p>` };
    },
    verify(p) { const A = p.m * p.m, B = -(2 * p.a * p.m * p.m + 4 * p.a), C = p.a * p.a * p.m * p.m, d = Math.sqrt(B * B - 4 * A * C); const x1 = (-B + d) / (2 * A), x2 = (-B - d) / (2 * A); return Math.hypot(x1 - x2, p.m * (x1 - x2)); },
  },
  {
    id: 'cs-g20', type: 'nat', format: 'numeric', level: 3, exams: EXS[3], sub: 'ellipse: eccentricity',
    make(rng) {
      const [pn, pd] = choose(rng, [[1, 1], [2, 1], [3, 4], [4, 3], [1, 2], [3, 1]]), p = pn / pd;
      return { pn, pd, answer: p / Math.sqrt(1 + p * p), tol: 0.01,
        q: `In an ellipse the distance between the foci is ${pn === pd ? 'equal to' : pd === 1 ? `${pn} times` : `$\\dfrac{${pn}}{${pd}}$ of`} the length of the minor axis. Find the eccentricity to 2 decimal places.`,
        sol: String.raw`<p>$2c=p\cdot2b$ with $p=${fmt(p, 4)}$, so $c=pb$.</p><p>$a^2=b^2+c^2=b^2(1+p^2)$, so $e=\dfrac ca=\dfrac{p}{\sqrt{1+p^2}}=${fmt(p / Math.sqrt(1 + p * p), 4)}$.</p>` };
    },
    verify(p) { const b = 5, c = (p.pn / p.pd) * b, a = Math.sqrt(b * b + c * c); return c / a; },
  },
  {
    id: 'cs-g21', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'tangents from a point',
    make(rng) {
      const a = int(rng, 2, 7), b = int(rng, 1, 6), cs = int(rng, 0, 2);
      let x, y;
      if (cs === 1) [x, y] = choose(rng, [[a, 0], [-a, 0], [0, b], [0, -b]]);
      else if (cs === 0) { x = int(rng, -1, 1); y = int(rng, -1, 1); if (x * x / (a * a) + y * y / (b * b) >= 1) { x = 0; y = 0; } }
      else { x = sg(rng) * (a + int(rng, 1, 4)); y = int(rng, -3, 3); }
      const v = (x * x) / (a * a) + (y * y) / (b * b), ans = Math.abs(v - 1) < 1e-9 ? 1 : v < 1 ? 0 : 2;
      return { a, b, x, y, answer: ans, tol: 0,
        q: `How many tangents can be drawn from the point $(${x},${y})$ to the ellipse $${ell(a * a, b * b)}$?`,
        sol: String.raw`<p>Put the point into $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}-1$: $\dfrac{${x * x}}{${a * a}}+\dfrac{${y * y}}{${b * b}}-1=${fmt(v - 1, 4)}$.</p><p>${ans === 2 ? 'Positive: the point is outside, so 2 tangents.' : ans === 1 ? 'Zero: the point is on the ellipse, so exactly 1 tangent.' : 'Negative: the point is inside, so no tangent.'}</p>` };
    },
    verify(p) { const v = (p.x / p.a) ** 2 + (p.y / p.b) ** 2; return Math.abs(v - 1) < 1e-9 ? 1 : v < 1 ? 0 : 2; },
  },
  {
    id: 'cs-g22', type: 'nat', format: 'numeric', level: 3, exams: EXS[3], sub: 'directrices',
    make(rng) {
      const hyper = rng() < 0.5, [a, b, c] = hyper ? choose(rng, AB_H) : choose(rng, AB_E);
      const d = (2 * a * a) / c;
      return { hyper, a, b, c, answer: d, tol: 0.01,
        q: `Find the distance between the two directrices of the ${hyper ? 'hyperbola' : 'ellipse'} $${hyper ? hyp(a * a, b * b) : ell(a * a, b * b)}$, to 2 decimal places.`,
        sol: String.raw`<p>$a=${a}$, $c=${c}$, $e=\dfrac ca=${fmt(c / a, 4)}$. The directrices are $x=\pm\dfrac ae=\pm${fmt(a / (c / a), 4)}$.</p><p>Distance between them $=\dfrac{2a}e=\dfrac{2a^2}{c}=${fmt(d, 5)}$.</p>` };
    },
    verify(p) { const e = p.hyper ? Math.sqrt(1 + (p.b / p.a) ** 2) : Math.sqrt(1 - (p.b / p.a) ** 2); return (2 * p.a) / e; },
  },
  {
    id: 'cs-g23', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'conics meeting',
    make(rng) {
      const k = choose(rng, [2, 8, 18, 32, 50]), cs = int(rng, 0, 2);
      const r2 = cs === 0 ? 2 * k : cs === 1 ? 2 * k + int(rng, 1, 30) : Math.max(1, 2 * k - int(rng, 1, 2 * k - 1));
      const ans = r2 > 2 * k ? 4 : r2 === 2 * k ? 2 : 0;
      return { k, r2, answer: ans, tol: 0,
        q: `How many points do the curves $xy=${k}$ and $x^2+y^2=${r2}$ have in common?`,
        sol: String.raw`<p>Since $(x-y)^2\ge0$ and $(x+y)^2\ge0$, we have $x^2+y^2\ge2|xy|$. Here $2|xy|=${2 * k}$.</p><p>${ans === 4 ? `$${r2}>${2 * k}$: the circle is larger than the minimum, and it cuts each of the two branches twice: 4 points.` : ans === 2 ? `$${r2}=${2 * k}$: the circle just touches each branch at one point $(\\pm\\sqrt{${k}},\\pm\\sqrt{${k}})$: 2 points.` : `$${r2}<${2 * k}$: no point of $xy=${k}$ is that close to the origin: 0 points.`}</p>` };
    },
    verify(p) { let n = 0; const roots = []; // x^4 - r2 x^2 + k^2 = 0
      const D = p.r2 * p.r2 - 4 * p.k * p.k; if (D < -1e-9) return 0; if (Math.abs(D) < 1e-9) return 2; return 4; },
  },
  {
    id: 'cs-g24', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'parabola: triangle',
    make(rng) {
      const a = int(rng, 1, 3);
      let t1, t2; do { t1 = int(rng, -3, 3); t2 = int(rng, -3, 3); } while (t1 === t2 || t1 === 0 || t2 === 0);
      const area = a * a * Math.abs(t1 * t2 * (t1 - t2));
      return { a, t1, t2, answer: area, tol: 0,
        q: `Find the area of the triangle formed by the vertex of $y^2=${4 * a}x$ and the points of the parabola with parameters $t=${t1}$ and $t=${t2}$ (the point with parameter $t$ is $(at^2,2at)$).`,
        sol: String.raw`<p>$a=${a}$. The points are $P(${a * t1 * t1},${2 * a * t1})$ and $Q(${a * t2 * t2},${2 * a * t2})$, and the vertex is $(0,0)$.</p><p>Area $=\dfrac12|x_Py_Q-x_Qy_P|=\dfrac12|${a * t1 * t1}\cdot${2 * a * t2}-${a * t2 * t2}\cdot${2 * a * t1}|=${area}$.</p>` };
    },
    verify(p) { const x1 = p.a * p.t1 ** 2, y1 = 2 * p.a * p.t1, x2 = p.a * p.t2 ** 2, y2 = 2 * p.a * p.t2; return Math.round(Math.abs(x1 * y2 - x2 * y1) / 2); },
  },
  {
    id: 'cs-g25', type: 'nat', format: 'numeric', level: 4, exams: EXS[4], sub: 'parabola: tangents',
    make(rng) {
      const a = choose(rng, [2, 4, 6]), t1 = choose(rng, [2, -2, 4, -4, 5]);
      const t2 = -1 / t1, y = a * (t1 + t2);
      return { a, t1, answer: y, tol: 0.01,
        q: `A focal chord of $y^2=${4 * a}x$ has one end with parameter $t=${t1}$. The tangents at its two ends meet at $(p,q)$. Find $q$ to 2 decimal places.`,
        sol: String.raw`<p>$a=${a}$. The other end has $t_2=-\dfrac1{t_1}=${fmt(t2, 4)}$. Tangents at $t_1$, $t_2$ meet at $(at_1t_2,a(t_1+t_2))=(${-a},${fmt(y, 5)})$, a point of the directrix.</p><p>$q=${fmt(y, 5)}$.</p>` };
    },
    verify(p) { const t2 = -1 / p.t1; // t1*y = x + a t1^2 ; t2*y = x + a t2^2 -> y = a(t1+t2)
      const y = (p.a * p.t1 ** 2 - p.a * t2 ** 2) / (p.t1 - t2); return y; },
  },
];

// ---- Expansion 2026-11-22: extra questions (ids cs-x001 and on). Everything above this line is unchanged.
{
const R = String.raw;
const XEX = { 1: ['keam', 'cusat', 'comedk', 'jee-main'], 2: ['keam', 'cusat', 'comedk', 'jee-main'], 3: ['jee-main', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const XCUET = false;
const XPOS = [2, 0, 3, 1, 1, 3, 0, 2, 3, 2, 0, 1, 0, 3, 1, 2];
let xn = 0, xk = 0;
const xplace = (c, w) => { const p = XPOS[xk++ % XPOS.length]; const o = [...w]; o.splice(p, 0, c); return { options: o, answer: p }; };
const xb = (level, sub, extra) => ({ id: `cs-x${String(++xn).padStart(3, '0')}`, level, exams: [...XEX[level], ...(XCUET && extra.type === 'mcq' && level <= 3 ? ['cuet'] : [])], sub, ...extra });
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
const PIE = Math.PI, sq = Math.sqrt, sin = Math.sin, cos = Math.cos, tan = Math.tan, atan = Math.atan, acos = Math.acos;
const hyp = (a, b) => Math.hypot(a, b);
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
// area of a triangle from three points
const area3 = (P, Q, R_) => Math.abs((Q[0] - P[0]) * (R_[1] - P[1]) - (R_[0] - P[0]) * (Q[1] - P[1])) / 2;
// intersection of two lines a1 x + b1 y = c1, a2 x + b2 y = c2
const meet = ([a1, b1, c1], [a2, b2, c2]) => { const d = a1 * b2 - a2 * b1; return [(c1 * b2 - c2 * b1) / d, (a1 * c2 - a2 * c1) / d]; };
// real roots of a cubic by scanning for sign changes and bisecting
const cubicRoots = (f, lo = -60, hi = 60) => { const r = []; let prev = f(lo + ((hi - lo) * 0.3719) / 240000), x0 = lo + ((hi - lo) * 0.3719) / 240000; for (let i = 1; i <= 240000; i++) { const x = lo + ((hi - lo) * (i + 0.3719)) / 240000, v = f(x); if (prev * v < 0) { let a = x0, b = x; for (let j = 0; j < 80; j++) { const m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; } r.push((a + b) / 2); } prev = v; x0 = x; } return r; };
PG('xp1', 'A point on a parabola', R`<p>The point $P(2,4)$ lies on the parabola $y^2=8x$, whose focus is $S(2,0)$.</p>`);
PG('xp2', 'An ellipse and its foci', R`<p>The ellipse $\dfrac{x^2}{25}+\dfrac{y^2}9=1$ has foci $S$ and $S'$. The point $P$ is the end $(0,3)$ of its minor axis.</p>`);
const add = [
  // ---------- level 2
  I(2, 'parabola: latus rectum', R`The length of the latus rectum of the parabola $y^2=12x$ is`, 12, R`<p>For $y^2=4ax$ the latus rectum is $4a$. Here $4a=12$.</p>`, 'The coefficient of x is already 4a.', { calc: () => 12 }),
  M(2, 'ellipse: eccentricity', R`The eccentricity of $\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$ is`, '$\\dfrac35$', ['$\\dfrac45$', '$\\dfrac{9}{25}$', '$\\dfrac53$'], R`<p>$a^2=25$, $b^2=16$, $e=\sqrt{1-\dfrac{b^2}{a^2}}=\sqrt{\dfrac9{25}}=\dfrac35$.</p>`, 'b/a is 4/5, which is not e.'),
  I(2, 'ellipse: axes', R`The length of the major axis of $9x^2+25y^2=225$ is`, 10, R`<p>Divide by $225$: $\dfrac{x^2}{25}+\dfrac{y^2}9=1$. $a=5$, so the major axis is $2a=10$.</p>`, 'Length is 2a, not a.', { calc: () => 2 * sq(225 / 9) }),
  M(2, 'hyperbola: foci', R`The foci of $\dfrac{x^2}9-\dfrac{y^2}{16}=1$ are`, '$(\\pm5,0)$', ['$(\\pm3,0)$', '$(\\pm\\sqrt7,0)$', '$(0,\\pm5)$'], R`<p>For a hyperbola $c^2=a^2+b^2=9+16=25$, so the foci are $(\pm5,0)$ on the transverse (x) axis.</p>`, 'Hyperbola: plus. Ellipse: minus.'),
  M(2, 'parabola: equation', R`The parabola with focus $(2,0)$ and directrix $x=-2$ is`, '$y^2=8x$', ['$y^2=4x$', '$x^2=8y$', '$y^2=-8x$'], R`<p>Vertex is midway: $(0,0)$, and $a=2$. It opens right, so $y^2=4ax=8x$.</p>`, 'Distance focus-to-directrix is 2a.'),
  I(2, 'ellipse: foci', R`The distance between the foci of $\dfrac{x^2}{16}+\dfrac{y^2}7=1$ is`, 6, R`<p>$c^2=a^2-b^2=16-7=9$, $c=3$. Distance between foci $=2c=6$.</p>`, 'The distance is 2c.', { calc: () => 2 * sq(16 - 7) }),
  // ---------- level 3
  N(3, 'hyperbola: eccentricity', R`Find the eccentricity of $9x^2-16y^2=144$.`, 1.25, 0.005, R`<p>$\dfrac{x^2}{16}-\dfrac{y^2}9=1$. $e=\sqrt{1+\dfrac{b^2}{a^2}}=\sqrt{1+\dfrac9{16}}=\dfrac54=1.25$.</p>`, 'Divide by 144 first.', { calc: () => sq(1 + 9 / 16) }),
  I(3, 'parabola: focal distance', R`The focal distance of the point on $y^2=8x$ with abscissa $5$ is`, 7, R`<p>$a=2$. For a point $(x_1,y_1)$ on $y^2=4ax$ the focal distance is $x_1+a=5+2=7$.</p>`, 'Focal distance is x + a, not x.', { calc: () => 5 + 2 }),
  M(3, 'parabola: tangent', R`The tangent to $y^2=16x$ at $(1,4)$ is`, '$y=2x+2$', ['$y=x+4$', '$y=4x$', '$y=2x+4$'], R`<p>$a=4$. Tangent at $(x_1,y_1)$: $yy_1=2a(x+x_1)$, i.e. $4y=8(x+1)$, so $y=2x+2$.</p>`, 'The factor is 2a, not a.'),
  I(3, 'ellipse: focal distances', R`The sum of the distances of a point on $\dfrac{x^2}{25}+\dfrac{y^2}{9}=1$ from the two foci is`, 10, R`<p>For any point of an ellipse the sum of focal distances is $2a=10$.</p>`, 'It is the major axis, 2a.', { calc: () => 2 * 5 }),
  I(3, 'parabola: tangent condition', R`The line $y=x+c$ touches the parabola $y^2=8x$. Then $c=$`, 2, R`<p>For $y^2=4ax$, the line $y=mx+c$ touches if $c=\dfrac am$. Here $a=2$, $m=1$, so $c=2$.</p>`, 'The condition is c = a/m for slope m.', { calc: () => 2 / 1 }),
  I(3, 'parabola: latus rectum', R`The area of the triangle formed by the vertex and the ends of the latus rectum of $y^2=12x$ is`, 18, R`<p>$a=3$. The ends are $(3,\pm6)$. Base $=12$, height $=3$. Area $=\dfrac12\cdot12\cdot3=18=2a^2$.</p>`, 'The base is the latus rectum, 4a.', { calc: () => 0.5 * 12 * 3 }),
  N(3, 'ellipse: latus rectum', R`The length of the latus rectum of $\dfrac{x^2}{25}+\dfrac{y^2}9=1$ is`, 3.6, 0.005, R`<p>Latus rectum $=\dfrac{2b^2}{a}=\dfrac{2\cdot9}5=3.6$.</p>`, 'Use b squared over a, with the major semi-axis a.', { calc: () => (2 * 9) / 5 }),
  M(3, 'hyperbola: asymptotes', R`The asymptotes of $\dfrac{x^2}9-\dfrac{y^2}4=1$ are`, '$y=\\pm\\dfrac23x$', ['$y=\\pm\\dfrac32x$', '$y=\\pm\\dfrac49x$', '$y=\\pm\\dfrac{\\sqrt{13}}3x$'], R`<p>Asymptotes of $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$ are $y=\pm\dfrac bax=\pm\dfrac23x$.</p>`, 'b over a, not a over b.'),
  A(3, 'parabola: definition', R`The eccentricity of a parabola is $1$.`, R`Every point of a parabola is equidistant from its focus and its directrix.`, 0, R`<p>Both are true. Eccentricity is the ratio (distance from focus) to (distance from directrix), which is $1$ for a parabola by definition.</p>`, 'e is the ratio in the definition.'),
  S(3, 'eccentricity', R`The eccentricity of an ellipse is less than $1$.`, R`The eccentricity of a hyperbola is greater than $1$.`, 0, R`<p>Both true: $0<e<1$ for an ellipse, $e>1$ for a hyperbola, $e=1$ for a parabola.</p>`, 'Compare with 1.'),
  SC(3, 'basic facts', [R`An ellipse has $e<1$.`, R`A rectangular hyperbola has $e=\sqrt2$.`, R`A parabola has two foci.`, R`The directrix of $y^2=4ax$ is $x=-a$.`, R`The latus rectum of an ellipse is $\dfrac{2b^2}a$.`], '4', ['3', '5', '2'], R`<p>1, 2, 4, 5 are correct. A parabola has one focus. So four are correct.</p>`, 'The second focus of a parabola is at infinity.'),
  I(3, 'parabola: focus', R`The distance between the focus and the directrix of $y^2=6x$ is`, 3, R`<p>$4a=6$, $a=1.5$. Distance $=2a=3$.</p>`, 'It is 2a, not a.', { calc: () => 2 * (6 / 4) }),
  M(3, 'identifying a conic', R`The centre of $4x^2+9y^2-16x+18y-11=0$ is`, '$(2,-1)$', ['$(-2,1)$', '$(4,-2)$', '$(2,1)$'], R`<p>$4(x^2-4x)+9(y^2+2y)=11\Rightarrow4(x-2)^2+9(y+1)^2=11+16+9=36$. So $\dfrac{(x-2)^2}9+\dfrac{(y+1)^2}4=1$: an ellipse with centre $(2,-1)$.</p>`, 'Complete the square: signs flip for the centre.'),
  I(3, 'rectangular hyperbola', R`The distance between the two vertices of the rectangular hyperbola $xy=18$ is`, 12, R`<p>For $xy=c^2$ the vertices are $(c,c)$ and $(-c,-c)$, with $c=\sqrt{18}$. Distance $=2\sqrt2\,c=2\sqrt2\cdot\sqrt{18}=2\sqrt{36}=12$.</p>`, 'The vertices lie on the line y = x.', { calc: () => hyp(2 * sq(18), 2 * sq(18)) }),
  I(3, 'ellipse: focal distances', R`A point $P$ on $\dfrac{x^2}{25}+\dfrac{y^2}9=1$ has eccentric angle $60^\circ$. The larger of its two focal distances is`, 7, R`<p>$P=(5\cos60^\circ,3\sin60^\circ)$, so $x=2.5$. $e=\dfrac45$. Focal distances $a\pm ex=5\pm2=3,7$. The larger is $7$.</p>`, 'Focal distances are a plus or minus e x.', { calc: () => { const x = 5 * cos(PIE / 3), y = 3 * sin(PIE / 3); return Math.max(hyp(x - 4, y), hyp(x + 4, y)); } }),
  N(3, 'ellipse: area', R`An ellipse has foci $(\pm3,0)$ and eccentricity $\dfrac35$. Find its area (in square units).`, 62.83, 0.01, R`<p>$ae=3$ gives $a=5$. $b^2=a^2(1-e^2)=25\cdot\dfrac{16}{25}=16$, $b=4$. Area $=\pi ab=20\pi=62.83$.</p>`, 'The area of an ellipse is pi a b.', { calc: () => PIE * 5 * 4 }),
  I(3, 'rectangular hyperbola', R`The foci of the rectangular hyperbola $x^2-y^2=a^2$ are $8$ units apart. Then $a^2=$`, 8, R`<p>Foci at $(\pm ae,0)$ with $e=\sqrt2$: distance $=2\sqrt2\,a=8$, so $a=2\sqrt2$ and $a^2=8$.</p>`, 'Rectangular means e = sqrt 2.', { calc: () => (8 / (2 * sq(2))) ** 2 }),
  I(3, 'director circle', R`The radius of the director circle of $\dfrac{x^2}{16}+\dfrac{y^2}{9}=1$ is`, 5, R`<p>The director circle is $x^2+y^2=a^2+b^2=25$, radius $5$.</p>`, 'It is the circle of perpendicular tangents.', { calc: () => sq(16 + 9) }),
  // ---------- level 4
  I(4, 'parabola: focal chord', R`For the parabola $y^2=12x$, a focal chord $PQ$ has $SP=4.5$ where $S$ is the focus. Then $SQ=$`, 9, R`<p>$a=3$. For a focal chord $\dfrac1{SP}+\dfrac1{SQ}=\dfrac1a$. So $\dfrac1{SQ}=\dfrac13-\dfrac2{9}=\dfrac19$, $SQ=9$.</p>`, 'The relation is for reciprocals.', { calc: () => 1 / (1 / 3 - 1 / 4.5) }),
  I(4, 'parabola: focal chord', R`A focal chord of $y^2=8x$ makes an angle of $30^\circ$ with the axis. Its length is`, 32, R`<p>A focal chord inclined at $\theta$ to the axis of $y^2=4ax$ has length $\dfrac{4a}{\sin^2\theta}$. With $a=2$: $\dfrac{8}{1/4}=32$.</p>`, 'The angle is with the axis, so use sin squared.', { calc: () => 8 / sin(PIE / 6) ** 2 }),
  N(4, 'chord of contact', R`The chord of contact of the tangents from $(-2,3)$ to $y^2=8x$ meets the parabola at two points. Find the length of this chord.`, 12.5, 0.01, R`<p>Chord of contact $T=0$: $3y=4(x-2)$, i.e. $4x-3y-8=0$. Put $x=\dfrac{3y+8}4$ into $y^2=8x$: $y^2=6y+16\Rightarrow y=8,-2$. Points $(8,8)$ and $\left(\dfrac12,-2\right)$.</p><p>Length $=\sqrt{7.5^2+10^2}=12.5$.</p>`, 'Use T = 0 with a = 2: y y1 = 4(x + x1).', { calc: () => hyp(8 - 0.5, 8 + 2) }),
  N(4, 'parabola: normal', R`The normal to $y^2=4x$ at $(4,4)$ meets the parabola again at $Q$. Find the distance from $(4,4)$ to $Q$.`, 11.18, 0.01, R`<p>Slope of the tangent at $(4,4)$: $\dfrac{dy}{dx}=\dfrac2y=\dfrac12$, so the normal has slope $-2$: $2x+y=12$. Substitute $x=\dfrac{12-y}2$ into $y^2=4x$: $y^2+2y-24=0$, $y=4$ or $-6$. $Q=(9,-6)$.</p><p>Distance $=\sqrt{5^2+10^2}=\sqrt{125}=11.18$.</p>`, 'The normal slope is the negative reciprocal.', { calc: () => hyp(5, 10) }),
  I(4, 'parabola: tangent', R`The tangent at $(4,4)$ to $y^2=4x$ meets the axes at $P$ and $Q$. The area of triangle $OPQ$ ($O$ is the origin) is`, 4, R`<p>Tangent: $4y=2(x+4)$, i.e. $x-2y+4=0$. Intercepts: $x=-4$, $y=2$. Area $=\dfrac12\cdot4\cdot2=4$.</p>`, 'Use absolute values of the intercepts.', { calc: () => 0.5 * 4 * 2 }),
  N(4, 'ellipse: tangent', R`The tangent to $\dfrac{x^2}{16}+\dfrac{y^2}9=1$ with slope $1$ and positive $y$-intercept meets the axes at two points. Find the area of the triangle it makes with the axes.`, 12.5, 0.01, R`<p>$c=\sqrt{a^2m^2+b^2}=\sqrt{16+9}=5$. Tangent $y=x+5$: intercepts $-5$ and $5$. Area $=\dfrac12\cdot5\cdot5=12.5$.</p>`, 'c is the square root of a^2 m^2 + b^2.', { calc: () => 0.5 * 5 * 5 }),
  I(4, 'hyperbola: tangent', R`For the hyperbola $\dfrac{x^2}9-\dfrac{y^2}{16}=1$, the product of the perpendicular distances from the two foci to any tangent is`, 16, R`<p>For both ellipse and hyperbola the product is $b^2$. Here $b^2=16$. (Check with the vertex tangent $x=3$ and foci $(\pm5,0)$: $|5-3|\cdot|-5-3|=2\cdot8=16$.)</p>`, 'The product is b squared, whichever the conic.', { calc: () => (5 - 3) * (5 + 3) }),
  I(4, 'parabola: locus', R`The mid-points of the focal chords of $y^2=8x$ lie on a parabola. The length of its latus rectum is`, 4, R`<p>For $y^2=4ax$ the mid-point $(h,k)$ of a focal chord satisfies $k^2=2a(h-a)$. With $a=2$: $y^2=4(x-2)$. Its latus rectum is $4$.</p>`, 'Derive with T = S1 through the focus.', { calc: () => 4 }),
  N(4, 'locus', R`A point moves so that its distance from $(3,0)$ is $\dfrac35$ of its distance from the line $x=5$. Find the length of the major axis of its locus.`, 3.75, 0.01, R`<p>$(x-3)^2+y^2=\dfrac9{25}(x-5)^2\Rightarrow16x^2+25y^2-60x=0$. Complete the square: $16\left(x-\dfrac{15}8\right)^2+25y^2=\dfrac{225}4$. So $\dfrac{(x-1.875)^2}{3.5156}+\dfrac{y^2}{2.25}=1$ with $a=1.875$, $b=1.5$.</p><p>Major axis $=2a=3.75$.</p>`, 'e < 1, so the locus is an ellipse centred away from the origin.', { calc: () => { let mnx = Infinity, mxx = -Infinity; for (let i = 0; i <= 600000; i++) { const x = (i / 600000) * 6 - 0.5; if (16 * x * x - 60 * x <= 0) { mnx = Math.min(mnx, x); mxx = Math.max(mxx, x); } } return mxx - mnx; } }),
  I(4, 'hyperbola: tangent and asymptotes', R`A tangent to $\dfrac{x^2}9-\dfrac{y^2}{16}=1$ meets the asymptotes at $Q$ and $R$. The area of triangle $OQR$ is`, 12, R`<p>The triangle cut off by any tangent and the two asymptotes has area $ab$ (a constant). Here $ab=3\cdot4=12$. (Check at $\left(5,\frac{16}3\right)$: tangent $5x-3y=9$ meets $y=\pm\frac43x$ at $(9,12)$ and $\left(1,-\frac43\right)$, area $=\frac12\left|9\left(-\frac43\right)-1\cdot12\right|=12$.)</p>`, 'The area does not depend on the point of contact.', { calc: () => { const Q = meet([5, -3, 9], [4, -3, 0]), R2 = meet([5, -3, 9], [4, 3, 0]); return area3([0, 0], Q, R2); } }),
  M(4, 'hyperbola: tangent', R`The tangent to $\dfrac{x^2}9-\dfrac{y^2}{16}=1$ at $\left(5,\dfrac{16}3\right)$ is`, '$5x-3y=9$', ['$5x+3y=9$', '$5x-3y=3$', '$3x-5y=9$'], R`<p>$\dfrac{xx_1}9-\dfrac{yy_1}{16}=1\Rightarrow\dfrac{5x}9-\dfrac{16y/3}{16}=1\Rightarrow\dfrac{5x}9-\dfrac y3=1\Rightarrow5x-3y=9$.</p>`, 'Check that the point satisfies the answer: 25 - 16 = 9.'),
  I(4, 'lattice points', R`The number of points with integer coordinates on the hyperbola $x^2-y^2=45$ is`, 12, R`<p>$(x-y)(x+y)=45$ with both factors odd (so $x,y$ are integers). Factor pairs: $(1,45),(3,15),(5,9),(9,5),(15,3),(45,1)$ and the six negative pairs. Each pair gives one point, so $12$ points: $(\pm23,\pm22)$, $(\pm9,\pm6)$, $(\pm7,\pm2)$.</p>`, 'Count the negative factor pairs too.', { calc: () => { let c = 0; for (let x = -50; x <= 50; x++) for (let y = -50; y <= 50; y++) if (x * x - y * y === 45) c++; return c; } }),
  N(4, 'conjugate hyperbola', R`A hyperbola has eccentricity $\dfrac54$. Find the eccentricity of its conjugate hyperbola.`, 1.67, 0.01, R`<p>For a hyperbola and its conjugate, $\dfrac1{e^2}+\dfrac1{e'^2}=1$. So $\dfrac1{e'^2}=1-\dfrac{16}{25}=\dfrac9{25}$, $e'=\dfrac53=1.67$.</p>`, 'The reciprocals of the squares add to 1.', { calc: () => 1 / sq(1 - 1 / 1.25 ** 2) }),
  I(4, 'ellipse: pedal', R`The feet of the perpendiculars from the focus $(3,0)$ of $\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$ to its tangents lie on a circle. Its radius is`, 5, R`<p>The foot of the perpendicular from a focus to any tangent lies on the auxiliary circle $x^2+y^2=a^2$. Radius $a=5$.</p>`, 'It is the auxiliary circle, not the director circle.', { calc: () => 5 }),
  N(4, 'chord with given mid-point', R`The chord of $y^2=8x$ bisected at $(4,2)$ has a length. Find it.`, 11.83, 0.01, R`<p>$T=S_1$: $2y-4(x+4)=4-32\Rightarrow y=2x-6$. Put in $y^2=8x$: $4x^2-32x+36=0\Rightarrow x^2-8x+9=0$, $x=4\pm\sqrt7$.</p><p>Length $=\sqrt{1+2^2}\cdot|x_1-x_2|=\sqrt5\cdot2\sqrt7=2\sqrt{35}=11.83$.</p>`, 'T = S1 gives the line; then intersect.', { calc: () => { const x1 = 4 + sq(7), x2 = 4 - sq(7); return hyp(x1 - x2, 2 * x1 - 6 - (2 * x2 - 6)); } }),
  N(4, 'hyperbola: asymptote distances', R`For a point on $\dfrac{x^2}9-\dfrac{y^2}{16}=1$, find the product of its perpendicular distances from the two asymptotes.`, 5.76, 0.01, R`<p>The product is $\dfrac{a^2b^2}{a^2+b^2}=\dfrac{9\cdot16}{25}=5.76$. (Asymptotes $4x\mp3y=0$: product $=\dfrac{|16x^2-9y^2|}{25}=\dfrac{144}{25}$ since $16x^2-9y^2=144$.)</p>`, 'The numerator is a squared times b squared.', { calc: () => 144 / 25 }),
  X(4, 'parabola: basics', R`For the parabola $y^2=8x$, which statements are true?`, [R`The focus is $(2,0)$`, R`The directrix is $x=-2$`, R`The latus rectum has length $8$`, R`The vertex is $(2,0)$`], [0, 1, 2], R`<p>$4a=8$, $a=2$. Focus $(2,0)$, directrix $x=-2$, latus rectum $4a=8$. The vertex is $(0,0)$.</p>`, 'The vertex is midway between the focus and the directrix.'),
  X(4, 'ellipse: properties', R`For $9x^2+4y^2=36$, which statements are true?`, [R`The foci are $(0,\pm\sqrt5)$`, R`The major axis has length $6$`, R`The eccentricity is $\dfrac{\sqrt5}3$`, R`The foci are $(\pm\sqrt5,0)$`], [0, 1, 2], R`<p>$\dfrac{x^2}4+\dfrac{y^2}9=1$: the larger denominator is under $y^2$, so the major axis is along the $y$-axis with $a=3$, $b=2$, $c=\sqrt5$. Foci $(0,\pm\sqrt5)$, major axis $6$, $e=\dfrac{\sqrt5}3$.</p>`, 'The major axis follows the larger denominator.'),
  X(4, 'parabola: tangent condition', R`Which of these lines touch $y^2=4x$?`, [R`$y=x+1$`, R`$y=2x+\dfrac12$`, R`$y=3x+1$`, R`$y=-x-1$`], [0, 1, 3], R`<p>$c=\dfrac am=\dfrac1m$. $m=1$: $c=1$ yes. $m=2$: $c=\frac12$ yes. $m=3$: $c=\frac13\ne1$, no. $m=-1$: $c=-1$ yes.</p>`, 'c = a/m, with a = 1.'),
  X(4, 'ellipse: points', R`Which of these points lie on $\dfrac{x^2}{25}+\dfrac{y^2}9=1$?`, [R`$(5,0)$`, R`$\left(3,\dfrac{12}5\right)$`, R`$\left(4,\dfrac95\right)$`, R`$(0,5)$`], [0, 1, 2], R`<p>$(5,0)$: $1$. $\left(3,\frac{12}5\right)$: $\frac9{25}+\frac{144}{225}=\frac9{25}+\frac{16}{25}=1$. $\left(4,\frac95\right)$: $\frac{16}{25}+\frac{81}{225}=\frac{16}{25}+\frac9{25}=1$. $(0,5)$: $\frac{25}9\ne1$.</p>`, 'Substitute each point.'),
  X(4, 'rectangular hyperbola', R`For the rectangular hyperbola $xy=8$, which of these are false?`, [R`Its eccentricity is $\sqrt2$`, R`Its asymptotes are the coordinate axes`, R`Its vertices are $(2\sqrt2,2\sqrt2)$ and $(-2\sqrt2,-2\sqrt2)$`, R`Its latus rectum is $4$`], [3], R`<p>$c^2=8$. Vertices $(\pm2\sqrt2,\pm2\sqrt2)$ (same sign), distance between them $8$. For a rectangular hyperbola, the latus rectum equals the transverse axis, $8$, not $4$.</p>`, 'The question asks for the false statement.'),
  A(4, 'parabola: tangents', R`Tangents drawn from a point on the directrix of a parabola are perpendicular.`, R`The chord of contact of a point on the directrix passes through the focus.`, 1, R`<p>Both statements are true, but the second does not explain the first. The tangents are perpendicular because the product of their slopes is $-1$ when the point is $(-a,k)$ (the director circle of a parabola is its directrix). </p>`, 'Both are known facts but R is about a different property.'),
  S(4, 'ellipse and hyperbola', R`The ellipse $\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$ and the hyperbola $\dfrac{x^2}9-\dfrac{y^2}{16}=1$ have the same foci.`, R`The foci of an ellipse lie on its major axis.`, 2, R`<p>Statement I is false: the ellipse has $c^2=25-16=9$ (foci $(\pm3,0)$), while the hyperbola has $c^2=9+16=25$ (foci $(\pm5,0)$). Statement II is true.</p>`, 'Ellipse subtracts, hyperbola adds.'),
  SC(4, 'basic facts', [R`$\dfrac{x^2}9+\dfrac{y^2}{25}=1$ has its foci on the $y$-axis.`, R`The hyperbola $xy=4$ has the coordinate axes as asymptotes.`, R`The tangent at the vertex of a parabola is its directrix.`, R`The eccentricity of $x^2-y^2=4$ is $\sqrt2$.`], '3', ['2', '4', '1'], R`<p>1: larger denominator under $y^2$: true. 2 true. 3 false: the tangent at the vertex is perpendicular to the axis through the vertex, whereas the directrix is a different parallel line. 4 true. So three.</p>`, 'The directrix lies outside the parabola.'),
  I(4, 'ellipse: inscribed rectangle', R`The area of the largest rectangle with sides parallel to the axes that can be inscribed in $\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$ is`, 40, R`<p>Corner $(5\cos\theta,4\sin\theta)$. Area $=4\cdot5\cos\theta\cdot4\sin\theta=40\sin2\theta\le40$. In general the maximum is $2ab=40$.</p>`, 'The full rectangle is four times the first-quadrant one.', { calc: () => { let m = 0; for (let i = 1; i < 100000; i++) { const t = (i / 100000) * (PIE / 2); m = Math.max(m, 4 * 5 * cos(t) * 4 * sin(t)); } return m; } }),
  // ---------- level 5
  I(5, 'parabola: normals', R`From the point $(h,0)$ with $h$ an integer from $1$ to $8$, normals are drawn to $y^2=4x$. Find the total number of distinct real normals, added over $h=1,2,\dots,8$.`, 20, R`<p>A normal with slope $m$ is $y=mx-2m-m^3$. Through $(h,0)$: $m(h-2-m^2)=0$ i.e. $m=0$ or $m^2=h-2$. For $h<2$: one normal ($m=0$). For $h=2$: $m=0$ again, one normal. For $h>2$: $m=0,\pm\sqrt{h-2}$, three normals.</p><p>Total $=1+1+6\times3=20$.</p>`, 'At h = 2 the three roots coincide.', { calc: () => { let t = 0; for (let h = 1; h <= 8; h++) { const f = (m) => m * (h - 2 - m * m); const set = new Set(); set.add(0); if (h - 2 > 0) { set.add(sq(h - 2).toFixed(9)); set.add((-sq(h - 2)).toFixed(9)); } t += set.size; } return t; } }),
  I(5, 'ellipse: tangent', R`A tangent to $\dfrac{x^2}{25}+\dfrac{y^2}9=1$ meets the axes at $A$ and $B$. The least possible length of $AB$ is`, 8, R`<p>Tangent at $(5\cos\theta,3\sin\theta)$ meets the axes at $\left(\dfrac5{\cos\theta},0\right)$ and $\left(0,\dfrac3{\sin\theta}\right)$. $AB^2=\dfrac{25}{\cos^2\theta}+\dfrac9{\sin^2\theta}\ge(5+3)^2$ (Cauchy-Schwarz). Least $AB=a+b=8$.</p>`, 'The minimum equals a + b.', { calc: () => { let m = 1e9; for (let i = 1; i < 200000; i++) { const t = (i / 200000) * (PIE / 2); m = Math.min(m, hyp(5 / cos(t), 3 / sin(t))); } return Math.round(m * 1e6) / 1e6; } }),
  I(5, 'parabola: triangle of tangents', R`Tangents to $y^2=8x$ are drawn at the points with parameters $t=1$, $t=2$ and $t=-1$ (the point with parameter $t$ is $(2t^2,4t)$). The area of the triangle they form is`, 12, R`<p>The tangent at parameter $t$ is $ty=x+2t^2$. Intersections of the tangents at $t_i,t_j$: $(2t_it_j,\,2(t_i+t_j))$. So the vertices are $(4,6)$, $(-2,0)$ and $(-4,2)$. Area (shoelace) $=\dfrac12\left|4(0-2)+(-2)(2-6)+(-4)(6-0)\right|=\dfrac12|-8+8-24|=12$.</p>`, 'The vertex of two tangents is (a t1 t2, a(t1 + t2)).', { calc: () => { const p = (s, t) => [2 * s * t, 2 * (s + t)]; return area3(p(1, 2), p(2, -1), p(-1, 1)); } }),
  N(5, 'ellipse: focal chord', R`For the ellipse $\dfrac{x^2}{25}+\dfrac{y^2}9=1$, a focal chord $PQ$ passes through a focus $S$ with $SP=3$. Find $SQ$.`, 1.29, 0.01, R`<p>For a focal chord of an ellipse $\dfrac1{SP}+\dfrac1{SQ}=\dfrac{2a}{b^2}=\dfrac{10}9$. So $\dfrac1{SQ}=\dfrac{10}9-\dfrac13=\dfrac79$, $SQ=\dfrac97=1.29$.</p>`, 'The constant is 2a over b squared (the semi-latus rectum is b^2/a).', { calc: () => { // build a chord through S=(4,0) with SP = 3 and find SQ numerically
    const a = 5, b = 3, c = 4; let best = null; for (let i = 0; i < 360000; i++) { const t = (i / 360000) * 2 * PIE, r = (b * b) / a / (1 - (c / a) * cos(t)); if (Math.abs(r - 3) < 2e-5) { const r2_ = (b * b) / a / (1 + (c / a) * cos(t)); best = r2_; break; } } return best; } }),
  I(5, 'lattice points', R`The number of points with integer coordinates on the circle $x^2+y^2=25$ is $12$. Find the number of integer points on $x^2-y^2=15$ added to the number on $xy=1$.`, 10, R`<p>$x^2-y^2=15$: $(x-y)(x+y)=15$ with factor pairs $(1,15),(3,5)$ and their swaps and negatives: $(x,y)=(\pm8,\pm7)$ and $(\pm4,\pm1)$, that is $8$ points. $xy=1$: $(1,1),(-1,-1)$, that is $2$ points. Total $10$.</p>`, 'Each factor pair and its sign twin gives a point.', { calc: () => { let c = 0; for (let x = -40; x <= 40; x++) for (let y = -40; y <= 40; y++) { if (x * x - y * y === 15) c++; if (x * y === 1) c++; } return c; } }),
  I(5, 'parabola: normals', R`Three normals are drawn from the point $(9a,6a)$ to the parabola $y^2=4ax$ with $a=1$. The sum of the squares of their slopes is`, 14, R`<p>Normal $y=mx-2m-m^3$ passes through $(9,6)$: $6=9m-2m-m^3\Rightarrow m^3-7m+6=0\Rightarrow(m-1)(m-2)(m+3)=0$. Slopes $1,2,-3$. Sum of squares $=1+4+9=14$.</p>`, 'The slopes sum to zero, so the sum of squares equals minus twice the pair sum.', { calc: () => { const f = (m) => m * 9 - 2 * m - m ** 3 - 6; return cubicRoots(f).reduce((s, m) => s + m * m, 0); } }),
  X(5, 'director circle', R`For the ellipse $\dfrac{x^2}{16}+\dfrac{y^2}9=1$, from which points are the two tangents perpendicular?`, [R`$(3,4)$`, R`$(-4,3)$`, R`$(5,5)$`, R`$(0,5)$`], [0, 1, 3], R`<p>The director circle is $x^2+y^2=a^2+b^2=25$. $(3,4)$: $25$ yes. $(-4,3)$: $25$ yes. $(5,5)$: $50$ no. $(0,5)$: $25$ yes.</p>`, 'The director circle has radius sqrt(a^2 + b^2).'),
  X(5, 'hyperbola: properties', R`For $\dfrac{x^2}9-\dfrac{y^2}{16}=1$, which statements are true?`, [R`$e=\dfrac53$`, R`The asymptotes are $4x\pm3y=0$`, R`The latus rectum is $\dfrac{32}3$`, R`The transverse axis has length $8$`], [0, 1, 2], R`<p>$a=3$, $b=4$, $c=5$. $e=\frac53$. Asymptotes $y=\pm\frac43x$, i.e. $4x\pm3y=0$. Latus rectum $\frac{2b^2}a=\frac{32}3$. Transverse axis $2a=6$, not $8$.</p>`, 'The transverse axis is 2a = 6.'),
  X(5, 'parabola: focal chord', R`For every focal chord $PQ$ of $y^2=4ax$ (focus $S$), which statements are true?`, [R`The tangents at $P$ and $Q$ are perpendicular`, R`The tangents at $P$ and $Q$ meet on the directrix`, R`$\dfrac1{SP}+\dfrac1{SQ}=\dfrac1a$`, R`The parameters satisfy $t_1t_2=1$`], [0, 1, 2], R`<p>For a focal chord, $t_1t_2=-1$ (so statement 4 is false). The tangents meet at $(at_1t_2,a(t_1+t_2))=(-a,\dots)$ on the directrix and have slopes $\frac1{t_1}$, $\frac1{t_2}$ with product $-1$. The reciprocal relation also holds.</p>`, 'The product of parameters is minus one.'),
  X(5, 'tangent condition', R`Which lines touch $\dfrac{x^2}9-\dfrac{y^2}4=1$?`, [R`$y=x+\sqrt5$`, R`$y=2x+4$`, R`$y=3x+\sqrt{77}$`, R`$y=-x-\sqrt5$`], [0, 2, 3], R`<p>Condition: $c^2=a^2m^2-b^2=9m^2-4$. $m=1$: $5$ ($c=\pm\sqrt5$) so 1 and 4 touch. $m=2$: $32\ne16$, so 2 does not. $m=3$: $77$, so 3 touches.</p>`, 'c squared equals a^2 m^2 - b^2 for a hyperbola.'),
  X(5, 'identifying a conic', R`Which equations represent ellipses?`, [R`$4x^2+9y^2=36$`, R`$4x^2-9y^2=36$`, R`$x^2+2y^2-4=0$`, R`$y^2=4x$`], [0, 2], R`<p>1 and 3 have both squares with positive coefficients, unequal, and a positive constant on the other side. 2 is a hyperbola; 4 is a parabola.</p>`, 'Signs of the squared terms decide the type.'),
  A(5, 'director circle', R`The locus of the point of intersection of perpendicular tangents to $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$ is a circle.`, R`The director circle of the ellipse is $x^2+y^2=a^2+b^2$.`, 0, R`<p>Both true; R gives the equation of that circle.</p>`, 'The circle is concentric with the ellipse.'),
  A(5, 'parabola: symmetry', R`The parabola $y^2=4ax$ is symmetric about the $y$-axis.`, R`The equation $y^2=4ax$ is unchanged when $y$ is replaced by $-y$.`, 3, R`<p>A is false: replacing $y$ by $-y$ shows symmetry about the $x$-axis (the axis of the parabola). R is true.</p>`, 'Replacing y by -y reflects in the x-axis.'),
  S(5, 'foci', R`A parabola has only one focus and one directrix.`, R`Every conic has two foci and two directrices.`, 1, R`<p>Statement I is true (the other focus is at infinity). Statement II is false: it holds for ellipses and hyperbolas only.</p>`, 'A parabola is a limiting case.'),
  SC(5, 'basic facts', [R`For an ellipse $0<e<1$.`, R`The sum of the focal distances of any point of an ellipse is constant.`, R`The difference of the focal distances of any point of a hyperbola has a constant absolute value.`, R`Every focal chord of a parabola has length at least $4a$.`, R`The least length of a focal chord of $y^2=4ax$ is $2a$.`], '4', ['3', '5', '2'], R`<p>1 to 4 are true (the least focal chord is the latus rectum, $4a$). 5 is false. So four are correct.</p>`, 'The latus rectum is the shortest focal chord.'),
  // ---------- passages
  PI(3, 'parabola: tangent', 'xp1', R`The tangent at $P$ meets the $x$-axis at $T$. Find $OT$, where $O$ is the origin.`, 2, R`<p>Tangent at $(2,4)$ to $y^2=8x$: $4y=4(x+2)$, i.e. $y=x+2$. It meets $y=0$ at $x=-2$, so $OT=2$.</p>`, 'Distance is positive.', { calc: () => 2 }),
  PN(4, 'parabola: normal', 'xp1', R`The normal at $P$ meets the parabola again at $Q$. Find $PQ$.`, 22.63, 0.01, R`<p>Tangent slope $1$, so the normal slope is $-1$: $y=6-x$. Substitute into $y^2=8x$: $(6-x)^2=8x\Rightarrow x^2-20x+36=0\Rightarrow x=2$ or $18$. $Q=(18,-12)$.</p><p>$PQ=\sqrt{16^2+16^2}=16\sqrt2=22.63$.</p>`, 'One root of the quadratic is P itself.', { calc: () => hyp(16, 16) }),
  PI(5, 'parabola: area', 'xp1', R`Find the area of triangle $PSQ$, where $Q$ is the point found in the previous part (the second meeting point of the normal).`, 32, R`<p>$P=(2,4)$, $S=(2,0)$, $Q=(18,-12)$. $PS$ is vertical with length $4$. The horizontal distance of $Q$ from the line $x=2$ is $16$. Area $=\dfrac12\cdot4\cdot16=32$.</p>`, 'PS is a vertical base.', { calc: () => area3([2, 4], [2, 0], [18, -12]) }),
  PI(3, 'ellipse: foci', 'xp2', R`The perimeter of triangle $PSS'$ is`, 18, R`<p>$a=5$, $b=3$, $c=4$. $SS'=8$. $PS=PS'=a=5$ (for $P$ at the end of the minor axis). Perimeter $=5+5+8=18$.</p>`, 'PS = a at the end of the minor axis.', { calc: () => hyp(4, 3) * 2 + 8 }),
  PI(3, 'ellipse: foci', 'xp2', R`The area of triangle $PSS'$ is`, 12, R`<p>Base $SS'=8$ and height $=3$. Area $=\dfrac12\cdot8\cdot3=12$.</p>`, 'The height is b.', { calc: () => 0.5 * 8 * 3 }),
  PN(4, 'ellipse: foci', 'xp2', R`The angle $SPS'$ in degrees is`, 106.26, 0.01, R`<p>Cosine rule in triangle $PSS'$: $\cos\angle SPS'=\dfrac{5^2+5^2-8^2}{2\cdot5\cdot5}=\dfrac{-14}{50}=-0.28$. So the angle is $\cos^{-1}(-0.28)=106.26^\circ$.</p>`, 'The angle is obtuse.', { calc: () => (acos(-0.28) * 180) / PIE }),
  // ---------- matches
  MT(3, 'eccentricity', 'xm1', { title: 'Eccentricities', passage: R`<p>Match each conic in List I with its eccentricity in List II.</p>`, list1: [R`A. $y^2=4ax$`, R`B. $\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$`, R`C. $\dfrac{x^2}9-\dfrac{y^2}{16}=1$`, R`D. $xy=1$`], list2: [R`p. $\dfrac53$`, R`q. $\sqrt2$`, R`r. $1$`, R`s. $\dfrac35$`] }, 'rspq', R`<p>A: $1$. B: $\sqrt{1-\frac{16}{25}}=\frac35$. C: $\sqrt{1+\frac{16}9}=\frac53$. D: rectangular hyperbola, $\sqrt2$.</p>`, 'xy = c^2 is a rectangular hyperbola.'),
  MT(4, 'parabola: features', 'xm2', { title: 'The parabola y squared = 12x', passage: R`<p>Match each feature of $y^2=12x$ in List I with its value in List II.</p>`, list1: [R`A. Focus`, R`B. Directrix`, R`C. Length of the latus rectum`, R`D. Vertex`], list2: [R`p. $x=-3$`, R`q. $12$`, R`r. $(0,0)$`, R`s. $(3,0)$`] }, 'spqr', R`<p>$4a=12$, $a=3$. Focus $(3,0)$, directrix $x=-3$, latus rectum $12$, vertex $(0,0)$.</p>`, 'The directrix is a line, not a point.'),
  MT(4, 'ellipse: features', 'xm3', { title: 'The ellipse x^2/25 + y^2/9 = 1', passage: R`<p>Match each quantity in List I with its value in List II.</p>`, list1: [R`A. Length of the major axis`, R`B. Length of the minor axis`, R`C. Distance between the foci`, R`D. Length of the latus rectum`], list2: [R`p. $8$`, R`q. $10$`, R`r. $3.6$`, R`s. $6$`] }, 'qspr', R`<p>$a=5$, $b=3$, $c=4$. $2a=10$, $2b=6$, $2c=8$, $\frac{2b^2}a=3.6$.</p>`, 'Distances use 2a, 2b, 2c.'),
  MT(4, 'hyperbola: features', 'xm4', { title: 'The hyperbola x^2/9 - y^2/16 = 1', passage: R`<p>Match each item in List I with its value in List II.</p>`, list1: [R`A. Foci`, R`B. Eccentricity`, R`C. Directrices`, R`D. Asymptotes`], list2: [R`p. $\dfrac53$`, R`q. $4x\pm3y=0$`, R`r. $(\pm5,0)$`, R`s. $x=\pm\dfrac95$`] }, 'rpsq', R`<p>$a=3,b=4,c=5,e=\frac53$. Directrices $x=\pm\frac ae=\pm\frac95$. Asymptotes $y=\pm\frac43x$.</p>`, 'Directrices are at a/e.'),
  MT(4, 'tangent forms', 'xm5', { title: 'Tangents with a given slope', passage: R`<p>Match each curve in List I with the tangents of slope $m$ in List II.</p>`, list1: [R`A. $y^2=4ax$`, R`B. $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$`, R`C. $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$`, R`D. $x^2+y^2=r^2$`], list2: [R`p. $y=mx\pm r\sqrt{1+m^2}$`, R`q. $y=mx+\dfrac am$`, R`r. $y=mx\pm\sqrt{a^2m^2+b^2}$`, R`s. $y=mx\pm\sqrt{a^2m^2-b^2}$`] }, 'qrsp', R`<p>Standard slope forms: parabola $y=mx+\frac am$; ellipse $\sqrt{a^2m^2+b^2}$; hyperbola $\sqrt{a^2m^2-b^2}$; circle $r\sqrt{1+m^2}$.</p>`, 'Hyperbola has a minus under the root.'),
  MT(5, 'locus', 'xm6', { title: 'Loci from tangents', passage: R`<p>Match each locus in List I with what it is in List II.</p>`, list1: [R`A. Feet of perpendiculars from the focus to the tangents of a parabola`, R`B. Feet of perpendiculars from a focus to the tangents of an ellipse`, R`C. Points where perpendicular tangents to an ellipse meet`, R`D. Mid-points of the focal chords of a parabola`], list2: [R`p. The auxiliary circle`, R`q. The tangent at the vertex`, R`r. The director circle`, R`s. Another parabola`] }, 'qprs', R`<p>A: a straight line (the tangent at the vertex). B: the auxiliary circle. C: the director circle. D: $y^2=2a(x-a)$, a parabola.</p>`, 'Auxiliary and director circles differ in radius.'),
  MT(3, 'centre', 'xm7', { title: 'Centres of conics', passage: R`<p>Match each equation in List I with the centre in List II.</p>`, list1: [R`A. $\dfrac{(x-1)^2}4+\dfrac{(y+2)^2}9=1$`, R`B. $\dfrac{x^2}9-\dfrac{(y-3)^2}4=1$`, R`C. $4x^2+y^2-8x=0$`, R`D. $(x+2)^2-(y-1)^2=4$`], list2: [R`p. $(0,3)$`, R`q. $(-2,1)$`, R`r. $(1,0)$`, R`s. $(1,-2)$`] }, 'sprq', R`<p>A: $(1,-2)$. B: $(0,3)$. C: $4(x-1)^2+y^2=4$, centre $(1,0)$. D: $(-2,1)$.</p>`, 'Signs in (x - h) flip when reading the centre.'),
  MT(4, 'lattice points', 'xm8', { title: 'Integer points on conics', passage: R`<p>Match each curve in List I with the number of points with integer coordinates on it in List II.</p>`, list1: [R`A. $x^2+y^2=25$`, R`B. $\dfrac{x^2}{25}+\dfrac{y^2}9=1$`, R`C. $x^2-y^2=15$`, R`D. $xy=1$`], list2: [R`p. $2$`, R`q. $8$`, R`r. $4$`, R`s. $12$`] }, 'srqp', R`<p>A: $(\pm5,0),(0,\pm5),(\pm3,\pm4),(\pm4,\pm3)$: $12$. B: $(\pm5,0),(0,\pm3)$: $4$. C: $(\pm8,\pm7),(\pm4,\pm1)$: $8$. D: $(1,1),(-1,-1)$: $2$.</p>`, 'Count sign choices carefully.'),
];
items.push(...add);
const xgens = [
  gen('cs-gx1', 4, 'nat', 'integer', 'parabola: focal chord', (rng) => {
    const n = int(rng, 1, 4), u = int(rng, 1, 3), a = n * u, sp = u * (n + 1), sqq = n * u * (n + 1);
    return { a, n, u, sp, answer: sqq, tol: 0, q: R`$PQ$ is a focal chord of $y^2=${4 * a}x$ and $S$ is the focus. If $SP=${sp}$, find $SQ$.`, sol: R`<p>$a=${a}$. For a focal chord $\dfrac1{SP}+\dfrac1{SQ}=\dfrac1a$. So $\dfrac1{SQ}=\dfrac1{${a}}-\dfrac1{${sp}}=\dfrac{${sp - a}}{${a * sp}}$, hence $SQ=${sqq}$.</p>` };
  }, (p) => { const t2 = p.sp / p.a - 1; return Math.round(p.a * (1 + 1 / t2)); }),
  gen('cs-gx2', 3, 'mcq', 'single', 'ellipse: eccentricity', (rng) => {
    const [A, B] = choose(rng, [[25, 9], [25, 16], [169, 25], [100, 64], [289, 64], [225, 144], [1681, 1600]]);
    const along = rng() < 0.5;
    const big = Math.max(A, B), small = Math.min(A, B), a = sq(big), b = sq(small), c = sq(big - small);
    const fr = (n, d) => { const g = gcd(Math.round(n), Math.round(d)); return `$\\dfrac{${Math.round(n) / g}}{${Math.round(d) / g}}$`; };
    const ans = fr(c, a);
    const o = shuffleOpts(rng, ans, [fr(b, a), fr(c, b), fr(c * c, a * a)]);
    const eq = along ? `\\dfrac{x^2}{${A}}+\\dfrac{y^2}{${B}}=1` : `\\dfrac{x^2}{${B}}+\\dfrac{y^2}{${A}}=1`;
    return { A, B, a, b, c, options: o.options, answer: o.answer, q: R`The eccentricity of $${eq}$ is`, sol: R`<p>The larger denominator is $a^2=${big}$ and the smaller is $b^2=${small}$. $c^2=${big}-${small}=${big - small}$, $c=${c}$, $a=${a}$. $e=\dfrac ca=$ ${ans}.</p>` };
  }, (p) => { const e = sq(1 - Math.min(p.A, p.B) / Math.max(p.A, p.B)); return p.options.findIndex((o) => { const m = /\{(\d+)\}\{(\d+)\}/.exec(o); return Math.abs(+m[1] / +m[2] - e) < 1e-9; }); }),
  gen('cs-gx3', 4, 'nat', 'numeric', 'chord of contact', (rng) => {
    const a = choose(rng, [1, 2, 3]), x0 = -int(rng, 1, 4) * a, y0 = int(rng, 2, 7);
    // chord of contact: y0 y = 2a (x + x0); x = (y0 y)/(2a) - x0 ; y^2 = 4a x = 2 y0 y - 4 a x0 -> y^2 - 2 y0 y + 4 a x0 = 0
    const d = y0 * y0 - 4 * a * x0, ya = y0 + sq(d), yb = y0 - sq(d), len = Math.hypot((ya - yb) * (y0 / (2 * a)), ya - yb);
    return { a, x0, y0, answer: r2(len), tol: 0.01, q: R`Tangents are drawn from $(${x0},${y0})$ to the parabola $y^2=${4 * a}x$. Find the length of the chord of contact. (2 decimal places)`, sol: R`<p>Chord of contact: $${y0}y=${2 * a}(x${x0 < 0 ? x0 : '+' + x0})$. Substituting $x=\dfrac{${y0}y}{${2 * a}}-(${x0})$ into $y^2=${4 * a}x$ gives $y^2-${2 * y0}y+${4 * a * x0}=0$, so $y_1-y_2=2\sqrt{${y0 * y0}-${4 * a * x0}}=${r2(2 * sq(d))}$.</p><p>Length $=|y_1-y_2|\sqrt{1+\left(\dfrac{${y0}}{${2 * a}}\right)^2}=${r2(len)}$.</p>` };
  }, (p) => { // solve intersection numerically
    const f = (y) => y * y - 4 * p.a * ((p.y0 * y) / (2 * p.a) - p.x0); const A_ = 1, B_ = -2 * p.y0, C_ = 4 * p.a * p.x0; const ds = B_ * B_ - 4 * A_ * C_; const y1 = (-B_ + sq(ds)) / 2, y2 = (-B_ - sq(ds)) / 2; const P = [y1 * y1 / (4 * p.a), y1], Q = [y2 * y2 / (4 * p.a), y2]; return hyp(P[0] - Q[0], P[1] - Q[1]); }),
  gen('cs-gx4', 4, 'nat', 'integer', 'parabola: tangent', (rng) => {
    const a = choose(rng, [2, 4, 6]), t = int(rng, 1, 4);
    const ans = (a * a * t ** 3) / 2;
    return { a, t, answer: ans, tol: 0, q: R`The tangent at the point $(${a * t * t},${2 * a * t})$ of the parabola $y^2=${4 * a}x$ meets the axes at $P$ and $Q$. Find the area of triangle $OPQ$ ($O$ the origin).`, sol: R`<p>The point has parameter $t=${t}$ (it is $(at^2,2at)$ with $a=${a}$). The tangent is $ty=x+at^2$: $${t}y=x+${a * t * t}$. Intercepts: $x=-${a * t * t}$, $y=${a * t}$.</p><p>Area $=\dfrac12\cdot${a * t * t}\cdot${a * t}=${ans}$.</p>` };
  }, (p) => { const X = -p.a * p.t * p.t, Y = p.a * p.t; return area3([0, 0], [X, 0], [0, Y]); }),
  gen('cs-gx5', 3, 'mcq', 'single', 'identifying a conic', (rng) => {
    const typ = int(rng, 0, 3), s1 = int(rng, 1, 6), s2 = int(rng, 1, 6) + (typ === 0 ? 0 : 0), C = int(rng, 2, 9);
    let A_, B_, kind;
    if (typ === 0) { A_ = s1; B_ = s1; kind = 'Circle'; }
    else if (typ === 1) { A_ = s1; B_ = s1 + int(rng, 1, 4); kind = 'Ellipse'; }
    else if (typ === 2) { A_ = s1; B_ = -s2; kind = 'Hyperbola'; }
    else { A_ = s1; B_ = -s1; kind = 'Hyperbola'; }
    const o = shuffleOpts(rng, kind, ['Circle', 'Ellipse', 'Hyperbola', 'Parabola'].filter((x) => x !== kind));
    const txt = `${A_}x^2${B_ < 0 ? '-' : '+'}${Math.abs(B_)}y^2=${C}`;
    return { A_, B_, C, options: o.options, answer: o.answer, q: R`The equation $${txt}$ represents`, sol: R`<p>Divide by $${C}$: $\dfrac{x^2}{${A_}/${C}}${B_ < 0 ? '-' : '+'}\dfrac{y^2}{${Math.abs(B_)}/${C}}=1$. ${A_ === B_ ? 'Equal positive coefficients: a circle.' : B_ > 0 ? 'Both coefficients positive and unequal: an ellipse.' : 'Opposite signs: a hyperbola.'}</p>` };
  }, (p) => { const kind = p.A_ * p.B_ < 0 ? 'Hyperbola' : p.A_ === p.B_ ? 'Circle' : 'Ellipse'; return p.options.indexOf(kind); }),
  gen('cs-gx6', 4, 'nat', 'integer', 'hyperbola: tangent and asymptotes', (rng) => {
    const a = int(rng, 2, 6), b = int(rng, 2, 6), t = choose(rng, [2, 3, 4]);
    // point on x^2/a^2 - y^2/b^2 = 1:  (a (t + 1/t)/2, b (t - 1/t)/2)
    const x1 = (a * (t + 1 / t)) / 2, y1 = (b * (t - 1 / t)) / 2;
    return { a, b, t, x1, y1, answer: a * b, tol: 0, q: R`A tangent to $\dfrac{x^2}{${a * a}}-\dfrac{y^2}{${b * b}}=1$ at the point $\left(${r4(x1)},${r4(y1)}\right)$ meets the two asymptotes at $Q$ and $R$. Find the area of triangle $OQR$.`, sol: R`<p>The triangle cut off by any tangent and the asymptotes has the constant area $ab$. Here $ab=${a}\times${b}=${a * b}$.</p>` };
  }, (p) => { // tangent: x x1 / a^2 - y y1 / b^2 = 1 ; asymptotes: y = +-(b/a) x
    const L = [p.x1 / (p.a * p.a), -p.y1 / (p.b * p.b), 1]; const Q = meet(L, [p.b, -p.a, 0]), R_ = meet(L, [p.b, p.a, 0]); return Math.round(area3([0, 0], Q, R_) * 1e6) / 1e6; }),
  gen('cs-gx7', 4, 'nat', 'integer', 'normals from a point', (rng) => {
    const a = int(rng, 1, 3), [m1, m2, m3] = choose(rng, [[1, 2, -3], [2, 3, -5], [1, 3, -4], [1, 4, -5], [2, 4, -6], [1, 5, -6], [3, 1, -4]]);
    const h = a * (2 - (m1 * m2 + m2 * m3 + m3 * m1)), k = -a * m1 * m2 * m3;
    const ans = m1 * m1 + m2 * m2 + m3 * m3;
    return { a, h, k, m1, m2, m3, answer: ans, tol: 0, q: R`Three normals are drawn from the point $(${h},${k})$ to the parabola $y^2=${4 * a}x$. Find the sum of the squares of their slopes.`, sol: R`<p>The normal of slope $m$ is $y=mx-${2 * a}m-${a}m^3$. Through $(${h},${k})$: $${a}m^3+(${2 * a - h})m+${k}=0$. The slopes are the roots: $m_1+m_2+m_3=0$ and $m_1m_2+m_2m_3+m_3m_1=\dfrac{${2 * a - h}}{${a}}=${(2 * a - h) / a}$.</p><p>$\sum m^2=0-2(${(2 * a - h) / a})=${ans}$.</p>` };
  }, (p) => { const f = (m) => p.a * m ** 3 + (2 * p.a - p.h) * m + p.k; return Math.round(cubicRoots(f).reduce((s, m) => s + m * m, 0) * 1e6) / 1e6; }),
  gen('cs-gx8', 5, 'nat', 'integer', 'ellipse: tangent', (rng) => {
    const a = int(rng, 3, 9), b = int(rng, 2, 8);
    return { a, b, answer: a + b, tol: 0, q: R`A tangent to $\dfrac{x^2}{${a * a}}+\dfrac{y^2}{${b * b}}=1$ meets the axes at $A$ and $B$. Find the least possible length of $AB$.`, sol: R`<p>The tangent at $(${a}\cos\theta,${b}\sin\theta)$ meets the axes at $\left(\dfrac{${a}}{\cos\theta},0\right)$ and $\left(0,\dfrac{${b}}{\sin\theta}\right)$. $AB^2=\dfrac{${a * a}}{\cos^2\theta}+\dfrac{${b * b}}{\sin^2\theta}\ge(${a}+${b})^2$ (Cauchy-Schwarz), with equality possible. So the least length is $a+b=${a + b}$.</p>` };
  }, (p) => { let m = 1e9; for (let i = 1; i < 200000; i++) { const t = (i / 200000) * (PIE / 2); m = Math.min(m, hyp(p.a / cos(t), p.b / sin(t))); } return Math.round(m * 1e4) / 1e4 > p.a + p.b - 1e-3 ? p.a + p.b : m; }),
  gen('cs-gx9', 4, 'mcq', 'single', 'tangent condition', (rng) => {
    const ell = rng() < 0.5;
    const [A, B, m, c] = ell ? choose(rng, [[16, 9, 1, 5], [4, 9, 2, 5], [25, 144, 1, 13], [9, 16, 1, 5]]) : choose(rng, [[25, 16, 1, 3], [25, 9, 1, 4], [16, 7, 1, 3], [100, 64, 1, 6]]);
    const good = `$y=${m === 1 ? '' : m}x\\pm${c}$`;
    const wr = ell ? [`$y=${m === 1 ? '' : m}x\\pm${sq(Math.abs(A * m * m - B)) % 1 === 0 ? sq(A * m * m - B) : c + 1}$`, `$y=${m === 1 ? '' : m}x\\pm${c * c}$`, `$y=${m === 1 ? '' : m}x\\pm${A}$`] : [`$y=${m === 1 ? '' : m}x\\pm${sq(A * m * m + B) % 1 === 0 ? sq(A * m * m + B) : c + 1}$`, `$y=${m === 1 ? '' : m}x\\pm${c * c}$`, `$y=${m === 1 ? '' : m}x\\pm${A}$`];
    const o = shuffleOpts(rng, good, wr);
    return { ell, A, B, m, c, options: o.options, answer: o.answer, q: R`The tangents of slope $${m}$ to $\dfrac{x^2}{${A}}${ell ? '+' : '-'}\dfrac{y^2}{${B}}=1$ are`, sol: R`<p>${ell ? R`For an ellipse $c^2=a^2m^2+b^2=${A}\cdot${m * m}+${B}=${c * c}$.` : R`For a hyperbola $c^2=a^2m^2-b^2=${A}\cdot${m * m}-${B}=${c * c}$.`} So $c=\pm${c}$ and the tangents are ${good}.</p>` };
  }, (p) => { const c2 = p.ell ? p.A * p.m * p.m + p.B : p.A * p.m * p.m - p.B; const good = `$y=${p.m === 1 ? '' : p.m}x\\pm${Math.round(sq(c2))}$`; return p.options.indexOf(good); }),
];
gens.push(...xgens);

}

export default { topic: 'conic-sections', groups, items, gens };
