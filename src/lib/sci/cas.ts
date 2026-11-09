// A small computer algebra system (CAS): parse, simplify, expand, factor polynomials in one variable, differentiate,
// integrate polynomials, rational functions and standard forms, substitute and evaluate. Exact fractions throughout.
// No eval or new Function (the site's security policy forbids them). Plain TypeScript, no DOM.
// Checked against sympy in tests/sci-tools/symbolic-algebra.mjs.
import { Q, solve as solveLinear } from './matrix.ts';

export type Ex =
  | { k: 'num'; q: Q }
  | { k: 'sym'; name: string }
  | { k: 'add'; t: Ex[] }
  | { k: 'mul'; f: Ex[] }
  | { k: 'pow'; b: Ex; e: Ex }
  | { k: 'fn'; name: string; a: Ex };

export class CasError extends Error {}

// ---------- Construction (always canonical) ----------
export const N = (q: Q | number | bigint): Ex => ({ k: 'num', q: q instanceof Q ? q : Q.of(q) });
export const ZERO = N(0), ONE = N(1), MINUS1 = N(-1), HALF: Ex = { k: 'num', q: new Q(1n, 2n) };
export const S = (name: string): Ex => ({ k: 'sym', name });
export const E = S('e'), PI = S('π');
const isNum = (x: Ex): x is { k: 'num'; q: Q } => x.k === 'num';
const isInt = (x: Ex) => isNum(x) && x.q.d === 1n;

const KEY = new WeakMap<Ex, string>();
export function key(x: Ex): string {
  let s = KEY.get(x);
  if (s) return s;
  switch (x.k) {
    case 'num': s = `#${x.q.toString(true)}`; break;
    case 'sym': s = `$${x.name}`; break;
    case 'add': s = `+(${x.t.map(key).join(',')})`; break;
    case 'mul': s = `*(${x.f.map(key).join(',')})`; break;
    case 'pow': s = `^(${key(x.b)},${key(x.e)})`; break;
    case 'fn': s = `${x.name}(${key(x.a)})`; break;
  }
  KEY.set(x, s);
  return s;
}
const cmp = (a: Ex, b: Ex) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0);
export const same = (a: Ex, b: Ex) => key(a) === key(b);

function splitCoef(t: Ex): [Q, Ex] {
  if (t.k === 'num') return [t.q, ONE];
  if (t.k === 'mul' && t.f[0].k === 'num') return [t.f[0].q, t.f.length === 2 ? t.f[1] : { k: 'mul', f: t.f.slice(1) }];
  return [Q.ONE, t];
}
let budget = 0;
const tick = () => { if (++budget > 2_000_000) throw new CasError('This is too big to work out here. Try a smaller expression.'); };

export function add(...xs: Ex[]): Ex {
  tick();
  const terms: Ex[] = [];
  for (const x of xs) if (x.k === 'add') terms.push(...x.t); else terms.push(x);
  let c = Q.ZERO;
  const map = new Map<string, { coef: Q; rest: Ex }>();
  for (const t of terms) {
    if (t.k === 'num') { c = c.add(t.q); continue; }
    const [k, rest] = splitCoef(t);
    const kk = key(rest), e = map.get(kk);
    if (e) e.coef = e.coef.add(k); else map.set(kk, { coef: k, rest });
  }
  const out: Ex[] = [];
  for (const { coef, rest } of map.values()) {
    if (coef.isZero()) continue;
    out.push(coef.isOne() ? rest : { k: 'mul', f: [N(coef), ...(rest.k === 'mul' ? rest.f : [rest])] });
  }
  if (!c.isZero()) out.push(N(c));
  if (!out.length) return ZERO;
  if (out.length === 1) return out[0];
  out.sort(cmp);
  return { k: 'add', t: out };
}

export function mul(...xs: Ex[]): Ex {
  tick();
  const fs: Ex[] = [];
  for (const x of xs) if (x.k === 'mul') fs.push(...x.f); else fs.push(x);
  let c = Q.ONE;
  const map = new Map<string, { base: Ex; exp: Ex }>();
  for (const f of fs) {
    if (f.k === 'num') { c = c.mul(f.q); continue; }
    const [b, e] = f.k === 'pow' ? [f.b, f.e] : [f, ONE];
    const kk = key(b), cur = map.get(kk);
    if (cur) cur.exp = add(cur.exp, e); else map.set(kk, { base: b, exp: e });
  }
  if (c.isZero()) return ZERO;
  const out: Ex[] = [];
  let again = false;
  for (const { base, exp } of map.values()) {
    const p = pow(base, exp);
    if (p.k === 'num') c = c.mul(p.q);
    else if (p.k === 'mul') { again = true; out.push(p); }
    else out.push(p);
  }
  if (c.isZero()) return ZERO;
  if (again) return mul(N(c), ...out);
  if (!out.length) return N(c);
  if (out.length === 1 && out[0].k === 'add' && !c.isOne()) return add(...out[0].t.map((t) => mul(N(c), t)));
  out.sort(cmp);
  if (c.isOne() && out.length === 1) return out[0];
  return { k: 'mul', f: c.isOne() ? out : [N(c), ...out] };
}
export const neg = (x: Ex) => mul(MINUS1, x);
export const sub = (a: Ex, b: Ex) => add(a, neg(b));
export const div = (a: Ex, b: Ex) => { if (isNum(b) && b.q.isZero()) throw new CasError('Division by zero.'); return mul(a, pow(b, MINUS1)); };

// Integer roots: n = k^s · rest with k as large as trial division finds (up to 10⁶).
function extractRoot(n: bigint, s: number): [bigint, bigint] {
  let k = 1n, rest = n;
  const S_ = BigInt(s);
  for (let p = 2n; p * p <= rest && p < 1_000_000n; p++) {
    if (rest % p) continue;
    let e = 0n;
    while (rest % p === 0n) { rest /= p; e++; }
    k *= p ** (e / S_); rest *= p ** (e % S_);
  }
  // A leftover large prime cannot be a perfect power (when below 10¹²); check an exact power anyway.
  if (rest > 1n) {
    const r = BigInt(Math.round(Number(rest) ** (1 / s)));
    for (const c of [r - 1n, r, r + 1n]) if (c > 1n && c ** S_ === rest) { k *= c; rest = 1n; break; }
  }
  return [k, rest];
}
function numPow(q: Q, r: Q): Ex {
  if (r.d === 1n) {
    if (q.isZero() && r.n < 0n) throw new CasError('Division by zero.');
    if (r.n > 100000n || r.n < -100000n) throw new CasError('That power is too large.');
    const e = r.n < 0n ? -r.n : r.n;
    const v = new Q(q.n ** e, q.d ** e);
    return N(r.n < 0n ? Q.ONE.div(v) : v);
  }
  if (q.sign() < 0) return { k: 'pow', b: N(q), e: N(r) }; // left alone, like (−8)^(1/3)
  if (q.isZero()) return ZERO;
  if (q.isOne()) return ONE;
  // q^r = q^n · q^(a/s), 0 < a/s < 1
  const s = Number(r.d), nI = r.n >= 0n ? r.n / r.d : -((-r.n + r.d - 1n) / r.d);
  const a = r.n - nI * r.d;
  const whole = numPow(q, new Q(nI)) as { k: 'num'; q: Q };
  if (s > 64) return mul(whole, { k: 'pow', b: N(q), e: N(new Q(a, r.d)) });
  // (n/d)^(a/s) = (1/d) · (n^a d^(s−a))^(1/s)
  const inside = q.n ** a * q.d ** (BigInt(s) - a);
  const [k, rest] = extractRoot(inside, s);
  const coef = whole.q.mul(new Q(k, q.d));
  if (rest === 1n) return N(coef);
  // Lowest form of rest^(1/s): if rest is a perfect power of lower order, the exponent can be reduced.
  const raw: Ex = { k: 'pow', b: N(new Q(rest)), e: N(new Q(1n, r.d)) };
  return coef.isOne() ? raw : { k: 'mul', f: [N(coef), raw] };
}

export function pow(b: Ex, e: Ex): Ex {
  tick();
  if (isNum(e)) {
    if (e.q.isZero()) return ONE;
    if (e.q.isOne()) return b;
    if (isNum(b)) return numPow(b.q, e.q);
    if (b.k === 'pow' && e.q.d === 1n) return pow(b.b, mul(b.e, e));
    if (b.k === 'pow' && isNum(b.e) && b.e.q.d === 1n && b.e.q.n % 2n === 1n) return pow(b.b, mul(b.e, e)); // (x³)^(1/3) = x for real odd powers
    if (b.k === 'mul' && e.q.d === 1n) return mul(...b.f.map((f) => pow(f, e)));
  }
  if (isNum(b) && b.q.isOne()) return ONE;
  if (isNum(b) && b.q.isZero()) { if (isNum(e) && e.q.sign() > 0) return ZERO; if (isNum(e)) throw new CasError('Division by zero.'); }
  if (same(b, E) && e.k === 'fn' && e.name === 'ln') return e.a;
  return { k: 'pow', b, e };
}

const ODD = new Set(['sin', 'tan', 'asin', 'atan', 'sinh', 'tanh', 'asinh', 'atanh']), EVEN = new Set(['cos', 'cosh']);
export const FUNCS = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'ln', 'abs'];
function negCoef(a: Ex) { return (isNum(a) && a.q.sign() < 0) || (a.k === 'mul' && isNum(a.f[0]) && a.f[0].q.sign() < 0); }
const SQ2 = (): Ex => numPow(new Q(2n), new Q(1n, 2n)), SQ3 = (): Ex => numPow(new Q(3n), new Q(1n, 2n));
/** sin, cos and tan of a rational multiple of π with a known exact value. */
function trigAtPi(name: string, r: Q): Ex | null {
  // Reduce r mod 2.
  let n = r.n % (2n * r.d); if (n < 0n) n += 2n * r.d;
  const t = new Q(n, r.d);
  const table = (deg: number): [Ex, Ex] | null => {
    const T: Record<number, [Ex, Ex]> = {
      0: [ZERO, ONE], 30: [HALF, mul(HALF, SQ3())], 45: [mul(HALF, SQ2()), mul(HALF, SQ2())], 60: [mul(HALF, SQ3()), HALF], 90: [ONE, ZERO],
    };
    return T[deg] ?? null;
  };
  const deg = t.toNumber() * 180;
  if (Math.abs(deg - Math.round(deg)) > 1e-9) return null;
  const d = Math.round(deg) % 360;
  const quad = Math.floor(d / 90), within = d % 90;
  let base = table(within);
  if (!base) return null;
  // Rotate by quadrants: (s, c) → (c, −s)
  let [s, c] = base;
  for (let i = 0; i < quad; i++) [s, c] = [c, neg(s)];
  if (name === 'sin') return s;
  if (name === 'cos') return c;
  if (isNum(c) && c.q.isZero()) throw new CasError('tan is undefined there (a multiple of π/2).');
  return div(s, c);
}
export function fn(name: string, a: Ex): Ex {
  tick();
  if (name === 'exp') return pow(E, a);
  if (name === 'sqrt') return pow(a, HALF);
  if (ODD.has(name) && negCoef(a)) return neg(fn(name, neg(a)));
  if ((EVEN.has(name) || name === 'abs') && negCoef(a)) return fn(name, neg(a));
  const z = isNum(a) && a.q.isZero();
  switch (name) {
    case 'ln':
      if (isNum(a) && a.q.isOne()) return ZERO;
      if (isNum(a) && a.q.isZero()) throw new CasError('ln(0) is undefined.');
      if (same(a, E)) return ONE;
      if (a.k === 'pow' && same(a.b, E)) return a.e;
      break;
    case 'abs':
      if (isNum(a)) return N(a.q.abs());
      if (same(a, PI) || same(a, E) || (a.k === 'pow' && same(a.b, E))) return a;
      if (a.k === 'fn' && a.name === 'abs') return a;
      break;
    case 'sin': case 'cos': case 'tan': {
      if (z) return name === 'cos' ? ONE : ZERO;
      if (same(a, PI)) return trigAtPi(name, Q.ONE)!;
      if (a.k === 'mul' && a.f.length === 2 && isNum(a.f[0]) && same(a.f[1], PI)) { const v = trigAtPi(name, a.f[0].q); if (v) return v; }
      break;
    }
    case 'asin': case 'atan': case 'sinh': case 'tanh': if (z) return ZERO; if (name === 'atan' && isNum(a) && a.q.isOne()) return mul(N(new Q(1n, 4n)), PI); break;
    case 'acos': if (isNum(a) && a.q.isOne()) return ZERO; if (z) return mul(HALF, PI); break;
    case 'cosh': if (z) return ONE; break;
  }
  return { k: 'fn', name, a };
}

/** Rebuild an expression bottom-up through the constructors (after substituting, for example). */
export function rebuild(x: Ex, f: (x: Ex) => Ex | null = () => null): Ex {
  const r = f(x);
  if (r) return r;
  switch (x.k) {
    case 'num': case 'sym': return x;
    case 'add': return add(...x.t.map((t) => rebuild(t, f)));
    case 'mul': return mul(...x.f.map((t) => rebuild(t, f)));
    case 'pow': return pow(rebuild(x.b, f), rebuild(x.e, f));
    case 'fn': return fn(x.name, rebuild(x.a, f));
  }
}
export const subst = (x: Ex, name: string, v: Ex) => rebuild(x, (y) => (y.k === 'sym' && y.name === name ? v : null));
export function symbols(x: Ex, out = new Set<string>()): Set<string> {
  if (x.k === 'sym') { if (x.name !== 'e' && x.name !== 'π') out.add(x.name); }
  else if (x.k === 'add') x.t.forEach((t) => symbols(t, out));
  else if (x.k === 'mul') x.f.forEach((t) => symbols(t, out));
  else if (x.k === 'pow') { symbols(x.b, out); symbols(x.e, out); }
  else if (x.k === 'fn') symbols(x.a, out);
  return out;
}
export const freeOf = (x: Ex, v: string): boolean => !symbols(x).has(v);

// ---------- Parsing ----------
const GREEK: Record<string, string> = { alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', theta: 'θ', lambda: 'λ', mu: 'μ', sigma: 'σ', tau: 'τ', phi: 'φ', omega: 'ω', rho: 'ρ' };
const FN_NAMES: Record<string, string> = {
  sin: 'sin', cos: 'cos', tan: 'tan', asin: 'asin', acos: 'acos', atan: 'atan', arcsin: 'asin', arccos: 'acos', arctan: 'atan',
  sinh: 'sinh', cosh: 'cosh', tanh: 'tanh', ln: 'ln', log: 'ln', exp: 'exp', sqrt: 'sqrt', abs: 'abs', sec: 'sec', csc: 'csc', cot: 'cot', log10: 'log10', log2: 'log2',
};
const WORDS = [...Object.keys(FN_NAMES), ...Object.keys(GREEK), 'pi'].sort((a, b) => b.length - a.length);
type Tok = { k: 'num' | 'id' | 'fn' | 'op' | '(' | ')' | ','; v: string; at: number };

function lex(src: string): Tok[] {
  const s = src.replace(/[×·∙]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-').replace(/\*\*/g, '^').replace(/²/g, '^2').replace(/³/g, '^3').replace(/√([A-Za-z0-9.]+)/g, 'sqrt($1)').replace(/√/g, 'sqrt').replace(/π/g, 'pi');
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) { i++; continue; }
    const m = /^(\d+\.?\d*|\.\d+)([eE][-+]?\d+(?![A-Za-z(]))?/.exec(s.slice(i));
    if (m) { out.push({ k: 'num', v: m[0], at: i }); i += m[0].length; continue; }
    const id = /^[A-Za-zα-ωΑ-Ω][A-Za-z0-9α-ωΑ-Ω]*/.exec(s.slice(i));
    if (id) {
      // Split runs of letters into names: known function names, Greek letter names, pi, and single letters (so 2xy is 2·x·y).
      let w = id[0], at = i;
      while (w) {
        const known = WORDS.find((k) => w.startsWith(k));
        if (known) {
          out.push(FN_NAMES[known] ? { k: 'fn', v: FN_NAMES[known], at } : { k: 'id', v: known === 'pi' ? 'π' : GREEK[known], at });
          w = w.slice(known.length); at += known.length; continue;
        }
        const one = /^[A-Za-zα-ωΑ-Ω]\d*/.exec(w)![0];
        out.push({ k: 'id', v: one, at }); w = w.slice(one.length); at += one.length;
      }
      i += id[0].length; continue;
    }
    if ('+-*/^'.includes(ch)) { out.push({ k: 'op', v: ch, at: i }); i++; continue; }
    if (ch === '(' || ch === '[' || ch === '{') { out.push({ k: '(', v: '(', at: i }); i++; continue; }
    if (ch === ')' || ch === ']' || ch === '}') { out.push({ k: ')', v: ')', at: i }); i++; continue; }
    if (ch === '|') { out.push({ k: 'op', v: '|', at: i }); i++; continue; }
    if (ch === ',') { out.push({ k: ',', v: ',', at: i }); i++; continue; }
    throw new CasError(`"${ch}" can't be used in an expression.`);
  }
  return out;
}
function decQ(v: string): Q {
  const m = /^(\d*)(?:\.(\d*))?(?:[eE]([-+]?\d+))?$/.exec(v)!;
  const frac = m[2] ?? '';
  let n = BigInt((m[1] || '0') + frac), d = 10n ** BigInt(frac.length);
  const e = m[3] ? Number(m[3]) : 0;
  if (Math.abs(e) > 300) throw new CasError(`${v} is too large or too small.`);
  if (e > 0) n *= 10n ** BigInt(e); else if (e < 0) d *= 10n ** BigInt(-e);
  return new Q(n, d);
}
function applyFn(name: string, a: Ex): Ex {
  switch (name) {
    case 'sec': return pow(fn('cos', a), MINUS1);
    case 'csc': return pow(fn('sin', a), MINUS1);
    case 'cot': return div(fn('cos', a), fn('sin', a));
    case 'log10': return div(fn('ln', a), fn('ln', N(10)));
    case 'log2': return div(fn('ln', a), fn('ln', N(2)));
    default: return fn(name, a);
  }
}

/** Parse an expression. Implicit multiplication works (2x, 3(x + 1), x sin(x), 2xy = 2·x·y); e is Euler's number, pi or π is π. */
export function parse(src: string): Ex {
  budget = 0;
  const toks = lex(src);
  if (!toks.length) throw new CasError('Type an expression.');
  let p = 0, absDepth = 0;
  const peek = () => toks[p], next = () => toks[p++];
  const startsAtom = (t?: Tok) => !!t && (t.k === 'num' || t.k === 'id' || t.k === 'fn' || t.k === '(' || (t.k === 'op' && t.v === '|' && absDepth === 0));
  function expr(): Ex {
    let a = term();
    while (peek()?.k === 'op' && (peek().v === '+' || peek().v === '-')) { const op = next().v; const b = term(); a = op === '+' ? add(a, b) : sub(a, b); }
    return a;
  }
  function term(): Ex {
    let a = unary();
    for (;;) {
      const t = peek();
      if (t?.k === 'op' && (t.v === '*' || t.v === '/')) { next(); const b = unary(); a = t.v === '*' ? mul(a, b) : div(a, b); continue; }
      if (startsAtom(t)) { a = mul(a, power()); continue; }
      return a;
    }
  }
  function unary(): Ex {
    const t = peek();
    if (t?.k === 'op' && (t.v === '-' || t.v === '+')) { next(); const a = unary(); return t.v === '-' ? neg(a) : a; }
    return power();
  }
  function power(): Ex {
    const a = atom();
    if (peek()?.k === 'op' && peek().v === '^') { next(); return pow(a, unary()); }
    return a;
  }
  function atom(): Ex {
    const t = next();
    if (!t) throw new CasError('The expression ends too soon.');
    if (t.k === 'num') return N(decQ(t.v));
    if (t.k === 'id') return t.v === 'e' ? E : S(t.v);
    if (t.k === '(') { const e = expr(); if (next()?.k !== ')') throw new CasError('A bracket is not closed.'); return e; }
    if (t.k === 'op' && t.v === '|') { absDepth++; const e = expr(); absDepth--; if (next()?.v !== '|') throw new CasError('An absolute value |…| is not closed.'); return fn('abs', e); }
    if (t.k === 'fn') {
      // sin^2(x) means sin(x)^2.
      let exp: Ex | null = null;
      if (peek()?.k === 'op' && peek().v === '^') { next(); exp = atom(); }
      if (peek()?.k !== '(') throw new CasError(`${t.v} needs brackets, like ${t.v}(x).`);
      next();
      const a = expr();
      if (next()?.k !== ')') throw new CasError('A bracket is not closed.');
      const f = applyFn(t.v, a);
      return exp ? pow(f, exp) : f;
    }
    if (t.k === ')') throw new CasError('There is a ")" without a matching "(".');
    throw new CasError(`Unexpected "${t.v}".`);
  }
  const tree = expr();
  if (p < toks.length) throw new CasError(`Unexpected "${toks[p].v}".`);
  return tree;
}

// ---------- Printing ----------
export type Style = 'pretty' | 'python' | 'latex';
const SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const supInt = (n: bigint) => (n < 0n ? '⁻' : '') + (n < 0n ? -n : n).toString().split('').map((d) => SUPD[Number(d)]).join('');
function degreeOf(x: Ex): number {
  switch (x.k) {
    case 'num': return 0;
    case 'sym': return x.name === 'e' || x.name === 'π' ? 0 : 1;
    case 'add': return Math.max(...x.t.map(degreeOf));
    case 'mul': return x.f.reduce((s, f) => s + degreeOf(f), 0);
    case 'pow': return isNum(x.e) ? degreeOf(x.b) * x.e.q.toNumber() : 0.5;
    case 'fn': return 0.25;
  }
}
/** Terms in the usual reading order: highest degree first, numbers last. */
function expOf(t: Ex): Map<string, number> {
  const m = new Map<string, number>();
  for (const f of t.k === 'mul' ? t.f : [t]) {
    if (f.k === 'sym') m.set(f.name, (m.get(f.name) ?? 0) + 1);
    else if (f.k === 'pow' && f.b.k === 'sym' && isNum(f.e)) m.set(f.b.name, (m.get(f.b.name) ?? 0) + f.e.q.toNumber());
  }
  return m;
}
function lexCmp(a: Ex, b: Ex): number {
  const ea = expOf(a), eb = expOf(b);
  for (const v of [...new Set([...ea.keys(), ...eb.keys()])].sort()) { const d = (eb.get(v) ?? 0) - (ea.get(v) ?? 0); if (d) return d; }
  return 0;
}
export function ordered(terms: Ex[]): Ex[] {
  return terms.slice().sort((a, b) => (isNum(a) ? 1 : 0) - (isNum(b) ? 1 : 0) || degreeOf(b) - degreeOf(a) || lexCmp(a, b) || cmp(a, b));
}
const baseName = (f: Ex) => { const n = f.k === 'sym' ? f.name : f.k === 'pow' && f.b.k === 'sym' ? f.b.name : ''; return n === 'π' || n === 'e' ? '' : n; };
const FN_TEX: Record<string, string> = { sin: '\\sin', cos: '\\cos', tan: '\\tan', asin: '\\arcsin', acos: '\\arccos', atan: '\\arctan', sinh: '\\sinh', cosh: '\\cosh', tanh: '\\tanh', ln: '\\ln' };
const FN_PY: Record<string, string> = { ln: 'log', abs: 'Abs' };

export function show(x: Ex, st: Style = 'pretty'): string {
  if (x.k === 'add') {
    let s = '';
    ordered(x.t).forEach((t, i) => {
      const [c] = splitCoef(t), negT = c.sign() < 0, body = term(negT ? neg(t) : t, st);
      s += i === 0 ? (negT ? (st === 'pretty' ? '−' : '-') : '') + body : (negT ? (st === 'pretty' ? ' − ' : ' - ') : ' + ') + body;
    });
    return s;
  }
  const [c] = splitCoef(x);
  if (c.sign() < 0) return (st === 'pretty' ? '−' : '-') + term(neg(x), st);
  return term(x, st);
}
function sym(name: string, st: Style) {
  if (st === 'python') return name === 'π' ? 'pi' : name === 'e' ? 'E' : name;
  if (st === 'latex') return name === 'π' ? '\\pi' : name === 'e' ? 'e' : { α: '\\alpha', β: '\\beta', γ: '\\gamma', δ: '\\delta', θ: '\\theta', λ: '\\lambda', μ: '\\mu', σ: '\\sigma', τ: '\\tau', φ: '\\phi', ω: '\\omega', ρ: '\\rho' }[name] ?? name;
  return name;
}
const wrap = (s: string, st: Style) => (st === 'latex' ? `\\left(${s}\\right)` : `(${s})`);
/** A positive term (no leading minus): coefficient, numerator and denominator. */
function term(x: Ex, st: Style): string {
  const [c, rest] = splitCoef(x);
  const fs = rest.k === 'mul' ? rest.f : isNum(rest) ? [] : [rest];
  const numF: Ex[] = [], denF: Ex[] = [];
  for (const f of fs) {
    if (f.k === 'pow' && isNum(f.e) && f.e.q.sign() < 0) denF.push(pow(f.b, N(f.e.q.neg())));
    else numF.push(f);
  }
  const lone = (fs: Ex[], k: bigint) => fs.length === 1 && fs[0].k === 'add' && k === 1n;
  const topLone = lone(numF, c.n < 0n ? -c.n : c.n), botLone = lone(denF, c.d);
  const top = topLone ? show(numF[0], st) : factors(numF, st, c.n < 0n ? -c.n : c.n);
  const bot = botLone ? show(denF[0], st) : factors(denF, st, c.d);
  if (!denF.length && c.d === 1n) return top;
  if (st === 'latex') return `\\frac{${top}}{${bot}}`;
  const denNeedsParens = botLone || denF.length + (c.d !== 1n ? 1 : 0) > 1;
  return `${topLone ? `(${top})` : top}/${denNeedsParens ? `(${bot})` : bot}`;
}
function factors(fs: Ex[], st: Style, coef: bigint): string {
  const parts: { s: string; letter: boolean; paren: boolean }[] = [];
  if (coef !== 1n || !fs.length) parts.push({ s: coef.toString(), letter: false, paren: false });
  const late = (a: Ex) => (a.k === 'fn' || (a.k === 'pow' && (a.b.k === 'fn' || same(a.b, E))) ? 1 : 0);
  const ord = fs.slice().sort((a, b) => (a.k === 'add' ? 1 : 0) - (b.k === 'add' ? 1 : 0) || late(a) - late(b) || (baseName(a) && baseName(b) ? baseName(a).localeCompare(baseName(b)) : 0) || cmp(a, b));
  for (const f of ord) {
    const s = factorStr(f, st);
    parts.push({ s, letter: (f.k === 'sym' || (f.k === 'pow' && f.b.k === 'sym' && isInt(f.e))) && f !== E, paren: s.startsWith('(') || s.startsWith('\\left(') });
  }
  if (st === 'python') return parts.map((p) => p.s).join('*');
  let out = parts[0]?.s ?? '';
  for (let i = 1; i < parts.length; i++) {
    const L = parts[i - 1], Rr = parts[i];
    const isNumL = /^\d/.test(L.s) && i === 1 && coef !== 1n;
    let sep: string;
    if (st === 'latex') sep = isNumL && /^\d/.test(Rr.s) ? ' \\cdot ' : ' ';
    else sep = isNumL || Rr.paren || (L.letter && Rr.letter) ? '' : '·';
    out += sep + Rr.s;
  }
  return out;
}
function factorStr(f: Ex, st: Style): string {
  switch (f.k) {
    case 'num': return f.q.toString(st !== 'pretty');
    case 'sym': return sym(f.name, st);
    case 'add': return wrap(show(f, st), st);
    case 'mul': return wrap(show(f, st), st);
    case 'fn': return fnText(f.name, show(f.a, st), st, f.a);
    case 'pow': {
      const b = f.b, e = f.e;
      if (isNum(e) && e.q.eq(new Q(1n, 2n))) {
        if (st === 'python') return `sqrt(${show(b, st)})`;
        if (st === 'latex') return `\\sqrt{${show(b, st)}}`;
        const inner = show(b, st);
        return b.k === 'sym' || (isNum(b) && b.q.d === 1n) ? `√${inner}` : `√(${inner})`;
      }
      if (same(b, E)) {
        if (st === 'python') return `exp(${show(e, st)})`;
        if (st === 'latex') return `e^{${show(e, st)}}`;
        const es = show(e, st);
        return e.k === 'sym' || (isInt(e) && (e as any).q.sign() > 0) ? `e^${es}` : `e^(${es})`;
      }
      // sin²(x) style for whole-number powers of functions.
      if (b.k === 'fn' && b.name !== 'abs' && isInt(e) && (e as any).q.sign() > 0 && st !== 'python') {
        const n = (e as any).q.n as bigint;
        if (st === 'latex' && FN_TEX[b.name]) return `${FN_TEX[b.name]}^{${n}}\\left(${show(b.a, st)}\\right)`;
        if (st === 'pretty') return `${b.name}${supInt(n)}(${show(b.a, st)})`;
      }
      const bs = b.k === 'sym' || b.k === 'fn' || (isNum(b) && b.q.d === 1n && b.q.sign() > 0) ? factorStr(b, st) : wrap(show(b, st), st);
      if (st === 'python') return `${bs}**${isNum(e) && e.q.d === 1n && e.q.sign() > 0 ? show(e, st) : `(${show(e, st)})`}`;
      if (st === 'latex') return `${bs}^{${show(e, st)}}`;
      if (isInt(e)) return bs + supInt((e as any).q.n);
      const es = show(e, st);
      return `${bs}^${e.k === 'sym' ? es : `(${es})`}`;
    }
  }
}
function fnText(name: string, a: string, st: Style, arg?: Ex) {
  if (name === 'ln' && arg?.k === 'fn' && arg.name === 'abs' && st !== 'python') return st === 'latex' ? `\\ln\\left|${show(arg.a, st)}\\right|` : `ln|${show(arg.a, st)}|`;
  if (name === 'abs') return st === 'python' ? `Abs(${a})` : st === 'latex' ? `\\left|${a}\\right|` : `|${a}|`;
  if (st === 'python') return `${FN_PY[name] ?? name}(${a})`;
  if (st === 'latex') return `${FN_TEX[name] ?? `\\operatorname{${name}}`}\\left(${a}\\right)`;
  return `${name}(${a})`;
}

// ---------- Numbers ----------
/** Evaluate with numbers for the symbols. Real arithmetic; NaN where undefined. */
export function evaluate(x: Ex, env: Record<string, number>): number {
  switch (x.k) {
    case 'num': return x.q.toNumber();
    case 'sym': return x.name === 'e' ? Math.E : x.name === 'π' ? Math.PI : x.name in env ? env[x.name] : NaN;
    case 'add': return x.t.reduce((s, t) => s + evaluate(t, env), 0);
    case 'mul': return x.f.reduce((s, t) => s * evaluate(t, env), 1);
    case 'pow': {
      const b = evaluate(x.b, env), e = evaluate(x.e, env);
      if (b < 0 && isNum(x.e) && x.e.q.d !== 1n) return x.e.q.d % 2n === 1n ? (x.e.q.n % 2n === 0n ? 1 : -1) * Math.abs(b) ** e : NaN; // real odd roots
      return b ** e;
    }
    case 'fn': {
      const a = evaluate(x.a, env);
      const F: Record<string, (v: number) => number> = { sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, acos: Math.acos, atan: Math.atan, sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh, ln: (v) => (v > 0 ? Math.log(v) : NaN), abs: Math.abs };
      return F[x.name](a);
    }
  }
}

// ---------- Polynomials in one variable (coefficients constant first) ----------
export type Poly = Q[];
const ptrim = (p: Poly): Poly => { const r = p.slice(); while (r.length && r[r.length - 1].isZero()) r.pop(); return r; };
export const deg = (p: Poly) => ptrim(p).length - 1;
const padd = (a: Poly, b: Poly) => ptrim(Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] ?? Q.ZERO).add(b[i] ?? Q.ZERO)));
const pscale = (a: Poly, c: Q) => ptrim(a.map((x) => x.mul(c)));
const psub = (a: Poly, b: Poly) => padd(a, pscale(b, Q.ONE.neg()));
function pmul(a: Poly, b: Poly): Poly {
  if (!a.length || !b.length) return [];
  const r: Q[] = Array(a.length + b.length - 1).fill(Q.ZERO);
  a.forEach((x, i) => { if (!x.isZero()) b.forEach((y, j) => { r[i + j] = r[i + j].add(x.mul(y)); }); });
  return ptrim(r);
}
function pdivmod(a: Poly, b: Poly): [Poly, Poly] {
  b = ptrim(b); let r = ptrim(a);
  if (!b.length) throw new CasError('Division by zero.');
  const db = b.length - 1, lb = b[db];
  const qq: Q[] = Array(Math.max(0, r.length - db)).fill(Q.ZERO);
  while (r.length - 1 >= db && r.length) {
    const k = r.length - 1 - db, c = r[r.length - 1].div(lb);
    qq[k] = c;
    r = ptrim(r.map((x, i) => (i >= k && i - k <= db ? x.sub(c.mul(b[i - k])) : x)));
  }
  return [ptrim(qq), r];
}
const pmonic = (p: Poly) => { const t = ptrim(p); return t.length ? pscale(t, Q.ONE.div(t[t.length - 1])) : t; };
function pgcd(a: Poly, b: Poly): Poly {
  a = ptrim(a); b = ptrim(b);
  while (b.length) { const [, r] = pdivmod(a, b); a = b; b = pmonic(r); }
  return pmonic(a);
}
const pderiv = (p: Poly) => ptrim(p.slice(1).map((x, i) => x.mul(new Q(BigInt(i + 1)))));
const ppow = (p: Poly, n: number) => { let r: Poly = [Q.ONE]; for (let i = 0; i < n; i++) r = pmul(r, p); return r; };
export const peval = (p: Poly, x: Q) => p.reduceRight((s, c) => s.mul(x).add(c), Q.ZERO);

/** The polynomial in v, or null when the expression is not a polynomial in v with number coefficients. */
export function toPoly(x: Ex, v: string): Poly | null {
  switch (x.k) {
    case 'num': return ptrim([x.q]);
    case 'sym': return x.name === v ? [Q.ZERO, Q.ONE] : null;
    case 'add': { let r: Poly = []; for (const t of x.t) { const p = toPoly(t, v); if (!p) return null; r = padd(r, p); } return r; }
    case 'mul': { let r: Poly = [Q.ONE]; for (const t of x.f) { const p = toPoly(t, v); if (!p) return null; r = pmul(r, p); } return r; }
    case 'pow': { if (!isInt(x.e) || (x.e as any).q.sign() < 0 || (x.e as any).q.n > 200n) return null; const p = toPoly(x.b, v); return p ? ppow(p, Number((x.e as any).q.n)) : null; }
    default: return null;
  }
}
/** A rational function P/Q in v with number coefficients, or null. */
export function toRational(x: Ex, v: string): { n: Poly; d: Poly } | null {
  switch (x.k) {
    case 'num': case 'sym': { const p = toPoly(x, v); return p ? { n: p, d: [Q.ONE] } : null; }
    case 'add': {
      let n: Poly = [], d: Poly = [Q.ONE];
      for (const t of x.t) { const r = toRational(t, v); if (!r) return null; n = padd(pmul(n, r.d), pmul(r.n, d)); d = pmul(d, r.d); const g = pgcd(n.length ? n : [Q.ZERO], d); if (deg(g) > 0) { n = pdivmod(n, g)[0]; d = pdivmod(d, g)[0]; } }
      return { n, d };
    }
    case 'mul': {
      let n: Poly = [Q.ONE], d: Poly = [Q.ONE];
      for (const t of x.f) { const r = toRational(t, v); if (!r) return null; n = pmul(n, r.n); d = pmul(d, r.d); }
      return { n, d };
    }
    case 'pow': {
      if (!isInt(x.e)) return null;
      const k = (x.e as any).q.n as bigint;
      if (k > 200n || k < -200n) return null;
      const r = toRational(x.b, v); if (!r) return null;
      const m = Number(k < 0n ? -k : k);
      return k < 0n ? { n: ppow(r.d, m), d: ppow(r.n, m) } : { n: ppow(r.n, m), d: ppow(r.d, m) };
    }
    default: return null;
  }
}
export function polyEx(p: Poly, v: string): Ex {
  return add(...ptrim(p).map((c, i) => mul(N(c), pow(S(v), N(i)))));
}
/** P/Q in lowest terms, with the denominator's leading coefficient made positive and whole. */
export function cancel(n: Poly, d: Poly): { n: Poly; d: Poly } {
  const g = pgcd(n.length ? n : [Q.ZERO], d);
  if (deg(g) > 0) { n = pdivmod(n, g)[0]; d = pdivmod(d, g)[0]; }
  // Scale so d has whole coefficients with no common factor and a positive leading coefficient.
  const { prim } = primitive(d);
  const k = d.length ? prim[prim.length - 1].div(d[d.length - 1]) : Q.ONE; // prim = d·k
  return { n: pscale(n, k), d: prim };
}
const ratEx = (n: Poly, d: Poly, v: string) => div(polyEx(n, v), polyEx(d, v));

// ---------- Integer polynomials and factoring ----------
const bgcd = (a: bigint, b: bigint): bigint => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
/** p = c · prim, with prim whole-numbered, coprime, leading coefficient positive. */
export function primitive(p: Poly): { c: Q; prim: Poly } {
  p = ptrim(p);
  if (!p.length) return { c: Q.ZERO, prim: [] };
  let l = 1n;
  for (const x of p) l = (l / bgcd(l, x.d)) * x.d;
  const ints = p.map((x) => (x.n * l) / x.d);
  let g = 0n; for (const x of ints) g = bgcd(g, x);
  if (ints[ints.length - 1] < 0n) g = -g;
  return { c: new Q(g, l), prim: ints.map((x) => new Q(x / g)) };
}
function divisors(n: bigint): bigint[] | null {
  if (n < 0n) n = -n;
  if (n === 0n) return null;
  if (n > 10n ** 12n) return null;
  const small: bigint[] = [], big: bigint[] = [];
  for (let d = 1n; d * d <= n; d++) if (n % d === 0n) { small.push(d); if (d * d !== n) big.unshift(n / d); }
  return [...small, ...big];
}
/** Square-free decomposition (Yun): [factor, multiplicity] with primitive whole-number factors. */
function squareFree(f: Poly): [Poly, number][] {
  const out: [Poly, number][] = [];
  if (deg(f) < 1) return out;
  let c = pgcd(f, pderiv(f)), w = pdivmod(f, c)[0], i = 1;
  while (deg(c) > 0) {
    const y = pgcd(w, c), z = pdivmod(w, y)[0];
    if (deg(z) > 0) out.push([primitive(z).prim, i]);
    i++; w = y; c = pdivmod(c, y)[0];
  }
  if (deg(w) > 0) out.push([primitive(w).prim, i]);
  return out;
}
function exactDivZ(a: Poly, b: Poly): Poly | null {
  const [qq, r] = pdivmod(a, b);
  if (r.length || qq.some((x) => x.d !== 1n)) return null;
  return qq;
}
/** Lagrange interpolation through (xs, ys), exact. */
function interpolate(xs: Q[], ys: Q[]): Poly {
  let r: Poly = [];
  xs.forEach((xi, i) => {
    let term: Poly = [ys[i]];
    xs.forEach((xj, j) => { if (j !== i) term = pmul(term, [xj.neg().div(xi.sub(xj)), Q.ONE.div(xi.sub(xj))]); });
    r = padd(r, term);
  });
  return r;
}
/** Split a square-free primitive polynomial into irreducible factors over the integers. `complete` is false if a search limit was hit. */
function splitIrreducible(f: Poly): { factors: Poly[]; complete: boolean } {
  const out: Poly[] = [];
  let complete = true;
  // x as a factor.
  while (deg(f) > 0 && f[0].isZero()) { out.push([Q.ZERO, Q.ONE]); f = f.slice(1); }
  // Rational roots p/q: p divides the constant term, q the leading one.
  const tryRoots = () => {
    const a0 = f[0].n, an = f[f.length - 1].n, P = divisors(a0), Qd = divisors(an);
    if (!P || !Qd) { if (deg(f) > 1) complete = false; return; }
    for (const qd of Qd) for (const pn of P) for (const sg of [1n, -1n]) {
      if (deg(f) < 1) return;
      if (bgcd(pn, qd) !== 1n) continue;
      const r = new Q(sg * pn, qd);
      while (deg(f) >= 1 && peval(f, r).isZero()) { const lin = [r.neg().mul(new Q(qd)), new Q(qd)]; out.push(lin); f = exactDivZ(f, lin)!; }
    }
  };
  if (deg(f) >= 1) tryRoots();
  // Kronecker's method for factors of degree 2 up to deg/2.
  const rest: Poly[] = [f];
  const done: Poly[] = [];
  while (rest.length) {
    const g = rest.pop()!;
    const d = deg(g);
    if (d < 4) { if (d >= 1) done.push(g); continue; }
    let found: Poly | null = null;
    for (let k = 2; k <= Math.floor(d / 2) && !found; k++) {
      const r = kronecker(g, k);
      if (r === 'limit') { complete = false; break; }
      found = r;
    }
    if (found) { const other = exactDivZ(g, found)!; rest.push(primitive(found).prim, primitive(other).prim); }
    else done.push(g);
  }
  return { factors: [...out, ...done].map((p) => primitive(p).prim), complete };
}
function kronecker(g: Poly, k: number): Poly | null | 'limit' {
  // k + 1 points where g has few divisors.
  const cands: { x: Q; v: Q; ds: bigint[] }[] = [];
  for (let i = 0; i <= 24; i++) {
    const xi = new Q(BigInt(i % 2 ? (i + 1) / 2 : -i / 2));
    const v = peval(g, xi);
    if (v.isZero()) continue;
    const ds = divisors(v.n);
    if (ds) cands.push({ x: xi, v, ds });
  }
  if (cands.length < k + 1) return 'limit';
  cands.sort((a, b) => a.ds.length - b.ds.length);
  const pts = cands.slice(0, k + 1);
  let combos = 1;
  for (let i = 0; i < pts.length; i++) combos *= pts[i].ds.length * (i ? 2 : 1);
  if (combos > 400000) return 'limit';
  const lead = g[g.length - 1].n;
  const idx = Array(pts.length).fill(0), sgn = Array(pts.length).fill(1);
  const total = combos;
  for (let c = 0; c < total; c++) {
    // Decode combination number c.
    let r = c;
    for (let i = 0; i < pts.length; i++) {
      const n = pts[i].ds.length * (i ? 2 : 1);
      const v = r % n; r = Math.floor(r / n);
      idx[i] = i ? v >> 1 : v; sgn[i] = i ? (v & 1 ? -1 : 1) : 1;
    }
    const ys = pts.map((p, i) => new Q(BigInt(sgn[i]) * p.ds[idx[i]]));
    const h = interpolate(pts.map((p) => p.x), ys);
    if (deg(h) !== k || h.some((x) => x.d !== 1n)) continue;
    if (lead % h[h.length - 1].n !== 0n) continue;
    if (exactDivZ(g, h)) return h;
  }
  return null;
}
export type Factored = { c: Q; factors: { p: Poly; m: number }[]; complete: boolean };
/** Factor a polynomial with rational coefficients into c × irreducible whole-number polynomials (as sympy factor_list). */
export function factorPoly(p: Poly): Factored {
  p = ptrim(p);
  if (deg(p) < 1) return { c: p[0] ?? Q.ZERO, factors: [], complete: true };
  const { c, prim } = primitive(p);
  const sf = squareFree(prim);
  const factors: { p: Poly; m: number }[] = [];
  let complete = true;
  for (const [g, m] of sf) {
    const r = splitIrreducible(g);
    if (!r.complete) complete = false;
    for (const f of r.factors) factors.push({ p: f, m });
  }
  // Fix the overall sign so the factors (all with positive leading terms) times c equal p.
  factors.sort((a, b) => deg(a.p) - deg(b.p) || cmpPoly(a.p, b.p));
  return { c, factors, complete };
}
const cmpPoly = (a: Poly, b: Poly) => { for (let i = 0; i < a.length; i++) { const x = a[i].cmp(b[i]); if (x) return x; } return 0; };

// ---------- Simplify, expand ----------
/** Product of two expanded expressions, term by term. */
function mulTerms(a: Ex, b: Ex): Ex {
  const ta = a.k === 'add' ? a.t : [a], tb = b.k === 'add' ? b.t : [b];
  if (ta.length * tb.length > 20000) throw new CasError('The expanded form has too many terms to show.');
  const out: Ex[] = [];
  for (const x of ta) for (const y of tb) out.push(mul(x, y));
  return add(...out);
}
export function expand(x: Ex): Ex {
  switch (x.k) {
    case 'num': case 'sym': return x;
    case 'add': return add(...x.t.map(expand));
    case 'fn': return fn(x.name, expand(x.a));
    case 'mul': {
      let acc: Ex = ONE;
      for (const f of x.f.map(expand)) acc = mulTerms(acc, f);
      return acc;
    }
    case 'pow': {
      const b = expand(x.b), e = x.e;
      if (b.k === 'add' && isInt(e)) {
        const n = (e as any).q.n as bigint;
        const m = Number(n < 0n ? -n : n);
        if (m > 60) throw new CasError('That power is too large to expand here.');
        let r: Ex = ONE;
        for (let i = 0; i < m; i++) r = mulTerms(r, b);
        return n < 0n ? pow(r, MINUS1) : r;
      }
      return pow(b, expand(e));
    }
  }
}
function pythag(x: Ex): Ex {
  // c·sin²(u) + c·cos²(u) → c
  return rebuild(x, (y) => {
    if (y.k !== 'add') return null;
    const terms = y.t.map((t) => pythag(t));
    for (let i = 0; i < terms.length; i++) {
      const [ci, ri] = splitCoef(terms[i]);
      if (!(ri.k === 'pow' && isNum(ri.e) && ri.e.q.eq(new Q(2n)) && ri.b.k === 'fn' && ri.b.name === 'sin')) continue;
      const j = terms.findIndex((t) => { const [cj, rj] = splitCoef(t); return cj.eq(ci) && rj.k === 'pow' && isNum(rj.e) && rj.e.q.eq(new Q(2n)) && rj.b.k === 'fn' && rj.b.name === 'cos' && same(rj.b.a, (ri.b as any).a); });
      if (j >= 0) { const rest = terms.filter((_, k) => k !== i && k !== j); return pythag(add(...rest, N(ci))); }
    }
    return add(...terms);
  });
}
const size = (x: Ex) => show(x).length;
const sameFraction = (a: { n: Poly; d: Poly }, b: { n: Poly; d: Poly }) => deg(a.d) === deg(b.d);
/** Simplify: the canonical form, the expanded form, a cancelled single fraction (one variable) and sin² + cos² = 1; the shortest wins. */
export function simplify(x: Ex): Ex {
  const cands: Ex[] = [x];
  try { const e = expand(x); cands.push(e, pythag(e)); } catch { /* too big */ }
  cands.push(pythag(x));
  const vars = [...symbols(x)];
  const cancelled: Ex[] = [];
  if (vars.length === 1) {
    const r = toRational(x, vars[0]);
    if (r && deg(r.d) > 0) {
      const c = cancel(r.n, r.d), v = vars[0];
      const before: Ex[] = [];
      if (deg(c.d) > 0) {
        before.push(ratEx(c.n, c.d, v));
        const fd = factorPoly(c.d);
        if (fd.complete) before.push(div(polyEx(pscale(c.n, Q.ONE.div(fd.c)), v), mul(...fd.factors.map((f) => pow(polyEx(f.p, v), N(f.m))))));
      } else before.push(polyEx(pscale(c.n, Q.ONE.div(c.d[0])), v));
      cands.push(...before);
      // Did anything cancel? Compare with the plain single fraction.
      const plain = toRational(x, v)!;
      if (deg(c.d) < Math.max(...[r.d].map(deg)) && !sameFraction(plain, c)) cancelled.push(...before);
    }
  }
  // A fraction that cancelled down is always preferred (as sympy does).
  const pool = cancelled.length ? cancelled : cands;
  return pool.reduce((best, c) => (size(c) < size(best) ? c : best));
}

// ---------- Derivatives ----------
export function diff(x: Ex, v: string): Ex {
  if (freeOf(x, v)) return ZERO;
  switch (x.k) {
    case 'num': return ZERO;
    case 'sym': return x.name === v ? ONE : ZERO;
    case 'add': return add(...x.t.map((t) => diff(t, v)));
    case 'mul': return add(...x.f.map((f, i) => mul(diff(f, v), ...x.f.filter((_, j) => j !== i))));
    case 'pow': {
      const { b, e } = x;
      if (freeOf(e, v)) return mul(e, pow(b, sub(e, ONE)), diff(b, v));
      if (freeOf(b, v)) return mul(x, fn('ln', b), diff(e, v));
      return mul(x, add(mul(diff(e, v), fn('ln', b)), mul(e, diff(b, v), pow(b, MINUS1))));
    }
    case 'fn': {
      const u = x.a, du = diff(u, v);
      const r: Record<string, () => Ex> = {
        sin: () => fn('cos', u), cos: () => neg(fn('sin', u)), tan: () => add(ONE, pow(fn('tan', u), N(2))),
        asin: () => pow(sub(ONE, pow(u, N(2))), N(new Q(-1n, 2n))), acos: () => neg(pow(sub(ONE, pow(u, N(2))), N(new Q(-1n, 2n)))),
        atan: () => pow(add(ONE, pow(u, N(2))), MINUS1), sinh: () => fn('cosh', u), cosh: () => fn('sinh', u), tanh: () => sub(ONE, pow(fn('tanh', u), N(2))),
        ln: () => pow(u, MINUS1), abs: () => div(u, fn('abs', u)),
      };
      return mul(r[x.name](), du);
    }
  }
}

// ---------- Integrals ----------
export type IntegralResult = { ok: true; F: Ex; method: string } | { ok: false; reason: string };
const lnAbs = (u: Ex) => fn('ln', fn('abs', u));
/** u = a·v + b with a ≠ 0 free of v: returns [a, b]. */
function linear(u: Ex, v: string): [Ex, Ex] | null {
  const p = toPolyGeneral(u, v);
  if (!p || p.length !== 2) return null;
  return [p[1], p[0]];
}
/** Coefficients (expressions free of v) of a polynomial in v, or null. */
function toPolyGeneral(x: Ex, v: string): Ex[] | null {
  if (freeOf(x, v)) return [x];
  const ex = expand(x);
  const terms = ex.k === 'add' ? ex.t : [ex];
  const out: Ex[] = [];
  for (const t of terms) {
    const fs = t.k === 'mul' ? t.f : [t];
    let k = 0; const rest: Ex[] = [];
    for (const f of fs) {
      if (f.k === 'sym' && f.name === v) k += 1;
      else if (f.k === 'pow' && f.b.k === 'sym' && f.b.name === v && isInt(f.e) && (f.e as any).q.sign() > 0) k += Number((f.e as any).q.n);
      else if (freeOf(f, v)) rest.push(f);
      else return null;
    }
    while (out.length <= k) out.push(ZERO);
    out[k] = add(out[k], mul(...rest));
  }
  return out;
}

/** Antiderivative of F(u) where u is linear in v: table lookup. */
function linearTable(g: Ex, v: string): Ex | null {
  const X = S(v);
  if (g.k === 'sym' && g.name === v) return mul(HALF, pow(X, N(2)));
  if (g.k === 'pow') {
    const { b, e } = g;
    // 1/cos²(u), 1/sin²(u), sin²(u), cos²(u)
    if (isNum(e) && b.k === 'fn' && (b.name === 'cos' || b.name === 'sin')) {
      const L = linear(b.a, v);
      if (!L) return null;
      const [a] = L, u = b.a;
      if (e.q.eq(new Q(-2n))) return b.name === 'cos' ? div(fn('tan', u), a) : neg(div(fn('cos', u), mul(a, fn('sin', u))));
      if (e.q.eq(new Q(2n))) { const half = div(mul(HALF, u), a), s2 = div(fn('sin', mul(N(2), u)), mul(N(4), a)); return b.name === 'sin' ? sub(half, s2) : add(half, s2); }
    }
    if (freeOf(e, v)) {
      const L = linear(b, v);
      if (!L) return null;
      const [a] = L;
      if (isNum(e) && e.q.eq(Q.ONE.neg())) return div(lnAbs(b), a);
      return div(pow(b, add(e, ONE)), mul(a, add(e, ONE)));
    }
    if (freeOf(b, v)) {
      const L = linear(e, v);
      if (!L) return null;
      const [a] = L;
      return same(b, E) ? div(g, a) : div(g, mul(a, fn('ln', b)));
    }
    return null;
  }
  if (g.k === 'fn') {
    const L = linear(g.a, v);
    if (!L) return null;
    const [a] = L, u = g.a;
    const T: Record<string, () => Ex> = {
      sin: () => neg(fn('cos', u)), cos: () => fn('sin', u), tan: () => neg(lnAbs(fn('cos', u))),
      sinh: () => fn('cosh', u), cosh: () => fn('sinh', u), tanh: () => fn('ln', fn('cosh', u)),
      ln: () => sub(mul(u, fn('ln', u)), u),
      atan: () => sub(mul(u, fn('atan', u)), mul(HALF, fn('ln', add(ONE, pow(u, N(2)))))),
      asin: () => add(mul(u, fn('asin', u)), pow(sub(ONE, pow(u, N(2))), HALF)),
      acos: () => sub(mul(u, fn('acos', u)), pow(sub(ONE, pow(u, N(2))), HALF)),
    };
    return T[g.name] ? div(T[g.name](), a) : null;
  }
  return null;
}

/** Partial fractions and integration of a rational function n/d in v. */
function integrateRational(n: Poly, d: Poly, v: string): Ex | null {
  const X = S(v);
  ({ n, d } = cancel(n, d));
  const [qq, r] = pdivmod(n, d);
  let F = integratePoly(qq, v);
  if (!r.length) return F;
  const fd = factorPoly(d);
  if (!fd.complete) return null;
  if (fd.factors.some((f) => deg(f.p) > 2 || (deg(f.p) === 2 && f.m > 1))) return null;
  // Unknowns: A_ij for (linear)^j, and B, C for each quadratic.
  type Part = { f: Poly; j: number; quad: boolean };
  const parts: Part[] = [];
  for (const f of fd.factors) for (let j = 1; j <= f.m; j++) parts.push({ f: f.p, j, quad: deg(f.p) === 2 });
  const D = pscale(d, Q.ONE.div(fd.c)); // the product of the factors
  const cols: Poly[] = [];
  for (const p of parts) {
    const rest = pdivmod(D, ppow(p.f, p.j))[0];
    cols.push(rest);
    if (p.quad) cols.push(pmul(rest, [Q.ZERO, Q.ONE]));
  }
  const nU = cols.length, rr = pscale(r, Q.ONE.div(fd.c));
  const A = Array.from({ length: nU }, (_, i) => cols.map((c) => c[i] ?? Q.ZERO));
  const B = Array.from({ length: nU }, (_, i) => [rr[i] ?? Q.ZERO]);
  const { sol } = solveLinear(A, B);
  if (sol.kind !== 'unique') return null;
  const coef = sol.x.map((row) => row[0]);
  let k = 0;
  for (const p of parts) {
    const fEx = polyEx(p.f, v);
    if (!p.quad) {
      const A_ = coef[k++];
      if (A_.isZero()) continue;
      const a = p.f[1];
      F = add(F, p.j === 1 ? mul(N(A_.div(a)), lnAbs(fEx)) : mul(N(A_.div(a.mul(new Q(BigInt(1 - p.j))))), pow(fEx, N(1 - p.j))));
    } else {
      const C_ = coef[k++], B_ = coef[k++];
      const [c0, b1, a2] = p.f;
      // (B x + C)/(a x² + b x + c) = (B/2a)(2a x + b)/Q + (C − B b/2a)/Q
      const half = B_.div(a2.mul(new Q(2n)));
      if (!half.isZero()) F = add(F, mul(N(half), fn('ln', fEx)));
      const K = C_.sub(half.mul(b1));
      if (!K.isZero()) {
        const negD = new Q(4n).mul(a2).mul(c0).sub(b1.mul(b1)); // > 0 for an irreducible quadratic
        const s = pow(N(negD), HALF);
        F = add(F, mul(N(K.mul(new Q(2n))), pow(s, MINUS1), fn('atan', div(add(mul(N(a2.mul(new Q(2n))), X), N(b1)), s))));
      }
    }
  }
  return F;
}
function integratePoly(p: Poly, v: string): Ex {
  return add(...p.map((c, i) => mul(N(c.div(new Q(BigInt(i + 1)))), pow(S(v), N(i + 1)))));
}

function integrateInner(f: Ex, v: string, depth: number): { F: Ex; method: string } | null {
  if (depth > 6) return null;
  tick();
  const X = S(v);
  if (freeOf(f, v)) return { F: mul(f, X), method: 'constant' };
  if (f.k === 'add') {
    const parts: Ex[] = [], methods = new Set<string>();
    for (const t of f.t) { const r = integrateInner(t, v, depth + 1); if (!r) return null; parts.push(r.F); methods.add(r.method); }
    return { F: add(...parts), method: [...methods].join(', ') };
  }
  // Constant factors out.
  const fs = f.k === 'mul' ? f.f : [f];
  const cst = fs.filter((x) => freeOf(x, v)), g = mul(...fs.filter((x) => !freeOf(x, v)));
  if (cst.length) { const r = integrateInner(g, v, depth + 1); return r ? { F: mul(...cst, r.F), method: r.method } : null; }
  // Polynomials and rational functions.
  const rat = toRational(g, v);
  if (rat) {
    if (deg(rat.d) === 0) return { F: integratePoly(pscale(rat.n, Q.ONE.div(rat.d[0])), v), method: 'power rule' };
    const lin = linearTable(g, v);
    if (lin) return { F: lin, method: 'standard form' };
    const r = integrateRational(rat.n, rat.d, v);
    if (r) return { F: r, method: 'partial fractions' };
  }
  const lin = linearTable(g, v);
  if (lin) return { F: lin, method: 'standard form' };
  const gf = g.k === 'mul' ? g.f : [g];
  // Substitution: a factor h(u) times a constant multiple of u′.
  for (const F of gf) {
    const cands: { u: Ex; outer: (t: Ex) => Ex }[] = [];
    if (F.k === 'fn') cands.push({ u: F.a, outer: (t) => fn(F.name, t) });
    if (F.k === 'pow' && freeOf(F.e, v)) cands.push({ u: F.b, outer: (t) => pow(t, F.e) });
    if (F.k === 'pow' && freeOf(F.b, v)) cands.push({ u: F.e, outer: (t) => pow(F.b, t) });
    if (F.k === 'pow' && F.b.k === 'fn' && freeOf(F.e, v)) cands.push({ u: F.b.a, outer: (t) => pow(fn((F.b as any).name, t), F.e) });
    if (F.k === 'fn' || F.k === 'pow' || F.k === 'add') cands.push({ u: F, outer: (t) => t });
    for (const { u, outer } of cands) {
      if (u.k === 'sym' || linear(u, v)) continue;
      const du = diff(u, v);
      if (isNum(du) && du.q.isZero()) continue;
      const others = gf.filter((x) => x !== F);
      let ratio = div(mul(...others), du);
      if (!freeOf(ratio, v)) ratio = simplify(ratio);
      if (!freeOf(ratio, v)) continue;
      const T = 'τ';
      const inner = integrateInner(outer(S(T)), T, depth + 1);
      if (!inner) continue;
      return { F: mul(ratio, subst(inner.F, T, u)), method: 'substitution' };
    }
  }
  // Integration by parts: polynomial × (exp, sin, cos, sinh, cosh of a linear argument), polynomial × ln or atan.
  const polyF = gf.filter((x) => toPoly(x, v)), other = gf.filter((x) => !toPoly(x, v));
  if (other.length === 1) {
    const P = mul(...polyF), h = other[0];
    const isLog = h.k === 'fn' && (h.name === 'ln' || h.name === 'atan' || h.name === 'asin' || h.name === 'acos');
    if (polyF.length && !isLog) {
      // Tabular: ∫P h = Σ (−1)^k P^(k) H_(k+1)
      const Pp = toPoly(P, v)!;
      let H = h, dP = P, sum: Ex = ZERO, sign = 1;
      for (let k = 0; k <= Pp.length; k++) {
        const Hn = linearTable(H, v);
        if (!Hn) return null;
        sum = add(sum, mul(N(sign), dP, Hn));
        dP = diff(dP, v); sign = -sign; H = Hn;
        if (isNum(dP) && dP.q.isZero()) return { F: sum, method: 'integration by parts' };
        // H must stay a single standard form to continue.
        if (!(H.k === 'fn' || H.k === 'pow' || H.k === 'mul')) return null;
        const hf = H.k === 'mul' ? H.f : [H];
        const hc = hf.filter((x) => freeOf(x, v)), hv = hf.filter((x) => !freeOf(x, v));
        if (hv.length !== 1) return null;
        H = hv[0]; dP = mul(dP, ...hc);
      }
      return null;
    }
    if (isLog && linear(h.a, v)) {
      // ∫P·L = Lint(P)·L − ∫ Lint(P)·L′
      const IP = polyF.length ? integrateInner(P, v, depth + 1) : { F: X, method: '' };
      if (!IP) return null;
      const rest = integrateInner(simplify(mul(IP.F, diff(h, v))), v, depth + 1);
      if (!rest) return null;
      return { F: sub(mul(IP.F, h), rest.F), method: 'integration by parts' };
    }
  }
  // e^(a v) · sin(b v) or cos(b v)
  if (gf.length === 2) {
    const ex = gf.find((x) => x.k === 'pow' && same(x.b, E)) as any, tr = gf.find((x) => x.k === 'fn' && (x.name === 'sin' || x.name === 'cos')) as any;
    if (ex && tr) {
      const L1 = linear(ex.e, v), L2 = linear(tr.a, v);
      if (L1 && L2) {
        const [a] = L1, [b] = L2, den = add(pow(a, N(2)), pow(b, N(2)));
        const s = fn('sin', tr.a), c = fn('cos', tr.a);
        const body = tr.name === 'sin' ? sub(mul(a, s), mul(b, c)) : add(mul(a, c), mul(b, s));
        return { F: div(mul(ex, body), den), method: 'standard form (e^ax sin bx)' };
      }
    }
  }
  return null;
}

/** Points where two expressions in v agree numerically (a check, not a proof). */
export function agree(a: Ex, b: Ex, v: string, others: Record<string, number> = {}, mode: 'equal' | 'constant' = 'equal'): boolean {
  const xs = [0.37, 0.71, 1.29, 1.83, 2.47, -0.53, -1.31, 3.1];
  let n = 0, c0: number | null = null;
  for (const x of xs) {
    const env = { ...others, [v]: x };
    const va = evaluate(a, env), vb = evaluate(b, env);
    if (!Number.isFinite(va) || !Number.isFinite(vb)) continue;
    const d = va - vb, scale = 1 + Math.abs(va) + Math.abs(vb);
    if (mode === 'equal') { if (Math.abs(d) > 1e-8 * scale) return false; }
    else { if (c0 === null) c0 = d; else if (Math.abs(d - c0) > 1e-8 * scale) return false; }
    n++;
  }
  return n >= 3;
}

export function integrate(f: Ex, v: string): IntegralResult {
  budget = 0;
  let r: { F: Ex; method: string } | null = null;
  try { r = integrateInner(f, v, 0); } catch (e) { if (e instanceof CasError && /too big/.test(e.message)) return { ok: false, reason: e.message }; throw e; }
  if (!r) return { ok: false, reason: 'This is outside what this lite tool can integrate: polynomials, rational functions whose bottom splits into fraction roots and simple quadratics, standard forms of a linear argument (sin(3x + 1), e^(2x), 1/(4x − 1) …), simple substitutions (2x·cos(x²)) and integration by parts (x²·e^x, x·ln(x)). It may have no answer in elementary functions at all, like e^(x²).' };
  let F = simplify(r.F);
  // Honest check: the derivative of the answer must give back the integrand.
  const others: Record<string, number> = {};
  for (const s of symbols(f)) if (s !== v) others[s] = 1.37 + s.charCodeAt(0) / 100;
  if (!agree(diff(F, v), f, v, others)) {
    if (agree(diff(r.F, v), f, v, others)) F = r.F;
    else return { ok: false, reason: 'A candidate answer did not pass the check (its derivative did not give back the expression), so no answer is shown.' };
  }
  return { ok: true, F, method: r.method };
}

/** ∫ from a to b, exact when the antiderivative can be evaluated exactly, with a numerical check. */
export function definite(f: Ex, v: string, a: Ex, b: Ex): { ok: true; exact: Ex; value: number; F: Ex } | { ok: false; reason: string } {
  const fa = evaluate(a, {}), fb = evaluate(b, {});
  if (!Number.isFinite(fa) || !Number.isFinite(fb)) return { ok: false, reason: 'The limits must be numbers (π, e and fractions are fine).' };
  // Improper? Sample the integrand across [a, b].
  for (let i = 0; i <= 400; i++) {
    const x = fa + ((fb - fa) * i) / 400;
    const y = evaluate(f, { [v]: x });
    if (!Number.isFinite(y)) return { ok: false, reason: `The expression is undefined at ${v} ≈ ${+x.toPrecision(4)}, inside the interval, so this is an improper integral; not worked out here.` };
  }
  const r = integrate(f, v);
  if (!r.ok) return r;
  const exact = simplify(sub(subst(r.F, v, b), subst(r.F, v, a)));
  const value = evaluate(exact, {});
  const num = simpson((x) => evaluate(f, { [v]: x }), fa, fb);
  if (!(Math.abs(value - num) <= 1e-6 * (1 + Math.abs(num)))) return { ok: false, reason: 'The exact answer did not match a numerical check, so it is not shown.' };
  return { ok: true, exact, value, F: r.F };
}
function simpson(f: (x: number) => number, a: number, b: number): number {
  const rec = (a: number, b: number, fa: number, fm: number, fb: number, whole: number, depth: number): number => {
    const m = (a + b) / 2, lm = (a + m) / 2, rm = (m + b) / 2, flm = f(lm), frm = f(rm);
    const left = ((m - a) / 6) * (fa + 4 * flm + fm), right = ((b - m) / 6) * (fm + 4 * frm + fb);
    if (depth > 40 || Math.abs(left + right - whole) <= 1e-12 * (1 + Math.abs(whole))) return left + right + (left + right - whole) / 15;
    return rec(a, m, fa, flm, fm, left, depth + 1) + rec(m, b, fm, frm, fb, right, depth + 1);
  };
  const fa = f(a), fb = f(b), fm = f((a + b) / 2);
  return rec(a, b, fa, fm, fb, ((b - a) / 6) * (fa + 4 * fm + fb), 0);
}

// ---------- Factor (for display) ----------
export type FactorResult = { text: Record<Style, string>; complete: boolean; multivariate: boolean; list?: Factored; den?: Factored };
function polyShow(p: Poly, v: string, st: Style) { return show(polyEx(p, v), st); }
function factoredText(fz: Factored, v: string, st: Style, denom?: Factored): string {
  const one = (f: Factored) => {
    const mono = (p: Poly) => (p.length === 2 && p[0].isZero() ? 0 : 1);
    const parts = f.factors.slice().sort((a, b) => deg(a.p) - deg(b.p) || mono(a.p) - mono(b.p)).map(({ p, m }) => {
      const body = polyShow(p, v, st);
      const needs = deg(p) > 0 && (p.filter((x) => !x.isZero()).length > 1 || !p[p.length - 1].isOne());
      const b = f.factors.length + (f.c.isOne() || f.c.eq(Q.ONE.neg()) ? 0 : 1) > 1 || m > 1 ? (needs ? (st === 'latex' ? `\\left(${body}\\right)` : `(${body})`) : body) : body;
      if (m === 1) return b;
      return st === 'python' ? `${needs ? b : body}**${m}` : st === 'latex' ? `${b}^{${m}}` : b + supInt(BigInt(m));
    });
    return parts;
  };
  const top = one(fz), bot = denom ? one(denom) : [];
  const c = denom ? fz.c.div(denom.c) : fz.c;
  const join = (xs: string[]) => xs.join(st === 'python' ? '*' : st === 'latex' ? ' ' : '');
  let coefS = '', sign = '';
  if (c.sign() < 0) sign = st === 'pretty' ? '−' : '-';
  const ca = c.abs();
  const numCoef = ca.n === 1n ? '' : ca.n.toString(), denCoef = ca.d === 1n ? '' : ca.d.toString();
  coefS = numCoef;
  let topS = top.length ? (coefS ? coefS + (st === 'python' ? '*' : st === 'latex' ? ' ' : '') : '') + join(top) : coefS || '1';
  const botParts = [...(denCoef ? [denCoef] : []), ...bot];
  if (!botParts.length) return sign + topS;
  const botS = join(botParts);
  if (st === 'latex') return `${sign}\\frac{${topS}}{${botS}}`;
  const wrapBot = botParts.length > 1 || (bot.length === 1 && !bot[0].startsWith('(') && /[ +−-]/.test(bot[0]));
  const wrapTop = top.length === 1 && !top[0].startsWith('(') && /[ +−-]/.test(top[0]) && !coefS;
  return `${sign}${wrapTop ? `(${topS})` : topS}/${wrapBot ? `(${botS})` : botS}`;
}
/** Factor: full factorisation over the integers for one variable (polynomial or fraction of polynomials); a common factor only for several variables. */
export function factor(x: Ex): FactorResult {
  budget = 0;
  const vars = [...symbols(x)];
  if (vars.length <= 1) {
    const v = vars[0] ?? 'x';
    const r = toRational(x, v);
    if (!r) throw new CasError('Factor works on polynomials (and fractions of polynomials), like x^3 − 2x^2 − x + 2.');
    const c = cancel(r.n, r.d);
    const fn_ = factorPoly(c.n), fd = deg(c.d) > 0 ? factorPoly(c.d) : undefined;
    if (!fd && c.d.length) fn_.c = fn_.c.div(c.d[0]);
    const text = { pretty: factoredText(fn_, v, 'pretty', fd), python: factoredText(fn_, v, 'python', fd), latex: factoredText(fn_, v, 'latex', fd) };
    return { text, complete: fn_.complete && (fd?.complete ?? true), multivariate: false, list: fn_, den: fd };
  }
  // Several variables: pull out the common numeric factor and the lowest power of each variable.
  const ex = expand(x);
  const terms = ex.k === 'add' ? ex.t : [ex];
  if (terms.length < 2) return { text: { pretty: show(ex), python: show(ex, 'python'), latex: show(ex, 'latex') }, complete: true, multivariate: true };
  const mins: Record<string, Q> = {};
  let g = 0n, l = 1n;
  for (const v of vars) {
    let lo: Q | null = null;
    for (const t of terms) {
      const fs = t.k === 'mul' ? t.f : [t];
      let e = Q.ZERO;
      for (const f of fs) { if (f.k === 'sym' && f.name === v) e = e.add(Q.ONE); else if (f.k === 'pow' && f.b.k === 'sym' && f.b.name === v && isNum(f.e)) e = e.add(f.e.q); }
      lo = lo === null || e.cmp(lo) < 0 ? e : lo;
    }
    if (lo && lo.sign() > 0) mins[v] = lo;
  }
  for (const t of terms) { const [c] = splitCoef(t); g = bgcd(g, c.n); l = (l / bgcd(l, c.d)) * c.d; }
  const lead = splitCoef(ordered(terms)[0])[0];
  let cf = new Q(g, l); if (lead.sign() < 0) cf = cf.neg();
  const common = mul(N(cf), ...Object.entries(mins).map(([v, e]) => pow(S(v), N(e))));
  const rest = expand(div(ex, common));
  const out = (st: Style) => {
    const cs = show(common, st), rs = show(rest, st);
    if (isNum(common) && common.q.isOne()) return rs;
    const neg_ = cs.startsWith('−') || cs.startsWith('-');
    const csA = neg_ ? cs.slice(1) : cs;
    const r = rest.k === 'add' ? (st === 'latex' ? `\\left(${rs}\\right)` : `(${rs})`) : rs;
    return (neg_ ? cs[0] : '') + csA + (st === 'python' ? '*' : st === 'latex' ? ' ' : '') + r;
  };
  return { text: { pretty: out('pretty'), python: out('python'), latex: out('latex') }, complete: false, multivariate: true };
}
