// Integration technique coach for school integrals: looks at the integrand, says which method fits and why
// (power rule, standard form, substitution, integration by parts with ILATE, partial fractions, the e^ax sin bx
// loop), and writes the steps. The answer itself comes from the small CAS in cas.ts and is checked by
// differentiating it back. Plain TypeScript, no DOM. Checked against sympy 1.14 in
// tests/sci-tools/integration-coach.mjs.
import { parse, show, ordered, simplify, diff, integrate, add, mul, div, pow, fn, N, S, ONE, E, freeOf, same, symbols, subst, agree, toPoly, toRational, polyEx, cancel, factorPoly, deg, evaluate, CasError, type Ex, type Poly } from './cas.ts';
import { Q, solve } from './matrix.ts';

export type Method = 'constant' | 'power' | 'standard' | 'substitution' | 'parts' | 'partial' | 'loop' | 'sum' | 'other' | 'none';
export type Coach = { f: Ex; method: Method; title: string; why: string; steps: string[]; F: Ex | null; checked: boolean; parts?: Coach[] };

const sh = (x: Ex) => show(x);
const br = (x: Ex) => { const s = sh(x); return x.k === 'add' || s.startsWith('−') ? `(${s})` : s; };
const tidy = (x: Ex) => { try { return simplify(x); } catch { return x; } };
const X = 'x';

/** Read an integrand in x. Throws a friendly Error. */
export function readIntegrand(src: string): Ex {
  const t = src.replace(/^\s*∫/, '').replace(/\s*d\s*x\s*$/i, '').trim();
  if (!t) throw new Error('Type something to integrate, such as x e^x.');
  let e: Ex;
  try { e = parse(t); } catch (err) { throw new Error((err as Error).message); }
  const bad = [...symbols(e)].filter((s) => s !== 'x' && s !== 'e' && s !== 'π');
  if (bad.length) throw new Error(`Use only x in the integrand (found ${bad.join(', ')}).`);
  return e;
}

const isLinear = (u: Ex) => { const p = toPoly(u, X); return !!p && deg(p) === 1; };
const kind = (h: Ex): 'I' | 'L' | 'A' | 'T' | 'E' | '?' => {
  if (toPoly(h, X)) return 'A';
  if (h.k === 'fn' && ['asin', 'acos', 'atan'].includes(h.name)) return 'I';
  if (h.k === 'fn' && h.name === 'ln') return 'L';
  if (h.k === 'fn' && ['sin', 'cos'].includes(h.name)) return 'T';
  if (h.k === 'pow' && same(h.b, E)) return 'E';
  if (h.k === 'pow' && freeOf(h.b, X)) return 'E';
  return '?';
};
const KIND_NAME = { I: 'inverse trig', L: 'logarithm', A: 'algebraic (a power of x)', T: 'trig', E: 'exponential', '?': 'other' };

function antideriv(f: Ex): Ex | null { const r = integrate(f, X); return r.ok ? r.F : null; }
const verify = (f: Ex, F: Ex | null) => !!F && agree(diff(F, X), f, X);

// ---------- Polynomial helpers (coefficients low to high) ----------
const ptrim = (p: Poly) => { const r = p.slice(); while (r.length && r[r.length - 1].isZero()) r.pop(); return r; };
function pmul(a: Poly, b: Poly): Poly { const r = Array.from({ length: a.length + b.length - 1 }, () => Q.ZERO); a.forEach((x, i) => b.forEach((y, j) => { r[i + j] = r[i + j].add(x.mul(y)); })); return ptrim(r); }
function pdivmod(a: Poly, b: Poly): [Poly, Poly] {
  let r = ptrim(a); const B = ptrim(b), q: Q[] = Array.from({ length: Math.max(1, r.length - B.length + 1) }, () => Q.ZERO);
  while (r.length >= B.length && r.length) {
    const k = r.length - B.length, c = r[r.length - 1].div(B[B.length - 1]); q[k] = c;
    r = ptrim(r.map((x, i) => (i >= k && i - k < B.length ? x.sub(c.mul(B[i - k])) : x)));
  }
  return [ptrim(q), r];
}
const ppow = (p: Poly, n: number) => { let r: Poly = [Q.ONE]; for (let i = 0; i < n; i++) r = pmul(r, p); return r; };
const pex = (p: Poly) => polyEx(p, X);

export type PF = { quotient: Poly; terms: { num: Poly; den: Poly; power: number }[]; factors: { p: Poly; m: number }[]; c: Q } | null;
/** Partial fractions of n/d (one variable, rational coefficients) when d splits into linear factors (any power)
 * and irreducible quadratics (power 1). */
export function partialFractions(n: Poly, d: Poly): PF {
  const cz = cancel(n, d); n = cz.n; d = cz.d;
  if (deg(d) < 1) return null;
  const [quotient, r] = deg(n) >= deg(d) ? pdivmod(n, d) : [[] as Poly, ptrim(n)];
  const fac = factorPoly(d);
  if (!fac.complete || fac.factors.some((f) => deg(f.p) > 2 || (deg(f.p) === 2 && f.m > 1))) return null;
  const D0 = fac.factors.reduce((acc, f) => pmul(acc, ppow(f.p, f.m)), [Q.ONE] as Poly);
  // Unknowns: for each linear factor L^m: A_1..A_m over L^j; for each quadratic: (B x + C).
  const cols: { num: Poly; den: Poly; power: number; shift: number }[] = [];
  for (const f of fac.factors) {
    if (deg(f.p) === 1) for (let j = 1; j <= f.m; j++) cols.push({ num: pdivmod(D0, ppow(f.p, j))[0], den: f.p, power: j, shift: 0 });
    else { const base = pdivmod(D0, f.p)[0]; cols.push({ num: pmul(base, [Q.ZERO, Q.ONE]), den: f.p, power: 1, shift: 1 }, { num: base, den: f.p, power: 1, shift: 0 }); }
  }
  const size = deg(D0);
  const rhs = Array.from({ length: size }, (_, i) => [(r[i] ?? Q.ZERO).div(fac.c)]);
  const A = Array.from({ length: size }, (_, i) => cols.map((c) => c.num[i] ?? Q.ZERO));
  const { sol } = solve(A, rhs);
  if (sol.kind !== 'unique') return null;
  const coef = sol.x.map((row) => row[0]);
  const terms: { num: Poly; den: Poly; power: number }[] = [];
  for (let i = 0; i < cols.length; i++) {
    const c = cols[i];
    if (c.shift === 1) { terms.push({ num: ptrim([coef[i + 1], coef[i]]), den: c.den, power: 1 }); i++; }
    else terms.push({ num: ptrim([coef[i]]), den: c.den, power: c.power });
  }
  return { quotient, terms: terms.filter((t) => t.num.length), factors: fac.factors, c: fac.c };
}
const termEx = (t: { num: Poly; den: Poly; power: number }) => div(pex(t.num), pow(pex(t.den), N(t.power)));

// ---------- The coach ----------
function trySub(f: Ex, gf: Ex[]): Coach | null {
  for (const Fc of gf) {
    if (freeOf(Fc, X)) continue;
    const cands: { u: Ex; outer: (t: Ex) => Ex }[] = [];
    if (Fc.k === 'fn') cands.push({ u: Fc.a, outer: (t) => fn(Fc.name, t) });
    if (Fc.k === 'pow' && freeOf(Fc.e, X)) cands.push({ u: Fc.b, outer: (t) => pow(t, Fc.e) });
    if (Fc.k === 'pow' && freeOf(Fc.b, X)) cands.push({ u: Fc.e, outer: (t) => pow(Fc.b, t) });
    if (Fc.k === 'fn') cands.push({ u: Fc, outer: (t) => t });
    for (const { u, outer } of cands) {
      if (u.k === 'sym' || isLinear(u)) continue;
      const du = diff(u, X);
      if (du.k === 'num' && (du as any).q.isZero()) continue;
      let ratio = div(mul(...gf.filter((z) => z !== Fc)), du);
      if (!freeOf(ratio, X)) ratio = tidy(ratio);
      if (!freeOf(ratio, X)) continue;
      const T = 'u', inner = integrate(outer(S(T)), T);
      if (!inner.ok) continue;
      const F = tidy(subst(mul(ratio, inner.F), T, u)), r1 = sh(ratio) === '1';
      return { f, method: 'substitution', title: 'Substitution', why: `Inside it sits u = ${sh(u)}, and the rest is ${r1 ? 'exactly' : 'a constant times'} u′ = ${sh(du)}. So the whole thing is a function of u times du.`,
        steps: [`Let u = ${sh(u)}. Then du = ${br(du)} dx.`, `The integral becomes ${r1 ? '' : `${sh(ratio)} × `}∫ ${sh(outer(S(T)))} du.`, `∫ ${sh(outer(S(T)))} du = ${sh(inner.F)}.`, `Put u = ${sh(u)} back. Answer: ${sh(F)} + C`], F, checked: verify(f, F) };
    }
  }
  return null;
}

function coachOne(f: Ex, depth: number): Coach {
  const base = { f, steps: [] as string[] };
  if (freeOf(f, X)) { const F = mul(f, S(X)); return { ...base, method: 'constant', title: 'A constant', why: 'There is no x in it.', steps: [`∫ ${sh(f)} dx = ${sh(F)} + C`], F, checked: true }; }
  // Sum: one term at a time.
  if (f.k === 'add' && depth === 0) {
    const parts = ordered(f.t).map((t) => coachOne(t, depth + 1));
    const F = parts.every((p) => p.F) ? add(...parts.map((p) => p.F!)) : null;
    return { ...base, method: 'sum', title: 'Split into terms', why: 'The integral of a sum is the sum of the integrals, so each term gets its own method.', steps: parts.map((p) => `∫ ${sh(p.f)} dx: ${p.title.toLowerCase()} → ${p.F ? sh(p.F) : 'no school method'}`), F: F ? tidy(F) : null, checked: verify(f, F), parts };
  }
  // Constant factors come out.
  const fs = f.k === 'mul' ? f.f : [f], cs = fs.filter((x) => freeOf(x, X)), vs = fs.filter((x) => !freeOf(x, X));
  const c = mul(...cs), g = mul(...vs), pre = cs.length ? [`Take the constant ${sh(c)} outside: ${sh(c)} × ∫ ${sh(g)} dx.`] : [];
  const wrapF = (F: Ex | null) => (F ? tidy(mul(c, F)) : null);
  const out = (method: Method, title: string, why: string, steps: string[], Fg: Ex | null): Coach => { const F = wrapF(Fg); return { ...base, method, title, why, steps: [...pre, ...steps, ...(F ? [`Answer: ${sh(F)} + C`] : [])], F, checked: verify(f, F) }; };

  // Powers of x and polynomials.
  const poly = toPoly(g, X);
  if (poly) {
    const F = antideriv(g);
    return out('power', 'Power rule', 'It is a polynomial: ∫ xⁿ dx = xⁿ⁺¹/(n + 1) for each term.', [`∫ ${sh(g)} dx = ${F ? sh(F) : '?'}`], F);
  }
  if (g.k === 'pow' && g.b.k === 'sym' && freeOf(g.e, X)) {
    const n = g.e, isLn = n.k === 'num' && (n as any).q.eq(Q.of(-1));
    const F = isLn ? fn('ln', fn('abs', S(X))) : div(pow(S(X), add(n, ONE)), add(n, ONE));
    return out('power', 'Power rule', isLn ? '1/x is the one power the power rule cannot do: its integral is ln|x|.' : `xⁿ with n = ${sh(n)}: add 1 to the power and divide by the new power.`, [`∫ ${sh(g)} dx = ${sh(tidy(F))}`], F);
  }
  // Rational functions: partial fractions (or a standard form when the bottom is a single linear factor).
  const rat = toRational(g, X);
  if (rat && deg(rat.d) > 0) {
    const pf = partialFractions(rat.n, rat.d);
    const F = antideriv(g);
    if (pf && (pf.terms.length > 1 || pf.quotient.length || pf.factors.some((q) => q.m > 1))) {
      const steps: string[] = [];
      if (pf.quotient.length) steps.push(`The top's degree is not less than the bottom's, so divide first: quotient ${sh(pex(pf.quotient))}, then a proper fraction is left.`);
      const facText = pf.factors.map((q) => (q.m > 1 ? `(${sh(pex(q.p))})${'⁰¹²³⁴⁵⁶⁷⁸⁹'[q.m]}` : `(${sh(pex(q.p))})`)).join('');
      steps.push(`Factor the bottom: ${pf.c.isOne() ? '' : `${pf.c.toString()} × `}${facText}.`);
      steps.push(`Write it as partial fractions and match coefficients: ${[...(pf.quotient.length ? [sh(pex(pf.quotient))] : []), ...pf.terms.map((t) => sh(termEx(t)))].join(' + ').replace(/\+ −/g, '− ')}.`);
      for (const t of pf.terms) { const Ft = antideriv(termEx(t)); steps.push(`∫ ${sh(termEx(t))} dx = ${Ft ? sh(Ft) : '?'}`); }
      if (pf.quotient.length) steps.push(`∫ ${sh(pex(pf.quotient))} dx = ${sh(antideriv(pex(pf.quotient))!)}`);
      return out('partial', 'Partial fractions', 'It is a fraction of two polynomials whose bottom factorises, so split it into simple fractions that each integrate to a log (or an inverse tan, or a power).', steps, F);
    }
  }
  const gf = g.k === 'mul' ? g.f : [g];
  // A standard function of a linear inside.
  if (gf.length === 1 && ((g.k === 'fn' && isLinear(g.a)) || (g.k === 'pow' && freeOf(g.b, X) && isLinear(g.e)) || (g.k === 'pow' && freeOf(g.e, X) && isLinear(g.b)))) {
    const inner = g.k === 'fn' ? g.a : g.k === 'pow' && freeOf(g.b, X) ? g.e : (g as any).b as Ex, a = diff(inner, X);
    const F = antideriv(g);
    if (F && !(g.k === 'fn' && g.name === 'ln') && !(g.k === 'fn' && ['asin', 'acos', 'atan'].includes(g.name)))
      return out('standard', 'Standard form', inner.k === 'sym' ? 'It is one of the standard integrals.' : `A standard integral with a linear inside ${sh(inner)}: integrate as usual, then divide by ${sh(a)} (the inside's slope).`, [`∫ ${sh(g)} dx = ${sh(F)}`], F);
  }
  // Substitution: a factor h(u) times a constant multiple of u′ (constants stay in, so the ratio carries them).
  const sub = trySub(f, fs);
  if (sub) return sub;
  if (rat && deg(rat.d) > 0) {
    const F = antideriv(g);
    if (F) return out('standard', 'Standard form', 'A simple fraction: it matches a standard integral (a log or an inverse tan) once you take care of the inside.', [`∫ ${sh(g)} dx = ${sh(F)}`], F);
  }
  // e^(ax) × sin or cos(bx): parts twice and solve.
  if (gf.length === 2 && gf.some((z) => z.k === 'pow' && same(z.b, E)) && gf.some((z) => z.k === 'fn' && (z.name === 'sin' || z.name === 'cos'))) {
    const F = antideriv(g);
    if (F) return out('loop', 'Parts twice, then solve', 'eˣ-type and sin/cos-type factors never get simpler when you differentiate or integrate them. Integrate by parts twice; the same integral I comes back, and you solve for I.',
      ['Call the integral I. Integrate by parts with u = the trig factor, dv = the exponential.', 'Do it again on the new integral: you get I = (some terms) − k × I.', 'Move k × I across: (1 + k) I = (those terms), so I = (those terms)/(1 + k).', `I = ${sh(F)}`], F);
  }
  // Integration by parts (ILATE), including a lone ln x or inverse trig with dv = dx.
  const nonPoly = gf.filter((z) => !toPoly(z, X));
  if (nonPoly.length === 1) {
    const h = nonPoly[0], P = mul(...gf.filter((z) => toPoly(z, X))), kh = kind(h);
    if (kh !== '?') {
      const order = 'ILATE', uIsH = order.indexOf(kh) < order.indexOf('A');
      const u = uIsH ? h : P, dv = uIsH ? P : h;
      const du = tidy(diff(u, X)), v = antideriv(dv);
      if (v) {
        const restI = tidy(mul(v, du)), rest = integrate(restI, X), F = rest.ok ? tidy(add(mul(u, v), mul(N(-1), rest.F))) : antideriv(g);
        const lone = gf.length === 1;
        return out('parts', 'Integration by parts', lone ? `A lone ${KIND_NAME[kh]} has no easy antiderivative, but its derivative is simple. Write it as ${sh(h)} × 1 and use parts with u = ${sh(h)}, dv = dx.` : `A product of an ${KIND_NAME.A} factor and ${/^[aeiou]/.test(KIND_NAME[kh]) ? 'an' : 'a'} ${KIND_NAME[kh]} factor. ILATE (Inverse trig, Log, Algebraic, Trig, Exponential): the one that comes first is u, because differentiating it makes it simpler.`,
          [`∫ u dv = uv − ∫ v du.`, `u = ${sh(u)}, dv = ${sh(dv)} dx.`, `du = ${br(du)} dx, v = ∫ ${sh(dv)} dx = ${sh(v)}.`, `So the integral = ${br(u)}·${br(v)} − ∫ ${sh(restI)} dx.`, rest.ok ? `∫ ${sh(restI)} dx = ${sh(rest.F)}${rest.method.includes('parts') ? ' (by parts again)' : ''}.` : 'The new integral needs another method.'], F);
      }
    }
  }
  if (g.k === 'pow' && g.b.k === 'fn' && (g.b.name === 'sin' || g.b.name === 'cos') && sh(g.e) === '2' && g.b.a.k === 'sym') {
    const F = antideriv(g), sin = g.b.name === 'sin';
    if (F) return out('standard', 'Trig identity first', `There is no direct rule for ${sin ? 'sin' : 'cos'}² x, but the double-angle identity turns it into a sum of simple standard forms.`, [`${sin ? 'sin' : 'cos'}² x = (1 ${sin ? '−' : '+'} cos 2x)/2.`, `∫ (1 ${sin ? '−' : '+'} cos 2x)/2 dx = x/2 ${sin ? '−' : '+'} sin(2x)/4.`], F);
  }
  const F = antideriv(g);
  if (F) return out('other', 'Standard form', 'It matches a standard integral (or a trig identity turns it into one).', [`∫ ${sh(g)} dx = ${sh(F)}`], F);
  return { ...base, method: 'none', title: 'No school method found', why: 'None of the school methods (power rule, standard forms, substitution, parts, partial fractions) fits this one. Some integrals, like e^(x²) or sin(x)/x, have no answer in ordinary functions at all.', steps: [], F: null, checked: false };
}

/** Coach an integrand: method, reason, steps and the antiderivative (checked by differentiating it back). */
export function coach(src: string | Ex): Coach {
  const f = typeof src === 'string' ? readIntegrand(src) : src;
  try { return coachOne(f, 0); } catch (e) { if (e instanceof CasError) throw new Error(e.message); throw e; }
}
export const value = (F: Ex, x: number) => evaluate(F, { x });

export const EXAMPLES: { group: string; src: string; label: string }[] = [
  { group: 'Substitution', src: '2x cos(x^2)', label: '2x cos(x²)' },
  { group: 'Substitution', src: 'x/(x^2 + 1)', label: 'x/(x² + 1)' },
  { group: 'Substitution', src: 'sin(x)^2 cos(x)', label: 'sin²x cos x' },
  { group: 'Substitution', src: 'ln(x)/x', label: 'ln x / x' },
  { group: 'Substitution', src: 'e^(sin(x)) cos(x)', label: 'e^(sin x) cos x' },
  { group: 'Parts', src: 'x e^x', label: 'x eˣ' },
  { group: 'Parts', src: 'x sin(x)', label: 'x sin x' },
  { group: 'Parts', src: 'x^2 e^x', label: 'x² eˣ' },
  { group: 'Parts', src: 'x ln(x)', label: 'x ln x' },
  { group: 'Parts', src: 'ln(x)', label: 'ln x' },
  { group: 'Parts', src: 'atan(x)', label: 'tan⁻¹ x' },
  { group: 'Parts', src: 'e^x sin(x)', label: 'eˣ sin x' },
  { group: 'Partial fractions', src: '1/(x^2 - 1)', label: '1/(x² − 1)' },
  { group: 'Partial fractions', src: '(3x + 5)/(x^2 + 3x + 2)', label: '(3x + 5)/(x² + 3x + 2)' },
  { group: 'Partial fractions', src: 'x/(x - 1)^2', label: 'x/(x − 1)²' },
  { group: 'Partial fractions', src: '(x^2 + 1)/(x^2 - 1)', label: '(x² + 1)/(x² − 1)' },
  { group: 'Partial fractions', src: '1/(x^3 + x)', label: '1/(x³ + x)' },
  { group: 'Standard', src: 'sin(3x + 1)', label: 'sin(3x + 1)' },
  { group: 'Standard', src: '1/(x^2 + 4)', label: '1/(x² + 4)' },
  { group: 'Standard', src: '3x^2 - 4x + 1/x', label: '3x² − 4x + 1/x' },
];
