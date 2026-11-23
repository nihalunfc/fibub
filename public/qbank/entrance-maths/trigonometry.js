// Trigonometric functions and identities (Plus Two entrance, Mathematics). Original fibub questions.
import { pick, int, choose, fmt, shuffleOpts } from '../_entrance.js';
import { tidyGens } from '../_util.js';

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
const PN = (id, level, sub, group, q, answer, tol, sol, trap) =>
  base(id, level, sub, { type: 'nat', format: 'passage', group, q, answer, tol, sol, trap });

const groups = {
  m1: {
    title: 'Exact values',
    passage: R`<p>Match each value in List I with its number in List II.</p>`,
    list1: ['A. $\\sin150^\\circ$', 'B. $\\cos120^\\circ$', 'C. $\\tan135^\\circ$', 'D. $\\sec60^\\circ$'],
    list2: ['p. $2$', 'q. $-\\tfrac12$', 'r. $-1$', 's. $\\tfrac12$'],
  },
  m2: {
    title: 'Periods',
    passage: R`<p>Match each function in List I with its (smallest positive) period in List II.</p>`,
    list1: ['A. $\\sin2x$', 'B. $\\tan3x$', 'C. $|\\sin2x|$', 'D. $\\sin x+\\cos2x$'],
    list2: ['p. $\\pi/3$', 'q. $\\pi$', 'r. $2\\pi$', 's. $\\pi/2$'],
  },
  m3: {
    title: 'Greatest and least values',
    passage: R`<p>Match each quantity in List I with its value in List II (all over real $x$).</p>`,
    list1: ['A. greatest value of $3\\sin x+4\\cos x$', 'B. least value of $2-\\sin x$', 'C. greatest value of $\\sin x\\cos x$', 'D. least value of $\\sec^2x+\\operatorname{cosec}^2x$'],
    list2: ['p. $5$', 'q. $1$', 'r. $\\tfrac12$', 's. $4$'],
  },
  m4: {
    title: 'Identities in a triangle',
    passage: R`<p>$A,B,C$ are the angles of a triangle. Match each expression in List I with its value in List II.</p>`,
    list1: ['A. $\\cos^2A+\\cos^2B+\\cos^2C+2\\cos A\\cos B\\cos C$', 'B. $\\sin^2A+\\sin^2B+\\sin^2C-2\\cos A\\cos B\\cos C$', 'C. $\\dfrac{\\sin2A+\\sin2B+\\sin2C}{\\sin A\\sin B\\sin C}$', 'D. $\\cos2A+\\cos2B+\\cos2C+4\\cos A\\cos B\\cos C$'],
    list2: ['p. $1$', 'q. $2$', 'r. $4$', 's. $-1$'],
  },
  p1: {
    title: 'Passage: a triangle from two tangents',
    passage: R`<p>In a triangle $ABC$, $\tan A=\tfrac12$ and $\tan B=\tfrac13$. Use $A+B+C=\pi$.</p>`,
  },
  p2: {
    title: 'Passage: one wave, three questions',
    passage: R`<p>Let $f(x)=3\sin x+4\cos x$. Write it as $f(x)=R\sin(x+\alpha)$ with $R>0$ and $\alpha$ acute.</p>`,
  },
};

const items = [
  // ---------- L1 warm-up ----------
  M('tr-001', 1, 'exact values', R`The value of $\sin150^\circ$ is`, R`$\tfrac12$`, [R`$-\tfrac12$`, R`$\tfrac{\sqrt3}2$`, R`$-\tfrac{\sqrt3}2$`],
    R`<p>$150^\circ=180^\circ-30^\circ$, so $\sin150^\circ=\sin30^\circ=\tfrac12$ (sine is positive in the second quadrant).</p>`,
    'Do not change the ratio to cosine: 180° − θ keeps the same function.'),
  M('tr-002', 1, 'radian measure', R`$\dfrac{5\pi}{6}$ radians is equal to`, '150°', ['120°', '135°', '300°'],
    R`<p>Multiply by $\dfrac{180^\circ}{\pi}$: $\dfrac{5\pi}6\times\dfrac{180}{\pi}=150^\circ$.</p>`,
    'π radians = 180°, so π/6 is 30°, and five of them make 150°.'),
  M('tr-003', 1, 'exact values', R`The value of $\tan225^\circ$ is`, '1', ['-1', '0', R`$\sqrt3$`],
    R`<p>$225^\circ=180^\circ+45^\circ$. Tangent has period $180^\circ$, so $\tan225^\circ=\tan45^\circ=1$.</p>`,
    'Tangent is positive in the third quadrant.'),
  M('tr-004', 1, 'ratios', R`If $\sin\theta=\tfrac35$ and $\theta$ is acute, then $\cos\theta$ is`, R`$\tfrac45$`, [R`$\tfrac43$`, R`$\tfrac54$`, R`$\tfrac35$`],
    R`<p>$\cos^2\theta=1-\tfrac9{25}=\tfrac{16}{25}$. For an acute angle $\cos\theta>0$, so $\cos\theta=\tfrac45$.</p>`,
    '4/3 is tan θ, not cos θ.'),
  M('tr-005', 1, 'period', R`The period of $\sin3x$ is`, R`$\dfrac{2\pi}3$`, [R`$6\pi$`, R`$\dfrac\pi3$`, R`$2\pi$`],
    R`<p>$\sin(kx)$ has period $\dfrac{2\pi}{|k|}$. With $k=3$ the period is $\dfrac{2\pi}3$.</p>`,
    'Multiplying x by 3 squeezes the wave; it does not stretch it.'),
  M('tr-006', 1, 'compound angles', R`The value of $\sin15^\circ$ is`, R`$\dfrac{\sqrt6-\sqrt2}4$`, [R`$\dfrac{\sqrt6+\sqrt2}4$`, R`$\dfrac{\sqrt3-1}2$`, R`$\dfrac{\sqrt3+1}{4}$`],
    R`<p>$\sin(45^\circ-30^\circ)=\sin45^\circ\cos30^\circ-\cos45^\circ\sin30^\circ=\dfrac{\sqrt3}{2\sqrt2}-\dfrac1{2\sqrt2}=\dfrac{\sqrt6-\sqrt2}4\approx0.2588$.</p>`,
    '(√6 + √2)/4 is cos 15° (or sin 75°).'),
  M('tr-007', 1, 'radian measure', R`A circle has radius $7$ cm. The arc subtending $60^\circ$ at the centre has length`, R`$\dfrac{7\pi}3$ cm`, [R`$\dfrac{7\pi}6$ cm`, R`$\dfrac{14\pi}3$ cm`, R`$\dfrac{7\pi}{180}$ cm`],
    R`<p>Convert: $60^\circ=\dfrac\pi3$ rad. Arc $=r\theta=7\times\dfrac\pi3=\dfrac{7\pi}3$ cm.</p>`,
    'The formula s = rθ works only when θ is in radians.'),
  M('tr-008', 1, 'multiple angles', R`If $\sin A=\tfrac35$ and $\cos A=\tfrac45$, then $\sin2A$ equals`, R`$\tfrac{24}{25}$`, [R`$\tfrac65$`, R`$\tfrac{12}{25}$`, R`$\tfrac7{25}$`],
    R`<p>$\sin2A=2\sin A\cos A=2\cdot\tfrac35\cdot\tfrac45=\tfrac{24}{25}$. ($\tfrac7{25}$ is $\cos2A$.)</p>`,
    '12/25 forgets the factor 2.'),
  M('tr-009', 1, 'multiple angles', R`Which of the following is <b>not</b> equal to $\cos2\theta$?`, R`$2\sin^2\theta-1$`, [R`$2\cos^2\theta-1$`, R`$1-2\sin^2\theta$`, R`$\cos^2\theta-\sin^2\theta$`],
    R`<p>$\cos2\theta=\cos^2\theta-\sin^2\theta=2\cos^2\theta-1=1-2\sin^2\theta$. The option $2\sin^2\theta-1$ is $-\cos2\theta$.</p>`,
    'Swapping the order 1 − 2sin² to 2sin² − 1 flips the sign.'),
  M('tr-010', 1, 'range', R`The range of $y=3\sin x$ is`, R`$[-3,3]$`, [R`$[0,3]$`, R`$[-1,1]$`, R`$[-3,0]$`],
    R`<p>$-1\le\sin x\le1$, so multiplying by 3 gives $-3\le y\le3$, and every value in between is reached.</p>`,
    'Amplitude 3 stretches the range; it does not change the domain.'),
  I('tr-011', 1, 'exact values', R`Find the value of $8\sin30^\circ\cos60^\circ+4\tan45^\circ$.`, 6,
    R`<p>$8\cdot\tfrac12\cdot\tfrac12=2$ and $4\cdot1=4$. Total $=6$.</p>`,
    'Do not mix the degree values of sin 30° and cos 60°: both are 1/2.'),
  I('tr-012', 1, 'radian measure', R`A wheel makes $3$ complete turns. The angle it turns through is $k\pi$ radians. Find $k$.`, 6,
    R`<p>One turn is $2\pi$ rad. Three turns: $6\pi$ rad, so $k=6$.</p>`,
    'One turn is 2π, not π.'),
  M('tr-013', 1, 'radian measure', R`One degree, written in radians, is`, R`$\dfrac{\pi}{180}$`, [R`$\dfrac{180}{\pi}$`, R`$\dfrac\pi{90}$`, R`$180\pi$`],
    R`<p>$180^\circ=\pi$ rad, so $1^\circ=\dfrac\pi{180}$ rad $\approx0.01745$ rad. ($\dfrac{180}\pi\approx57.3$ is the number of degrees in one radian.)</p>`,
    'Degrees to radians multiplies by π/180; radians to degrees multiplies by 180/π.'),

  // ---------- L2 standard ----------
  I('tr-014', 2, 'products of sines', R`Find the value of $16\sin20^\circ\sin40^\circ\sin60^\circ\sin80^\circ$.`, 3,
    R`<p>Use $\sin\theta\sin(60^\circ-\theta)\sin(60^\circ+\theta)=\tfrac14\sin3\theta$ with $\theta=20^\circ$: $\sin20^\circ\sin40^\circ\sin80^\circ=\tfrac14\sin60^\circ=\tfrac{\sqrt3}8$.</p><p>Then $16\times\tfrac{\sqrt3}8\times\tfrac{\sqrt3}2=16\times\tfrac{3}{16}=3$, because $\sin60^\circ=\tfrac{\sqrt3}2$ and $\sqrt3\cdot\sqrt3=3$.</p>`,
    'Keep track of √3 × √3 = 3.'),
  M('tr-015', 2, 'products of cosines', R`The value of $\cos20^\circ\cos40^\circ\cos80^\circ$ is`, R`$\tfrac18$`, [R`$\tfrac1{16}$`, R`$\tfrac38$`, R`$\tfrac{\sqrt3}8$`],
    R`<p>Multiply and divide by $\sin20^\circ$: $\dfrac{(2\sin20^\circ\cos20^\circ)\cos40^\circ\cos80^\circ}{2\sin20^\circ}=\dfrac{\sin40^\circ\cos40^\circ\cos80^\circ}{2\sin20^\circ}=\dfrac{\sin80^\circ\cos80^\circ}{4\sin20^\circ}=\dfrac{\sin160^\circ}{8\sin20^\circ}=\tfrac18$, because $\sin160^\circ=\sin20^\circ$.</p>`,
    'The last step uses sin(180° − 20°) = sin 20°.'),
  M('tr-016', 2, 'compound angles', R`$\tan75^\circ$ equals`, R`$2+\sqrt3$`, [R`$2-\sqrt3$`, R`$\sqrt3-1$`, R`$\dfrac{1}{\sqrt3}$`],
    R`<p>$\tan(45^\circ+30^\circ)=\dfrac{1+\tfrac1{\sqrt3}}{1-\tfrac1{\sqrt3}}=\dfrac{\sqrt3+1}{\sqrt3-1}=\dfrac{(\sqrt3+1)^2}{2}=2+\sqrt3\approx3.73$.</p>`,
    '2 − √3 is tan 15°, the reciprocal.'),
  M('tr-017', 2, 'transformation formulae', R`$\sin75^\circ+\sin15^\circ$ equals`, R`$\dfrac{\sqrt6}2$`, [R`$\dfrac{\sqrt2}2$`, R`$\dfrac{\sqrt3}2$`, R`$\dfrac{\sqrt6}4$`],
    R`<p>$\sin C+\sin D=2\sin\dfrac{C+D}2\cos\dfrac{C-D}2=2\sin45^\circ\cos30^\circ=2\cdot\dfrac1{\sqrt2}\cdot\dfrac{\sqrt3}2=\dfrac{\sqrt6}2\approx1.2247$.</p>`,
    'Check with the numbers: 0.966 + 0.259 = 1.225.'),
  M('tr-018', 2, 'max and min', R`The least value of $3\sin x+4\cos x+7$ is`, '2', ['-5', '12', '0'],
    R`<p>$3\sin x+4\cos x$ ranges over $[-5,5]$ since $\sqrt{3^2+4^2}=5$. Adding 7: least value $=-5+7=2$.</p>`,
    '−5 is the least value of the trigonometric part alone; the 7 shifts the whole range.'),
  I('tr-019', 2, 'compound angles', R`Acute angles $A,B$ satisfy $\tan A=\tfrac12$ and $\tan B=\tfrac13$. Find $A+B$ in degrees.`, 45,
    R`<p>$\tan(A+B)=\dfrac{\tfrac12+\tfrac13}{1-\tfrac16}=\dfrac{5/6}{5/6}=1$. Both angles are acute, so $0<A+B<180^\circ$ and the only angle with tangent 1 is $45^\circ$.</p>`,
    'tan = 1 also at 225°, but the angles being acute rules that out.'),
  M('tr-020', 2, 'multiple angles', R`If $\sin\theta=\tfrac13$, then $\sin3\theta$ equals`, R`$\tfrac{23}{27}$`, [R`$\tfrac{31}{27}$`, R`$\tfrac5{27}$`, R`$1$`],
    R`<p>$\sin3\theta=3\sin\theta-4\sin^3\theta=1-\tfrac4{27}=\tfrac{23}{27}$.</p>`,
    '31/27 comes from a wrong sign, and it is more than 1, so it cannot be a sine.'),
  M('tr-021', 2, 'multiple angles', R`If $\tan\theta=2$, then $\cos2\theta$ equals`, R`$-\tfrac35$`, [R`$\tfrac35$`, R`$-\tfrac45$`, R`$\tfrac53$`],
    R`<p>$\cos2\theta=\dfrac{1-\tan^2\theta}{1+\tan^2\theta}=\dfrac{1-4}{1+4}=-\tfrac35$. ($\tfrac45$ in size is $\sin2\theta$.)</p>`,
    'The numerator is 1 − tan², so the answer is negative for tan θ > 1.'),
  M('tr-022', 2, 'multiple angles', R`If $\tan\theta+\cot\theta=4$, then $\sin2\theta$ equals`, R`$\tfrac12$`, [R`$2$`, R`$\tfrac14$`, R`$\tfrac{\sqrt3}2$`],
    R`<p>$\tan\theta+\cot\theta=\dfrac{\sin^2\theta+\cos^2\theta}{\sin\theta\cos\theta}=\dfrac{2}{\sin2\theta}$. So $\sin2\theta=\tfrac24=\tfrac12$.</p>`,
    'tan θ + cot θ = 2/sin 2θ is a worth-memorising shortcut.'),
  N('tr-023', 2, 'special angles', R`Using $\sin18^\circ=\dfrac{\sqrt5-1}4$, evaluate $\sin18^\circ$ to three decimal places.`, 0.309, 0.001,
    R`<p>$\sqrt5\approx2.2361$, so $\dfrac{2.2361-1}4=0.3090$.</p>`,
    'Subtract 1 before dividing by 4.'),
  M('tr-024', 2, 'period', R`The period of $\sin^2x$ is`, R`$\pi$`, [R`$2\pi$`, R`$\dfrac\pi2$`, R`$4\pi$`],
    R`<p>$\sin^2x=\dfrac{1-\cos2x}2$. The term $\cos2x$ has period $\pi$, so $\sin^2x$ has period $\pi$.</p>`,
    'Squaring a sine halves the period, because the sign no longer matters.'),
  M('tr-025', 2, 'graphs', R`The graph of $y=2\sin\left(3x-\dfrac\pi2\right)$ has period and phase shift`, R`period $\dfrac{2\pi}3$, shifted $\dfrac\pi6$ to the right`, [R`period $\dfrac{2\pi}3$, shifted $\dfrac\pi2$ to the right`, R`period $6\pi$, shifted $\dfrac\pi6$ to the left`, R`period $\dfrac{2\pi}3$, shifted $\dfrac\pi6$ to the left`],
    R`<p>Factor out 3: $3x-\dfrac\pi2=3\left(x-\dfrac\pi6\right)$. So the period is $\dfrac{2\pi}3$ and the wave is the graph of $2\sin3x$ moved $\dfrac\pi6$ to the right.</p>`,
    'The shift is the constant divided by the coefficient of x.'),
  M('tr-026', 2, 'allied angles', R`$\sin(270^\circ-\theta)\cos(90^\circ+\theta)$ equals`, R`$\sin\theta\cos\theta$`, [R`$-\sin\theta\cos\theta$`, R`$\cos^2\theta$`, R`$-\sin^2\theta$`],
    R`<p>$\sin(270^\circ-\theta)=-\cos\theta$ and $\cos(90^\circ+\theta)=-\sin\theta$. Product $=(-\cos\theta)(-\sin\theta)=\sin\theta\cos\theta$.</p>`,
    '270° changes sine to cosine (odd multiple of 90°); the sign comes from the quadrant of the original angle.'),
  M('tr-027', 2, 'radian measure', R`At exactly 4:30, the angle between the hour hand and the minute hand is`, R`$\dfrac\pi4$`, [R`$\dfrac\pi6$`, R`$\dfrac\pi3$`, R`$\dfrac\pi2$`],
    R`<p>Minute hand at 6: $180^\circ$. Hour hand: $4\times30^\circ+\tfrac{30}{60}\times30^\circ=135^\circ$. Difference $45^\circ=\dfrac\pi4$.</p>`,
    'The hour hand has moved half way from 4 to 5; it is not on the 4.'),
  N('tr-028', 2, 'radian measure', R`A pendulum of length $40$ cm swings through a total angle of $36^\circ$. Find the length of the arc traced by the bob, in cm (use $\pi=3.1416$).`, 25.13, 0.05,
    R`<p>$36^\circ=\dfrac{\pi}5$ rad. Arc $=r\theta=40\times\dfrac{\pi}5=8\pi\approx25.13$ cm.</p>`,
    'Convert 36° to radians first.'),
  I('tr-029', 2, 'products', R`Find the value of $\tan1^\circ\tan2^\circ\tan3^\circ\cdots\tan89^\circ$.`, 1,
    R`<p>Pair $\tan k^\circ$ with $\tan(90^\circ-k)^\circ=\cot k^\circ$: each pair multiplies to 1. The middle term is $\tan45^\circ=1$. So the product is 1.</p>`,
    'The hidden pairing is 1° with 89°, 2° with 88°, and so on.'),
  M('tr-030', 2, 'transformation formulae', R`$\dfrac{\sin5x-\sin3x}{\cos5x+\cos3x}$ equals`, R`$\tan x$`, [R`$\tan4x$`, R`$\cot x$`, R`$\tan2x$`],
    R`<p>Numerator: $2\cos4x\sin x$. Denominator: $2\cos4x\cos x$. The ratio is $\tan x$.</p>`,
    'Cancel the common 2cos 4x, not the angle 4x itself.'),
  N('tr-031', 2, 'transformation formulae', R`Evaluate $2\sin75^\circ\cos15^\circ$ to three decimals.`, 1.866, 0.002,
    R`<p>$2\sin A\cos B=\sin(A+B)+\sin(A-B)=\sin90^\circ+\sin60^\circ=1+0.8660=1.866$.</p>`,
    'Use A + B and A − B, not A and B.'),
  I('tr-032', 2, 'identities', R`Find $\cos^2\dfrac\pi8+\cos^2\dfrac{3\pi}8+\cos^2\dfrac{5\pi}8+\cos^2\dfrac{7\pi}8$.`, 2,
    R`<p>$\cos\dfrac{7\pi}8=-\cos\dfrac\pi8$ and $\cos\dfrac{5\pi}8=-\cos\dfrac{3\pi}8$, so the sum is $2\left(\cos^2\dfrac\pi8+\cos^2\dfrac{3\pi}8\right)$. Since $\cos\dfrac{3\pi}8=\sin\dfrac\pi8$, the bracket is 1. Answer 2.</p>`,
    'Squares hide the sign changes of the second-quadrant angles.'),
  M('tr-033', 2, 'identities', R`$\sin^275^\circ-\sin^215^\circ$ equals`, R`$\dfrac{\sqrt3}2$`, [R`$\dfrac12$`, R`$1$`, R`$\dfrac{\sqrt3}4$`],
    R`<p>$\sin^2A-\sin^2B=\sin(A+B)\sin(A-B)=\sin90^\circ\sin60^\circ=\dfrac{\sqrt3}2$. Check: $\sin^215^\circ=\cos^275^\circ$, so the expression is $\cos150^\circ$ in absolute size, again $\tfrac{\sqrt3}2$.</p>`,
    'sin²A − sin²B = sin(A+B) sin(A−B) is quicker than computing each square.'),
  M('tr-034', 2, 'quadrants', R`If $\cos\theta=-\tfrac5{13}$ and $\theta$ lies in the third quadrant, then $\sin\theta$ is`, R`$-\tfrac{12}{13}$`, [R`$\tfrac{12}{13}$`, R`$-\tfrac5{12}$`, R`$-\tfrac{13}{12}$`],
    R`<p>$\sin^2\theta=1-\tfrac{25}{169}=\tfrac{144}{169}$. In the third quadrant sine is negative: $\sin\theta=-\tfrac{12}{13}$.</p>`,
    'The quadrant decides the sign; the identity only gives the size.'),
  M('tr-035', 2, 'ratios', R`If $\tan\theta=\tfrac12$, then $\dfrac{\sin\theta+\cos\theta}{\sin\theta-\cos\theta}$ equals`, '-3', ['3', R`$-\tfrac13$`, R`$\tfrac13$`],
    R`<p>Divide top and bottom by $\cos\theta$: $\dfrac{\tan\theta+1}{\tan\theta-1}=\dfrac{1.5}{-0.5}=-3$.</p>`,
    'Dividing by cos θ turns everything into tan θ; do not try to find θ.'),

  // ---------- L3 exam ----------
  M('tr-036', 3, 'products of sines', R`The value of $\sin10^\circ\sin50^\circ\sin70^\circ$ is`, R`$\tfrac18$`, [R`$\tfrac14$`, R`$\tfrac{\sqrt3}8$`, R`$\tfrac1{16}$`],
    R`<p>$\sin10^\circ\sin50^\circ\sin70^\circ=\sin10^\circ\sin(60^\circ-10^\circ)\sin(60^\circ+10^\circ)=\tfrac14\sin30^\circ=\tfrac18$.</p>`,
    'The identity needs the angles in the form θ, 60° − θ, 60° + θ.'),
  M('tr-037', 3, 'products of tangents', R`The value of $\tan20^\circ\tan40^\circ\tan80^\circ$ is`, R`$\sqrt3$`, [R`$\dfrac1{\sqrt3}$`, R`$1$`, R`$\dfrac{\sqrt3}8$`],
    R`<p>$\tan\theta\tan(60^\circ-\theta)\tan(60^\circ+\theta)=\tan3\theta$. With $\theta=20^\circ$ the angles are $20^\circ,40^\circ,80^\circ$, so the product is $\tan60^\circ=\sqrt3$.</p>`,
    'Unlike the sine product, the tangent product has no 1/4.'),
  N('tr-038', 3, 'sums of squares', R`Find $\sin^25^\circ+\sin^210^\circ+\sin^215^\circ+\cdots+\sin^290^\circ$ (18 terms).`, 9.5, 0.01,
    R`<p>Pair $\sin^2x$ with $\sin^2(90^\circ-x)=\cos^2x$: each pair gives 1. The terms $5^\circ,\dots,85^\circ$ are 17 terms: 8 pairs (5 with 85, ..., 40 with 50) and the middle $\sin^245^\circ=\tfrac12$. Then add $\sin^290^\circ=1$.</p><p>Total $=8+\tfrac12+1=9.5$.</p>`,
    'Count the terms carefully: 90° is a separate last term.'),
  I('tr-039', 3, 'sums of cosines', R`Find $\cos1^\circ+\cos2^\circ+\cos3^\circ+\cdots+\cos180^\circ$.`, -1,
    R`<p>$\cos(180^\circ-k^\circ)=-\cos k^\circ$, so $\cos1^\circ+\cos179^\circ=0$, and so on up to $\cos89^\circ+\cos91^\circ=0$. What is left is $\cos90^\circ+\cos180^\circ=0+(-1)=-1$.</p>`,
    'cos 180° has no partner: it stays as −1.'),
  I('tr-040', 3, 'max and min', R`Find the least value of $\sec^2x+\operatorname{cosec}^2x$.`, 4,
    R`<p>$\sec^2x+\operatorname{cosec}^2x=\dfrac{1}{\sin^2x\cos^2x}=\dfrac4{\sin^22x}\ge4$, with equality at $x=45^\circ$.</p>`,
    'The maximum of sin² 2x is 1, which makes the sum least.'),
  I('tr-041', 3, 'max and min', R`Find the least value of $9\tan^2x+4\cot^2x$.`, 12,
    R`<p>By AM-GM, $9\tan^2x+4\cot^2x\ge2\sqrt{9\tan^2x\cdot4\cot^2x}=2\sqrt{36}=12$. Equality when $9\tan^2x=4\cot^2x$, i.e. $\tan^4x=\tfrac49$, which has a real solution.</p>`,
    'AM-GM works only if the two terms can actually be equal.'),
  M('tr-042', 3, 'conditional identities', R`In an equilateral triangle $ABC$, the value of $\sin2A+\sin2B+\sin2C$ is`, R`$\dfrac{3\sqrt3}2$`, [R`$\dfrac{3\sqrt3}4$`, R`$\dfrac{3}{2}$`, R`$0$`],
    R`<p>For $A+B+C=\pi$, $\sin2A+\sin2B+\sin2C=4\sin A\sin B\sin C=4\left(\dfrac{\sqrt3}2\right)^3=\dfrac{3\sqrt3}2$. Direct check: $3\sin120^\circ=\dfrac{3\sqrt3}2$.</p>`,
    '2A = 120° for each angle, not 60°.'),
  M('tr-043', 3, 'ratios', R`If $\sec\theta+\tan\theta=2$, then $\sin\theta$ equals`, R`$\tfrac35$`, [R`$\tfrac34$`, R`$\tfrac45$`, R`$\tfrac12$`],
    R`<p>$(\sec\theta+\tan\theta)(\sec\theta-\tan\theta)=1$, so $\sec\theta-\tan\theta=\tfrac12$. Adding and subtracting: $\sec\theta=\tfrac54$ and $\tan\theta=\tfrac34$. Then $\sin\theta=\tan\theta\cos\theta=\tfrac34\cdot\tfrac45=\tfrac35$.</p>`,
    '3/4 is tan θ, which is the value just before the final step.'),
  M('tr-044', 3, 'ratios', R`If $\sin\theta+\cos\theta=\tfrac12$, then $\sin2\theta$ equals`, R`$-\tfrac34$`, [R`$\tfrac34$`, R`$-\tfrac14$`, R`$\tfrac14$`],
    R`<p>Square: $1+\sin2\theta=\tfrac14$, so $\sin2\theta=-\tfrac34$.</p>`,
    'The square gives 1 + sin 2θ, not 1 − sin 2θ.'),
  I('tr-045', 3, 'mixed', R`If $\tan A$ and $\tan B$ are the roots of $x^2-4x+3=0$, find $\tan(A+B)$.`, -2,
    R`<p>Roots: $\tan A+\tan B=4$ and $\tan A\tan B=3$. $\tan(A+B)=\dfrac{4}{1-3}=-2$.</p>`,
    'The denominator is 1 − product, which is negative here.', { sub: 'mixed' }),
  M('tr-046', 3, 'hidden condition', R`If $\sin x+\operatorname{cosec}x=2$, then $\sin^{2024}x+\operatorname{cosec}^{2024}x$ equals`, '2', [R`$2^{2024}$`, '0', '1'],
    R`<p>For real $x$, $|\sin x+\operatorname{cosec}x|\ge2$ with equality only when $\sin x=1$. So $\sin x=\operatorname{cosec}x=1$ and the sum is $1+1=2$.</p>`,
    'The condition fixes sin x = 1, so any power gives the same value.'),
  M('tr-047', 3, 'special angles', R`$\cos36^\circ\cos72^\circ$ equals`, R`$\tfrac14$`, [R`$\tfrac12$`, R`$\tfrac18$`, R`$\tfrac{\sqrt5}4$`],
    R`<p>$\cos36^\circ\cos72^\circ=\dfrac{2\sin36^\circ\cos36^\circ\cos72^\circ}{2\sin36^\circ}=\dfrac{\sin72^\circ\cos72^\circ}{2\sin36^\circ}=\dfrac{\sin144^\circ}{4\sin36^\circ}=\tfrac14$, since $\sin144^\circ=\sin36^\circ$.</p>`,
    'Use the doubling chain 36°, 72°, 144°, then 180° − 36°.'),
  M('tr-048', 3, 'sum to product', R`$\dfrac{\sin A+\sin3A+\sin5A+\sin7A}{\cos A+\cos3A+\cos5A+\cos7A}$ equals`, R`$\tan4A$`, [R`$\tan3A$`, R`$\cot4A$`, R`$\tan8A$`],
    R`<p>Pair the outer and inner terms: $\sin7A+\sin A=2\sin4A\cos3A$, $\sin5A+\sin3A=2\sin4A\cos A$. Cosines: $2\cos4A\cos3A$ and $2\cos4A\cos A$. The ratio is $\dfrac{2\sin4A(\cos3A+\cos A)}{2\cos4A(\cos3A+\cos A)}=\tan4A$.</p>`,
    'Pair terms so that the pairs have the same middle angle.'),
  M('tr-049', 3, 'period', R`The period of $|\sin x|+|\cos x|$ is`, R`$\dfrac\pi2$`, [R`$\pi$`, R`$2\pi$`, R`$\dfrac\pi4$`],
    R`<p>Replace $x$ by $x+\dfrac\pi2$: $|\sin(x+\tfrac\pi2)|+|\cos(x+\tfrac\pi2)|=|\cos x|+|\sin x|$, the same function. Check that nothing smaller works: at $x=0$ the value is 1 and at $x=\pi/4$ it is $\sqrt2$, so $\pi/4$ is not a period. Period $=\dfrac\pi2$.</p>`,
    'Each term alone has period π, but together they repeat twice as fast.'),
  M('tr-050', 3, 'comparing values', R`Which is the greatest: $\sin1$, $\sin2$, $\sin3$ (angles in radians)?`, R`$\sin2$`, [R`$\sin1$`, R`$\sin3$`, 'all are equal'],
    R`<p>$1,2,3$ rad are about $57^\circ,115^\circ,172^\circ$. Sine rises to $90^\circ\ (\approx1.57$ rad) then falls. $\sin2=\sin(\pi-2)=\sin1.14\approx0.909$; $\sin1\approx0.841$; $\sin3=\sin(0.14)\approx0.141$. So $\sin2$ is greatest.</p>`,
    'These are radians. Reading them as degrees makes sin 3 the largest, which is wrong.'),
  I('tr-051', 3, 'sums of cosines', R`Evaluate $\cos0.7+\cos\left(0.7+\dfrac{2\pi}3\right)+\cos\left(0.7+\dfrac{4\pi}3\right)$.`, 0,
    R`<p>The three angles are spaced $120^\circ$ apart. Three vectors of equal length at $120^\circ$ add up to zero, so both the cosine sum and the sine sum are 0. In algebra: $\cos\left(\theta+\tfrac{2\pi}3\right)+\cos\left(\theta+\tfrac{4\pi}3\right)=2\cos(\theta+\pi)\cos\tfrac\pi3=-\cos\theta$.</p>`,
    'The value 0.7 is a distraction; the result does not depend on it.'),
  M('tr-052', 3, 'max and min', R`The range of $5\cos x+12\sin x-3$ is`, R`$[-16,10]$`, [R`$[-13,13]$`, R`$[-10,16]$`, R`$[-18,12]$`],
    R`<p>$\sqrt{5^2+12^2}=13$, so $5\cos x+12\sin x\in[-13,13]$. Subtract 3: $[-16,10]$.</p>`,
    'The shift −3 moves both ends.'),
  M('tr-053', 3, 'special angles', R`$\cos36^\circ-\cos72^\circ$ equals`, R`$\tfrac12$`, [R`$\tfrac14$`, R`$\dfrac{\sqrt5}2$`, R`$\dfrac{\sqrt5-1}4$`],
    R`<p>$\cos36^\circ=\dfrac{\sqrt5+1}4$ and $\cos72^\circ=\dfrac{\sqrt5-1}4$. The difference is $\dfrac24=\tfrac12$.</p>`,
    'The two values differ in the sign of the 1.'),
  N('tr-054', 3, 'sums of squares', R`Find $\sin^21^\circ+\sin^22^\circ+\cdots+\sin^289^\circ$.`, 44.5, 0.01,
    R`<p>Pair $k^\circ$ with $(90-k)^\circ$: $\sin^2k^\circ+\cos^2k^\circ=1$. There are 44 pairs ($1$ with $89$, ..., $44$ with $46$) and the middle term $\sin^245^\circ=\tfrac12$. Total $=44.5$.</p>`,
    '89 terms: 44 pairs plus one middle term.'),
  M('tr-055', 3, 'identities', R`$\dfrac{\sin x}{1+\cos x}+\dfrac{1+\cos x}{\sin x}$ equals`, R`$2\operatorname{cosec}x$`, [R`$2\sec x$`, R`$2\sin x$`, R`$\operatorname{cosec}x$`],
    R`<p>Common denominator: $\dfrac{\sin^2x+(1+\cos x)^2}{\sin x(1+\cos x)}=\dfrac{2+2\cos x}{\sin x(1+\cos x)}=\dfrac2{\sin x}$.</p>`,
    'sin² + cos² = 1 collapses the numerator to 2(1 + cos x).'),
  M('tr-056', 3, 'identities', R`For $0<\theta<\dfrac\pi2$, $\sqrt{1-\sin2\theta}$ equals`, R`$|\sin\theta-\cos\theta|$`, [R`$\sin\theta-\cos\theta$`, R`$\sin\theta+\cos\theta$`, R`$\cos2\theta$`],
    R`<p>$1-\sin2\theta=\sin^2\theta+\cos^2\theta-2\sin\theta\cos\theta=(\sin\theta-\cos\theta)^2$. The square root is the absolute value, which is not always $\sin\theta-\cos\theta$: for $\theta<\dfrac\pi4$ that is negative.</p>`,
    'Square root of a square is a modulus.'),
  I('tr-057', 4, 'graphs', R`Find the number of real solutions of $\sin x=\dfrac x{10}$.`, 7,
    R`<p>Both sides are odd functions, so non-zero solutions come in pairs $\pm x$, and $x=0$ is one solution. For $x>0$ we need $\dfrac x{10}\le1$, i.e. $x\le10$.</p><p>The line starts below the sine curve (slope $\tfrac1{10}<1$) and meets it once near $x\approx2.85$ as the sine falls. On $(\pi,2\pi)$ the sine is negative, so no root. On $(2\pi,3\pi)\approx(6.28,9.42)$ the hump reaches 1 at $x\approx7.85$ where the line is only $0.785$: two more roots. On $(3\pi,10]$ the sine is negative: none.</p><p>So 3 positive roots, 3 negative roots and $x=0$: $7$ in all.</p>`,
    'x = 0 is itself a solution; do not forget it.'),

  // ---------- L4 hard ----------
  N('tr-058', 4, 'telescoping', R`Evaluate $\tan15^\circ+2\tan30^\circ+4\tan60^\circ+8\cot120^\circ$ to three decimals.`, 3.732, 0.01,
    R`<p>Use $\tan\theta=\cot\theta-2\cot2\theta$. The terms telescope: $\tan x+2\tan2x+4\tan4x+8\cot8x=\cot x$. With $x=15^\circ$: the value is $\cot15^\circ=2+\sqrt3\approx3.732$.</p><p>Check numerically: $0.268+1.155+6.928-4.619=3.732$.</p>`,
    'Cot 120° is negative.'),
  I('tr-059', 4, 'products of cosines', R`Find $16\cos\dfrac\pi{15}\cos\dfrac{2\pi}{15}\cos\dfrac{4\pi}{15}\cos\dfrac{8\pi}{15}$.`, -1,
    R`<p>With $A=\dfrac\pi{15}$: $\cos A\cos2A\cos4A\cos8A=\dfrac{\sin16A}{16\sin A}$. Here $16A=\dfrac{16\pi}{15}=\pi+\dfrac\pi{15}$, so $\sin16A=-\sin A$. The product is $-\dfrac1{16}$, and $16\times$ it is $-1$.</p>`,
    'sin(π + A) = − sin A: the sign is the whole question.'),
  I('tr-060', 4, 'sums', R`Find $2\left(\cos\dfrac{2\pi}7+\cos\dfrac{4\pi}7+\cos\dfrac{6\pi}7\right)$.`, -1,
    R`<p>Let $S=\cos\dfrac{2\pi}7+\cos\dfrac{4\pi}7+\cos\dfrac{6\pi}7$. Multiply by $2\sin\dfrac\pi7$: $2\sin\tfrac\pi7\cos\tfrac{2\pi}7=\sin\tfrac{3\pi}7-\sin\tfrac\pi7$, similarly $\sin\tfrac{5\pi}7-\sin\tfrac{3\pi}7$ and $\sin\tfrac{7\pi}7-\sin\tfrac{5\pi}7$. The sum telescopes to $0-\sin\tfrac\pi7$. So $S=-\tfrac12$ and $2S=-1$.</p>`,
    'This is the real part of the sum of the 7th roots of unity other than 1.'),
  M('tr-061', 4, 'products of cosines', R`The value of $\cos\dfrac\pi7\cos\dfrac{2\pi}7\cos\dfrac{4\pi}7$ is`, R`$-\tfrac18$`, [R`$\tfrac18$`, R`$-\tfrac1{16}$`, R`$\tfrac14$`],
    R`<p>$\cos A\cos2A\cos4A=\dfrac{\sin8A}{8\sin A}$ with $A=\dfrac\pi7$. $\sin\dfrac{8\pi}7=-\sin\dfrac\pi7$, so the product is $-\tfrac18$. (Quick sign check: $\cos\dfrac{4\pi}7<0$ and the other two are positive.)</p>`,
    'The answer must be negative because cos(4π/7) < 0.'),
  N('tr-062', 4, 'sums in AP', R`Find $\sin10^\circ+\sin50^\circ+\sin90^\circ+\sin130^\circ+\sin170^\circ$ to three decimals.`, 2.879, 0.002,
    R`<p>Angles in AP with first term $\alpha=10^\circ$, common difference $\beta=40^\circ$, $n=5$ terms. $\displaystyle\sum\sin=\dfrac{\sin(n\beta/2)}{\sin(\beta/2)}\sin\left(\alpha+\dfrac{(n-1)\beta}2\right)=\dfrac{\sin100^\circ}{\sin20^\circ}\sin90^\circ=\dfrac{\cos10^\circ}{\sin20^\circ}=\dfrac1{2\sin10^\circ}\approx2.879$.</p>`,
    'The "middle angle" is α + (n − 1)β/2 = 90°.'),
  M('tr-064', 4, 'range', R`The range of $f(x)=\cos^2x-\sin x$ is`, R`$\left[-1,\tfrac54\right]$`, [R`$[-1,1]$`, R`$\left[0,\tfrac54\right]$`, R`$\left[-1,2\right]$`],
    R`<p>Put $t=\sin x\in[-1,1]$: $f=1-t^2-t=\tfrac54-\left(t+\tfrac12\right)^2$. The maximum $\tfrac54$ is at $t=-\tfrac12$ (inside the interval). The minimum is at the end farther from $-\tfrac12$, which is $t=1$: $f=-1$.</p>`,
    'The vertex t = −1/2 is inside [−1, 1], so the maximum is not at an end.'),
  N('tr-065', 4, 'max and min', R`Find the maximum value of $2\sin x+\sin\left(x+\dfrac\pi3\right)$ to three decimals.`, 2.646, 0.002,
    R`<p>$\sin\left(x+\tfrac\pi3\right)=\tfrac12\sin x+\tfrac{\sqrt3}2\cos x$. So the expression is $\tfrac52\sin x+\tfrac{\sqrt3}2\cos x$, with amplitude $\sqrt{\tfrac{25}4+\tfrac34}=\sqrt7\approx2.646$.</p>`,
    'First expand the shifted sine to the form a sin x + b cos x.'),
  N('tr-066', 4, 'sums', R`Find $\cos^2\dfrac\pi7+\cos^2\dfrac{2\pi}7+\cdots+\cos^2\dfrac{6\pi}7$.`, 2.5, 0.001,
    R`<p>$\cos^2\theta=\tfrac{1+\cos2\theta}2$. The sum is $3+\tfrac12\sum_{k=1}^6\cos\dfrac{2k\pi}7$. The cosines of $\dfrac{2k\pi}7$, $k=1..6$, sum to $-1$ (the 7th roots of unity add to 0 and the root 1 contributes 1). Total $=3-\tfrac12=2.5$.</p>`,
    'There are six terms, so the constant part is 6 × ½ = 3.'),
  N('tr-067', 4, 'max and min', R`Find the least value of $\sin^6x+\cos^6x$.`, 0.25, 0.001,
    R`<p>$\sin^6x+\cos^6x=1-3\sin^2x\cos^2x=1-\tfrac34\sin^22x$. The least value is when $\sin^22x=1$: $1-\tfrac34=\tfrac14$.</p>`,
    'The least value occurs at 45°, where both terms are small.'),
  N('tr-068', 4, 'identities', R`If $\sin\theta+\cos\theta=\tfrac12$, find $\sin^3\theta+\cos^3\theta$.`, 0.6875, 0.001,
    R`<p>From $\sin\theta+\cos\theta=\tfrac12$: $1+2\sin\theta\cos\theta=\tfrac14$, so $\sin\theta\cos\theta=-\tfrac38$. Then $\sin^3\theta+\cos^3\theta=(s)(1-p)=\tfrac12\left(1+\tfrac38\right)=\tfrac{11}{16}=0.6875$.</p>`,
    'The sum of cubes is (a + b)(a² − ab + b²), and a² + b² = 1.'),
  N('tr-069', 4, 'sum and difference', R`Given $\sin\alpha+\sin\beta=1$ and $\cos\alpha+\cos\beta=\tfrac12$, find $\cos(\alpha-\beta)$.`, -0.375, 0.001,
    R`<p>Square and add: $2+2(\sin\alpha\sin\beta+\cos\alpha\cos\beta)=1+\tfrac14$. So $2+2\cos(\alpha-\beta)=\tfrac54$ and $\cos(\alpha-\beta)=-\tfrac38$.</p>`,
    'Add the squares, not the plain sums.'),
  S('tr-070', 4, 'comparing values', R`$\cos1>\cos2$ and $\sin3>\sin4$ (angles in radians).`, R`$\sin5>\sin6$ (angles in radians).`, 1,
    R`<p>$\sin5\approx-0.959$ and $\sin6\approx-0.279$, so $\sin5<\sin6$ and Statement II is false. For Statement I: $\cos1\approx0.540>\cos2\approx-0.416$ and $\sin3\approx0.141>\sin4\approx-0.757$. Both parts are true.</p>`,
    'Locate each radian value in its quadrant: 5 and 6 are both in the fourth quadrant, where sine increases.'),
  X('tr-071', 4, 'inequalities', R`For $0<x<\dfrac\pi2$, which of the following are true?`,
    [R`$\sin x<x$`, R`$\tan x>x$`, R`$\sin x+\tan x>2x$`, R`$\tan x<2x$`], [0, 1, 2],
    R`<p>The first two follow from comparing arc, chord-height and tangent in the unit circle. For the third, let $h(x)=\sin x+\tan x-2x$, so $h(0)=0$ and $h'(x)=\cos x+\sec^2x-2$. Since $0<\cos x<1$, $\sec^2x>\sec x$, so $h'(x)>\cos x+\sec x-2\ge0$ (AM-GM). Thus $h$ increases and $h(x)>0$. The last option fails near $\pi/2$, where $\tan x\to\infty$.</p>`,
    'Plot all three curves near 0 and near π/2 before trusting a pattern.'),
  X('tr-072', 4, 'signs', R`Which of these (angles in radians) are negative?`,
    [R`$\sin4$`, R`$\cos2$`, R`$\tan4$`, R`$\cos5$`], [0, 1],
    R`<p>$4$ rad $\approx229^\circ$ (third quadrant): $\sin<0$ and $\tan>0$. $2$ rad $\approx115^\circ$ (second quadrant): $\cos<0$. $5$ rad $\approx286^\circ$ (fourth quadrant): $\cos>0$. So $\sin4$ and $\cos2$ are negative.</p>`,
    'Convert radians to degrees roughly: 1 rad is about 57°.'),

  // ---------- L5 top rank ----------
  I('tr-073', 5, 'products of sines', R`Find $64\sin\dfrac\pi7\sin\dfrac{2\pi}7\sin\dfrac{3\pi}7\sin\dfrac{4\pi}7\sin\dfrac{5\pi}7\sin\dfrac{6\pi}7$.`, 7,
    R`<p>Use $\displaystyle\prod_{k=1}^{n-1}\sin\dfrac{k\pi}n=\dfrac n{2^{n-1}}$. For $n=7$ the product is $\dfrac7{64}$, so $64\times$ it is 7.</p><p>Proof idea: $x^{n}-1=\prod(x-\omega^k)$; divide by $x-1$ and set $x=1$: $n=\prod_{k=1}^{n-1}(1-\omega^k)$, and $|1-\omega^k|=2\sin\dfrac{k\pi}n$.</p>`,
    'The six sines pair up as sin(kπ/7) = sin((7 − k)π/7).'),
  I('tr-074', 5, 'special angles', R`Find $\tan9^\circ-\tan27^\circ-\tan63^\circ+\tan81^\circ$.`, 4,
    R`<p>$\tan81^\circ=\cot9^\circ$ and $\tan63^\circ=\cot27^\circ$. The expression is $(\tan9^\circ+\cot9^\circ)-(\tan27^\circ+\cot27^\circ)=\dfrac2{\sin18^\circ}-\dfrac2{\sin54^\circ}=2\cdot\dfrac{\sin54^\circ-\sin18^\circ}{\sin18^\circ\sin54^\circ}$. With $\sin18^\circ\sin54^\circ=\tfrac14$ (from $\cos72^\circ\cos36^\circ$) and $\sin54^\circ-\sin18^\circ=\tfrac12$, the value is $2\cdot\dfrac{1/2}{1/4}=4$.</p>`,
    'The key is writing tan 81° as cot 9° so that tan + cot pairs appear.'),
  I('tr-075', 5, 'sums', R`Find $2\left(\cos\dfrac\pi7-\cos\dfrac{2\pi}7+\cos\dfrac{3\pi}7\right)$.`, 1,
    R`<p>$-\cos\dfrac{2\pi}7=\cos\dfrac{5\pi}7$. So the sum is $\cos\dfrac\pi7+\cos\dfrac{3\pi}7+\cos\dfrac{5\pi}7$. Multiply by $2\sin\dfrac\pi7$: the terms become $\sin\dfrac{2\pi}7$, $\sin\dfrac{4\pi}7-\sin\dfrac{2\pi}7$, $\sin\dfrac{6\pi}7-\sin\dfrac{4\pi}7$, which telescope to $\sin\dfrac{6\pi}7=\sin\dfrac\pi7$. So the sum is $\tfrac12$ and twice it is 1.</p>`,
    'Rewrite −cos(2π/7) as cos(5π/7) to see the AP of angles.'),
  I('tr-076', 5, 'products of sines', R`Find $8\sin12^\circ\sin48^\circ\sin54^\circ$.`, 1,
    R`<p>$\sin12^\circ\sin48^\circ=\tfrac12(\cos36^\circ-\cos60^\circ)$, and $\sin54^\circ=\cos36^\circ$. With $c=\cos36^\circ=\dfrac{1+\sqrt5}4$: the product is $\tfrac12\left(c-\tfrac12\right)c=\tfrac12\cdot\dfrac{\sqrt5-1}4\cdot\dfrac{1+\sqrt5}4=\tfrac12\cdot\dfrac4{16}=\tfrac18$. Then $8\times\tfrac18=1$.</p>`,
    'Use the product-to-sum formula on the first two sines only.'),
  I('tr-077', 5, 'triangle extremes', R`In an acute triangle $ABC$, find the least possible value of $\tan^2A+\tan^2B+\tan^2C$.`, 9,
    R`<p>In a triangle, $\tan A+\tan B+\tan C=\tan A\tan B\tan C$. For an acute triangle all three are positive, and AM-GM gives $s=\sum\tan\ge3(\prod\tan)^{1/3}=3s^{1/3}$, so $s^{2/3}\ge3$ and $s\ge3\sqrt3$. By QM-AM, $\sum\tan^2\ge\dfrac{s^2}3\ge\dfrac{27}3=9$, equal for the equilateral triangle where each tangent is $\sqrt3$.</p>`,
    'Acute is essential: for an obtuse triangle one tangent is negative.'),
  N('tr-078', 5, 'telescoping', R`Find $\displaystyle\sum_{k=1}^{44}\dfrac{\sin1^\circ}{\cos k^\circ\cos(k+1)^\circ}$ to four decimals.`, 0.9825, 0.0002,
    R`<p>$\tan(k+1)^\circ-\tan k^\circ=\dfrac{\sin1^\circ}{\cos k^\circ\cos(k+1)^\circ}$. The sum telescopes: $\tan45^\circ-\tan1^\circ=1-0.017455=0.98254$.</p>`,
    'Telescoping needs sin 1° in the numerator; check the identity before summing.'),
  N('tr-079', 5, 'telescoping', R`Find $\operatorname{cosec}10^\circ+\operatorname{cosec}20^\circ+\operatorname{cosec}40^\circ$ to two decimals.`, 10.24, 0.02,
    R`<p>$\operatorname{cosec}\theta=\cot\dfrac\theta2-\cot\theta$. So $\operatorname{cosec}10^\circ=\cot5^\circ-\cot10^\circ$, $\operatorname{cosec}20^\circ=\cot10^\circ-\cot20^\circ$, $\operatorname{cosec}40^\circ=\cot20^\circ-\cot40^\circ$. The sum is $\cot5^\circ-\cot40^\circ=11.430-1.192=10.238$.</p>`,
    'Each cosecant telescopes against its neighbour because the angles double.'),
  I('tr-111', 5, 'products', R`If $\displaystyle\prod_{k=1}^{44}(1+\tan k^\circ)=2^m$, find $m$.`, 22,
    R`<p>If $a+b=45^\circ$ then $(1+\tan a)(1+\tan b)=1+\tan a+\tan b+\tan a\tan b$, and $\tan(a+b)=1$ gives $\tan a+\tan b=1-\tan a\tan b$. So the product is $2$.</p><p>Pair $k$ with $45-k$ for $k=1,\dots,22$: 22 pairs ($1$ with $44$, ..., $22$ with $23$), each equal to 2. So the product is $2^{22}$ and $m=22$.</p>`,
    'The factor for 45° is not in this product (it stops at 44), so there is no extra 2.'),
  I('tr-112', 5, 'sums', R`Find $\displaystyle\sum_{k=1}^{6}\cot^2\dfrac{k\pi}7$.`, 10,
    R`<p>Known result: $\displaystyle\sum_{k=1}^{n-1}\cot^2\dfrac{k\pi}n=\dfrac{(n-1)(n-2)}3$. For $n=7$: $\dfrac{6\cdot5}3=10$.</p><p>Why: $\cot^2=\operatorname{cosec}^2-1$ and $\displaystyle\sum_{k=1}^{n-1}\operatorname{cosec}^2\dfrac{k\pi}n=\dfrac{n^2-1}3=16$, so the sum is $16-6=10$.</p>`,
    'Subtract the number of terms (6) after summing the cosec² values.'),
  I('tr-113', 5, 'sums', R`Find $\tan^2\dfrac\pi7+\tan^2\dfrac{2\pi}7+\tan^2\dfrac{3\pi}7$.`, 21,
    R`<p>From $\tan7\theta=0$ with $\theta=\dfrac{k\pi}7$, $u=\tan^2\theta$ satisfies $u^3-21u^2+35u-7=0$ for $k=1,2,3$ (the three values are distinct). By Vieta the sum of the roots is $21$.</p><p>Numerical check: the tangents are about $0.4816$, $1.2540$, $4.3813$, and the squares add to $0.232+1.572+19.196=21.0$.</p>`,
    'tan 3π/7 is large (about 4.38), so the sum is much more than 3.'),
  N('tr-114', 4, 'triangle extremes', R`In a triangle $ABC$, find the greatest possible value of $\sin A+\sin B+\sin C$ to three decimals.`, 2.598, 0.002,
    R`<p>Sine is concave on $[0,\pi]$, so by Jensen, $\sin A+\sin B+\sin C\le3\sin\dfrac{A+B+C}3=3\sin60^\circ=\dfrac{3\sqrt3}2\approx2.598$, equality for the equilateral triangle.</p>`,
    'Do not take 3 (that would need all angles 90°).'),
  X('tr-080', 5, 'max and min', R`Which of these values can $3\sin x+4\cos x$ take for some real $x$?`,
    ['$5$', '$-5$', '$5.01$', '$0$'], [0, 1, 3],
    R`<p>The expression equals $5\sin(x+\alpha)$ with range $[-5,5]$. So $5$, $-5$ and $0$ are all reached; $5.01$ is not.</p>`,
    'The endpoints are attained, so they count.'),
  X('tr-081', 3, 'identities', R`Which of the following are identities (true for every $x$ where both sides are defined)?`,
    [R`$\sin^4x-\cos^4x=-\cos2x$`, R`$(1+\tan^2x)\cos^2x=1$`, R`$\dfrac{\sin x}{1+\cos x}=\dfrac{1-\cos x}{\sin x}$`, R`$\sec x-\tan x=\sec x+\tan x$`], [0, 1, 2],
    R`<p>1: $(\sin^2-\cos^2)(\sin^2+\cos^2)=-\cos2x$. 2: $\sec^2x\cos^2x=1$. 3: cross-multiply, $\sin^2x=1-\cos^2x$. 4: it would need $\tan x=-\tan x$, i.e. $\tan x=0$, so it is true only at special $x$. (What is always true is $(\sec x-\tan x)(\sec x+\tan x)=1$.)</p>`,
    'Option 4 looks harmless but is only the conjugate relation.'),
  X('tr-082', 3, 'graphs', R`For $y=2\sin\left(3x-\dfrac\pi2\right)+1$, which are true?`,
    ['amplitude is $2$', R`period is $\dfrac{2\pi}3$`, R`range is $[-1,3]$`, R`graph is $y=2\sin3x+1$ moved $\dfrac\pi2$ to the right`], [0, 1, 2],
    R`<p>Amplitude 2; period $2\pi/3$; range $1\pm2=[-1,3]$. The shift is $\dfrac\pi6$, not $\dfrac\pi2$, because $3x-\dfrac\pi2=3\left(x-\dfrac\pi6\right)$.</p>`,
    'Shift = phase constant ÷ coefficient of x.'),
  X('tr-083', 3, 'conditional identities', R`$A+B+C=\pi$. Which of these are always true?`,
    [R`$\sin(A+B)=\sin C$`, R`$\cos(A+B)=\cos C$`, R`$\tan(A+B)=-\tan C$ when defined`, R`$\cos\dfrac{A+B}2=\sin\dfrac C2$`], [0, 2, 3],
    R`<p>$A+B=\pi-C$. Then $\sin(\pi-C)=\sin C$ ✓; $\cos(\pi-C)=-\cos C$, so the second is false; $\tan(\pi-C)=-\tan C$ ✓; $\cos\left(\dfrac\pi2-\dfrac C2\right)=\sin\dfrac C2$ ✓.</p>`,
    'Cosine changes sign at π − C; sine does not.'),
  X('tr-084', 4, 'periods', R`Which of these functions have period $\pi$?`,
    [R`$|\sin x|$`, R`$\tan x$`, R`$\sin x\cos x$`, R`$\sin\dfrac x2$`], [0, 1, 2],
    R`<p>$|\sin x|$: yes. $\tan x$: yes. $\sin x\cos x=\tfrac12\sin2x$: period $\pi$. $\sin\dfrac x2$ has period $4\pi$, not $\pi$.</p>`,
    '"Period π" means π is the fundamental period, not just a multiple of it.'),

  // ---------- assertion-reason ----------
  A('tr-085', 2, 'period', R`The function $\sin2x$ has period $\pi$.`, R`The function $\sin(kx)$ has period $\dfrac{2\pi}{|k|}$.`, 0,
    R`<p>R is the standard result. With $k=2$ it gives $\pi$, so R explains A.</p>`,
    'Check that sin(2(x + π)) = sin(2x + 2π).'),
  A('tr-086', 3, 'max and min', R`The maximum value of $\sin x+\cos x$ is $2$.`, R`The maximum value of each of $\sin x$ and $\cos x$ is $1$.`, 3,
    R`<p>R is true, but the two maxima occur at different values of $x$ ($x=90^\circ$ and $x=0$). $\sin x+\cos x=\sqrt2\sin(x+45^\circ)$ has maximum $\sqrt2$, so A is false.</p>`,
    'The maximum of a sum is not the sum of the maxima unless they occur at the same x.'),
  A('tr-087', 3, 'allied angles', R`$\sin100^\circ=\sin80^\circ$.`, R`$\sin(180^\circ-\theta)=\sin\theta$.`, 0,
    R`<p>$100^\circ=180^\circ-80^\circ$, so R gives A directly.</p>`,
    'In the second quadrant sine keeps its value.'),
  A('tr-088', 3, 'conditional identities', R`If $A+B+C=\pi$ and none of the angles is $\dfrac\pi2$, then $\tan A+\tan B+\tan C=\tan A\tan B\tan C$.`, R`$\tan(A+B)=-\tan C$ when $A+B+C=\pi$.`, 0,
    R`<p>$\tan(A+B)=\dfrac{\tan A+\tan B}{1-\tan A\tan B}=-\tan C$. Multiply out: $\tan A+\tan B=-\tan C+\tan A\tan B\tan C$. So the identity follows from R.</p>`,
    'The condition about π/2 avoids tangents that do not exist.'),
  A('tr-089', 4, 'half angles', R`$\sin\dfrac\theta2=\sqrt{\dfrac{1-\cos\theta}2}$ for every real $\theta$.`, R`$\cos\theta=1-2\sin^2\dfrac\theta2$.`, 3,
    R`<p>R is true and gives $\sin^2\dfrac\theta2=\dfrac{1-\cos\theta}2$. So $\sin\dfrac\theta2=\pm\sqrt{\dfrac{1-\cos\theta}2}$, and the sign depends on the quadrant of $\dfrac\theta2$. For $\theta=3\pi$, $\sin\dfrac{3\pi}2=-1$ but the square root is $+1$. A is false.</p>`,
    'The square root symbol gives only the non-negative value.'),
  A('tr-090', 4, 'period', R`The period of $|\sin x|+|\cos x|$ is $\dfrac\pi2$.`, R`$|\sin x|$ and $|\cos x|$ each have period $\pi$.`, 1,
    R`<p>R is true, but it only shows that $\pi$ is a period. The reason $\dfrac\pi2$ works is that $x\to x+\dfrac\pi2$ interchanges the two terms. A is true; R does not explain it.</p>`,
    'The fundamental period can be smaller than the common period of the parts.'),
  A('tr-091', 4, 'products of cosines', R`$\cos\dfrac\pi7\cos\dfrac{2\pi}7\cos\dfrac{4\pi}7=-\dfrac18$.`, R`$\cos A\cos2A\cos4A=\dfrac{\sin8A}{8\sin A}$.`, 0,
    R`<p>R is the doubling identity. With $A=\dfrac\pi7$, $\sin\dfrac{8\pi}7=-\sin\dfrac\pi7$, giving $-\dfrac18$. So R explains A.</p>`,
    'Check the sign by looking at cos(4π/7) < 0.'),
  A('tr-092', 3, 'radian measure', R`One radian is more than $57^\circ$.`, R`One radian equals $\dfrac{180^\circ}\pi$.`, 0,
    R`<p>$\dfrac{180}{3.1416}=57.296$, which is more than 57. R gives the value, so it explains A.</p>`,
    '57.3° is the number to remember.'),

  // ---------- statements ----------
  S('tr-093', 2, 'multiple angles', R`$\sin3\theta=3\sin\theta-4\sin^3\theta$.`, R`$\cos3\theta=4\cos^3\theta-3\cos\theta$.`, 0,
    R`<p>Both are the triple-angle formulae. Check at $\theta=0$: $\sin0=0$ and $\cos3\cdot0=1=4-3$.</p>`,
    'Sine has the plus sign first; cosine has the 4 first.'),
  S('tr-094', 3, 'compound angles', R`$\tan(A-B)=\dfrac{\tan A-\tan B}{1+\tan A\tan B}$.`, R`$\tan(A+B)=\dfrac{\tan A+\tan B}{1+\tan A\tan B}$.`, 1,
    R`<p>For $A+B$ the denominator is $1-\tan A\tan B$. Statement II is false; Statement I is correct (the sign in the denominator is opposite to the sign in the numerator).</p>`,
    'The denominator sign is opposite to the numerator sign.'),
  S('tr-095', 3, 'graphs', R`$y=|\sin x|$ has period $\pi$.`, R`$y=\sin|x|$ is periodic with period $2\pi$.`, 1,
    R`<p>$|\sin x|$ repeats every $\pi$. But $\sin|x|$ is $\sin x$ for $x\ge0$ and $-\sin x$ for $x<0$: the graph is symmetric about the y-axis and not periodic at all, because the left side is a mirror image, not a repeat.</p>`,
    '|sin x| and sin|x| look alike but behave very differently.'),
  S('tr-096', 3, 'conditional identities', R`In any triangle, $\cos A+\cos B+\cos C\le\dfrac32$.`, R`In any triangle, $\cos A+\cos B+\cos C=1+4\sin\dfrac A2\sin\dfrac B2\sin\dfrac C2$.`, 0,
    R`<p>II is a standard identity. The product $\sin\dfrac A2\sin\dfrac B2\sin\dfrac C2$ is at most $\dfrac18$ (equal for the equilateral triangle), so the sum is at most $1+\dfrac48=\dfrac32$. Both true. Check: equilateral gives $3\times\tfrac12=\tfrac32$.</p>`,
    'Equilateral triangle: 3 × ½ = 3/2.'),
  S('tr-097', 4, 'monotonicity', R`$\sin20^\circ<\sin160^\circ$.`, R`$\sin x$ is an increasing function on $[0,\pi]$.`, 3,
    R`<p>$\sin160^\circ=\sin20^\circ$, so Statement I is false. Statement II is false too: sine increases on $[0,\pi/2]$ and decreases on $[\pi/2,\pi]$.</p>`,
    'Sine is symmetric about 90°.'),
  S('tr-098', 4, 'inequalities', R`For $0<x<\dfrac\pi2$, $\sin x<x<\tan x$.`, R`For $0<x<\dfrac\pi2$, $\dfrac{\sin x}{x}<1$ and $\dfrac{\tan x}{x}>1$.`, 0,
    R`<p>Statement II is Statement I divided by $x>0$. Both are true. (Geometric proof: compare the areas of the triangle, sector and bigger triangle in the unit circle.)</p>`,
    'Valid only for the open interval (0, π/2).'),
  S('tr-099', 3, 'compound angles', R`$\sin(A+B)\sin(A-B)=\sin^2A-\sin^2B$.`, R`$\cos(A+B)\cos(A-B)=\cos^2A-\sin^2B$.`, 0,
    R`<p>$\sin(A+B)\sin(A-B)=\sin^2A\cos^2B-\cos^2A\sin^2B=\sin^2A(1-\sin^2B)-(1-\sin^2A)\sin^2B=\sin^2A-\sin^2B$. Also $\cos(A+B)\cos(A-B)=\cos^2A\cos^2B-\sin^2A\sin^2B=\cos^2A-\sin^2B$. Both true.</p>`,
    'Note the mixed form in the second: cos²A − sin²B (not cos²A − cos²B).'),
  S('tr-100', 2, 'quadrants', R`In the third quadrant both $\sin\theta$ and $\cos\theta$ are negative.`, R`In the third quadrant $\tan\theta$ is negative.`, 1,
    R`<p>Third quadrant: sin and cos negative, so $\tan=\dfrac{\sin}{\cos}$ is positive. Statement I is true, II is false.</p>`,
    'Mnemonic: only tan and cot are positive in the third quadrant.'),

  // ---------- match ----------
  MT('tr-101', 2, 'exact values', 'm1', 'Match List I with List II.', 'A-s, B-q, C-r, D-p', ['A-q, B-s, C-r, D-p', 'A-s, B-q, C-p, D-r', 'A-p, B-q, C-r, D-s'],
    R`<p>A: $\sin150^\circ=\tfrac12$ (s). B: $\cos120^\circ=-\tfrac12$ (q). C: $\tan135^\circ=-1$ (r). D: $\sec60^\circ=\dfrac1{\cos60^\circ}=2$ (p).</p>`,
    'Secant is the reciprocal of cosine, not of sine.'),
  MT('tr-102', 3, 'period', 'm2', 'Match List I with List II.', 'A-q, B-p, C-s, D-r', ['A-p, B-q, C-s, D-r', 'A-q, B-p, C-r, D-s', 'A-s, B-p, C-q, D-r'],
    R`<p>A: $2\pi/2=\pi$ (q). B: $\pi/3$ (p). C: $|\sin2x|$ has period $\dfrac\pi2$ (s). D: periods $2\pi$ and $\pi$: the whole has period $2\pi$ (r).</p>`,
    'Tan has base period π; modulus of sine halves the period.'),
  MT('tr-103', 3, 'max and min', 'm3', 'Match List I with List II.', 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    R`<p>A: $\sqrt{9+16}=5$ (p). B: $\sin x\le1$ so $2-\sin x\ge1$ (q). C: $\sin x\cos x=\tfrac12\sin2x\le\tfrac12$ (r). D: $\dfrac4{\sin^22x}\ge4$ (s).</p>`,
    'Part B asks for the least, not the greatest.'),
  MT('tr-104', 4, 'conditional identities', 'm4', 'Match List I with List II.', 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    R`<p>Standard identities for $A+B+C=\pi$: $\sum\cos^2=1-2\prod\cos$, so A $=1$. $\sum\sin^2=2+2\prod\cos$, so B $=2$. $\sum\sin2A=4\prod\sin$, so C $=4$. $\sum\cos2A=-1-4\prod\cos$, so D $=-1$. Check with $A=B=C=60^\circ$: A: $\tfrac34+2\cdot\tfrac18=1$ ✓.</p>`,
    'Test with an equilateral triangle to sort out which constant goes where.'),

  // ---------- passages ----------
  P('tr-105', 3, 'conditional identities', 'p1', R`The value of $\tan C$ is`, '-1', ['1', R`$-\tfrac56$`, R`$\tfrac56$`],
    R`<p>$\tan C=-\tan(A+B)=-\dfrac{\tfrac12+\tfrac13}{1-\tfrac16}=-1$. So $C$ is obtuse.</p>`,
    'tan C = −tan(A+B), not tan(A+B).'),
  PI('tr-106', 3, 'conditional identities', 'p1', R`Find $C$ in degrees.`, 135,
    R`<p>$\tan C=-1$ and $C$ is obtuse (the angles $A$ and $B$ are acute and sum to $45^\circ$), so $C=180^\circ-45^\circ=135^\circ$.</p>`,
    'tan C = −1 holds at 135° and 315°; only 135° is inside a triangle.'),
  PI('tr-107', 3, 'conditional identities', 'p1', R`Find $\cot A+\cot B+\cot C$.`, 4,
    R`<p>$\cot A=2$, $\cot B=3$, $\cot C=-1$. Sum $=4$. (Check: $\cot A\cot B+\cot B\cot C+\cot C\cot A=6-3-2=1$, as required for $A+B+C=\pi$.)</p>`,
    'Cotangents are reciprocals of tangents.'),
  PI('tr-108', 3, 'max and min', 'p2', R`Find the greatest value of $f(x)$.`, 5,
    R`<p>$R=\sqrt{3^2+4^2}=5$, so $f(x)=5\sin(x+\alpha)$ with $\tan\alpha=\tfrac43$. Greatest value 5.</p>`,
    'R is the square root of a² + b², not a + b.'),
  PN('tr-109', 4, 'max and min', 'p2', R`At the value of $x$ in $(0,\pi/2)$ where $f$ is greatest, find $\tan x$.`, 0.75, 0.01,
    R`<p>$f=5\sin(x+\alpha)$ is greatest when $x+\alpha=\dfrac\pi2$, so $x=\dfrac\pi2-\alpha$ and $\tan x=\cot\alpha=\tfrac34$. (Check: at $\tan x=\tfrac34$, $\sin x=\tfrac35,\cos x=\tfrac45$ and $f=\tfrac95+\tfrac{16}5=5$.)</p>`,
    'Do not use tan α = 4/3 directly: the maximum is at the complementary angle.'),
  PI('tr-110', 4, 'max and min', 'p2', R`How many values of $x$ in $[0,2\pi)$ satisfy $f(x)=4$?`, 2,
    R`<p>$5\sin(x+\alpha)=4$ gives $\sin(x+\alpha)=0.8$. With $x+\alpha$ in $[\alpha,2\pi+\alpha)$ and $\alpha\approx53.13^\circ$, the solutions are $x+\alpha=53.13^\circ$ (so $x=0$) and $x+\alpha=126.87^\circ$ (so $x\approx73.74^\circ$). The value 4 is below the maximum 5, so there are two solutions in any full period.</p>`,
    'The point x = 0 counts, since f(0) = 4.'),
];

// ---------- number templates ----------
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
const fr = (n, d) => { const k = gcd(n, d) || 1; n /= k; d /= k; if (d < 0) { n = -n; d = -d; } return d === 1 ? `${n}` : `\\frac{${n}}{${d}}`.replace(/^\\frac\{-(\d+)\}/, '-\\frac{$1}'); };
const piFr = (n, d) => { const k = gcd(n, d); n /= k; d /= k; const top = n === 1 ? '\\pi' : `${n}\\pi`; return d === 1 ? top : `\\frac{${top}}{${d}}`; };
const rngWrap = (seed) => { let s = seed; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; };

const gens = [
  {
    id: 'tr-g01', type: 'nat', format: 'integer', level: 1, exams: EXS[1], sub: 'radian measure',
    make(rng) {
      const n = choose(rng, [3, 4, 5, 6, 9, 10, 12]); const k = int(rng, 1, 2 * n - 1);
      const answer = 180 * k / n;
      return { n, k, answer, tol: 0,
        q: R`Express $${piFr(k, n)}$ radians in degrees.`,
        sol: R`<p>Multiply by $\dfrac{180}{\pi}$: $\dfrac{${k}}{${n}}\times180=${answer}$ degrees.</p>` };
    },
    verify(p) { return (p.k * Math.PI / p.n) * 180 / Math.PI; },
  },
  {
    id: 'tr-g02', type: 'nat', format: 'numeric', level: 2, exams: EXS[2], sub: 'compound angles',
    make(rng) {
      const t1 = choose(rng, TRI), t2 = choose(rng, TRI);
      const [a1, b1, c1] = t1, [a2, b2, c2] = t2;
      const answer = +((a1 * b2 + b1 * a2) / (c1 * c2)).toFixed(4);
      return { t1, t2, answer, tol: 0.001,
        q: R`$A$ and $B$ are acute, $\sin A=\dfrac{${a1}}{${c1}}$ and $\cos B=\dfrac{${b2}}{${c2}}$. Find $\sin(A+B)$ to three decimals.`,
        sol: R`<p>$\cos A=\dfrac{${b1}}{${c1}}$ (acute) and $\sin B=\dfrac{${a2}}{${c2}}$.</p><p>$\sin(A+B)=\sin A\cos B+\cos A\sin B=\dfrac{${a1}\cdot${b2}+${b1}\cdot${a2}}{${c1}\cdot${c2}}=\dfrac{${a1 * b2 + b1 * a2}}{${c1 * c2}}\approx${answer}$.</p>` };
    },
    verify(p) { const [a1, , c1] = p.t1, [, b2, c2] = p.t2; return Math.sin(Math.asin(a1 / c1) + Math.acos(b2 / c2)); },
  },
  {
    id: 'tr-g03', type: 'mcq', format: 'single', level: 2, exams: EXS[2], sub: 'compound angles',
    make(rng) {
      const t1 = choose(rng, TRI.slice(0, 4)), t2 = choose(rng, TRI.slice(0, 4));
      const [a1, b1, c1] = t1, [a2, b2, c2] = t2; const D = c1 * c2;
      const good = b1 * b2 - a1 * a2, wr = [b1 * b2 + a1 * a2, a1 * b2 - b1 * a2, a1 * b2 + b1 * a2];
      const ok = `$${fr(good, D)}$`;
      const { options, answer } = shuffleOpts(rng, ok, wr.map((w) => `$${fr(w, D)}$`));
      return { t1, t2, good, D, options, answer, q: R`$A,B$ are acute with $\sin A=\dfrac{${a1}}{${c1}}$ and $\sin B=\dfrac{${a2}}{${c2}}$. Then $\cos(A+B)$ equals`,
        sol: R`<p>$\cos A=\dfrac{${b1}}{${c1}}$, $\cos B=\dfrac{${b2}}{${c2}}$.</p><p>$\cos(A+B)=\cos A\cos B-\sin A\sin B=\dfrac{${b1 * b2}-${a1 * a2}}{${D}}=${ok.slice(1, -1)}$.</p>` };
    },
    verify(p) { const [a1, , c1] = p.t1; const [a2, , c2] = p.t2; const v = Math.cos(Math.asin(a1 / c1) + Math.asin(a2 / c2)); return Math.abs(v - p.good / p.D) < 1e-9 ? p.answer : -1; },
  },
  {
    id: 'tr-g04', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'compound angles',
    make(rng) {
      let a, b;
      do { a = int(rng, 2, 9); b = int(rng, 2, 9); } while (a === b || (a + b) % (1 - a * b) !== 0);
      const answer = (a + b) / (1 - a * b);
      return { a, b, answer, tol: 0,
        q: R`If $\tan A=${a}$ and $\tan B=${b}$, find $\tan(A+B)$.`,
        sol: R`<p>$\tan(A+B)=\dfrac{\tan A+\tan B}{1-\tan A\tan B}=\dfrac{${a}+${b}}{1-${a * b}}=\dfrac{${a + b}}{${1 - a * b}}=${answer}$.</p>` };
    },
    verify(p) { return Math.round(Math.tan(Math.atan(p.a) + Math.atan(p.b))); },
  },
  {
    id: 'tr-g05', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'sums of squares',
    make(rng) {
      const n = int(rng, 3, 9);
      return { n, answer: n, tol: 0,
        q: R`Find $2\displaystyle\sum_{k=0}^{${n - 1}}\cos^2\left(\theta+\dfrac{k\pi}{${n}}\right)$, which does not depend on $\theta$.`,
        sol: R`<p>$2\cos^2u=1+\cos2u$. So the expression is $${n}+\displaystyle\sum_{k=0}^{${n - 1}}\cos\left(2\theta+\dfrac{2k\pi}{${n}}\right)$. The ${n} angles $2\theta+\dfrac{2k\pi}{${n}}$ are equally spaced round the circle, so their cosines add to 0. Answer $${n}$.</p>` };
    },
    verify(p) { let S = 0; const th = 0.37; for (let k = 0; k < p.n; k++) S += 2 * Math.cos(th + k * Math.PI / p.n) ** 2; return Math.round(S); },
  },
  {
    id: 'tr-g06', type: 'nat', format: 'numeric', level: 3, exams: EXS[3], sub: 'sums of squares',
    make(rng) {
      const n = int(rng, 3, 12);
      const answer = (n - 2) / 2;
      return { n, answer, tol: 0.001,
        q: R`Find $\displaystyle\sum_{k=1}^{${n - 1}}\cos^2\dfrac{k\pi}{${n}}$.`,
        sol: R`<p>$\cos^2u=\dfrac{1+\cos2u}2$. The sum is $\dfrac{${n - 1}}2+\dfrac12\displaystyle\sum_{k=1}^{${n - 1}}\cos\dfrac{2k\pi}{${n}}$. The ${n}th roots of unity add to 0, so the cosines other than $k=0$ add to $-1$. Total $=\dfrac{${n - 1}}2-\dfrac12=${answer}$.</p>` };
    },
    verify(p) { let S = 0; for (let k = 1; k < p.n; k++) S += Math.cos(k * Math.PI / p.n) ** 2; return S; },
  },
  {
    id: 'tr-g07', type: 'nat', format: 'numeric', level: 4, exams: EXS[4], sub: 'products of sines',
    make(rng) {
      const n = int(rng, 3, 9);
      const answer = +(n / 2 ** (n - 1)).toFixed(5);
      return { n, answer, tol: 0.0005,
        q: R`Find $\displaystyle\prod_{k=1}^{${n - 1}}\sin\dfrac{k\pi}{${n}}$ to four decimals.`,
        sol: R`<p>The standard result is $\displaystyle\prod_{k=1}^{n-1}\sin\dfrac{k\pi}n=\dfrac n{2^{n-1}}$.</p><p>With $n=${n}$: $\dfrac{${n}}{${2 ** (n - 1)}}=${answer}$.</p>` };
    },
    verify(p) { let q = 1; for (let k = 1; k < p.n; k++) q *= Math.sin(k * Math.PI / p.n); return q; },
  },
  {
    id: 'tr-g08', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'max and min',
    make(rng) {
      const [a0, b0, c0] = choose(rng, TRI.slice(0, 4)); const m = choose(rng, [1, 2, 3]);
      const a = a0 * m * choose(rng, [1, -1]), b = b0 * m, c = int(rng, -6, 6); const which = choose(rng, ['greatest', 'least']);
      const amp = c0 * m; const answer = which === 'greatest' ? amp + c : -amp + c;
      const f = `${a}\\sin x${b < 0 ? '' : '+'}${b}\\cos x${c === 0 ? '' : (c > 0 ? '+' : '') + c}`;
      return { a, b, c, which, answer, tol: 0,
        q: R`Find the ${which} value of $${f}$.`,
        sol: R`<p>$a\sin x+b\cos x$ ranges over $[-\sqrt{a^2+b^2},\sqrt{a^2+b^2}]$. Here $\sqrt{${a * a}+${b * b}}=${amp}$.</p><p>The ${which} value is $${which === 'greatest' ? '' : '-'}${amp}${c === 0 ? '' : (c > 0 ? '+' : '') + c}=${answer}$.</p>` };
    },
    verify(p) { let best = p.which === 'greatest' ? -1e9 : 1e9; for (let x = 0; x < 6.2832; x += 0.0005) { const v = p.a * Math.sin(x) + p.b * Math.cos(x) + p.c; best = p.which === 'greatest' ? Math.max(best, v) : Math.min(best, v); } return Math.round(best); },
  },
  {
    id: 'tr-g09', type: 'nat', format: 'numeric', level: 4, exams: EXS[4], sub: 'max and min',
    make(rng) {
      const u = int(rng, 1, 5), v = int(rng, 1, 5), d = choose(rng, [[60, '\\dfrac\\pi3', 0.5], [120, '\\dfrac{2\\pi}3', -0.5], [90, '\\dfrac\\pi2', 0]]);
      const amp = Math.sqrt(u * u + v * v + 2 * u * v * d[2]);
      const answer = +amp.toFixed(3);
      return { u, v, ang: d[0], answer, tol: 0.01,
        q: R`Find the greatest value of $${u}\sin x+${v}\sin\left(x+${d[1]}\right)$ to two decimals.`,
        sol: R`<p>Expand: $\sin\left(x+${d[1]}\right)=\sin x\cos${d[0]}^\circ+\cos x\sin${d[0]}^\circ$. The expression becomes $A\sin x+B\cos x$ with $A=${u}+${v}\cos${d[0]}^\circ=${+(u + v * Math.cos(d[0] * Math.PI / 180)).toFixed(3)}$ and $B=${v}\sin${d[0]}^\circ=${+(v * Math.sin(d[0] * Math.PI / 180)).toFixed(3)}$.</p><p>Greatest value $=\sqrt{A^2+B^2}=\sqrt{${u * u}+${v * v}+${2 * u * v}\cos${d[0]}^\circ}\approx${answer}$.</p>` };
    },
    verify(p) { const r = Math.PI / 180; let best = -1e9; for (let x = 0; x < 6.2832; x += 0.0005) best = Math.max(best, p.u * Math.sin(x) + p.v * Math.sin(x + p.ang * r)); return best; },
  },
  {
    id: 'tr-g10', type: 'nat', format: 'numeric', level: 2, exams: EXS[2], sub: 'radian measure',
    make(rng) {
      const r = choose(rng, [5, 7, 10, 12, 14, 21]); const th = choose(rng, [30, 45, 60, 72, 120, 150]);
      const answer = +(r * th * Math.PI / 180).toFixed(3);
      return { r, th, answer, tol: 0.02,
        q: R`An arc of a circle of radius $${r}$ cm subtends $${th}^\circ$ at the centre. Find its length in cm (take $\pi=3.1416$).`,
        sol: R`<p>$\theta=${th}\times\dfrac\pi{180}=${piFr(th, 180)}$ rad. Arc $=r\theta=${r}\times${piFr(th, 180)}\approx${answer}$ cm.</p>`, unit: 'cm' };
    },
    verify(p) { return p.r * (p.th / 180) * Math.PI; },
  },
  {
    id: 'tr-g11', type: 'mcq', format: 'single', level: 3, exams: EXS[3], sub: 'periods',
    make(rng) {
      let a, b;
      do { a = int(rng, 2, 10); b = int(rng, 2, 10); } while (a === b || a % b === 0 || b % a === 0 || gcd(a, b) < 2);
      const g = gcd(a, b), l = a * b / g;
      const ok = `$${piFr(2, g)}$`;
      const wr = [`$${piFr(2, l)}$`, `$${piFr(2, a)}$`, `$${piFr(2, b)}$`];
      const { options, answer } = shuffleOpts(rng, ok, wr);
      return { a, b, g, options, answer,
        q: R`The period of $\sin${a}x+\cos${b}x$ is`,
        sol: R`<p>$\sin${a}x$ has period $${piFr(2, a)}$ and $\cos${b}x$ has period $${piFr(2, b)}$. The sum repeats when both repeat: the least common multiple of $\dfrac{2\pi}{${a}}$ and $\dfrac{2\pi}{${b}}$ is $\dfrac{2\pi}{\gcd(${a},${b})}=${ok.slice(1, -1)}$.</p>` };
    },
    verify(p) { const T = 2 * Math.PI / p.g; const f = (x) => Math.sin(p.a * x) + Math.cos(p.b * x); const per = (t) => [0.3, 1.1, 2.9].every((x) => Math.abs(f(x + t) - f(x)) < 1e-9); if (!per(T)) return -1; for (let m = 2; m <= 12; m++) if (per(T / m)) return -1; return p.answer; },
  },
  {
    id: 'tr-g12', type: 'mcq', format: 'single', level: 2, exams: EXS[2], sub: 'quadrants',
    make(rng) {
      const [a, b, c] = choose(rng, TRI.slice(0, 4)); const quad = choose(rng, [2, 3, 4]);
      const sgn = quad === 3 ? 1 : -1; // tan sign: Q2 negative, Q3 positive, Q4 negative
      const knownText = quad === 2 ? `\\sin\\theta=\\dfrac{${a}}{${c}}` : quad === 3 ? `\\sin\\theta=-\\dfrac{${a}}{${c}}` : `\\cos\\theta=\\dfrac{${b}}{${c}}`;
      let ans;
      if (quad === 4) ans = -a / b; else ans = sgn * a / b;
      const ok = `$${sgn < 0 ? '-' : ''}${fr(a, b)}$`;
      const wr = [`$${sgn < 0 ? '' : '-'}${fr(a, b)}$`, `$${sgn < 0 ? '-' : ''}${fr(b, a)}$`, `$${sgn < 0 ? '' : '-'}${fr(b, a)}$`];
      const { options, answer } = shuffleOpts(rng, ok, wr);
      const qname = ['', '', 'second', 'third', 'fourth'][quad];
      return { quad, a, b, c, ans, options, answer,
        q: R`$\theta$ lies in the ${qname} quadrant and $${knownText}$. Then $\tan\theta$ equals`,
        sol: R`<p>The other ratio has size $\dfrac{${b}}{${c}}$ (since $${a}^2+${b}^2=${c}^2$). So $|\tan\theta|=\dfrac{${a}}{${b}}$.</p><p>In the ${qname} quadrant tangent is ${sgn < 0 ? 'negative' : 'positive'}, so $\tan\theta=${ok.slice(1, -1)}$.</p>` };
    },
    verify(p) { let th; if (p.quad === 2) th = Math.PI - Math.asin(p.a / p.c); else if (p.quad === 3) th = Math.PI + Math.asin(p.a / p.c); else th = -Math.acos(p.b / p.c); const t = Math.tan(th); return Math.abs(t - p.ans) < 1e-9 ? p.answer : -1; },
  },
  {
    id: 'tr-g13', type: 'nat', format: 'numeric', level: 3, exams: EXS[3], sub: 'conditional identities',
    make(rng) {
      const A = int(rng, 30, 80), B = int(rng, 30, 80); const C = 180 - A - B;
      const r = Math.PI / 180; const answer = +(4 * Math.sin(A * r) * Math.sin(B * r) * Math.sin(C * r)).toFixed(4);
      return { A, B, C, answer, tol: 0.002,
        q: R`In a triangle, $A=${A}^\circ$, $B=${B}^\circ$ and $C=${C}^\circ$. Find $\sin2A+\sin2B+\sin2C$ to three decimals.`,
        sol: R`<p>For $A+B+C=\pi$, $\sin2A+\sin2B+\sin2C=4\sin A\sin B\sin C$.</p><p>$=4\times${fmt(Math.sin(A * r), 4)}\times${fmt(Math.sin(B * r), 4)}\times${fmt(Math.sin(C * r), 4)}\approx${answer}$.</p>` };
    },
    verify(p) { const r = Math.PI / 180; return Math.sin(2 * p.A * r) + Math.sin(2 * p.B * r) + Math.sin(2 * p.C * r); },
  },
  {
    id: 'tr-g14', type: 'nat', format: 'numeric', level: 4, exams: EXS[4], sub: 'products of cosines',
    make(rng) {
      const n = int(rng, 2, 5); const sign = choose(rng, [1, -1]); const d = 2 ** n + sign;
      const val = (sign === 1 ? 1 : -1) / 2 ** n;
      const terms = []; for (let k = 0; k < n; k++) terms.push(k === 0 ? `\\cos A` : `\\cos${2 ** k}A`);
      return { n, sign, d, answer: val, tol: 0.0005,
        q: R`With $A=\dfrac{\pi}{${d}}$, find $${terms.join('')}$.`,
        sol: R`<p>$\cos A\cos2A\cdots\cos2^{${n - 1}}A=\dfrac{\sin2^{${n}}A}{2^{${n}}\sin A}$.</p><p>$2^{${n}}A=\dfrac{${2 ** n}\pi}{${d}}=\pi${sign === 1 ? '-' : '+'}A$, so $\sin2^{${n}}A=${sign === 1 ? '' : '-'}\sin A$ (sine of $\pi-A$ is $\sin A$; of $\pi+A$ is $-\sin A$).</p><p>Product $=${val < 0 ? '-' : ''}\dfrac1{${2 ** n}}=${val}$.</p>` };
    },
    verify(p) { const A = Math.PI / p.d; let q = 1; for (let k = 0; k < p.n; k++) q *= Math.cos(2 ** k * A); return q; },
  },
];



// ===== expansion begin =====
const Px = (id, l, s, g, q, c, w, sol, tr, more = {}) => ({ ...P(id, l, s, g, q, c, w, sol, tr), ...more });
const PIx = (id, l, s, g, q, a, sol, tr, more = {}) => ({ ...PI(id, l, s, g, q, a, sol, tr), ...more });
const PNx = (id, l, s, g, q, a, t, sol, tr, more = {}) => ({ ...PN(id, l, s, g, q, a, t, sol, tr), ...more });
// Expansion pass (2026-11-22): more L3-L5 items, new match/multi/passage items and templates. New ids tr-x001.. and tr-g15..
const PIV = Math.PI, dg = (d) => (d * PIV) / 180;
const sn = Math.sin, cs = Math.cos, tn = Math.tan;
const near = (a, b, e = 1e-9) => Math.abs(a - b) < e;
/** single-answer item whose key is checked numerically: truth() is the number; each option carries its own number */
const MV = (id, lv, sub, q, truth, corr, wrongs, sol, trap) => {
  const it = M(id, lv, sub, q, corr[0], wrongs.map((w) => w[0]), sol, trap);
  const vals = wrongs.map((w) => w[1]); vals.splice(it.answer, 0, corr[1]);
  it.calc = () => vals.findIndex((v) => near(v, truth(), 1e-7));
  return it;
};
const XT = (id, lv, sub, q, rows, trap) => X(id, lv, sub, q, rows.map((r) => r[0]), rows.map((r, i) => (r[1] ? i : -1)).filter((i) => i >= 0),
  '<p>' + rows.map((r) => `${r[1] ? '✓' : '✗'} ${r[2]}`).join(' ') + '</p>', trap);
const sample = (f, a, b, n = 20000) => { let mx = -Infinity, mn = Infinity; for (let i = 0; i <= n; i++) { const v = f(a + (b - a) * i / n); if (v > mx) mx = v; if (v < mn) mn = v; } return { mx, mn }; };
const isPer = (f, T) => [0.3, 1.1, 2.2, 4.4, 5.7].every((x) => near(f(x + T), f(x), 1e-9));
const triExt = (f) => { let mx = -Infinity, mn = Infinity; const n = 400; for (let i = 1; i < n; i++) for (let j = 1; i + j < n; j++) { const A = PIV * i / n, B = PIV * j / n, C = PIV - A - B; const v = f(A, B, C); if (v > mx) mx = v; if (v < mn) mn = v; } return { mx, mn }; };
const acuteExt = (f) => { let mx = -Infinity, mn = Infinity; const n = 400; for (let i = 1; i < n; i++) for (let j = 1; i + j < n; j++) { const A = PIV * i / n, B = PIV * j / n, C = PIV - A - B; if (A >= PIV / 2 || B >= PIV / 2 || C >= PIV / 2) continue; const v = f(A, B, C); if (v > mx) mx = v; if (v < mn) mn = v; } return { mx, mn }; };

Object.assign(groups, {
  mx1: { title: 'Exact values', passage: R`<p>Match each value in List I with its exact form in List II.</p>`,
    list1: ['A. $\\sin15^\\circ$', 'B. $\\sin18^\\circ$', 'C. $\\sin54^\\circ$', 'D. $\\cos15^\\circ$'],
    list2: ['p. $\\dfrac{\\sqrt6-\\sqrt2}4$', 'q. $\\dfrac{\\sqrt5-1}4$', 'r. $\\dfrac{\\sqrt5+1}4$', 's. $\\dfrac{\\sqrt6+\\sqrt2}4$'] },
  mx2: { title: 'Periods', passage: R`<p>Match each function in List I with its (smallest positive) period in List II.</p>`,
    list1: ['A. $|\\sin x|$', 'B. $\\sin\\dfrac x2$', 'C. $\\tan2x$', 'D. $\\sin3x+\\cos2x$'], list2: ['p. $\\dfrac\\pi2$', 'q. $\\pi$', 'r. $2\\pi$', 's. $4\\pi$'] },
  mx3: { title: 'Products and sums of special angles', passage: R`<p>Match each expression in List I with its value in List II.</p>`,
    list1: ['A. $\\cos20^\\circ\\cos40^\\circ\\cos80^\\circ$', 'B. $\\sin20^\\circ\\sin40^\\circ\\sin80^\\circ$', 'C. $\\tan20^\\circ\\tan40^\\circ\\tan80^\\circ$', 'D. $\\cos20^\\circ+\\cos100^\\circ+\\cos140^\\circ$'],
    list2: ['p. $\\dfrac18$', 'q. $\\dfrac{\\sqrt3}8$', 'r. $\\sqrt3$', 's. $0$'] },
  mx4: { title: 'Greatest values', passage: R`<p>Match each function in List I with its greatest value in List II.</p>`,
    list1: ['A. $3\\sin x+4\\cos x$', 'B. $1+\\sin x\\cos x$', 'C. $\\sin^4x+\\cos^4x$', 'D. $\\cos^2x-\\sin x$'], list2: ['p. $\\dfrac54$', 'q. $\\dfrac32$', 'r. $5$', 's. $1$'] },
  mx5: { title: 'Tangents of special angles', passage: R`<p>Match each value in List I with its exact form in List II.</p>`,
    list1: ['A. $\\tan15^\\circ$', 'B. $\\tan75^\\circ$', 'C. $\\tan22.5^\\circ$', 'D. $\\tan67.5^\\circ$'], list2: ['p. $\\sqrt2-1$', 'q. $\\sqrt2+1$', 'r. $2-\\sqrt3$', 's. $2+\\sqrt3$', 't. $\\sqrt3-1$'] },
  mx6: { title: 'Least values', passage: R`<p>Match each expression in List I with its least value in List II (over all allowed $x$).</p>`,
    list1: ['A. $4\\sin^2x+9\\operatorname{cosec}^2x$', 'B. $\\tan^2x+\\cot^2x$', 'C. $\\sec^2x+\\operatorname{cosec}^2x$', 'D. $2\\sin x+\\operatorname{cosec}x$ for $0<x<\\pi$'], list2: ['p. $2$', 'q. $4$', 'r. $13$', 's. $2\\sqrt2$'] },
  mx7: { title: 'Sums and products at multiples of π/7', passage: R`<p>Match each expression in List I with its value in List II.</p>`,
    list1: ['A. $\\sum_{k=1}^{6}\\cos\\dfrac{2k\\pi}7$', 'B. $\\sum_{k=1}^{7}\\sin\\dfrac{2k\\pi}7$', 'C. $\\cos\\dfrac\\pi7\\cos\\dfrac{2\\pi}7\\cos\\dfrac{3\\pi}7$', 'D. $\\sum_{k=1}^{3}\\cos\\dfrac{2k\\pi}7$'],
    list2: ['p. $-1$', 'q. $0$', 'r. $\\dfrac18$', 's. $-\\dfrac12$'] },
  mx8: { title: 'Extreme values in a triangle', passage: R`<p>In a triangle $ABC$ (acute where stated) match each extreme value in List I with its number in List II.</p>`,
    list1: ['A. Greatest value of $\\sin A+\\sin B+\\sin C$', 'B. Greatest value of $\\cos A+\\cos B+\\cos C$', 'C. Least value of $\\tan A+\\tan B+\\tan C$ (acute triangle)', 'D. Greatest value of $\\sin\\dfrac A2\\sin\\dfrac B2\\sin\\dfrac C2$'],
    list2: ['p. $\\dfrac18$', 'q. $\\dfrac32$', 'r. $\\dfrac{3\\sqrt3}2$', 's. $3\\sqrt3$'] },
  pz3: { title: 'Passage: a triangle with tan A = 1/2 and tan B = 1/3', passage: R`<p>In a triangle $ABC$, $\tan A=\dfrac12$ and $\tan B=\dfrac13$.</p>` },
  pz4: { title: 'Passage: sin A = 3/5 and cos B = 5/13', passage: R`<p>In a triangle $ABC$ the angles $A$ and $B$ are acute, $\sin A=\dfrac35$ and $\cos B=\dfrac5{13}$. So $\cos A=\dfrac45$ and $\sin B=\dfrac{12}{13}$.</p>` },
});

// ----- L2 -----
items.push(
  MV('tr-x001', 2, 'arc and sector', R`A sector of a circle of radius 12 cm has angle $75^\circ$ at the centre. Its area is`, () => 0.5 * 144 * dg(75), [R`$30\pi\ \text{cm}^2$`, 30 * PIV], [[R`$60\pi\ \text{cm}^2$`, 60 * PIV], [R`$15\pi\ \text{cm}^2$`, 15 * PIV], [R`$72\pi\ \text{cm}^2$`, 72 * PIV]],
    R`<p>Convert: $75^\circ=\dfrac{5\pi}{12}$. Area $=\dfrac12r^2\theta=\dfrac12\times144\times\dfrac{5\pi}{12}=30\pi$.</p>`, 'The formula $\\frac12r^2\\theta$ needs $\\theta$ in radians.'),
  MV('tr-x002', 2, 'allied angles', R`The value of $\cos105^\circ$ is`, () => cs(dg(105)), [R`$-\dfrac{\sqrt6-\sqrt2}4$`, -(Math.sqrt(6) - Math.sqrt(2)) / 4], [[R`$\dfrac{\sqrt6-\sqrt2}4$`, (Math.sqrt(6) - Math.sqrt(2)) / 4], [R`$-\dfrac{\sqrt6+\sqrt2}4$`, -(Math.sqrt(6) + Math.sqrt(2)) / 4], [R`$\dfrac{\sqrt6+\sqrt2}4$`, (Math.sqrt(6) + Math.sqrt(2)) / 4]],
    R`<p>$\cos105^\circ=\cos(90^\circ+15^\circ)=-\sin15^\circ=-\dfrac{\sqrt6-\sqrt2}4$.</p>`, 'Cosine is negative in the second quadrant, and $\\cos(90^\\circ+\\theta)=-\\sin\\theta$.'),
  MV('tr-x003', 2, 'quadrants', R`If $\sin A=\dfrac5{13}$ and $A$ lies in the second quadrant, then $\tan A$ equals`, () => -5 / 12, [R`$-\dfrac5{12}$`, -5 / 12], [[R`$\dfrac5{12}$`, 5 / 12], [R`$-\dfrac{12}5$`, -12 / 5], [R`$-\dfrac5{13}$`, -5 / 13]],
    R`<p>$\cos A=-\sqrt{1-\frac{25}{169}}=-\dfrac{12}{13}$ in the second quadrant. $\tan A=\dfrac{5/13}{-12/13}=-\dfrac5{12}$.</p>`, 'Choose the sign of $\\cos A$ from the quadrant.'),
  I('tr-x004', 2, 'radian measure', R`Express $\dfrac{7\pi}{20}$ radians in degrees (give the number of degrees).`, 63,
    R`<p>$\dfrac{7\pi}{20}\times\dfrac{180}{\pi}=7\times9=63$.</p>`, 'Multiply by $180/\\pi$.', { calc: () => Math.round(7 * PIV / 20 * 180 / PIV) }),
  MV('tr-x005', 2, 'period', R`The period of $\cos^2 3x$ is`, () => PIV / 3, [R`$\dfrac\pi3$`, PIV / 3], [[R`$\dfrac{2\pi}3$`, 2 * PIV / 3], [R`$\dfrac\pi6$`, PIV / 6], [R`$\pi$`, PIV]],
    R`<p>$\cos^23x=\dfrac{1+\cos6x}2$, and $\cos6x$ has period $\dfrac{2\pi}6=\dfrac\pi3$.</p>`, 'Squaring halves the period of $\\cos3x$.'),
  MV('tr-x006', 2, 'quadrants', R`If $\tan\theta=\dfrac34$ and $\theta$ lies in the third quadrant, then $\sin\theta$ equals`, () => -3 / 5, [R`$-\dfrac35$`, -3 / 5], [[R`$\dfrac35$`, 3 / 5], [R`$-\dfrac45$`, -4 / 5], [R`$-\dfrac34$`, -3 / 4]],
    R`<p>The hypotenuse of the 3-4-5 triangle is 5. In the third quadrant both $\sin\theta$ and $\cos\theta$ are negative, so $\sin\theta=-\dfrac35$.</p>`, 'The sign comes from the quadrant; the size from the triangle.'),
);

// ----- L3 -----
const rootNeg = (() => { let c = 0; for (let k = 1; k <= 24; k++) if (sn(dg(15 * k)) < -1e-9) c++; return c; })();
const cosSq12 = (() => { let s = 0; for (let k = 1; k <= 12; k++) s += cs(k * PIV / 12) ** 2; return Math.round(s); })();
const intsIn = (() => { let c = 0; for (let v = -11; v <= 15; v++) c++; return c; })();
items.push(
  MV('tr-x007', 3, 'multiple angles', R`If $\tan\theta=\dfrac12$, then $\tan3\theta$ equals`, () => tn(3 * Math.atan(0.5)), [R`$\dfrac{11}2$`, 5.5], [[R`$\dfrac32$`, 1.5], [R`$\dfrac{11}{4}$`, 2.75], [R`$\dfrac{5}{2}$`, 2.5]],
    R`<p>$\tan3\theta=\dfrac{3t-t^3}{1-3t^2}$ with $t=\dfrac12$: numerator $\dfrac32-\dfrac18=\dfrac{11}8$; denominator $1-\dfrac34=\dfrac14$. So $\tan3\theta=\dfrac{11}8\times4=\dfrac{11}2$.</p>`, 'Keep the denominator $1-3t^2$.'),
  I('tr-x008', 3, 'sums of squares', R`Find $\sum_{k=1}^{12}\cos^2\dfrac{k\pi}{12}$.`, cosSq12,
    R`<p>$\cos^2\alpha=\dfrac{1+\cos2\alpha}2$. The sum is $6+\dfrac12\sum_{k=1}^{12}\cos\dfrac{k\pi}6$. The cosines of the 12 equally spaced angles $\dfrac{k\pi}6$ ($k=1..12$) add up to 0. So the sum is 6.</p>`, 'Equally spaced cosines around the circle cancel.', { calc: () => cosSq12 }),
  I('tr-x009', 3, 'clock angle', R`Find the angle in degrees between the hour hand and the minute hand of a clock at 3:20.`, 20,
    R`<p>Minute hand: $20\times6=120^\circ$ from 12. Hour hand: $3\times30+20\times0.5=100^\circ$. The difference is $20^\circ$.</p>`, 'The hour hand has moved past the 3.', { calc: () => Math.abs(30 * 3 + 0.5 * 20 - 6 * 20) }),
  MV('tr-x010', 3, 'period', R`The period of $f(x)=\sin\dfrac x3+\cos\dfrac x2$ is`, () => 12 * PIV, [R`$12\pi$`, 12 * PIV], [[R`$6\pi$`, 6 * PIV], [R`$4\pi$`, 4 * PIV], [R`$24\pi$`, 24 * PIV]],
    R`<p>$\sin\dfrac x3$ has period $6\pi$ and $\cos\dfrac x2$ has period $4\pi$. The period of the sum is the LCM: $\operatorname{lcm}(6\pi,4\pi)=12\pi$.</p>`, 'Take the LCM, not the larger one.'),
  I('tr-x011', 3, 'max and min', R`How many integers lie in the range of $f(x)=5\sin x+12\cos x+2$?`, intsIn,
    R`<p>$5\sin x+12\cos x$ ranges over $[-13,13]$, so $f$ ranges over $[-11,15]$. The integers from $-11$ to $15$ number $27$.</p>`, 'Count both end values.', { calc: () => { const { mx, mn } = sample((x) => 5 * sn(x) + 12 * cs(x) + 2, 0, 2 * PIV); return Math.floor(mx + 1e-6) - Math.ceil(mn - 1e-6) + 1; } }),
  MV('tr-x012', 3, 'identities', R`If $\sin\theta-\cos\theta=\dfrac13$, then $\sin2\theta$ equals`, () => 8 / 9, [R`$\dfrac89$`, 8 / 9], [[R`$\dfrac19$`, 1 / 9], [R`$\dfrac{10}9$`, 10 / 9], [R`$-\dfrac89$`, -8 / 9]],
    R`<p>Square: $1-\sin2\theta=\dfrac19$, so $\sin2\theta=\dfrac89$.</p>`, 'Square both sides and use $\\sin^2+\\cos^2=1$.'),
  I('tr-x013', 3, 'triangle identities', R`In a triangle $ABC$, $\cot A=2$ and $\cot B=3$. Find the angle $C$ in degrees.`, 135,
    R`<p>In a triangle $\cot A\cot B+\cot B\cot C+\cot C\cot A=1$. So $6+5\cot C=1$ and $\cot C=-1$, giving $C=135^\circ$.</p>`, 'The angle must be obtuse because $\\cot C<0$.', { calc: () => Math.round(180 - (Math.atan(1 / 2) + Math.atan(1 / 3)) * 180 / PIV) }),
  MV('tr-x014', 3, 'special angles', R`The value of $\cos54^\circ$ is`, () => cs(dg(54)), [R`$\dfrac{\sqrt{10-2\sqrt5}}4$`, Math.sqrt(10 - 2 * Math.sqrt(5)) / 4], [[R`$\dfrac{\sqrt5+1}4$`, (Math.sqrt(5) + 1) / 4], [R`$\dfrac{\sqrt{10+2\sqrt5}}4$`, Math.sqrt(10 + 2 * Math.sqrt(5)) / 4], [R`$\dfrac{\sqrt5-1}4$`, (Math.sqrt(5) - 1) / 4]],
    R`<p>$\cos54^\circ=\sin36^\circ$. From $\cos36^\circ=\dfrac{\sqrt5+1}4$: $\sin^236^\circ=1-\dfrac{6+2\sqrt5}{16}=\dfrac{10-2\sqrt5}{16}$, so $\sin36^\circ=\dfrac{\sqrt{10-2\sqrt5}}4$.</p>`, '$\\frac{\\sqrt5+1}4$ is $\\cos36^\\circ$, not $\\cos54^\\circ$.'),
  MV('tr-x015', 3, 'graphs', R`For $y=3\sin\left(2x+\dfrac\pi3\right)-1$, the sum of the greatest and the least values of $y$ is`, () => { const { mx, mn } = sample((x) => 3 * sn(2 * x + PIV / 3) - 1, 0, 2 * PIV); return mx + mn; }, [R`$-2$`, -2], [[R`$2$`, 2], [R`$0$`, 0], [R`$-4$`, -4]],
    R`<p>Greatest $=3-1=2$, least $=-3-1=-4$. Sum $=-2$.</p>`, 'The shift $-1$ moves both extremes.'),
  A('tr-x016', 3, 'tangent form', R`$\sin2A=\dfrac{2\tan A}{1+\tan^2A}$ for every real $A$.`, R`$\sin2A=2\sin A\cos A$ and $1+\tan^2A=\sec^2A$.`, 3,
    R`<p>R is true, and dividing gives the formula wherever $\tan A$ exists. But at $A=\dfrac\pi2$, $\tan A$ is not defined while $\sin2A=0$. So A ("for every real $A$") is false.</p>`, '"Every real" fails where $\\tan A$ is not defined.'),
  S('tr-x017', 3, 'signs in radians', R`$\sin4>0$ (angle in radians).`, R`$\cos4<0$ (angle in radians).`, 2,
    R`<p>$4$ radians is between $\pi\approx3.14$ and $\dfrac{3\pi}2\approx4.71$, the third quadrant, where both sine and cosine are negative. So I is false, II is true.</p>`, 'Locate the angle between multiples of $\\pi/2\\approx1.57$.'),
  MT('tr-x018', 3, 'exact values', 'mx1', R`Match List I with List II.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-r, C-q, D-s', 'A-s, B-q, C-r, D-p'],
    R`<p>$\sin15^\circ=\dfrac{\sqrt6-\sqrt2}4$ (p); $\sin18^\circ=\dfrac{\sqrt5-1}4$ (q); $\sin54^\circ=\cos36^\circ=\dfrac{\sqrt5+1}4$ (r); $\cos15^\circ=\dfrac{\sqrt6+\sqrt2}4$ (s).</p>`, '$\\sin54^\\circ=\\cos36^\\circ$.'),
  MT('tr-x019', 3, 'period', 'mx2', R`Match List I with List II.`, 'A-q, B-s, C-p, D-r', ['A-p, B-s, C-q, D-r', 'A-q, B-s, C-r, D-p', 'A-q, B-r, C-p, D-s'],
    R`<p>$|\sin x|$: $\pi$ (q). $\sin\dfrac x2$: $4\pi$ (s). $\tan2x$: $\dfrac\pi2$ (p). $\sin3x$ has period $\dfrac{2\pi}3$ and $\cos2x$ has period $\pi$; LCM $=2\pi$ (r).</p>`, 'Take the LCM of the two periods.'),
  Px('tr-x020', 3, 'compound angles', 'pz3', R`Find $\tan(A+B)$.`, '1', ['$\\dfrac56$', '$-1$', '$\\dfrac15$'],
    R`<p>$\tan(A+B)=\dfrac{\frac12+\frac13}{1-\frac16}=\dfrac{5/6}{5/6}=1$.</p>`, 'The denominator is $1-\\tan A\\tan B$.'),
  PIx('tr-x021', 3, 'triangle', 'pz3', R`Find the largest angle of the triangle in degrees.`, 135,
    R`<p>$A+B=45^\circ$ since $\tan(A+B)=1$ with both acute and small. So $C=180^\circ-45^\circ=135^\circ$, the largest angle.</p>`, 'Subtract from $180^\\circ$.', { calc: () => Math.round(180 - (Math.atan(0.5) + Math.atan(1 / 3)) * 180 / PIV) }),
  PNx('tr-x022', 3, 'triangle', 'pz3', R`Find $\sin A\sin B\sin C$ (as a decimal, 2 places).`, 0.1, 0.005,
    R`<p>$\sin A=\dfrac1{\sqrt5}$, $\sin B=\dfrac1{\sqrt{10}}$, $\sin C=\sin135^\circ=\dfrac1{\sqrt2}$. Product $=\dfrac1{\sqrt{5\cdot10\cdot2}}=\dfrac1{10}=0.1$.</p>`, 'Use $\\sin\\theta=\\tan\\theta/\\sqrt{1+\\tan^2\\theta}$.', { calc: () => sn(Math.atan(0.5)) * sn(Math.atan(1 / 3)) * sn(dg(135)) }),
);

// ----- L4 -----
const solCos = (() => { let c = 0; const f = (x) => cs(x) - x / 12; let prev = f(-12); for (let i = 1; i <= 240000; i++) { const x = -12 + 24 * i / 240000; const v = f(x); if (prev === 0 || prev * v < 0) c++; prev = v; } return c; })();
const fit5 = (() => { // cos5θ = a c^5 + b c^3 + c1 c  -> solve by three angles
  const rows = [0.3, 0.7, 1.1].map((t) => [cs(t) ** 5, cs(t) ** 3, cs(t), cs(5 * t)]);
  const [r1, r2, r3] = rows; const det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const A = [[r1[0], r1[1], r1[2]], [r2[0], r2[1], r2[2]], [r3[0], r3[1], r3[2]]]; const d = det(A);
  const col = (k) => det(A.map((r, i) => r.map((v, j) => (j === k ? rows[i][3] : v))));
  return [col(0) / d, col(1) / d, col(2) / d]; })();
const prodSin7 = sn(PIV / 7) * sn(2 * PIV / 7) * sn(3 * PIV / 7);
const sumSin9 = (() => { let s = 0; for (let k = 1; k <= 8; k++) s += sn(k * PIV / 9) ** 2; return s; })();
items.push(
  I('tr-x023', 4, 'identities', R`Find the value of $4(\sin^6x+\cos^6x)-6(\sin^4x+\cos^4x)+5$.`, 3,
    R`<p>Let $p=\sin^2x\cos^2x$. $\sin^4x+\cos^4x=1-2p$ and $\sin^6x+\cos^6x=1-3p$. So the expression is $4(1-3p)-6(1-2p)+5=4-12p-6+12p+5=3$.</p>`, 'The terms in $p$ cancel.', { calc: () => { const x = 0.7; return Math.round(4 * (sn(x) ** 6 + cs(x) ** 6) - 6 * (sn(x) ** 4 + cs(x) ** 4) + 5); } }),
  I('tr-x024', 4, 'products of cosines', R`Find $16\cos\dfrac\pi9\cos\dfrac{2\pi}9\cos\dfrac{3\pi}9\cos\dfrac{4\pi}9$.`, 1,
    R`<p>$\cos\dfrac{3\pi}9=\cos60^\circ=\dfrac12$. Also $\cos20^\circ\cos40^\circ\cos80^\circ=\dfrac18$ (here $\cos80^\circ=\cos\dfrac{4\pi}9$). So the product is $16\times\dfrac12\times\dfrac18=1$.</p>`, '$4\\pi/9$ is $80^\\circ$.', { calc: () => Math.round(16 * cs(PIV / 9) * cs(2 * PIV / 9) * cs(3 * PIV / 9) * cs(4 * PIV / 9)) }),
  I('tr-x025', 4, 'graphs', R`Find the number of real solutions of $\cos x=\dfrac x{12}$.`, solCos,
    R`<p>The line $y=\dfrac x{12}$ stays within $[-1,1]$ only for $-12\le x\le12$, so all solutions lie there. On that stretch the cosine curve (period $2\pi\approx6.28$) makes nearly 4 full waves while the line rises very slowly from $-1$ to $1$. Checking the sign of $g(x)=\cos x-\dfrac x{12}$ along the interval, it changes sign exactly at the seven points $x\approx-10.0,\,-8.7,\,-4.3,\,-1.7,\,1.5,\,5.2,\,7.2$. So there are 7 solutions.</p>`, 'The line is slanted, so solutions exist only where $|x|\\le12$.', { calc: () => solCos }),
  I('tr-x026', 4, 'multiple angles', R`If $\cos5\theta=a\cos^5\theta+b\cos^3\theta+c\cos\theta$ for all $\theta$, find $a^2+b^2+c^2$.`, 681,
    R`<p>$\cos5\theta=16\cos^5\theta-20\cos^3\theta+5\cos\theta$ (Chebyshev polynomial $T_5$). So $a^2+b^2+c^2=256+400+25=681$.</p>`, 'Mind the sign of $b$; it is squared anyway.', { calc: () => Math.round(fit5[0] ** 2 + fit5[1] ** 2 + fit5[2] ** 2) }),
  I('tr-x027', 4, 'products', R`Find $16\left(1+\cos\dfrac\pi8\right)\left(1+\cos\dfrac{3\pi}8\right)\left(1+\cos\dfrac{5\pi}8\right)\left(1+\cos\dfrac{7\pi}8\right)$.`, 2,
    R`<p>$\left(1+\cos\dfrac\pi8\right)\left(1+\cos\dfrac{7\pi}8\right)=1-\cos^2\dfrac\pi8=\sin^2\dfrac\pi8$, and the other pair gives $\sin^2\dfrac{3\pi}8=\cos^2\dfrac\pi8$. The product is $\sin^2\dfrac\pi8\cos^2\dfrac\pi8=\left(\dfrac{\sin\frac\pi4}2\right)^2=\dfrac18$. Times 16 gives 2.</p>`, 'Pair $\\theta$ with $\\pi-\\theta$.', { calc: () => Math.round(16 * (1 + cs(PIV / 8)) * (1 + cs(3 * PIV / 8)) * (1 + cs(5 * PIV / 8)) * (1 + cs(7 * PIV / 8))) }),
  I('tr-x028', 4, 'special angles', R`Find $\left(\cot70^\circ+4\cos70^\circ\right)^2$.`, 3,
    R`<p>$\cot70^\circ+4\cos70^\circ=\dfrac{\cos70^\circ+4\sin70^\circ\cos70^\circ}{\sin70^\circ}=\dfrac{\sin20^\circ+2\sin40^\circ}{\cos20^\circ}$ (using $\cos70^\circ=\sin20^\circ$, $2\sin70^\circ\cos70^\circ=\sin140^\circ=\sin40^\circ$, $\sin70^\circ=\cos20^\circ$). Now $\sin20^\circ+\sin40^\circ=2\sin30^\circ\cos10^\circ=\cos10^\circ=\sin80^\circ$, so the numerator is $\sin80^\circ+\sin40^\circ=2\sin60^\circ\cos20^\circ=\sqrt3\cos20^\circ$. The value is $\sqrt3$, and its square is 3.</p>`, 'The value inside is $\\sqrt3$.', { calc: () => Math.round((1 / tn(dg(70)) + 4 * cs(dg(70))) ** 2) }),
);
items.push(
  N('tr-x029', 4, 'sums', R`Find $\sin^2\dfrac\pi9+\sin^2\dfrac{2\pi}9+\cdots+\sin^2\dfrac{8\pi}9$ (as a decimal).`, 4.5, 0.001,
    R`<p>$\sin^2\alpha=\dfrac{1-\cos2\alpha}2$. The sum is $4-\dfrac12\sum_{k=1}^{8}\cos\dfrac{2k\pi}9=4-\dfrac12(-1)=4.5$, because the nine equally spaced cosines add to 0 and the missing $k=9$ term is $\cos2\pi=1$.</p>`, 'The cosines for $k=1..8$ sum to $-1$.', { calc: () => sumSin9 }),
  N('tr-x030', 4, 'max and min', R`Find the greatest value of $2\sin x+3\sin\left(x+\dfrac\pi3\right)$ to 3 decimal places.`, +Math.sqrt(19).toFixed(3), 0.001,
    R`<p>$2\sin x+3\left(\dfrac12\sin x+\dfrac{\sqrt3}2\cos x\right)=3.5\sin x+\dfrac{3\sqrt3}2\cos x$. The greatest value is $\sqrt{3.5^2+\frac{27}4}=\sqrt{12.25+6.75}=\sqrt{19}\approx4.359$.</p>`, 'Expand $\\sin(x+\\pi/3)$ first.', { calc: () => sample((x) => 2 * sn(x) + 3 * sn(x + PIV / 3), 0, 2 * PIV, 200000).mx }),
  N('tr-x031', 4, 'special angles', R`Find $\tan7.5^\circ$ to 3 decimal places.`, +tn(dg(7.5)).toFixed(3), 0.001,
    R`<p>$\tan\dfrac\theta2=\dfrac{1-\cos\theta}{\sin\theta}$ with $\theta=15^\circ$: $\dfrac{1-0.9659}{0.2588}=0.1317\approx0.132$. (Exact value $\sqrt6-\sqrt3+\sqrt2-2$.)</p>`, 'Use the half-angle formula $\\tan\\frac\\theta2=\\frac{1-\\cos\\theta}{\\sin\\theta}$.', { calc: () => tn(dg(7.5)) }),
  N('tr-x032', 4, 'products of sines', R`Find $\sin\dfrac\pi7\sin\dfrac{2\pi}7\sin\dfrac{3\pi}7$ to 3 decimal places.`, +prodSin7.toFixed(3), 0.001,
    R`<p>The product of $\sin\dfrac{k\pi}7$ for $k=1..6$ is $\dfrac7{2^6}$. By symmetry $\sin\dfrac{(7-k)\pi}7=\sin\dfrac{k\pi}7$, so the square of our product is $\dfrac7{64}$ and the product is $\dfrac{\sqrt7}8\approx0.331$.</p>`, 'The product of all six sines is $7/64$; our three are the square root.', { calc: () => prodSin7 }),
);
const perOK = (f) => isPer(f, PIV);
items.push(
  XT('tr-x033', 4, 'period', R`Which of the following functions have period $\pi$?`, [
    [R`$|\tan x|$`, perOK((x) => Math.abs(tn(x))), R`$\tan x$ already has period $\pi$.`],
    [R`$\sin x+\sin2x$`, perOK((x) => sn(x) + sn(2 * x)), R`$\sin x$ has period $2\pi$, so the sum has period $2\pi$ (not $\pi$).`],
    [R`$\cos^2x-\sin^2x$`, perOK((x) => cs(x) ** 2 - sn(x) ** 2), R`it is $\cos2x$, period $\pi$.`],
    [R`$\sin\dfrac x2\cos\dfrac x2$`, perOK((x) => sn(x / 2) * cs(x / 2)), R`it is $\tfrac12\sin x$, period $2\pi$.`]], 'Rewrite each as a single trig function first.'),
  XT('tr-x034', 4, 'max and min', R`Which of the following are correct?`, [
    [R`The greatest value of $\sin^2x+\cos x$ is $\dfrac54$`, near(sample((x) => sn(x) ** 2 + cs(x), 0, 2 * PIV).mx, 1.25, 1e-6), R`$=1-\cos^2x+\cos x$, a quadratic in $\cos x$ with maximum $\dfrac54$ at $\cos x=\dfrac12$.`],
    [R`The least value of $\sin^2x+\cos x$ is $-1$`, near(sample((x) => sn(x) ** 2 + cs(x), 0, 2 * PIV).mn, -1, 1e-6), R`at $\cos x=-1$: $0-1=-1$.`],
    [R`The range of $\sin x\cos x$ is $[-1,1]$`, near(sample((x) => sn(x) * cs(x), 0, 2 * PIV).mx, 1, 1e-6), R`$\sin x\cos x=\frac12\sin2x$, range $\left[-\frac12,\frac12\right]$.`],
    [R`The greatest value of $\sin^4x+\cos^4x$ is 1`, near(sample((x) => sn(x) ** 4 + cs(x) ** 4, 0, 2 * PIV).mx, 1, 1e-6), R`$=1-\frac12\sin^22x\le1$, equal to 1 at $x=0$.`]], 'Reduce to one function of one angle.'),
  XT('tr-x035', 4, 'even and odd', R`Which of the following functions are even?`, [
    [R`$x\sin x$`, near((1.3) * sn(1.3), (-1.3) * sn(-1.3)), R`odd × odd = even.`],
    [R`$\sin x+\cos x$`, near(sn(1.3) + cs(1.3), sn(-1.3) + cs(-1.3)), R`neither: $f(-x)=-\sin x+\cos x$.`],
    [R`$\dfrac{\sin x}x$ ($x\ne0$)`, near(sn(1.3) / 1.3, sn(-1.3) / -1.3), R`odd ÷ odd = even.`],
    [R`$\tan x\sin x$`, near(tn(1.3) * sn(1.3), tn(-1.3) * sn(-1.3)), R`odd × odd = even.`]], 'Test $f(-x)$ against $f(x)$.'),
  XT('tr-x036', 4, 'triangle identities', R`$A+B+C=\pi$. Which of the following are always true?`, [
    [R`$\sin2A+\sin2B+\sin2C=4\sin A\sin B\sin C$`, [[0.4, 0.9], [1.0, 1.2]].every(([A, B]) => { const C = PIV - A - B; return near(sn(2 * A) + sn(2 * B) + sn(2 * C), 4 * sn(A) * sn(B) * sn(C)); }), R`standard identity.`],
    [R`$\cos A+\cos B+\cos C=1+4\sin\dfrac A2\sin\dfrac B2\sin\dfrac C2$`, [[0.4, 0.9], [1.0, 1.2]].every(([A, B]) => { const C = PIV - A - B; return near(cs(A) + cs(B) + cs(C), 1 + 4 * sn(A / 2) * sn(B / 2) * sn(C / 2)); }), R`standard identity.`],
    [R`$\tan\dfrac A2\tan\dfrac B2+\tan\dfrac B2\tan\dfrac C2+\tan\dfrac C2\tan\dfrac A2=1$`, [[0.4, 0.9], [1.0, 1.2]].every(([A, B]) => { const C = PIV - A - B; return near(tn(A / 2) * tn(B / 2) + tn(B / 2) * tn(C / 2) + tn(C / 2) * tn(A / 2), 1); }), R`since $\frac A2+\frac B2+\frac C2=\frac\pi2$.`],
    [R`$\cos2A+\cos2B+\cos2C=1+4\cos A\cos B\cos C$`, [[0.4, 0.9], [1.0, 1.2]].every(([A, B]) => { const C = PIV - A - B; return near(cs(2 * A) + cs(2 * B) + cs(2 * C), 1 + 4 * cs(A) * cs(B) * cs(C)); }), R`the correct identity is $-1-4\cos A\cos B\cos C$.`]], 'Check a non-equilateral triangle.'),
  XT('tr-x037', 4, 'special angles', R`Which of the following are correct?`, [
    [R`$\sin18^\circ=\dfrac{\sqrt5-1}4$`, near(sn(dg(18)), (Math.sqrt(5) - 1) / 4), R`standard value.`],
    [R`$\cos36^\circ=\dfrac{\sqrt5+1}4$`, near(cs(dg(36)), (Math.sqrt(5) + 1) / 4), R`standard value.`],
    [R`$\tan15^\circ=2-\sqrt3$`, near(tn(dg(15)), 2 - Math.sqrt(3)), R`$\tan(45^\circ-30^\circ)$.`],
    [R`$\cos72^\circ=\dfrac{\sqrt5+1}4$`, near(cs(dg(72)), (Math.sqrt(5) + 1) / 4), R`$\cos72^\circ=\dfrac{\sqrt5-1}4$; the value given is $\cos36^\circ$.`]], 'Do not swap $\\cos36^\\circ$ and $\\cos72^\\circ$.'),
  A('tr-x038', 4, 'compound angles', R`The formula $\tan(A+B)=\dfrac{\tan A+\tan B}{1-\tan A\tan B}$ cannot be used when $A+B=\dfrac\pi2$.`, R`When $A+B=\dfrac\pi2$, $\cos(A+B)=0$, so $\tan(A+B)$ is not defined.`, 0,
    R`<p>When $A+B=\dfrac\pi2$, $\tan A\tan B=1$ and the denominator is 0. This is consistent with $\tan\dfrac\pi2$ being not defined. R is true and gives the reason.</p>`, 'The denominator becomes 0.'),
  A('tr-x039', 4, 'comparing values', R`$\cos1>\cos2$ (angles in radians).`, R`$\cos x$ is an increasing function on $[0,\pi]$.`, 2,
    R`<p>$\cos1\approx0.54$ and $\cos2\approx-0.42$, so A is true. But $\cos x$ is decreasing on $[0,\pi]$, so R is false.</p>`, 'Cosine decreases from 1 to $-1$ on $[0,\pi]$.'),
  A('tr-x040', 4, 'max and min', R`For all real $x$, $(\sin x+\cos x)^2\le2$.`, R`$\sin^2x+\cos^2x=1$.`, 1,
    R`<p>$(\sin x+\cos x)^2=1+\sin2x\le2$, so A is true. R is also true but only gives the "1"; the bound comes from $\sin2x\le1$. R does not explain A.</p>`, 'R is a true fact, but not the reason.'),
  base('tr-x041', 4, 'comparing values', { type: 'mcq', format: 'statements', q: R`<p>How many of the following are correct (angles in radians)?</p><ol><li>$\sin3<\sin2$</li><li>$\cos2<\cos3$</li><li>$\tan1>1$</li><li>$\sin1>\cos1$</li></ol>`, options: ['1', '2', '3', '4'], answer: [sn(3) < sn(2), cs(2) < cs(3), tn(1) > 1, sn(1) > cs(1)].filter(Boolean).length - 1,
    sol: R`<p>$\sin3\approx0.14<\sin2\approx0.91$ true. $\cos2\approx-0.42$ and $\cos3\approx-0.99$, so $\cos2>\cos3$, (ii) false. $\tan1\approx1.56>1$ true. $\sin1\approx0.84>\cos1\approx0.54$ true. Three are correct.</p>`, trap: 'Cosine decreases on $[0,\\pi]$.' }),
  S('tr-x042', 4, 'special angles', R`$\sin18^\circ\cos36^\circ=\dfrac14$.`, R`$\sin36^\circ\cos18^\circ=\dfrac14$.`, 1,
    R`<p>I: $\dfrac{\sqrt5-1}4\cdot\dfrac{\sqrt5+1}4=\dfrac{4}{16}=\dfrac14$, true. II: $\sin36^\circ\cos18^\circ\approx0.5878\times0.9511=0.559$, false.</p>`, 'Multiply the exact forms.'),
  MT('tr-x043', 4, 'products', 'mx3', R`Match List I with List II.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    R`<p>A: $\dfrac18$ (p). B: $\dfrac{\sqrt3}8$ (q). C: $\tan20^\circ\tan40^\circ\tan80^\circ=\tan60^\circ=\sqrt3$ (r). D: $\cos20^\circ+\cos100^\circ+\cos140^\circ=0$ (s), the three angles are $120^\circ$ apart.</p>`, 'Angles $120^\\circ$ apart have cosines that add to 0.'),
  MT('tr-x044', 4, 'max and min', 'mx4', R`Match List I with List II.`, 'A-r, B-q, C-s, D-p', ['A-q, B-r, C-s, D-p', 'A-r, B-q, C-p, D-s', 'A-r, B-s, C-q, D-p'],
    R`<p>A: $\sqrt{9+16}=5$ (r). B: $1+\frac12\sin2x\le\frac32$ (q). C: $1-\frac12\sin^22x\le1$ (s). D: $\cos^2x-\sin x=1-\sin^2x-\sin x$, greatest $\frac54$ at $\sin x=-\frac12$ (p).</p>`, 'Rewrite each in a single trig function.'),
  MT('tr-x045', 4, 'special angles', 'mx5', R`Match List I with List II.`, 'A-r, B-s, C-p, D-q', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-r, B-s, C-p, D-t'],
    R`<p>$\tan15^\circ=2-\sqrt3$ (r); $\tan75^\circ=2+\sqrt3$ (s); $\tan22.5^\circ=\sqrt2-1$ (p); $\tan67.5^\circ=\sqrt2+1$ (q).</p>`, '$\\tan(90^\\circ-\\theta)=\\cot\\theta=1/\\tan\\theta$.'),
  MT('tr-x046', 4, 'max and min', 'mx6', R`Match List I with List II.`, 'A-r, B-p, C-q, D-s', ['A-p, B-r, C-q, D-s', 'A-r, B-q, C-p, D-s', 'A-r, B-p, C-s, D-q'],
    R`<p>A: with $t=\sin^2x\in(0,1]$, $4t+\dfrac9t$ is decreasing for $t<1.5$, so the least value is at $t=1$: $13$ (r) (AM-GM gives 12 but cannot be reached). B: $\ge2$ (p). C: $\sec^2x+\operatorname{cosec}^2x=\dfrac4{\sin^22x}\ge4$ (q). D: AM-GM: $2\sin x+\dfrac1{\sin x}\ge2\sqrt2$ at $\sin x=\dfrac1{\sqrt2}$ (s).</p>`, 'AM-GM needs the equality case to be reachable.'),
  Px('tr-x047', 4, 'compound angles', 'pz4', R`Find $\cos C$.`, '$\\dfrac{16}{65}$', ['$-\\dfrac{16}{65}$', '$\\dfrac{63}{65}$', '$\\dfrac{33}{65}$'],
    R`<p>$\cos C=-\cos(A+B)=-(\cos A\cos B-\sin A\sin B)=-\left(\dfrac45\cdot\dfrac5{13}-\dfrac35\cdot\dfrac{12}{13}\right)=-\dfrac{20-36}{65}=\dfrac{16}{65}$.</p>`, 'In a triangle $C=\\pi-(A+B)$.'),
  PNx('tr-x048', 4, 'compound angles', 'pz4', R`Find $\sin C$ (3 decimal places).`, 0.969, 0.001,
    R`<p>$\sin C=\sin(A+B)=\dfrac35\cdot\dfrac5{13}+\dfrac45\cdot\dfrac{12}{13}=\dfrac{15+48}{65}=\dfrac{63}{65}=0.969$.</p>`, '$\\sin C=\\sin(A+B)$.', { calc: () => 63 / 65 }),
  PIx('tr-x049', 4, 'multiple angles', 'pz4', R`Find $4225\sin2C$.`, 2016,
    R`<p>$\sin2C=2\sin C\cos C=2\cdot\dfrac{63}{65}\cdot\dfrac{16}{65}=\dfrac{2016}{4225}$. So $4225\sin2C=2016$.</p>`, 'Use $\\sin C=63/65$ and $\\cos C=16/65$.', { calc: () => Math.round(4225 * 2 * (63 / 65) * (16 / 65)) }),
);

// ----- L5 -----
const tan2sum = tn(dg(20)) ** 2 + tn(dg(40)) ** 2 + tn(dg(80)) ** 2;
const ratCount = (() => { let c = 0; for (let k = 1; k <= 180; k++) { const v = cs(dg(k)); let ok = false; for (let d = 1; d <= 12; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) { ok = true; break; } if (ok) c++; } return c; })();
const sq7 = 64 * prodCos7(); function prodCos7() { return (sn(PIV / 7) * sn(2 * PIV / 7) * sn(3 * PIV / 7)) ** 2; }
items.push(
  I('tr-x050', 5, 'roots of a cubic', R`Find $\tan^2\dfrac\pi9+\tan^2\dfrac{2\pi}9+\tan^2\dfrac{4\pi}9$.`, Math.round(tan2sum),
    R`<p>$\tan3\theta=\sqrt3$ has the solutions $\theta=20^\circ,80^\circ,140^\circ$ (mod $180^\circ$), with tangents $\tan20^\circ$, $\tan80^\circ$ and $\tan140^\circ=-\tan40^\circ$. With $t=\tan\theta$: $\dfrac{3t-t^3}{1-3t^2}=\sqrt3$ gives $t^3-3\sqrt3t^2-3t+\sqrt3=0$. Sum of roots $=3\sqrt3$, sum of products two at a time $=-3$. So $\sum t^2=(3\sqrt3)^2-2(-3)=27+6=33$, and the squares of the three tangents are the same whatever their signs.</p>`, 'Use $\\sum t^2=(\\sum t)^2-2\\sum t_it_j$.', { calc: () => Math.round(tan2sum) }),
  I('tr-x051', 5, 'products', R`Find $64\left(\sin\dfrac\pi7\sin\dfrac{2\pi}7\sin\dfrac{3\pi}7\right)^2$.`, Math.round(sq7),
    R`<p>The product of $\sin\dfrac{k\pi}7$ for $k=1,\dots,6$ equals $\dfrac7{2^6}$. Since $\sin\dfrac{(7-k)\pi}7=\sin\dfrac{k\pi}7$, that product is $\left(\sin\dfrac\pi7\sin\dfrac{2\pi}7\sin\dfrac{3\pi}7\right)^2$. So $64\times\dfrac7{64}=7$.</p>`, 'The six sines pair up into three equal pairs.', { calc: () => Math.round(sq7) }),
  I('tr-x052', 5, 'rational values', R`For how many integers $k$ with $1\le k\le180$ is $\cos k^\circ$ a rational number?`, ratCount,
    R`<p>By Niven's theorem, the only rational values of $\cos$ at rational multiples of $\pi$ are $0,\pm\frac12,\pm1$. In $1..180$ degrees: $\cos60^\circ=\frac12$, $\cos90^\circ=0$, $\cos120^\circ=-\frac12$, $\cos180^\circ=-1$. So there are 4 values of $k$ ($60,90,120,180$).</p>`, 'Check that $\\cos0^\\circ$ is not in the range.', { calc: () => ratCount }),
  I('tr-x053', 5, 'sums', R`Find $2\left(\cos\dfrac\pi9+\cos\dfrac{3\pi}9+\cos\dfrac{5\pi}9+\cos\dfrac{7\pi}9\right)$.`, 1,
    R`<p>$\cos\dfrac{3\pi}9=\dfrac12$. $\cos100^\circ=-\cos80^\circ$ and $\cos140^\circ=-\cos40^\circ$. Also $\cos40^\circ+\cos80^\circ=2\cos60^\circ\cos20^\circ=\cos20^\circ$. So the bracket equals $\cos20^\circ+\dfrac12-\cos80^\circ-\cos40^\circ=\dfrac12$, and twice it is 1.</p>`, 'Combine $\\cos40^\\circ+\\cos80^\\circ$.', { calc: () => Math.round(2 * (cs(PIV / 9) + cs(3 * PIV / 9) + cs(5 * PIV / 9) + cs(7 * PIV / 9))) }),
  N('tr-x054', 5, 'max and min', R`Find the least value of $\sin^8x+\cos^8x$ (as a decimal).`, 0.125, 0.001,
    R`<p>Let $a=\sin^2x$, $b=\cos^2x$ with $a+b=1$. By the power-mean inequality $a^4+b^4\ge2\left(\dfrac{a+b}2\right)^4=\dfrac18$, with equality when $a=b=\dfrac12$ (e.g. $x=45^\circ$).</p>`, 'Equality at $\\sin^2x=\\cos^2x$.', { calc: () => sample((x) => sn(x) ** 8 + cs(x) ** 8, 0, PIV, 200000).mn }),
  N('tr-x055', 5, 'triangle extremes', R`In a triangle $ABC$, find the greatest value of $\sin A\sin B\sin C$ to 3 decimal places.`, 0.65, 0.001,
    R`<p>By AM-GM on logs (or Jensen's inequality for $\ln\sin$, which is concave), the product is greatest for the equilateral triangle: $\left(\dfrac{\sqrt3}2\right)^3=\dfrac{3\sqrt3}8\approx0.650$.</p>`, 'The equilateral triangle gives the maximum.', { calc: () => triExt((A, B, C) => sn(A) * sn(B) * sn(C)).mx }),
);
const ang = [[0.4, 0.9], [1.0, 1.2]];
items.push(
  XT('tr-x056', 5, 'sums at multiples of π/7', R`Which of the following are correct?`, [
    [R`$\sum_{k=1}^{6}\cos\dfrac{2k\pi}7=-1$`, near((() => { let s = 0; for (let k = 1; k <= 6; k++) s += cs(2 * k * PIV / 7); return s; })(), -1), R`the 7 seventh-roots of unity add to 0 and $k=7$ contributes 1.`],
    [R`$\cos\dfrac\pi7\cos\dfrac{2\pi}7\cos\dfrac{3\pi}7=\dfrac18$`, near(cs(PIV / 7) * cs(2 * PIV / 7) * cs(3 * PIV / 7), 1 / 8), R`from $\cos\frac\pi7\cos\frac{2\pi}7\cos\frac{4\pi}7=-\frac18$ and $\cos\frac{4\pi}7=-\cos\frac{3\pi}7$.`],
    [R`$\sum_{k=1}^{6}\sin^2\dfrac{k\pi}7=\dfrac72$`, near((() => { let s = 0; for (let k = 1; k <= 6; k++) s += sn(k * PIV / 7) ** 2; return s; })(), 3.5), R`$\frac12\left(6-\sum\cos\frac{2k\pi}7\right)=\frac12(6+1)$.`],
    [R`$\sum_{k=1}^{6}\cos\dfrac{k\pi}7=-1$`, near((() => { let s = 0; for (let k = 1; k <= 6; k++) s += cs(k * PIV / 7); return s; })(), -1), R`$\cos\frac{(7-k)\pi}7=-\cos\frac{k\pi}7$, so the sum is 0.`]], 'Pair $k$ with $7-k$.'),
  XT('tr-x057', 5, 'triangle extremes', R`For a triangle $ABC$, which of the following are correct?`, [
    [R`$\sin A+\sin B+\sin C\le\dfrac{3\sqrt3}2$`, near(triExt((A, B, C) => sn(A) + sn(B) + sn(C)).mx, 3 * Math.sqrt(3) / 2, 1e-4), R`greatest for the equilateral triangle.`],
    [R`$\cos A+\cos B+\cos C\le\dfrac32$`, near(triExt((A, B, C) => cs(A) + cs(B) + cs(C)).mx, 1.5, 1e-4), R`equality at the equilateral triangle.`],
    [R`If the triangle is acute, $\tan A+\tan B+\tan C\ge3\sqrt3$`, near(acuteExt((A, B, C) => tn(A) + tn(B) + tn(C)).mn, 3 * Math.sqrt(3), 2e-3), R`AM-GM with $\tan A+\tan B+\tan C=\tan A\tan B\tan C$.`],
    [R`$\sin A+\sin B+\sin C\ge\dfrac{3\sqrt3}2$`, triExt((A, B, C) => sn(A) + sn(B) + sn(C)).mn >= 3 * Math.sqrt(3) / 2 - 1e-6, R`this is the reverse inequality, false (the sum can be close to 0).`]], 'The equilateral triangle gives the extreme value.'),
  XT('tr-x058', 5, 'identities', R`Which of the following are identities for all $x$ where both sides are defined?`, [
    [R`$\tan x\tan(60^\circ-x)\tan(60^\circ+x)=\tan3x$`, [0.2, 0.5, 0.9].every((x) => near(tn(x) * tn(PIV / 3 - x) * tn(PIV / 3 + x), tn(3 * x), 1e-9)), R`standard triplet identity.`],
    [R`$\cos x\cos(60^\circ-x)\cos(60^\circ+x)=\dfrac14\cos3x$`, [0.2, 0.5, 0.9].every((x) => near(cs(x) * cs(PIV / 3 - x) * cs(PIV / 3 + x), cs(3 * x) / 4, 1e-9)), R`standard.`],
    [R`$\sin x\sin(60^\circ-x)\sin(60^\circ+x)=\dfrac14\sin3x$`, [0.2, 0.5, 0.9].every((x) => near(sn(x) * sn(PIV / 3 - x) * sn(PIV / 3 + x), sn(3 * x) / 4, 1e-9)), R`standard.`],
    [R`$\sin x\sin(60^\circ-x)\sin(60^\circ+x)=\dfrac12\sin3x$`, [0.2, 0.5, 0.9].every((x) => near(sn(x) * sn(PIV / 3 - x) * sn(PIV / 3 + x), sn(3 * x) / 2, 1e-9)), R`the factor is $\frac14$, not $\frac12$.`]], 'Check numerically at one value of $x$.'),
  XT('tr-x059', 5, 'series of sines and cosines', R`Which of the following are correct?`, [
    [R`$\sum_{k=1}^{9}\sin(20^\circ k)=\cot10^\circ$`, near((() => { let s = 0; for (let k = 1; k <= 9; k++) s += sn(dg(20 * k)); return s; })(), 1 / tn(dg(10)), 1e-9), R`$\dfrac{\sin90^\circ\sin100^\circ}{\sin10^\circ}=\dfrac{\cos10^\circ}{\sin10^\circ}$.`],
    [R`$\sum_{k=1}^{12}\cos(30^\circ k)=1$`, near((() => { let s = 0; for (let k = 1; k <= 12; k++) s += cs(dg(30 * k)); return s; })(), 1, 1e-9), R`the 12 equally spaced angles add to 0, so the sum is 0, not 1.`],
    [R`$\sum_{k=1}^{5}\sin(36^\circ k)=\cot18^\circ$`, near((() => { let s = 0; for (let k = 1; k <= 5; k++) s += sn(dg(36 * k)); return s; })(), 1 / tn(dg(18)), 1e-9), R`$\dfrac{\sin90^\circ\sin108^\circ}{\sin18^\circ}=\cot18^\circ$.`],
    [R`$\sum_{k=1}^{17}\cos(10^\circ k)=0$`, near((() => { let s = 0; for (let k = 1; k <= 17; k++) s += cs(dg(10 * k)); return s; })(), 0, 1e-9), R`$\dfrac{\sin85^\circ\cos90^\circ}{\sin5^\circ}=0$.`]], 'Use $\\sum\\sin k\\theta=\\frac{\\sin(n\\theta/2)\\sin((n+1)\\theta/2)}{\\sin(\\theta/2)}$.'),
  A('tr-x060', 5, 'products', R`$\tan20^\circ\tan40^\circ\tan80^\circ=\sqrt3$.`, R`$\tan x\tan(60^\circ-x)\tan(60^\circ+x)=\tan3x$.`, 0,
    R`<p>Put $x=20^\circ$: $\tan20^\circ\tan40^\circ\tan80^\circ=\tan60^\circ=\sqrt3$. R is exactly the identity used.</p>`, 'Spot the pattern $x,\\ 60^\\circ-x,\\ 60^\\circ+x$.'),
  S('tr-x061', 5, 'special angles', R`$\cos36^\circ-\cos72^\circ=\dfrac12$.`, R`$\cos36^\circ+\cos72^\circ=\dfrac{\sqrt5}2$.`, 0,
    R`<p>$\cos36^\circ=\dfrac{\sqrt5+1}4$ and $\cos72^\circ=\dfrac{\sqrt5-1}4$. Difference $=\dfrac24=\dfrac12$; sum $=\dfrac{2\sqrt5}4=\dfrac{\sqrt5}2$. Both are true.</p>`, 'Use the exact forms.'),
  MT('tr-x062', 5, 'sums at multiples of π/7', 'mx7', R`Match List I with List II.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    R`<p>A: $\sum_{k=1}^{6}\cos\frac{2k\pi}7=-1$ (p). B: $\sum_{k=1}^{7}\sin\frac{2k\pi}7=0$ by symmetry (q). C: $\dfrac18$ (r). D: the six cosines come in equal pairs, so $\sum_{k=1}^{3}\cos\frac{2k\pi}7=-\frac12$ (s).</p>`, 'Roots of unity add to 0.'),
  MT('tr-x063', 5, 'triangle extremes', 'mx8', R`Match List I with List II.`, 'A-r, B-q, C-s, D-p', ['A-q, B-r, C-s, D-p', 'A-r, B-q, C-p, D-s', 'A-r, B-s, C-q, D-p'],
    R`<p>All extremes occur for the equilateral triangle: A: $3\cdot\dfrac{\sqrt3}2=\dfrac{3\sqrt3}2$ (r). B: $3\cdot\dfrac12=\dfrac32$ (q). C: $3\tan60^\circ=3\sqrt3$ (s). D: $\left(\sin30^\circ\right)^3=\dfrac18$ (p).</p>`, 'Put $A=B=C=60^\\circ$.'),
);

items.push(
  XT('tr-x064', 4, 'inequalities', R`For $0<x<\dfrac\pi2$, which of the following are true?`, [
    [R`$\sin x<x$`, sample((x) => x - sn(x), 0.001, PIV / 2 - 0.001).mn > 0, R`the sine curve lies below the line $y=x$ for $x>0$.`],
    [R`$\tan x>x$`, sample((x) => tn(x) - x, 0.001, PIV / 2 - 0.001).mn > 0, R`the tangent curve lies above $y=x$ on this interval.`],
    [R`$\sin x>\dfrac{2x}\pi$`, sample((x) => sn(x) - 2 * x / PIV, 0.001, PIV / 2 - 0.001).mn > 0, R`$\sin x$ is concave on $[0,\frac\pi2]$, so it lies above the chord from $(0,0)$ to $\left(\frac\pi2,1\right)$.`],
    [R`$\tan x<x$`, sample((x) => x - tn(x), 0.001, PIV / 2 - 0.001).mn > 0, R`the opposite of the true inequality $\tan x>x$.`]], 'Compare the graph with the line $y=x$ (and the chord).'),
);

// ----- new templates -----
const Tf = (k) => (k === 1 ? R`$2\pi$` : R`$\dfrac{2\pi}{${k}}$`);
const lcmN = (a, b) => (a * b) / gcd(a, b);
const nOpts = (rng, correct, wrongs) => shuffleOpts(rng, correct, wrongs);
gens.push(
  { id: 'tr-g15', type: 'nat', format: 'integer', level: 2, exams: EXS[2], sub: 'clock angle',
    make(rng) { const h = int(rng, 1, 11), m = 2 * int(rng, 0, 29); let a = Math.abs(30 * h + m / 2 - 6 * m); if (a > 180) a = 360 - a;
      return { h, m, answer: a, tol: 0, q: `Find the angle in degrees (at most $180^\\circ$) between the hour hand and the minute hand of a clock at ${h}:${String(m).padStart(2, '0')}.`,
        sol: R`<p>Minute hand: $${m}\times6=${6 * m}^\circ$. Hour hand: $${h}\times30+${m}\times0.5=${30 * h + m / 2}^\circ$. The difference is $${Math.abs(30 * h + m / 2 - 6 * m)}^\circ$${Math.abs(30 * h + m / 2 - 6 * m) > 180 ? R`, and the smaller angle is $360^\circ-${Math.abs(30 * h + m / 2 - 6 * m)}^\circ=${a}^\circ$` : ''}.</p>` }; },
    verify(p) { const hand = ((p.h % 12) * 30 + p.m * 0.5) % 360, min = (p.m * 6) % 360; const d = Math.abs(hand - min); return Math.min(d, 360 - d); } },
  { id: 'tr-g16', type: 'mcq', format: 'single', level: 3, exams: EXS[3], sub: 'compound angles',
    make(rng) { for (;;) { const t1 = choose(rng, TRI), t2 = choose(rng, TRI); const [a1, b1, c1] = t1, [a2, b2, c2] = t2; if (t1 === t2) continue;
        const vals = [[fr(b1 * b2 - a1 * a2, c1 * c2), (b1 * b2 - a1 * a2) / (c1 * c2)], [fr(b1 * b2 + a1 * a2, c1 * c2), (b1 * b2 + a1 * a2) / (c1 * c2)], [fr(a1 * b2 + b1 * a2, c1 * c2), (a1 * b2 + b1 * a2) / (c1 * c2)], [fr(-(b1 * b2 - a1 * a2), c1 * c2), -(b1 * b2 - a1 * a2) / (c1 * c2)]];
        if (new Set(vals.map((v) => v[1].toFixed(9))).size < 4 || new Set(vals.map((v) => v[0])).size < 4) continue;
        const map = {}; const o = nOpts(rng, `$${vals[0][0]}$`, vals.slice(1).map((v) => `$${v[0]}$`)); vals.forEach((v) => { map[`$${v[0]}$`] = v[1]; });
        return { a1, c1, a2, c2, map, ...o, q: R`If $A$ and $B$ are acute, $\sin A=\dfrac{${a1}}{${c1}}$ and $\sin B=\dfrac{${a2}}{${c2}}$, then $\cos(A+B)$ equals`,
          sol: R`<p>$\cos A=\dfrac{${b1}}{${c1}}$, $\cos B=\dfrac{${b2}}{${c2}}$. $\cos(A+B)=\cos A\cos B-\sin A\sin B=\dfrac{${b1 * b2}-${a1 * a2}}{${c1 * c2}}=${vals[0][0].replace(/\\frac/g, '\\dfrac')}$.</p>`, trap: 'The sign between the two products is minus for $\\cos(A+B)$.' }; } },
    verify(p) { const v = Math.cos(Math.asin(p.a1 / p.c1) + Math.asin(p.a2 / p.c2)); return p.options.findIndex((o) => Math.abs(p.map[o] - v) < 1e-9); } },
  { id: 'tr-g17', type: 'nat', format: 'numeric', level: 4, exams: EXS[4], sub: 'max and min',
    make(rng) { const a = int(rng, 1, 5), b = int(rng, 1, 5), phi = choose(rng, [30, 60, 90, 120]); const answer = +Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(dg(phi))).toFixed(3);
      return { a, b, phi, answer, tol: 0.001, q: `Find the greatest value of $${a}\\sin x+${b}\\sin(x+${phi}^\\circ)$ to 3 decimal places.`,
        sol: R`<p>The two sine waves add like vectors with angle $${phi}^\circ$ between them. The amplitude is $\sqrt{a^2+b^2+2ab\cos${phi}^\circ}=\sqrt{${a * a}+${b * b}+${2 * a * b}\times${+Math.cos(dg(phi)).toFixed(3)}}=${answer}$.</p>` }; },
    verify(p) { let m = -Infinity; for (let i = 0; i <= 100000; i++) { const x = 2 * Math.PI * i / 100000; m = Math.max(m, p.a * Math.sin(x) + p.b * Math.sin(x + dg(p.phi))); } return m; } },
  { id: 'tr-g18', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'sums',
    make(rng) { const n = int(rng, 5, 14); const answer = n - 2;
      return { n, answer, tol: 0, q: `Find $2\\sum_{k=1}^{${n - 1}}\\cos^2\\dfrac{k\\pi}{${n}}$.`,
        sol: R`<p>$2\cos^2\alpha=1+\cos2\alpha$. The sum is $\sum_{k=1}^{${n - 1}}\left(1+\cos\dfrac{2k\pi}{${n}}\right)=${n - 1}+\sum_{k=1}^{${n - 1}}\cos\dfrac{2k\pi}{${n}}$. The $${n}$ equally spaced cosines ($k=1..${n}$) add to 0 and the $k=${n}$ term is 1, so the sum from 1 to ${n - 1} is $-1$. Total $=${n - 1}-1=${answer}$.</p>` }; },
    verify(p) { let s = 0; for (let k = 1; k < p.n; k++) s += 2 * Math.cos(k * Math.PI / p.n) ** 2; return Math.round(s); } },
  { id: 'tr-g19', type: 'nat', format: 'integer', level: 3, exams: EXS[3], sub: 'ratios',
    make(rng) { const t = int(rng, 2, 4), c = int(rng, 1, 4), d = int(rng, 1, 4), a = int(rng, 1, 5), r = int(rng, 2, 5); const b = r * (c * t + d) - a * t;
      const lin = (u, v, s1, s2) => `${u === 1 ? '' : u}\\${s1}\\theta${v < 0 ? '-' : '+'}${Math.abs(v) === 1 ? '' : Math.abs(v)}\\${s2}\\theta`;
      return { t, a, b, c, d, answer: r, tol: 0, q: `If $\\tan\\theta=${t}$, find $\\dfrac{${lin(a, b, 'sin', 'cos')}}{${lin(c, d, 'sin', 'cos')}}$.`,
        sol: R`<p>Divide the top and the bottom by $\cos\theta$: the value is $\dfrac{${a}t${b < 0 ? '-' : '+'}${Math.abs(b)}}{${c}t+${d}}$ with $t=${t}$: $\dfrac{${a * t + b}}{${c * t + d}}=${r}$.</p>` }; },
    verify(p) { const th = Math.atan(p.t); return Math.round((p.a * Math.sin(th) + p.b * Math.cos(th)) / (p.c * Math.sin(th) + p.d * Math.cos(th))); } },
  { id: 'tr-g20', type: 'mcq', format: 'single', level: 3, exams: EXS[3], sub: 'period',
    make(rng) { let a, b; do { a = int(rng, 2, 9); b = int(rng, 2, 9); } while (a === b);
      const g = gcd(a, b); const cands = [lcmN(a, b), a * b, a + b, Math.abs(a - b), 2 * g, g + 1].filter((k, i, arr) => k !== g && arr.indexOf(k) === i);
      if (cands.length < 3) { cands.push(g * 3, g * 5, g * 7); }
      const o = nOpts(rng, Tf(g), cands.slice(0, 3).map(Tf));
      return { a, b, g, ...o, q: `The period of $f(x)=\\sin${a}x+\\cos${b}x$ is`,
        sol: R`<p>$\sin${a}x$ has period $\dfrac{2\pi}{${a}}$ and $\cos${b}x$ has period $\dfrac{2\pi}{${b}}$. The common period is $\dfrac{2\pi}{\gcd(${a},${b})}=\dfrac{2\pi}{${g}}$.</p>`, trap: 'Use the gcd of the two multipliers, not their product.' }; },
    verify(p) { const f = (x) => Math.sin(p.a * x) + Math.cos(p.b * x); const T = 2 * Math.PI / p.g; const ok = isPer(f, T) && [2, 3, 5, 7].every((q) => !isPer(f, T / q)); return ok ? p.answer : -1; } },
  { id: 'tr-g21', type: 'nat', format: 'integer', level: 4, exams: EXS[4], sub: 'triangle identities',
    make(rng) { for (let tries = 0; tries < 500; tries++) { const a = int(rng, 2, 30), c = int(rng, 1, 4); if ((a * c + 1) % (a - c) || a <= c) continue; const b = (a * c + 1) / (a - c); if (b < 1 || b === a) continue;
        return { a, b, c, answer: -c, tol: 0, q: `In a triangle $ABC$, $\\cot A=${a}$ and $\\cot B=${b}$. Find $\\cot C$.`,
          sol: R`<p>In a triangle $\cot A\cot B+\cot B\cot C+\cot C\cot A=1$. So $${a * b}+${a + b}\cot C=1$, giving $\cot C=\dfrac{1-${a * b}}{${a + b}}=${-c}$.</p>` }; }
      throw new Error('no instance'); },
    verify(p) { const A = Math.atan(1 / p.a), B = Math.atan(1 / p.b), C = Math.PI - A - B; return Math.round(1 / Math.tan(C)); } },
  { id: 'tr-g22', type: 'mcq', format: 'single', level: 4, exams: EXS[4], sub: 'multiple angles',
    make(rng) { for (;;) { const [a, b, c] = choose(rng, TRI); const s = a / c; const n = 3 * a * c * c - 4 * a ** 3, d = c ** 3;
        const vals = [[fr(n, d), s * 3 - 4 * s ** 3], [fr(3 * a * c - 4 * a * a, c * c), 3 * s - 4 * s * s], [fr(-n, d), -(3 * s - 4 * s ** 3)], [fr(3 * a * c * c + 4 * a ** 3, d), 3 * s + 4 * s ** 3]];
        if (new Set(vals.map((v) => v[0])).size < 4 || new Set(vals.map((v) => v[1].toFixed(9))).size < 4) continue;
        const map = {}; vals.forEach((v) => { map[`$${v[0]}$`] = v[1]; });
        const o = nOpts(rng, `$${vals[0][0]}$`, vals.slice(1).map((v) => `$${v[0]}$`));
        return { a, c, map, ...o, q: R`If $\sin\theta=\dfrac{${a}}{${c}}$, then $\sin3\theta$ equals`,
          sol: R`<p>$\sin3\theta=3\sin\theta-4\sin^3\theta=\dfrac{${3 * a}}{${c}}-\dfrac{${4 * a ** 3}}{${c ** 3}}=\dfrac{${n}}{${d}}=${vals[0][0].replace(/\\frac/g, '\\dfrac')}$.</p>`, trap: 'Cube the sine in the second term.' }; } },
    verify(p) { const v = Math.sin(3 * Math.asin(p.a / p.c)); return p.options.findIndex((o) => Math.abs(p.map[o] - v) < 1e-9); } },
  { id: 'tr-g23', type: 'nat', format: 'integer', level: 5, exams: EXS[5], sub: 'multiple angles',
    make(rng) { const n = int(rng, 3, 8); const T = [1, 2]; for (let i = 2; i <= n; i++) T.push(2 * 2 * T[i - 1] - T[i - 2]); const answer = T[n];
      return { n, answer, tol: 0, q: `Write $\\cos${n}\\theta=T_{${n}}(\\cos\\theta)$, where $T_{${n}}$ is a polynomial. Find $T_{${n}}(2)$.`,
        sol: R`<p>The polynomials satisfy $T_{k+1}(x)=2xT_k(x)-T_{k-1}(x)$ with $T_0=1$, $T_1=x$ (from $\cos(k+1)\theta+\cos(k-1)\theta=2\cos\theta\cos k\theta$). At $x=2$: $1,2,7,26,97,362,1351,5042,\dots$. So $T_{${n}}(2)=${answer}$.</p>` }; },
    verify(p) { return Math.round(((2 + Math.sqrt(3)) ** p.n + (2 - Math.sqrt(3)) ** p.n) / 2); } },
);

// ===== expansion end =====

// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({ topic: 'trigonometry', groups, items, gens }, ['tr-g09', 'tr-g17', 'tr-g19']);
