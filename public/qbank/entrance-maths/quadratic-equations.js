// Quadratic equations and inequalities (Plus Two entrance, Mathematics). Original fibub questions.
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const R = String.raw;
const EXS = {
  1: ['keam', 'cusat', 'comedk', 'jee-main'],
  2: ['keam', 'cusat', 'comedk', 'jee-main'],
  3: ['jee-main', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv'],
  5: ['jee-adv'],
};
const POS = [2, 0, 3, 1, 1, 3, 0, 2];
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
    title: 'Nature of roots',
    passage: R`<p>Match each equation in List I with the nature of its roots in List II.</p>`,
    list1: ['A. $x^2-6x+9=0$', 'B. $x^2-6x+10=0$', 'C. $x^2-6x+5=0$', 'D. $x^2-6x+2=0$'],
    list2: ['p. real, equal', 'q. non-real, conjugate', 'r. real, distinct, rational', 's. real, distinct, irrational'],
  },
  m2: {
    title: 'Functions of the roots',
    passage: R`<p>Let $\alpha,\beta$ be the roots of $x^2-5x+6=0$ (find the values from the coefficients, as you would for a harder equation). Match List I with List II.</p>`,
    list1: ['A. $\\alpha+\\beta$', 'B. $\\alpha\\beta$', 'C. $\\alpha^2+\\beta^2$', 'D. $\\alpha^3+\\beta^3$'],
    list2: ['p. 5', 'q. 6', 'r. 13', 's. 35'],
  },
  m3: {
    title: 'Fixing the constant',
    passage: R`<p>Consider $x^2-4x+k=0$. Match the condition in List I with the value of $k$ in List II.</p>`,
    list1: ['A. the roots are equal', 'B. the roots differ by 2', 'C. one root is 5', 'D. the roots are reciprocals of each other'],
    list2: ['p. $1$', 'q. $3$', 'r. $4$', 's. $-5$'],
  },
  m4: {
    title: 'Solution sets',
    passage: R`<p>Match each inequality in List I with its solution set in List II.</p>`,
    list1: ['A. $x^2-3x+2<0$', 'B. $x^2-3x+2\\ge0$', 'C. $(x-1)(x-2)\\le0$', 'D. $\\dfrac{x-1}{x-2}>0$'],
    list2: ['p. $(1,2)$', 'q. $(-\\infty,1)\\cup(2,\\infty)$', 'r. $[1,2]$', 's. $(-\\infty,1]\\cup[2,\\infty)$'],
  },
  p1: {
    title: 'Passage: a family of quadratics',
    passage: R`<p>Let $f(x)=x^2-2kx+k+2$, where $k$ is a real number. The roots are real exactly when the discriminant is non-negative. To locate the roots relative to a number $c$ you can use three facts: the sign of $f(c)$, the position $k$ of the vertex, and the discriminant.</p>`,
  },
  p2: {
    title: 'Passage: reading a parabola',
    passage: R`<p>A parabola $y=f(x)$, where $f$ is a quadratic polynomial, has its vertex at $(2,-3)$ and passes through $(0,1)$.</p>`,
  },
};

const items = [
  // ---------- L1 warm-up ----------
  M('qe-001', 1, 'roots', R`The roots of $x^2-7x+12=0$ are`, '3 and 4', ['-3 and -4', '2 and 6', '1 and 12'],
    R`<p>Factorise: $x^2-7x+12=(x-3)(x-4)$. So $x=3$ or $x=4$. Check: sum $7$, product $12$.</p>`,
    'The signs of both roots follow the sign of the middle term when the constant is positive.'),
  M('qe-002', 1, 'discriminant', R`The discriminant of $2x^2-3x+5=0$ is`, '-31', ['49', '31', '-19'],
    R`<p>$D=b^2-4ac=(-3)^2-4(2)(5)=9-40=-31$.</p>`,
    '49 comes from reading the constant as -5.'),
  M('qe-003', 1, 'sum and product', R`For $3x^2-12x+8=0$, the sum and product of the roots are`, R`$4$ and $\tfrac83$`, [R`$-4$ and $\tfrac83$`, R`$12$ and $8$`, R`$4$ and $-\tfrac83$`],
    R`<p>Sum $=-\dfrac ba=\dfrac{12}3=4$. Product $=\dfrac ca=\dfrac83$.</p>`,
    'Divide by the leading coefficient 3, and keep the minus sign in -b/a.'),
  M('qe-004', 1, 'discriminant', R`For what value(s) of $k$ does $x^2+kx+9=0$ have equal roots?`, R`$k=\pm6$`, [R`$k=6$ only`, R`$k=\pm3$`, R`$k=\pm9$`],
    R`<p>Equal roots need $D=0$: $k^2-36=0\Rightarrow k=\pm6$. (Roots $\mp3$ repeated.)</p>`,
    'Both signs work: x² + 6x + 9 = (x+3)² and x² - 6x + 9 = (x-3)².'),
  M('qe-005', 1, 'roots', R`If $x=2$ is a root of $x^2+kx-10=0$, then $k$ equals`, '3', ['-3', '2', '6'],
    R`<p>Substitute $x=2$: $4+2k-10=0\Rightarrow k=3$. (Other root: $-5$, since the product is $-10$.)</p>`,
    'Substitute the root; do not use the sum-of-roots formula before you know the other root.'),
  M('qe-006', 1, 'completing the square', R`For what value of $k$ is $x^2-6x+k$ a perfect square?`, '9', ['6', '36', '3'],
    R`<p>$x^2-6x+k=(x-3)^2$ when $k=3^2=9$. Equivalent to $D=36-4k=0$.</p>`,
    'The constant is (half the middle coefficient) squared.'),
  M('qe-007', 1, 'quadratic formula', R`The roots of $x^2-4x+1=0$ are`, R`$2\pm\sqrt3$`, [R`$4\pm\sqrt3$`, R`$2\pm\sqrt5$`, R`$1\pm\sqrt3$`],
    R`<p>$x=\dfrac{4\pm\sqrt{16-4}}2=\dfrac{4\pm2\sqrt3}2=2\pm\sqrt3$.</p>`,
    'Divide the whole numerator by 2, not just the root part.'),
  M('qe-008', 1, 'nature of roots', R`The roots of $2x^2-4x+3=0$ are`, 'non-real complex numbers (conjugates)', ['real and distinct', 'real and equal', 'rational'],
    R`<p>$D=16-24=-8<0$, so the roots are non-real and conjugate: $1\pm\dfrac{i}{\sqrt2}$.</p>`,
    'Negative discriminant means no real roots, not no roots.'),
  I('qe-009', 1, 'reducible equations', R`How many real roots does $x^4-5x^2+4=0$ have?`, 4,
    R`<p>Put $t=x^2$: $t^2-5t+4=0\Rightarrow t=1,4$. So $x=\pm1,\pm2$: four real roots.</p>`,
    'Each positive value of t gives two values of x.'),
  M('qe-010', 1, 'maximum and minimum', R`The maximum value of $-x^2+6x+1$ is`, '10', ['1', '9', '6'],
    R`<p>$-x^2+6x+1=-(x-3)^2+10\le10$, with equality at $x=3$.</p>`,
    '1 is the value at x = 0, not the maximum.'),
  M('qe-011', 1, 'forming equations', R`The quadratic equation with roots $2$ and $-5$ is`, R`$x^2+3x-10=0$`, [R`$x^2-3x-10=0$`, R`$x^2+3x+10=0$`, R`$x^2-3x+10=0$`],
    R`<p>Sum $=2+(-5)=-3$, product $=-10$. Equation: $x^2-(\text{sum})x+\text{product}=0$, i.e. $x^2+3x-10=0$.</p>`,
    'The middle term is minus the sum, so a negative sum gives +3x.'),
  M('qe-012', 1, 'sum and product', R`If $\alpha,\beta$ are the roots of $x^2-5x+6=0$, then $\alpha+\beta+\alpha\beta$ equals`, '11', ['1', '5', '30'],
    R`<p>$\alpha+\beta=5$ and $\alpha\beta=6$. Sum $=11$.</p>`,
    'Add the two Vieta values; do not multiply them.'),
  M('qe-013', 1, 'sign of expression', R`The expression $x^2-2x+3$ is`, 'positive for every real $x$', ['negative for every real $x$', 'zero at exactly one point', 'positive only for $x>1$'],
    R`<p>$x^2-2x+3=(x-1)^2+2\ge2>0$. Also $D=4-12<0$ with positive leading coefficient.</p>`,
    'No real zero means the sign never changes.'),
  M('qe-014', 1, 'inequalities', R`The solution of $x^2-9<0$ is`, R`$(-3,3)$`, [R`$(-\infty,-3)\cup(3,\infty)$`, R`$(-\infty,3)$`, R`$\{-3,3\}$`],
    R`<p>$(x-3)(x+3)<0$: the product is negative between the roots, so $-3<x<3$.</p>`,
    'The "less than 0" side of an upward parabola is the part between the roots.'),

  // ---------- L2 standard ----------
  I('qe-015', 1, 'symmetric functions', R`If $\alpha,\beta$ are the roots of $x^2-6x+4=0$, find $\alpha^2+\beta^2$.`, 28,
    R`<p>$\alpha^2+\beta^2=(\alpha+\beta)^2-2\alpha\beta=36-8=28$.</p>`,
    'Forgetting the 2 in 2αβ gives 32.'),
  I('qe-016', 2, 'symmetric functions', R`If $\alpha,\beta$ are the roots of $x^2-5x+3=0$, find $\alpha^3+\beta^3$.`, 80,
    R`<p>$\alpha^3+\beta^3=(\alpha+\beta)^3-3\alpha\beta(\alpha+\beta)=125-3(3)(5)=80$.</p>`,
    'The cube formula is s³ − 3ps, not s³ − 3p.'),
  N('qe-017', 2, 'symmetric functions', R`If $\alpha,\beta$ are the roots of $2x^2-7x+3=0$, find $|\alpha-\beta|$.`, 2.5, 0.01,
    R`<p>$(\alpha-\beta)^2=(\alpha+\beta)^2-4\alpha\beta=\dfrac{49}4-6=\dfrac{25}4$, so $|\alpha-\beta|=2.5$.</p><p>Check: roots are $3$ and $\tfrac12$.</p>`,
    'Use the fractions 7/2 and 3/2, not 7 and 3.'),
  I('qe-018', 2, 'symmetric functions', R`If $\alpha,\beta$ are the roots of $x^2-4x+2=0$, find $\dfrac\alpha\beta+\dfrac\beta\alpha$.`, 6,
    R`<p>$\dfrac{\alpha^2+\beta^2}{\alpha\beta}=\dfrac{16-4}{2}=6$.</p>`,
    'Combine into one fraction first.'),
  M('qe-019', 2, 'transformed roots', R`If $\alpha,\beta$ are the roots of $x^2-3x+1=0$, the equation whose roots are $\alpha+2$ and $\beta+2$ is`, R`$x^2-7x+11=0$`, [R`$x^2-7x+9=0$`, R`$x^2+x-1=0$`, R`$x^2-5x+3=0$`],
    R`<p>New sum $=3+4=7$. New product $=(\alpha+2)(\beta+2)=\alpha\beta+2(\alpha+\beta)+4=1+6+4=11$.</p><p>Equation: $x^2-7x+11=0$. (Shortcut: replace $x$ by $x-2$ in the original.)</p>`,
    'Roots that are 2 more mean the substitution is x - 2, not x + 2.'),
  I('qe-020', 2, 'roots in a ratio', R`The roots of $x^2-10x+k=0$ are in the ratio $2:3$. Find $k$.`, 24,
    R`<p>Let the roots be $2t$ and $3t$. Sum: $5t=10\Rightarrow t=2$. Roots $4$ and $6$. Product $k=24$.</p>`,
    'Use the sum first to find t.'),
  N('qe-021', 2, 'roots', R`One root of $x^2+px+12=0$ is $4$. If $x^2+px+q=0$ has equal roots, find $q$.`, 12.25, 0.01,
    R`<p>$16+4p+12=0\Rightarrow p=-7$. Now $x^2-7x+q=0$ has equal roots if $49-4q=0$, so $q=\dfrac{49}4=12.25$.</p>`,
    'Find p from the first equation before using the second.'),
  M('qe-022', 2, 'nature of roots', R`The values of $k$ for which $x^2+kx+k+3=0$ has real roots are`, R`$k\le-2$ or $k\ge6$`, [R`$-2\le k\le6$`, R`$k<-2$ or $k>6$`, R`$k\le-6$ or $k\ge2$`],
    R`<p>$D=k^2-4(k+3)=k^2-4k-12=(k-6)(k+2)\ge0$, true outside the roots (including them).</p><p>$k\le-2$ or $k\ge6$.</p>`,
    '"Real" includes equal roots, so the equality is included.'),
  I('qe-023', 2, 'sum and product', R`The sum of the roots of $x^2-2mx+m+4=0$ equals their product. Find $m$.`, 4,
    R`<p>Sum $=2m$, product $=m+4$. $2m=m+4\Rightarrow m=4$. Check: $x^2-8x+8$ has $D=64-32>0$, real roots.</p>`,
    'Check that the value of m still gives real roots if the question says "roots".'),
  M('qe-024', 2, 'conjugate roots', R`A quadratic with rational coefficients has one root $2+\sqrt3$. The quadratic is`, R`$x^2-4x+1=0$`, [R`$x^2+4x+1=0$`, R`$x^2-4x-1=0$`, R`$x^2-2x+1=0$`],
    R`<p>The other root is the conjugate $2-\sqrt3$. Sum $=4$, product $=4-3=1$.</p>`,
    'Product of conjugate surds: (2+√3)(2−√3) = 4 − 3.'),
  I('qe-025', 2, 'sum and product', R`If $\alpha,\beta$ are the roots of $x^2-x-3=0$, find $\alpha^3+\beta^3$.`, 10,
    R`<p>$\alpha+\beta=1$, $\alpha\beta=-3$. $\alpha^3+\beta^3=1^3-3(-3)(1)=1+9=10$.</p>`,
    'A negative product changes the sign of the correction term.'),
  M('qe-026', 1, 'inequalities', R`The solution set of $(x-1)(x-2)(x-3)>0$ is`, R`$(1,2)\cup(3,\infty)$`, [R`$(-\infty,1)\cup(2,3)$`, R`$(1,3)$`, R`$(3,\infty)$`],
    R`<p>Sign scheme: for $x>3$ all factors are positive: $+$. Passing 3 flips: $(2,3)$ is $-$. Passing 2 flips: $(1,2)$ is $+$. Passing 1: $(-\infty,1)$ is $-$.</p><p>Positive on $(1,2)$ and $(3,\infty)$.</p>`,
    'Start from the right where every factor is positive, then flip at each simple root.'),
  I('qe-027', 1, 'inequalities', R`How many integers $x$ satisfy $x^2-4x-5\le0$?`, 7,
    R`<p>$(x-5)(x+1)\le0\Rightarrow-1\le x\le5$. Integers $-1,0,1,2,3,4,5$: 7.</p>`,
    'The "≤" includes both end points.'),
  I('qe-028', 2, 'modulus equations', R`How many real roots does $x^2-3|x|+2=0$ have?`, 4,
    R`<p>With $|x|=t$: $t^2-3t+2=0\Rightarrow t=1,2$. Each gives two values of $x$: $\pm1,\pm2$.</p>`,
    'Because x² = |x|², the equation is a quadratic in |x|.'),
  M('qe-029', 2, 'irrational equations', R`The roots of $\sqrt{x+6}=x$ are`, R`$x=3$ only`, [R`$x=3$ and $x=-2$`, R`$x=-2$ only`, R`no real root`],
    R`<p>Squaring: $x+6=x^2\Rightarrow(x-3)(x+2)=0$. Check each in the original: $x=3$: $\sqrt9=3$ ✓. $x=-2$: $\sqrt4=2\ne-2$ ✗.</p><p>Only $x=3$.</p>`,
    'Squaring can add extraneous roots; always test back.'),
  I('qe-030', 2, 'exponential equations', R`Find the product of the real roots of $4^x-6\cdot2^x+8=0$.`, 2,
    R`<p>Let $t=2^x$: $t^2-6t+8=0\Rightarrow t=2,4$. So $x=1$ and $x=2$. Product $=2$.</p>`,
    'The roots of the equation are the values of x, not the values of t.', { sub: 'mixed' }),
  I('qe-031', 2, 'log equations', R`Solve $\log_2x+\log_2(x-2)=3$.`, 4,
    R`<p>$\log_2[x(x-2)]=3\Rightarrow x(x-2)=8\Rightarrow x^2-2x-8=0\Rightarrow x=4$ or $-2$.</p><p>Domain needs $x>2$, so $x=4$.</p>`,
    'The log domain removes x = -2.', { sub: 'mixed' }),
  I('qe-032', 2, 'discriminant', R`For how many integers $k$ with $-10\le k\le10$ does $x^2-kx+4=0$ have two distinct real roots?`, 12,
    R`<p>$D=k^2-16>0\Rightarrow|k|>4$. So $k=5,\dots,10$ (6 values) and $k=-5,\dots,-10$ (6 values).</p><p>Total 12. ($k=\pm4$ give equal roots, excluded.)</p>`,
    'Distinct means D strictly positive.'),
  N('qe-033', 2, 'symmetric functions', R`If $\alpha,\beta$ are the roots of $2x^2-6x+3=0$, find $\alpha\beta(\alpha+\beta)$.`, 4.5, 0.01,
    R`<p>$\alpha+\beta=3$, $\alpha\beta=\tfrac32$. Product $=\tfrac32\times3=4.5$.</p>`,
    'The roots are not integers; just use the coefficients.'),
  N('qe-034', 2, 'maximum and minimum', R`Find the maximum value of $\dfrac1{x^2-4x+9}$ for real $x$.`, 0.2, 0.001,
    R`<p>$x^2-4x+9=(x-2)^2+5\ge5$. So $\dfrac1{x^2-4x+9}\le\dfrac15=0.2$.</p>`,
    'To maximise a reciprocal, minimise the denominator (it is positive here).'),
  I('qe-035', 1, 'maximum and minimum', R`A rectangle has perimeter 40 cm. Find the greatest possible area in cm².`, 100,
    R`<p>Sides $x$ and $20-x$. Area $A=x(20-x)=-x^2+20x=-(x-10)^2+100\le100$.</p>`,
    'The best rectangle is a square.', { sub: 'mixed' }),
  I('qe-036', 1, 'maximum and minimum', R`If $x+y=8$, find the minimum value of $x^2+y^2$.`, 32,
    R`<p>$y=8-x$. $x^2+(8-x)^2=2x^2-16x+64=2(x-4)^2+32\ge32$.</p>`,
    'The minimum occurs at x = y = 4.'),
  I('qe-037', 2, 'common roots', R`The equations $x^2-kx+6=0$ and $2x^2-10x+12=0$ have both roots common. Find $k$.`, 5,
    R`<p>The second equation is $2(x^2-5x+6)=0$. Both roots are common only if the equations are proportional: $x^2-kx+6=x^2-5x+6$, so $k=5$.</p>`,
    'Divide the second equation by 2 before comparing.'),
  M('qe-038', 2, 'special cases', R`If $a,b,c$ are in G.P., the equation $ax^2+2bx+c=0$ has`, 'equal roots', ['two distinct real roots', 'non-real roots', 'roots that cannot be found'],
    R`<p>G.P. gives $b^2=ac$. $D=4b^2-4ac=0$, so the roots are equal (both equal $-b/a$).</p>`,
    'Do not use the discriminant b² − 4ac here: the middle coefficient is 2b.'),
  M('qe-039', 1, 'special cases', R`If $a,b,c$ are rational and $a+b+c=0$, the roots of $ax^2+bx+c=0$ are`, 'rational', ['irrational', 'non-real', 'equal'],
    R`<p>$x=1$ is a root (substitute). The other root is $\dfrac ca$, rational.</p>`,
    'Equal roots would need c/a = 1, which is not forced.'),
  I('qe-040', 1, 'minimum', R`Find the minimum value of $2x^2-8x+11$.`, 3,
    R`<p>$2(x^2-4x)+11=2(x-2)^2-8+11=2(x-2)^2+3\ge3$.</p>`,
    'The 2 multiplies the bracket: -8 + 11 = 3.'),
  M('qe-041', 2, 'inequalities', R`The solution of $x^2-|x|-6<0$ is`, R`$(-3,3)$`, [R`$(-2,2)$`, R`$(-3,2)$`, R`$(-\infty,-3)\cup(3,\infty)$`],
    R`<p>$x^2=|x|^2$, so $(|x|-3)(|x|+2)<0$. Since $|x|+2>0$ always, we need $|x|<3$: $-3<x<3$.</p>`,
    'The factor |x| + 2 is always positive and drops out.'),

  // ---------- L3 exam ----------
  I('qe-042', 3, 'minimum of symmetric function', R`The roots of $x^2-(k-2)x-(k+1)=0$ are $\alpha,\beta$. Find the minimum value of $\alpha^2+\beta^2$ over real $k$.`, 5,
    R`<p>$\alpha^2+\beta^2=(k-2)^2+2(k+1)=k^2-2k+6=(k-1)^2+5\ge5$.</p><p>It is attained at $k=1$. Roots are real for every $k$ because $D=(k-2)^2+4(k+1)=k^2+8>0$.</p>`,
    'Always confirm the roots are real for the k that gives the extreme value.'),
  M('qe-043', 3, 'transformed roots', R`If $\alpha,\beta$ are the roots of $x^2-5x+2=0$, the equation with roots $\dfrac\alpha\beta$ and $\dfrac\beta\alpha$ is`, R`$2x^2-21x+2=0$`, [R`$x^2-21x+2=0$`, R`$2x^2-5x+2=0$`, R`$2x^2+21x+2=0$`],
    R`<p>Product of new roots $=1$. Sum $=\dfrac{\alpha^2+\beta^2}{\alpha\beta}=\dfrac{25-4}2=\dfrac{21}2$.</p><p>Equation: $x^2-\tfrac{21}2x+1=0$, or $2x^2-21x+2=0$.</p>`,
    'Clear the fraction by multiplying by 2.'),
  M('qe-044', 3, 'transformed roots', R`If $\alpha,\beta$ are the roots of $x^2-3x+1=0$, the equation with roots $\alpha^2$ and $\beta^2$ is`, R`$x^2-7x+1=0$`, [R`$x^2-9x+1=0$`, R`$x^2-7x+2=0$`, R`$x^2+7x+1=0$`],
    R`<p>Sum $=\alpha^2+\beta^2=9-2=7$. Product $=(\alpha\beta)^2=1$.</p>`,
    '9 is the square of the original sum, not the sum of the squares.'),
  I('qe-045', 3, 'roots', R`The roots of $x^2-7x+k=0$ differ by 3. Find $k$.`, 10,
    R`<p>$(\alpha-\beta)^2=49-4k=9\Rightarrow k=10$. (Roots 5 and 2.)</p>`,
    'The difference is squared, so 49 − 4k = 9, not 3.'),
  I('qe-046', 3, 'symmetric functions', R`If $\alpha,\beta$ are the roots of $x^2-3x+1=0$, find $\dfrac1{\alpha^2}+\dfrac1{\beta^2}$.`, 7,
    R`<p>$\dfrac{\alpha^2+\beta^2}{(\alpha\beta)^2}=\dfrac{9-2}{1}=7$.</p>`,
    'The denominator is (αβ)², which is 1 here.'),
  I('qe-047', 4, 'symmetric functions', R`If $\alpha,\beta$ are the roots of $x^2-2x+3=0$, find $\alpha^4+\beta^4$.`, -14,
    R`<p>$\alpha+\beta=2$, $\alpha\beta=3$. $\alpha^2+\beta^2=4-6=-2$. $\alpha^4+\beta^4=(\alpha^2+\beta^2)^2-2(\alpha\beta)^2=4-18=-14$.</p><p>The roots are complex but the formulas still hold.</p>`,
    'A negative result is fine; the roots are not real.'),
  I('qe-048', 3, 'rational roots', R`For how many positive integers $k$ does $x^2-5x+k=0$ have rational roots?`, 2,
    R`<p>Rational roots need $D=25-4k$ to be a perfect square (with $D\ge0$, so $k\le6$). Test $k=1..6$: $D=21,17,13,9,5,1$. Squares: $9$ ($k=4$) and $1$ ($k=6$).</p><p>2 values: $k=4$ (roots 1, 4) and $k=6$ (roots 2, 3).</p>`,
    'D = 0 is also a perfect square; here it would need k = 6.25, which is not an integer.'),
  M('qe-049', 3, 'location of roots', R`$f(x)=x^2-2kx+k+2$. Both roots of $f(x)=0$ are less than 1 exactly when`, R`$k\le-1$`, [R`$k\ge2$`, R`$-1<k<1$`, R`$k<1$`],
    R`<p>Three conditions: (i) $D\ge0$: $k^2-k-2\ge0\Rightarrow k\le-1$ or $k\ge2$. (ii) $f(1)>0$: $3-k>0\Rightarrow k<3$. (iii) vertex left of 1: $k<1$.</p><p>Together: $k\le-1$. Check $k=-1$: $x^2+2x+1$, root $-1$ (double) $<1$ ✓.</p>`,
    'Vertex condition k < 1 alone is not enough; D ≥ 0 cuts out (−1, 1).'),
  M('qe-050', 3, 'location of roots', R`$f(x)=x^2-2kx+k+2$. The number 2 lies strictly between the roots exactly when`, R`$k>2$`, [R`$k<2$`, R`$k>3$`, R`$k\ge2$`],
    R`<p>A point lies strictly between the roots of an upward parabola when the value there is negative: $f(2)<0$.</p><p>$f(2)=4-4k+k+2=6-3k<0\Rightarrow k>2$. (D is then automatically positive.)</p>`,
    'No discriminant condition is needed when f(c) < 0.'),
  I('qe-051', 3, 'location of roots', R`The roots of $x^2-(a-3)x+a=0$ are real and both positive. Find the least integer value of $a$.`, 9,
    R`<p>Conditions: $D\ge0$: $a^2-10a+9\ge0\Rightarrow a\le1$ or $a\ge9$. Sum $>0$: $a-3>0\Rightarrow a>3$. Product $>0$: $a>0$.</p><p>Together $a\ge9$. Least integer: $9$.</p>`,
    'The sum condition rules out a ≤ 1 from the discriminant.'),
  M('qe-052', 3, 'sign of expression', R`$x^2-2(k-1)x+(k+5)>0$ for every real $x$ exactly when`, R`$-1<k<4$`, [R`$k<-1$ or $k>4$`, R`$-1\le k\le4$`, R`$k>4$`],
    R`<p>Leading coefficient is positive, so we need $D<0$.</p><p>$D=4(k-1)^2-4(k+5)=4(k^2-3k-4)=4(k-4)(k+1)<0\Rightarrow-1<k<4$.</p>`,
    'D = 0 would touch zero, so the ends are excluded.'),
  M('qe-053', 3, 'inequalities', R`The solution set of $\dfrac{x^2-4}{x^2-9}<0$ is`, R`$(-3,-2)\cup(2,3)$`, [R`$(-3,3)$`, R`$(-2,2)$`, R`$(-\infty,-3)\cup(-2,2)\cup(3,\infty)$`],
    R`<p>Critical points $-3,-2,2,3$. For large $x$ the fraction is positive. Flipping at each point from the right: $(2,3)$ negative, $(-2,2)$ positive, $(-3,-2)$ negative, $x<-3$ positive.</p><p>Negative on $(-3,-2)\cup(2,3)$.</p>`,
    'The points ±3 are excluded (zero denominator); ±2 are excluded because the inequality is strict.'),
  M('qe-054', 3, 'inequalities', R`The solution set of $\dfrac{x^2-3x+2}{x^2+x+1}<0$ is`, R`$(1,2)$`, [R`$(-\infty,1)\cup(2,\infty)$`, R`$[1,2]$`, R`no real $x$`],
    R`<p>$x^2+x+1$ has $D=-3<0$ and positive leading coefficient, so it is positive for all real $x$. The sign of the fraction is the sign of the numerator $(x-1)(x-2)$, which is negative on $(1,2)$.</p>`,
    'Spot the always-positive denominator before drawing a sign scheme.'),
  I('qe-055', 3, 'modulus inequalities', R`How many integers satisfy $|x^2-5x|<6$?`, 4,
    R`<p>$-6<x^2-5x<6$. Right part: $x^2-5x-6<0\Rightarrow-1<x<6$. Left part: $x^2-5x+6>0\Rightarrow x<2$ or $x>3$.</p><p>Solution: $(-1,2)\cup(3,6)$. Integers: $0,1,4,5$: four.</p>`,
    'Both inequalities must hold: take the intersection.'),
  I('qe-056', 4, 'modulus equations', R`How many distinct real solutions does $|x^2-4x+3|=1$ have?`, 3,
    R`<p>Case $x^2-4x+3=1$: $x^2-4x+2=0$, $x=2\pm\sqrt2$. Case $x^2-4x+3=-1$: $x^2-4x+4=0$, $x=2$ (double).</p><p>Distinct solutions: $2+\sqrt2,\,2-\sqrt2,\,2$: three.</p>`,
    'A double root counts once as a solution.'),
  M('qe-057', 3, 'common roots', R`If $x^2+ax+b=0$ and $x^2+bx+a=0$ ($a\ne b$) have a common root, then $a+b$ equals`, '-1', ['0', '1', '2'],
    R`<p>Subtract: $(a-b)x+(b-a)=0\Rightarrow x=1$ (since $a\ne b$). Put $x=1$ in either: $1+a+b=0$, so $a+b=-1$.</p>`,
    'Subtracting the two equations removes x².'),
  I('qe-058', 3, 'mixed trigonometry', R`$\sin\theta$ and $\cos\theta$ are the roots of $25x^2-35x+k=0$. Find $k$.`, 12,
    R`<p>Sum $=\sin\theta+\cos\theta=\dfrac{35}{25}=\dfrac75$. Product $=\sin\theta\cos\theta=\dfrac k{25}$.</p><p>$(\sin\theta+\cos\theta)^2=1+2\sin\theta\cos\theta\Rightarrow\dfrac{49}{25}=1+\dfrac{2k}{25}\Rightarrow k=12$.</p><p>Check: roots $0.6$ and $0.8$.</p>`,
    'Use sin² + cos² = 1 to link the sum and the product.', { sub: 'mixed' }),
  I('qe-059', 3, 'mixed complex numbers', R`If $\alpha,\beta$ are the roots of $x^2-2x+5=0$, find $|\alpha|^2+|\beta|^2$.`, 10,
    R`<p>$D=4-20=-16<0$, roots $1\pm2i$. $|1\pm2i|^2=1+4=5$. Sum $=10$.</p>`,
    '|α|² is not the same as α² for complex α.', { sub: 'mixed' }),
  I('qe-060', 4, 'reducible equations', R`The roots of $(x^2-x)^2-8(x^2-x)+12=0$ are all real. Find the sum of the squares of all four roots.`, 18,
    R`<p>Let $t=x^2-x$: $t^2-8t+12=0\Rightarrow t=2$ or $6$.</p><p>$t=2$: $x^2-x-2=0$, roots $2,-1$. $t=6$: $x^2-x-6=0$, roots $3,-2$.</p><p>Sum of squares $=4+1+9+4=18$.</p>`,
    'Work with each quadratic and combine, not with the original quartic.'),
  I('qe-061', 3, 'range on an interval', R`For $f(x)=x^2-6x+10$ on $4\le x\le7$, find the difference between the greatest and least values.`, 15,
    R`<p>The vertex is at $x=3$, outside the interval, so $f$ is increasing on $[4,7]$.</p><p>Least $=f(4)=2$, greatest $=f(7)=17$. Difference $=15$.</p>`,
    'The vertex minimum 1 is not in the interval.'),
  I('qe-062', 4, 'maximum and minimum', R`Find the minimum value of $x^2-4|x|+3$ for real $x$.`, -1,
    R`<p>$x^2=|x|^2$, so $f=|x|^2-4|x|+3=(|x|-2)^2-1\ge-1$, reached at $|x|=2$ ($x=\pm2$).</p>`,
    'The expression is a quadratic in |x|, with |x| ≥ 0 allowing the vertex 2.'),
  N('qe-063', 4, 'maximum and minimum', R`The sum of squares $(x-1)^2+(x-3)^2+(x-7)^2$ has least value. Give it to two decimals.`, 18.67, 0.01,
    R`<p>Expand: $3x^2-22x+59$. Vertex at $x=\dfrac{22}{6}=\dfrac{11}3$. Minimum $=59-\dfrac{22^2}{12}=59-\dfrac{121}{3}=\dfrac{56}3\approx18.67$.</p>`,
    'The least sum of squared distances occurs at the mean of the points.'),
  M('qe-064', 4, 'sign of expression', R`$(k-2)x^2+8x+(k+4)>0$ for all real $x$ exactly when`, R`$k>4$`, [R`$k>2$`, R`$k<-6$`, R`$-6<k<4$`],
    R`<p>Need leading coefficient $k-2>0$ and $D<0$: $64-4(k-2)(k+4)<0\Rightarrow(k-2)(k+4)>16\Rightarrow k^2+2k-24>0\Rightarrow(k+6)(k-4)>0$.</p><p>With $k>2$ this means $k>4$.</p>`,
    'Do not forget k > 2; the case k < -6 has a negative leading coefficient.'),
  M('qe-065', 3, 'greatest integer equations', R`The solution set of $[x]^2-3[x]-4=0$ is`, R`$[-1,0)\cup[4,5)$`, [R`$\{-1,4\}$`, R`$[-1,0]\cup[4,5]$`, R`$[1,2)\cup[3,4)$`],
    R`<p>Put $t=[x]$: $t^2-3t-4=(t-4)(t+1)=0\Rightarrow t=4$ or $t=-1$. $[x]=4\Rightarrow4\le x<5$; $[x]=-1\Rightarrow-1\le x<0$.</p>`,
    'Greatest-integer conditions give half-open intervals.'),
  M('qe-066', 3, 'special cases', R`If $a,b,c$ are in G.P. (all non-zero), the roots of $ax^2+bx+c=0$ are`, 'non-real', ['real and distinct', 'real and equal', 'rational'],
    R`<p>$b^2=ac$. $D=b^2-4ac=b^2-4b^2=-3b^2<0$ (as $b\ne0$). So the roots are non-real.</p>`,
    'Compare with the G.P. item where the middle coefficient is 2b.'),

  // ---------- L4 hard ----------
  M('qe-067', 5, 'range of a rational expression', R`The range of $\dfrac{x^2-3x+2}{x^2+x+1}$ for real $x$ is`, R`$\left[3-\tfrac{2\sqrt{21}}3,\;3+\tfrac{2\sqrt{21}}3\right]$`, [R`$[1,2]$`, R`$[-1,6]$`, R`$\left(3-\tfrac{2\sqrt{21}}3,\;3+\tfrac{2\sqrt{21}}3\right)$`],
    R`<p>Let $y=\dfrac{x^2-3x+2}{x^2+x+1}$. Then $(y-1)x^2+(y+3)x+(y-2)=0$. For a real $x$ the discriminant must be $\ge0$ (and $y=1$ is reachable at $x=\tfrac14$).</p><p>$(y+3)^2-4(y-1)(y-2)=-3y^2+18y+1\ge0\Rightarrow3y^2-18y-1\le0$. Roots $y=3\pm\dfrac{2\sqrt{21}}3$.</p><p>Both ends are attained (equal roots give a real $x$), so the range is the closed interval $\approx[-0.055,\,6.055]$.</p>`,
    'The denominator is never zero, so no value of y is lost by cross-multiplying.'),
  M('qe-068', 4, 'location of roots', R`$f(x)=x^2-2kx+k+2$. Both roots lie in $(0,3)$ exactly when`, R`$2\le k<\tfrac{11}5$`, [R`$0<k<3$`, R`$k\ge2$`, R`$-2<k<\tfrac{11}5$`],
    R`<p>Four conditions: $D\ge0$: $k\le-1$ or $k\ge2$. $0<$ vertex $<3$: $0<k<3$. $f(0)=k+2>0$: $k>-2$. $f(3)=11-5k>0$: $k<\tfrac{11}5$.</p><p>Intersect: $2\le k<\dfrac{11}5$. Check $k=2$: $x^2-4x+4$, double root $2\in(0,3)$ ✓. Check $k=2.2$: $f(3)=0$, root at 3, excluded ✓.</p>`,
    'Each condition cuts something: the vertex bound kills k ≤ -1, and f(3) > 0 gives the upper limit.'),
  M('qe-069', 4, 'location of roots', R`$f(x)=x^2-2kx+k+2$. Exactly one root of $f(x)=0$ lies in $(0,1)$ when`, R`$k<-2$ or $k>3$`, [R`$-2<k<3$`, R`$k\le-2$ or $k\ge3$`, R`$k>3$ only`],
    R`<p>Exactly one root in $(0,1)$ requires $f(0)$ and $f(1)$ to have opposite signs: $f(0)=k+2$, $f(1)=3-k$.</p><p>$(k+2)(3-k)<0\Rightarrow k<-2$ or $k>3$.</p><p>Check the ends: $k=-2$: roots $0,-4$ (none in $(0,1)$). $k=3$: roots $1,5$ (none). So end points are excluded.</p>`,
    'f(0)f(1) < 0 gives exactly one root only; the boundary cases need to be checked separately.'),
  M('qe-070', 4, 'location of roots', R`$f(x)=x^2-2kx+k+2$. Both roots are greater than 1 exactly when`, R`$2\le k<3$`, [R`$k\ge2$`, R`$1<k<3$`, R`$k<3$`],
    R`<p>(i) $D\ge0$: $k\le-1$ or $k\ge2$. (ii) $f(1)>0$: $3-k>0\Rightarrow k<3$. (iii) vertex right of 1: $k>1$.</p><p>Together $2\le k<3$. Check $k=2.5$: $x^2-5x+4.5$, roots $\dfrac{5\pm\sqrt7}2\approx1.18,\,3.82$ ✓.</p>`,
    'f(1) > 0 alone is not enough: both roots could also be less than 1.'),
  M('qe-071', 5, 'location of roots', R`Both roots of $x^2-2ax+a^2+a-3=0$ are less than 3 exactly when`, R`$a<2$`, [R`$a<3$`, R`$a\le2$`, R`$2<a<3$`],
    R`<p>$D=4a^2-4(a^2+a-3)=12-4a\ge0\Rightarrow a\le3$. $f(3)=9-6a+a^2+a-3=(a-2)(a-3)>0\Rightarrow a<2$ or $a>3$. Vertex $a<3$.</p><p>Together $a<2$. Check $a=2$: $x^2-4x+3$ has root $3$, not less than 3, so $a=2$ fails.</p>`,
    'At a = 3 the double root equals 3; at a = 2 one root equals 3. Both are excluded.'),
  M('qe-072', 5, 'inequalities', R`The solution of $\sqrt{x+3}>x+1$ is`, R`$[-3,1)$`, [R`$(-2,1)$`, R`$[-1,1)$`, R`$(-3,1)$`],
    R`<p>Domain: $x\ge-3$.</p><p>If $x+1<0$ (i.e. $x<-1$): the left side is non-negative and the right negative, so the inequality holds: $-3\le x<-1$.</p><p>If $x+1\ge0$: square: $x+3>x^2+2x+1\Rightarrow x^2+x-2<0\Rightarrow-2<x<1$, with $x\ge-1$ gives $-1\le x<1$.</p><p>Union: $[-3,1)$.</p>`,
    'Split into a negative-right-side case and a non-negative one before squaring.'),
  M('qe-073', 4, 'log inequalities', R`The solution of $\log_2(x^2-5x+6)\ge1$ is`, R`$(-\infty,1]\cup[4,\infty)$`, [R`$(-\infty,2)\cup(3,\infty)$`, R`$[1,4]$`, R`$(-\infty,1)\cup(4,\infty)$`],
    R`<p>Argument must exceed 0: $x<2$ or $x>3$. The inequality: $x^2-5x+6\ge2\Rightarrow x^2-5x+4\ge0\Rightarrow x\le1$ or $x\ge4$ (base 2 > 1, so the direction is kept).</p><p>Both parts are inside the domain. Solution: $(-\infty,1]\cup[4,\infty)$.</p>`,
    'Base greater than 1 keeps the inequality direction; the log stays defined.', { sub: 'mixed' }),
  I('qe-074', 5, 'greatest integer equations', R`How many real solutions does $x^2=2[x]+3$ have?`, 3,
    R`<p>Let $n=[x]$, so $x^2=2n+3$ and $n\le x<n+1$.</p><p>$x>0$: $x=\sqrt{2n+3}$ with $n^2\le2n+3<(n+1)^2$: needs $-1\le n\le3$ and $n^2>2$: $n=2,3$. Solutions $\sqrt7$ and $3$.</p><p>$x<0$: $x=-\sqrt{2n+3}$, need $n\le x<n+1$: only $n=-1$ works, $x=-1$.</p><p>Solutions: $-1,\sqrt7,3$. Three.</p>`,
    'Test each candidate: the floor of the candidate must equal the n you assumed.'),
  I('qe-075', 5, 'reducible equations', R`How many distinct real roots does $x^4-5x^3+8x^2-5x+1=0$ have?`, 3,
    R`<p>Divide by $x^2$ (since $x=0$ is not a root): $\left(x^2+\tfrac1{x^2}\right)-5\left(x+\tfrac1x\right)+8=0$. With $t=x+\tfrac1x$: $t^2-5t+6=0\Rightarrow t=2$ or $3$.</p><p>$t=2$: $x=1$ (double). $t=3$: $x=\dfrac{3\pm\sqrt5}2$.</p><p>Distinct real roots: $1,\dfrac{3+\sqrt5}2,\dfrac{3-\sqrt5}2$: three.</p>`,
    'A repeated root counts once when you are asked for distinct roots.'),
  I('qe-076', 4, 'reducible equations', R`Find the product of all four roots (real and complex) of $(x-1)(x-2)(x-3)(x-4)=3$.`, 21,
    R`<p>Group: $(x-1)(x-4)=x^2-5x+4$ and $(x-2)(x-3)=x^2-5x+6$. With $u=x^2-5x+5$: $(u-1)(u+1)=3\Rightarrow u^2=4\Rightarrow u=\pm2$.</p><p>$u=2$: $x^2-5x+3=0$ (product 3). $u=-2$: $x^2-5x+7=0$ (product 7, complex roots).</p><p>Product of all four $=3\times7=21$. Check: the quartic's constant term is $24-3=21$.</p>`,
    'The complex roots also count in the product.'),
  M('qe-077', 4, 'transformed roots', R`If $\alpha,\beta$ are the roots of $x^2-3x+1=0$, the equation whose roots are $\alpha+\dfrac1\beta$ and $\beta+\dfrac1\alpha$ is`, R`$x^2-6x+4=0$`, [R`$x^2-6x+5=0$`, R`$x^2-3x+4=0$`, R`$x^2-9x+4=0$`],
    R`<p>Since $\alpha\beta=1$, $\dfrac1\beta=\alpha$ and $\dfrac1\alpha=\beta$. The new roots are $2\alpha$ and $2\beta$.</p><p>Sum $=2\cdot3=6$, product $=4\alpha\beta=4$. Equation $x^2-6x+4=0$.</p>`,
    'Look for a hidden relation such as αβ = 1 before expanding.'),
  I('qe-078', 4, 'power sums', R`If $\alpha,\beta$ are the roots of $x^2-x-1=0$, find $\alpha^{10}+\beta^{10}$.`, 123,
    R`<p>Let $S_n=\alpha^n+\beta^n$. Since $\alpha^2=\alpha+1$, $S_n=S_{n-1}+S_{n-2}$, with $S_0=2$, $S_1=1$.</p><p>$S_2=3,S_3=4,S_4=7,S_5=11,S_6=18,S_7=29,S_8=47,S_9=76,S_{10}=123$.</p>`,
    'Start the recurrence with S0 = 2 (not 1).'),
  I('qe-079', 4, 'power sums', R`If $\alpha,\beta$ are the roots of $x^2-4x+1=0$, find $\alpha^6+\beta^6$.`, 2702,
    R`<p>$S_n=4S_{n-1}-S_{n-2}$ with $S_0=2$, $S_1=4$.</p><p>$S_2=14$, $S_3=52$, $S_4=194$, $S_5=724$, $S_6=2702$.</p>`,
    'The recurrence follows from x² = 4x − 1; do not use S_n = 4^n − 1.'),
  I('qe-080', 4, 'power sums', R`$\alpha,\beta$ are the roots of $x^2-4x-3=0$ and $a_n=\alpha^n-\beta^n$. Find $\dfrac{a_{10}-3a_8}{a_9}$.`, 4,
    R`<p>$\alpha^2=4\alpha+3$, so $\alpha^{10}=4\alpha^9+3\alpha^8$. The same holds for $\beta$. Subtract: $a_{10}=4a_9+3a_8$.</p><p>$\dfrac{a_{10}-3a_8}{a_9}=4$.</p>`,
    'No numbers are needed; the recurrence does everything.'),
  M('qe-081', 4, 'common roots', R`If $ax^2+bx+c=0$ and $cx^2+bx+a=0$ ($a\ne c$) have a common root, then`, R`$(a+c)^2=b^2$`, [R`$a+c=0$`, R`$b^2=4ac$`, R`$a=b=c$`],
    R`<p>Subtract: $(a-c)x^2+(c-a)=0\Rightarrow x^2=1\Rightarrow x=\pm1$ (since $a\ne c$).</p><p>$x=1$: $a+b+c=0$. $x=-1$: $a-b+c=0$. In both cases $(a+c)^2=b^2$.</p>`,
    'Common root is ±1, so two cases combine into one squared condition.'),
  I('qe-082', 5, 'common roots', R`Find the number of values of $a$ (real or complex) for which $x^2+ax+2=0$ and $x^2+2x+a=0$ have at least one common root.`, 2,
    R`<p>Subtract: $(a-2)x+(2-a)=0\Rightarrow(a-2)(x-1)=0$. Either $a=2$ or $x=1$.</p><p>$x=1$ in the first: $1+a+2=0\Rightarrow a=-3$ (second: $1+2-3=0$ ✓).</p><p>$a=2$: both equations become $x^2+2x+2=0$, identical, with both (complex) roots common.</p><p>Values: $a=-3$ and $a=2$: 2.</p>`,
    'Dividing by (a − 2) loses the case a = 2, where the equations coincide.'),
  I('qe-083', 5, 'location of roots', R`Both roots of $x^2-2ax+3a-2=0$ lie in the interval $(1,5)$. How many integer values can $a$ take?`, 2,
    R`<p>Conditions: $D=4a^2-4(3a-2)\ge0\Rightarrow(a-1)(a-2)\ge0$: $a\le1$ or $a\ge2$. Vertex $1<a<5$. $f(1)=a-1>0$: $a>1$. $f(5)=23-7a>0$: $a<\tfrac{23}7$.</p><p>Together $2\le a<\tfrac{23}7\approx3.29$. Integers: $2,3$. Two values.</p>`,
    'Count the integers in [2, 3.29): both 2 and 3 are valid.'),

  // ---------- L5 top rank ----------
  I('qe-084', 5, 'parameters with hidden condition', R`The roots of $x^2-(m-2)x+(m^2+3m+5)=0$ are real. Find the greatest possible value of the sum of their squares.`, 18,
    R`<p>Sum of squares $=(m-2)^2-2(m^2+3m+5)=-m^2-10m-6$.</p><p>Real roots need $D=(m-2)^2-4(m^2+3m+5)=-3m^2-16m-16\ge0\Rightarrow(3m+4)(m+4)\le0\Rightarrow-4\le m\le-\tfrac43$.</p><p>On this interval $g(m)=-m^2-10m-6$ has its vertex at $m=-5$ (outside), and $g$ decreases for $m>-5$. So the greatest value is at $m=-4$: $g=-16+40-6=18$. (Then $x^2+6x+9=0$, double root $-3$: $9+9=18$ ✓.)</p>`,
    'The unconstrained maximum (at m = −5) is not allowed: the roots must be real.'),
  I('qe-085', 5, 'sign scheme with a cancelling factor', R`How many integers satisfy $\dfrac{(x^2-x-6)(x^2-4x+3)}{x^2-1}\le0$?`, 2,
    R`<p>Factorise: $\dfrac{(x-3)(x+2)(x-3)(x-1)}{(x-1)(x+1)}$. For $x\ne\pm1$ this equals $\dfrac{(x-3)^2(x+2)}{x+1}$.</p><p>$(x-3)^2\ge0$, zero at $x=3$ (that gives $0\le0$: valid). Otherwise need $\dfrac{x+2}{x+1}\le0$: $-2\le x<-1$.</p><p>Solution set $[-2,-1)\cup\{3\}$. Note $x=1$ is excluded (original denominator zero). Integers: $-2$ and $3$: two.</p>`,
    'Cancelling (x − 1) does not make x = 1 allowed, and the squared factor adds the isolated point 3.'),
  M('qe-086', 5, 'sign scheme with a repeated factor', R`The solution set of $\dfrac{(x-1)^2(x+2)}{x-3}\ge0$ is`, R`$(-\infty,-2]\cup\{1\}\cup(3,\infty)$`, [R`$(-\infty,-2]\cup(3,\infty)$`, R`$[-2,3)$`, R`$(-\infty,-2]\cup[1,3)\cup(3,\infty)$`],
    R`<p>Critical points: $-2$ (simple), $1$ (double), $3$ (simple, zero of the denominator). For $x>3$ all factors are positive: $+$. Crossing 3 flips: $(1,3)$ is $-$. The double root at 1 does not flip: $(-2,1)$ is $-$. Crossing $-2$ flips: $x<-2$ is $+$.</p><p>$\ge0$: $(-\infty,-2]$, $(3,\infty)$, plus the isolated point $x=1$ where the value is $0$. $x=3$ is excluded.</p>`,
    'Even powers do not change the sign, but the zero of that factor is still a solution of "≥ 0".'),
  X('qe-087', 4, 'location of roots', R`The quadratic $f(x)=x^2+bx+c$ has $f(1)<0$. Which of the following must be true?`,
    ['$f(x)=0$ has real roots', 'the number 1 lies strictly between the roots', '$b^2>4c$', 'both roots are positive'], [0, 1, 2],
    R`<p>An upward parabola that is negative at $x=1$ crosses the x-axis on both sides of 1. So the roots are real, 1 lies between them, and $D=b^2-4c>0$.</p><p>The roots need not be positive: for example $x^2+3x-5$ has $f(1)=-1<0$ and a negative root.</p>`,
    'f(1) < 0 gives a lot of information, but nothing about the signs of the roots.'),
  X('qe-088', 3, 'special cases', R`Let $a,b,c$ be real, $a\ne0$, with $a+b+c=0$. Which statements are true?`,
    ['$x=1$ is a root of $ax^2+bx+c=0$', 'the other root is $c/a$', 'the roots are real', 'the roots are rational'], [0, 1, 2],
    R`<p>$f(1)=a+b+c=0$. The product of roots $=c/a$, so the other root is $c/a$. $D=b^2-4ac=(a+c)^2-4ac=(a-c)^2\ge0$: real. They are rational only if $a,b,c$ are rational, not for arbitrary real coefficients.</p>`,
    '"Real" is not "rational": the coefficients themselves may be irrational.'),
  X('qe-089', 2, 'nature of roots', R`For which of these values of $k$ does $x^2-5x+k=0$ have real roots?`,
    ['$k=6$', '$k=6.25$', '$k=7$', '$k=-2$'], [0, 1, 3],
    R`<p>$D=25-4k\ge0\Rightarrow k\le6.25$. So $6$, $6.25$ (equal roots) and $-2$ work; $7$ gives $D=-3<0$.</p>`,
    'k = 6.25 gives D = 0, which still means real (equal) roots.'),
  X('qe-090', 3, 'no real solution', R`Which of the following equations have <b>no</b> real solution?`,
    [R`$x^2+x+1=0$`, R`$|x-1|=-2$`, R`$x^2-2x+1=0$`, R`$\sqrt{x-5}+\sqrt{2-x}=1$`], [0, 1, 3],
    R`<p>$D=-3<0$ for the first. A modulus is never negative: the second. $(x-1)^2=0$ has $x=1$. The fourth needs $x\ge5$ and $x\le2$ together: impossible, so no real $x$.</p>`,
    'The last one fails at the domain, before any algebra.'),
  X('qe-091', 3, 'symmetric functions', R`If $\alpha,\beta$ are the roots of $x^2-4x+1=0$, which of the following are true?`,
    [R`$\alpha^2+\beta^2=14$`, R`$(\alpha-\beta)^2=12$`, R`$\alpha^3+\beta^3=60$`, R`$\dfrac1\alpha+\dfrac1\beta=4$`], [0, 1, 3],
    R`<p>$s=4$, $p=1$. $s^2-2p=14$ ✓. $s^2-4p=12$ ✓. $s^3-3ps=64-12=52\ne60$ ✗. $\dfrac sp=4$ ✓.</p>`,
    '52 is the correct cube sum; 60 comes from forgetting the factor 3.'),
  X('qe-092', 3, 'degenerate cases', R`For which values of $k$ does $kx^2-4x+k=0$ have real roots <b>and</b> remain a quadratic equation?`,
    ['$k=2$', '$k=-2$', '$k=0$', '$k=3$'], [0, 1],
    R`<p>It is a quadratic only when $k\ne0$. $D=16-4k^2\ge0\Rightarrow|k|\le2$. So $k=\pm2$ (D = 0) are valid. $k=0$ gives the linear equation $-4x=0$. $k=3$ has $D=-20<0$.</p>`,
    'The leading coefficient must not vanish.'),
  X('qe-093', 2, 'inequalities', R`Which of these numbers satisfy $x^2-4x+3\le0$?`, ['$x=1$', '$x=2$', '$x=3$', '$x=4$'], [0, 1, 2],
    R`<p>$(x-1)(x-3)\le0\Rightarrow1\le x\le3$. So 1, 2, 3 satisfy; 4 does not ($f(4)=3>0$).</p>`,
    'End points are included for "≤".'),
  X('qe-094', 4, 'modulus and parity', R`For $f(x)=x^2-2|x|-3$ which statements are true?`,
    ['$f$ is an even function', 'the minimum value of $f$ is $-4$', '$f(x)=0$ has exactly two real solutions', '$f$ is one-one on $\\mathbb{R}$'], [0, 1, 2],
    R`<p>$f(-x)=f(x)$: even. $f=(|x|-1)^2-4\ge-4$: minimum $-4$ at $x=\pm1$. $f=0$: $(|x|-3)(|x|+1)=0\Rightarrow|x|=3$: $x=\pm3$. Not one-one, since $f(1)=f(-1)$.</p>`,
    'Even functions are never one-one on a symmetric domain.'),
  X('qe-095', 5, 'parameters', R`Let $f_p(x)=x^2-2px+p+2$ with $p$ real. Which statements are true?`,
    ['$f_p$ has real roots for $p=-1$', '$f_p$ has real roots for $p=1$', '$f_p(x)>0$ for all real $x$ when $p=1$', 'both roots of $f_p$ are positive when $p=2$'], [0, 2, 3],
    R`<p>$D/4=p^2-p-2=(p-2)(p+1)$. $p=-1$: $D=0$, real (equal) roots ✓. $p=1$: $D/4=-2<0$, no real roots ✗, and with positive leading coefficient $f_1>0$ everywhere ✓. $p=2$: $x^2-4x+4$, double root $2>0$ ✓.</p>`,
    'The same coefficient letter p appears in the equation; read each case by substituting directly.'),

  // ---------- assertion-reason ----------
  A('qe-096', 2, 'complex roots', R`A quadratic with real coefficients and negative discriminant has two non-real roots that are complex conjugates.`, R`Non-real roots of a polynomial with real coefficients occur in conjugate pairs.`, 0,
    R`<p>For $D<0$ the roots are $\dfrac{-b\pm i\sqrt{-D}}{2a}$, which are conjugates. R is the general fact that explains it.</p>`,
    'The conjugate-pair rule needs real coefficients.'),
  A('qe-097', 2, 'sign of expression', R`$x^2-2x+3>0$ for all real $x$.`, R`The discriminant is negative and the leading coefficient is positive.`, 0,
    R`<p>$D=4-12=-8<0$ and $a=1>0$, so the parabola lies above the x-axis. R explains A.</p>`,
    'Both parts of R are needed.'),
  A('qe-098', 3, 'conjugate roots', R`If one root of a quadratic with real coefficients is $3+\sqrt2$, the other root is $3-\sqrt2$.`, R`Irrational roots of a quadratic with rational coefficients occur as conjugate surds.`, 3,
    R`<p>R is true. But A has only real coefficients, not rational ones. Example: $(x-3-\sqrt2)(x-7)$ has real coefficients and roots $3+\sqrt2$ and $7$. So A is false.</p>`,
    'Real coefficients force conjugates only for complex roots, not for surds.'),
  A('qe-099', 2, 'sum and product', R`The sum of the roots of $x^2-7x+10=0$ is 7.`, R`The product of the roots of $x^2-7x+10=0$ is 10.`, 1,
    R`<p>Both statements are true by Vieta (roots 2 and 5). But the product does not explain the sum: the sum is $-b/a$.</p>`,
    'Two true facts about the same equation need not be linked.'),
  A('qe-100', 3, 'nature of roots', R`The equation $x^2-kx-1=0$ has real roots for every real $k$.`, R`Every quadratic equation with a positive leading coefficient has real roots.`, 2,
    R`<p>A is true: $D=k^2+4>0$ (the product of roots is $-1<0$). R is false: $x^2+1=0$ has positive leading coefficient but no real roots.</p>`,
    'R sounds plausible but is false.'),
  A('qe-101', 3, 'sign of expression', R`If $ax^2+bx+c$ has $D<0$, then $ax^2+bx+c>0$ for all real $x$.`, R`When $D<0$, the sign of $ax^2+bx+c$ is the same as the sign of $a$ for every real $x$.`, 3,
    R`<p>R is true. So the expression is positive only if $a>0$. If $a<0$ it is negative everywhere. A is false.</p>`,
    'The sign of a decides.'),
  A('qe-102', 2, 'modulus equations', R`$x^2-|x|-6=0$ has exactly two real roots.`, R`$|x|=3$ or $|x|=-2$, and $|x|=-2$ is impossible.`, 0,
    R`<p>$(|x|-3)(|x|+2)=0$. Only $|x|=3$ is possible, giving $x=\pm3$: two roots. R is the reasoning behind A.</p>`,
    'Count x values, not |x| values.'),
  A('qe-103', 3, 'nature of roots', R`$x^2+kx+1=0$ has non-real roots when $-2<k<2$.`, R`The product of its roots is 1.`, 1,
    R`<p>$D=k^2-4<0\iff-2<k<2$: A is true. R is also true (product $c/a=1$) but it does not explain why the roots are non-real; the discriminant does.</p>`,
    'The product being 1 holds for every k.'),
  A('qe-104', 3, 'sign of roots', R`If $a>0$ and $c<0$, $ax^2+bx+c=0$ has two real roots of opposite signs.`, R`The product of the roots is $\dfrac ca<0$.`, 0,
    R`<p>$ac<0$ gives $D=b^2-4ac>0$, so the roots are real and distinct. Negative product means opposite signs. R explains A.</p>`,
    'Negative product forces real roots; positive product does not.'),
  A('qe-105', 4, 'difference of roots', R`If $\alpha,\beta$ are the roots of $x^2-6x+k=0$ and $\alpha-\beta=2$, then $k=7$.`, R`$(\alpha-\beta)^2=(\alpha+\beta)^2-4\alpha\beta=36-4k$.`, 3,
    R`<p>R is true. Using it: $4=36-4k\Rightarrow k=8$ (roots 3 and 5). So A, which says $k=7$, is false.</p>`,
    'Check by listing the roots: sum 6 and difference 2 give 4 and 2, whose product is 8.'),

  // ---------- statements ----------
  S('qe-106', 2, 'complex roots', R`The roots of $x^2+x+1=0$ are the non-real cube roots of unity.`, R`$x^2+x+1$ has no real root.`, 0,
    R`<p>$D=1-4=-3<0$, so there is no real root (II). The roots $\omega,\omega^2$ satisfy $\omega^3=1$ (I). Both true.</p>`,
    'x³ − 1 = (x − 1)(x² + x + 1).'),
  S('qe-107', 2, 'sign of roots', R`If $f(0)<0$ for $f(x)=x^2+bx+c$, then the roots are real and of opposite signs.`, R`The product of the roots is $c$, and $f(0)=c$.`, 0,
    R`<p>$c<0$ gives a negative product, so the roots are real with opposite signs. II states the link. Both true.</p>`,
    'f(0) is the constant term.'),
  S('qe-108', 3, 'conjugate roots', R`A quadratic with real coefficients and a root $1+i$ has the other root $1-i$.`, R`Every quadratic that has a non-real root has its conjugate as the other root.`, 1,
    R`<p>I is true (conjugate pair rule). II is false: $(x-i)(x-1)=x^2-(1+i)x+i$ has roots $i$ and $1$, and the conjugate of $i$ is $-i$, not a root. The rule needs real coefficients.</p>`,
    'The word "real" in the coefficients does the work.'),
  S('qe-109', 2, 'inequalities', R`$(x-1)^2>0$ for every real $x$.`, R`The square of a real number is non-negative.`, 2,
    R`<p>At $x=1$ the value is $0$, so I is false. II is true.</p>`,
    '"Non-negative" is not the same as "positive".'),
  S('qe-110', 2, 'inequalities', R`The solution of $x^2>4$ is $x>2$.`, R`$x^2>4$ is equivalent to $|x|>2$.`, 2,
    R`<p>$x^2>4\iff|x|>2\iff x>2$ or $x<-2$. So I is false (it misses $x<-2$) and II is true.</p>`,
    'Taking the square root gives |x|, not x.'),
  S('qe-111', 3, 'inequalities', R`The inequality $(x-2)^2<0$ has the solution $x=2$.`, R`The inequality $(x-2)^2\le0$ has no solution.`, 3,
    R`<p>$(x-2)^2<0$ has no real solution (I false). $(x-2)^2\le0$ is satisfied at $x=2$ (II false). Both are false.</p>`,
    'Strict versus non-strict matters when the minimum is exactly zero.'),
  base('qe-112', 2, 'statements', { type: 'mcq', format: 'statements',
    q: R`<p>Consider the statements about real quadratics $ax^2+bx+c$ ($a,b,c$ real):</p><p>(i) $a\ne0$ is needed for it to be quadratic.<br>(ii) $D>0$ gives two distinct real roots.<br>(iii) The sum of the roots is always positive.<br>(iv) If one root is non-real then both roots are non-real.</p><p>How many are correct?</p>`,
    ...place('3', ['2', '1', '4']),
    sol: R`<p>(i) true. (ii) true. (iii) false: $x^2+3x+1$ has sum $-3$. (iv) true (conjugate pairs). Three are correct.</p>`,
    trap: 'The sign of the sum depends on b/a.' }),
  S('qe-113', 3, 'special cases', R`If $a+b+c=0$, then $x=1$ is a root of $ax^2+bx+c=0$.`, R`In that case the other root is $\dfrac ca$.`, 0,
    R`<p>$f(1)=a+b+c=0$. Product of roots $=c/a$, so the other root is $c/a$. Both true.</p>`,
    'Do not forget that c/a might equal 1 (equal roots).'),

  // ---------- match ----------
  MT('qe-114', 2, 'nature of roots', 'm1', 'Match List I with List II.', 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
    R`<p>$D$ for each: A: $36-36=0$ (equal). B: $36-40=-4<0$ (non-real). C: $36-20=16$, perfect square (rational: roots 1, 5). D: $36-8=28$, positive non-square (irrational: $3\pm\sqrt7$).</p>`,
    'Perfect-square discriminant means rational roots.'),
  MT('qe-115', 3, 'symmetric functions', 'm2', 'Match List I with List II.', 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    R`<p>$s=5$, $p=6$. A: $5$. B: $6$. C: $s^2-2p=25-12=13$. D: $s^3-3ps=125-90=35$.</p>`,
    'Use the formulas; the roots 2 and 3 are just a check.'),
  MT('qe-116', 3, 'finding constants', 'm3', 'Match List I with List II.', 'A-r, B-q, C-s, D-p', ['A-q, B-r, C-s, D-p', 'A-r, B-q, C-p, D-s', 'A-r, B-s, C-q, D-p'],
    R`<p>A: $D=16-4k=0\Rightarrow k=4$. B: $(\alpha-\beta)^2=16-4k=4\Rightarrow k=3$. C: $x=5$: $25-20+k=0\Rightarrow k=-5$. D: product $=k=1$.</p>`,
    'Reciprocal roots means product 1, not sum 0.'),
  MT('qe-117', 2, 'inequalities', 'm4', 'Match List I with List II.', 'A-p, B-s, C-r, D-q', ['A-p, B-q, C-r, D-s', 'A-q, B-s, C-r, D-p', 'A-p, B-s, C-q, D-r'],
    R`<p>A: between the roots, strict: $(1,2)$. B: outside the roots including them: $(-\infty,1]\cup[2,\infty)$. C: between the roots including them: $[1,2]$. D: $\dfrac{x-1}{x-2}>0$ means $x<1$ or $x>2$, and $x=1$ gives 0 and $x=2$ is not allowed: $(-\infty,1)\cup(2,\infty)$.</p>`,
    'A fraction cannot include its pole, even when ≥ would include the zero.'),

  // ---------- passages ----------
  P('qe-118', 2, 'nature of roots', 'p1', R`The values of $k$ for which $f(x)=0$ has real roots are`, R`$k\le-1$ or $k\ge2$`, [R`$-1\le k\le2$`, R`$k<-1$ or $k>2$`, R`$k\le-2$ or $k\ge1$`],
    R`<p>$D/4=k^2-(k+2)=k^2-k-2=(k-2)(k+1)\ge0$, so $k\le-1$ or $k\ge2$.</p>`,
    'D ≥ 0 allows equal roots.'),
  PI('qe-119', 4, 'location of roots', 'p1', R`How many integer values of $k$ make both roots of $f(x)=0$ lie in $(0,3)$?`, 1,
    R`<p>From the earlier analysis, both roots are in $(0,3)$ exactly when $2\le k<\tfrac{11}5$. The only integer is $k=2$ (double root 2).</p>`,
    'The interval is tiny: 2 ≤ k < 2.2.'),
  PI('qe-120', 3, 'location of roots', 'p1', R`Find the least integer $k$ for which the number 1 lies strictly between the roots of $f(x)=0$.`, 4,
    R`<p>$f(1)=3-k<0\Rightarrow k>3$. The least integer is 4. (Check: $k=4$: $x^2-8x+6$, roots $4\pm\sqrt{10}\approx0.84,\,7.16$.)</p>`,
    'Strict inequality: k = 3 puts a root at 1.'),
  P('qe-121', 2, 'parabola', 'p2', R`The roots of $f(x)=0$ are`, R`$2\pm\sqrt3$`, [R`$2\pm\sqrt2$`, R`$-2\pm\sqrt3$`, R`$3\pm\sqrt2$`],
    R`<p>$f(x)=a(x-2)^2-3$. $f(0)=4a-3=1\Rightarrow a=1$. So $f(x)=x^2-4x+1$. Roots: $2\pm\sqrt3$.</p>`,
    'Write the vertex form first.'),
  PI('qe-122', 3, 'parabola', 'p2', R`How many integers $x$ satisfy $f(x)<0$?`, 3,
    R`<p>$f<0$ between the roots $2-\sqrt3\approx0.27$ and $2+\sqrt3\approx3.73$. Integers $1,2,3$.</p>`,
    'The roots themselves are not integers.'),
  PI('qe-123', 3, 'parabola', 'p2', R`Find the greatest value of $f(x)$ for $3\le x\le6$.`, 13,
    R`<p>The vertex $x=2$ is left of the interval, so $f$ increases on $[3,6]$. Greatest $=f(6)=36-24+1=13$.</p>`,
    'The minimum −3 occurs outside the interval.'),
];

const CACHE = {};
const poly = (a, b, c) => {
  let s = a === 1 ? 'x^2' : a === -1 ? '-x^2' : `${a}x^2`;
  if (b) s += (b > 0 ? '+' : '-') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'x';
  if (c) s += (c > 0 ? '+' : '-') + Math.abs(c);
  return s;
};
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const csqrt = (d) => (d >= 0 ? [Math.sqrt(d), 0] : [0, Math.sqrt(-d)]);

const gens = [
  {
    id: 'qe-g01', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'symmetric functions',
    make(rng) {
      const s = int(rng, -9, 9), p = int(rng, -9, 12);
      const answer = s * s - 2 * p;
      return { s, p, answer, tol: 0,
        q: R`If $\alpha,\beta$ are the roots of $${poly(1, -s, p)}=0$, find $\alpha^2+\beta^2$.`,
        sol: R`<p>$\alpha+\beta=${s}$ and $\alpha\beta=${p}$.</p><p>$\alpha^2+\beta^2=(\alpha+\beta)^2-2\alpha\beta=${s * s}-${2 * p}=${answer}$.</p>` };
    },
    verify(p) { // numerically with complex roots
      const d = p.s * p.s - 4 * p.p; const [re, im] = csqrt(d);
      const sq = (a, b) => [a * a - b * b, 2 * a * b];
      const a1 = sq((p.s + re) / 2, im / 2), a2 = sq((p.s - re) / 2, -im / 2);
      return Math.round(a1[0] + a2[0]);
    },
  },
  {
    id: 'qe-g02', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'symmetric functions',
    make(rng) {
      const s = int(rng, 1, 7), p = int(rng, -6, 6);
      const answer = s ** 3 - 3 * p * s;
      return { s, p, answer, tol: 0,
        q: R`If $\alpha,\beta$ are the roots of $${poly(1, -s, p)}=0$, find $\alpha^3+\beta^3$.`,
        sol: R`<p>$\alpha^3+\beta^3=(\alpha+\beta)^3-3\alpha\beta(\alpha+\beta)=${s ** 3}-3(${p})(${s})=${answer}$.</p>` };
    },
    verify(p) { const S = [2, p.s]; for (let i = 2; i <= 3; i++) S.push(p.s * S[i - 1] - p.p * S[i - 2]); return S[3]; },
  },
  {
    id: 'qe-g03', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'power sums',
    make(rng) {
      const a = int(rng, 1, 5), b = int(rng, 1, 4), n = int(rng, 5, 7);
      const S = [2, a]; for (let i = 2; i <= n; i++) S.push(a * S[i - 1] + b * S[i - 2]);
      return { a, b, n, answer: S[n], tol: 0,
        q: R`$\alpha,\beta$ are the roots of $x^2-${a === 1 ? '' : a}x-${b === 1 ? '' : b}=0$. Find $\alpha^{${n}}+\beta^{${n}}$.`,
        sol: R`<p>$\alpha^2=${a === 1 ? '' : a}\alpha+${b}$, so $S_k=${a === 1 ? '' : a}S_{k-1}+${b === 1 ? '' : b}S_{k-2}$ with $S_0=2$, $S_1=${a}$.</p><p>The values: ${S.slice(0, n + 1).join(', ')}. So $S_{${n}}=${S[n]}$.</p>` };
    },
    verify(p) { const d = Math.sqrt(p.a * p.a + 4 * p.b); const x = (p.a + d) / 2, y = (p.a - d) / 2; return Math.round(x ** p.n + y ** p.n); },
  },
  {
    id: 'qe-g04', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'symmetric functions',
    make(rng) {
      const a = choose(rng, [1, 2, 3]), r1 = int(rng, -6, 5), r2 = int(rng, r1 + 1, 8);
      const b = -a * (r1 + r2), c = a * r1 * r2;
      const answer = r2 - r1;
      return { a, b, c, answer, tol: 0,
        q: R`If $\alpha,\beta$ are the roots of $${poly(a, b, c)}=0$, find $|\alpha-\beta|$.`,
        sol: R`<p>$(\alpha-\beta)^2=(\alpha+\beta)^2-4\alpha\beta=\dfrac{b^2-4ac}{a^2}=\dfrac{${b * b - 4 * a * c}}{${a * a}}=${answer * answer}$.</p><p>So $|\alpha-\beta|=${answer}$.</p>` };
    },
    verify(p) { return Math.sqrt(p.b * p.b - 4 * p.a * p.c) / p.a; },
  },
  {
    id: 'qe-g05', type: 'mcq', format: 'single', level: 2, exams: EXS[2], sub: 'transformed roots',
    make(rng) {
      const r1 = int(rng, -4, 6), r2 = int(rng, -4, 6), k = choose(rng, [-3, -2, 1, 2, 3]);
      const b = -(r1 + r2), c = r1 * r2;
      const nb = -(r1 + r2 + 2 * k), nc = (r1 + k) * (r2 + k);
      const ok = `$${poly(1, nb, nc)}=0$`;
      const wr = [`$${poly(1, -(r1 + r2) + 2 * k, (r1 - k) * (r2 - k))}=0$`, `$${poly(1, nb, c + k)}=0$`, `$${poly(1, b, nc)}=0$`];
      const { options, answer } = shuffleOpts(rng, ok, wr);
      return { r1, r2, k, nb, nc, options, answer,
        q: R`If $\alpha,\beta$ are the roots of $${poly(1, b, c)}=0$, the equation whose roots are $\alpha${k < 0 ? '-' + (-k) : '+' + k}$ and $\beta${k < 0 ? '-' + (-k) : '+' + k}$ is`,
        sol: R`<p>$\alpha+\beta=${-b}$, $\alpha\beta=${c}$. New sum $=${-b}${k < 0 ? '-' : '+'}${2 * Math.abs(k)}=${-nb}$. New product $=\alpha\beta${k < 0 ? '-' : '+'}${Math.abs(k)}(\alpha+\beta)+${k * k}=${nc}$.</p><p>Equation: $${poly(1, nb, nc)}=0$.</p>` };
    },
    verify(p) { return p.options.indexOf(`$${poly(1, -((p.r1 + p.k) + (p.r2 + p.k)), (p.r1 + p.k) * (p.r2 + p.k))}=0$`); },
  },
  {
    id: 'qe-g06', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'nature of roots',
    make(rng) {
      const m = int(rng, 3, 9), N = int(rng, 8, 14);
      const cnt = 2 * (N - Math.floor(2 * Math.sqrt(m))) ; // |k| > 2 sqrt(m)
      let c = 0; for (let k = -N; k <= N; k++) if (k * k > 4 * m) c++;
      return { m, N, answer: c, tol: 0,
        q: R`For how many integers $k$ with $-${N}\le k\le${N}$ does $x^2-kx+${m}=0$ have two distinct real roots?`,
        sol: R`<p>Distinct real roots need $D=k^2-${4 * m}>0$, i.e. $k^2>${4 * m}$, so $|k|>${fmt(2 * Math.sqrt(m), 4)}$.</p><p>Count the integers in $[-${N},${N}]$ with $k^2>${4 * m}$: $${c}$.</p>` };
    },
    verify(p) { let c = 0; for (let k = -p.N; k <= p.N; k++) { const d = k * k - 4 * p.m; if (d > 0) c++; } return c; },
  },
  {
    id: 'qe-g07', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'maximum and minimum',
    make(rng) {
      const h = int(rng, -3, 4), l = int(rng, -5, 3), u = l + int(rng, 3, 8), kmin = int(rng, -6, 5), a = int(rng, 1, 3);
      const f = (x) => a * (x - h) ** 2 + kmin;
      const lo = h >= l && h <= u ? kmin : Math.min(f(l), f(u));
      const hi = Math.max(f(l), f(u));
      const A = a, B = -2 * a * h, C = a * h * h + kmin;
      return { a, h, l, u, kmin, A, B, C, answer: hi - lo, tol: 0,
        q: R`For $f(x)=${poly(A, B, C)}$ on the interval $${l}\le x\le${u}$, find (greatest value) $-$ (least value).`,
        sol: R`<p>$f(x)=${a === 1 ? '' : a}(x-${h})^2+${kmin}$, vertex at $x=${h}$ ${h >= l && h <= u ? 'inside' : 'outside'} the interval.</p><p>$f(${l})=${f(l)}$, $f(${u})=${f(u)}$. Greatest $=${hi}$, least $=${lo}$${h >= l && h <= u ? ' (at the vertex)' : ''}. Difference $=${hi - lo}$.</p>` };
    },
    verify(p) { let mn = 1e9, mx = -1e9; for (let x = p.l; x <= p.u; x += 0.5) { const v = p.A * x * x + p.B * x + p.C; mn = Math.min(mn, v); mx = Math.max(mx, v); } return mx - mn; },
  },
  {
    id: 'qe-g08', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'inequalities',
    make(rng) {
      const r1 = int(rng, -6, 2), r2 = r1 + int(rng, 2, 7), kind = choose(rng, ['<', '\\le', '>', '\\ge']), N = 12;
      const strict = kind === '<' || kind === '>';
      const inside = kind === '<' || kind === '\\le';
      const f = (x) => (x - r1) * (x - r2);
      let c = 0; for (let x = -N; x <= N; x++) if (inside ? (strict ? f(x) < 0 : f(x) <= 0) : (strict ? f(x) > 0 : f(x) >= 0)) c++;
      return { r1, r2, kind, N, answer: c, tol: 0,
        q: R`How many integers $x$ with $-${N}\le x\le${N}$ satisfy $${poly(1, -(r1 + r2), r1 * r2)}${kind}0$?`,
        sol: R`<p>$(x-${r1})(x-${r2})=0$ at $x=${r1}$ and $x=${r2}$. ${inside ? `The product is ${strict ? 'negative' : 'zero or negative'} on ${strict ? 'the open interval between' : 'the closed interval between'} the roots.` : `The product is ${strict ? 'positive' : 'zero or positive'} outside${strict ? '' : ' (and at)'} the roots.`}</p><p>Counting integers in $[-${N},${N}]$: $${c}$.</p>` };
    },
    verify(p) { let c = 0; const f = (x) => (x - p.r1) * (x - p.r2); for (let x = -p.N; x <= p.N; x++) { const v = f(x); const t = { '<': v < 0, '\\le': v <= 0, '>': v > 0, '\\ge': v >= 0 }[p.kind]; if (t) c++; } return c; },
  },
  {
    id: 'qe-g09', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'rational roots',
    make(rng) {
      const S = int(rng, 6, 16);
      let c = 0, ks = [];
      for (let k = 1; 4 * k <= S * S; k++) { const d = S * S - 4 * k; if (Number.isInteger(Math.sqrt(d))) { c++; ks.push(k); } }
      return { S, answer: c, tol: 0,
        q: R`For how many positive integers $k$ does $x^2-${S}x+k=0$ have rational roots?`,
        sol: R`<p>Rational roots need $D=${S * S}-4k$ to be a perfect square (and $\ge0$, so $k\le${Math.floor(S * S / 4)}$).</p><p>The values are $k=${ks.join(', ')}$, so there are $${c}$ such $k$.</p>` };
    },
    verify(p) { let c = 0; for (let k = 1; k <= 200; k++) { const d = p.S * p.S - 4 * k; if (d < 0) break; const r = Math.round(Math.sqrt(d)); if (r * r === d) c++; } return c; },
  },
  {
    id: 'qe-g10', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'common roots',
    make(rng) {
      const r = int(rng, -5, 6), u = int(rng, -6, 7), w = int(rng, -6, 7);
      let uu = u, ww = w; if (uu === r) uu += 1; if (ww === r) ww += 2; if (uu === ww) ww += 3; if (ww === r) ww += 1;
      const b1 = -(r + uu), c1 = r * uu, b2 = -(r + ww), c2 = r * ww;
      return { r, b1, c1, b2, c2, answer: r, tol: 0,
        q: R`The equations $${poly(1, b1, c1)}=0$ and $${poly(1, b2, c2)}=0$ have exactly one root in common. Find it.`,
        sol: R`<p>Subtract the equations: $(${b1}-(${b2}))x+(${c1}-(${c2}))=0$, i.e. $${b1 - b2}x+${c1 - c2}=0$.</p><p>$x=${r}$. Check in the first equation: $${r * r}+(${b1})(${r})+${c1}=0$ ✓.</p>` };
    },
    verify(p) { return (p.c2 - p.c1) / (p.b1 - p.b2); },
  },
  {
    id: 'qe-g11', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'inequalities',
    make(rng) {
      const a = int(rng, -5, 0), b = a + int(rng, 2, 4), c = b + int(rng, 2, 4), N = 10;
      let n = 0; for (let x = -N; x <= N; x++) if ((x - a) * (x - b) * (x - c) < 0) n++;
      const fac = (v) => (v < 0 ? `(x+${-v})` : v === 0 ? 'x' : `(x-${v})`);
      return { a, b, c, N, answer: n, tol: 0,
        q: R`How many integers $x$ in $[-${N},${N}]$ satisfy $${fac(a)}${fac(b)}${fac(c)}<0$?`,
        sol: R`<p>Roots $${a},${b},${c}$. For large $x$ the product is positive; it flips sign at each root. So it is negative for $x<${a}$ and for $${b}<x<${c}$.</p><p>Integers in $[-${N},${a - 1}]$: ${a - 1 + N + 1}. Integers strictly between ${b} and ${c}: ${c - b - 1}. Total $${n}$.</p>` };
    },
    verify(p) { let n = 0; for (let x = -p.N; x <= p.N; x++) if ((x - p.a) * (x - p.b) * (x - p.c) < 0) n++; return n; },
  },
  {
    id: 'qe-g12', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'location of roots',
    make(rng) {
      // both roots of x^2 - 2kx + (k*t + s) greater than c ... answer: least integer k
      let t, s, c, ans = null;
      for (let tries = 0; tries < 50 && ans === null; tries++) {
        t = int(rng, 1, 3); s = int(rng, 1, 6); c = int(rng, 0, 2);
        const good0 = (k) => { const D = 4 * k * k - 4 * (k * t + s); const fc = c * c - 2 * k * c + k * t + s; return D >= 0 && fc > 0 && k > c; };
        for (let k = -40; k <= 40; k++) if (good0(k)) { ans = k; break; }
      }
      if (ans === null) { t = 1; s = 1; c = 0; ans = 2; }
      const good = (k) => { const D = 4 * k * k - 4 * (k * t + s); const fc = c * c - 2 * k * c + k * t + s; return D >= 0 && fc > 0 && k > c; };
      void good;
      return { t, s, c, answer: ans, tol: 0,
        q: R`Find the least integer $k$ for which both roots of $x^2-2kx+${t === 1 ? '' : t}k+${s}=0$ are greater than $${c}$.`,
        sol: R`<p>Conditions: $D\ge0$: $k^2-${t}k-${s}\ge0$. $f(${c})>0$: $${c * c}-${2 * c}k+${t}k+${s}>0$. Vertex: $k>${c}$.</p><p>Testing integers upward from ${c}, the first one meeting all three is $k=${ans}$.</p>` };
    },
    verify(p) {
      for (let k = -40; k <= 40; k++) {
        const D = 4 * k * k - 4 * (k * p.t + p.s); if (D < 0) continue;
        const r1 = (2 * k - Math.sqrt(D)) / 2;
        if (r1 > p.c + 1e-9) return k;
      }
      return NaN;
    },
  },
  {
    id: 'qe-g13', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'maximum and minimum',
    make(rng) {
      const h = int(rng, -5, 6), k = int(rng, -9, 9), a = choose(rng, [1, 2, 3, -1, -2, -3]);
      const A = a, B = -2 * a * h, C = a * h * h + k;
      return { A, B, C, h, answer: k, tol: 0,
        q: R`Find the ${a > 0 ? 'minimum' : 'maximum'} value of $${poly(A, B, C)}$.`,
        sol: R`<p>The vertex is at $x=-\dfrac b{2a}=${h}$.</p><p>Value there: $${A}(${h})^2+(${B})(${h})+(${C})=${k}$.</p>` };
    },
    verify(p) { let best = null; for (let x = -20; x <= 20; x += 0.5) { const v = p.A * x * x + p.B * x + p.C; best = best === null ? v : (p.A > 0 ? Math.min(best, v) : Math.max(best, v)); } return best; },
  },
  {
    id: 'qe-g14', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'modulus equations',
    make(rng) {
      const r1 = int(rng, -3, 2), r2 = r1 + int(rng, 2, 5), d = int(rng, 1, 6);
      const L = (r2 - r1) ** 2; // D of f = d is L+4d>0 : 2 roots ; f=-d : L-4d
      const D2 = L - 4 * d;
      const ans = 2 + (D2 > 0 ? 2 : D2 === 0 ? 1 : 0);
      return { r1, r2, d, answer: ans, tol: 0,
        q: R`How many real solutions does $\big|${poly(1, -(r1 + r2), r1 * r2)}\big|=${d}$ have?`,
        sol: R`<p>Case $f(x)=${d}$: $D=${L}+${4 * d}=${L + 4 * d}>0$, so 2 solutions.</p><p>Case $f(x)=-${d}$: $D=${L}-${4 * d}=${D2}$, giving ${D2 > 0 ? '2' : D2 === 0 ? '1 (double root)' : '0'} solution(s). The two cases cannot share a solution.</p><p>Total $=${ans}$.</p>` };
    },
    verify(p) {
      const f = (x) => Math.abs((x - p.r1) * (x - p.r2)) - p.d; let c = 0; const h = 1e-4;
      for (let x = -30; x < 30; x += h) { if (f(x) * f(x + h) < 0) c++; }
      const v = (p.r1 + p.r2) / 2; if (Math.abs(f(v)) < 1e-9) c++; // tangent touch at the vertex of the flipped branch
      return c;
    },
  },
];

export default { topic: 'quadratic-equations', groups, items, gens };
