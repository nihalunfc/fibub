// Derivative with steps for school functions: the rule used at every node of the expression (sum, constant
// multiple, power, product, quotient, chain, exponential, logarithm, trig, inverse trig, logarithmic
// differentiation), worked from the inside out. Builds on the small CAS in cas.ts (parse, show, simplify).
// Plain TypeScript, no DOM. Checked against sympy 1.14 in tests/sci-tools/derivative-steps.mjs.
import { parse as casParse, show, ordered, simplify, diff, add, mul, pow, fn, neg, sub, N, ONE, ZERO, MINUS1, E, freeOf, same, symbols, evaluate, CasError, type Ex } from './cas.ts';

export type Step = { rule: string; text: string; depth: number };
export type Result = { f: Ex; d: Ex; steps: Step[]; text: string; dText: string };

const sh = (x: Ex) => show(x);
const br = (x: Ex) => { const s = sh(x); return x.k === 'add' || s.startsWith('−') || (x.k === 'mul' && s.includes(' ')) ? `(${s})` : s; };
/** Put brackets round a typed-out inside only when it needs them. */
const p = (u: string) => (/^[\w.π]+$/.test(u) ? u : `(${u})`);
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
/** base^n written with a superscript when n is a whole number. */
const powStr = (b: string, n: Ex) => { const s = sh(n); if (s === '1') return b; if (/^−?\d+$/.test(s)) return b + s.replace('−', '⁻').replace(/\d/g, (d) => SUP[+d]); return `${b}^(${s})`; };
/** "= r" unless the line already ends with exactly that. */
const eq = (left: string, r: Ex) => (left.endsWith(` ${sh(r)}`) || left.endsWith(`= ${sh(r)}`) ? left : `${left} = ${sh(r)}`);
const D = (x: Ex) => `d/dx[${sh(x)}]`;
const isNumEx = (x: Ex) => x.k === 'num';
const negPow = (x: Ex) => x.k === 'pow' && isNumEx(x.e) && (x.e as any).q.sign() < 0;
const tidy = (x: Ex) => { try { return simplify(x); } catch { return x; } };

/** Read a school function of x. Throws a friendly Error. */
export function readF(src: string): Ex {
  const t = src.replace(/^\s*(y|f\s*\(\s*x\s*\))\s*=/i, '').trim();
  if (!t) throw new Error('Type a function of x, such as x^2 sin(x).');
  let e: Ex;
  try { e = casParse(t); } catch (err) { throw new Error((err as Error).message); }
  const bad = [...symbols(e)].filter((s) => s !== 'x' && s !== 'e' && s !== 'π');
  if (bad.length) throw new Error(`Use only x in the function (found ${bad.join(', ')}).`);
  return e;
}

const OUTER: Record<string, { rule: string; d: (u: Ex) => Ex; text: (u: string) => string }> = {
  sin: { rule: 'd/dx sin x = cos x', d: (u) => fn('cos', u), text: (u) => `cos(${u})` },
  cos: { rule: 'd/dx cos x = −sin x', d: (u) => neg(fn('sin', u)), text: (u) => `−sin(${u})` },
  tan: { rule: 'd/dx tan x = sec² x', d: (u) => pow(fn('cos', u), N(-2)), text: (u) => `sec²(${u})` },
  ln: { rule: 'd/dx ln x = 1/x', d: (u) => pow(u, MINUS1), text: (u) => `1/${p(u)}` },
  asin: { rule: 'd/dx sin⁻¹ x = 1/√(1 − x²)', d: (u) => pow(sub(ONE, pow(u, N(2))), mul(N(-1), pow(N(2), MINUS1))), text: (u) => `1/√(1 − ${p(u)}²)` },
  acos: { rule: 'd/dx cos⁻¹ x = −1/√(1 − x²)', d: (u) => neg(pow(sub(ONE, pow(u, N(2))), mul(N(-1), pow(N(2), MINUS1)))), text: (u) => `−1/√(1 − ${p(u)}²)` },
  atan: { rule: 'd/dx tan⁻¹ x = 1/(1 + x²)', d: (u) => pow(add(ONE, pow(u, N(2))), MINUS1), text: (u) => `1/(1 + ${p(u)}²)` },
  abs: { rule: 'd/dx |x| = x/|x| (x ≠ 0)', d: (u) => mul(u, pow(fn('abs', u), MINUS1)), text: (u) => `(${u})/|${u}|` },
};

function walk(e: Ex, v: string, out: Step[], depth: number): Ex {
  if (freeOf(e, v)) return ZERO;
  if (e.k === 'sym') return ONE;
  const push = (rule: string, text: string) => out.push({ rule, text, depth });
  const inner = (x: Ex) => walk(x, v, out, depth + 1);
  switch (e.k) {
    case 'add': {
      const ds = e.t.map(inner), r = tidy(add(...ds));
      push('Sum rule', `${D(e)} = ${ordered(e.t).map((t) => D(t)).join(' + ')} = ${sh(r)}`);
      return r;
    }
    case 'mul': {
      const cs = e.f.filter((f) => freeOf(f, v)), vs = e.f.filter((f) => !freeOf(f, v));
      const c = mul(...cs), den = vs.filter(negPow), num = vs.filter((f) => !negPow(f));
      if (den.length && num.length) {
        const Nn = mul(...num), Dd = mul(...den.map((f) => pow((f as any).b, neg((f as any).e)))), dN = inner(Nn), dD = inner(Dd);
        const r = tidy(mul(c, sub(mul(Dd, dN), mul(Nn, dD)), pow(Dd, N(-2))));
        push('Quotient rule', `d/dx[u/v] = (v·u′ − u·v′)/v² with u = ${sh(Nn)}, v = ${sh(Dd)}: ${cs.length ? `${sh(c)} × ` : ''}(${br(Dd)}·${br(dN)} − ${br(Nn)}·${br(dD)})/${br(Dd)}² = ${sh(r)}`);
        return r;
      }
      if (vs.length === 1) {
        const dv = inner(vs[0]), r = tidy(mul(c, dv));
        push('Constant multiple', vs[0].k === 'sym' ? `${D(e)} = ${sh(c)} × 1 = ${sh(r)}` : `${D(e)} = ${sh(c)} × ${D(vs[0])} = ${sh(c)} × ${br(dv)} = ${sh(r)}`);
        return r;
      }
      const u = vs[0], w = mul(...vs.slice(1)), du = inner(u), dw = inner(w);
      const r = tidy(mul(c, add(mul(du, w), mul(u, dw))));
      push('Product rule', `d/dx[u·v] = u′v + uv′ with u = ${sh(u)}, v = ${sh(w)}: ${cs.length ? `${sh(c)} × ` : ''}(${br(du)}·${br(w)} + ${br(u)}·${br(dw)}) = ${sh(r)}`);
      return r;
    }
    case 'pow': {
      const { b, e: x } = e;
      if (freeOf(x, v)) {
        const n1 = sub(x, ONE);
        if (b.k === 'sym') {
          const r = tidy(mul(x, pow(b, n1)));
          push('Power rule', eq(`d/dx xⁿ = n xⁿ⁻¹: ${D(e)} = ${br(x)}·${powStr('x', n1)}`, r));
          return r;
        }
        const db = inner(b), r = tidy(mul(x, pow(b, n1), db));
        push('Chain rule (power)', `d/dx uⁿ = n uⁿ⁻¹ · u′ with u = ${sh(b)}: ${br(x)}·${powStr(`(${sh(b)})`, n1)} · ${br(db)} = ${sh(r)}`);
        return r;
      }
      if (freeOf(b, v)) {
        const isE = same(b, E), dx = x.k === 'sym' ? ONE : inner(x), chain = x.k !== 'sym';
        const r = tidy(isE ? mul(e, dx) : mul(e, fn('ln', b), dx));
        push(isE ? (chain ? 'Exponential + chain rule' : 'Exponential rule') : chain ? 'aˣ rule + chain rule' : 'aˣ rule',
          isE ? eq(`d/dx eᵘ = eᵘ · u′: ${D(e)} = ${sh(e)}${chain ? ` · ${br(dx)}` : ''}`, r) : `d/dx aᵘ = aᵘ ln a · u′: ${D(e)} = ${sh(e)} · ln ${sh(b)}${chain ? ` · ${br(dx)}` : ''} = ${sh(r)}`);
        return r;
      }
      // Variable base and exponent: logarithmic differentiation.
      const L = mul(x, fn('ln', b)), dL = inner(L), r = tidy(mul(e, dL));
      push('Logarithmic differentiation', `y = ${sh(e)}, so ln y = ${sh(L)}. Differentiate: (1/y)·dy/dx = ${sh(dL)}, so dy/dx = y × (${sh(dL)}) = ${sh(r)}`);
      return r;
    }
    case 'fn': {
      const o = OUTER[e.name];
      if (!o) { const r = tidy(diff(e, v)); push('Standard derivative', `${D(e)} = ${sh(r)}`); return r; }
      const u = e.a, chain = u.k !== 'sym', du = chain ? inner(u) : ONE;
      const r = tidy(mul(o.d(u), du));
      push(chain ? `${o.rule} + chain rule` : o.rule, eq(`${D(e)} = ${o.text(sh(u))}${chain ? ` · ${br(du)}` : ''}`, r));
      return r;
    }
    default: return ZERO;
  }
}

/** Differentiate with steps. The steps run from the inside out; the last step is the whole function. */
export function differentiate(src: string | Ex): Result {
  const f = typeof src === 'string' ? readF(src) : src;
  const steps: Step[] = [];
  let d: Ex;
  try { d = walk(f, 'x', steps, 0); } catch (e) { if (e instanceof CasError) throw new Error(e.message); throw e; }
  if (!steps.length) steps.push({ rule: freeOf(f, 'x') ? 'Constant rule' : 'd/dx x = 1', text: `${D(f)} = ${sh(d)}`, depth: 0 });
  return { f, d, steps, text: sh(f), dText: sh(d) };
}

/** The value of f or f′ at a number (NaN where undefined). */
export const at = (x: Ex, a: number) => evaluate(x, { x: a });
/** Plain cas derivative, used to double-check the stepwise one. */
export const plain = (f: Ex) => diff(f, 'x');

export const EXAMPLES: { cls: '11' | '12'; src: string; label: string }[] = [
  { cls: '11', src: '3x^4 - 5x^2 + 7', label: '3x⁴ − 5x² + 7' },
  { cls: '11', src: 'x^2 sin(x)', label: 'x² sin x' },
  { cls: '11', src: '(x + 1)/(x - 1)', label: '(x + 1)/(x − 1)' },
  { cls: '11', src: 'sqrt(x) + 1/x', label: '√x + 1/x' },
  { cls: '11', src: 'sin(x)/x', label: 'sin x / x' },
  { cls: '11', src: 'x cos(x)', label: 'x cos x' },
  { cls: '12', src: 'sin(x^2)', label: 'sin(x²)' },
  { cls: '12', src: 'e^(3x) cos(x)', label: 'e³ˣ cos x' },
  { cls: '12', src: 'ln(x^2 + 1)', label: 'ln(x² + 1)' },
  { cls: '12', src: '(2x + 1)^5', label: '(2x + 1)⁵' },
  { cls: '12', src: 'atan(x^2)', label: 'tan⁻¹(x²)' },
  { cls: '12', src: 'x^x', label: 'xˣ' },
  { cls: '12', src: 'sqrt(1 + sin(x))', label: '√(1 + sin x)' },
  { cls: '12', src: 'tan(2x)', label: 'tan 2x' },
];
