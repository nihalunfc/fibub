// Linear programming (Plus Two entrance, Mathematics, Class 12). Original fibub questions.
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';
import { tidyGens } from '../_util.js';

const R = String.raw;
const CUET = true; // Class 12 chapters: level 1-3 mcq also list 'cuet'
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
const base = (level, sub, extra) => ({ level, exams: [...EXS[level], ...(CUET && extra.type === 'mcq' && level <= 3 ? ['cuet'] : [])], sub, ...extra });
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
const GEXS = (level, type) => [...EXS[level], ...(CUET && type === 'mcq' && level <= 3 ? ['cuet'] : [])];
const gen = (id, level, type, format, sub, make, verify) => ({ id, type, format, level, exams: GEXS(level, type), sub, make, ...(verify ? { verify } : {}) });

const PI_ = Math.PI, E_ = Math.E;
const sqrt = Math.sqrt, sin = Math.sin, cos = Math.cos, tan = Math.tan, atan = Math.atan, asin = Math.asin, acos = Math.acos, abs = Math.abs, exp = Math.exp, ln = Math.log;
const r4 = (x) => +x.toFixed(4);
const r2 = (x) => +x.toFixed(2);
const TWOD = ' (2 decimal places)';
const D = (level, sub, q, answer, sol, trap, more = {}) => N(level, sub, `${q} (2 decimal places)`, answer, 0.01, sol, trap, more);
const PD = (level, sub, group, q, answer, sol, trap, more = {}) => PN(level, sub, group, `${q} (2 decimal places)`, answer, 0.01, sol, trap, more);
const deg = (r) => (r * 180) / PI_, rad = (d) => (d * PI_) / 180;
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/** number of distinct zeros of f on [a,b) (b included when `closed`): sign changes on a fine grid, plus exact end zeros */
const zeros = (f, a, b, closed = false, n = 200000) => {
  const h = (b - a) / n; let c = 0; let prev = f(a + 0.3183 * h);
  for (let i = 1; i < n; i++) { const v = f(a + (i + 0.3183) * h); if ((prev < 0) !== (v < 0)) c++; prev = v; }
  if (Math.abs(f(a)) < 1e-9) c++;
  if (closed && Math.abs(f(b)) < 1e-9) c++;
  return c;
};

// ---------- linear programming helpers (they work out every corner point and optimum used below) ----------
const t2 = (x) => String(+x.toFixed(2));
const t4 = (x) => String(+x.toFixed(4));
const sum = (a) => a.reduce((s, x) => s + x, 0);
/** constraints: a x + b y <= c (LE) or >= c (GE); x >= 0 and y >= 0 are always added */
const LE = (a, b, c) => ({ a, b, c, ge: false });
const GE = (a, b, c) => ({ a, b, c, ge: true });
const norm = (k) => (k.ge ? [-k.a, -k.b, -k.c] : [k.a, k.b, k.c]);
const AXES = [[-1, 0, 0], [0, -1, 0]];
const lt = (a, b) => {
  const f = (v, s) => (v === 0 ? '' : `${v === 1 ? '' : v === -1 ? '-' : v}${s}`);
  const A = f(a, 'x'), B = f(b, 'y');
  if (!A) return B || '0';
  if (!B) return A;
  return `${A}${b < 0 ? B : `+${B}`}`;
};
const ctx = (k) => `${lt(k.a, k.b)}${k.ge ? '\\ge' : '\\le'}${k.c}`;
/** corner points (vertices) of the feasible region, by intersecting every pair of boundary lines */
const cornersOf = (cons) => {
  const L = [...cons.map(norm), ...AXES], pts = [];
  for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) {
    const [a1, b1, c1] = L[i], [a2, b2, c2] = L[j], det = a1 * b2 - a2 * b1;
    if (abs(det) < 1e-12) continue;
    const x = (c1 * b2 - c2 * b1) / det, y = (a1 * c2 - a2 * c1) / det;
    if (L.every(([a, b, c]) => a * x + b * y <= c + 1e-9) && !pts.some(([u, v]) => abs(u - x) < 1e-9 && abs(v - y) < 1e-9)) pts.push([abs(x) < 1e-12 ? 0 : x, abs(y) < 1e-12 ? 0 : y]);
  }
  const cx = sum(pts.map((p) => p[0])) / (pts.length || 1), cy = sum(pts.map((p) => p[1])) / (pts.length || 1);
  return pts.sort((p, q) => Math.atan2(p[1] - cy, p[0] - cx) - Math.atan2(q[1] - cy, q[0] - cx));
};
/** the feasible region clipped by a big square, as a polygon (Sutherland-Hodgman); used as an independent check */
const clipPoly = (cons, M = 1e4) => {
  let poly = [[0, 0], [M, 0], [M, M], [0, M]];
  for (const [a, b, c] of cons.map(norm)) {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const P = poly[i], Q = poly[(i + 1) % poly.length], fp = a * P[0] + b * P[1] - c, fq_ = a * Q[0] + b * Q[1] - c;
      if (fp <= 1e-12) out.push(P);
      if ((fp < -1e-12 && fq_ > 1e-12) || (fp > 1e-12 && fq_ < -1e-12)) { const t = fp / (fp - fq_); out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]); }
    }
    poly = out; if (!poly.length) break;
  }
  return poly;
};
const isBounded = (cons) => { const P = clipPoly(cons); return P.length > 0 && P.every(([x, y]) => x < 9999 && y < 9999); };
const polyArea = (P) => abs(sum(P.map((p, i) => p[0] * P[(i + 1) % P.length][1] - P[(i + 1) % P.length][0] * p[1]))) / 2;
const ptx = ([x, y]) => `(${t2(x)},\\,${t2(y)})`;
/** corner points with the value of Z = c x + d y */
const lpTable = (cons, c, d) => cornersOf(cons).map(([x, y]) => [x, y, c * x + d * y]);
const lpMax = (cons, c, d) => Math.max(...lpTable(cons, c, d).map((p) => p[2]));
const lpMin = (cons, c, d) => Math.min(...lpTable(cons, c, d).map((p) => p[2]));
const tabTx = (cons, c, d) => lpTable(cons, c, d).map((p) => `$${ptx(p)}$: $Z=${t2(p[2])}$`).join('; ');
const objTx = (c, d) => `Z=${lt(c, d)}`;
const consTx = (cons) => cons.map((k) => `$${ctx(k)}$`).join(', ');
/** optimum of a corner-point problem through the clipped polygon (independent of cornersOf) */
const polyOpt = (cons, c, d, kind) => { const P = clipPoly(cons); const v = P.map(([x, y]) => c * x + d * y); return kind === 'max' ? Math.max(...v) : Math.min(...v); };

// ---------- builders that work the numbers out and double-check them with the polygon clip ----------
const nw = (right, cands) => { const o = []; for (const c of [...cands, right + 1, right - 1, right + 2, right - 2, right + 4, right + 6]) if (Math.abs(c - right) > 1e-9 && !o.some((v) => Math.abs(v - c) < 1e-9) && o.length < 3) o.push(c); return o.map((v) => `$${t2(v)}$`); };
const OBJQ = (cons, c, d, kind) => `${kind === 'max' ? 'Maximise' : 'Minimise'} $${objTx(c, d)}$ subject to ${consTx(cons)}, $x\\ge0,\\ y\\ge0$.`;
const chk = (cons, c, d, kind) => {
  const v = kind === 'max' ? lpMax(cons, c, d) : lpMin(cons, c, d);
  if (abs(v - polyOpt(cons, c, d, kind)) > 1e-6) throw new Error('lp mismatch ' + consTx(cons));
  return v;
};
const solTab = (cons, c, d, kind) => {
  const v = chk(cons, c, d, kind), bd = isBounded(cons);
  return `<p>Draw the region and find its corner points. ${tabTx(cons, c, d)}.</p>${bd ? '' : '<p>The region is unbounded, but the coefficients of $Z$ are positive, so the minimum exists and is the smallest value at a corner point.</p>'}<p>The ${kind === 'max' ? 'largest' : 'smallest'} value is $${t2(v)}$.</p>`;
};
const others = (cons, c, d, v) => lpTable(cons, c, d).map((p) => p[2]).filter((z) => abs(z - v) > 1e-9);
const bM = (lv, sub, cons, c, d, kind, trap, more = {}) => {
  const v = chk(cons, c, d, kind);
  return M(lv, sub, OBJQ(cons, c, d, kind) + ' The optimal value is', `$${t2(v)}$`, nw(v, others(cons, c, d, v)), solTab(cons, c, d, kind), trap, more);
};
const bI = (lv, sub, cons, c, d, kind, trap, more = {}) => {
  const v = chk(cons, c, d, kind);
  return I(lv, sub, OBJQ(cons, c, d, kind) + ' Find the optimal value.', v, solTab(cons, c, d, kind), trap, { calc: () => polyOpt(cons, c, d, kind), ...more });
};
/** x or y coordinate of the (unique) optimal corner */
const bAt = (lv, sub, cons, c, d, kind, which, trap) => {
  const v = chk(cons, c, d, kind), T = lpTable(cons, c, d).filter((p) => abs(p[2] - v) < 1e-9);
  if (T.length !== 1 || abs(T[0][which === 'x' ? 0 : 1] - Math.round(T[0][which === 'x' ? 0 : 1])) > 1e-9) throw new Error('bAt ' + consTx(cons));
  const ans = Math.round(T[0][which === 'x' ? 0 : 1]);
  return I(lv, sub, OBJQ(cons, c, d, kind) + ` At the optimal point, find the value of $${which}$.`, ans, solTab(cons, c, d, kind) + `<p>The optimum is at $${ptx(T[0])}$, so $${which}=${ans}$.</p>`, trap,
    { calc: () => { const P = clipPoly(cons).filter(([x, y]) => x < 9999 && y < 9999); const best = P.reduce((b, q) => ((kind === 'max' ? c * q[0] + d * q[1] > c * b[0] + d * b[1] : c * q[0] + d * q[1] < c * b[0] + d * b[1]) ? q : b), P[0]); return which === 'x' ? best[0] : best[1]; } });
};

// the problems used for the worked tables
const PA = [LE(1, 1, 8), LE(1, 3, 18)];
const PB = [LE(2, 1, 20), LE(1, 2, 16)];
const PC = [LE(3, 2, 24), LE(1, 2, 12)];
const PF = [LE(1, 1, 9), LE(1, 0, 6), LE(0, 1, 7)];
const PE = [LE(2, 3, 30), LE(3, 2, 30)];
const QA = [GE(1, 1, 6), GE(1, 3, 10)];
const QB = [GE(3, 1, 12), GE(1, 1, 8)];
const QC = [GE(4, 1, 20), GE(1, 1, 8)];
const QD = [GE(2, 3, 12), GE(1, 1, 5)];
const QE = [GE(1, 1, 5), GE(1, 3, 9), GE(3, 1, 9)];
const PH = [LE(1, 1, 10), LE(1, 3, 24), LE(3, 1, 24)];
const P1 = [LE(2, 1, 100), LE(1, 1, 80), LE(1, 0, 40)];
const P2 = [GE(2, 1, 10), GE(1, 2, 8)];
const P3 = [GE(1, 1, 20), LE(1, 1, 30), LE(1, 0, 35), LE(0, 1, 35)];
const P4 = [LE(1, 2, 10), LE(3, 1, 15)];
/** numeric answer to 2 decimal places (fractional corner) */
const bN = (lv, sub, cons, c, d, kind, trap, more = {}) => {
  const v = chk(cons, c, d, kind);
  return N(lv, sub, OBJQ(cons, c, d, kind) + ' Find the optimal value. (2 decimal places)', r2(v), 0.01, solTab(cons, c, d, kind), trap, { calc: () => polyOpt(cons, c, d, kind), ...more });
};

const groups = {
  m1: {
    title: 'Region and outcome',
    passage: R`<p>Match each problem in List I with what happens in List II. All problems have $x\ge0,\ y\ge0$ as well.</p>`,
    list1: [R`A. Maximise $Z=2x+y$ subject to $x+y\le4$`, R`B. Minimise $Z=2x+y$ subject to $x+y\ge4$`, R`C. Maximise $Z=2x+y$ subject to $x+y\ge4$`, R`D. Maximise $Z=2x+y$ subject to $x+y\le4$ and $x+y\ge6$`],
    list2: [R`p. The maximum value is $8$`, R`q. The minimum value is $4$`, R`r. $Z$ has no maximum, because it can grow without limit`, R`s. There is no feasible point at all`],
  },
  m2: {
    title: 'Words to inequalities',
    passage: R`<p>A shop sells $x$ units of item X and $y$ units of item Y. Match each statement in List I with its inequality in List II.</p>`,
    list1: [R`A. Item X needs $2$ hours and item Y needs $3$ hours; at most $40$ hours are available`, R`B. Item X gives $2$ units of protein and item Y gives $3$ units; at least $40$ units are needed`, R`C. The total number of items made is at most $40$`, R`D. The number of items of Y is at least twice the number of items of X`],
    list2: [R`p. $2x+3y\le40$`, R`q. $2x+3y\ge40$`, R`r. $x+y\le40$`, R`s. $2x-y\le0$`],
  },
  m3: {
    title: 'Corner points and values of $Z$',
    passage: R`<p>The feasible region of an LPP has corner points $(0,0)$, $(5,0)$, $(3,4)$ and $(0,6)$. Match each corner point in List I with the value of $Z=3x+2y$ there, in List II.</p>`,
    list1: [R`A. $(0,0)$`, R`B. $(5,0)$`, R`C. $(3,4)$`, R`D. $(0,6)$`],
    list2: [R`p. $0$`, R`q. $12$`, R`r. $15$`, R`s. $17$`],
  },
  m4: {
    title: 'Types of feasible region',
    passage: R`<p>Match each set of constraints in List I with the kind of feasible region in List II. All sets include $x\ge0,\ y\ge0$.</p>`,
    list1: [R`A. $x+y\le5$`, R`B. $x+y\ge5$`, R`C. $x+y\le5$ and $x+y\ge7$`, R`D. no other constraint`],
    list2: [R`p. Bounded, with $3$ corner points`, R`q. Unbounded, with $2$ corner points`, R`r. Empty`, R`s. Unbounded, with $1$ corner point`],
  },
  p1: {
    title: 'Passage: a factory plan',
    passage: R`<p>A factory makes two products, $x$ units of P and $y$ units of Q. The profit is $Z=40x+30y$ rupees. Machine time limits give $2x+y\le100$ and $x+y\le80$. Packing limits P to $x\le40$. Also $x\ge0,\ y\ge0$.</p>`,
  },
  p2: {
    title: 'Passage: a diet plan',
    passage: R`<p>A diet uses $x$ units of food A and $y$ units of food B. The cost is $Z=5x+4y$ rupees. It must give at least $10$ units of vitamin ($2x+y\ge10$) and at least $8$ units of minerals ($x+2y\ge8$), with $x\ge0,\ y\ge0$. The aim is to minimise $Z$.</p>`,
  },
  p3: {
    title: 'Passage: moving goods',
    passage: R`<p>Factory F1 can send up to $30$ units and factory F2 up to $50$ units. Shops S1 and S2 each need exactly $35$ units. The cost per unit is $3$ (F1 to S1), $6$ (F1 to S2), $2$ (F2 to S1) and $3$ (F2 to S2). Let F1 send $x$ units to S1 and $y$ units to S2, so F2 sends $35-x$ to S1 and $35-y$ to S2. The total cost simplifies to $Z=x+3y+175$, and the conditions become $0\le x\le35$, $0\le y\le35$ and $20\le x+y\le30$.</p>`,
  },
  p4: {
    title: 'Passage: a tie for the best',
    passage: R`<p>Maximise $Z=2x+4y$ subject to $x+2y\le10$, $3x+y\le15$, $x\ge0$, $y\ge0$. The corner points are $(0,0)$, $(5,0)$, $(4,3)$ and $(0,5)$.</p>`,
  },
};

const items = [
  // ---------- L1 ----------
  M(1, 'basic ideas', R`A linear programming problem asks you to`, R`optimise (maximise or minimise) a linear function subject to linear inequalities`, [R`solve a single quadratic equation`, R`find the area under a curve`, R`maximise a quadratic function with no conditions`],
    R`<p>An LPP has a linear objective function and linear constraints (inequalities or equations). The best value is found among the points that satisfy every constraint.</p>`, 'Both the objective and the constraints must be linear.'),
  M(1, 'objective function', R`In an LPP, the linear function that is to be maximised or minimised is called the`, R`objective function`, [R`constraint`, R`feasible region`, R`corner point`],
    R`<p>The function such as $Z=3x+2y$ (profit, cost, etc.) is the objective function. The inequalities are the constraints.</p>`, ''),
  M(1, 'constraints', R`The conditions $x\ge0$ and $y\ge0$ in an LPP are called`, R`non-negativity restrictions`, [R`objective functions`, R`optimal solutions`, R`iso-profit lines`],
    R`<p>They say that the quantities cannot be negative, so the feasible region lies in the first quadrant.</p>`, ''),
  M(1, 'feasible region', R`The feasible region of an LPP is`, R`the set of points that satisfy all the constraints together`, [R`the set of points where $Z$ is largest`, R`the set of points on the $x$-axis only`, R`the set of points that satisfy at least one constraint`],
    R`<p>A point is feasible only if it satisfies every constraint, so the feasible region is the common part of all the half-planes.</p>`, 'Every constraint must hold, not just one.'),
  M(1, 'corner point method', R`By the corner point method, the maximum or minimum value of $Z$ over a bounded feasible region occurs at`, R`a corner point (vertex) of the region`, [R`the centre of the region`, R`a point on the $y$-axis only`, R`the origin always`],
    R`<p>$Z$ is linear, so on a bounded convex region its extreme values are attained at corner points.</p>`, 'The origin is a corner only when it is feasible, and it need not be optimal.'),
  M(1, 'constraints', R`Which of these cannot be a constraint in a linear programming problem?`, R`$x^2+y\le4$`, [R`$2x+3y\le5$`, R`$x-y\ge0$`, R`$y\le7$`],
    R`<p>Constraints must be linear. $x^2+y\le4$ has $x^2$, so it is not linear.</p>`, ''),
  M(1, 'feasible region', R`Which point lies in the feasible region of $x+y\le5$, $x\ge0$, $y\ge0$?`, R`$(2,2)$`, [R`$(4,3)$`, R`$(-1,2)$`, R`$(3,3)$`],
    R`<p>$(2,2)$: $2+2=4\le5$ and both coordinates are $\ge0$. $(4,3)$ and $(3,3)$ give $7$ and $6$, above $5$. $(-1,2)$ breaks $x\ge0$.</p>`, ''),
  I(1, 'objective function', R`Find the value of $Z=3x+4y$ at the point $(2,5)$.`, 26,
    R`<p>$Z=3(2)+4(5)=6+20=26$.</p>`, '', { calc: () => 3 * 2 + 4 * 5 }),
  I(1, 'objective function', R`Find the value of $Z=2x-y$ at the point $(6,4)$.`, 8,
    R`<p>$Z=2(6)-4=12-4=8$.</p>`, 'Do not forget the minus sign on $y$.', { calc: () => 2 * 6 - 4 }),
  M(1, 'corner point method', R`The corner points of the region $x+y\le4$, $x\ge0$, $y\ge0$ are`, R`$(0,0),\ (4,0),\ (0,4)$`, [R`$(0,0),\ (4,4),\ (0,4)$`, R`$(4,0),\ (0,4)$ only`, R`$(0,0),\ (2,2),\ (4,0)$`],
    R`<p>The region is a triangle bounded by the axes and the line $x+y=4$. The line meets the axes at $(4,0)$ and $(0,4)$, and the axes meet at $(0,0)$.</p>`, 'The origin is a corner when it is feasible.'),
  I(1, 'corner point method', R`How many corner points does the region $0\le x\le3$, $0\le y\le2$ have?`, 4,
    R`<p>It is a rectangle with corners $(0,0)$, $(3,0)$, $(3,2)$ and $(0,2)$, so $4$ corner points.</p>`, '', { calc: () => cornersOf([LE(1, 0, 3), LE(0, 1, 2)]).length }),
  M(1, 'optimal solution', R`A feasible point at which $Z$ takes its best (largest or smallest, as asked) value is called`, R`an optimal solution`, [R`an infeasible solution`, R`a constraint`, R`a redundant point`],
    R`<p>An optimal solution is a feasible solution that gives the optimum value of the objective function.</p>`, ''),
  M(1, 'bounded and unbounded regions', R`A feasible region is called bounded if`, R`it can be enclosed in a circle`, [R`it contains the origin`, R`it has exactly $4$ corner points`, R`it lies in the first quadrant`],
    R`<p>Bounded means that the region does not stretch to infinity, so some circle contains it. Otherwise it is unbounded.</p>`, 'Lying in the first quadrant does not make a region bounded.'),
  M(1, 'feasible region', R`The feasible region of a linear programming problem is always`, R`a convex set`, [R`a circle`, R`a single point`, R`a bounded set`],
    R`<p>It is the intersection of half-planes, and an intersection of convex sets is convex. It may be unbounded, so it is not always bounded.</p>`, 'Convex does not mean bounded.'),
  M(1, 'formulation', R`A worker can work at most $10$ hours a day. This is written as`, R`hours $\le10$`, [R`hours $\ge10$`, R`hours $=10$ exactly`, R`hours $<0$`],
    R`<p>"At most" means "not more than", which is $\le$.</p>`, '"At most" is $\le$ and "at least" is $\ge$.'),
  I(1, 'corner point method', R`The corner points of a region are $(0,0)$, $(5,0)$ and $(0,6)$. Find the maximum of $Z=4x+3y$ over the region.`, 20,
    R`<p>$Z(0,0)=0$, $Z(5,0)=20$, $Z(0,6)=18$. The maximum is $20$.</p>`, '', { calc: () => Math.max(0, 20, 18) }),
  M(1, 'feasible region', R`The conditions $x\ge0$ and $y\ge0$ alone describe`, R`the first quadrant, including the axes`, [R`the whole plane`, R`the line $y=x$`, R`a bounded triangle`],
    R`<p>Both coordinates are non-negative, which is the first quadrant with its boundary axes. It is unbounded.</p>`, ''),

  // ---------- L2 ----------
  bM(2, 'corner point method', PA, 3, 5, 'max', 'Check every corner point, not just the intersection of the two lines.'),
  bM(2, 'corner point method', QA, 2, 3, 'min', 'On an unbounded region, a minimum can exist only when $Z$ grows away from the corners.'),
  bI(2, 'corner point method', PB, 4, 3, 'max', 'Remember the corners on the axes.'),
  bI(2, 'corner point method', QC, 3, 1, 'min', ''),
  bAt(2, 'corner point method', PC, 5, 4, 'max', 'x', ''),
  bAt(2, 'corner point method', QD, 4, 5, 'min', 'y', ''),
  M(2, 'graphing constraints', R`To shade the region $2x+3y\le12$, which side of the line $2x+3y=12$ is chosen?`, R`The side containing the origin, because $0\le12$ is true`, [R`The side not containing the origin`, R`Both sides`, R`Only the line itself`],
    R`<p>Test $(0,0)$: $2(0)+3(0)=0\le12$ is true, so the origin is on the feasible side.</p>`, 'Test a point that is not on the line.'),
  M(2, 'corner point method', R`The lines $x+y=5$ and $x-y=1$ meet at`, R`$(3,2)$`, [R`$(2,3)$`, R`$(4,1)$`, R`$(5,0)$`],
    R`<p>Add the equations: $2x=6$, so $x=3$ and $y=2$. Check: $3+2=5$ and $3-2=1$.</p>`, ''),
  I(2, 'corner point method', R`The lines $2x+y=10$ and $x+y=7$ meet at a point. Find its $x$-coordinate.`, 3,
    R`<p>Subtract: $(2x+y)-(x+y)=10-7$ gives $x=3$ (and then $y=4$).</p>`, '', { calc: () => 10 - 7 }),
  A(2, 'feasible region', R`The feasible region of an LPP is a convex set.`, R`The intersection of half-planes is convex.`, 0,
    R`<p>Each constraint is a half-plane (convex). The common part of convex sets is convex, so A is true and R explains it.</p>`, 'A region can be convex and still unbounded.'),
  S(2, 'bounded and unbounded regions', R`If the feasible region is bounded, $Z$ has both a maximum and a minimum on it.`, R`If the feasible region is unbounded, $Z$ never has a minimum on it.`, 1,
    R`<p>Statement I is true (the extreme value theorem for corner points). Statement II is false: for example, $Z=x+y$ on $x+y\ge3$ has minimum $3$ although the region is unbounded.</p>`, 'Unbounded does not rule out an optimum; it must be checked.'),
  X(2, 'feasible region', R`Which of these points are feasible for $x+y\le6$, $2x+y\le8$, $x\ge0$, $y\ge0$?`, [R`$(1,1)$`, R`$(3,2)$`, R`$(4,2)$`, R`$(0,6)$`, R`$(2,5)$`], [0, 1, 3],
    R`<p>$(1,1)$: $2\le6$, $3\le8$ yes. $(3,2)$: $5\le6$, $8\le8$ yes. $(4,2)$: $6\le6$ but $10>8$, no. $(0,6)$: $6\le6$, $6\le8$ yes. $(2,5)$: $7>6$, no.</p>`, 'Test every constraint for every point.'),
  X(2, 'feasible region', R`Which statements about the feasible region of an LPP are correct?`, [R`It is a convex set.`, R`It may be unbounded.`, R`It always contains the origin.`, R`Every point of it is a corner point.`], [0, 1],
    R`<p>It is convex and may be unbounded. It need not contain the origin (for example $x+y\ge3$), and only some points are corners.</p>`, 'The origin is not always feasible.'),
  M(2, 'formulation', R`A tailor makes $x$ shirts and $y$ trousers. A shirt takes $2$ hours and a trouser takes $3$ hours, and at most $20$ hours are available. The constraint is`, R`$2x+3y\le20$`, [R`$3x+2y\le20$`, R`$2x+3y\ge20$`, R`$x+y\le20$`],
    R`<p>Total time is $2x+3y$ and it must not exceed $20$.</p>`, 'Match each rate to the right product.'),
  M(2, 'objective function', R`The lines $3x+2y=k$ (for different $k$) used to find the optimum of $Z=3x+2y$ all have slope`, R`$-\dfrac32$`, [R`$\dfrac32$`, R`$-\dfrac23$`, R`$\dfrac23$`],
    R`<p>$y=\dfrac{k-3x}2$, so the slope is $-\dfrac32$.</p>`, 'Slope is $-a/b$ for $ax+by=k$.'),
  M(2, 'bounded and unbounded regions', R`The region $x+y\ge3$, $x\ge0$, $y\ge0$ has how many corner points?`, R`$2$`, [R`$1$`, R`$3$`, R`$0$`],
    R`<p>The line $x+y=3$ meets the axes at $(3,0)$ and $(0,3)$. These are the only corners, and the region is unbounded.</p>`, 'The origin is not feasible here ($0\\ge3$ is false).'),
  I(2, 'corner point method', R`The lines $x+y=7$ and $x-y=1$ meet at $P$. Find the value of $Z=2x+3y$ at $P$.`, 17,
    R`<p>Adding: $2x=8$, so $x=4$ and $y=3$. $Z=2(4)+3(3)=17$.</p>`, '', { calc: () => 2 * 4 + 3 * 3 }),
  M(2, 'corner point method', R`The values of $Z$ at the corner points $(0,0)$, $(4,0)$, $(3,2)$, $(0,4)$ are $0$, $12$, $13$ and $8$. The maximum is`, R`$13$, at $(3,2)$`, [R`$12$, at $(4,0)$`, R`$8$, at $(0,4)$`, R`$0$, at $(0,0)$`],
    R`<p>Compare the four values: the largest is $13$ at $(3,2)$.</p>`, ''),
  M(2, 'feasibility', R`The region $x+y\le4$, $x+y\ge6$, $x\ge0$, $y\ge0$ has`, R`no feasible point`, [R`one corner point`, R`three corner points`, R`an unbounded region`],
    R`<p>$x+y$ cannot be both at most $4$ and at least $6$. The feasible region is empty, so there is no optimal solution.</p>`, ''),
  M(2, 'corner point method', R`The correct order of steps in the corner point method is`, R`draw the feasible region, find its corner points, find $Z$ at each, choose the best`, [R`find $Z$ at each point of the plane, then draw the region`, R`choose the best corner, then draw the region`, R`find $Z$ on the axes only, then compare`],
    R`<p>You first need the region, then its corners, then the value of $Z$ at each corner. The best of those is the optimum.</p>`, ''),
  I(2, 'objective function', R`$Z=ax+3y$ has value $17$ at the point $(4,3)$. Find $a$.`, 2,
    R`<p>$4a+9=17$, so $4a=8$ and $a=2$.</p>`, '', { calc: () => (17 - 9) / 4 }),
  MT(2, 'formulation', 'm2', R`Choose the correct matching for the List I and List II above.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
    R`<p>A: time needed is $2x+3y$, at most $40$, so p. B: protein is $2x+3y$, at least $40$, so q. C: total items $x+y\le40$, so r. D: $y\ge2x$ gives $2x-y\le0$, so s.</p>`, 'Watch the direction of each inequality.'),
  MT(2, 'corner point method', 'm3', R`Choose the correct matching for the List I and List II above.`, 'A-p, B-r, C-s, D-q', ['A-p, B-q, C-s, D-r', 'A-r, B-p, C-s, D-q', 'A-p, B-r, C-q, D-s'],
    R`<p>$Z=3x+2y$: $(0,0)\to0$; $(5,0)\to15$; $(3,4)\to9+8=17$; $(0,6)\to12$. So A-p, B-r, C-s, D-q.</p>`, 'Put the coordinates in the right place.'),

  // ---------- L3 ----------
  bM(3, 'corner point method', PF, 3, 4, 'max', 'There are five corner points, including the one where $y=7$ meets $x+y=9$.'),
  bM(3, 'bounded and unbounded regions', QB, 2, 1, 'min', 'The minimum is at the corner that gives the smallest $Z$, not the first one you find.'),
  bM(3, 'corner point method', PE, 7, 5, 'max', ''),
  bI(3, 'corner point method', PF, 5, 2, 'max', 'The best corner changes when the coefficients change.'),
  bAt(3, 'corner point method', PF, 3, 4, 'max', 'x', ''),
  bAt(3, 'corner point method', PE, 7, 5, 'max', 'y', ''),
  bAt(3, 'bounded and unbounded regions', QA, 2, 3, 'min', 'x', ''),
  I(3, 'corner point method', `How many corner points does the region ${consTx(PF)}, $x\\ge0,\\ y\\ge0$ have?`, 5,
    R`<p>The corner points are $(0,0)$, $(6,0)$, $(6,3)$ (where $x=6$ meets $x+y=9$), $(2,7)$ (where $x+y=9$ meets $y=7$) and $(0,7)$. That is $5$.</p>`, 'Count the corners where boundary lines meet inside the region.', { calc: () => cornersOf(PF).length }),
  I(3, 'polygon area', `Find the area of the feasible region ${consTx(PB)}, $x\\ge0,\\ y\\ge0$ (in square units).`, 52,
    R`<p>The corner points in order are $(0,0)$, $(10,0)$, $(8,4)$, $(0,8)$. The shoelace formula gives $\dfrac12|0+40+64+0|=52$.</p>`, 'Take the corner points in order around the polygon.', { calc: () => polyArea(clipPoly(PB)) }),
  MT(3, 'bounded and unbounded regions', 'm1', R`Choose the correct matching for the List I and List II above.`, 'A-p, B-q, C-r, D-s', ['A-p, B-q, C-s, D-r', 'A-q, B-p, C-r, D-s', 'A-p, B-r, C-q, D-s'],
    R`<p>A: corners $(0,0),(4,0),(0,4)$ give $Z=0,8,4$, maximum $8$ (p). B: corners $(4,0),(0,4)$ give $8,4$; $Z$ grows away from them, so the minimum is $4$ (q). C: on $x+y\ge4$ the value $Z=2x+y$ increases without limit along the $x$-axis (r). D: the two conditions clash (s).</p>`, 'A minimum can exist on an unbounded region while a maximum does not.'),
  MT(3, 'bounded and unbounded regions', 'm4', R`Choose the correct matching for the List I and List II above.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-s, C-r, D-q', 'A-p, B-q, C-s, D-r'],
    R`<p>A is a triangle with corners $(0,0),(5,0),(0,5)$ (p). B has corners $(5,0)$ and $(0,5)$ and stretches away (q). C is empty (r). D is the first quadrant, with only the origin as a corner (s).</p>`, 'Count only the points where two boundary lines meet.'),
  A(3, 'multiple optimal solutions', R`$Z=2x+4y$ has its maximum $20$ at both $(4,3)$ and $(0,5)$, which are feasible points. Then $Z$ is also $20$ at $(2,4)$, provided $(2,4)$ is feasible.`, R`If a linear function takes the same value at two points, it takes that value along the whole line through them, and $(2,4)$ is the midpoint of $(4,3)$ and $(0,5)$.`, 0,
    R`<p>$Z(2,4)=4+16=20$. A linear function is constant on a line when it has equal values at two of its points, and the mid-point of two feasible points is feasible (the region is convex). So A is true and R explains it.</p>`, 'Convexity is what keeps the midpoint feasible.'),
  A(3, 'bounded and unbounded regions', R`$Z=x+y$ has no maximum on the region $x+y\ge4$, $x\ge0$, $y\ge0$.`, R`The region $x+y\ge4$, $x\ge0$, $y\ge0$ is unbounded.`, 1,
    R`<p>Both are true. But "unbounded" alone does not explain it: $Z=-x-y$ would have a maximum on the same region. The real reason is that $Z=x+y$ grows without limit along the region, for example at $(t,0)$ with $t$ large.</p>`, 'An unbounded region may still have a maximum for some objective functions.'),
  A(3, 'corner point method', R`The origin is always a corner point of the feasible region of an LPP with $x\ge0$, $y\ge0$.`, R`The constraints $x\ge0$ and $y\ge0$ are always part of the problem.`, 3,
    R`<p>R is true, but A is false: the origin must satisfy the other constraints too. For $x+y\ge3$ it does not (the region does not contain $(0,0)$).</p>`, 'A corner point must be feasible.'),
  S(3, 'bounded and unbounded regions', R`A region made from constraints $ax+by\ge c$ with $a,b>0$ (and $x,y\ge0$) is unbounded when it is not empty.`, R`A region made from constraints $ax+by\le c$ with $a,b>0$ (and $x,y\ge0$) is bounded.`, 0,
    R`<p>I: points $(t,t)$ with $t$ large satisfy every $\ge$ constraint with positive coefficients, so the region reaches infinity. II: $ax+by\le c$ with $a,b>0$ and $x,y\ge0$ gives $x\le c/a$ and $y\le c/b$, so the region is in a rectangle and is bounded. Both are true.</p>`, ''),
  S(3, 'feasibility', R`If the feasible region of an LPP is empty, the problem has no solution.`, R`If the feasible region is not empty, the LPP always has an optimal solution.`, 1,
    R`<p>I is true: with no feasible point there is nothing to optimise. II is false: for $Z=x+y$ maximised on $x+y\ge2$, the region is non-empty but $Z$ has no maximum.</p>`, 'A non-empty region does not guarantee a solution.'),
  S(3, 'corner point method', R`Every point where two boundary lines meet is a corner point of the feasible region.`, R`A corner point of the feasible region is a point where two boundary lines meet and which satisfies all constraints.`, 2,
    R`<p>I is false: the meeting point may violate another constraint, so it is outside the region. II is the correct definition.</p>`, 'Check feasibility of every intersection point.'),
  SC(3, 'corner point method', [R`Level lines $Z=k$ of an objective function are parallel straight lines.`, R`The feasible region of an LPP can be a non-convex set.`, R`If an optimum is attained at a point that is not a corner, it is also attained at a corner point.`, R`A bounded feasible region has finitely many corner points.`],
    '3', ['1', '2', '4'],
    R`<p>(1) True: $ax+by=k$ has the same slope for all $k$. (2) False: it is an intersection of half-planes, hence convex. (3) True: the optimum then lies on an edge, and the whole edge, including its ends, gives the same value. (4) True. So $3$ are correct.</p>`, 'Statement (2) is the false one.'),
  SC(3, 'formulation', [R`"At least $5$ units" is written $\le5$.`, R`"No more than $8$ hours" is written $\le8$.`, R`"Not less than $3$" is written $\ge3$.`, R`"Exactly $6$" is written $\le6$ and $\ge6$ together.`],
    '3', ['1', '2', '4'],
    R`<p>(1) is false: "at least" means $\ge5$. (2), (3) and (4) are correct. So $3$ statements are correct.</p>`, '"At least" and "at most" are opposites.'),
  X(3, 'diet', R`A diet needs at least $10$ units of vitamin and at least $8$ units of mineral. Food A (cost per unit $5$) has $2$ vitamin and $1$ mineral; food B (cost per unit $4$) has $1$ vitamin and $2$ mineral. Which are correct for $x$ units of A and $y$ of B?`, [R`vitamin condition: $2x+y\ge10$`, R`mineral condition: $x+2y\ge8$`, R`cost to minimise: $Z=5x+4y$`, R`cost to maximise: $Z=5x+4y$`], [0, 1, 2],
    R`<p>Vitamin: $2x+y\ge10$. Mineral: $x+2y\ge8$. The cost $5x+4y$ is minimised, not maximised.</p>`, 'The aim of a diet problem is the least cost.'),
  X(3, 'corner point method', R`Which are corner points of the region $x+y\le6$, $x\le4$, $x\ge0$, $y\ge0$?`, [R`$(0,0)$`, R`$(4,0)$`, R`$(4,2)$`, R`$(0,6)$`, R`$(6,0)$`], [0, 1, 2, 3],
    R`<p>$(6,0)$ breaks $x\le4$. The others are corners: $(0,0)$, $(4,0)$ (where $x=4$ meets the axis), $(4,2)$ (where $x=4$ meets $x+y=6$) and $(0,6)$.</p>`, 'Check each intersection against all constraints.'),
  X(3, 'multiple optimal solutions', R`$Z=2x+4y$ is maximised on a region with corner points $(0,0)$, $(5,0)$, $(4,3)$, $(0,5)$, and the maximum is $20$. Which are correct?`, [R`$Z(4,3)=20$`, R`$Z(0,5)=20$`, R`$Z(5,0)=10$`, R`The maximum is attained at only one point`], [0, 1, 2],
    R`<p>$Z(4,3)=8+12=20$, $Z(0,5)=20$, $Z(5,0)=10$. So the maximum is at two corners and therefore at every point of the edge joining them.</p>`, 'A tie between two corners means infinitely many optimal points.'),
  M(3, 'formulation', R`A farmer needs at least twice as many acres of wheat ($x$) as of rice ($y$). This gives`, R`$x\ge2y$`, [R`$y\ge2x$`, R`$x\le2y$`, R`$x+y\ge2$`],
    R`<p>"Wheat is at least twice rice" means $x\ge2y$.</p>`, 'Decide which quantity is larger before writing the inequality.'),
  M(3, 'multiple optimal solutions', R`$Z=px+qy$ ($p,q>0$) has the same value at two adjacent corner points. Then`, R`$Z$ takes that same value at every point of the edge joining them`, [R`$Z$ has no optimum`, R`$Z$ is optimal only at the two corner points`, R`the region is empty`],
    R`<p>$Z$ is linear along the edge between the two points, so equal values at the ends mean equal values everywhere on the edge.</p>`, ''),

  // passage questions
  PI(3, 'manufacturing', 'p1', R`How many corner points does the feasible region have?`, 5,
    R`<p>The corners are $(0,0)$, $(40,0)$, $(40,20)$ (where $x=40$ meets $2x+y=100$), $(20,60)$ (where $2x+y=100$ meets $x+y=80$) and $(0,80)$. That is $5$.</p>`, '', { calc: () => cornersOf(P1).length }),
  PI(3, 'manufacturing', 'p1', R`Find the profit $Z$ at the corner point $(40,20)$ (in rupees).`, 2200,
    R`<p>$Z=40(40)+30(20)=1600+600=2200$.</p>`, '', { calc: () => 40 * 40 + 30 * 20 }),
  PI(4, 'manufacturing', 'p1', R`Find the maximum profit (in rupees).`, 2600,
    R`<p>$Z$ at the corners: $0$, $1600$, $2200$, $2600$ at $(20,60)$, $2400$ at $(0,80)$. The maximum is $2600$.</p>`, 'Compare all five corners.', { calc: () => lpMax(P1, 40, 30) }),
  PI(3, 'diet', 'p2', R`How many corner points does the feasible region have?`, 3,
    R`<p>The region is unbounded. Its corners are $(0,10)$, $(4,2)$ (where the two lines meet) and $(8,0)$. That is $3$.</p>`, '', { calc: () => cornersOf(P2).length }),
  PI(3, 'diet', 'p2', R`Find the minimum cost (in rupees).`, 28,
    R`<p>$Z=5x+4y$ at $(0,10)$ is $40$, at $(4,2)$ is $28$, at $(8,0)$ is $40$. The region is unbounded, but $Z$ increases away from the corners (the open half-plane $5x+4y<28$ meets no feasible point), so the minimum is $28$.</p>`, 'On an unbounded region, test that the minimum is real.', { calc: () => lpMin(P2, 5, 4) }),
  PI(4, 'diet', 'p2', R`The cost is least at the point $(a,b)$. Find $a+b$.`, 6,
    R`<p>The minimum is at $(4,2)$, so $a+b=6$.</p>`, '', { calc: () => 4 + 2 }),
  PI(3, 'transportation', 'p3', R`How many corner points does the feasible region have?`, 4,
    R`<p>The region is the strip $20\le x+y\le30$ in the first quadrant, with corners $(20,0)$, $(30,0)$, $(0,30)$ and $(0,20)$. (The limits $x\le35$ and $y\le35$ do not cut it.) That is $4$.</p>`, '', { calc: () => cornersOf(P3).length }),
  PI(4, 'transportation', 'p3', R`Find the minimum total cost (in rupees).`, 195,
    R`<p>$Z=x+3y+175$ at the corners: $(20,0)\to195$, $(30,0)\to205$, $(0,30)\to265$, $(0,20)\to235$. The minimum is $195$.</p>`, 'Do not forget the constant $175$.', { calc: () => lpMin(P3, 1, 3) + 175 }),
  PI(4, 'transportation', 'p3', R`Find the largest possible total cost (in rupees).`, 265,
    R`<p>From the table of corner values, the largest cost is $265$ at $(0,30)$.</p>`, '', { calc: () => lpMax(P3, 1, 3) + 175 }),
  PI(3, 'multiple optimal solutions', 'p4', R`Find the maximum value of $Z$.`, 20,
    R`<p>$Z=2x+4y$: $(0,0)\to0$, $(5,0)\to10$, $(4,3)\to20$, $(0,5)\to20$. The maximum is $20$.</p>`, '', { calc: () => lpMax(P4, 2, 4) }),
  PI(3, 'multiple optimal solutions', 'p4', R`At how many corner points is the maximum attained?`, 2,
    R`<p>It is attained at $(4,3)$ and $(0,5)$. That is $2$ corner points.</p>`, '', { calc: () => lpTable(P4, 2, 4).filter((p) => abs(p[2] - 20) < 1e-9).length }),
  PI(4, 'multiple optimal solutions', 'p4', R`How many points with integer coordinates lie on the segment joining $(4,3)$ and $(0,5)$, ends included?`, 3,
    R`<p>The segment lies on $x+2y=10$ with $0\le x\le4$. Integer points need $x$ even: $x=0,2,4$, giving $(0,5)$, $(2,4)$ and $(4,3)$. That is $3$ points, all with $Z=20$.</p>`, 'Include both end points.', { calc: () => { let n = 0; for (let x = 0; x <= 4; x++) if ((10 - x) % 2 === 0) n++; return n; } }),

  // ---------- L4 ----------
  M(4, 'bounded and unbounded regions', R`Minimise $Z=x-y$ subject to $x+y\ge6$, $x+3y\ge10$, $x\ge0$, $y\ge0$. The corner points are $(10,0)$, $(4,2)$ and $(0,6)$. Then`, R`$Z$ has no minimum`, [R`the minimum is $-6$, at $(0,6)$`, R`the minimum is $2$, at $(4,2)$`, R`the minimum is $10$, at $(10,0)$`],
    R`<p>$Z$ at the corners is $10$, $2$ and $-6$, so the smallest corner value is $-6$. For an unbounded region this is only a candidate. Test the open half-plane $x-y<-6$: the point $(0,7)$ is feasible ($7\ge6$ and $21\ge10$) and $0-7=-7<-6$. So the half-plane meets the region and $Z$ has no minimum.</p>`, 'The smallest corner value is the minimum only if the open half-plane test has no feasible points.'),
  bM(4, 'bounded and unbounded regions', QA, 3, 2, 'min', 'Here the open half-plane $3x+2y<12$ has no feasible point, so $12$ is a real minimum.'),
  bM(4, 'corner point method', PH, 5, 4, 'max', 'There are five corner points.'),
  bAt(4, 'corner point method', PH, 2, 7, 'max', 'y', ''),
  bM(4, 'bounded and unbounded regions', QE, 3, 2, 'min', 'Check all four corner points of the unbounded region.'),
  bI(4, 'bounded and unbounded regions', QE, 4, 3, 'min', ''),
  bM(4, 'multiple optimal solutions', P4, 3, 6, 'max', 'The edge $x+2y=10$ is parallel to the lines $3x+6y=k$.'),
  bN(4, 'corner point method', [LE(5, 3, 30), LE(2, 5, 20)], 3, 2, 'max', 'Corner points need not have integer coordinates.'),
  I(4, 'corner point method', R`The feasible region of an LPP has corner points $(0,0)$, $(5,0)$, $(3,4)$ and $(0,6)$. $Z=px+2y$ has its maximum at both $(5,0)$ and $(3,4)$. Find $p$.`, 4,
    R`<p>Equal values: $5p=3p+8$, so $p=4$. Check: $Z(5,0)=20$, $Z(3,4)=20$, $Z(0,6)=12$, $Z(0,0)=0$. The maximum $20$ is shared.</p>`, 'Also check the other corners are not larger.', { calc: () => { const p = 8 / 2; return Math.max(5 * p, 3 * p + 8, 12, 0) === 5 * p && 5 * p === 3 * p + 8 ? p : NaN; } }),
  I(4, 'multiple optimal solutions', R`The corner points of a region are $(0,0)$, $(5,0)$, $(3,4)$ and $(0,6)$. $Z=2x+qy$ has the same maximum at $(3,4)$ and $(0,6)$. Find $q$.`, 3,
    R`<p>$2(3)+4q=2(0)+6q$ gives $6=2q$, so $q=3$. Check: $Z(3,4)=18$, $Z(0,6)=18$, $Z(5,0)=10$.</p>`, '', { calc: () => { const q = 3; return Math.max(0, 10, 6 + 4 * q, 6 * q) === 6 * q && 6 + 4 * q === 6 * q ? q : NaN; } }),
  I(4, 'multiple optimal solutions', R`A region has corner points $(0,0)$, $(10,0)$, $(6,6)$ and $(0,10)$. $Z=px+4y$ has the same maximum at $(10,0)$ and $(6,6)$. Find $p$.`, 6,
    R`<p>$10p=6p+24$, so $p=6$. Then $Z(10,0)=60$, $Z(6,6)=36+24=60$, $Z(0,10)=40$, $Z(0,0)=0$.</p>`, '', { calc: () => { const p = 6; return Math.max(0, 10 * p, 6 * p + 24, 40) === 60 && 10 * p === 6 * p + 24 ? p : NaN; } }),
  A(4, 'corner point method', R`If $p,q>0$, the maximum of $Z=px+qy$ over $x+y\le4$, $x\ge0$, $y\ge0$ is $4\max(p,q)$.`, R`The maximum occurs at $(4,0)$ or $(0,4)$, where $Z$ equals $4p$ or $4q$.`, 0,
    R`<p>The corners are $(0,0)$, $(4,0)$, $(0,4)$ with $Z=0$, $4p$, $4q$. The largest is $4\max(p,q)$. R gives exactly this reason.</p>`, ''),
  A(4, 'bounded and unbounded regions', R`The minimum of $Z=x+y$ on $x+2y\ge4$, $3x+y\ge6$, $x\ge0$, $y\ge0$ is at the point where the two lines meet.`, R`If $p,q\ge0$, then $Z=px+qy$ is bounded below by $0$ on the first quadrant, so a minimum exists on any non-empty region of the type above.`, 1,
    R`<p>The corners are $(4,0)$, $\left(\dfrac85,\dfrac65\right)$ and $(0,6)$ with $Z=4$, $2.8$, $6$. The smallest is at the meeting point, so A is true. R is also true (a closed region with $Z\ge0$ attains its infimum), but it does not tell us <i>where</i> the minimum is, so it does not explain A.</p>`, 'A true reason must explain this particular statement.'),
  S(4, 'bounded and unbounded regions', R`On $x+y\ge2$, $x\ge0$, $y\ge0$, the function $Z=-x-y$ has a maximum.`, R`On the same region $Z=x+y$ has a minimum $2$ but no maximum.`, 0,
    R`<p>$Z=-x-y\le-2$ on the region, with equality on $x+y=2$, so the maximum $-2$ exists. For $Z=x+y$ the minimum is $2$ and it grows without limit, so there is no maximum. Both are true.</p>`, 'The same region can have an optimum for one objective and none for another.'),
  S(4, 'multiple optimal solutions', R`If the feasible region is bounded and non-empty, $Z$ has exactly one point of maximum.`, R`The maximum of $Z$ may be attained at infinitely many points.`, 2,
    R`<p>I is false: if $Z$ is parallel to an edge, every point of that edge is optimal. II is true.</p>`, 'Ties are possible.'),
  SC(4, 'bounded and unbounded regions', [R`If the region is unbounded and $p,q>0$, then $Z=px+qy$ has a minimum (when the region is non-empty, in the first quadrant).`, R`If the region is unbounded and $p,q>0$, then $Z=px+qy$ has no maximum.`, R`If a minimum exists on an unbounded region, it occurs at a corner point.`, R`No objective function can have a maximum on an unbounded region.`],
    '3', ['1', '2', '4'],
    R`<p>(1) True: $Z\ge0$, so it is bounded below and attains its infimum at a corner. (2) True: an unbounded region in the first quadrant contains a ray going to infinity, along which $Z$ grows. (3) True: corner point theorem. (4) False: $Z=-x-y$ has a maximum on $x+y\ge2$. So $3$ are correct.</p>`, 'Statement (4) is too strong.'),
  I(4, 'lattice points', R`How many points $(x,y)$ with integer coordinates satisfy $x+y\le4$, $x\ge0$, $y\ge0$?`, 15,
    R`<p>For $x=0,1,2,3,4$ the values of $y$ are $5,4,3,2,1$ in number. Total $=5+4+3+2+1=15$.</p>`, 'Count $y=0$ too.', { calc: () => { let n = 0; for (let x = 0; x <= 4; x++) for (let y = 0; y <= 4; y++) if (x + y <= 4) n++; return n; } }),
  I(4, 'polygon area', R`Find the area (in square units) of the feasible region $2x+y\le10$, $2x+3y\le18$, $x\ge0$, $y\ge0$.`, 19,
    R`<p>The corners in order are $(0,0)$, $(5,0)$, $(3,4)$, $(0,6)$. Shoelace: $\dfrac12|0+20+18+0|=19$.</p>`, '', { calc: () => polyArea(clipPoly([LE(2, 1, 10), LE(2, 3, 18)])) }),
  I(4, 'corner point method', R`How many corner points does the region $x+y\le6$, $x\le4$, $y\le4$, $x\ge0$, $y\ge0$ have?`, 5,
    R`<p>The corners are $(0,0)$, $(4,0)$, $(4,2)$, $(2,4)$ and $(0,4)$. That is $5$.</p>`, 'The line $x+y=6$ cuts off the corner $(4,4)$.', { calc: () => cornersOf([LE(1, 1, 6), LE(1, 0, 4), LE(0, 1, 4)]).length }),
  M(4, 'formulation', R`A carpenter makes $x$ tables and $y$ chairs. A table needs $4$ hours of carpentry and $2$ hours of finishing; a chair needs $3$ hours of carpentry and $1$ hour of finishing. He has $240$ carpentry hours and $100$ finishing hours. The constraints are`, R`$4x+3y\le240,\ 2x+y\le100,\ x,y\ge0$`, [R`$3x+4y\le240,\ x+2y\le100,\ x,y\ge0$`, R`$4x+3y\ge240,\ 2x+y\ge100,\ x,y\ge0$`, R`$4x+2y\le240,\ 3x+y\le100,\ x,y\ge0$`],
    R`<p>Carpentry: $4x+3y\le240$. Finishing: $2x+y\le100$. Both are "at most" limits, and the numbers cannot be negative.</p>`, 'Match each hours-per-item with the right product.'),
  M(4, 'formulation', R`A dietician mixes $x$ kg of food A and $y$ kg of food B. Each kg of A has $3$ units of iron and $1$ of calcium; each kg of B has $1$ unit of iron and $2$ of calcium. At least $12$ units of iron and $10$ units of calcium are needed. The constraints are`, R`$3x+y\ge12,\ x+2y\ge10$`, [R`$3x+y\le12,\ x+2y\le10$`, R`$x+3y\ge12,\ 2x+y\ge10$`, R`$3x+y\ge10,\ x+2y\ge12$`],
    R`<p>Iron: $3x+y\ge12$. Calcium: $x+2y\ge10$. "At least" gives $\ge$.</p>`, 'Pair the iron figures with the iron requirement.'),
  I(4, 'corner point method', R`Maximise $Z=3x+2y$ subject to $x+y\le5$, $x\ge0$, $y\ge0$ and $x$, $y$ integers with $x\ge y$. Find the maximum value of $Z$.`, 15,
    R`<p>The constraint $x\ge y$ is satisfied at $(5,0)$. $Z(5,0)=15$. At other points, $Z=3x+2y\le3(x+y)\le15$, with $15$ only when $y=0$ and $x=5$. So the maximum is $15$.</p>`, '', { calc: () => { let b = -1e9; for (let x = 0; x <= 5; x++) for (let y = 0; y <= 5; y++) if (x + y <= 5 && x >= y) b = Math.max(b, 3 * x + 2 * y); return b; } }),

  // ---------- L5 ----------
  M(5, 'multiple optimal solutions', R`The corner points of an unbounded region are $(10,0)$, $(4,2)$ and $(0,6)$. $Z=x+py$ with $p>0$ is minimised at $(4,2)$ exactly when`, R`$1\le p\le3$`, [R`$1<p<3$`, R`$p\le1$`, R`$p\ge3$`],
    R`<p>$Z(4,2)=4+2p$. We need $4+2p\le10$, so $p\le3$, and $4+2p\le6p$, so $p\ge1$. At $p=1$ or $p=3$ there is a tie, and $(4,2)$ is still a point of minimum. So $1\le p\le3$.</p>`, 'Include the values where two corners tie.'),
  I(5, 'lattice points', R`How many points with integer coordinates lie in the feasible region $x+y\le8$, $x+3y\le18$, $x\ge0$, $y\ge0$?`, 40,
    R`<p>For each $y$, the largest $x$ is $\min(8-y,\ 18-3y)$. $y=0$: $8$, so $9$ points; $y=1$: $7$, so $8$; $y=2$: $6$, so $7$; $y=3$: $5$, so $6$; $y=4$: $4$, so $5$; $y=5$: $3$, so $4$; $y=6$: $0$, so $1$. Total $9+8+7+6+5+4+1=40$.</p>`, 'The second line takes over from $y=5$.', { calc: () => { let n = 0; for (let x = 0; x <= 20; x++) for (let y = 0; y <= 20; y++) if (x + y <= 8 && x + 3 * y <= 18) n++; return n; } }),
  I(5, 'polygon area', R`Find the area (in square units) of the region $x+y\ge2$, $x+y\le6$, $x\le4$, $y\le4$, $x\ge0$, $y\ge0$.`, 12,
    R`<p>The square $0\le x,y\le4$ has area $16$. The part with $x+y>6$ is the triangle with corners $(4,4)$, $(2,4)$, $(4,2)$ of area $2$. The part with $x+y<2$ is the triangle $(0,0)$, $(2,0)$, $(0,2)$ of area $2$. Area $=16-2-2=12$.</p>`, '', { calc: () => polyArea(clipPoly([GE(1, 1, 2), LE(1, 1, 6), LE(1, 0, 4), LE(0, 1, 4)])) }),
  I(5, 'multiple optimal solutions', R`Minimise $Z=3x+y$ subject to $x+y\ge8$, $3x+y\ge12$, $x\ge0$, $y\ge0$. At how many corner points is the minimum attained?`, 2,
    R`<p>The corner points are $(8,0)$, $(2,6)$ and $(0,12)$, with $Z=24$, $12$, $12$. The open half-plane $3x+y<12$ has no feasible point (the constraint says $3x+y\ge12$), so the minimum is $12$. It is attained at $(2,6)$ and $(0,12)$: $2$ corner points, and at every point of the edge between them.</p>`, 'Ties along an edge are common when $Z$ is parallel to a constraint.', { calc: () => lpTable([GE(1, 1, 8), GE(3, 1, 12)], 3, 1).filter((p) => abs(p[2] - lpMin([GE(1, 1, 8), GE(3, 1, 12)], 3, 1)) < 1e-9).length }),
  bI(5, 'corner point method', PH, 2, 7, 'max', 'The maximum is at the corner on the $y$-axis.'),
  bN(5, 'corner point method', [LE(3, 4, 24), LE(1, 1, 7)], 4, 3, 'max', 'The corner on the $x$-axis is feasible: $3(7)=21\\le24$.'),
  M(5, 'multiple optimal solutions', R`The corner points are $(0,0)$, $(5,0)$, $(3,4)$, $(0,6)$. $Z=px+2y$ ($p>0$) has its maximum at $(0,6)$ when`, R`$p\le\dfrac43$`, [R`$p\le\dfrac{12}5$`, R`$p\ge\dfrac43$`, R`$p\le4$`],
    R`<p>We need $Z(0,6)=12\ge Z(5,0)=5p$, so $p\le\dfrac{12}5$, and $12\ge Z(3,4)=3p+8$, so $p\le\dfrac43$. Both must hold, so $p\le\dfrac43$.</p>`, 'The smaller bound is the one that matters.'),
  A(5, 'bounded and unbounded regions', R`If $Z$ has a minimum on an unbounded feasible region, it occurs at a corner point.`, R`A minimum $m$ exists on an unbounded region if and only if the open half-plane $Z<m$ has no point in common with the region.`, 1,
    R`<p>Both are true. A follows from the corner point theorem (a minimum of a linear function on a region without a line is attained at a corner). R is the practical test for the value $m$ found at the corners, but it does not explain <i>why</i> the minimum sits at a corner. So R is not the explanation.</p>`, 'The test and the theorem are different ideas.'),
  S(5, 'bounded and unbounded regions', R`On $x-y\le2$, $x\ge0$, $y\ge0$, the function $Z=x+y$ has the minimum $0$.`, R`On the same region $Z=x-y$ has maximum $2$ at exactly one point.`, 1,
    R`<p>The origin is feasible ($0\le2$) and $Z\ge0$ on the quadrant, so I is true. The corners are $(0,0)$ and $(2,0)$, and $Z=x-y\le2$ with equality on the whole ray $y=x-2$, $x\ge2$. So the maximum $2$ is attained at infinitely many points and II is false.</p>`, 'An unbounded edge can also be optimal.'),
  X(5, 'bounded and unbounded regions', R`On the region $x+y\ge4$, $x\ge0$, $y\ge0$, for which objective functions does a maximum exist?`, [R`$Z=-x-y$`, R`$Z=x+y$`, R`$Z=-2x-y$`, R`$Z=x-y$`, R`$Z=-x$`], [0, 2, 4],
    R`<p>A linear function $cx+dy$ has a maximum on this region only if $c\le0$ and $d\le0$, since the region contains rays along both axes directions. $-x-y$: max $-4$. $-2x-y$: max $-4$ at $(0,4)$. $-x$: max $0$ along $x=0$, $y\ge4$. For $x+y$ and $x-y$ the value grows without limit along the $x$-axis.</p>`, 'Check the direction in which the region stretches to infinity.'),
  PN(5, 'multiple optimal solutions', 'p4', R`$Z=2x+4y$ is maximised at both $(4,3)$ and $(0,5)$. Find the value of $Z$ at the point $(1,4.5)$ (on the segment joining them).`, 20, 0.01,
    R`<p>$(1,4.5)$ is on $x+2y=10$ ($1+9=10$). $Z=2+18=20$, the same maximum.</p>`, '', { calc: () => 2 * 1 + 4 * 4.5 }),
];

items.forEach((it, i) => { it.id = `lp-${String(i + 1).padStart(3, '0')}`; });

// ---------- helpers for the number templates ----------
const dedupe = (P) => { const o = []; for (const q of P) if (!o.some((u) => abs(u[0] - q[0]) < 1e-7 && abs(u[1] - q[1]) < 1e-7)) o.push(q); return o; };
/** corner points taken from the clipped polygon (independent of cornersOf); points on the big box are dropped */
const realV = (cons) => dedupe(clipPoly(cons)).filter(([x, y]) => x < 9999 && y < 9999);
const rLE2 = (rng) => { for (;;) { const x0 = int(rng, 2, 6), y0 = int(rng, 2, 6), a1 = int(rng, 1, 4), b1 = int(rng, 1, 4), a2 = int(rng, 1, 4), b2 = int(rng, 1, 4); if (a1 * b2 === a2 * b1) continue; return { x0, y0, cons: [LE(a1, b1, a1 * x0 + b1 * y0), LE(a2, b2, a2 * x0 + b2 * y0)] }; } };
const rGE2 = (rng) => { const r = rLE2(rng); return { x0: r.x0, y0: r.y0, cons: r.cons.map((k) => GE(k.a, k.b, k.c)) }; };
const N2 = ' (2 decimal places)';
const retry = (f) => (rng) => { for (let i = 0; i < 200; i++) { const r = f(rng); if (r) return r; } throw new Error('no instance'); };
const cx = (k) => ({ a: k.a, b: k.b, c: k.c, ge: k.ge });
const holds = (k, x, y) => (k.ge ? k.a * x + k.b * y >= k.c : k.a * x + k.b * y <= k.c);
const pt = (x, y) => `$(${x},\\,${y})$`;

const gens = [
  // g01: value of Z at a point
  gen('lp-g01', 1, 'nat', 'integer', 'objective function', (rng) => {
    const v = int(rng, 0, 2), a = int(rng, 2, 9), b = int(rng, 2, 9), x = int(rng, 1, 9), y = int(rng, 1, 9);
    if (v === 0) return { v, a, b, x, y, answer: a * x + b * y, tol: 0, q: `Find the value of $Z=${a}x+${b}y$ at the point $(${x},${y})$.`, sol: `<p>$Z=${a}(${x})+${b}(${y})=${a * x}+${b * y}=${a * x + b * y}$.</p>` };
    if (v === 1) return { v, a, b, x, y, answer: a * x - b * y, tol: 0, q: `Find the value of $Z=${a}x-${b}y$ at the point $(${x},${y})$.`, sol: `<p>$Z=${a}(${x})-${b}(${y})=${a * x}-${b * y}=${a * x - b * y}$. A negative value is allowed.</p>` };
    return { v, a, b, x, y, answer: a * x + b * y, tol: 0, q: `A seller earns ${a} rupees on each pen and ${b} rupees on each book. The objective function is $Z=${a}x+${b}y$. Find $Z$ when $x=${x}$ pens and $y=${y}$ books are sold.`, sol: `<p>$Z=${a}(${x})+${b}(${y})=${a * x + b * y}$ rupees.</p>` };
  }, (p) => { const m = [[p.a, p.b], [p.a, -p.b], [p.a, p.b]][p.v]; return m[0] * p.x + m[1] * p.y; }),

  // g02: maximum on a bounded region
  gen('lp-g02', 2, 'nat', 'numeric', 'corner point method', (rng) => {
    const v = int(rng, 0, 2);
    for (let t = 0; t < 300; t++) {
      const { cons } = rLE2(rng), c = int(rng, 1, 9), d = int(rng, 1, 9), val = lpMax(cons, c, d), best = lpTable(cons, c, d).filter((r) => abs(r[2] - val) < 1e-9);
      if (v === 2 && best.length !== 1) continue;
      const tab = `<p>The corner points and the value of $Z$: ${tabTx(cons, c, d)}.</p>`;
      if (v === 0) return { v, cons, c, d, answer: r2(val), tol: 0.01, q: `Maximise $${objTx(c, d)}$ subject to ${consTx(cons)}, $x\\ge0,\\ y\\ge0$.${N2}`, sol: tab + `<p>The maximum is $${t2(val)}$.</p>` };
      if (v === 1) { const [k1, k2] = cons; return { v, cons, c, d, answer: r2(val), tol: 0.01, q: `A workshop makes $x$ chairs and $y$ stools, with profits of ${c} and ${d} rupees each. Time limits: $${lt(k1.a, k1.b)}\\le${k1.c}$ and $${lt(k2.a, k2.b)}\\le${k2.c}$. Find the greatest profit in rupees.${N2}`, sol: tab + `<p>The greatest profit is $${t2(val)}$ rupees.</p>` }; }
      return { v, cons, c, d, answer: r2(best[0][0]), tol: 0.01, q: `$${objTx(c, d)}$ is maximised subject to ${consTx(cons)}, $x\\ge0,\\ y\\ge0$. Find the $x$-coordinate of the optimal point.${N2}`, sol: tab + `<p>The maximum is at $${ptx(best[0])}$, so $x=${t2(best[0][0])}$.</p>` };
    }
    throw new Error('no instance');
  }, (p) => { const V = realV(p.cons), z = V.map(([x, y]) => p.c * x + p.d * y), m = Math.max(...z); return p.v === 2 ? V[z.indexOf(m)][0] : m; }),

  // g03: minimum on an unbounded region
  gen('lp-g03', 3, 'nat', 'numeric', 'bounded and unbounded regions', (rng) => {
    const v = int(rng, 0, 2);
    for (let t = 0; t < 300; t++) {
      const { cons } = rGE2(rng), c = int(rng, 1, 9), d = int(rng, 1, 9), val = lpMin(cons, c, d), best = lpTable(cons, c, d).filter((r) => abs(r[2] - val) < 1e-9);
      if (v === 2 && best.length !== 1) continue;
      const tab = `<p>The region is unbounded, with corner points: ${tabTx(cons, c, d)}.</p><p>$Z$ has positive coefficients, so it cannot go below its smallest corner value (the open half-plane $Z<${t2(val)}$ has no feasible point).</p>`;
      if (v === 0) return { v, cons, c, d, answer: r2(val), tol: 0.01, q: `Minimise $${objTx(c, d)}$ subject to ${consTx(cons)}, $x\\ge0,\\ y\\ge0$.${N2}`, sol: tab + `<p>The minimum is $${t2(val)}$.</p>` };
      if (v === 1) { const [k1, k2] = cons; return { v, cons, c, d, answer: r2(val), tol: 0.01, q: `A diet uses $x$ units of food A (cost ${c} rupees each) and $y$ units of food B (cost ${d} rupees each). It needs $${lt(k1.a, k1.b)}\\ge${k1.c}$ and $${lt(k2.a, k2.b)}\\ge${k2.c}$. Find the least cost in rupees.${N2}`, sol: tab + `<p>The least cost is $${t2(val)}$ rupees.</p>` }; }
      return { v, cons, c, d, answer: r2(best[0][1]), tol: 0.01, q: `$${objTx(c, d)}$ is minimised subject to ${consTx(cons)}, $x\\ge0,\\ y\\ge0$. Find the $y$-coordinate of the optimal point.${N2}`, sol: tab + `<p>The minimum is at $${ptx(best[0])}$, so $y=${t2(best[0][1])}$.</p>` };
    }
    throw new Error('no instance');
  }, (p) => { const V = realV(p.cons), z = V.map(([x, y]) => p.c * x + p.d * y), m = Math.min(...z); return p.v === 2 ? V[z.indexOf(m)][1] : m; }),

  // g04: number of corner points
  gen('lp-g04', 2, 'nat', 'integer', 'corner point method', (rng) => {
    const v = int(rng, 0, 2);
    for (let t = 0; t < 400; t++) {
      let cons;
      if (v === 0) cons = [LE(int(rng, 1, 4), int(rng, 1, 4), int(rng, 8, 24)), LE(int(rng, 1, 4), int(rng, 1, 4), int(rng, 8, 24)), LE(int(rng, 0, 1), int(rng, 0, 1), int(rng, 5, 12))].filter((k) => k.a + k.b > 0);
      else if (v === 1) cons = [GE(int(rng, 1, 4), int(rng, 1, 4), int(rng, 4, 16)), GE(int(rng, 1, 4), int(rng, 1, 4), int(rng, 4, 16)), GE(int(rng, 1, 3), int(rng, 1, 3), int(rng, 4, 12))];
      else cons = [GE(int(rng, 1, 3), int(rng, 1, 3), int(rng, 2, 8)), LE(int(rng, 1, 4), int(rng, 1, 4), int(rng, 10, 24))];
      const n = cornersOf(cons).length; if (n === 0) continue;
      const kind = v === 0 ? 'bounded' : v === 1 ? 'unbounded' : 'bounded';
      if (isBounded(cons) !== (kind === 'bounded')) continue;
      return { v, cons, answer: n, tol: 0, q: `How many corner points does the feasible region ${consTx(cons)}, $x\\ge0,\\ y\\ge0$ have?`, sol: `<p>Find where the boundary lines meet each other and the axes, and keep the points that satisfy every constraint. The corner points are ${cornersOf(cons).map((q) => `$${ptx(q)}$`).join(', ')}. That is $${n}$ corner points.</p>` };
    }
    throw new Error('no instance');
  }, (p) => realV(p.cons).length),

  // g05: which point is feasible
  gen('lp-g05', 2, 'mcq', 'single', 'feasible region', (rng) => {
    const v = int(rng, 0, 2);
    for (let t = 0; t < 500; t++) {
      const cons = v === 0 ? [LE(int(rng, 1, 4), int(rng, 1, 4), int(rng, 10, 24)), LE(int(rng, 1, 4), int(rng, 1, 4), int(rng, 10, 24))]
        : v === 1 ? [LE(int(rng, 1, 4), int(rng, 1, 4), int(rng, 12, 24)), GE(int(rng, 1, 3), int(rng, 1, 3), int(rng, 3, 8))]
          : [LE(int(rng, 1, 4), int(rng, 1, 4), int(rng, 12, 24)), LE(int(rng, 1, 3), int(rng, 1, 3), int(rng, 8, 20)), GE(1, 1, int(rng, 2, 5))];
      const pts = []; while (pts.length < 4) { const q = [int(rng, 0, 9), int(rng, 0, 9)]; if (!pts.some((u) => u[0] === q[0] && u[1] === q[1])) pts.push(q); }
      const ok = pts.filter(([x, y]) => cons.every((k) => holds(k, x, y)));
      if (ok.length !== 1) continue;
      const right = `$(${ok[0][0]},\\,${ok[0][1]})$`, wrongs = pts.filter((q) => q !== ok[0]).map((q) => `$(${q[0]},\\,${q[1]})$`);
      const { options, answer } = shuffleOpts(rng, right, wrongs);
      const why = pts.map(([x, y]) => `$(${x},\\,${y})$: ${cons.map((k) => `$${lt(k.a, k.b)}=${k.a * x + k.b * y}$ ${holds(k, x, y) ? 'ok' : 'fails'}`).join(', ')}`).join('; ');
      return { v, cons: cons.map(cx), pts, options, answer, q: `Which point lies in the feasible region ${consTx(cons)}, $x\\ge0,\\ y\\ge0$?`, sol: `<p>Test each point in every constraint. ${why}. Only ${right} satisfies all of them.</p>` };
    }
    throw new Error('no instance');
  }, (p) => { const i = p.pts.findIndex(([x, y]) => p.cons.every((k) => holds(k, x, y))); const want = `$(${p.pts[i][0]},\\,${p.pts[i][1]})$`; return p.options.indexOf(want); }),

  // g06: area of the feasible region
  gen('lp-g06', 3, 'nat', 'numeric', 'polygon area', (rng) => {
    const v = int(rng, 0, 2);
    if (v === 0) { const a = int(rng, 1, 5), b = int(rng, 1, 5), c = int(rng, 6, 24), cons = [LE(a, b, c)]; return { v, cons, answer: r2((c * c) / (2 * a * b)), tol: 0.01, q: `Find the area of the region $${lt(a, b)}\\le${c}$, $x\\ge0$, $y\\ge0$ (in square units).${N2}`, sol: `<p>It is a right triangle with legs $\\dfrac{${c}}{${a}}$ and $\\dfrac{${c}}{${b}}$ along the axes. Area $=\\dfrac12\\cdot\\dfrac{${c}}{${a}}\\cdot\\dfrac{${c}}{${b}}=${t2((c * c) / (2 * a * b))}$.</p>` }; }
    if (v === 1) { const { cons } = rLE2(rng), P = cornersOf(cons), ar = polyArea(P); return { v, cons, answer: r2(ar), tol: 0.01, q: `Find the area of the feasible region ${consTx(cons)}, $x\\ge0,\\ y\\ge0$ (in square units).${N2}`, sol: `<p>The corner points in order are ${P.map((q) => `$${ptx(q)}$`).join(', ')}. The shoelace formula gives area $=${t2(ar)}$.</p>` }; }
    const A = int(rng, 4, 9), B = int(rng, 4, 9), C = int(rng, Math.max(A, B) + 1, A + B - 1), cons = [LE(1, 0, A), LE(0, 1, B), LE(1, 1, C)], ar = A * B - ((A + B - C) ** 2) / 2;
    return { v, cons, answer: r2(ar), tol: 0.01, q: `Find the area of the region $x\\le${A}$, $y\\le${B}$, $x+y\\le${C}$, $x\\ge0$, $y\\ge0$ (in square units).${N2}`, sol: `<p>The rectangle has area $${A * B}$. The line $x+y=${C}$ cuts off a right triangle at the corner $(${A},${B})$ with legs $${A + B - C}$ and $${A + B - C}$, area $\\dfrac{${(A + B - C) ** 2}}2$. So the area is $${A * B}-${t2(((A + B - C) ** 2) / 2)}=${t2(ar)}$.</p>` };
  }, (p) => polyArea(realV(p.cons))),

  // g07: lattice points
  gen('lp-g07', 3, 'nat', 'integer', 'lattice points', (rng) => {
    const v = int(rng, 0, 2);
    if (v === 0) { const a = int(rng, 1, 4), b = int(rng, 1, 4), c = int(rng, 6, 16), cons = [LE(a, b, c)]; let n = 0; for (let x = 0; x <= Math.floor(c / a); x++) n += Math.floor((c - a * x) / b) + 1; return { v, cons, answer: n, tol: 0, q: `How many points with integer coordinates satisfy $${lt(a, b)}\\le${c}$, $x\\ge0$, $y\\ge0$?`, sol: `<p>For each integer $x$ from $0$ to $${Math.floor(c / a)}$, the number of allowed $y$ values is $\\left\\lfloor\\dfrac{${c}-${a}x}{${b}}\\right\\rfloor+1$. Adding these gives $${n}$ points.</p>` }; }
    if (v === 1) { const { cons } = rLE2(rng); let n = 0; for (let y = 0; y <= 40; y++) { const hi = Math.min(...cons.map((k) => Math.floor((k.c - k.b * y) / k.a))); if (hi >= 0) n += hi + 1; } return { v, cons, answer: n, tol: 0, q: `How many points with integer coordinates lie in the feasible region ${consTx(cons)}, $x\\ge0$, $y\\ge0$ (boundary included)?`, sol: `<p>For each integer $y\\ge0$, the largest allowed $x$ is the smaller of $\\left\\lfloor\\dfrac{${cons[0].c}-${cons[0].b}y}{${cons[0].a}}\\right\\rfloor$ and $\\left\\lfloor\\dfrac{${cons[1].c}-${cons[1].b}y}{${cons[1].a}}\\right\\rfloor$; count $x=0,1,\\dots$ up to it for every $y$. The total is $${n}$.</p>` }; }
    const A = int(rng, 4, 9), B = int(rng, 4, 9), C = int(rng, 2, Math.min(A, B) + 1), cons = [LE(1, 0, A), LE(0, 1, B), GE(1, 1, C)], n = (A + 1) * (B + 1) - (C * (C + 1)) / 2;
    return { v, cons, answer: n, tol: 0, q: `How many points with integer coordinates satisfy $x\\le${A}$, $y\\le${B}$, $x+y\\ge${C}$, $x\\ge0$, $y\\ge0$?`, sol: `<p>The rectangle $0\\le x\\le${A}$, $0\\le y\\le${B}$ has $${A + 1}\\times${B + 1}=${(A + 1) * (B + 1)}$ integer points. Remove the points with $x+y\\le${C - 1}$: there are $1+2+\\dots+${C}=${(C * (C + 1)) / 2}$ of them. So $${n}$ points remain.</p>` };
  }, (p) => { let n = 0; for (let x = 0; x <= 40; x++) for (let y = 0; y <= 40; y++) if (p.cons.every((k) => holds(k, x, y))) n++; return n; }),

  // g08: objective parallel to a constraint (multiple optima)
  gen('lp-g08', 3, 'nat', 'numeric', 'multiple optimal solutions', (rng) => {
    const v = int(rng, 0, 2), k = int(rng, 2, 5);
    if (v === 0) { const { cons } = rLE2(rng), j = int(rng, 0, 1), c = k * cons[j].a, d = k * cons[j].b, val = k * cons[j].c;
      return { v, cons, c, d, answer: r2(val), tol: 0.01, q: `Maximise $${objTx(c, d)}$ subject to ${consTx(cons)}, $x\\ge0,\\ y\\ge0$.${N2}`, sol: `<p>$Z=${k}(${lt(cons[j].a, cons[j].b)})$ is parallel to the boundary line $${lt(cons[j].a, cons[j].b)}=${cons[j].c}$, so $Z$ is the same at the two corners on that line, and equals $${k}\\times${cons[j].c}=${val}$ there. The other corner values: ${tabTx(cons, c, d)}. The maximum is $${val}$, at every point of that edge.</p>` }; }
    if (v === 1) { for (let t = 0; t < 300; t++) { const { cons } = rLE2(rng), j = int(rng, 0, 1), c = cons[j].a, d = cons[j].b, val = cons[j].c, V = realV(cons).filter(([x, y]) => abs(c * x + d * y - val) < 1e-9);
        let n = 0; const xs = V.map((u) => u[0]), lo = Math.min(...xs), hi = Math.max(...xs); for (let x = Math.ceil(lo - 1e-9); x <= hi + 1e-9; x++) { const y = (val - c * x) / d; if (abs(y - Math.round(y)) < 1e-9 && y >= -1e-9 && cons.every((q) => holds(q, x, Math.round(y)))) n++; }
        if (n < 2 || V.length !== 2) continue;
        return { v, cons, c, d, answer: n, tol: 0, q: `$Z=${lt(c, d)}$ is maximised subject to ${consTx(cons)}, $x\\ge0$, $y\\ge0$. The maximum is attained at every point of an edge. How many points with integer coordinates lie on that edge (ends included)?`, sol: `<p>$Z$ is parallel to $${lt(c, d)}=${val}$, so the maximum $${val}$ is attained along that edge, from $${ptx(V[0])}$ to $${ptx(V[1])}$ (corner points). Count the points on $${lt(c, d)}=${val}$ with integer coordinates between these ends: $${n}$.</p>` }; }
      throw new Error('no instance'); }
    const { cons } = rGE2(rng), j = int(rng, 0, 1), c = k * cons[j].a, d = k * cons[j].b, val = k * cons[j].c;
    return { v, cons, c, d, answer: r2(val), tol: 0.01, q: `Minimise $${objTx(c, d)}$ subject to ${consTx(cons)}, $x\\ge0,\\ y\\ge0$.${N2}`, sol: `<p>$Z=${k}(${lt(cons[j].a, cons[j].b)})\\ge${k}\\times${cons[j].c}=${val}$ on the region, with equality along that edge. So the minimum is $${val}$ (corner values: ${tabTx(cons, c, d)}).</p>` };
  }, (p) => { if (p.v === 1) { const V = realV(p.cons); const cc = p.c, dd = p.d; const zmax = Math.max(...V.map(([x, y]) => cc * x + dd * y)); let n = 0; for (let x = 0; x <= 60; x++) for (let y = 0; y <= 60; y++) if (p.cons.every((k) => holds(k, x, y)) && abs(cc * x + dd * y - zmax) < 1e-7) n++; return n; } return p.v === 0 ? polyOpt(p.cons, p.c, p.d, 'max') : polyOpt(p.cons, p.c, p.d, 'min'); }),

  // g09: parameter that makes two corners tie
  gen('lp-g09', 4, 'nat', 'integer', 'multiple optimal solutions', (rng) => {
    const v = int(rng, 0, 1);
    for (let t = 0; t < 600; t++) {
      const { cons } = rLE2(rng), fixed = int(rng, 1, 9), ok = [];
      for (let u = 1; u <= 40; u++) { const [c, d] = v === 0 ? [u, fixed] : [fixed, u]; const T = lpTable(cons, c, d), m = Math.max(...T.map((r) => r[2])); if (T.filter((r) => abs(r[2] - m) < 1e-9).length >= 2) ok.push(u); }
      if (ok.length !== 1) continue;
      const u = ok[0], [c, d] = v === 0 ? [u, fixed] : [fixed, u];
      return { v, cons, fixed, answer: u, tol: 0, q: v === 0 ? `The feasible region is ${consTx(cons)}, $x\\ge0$, $y\\ge0$. $Z=px+${fixed}y$ ($p$ a positive integer) has its maximum at two different corner points. Find $p$.` : `The feasible region is ${consTx(cons)}, $x\\ge0$, $y\\ge0$. $Z=${fixed}x+qy$ ($q$ a positive integer) has its maximum at two different corner points. Find $q$.`,
        sol: `<p>Corner points and $Z$ for ${v === 0 ? '$p=' : '$q='}${u}$: ${tabTx(cons, c, d)}. Two corners share the maximum. Setting the $Z$-values of the two adjacent corners equal gives ${v === 0 ? '$p' : '$q'}=${u}$, and no other positive integer works.</p>` };
    }
    throw new Error('no instance');
  }, (p) => { const ok = []; for (let u = 1; u <= 40; u++) { const [c, d] = p.v === 0 ? [u, p.fixed] : [p.fixed, u]; const z = realV(p.cons).map(([x, y]) => c * x + d * y), m = Math.max(...z); if (z.filter((s) => abs(s - m) < 1e-7).length >= 2) ok.push(u); } return ok.length === 1 ? ok[0] : NaN; }),

  // g10: formulation
  gen('lp-g10', 3, 'mcq', 'single', 'formulation', retry((rng) => {
    const v = int(rng, 0, 2);
    if (v === 0) {
      const a1 = int(rng, 2, 6), a2 = int(rng, 1, 5), b1 = int(rng, 1, 5), b2 = int(rng, 2, 6), h1 = int(rng, 40, 90), h2 = int(rng, 30, 80);
      if (a1 === b1 || a2 === b2 || h1 === h2) return null;
      const right = `$${lt(a1, b1)}\\le${h1},\\ ${lt(a2, b2)}\\le${h2}$`;
      const wr = [`$${lt(b1, a1)}\\le${h1},\\ ${lt(b2, a2)}\\le${h2}$`, `$${lt(a1, b1)}\\ge${h1},\\ ${lt(a2, b2)}\\ge${h2}$`, `$${lt(a1, b1)}\\le${h2},\\ ${lt(a2, b2)}\\le${h1}$`];
      const { options, answer } = shuffleOpts(rng, right, wr);
      return { v, a1, a2, b1, b2, h1, h2, options, answer, q: `A factory makes $x$ units of A and $y$ units of B. Machine 1 works ${a1} hours per unit of A and ${b1} per unit of B, for at most ${h1} hours. Machine 2 works ${a2} hours per unit of A and ${b2} per unit of B, for at most ${h2} hours. The constraints (besides $x,y\\ge0$) are`, sol: `<p>Machine 1: $${lt(a1, b1)}\\le${h1}$. Machine 2: $${lt(a2, b2)}\\le${h2}$. "At most" gives $\\le$, and each coefficient goes with its own product.</p>` };
    }
    if (v === 1) {
      const a1 = int(rng, 2, 6), a2 = int(rng, 1, 5), b1 = int(rng, 1, 5), b2 = int(rng, 2, 6), n1 = int(rng, 8, 30), n2 = int(rng, 6, 24);
      if (a1 === b1 || a2 === b2 || n1 === n2) return null;
      const right = `$${lt(a1, b1)}\\ge${n1},\\ ${lt(a2, b2)}\\ge${n2}$`;
      const wr = [`$${lt(a1, b1)}\\le${n1},\\ ${lt(a2, b2)}\\le${n2}$`, `$${lt(b1, a1)}\\ge${n1},\\ ${lt(b2, a2)}\\ge${n2}$`, `$${lt(a1, b1)}\\ge${n2},\\ ${lt(a2, b2)}\\ge${n1}$`];
      const { options, answer } = shuffleOpts(rng, right, wr);
      return { v, a1, a2, b1, b2, n1, n2, options, answer, q: `A diet uses $x$ kg of food P and $y$ kg of food Q. Each kg of P has ${a1} units of protein and ${a2} of iron. Each kg of Q has ${b1} units of protein and ${b2} of iron. The diet needs at least ${n1} units of protein and at least ${n2} of iron. The constraints (besides $x,y\\ge0$) are`, sol: `<p>Protein: $${lt(a1, b1)}\\ge${n1}$. Iron: $${lt(a2, b2)}\\ge${n2}$. "At least" gives $\\ge$.</p>` };
    }
    const k = int(rng, 2, 4), T = int(rng, 10, 40), right = `$x\\ge${k}y,\\ x+y\\le${T}$`;
    const wr = [`$y\\ge${k}x,\\ x+y\\le${T}$`, `$x\\le${k}y,\\ x+y\\le${T}$`, `$x\\ge${k}y,\\ x+y\\ge${T}$`];
    const { options, answer } = shuffleOpts(rng, right, wr);
    return { v, k, T, options, answer, q: `A shop stocks $x$ ordinary phones and $y$ smart phones. It stocks at least ${k} times as many ordinary phones as smart phones, and at most ${T} phones in all. The constraints (besides $x,y\\ge0$) are`, sol: `<p>"At least $${k}$ times as many ordinary as smart" means $x\\ge${k}y$. "At most $${T}$ in all" means $x+y\\le${T}$.</p>` };
  }), (p) => {
    const want = p.v === 0 ?`$${lt(p.a1, p.b1)}\\le${p.h1},\\ ${lt(p.a2, p.b2)}\\le${p.h2}$` : p.v === 1 ? `$${lt(p.a1, p.b1)}\\ge${p.n1},\\ ${lt(p.a2, p.b2)}\\ge${p.n2}$` : `$x\\ge${p.k}y,\\ x+y\\le${p.T}$`;
    return p.options.indexOf(want);
  }),

  // g11: does a maximum or a minimum exist on an unbounded region?
  gen('lp-g11', 4, 'mcq', 'single', 'bounded and unbounded regions', retry((rng) => {
    const v = int(rng, 0, 2), c = int(rng, -4, 6), d = int(rng, -4, 6);
    if (c === 0 && d === 0) return null;
    let cons, cone; // cone: directions in which the region goes to infinity
    if (v === 0) { cons = [GE(int(rng, 1, 3), int(rng, 1, 3), int(rng, 4, 12))]; cone = [[1, 0], [0, 1]]; }
    else if (v === 1) { const { cons: cc } = rGE2(rng); cons = cc; cone = [[1, 0], [0, 1]]; }
    else { const k = int(rng, 1, 4); cons = [LE(1, -1, k)]; cone = [[0, 1], [1, 1]]; }
    const hasMax = cone.every(([u, w]) => c * u + d * w <= 0), hasMin = cone.every(([u, w]) => c * u + d * w >= 0);
    const right = hasMax && hasMin ? 'both a maximum and a minimum' : hasMax ? 'a maximum but no minimum' : hasMin ? 'a minimum but no maximum' : 'neither a maximum nor a minimum';
    const all = ['both a maximum and a minimum', 'a maximum but no minimum', 'a minimum but no maximum', 'neither a maximum nor a minimum'];
    const { options, answer } = shuffleOpts(rng, right, all.filter((s) => s !== right));
    const reg = consTx(cons);
    return { v, cons, c, d, options, answer, q: `On the feasible region ${reg}, $x\\ge0$, $y\\ge0$, the function $Z=${lt(c, d)}$ has`,
      sol: `<p>The region is unbounded: it runs to infinity along the directions ${cone.map(([u, w]) => `$(${u},${w})$`).join(' and ')}. Along them $Z$ changes by $${cone.map(([u, w]) => c * u + d * w).join('$ and $')}$ per unit step. A maximum exists only if $Z$ never increases along these directions, and a minimum exists only if it never decreases. Here that gives: ${right}.</p>` };
  }), (p) => {
    const ev = (M) => { const V = clipPoly(p.cons, M).map(([x, y]) => p.c * x + p.d * y); return [Math.max(...V), Math.min(...V)]; };
    const a = ev(1e4), b = ev(1e5), mx = abs(a[0] - b[0]) < 1e-6, mn = abs(a[1] - b[1]) < 1e-6;
    const want = mx && mn ? 'both a maximum and a minimum' : mx ? 'a maximum but no minimum' : mn ? 'a minimum but no maximum' : 'neither a maximum nor a minimum';
    return p.options.indexOf(want);
  }),

  // g12: transportation
  gen('lp-g12', 3, 'nat', 'integer', 'transportation', (rng) => {
    const v = int(rng, 0, 2);
    for (let t = 0; t < 300; t++) {
      const d1 = int(rng, 10, 30), d2 = int(rng, 10, 30), s1 = int(rng, 5, d1 + d2 - 5), s2 = d1 + d2 - s1, c11 = int(rng, 1, 9), c12 = int(rng, 1, 9), c21 = int(rng, 1, 9), c22 = int(rng, 1, 9);
      const lo = Math.max(0, d1 - s2), hi = Math.min(s1, d1), cost = (x) => c11 * x + c12 * (s1 - x) + c21 * (d1 - x) + c22 * (s2 - d1 + x), slope = c11 - c12 - c21 + c22;
      if (lo >= hi || slope === 0) continue;
      const xbest = slope < 0 ? hi : lo, xworst = slope < 0 ? lo : hi;
      const story = `Depot D1 has ${s1} units and depot D2 has ${s2} units. Shop S1 needs ${d1} units and shop S2 needs ${d2} units. The cost per unit is ${c11} (D1 to S1), ${c12} (D1 to S2), ${c21} (D2 to S1), ${c22} (D2 to S2).`;
      const base = `<p>Let D1 send $x$ units to S1. Then D1 sends $${s1}-x$ to S2, D2 sends $${d1}-x$ to S1 and $${s2 - d1}+x$ to S2. None can be negative, so $${lo}\\le x\\le${hi}$. The cost is $Z=${c11}x+${c12}(${s1}-x)+${c21}(${d1}-x)+${c22}(${s2 - d1}+x)=${slope}x+${cost(0)}$.</p>`;
      if (v === 0) return { v, d1, d2, s1, s2, c11, c12, c21, c22, answer: cost(xbest), tol: 0, q: `${story} Find the least total cost.`, sol: base + `<p>$Z$ is linear in $x$, so the minimum is at an end value: $Z(${lo})=${cost(lo)}$ and $Z(${hi})=${cost(hi)}$. The least cost is $${cost(xbest)}$.</p>` };
      if (v === 1) return { v, d1, d2, s1, s2, c11, c12, c21, c22, answer: xbest, tol: 0, q: `${story} How many units should D1 send to S1 for the least cost?`, sol: base + `<p>The slope is $${slope}$, so $Z$ is smallest at $x=${xbest}$ (where $Z=${cost(xbest)}$).</p>` };
      return { v, d1, d2, s1, s2, c11, c12, c21, c22, answer: cost(xworst), tol: 0, q: `${story} Find the largest possible total cost.`, sol: base + `<p>$Z(${lo})=${cost(lo)}$ and $Z(${hi})=${cost(hi)}$. The largest cost is $${cost(xworst)}$.</p>` };
    }
    throw new Error('no instance');
  }, (p) => {
    let best = Infinity, worst = -Infinity, bx = -1;
    for (let x = 0; x <= p.s1; x++) { const f = [x, p.s1 - x, p.d1 - x, p.s2 - p.d1 + x]; if (f.some((u) => u < 0)) continue; const z = p.c11 * f[0] + p.c12 * f[1] + p.c21 * f[2] + p.c22 * f[3]; if (z < best) { best = z; bx = x; } if (z > worst) worst = z; }
    return [best, bx, worst][p.v];
  }),

  // g13: optimum at a fractional corner
  gen('lp-g13', 4, 'nat', 'numeric', 'corner point method', (rng) => {
    const v = int(rng, 0, 2);
    for (let t = 0; t < 500; t++) {
      const a1 = int(rng, 1, 6), b1 = int(rng, 1, 6), a2 = int(rng, 1, 6), b2 = int(rng, 1, 6), c1 = int(rng, 12, 40), c2 = int(rng, 12, 40), det = a1 * b2 - a2 * b1;
      if (det === 0) continue;
      const x0 = (c1 * b2 - c2 * b1) / det, y0 = (a1 * c2 - a2 * c1) / det;
      if (x0 <= 0.2 || y0 <= 0.2 || (abs(x0 - Math.round(x0)) < 1e-9 && abs(y0 - Math.round(y0)) < 1e-9)) continue;
      const c = int(rng, 1, 9), d = int(rng, 1, 9);
      if (c * b1 === d * a1 || c * b2 === d * a2) continue;
      const cons = v === 0 ? [LE(a1, b1, c1), LE(a2, b2, c2)] : v === 1 ? [GE(a1, b1, c1), GE(a2, b2, c2)] : [LE(a1, b1, c1), LE(a2, b2, c2), LE(int(rng, 1, 2), int(rng, 1, 2), int(rng, 14, 30))];
      if (v === 2 && cornersOf(cons).length < 4) continue;
      const kind = v === 1 ? 'min' : 'max', val = kind === 'max' ? lpMax(cons, c, d) : lpMin(cons, c, d);
      return { v, cons, c, d, kind, answer: r2(val), tol: 0.01, q: `${kind === 'max' ? 'Maximise' : 'Minimise'} $${objTx(c, d)}$ subject to ${consTx(cons)}, $x\\ge0,\\ y\\ge0$.${N2}`, sol: `<p>The corner points are not all whole numbers. ${tabTx(cons, c, d)}.</p><p>The ${kind === 'max' ? 'largest' : 'smallest'} value is $${t2(val)}$.</p>` };
    }
    throw new Error('no instance');
  }, (p) => polyOpt(p.cons, p.c, p.d, p.kind)),

  // g14: lines meet at a point
  gen('lp-g14', 2, 'nat', 'integer', 'corner point method', (rng) => {
    for (;;) {
      const x0 = int(rng, 1, 9), y0 = int(rng, 1, 9), a1 = int(rng, 1, 5), b1 = int(rng, 1, 5), a2 = int(rng, 1, 5), b2 = int(rng, 1, 5);
      if (a1 * b2 === a2 * b1) continue;
      const c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0, v = int(rng, 0, 2), c = int(rng, 1, 7), d = int(rng, 1, 7);
      const eq = `$${lt(a1, b1)}=${c1}$ and $${lt(a2, b2)}=${c2}$`, how = `<p>Solve ${eq}. Eliminating one unknown gives $x=${x0}$ and $y=${y0}$.</p>`;
      if (v === 0) return { v, a1, b1, c1, a2, b2, c2, c, d, answer: x0, tol: 0, q: `The lines ${eq} meet at a point. Find its $x$-coordinate.`, sol: how };
      if (v === 1) return { v, a1, b1, c1, a2, b2, c2, c, d, answer: y0, tol: 0, q: `The lines ${eq} meet at a point. Find its $y$-coordinate.`, sol: how };
      return { v, a1, b1, c1, a2, b2, c2, c, d, answer: c * x0 + d * y0, tol: 0, q: `The lines ${eq} meet at a point $P$. Find the value of $Z=${lt(c, d)}$ at $P$.`, sol: how + `<p>$Z=${c}(${x0})+${d}(${y0})=${c * x0 + d * y0}$.</p>` };
    }
  }, (p) => { const det = p.a1 * p.b2 - p.a2 * p.b1, x = (p.c1 * p.b2 - p.c2 * p.b1) / det, y = (p.a1 * p.c2 - p.a2 * p.c1) / det; return [x, y, p.c * x + p.d * y][p.v]; }),

  // g15: how many integer values of the parameter keep the optimum at the middle corner
  gen('lp-g15', 4, 'nat', 'integer', 'multiple optimal solutions', (rng) => {
    const v = int(rng, 0, 1);
    for (let t = 0; t < 500; t++) {
      const { x0, y0, cons } = v === 0 ? rLE2(rng) : rGE2(rng), kind = v === 0 ? 'max' : 'min';
      let n = 0;
      for (let p = 1; p <= 400; p++) { const val = kind === 'max' ? lpMax(cons, 1, p) : lpMin(cons, 1, p); if (abs(val - (x0 + p * y0)) < 1e-9) n++; }
      if (n < 1 || n > 30) continue;
      return { v, cons, x0, y0, kind, answer: n, tol: 0, q: `For how many positive integers $p$ does $Z=x+py$ have its ${kind === 'max' ? 'maximum' : 'minimum'} (possibly tied with other corners) at the corner point $(${x0},${y0})$ of the region ${consTx(cons)}, $x\\ge0$, $y\\ge0$?`,
        sol: `<p>Corner points: ${cornersOf(cons).map((q) => `$${ptx(q)}$`).join(', ')}. The corner $(${x0},${y0})$ has $Z=${x0}+${y0}p$. Compare it with $Z$ at each other corner and keep the values of $p$ for which it is ${kind === 'max' ? 'at least' : 'at most'} all of them. This is a range of $p$ containing $${n}$ positive integers.</p>` };
    }
    throw new Error('no instance');
  }, (p) => { let n = 0; for (let q = 1; q <= 400; q++) { const z = realV(p.cons).map(([x, y]) => x + q * y), m = p.kind === 'max' ? Math.max(...z) : Math.min(...z); if (abs(m - (p.x0 + q * p.y0)) < 1e-7) n++; } return n; }),

  // g16: how many optimal points?
  gen('lp-g16', 4, 'mcq', 'single', 'multiple optimal solutions', (rng) => {
    const v = int(rng, 0, 2);
    for (let t = 0; t < 300; t++) {
      const tie = rng() < 0.5, k = int(rng, 1, 3);
      const base = v === 1 ? rGE2(rng) : rLE2(rng), cons = base.cons, j = int(rng, 0, 1);
      const [c, d] = tie ? [k * cons[j].a, k * cons[j].b] : [int(rng, 1, 9), int(rng, 1, 9)];
      if (c > 15 || d > 15) continue;
      const kind = v === 1 ? 'min' : 'max', T = lpTable(cons, c, d), m = kind === 'max' ? Math.max(...T.map((r) => r[2])) : Math.min(...T.map((r) => r[2])), cnt = T.filter((r) => abs(r[2] - m) < 1e-9).length;
      if (cnt > 2) continue;
      const right = cnt >= 2 ? 'infinitely many optimal points' : 'exactly one optimal point';
      const all = ['exactly one optimal point', 'exactly two optimal points', 'infinitely many optimal points', 'no optimal point'];
      const { options, answer } = shuffleOpts(rng, right, all.filter((s) => s !== right));
      const lead = v === 2 ? `A bakery maximises its profit $Z=${lt(c, d)}$ (in rupees) subject to ${consTx(cons)}, $x\\ge0$, $y\\ge0$.` : `${kind === 'max' ? 'Maximise' : 'Minimise'} $${objTx(c, d)}$ subject to ${consTx(cons)}, $x\\ge0$, $y\\ge0$.`;
      return { v, cons, c, d, kind, options, answer, q: `${lead} The optimal value is found by comparing the corner points: ${tabTx(cons, c, d)}. The problem has`, sol: `<p>The ${kind === 'max' ? 'largest' : 'smallest'} value of $Z$ is $${t2(m)}$, and it appears at ${cnt >= 2 ? 'two adjacent corner points, so it also holds at every point of the edge joining them: infinitely many optimal points' : 'one corner only, so the optimal point is unique'}.${v === 1 ? ' (The region is unbounded, but $Z$ has positive coefficients, so the smallest corner value is the minimum.)' : ''}</p>` };
    }
    throw new Error('no instance');
  }, (p) => {
    const V = realV(p.cons), z = V.map(([x, y]) => p.c * x + p.d * y), m = p.kind === 'max' ? Math.max(...z) : Math.min(...z), n = z.filter((s) => abs(s - m) < 1e-7).length;
    return p.options.indexOf(n >= 2 ? 'infinitely many optimal points' : 'exactly one optimal point');
  }),

  // g17: bounded region with a strip and a box
  gen('lp-g17', 5, 'nat', 'numeric', 'corner point method', (rng) => {
    const v = int(rng, 0, 2);
    for (let t = 0; t < 500; t++) {
      const p = int(rng, 1, 3), q = int(rng, 1, 3), c1 = int(rng, 4, 10), c2 = c1 + int(rng, 4, 10), A = int(rng, 3, 9), B = int(rng, 3, 9);
      const cons = [GE(p, q, c1), LE(p, q, c2), LE(1, 0, A), LE(0, 1, B)];
      const n = cornersOf(cons).length; if (n < 4) continue;
      const c = int(rng, -3, 8), d = int(rng, -3, 8); if (c === 0 && d === 0) continue;
      const vals = lpTable(cons, c, d).map((r) => r[2]);
      const kind = v === 1 ? 'min' : 'max', val = kind === 'max' ? Math.max(...vals) : Math.min(...vals);
      const lead = `Consider the region ${consTx(cons)}, $x\\ge0$, $y\\ge0$.`;
      const tab = `<p>The region is bounded. Its corner points and $Z=${lt(c, d)}$: ${tabTx(cons, c, d)}.</p>`;
      if (v === 2) return { v, cons, c, d, answer: n, tol: 0, q: `${lead} How many corner points does it have?`, sol: `<p>Corner points: ${cornersOf(cons).map((u) => `$${ptx(u)}$`).join(', ')}. That is $${n}$.</p>` };
      return { v, cons, c, d, kind, answer: r2(val), tol: 0.01, q: `${lead} Find the ${kind === 'max' ? 'maximum' : 'minimum'} value of $Z=${lt(c, d)}$.${N2}`, sol: tab + `<p>The ${kind === 'max' ? 'largest' : 'smallest'} value is $${t2(val)}$.</p>` };
    }
    throw new Error('no instance');
  }, (p) => (p.v === 2 ? realV(p.cons).length : polyOpt(p.cons, p.c, p.d, p.kind))),

  // g18: which corner point is best?
  gen('lp-g18', 2, 'mcq', 'single', 'corner point method', (rng) => {
    const v = int(rng, 0, 2);
    for (let t = 0; t < 400; t++) {
      const { cons } = rLE2(rng), P = cornersOf(cons), c = int(rng, v === 2 ? -4 : 1, 9), d = int(rng, v === 2 ? -4 : 1, 9);
      const kind = v === 1 ? 'min' : 'max', z = P.map(([x, y]) => c * x + d * y), m = kind === 'max' ? Math.max(...z) : Math.min(...z);
      if (z.filter((s) => abs(s - m) < 1e-9).length !== 1 || P.length < 4) continue;
      const right = `$${ptx(P[z.indexOf(m)])}$`, wrongs = P.filter((u, i) => z[i] !== m).map((u) => `$${ptx(u)}$`);
      if (new Set([right, ...wrongs]).size !== 4) continue;
      const { options, answer } = shuffleOpts(rng, right, wrongs);
      return { v, cons, c, d, kind, options, answer, q: `The feasible region ${consTx(cons)}, $x\\ge0$, $y\\ge0$ has corner points ${P.map((u) => `$${ptx(u)}$`).join(', ')}. At which point is $Z=${lt(c, d)}$ ${kind === 'max' ? 'largest' : 'smallest'}?`, sol: `<p>Values of $Z$: ${P.map((u, i) => `$${ptx(u)}\\to${t2(z[i])}$`).join(', ')}. The ${kind === 'max' ? 'largest' : 'smallest'} is $${t2(m)}$ at ${right}.</p>` };
    }
    throw new Error('no instance');
  }, (p) => {
    const V = realV(p.cons), z = V.map(([x, y]) => p.c * x + p.d * y), m = p.kind === 'max' ? Math.max(...z) : Math.min(...z), u = V[z.findIndex((s) => abs(s - m) < 1e-9)];
    return p.options.indexOf(`$${ptx(u)}$`);
  }),
];





// ===== expansion begin =====
// Expansion pass (2026-11-22): more L2-L5 items (ids lp-x001..), match/multi/passage items and new templates (lp-g19..).
const NI = [];
const bruteInt = (f, hi = 40) => { let c = 0; for (let x = 0; x <= hi; x++) for (let y = 0; y <= hi; y++) if (f(x, y)) c++; return c; };
const poly = (cons) => realV(cons);
const hullArea = (cons) => polyArea(cornersOf(cons));
const RA = [LE(1, 2, 10), LE(2, 1, 14)];
const RB = [GE(2, 1, 12), GE(1, 2, 12)];
const RC = [LE(1, 1, 8), LE(2, 1, 12), LE(0, 1, 6)];
const RD = [LE(3, 1, 15), LE(1, 1, 9), LE(1, 3, 21)];
const RE = [GE(3, 2, 18), GE(1, 2, 10)];
const RF = [GE(1, 2, 10), GE(3, 1, 15), GE(1, 1, 7)];
const RG = [LE(2, 3, 12), LE(3, 2, 12)];
const RH = [LE(2, 1, 18), LE(1, 1, 11), LE(1, 2, 16), LE(1, 0, 8)];
const RI = [LE(2, 1, 14), LE(1, 3, 21), LE(1, 0, 6)];
const RJ = [LE(3, 2, 19), LE(1, 3, 13)];
const RK = [GE(2, 3, 13), GE(5, 1, 12), LE(1, 1, 9)];
const RL = [LE(1, 1, 10), LE(1, 0, 6), LE(0, 1, 8)];
const RM = [LE(1, 1, 6), LE(1, 0, 4), LE(0, 1, 4)];
const RN = [GE(1, 1, 4), LE(1, 1, 10), LE(1, 0, 7), LE(0, 1, 7)];
const RO = [LE(1, 1, 10), LE(2, 1, 16), LE(1, 0, 7), LE(0, 1, 9)];
const RP = [LE(1, 2, 10), LE(3, 1, 15)];
const RQ = [LE(2, 3, 13), LE(3, 2, 13)];
let _lv = 4;
const XT4 = (q, rows, trap) => X(_lv, 'properties of an LPP', q, rows.map((r) => r[0]), rows.map((r, i) => (r[1] ? i : -1)).filter((i) => i >= 0), '<p>' + rows.map((r) => (r[1] ? '✓ ' : '✗ ') + r[2]).join(' ') + '</p>', trap);
const RBK = [LE(2, 1, 12), LE(1, 2, 12)]; // bakery
const RDI = [GE(4, 1, 16), GE(1, 2, 11)]; // diet

Object.assign(groups, {
  mx1: { title: 'Optimal values', passage: R`<p>All problems have $x\ge0,\ y\ge0$ and the constraints $x+2y\le8$, $3x+y\le9$. Match each objective in List I (to be maximised) with its maximum value in List II.</p>`,
    list1: [R`A. $Z=x+y$`, R`B. $Z=2x+y$`, R`C. $Z=x+3y$`, R`D. $Z=3x+y$`], list2: [R`p. $5$`, R`q. $7$`, R`r. $9$`, R`s. $12$`] },
  mx2: { title: 'Number of corner points', passage: R`<p>Match each feasible region in List I (always with $x\ge0,\ y\ge0$) with its number of corner points in List II.</p>`,
    list1: [R`A. $x+y\le4$`, R`B. $x\le3,\ y\le2$`, R`C. $x+y\le6,\ x\le4,\ y\le4$`, R`D. $x+y=4$ (an equation, not an inequality)`], list2: [R`p. $2$`, R`q. $3$`, R`r. $4$`, R`s. $5$`] },
  mx3: { title: 'Maximum over one region', passage: R`<p>A feasible region has corner points $(0,0)$, $(5,0)$, $(4,3)$ and $(0,5)$. Match each objective in List I (to be maximised) with its maximum in List II.</p>`,
    list1: [R`A. $Z=2x+y$`, R`B. $Z=x+y$`, R`C. $Z=3x+y$`, R`D. $Z=x+2y$`], list2: [R`p. $7$`, R`q. $10$`, R`r. $11$`, R`s. $15$`] },
  mx4: { title: 'Kinds of outcome', passage: R`<p>All problems have $x\ge0,\ y\ge0$. Match each LPP in List I with what happens in List II.</p>`,
    list1: [R`A. Maximise $x+y$ subject to $x+2y\le4$`, R`B. Maximise $x+2y$ subject to $x+2y\le4$`, R`C. Maximise $x+y$ subject to $x+y\ge2$`, R`D. Maximise $x+y$ subject to $x+y\le2$ and $x+y\ge3$`],
    list2: [R`p. There is no feasible point`, R`q. There is exactly one optimal point`, R`r. There are infinitely many optimal points`, R`s. There is no maximum`] },
  mx5: { title: 'Words to inequalities', passage: R`<p>A factory makes $x$ units of X and $y$ units of Y. Match each condition in List I with its inequality in List II.</p>`,
    list1: [R`A. The total number of units is at least $20$`, R`B. There are at most twice as many X as Y`, R`C. There must be at least one third as many Y as X`, R`D. X uses $3$ kg and Y uses $2$ kg of a material, with $60$ kg available`],
    list2: [R`p. $x-3y\le0$`, R`q. $3x+2y\le60$`, R`r. $x+y\ge20$`, R`s. $x-2y\le0$`] },
  mx6: { title: 'Where the maximum lies', passage: R`<p>The feasible region has corner points $(0,0)$, $(5,0)$, $(4,3)$ and $(0,5)$. Match each objective in List I (to be maximised) with where the maximum occurs in List II.</p>`,
    list1: [R`A. $Z=5x+y$`, R`B. $Z=2x+3y$`, R`C. $Z=x+4y$`, R`D. $Z=3x+y$`],
    list2: [R`p. At $(0,5)$ only`, R`q. At $(5,0)$ only`, R`r. At both $(5,0)$ and $(4,3)$ (and every point between)`, R`s. At $(4,3)$ only`] },
  mx7: { title: 'Areas of feasible regions', passage: R`<p>Match each feasible region in List I (always with $x\ge0,\ y\ge0$) with its area in List II.</p>`,
    list1: [R`A. $x+y\le6$`, R`B. $x\le4,\ y\le3$`, R`C. $x+y\le6,\ x\le4$`, R`D. $x+y\ge2,\ x\le3,\ y\le3$`], list2: [R`p. $7$`, R`q. $12$`, R`r. $16$`, R`s. $18$`] },
  mx8: { title: 'Optimal values of different problems', passage: R`<p>Match each problem in List I (all with $x\ge0,\ y\ge0$) with its optimal value in List II.</p>`,
    list1: [R`A. Maximise $3x+4y$ subject to $2x+y\le10$, $x+2y\le8$`, R`B. Maximise $2x+5y$ subject to $x+y\le6$, $x\le4$`, R`C. Minimise $2x+3y$ subject to $x+y\ge5$, $x+3y\ge9$, $3x+y\ge9$`, R`D. Maximise $5x+6y$ subject to $x+y\le10$, $x+3y\le24$, $3x+y\le24$`],
    list2: [R`p. $12$`, R`q. $20$`, R`r. $30$`, R`s. $57$`] },
  pz5: { title: 'Passage: a bakery', passage: R`<p>A bakery makes $x$ cakes and $y$ pies a day. The profit is $Z=30x+20y$ rupees. The oven allows $2x+y\le12$ and the mixer allows $x+2y\le12$. Also $x\ge0,\ y\ge0$.</p>` },
  pz6: { title: 'Passage: a cheap diet', passage: R`<p>A diet uses $x$ units of food P and $y$ units of food Q. It needs at least $16$ units of protein ($4x+y\ge16$) and at least $11$ units of fibre ($x+2y\ge11$), with $x\ge0,\ y\ge0$. The cost is $Z=5x+2y$ rupees.</p>` },
});

// ----- L2 -----
NI.push(
  bM(2, 'corner point method', RA, 3, 2, 'max', 'Compare every corner point.'),
  M(2, 'feasible region', R`Which point satisfies $x+2y\le8$, $3x+y\le9$, $x\ge0$ and $y\ge0$?`, R`$(2,3)$`, [R`$(3,3)$`, R`$(4,3)$`, R`$(0,5)$`],
    R`<p>$(2,3)$: $2+6=8\le8$ and $6+3=9\le9$, so it is feasible. $(3,3)$ gives $3+6=9>8$. $(4,3)$ gives $10>8$. $(0,5)$ gives $10>8$.</p>`, 'Test both inequalities.'),
  I(2, 'corner point method', R`How many corner points does the region $2x+y\le8$, $x+y\le5$, $x\ge0$, $y\ge0$ have?`, 4,
    R`<p>The corners are $(0,0)$, $(4,0)$, $(3,2)$ (where the two lines meet) and $(0,5)$. That is $4$.</p>`, 'Check which line is closer to the origin on each axis.', { calc: () => cornersOf([LE(2, 1, 8), LE(1, 1, 5)]).length }),
  bM(2, 'bounded and unbounded', RB, 3, 2, 'min', 'The region is unbounded, but the minimum still exists.'),
  M(2, 'formulation', R`A carpenter spends $3$ hours on each table ($x$) and $2$ hours on each chair ($y$). He has at most $24$ hours. The constraint is`, R`$3x+2y\le24$`, [R`$2x+3y\le24$`, R`$3x+2y\ge24$`, R`$3x+2y=24$ only`],
    R`<p>Hours used: $3x+2y$. "At most" means $\le$: $3x+2y\le24$.</p>`, 'Tables take 3 hours, not chairs.'),
  bI(2, 'corner point method', [LE(1, 0, 4), LE(0, 1, 3)], 1, 1, 'max', 'The region is a rectangle.'),
);

// ----- L3 -----
NI.push(
  bI(3, 'corner point method', RC, 5, 4, 'max', 'Compare every corner.'),
  bAt(3, 'corner point method', RC, 5, 4, 'max', 'x', 'Find the corner where the best value occurs.'),
  bM(3, 'corner point method', RD, 4, 3, 'max', 'The line $x+y=9$ passes through the same corner.'),
  bI(3, 'bounded and unbounded', RE, 2, 3, 'min', 'The region is unbounded; positive coefficients make the minimum exist.'),
  I(3, 'polygon area', R`Find the area of the feasible region $x+2y\le10$, $2x+y\le14$, $x\ge0$, $y\ge0$.`, 22,
    R`<p>The corners in order are $(0,0)$, $(7,0)$, $(6,2)$, $(0,5)$. Shoelace: $\dfrac12|0+(7\cdot2-6\cdot0)+(6\cdot5-0\cdot2)+0|=\dfrac12(14+30)=22$.</p>`, 'Find $(6,2)$ by solving the two lines.', { calc: () => hullArea(RA) }),
  A(3, 'corner point method', R`The maximum of $Z=2x+3y$ over the region $x+y\le4$, $x\ge0$, $y\ge0$ is $12$.`, R`A linear function over a bounded polygon attains its maximum at a corner point.`, 0,
    R`<p>The corners are $(0,0)$, $(4,0)$, $(0,4)$ with $Z=0,8,12$. R is the rule used to get A, so it explains A.</p>`, 'Check every corner.'),
  S(3, 'bounded and unbounded', R`Every LPP with a non-empty feasible region has an optimal solution.`, R`If the feasible region is bounded, $Z$ has both a maximum and a minimum.`, 2,
    R`<p>Statement I is false (for example, maximising $x+y$ with $x+y\ge2$ has no maximum). Statement II is true: the corner point theorem.</p>`, 'Unbounded regions can fail.'),
  MT(3, 'corner point method', 'mx1', R`Match List I with List II.`, 'A-p, B-q, C-s, D-r', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-p, B-r, C-s, D-q'],
    R`<p>Corners: $(0,0)$, $(3,0)$, $(2,3)$, $(0,4)$. $x+y$: $0,3,5,4$ so $5$ (p). $2x+y$: $0,6,7,4$ so $7$ (q). $x+3y$: $0,3,11,12$ so $12$ (s). $3x+y$: $0,9,9,4$ so $9$ (r).</p>`, 'Evaluate at all four corners.'),
  MT(3, 'corner point method', 'mx2', R`Match List I with List II.`, 'A-q, B-r, C-s, D-p', ['A-q, B-r, C-p, D-s', 'A-r, B-q, C-s, D-p', 'A-q, B-s, C-r, D-p'],
    R`<p>A: $(0,0)$, $(4,0)$, $(0,4)$ gives $3$ (q). B: a rectangle, $4$ (r). C: $(0,0)$, $(4,0)$, $(4,2)$, $(2,4)$, $(0,4)$ gives $5$ (s). D: the region is the segment from $(4,0)$ to $(0,4)$, with $2$ corner points (p).</p>`, 'An equation gives a line segment, not an area.'),
  PI(3, 'corner point method', 'pz5', R`Find the maximum profit (in rupees).`, 200,
    R`<p>Corners: $(0,0)$, $(6,0)$, $(4,4)$, $(0,6)$. $Z=0,180,200,120$. The maximum is $200$.</p>`, 'Solve $2x+y=12$ and $x+2y=12$ for $(4,4)$.', { calc: () => lpMax(RBK, 30, 20) }),
  PI(3, 'corner point method', 'pz5', R`How many corner points does the feasible region have?`, 4,
    R`<p>The corners are $(0,0)$, $(6,0)$, $(4,4)$ and $(0,6)$.</p>`, '', { calc: () => cornersOf(RBK).length }),
  M(3, 'feasible region', R`The constraints $x+2y\ge10$ and $x+2y\le6$ (with $x\ge0$, $y\ge0$) give a feasible region that is`, R`empty`, [R`a bounded polygon`, R`an unbounded region`, R`a single point`],
    R`<p>A point cannot have $x+2y$ at least $10$ and at most $6$ at the same time. No point is feasible.</p>`, 'Check whether the two conditions can hold together.'),
  I(3, 'lattice points', R`How many points with integer coordinates satisfy $x+y\le6$, $x\ge0$, $y\ge0$?`, 28,
    R`<p>For $x=0,1,\dots,6$ the number of $y$ values is $7,6,5,4,3,2,1$. Total $=28$.</p>`, 'Count $y=0$ too.', { calc: () => bruteInt((x, y) => x + y <= 6, 10) }),
  bM(3, 'bounded and unbounded', RF, 4, 5, 'min', 'The constraint $x+y\\ge7$ touches the region only at the corner $(4,3)$.'),
  bN(3, 'numeric corner point', RG, 1, 1, 'max', 'The best corner is not a whole-number point.'),
);

// ----- L4 -----
const redund = (cons) => { const A0 = hullArea(cons); return cons.filter((_, i) => Math.abs(hullArea(cons.filter((__, j) => j !== i)) - A0) < 1e-9).length; };
const intLP = bruteInt((x, y) => 2 * x + 3 * y <= 13 && 3 * x + 2 * y <= 13, 20);
const intBest = (() => { let b = -1; for (let x = 0; x <= 10; x++) for (let y = 0; y <= 10; y++) if (2 * x + 3 * y <= 13 && 3 * x + 2 * y <= 13) b = Math.max(b, x + y); return b; })();
NI.push(
  bI(4, 'corner point method', RH, 3, 4, 'max', 'Check all six corner points.'),
  bAt(4, 'corner point method', RH, 3, 4, 'max', 'y', 'Find the corner with the largest value.'),
  I(4, 'bounded and unbounded', R`Consider $3x+y\le15$, $x+y\le9$, $x+3y\le21$, $x\ge0$, $y\ge0$. How many of the three constraints are redundant (removing it does not change the region)?`, redund(RD),
    R`<p>The lines $3x+y=15$ and $x+3y=21$ meet at $(3,6)$, and $x+y=9$ also passes through $(3,6)$. The line $x+y=9$ only touches the region at that corner, so it can be removed without changing the region. Removing either of the others cuts the region. So exactly $1$ is redundant.</p>`, 'Check where the third line passes.', { calc: () => redund(RD) }),
  I(4, 'integer solutions', R`Maximise $Z=x+y$ subject to $2x+3y\le13$, $3x+2y\le13$ where $x$ and $y$ must be non-negative integers. Find the maximum value of $Z$.`, intBest,
    R`<p>Without the integer condition, the corner $(2.6,2.6)$ gives $Z=5.2$. For integers, $Z\le5$. $(2,3)$ gives $4+9=13\le13$ and $6+6=12\le13$ so it is allowed, with $Z=5$. The integer maximum is $5$.</p>`, 'Rounding the LP corner gives an infeasible point.', { calc: () => intBest }),
  I(4, 'distance from the origin', R`Find the minimum value of $x^2+y^2$ over the region $x+y\ge4$, $x\ge0$, $y\ge0$.`, 8,
    R`<p>$x^2+y^2$ is the squared distance from the origin. The closest point of the region to $O$ is the foot of the perpendicular on $x+y=4$, which is $(2,2)$. The minimum is $4+4=8$.</p>`, 'This objective is not linear; use distance.', { calc: () => { let m = 1e9; for (let x = 0; x <= 4; x += 0.001) m = Math.min(m, x * x + (4 - x) ** 2); return Math.round(m); } }),
  I(4, 'feasible region', R`How many corner points does the region $2x+y\le18$, $x+y\le11$, $x+2y\le16$, $x\le8$, $x\ge0$, $y\ge0$ have?`, cornersOf(RH).length,
    R`<p>The corners are $(0,0)$, $(8,0)$, $(8,2)$, $(7,4)$, $(6,5)$, $(0,8)$. That is $6$.</p>`, 'Look for each line that forms an edge.', { calc: () => cornersOf(RH).length }),
  I(4, 'polygon area', R`The feasible region is $3x+y\le15$, $x+y\le9$, $x+3y\le21$, $x\ge0$, $y\ge0$. If its area is $A$, find $2A$.`, 51,
    R`<p>The corners in order are $(0,0)$, $(5,0)$, $(3,6)$, $(0,7)$. Shoelace: $2A=|0+(5\cdot6-3\cdot0)+(3\cdot7-0\cdot6)+0|=30+21=51$.</p>`, 'The corner $(3,6)$ is where two lines meet.', { calc: () => 2 * hullArea(RD) }),
  bI(4, 'multiple optimal solutions', RI, 1, 3, 'max', 'More than one corner gives the maximum.'),
  I(4, 'corner point method', R`Minimise $Z=3x+2y$ subject to $2x+y\ge12$, $x+2y\ge12$, $x\ge0$, $y\ge0$. At the optimal point, find $x+y$.`, 8,
    R`<p>The corners are $(0,12)$, $(4,4)$ and $(12,0)$ with $Z=24,20,36$. The minimum is at $(4,4)$, so $x+y=8$.</p>`, 'The region is unbounded; the minimum is at the corner where the lines meet.', { calc: () => { const T = lpTable(RB, 3, 2); const b = T.reduce((u, v) => (v[2] < u[2] ? v : u)); return b[0] + b[1]; } }),
  bN(4, 'numeric corner point', RJ, 1, 2, 'max', 'The optimal corner has fractional coordinates.'),
  N(4, 'distance from the origin', R`Find the shortest distance from the origin to the feasible region $3x+4y\ge12$, $x\ge0$, $y\ge0$. (decimal)`, 2.4, 0.01,
    R`<p>The region lies on the far side of the line $3x+4y=12$, so the nearest point is on that line. Distance of the origin from it $=\dfrac{12}{\sqrt{9+16}}=2.4$ (the foot $(1.44,1.92)$ is in the first quadrant).</p>`, 'Perpendicular distance, not an intercept.', { calc: () => 12 / Math.hypot(3, 4) }),
  N(4, 'polygon area', R`Find the area of the feasible region $2x+y\le8$, $x+2y\le8$, $x\ge0$, $y\ge0$. (2 decimal places)`, 10.67, 0.01,
    R`<p>The corners are $(0,0)$, $(4,0)$, $\left(\dfrac83,\dfrac83\right)$ and $(0,4)$. Shoelace: $\dfrac12\left(\dfrac{32}3+\dfrac{32}3\right)=\dfrac{32}3\approx10.67$.</p>`, 'The two lines meet at $\\left(\\dfrac83,\\dfrac83\\right)$.', { calc: () => hullArea([LE(2, 1, 8), LE(1, 2, 8)]) }),
  N(4, 'numeric corner point', R`Maximise $Z=x+2y$ subject to $3x+2y\le19$, $x+3y\le13$, $x\ge0$, $y\ge0$. Find the $x$-coordinate of the optimal point. (2 decimal places)`, 4.43, 0.01,
    R`<p>The corners are $(0,0)$, $\left(\dfrac{19}3,0\right)$, $\left(\dfrac{31}7,\dfrac{20}7\right)$ and $\left(0,\dfrac{13}3\right)$ with $Z=0,6.33,10.14,8.67$. The maximum is at $\left(\dfrac{31}7,\dfrac{20}7\right)$, so $x=\dfrac{31}7\approx4.43$.</p>`, 'Solve the two lines together.', { calc: () => { const T = lpTable(RJ, 1, 2); return T.reduce((u, v) => (v[2] > u[2] ? v : u))[0]; } }),
  XT4('The statements below are about linear programming problems. Which are correct?', [
    [R`The feasible region is always convex`, true, R`It is an intersection of half-planes.`],
    [R`If an optimal solution exists, it occurs at a corner point`, true, R`This is the corner point theorem.`],
    [R`An LPP can have exactly two optimal solutions`, false, R`If two points are optimal, every point between them is optimal, so there are $1$ or infinitely many.`],
    [R`If the feasible region is bounded, $Z$ has a maximum and a minimum`, true, R`A linear function on a bounded polygon reaches both at corners.`],
  ], 'Two optimal points force a whole segment.'),
  XT4(R`Constraints: $x+2y\le10$, $3x+y\le15$, $x,y\ge0$. Which of these points are feasible?`, [
    [R`$(3,3)$`, true, R`$3+6=9\le10$, $9+3=12\le15$.`],
    [R`$(4,3)$`, true, R`$4+6=10\le10$, $12+3=15\le15$.`],
    [R`$(4,4)$`, false, R`$4+8=12>10$.`],
    [R`$(0,6)$`, false, R`$12>10$.`],
  ], 'Boundary points are feasible.'),
  XT4(R`The region is $x+y\ge4$, $x\ge0$, $y\ge0$. Which statements are correct?`, [
    [R`The region is unbounded`, true, R`$x+y$ can grow without limit.`],
    [R`$Z=2x+3y$ has a minimum value $8$`, true, R`Corners $(4,0)$ and $(0,4)$ give $8$ and $12$.`],
    [R`$Z=2x+3y$ has a maximum`, false, R`$Z\to\infty$ as $x\to\infty$.`],
    [R`The corner points are $(4,0)$ and $(0,4)$`, true, R`Only the lines $x+y=4$ with the axes.`],
  ], 'Unbounded regions can have a minimum but no maximum.'),
  XT4(R`The region is $x+2y\le10$, $3x+y\le15$, $x,y\ge0$ with corners $(0,0)$, $(5,0)$, $(4,3)$, $(0,5)$. For $Z=3x+y$, which are correct?`, [
    [R`The maximum value is $15$`, true, R`$Z=0,15,15,5$ at the corners.`],
    [R`It is attained at $(4,3)$`, true, R`$12+3=15$.`],
    [R`It is attained at $(4.5,1.5)$`, true, R`$13.5+1.5=15$ and $(4.5,1.5)$ is feasible ($4.5+3=7.5\le10$).`],
    [R`It is attained at $(0,5)$`, false, R`$Z=5$ there.`],
  ], 'Points on the edge between two optimal corners are optimal too.'),
  XT4(R`A diet needs at least $8$ units of A. Food X has $2$ units of A per kg and food Y has $3$. At most $10$ kg of food is allowed, and the amount of X is at least the amount of Y. Which inequalities describe this?`, [
    [R`$2x+3y\ge8$`, true, R`At least $8$ units of A.`],
    [R`$x+y\le10$`, true, R`At most $10$ kg.`],
    [R`$x-y\ge0$`, true, R`X is at least Y.`],
    [R`$2x+3y\le8$`, false, R`"At least" means $\ge$.`],
  ], 'Read each phrase for its direction.'),
  XT4(R`Which of these constraint sets (with $x,y\ge0$) give an empty feasible region?`, [
    [R`$x+y\le3$ and $x+y\ge5$`, true, R`The sum cannot be both at most $3$ and at least $5$.`],
    [R`$x+y\ge3$ and $x+y\le5$`, false, R`A strip between the lines, not empty.`],
    [R`$x\ge4$ and $x+y\le3$`, true, R`$x\ge4$ forces $x+y\ge4>3$ since $y\ge0$.`],
    [R`$x\le4$ and $y\le3$`, false, R`A rectangle.`],
  ], 'Remember $y\\ge0$.'),
  A(4, 'multiple optimal solutions', R`An LPP can have exactly two optimal solutions.`, R`If two different points are both optimal, every point on the segment between them is also optimal.`, 3,
    R`<p>R is true: $Z$ is linear, so on the segment $Z=tZ(P)+(1-t)Z(Q)$ equals the optimal value. So an LPP with two optimal points has infinitely many. A is false.</p>`, 'Check the points between.'),
  A(4, 'bounded and unbounded', R`The maximum of $Z=x+y$ over the region $x+y\ge2$, $x\ge0$, $y\ge0$ does not exist.`, R`The region is unbounded and $Z$ grows without limit along it.`, 0,
    R`<p>The points $(t,0)$ with $t\ge2$ are feasible and $Z=t\to\infty$. So there is no maximum (A true), and R is exactly why.</p>`, 'Look for a direction in which both the region and Z keep growing.'),
  SC(4, 'checking statements', [R`The feasible region of an LPP is always convex.`, R`A linear function on a bounded region has its maximum at a corner point.`, R`The set $x+y\ge5$, $x+y\le3$ has a feasible point.`, R`An LPP with an unbounded region never has an optimal solution.`], '2', ['1', '3', '4'],
    R`<p>(1) true. (2) true. (3) false: no point satisfies both. (4) false: for instance, minimising $x+y$ over $x+y\ge4$ has a minimum $4$. So $2$ are correct.</p>`, 'Unbounded regions may still have a minimum.'),
  S(4, 'bounded and unbounded', R`Removing a redundant constraint does not change the feasible region.`, R`In the region $3x+y\le15$, $x+3y\le21$, $x\ge0$, $y\ge0$, the constraint $x+y\le9$ is redundant.`, 0,
    R`<p>Statement I is the meaning of redundant. For II, the lines $3x+y=15$ and $x+3y=21$ meet at $(3,6)$, which lies on $x+y=9$, and $x+y\le9$ holds at every corner $(0,0),(5,0),(3,6),(0,7)$ ($0,5,9,7$), so it is redundant.</p>`, 'Test the third constraint at every corner.'),
  MT(4, 'corner point method', 'mx3', R`Match List I with List II.`, 'A-r, B-p, C-s, D-q', ['A-r, B-p, C-q, D-s', 'A-p, B-r, C-s, D-q', 'A-r, B-s, C-p, D-q'],
    R`<p>Corners $(0,0),(5,0),(4,3),(0,5)$. $2x+y$: $0,10,11,5$, so $11$ (r). $x+y$: $0,5,7,5$, so $7$ (p). $3x+y$: $0,15,15,5$, so $15$ (s). $x+2y$: $0,5,10,10$, so $10$ (q).</p>`, 'Evaluate at all four corners.'),
  MT(4, 'multiple optimal solutions', 'mx4', R`Match List I with List II.`, 'A-q, B-r, C-s, D-p', ['A-q, B-r, C-p, D-s', 'A-r, B-q, C-s, D-p', 'A-q, B-s, C-r, D-p'],
    R`<p>A: corners $(0,0)$, $(4,0)$, $(0,2)$, $Z=0,4,2$; one optimal point (q). B: $Z=0,4,4$: the whole edge, infinitely many (r). C: unbounded in the direction of increasing $Z$, no maximum (s). D: the conditions conflict, no feasible point (p).</p>`, 'Compare all corners; look for ties.'),
  MT(4, 'formulation', 'mx5', R`Match List I with List II.`, 'A-r, B-s, C-p, D-q', ['A-r, B-s, C-q, D-p', 'A-s, B-r, C-p, D-q', 'A-r, B-p, C-s, D-q'],
    R`<p>A: $x+y\ge20$ (r). B: $x\le2y$, i.e. $x-2y\le0$ (s). C: $y\ge\dfrac x3$, i.e. $x-3y\le0$ (p). D: $3x+2y\le60$ (q).</p>`, 'Turn "at most twice" into $x\\le2y$.'),
  PI(4, 'corner point method', 'pz5', R`The profit per cake rises to $50$ rupees, so $Z=50x+20y$. Find the new maximum profit.`, 300,
    R`<p>$Z$ at the corners: $(0,0)\to0$, $(6,0)\to300$, $(4,4)\to280$, $(0,6)\to120$. The maximum is $300$, now at $(6,0)$.</p>`, 'The best corner can change when a coefficient changes.', { calc: () => lpMax(RBK, 50, 20) }),
  PI(4, 'corner point method', 'pz6', R`Find the minimum cost in rupees.`, 23,
    R`<p>The corners are $(0,16)$, $(3,4)$ (where $4x+y=16$ meets $x+2y=11$) and $(11,0)$. $Z=32,23,55$. The minimum is $23$.</p>`, 'The region is unbounded; positive costs make the minimum exist.', { calc: () => lpMin(RDI, 5, 2) }),
  PI(4, 'corner point method', 'pz6', R`Find the value of $x$ at the cheapest diet.`, 3,
    R`<p>The minimum $Z=23$ occurs at $(3,4)$, so $x=3$.</p>`, '', { calc: () => lpTable(RDI, 5, 2).reduce((u, v) => (v[2] < u[2] ? v : u))[0] }),
  PN(4, 'numeric corner point', 'pz6', R`The cost of food P falls to $1.5$ rupees per unit, so $Z=1.5x+2y$. Find the new minimum cost. (decimal)`, 12.5, 0.01,
    R`<p>$Z$ at the corners: $(0,16)\to32$, $(3,4)\to4.5+8=12.5$, $(11,0)\to16.5$. The minimum is $12.5$.</p>`, 'Recompute at every corner.', { calc: () => lpMin(RDI, 1.5, 2) }),
);

// ----- L5 -----
_lv = 5;
const pq = (() => { for (let p = 1; p <= 9; p++) for (let q = 1; q <= 9; q++) if (p + q === 6 && Math.abs(4 * p + 3 * q - 5 * q) < 1e-9 && Math.max(0, 5 * p, 4 * p + 3 * q, 5 * q) === 5 * q) return p * q; return NaN; })();
const kCount = (() => { let c = 0; for (let k = 0; k <= 10; k++) { const v = [0, 5, 4 + 3 * k, 5 * k]; if (v[2] >= Math.max(...v) - 1e-9) c++; } return c; })();
const optLat = (() => { const best = 10; return bruteInt((x, y) => x + y === best && x <= 6 && y <= 8 && x + y <= 10, 12); })();
const maxSq = Math.max(...cornersOf(RM).map(([x, y]) => x * x + y * y));
NI.push(
  I(5, 'multiple optimal solutions', R`The maximum of $Z=px+qy$ over the region $x+2y\le10$, $3x+y\le15$, $x\ge0$, $y\ge0$ occurs at both $(4,3)$ and $(0,5)$, and $p+q=6$. Find $pq$.`, pq,
    R`<p>Equal values: $4p+3q=5q$, so $4p=2q$ and $q=2p$. With $p+q=6$: $p=2$, $q=4$, $pq=8$. Check: $Z(4,3)=8+12=20$, $Z(0,5)=20$, $Z(5,0)=10$, $Z(0,0)=0$, so $20$ is the maximum.</p>`, 'Check that the tied value is really the maximum.', { calc: () => pq }),
  I(5, 'multiple optimal solutions', R`Over the region $x+2y\le10$, $3x+y\le15$, $x\ge0$, $y\ge0$ (corners $(0,0)$, $(5,0)$, $(4,3)$, $(0,5)$), for how many integers $k$ with $0\le k\le10$ does $Z=x+ky$ attain its maximum at $(4,3)$ (ties allowed)?`, kCount,
    R`<p>$Z(5,0)=5$, $Z(4,3)=4+3k$, $Z(0,5)=5k$. $(4,3)$ is a maximum when $4+3k\ge5$ (so $k\ge\dfrac13$) and $4+3k\ge5k$ (so $k\le2$). The integers are $k=1,2$, that is $2$ values.</p>`, 'Include the tie at $k=2$.', { calc: () => kCount }),
  I(5, 'lattice points', R`Maximise $Z=x+y$ subject to $x+y\le10$, $x\le6$, $y\le8$, $x\ge0$, $y\ge0$. How many points with integer coordinates give the maximum?`, optLat,
    R`<p>The maximum is $10$ along the edge $x+y=10$, from $(6,4)$ to $(2,8)$. Integer points: $(6,4)$, $(5,5)$, $(4,6)$, $(3,7)$, $(2,8)$. That is $5$.</p>`, 'Count both end points of the edge.', { calc: () => optLat }),
  I(5, 'polygon area', R`Find the area of the feasible region $x+y\ge4$, $x+y\le10$, $x\le7$, $y\le7$, $x\ge0$, $y\ge0$.`, 33,
    R`<p>The corners are $(4,0)$, $(7,0)$, $(7,3)$, $(3,7)$, $(0,7)$, $(0,4)$. The square $0\le x,y\le7$ has area $49$. Remove the triangle below $x+y=4$ (legs $4$, area $8$) and the triangle above $x+y=10$ (legs $4$, area $8$): $49-8-8=33$.</p>`, 'Subtract two corner triangles from the square.', { calc: () => hullArea(RN) }),
  I(5, 'distance from the origin', R`Find the maximum value of $x^2+y^2$ over the region $x+y\le6$, $x\le4$, $y\le4$, $x\ge0$, $y\ge0$.`, maxSq,
    R`<p>A convex function such as $x^2+y^2$ reaches its maximum at a corner. The corners are $(0,0)$, $(4,0)$, $(4,2)$, $(2,4)$, $(0,4)$ with values $0,16,20,20,16$. The maximum is $20$.</p>`, 'Compare all corners, not just the farthest axis points.', { calc: () => maxSq }),
  bN(5, 'numeric corner point', RK, 2, 5, 'max', 'The best corner has fractional coordinates.'),
  N(5, 'polygon area', R`Find the area of the feasible region $2x+3y\ge13$, $5x+y\ge12$, $x+y\le9$, $x\ge0$, $y\ge0$. (2 decimal places)`, +hullArea(RK).toFixed(2), 0.01,
    R`<p>The corners in order are $(6.5,0)$, $(9,0)$, $(0.75,8.25)$ and $\left(\dfrac{23}{13},\dfrac{41}{13}\right)\approx(1.77,3.15)$. The shoelace formula over these four corners gives the area.</p>`, 'Find all four corners first; $(1.77,3.15)$ comes from the two "at least" lines.', { calc: () => hullArea(RK) }),
  XT4(R`The region is $x+y\le6$, $x\le4$, $y\le4$, $x\ge0$, $y\ge0$. Which objectives (to be maximised) have a unique optimal point at $(4,2)$?`, [
    [R`$Z=3x+y$`, true, R`Corners: $(4,0)\to12$, $(4,2)\to14$, $(2,4)\to10$.`],
    [R`$Z=x+y$`, false, R`$Z=6$ at both $(4,2)$ and $(2,4)$.`],
    [R`$Z=2x+y$`, true, R`$(4,2)\to10$, $(2,4)\to8$, $(4,0)\to8$.`],
    [R`$Z=x+2y$`, false, R`$(2,4)\to10$ beats $(4,2)\to8$.`],
  ], 'Check the neighbouring corners.'),
  XT4(R`The region is $x-y\le2$, $x+y\ge4$, $x\ge0$, $y\ge0$. Which statements are correct?`, [
    [R`The minimum of $x+y$ is $4$`, true, R`The corners are $(3,1)$ and $(0,4)$, both with $x+y=4$.`],
    [R`$x+y$ has infinitely many minimisers`, true, R`Both ends of the segment give $4$, so all points between do.`],
    [R`$x+y$ has no maximum`, true, R`The region is unbounded, and $x+y$ grows without limit.`],
    [R`$y-x$ has a maximum`, false, R`Moving up along $x=0$ gives $y-x\to\infty$.`],
  ], 'Look for ties and unbounded directions.'),
  XT4(R`The bakery problem: maximise $Z=30x+20y$ subject to $2x+y\le12$, $x+2y\le12$, $x,y\ge0$. Which are correct?`, [
    [R`The maximum is $200$`, true, R`At $(4,4)$.`],
    [R`The maximum is at $(4,4)$`, true, R`$Z=0,180,200,120$ at the corners.`],
    [R`If the profit on cakes becomes $50$, the best corner is $(6,0)$ with $300$`, true, R`$Z=0,300,280,120$.`],
    [R`If $Z=30x+30y$, the maximum is attained at two corners`, false, R`$Z=0,180,240,180$: unique at $(4,4)$.`],
  ], 'Recompute for every changed objective.'),
  XT4(R`The region is $x+y\le10$, $2x+y\le16$, $x\le7$, $y\le9$, $x,y\ge0$. Which are correct?`, [
    [R`It has $6$ corner points`, true, R`$(0,0)$, $(7,0)$, $(7,2)$, $(6,4)$, $(1,9)$, $(0,9)$.`],
    [R`No constraint is redundant`, true, R`Each of the four lines carries an edge.`],
    [R`$Z=x+y$ has infinitely many optimal points`, true, R`$Z=10$ at both $(6,4)$ and $(1,9)$.`],
    [R`$Z=2x+y$ is maximised at exactly one corner`, false, R`$Z=16$ at both $(7,2)$ and $(6,4)$.`],
  ], 'Ties between neighbouring corners mean a whole edge.'),
  A(5, 'bounded and unbounded', R`The problem "maximise $Z=2x-y$ subject to $x-y\le1$, $x\ge0$, $y\ge0$" has no optimal solution.`, R`The points $(1+t,\,t)$, $t\ge0$, are feasible and $Z=2+t$ at them, which grows without limit.`, 0,
    R`<p>For $(1+t,t)$: $x-y=1\le1$, so it is feasible, and $Z=2(1+t)-t=2+t\to\infty$. So there is no maximum (A is true), and R is exactly the reason.</p>`, 'Find a feasible ray along which $Z$ increases.'),
  S(5, 'multiple optimal solutions', R`If a bounded LPP has two optimal corner points, it has infinitely many optimal points.`, R`An LPP whose feasible region is unbounded never has an optimal solution.`, 1,
    R`<p>I is true: the segment between the two corners is optimal. II is false: for instance, minimising $x+y$ over $x+y\ge4$ has the minimum $4$.</p>`, 'Positive costs keep the minimum.'),
  MT(5, 'multiple optimal solutions', 'mx6', R`Match List I with List II.`, 'A-q, B-s, C-p, D-r', ['A-q, B-s, C-r, D-p', 'A-s, B-q, C-p, D-r', 'A-q, B-p, C-s, D-r'],
    R`<p>Corners $(0,0),(5,0),(4,3),(0,5)$. A: $0,25,23,5$, so $(5,0)$ only (q). B: $0,10,17,15$, so $(4,3)$ only (s). C: $0,5,16,20$, so $(0,5)$ only (p). D: $0,15,15,5$, so both $(5,0)$ and $(4,3)$ (r).</p>`, 'Look for ties.'),
  MT(5, 'polygon area', 'mx7', R`Match List I with List II.`, 'A-s, B-q, C-r, D-p', ['A-s, B-q, C-p, D-r', 'A-q, B-s, C-r, D-p', 'A-s, B-r, C-q, D-p'],
    R`<p>A: triangle with legs $6$: $18$ (s). B: rectangle $4\times3=12$ (q). C: the region has corners $(0,0)$, $(4,0)$, $(4,2)$, $(0,6)$, area $\dfrac12(6+2)\times4=16$ (r). D: the $3\times3$ square minus the corner triangle with legs $2$: $9-2=7$ (p).</p>`, 'The area of a trapezoid is the mean of the parallel sides times the width.'),
  MT(5, 'corner point method', 'mx8', R`Match List I with List II.`, 'A-q, B-r, C-p, D-s', ['A-q, B-r, C-s, D-p', 'A-r, B-q, C-p, D-s', 'A-q, B-p, C-r, D-s'],
    R`<p>A: corners $(0,0),(5,0),(4,2),(0,4)$, $Z=0,15,20,16$, so $20$ (q). B: corners $(0,0),(4,0),(4,2),(0,6)$, $Z=0,8,18,30$, so $30$ (r). C: corners $(2,3),(3,2),(9,0),(0,9)$, $Z=13,12,18,27$, so $12$ (p). D: corners $(0,0),(8,0),(7,3),(3,7),(0,8)$, $Z=0,40,53,57,48$, so $57$ (s).</p>`, 'Make a table of corner values for each problem.'),
  PI(5, 'multiple optimal solutions', 'pz5', R`The profit on cakes becomes $p$ rupees, so $Z=px+20y$. Find the greatest value of $p$ for which the maximum is still attained at $(4,4)$.`, 40,
    R`<p>$(4,4)$ must be at least as good as its neighbours. Against $(6,0)$: $4p+80\ge6p$, so $p\le40$. Against $(0,6)$: $4p+80\ge120$, so $p\ge10$. The greatest value is $40$ (a tie with $(6,0)$).</p>`, 'The comparison with $(6,0)$ gives the upper limit.', { calc: () => { let best = 0; for (let p = 0; p <= 100; p += 0.5) { const T = lpTable(RBK, p, 20), m = Math.max(...T.map((r) => r[2])); if (Math.abs(4 * p + 80 - m) < 1e-9) best = p; } return best; } }),
);
NI.forEach((it, i) => { it.id = `lp-x${String(i + 1).padStart(3, '0')}`; });
items.push(...NI);

// ----- new templates -----
const cornerList = (cons) => cornersOf(cons).map((u) => `$${ptx(u)}$`).join(', ');
gens.push(
  // g19: how many corner points
  gen('lp-g19', 3, 'nat', 'integer', 'feasible region', retry((rng) => {
    const r = rLE2(rng), A = int(rng, 2, 7), B = int(rng, 2, 7), v = int(rng, 0, 1);
    const cons = [...r.cons, v === 0 ? LE(1, 0, A) : LE(0, 1, B)];
    const n = cornersOf(cons).length;
    return { cons, answer: n, tol: 0, q: `How many corner points does the region ${consTx(cons)}, $x\\ge0$, $y\\ge0$ have?`, sol: `<p>Draw the lines and find where the boundary lines meet inside the region. The corner points are ${cornerList(cons)}. That is ${n}.</p>` };
  }), (p) => realV(p.cons).length),

  // g20: area of the feasible region
  gen('lp-g20', 4, 'nat', 'numeric', 'polygon area', (rng) => {
    const { cons } = rLE2(rng), P = cornersOf(cons), a = polyArea(P);
    return { cons, answer: r2(a), tol: 0.01, q: `Find the area of the feasible region ${consTx(cons)}, $x\\ge0$, $y\\ge0$.${N2}`, sol: `<p>The corner points in order are ${P.map((u) => `$${ptx(u)}$`).join(', ')}. The shoelace formula gives $\\dfrac12\\left|\\sum(x_iy_{i+1}-x_{i+1}y_i)\\right|=${t2(a)}$.</p>` };
  }, (p) => polyArea(realV(p.cons))),

  // g21: words to an inequality
  gen('lp-g21', 3, 'mcq', 'single', 'formulation', retry((rng) => {
    const a = int(rng, 2, 6), b = int(rng, 2, 6), H = int(rng, 4, 12) * 10, kind = int(rng, 0, 1);
    if (a === b) return null;
    const word = kind === 0 ? ['at most', '\\le'] : ['at least', '\\ge'];
    const eq = (aa, bb, s) => `$${aa}x+${bb}y${s}${H}$`;
    const cand = [[a, b, word[1]], [b, a, word[1]], [a, b, kind === 0 ? '\\ge' : '\\le'], [a, b, '=']];
    const map = {}; const txt = cand.map(([aa, bb, s]) => { const t = eq(aa, bb, s); map[t] = [aa, bb, s]; return t; });
    const o = shuffleOpts(rng, txt[0], txt.slice(1));
    return { a, b, H, kind, map, ...o, q: `A machine runs ${a} hours for each unit of X ($x$ units) and ${b} hours for each unit of Y ($y$ units). It can run ${word[0]} ${H} hours. The constraint is`,
      sol: `<p>Hours used: $${a}x+${b}y$. "${word[0][0].toUpperCase() + word[0].slice(1)}" gives $${word[1]}$: $${a}x+${b}y${word[1]}${H}$.</p>` };
  }), (p) => p.options.findIndex((o) => { const [aa, bb, s] = p.map[o]; return aa === p.a && bb === p.b && s === (p.kind === 0 ? '\\le' : '\\ge'); })),

  // g22: integer solutions
  gen('lp-g22', 4, 'nat', 'integer', 'integer solutions', (rng) => {
    const { cons } = rLE2(rng), c = int(rng, 1, 6), d = int(rng, 1, 6);
    const lp = lpMax(cons, c, d);
    let best = -1, bx = 0, by = 0;
    for (let x = 0; x <= 40; x++) for (let y = 0; y <= 40; y++) if (cons.every((k) => holds(k, x, y)) && c * x + d * y > best) { best = c * x + d * y; bx = x; by = y; }
    return { cons, c, d, answer: best, tol: 0, q: `Maximise $${objTx(c, d)}$ subject to ${consTx(cons)}, $x\\ge0$, $y\\ge0$, where $x$ and $y$ must be integers. Find the maximum value.`,
      sol: `<p>Without the integer condition the best corner gives $Z=${t2(lp)}$. For integers the value is at most $${Math.floor(lp + 1e-9)}$; checking the lattice points near the corner, the best one is $(${bx},${by})$ with $Z=${best}$.</p>` };
  }, (p) => { let b = -1; for (let y = 0; y <= 40; y++) for (let x = 0; x <= 40; x++) if (p.cons.every((k) => holds(k, x, y))) b = Math.max(b, p.c * x + p.d * y); return b; }),

  // g23: lattice points on the optimal edge
  gen('lp-g23', 4, 'nat', 'integer', 'multiple optimal solutions', (rng) => {
    const u = int(rng, 4, 9), v = int(rng, 4, 9), s = int(rng, Math.max(u, v) + 1, u + v - 1);
    const answer = u + v - s + 1;
    return { u, v, s, answer, tol: 0, q: `Maximise $Z=x+y$ subject to $x+y\\le${s}$, $x\\le${u}$, $y\\le${v}$, $x\\ge0$, $y\\ge0$. How many points with integer coordinates give the maximum?`,
      sol: `<p>The maximum is $${s}$, attained all along the edge $x+y=${s}$ from $(${u},${s - u})$ to $(${s - v},${v})$. The integer values of $x$ run from ${s - v} to ${u}, so there are $${u}-${s - v}+1=${answer}$ points.</p>` };
  }, (p) => { let c = 0; for (let x = 0; x <= p.u; x++) for (let y = 0; y <= p.v; y++) if (x + y === p.s) c++; return c; }),

  // g24: which point is feasible
  gen('lp-g24', 2, 'mcq', 'single', 'feasible region', retry((rng) => {
    const { cons } = rLE2(rng), pts = [], seen = new Set();
    for (let t = 0; t < 40 && pts.length < 12; t++) { const x = int(rng, 0, 8), y = int(rng, 0, 8), key = x + ',' + y; if (!seen.has(key)) { seen.add(key); pts.push([x, y]); } }
    const ok = pts.filter(([x, y]) => cons.every((k) => holds(k, x, y))), bad = pts.filter(([x, y]) => !cons.every((k) => holds(k, x, y)));
    if (ok.length < 1 || bad.length < 3) return null;
    const right = ok[0], wrongs = bad.slice(0, 3);
    const o = shuffleOpts(rng, pt(...right), wrongs.map((w) => pt(...w)));
    return { cons, ...o, q: `Which point is in the feasible region ${consTx(cons)}, $x\\ge0$, $y\\ge0$?`,
      sol: `<p>Test each point in every inequality. $${ptx(right)}$ satisfies both. ${wrongs.map((w) => `$${ptx(w)}$ fails ${cons.find((k) => !holds(k, ...w)) ? '$' + ctx(cons.find((k) => !holds(k, ...w))) + '$' : ''}`).join('; ')}.</p>` };
  }), (p) => p.options.findIndex((o) => { const m = o.match(/\((-?\d+),\\,(-?\d+)\)/); return p.cons.every((k) => holds(k, +m[1], +m[2])); })),

  // g25: maximum of x^2+y^2
  gen('lp-g25', 5, 'nat', 'integer', 'corner point method', (rng) => {
    const A = int(rng, 3, 9), B = int(rng, 3, 9), C = int(rng, Math.max(A, B) + 1, A + B - 1);
    const cons = [LE(1, 0, A), LE(0, 1, B), LE(1, 1, C)], P = cornersOf(cons), vals = P.map(([x, y]) => x * x + y * y), answer = Math.max(...vals);
    return { A, B, C, cons, answer, tol: 0, q: `Find the maximum value of $x^2+y^2$ over the region $x\\le${A}$, $y\\le${B}$, $x+y\\le${C}$, $x\\ge0$, $y\\ge0$.`,
      sol: `<p>$x^2+y^2$ is convex, so its maximum is at a corner point. The corners are ${P.map((u) => `$${ptx(u)}$`).join(', ')} with values ${vals.join(', ')}. The maximum is ${answer}.</p>` };
  }, (p) => Math.max(...clipPoly(p.cons).filter(([x, y]) => x < 9999 && y < 9999).map(([x, y]) => x * x + y * y))),

  // g26: kind of region
  gen('lp-g26', 4, 'mcq', 'single', 'bounded and unbounded', (rng) => {
    const v = int(rng, 0, 2);
    let cons, right;
    if (v === 0) { cons = rLE2(rng).cons; right = 'a bounded region'; }
    else if (v === 1) { cons = rGE2(rng).cons; right = 'an unbounded region'; }
    else { const s = int(rng, 2, 6); cons = [LE(1, 1, s), GE(1, 1, s + int(rng, 1, 4))]; right = 'an empty region'; }
    const all = ['a bounded region', 'an unbounded region', 'an empty region', 'a single point'];
    const o = shuffleOpts(rng, right, all.filter((s) => s !== right));
    const why = v === 0 ? 'Both lines are "at most" limits, so the region is a polygon touching the axes: bounded.' : v === 1 ? 'Both are "at least" limits, so the region extends without limit away from the origin: unbounded.' : 'The sum $x+y$ cannot be both at most one number and at least a larger one: empty.';
    return { v, cons, ...o, q: `The constraints ${consTx(cons)}, $x\\ge0$, $y\\ge0$ define`, sol: `<p>${why}</p>` };
  }, (p) => { const P = clipPoly(p.cons); const kind = P.length === 0 ? 'an empty region' : P.every(([x, y]) => x < 9999 && y < 9999) ? 'a bounded region' : 'an unbounded region'; return p.options.indexOf(kind); }),

  // g27: minimum cost (diet)
  gen('lp-g27', 4, 'nat', 'integer', 'corner point method', retry((rng) => {
    const { cons } = rGE2(rng), c = int(rng, 1, 9), d = int(rng, 1, 9), v = lpMin(cons, c, d);
    if (Math.abs(v - Math.round(v)) > 1e-9) return null;
    const [k1, k2] = cons;
    return { cons, c, d, answer: Math.round(v), tol: 0, q: `A diet uses $x$ units of food P and $y$ units of food Q at ${c} and ${d} rupees per unit. It needs $${lt(k1.a, k1.b)}\\ge${k1.c}$ and $${lt(k2.a, k2.b)}\\ge${k2.c}$ (nutrients), with $x\\ge0$, $y\\ge0$. Find the least cost in rupees.`,
      sol: `<p>The region is unbounded, but the cost has positive coefficients, so the minimum is at a corner point: ${tabTx(cons, c, d)}. The least cost is ${Math.round(v)} rupees.</p>` };
  }), (p) => polyOpt(p.cons, p.c, p.d, 'min')),

  // g28: shortest distance from the origin
  gen('lp-g28', 4, 'nat', 'numeric', 'distance from the origin', (rng) => {
    const [a, b, h] = choose(rng, [[3, 4, 5], [5, 12, 13], [6, 8, 10], [4, 3, 5], [8, 15, 17], [12, 5, 13]]), c = int(rng, 2, 12) * 2;
    const answer = r2(c / h);
    return { a, b, c, answer, tol: 0.01, q: `Find the shortest distance from the origin to the region $${a}x+${b}y\\ge${c}$, $x\\ge0$, $y\\ge0$.${N2}`,
      sol: `<p>The nearest point is the foot of the perpendicular on the line $${a}x+${b}y=${c}$ (it lies in the first quadrant). Distance $=\\dfrac{${c}}{\\sqrt{${a}^2+${b}^2}}=\\dfrac{${c}}{${h}}=${answer}$.</p>` };
  }, (p) => { let m = Infinity; for (let i = 0; i <= 20000; i++) { const x = (p.c / p.a) * (i / 20000), y = (p.c - p.a * x) / p.b; m = Math.min(m, Math.hypot(x, y)); } return m; }),

  // g29: redundant constraints
  gen('lp-g29', 5, 'nat', 'integer', 'bounded and unbounded', retry((rng) => {
    const x0 = int(rng, 2, 6), y0 = int(rng, 2, 6), a1 = int(rng, 1, 4), b1 = int(rng, 1, 4), a2 = int(rng, 1, 4), b2 = int(rng, 1, 4);
    if (a1 * b2 === a2 * b1) return null;
    const c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0, cons = [LE(a1, b1, c1), LE(a2, b2, c2), LE(a1 + a2, b1 + b2, c1 + c2)];
    const A0 = polyArea(realV(cons)), red = cons.filter((_, i) => Math.abs(polyArea(realV(cons.filter((__, j) => j !== i))) - A0) < 1e-7).length;
    return { cons, x0, y0, answer: red, tol: 0, q: `How many of the three constraints ${consTx(cons)} (with $x\\ge0$, $y\\ge0$) are redundant, meaning that removing it leaves the feasible region unchanged?`,
      sol: `<p>The first two lines meet at $(${x0},${y0})$. The third line also passes through $(${x0},${y0})$, and its coefficients are the sums of the first two, so it only touches the region there. Checking each constraint by removing it: ${red} of them leave the region unchanged.</p>` };
  }), (p) => { let r = 0; for (let i = 0; i < 3; i++) { const rest = p.cons.filter((_, j) => j !== i); const V = realV(rest); const full = realV(p.cons); const sameCorners = V.length === full.length && V.every(([x, y]) => full.some(([u, v]) => abs(u - x) < 1e-7 && abs(v - y) < 1e-7)); if (sameCorners) r++; } return r; }),
);

// ===== expansion end =====

// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({ topic: 'linear-programming', groups, items, gens }, ['lp-g07', 'lp-g09', 'lp-g12']);
