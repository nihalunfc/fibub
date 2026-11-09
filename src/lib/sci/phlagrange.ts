// A small computer-algebra kernel for Lagrangian mechanics: symbolic derivatives of formulas parsed by expr.ts, a
// canonical expanded "sum of monomials" form with like terms combined (and sin² + cos² = 1), Euler-Lagrange equations,
// generalised momenta, the mass-matrix form M(q) q̈ = F(q, q̇, t), and an RK4 integrator for the equations. No DOM.
import { parse, type Node } from './expr.ts';

// ---- Canonical polynomial form ---------------------------------------------------------------------------------
/** An atom is a symbol, or a function of a canonical argument, or a non-expandable power base. */
export type Atom = { k: 'sym'; name: string } | { k: 'fn'; f: string; arg: Poly } | { k: 'grp'; p: Poly; e: number };
/** A monomial c × Π atom^exp. */
export type Mono = { c: number; f: Map<string, { a: Atom; e: number }> };
export type Poly = Mono[];

const EPS = 1e-12;
const atomKey = (a: Atom): string => (a.k === 'sym' ? a.name : a.k === 'fn' ? `${a.f}(${polyKey(a.arg)})` : `[${polyKey(a.p)}]^${a.e}`);
const monoKey = (m: Mono) => [...m.f.keys()].sort().map((k) => `${k}^${m.f.get(k)!.e}`).join('*');
export const polyKey = (p: Poly) => p.map((m) => `${+m.c.toPrecision(12)}*${monoKey(m)}`).sort().join('+');

const num = (c: number): Poly => (Math.abs(c) < EPS ? [] : [{ c, f: new Map() }]);
const atomPoly = (a: Atom, e = 1): Poly => [{ c: 1, f: new Map([[atomKey(a), { a, e }]]) }];
export const sym = (name: string): Poly => atomPoly({ k: 'sym', name });

function tidy(ms: Mono[]): Poly {
  const by = new Map<string, Mono>();
  for (const m of ms) {
    for (const [k, v] of [...m.f]) if (v.e === 0) m.f.delete(k);
    const key = monoKey(m), o = by.get(key);
    if (o) o.c += m.c; else by.set(key, { c: m.c, f: new Map(m.f) });
  }
  let out = [...by.values()].filter((m) => Math.abs(m.c) > EPS * 1e-3);
  out = pythagoras(out);
  return out;
}
/** Replace c·X·cos(u)^n·... + c·X·sin(u)^2·cos(u)^(n-2)... : the simple case c·X·sin²u + c·X·cos²u = c·X. */
function pythagoras(ms: Mono[]): Mono[] {
  for (let changed = true; changed;) {
    changed = false;
    outer: for (let i = 0; i < ms.length; i++) {
      for (const [k, v] of ms[i].f) {
        if (v.a.k !== 'fn' || v.a.f !== 'sin' || v.e < 2) continue;
        const ck = `cos(${polyKey(v.a.arg)})`;
        // Partner: same monomial with sin^(e-2) and cos^(+2).
        const want = new Map(ms[i].f); want.set(k, { ...v, e: v.e - 2 });
        const cv = want.get(ck); want.set(ck, { a: { k: 'fn', f: 'cos', arg: v.a.arg }, e: (cv?.e ?? 0) + 2 });
        for (const [kk, vv] of [...want]) if (vv.e === 0) want.delete(kk);
        const wantKey = monoKey({ c: 1, f: want });
        for (let j = 0; j < ms.length; j++) {
          if (j === i || monoKey(ms[j]) !== wantKey || Math.abs(ms[j].c - ms[i].c) > 1e-9 * Math.abs(ms[i].c)) continue;
          const keep = new Map(ms[i].f); keep.set(k, { ...v, e: v.e - 2 }); if (v.e - 2 === 0) keep.delete(k);
          const merged: Mono = { c: ms[i].c, f: keep };
          ms = ms.filter((_, n) => n !== i && n !== j);
          ms.push(merged); ms = tidyNoPy(ms); changed = true; break outer;
        }
      }
    }
  }
  return ms;
}
function tidyNoPy(ms: Mono[]): Mono[] {
  const by = new Map<string, Mono>();
  for (const m of ms) { const key = monoKey(m), o = by.get(key); if (o) o.c += m.c; else by.set(key, { c: m.c, f: new Map(m.f) }); }
  return [...by.values()].filter((m) => Math.abs(m.c) > EPS * 1e-3);
}

export const add = (a: Poly, b: Poly): Poly => tidy([...a, ...b].map((m) => ({ c: m.c, f: new Map(m.f) })));
export const scale = (a: Poly, s: number): Poly => tidy(a.map((m) => ({ c: m.c * s, f: new Map(m.f) })));
export function mul(a: Poly, b: Poly): Poly {
  const out: Mono[] = [];
  for (const x of a) for (const y of b) {
    const f = new Map(x.f);
    for (const [k, v] of y.f) { const o = f.get(k); f.set(k, { a: v.a, e: (o?.e ?? 0) + v.e }); }
    out.push({ c: x.c * y.c, f });
  }
  return tidy(out);
}
const isNum = (p: Poly) => p.length === 0 || (p.length === 1 && p[0].f.size === 0);
const numVal = (p: Poly) => (p.length ? p[0].c : 0);
export function pow(a: Poly, e: number): Poly {
  if (e === 0) return num(1);
  if (e === 1) return a;
  if (isNum(a)) return num(numVal(a) ** e);
  if (a.length === 1) {
    // A single monomial: multiply exponents for whole powers, and for fractional powers of plain (power-1) factors with a
    // positive coefficient. (x²)^½ is left alone, since it is |x|, not x.
    const m = a[0];
    if (Number.isInteger(e) || (m.c > 0 && [...m.f.values()].every((v) => v.e === 1))) return tidy([{ c: m.c ** e, f: new Map([...m.f].map(([k, v]) => [k, { a: v.a, e: v.e * e }])) }]);
  }
  if (Number.isInteger(e) && e > 0 && e <= 6) { let r = a; for (let i = 1; i < e; i++) r = mul(r, a); return r; }
  return atomPoly({ k: 'grp', p: a, e: 1 }, e);
}

const FNS = ['sin', 'cos', 'tan', 'exp', 'ln', 'log', 'sqrt', 'sinh', 'cosh', 'tanh', 'asin', 'acos', 'atan'];
const NUMF: Record<string, (x: number) => number> = { sin: Math.sin, cos: Math.cos, tan: Math.tan, exp: Math.exp, ln: Math.log, log: Math.log10, sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh, asin: Math.asin, acos: Math.acos, atan: Math.atan };
export function fn(f: string, arg: Poly): Poly {
  if (f === 'sqrt') return pow(arg, 0.5);
  if (isNum(arg)) return num(NUMF[f](numVal(arg)));
  // Odd and even symmetry: sin(−u) = −sin(u), cos(−u) = cos(u), so the argument's leading sign is made positive.
  const lead = [...arg].sort((x, y) => (monoKey(x) < monoKey(y) ? -1 : 1))[0];
  if (lead && lead.c < 0 && ['sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh', 'asin', 'atan'].includes(f)) {
    const neg = scale(arg, -1), inner = atomPoly({ k: 'fn', f, arg: neg });
    return f === 'cos' || f === 'cosh' ? inner : scale(inner, -1);
  }
  if (f === 'exp' && arg.length === 1 && arg[0].f.size === 1) { const [v] = [...arg[0].f.values()]; if (v.a.k === 'fn' && v.a.f === 'ln' && arg[0].c === 1 && v.e === 1) return v.a.arg; }
  return atomPoly({ k: 'fn', f, arg });
}

/** Expression tree from expr.ts to canonical form. */
export function canon(n: Node): Poly {
  switch (n.t) {
    case 'num': return num(n.v);
    case 'var': return sym(n.name);
    case 'neg': return scale(canon(n.a), -1);
    case 'bin': {
      const a = canon(n.a), b = canon(n.b);
      if (n.op === '+') return add(a, b);
      if (n.op === '-') return add(a, scale(b, -1));
      if (n.op === '*') return mul(a, b);
      if (n.op === '/') { if (isNum(b) && numVal(b) === 0) throw new Error('Division by zero'); return mul(a, pow(b, -1)); }
      if (!isNum(b)) throw new Error('Powers must be numbers here (x^2 is fine; x^y is not); use exp(y ln(x)) instead');
      return pow(a, numVal(b));
    }
    case 'fn': {
      if (n.name === 'pow') { const e = canon(n.args[1]); if (!isNum(e)) throw new Error('pow() needs a number power'); return pow(canon(n.args[0]), numVal(e)); }
      if (!FNS.includes(n.name)) throw new Error(`${n.name}() is not supported here; use ${FNS.join(', ')}`);
      return fn(n.name, canon(n.args[0]));
    }
  }
}

// ---- Differentiation --------------------------------------------------------------------------------------------
function dAtom(a: Atom, v: string): Poly {
  if (a.k === 'sym') return num(a.name === v ? 1 : 0);
  if (a.k === 'grp') return mul(scale(pow(a.p, a.e - 1), a.e), diff(a.p, v));
  const du = diff(a.arg, v);
  if (!du.length) return [];
  const u = a.arg;
  let outer: Poly;
  switch (a.f) {
    case 'sin': outer = fn('cos', u); break;
    case 'cos': outer = scale(fn('sin', u), -1); break;
    case 'tan': outer = pow(fn('cos', u), -2); break;
    case 'exp': outer = fn('exp', u); break;
    case 'ln': outer = pow(u, -1); break;
    case 'log': outer = scale(pow(u, -1), 1 / Math.LN10); break;
    case 'sinh': outer = fn('cosh', u); break;
    case 'cosh': outer = fn('sinh', u); break;
    case 'tanh': outer = pow(fn('cosh', u), -2); break;
    case 'asin': outer = pow(add(num(1), scale(pow(u, 2), -1)), -0.5); break;
    case 'acos': outer = scale(pow(add(num(1), scale(pow(u, 2), -1)), -0.5), -1); break;
    case 'atan': outer = pow(add(num(1), pow(u, 2)), -1); break;
    default: throw new Error(`Cannot differentiate ${a.f}`);
  }
  return mul(outer, du);
}
/** ∂p/∂v. */
export function diff(p: Poly, v: string): Poly {
  let out: Poly = [];
  for (const m of p) {
    for (const [k, { a, e }] of m.f) {
      const da = dAtom(a, v);
      if (!da.length) continue;
      const rest = new Map(m.f); rest.set(k, { a, e: e - 1 }); if (e - 1 === 0) rest.delete(k);
      out = add(out, mul([{ c: m.c * e, f: rest }], da));
    }
  }
  return out;
}
/** Set a symbol to zero (drops every monomial that contains it to a positive power). */
export const zeroOut = (p: Poly, v: string): Poly => tidy(p.filter((m) => !(m.f.has(v) && m.f.get(v)!.e > 0)).map((m) => ({ c: m.c, f: new Map(m.f) })));
/** Does p mention symbol v anywhere (also inside functions)? */
export const mentions = (p: Poly, v: string): boolean => p.some((m) => [...m.f.values()].some(({ a }) => (a.k === 'sym' ? a.name === v : a.k === 'fn' ? mentions(a.arg, v) : mentions(a.p, v))));
export function symbols(p: Poly, out = new Set<string>()): Set<string> {
  for (const m of p) for (const { a } of m.f.values()) { if (a.k === 'sym') out.add(a.name); else if (a.k === 'fn') symbols(a.arg, out); else symbols(a.p, out); }
  return out;
}

// ---- Numbers --------------------------------------------------------------------------------------------------------
export function evaluate(p: Poly, env: Record<string, number>): number {
  let s = 0;
  for (const m of p) {
    let t = m.c;
    for (const { a, e } of m.f.values()) {
      const x = a.k === 'sym' ? env[a.name] : a.k === 'fn' ? NUMF[a.f](evaluate(a.arg, env)) : evaluate(a.p, env) ** a.e;
      if (x === undefined) throw new Error(`No value for ${(a as { name: string }).name}`);
      t *= x ** e;
    }
    s += t;
  }
  return s;
}

// ---- Printing ------------------------------------------------------------------------------------------------------
const GREEK: Record<string, string> = { alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ', iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', rho: 'ρ', sigma: 'σ', tau: 'τ', phi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω', Theta: 'Θ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω' };
const SUPD: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
export function prettyName(n: string): string {
  const m = /^(.*?)(ddot|dot)$/.exec(n);
  const base = m && m[1] ? m[1] : n, mark = m && m[1] ? (m[2] === 'ddot' ? '̈' : '̇') : '';
  const sub = /^([A-Za-z]+?)(\d+)$/.exec(base);
  const word = sub ? sub[1] : base, digits = sub ? sub[2] : '';
  const g = GREEK[word] ?? word;
  const subs = digits.split('').map((d) => '₀₁₂₃₄₅₆₇₈₉'[+d]).join('');
  // A dot only sits clearly over a single letter; longer names get primes instead (th₁′, th₁″).
  // Combining dots are drawn badly by many fonts, so a dot is used only where both the dotted and double-dotted letters
  // exist as single characters (ẋ ẍ, ẏ ÿ, ẇ ẅ); everything else gets primes (θ′, θ″, th₁′).
  if (mark && !/^[xyw]$/.test(g)) return g + subs + (mark === '\u0308' ? '″' : '′');
  return (g + mark).normalize('NFC') + subs;
}
function fmtNum(c: number): string {
  const a = Math.abs(c);
  for (let d = 1; d <= 12; d++) { const nn = Math.round(a * d); if (nn > 0 && Math.abs(nn / d - a) < 1e-9 * Math.max(1, a)) return d === 1 ? String(nn) : `${nn}/${d}`; }
  return String(+a.toPrecision(6));
}
/** Print a polynomial. pretty: Greek letters, dots, superscripts, "·"; otherwise plain text that SymPy can read. */
export function print(p: Poly, pretty = true): string {
  if (!p.length) return '0';
  // Terms with accelerations first, then velocities, then the rest; inside a term: parameters, functions, then rates.
  const cls = (k: string, a: Atom) => (a.k !== 'sym' ? 1 : /ddot$/.test(k) ? 3 : /dot$/.test(k) ? 2 : 0);
  const rank = (m: Mono) => ([...m.f.entries()].some(([k, v]) => v.a.k === 'sym' && /ddot$/.test(k)) ? 0 : [...m.f.entries()].some(([k, v]) => v.a.k === 'sym' && /dot$/.test(k)) ? 1 : 2);
  const sorted = [...p].sort((x, y) => { const r = rank(x) - rank(y); if (r) return r; const kx = monoKey(x), ky = monoKey(y); return kx < ky ? -1 : kx > ky ? 1 : 0; });
  const order = (m: Mono) => [...m.f.keys()].sort((a, b) => cls(a, m.f.get(a)!.a) - cls(b, m.f.get(b)!.a) || (a < b ? -1 : a > b ? 1 : 0));
  const name = (s: string) => (pretty ? prettyName(s) : s);
  const expo = (e: number) => (e === 1 ? '' : pretty && Number.isInteger(e) ? String(e).split('').map((d) => SUPD[d]).join('') : `^${Number.isInteger(e) ? e : `(${fmtNum(e) === String(e) ? e : (e < 0 ? '-' : '') + fmtNum(e)})`}`);
  const atomS = (a: Atom): string => (a.k === 'sym' ? name(a.name) : a.k === 'fn' ? `${a.f}(${print(a.arg, pretty)})` : `(${print(a.p, pretty)})`);
  const times = pretty ? '·' : '*';
  const minus = pretty ? '−' : '-';
  return sorted.map((m, i) => {
    const num_: string[] = [], den: string[] = [];
    for (const k of order(m)) {
      const { a, e } = m.f.get(k)!, s = atomS(a);
      if (e > 0) num_.push(s + expo(e)); else den.push(s + expo(-e));
    }
    const cs = fmtNum(m.c);
    let top: string[], bottom = den;
    if (cs.includes('/')) { const [nn, dd] = cs.split('/'); top = [...(nn !== '1' || !num_.length ? [nn] : []), ...num_]; bottom = [dd, ...den]; }
    else top = [...(cs !== '1' || !num_.length ? [cs] : []), ...num_];
    let body = top.join(times);
    if (bottom.length) body += '/' + (bottom.length > 1 ? `(${bottom.join(times)})` : bottom[0]);
    const sign = m.c < 0 ? (i ? ` ${minus} ` : minus) : i ? ' + ' : '';
    return sign + body;
  }).join('');
}

// ---- Lagrangian mechanics ----------------------------------------------------------------------------------------
/** Read a formula, turning q' into qdot and q'' into qddot. */
export function read(src: string): Poly {
  const s = src.replace(/([A-Za-z_Ͱ-Ͽ][\wͰ-Ͽ]*)''/g, '$1ddot').replace(/([A-Za-z_Ͱ-Ͽ][\wͰ-Ͽ]*)'/g, '$1dot').replace(/˙|·(?=[A-Za-z])/g, '*');
  return canon(parse(s));
}

export type LagResult = {
  L: Poly; p: Poly[]; dLdq: Poly[]; ddt: Poly[]; EL: Poly[]; A: Poly[][]; B: Poly[]; H: Poly | null; explicitT: boolean; params: string[];
};

/** Euler-Lagrange equations d/dt(∂L/∂q̇) − ∂L/∂q = 0 for coordinates qs, with L = T − V. */
export function lagrange(qs: string[], T: Poly, V: Poly): LagResult {
  const L = add(T, scale(V, -1)), dot = qs.map((q) => q + 'dot'), dd = qs.map((q) => q + 'ddot');
  const p = dot.map((d) => diff(L, d)), dLdq = qs.map((q) => diff(L, q));
  const ddt = p.map((pi) => { let s = diff(pi, 't'); qs.forEach((q, j) => { s = add(s, mul(diff(pi, q), sym(dot[j]))); s = add(s, mul(diff(pi, dot[j]), sym(dd[j]))); }); return s; });
  const EL = ddt.map((d, i) => add(d, scale(dLdq[i], -1)));
  const A = EL.map((e) => dd.map((d) => diff(e, d)));
  const B = EL.map((e) => dd.reduce((acc, d) => zeroOut(acc, d), e));
  const explicitT = mentions(L, 't');
  // Energy function h = Σ q̇ ∂L/∂q̇ − L (conserved when L has no explicit t).
  let H: Poly | null = scale(L, -1); dot.forEach((d, i) => { H = add(H!, mul(sym(d), p[i])); });
  const params = [...symbols(add(T, V))].filter((s) => !qs.includes(s) && !dot.includes(s) && s !== 't').sort();
  return { L, p, dLdq, ddt, EL, A, B, H, explicitT, params };
}

/** Solve A x = b by Gaussian elimination with partial pivoting. */
export function solve(A: number[][], b: number[]): number[] {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-14) throw new Error('The mass matrix is singular here (a coordinate has no kinetic energy)');
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k]; x[r] = s / M[r][r]; }
  return x;
}

/** Integrate the equations of motion with RK4 from q0, v0 over [0, tEnd]. Returns samples and the energy function. */
export function simulate(qs: string[], r: LagResult, params: Record<string, number>, q0: number[], v0: number[], tEnd: number, steps = 2000) {
  const n = qs.length, dot = qs.map((q) => q + 'dot');
  const acc = (t: number, q: number[], v: number[]) => {
    const env: Record<string, number> = { ...params, t }; qs.forEach((s, i) => { env[s] = q[i]; env[dot[i]] = v[i]; });
    const A = r.A.map((row) => row.map((e) => evaluate(e, env))), B = r.B.map((e) => -evaluate(e, env));
    return solve(A, B);
  };
  const energy = (t: number, q: number[], v: number[]) => { const env: Record<string, number> = { ...params, t }; qs.forEach((s, i) => { env[s] = q[i]; env[dot[i]] = v[i]; }); return evaluate(r.H!, env); };
  let q = [...q0], v = [...v0], t = 0; const h = tEnd / steps;
  const T = [0], Q = [q.slice()], Vv = [v.slice()], E = [energy(0, q, v)];
  for (let s = 0; s < steps; s++) {
    const k1v = acc(t, q, v), k1q = v;
    const q2 = q.map((x, i) => x + (h / 2) * k1q[i]), v2 = v.map((x, i) => x + (h / 2) * k1v[i]), k2v = acc(t + h / 2, q2, v2), k2q = v2;
    const q3 = q.map((x, i) => x + (h / 2) * k2q[i]), v3 = v.map((x, i) => x + (h / 2) * k2v[i]), k3v = acc(t + h / 2, q3, v3), k3q = v3;
    const q4 = q.map((x, i) => x + h * k3q[i]), v4 = v.map((x, i) => x + h * k3v[i]), k4v = acc(t + h, q4, v4), k4q = v4;
    q = q.map((x, i) => x + (h / 6) * (k1q[i] + 2 * k2q[i] + 2 * k3q[i] + k4q[i]));
    v = v.map((x, i) => x + (h / 6) * (k1v[i] + 2 * k2v[i] + 2 * k3v[i] + k4v[i]));
    t += h; T.push(t); Q.push(q.slice()); Vv.push(v.slice()); E.push(energy(t, q, v));
  }
  void n;
  return { t: T, q: Q, v: Vv, E };
}
