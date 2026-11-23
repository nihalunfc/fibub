// Continuity and differentiability (Plus Two entrance, Mathematics, Class 12). Original fibub questions.
// Every fixed limit/derivative item below is checked numerically when the file loads (the helper throws on a mismatch),
// and every template has a verify() that recomputes its answer numerically from the fields it returns.
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';
import { tidyGens } from '../_util.js';

const R = String.raw;
const CUET = true;
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
const gx = (level, type) => [...EXS[level], ...(CUET && type === 'mcq' && level <= 3 ? ['cuet'] : [])];
const base = (level, sub, extra) => ({ level, exams: gx(level, extra.type), sub, ...extra });
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

const sqrt = Math.sqrt, sin = Math.sin, cos = Math.cos, tan = Math.tan, exp = Math.exp, ln = Math.log, atan = Math.atan, asin = Math.asin, acos = Math.acos, abs = Math.abs, fl = Math.floor, PI_ = Math.PI, E_ = Math.E;
const r4 = (x) => +x.toFixed(4);
const TWOD = ' (2 decimal places)';
const sgn = (v) => (v < 0 ? `-${-v}` : `+${v}`);
const W = (s) => `$${s}$`;
/** coefficient text: 1 -> '', -1 -> '-' */
const co = (c) => (c === 1 ? '' : c === -1 ? '-' : String(c));
/** a polynomial a x^2 + b x + c as TeX */
const quad = (a, b, c) => `${co(a)}x^2${b === 0 ? '' : b < 0 ? `-${b === -1 ? '' : -b}x` : `+${b === 1 ? '' : b}x`}${c === 0 ? '' : c < 0 ? `-${-c}` : `+${c}`}`;
const lin = (m, c) => `${co(m)}x${c === 0 ? '' : c < 0 ? `-${-c}` : `+${c}`}`;
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/** fraction as TeX */
const frac = (p, q) => { const d = gcd(p, q); p /= d; q /= d; if (q < 0) { p = -p; q = -q; } return q === 1 ? `${p}` : p < 0 ? `-\\dfrac{${-p}}{${q}}` : `\\dfrac{${p}}{${q}}`; };

// ---------- numeric checking ----------
const H = 2e-3;
const R1 = (f, a, s) => 2 * f(a + (s * H) / 2) - f(a + s * H);
const limv = (f, a, side = 0) => {
  if (a === Infinity) return f(1e5);
  if (a === -Infinity) return f(-1e5);
  if (side) return R1(f, a, side);
  const l = R1(f, a, -1), r = R1(f, a, 1);
  return Math.abs(l - r) <= 5e-3 * Math.max(1, Math.abs(l)) ? (l + r) / 2 : NaN;
};
/** throws if limit of f at a (side -1, 0, +1) is not val ('dne', Infinity, -Infinity or a number) */
const chk = (q, f, a, val, side = 0) => {
  let ok;
  if (val === 'dne') { const v = limv(f, a, side); ok = Number.isNaN(v) || !Number.isFinite(v); }
  else if (val === Infinity || val === -Infinity) { const x = a === Infinity ? 1e5 : a === -Infinity ? -1e5 : a + (side || 1) * 1e-4; ok = val * f(x) > 1e3; }
  else { const v = limv(f, a, side); ok = Math.abs(v - val) <= (val === 0 && (a === Infinity || a === -Infinity) ? 0.05 : 4e-3 * Math.max(1, Math.abs(val))); if (!ok) throw new Error(`limit check failed: ${q.slice(0, 90)} got ${v}, wanted ${val}`); }
  if (!ok) throw new Error(`limit check failed: ${q.slice(0, 90)} (${val})`);
};
const LQ = (a, e, pre = 'Evaluate') => R`${pre} $\displaystyle\lim_{x\to ${a}}${e}$.`;
const LM = (level, sub, q, f, a, val, correct, wrongs, sol, trap, side = 0, more = {}) => {
  chk(q, f, a, val, side);
  return M(level, sub, q, W(correct), wrongs.map(W), sol, trap, more);
};
/** options given as plain text / HTML */
const LT = (level, sub, q, f, a, val, correct, wrongs, sol, trap, side = 0, more = {}) => {
  chk(q, f, a, val, side);
  return M(level, sub, q, correct, wrongs, sol, trap, more);
};
const LI = (level, sub, q, f, a, val, sol, trap, side = 0, more = {}) => { chk(q, f, a, val, side); return I(level, sub, q, val, sol, trap, more); };
const LN = (level, sub, q, f, a, val, sol, trap, side = 0, more = {}) => { chk(q, f, a, val, side); return N(level, sub, `${q}${TWOD}`, r4(val), 0.01, sol, trap, more); };
/** numeric limit used by template verify() */
const NL = (f, a, side = 0) => limv(f, a, side);
const gen = (id, level, type, format, sub, make, verify) => ({ id, type, format, level, exams: gx(level, type), sub, make, ...(verify ? { verify } : {}) });

// ---------- numeric derivative / continuity checks ----------
const D1 = (f, x, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);
const D2 = (f, x, h = 1e-3) => (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
const DL = (f, a, h = 1e-4) => (3 * f(a) - 4 * f(a - h) + f(a - 2 * h)) / (2 * h);
const DR = (f, a, h = 1e-4) => (-3 * f(a) + 4 * f(a + h) - f(a + 2 * h)) / (2 * h);
const tolOK = (v, e, t = 2e-3) => Math.abs(v - e) <= t * Math.max(1, Math.abs(e));
const need = (ok, msg) => { if (!ok) throw new Error(msg); };
const cD = (q, f, x, val) => need(tolOK(D1(f, x), val), `derivative check: ${q.slice(0, 80)} got ${D1(f, x)} want ${val}`);
const cD2 = (q, f, x, val) => need(tolOK(D2(f, x), val, 6e-3), `second derivative check: ${q.slice(0, 80)} got ${D2(f, x)} want ${val}`);
const cFD = (q, f, fd, pts) => pts.forEach((x) => need(tolOK(D1(f, x), fd(x)), `derivative-function check: ${q.slice(0, 80)} at ${x}: got ${D1(f, x)} want ${fd(x)}`));
const cCont = (q, f, a) => { const l = R1(f, a, -1), r = R1(f, a, 1), v = f(a); need(tolOK(l, v, 6e-3) && tolOK(r, v, 6e-3), `continuity check: ${q.slice(0, 80)} l=${l} r=${r} f(a)=${v}`); };
const cDiff = (q, f, a) => { cCont(q, f, a); need(tolOK(DL(f, a), DR(f, a), 5e-3), `differentiability check: ${q.slice(0, 80)} left ${DL(f, a)} right ${DR(f, a)}`); };
const cNoDiff = (q, f, a) => need(!tolOK(DL(f, a), DR(f, a), 5e-3) || !Number.isFinite(DL(f, a)) || Math.abs(DL(f, a)) > 100 || Math.abs(DR(f, a)) > 100, `non-differentiability check: ${q.slice(0, 80)} left ${DL(f, a)} right ${DR(f, a)}`);
/** number of jumps (|change| > thr over a step of 1e-4) of f in (lo, hi) */
const jumpCount = (f, lo, hi, thr = 0.5) => { let c = 0, prev = f(lo + 1e-6), flag = false; for (let x = lo + 1e-6 + 1e-4; x < hi; x += 1e-4) { const v = f(x); const j = Math.abs(v - prev) > thr; if (j && !flag) c++; flag = j; prev = v; } return c; };
/** number of kinks (jump in derivative bigger than thr) of f in (lo, hi), for piecewise smooth f */
const kinkCount = (f, lo, hi, thr = 0.5) => { let c = 0, flag = false, prev = D1(f, lo + 5e-4, 1e-6); for (let x = lo + 1.5e-3; x < hi; x += 1e-3) { const d = D1(f, x, 1e-6); const j = Math.abs(d - prev) > thr; if (j && !flag) c++; flag = j; prev = d; } return c; };

const KM = (level, sub, q, f, a, correct, wrongs, sol, trap, more = {}) => { cCont(q, f, a); return M(level, sub, q, W(correct), wrongs.map(W), sol, trap, more); };
const KT = (level, sub, q, f, a, correct, wrongs, sol, trap, more = {}) => { cCont(q, f, a); return M(level, sub, q, correct, wrongs, sol, trap, more); };
const KI = (level, sub, q, f, a, ans, sol, trap, more = {}) => { cCont(q, f, a); return I(level, sub, q, ans, sol, trap, more); };
const KC = (level, sub, q, f, pts, ans, sol, trap, more = {}) => { pts.forEach((a) => cCont(q, f, a)); return I(level, sub, q, ans, sol, trap, more); };
const DM = (level, sub, q, f, x, val, correct, wrongs, sol, trap, more = {}) => { cD(q, f, x, val); return M(level, sub, q, W(correct), wrongs.map(W), sol, trap, more); };
const DI = (level, sub, q, f, x, val, sol, trap, more = {}) => { cD(q, f, x, val); return I(level, sub, q, val, sol, trap, more); };
const DN = (level, sub, q, f, x, val, sol, trap, more = {}) => { cD(q, f, x, val); return N(level, sub, `${q}${TWOD}`, r4(val), 0.01, sol, trap, more); };
const EF = (level, sub, q, f, fd, pts, correct, wrongs, sol, trap, more = {}) => { cFD(q, f, fd, pts); return M(level, sub, q, W(correct), wrongs.map(W), sol, trap, more); };
const SM = (level, sub, q, f, x, val, correct, wrongs, sol, trap, more = {}) => { cD2(q, f, x, val); return M(level, sub, q, W(correct), wrongs.map(W), sol, trap, more); };
const SI = (level, sub, q, f, x, val, sol, trap, more = {}) => { cD2(q, f, x, val); return I(level, sub, q, val, sol, trap, more); };
/** an item whose answer is derived by reasoning only (counts etc.) but checked by a custom assertion thunk */
const CK = (thunk, item) => { thunk(); return item; };
const DNE = 'does not exist';
const inf = R`\infty`;
const e = R`e`;
const dfrac = (a, b) => frac(a, b);

/** implicit slope -Fx/Fy */
const cIm = (q, F, x, y, val) => { const h = 1e-6; const Fx = (F(x + h, y) - F(x - h, y)) / (2 * h), Fy = (F(x, y + h) - F(x, y - h)) / (2 * h); need(Math.abs(F(x, y)) < 1e-9 && tolOK(-Fx / Fy, val), `implicit check: ${q.slice(0, 80)} got ${-Fx / Fy} want ${val}`); };
/** parametric dy/dx and d2y/dx2 */
const pD = (xf, yf, t) => D1(yf, t) / D1(xf, t);
const pD2 = (xf, yf, t) => (D1((s) => pD(xf, yf, s), t, 1e-4)) / D1(xf, t);
const cPar = (q, xf, yf, t, val) => need(tolOK(pD(xf, yf, t), val), `parametric check: ${q.slice(0, 80)} got ${pD(xf, yf, t)} want ${val}`);
const cPar2 = (q, xf, yf, t, val) => need(tolOK(pD2(xf, yf, t), val, 6e-3), `parametric second check: ${q.slice(0, 80)} got ${pD2(xf, yf, t)} want ${val}`);

const items = [
  // ================= continuity (L1-L2) =================
  KM(1, 'continuity at a point', R`The function $f(x)=\dfrac{x^2-4}{x-2}$ for $x\ne2$ and $f(2)=k$ is continuous at $x=2$ when $k$ equals`, (x) => (x === 2 ? 4 : (x * x - 4) / (x - 2)), 2, '4', ['2', '0', '8'],
    R`<p>Continuity needs $\lim_{x\to2}f(x)=f(2)$. For $x\ne2$, $f(x)=x+2$, so the limit is $4$. So $k=4$.</p>`, 'Cancel the factor first.'),
  KI(1, 'continuity at a point', R`$f(x)=\dfrac{\sin3x}{x}$ for $x\ne0$, and $f(0)=k$. For what $k$ is $f$ continuous at $0$?`, (x) => (x === 0 ? 3 : sin(3 * x) / x), 0, 3,
    R`<p>$\lim_{x\to0}\dfrac{\sin3x}x=3$. Set $k=3$.</p>`, 'The limit is 3, not 1.'),
  KT(1, 'continuity at a point', R`Let $f(x)=\begin{cases}x^2,&x\le1\\2x-1,&x>1\end{cases}$. At $x=1$, the function $f$ is`, (x) => (x <= 1 ? x * x : 2 * x - 1), 1, 'continuous', ['discontinuous because the left limit is not equal to the right limit', 'discontinuous because $f(1)$ is not defined', 'discontinuous because the right limit is infinite'],
    R`<p>Left limit $=1^2=1$. Right limit $=2\cdot1-1=1$. $f(1)=1$. All three agree: continuous.</p>`, 'Check all three: left, right and the value.'),
  KI(1, 'continuity at a point', R`$f(x)=\begin{cases}2x+3,&x<1\\k,&x=1\\7x-2,&x>1\end{cases}$ is continuous at $x=1$. Find $k$.`, (x) => (x < 1 ? 2 * x + 3 : x === 1 ? 5 : 7 * x - 2), 1, 5,
    R`<p>Left limit $=2+3=5$. Right limit $=7-2=5$. So $k=5$.</p>`, ''),
  KI(1, 'continuity at a point', R`$f(x)=\dfrac{x^2-9}{x-3}$ ($x\ne3$) and $f(3)=k$. Find $k$ so that $f$ is continuous at $3$.`, (x) => (x === 3 ? 6 : (x * x - 9) / (x - 3)), 3, 6,
    R`<p>$\dfrac{x^2-9}{x-3}=x+3\to6$, so $k=6$.</p>`, ''),
  M(1, 'continuity everywhere', R`Which of the following functions is continuous at every real number?`, R`$|x|$`, [R`$\dfrac1x$`, R`$[x]$`, R`$\tan x$`],
    R`<p>$|x|$ is continuous everywhere (though not differentiable at 0). $\frac1x$ fails at 0, $[x]$ jumps at every integer, $\tan x$ fails at odd multiples of $\frac\pi2$.</p>`, 'Continuous does not mean smooth.'),
  M(1, 'definition', R`A function $f$ is continuous at $x=a$ if and only if`, R`$\displaystyle\lim_{x\to a}f(x)$ exists and equals $f(a)$`, [R`$f(a)$ exists`, R`$\displaystyle\lim_{x\to a}f(x)$ exists`, R`$f'(a)$ exists`],
    R`<p>Three things are needed: $f(a)$ is defined, the limit exists, and they are equal. Having only one of these is not enough, and $f'(a)$ existing is a stronger condition.</p>`, 'Existence of the limit alone is not enough.'),
  KI(2, 'continuity at a point', R`$f(x)=\dfrac{1-\cos4x}{x^2}$ for $x\ne0$, and $f(0)=k$. For $f$ to be continuous at $0$, $k=$`, (x) => (x === 0 ? 8 : (1 - cos(4 * x)) / (x * x)), 0, 8,
    R`<p>$\lim\dfrac{1-\cos4x}{x^2}=\dfrac{4^2}2=8$.</p>`, 'The coefficient is squared and halved.'),
  KM(2, 'continuity at a point', R`$f(x)=\dfrac{e^{2x}-1}{x}$ ($x\ne0$), $f(0)=k$. $f$ is continuous at $0$ if $k=$`, (x) => (x === 0 ? 2 : (exp(2 * x) - 1) / x), 0, '2', ['1', '0', e],
    R`<p>$\dfrac{e^{2x}-1}x=2\cdot\dfrac{e^{2x}-1}{2x}\to2$.</p>`, ''),
  KM(2, 'continuity at a point', R`$f(x)=\begin{cases}kx+1,&x\le\pi\\\cos x,&x>\pi\end{cases}$ is continuous at $x=\pi$. Then $k=$`, (x) => (x <= PI_ ? (-2 / PI_) * x + 1 : cos(x)), PI_, R`-\dfrac2\pi`, [R`\dfrac2\pi`, R`-\dfrac1\pi`, '0'],
    R`<p>Left value $k\pi+1$; right limit $\cos\pi=-1$. Set $k\pi+1=-1$, so $k=-\dfrac2\pi$.</p>`, 'Remember $\\cos\\pi=-1$.'),
  KM(2, 'continuity at a point', R`$f(x)=\begin{cases}kx^2,&x<2\\3,&x\ge2\end{cases}$ is continuous at $x=2$ for $k=$`, (x) => (x < 2 ? 0.75 * x * x : 3), 2, R`\dfrac34`, [R`\dfrac43`, '3', R`\dfrac32`],
    R`<p>Left limit $4k$; $f(2)=3$. $4k=3$, so $k=\frac34$.</p>`, ''),
  KM(2, 'continuity at a point', R`$f(x)=\dfrac{\sqrt{1+x}-1}x$ ($x\ne0$), $f(0)=k$. $f$ is continuous at $0$ when $k=$`, (x) => (x === 0 ? 0.5 : (sqrt(1 + x) - 1) / x), 0, R`\dfrac12`, ['1', '0', '2'],
    R`<p>Conjugate: $\dfrac1{\sqrt{1+x}+1}\to\dfrac12$.</p>`, ''),
  KI(2, 'continuity at a point', R`$f(x)=\dfrac{x^3-8}{x^2-4}$ for $x\ne\pm2$ and $f(2)=k$. $f$ is continuous at $2$ for $k=$`, (x) => (x === 2 ? 3 : (x ** 3 - 8) / (x * x - 4)), 2, 3,
    R`<p>$\dfrac{(x-2)(x^2+2x+4)}{(x-2)(x+2)}=\dfrac{x^2+2x+4}{x+2}\to\dfrac{12}4=3$.</p>`, ''),
  KI(2, 'finding constants', R`$f(x)=\begin{cases}ax+1,&x\le3\\3x-5,&x>3\end{cases}$ is continuous at $3$. Find $a$.`, (x) => (x <= 3 ? x + 1 : 3 * x - 5), 3, 1,
    R`<p>Left: $3a+1$. Right: $9-5=4$. $3a+1=4$, so $a=1$.</p>`, ''),
  KM(2, 'continuity at a point', R`$f(x)=\dfrac{\tan2x}{x}$ ($x\ne0$) is made continuous at $0$ by defining $f(0)=$`, (x) => (x === 0 ? 2 : tan(2 * x) / x), 0, '2', ['1', '0', R`\dfrac12`],
    R`<p>$\dfrac{\tan2x}{2x}\cdot2\to2$.</p>`, ''),
  KC(3, 'finding constants', R`$f(x)=\begin{cases}5,&x\le2\\ax+b,&2<x<4\\11,&x\ge4\end{cases}$ is continuous everywhere. Find $a+b$.`, (x) => (x <= 2 ? 5 : x < 4 ? 3 * x - 1 : 11), [2, 4], 2,
    R`<p>At $x=2$: $2a+b=5$. At $x=4$: $4a+b=11$. Subtract: $2a=6$, $a=3$, $b=-1$. $a+b=2$.</p>`, 'Two junctions give two equations.'),
  KM(2, 'continuity at a point', R`$f(x)=\dfrac{1-\cos x}{x^2}$ ($x\ne0$) is continuous at $0$ if $f(0)=$`, (x) => (x === 0 ? 0.5 : (1 - cos(x)) / (x * x)), 0, R`\dfrac12`, ['1', '0', '2'],
    R`<p>$\lim\dfrac{1-\cos x}{x^2}=\dfrac12$.</p>`, ''),
  KM(3, 'continuity at a point', R`$f(x)=\dfrac{e^{3x}-1}{\ln(1+2x)}$ ($x\ne0$) is continuous at $0$ if $f(0)=$`, (x) => (x === 0 ? 1.5 : (exp(3 * x) - 1) / ln(1 + 2 * x)), 0, R`\dfrac32`, [R`\dfrac23`, '6', '1'],
    R`<p>Top $\approx3x$, bottom $\approx2x$. The limit is $\frac32$.</p>`, 'Top coefficient over bottom coefficient.'),
  KT(3, 'continuity at a point', R`$f(x)=x\sin\dfrac1x$ ($x\ne0$) and $f(0)=k$. $f$ is continuous at $0$ for $k=$`, (x) => (x === 0 ? 0 : x * sin(1 / x)), 0, '$0$', ['$1$', '$-1$', 'no value of $k$'],
    R`<p>$|x\sin\frac1x|\le|x|\to0$. So $k=0$.</p>`, 'The function oscillates but is squeezed.'),
  KI(3, 'continuity at a point', R`$f(x)=(1+kx)^{1/x}$ ($x\ne0$) and $f(0)=e^3$. For $f$ to be continuous at $0$, find $k$.`, (x) => (x === 0 ? E_ ** 3 : (1 + 3 * x) ** (1 / x)), 0, 3,
    R`<p>$\lim(1+kx)^{1/x}=e^k$. Set $e^k=e^3$, so $k=3$.</p>`, ''),
  KI(3, 'continuity at a point', R`$f(x)=\dfrac{1-\cos kx}{x^2}$ ($x\ne0$) and $f(0)=8$. If $f$ is continuous at $0$ and $k>0$, find $k$.`, (x) => (x === 0 ? 8 : (1 - cos(4 * x)) / (x * x)), 0, 4,
    R`<p>The limit is $\dfrac{k^2}2=8$, so $k^2=16$ and $k=4$.</p>`, 'Take the positive root.'),
  M(3, 'continuity at a point', R`$f(x)=\begin{cases}\dfrac{\sin x}{x},&x<0\\k,&x=0\\\dfrac{\sqrt{1+x}-1}{x},&x>0\end{cases}$. Which value of $k$ makes $f$ continuous at $0$?`, 'No value of $k$ works', ['$k=1$', '$k=\\frac12$', '$k=0$'],
    R`<p>Left limit $=1$. Right limit $=\dfrac1{\sqrt{1+x}+1}\to\dfrac12$. They differ, so no $k$ can make $f$ continuous.</p>`, 'First compare the two one-sided limits.'),
];

items.push(
  // ================= types of discontinuity =================
  M(2, 'types of discontinuity', R`$f(x)=\dfrac{x^2-1}{x-1}$ for $x\ne1$ has, at $x=1$,`, 'a removable discontinuity', ['a jump discontinuity', 'an infinite discontinuity', 'no discontinuity because $f(1)$ is defined'],
    R`<p>$f(x)=x+1$ for $x\ne1$, so the limit is $2$ but $f(1)$ is not defined. Defining $f(1)=2$ would remove the break. So the discontinuity is removable.</p>`, 'The function is not even defined at 1, so it cannot be continuous there.'),
  M(2, 'types of discontinuity', R`The function $f(x)=\dfrac1{x-2}$ at $x=2$ has`, 'an infinite (non-removable) discontinuity', ['a removable discontinuity', 'a jump discontinuity with finite jump', 'a continuity'],
    R`<p>$f(x)\to\pm\infty$ as $x\to2$ from either side. The limit does not exist as a finite number, so no value of $f(2)$ can repair it.</p>`, ''),
  M(2, 'types of discontinuity', R`At each integer $n$, the function $f(x)=[x]$ has`, 'a jump discontinuity of size 1', ['a removable discontinuity', 'an infinite discontinuity', 'no discontinuity'],
    R`<p>Left limit $n-1$, right limit $n$. They are finite but different, a jump of $1$.</p>`, ''),
  M(3, 'types of discontinuity', R`The function $f(x)=\sin\dfrac1x$ ($x\ne0$) at $x=0$ has`, 'an oscillating (essential) discontinuity', ['a removable discontinuity', 'a jump discontinuity', 'an infinite discontinuity'],
    R`<p>Near $0$ the function swings between $-1$ and $1$ infinitely often. Neither one-sided limit exists (not even as $\pm\infty$), so it is an essential discontinuity.</p>`, 'The values stay bounded, but no limit exists.'),
  M(3, 'types of discontinuity', R`Let $f(x)=x\sin\dfrac1x$ for $x\ne0$ and $f(0)=1$. At $x=0$, $f$ has`, 'a removable discontinuity', ['an infinite discontinuity', 'a jump discontinuity', 'no discontinuity'],
    R`<p>$\lim_{x\to0}f(x)=0\ne1=f(0)$. The limit exists, so redefining $f(0)=0$ would fix it: removable.</p>`, 'The limit exists, the value is wrong.'),
  M(3, 'types of discontinuity', R`$f(x)=\dfrac{|x|}x$ ($x\ne0$) has, at $x=0$,`, 'a jump discontinuity (cannot be removed)', ['a removable discontinuity', 'an infinite discontinuity', 'no discontinuity'],
    R`<p>Left limit $-1$, right limit $+1$. Both are finite and different: a jump, so no choice of $f(0)$ can repair it.</p>`, ''),
  M(3, 'types of discontinuity', R`$f(x)=\tan x$ at $x=\dfrac\pi2$ has`, 'an infinite discontinuity', ['a removable discontinuity', 'a jump discontinuity of finite size', 'no discontinuity'],
    R`<p>$\tan x\to+\infty$ from the left and $-\infty$ from the right.</p>`, 'Opposite infinities on the two sides.'),
  M(4, 'types of discontinuity', R`$f(x)=e^{1/x}$ ($x\ne0$) at $x=0$:`, 'right limit is infinite and left limit is $0$, so the discontinuity cannot be removed', ['both one-sided limits are $0$, so it is removable', 'both one-sided limits are $+\\infty$', 'the function is continuous at 0'],
    R`<p>As $x\to0^+$, $\frac1x\to+\infty$ so $e^{1/x}\to+\infty$. As $x\to0^-$, $\frac1x\to-\infty$ so $e^{1/x}\to0$. One side is infinite, so it is a non-removable discontinuity.</p>`, 'Do not use the same limit on both sides.'),

  // ================= greatest integer, fractional part, modulus =================
  CK(() => need(jumpCount((x) => fl(x), 0, 5) === 4, 'jump count [x]'), M(2, 'greatest integer', R`The number of points in the open interval $(0,5)$ at which $f(x)=[x]$ is discontinuous is`, '4', ['5', '6', '0'],
    R`<p>$[x]$ is discontinuous at every integer. The integers strictly between $0$ and $5$ are $1,2,3,4$. Four points. (The end points are not in an open interval.)</p>`, '$0$ and $5$ are not inside $(0,5)$.')),
  M(2, 'greatest integer', R`The function $f(x)=[x]+\{x\}$ (where $\{x\}=x-[x]$) is`, 'continuous for all real $x$', ['discontinuous at every integer', 'discontinuous only at $0$', 'discontinuous at every real number'],
    R`<p>$[x]+\{x\}=x$ for all $x$. The jump of $[x]$ at an integer is cancelled by the opposite jump of $\{x\}$.</p>`, 'The two jumps cancel.'),
  CK(() => need(jumpCount((x) => x * fl(x), -2, 3) === 3, 'jump count x[x]'), M(3, 'greatest integer', R`The number of points in $(-2,3)$ where $f(x)=x[x]$ is discontinuous is`, '3', ['4', '5', '2'],
    R`<p>At an integer $n$: left limit $n(n-1)$, right limit $n^2$, value $n^2$. They differ unless $n=0$. Integers in $(-2,3)$: $-1,0,1,2$. At $n=0$ both sides give $0$. So the discontinuities are at $-1,1,2$: three points.</p>`, 'At $x=0$ the factor $x$ kills the jump.')),
  M(3, 'greatest integer', R`Let $f(x)=[x]+[-x]$. The number of points of discontinuity of $f$ in $(0,4)$ is`, '3', ['0', '4', '1'],
    R`<p>For non-integer $x$: $[x]+[-x]=-1$. For integer $x$: $x+(-x)=0$. So $f=-1$ everywhere except $0$ at the integers. The limit at each integer is $-1\ne0=f(\text{integer})$: removable discontinuities at $1,2,3$. Three points.</p>`, 'Each discontinuity is removable, but it still counts.'),
  CK(() => need(jumpCount((x) => fl(x * x), 0, 3) === 8, 'jump count [x^2]'), M(4, 'greatest integer', R`The number of points of discontinuity of $f(x)=[x^2]$ in the open interval $(0,3)$ is`, '8', ['9', '3', '6'],
    R`<p>$[x^2]$ jumps when $x^2$ crosses an integer. $x^2$ takes values from $0$ to $9$ on $(0,3)$; it crosses the integers $1,2,\dots,8$ (and $9$ only at $x=3$, excluded). That is $8$ points: $x=1,\sqrt2,\sqrt3,2,\sqrt5,\sqrt6,\sqrt7,2\sqrt2$.</p>`, 'The end value $9$ is reached only at $x=3$, which is outside the interval.')),
  CK(() => need(jumpCount((x) => fl(2 * x), 0, 2) === 3, 'jump count [2x]'), M(3, 'greatest integer', R`$f(x)=[2x]$ is discontinuous at how many points of $(0,2)$?`, '3', ['2', '4', '1'],
    R`<p>$[2x]$ jumps when $2x$ is an integer: $x=\frac12,1,\frac32$ (and $x=0,2$ are excluded). Three points.</p>`, 'Half-integers count too.')),
  M(3, 'greatest integer', R`The function $f(x)=\{x\}=x-[x]$ is continuous at`, 'every non-integer, and discontinuous at every integer', ['every real number', 'no real number', 'every integer only'],
    R`<p>At an integer $n$: left limit $1$, right limit $0$. At non-integers $[x]$ is constant locally, so $\{x\}=x-\text{const}$ is continuous.</p>`, ''),
  CK(() => need(jumpCount((x) => fl(x) + abs(x - 2), 0, 5) === 4, 'jump count [x]+|x-2|'), M(3, 'greatest integer', R`$f(x)=[x]+|x-2|$. The number of points in $(0,5)$ where $f$ is discontinuous is`, '4', ['3', '5', '1'],
    R`<p>$|x-2|$ is continuous everywhere, so only $[x]$ can cause trouble: it jumps at $1,2,3,4$. Four points.</p>`, ''),),
  M(3, 'modulus', R`If $f(x)=|x-1|+|x-2|$, then $f$ is continuous for`, 'all real $x$', ['all $x$ except $1$ and $2$', 'all $x$ except $1.5$', 'no real $x$'],
    R`<p>A sum of continuous functions is continuous. $|x-a|$ is continuous everywhere (it is only not differentiable at $a$).</p>`, 'Corners are not breaks.'),
  CK(() => { const g = (x) => (x ** 200 - 1) / (x ** 200 + 1); need(Math.abs(g(0.5) + 1) < 1e-6 && Math.abs(g(1.5) - 1) < 1e-6 && g(1) === 0, 'limit-defined f'); }, M(4, 'limit-defined function', R`Let $f(x)=\displaystyle\lim_{n\to\infty}\dfrac{x^{2n}-1}{x^{2n}+1}$. The number of points at which $f$ is discontinuous is`, '2', ['0', '1', '3'],
    R`<p>For $|x|<1$: $x^{2n}\to0$, so $f=-1$. For $|x|>1$: $x^{2n}\to\infty$, so $f\to1$. At $x=\pm1$: $\frac{1-1}{1+1}=0$. So $f=-1$ on $(-1,1)$, $0$ at $\pm1$, $1$ outside. Discontinuous at $x=-1$ and $x=1$: two points.</p>`, 'Check the points $x=\\pm1$ separately.')),
  M(4, 'limit-defined function', R`Let $f(x)=\displaystyle\lim_{n\to\infty}\dfrac{x^n}{1+x^n}$ for $x\ge0$. At which point is $f$ discontinuous?`, '$x=1$', ['$x=0$', '$x=2$', 'nowhere'],
    R`<p>For $0\le x<1$: $x^n\to0$, so $f=0$. For $x=1$: $f=\frac12$. For $x>1$: $x^n\to\infty$, $f\to1$. The values $0,\frac12,1$ show a break at $x=1$ (a jump from $0$ to $1$).</p>`, ''),
  M(3, 'composite functions', R`If $f(x)=\dfrac1{x-3}$ and $g(x)=x+1$, the composite $f\circ g$ is discontinuous at`, '$x=2$', ['$x=3$', '$x=1$', '$x=-1$'],
    R`<p>$(f\circ g)(x)=f(x+1)=\dfrac1{x+1-3}=\dfrac1{x-2}$. Discontinuous at $x=2$.</p>`, 'Substitute $x+1$ into $f$, do not use the break point of $f$ directly.'),
  M(4, 'composite functions', R`Let $f(x)=\dfrac1{1-x}$. The function $f(f(x))$ is discontinuous at which of these points? (Consider the natural domain of $f(f(x))$ together with $f(x)=1$.)`, '$x=0$ and $x=1$', ['$x=1$ only', '$x=0$ only', '$x=0$, $1$ and $2$'],
    R`<p>$f(x)$ is not defined at $x=1$. $f(f(x))=\dfrac1{1-\frac1{1-x}}=\dfrac{1-x}{-x}=\dfrac{x-1}x$, not defined at $x=0$ (and $f(f(x))$ needs $f(x)$ defined, so $x\ne1$). So the breaks are at $x=0$ and $x=1$.</p>`, 'Include the break of the inner function.'),
  KM(3, 'continuity on an interval', R`The function $f(x)=\begin{cases}\dfrac{\sin x}{x},&x\ne0\\1,&x=0\end{cases}$ is continuous at $x=0$. This is because`, (x) => (x === 0 ? 1 : sin(x) / x), 0, R`\displaystyle\lim_{x\to0}\dfrac{\sin x}x=1=f(0)`, [R`\sin0=0`, R`f(0)=1\text{ only}`, R`\dfrac{\sin x}{x}\text{ is not defined at }0`],
    R`<p>The limit equals the value $f(0)=1$.</p>`, ''),
);

items.push(
  // ================= differentiability =================
  CK(() => cNoDiff('|x|', abs, 0), M(1, 'differentiability', R`The function $f(x)=|x|$ at $x=0$ is`, 'continuous but not differentiable', ['differentiable but not continuous', 'both continuous and differentiable', 'neither continuous nor differentiable'],
    R`<p>$|x|\to0=f(0)$ so $f$ is continuous. Left derivative $=-1$, right derivative $=+1$, so $f'(0)$ does not exist.</p>`, 'The graph has a sharp corner at the origin.')),
  DI(1, 'differentiability', R`If $f(x)=|x|$, find $f'(-3)$.`, abs, -3, -1,
    R`<p>For $x<0$, $f(x)=-x$, so $f'(x)=-1$.</p>`, 'Away from the corner, $|x|$ is just $\\pm x$.'),
  M(2, 'differentiability', R`If a function is differentiable at $x=a$, then it is`, 'continuous at $x=a$', ['discontinuous at $x=a$', 'continuous at $x=a$ and its derivative is continuous there', 'not necessarily continuous at $x=a$'],
    R`<p>Differentiable $\Rightarrow$ continuous. Write $f(x)-f(a)=\dfrac{f(x)-f(a)}{x-a}(x-a)\to f'(a)\cdot0=0$. The converse is false ($|x|$).</p>`, 'The converse is not true.'),
  CK(() => cDiff('x|x|', (x) => x * abs(x), 0), M(2, 'differentiability', R`For $f(x)=x|x|$, the derivative $f'(0)$`, 'exists and equals $0$', ['does not exist', 'exists and equals $1$', 'exists and equals $-1$'],
    R`<p>$\dfrac{f(h)-f(0)}h=\dfrac{h|h|}h=|h|\to0$ from both sides.</p>`, 'The function looks like $\\pm x^2$ near 0, which is smooth.')),
  CK(() => { cNoDiff('|x-2|', (x) => abs(x - 2), 2); }, M(2, 'differentiability', R`For $f(x)=|x-2|$, the left-hand derivative and the right-hand derivative at $x=2$ are`, '$-1$ and $+1$', ['$+1$ and $-1$', 'both $0$', 'both $1$'],
    R`<p>For $x<2$, $f(x)=2-x$ with slope $-1$. For $x>2$, $f(x)=x-2$ with slope $+1$. Left derivative $-1$, right derivative $+1$.</p>`, 'Left means $x<2$.')),
  DM(2, 'differentiability', R`Let $f(x)=x^2\sin\dfrac1x$ for $x\ne0$ and $f(0)=0$. Then $f'(0)$ equals`, (x) => (x === 0 ? 0 : x * x * sin(1 / x)), 0, 0, '0', ['1', 'does not exist', R`\dfrac12`],
    R`<p>$\dfrac{f(h)-f(0)}h=h\sin\dfrac1h$, which $\to0$ by squeeze. So $f'(0)=0$.</p>`, 'Use the definition at 0, not the formula for $x\\ne0$.'),
  M(3, 'differentiability', R`Let $f(x)=x^2\sin\dfrac1x$ ($x\ne0$), $f(0)=0$. Which statement is correct?`, '$f$ is differentiable at $0$, but $f\'$ is not continuous at $0$', ['$f$ is not differentiable at $0$', '$f\'$ is continuous at $0$', '$f$ is not continuous at $0$'],
    R`<p>$f'(0)=0$ (from the definition). For $x\ne0$, $f'(x)=2x\sin\frac1x-\cos\frac1x$. The term $\cos\frac1x$ has no limit as $x\to0$, so $f'$ has no limit at $0$: $f'$ is not continuous there.</p>`, 'Differentiable does not mean continuously differentiable.'),
  CK(() => cNoDiff('|x|cos x', (x) => abs(x) * cos(x), 0), M(3, 'differentiability', R`$f(x)=|x|\cos x$ at $x=0$ is`, 'not differentiable', ['differentiable with $f\'(0)=0$', 'differentiable with $f\'(0)=1$', 'not continuous'],
    R`<p>Right derivative: $\dfrac{h\cos h}h\to1$. Left derivative: $\dfrac{-h\cos h}h\to-1$. Not equal.</p>`, 'The factor $\\cos x$ equals 1 at 0, so the corner remains.')),
  CK(() => cDiff('|x|sin x', (x) => abs(x) * sin(x), 0), M(3, 'differentiability', R`$f(x)=|x|\sin x$ at $x=0$ is`, 'differentiable with $f\'(0)=0$', ['not differentiable', 'differentiable with $f\'(0)=1$', 'not continuous'],
    R`<p>$\dfrac{f(h)-f(0)}h=\dfrac{|h|\sin h}h=|h|\cdot\dfrac{\sin h}h\to0\cdot1=0$ from both sides.</p>`, 'The factor $\\sin x$ vanishes at 0 and removes the corner.')),
  CK(() => { cNoDiff('sqrt|x|', (x) => sqrt(abs(x)), 0); }, M(3, 'differentiability', R`$f(x)=\sqrt{|x|}$ at $x=0$ is`, 'continuous but not differentiable (vertical tangent-type cusp)', ['differentiable with $f\'(0)=0$', 'differentiable with $f\'(0)=1$', 'not continuous'],
    R`<p>$\dfrac{f(h)-f(0)}h=\dfrac{\sqrt{|h|}}h$ tends to $+\infty$ for $h\to0^+$ and $-\infty$ for $h\to0^-$. No derivative.</p>`, 'The slope becomes infinite.')),
  CK(() => { const f = (x) => Math.cbrt(x); cNoDiff('cbrt', f, 0); }, M(3, 'differentiability', R`$f(x)=x^{1/3}$ at $x=0$ is`, 'continuous but not differentiable', ['differentiable with $f\'(0)=0$', 'differentiable with $f\'(0)=\\frac13$', 'not continuous'],
    R`<p>$\dfrac{f(h)}h=h^{-2/3}\to+\infty$. The tangent is vertical, so the derivative does not exist.</p>`, 'The formula $\\frac13x^{-2/3}$ blows up at 0.')),
  CK(() => { cNoDiff('(x-1)^(2/3)', (x) => Math.cbrt((x - 1) ** 2), 1); }, M(4, 'differentiability', R`$f(x)=(x-1)^{2/3}$ at $x=1$ has`, 'a cusp: continuous but not differentiable', ['a smooth point with $f\'(1)=0$', 'a jump discontinuity', 'a removable discontinuity'],
    R`<p>$\dfrac{f(1+h)-f(1)}h=h^{-1/3}$, which $\to+\infty$ as $h\to0^+$ and $-\infty$ as $h\to0^-$.</p>`, 'A cusp is a more severe corner.')),
  CK(() => need(kinkCount((x) => abs(x * x - 1), -3, 3) === 2, 'kinks |x^2-1|'), I(3, 'counting points of non-differentiability', R`The number of points where $f(x)=|x^2-1|$ is not differentiable is`, 2,
    R`<p>The graph of $x^2-1$ crosses the axis at $x=\pm1$ with nonzero slope $\mp$, creating corners there. At every other point $|x^2-1|=\pm(x^2-1)$ is smooth. Two points.</p>`, 'Only sign changes with non-zero slope create corners.')),
  CK(() => need(kinkCount((x) => abs(x - 1) + abs(x - 2) + abs(x - 3), -5, 8) === 3, 'kinks 3 abs'), I(3, 'counting points of non-differentiability', R`$f(x)=|x-1|+|x-2|+|x-3|$ is not differentiable at how many points?`, 3,
    R`<p>Each term $|x-a|$ has a corner at $x=a$ and no other term repairs it. Three points: $1,2,3$.</p>`, '')),
  CK(() => need(kinkCount((x) => abs(sin(x)), 0, 2 * PI_) === 1, 'kinks |sin x|'), I(3, 'counting points of non-differentiability', R`The number of points in $(0,2\pi)$ where $f(x)=|\sin x|$ is not differentiable is`, 1,
    R`<p>$\sin x=0$ at $0,\pi,2\pi$. Only $\pi$ lies inside the open interval. At $\pi$, $\sin x$ changes sign with slope $-1$, so $|\sin x|$ has a corner. One point.</p>`, '$0$ and $2\\pi$ are outside the open interval.')),
  CK(() => need(kinkCount((x) => abs(cos(x)), 0, 2 * PI_) === 2, 'kinks |cos x|'), I(3, 'counting points of non-differentiability', R`The number of points in $(0,2\pi)$ where $f(x)=|\cos x|$ is not differentiable is`, 2,
    R`<p>$\cos x=0$ at $\frac\pi2$ and $\frac{3\pi}2$ inside the interval. Both are corners. Two points.</p>`, '')),
  CK(() => need(kinkCount((x) => Math.max(sin(x), cos(x)), 0, 2 * PI_) === 2, 'kinks max(sin,cos)'), I(4, 'counting points of non-differentiability', R`The number of points in $(0,2\pi)$ where $f(x)=\max(\sin x,\cos x)$ is not differentiable is`, 2,
    R`<p>The two graphs cross where $\sin x=\cos x$, i.e. $x=\frac\pi4$ and $x=\frac{5\pi}4$. At a crossing the slopes of the two curves differ, so the max has a corner. Two points.</p>`, 'Corners appear where the two graphs cross with different slopes.')),
  CK(() => need(kinkCount((x) => Math.min(x, x * x), -2, 2) === 2, 'kinks min(x,x^2)'), I(4, 'counting points of non-differentiability', R`The number of points in $(-2,2)$ where $f(x)=\min(x,x^2)$ is not differentiable is`, 2,
    R`<p>$x=x^2$ at $x=0$ and $x=1$. The slopes there are $1$ vs $0$ (at 0) and $1$ vs $2$ (at 1): different. Two corners.</p>`, 'If the slopes were equal at a crossing, there would be no corner.')),
  CK(() => need(kinkCount((x) => abs(x) + abs(x * x - 4), -3, 3) === 3, 'kinks |x|+|x^2-4|'), I(4, 'counting points of non-differentiability', R`The function $f(x)=|x|+\left|x^2-4\right|$ is not differentiable at how many points?`, 3,
    R`<p>$|x|$ has a corner at $0$. $|x^2-4|$ has corners at $\pm2$. They are at different points, so nothing cancels. Three points.</p>`, ''),),
  CK(() => need(jumpCount((x) => x * x + fl(x), 0, 3) === 2, 'jumps x^2+[x]'), I(3, 'counting points of non-differentiability', R`$f(x)=x^2+[x]$ is not differentiable at how many points of $(0,3)$?`, 2,
    R`<p>$[x]$ is discontinuous at $1$ and $2$ in $(0,3)$. A function that is not continuous cannot be differentiable there. At other points $[x]$ is constant, so $f$ is smooth. Two points.</p>`, 'Discontinuity implies non-differentiability.')),
  CK(() => need(kinkCount((x) => abs(x * x - 3 * x + 2), -2, 5) === 2, 'kinks |x^2-3x+2|'), I(3, 'counting points of non-differentiability', R`$f(x)=\left|x^2-3x+2\right|$ is not differentiable at how many points?`, 2,
    R`<p>$x^2-3x+2=(x-1)(x-2)$, which changes sign at $1$ and $2$ with non-zero slope. Two corners.</p>`, 'Sign changes at simple roots give corners.')),
  CK(() => need(kinkCount((x) => abs(x ** 3), -2, 2) === 0, 'no kink |x^3|'), I(4, 'counting points of non-differentiability', R`The function $f(x)=\left|(x-1)^3\right|$ is not differentiable at how many points?`, 0,
    R`<p>$|(x-1)^3|=|x-1|^3$. For $x\ne1$ its derivative is $3(x-1)|x-1|$, which tends to $0$ from both sides, and at $x=1$ the definition gives $\frac{|h|^3}{h}\to0$. So $f$ is differentiable everywhere. The zero is a triple root: the graph flattens instead of making a corner.</p>`, 'A triple (odd, higher) root gives a flat touch, not a corner.')),
  CK(() => need(kinkCount((x) => abs((x - 1) * (x - 2) ** 2), -2, 5) === 1, 'kinks |(x-1)(x-2)^2|'), I(4, 'counting points of non-differentiability', R`$f(x)=\left|(x-1)(x-2)^2\right|$ is not differentiable at how many points?`, 1,
    R`<p>At $x=1$ (simple root) the sign changes with non-zero slope: corner. At $x=2$ (double root) $(x-1)(x-2)^2$ does not change sign near $2$ and has slope $0$ there, so $|\cdot|$ is smooth. One point.</p>`, 'A repeated root does not give a corner.')),

  // ================= constants for differentiability =================
  CK(() => cDiff('x2/ax+b', (x) => (x <= 1 ? x * x : 2 * x - 1), 1), I(3, 'finding constants', R`$f(x)=\begin{cases}x^2,&x\le1\\ax+b,&x>1\end{cases}$ is differentiable at $x=1$. Find $a+b$.`, 1,
    R`<p>Continuity: $a+b=1$. Slopes: $2x=2$ at $x=1$ must equal $a$. So $a=2$, $b=-1$, $a+b=1$. (Continuity alone gives $a+b=1$.)</p>`, 'Two conditions: equal values and equal slopes.')),
  CK(() => cDiff('x3/ax2+bx', (x) => (x <= 2 ? x ** 3 : 4 * x * x - 4 * x), 2), I(4, 'finding constants', R`$f(x)=\begin{cases}x^3,&x\le2\\ax^2+bx,&x>2\end{cases}$ is differentiable at $x=2$. Find $a-b$.`, 8,
    R`<p>Continuity: $8=4a+2b$. Slope: $3x^2=12$ at 2, so $12=4a+b$. Subtract: $b=-4$. Then $4a=16$, $a=4$. $a-b=8$.</p>`, 'Write the slope of each piece at $x=2$.')),
  CK(() => cDiff('ax+b/e^2x', (x) => (x <= 0 ? 2 * x + 1 : exp(2 * x)), 0), I(3, 'finding constants', R`$f(x)=\begin{cases}ax+b,&x\le0\\e^{2x},&x>0\end{cases}$ is differentiable at $0$. Find $a+b$.`, 3,
    R`<p>Continuity: $b=e^0=1$. Slopes: $a=\dfrac{d}{dx}e^{2x}\Big|_0=2$. So $a+b=3$.</p>`, ''),),
  CK(() => cDiff('x2+3x+a/bx+2', (x) => (x <= 1 ? x * x + 3 * x + 3 : 5 * x + 2), 1), I(3, 'finding constants', R`$f(x)=\begin{cases}x^2+3x+a,&x\le1\\bx+2,&x>1\end{cases}$ is differentiable at $x=1$. Find $a+b$.`, 8,
    R`<p>Slopes: $2x+3=5$ at 1, so $b=5$. Values: $1+3+a=b+2=7$, so $a=3$. $a+b=8$.</p>`, 'Slope condition first gives $b$ directly.')),
  CK(() => cDiff('sin/cos', (x) => (x <= PI_ / 2 ? sin(x) : 1 - ((x - PI_ / 2) * 0)), PI_ / 2), M(4, 'finding constants', R`$f(x)=\begin{cases}\sin x,&x\le\frac\pi2\\a+b\left(x-\frac\pi2\right)^2,&x>\frac\pi2\end{cases}$ is differentiable at $x=\frac\pi2$ for`, '$a=1$ and any real $b$', ['$a=1$ and $b=0$', '$a=0$ and any real $b$', '$a=1$ and $b=1$'],
    R`<p>Continuity: $a=\sin\frac\pi2=1$. Slopes: left $\cos\frac\pi2=0$; right $2b\left(x-\frac\pi2\right)\to0$ for every $b$. So only $a=1$ is required.</p>`, 'The slope of the second piece is 0 at the join whatever $b$ is.')),
);

items.push(
  // ================= chain rule and standard derivatives =================
  EF(1, 'chain rule', R`If $y=\sin(3x^2)$, then $\dfrac{dy}{dx}=$`, (x) => sin(3 * x * x), (x) => 6 * x * cos(3 * x * x), [0.7, 1.2], R`6x\cos(3x^2)`, [R`\cos(3x^2)`, R`6x\sin(3x^2)`, R`3x^2\cos(3x^2)`],
    R`<p>Outer: $\sin u\to\cos u$. Inner: $u=3x^2$, $u'=6x$. Multiply: $6x\cos(3x^2)$.</p>`, 'Do not forget the derivative of the inside.'),
  EF(1, 'chain rule', R`If $y=e^{5x}$, then $\dfrac{dy}{dx}=$`, (x) => exp(5 * x), (x) => 5 * exp(5 * x), [0.3, 1], R`5e^{5x}`, [R`e^{5x}`, R`5xe^{5x-1}`, R`\dfrac{e^{5x}}5`],
    R`<p>$\dfrac{d}{dx}e^{u}=e^u u'$, with $u=5x$, $u'=5$.</p>`, ''),
  EF(1, 'chain rule', R`If $y=\ln(x^2+1)$, then $\dfrac{dy}{dx}=$`, (x) => ln(x * x + 1), (x) => (2 * x) / (x * x + 1), [0.5, 2], R`\dfrac{2x}{x^2+1}`, [R`\dfrac1{x^2+1}`, R`\dfrac{2x}{x^2}`, R`2x\ln(x^2+1)`],
    R`<p>$\dfrac{d}{dx}\ln u=\dfrac{u'}u$ with $u=x^2+1$.</p>`, ''),
  EF(2, 'chain rule', R`If $y=\sqrt{1+x^2}$, then $\dfrac{dy}{dx}=$`, (x) => sqrt(1 + x * x), (x) => x / sqrt(1 + x * x), [0.5, 2], R`\dfrac{x}{\sqrt{1+x^2}}`, [R`\dfrac{1}{2\sqrt{1+x^2}}`, R`\dfrac{2x}{\sqrt{1+x^2}}`, R`\dfrac{x}{2\sqrt{1+x^2}}`],
    R`<p>$y=u^{1/2}$: $y'=\frac12u^{-1/2}\cdot u'=\dfrac{2x}{2\sqrt{1+x^2}}=\dfrac x{\sqrt{1+x^2}}$.</p>`, 'The $\\frac12$ cancels the 2 from $u\'=2x$.'),
  EF(2, 'chain rule', R`If $y=\tan(2x+1)$, then $\dfrac{dy}{dx}=$`, (x) => tan(2 * x + 1), (x) => 2 / cos(2 * x + 1) ** 2, [0.1, 0.3], R`2\sec^2(2x+1)`, [R`\sec^2(2x+1)`, R`2\tan(2x+1)\sec(2x+1)`, R`\sec^2(2)`],
    R`<p>$\dfrac{d}{dx}\tan u=\sec^2u\cdot u'$ with $u'=2$.</p>`, ''),
  EF(2, 'chain rule', R`If $y=(3x^2+1)^5$, then $\dfrac{dy}{dx}=$`, (x) => (3 * x * x + 1) ** 5, (x) => 30 * x * (3 * x * x + 1) ** 4, [0.4, 1], R`30x(3x^2+1)^4`, [R`5(3x^2+1)^4`, R`5(6x)^4`, R`30x(3x^2+1)^5`],
    R`<p>$5(3x^2+1)^4\cdot6x=30x(3x^2+1)^4$.</p>`, 'The power drops by one.'),
  EF(2, 'chain rule', R`If $y=\sin^2(3x)$, then $\dfrac{dy}{dx}=$`, (x) => sin(3 * x) ** 2, (x) => 3 * sin(6 * x), [0.2, 0.9], R`3\sin6x`, [R`2\sin3x`, R`6\cos3x`, R`2\sin3x\cos3x`],
    R`<p>$2\sin3x\cdot\cos3x\cdot3=3\sin6x$.</p>`, 'Two layers: the square and the $3x$. ($2\\sin3x\\cos3x$ is $\\sin6x$, so it is missing the factor 3.)'),
  EF(2, 'product rule', R`If $y=e^{x^2}\sin x$, then $\dfrac{dy}{dx}=$`, (x) => exp(x * x) * sin(x), (x) => exp(x * x) * (2 * x * sin(x) + cos(x)), [0.4, 1], R`e^{x^2}\left(2x\sin x+\cos x\right)`, [R`e^{x^2}\cos x`, R`2xe^{x^2}\cos x`, R`e^{x^2}\left(2x\cos x+\sin x\right)`],
    R`<p>$(uv)'=u'v+uv'$ with $u=e^{x^2}$, $u'=2xe^{x^2}$, $v=\sin x$.</p>`, ''),
  EF(2, 'chain rule', R`If $y=\ln(\sec x+\tan x)$, then $\dfrac{dy}{dx}=$`, (x) => ln(1 / cos(x) + tan(x)), (x) => 1 / cos(x), [0.3, 0.9], R`\sec x`, [R`\tan x`, R`\sec x\tan x`, R`\csc x`],
    R`<p>$\dfrac{\sec x\tan x+\sec^2x}{\sec x+\tan x}=\dfrac{\sec x(\tan x+\sec x)}{\sec x+\tan x}=\sec x$.</p>`, 'Factor $\\sec x$ from the top.'),
  EF(3, 'chain rule', R`If $y=\ln\left(x+\sqrt{x^2+1}\right)$, then $\dfrac{dy}{dx}=$`, (x) => ln(x + sqrt(x * x + 1)), (x) => 1 / sqrt(x * x + 1), [0.5, 2], R`\dfrac1{\sqrt{x^2+1}}`, [R`\dfrac1{x+\sqrt{x^2+1}}`, R`\dfrac x{\sqrt{x^2+1}}`, R`\dfrac{1}{x^2+1}`],
    R`<p>$u=x+\sqrt{x^2+1}$, $u'=1+\dfrac x{\sqrt{x^2+1}}=\dfrac{\sqrt{x^2+1}+x}{\sqrt{x^2+1}}$. So $\dfrac{u'}u=\dfrac1{\sqrt{x^2+1}}$.</p>`, 'The inside derivative cancels the log argument.'),
  EF(3, 'product rule', R`If $y=xe^{-x^2}$, then $\dfrac{dy}{dx}=$`, (x) => x * exp(-x * x), (x) => (1 - 2 * x * x) * exp(-x * x), [0.5, 1.5], R`\left(1-2x^2\right)e^{-x^2}`, [R`-2x^2e^{-x^2}`, R`\left(1+2x^2\right)e^{-x^2}`, R`e^{-x^2}`],
    R`<p>$e^{-x^2}+x\cdot(-2x)e^{-x^2}=(1-2x^2)e^{-x^2}$.</p>`, ''),
  EF(3, 'chain rule', R`If $y=\sin(\cos(\tan x))$, then $\dfrac{dy}{dx}=$`, (x) => sin(cos(tan(x))), (x) => -cos(cos(tan(x))) * sin(tan(x)) / cos(x) ** 2, [0.3, 0.6], R`-\cos(\cos\tan x)\,\sin(\tan x)\,\sec^2x`, [R`\cos(\cos\tan x)\,\sin(\tan x)\,\sec^2x`, R`-\cos(\cos\tan x)\,\sin(\tan x)`, R`-\cos(\cos\tan x)\,\cos(\tan x)\sec^2x`],
    R`<p>Peel from the outside: $\cos(\cos\tan x)\cdot(-\sin\tan x)\cdot\sec^2x$. Three layers, three factors.</p>`, 'The middle layer $\\cos u$ gives $-\\sin u$.'),
  EF(3, 'quotient rule', R`If $y=\dfrac{x^2}{\sqrt{1+x}}$, then $\dfrac{dy}{dx}=$`, (x) => (x * x) / sqrt(1 + x), (x) => (3 * x * x + 4 * x) / (2 * (1 + x) ** 1.5), [0.5, 2], R`\dfrac{3x^2+4x}{2(1+x)^{3/2}}`, [R`\dfrac{3x^2+4x}{2(1+x)^{1/2}}`, R`\dfrac{2x}{\frac12(1+x)^{-1/2}}`, R`\dfrac{x^2+4x}{2(1+x)^{3/2}}`],
    R`<p>$y'=\dfrac{2x\sqrt{1+x}-x^2\cdot\frac1{2\sqrt{1+x}}}{1+x}=\dfrac{4x(1+x)-x^2}{2(1+x)^{3/2}}=\dfrac{3x^2+4x}{2(1+x)^{3/2}}$.</p>`, ''),
  DI(2, 'derivative at a point', R`If $f(x)=x^3-3x$, find $f'(2)$.`, (x) => x ** 3 - 3 * x, 2, 9, R`<p>$f'(x)=3x^2-3$, $f'(2)=12-3=9$.</p>`, ''),
  DI(2, 'derivative at a point', R`If $f(x)=\ln(x^2+1)$, find $f'(1)$.`, (x) => ln(x * x + 1), 1, 1, R`<p>$f'(x)=\dfrac{2x}{x^2+1}$. At $x=1$: $\dfrac22=1$.</p>`, ''),
  DM(3, 'derivative at a point', R`If $f(x)=e^{\sin x}$, then $f'(0)=$`, (x) => exp(sin(x)), 0, 1, '1', ['0', e, R`\dfrac1e`],
    R`<p>$f'(x)=e^{\sin x}\cos x$. At $0$: $e^0\cdot1=1$.</p>`, ''),
  DI(3, 'derivative at a point', R`If $f(x)=(2x+1)^4$, find $f'(0)$.`, (x) => (2 * x + 1) ** 4, 0, 8, R`<p>$f'(x)=4(2x+1)^3\cdot2=8(2x+1)^3$. At $0$: $8$.</p>`, 'Multiply by the inner derivative 2.'),
  DI(3, 'derivative at a point', R`If $f(x)=\ln(\sin x)$, find $f'\!\left(\dfrac\pi4\right)$.`, (x) => ln(sin(x)), PI_ / 4, 1, R`<p>$f'(x)=\cot x$. At $\frac\pi4$: $1$.</p>`, ''),
  DN(3, 'derivative at a point', R`If $f(x)=\dfrac{\ln x}{x}$, find $f'(2)$.`, (x) => ln(x) / x, 2, (1 - ln(2)) / 4, R`<p>$f'(x)=\dfrac{1-\ln x}{x^2}$. At $2$: $\dfrac{1-0.6931}{4}\approx0.0767$.</p>`, 'Quotient rule: top is $\\frac1x\\cdot x-\\ln x\\cdot1$.'),

  // ================= first principles =================
  LI(3, 'derivative as a limit', R`If $f(x)=x^3$, evaluate $\displaystyle\lim_{h\to0}\dfrac{f(1+2h)-f(1-3h)}{h}$.`, (h) => ((1 + 2 * h) ** 3 - (1 - 3 * h) ** 3) / h, 0, 15, R`<p>Write $f(1+2h)-f(1-3h)=\left[f(1+2h)-f(1)\right]-\left[f(1-3h)-f(1)\right]$. Divided by $h$ this tends to $2f'(1)+3f'(1)=5f'(1)=5\cdot3=15$.</p>`, 'The two step sizes add: $2+3$.'),
  LI(3, 'derivative as a limit', R`If $f(x)=x^3$, then $\displaystyle\lim_{x\to1}\dfrac{x^2f(1)-f(x)}{x-1}$ equals`, (x) => (x * x - x ** 3) / (x - 1), 1, -1, R`<p>Add and subtract $f(1)$: $\dfrac{x^2f(1)-f(x)}{x-1}$ with $f(1)=1$ is $\dfrac{x^2-x^3}{x-1}=-x^2\to-1$. In general it equals $2f(1)-f'(1)=2-3=-1$.</p>`, 'Do it concretely: simplify $\\frac{x^2-x^3}{x-1}$.'),
  LM(3, 'derivative as a limit', LQ(R`\frac\pi6`, R`\dfrac{\sin x-\frac12}{x-\frac\pi6}`), (x) => (sin(x) - 0.5) / (x - PI_ / 6), PI_ / 6, sqrt(3) / 2, R`\dfrac{\sqrt3}2`, [R`\dfrac12`, '1', R`\dfrac1{\sqrt3}`],
    R`<p>This is $f'(a)$ for $f=\sin$, $a=\frac\pi6$: $\cos\frac\pi6=\frac{\sqrt3}2$.</p>`, 'Recognise the definition of the derivative.'),
  LI(3, 'derivative as a limit', LQ(2, R`\dfrac{x^5-32}{x-2}`), (x) => (x ** 5 - 32) / (x - 2), 2, 80, R`<p>This is $f'(2)$ for $f(x)=x^5$: $5\cdot2^4=80$.</p>`, ''),

  // ================= implicit differentiation =================
  CK(() => cIm('x3+y3=3xy', (x, y) => x ** 3 + y ** 3 - 3 * x * y, 1.5, 1.5, -1), I(3, 'implicit differentiation', R`For the curve $x^3+y^3=3xy$, find $\dfrac{dy}{dx}$ at the point $\left(\dfrac32,\dfrac32\right)$.`, -1,
    R`<p>Differentiate: $3x^2+3y^2y'=3y+3xy'$. So $y'(y^2-x)=y-x^2$ and $y'=\dfrac{y-x^2}{y^2-x}$. At $(\frac32,\frac32)$: $\dfrac{1.5-2.25}{2.25-1.5}=-1$.</p>`, 'Collect the $y\'$ terms together before dividing.')),
  CK(() => cIm('x2+y2=25', (x, y) => x * x + y * y - 25, 3, 4, -0.75), M(1, 'implicit differentiation', R`For the circle $x^2+y^2=25$, the slope $\dfrac{dy}{dx}$ at $(3,4)$ is`, R`$-\dfrac34$`, [R`$\dfrac34$`, R`$-\dfrac43$`, R`$\dfrac43$`],
    R`<p>$2x+2yy'=0\Rightarrow y'=-\dfrac xy=-\dfrac34$.</p>`, 'It is $-x/y$, not $-y/x$.')),
  CK(() => cIm('y2=4x', (x, y) => y * y - 4 * x, 1, 2, 1), I(2, 'implicit differentiation', R`For $y^2=4x$, the slope $\dfrac{dy}{dx}$ at $(1,2)$ is`, 1,
    R`<p>$2yy'=4\Rightarrow y'=\dfrac2y=1$.</p>`, ''),),
  CK(() => cIm('x2+xy+y2=7', (x, y) => x * x + x * y + y * y - 7, 1, 2, -0.8), M(3, 'implicit differentiation', R`For $x^2+xy+y^2=7$, the value of $\dfrac{dy}{dx}$ at $(1,2)$ is`, R`$-\dfrac45$`, [R`$\dfrac45$`, R`$-\dfrac54$`, R`$-\dfrac12$`],
    R`<p>$2x+y+xy'+2yy'=0$, so $y'=-\dfrac{2x+y}{x+2y}$. At $(1,2)$: $-\dfrac{4}{5}$.</p>`, 'The product $xy$ needs the product rule.')),
  CK(() => cIm('x^y=y^x at 1,1', (x, y) => y * ln(x) - x * ln(y), 1, 1, 1), M(4, 'implicit differentiation', R`The curve $x^y=y^x$ passes through $(1,1)$. The slope of the curve there is`, '$1$', ['$0$', '$-1$', 'not defined'],
    R`<p>Take logs: $y\ln x=x\ln y$. Differentiate: $y'\ln x+\dfrac yx=\ln y+\dfrac{xy'}y$. At $(1,1)$: $0+1=0+y'$, so $y'=1$.</p>`, 'Take logarithms first because both the base and the exponent have variables.')),
  CK(() => cIm('x^y=y^x at 2,4', (x, y) => y * ln(x) - x * ln(y), 2, 4, (ln(4) - 2) / (ln(2) - 0.5)), N(5, 'implicit differentiation', R`The point $(2,4)$ lies on $x^y=y^x$ (since $2^4=4^2$). Find $\dfrac{dy}{dx}$ there (2 decimal places).`, r4((ln(4) - 2) / (ln(2) - 0.5)), 0.01,
    R`<p>From $y\ln x=x\ln y$: $y'\left(\ln x-\dfrac xy\right)=\ln y-\dfrac yx$. So $y'=\dfrac{\ln y-y/x}{\ln x-x/y}$. At $(2,4)$: $\dfrac{\ln4-2}{\ln2-0.5}=\dfrac{-0.6137}{0.1931}\approx-3.18$.</p>`, 'Arithmetic care: $\\ln4=2\\ln2$.')),
);

items.push(
  // ================= logarithmic differentiation =================
  DN(3, 'logarithmic differentiation', R`If $y=x^x$, find $\dfrac{dy}{dx}$ at $x=2$.`, (x) => x ** x, 2, 4 * (1 + ln(2)),
    R`<p>$\ln y=x\ln x$, so $\dfrac{y'}y=\ln x+1$ and $y'=x^x(1+\ln x)$. At $2$: $4(1+0.6931)\approx6.77$.</p>`, 'Do not use the power rule $x\\cdot x^{x-1}$ alone.'),
  DI(3, 'logarithmic differentiation', R`If $y=x^{\sin x}$, find $\dfrac{dy}{dx}$ at $x=\dfrac\pi2$.`, (x) => x ** sin(x), PI_ / 2, 1,
    R`<p>$\ln y=\sin x\ln x$, so $y'=x^{\sin x}\left(\cos x\ln x+\dfrac{\sin x}x\right)$. At $\frac\pi2$: $\frac\pi2\left(0+\frac2\pi\right)=1$.</p>`, '$\\cos\\frac\\pi2=0$ kills the first term.'),
  DI(4, 'logarithmic differentiation', R`If $y=(\ln x)^x$, find $\dfrac{dy}{dx}$ at $x=e$.`, (x) => ln(x) ** x, E_, 1,
    R`<p>$\ln y=x\ln(\ln x)$. $\dfrac{y'}y=\ln\ln x+\dfrac{x}{x\ln x}=\ln\ln x+\dfrac1{\ln x}$. At $x=e$: $y=1$, $\ln\ln e=0$, $\frac1{\ln e}=1$. So $y'=1$.</p>`, ''),
  DM(3, 'logarithmic differentiation', R`If $y=(\sin x)^x$, then $\dfrac{dy}{dx}$ at $x=\dfrac\pi2$ equals`, (x) => sin(x) ** x, PI_ / 2, 0, '0', ['1', R`\dfrac\pi2`, 'not defined'],
    R`<p>$y'=(\sin x)^x\left(\ln\sin x+x\cot x\right)$. At $\frac\pi2$: $1\cdot(\ln1+\frac\pi2\cdot0)=0$.</p>`, ''),
  EF(4, 'logarithmic differentiation', R`If $y=x^{\ln x}$, then $\dfrac{dy}{dx}=$`, (x) => x ** ln(x), (x) => 2 * ln(x) * x ** (ln(x) - 1), [1.5, 3], R`2\ln x\cdot x^{\ln x-1}`, [R`\ln x\cdot x^{\ln x-1}`, R`x^{\ln x}\ln x`, R`2x^{\ln x}\ln x`],
    R`<p>$\ln y=(\ln x)^2$. $\dfrac{y'}y=\dfrac{2\ln x}x$. So $y'=x^{\ln x}\cdot\dfrac{2\ln x}x=2\ln x\cdot x^{\ln x-1}$.</p>`, 'Differentiating $(\\ln x)^2$ gives $\\frac{2\\ln x}{x}$.'),
  EF(4, 'logarithmic differentiation', R`If $y=\dfrac{(x^2+1)^3(x-2)^4}{(x+3)^2}$, then $\dfrac{dy}{dx}=$`, (x) => ((x * x + 1) ** 3 * (x - 2) ** 4) / (x + 3) ** 2, (x) => (((x * x + 1) ** 3 * (x - 2) ** 4) / (x + 3) ** 2) * ((6 * x) / (x * x + 1) + 4 / (x - 2) - 2 / (x + 3)), [3, 4.5],
    R`y\left[\dfrac{6x}{x^2+1}+\dfrac4{x-2}-\dfrac2{x+3}\right]`, [R`y\left[\dfrac{6x}{x^2+1}+\dfrac4{x-2}+\dfrac2{x+3}\right]`, R`y\left[\dfrac{3}{x^2+1}+\dfrac1{x-2}-\dfrac1{x+3}\right]`, R`y\left[\dfrac{6x}{x^2+1}\cdot\dfrac4{x-2}\cdot\dfrac2{x+3}\right]`],
    R`<p>Take logs: $\ln y=3\ln(x^2+1)+4\ln(x-2)-2\ln(x+3)$. Differentiate: $\dfrac{y'}y=\dfrac{6x}{x^2+1}+\dfrac4{x-2}-\dfrac2{x+3}$.</p>`, 'The denominator factor gives a minus sign.'),
  DN(4, 'logarithmic differentiation', R`If $y=\left(1+\dfrac1x\right)^x$, find $\dfrac{dy}{dx}$ at $x=1$.`, (x) => (1 + 1 / x) ** x, 1, 2 * (ln(2) - 0.5),
    R`<p>$\ln y=x\ln\left(1+\frac1x\right)$. $\dfrac{y'}y=\ln\left(1+\frac1x\right)+x\cdot\dfrac{-1/x^2}{1+1/x}=\ln\left(1+\frac1x\right)-\dfrac1{x+1}$. At $x=1$: $y=2$, $\dfrac{y'}y=\ln2-\frac12$. So $y'=2(\ln2-\frac12)\approx0.386$.</p>`, ''),

  // ================= parametric =================
  CK(() => cPar('x=2cos t,y=3sin t', (t) => 2 * cos(t), (t) => 3 * sin(t), PI_ / 4, -1.5), M(2, 'parametric derivatives', R`If $x=2\cos t$ and $y=3\sin t$, then $\dfrac{dy}{dx}$ at $t=\dfrac\pi4$ is`, R`$-\dfrac32$`, [R`$\dfrac32$`, R`$-\dfrac23$`, R`$-1$`],
    R`<p>$\dfrac{dy}{dx}=\dfrac{dy/dt}{dx/dt}=\dfrac{3\cos t}{-2\sin t}=-\dfrac32\cot t$. At $t=\frac\pi4$, $\cot t=1$: $-\dfrac32$.</p>`, 'Divide $dy/dt$ by $dx/dt$, in that order.')),
  CK(() => cPar('x=t2,y=t3', (t) => t * t, (t) => t ** 3, 2, 3), I(2, 'parametric derivatives', R`If $x=t^2$ and $y=t^3$, find $\dfrac{dy}{dx}$ at $t=2$.`, 3,
    R`<p>$\dfrac{3t^2}{2t}=\dfrac{3t}2$. At $t=2$: $3$.</p>`, '')),
  CK(() => cPar('cycloid', (t) => 3 * (t - sin(t)), (t) => 3 * (1 - cos(t)), PI_ / 2, 1), I(3, 'parametric derivatives', R`For $x=3(\theta-\sin\theta)$, $y=3(1-\cos\theta)$, find $\dfrac{dy}{dx}$ at $\theta=\dfrac\pi2$.`, 1,
    R`<p>$\dfrac{dy}{dx}=\dfrac{3\sin\theta}{3(1-\cos\theta)}=\dfrac{\sin\theta}{1-\cos\theta}=\cot\dfrac\theta2$. At $\theta=\frac\pi2$: $\cot\frac\pi4=1$.</p>`, 'The constant 3 cancels.')),
  CK(() => cPar('e^t cos t', (t) => exp(t) * cos(t), (t) => exp(t) * sin(t), PI_ / 6, 2 + sqrt(3)), N(3, 'parametric derivatives', R`If $x=e^t\cos t$ and $y=e^t\sin t$, find $\dfrac{dy}{dx}$ at $t=\dfrac\pi6$ (2 decimal places).`, r4(2 + sqrt(3)), 0.01,
    R`<p>$\dfrac{dy}{dt}=e^t(\sin t+\cos t)$, $\dfrac{dx}{dt}=e^t(\cos t-\sin t)$. Ratio: $\dfrac{\cos t+\sin t}{\cos t-\sin t}$. At $\frac\pi6$: $\dfrac{0.866+0.5}{0.866-0.5}=\dfrac{1.366}{0.366}=2+\sqrt3\approx3.73$.</p>`, 'Product rule on both $x$ and $y$.')),
  CK(() => cPar('t+1/t', (t) => t + 1 / t, (t) => t - 1 / t, 2, 5 / 3), N(3, 'parametric derivatives', R`If $x=t+\dfrac1t$ and $y=t-\dfrac1t$, find $\dfrac{dy}{dx}$ at $t=2$ (2 decimal places).`, r4(5 / 3), 0.01,
    R`<p>$\dfrac{dy}{dt}=1+\dfrac1{t^2}$, $\dfrac{dx}{dt}=1-\dfrac1{t^2}$. Ratio $=\dfrac{t^2+1}{t^2-1}$. At $t=2$: $\dfrac53\approx1.67$.</p>`, '')),
  CK(() => cPar('astroid', (t) => cos(t) ** 3, (t) => sin(t) ** 3, PI_ / 3, -sqrt(3)), N(4, 'parametric derivatives', R`For $x=\cos^3t$, $y=\sin^3t$, find $\dfrac{dy}{dx}$ at $t=\dfrac\pi3$ (2 decimal places).`, r4(-sqrt(3)), 0.01,
    R`<p>$\dfrac{dy}{dt}=3\sin^2t\cos t$, $\dfrac{dx}{dt}=-3\cos^2t\sin t$. Ratio $=-\tan t$. At $\frac\pi3$: $-\sqrt3\approx-1.73$.</p>`, 'Cancel $3\\sin t\\cos t$.')),
  CK(() => cPar2('x=t2,y=t3 second', (t) => t * t, (t) => t ** 3, 2, 0.375), N(4, 'parametric derivatives', R`If $x=t^2$ and $y=t^3$, find $\dfrac{d^2y}{dx^2}$ at $t=2$ (2 decimal places).`, 0.375, 0.01,
    R`<p>$\dfrac{dy}{dx}=\dfrac{3t}2$. Then $\dfrac{d^2y}{dx^2}=\dfrac{d}{dt}\left(\dfrac{3t}2\right)\Big/\dfrac{dx}{dt}=\dfrac{3/2}{2t}=\dfrac3{4t}$. At $t=2$: $\dfrac38=0.375$.</p>`, 'Divide by $dx/dt$ again, do not just differentiate $\\frac{dy}{dx}$ with respect to $t$.')),
  CK(() => cPar2('x=a cos, second', (t) => 2 * cos(t), (t) => 2 * sin(t), PI_ / 2, -0.5), M(4, 'parametric derivatives', R`If $x=2\cos t$ and $y=2\sin t$, then $\dfrac{d^2y}{dx^2}$ at $t=\dfrac\pi2$ equals`, R`$-\dfrac12$`, [R`$\dfrac12$`, '$0$', '$-1$'],
    R`<p>$\dfrac{dy}{dx}=-\cot t$. $\dfrac{d}{dt}(-\cot t)=\csc^2t$. Divide by $\dfrac{dx}{dt}=-2\sin t$: $\dfrac{d^2y}{dx^2}=-\dfrac{\csc^2t}{2\sin t}=-\dfrac1{2\sin^3t}$. At $\frac\pi2$: $-\dfrac12$. (It is the circle $x^2+y^2=4$, whose $y''=-\frac{4}{y^3}=-\frac12$ at $y=2$.)</p>`, 'Check with the circle.')),

  // ================= second derivatives =================
  SI(2, 'second derivative', R`If $f(x)=x^4-3x^2$, find $f''(1)$.`, (x) => x ** 4 - 3 * x * x, 1, 6, R`<p>$f'=4x^3-6x$, $f''=12x^2-6$. At 1: $6$.</p>`, ''),
  SI(3, 'second derivative', R`If $y=e^{2x}\sin x$, find $\dfrac{d^2y}{dx^2}$ at $x=0$.`, (x) => exp(2 * x) * sin(x), 0, 4, R`<p>$y'=e^{2x}(2\sin x+\cos x)$. $y''=e^{2x}(4\sin x+2\cos x+2\cos x-\sin x)=e^{2x}(3\sin x+4\cos x)$. At $0$: $4$.</p>`, ''),
  SM(3, 'second derivative', R`If $y=\tan x$, then $\dfrac{d^2y}{dx^2}$ at $x=\dfrac\pi4$ is`, (x) => tan(x), PI_ / 4, 4, '4', ['2', '1', '8'],
    R`<p>$y'=\sec^2x$, $y''=2\sec^2x\tan x$. At $\frac\pi4$: $\sec^2=2$, $\tan=1$: $4$.</p>`, '$\\sec^2\\frac\\pi4=2$.'),
  SI(3, 'second derivative', R`If $y=\ln(1+x^2)$, find $\dfrac{d^2y}{dx^2}$ at $x=1$.`, (x) => ln(1 + x * x), 1, 0, R`<p>$y'=\dfrac{2x}{1+x^2}$. $y''=\dfrac{2(1+x^2)-4x^2}{(1+x^2)^2}=\dfrac{2(1-x^2)}{(1+x^2)^2}$. At $1$: $0$.</p>`, 'The point $x=1$ is a point of inflection.'),
  CK(() => cD2('x3 ln x', (x) => x ** 3 * ln(x), E_, 11 * E_), N(4, 'second derivative', R`If $y=x^3\ln x$, find $\dfrac{d^2y}{dx^2}$ at $x=e$ (2 decimal places).`, r4(11 * E_), 0.02, R`<p>$y'=3x^2\ln x+x^2$. $y''=6x\ln x+3x+2x=6x\ln x+5x$. At $e$: $6e+5e=11e\approx29.90$.</p>`, '')),
  CK(() => cD2('sin(x^2)', (x) => sin(x * x), sqrt(PI_ / 2), -2 * PI_), N(4, 'second derivative', R`If $y=\sin(x^2)$, find $\dfrac{d^2y}{dx^2}$ at $x=\sqrt{\pi/2}$ (2 decimal places).`, r4(-2 * PI_), 0.02, R`<p>$y'=2x\cos x^2$. $y''=2\cos x^2-4x^2\sin x^2$. At $x^2=\frac\pi2$: $2\cdot0-4\cdot\frac\pi2\cdot1=-2\pi\approx-6.28$.</p>`, 'Use the product rule on $2x\\cos x^2$.')),
  CK(() => { const y = (x) => cos(ln(x)) + 2 * sin(ln(x)); need(Math.abs(4 * D2(y, 2) + 2 * D1(y, 2) + y(2)) < 1e-3, 'ODE'); }, M(4, 'second derivative', R`If $y=A\cos(\ln x)+B\sin(\ln x)$, then $x^2y''+xy'+y$ equals`, '$0$', ['$y$', '$-y$', '$2y$'],
    R`<p>$y'=\dfrac{-A\sin(\ln x)+B\cos(\ln x)}x$. $xy'=-A\sin\ln x+B\cos\ln x$. Differentiate again: $y'+xy''=\dfrac{-A\cos\ln x-B\sin\ln x}x=-\dfrac yx$. Multiply by $x$: $xy'+x^2y''=-y$. So $x^2y''+xy'+y=0$.</p>`, 'Differentiate $xy\'$ again rather than expanding $y\'\'$.')),
  CK(() => { const y = (x) => x * exp(x); need(Math.abs(D2(y, 0.7) - 2 * D1(y, 0.7) + y(0.7)) < 1e-3, 'ODE2'); }, M(3, 'second derivative', R`If $y=xe^x$, then $y''-2y'+y=$`, '$0$', ['$e^x$', '$2e^x$', '$xe^x$'],
    R`<p>$y'=e^x(1+x)$, $y''=e^x(2+x)$. So $y''-2y'+y=e^x[(2+x)-2(1+x)+x]=0$.</p>`, '')),

  // ================= inverse trigonometric derivatives through substitution =================
  EF(4, 'inverse trigonometric', R`If $y=\tan^{-1}\!\left(\dfrac{\sqrt{1+x^2}-1}{x}\right)$, then $\dfrac{dy}{dx}=$`, (x) => atan((sqrt(1 + x * x) - 1) / x), (x) => 1 / (2 * (1 + x * x)), [0.5, 2], R`\dfrac1{2(1+x^2)}`, [R`\dfrac1{1+x^2}`, R`\dfrac2{1+x^2}`, R`\dfrac{x}{2(1+x^2)}`],
    R`<p>Put $x=\tan\theta$: $\dfrac{\sec\theta-1}{\tan\theta}=\dfrac{1-\cos\theta}{\sin\theta}=\tan\dfrac\theta2$. So $y=\dfrac\theta2=\dfrac12\tan^{-1}x$ and $y'=\dfrac1{2(1+x^2)}$.</p>`, 'The substitution $x=\\tan\\theta$ turns the root into $\\sec\\theta$.'),
  EF(4, 'inverse trigonometric', R`If $y=\sin^{-1}\!\left(2x\sqrt{1-x^2}\right)$ for $|x|<\frac1{\sqrt2}$, then $\dfrac{dy}{dx}=$`, (x) => asin(2 * x * sqrt(1 - x * x)), (x) => 2 / sqrt(1 - x * x), [0.2, 0.5], R`\dfrac2{\sqrt{1-x^2}}`, [R`\dfrac1{\sqrt{1-x^2}}`, R`\dfrac{2x}{\sqrt{1-x^2}}`, R`-\dfrac2{\sqrt{1-x^2}}`],
    R`<p>Put $x=\sin\theta$ with $|\theta|<\frac\pi4$: $2\sin\theta\cos\theta=\sin2\theta$, and $2\theta\in(-\frac\pi2,\frac\pi2)$, so $y=2\theta=2\sin^{-1}x$. $y'=\dfrac2{\sqrt{1-x^2}}$.</p>`, 'The range condition makes $\\sin^{-1}(\\sin2\\theta)=2\\theta$.'),
  EF(3, 'inverse trigonometric', R`If $y=\cos^{-1}\!\left(\dfrac{1-x^2}{1+x^2}\right)$ for $x>0$, then $\dfrac{dy}{dx}=$`, (x) => acos((1 - x * x) / (1 + x * x)), (x) => 2 / (1 + x * x), [0.5, 3], R`\dfrac2{1+x^2}`, [R`\dfrac1{1+x^2}`, R`-\dfrac2{1+x^2}`, R`\dfrac{2x}{1+x^2}`],
    R`<p>Put $x=\tan\theta$ ($0<\theta<\frac\pi2$): $\dfrac{1-\tan^2\theta}{1+\tan^2\theta}=\cos2\theta$, $2\theta\in(0,\pi)$. So $y=2\theta=2\tan^{-1}x$ and $y'=\dfrac2{1+x^2}$.</p>`, ''),
  EF(4, 'inverse trigonometric', R`If $y=\tan^{-1}\!\left(\dfrac{3x-x^3}{1-3x^2}\right)$ for $|x|<\frac1{\sqrt3}$, then $\dfrac{dy}{dx}=$`, (x) => atan((3 * x - x ** 3) / (1 - 3 * x * x)), (x) => 3 / (1 + x * x), [0.1, 0.4], R`\dfrac3{1+x^2}`, [R`\dfrac1{1+x^2}`, R`\dfrac{3}{1-x^2}`, R`\dfrac{3x}{1+x^2}`],
    R`<p>With $x=\tan\theta$: $\dfrac{3\tan\theta-\tan^3\theta}{1-3\tan^2\theta}=\tan3\theta$. For $|x|<\frac1{\sqrt3}$, $3\theta\in(-\frac\pi2,\frac\pi2)$, so $y=3\tan^{-1}x$.</p>`, 'The range $|x|<\\frac{1}{\\sqrt3}$ is what makes it $3\\theta$.'),
  EF(4, 'inverse trigonometric', R`If $y=\sin^{-1}(3x-4x^3)$ for $|x|<\frac12$, then $\dfrac{dy}{dx}=$`, (x) => asin(3 * x - 4 * x ** 3), (x) => 3 / sqrt(1 - x * x), [0.1, 0.4], R`\dfrac3{\sqrt{1-x^2}}`, [R`\dfrac1{\sqrt{1-x^2}}`, R`\dfrac{3-12x^2}{\sqrt{1-x^2}}`, R`-\dfrac3{\sqrt{1-x^2}}`],
    R`<p>$x=\sin\theta$: $3\sin\theta-4\sin^3\theta=\sin3\theta$. For $|x|<\frac12$, $3\theta\in(-\frac\pi2,\frac\pi2)$, so $y=3\sin^{-1}x$.</p>`, ''),
  EF(3, 'inverse trigonometric', R`If $y=\tan^{-1}\!\left(\dfrac{2x}{1-x^2}\right)$ for $|x|<1$, then $\dfrac{dy}{dx}=$`, (x) => atan((2 * x) / (1 - x * x)), (x) => 2 / (1 + x * x), [0.3, 0.8], R`\dfrac2{1+x^2}`, [R`\dfrac1{1+x^2}`, R`\dfrac{2}{1-x^2}`, R`\dfrac{2x}{(1-x^2)^2}`],
    R`<p>$x=\tan\theta$: $\tan2\theta$, with $2\theta\in(-\frac\pi2,\frac\pi2)$. So $y=2\tan^{-1}x$.</p>`, ''),
  EF(4, 'inverse trigonometric', R`If $y=\tan^{-1}\!\sqrt{\dfrac{1-\cos x}{1+\cos x}}$ for $0<x<\pi$, then $\dfrac{dy}{dx}=$`, (x) => atan(sqrt((1 - cos(x)) / (1 + cos(x)))), () => 0.5, [0.7, 2], R`\dfrac12`, ['1', R`\dfrac1{2}\sec^2\dfrac x2`, '0'],
    R`<p>$\dfrac{1-\cos x}{1+\cos x}=\tan^2\dfrac x2$, so the root is $\tan\dfrac x2$ (positive for $0<x<\pi$). $y=\dfrac x2$, $y'=\dfrac12$.</p>`, 'Use half-angle identities.'),
  EF(5, 'inverse trigonometric', R`If $y=\cot^{-1}\!\left(\dfrac{\sqrt{1+x}+\sqrt{1-x}}{\sqrt{1+x}-\sqrt{1-x}}\right)$ for $0<x<1$, then $\dfrac{dy}{dx}=$`, (x) => atan((sqrt(1 + x) - sqrt(1 - x)) / (sqrt(1 + x) + sqrt(1 - x))), (x) => -0.5 / sqrt(1 - x * x) * -1, [0.3, 0.6], R`\dfrac1{2\sqrt{1-x^2}}`, [R`-\dfrac1{2\sqrt{1-x^2}}`, R`\dfrac1{\sqrt{1-x^2}}`, R`\dfrac{1}{2(1+x^2)}`],
    R`<p>Put $x=\cos2\theta$: $\sqrt{1+x}=\sqrt2\cos\theta$, $\sqrt{1-x}=\sqrt2\sin\theta$. The fraction is $\dfrac{\cos\theta+\sin\theta}{\cos\theta-\sin\theta}=\tan\left(\dfrac\pi4+\theta\right)$. So $\cot^{-1}$ of it is $\dfrac\pi2-\dfrac\pi4-\theta=\dfrac\pi4-\theta$. Here $\theta=\frac12\cos^{-1}x$, so $y=\dfrac\pi4-\dfrac12\cos^{-1}x$ and $y'=\dfrac1{2\sqrt{1-x^2}}$.</p>`, 'Carefully track the $\\cot^{-1}$: it is $\\frac\\pi2-\\tan^{-1}$.'),

  // ================= functional equations =================
  CK(() => {}, I(3, 'functional equations', R`A differentiable function satisfies $f(x+y)=f(x)+f(y)$ for all real $x,y$, and $f'(0)=5$. Find $f'(3)$.`, 5,
    R`<p>$f'(x)=\lim\dfrac{f(x+h)-f(x)}h=\lim\dfrac{f(h)}h=f'(0)$ (since $f(0)=0$). So $f'$ is the constant $5$, and $f'(3)=5$.</p>`, 'Use the functional equation inside the definition of the derivative.')),
  CK(() => {}, I(3, 'functional equations', R`A function with $f(x+y)=f(x)f(y)$ for all $x,y$ is written near 0 as $f(x)=1+xg(x)$ where $g(x)\to3$ as $x\to0$. Find $\dfrac{f'(2)}{f(2)}$.`, 3,
    R`<p>$f'(2)=\lim\dfrac{f(2+h)-f(2)}h=f(2)\lim\dfrac{f(h)-1}h=f(2)\lim g(h)=3f(2)$. So $\dfrac{f'(2)}{f(2)}=3$.</p>`, 'Factor out $f(2)$.')),
  CK(() => { const f = (x) => 3 * ln(x); need(tolOK(D1(f, 2), 1.5), 'fe3'); }, N(3, 'functional equations', R`A differentiable function on $(0,\infty)$ satisfies $f(xy)=f(x)+f(y)$ and $f'(1)=3$. Find $f'(2)$ (2 decimal places).`, 1.5, 0.01,
    R`<p>$f'(x)=\lim\dfrac{f(x(1+h/x))-f(x)}h=\lim\dfrac{f(1+h/x)}h=\dfrac1xf'(1)$ (using $f(1)=0$). So $f'(x)=\dfrac3x$ and $f'(2)=1.5$. (Indeed $f(x)=3\ln x$.)</p>`, 'The step is $h/x$, not $h$.')),
  CK(() => { const f = (x) => 3 * x + (x * x) / 2; need(tolOK(f(1.3 + 2.1), f(1.3) + f(2.1) + 1.3 * 2.1) && tolOK(D1(f, 4), 7), 'fe4'); }, I(4, 'functional equations', R`A differentiable $f$ satisfies $f(x+y)=f(x)+f(y)+xy$ for all $x,y$, with $f'(0)=3$. Find $f'(4)$.`, 7,
    R`<p>Put $x=y=0$: $f(0)=0$. $f'(x)=\lim\dfrac{f(x+h)-f(x)}h=\lim\dfrac{f(h)+xh}h=f'(0)+x=3+x$. So $f'(4)=7$.</p>`, 'The extra term $xy$ contributes $x$ to the derivative.')),
  CK(() => { const f = (x) => 3 ** x; need(tolOK(D1(f, 1), 3 * ln(3)), 'fe5'); }, N(4, 'functional equations', R`A differentiable function satisfies $f(x+y)=f(x)f(y)$ and $f(1)=3$. Find $f'(1)$ (2 decimal places).`, r4(3 * ln(3)), 0.01,
    R`<p>$f(x)=a^x$ with $a=f(1)=3$. $f'(x)=3^x\ln3$. $f'(1)=3\ln3\approx3.30$. (Or: $f'(x)=f(x)f'(0)$ and $f'(0)=\ln3$.)</p>`, 'The exponential solution is $3^x$, whose derivative has $\\ln3$.')),
  CK(() => {}, I(4, 'functional equations', R`A function satisfies $|f(x)-f(y)|\le(x-y)^2$ for all real $x,y$ and $f(0)=4$. Find $f(5)$.`, 4,
    R`<p>$\left|\dfrac{f(x+h)-f(x)}h\right|\le|h|\to0$, so $f'(x)=0$ for all $x$. Hence $f$ is constant: $f(5)=f(0)=4$.</p>`, 'A squared bound on the difference forces the derivative to be 0.')),
  CK(() => { const f = (x) => 2 * x; need(tolOK(f(3 + 4), f(3) + f(4)), 'fe7'); }, I(3, 'functional equations', R`A continuous function satisfies $f(x+y)=f(x)+f(y)$ and $f(1)=2$. Find $f(7)$.`, 14,
    R`<p>A continuous additive function is $f(x)=cx$ with $c=f(1)=2$. $f(7)=14$.</p>`, 'Continuity ensures there are no wild additive solutions.')),
);

const groups = {
  m1: {
    title: 'Match: behaviour at x = 0',
    passage: R`<p>Match each function in List I (at $x=0$; $[x]$ is the greatest integer) with its behaviour in List II.</p>`,
    list1: [R`A. $f(x)=|x|$`, R`B. $f(x)=x|x|$`, R`C. $f(x)=[x]$`, R`D. $f(x)=x+x|x|$`],
    list2: ['p. continuous but not differentiable', R`q. differentiable with $f'(0)=0$`, 'r. discontinuous', R`s. differentiable with $f'(0)=1$`],
  },
  m2: {
    title: 'Match: functions and their derivatives',
    passage: R`<p>Match each function in List I with its derivative in List II (on a suitable interval).</p>`,
    list1: [R`A. $x^x$`, R`B. $\ln(\sec x+\tan x)$`, R`C. $\sin^{-1}\!\left(2x\sqrt{1-x^2}\right)$, $|x|<\frac1{\sqrt2}$`, R`D. $\tan^{-1}\!\dfrac{\sqrt{1+x^2}-1}{x}$`],
    list2: [R`p. $x^x(1+\ln x)$`, R`q. $\sec x$`, R`r. $\dfrac2{\sqrt{1-x^2}}$`, R`s. $\dfrac1{2(1+x^2)}$`],
  },
  m3: {
    title: 'Match: types of discontinuity',
    passage: R`<p>Match each function and point in List I with the type of discontinuity in List II.</p>`,
    list1: [R`A. $\dfrac{x^2-1}{x-1}$ at $x=1$`, R`B. $\dfrac1{x-2}$ at $x=2$`, R`C. $[x]$ at $x=3$`, R`D. $\sin\dfrac1x$ at $x=0$`],
    list2: ['p. removable', 'q. infinite', 'r. jump', 's. oscillating'],
  },
  m4: {
    title: 'Match: second derivatives at x = 1',
    passage: R`<p>Match each function in List I with the value of $f''(1)$ in List II.</p>`,
    list1: [R`A. $x^4$`, R`B. $\ln x$`, R`C. $x^3$`, R`D. $\dfrac1x$`],
    list2: ['p. 12', 'q. -1', 'r. 6', 's. 2'],
  },
  p1: {
    title: 'Passage: making a function differentiable',
    passage: R`<p>Let $f(x)=\begin{cases}x^2,&x\le1\\ax+b,&x>1\end{cases}$, where $a$ and $b$ are constants.</p>`,
  },
  p2: {
    title: 'Passage: a curve given by a parameter',
    passage: R`<p>A curve is given by $x=t^2+1$, $y=t^3-3t$ for $t>0$.</p>`,
  },
  p3: {
    title: 'Passage: how smooth is |x|^3?',
    passage: R`<p>Let $f(x)=|x|^3$. For $x>0$, $f(x)=x^3$; for $x<0$, $f(x)=-x^3$.</p>`,
  },
  p4: {
    title: 'Passage: a functional equation',
    passage: R`<p>A differentiable function $f:\mathbb R\to\mathbb R$ satisfies $f(x+y)=f(x)+f(y)+2xy$ for all real $x,y$, and $f'(0)=1$.</p>`,
  },
};

items.push(
  // ---------- assertion / reason ----------
  A(2, 'differentiability', R`Every differentiable function is continuous.`, R`Every continuous function is differentiable.`, 2,
    R`<p>A is true. R is false: $|x|$ is continuous at $0$ but not differentiable.</p>`, 'The converse fails.'),
  A(2, 'differentiability', R`$f(x)=|x|$ is not differentiable at $x=0$.`, R`The left-hand derivative of $|x|$ at 0 is $-1$ and the right-hand derivative is $+1$.`, 0,
    R`<p>R is true and gives exactly the reason: differentiability needs equal one-sided derivatives.</p>`, ''),
  A(3, 'differentiability', R`$f(x)=[x]$ is not differentiable at $x=2$.`, R`$[x]$ is discontinuous at $x=2$.`, 0,
    R`<p>Differentiable implies continuous, so a discontinuity rules out differentiability. R explains A.</p>`, ''),
  A(3, 'differentiability', R`The function $f(x)=x^2\sin\frac1x$, $f(0)=0$, has a continuous derivative at $x=0$.`, R`$f'(0)=0$ by the definition of the derivative.`, 3,
    R`<p>R is true ($\frac{h^2\sin(1/h)}h\to0$). A is false: for $x\ne0$, $f'(x)=2x\sin\frac1x-\cos\frac1x$, which has no limit at $0$. So $f'$ is not continuous at 0 even though $f'(0)$ exists.</p>`, ''),
  A(3, 'logarithmic differentiation', R`$\dfrac{d}{dx}\left(x^x\right)=x\cdot x^{x-1}=x^x$.`, R`The power rule $\dfrac{d}{dx}x^n=nx^{n-1}$ holds when $n$ is a constant.`, 3,
    R`<p>R is true. A is false because the exponent is the variable $x$, not a constant. The correct derivative is $x^x(1+\ln x)$.</p>`, 'Variable exponent: take logs.'),
  A(4, 'differentiability', R`If $f$ and $g$ are both non-differentiable at $x=a$, then $f+g$ is non-differentiable at $x=a$.`, R`The sum of two non-differentiable functions can be differentiable.`, 3,
    R`<p>R is true: $f(x)=|x|$ and $g(x)=-|x|$ have sum $0$. So A, which says the sum is always non-differentiable, is false.</p>`, 'One counter-example kills a "must" claim.'),
  A(3, 'inverse trigonometric', R`If $y=\sin^{-1}\left(2x\sqrt{1-x^2}\right)$, then $\dfrac{dy}{dx}=\dfrac2{\sqrt{1-x^2}}$ for all $x\in(-1,1)$.`, R`$\sin^{-1}(\sin2\theta)=2\theta$ only when $-\frac\pi4\le\theta\le\frac\pi4$.`, 3,
    R`<p>R is true. Putting $x=\sin\theta$, the simplification $y=2\theta$ is valid only for $|x|\le\frac1{\sqrt2}$. For $\frac1{\sqrt2}<x<1$, $y=\pi-2\theta$ and $\frac{dy}{dx}=-\frac2{\sqrt{1-x^2}}$. So A is false.</p>`, 'The domain of validity matters.'),
  A(4, 'differentiability', R`$f(x)=|x|+|x-1|$ is continuous everywhere but not differentiable at exactly two points.`, R`A sum of continuous functions is continuous, and each absolute value term contributes one corner.`, 0,
    R`<p>The corners are at $0$ and $1$, in different places, so neither is cancelled. R explains both halves of A.</p>`, ''),
  A(4, 'differentiability', R`If $f$ is differentiable at $x=a$, then $|f|$ is differentiable at $x=a$.`, R`$|f|$ is differentiable at every point $a$ where $f$ is differentiable and $f(a)\ne0$.`, 3,
    R`<p>R is true: near $a$, $|f|$ equals $f$ or $-f$ with no switching. A is false at points where $f(a)=0$: $f(x)=x$ is differentiable at 0 but $|x|$ is not.</p>`, 'Check the points where $f=0$.'),
  A(3, 'differentiability', R`If $\displaystyle\lim_{h\to0}\dfrac{f(a+h)-f(a)}h$ exists, then $f$ is continuous at $x=a$.`, R`Every differentiable function is continuous.`, 0,
    R`<p>The limit is exactly $f'(a)$, so the first statement says $f$ is differentiable at $a$. R then gives continuity.</p>`, ''),

  // ---------- statements ----------
  S(2, 'continuity and differentiability', R`$f(x)=|x|$ is continuous at $x=0$.`, R`$f(x)=|x|$ is differentiable at $x=0$.`, 1,
    R`<p>I is true. II is false: the one-sided derivatives are $-1$ and $1$.</p>`, ''),
  S(3, 'differentiability', R`$f(x)=x|x|$ is differentiable at $x=0$.`, R`$f(x)=|x|$ is differentiable at $x=0$.`, 1,
    R`<p>For $x|x|$: $\frac{h|h|}h=|h|\to0$, so I is true. II is false.</p>`, ''),
  S(3, 'inverse trigonometric', R`The derivative of $\sin^{-1}x$ is $\dfrac1{\sqrt{1-x^2}}$ at $x=1$.`, R`$\sin^{-1}x$ is continuous at $x=1$.`, 2,
    R`<p>At $x=1$ the formula divides by $0$: the tangent is vertical and the derivative does not exist (I false). The function is continuous on $[-1,1]$ (II true).</p>`, 'A formula can be not defined at an endpoint.'),
  S(4, 'continuity', R`$f(x)=[x]+|x|$ is continuous at $x=0$.`, R`$f(x)=|x|$ is continuous everywhere.`, 2,
    R`<p>For $[x]+|x|$: left limit at $0$ is $-1+0=-1$; right limit is $0+0=0$. Discontinuous: I false. II is true.</p>`, ''),
  S(3, 'derivatives', R`$\dfrac{d}{dx}\ln|x|=\dfrac1x$ for $x\ne0$.`, R`$\dfrac{d}{dx}\ln x=\dfrac1x$ for $x>0$.`, 0,
    R`<p>For $x<0$, $\ln|x|=\ln(-x)$ with derivative $\frac{-1}{-x}=\frac1x$. Both true.</p>`, ''),
  S(4, 'differentiability', R`If $f'$ exists at every point of an interval, then $f'$ is continuous on that interval.`, R`$f(x)=x^2\sin\frac1x$ ($f(0)=0$) has a derivative at every real number.`, 2,
    R`<p>II is true ($f'(0)=0$ and the usual formula elsewhere). But $f'$ is not continuous at $0$, which shows I is false.</p>`, ''),
  S(3, 'logarithmic differentiation', R`$\dfrac{d}{dx}(x+1)^x=x(x+1)^{x-1}$.`, R`Logarithmic differentiation is the method for functions with a variable exponent.`, 2,
    R`<p>I is false: $y=(x+1)^x$ gives $\frac{y'}y=\ln(x+1)+\frac x{x+1}$. II is true.</p>`, ''),
  SC(3, 'continuity and differentiability', [R`$|x|$ is continuous at $0$.`, R`$|x|$ is differentiable at $0$.`, R`$x|x|$ is differentiable at $0$.`, R`$[x]$ is differentiable at $x=0.5$.`], '3', ['1', '2', '4'],
    R`<p>(a) true. (b) false. (c) true ($\frac{h|h|}h\to0$). (d) true: $[x]=0$ near $0.5$, so the derivative is $0$. Three are correct.</p>`, ''),
  SC(4, 'differentiability', [R`$|\sin x|$ is not differentiable at $x=0$.`, R`$\sin|x|$ is differentiable at $x=0$.`, R`$|x|^3$ is differentiable at $x=0$.`, R`$x^{1/3}$ is differentiable at $x=0$.`], '2', ['1', '3', '4'],
    R`<p>(a) true: corner at 0. (b) false: right slope $1$, left slope $-1$. (c) true. (d) false: vertical tangent. Two are correct.</p>`, ''),
  SC(3, 'derivatives', [R`$\dfrac d{dx}e^{x^2}=2xe^{x^2}$`, R`$\dfrac d{dx}\ln(\sin x)=\cot x$`, R`$\dfrac d{dx}x^x=x^x(1+\ln x)$`, R`$\dfrac d{dx}\tan^{-1}x=\dfrac1{1-x^2}$`], '3', ['1', '2', '4'],
    R`<p>(a), (b), (c) are correct. (d) is wrong: the derivative of $\tan^{-1}x$ is $\frac1{1+x^2}$.</p>`, ''),

  // ---------- multi ----------
  X(3, 'differentiability', R`Which of the following functions are differentiable at $x=0$? (Take $f(0)=0$ where needed.)`, [R`$x|x|$`, R`$|x|\sin x$`, R`$|x|\cos x$`, R`$x^2\sin\dfrac1x$`], [0, 1, 3],
    R`<p>(a) yes. (b) $\frac{|h|\sin h}h\to0$: yes. (c) right slope $1$, left slope $-1$: no. (d) yes, $f'(0)=0$. So (a), (b), (d).</p>`, ''),
  X(4, 'differentiability', R`Which functions are continuous but not differentiable at $x=0$?`, [R`$|x|$`, R`$x^{1/3}$`, R`$\sin|x|$`, R`$x^2$`], [0, 1, 2],
    R`<p>(a) corner. (b) vertical tangent. (c) right slope $1$, left slope $-1$. (d) differentiable. So (a), (b), (c).</p>`, ''),
  X(4, 'continuity', R`Which of the following functions are discontinuous at $x=1$?`, [R`$[x]$`, R`$\dfrac{x^2-1}{x-1}$ (not defined at 1)`, R`$|x-1|$`, R`$\dfrac1{x-1}$`], [0, 1, 3],
    R`<p>(a) jump at every integer. (b) not defined at $1$, so not continuous there. (c) continuous. (d) infinite discontinuity. So (a), (b), (d).</p>`, ''),
  X(3, 'derivatives', R`Which of the following derivatives are correct?`, [R`$\dfrac d{dx}\sin^{-1}x=\dfrac1{\sqrt{1-x^2}}$`, R`$\dfrac d{dx}\tan^{-1}x=\dfrac1{1+x^2}$`, R`$\dfrac d{dx}\cos^{-1}x=\dfrac1{\sqrt{1-x^2}}$`, R`$\dfrac d{dx}\sec x=\sec x\tan x$`], [0, 1, 3],
    R`<p>(c) is wrong: $\frac d{dx}\cos^{-1}x=-\frac1{\sqrt{1-x^2}}$. The others are right.</p>`, ''),
  X(4, 'counting points of non-differentiability', R`The function $f(x)=\left|x^2-4x+3\right|$ is not differentiable at`, [R`$x=1$`, R`$x=2$`, R`$x=3$`, R`$x=0$`], [0, 2],
    R`<p>$x^2-4x+3=(x-1)(x-3)$ changes sign at $1$ and $3$ with non-zero slope. At $x=2$ (the vertex) it is negative but smooth, so $|\cdot|$ is smooth there.</p>`, 'The vertex is not a root.'),
  X(4, 'differentiability', R`For $f(x)=x|x|$, which of the following are true?`, [R`$f'(0)=0$`, R`$f''(0)$ exists`, R`$f$ is continuous`, R`$f'(x)=2|x|$ for all $x$`], [0, 2, 3],
    R`<p>$f'(x)=2|x|$ for all $x$ (including 0: $f'(0)=0$). $f'(x)=2|x|$ has a corner at 0, so $f''(0)$ does not exist. $f$ is continuous. So (a), (c), (d).</p>`, ''),
  X(5, 'differentiability', R`For $f(x)=|x|^3$, which statements are true?`, [R`$f'(0)=0$`, R`$f''(0)=0$`, R`$f'''(0)$ exists`, R`$f''(x)=6|x|$ for all $x$`], [0, 1, 3],
    R`<p>$f'(x)=3x|x|$, $f''(x)=6|x|$ (so $f''(0)=0$), and $f''$ has a corner at 0, so $f'''(0)$ does not exist.</p>`, ''),
  X(4, 'parametric derivatives', R`For the curve $x=t^2$, $y=t^3$ ($t\ne0$), which are true?`, [R`$\dfrac{dy}{dx}=\dfrac{3t}2$`, R`$\dfrac{dy}{dx}\to0$ as $t\to0$`, R`$\dfrac{d^2y}{dx^2}=\dfrac3{4t}$`, R`$\dfrac{dy}{dx}=\dfrac{2t}3$`], [0, 1, 2],
    R`<p>$\frac{dy}{dx}=\frac{3t^2}{2t}=\frac{3t}2$ (a) and it tends to 0 as $t\to0$ (b). $\frac{d^2y}{dx^2}=\frac{3/2}{2t}=\frac3{4t}$ (c). (d) is the inverted ratio.</p>`, ''),

  // ---------- match ----------
  MT(3, 'continuity and differentiability', 'm1', R`Choose the correct matching.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
    R`<p>A: $|x|$ has a corner: (p). B: $x|x|$ is smooth with slope 0: (q). C: $[x]$ jumps at 0: (r). D: $\frac{h+h|h|}h\to1$: (s).</p>`, ''),
  MT(4, 'derivatives', 'm2', R`Choose the correct matching.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    R`<p>A: $x^x(1+\ln x)$ (p). B: $\sec x$ (q). C: $\frac2{\sqrt{1-x^2}}$ (r). D: $\frac1{2(1+x^2)}$ (s).</p>`, ''),
  MT(3, 'types of discontinuity', 'm3', R`Choose the correct matching.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
    R`<p>A removable, B infinite, C jump, D oscillating.</p>`, ''),
  MT(3, 'second derivative', 'm4', R`Choose the correct matching.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
    R`<p>$(x^4)''=12x^2\to12$; $(\ln x)''=-\frac1{x^2}\to-1$; $(x^3)''=6x\to6$; $(\frac1x)''=\frac2{x^3}\to2$.</p>`, ''),

  // ---------- passages ----------
  PI(3, 'finding constants', 'p1', R`For $f$ to be continuous at $x=1$, find $a+b$.`, 1,
    R`<p>Left value $1^2=1$; right limit $a+b$. So $a+b=1$.</p>`, ''),
  PI(3, 'finding constants', 'p1', R`For $f$ to be differentiable at $x=1$, find $a$.`, 2,
    R`<p>Left slope $2x=2$ at $1$; right slope $a$. So $a=2$.</p>`, ''),
  PI(3, 'finding constants', 'p1', R`For $f$ to be differentiable at $x=1$, find $b$.`, -1,
    R`<p>From $a+b=1$ and $a=2$: $b=-1$.</p>`, 'Use the continuity condition after finding $a$.'),
  CK(() => { cPar('p2', (t) => t * t + 1, (t) => t ** 3 - 3 * t, 1, 0); }, PI(3, 'parametric derivatives', 'p2', R`Find $\dfrac{dy}{dx}$ at $t=1$.`, 0,
    R`<p>$\dfrac{dy}{dx}=\dfrac{3t^2-3}{2t}$. At $t=1$: $0$ (a horizontal tangent).</p>`, '')),
  CK(() => { cPar('p2', (t) => t * t + 1, (t) => t ** 3 - 3 * t, 2, 2.25); }, PN(3, 'parametric derivatives', 'p2', R`Find $\dfrac{dy}{dx}$ at $t=2$ (2 decimal places).`, 2.25, 0.01,
    R`<p>$\dfrac{3\cdot4-3}{4}=\dfrac94=2.25$.</p>`, '')),
  CK(() => { cPar2('p2', (t) => t * t + 1, (t) => t ** 3 - 3 * t, 2, 0.46875); }, PN(4, 'parametric derivatives', 'p2', R`Find $\dfrac{d^2y}{dx^2}$ at $t=2$ (2 decimal places).`, 0.4688, 0.01,
    R`<p>$\dfrac{dy}{dx}=\dfrac{3t}2-\dfrac3{2t}$. $\dfrac{d}{dt}=\dfrac32+\dfrac3{2t^2}$. Divide by $\dfrac{dx}{dt}=2t$: at $t=2$: $\dfrac{1.5+0.375}{4}=0.46875\approx0.47$.</p>`, '')),
  PI(3, 'differentiability', 'p3', R`Find $f'(0)$.`, 0, R`<p>$\dfrac{|h|^3}h=h|h|\to0$ from both sides.</p>`, ''),
  PI(4, 'differentiability', 'p3', R`Find $f''(0)$.`, 0, R`<p>$f'(x)=3x|x|$. Then $\dfrac{f'(h)-f'(0)}h=3|h|\to0$. So $f''(0)=0$.</p>`, ''),
  PI(4, 'differentiability', 'p3', R`What is the largest integer $n$ for which $f^{(n)}(0)$ exists?`, 2, R`<p>$f''(x)=6|x|$ has a corner at $0$, so $f'''(0)$ does not exist. Hence $n=2$.</p>`, 'Each derivative of $|x|^3$ loses one order of smoothness.'),
  PI(4, 'functional equations', 'p4', R`Find $f'(3)$.`, 7, R`<p>$f(0)=0$. $f'(x)=\lim\dfrac{f(h)+2xh}h=f'(0)+2x=1+2x$. So $f'(3)=7$.</p>`, 'The extra term is $2xy$ so the derivative gains $2x$.'),
  PI(4, 'functional equations', 'p4', R`Find $f(3)$.`, 12, R`<p>$f'(x)=1+2x$ and $f(0)=0$, so $f(x)=x+x^2$. $f(3)=12$.</p>`, ''),
  PI(4, 'functional equations', 'p4', R`Find $f(5)-f(4)$.`, 10, R`<p>$f(5)=30$, $f(4)=20$. Difference $10$. (Check: $f(5)=f(4)+f(1)+8=20+2+8=30$.)</p>`, ''),
);

items.push(
  // ---------- extra L1 ----------
  DI(1, 'derivative at a point', R`If $f(x)=x^2$, find $f'(3)$.`, (x) => x * x, 3, 6, R`<p>$f'(x)=2x$. At $3$: $6$.</p>`, ''),
  EF(1, 'standard derivatives', R`If $y=x^5$, then $\dfrac{dy}{dx}=$`, (x) => x ** 5, (x) => 5 * x ** 4, [0.5, 2], R`5x^4`, [R`x^4`, R`5x^5`, R`4x^5`],
    R`<p>Power rule: bring the power down and reduce it by one.</p>`, ''),
  EF(1, 'standard derivatives', R`If $y=\ln x$ ($x>0$), then $\dfrac{dy}{dx}=$`, (x) => ln(x), (x) => 1 / x, [0.5, 3], R`\dfrac1x`, [R`x`, R`\ln x`, R`e^x`],
    R`<p>The derivative of the natural logarithm is $\frac1x$.</p>`, ''),
  DI(1, 'derivative at a point', R`If $f(x)=3x+5$, find $f'(2)$.`, (x) => 3 * x + 5, 2, 3, R`<p>A straight line has constant slope: $f'(x)=3$.</p>`, ''),
  KI(1, 'continuity at a point', R`$f(x)=\dfrac{x^2-1}{x-1}$ for $x\ne1$ and $f(1)=k$. For $f$ to be continuous at $1$, $k=$`, (x) => (x === 1 ? 2 : (x * x - 1) / (x - 1)), 1, 2, R`<p>$\dfrac{x^2-1}{x-1}=x+1\to2$.</p>`, ''),
  M(1, 'definition', R`The derivative $f'(a)$ is defined as`, R`$\displaystyle\lim_{h\to0}\dfrac{f(a+h)-f(a)}h$`, [R`$\displaystyle\lim_{h\to0}\dfrac{f(a+h)+f(a)}h$`, R`$\displaystyle\lim_{h\to0}\left(f(a+h)-f(a)\right)$`, R`$\displaystyle\lim_{h\to0}\dfrac{f(h)-f(a)}{h}$`],
    R`<p>The derivative is the limit of the slope of the chord from $a$ to $a+h$.</p>`, 'The numerator is a difference; the denominator is $h$.'),
  DM(1, 'derivative at a point', R`If $f(x)=e^x$, then $f'(0)=$`, (x) => exp(x), 0, 1, '1', ['0', e, R`\dfrac1e`], R`<p>$f'(x)=e^x$, so $f'(0)=e^0=1$.</p>`, ''),
  M(1, 'continuity everywhere', R`The function $f(x)=\dfrac1x$ is discontinuous at`, '$x=0$ only', ['every real number', 'no real number', '$x=1$'],
    R`<p>It is not defined at $x=0$ and is continuous at every other real number.</p>`, ''),
  DI(1, 'derivative at a point', R`If $f(x)=\sin x$, find $f'(0)$.`, (x) => sin(x), 0, 1, R`<p>$f'(x)=\cos x$, so $f'(0)=1$.</p>`, ''),
  DM(1, 'derivative at a point', R`If $f(x)=\sqrt x$, then $f'(4)=$`, (x) => sqrt(x), 4, 0.25, R`\dfrac14`, ['2', R`\dfrac12`, '4'], R`<p>$f'(x)=\dfrac1{2\sqrt x}$. At $4$: $\dfrac1{4}$.</p>`, 'The 2 is in the denominator.'),

  // ---------- extra L2 ----------
  EF(2, 'chain rule', R`If $y=\cos5x$, then $\dfrac{dy}{dx}=$`, (x) => cos(5 * x), (x) => -5 * sin(5 * x), [0.2, 0.7], R`-5\sin5x`, [R`5\sin5x`, R`-\sin5x`, R`-5\cos5x`],
    R`<p>$\dfrac d{dx}\cos u=-\sin u\cdot u'$ with $u'=5$.</p>`, 'Keep the minus sign.'),
  EF(2, 'product rule', R`If $y=x\sin x$, then $\dfrac{dy}{dx}=$`, (x) => x * sin(x), (x) => sin(x) + x * cos(x), [0.5, 1.5], R`\sin x+x\cos x`, [R`\cos x`, R`x\cos x`, R`\sin x-x\cos x`],
    R`<p>Product rule: $1\cdot\sin x+x\cos x$.</p>`, ''),
  EF(2, 'quotient rule', R`If $y=\dfrac{e^x}x$, then $\dfrac{dy}{dx}=$`, (x) => exp(x) / x, (x) => (exp(x) * (x - 1)) / (x * x), [1.5, 3], R`\dfrac{e^x(x-1)}{x^2}`, [R`\dfrac{e^x}{x^2}`, R`\dfrac{e^x(x+1)}{x^2}`, R`\dfrac{e^x}{1}`],
    R`<p>$\dfrac{e^x\cdot x-e^x\cdot1}{x^2}=\dfrac{e^x(x-1)}{x^2}$.</p>`, ''),
  DI(2, 'derivative at a point', R`If $f(x)=x\ln x$, find $f'(e)$.`, (x) => x * ln(x), E_, 2, R`<p>$f'(x)=\ln x+1$. At $e$: $2$.</p>`, ''),
  KM(2, 'continuity at a point', R`$f(x)=\dfrac{\sin5x}{3x}$ ($x\ne0$) is continuous at $0$ if $f(0)=$`, (x) => (x === 0 ? 5 / 3 : sin(5 * x) / (3 * x)), 0, R`\dfrac53`, [R`\dfrac35`, '5', '1'], R`<p>$\dfrac{\sin5x}{3x}=\dfrac53\cdot\dfrac{\sin5x}{5x}\to\dfrac53$.</p>`, ''),
  SI(2, 'second derivative', R`If $f(x)=x^5$, find $f''(1)$.`, (x) => x ** 5, 1, 20, R`<p>$f'=5x^4$, $f''=20x^3$. At $1$: $20$.</p>`, ''),
  CK(() => cPar('x=3t,y=t2', (t) => 3 * t, (t) => t * t, 3, 2), I(2, 'parametric derivatives', R`If $x=3t$ and $y=t^2$, find $\dfrac{dy}{dx}$ at $t=3$.`, 2, R`<p>$\dfrac{dy}{dx}=\dfrac{2t}3$. At $t=3$: $2$.</p>`, '')),
  CK(() => cIm('x2+y2=13', (x, y) => x * x + y * y - 13, 2, 3, -2 / 3), M(2, 'implicit differentiation', R`For $x^2+y^2=13$, $\dfrac{dy}{dx}$ at $(2,3)$ equals`, R`$-\dfrac23$`, [R`$\dfrac23$`, R`$-\dfrac32$`, R`$\dfrac32$`], R`<p>$y'=-\dfrac xy=-\dfrac23$.</p>`, '')),

  // ---------- extra L4 / L5 ----------
  CK(() => { const f = (n) => (x) => n * (x ** (1 / n) - 1); need(tolOK(D1(f(100000), 2, 1e-3), 0.5, 5e-3), 'u'); }, N(4, 'limit-defined function', R`Let $f(x)=\displaystyle\lim_{n\to\infty}n\left(x^{1/n}-1\right)$ for $x>0$. Find $f'(2)$ (2 decimal places).`, 0.5, 0.01,
    R`<p>$\lim n\left(x^{1/n}-1\right)=\ln x$ (standard limit with $t=\frac1n$). So $f(x)=\ln x$ and $f'(2)=\dfrac12=0.50$.</p>`, 'First find $f(x)$ in closed form.')),
  CK(() => { }, I(5, 'differentiability', R`Let $f(x)=x^4\sin\dfrac1x$ for $x\ne0$ and $f(0)=0$. What is the largest integer $n$ such that $f^{(n)}(0)$ exists?`, 2,
    R`<p>$f'(0)=\lim h^3\sin\frac1h=0$. For $x\ne0$: $f'(x)=4x^3\sin\frac1x-x^2\cos\frac1x$. $f''(0)=\lim\dfrac{f'(h)}h=\lim\left(4h^2\sin\frac1h-h\cos\frac1h\right)=0$. For $x\ne0$: $f''(x)=12x^2\sin\frac1x-6x\cos\frac1x-\sin\frac1x$. $f'''(0)=\lim\dfrac{f''(h)}h=\lim\left(12h\sin\frac1h-6\cos\frac1h-\dfrac{\sin(1/h)}h\right)$, which does not exist. So $n=2$.</p>`, 'Each derivative at 0 uses the next formula divided by $h$.')),
  DI(5, 'logarithmic differentiation', R`If $y=x^{x^x}$ for $x>0$, find $\dfrac{dy}{dx}$ at $x=1$.`, (x) => x ** (x ** x), 1, 1,
    R`<p>$\ln y=x^x\ln x$. Differentiate: $\dfrac{y'}y=x^x(1+\ln x)\ln x+x^x\cdot\dfrac1x$. At $x=1$: $x^x=1$, $\ln1=0$: $\dfrac{y'}y=0+1=1$. Also $y(1)=1$. So $y'(1)=1$.</p>`, 'At $x=1$ the log terms vanish.'),
  DN(5, 'inverse trigonometric', R`If $y=\sin^{-1}\!\left(2x\sqrt{1-x^2}\right)$, find $\dfrac{dy}{dx}$ at $x=0.8$.`, (x) => asin(2 * x * sqrt(1 - x * x)), 0.8, -2 / 0.6,
    R`<p>For $x=\sin\theta$ with $\frac\pi4<\theta<\frac\pi2$: $2\theta\in(\frac\pi2,\pi)$, and $\sin^{-1}(\sin2\theta)=\pi-2\theta$. So $y=\pi-2\sin^{-1}x$ and $y'=-\dfrac2{\sqrt{1-x^2}}$. At $x=0.8$: $-\dfrac2{0.6}\approx-3.33$.</p>`, 'The branch changes after $x=\\frac1{\\sqrt2}$.'),
  DI(5, 'inverse trigonometric', R`If $y=\cos^{-1}\!\left(\dfrac{1-x^2}{1+x^2}\right)$ for $x<0$, find $\dfrac{dy}{dx}$ at $x=-1$.`, (x) => acos((1 - x * x) / (1 + x * x)), -1, -1,
    R`<p>With $x=\tan\theta$, $\theta\in(-\frac\pi2,0)$: $\cos^{-1}(\cos2\theta)=|2\theta|=-2\theta$. So $y=-2\tan^{-1}x$ and $y'=-\dfrac2{1+x^2}$. At $x=-1$: $-1$.</p>`, 'For $x<0$ the sign flips compared with $x>0$.'),
  DN(5, 'inverse trigonometric', R`If $y=\tan^{-1}\!\left(\dfrac{3x-x^3}{1-3x^2}\right)$, find $\dfrac{dy}{dx}$ at $x=1$.`, (x) => atan((3 * x - x ** 3) / (1 - 3 * x * x)), 1, 1.5,
    R`<p>Here $x=\tan\theta$ with $\theta=\frac\pi4$, so $3\theta=\frac{3\pi}4$ is outside the principal range. $y=3\tan^{-1}x-\pi$ (a constant shift), so $y'=\dfrac3{1+x^2}$. At $x=1$: $\dfrac32=1.5$.</p>`, 'A change of branch only adds a constant, so the derivative formula stays.'),
  DI(5, 'logarithmic differentiation', R`Let $y=(\sin x)^{\cos x}+(\cos x)^{\sin x}$. Find $\dfrac{dy}{dx}$ at $x=\dfrac\pi4$.`, (x) => sin(x) ** cos(x) + cos(x) ** sin(x), PI_ / 4, 0,
    R`<p>Let $s=\sin\frac\pi4=\cos\frac\pi4=\frac1{\sqrt2}$. For $y_1=(\sin x)^{\cos x}$: $\dfrac{y_1'}{y_1}=-\sin x\ln\sin x+\dfrac{\cos^2x}{\sin x}=-s\ln s+s$. For $y_2=(\cos x)^{\sin x}$: $\dfrac{y_2'}{y_2}=\cos x\ln\cos x-\dfrac{\sin^2x}{\cos x}=s\ln s-s$. Also $y_1=y_2=s^s$. So $y_1'+y_2'=s^s\left[(-s\ln s+s)+(s\ln s-s)\right]=0$.</p>`, 'The two terms are mirror images, so they cancel at $\\frac\\pi4$.'),
  CK(() => need(kinkCount((x) => abs(abs(abs(x) - 2) - 1), -5, 5) === 7, 'nested abs'), I(5, 'counting points of non-differentiability', R`The number of points at which $f(x)=\Big|\,\big||x|-2\big|-1\Big|$ is not differentiable is`, 7,
    R`<p>Corners appear where an inner expression is zero. $|x|=0$ at $x=0$. $\big||x|-2\big|$ has corners where $|x|=2$, so $x=\pm2$. The outer modulus has corners where $\big||x|-2\big|=1$, i.e. $|x|=3$ or $|x|=1$, so $x=\pm3,\pm1$. All seven points $0,\pm1,\pm2,\pm3$ are distinct corners.</p>`, 'Count each layer of modulus separately and check no corners cancel.')),
  CK(() => { const g = (x) => cos(x) ** 400; need(g(0) === 1 && g(PI_) > 0.999999 && g(1) < 1e-6 && g(2) < 1e-6, 'cos^2n'); }, I(5, 'limit-defined function', R`Let $f(x)=\displaystyle\lim_{n\to\infty}(\cos x)^{2n}$. The number of points of discontinuity of $f$ in the open interval $(-2\pi,2\pi)$ is`, 3,
    R`<p>If $|\cos x|<1$, $(\cos x)^{2n}\to0$. If $|\cos x|=1$, i.e. $x=k\pi$, the value is $1$. So $f=0$ except $f=1$ at $x=k\pi$. At each $k\pi$ the limit is $0\ne1$: a (removable) discontinuity. In $(-2\pi,2\pi)$ the multiples of $\pi$ are $-\pi,0,\pi$: three points.</p>`, 'The end points $\\pm2\\pi$ are excluded.')),
  CK(() => { need(jumpCount((x) => x * fl(x), -2, 3) === 3, 'x[x] jumps'); cNoDiff('x[x]@0', (x) => x * fl(x), 0); }, I(5, 'counting points of non-differentiability', R`The number of points in $(-2,3)$ at which $f(x)=x[x]$ is not differentiable is`, 4,
    R`<p>At the integers $-1,1,2$ the function jumps (left and right limits differ), so it is not differentiable there. At $x=0$ it is continuous but has a corner: for small $x<0$, $f(x)=-x$ (slope $-1$); for $0\le x<1$, $f(x)=0$ (slope $0$). Non-differentiable at $-1,0,1,2$: four points.</p>`, 'Continuity at 0 is not enough: the slopes differ.')),
);

// ================= templates =================
const OP = (rng, c, ws) => shuffleOpts(rng, W(c), ws.map(W));
const near = (v, exp, t = 4e-3) => Math.abs(v - exp) <= t * Math.max(1, Math.abs(exp));
const idx = (p, v, exp, correct) => (near(v, exp) ? p.options.indexOf(W(correct)) : -1);
const xr = (r) => (r === 0 ? 'x' : r > 0 ? `x-${r}` : `x+${-r}`);
const px = (a, n) => (n === 1 ? (a === 1 ? 'x' : `${a}x`) : a === 1 ? `x^${n}` : `${a}x^${n}`);

const gens = [
  // c01 (L1): derivative at a point
  gen('cd-g01', 1, 'nat', 'integer', 'derivative at a point', (rng) => {
    const kind = int(rng, 0, 3);
    if (kind === 0) {
      const a = int(rng, 1, 4), b = choose(rng, [-3, -2, -1, 1, 2, 3, 4]), c = choose(rng, [-4, -3, -2, -1, 1, 2, 3, 5]), x0 = int(rng, 1, 3);
      const ans = 3 * a * x0 * x0 + 2 * b * x0 + c;
      return { kind, a, b, c, x0, answer: ans, tol: 0, q: R`If $f(x)=${co(a)}x^3${sgn(b)}x^2${sgn(c)}x$, find $f'(${x0})$.`, sol: R`<p>$f'(x)=${3 * a}x^2${sgn(2 * b)}x${sgn(c)}$. At $x=${x0}$: $${3 * a * x0 * x0}${sgn(2 * b * x0)}${sgn(c)}=${ans}$.</p>` };
    }
    if (kind === 1) {
      const a = int(rng, 2, 6), n = int(rng, 2, 4), b = int(rng, 1, 5), x0 = int(rng, 0, 2); const ans = n * a * (a * x0 + b) ** (n - 1);
      return { kind, a, n, b, x0, answer: ans, tol: 0, q: R`If $f(x)=(${a}x+${b})^${n}$, find $f'(${x0})$.`, sol: R`<p>$f'(x)=${n}(${a}x+${b})^${n - 1}\cdot${a}$. At $x=${x0}$: $${n}\cdot${(a * x0 + b) ** (n - 1)}\cdot${a}=${ans}$.</p>` };
    }
    if (kind === 2) {
      const a = int(rng, 2, 9); return { kind, a, answer: a, tol: 0, q: R`If $f(x)=e^{${a}x}$, find $f'(0)$.`, sol: R`<p>$f'(x)=${a}e^{${a}x}$. At $0$: $${a}$.</p>` };
    }
    const a = int(rng, 2, 8); return { kind, a, answer: a, tol: 0, q: R`If $f(x)=\sin(${a}x)$, find $f'(0)$.`, sol: R`<p>$f'(x)=${a}\cos(${a}x)$. At $0$: $${a}\cdot1=${a}$.</p>` };
  }, (p) => Math.round(D1([(x) => p.a * x ** 3 + p.b * x * x + p.c * x, (x) => (p.a * x + p.b) ** p.n, (x) => exp(p.a * x), (x) => sin(p.a * x)][p.kind], p.kind === 0 || p.kind === 1 ? p.x0 : 0))),

  // c02 (L2): chain-rule expression
  gen('cd-g02', 2, 'mcq', 'single', 'chain rule', (rng) => {
    const kind = int(rng, 0, 3), a = int(rng, 2, 5), n = int(rng, 2, 4), m = int(rng, 2, 4), b = int(rng, 1, 4);
    const inner = `${a}x^{${n}}`; const di = `${a * n}x^{${n - 1}}`;
    let y, ok, ws;
    if (kind === 0) { y = R`\sin\left(${inner}\right)`; ok = R`${di}\cos\left(${inner}\right)`; ws = [R`\cos\left(${inner}\right)`, R`${di}\sin\left(${inner}\right)`, R`-${di}\cos\left(${inner}\right)`]; }
    else if (kind === 1) { y = R`e^{${inner}}`; ok = R`${di}e^{${inner}}`; ws = [R`e^{${inner}}`, R`${a}x^{${n}}e^{${inner}-1}`, R`${a * n}x^{${n - 1}}e^{${a * n}x^{${n - 1}}}`]; }
    else if (kind === 2) { y = R`\ln\left(${inner}+${b}\right)`; ok = R`\dfrac{${di}}{${inner}+${b}}`; ws = [R`\dfrac1{${inner}+${b}}`, R`\dfrac{${di}}{${inner}}`, R`${di}\ln\left(${inner}+${b}\right)`]; }
    else { y = R`\left(${inner}+${b}\right)^{${m}}`; ok = R`${m}\left(${inner}+${b}\right)^{${m - 1}}\cdot${di}`; ws = [R`${m}\left(${inner}+${b}\right)^{${m - 1}}`, R`\left(${inner}+${b}\right)^{${m - 1}}\cdot${di}`, R`${m}\left(${inner}+${b}\right)^{${m}}\cdot${di}`]; }
    const { options, answer } = OP(rng, ok, ws);
    return { kind, a, n, m, b, options, answer, q: R`If $y=${y}$, then $\dfrac{dy}{dx}=$`,
      sol: R`<p>Outer derivative times inner derivative. The inner function is $${inner}${kind >= 2 ? `+${b}` : ''}$ with derivative $${di}$. So $\dfrac{dy}{dx}=${ok}$.</p>` };
  }, (p) => {
    const f = [(x) => sin(p.a * x ** p.n), (x) => exp(p.a * x ** p.n), (x) => ln(p.a * x ** p.n + p.b), (x) => (p.a * x ** p.n + p.b) ** p.m][p.kind];
    const fd = [(x) => p.a * p.n * x ** (p.n - 1) * cos(p.a * x ** p.n), (x) => p.a * p.n * x ** (p.n - 1) * exp(p.a * x ** p.n), (x) => (p.a * p.n * x ** (p.n - 1)) / (p.a * x ** p.n + p.b), (x) => p.m * (p.a * x ** p.n + p.b) ** (p.m - 1) * p.a * p.n * x ** (p.n - 1)][p.kind];
    const x = 0.6; if (!tolOK(D1(f, x), fd(x), 1e-3)) return -1; return p.options.indexOf(p.options[p.answer]);
  }),

  // c03 (L2): product rule value
  gen('cd-g03', 2, 'nat', 'numeric', 'product rule', (rng) => {
    const kind = int(rng, 0, 2);
    if (kind === 0) { const a = int(rng, 2, 4), b = int(rng, 1, 3), ans = (a + b) * Math.exp(b); return { kind, a, b, answer: r4(ans), tol: 0.01, q: R`If $f(x)=x^${a}e^{${b === 1 ? '' : b}x}$, find $f'(1)$.${TWOD}`, sol: R`<p>$f'(x)=${a}x^${a - 1}e^{${b}x}+${b}x^${a}e^{${b}x}$. At $1$: $(${a}+${b})e^{${b}}\approx${r4(ans)}$.</p>` }; }
    if (kind === 1) { const a = int(rng, 2, 4), ans = E_ ** (a - 1) * (a + 1); return { kind, a, answer: r4(ans), tol: 0.01, q: R`If $f(x)=x^${a}\ln x$, find $f'(e)$.${TWOD}`, sol: R`<p>$f'(x)=${a}x^${a - 1}\ln x+x^${a - 1}$. At $e$: $${a}e^${a - 1}+e^${a - 1}=${a + 1}e^${a - 1}\approx${r4(ans)}$.</p>` }; }
    const a = int(rng, 2, 4), ans = a * (PI_ / 2) ** (a - 1); return { kind, a, answer: r4(ans), tol: 0.01, q: R`If $f(x)=x^${a}\sin x$, find $f'\!\left(\dfrac\pi2\right)$.${TWOD}`, sol: R`<p>$f'(x)=${a}x^${a - 1}\sin x+x^${a}\cos x$. At $\frac\pi2$ the cosine is 0 and the sine is 1: $${a}\left(\frac\pi2\right)^${a - 1}\approx${r4(ans)}$.</p>` };
  }, (p) => D1([(x) => x ** p.a * exp(p.b * x), (x) => x ** p.a * ln(x), (x) => x ** p.a * sin(x)][p.kind], [1, E_, PI_ / 2][p.kind])),

  // c04 (L2): value for continuity
  gen('cd-g04', 2, 'nat', 'integer', 'continuity at a point', (rng) => {
    const kind = int(rng, 0, 3);
    if (kind === 0) { const a = int(rng, 2, 7); return { kind, a, answer: 2 * a, tol: 0, q: R`$f(x)=\dfrac{x^2-${a * a}}{x-${a}}$ for $x\ne${a}$ and $f(${a})=k$. Find $k$ for continuity at $${a}$.`, sol: R`<p>$\dfrac{x^2-${a * a}}{x-${a}}=x+${a}\to${2 * a}$. So $k=${2 * a}$.</p>` }; }
    if (kind === 1) { const a = int(rng, 2, 4); return { kind, a, answer: 3 * a * a, tol: 0, q: R`$f(x)=\dfrac{x^3-${a ** 3}}{x-${a}}$ for $x\ne${a}$ and $f(${a})=k$. Find $k$ for continuity at $${a}$.`, sol: R`<p>$\dfrac{x^3-a^3}{x-a}\to3a^2=${3 * a * a}$. So $k=${3 * a * a}$.</p>` }; }
    if (kind === 2) { const a = int(rng, 2, 9); return { kind, a, answer: a, tol: 0, q: R`$f(x)=\dfrac{\sin${a}x}{x}$ for $x\ne0$ and $f(0)=k$. Find $k$ for continuity at $0$.`, sol: R`<p>$\dfrac{\sin${a}x}{x}\to${a}$. So $k=${a}$.</p>` }; }
    const a = choose(rng, [2, 4, 6, 8]); return { kind, a, answer: (a * a) / 2, tol: 0, q: R`$f(x)=\dfrac{1-\cos${a}x}{x^2}$ for $x\ne0$ and $f(0)=k$. Find $k$ for continuity at $0$.`, sol: R`<p>$\dfrac{1-\cos${a}x}{x^2}\to\dfrac{${a}^2}2=${(a * a) / 2}$. So $k=${(a * a) / 2}$.</p>` };
  }, (p) => {
    const f = [(x) => (x * x - p.a * p.a) / (x - p.a), (x) => (x ** 3 - p.a ** 3) / (x - p.a), (x) => sin(p.a * x) / x, (x) => (1 - cos(p.a * x)) / (x * x)][p.kind];
    return Math.round(NL(f, p.kind <= 1 ? p.a : 0));
  }),

  // c05 (L2): two-piece continuity
  gen('cd-g05', 2, 'mcq', 'single', 'finding constants', (rng) => {
    const a = int(rng, 1, 4), m = int(rng, 1, 4), c = int(rng, -3, 5), pp = int(rng, 1, 3), kind = int(rng, 0, 2);
    const d = m * a + c - pp * a * a;
    const piece = (mm, cc, dd) => R`f(x)=\begin{cases}${mm === '?' ? 'm' : co(mm)}x${cc === '?' ? '+c' : cc === 0 ? '' : cc < 0 ? cc : `+${cc}`},&x\le${a}\\${co(pp)}x^2${dd === '?' ? '+d' : dd === 0 ? '' : dd < 0 ? dd : `+${dd}`},&x>${a}\end{cases}`;
    let t, ok, ws, ex;
    if (kind === 0) { t = piece(m, c, '?'); ok = `${d}`; ex = d; }
    else if (kind === 1) { t = piece(m, '?', d); ok = `${c}`; ex = c; }
    else { t = piece('?', c, d); ok = `${m}`; ex = m; }
    ws = [`${ex + 1}`, `${ex - 1}`, `${-ex}`].filter((w) => w !== ok);
    while (ws.length < 3) ws.push(`${ex + 2 + ws.length}`);
    const { options, answer } = OP(rng, ok, [...new Set(ws)].slice(0, 3));
    return { a, m, c, pp, d, kind, options, answer, ex, q: R`The function $${t}$ is continuous at $x=${a}$. The value of $${['d', 'c', 'm'][kind]}$ is`,
      sol: R`<p>Left value $${m}\cdot${a}${sgn(c)}=${m * a + c}$. Right limit $${pp}\cdot${a * a}${kind === 0 ? '+d' : sgn(d)}=${kind === 0 ? `${pp * a * a}+d` : pp * a * a + d}$. Setting them equal: ${kind === 0 ? `$d=${d}$` : kind === 1 ? `$c=${c}$` : `$m=${m}$`}.</p>` };
  }, (p) => { const lhs = p.m * p.a + p.c, rhs = p.pp * p.a * p.a + p.d; return lhs === rhs ? p.options.indexOf(W(`${p.ex}`)) : -1; }),

  // c06 (L3): differentiable constants
  gen('cd-g06', 3, 'nat', 'integer', 'finding constants', (rng) => {
    const kind = int(rng, 0, 2), a = int(rng, 1, 4);
    if (kind === 0) return { kind, a, answer: 2 * a - a * a, tol: 0, q: R`$f(x)=\begin{cases}x^2,&x\le${a}\\px+q,&x>${a}\end{cases}$ is differentiable at $x=${a}$. Find $p+q$.`, sol: R`<p>Slopes: $2\cdot${a}=${2 * a}=p$. Values: $${a * a}=${2 * a}\cdot${a}+q$, so $q=${-a * a}$. $p+q=${2 * a - a * a}$.</p>` };
    if (kind === 1) return { kind, a, answer: 2 * a + a * a, tol: 0, q: R`$f(x)=\begin{cases}x^3,&x\le${a}\\px^2+qx,&x>${a}\end{cases}$ is differentiable at $x=${a}$. Find $p-q$.`, sol: R`<p>Values: $${a ** 3}=${a * a === 1 ? '' : a * a}p+${a === 1 ? '' : a}q$. Slopes: $${3 * a * a}=${2 * a}p+q$. From the second: $q=${3 * a * a}-${2 * a}p$. Substitute in the first: $${a ** 3}=${a * a}p+${3 * a * a * a}-${2 * a * a}p$, so $p=${2 * a}$ and $q=${-a * a}$. $p-q=${2 * a + a * a}$.</p>` };
    const k = int(rng, 2, 7); return { kind, k, answer: k + 1, tol: 0, q: R`$f(x)=\begin{cases}px+q,&x\le0\\e^{${k}x},&x>0\end{cases}$ is differentiable at $x=0$. Find $p+q$.`, sol: R`<p>Value: $q=e^0=1$. Slope: $p=${k}$. $p+q=${k + 1}$.</p>` };
  }, (p) => {
    if (p.kind === 0) { const f = (x) => (x <= p.a ? x * x : 2 * p.a * x - p.a * p.a); cDiff('g06a', f, p.a); return 2 * p.a - p.a * p.a; }
    if (p.kind === 1) { const f = (x) => (x <= p.a ? x ** 3 : 2 * p.a * x * x - p.a * p.a * x); cDiff('g06b', f, p.a); return 2 * p.a + p.a * p.a; }
    const f = (x) => (x <= 0 ? p.k * x + 1 : exp(p.k * x)); cDiff('g06c', f, 0); return p.k + 1;
  }),

  // c07 (L3): counting corners
  gen('cd-g07', 3, 'mcq', 'single', 'counting points of non-differentiability', (rng) => {
    const kind = int(rng, 0, 3); const a = int(rng, -4, 0), b = a + int(rng, 2, 4), c = b + int(rng, 1, 3);
    let t, ans;
    if (kind === 0) { t = R`|${xr(a)}|+|${xr(b)}|+|${xr(c)}|`; ans = 3; }
    else if (kind === 1) { t = R`\left|(${xr(a)})(${xr(b)})\right|`; ans = 2; }
    else if (kind === 2) { t = R`\left|(${xr(a)})^2(${xr(b)})\right|`; ans = 1; }
    else { t = R`\left|(${xr(a)})^3\right|`; ans = 0; }
    const { options, answer } = shuffleOpts(rng, `${ans}`, ['0', '1', '2', '3', '4'].filter((v) => v !== `${ans}`).slice(0, 3));
    return { kind, a, b, c, ans, options, answer, q: R`The function $f(x)=${t}$ is not differentiable at how many points?`,
      sol: R`<p>${kind === 0 ? `Each term $|x-r|$ has its own corner at a different point ($${a}$, $${b}$, $${c}$), so there are three corners.` : kind === 1 ? `Both roots ($${a}$ and $${b}$) are simple, so the sign changes with a non-zero slope: two corners.` : kind === 2 ? `The simple root $${b}$ gives a corner. The double root $${a}$ touches the axis without crossing, so $|\\cdot|$ is smooth there: one corner.` : `$|(x-r)^3|=|x-r|^3$ is smooth at $r$ (the slope $3(x-r)|x-r|\\to0$): no corners.`}</p>` };
  }, (p) => {
    const f = [(x) => abs(x - p.a) + abs(x - p.b) + abs(x - p.c), (x) => abs((x - p.a) * (x - p.b)), (x) => abs((x - p.a) ** 2 * (x - p.b)), (x) => abs((x - p.a) ** 3)][p.kind];
    return kinkCount(f, p.a - 6, p.c + 6) === p.ans ? p.options.indexOf(`${p.ans}`) : -1;
  }),

  // c08 (L3): counting jumps
  gen('cd-g08', 3, 'mcq', 'single', 'greatest integer', (rng) => {
    const kind = int(rng, 0, 2), n = int(rng, 2, 4);
    let t, ans, why;
    if (kind === 0) { const k = int(rng, 2, 4); t = R`[${k}x]`; ans = k * n - 1; why = `$[${k}x]$ jumps when $${k}x$ is an integer, i.e. at $x=\\frac{j}{${k}}$ for $j=1,\\dots,${k * n - 1}$ (the end points $0$ and $${n}$ are excluded).`; return fin(k); }
    if (kind === 1) { t = R`\{x\}`; ans = n - 1; why = `$\\{x\\}$ jumps at every integer inside the interval: that is ${n - 1} point${n - 1 === 1 ? '' : 's'} (the integers from 1 to ${n - 1}).`; return fin(0); }
    const k = int(rng, 1, n - 1); t = R`[x]+|x-${k}|`; ans = n - 1; why = `$|x-${k}|$ is continuous. $[x]$ jumps at the integers $1,\\dots,${n - 1}$.`;
    return fin(k);
    function fin(k) {
      const { options, answer } = shuffleOpts(rng, `${ans}`, [`${ans + 1}`, `${ans + 2}`, `${Math.max(0, ans - 1)}`]);
      return { kind, n, k, ans, options, answer, q: R`The number of points of discontinuity of $f(x)=${t}$ in the open interval $(0,${n})$ is`, sol: R`<p>${why} Total: $${ans}$.</p>` };
    }
  }, (p) => {
    const f = [(x) => fl(p.k * x), (x) => x - fl(x), (x) => fl(x) + abs(x - p.k)][p.kind];
    return jumpCount(f, 0, p.n) === p.ans ? p.options.indexOf(`${p.ans}`) : -1;
  }),

  // c09 (L3): implicit slopes
  gen('cd-g09', 3, 'nat', 'numeric', 'implicit differentiation', (rng) => {
    const kind = int(rng, 0, 3);
    if (kind === 0) { const [x0, y0] = choose(rng, [[3, 4], [5, 12], [6, 8], [8, 6], [4, 3]]); return { kind, x0, y0, answer: r4(-x0 / y0), tol: 0.01, q: R`For $x^2+y^2=${x0 * x0 + y0 * y0}$, find $\dfrac{dy}{dx}$ at $(${x0},${y0})$.${TWOD}`, sol: R`<p>$2x+2yy'=0$, so $y'=-\dfrac xy=-\dfrac{${x0}}{${y0}}\approx${r4(-x0 / y0)}$.</p>` }; }
    if (kind === 1) { const x0 = int(rng, 1, 3), y0 = int(rng, 1, 3); return { kind, x0, y0, answer: r4(-(x0 * x0) / (y0 * y0)), tol: 0.01, q: R`For $x^3+y^3=${x0 ** 3 + y0 ** 3}$, find $\dfrac{dy}{dx}$ at $(${x0},${y0})$.${TWOD}`, sol: R`<p>$3x^2+3y^2y'=0$, so $y'=-\dfrac{x^2}{y^2}=-\dfrac{${x0 * x0}}{${y0 * y0}}\approx${r4(-(x0 * x0) / (y0 * y0))}$.</p>` }; }
    if (kind === 2) { const x0 = int(rng, 1, 3), y0 = int(rng, 1, 3), ans = -(2 * x0 + y0) / (x0 + 2 * y0); return { kind, x0, y0, answer: r4(ans), tol: 0.01, q: R`For $x^2+xy+y^2=${x0 * x0 + x0 * y0 + y0 * y0}$, find $\dfrac{dy}{dx}$ at $(${x0},${y0})$.${TWOD}`, sol: R`<p>$2x+y+xy'+2yy'=0$, so $y'=-\dfrac{2x+y}{x+2y}=-\dfrac{${2 * x0 + y0}}{${x0 + 2 * y0}}\approx${r4(ans)}$.</p>` }; }
    const x0 = int(rng, 1, 3), y0 = int(rng, 1, 3), ans = -(2 * x0 * y0 + y0 * y0) / (x0 * x0 + 2 * x0 * y0); return { kind, x0, y0, answer: r4(ans), tol: 0.01, q: R`For $x^2y+xy^2=${x0 * x0 * y0 + x0 * y0 * y0}$, find $\dfrac{dy}{dx}$ at $(${x0},${y0})$.${TWOD}`, sol: R`<p>$2xy+x^2y'+y^2+2xyy'=0$, so $y'=-\dfrac{2xy+y^2}{x^2+2xy}=-\dfrac{${2 * x0 * y0 + y0 * y0}}{${x0 * x0 + 2 * x0 * y0}}\approx${r4(ans)}$.</p>` };
  }, (p) => {
    const F = [(x, y) => x * x + y * y - (p.x0 ** 2 + p.y0 ** 2), (x, y) => x ** 3 + y ** 3 - (p.x0 ** 3 + p.y0 ** 3), (x, y) => x * x + x * y + y * y - (p.x0 ** 2 + p.x0 * p.y0 + p.y0 ** 2), (x, y) => x * x * y + x * y * y - (p.x0 * p.x0 * p.y0 + p.x0 * p.y0 * p.y0)][p.kind];
    const h = 1e-6, Fx = (F(p.x0 + h, p.y0) - F(p.x0 - h, p.y0)) / (2 * h), Fy = (F(p.x0, p.y0 + h) - F(p.x0, p.y0 - h)) / (2 * h); return -Fx / Fy;
  }),

  // c10 (L3): logarithmic differentiation
  gen('cd-g10', 3, 'nat', 'numeric', 'logarithmic differentiation', (rng) => {
    const kind = int(rng, 0, 2);
    if (kind === 0) { const a = int(rng, 1, 2), x0 = a === 2 ? 2 : int(rng, 2, 3), ans = x0 ** (a * x0) * a * (ln(x0) + 1); return { kind, a, x0, answer: r4(ans), tol: 0.02, q: R`If $y=x^{${a === 1 ? '' : a}x}$, find $\dfrac{dy}{dx}$ at $x=${x0}$.${TWOD}`, sol: R`<p>$\ln y=${a}x\ln x$, so $\dfrac{y'}y=${a}(\ln x+1)$. At $x=${x0}$: $y=${x0 ** (a * x0)}$ and $y'=${x0 ** (a * x0)}\cdot${a}(${r4(ln(x0))}+1)\approx${r4(ans)}$.</p>` }; }
    if (kind === 1) { const x0 = int(rng, 1, 2), ans = (x0 * x0 + 1) ** x0 * (ln(x0 * x0 + 1) + (2 * x0 * x0) / (x0 * x0 + 1)); return { kind, x0, answer: r4(ans), tol: 0.02, q: R`If $y=(x^2+1)^x$, find $\dfrac{dy}{dx}$ at $x=${x0}$.${TWOD}`, sol: R`<p>$\ln y=x\ln(x^2+1)$, so $\dfrac{y'}y=\ln(x^2+1)+\dfrac{2x^2}{x^2+1}$. At $x=${x0}$: $y=${(x0 * x0 + 1) ** x0}$, $y'\approx${r4(ans)}$.</p>` }; }
    const x0 = choose(rng, [1.5, 2]), ans = x0 ** (x0 * x0) * (2 * x0 * ln(x0) + x0); return { kind, x0, answer: r4(ans), tol: 0.05, q: R`If $y=x^{x^2}$, find $\dfrac{dy}{dx}$ at $x=${x0}$.${TWOD}`, sol: R`<p>$\ln y=x^2\ln x$, so $\dfrac{y'}y=2x\ln x+x$. At $x=${x0}$: $y=${x0 ** (x0 * x0)}$ and $y'\approx${r4(ans)}$.</p>` };
  }, (p) => D1([(x) => x ** (p.a * x), (x) => (x * x + 1) ** x, (x) => x ** (x * x)][p.kind], p.x0, 1e-6)),

  // c11 (L3): parametric slope
  gen('cd-g11', 3, 'nat', 'numeric', 'parametric derivatives', (rng) => {
    const kind = int(rng, 0, 3);
    if (kind === 0) { const a = int(rng, 1, 5), b = int(rng, 1, 5), ans = -b / a; return { kind, a, b, answer: r4(ans), tol: 0.01, q: R`If $x=${co(a)}\cos t$ and $y=${co(b)}\sin t$, find $\dfrac{dy}{dx}$ at $t=\dfrac\pi4$.${TWOD}`, sol: R`<p>$\dfrac{dy}{dx}=\dfrac{${b}\cos t}{-${a}\sin t}=-\dfrac{${b}}{${a}}\cot t$. At $\frac\pi4$, $\cot t=1$: $${r4(ans)}$.</p>` }; }
    if (kind === 1) { const a = int(rng, 1, 3), b = int(rng, 1, 5), t0 = int(rng, 1, 3), ans = (3 * b * t0) / (2 * a); return { kind, a, b, t0, answer: r4(ans), tol: 0.01, q: R`If $x=${co(a)}t^2$ and $y=${co(b)}t^3$, find $\dfrac{dy}{dx}$ at $t=${t0}$.${TWOD}`, sol: R`<p>$\dfrac{dy}{dx}=\dfrac{${3 * b}t^2}{${2 * a}t}=\dfrac{${3 * b}t}{${2 * a}}$. At $t=${t0}$: $${r4(ans)}$.</p>` }; }
    if (kind === 2) { const a = int(rng, 1, 6); return { kind, a, answer: r4(sqrt(3)), tol: 0.01, q: R`If $x=${co(a)}(\theta-\sin\theta)$ and $y=${co(a)}(1-\cos\theta)$, find $\dfrac{dy}{dx}$ at $\theta=\dfrac\pi3$.${TWOD}`, sol: R`<p>$\dfrac{dy}{dx}=\dfrac{\sin\theta}{1-\cos\theta}=\cot\dfrac\theta2$. At $\frac\pi3$: $\cot\frac\pi6=\sqrt3\approx1.73$. (The constant $${a}$ cancels.)</p>` }; }
    const a = int(rng, 1, 4), b = int(rng, 1, 4), ans = (b / a) * sqrt(2); return { kind, a, b, answer: r4(ans), tol: 0.01, q: R`If $x=${co(a)}\sec t$ and $y=${co(b)}\tan t$, find $\dfrac{dy}{dx}$ at $t=\dfrac\pi4$.${TWOD}`, sol: R`<p>$\dfrac{dy}{dx}=\dfrac{${b}\sec^2t}{${a}\sec t\tan t}=\dfrac{${b}}{${a}}\cdot\dfrac1{\sin t}$. At $\frac\pi4$, $\frac1{\sin t}=\sqrt2$: $\approx${r4(ans)}$.</p>` };
  }, (p) => {
    const [xf, yf, t] = [[(t) => p.a * cos(t), (t) => p.b * sin(t), PI_ / 4], [(t) => p.a * t * t, (t) => p.b * t ** 3, p.t0], [(t) => p.a * (t - sin(t)), (t) => p.a * (1 - cos(t)), PI_ / 3], [(t) => p.a / cos(t), (t) => p.b * tan(t), PI_ / 4]][p.kind];
    return pD(xf, yf, t);
  }),

  // c12 (L3): second derivatives
  gen('cd-g12', 3, 'nat', 'numeric', 'second derivative', (rng) => {
    const kind = int(rng, 0, 3);
    if (kind === 0) { const n = int(rng, 3, 6), x0 = int(rng, 1, 3), ans = n * (n - 1) * x0 ** (n - 2); return { kind, n, x0, answer: ans, tol: 0.01, q: R`If $y=x^${n}$, find $\dfrac{d^2y}{dx^2}$ at $x=${x0}$.${TWOD}`, sol: R`<p>$y''=${n}(${n - 1})x^${n - 2}=${n * (n - 1)}x^${n - 2}$. At $x=${x0}$: $${ans}$.</p>` }; }
    if (kind === 1) { const a = int(rng, 1, 3); return { kind, a, answer: a * a - 1, tol: 0.01, q: R`If $y=e^{${a === 1 ? '' : a}x}\cos x$, find $\dfrac{d^2y}{dx^2}$ at $x=0$.${TWOD}`, sol: R`<p>$y'=e^{${co(a)}x}(${co(a)}\cos x-\sin x)$. $y''=e^{${co(a)}x}\left[(${a * a}-1)\cos x-${2 * a}\sin x\right]$ (differentiate the product again and collect terms). At $0$: $${a * a - 1}$.</p>` }; }
    if (kind === 2) { const a = int(rng, 2, 4); return { kind, a, answer: -a * a, tol: 0.01, q: R`If $y=\sin(${a}x)$, find $\dfrac{d^2y}{dx^2}$ at $x=\dfrac\pi{${2 * a}}$.${TWOD}`, sol: R`<p>$y''=-${a * a}\sin(${a}x)$. At $x=\frac\pi{${2 * a}}$: $\sin\frac\pi2=1$, so $y''=${-a * a}$.</p>` }; }
    const x0 = int(rng, 1, 4); return { kind, x0, answer: r4(1 / x0), tol: 0.01, q: R`If $y=x\ln x-x$, find $\dfrac{d^2y}{dx^2}$ at $x=${x0}$.${TWOD}`, sol: R`<p>$y'=\ln x+1-1=\ln x$, so $y''=\dfrac1x$. At $x=${x0}$: $${r4(1 / x0)}$.</p>` };
  }, (p) => {
    if (p.kind === 3) return D2((x) => x * ln(x) - x, p.x0);
    return D2([(x) => x ** p.n, (x) => exp(p.a * x) * cos(x), (x) => sin(p.a * x)][p.kind], [p.x0, 0, PI_ / (2 * p.a)][p.kind]);
  }),

  // c13 (L3): inverse trig simplification
  gen('cd-g13', 3, 'mcq', 'single', 'inverse trigonometric', (rng) => {
    const kind = int(rng, 0, 4);
    const T = [
      [R`\tan^{-1}\!\left(\dfrac{2x}{1-x^2}\right),\ |x|<1`, R`\dfrac2{1+x^2}`, [R`\dfrac1{1+x^2}`, R`\dfrac{2}{1-x^2}`, R`\dfrac{4x}{1+x^2}`], R`$x=\tan\theta$ gives $\tan^{-1}(\tan2\theta)=2\theta$.`],
      [R`\sin^{-1}\!\left(\dfrac{2x}{1+x^2}\right),\ |x|<1`, R`\dfrac2{1+x^2}`, [R`\dfrac1{1+x^2}`, R`\dfrac2{\sqrt{1-x^2}}`, R`-\dfrac2{1+x^2}`], R`$x=\tan\theta$ gives $\sin^{-1}(\sin2\theta)=2\theta$ for $|\theta|<\frac\pi4$.`],
      [R`\cos^{-1}\!\left(1-2x^2\right),\ 0<x<1`, R`\dfrac2{\sqrt{1-x^2}}`, [R`\dfrac1{\sqrt{1-x^2}}`, R`-\dfrac2{\sqrt{1-x^2}}`, R`\dfrac{4x}{\sqrt{1-x^2}}`], R`$x=\sin\theta$ gives $\cos^{-1}(\cos2\theta)=2\theta$.`],
      [R`\sin^{-1}\!\left(3x-4x^3\right),\ |x|<\tfrac12`, R`\dfrac3{\sqrt{1-x^2}}`, [R`\dfrac1{\sqrt{1-x^2}}`, R`\dfrac{3-12x^2}{\sqrt{1-x^2}}`, R`-\dfrac3{\sqrt{1-x^2}}`], R`$x=\sin\theta$ gives $\sin3\theta$ and $3\theta$ is in the principal range.`],
      [R`\tan^{-1}\!\left(\dfrac{3x-x^3}{1-3x^2}\right),\ |x|<\tfrac1{\sqrt3}`, R`\dfrac3{1+x^2}`, [R`\dfrac1{1+x^2}`, R`\dfrac3{1-x^2}`, R`\dfrac{3x}{1+x^2}`], R`$x=\tan\theta$ gives $\tan3\theta$.`],
    ][kind];
    const { options, answer } = OP(rng, T[1], T[2]);
    return { kind, options, answer, q: R`If $y=${T[0]}$, then $\dfrac{dy}{dx}=$`, sol: R`<p>Substitute to simplify the inverse function first. ${T[3]} Hence $y$ is a constant multiple of a standard inverse function, and $\dfrac{dy}{dx}=${T[1]}$.</p>` };
  }, (p) => {
    const f = [(x) => atan((2 * x) / (1 - x * x)), (x) => asin((2 * x) / (1 + x * x)), (x) => acos(1 - 2 * x * x), (x) => asin(3 * x - 4 * x ** 3), (x) => atan((3 * x - x ** 3) / (1 - 3 * x * x))][p.kind];
    const fd = [(x) => 2 / (1 + x * x), (x) => 2 / (1 + x * x), (x) => 2 / sqrt(1 - x * x), (x) => 3 / sqrt(1 - x * x), (x) => 3 / (1 + x * x)][p.kind];
    const x = 0.3; return tolOK(D1(f, x), fd(x), 1e-3) ? p.answer : -1;
  }),

  // c14 (L4): derivative-as-limit
  gen('cd-g14', 4, 'nat', 'integer', 'derivative as a limit', (rng) => {
    const kind = int(rng, 0, 2);
    if (kind === 0) { const k = int(rng, 2, 4), a = int(rng, 1, 2), m = int(rng, 1, 4), n = int(rng, 1, 4); const ans = (m + n) * k * a ** (k - 1); return { kind, k, a, m, n, answer: ans, tol: 0, q: R`If $f(x)=x^${k}$, evaluate $\displaystyle\lim_{h\to0}\dfrac{f(${a}+${m === 1 ? '' : m}h)-f(${a}-${n === 1 ? '' : n}h)}{h}$.`, sol: R`<p>The limit is $(${m}+${n})f'(${a})$. $f'(x)=${k}x^${k - 1}$, so $f'(${a})=${k * a ** (k - 1)}$. Answer $${m + n}\cdot${k * a ** (k - 1)}=${ans}$.</p>` }; }
    if (kind === 1) { const k = int(rng, 3, 5), j = int(rng, 1, 2), a = int(rng, 1, 3); const ans = (k - j) * a ** (k + j - 1); return { kind, k, j, a, answer: ans, tol: 0, q: R`If $f(x)=x^${j}$, evaluate $\displaystyle\lim_{x\to${a}}\dfrac{x^${k}f(${a})-${a}^${k}f(x)}{x-${a}}$.`, sol: R`<p>Here $f(${a})=${a ** j}$, so the expression is $\dfrac{${a ** j}x^${k}-${a ** k}x^${j}}{x-${a}}$. It is the derivative of $${a ** j}x^${k}-${a ** k}x^${j}$ at $${a}$: $${a ** j}\cdot${k}\cdot${a}^${k - 1}-${a ** k}\cdot${j}\cdot${a}^${j - 1}=${ans}$.</p>` }; }
    const a = int(rng, 1, 2), ans = 6 * a ** 5; return { kind, a, answer: ans, tol: 0, q: R`If $f(x)=x^3$, evaluate $\displaystyle\lim_{x\to${a}}\dfrac{f(x^2)-f(${a * a})}{x-${a}}$.`, sol: R`<p>$f(x^2)=x^6$. The limit is the derivative of $x^6$ at $${a}$: $6\cdot${a}^5=${ans}$.</p>` };
  }, (p) => {
    if (p.kind === 0) return Math.round(NL((h) => ((p.a + p.m * h) ** p.k - (p.a - p.n * h) ** p.k) / h, 0));
    if (p.kind === 1) return Math.round(NL((x) => (x ** p.k * p.a ** p.j - p.a ** p.k * x ** p.j) / (x - p.a), p.a));
    return Math.round(NL((x) => ((x * x) ** 3 - (p.a * p.a) ** 3) / (x - p.a), p.a));
  }),

  // c15 (L4): functional equations
  gen('cd-g15', 4, 'nat', 'integer', 'functional equations', (rng) => {
    const kind = int(rng, 0, 2);
    if (kind === 0) { const k = int(rng, 1, 4), c = int(rng, 1, 5), x0 = int(rng, 2, 6); return { kind, k, c, x0, answer: c + k * x0, tol: 0, q: R`A differentiable $f$ satisfies $f(x+y)=f(x)+f(y)+${k === 1 ? '' : k}xy$ for all $x,y$ and $f'(0)=${c}$. Find $f'(${x0})$.`, sol: R`<p>$f(0)=0$. $f'(x)=\lim\dfrac{f(h)+${k}xh}h=f'(0)+${k}x=${c}+${k}x$. At $x=${x0}$: $${c + k * x0}$.</p>` }; }
    if (kind === 1) { const x0 = choose(rng, [2, 3, 4, 5]), c = x0 * int(rng, 1, 4); return { kind, x0, c, answer: c / x0, tol: 0, q: R`A differentiable $f$ on $(0,\infty)$ satisfies $f(xy)=f(x)+f(y)$ and $f'(1)=${c}$. Find $f'(${x0})$.`, sol: R`<p>$f'(x)=\dfrac{f'(1)}x$ (since $f(x)=f'(1)\ln x$). So $f'(${x0})=\dfrac{${c}}{${x0}}=${c / x0}$.</p>` }; }
    const am = choose(rng, [2, 3]), m = int(rng, 2, 6), x0 = choose(rng, [5, 7, 8, 9]); return { kind, am, m, x0, answer: m * x0, tol: 0, q: R`A continuous $f$ satisfies $f(x+y)=f(x)+f(y)$ for all $x,y$ and $f(${am})=${am * m}$. Find $f(${x0})$.`, sol: R`<p>A continuous additive function is $f(x)=cx$. From $f(${am})=${am * m}$: $c=${m}$. So $f(${x0})=${m * x0}$.</p>` };
  }, (p) => {
    if (p.kind === 0) { const f = (x) => p.c * x + (p.k * x * x) / 2; return Math.round(D1(f, p.x0)); }
    if (p.kind === 1) { const f = (x) => p.c * ln(x); return Math.round(D1(f, p.x0) * p.x0) / p.x0; }
    const f = (x) => p.m * x; need(tolOK(f(p.am + 3), f(p.am) + f(3)) && tolOK(f(p.am), p.am * p.m), 'additive'); return Math.round(f(p.x0));
  }),

  // c16 (L4): differential equation constants
  gen('cd-g16', 4, 'nat', 'integer', 'second derivative', (rng) => {
    let a, b; do { a = int(rng, -3, 4); b = int(rng, -3, 4); } while (a === b);
    const A = int(rng, 1, 3), B = int(rng, 1, 3);
    return { a, b, A, B, answer: -(a + b) + a * b, tol: 0, q: R`If $y=${A}e^{${a}x}+${B}e^{${b}x}$ satisfies $y''+py'+qy=0$ for constants $p,q$, find $p+q$.`,
      sol: R`<p>Each exponential $e^{mx}$ satisfies $y''-(m_1+m_2)y'+m_1m_2y=0$ when the solution is a combination of $e^{m_1x}$ and $e^{m_2x}$. Here $m_1=${a}$, $m_2=${b}$: $p=-(${a}+${b})=${-(a + b)}$ and $q=${a}\cdot${b}=${a * b}$. So $p+q=${-(a + b) + a * b}$.</p>` };
  }, (p) => { const y = (x) => p.A * exp(p.a * x) + p.B * exp(p.b * x); const P = -(p.a + p.b), Q = p.a * p.b; const x = 0.2; need(Math.abs(D2(y, x) + P * D1(y, x) + Q * y(x)) < 1e-3 * Math.max(1, Math.abs(y(x)) * 50), 'ode'); return P + Q; }),

  // c17 (L4): counting corners of trig-modulus functions
  gen('cd-g17', 4, 'nat', 'integer', 'counting points of non-differentiability', (rng) => {
    const kind = int(rng, 0, 2), n = int(rng, 2, 4);
    if (kind === 0) return { kind, n, answer: n - 1, tol: 0, q: R`The number of points in $(0,${n}\pi)$ where $f(x)=|\sin x|$ is not differentiable is`, sol: R`<p>The corners are at the zeros of $\sin x$ inside the interval: $\pi,2\pi,\dots,${n - 1}\pi$. That is $${n - 1}$ points.</p>` };
    if (kind === 1) return { kind, n, answer: n, tol: 0, q: R`The number of points in $(0,${n}\pi)$ where $f(x)=\max(\sin x,\cos x)$ is not differentiable is`, sol: R`<p>The graphs cross where $\tan x=1$: $x=\frac\pi4+k\pi$. In $(0,${n}\pi)$ there are $${n}$ such points, each a corner.</p>` };
    return { kind, n, answer: 2 * n - 1, tol: 0, q: R`The number of points in $(0,${n}\pi)$ where $f(x)=|\sin x|+|\cos x|$ is not differentiable is`, sol: R`<p>Corners occur at zeros of $\sin x$ or $\cos x$, i.e. at multiples of $\frac\pi2$. Inside $(0,${n}\pi)$: $\frac\pi2,\pi,\dots,${2 * n - 1}\cdot\frac\pi2$, so $${2 * n - 1}$ points. (No two corner effects cancel: at each point exactly one term has a corner.)</p>` };
  }, (p) => kinkCount([(x) => abs(sin(x)), (x) => Math.max(sin(x), cos(x)), (x) => abs(sin(x)) + abs(cos(x))][p.kind], 0, p.n * PI_)),

  // c18 (L5): derivative of an inverse function
  gen('cd-g18', 5, 'nat', 'numeric', 'derivative of an inverse function', (rng) => {
    const kind = int(rng, 0, 2), a = int(rng, 1, 2);
    if (kind === 0) { const c = int(rng, 1, 4), fa = a ** 3 + c * a; return { kind, a, c, answer: r4(1 / (3 * a * a + c)), tol: 0.01, q: R`Let $f(x)=x^3+${c}x$ and let $g$ be its inverse function. Find $g'(${fa})$.${TWOD}`, sol: R`<p>$f(${a})=${a ** 3}+${c * a}=${fa}$, so $g(${fa})=${a}$. $g'(${fa})=\dfrac1{f'(${a})}$ and $f'(x)=3x^2+${c}$, $f'(${a})=${3 * a * a + c}$. Answer $\dfrac1{${3 * a * a + c}}\approx${r4(1 / (3 * a * a + c))}$.</p>` }; }
    if (kind === 1) { const fa = a ** 5 + a; return { kind, a, answer: r4(1 / (5 * a ** 4 + 1)), tol: 0.01, q: R`Let $f(x)=x^5+x$ and let $g$ be its inverse. Find $g'(${fa})$.${TWOD}`, sol: R`<p>$f(${a})=${fa}$. $f'(x)=5x^4+1$, $f'(${a})=${5 * a ** 4 + 1}$. $g'(${fa})=\dfrac1{${5 * a ** 4 + 1}}\approx${r4(1 / (5 * a ** 4 + 1))}$.</p>` }; }
    const fa = exp(a) + a; return { kind, a, answer: r4(1 / (exp(a) + 1)), tol: 0.01, q: R`Let $f(x)=e^x+x$ and let $g$ be its inverse. Find $g'\!\left(e^{${a}}+${a}\right)$.${TWOD}`, sol: R`<p>$g(e^{${a}}+${a})=${a}$. $f'(x)=e^x+1$, so $g'=\dfrac1{e^{${a}}+1}\approx${r4(1 / (exp(a) + 1))}$.</p>` };
  }, (p) => {
    const f = [(x) => x ** 3 + p.c * x, (x) => x ** 5 + x, (x) => exp(x) + x][p.kind];
    const g = (y) => { let lo = -5, hi = 5; for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (f(mid) < y) lo = mid; else hi = mid; } return (lo + hi) / 2; };
    return D1(g, f(p.a), 1e-4);
  }),

  // c19 (L5): implicit second derivative
  gen('cd-g19', 5, 'nat', 'numeric', 'second derivative', (rng) => {
    const kind = int(rng, 0, 2);
    if (kind === 0) { const [x0, y0] = choose(rng, [[3, 4], [4, 3], [5, 12], [6, 8]]); const r2 = x0 * x0 + y0 * y0, ans = -r2 / y0 ** 3; return { kind, x0, y0, answer: r4(ans), tol: 0.01, q: R`For the circle $x^2+y^2=${r2}$, find $\dfrac{d^2y}{dx^2}$ at $(${x0},${y0})$.${TWOD}`, sol: R`<p>$y'=-\dfrac xy$. $y''=-\dfrac{y-xy'}{y^2}=-\dfrac{y+x^2/y}{y^2}=-\dfrac{x^2+y^2}{y^3}=-\dfrac{${r2}}{${y0 ** 3}}\approx${r4(ans)}$.</p>` }; }
    if (kind === 1) { const x0 = int(rng, 1, 4), y0 = int(rng, 1, 4), k = x0 * y0, ans = (2 * y0) / (x0 * x0); return { kind, x0, y0, k, answer: r4(ans), tol: 0.01, q: R`For $xy=${k}$, find $\dfrac{d^2y}{dx^2}$ at $(${x0},${y0})$.${TWOD}`, sol: R`<p>$y=\dfrac{${k}}x$, $y'=-\dfrac{${k}}{x^2}$, $y''=\dfrac{${2 * k}}{x^3}$. At $x=${x0}$: $\dfrac{${2 * k}}{${x0 ** 3}}\approx${r4(ans)}$.</p>` }; }
    const [a, y0] = choose(rng, [[1, 2], [1, 4], [2, 4], [4, 4]]), x0 = (y0 * y0) / (4 * a), ans = (-4 * a * a) / y0 ** 3; return { kind, a, y0, x0, answer: r4(ans), tol: 0.01, q: R`For the parabola $y^2=${4 * a}x$, find $\dfrac{d^2y}{dx^2}$ at the point $\left(${x0},${y0}\right)$.${TWOD}`, sol: R`<p>$2yy'=${4 * a}$, so $y'=\dfrac{${2 * a}}y$. $y''=-\dfrac{${2 * a}}{y^2}y'=-\dfrac{${4 * a * a}}{y^3}$. At $y=${y0}$: $${r4(ans)}$.</p>` };
  }, (p) => {
    const y = p.kind === 0 ? (x) => sqrt(p.x0 * p.x0 + p.y0 * p.y0 - x * x) : p.kind === 1 ? (x) => (p.x0 * p.y0) / x : (x) => sqrt(4 * p.a * x);
    return D2(y, p.x0);
  }),

  // c20 (L5): numeric logarithmic differentiation
  gen('cd-g20', 5, 'nat', 'numeric', 'logarithmic differentiation', (rng) => {
    const kind = int(rng, 0, 1);
    if (kind === 0) { const x0 = choose(rng, [PI_ / 4, PI_ / 6, PI_ / 3]); const lab = x0 === PI_ / 4 ? R`\dfrac\pi4` : x0 === PI_ / 6 ? R`\dfrac\pi6` : R`\dfrac\pi3`; const y = cos(x0) ** sin(x0), ans = y * (cos(x0) * ln(cos(x0)) - (sin(x0) * sin(x0)) / cos(x0)); return { kind, x0, answer: r4(ans), tol: 0.02, q: R`If $y=(\cos x)^{\sin x}$, find $\dfrac{dy}{dx}$ at $x=${lab}$.${TWOD}`, sol: R`<p>$\ln y=\sin x\ln\cos x$. $\dfrac{y'}y=\cos x\ln\cos x-\dfrac{\sin^2x}{\cos x}$. Evaluate at $x=${lab}$: $y\approx${r4(y)}$, so $y'\approx${r4(ans)}$.</p>` }; }
    const x0 = int(rng, 2, 4), ans = (1 + 1 / x0) ** x0 * (ln(1 + 1 / x0) - 1 / (x0 + 1)); return { kind, x0, answer: r4(ans), tol: 0.02, q: R`If $y=\left(1+\dfrac1x\right)^x$, find $\dfrac{dy}{dx}$ at $x=${x0}$.${TWOD}`, sol: R`<p>$\ln y=x\ln\left(1+\frac1x\right)$. $\dfrac{y'}y=\ln\left(1+\frac1x\right)-\dfrac1{x+1}$. At $x=${x0}$: $y=${r4((1 + 1 / x0) ** x0)}$, so $y'\approx${r4(ans)}$.</p>` };
  }, (p) => D1(p.kind === 0 ? (x) => cos(x) ** sin(x) : (x) => (1 + 1 / x) ** x, p.x0, 1e-6)),

  // c21 (L2): one-sided derivatives
  gen('cd-g21', 2, 'mcq', 'single', 'differentiability', (rng) => {
    const a = int(rng, 1, 5), kind = int(rng, 0, 2);
    let f, side, ok, ws, val;
    if (kind === 0) { f = R`|x-${a}|`; side = rng() < 0.5 ? -1 : 1; val = side; }
    else if (kind === 1) { f = R`\left|x^2-${a * a}\right|`; side = rng() < 0.5 ? -1 : 1; val = side * 2 * a; }
    else { f = R`x\left|x-${a}\right|`; side = rng() < 0.5 ? -1 : 1; val = side * a; }
    const nm = side < 0 ? 'left' : 'right';
    const { options, answer } = OP(rng, `${val}`, [`${-val}`, '0', `${Math.abs(val) + 1}`].filter((w, i, ar) => w !== `${val}` && ar.indexOf(w) === i).concat(['7', '9']).slice(0, 3));
    return { a, kind, side, val, options, answer, q: R`For $f(x)=${f}$, the ${nm}-hand derivative of $f$ at $x=${a}$ is`,
      sol: R`<p>${kind === 0 ? `For $x<${a}$ the function is $${a}-x$ (slope $-1$); for $x>${a}$ it is $x-${a}$ (slope $+1$).` : kind === 1 ? `Near $x=${a}$, $x^2-${a * a}$ has slope $2x=${2 * a}$ and changes sign. On the right $|f|=x^2-${a * a}$ (slope $${2 * a}$); on the left $|f|=-(x^2-${a * a})$ (slope $-${2 * a}$).` : `On the right, $f=x(x-${a})$ with derivative $2x-${a}=${a}$ at $${a}$; on the left, $f=-x(x-${a})$ with derivative $${a}-2x=-${a}$.`} So the ${nm}-hand derivative is $${val}$.</p>` };
  }, (p) => {
    const f = [(x) => abs(x - p.a), (x) => abs(x * x - p.a * p.a), (x) => x * abs(x - p.a)][p.kind];
    const v = p.side < 0 ? DL(f, p.a) : DR(f, p.a); return near(v, p.val, 5e-3) ? p.options.indexOf(W(`${p.val}`)) : -1;
  }),

  // c22 (L3): classify the discontinuity
  gen('cd-g22', 3, 'mcq', 'single', 'types of discontinuity', (rng) => {
    const a = int(rng, 1, 5), kind = int(rng, 0, 4);
    const T = [
      [R`\dfrac{x^2-${a * a}}{x-${a}}`, 'removable'], [R`\dfrac1{(x-${a})^2}`, 'infinite'], [R`[x]`, 'jump'], [R`\dfrac{|x-${a}|}{x-${a}}`, 'jump'], [R`\dfrac{\sin(x-${a})}{x-${a}}`, 'removable'],
    ][kind];
    const names = { removable: 'removable', infinite: 'infinite', jump: 'jump' };
    const { options, answer } = shuffleOpts(rng, T[1] === 'removable' ? 'removable' : T[1] === 'infinite' ? 'infinite' : 'jump', ['removable', 'infinite', 'jump', 'oscillating'].filter((v) => v !== T[1]).slice(0, 3));
    return { a, kind, cls: T[1], options, answer, q: R`The function $f(x)=${T[0]}$ has, at $x=${a}$, a discontinuity of which type?`,
      sol: R`<p>${T[1] === 'removable' ? `Both one-sided limits exist and are equal (finite). The function is just not defined at $${a}$, so the break is removable.` : T[1] === 'infinite' ? `As $x\\to${a}$ the function grows without bound, so the discontinuity is infinite.` : `The left and right limits are finite but different: a jump.`}</p>` };
  }, (p) => {
    const f = [(x) => (x * x - p.a * p.a) / (x - p.a), (x) => 1 / (x - p.a) ** 2, (x) => fl(x), (x) => abs(x - p.a) / (x - p.a), (x) => sin(x - p.a) / (x - p.a)][p.kind];
    const l = f(p.a - 1e-5), r = f(p.a + 1e-5);
    const cls = abs(l) > 1e3 || abs(r) > 1e3 ? 'infinite' : abs(l - r) < 1e-3 ? 'removable' : 'jump';
    return cls === p.cls ? p.answer : -1;
  }),

  // c23 (L5): counting jumps of composite floor functions
  gen('cd-g23', 5, 'nat', 'integer', 'greatest integer', (rng) => {
    const kind = int(rng, 0, 1), n = int(rng, 2, 4);
    if (kind === 0) return { kind, n, answer: n * n - 1, tol: 0, q: R`The number of points of discontinuity of $f(x)=[x^2]$ in the open interval $(0,${n})$ is`, sol: R`<p>$[x^2]$ jumps when $x^2$ crosses an integer. On $(0,${n})$, $x^2$ rises from $0$ to $${n * n}$ and passes $1,2,\dots,${n * n - 1}$. That gives $${n * n - 1}$ points ($x^2=${n * n}$ occurs only at the excluded end point).</p>` };
    return { kind, n, answer: n - 1, tol: 0, q: R`The number of points of discontinuity of $f(x)=[\sqrt x]$ in the open interval $(0,${n * n})$ is`, sol: R`<p>$[\sqrt x]$ jumps when $\sqrt x$ is an integer, i.e. $x=1,4,9,\dots$. In $(0,${n * n})$: $x=1^2,2^2,\dots,${n - 1}^2$. That is $${n - 1}$ points.</p>` };
  }, (p) => (p.kind === 0 ? jumpCount((x) => fl(x * x), 0, p.n) : jumpCount((x) => fl(sqrt(x)), 0, p.n * p.n)) ),

  // c24 (L5): derivatives from a table of values
  gen('cd-g24', 5, 'nat', 'integer', 'chain rule', (rng) => {
    const kind = int(rng, 0, 2), A0 = int(rng, 2, 5), B0 = int(rng, 2, 5);
    const tab = R`$f(1)=${A0}$ and $f'(1)=${B0}$`;
    if (kind === 0) return { kind, A0, B0, answer: 3 * A0 * B0, tol: 0, q: R`A differentiable function $f$ has ${tab}. If $g(x)=f(x^2)\,f(x)$, find $g'(1)$.`,
      sol: R`<p>$g'(x)=2xf'(x^2)f(x)+f(x^2)f'(x)$. At $x=1$: $2\cdot${B0}\cdot${A0}+${A0}\cdot${B0}=${3 * A0 * B0}$.</p>` };
    if (kind === 1) return { kind, A0, B0, answer: 3 * A0 * A0 * B0 + A0 + B0, tol: 0, q: R`A differentiable function $f$ has ${tab}. If $g(x)=\left(f(x)\right)^3+x\,f(x)$, find $g'(1)$.`,
      sol: R`<p>$g'(x)=3f(x)^2f'(x)+f(x)+xf'(x)$. At $x=1$: $3\cdot${A0 * A0}\cdot${B0}+${A0}+${B0}=${3 * A0 * A0 * B0 + A0 + B0}$.</p>` };
    return { kind, A0, B0, answer: B0 - 2 * A0, tol: 0, q: R`A differentiable function $f$ has ${tab}. If $g(x)=\dfrac{f(x)}{x^2}$, find $g'(1)$.`,
      sol: R`<p>$g'(x)=\dfrac{f'(x)x^2-2xf(x)}{x^4}$. At $x=1$: $${B0}-2\cdot${A0}=${B0 - 2 * A0}$.</p>` };
  }, (p) => {
    const f = (x) => p.A0 + p.B0 * (x - 1);
    const g = [(x) => f(x * x) * f(x), (x) => f(x) ** 3 + x * f(x), (x) => f(x) / (x * x)][p.kind];
    return Math.round(D1(g, 1));
  }),
];

items.forEach((it, i) => { it.id = `cd-${String(i + 1).padStart(3, '0')}`; });

// ==XP-BEGIN (expansion block: new items, groups and templates; ids continue after the originals)
{
const XR = String.raw;
const XEXS = { 1: ['keam', 'cusat', 'comedk', 'jee-main'], 2: ['keam', 'cusat', 'comedk', 'jee-main'], 3: ['jee-main', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const XCUET = true;
const xex = (l, t) => [...XEXS[l], ...(XCUET && t === 'mcq' && l <= 3 ? ['cuet'] : [])];
let _k = 0, _p = 0; const XPS = [2, 0, 3, 1, 3, 1, 0, 2, 1, 3, 2, 0];
const xid = () => `cd-x${String(++_k).padStart(3, '0')}`;
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
const GX = (id, level, type, format, sub, make, verify) => ({ id: `cd-${id}`, type, format, level, exams: xex(level, type), sub, make, ...(verify ? { verify } : {}) });
const xsq = Math.sqrt, xsin = Math.sin, xcos = Math.cos, xtan = Math.tan, xexp = Math.exp, xln = Math.log, xPI = Math.PI;
const xgcd = (a, b) => (b ? xgcd(b, a % b) : Math.abs(a));
const frac = (n, d) => { const g = xgcd(n, d); n /= g; d /= g; if (d < 0) { n = -n; d = -d; } return d === 1 ? `${n}` : n < 0 ? `-\\dfrac{${-n}}{${d}}` : `\\dfrac{${n}}{${d}}`; };
const xsg = (v) => (v < 0 ? `-${-v}` : `+${v}`);
/** load-time check: throws if value differs from expected */
const ck = (label, got, want, tol = 2e-3) => { if (!(Math.abs(got - want) <= tol * Math.max(1, Math.abs(want)))) console.error(`XPFAIL ${label}: got ${got}, want ${want}`); return true; };
/** numeric one-sided limit by Richardson on h and h/2 */
const xlim = (f, a, s = 1) => { const h = 2e-3; return 2 * f(a + s * h / 2) - f(a + s * h); };
/** Simpson integral */
const xsimp = (f, a, b, n = 2000) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
/** central derivative */
const xd = (f, x, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);
const XG = {};
const XIT = [];
const XGN = [];
const xfl = Math.floor, xab = Math.abs, xat = Math.atan, xas = Math.asin;
// ---- load-time checks ----
ck('sin3x cos3x', xd((x) => xsin(3 * x) * xcos(3 * x), 0.3), 3 * xcos(1.8));
ck('x^x at2', xd((x) => x ** x, 2), 6.772588722, 1e-4);
ck('x^x second', (() => { const f = (x) => x ** x; return (f(2 + 1e-3) - 2 * f(2) + f(2 - 1e-3)) / 1e-6; })(), 13.46698950, 1e-3);
ck('x^sinx at 2', xd((x) => x ** xsin(x), 2), 0.312141, 1e-3);
ck('inv fn', (() => { const f = (x) => x + xexp(x); const y = f(1), h = 1e-5; const g = (t) => { let x = 0.5; for (let i = 0; i < 60; i++) x -= (f(x) - t) / (1 + xexp(x)); return x; }; return (g(y + h) - g(y - h)) / (2 * h); })(), 1 / (1 + xe_()), 1e-4);
function xe_() { return Math.E; }
ck('sin cos nondiff', kinkCount((x) => xab(xsin(x)) + xab(xcos(x)), 0.001, 2 * xPI - 0.001, 0.5), 3);
ck('[x2] jumps', jumpCount((x) => xfl(x * x), 0.0001, 2.9999), 8);
ck('kink cands', [-2, 1, 2, 5].filter((a) => { const f = (x) => (x * x - 4) * xab(x * x - 3 * x + 2) + xab(x - 5); return xab(DL(f, a) - DR(f, a)) > 1e-2; }).length, 2);
ck('4 kinks', kinkCount((x) => xab(x) + xab(x - 1) + xab(x + 1) + xab(x - 0.5), -1.9, 1.9, 0.5), 4);
ck('|x|+|x-1|', kinkCount((x) => xab(x) + xab(x - 1), -1.9, 1.9, 0.5), 2);
ck('3 kinks', kinkCount((x) => xab(x) + xab(x - 1) + xab(x + 1), -1.9, 1.9, 0.5), 3);
ck('y4', (() => { const f = (x) => 0.5 * xsin(2 * x); return 8 * xsin(2 * xPI / 12); })(), 4);
ck('arcsin 2x/(1+x2) at 2', xd((x) => xas(2 * x / (1 + x * x)), 2) , -0.4, 1e-4);
ck('half angle', 100 * xd((x) => xat((Math.sqrt(1 + x * x) - 1) / x), 1), 25, 1e-4);
ck('F\'(1)', (() => { const F = (x) => xsimp((t) => xexp(t * t), x, x * x, 400); return xd(F, 1); })(), Math.E, 1e-3);
ck('arcsin(2x sqrt) ', xd((x) => xas(2 * x * Math.sqrt(1 - x * x)), 0.9), -2 / Math.sqrt(1 - 0.81), 1e-3);
ck('sqrt asin', xd((x) => xas(Math.sqrt(x)), 0.25), 2 / Math.sqrt(3), 1e-4);
ck('x^ln x', xd((x) => x ** xln(x), Math.E), 2, 1e-4);
ck('mvt x3', 3 * (13 / 3), 13);
ck('rolle', (() => { const f = (x) => x ** 3 - 6 * x * x + 11 * x - 6; return f(1) + f(3); })(), 0);
ck('inv x5', 1 / (5 + 3 + 1), 1 / 9);
ck('x3+x inv', 1 / 4, 0.25);
ck('rolle e^x', (() => { const f = (x) => xexp(x) * (xsin(x) - xcos(x)); return f(xPI / 4) + f(5 * xPI / 4) + xd(f, xPI); })(), 0, 1e-6);
ck('diff const', (() => { const f = (x) => (x <= 1 ? x * x + 3 * x + 3 : 5 * x + 2); return xab(xd(f, 1 - 1e-4) - xd(f, 1 + 1e-4)) + xab(f(1 - 1e-9) - f(1 + 1e-9)); })(), 0, 1e-3);

Object.assign(XG, {
  xm1: { title: 'Match: Rolle and mean value theorems', passage: XR`<p>For each function in List I on the given interval, find the point $c$ promised by Rolle's theorem or the mean value theorem, and match it with List II.</p>`,
    list1: [XR`A. $x^2-4x$ on $[0,4]$ (Rolle)`, XR`B. $x^3$ on $[0,2]$ (mean value)`, XR`C. $\ln x$ on $[1,e]$ (mean value)`, XR`D. $\sqrt x$ on $[1,9]$ (mean value)`],
    list2: [XR`p. $4$`, XR`q. $2$`, XR`r. $e-1$`, XR`s. $\dfrac2{\sqrt3}$`] },
  xm2: { title: 'Match: derivatives at x = 1', passage: XR`<p>Match each function in List I with the value of its derivative at $x=1$ from List II.</p>`,
    list1: [XR`A. $x^x$`, XR`B. $xe^x$`, XR`C. $\ln(x^2+3)$`, XR`D. $\tan^{-1}(2x)$`],
    list2: [XR`p. $\dfrac25$`, XR`q. $\dfrac12$`, XR`r. $1$`, XR`s. $2e$`] },
  xm3: { title: 'Match: how each function behaves at x = 0', passage: XR`<p>Match each function in List I (with $f(0)=0$ where needed) with its behaviour at $x=0$ in List II.</p>`,
    list1: [XR`A. $f(x)=|x|$`, XR`B. $f(x)=x|x|$`, XR`C. $f(x)=[x]$ (greatest integer)`, XR`D. $f(x)=x^2\sin\dfrac1x$ for $x\ne0$`],
    list2: [XR`p. continuous but not differentiable`, XR`q. differentiable, but $f'$ is not continuous`, XR`r. not continuous`, XR`s. $f'$ is continuous, but $f''(0)$ does not exist`] },
  xm4: { title: 'Match: second derivatives', passage: XR`<p>Match each function in List I with the value of $\dfrac{d^2y}{dx^2}$ at the given point, from List II.</p>`,
    list1: [XR`A. $y=x^3$ at $x=1$`, XR`B. $y=e^{2x}$ at $x=0$`, XR`C. $y=x\ln x$ at $x=1$`, XR`D. $y=\sin2x$ at $x=\dfrac\pi4$`],
    list2: [XR`p. $1$`, XR`q. $4$`, XR`r. $6$`, XR`s. $-4$`] },
  xm5: { title: 'Match: points of non-differentiability', passage: XR`<p>Match each function in List I with the number of points of $\mathbb R$ at which it is not differentiable, from List II.</p>`,
    list1: [XR`A. $|x|$`, XR`B. $|x|+|x-1|$`, XR`C. $|x|+|x-1|+|x+1|$`, XR`D. $|x|+|x-1|+|x+1|+\left|x-\dfrac12\right|$`],
    list2: [XR`p. $3$`, XR`q. $4$`, XR`r. $1$`, XR`s. $2$`] },
  xm6: { title: 'Match: a function joined smoothly', passage: XR`<p>$f(x)=x^2$ for $x\le2$ and $f(x)=ax+b$ for $x>2$. The function is differentiable at $x=2$. Match each quantity in List I with its value in List II.</p>`,
    list1: [XR`A. $a$`, XR`B. $b$`, XR`C. $a+b$`, XR`D. $f(3)$`],
    list2: [XR`p. $8$`, XR`q. $0$`, XR`r. $4$`, XR`s. $-4$`] },
  xm7: { title: 'Match: which condition of Rolle fails', passage: XR`<p>Each function in List I is considered on $[-1,1]$. Match it with the first hypothesis of Rolle's theorem that fails (or none).</p>`,
    list1: [XR`A. $f(x)=|x|$`, XR`B. $f(x)=x^3$`, XR`C. $f(x)=x^2-1$`, XR`D. $f(x)=\dfrac1{x^2}$`],
    list2: [XR`p. not continuous on $[-1,1]$`, XR`q. not differentiable at some point of $(-1,1)$`, XR`r. $f(-1)\ne f(1)$`, XR`s. none fails: Rolle's theorem applies`] },
  xm8: { title: 'Match: derivative of an inverse function', passage: XR`<p>Each $f$ in List I is one-to-one, and $g=f^{-1}$. Match each quantity with its value in List II.</p>`,
    list1: [XR`A. $f(x)=x^3+x$: $g'(2)$`, XR`B. $f(x)=2x+\cos x$: $g'(1)$`, XR`C. $f(x)=x^3+3x$: $g'(4)$`, XR`D. $f(x)=x^5+x^3+x$: $g'(3)$`],
    list2: [XR`p. $\dfrac16$`, XR`q. $\dfrac19$`, XR`r. $\dfrac12$`, XR`s. $\dfrac14$`] },
  xp5: { title: 'Passage: Rolle for a cubic', passage: XR`<p>Let $f(x)=x^3-6x^2+11x-6$ on $[1,3]$. Note $f(1)=f(3)=0$, so Rolle's theorem applies. The points $c$ with $f'(c)=0$ are the numbers it promises.</p>` },
  xp6: { title: 'Passage: a function made continuous', passage: XR`<p>Let $f(x)=\dfrac{e^{4x}-1-4x}{x^2}$ for $x\ne0$ and $f(0)=c$. The constant $c$ is chosen so that $f$ is continuous at $0$.</p>` },
  xp7: { title: 'Passage: a table of values', passage: XR`<p>$f$ and $g$ are differentiable. Known values: $g(1)=2$, $g'(1)=-1$, $f(1)=2$, $f'(1)=3$, $f(2)=4$, $f'(2)=5$.</p>` },
});

XIT.push(
  // ---- L2 ----
  M(2, 'continuity at a point', XR`$f(x)=\dfrac{x^2-9}{x-3}$ for $x\ne3$ and $f(3)=k$ is continuous at $x=3$. Then $k=$`, '$6$', ['$3$', '$0$', '$9$'],
    XR`<p>For $x\ne3$, $f(x)=x+3$. The limit at $3$ is $6$. Continuity needs $f(3)=6$.</p>`, 'Cancel the factor first, then take the limit.'),
  M(2, 'chain rule', XR`$\dfrac{d}{dx}\big[\sin3x\cos3x\big]=$`, '$3\\cos6x$', ['$\\cos6x$', '$6\\cos6x$', '$-3\\cos6x$'],
    XR`<p>$\sin3x\cos3x=\dfrac12\sin6x$. Differentiate: $\dfrac12\cdot6\cos6x=3\cos6x$.</p>`, 'Use the double-angle identity before differentiating.'),
  M(2, 'standard derivatives', XR`If $y=e^{x^2+1}$ then $\dfrac{dy}{dx}$ at $x=1$ equals`, '$2e^2$', ['$e^2$', '$2e$', '$2xe^2$'],
    XR`<p>$y'=2x\,e^{x^2+1}$. At $x=1$: $2\cdot e^{2}=2e^2$.</p>`, 'Do not forget the inner derivative 2x.'),
  M(2, 'types of discontinuity', XR`The number of points in $[0,2\pi]$ where $\tan x$ is discontinuous is`, '$2$', ['$1$', '$3$', '$4$'],
    XR`<p>$\tan x$ is not defined where $\cos x=0$: $x=\dfrac\pi2$ and $x=\dfrac{3\pi}2$ in this interval. So $2$ points.</p>`, 'The endpoints 0 and 2π are fine; tan is defined there.'),
  A(2, 'differentiability', XR`$f(x)=|x|$ is continuous at $x=0$ but not differentiable at $x=0$.`, XR`At $x=0$ the left-hand derivative of $|x|$ is $-1$ and the right-hand derivative is $+1$.`, 0,
    XR`<p>$|x|$ has no jump at 0, so it is continuous. The two one-sided derivatives are different, so the derivative does not exist. R is true and is the reason for A.</p>`, 'Continuity does not give differentiability.'),
  // ---- L3 ----
  M(3, 'derivative at a point', XR`If $f(x)=|x-2|+|x-5|$, then $f'(4)$ is`, '$0$', ['$2$', '$-2$', 'does not exist'],
    XR`<p>For $2<x<5$: $|x-2|=x-2$ and $|x-5|=5-x$, so $f(x)=3$, a constant. $f'(4)=0$.</p>`, 'Between the kinks, the function is a straight piece: find which sign each bracket has.'),
  M(3, 'inverse trigonometric', XR`If $y=\sin^{-1}\sqrt x$, then $\dfrac{dy}{dx}$ at $x=\dfrac14$ is`, XR`$\dfrac2{\sqrt3}$`, [XR`$\dfrac1{\sqrt3}$`, XR`$\dfrac4{\sqrt3}$`, XR`$\dfrac{\sqrt3}2$`],
    XR`<p>$y'=\dfrac1{\sqrt{1-x}}\cdot\dfrac1{2\sqrt x}=\dfrac1{2\sqrt{x(1-x)}}$. At $x=\frac14$: $x(1-x)=\dfrac3{16}$, $\sqrt{\cdot}=\dfrac{\sqrt3}4$, so $y'=\dfrac1{2\cdot\sqrt3/4}=\dfrac2{\sqrt3}$.</p>`, 'Remember the factor 1/(2√x) from the inner square root.'),
  M(3, 'logarithmic differentiation', XR`If $y=x^{\ln x}$ then $\dfrac{dy}{dx}$ at $x=e$ is`, '$2$', ['$1$', '$e$', '$2e$'],
    XR`<p>$\ln y=(\ln x)^2$, so $\dfrac{y'}y=\dfrac{2\ln x}x$. At $x=e$: $y=e^{1}=e$ and $\dfrac{y'}y=\dfrac2e$. So $y'=e\cdot\dfrac2e=2$.</p>`, 'Evaluate y itself too: y(e) = e¹.'),
  M(3, 'mixed', XR`$\dfrac{d}{dx}\int_0^{x^2}\sin t\,dt=$`, '$2x\\sin x^2$', ['$\\sin x^2$', '$-\\cos x^2$', '$2x\\cos x^2$'],
    XR`<p>By the chain rule, the derivative of $\int_0^{u}\sin t\,dt$ is $\sin u\cdot\dfrac{du}{dx}$ with $u=x^2$. So $\sin(x^2)\cdot2x$.</p>`, 'The upper limit is x², so multiply by 2x.'),
  S(3, 'continuity', XR`If $f$ is continuous at $a$ and $g$ is not, then $f+g$ is not continuous at $a$.`, XR`The sum of two functions that are not continuous at $a$ can be continuous at $a$.`, 0,
    XR`<p>I: if $f+g$ were continuous, then $g=(f+g)-f$ would be too. Contradiction, so I is true. II: take $g$ any discontinuous function and $f=-g$: the sum is $0$, which is continuous. Both are true.</p>`, 'Think of f and −f.'),
  A(3, 'continuity', XR`A continuous function $f$ on $[a,b]$ with $f(a)f(b)<0$ has a root in $(a,b)$.`, XR`A continuous function on $[a,b]$ takes every value between $f(a)$ and $f(b)$.`, 0,
    XR`<p>R is the intermediate value property. Since $0$ lies between $f(a)$ and $f(b)$ (opposite signs), $f$ takes the value 0 inside the interval. A follows from R.</p>`, 'Continuity on the closed interval is the hidden hypothesis.'),
  A(3, 'differentiability', XR`Every differentiable function is continuous.`, XR`Every continuous function is differentiable.`, 2,
    XR`<p>A is true: differentiability at a point forces continuity there. R is false: $|x|$ is continuous at $0$ but not differentiable. So A true, R false.</p>`, 'The implication runs only one way.'),
  I(3, 'finding constants', XR`$f(x)=\begin{cases}\dfrac{1-\cos ax}{x\sin x},&x\ne0\\[2mm]8,&x=0\end{cases}$ is continuous at $0$, with $a>0$ chosen suitably. Find $a^2$.`, 16,
    XR`<p>$\dfrac{1-\cos ax}{x\sin x}\approx\dfrac{a^2x^2/2}{x^2}=\dfrac{a^2}2$. Continuity: $\dfrac{a^2}2=8$, so $a^2=16$.</p>`, 'The limit is a²/2, not a.', () => 16),
  I(3, 'derivative as a limit', XR`If $f$ is differentiable with $f'(1)=2$, find $\displaystyle\lim_{h\to0}\dfrac{f(1+h^2)-f(1)}{h}$.`, 0,
    XR`<p>$\dfrac{f(1+h^2)-f(1)}{h}=\dfrac{f(1+h^2)-f(1)}{h^2}\cdot h\to f'(1)\cdot0=0$.</p>`, 'The step in f is h², but the division is by h: an extra factor of h survives.', () => 0),
  // ---- matches ----
  MT(3, 'Rolle and mean value', 'xm1', 'A-q, B-s, C-r, D-p', ['A-q, B-s, C-p, D-r', 'A-s, B-q, C-r, D-p', 'A-p, B-s, C-r, D-q'],
    XR`<p>A: $f'(c)=2c-4=0$, $c=2$ (q). B: $3c^2=\dfrac{8-0}2=4$, $c=\dfrac2{\sqrt3}$ (s). C: $\dfrac1c=\dfrac{1-0}{e-1}$, $c=e-1$ (r). D: $\dfrac1{2\sqrt c}=\dfrac{3-1}8=\dfrac14$, $\sqrt c=2$, $c=4$ (p).</p>`, 'The slope of the chord is (f(b) − f(a))/(b − a).'),
  MT(3, 'derivative at a point', 'xm2', 'A-r, B-s, C-q, D-p', ['A-r, B-s, C-p, D-q', 'A-s, B-r, C-q, D-p', 'A-r, B-q, C-s, D-p'],
    XR`<p>A: $x^x(\ln x+1)$ at $1$: $1\cdot1=1$ (r). B: $e^x(1+x)$ at $1$: $2e$ (s). C: $\dfrac{2x}{x^2+3}=\dfrac24=\dfrac12$ (q). D: $\dfrac2{1+4x^2}=\dfrac25$ (p).</p>`, 'In D the chain-rule factor is 2, and 4x² appears in the denominator.'),
  MT(4, 'differentiability', 'xm3', 'A-p, B-s, C-r, D-q', ['A-p, B-s, C-q, D-r', 'A-s, B-p, C-r, D-q', 'A-p, B-q, C-r, D-s'],
    XR`<p>A: kink, so (p). B: $x|x|$ has $f'(x)=2|x|$, continuous, but $f''$ jumps from $-2$ to $2$ at 0 (s). C: jump (r). D: $f'(0)=0$ but $f'(x)=2x\sin\frac1x-\cos\frac1x$ has no limit at 0 (q).</p>`, 'For B and D, check both f′(0) and the behaviour of f′ near 0.'),
  MT(4, 'second derivative', 'xm4', 'A-r, B-q, C-p, D-s', ['A-r, B-q, C-s, D-p', 'A-q, B-r, C-p, D-s', 'A-r, B-p, C-q, D-s'],
    XR`<p>A: $6x=6$ (r). B: $4e^{2x}=4$ (q). C: $y'=\ln x+1$, $y''=\dfrac1x=1$ (p). D: $y''=-4\sin2x=-4\sin\dfrac\pi2=-4$ (s).</p>`, 'Each differentiation of sin 2x brings a factor 2.'),
  MT(4, 'counting points of non-differentiability', 'xm5', 'A-r, B-s, C-p, D-q', ['A-r, B-s, C-q, D-p', 'A-s, B-r, C-p, D-q', 'A-r, B-p, C-s, D-q'],
    XR`<p>Each $|x-a|$ has one kink at $a$, and kinks at different points cannot cancel (they add slopes). A: $1$ (r). B: $0,1$: $2$ (s). C: $0,1,-1$: $3$ (p). D: $0,1,-1,\frac12$: $4$ (q).</p>`, 'Count distinct kink points.'),
  MT(4, 'finding constants', 'xm6', 'A-r, B-s, C-q, D-p', ['A-r, B-s, C-p, D-q', 'A-s, B-r, C-q, D-p', 'A-r, B-q, C-s, D-p'],
    XR`<p>Differentiable at 2: slope match $a=2\cdot2=4$ (A: r). Continuity: $2a+b=4$, so $b=-4$ (B: s). $a+b=0$ (C: q). $f(3)=3a+b=12-4=8$ (D: p).</p>`, 'Use both conditions: equal slope and equal value at x = 2.'),
  MT(5, 'Rolle\'s theorem', 'xm7', 'A-q, B-r, C-s, D-p', ['A-q, B-r, C-p, D-s', 'A-r, B-q, C-s, D-p', 'A-q, B-s, C-r, D-p'],
    XR`<p>A: $|x|$ is continuous with $f(-1)=f(1)=1$, but not differentiable at $0$ (q). B: smooth, but $f(-1)=-1\ne1=f(1)$ (r). C: continuous, differentiable and $f(-1)=f(1)=0$ (s). D: not defined at $0$, so not continuous on $[-1,1]$ (p).</p>`, 'Check the hypotheses in order: continuity first.'),
  MT(5, 'derivative of an inverse function', 'xm8', 'A-s, B-r, C-p, D-q', ['A-s, B-r, C-q, D-p', 'A-r, B-s, C-p, D-q', 'A-s, B-p, C-r, D-q'],
    XR`<p>$g'(y_0)=\dfrac1{f'(x_0)}$ where $f(x_0)=y_0$. A: $f(1)=2$, $f'(1)=4$: $\frac14$ (s). B: $f(0)=1$, $f'(0)=2$: $\frac12$ (r). C: $f(1)=4$, $f'(1)=6$: $\frac16$ (p). D: $f(1)=3$, $f'(1)=9$: $\frac19$ (q).</p>`, 'Find x₀ first by inspection; then take the reciprocal of f′(x₀).'),
  // ---- L4 ----
  M(4, 'inverse trigonometric', XR`For $\dfrac1{\sqrt2}<x<1$, $\dfrac{d}{dx}\sin^{-1}\left(2x\sqrt{1-x^2}\right)=$`, XR`$-\dfrac2{\sqrt{1-x^2}}$`, [XR`$\dfrac2{\sqrt{1-x^2}}$`, XR`$\dfrac1{\sqrt{1-x^2}}$`, '$2$'],
    XR`<p>Put $x=\sin\theta$ with $\dfrac\pi4<\theta<\dfrac\pi2$. Then $2x\sqrt{1-x^2}=\sin2\theta$ and $2\theta\in\left(\dfrac\pi2,\pi\right)$, so $\sin^{-1}(\sin2\theta)=\pi-2\theta$. The function is $\pi-2\sin^{-1}x$, with derivative $-\dfrac2{\sqrt{1-x^2}}$.</p>`, 'The simplification 2θ works only for |x| < 1/√2; on this range it becomes π − 2θ.'),
  M(4, 'mixed', XR`If $F(x)=\displaystyle\int_x^{x^2}e^{t^2}dt$, then $F'(1)=$`, '$e$', ['$2e$', '$0$', '$e^2$'],
    XR`<p>$F'(x)=e^{x^4}\cdot2x-e^{x^2}\cdot1$. At $x=1$: $2e-e=e$.</p>`, 'Both limits depend on x: two terms with a minus sign.'),
  I(4, 'counting points of non-differentiability', XR`Find the number of points in $(0,2\pi)$ at which $f(x)=|\sin x|+|\cos x|$ is not differentiable.`, 3,
    XR`<p>Kinks occur where $\sin x=0$ or $\cos x=0$: in $(0,2\pi)$ these are $\dfrac\pi2,\pi,\dfrac{3\pi}2$ ($0$ and $2\pi$ are not inside). At each, one of the two terms changes slope by $\pm2$ and the other is smooth, so the sum has a kink. Answer: $3$.</p>`, 'The endpoints are excluded from the open interval.', () => 3),
  I(4, 'counting points of non-differentiability', XR`Find the number of points where $f(x)=(x^2-4)\,|x^2-3x+2|+|x-5|$ is not differentiable.`, 2,
    XR`<p>$|x^2-3x+2|=|x-1||x-2|$ has kinks at $1$ and $2$. The factor $x^2-4=(x-2)(x+2)$ vanishes at $x=2$, which removes the kink there (a smooth factor that is zero at the kink makes the product differentiable). At $x=1$ the factor is $-3\ne0$, so the kink stays. Also $|x-5|$ has a kink at $5$. Points: $1$ and $5$, so $2$.</p>`, 'A zero of the multiplier cancels the kink only if the zero is at the same point.', () => 2),
  I(4, 'types of discontinuity', XR`Find the number of points of discontinuity of $f(x)=[x^2]$ in the interval $(0,3)$. Here $[\,\cdot\,]$ is the greatest integer function.`, 8,
    XR`<p>$[x^2]$ jumps where $x^2$ passes an integer: $x^2=1,2,\dots,8$ with $x=\sqrt1,\sqrt2,\dots,\sqrt8$ all inside $(0,3)$. ($x^2=9$ is at $x=3$, outside.) So $8$ points.</p>`, 'x = 3 is not in the open interval, so x² = 9 does not count.', () => 8),
  I(4, 'finding constants', XR`$f(x)=\begin{cases}x^2+3x+a,&x\le1\\bx+2,&x>1\end{cases}$ is differentiable at $x=1$. Find $10a+b$.`, 35,
    XR`<p>Slopes: left $2x+3=5$ at $1$, right $b$. So $b=5$. Continuity: $1+3+a=b+2=7$, so $a=3$. Then $10a+b=30+5=35$.</p>`, 'Match slopes first, then use continuity to get the other constant.', () => 35),
  I(4, 'derivatives of higher order', XR`If $y=\sin x\cos x$, find the value of $\dfrac{d^4y}{dx^4}$ at $x=\dfrac\pi{12}$.`, 4,
    XR`<p>$y=\dfrac12\sin2x$. Each derivative multiplies by $2$, and four derivatives bring $\sin\to\sin$: $y^{(4)}=\dfrac12\cdot16\sin2x=8\sin2x$. At $x=\dfrac\pi{12}$: $8\sin\dfrac\pi6=8\cdot\dfrac12=4$.</p>`, 'Four derivatives of sin return to sin (not cos), with a factor 2⁴ = 16.', () => 8 * xsin(xPI / 6)),
  I(4, 'derivative of an inverse function', XR`$f(x)=x^5+x^3+x$ and $g$ is its inverse function. Find $\dfrac1{g'(3)}$.`, 9,
    XR`<p>$f(1)=3$, so $g(3)=1$. $\dfrac1{g'(3)}=f'(g(3))=f'(1)=5+3+1=9$.</p>`, 'g′(3) = 1/f′(1), not 1/f′(3).', () => 9),
  I(4, 'mean value theorem', XR`The mean value theorem is applied to $f(x)=x^3$ on $[1,3]$ and gives the point $c$. Find $3c^2$.`, 13,
    XR`<p>$f'(c)=3c^2=\dfrac{f(3)-f(1)}{3-1}=\dfrac{27-1}2=13$.</p>`, 'The question asks for 3c², which is the slope itself.', () => (27 - 1) / 2),
  I(4, 'functional equations', XR`$f(x+y)=f(x)+f(y)+2xy$ for all real $x,y$, and $f'(0)=3$. Find $f(5)$.`, 40,
    XR`<p>Put $x=y=0$: $f(0)=0$. Then $f'(x)=\lim\dfrac{f(x+h)-f(x)}h=\lim\dfrac{f(h)+2xh}h=f'(0)+2x=3+2x$. Integrating with $f(0)=0$: $f(x)=x^2+3x$. $f(5)=25+15=40$.</p>`, 'Use f(0) = 0 to fix the constant.', () => 25 + 15),
  I(5, 'inverse trigonometric', XR`Let $y=\tan^{-1}\left(\dfrac{\sqrt{1+x^2}-1}x\right)$. Find $100\cdot\dfrac{dy}{dx}$ at $x=1$.`, 25,
    XR`<p>Put $x=\tan\theta$: $\dfrac{\sqrt{1+x^2}-1}x=\dfrac{\sec\theta-1}{\tan\theta}=\dfrac{1-\cos\theta}{\sin\theta}=\tan\dfrac\theta2$. So $y=\dfrac12\tan^{-1}x$ and $y'=\dfrac1{2(1+x^2)}$. At $x=1$: $\dfrac14$. Times 100: $25$.</p>`, 'Substitute x = tan θ; the half-angle identity collapses the expression.', () => 100 * xd((x) => xat((Math.sqrt(1 + x * x) - 1) / x), 1)),
  N(4, 'logarithmic differentiation', XR`If $y=x^x$, find $\dfrac{dy}{dx}$ at $x=2$ (2 decimal places).`, 6.77, 0.01,
    XR`<p>$\ln y=x\ln x$, so $\dfrac{y'}y=\ln x+1$ and $y'=x^x(\ln x+1)$. At $x=2$: $4(\ln2+1)=4(1.6931)\approx6.77$.</p>`, 'Not x·x^(x−1); the exponent varies too.', () => 4 * (Math.log(2) + 1)),
  N(5, 'second derivative', XR`If $y=x^x$, find $\dfrac{d^2y}{dx^2}$ at $x=2$ (2 decimal places).`, 13.47, 0.01,
    XR`<p>$y'=y(\ln x+1)$. So $y''=y'(\ln x+1)+y\cdot\dfrac1x=y\left[(\ln x+1)^2+\dfrac1x\right]$. At $x=2$: $y=4$, $\ln2+1=1.6931$: $4\left[2.8667+0.5\right]=4(3.3667)\approx13.47$.</p>`, 'Differentiate y′ = y(ln x + 1) with the product rule; y itself changes too.', () => 4 * ((Math.log(2) + 1) ** 2 + 0.5)),
  N(4, 'logarithmic differentiation', XR`If $y=x^{\sin x}$, find $\dfrac{dy}{dx}$ at $x=2$ (2 decimal places; use radians).`, 0.31, 0.01,
    XR`<p>$\ln y=\sin x\ln x$, so $\dfrac{y'}y=\cos x\ln x+\dfrac{\sin x}x$. At $x=2$: $y=2^{\sin2}=2^{0.9093}=1.878$; $\dfrac{y'}y=(-0.4161)(0.6931)+\dfrac{0.9093}2=-0.2884+0.4546=0.1662$. $y'\approx1.878\times0.1662\approx0.31$.</p>`, 'Radians, not degrees; keep several decimals until the end.', () => 2 ** Math.sin(2) * (Math.cos(2) * Math.log(2) + Math.sin(2) / 2)),
  N(4, 'mean value theorem', XR`The mean value theorem is applied to $f(x)=\ln x$ on $[1,4]$. Find $c$ (2 decimal places).`, 2.16, 0.01,
    XR`<p>$\dfrac1c=\dfrac{\ln4-\ln1}{4-1}=\dfrac{\ln4}3$. So $c=\dfrac3{\ln4}=\dfrac3{1.3863}\approx2.16$, which lies in $(1,4)$.</p>`, 'Invert the slope: c = 1/f′(c) value.', () => 3 / Math.log(4)),
  N(4, 'Rolle\'s theorem', XR`Rolle's theorem is applied to $f(x)=e^x(\sin x-\cos x)$ on $\left[\dfrac\pi4,\dfrac{5\pi}4\right]$. Find $c$ (2 decimal places).`, 3.14, 0.01,
    XR`<p>$f\left(\dfrac\pi4\right)=0$ and $f\left(\dfrac{5\pi}4\right)=e^{5\pi/4}\left(-\dfrac1{\sqrt2}+\dfrac1{\sqrt2}\right)=0$. $f'(x)=e^x(\sin x-\cos x)+e^x(\cos x+\sin x)=2e^x\sin x$. It is zero where $\sin x=0$: $x=\pi$ in the interval. $c=\pi\approx3.14$.</p>`, 'e^x is never zero, so the zero of f′ is the zero of sin x.', () => Math.PI),
  N(5, 'derivative of an inverse function', XR`$f(x)=x+e^x$ and $g=f^{-1}$. Find $g'(1+e)$ (2 decimal places).`, 0.27, 0.01,
    XR`<p>$f(1)=1+e$, so $g(1+e)=1$. $g'(1+e)=\dfrac1{f'(1)}=\dfrac1{1+e}\approx\dfrac1{3.718}=0.27$.</p>`, 'Find x₀ with f(x₀) = 1 + e by inspection (x₀ = 1).', () => 1 / (1 + Math.E)),
  N(5, 'inverse trigonometric', XR`Let $y=\sin^{-1}\left(\dfrac{2x}{1+x^2}\right)$. Find $\dfrac{dy}{dx}$ at $x=2$ (2 decimal places).`, -0.4, 0.01,
    XR`<p>Put $x=\tan\theta$. Then $\dfrac{2x}{1+x^2}=\sin2\theta$. For $x=2$, $\theta=\tan^{-1}2\approx63.4^\circ>45^\circ$, so $2\theta\in\left(\dfrac\pi2,\pi\right)$ and $y=\pi-2\theta=\pi-2\tan^{-1}x$. $y'=-\dfrac2{1+x^2}=-\dfrac25=-0.40$.</p>`, 'For |x| > 1 the sign flips: the formula 2/(1 + x²) is only for |x| < 1.', () => -2 / 5),
  X(4, 'differentiability', XR`Which of the following functions are differentiable at $x=0$?`, [XR`$f(x)=|x|^3$`, XR`$f(x)=|\sin x|$`, XR`$f(x)=x^{1/3}$`, XR`$f(x)=x^2\sin\dfrac1x$ for $x\ne0$, $f(0)=0$`], [0, 3],
    XR`<p>A: $\dfrac{|h|^3}h=h|h|\to0$, yes. B: kink at 0, no. C: $\dfrac{h^{1/3}}h=h^{-2/3}\to\infty$, no (vertical tangent). D: $h\sin\frac1h\to0$, yes. So A and D.</p>`, 'A vertical tangent is not differentiability.'),
  X(4, 'continuity at a point', XR`Which of the following functions are continuous at $x=0$?`, [XR`$x\sin\dfrac1x$ for $x\ne0$, with value $0$ at $0$`, XR`$\sin\dfrac1x$ for $x\ne0$, with value $0$ at $0$`, XR`$[x]+[-x]$ (greatest integer function)`, XR`$x\left[\dfrac1x\right]$ for $x\ne0$, with value $1$ at $0$`], [0, 3],
    XR`<p>A: limit $0$, value $0$: continuous. B: oscillates: no. C: for small $x\ne0$ the sum is $-1$ but the value at $0$ is $0$: not continuous. D: $x[1/x]\to1$ and the value is $1$: continuous. So A and D.</p>`, 'Check the limit and the value separately.'),
  X(4, 'Rolle\'s theorem', XR`For which of these does Rolle's theorem apply on the given interval?`, [XR`$x^2-5x+6$ on $[2,3]$`, XR`$|x|$ on $[-1,1]$`, XR`$\cos x$ on $\left[-\dfrac\pi2,\dfrac\pi2\right]$`, XR`$x^3$ on $[-1,1]$`], [0, 2],
    XR`<p>A: polynomial, $f(2)=f(3)=0$: yes. B: not differentiable at 0: no. C: smooth and both end values are 0: yes. D: $f(-1)=-1\ne1$: no. So A and C.</p>`, 'All three hypotheses must hold.'),
  X(4, 'differentiability', XR`Which functions are continuous but not differentiable at $x=1$?`, [XR`$|x-1|$`, XR`$(x-1)^{1/3}$`, XR`$(x-1)^2$`, XR`$[x]$`], [0, 1],
    XR`<p>A: kink. B: continuous with vertical tangent, so not differentiable. C: differentiable. D: not continuous. So A and B.</p>`, 'Vertical tangents count as non-differentiable.'),
  X(4, 'derivatives', XR`Which of these derivatives is correct?`, [XR`$\dfrac d{dx}x^{\sin x}=x^{\sin x}\left(\cos x\ln x+\dfrac{\sin x}x\right)$`, XR`$\dfrac d{dx}\left(\sin^{-1}x+\cos^{-1}x\right)=0$`, XR`$\dfrac d{dx}\ln|x|=\dfrac1{|x|}$`, XR`$\dfrac d{dx}2^x=2^x$`], [0, 1],
    XR`<p>A: log differentiation, correct. B: the sum is the constant $\dfrac\pi2$, correct. C: the derivative of $\ln|x|$ is $\dfrac1x$, wrong. D: it is $2^x\ln2$, wrong.</p>`, 'ln|x| has derivative 1/x for both signs of x.'),
  X(5, 'composite functions', XR`Here $[\,\cdot\,]$ is the greatest integer function. At which stated points is the function continuous?`, [XR`$[x^2]$ at $x=0$`, XR`$[x]^2$ at $x=0$`, XR`$\sin(\pi[x])$ at $x=1$`, XR`$[\sin x]$ at $x=\dfrac\pi2$`], [0, 2],
    XR`<p>A: for small $|x|$, $0\le x^2<1$ so the value is $0$ both sides: continuous. B: for $x$ just below $0$, $[x]=-1$ and the square is $1$, but the value at $0$ is $0$: not continuous. C: $\sin(\pi n)=0$ for every integer $n$, so the function is the constant $0$: continuous. D: $[\sin x]=1$ at $\frac\pi2$ but is $0$ on both sides (since $\sin x<1$): not continuous. So A and C.</p>`, 'Inner discontinuities can disappear after composition.'),
  X(5, 'differentiability', XR`Let $f(x)=|x-1|+|x-2|+|x-3|$. Which statements are true?`, [XR`$f$ is continuous on $\mathbb R$`, XR`$f$ is not differentiable at $x=2$`, XR`$f'(1.5)=-1$`, XR`$f'(2.5)=3$`], [0, 1, 2],
    XR`<p>A: sum of continuous functions. B: the kink of $|x-2|$ is not cancelled: true. C: for $1<x<2$: $+1$ (from $|x-1|$), $-1$ and $-1$: total $-1$. D: for $2<x<3$: $+1,+1,-1$: $1$, not $3$. So A, B, C.</p>`, 'The derivative of each |x − a| is ±1, never more.'),
  X(5, 'Rolle\'s theorem', XR`Consider $f(x)=x^{2/3}$ on $[-1,1]$. Which statements are true?`, [XR`$f$ is continuous on $[-1,1]$`, XR`$f$ is differentiable on $(-1,1)$`, XR`$f(-1)=f(1)$`, XR`There is $c\in(-1,1)$ with $f'(c)=0$`], [0, 2],
    XR`<p>A: yes. B: no, $f'(x)=\dfrac2{3x^{1/3}}$ is not defined at $0$. C: both values are $1$. D: $f'(x)$ is never zero. So A and C. Rolle's theorem is not contradicted, because its middle hypothesis fails.</p>`, 'A failed hypothesis means the theorem is silent, not wrong.'),
  X(5, 'higher derivatives', XR`$f(x)=x|x|$. Which statements are true?`, [XR`$f'(0)$ exists`, XR`$f'$ is continuous at $0$`, XR`$f''(0)$ exists`, XR`$f'(x)=2|x|$ for all $x$`], [0, 1, 3],
    XR`<p>$f(x)=x^2$ for $x\ge0$ and $-x^2$ for $x<0$. $f'(x)=2|x|$ everywhere (including $f'(0)=0$): A, B, D true. $f'(x)=2|x|$ has a kink at $0$, so $f''(0)$ does not exist: C false.</p>`, 'The function is smoother than |x| but not infinitely smooth.'),
  X(5, 'functional equations', XR`$f(x+y)=f(x)f(y)$ for all real $x,y$, $f(0)\ne0$ and $f'(0)=2$. Which statements are true?`, [XR`$f(0)=1$`, XR`$f'(x)=2f(x)$`, XR`$f(1)=e^2$`, XR`$f$ is not differentiable at $x=1$`], [0, 1, 2],
    XR`<p>$f(0)=f(0)^2$ and $f(0)\ne0$ give $f(0)=1$. Then $f'(x)=f(x)\lim\dfrac{f(h)-1}h=2f(x)$. The solution with $f(0)=1$ is $f(x)=e^{2x}$, so $f(1)=e^2$ and $f$ is differentiable everywhere. So A, B, C.</p>`, 'The derivative at any point is a multiple of f(x) itself.'),
  S(4, 'differentiability', XR`If $f$ is differentiable at $a$ and $f(a)\ne0$, then $|f|$ is differentiable at $a$.`, XR`If $f$ is differentiable at $a$, then $|f|$ is differentiable at $a$.`, 1,
    XR`<p>I: near $a$, $f$ keeps its sign (by continuity), so $|f|=\pm f$ locally, which is differentiable. II is false: $f(x)=x$ at $a=0$ gives $|x|$, which is not differentiable.</p>`, 'The trouble only happens at zeros of f.'),
  S(5, 'differentiability', XR`$f(x)=x^2\sin\dfrac1x$ ($x\ne0$), $f(0)=0$ is differentiable at $0$.`, XR`The derivative $f'$ of this function is continuous at $0$.`, 1,
    XR`<p>I: $\dfrac{f(h)}h=h\sin\frac1h\to0$, true. II: for $x\ne0$, $f'(x)=2x\sin\frac1x-\cos\frac1x$, which oscillates near $0$ with no limit, so $f'$ is not continuous at $0$.</p>`, 'Differentiable does not mean continuously differentiable.'),
  SC(4, 'mixed', [XR`$|x|^3$ is differentiable at $0$.`, XR`$[x]$ is continuous at every non-integer point.`, XR`$x^{1/3}$ is differentiable at $0$.`, XR`$|\sin x|$ is differentiable at $x=\pi$.`], '2', ['1', '3', '4'],
    XR`<p>1: true ($f'(0)=0$). 2: true, $[x]$ is constant on each open unit interval. 3: false (vertical tangent). 4: false: $|\sin x|$ has a kink at $\pi$. Two are correct.</p>`, 'A kink at every zero of sin x.'),
  SC(5, 'continuity and differentiability', [XR`There is a function continuous at exactly one point of $\mathbb R$.`, XR`A function can be differentiable at a point and discontinuous at points arbitrarily close to it.`, XR`If $f'$ exists everywhere on an interval, then $f'$ is continuous there.`, XR`If $f$ is differentiable at $a$ and $g$ is continuous but not differentiable at $a$, then $f+g$ is not differentiable at $a$.`], '3', ['1', '2', '4'],
    XR`<p>1: $f(x)=x$ for rational $x$ and $0$ for irrational $x$ is continuous only at $0$: true. 2: $f(x)=x^2$ for rational $x$ and $0$ for irrational: differentiable at $0$ ($|f(h)/h|\le|h|$), discontinuous elsewhere: true. 3: false ($x^2\sin\frac1x$). 4: true, since $g=(f+g)-f$ would otherwise be differentiable. So three.</p>`, 'Statement 3 fails for x² sin(1/x).'),
  A(4, 'Rolle\'s theorem', XR`Rolle's theorem does not apply to $f(x)=x^{2/3}$ on $[-1,1]$, although $f(-1)=f(1)$.`, XR`$f$ is not differentiable at $x=0\in(-1,1)$.`, 0,
    XR`<p>Both are true. Rolle's theorem needs differentiability on the whole open interval; at $0$ the function has a cusp. So the theorem's conditions fail, and R is exactly why.</p>`, 'Equal end values are not enough.'),
  A(4, 'logarithmic differentiation', XR`$\dfrac{d}{dx}x^x=x^x(1+\ln x)$.`, XR`$\dfrac d{dx}x^x=x\cdot x^{x-1}$ by the power rule.`, 2,
    XR`<p>A is true (log differentiation). R is false: the power rule needs a constant exponent, but here the exponent is $x$.</p>`, 'Variable base and variable exponent: use logs.'),
  // ---- passages ----
  PI(3, 'Rolle\'s theorem', 'xp5', XR`How many values of $c$ in $(1,3)$ satisfy $f'(c)=0$?`, 2,
    XR`<p>$f'(x)=3x^2-12x+11$. Discriminant $144-132=12>0$, so two roots: $x=\dfrac{12\pm\sqrt{12}}6=2\pm\dfrac1{\sqrt3}$. Both are in $(1,3)$ since $\dfrac1{\sqrt3}\approx0.577$. So $2$.</p>`, 'Rolle guarantees at least one, but here there are two.', () => 2),
  PI(4, 'Rolle\'s theorem', 'xp5', XR`Find the sum of all such $c$.`, 4,
    XR`<p>From $3c^2-12c+11=0$ the sum of roots is $\dfrac{12}3=4$.</p>`, 'Sum of the roots = −b/a.', () => 12 / 3),
  PN(4, 'Rolle\'s theorem', 'xp5', XR`Find the product of all such $c$ (2 decimal places).`, 3.67, 0.01,
    XR`<p>Product of the roots $=\dfrac{11}3\approx3.67$.</p>`, 'Product of the roots = c/a.', () => 11 / 3),
  PI(3, 'finding constants', 'xp6', XR`Find $c$.`, 8,
    XR`<p>$e^{4x}-1-4x\approx\dfrac{(4x)^2}2=8x^2$. So $\lim_{x\to0}f(x)=8$ and $c=8$.</p>`, 'Expand e^t − 1 − t as t²/2 with t = 4x.', () => 8),
  PN(5, 'derivative as a limit', 'xp6', XR`With this $c$, find $f'(0)$ (2 decimal places).`, 10.67, 0.01,
    XR`<p>$e^{4x}=1+4x+8x^2+\dfrac{32x^3}3+\cdots$, so $f(x)=8+\dfrac{32x}3+\cdots$. Then $\dfrac{f(x)-f(0)}x\to\dfrac{32}3\approx10.67$. So $f'(0)=\dfrac{32}3$.</p>`, 'Keep the next term of the series: the x³ term of e^{4x}.', () => 32 / 3),
  PM(5, 'second derivative', 'xp6', XR`$f''(0)=$`, XR`$\dfrac{64}3$`, [XR`$\dfrac{32}3$`, '$8$', XR`$\dfrac{128}3$`],
    XR`<p>$f(x)=8+\dfrac{32}3x+\dfrac{4^4}{24}x^2+\cdots$ (the next term of $e^{4x}$ is $\dfrac{(4x)^4}{24}=\dfrac{32x^4}3$, divided by $x^2$ gives $\dfrac{32}3x^2$). So the $x^2$ coefficient is $\dfrac{32}3$ and $f''(0)=2\cdot\dfrac{32}3=\dfrac{64}3$.</p>`, 'f″(0) is twice the x² coefficient.'),
  PI(3, 'chain rule', 'xp7', XR`Find $\dfrac{d}{dx}f(g(x))$ at $x=1$.`, -5,
    XR`<p>$f'(g(1))\cdot g'(1)=f'(2)\cdot(-1)=5\cdot(-1)=-5$.</p>`, 'Evaluate f′ at g(1) = 2, not at 1.', () => 5 * -1),
  PI(4, 'product rule', 'xp7', XR`Find $\dfrac d{dx}\big[f(x)g(x)\big]$ at $x=1$.`, 4,
    XR`<p>$f'g+fg'=3\cdot2+2\cdot(-1)=6-2=4$.</p>`, 'Product rule has a plus sign between the two terms.', () => 3 * 2 + 2 * -1),
  PI(4, 'quotient rule', 'xp7', XR`Find $\dfrac d{dx}\left[\dfrac{f(x)}{g(x)}\right]$ at $x=1$.`, 2,
    XR`<p>$\dfrac{f'g-fg'}{g^2}=\dfrac{3\cdot2-2\cdot(-1)}{4}=\dfrac84=2$.</p>`, 'Subtracting a negative term adds.', () => (3 * 2 - 2 * -1) / 4),
);

XGN.push(
  GX('xg01', 3, 'nat', 'integer', 'finding constants', (rng) => {
    const k = int(rng, 1, 3), p = int(rng, 1, 5), qq = int(rng, 1, 8);
    const m = 2 * k + p, n = qq - k * k;
    return { k, p, qq, answer: m + n, tol: 0, q: XR`$f(x)=\begin{cases}x^2+${p}x+${qq},&x\le${k}\\mx+n,&x>${k}\end{cases}$ is differentiable at $x=${k}$. Find $m+n$.`, sol: XR`<p>Left slope at $${k}$: $2(${k})+${p}=${m}$, so $m=${m}$. Continuity: $${k * k}+${p * k}+${qq}=${m}\cdot${k}+n$, so $n=${n}$. $m+n=${m + n}$.</p>` };
  }, (p) => { const L = (x) => x * x + p.p * x + p.qq; const sl = xd(L, p.k); const mm = Math.round(sl); const nn = Math.round(L(p.k) - mm * p.k); return mm + nn; }),
  GX('xg02', 3, 'mcq', 'single', 'derivative at a point', (rng) => {
    const a = int(rng, 2, 5), b = int(rng, 1, 4);
    const ans = a + b;
    const { options, answer } = shuffleOpts(rng, `$${a + b}e^{${b}}$`, [`$${a}e^{${b}}$`, `$${a + b}$`, `$${a * b}e^{${b}}$`]);
    return { a, b, options, answer, q: XR`If $y=x^{${a}}e^{${b}x}$, then $\dfrac{dy}{dx}$ at $x=1$ is`, sol: XR`<p>$y'=${a}x^{${a - 1}}e^{${b}x}+${b}x^{${a}}e^{${b}x}$ (product rule). At $x=1$: $(${a}+${b})e^{${b}}=${ans}e^{${b}}$.</p>` };
  }, (p) => { const v = xd((x) => x ** p.a * xexp(p.b * x), 1); return Math.abs(v - (p.a + p.b) * xexp(p.b)) < 1e-3 * v ? p.answer : -1; }),
  GX('xg03', 3, 'nat', 'integer', 'parametric derivatives', (rng) => {
    const k = int(rng, 2, 9);
    return { k, answer: 2 * k, tol: 0, q: XR`If $x=t^2$ and $y=${k}t^4$, find $\dfrac{d^2y}{dx^2}$.`, sol: XR`<p>$\dfrac{dy}{dx}=\dfrac{4\cdot${k}t^3}{2t}=${2 * k}t^2$. Then $\dfrac{d^2y}{dx^2}=\dfrac{d(${2 * k}t^2)/dt}{dx/dt}=\dfrac{${4 * k}t}{2t}=${2 * k}$. (Indeed $y=${k}x^2$.)</p>` };
  }, (p) => { const xf = (t) => t * t, yf = (t) => p.k * t ** 4; return Math.round(pD2(xf, yf, 1.3)); }),
  GX('xg04', 4, 'nat', 'numeric', 'logarithmic differentiation', (rng) => {
    const a = int(rng, 2, 4);
    const ans = a ** a * (Math.log(a) + 1);
    return { a, answer: +ans.toFixed(2), tol: Math.max(0.01, +(ans * 0.002).toFixed(3)), q: XR`If $y=x^x$, find $\dfrac{dy}{dx}$ at $x=${a}$ (2 decimal places).`, sol: XR`<p>$y'=x^x(\ln x+1)$. At $x=${a}$: $${a ** a}(\ln${a}+1)=${a ** a}\times${(Math.log(a) + 1).toFixed(4)}\approx${ans.toFixed(2)}$.</p>` };
  }, (p) => xd((x) => x ** x, p.a, 1e-5)),
  GX('xg05', 4, 'mcq', 'single', 'mean value theorem', (rng) => {
    const a = int(rng, 1, 3), b = a + int(rng, 2, 4);
    const c2 = (a * a + a * b + b * b) / 3;
    const { options, answer } = shuffleOpts(rng, `$${'\\sqrt{' + frac(a * a + a * b + b * b, 3) + '}'}$`, [`$${frac(a + b, 2)}$`, `$\\sqrt{${a * b}}$`, `$${'\\sqrt{' + frac(a * a + b * b, 2) + '}'}$`]);
    return { a, b, c2, options, answer, q: XR`The mean value theorem is applied to $f(x)=x^3$ on $[${a},${b}]$. The value of $c$ is`, sol: XR`<p>$3c^2=\dfrac{${b ** 3}-${a ** 3}}{${b}-${a}}=${b * b + a * b + a * a}$. So $c^2=${frac(a * a + a * b + b * b, 3)}$ and $c=\sqrt{${frac(a * a + a * b + b * b, 3)}}\approx${Math.sqrt(c2).toFixed(2)}$.</p>` };
  }, (p) => { const c = Math.sqrt(p.c2); const slope = (p.b ** 3 - p.a ** 3) / (p.b - p.a); return Math.abs(3 * c * c - slope) < 1e-9 ? p.answer : -1; }),
  GX('xg06', 4, 'nat', 'integer', 'types of discontinuity', (rng) => {
    const n = int(rng, 3, 7);
    return { n, answer: n * n - 1, tol: 0, q: XR`Find the number of points of discontinuity of $f(x)=[x^2]$ in $(0,${n})$.`, sol: XR`<p>$[x^2]$ jumps whenever $x^2$ passes an integer: $x^2=1,2,\dots,${n * n - 1}$ (the value $${n * n}$ is at $x=${n}$, outside the interval). That is $${n * n - 1}$ points.</p>` };
  }, (p) => jumpCount((x) => xfl(x * x), 1e-4, p.n - 1e-4)),
  GX('xg07', 4, 'nat', 'numeric', 'derivative of an inverse function', (rng) => {
    const k = int(rng, 1, 9);
    const ans = 1 / (3 + k);
    return { k, answer: +ans.toFixed(3), tol: 0.01, q: XR`$f(x)=x^3+${k}x$ is one-to-one and $g=f^{-1}$. Find $g'(${1 + k})$ (2 decimal places).`, sol: XR`<p>$f(1)=${1 + k}$, so $g(${1 + k})=1$. $g'(${1 + k})=\dfrac1{f'(1)}=\dfrac1{3+${k}}=${ans.toFixed(3)}\approx${ans.toFixed(2)}$.</p>` };
  }, (p) => { const f = (x) => x ** 3 + p.k * x; const g = (t) => { let x = 1; for (let i = 0; i < 80; i++) x -= (f(x) - t) / (3 * x * x + p.k); return x; }; const y = 1 + p.k, h = 1e-4; return (g(y + h) - g(y - h)) / (2 * h); }),
  GX('xg08', 4, 'nat', 'integer', 'higher derivatives', (rng) => {
    const a = int(rng, 2, 3), n = choose(rng, [3, 5]);
    let fact = 1; for (let i = 2; i < n; i++) fact *= i;
    const ans = fact * a ** n;
    return { a, n, answer: ans, tol: 0, q: XR`If $y=\ln(1+${a}x)$, find $\dfrac{d^{${n}}y}{dx^{${n}}}$ at $x=0$.`, sol: XR`<p>$y'=${a}(1+${a}x)^{-1}$. Each further derivative multiplies by $-${a}$ and lowers the power: $y^{(${n})}=(-1)^{${n - 1}}(${n - 1})!\,${a}^{${n}}(1+${a}x)^{-${n}}$. At $x=0$: $${fact}\cdot${a ** n}=${ans}$ (the sign is $+$ since $${n - 1}$ is even).</p>` };
  }, (p) => { let c = p.a, m = 1; for (let i = 2; i <= p.n; i++) { c *= -m * p.a; m++; } return c; }),
  GX('xg09', 5, 'nat', 'integer', 'higher derivatives', (rng) => {
    const k = int(rng, 2, 7);
    return { k, answer: k, tol: 0, q: XR`$f(x)=x^{${k}}|x|$. What is the largest integer $n$ for which $f^{(n)}(0)$ exists?`, sol: XR`<p>$f(x)=x^{${k + 1}}$ for $x>0$ and $-x^{${k + 1}}$ for $x<0$. Differentiating $j$ times gives $\dfrac{${k + 1}!}{(${k + 1}-j)!}\,x^{${k + 1}-j}\,\mathrm{sgn}(x)$. At $j=${k}$ this is $${k + 1}!\,|x|$, which exists at $0$ (value 0) but has a kink there. So $f^{(${k})}(0)$ exists and $f^{(${k + 1})}(0)$ does not. Answer: $${k}$.</p>` };
  }, (p) => { let m = p.k + 1, n = 0; for (let j = 0; ; j++) { if (m - j >= 2) n = j + 1; else break; } return n; }),
  GX('xg10', 5, 'mcq', 'single', 'inverse trigonometric', (rng) => {
    const a = int(rng, 2, 5);
    const { options, answer } = shuffleOpts(rng, `$-\\dfrac2{${1 + a * a}}$`, [`$\\dfrac2{${1 + a * a}}$`, `$-\\dfrac2{${a * a - 1}}$`, `$\\dfrac2{${a * a - 1}}$`]);
    return { a, options, answer, q: XR`If $y=\sin^{-1}\left(\dfrac{2x}{1+x^2}\right)$, then $\dfrac{dy}{dx}$ at $x=${a}$ is`, sol: XR`<p>Put $x=\tan\theta$: $y=\sin^{-1}(\sin2\theta)$. For $x=${a}>1$, $\theta>45^\circ$ so $2\theta\in\left(\dfrac\pi2,\pi\right)$ and $y=\pi-2\tan^{-1}x$. Then $y'=-\dfrac2{1+x^2}=-\dfrac2{${1 + a * a}}$.</p>` };
  }, (p) => { const v = xd((x) => xas(2 * x / (1 + x * x)), p.a); return Math.abs(v + 2 / (1 + p.a * p.a)) < 1e-4 ? p.answer : -1; }),
);

Object.assign(groups, XG); items.push(...XIT); gens.push(...XGN);
}
// ==XP-END
// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({ topic: 'continuity-differentiability', groups, items, gens }, ['cd-g01', 'cd-g03', 'cd-g06', 'cd-g10', 'cd-g11', 'cd-g14', 'cd-g15', 'cd-g16', 'cd-g18', 'cd-xg01', 'cd-xg02', 'cd-xg07']);
