// Linear and integer programming for the LP solver tool: a small text model language, a two-phase simplex
// method on a dense tableau (Dantzig's rule, switching to Bland's rule if it stalls, or Bland's rule throughout),
// branch and bound for integer variables, sensitivity (shadow prices, reduced costs) for linear programs, and
// the feasible region of a two-variable model for drawing. Plain TypeScript, no DOM.

export type Op = '<=' | '>=' | '=';
export interface Constraint { name: string; a: number[]; op: Op; rhs: number; line: number }
export interface Model {
  sense: 'max' | 'min'; objName: string; c: number[]; c0: number; vars: string[];
  rows: Constraint[]; lo: number[]; hi: number[]; isInt: boolean[]; notes: string[];
}
export const LIMITS = { vars: 300, rows: 300, chars: 200_000 };

const NUM = /^(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/;
const NAME = /^[A-Za-z_][A-Za-z0-9_]*/;
const OPS = /<=|>=|=<|=>|==|≤|≥|<|>|=/g;
const normOp = (o: string): Op => (o === '<=' || o === '=<' || o === '≤' || o === '<' ? '<=' : o === '>=' || o === '=>' || o === '≥' || o === '>' ? '>=' : '=');
const SECTION: [RegExp, string][] = [
  [/^(subject\s+to|such\s+that|s\.?\s?t\.?|constraints?)\s*:?\s*$/i, 'st'],
  [/^bounds?\s*:?\s*$/i, 'bounds'],
  [/^(int|ints|integer|integers|general|generals|gen)\b\s*:?/i, 'int'],
  [/^(bin|binary|binaries)\b\s*:?/i, 'bin'],
  [/^free\b\s*:?/i, 'free'],
  [/^end\s*$/i, 'end'],
];
const RESERVED = new Set(['max', 'min', 'maximize', 'maximise', 'minimize', 'minimise', 'subject', 'to', 'st', 'bounds', 'int', 'integer', 'bin', 'binary', 'free', 'end', 'inf', 'infinity']);

type Lin = { t: Map<string, number>; k: number };
function parseLin(s: string, ln: number): Lin {
  const t = new Map<string, number>(); let k = 0, i = 0, first = true;
  const ws = () => { while (i < s.length && /\s/.test(s[i])) i++; };
  const err = (m: string) => new Error(`Line ${ln}: ${m}`);
  for (;;) {
    ws(); if (i >= s.length) break;
    let sign = 1, signed = false;
    while (i < s.length && /[+\-−]/.test(s[i])) { if (s[i] !== '+') sign = -sign; signed = true; i++; ws(); }
    if (!first && !signed) throw err(`put + or − between terms, before "${s.slice(i, i + 12)}".`);
    if (i >= s.length) throw err('the expression ends with a sign.');
    let coef: number | null = null;
    const nm = NUM.exec(s.slice(i));
    if (nm) {
      coef = Number(nm[0]); i += nm[0].length; ws();
      if (s[i] === '/') { i++; ws(); const d = NUM.exec(s.slice(i)); if (!d) throw err('a fraction needs a number after the /.'); coef /= Number(d[0]); i += d[0].length; ws(); if (!Number.isFinite(coef)) throw err('division by zero.'); }
      if (s[i] === '*') { i++; ws(); }
    }
    const vm = NAME.exec(s.slice(i));
    if (vm) {
      const name = vm[0]; i += name.length;
      if (RESERVED.has(name.toLowerCase())) throw err(`"${name}" is a keyword, not a variable name.`);
      ws(); if (s[i] === '*') { i++; ws(); const n2 = NUM.exec(s.slice(i)); if (!n2) throw err(`expected a number after "${name} *".`); coef = (coef ?? 1) * Number(n2[0]); i += n2[0].length; }
      t.set(name, (t.get(name) ?? 0) + sign * (coef ?? 1));
    } else if (coef !== null) k += sign * coef;
    else throw err(`expected a number or a variable name at "${s.slice(i, i + 12)}".`);
    first = false;
  }
  return { t, k };
}

/** Read a model written as text. Throws an Error with a plain message naming the line. */
export function parseModel(text: string): Model {
  if (text.length > LIMITS.chars) throw new Error(`The model is too long (over ${LIMITS.chars.toLocaleString('en')} characters).`);
  const vars: string[] = [], idx = new Map<string, number>();
  const v = (n: string) => { let j = idx.get(n); if (j === undefined) { j = vars.length; idx.set(n, j); vars.push(n); } return j; };
  let sense: 'max' | 'min' | null = null, objName = 'objective', obj: Lin = { t: new Map(), k: 0 };
  const rows: { name: string; t: Map<string, number>; op: Op; rhs: number; line: number }[] = [];
  const bounds: { n: string; lo?: number; hi?: number; line: number }[] = [];
  const ints = new Set<string>(), bins = new Set<string>(), frees = new Set<string>(), names = new Set<string>();
  const notes: string[] = [];
  let sec = 'st';
  const lines = text.split(/\r?\n/);
  for (let li = 0; li < lines.length; li++) {
    const ln = li + 1;
    let s = lines[li].replace(/(#|\/\/|\\).*$/, '').trim();
    if (!s) continue;
    if (sec === 'end') break;
    const om = /^(max(?:imi[sz]e)?|min(?:imi[sz]e)?)\b\s*:?\s*(.*)$/i.exec(s);
    if (om) {
      if (sense) throw new Error(`Line ${ln}: the model has a second objective; give only one.`);
      sense = om[1].toLowerCase().startsWith('max') ? 'max' : 'min';
      let rest = om[2];
      const nm = /^([A-Za-z_][A-Za-z0-9_]*)\s*(:|=(?!=))/.exec(rest);
      if (nm) { objName = nm[1]; rest = rest.slice(nm[0].length); }
      obj = parseLin(rest, ln); for (const n of obj.t.keys()) v(n);
      sec = 'st'; continue;
    }
    let matched = false;
    for (const [re, name] of SECTION) {
      const m = re.exec(s);
      if (m) { sec = name; s = s.slice(m[0].length).trim(); matched = true; break; }
    }
    if (matched && !s) continue;
    if (sec === 'int' || sec === 'bin' || sec === 'free') {
      for (const n of s.split(/[\s,;]+/).filter(Boolean)) {
        if (!NAME.test(n) || NAME.exec(n)![0] !== n) throw new Error(`Line ${ln}: "${n}" is not a variable name. Lines after "int", "bin" or "free" list variable names; write "subject to" before more constraints.`);
        v(n); (sec === 'int' ? ints : sec === 'bin' ? bins : frees).add(n);
      }
      continue;
    }
    // A constraint or bound, optionally named "name: ...".
    let rname = '';
    const nm = /^([A-Za-z_][A-Za-z0-9_]*)\s*:(?!=)/.exec(s);
    if (nm) { rname = nm[1]; s = s.slice(nm[0].length).trim(); }
    if (/^[A-Za-z_][A-Za-z0-9_]*\s+free$/i.test(s)) { const n = s.split(/\s+/)[0]; v(n); frees.add(n); continue; }
    const ops = s.match(OPS) ?? [];
    const parts = s.split(OPS).map((p) => p.trim());
    if (ops.length === 0) {
      if (sense === null && rows.length === 0) throw new Error(`Line ${ln}: start with the objective, such as "maximize 3x + 2y".`);
      throw new Error(`Line ${ln}: a constraint needs <=, >= or =.`);
    }
    if (ops.length > 2) throw new Error(`Line ${ln}: too many comparison signs.`);
    if (parts.some((p) => !p)) throw new Error(`Line ${ln}: something is missing next to a comparison sign.`);
    const INF = /^([+-]?)(inf|infinity)$/i;
    const val = (p: string): Lin => { const m = INF.exec(p); return m ? { t: new Map(), k: m[1] === '-' ? -Infinity : Infinity } : parseLin(p, ln); };
    const lins = parts.map(val);
    if (sec === 'bounds') {
      // x <= 5, x >= -2, -2 <= x <= 5, x = 3, 5 >= x, 2x <= 8
      const vi = lins.findIndex((l) => l.t.size > 0);
      if (vi < 0 || lins.filter((l) => l.t.size > 0).length > 1 || lins[vi].t.size !== 1) throw new Error(`Line ${ln}: a bound has one variable and a number, such as "x <= 10".`);
      const [n, a] = [...lins[vi].t][0];
      if (a === 0) throw new Error(`Line ${ln}: the variable has a zero coefficient.`);
      v(n);
      const set = (op: Op, k: number, varLeft: boolean) => {
        // a·x (op) k when varLeft, else k (op) a·x
        let o: Op = varLeft ? op : op === '<=' ? '>=' : op === '>=' ? '<=' : '=';
        let r = (k - lins[vi].k) / a; if (a < 0) o = o === '<=' ? '>=' : o === '>=' ? '<=' : '=';
        if (!Number.isFinite(k)) r = a > 0 === k > 0 ? Infinity : -Infinity;
        if (o === '<=' || o === '=') bounds.push({ n, hi: r, line: ln });
        if (o === '>=' || o === '=') bounds.push({ n, lo: r, line: ln });
      };
      if (lins.length === 2) set(normOp(ops[0]), vi === 0 ? lins[1].k : lins[0].k, vi === 0);
      else {
        if (vi !== 1) throw new Error(`Line ${ln}: write a double bound as "low <= x <= high".`);
        set(normOp(ops[0]), lins[0].k, false); set(normOp(ops[1]), lins[2].k, true);
      }
      continue;
    }
    if (lins.some((l) => !Number.isFinite(l.k))) throw new Error(`Line ${ln}: infinity is only allowed in bounds.`);
    const add = (L: Lin, op: Op, R: Lin, suffix: string) => {
      const t = new Map<string, number>();
      for (const [n, a] of L.t) t.set(n, (t.get(n) ?? 0) + a);
      for (const [n, a] of R.t) t.set(n, (t.get(n) ?? 0) - a);
      for (const [n, a] of t) if (a === 0) t.delete(n);
      if (!t.size) throw new Error(`Line ${ln}: the constraint has no variables.`);
      for (const n of t.keys()) v(n);
      const name = (rname || `c${rows.length + 1}`) + suffix;
      if (names.has(name)) throw new Error(`Line ${ln}: the name "${name}" is used twice.`);
      names.add(name);
      rows.push({ name, t, op, rhs: R.k - L.k, line: ln });
    };
    if (lins.length === 2) add(lins[0], normOp(ops[0]), lins[1], '');
    else {
      const o1 = normOp(ops[0]), o2 = normOp(ops[1]);
      if (o1 !== o2 || o1 === '=') throw new Error(`Line ${ln}: a double constraint must read "low <= expression <= high".`);
      if (lins[0].t.size || lins[2].t.size) throw new Error(`Line ${ln}: in a double constraint, only the middle may have variables.`);
      const nameBase = rname || `c${rows.length + 1}`; rname = nameBase;
      add(lins[1], o1 === '<=' ? '>=' : '<=', lins[0], '_lo'); add(lins[1], o1, lins[2], '_hi');
    }
  }
  if (!sense) throw new Error('Start the model with the objective, such as "maximize 3x + 2y" or "minimize cost: 2a + 5b".');
  if (!vars.length) throw new Error('The model has no variables.');
  if (vars.length > LIMITS.vars) throw new Error(`The model has ${vars.length} variables; this tool takes up to ${LIMITS.vars}.`);
  if (rows.length > LIMITS.rows) throw new Error(`The model has ${rows.length} constraints; this tool takes up to ${LIMITS.rows}.`);
  const n = vars.length, lo = new Array(n).fill(0), hi = new Array(n).fill(Infinity), isInt = new Array(n).fill(false);
  for (const f of frees) lo[idx.get(f)!] = -Infinity;
  for (const b of bins) { const j = idx.get(b)!; isInt[j] = true; lo[j] = Math.max(lo[j], 0); hi[j] = Math.min(hi[j], 1); }
  for (const b of ints) isInt[idx.get(b)!] = true;
  // Explicit bounds replace the default lower bound of 0 (a stated lower bound wins over "free").
  const seenLo = new Set<number>();
  for (const b of bounds) {
    const j = idx.get(b.n)!;
    if (b.lo !== undefined) { lo[j] = seenLo.has(j) ? Math.max(lo[j], b.lo) : bins.has(b.n) ? Math.max(0, b.lo) : b.lo; seenLo.add(j); }
    if (b.hi !== undefined) hi[j] = Math.min(hi[j], b.hi);
  }
  for (let j = 0; j < n; j++) if (hi[j] < 0 && lo[j] === 0 && !seenLo.has(j)) notes.push(`${vars[j]} has an upper bound below 0 but a lower bound of 0 (the default), so the model is infeasible. Add a lower bound such as "${vars[j]} >= -100" or "${vars[j]} free".`);
  for (let j = 0; j < n; j++) if (isInt[j]) { lo[j] = Math.ceil(lo[j] - 1e-9); hi[j] = Math.floor(hi[j] + 1e-9); }
  const c = vars.map((nm) => obj.t.get(nm) ?? 0);
  return {
    sense, objName, c, c0: obj.k, vars, lo, hi, isInt, notes,
    rows: rows.map((r) => ({ name: r.name, a: vars.map((nm) => r.t.get(nm) ?? 0), op: r.op, rhs: r.rhs, line: r.line })),
  };
}

export type Status = 'optimal' | 'infeasible' | 'unbounded' | 'limit';
export interface Step { phase: 1 | 2; cols: string[]; basis: string[]; rows: number[][]; z: number[]; enter: string | null; leave: string | null }
export interface LPResult {
  status: Status; x: number[]; obj: number;
  /** Shadow price of each constraint: change in the objective per unit increase of its right-hand side. */
  shadow: number[];
  /** Reduced cost of each variable: change in the objective per unit increase of the variable from its bound. */
  rc: number[];
  activity: number[]; pivots: number; phase1Pivots: number; steps: Step[]; usedBland: boolean;
}
export interface LPOptions { lo?: number[]; hi?: number[]; rule?: 'dantzig' | 'bland'; record?: boolean; maxPivots?: number }

const EPS = 1e-9;

/** Solve the linear programming relaxation (integer marks ignored) by the two-phase simplex method. */
export function solveLP(m: Model, o: LPOptions = {}): LPResult {
  const lo = o.lo ?? m.lo, hi = o.hi ?? m.hi, n = m.vars.length, maxPiv = o.maxPivots ?? 50_000;
  const empty = (status: Status): LPResult => ({ status, x: [], obj: NaN, shadow: [], rc: [], activity: [], pivots: 0, phase1Pivots: 0, steps: [], usedBland: false });
  for (let j = 0; j < n; j++) if (lo[j] > hi[j] + 1e-9 || lo[j] === Infinity || hi[j] === -Infinity) return empty('infeasible');
  const cmin = m.c.map((c) => (m.sense === 'max' ? -c : c));
  // Structural columns: x_j = off_j + sum(sign * column).
  const cols: { v: number; s: number; name: string }[] = [], off = new Array(n).fill(0), ub: { col: number; u: number; name: string }[] = [];
  for (let j = 0; j < n; j++) {
    const nm = m.vars[j];
    if (Number.isFinite(lo[j])) {
      off[j] = lo[j]; cols.push({ v: j, s: 1, name: lo[j] === 0 ? nm : nm + '′' });
      if (Number.isFinite(hi[j])) ub.push({ col: cols.length - 1, u: hi[j] - lo[j], name: `${nm} upper` });
    } else if (Number.isFinite(hi[j])) { off[j] = hi[j]; cols.push({ v: j, s: -1, name: nm + '″' }); }
    else { cols.push({ v: j, s: 1, name: nm + '⁺' }); cols.push({ v: j, s: -1, name: nm + '⁻' }); }
  }
  const nS = cols.length;
  type R = { a: number[]; op: Op; b: number; name: string };
  const R: R[] = m.rows.map((r) => ({ a: cols.map((cl) => r.a[cl.v] * cl.s), op: r.op, b: r.rhs - r.a.reduce((s, a, j) => s + (a ? a * off[j] : 0), 0), name: r.name }));
  for (const u of ub) { const a = new Array(nS).fill(0); a[u.col] = 1; R.push({ a, op: '<=', b: u.u, name: u.name }); }
  const M = R.length;
  const slackOf = new Array(M).fill(-1), colNames = cols.map((c) => c.name);
  let N = nS;
  for (let i = 0; i < M; i++) if (R[i].op !== '=') { slackOf[i] = N++; colNames.push('s_' + R[i].name); }
  const c = new Array(N).fill(0);
  for (let k = 0; k < nS; k++) c[k] = cmin[cols[k].v] * cols[k].s;
  // Tableau with rows flipped so that b >= 0; artificial columns where no slack can start the basis.
  const flip = R.map((r) => (r.b < 0 ? -1 : 1));
  const init = new Array(M).fill(-1);
  let nArt = 0;
  for (let i = 0; i < M; i++) {
    const sc = slackOf[i] >= 0 ? (R[i].op === '<=' ? 1 : -1) * flip[i] : 0;
    if (sc === 1) init[i] = slackOf[i]; else init[i] = N + nArt++;
  }
  const W = N + nArt + 1, rhs = W - 1;
  const T: Float64Array[] = [];
  for (let i = 0; i < M; i++) {
    const row = new Float64Array(W), f = flip[i];
    for (let k = 0; k < nS; k++) row[k] = R[i].a[k] * f;
    if (slackOf[i] >= 0) row[slackOf[i]] = (R[i].op === '<=' ? 1 : -1) * f;
    if (init[i] >= N) row[init[i]] = 1;
    row[rhs] = R[i].b * f; T.push(row);
  }
  for (let a = 0; a < nArt; a++) colNames.push('a' + (a + 1));
  const basis = init.slice();
  let z = new Float64Array(W);
  let pivots = 0, usedBland = o.rule === 'bland', degen = 0;
  const steps: Step[] = [];
  const snap = (phase: 1 | 2, enter: number, leave: number) => {
    if (!o.record || steps.length >= 40) return;
    const show = (j: number) => phase === 1 || j < N;
    const idxs = [...Array(W - 1).keys()].filter(show);
    steps.push({ phase, cols: idxs.map((j) => colNames[j]), basis: basis.map((b) => colNames[b]), rows: T.map((r) => [...idxs.map((j) => r[j]), r[rhs]]), z: [...idxs.map((j) => z[j]), z[rhs]], enter: enter >= 0 ? colNames[enter] : null, leave: leave >= 0 ? colNames[basis[leave]] : null });
  };
  const pivot = (r: number, e: number) => {
    const pr = T[r], p = pr[e];
    for (let j = 0; j < W; j++) pr[j] /= p;
    pr[e] = 1;
    for (let i = 0; i < M; i++) if (i !== r) { const f = T[i][e]; if (f !== 0) { const ri = T[i]; for (let j = 0; j < W; j++) ri[j] -= f * pr[j]; ri[e] = 0; } }
    const f = z[e]; if (f !== 0) { for (let j = 0; j < W; j++) z[j] -= f * pr[j]; z[e] = 0; }
    basis[r] = e; pivots++;
  };
  const iterate = (phase: 1 | 2, allowed: number): Status | 'ok' => {
    for (;;) {
      let e = -1;
      if (usedBland) { for (let j = 0; j < allowed; j++) if (z[j] < -EPS) { e = j; break; } }
      else { let best = -EPS; for (let j = 0; j < allowed; j++) if (z[j] < best) { best = z[j]; e = j; } }
      if (e < 0) { snap(phase, -1, -1); return 'ok'; }
      let r = -1, best = Infinity;
      for (let i = 0; i < M; i++) {
        const a = T[i][e];
        if (a > EPS) {
          const t = T[i][rhs] / a;
          if (t < best - 1e-12 || (Math.abs(t - best) <= 1e-12 && r >= 0 && basis[i] < basis[r])) { best = t; r = i; }
        }
      }
      if (r < 0) { snap(phase, e, -1); return 'unbounded'; }
      snap(phase, e, r);
      if (best <= 1e-12) { if (++degen > 50 && !usedBland) usedBland = true; } else degen = 0;
      if (pivots >= maxPiv) return 'limit';
      pivot(r, e);
    }
  };
  // Phase 1: minimise the sum of the artificial variables.
  let p1 = 0;
  if (nArt) {
    z = new Float64Array(W);
    for (let j = N; j < N + nArt; j++) z[j] = 1;
    for (let i = 0; i < M; i++) if (basis[i] >= N) for (let j = 0; j < W; j++) z[j] -= T[i][j];
    const st = iterate(1, N + nArt);
    if (st === 'limit') return { ...empty('limit'), pivots };
    p1 = pivots;
    const bmax = Math.max(1, ...R.map((r) => Math.abs(r.b)));
    if (-z[rhs] > 1e-7 * bmax) return { ...empty('infeasible'), pivots, phase1Pivots: p1, steps };
    // Drive artificial variables still in the basis (at zero) out where possible; rows where that fails are redundant.
    for (let i = 0; i < M; i++) if (basis[i] >= N) {
      let e = -1, big = EPS;
      for (let j = 0; j < N; j++) if (Math.abs(T[i][j]) > big) { big = Math.abs(T[i][j]); e = j; }
      if (e >= 0) pivot(i, e);
    }
  }
  // Phase 2: the real objective, keeping the reduced costs of artificial columns for the dual values.
  z = new Float64Array(W);
  for (let j = 0; j < N; j++) z[j] = c[j];
  for (let i = 0; i < M; i++) { const cb = basis[i] < N ? c[basis[i]] : 0; if (cb !== 0) for (let j = 0; j < W; j++) z[j] -= cb * T[i][j]; }
  const st = iterate(2, N);
  if (st !== 'ok') return { ...empty(st), pivots, phase1Pivots: p1, steps, usedBland };
  const val = new Array(N).fill(0);
  for (let i = 0; i < M; i++) if (basis[i] < N) val[basis[i]] = Math.max(0, T[i][rhs]);
  const x = off.slice();
  for (let k = 0; k < nS; k++) x[cols[k].v] += cols[k].s * val[k];
  for (let j = 0; j < n; j++) if (Math.abs(x[j]) < 1e-11) x[j] = 0;
  // Duals: y'_i = c(init_i) - z(init_i) = -z(init_i) (cost 0 for slacks and artificials), y_i = flip_i * y'_i.
  const y = R.map((_, i) => flip[i] * -z[init[i]]);
  const sgn = m.sense === 'max' ? -1 : 1;
  const nu = m.rows.length;
  const shadow = y.slice(0, nu).map((v) => clean(sgn * v));
  const rc = m.c.map((cj, j) => { let d = cmin[j]; for (let i = 0; i < nu; i++) d -= y[i] * m.rows[i].a[j]; return clean(sgn * d); });
  const activity = m.rows.map((r) => r.a.reduce((s, a, j) => s + a * x[j], 0));
  const obj = m.c.reduce((s, cj, j) => s + cj * x[j], m.c0);
  return { status: 'optimal', x, obj, shadow, rc, activity, pivots, phase1Pivots: p1, steps, usedBland };
}
const clean = (v: number) => (Math.abs(v) < 1e-10 ? 0 : v);

export interface MILPResult extends LPResult { nodes: number; rootBound: number; gap: number; integer: boolean }

/** Solve with integer variables by branch and bound (depth first, most fractional variable). */
export function solve(m: Model, o: LPOptions & { maxNodes?: number } = {}): MILPResult {
  const root = solveLP(m, o);
  if (!m.isInt.some(Boolean)) return { ...root, nodes: 1, rootBound: root.obj, gap: 0, integer: false };
  const maxNodes = o.maxNodes ?? 20_000, sg = m.sense === 'max' ? 1 : -1;
  let nodes = 0, best: LPResult | null = null, bestVal = -Infinity, pivots = 0, limit = false;
  const better = (v: number) => sg * v > bestVal + 1e-9 * (1 + Math.abs(bestVal));
  const stack: { lo: number[]; hi: number[] }[] = [{ lo: m.lo.slice(), hi: m.hi.slice() }];
  let stop: Status | null = null;
  while (stack.length) {
    if (nodes >= maxNodes) { limit = true; break; }
    const nd = stack.pop()!;
    const r = solveLP(m, { ...o, lo: nd.lo, hi: nd.hi, record: false });
    nodes++; pivots += r.pivots;
    if (r.status === 'unbounded' || r.status === 'limit') { stop = r.status; break; }
    if (r.status === 'infeasible') continue;
    if (best && !better(r.obj)) continue;
    let j = -1, frac = 1e-6;
    for (let k = 0; k < m.vars.length; k++) if (m.isInt[k]) { const f = Math.abs(r.x[k] - Math.round(r.x[k])); if (f > frac) { frac = f; j = k; } }
    if (j < 0) {
      const x = r.x.map((v, k) => (m.isInt[k] ? Math.round(v) : v));
      best = { ...r, x, obj: m.c.reduce((s, cj, k) => s + cj * x[k], m.c0), activity: m.rows.map((row) => row.a.reduce((s, a, k) => s + a * x[k], 0)) };
      bestVal = sg * best.obj; continue;
    }
    const f = Math.floor(r.x[j]), down = { lo: nd.lo.slice(), hi: nd.hi.slice() }, up = { lo: nd.lo.slice(), hi: nd.hi.slice() };
    down.hi[j] = f; up.lo[j] = f + 1;
    // Explore the nearer side first (pushed last).
    if (r.x[j] - f > 0.5) stack.push(down, up); else stack.push(up, down);
  }
  const base = { ...root, shadow: [], rc: [], steps: [], x: [] as number[], obj: NaN, nodes, rootBound: root.obj, gap: NaN, integer: true, pivots };
  if (stop) return { ...base, status: stop };
  if (!best) return { ...base, status: limit ? 'limit' : 'infeasible' };
  const gap = limit ? Math.abs(root.obj - best.obj) / Math.max(1e-9, Math.abs(best.obj)) : 0;
  return { ...best, status: limit ? 'limit' : 'optimal', shadow: [], rc: [], nodes, rootBound: root.obj, gap, integer: true, pivots, steps: [] };
}

/** Clip the plane to the feasible region of a two-variable model, within a box. Returns the polygon's corners. */
export function region2d(m: Model, box: [number, number, number, number], lo = m.lo, hi = m.hi): [number, number][] {
  let P: [number, number][] = [[box[0], box[2]], [box[1], box[2]], [box[1], box[3]], [box[0], box[3]]];
  const half: [number, number, number][] = []; // a·x <= b
  for (const r of m.rows) {
    if (r.op !== '>=') half.push([r.a[0], r.a[1], r.rhs]);
    if (r.op !== '<=') half.push([-r.a[0], -r.a[1], -r.rhs]);
  }
  for (let j = 0; j < 2; j++) {
    const e = j === 0 ? [1, 0] : [0, 1];
    if (Number.isFinite(lo[j])) half.push([-e[0], -e[1], -lo[j]]);
    if (Number.isFinite(hi[j])) half.push([e[0], e[1], hi[j]]);
  }
  for (const [a, b, c] of half) {
    const out: [number, number][] = [], tol = 1e-9 * (1 + Math.abs(c));
    for (let i = 0; i < P.length; i++) {
      const p = P[i], q = P[(i + 1) % P.length];
      const fp = a * p[0] + b * p[1] - c, fq = a * q[0] + b * q[1] - c;
      if (fp <= tol) out.push(p);
      if ((fp <= tol) !== (fq <= tol)) { const t = fp / (fp - fq); out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); }
    }
    P = out; if (!P.length) break;
  }
  return P;
}

/** Corner points of a two-variable model (intersections of constraint and bound lines that are feasible). */
export function corners2d(m: Model, lo = m.lo, hi = m.hi): [number, number][] {
  const L: [number, number, number][] = m.rows.map((r) => [r.a[0], r.a[1], r.rhs]);
  for (let j = 0; j < 2; j++) { const e: [number, number] = j === 0 ? [1, 0] : [0, 1]; if (Number.isFinite(lo[j])) L.push([...e, lo[j]]); if (Number.isFinite(hi[j])) L.push([...e, hi[j]]); }
  const out: [number, number][] = [];
  const ok = (x: number, y: number) => x >= lo[0] - 1e-7 && x <= hi[0] + 1e-7 && y >= lo[1] - 1e-7 && y <= hi[1] + 1e-7 && m.rows.every((r) => { const v = r.a[0] * x + r.a[1] * y, t = 1e-7 * (1 + Math.abs(r.rhs)); return r.op === '<=' ? v <= r.rhs + t : r.op === '>=' ? v >= r.rhs - t : Math.abs(v - r.rhs) <= t; });
  for (let i = 0; i < L.length; i++) for (let k = i + 1; k < L.length; k++) {
    const [a, b, c] = L[i], [d, e, f] = L[k], det = a * e - b * d;
    if (Math.abs(det) < 1e-12) continue;
    const x = (c * e - b * f) / det, y = (a * f - c * d) / det;
    if (ok(x, y) && !out.some((p) => Math.abs(p[0] - x) < 1e-9 && Math.abs(p[1] - y) < 1e-9)) out.push([x, y]);
  }
  return out;
}

/** Write a model back as text (used for the downloads and to show how the tool read it). */
export function modelText(m: Model): string {
  const fmt = (v: number) => String(+v.toPrecision(12));
  const lin = (a: number[]) => {
    const t = a.map((v, j) => [v, m.vars[j]] as const).filter(([v]) => v !== 0);
    if (!t.length) return '0';
    return t.map(([v, nm], i) => `${v < 0 ? (i ? '- ' : '-') : i ? '+ ' : ''}${Math.abs(v) === 1 ? '' : fmt(Math.abs(v)) + ' '}${nm}`).join(' ');
  };
  const out = [`${m.sense === 'max' ? 'maximize' : 'minimize'} ${m.objName}: ${lin(m.c)}${m.c0 ? (m.c0 < 0 ? ' - ' : ' + ') + fmt(Math.abs(m.c0)) : ''}`, 'subject to'];
  for (const r of m.rows) out.push(`  ${r.name}: ${lin(r.a)} ${r.op} ${fmt(r.rhs)}`);
  const b: string[] = [];
  m.vars.forEach((nm, j) => {
    const l = m.lo[j], h = m.hi[j];
    if (l === 0 && h === Infinity) return;
    if (m.isInt[j] && l === 0 && h === 1) return;
    if (l === -Infinity && h === Infinity) b.push(`  ${nm} free`);
    else if (l === h) b.push(`  ${nm} = ${fmt(l)}`);
    else b.push(`  ${l === -Infinity ? '-inf' : fmt(l)} <= ${nm} <= ${h === Infinity ? 'inf' : fmt(h)}`);
  });
  if (b.length) out.push('bounds', ...b);
  const bins = m.vars.filter((_, j) => m.isInt[j] && m.lo[j] === 0 && m.hi[j] === 1), ints = m.vars.filter((nm, j) => m.isInt[j] && !bins.includes(nm));
  if (ints.length) out.push('int ' + ints.join(', '));
  if (bins.length) out.push('bin ' + bins.join(', '));
  return out.join('\n') + '\n';
}

export const EXAMPLES: { id: string; name: string; text: string }[] = [
  { id: 'workshop', name: 'Workshop: tables and chairs (2 variables)', text: `# A small workshop (made-up numbers): how many tables and chairs to make each week?
maximize profit: 40 tables + 30 chairs
subject to
  wood:   4 tables + 2 chairs <= 60     # board metres
  labour: 2 tables + 3 chairs <= 54     # hours
  demand: tables <= 12
` },
  { id: 'workshop-int', name: 'Same workshop, whole items only (integer)', text: `# Whole tables and chairs only (made-up numbers).
maximize profit: 40 tables + 30 chairs
subject to
  wood:   4 tables + 2 chairs <= 61
  labour: 2 tables + 3 chairs <= 53
  demand: tables <= 12
int tables, chairs
` },
  { id: 'feed', name: 'Cheapest feed mix (minimise, ≥ constraints)', text: `# Cheapest mix of three feeds that meets nutrient needs (made-up numbers, per kg).
minimize cost: 0.30 grain + 0.45 meal + 0.12 hay
subject to
  protein: 9 grain + 40 meal + 8 hay >= 150
  energy:  14 grain + 12 meal + 9 hay >= 100
  fibre:   2 grain + 6 meal + 30 hay >= 60
  total:   grain + meal + hay = 10
bounds
  meal <= 3
` },
  { id: 'projects', name: 'Pick projects within a budget (binary)', text: `# Choose projects to fund (made-up values in thousands).
maximize value: 60 a + 45 b + 38 c + 30 d + 24 e
subject to
  budget: 35 a + 28 b + 22 c + 18 d + 12 e <= 80
  staff:  4 a + 2 b + 3 c + 2 d + 1 e <= 8
  pair:   d - b <= 0      # d only if b
bin a, b, c, d, e
` },
  { id: 'transport', name: 'Shipping from 2 depots to 3 shops', text: `# Ship goods from two depots to three shops at least cost (made-up numbers).
minimize cost: 4 d1s1 + 6 d1s2 + 9 d1s3 + 5 d2s1 + 3 d2s2 + 7 d2s3
subject to
  depot1: d1s1 + d1s2 + d1s3 <= 70
  depot2: d2s1 + d2s2 + d2s3 <= 60
  shop1:  d1s1 + d2s1 = 40
  shop2:  d1s2 + d2s2 = 35
  shop3:  d1s3 + d2s3 = 45
` },
];
