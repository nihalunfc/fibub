// Operator algebra on small matrices: spin-j angular momentum, Pauli matrices, two spin-½ particles and the
// truncated harmonic oscillator, with an expression reader for sums, products, powers, commutators [A,B],
// anticommutators {A,B} and daggers. ħ = 1 (and m = ω = 1 for the oscillator).
import { type C, type CM, cadd, csub, cmul, cdiv, cscale, czeros, ceye, cmm, cmadd, cmscale, dagger, ctrace, cdet, kron, cmdiff, cmnorm, cabs, isHermitian, eigHermitian, eigvalsGeneral, csqrt } from './phq.ts';

export type Space = { kind: 'spin'; j: number } | { kind: 'osc'; N: number } | { kind: 'two' };

/** Spin-j matrices in the basis m = j, j−1, ..., −j. */
export function spin(j: number): Record<string, CM> {
  const d = Math.round(2 * j + 1), m = (k: number) => j - k;
  const Jz = czeros(d), Jp = czeros(d);
  for (let k = 0; k < d; k++) { Jz[k][k] = [m(k), 0]; if (k > 0) Jp[k - 1][k] = [Math.sqrt(j * (j + 1) - m(k) * (m(k) + 1)), 0]; }
  const Jm = dagger(Jp), Jx = cmscale(cmadd(Jp, Jm), [0.5, 0]), Jy = cmscale(cmadd(Jp, Jm, [-1, 0]), [0, -0.5]);
  const J2 = cmadd(cmadd(cmm(Jx, Jx), cmm(Jy, Jy)), cmm(Jz, Jz));
  return { Jx, Jy, Jz, Jp, Jm, J2, I: ceye(d) };
}
export const PAULI: Record<string, CM> = {
  X: [[[0, 0], [1, 0]], [[1, 0], [0, 0]]], Y: [[[0, 0], [0, -1]], [[0, 1], [0, 0]]], Z: [[[1, 0], [0, 0]], [[0, 0], [-1, 0]]],
};
/** Ladder operators in the first N oscillator states, with x = (a + a†)/√2 and p = i(a† − a)/√2. */
export function oscillator(N: number): Record<string, CM> {
  const a = czeros(N); for (let n = 1; n < N; n++) a[n - 1][n] = [Math.sqrt(n), 0];
  const ad = dagger(a), x = cmscale(cmadd(a, ad), [Math.SQRT1_2, 0]), p = cmscale(cmadd(ad, a, [-1, 0]), [0, Math.SQRT1_2]);
  const n = cmm(ad, a), H = cmadd(n, ceye(N), [0.5, 0]);
  return { a, ad, n, x, p, H, I: ceye(N) };
}
/** Named operators for a space. */
export function operators(s: Space): Record<string, CM> {
  if (s.kind === 'osc') return oscillator(s.N);
  if (s.kind === 'spin') { const o = spin(s.j); if (Math.abs(s.j - 0.5) < 1e-12) Object.assign(o, PAULI, { H: cmscale(cmadd(PAULI.X, PAULI.Z), [Math.SQRT1_2, 0]) }); return o; }
  const I2 = ceye(2), o: Record<string, CM> = { I: ceye(4) };
  for (const P of ['X', 'Y', 'Z']) { o[`${P}1`] = kron(PAULI[P], I2); o[`${P}2`] = kron(I2, PAULI[P]); o[`S${P.toLowerCase()}1`] = cmscale(o[`${P}1`], [0.5, 0]); o[`S${P.toLowerCase()}2`] = cmscale(o[`${P}2`], [0.5, 0]); }
  const S = ['x', 'y', 'z'].map((c) => cmadd(o[`S${c}1`], o[`S${c}2`]));
  o.S2 = cmadd(cmadd(cmm(S[0], S[0]), cmm(S[1], S[1])), cmm(S[2], S[2]));
  o.SWAP = cmscale(cmadd(cmadd(cmadd(o.I, cmm(o.X1, o.X2)), cmm(o.Y1, o.Y2)), cmm(o.Z1, o.Z2)), [0.5, 0]);
  return o;
}

// ---------- Expressions ----------
export type Val = { k: 's'; v: C } | { k: 'm'; v: CM };
type Tok = { t: 'num' | 'id' | 'op'; v: string; at: number };
export class OpError extends Error {}

function lex(src: string): Tok[] {
  const s = src.replace(/[−–]/g, '-').replace(/[×·]/g, '*').replace(/†/g, "'").replace(/ħ/g, '1');
  const out: Tok[] = []; let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) { i++; continue; }
    const n = /^(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?/.exec(s.slice(i)); if (n) { out.push({ t: 'num', v: n[0], at: i }); i += n[0].length; continue; }
    const id = /^[A-Za-z_][A-Za-z0-9_]*/.exec(s.slice(i)); if (id) { out.push({ t: 'id', v: id[0], at: i }); i += id[0].length; continue; }
    if ("+-*/^()[]{},'".includes(ch)) { out.push({ t: 'op', v: ch, at: i }); i++; continue; }
    throw new OpError(`"${ch}" cannot be used here`);
  }
  return out;
}

export function evaluate(src: string, ops: Record<string, CM>): Val {
  const toks = lex(src); let p = 0;
  if (!toks.length) throw new OpError('Type an expression, such as [Jx, Jy].');
  const dim = ops.I.length;
  const peek = () => toks[p], next = () => toks[p++], is = (v: string) => p < toks.length && toks[p].t === 'op' && toks[p].v === v;
  const expect = (v: string) => { if (!is(v)) throw new OpError(`Expected "${v}"${p < toks.length ? ` before "${toks[p].v}"` : ' at the end'}`); p++; };
  const asM = (x: Val): CM => (x.k === 'm' ? x.v : cmscale(ceye(dim), x.v));
  const add = (a: Val, b: Val, s: number): Val => (a.k === 's' && b.k === 's' ? { k: 's', v: cadd(a.v, cscale(b.v, s)) } : { k: 'm', v: cmadd(asM(a), asM(b), [s, 0]) });
  const mul = (a: Val, b: Val): Val => (a.k === 's' && b.k === 's' ? { k: 's', v: cmul(a.v, b.v) } : a.k === 's' ? { k: 'm', v: cmscale((b as { v: CM }).v, a.v) } : b.k === 's' ? { k: 'm', v: cmscale(a.v, b.v) } : { k: 'm', v: cmm(a.v, b.v) });
  function expr(): Val { let a = term(); while (is('+') || is('-')) { const s = next().v === '+' ? 1 : -1; a = add(a, term(), s); } return a; }
  const startsPrimary = () => p < toks.length && (toks[p].t !== 'op' || ['(', '[', '{'].includes(toks[p].v));
  function term(): Val {
    let a = unary();
    for (;;) {
      if (is('*')) { next(); a = mul(a, unary()); continue; }
      if (is('/')) { next(); const b = unary(); if (b.k !== 's') throw new OpError('You can only divide by a number.'); if (cabs(b.v) === 0) throw new OpError('Division by zero.'); a = a.k === 's' ? { k: 's', v: cdiv(a.v, b.v) } : { k: 'm', v: cmscale(a.v, cdiv([1, 0], b.v)) }; continue; }
      if (startsPrimary()) { a = mul(a, unary()); continue; }
      return a;
    }
  }
  function unary(): Val { if (is('-')) { next(); const v = unary(); return v.k === 's' ? { k: 's', v: cscale(v.v, -1) } : { k: 'm', v: cmscale(v.v, [-1, 0]) }; } if (is('+')) { next(); return unary(); } return power(); }
  function power(): Val {
    const b = postfix();
    if (!is('^')) return b;
    next(); const neg = is('-') ? (next(), -1) : 1; const t = next();
    if (!t || t.t !== 'num') throw new OpError('Powers must be whole numbers, like A^2.');
    const e = neg * Number(t.v);
    if (b.k === 's') { const r = Math.pow(cabs(b.v), e), th = Math.atan2(b.v[1], b.v[0]) * e; return { k: 's', v: [r * Math.cos(th), r * Math.sin(th)] }; }
    if (!Number.isInteger(e) || e < 0 || e > 64) throw new OpError('Matrix powers must be whole numbers from 0 to 64.');
    let r = ceye(b.v.length); for (let k = 0; k < e; k++) r = cmm(r, b.v);
    return { k: 'm', v: r };
  }
  function postfix(): Val { let v = primary(); while (is("'")) { next(); v = v.k === 's' ? { k: 's', v: [v.v[0], -v.v[1]] } : { k: 'm', v: dagger(v.v) }; } return v; }
  function primary(): Val {
    const t = next();
    if (!t) throw new OpError('The expression ends too early.');
    if (t.t === 'num') return { k: 's', v: [Number(t.v), 0] };
    if (t.t === 'op') {
      if (t.v === '(') { const v = expr(); expect(')'); return v; }
      if (t.v === '[' || t.v === '{') {
        const a = expr(); expect(','); const b = expr(); expect(t.v === '[' ? ']' : '}');
        if (a.k === 's' || b.k === 's') return { k: 's', v: t.v === '[' ? [0, 0] : cscale(mul(a, b).v as C, 2) };
        return { k: 'm', v: cmadd(cmm(a.v, b.v), cmm(b.v, a.v), [t.v === '[' ? -1 : 1, 0]) };
      }
      throw new OpError(`"${t.v}" is not expected here`);
    }
    const name = t.v;
    if (name === 'i') return { k: 's', v: [0, 1] };
    if (name === 'pi') return { k: 's', v: [Math.PI, 0] };
    if (['sqrt', 'dag', 'tr', 'det', 'comm', 'acomm'].includes(name) && is('(')) {
      next(); const a = expr();
      if (name === 'comm' || name === 'acomm') { expect(','); const b = expr(); expect(')'); if (a.k === 's' || b.k === 's') return { k: 's', v: name === 'comm' ? [0, 0] : cscale(mul(a, b).v as C, 2) }; return { k: 'm', v: cmadd(cmm(a.v, b.v), cmm(b.v, a.v), [name === 'comm' ? -1 : 1, 0]) }; }
      expect(')');
      if (name === 'sqrt') { if (a.k !== 's') throw new OpError('sqrt takes a number.'); return { k: 's', v: csqrt(a.v) }; }
      if (name === 'dag') return a.k === 's' ? { k: 's', v: [a.v[0], -a.v[1]] } : { k: 'm', v: dagger(a.v) };
      if (name === 'tr') return { k: 's', v: a.k === 's' ? cscale(a.v, dim) : ctrace(a.v) };
      return { k: 's', v: a.k === 's' ? a.v : cdet(a.v) };
    }
    if (ops[name]) return { k: 'm', v: ops[name] };
    throw new OpError(`"${name}" is not an operator here. Known: ${Object.keys(ops).join(', ')}.`);
  }
  const v = expr();
  if (p < toks.length) throw new OpError(`Unexpected "${toks[p].v}"`);
  return v;
}

export type Analysis = {
  hermitian: boolean; antiHermitian: boolean; unitary: boolean; zero: boolean; normal: boolean;
  trace: C; det: C; norm: number; identityMultiple: C | null; multipleOf: { name: string; c: C }[];
  eigen: { values: C[]; real: boolean; grouped: { v: C; mult: number }[] };
};

/** Properties of a matrix, including whether it is a multiple of a named operator. */
export function analyse(M: CM, ops: Record<string, CM>): Analysis {
  const d = M.length, nrm = cmnorm(M), tol = 1e-10 * Math.max(1, nrm);
  const Md = dagger(M), hermitian = cmdiff(M, Md) <= tol, antiHermitian = cmdiff(M, cmscale(Md, [-1, 0])) <= tol;
  const unitary = cmdiff(cmm(M, Md), ceye(d)) <= 1e-10, normal = cmdiff(cmm(M, Md), cmm(Md, M)) <= 1e-10 * Math.max(1, nrm * nrm);
  const zero = nrm <= 1e-12;
  const tr = ctrace(M), c0 = cscale(tr, 1 / d);
  const identityMultiple = !zero && cmdiff(M, cmscale(ceye(d), c0)) <= tol ? c0 : null;
  const multipleOf: { name: string; c: C }[] = [];
  if (!zero) for (const [name, O] of Object.entries(ops)) {
    if (name === 'I') continue;
    // Best c = ⟨O, M⟩ / ⟨O, O⟩ (Frobenius), then check the residual.
    let num: C = [0, 0], den = 0;
    for (let i = 0; i < d; i++) for (let j = 0; j < d; j++) { num = cadd(num, cmul([O[i][j][0], -O[i][j][1]], M[i][j])); den += cabs(O[i][j]) ** 2; }
    if (!den) continue;
    const c = cscale(num, 1 / den);
    if (cabs(c) > 1e-12 && cmdiff(M, cmscale(O, c)) <= tol) multipleOf.push({ name, c });
  }
  // Prefer the plainest name: a coefficient of size 1, then the smallest change from 1.
  multipleOf.sort((x, y) => Math.abs(Math.log(cabs(x.c))) - Math.abs(Math.log(cabs(y.c))));
  let values: C[];
  if (hermitian) values = eigHermitian(M).values.map((x) => [x, 0] as C);
  else if (antiHermitian) values = eigHermitian(cmscale(M, [0, -1])).values.map((x) => [0, x] as C);
  else values = eigvalsGeneral(M);
  const clean = (z: C): C => [Math.abs(z[0]) < 1e-10 * Math.max(1, nrm) ? 0 : z[0], Math.abs(z[1]) < 1e-10 * Math.max(1, nrm) ? 0 : z[1]];
  values = values.map(clean).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const grouped: { v: C; mult: number }[] = [];
  for (const v of values) { const g = grouped.find((x) => cabs(csub(x.v, v)) <= 1e-8 * Math.max(1, nrm)); if (g) g.mult++; else grouped.push({ v, mult: 1 }); }
  return { hermitian, antiHermitian, unitary, zero, normal, trace: tr, det: cdet(M), norm: nrm, identityMultiple, multipleOf, eigen: { values, real: values.every((z) => z[1] === 0), grouped } };
}
export { isHermitian };
