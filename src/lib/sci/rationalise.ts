// Rationalising the denominator for school (Learn), with exact whole-number arithmetic: k/√n, k/(a + b√n) and
// k/(√m ± √n). Numbers are sums of terms c√r (r square-free, r = 1 for plain numbers) over a whole-number
// denominator. No DOM.
import { gcd } from './smath.ts';

export type Term = { c: number; r: number };
export type Surd = { terms: Term[]; den: number };

/** n = s² × r with r square-free: returns [s, r]. 12 → [2, 3]. */
export function split(n: number): [number, number] {
  let s = 1, r = n;
  for (let k = 2; k * k <= r; k++) while (r % (k * k) === 0) { s *= k; r /= k * k; }
  return [s, r];
}

/** Combine like terms, pull squares out of roots, cancel common factors, make the denominator positive. */
export function tidy(x: Surd): Surd {
  const m = new Map<number, number>();
  for (const t of x.terms) { const [s, r] = split(t.r); m.set(r, (m.get(r) ?? 0) + t.c * s); }
  let terms = [...m].filter(([, c]) => c !== 0).map(([r, c]) => ({ c, r })).sort((a, b) => a.r - b.r);
  let den = x.den;
  if (den < 0) { den = -den; terms = terms.map((t) => ({ c: -t.c, r: t.r })); }
  const g = terms.reduce((acc, t) => gcd(acc, t.c), den) || 1;
  return { terms: terms.map((t) => ({ c: t.c / g, r: t.r })), den: den / g };
}

const neg = (x: number) => String(x).replace("-", "−");
export const value = (x: Surd) => x.terms.reduce((s, t) => s + t.c * Math.sqrt(t.r), 0) / x.den;

/** Text of the terms: "3√2 − 4", "√5 − √3", "−2". */
export function termsText(terms: Term[]): string {
  if (!terms.length) return '0';
  // Plain number first, then roots.
  const ts = [...terms].sort((a, b) => (a.r === 1 ? 0 : 1) - (b.r === 1 ? 0 : 1) || (a.c > 0 ? 0 : 1) - (b.c > 0 ? 0 : 1) || b.r - a.r);
  return ts.map((t, i) => {
    const mag = Math.abs(t.c), body = t.r === 1 ? String(mag) : `${mag === 1 ? '' : mag}√${t.r}`;
    return i === 0 ? (t.c < 0 ? '−' : '') + body : (t.c < 0 ? ' − ' : ' + ') + body;
  }).join('');
}
export function text(x: Surd): string {
  const top = termsText(x.terms);
  if (x.den === 1) return top;
  const d = x.den < 0 ? `(${neg(x.den)})` : String(x.den);
  return x.terms.length > 1 ? `(${top})/${d}` : `${top}/${d}`;
}

export type Problem =
  | { kind: 'root'; k: number; n: number }                 // k / √n
  | { kind: 'binom'; k: number; a: number; b: number; n: number } // k / (a + b√n)
  | { kind: 'two'; k: number; m: number; s: 1 | -1; n: number };  // k / (√m + s√n)

export function problemText(p: Problem): string {
  if (p.kind === 'root') return `${p.k}/√${p.n}`;
  if (p.kind === 'binom') return `${p.k}/(${termsText([{ c: p.a, r: 1 }, { c: p.b, r: p.n }].filter((t) => t.c !== 0))})`;
  return `${p.k}/(√${p.m} ${p.s > 0 ? '+' : '−'} √${p.n})`;
}

export const problemValue = (p: Problem) => p.kind === 'root' ? p.k / Math.sqrt(p.n) : p.kind === 'binom' ? p.k / (p.a + p.b * Math.sqrt(p.n)) : p.k / (Math.sqrt(p.m) + p.s * Math.sqrt(p.n));

export type Steps = { multiplier: string; top: Surd; denRaw: number; denWork: string; answer: Surd } | { error: string };

/** Work the problem: what to multiply by, the new top and bottom, and the tidy answer. */
export function rationalise(p: Problem): Steps {
  if (p.k === 0) return { error: 'With 0 on top the answer is just 0.' };
  if (p.kind === 'root') {
    if (p.n <= 0) return { error: 'n must be a positive whole number.' };
    const top: Surd = { terms: [{ c: p.k, r: p.n }], den: 1 };
    return { multiplier: `√${p.n}/√${p.n}`, top, denRaw: p.n, denWork: `√${p.n} × √${p.n} = ${p.n}`, answer: tidy({ ...top, den: p.n }) };
  }
  if (p.kind === 'binom') {
    if (p.n <= 0 || p.b === 0) return { error: 'b must not be 0 and n must be a positive whole number.' };
    const den = p.a * p.a - p.b * p.b * p.n;
    if (den === 0) return { error: `a² − b²n = 0 here (the bottom is really ${p.a + p.b * Math.sqrt(p.n)}), so there is no root to clear.` };
    const conj = termsText([{ c: p.a, r: 1 }, { c: -p.b, r: p.n }].filter((t) => t.c !== 0));
    const top: Surd = { terms: [{ c: p.k * p.a, r: 1 }, { c: -p.k * p.b, r: p.n }].filter((t) => t.c !== 0), den: 1 };
    return { multiplier: `(${conj})/(${conj})`, top, denRaw: den, denWork: `(${termsText([{ c: p.a, r: 1 }, { c: p.b, r: p.n }].filter((t) => t.c !== 0))})(${conj}) = ${p.a}² − (${Math.abs(p.b) === 1 ? '' : Math.abs(p.b)}√${p.n})² = ${p.a * p.a} − ${p.b * p.b * p.n} = ${neg(den)}`, answer: tidy({ ...top, den }) };
  }
  if (p.m <= 0 || p.n <= 0 || p.m === p.n) return { error: 'm and n must be different positive whole numbers.' };
  const den = p.m - p.n;
  const conj = `√${p.m} ${p.s > 0 ? '−' : '+'} √${p.n}`;
  const top: Surd = { terms: [{ c: p.k, r: p.m }, { c: -p.s * p.k, r: p.n }], den: 1 };
  return { multiplier: `(${conj})/(${conj})`, top, denRaw: den, denWork: `(√${p.m} ${p.s > 0 ? '+' : '−'} √${p.n})(${conj}) = ${p.m} − ${p.n} = ${neg(den)}`, answer: tidy({ ...top, den }) };
}
