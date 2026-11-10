// Chain rule as linked gears: y = f(g(x)) (or three links), each link's rate, the product dy/dx, and the
// formula written with the inner expression put in. Plain TypeScript, no DOM. Checked against sympy 1.14 in
// tests/sci-tools/chain-rule.mjs.

export type Link = { id: string; label: string; f: (u: number, k: number) => number; d: (u: number, k: number) => number; text: (a: string, k: number) => string; dText: (a: string, k: number) => string };

const wrap = (a: string) => (/^([a-z]|\d+(\.\d+)?)$/.test(a) ? a : `(${a})`);
const fn = (name: string, a: string) => (a === 'x' || a === 'u' || a === 'v' ? `${name} ${a}` : `${name}(${a})`);
/** The expression with bracketed parts removed, to spot a top-level + or −. */
const top = (a: string) => { let s = a; for (let i = 0; i < 5; i++) s = s.replace(/\([^()]*\)/g, ''); return s; };
const kStr = (k: number) => (k === 1 ? '' : k === -1 ? '−' : String(k).replace('-', '−'));

export const LINKS: Link[] = [
  { id: 'k', label: 'k × u (a straight line)', f: (u, k) => k * u, d: (_u, k) => k, text: (a, k) => (/[+−-]/.test(top(a).replace(/^−/, '')) ? `${kStr(k)}(${a})` : /^[a-wyz]/.test(a) && Math.abs(k) !== 1 ? `${kStr(k)} ${a}` : `${kStr(k)}${a}`), dText: (_a, k) => String(k).replace('-', '−') },
  { id: 'sq', label: 'u²', f: (u) => u * u, d: (u) => 2 * u, text: (a) => `${wrap(a)}²`, dText: (a) => `2${wrap(a)}` },
  { id: 'cube', label: 'u³', f: (u) => u ** 3, d: (u) => 3 * u * u, text: (a) => `${wrap(a)}³`, dText: (a) => `3${wrap(a)}²` },
  { id: 'sin', label: 'sin u', f: Math.sin, d: Math.cos, text: (a) => fn('sin', a), dText: (a) => fn('cos', a) },
  { id: 'cos', label: 'cos u', f: Math.cos, d: (u) => -Math.sin(u), text: (a) => fn('cos', a), dText: (a) => `−${fn('sin', a)}` },
  { id: 'exp', label: 'eᵘ', f: Math.exp, d: Math.exp, text: (a) => `e^${wrap(a)}`, dText: (a) => `e^${wrap(a)}` },
  { id: 'ln', label: 'ln u', f: (u) => (u > 0 ? Math.log(u) : NaN), d: (u) => (u > 0 ? 1 / u : NaN), text: (a) => fn('ln', a), dText: (a) => `1/${wrap(a)}` },
  { id: 'sqrt', label: '√u', f: (u) => (u >= 0 ? Math.sqrt(u) : NaN), d: (u) => (u > 0 ? 1 / (2 * Math.sqrt(u)) : NaN), text: (a) => `√${wrap(a)}`, dText: (a) => `1/(2√${wrap(a)})` },
];
export const link = (id: string) => LINKS.find((l) => l.id === id) ?? LINKS[0];

export type Chain = { id: string; k: number }[];
/** Values along the chain: [x, inner, ..., y], innermost link first in `c`. */
export function values(c: Chain, x: number): number[] {
  const v = [x];
  for (const s of c) v.push(link(s.id).f(v[v.length - 1], s.k));
  return v;
}
/** Each link's own rate (d out / d in) at the current point, innermost first. */
export function rates(c: Chain, x: number): number[] {
  const v = values(c, x);
  return c.map((s, i) => link(s.id).d(v[i], s.k));
}
/** dy/dx by the chain rule: the product of the link rates. */
export const chainSlope = (c: Chain, x: number) => rates(c, x).reduce((p, r) => p * r, 1);
/** The whole function written out, e.g. "sin(3x)". */
export function chainText(c: Chain, v = 'x'): string {
  let a = v;
  for (const s of c) a = link(s.id).text(a, s.k);
  return a;
}
/** Each link's derivative written with the inner expression put in, innermost first: ["3", "cos(3x)"]. */
export function rateTexts(c: Chain, v = 'x'): string[] {
  const out: string[] = [];
  let a = v;
  for (const s of c) { out.push(link(s.id).dText(a, s.k)); a = link(s.id).text(a, s.k); }
  return out;
}
/** Central-difference slope of the whole chain, for the "small nudge" table. */
export const numericSlope = (c: Chain, x: number, h = 1e-5) => (values(c, x + h).at(-1)! - values(c, x - h).at(-1)!) / (2 * h);
