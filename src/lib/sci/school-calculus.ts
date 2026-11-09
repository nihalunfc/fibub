// School calculus (Class 11 and 12 maths): ready-made functions with their exact derivatives and
// antiderivatives, typed functions read safely, secant slopes, numerical derivatives and the
// first-principles working for x^n and sin x. Plain TypeScript, no DOM.
import { parse, compile, variables } from './expr.ts';

export type Fn = (x: number) => number;
export type Preset = { id: string; label: string; f: Fn; d: Fn; d2: Fn; F?: Fn; dText: string; FText?: string; domain?: [number, number]; view: [number, number, number, number] };

export const PRESETS: Preset[] = [
  { id: 'x2', label: 'x²', f: (x) => x * x, d: (x) => 2 * x, d2: () => 2, F: (x) => x ** 3 / 3, dText: '2x', FText: 'x³/3', view: [-3, 3, -2, 9] },
  { id: 'x3', label: 'x³ − 3x', f: (x) => x ** 3 - 3 * x, d: (x) => 3 * x * x - 3, d2: (x) => 6 * x, F: (x) => x ** 4 / 4 - 1.5 * x * x, dText: '3x² − 3', FText: 'x⁴/4 − 3x²/2', view: [-3, 3, -6, 6] },
  { id: 'sin', label: 'sin x', f: Math.sin, d: Math.cos, d2: (x) => -Math.sin(x), F: (x) => -Math.cos(x), dText: 'cos x', FText: '−cos x', view: [-7, 7, -2, 2] },
  { id: 'cos', label: 'cos x', f: Math.cos, d: (x) => -Math.sin(x), d2: (x) => -Math.cos(x), F: Math.sin, dText: '−sin x', FText: 'sin x', view: [-7, 7, -2, 2] },
  { id: 'exp', label: 'eˣ', f: Math.exp, d: Math.exp, d2: Math.exp, F: Math.exp, dText: 'eˣ', FText: 'eˣ', view: [-3, 2.5, -1, 8] },
  { id: 'ln', label: 'ln x', f: (x) => (x > 0 ? Math.log(x) : NaN), d: (x) => (x > 0 ? 1 / x : NaN), d2: (x) => (x > 0 ? -1 / (x * x) : NaN), F: (x) => (x > 0 ? x * Math.log(x) - x : NaN), dText: '1/x', FText: 'x ln x − x', domain: [0, Infinity], view: [-0.5, 6, -3, 3] },
  { id: 'sqrt', label: '√x', f: (x) => (x >= 0 ? Math.sqrt(x) : NaN), d: (x) => (x > 0 ? 0.5 / Math.sqrt(x) : NaN), d2: (x) => (x > 0 ? -0.25 * x ** -1.5 : NaN), F: (x) => (x >= 0 ? (2 / 3) * x ** 1.5 : NaN), dText: '1/(2√x)', FText: '2x^(3/2)/3', domain: [0, Infinity], view: [-0.5, 6, -1, 3] },
  { id: 'abs', label: '|x|', f: Math.abs, d: (x) => (x > 0 ? 1 : x < 0 ? -1 : NaN), d2: (x) => (x === 0 ? NaN : 0), dText: '1 for x > 0, −1 for x < 0, none at 0', view: [-3, 3, -1, 3] },
  { id: 'inv', label: '1/x', f: (x) => 1 / x, d: (x) => -1 / (x * x), d2: (x) => 2 / x ** 3, dText: '−1/x²', domain: [-Infinity, Infinity], view: [-4, 4, -4, 4] },
];
export const preset = (id: string) => PRESETS.find((p) => p.id === id);

/** Read a typed function of x ("3x^2 - 2x", "sin(x)/x", "e^x"). Throws a friendly Error if it cannot. */
export function readFn(src: string): Fn {
  const t = src.replace(/^\s*(y|f\s*\(\s*x\s*\))\s*=/i, '').replace(/\|([^|]+)\|/g, 'abs($1)');
  if (!t.trim()) throw new Error('Type a function of x, such as x^2 - 3x.');
  const n = parse(t), vars = variables(n);
  const bad = vars.filter((v) => v !== 'x' && v !== 'e');
  if (bad.length) throw new Error(`Use only x in the function (found ${bad.join(', ')}).`);
  const g = compile(n, ['x', 'e']);
  return (x) => g([x, Math.E]);
}

/** Slope of the secant through (a, f(a)) and (a + h, f(a + h)). */
export const secant = (f: Fn, a: number, h: number) => (f(a + h) - f(a)) / h;

/** Numerical derivative (central difference with a step suited to x); NaN where f is not smooth there. */
export function deriv(f: Fn, x: number): number {
  const h = 1e-5 * Math.max(1, Math.abs(x));
  const l = (f(x) - f(x - h)) / h, r = (f(x + h) - f(x)) / h, c = (f(x + h) - f(x - h)) / (2 * h);
  if (![l, r, c].every(Number.isFinite)) return NaN;
  // A corner (|x| at 0) shows as left and right slopes that disagree.
  if (Math.abs(l - r) > 1e-2 * Math.max(1, Math.abs(c))) return NaN;
  return c;
}
/** Left-hand and right-hand slopes (h → 0⁻ and h → 0⁺), to show a corner. */
export const sideSlopes = (f: Fn, x: number, h = 1e-6) => ({ left: (f(x) - f(x - h)) / h, right: (f(x + h) - f(x)) / h });
export function deriv2(f: Fn, x: number): number {
  const h = 1e-3 * Math.max(1, Math.abs(x));
  const v = (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
  return Number.isFinite(v) ? v : NaN;
}

/** Binomial coefficient C(n, k) for small whole numbers. */
export function nCr(n: number, k: number): number { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); }

const sup = (n: number) => String(n).split('').map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('');
const pw = (base: string, n: number) => (n === 0 ? '' : n === 1 ? base : base + sup(n));
const term = (c: number, a: string, ai: number, b: string, bi: number) => { const s = `${c === 1 ? '' : c}${pw(a, ai)}${pw(b, bi)}`; return s || '1'; };

/** First-principles working for d/dx of xⁿ (n = 1 to 6), as lines of text. */
export function firstPrinciplesPower(n: number): string[] {
  const exp = Array.from({ length: n + 1 }, (_, k) => term(nCr(n, k), 'x', n - k, 'h', k)).join(' + ');
  const after = Array.from({ length: n }, (_, k) => term(nCr(n, k + 1), 'x', n - k - 1, 'h', k)).join(' + ');
  return [
    `f'(x) = lim (h→0) [f(x + h) − f(x)] / h = lim (h→0) [(x + h)${sup(n)} − x${sup(n)}] / h`,
    `Expand (binomial theorem): (x + h)${sup(n)} = ${exp}`,
    `Take away x${sup(n)} and divide by h: ${after}`,
    `Let h → 0: every term with h vanishes, leaving ${n === 1 ? '1' : `${n}${pw('x', n - 1)}`}`,
    `So d/dx (x${sup(n)}) = ${n === 1 ? '1' : `${n}${pw('x', n - 1)}`}`,
  ];
}
/** First-principles working for d/dx of sin x. */
export const firstPrinciplesSin = (): string[] => [
  "f'(x) = lim (h→0) [sin(x + h) − sin x] / h",
  'Use sin A − sin B = 2 cos((A + B)/2) sin((A − B)/2): the top is 2 cos(x + h/2) sin(h/2)',
  'So the quotient is cos(x + h/2) · [sin(h/2) / (h/2)]',
  'As h → 0, cos(x + h/2) → cos x and sin(h/2)/(h/2) → 1 (the standard limit sin θ / θ → 1)',
  'So d/dx (sin x) = cos x',
];
