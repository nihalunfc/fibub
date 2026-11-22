// Vectors (Plus Two entrance, Mathematics, Class 12). Original fibub questions.
// Fixed items take their keys from vector arithmetic done in code (helpers below) and the templates' verify() recompute every
// answer another way (determinants, explicit coordinates, plugging the answer back into the condition).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const R = String.raw;
const EXS = {
  1: ['keam', 'cusat', 'comedk', 'jee-main'],
  2: ['keam', 'cusat', 'comedk', 'jee-main'],
  3: ['jee-main', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv'],
  5: ['jee-adv'],
};
const POS = [1, 3, 0, 2, 2, 0, 3, 1, 3, 1, 2, 0, 1, 2, 3, 0];
let _n = 0;
const place = (correct, wrongs) => {
  const p = POS[_n++ % POS.length];
  const o = [...wrongs];
  o.splice(p, 0, correct);
  return { options: o, answer: p };
};
const base = (level, sub, extra) => ({ level, exams: [...EXS[level], ...(extra.type === 'mcq' && level <= 3 ? ['cuet'] : [])], sub, ...extra });
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
const PM = (level, sub, group, q, correct, wrongs, sol, trap, more = {}) =>
  base(level, sub, { type: 'mcq', format: 'passage', group, q, ...place(correct, wrongs), sol, trap, ...more });
const GEXS = (level, type) => [...EXS[level], ...(type === 'mcq' && level <= 3 ? ['cuet'] : [])];

// ---------- vector helpers ----------
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const sc = (k, v) => [k * v[0], k * v[1], k * v[2]];
const n2 = (v) => dot(v, v);
const nrm = (v) => Math.sqrt(dot(v, v));
const trip = (a, b, c) => dot(a, cross(b, c));
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const C = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
const r2 = (x) => +x.toFixed(2);
const r3 = (x) => +x.toFixed(3);
const D2 = ' (2 decimal places)';
const D3 = ' (3 decimal places)';
const D1 = ' (1 decimal place)';
const deg = (x) => (x * 180) / Math.PI;
/** TeX for a vector a i + b j + c k */
const vt = (v) => {
  const sym = ['\\hat i', '\\hat j', '\\hat k']; let s = '';
  v.forEach((c, i) => {
    if (c === 0) return;
    const mag = Math.abs(c) === 1 ? '' : String(Math.abs(c));
    s += (c < 0 ? '-' : s ? '+' : '') + mag + sym[i];
  });
  return s || '0';
};
/** inline maths for a vector */
const V = (v) => `$${vt(v)}$`;
/** point text */
const P = (v) => `(${v[0]}, ${v[1]}, ${v[2]})`;
/** TeX for the square root of n in simplest form (integers come out as plain numbers) */
const rd = (n) => {
  let k = 1; for (let i = 2; i * i <= n; i++) while (n % (i * i) === 0) { n /= i * i; k *= i; }
  if (n === 1) return `${k}`;
  return k === 1 ? `\\sqrt{${n}}` : `${k}\\sqrt{${n}}`;
};
/** inline maths for a square root */
const SQ = (n) => `$${rd(n)}$`;
/** mcq with vectors as options (correct vector, wrong vectors) */
const VM = (level, sub, q, correct, wrongs, sol, trap, more = {}) => M(level, sub, q, V(correct), wrongs.map(V), sol, trap, more);
/** mcq with plain numbers or surds as options */
const NM = (level, sub, q, correct, wrongs, sol, trap, more = {}) => M(level, sub, q, `$${correct}$`, wrongs.map((w) => `$${w}$`), sol, trap, more);
const FRQ = (n, d) => { const k = gcd(n, d) || 1; n /= k; d /= k; if (d < 0) { n = -n; d = -d; } return d === 1 ? `${n}` : `\\dfrac{${n}}{${d}}`; };
/** multi-correct item: pairs [text, isTrue] */
const XT = (level, sub, q, pairs, sol, trap, more = {}) => {
  const ans = pairs.map((p, i) => (p[1] ? i : -1)).filter((i) => i >= 0);
  return X(level, sub, q, pairs.map((p) => p[0]), ans, sol, trap, more);
};
const sgn = (v) => (v < 0 ? `-${-v}` : `+${v}`);
/** Pythagorean-style integer-length vectors (all permutations and signs are used by the templates) */
const TRIPLES = [[1, 2, 2], [2, 3, 6], [1, 4, 8], [4, 4, 7], [2, 6, 9], [6, 6, 7], [2, 10, 11], [3, 4, 12], [4, 8, 8], [6, 9, 6], [2, 5, 14], [8, 9, 12]];
const PUZ = TRIPLES.filter((t) => Number.isInteger(Math.sqrt(n2(t))));

const groups = {
  vm1: {
    title: 'Products of vectors',
    passage: R`<p>Let $\vec a=\hat i+\hat j$ and $\vec b=\hat j+\hat k$. Match each quantity in List I with its value in List II.</p>`,
    list1: ['A. $\\vec a\\cdot\\vec b$', 'B. $|\\vec a\\times\\vec b|^2$', 'C. $\\vec a\\cdot(\\vec b\\times\\vec b)$', 'D. $|\\vec a|^2|\\vec b|^2$'],
    list2: ['p. $0$', 'q. $1$', 'r. $3$', 's. $4$'],
  },
  vm2: {
    title: 'Geometric meaning',
    passage: R`<p>Match each expression in List I with what it measures or tells us in List II.</p>`,
    list1: ['A. $\\left|\\vec a\\times\\vec b\\right|$', 'B. $\\left|[\\vec a\\ \\vec b\\ \\vec c]\\right|$', 'C. $\\dfrac{\\vec a\\cdot\\vec b}{|\\vec b|}$', 'D. $[\\vec a\\ \\vec b\\ \\vec c]=0$'],
    list2: ['p. Scalar projection of $\\vec a$ on $\\vec b$', 'q. The three vectors are coplanar', 'r. Area of the parallelogram on $\\vec a,\\vec b$', 's. Volume of the parallelepiped on $\\vec a,\\vec b,\\vec c$'],
  },
  vm3: {
    title: 'Triple products',
    passage: R`<p>Let $\vec a,\vec b,\vec c$ be vectors with $[\vec a\ \vec b\ \vec c]=2$. Match each quantity in List I with its value in List II.</p>`,
    list1: ['A. $[\\vec b\\ \\vec c\\ \\vec a]$', 'B. $[\\vec b\\ \\vec a\\ \\vec c]$', 'C. $[\\vec a-\\vec b\\ \\ \\vec b-\\vec c\\ \\ \\vec c-\\vec a]$', 'D. $[\\vec a+\\vec b\\ \\ \\vec b+\\vec c\\ \\ \\vec c+\\vec a]$'],
    list2: ['p. $-2$', 'q. $2$', 'r. $4$', 's. $0$'],
  },
  vm4: {
    title: 'Conditions on vectors',
    passage: R`<p>Match each condition in List I with what it tells us in List II, for non-zero vectors $\vec a,\vec b$.</p>`,
    list1: ['A. $\\vec a\\cdot\\vec b=0$', 'B. $\\vec a\\times\\vec b=\\vec0$', 'C. $|\\vec a+\\vec b|=|\\vec a|+|\\vec b|$', 'D. $|\\vec a-\\vec b|=|\\vec a|+|\\vec b|$'],
    list2: ['p. $\\vec a$ and $\\vec b$ are parallel (same or opposite direction)', 'q. $\\vec a$ and $\\vec b$ are perpendicular', 'r. $\\vec a$ and $\\vec b$ point the same way', 's. $\\vec a$ and $\\vec b$ point in opposite directions'],
  },
  vp1: {
    title: 'Passage: a triangle in space',
    passage: R`<p>The triangle $ABC$ has vertices $A(1,1,1)$, $B(3,3,2)$ and $C(3,0,-1)$.</p>`,
  },
  vp2: {
    title: 'Passage: a parallelepiped',
    passage: R`<p>A parallelepiped has edges $\vec a=\hat i+2\hat j$, $\vec b=\hat j+3\hat k$ and $\vec c=2\hat i+\hat k$ meeting at a vertex.</p>`,
  },
  vp3: {
    title: 'Passage: a vector equation',
    passage: R`<p>Let $\vec a=2\hat i+2\hat j+\hat k$ and $\vec b=2\hat i-\hat j-2\hat k$. We study the equation $\vec r\times\vec a=\vec b$. Note that $\vec a\cdot\vec b=0$, so the equation has solutions, and its general solution is $\vec r=\vec r_0+\lambda\vec a$ where $\vec r_0=\dfrac{\vec a\times\vec b}{|\vec a|^2}$.</p>`,
  },
  vp4: {
    title: 'Passage: a cevian problem',
    passage: R`<p>In triangle $ABC$ with position vectors $\vec a,\vec b,\vec c$, the point $D$ lies on $BC$ with $BD:DC=2:3$ and $E$ lies on $CA$ with $CE:EA=1:2$. The lines $AD$ and $BE$ meet at $P$.</p>`,
  },
};

const itemsA = [
  // ================= vector algebra, unit vectors, direction cosines =================
  NM(1, 'magnitude', R`The magnitude of the vector $3\hat i-4\hat k$ is`, rd(25), ['7', '1', '25'],
    R`<p>$|3\hat i+0\hat j-4\hat k|=\sqrt{3^2+0^2+(-4)^2}=\sqrt{25}=5$.</p>`, '$\\sqrt{9-16}$ is wrong: the squares are always added.'),
  M(1, 'unit vector', R`The unit vector along $2\hat i-2\hat j+\hat k$ is`, R`$\dfrac13(2\hat i-2\hat j+\hat k)$`, [R`$\dfrac15(2\hat i-2\hat j+\hat k)$`, R`$\dfrac19(2\hat i-2\hat j+\hat k)$`, R`$2\hat i-2\hat j+\hat k$`],
    R`<p>$|2\hat i-2\hat j+\hat k|=\sqrt{4+4+1}=3$. Dividing the vector by its magnitude gives $\dfrac13(2\hat i-2\hat j+\hat k)$.</p>`, 'Divide by the magnitude, not by its square.'),
  VM(1, 'position vectors', R`The points $A(1,2,3)$ and $B(4,0,5)$ are given. The vector $\overrightarrow{AB}$ is`, sub([4, 0, 5], [1, 2, 3]), [sub([1, 2, 3], [4, 0, 5]), add([1, 2, 3], [4, 0, 5]), [4, 0, 5]],
    R`<p>$\overrightarrow{AB}=\vec b-\vec a=(4-1)\hat i+(0-2)\hat j+(5-3)\hat k=3\hat i-2\hat j+2\hat k$.</p>`, 'Terminal point minus initial point.'),
  M(1, 'cross product', R`$\hat i\times\hat j$ equals`, '$\\hat k$', ['$-\\hat k$', '$0$', '$1$'],
    R`<p>Using the right-hand rule, $\hat i\times\hat j=\hat k$ (and $\hat j\times\hat i=-\hat k$).</p>`, 'Reversing the order flips the sign.'),
  I(1, 'magnitude', R`Find $|2\hat i+\hat j-2\hat k|$.`, 3,
    R`<p>$\sqrt{4+1+4}=\sqrt9=3$.</p>`, 'Square the $-2$ to get $+4$.', { calc: () => Math.round(nrm([2, 1, -2])) }),
  VM(1, 'vector addition', R`If $\vec a=2\hat i-\hat j+3\hat k$ and $\vec b=\hat i+4\hat j-\hat k$, then $\vec a+\vec b$ is`, add([2, -1, 3], [1, 4, -1]), [sub([2, -1, 3], [1, 4, -1]), [3, 3, 4], [2, -4, -3]],
    R`<p>Add component by component: $(2+1)\hat i+(-1+4)\hat j+(3-1)\hat k=3\hat i+3\hat j+2\hat k$.</p>`, 'Keep the signs of each component.'),
  M(1, 'parallel vectors', R`Two non-zero vectors $\vec a$ and $\vec b$ are parallel if and only if`, R`$\vec a\times\vec b=\vec 0$`, [R`$\vec a\cdot\vec b=0$`, R`$\vec a\cdot\vec b=1$`, R`$|\vec a|=|\vec b|$`],
    R`<p>Parallel vectors make angle $0$ or $\pi$, so $\sin\theta=0$ and $|\vec a\times\vec b|=0$. The dot product being zero means perpendicular.</p>`, 'Dot zero = perpendicular; cross zero = parallel.'),
  VM(1, 'midpoint', R`The position vector of the midpoint of $A(2,4,6)$ and $B(4,0,2)$ is`, [3, 2, 4], [[6, 4, 8], [1, -2, -2], [2, 4, 6]],
    R`<p>Midpoint $=\dfrac{\vec a+\vec b}2=\dfrac{(6,4,8)}2=(3,2,4)$.</p>`, 'Divide the sum by 2.'),
  I(1, 'dot product', R`If $\vec a=\hat i+2\hat j+3\hat k$ and $\vec b=4\hat i+5\hat j+6\hat k$, find $\vec a\cdot\vec b$.`, dot([1, 2, 3], [4, 5, 6]),
    R`<p>$1\cdot4+2\cdot5+3\cdot6=4+10+18=32$.</p>`, 'The dot product is a number, not a vector.', { calc: () => 1 * 4 + 2 * 5 + 3 * 6 }),
  M(1, 'dot product', R`The angle between $\hat i$ and $\hat j$ is`, '$90^\\circ$', ['$0^\\circ$', '$45^\\circ$', '$180^\\circ$'],
    R`<p>$\hat i\cdot\hat j=0$, so $\cos\theta=0$ and $\theta=90^\circ$.</p>`, 'Zero dot product means perpendicular.'),
  M(1, 'magnitude', R`If $|\vec a|=3$, then $|-2\vec a|$ is`, '$6$', ['$-6$', '$9$', '$1$'],
    R`<p>$|k\vec a|=|k||\vec a|=2\times3=6$.</p>`, 'Magnitudes are never negative.'),
  M(1, 'cross product', R`For any vector $\vec a$, $\vec a\times\vec a$ is`, R`$\vec0$`, [R`$|\vec a|^2$`, R`$\vec a$`, R`$0$ (a number)`],
    R`<p>The angle is 0, so the magnitude $|\vec a||\vec a|\sin0=0$. The result is the zero vector, not a number.</p>`, 'The cross product is a vector.'),
  M(1, 'dot product', R`$\vec a\cdot\vec a$ equals`, R`$|\vec a|^2$`, [R`$|\vec a|$`, R`$\vec 0$`, R`$2|\vec a|$`],
    R`<p>$\vec a\cdot\vec a=|\vec a||\vec a|\cos0=|\vec a|^2$.</p>`, 'The dot of a vector with itself is its squared length.'),
  I(2, 'parallel vectors', R`The vectors $2\hat i-3\hat j+\lambda\hat k$ and $4\hat i-6\hat j+10\hat k$ are parallel. Find $\lambda$.`, 5,
    R`<p>Parallel means proportional: $\dfrac24=\dfrac{-3}{-6}=\dfrac\lambda{10}=\dfrac12$, so $\lambda=5$.</p>`, 'Check the ratio on every component.', { calc: () => (10 * 2) / 4 }),
  I(2, 'vector algebra', R`A vector of magnitude 14 is drawn along $2\hat i+3\hat j+6\hat k$. The sum of its components is`, 22,
    R`<p>$|2\hat i+3\hat j+6\hat k|=\sqrt{4+9+36}=7$. The required vector is $\dfrac{14}7(2\hat i+3\hat j+6\hat k)=4\hat i+6\hat j+12\hat k$. The sum of components is $4+6+12=22$.</p>`, 'Scale by (required magnitude) / (current magnitude).', { calc: () => (14 / 7) * (2 + 3 + 6) }),
  M(2, 'direction cosines', R`The direction cosines of the vector $\hat i-2\hat j+2\hat k$ are`, R`$\dfrac13,-\dfrac23,\dfrac23$`, [R`$1,-2,2$`, R`$\dfrac15,-\dfrac25,\dfrac25$`, R`$\dfrac13,\dfrac23,\dfrac23$`],
    R`<p>$|\vec v|=\sqrt{1+4+4}=3$. Direction cosines $=\dfrac{(1,-2,2)}3$.</p>`, 'Direction cosines satisfy $l^2+m^2+n^2=1$; $1,-2,2$ do not.'),
  I(2, 'equal vectors', R`Vectors $(x+1)\hat i+2\hat j+3\hat k$ and $4\hat i+(y-1)\hat j+z\hat k$ are equal. Find $x+y+z$.`, 3 + 3 + 3,
    R`<p>Equal vectors have equal components: $x+1=4$, $2=y-1$, $3=z$. So $x=3$, $y=3$, $z=3$ and $x+y+z=9$.</p>`, 'Compare $\\hat i$ with $\\hat i$, $\\hat j$ with $\\hat j$, ...', { calc: () => 3 + 3 + 3 }),
  VM(2, 'centroid', R`The vertices of a triangle have position vectors $\hat i+2\hat j+3\hat k$, $4\hat i-2\hat j+\hat k$ and $-2\hat i+3\hat j+2\hat k$. The position vector of its centroid is`, [1, 1, 2], [[3, 3, 6], [1, 1, 6], [3, 1, 2]],
    R`<p>Centroid $=\dfrac{\vec a+\vec b+\vec c}3=\dfrac{(1+4-2,\ 2-2+3,\ 3+1+2)}3=\dfrac{(3,3,6)}3=(1,1,2)$.</p>`, 'Divide by 3 for a triangle.'),
  I(2, 'unit vector', R`The unit vector along $x\hat i+2\hat j-\hat k$ has $\hat j$-component $\dfrac23$. If $x>0$, find $x$.`, 2,
    R`<p>The unit vector along $(x,2,-1)$ is $\dfrac{(x,2,-1)}{\sqrt{x^2+5}}$. Its $\hat j$-component: $\dfrac2{\sqrt{x^2+5}}=\dfrac23$, so $\sqrt{x^2+5}=3$, $x^2=4$ and $x=2$ (as $x>0$).</p>`, 'Use only the positive root, as asked.', { calc: () => Math.sqrt(9 - 5) }),
  M(2, 'vector algebra', R`If $\vec a=\hat i+\hat j$ and $\vec b=\hat j+\hat k$, the vector $\vec a-\vec b$ has magnitude`, '$\\sqrt2$',['$0$', '$2$', '$1$'],
    R`<p>$\vec a-\vec b=\hat i-\hat k$, so $|\vec a-\vec b|=\sqrt{1+1}=\sqrt2$.</p>`, 'The $\\hat j$ components cancel, but the others remain.'),
  M(3, 'unit vector', R`A vector $\vec r$ makes equal angles with the three coordinate axes and $|\vec r|=6\sqrt3$. Which could be $\vec r$?`, R`$6\hat i+6\hat j+6\hat k$`, [R`$6\sqrt3\,\hat i$`, R`$3\hat i+3\hat j+3\hat k$`, R`$2\sqrt3(\hat i+\hat j)$`],
    R`<p>Equal angles means $l=m=n=\pm\dfrac1{\sqrt3}$. So $\vec r=\pm6\sqrt3\cdot\dfrac{(1,1,1)}{\sqrt3}=\pm(6,6,6)$. Check: $\sqrt{36\cdot3}=6\sqrt3$.</p>`, 'Equal angles with the axes: all three components have the same size.'),
  M(3, 'triangle inequality', R`For any two vectors, which statement is always true?`, R`$|\vec a+\vec b|\le|\vec a|+|\vec b|$`, [R`$|\vec a+\vec b|=|\vec a|+|\vec b|$`, R`$|\vec a+\vec b|\ge|\vec a|+|\vec b|$`, R`$|\vec a-\vec b|=|\vec a|-|\vec b|$`],
    R`<p>This is the triangle inequality: the third side of a triangle is not longer than the sum of the other two. Equality happens only for vectors in the same direction.</p>`, 'Equality needs parallel vectors of the same direction.'),
  I(3, 'vector algebra', R`The vector $\vec a=\hat i+\hat j+\hat k$ is rotated so that it is parallel to $2\hat i+2\hat j+2\hat k$ with magnitude $6\sqrt3$. The sum of the components of the new vector is`, 18,
    R`<p>New vector $=6\sqrt3\cdot\dfrac{(1,1,1)}{\sqrt3}=(6,6,6)$. Sum $=18$.</p>`, 'The direction $(2,2,2)$ is the same as $(1,1,1)$.', { calc: () => 6 * 3 }),

  // ================= section formula =================
  I(2, 'section formula', R`The point $P$ divides the join of $A(1,-2,3)$ and $B(6,3,-2)$ internally in the ratio $2:3$. The $x$-coordinate of $P$ is`, (3 * 1 + 2 * 6) / 5,
    R`<p>$P=\dfrac{m\vec b+n\vec a}{m+n}$ with $m:n=2:3$. $x=\dfrac{2\cdot6+3\cdot1}{5}=\dfrac{15}5=3$.</p>`, 'The nearer endpoint gets the larger weight: $A$ is weighted by $n=3$.', { calc: () => (2 * 6 + 3 * 1) / 5 }),
  I(2, 'section formula', R`$P$ divides $A(2,1,-4)$ and $B(8,7,2)$ externally in the ratio $2:1$. The sum of the coordinates of $P$ is`, add([0, 0, 0], sub(sc(2, [8, 7, 2]), [2, 1, -4])).reduce((s, x) => s + x, 0),
    R`<p>For external division, $P=\dfrac{m\vec b-n\vec a}{m-n}=\dfrac{2(8,7,2)-1(2,1,-4)}{1}=(14,13,8)$. The sum is $14+13+8=35$.</p>`, 'External division uses a minus sign in numerator and denominator.', { calc: () => 14 + 13 + 8 }),
  M(2, 'section formula', R`Point $C$ lies on $AB$ with $A(1,1,1)$, $B(7,4,-2)$ and $AC:CB=1:2$. Then $C$ is`, '$(3,2,0)$', ['$(5,3,-1)$', '$(4,2.5,-0.5)$', '$(2,1.5,0.5)$'],
    R`<p>$C=\dfrac{1\cdot B+2\cdot A}3=\dfrac{(7,4,-2)+(2,2,2)}3=\dfrac{(9,6,0)}3=(3,2,0)$.</p>`, 'The ratio $AC:CB=1:2$ puts $C$ one-third of the way from $A$.'),
  I(3, 'section formula', R`The $xy$-plane divides the join of $A(2,3,-4)$ and $B(5,-1,8)$ in the ratio $m:n$ (in lowest terms, $m>0$, $n>0$). Find $m+n$.`, 1 + 2,
    R`<p>On the plane $z=0$: $\dfrac{m\cdot8+n\cdot(-4)}{m+n}=0$, so $8m=4n$ and $m:n=1:2$. Then $m+n=3$.</p>`, 'The $xy$-plane is $z=0$.', { calc: () => 3 }),
  M(3, 'section formula', R`The ratio in which $P(3,2,1)$ divides $A(1,0,-1)$ and $B(5,4,3)$ is`, '$1:1$', ['$1:2$', '$2:1$', '$1:3$'],
    R`<p>$P$ is the midpoint: $\dfrac{(1+5,0+4,-1+3)}2=(3,2,1)$. Ratio $1:1$.</p>`, 'Test the midpoint first.'),
  I(3, 'section formula', R`The point $P$ divides $A(4,-2,6)$ and $B(-2,4,0)$ internally and lies on the plane $x+y+z=6$. If $AP:PB=m:n$ in lowest terms, find $m+n$.`, 3,
    R`<p>Let $AP=t\,AB$, so $P=A+t(B-A)=(4-6t,\ -2+6t,\ 6-6t)$. Its coordinate sum is $8-6t$. Setting $8-6t=6$ gives $t=\dfrac13$, so $AP:PB=\dfrac13:\dfrac23=1:2$ and $m+n=3$.</p>`, 'The ratio is $t:(1-t)$, not $t:1$.', { calc: () => { const t = (8 - 6) / 6; return Math.round(1 / t); } }),
];

const itemsB = [
  // ================= dot product =================
  I(2, 'perpendicular vectors', R`The vectors $2\hat i+\lambda\hat j+\hat k$ and $\hat i-3\hat j+4\hat k$ are perpendicular. Find $\lambda$.`, 2,
    R`<p>Perpendicular means the dot product is 0: $2-3\lambda+4=0$, so $\lambda=2$.</p>`, 'Multiply matching components: $\\lambda\\cdot(-3)$.', { calc: () => (2 + 4) / 3 }),
  M(2, 'angle between vectors', R`The angle between $\hat i+\hat j$ and $\hat j+\hat k$ is`, '$60^\\circ$', ['$30^\\circ$', '$45^\\circ$', '$90^\\circ$'],
    R`<p>$\cos\theta=\dfrac{(1)(0)+(1)(1)+(0)(1)}{\sqrt2\cdot\sqrt2}=\dfrac12$, so $\theta=60^\circ$.</p>`, '$\\cos\\theta=\\frac12$, not $\\frac1{\\sqrt2}$.'),
  M(2, 'projection', R`The scalar projection of $\vec a=\hat i+2\hat j+3\hat k$ on $\vec b=2\hat i+3\hat j+6\hat k$ is`, R`$\dfrac{26}7$`, [R`$26$`, R`$\dfrac{26}{49}$`, R`$\dfrac{7}{26}$`],
    R`<p>$\vec a\cdot\vec b=2+6+18=26$, $|\vec b|=\sqrt{4+9+36}=7$. Scalar projection $=\dfrac{\vec a\cdot\vec b}{|\vec b|}=\dfrac{26}7$.</p>`, '$\\frac{26}{49}$ is the coefficient of $\\vec b$ in the vector projection.'),
  I(2, 'dot product', R`Two perpendicular vectors have magnitudes 6 and 8. The magnitude of their sum is`, 10,
    R`<p>$|\vec a+\vec b|^2=36+64+2\vec a\cdot\vec b=100$, since $\vec a\cdot\vec b=0$. So the magnitude is 10.</p>`, 'Do not add $6+8$ unless they are in the same direction.', { calc: () => Math.sqrt(36 + 64) }),
  I(2, 'dot product', R`If $|\vec a|=5$ and $|\vec b|=3$, then $(\vec a+\vec b)\cdot(\vec a-\vec b)$ equals`, 25 - 9,
    R`<p>$(\vec a+\vec b)\cdot(\vec a-\vec b)=|\vec a|^2-|\vec b|^2=25-9=16$.</p>`, 'The cross terms cancel because the dot product commutes.', { calc: () => 25 - 9 }),
  M(3, 'angle between vectors', R`The angle between $\hat i+2\hat j+2\hat k$ and $2\hat i-2\hat j+\hat k$ is`, '$90^\\circ$', ['$60^\\circ$', '$45^\\circ$', '$0^\\circ$'],
    R`<p>Dot product: $2-4+2=0$. So the vectors are perpendicular.</p>`, 'Zero dot product, so cos is 0.'),
  N(3, 'projection', R`Find the scalar projection of $\vec a=3\hat i-\hat j+2\hat k$ on $\vec b=2\hat i+3\hat j+6\hat k$.` + D3, r3(dot([3, -1, 2], [2, 3, 6]) / 7), 0.001,
    R`<p>$\vec a\cdot\vec b=6-3+12=15$. $|\vec b|=7$. Projection $=\dfrac{15}7\approx2.143$.</p>`, 'Divide by $|\\vec b|$, not by $|\\vec a|$.', { calc: () => r3(15 / 7) }),
  I(3, 'work done', R`A force $\vec F=2\hat i-\hat j+3\hat k$ newtons moves a particle from $(1,2,3)$ to $(4,0,5)$ (metres). The work done in joules is`, dot([2, -1, 3], sub([4, 0, 5], [1, 2, 3])),
    R`<p>Displacement $\vec d=(3,-2,2)$. $W=\vec F\cdot\vec d=6+2+6=14$ J.</p>`, 'Use the displacement vector (end minus start), not the end point.', { calc: () => 2 * 3 + -1 * -2 + 3 * 2 }),
  M(3, 'perpendicular vectors', R`If $|\vec a+\vec b|=|\vec a-\vec b|$ for non-zero vectors $\vec a,\vec b$, then`, R`$\vec a\perp\vec b$`, [R`$\vec a\parallel\vec b$`, R`$|\vec a|=|\vec b|$`, R`$\vec a=\vec b$`],
    R`<p>Squaring: $|\vec a|^2+|\vec b|^2+2\vec a\cdot\vec b=|\vec a|^2+|\vec b|^2-2\vec a\cdot\vec b$, so $\vec a\cdot\vec b=0$. The vectors are perpendicular.</p>`, 'Equal diagonals of a parallelogram mean a rectangle.'),
  I(3, 'perpendicular vectors', R`For vectors $\vec a=\hat i+2\hat j+k\hat k$ and $\vec b=3\hat i-\hat j+\hat k$, $|\vec a+\vec b|=|\vec a-\vec b|$. Find $k$.`, -1,
    R`<p>The condition means $\vec a\cdot\vec b=0$: $3-2+k=0$, so $k=-1$.</p>`, 'The condition is about perpendicular vectors.', { calc: () => -(3 - 2) }),
  N(3, 'angle between vectors', R`Find the cosine of the angle between $\vec a=2\hat i+\hat j-2\hat k$ and $\vec b=\hat i+2\hat j+2\hat k$.` + D3, r3(dot([2, 1, -2], [1, 2, 2]) / (3 * 3)), 0.001,
    R`<p>$\vec a\cdot\vec b=2+2-4=0$. So $\cos\theta=0$.</p>`, 'The product of the two magnitudes is $9$, but the numerator is $0$.', { calc: () => 0 }),
  N(3, 'angle between vectors', R`Find the angle (in degrees) between $\vec a=3\hat i+4\hat j$ and $\vec b=4\hat i+3\hat k$.` + D1, +deg(Math.acos(12 / 25)).toFixed(1), 0.1,
    R`<p>$\vec a\cdot\vec b=12$, $|\vec a|=5$, $|\vec b|=5$. $\cos\theta=\dfrac{12}{25}=0.48$, so $\theta=\cos^{-1}0.48\approx61.3^\circ$.</p>`, 'Only the $\\hat i$ terms pair up.', { calc: () => +deg(Math.acos(12 / 25)).toFixed(1) }),
  N(4, 'angle between vectors', R`Vectors $\vec a$ and $\vec b$ have $|\vec a|=3$, $|\vec b|=4$ and $\vec a\cdot\vec b=6$. Find the angle (in degrees) between $\vec a+\vec b$ and $\vec a-\vec b$.` + D1,
    +deg(Math.acos((9 - 16) / Math.sqrt((9 + 16 + 12) * (9 + 16 - 12)))).toFixed(1), 0.1,
    R`<p>$(\vec a+\vec b)\cdot(\vec a-\vec b)=9-16=-7$. $|\vec a+\vec b|^2=9+16+12=37$ and $|\vec a-\vec b|^2=9+16-12=13$. $\cos\theta=\dfrac{-7}{\sqrt{37\cdot13}}=\dfrac{-7}{\sqrt{481}}\approx-0.3192$, so $\theta\approx108.6^\circ$.</p>`, 'The angle is obtuse because the dot product is negative.', { calc: () => +deg(Math.acos(-7 / Math.sqrt(481))).toFixed(1) }),
  M(4, 'unit vectors', R`$\vec a,\vec b,\vec c$ are unit vectors with $\vec a+\vec b+\vec c=\vec 0$. The angle between any two of them is`, '$120^\\circ$', ['$60^\\circ$', '$90^\\circ$', '$150^\\circ$'],
    R`<p>$|\vec a+\vec b|=|-\vec c|=1$. So $1+1+2\cos\theta=1$, $\cos\theta=-\dfrac12$ and $\theta=120^\circ$.</p>`, 'Three unit vectors summing to zero form an equilateral triangle, whose exterior angle is $120^\\circ$.'),
  M(4, 'minimum distance', R`For $\vec a=\hat i+2\hat j+2\hat k$ and $\vec b=3\hat j+4\hat k$, the least value of $|\vec a+t\vec b|$ over real $t$ is`, R`$\dfrac{\sqrt{29}}5$`, [R`$\sqrt{29}$`, R`$\dfrac{\sqrt{29}}{25}$`, R`$3$`],
    R`<p>$|\vec a+t\vec b|^2$ is smallest when $\vec a+t\vec b\perp\vec b$, i.e. $t=-\dfrac{\vec a\cdot\vec b}{|\vec b|^2}$. The least value is the perpendicular distance $\dfrac{|\vec a\times\vec b|}{|\vec b|}$. $\vec a\times\vec b=(8-6,\,0-4,\,3-0)=(2,-4,3)$, $|\cdot|=\sqrt{29}$, $|\vec b|=5$.</p>`, 'The least length is the height of the parallelogram, not $|\\vec a|$.'),
  I(3, 'Lagrange identity', R`$|\vec a|=5$, $|\vec b|=4$ and $|\vec a\times\vec b|=12$. Then $(\vec a\cdot\vec b)^2$ is`, 25 * 16 - 144,
    R`<p>$(\vec a\cdot\vec b)^2+|\vec a\times\vec b|^2=|\vec a|^2|\vec b|^2$. So $(\vec a\cdot\vec b)^2=400-144=256$.</p>`, 'This identity is $\\cos^2+\\sin^2=1$ in disguise.', { calc: () => 25 * 16 - 144 }),
  M(3, 'dot product properties', R`Which is meaningless?`, R`$\vec a\cdot(\vec b\cdot\vec c)$`, [R`$\vec a\cdot(\vec b\times\vec c)$`, R`$\vec a\times(\vec b\times\vec c)$`, R`$(\vec a\cdot\vec b)\,\vec c$`],
    R`<p>$\vec b\cdot\vec c$ is a number, so $\vec a\cdot(\text{number})$ is not defined. The others are a number, a vector and a vector.</p>`, 'The dot product needs two vectors.'),

  // ================= cross product =================
  VM(2, 'cross product', R`If $\vec a=\hat i+2\hat j+3\hat k$ and $\vec b=-\hat i+2\hat k$, then $\vec a\times\vec b$ is`, cross([1, 2, 3], [-1, 0, 2]), [cross([-1, 0, 2], [1, 2, 3]), [-1, 0, 6], [4, -5, -2]],
    R`<p>$\begin{vmatrix}\hat i&\hat j&\hat k\\1&2&3\\-1&0&2\end{vmatrix}=\hat i(4-0)-\hat j(2+3)+\hat k(0+2)=4\hat i-5\hat j+2\hat k$.</p>`, 'The middle term carries a minus sign.'),
  I(2, 'area', R`Find the area of the parallelogram with adjacent sides $2\hat i$ and $\hat i+3\hat j$.`, 6,
    R`<p>$(2\hat i)\times(\hat i+3\hat j)=6\hat k$. Area $=|6\hat k|=6$. (Also base 2 times height 3.)</p>`, 'The parallelogram area is $|\\vec a\\times\\vec b|$.', { calc: () => nrm(cross([2, 0, 0], [1, 3, 0])) }),
  N(3, 'area', R`Find the area of the triangle with vertices $A(1,0,0)$, $B(0,2,0)$ and $C(0,0,3)$.`, 3.5, 0.001,
    R`<p>$\overrightarrow{AB}=(-1,2,0)$, $\overrightarrow{AC}=(-1,0,3)$. $\overrightarrow{AB}\times\overrightarrow{AC}=(6,3,2)$ with magnitude $\sqrt{36+9+4}=7$. Area $=\dfrac12\cdot7=3.5$.</p>`, 'The triangle is half the parallelogram.', { calc: () => nrm(cross([-1, 2, 0], [-1, 0, 3])) / 2 }),
  M(3, 'perpendicular to two vectors', R`A unit vector perpendicular to both $\vec a=2\hat i-\hat j-2\hat k$ and $\vec b=-3\hat i+2\hat j+2\hat k$ is`, R`$\dfrac13(2\hat i+2\hat j+\hat k)$`, [R`$\dfrac13(2\hat i-2\hat j+\hat k)$`, R`$\dfrac15(2\hat i+2\hat j+\hat k)$`, R`$2\hat i+2\hat j+\hat k$`],
    R`<p>$\vec a\times\vec b=\begin{vmatrix}\hat i&\hat j&\hat k\\2&-1&-2\\-3&2&2\end{vmatrix}=\hat i(-2+4)-\hat j(4-6)+\hat k(4-3)=2\hat i+2\hat j+\hat k$. Its magnitude is $3$. The unit vector is $\dfrac13(2\hat i+2\hat j+\hat k)$ (or its negative).</p>`, 'Divide by the magnitude of the cross product.'),
  I(3, 'area', R`The sides $\vec a=2\hat i-3\hat j-2\hat k$ and $\vec b=-3\hat i+2\hat j-2\hat k$ form a parallelogram. Its area is`, 15,
    R`<p>$\vec a\times\vec b=\hat i(6+4)-\hat j(-4-6)+\hat k(4-9)=10\hat i+10\hat j-5\hat k$. Magnitude $=\sqrt{100+100+25}=15$.</p>`, 'Compute the full cross product before the magnitude.', { calc: () => Math.round(nrm(cross([2, -3, -2], [-3, 2, -2]))) }),
  I(3, 'area', R`The diagonals of a parallelogram are $\vec d_1=3\hat i+\hat j-2\hat k$ and $\vec d_2=\hat i-3\hat j+4\hat k$. Find the square of its area.`, n2(cross([3, 1, -2], [1, -3, 4])) / 4,
    R`<p>Area $=\dfrac12|\vec d_1\times\vec d_2|$. $\vec d_1\times\vec d_2=(4-6,\,-2-12,\,-9-1)=(-2,-14,-10)$. $|\cdot|^2=4+196+100=300$. Area$^2=\dfrac{300}4=75$.</p>`, 'The area from diagonals has a factor $\\frac12$.', { calc: () => n2(cross([3, 1, -2], [1, -3, 4])) / 4 }),
  I(3, 'cross product', R`If $|\vec a|=3$, $|\vec b|=4$ and the angle between them is $30^\circ$, then $|\vec a\times\vec b|$ equals`, 6,
    R`<p>$|\vec a\times\vec b|=|\vec a||\vec b|\sin30^\circ=3\cdot4\cdot\dfrac12=6$.</p>`, 'Cross uses sine, dot uses cosine.', { calc: () => 3 * 4 * Math.sin(Math.PI / 6) }),
  M(3, 'cross product', R`If $\vec a\times\vec b=\vec a\times\vec c$ with $\vec a\ne\vec 0$, then`, R`$\vec b-\vec c$ is parallel to $\vec a$`, [R`$\vec b=\vec c$`, R`$\vec b-\vec c\perp\vec a$`, R`$\vec b+\vec c=\vec 0$`],
    R`<p>$\vec a\times(\vec b-\vec c)=\vec0$ means $\vec b-\vec c$ is parallel to $\vec a$ (or zero). We cannot cancel $\vec a$ in a cross product.</p>`, 'There is no cancellation law for the cross product.'),
  M(3, 'cross product', R`If $\vec a\cdot\vec b=\vec a\cdot\vec c$ and $\vec a\times\vec b=\vec a\times\vec c$ with $\vec a\ne\vec0$, then`, R`$\vec b=\vec c$`, [R`$\vec b=-\vec c$`, R`$\vec b\perp\vec c$`, R`$\vec b$ and $\vec c$ can be different`],
    R`<p>Let $\vec d=\vec b-\vec c$. Then $\vec a\cdot\vec d=0$ and $\vec a\times\vec d=\vec0$. The second says $\vec d\parallel\vec a$; the first says $\vec d\perp\vec a$. Only $\vec d=\vec0$ does both, so $\vec b=\vec c$.</p>`, 'Using both products together removes the ambiguity.'),
  N(3, 'cross product', R`Find $|\vec a\times\vec b|$ for $\vec a=\hat i-\hat j+2\hat k$ and $\vec b=2\hat i+\hat j-\hat k$.` + D3, r3(nrm(cross([1, -1, 2], [2, 1, -1]))), 0.001,
    R`<p>$\vec a\times\vec b=(1-2,\ 4+1,\ 1+2)=(-1,5,3)$. Magnitude $=\sqrt{1+25+9}=\sqrt{35}\approx5.916$.</p>`, 'Check by the identity $|\\vec a|^2|\\vec b|^2-(\\vec a\\cdot\\vec b)^2=6\\cdot6-(2-1-2)^2=35$.', { calc: () => r3(Math.sqrt(35)) }),
  I(4, 'area', R`The vertices of a quadrilateral are $A(0,0,0)$, $B(4,0,0)$, $C(4,3,0)$ and $D(0,3,0)$ taken in order. Its area, found as $\dfrac12|\overrightarrow{AC}\times\overrightarrow{BD}|$, is`, nrm(cross([4, 3, 0], [-4, 3, 0])) / 2,
    R`<p>$\overrightarrow{AC}=(4,3,0)$, $\overrightarrow{BD}=(-4,3,0)$. Cross product $=(0,0,12+12)=(0,0,24)$. Area $=\dfrac12\cdot24=12$, which is $4\times3$ as expected for a rectangle.</p>`, 'Use diagonals $\\overrightarrow{AC}$ and $\\overrightarrow{BD}$ in order.', { calc: () => nrm(cross([4, 3, 0], [-4, 3, 0])) / 2 }),
  A(3, 'cross product', R`$\vec a\times\vec b=\vec 0$ does not imply that $\vec a=\vec 0$ or $\vec b=\vec 0$.`, R`$|\vec a\times\vec b|=|\vec a||\vec b|\sin\theta$ vanishes when $\theta=0$ or $\pi$.`, 0,
    R`<p>Both are true, and R explains A: non-zero parallel vectors have a zero cross product.</p>`, 'The product of two numbers being zero forces one to be zero; for vectors it does not.'),
  A(3, 'dot product', R`$\vec a\cdot\vec b=0$ implies $\vec a=\vec 0$ or $\vec b=\vec 0$.`, R`$\vec a\cdot\vec b=|\vec a||\vec b|\cos\theta$.`, 3,
    R`<p>A is false: $\hat i\cdot\hat j=0$ although neither is zero. R is true; the product can vanish because $\cos\theta=0$.</p>`, 'Perpendicular non-zero vectors give zero dot product.'),
  A(3, 'cross product', R`The area of a triangle with vertices at position vectors $\vec a,\vec b,\vec c$ is $\dfrac12|(\vec b-\vec a)\times(\vec c-\vec a)|$.`, R`$|\vec u\times\vec v|$ is the area of the parallelogram with sides $\vec u,\vec v$, and a diagonal splits it into two equal triangles.`, 0,
    R`<p>Both are true, and R explains A.</p>`, 'Use two sides that start at the same vertex.'),
  A(3, 'dot product', R`The scalar projection of $\vec a$ on $\vec b$ is not equal to the scalar projection of $\vec b$ on $\vec a$ in general.`, R`The scalar projection of $\vec a$ on $\vec b$ is $\dfrac{\vec a\cdot\vec b}{|\vec b|}$.`, 0,
    R`<p>The two projections are $\dfrac{\vec a\cdot\vec b}{|\vec b|}$ and $\dfrac{\vec a\cdot\vec b}{|\vec a|}$. They differ unless $|\vec a|=|\vec b|$ (or the dot product is 0).</p>`, 'The denominator is the vector you project on.'),
  S(3, 'cross product', R`$\vec a\times\vec b=-\,\vec b\times\vec a$.`, R`$\vec a\cdot\vec b=-\,\vec b\cdot\vec a$.`, 1,
    R`<p>Statement I is true (anticommutative). Statement II is false: the dot product is commutative, $\vec a\cdot\vec b=\vec b\cdot\vec a$.</p>`, 'Dot is symmetric; cross is antisymmetric.'),
  S(3, 'dot product', R`The projection of $\vec a$ on $\vec b$ is a vector in the direction of $\vec b$ with magnitude $\left|\dfrac{\vec a\cdot\vec b}{|\vec b|}\right|$.`, R`The scalar projection of $\vec a$ on $\vec b$ can be negative.`, 0,
    R`<p>Both are true. The vector projection is $\dfrac{\vec a\cdot\vec b}{|\vec b|^2}\vec b$; the scalar projection is negative when the angle is obtuse.</p>`, 'Sign of the scalar projection follows $\\cos\\theta$.'),
  S(4, 'cross product', R`$(\vec a\times\vec b)\cdot\vec a=0$ for all $\vec a,\vec b$.`, R`$(\vec a\times\vec b)\times\vec a$ is perpendicular to $\vec a$ for all $\vec a,\vec b$.`, 0,
    R`<p>$\vec a\times\vec b\perp\vec a$ gives I. Any cross product with $\vec a$ is perpendicular to $\vec a$, giving II.</p>`, 'A cross product is perpendicular to both factors.'),
  S(3, 'vector algebra', R`If $|\vec a+\vec b|=|\vec a|+|\vec b|$ for non-zero vectors, then $\vec a$ and $\vec b$ point in the same direction.`, R`If $|\vec a-\vec b|=|\vec a|+|\vec b|$, then $\vec a$ and $\vec b$ are perpendicular.`, 1,
    R`<p>I is true (equality in the triangle inequality). II is false: it needs opposite directions, since then $|\vec a-\vec b|=|\vec a|+|\vec b|$.</p>`, 'Perpendicular vectors give $|\\vec a+\\vec b|^2=|\\vec a|^2+|\\vec b|^2$.'),
  SC(3, 'mixed concepts', [
    R`$\vec a\times\vec b$ is perpendicular to $\vec a$ and to $\vec b$.`,
    R`$(\vec a\cdot\vec b)\vec c$ is parallel to $\vec c$.`,
    R`$|\vec a\times\vec b|^2+(\vec a\cdot\vec b)^2=|\vec a|^2|\vec b|^2$.`,
    R`$\vec a\times(\vec b\times\vec c)=(\vec a\times\vec b)\times\vec c$ always.`], '3', ['1', '2', '4'],
    R`<p>(1) true. (2) true (a number times $\vec c$). (3) is Lagrange's identity, true. (4) false: the cross product is not associative; $\vec a\times(\vec b\times\vec c)=\vec b(\vec a\cdot\vec c)-\vec c(\vec a\cdot\vec b)$ whereas $(\vec a\times\vec b)\times\vec c=\vec b(\vec a\cdot\vec c)-\vec a(\vec b\cdot\vec c)$. So 3 are correct.</p>`, 'Associativity fails for the cross product.'),
  XT(3, 'dot and cross', R`Let $\vec a=\hat i+\hat j+\hat k$ and $\vec b=\hat i-\hat j+2\hat k$. Which statements are correct?`,
    [[R`$\vec a\cdot\vec b=2$`, dot([1, 1, 1], [1, -1, 2]) === 2], [R`$|\vec a\times\vec b|^2=14$`, n2(cross([1, 1, 1], [1, -1, 2])) === 14], [R`$\vec a\times\vec b=3\hat i-\hat j-2\hat k$`, cross([1, 1, 1], [1, -1, 2]).join() === '3,-1,-2'], [R`$\vec a\perp\vec b$`, false]],
    R`<p>$\vec a\cdot\vec b=1-1+2=2$. $\vec a\times\vec b=(2+1,\ 1-2,\ -1-1)=(3,-1,-2)$ with $|\cdot|^2=9+1+4=14$. Check with Lagrange: $3\cdot6-4=14$. The dot product is not 0, so the vectors are not perpendicular.</p>`, 'Compute the cross product once and reuse it.'),
  XT(4, 'dot and cross', R`For non-zero vectors $\vec a,\vec b$, which of the following can be true?`,
    [[R`$|\vec a\times\vec b|=|\vec a\cdot\vec b|$`, true], [R`$|\vec a\times\vec b|>|\vec a||\vec b|$`, false], [R`$\vec a\cdot\vec b=|\vec a||\vec b|$`, true], [R`$|\vec a\times\vec b|=0$ and $\vec a\cdot\vec b=0$ together`, false]],
    R`<p>True (45 degrees: $\sin=\cos$). $|\vec a\times\vec b|=|\vec a||\vec b|\sin\theta\le|\vec a||\vec b|$, so the second is false. The third holds for parallel vectors of the same direction. The fourth would need $\sin\theta=0$ and $\cos\theta=0$ together, which is impossible for non-zero vectors.</p>`, 'Compare only quantities of the same kind.'),
];

const itemsC = [
  // ================= scalar triple product, coplanarity =================
  I(2, 'scalar triple product', R`Find $[\vec a\ \vec b\ \vec c]$ for $\vec a=\hat i+2\hat j+3\hat k$, $\vec b=\hat j+4\hat k$ and $\vec c=5\hat i+6\hat j+\hat k$.`, trip([1, 2, 3], [0, 1, 4], [5, 6, 1]),
    R`<p>$\begin{vmatrix}1&2&3\\0&1&4\\5&6&1\end{vmatrix}=1(1-24)-2(0-20)+3(0-5)=-23+40-15=2$.</p>`, 'Watch the sign of the middle term of the expansion.', { calc: () => trip([1, 2, 3], [0, 1, 4], [5, 6, 1]) }),
  I(2, 'volume', R`Find the volume of the parallelepiped with edges $\hat i$, $\hat i+2\hat j$ and $\hat i+\hat j+3\hat k$.`, Math.abs(trip([1, 0, 0], [1, 2, 0], [1, 1, 3])),
    R`<p>Volume $=|[\vec a\ \vec b\ \vec c]|=\begin{vmatrix}1&0&0\\1&2&0\\1&1&3\end{vmatrix}=1\cdot(6-0)=6$.</p>`, 'Volume is the absolute value of the triple product.', { calc: () => 1 * 2 * 3 }),
  I(3, 'volume', R`The tetrahedron has vertices $A(0,0,0)$, $B(2,0,0)$, $C(0,3,0)$ and $D(1,1,4)$. Its volume is`, Math.abs(trip([2, 0, 0], [0, 3, 0], [1, 1, 4])) / 6,
    R`<p>$V=\dfrac16\left|[\overrightarrow{AB}\ \overrightarrow{AC}\ \overrightarrow{AD}]\right|=\dfrac16\begin{vmatrix}2&0&0\\0&3&0\\1&1&4\end{vmatrix}=\dfrac{24}6=4$.</p>`, 'A tetrahedron is one-sixth of the parallelepiped.', { calc: () => (2 * 3 * 4) / 6 }),
  I(3, 'coplanar vectors', R`The vectors $2\hat i-\hat j+\hat k$, $\hat i+2\hat j-3\hat k$ and $3\hat i+\lambda\hat j+5\hat k$ are coplanar. Find $\lambda$.`, -4,
    R`<p>Coplanar means the triple product is 0: $\begin{vmatrix}2&-1&1\\1&2&-3\\3&\lambda&5\end{vmatrix}=2(10+3\lambda)+1(5+9)+1(\lambda-6)=7\lambda+28=0$, so $\lambda=-4$.</p>`, 'Expand along the first row and keep the sign pattern $+,-,+$.', { calc: () => -28 / 7 }),
  I(3, 'coplanar points', R`The points $A(1,0,0)$, $B(0,1,0)$, $C(0,0,1)$ and $D(\lambda,2,2)$ are coplanar. Find $\lambda$.`, -3,
    R`<p>The plane through $A,B,C$ is $x+y+z=1$. $D$ lies on it if $\lambda+2+2=1$, so $\lambda=-3$.</p>`, 'Find the plane first; it is quicker than a $3\\times3$ determinant here.', { calc: () => 1 - 4 }),
  I(3, 'scalar triple product', R`If $[\vec a\ \vec b\ \vec c]=5$, then $[\vec a+\vec b\ \ \vec b+\vec c\ \ \vec c+\vec a]$ equals`, 10,
    R`<p>For any three vectors, $[\vec a+\vec b\ \vec b+\vec c\ \vec c+\vec a]=2[\vec a\ \vec b\ \vec c]=10$.</p>`, 'Expand and drop the terms with a repeated vector.', { calc: () => 2 * 5 }),
  M(4, 'scalar triple product', R`For any three vectors $\vec a,\vec b,\vec c$, the value of $[\vec a-\vec b\ \ \vec b-\vec c\ \ \vec c-\vec a]$ is`, '$0$', [R`$[\vec a\ \vec b\ \vec c]$`, R`$2[\vec a\ \vec b\ \vec c]$`, R`$-[\vec a\ \vec b\ \vec c]$`],
    R`<p>The three vectors add up to $\vec 0$, so the third is minus the sum of the other two. The three are coplanar and the triple product is 0.</p>`, 'The vectors are dependent whatever $\\vec a,\\vec b,\\vec c$ are.'),
  I(4, 'scalar triple product', R`If $[\vec a\ \vec b\ \vec c]=3$, then $[\vec a\times\vec b\ \ \vec b\times\vec c\ \ \vec c\times\vec a]$ equals`, 9,
    R`<p>The identity is $[\vec a\times\vec b\ \vec b\times\vec c\ \vec c\times\vec a]=[\vec a\ \vec b\ \vec c]^2=9$.</p>`, 'It is the square, not twice the value.', { calc: () => 3 ** 2 }),
  I(3, 'volume', R`The vectors $\hat i+\hat j$, $\hat j+\hat k$ and $\hat i+\hat k$ are edges of a parallelepiped. Its volume is`, Math.abs(trip([1, 1, 0], [0, 1, 1], [1, 0, 1])),
    R`<p>$\begin{vmatrix}1&1&0\\0&1&1\\1&0&1\end{vmatrix}=1(1-0)-1(0-1)+0=2$.</p>`, 'The middle term is $-1\\cdot(0\\cdot1-1\\cdot1)=+1$.', { calc: () => 2 }),
  I(4, 'volume', R`The edges $\vec a=\hat i$, $\vec b=2\hat j$ and $\vec c=\hat i+\hat j+3\hat k$ meet at a vertex of a parallelepiped. The perpendicular distance of the tip of $\vec c$ from the plane of $\vec a$ and $\vec b$ is`, 3,
    R`<p>Height $=\dfrac{|[\vec a\ \vec b\ \vec c]|}{|\vec a\times\vec b|}$. $\vec a\times\vec b=2\hat k$ (magnitude 2) and $[\vec a\ \vec b\ \vec c]=6$. Height $=3$ (the $\hat k$-component of $\vec c$).</p>`, 'Volume divided by base area gives height.', { calc: () => Math.abs(trip([1, 0, 0], [0, 2, 0], [1, 1, 3])) / nrm(cross([1, 0, 0], [0, 2, 0])) }),
  I(3, 'linear combination', R`$\vec p=4\hat i+5\hat j+3\hat k$ is written as $x\vec a+y\vec b+z\vec c$ with $\vec a=\hat i+\hat k$, $\vec b=\hat j+\hat k$ and $\vec c=\hat i+\hat j$. Find $x+y+z$.`, 6,
    R`<p>Compare components: $\hat i$: $x+z=4$; $\hat j$: $y+z=5$; $\hat k$: $x+y=3$. Adding: $2(x+y+z)=12$, so $x+y+z=6$ (and $x=1,y=2,z=3$).</p>`, 'Add the three equations before solving them one by one.', { calc: () => (4 + 5 + 3) / 2 }),
  M(3, 'linear independence', R`Which set of vectors is linearly dependent?`, R`$\hat i+\hat j,\ \hat j+\hat k,\ \hat i-\hat k$`, [R`$\hat i,\ \hat j,\ \hat k$`, R`$\hat i+\hat j,\ \hat j+\hat k,\ \hat i+\hat k$`, R`$\hat i,\ \hat i+\hat j,\ \hat i+\hat j+\hat k$`],
    R`<p>$(\hat i+\hat j)-(\hat j+\hat k)=\hat i-\hat k$, so the first set is dependent (determinant 0). The others have non-zero determinants (1, 2 and 1).</p>`, 'Look for one vector that is a combination of the other two.'),
  S(3, 'linear independence', R`Three vectors are linearly independent if and only if their scalar triple product is non-zero.`, R`Any four vectors in space are linearly dependent.`, 0,
    R`<p>Both are true: independent means not coplanar, and space has only three independent directions.</p>`, 'Independence in 3D needs exactly three non-coplanar vectors.'),
  S(4, 'linear independence', R`$\vec a,\vec b,\vec c$ are linearly independent exactly when $x\vec a+y\vec b+z\vec c=\vec 0$ forces $x=y=z=0$.`, R`If $\vec a\times\vec b=\vec0$ for non-zero vectors, then $\vec a$ and $\vec b$ are linearly independent.`, 1,
    R`<p>I is the definition. II is false: $\vec a\times\vec b=\vec0$ means parallel, so $\vec a=k\vec b$ and they are dependent.</p>`, 'Parallel vectors are dependent.'),
  XT(3, 'coplanar vectors', R`Let $\vec a=\hat i+\hat j$, $\vec b=\hat j+\hat k$, $\vec c=\hat i+2\hat j+\hat k$. Which statements are correct?`,
    [[R`$[\vec a\ \vec b\ \vec c]=0$`, trip([1, 1, 0], [0, 1, 1], [1, 2, 1]) === 0], [R`$\vec c=\vec a+\vec b$`, true], [R`$\{\vec a,\vec b,\vec c\}$ is linearly independent`, false], [R`$\vec a,\vec b,\vec c$ are coplanar`, true]],
    R`<p>$\vec a+\vec b=\hat i+2\hat j+\hat k=\vec c$, so the triple product is zero and the three are coplanar and dependent.</p>`, 'One vector being the sum of the others means they lie in a plane.'),

  // ================= vector triple product =================
  VM(3, 'vector triple product', R`For $\vec a=\hat i+2\hat j$, $\vec b=2\hat i+\hat j+3\hat k$ and $\vec c=\hat j+\hat k$, the vector $\vec a\times(\vec b\times\vec c)$ is`, cross([1, 2, 0], cross([2, 1, 3], [0, 1, 1])), [cross(cross([1, 2, 0], [2, 1, 3]), [0, 1, 1]), sub(sc(dot([1, 2, 0], [2, 1, 3]), [0, 1, 1]), sc(dot([1, 2, 0], [0, 1, 1]), [2, 1, 3])), [-2, 4, 0]],
    R`<p>Use $\vec a\times(\vec b\times\vec c)=\vec b(\vec a\cdot\vec c)-\vec c(\vec a\cdot\vec b)$. $\vec a\cdot\vec c=2$, $\vec a\cdot\vec b=4$. So $=2(2,1,3)-4(0,1,1)=(4,2,6)-(0,4,4)=(4,-2,2)$.</p>`, 'The bracket is "middle times (first dot last) minus last times (first dot middle)".'),
  I(3, 'vector triple product', R`If $\vec a=\hat i+\hat j-\hat k$, $\vec b=\hat i-\hat j+\hat k$ and $\vec c=2\hat i+\hat j+\hat k$, the $\hat j$-component of $\vec a\times(\vec b\times\vec c)$ is`, cross([1, 1, -1], cross([1, -1, 1], [2, 1, 1]))[1],
    R`<p>$\vec a\cdot\vec c=2+1-1=2$, $\vec a\cdot\vec b=1-1-1=-1$. $\vec a\times(\vec b\times\vec c)=\vec b(2)-\vec c(-1)=(2,-2,2)+(2,1,1)=(4,-1,3)$. The $\hat j$-component is $-1$.</p>`, 'Compute the two dot products first.', { calc: () => cross([1, 1, -1], cross([1, -1, 1], [2, 1, 1]))[1] }),
  M(3, 'vector triple product', R`The vector $\vec a\times(\vec b\times\vec c)$ always lies in the plane of`, R`$\vec b$ and $\vec c$`, [R`$\vec a$ and $\vec b$`, R`$\vec a$ and $\vec c$`, R`$\vec a,\vec b$ and $\vec c$ only if they are coplanar`],
    R`<p>$\vec a\times(\vec b\times\vec c)=\vec b(\vec a\cdot\vec c)-\vec c(\vec a\cdot\vec b)$ is a combination of $\vec b$ and $\vec c$.</p>`, 'Compare with $(\\vec a\\times\\vec b)\\times\\vec c$, which lies in the plane of $\\vec a,\\vec b$.'),
  M(4, 'vector triple product', R`If $\vec a\times(\vec b\times\vec c)=(\vec a\times\vec b)\times\vec c$ for non-zero, non-parallel vectors $\vec a,\vec c$, then $\vec b$ is`, R`perpendicular to both $\vec a$ and $\vec c$`, [R`parallel to $\vec a$`, R`equal to $\vec a+\vec c$`, R`any vector`],
    R`<p>LHS $=\vec b(\vec a\cdot\vec c)-\vec c(\vec a\cdot\vec b)$, RHS $=\vec b(\vec a\cdot\vec c)-\vec a(\vec b\cdot\vec c)$. Equality gives $\vec c(\vec a\cdot\vec b)=\vec a(\vec b\cdot\vec c)$. Since $\vec a,\vec c$ are independent, $\vec a\cdot\vec b=0$ and $\vec b\cdot\vec c=0$.</p>`, 'Independence lets you compare coefficients of $\\vec a$ and $\\vec c$.'),
  I(4, 'vector triple product', R`Let $|\vec a|=1$, $\vec a\perp\vec b$, $\vec a\cdot\vec c=3$ and $\vec b\cdot\vec c=4$. Then the component of $\vec a\times(\vec b\times\vec c)$ along $\vec a$ is`, 0,
    R`<p>$\vec a\times(\vec b\times\vec c)$ is perpendicular to $\vec a$ (it is a cross product with $\vec a$), so its component along $\vec a$ is 0, whatever the numbers are. Check: $\vec b(\vec a\cdot\vec c)-\vec c(\vec a\cdot\vec b)=3\vec b-0$, and $\vec b\cdot\vec a=0$.</p>`, 'Any cross product with $\\vec a$ is perpendicular to $\\vec a$.', { calc: () => 3 * 0 - 0 }),
  S(4, 'vector triple product', R`$\vec a\times(\vec b\times\vec c)+\vec b\times(\vec c\times\vec a)+\vec c\times(\vec a\times\vec b)=\vec0$ for all vectors.`, R`$(\vec a\times\vec b)\times\vec c=\vec a\times(\vec b\times\vec c)$ for all vectors.`, 1,
    R`<p>I is the Jacobi identity: expand each term and everything cancels. II is false in general (it needs $\vec b$ perpendicular to both $\vec a$ and $\vec c$, as in the previous problem).</p>`, 'The cross product is not associative.'),
  M(4, 'vector triple product', R`If $\vec a=\hat i$, $\vec b=\hat j$, then $\vec a\times(\vec a\times\vec b)$ equals`, R`$-\hat j$`, [R`$\hat j$`, R`$\hat k$`, R`$\vec 0$`],
    R`<p>$\hat i\times\hat j=\hat k$. Then $\hat i\times\hat k=-\hat j$. By formula: $\vec a(\vec a\cdot\vec b)-\vec b(\vec a\cdot\vec a)=0-\hat j$.</p>`, '$\\hat i\\times\\hat k=-\\hat j$, since $\\hat k\\times\\hat i=\\hat j$.'),
  I(5, 'vector triple product', R`Let $\vec a,\vec b$ be unit vectors with $\vec a\perp\vec b$ and $\vec c=\vec a+2\vec b$. Find $|\vec c\times(\vec a\times\vec c)|^2$.`, 20 - 0,
    R`<p>$\vec c\times(\vec a\times\vec c)=\vec a(\vec c\cdot\vec c)-\vec c(\vec c\cdot\vec a)$. $|\vec c|^2=1+4=5$ and $\vec c\cdot\vec a=1$. So the vector is $5\vec a-\vec c=5\vec a-\vec a-2\vec b=4\vec a-2\vec b$ with squared magnitude $16+4=20$.</p>`, 'Substitute $\\vec c$ at the end and use $\\vec a\\cdot\\vec b=0$.', { calc: () => 16 + 4 }),

  // ================= vector equations =================
  I(4, 'vector equations', R`The equation $\vec r\times\vec a=\vec b$ with $\vec a=\hat i+2\hat j-2\hat k$ and $\vec b=2\hat i+\lambda\hat j+2\hat k$ has a solution. Find $\lambda$.`, 1,
    R`<p>Taking the dot product with $\vec a$: $\vec a\cdot(\vec r\times\vec a)=0$, so $\vec a\cdot\vec b=0$ is necessary: $2+2\lambda-4=0$, $\lambda=1$.</p>`, '$\\vec r\\times\\vec a$ is perpendicular to $\\vec a$, so $\\vec b$ must be too.', { calc: () => (4 - 2) / 2 }),
  I(4, 'vector equations', R`$\vec r\times\vec a=\vec b$ with $\vec a=\hat i+2\hat j+2\hat k$ and $\vec b=4\hat i+2\hat j-4\hat k$. Among all solutions $\vec r$, the least value of $|\vec r|$ is`, 2,
    R`<p>$\vec a\cdot\vec b=4+4-8=0$, so solutions exist: $\vec r=\dfrac{\vec a\times\vec b}{|\vec a|^2}+\lambda\vec a$, and $\dfrac{\vec a\times\vec b}{|\vec a|^2}\perp\vec a$, so the shortest solution is at $\lambda=0$. $|\vec r_0|=\dfrac{|\vec a||\vec b|}{|\vec a|^2}=\dfrac{|\vec b|}{|\vec a|}=\dfrac63=2$.</p>`, 'The shortest solution is perpendicular to $\\vec a$.', { calc: () => nrm([4, 2, -4]) / nrm([1, 2, 2]) }),
  I(4, 'vector equations', R`Let $\vec a=\hat i+2\hat j+2\hat k$ and $\vec b=2\hat i+\hat j-2\hat k$. The vector $\vec r$ satisfies $\vec r\times\vec a=\vec b$ and $\vec r\cdot\vec a=3$. The sum of the components of $9\vec r$ is`, 5 * 3 - 3,
    R`<p>From $\vec a\times(\vec r\times\vec a)=\vec r|\vec a|^2-\vec a(\vec a\cdot\vec r)=\vec a\times\vec b$ we get $9\vec r=3\vec a+\vec a\times\vec b$. $\vec a\times\vec b=(-4-2,\ 4+2,\ 1-4)=(-6,6,-3)$. So $9\vec r=(3,6,6)+(-6,6,-3)=(-3,12,3)$, whose components sum to $12$.</p>`, 'Cross the first equation with $\\vec a$ from the left.', { calc: () => { const a = [1, 2, 2], b = [2, 1, -2]; const w = add(sc(3, a), cross(a, b)); return w[0] + w[1] + w[2]; } }),
  M(4, 'vector equations', R`If $\vec a\cdot\vec b=0$ and $\vec a\ne\vec0$, the general solution of $\vec r\times\vec a=\vec b$ is`, R`$\vec r=\dfrac{\vec a\times\vec b}{|\vec a|^2}+\lambda\vec a$`, [R`$\vec r=\dfrac{\vec b\times\vec a}{|\vec a|^2}+\lambda\vec a$`, R`$\vec r=\dfrac{\vec a\times\vec b}{|\vec a|}+\lambda\vec b$`, R`$\vec r=\dfrac{\vec b}{|\vec a|^2}$`],
    R`<p>Cross with $\vec a$: $\vec a\times(\vec r\times\vec a)=\vec r|\vec a|^2-\vec a(\vec a\cdot\vec r)=\vec a\times\vec b$. So $\vec r=\dfrac{\vec a\times\vec b+(\vec a\cdot\vec r)\vec a}{|\vec a|^2}$, and the free number $\vec a\cdot\vec r$ gives the family $\lambda\vec a$.</p>`, 'Order matters: $\\vec a\\times\\vec b$, not $\\vec b\\times\\vec a$.'),
  VM(4, 'vector equations', R`Let $\vec a=\hat i+\hat j$ and $\vec b=\hat i-\hat j$. The vector $\vec r$ satisfies $\vec r\times\vec a=\vec b$ and $\vec r\cdot\vec a=0$. Then $\vec r$ is`, [0, 0, -1], [[0, 0, 1], [1, -1, 0], [1, 1, 0]],
    R`<p>$\vec a\cdot\vec b=1-1=0$. With $\vec r\cdot\vec a=0$: $\vec r=\dfrac{\vec a\times\vec b}{|\vec a|^2}=\dfrac{(1,1,0)\times(1,-1,0)}2=\dfrac{(0,0,-2)}2=-\hat k$. Check: $(-\hat k)\times(\hat i+\hat j)=-\hat j+\hat i=\hat i-\hat j$. ✓.</p>`, 'Verify by substituting back.'),

  // ================= reciprocal system =================
  I(4, 'reciprocal system', R`$\vec a'=\dfrac{\vec b\times\vec c}{[\vec a\ \vec b\ \vec c]}$, $\vec b'=\dfrac{\vec c\times\vec a}{[\vec a\ \vec b\ \vec c]}$, $\vec c'=\dfrac{\vec a\times\vec b}{[\vec a\ \vec b\ \vec c]}$. Then $\vec a\cdot\vec a'+\vec b\cdot\vec b'+\vec c\cdot\vec c'$ equals`, 3,
    R`<p>$\vec a\cdot\vec a'=\dfrac{\vec a\cdot(\vec b\times\vec c)}{[\vec a\ \vec b\ \vec c]}=1$. In the same way $\vec b\cdot\vec b'=1$ and $\vec c\cdot\vec c'=1$. Sum $=3$.</p>`, 'Each term is a triple product divided by itself.', { calc: () => 3 }),
  I(4, 'reciprocal system', R`In the reciprocal system of $\vec a,\vec b,\vec c$, if $[\vec a\ \vec b\ \vec c]=\dfrac14$, then $[\vec a'\ \vec b'\ \vec c']$ equals`, 4,
    R`<p>$[\vec a'\ \vec b'\ \vec c']=\dfrac1{[\vec a\ \vec b\ \vec c]}=4$.</p>`, 'It is the reciprocal, not the negative.', { calc: () => 1 / (1 / 4) }),
  I(4, 'reciprocal system', R`For $\vec a=\hat i$, $\vec b=\hat i+\hat j$ and $\vec c=\hat i+\hat j+\hat k$, find $|\vec a'|^2+|\vec b'|^2+|\vec c'|^2$.`, (() => { const D = trip([1, 0, 0], [1, 1, 0], [1, 1, 1]); return (n2(cross([1, 1, 0], [1, 1, 1])) + n2(cross([1, 1, 1], [1, 0, 0])) + n2(cross([1, 0, 0], [1, 1, 0]))) / (D * D); })(),
    R`<p>$[\vec a\ \vec b\ \vec c]=1$. $\vec a'=\vec b\times\vec c=(1,-1,0)$, $\vec b'=\vec c\times\vec a=(0,1,-1)$, $\vec c'=\vec a\times\vec b=(0,0,1)$. Squares of lengths: $2+2+1=5$.</p>`, 'The determinant is 1, so no division is needed here.', { calc: () => 5 }),
  M(4, 'reciprocal system', R`If $[\vec a\ \vec b\ \vec c]=4$, then $\vec a'\times\vec b'$ equals`, R`$\dfrac{\vec c}{4}$`, [R`$\vec c$`, R`$4\vec c$`, R`$\dfrac{\vec c}{16}$`],
    R`<p>$\vec a'\times\vec b'=\dfrac{(\vec b\times\vec c)\times(\vec c\times\vec a)}{D^2}$ and $(\vec b\times\vec c)\times(\vec c\times\vec a)=[\vec b\ \vec c\ \vec a]\vec c=D\vec c$. So $\vec a'\times\vec b'=\dfrac{\vec c}{D}=\dfrac{\vec c}4$.</p>`, 'The numerator brings one factor $D$, the denominator $D^2$.'),
  A(4, 'reciprocal system', R`For non-coplanar $\vec a,\vec b,\vec c$, the vector $\vec a'$ of the reciprocal system satisfies $\vec a'\cdot\vec b=0$.`, R`$\vec a'$ is proportional to $\vec b\times\vec c$, which is perpendicular to $\vec b$.`, 0,
    R`<p>Both are true, and R explains A: $\vec b\times\vec c\perp\vec b$, so $\vec a'\cdot\vec b=0$ (and likewise $\vec a'\cdot\vec c=0$).</p>`, 'Each reciprocal vector has dot product 0 with two of the originals and 1 with its own.'),

  // ================= angle bisectors and geometry =================
  VM(3, 'angle bisector', R`$\vec a=\hat i+2\hat j+2\hat k$ and $\vec b=2\hat i+3\hat j+6\hat k$. A vector along the internal bisector of the angle between them is`, add(sc(7, [1, 2, 2]), sc(3, [2, 3, 6])), [add(sc(3, [1, 2, 2]), sc(7, [2, 3, 6])), add([1, 2, 2], [2, 3, 6]), sub(sc(7, [1, 2, 2]), sc(3, [2, 3, 6]))],
    R`<p>The bisector is along $\hat a+\hat b=\dfrac{\vec a}{|\vec a|}+\dfrac{\vec b}{|\vec b|}=\dfrac{\vec a}3+\dfrac{\vec b}7$. Multiply by 21: $7\vec a+3\vec b=(7+6,\ 14+9,\ 14+18)=(13,23,32)$.</p>`, '$\\vec a+\\vec b$ bisects only when the magnitudes are equal.'),
  M(3, 'angle bisector', R`The diagonals of a parallelogram with sides $\vec a$ and $\vec b$ bisect the angles between the sides only when`, R`$|\vec a|=|\vec b|$ (a rhombus)`, [R`$\vec a\perp\vec b$ (a rectangle)`, R`$\vec a\parallel\vec b$`, R`always`],
    R`<p>The diagonal $\vec a+\vec b$ bisects the angle between $\vec a$ and $\vec b$ iff $\hat a+\hat b\parallel\vec a+\vec b$, i.e. $|\vec a|=|\vec b|$.</p>`, 'A rectangle has equal diagonals, but they do not bisect the angles.'),
  I(3, 'angle bisector', R`In triangle $ABC$, $A$ is the origin, $B(1,2,2)$ and $C(4,4,2)$. The bisector of angle $A$ meets $BC$ at $D$ with $BD:DC=m:n$ in lowest terms. Find $m+n$.`, 3,
    R`<p>By the angle bisector theorem $BD:DC=AB:AC=|(1,2,2)|:|(4,4,2)|=3:6=1:2$. So $m+n=3$.</p>`, 'The ratio is $AB:AC$, not $AC:AB$.', { calc: () => { const r = nrm([1, 2, 2]) / nrm([4, 4, 2]); return Math.round(1 / r) + 1; } }),
  M(4, 'angle bisector', R`The internal bisector of the angle between $\vec a$ and $\vec b$ meets the line joining their tips (points $A$, $B$) at $D$. The position vector of $D$ is`, R`$\dfrac{|\vec b|\,\vec a+|\vec a|\,\vec b}{|\vec a|+|\vec b|}$`, [R`$\dfrac{|\vec a|\,\vec a+|\vec b|\,\vec b}{|\vec a|+|\vec b|}$`, R`$\dfrac{\vec a+\vec b}{2}$`, R`$\dfrac{|\vec a|\,\vec b+|\vec b|\,\vec a}{|\vec a|\,|\vec b|}$`],
    R`<p>$AD:DB=OA:OB=|\vec a|:|\vec b|$. By the section formula $D=\dfrac{|\vec a|\vec b+|\vec b|\vec a}{|\vec a|+|\vec b|}$.</p>`, 'The longer side gets the smaller share: $\\vec a$ is weighted by $|\\vec b|$.'),
  I(3, 'parallelogram', R`$A(1,2,3)$, $B(3,1,2)$ and $C(6,4,5)$ are three vertices of a parallelogram $ABCD$ (in order). The sum of the coordinates of $D$ is`, 4 + 5 + 6,
    R`<p>Diagonals bisect each other: $\vec a+\vec c=\vec b+\vec d$, so $\vec d=\vec a+\vec c-\vec b=(1+6-3,\ 2+4-1,\ 3+5-2)=(4,5,6)$. Sum $=15$.</p>`, 'The fourth vertex is opposite $B$.', { calc: () => 15 }),
  M(3, 'parallelogram', R`A parallelogram has diagonals $\vec a+\vec b$ and $\vec a-\vec b$. It is a rhombus if and only if`, R`$(\vec a+\vec b)\cdot(\vec a-\vec b)=0$`, [R`$(\vec a+\vec b)\times(\vec a-\vec b)=\vec 0$`, R`$\vec a\cdot\vec b=0$`, R`$|\vec a+\vec b|=|\vec a-\vec b|$`],
    R`<p>A rhombus has perpendicular diagonals: $(\vec a+\vec b)\cdot(\vec a-\vec b)=|\vec a|^2-|\vec b|^2=0$. Option C describes a rectangle.</p>`, 'Equal diagonals mean a rectangle; perpendicular diagonals mean a rhombus.'),
  I(4, 'median', R`The sides of a triangle have lengths 6, 8 and 10. The square of the length of the median to the side of length 10 is`, 25,
    R`<p>For the median to side $a$: $m^2=\dfrac{2b^2+2c^2-a^2}4=\dfrac{2\cdot36+2\cdot64-100}4=\dfrac{100}4=25$. (The triangle is right-angled and this median is half the hypotenuse.)</p>`, 'The formula follows from $\\vec m=\\frac12(\\vec b+\\vec c)$.', { calc: () => (2 * 36 + 2 * 64 - 100) / 4 }),
  I(3, 'collinear points', R`The points $A(1,1,1)$, $B(2,3,4)$ and $C(3,5,\lambda)$ are collinear. Find $\lambda$.`, 7,
    R`<p>$\overrightarrow{AB}=(1,2,3)$ and $\overrightarrow{AC}=(2,4,\lambda-1)$ must be parallel: $\dfrac21=\dfrac42=\dfrac{\lambda-1}3$, so $\lambda-1=6$ and $\lambda=7$.</p>`, 'Compare $\\overrightarrow{AB}$ and $\\overrightarrow{AC}$, both from $A$.', { calc: () => 1 + 2 * 3 }),
  M(3, 'collinear points', R`The points with position vectors $\vec a$, $\vec b$ and $3\vec a-2\vec b$ are`, 'collinear', ['the vertices of a right triangle', 'coplanar but never collinear', 'the vertices of an equilateral triangle'],
    R`<p>$3\vec a-2\vec b=\vec a+2(\vec a-\vec b)$, a point on the line through $A$ and $B$ (beyond $A$). The coefficients $3$ and $-2$ add up to 1, which is the test. Hence collinear.</p>`, 'Coefficients adding to 1 mean the point is on the line $AB$.'),
  M(4, 'collinear points', R`The points with position vectors $\vec a$, $\vec b$ and $x\vec a+y\vec b$ are collinear when`, R`$x+y=1$`, [R`$x+y=0$`, R`$xy=1$`, R`$x=y$`],
    R`<p>$x\vec a+y\vec b=\vec a+y(\vec b-\vec a)$ only if $x=1-y$. A point on line $AB$ has the form $(1-t)\vec a+t\vec b$, so the coefficients add to 1.</p>`, 'Affine combination: coefficients sum to 1.'),
  I(3, 'medians', R`$A(2,0,0)$, $B(0,4,0)$, $C(0,0,6)$ are vertices of a triangle with centroid $G$. Then $OG^2$, where $O$ is the origin, times 9 equals`, 56,
    R`<p>$G=\dfrac{(2,4,6)}3$, so $9\,OG^2=|(2,4,6)|^2=4+16+36=56$.</p>`, 'Square the sum before dividing by 3.', { calc: () => 4 + 16 + 36 }),
  M(4, 'distance from a line', R`The distance of $P(1,2,3)$ from the line through the origin with direction $\hat i+2\hat j+2\hat k$ is`, R`$\dfrac{\sqrt5}3$`, [R`$\sqrt5$`, R`$\dfrac{\sqrt{14}}3$`, R`$\dfrac13$`],
    R`<p>Distance $=\dfrac{|\overrightarrow{OP}\times\vec d|}{|\vec d|}$. $(1,2,3)\times(1,2,2)=(4-6,\ 3-2,\ 2-2)=(-2,1,0)$ with magnitude $\sqrt5$. $|\vec d|=3$. Distance $=\dfrac{\sqrt5}3$.</p>`, 'Divide the cross product by the direction length.'),
  I(5, 'cevian', R`In triangle $ABC$, $D$ is on $BC$ with $BD:DC=2:3$ and $E$ is on $CA$ with $CE:EA=1:2$. $AD$ and $BE$ meet at $P$. If $AP:PD=m:n$ in lowest terms, find $m+n$.`, 6,
    R`<p>$D=\dfrac{3\vec b+2\vec c}5$, $E=\dfrac{2\vec c+\vec a}3$. Write $P=(1-s)\vec a+s\vec D$ and $P=(1-t)\vec b+t\vec E$ and compare coefficients of $\vec a,\vec b,\vec c$: $1-s=\dfrac t3$, $\dfrac{3s}5=1-t$, $\dfrac{2s}5=\dfrac{2t}3$. The last gives $s=\dfrac{5t}3$; then $t=1-t$, $t=\dfrac12$, $s=\dfrac56$. So $AP:PD=\dfrac56:\dfrac16=5:1$ and $m+n=6$.</p>`, 'Check all three coefficient equations, not just two.', { calc: () => { const t = 1 / 2, s = (5 * t) / 3; return Math.round(s / (1 - s)) + 1; } }),
  I(5, 'unit vectors', R`$\vec a,\vec b,\vec c$ are unit vectors with $\vec a\perp\vec b$, $\vec a\perp\vec c$ and $\vec b\cdot\vec c=\dfrac35$. If $\vec a=k(\vec b\times\vec c)$, then $4|k|$ equals`, 5,
    R`<p>$\vec b\times\vec c$ is perpendicular to $\vec b,\vec c$, so it is along $\pm\vec a$. $|\vec b\times\vec c|=\sin\theta=\sqrt{1-\dfrac9{25}}=\dfrac45$. Since $|\vec a|=1$, $|k|\cdot\dfrac45=1$, $|k|=\dfrac54$ and $4|k|=5$.</p>`, 'Get the sine from the cosine.', { calc: () => 4 * (1 / Math.sqrt(1 - 0.36)) }),
  I(5, 'Gram determinant', R`$\vec a,\vec b,\vec c$ are unit vectors and each pair has dot product $\dfrac13$. Then $27\,[\vec a\ \vec b\ \vec c]^2$ equals`, 20,
    R`<p>$[\vec a\ \vec b\ \vec c]^2=\begin{vmatrix}\vec a\cdot\vec a&\vec a\cdot\vec b&\vec a\cdot\vec c\\\vec b\cdot\vec a&\vec b\cdot\vec b&\vec b\cdot\vec c\\\vec c\cdot\vec a&\vec c\cdot\vec b&\vec c\cdot\vec c\end{vmatrix}=\begin{vmatrix}1&\frac13&\frac13\\\frac13&1&\frac13\\\frac13&\frac13&1\end{vmatrix}=\dfrac{20}{27}$. So $27[\cdot]^2=20$.</p>`, 'The square of a triple product is a determinant of dot products.', { calc: () => { const g = [[1, 1 / 3, 1 / 3], [1 / 3, 1, 1 / 3], [1 / 3, 1 / 3, 1]]; const d = g[0][0] * (g[1][1] * g[2][2] - g[1][2] * g[2][1]) - g[0][1] * (g[1][0] * g[2][2] - g[1][2] * g[2][0]) + g[0][2] * (g[1][0] * g[2][1] - g[1][1] * g[2][0]); return Math.round(27 * d); } }),
  I(4, 'reciprocal system', R`If $\vec a,\vec b,\vec c$ are non-coplanar and $\vec p=\dfrac{\vec b\times\vec c}{[\vec a\ \vec b\ \vec c]}$, $\vec q=\dfrac{\vec c\times\vec a}{[\vec a\ \vec b\ \vec c]}$, $\vec r=\dfrac{\vec a\times\vec b}{[\vec a\ \vec b\ \vec c]}$, then $(\vec a+\vec b+\vec c)\cdot(\vec p+\vec q+\vec r)$ equals`, 3,
    R`<p>$\vec a\cdot\vec p=1$, $\vec b\cdot\vec q=1$, $\vec c\cdot\vec r=1$, and every other product (such as $\vec a\cdot\vec q$) has a repeated vector in the triple product, so equals 0. The total is $3$.</p>`, 'Cross terms vanish because the triple product has a repeated vector.', { calc: () => 3 }),
  A(4, 'vector triple product', R`For any vectors $\vec a,\vec b,\vec c$: $[\vec a\times\vec b\ \ \vec b\times\vec c\ \ \vec c\times\vec a]=[\vec a\ \vec b\ \vec c]^2$.`, R`$(\vec a\times\vec b)\times(\vec a\times\vec c)=[\vec a\ \vec b\ \vec c]\,\vec a$.`, 1,
    R`<p>Both are true. Using $(\vec u)\times(\vec a\times\vec c)=\vec a(\vec u\cdot\vec c)-\vec c(\vec u\cdot\vec a)$ with $\vec u=\vec a\times\vec b$ gives the second identity, but the proof of the first one is a separate Gram-determinant calculation, so R does not explain A.</p>`, 'Both identities are standard but unrelated in proof.'),
  A(3, 'coplanar vectors', R`The vectors $\hat i+\hat j$, $\hat j+\hat k$ and $\hat i+2\hat j+\hat k$ are coplanar.`, R`The third vector equals the sum of the first two.`, 0,
    R`<p>True: $(\hat i+\hat j)+(\hat j+\hat k)=\hat i+2\hat j+\hat k$. A vector that is a combination of the other two lies in their plane.</p>`, 'One vector a combination of the others means coplanar.'),
  A(3, 'section formula', R`The midpoint of the segment joining $A$ and $B$ has position vector $\dfrac{\vec a+\vec b}2$.`, R`The internal section formula with ratio $m:n$ gives $\dfrac{m\vec b+n\vec a}{m+n}$.`, 0,
    R`<p>Put $m=n$ in the section formula to get $\dfrac{\vec a+\vec b}2$, so R explains A.</p>`, 'The midpoint is the $1:1$ division.'),
  A(4, 'linear independence', R`Four points $A,B,C,D$ with position vectors $\vec a,\vec b,\vec c,\vec d$ are coplanar if $[\vec b-\vec a\ \ \vec c-\vec a\ \ \vec d-\vec a]=0$.`, R`The triple product of three vectors is zero exactly when the vectors are linearly dependent.`, 0,
    R`<p>Both are true. $\overrightarrow{AB},\overrightarrow{AC},\overrightarrow{AD}$ dependent means they lie in a plane through $A$, so the four points are coplanar.</p>`, 'The vectors must be edges from the same point.'),
  S(4, 'section formula', R`The point dividing $A(\vec a)$ and $B(\vec b)$ externally in the ratio $m:n$ ($m\ne n$) is $\dfrac{m\vec b-n\vec a}{m-n}$.`, R`If $m=n$ the external division is a finite point.`, 1,
    R`<p>I is true. II is false: when $m=n$ the denominator is 0 and the point is at infinity (the external point does not exist).</p>`, 'The midpoint is internal only.'),
  S(3, 'geometry', R`The medians of a triangle meet at the centroid with position vector $\dfrac{\vec a+\vec b+\vec c}3$.`, R`The centroid divides each median in the ratio $2:1$ from the vertex.`, 0,
    R`<p>Both are true: $\dfrac{\vec a+2\cdot\frac{\vec b+\vec c}{2}}{3}=\dfrac{\vec a+\vec b+\vec c}{3}$.</p>`, 'The $2:1$ split starts at the vertex.'),
  SC(4, 'geometry', [
    R`The diagonals of a parallelogram bisect each other.`,
    R`The angle in a semicircle is a right angle (proved by $(\vec a+\vec b)\cdot(\vec a-\vec b)=0$ when $|\vec a|=|\vec b|$).`,
    R`The diagonals of a rhombus are perpendicular.`,
    R`The diagonals of a rectangle are perpendicular.`], '3', ['2', '4', '1'],
    R`<p>(1) true. (2) true. (3) true: $(\vec a+\vec b)\cdot(\vec a-\vec b)=|\vec a|^2-|\vec b|^2=0$ for equal sides. (4) false: they are equal, not perpendicular, unless it is a square. So 3 are correct.</p>`, 'Equal diagonals versus perpendicular diagonals.'),
  XT(4, 'geometry', R`Triangle $OAB$ has $\vec{OA}=\vec a$ and $\vec{OB}=\vec b$, with $|\vec a|=3$, $|\vec b|=4$ and $\vec a\cdot\vec b=6$. Which statements are correct?`,
    [[R`$|\vec a-\vec b|^2=13$`, 9 + 16 - 12 === 13], [R`The area of the triangle is $\dfrac12\sqrt{108}$`, Math.abs(0.5 * Math.sqrt(144 - 36) - 0.5 * Math.sqrt(108)) < 1e-9], [R`$\cos\angle AOB=\dfrac12$`, 6 / 12 === 0.5], [R`The triangle is right-angled at $O$`, false]],
    R`<p>$|\vec a-\vec b|^2=9+16-12=13$. $\cos\theta=\dfrac6{12}=\dfrac12$, so $\theta=60^\circ$ and $\sin\theta=\dfrac{\sqrt3}2$. Area $=\dfrac12\cdot3\cdot4\cdot\dfrac{\sqrt3}2=3\sqrt3=\dfrac12\sqrt{108}$. The angle at $O$ is $60^\circ$, not $90^\circ$.</p>`, 'Compute $\\cos\\theta$ before $\\sin\\theta$.'),
  XT(4, 'section formula', R`$P$ divides $A(1,2,3)$ and $B(4,5,6)$ in the ratio $1:2$. Which statements are correct?`,
    [[R`If the division is internal, $P=(2,3,4)$`, true], [R`If the division is external, $P=(-2,-1,0)$`, true], [R`$P$ lies on the line $\vec r=\vec a+t(\vec b-\vec a)$ in both cases`, true], [R`In the internal case $AP=\dfrac23AB$`, false]],
    R`<p>Internal: $\dfrac{1\cdot B+2\cdot A}3=\dfrac{(4,5,6)+(2,4,6)}3=(2,3,4)$. External: $\dfrac{1\cdot B-2\cdot A}{1-2}=\dfrac{(4,5,6)-(2,4,6)}{-1}=(-2,-1,0)$. Both are on the line $AB$. In the internal case $AP:PB=1:2$, so $AP=\dfrac13AB$.</p>`, 'A ratio of $1:2$ puts $P$ one-third of the way along.'),
];

const itemsD = [
  // ================= match =================
  MT(2, 'products of vectors', 'vm1', R`Match the quantities in List I with their values in List II.`, 'A-q, B-r, C-p, D-s', ['A-p, B-r, C-q, D-s', 'A-q, B-s, C-p, D-r', 'A-r, B-q, C-p, D-s'],
    R`<p>$\vec a\cdot\vec b=0+1+0=1$ (q). $\vec a\times\vec b=(1,-1,1)$, so $|\vec a\times\vec b|^2=3$ (r). $\vec b\times\vec b=\vec0$, so the triple product is $0$ (p). $|\vec a|^2|\vec b|^2=2\cdot2=4$ (s).</p>`, 'Check with Lagrange: $4-1=3$.'),
  MT(2, 'geometric meaning', 'vm2', R`Match the expressions in List I with the meanings in List II.`, 'A-r, B-s, C-p, D-q', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-p, B-s, C-r, D-q'],
    R`<p>$|\vec a\times\vec b|$ is a parallelogram area (r); $|[\vec a\ \vec b\ \vec c]|$ is a parallelepiped volume (s); $\dfrac{\vec a\cdot\vec b}{|\vec b|}$ is the scalar projection of $\vec a$ on $\vec b$ (p); a zero triple product means coplanar (q).</p>`, 'Area from two vectors, volume from three.'),
  MT(3, 'triple product', 'vm3', R`Match the quantities in List I with the values in List II.`, 'A-q, B-p, C-s, D-r', ['A-p, B-q, C-s, D-r', 'A-q, B-p, C-r, D-s', 'A-q, B-s, C-p, D-r'],
    R`<p>A: a cyclic change keeps the value, 2 (q). B: swapping two vectors changes the sign, $-2$ (p). C: the three difference vectors add to zero, so they are coplanar and the triple product is 0 (s). D: $2[\vec a\ \vec b\ \vec c]=4$ (r).</p>`, 'Cyclic shift: same. Swap: minus.'),
  MT(2, 'conditions on vectors', 'vm4', R`Match the conditions in List I with the conclusions in List II.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-q, B-r, C-p, D-s'],
    R`<p>Dot product 0: perpendicular (q). Cross product 0: parallel (p). $|\vec a+\vec b|=|\vec a|+|\vec b|$: same direction (r). $|\vec a-\vec b|=|\vec a|+|\vec b|$: opposite directions (s).</p>`, 'The triangle inequality has equality only for collinear vectors.'),

  // ================= passages =================
  PI(3, 'triangle in space', 'vp1', R`The angle at $A$ (in degrees) is`, 90,
    R`<p>$\overrightarrow{AB}=(2,2,1)$ and $\overrightarrow{AC}=(2,-1,-2)$. $\overrightarrow{AB}\cdot\overrightarrow{AC}=4-2-2=0$, so the angle at $A$ is $90^\circ$.</p>`, 'Dot zero means a right angle.', { calc: () => Math.round(deg(Math.acos(dot([2, 2, 1], [2, -1, -2]) / (3 * 3)))) }),
  PN(3, 'triangle in space', 'vp1', R`The area of the triangle is`, 4.5, 0.001,
    R`<p>$\overrightarrow{AB}\times\overrightarrow{AC}=(2,2,1)\times(2,-1,-2)=(-3,6,-6)$, magnitude 9. Area $=\dfrac92=4.5$. (Right angle at $A$: $\frac12\cdot3\cdot3$.)</p>`, 'Half the cross product magnitude.', { calc: () => nrm(cross([2, 2, 1], [2, -1, -2])) / 2 }),
  PI(3, 'triangle in space', 'vp1', R`The value of $BC^2$ is`, 18,
    R`<p>$\overrightarrow{BC}=(0,-3,-3)$, so $BC^2=0+9+9=18$. Check with Pythagoras: $9+9=18$.</p>`, 'Square the components of $\\overrightarrow{BC}$.', { calc: () => n2(sub([3, 0, -1], [3, 3, 2])) }),
  PI(3, 'parallelepiped', 'vp2', R`The volume of the parallelepiped is`, 13,
    R`<p>$[\vec a\ \vec b\ \vec c]=\begin{vmatrix}1&2&0\\0&1&3\\2&0&1\end{vmatrix}=1(1-0)-2(0-6)+0=13$.</p>`, 'Mind the minus sign in front of the middle term.', { calc: () => trip([1, 2, 0], [0, 1, 3], [2, 0, 1]) }),
  PN(3, 'parallelepiped', 'vp2', R`The volume of the tetrahedron formed by the same three edges is (3 decimal places)`, r3(13 / 6), 0.001,
    R`<p>$V=\dfrac16\cdot13=\dfrac{13}6\approx2.167$.</p>`, 'A tetrahedron is one-sixth of the parallelepiped.', { calc: () => r3(13 / 6) }),
  PN(4, 'parallelepiped', 'vp2', R`The height of the parallelepiped over the face spanned by $\vec a$ and $\vec b$ is (3 decimal places)`, r3(13 / Math.sqrt(46)), 0.001,
    R`<p>$\vec a\times\vec b=(6,-3,1)$ with magnitude $\sqrt{46}$. Height $=\dfrac{13}{\sqrt{46}}\approx1.917$.</p>`, 'Height = volume / base area.', { calc: () => r3(13 / Math.sqrt(46)) }),
  PI(4, 'vector equations', 'vp3', R`The length of $\vec r_0=\dfrac{\vec a\times\vec b}{|\vec a|^2}$ is`, 1,
    R`<p>$|\vec a\times\vec b|=|\vec a||\vec b|$ since $\vec a\perp\vec b$, so $|\vec r_0|=\dfrac{|\vec b|}{|\vec a|}=\dfrac33=1$.</p>`, 'The vectors are perpendicular, so $\\sin\\theta=1$.', { calc: () => nrm(cross([2, 2, 1], [2, -1, -2])) / 9 }),
  PI(4, 'vector equations', 'vp3', R`The sum of the components of $3\vec r_0$ is`, -1,
    R`<p>$\vec a\times\vec b=(2,2,1)\times(2,-1,-2)=(-3,6,-6)$. $3\vec r_0=\dfrac{(-3,6,-6)}3=(-1,2,-2)$. The sum is $-1$.</p>`, 'Divide by $|\\vec a|^2=9$, then multiply by 3.', { calc: () => (-3 + 6 - 6) / 3 }),
  PI(4, 'vector equations', 'vp3', R`If also $\vec r\cdot\vec a=6$, then $\vec r=\vec r_0+\lambda\vec a$ with $3\lambda$ equal to`, 2,
    R`<p>$\vec r_0\cdot\vec a=0$ (it is perpendicular to $\vec a$), so $\vec r\cdot\vec a=\lambda|\vec a|^2=9\lambda=6$. $\lambda=\dfrac23$ and $3\lambda=2$.</p>`, '$\\vec r_0\\perp\\vec a$.', { calc: () => (3 * 6) / 9 }),
  PM(4, 'cevian', 'vp4', R`The position vector of $D$ is`, R`$\dfrac{3\vec b+2\vec c}5$`, [R`$\dfrac{2\vec b+3\vec c}5$`, R`$\dfrac{\vec b+\vec c}2$`, R`$\dfrac{3\vec b-2\vec c}{1}$`],
    R`<p>$BD:DC=2:3$, so $D=\dfrac{3\vec b+2\vec c}{2+3}$: the nearer point $B$ gets the larger weight 3.</p>`, 'The weight of $B$ is the length $DC$.'),
  PM(4, 'cevian', 'vp4', R`The position vector of $E$ is`, R`$\dfrac{\vec a+2\vec c}3$`, [R`$\dfrac{2\vec a+\vec c}3$`, R`$\dfrac{\vec a+\vec c}2$`, R`$\dfrac{\vec a+2\vec c}{2}$`],
    R`<p>$CE:EA=1:2$, so $E=\dfrac{2\vec c+1\cdot\vec a}3$: $E$ is nearer $C$, so $\vec c$ gets weight 2.</p>`, 'The larger weight goes to the nearer end.'),
  PM(5, 'cevian', 'vp4', R`The ratio $AP:AD$ equals`, R`$5:6$`, [R`$1:6$`, R`$2:5$`, R`$3:4$`],
    R`<p>Write $P=(1-s)\vec a+s\vec d$ and $P=(1-t)\vec b+t\vec e$ and compare coefficients of $\vec a,\vec b,\vec c$. This gives $s=\dfrac56$, $t=\dfrac12$. So $AP=\dfrac56AD$, i.e. $AP:AD=5:6$ and $AP:PD=5:1$.</p>`, '$AP:PD=5:1$ but $AP:AD=5:6$.'),

  // ================= extra warm-up items =================
  VM(1, 'position vectors', R`The position vector of the point $P(3,-1,2)$ is`, [3, -1, 2], [[-3, 1, -2], [3, 1, 2], [2, -1, 3]],
    R`<p>The position vector of $(x,y,z)$ is $x\hat i+y\hat j+z\hat k$.</p>`, 'Keep the order $x,y,z$ and the signs.'),
  I(1, 'magnitude', R`Find $|3\hat j+4\hat k|$.`, 5,
    R`<p>$\sqrt{0+9+16}=5$.</p>`, 'A missing component counts as 0.', { calc: () => nrm([0, 3, 4]) }),
  M(1, 'dot product', R`$\hat i\cdot\hat i$ equals`, '$1$', ['$0$', '$\\hat k$', '$\\hat i$'],
    R`<p>$\hat i\cdot\hat i=|\hat i|^2=1$.</p>`, 'The dot product is a number.'),
  M(1, 'cross product', R`$\hat j\times\hat k$ equals`, '$\\hat i$', ['$-\\hat i$', '$\\hat k$', '$0$'],
    R`<p>The cyclic order $\hat i\to\hat j\to\hat k\to\hat i$ gives $\hat j\times\hat k=\hat i$.</p>`, 'In the cyclic order the sign is plus.'),
  VM(1, 'vector algebra', R`If $\vec a=2\hat i+3\hat j$, then $-\vec a$ is`, [-2, -3, 0], [[2, -3, 0], [-2, 3, 0], [3, 2, 0]],
    R`<p>Change the sign of every component: $-2\hat i-3\hat j$.</p>`, 'All components change sign.'),
  I(1, 'dot product', R`Find $\hat i\cdot(2\hat i+3\hat j+4\hat k)$.`, 2,
    R`<p>$\hat i\cdot\hat i=1$, $\hat i\cdot\hat j=0$, $\hat i\cdot\hat k=0$. So the value is $2$.</p>`, 'Only the $\\hat i$ term survives.', { calc: () => dot([1, 0, 0], [2, 3, 4]) }),
  M(1, 'scalar triple product', R`The value of $[\hat i\ \hat j\ \hat k]$ is`, '$1$', ['$0$', '$-1$', '$\\hat i$'],
    R`<p>$\hat i\cdot(\hat j\times\hat k)=\hat i\cdot\hat i=1$.</p>`, 'Right-handed unit vectors give $+1$.'),
  I(1, 'vector algebra', R`If $\vec a=\hat i+2\hat j+3\hat k$ and $\vec b=\hat j+\hat k$, the sum of the components of $2\vec a-\vec b$ is`, 10,
    R`<p>$2\vec a-\vec b=(2,4,6)-(0,1,1)=(2,3,5)$. The sum is 10.</p>`, 'Double every component of $\\vec a$ first.', { calc: () => 2 * 6 - 2 }),

  // ================= extra standard items =================
  I(2, 'cross product', R`$|\vec a|=2$, $|\vec b|=5$ and $\vec a\cdot\vec b=6$. Find $|\vec a\times\vec b|$.`, 8,
    R`<p>$|\vec a\times\vec b|^2=|\vec a|^2|\vec b|^2-(\vec a\cdot\vec b)^2=100-36=64$, so the magnitude is 8.</p>`, 'Use Lagrange\'s identity.', { calc: () => Math.sqrt(100 - 36) }),
  I(2, 'section formula', R`$M(3,-1,4)$ is the midpoint of $AB$ and $A$ is $(1,2,3)$. The sum of the coordinates of $B$ is`, 5 - 4 + 5,
    R`<p>$\vec b=2\vec m-\vec a=(6,-2,8)-(1,2,3)=(5,-4,5)$. The sum is $5-4+5=6$.</p>`, 'Double the midpoint, then subtract $A$.', { calc: () => 6 }),
];

const itemsE = [
  M(2, 'unit vector', R`For $\vec a=\hat i+\hat j$ and $\vec b=\hat i+\hat j+\hat k$, the unit vector along $\vec a+\vec b$ is`, R`$\dfrac13(2\hat i+2\hat j+\hat k)$`, [R`$\dfrac12(2\hat i+2\hat j+\hat k)$`, R`$\dfrac19(2\hat i+2\hat j+\hat k)$`, R`$\dfrac13(\hat i+\hat j+\hat k)$`],
    R`<p>$\vec a+\vec b=(2,2,1)$ with magnitude $\sqrt{4+4+1}=3$. The unit vector is $\dfrac13(2,2,1)$.</p>`, 'Add first, then divide by the magnitude of the sum.'),
  I(2, 'perpendicular vectors', R`$\vec a=\lambda\hat i+2\hat j+\hat k$ and $\vec b=\hat i+\lambda\hat j-3\hat k$ are perpendicular. Find $\lambda$.`, 1,
    R`<p>$\vec a\cdot\vec b=\lambda+2\lambda-3=3\lambda-3=0$, so $\lambda=1$.</p>`, 'Collect the two $\\lambda$ terms: $\\lambda\\cdot1+2\\cdot\\lambda$.', { calc: () => 3 / 3 }),
  M(2, 'angle between vectors', R`The cosine of the angle between $\hat i+\hat j+\hat k$ and $\hat i+\hat j-\hat k$ is`, R`$\dfrac13$`, [R`$\dfrac12$`, R`$\dfrac{1}{\sqrt3}$`, R`$\dfrac23$`],
    R`<p>Dot product $=1+1-1=1$. Each vector has magnitude $\sqrt3$, so $\cos\theta=\dfrac1{\sqrt3\cdot\sqrt3}=\dfrac13$.</p>`, 'The two magnitudes multiply to 3, not $\\sqrt3$.'),
  I(2, 'magnitude', R`Find the positive value of $x$ for which $|x\hat i+3\hat j+6\hat k|=7$.`, 2,
    R`<p>$x^2+9+36=49$, so $x^2=4$ and $x=2$.</p>`, 'Take the positive root.', { calc: () => Math.sqrt(49 - 45) }),
  N(2, 'projection', R`Find the scalar projection of $\vec a=2\hat i+\hat j+5\hat k$ on $\vec b=3\hat j+4\hat k$.` + D3, r3((3 + 20) / 5), 0.001,
    R`<p>$\vec a\cdot\vec b=0+3+20=23$ and $|\vec b|=5$. Projection $=\dfrac{23}5=4.6$.</p>`, 'The $\\hat i$ component of $\\vec a$ does not contribute.', { calc: () => 4.6 }),
  M(2, 'area', R`The area of the parallelogram with sides $\hat i+\hat j$ and $\hat j+\hat k$ is`, R`$\sqrt3$`, [R`$\sqrt2$`, R`$3$`, R`$1$`],
    R`<p>$(1,1,0)\times(0,1,1)=(1,-1,1)$ with magnitude $\sqrt3$.</p>`, 'Do not use $|\\vec a||\\vec b|=2$.'),
  I(2, 'cross product', R`If $\vec a=2\hat i-\hat j+3\hat k$ and $\vec b=\hat i+4\hat j-2\hat k$, the $\hat k$-component of $\vec a\times\vec b$ is`, cross([2, -1, 3], [1, 4, -2])[2],
    R`<p>$\hat k$-component $=a_xb_y-a_yb_x=2\cdot4-(-1)\cdot1=9$.</p>`, 'Pattern: $a_xb_y-a_yb_x$.', { calc: () => 2 * 4 - -1 * 1 }),
  I(2, 'cross product', R`Find $|\vec a\times\vec b|^2$ for $\vec a=\hat i+2\hat j$ and $\vec b=2\hat i+\hat k$.`, n2(cross([1, 2, 0], [2, 0, 1])),
    R`<p>$\vec a\times\vec b=(2\cdot1-0,\ 0-1\cdot1,\ 0-2\cdot2)=(2,-1,-4)$. Squared magnitude $=4+1+16=21$.</p>`, 'Check: $5\\cdot5-2^2=21$.', { calc: () => 5 * 5 - 4 }),
  VM(2, 'vector algebra', R`If $\vec a=\hat i+2\hat j+3\hat k$ and $\vec b=2\hat i-\hat k$, then $2\vec a-3\vec b$ is`, sub(sc(2, [1, 2, 3]), sc(3, [2, 0, -1])), [add(sc(2, [1, 2, 3]), sc(3, [2, 0, -1])), sub(sc(3, [1, 2, 3]), sc(2, [2, 0, -1])), [-4, 2, 6]],
    R`<p>$2\vec a=(2,4,6)$ and $3\vec b=(6,0,-3)$. Subtract: $(-4,4,9)$.</p>`, 'Subtracting $-3$ gives $+3$.'),
  M(2, 'parallel vectors', R`Which pair of vectors is parallel?`, R`$2\hat i-4\hat j+6\hat k$ and $-\hat i+2\hat j-3\hat k$`, [R`$\hat i+\hat j$ and $\hat j+\hat k$`, R`$\hat i+2\hat j+3\hat k$ and $3\hat i+2\hat j+\hat k$`, R`$\hat i-\hat j$ and $\hat i+\hat j$`],
    R`<p>$2\hat i-4\hat j+6\hat k=-2(-\hat i+2\hat j-3\hat k)$: one is a scalar multiple of the other. The others have different ratios of components.</p>`, 'A negative multiple is still parallel.'),
  I(2, 'area', R`Find the area of the triangle with vertices $O(0,0,0)$, $A(3,0,0)$ and $B(0,4,0)$.`, 6,
    R`<p>$\dfrac12|(3,0,0)\times(0,4,0)|=\dfrac12|(0,0,12)|=6$.</p>`, 'Half of the parallelogram.', { calc: () => nrm(cross([3, 0, 0], [0, 4, 0])) / 2 }),
  M(2, 'scalar triple product', R`The scalar triple product $[\vec a\ \vec a\ \vec b]$ equals`, '$0$', [R`$|\vec a|^2|\vec b|$`, R`$\vec a\cdot\vec b$`, '$1$'],
    R`<p>Two equal vectors make a flat figure, so the volume is 0. Algebraically $\vec a\cdot(\vec a\times\vec b)=0$ since $\vec a\times\vec b\perp\vec a$.</p>`, 'A repeated vector kills the triple product.'),
  I(2, 'work done', R`A force $\vec F=3\hat i-2\hat j+4\hat k$ N acts on a particle displaced by $\vec d=\hat i+2\hat j-\hat k$ m. The work done in joules is`, dot([3, -2, 4], [1, 2, -1]),
    R`<p>$W=\vec F\cdot\vec d=3-4-4=-5$ J. The negative sign means the force opposes the motion overall.</p>`, 'Work can be negative.', { calc: () => 3 - 4 - 4 }),
  I(3, 'dot product', R`$\vec a$ and $\vec b$ are unit vectors with angle $60^\circ$ between them. Then $|2\vec a+3\vec b|^2$ equals`, 19,
    R`<p>$4+9+2\cdot2\cdot3\cos60^\circ=13+6=19$.</p>`, 'The cross term is $2\\cdot(2\\cdot3)\\cdot\\frac12=6$.', { calc: () => 4 + 9 + 12 * 0.5 }),
  I(3, 'minimum distance', R`For $\vec a=\hat i+2\hat j+3\hat k$ and $\vec b=\hat i+\hat j+\hat k$, the value of $t$ that minimises $|\vec a+t\vec b|$ is`, -2,
    R`<p>$|\vec a+t\vec b|^2=14+2t\cdot6+3t^2$. The minimum is at $t=-\dfrac{6}{3}=-2$. Here $\vec a\cdot\vec b=6$ and $|\vec b|^2=3$.</p>`, 'Use $t=-\\dfrac{\\vec a\\cdot\\vec b}{|\\vec b|^2}$.', { calc: () => -6 / 3 }),

  // ================= harder items =================
  I(4, 'dot product', R`Vectors $\vec a,\vec b,\vec c$ satisfy $\vec a+\vec b+\vec c=\vec 0$ with $|\vec a|=3$, $|\vec b|=5$ and $|\vec c|=7$. The angle between $\vec a$ and $\vec b$, in degrees, is`, 60,
    R`<p>$\vec a+\vec b=-\vec c$, so $|\vec a+\vec b|^2=49=9+25+2\cdot15\cos\theta$. Then $\cos\theta=\dfrac{15}{30}=\dfrac12$ and $\theta=60^\circ$.</p>`, 'The angle between the vectors, not the interior angle of the triangle (which would be $120^\\circ$).', { calc: () => Math.round(deg(Math.acos((49 - 9 - 25) / 30))) }),
  N(5, 'skew lines', R`Line 1 passes through $(0,0,0)$ with direction $\hat i$. Line 2 passes through $(1,2,3)$ with direction $\hat j+\hat k$. Find the shortest distance between the lines.` + D3, r3(1 / Math.sqrt(2)), 0.001,
    R`<p>$\vec n=\hat i\times(\hat j+\hat k)=\hat k-\hat j$, $|\vec n|=\sqrt2$. $\overrightarrow{PQ}=(1,2,3)$ and $\overrightarrow{PQ}\cdot\vec n=-2+3=1$. Distance $=\dfrac{|\overrightarrow{PQ}\cdot\vec n|}{|\vec n|}=\dfrac1{\sqrt2}\approx0.707$.</p>`, 'Project the connecting vector on the common perpendicular.', { calc: () => r3(1 / Math.sqrt(2)) }),
  N(4, 'area', R`$OA$, $OB$, $OC$ are mutually perpendicular edges of a tetrahedron with lengths 1, 2 and 3. Find the area of triangle $ABC$.`, 3.5, 0.001,
    R`<p>Take $O$ as origin: $A(1,0,0)$, $B(0,2,0)$, $C(0,0,3)$. $\overrightarrow{AB}\times\overrightarrow{AC}=(6,3,2)$ with magnitude $7$. Area $=\dfrac72=3.5$. (General formula: $\dfrac12\sqrt{a^2b^2+b^2c^2+c^2a^2}$.)</p>`, 'The slanted face is bigger than each of the three right-angled faces.', { calc: () => 0.5 * Math.sqrt(4 + 36 + 9) }),
  N(5, 'volume', R`Three vectors each of length 2 have an angle of $60^\circ$ between every pair. Find the volume of the parallelepiped they span.` + D3, r3(8 * Math.sqrt(0.5)), 0.001,
    R`<p>$[\vec a\ \vec b\ \vec c]^2=$ Gram determinant $=\begin{vmatrix}4&2&2\\2&4&2\\2&2&4\end{vmatrix}=4(16-4)-2(8-4)+2(4-8)=48-8-8=32$. Volume $=\sqrt{32}=4\sqrt2\approx5.657$.</p>`, 'Dot products are $2\\cdot2\\cdot\\frac12=2$, not $\\frac12$.', { calc: () => r3(Math.sqrt(32)) }),
  I(5, 'linear independence', R`The vectors $(x,1,1)$, $(1,x,1)$ and $(1,1,x)$ are linearly dependent for exactly two values of $x$. Their sum is`, -1,
    R`<p>The determinant is $\begin{vmatrix}x&1&1\\1&x&1\\1&1&x\end{vmatrix}=x^3-3x+2=(x-1)^2(x+2)$. It vanishes for $x=1$ and $x=-2$. The sum is $-1$.</p>`, 'The root $x=1$ is double but counts once.', { calc: () => 1 + -2 }),
  I(4, 'geometry', R`A triangle has its circumcentre at the origin and vertices at position vectors $\vec a=(3,4,0)$, $\vec b=(-4,3,0)$ and $\vec c=(5,0,0)$. Its orthocentre is $H=\vec a+\vec b+\vec c$. Find $|\vec H|^2$.`, 65,
    R`<p>$\vec H=(3-4+5,\ 4+3+0,\ 0)=(4,7,0)$. $|\vec H|^2=16+49=65$. Check: $(\vec H-\vec a)\cdot(\vec b-\vec c)=(1,3,0)\cdot(-9,3,0)=-9+9=0$.</p>`, 'With the circumcentre at the origin, the orthocentre is the sum of the position vectors.', { calc: () => 4 * 4 + 7 * 7 }),
  I(5, 'cross product', R`Vectors satisfy $\vec a\times\vec b=\vec c$ and $\vec b\times\vec c=\vec a$, with $|\vec a|=3$. Then $|\vec a|^2+|\vec b|^2+|\vec c|^2$ equals`, 19,
    R`<p>$\vec c=\vec a\times\vec b$ is perpendicular to $\vec b$, and $\vec a=\vec b\times\vec c$ is perpendicular to $\vec b$ and $\vec c$. So $\vec a\perp\vec b$ and $\vec b\perp\vec c$. Then $|\vec c|=|\vec a||\vec b|$ and $|\vec a|=|\vec b||\vec c|$. Substituting: $|\vec a|=|\vec b|^2|\vec a|$, so $|\vec b|=1$ and $|\vec c|=|\vec a|=3$. Sum $=9+1+9=19$.</p>`, 'Perpendicularity follows from the two equations; then use magnitudes.', { calc: () => 9 + 1 + 9 }),
  XT(4, 'dot product', R`$\vec a$ and $\vec b$ are unit vectors with $\vec a\cdot\vec b=\dfrac12$. Which statements are correct?`,
    [[R`The angle between them is $60^\circ$`, true], [R`$|\vec a+\vec b|=\sqrt3$`, true], [R`$|\vec a-\vec b|=1$`, true], [R`$|\vec a\times\vec b|=\dfrac12$`, false]],
    R`<p>$\cos\theta=\dfrac12$ gives $60^\circ$. $|\vec a+\vec b|^2=1+1+1=3$. $|\vec a-\vec b|^2=1+1-1=1$. $|\vec a\times\vec b|=\sin60^\circ=\dfrac{\sqrt3}2$, not $\dfrac12$.</p>`, 'The sine of $60^\\circ$ is $\\frac{\\sqrt3}2$.'),
  XT(4, 'coplanar points', R`The points $A(1,0,0)$, $B(0,1,0)$, $C(0,0,1)$ and $D(1,1,-1)$ are given. Which statements are correct?`,
    [[R`The four points are coplanar`, trip(sub([0, 1, 0], [1, 0, 0]), sub([0, 0, 1], [1, 0, 0]), sub([1, 1, -1], [1, 0, 0])) === 0], [R`$[\overrightarrow{AB}\ \overrightarrow{AC}\ \overrightarrow{AD}]=-2$`, trip(sub([0, 1, 0], [1, 0, 0]), sub([0, 0, 1], [1, 0, 0]), sub([1, 1, -1], [1, 0, 0])) === -2], [R`$D$ lies on the plane $x+y+z=1$`, 1 + 1 - 1 === 1], [R`The volume of the tetrahedron $ABCD$ is $\dfrac13$`, Math.abs(trip(sub([0, 1, 0], [1, 0, 0]), sub([0, 0, 1], [1, 0, 0]), sub([1, 1, -1], [1, 0, 0]))) / 6 === 1 / 3]],
    R`<p>$\overrightarrow{AB}=(-1,1,0)$, $\overrightarrow{AC}=(-1,0,1)$, $\overrightarrow{AD}=(0,1,-1)$. The determinant is $-1(0\cdot(-1)-1\cdot1)-1(1-0)+0=-1(-1)-1=0$. So the four points are coplanar: indeed $D$ satisfies $x+y+z=1$. The determinant is $0$, so the second and fourth statements are false.</p>`, 'A point is on the plane $x+y+z=1$ exactly when its coordinates add up to 1.'),
];

// ================= templates =================
const gen = (id, level, type, format, sub, make, verify) => ({ id, type, format, level, exams: GEXS(level, type), sub, make, ...(verify ? { verify } : {}) });
const rv = (rng, lo = -4, hi = 5) => { let v; do { v = [int(rng, lo, hi), int(rng, lo, hi), int(rng, lo, hi)]; } while (n2(v) === 0); return v; };
const shufflePerm = (rng, v) => { const a = [...v]; for (let i = 2; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const signed = (rng, v) => v.map((x) => (rng() < 0.5 ? -x : x));
const trv = (rng) => signed(rng, shufflePerm(rng, choose(rng, PUZ)));
const nint = (v) => Math.round(nrm(v));
const AX = ['$x$', '$y$', '$z$'];
const compName = ['\\hat i', '\\hat j', '\\hat k'];
const det3 = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
/** TeX for a vector whose component at position `idx` is the unknown \lambda */
const vl = (v, idx) => {
  let s = '';
  v.forEach((c, j) => {
    if (j === idx) { s += `${s ? '+' : ''}\\lambda${compName[j]}`; return; }
    if (c === 0) return;
    const mag = Math.abs(c) === 1 ? '' : String(Math.abs(c));
    s += (c < 0 ? '-' : s ? '+' : '') + mag + compName[j];
  });
  return s;
};
const numMcq = (rng, correct, cands) => {
  const seen = new Set([String(correct)]); const w = [];
  for (const c of [...cands, correct + 1, correct - 1, correct + 2, correct * 2]) { const s = String(c); if (!seen.has(s) && c >= 0) { seen.add(s); w.push(`$${s}$`); } if (w.length === 3) break; }
  return shuffleOpts(rng, `$${correct}$`, w);
};

const gens = [
  // g01: magnitude (mcq)
  gen('ve-g01', 1, 'mcq', 'single', 'magnitude', (rng) => {
    const a = trv(rng), v = int(rng, 0, 3), nn = nint(a), k = int(rng, 2, 4); let ans, txt, sol, extra = {};
    if (v === 0) { ans = nn; txt = R`The magnitude of $${vt(a)}$ is`; sol = R`<p>$\sqrt{(${a[0]})^2+(${a[1]})^2+(${a[2]})^2}=\sqrt{${n2(a)}}=${nn}$.</p>`; }
    else if (v === 1) { ans = k * nn; txt = R`The magnitude of $${k}\left(${vt(a)}\right)$ is`; sol = R`<p>$|k\vec v|=|k||\vec v|$. $|\vec v|=\sqrt{${n2(a)}}=${nn}$, so the answer is $${k}\times${nn}=${k * nn}$.</p>`; }
    else if (v === 2) { const x = Math.abs(a[0]); const b = [x, a[1], a[2]]; ans = x; txt = R`If $|x\hat i${sgn(a[1])}\hat j${sgn(a[2])}\hat k|=${nn}$ and $x>0$, then $x$ equals`; sol = R`<p>$x^2+${a[1] ** 2}+${a[2] ** 2}=${nn * nn}$, so $x^2=${x * x}$ and $x=${x}$.</p>`; extra = { b }; }
    else { const s = a[0] + a[1] + a[2]; ans = Math.abs(k * s); txt = R`A vector of magnitude ${k * nn} points along $${vt(a)}$. The absolute value of the sum of its three components is`; sol = R`<p>The vector is $\dfrac{${k * nn}}{${nn}}(${a.join(', ')})=${k}(${a.join(', ')})$. Component sum $=${k * s}$, with absolute value $${ans}$.</p>`; }
    const o = numMcq(rng, ans, [n2(a) % 1000, Math.abs(a[0]) + Math.abs(a[1]) + Math.abs(a[2])]);
    return { a, v, k, nn, ...extra, ...o, q: txt, sol, trap: 'Square every component, add, then take the root.' };
  }, (p) => { const nn = Math.sqrt(p.a[0] ** 2 + p.a[1] ** 2 + p.a[2] ** 2); const ans = [nn, p.k * nn, Math.abs(p.a[0]), Math.abs(p.k * (p.a[0] + p.a[1] + p.a[2]))][p.v]; return p.options.indexOf(`$${Math.round(ans)}$`); }),

  // g02: dot products
  gen('ve-g02', 1, 'nat', 'integer', 'dot product', (rng) => {
    const a = rv(rng), b = rv(rng), c = rv(rng), v = int(rng, 0, 3); let ans, q, sol;
    if (v === 0) { ans = dot(a, b); q = R`Find $\vec a\cdot\vec b$ for $\vec a=${vt(a)}$ and $\vec b=${vt(b)}$.`; sol = R`<p>$(${a[0]})(${b[0]})+(${a[1]})(${b[1]})+(${a[2]})(${b[2]})=${ans}$.</p>`; }
    else if (v === 1) { ans = dot(a, add(b, c)); q = R`For $\vec a=${vt(a)}$, $\vec b=${vt(b)}$ and $\vec c=${vt(c)}$, find $\vec a\cdot(\vec b+\vec c)$.`; sol = R`<p>$\vec b+\vec c=${vt(add(b, c))}$, so $\vec a\cdot(\vec b+\vec c)=${a[0]}(${add(b, c)[0]})+${a[1]}(${add(b, c)[1]})+${a[2]}(${add(b, c)[2]})=${ans}$.</p>`; }
    else if (v === 2) { ans = n2(a) - n2(b); q = R`If $\vec a=${vt(a)}$ and $\vec b=${vt(b)}$, find $(\vec a+\vec b)\cdot(\vec a-\vec b)$.`; sol = R`<p>$(\vec a+\vec b)\cdot(\vec a-\vec b)=|\vec a|^2-|\vec b|^2=${n2(a)}-${n2(b)}=${ans}$.</p>`; }
    else { ans = dot(sub(sc(2, a), b), c); q = R`Find $(2\vec a-\vec b)\cdot\vec c$ for $\vec a=${vt(a)}$, $\vec b=${vt(b)}$, $\vec c=${vt(c)}$.`; sol = R`<p>$2\vec a-\vec b=${vt(sub(sc(2, a), b))}$. Dot with $\vec c$: $${ans}$.</p>`; }
    return { a, b, c, v, answer: ans, tol: 0, q, sol, trap: 'Multiply matching components and add; the result is a number.' };
  }, (p) => [dot(p.a, p.b), dot(p.a, p.b) + dot(p.a, p.c), p.a[0] ** 2 + p.a[1] ** 2 + p.a[2] ** 2 - p.b[0] ** 2 - p.b[1] ** 2 - p.b[2] ** 2, 2 * dot(p.a, p.c) - dot(p.b, p.c)][p.v]),

  // g03: perpendicular vectors, find lambda
  gen('ve-g03', 2, 'nat', 'integer', 'perpendicular vectors', (rng) => {
    const v = int(rng, 0, 2); let tries = 0;
    for (;;) {
      if (++tries > 500) return gens[2].make(rng);
      if (v === 0) {
        const idx = int(rng, 0, 2), a = rv(rng, -4, 4), b = rv(rng, -4, 4); if (b[idx] === 0) continue;
        let s = 0; for (let j = 0; j < 3; j++) if (j !== idx) s += a[j] * b[j];
        if (s % b[idx] !== 0) continue; const lam = -s / b[idx] + 0; if (Math.abs(lam) > 9 || lam === 0) continue; a[idx] = lam;
        const at = vl(a, idx);
        const sum = b.map((x, j) => (j === idx ? `${b[j]}\\lambda` : `${a[j] * b[j]}`)).join('+').replace(/\+-/g, '-');
        return { v, idx, a, b, lam, answer: lam, tol: 0, q: R`The vectors $${at}$ and $${vt(b)}$ are perpendicular. Find $\lambda$.`, sol: R`<p>Perpendicular means the dot product is 0: $${sum}=0$, so $\lambda=${lam}$.</p>`, trap: 'Only the $\\lambda$ term has an unknown; the others are numbers.' };
      }
      if (v === 1) {
        const a = rv(rng, -4, 4), b = rv(rng, -4, 4), c = rv(rng, -4, 4); const bc = dot(b, c); if (bc === 0 || dot(a, c) % bc !== 0) continue; const lam = -dot(a, c) / bc; if (Math.abs(lam) > 9) continue;
        return { v, a, b, c, lam, answer: lam, tol: 0, q: R`$\vec a=${vt(a)}$, $\vec b=${vt(b)}$ and $\vec c=${vt(c)}$. Find $\lambda$ so that $\vec a+\lambda\vec b$ is perpendicular to $\vec c$.`, sol: R`<p>$(\vec a+\lambda\vec b)\cdot\vec c=\vec a\cdot\vec c+\lambda\,\vec b\cdot\vec c=${dot(a, c)}+${bc}\lambda=0$, so $\lambda=${lam}$.</p>`, trap: 'Dot with $\\vec c$ first; then solve the linear equation.' };
      }
      const b = rv(rng, -3, 3), u = rv(rng, -3, 3), lam = int(rng, -4, 4); const w = cross(b, u); if (n2(w) === 0 || lam === 0) continue; const a = add(sc(lam, b), w); if (Math.max(...a.map(Math.abs)) > 30) continue;
      return { v, a, b, lam, answer: lam, tol: 0, q: R`$\vec a=${vt(a)}$ and $\vec b=${vt(b)}$. Find $\lambda$ so that $\vec a-\lambda\vec b$ is perpendicular to $\vec b$.`, sol: R`<p>$(\vec a-\lambda\vec b)\cdot\vec b=\vec a\cdot\vec b-\lambda|\vec b|^2=${dot(a, b)}-${n2(b)}\lambda=0$, so $\lambda=\dfrac{${dot(a, b)}}{${n2(b)}}=${lam}$.</p>`, trap: 'This is the projection coefficient $\\dfrac{\\vec a\\cdot\\vec b}{|\\vec b|^2}$.' };
    }
  }, (p) => { if (p.v === 0) { const a = [...p.a]; return dot(a, p.b) === 0 ? p.lam : NaN; } if (p.v === 1) return dot(add(p.a, sc(p.lam, p.b)), p.c) === 0 ? p.lam : NaN; return dot(sub(p.a, sc(p.lam, p.b)), p.b) === 0 ? p.lam : NaN; }),

  // g04: angle between vectors in degrees
  gen('ve-g04', 3, 'nat', 'numeric', 'angle between vectors', (rng) => {
    const a = rv(rng, -4, 5), b = rv(rng, -4, 5); const ang = deg(Math.acos(dot(a, b) / (nrm(a) * nrm(b))));
    return { a, b, answer: +ang.toFixed(1), tol: 0.06, q: R`Find the angle (in degrees) between $\vec a=${vt(a)}$ and $\vec b=${vt(b)}$.${D1}`,
      sol: R`<p>$\vec a\cdot\vec b=${dot(a, b)}$, $|\vec a|=\sqrt{${n2(a)}}$, $|\vec b|=\sqrt{${n2(b)}}$. $\cos\theta=\dfrac{${dot(a, b)}}{\sqrt{${n2(a)}\cdot${n2(b)}}}=${r3(dot(a, b) / (nrm(a) * nrm(b)))}$, so $\theta\approx${ang.toFixed(1)}^\circ$.</p>`, trap: 'The angle is obtuse when the dot product is negative.' };
  }, (p) => deg(Math.atan2(nrm(cross(p.a, p.b)), dot(p.a, p.b)))),

  // g05: projections
  gen('ve-g05', 3, 'nat', 'numeric', 'projection', (rng) => {
    const a = rv(rng, -4, 5), b = trv(rng), nb = nint(b), v = int(rng, 0, 2); const dt = dot(a, b);
    const val = [dt / nb, Math.abs(dt) / nb, Math.sqrt(n2(a) - (dt * dt) / (nb * nb))][v];
    const txt = [`the scalar projection of $\\vec a=${vt(a)}$ on $\\vec b=${vt(b)}$`, `the length of the vector projection of $\\vec a=${vt(a)}$ on $\\vec b=${vt(b)}$`, `the magnitude of the component of $\\vec a=${vt(a)}$ perpendicular to $\\vec b=${vt(b)}$`][v];
    const sol = [R`<p>$\vec a\cdot\vec b=${dt}$ and $|\vec b|=${nb}$. Scalar projection $=\dfrac{${dt}}{${nb}}=${r3(val)}$.</p>`, R`<p>$\dfrac{|\vec a\cdot\vec b|}{|\vec b|}=\dfrac{${Math.abs(dt)}}{${nb}}=${r3(val)}$.</p>`, R`<p>$|\vec a|^2=${n2(a)}$ and the parallel part has size $\dfrac{${dt}}{${nb}}$. Perpendicular part: $\sqrt{${n2(a)}-\left(\dfrac{${dt}}{${nb}}\right)^2}=${r3(val)}$.</p>`][v];
    return { a, b, v, answer: r3(val), tol: 0.001, q: R`Find ${txt}.${D3}`, sol, trap: v === 0 ? 'The scalar projection can be negative.' : 'Use Pythagoras for the perpendicular part.' };
  }, (p) => { const pr = [dot(p.a, p.b) / nrm(p.b), Math.abs(dot(p.a, p.b)) / nrm(p.b), nrm(cross(p.a, p.b)) / nrm(p.b)][p.v]; return r3(pr); }),

  // g06: cross product facts
  gen('ve-g06', 2, 'nat', 'integer', 'cross product', (rng) => {
    const a = rv(rng, -3, 4), b = rv(rng, -3, 4), c = rv(rng, -3, 4), v = int(rng, 0, 3), idx = int(rng, 0, 2); let ans, q, sol;
    const x = cross(a, b);
    if (v === 0) { ans = n2(x); q = R`Find $|\vec a\times\vec b|^2$ for $\vec a=${vt(a)}$ and $\vec b=${vt(b)}$.`; sol = R`<p>$\vec a\times\vec b=${vt(x)}$, so $|\vec a\times\vec b|^2=${ans}$.</p>`; }
    else if (v === 1) { const AB = sub(b, a), AC = sub(c, a); ans = n2(cross(AB, AC)); q = R`The vertices of a triangle are $A(${a.join(',')})$, $B(${b.join(',')})$ and $C(${c.join(',')})$. Find $4\times(\text{area})^2$.`; sol = R`<p>$\overrightarrow{AB}=${vt(AB)}$, $\overrightarrow{AC}=${vt(AC)}$. Area $=\dfrac12|\overrightarrow{AB}\times\overrightarrow{AC}|$, so $4(\text{area})^2=|\overrightarrow{AB}\times\overrightarrow{AC}|^2=${ans}$.</p>`; }
    else if (v === 2) { ans = x[idx]; q = R`Find the $${compName[idx]}$-component of $\vec a\times\vec b$ for $\vec a=${vt(a)}$ and $\vec b=${vt(b)}$.`; sol = R`<p>$\vec a\times\vec b=${vt(x)}$. The $${compName[idx]}$-component is $${ans}$.</p>`; }
    else { ans = n2(cross(a, b)); q = R`The diagonals of a parallelogram are $\vec d_1=${vt(a)}$ and $\vec d_2=${vt(b)}$. Find $4\times(\text{area})^2$.`; sol = R`<p>Area $=\dfrac12|\vec d_1\times\vec d_2|$, so $4(\text{area})^2=|\vec d_1\times\vec d_2|^2=${ans}$, with $\vec d_1\times\vec d_2=${vt(x)}$.</p>`; }
    return { a, b, c, v, idx, answer: ans, tol: 0, q, sol, trap: 'Compute the cross product with the determinant; the middle term has a minus sign.' };
  }, (p) => { const lag = n2(p.a) * n2(p.b) - dot(p.a, p.b) ** 2; const AB = sub(p.b, p.a), AC = sub(p.c, p.a); const c2 = [(AB[0] * AB[0] + AB[1] * AB[1] + AB[2] * AB[2]) * (AC[0] * AC[0] + AC[1] * AC[1] + AC[2] * AC[2]) - dot(AB, AC) ** 2, 0, [p.a[1] * p.b[2] - p.a[2] * p.b[1], p.a[2] * p.b[0] - p.a[0] * p.b[2], p.a[0] * p.b[1] - p.a[1] * p.b[0]][p.idx], lag]; return [lag, c2[0], c2[2], lag][p.v]; }),

  // g07: scalar triple product
  gen('ve-g07', 3, 'nat', 'integer', 'scalar triple product', (rng) => {
    const a = rv(rng, -3, 4), b = rv(rng, -3, 4), c = rv(rng, -3, 4), d = rv(rng, -3, 4), v = int(rng, 0, 3); let ans, q, sol;
    const D = trip(a, b, c);
    if (v === 0) { ans = D; q = R`Find $[\vec a\ \vec b\ \vec c]$ for $\vec a=${vt(a)}$, $\vec b=${vt(b)}$, $\vec c=${vt(c)}$.`; sol = R`<p>$\vec b\times\vec c=${vt(cross(b, c))}$ and $\vec a\cdot(\vec b\times\vec c)=${ans}$.</p>`; }
    else if (v === 1) { ans = Math.abs(D); q = R`Find the volume of the parallelepiped with edges $${vt(a)}$, $${vt(b)}$, $${vt(c)}$.`; sol = R`<p>Volume $=|[\vec a\ \vec b\ \vec c]|=|${D}|=${ans}$.</p>`; }
    else if (v === 2) { const E1 = sub(b, a), E2 = sub(c, a), E3 = sub(d, a); ans = Math.abs(trip(E1, E2, E3)); q = R`For the tetrahedron with vertices $A(${a.join(',')})$, $B(${b.join(',')})$, $C(${c.join(',')})$, $D(${d.join(',')})$, find $6\times$ its volume.`; sol = R`<p>$6V=|[\overrightarrow{AB}\ \overrightarrow{AC}\ \overrightarrow{AD}]|$ with $\overrightarrow{AB}=${vt(E1)}$, $\overrightarrow{AC}=${vt(E2)}$, $\overrightarrow{AD}=${vt(E3)}$. The triple product is $${trip(E1, E2, E3)}$, so $6V=${ans}$.</p>`; }
    else { ans = 2 * D; q = R`For $\vec a=${vt(a)}$, $\vec b=${vt(b)}$, $\vec c=${vt(c)}$, find $[\vec a+\vec b\ \ \vec b+\vec c\ \ \vec c+\vec a]$.`; sol = R`<p>The identity $[\vec a+\vec b\ \vec b+\vec c\ \vec c+\vec a]=2[\vec a\ \vec b\ \vec c]$ gives $2\times(${D})=${ans}$.</p>`; }
    return { a, b, c, d, v, answer: ans, tol: 0, q, sol, trap: 'Volume is the absolute value; the triple product itself can be negative.' };
  }, (p) => { const m = (x, y, z) => det3([x, y, z]); const D = m(p.a, p.b, p.c); const D2 = [0, 1, 2].reduce((s, j) => s + p.a[j] * (p.b[(j + 1) % 3] * p.c[(j + 2) % 3] - p.b[(j + 2) % 3] * p.c[(j + 1) % 3]), 0); if (D !== D2) return NaN; if (p.v === 0) return D; if (p.v === 1) return Math.abs(D); if (p.v === 2) return Math.abs(m(sub(p.b, p.a), sub(p.c, p.a), sub(p.d, p.a))); return m(add(p.a, p.b), add(p.b, p.c), add(p.c, p.a)); }),

  // g08: coplanar, find lambda
  gen('ve-g08', 3, 'nat', 'integer', 'coplanar vectors', (rng) => {
    for (let t = 0; t < 600; t++) {
      const a = rv(rng, -3, 4), b = rv(rng, -3, 4), c = rv(rng, -3, 4), r = int(rng, 0, 2), s = int(rng, 0, 2); const f = (lam) => { const m = [[...a], [...b], [...c]]; m[r][s] = lam; return det3(m); };
      const d0 = f(0), d1 = f(1), sl = d1 - d0; if (sl === 0 || d0 % sl !== 0) continue; const lam = -d0 / sl + 0; if (Math.abs(lam) > 9 || lam === 0) continue;
      const rows = [a, b, c];
      const show = rows.map((row, i) => `$${i === r ? vl(row, s) : vt(row)}$`);
      return { a, b, c, r, s, lam, answer: lam, tol: 0, q: R`The vectors ${show[0]}, ${show[1]} and ${show[2]} are coplanar. Find $\lambda$.`,
        sol: R`<p>Coplanar means $[\vec a\ \vec b\ \vec c]=0$. The determinant is linear in $\lambda$: it equals $${d0}${sgn(sl)}\lambda$ (value $${d0}$ at $\lambda=0$ and $${d1}$ at $\lambda=1$). Setting it to 0 gives $\lambda=${lam}$.</p>`, trap: 'The determinant is linear in $\\lambda$, so two evaluations are enough.' };
    }
    return gens[7].make(rng);
  }, (p) => { const m = [[...p.a], [...p.b], [...p.c]]; m[p.r][p.s] = p.lam; return det3(m) === 0 ? p.lam : NaN; }),

  // g09: collinear points
  gen('ve-g09', 3, 'nat', 'integer', 'collinear points', (rng) => {
    const A = rv(rng, -4, 4), B = rv(rng, -4, 4); const dd = sub(B, A); const t = choose(rng, [2, 3, -1, -2]); const C = add(A, sc(t, dd)); const k = int(rng, 0, 2);
    if (n2(dd) === 0 || Math.max(...C.map(Math.abs)) > 20) return gens[8].make(rng);
    const lamPos = C.map((x, j) => (j === k ? '\\lambda' : String(x)));
    return { A, B, C, t, k, answer: C[k], tol: 0, q: R`The points $A(${A.join(',')})$, $B(${B.join(',')})$ and $C(${lamPos.join(',')})$ are collinear. Find $\lambda$.`,
      sol: R`<p>$\overrightarrow{AB}=(${dd.join(',')})$. For collinear points $\overrightarrow{AC}=t\overrightarrow{AB}$ for some $t$. Use a coordinate where $\overrightarrow{AB}$ is not zero and where $C$ is known: it gives $t=${t}$. Then the ${AX[k]}-coordinate of $C$ is $${A[k]}+${t}\cdot(${dd[k]})=${C[k]}$, so $\lambda=${C[k]}$.</p>`, trap: 'Find $t$ from a known coordinate of $C$, then apply it to the unknown one.' };
  }, (p) => { const dd = sub(p.B, p.A); const AC = sub(p.C, p.A); const cr = cross(dd, AC); return cr[0] === 0 && cr[1] === 0 && cr[2] === 0 ? p.C[p.k] : NaN; }),

  // g10: section formula
  gen('ve-g10', 2, 'nat', 'integer', 'section formula', (rng) => {
    const A = rv(rng, -5, 5), d = rv(rng, -3, 3), v = int(rng, 0, 3); let idx = int(rng, 0, 2), m, n, B, P, q, sol, ans;
    if (v === 0) { do { m = int(rng, 1, 4); n = int(rng, 1, 4); } while (gcd(m, n) !== 1); B = add(A, sc(m + n, d)); P = add(A, sc(m, d)); ans = P[idx];
      q = R`$P$ divides the join of $A(${A.join(',')})$ and $B(${B.join(',')})$ internally in the ratio ${m}:${n}. Find the ${AX[idx]}-coordinate of $P$.`; sol = R`<p>$P=\dfrac{${m}B+${n}A}{${m + n}}$. The ${AX[idx]}-coordinate: $\dfrac{${m}(${B[idx]})+${n}(${A[idx]})}{${m + n}}=${ans}$.</p>`; }
    else if (v === 1) { do { m = int(rng, 2, 6); n = int(rng, 1, m - 1); } while (gcd(m, n) !== 1); B = add(A, sc(m - n, d)); P = add(A, sc(m, d)); ans = P[idx];
      q = R`$P$ divides the join of $A(${A.join(',')})$ and $B(${B.join(',')})$ externally in the ratio ${m}:${n}. Find the ${AX[idx]}-coordinate of $P$.`; sol = R`<p>$P=\dfrac{${m}B-${n}A}{${m - n}}$. The ${AX[idx]}-coordinate: $\dfrac{${m}(${B[idx]})-${n}(${A[idx]})}{${m - n}}=${ans}$.</p>`; }
    else if (v === 2) { const M = add(A, d); B = sc(1, add(A, sc(2, d))); m = 1; n = 1; P = M; ans = B[idx];
      q = R`$M(${M.join(',')})$ is the midpoint of $AB$ and $A$ is $(${A.join(',')})$. Find the ${AX[idx]}-coordinate of $B$.`; sol = R`<p>$B=2M-A$. The ${AX[idx]}-coordinate is $2(${M[idx]})-(${A[idx]})=${ans}$.</p>`; }
    else { do { m = int(rng, 1, 5); n = int(rng, 1, 5); } while (gcd(m, n) !== 1); B = add(A, sc(m + n, d)); P = add(A, sc(m, d)); const j = [0, 1, 2].find((x) => d[x] !== 0); if (j === undefined) return gens[9].make(rng); ans = m + n; idx = j;
      q = R`$P(${P.join(',')})$ lies on the join of $A(${A.join(',')})$ and $B(${B.join(',')})$ and divides it internally in the ratio $m:n$ in lowest terms. Find $m+n$.`; sol = R`<p>Using the ${AX[j]}-coordinate: $\dfrac{AP}{AB}=\dfrac{${P[j]}-(${A[j]})}{${B[j]}-(${A[j]})}=\dfrac{${m}}{${m + n}}$. So $m:n=${m}:${n}$ and $m+n=${ans}$.</p>`; }
    return { A, B, P, m, n, v, idx, answer: ans, tol: 0, q, sol, trap: v === 1 ? 'External division: subtract in both the numerator and the denominator.' : 'The nearer endpoint gets the larger weight.' };
  }, (p) => { if (p.v === 0) return Math.round((p.n * p.A[p.idx] + p.m * p.B[p.idx]) / (p.m + p.n)); if (p.v === 1) return Math.round((p.m * p.B[p.idx] - p.n * p.A[p.idx]) / (p.m - p.n)); if (p.v === 2) return 2 * p.P[p.idx] - p.A[p.idx]; const t = (p.P[p.idx] - p.A[p.idx]) / (p.B[p.idx] - p.A[p.idx]); let m = 1; while (Math.abs(m / t - Math.round(m / t)) > 1e-9) m++; return Math.round(m / t); }),

  // g11: magnitudes from angle data
  gen('ve-g11', 3, 'nat', 'integer', 'dot product', (rng) => {
    const A_ = choose(rng, [2, 4, 6, 8]), B_ = choose(rng, [2, 4, 6, 8]), th = choose(rng, [60, 90, 120]), v = int(rng, 0, 3); const cs = th === 60 ? 0.5 : th === 90 ? 0 : -0.5; const ab = A_ * B_ * cs;
    const ans = [A_ * A_ + B_ * B_ + 2 * ab, A_ * A_ + B_ * B_ - 2 * ab, (3 * A_ * A_ * B_ * B_) / 4 * (th === 90 ? 4 / 3 : 1), A_ * A_ - ab - 2 * B_ * B_][v];
    const q = [R`$|\vec a|=${A_}$, $|\vec b|=${B_}$ and the angle between them is $${th}^\circ$. Find $|\vec a+\vec b|^2$.`, R`$|\vec a|=${A_}$, $|\vec b|=${B_}$ and the angle between them is $${th}^\circ$. Find $|\vec a-\vec b|^2$.`, R`$|\vec a|=${A_}$, $|\vec b|=${B_}$ and the angle between them is $${th}^\circ$. Find $|\vec a\times\vec b|^2$.`, R`$|\vec a|=${A_}$, $|\vec b|=${B_}$ and the angle between them is $${th}^\circ$. Find $(\vec a+\vec b)\cdot(\vec a-2\vec b)$.`][v];
    const sol = [R`<p>$\vec a\cdot\vec b=${A_}\cdot${B_}\cos${th}^\circ=${ab}$. $|\vec a+\vec b|^2=${A_ * A_}+${B_ * B_}+2(${ab})=${ans}$.</p>`, R`<p>$\vec a\cdot\vec b=${ab}$. $|\vec a-\vec b|^2=${A_ * A_}+${B_ * B_}-2(${ab})=${ans}$.</p>`, R`<p>$|\vec a\times\vec b|^2=|\vec a|^2|\vec b|^2\sin^2${th}^\circ=${A_ * A_ * B_ * B_}\times${th === 90 ? 1 : '\\dfrac34'}=${ans}$.</p>`, R`<p>$(\vec a+\vec b)\cdot(\vec a-2\vec b)=|\vec a|^2-\vec a\cdot\vec b-2|\vec b|^2=${A_ * A_}-(${ab})-${2 * B_ * B_}=${ans}$.</p>`][v];
    return { A_, B_, th, v, answer: ans, tol: 0, q, sol, trap: 'Expand with $\\vec a\\cdot\\vec b=|\\vec a||\\vec b|\\cos\\theta$, not with the magnitudes alone.' };
  }, (p) => { const t = (p.th * Math.PI) / 180; const a = [p.A_, 0, 0], b = [p.B_ * Math.cos(t), p.B_ * Math.sin(t), 0]; const r = [n2(add(a, b)), n2(sub(a, b)), n2(cross(a, b)), dot(add(a, b), sub(a, sc(2, b)))][p.v]; return Math.round(r); }),

  // g12: vector triple product components
  gen('ve-g12', 3, 'nat', 'integer', 'vector triple product', (rng) => {
    const a = rv(rng, -3, 3), b = rv(rng, -3, 3), c = rv(rng, -3, 3), v = int(rng, 0, 1), idx = int(rng, 0, 2);
    const res = v === 0 ? sub(sc(dot(a, c), b), sc(dot(a, b), c)) : sub(sc(dot(a, c), b), sc(dot(b, c), a)); const ans = res[idx];
    const q = R`For $\vec a=${vt(a)}$, $\vec b=${vt(b)}$ and $\vec c=${vt(c)}$, find the $${compName[idx]}$-component of ${v === 0 ? R`$\vec a\times(\vec b\times\vec c)$` : R`$(\vec a\times\vec b)\times\vec c$`}.`;
    const sol = v === 0 ? R`<p>$\vec a\times(\vec b\times\vec c)=\vec b(\vec a\cdot\vec c)-\vec c(\vec a\cdot\vec b)$ with $\vec a\cdot\vec c=${dot(a, c)}$ and $\vec a\cdot\vec b=${dot(a, b)}$. The vector is $${vt(res)}$, so the component is $${ans}$.</p>` : R`<p>$(\vec a\times\vec b)\times\vec c=\vec b(\vec a\cdot\vec c)-\vec a(\vec b\cdot\vec c)$ with $\vec a\cdot\vec c=${dot(a, c)}$ and $\vec b\cdot\vec c=${dot(b, c)}$. The vector is $${vt(res)}$, so the component is $${ans}$.</p>`;
    return { a, b, c, v, idx, answer: ans, tol: 0, q, sol, trap: 'Middle vector times (outer dot far), minus the other vector times (outer dot middle).' };
  }, (p) => (p.v === 0 ? cross(p.a, cross(p.b, p.c)) : cross(cross(p.a, p.b), p.c))[p.idx]),

  // g13: direction cosine of a cross product
  gen('ve-g13', 3, 'nat', 'numeric', 'perpendicular to two vectors', (rng) => {
    let a, b, x; do { a = rv(rng, -3, 3); b = rv(rng, -3, 3); x = cross(a, b); } while (n2(x) === 0); const idx = int(rng, 0, 2);
    const val = x[idx] / nrm(x);
    return { a, b, idx, answer: r3(val), tol: 0.001, q: R`A unit vector $\hat n$ is perpendicular to both $\vec a=${vt(a)}$ and $\vec b=${vt(b)}$ and is in the direction of $\vec a\times\vec b$. Find its $${compName[idx]}$-component.${D3}`,
      sol: R`<p>$\vec a\times\vec b=${vt(x)}$ with magnitude $\sqrt{${n2(x)}}$. The component is $\dfrac{${x[idx]}}{\sqrt{${n2(x)}}}\approx${r3(val)}$.</p>`, trap: 'Divide by the magnitude of the cross product.' };
  }, (p) => { const x = cross(p.a, p.b); const u = sc(1 / nrm(x), x); if (Math.abs(dot(u, p.a)) > 1e-9 || Math.abs(dot(u, p.b)) > 1e-9) return NaN; return r3(u[p.idx]); }),

  // g14: r x a = b
  gen('ve-g14', 4, 'nat', 'numeric', 'vector equations', (rng) => {
    let a, w, b; do { a = rv(rng, -3, 3); w = rv(rng, -3, 3); b = cross(a, w); } while (n2(b) === 0 || n2(cross(a, w)) === 0); const v = int(rng, 0, 1); const c = int(rng, 1, 6), idx = int(rng, 0, 2);
    if (v === 0) { const val = nrm(b) / nrm(a); return { a, b, v, answer: r3(val), tol: 0.001, q: R`The equation $\vec r\times\vec a=\vec b$ with $\vec a=${vt(a)}$ and $\vec b=${vt(b)}$ has solutions. Find the least possible value of $|\vec r|$.${D3}`,
      sol: R`<p>$\vec a\cdot\vec b=0$, so solutions exist: $\vec r=\dfrac{\vec a\times\vec b}{|\vec a|^2}+\lambda\vec a$. The shortest has $\lambda=0$, length $\dfrac{|\vec a||\vec b|}{|\vec a|^2}=\dfrac{|\vec b|}{|\vec a|}=\dfrac{\sqrt{${n2(b)}}}{\sqrt{${n2(a)}}}\approx${r3(val)}$.</p>`, trap: 'The shortest solution is perpendicular to $\\vec a$.' }; }
    const W = add(sc(c, a), cross(a, b)); const ans = W[idx];
    return { a, b, c, v, idx, answer: ans, tol: 0, q: R`$\vec r\times\vec a=\vec b$ and $\vec r\cdot\vec a=${c}$, where $\vec a=${vt(a)}$ and $\vec b=${vt(b)}$. If $|\vec a|^2=${n2(a)}$, the $${compName[idx]}$-component of $${n2(a)}\vec r$ is`,
      sol: R`<p>Cross the first equation with $\vec a$: $\vec r|\vec a|^2-\vec a(\vec a\cdot\vec r)=\vec a\times\vec b$. So $${n2(a)}\vec r=${c}\vec a+\vec a\times\vec b=${vt(sc(c, a))}+(${vt(cross(a, b))})=${vt(W)}$. The component is $${ans}$.</p>`, trap: 'Use $\\vec a\\times(\\vec r\\times\\vec a)=\\vec r|\\vec a|^2-\\vec a(\\vec a\\cdot\\vec r)$.' };
  }, (p) => { if (p.v === 0) { const r0 = sc(1 / n2(p.a), cross(p.a, p.b)); const chk = cross(r0, p.a); if (Math.abs(chk[0] - p.b[0]) + Math.abs(chk[1] - p.b[1]) + Math.abs(chk[2] - p.b[2]) > 1e-9) return NaN; return r3(nrm(r0)); } const r = sc(1 / n2(p.a), add(sc(p.c, p.a), cross(p.a, p.b))); const chk = cross(r, p.a); if (Math.abs(chk[0] - p.b[0]) + Math.abs(chk[1] - p.b[1]) + Math.abs(chk[2] - p.b[2]) > 1e-9 || Math.abs(dot(r, p.a) - p.c) > 1e-9) return NaN; return Math.round(r[p.idx] * n2(p.a)); }),

  // g15: reciprocal system
  gen('ve-g15', 4, 'nat', 'integer', 'reciprocal system', (rng) => {
    let a, b, c, D; do { a = rv(rng, -2, 3); b = rv(rng, -2, 3); c = rv(rng, -2, 3); D = trip(a, b, c); } while (D === 0 || Math.abs(D) > 12); const v = int(rng, 0, 2), idx = int(rng, 0, 2);
    const [e1, e2, e3, x, y, z] = [int(rng, -3, 3), int(rng, -3, 3), int(rng, -3, 3), int(rng, -3, 3), int(rng, -3, 3), int(rng, -3, 3)];
    const bc = cross(b, c), ab = cross(a, b); let ans, txt, sol;
    const defn = R`Let $\vec a=${vt(a)}$, $\vec b=${vt(b)}$, $\vec c=${vt(c)}$ with $[\vec a\ \vec b\ \vec c]=${D}$, and let $\vec a',\vec b',\vec c'$ be the reciprocal vectors $\vec a'=\dfrac{\vec b\times\vec c}{[\vec a\ \vec b\ \vec c]}$, $\vec b'=\dfrac{\vec c\times\vec a}{[\vec a\ \vec b\ \vec c]}$, $\vec c'=\dfrac{\vec a\times\vec b}{[\vec a\ \vec b\ \vec c]}$.`;
    if (v === 0) { ans = bc[idx]; txt = R`${defn} Find the $${compName[idx]}$-component of $${D}\,\vec a'$.`; sol = R`<p>$${D}\vec a'=\vec b\times\vec c=${vt(bc)}$. The component is $${ans}$.</p>`; }
    else if (v === 1) { ans = e1 * x + e2 * y + e3 * z; txt = R`${defn} Find $(${e1}\vec a'+${e2}\vec b'+${e3}\vec c')\cdot(${x}\vec a+${y}\vec b+${z}\vec c)$.`; sol = R`<p>The reciprocal system satisfies $\vec a'\cdot\vec a=\vec b'\cdot\vec b=\vec c'\cdot\vec c=1$ and all mixed products (such as $\vec a'\cdot\vec b$) are 0. So the value is $${e1}\cdot${x}+${e2}\cdot${y}+${e3}\cdot${z}=${ans}$.</p>`; }
    else { ans = c[idx]; txt = R`${defn} Find the $${compName[idx]}$-component of $${D}\,(\vec a'\times\vec b')$.`; sol = R`<p>$\vec a'\times\vec b'=\dfrac{\vec c}{[\vec a\ \vec b\ \vec c]}$, so $${D}(\vec a'\times\vec b')=\vec c=${vt(c)}$. The component is $${c[idx]}$.</p>`; }
    return { a, b, c, D, v, idx, e1, e2, e3, x, y, z, answer: ans, tol: 0, q: txt, sol, trap: 'Mixed dot products in the reciprocal system are zero.' };
  }, (p) => { const ap = sc(1 / p.D, cross(p.b, p.c)), bp = sc(1 / p.D, cross(p.c, p.a)), cp = sc(1 / p.D, cross(p.a, p.b)); if (p.v === 0) return Math.round(ap[p.idx] * p.D); if (p.v === 1) { const L = add(add(sc(p.e1, ap), sc(p.e2, bp)), sc(p.e3, cp)), Rr = add(add(sc(p.x, p.a), sc(p.y, p.b)), sc(p.z, p.c)); return Math.round(dot(L, Rr)); } return Math.round(cross(ap, bp)[p.idx] * p.D); }),

  // g16: angle bisectors
  gen('ve-g16', 4, 'nat', 'integer', 'angle bisector', (rng) => {
    const a = trv(rng), b = trv(rng), na = nint(a), nb = nint(b); const v = int(rng, 0, 1), idx = int(rng, 0, 2);
    if (a.join() === b.join() || a.join() === b.map((x) => -x).join()) return gens[15].make(rng);
    const res = v === 0 ? add(sc(nb, a), sc(na, b)) : sub(sc(nb, a), sc(na, b)); const ans = res[idx]; const sg = v === 0 ? '+' : '-';
    return { a, b, v, idx, na, nb, answer: ans, tol: 0, q: R`$\vec a=${vt(a)}$ and $\vec b=${vt(b)}$. The vector $|\vec b|\,\vec a${sg}|\vec a|\,\vec b$ lies along the ${v === 0 ? 'internal' : 'external'} bisector of the angle between them. Find its ${AX[idx]}-component.`,
      sol: R`<p>$|\vec a|=${na}$ and $|\vec b|=${nb}$. So the vector is $${nb}\vec a${sg}${na}\vec b=${vt(res)}$. (It is ${na * nb} times $\hat a${sg}\hat b=\dfrac{\vec a}{${na}}${sg}\dfrac{\vec b}{${nb}}$, the bisector direction.) The ${AX[idx]}-component is $${ans}$.</p>`, trap: 'Each vector is weighted by the length of the other one.' };
  }, (p) => { const ua = sc(1 / nrm(p.a), p.a), ub = sc(1 / nrm(p.b), p.b); const u = p.v === 0 ? add(ua, ub) : sub(ua, ub); const w = p.v === 0 ? add(sc(p.nb, p.a), sc(p.na, p.b)) : sub(sc(p.nb, p.a), sc(p.na, p.b)); const k = p.na * p.nb; const back = sc(k, u); if (Math.abs(back[0] - w[0]) + Math.abs(back[1] - w[1]) + Math.abs(back[2] - w[2]) > 1e-6) return NaN; return w[p.idx]; }),

  // g17: triangle facts
  gen('ve-g17', 3, 'nat', 'integer', 'triangle in space', (rng) => {
    const v = int(rng, 0, 2), idx = int(rng, 0, 2); let A, B, C, ans, q, sol;
    if (v === 0) { do { A = rv(rng, -5, 6); B = rv(rng, -5, 6); C = rv(rng, -5, 6); } while ((A[idx] + B[idx] + C[idx]) % 3 !== 0); ans = (A[idx] + B[idx] + C[idx]) / 3; q = R`The vertices of a triangle are $A(${A.join(',')})$, $B(${B.join(',')})$ and $C(${C.join(',')})$. Find the ${AX[idx]}-coordinate of its centroid.`; sol = R`<p>Centroid $=\dfrac{A+B+C}3$. The ${AX[idx]}-coordinate: $\dfrac{${A[idx]}+(${B[idx]})+(${C[idx]})}3=${ans}$.</p>`; }
    else if (v === 1) { A = rv(rng, -4, 5); B = rv(rng, -4, 5); C = rv(rng, -4, 5); const M = add(B, C); const mm = sub(M, sc(2, A)); ans = n2(mm); q = R`In triangle $ABC$ with $A(${A.join(',')})$, $B(${B.join(',')})$, $C(${C.join(',')})$, the median from $A$ meets $BC$ at $M$. Find $4\,AM^2$.`; sol = R`<p>$\overrightarrow{AM}=\dfrac{\vec b+\vec c}2-\vec a$, so $2\overrightarrow{AM}=\vec b+\vec c-2\vec a=${vt(mm)}$ and $4AM^2=${ans}$.</p>`; }
    else { A = rv(rng, -4, 5); B = rv(rng, -4, 5); C = rv(rng, -4, 5); ans = n2(cross(sub(B, A), sub(C, A))); q = R`The vertices of a triangle are $A(${A.join(',')})$, $B(${B.join(',')})$ and $C(${C.join(',')})$. Find $4\times(\text{area})^2$.`; sol = R`<p>$\overrightarrow{AB}\times\overrightarrow{AC}=${vt(cross(sub(B, A), sub(C, A)))}$, so $4(\text{area})^2=${ans}$.</p>`; }
    return { A, B, C, v, idx, answer: ans, tol: 0, q, sol, trap: 'Use position vectors; subtract the starting vertex for sides.' };
  }, (p) => { if (p.v === 0) return (p.A[p.idx] + p.B[p.idx] + p.C[p.idx]) / 3; if (p.v === 1) { const Mx = [(p.B[0] + p.C[0]) / 2 - p.A[0], (p.B[1] + p.C[1]) / 2 - p.A[1], (p.B[2] + p.C[2]) / 2 - p.A[2]]; return Math.round(4 * (Mx[0] ** 2 + Mx[1] ** 2 + Mx[2] ** 2)); } const AB = sub(p.B, p.A), AC = sub(p.C, p.A); return Math.round(n2(AB) * n2(AC) - dot(AB, AC) ** 2); }),

  // g18: work, moment
  gen('ve-g18', 3, 'nat', 'integer', 'applications', (rng) => {
    const F = rv(rng, -4, 5), A = rv(rng, -4, 5), B = rv(rng, -4, 5), v = int(rng, 0, 2), idx = int(rng, 0, 2); const d = sub(B, A); if (n2(d) === 0) return gens[17].make(rng);
    let ans, q, sol;
    if (v === 0) { ans = dot(F, d); q = R`A force $\vec F=${vt(F)}$ N moves a particle from $A(${A.join(',')})$ to $B(${B.join(',')})$ (metres). Find the work done in joules.`; sol = R`<p>$\vec d=\overrightarrow{AB}=${vt(d)}$. $W=\vec F\cdot\vec d=${ans}$ J.</p>`; }
    else if (v === 1) { ans = cross(A, F)[idx]; q = R`A force $\vec F=${vt(F)}$ N acts at the point $A(${A.join(',')})$ (metres). Find the $${compName[idx]}$-component of its moment about the origin, $\vec r\times\vec F$.`; sol = R`<p>$\vec A\times\vec F=${vt(cross(A, F))}$. The component is $${ans}$.</p>`; }
    else { ans = n2(cross(A, F)); q = R`A force $\vec F=${vt(F)}$ N acts at $A(${A.join(',')})$ (metres). Find the square of the magnitude of its moment about the origin.`; sol = R`<p>$\vec r\times\vec F=${vt(cross(A, F))}$, so the squared magnitude is $${ans}$.</p>`; }
    return { F, A, B, v, idx, answer: ans, tol: 0, q, sol, trap: 'Work uses the displacement (end minus start); moment uses the position of the point of action.' };
  }, (p) => { const d = sub(p.B, p.A); if (p.v === 0) return p.F[0] * d[0] + p.F[1] * d[1] + p.F[2] * d[2]; const M = [p.A[1] * p.F[2] - p.A[2] * p.F[1], p.A[2] * p.F[0] - p.A[0] * p.F[2], p.A[0] * p.F[1] - p.A[1] * p.F[0]]; return p.v === 1 ? M[p.idx] : M[0] ** 2 + M[1] ** 2 + M[2] ** 2; }),

  // g19: linear combination coefficients
  gen('ve-g19', 2, 'nat', 'integer', 'linear combination', (rng) => {
    let a, b, c, D; do { a = rv(rng, -2, 3); b = rv(rng, -2, 3); c = rv(rng, -2, 3); D = trip(a, b, c); } while (D === 0);
    const x = int(rng, -3, 3), y = int(rng, -3, 3), z = int(rng, -3, 3); const p = add(add(sc(x, a), sc(y, b)), sc(z, c)); const v = int(rng, 0, 2);
    const ans = [x + y + z, y, x - y + z][v]; const txt = ['$x+y+z$', '$y$', '$x-y+z$'][v];
    return { a, b, c, x, y, z, v, answer: ans, tol: 0, q: R`The vector $\vec p=${vt(p)}$ is written as $x\vec a+y\vec b+z\vec c$ with $\vec a=${vt(a)}$, $\vec b=${vt(b)}$, $\vec c=${vt(c)}$. Find ${txt}.`,
      sol: R`<p>Comparing components gives three equations: ${[0, 1, 2].map((j) => `$${a[j]}x${sgn(b[j])}y${sgn(c[j])}z=${p[j]}$`).join(', ')}. Solving (for example by Cramer's rule) gives $x=${x}$, $y=${y}$, $z=${z}$. So ${txt} $=${ans}$.</p>`, trap: 'The three vectors are independent, so the coefficients are unique.' };
  }, (p) => { const P = add(add(sc(p.x, p.a), sc(p.y, p.b)), sc(p.z, p.c)); const D = det3([[p.a[0], p.b[0], p.c[0]], [p.a[1], p.b[1], p.c[1]], [p.a[2], p.b[2], p.c[2]]]); const Dx = det3([[P[0], p.b[0], p.c[0]], [P[1], p.b[1], p.c[1]], [P[2], p.b[2], p.c[2]]]); const Dy = det3([[p.a[0], P[0], p.c[0]], [p.a[1], P[1], p.c[1]], [p.a[2], P[2], p.c[2]]]); const Dz = det3([[p.a[0], p.b[0], P[0]], [p.a[1], p.b[1], P[1]], [p.a[2], p.b[2], P[2]]]); const x = Dx / D, y = Dy / D, z = Dz / D; return Math.round([x + y + z, y, x - y + z][p.v]); }),

  // g20: parallelogram
  gen('ve-g20', 3, 'nat', 'integer', 'parallelogram', (rng) => {
    const A = rv(rng, -4, 5), B = rv(rng, -4, 5), C = rv(rng, -4, 5), v = int(rng, 0, 2), idx = int(rng, 0, 2); const D = sub(add(A, C), B); let ans, q, sol;
    if (v === 0) { ans = D[idx]; q = R`$A(${A.join(',')})$, $B(${B.join(',')})$ and $C(${C.join(',')})$ are three vertices of a parallelogram $ABCD$ in order. Find the ${AX[idx]}-coordinate of $D$.`; sol = R`<p>The diagonals $AC$ and $BD$ bisect each other, so $D=A+C-B=${P(D)}$. The ${AX[idx]}-coordinate is $${ans}$.</p>`; }
    else if (v === 1) { ans = n2(cross(sub(B, A), sub(D, A))); q = R`$ABCD$ is a parallelogram with $A(${A.join(',')})$, $B(${B.join(',')})$ and $C(${C.join(',')})$. Find the square of its area.`; sol = R`<p>$D=A+C-B=${P(D)}$. $\overrightarrow{AB}\times\overrightarrow{AD}=${vt(cross(sub(B, A), sub(D, A)))}$. Area$^2=${ans}$.</p>`; }
    else { ans = n2(sub(D, B)); q = R`$ABCD$ is a parallelogram with $A(${A.join(',')})$, $B(${B.join(',')})$ and $C(${C.join(',')})$. Find $BD^2$.`; sol = R`<p>$D=A+C-B=${P(D)}$. $\overrightarrow{BD}=${vt(sub(D, B))}$ and $BD^2=${ans}$.</p>`; }
    return { A, B, C, v, idx, answer: ans, tol: 0, q, sol, trap: 'The fourth vertex is opposite $B$: $D=A+C-B$.' };
  }, (p) => { const Dd = [p.A[0] + p.C[0] - p.B[0], p.A[1] + p.C[1] - p.B[1], p.A[2] + p.C[2] - p.B[2]]; if (p.v === 0) return Dd[p.idx]; if (p.v === 1) { const u = sub(p.B, p.A), w = sub(Dd, p.A); return n2(u) * n2(w) - dot(u, w) ** 2; } const m = [(p.A[0] + p.C[0]) / 2, (p.A[1] + p.C[1]) / 2, (p.A[2] + p.C[2]) / 2]; const d2 = [2 * (m[0] - p.B[0]), 2 * (m[1] - p.B[1]), 2 * (m[2] - p.B[2])]; return Math.round(n2(d2)); }),

  // g21: Lagrange identity
  gen('ve-g21', 4, 'nat', 'integer', 'Lagrange identity', (rng) => {
    const a = rv(rng, -3, 4), b = rv(rng, -3, 4), v = int(rng, 0, 2); const x = cross(a, b); if (n2(x) === 0) return gens[20].make(rng);
    let ans, q, sol;
    if (v === 0) { ans = n2(x); q = R`$|\vec a|^2=${n2(a)}$, $|\vec b|^2=${n2(b)}$ and $\vec a\cdot\vec b=${dot(a, b)}$. Find $|\vec a\times\vec b|^2$.`; sol = R`<p>$|\vec a\times\vec b|^2=|\vec a|^2|\vec b|^2-(\vec a\cdot\vec b)^2=${n2(a)}\cdot${n2(b)}-${dot(a, b) ** 2}=${ans}$.</p>`; }
    else if (v === 1) { ans = dot(a, b) ** 2; q = R`$|\vec a|^2=${n2(a)}$, $|\vec b|^2=${n2(b)}$ and $|\vec a\times\vec b|^2=${n2(x)}$. Find $(\vec a\cdot\vec b)^2$.`; sol = R`<p>$(\vec a\cdot\vec b)^2=|\vec a|^2|\vec b|^2-|\vec a\times\vec b|^2=${n2(a) * n2(b)}-${n2(x)}=${ans}$.</p>`; }
    else { ans = n2(sub(a, b)); q = R`$|\vec a|^2=${n2(a)}$, $|\vec b|^2=${n2(b)}$ and $|\vec a+\vec b|^2=${n2(add(a, b))}$. Find $|\vec a-\vec b|^2$.`; sol = R`<p>The parallelogram law: $|\vec a+\vec b|^2+|\vec a-\vec b|^2=2|\vec a|^2+2|\vec b|^2$. So $|\vec a-\vec b|^2=${2 * n2(a)}+${2 * n2(b)}-${n2(add(a, b))}=${ans}$.</p>`; }
    return { a, b, v, answer: ans, tol: 0, q, sol, trap: 'Lagrange: $|\\vec a\\times\\vec b|^2+(\\vec a\\cdot\\vec b)^2=|\\vec a|^2|\\vec b|^2$.' };
  }, (p) => { if (p.v === 0) return n2(cross(p.a, p.b)); if (p.v === 1) return dot(p.a, p.b) ** 2; const s = add(p.a, p.b); const dd = (n2(s) - n2(p.a) - n2(p.b)) / 2; return n2(p.a) + n2(p.b) - 2 * dd; }),

  // g22: direction cosines
  gen('ve-g22', 3, 'nat', 'integer', 'direction cosines', (rng) => {
    const t = shufflePerm(rng, choose(rng, PUZ)), s = nint(t), k = int(rng, 2, 4), v = int(rng, 0, 1), sg = signed(rng, t);
    if (v === 0) return { t: sg, k, s, v, answer: k * sg[0], tol: 0, q: R`A vector of magnitude ${k * s} points in the direction of $${vt(sg)}$. Find its $\hat i$-component.`, sol: R`<p>The unit vector along $${vt(sg)}$ is $\dfrac{(${sg.join(', ')})}{\sqrt{${n2(sg)}}}=\dfrac{(${sg.join(', ')})}{${s}}$. Multiplying by ${k * s} gives $${k}(${sg.join(', ')})$, whose $\hat i$-component is $${k * sg[0]}$.</p>`, trap: 'Scale the unit vector, not the original vector.' };
    return { t, k, s, v, answer: t[2] ** 2, tol: 0, q: R`A vector has direction cosines $l=\dfrac{${t[0]}}{${s}}$, $m=\dfrac{${t[1]}}{${s}}$ and $n=\dfrac{c}{${s}}$, where $c>0$. Find $c^2$.`, sol: R`<p>$l^2+m^2+n^2=1$ gives $\dfrac{${t[0] ** 2}+${t[1] ** 2}+c^2}{${s * s}}=1$, so $c^2=${s * s}-${t[0] ** 2}-${t[1] ** 2}=${t[2] ** 2}$.</p>`, trap: 'Direction cosines square-sum to 1.' };
  }, (p) => { if (p.v === 0) return Math.round((p.k * p.s * p.t[0]) / nrm(p.t)); return Math.round(p.s * p.s - p.t[0] ** 2 - p.t[1] ** 2); }),

  // g23: coordinate plane division ratio
  gen('ve-g23', 3, 'nat', 'integer', 'section formula', (rng) => {
    const A = rv(rng, -6, 6), B = rv(rng, -6, 6), j = int(rng, 0, 2); if (A[j] === 0 || B[j] === 0 || A[j] * B[j] > 0) return gens[22].make(rng);
    const m = Math.abs(A[j]), n = Math.abs(B[j]), g = gcd(m, n); const plane = ['yz', 'xz', 'xy'][j];
    return { A, B, j, answer: (m + n) / g, tol: 0, q: R`The ${plane}-plane divides the join of $A(${A.join(',')})$ and $B(${B.join(',')})$ in the ratio $m:n$ (lowest terms, both positive). Find $m+n$.`,
      sol: R`<p>On the ${plane}-plane the ${AX[j]}-coordinate is 0: $\dfrac{m(${B[j]})+n(${A[j]})}{m+n}=0$, so $m:n=${m}:${n}=${m / g}:${n / g}$ and $m+n=${(m + n) / g}$.</p>`, trap: 'The plane named ' + plane + ' is where the missing letter is zero.' };
  }, (p) => { const m0 = Math.abs(p.A[p.j]), n0 = Math.abs(p.B[p.j]); const t = m0 / (m0 + n0); const zc = p.A[p.j] + t * (p.B[p.j] - p.A[p.j]); if (Math.abs(zc) > 1e-9) return NaN; for (let tot = 2; tot <= m0 + n0; tot++) { const m = t * tot; if (Math.abs(m - Math.round(m)) < 1e-9) return tot; } return NaN; }),

  // g24: sums of dot products when vectors add to zero
  gen('ve-g24', 4, 'nat', 'integer', 'dot product', (rng) => {
    const v = int(rng, 0, 2);
    if (v === 0) { const S = choose(rng, [[2, 4, 6], [4, 6, 8], [2, 6, 8], [6, 8, 10], [4, 8, 10], [2, 8, 10]]); const s2 = S[0] ** 2 + S[1] ** 2 + S[2] ** 2; return { S, v, answer: -s2 / 2, tol: 0, q: R`$\vec a+\vec b+\vec c=\vec 0$ with $|\vec a|=${S[0]}$, $|\vec b|=${S[1]}$ and $|\vec c|=${S[2]}$. Find $\vec a\cdot\vec b+\vec b\cdot\vec c+\vec c\cdot\vec a$.`, sol: R`<p>$|\vec a+\vec b+\vec c|^2=0=${S[0] ** 2}+${S[1] ** 2}+${S[2] ** 2}+2(\vec a\cdot\vec b+\vec b\cdot\vec c+\vec c\cdot\vec a)$, so the sum is $-\dfrac{${s2}}2=${-s2 / 2}$.</p>`, trap: 'Square the zero vector sum.' }; }
    const a = int(rng, 2, 7), b = int(rng, 2, 7), cs = choose(rng, [0.5, 0, -0.5]); const ab = a * b * cs; if (!Number.isInteger(ab) && Math.abs(ab % 1) > 1e-9) return gens[23].make(rng);
    const s2 = a * a + b * b + 2 * ab;
    if (v === 1) return { a, b, ab, v, answer: ab, tol: 0, q: R`$|\vec a|=${a}$, $|\vec b|=${b}$ and $|\vec a+\vec b|^2=${s2}$. Find $\vec a\cdot\vec b$.`, sol: R`<p>$|\vec a+\vec b|^2=|\vec a|^2+|\vec b|^2+2\vec a\cdot\vec b$, so $\vec a\cdot\vec b=\dfrac{${s2}-${a * a}-${b * b}}2=${ab}$.</p>`, trap: 'The cross term is twice the dot product.' };
    return { a, b, ab, s2, v, answer: a * a + b * b - 2 * ab, tol: 0, q: R`$|\vec a|=${a}$, $|\vec b|=${b}$ and $|\vec a+\vec b|^2=${s2}$. Find $|\vec a-\vec b|^2$.`, sol: R`<p>Parallelogram law: $|\vec a+\vec b|^2+|\vec a-\vec b|^2=2(${a * a}+${b * b})$. So $|\vec a-\vec b|^2=${2 * (a * a + b * b)}-${s2}=${a * a + b * b - 2 * ab}$.</p>`, trap: 'The two diagonals squared add to twice the sum of the squared sides.' };
  }, (p) => { if (p.v === 0) { const [x, y, z] = p.S; return Math.round(-(x * x + y * y + z * z) / 2); } if (p.v === 1) return Math.round((p.a * p.a + p.b * p.b + 2 * p.ab - p.a * p.a - p.b * p.b) / 2); const t = Math.acos(p.ab / (p.a * p.b)); const A = [p.a, 0, 0], B = [p.b * Math.cos(t), p.b * Math.sin(t), 0]; return Math.round(n2(sub(A, B))); }),

  // g25: more triple-product identities
  gen('ve-g25', 4, 'nat', 'integer', 'scalar triple product', (rng) => {
    let a, b, c, D; do { a = rv(rng, -2, 3); b = rv(rng, -2, 3); c = rv(rng, -2, 3); D = trip(a, b, c); } while (D === 0 || Math.abs(D) > 10); const v = int(rng, 0, 2);
    const defn = R`$\vec a=${vt(a)}$, $\vec b=${vt(b)}$, $\vec c=${vt(c)}$`;
    if (v === 0) return { a, b, c, D, v, answer: D * D, tol: 0, q: R`For ${defn}, find $[\vec a\times\vec b\ \ \vec b\times\vec c\ \ \vec c\times\vec a]$.`, sol: R`<p>The identity gives $[\vec a\times\vec b\ \vec b\times\vec c\ \vec c\times\vec a]=[\vec a\ \vec b\ \vec c]^2$. Here $[\vec a\ \vec b\ \vec c]=${D}$, so the answer is $${D * D}$.</p>`, trap: 'It is the square of the triple product.' };
    if (v === 1) { const ab = cross(a, b); return { a, b, c, D, v, answer: n2(ab), tol: 0, q: R`For $\vec a=${vt(a)}$ and $\vec b=${vt(b)}$, find $[\vec a\ \ \vec b\ \ \vec a\times\vec b]$.`, sol: R`<p>$[\vec a\ \vec b\ \vec a\times\vec b]=(\vec a\times\vec b)\cdot(\vec a\times\vec b)=|\vec a\times\vec b|^2$ (cyclic change of the triple product). Here $\vec a\times\vec b=${vt(ab)}$, so the value is $${n2(ab)}$.</p>`, trap: 'A cyclic shift keeps the triple product unchanged.' }; }
    const E = add(a, sc(2, b)); return { a, b, c, D, v, answer: D, tol: 0, q: R`For ${defn}, find $[\vec a+2\vec b\ \ \vec b\ \ \vec c]$.`, sol: R`<p>Adding a multiple of $\vec b$ to the first vector does not change the triple product, since $[\vec b\ \vec b\ \vec c]=0$. So the value is $[\vec a\ \vec b\ \vec c]=${D}$ (first vector would be $${vt(E)}$).</p>`, trap: 'Row operations of this type leave the determinant unchanged.' };
  }, (p) => { if (p.v === 0) return Math.round(det3([cross(p.a, p.b), cross(p.b, p.c), cross(p.c, p.a)])); if (p.v === 1) return det3([p.a, p.b, cross(p.a, p.b)]); return det3([add(p.a, sc(2, p.b)), p.b, p.c]); }),
];
const itemsAll = [...itemsA, ...itemsB, ...itemsC, ...itemsD, ...itemsE];
itemsAll.forEach((it, i) => { it.id = `ve-${String(i + 1).padStart(3, '0')}`; });
// level adjustments by id
const RELEVEL = { 2: [28, 35, 36, 38, 40, 46, 53, 56, 59, 61, 74, 77], 5: [87, 92, 94, 98, 108, 118, 125, 168] };
for (const [lv, ids] of Object.entries(RELEVEL)) for (const n of ids) { const it = itemsAll[n - 1]; it.level = +lv; it.exams = [...EXS[+lv], ...(it.type === 'mcq' && +lv <= 3 ? ['cuet'] : [])]; }
const items = itemsAll;
// ==XP-BEGIN (expansion block: new items, groups and templates; ids continue after the originals)
{
const XR = String.raw;
const XEXS = { 1: ['keam', 'cusat', 'comedk', 'jee-main'], 2: ['keam', 'cusat', 'comedk', 'jee-main'], 3: ['jee-main', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const XCUET = true;
const xex = (l, t) => [...XEXS[l], ...(XCUET && t === 'mcq' && l <= 3 ? ['cuet'] : [])];
let _k = 0, _p = 0; const XPS = [2, 0, 3, 1, 3, 1, 0, 2, 1, 3, 2, 0];
const xid = () => `ve-x${String(++_k).padStart(3, '0')}`;
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
Object.assign(groups, {
  xm1: { title: 'Products of unit vectors', passage: XR`<p>$\hat i,\hat j,\hat k$ are the usual unit vectors. Match each expression in List I with its value in List II.</p>`,
    list1: ['A. $\\hat i\\cdot(\\hat j\\times\\hat k)$', 'B. $\\hat i\\times(\\hat j\\times\\hat k)$', 'C. $\\hat i\\times\\hat j+\\hat j\\times\\hat k+\\hat k\\times\\hat i$', 'D. $(\\hat i+\\hat j)\\times(\\hat i-\\hat j)$'], list2: ['p. $\\vec 0$', 'q. $1$', 'r. $\\hat i+\\hat j+\\hat k$', 's. $-2\\hat k$'] },
  xm2: { title: 'Quantities for two vectors', passage: XR`<p>$\vec a=\hat i+2\hat j+2\hat k$ and $\vec b=4\hat i+3\hat k$. Match each quantity in List I with its value in List II.</p>`,
    list1: ['A. $\\vec a\\cdot\\vec b$', 'B. $|\\vec a\\times\\vec b|^2$', 'C. $|\\vec a+\\vec b|^2$', 'D. the component of $\\vec a$ along $\\vec b$'], list2: ['p. $2$', 'q. $10$', 'r. $54$', 's. $125$'] },
  xm3: { title: 'Scalar triple products', passage: XR`<p>$\vec a,\vec b,\vec c$ are vectors with $[\vec a\ \vec b\ \vec c]=3$. Match each quantity in List I with its value in List II.</p>`,
    list1: ['A. $[\\hat i\\ \\hat j\\ \\hat k]$', 'B. $[\\hat i\\ \\hat k\\ \\hat j]$', 'C. $[\\vec a\\ \\vec b\\ \\vec a]$', 'D. $[2\\vec a\\ \\vec b\\ \\vec c]$'], list2: ['p. $0$', 'q. $1$', 'r. $-1$', 's. $6$'] },
  xm4: { title: 'Dividing a segment', passage: XR`<p>$A=(1,2,3)$ and $B=(7,8,9)$. Match each point $P$ on line $AB$ in List I with its coordinates in List II.</p>`,
    list1: ['A. $P$ divides $AB$ internally in the ratio $1:2$', 'B. $P$ divides $AB$ externally in the ratio $3:1$', 'C. $P$ is the midpoint of $AB$', 'D. $P$ divides $AB$ internally in the ratio $2:1$'], list2: ['p. $(3,4,5)$', 'q. $(4,5,6)$', 'r. $(5,6,7)$', 's. $(10,11,12)$'] },
  xm5: { title: 'Conditions on two vectors', passage: XR`<p>$\vec a,\vec b$ are non-zero vectors. Match each condition in List I with what it says in List II.</p>`,
    list1: ['A. $|\\vec a+\\vec b|=|\\vec a-\\vec b|$', 'B. $|\\vec a+\\vec b|=|\\vec a|+|\\vec b|$', 'C. $\\vec a\\times\\vec b=\\vec 0$', 'D. $|\\vec a-\\vec b|=|\\vec a|+|\\vec b|$'], list2: ['p. $\\vec a\\perp\\vec b$', 'q. same direction', 'r. parallel (either direction)', 's. opposite directions'] },
  xm6: { title: 'Vector identities', passage: XR`<p>Match each expression in List I with the equal expression in List II.</p>`,
    list1: ['A. $\\vec a\\times(\\vec b\\times\\vec c)$', 'B. $(\\vec a\\times\\vec b)\\times\\vec c$', 'C. $|\\vec a\\times\\vec b|^2$', 'D. $[\\vec a\\ \\vec b\\ \\vec c]^2$'], list2: ['p. $|\\vec a|^2|\\vec b|^2-(\\vec a\\cdot\\vec b)^2$', 'q. the determinant of dot products $\\vec a\\cdot\\vec a,\\vec a\\cdot\\vec b,\\dots$', 'r. $(\\vec a\\cdot\\vec c)\\vec b-(\\vec b\\cdot\\vec c)\\vec a$', 's. $(\\vec a\\cdot\\vec c)\\vec b-(\\vec a\\cdot\\vec b)\\vec c$'] },
  xm7: { title: 'Angles and lengths in a cube', passage: XR`<p>A cube has edge $1$ and one vertex at the origin, with edges along the axes. Match each quantity in List I with its value in List II.</p>`,
    list1: ['A. length of a body diagonal', 'B. angle between two body diagonals (acute)', 'C. angle between a body diagonal and an edge', 'D. angle between the body diagonal $(1,1,1)$ and the face diagonal $(1,-1,0)$'], list2: ['p. $\\cos^{-1}\\dfrac1{\\sqrt3}$', 'q. $\\sqrt3$', 'r. $90^\\circ$', 's. $\\cos^{-1}\\dfrac13$'] },
  xm8: { title: 'Areas and volumes', passage: XR`<p>$\vec a=2\hat i$, $\vec b=\hat i+3\hat j$, $\vec c=\hat i+\hat j+4\hat k$. Match each quantity in List I with its value in List II.</p>`,
    list1: ['A. volume of the parallelepiped on $\\vec a,\\vec b,\\vec c$', 'B. volume of the tetrahedron on $\\vec a,\\vec b,\\vec c$', 'C. area of the parallelogram on $\\vec a,\\vec b$', 'D. area of the triangle on $\\vec a,\\vec b$'], list2: ['p. $3$', 'q. $4$', 'r. $6$', 's. $24$'] },
  xp1: { title: 'Passage: a corner tetrahedron', passage: XR`<p>$O$ is the origin and $A=(2,0,0)$, $B=(0,3,0)$, $C=(0,0,6)$.</p>` },
  xp2: { title: 'Passage: a parallelogram with equal sides', passage: XR`<p>$ABCD$ is a parallelogram with $\vec{AB}=\vec a=2\hat i+\hat j+2\hat k$ and $\vec{AD}=\vec b=2\hat i+2\hat j-\hat k$. Its diagonals are $\vec{AC}=\vec a+\vec b$ and $\vec{BD}=\vec b-\vec a$.</p>` },
});
items.push(
  // ---- L2 ----
  M(2, 'dot product', XR`If $\vec a=2\hat i+3\hat j-\hat k$ and $\vec b=\hat i-\hat j+2\hat k$, then $\vec a\cdot\vec b$ equals`, '$-3$', ['$3$', '$7$', '$-7$'],
    XR`<p>$\vec a\cdot\vec b=2(1)+3(-1)+(-1)(2)=2-3-2=-3$.</p>`, 'Multiply matching components and add.'),
  M(2, 'magnitude', XR`The magnitude of $3\hat i-4\hat j+12\hat k$ is`, '$13$', ['$19$', '$5$', '$169$'],
    XR`<p>$\sqrt{9+16+144}=\sqrt{169}=13$.</p>`, '169 is the square of the magnitude.'),
  A(2, 'dot product', XR`$\hat i\cdot\hat j=0$.`, XR`The dot product of two perpendicular vectors is $0$.`, 0,
    XR`<p>$\hat i$ and $\hat j$ are perpendicular, and $\vec a\cdot\vec b=|\vec a||\vec b|\cos90^\circ=0$. R is the reason.</p>`, 'cos 90° = 0.'),
  S(2, 'vector algebra', XR`$\vec a\times\vec a=\vec 0$ for every vector $\vec a$.`, XR`$\vec a\cdot\vec a=|\vec a|^2$ for every vector $\vec a$.`, 0,
    XR`<p>The angle between $\vec a$ and itself is $0$, so $|\vec a\times\vec a|=|\vec a|^2\sin0=0$ and $\vec a\cdot\vec a=|\vec a|^2\cos0=|\vec a|^2$. Both true.</p>`, 'A zero vector, not the number 0.'),
  I(2, 'perpendicular vectors', XR`Find $\lambda$ so that $\lambda\hat i+2\hat j+\hat k$ is perpendicular to $\hat i-3\hat j+4\hat k$.`, 2,
    XR`<p>Perpendicular means dot product $0$: $\lambda-6+4=0$, so $\lambda=2$.</p>`, 'Set the dot product to zero.', () => 6 - 4),
  M(2, 'area', XR`The area of the parallelogram with adjacent sides $\hat i+\hat j$ and $\hat j+\hat k$ is`, XR`$\sqrt3$`, ['$3$', '$1$', XR`$\sqrt2$`],
    XR`<p>$(\hat i+\hat j)\times(\hat j+\hat k)=\hat i-\hat j+\hat k$, with magnitude $\sqrt3$. The area is $\sqrt3$.</p>`, 'Area is the magnitude of the cross product.'),
  // ---- L3 ----
  I(3, 'Lagrange identity', XR`$|\vec a|=3$, $|\vec b|=4$ and $\vec a\cdot\vec b=6$. Find $|\vec a\times\vec b|^2$.`, 108,
    XR`<p>$|\vec a\times\vec b|^2=|\vec a|^2|\vec b|^2-(\vec a\cdot\vec b)^2=144-36=108$.</p>`, 'Use the identity; do not look for the angle.', () => 9 * 16 - 36),
  M(3, 'scalar triple product', XR`For $\vec a=\hat i+2\hat j+3\hat k$, $\vec b=2\hat i+\hat k$ and $\vec c=\hat j+4\hat k$, the value of $[\vec a\ \vec b\ \vec c]$ is`, '$-11$', ['$11$', '$-1$', '$13$'],
    XR`<p>$\begin{vmatrix}1&2&3\\2&0&1\\0&1&4\end{vmatrix}=1(0-1)-2(8-0)+3(2-0)=-1-16+6=-11$.</p>`, 'Expand along the first row with alternating signs.'),
  N(3, 'volume', XR`Find the volume of the tetrahedron with vertices $(0,0,0)$, $(1,2,3)$, $(2,0,1)$ and $(0,1,4)$ (2 decimal places).`, 1.83, 0.01,
    XR`<p>Volume $=\dfrac16\big|[\vec a\ \vec b\ \vec c]\big|$ with $\vec a=(1,2,3)$, $\vec b=(2,0,1)$, $\vec c=(0,1,4)$. The triple product is $-11$, so the volume is $\dfrac{11}6\approx1.83$.</p>`, 'Divide by 6 for a tetrahedron.', () => Math.abs(trip([1, 2, 3], [2, 0, 1], [0, 1, 4])) / 6),
  M(3, 'cross product', XR`The unit vector in the direction of $(\hat i+\hat j)\times(\hat j+\hat k)$ is`, XR`$\dfrac{\hat i-\hat j+\hat k}{\sqrt3}$`, [XR`$\hat i-\hat j+\hat k$`, XR`$\dfrac{\hat i+\hat j+\hat k}{\sqrt3}$`, XR`$\dfrac{\hat i-\hat j+\hat k}{3}$`],
    XR`<p>The cross product is $\hat i-\hat j+\hat k$, with magnitude $\sqrt3$. Divide by the magnitude: $\dfrac{\hat i-\hat j+\hat k}{\sqrt3}$.</p>`, 'A unit vector needs division by the magnitude √3, not 3.'),
  I(3, 'collinear points', XR`The points $A(1,2,3)$, $B(3,4,5)$ and $C(\lambda,6,7)$ are collinear. Find $\lambda$.`, 5,
    XR`<p>$\vec{AB}=(2,2,2)$ and $\vec{AC}=(\lambda-1,4,4)$. For collinearity $\vec{AC}=2\vec{AB}=(4,4,4)$, so $\lambda-1=4$ and $\lambda=5$.</p>`, 'Match the ratio from the other two coordinates.', () => 5),
  M(3, 'angle between vectors', XR`If $|\vec a|=|\vec b|=|\vec a+\vec b|$, the angle between $\vec a$ and $\vec b$ is`, XR`$\dfrac{2\pi}3$`, [XR`$\dfrac\pi3$`, XR`$\dfrac\pi2$`, XR`$\dfrac{\pi}6$`],
    XR`<p>Let all three lengths be $1$. $|\vec a+\vec b|^2=1+1+2\cos\theta=1$, so $\cos\theta=-\dfrac12$ and $\theta=\dfrac{2\pi}3$.</p>`, 'Not π/3: that would make the sum √3 long.'),
  I(3, 'dot product', XR`$|\vec a|=2$, $|\vec b|=3$ and the angle between them is $60^\circ$. Find $|2\vec a-\vec b|^2$.`, 13,
    XR`<p>$\vec a\cdot\vec b=2\cdot3\cos60^\circ=3$. $|2\vec a-\vec b|^2=4|\vec a|^2+|\vec b|^2-4\vec a\cdot\vec b=16+9-12=13$.</p>`, 'The cross term is −4 a·b.', () => 16 + 9 - 12),
  SC(3, 'vector algebra', ['$\\vec a\\cdot\\vec b=\\vec b\\cdot\\vec a$.', '$\\vec a\\times\\vec b=\\vec b\\times\\vec a$.', '$\\vec a\\times(\\vec b+\\vec c)=\\vec a\\times\\vec b+\\vec a\\times\\vec c$.', '$(\\vec a\\cdot\\vec b)\\vec c$ is a vector.'], '3', ['1', '2', '4'],
    XR`<p>(1) true. (2) false: $\vec a\times\vec b=-\vec b\times\vec a$. (3) true. (4) true: a scalar times a vector. Three are correct.</p>`, 'The cross product is anticommutative.'),
  A(3, 'dot product', XR`If $\vec a\cdot\vec b=\vec a\cdot\vec c$ and $\vec a\ne\vec 0$, then $\vec b=\vec c$.`, XR`$\vec a\cdot\vec b=\vec a\cdot\vec c$ means $\vec a\cdot(\vec b-\vec c)=0$.`, 3,
    XR`<p>R is true, but it only says $\vec a$ is perpendicular to $\vec b-\vec c$, not that $\vec b-\vec c=\vec 0$. Example: $\vec a=\hat i$, $\vec b=\hat j$, $\vec c=\hat k$: both dot products are $0$ but $\vec b\ne\vec c$. So A is false and R is true.</p>`, 'There is no cancellation law for the dot product.'),
  S(3, 'dot and cross', XR`$(\vec a+\vec b)\cdot(\vec a-\vec b)=0$ exactly when $|\vec a|=|\vec b|$.`, XR`$(\vec a+\vec b)\cdot(\vec a-\vec b)=0$ exactly when $\vec a\perp\vec b$.`, 1,
    XR`<p>$(\vec a+\vec b)\cdot(\vec a-\vec b)=|\vec a|^2-|\vec b|^2$. So it is $0$ exactly when $|\vec a|=|\vec b|$: I true, II false.</p>`, 'The diagonals of a rhombus are perpendicular.'),
  I(3, 'coplanar vectors', XR`$\vec a=(1,2,3)$, $\vec b=(1,-1,2)$ and $\vec c=(\lambda,1,5)$ are coplanar. Find $\lambda$.`, 2,
    XR`<p>Coplanar means $\begin{vmatrix}1&2&3\\1&-1&2\\\lambda&1&5\end{vmatrix}=0$. Expanding: $1(-5-2)-2(5-2\lambda)+3(1+\lambda)=-7-10+4\lambda+3+3\lambda=7\lambda-14$. So $\lambda=2$.</p>`, 'Set the triple product to 0.', () => 2),
  I(3, 'cross product', XR`$\vec a=\hat i+\hat j+\hat k$ and $\vec b=\hat i+2\hat j+3\hat k$. Find $|\vec a\times\vec b|^2$.`, 6,
    XR`<p>$\vec a\times\vec b=(3-2,\ 1-3,\ 2-1)=(1,-2,1)$. Its square magnitude is $1+4+1=6$.</p>`, 'Square the magnitude, not the components of a and b.', () => n2(cross([1, 1, 1], [1, 2, 3]))),
  N(3, 'projection', XR`$\vec a=\hat i-2\hat j+2\hat k$ and $\vec b=2\hat i+3\hat j+6\hat k$. Find the scalar projection of $\vec a$ on $\vec b$ (2 decimal places).`, 1.14, 0.01,
    XR`<p>$\vec a\cdot\vec b=2-6+12=8$ and $|\vec b|=7$. The projection is $\dfrac87\approx1.14$.</p>`, 'Divide by |b|, not |a|.', () => 8 / 7),
  N(3, 'angle between vectors', XR`The angle between $\vec a=\hat i+2\hat j+2\hat k$ and $\vec b=4\hat i+3\hat k$ is how many degrees (2 decimal places)?`, 48.19, 0.01,
    XR`<p>$\vec a\cdot\vec b=4+6=10$, $|\vec a|=3$, $|\vec b|=5$. $\cos\theta=\dfrac{10}{15}=\dfrac23$ and $\theta=\cos^{-1}\dfrac23\approx48.19^\circ$.</p>`, 'Use arccos of 2/3.', () => deg(Math.acos(2 / 3))),
  N(3, 'cross product', XR`$\vec a=\hat i+2\hat j+3\hat k$ and $\vec b=2\hat i-\hat j+\hat k$. Find $|\vec a\times\vec b|$ (2 decimal places).`, 8.66, 0.01,
    XR`<p>$\vec a\times\vec b=(2\cdot1-3(-1),\ 3\cdot2-1\cdot1,\ 1(-1)-2\cdot2)=(5,5,-5)$. Its magnitude is $5\sqrt3\approx8.66$.</p>`, 'Expand carefully with signs.', () => nrm(cross([1, 2, 3], [2, -1, 1]))),
  I(3, 'cross product', XR`The vertices of a triangle are $A(1,0,0)$, $B(0,2,0)$ and $C(0,0,3)$. Find $|\vec{AB}\times\vec{AC}|$.`, 7,
    XR`<p>$\vec{AB}=(-1,2,0)$, $\vec{AC}=(-1,0,3)$. $\vec{AB}\times\vec{AC}=(6,3,2)$, magnitude $\sqrt{36+9+4}=7$. (The triangle's area is $\dfrac72$.)</p>`, 'The area is half of this.', () => nrm(cross([-1, 2, 0], [-1, 0, 3]))),
  MT(3, 'unit vectors', 'xm1', 'A-q, B-p, C-r, D-s', ['A-q, B-p, C-s, D-r', 'A-p, B-q, C-r, D-s', 'A-q, B-r, C-p, D-s'],
    XR`<p>A: $\hat i\cdot\hat i=1$. B: $\hat j\times\hat k=\hat i$, so $\hat i\times\hat i=\vec 0$. C: $\hat k+\hat i+\hat j$. D: $\hat i\times\hat i-\hat i\times\hat j+\hat j\times\hat i-\hat j\times\hat j=-\hat k-\hat k=-2\hat k$.</p>`, 'Cyclic products: i × j = k, j × k = i, k × i = j.'),
  MT(3, 'dot and cross', 'xm2', 'A-q, B-s, C-r, D-p', ['A-q, B-s, C-p, D-r', 'A-s, B-q, C-r, D-p', 'A-q, B-r, C-s, D-p'],
    XR`<p>A: $4+0+6=10$. B: $|\vec a|^2|\vec b|^2-(\vec a\cdot\vec b)^2=9\cdot25-100=125$. C: $9+25+2\cdot10=54$. D: $\dfrac{\vec a\cdot\vec b}{|\vec b|}=\dfrac{10}5=2$.</p>`, 'The component along b is the dot product divided by |b|.'),
  MT(3, 'scalar triple product', 'xm3', 'A-q, B-r, C-p, D-s', ['A-q, B-r, C-s, D-p', 'A-r, B-q, C-p, D-s', 'A-q, B-p, C-r, D-s'],
    XR`<p>A: $\hat i\cdot(\hat j\times\hat k)=1$. B: swapping two vectors flips the sign: $-1$. C: two equal vectors: $0$. D: scaling one vector by 2 doubles the product: $6$.</p>`, 'Repeated vector gives 0; swap gives minus.'),
  MT(3, 'section formula', 'xm4', 'A-p, B-s, C-q, D-r', ['A-p, B-s, C-r, D-q', 'A-s, B-p, C-q, D-r', 'A-p, B-q, C-s, D-r'],
    XR`<p>Internal ratio $m:n$: $P=\dfrac{n\vec A+m\vec B}{m+n}$. A ($1:2$): $\dfrac{2(1,2,3)+(7,8,9)}3=(3,4,5)$. B (external $3:1$): $\dfrac{3\vec B-\vec A}{2}=\dfrac{(21,24,27)-(1,2,3)}2=(10,11,12)$. C: midpoint $(4,5,6)$. D ($2:1$): $\dfrac{(1,2,3)+2(7,8,9)}3=(5,6,7)$.</p>`, 'External division subtracts.'),
  MT(3, 'areas and volumes', 'xm8', 'A-s, B-q, C-r, D-p', ['A-s, B-q, C-p, D-r', 'A-q, B-s, C-r, D-p', 'A-s, B-r, C-q, D-p'],
    XR`<p>$[\vec a\ \vec b\ \vec c]=2\begin{vmatrix}3&0\\1&4\end{vmatrix}=24$. A: $24$. B: $\dfrac{24}6=4$. C: $\vec a\times\vec b=6\hat k$, area $6$. D: half of that: $3$.</p>`, 'Triangle = half the parallelogram; tetrahedron = one sixth of the parallelepiped.'),
  // ---- L4 ----
  X(4, 'vector algebra', XR`$\vec a,\vec b,\vec c$ are any vectors. Which statements are always true?`, ['$(\\vec a\\times\\vec b)\\cdot\\vec a=0$', '$|\\vec a\\times\\vec b|\\le|\\vec a||\\vec b|$', '$\\vec a\\times\\vec b=\\vec b\\times\\vec a$', '$(\\vec a\\cdot\\vec b)^2\\le|\\vec a|^2|\\vec b|^2$'], [0, 1, 3],
    XR`<p>A: the cross product is perpendicular to $\vec a$. B: $|\vec a||\vec b|\sin\theta\le|\vec a||\vec b|$. C: false (sign flips). D: Cauchy–Schwarz.</p>`, 'Swapping flips the sign.'),
  X(4, 'linear independence', XR`$\vec a=(1,2,3)$, $\vec b=(2,4,6)$, $\vec c=(0,1,1)$. Which statements are true?`, [XR`$\vec a\parallel\vec b$`, XR`$[\vec a\ \vec b\ \vec c]=0$`, XR`$\vec a,\vec b,\vec c$ are linearly independent`, XR`$\vec a\times\vec b=\vec 0$`], [0, 1, 3],
    XR`<p>$\vec b=2\vec a$, so they are parallel, their cross product is $\vec 0$, and the triple product is $0$ (two parallel vectors). Hence the three are linearly dependent (C false).</p>`, 'Parallel vectors make any triple product zero.'),
  X(4, 'area', XR`$A(1,2,3)$, $B(2,3,4)$, $C(3,4,6)$. Which statements are true?`, [XR`$\vec{AB}\times\vec{AC}=\hat i-\hat j$`, XR`the area of triangle $ABC$ is $\dfrac{\sqrt2}2$`, XR`$A,B,C$ are collinear`, XR`a unit vector perpendicular to the plane $ABC$ is $\pm\dfrac{\hat i-\hat j}{\sqrt2}$`], [0, 1, 3],
    XR`<p>$\vec{AB}=(1,1,1)$, $\vec{AC}=(2,2,3)$. Cross product: $(1\cdot3-1\cdot2,\ 1\cdot2-1\cdot3,\ 1\cdot2-1\cdot2)=(1,-1,0)$. Area $=\dfrac12\sqrt2$. It is non-zero, so the points are not collinear. The normal is $\pm\dfrac{(1,-1,0)}{\sqrt2}$.</p>`, 'A non-zero cross product rules out collinearity.'),
  X(4, 'vector triple product', XR`Which of these expressions equal $\vec a\times(\vec b\times\vec c)$?`, [XR`$(\vec a\cdot\vec c)\vec b-(\vec a\cdot\vec b)\vec c$`, XR`$-(\vec b\times\vec c)\times\vec a$`, XR`$(\vec a\cdot\vec b)\vec c-(\vec a\cdot\vec c)\vec b$`, XR`$(\vec a\times\vec b)\times\vec c$`], [0, 1],
    XR`<p>BAC–CAB rule: $\vec a\times(\vec b\times\vec c)=(\vec a\cdot\vec c)\vec b-(\vec a\cdot\vec b)\vec c$ (A). Since $(\vec b\times\vec c)\times\vec a=-\vec a\times(\vec b\times\vec c)$, B is true. C has the opposite sign. D is generally different (it lies in the plane of $\vec a,\vec b$).</p>`, 'The cross product is not associative.'),
  X(4, 'dot and cross', XR`Which of these always hold?`, [XR`$|\vec a+\vec b|^2+|\vec a-\vec b|^2=2(|\vec a|^2+|\vec b|^2)$`, XR`$(\vec a+\vec b)\cdot(\vec a-\vec b)=|\vec a|^2+|\vec b|^2$`, XR`$|\vec a\times\vec b|^2+(\vec a\cdot\vec b)^2=|\vec a|^2|\vec b|^2$`, XR`$\vec a\cdot\vec b=|\vec a||\vec b|\cos\theta$`], [0, 2, 3],
    XR`<p>A is the parallelogram law. B is false: $(\vec a+\vec b)\cdot(\vec a-\vec b)=|\vec a|^2-|\vec b|^2$. C is Lagrange's identity. D is the definition.</p>`, 'Difference of squares gives a minus sign.'),
  X(4, 'direction cosines', XR`A vector makes angles $\alpha,\beta,\gamma$ with the axes. Which are true?`, [XR`$\cos^2\alpha+\cos^2\beta+\cos^2\gamma=1$`, XR`$\sin^2\alpha+\sin^2\beta+\sin^2\gamma=2$`, XR`$\cos2\alpha+\cos2\beta+\cos2\gamma=-1$`, XR`$\alpha+\beta+\gamma=\pi$`], [0, 1, 2],
    XR`<p>A: the direction cosines are the components of a unit vector. B: $3-1=2$. C: $\cos2x=2\cos^2x-1$, so the sum is $2\cdot1-3=-1$. D is false: for $\hat i$, $0+\frac\pi2+\frac\pi2=\pi$ happens to work, but for $\frac{(1,1,1)}{\sqrt3}$ the sum is $3\cos^{-1}\frac1{\sqrt3}\approx3.08\ne\pi$.</p>`, 'The angles do not add to π in general.'),
  X(5, 'orthonormal vectors', XR`$\vec a,\vec b,\vec c$ are mutually perpendicular unit vectors. Which statements are true?`, [XR`$[\vec a\ \vec b\ \vec c]=\pm1$`, XR`$\vec a\times\vec b=\pm\vec c$`, XR`$|\vec a+\vec b+\vec c|=\sqrt3$`, XR`$\vec a\cdot(\vec b\times\vec c)=0$`], [0, 1, 2],
    XR`<p>The three vectors form a unit cube, so the volume is $1$ (A) and $\vec a\times\vec b$ is a unit vector perpendicular to both, i.e. $\pm\vec c$ (B). $|\vec a+\vec b+\vec c|^2=3$ (C). D is the triple product, which is $\pm1$, not $0$.</p>`, 'Triple product is 0 only for coplanar vectors.'),
  X(5, 'locus', XR`Which vector equations describe a sphere?`, [XR`$|\vec r-\vec c|=5$`, XR`$|\vec r-\vec a|=|\vec r-\vec b|$`, XR`$(\vec r-\vec a)\cdot(\vec r-\vec b)=0$`, XR`$\vec r\times\vec a=\vec 0$`], [0, 2],
    XR`<p>A: points at distance 5 from $\vec c$. B: equidistant from two points: a plane. C: $\angle APB=90^\circ$, the sphere with diameter $AB$. D: $\vec r$ parallel to $\vec a$: a line.</p>`, 'Equal distances from two points give a plane.'),
  X(5, 'linear independence', XR`$\vec a,\vec b,\vec c$ are three non-coplanar vectors. Which statements are true?`, ['they form a basis of space', XR`$[\vec a\ \vec b\ \vec c]\ne0$`, XR`$\vec a\cdot(\vec b\times\vec c)=\vec b\cdot(\vec c\times\vec a)$`, XR`$\vec a\times(\vec b\times\vec c)=(\vec a\times\vec b)\times\vec c$`], [0, 1, 2],
    XR`<p>A, B: non-coplanar means linearly independent, triple product non-zero. C: the triple product is unchanged by cyclic shifts. D is false: the two sides lie in different planes in general.</p>`, 'Cyclic order keeps the sign.'),
  X(5, 'parallelepiped', XR`$\vec a=(1,1,0)$, $\vec b=(0,1,1)$, $\vec c=(1,0,1)$. Which statements are true?`, [XR`$[\vec a\ \vec b\ \vec c]=2$`, 'the three vectors are coplanar', XR`$\vec a\times\vec b=\hat i-\hat j+\hat k$`, 'the tetrahedron on these vectors has volume $\\dfrac13$'], [0, 2, 3],
    XR`<p>$\begin{vmatrix}1&1&0\\0&1&1\\1&0&1\end{vmatrix}=1(1-0)-1(0-1)+0=2$ (A true, B false). $\vec a\times\vec b=(1\cdot1-0\cdot1,\ 0\cdot0-1\cdot1,\ 1\cdot1-1\cdot0)=(1,-1,1)$ (C). Tetrahedron: $\dfrac26=\dfrac13$ (D).</p>`, 'Compute the triple product before judging coplanarity.'),
  I(4, 'counting', XR`How many vectors $x\hat i+y\hat j+z\hat k$ with integer $x,y,z$ have magnitude $3$?`, 30,
    XR`<p>We need $x^2+y^2+z^2=9$. The possibilities are $(\pm3,0,0)$ and permutations: $6$ vectors; $(\pm2,\pm2,\pm1)$ and permutations: $3\cdot8=24$ vectors. Total $30$.</p>`, 'Count the permutations and the sign choices separately.', () => { let c = 0; for (let x = -3; x <= 3; x++) for (let y = -3; y <= 3; y++) for (let z = -3; z <= 3; z++) if (x * x + y * y + z * z === 9) c++; return c; }),
  I(4, 'scalar triple product', XR`$|\vec a|=1$, $|\vec b|=2$, $|\vec c|=3$. Find the greatest possible value of $[\vec a\ \vec b\ \vec c]$.`, 6,
    XR`<p>$|[\vec a\ \vec b\ \vec c]|=|\vec a||\vec b\times\vec c|\,|\cos\phi|\le|\vec a||\vec b||\vec c|=6$, with equality when the three are mutually perpendicular.</p>`, 'The volume of a box is largest when the edges are perpendicular.', () => 1 * 2 * 3),
  I(5, 'vector equations', XR`$\vec a=\hat i+\hat j+\hat k$. A vector $\vec x$ satisfies $\vec a\times\vec x=\hat i-2\hat j+\hat k$ and $\vec a\cdot\vec x=6$. Find $|\vec x|^2$.`, 14,
    XR`<p>Since $\vec a\times\vec x=\vec b$ with $\vec a\cdot\vec b=1-2+1=0$ (consistent). Take $\times\vec a$: $\vec a\times\vec x=\vec b$ gives $\vec x=\dfrac{\vec b\times\vec a}{|\vec a|^2}+\dfrac{\vec a\cdot\vec x}{|\vec a|^2}\vec a$. $\vec b\times\vec a=(-3,0,3)$, $|\vec a|^2=3$, so $\vec x=(-1,0,1)+2(1,1,1)=(1,2,3)$. Check: $\vec a\times\vec x=(1\cdot3-1\cdot2,\ 1\cdot1-1\cdot3,\ 1\cdot2-1\cdot1)=(1,-2,1)$ and $\vec a\cdot\vec x=6$. So $|\vec x|^2=1+4+9=14$.</p>`, 'Use the formula x = (b × a + (a·x) a)/|a|².', () => { const a = [1, 1, 1], b = [1, -2, 1]; const x = add(sc(1 / 3, cross(b, a)), sc(6 / 3, a)); return n2(x); }),
  I(4, 'dot product', XR`$|\vec a|=3$, $|\vec b|=4$, $|\vec c|=5$ and $\vec a+\vec b+\vec c=\vec 0$. Find $\vec a\cdot\vec b+\vec b\cdot\vec c+\vec c\cdot\vec a$.`, -25,
    XR`<p>$0=|\vec a+\vec b+\vec c|^2=9+16+25+2S$, so $S=-25$.</p>`, 'Square the sum of the three vectors.', () => -(9 + 16 + 25) / 2),
  I(5, 'Gram determinant', XR`$|\vec a|=|\vec b|=|\vec c|=2$ and every pair makes an angle of $60^\circ$. Find $[\vec a\ \vec b\ \vec c]^2$.`, 32,
    XR`<p>$[\vec a\ \vec b\ \vec c]^2=\begin{vmatrix}\vec a\cdot\vec a&\vec a\cdot\vec b&\vec a\cdot\vec c\\\vec b\cdot\vec a&\vec b\cdot\vec b&\vec b\cdot\vec c\\\vec c\cdot\vec a&\vec c\cdot\vec b&\vec c\cdot\vec c\end{vmatrix}$. Each diagonal entry is $4$ and each other entry is $2\cdot2\cos60^\circ=2$. So the determinant is $\begin{vmatrix}4&2&2\\2&4&2\\2&2&4\end{vmatrix}=4(16-4)-2(8-4)+2(4-8)=48-8-8=32$.</p>`, 'The squared triple product is the Gram determinant.', () => dot([4, 2, 2], cross([2, 4, 2], [2, 2, 4]))),
  I(5, 'vector equations', XR`Mutually perpendicular vectors $\vec a,\vec b,\vec c$ satisfy $\vec a\times\vec b=\vec c$ and $\vec b\times\vec c=\vec a$, with $|\vec a|=3$. Find $|\vec a|^2+|\vec b|^2+|\vec c|^2$.`, 19,
    XR`<p>$|\vec c|=|\vec a||\vec b|$ and $|\vec a|=|\vec b||\vec c|=|\vec b|^2|\vec a|$ (perpendicular vectors), so $|\vec b|=1$. Then $|\vec c|=|\vec a|=3$. The sum is $9+1+9=19$.</p>`, 'Perpendicularity makes |x × y| = |x||y|.', () => 9 + 1 + 9),
  MT(4, 'conditions on vectors', 'xm5', 'A-p, B-q, C-r, D-s', ['A-p, B-q, C-s, D-r', 'A-q, B-p, C-r, D-s', 'A-r, B-q, C-p, D-s'],
    XR`<p>A: squaring both sides gives $4\vec a\cdot\vec b=0$, so perpendicular. B: equality in the triangle inequality means the same direction. C: the cross product is zero for parallel vectors. D: $|\vec a-\vec b|=|\vec a|+|\vec b|$ is equality in the triangle inequality for $\vec a$ and $-\vec b$, so $\vec a$ and $\vec b$ point in opposite directions.</p>`, 'Equal lengths of the sum and the difference means a right angle, not equal vectors.'),
  MT(4, 'identities', 'xm6', 'A-s, B-r, C-p, D-q', ['A-s, B-r, C-q, D-p', 'A-r, B-s, C-p, D-q', 'A-s, B-p, C-r, D-q'],
    XR`<p>A: BAC minus CAB, $\vec a\times(\vec b\times\vec c)=(\vec a\cdot\vec c)\vec b-(\vec a\cdot\vec b)\vec c$. B: $(\vec a\times\vec b)\times\vec c=(\vec a\cdot\vec c)\vec b-(\vec b\cdot\vec c)\vec a$. C: Lagrange's identity. D: the squared triple product is the Gram determinant of dot products.</p>`, 'The two triple products differ: the middle vector keeps the positive sign in both, but the other term changes.'),
  MT(4, 'cube', 'xm7', 'A-q, B-s, C-p, D-r', ['A-q, B-s, C-r, D-p', 'A-p, B-s, C-q, D-r', 'A-q, B-r, C-p, D-s'],
    XR`<p>A: $|(1,1,1)|=\sqrt3$. B: diagonals $(1,1,1)$ and $(1,1,-1)$ give $\cos\theta=\dfrac{1}{3}$. C: with $(1,0,0)$: $\cos\theta=\dfrac1{\sqrt3}$. D: $(1,1,1)\cdot(1,-1,0)=0$, so $90^\circ$.</p>`, 'Do not confuse 1/3 (two diagonals) with 1/√3 (diagonal and edge).'),
  // ---- passage xp1: corner tetrahedron ----
  PI(3, 'volume', 'xp1', XR`The volume of the tetrahedron $OABC$ is`, 6,
    XR`<p>$\dfrac16\begin{vmatrix}2&0&0\\0&3&0\\0&0&6\end{vmatrix}=\dfrac{36}6=6$.</p>`, 'Divide the triple product by 6.', () => trip([2, 0, 0], [0, 3, 0], [0, 0, 6]) / 6),
  PN(4, 'area', 'xp1', XR`The area of triangle $ABC$ is (2 decimal places)`, 11.22, 0.01,
    XR`<p>$\vec{AB}=(-2,3,0)$, $\vec{AC}=(-2,0,6)$. $\vec{AB}\times\vec{AC}=(18,12,6)$ with magnitude $\sqrt{504}=6\sqrt{14}$. The area is $3\sqrt{14}\approx11.22$.</p>`, 'Half the cross product.', () => nrm(cross([-2, 3, 0], [-2, 0, 6])) / 2),
  PN(5, 'distance to a plane', 'xp1', XR`The perpendicular distance from $O$ to the plane $ABC$ is (4 decimal places)`, 1.6036, 0.0005,
    XR`<p>The volume is also $\dfrac13\cdot(\text{area of }ABC)\cdot h$. So $h=\dfrac{3\cdot6}{3\sqrt{14}}=\dfrac6{\sqrt{14}}\approx1.6036$. (Check with the plane $\dfrac x2+\dfrac y3+\dfrac z6=1$, i.e. $3x+2y+z=6$: distance $\dfrac6{\sqrt{14}}$.)</p>`, 'Equate two expressions for the same volume.', () => 18 / (nrm(cross([-2, 3, 0], [-2, 0, 6])) / 2)),
  // ---- passage xp2: rhombus ----
  PM(4, 'diagonals', 'xp2', XR`The angle between the diagonals $\vec{AC}$ and $\vec{BD}$ is`, XR`$90^\circ$`, [XR`$60^\circ$`, XR`$45^\circ$`, XR`$\cos^{-1}\dfrac49$`],
    XR`<p>$|\vec a|=|\vec b|=3$. $(\vec a+\vec b)\cdot(\vec b-\vec a)=|\vec b|^2-|\vec a|^2=0$. The diagonals of a rhombus are perpendicular. (Check: $(4,3,1)\cdot(0,1,-3)=0$.)</p>`, 'cos⁻¹(4/9) is the angle between the sides.'),
  PI(4, 'area', 'xp2', XR`The square of the area of the parallelogram is`, 65,
    XR`<p>$\vec a\times\vec b=(-5,6,2)$, so $|\vec a\times\vec b|^2=25+36+4=65$. (Lagrange: $81-4^2=65$.)</p>`, 'The cross product, not the dot product, gives the area.', () => n2(cross([2, 1, 2], [2, 2, -1]))),
  PN(4, 'height', 'xp2', XR`The distance between the parallel sides $AB$ and $DC$ is (2 decimal places)`, 2.69, 0.01,
    XR`<p>Area $=\sqrt{65}$ and base $|\vec a|=3$, so the height is $\dfrac{\sqrt{65}}3\approx2.69$.</p>`, 'Height = area ÷ base.', () => Math.sqrt(65) / 3),
  // ---- more L4-5 ----
  N(4, 'distance from a point to a line', XR`The line $L$ passes through $A(1,0,0)$ with direction $\hat i+2\hat j+2\hat k$. Find the distance of $P(2,3,1)$ from $L$ (2 decimal places).`, 1.41, 0.01,
    XR`<p>$\vec{AP}=(1,3,1)$. $\vec{AP}\times\vec d=(4,-1,-1)$, magnitude $\sqrt{18}$. Distance $=\dfrac{\sqrt{18}}{|\vec d|}=\dfrac{\sqrt{18}}3=\sqrt2\approx1.41$.</p>`, 'Divide by the length of the direction vector.', () => nrm(cross([1, 3, 1], [1, 2, 2])) / 3),
  N(4, 'shortest distance between lines', XR`Find the shortest distance between the lines $\vec r=t(\hat i+\hat j)$ and $\vec r=(\hat i+\hat k)+s(\hat j+\hat k)$ (2 decimal places).`, 1.15, 0.01,
    XR`<p>$\vec n=(1,1,0)\times(0,1,1)=(1,-1,1)$, $|\vec n|=\sqrt3$. The vector between points is $(1,0,1)$, and $(1,0,1)\cdot\vec n=2$. Distance $=\dfrac2{\sqrt3}\approx1.15$.</p>`, 'Project the joining vector on the common perpendicular.', () => Math.abs(dot([1, 0, 1], cross([1, 1, 0], [0, 1, 1]))) / nrm(cross([1, 1, 0], [0, 1, 1]))),
  N(5, 'minimum magnitude', XR`$\vec a=\hat i+2\hat j+3\hat k$ and $\vec b=2\hat i-\hat j+\hat k$. As $t$ varies over the reals, find the least value of $|\vec a+t\vec b|$ (2 decimal places).`, 3.54, 0.01,
    XR`<p>$|\vec a+t\vec b|^2=14+2t(\vec a\cdot\vec b)+6t^2=14+6t+6t^2$, least at $t=-\dfrac12$: $14-3+1.5=12.5$. The least value is $\sqrt{12.5}\approx3.54$. (Same as $|\vec a\times\vec b|/|\vec b|=5\sqrt3/\sqrt6$.)</p>`, 'The least length is the perpendicular distance.', () => nrm(cross([1, 2, 3], [2, -1, 1])) / nrm([2, -1, 1])),
  N(5, 'diagonals', XR`The sides of a parallelogram are $\vec a=\hat i+2\hat j+2\hat k$ and $\vec b=2\hat i+3\hat j+6\hat k$. Find the acute angle between its diagonals in degrees (2 decimal places).`, 17.75, 0.01,
    XR`<p>Diagonals: $\vec a+\vec b=(3,5,8)$ and $\vec b-\vec a=(1,1,4)$. Dot product $=3+5+32=40$, lengths $\sqrt{98}$ and $\sqrt{18}$, whose product is $42$. $\cos\theta=\dfrac{40}{42}$, so $\theta\approx17.75^\circ$.</p>`, 'The diagonals are the sum and difference.', () => deg(Math.acos(40 / Math.sqrt(98 * 18)))),
  I(4, 'projection', XR`The scalar projection of $\lambda\hat i+\hat j+2\hat k$ on $2\hat i-2\hat j+\hat k$ is $2$. Find $\lambda$.`, 3,
    XR`<p>$\dfrac{2\lambda-2+2}{3}=2$, so $\lambda=3$.</p>`, 'Divide by the length of the vector projected on.', () => (2 * 3 - 2 + 2) / 3 === 2 ? 3 : NaN),
  I(4, 'coplanar vectors', XR`$\vec a=\hat i+k\hat j+2\hat k$, $\vec b=2\hat i-\hat j+\hat k$ and $\vec c=\hat i+2\hat j+k\hat k$ are coplanar. Find the sum of the squares of all possible values of $k$.`, 8,
    XR`<p>$\begin{vmatrix}1&k&2\\2&-1&1\\1&2&k\end{vmatrix}=1(-k-2)-k(2k-1)+2(4+1)=-2k^2+8=0$, so $k=\pm2$. The sum of squares is $4+4=8$.</p>`, 'There are two values of k.', () => [-2, 2].reduce((s, k) => { const d = trip([1, k, 2], [2, -1, 1], [1, 2, k]); return d === 0 ? s + k * k : NaN; }, 0)),
  I(4, 'coplanar points', XR`The points $A(0,1,2)$, $B(3,\lambda,1)$, $C(1,2,0)$ and $D(2,0,1)$ are coplanar. Find $\lambda$.`, -1,
    XR`<p>$\vec{AB}=(3,\lambda-1,-1)$, $\vec{AC}=(1,1,-2)$, $\vec{AD}=(2,-1,-1)$. $\begin{vmatrix}3&\lambda-1&-1\\1&1&-2\\2&-1&-1\end{vmatrix}=3(-1-2)-(\lambda-1)(-1+4)-1(-1-2)=-9-3\lambda+3+3=-3\lambda-3=0$. So $\lambda=-1$.</p>`, 'Use three edge vectors from the same point.', () => trip([3, -2, -1], [1, 1, -2], [2, -1, -1]) === 0 ? -1 : NaN),
  I(4, 'angle between vectors', XR`$|\vec a|=|\vec b|=1$ and $(\vec a+2\vec b)\perp(5\vec a-4\vec b)$. Find the angle between $\vec a$ and $\vec b$ in degrees.`, 60,
    XR`<p>$(\vec a+2\vec b)\cdot(5\vec a-4\vec b)=5-4\vec a\cdot\vec b+10\vec a\cdot\vec b-8=6\vec a\cdot\vec b-3=0$, so $\cos\theta=\dfrac12$ and $\theta=60^\circ$.</p>`, 'Expand the dot product fully; the cross terms add.', () => Math.round(deg(Math.acos(0.5)))),
  I(4, 'unit vectors', XR`$\vec a,\vec b,\vec c$ are unit vectors with $\vec a+\vec b+\vec c=\vec 0$. Find $|\vec a-\vec b|^2+|\vec b-\vec c|^2+|\vec c-\vec a|^2$.`, 9,
    XR`<p>$0=3+2S$ so $S=\vec a\cdot\vec b+\vec b\cdot\vec c+\vec c\cdot\vec a=-\dfrac32$. The required sum is $3\cdot2-2S=6+3=9$.</p>`, 'Each |x − y|² is 2 − 2 x·y.', () => 6 - 2 * (-(3) / 2)),
  I(5, 'vector triple product', XR`$\vec a=(1,2,3)$, $\vec b=(2,0,1)$ and $\vec c=(0,1,4)$. Find $|\vec a\times(\vec b\times\vec c)|^2$.`, 845,
    XR`<p>$\vec a\times(\vec b\times\vec c)=(\vec a\cdot\vec c)\vec b-(\vec a\cdot\vec b)\vec c=14(2,0,1)-5(0,1,4)=(28,-5,-6)$. Its squared length is $784+25+36=845$.</p>`, 'Use BAC − CAB with the correct pairs of dot products.', () => n2(cross([1, 2, 3], cross([2, 0, 1], [0, 1, 4])))),
  I(5, 'counting', XR`How many vectors $x\hat i+y\hat j+z\hat k$ with integer $x,y,z$ have magnitude $\sqrt{14}$?`, 48,
    XR`<p>$x^2+y^2+z^2=14$ only as $9+4+1$. Choose which coordinate is $\pm3$, $\pm2$, $\pm1$: $3!=6$ arrangements and $2^3=8$ sign choices, so $48$.</p>`, 'Count arrangements and signs.', () => { let c = 0; for (let x = -4; x <= 4; x++) for (let y = -4; y <= 4; y++) for (let z = -4; z <= 4; z++) if (x * x + y * y + z * z === 14) c++; return c; }),
  X(4, 'square', XR`$\vec a=(1,2,2)$ and $\vec b=(2,1,-2)$ are adjacent sides of a parallelogram. Which statements are true?`, [XR`$\vec a\perp\vec b$`, XR`$|\vec a|=|\vec b|=3$`, XR`$|\vec a\times\vec b|=9$`, XR`$|\vec a+\vec b|=6$`], [0, 1, 2],
    XR`<p>$\vec a\cdot\vec b=2+2-4=0$, $|\vec a|=|\vec b|=3$, so it is a square of side $3$. The area is $9=|\vec a\times\vec b|$ (the cross product is $(-6,6,-3)$). The diagonal is $\sqrt{18}=3\sqrt2$, not $6$: $|\vec a+\vec b|=|(3,3,0)|$.</p>`, 'The diagonal of a square of side s is s√2.'),
  X(5, 'lines in space', XR`Line $L_1$: $\vec r=(1,2,3)+t(1,1,1)$. Line $L_2$: $\vec r=(2,3,4)+s(1,2,3)$. Which statements are true?`, ['they meet at the point $(2,3,4)$', 'they are skew', 'they are perpendicular', XR`the plane containing both has normal $\parallel(1,-2,1)$`], [0, 3],
    XR`<p>At $t=1$, $L_1$ is at $(2,3,4)$, which is on $L_2$ at $s=0$. They meet, so they are not skew. $\cos\theta=\dfrac{1+2+3}{\sqrt3\sqrt{14}}\ne0$, so not perpendicular. Normal: $(1,1,1)\times(1,2,3)=(1,-2,1)$.</p>`, 'Meeting means not skew.'),
  A(4, 'coplanar vectors', XR`The vectors $(1,2,3)$, $(2,4,6)$ and $(5,1,0)$ are coplanar.`, XR`If two of three vectors are parallel, the three vectors are coplanar.`, 0,
    XR`<p>$(2,4,6)=2(1,2,3)$, so the triple product is $0$. R explains it: parallel vectors span at most a plane together with any third vector.</p>`, 'The determinant has proportional rows.'),
  A(5, 'cross and dot together', XR`If $\vec a\ne\vec 0$, $\vec a\times\vec b=\vec a\times\vec c$ and $\vec a\cdot\vec b=\vec a\cdot\vec c$, then $\vec b=\vec c$.`, XR`$\vec b-\vec c$ would be both parallel and perpendicular to $\vec a$.`, 0,
    XR`<p>$\vec a\times(\vec b-\vec c)=\vec 0$ and $\vec a\cdot(\vec b-\vec c)=0$. A non-zero vector $\vec d=\vec b-\vec c$ cannot be both parallel and perpendicular to $\vec a\neq\vec 0$, so $\vec d=\vec 0$. Both true, and R is the reason.</p>`, 'One condition alone is not enough; both are needed.'),
  S(4, 'vector triple product', XR`$\vec a\times(\vec b\times\vec c)=(\vec a\times\vec b)\times\vec c$ for all vectors.`, XR`The cross product is not associative.`, 2,
    XR`<p>Take $\vec a=\vec b=\hat i$, $\vec c=\hat j$. Then $\vec a\times(\vec b\times\vec c)=\hat i\times\hat k=-\hat j$ but $(\vec a\times\vec b)\times\vec c=\vec 0$. So I is false and II is true.</p>`, 'Test with unit vectors.'),
  SC(4, 'vector algebra', [XR`$[\vec a\ \vec b\ \vec c]=0$ if two of the vectors are equal.`, XR`$\vec a\times\vec b=\vec a\times\vec c$ implies $\vec b=\vec c$.`, XR`$|\vec a+\vec b|\ge\big||\vec a|-|\vec b|\big|$.`, XR`$\vec a\cdot\vec b=0$ implies $\vec a=\vec 0$ or $\vec b=\vec 0$.`], '2', ['1', '3', '4'],
    XR`<p>(1) true. (2) false: $\vec b-\vec c$ may be parallel to $\vec a$. (3) true (triangle inequality). (4) false: perpendicular vectors are not zero. Two are correct.</p>`, 'Perpendicular is not the same as zero.'),
  SC(5, 'vector identities', [XR`$|\vec a\times\vec b|=|\vec a||\vec b|$ exactly when $\vec a\perp\vec b$.`, XR`$(\vec a\times\vec b)\cdot(\vec c\times\vec d)=(\vec a\cdot\vec c)(\vec b\cdot\vec d)-(\vec a\cdot\vec d)(\vec b\cdot\vec c)$.`, XR`$\vec a\times(\vec b\times\vec c)+\vec b\times(\vec c\times\vec a)+\vec c\times(\vec a\times\vec b)=\vec 0$.`, XR`$[\vec a\times\vec b\ \ \vec b\times\vec c\ \ \vec c\times\vec a]=[\vec a\ \vec b\ \vec c]$.`], '3', ['1', '2', '4'],
    XR`<p>(1) true: $\sin\theta=1$ (for non-zero vectors). (2) true: Binet–Cauchy. (3) true: the Jacobi identity (expand each by BAC–CAB and everything cancels). (4) false: the left side equals $[\vec a\ \vec b\ \vec c]^2$. Three are correct.</p>`, 'The reciprocal-style triple product gives the square.'),
);
items.push(
  N(4, 'volume', XR`The vertices of a tetrahedron are $(1,1,1)$, $(2,3,1)$, $(4,2,3)$ and $(3,5,6)$. Find its volume (2 decimal places).`, 4.17, 0.01,
    XR`<p>Edges from $(1,1,1)$: $(1,2,0)$, $(3,1,2)$, $(2,4,5)$. $\begin{vmatrix}1&2&0\\3&1&2\\2&4&5\end{vmatrix}=1(5-8)-2(15-4)+0=-25$. Volume $=\dfrac{25}6\approx4.17$.</p>`, 'Take edges from one vertex and divide by 6.', () => Math.abs(trip([1, 2, 0], [3, 1, 2], [2, 4, 5])) / 6),
  N(5, 'height of a parallelepiped', XR`A parallelepiped has edges $\vec a=(1,2,3)$, $\vec b=(2,0,1)$ and $\vec c=(0,1,4)$ from one vertex. Find the height of the solid when the face spanned by $\vec a$ and $\vec b$ is the base (2 decimal places).`, 1.64, 0.01,
    XR`<p>$\vec a\times\vec b=(2,5,-4)$, magnitude $\sqrt{45}$. The volume is $|[\vec a\ \vec b\ \vec c]|=11$. Height $=\dfrac{11}{\sqrt{45}}\approx1.64$.</p>`, 'Volume divided by base area.', () => Math.abs(trip([1, 2, 3], [2, 0, 1], [0, 1, 4])) / nrm(cross([1, 2, 3], [2, 0, 1]))),
);
const vv = (v) => `(${v.join(', ')})`;
gens.push(
  GX('ve-g26', 4, 'nat', 'integer', 'Gram form', (rng) => {
    const P = int(rng, 2, 5), Q = int(rng, 2, 5), d = int(rng, -3, 3), m = int(rng, 1, 4); let n = int(rng, -4, 4); if (n === 0) n = 2;
    const ans = m * m * P * P + n * n * Q * Q + 2 * m * n * d;
    const co = (k) => (Math.abs(k) === 1 ? '' : Math.abs(k));
    return { P, Q, d, m, n, answer: ans, tol: 0, q: XR`$|\vec a|=${P}$, $|\vec b|=${Q}$ and $\vec a\cdot\vec b=${d}$. Find $|${co(m)}\vec a${n < 0 ? '-' : '+'}${co(n)}\vec b|^2$.`,
      sol: XR`<p>$|m\vec a+n\vec b|^2=m^2|\vec a|^2+n^2|\vec b|^2+2mn\,\vec a\cdot\vec b$ with $m=${m}$, $n=${n}$: $${m * m}\cdot${P * P}+${n * n}\cdot${Q * Q}+2(${m * n})(${d})=${ans}$.</p>`, trap: 'The cross term has the sign of m times n.' };
  }, (p) => { const G = [[p.P * p.P, p.d], [p.d, p.Q * p.Q]]; const x = [p.m, p.n]; return x[0] * (G[0][0] * x[0] + G[0][1] * x[1]) + x[1] * (G[1][0] * x[0] + G[1][1] * x[1]); }),

  GX('ve-g27', 4, 'mcq', 'single', 'distance from a point to a line', (rng) => {
    let A, d, P, cr, AP; do { A = rv(rng, -3, 3); d = rv(rng, -3, 3); P = rv(rng, -3, 3); AP = sub(P, A); cr = cross(AP, d); } while (n2(cr) === 0);
    const ok = frac(n2(cr), n2(d));
    const cands = [frac(dot(AP, d) ** 2, n2(d)), frac(n2(cr), n2(AP)), `${n2(cr)}`, `${n2(AP)}`, frac(n2(cr), n2(d) + 1), frac(n2(cr), 2 * n2(d))];
    const wr = [...new Set(cands)].filter((x) => x !== ok).slice(0, 3);
    const { options, answer } = shuffleOpts(rng, `$${ok}$`, wr.map((x) => `$${x}$`));
    return { A, d, P, options, answer, q: XR`The square of the distance of $P${vv(P)}$ from the line through $A${vv(A)}$ with direction $\vec d=${vt(d)}$ is`,
      sol: XR`<p>$\overrightarrow{AP}=${vt(AP)}$. $\overrightarrow{AP}\times\vec d=${vt(cr)}$, with squared length $${n2(cr)}$. Also $|\vec d|^2=${n2(d)}$. The squared distance is $\dfrac{|\overrightarrow{AP}\times\vec d|^2}{|\vec d|^2}=${ok}$.</p>`, trap: 'Divide by the squared length of the direction vector.' };
  }, (p) => { const AP = sub(p.P, p.A); const e = frac(n2(AP) * n2(p.d) - dot(AP, p.d) ** 2, n2(p.d)); return p.options[p.answer] === `$${e}$` ? p.answer : -1; }),

  GX('ve-g28', 5, 'nat', 'numeric', 'minimum magnitude', (rng) => {
    let a, b; do { a = rv(rng, -4, 4); b = rv(rng, -4, 4); } while (n2(cross(a, b)) === 0);
    const val = Math.sqrt(n2(a) - dot(a, b) ** 2 / n2(b));
    return { a, b, answer: +val.toFixed(2), tol: 0.01, q: XR`$\vec a=${vt(a)}$ and $\vec b=${vt(b)}$. As $t$ runs over the reals, find the least value of $|\vec a+t\vec b|$ (2 decimal places).`,
      sol: XR`<p>$|\vec a+t\vec b|^2=${n2(a)}+${2 * dot(a, b)}t+${n2(b)}t^2$ is least at $t=-\dfrac{\vec a\cdot\vec b}{|\vec b|^2}=-\dfrac{${dot(a, b)}}{${n2(b)}}$. The least value is $\sqrt{|\vec a|^2-\dfrac{(\vec a\cdot\vec b)^2}{|\vec b|^2}}\approx${val.toFixed(2)}$.</p>`, trap: 'It is the distance from the origin to the line, not |a|.' };
  }, (p) => { let lo = -200, hi = 200; const f = (t) => nrm(add(p.a, sc(t, p.b))); for (let i = 0; i < 200; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (f(m1) < f(m2)) hi = m2; else lo = m1; } return f((lo + hi) / 2); }),

  GX('ve-g29', 4, 'nat', 'integer', 'coplanar vectors', (rng) => {
    let a, b, c, j, lam, tries = 0;
    for (;;) { b = rv(rng, -3, 3); c = rv(rng, -3, 3); a = rv(rng, -3, 3); j = int(rng, 0, 2); const a0 = [...a]; a0[j] = 0; const D0 = trip(a0, b, c), C = cross(b, c)[j]; if (C !== 0 && D0 % C === 0 && Math.abs(D0 / C) <= 9 && ++tries >= 0) { lam = -D0 / C; if (lam === 0) lam = 0; break; } }
    const shown = a.map((x, i) => (i === j ? '\\lambda' : x));
    return { a, b, c, j, answer: lam, tol: 0, q: XR`The vectors $\vec a=(${shown.join(',')})$, $\vec b=${vv(b).replace(/ /g, '')}$ and $\vec c=${vv(c).replace(/ /g, '')}$ are coplanar. Find $\lambda$.`,
      sol: XR`<p>Coplanar means $[\vec a\ \vec b\ \vec c]=0$. The determinant is linear in $\lambda$: it equals $${trip((() => { const t = [...a]; t[j] = 0; return t; })(), b, c)}+${cross(b, c)[j]}\lambda$. Setting it to $0$ gives $\lambda=${lam}$.</p>`, trap: 'Expand with the row containing lambda; the other terms are constants.' };
  }, (p) => { const t = [...p.a]; t[p.j] = p.answer; return trip(t, p.b, p.c) === 0 ? p.answer : NaN; }),

  GX('ve-g30', 5, 'nat', 'integer', 'integer vectors', (rng) => {
    const T = { 3: 8, 5: 24, 6: 24, 9: 30, 11: 24, 14: 48 }; const N = choose(rng, [3, 5, 6, 9, 11, 14]);
    return { N, answer: T[N], tol: 0, q: XR`How many vectors $x\hat i+y\hat j+z\hat k$ with integer $x,y,z$ have $|\vec v|^2=${N}$?`,
      sol: XR`<p>List the ways to write ${N} as a sum of three squares, then count arrangements and signs: the answer is $${T[N]}$.</p>`, trap: 'Count each arrangement and each sign choice (a zero coordinate has one sign).' };
  }, (p) => { let c = 0; for (let x = -4; x <= 4; x++) for (let y = -4; y <= 4; y++) for (let z = -4; z <= 4; z++) if (x * x + y * y + z * z === p.N) c++; return c; }),

  GX('ve-g31', 3, 'mcq', 'single', 'unit vector along a cross product', (rng) => {
    let a, b, cr, m, tries = 0;
    do { a = rv(rng, -3, 3); b = rv(rng, -3, 3); cr = cross(a, b); m = Math.round(nrm(cr)); } while ((n2(cr) === 0 || m * m !== n2(cr) || m < 2) && ++tries < 100000);
    const tex = (v) => XR`\dfrac{${vt(v)}}{${m}}`;
    const ok = tex(cr);
    const wr = [...new Set([tex(sc(-1, cr)), XR`\dfrac{${vt(cr)}}{${m * m}}`, XR`\dfrac{${vt(cr)}}{${m + 1}}`, XR`\dfrac{${vt(cr)}}{${2 * m}}`])].filter((x) => x !== ok).slice(0, 3);
    const { options, answer } = shuffleOpts(rng, `$${ok}$`, wr.map((x) => `$${x}$`));
    return { a, b, m, options, answer, q: XR`The unit vector in the direction of $(${vt(a)})\times(${vt(b)})$ is`,
      sol: XR`<p>$\vec a\times\vec b=${vt(cr)}$, with magnitude $\sqrt{${n2(cr)}}=${m}$. Divide by it: $${ok}$.</p>`, trap: 'The unit vector needs division by the magnitude; b × a points the other way.' };
  }, (p) => { const cr = [p.a[1] * p.b[2] - p.a[2] * p.b[1], p.a[2] * p.b[0] - p.a[0] * p.b[2], p.a[0] * p.b[1] - p.a[1] * p.b[0]]; const u = sc(1 / p.m, cr); const e = XR`\dfrac{${vt(cr)}}{${p.m}}`; return Math.abs(nrm(u) - 1) < 1e-9 && p.options[p.answer] === `$${e}$` ? p.answer : -1; }),

  GX('ve-g32', 4, 'nat', 'numeric', 'shortest distance between lines', (rng) => {
    let A1, d1, A2, d2, n, val; do { A1 = rv(rng, -3, 3); d1 = rv(rng, -3, 3); A2 = rv(rng, -3, 3); d2 = rv(rng, -3, 3); n = cross(d1, d2); val = n2(n) === 0 ? 0 : Math.abs(dot(sub(A2, A1), n)) / nrm(n); } while (val < 0.3);
    return { A1, d1, A2, d2, answer: +val.toFixed(2), tol: 0.01, q: XR`Find the shortest distance between the lines $\vec r=${vt(A1)}+t(${vt(d1)})$ and $\vec r=${vt(A2)}+s(${vt(d2)})$ (2 decimal places).`,
      sol: XR`<p>$\vec n=\vec d_1\times\vec d_2=${vt(n)}$, $|\vec n|=\sqrt{${n2(n)}}$. $\overrightarrow{A_1A_2}=${vt(sub(A2, A1))}$, and $\overrightarrow{A_1A_2}\cdot\vec n=${dot(sub(A2, A1), n)}$. Distance $=\dfrac{${Math.abs(dot(sub(A2, A1), n))}}{\sqrt{${n2(n)}}}\approx${val.toFixed(2)}$.</p>`, trap: 'Use the absolute value of the projection on the common perpendicular.' };
  }, (p) => { const w = sub(p.A1, p.A2); const a = n2(p.d1), b = -dot(p.d1, p.d2), c = n2(p.d2); const r1 = -dot(w, p.d1), r2 = dot(w, p.d2); const det = a * c - b * b; const t = (r1 * c - b * r2) / det, s = (a * r2 - b * r1) / det; return nrm(add(w, sub(sc(t, p.d1), sc(s, p.d2)))); }),

  GX('ve-g33', 4, 'mcq', 'single', 'tetrahedron volume', (rng) => {
    let a, b, c, D; do { a = rv(rng, -3, 3); b = rv(rng, -3, 3); c = rv(rng, -3, 3); D = Math.abs(trip(a, b, c)); } while (D === 0);
    const ok = frac(D, 6); const wr = [frac(D, 3), `${D}`, frac(D, 2), frac(D, 12)];
    const { options, answer } = shuffleOpts(rng, `$${ok}$`, wr.map((x) => `$${x}$`));
    return { a, b, c, D, options, answer, q: XR`The volume of the tetrahedron with one vertex at the origin and the other three at $${vv(a)}$, $${vv(b)}$ and $${vv(c)}$ is`,
      sol: XR`<p>$[\vec a\ \vec b\ \vec c]=${trip(a, b, c)}$. Volume of a tetrahedron $=\dfrac16|[\vec a\ \vec b\ \vec c]|=${ok}$.</p>`, trap: 'Divide by 6; dividing by 3 is for a pyramid with a parallelogram base.' };
  }, (p) => { const [x, y, z] = [p.a, p.b, p.c]; const det = x[0] * (y[1] * z[2] - y[2] * z[1]) - y[0] * (x[1] * z[2] - x[2] * z[1]) + z[0] * (x[1] * y[2] - x[2] * y[1]); return p.options[p.answer] === `$${frac(Math.abs(det), 6)}$` ? p.answer : -1; }),

  GX('ve-g34', 5, 'nat', 'integer', 'vectors summing to zero', (rng) => {
    let P, Q, R2; do { P = int(rng, 2, 9); Q = int(rng, 2, 9); R2 = int(rng, 2, 9); } while ((P * P + Q * Q + R2 * R2) % 2 !== 0 || R2 >= P + Q || P >= Q + R2 || Q >= P + R2);
    const ans = -(P * P + Q * Q + R2 * R2) / 2;
    return { P, Q, R2, answer: ans, tol: 0, q: XR`$\vec a,\vec b,\vec c$ are vectors with $|\vec a|=${P}$, $|\vec b|=${Q}$, $|\vec c|=${R2}$ and $\vec a+\vec b+\vec c=\vec 0$. Find $\vec a\cdot\vec b+\vec b\cdot\vec c+\vec c\cdot\vec a$.`,
      sol: XR`<p>$0=|\vec a+\vec b+\vec c|^2=${P * P}+${Q * Q}+${R2 * R2}+2S$, so $S=${ans}$.</p>`, trap: 'Square the sum; do not look for angles.' };
  }, (p) => { const ab = (p.R2 ** 2 - p.P ** 2 - p.Q ** 2) / 2, bc = (p.P ** 2 - p.Q ** 2 - p.R2 ** 2) / 2, ca = (p.Q ** 2 - p.R2 ** 2 - p.P ** 2) / 2; return ab + bc + ca; }),
);

}
// ==XP-END
export default { topic: 'vectors', groups, items, gens };
