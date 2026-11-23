// Three-dimensional geometry (Plus Two entrance, Mathematics, Class 12). Original fibub questions.
// Every numeric answer was checked in code: each `calc` recomputes the answer with vector formulas (cross and dot
// products) or by solving the geometry directly, and the templates' verify() recompute their answers another way.
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
const POS = [3, 1, 0, 2, 2, 0, 3, 1, 1, 3, 2, 0, 0, 2, 1, 3];
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
const GEXS = (level, type) => [...EXS[level], ...(type === 'mcq' && level <= 3 ? ['cuet'] : [])];
/** small clean-ups of generated TeX: "+-" to "-", "--" to "+", "1x" to "x", "x^{1}" to "x", "+0x" removed */
const tidy = (s) => (typeof s !== 'string' ? s : s
  .replace(/\+-/g, '-')
  .replace(/([\d})])--/g, '$1+')
  .replace(/\+0[xyz]\b/g, '')
  .replace(/\^\{1\}/g, '')
  .replace(/(?<![\d._\w\\])1(?=[xyz]\b|e\^)/g, ''));
const tidyItem = (it) => { for (const k of ['q', 'sol']) it[k] = tidy(it[k]); if (Array.isArray(it.options)) it.options = it.options.map(tidy); return it; };
const RETRY = { retry: true };
/** templates may `throw RETRY` when the random numbers are unsuitable; make() is then called again */
const retrying = (make) => (rng) => { for (let i = 0; i < 200; i++) { try { return tidyItem(make(rng)); } catch (e) { if (e !== RETRY) throw e; } } throw new Error('too many retries'); };
const gen = (id, level, type, format, sub, make, verify) => ({ id, type, format, level, exams: GEXS(level, type), sub, make: retrying(make), ...(verify ? { verify } : {}) });

// ---------- vector helpers (used for calc and verify, and to build text) ----------
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const vsub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const vadd = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const vsc = (k, a) => [k * a[0], k * a[1], k * a[2]];
const nrm = (a) => Math.sqrt(dot(a, a));
const deg = (r) => (r * 180) / Math.PI;
const sqrt = Math.sqrt, abs = Math.abs, acos = Math.acos, asin = Math.asin;
const r4 = (x) => +x.toFixed(4);
const r2 = (x) => +x.toFixed(2);
const TWOD = ' (2 decimal places)';
const D = (level, sub, q, answer, sol, trap, more = {}) => N(level, sub, `${q}${TWOD}`, answer, 0.01, sol, trap, more);
const PD = (level, sub, group, q, answer, sol, trap, more = {}) => PN(level, sub, group, `${q}${TWOD}`, answer, 0.01, sol, trap, more);
const gcd = (a, b) => { a = abs(a); b = abs(b); while (b) [a, b] = [b, a % b]; return a; };
const gcd3 = (v) => gcd(gcd(v[0], v[1]), v[2]) || 1;
/** distance of point p from plane n.r = d */
const pdist = (p, n, d) => abs(dot(n, p) - d) / nrm(n);
/** shortest distance between lines a1+l b1 and a2+m b2 (skew or parallel) */
const lldist = (a1, b1, a2, b2) => { const c = cross(b1, b2); return nrm(c) < 1e-9 ? nrm(cross(vsub(a2, a1), b1)) / nrm(b1) : abs(dot(vsub(a2, a1), c)) / nrm(c); };

// ---------- text helpers ----------
const XYZ = ['x', 'y', 'z'], IJK = ['\\hat i', '\\hat j', '\\hat k'];
/** linear combination text like 2x-y+3z (zero terms left out) */
const lc = (c, vars = XYZ) => { let s = ''; c.forEach((k, i) => { if (k === 0) return; const a = abs(k); s += (k < 0 ? '-' : s ? '+' : '') + (a === 1 ? '' : a) + vars[i]; }); return s || '0'; };
const vec = (v) => lc(v, IJK);
const pt = (v) => `(${v.join(',')})`;
const peq = (n, d) => `${lc(n)}=${d}`;
const peq0 = (n, d) => `${lc(n)}${d === 0 ? '' : d > 0 ? '-' + d : '+' + -d}=0`;
const symLine = (p, dr) => XYZ.map((nm, i) => `\\dfrac{${p[i] === 0 ? nm : `${nm}${p[i] > 0 ? '-' : '+'}${abs(p[i])}`}}{${dr[i]}}`).join('=');
const vecLine = (a, b) => `\\vec r=(${vec(a)})+\\lambda(${vec(b)})`;
/** reduced fraction a/b as TeX */
const fr = (a, b) => { const g = gcd(a, b) || 1; let n = a / g, d = b / g; if (d < 0) { n = -n; d = -d; } return d === 1 ? String(n) : n < 0 ? `-\\dfrac{${-n}}{${d}}` : `\\dfrac{${n}}{${d}}`; };
const isSq = (n) => Number.isInteger(sqrt(n));
/** a over the square root of N as TeX (rational when N is a perfect square) */
const fsq = (a, Nn) => (isSq(Nn) ? fr(a, sqrt(Nn)) : a === 0 ? '0' : a < 0 ? `-\\dfrac{${-a}}{\\sqrt{${Nn}}}` : `\\dfrac{${a}}{\\sqrt{${Nn}}}`);
/** direction cosines text of a direction-ratio triple, e.g. (\dfrac27,-\dfrac37,\dfrac67) */
const dcs = (v) => { const g = gcd3(v), u = v.map((t) => t / g), Nn = dot(u, u); return `\\left(${u.map((t) => fsq(t, Nn)).join(',')}\\right)`; };
const rv = (rng, lo, hi) => [int(rng, lo, hi), int(rng, lo, hi), int(rng, lo, hi)];
const nz = (rng, lo, hi) => { let v; do v = rv(rng, lo, hi); while (v.some((t) => t === 0)); return v; };

const groups = {
  m1: {
    title: 'Distance of the origin from a plane',
    passage: R`<p>Match each plane in List I with the distance of the origin from it in List II.</p>`,
    list1: ['A. $2x-3y+6z=21$', 'B. $x+2y+2z=6$', 'C. $6x+2y+3z=7$', 'D. $2x+y-2z=12$'],
    list2: ['p. $1$', 'q. $2$', 'r. $3$', 's. $4$'],
  },
  m2: {
    title: 'Direction cosines',
    passage: R`<p>For each set of direction ratios in List I, match the direction cosine $l$ (with the $x$-axis, positive choice) in List II.</p>`,
    list1: ['A. $(3,4,12)$', 'B. $(1,1,1)$', 'C. $(2,3,6)$', 'D. $(1,0,0)$'],
    list2: [R`p. $\dfrac1{\sqrt3}$`, R`q. $\dfrac3{13}$`, R`r. $\dfrac27$`, 's. $1$'],
  },
  m3: {
    title: 'Two lines',
    passage: R`<p>Match each pair of lines in List I with how they sit in space in List II.</p>`,
    list1: [
      R`A. $\dfrac x1=\dfrac y2=\dfrac z3$ and $\dfrac{x-2}1=\dfrac{y-1}2=\dfrac{z-1}3$`,
      R`B. $\dfrac{x-2}1=\dfrac{y-3}2=\dfrac{z-1}{-1}$ and $\dfrac{x-2}2=\dfrac{y-3}{-1}=\dfrac{z-1}3$`,
      R`C. $\vec r=(1,1,0)+\lambda(2,-1,1)$ and $\vec r=(2,1,-1)+\mu(3,-5,2)$`,
      R`D. $\dfrac x1=\dfrac y1=\dfrac z1$ and $\vec r=(2,2,2)+\mu(3,3,3)$`,
    ],
    list2: ['p. parallel and distinct', 'q. skew', 'r. intersecting at one point', 's. the same line'],
  },
  m4: {
    title: 'Planes and their equations',
    passage: R`<p>Match each plane in List I with its equation in List II.</p>`,
    list1: ['A. through $(1,0,0)$, $(0,2,0)$ and $(0,0,3)$', 'B. through the origin with normal direction $(1,2,2)$', 'C. parallel to the $xy$-plane, 4 units above it', 'D. perpendicular to the $x$-axis, through $(5,2,3)$'],
    list2: ['p. $x=5$', 'q. $6x+3y+2z=6$', 'r. $x+2y+2z=0$', 's. $z=4$'],
  },
  p1: {
    title: 'Passage: shortest distance between skew lines',
    passage: R`<p>Two lines are $L_1:\ \vec r=(1,1,0)+\lambda(2,-1,1)$ and $L_2:\ \vec r=(2,1,-1)+\mu(3,-5,2)$. Let $\vec b_1=(2,-1,1)$, $\vec b_2=(3,-5,2)$, $\vec a_1=(1,1,0)$, $\vec a_2=(2,1,-1)$.</p>`,
  },
  p2: {
    title: 'Passage: a plane through three points',
    passage: R`<p>The plane $\Pi$ passes through $A(1,0,0)$, $B(0,2,0)$ and $C(0,0,3)$.</p>`,
  },
  p3: {
    title: 'Passage: a line parallel to a plane',
    passage: R`<p>Let $L$ be the line through $A(1,2,3)$ with direction ratios $(2,1,-2)$, and let $\Pi$ be the plane $x+2y+2z=29$.</p>`,
  },
  p4: {
    title: 'Passage: foot of the perpendicular',
    passage: R`<p>Let $P=(4,4,6)$ and let $L$ be the line $\vec r=(0,1,2)+\lambda(1,2,2)$. Let $F$ be the foot of the perpendicular from $P$ to $L$.</p>`,
  },
};

const items = [];
const add = (...xs) => items.push(...xs);

// ---------- direction cosines and ratios ----------
add(
  M(1, 'direction cosines', 'The direction cosines of the $z$-axis are', '$(0,0,1)$', ['$(1,0,0)$', '$(0,1,0)$', '$(1,1,1)$'],
    R`<p>The $z$-axis makes $90^\circ$ with the $x$ and $y$ axes and $0^\circ$ with itself, so $(\cos90^\circ,\cos90^\circ,\cos0^\circ)=(0,0,1)$ (or $(0,0,-1)$ for the opposite direction).</p>`, 'Direction cosines must satisfy $l^2+m^2+n^2=1$; $(1,1,1)$ does not.'),
  I(1, 'direction cosines', R`A line has direction cosines $\dfrac13,\ \dfrac23,\ n$ with $n>0$. Find $3n$.`, 2,
    R`<p>$l^2+m^2+n^2=1$: $\dfrac19+\dfrac49+n^2=1$, so $n^2=\dfrac49$, $n=\dfrac23$. Then $3n=2$.</p>`, 'Take the positive root because $n>0$.', { calc: () => Math.round(3 * sqrt(1 - 1 / 9 - 4 / 9)) }),
  M(1, 'direction cosines', R`The direction cosines of a line with direction ratios $2,-3,6$ are`, R`$\left(\dfrac27,-\dfrac37,\dfrac67\right)$`, [R`$\left(\dfrac2{11},-\dfrac3{11},\dfrac6{11}\right)$`, R`$\left(\dfrac2{\sqrt{11}},-\dfrac3{\sqrt{11}},\dfrac6{\sqrt{11}}\right)$`, R`$\left(2,-3,6\right)$`],
    R`<p>Divide each ratio by $\sqrt{2^2+(-3)^2+6^2}=\sqrt{49}=7$.</p>`, 'Divide by the square root of the sum of squares, not by the sum.'),
  M(2, 'direction cosines', R`The direction cosines of the line joining $A(2,1,-1)$ and $B(4,-3,5)$, taken from $A$ to $B$, are`, R`$\left(\dfrac1{\sqrt{14}},-\dfrac2{\sqrt{14}},\dfrac3{\sqrt{14}}\right)$`, [R`$\left(\dfrac1{\sqrt{56}},-\dfrac2{\sqrt{56}},\dfrac3{\sqrt{56}}\right)$`, R`$\left(\dfrac3{\sqrt{14}},\dfrac1{\sqrt{14}},-\dfrac2{\sqrt{14}}\right)$`, R`$\left(2,-4,6\right)$`],
    R`<p>$\overrightarrow{AB}=(4-2,-3-1,5+1)=(2,-4,6)$, with $|AB|=\sqrt{4+16+36}=\sqrt{56}=2\sqrt{14}$. Dividing: $\left(\dfrac{2}{2\sqrt{14}},\dfrac{-4}{2\sqrt{14}},\dfrac6{2\sqrt{14}}\right)=\left(\dfrac1{\sqrt{14}},-\dfrac2{\sqrt{14}},\dfrac3{\sqrt{14}}\right)$.</p>`, '$\\sqrt{56}$ simplifies; each component must be divided by $2\\sqrt{14}$.'),
  M(2, 'direction cosines', R`A line is equally inclined to the three coordinate axes. Its direction cosines (positive choice) are`, R`$\left(\dfrac1{\sqrt3},\dfrac1{\sqrt3},\dfrac1{\sqrt3}\right)$`, [R`$\left(\dfrac13,\dfrac13,\dfrac13\right)$`, R`$\left(\dfrac1{\sqrt2},\dfrac1{\sqrt2},\dfrac1{\sqrt2}\right)$`, R`$\left(1,1,1\right)$`],
    R`<p>Equal angles mean $l=m=n$. Then $3l^2=1$ and $l=\dfrac1{\sqrt3}$.</p>`, 'Check $l^2+m^2+n^2=1$.'),
  D(2, 'direction cosines', R`A line is equally inclined to all three axes. Find the angle in degrees that it makes with each axis (acute angle).`, 54.7356,
    R`<p>$\cos\alpha=\dfrac1{\sqrt3}$, so $\alpha=\cos^{-1}(0.5774)\approx54.74^\circ$.</p>`, 'It is not $60^\\circ$.', { calc: () => deg(acos(1 / sqrt(3))) }),
  I(3, 'direction cosines', R`If a line makes angles $\alpha,\beta,\gamma$ with the axes, find $\sin^2\alpha+\sin^2\beta+\sin^2\gamma$.`, 2,
    R`<p>$\sin^2=1-\cos^2$ for each angle. The sum is $3-(\cos^2\alpha+\cos^2\beta+\cos^2\gamma)=3-1=2$.</p>`, 'The sum of the cosine squares is 1, not of the sines.', { calc: () => Math.round(3 - 1) }),
  M(3, 'direction cosines', R`A directed line makes $60^\circ$ with the positive $x$-axis and $45^\circ$ with the positive $y$-axis. The angle it can make with the positive $z$-axis is`, R`$60^\circ$ or $120^\circ$`, [R`$60^\circ$ only`, R`$30^\circ$ or $150^\circ$`, R`$45^\circ$ or $135^\circ$`],
    R`<p>$\cos^2\gamma=1-\cos^260^\circ-\cos^245^\circ=1-\dfrac14-\dfrac12=\dfrac14$, so $\cos\gamma=\pm\dfrac12$ and $\gamma=60^\circ$ or $120^\circ$.</p>`, 'Squaring loses the sign of $\\cos\\gamma$, so both angles are valid.'),
  D(3, 'direction cosines', R`Find the angle in degrees between two diagonals of a cube.`, 70.5288,
    R`<p>Take the diagonals with direction ratios $(1,1,1)$ and $(-1,1,1)$. $\cos\theta=\dfrac{-1+1+1}{\sqrt3\cdot\sqrt3}=\dfrac13$, so $\theta=\cos^{-1}\dfrac13\approx70.53^\circ$.</p>`, 'Use the acute angle between the lines.', { calc: () => deg(acos(dot([1, 1, 1], [-1, 1, 1]) / 3)) }),
  D(3, 'direction cosines', R`A face diagonal and a body diagonal of a cube start from the same vertex. Find the angle (in degrees) between $(1,1,0)$ and $(1,1,1)$.`, 35.2644,
    R`<p>$\cos\theta=\dfrac{1+1+0}{\sqrt2\cdot\sqrt3}=\sqrt{\dfrac23}$, so $\theta\approx35.26^\circ$.</p>`, 'Divide by the product of both lengths.', { calc: () => deg(acos(2 / (sqrt(2) * sqrt(3)))) }),
  M(4, 'direction cosines', R`The direction cosines $l,m,n$ of a line satisfy $l+2m+3n=0$ and $3l-2m+n=0$. Then $l$ equals`, R`$\pm\dfrac1{\sqrt3}$`, [R`$\dfrac1{\sqrt3}$ only`, R`$\pm\dfrac1{\sqrt{14}}$`, R`$\pm\dfrac13$`],
    R`<p>The line is perpendicular to both $(1,2,3)$ and $(3,-2,1)$, so its direction ratios come from $(1,2,3)\times(3,-2,1)=(8,8,-8)\propto(1,1,-1)$. Hence $(l,m,n)=\pm\dfrac1{\sqrt3}(1,1,-1)$ and $l=\pm\dfrac1{\sqrt3}$.</p>`, 'A line has two opposite sets of direction cosines.'),
  D(4, 'projection of a segment', R`Find the length of the projection of the segment joining $A(1,-2,3)$ and $B(3,2,-3)$ on the line with direction ratios $2,3,6$.`, 2.8571,
    R`<p>$\overrightarrow{AB}=(2,4,-6)$. Unit vector along the line: $\dfrac17(2,3,6)$. Projection $=\left|\dfrac{4+12-36}7\right|=\dfrac{20}7\approx2.86$.</p>`, 'Use the unit vector, not the raw direction ratios.', { calc: () => abs(dot([2, 4, -6], [2, 3, 6])) / 7 }),
  I(2, 'projection of a segment', R`The projections of a segment on the three coordinate axes are 3, 4 and 12. Find its length.`, 13,
    R`<p>Length$^2$ = sum of squares of the projections $=9+16+144=169$. Length $=13$.</p>`, 'Add the squares, then take the root.', { calc: () => Math.round(sqrt(9 + 16 + 144)) }),
  M(3, 'direction cosines', 'Which of the following can be the direction cosines of a line?', R`$\left(\dfrac12,\dfrac12,\dfrac1{\sqrt2}\right)$`, [R`$\left(\dfrac12,\dfrac12,\dfrac12\right)$`, R`$\left(\dfrac13,\dfrac13,\dfrac13\right)$`, R`$\left(\dfrac23,\dfrac23,\dfrac23\right)$`],
    R`<p>We need $l^2+m^2+n^2=1$. First: $\dfrac14+\dfrac14+\dfrac12=1$ yes. Second: $\dfrac34$ no. Third: $\dfrac13$ no. Fourth: $\dfrac43$ no.</p>`, 'Equal components are not automatically direction cosines.'),
);

// ---------- equations of lines ----------
add(
  M(1, 'equation of a line', R`The line through $(1,2,3)$ with direction ratios $2,-1,4$ is`, R`$\dfrac{x-1}2=\dfrac{y-2}{-1}=\dfrac{z-3}4$`, [R`$\dfrac{x+1}2=\dfrac{y+2}{-1}=\dfrac{z+3}4$`, R`$\dfrac{x-2}1=\dfrac{y+1}{2}=\dfrac{z-4}3$`, R`$\dfrac{x-1}4=\dfrac{y-2}{-1}=\dfrac{z-3}2$`],
    R`<p>Symmetric form: $\dfrac{x-x_1}a=\dfrac{y-y_1}b=\dfrac{z-z_1}c$ with the point $(x_1,y_1,z_1)$ and ratios $(a,b,c)$.</p>`, 'The numerators carry the point with a minus sign.'),
  M(2, 'equation of a line', R`The line through $A(2,-1,3)$ and $B(5,3,-1)$ is`, R`$\dfrac{x-2}3=\dfrac{y+1}4=\dfrac{z-3}{-4}$`, [R`$\dfrac{x-2}3=\dfrac{y+1}4=\dfrac{z-3}{4}$`, R`$\dfrac{x-2}7=\dfrac{y+1}2=\dfrac{z-3}{2}$`, R`$\dfrac{x-5}3=\dfrac{y-3}4=\dfrac{z+1}{4}$`],
    R`<p>Direction ratios: $B-A=(3,4,-4)$. Using $A$: $\dfrac{x-2}3=\dfrac{y+1}4=\dfrac{z-3}{-4}$.</p>`, 'Subtract, do not add, the coordinates.'),
  M(2, 'equation of a line', R`The Cartesian form of $\vec r=(\hat i+2\hat j-\hat k)+\lambda(3\hat i-\hat j+2\hat k)$ is`, R`$\dfrac{x-1}3=\dfrac{y-2}{-1}=\dfrac{z+1}2$`, [R`$\dfrac{x-1}3=\dfrac{y-2}{-1}=\dfrac{z-1}2$`, R`$\dfrac{x+1}3=\dfrac{y+2}{-1}=\dfrac{z-1}2$`, R`$\dfrac{x-3}1=\dfrac{y+1}{2}=\dfrac{z-2}{-1}$`],
    R`<p>The point is $(1,2,-1)$ and the direction ratios are $(3,-1,2)$. So $\dfrac{x-1}3=\dfrac{y-2}{-1}=\dfrac{z-(-1)}2=\dfrac{z+1}2$.</p>`, 'Mind $z-(-1)=z+1$.'),
  M(2, 'equation of a line', R`The direction cosines of $\dfrac{x-2}3=\dfrac{y+1}{-2}=\dfrac{z-5}6$ are`, R`$\left(\dfrac37,-\dfrac27,\dfrac67\right)$`, [R`$\left(\dfrac{2}{7},\dfrac{1}{7},\dfrac57\right)$`, R`$\left(\dfrac3{11},-\dfrac2{11},\dfrac6{11}\right)$`, R`$\left(3,-2,6\right)$`],
    R`<p>The ratios are the denominators $(3,-2,6)$. Length $\sqrt{9+4+36}=7$. The point $(2,-1,5)$ plays no part.</p>`, 'The numbers in the numerators are not direction ratios.'),
  M(3, 'line of intersection of planes', R`The line of intersection of $x+y+z=6$ and $x-y+2z=4$ is`, R`$\dfrac{x-5}3=\dfrac{y-1}{-1}=\dfrac z{-2}$`, [R`$\dfrac{x-5}3=\dfrac{y-1}{-1}=\dfrac z{2}$`, R`$\dfrac{x-5}1=\dfrac{y-1}{1}=\dfrac z{1}$`, R`$\dfrac{x-1}3=\dfrac{y-5}{-1}=\dfrac z{-2}$`],
    R`<p>Direction: $(1,1,1)\times(1,-1,2)=(1\cdot2-1\cdot(-1),\,1\cdot1-1\cdot2,\,1\cdot(-1)-1\cdot1)=(3,-1,-2)$. A point: put $z=0$: $x+y=6$, $x-y=4$ gives $(5,1,0)$. So $\dfrac{x-5}3=\dfrac{y-1}{-1}=\dfrac{z}{-2}$.</p>`, 'The direction is the cross product of the two normals.'),
  M(3, 'equation of a line', R`The line is $\vec r=(\hat i+2\hat j-\hat k)+\lambda(3\hat i-\hat j+2\hat k)$. Which of these points lies on it?`, '$(7,0,3)$', ['$(7,1,3)$', '$(4,0,2)$', '$(5,1,4)$'],
    R`<p>Points are $(1+3\lambda,\,2-\lambda,\,-1+2\lambda)$. For $\lambda=2$: $(7,0,3)$ yes. $(7,1,3)$ needs $\lambda=2$ for $x$ but $y=0$. $(4,0,2)$: $\lambda=1$ gives $(4,1,1)$. $(5,1,4)$: $x=5$ needs $\lambda=\dfrac43$, then $y=\dfrac23\ne1$.</p>`, 'The same $\\lambda$ must work for all three coordinates.'),
  M(3, 'equation of a line', R`The line through $(1,2,3)$ parallel to the line joining $(0,1,-1)$ and $(2,3,1)$ is`, R`$\dfrac{x-1}1=\dfrac{y-2}1=\dfrac{z-3}1$`, [R`$\dfrac{x-1}2=\dfrac{y-2}3=\dfrac{z-3}1$`, R`$\dfrac{x}1=\dfrac{y-1}1=\dfrac{z+1}1$`, R`$\dfrac{x-1}{-1}=\dfrac{y-2}{1}=\dfrac{z-3}{1}$`],
    R`<p>The given line has direction $(2,2,2)\propto(1,1,1)$. The parallel line through $(1,2,3)$ has the same direction.</p>`, 'Divide the direction ratios by 2.'),
  M(2, 'equation of a line', 'The equation of the $z$-axis is', R`$\dfrac x0=\dfrac y0=\dfrac z1$`, [R`$\dfrac x1=\dfrac y0=\dfrac z0$`, R`$\dfrac x0=\dfrac y1=\dfrac z0$`, R`$\dfrac x1=\dfrac y1=\dfrac z1$`],
    R`<p>It passes through the origin with direction ratios $(0,0,1)$. So $\dfrac x0=\dfrac y0=\dfrac z1$, meaning $x=0,y=0$.</p>`, 'A zero denominator means that coordinate stays fixed.'),
  D(3, 'angle between lines', R`Find the angle in degrees between the lines with direction ratios $(1,2,2)$ and $(2,-3,6)$.`, 67.6073,
    R`<p>$\cos\theta=\dfrac{|1\cdot2+2\cdot(-3)+2\cdot6|}{3\cdot7}=\dfrac8{21}$, so $\theta=\cos^{-1}\dfrac8{21}\approx67.61^\circ$.</p>`, 'Divide by the product of the lengths $3\\times7$.', { calc: () => deg(acos(abs(dot([1, 2, 2], [2, -3, 6])) / (3 * 7))) }),
  I(3, 'angle between lines', R`The lines with direction ratios $(k,3,-2)$ and $(1,-1,k)$ are perpendicular. Find $k$.`, -3,
    R`<p>Perpendicular: dot product $0$: $k\cdot1+3\cdot(-1)+(-2)k=-k-3=0$, so $k=-3$.</p>`, 'Watch the sign of the product $(-2)\\cdot k$.', { calc: () => -3 }),
  I(3, 'angle between lines', R`The lines with direction ratios $(2,k,6)$ and $(1,3,3)$ are parallel. Find $k$.`, 6,
    R`<p>Parallel: ratios proportional: $\dfrac21=\dfrac k3=\dfrac63$. All equal $2$, so $k=6$.</p>`, 'Check that the third ratio agrees too.'),
  I(3, 'intersection of lines', R`The lines $\dfrac{x-1}2=\dfrac{y+1}3=\dfrac{z-1}4$ and $\dfrac{x-1}1=\dfrac{y-k}2=\dfrac{z-3}1$ intersect. Find $k$.`, -2,
    R`<p>Points: $(1+2s,-1+3s,1+4s)$ and $(1+t,k+2t,3+t)$. From $x$: $2s=t$. From $z$: $1+4s=3+t=3+2s$, so $s=1$, $t=2$. From $y$: $-1+3=k+4$, so $k=-2$.</p>`, 'Use two coordinates to find $s,t$ and the third to find $k$.', { calc: () => { const s = 1, t = 2; return -1 + 3 * s - 2 * t; } }),
  I(4, 'direction ratios', R`A line through $(1,2,3)$ is perpendicular to the lines with direction ratios $(1,2,3)$ and $(3,2,1)$. Its direction ratios can be written $(1,b,c)$. Find $b+c$.`, -1,
    R`<p>The direction is the cross product $(1,2,3)\times(3,2,1)=(2\cdot1-3\cdot2,\,3\cdot3-1\cdot1,\,1\cdot2-2\cdot3)=(-4,8,-4)\propto(1,-2,1)$. So $b+c=-2+1=-1$.</p>`, 'Divide the cross product by $-4$.', { calc: () => { const c = cross([1, 2, 3], [3, 2, 1]); return Math.round(c[1] / c[0] + c[2] / c[0]); } }),
);

// ---------- skew lines, parallel lines, intersections ----------
add(
  D(3, 'shortest distance', R`Find the shortest distance between the lines $\vec r=(1,1,0)+\lambda(2,-1,1)$ and $\vec r=(2,1,-1)+\mu(3,-5,2)$.`, 1.3019,
    R`<p>$\vec b_1\times\vec b_2=(2,-1,1)\times(3,-5,2)=((-1)(2)-(1)(-5),\ (1)(3)-(2)(2),\ (2)(-5)-(-1)(3))=(3,-1,-7)$, with length $\sqrt{9+1+49}=\sqrt{59}$. $\vec a_2-\vec a_1=(1,0,-1)$, dot product $3+0+7=10$. Distance $=\dfrac{10}{\sqrt{59}}\approx1.30$.</p>`, 'The numerator is a scalar triple product, so keep the absolute value.', { calc: () => lldist([1, 1, 0], [2, -1, 1], [2, 1, -1], [3, -5, 2]) }),
  D(3, 'shortest distance', R`Find the distance between the parallel lines $\vec r=(1,2,3)+\lambda(1,2,2)$ and $\vec r=(3,3,2)+\mu(1,2,2)$.`, 2.357,
    R`<p>Same direction $\vec b=(1,2,2)$, $|\vec b|=3$. $\vec a_2-\vec a_1=(2,1,-1)$. $(2,1,-1)\times(1,2,2)=(1\cdot2-(-1)\cdot2,\ (-1)\cdot1-2\cdot2,\ 2\cdot2-1\cdot1)=(4,-5,3)$, length $\sqrt{50}=5\sqrt2$. Distance $=\dfrac{5\sqrt2}3\approx2.36$.</p>`, 'For parallel lines divide by $|\\vec b|$, not by $|\\vec b_1\\times\\vec b_2|$ (which is zero).', { calc: () => lldist([1, 2, 3], [1, 2, 2], [3, 3, 2], [1, 2, 2]) }),
  M(2, 'shortest distance', R`Two lines $\vec r=\vec a_1+\lambda\vec b_1$ and $\vec r=\vec a_2+\mu\vec b_2$ intersect if and only if`, R`$(\vec a_2-\vec a_1)\cdot(\vec b_1\times\vec b_2)=0$ and $\vec b_1\times\vec b_2\ne\vec 0$`, [R`$\vec b_1\cdot\vec b_2=0$`, R`$(\vec a_2-\vec a_1)\times(\vec b_1\times\vec b_2)=\vec0$`, R`$\vec b_1\times\vec b_2=\vec 0$`],
    R`<p>Zero shortest distance means $(\vec a_2-\vec a_1)\cdot(\vec b_1\times\vec b_2)=0$. If also $\vec b_1\times\vec b_2=\vec0$ the lines are parallel (not meeting unless the same line). So we need the dot to vanish with a non-zero cross product. $\vec b_1\cdot\vec b_2=0$ only says they are perpendicular directions.</p>`, 'Zero distance for parallel lines means something else.'),
  I(3, 'intersection of lines', R`The lines $\dfrac x1=\dfrac{y+1}2=\dfrac{z-3}{-1}$ and $\dfrac x2=\dfrac{y-4}{-1}=\dfrac{z+2}3$ meet at a point. Find the sum of its coordinates.`, 6,
    R`<p>Points: $(s,-1+2s,3-s)$ and $(2t,4-t,-2+3t)$. $x$: $s=2t$. $z$: $3-2t=-2+3t$, so $t=1$, $s=2$. Check $y$: $-1+4=3$ and $4-1=3$ ✓. The point is $(2,3,1)$, sum $6$.</p>`, 'Always check the third coordinate.', { calc: () => 2 + 3 + 1 }),
  I(4, 'coplanar lines', R`The lines $\dfrac{x-1}2=\dfrac{y-2}3=\dfrac{z-3}4$ and $\dfrac x1=\dfrac{y-3}{-1}=\dfrac{z-k}1$ are coplanar. Find $k$.`, 2,
    R`<p>$\vec a_1=(1,2,3)$, $\vec a_2=(0,3,k)$, $\vec b_1=(2,3,4)$, $\vec b_2=(1,-1,1)$. $\vec b_1\times\vec b_2=(3\cdot1-4\cdot(-1),\,4\cdot1-2\cdot1,\,2\cdot(-1)-3\cdot1)=(7,2,-5)$. $\vec a_2-\vec a_1=(-1,1,k-3)$. Coplanar: $-7+2-5(k-3)=0$, so $k-3=-1$, $k=2$.</p>`, 'Coplanar means the scalar triple product is zero.', { calc: () => { for (let k = -20; k <= 20; k++) if (dot(vsub([0, 3, k], [1, 2, 3]), cross([2, 3, 4], [1, -1, 1])) === 0) return k; } }),
  D(3, 'distance of a point from a line', R`Find the perpendicular distance of $P(4,4,6)$ from the line $\vec r=(0,1,2)+\lambda(1,2,2)$.`, 2.2361,
    R`<p>$\vec P-\vec a=(4,3,4)$. Cross with $\vec b=(1,2,2)$: $(3\cdot2-4\cdot2,\ 4\cdot1-4\cdot2,\ 4\cdot2-3\cdot1)=(-2,-4,5)$, length $\sqrt{4+16+25}=\sqrt{45}$. Distance $=\dfrac{\sqrt{45}}{3}=\sqrt5\approx2.24$.</p>`, 'Distance $=|(\\vec P-\\vec a)\\times\\vec b|/|\\vec b|$.', { calc: () => nrm(cross(vsub([4, 4, 6], [0, 1, 2]), [1, 2, 2])) / 3 }),
  M(4, 'shortest distance', 'In a unit cube, the shortest distance between a body diagonal and an edge that does not meet it is', R`$\dfrac1{\sqrt2}$`, [R`$\dfrac1{\sqrt3}$`, R`$\dfrac12$`, R`$1$`],
    R`<p>Take the diagonal through $O(0,0,0)$ with direction $(1,1,1)$ and the edge from $(1,0,0)$ along $(0,1,0)$. $(1,1,1)\times(0,1,0)=(-1,0,1)$, length $\sqrt2$. $\vec a_2-\vec a_1=(1,0,0)$, dot $=-1$. Distance $=\dfrac1{\sqrt2}$.</p>`, 'Pick an edge that really misses the diagonal.'),
  I(4, 'foot of the perpendicular', R`Let $F$ be the foot of the perpendicular from $P(4,4,6)$ to the line $\vec r=(0,1,2)+\lambda(1,2,2)$. Find the sum of the coordinates of $F$.`, 13,
    R`<p>$F=(\lambda,1+2\lambda,2+2\lambda)$. $\overrightarrow{PF}=(\lambda-4,2\lambda-3,2\lambda-4)$ must be perpendicular to $(1,2,2)$: $(\lambda-4)+2(2\lambda-3)+2(2\lambda-4)=9\lambda-18=0$, so $\lambda=2$. $F=(2,5,6)$, sum $13$.</p>`, 'Use the dot product with the direction ratios, not with $P$.', { calc: () => { const a = [0, 1, 2], b = [1, 2, 2], P = [4, 4, 6]; const l = dot(vsub(P, a), b) / dot(b, b); const F = vadd(a, vsc(l, b)); return Math.round(F[0] + F[1] + F[2]); } }),
  I(4, 'image of a point in a line', R`Find $x+y+z$ for the image of $P(4,4,6)$ in the line $\vec r=(0,1,2)+\lambda(1,2,2)$.`, 12,
    R`<p>The foot is $F=(2,5,6)$ (from $\lambda=2$). The image $P'$ satisfies $F=\dfrac{P+P'}2$, so $P'=2F-P=(0,6,6)$. Sum $=12$.</p>`, 'Image = 2 × foot − point.', { calc: () => { const a = [0, 1, 2], b = [1, 2, 2], P = [4, 4, 6]; const l = dot(vsub(P, a), b) / dot(b, b); const F = vadd(a, vsc(l, b)); const Q = vsub(vsc(2, F), P); return Math.round(Q[0] + Q[1] + Q[2]); } }),
);

// ---------- planes ----------
add(
  M(1, 'equation of a plane', 'The equation of the plane parallel to the $xy$-plane and 5 units above it is', '$z=5$', ['$x=5$', '$y=5$', '$z=0$'],
    R`<p>A plane parallel to the $xy$-plane has a normal along the $z$-axis, so it is $z=c$. Five units above means $c=5$.</p>`, 'The $xy$-plane itself is $z=0$.'),
  M(1, 'equation of a plane', R`The direction ratios of the normal to the plane $2x-3y+6z=12$ are`, R`$(2,-3,6)$`, [R`$(2,3,6)$`, R`$(12,12,12)$`, R`$(6,-3,2)$`],
    R`<p>For $ax+by+cz=d$ the normal has ratios $(a,b,c)$. Here $(2,-3,6)$.</p>`, 'The constant on the right is not part of the normal.'),
  D(1, 'distance from a point to a plane', R`Find the distance of the origin from the plane $2x-3y+6z=12$.`, 1.7143,
    R`<p>$\dfrac{|0+0+0-12|}{\sqrt{4+9+36}}=\dfrac{12}7\approx1.71$.</p>`, 'The denominator is $\\sqrt{49}=7$.', { calc: () => pdist([0, 0, 0], [2, -3, 6], 12) }),
  M(2, 'equation of a plane', R`The plane through $(1,-2,3)$ with normal direction $(2,3,-1)$ is`, R`$2x+3y-z+7=0$`, [R`$2x+3y-z-7=0$`, R`$2x+3y+z+7=0$`, R`$x-2y+3z+7=0$`],
    R`<p>$2(x-1)+3(y+2)-(z-3)=0$, i.e. $2x-2+3y+6-z+3=2x+3y-z+7=0$.</p>`, 'Expand each bracket with its own sign.'),
  M(2, 'equation of a plane', R`The plane through $(1,0,0)$, $(0,2,0)$ and $(0,0,3)$ is`, R`$6x+3y+2z=6$`, [R`$x+2y+3z=6$`, R`$3x+2y+z=6$`, R`$6x+3y+2z=1$`],
    R`<p>Intercept form: $\dfrac x1+\dfrac y2+\dfrac z3=1$. Multiply by 6: $6x+3y+2z=6$.</p>`, 'The intercepts go under the variables.'),
  M(3, 'equation of a plane', R`The plane through $(1,2,3)$, $(2,3,1)$ and $(3,1,2)$ is`, R`$x+y+z=6$`, [R`$x+y+z=3$`, R`$x-y+z=2$`, R`$2x+y+z=7$`],
    R`<p>$\vec{AB}=(1,1,-2)$, $\vec{AC}=(2,-1,-1)$. Cross: $(1\cdot(-1)-(-2)(-1),\,(-2)(2)-1\cdot(-1),\,1\cdot(-1)-1\cdot2)=(-3,-3,-3)\propto(1,1,1)$. So $x+y+z=1+2+3=6$.</p>`, 'Check all three points satisfy the equation.'),
  I(2, 'equation of a plane', R`The plane $\vec r\cdot(2\hat i-\hat j+2\hat k)=9$ is at what distance from the origin?`, 3,
    R`<p>Distance $=\dfrac{|9|}{|2\hat i-\hat j+2\hat k|}=\dfrac9{\sqrt{4+1+4}}=\dfrac93=3$.</p>`, 'Divide by the length of the normal, which is 3 here.', { calc: () => Math.round(pdist([0, 0, 0], [2, -1, 2], 9)) }),
  M(3, 'equation of a plane', R`The plane containing the line $\dfrac{x-1}2=\dfrac{y-2}3=\dfrac{z-3}4$ and the origin is`, R`$x-2y+z=0$`, [R`$x+2y+z=0$`, R`$2x+3y+4z=0$`, R`$x-2y+z=2$`],
    R`<p>The plane contains direction $(2,3,4)$ and the vector $(1,2,3)$ to the point on the line. Normal $=(2,3,4)\times(1,2,3)=(3\cdot3-4\cdot2,\,4\cdot1-2\cdot3,\,2\cdot2-3\cdot1)=(1,-2,1)$. Through the origin: $x-2y+z=0$. Check: $(1,2,3)\to1-4+3=0$ ✓.</p>`, 'The plane passes through the origin, so there is no constant term.'),
  M(3, 'equation of a plane', R`The plane containing the intersecting lines $\dfrac{x-2}1=\dfrac{y-3}2=\dfrac{z-1}{-1}$ and $\dfrac{x-2}2=\dfrac{y-3}{-1}=\dfrac{z-1}3$ is`, R`$x-y-z+2=0$`, [R`$x-y-z-2=0$`, R`$x+y+z-6=0$`, R`$5x-5y-5z=0$`],
    R`<p>Both lines pass through $(2,3,1)$. Normal $=(1,2,-1)\times(2,-1,3)=(2\cdot3-(-1)(-1),\,(-1)(2)-1\cdot3,\,1\cdot(-1)-2\cdot2)=(5,-5,-5)\propto(1,-1,-1)$. Plane: $(x-2)-(y-3)-(z-1)=0$, i.e. $x-y-z+2=0$.</p>`, 'Plug the common point into your answer to check.'),
  D(3, 'angle between planes', R`Find the acute angle in degrees between the planes $2x-y+2z=3$ and $x+2y-2z=5$.`, 63.6122,
    R`<p>Normals $(2,-1,2)$ and $(1,2,-2)$. $\cos\theta=\dfrac{|2-2-4|}{3\cdot3}=\dfrac49$. $\theta=\cos^{-1}\dfrac49\approx63.61^\circ$.</p>`, 'The angle between planes is the angle between their normals.', { calc: () => deg(acos(abs(dot([2, -1, 2], [1, 2, -2])) / 9)) }),
  I(3, 'angle between planes', R`The planes $kx+2y-3z=7$ and $2x-y+4z=1$ are perpendicular. Find $k$.`, 7,
    R`<p>Normals are perpendicular: $(k,2,-3)\cdot(2,-1,4)=2k-2-12=0$, so $k=7$.</p>`, 'Perpendicular planes have perpendicular normals.', { calc: () => 7 }),
  M(3, 'family of planes', R`The plane through the line of intersection of $x+y+z=1$ and $2x+3y-z+4=0$ that passes through $(1,1,1)$ is`, R`$2x+y+5z-8=0$`, [R`$2x+y+5z+8=0$`, R`$x+y+z-3=0$`, R`$3x+4y+2z-9=0$`],
    R`<p>Family: $(x+y+z-1)+\lambda(2x+3y-z+4)=0$. At $(1,1,1)$: $2+\lambda(8)=0$, $\lambda=-\dfrac14$. Multiply by 4: $4x+4y+4z-4-2x-3y+z-4=2x+y+5z-8=0$.</p>`, 'Check at $(1,1,1)$: $2+1+5-8=0$.'),
  M(4, 'family of planes', R`The plane through the line of intersection of $x+2y+3z=4$ and $2x+y-z+5=0$ and perpendicular to $x+y+z=5$ is`, R`$5x+y-6z+19=0$`, [R`$5x+y-6z-19=0$`, R`$x+5y-6z+19=0$`, R`$5x+y+6z+19=0$`],
    R`<p>Family: $(x+2y+3z-4)+\lambda(2x+y-z+5)=0$, normal $(1+2\lambda,\,2+\lambda,\,3-\lambda)$. Perpendicular to $(1,1,1)$: $6+2\lambda=0$, $\lambda=-3$. Plane: $-5x-y+6z-19=0$, i.e. $5x+y-6z+19=0$.</p>`, 'Perpendicular planes: the sum of the normal components must vanish here.'),
  I(3, 'parallel planes', R`Find the distance between the parallel planes $2x-2y+z=3$ and $2x-2y+z=15$.`, 4,
    R`<p>Distance $=\dfrac{|15-3|}{\sqrt{4+4+1}}=\dfrac{12}3=4$.</p>`, 'Divide the difference of constants by $|n|$.', { calc: () => Math.round(abs(15 - 3) / nrm([2, -2, 1])) }),
  I(3, 'distance from a point to a plane', R`Find the distance of $(2,-1,3)$ from the plane $3x-4y+12z-20=0$.`, 2,
    R`<p>$\dfrac{|6+4+36-20|}{\sqrt{9+16+144}}=\dfrac{26}{13}=2$.</p>`, 'Evaluate the plane expression at the point first.', { calc: () => Math.round(abs(3 * 2 - 4 * -1 + 12 * 3 - 20) / 13) }),
  M(4, 'image of a point in a plane', R`The image of $(2,3,4)$ in the plane $x+y+z=3$ is`, '$(-2,-1,0)$', ['$(0,1,2)$', '$(-1,0,1)$', '$(2,1,0)$'],
    R`<p>$x+y+z-3$ at the point $=6$. Image $=P-2\cdot\dfrac{6}{3}(1,1,1)=(2,3,4)-4(1,1,1)=(-2,-1,0)$. (The foot is $(0,1,2)$.)</p>`, 'Image goes twice as far as the foot.'),
  M(4, 'image of a point in a plane', R`The image of $(1,3,4)$ in the plane $2x-y+z+3=0$ is`, '$(-3,5,2)$', ['$(-1,4,3)$', '$(3,1,6)$', '$(-3,5,6)$'],
    R`<p>Value at the point: $2-3+4+3=6$. $|n|^2=6$. Image $=(1,3,4)-2\cdot\dfrac66(2,-1,1)=(1,3,4)-(4,-2,2)=(-3,5,2)$.</p>`, 'The foot is $(-1,4,3)$; the image is beyond it.'),
  I(4, 'foot of the perpendicular', R`Find the sum of the coordinates of the foot of the perpendicular from $(2,3,4)$ on the plane $x+y+z=3$.`, 3,
    R`<p>Foot $=P-\dfrac{(x+y+z-3)}{3}(1,1,1)=(2,3,4)-2(1,1,1)=(0,1,2)$. Sum $=3$ (it lies on the plane, so the sum must equal 3).</p>`, 'A point on this plane always has coordinate sum 3.', { calc: () => { const P = [2, 3, 4], n = [1, 1, 1]; const t = (dot(n, P) - 3) / dot(n, n); const F = vsub(P, vsc(t, n)); return Math.round(F[0] + F[1] + F[2]); } }),
  D(4, 'angle between planes', R`The acute angle (in degrees) between the plane $2x+3y+6z=11$ and the $xy$-plane is`, 31.0027,
    R`<p>The $xy$-plane has normal $(0,0,1)$. $\cos\theta=\dfrac{6}{7}$, so $\theta=\cos^{-1}\dfrac67\approx31.00^\circ$.</p>`, 'Use the $z$-component of the normal over $|n|$.', { calc: () => deg(acos(6 / 7)) }),
  I(5, 'intercepts', R`A plane meets the coordinate axes at $A$, $B$, $C$ and the centroid of triangle $ABC$ is $(1,2,3)$. Find the sum of the intercepts $OA+OB+OC$.`, 18,
    R`<p>If the intercepts are $a,b,c$ the centroid is $\left(\dfrac a3,\dfrac b3,\dfrac c3\right)=(1,2,3)$, so $a=3,b=6,c=9$. Sum $=18$ (the plane is $\dfrac x3+\dfrac y6+\dfrac z9=1$).</p>`, 'The centroid of $A(a,0,0)$, $B(0,b,0)$, $C(0,0,c)$ is $(a/3,b/3,c/3)$.', { calc: () => 3 + 6 + 9 }),
  D(5, 'intercepts', R`A plane has intercepts $2$, $3$, $6$ on the axes. Find its distance from the origin.`, 1.6036,
    R`<p>$\dfrac x2+\dfrac y3+\dfrac z6=1$, i.e. $3x+2y+z=6$. Distance $=\dfrac{6}{\sqrt{9+4+1}}=\dfrac6{\sqrt{14}}\approx1.60$. Check: $\dfrac1{p^2}=\dfrac14+\dfrac19+\dfrac1{36}=\dfrac{14}{36}$.</p>`, 'Use $1/p^2=1/a^2+1/b^2+1/c^2$.', { calc: () => 1 / sqrt(1 / 4 + 1 / 9 + 1 / 36) }),
);

// ---------- line and plane ----------
add(
  D(3, 'line and plane', R`Find the angle in degrees between the line with direction ratios $(1,2,2)$ and the plane $2x+3y+6z=5$.`, 72.2472,
    R`<p>$\sin\theta=\dfrac{|\vec b\cdot\vec n|}{|\vec b||\vec n|}=\dfrac{|2+6+12|}{3\cdot7}=\dfrac{20}{21}$. $\theta=\sin^{-1}\dfrac{20}{21}\approx72.25^\circ$.</p>`, 'Use sine, not cosine, for line and plane.', { calc: () => deg(asin(abs(dot([1, 2, 2], [2, 3, 6])) / 21)) }),
  I(3, 'line and plane', R`The line $\dfrac{x-2}3=\dfrac{y+1}4=\dfrac{z-2}2$ meets the plane $x-y+z=7$ at a point. Find the sum of its coordinates.`, 21,
    R`<p>Points $(2+3\lambda,\,-1+4\lambda,\,2+2\lambda)$. Substitute: $(2+3\lambda)-(-1+4\lambda)+(2+2\lambda)=5+\lambda=7$, so $\lambda=2$. Point $(8,7,6)$, sum $21$.</p>`, 'Substitute into the plane and solve for $\\lambda$ first.', { calc: () => { for (let l = -10; l <= 10; l++) { const p = [2 + 3 * l, -1 + 4 * l, 2 + 2 * l]; if (p[0] - p[1] + p[2] === 7) return p[0] + p[1] + p[2]; } } }),
  I(3, 'line and plane', R`The line $\dfrac{x-1}2=\dfrac{y-2}3=\dfrac{z-3}k$ is parallel to the plane $x+2y-2z=7$. Find $k$.`, 4,
    R`<p>Parallel means direction $\perp$ normal: $(2,3,k)\cdot(1,2,-2)=2+6-2k=0$, so $k=4$.</p>`, 'Parallel to the plane means dot product zero, not proportional.', { calc: () => 4 }),
  D(4, 'line and plane', R`The line through $A(1,2,3)$ with direction ratios $(2,1,-2)$ is parallel to the plane $x+2y+2z=21$. Find the distance of the line from the plane.`, 3.3333,
    R`<p>Check parallel: $(2,1,-2)\cdot(1,2,2)=2+2-4=0$ ✓. Distance of the line = distance of any point on it: $\dfrac{|1+4+6-21|}3=\dfrac{10}3\approx3.33$.</p>`, 'Check parallelism first.', { calc: () => pdist([1, 2, 3], [1, 2, 2], 21) }),
  M(4, 'line and plane', R`The line $\dfrac{x-1}2=\dfrac{y-2}1=\dfrac{z}{-1}$ lies in the plane $x+py+3z=3$. Then $p$ equals`, '$1$', ['$2$', '$-1$', '$3$'],
    R`<p>The direction $(2,1,-1)$ must be perpendicular to the normal $(1,p,3)$: $2+p-3=0$, $p=1$. The point $(1,2,0)$ must lie on the plane: $1+2p=3$, $p=1$ ✓. Both conditions agree.</p>`, 'A line lies in a plane only if both the direction and a point fit.'),
  M(3, 'line and plane', 'The angle between a line and a plane is', R`the complement of the angle between the line and the normal to the plane`, ['the angle between the line and the normal to the plane', 'the angle between the line and the $x$-axis', 'always $90^\\circ$'],
    R`<p>If $\phi$ is the angle between the line and the normal, the line and plane make $90^\circ-\phi$. That is why $\sin\theta=\dfrac{|\vec b\cdot\vec n|}{|\vec b||\vec n|}$ uses sine.</p>`, 'The dot-product formula gives the angle with the normal.'),
);

// ---------- coplanar points, projections ----------
add(
  I(3, 'coplanar points', R`The points $A(1,2,3)$, $B(2,3,5)$, $C(0,3,3)$ and $D(3,k,2)$ are coplanar. Find $k$.`, -1,
    R`<p>$\overrightarrow{AB}=(1,1,2)$, $\overrightarrow{AC}=(-1,1,0)$, $\overrightarrow{AD}=(2,k-2,-1)$. Coplanar: $\overrightarrow{AB}\cdot(\overrightarrow{AC}\times\overrightarrow{AD})=0$. $\overrightarrow{AC}\times\overrightarrow{AD}=(1\cdot(-1)-0,\ 0\cdot2-(-1)(-1),\ (-1)(k-2)-1\cdot2)=(-1,-1,-k)$. Dot with $(1,1,2)$: $-1-1-2k=0$, so $k=-1$.</p>`, 'Triple product of three edge vectors from the same point.', { calc: () => { for (let k = -20; k <= 20; k++) if (dot(vsub([2, 3, 5], [1, 2, 3]), cross(vsub([0, 3, 3], [1, 2, 3]), vsub([3, k, 2], [1, 2, 3]))) === 0) return k; } }),
  D(3, 'projection of a segment', R`Find the length of the projection of the segment from $A(1,2,3)$ to $B(2,4,6)$ on the plane $x+y+z=0$.`, 1.4142,
    R`<p>$\overrightarrow{AB}=(1,2,3)$, $|AB|^2=14$. Component along the normal $(1,1,1)$: $\dfrac{6}{\sqrt3}$, square $12$. Projection length$^2=14-12=2$, so $\sqrt2\approx1.41$.</p>`, 'Subtract the part along the normal.', { calc: () => sqrt(dot([1, 2, 3], [1, 2, 3]) - dot([1, 2, 3], [1, 1, 1]) ** 2 / 3) }),
  D(4, 'equation of a plane', R`The plane contains the line $\vec r=(0,1,2)+\lambda(1,2,2)$ and the point $P(4,4,6)$. Find its distance from the origin.`, 0.8944,
    R`<p>$\vec P-\vec a=(4,3,4)$ and direction $(1,2,2)$. Normal $=(1,2,2)\times(4,3,4)=(2\cdot4-2\cdot3,\ 2\cdot4-1\cdot4,\ 1\cdot3-2\cdot4)=(2,4,-5)$. The plane through $(0,1,2)$: $2x+4y-5z=4-10=-6$. Distance from the origin $=\dfrac{6}{\sqrt{45}}=\dfrac{2}{\sqrt5}\approx0.89$.</p>`, 'Use a point on the line to get the constant.', { calc: () => { const n = cross([1, 2, 2], vsub([4, 4, 6], [0, 1, 2])); return abs(dot(n, [0, 1, 2])) / nrm(n); } }),
);

// ---------- worked families: same idea, different numbers (answers computed in code) ----------
// direction cosines from direction ratios
add(...[[2, 3, 6], [1, 2, 2], [4, -4, 7], [6, 2, -3], [1, 4, 8], [-2, 1, 2]].map((v, i) => {
  const Nn = dot(v, v), s = nrm(v), sum = abs(v[0]) + abs(v[1]) + abs(v[2]);
  const good = `$${dcs(v)}$`;
  const w1 = `$\\left(${v.map((t) => fr(t, sum)).join(',')}\\right)$`;
  const flip = [v[0], -v[1], v[2]];
  const w2 = `$${dcs(flip)}$`;
  const w3 = `$\\left(${v.join(',')}\\right)$`;
  return M(i < 3 ? 1 : 2, 'direction cosines', R`The direction cosines of a line with direction ratios $${v.join(',')}$ are`, good, [w1, w2, w3],
    R`<p>$\sqrt{(${v[0]})^2+(${v[1]})^2+(${v[2]})^2}=\sqrt{${Nn}}=${s}$. Divide each ratio by ${s}: $${dcs(v)}$.</p>`, 'Divide by the square root of the sum of squares.');
}));

// distance of a point from a plane
add(...[[[1, 2, 3], [1, 2, 2], 20], [[2, -1, 0], [2, 3, 6], 7], [[0, 0, 5], [2, -1, 2], 4], [[3, 1, -2], [6, 2, 3], 5], [[1, -2, 4], [4, -4, 7], 10], [[-1, 2, 1], [1, 4, 8], 0]].map(([P, n, d], i) => {
  const ans = pdist(P, n, d), val = dot(n, P) - d, q = R`Find the distance of the point $${pt(P)}$ from the plane $${peq(n, d)}$.`;
  const sol = R`<p>Distance $=\dfrac{|${n.map((t, k) => `${t < 0 ? `(${t})` : t}\\cdot${P[k] < 0 ? `(${P[k]})` : P[k]}`).join('+')}-${d < 0 ? `(${d})` : d}|}{\sqrt{${dot(n, n)}}}=\dfrac{|${val}|}{${nrm(n)}}=${Number.isInteger(ans) ? ans : r4(ans)}$.</p>`;
  const tr = 'Put the point into the left side, subtract the constant, then divide by the length of the normal.';
  return Number.isInteger(ans) ? I(2, 'distance from a point to a plane', q, ans, sol, tr, { calc: () => Math.round(pdist(P, n, d)) })
    : D(2, 'distance from a point to a plane', q, r4(ans), sol, tr, { calc: () => pdist(P, n, d) });
}));

// angle between lines given in symmetric form
add(...[[[1, 2, 3], [1, 2, 2], [0, 1, -1], [2, 1, -2]], [[0, 0, 1], [2, 3, 6], [1, 1, 0], [1, -2, 2]], [[1, 1, 0], [1, 1, 0], [2, 0, 1], [0, 1, 1]], [[2, -1, 3], [1, -1, 2], [0, 4, 1], [2, 1, -1]]].map(([p1, d1, p2, d2], i) => {
  const c = abs(dot(d1, d2)) / (nrm(d1) * nrm(d2)), th = deg(acos(c));
  return D(i < 2 ? 2 : 3, 'angle between lines', R`Find the acute angle in degrees between the lines $${symLine(p1, d1)}$ and $${symLine(p2, d2)}$.`, r4(th),
    R`<p>Direction ratios $(${d1.join(',')})$ and $(${d2.join(',')})$. Dot product $=${dot(d1, d2)}$, lengths $\sqrt{${dot(d1, d1)}}$ and $\sqrt{${dot(d2, d2)}}$. $\cos\theta=\dfrac{|${dot(d1, d2)}|}{\sqrt{${dot(d1, d1)}}\sqrt{${dot(d2, d2)}}}=${r4(c)}$, so $\theta\approx${r4(th)}^\circ$.</p>`,
    'The points in the numerators play no part in the angle.', { calc: () => deg(acos(abs(dot(d1, d2)) / (nrm(d1) * nrm(d2)))) });
}));

// plane through three points
add(...[[[1, 0, 0], [0, 3, 0], [0, 0, 2]], [[1, 1, 1], [2, 0, 3], [0, 3, 2]], [[2, 1, 0], [1, 3, 1], [0, 2, 2]], [[1, 2, 1], [3, 2, 2], [2, 4, 0]]].map(([A, B, C], i) => {
  let n = cross(vsub(B, A), vsub(C, A)); const g = gcd3(n); n = n.map((t) => t / g); const first = n.find((t) => t !== 0); if (first < 0) n = n.map((t) => -t);
  const d = dot(n, A);
  const good = `$${peq(n, d)}$`, w1 = `$${peq(n, -d)}$`, w2 = `$${peq([n[1], n[0], n[2]], d)}$`, w3 = `$${peq([n[0], n[1], -n[2]], d)}$`;
  const cr = cross(vsub(B, A), vsub(C, A));
  return M(2, 'equation of a plane', R`The plane through $A${pt(A)}$, $B${pt(B)}$ and $C${pt(C)}$ is`, good, [w1, w2, w3],
    R`<p>$\overrightarrow{AB}=${pt(vsub(B, A))}$ and $\overrightarrow{AC}=${pt(vsub(C, A))}$. Normal $=\overrightarrow{AB}\times\overrightarrow{AC}=${pt(cr)}\propto${pt(n)}$. Constant: $${pt(n)}\cdot${pt(A)}=${d}$. So the plane is $${peq(n, d)}$.</p>`, 'Check that all three points satisfy your equation.');
}));

// shortest distance between skew lines
add(...[[[1, 2, 3], [1, -1, 2], [2, 0, 1], [2, 1, -1]], [[0, 1, 0], [2, 1, 1], [1, 0, 2], [1, -1, 3]], [[3, 0, 1], [1, 2, -2], [0, 1, 1], [2, 0, 1]], [[1, 1, 1], [0, 1, 2], [2, 3, 0], [1, 1, 0]]].map(([a1, b1, a2, b2], i) => {
  const c = cross(b1, b2), s = dot(vsub(a2, a1), c), dist = abs(s) / nrm(c);
  return D(3, 'shortest distance', R`Find the shortest distance between the lines $${vecLine(a1, b1)}$ and $\vec r=(${vec(a2)})+\mu(${vec(b2)})$.`, r4(dist),
    R`<p>$\vec b_1\times\vec b_2=${pt(c)}$, length $\sqrt{${dot(c, c)}}$. $\vec a_2-\vec a_1=${pt(vsub(a2, a1))}$. Scalar triple product $=${s}$. Distance $=\dfrac{|${s}|}{\sqrt{${dot(c, c)}}}=${r4(dist)}$.</p>`, 'Take the absolute value of the triple product.', { calc: () => lldist(a1, b1, a2, b2) });
}));

// image of a point in a plane
add(...[[[1, 2, 0], [1, 1, 1], 2], [[0, 1, 3], [2, -1, 2], 1], [[2, 0, 1], [1, 2, 2], 3], [[1, 1, 1], [3, -4, 0], 1], [[-1, 2, 3], [1, -2, 2], 2]].map(([F, n, k], i) => {
  const P = vadd(F, vsc(k, n)), d = dot(n, F), img = vsub(F, vsc(k, n));
  return I(i < 2 ? 3 : 4, 'image of a point in a plane', R`Find $x+y+z$ for the image of $P${pt(P)}$ in the plane $${peq(n, d)}$.`, img[0] + img[1] + img[2],
    R`<p>Value of the plane expression at $P$: $${dot(n, P)}-${d}=${dot(n, P) - d}$. $|n|^2=${dot(n, n)}$. Image $=P-2\cdot\dfrac{${dot(n, P) - d}}{${dot(n, n)}}${pt(n)}=${pt(P)}-${2 * k}${pt(n)}=${pt(img)}$. Sum $=${img[0] + img[1] + img[2]}$.</p>`,
    'Image $=P-2\\times$ (value/$|n|^2$) $\\times n$.', { calc: () => { const v = (dot(n, P) - d) / dot(n, n); const Q = vsub(P, vsc(2 * v, n)); return Math.round(Q[0] + Q[1] + Q[2]); } });
}));

// foot and image in a line
add(...[[[1, 0, 2], [2, 1, 2], 1, [1, 0, 1], 'foot'], [[0, 1, 1], [1, 2, 2], 2, [0, 1, 0], 'dist'], [[2, 2, 0], [2, 3, 6], 1, [1, 1, 0], 'image']].map(([a, d, lam, w, kind], i) => {
  const v = cross(d, w), F = vadd(a, vsc(lam, d)), P = vadd(F, v), Q = vsub(vsc(2, F), P);
  const line = R`$${vecLine(a, d)}$`;
  if (kind === 'foot') return I(4, 'foot of the perpendicular', R`Find $x+y+z$ for the foot of the perpendicular from $P${pt(P)}$ to the line ${line}.`, F[0] + F[1] + F[2],
    R`<p>$F=a+\lambda d$. $\overrightarrow{PF}\cdot d=0$ gives $\lambda=\dfrac{(P-a)\cdot d}{d\cdot d}=\dfrac{${dot(vsub(P, a), d)}}{${dot(d, d)}}=${lam}$. $F=${pt(F)}$, sum $=${F[0] + F[1] + F[2]}$.</p>`, 'Use the dot product with the direction ratios.', { calc: () => { const l = dot(vsub(P, a), d) / dot(d, d); const f = vadd(a, vsc(l, d)); return Math.round(f[0] + f[1] + f[2]); } });
  if (kind === 'dist') return D(3, 'distance of a point from a line', R`Find the perpendicular distance of $P${pt(P)}$ from the line ${line}.`, r4(nrm(v)),
    R`<p>$(P-a)\times d=${pt(cross(vsub(P, a), d))}$, length $\sqrt{${dot(cross(vsub(P, a), d), cross(vsub(P, a), d))}}$. Divide by $|d|=\sqrt{${dot(d, d)}}$: distance $=${r4(nrm(v))}$.</p>`, 'Divide by $|d|$.', { calc: () => nrm(cross(vsub(P, a), d)) / nrm(d) });
  return I(4, 'image of a point in a line', R`Find $x+y+z$ for the image of $P${pt(P)}$ in the line ${line}.`, Q[0] + Q[1] + Q[2],
    R`<p>Foot: $\lambda=\dfrac{(P-a)\cdot d}{d\cdot d}=\dfrac{${dot(vsub(P, a), d)}}{${dot(d, d)}}=${lam}$, $F=${pt(F)}$. Image $=2F-P=${pt(Q)}$. Sum $=${Q[0] + Q[1] + Q[2]}$.</p>`, 'Image = 2 × foot − point.', { calc: () => { const l = dot(vsub(P, a), d) / dot(d, d); const f = vadd(a, vsc(l, d)); const q = vsub(vsc(2, f), P); return Math.round(q[0] + q[1] + q[2]); } });
}));

// where a line meets a plane
add(...[[[1, 0, 2], [2, 1, 3], 1, [1, 2, -1]], [[3, -1, 0], [1, 2, -2], 2, [2, -1, 3]], [[0, 2, 1], [3, -1, 1], 3, [1, 1, 2]]].map(([a, d, lam, n], i) => {
  const X = vadd(a, vsc(lam, d)), e = dot(n, X);
  return I(2, 'line and plane', R`The line $${symLine(a, d)}$ meets the plane $${peq(n, e)}$ at a point. Find $x+y+z$ for that point.`, X[0] + X[1] + X[2],
    R`<p>A point on the line is $(${a[0]}+${d[0]}\lambda,\ ${a[1]}+(${d[1]})\lambda,\ ${a[2]}+(${d[2]})\lambda)$. Putting this in the plane gives $${dot(n, a)}+${dot(n, d)}\lambda=${e}$, so $\lambda=${lam}$. The point is $${pt(X)}$, sum $=${X[0] + X[1] + X[2]}$.</p>`, 'Solve for $\\lambda$ before finding the point.', { calc: () => { const l = (e - dot(n, a)) / dot(n, d); const p = vadd(a, vsc(l, d)); return Math.round(p[0] + p[1] + p[2]); } });
}));

// ---------- assertion-reason ----------
add(
  A(2, 'direction cosines', 'The direction cosines of a line are unique.', R`For direction cosines $l,m,n$ we always have $l^2+m^2+n^2=1$.`, 3,
    R`<p>R is true. A is false: reversing the direction of the line changes every sign, giving a second set $(-l,-m,-n)$. So a line has two sets of direction cosines (unlike direction ratios, which are scaled in infinitely many ways).</p>`, 'A line without a chosen direction has two sets.'),
  A(3, 'parallel lines', R`The lines $\dfrac{x-1}2=\dfrac{y-2}3=\dfrac{z-3}4$ and $\dfrac{x-2}4=\dfrac{y-4}6=\dfrac{z-6}8$ are parallel and distinct.`, R`$(4,6,8)=2(2,3,4)$.`, 1,
    R`<p>R is true, so the lines are parallel, but R alone does not show they are distinct. They are distinct because $(2,4,6)$ is not on the first line: $\dfrac{2-1}2=\dfrac12$ while $\dfrac{4-2}3=\dfrac23$. A is true, R true, but R does not fully explain A.</p>`, 'Parallel lines can coincide; check a point.'),
  A(3, 'skew lines', 'Two skew lines can never be parallel.', 'Skew lines are not coplanar, while parallel lines are always coplanar.', 0,
    R`<p>Both true, and R explains A: any two parallel lines lie in a common plane, but skew lines do not, so skew lines cannot be parallel.</p>`, 'Skew means no plane contains both.'),
  A(3, 'planes', R`The planes $2x-y+z=3$ and $4x-2y+2z=6$ are the same plane.`, 'Their normals $(2,-1,1)$ and $(4,-2,2)$ are proportional.', 1,
    R`<p>R is true, but proportional normals alone only make the planes parallel. A is true because the whole equations are proportional ($\times2$ including the constant). So R is not a complete explanation.</p>`, 'Compare the constants as well.'),
  A(4, 'line and plane', R`The angle between the line with direction ratios $(1,2,2)$ and the plane $x+2y+2z=1$ is $0^\circ$.`, 'The line is parallel to the normal of the plane.', 3,
    R`<p>R is true: $(1,2,2)$ is the normal direction. A is false: if the line is along the normal it is perpendicular to the plane, so the angle is $90^\circ$. ($\sin\theta=\dfrac{9}{3\cdot3}=1$.)</p>`, 'Parallel to the normal means perpendicular to the plane.'),
  A(4, 'shortest distance', R`For parallel lines, the distance can be found from $\dfrac{|(\vec a_2-\vec a_1)\cdot(\vec b_1\times\vec b_2)|}{|\vec b_1\times\vec b_2|}$.`, R`For parallel lines $\vec b_1\times\vec b_2=\vec 0$.`, 3,
    R`<p>R is true, which makes the formula $\dfrac00$. So A is false. For parallel lines use $\dfrac{|(\vec a_2-\vec a_1)\times\vec b|}{|\vec b|}$.</p>`, 'The skew formula fails for parallel lines.'),
  A(3, 'image of a point', 'The image of a point $P$ in a plane lies on the opposite side of the plane at the same distance as $P$.', 'The foot of the perpendicular from $P$ is the midpoint of $PP\'$.', 0,
    R`<p>Both true. R is the definition of the image and gives A: $P'$ is as far beyond the plane as $P$ is before it.</p>`, 'Image = 2 × foot − point.'),
  A(5, 'planes through lines', 'Through a given line $L_1$, there is exactly one plane parallel to a skew line $L_2$.', 'Two skew lines have no common point.', 1,
    R`<p>A is true: the plane through $L_1$ with normal $\vec b_1\times\vec b_2$ is the only one parallel to $L_2$. R is true but is not the reason; uniqueness comes from the normal being fixed by both directions.</p>`, 'Fix the normal first.'),
  A(2, 'equation of a line', R`The $x$-axis has equation $\dfrac x1=\dfrac y0=\dfrac z0$.`, 'A line along the $x$-axis has direction ratios $(1,0,0)$ and passes through the origin.', 0,
    R`<p>Both true. The ratios $(1,0,0)$ and the point $(0,0,0)$ give $\dfrac x1=\dfrac y0=\dfrac z0$, which stands for $y=0,z=0$.</p>`, 'Zero denominators freeze that coordinate.'),
  A(2, 'equation of a plane', R`A plane $ax+by+cz=d$ is parallel to the $x$-axis exactly when $a=0$.`, R`The normal $(a,b,c)$ of the plane must be parallel to the $x$-axis.`, 2,
    R`<p>A is true: the normal must be perpendicular to the $x$-axis direction $(1,0,0)$, giving $a=0$. R is false: it is perpendicular, not parallel.</p>`, 'A plane is parallel to a line when the normal is perpendicular to it.'),
);

// ---------- statements ----------
add(
  S(2, 'direction cosines', R`$\left(\dfrac12,\dfrac12,\dfrac12\right)$ can be the direction cosines of a line.`, R`For direction cosines, $l^2+m^2+n^2=1$.`, 2,
    R`<p>II is true. I is false: $\dfrac14+\dfrac14+\dfrac14=\dfrac34\ne1$.</p>`, 'Test the sum of squares.'),
  S(3, 'angle between lines', R`Lines with direction ratios $(1,2,3)$ and $(2,4,6)$ are parallel.`, R`Lines with direction ratios $(1,2,3)$ and $(3,-3,1)$ are perpendicular.`, 0,
    R`<p>I: $(2,4,6)=2(1,2,3)$, parallel. II: $3-6+3=0$, perpendicular. Both true.</p>`, 'Parallel needs proportional ratios; perpendicular needs a zero dot product.'),
  S(3, 'skew lines', 'Two lines in space that do not meet are parallel.', 'There exist pairs of lines in space that are neither parallel nor intersecting.', 2,
    R`<p>I is false: they could be skew. II is true: skew lines are exactly those pairs.</p>`, 'In a plane non-meeting means parallel, but not in space.'),
  S(4, 'parallel planes', R`The distance between $x+y+z=3$ and $2x+2y+2z=9$ is $\dfrac{\sqrt3}2$.`, R`The distance between $ax+by+cz=d_1$ and $kax+kby+kcz=d_2$ is $\dfrac{|d_1-d_2|}{\sqrt{a^2+b^2+c^2}}$.`, 1,
    R`<p>I: rewrite the second as $x+y+z=4.5$, distance $=\dfrac{1.5}{\sqrt3}=\dfrac{\sqrt3}2$. True. II is false: after dividing by $k$ the constant becomes $d_2/k$, so the distance is $\dfrac{|d_1-d_2/k|}{\sqrt{a^2+b^2+c^2}}$.</p>`, 'Make the two normals identical before subtracting constants.'),
  SC(4, 'mixed concepts', [R`The line $\dfrac{x-1}2=\dfrac{y-1}3=\dfrac{z-1}4$ passes through the origin.`, R`The direction cosines of a line satisfy $l^2+m^2+n^2=1$.`, R`The plane $\dfrac xa+\dfrac yb+\dfrac zc=1$ has intercepts $a$, $b$, $c$ on the axes.`, R`The angle $\theta$ between a line and a plane is given by $\cos\theta=\dfrac{|\vec b\cdot\vec n|}{|\vec b||\vec n|}$.`], '2', ['1', '3', '4'],
    R`<p>1 is false: the origin gives $-\dfrac12\ne-\dfrac13$. 2 true. 3 true. 4 false: it is $\sin\theta$ (the cosine gives the angle with the normal). Two are correct.</p>`, 'Sine for line and plane.'),
  S(3, 'coplanar lines', 'Coplanar lines always intersect.', 'Coplanar lines either intersect or are parallel.', 2,
    R`<p>I is false: parallel lines are coplanar but never meet. II is true.</p>`, 'Parallel lines are the exception.'),
  SC(3, 'mixed concepts', ['A plane through the origin has no constant term in its equation.', R`The planes $2x+3y-z=1$ and $4x+6y-2z=5$ are parallel.`, R`The distance of the origin from $x+y+z=\sqrt3$ is $1$.`, R`The point $(1,1,1)$ lies on $x+y+z=6$.`], '3', ['2', '4', '1'],
    R`<p>1 true. 2 true (proportional normals, different constants). 3 true: $\dfrac{\sqrt3}{\sqrt3}=1$. 4 false: $1+1+1=3\ne6$. Three are correct.</p>`, 'Check each separately.'),
);

// ---------- multi-correct ----------
add(
  X(2, 'direction cosines', 'Which of these triples can be the direction cosines of a line?',
    [R`$\left(\dfrac1{\sqrt3},\dfrac1{\sqrt3},\dfrac1{\sqrt3}\right)$`, R`$\left(\dfrac12,\dfrac12,\dfrac1{\sqrt2}\right)$`, R`$\left(\dfrac23,\dfrac23,\dfrac13\right)$`, R`$\left(\dfrac12,\dfrac12,\dfrac12\right)$`, R`$\left(\dfrac35,\dfrac45,\dfrac15\right)$`], [0, 1, 2],
    R`<p>Squares must add to 1. A: $\dfrac13\cdot3=1$ yes. B: $\dfrac14+\dfrac14+\dfrac12=1$ yes. C: $\dfrac49+\dfrac49+\dfrac19=1$ yes. D: $\dfrac34$ no. E: $\dfrac{26}{25}$ no.</p>`, 'Add the squares.'),
  X(3, 'equation of a line', R`Consider the line $\dfrac{x-1}2=\dfrac{y+1}3=\dfrac{z-2}6$. Which statements are correct?`,
    [R`its direction cosines are $\left(\dfrac27,\dfrac37,\dfrac67\right)$ (positive choice)`, R`it passes through $(3,2,8)$`, R`it makes $\cos^{-1}\dfrac27$ with the $x$-axis`, R`it is parallel to the $y$-axis`, R`it is perpendicular to the $z$-axis`], [0, 1, 2],
    R`<p>$\sqrt{4+9+36}=7$ gives A. At $\lambda=1$ the point is $(3,2,8)$: B true. $\cos\alpha=\dfrac27$: C true. D false: direction is not $(0,1,0)$. E false: $\cos\gamma=\dfrac67\ne0$.</p>`, 'Perpendicular to an axis needs that direction cosine to be 0.'),
  X(3, 'line and plane', R`Which lines are perpendicular to the plane $2x-y+3z=5$?`,
    [R`direction ratios $(2,-1,3)$`, R`direction ratios $(4,-2,6)$`, R`direction ratios $(1,2,0)$`, R`direction ratios $(-2,1,-3)$`], [0, 1, 3],
    R`<p>A line is perpendicular to the plane when its direction is parallel to the normal $(2,-1,3)$. $(4,-2,6)$ and $(-2,1,-3)$ are multiples of it. $(1,2,0)$ is not (it is parallel to the plane: $2-2=0$).</p>`, 'Multiples of the normal, including negative ones.'),
  X(4, 'planes', R`The plane $x+2y+2z=9$ has which properties?`,
    [R`its distance from the origin is 3`, R`its intercept on the $x$-axis is 9`, R`it is parallel to the line with direction ratios $(2,-1,0)$`, R`it contains the point $(1,2,3)$`, R`the direction cosines of its normal are $\left(\dfrac13,\dfrac23,\dfrac23\right)$`], [0, 1, 2, 4],
    R`<p>A: $\dfrac9{\sqrt9}=3$. B: $y=z=0$ gives $x=9$. C: $(2,-1,0)\cdot(1,2,2)=0$. D: $1+4+6=11\ne9$, false. E: $(1,2,2)/3$.</p>`, 'Test a point by substitution.'),
  X(4, 'planes', R`For the planes $x+y+z=1$ and $2x-y+z=3$, which statements are correct?`,
    [R`the line of intersection has direction ratios proportional to $(2,1,-3)$`, R`the acute angle between them has $\cos\theta=\dfrac{\sqrt2}3$`, R`the point $(1,0,0)$ lies on both planes`, R`the point $\left(\dfrac43,-\dfrac13,0\right)$ lies on both planes`, R`the planes are perpendicular`], [0, 1, 3],
    R`<p>A: $(1,1,1)\times(2,-1,1)=(2,1,-3)$. B: $\cos\theta=\dfrac{|2-1+1|}{\sqrt3\sqrt6}=\dfrac2{\sqrt{18}}=\dfrac{\sqrt2}3$. C: $(1,0,0)$ gives $1=1$ but $2\ne3$, false. D: $\dfrac43-\dfrac13=1$ and $\dfrac83+\dfrac13=3$, true. E: dot product $2\ne0$, false.</p>`, 'Check both equations for each point.'),
  X(4, 'skew lines', R`For $L_1:\ \vec r=(1,1,0)+\lambda(2,-1,1)$ and $L_2:\ \vec r=(2,1,-1)+\mu(3,-5,2)$, which statements are correct?`,
    [R`$L_1$ and $L_2$ are not parallel`, R`$L_1$ and $L_2$ do not intersect`, R`the shortest distance is $\dfrac{10}{\sqrt{59}}$`, R`the shortest distance is $\dfrac1{\sqrt{59}}$`, R`$L_1$ and $L_2$ are coplanar`], [0, 1, 2],
    R`<p>$\vec b_1\times\vec b_2=(3,-1,-7)\ne\vec0$, so not parallel. The triple product is $10\ne0$, so no intersection and not coplanar; the distance is $\dfrac{10}{\sqrt{59}}$.</p>`, 'A non-zero triple product means skew.'),
  X(5, 'planes through lines', R`Which planes contain the line $\dfrac{x-1}1=\dfrac{y-2}2=\dfrac{z-3}{-1}$?`,
    [R`$x+y+3z=12$`, R`$2x-y=0$`, R`$x+y+z=6$`, R`$x-y-z=-4$`, R`$x-y-z=0$`], [0, 1, 3],
    R`<p>The line passes through $(1,2,3)$ with direction $(1,2,-1)$. A plane contains it if the normal is perpendicular to the direction and the point fits. A: $1+2-3=0$ ✓, $1+2+9=12$ ✓. B: $2-2=0$ ✓, $2-2=0$ ✓. C: $1+2-1=2\ne0$ ✗. D: $1-2+1=0$ ✓, $1-2-3=-4$ ✓. E: direction OK but $1-2-3=-4\ne0$ ✗ (parallel, not containing).</p>`, 'Two conditions: direction and a point.'),
);

// ---------- match ----------
add(
  MT(3, 'distance from a point to a plane', 'm1', 'Match List I with List II.', 'A-r, B-q, C-p, D-s', ['A-q, B-r, C-p, D-s', 'A-r, B-p, C-q, D-s', 'A-r, B-q, C-s, D-p'],
    R`<p>A: $\dfrac{21}{7}=3$ (r). B: $\dfrac6{3}=2$ (q). C: $\dfrac7{7}=1$ (p). D: $\dfrac{12}3=4$ (s).</p>`, 'Divide by the length of the normal: 7, 3, 7, 3.'),
  MT(2, 'direction cosines', 'm2', 'Match List I with List II.', 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-p, C-q, D-s'],
    R`<p>A: $\dfrac3{13}$ ($\sqrt{9+16+144}=13$). B: $\dfrac1{\sqrt3}$. C: $\dfrac27$. D: $1$.</p>`, 'The length of $(3,4,12)$ is 13.'),
  MT(3, 'two lines', 'm3', 'Match List I with List II.', 'A-p, B-r, C-q, D-s', ['A-s, B-r, C-q, D-p', 'A-p, B-q, C-r, D-s', 'A-r, B-p, C-q, D-s'],
    R`<p>A: same direction $(1,2,3)$; the second goes through $(2,1,1)$, which is off the first line: parallel, distinct (p). B: both through $(2,3,1)$ with different directions: intersect (r). C: triple product $10\ne0$: skew (q). D: same direction and $(2,2,2)$ lies on the first: the same line (s).</p>`, 'Parallel lines may coincide; test a point.'),
  MT(2, 'equation of a plane', 'm4', 'Match List I with List II.', 'A-q, B-r, C-s, D-p', ['A-r, B-q, C-s, D-p', 'A-q, B-s, C-r, D-p', 'A-q, B-r, C-p, D-s'],
    R`<p>A: intercepts 1, 2, 3 gives $6x+3y+2z=6$. B: normal $(1,2,2)$ through the origin: $x+2y+2z=0$. C: $z=4$. D: normal along the $x$-axis through $x=5$: $x=5$.</p>`, 'Perpendicular to the $x$-axis means normal along $x$.'),
);

// ---------- passages ----------
add(
  PI(3, 'shortest distance', 'p1', R`Find $|\vec b_1\times\vec b_2|^2$.`, 59,
    R`<p>$\vec b_1\times\vec b_2=(3,-1,-7)$. Square of its length: $9+1+49=59$.</p>`, 'Do not take the square root yet.', { calc: () => { const c = cross([2, -1, 1], [3, -5, 2]); return dot(c, c); } }),
  PI(3, 'shortest distance', 'p1', R`Find $(\vec a_2-\vec a_1)\cdot(\vec b_1\times\vec b_2)$.`, 10,
    R`<p>$\vec a_2-\vec a_1=(1,0,-1)$ and $\vec b_1\times\vec b_2=(3,-1,-7)$. Dot product $=3+0+7=10$.</p>`, 'Subtract $\\vec a_1$ from $\\vec a_2$.', { calc: () => dot(vsub([2, 1, -1], [1, 1, 0]), cross([2, -1, 1], [3, -5, 2])) }),
  PD(3, 'shortest distance', 'p1', R`Find the shortest distance between $L_1$ and $L_2$.`, 1.3019,
    R`<p>$\dfrac{10}{\sqrt{59}}\approx1.30$.</p>`, 'Divide the triple product by $|\\vec b_1\\times\\vec b_2|$.', { calc: () => lldist([1, 1, 0], [2, -1, 1], [2, 1, -1], [3, -5, 2]) }),
  PI(2, 'equation of a plane', 'p2', R`The equation of $\Pi$ is $px+qy+rz=6$ with positive integers $p,q,r$. Find $p+q+r$.`, 11,
    R`<p>Intercepts 1, 2, 3: $\dfrac x1+\dfrac y2+\dfrac z3=1$, i.e. $6x+3y+2z=6$. $p+q+r=6+3+2=11$.</p>`, 'Multiply the intercept form by 6.', { calc: () => 6 + 3 + 2 }),
  PD(3, 'distance from a point to a plane', 'p2', R`Find the distance of the origin from $\Pi$.`, 0.8571,
    R`<p>$\dfrac{|{-6}|}{\sqrt{36+9+4}}=\dfrac67\approx0.86$.</p>`, 'The normal $(6,3,2)$ has length 7.', { calc: () => pdist([0, 0, 0], [6, 3, 2], 6) }),
  PD(3, 'distance from a point to a plane', 'p2', R`Find the distance of $(1,1,1)$ from $\Pi$.`, 0.7143,
    R`<p>$\dfrac{|6+3+2-6|}{7}=\dfrac57\approx0.71$.</p>`, 'Substitute into $6x+3y+2z-6$.', { calc: () => pdist([1, 1, 1], [6, 3, 2], 6) }),
  PI(4, 'line and plane', 'p3', R`Find the angle in degrees between $L$ and $\Pi$.`, 0,
    R`<p>$\vec b\cdot\vec n=(2,1,-2)\cdot(1,2,2)=2+2-4=0$. So $L$ is parallel to $\Pi$ and the angle is $0^\circ$.</p>`, 'Dot product zero between line and normal means parallel to the plane.', { calc: () => Math.round(deg(asin(abs(dot([2, 1, -2], [1, 2, 2])) / 9))) }),
  PI(4, 'line and plane', 'p3', R`Find the distance between $L$ and $\Pi$.`, 6,
    R`<p>$L$ is parallel to $\Pi$, so the distance is that of $A(1,2,3)$ from $\Pi$: $\dfrac{|1+4+6-29|}{3}=\dfrac{18}3=6$.</p>`, 'Any point of the line will do.', { calc: () => Math.round(pdist([1, 2, 3], [1, 2, 2], 29)) }),
  PI(4, 'image of a point in a plane', 'p3', R`Find $x+y+z$ for the image of $A$ in $\Pi$.`, 26,
    R`<p>Value at $A$: $11-29=-18$. $|n|^2=9$. Image $=A-2\cdot\dfrac{-18}9(1,2,2)=(1,2,3)+4(1,2,2)=(5,10,11)$. Sum $=26$.</p>`, 'A is on the side where the value is negative.', { calc: () => { const A = [1, 2, 3], n = [1, 2, 2]; const t = (dot(n, A) - 29) / 9; const q = vsub(A, vsc(2 * t, n)); return Math.round(q[0] + q[1] + q[2]); } }),
  PI(3, 'foot of the perpendicular', 'p4', R`Find the value of $\lambda$ at the foot $F$.`, 2,
    R`<p>$\lambda=\dfrac{(P-a)\cdot d}{d\cdot d}=\dfrac{(4,3,4)\cdot(1,2,2)}9=\dfrac{18}9=2$.</p>`, 'Use the unit dot product formula.', { calc: () => Math.round(dot(vsub([4, 4, 6], [0, 1, 2]), [1, 2, 2]) / 9) }),
  PI(3, 'foot of the perpendicular', 'p4', R`Find $x+y+z$ for $F$.`, 13,
    R`<p>$F=(0,1,2)+2(1,2,2)=(2,5,6)$. Sum $=13$.</p>`, 'Put $\\lambda=2$ back into the line.', { calc: () => 2 + 5 + 6 }),
  PD(3, 'foot of the perpendicular', 'p4', R`Find the length $PF$.`, 2.2361,
    R`<p>$\overrightarrow{PF}=(2-4,5-4,6-6)=(-2,1,0)$, length $\sqrt5\approx2.24$.</p>`, 'Check $PF\\cdot d=-2+2+0=0$.', { calc: () => nrm(vsub([2, 5, 6], [4, 4, 6])) }),
);

// ---------- mixed with other chapters ----------
add(
  I(3, 'mixed', R`The vectors $(1,2,3)$, $(4,5,6)$ and $(7,8,k)$ are coplanar. Find $k$.`, 9,
    R`<p>Coplanar vectors have a zero determinant: $\begin{vmatrix}1&2&3\\4&5&6\\7&8&k\end{vmatrix}=1(5k-48)-2(4k-42)+3(32-35)=5k-48-8k+84-9=-3k+27=0$, so $k=9$.</p>`, 'Expand along the first row carefully.', { calc: () => { for (let k = -20; k <= 20; k++) if (dot([1, 2, 3], cross([4, 5, 6], [7, 8, k])) === 0) return k; } }),
  D(4, 'mixed', R`Using calculus, the least distance from the origin to the line $\vec r=(1,2,2)+\lambda(2,-1,1)$ is $\sqrt{f_{\min}}$ where $f(\lambda)$ is the square of the distance. Find the least distance.`, 2.8868,
    R`<p>$f(\lambda)=(1+2\lambda)^2+(2-\lambda)^2+(2+\lambda)^2=6\lambda^2+4\lambda+9$. $f'=12\lambda+4=0$ gives $\lambda=-\dfrac13$. $f_{\min}=6\cdot\dfrac19-\dfrac43+9=\dfrac{25}3$. Least distance $=\sqrt{25/3}\approx2.89$.</p>`, 'Minimise the square of the distance, then take the root.', { calc: () => { let m = 1e9; for (let l = -3; l <= 3; l += 0.0001) m = Math.min(m, nrm(vadd([1, 2, 2], vsc(l, [2, -1, 1])))); return m; } }),
  D(4, 'mixed', R`Find the area of the triangle with vertices $A(1,0,0)$, $B(0,2,0)$ and $C(0,0,3)$.`, 3.5,
    R`<p>$\overrightarrow{AB}=(-1,2,0)$, $\overrightarrow{AC}=(-1,0,3)$. Cross product $=(6,3,2)$, length $7$. Area $=\dfrac12\cdot7=3.5$. (The same $(6,3,2)$ is the normal of the plane $6x+3y+2z=6$.)</p>`, 'Area is half the length of the cross product.', { calc: () => nrm(cross([-1, 2, 0], [-1, 0, 3])) / 2 }),
);

// ---------- more warm-ups, harder problems and top-rank problems ----------
add(
  M(1, 'equation of a plane', 'The equation of the $xy$-plane is', '$z=0$', ['$x=0$', '$y=0$', '$x+y=0$'],
    R`<p>Every point of the $xy$-plane has $z=0$.</p>`, 'The plane takes its name from the axes it contains, so the third variable is zero.'),
  I(1, 'distance formula', R`Find the distance between the points $(1,2,3)$ and $(4,6,3)$.`, 5,
    R`<p>$\sqrt{(4-1)^2+(6-2)^2+(3-3)^2}=\sqrt{9+16+0}=5$.</p>`, 'Square each difference, add, then take the root.', { calc: () => Math.round(nrm(vsub([4, 6, 3], [1, 2, 3]))) }),
  M(1, 'direction cosines', 'The direction ratios of the $x$-axis can be taken as', '$(1,0,0)$', ['$(0,1,0)$', '$(0,0,1)$', '$(1,1,1)$'],
    R`<p>The $x$-axis points along $(1,0,0)$. Any non-zero multiple also works.</p>`, 'Direction cosines of the $x$-axis are $(\\pm1,0,0)$.'),
  M(1, 'intercepts', R`The plane $\dfrac x2+\dfrac y3+\dfrac z6=1$ cuts the $y$-axis at`, '$(0,3,0)$', ['$(0,2,0)$', '$(0,6,0)$', '$(0,\\tfrac13,0)$'],
    R`<p>Put $x=0$, $z=0$: $\dfrac y3=1$, $y=3$.</p>`, 'The number under $y$ is the intercept on the $y$-axis.'),
  I(1, 'distance from a point to a plane', R`Find the distance of the origin from the plane $3x+4y=10$.`, 2,
    R`<p>$\dfrac{|-10|}{\sqrt{9+16+0}}=\dfrac{10}5=2$.</p>`, 'The missing $z$ term means a zero coefficient.', { calc: () => Math.round(pdist([0, 0, 0], [3, 4, 0], 10)) }),
  M(1, 'equation of a plane', 'The equation of the $yz$-plane is', '$x=0$', ['$y=0$', '$z=0$', '$y+z=0$'],
    R`<p>Every point of the $yz$-plane has $x=0$.</p>`, 'The missing letter is the zero one.'),
  M(1, 'equation of a line', R`The vector equation of the line through the origin along $\hat i+2\hat j+3\hat k$ is`, R`$\vec r=\lambda(\hat i+2\hat j+3\hat k)$`, [R`$\vec r=\hat i+2\hat j+3\hat k$`, R`$\vec r\cdot(\hat i+2\hat j+3\hat k)=0$`, R`$\vec r=\lambda\hat i+2\hat j+3\hat k$`],
    R`<p>A line through the point with position vector $\vec a$ with direction $\vec b$ is $\vec r=\vec a+\lambda\vec b$. Here $\vec a=\vec 0$.</p>`, 'The parameter multiplies the whole direction vector.'),
  I(1, 'distance formula', R`Find the distance of the point $(2,3,6)$ from the origin.`, 7,
    R`<p>$\sqrt{4+9+36}=\sqrt{49}=7$.</p>`, 'Add the squares of all three coordinates.', { calc: () => Math.round(nrm([2, 3, 6])) }),
  I(1, 'distance from a point to a plane', R`Find the distance of the point $(1,2,3)$ from the $xy$-plane.`, 3,
    R`<p>The $xy$-plane is $z=0$. The distance is $|z|=3$.</p>`, 'Only the $z$-coordinate matters.', { calc: () => 3 }),
  M(1, 'direction cosines', 'The direction cosines of the $y$-axis are', '$(0,1,0)$ (or $(0,-1,0)$)', ['$(1,0,0)$', '$(0,0,1)$', R`$\left(\dfrac1{\sqrt3},\dfrac1{\sqrt3},\dfrac1{\sqrt3}\right)$`],
    R`<p>The $y$-axis makes $90^\circ$ with the $x$ and $z$ axes and $0^\circ$ (or $180^\circ$) with itself.</p>`, 'Cosine of $90^\\circ$ is 0.'),
  I(1, 'direction cosines', 'How many different sets of direction cosines does a line have?', 2,
    R`<p>If $(l,m,n)$ is one set, then $(-l,-m,-n)$ is the other (the opposite direction). So there are exactly 2.</p>`, 'Direction ratios have infinitely many sets, direction cosines only two.'),
);

add(
  D(4, 'shortest distance', R`Find the shortest distance between the line through $(1,0,0)$ and $(0,1,0)$ and the $z$-axis.`, 0.7071,
    R`<p>Line 1: point $(1,0,0)$, direction $(-1,1,0)$. $z$-axis: point $(0,0,0)$, direction $(0,0,1)$. Cross product $=(1,1,0)$, length $\sqrt2$. $\vec a_2-\vec a_1=(-1,0,0)$, dot $=-1$. Distance $=\dfrac1{\sqrt2}\approx0.71$.</p>`, 'The two lines are skew; they do not meet.', { calc: () => lldist([1, 0, 0], [-1, 1, 0], [0, 0, 0], [0, 0, 1]) }),
  I(4, 'image of a point in a line', R`Find the $x$-coordinate of the image of $(1,2,3)$ in the line $x=y=z$.`, 3,
    R`<p>Direction $(1,1,1)$ through the origin. Foot: $\lambda=\dfrac{(1,2,3)\cdot(1,1,1)}3=2$, so $F=(2,2,2)$. Image $=2F-P=(4,4,4)-(1,2,3)=(3,2,1)$. The $x$-coordinate is 3.</p>`, 'Image = 2 × foot − point.', { calc: () => { const P = [1, 2, 3], d = [1, 1, 1]; const l = dot(P, d) / dot(d, d); return Math.round(2 * l * d[0] - P[0]); } }),
  I(4, 'intercepts', R`A plane through $(1,2,3)$ cuts equal intercepts $a$ on the three axes. Find the volume of the tetrahedron it makes with the coordinate planes.`, 36,
    R`<p>Equal intercepts: $x+y+z=a$. Through $(1,2,3)$: $a=6$. Volume $=\dfrac{abc}6=\dfrac{6\cdot6\cdot6}6=36$.</p>`, 'The formula is $abc/6$.', { calc: () => (6 * 6 * 6) / 6 }),
  D(4, 'line of intersection of planes', R`Find the angle in degrees between the line of intersection of $x+y+z=1$ and $2x-y+z=3$ and the $x$-axis.`, 57.6885,
    R`<p>Direction $=(1,1,1)\times(2,-1,1)=(2,1,-3)$. With $(1,0,0)$: $\cos\theta=\dfrac{2}{\sqrt{14}}$, so $\theta=\cos^{-1}(0.5345)\approx57.69^\circ$.</p>`, 'Use the cross product of the normals for the direction.', { calc: () => deg(acos(abs(dot(cross([1, 1, 1], [2, -1, 1]), [1, 0, 0])) / nrm(cross([1, 1, 1], [2, -1, 1])))) }),
  D(4, 'mixed', R`Find the volume of the tetrahedron with vertices $(0,0,0)$, $(1,2,3)$, $(2,1,4)$ and $(3,5,1)$.`, 3.6667,
    R`<p>$V=\dfrac16\left|\begin{vmatrix}1&2&3\\2&1&4\\3&5&1\end{vmatrix}\right|$. Determinant $=1(1-20)-2(2-12)+3(10-3)=-19+20+21=22$. $V=\dfrac{22}6\approx3.67$.</p>`, 'Divide by 6, not 3.', { calc: () => abs(dot([1, 2, 3], cross([2, 1, 4], [3, 5, 1]))) / 6 }),
);

add(
  I(5, 'lines meeting lines', R`The line through $P(1,2,3)$ that meets both the $x$-axis and the line $\vec r=(0,1,0)+\mu(0,0,1)$ has direction ratios $(a,b,c)$ in lowest whole numbers with $a>0$. Find $a+b+c$.`, 7,
    R`<p>The transversal lies in the plane through $P$ and the $x$-axis, and in the plane through $P$ and the second line. Plane 1: normal $(1,0,0)\times(1,2,3)=(0,-3,2)$, so $2z=3y$. Plane 2: contains direction $(0,0,1)$ and the vector $(1,1,3)$ from $(0,1,0)$ to $P$: normal $(0,0,1)\times(1,1,3)=(-1,1,0)$, plane $y=x+1$. Their intersection has direction $(1,1,\tfrac32)\propto(2,2,3)$. So $a+b+c=7$. (Check: $P$ is on both planes.)</p>`, 'A transversal is found as the intersection of two planes.', { calc: () => { const n1 = cross([1, 0, 0], [1, 2, 3]), n2 = cross([0, 0, 1], [1, 1, 3]); const d = cross(n1, n2); const g = gcd3(d); let e = d.map((t) => t / g); if (e[0] < 0) e = e.map((t) => -t); return e[0] + e[1] + e[2]; } }),
  I(5, 'shortest distance', R`The lines $\vec r=\lambda(1,1,1)$ and $\vec r=(1,0,k)+\mu(0,1,0)$ are at shortest distance $\dfrac3{\sqrt2}$. Find the sum of all possible values of $k$.`, 2,
    R`<p>$\vec b_1\times\vec b_2=(1,1,1)\times(0,1,0)=(-1,0,1)$, length $\sqrt2$. $\vec a_2-\vec a_1=(1,0,k)$, dot $=-1+k$. Distance $=\dfrac{|k-1|}{\sqrt2}=\dfrac3{\sqrt2}$, so $k-1=\pm3$, $k=4$ or $-2$. Sum $=2$.</p>`, 'The modulus gives two values of $k$.', { calc: () => { const out = []; for (let k = -20; k <= 20; k++) if (abs(lldist([0, 0, 0], [1, 1, 1], [1, 0, k], [0, 1, 0]) - 3 / sqrt(2)) < 1e-9) out.push(k); return out.reduce((s, t) => s + t, 0); } }),
  D(5, 'intercepts', R`A plane at distance 1 from the origin meets the axes at $A$, $B$, $C$, and the centroid of $ABC$ is $(g,g,g)$ with $g>0$. Find $g$.`, 0.5774,
    R`<p>Intercepts $3g,3g,3g$ (the centroid is $\left(\dfrac a3,\dfrac b3,\dfrac c3\right)$). $\dfrac1{p^2}=\dfrac1{a^2}+\dfrac1{b^2}+\dfrac1{c^2}$ gives $1=\dfrac3{9g^2}=\dfrac1{3g^2}$, so $g^2=\dfrac13$ and $g=\dfrac1{\sqrt3}\approx0.577$.</p>`, 'Use $1/p^2=1/a^2+1/b^2+1/c^2$.', { calc: () => sqrt(1 / 3) }),
  I(5, 'intercepts', R`The foot of the perpendicular from the origin to a plane is $(1,2,2)$. The plane meets the axes at $A$, $B$, $C$. Find $OA+OB+OC$.`, 18,
    R`<p>The normal is $(1,2,2)$, so the plane is $x+2y+2z=1+4+4=9$. Intercepts: $9$, $\dfrac92$, $\dfrac92$. Sum $=18$. (The foot is also the orthocentre of triangle $ABC$.)</p>`, 'The foot of the perpendicular lies on the plane.', { calc: () => 9 + 4.5 + 4.5 }),
  I(5, 'distance from a point to a line', R`Consider all planes that contain the line $\vec r=(0,1,2)+\lambda(1,2,2)$. Find the greatest possible distance of such a plane from the origin.`, 1,
    R`<p>The plane through a line is at most as far from $O$ as the line itself, and that maximum happens when the plane is perpendicular to the segment from $O$ to the foot. The foot has $\lambda=-\dfrac{(0,1,2)\cdot(1,2,2)}9=-\dfrac69=-\dfrac23$, so $F=\left(-\dfrac23,-\dfrac13,\dfrac23\right)$ and $|OF|=\sqrt{\dfrac49+\dfrac19+\dfrac49}=1$.</p>`, 'The perpendicular distance to the line is the upper limit.', { calc: () => nrm(cross([0, 1, 2], [1, 2, 2])) / 3 }),
);

// ---------- templates ----------
const NT = [[1, 2, 2], [2, 3, 6], [2, -1, 2], [1, 4, 8], [4, -4, 7], [6, 2, 3], [2, -2, 1], [3, 4, 12], [2, 6, 9], [4, 4, 7]];
/** a direction triple with a whole-number length, in random order and with random signs */
const nice = (rng) => {
  const v = [...choose(rng, NT)];
  for (let i = 2; i > 0; i--) { const j = int(rng, 0, i); [v[i], v[j]] = [v[j], v[i]]; }
  return v.map((t) => (rng() < 0.4 ? -t : t));
};
/** least-squares minimum of |c + s u + t w| over s, t (an independent way to get distances) */
const minDist = (c, u, w) => {
  const a = dot(u, u), b = dot(u, w), d = dot(w, w), e = -dot(c, u), f = -dot(c, w), det = a * d - b * b;
  let s, t;
  if (Math.abs(det) < 1e-9) { s = e / a; t = 0; } else { s = (e * d - b * f) / det; t = (a * f - b * e) / det; }
  return nrm(vadd(vadd(c, vsc(s, u)), vsc(t, w)));
};
const neq = (a, b) => JSON.stringify(a) !== JSON.stringify(b);
const sgnn = (t) => (t < 0 ? `-${-t}` : `+${t}`);

const gens = [
  // direction cosines: three kinds of question
  gen('td-g01', 1, 'mcq', 'single', 'direction cosines', (rng) => {
    const v = int(rng, 0, 2), d = nice(rng);
    let v3, q, sol;
    if (v === 0) { v3 = d; q = R`The direction cosines of a line with direction ratios $${d.join(',')}$ are`; sol = R`<p>$\sqrt{${dot(d, d)}}=${nrm(d)}$. Dividing each ratio by ${nrm(d)} gives $${dcs(d)}$.</p>`; }
    else if (v === 1) { const P = rv(rng, -3, 3), k = choose(rng, [1, 2, -1]); const Q = vadd(P, vsc(k, d)); v3 = vsub(Q, P); q = R`The direction cosines of the line from $P${pt(P)}$ to $Q${pt(Q)}$ (in the direction $P\to Q$) are`; sol = R`<p>$\overrightarrow{PQ}=${pt(v3)}$, length $\sqrt{${dot(v3, v3)}}=${nrm(v3)}$. Divide: $${dcs(v3)}$ ${gcd3(v3) > 1 ? `(the common factor ${gcd3(v3)} cancels)` : ''}.</p>`; }
    else { const p = rv(rng, -3, 3); v3 = d; q = R`The direction cosines of the line $${symLine(p, d)}$ (positive direction of the ratios) are`; sol = R`<p>The direction ratios are the denominators $${d.join(',')}$, with $\sqrt{${dot(d, d)}}=${nrm(d)}$. So $${dcs(d)}$. The point $${pt(p)}$ does not matter.</p>`; }
    const u = v3.map((t) => t / nrm(v3)); if (abs(dot(u, u) - 1) > 1e-12) throw new Error('not unit');
    const sum = abs(d[0]) + abs(d[1]) + abs(d[2]);
    const good = `$${dcs(v3)}$`, flip = [v3[0], -v3[1], v3[2]];
    const { options, answer } = shuffleOpts(rng, good, [`$${dcs(flip)}$`, `$\\left(${v3.map((t) => fr(t, sum)).join(',')}\\right)$`, `$\\left(${v3.join(',')}\\right)$`]);
    return { v, options, answer, good, q, sol };
  }, (p) => p.options.indexOf(p.good)),

  // angles: lines, planes, line and plane
  gen('td-g02', 2, 'nat', 'numeric', 'angle between lines', (rng) => {
    const v = int(rng, 0, 3);
    let b1, b2;
    do { b1 = nz(rng, -3, 3); b2 = nz(rng, -3, 3); } while (nrm(cross(b1, b2)) < 1e-9 || dot(b1, b2) === 0);
    const c = abs(dot(b1, b2)) / (nrm(b1) * nrm(b2)), th = deg(acos(c)), cc = r4(c);
    let q, sol, th2 = th;
    if (v === 0) { const p1 = rv(rng, -2, 2), p2 = rv(rng, -2, 2); q = R`Find the acute angle (in degrees) between the lines $${symLine(p1, b1)}$ and $${symLine(p2, b2)}$.`; sol = R`<p>Direction ratios $${pt(b1)}$ and $${pt(b2)}$. $\cos\theta=\dfrac{|${dot(b1, b2)}|}{\sqrt{${dot(b1, b1)}}\sqrt{${dot(b2, b2)}}}=${cc}$. $\theta=${r4(th)}^\circ$.</p>`; }
    else if (v === 1) { q = R`Find the acute angle (in degrees) between the lines $\vec r=\vec a_1+\lambda(${vec(b1)})$ and $\vec r=\vec a_2+\mu(${vec(b2)})$.`; sol = R`<p>The angle depends only on $\vec b_1=${pt(b1)}$, $\vec b_2=${pt(b2)}$. $\cos\theta=\dfrac{|${dot(b1, b2)}|}{\sqrt{${dot(b1, b1)}}\sqrt{${dot(b2, b2)}}}=${cc}$, so $\theta=${r4(th)}^\circ$.</p>`; }
    else if (v === 2) { q = R`Find the acute angle (in degrees) between the planes $${peq(b1, int(rng, 1, 9))}$ and $${peq(b2, int(rng, 1, 9))}$.`; sol = R`<p>The angle between planes is the angle between normals $${pt(b1)}$ and $${pt(b2)}$. $\cos\theta=\dfrac{|${dot(b1, b2)}|}{\sqrt{${dot(b1, b1)}}\sqrt{${dot(b2, b2)}}}=${cc}$. $\theta=${r4(th)}^\circ$.</p>`; }
    else { const s = abs(dot(b1, b2)) / (nrm(b1) * nrm(b2)); th2 = deg(asin(s)); q = R`Find the angle (in degrees) between the line $\vec r=\vec a+\lambda(${vec(b1)})$ and the plane $\vec r\cdot(${vec(b2)})=${int(rng, 1, 9)}$.`; sol = R`<p>$\sin\theta=\dfrac{|\vec b\cdot\vec n|}{|\vec b||\vec n|}=\dfrac{|${dot(b1, b2)}|}{\sqrt{${dot(b1, b1)}}\sqrt{${dot(b2, b2)}}}=${r4(s)}$. $\theta=${r4(th2)}^\circ$.</p>`; }
    return { v, b1, b2, answer: r4(th2), tol: 0.01, unit: '°', q: q + TWOD, sol };
  }, (p) => (p.v === 3 ? deg(Math.atan2(abs(dot(p.b1, p.b2)), nrm(cross(p.b1, p.b2)))) : deg(Math.atan2(nrm(cross(p.b1, p.b2)), abs(dot(p.b1, p.b2)))))),

  // shortest distances
  gen('td-g03', 3, 'nat', 'numeric', 'shortest distance', (rng) => {
    const v = int(rng, 0, 2);
    let a1, b1, a2, b2, q, sol, ans, P;
    if (v === 0) {
      do { a1 = rv(rng, -3, 3); a2 = rv(rng, -3, 3); b1 = nz(rng, -3, 3); b2 = nz(rng, -3, 3); } while (nrm(cross(b1, b2)) < 1e-9 || dot(vsub(a2, a1), cross(b1, b2)) === 0);
      const c = cross(b1, b2), s = dot(vsub(a2, a1), c); ans = abs(s) / nrm(c);
      q = R`Find the shortest distance between the skew lines $${vecLine(a1, b1)}$ and $\vec r=(${vec(a2)})+\mu(${vec(b2)})$.`;
      sol = R`<p>$\vec b_1\times\vec b_2=${pt(c)}$, length $\sqrt{${dot(c, c)}}$. $\vec a_2-\vec a_1=${pt(vsub(a2, a1))}$; triple product $=${s}$. Distance $=\dfrac{|${s}|}{\sqrt{${dot(c, c)}}}=${r4(ans)}$.</p>`;
    } else if (v === 1) {
      b1 = nice(rng); b2 = vsc(choose(rng, [1, 2, -1]), b1); a1 = rv(rng, -3, 3);
      do a2 = vadd(a1, rv(rng, -3, 3)); while (nrm(cross(vsub(a2, a1), b1)) < 1e-9);
      const w = vsub(a2, a1), c = cross(w, b1); ans = nrm(c) / nrm(b1);
      q = R`Find the distance between the parallel lines $${vecLine(a1, b1)}$ and $\vec r=(${vec(a2)})+\mu(${vec(b2)})$.`;
      sol = R`<p>The lines are parallel (direction $${pt(b1)}$, $|b|=${nrm(b1)}$). $\vec a_2-\vec a_1=${pt(w)}$. $(\vec a_2-\vec a_1)\times\vec b_1=${pt(c)}$, length $\sqrt{${dot(c, c)}}$. Distance $=\dfrac{\sqrt{${dot(c, c)}}}{${nrm(b1)}}=${r4(ans)}$.</p>`;
    } else {
      a1 = rv(rng, -3, 3); b1 = nice(rng); P = rv(rng, -4, 4);
      const c = cross(vsub(P, a1), b1); if (nrm(c) < 1e-9) throw RETRY;
      ans = nrm(c) / nrm(b1);
      q = R`Find the perpendicular distance of $P${pt(P)}$ from the line $${symLine(a1, b1)}$.`;
      sol = R`<p>$P-a=${pt(vsub(P, a1))}$, direction $${pt(b1)}$ with $|b|=${nrm(b1)}$. $(P-a)\times b=${pt(c)}$, length $\sqrt{${dot(c, c)}}$. Distance $=\dfrac{\sqrt{${dot(c, c)}}}{${nrm(b1)}}=${r4(ans)}$.</p>`;
    }
    return { v, a1, b1, a2, b2, P, answer: r4(ans), tol: 0.01, unit: '', q: q + TWOD, sol };
  }, (p) => (p.v === 2 ? minDist(vsub(p.a1, p.P), p.b1, [0, 0, 0]) : minDist(vsub(p.a1, p.a2), p.b1, vsc(-1, p.b2)))),

  // coplanarity
  gen('td-g04', 3, 'nat', 'integer', 'coplanarity', (rng) => {
    const v = int(rng, 0, 2);
    let q, sol, k;
    if (v === 0) {
      let a1, b1, b2, al, be, a2;
      do { a1 = rv(rng, -3, 3); b1 = nz(rng, -3, 3); b2 = nz(rng, -3, 3); } while (cross(b1, b2)[2] === 0);
      al = int(rng, -2, 2); be = int(rng, -2, 2); a2 = vadd(a1, vadd(vsc(al, b1), vsc(be, b2))); k = a2[2];
      q = R`The lines $${symLine(a1, b1)}$ and $\dfrac{x${a2[0] >= 0 ? '-' : '+'}${abs(a2[0])}}{${b2[0]}}=\dfrac{y${a2[1] >= 0 ? '-' : '+'}${abs(a2[1])}}{${b2[1]}}=\dfrac{z-k}{${b2[2]}}$ are coplanar. Find $k$.`.replace(/x-0/, 'x').replace(/y-0/, 'y');
      sol = R`<p>Coplanar means $(\vec a_2-\vec a_1)\cdot(\vec b_1\times\vec b_2)=0$. $\vec b_1\times\vec b_2=${pt(cross(b1, b2))}$ and $\vec a_2-\vec a_1=(${a2[0] - a1[0]},${a2[1] - a1[1]},k${sgnn(-a1[2])})$. The dot product vanishes when $\vec a_2-\vec a_1=${al}\vec b_1+${be}\vec b_2$ is in the plane of the directions, which gives $k=${k}$.</p>`;
      const chk = () => { for (let t = -200; t <= 200; t++) if (dot(vsub([a2[0], a2[1], t], a1), cross(b1, b2)) === 0) return t; };
      return { v, q, answer: k, tol: 0, sol, kk: chk() };
    }
    if (v === 1) {
      let A, B, C, al, be, Dd;
      do { A = rv(rng, -3, 3); B = rv(rng, -3, 3); C = rv(rng, -3, 3); } while (cross(vsub(B, A), vsub(C, A))[1] === 0);
      al = int(rng, -2, 2); be = int(rng, -2, 2); Dd = vadd(A, vadd(vsc(al, vsub(B, A)), vsc(be, vsub(C, A)))); k = Dd[1];
      q = R`The points $A${pt(A)}$, $B${pt(B)}$, $C${pt(C)}$ and $D(${Dd[0]},k,${Dd[2]})$ are coplanar. Find $k$.`;
      sol = R`<p>Coplanar: $\overrightarrow{AB}\cdot(\overrightarrow{AC}\times\overrightarrow{AD})=0$. Here $\overrightarrow{AD}=${al}\overrightarrow{AB}+${be}\overrightarrow{AC}$ must hold, so the triple product is zero exactly for $k=${k}$. (Expanding the determinant gives a linear equation in $k$ with this root.)</p>`;
      const chk = () => { for (let t = -200; t <= 200; t++) if (dot(vsub(B, A), cross(vsub(C, A), vsub([Dd[0], t, Dd[2]], A))) === 0) return t; };
      return { v, q, answer: k, tol: 0, sol, kk: chk() };
    }
    let u, w, al, be;
    do { u = nz(rng, -3, 3); w = nz(rng, -3, 3); } while (cross(u, w)[2] === 0);
    al = int(rng, -2, 2); be = int(rng, -2, 2); const t3 = vadd(vsc(al, u), vsc(be, w)); k = t3[2];
    q = R`The vectors $${pt(u)}$, $${pt(w)}$ and $(${t3[0]},${t3[1]},k)$ are coplanar. Find $k$.`;
    sol = R`<p>Coplanar vectors have zero determinant, so the third is a combination of the first two. From the first two coordinates: $(${t3[0]},${t3[1]})=${al}(${u[0]},${u[1]})+${be}(${w[0]},${w[1]})$. Hence $k=${al}\cdot${u[2]}+${be}\cdot${w[2]}=${k}$.</p>`;
    const chk = () => { for (let t = -200; t <= 200; t++) if (dot(u, cross(w, [t3[0], t3[1], t])) === 0) return t; };
    return { v, q, answer: k, tol: 0, sol, kk: chk() };
  }, (p) => p.kk),


  // distance from a point to a plane, and similar
  gen('td-g05', 2, 'nat', 'numeric', 'distance from a point to a plane', (rng) => {
    const v = int(rng, 0, 3);
    let q, sol, ans, n, P, d, A, B, C, Dd, d2, m;
    if (v === 0) {
      n = nice(rng); P = rv(rng, -4, 4); do d = int(rng, -12, 12); while (dot(n, P) === d);
      const val = dot(n, P) - d; ans = abs(val) / nrm(n);
      q = R`Find the distance of the point $${pt(P)}$ from the plane $${peq(n, d)}$.`;
      sol = R`<p>$n\cdot P-d=${dot(n, P)}-(${d})=${val}$ and $|n|=\sqrt{${dot(n, n)}}=${nrm(n)}$. Distance $=\dfrac{|${val}|}{${nrm(n)}}=${r4(ans)}$.</p>`;
    } else if (v === 1) {
      n = nice(rng); d = int(rng, -8, 8); do d2 = int(rng, -8, 8); while (d2 === d); m = choose(rng, [2, -2, 3]);
      ans = abs(d - d2) / nrm(n);
      q = R`Find the distance between the parallel planes $${peq(n, d)}$ and $${peq(vsc(m, n), m * d2)}$.`;
      sol = R`<p>Divide the second plane by ${m} so both have the normal $${pt(n)}$: it becomes $${peq(n, d2)}$. Then distance $=\dfrac{|${d}-(${d2})|}{${nrm(n)}}=\dfrac{${abs(d - d2)}}{${nrm(n)}}=${r4(ans)}$.</p>`;
    } else if (v === 2) {
      n = nice(rng); d = int(rng, 1, 12); ans = d / nrm(n);
      q = R`Find the distance of the origin from the plane $\vec r\cdot(${vec(n)})=${d}$.`;
      sol = R`<p>Distance $=\dfrac{|d|}{|\vec n|}=\dfrac{${d}}{\sqrt{${dot(n, n)}}}=\dfrac{${d}}{${nrm(n)}}=${r4(ans)}$.</p>`;
    } else {
      do { A = rv(rng, -3, 3); B = rv(rng, -3, 3); C = rv(rng, -3, 3); Dd = rv(rng, -4, 4); n = cross(vsub(B, A), vsub(C, A)); } while (nrm(n) < 1e-9 || dot(n, vsub(Dd, A)) === 0);
      ans = abs(dot(n, vsub(Dd, A))) / nrm(n);
      q = R`The vertices of a tetrahedron are $A${pt(A)}$, $B${pt(B)}$, $C${pt(C)}$ and $D${pt(Dd)}$. Find the height of $D$ above the face $ABC$.`;
      sol = R`<p>$\overrightarrow{AB}\times\overrightarrow{AC}=${pt(n)}$, length $\sqrt{${dot(n, n)}}$. $\overrightarrow{AD}=${pt(vsub(Dd, A))}$, $\overrightarrow{AD}\cdot n=${dot(n, vsub(Dd, A))}$. Height $=\dfrac{|${dot(n, vsub(Dd, A))}|}{\sqrt{${dot(n, n)}}}=${r4(ans)}$.</p>`;
    }
    return { v, n, P, d, A, B, C, Dd, m, d2, answer: r4(ans), tol: 0.01, unit: '', q: q + TWOD, sol };
  }, (p) => {
    if (p.v === 3) return minDist(vsub(p.A, p.Dd), vsub(p.B, p.A), vsub(p.C, p.A));
    if (p.v === 0) { const t = (p.d - dot(p.n, p.P)) / dot(p.n, p.n); return abs(t) * nrm(p.n); }
    const X = vsc(p.d / dot(p.n, p.n), p.n);
    if (p.v === 1) return abs(dot(vsc(p.m, p.n), X) - p.m * p.d2) / nrm(vsc(p.m, p.n));
    return nrm(X);
  }),

  // foot and image of a point in a plane
  gen('td-g06', 4, 'nat', 'integer', 'image of a point in a plane', (rng) => {
    const v = int(rng, 0, 2), n = nice(rng), F = rv(rng, -3, 3);
    let k; do k = int(rng, -3, 3); while (k === 0);
    const P = vadd(F, vsc(k, n)), d = dot(n, F), img = vsub(F, vsc(k, n));
    const val = dot(n, P) - d, pl = peq(n, d);
    let q, ans, sol, ax = 0;
    if (v === 0) { ans = F[0] + F[1] + F[2]; q = R`Find $x+y+z$ for the foot of the perpendicular from $P${pt(P)}$ to the plane $${pl}$.`; sol = R`<p>$n\cdot P-d=${val}$, $|n|^2=${dot(n, n)}$. Foot $=P-\dfrac{${val}}{${dot(n, n)}}${pt(n)}=${pt(P)}-${k}${pt(n)}=${pt(F)}$. Sum $=${ans}$.</p>`; }
    else if (v === 1) { ans = img[0] + img[1] + img[2]; q = R`Find $x+y+z$ for the image of $P${pt(P)}$ in the plane $${pl}$.`; sol = R`<p>$n\cdot P-d=${val}$, $|n|^2=${dot(n, n)}$. Image $=P-2\cdot\dfrac{${val}}{${dot(n, n)}}${pt(n)}=${pt(P)}-${2 * k}${pt(n)}=${pt(img)}$. Sum $=${ans}$.</p>`; }
    else { ax = int(rng, 0, 2); ans = img[ax]; q = R`The image of $P${pt(P)}$ in the plane $${pl}$ is $P'$. Find the ${['$x$', '$y$', '$z$'][ax]}-coordinate of $P'$.`; sol = R`<p>$n\cdot P-d=${val}$, $|n|^2=${dot(n, n)}$. $P'=P-${2 * k}${pt(n)}=${pt(img)}$. The ${['$x$', '$y$', '$z$'][ax]}-coordinate is $${ans}$.</p>`; }
    return { v, n, P, d, ax, answer: ans, tol: 0, q, sol };
  }, (p) => { const t = (dot(p.n, p.P) - p.d) / dot(p.n, p.n); const foot = vsub(p.P, vsc(t, p.n)), image = vsub(p.P, vsc(2 * t, p.n)); return p.v === 0 ? Math.round(foot[0] + foot[1] + foot[2]) : p.v === 1 ? Math.round(image[0] + image[1] + image[2]) : Math.round(image[p.ax]); }),

  // foot and image of a point in a line
  gen('td-g07', 4, 'nat', 'numeric', 'foot of the perpendicular', (rng) => {
    const v = int(rng, 0, 2), d = nice(rng), a = rv(rng, -3, 3);
    let w, vv; do { w = nz(rng, -2, 2); vv = cross(d, w); } while (nrm(vv) < 1e-9);
    const lam = int(rng, -2, 3), F = vadd(a, vsc(lam, d)), P = vadd(F, vv), Q = vsub(vsc(2, F), P);
    const line = R`$${symLine(a, d)}$`;
    let q, ans, sol;
    if (v === 0) { ans = F[0] + F[1] + F[2]; q = R`Find $x+y+z$ for the foot of the perpendicular from $P${pt(P)}$ to the line ${line}.`; sol = R`<p>$\lambda=\dfrac{(P-a)\cdot d}{d\cdot d}=\dfrac{${dot(vsub(P, a), d)}}{${dot(d, d)}}=${lam}$. Foot $F=a+\lambda d=${pt(F)}$. Sum $=${ans}$.</p>`; }
    else if (v === 1) { ans = Q[0] + Q[1] + Q[2]; q = R`Find $x+y+z$ for the image of $P${pt(P)}$ in the line ${line}.`; sol = R`<p>$\lambda=\dfrac{(P-a)\cdot d}{d\cdot d}=${lam}$, foot $F=${pt(F)}$. Image $=2F-P=${pt(Q)}$. Sum $=${ans}$.</p>`; }
    else { ans = nrm(vv); q = R`Find the length of the perpendicular from $P${pt(P)}$ to the line ${line}.${TWOD}`; sol = R`<p>Foot $F=${pt(F)}$ (from $\lambda=${lam}$). $PF=${pt(vv)}$, length $\sqrt{${dot(vv, vv)}}=${r4(ans)}$.</p>`; }
    return { v, a, d, P, answer: r4(ans), tol: v === 2 ? 0.01 : 0, unit: '', q, sol };
  }, (p) => { const l = dot(vsub(p.P, p.a), p.d) / dot(p.d, p.d); const F = vadd(p.a, vsc(l, p.d)); const Q = vsub(vsc(2, F), p.P); return p.v === 0 ? F[0] + F[1] + F[2] : p.v === 1 ? Q[0] + Q[1] + Q[2] : nrm(vsub(p.P, F)); }),

  // line and plane
  gen('td-g08', 3, 'nat', 'numeric', 'line and plane', (rng) => {
    const v = int(rng, 0, 3);
    let q, sol, ans, a, d, n, e, lam, X, w;
    if (v === 0 || v === 1) {
      a = rv(rng, -3, 3);
      do { d = nz(rng, -3, 3); n = nz(rng, -3, 3); } while (dot(n, d) === 0);
      lam = int(rng, -3, 3); X = vadd(a, vsc(lam, d)); e = dot(n, X);
      if (v === 0) { ans = X[0] + X[1] + X[2]; q = R`The line $${symLine(a, d)}$ meets the plane $${peq(n, e)}$ at a point. Find $x+y+z$ for that point.`; sol = R`<p>A point of the line is $a+\lambda d$. Substituting in the plane: $${dot(n, a)}+${dot(n, d)}\lambda=${e}$, so $\lambda=${lam}$. The point is $${pt(X)}$, sum $=${ans}$.</p>`; }
      else { ans = lam; q = R`The line $${vecLine(a, d)}$ meets the plane $\vec r\cdot(${vec(n)})=${e}$ at the point with parameter $\lambda=\lambda_0$. Find $\lambda_0$.`; sol = R`<p>$(a+\lambda d)\cdot n=${e}$ gives $${dot(n, a)}+${dot(n, d)}\lambda=${e}$, so $\lambda_0=${lam}$.</p>`; }
      return { v, a, d, n, e, answer: ans, tol: 0, q: q.replace(/\+-/g, '-'), sol: sol.replace(/\+-/g, '-') };
    }
    if (v === 2) {
      let p1, p2, d1, d2, d3, k;
      do { d = nz(rng, -3, 3); p1 = int(rng, -3, 3); p2 = int(rng, -3, 3); } while (d[2] === 0 || (p1 * d[0] + p2 * d[1]) % d[2] !== 0 || (p1 * d[0] + p2 * d[1]) === 0);
      k = -(p1 * d[0] + p2 * d[1]) / d[2]; a = rv(rng, -3, 3);
      const lhs = lc([p1, p2, 0]);
      q = R`The line $${symLine(a, d)}$ is parallel to the plane $${lhs}+kz=7$. Find $k$.`;
      sol = R`<p>Parallel means $d\cdot n=0$: $${d[0]}(${p1})+${d[1]}(${p2})+${d[2]}k=0$, so $k=${k}$.</p>`;
      return { v, d, p1, p2, k, answer: k, tol: 0, q, sol };
    }
    n = nice(rng); w = nz(rng, -2, 2); d = cross(n, w); a = rv(rng, -3, 3);
    if (nrm(d) < 1e-9) throw RETRY;
    do e = int(rng, -10, 10); while (dot(n, a) === e);
    ans = abs(dot(n, a) - e) / nrm(n);
    q = R`The line $${vecLine(a, d)}$ is parallel to the plane $${peq(n, e)}$. Find the distance between them.${TWOD}`;
    sol = R`<p>Check: $d\cdot n=${dot(d, n)}=0$ ✓. So the distance is that of the point $${pt(a)}$ from the plane: $\dfrac{|${dot(n, a)}-(${e})|}{${nrm(n)}}=\dfrac{${abs(dot(n, a) - e)}}{${nrm(n)}}=${r4(ans)}$.</p>`;
    return { v, a, d, n, e, answer: r4(ans), tol: 0.01, q, sol };
  }, (p) => {
    if (p.v === 0) { for (let l = -30; l <= 30; l++) { const X = vadd(p.a, vsc(l, p.d)); if (dot(p.n, X) === p.e) return X[0] + X[1] + X[2]; } }
    if (p.v === 1) { for (let l = -30; l <= 30; l++) if (dot(p.n, vadd(p.a, vsc(l, p.d))) === p.e) return l; }
    if (p.v === 2) { for (let k = -60; k <= 60; k++) if (dot(p.d, [p.p1, p.p2, k]) === 0) return k; }
    const t = (p.e - dot(p.n, p.a)) / dot(p.n, p.n); return abs(t) * nrm(p.n);
  }),

  // writing the plane
  gen('td-g09', 2, 'mcq', 'single', 'equation of a plane', (rng) => {
    const v = int(rng, 0, 2);
    let q, good, wrongs, sol;
    if (v === 0) {
      let n, P; do { n = rv(rng, -4, 4); } while (n.some((t) => t === 0) || new Set(n.map(abs)).size < 3); P = rv(rng, -3, 3); const d = dot(n, P); if (d === 0) throw RETRY;
      q = R`The plane through $${pt(P)}$ with normal direction $${pt(n)}$ is`; good = `$${peq0(n, d)}$`;
      wrongs = [`$${peq0(n, -d)}$`, `$${peq0([n[0], n[1], -n[2]], d)}$`, `$${peq0([n[1], n[0], n[2]], d)}$`];
      sol = R`<p>$${n[0]}(x-${P[0] < 0 ? `(${P[0]})` : P[0]})+${n[1] < 0 ? `(${n[1]})` : n[1]}(y-${P[1] < 0 ? `(${P[1]})` : P[1]})+${n[2] < 0 ? `(${n[2]})` : n[2]}(z-${P[2] < 0 ? `(${P[2]})` : P[2]})=0$ simplifies to $${peq0(n, d)}$ since $n\cdot P=${d}$.</p>`;
    } else if (v === 1) {
      let a, b, c; do { a = int(rng, -4, 6); b = int(rng, -4, 6); c = int(rng, -4, 6); } while (!a || !b || !c || new Set([abs(a), abs(b), abs(c)]).size < 3);
      let n = [b * c, a * c, a * b], d = a * b * c; const g = gcd3(n); n = n.map((t) => t / g); d /= g;
      const wn = [a * b, a * c, b * c], g2 = gcd3(wn);
      q = R`The plane with intercepts $${a}$, $${b}$, $${c}$ on the $x$, $y$, $z$ axes is`; good = `$${peq(n, d)}$`;
      wrongs = [`$${peq(n, -d)}$`, `$${peq(wn.map((t) => t / g2), (a * b * c) / g2)}$`, `$${peq([a, b, c], a * b * c)}$`];
      sol = R`<p>Intercept form: $\dfrac x{${a}}+\dfrac y{${b}}+\dfrac z{${c}}=1$. Multiply by $${a * b * c}$: $${b * c}x+${a * c}y+${a * b}z=${a * b * c}$ (signs as they come)${g > 1 ? `, and divide by ${g}` : ''}: $${peq(n, d)}$.</p>`.replace(/\+-/g, '-');
    } else {
      let A, B, P; do { A = rv(rng, -3, 3); B = rv(rng, -3, 3); P = rv(rng, -3, 3); } while (nrm(vsub(B, A)) < 1e-9 || dot(vsub(B, A), P) === 0);
      let n = vsub(B, A); const g = gcd3(n); n = n.map((t) => t / g); const d = dot(n, P);
      q = R`The plane through $P${pt(P)}$ perpendicular to the line joining $A${pt(A)}$ and $B${pt(B)}$ is`; good = `$${peq0(n, d)}$`;
      wrongs = [`$${peq0(n, -d)}$`, `$${peq0(vsub(B, A).map((t) => t * 1).reverse(), d)}$`, `$${peq0(vadd(A, B), dot(vadd(A, B), P))}$`];
      sol = R`<p>The normal is $\overrightarrow{AB}=${pt(vsub(B, A))}$ ${g > 1 ? `(divide by ${g}: $${pt(n)}$)` : ''}. Plane: $${pt(n)}\cdot(x,y,z)=${pt(n)}\cdot${pt(P)}=${d}$, i.e. $${peq0(n, d)}$.</p>`;
    }
    const { options, answer } = shuffleOpts(rng, good, wrongs);
    return { v, options, answer, good, q, sol };
  }, (p) => p.options.indexOf(p.good)),

  // family of planes through a line of intersection
  gen('td-g10', 3, 'nat', 'integer', 'family of planes', (rng) => {
    const v = int(rng, 0, 3);
    let n1, n2, d1, d2, q, sol, lam, Q, t, extra = {};
    const fam = (a, b, c, e) => R`$${peq0(a, c)}$ and $${peq0(b, e)}$`;
    do { n1 = nz(rng, -3, 3); n2 = nz(rng, -3, 3); } while (nrm(cross(n1, n2)) < 1e-9);
    if (v === 0) {
      lam = choose(rng, [-3, -2, -1, 1, 2, 3]); Q = rv(rng, -2, 2); d2 = int(rng, -5, 5);
      if (dot(n2, Q) === d2) d2 += 1;
      d1 = dot(n1, Q) + lam * (dot(n2, Q) - d2); extra = { Q };
      q = R`A plane through the line of intersection of ${fam(n1, n2, d1, d2)} has the form $\pi_1+\lambda\pi_2=0$. If it passes through $${pt(Q)}$, find $\lambda$.`;
      sol = R`<p>$\pi_1+\lambda\pi_2=0$ at $${pt(Q)}$: $(${dot(n1, Q)}-${d1})+\lambda(${dot(n2, Q)}-${d2})=0$, i.e. $${dot(n1, Q) - d1}+${dot(n2, Q) - d2}\lambda=0$, so $\lambda=${lam}$.</p>`.replace(/\+-/g, '-');
    } else if (v === 1) {
      lam = choose(rng, [-3, -2, -1, 1, 2, 3]);
      do { t = nz(rng, -2, 2); t[2] = choose(rng, [1, -1]); } while (dot(n2, t) === 0);
      const need = -lam * dot(n2, t);
      n1 = [n1[0], n1[1], 0]; n1[2] = (need - n1[0] * t[0] - n1[1] * t[1]) / t[2];
      if (nrm(cross(n1, n2)) < 1e-9) throw RETRY; d1 = int(rng, -5, 5); d2 = int(rng, -5, 5); extra = { t };
      q = R`A plane through the line of intersection of ${fam(n1, n2, d1, d2)} is perpendicular to the plane $${peq(t, 3)}$. In $\pi_1+\lambda\pi_2=0$, find $\lambda$.`;
      sol = R`<p>Normal of the family member: $n_1+\lambda n_2$. Perpendicular to $${pt(t)}$: $(n_1+\lambda n_2)\cdot${pt(t)}=0$, i.e. $${dot(n1, t)}+${dot(n2, t)}\lambda=0$, so $\lambda=${lam}$.</p>`.replace(/\+-/g, '-');
    } else if (v === 2) {
      lam = choose(rng, [-3, -2, -1, 1, 2, 3]); n2[0] = choose(rng, [1, -1, 2]); n1[0] = -lam * n2[0];
      if (nrm(cross(n1, n2)) < 1e-9) throw RETRY; d1 = int(rng, -5, 5); d2 = int(rng, -5, 5);
      q = R`A plane through the line of intersection of ${fam(n1, n2, d1, d2)} is parallel to the $x$-axis. In $\pi_1+\lambda\pi_2=0$, find $\lambda$.`;
      sol = R`<p>A plane is parallel to the $x$-axis when the coefficient of $x$ is $0$: $${n1[0]}+${n2[0]}\lambda=0$, so $\lambda=${lam}$.</p>`.replace(/\+-/g, '-');
    } else {
      lam = choose(rng, [-3, -2, -1, 1, 2, 3]); d2 = choose(rng, [1, -1, 2, -2]); d1 = -lam * d2;
      q = R`A plane through the line of intersection of ${fam(n1, n2, d1, d2)} passes through the origin. In $\pi_1+\lambda\pi_2=0$, find $\lambda$.`;
      sol = R`<p>At the origin each plane expression equals its negated constant: $(${-d1})+\lambda(${-d2})=0$, so $\lambda=-\dfrac{${d1}}{${d2}}=${lam}$.</p>`;
    }
    return { v, n1, n2, d1, d2, lam, ...extra, answer: lam, tol: 0, q: q.replace(/\+-/g, '-'), sol };
  }, (p) => {
    for (let l = -60; l <= 60; l++) {
      const nn = vadd(p.n1, vsc(l, p.n2)), dd = p.d1 + l * p.d2;
      if (p.v === 0 && dot(nn, p.Q) - dd === 0) return l;
      if (p.v === 1 && dot(nn, p.t) === 0) return l;
      if (p.v === 2 && nn[0] === 0) return l;
      if (p.v === 3 && dd === 0) return l;
    }
  }),

  // how two lines sit in space
  gen('td-g11', 3, 'mcq', 'single', 'two lines', (rng) => {
    const type = int(rng, 0, 3), fmtv = int(rng, 0, 1);
    let a1, a2, b1, b2;
    do { b1 = nz(rng, -3, 3); a1 = rv(rng, -3, 3); } while (false);
    if (type === 0) {
      const X = rv(rng, -3, 3), s = int(rng, -2, 2), t = int(rng, -2, 2);
      do b2 = nz(rng, -3, 3); while (nrm(cross(b1, b2)) < 1e-9);
      a1 = vsub(X, vsc(s, b1)); a2 = vsub(X, vsc(t, b2));
    } else if (type === 1) {
      const m = choose(rng, [2, -1, 3, -2]); b2 = vsc(m, b1);
      do a2 = vadd(a1, rv(rng, -3, 3)); while (nrm(cross(vsub(a2, a1), b1)) < 1e-9);
    } else if (type === 3) {
      const m = choose(rng, [2, -1, 3, -2]); b2 = vsc(m, b1); a2 = vadd(a1, vsc(choose(rng, [1, 2, -1, 3]), b1));
    } else {
      do { a2 = rv(rng, -3, 3); b2 = nz(rng, -3, 3); } while (nrm(cross(b1, b2)) < 1e-9 || dot(vsub(a2, a1), cross(b1, b2)) === 0);
    }
    const L1 = fmtv ? vecLine(a1, b1) : symLine(a1, b1), L2 = fmtv ? `\\vec r=(${vec(a2)})+\\mu(${vec(b2)})` : symLine(a2, b2);
    const names = ['intersecting at exactly one point', 'parallel and distinct', 'skew', 'the same line'];
    const c = cross(b1, b2), tr = dot(vsub(a2, a1), c);
    let sol;
    if (type === 2) sol = R`<p>$\vec b_1\times\vec b_2=${pt(c)}\ne0$, so not parallel. Triple product $(\vec a_2-\vec a_1)\cdot(\vec b_1\times\vec b_2)=${tr}\ne0$, so they do not meet: skew.</p>`;
    else if (type === 0) sol = R`<p>$\vec b_1\times\vec b_2=${pt(c)}\ne0$ so not parallel, and the triple product $(\vec a_2-\vec a_1)\cdot(\vec b_1\times\vec b_2)=${tr}=0$, so they are coplanar. Not parallel and coplanar means they meet at one point.</p>`;
    else { const w = cross(vsub(a2, a1), b1); sol = type === 1 ? R`<p>$\vec b_2=${b2[0] / b1[0]}\vec b_1$, so the lines are parallel. $\vec a_2-\vec a_1=${pt(vsub(a2, a1))}$ is not along $\vec b_1$ (cross product $${pt(w)}\ne0$), so the point $a_2$ is not on the first line: distinct.</p>` : R`<p>$\vec b_2=${b2[0] / b1[0]}\vec b_1$, so they are parallel. $\vec a_2-\vec a_1=${pt(vsub(a2, a1))}$ is a multiple of $\vec b_1$, so $a_2$ lies on the first line: the same line.</p>`; }
    const { options, answer } = shuffleOpts(rng, names[type], names.filter((_, i) => i !== type));
    return { kind: type, a1, b1, a2, b2, options, answer, good: names[type], q: R`The lines $${L1}$ and $${L2}$ are`, sol };
  }, (p) => {
    const meet = minDist(vsub(p.a1, p.a2), p.b1, vsc(-1, p.b2)) < 1e-9, par = nrm(cross(p.b1, p.b2)) < 1e-9;
    const t = par ? (meet ? 3 : 1) : meet ? 0 : 2;
    return p.options.indexOf(['intersecting at exactly one point', 'parallel and distinct', 'skew', 'the same line'][t]);
  }),

  // projections
  gen('td-g12', 3, 'nat', 'numeric', 'projection of a segment', (rng) => {
    const v = int(rng, 0, 2);
    let q, sol, ans, A, B, d, n, tri;
    if (v === 0) {
      A = rv(rng, -3, 3); B = rv(rng, -3, 3); d = nice(rng); const ab = vsub(B, A);
      if (dot(ab, d) === 0) throw RETRY;
      ans = abs(dot(ab, d)) / nrm(d);
      q = R`Find the length of the projection of the segment from $A${pt(A)}$ to $B${pt(B)}$ on the line with direction ratios $${d.join(',')}$.`;
      sol = R`<p>$\overrightarrow{AB}=${pt(ab)}$. The unit vector along the line is $\dfrac1{${nrm(d)}}${pt(d)}$. Projection $=\dfrac{|${dot(ab, d)}|}{${nrm(d)}}=${r4(ans)}$.</p>`;
    } else if (v === 1) {
      A = rv(rng, -3, 3); B = rv(rng, -3, 3); n = nice(rng); const ab = vsub(B, A);
      if (nrm(cross(ab, n)) < 1e-9) throw RETRY;
      ans = sqrt(dot(ab, ab) - dot(ab, n) ** 2 / dot(n, n));
      q = R`Find the length of the projection of the segment from $A${pt(A)}$ to $B${pt(B)}$ on the plane $${peq(n, 0)}$.`;
      sol = R`<p>$\overrightarrow{AB}=${pt(ab)}$, $|AB|^2=${dot(ab, ab)}$. Component along the normal: $\dfrac{(\overrightarrow{AB}\cdot n)^2}{|n|^2}=\dfrac{${dot(ab, n) ** 2}}{${dot(n, n)}}=${r4(dot(ab, n) ** 2 / dot(n, n))}$. Projection$^2=${dot(ab, ab)}-${r4(dot(ab, n) ** 2 / dot(n, n))}$, so the projection is $${r4(ans)}$.</p>`;
    } else {
      tri = choose(rng, [[3, 4, 12], [2, 3, 6], [1, 2, 2], [4, 4, 7], [2, 6, 9], [6, 6, 7]]); ans = nrm(tri);
      q = R`The projections of a segment on the three coordinate axes are ${tri[0]}, ${tri[1]} and ${tri[2]}. Find its length.`;
      sol = R`<p>Length$^2=${tri[0]}^2+${tri[1]}^2+${tri[2]}^2=${dot(tri, tri)}$, so the length is $${ans}$.</p>`;
    }
    return { v, A, B, d, n, tri, answer: r4(ans), tol: 0.01, unit: '', q: q + TWOD, sol };
  }, (p) => {
    if (p.v === 0) { const ab = vsub(p.B, p.A); return nrm(ab) * abs(dot(ab, p.d)) / (nrm(ab) * nrm(p.d)); }
    if (p.v === 1) { const ab = vsub(p.B, p.A); return nrm(cross(ab, p.n)) / nrm(p.n); }
    return Math.hypot(...p.tri);
  }),

  // angles with the axes
  gen('td-g13', 2, 'nat', 'numeric', 'direction cosines', (rng) => {
    const v = int(rng, 0, 3);
    let q, sol, ans, tol = 0.01, ex = {};
    if (v === 0) {
      const [al, be] = choose(rng, [[60, 45], [45, 45], [60, 60], [30, 60], [30, 90], [45, 90], [90, 60]]);
      const c2 = Math.max(0, +(1 - Math.cos((al * Math.PI) / 180) ** 2 - Math.cos((be * Math.PI) / 180) ** 2).toFixed(12)), g = deg(acos(sqrt(Math.max(c2, 0))));
      ans = g; ex = { al, be };
      q = R`A line makes angles $${al}^\circ$ and $${be}^\circ$ with the positive $x$ and $y$ axes. Find the acute angle (in degrees) it makes with the $z$-axis.${TWOD}`;
      sol = R`<p>$\cos^2\gamma=1-\cos^2${al}^\circ-\cos^2${be}^\circ=${r4(c2)}$, so $\cos\gamma=${r4(sqrt(c2))}$ and $\gamma=${r4(g)}^\circ$.</p>`;
    } else if (v === 1) {
      const [l, m, ls, ms, ns] = choose(rng, [[0.5, 0.5, '\\dfrac12', '\\dfrac12', ''], [1 / 3, 2 / 3, '\\dfrac13', '\\dfrac23', ''], [2 / 7, 3 / 7, '\\dfrac27', '\\dfrac37', ''], [1 / 3, 1 / 3, '\\dfrac13', '\\dfrac13', ''], [3 / 13, 4 / 13, '\\dfrac3{13}', '\\dfrac4{13}', '']]);
      ans = sqrt(1 - l * l - m * m); tol = 0.001; ex = { l, m };
      q = R`A line has direction cosines $${ls}$, $${ms}$, $n$ with $n>0$. Find $n$ (4 decimal places).`;
      sol = R`<p>$n^2=1-l^2-m^2=${r4(1 - l * l - m * m)}$, so $n=${r4(ans)}$.</p>`;
    } else if (v === 2) {
      const d = nice(rng), ax = int(rng, 0, 2); ans = deg(acos(d[ax] / nrm(d))); ex = { d, ax };
      q = R`Find the angle (in degrees, between $0^\circ$ and $180^\circ$) that a line with direction ratios $${d.join(',')}$ makes with the positive ${['$x$', '$y$', '$z$'][ax]}-axis.${TWOD}`;
      sol = R`<p>$|d|=${nrm(d)}$. The direction cosine along that axis is $\dfrac{${d[ax]}}{${nrm(d)}}=${r4(d[ax] / nrm(d))}$. The angle is $\cos^{-1}(${r4(d[ax] / nrm(d))})=${r4(ans)}^\circ$.</p>`;
    } else {
      const th = choose(rng, [30, 45, 60]); const c2 = (1 - Math.cos((th * Math.PI) / 180) ** 2) / 2; ans = deg(acos(sqrt(c2))); ex = { th };
      q = R`A line is equally inclined to the positive $x$ and $y$ axes and makes $${th}^\circ$ with the positive $z$-axis. Find the acute angle (in degrees) it makes with the $x$-axis.${TWOD}`;
      sol = R`<p>$\cos\alpha=\cos\beta$, so $2\cos^2\alpha+\cos^2${th}^\circ=1$ and $\cos^2\alpha=${r4(c2)}$. $\alpha=\cos^{-1}${r4(sqrt(c2))}=${r4(ans)}^\circ$.</p>`;
    }
    return { v, ...ex, answer: r4(ans), tol, q, sol };
  }, (p) => {
    const R2 = (a) => Math.cos((a * Math.PI) / 180);
    if (p.v === 0) { const nn = sqrt(Math.max(1 - R2(p.al) ** 2 - R2(p.be) ** 2, 0)); return deg(Math.atan2(sqrt(1 - nn * nn), nn)); }
    if (p.v === 1) return sqrt(1 - p.l ** 2 - p.m ** 2);
    if (p.v === 2) return deg(Math.atan2(nrm(cross(p.d, [p.ax === 0 ? 1 : 0, p.ax === 1 ? 1 : 0, p.ax === 2 ? 1 : 0])), p.d[p.ax]));
    const a = Math.acos(sqrt((1 - R2(p.th) ** 2) / 2)); return deg(a);
  }),

  // where two lines meet
  gen('td-g14', 4, 'nat', 'integer', 'intersection of lines', (rng) => {
    const v = int(rng, 0, 2);
    let b1, b2, X, s, t;
    do { b1 = nz(rng, -3, 3); b2 = nz(rng, -3, 3); } while (nrm(cross(b1, b2)) < 1e-9);
    X = rv(rng, -3, 3); s = int(rng, -2, 2); t = int(rng, -2, 2);
    const a1 = vsub(X, vsc(s, b1)), a2 = vsub(X, vsc(t, b2));
    const L1 = symLine(a1, b1), L2 = symLine(a2, b2);
    let q, ans, sol;
    if (v === 0) { ans = X[0] + X[1] + X[2]; q = R`The lines $${L1}$ and $${L2}$ intersect. Find the sum of the coordinates of the point of intersection.`; sol = R`<p>Write $a_1+sb_1=a_2+tb_2$. The two lines meet where $s=${s}$ on the first and $t=${t}$ on the second, at $${pt(X)}$ (check: $a_1+${s}b_1=${pt(vadd(a1, vsc(s, b1)))}$ and $a_2+${t}b_2=${pt(vadd(a2, vsc(t, b2)))}$). Sum $=${ans}$.</p>`; }
    else if (v === 1) { ans = dot(X, X); q = R`The lines $${L1}$ and $${L2}$ intersect. Find the square of the distance of the point of intersection from the origin.`; sol = R`<p>They meet at $${pt(X)}$ (parameters $s=${s}$ and $t=${t}$). $|OX|^2=${ans}$.</p>`; }
    else { ans = t; q = R`The lines $${L1}$ and $${L2}$ intersect. At the point of intersection, each term of the second line's ratio equals $\mu$. Find $\mu$.`; sol = R`<p>On the second line each ratio equals the parameter $\mu$ with $x=${a2[0]}+${b2[0]}\mu$ etc. The meeting point $${pt(X)}$ gives $\mu=${t}$.</p>`.replace(/\+-/g, '-'); }
    return { v, a1, b1, a2, b2, answer: ans, tol: 0, q, sol };
  }, (p) => {
    const c = vsub(p.a1, p.a2), u = p.b1, w = vsc(-1, p.b2);
    const a = dot(u, u), b = dot(u, w), d = dot(w, w), e = -dot(c, u), f = -dot(c, w), det = a * d - b * b;
    const s = (e * d - b * f) / det, t = (a * f - b * e) / det, X = vadd(p.a1, vsc(s, p.b1));
    return p.v === 0 ? Math.round(X[0] + X[1] + X[2]) : p.v === 1 ? Math.round(dot(X, X)) : Math.round(-t * -1);
  }),

  // pick the point that lies on the line or plane
  gen('td-g15', 2, 'mcq', 'single', 'equation of a line', (rng) => {
    const v = int(rng, 0, 1);
    let q, good, wrongs, sol, test;
    if (v === 0) {
      const A = rv(rng, -3, 3); let dd; do dd = rv(rng, -2, 2); while (nrm(dd) < 1e-9); const B = vadd(A, dd), lam = choose(rng, [2, 3, -1, -2]);
      const P = vadd(A, vsc(lam, dd)); test = (X) => nrm(cross(vsub(X, A), dd)) < 1e-9;
      const mk = (k) => { const Y = [...P]; Y[k] += choose(rng, [1, -1]); return Y; };
      q = R`Which of these points lies on the line through $A${pt(A)}$ and $B${pt(B)}$?`; good = `$${pt(P)}$`; wrongs = [0, 1, 2].map((k) => `$${pt(mk(k))}$`);
      if (wrongs.some((w) => test(JSON.parse(w.slice(1, -1).replace(/\(/g, '[').replace(/\)/g, ']'))))) throw RETRY;
      sol = R`<p>Direction $\overrightarrow{AB}=${pt(dd)}$. Points are $A+\lambda\overrightarrow{AB}$. For $\lambda=${lam}$: $${pt(P)}$. In the other options one coordinate is off by one, so no single $\lambda$ fits all three.</p>`;
    } else {
      const n = nz(rng, -3, 3), P = rv(rng, -3, 3), d = dot(n, P); test = (X) => dot(n, X) === d;
      const mk = (k) => { const Y = [...P]; Y[k] += choose(rng, [1, -1]); return Y; };
      q = R`Which of these points lies on the plane $${peq(n, d)}$?`; good = `$${pt(P)}$`; wrongs = [0, 1, 2].map((k) => `$${pt(mk(k))}$`);
      if (wrongs.some((w) => test(JSON.parse(w.slice(1, -1).replace(/\(/g, '[').replace(/\)/g, ']'))))) throw RETRY;
      sol = R`<p>Substitute each point: $${pt(n)}\cdot${pt(P)}=${d}$ for $${pt(P)}$ ✓. For the others the left side differs from ${d} by the coefficient of the changed coordinate.</p>`;
    }
    const { options, answer } = shuffleOpts(rng, good, wrongs);
    return { v, options, answer, good, q, sol, testPts: options.map((o) => JSON.parse(o.slice(1, -1).replace(/\(/g, '[').replace(/\)/g, ']'))), test };
  }, (p) => p.testPts.findIndex((X) => p.test(X))),

  // find k from a condition
  gen('td-g16', 3, 'nat', 'integer', 'angle between lines', (rng) => {
    const v = int(rng, 0, 3), u = int(rng, 0, 2);
    let a, b, k0, q, sol, w = (u + 1 + int(rng, 0, 1)) % 3;
    const showVec = (vv) => vv.map((t, i) => (i === u ? 'k' : t));
    const planeK = (vv) => { let z = ''; vv.forEach((t, i) => { if (t === 0) return; const isK = t === 'k'; const neg = !isK && t < 0; const mag = isK ? 'k' : abs(t) === 1 ? '' : abs(t); z += (neg ? '-' : z ? '+' : '') + mag + XYZ[i]; }); return z; };
    const Lq = (vv, p) => XYZ.map((nm, i) => `\\dfrac{${p[i] === 0 ? nm : `${nm}${p[i] > 0 ? '-' : '+'}${abs(p[i])}`}}{${showVec(vv)[i]}}`).join('=');
    if (v === 0 || v === 2) {
      let tries = 0;
      for (;;) {
        if (++tries > 500) throw RETRY;
        a = nz(rng, -3, 3); k0 = int(rng, -4, 4); a[u] = k0; b = nz(rng, -3, 3);
        const rest = dot(a, b) - a[w] * b[w]; if (a[w] === 0) continue;
        const bw = -rest / a[w]; if (!Number.isInteger(bw) || bw === 0) continue; b[w] = bw; if (dot(a, b) === 0 && k0 !== 0 && b[u] !== 0) break;
      }
      if (v === 0) { const p1 = rv(rng, -2, 2), p2 = rv(rng, -2, 2); q = R`The lines $${Lq(a, p1)}$ and $${symLine(p2, b)}$ are perpendicular. Find $k$.`; sol = R`<p>Direction ratios $(${showVec(a).join(',')})$ and $${pt(b)}$. Perpendicular: dot product $0$. $${showVec(a).map((t, i) => `${t}\\cdot${b[i] < 0 ? `(${b[i]})` : b[i]}`).join('+')}=0$ gives $k=${k0}$.</p>`; }
      else { const bb = vsc(1, b); const planeA = showVec(a); q = R`The planes $${planeK(planeA)}=5$ and $${peq(b, 2)}$ are perpendicular. Find $k$.`; sol = R`<p>Normals $(${planeA.join(',')})$ and $${pt(b)}$ must be perpendicular. $${planeA.map((t, i) => `${t}\\cdot${b[i] < 0 ? `(${b[i]})` : b[i]}`).join('+')}=0$ gives $k=${k0}$.</p>`; }
      return { v, a, b, u, answer: k0, tol: 0, q: q.replace(/\+-/g, '-'), sol };
    }
    b = nz(rng, -3, 3); const m = choose(rng, [2, -2, 3, -1]); a = vsc(m, b); k0 = a[u];
    if (v === 1) { const p1 = rv(rng, -2, 2), p2 = rv(rng, -2, 2); q = R`The lines $${Lq(a, p1)}$ and $${symLine(p2, b)}$ are parallel. Find $k$.`; sol = R`<p>Parallel lines have proportional direction ratios: $(${showVec(a).join(',')})=${m}\cdot${pt(b)}$ (from the other two coordinates), so $k=${m}\cdot${b[u]}=${k0}$.</p>`; }
    else { q = R`The line $${symLine(rv(rng, -2, 2), b)}$ is perpendicular to the plane $${planeK(showVec(a))}=3$. Find $k$.`; sol = R`<p>The line is perpendicular to the plane when its direction is parallel to the normal $(${showVec(a).join(',')})$. The other two ratios give the factor ${m}, so $k=${m}\cdot${b[u]}=${k0}$.</p>`; }
    return { v, a, b, u, answer: k0, tol: 0, q: q.replace(/\+-/g, '-'), sol };
  }, (p) => {
    for (let k = -200; k <= 200; k++) {
      const aa = [...p.a]; aa[p.u] = k;
      if (p.v === 0 || p.v === 2) { if (dot(aa, p.b) === 0) return k; }
      else if (nrm(cross(aa, p.b)) < 1e-9) return k;
    }
  }),

  // plane from a line and a point, two directions, or two intersecting lines: distance from the origin
  gen('td-g17', 4, 'nat', 'numeric', 'equation of a plane', (rng) => {
    const v = int(rng, 0, 2);
    let q, sol, n, c0, u, w, ex = {};
    if (v === 0) {
      const a = rv(rng, -3, 3), d = nz(rng, -3, 3); let P;
      do P = rv(rng, -4, 4); while (nrm(cross(d, vsub(P, a))) < 1e-9);
      n = cross(d, vsub(P, a)); if (dot(n, a) === 0) throw RETRY; c0 = a; u = d; w = vsub(P, a); ex = { a, d, P };
      q = R`A plane contains the line $${vecLine(a, d)}$ and the point $P${pt(P)}$. Find its distance from the origin.`;
      sol = R`<p>The plane contains the direction $d=${pt(d)}$ and the vector $P-a=${pt(vsub(P, a))}$. Normal $=d\times(P-a)=${pt(n)}$. The plane passes through $a=${pt(a)}$, so $n\cdot r=${dot(n, a)}$. Distance $=\dfrac{|${dot(n, a)}|}{\sqrt{${dot(n, n)}}}=${r4(abs(dot(n, a)) / nrm(n))}$.</p>`;
    } else if (v === 1) {
      let P; let d1, d2;
      do { P = rv(rng, -4, 4); d1 = nz(rng, -3, 3); d2 = nz(rng, -3, 3); } while (nrm(cross(d1, d2)) < 1e-9 || dot(cross(d1, d2), P) === 0);
      n = cross(d1, d2); c0 = P; u = d1; w = d2; ex = { P, d1, d2 };
      q = R`A plane passes through $P${pt(P)}$ and is parallel to the lines with direction ratios $${d1.join(',')}$ and $${d2.join(',')}$. Find its distance from the origin.`;
      sol = R`<p>Normal $=d_1\times d_2=${pt(n)}$. Plane: $n\cdot r=n\cdot P=${dot(n, P)}$. Distance $=\dfrac{|${dot(n, P)}|}{\sqrt{${dot(n, n)}}}=${r4(abs(dot(n, P)) / nrm(n))}$.</p>`;
    } else {
      let X, d1, d2;
      do { X = rv(rng, -3, 3); d1 = nz(rng, -3, 3); d2 = nz(rng, -3, 3); } while (nrm(cross(d1, d2)) < 1e-9 || dot(cross(d1, d2), X) === 0);
      n = cross(d1, d2); c0 = X; u = d1; w = d2; ex = { X, d1, d2 };
      const a1 = vsub(X, d1), a2 = vsub(X, vsc(2, d2));
      q = R`Find the distance from the origin of the plane that contains the two intersecting lines $${symLine(a1, d1)}$ and $${symLine(a2, d2)}$.`;
      sol = R`<p>The lines meet at $X=${pt(X)}$ (take $s=1$ on the first and $t=2$ on the second). Normal $=d_1\times d_2=${pt(n)}$. Plane: $n\cdot r=n\cdot X=${dot(n, X)}$. Distance $=\dfrac{|${dot(n, X)}|}{\sqrt{${dot(n, n)}}}=${r4(abs(dot(n, X)) / nrm(n))}$.</p>`;
    }
    const ans = abs(dot(n, c0)) / nrm(n);
    return { v, c0, u, w, ...ex, answer: r4(ans), tol: 0.01, unit: '', q: q + TWOD, sol };
  }, (p) => minDist(p.c0, p.u, p.w)),

  // which side of the plane
  gen('td-g18', 3, 'mcq', 'single', 'equation of a plane', (rng) => {
    const type = int(rng, 0, 3), n = nz(rng, -3, 3), d = int(rng, -6, 6);
    let P, Q, tries = 0;
    const val = (X) => dot(n, X) - d;
    const onPlane = () => { for (let i = 0; i < 400; i++) { const X = rv(rng, -4, 4); if (val(X) === 0) return X; } return null; };
    const offPlane = () => { for (;;) { const X = rv(rng, -4, 4); if (val(X) !== 0) return X; } };
    for (;;) {
      if (++tries > 400) throw RETRY;
      if (type === 0) { P = offPlane(); Q = offPlane(); if (val(P) * val(Q) > 0) break; }
      else if (type === 1) { P = offPlane(); Q = offPlane(); if (val(P) * val(Q) < 0) break; }
      else if (type === 2) { P = onPlane(); if (!P) continue; Q = offPlane(); break; }
      else { P = onPlane(); Q = onPlane(); if (P && Q && neq(P, Q)) break; }
    }
    const names = ['on the same side of the plane', 'on opposite sides of the plane', 'one lies on the plane and the other does not', 'both lie on the plane'];
    const { options, answer } = shuffleOpts(rng, names[type], names.filter((_, i) => i !== type));
    return { kind: type, n, d, P, Q, options, answer, good: names[type], q: R`The points $P${pt(P)}$ and $Q${pt(Q)}$ are (with respect to the plane $${peq(n, d)}$)`,
      sol: R`<p>Evaluate $${lc(n)}-(${d})$: at $P$ it is $${val(P)}$ and at $Q$ it is $${val(Q)}$. ${type === 0 ? 'Both have the same sign, so the points are on the same side.' : type === 1 ? 'The signs are opposite, so the points are on opposite sides.' : type === 2 ? 'One value is zero (that point is on the plane) and the other is not.' : 'Both values are zero.'}</p>` };
  }, (p) => { const a = dot(p.n, p.P) - p.d, b = dot(p.n, p.Q) - p.d; const t = a === 0 && b === 0 ? 3 : a === 0 || b === 0 ? 2 : Math.sign(a) === Math.sign(b) ? 0 : 1; return p.options.indexOf(['on the same side of the plane', 'on opposite sides of the plane', 'one lies on the plane and the other does not', 'both lie on the plane'][t]); }),

  // distance of the meeting point of two lines from a plane
  gen('td-g19', 5, 'nat', 'numeric', 'intersection of lines', (rng) => {
    let b1, b2, X, s, t, n, e;
    do { b1 = nz(rng, -2, 2); b2 = nz(rng, -2, 2); } while (nrm(cross(b1, b2)) < 1e-9);
    X = rv(rng, -3, 3); s = int(rng, -2, 2); t = int(rng, -2, 2);
    const a1 = vsub(X, vsc(s, b1)), a2 = vsub(X, vsc(t, b2));
    n = nice(rng); do e = int(rng, -8, 8); while (dot(n, X) === e);
    const ans = abs(dot(n, X) - e) / nrm(n);
    return { a1, b1, a2, b2, n, e, answer: r4(ans), tol: 0.01, unit: '',
      q: R`The lines $${symLine(a1, b1)}$ and $${symLine(a2, b2)}$ meet at a point $X$. Find the distance of $X$ from the plane $${peq(n, e)}$.${TWOD}`,
      sol: R`<p>The lines meet where $s=${s}$ (first) and $t=${t}$ (second): $X=${pt(X)}$. Distance $=\dfrac{|${dot(n, X)}-(${e})|}{\sqrt{${dot(n, n)}}}=\dfrac{${abs(dot(n, X) - e)}}{${nrm(n)}}=${r4(ans)}$.</p>` };
  }, (p) => {
    const c = vsub(p.a1, p.a2), u = p.b1, w = vsc(-1, p.b2);
    const a = dot(u, u), b = dot(u, w), d = dot(w, w), ee = -dot(c, u), f = -dot(c, w), det = a * d - b * b;
    const s = (ee * d - b * f) / det, X = vadd(p.a1, vsc(s, p.b1));
    const t = (dot(p.n, X) - p.e) / dot(p.n, p.n); return abs(t) * nrm(p.n);
  }),

  // plane cutting the axes: centroid, volume, area, distance
  gen('td-g20', 4, 'nat', 'numeric', 'intercepts', (rng) => {
    const v = int(rng, 0, 2);
    let p, q, r; do { p = int(rng, 1, 4); q = int(rng, 1, 4); r = int(rng, 1, 4); } while (new Set([p, q, r]).size < 3);
    const a = 3 * p, b = 3 * q, c = 3 * r;
    const head = R`A plane meets the coordinate axes at $A$, $B$, $C$ and the centroid of triangle $ABC$ is $(${p},${q},${r})$.`;
    let qu, sol, ans;
    if (v === 0) { ans = (a * b * c) / 6; qu = R`${head} Find the volume of the tetrahedron $OABC$.`; sol = R`<p>The centroid is $\left(\dfrac a3,\dfrac b3,\dfrac c3\right)$, so $a=${a}$, $b=${b}$, $c=${c}$. Volume $=\dfrac{abc}6=\dfrac{${a * b * c}}6=${r4(ans)}$.</p>`; }
    else if (v === 1) { ans = (a * b * c) / sqrt((b * c) ** 2 + (a * c) ** 2 + (a * b) ** 2); qu = R`${head} Find the distance of the plane from the origin.`; sol = R`<p>Intercepts $${a},${b},${c}$ give $\dfrac x{${a}}+\dfrac y{${b}}+\dfrac z{${c}}=1$. Distance $=\dfrac1{\sqrt{\frac1{${a * a}}+\frac1{${b * b}}+\frac1{${c * c}}}}=${r4(ans)}$.</p>`; }
    else { ans = 0.5 * sqrt((a * b) ** 2 + (b * c) ** 2 + (c * a) ** 2); qu = R`${head} Find the area of triangle $ABC$.`; sol = R`<p>Intercepts $${a},${b},${c}$. $\overrightarrow{AB}=(-${a},${b},0)$, $\overrightarrow{AC}=(-${a},0,${c})$. Cross product $=(${b * c},${a * c},${a * b})$. Area $=\dfrac12\sqrt{${(b * c) ** 2}+${(a * c) ** 2}+${(a * b) ** 2}}=${r4(ans)}$.</p>`; }
    return { v, a, b, c, answer: r4(ans), tol: 0.01, unit: '', q: qu + TWOD, sol };
  }, (p) => {
    const A = [p.a, 0, 0], B = [0, p.b, 0], C = [0, 0, p.c];
    if (p.v === 0) return abs(dot(A, cross(B, C))) / 6;
    const cr = cross(vsub(B, A), vsub(C, A));
    if (p.v === 1) return abs(dot(cr, A)) / nrm(cr);
    return nrm(cr) / 2;
  }),
];

items.forEach(tidyItem);
items.forEach((it, i) => { it.id = `td-${String(i + 1).padStart(3, '0')}`; });

// ---- Expansion 2026-11-22: extra questions (ids td-x001 and on). Everything above this line is unchanged.
{
const R = String.raw;
const XEX = { 1: ['keam', 'cusat', 'comedk', 'jee-main'], 2: ['keam', 'cusat', 'comedk', 'jee-main'], 3: ['jee-main', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const XCUET = true;
const XPOS = [2, 0, 3, 1, 1, 3, 0, 2, 3, 2, 0, 1, 0, 3, 1, 2];
let xn = 0, xk = 0;
const xplace = (c, w) => { const p = XPOS[xk++ % XPOS.length]; const o = [...w]; o.splice(p, 0, c); return { options: o, answer: p }; };
const xb = (level, sub, extra) => ({ id: `td-x${String(++xn).padStart(3, '0')}`, level, exams: [...XEX[level], ...(XCUET && extra.type === 'mcq' && level <= 3 ? ['cuet'] : [])], sub, ...extra });
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
const sq = Math.sqrt, PIE = Math.PI, acos = Math.acos, asin = Math.asin, atan = Math.atan;
const dg = (r) => (r * 180) / PIE;
const vd = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const vc = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const vs = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const va = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const vk = (k, a) => [k * a[0], k * a[1], k * a[2]];
const vn = (a) => sq(vd(a, a));
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const det3 = (a, b, c) => vd(a, vc(b, c));
const term = (c, v, first) => (c === 0 ? '' : (c < 0 ? '-' : first ? '' : '+') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + v);
const plL = (n) => `${term(n[0], 'x', true)}${term(n[1], 'y', n[0] === 0)}${term(n[2], 'z', n[0] === 0 && n[1] === 0)}`;
// signed value of the plane n.x = D at P
const pv = (n, D, P) => vd(n, P) - D;
PG('xp1', 'A point and a plane', R`<p>The plane $\pi$ is $2x-y+2z=6$ and the point $P$ is $(3,1,-1)$.</p>`);
PG('xp2', 'Two lines in space', R`<p>Line $L_1$ is $\dfrac{x-1}2=\dfrac{y-2}3=\dfrac{z-3}4$ and line $L_2$ is $\dfrac{x-2}3=\dfrac{y-4}4=\dfrac{z-5}5$. They are not parallel and do not meet.</p>`);
const add = [
  // ---------- level 2
  M(2, 'direction cosines', R`The direction cosines of the line joining $(1,2,3)$ and $(3,4,4)$ are`, '$\\dfrac23,\\dfrac23,\\dfrac13$', ['$2,2,1$', '$\\dfrac25,\\dfrac25,\\dfrac15$', '$\\dfrac13,\\dfrac23,\\dfrac23$'], R`<p>Direction ratios: $(3-1,4-2,4-3)=(2,2,1)$. Length $\sqrt{4+4+1}=3$. Divide each: $\left(\dfrac23,\dfrac23,\dfrac13\right)$.</p>`, 'Divide by the length, not by the sum.'),
  I(2, 'distance formula', R`The distance between $(1,2,3)$ and $(4,6,15)$ is`, 13, R`<p>$\sqrt{3^2+4^2+12^2}=\sqrt{9+16+144}=\sqrt{169}=13$.</p>`, 'Add three squares, not two.', { calc: () => vn([3, 4, 12]) }),
  I(2, 'distance from a point to a plane', R`The distance of $(1,2,3)$ from the plane $2x+2y+z-3=0$ is`, 2, R`<p>$\dfrac{|2+4+3-3|}{\sqrt{4+4+1}}=\dfrac63=2$.</p>`, 'Divide by the length of the normal.', { calc: () => Math.abs(2 + 4 + 3 - 3) / 3 }),
  I(2, 'angle between lines', R`The angle (in degrees) between lines with direction ratios $(1,1,0)$ and $(0,1,1)$ is`, 60, R`<p>$\cos\theta=\dfrac{0+1+0}{\sqrt2\cdot\sqrt2}=\dfrac12$, so $\theta=60^\circ$.</p>`, 'Divide the dot product by both lengths.', { calc: () => dg(acos(1 / 2)) }),
  M(2, 'equation of a plane', R`The plane through the origin perpendicular to the vector $(1,2,3)$ is`, '$x+2y+3z=0$', ['$x+2y+3z=1$', '$3x+2y+z=0$', '$x+y+z=6$'], R`<p>A plane with normal $(a,b,c)$ through the origin is $ax+by+cz=0$.</p>`, 'The normal gives the coefficients directly.'),
  I(2, 'intercepts', R`A plane has intercepts $4$, $3$ and $12$ on the axes. The sum of its intercepts is`, 19, R`<p>$4+3+12=19$. (Its equation is $\dfrac x4+\dfrac y3+\dfrac z{12}=1$, i.e. $3x+4y+z=12$.)</p>`, 'Intercepts are the points where it meets each axis.', { calc: () => 4 + 3 + 12 }),
  // ---------- level 3
  N(3, 'line and plane', R`Find the angle (in degrees) between the line $\dfrac{x-1}2=\dfrac{y+1}{-1}=\dfrac z2$ and the plane $2x+y-2z=5$.`, 6.38, 0.01, R`<p>$\sin\varphi=\dfrac{|\vec b\cdot\vec n|}{|\vec b||\vec n|}$ with $\vec b=(2,-1,2)$, $\vec n=(2,1,-2)$. $\vec b\cdot\vec n=4-1-4=-1$, $|\vec b|=|\vec n|=3$.</p><p>$\sin\varphi=\dfrac19$, $\varphi=6.38^\circ$.</p>`, 'For a line and a plane use sine, not cosine.', { calc: () => dg(asin(1 / 9)) }),
  I(3, 'parallel planes', R`The distance between the planes $2x-2y+z=3$ and $2x-2y+z=12$ is`, 3, R`<p>$\dfrac{|12-3|}{\sqrt{4+4+1}}=\dfrac93=3$.</p>`, 'Both planes must have the same normal.', { calc: () => 9 / 3 }),
  M(3, 'foot of the perpendicular', R`The foot of the perpendicular from $(1,2,3)$ to the plane $x+y+z=3$ is`, '$(0,1,2)$', ['$(1,1,1)$', '$(-1,0,1)$', '$(2,3,4)$'], R`<p>Move from $P$ along the normal $(1,1,1)$: $(1+t,2+t,3+t)$ on the plane: $6+3t=3\Rightarrow t=-1$. Foot $=(0,1,2)$.</p>`, '(-1,0,1) is the image, not the foot.'),
  I(3, 'image of a point', R`The image of the point $(3,0,0)$ in the plane $2x-y+2z+3=0$ has coordinates adding up to`, -3, R`<p>Value at $P$: $6+3=9$. $|\vec n|^2=9$. Image $=P-2\cdot\dfrac99(2,-1,2)=(3,0,0)-(4,-2,4)=(-1,2,-4)$. Sum $=-3$.</p>`, 'The image is twice as far as the foot.', { calc: () => { const n = [2, -1, 2], P = [3, 0, 0], I_ = vs(P, vk((2 * (vd(n, P) + 3)) / vd(n, n), n)); return I_[0] + I_[1] + I_[2]; } }),
  M(3, 'equation of a plane', R`The plane through $(1,1,1)$ that contains the $x$-axis is`, '$y-z=0$', ['$y+z=2$', '$x-y=0$', '$z=1$'], R`<p>A plane containing the $x$-axis has no $x$ term and passes through the origin: $by+cz=0$. Through $(1,1,1)$: $b+c=0$. So $y-z=0$.</p>`, 'Containing the x-axis means the normal is perpendicular to (1,0,0).'),
  N(3, 'shortest distance', R`Find the shortest distance between the lines $\dfrac{x-1}2=\dfrac{y-2}3=\dfrac{z-3}4$ and $\dfrac{x-2}3=\dfrac{y-4}4=\dfrac{z-5}5$.`, 0.41, 0.01, R`<p>$\vec b_1=(2,3,4)$, $\vec b_2=(3,4,5)$, $\vec b_1\times\vec b_2=(-1,2,-1)$. $\vec a_2-\vec a_1=(1,2,2)$. Dot product $=-1+4-2=1$.</p><p>$d=\dfrac{1}{\sqrt6}=0.41$.</p>`, 'Divide by the length of the cross product.', { calc: () => Math.abs(vd(vc([2, 3, 4], [3, 4, 5]), [1, 2, 2])) / vn(vc([2, 3, 4], [3, 4, 5])) }),
  A(3, 'line and plane', R`The line $\dfrac{x-1}2=\dfrac{y-2}3=\dfrac{z-3}4$ is perpendicular to the plane $2x+3y+4z=5$.`, R`A line is perpendicular to a plane when its direction ratios are proportional to the coefficients of $x$, $y$, $z$ in the plane.`, 0, R`<p>Direction ratios $(2,3,4)$ equal the normal $(2,3,4)$. Both statements are true and R is the criterion used.</p>`, 'Perpendicular to the plane means parallel to the normal.'),
  S(3, 'direction cosines', R`The direction cosines of the $x$-axis are $1,0,0$.`, R`For any line, $l^2+m^2+n^2=1$.`, 0, R`<p>Both true.</p>`, 'A line has two sets of direction cosines (opposite senses).'),
  SC(3, 'basics', [R`$l^2+m^2+n^2=1$ for direction cosines.`, R`The direction ratios of a line are unique.`, R`The planes $ax+by+cz+d_1=0$ and $ax+by+cz+d_2=0$ are parallel.`, R`The angle between two planes is the angle between their normals (or its supplement).`, R`A line with direction ratios $\vec b$ is parallel to a plane with normal $\vec n$ if $\vec b\cdot\vec n=0$.`], '4', ['3', '5', '2'], R`<p>1, 3, 4, 5 are true. Direction ratios are not unique: any multiple of $(a,b,c)$ works. So four are correct.</p>`, 'Direction ratios can be scaled.'),
  N(3, 'direction cosines', R`A line is equally inclined to the three coordinate axes (with positive direction cosines). Find the angle it makes with each axis, in degrees.`, 54.74, 0.01, R`<p>$l=m=n$ and $l^2+m^2+n^2=1\Rightarrow3l^2=1$, $l=\dfrac1{\sqrt3}$. The angle is $\cos^{-1}\dfrac1{\sqrt3}=54.74^\circ$.</p>`, 'The angle is not 45 or 60 degrees.', { calc: () => dg(acos(1 / sq(3))) }),
  M(3, 'equation of a plane', R`The plane through $(1,0,0)$, $(0,2,0)$ and $(0,0,3)$ is`, '$6x+3y+2z=6$', ['$x+2y+3z=6$', '$3x+2y+z=6$', '$6x+3y+2z=1$'], R`<p>Intercept form: $\dfrac x1+\dfrac y2+\dfrac z3=1$. Multiply by $6$: $6x+3y+2z=6$.</p>`, 'Multiply by the common denominator.'),
  I(3, 'volume', R`The volume of the tetrahedron with vertices $O(0,0,0)$, $(2,0,0)$, $(0,3,0)$ and $(0,0,4)$ is`, 4, R`<p>Volume $=\dfrac16\cdot2\cdot3\cdot4=4$.</p>`, 'One sixth of the box.', { calc: () => Math.abs(det3([2, 0, 0], [0, 3, 0], [0, 0, 4])) / 6 }),
  I(3, 'line and plane', R`The line $\dfrac{x-1}2=\dfrac{y+1}3=\dfrac{z-2}6$ meets the plane $x+y+z=13$ at a point. Its $z$-coordinate is`, 8, R`<p>Point: $(1+2t,-1+3t,2+6t)$. Sum $=2+11t=13\Rightarrow t=1$. The point is $(3,2,8)$, so $z=8$.</p>`, 'Put the parametric point into the plane.', { calc: () => { const t = (13 - 2) / 11; return 2 + 6 * t; } }),
  I(3, 'angle between planes', R`The angle (in degrees) between the planes $x+y=0$ and $y+z=0$ is`, 60, R`<p>Normals $(1,1,0)$ and $(0,1,1)$: $\cos\theta=\dfrac{1}{2}$, so $\theta=60^\circ$.</p>`, 'Planes meet at the angle between their normals.', { calc: () => dg(acos(1 / 2)) }),
  I(3, 'direction cosines', R`A line makes angles $\alpha,\beta,\gamma$ with the coordinate axes. Then $\sin^2\alpha+\sin^2\beta+\sin^2\gamma=$`, 2, R`<p>$\cos^2\alpha+\cos^2\beta+\cos^2\gamma=1$, so the sines add to $3-1=2$.</p>`, 'Use l^2 + m^2 + n^2 = 1.', { calc: () => 3 - 1 }),
  // ---------- level 4
  N(4, 'distance from a point to a line', R`Find the distance of $(1,2,3)$ from the line $\dfrac{x-2}1=\dfrac{y-3}2=\dfrac{z-4}2$.`, 0.47, 0.01, R`<p>$A_0=(2,3,4)$, $\vec d=(1,2,2)$, $\overrightarrow{A_0P}=(-1,-1,-1)$. Cross product: $(-1,-1,-1)\times(1,2,2)=\left((-1)(2)-(-1)(2),\ (-1)(1)-(-1)(2),\ (-1)(2)-(-1)(1)\right)=(0,1,-1)$. Length $\sqrt2$. Distance $=\dfrac{\sqrt2}{3}=0.47$.</p>`, 'Distance = |AP x d| / |d|.', { calc: () => vn(vc([-1, -1, -1], [1, 2, 2])) / 3 }),
  N(4, 'distance from a point to a plane', R`Find the distance of $(1,2,3)$ from the plane through $(1,0,0)$, $(0,1,0)$ and $(0,0,1)$.`, 2.89, 0.01, R`<p>The plane is $x+y+z=1$. Distance $=\dfrac{|1+2+3-1|}{\sqrt3}=\dfrac5{\sqrt3}=2.89$.</p>`, 'Write the plane as x + y + z - 1 = 0.', { calc: () => 5 / sq(3) }),
  M(4, 'plane through a line', R`The plane through the origin that contains the line $\dfrac{x-1}2=\dfrac{y-1}1=\dfrac{z-1}{-1}$ is`, '$2x-3y+z=0$', ['$2x+3y+z=0$', '$x-y+z=0$', '$x+y+z=0$'], R`<p>The plane contains the vector $(2,1,-1)$ and the vector from the origin to $(1,1,1)$. Normal $=(1,1,1)\times(2,1,-1)=(-2,3,-1)$. Plane: $2x-3y+z=0$. Check: $(1,1,1)\to0$; direction: $4-3-1=0$.</p>`, 'Check both the point and the direction in your answer.'),
  N(4, 'family of planes', R`The plane through the line of intersection of $x+y+z=1$ and $2x+3y-z=4$ that passes through $(2,1,0)$ is at what distance from the origin?`, 0.85, 0.01, R`<p>Family: $(x+y+z-1)+\lambda(2x+3y-z-4)=0$. At $(2,1,0)$: $2+\lambda(3)=0\Rightarrow\lambda=-\dfrac23$. So $3(x+y+z-1)-2(2x+3y-z-4)=0$, i.e. $-x-3y+5z+5=0$, or $x+3y-5z=5$.</p><p>Distance from origin $=\dfrac5{\sqrt{35}}=0.85$.</p>`, 'Put the point in the family to find lambda.', { calc: () => 5 / sq(35) }),
  N(4, 'image of a point in a line', R`The image of $(1,2,3)$ in the line $\dfrac{x-2}1=\dfrac{y-3}2=\dfrac{z-4}2$ has coordinates adding up to`, 6.44, 0.01, R`<p>Foot $F$: $A_0+t\vec d$ with $t=\dfrac{\overrightarrow{A_0P}\cdot\vec d}{\vec d\cdot\vec d}=\dfrac{-5}9$: $F=\left(\dfrac{13}9,\dfrac{17}9,\dfrac{26}9\right)$. Image $=2F-P=\left(\dfrac{17}9,\dfrac{16}9,\dfrac{25}9\right)$. Sum $=\dfrac{58}9=6.44$.</p>`, 'The foot is the midpoint of P and its image.', { calc: () => { const A0 = [2, 3, 4], d = [1, 2, 2], P = [1, 2, 3], t = vd(vs(P, A0), d) / vd(d, d), F = va(A0, vk(t, d)), I_ = vs(vk(2, F), P); return I_[0] + I_[1] + I_[2]; } }),
  I(4, 'coplanar lines', R`The lines $\dfrac{x-1}2=\dfrac{y-2}3=\dfrac{z-3}4$ and $\dfrac{x-2}1=\dfrac{y-3}k=\dfrac{z-4}3$ are coplanar. Then $k=$`, 2, R`<p>Coplanar if $\begin{vmatrix}1&1&1\\2&3&4\\1&k&3\end{vmatrix}=0$ (first row $=\vec a_2-\vec a_1$). Expand: $1(9-4k)-1(6-4)+1(2k-3)=4-2k=0$, so $k=2$.</p>`, 'The first row is the difference of the two points.', { calc: () => { for (let k = -10; k <= 10; k++) if (det3([1, 1, 1], [2, 3, 4], [1, k, 3]) === 0) return k; } }),
  N(4, 'shortest distance', R`The $x$-axis and the line through $(2,3,4)$ with direction ratios $(0,1,1)$ are skew. Find the shortest distance between them.`, 0.71, 0.01, R`<p>$\vec b_1=(1,0,0)$, $\vec b_2=(0,1,1)$, $\vec b_1\times\vec b_2=(0,-1,1)$, $|\cdot|=\sqrt2$. $\vec a_2-\vec a_1=(2,3,4)$, dot $=-3+4=1$. $d=\dfrac1{\sqrt2}=0.71$.</p>`, 'Dot with the cross product, then divide by its length.', { calc: () => Math.abs(vd(vc([1, 0, 0], [0, 1, 1]), [2, 3, 4])) / sq(2) }),
  N(4, 'intercepts', R`A plane meets the axes at $A$, $B$, $C$ and the centroid of triangle $ABC$ is $(1,2,3)$. Find the area of triangle $ABC$.`, 31.5, 0.01, R`<p>Centroid $\left(\dfrac a3,\dfrac b3,\dfrac c3\right)=(1,2,3)$ gives $A(3,0,0)$, $B(0,6,0)$, $C(0,0,9)$. $\overrightarrow{AB}\times\overrightarrow{AC}=(-3,6,0)\times(-3,0,9)=(54,27,18)$, length $\sqrt{2916+729+324}=63$. Area $=31.5$.</p>`, 'The area is half the length of the cross product.', { calc: () => vn(vc(vs([0, 6, 0], [3, 0, 0]), vs([0, 0, 9], [3, 0, 0]))) / 2 }),
  N(4, 'angle between lines', R`Find the angle (in degrees) between a body diagonal of a cube and a face diagonal that starts at one of its ends.`, 35.26, 0.01, R`<p>Take the cube $[0,1]^3$: body diagonal $(1,1,1)$ and face diagonal $(1,1,0)$. $\cos\theta=\dfrac{2}{\sqrt3\sqrt2}=\sqrt{\dfrac23}$, so $\theta=35.26^\circ$.</p>`, 'Choose the face diagonal on a face meeting the vertex.', { calc: () => dg(acos(vd([1, 1, 1], [1, 1, 0]) / (sq(3) * sq(2)))) }),
  N(4, 'projection of a segment', R`The projection of the segment from $A(1,2,3)$ to $B(4,6,15)$ on a line with direction ratios $(2,3,6)$ has length`, 12.86, 0.01, R`<p>$\overrightarrow{AB}=(3,4,12)$. Unit vector along the line: $\dfrac17(2,3,6)$. Projection $=\dfrac{6+12+72}7=\dfrac{90}7=12.86$.</p>`, 'Divide by the length 7 of the direction vector.', { calc: () => vd([3, 4, 12], [2, 3, 6]) / 7 }),
  I(4, 'points on a line', R`Two points on the line $\dfrac{x-1}2=\dfrac{y-2}3=\dfrac{z-3}6$ are at distance $14$ from $(1,2,3)$. The product of their $y$-coordinates is`, -32, R`<p>Points: $(1+2t,2+3t,3+6t)$, distance $=7|t|=14$, so $t=\pm2$: $(5,8,15)$ and $(-3,-4,-9)$. Product of $y$-coordinates $=8\times(-4)=-32$.</p>`, 'Both signs of t give a point.', { calc: () => (2 + 3 * 2) * (2 - 3 * 2) }),
  N(4, 'locus', R`A point moves so that its distance from the plane $x+y+z=3$ is $2\sqrt3$. The locus is two planes. Find the distance between them.`, 6.93, 0.01, R`<p>$\dfrac{|x+y+z-3|}{\sqrt3}=2\sqrt3\Rightarrow|x+y+z-3|=6$, i.e. $x+y+z=9$ or $x+y+z=-3$. Distance between them $=\dfrac{12}{\sqrt3}=6.93$.</p>`, 'There are two planes, one on each side.', { calc: () => 12 / sq(3) }),
  I(4, 'ratio', R`The plane $2x+3y-z=5$ divides the line segment joining $A(1,0,0)$ and $B(3,2,0)$ internally in the ratio $m:n$ (in lowest terms). Find $m+n$.`, 10, R`<p>Value of $2x+3y-z-5$ at $A$: $2-5=-3$. At $B$: $6+6-5=7$. The ratio $AP:PB=|{-3}|:7=3:7$. $m+n=10$.</p>`, 'The ratio equals the ratio of the absolute values of the two plane values.', { calc: () => { const f = (P) => 2 * P[0] + 3 * P[1] - P[2] - 5, a = Math.abs(f([1, 0, 0])), b = Math.abs(f([3, 2, 0])), g = gcd(a, b); return (a + b) / g; } }),
  N(4, 'distance from a point to a line', R`Find the distance of $(2,2,3)$ from the line given by $x+y+z=6$ and $x-y+z=2$.`, 0.71, 0.01, R`<p>Direction $=(1,1,1)\times(1,-1,1)=(2,0,-2)\sim(1,0,-1)$. A point on the line ($z=4$, $y=2$, $x=0$): $A_0=(0,2,4)$. $\overrightarrow{A_0P}=(2,0,-1)$. Cross with $(1,0,-1)$: $(0\cdot(-1)-(-1)\cdot0,\ (-1)(1)-2(-1),\ 0)=(0,1,0)$, length $1$. Distance $=\dfrac1{\sqrt2}=0.71$.</p>`, 'Find a direction by the cross product of the two normals.', { calc: () => vn(vc([2, 0, -1], [1, 0, -1])) / sq(2) }),
  N(4, 'angle between planes', R`Find the angle (in degrees) between the planes $x+2y-2z=5$ and $2x-3y+6z=1$.`, 40.37, 0.01, R`<p>$\vec n_1=(1,2,-2)$, $|\vec n_1|=3$; $\vec n_2=(2,-3,6)$, $|\vec n_2|=7$. $\vec n_1\cdot\vec n_2=2-6-12=-16$. $\cos\theta=\dfrac{16}{21}$ (acute angle), $\theta=40.37^\circ$.</p>`, 'Take the acute angle between the planes.', { calc: () => dg(acos(16 / 21)) }),
  I(4, 'line and plane', R`The line $\vec r=(\hat i+2\hat j+3\hat k)+\lambda(2\hat i+\hat j-2\hat k)$ meets the plane $\vec r\cdot(\hat i+\hat j+\hat k)=7$. The product of the coordinates of the meeting point is`, 9, R`<p>Point $(1+2\lambda,2+\lambda,3-2\lambda)$ has coordinate sum $6+\lambda=7$, so $\lambda=1$ and the point is $(3,3,1)$. Product $=9$.</p>`, 'The plane equation is a dot product with (1,1,1).', { calc: () => { const l = 1; return (1 + 2 * l) * (2 + l) * (3 - 2 * l); } }),
  I(4, 'system of planes', R`The planes $x+y+z=1$, $x+2y+3z=k$ and $x+3y+5z=k^2$ have a line in common for exactly how many real values of $k$?`, 1, R`<p>The third equation is $2\times$(second)$-$(first) on the left side, so the system is consistent only if $k^2=2k-1$, i.e. $(k-1)^2=0$, $k=1$. Then the planes share a line. Exactly one value.</p>`, 'Check the right-hand sides combine in the same way.', { calc: () => { let c = 0; for (let k = -50; k <= 50; k += 0.5) if (Math.abs(k * k - (2 * k - 1)) < 1e-9) c++; return c; } }),
  N(4, 'plane perpendicular to two planes', R`A plane through $(1,1,1)$ is perpendicular to the planes $x+y-2z=1$ and $2x-y+z=2$. Find the sum of its intercepts on the three axes.`, 13.8, 0.01, R`<p>Normal $=(1,1,-2)\times(2,-1,1)=(1-2,\ -4-1,\ -1-2)=(-1,-5,-3)\sim(1,5,3)$. Plane: $x+5y+3z=1+5+3=9$. Intercepts $9,\ \dfrac95,\ 3$. Sum $=13.8$.</p>`, 'The normal of the new plane is the cross product of the two normals.', { calc: () => { const n = vc([1, 1, -2], [2, -1, 1]); const m = gcd(gcd(Math.abs(n[0]), Math.abs(n[1])), Math.abs(n[2])); const nn = n.map((v) => -v / m); const D = vd(nn, [1, 1, 1]); return D / nn[0] + D / nn[1] + D / nn[2]; } }),
  N(4, 'cube', R`A cube has side $6$. Find the shortest distance between a body diagonal and the diagonal of a face that does not meet it.`, 2.45, 0.01, R`<p>Cube $[0,6]^3$. Body diagonal $O\to(6,6,6)$, direction $(1,1,1)$. Face diagonal on the face $z=0$ from $(6,0,0)$ to $(0,6,0)$, direction $(-1,1,0)$. Cross product $(1,1,1)\times(-1,1,0)=(-1,-1,2)$, length $\sqrt6$. Vector $(6,0,0)$ dotted with it gives $-6$.</p><p>Distance $=\dfrac6{\sqrt6}=\sqrt6=2.45$.</p>`, 'Use the general side a to get a / sqrt 6.', { calc: () => Math.abs(vd(vc([1, 1, 1], [-1, 1, 0]), [6, 0, 0])) / sq(6) }),
  N(4, 'reflection of a line', R`A ray along the $x$-axis (through the origin) is reflected in the plane $x+y+z=0$. Find the angle (in degrees) between the incident ray and the reflected ray.`, 70.53, 0.01, R`<p>Reflected direction $\vec d'=\vec d-2\dfrac{\vec d\cdot\vec n}{|\vec n|^2}\vec n=(1,0,0)-\dfrac23(1,1,1)=\dfrac13(1,-2,-2)$. $\cos\theta=\dfrac{(1,0,0)\cdot(1,-2,-2)}{1\cdot3}=\dfrac13$, $\theta=70.53^\circ$.</p>`, 'The direction is reflected, not the point.', { calc: () => dg(acos(1 / 3)) }),
  I(4, 'planes', R`How many planes that make equal intercepts (in size) on the three axes are at a distance $3\sqrt3$ from the origin?`, 8, R`<p>Planes $\pm\dfrac xp\pm\dfrac yp\pm\dfrac zp=1$ with $|p|=k$ are at distance $\dfrac k{\sqrt3}$ from the origin. So $k=9$. The sign choices give $2^3=8$ planes.</p>`, 'Intercepts of equal size can differ in sign.', { calc: () => 2 ** 3 }),
  X(4, 'direction cosines', R`Which of these can be the direction cosines of a line?`, [R`$\left(\dfrac13,\dfrac23,\dfrac23\right)$`, R`$\left(\dfrac12,\dfrac12,\dfrac12\right)$`, R`$\left(0,\dfrac35,\dfrac45\right)$`, R`$(1,0,0)$`], [0, 2, 3], R`<p>The squares must add to $1$. $\frac19+\frac49+\frac49=1$; $\frac34\ne1$; $\frac9{25}+\frac{16}{25}=1$; $1$.</p>`, 'Check l^2 + m^2 + n^2 = 1.'),
  X(4, 'line and plane', R`Which lines are parallel to the plane $x+y+z=3$?`, [R`direction ratios $(1,-1,0)$`, R`direction ratios $(1,1,-2)$`, R`direction ratios $(1,1,1)$`, R`direction ratios $(2,-1,-1)$`], [0, 1, 3], R`<p>The dot product with $(1,1,1)$ must be $0$: $0$, $0$, $3$, $0$.</p>`, 'Parallel to a plane means perpendicular to its normal.'),
  X(4, 'points on a line', R`Which of these points lie on the line $\dfrac{x-1}2=\dfrac{y+1}3=\dfrac{z-2}{-1}$?`, [R`$(3,2,1)$`, R`$(5,5,0)$`, R`$(-1,-4,3)$`, R`$(2,-1,2)$`], [0, 1, 2], R`<p>Points $(1+2t,-1+3t,2-t)$: $t=1$ gives $(3,2,1)$; $t=2$ gives $(5,5,0)$; $t=-1$ gives $(-1,-4,3)$. $(2,-1,2)$ would need $t=\frac12$ from $x$ but $t=0$ from $y$.</p>`, 'Find t from one coordinate and test the others.'),
  X(4, 'planes', R`Which of these equations represent the $xy$-plane?`, [R`$z=0$`, R`the plane through $(1,0,0)$, $(0,1,0)$, $(0,0,0)$`, R`$x+y=0$`, R`the plane through the origin with normal direction cosines $(0,0,1)$`], [0, 1, 3], R`<p>All three of 1, 2, 4 give $z=0$. $x+y=0$ is a vertical plane.</p>`, 'Three non-collinear points fix a plane.'),
  X(4, 'plane properties', R`For the plane $3x+4y+12z=26$, which statements are true?`, [R`Its distance from the origin is $2$`, R`The direction cosines of its normal are $\left(\dfrac3{13},\dfrac4{13},\dfrac{12}{13}\right)$`, R`Its $z$-intercept is $\dfrac{13}6$`, R`The distance of $(1,1,1)$ from it is $1$`], [0, 1, 2], R`<p>$\sqrt{9+16+144}=13$. Distance from the origin $\dfrac{26}{13}=2$. Normal DCs as stated. $z$-intercept $\dfrac{26}{12}=\dfrac{13}6$. At $(1,1,1)$: $|3+4+12-26|=7$, distance $\dfrac7{13}$, not $1$.</p>`, 'Test statement 4 by substitution.'),
  A(4, 'line and plane', R`The line through $(1,2,3)$ with direction ratios $(1,-2,1)$ is parallel to the plane $x+y+z=10$.`, R`A line is parallel to a plane when its direction ratios are perpendicular to the normal of the plane (and it does not lie in the plane).`, 0, R`<p>$(1,-2,1)\cdot(1,1,1)=0$. The point $(1,2,3)$ gives $6\ne10$, so it is not in the plane. A is true, and R is the criterion.</p>`, 'Also check that the line does not lie in the plane.'),
  S(4, 'parallel planes', R`The planes $x+2y+3z=1$ and $2x+4y+6z=7$ are parallel.`, R`Two planes are parallel when the coefficients of $x$, $y$, $z$ are proportional.`, 0, R`<p>Coefficients $(1,2,3)$ and $(2,4,6)$ are proportional. The constants $1$ and $\frac72$ (after dividing by 2) differ, so they are distinct parallel planes. Both statements are true.</p>`, 'The constants decide whether they coincide.'),
  SC(4, 'basics', [R`A line is parallel to a plane if $\vec b\cdot\vec n=0$.`, R`Two distinct planes either meet in a line or are parallel.`, R`Three planes always meet at a point.`, R`The distance between two parallel lines equals the distance from any point on one of them to the other.`, R`Skew lines can be coplanar.`], '3', ['2', '4', '5'], R`<p>1, 2, 4 are true. 3 is false: for example three planes can meet in a line or have no common point. 5 is false: skew lines are non-coplanar by definition. Three are correct.</p>`, 'Skew means not coplanar.'),
  // ---------- level 5
  I(5, 'common perpendicular', R`The common perpendicular to $L_1$: $\dfrac{x-1}2=\dfrac{y-2}3=\dfrac{z-3}4$ and $L_2$: $\dfrac{x-2}3=\dfrac{y-4}4=\dfrac{z-5}5$ meets $L_1$ at $P$. The sum of the coordinates of $P$ is`, 9, R`<p>Let $P=(1+2\lambda,2+3\lambda,3+4\lambda)$ and $Q=(2+3\mu,4+4\mu,5+5\mu)$. $\overrightarrow{PQ}\perp\vec b_1,\vec b_2$ gives $16+38\mu-29\lambda=0$ and $21+50\mu-38\lambda=0$. Solving: $\mu=-\dfrac16$, $\lambda=\dfrac13$.</p><p>$P=\left(\dfrac53,3,\dfrac{13}3\right)$, sum $=\dfrac{5+9+13}3=9$.</p>`, 'Two perpendicularity conditions give two equations.', { calc: () => { const a1 = [1, 2, 3], b1 = [2, 3, 4], a2 = [2, 4, 5], b2 = [3, 4, 5]; // minimise |P-Q|^2 by solving the normal equations
    const w = vs(a2, a1); const A = vd(b1, b1), B = -vd(b1, b2), C = vd(b2, b2), d1 = vd(w, b1), d2 = -vd(w, b2); // A l + B m = d1 ; B l + C m = d2
    const D = A * C - B * B, l = (d1 * C - B * d2) / D; const P = va(a1, vk(l, b1)); return P[0] + P[1] + P[2]; } }),
  N(5, 'tetrahedron', R`Find the volume of the tetrahedron with vertices $(1,0,0)$, $(0,1,0)$, $(0,0,1)$ and $(1,1,1)$.`, 0.33, 0.01, R`<p>Take $A=(1,0,0)$: $\overrightarrow{AB}=(-1,1,0)$, $\overrightarrow{AC}=(-1,0,1)$, $\overrightarrow{AD}=(0,1,1)$. Determinant $=-1(0-1)-1(-1-0)+0=2$. Volume $=\dfrac26=\dfrac13=0.33$.</p>`, 'Volume of a tetrahedron is one sixth of the triple product.', { calc: () => Math.abs(det3([-1, 1, 0], [-1, 0, 1], [0, 1, 1])) / 6 }),
  N(5, 'projection of an area', R`Triangle $ABC$ has vertices $A(1,2,3)$, $B(3,1,4)$, $C(2,5,1)$. Find the area of its projection on the plane $x+y+z=0$.`, 3.18, 0.01, R`<p>$\overrightarrow{AB}\times\overrightarrow{AC}=(2,-1,1)\times(1,3,-2)=(-1,5,7)$, length $\sqrt{75}$. Area of the triangle $=\dfrac{\sqrt{75}}2$.</p><p>Angle between the triangle's normal $(-1,5,7)$ and the plane's normal $(1,1,1)$: $\cos\theta=\dfrac{11}{\sqrt{75}\sqrt3}=\dfrac{11}{15}$. Projected area $=\dfrac{\sqrt{75}}2\times\dfrac{11}{15}=3.18$.</p>`, 'Projected area = area times the cosine of the angle between the planes.', { calc: () => { // project the vertices on the plane and compute the area in an orthonormal basis of the plane
    const n = [1, 1, 1], pr = (P) => vs(P, vk(vd(P, n) / 3, n)); const A = pr([1, 2, 3]), B = pr([3, 1, 4]), C = pr([2, 5, 1]); return vn(vc(vs(B, A), vs(C, A))) / 2; } }),
  I(5, 'cube', R`In a cube, let $\theta$ be the acute angle between two body diagonals. Then $\cos\theta=\dfrac1k$. Find $k$.`, 3, R`<p>Body diagonals $(1,1,1)$ and $(1,1,-1)$ (from different vertices): $\cos\theta=\dfrac{1+1-1}{3}=\dfrac13$. So $k=3$ ($\theta=70.53^\circ$).</p>`, 'The angle is not 60 degrees.', { calc: () => 1 / (vd([1, 1, 1], [1, 1, -1]) / 3) }),
  I(5, 'family of planes', R`The plane $2x+z=1$ belongs to the family of planes through the line of intersection of $x+y+z=1$ and $x-y=0$. If the family is $(x+y+z-1)+\lambda(x-y)=0$, then $\lambda=$`, 1, R`<p>$(1+\lambda)x+(1-\lambda)y+z=1$. For this to be $2x+z=1$ we need $1-\lambda=0$ and $1+\lambda=2$. So $\lambda=1$.</p>`, 'The coefficient of y must vanish.', { calc: () => 1 }),
  I(5, 'family of lines', R`Find the greatest possible distance of the origin from a plane that contains the line through $(1,2,2)$ with direction ratios $(2,-2,1)$.`, 3, R`<p>For a plane containing a line, the distance from a point $O$ is at most the distance from $O$ to the line (the farthest plane is perpendicular to the perpendicular dropped from $O$ to the line). Here $\overrightarrow{OA}=(1,2,2)$ and $\vec d=(2,-2,1)$ with $\overrightarrow{OA}\cdot\vec d=2-4+2=0$, so $A$ itself is the foot. Greatest distance $=|OA|=\sqrt{1+4+4}=3$.</p>`, 'The distance to the line is the upper bound.', { calc: () => vn(vc([1, 2, 2], [2, -2, 1])) / 3 }),
  X(5, 'plane relations', R`Which planes are perpendicular to the plane $x+y+z=0$?`, [R`$x-y=0$`, R`$x+y-2z=0$`, R`$2x+y+z=1$`, R`$x+2y-3z=7$`], [0, 1, 3], R`<p>Dot products of normals with $(1,1,1)$: $0$; $0$; $4$; $0$.</p>`, 'Perpendicular planes have perpendicular normals.'),
  X(5, 'skew lines', R`Which lines are skew to the $x$-axis?`, [R`$x=0$, $y=1$, $z=t$`, R`$x=1$, $y=t$, $z=t$`, R`$x=t$, $y=1$, $z=0$`, R`$x=1+t$, $y=1$, $z=t$`], [0, 3], R`<p>(1) Direction $(0,0,1)$; does not meet the $x$-axis ($y=1$): skew. (2) Meets it at $(1,0,0)$. (3) Parallel to the $x$-axis, not skew. (4) Direction $(1,0,1)$ is not parallel, and $y=1\ne0$ means no meeting point: skew.</p>`, 'Parallel lines are not skew.'),
  X(5, 'angles', R`Which statements are true?`, [R`The lines with direction ratios $(1,2,2)$ and $(2,1,-2)$ are perpendicular`, R`The lines with direction ratios $(1,1,0)$ and $(1,-1,0)$ are perpendicular`, R`The planes $x+y+z=1$ and $x+y+z=5$ are parallel`, R`The planes $x+y=1$ and $y+z=1$ are perpendicular`], [0, 1, 2], R`<p>Dot products: $2+2-4=0$; $1-1=0$. Same normal for the planes in 3. Normals $(1,1,0),(0,1,1)$ have dot product $1$, so the planes are at $60^\circ$, not perpendicular.</p>`, 'Test with dot products.'),
  X(5, 'cube', R`In a cube, which statements are true?`, [R`The angle between a body diagonal and an edge has cosine $\dfrac1{\sqrt3}$`, R`The angle between two body diagonals is $60^\circ$`, R`Two face diagonals from the same vertex on adjacent faces make $60^\circ$`, R`A body diagonal and a face diagonal from the same vertex have $\cos\theta=\sqrt{\dfrac23}$`], [0, 2, 3], R`<p>$(1,1,1)\cdot(1,0,0)=1$, over $\sqrt3$: true. Body diagonals: $\cos\theta=\frac13$ ($70.53^\circ$), so 2 is false. Face diagonals $(1,1,0),(1,0,1)$: $\cos\theta=\frac12$: true. Body and face diagonal: $\frac{2}{\sqrt6}=\sqrt{\frac23}$: true.</p>`, 'The angle between two body diagonals is not 60 degrees.'),
  X(5, 'family of planes', R`Which planes belong to the family through the line of intersection of $x+y+z=1$ and $x-y=0$?`, [R`$x+y+z=1$`, R`$2x+z=1$`, R`$x+z=1$`, R`$x-y=0$`], [0, 1, 3], R`<p>The family is $(1+\lambda)x+(1-\lambda)y+z=1$ together with $x-y=0$. $\lambda=0$: first. $\lambda=1$: $2x+z=1$. For $x+z=1$ we would need $1-\lambda=0$ and $1+\lambda=1$, impossible. $x-y=0$ is the second given plane.</p>`, 'Test each by finding lambda.'),
  A(5, 'skew lines', R`Two lines in space with different direction ratios always intersect.`, R`Two lines in space that are not parallel may be skew.`, 3, R`<p>A is false: skew lines have different directions and never meet. R is true.</p>`, 'Non-parallel does not mean intersecting.'),
  A(5, 'shortest distance', R`The shortest distance between two intersecting lines is zero.`, R`For coplanar lines, $(\vec a_2-\vec a_1)\cdot(\vec b_1\times\vec b_2)=0$.`, 0, R`<p>Intersecting lines are coplanar, so the triple product in the distance formula is zero. Both true; R explains the numerator vanishing.</p>`, 'The formula is for non-parallel lines.'),
  S(5, 'direction cosines', R`A line has exactly two sets of direction cosines.`, R`The direction ratios of a line are unique.`, 1, R`<p>Statement I is true: $(l,m,n)$ and $(-l,-m,-n)$ for the two senses. Statement II is false: any non-zero multiple of the ratios works.</p>`, 'Ratios scale; cosines have fixed length 1.'),
  SC(5, 'formulae', [R`The distance of the origin from $ax+by+cz+d=0$ is $\dfrac{|d|}{\sqrt{a^2+b^2+c^2}}$.`, R`The direction cosines of the $x$-axis are $(1,0,0)$.`, R`The angle between a line and a plane is the angle between the line and the normal.`, R`The distance between $ax+by+cz=d_1$ and $ax+by+cz=d_2$ is $\dfrac{|d_1-d_2|}{\sqrt{a^2+b^2+c^2}}$.`], '3', ['2', '4', '1'], R`<p>1, 2, 4 are correct. 3 is false: the angle between a line and a plane is the complement of the angle between the line and the normal. Three are correct.</p>`, 'Sine for line-plane; cosine for line-line and plane-plane.'),
  // ---------- passages
  PI(3, 'distance from a point to a plane', 'xp1', R`The distance of $P$ from $\pi$ is`, 1, R`<p>$\dfrac{|6-1-2-6|}{\sqrt{4+1+4}}=\dfrac33=1$.</p>`, 'The value of the plane expression is -3.', { calc: () => Math.abs(pv([2, -1, 2], 6, [3, 1, -1])) / 3 }),
  PI(4, 'foot of the perpendicular', 'xp1', R`The foot of the perpendicular from $P$ to $\pi$ has coordinates adding up to`, 4, R`<p>Value at $P$ is $-3$, so $F=P-\dfrac{-3}{9}(2,-1,2)=\left(\dfrac{11}3,\dfrac23,-\dfrac13\right)$. Sum $=\dfrac{12}3=4$.</p>`, 'Move along the normal by value divided by |n|^2.', { calc: () => { const n = [2, -1, 2], P = [3, 1, -1], F = vs(P, vk(pv(n, 6, P) / 9, n)); return F[0] + F[1] + F[2]; } }),
  PI(5, 'image of a point', 'xp1', R`Let $P'$ be the image of $P$ in $\pi$. Three times the $x$-coordinate of $P'$ is`, 13, R`<p>$P'=P-2\cdot\dfrac{-3}9(2,-1,2)=(3,1,-1)+\dfrac23(2,-1,2)=\left(\dfrac{13}3,\dfrac13,\dfrac13\right)$. Three times $x$ is $13$.</p>`, 'The image is twice as far along the normal as the foot.', { calc: () => { const n = [2, -1, 2], P = [3, 1, -1], I_ = vs(P, vk((2 * pv(n, 6, P)) / 9, n)); return 3 * I_[0]; } }),
  PN(3, 'shortest distance', 'xp2', R`The shortest distance between $L_1$ and $L_2$ is`, 0.41, 0.01, R`<p>$\vec b_1\times\vec b_2=(-1,2,-1)$, length $\sqrt6$. $(\vec a_2-\vec a_1)\cdot(\ldots)=-1+4-2=1$. $d=\dfrac1{\sqrt6}=0.41$.</p>`, 'Take the absolute value of the triple product.', { calc: () => 1 / sq(6) }),
  PN(4, 'angle between lines', 'xp2', R`The (acute) angle between $L_1$ and $L_2$ in degrees is`, 3.69, 0.02, R`<p>$\cos\theta=\dfrac{(2,3,4)\cdot(3,4,5)}{\sqrt{29}\sqrt{50}}=\dfrac{38}{38.08}=0.9979$, so $\theta=3.69^\circ$.</p>`, 'The lines are almost parallel.', { calc: () => dg(acos(38 / (sq(29) * sq(50)))) }),
  PI(5, 'common perpendicular', 'xp2', R`The common perpendicular meets $L_1$ at $P$ and $L_2$ at $Q$. The sum of the coordinates of $P$ is`, 9, R`<p>$P=\left(\dfrac53,3,\dfrac{13}3\right)$ from the two perpendicularity equations; the sum is $9$.</p>`, 'Set up PQ perpendicular to both directions.', { calc: () => 9 }),
  // ---------- matches
  MT(3, 'distance from the origin', 'xm1', { title: 'Distance of planes from the origin', passage: R`<p>Match each plane in List I with its distance from the origin in List II.</p>`, list1: [R`A. $2x-2y+z=9$`, R`B. $6x+3y+2z=14$`, R`C. $3x+4y=5$`, R`D. $2x+3y+6z=35$`], list2: [R`p. $1$`, R`q. $2$`, R`r. $3$`, R`s. $5$`] }, 'rqps', R`<p>$\dfrac9{\sqrt9}=3$; $\dfrac{14}7=2$; $\dfrac5{\sqrt{25}}=1$; $\dfrac{35}7=5$.</p>`, 'Divide by the length of the normal.'),
  MT(4, 'angle between lines', 'xm2', { title: 'Angles between lines', passage: R`<p>Match each pair of lines (direction ratios) in List I with the angle between them in List II.</p>`, list1: [R`A. $(1,1,0)$ and $(0,1,1)$`, R`B. $(1,2,2)$ and $(2,1,-2)$`, R`C. $(1,0,0)$ and $(1,1,0)$`, R`D. $(\sqrt3,1,0)$ and $(1,0,0)$`], list2: [R`p. $45^\circ$`, R`q. $90^\circ$`, R`r. $30^\circ$`, R`s. $60^\circ$`] }, 'sqpr', R`<p>A: $\cos\theta=\frac12$. B: dot $0$. C: $\frac1{\sqrt2}$. D: $\frac{\sqrt3}2$.</p>`, 'Use the dot product over both lengths.'),
  MT(4, 'equation of a plane', 'xm3', { title: 'Planes through three points', passage: R`<p>Match each set of three points in List I with the plane through them in List II.</p>`, list1: [R`A. $(1,0,0),(0,2,0),(0,0,3)$`, R`B. $(1,0,0),(0,1,0),(0,0,1)$`, R`C. $(2,0,0),(0,2,0),(0,0,2)$`, R`D. $(1,0,0),(0,-1,0),(0,0,1)$`], list2: [R`p. $x+y+z=1$`, R`q. $6x+3y+2z=6$`, R`r. $x-y+z=1$`, R`s. $x+y+z=2$`] }, 'qpsr', R`<p>Intercept form: A: $\frac x1+\frac y2+\frac z3=1$. B: $x+y+z=1$. C: $\frac x2+\frac y2+\frac z2=1$. D: $\frac x1+\frac y{-1}+\frac z1=1$.</p>`, 'A negative intercept flips the sign of that term.'),
  MT(4, 'distance formulae', 'xm4', { title: 'Which formula?', passage: R`<p>Match each distance in List I with its formula in List II.</p>`, list1: [R`A. Between the parallel planes $ax+by+cz+d_1=0$ and $ax+by+cz+d_2=0$`, R`B. From a point to a plane`, R`C. Between two skew lines`, R`D. From a point to a line`], list2: [R`p. $\dfrac{|(\vec a_2-\vec a_1)\cdot(\vec b_1\times\vec b_2)|}{|\vec b_1\times\vec b_2|}$`, R`q. $\dfrac{|ax_1+by_1+cz_1+d|}{\sqrt{a^2+b^2+c^2}}$`, R`r. $\dfrac{|d_1-d_2|}{\sqrt{a^2+b^2+c^2}}$`, R`s. $\dfrac{|\overrightarrow{AP}\times\vec b|}{|\vec b|}$`] }, 'rqps', R`<p>Standard formulae.</p>`, 'Skew lines need a triple product.'),
  MT(3, 'direction cosines', 'xm5', { title: 'Direction cosines from ratios', passage: R`<p>A line has the direction ratios in List I. Match its direction cosine $l$ (the first one) with List II.</p>`, list1: [R`A. $(3,4,12)$`, R`B. $(1,2,2)$`, R`C. $(2,3,6)$`, R`D. $(1,4,8)$`], list2: [R`p. $\dfrac13$`, R`q. $\dfrac27$`, R`r. $\dfrac3{13}$`, R`s. $\dfrac19$`] }, 'rpqs', R`<p>Lengths: $13$, $3$, $7$, $9$.</p>`, 'Divide by the length of the ratio vector.'),
  MT(4, 'intersection of planes', 'xm6', { title: 'Position of planes', passage: R`<p>Match each pair of planes in List I with how they meet in List II.</p>`, list1: [R`A. $x+y+z=1$, $x+y+z=2$`, R`B. $x+y+z=1$, $x-y=0$`, R`C. $x=0$, $y=0$, $z=0$`, R`D. $x+y+z=1$, $2x+2y+2z=2$`], list2: [R`p. A line`, R`q. A single point`, R`r. No common point`, R`s. The same plane`] }, 'rpqs', R`<p>A: parallel, distinct. B: intersect in a line. C: the origin. D: the second is twice the first, so the planes coincide.</p>`, 'Check proportional constants.'),
  MT(4, 'position of two lines', 'xm7', { title: 'Two lines in space', passage: R`<p>Match each pair of lines in List I with their relation in List II.</p>`, list1: [R`A. $\dfrac x1=\dfrac y1=\dfrac z1$ and $\dfrac x1=\dfrac y2=\dfrac z3$`, R`B. $\dfrac x1=\dfrac y1=\dfrac z1$ and $\dfrac{x-1}1=\dfrac{y-1}1=\dfrac{z-1}1$`, R`C. $\dfrac x1=\dfrac y1=\dfrac z1$ and $\dfrac{x-1}1=\dfrac y1=\dfrac z1$`, R`D. The $x$-axis and the line through $(0,1,0)$ with direction $(0,0,1)$`], list2: [R`p. Parallel and distinct`, R`q. Skew`, R`r. Intersect at one point`, R`s. Coincident`] }, 'rspq', R`<p>A: both pass through the origin with different directions. B: $(1,1,1)$ lies on the first line and has the same direction, so they coincide. C: same direction, but $(1,0,0)$ is not on the first line. D: neither parallel nor meeting.</p>`, 'Same direction: parallel or the same line.'),
  MT(4, 'cube', 'xm8', { title: 'Angles in a cube', passage: R`<p>For a cube, match each angle in List I with its cosine in List II.</p>`, list1: [R`A. Between a body diagonal and an edge`, R`B. Between two body diagonals`, R`C. Between face diagonals from one vertex on adjacent faces`, R`D. Between a body diagonal and a face diagonal from one vertex`], list2: [R`p. $\dfrac12$`, R`q. $\dfrac13$`, R`r. $\sqrt{\dfrac23}$`, R`s. $\dfrac1{\sqrt3}$`] }, 'sqpr', R`<p>A: $\frac{1}{\sqrt3}$. B: $\frac13$. C: $\frac12$. D: $\frac{2}{\sqrt6}=\sqrt{\frac23}$.</p>`, 'Pick vectors (1,1,1), (1,1,-1) and so on.'),
];
items.push(...add);
const xgens = [
  gen('td-gx1', 3, 'nat', 'numeric', 'distance from a point to a plane', (rng) => {
    const n = [int(rng, 1, 6), int(rng, -6, 6), int(rng, 1, 6)], P = [int(rng, -5, 5), int(rng, -5, 5), int(rng, -5, 5)], D = int(rng, -9, 9);
    const dv = pv(n, D, P), L = vn(n), ans = Math.abs(dv) / L;
    if (dv === 0) throw RETRY;
    return { n, P, D, answer: r2(ans), tol: 0.01, q: R`Find the distance of $(${P.join(',')})$ from the plane $${plL(n)}=${D}$. (2 decimal places)`, sol: R`<p>Write the plane as $${plL(n)}-${D < 0 ? `(${D})` : D}=0$. Value at the point $=${n[0]}(${P[0]})+(${n[1]})(${P[1]})+${n[2]}(${P[2]})-${D < 0 ? `(${D})` : D}=${dv}$. $\sqrt{${n[0] ** 2}+${n[1] ** 2}+${n[2] ** 2}}=${r4(L)}$.</p><p>Distance $=\dfrac{|${dv}|}{${r4(L)}}=${r2(ans)}$.</p>` };
  }, (p) => { const L = vn(p.n), t = (vd(p.n, p.P) - p.D) / (L * L), F = vs(p.P, vk(t, p.n)); return vn(vs(p.P, F)); }),
  gen('td-gx2', 3, 'mcq', 'single', 'direction cosines', (rng) => {
    const [a, b, c, N_] = choose(rng, [[1, 2, 2, 3], [2, 3, 6, 7], [2, 6, 9, 11], [3, 4, 12, 13], [1, 4, 8, 9], [2, 10, 11, 15]]);
    const sg = [choose(rng, [1, -1]), choose(rng, [1, -1]), choose(rng, [1, -1])], dr = [a * sg[0], b * sg[1], c * sg[2]];
    const A_ = [int(rng, -3, 3), int(rng, -3, 3), int(rng, -3, 3)], B_ = va(A_, dr);
    const f = (n, d) => { const g = gcd(n, d); return n === 0 ? '0' : `${n < 0 ? '-' : ''}\\dfrac{${Math.abs(n) / g}}{${d / g}}`; };
    const tx = (v) => `$${v.map((n) => f(n, N_)).join(',')}$`;
    const ans = tx(dr), s1 = dr.reduce((x, y) => x + y, 0);
    const o = shuffleOpts(rng, ans, [tx([-dr[0], -dr[1], -dr[2]].map((v, i) => (i === 0 ? dr[0] : -dr[i]))), `$${dr.join(',')}$`, tx([dr[1], dr[0], dr[2]])]);
    return { A_, B_, dr, N_, options: o.options, answer: o.answer, q: R`The direction cosines of the line joining $A(${A_.join(',')})$ to $B(${B_.join(',')})$ (from $A$ to $B$) are`, sol: R`<p>Direction ratios: $B-A=(${dr.join(',')})$. Length $\sqrt{${dr.map((v) => v * v).join('+')}}=${N_}$. Divide each by $${N_}$: ${ans}.</p>` };
  }, (p) => { const d = vs(p.B_, p.A_), L = vn(d); const f = (n, dd) => { const g = gcd(n, dd); return n === 0 ? '0' : `${n < 0 ? '-' : ''}\\dfrac{${Math.abs(n) / g}}{${dd / g}}`; }; const want = `$${d.map((n) => f(n, Math.round(L))).join(',')}$`; return p.options.indexOf(want); }),
  gen('td-gx3', 4, 'nat', 'numeric', 'shortest distance', (rng) => {
    const a1 = [int(rng, -4, 4), int(rng, -4, 4), int(rng, -4, 4)], a2 = [int(rng, -4, 4), int(rng, -4, 4), int(rng, -4, 4)], b1 = [int(rng, 1, 4), int(rng, -3, 3), int(rng, 1, 4)], b2 = [int(rng, -3, 3), int(rng, 1, 4), int(rng, 1, 4)];
    const cr = vc(b1, b2), num = Math.abs(vd(cr, vs(a2, a1))), den = vn(cr);
    if (den < 1e-9 || num < 1e-9) throw RETRY;
    const lin = (a, b) => `\\dfrac{x${a[0] < 0 ? '+' + -a[0] : a[0] === 0 ? '' : '-' + a[0]}}{${b[0]}}=\\dfrac{y${a[1] < 0 ? '+' + -a[1] : a[1] === 0 ? '' : '-' + a[1]}}{${b[1]}}=\\dfrac{z${a[2] < 0 ? '+' + -a[2] : a[2] === 0 ? '' : '-' + a[2]}}{${b[2]}}`;
    return { a1, a2, b1, b2, answer: r2(num / den), tol: 0.01, q: R`Find the shortest distance between the lines $${lin(a1, b1)}$ and $${lin(a2, b2)}$. (2 decimal places)`, sol: R`<p>$\vec b_1\times\vec b_2=(${cr.join(',')})$, length $${r4(den)}$. $\vec a_2-\vec a_1=(${vs(a2, a1).join(',')})$; dot product $=${vd(cr, vs(a2, a1))}$.</p><p>$d=\dfrac{${num}}{${r4(den)}}=${r2(num / den)}$.</p>` };
  }, (p) => { // minimise |P(l) - Q(m)| using normal equations
    const w = vs(p.a2, p.a1), A = vd(p.b1, p.b1), B = -vd(p.b1, p.b2), C = vd(p.b2, p.b2), d1 = vd(w, p.b1), d2 = -vd(w, p.b2), D = A * C - B * B, l = (d1 * C - B * d2) / D, m = (A * d2 - B * d1) / D; const P = va(p.a1, vk(l, p.b1)), Q = va(p.a2, vk(m, p.b2)); return vn(vs(P, Q)); }),
  gen('td-gx4', 4, 'nat', 'integer', 'image of a point in a plane', (rng) => {
    const n = choose(rng, [[2, -1, 2], [1, 2, 2], [2, 3, 6], [2, -2, 1], [3, -6, 2]]), P = [int(rng, -4, 4), int(rng, -4, 4), int(rng, -4, 4)], k = choose(rng, [-2, -1, 1, 2]), nn = vd(n, n);
    const D = vd(n, P) - nn * k, I_ = vs(P, vk(2 * k, n));
    return { n, P, D, k, answer: I_[0] + I_[1] + I_[2], tol: 0, q: R`Find the sum of the coordinates of the image of $(${P.join(',')})$ in the plane $${plL(n)}=${D}$.`, sol: R`<p>Value of $${plL(n)}-(${D})$ at the point: $${nn * k}$. $|\vec n|^2=${nn}$.</p><p>Image $=P-2\cdot\dfrac{${nn * k}}{${nn}}\vec n=(${P.join(',')})-${2 * k}(${n.join(',')})=(${I_.join(',')})$. Sum $=${I_[0] + I_[1] + I_[2]}$.</p>` };
  }, (p) => { // image I: midpoint on the plane, PI parallel to n
    const t = -2 * (vd(p.n, p.P) - p.D) / vd(p.n, p.n), I_ = va(p.P, vk(t, p.n)); const mid = vk(0.5, va(p.P, I_)); if (Math.abs(vd(p.n, mid) - p.D) > 1e-9) return NaN; return Math.round(I_[0] + I_[1] + I_[2]); }),
  gen('td-gx5', 4, 'nat', 'integer', 'coplanar lines', (rng) => {
    const b1 = [int(rng, 1, 3), int(rng, 1, 3), int(rng, 1, 3)], k0 = int(rng, -3, 4), p_ = int(rng, 1, 3), r_ = int(rng, 1, 3), b2 = [p_, k0, r_], al = choose(rng, [1, 2, -1]), be = choose(rng, [1, 2, -1]);
    const a1 = [int(rng, 0, 3), int(rng, 0, 3), int(rng, 0, 3)], a2 = va(a1, va(vk(al, b1), vk(be, b2)));
    const dk = (k) => det3(vs(a2, a1), b1, [p_, k, r_]);
    if (dk(k0) !== 0 || dk(k0 + 1) === 0) throw RETRY;
    const lin = (a, b) => `\\dfrac{x${a[0] === 0 ? '' : '-' + a[0]}}{${b[0]}}=\\dfrac{y${a[1] === 0 ? '' : '-' + a[1]}}{${b[1]}}=\\dfrac{z${a[2] === 0 ? '' : '-' + a[2]}}{${b[2]}}`;
    const lin2 = (a) => `\\dfrac{x${a[0] < 0 ? '+' + -a[0] : a[0] === 0 ? '' : '-' + a[0]}}{${p_}}=\\dfrac{y${a[1] < 0 ? '+' + -a[1] : a[1] === 0 ? '' : '-' + a[1]}}{k}=\\dfrac{z${a[2] < 0 ? '+' + -a[2] : a[2] === 0 ? '' : '-' + a[2]}}{${r_}}`;
    return { a1, a2, b1, p_, r_, k0, answer: k0, tol: 0, q: R`The lines $${lin(a1, b1)}$ and $${lin2(a2)}$ are coplanar. Find $k$.`, sol: R`<p>Coplanar if $\begin{vmatrix}${vs(a2, a1).join('&')}\\${b1.join('&')}\\${p_}&k&${r_}\end{vmatrix}=0$. This determinant is linear in $k$ and vanishes at $k=${k0}$.</p>` };
  }, (p) => { for (let k = -20; k <= 20; k++) if (det3(vs(p.a2, p.a1), p.b1, [p.p_, k, p.r_]) === 0) return k; }),
  gen('td-gx6', 4, 'nat', 'numeric', 'line and plane', (rng) => {
    const b = [int(rng, -4, 4), int(rng, -4, 4), int(rng, 1, 4)], n = [int(rng, 1, 4), int(rng, -4, 4), int(rng, -4, 4)];
    if (vn(b) < 1e-9 || Math.abs(vd(b, n)) < 1e-9 || vn(vc(b, n)) < 1e-9) throw RETRY;
    const ang = dg(asin(Math.abs(vd(b, n)) / (vn(b) * vn(n))));
    return { b, n, answer: r2(ang), tol: 0.01, q: R`Find the angle (in degrees) between the line with direction ratios $(${b.join(',')})$ and the plane $${plL(n)}=1$. (2 decimal places)`, sol: R`<p>$\sin\varphi=\dfrac{|\vec b\cdot\vec n|}{|\vec b||\vec n|}=\dfrac{|${vd(b, n)}|}{${r4(vn(b))}\times${r4(vn(n))}}=${r4(Math.abs(vd(b, n)) / (vn(b) * vn(n)))}$, so $\varphi=${r2(ang)}^\circ$.</p>` };
  }, (p) => { const pr = vs(p.b, vk(vd(p.b, p.n) / vd(p.n, p.n), p.n)); return dg(acos(vd(p.b, pr) / (vn(p.b) * vn(pr)))); }),
  gen('td-gx7', 3, 'nat', 'integer', 'intercepts', (rng) => {
    let a, b, c; do { a = int(rng, 2, 9); b = int(rng, 2, 9); c = int(rng, 2, 9); } while ((a * b * c) % 6 !== 0);
    return { a, b, c, answer: (a * b * c) / 6, tol: 0, q: R`A plane meets the axes at $A(${a},0,0)$, $B(0,${b},0)$ and $C(0,0,${c})$. Find the volume of the tetrahedron $OABC$.`, sol: R`<p>Volume $=\dfrac16abc=\dfrac{${a}\cdot${b}\cdot${c}}6=${(a * b * c) / 6}$.</p>` };
  }, (p) => Math.abs(det3([p.a, 0, 0], [0, p.b, 0], [0, 0, p.c])) / 6),
  gen('td-gx8', 5, 'nat', 'numeric', 'projection of an area', (rng) => {
    const A_ = [int(rng, -3, 3), int(rng, -3, 3), int(rng, -3, 3)], B_ = [int(rng, -3, 3), int(rng, -3, 3), int(rng, -3, 3)], C_ = [int(rng, -3, 3), int(rng, -3, 3), int(rng, -3, 3)], n = choose(rng, [[1, 1, 1], [1, 2, 2], [2, 3, 6], [0, 0, 1], [1, 1, 0]]);
    const cr = vc(vs(B_, A_), vs(C_, A_)); if (vn(cr) < 1e-9) throw RETRY;
    const ans = (vn(cr) / 2) * (Math.abs(vd(cr, n)) / (vn(cr) * vn(n)));
    return { A_, B_, C_, n, answer: r2(ans), tol: 0.01, q: R`Find the area of the projection of the triangle with vertices $(${A_.join(',')})$, $(${B_.join(',')})$, $(${C_.join(',')})$ on the plane $${plL(n)}=0$. (2 decimal places)`, sol: R`<p>$\overrightarrow{AB}\times\overrightarrow{AC}=(${cr.join(',')})$, so the triangle has area $\dfrac{${r4(vn(cr))}}2=${r4(vn(cr) / 2)}$.</p><p>The projected area is this times $|\cos\theta|$, where $\theta$ is the angle between the normals: $\cos\theta=\dfrac{|${vd(cr, n)}|}{${r4(vn(cr))}\times${r4(vn(n))}}$. Result $=${r2(ans)}$.</p>` };
  }, (p) => { const nu = vk(1 / vn(p.n), p.n), pr = (P) => vs(P, vk(vd(P, nu), nu)); const A = pr(p.A_), B = pr(p.B_), C = pr(p.C_); return vn(vc(vs(B, A), vs(C, A))) / 2; }),
  gen('td-gx9', 4, 'mcq', 'single', 'line and plane', (rng) => {
    const kind = int(rng, 0, 3), n = [int(rng, 1, 4), int(rng, -3, 3), int(rng, 1, 4)];
    const P0 = [int(rng, -3, 3), int(rng, -3, 3), int(rng, -3, 3)], D = vd(n, P0) + (kind === 2 ? 0 : kind === 1 ? int(rng, 1, 4) : int(rng, -2, 2));
    let b;
    if (kind === 0) b = vk(choose(rng, [1, 2, -1]), n);
    else if (kind === 3) { b = [int(rng, 1, 3), int(rng, -3, 3), int(rng, 1, 3)]; if (vd(b, n) === 0 || vn(vc(b, n)) < 1e-9) b = [n[0] + 1, n[1], n[2]]; }
    else { // b perpendicular to n
      b = vc(n, [0, 0, 1]); if (vn(b) < 1e-9) b = vc(n, [1, 0, 0]); }
    const A_ = P0;
    const val = vd(n, A_) - D, par = vd(b, n) === 0, perp = vn(vc(b, n)) < 1e-9;
    const kindTxt = perp ? 'The line is perpendicular to the plane' : par ? (val === 0 ? 'The line lies in the plane' : 'The line is parallel to the plane and does not meet it') : 'The line meets the plane at exactly one point (not at right angles)';
    const o = shuffleOpts(rng, kindTxt, ['The line is perpendicular to the plane', 'The line lies in the plane', 'The line is parallel to the plane and does not meet it', 'The line meets the plane at exactly one point (not at right angles)'].filter((x) => x !== kindTxt));
    const lin = `\\dfrac{x${A_[0] < 0 ? '+' + -A_[0] : A_[0] === 0 ? '' : '-' + A_[0]}}{${b[0]}}=\\dfrac{y${A_[1] < 0 ? '+' + -A_[1] : A_[1] === 0 ? '' : '-' + A_[1]}}{${b[1]}}=\\dfrac{z${A_[2] < 0 ? '+' + -A_[2] : A_[2] === 0 ? '' : '-' + A_[2]}}{${b[2]}}`;
    return { n, b, A_, D, options: o.options, answer: o.answer, q: R`The line $${lin}$ and the plane $${plL(n)}=${D}$: which is true?`, sol: R`<p>Direction $\vec b=(${b.join(',')})$, normal $\vec n=(${n.join(',')})$, $\vec b\cdot\vec n=${vd(b, n)}$. ${perp ? 'The vectors are parallel, so the line is perpendicular to the plane.' : par ? `The dot product is $0$, so the line is parallel to the plane. The point $(${A_.join(',')})$ gives $${vd(n, A_)}$ against $${D}$: ${val === 0 ? 'it is on the plane, so the line lies in it.' : 'it is not on the plane, so the line does not meet it.'}` : 'The dot product is non-zero and the vectors are not parallel, so the line cuts the plane at one point.'}</p>` };
  }, (p) => { const v = vd(p.n, p.A_) - p.D; let kind; if (vn(vc(p.b, p.n)) < 1e-9) kind = 'The line is perpendicular to the plane'; else if (Math.abs(vd(p.b, p.n)) < 1e-12) kind = Math.abs(v) < 1e-12 ? 'The line lies in the plane' : 'The line is parallel to the plane and does not meet it'; else kind = 'The line meets the plane at exactly one point (not at right angles)'; return p.options.indexOf(kind); }),
];
const rtry = (make) => (rng) => { for (let i = 0; i < 200; i++) { try { return make(rng); } catch (e) { if (e !== RETRY) throw e; } } throw new Error('too many retries'); };
xgens.forEach((g_) => { g_.make = rtry(g_.make); });
gens.push(...xgens);

}

// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({ topic: 'three-d-geometry', groups, items, gens }, ['td-g04', 'td-g06', 'td-g08', 'td-g09', 'td-g10', 'td-g14', 'td-g16', 'td-gx1', 'td-gx4', 'td-g11']);
