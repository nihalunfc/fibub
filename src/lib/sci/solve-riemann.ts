// "Solve my numbers" for integrals (Class 12): a left, right, midpoint or trapezium sum with the sample values shown,
// the exact integral of a polynomial (antiderivative + C, then F(b) − F(a)), and the area between two polynomial
// curves. Functions are picked from a short list or typed as polynomial coefficients. No DOM.
import { type SSpec, type SIn, type SOut, sf } from '../learn/solvecore-b.ts';
import { type Poly, evalP, antiP, trimP, realRoots, polyText } from './solve-poly.ts';
import { simpson } from './school-integral.ts';

type Fn = (x: number) => number;
const z0 = (x: number) => (Math.abs(x) < 1e-10 ? 0 : x);
const v = (x: number, n = 5) => sf(z0(x), n);
const q = (x: number) => (x < 0 ? `(${sf(x, 5)})` : sf(x, 5));
export const FUNS: Record<string, { label: string; f: Fn; text: string }> = {
  sin: { label: 'sin x (x in radians)', f: Math.sin, text: 'sin x' },
  cos: { label: 'cos x (x in radians)', f: Math.cos, text: 'cos x' },
  exp: { label: 'eˣ', f: Math.exp, text: 'eˣ' },
  recip: { label: '1/x', f: (x) => 1 / x, text: '1/x' },
  sqrt: { label: '√x', f: Math.sqrt, text: '√x' },
  ln: { label: 'ln x', f: Math.log, text: 'ln x' },
};
const METH: Record<string, string> = { left: 'left', right: 'right', mid: 'midpoint', trap: 'trapezium' };

export function riemannSum(f: Fn, text: string, a: number, b: number, n: number, m: string): SOut {
  if (!Number.isInteger(n) || n < 1 || n > 10000) return { error: 'The number of strips n must be a whole number from 1 to 10 000.' };
  if (!(a < b)) return { error: 'The start a must be smaller than the end b.' };
  const dx = (b - a) / n, xs: number[] = [];
  const count = m === 'trap' ? n + 1 : n;
  for (let k = 0; k < count; k++) xs.push(m === 'right' ? a + (k + 1) * dx : m === 'mid' ? a + (k + 0.5) * dx : a + k * dx);
  const ys = xs.map(f), badk = ys.findIndex((y) => !Number.isFinite(y));
  if (badk >= 0) return { error: `f is not defined at x = ${v(xs[badk])}, which this sum needs. Change the interval or the function.` };
  const total = m === 'trap' ? (dx / 2) * (ys[0] + ys[n] + 2 * ys.slice(1, n).reduce((s, y) => s + y, 0)) : dx * ys.reduce((s, y) => s + y, 0);
  const pts = (k: number[]) => k.map((i) => `f(${v(xs[i])}) = ${v(ys[i], 4)}`).join(', ');
  const idx = [...Array(count).keys()], shown = count <= 8 ? pts(idx) : `${pts([0, 1, 2])}, …, ${pts([count - 2, count - 1])}`;
  const lines = [`Strip width Δx = (b − a) / n = (${sf(b, 5)} − ${q(a)}) / ${n} = ${v(dx)}`, m === 'left' ? 'Left sum: use the height at the left end of each strip, x = a, a + Δx, …' : m === 'right' ? 'Right sum: use the height at the right end of each strip, x = a + Δx, …, b' : m === 'mid' ? 'Midpoint sum: use the height at the middle of each strip, x = a + Δx/2, …' : 'Trapezium rule: average the heights at the two ends of each strip: (Δx/2)[f₀ + 2(f₁ + … + fₙ₋₁) + fₙ]', `Heights: ${shown}`];
  lines.push(m === 'trap' ? `Sum = (${v(dx)} / 2) × [${v(ys[0], 4)} + 2(${v(ys.slice(1, n).reduce((s, y) => s + y, 0), 4)}) + ${v(ys[n], 4)}] = ${v(total, 5)}` : `Sum = Δx × (sum of the heights) = ${v(dx)} × ${v(ys.reduce((s, y) => s + y, 0), 5)} = ${v(total, 5)}`);
  const ex = simpson(f, a, b, 2000), good = Number.isFinite(ex);
  if (good) lines.push(`For comparison the exact integral is about ${v(ex, 5)}, so this sum is ${total > ex ? 'above' : 'below'} it by ${v(Math.abs(total - ex), 2)}.`);
  return { answer: `The ${METH[m]} sum of ${text} from ${sf(a, 5)} to ${sf(b, 5)} with ${n} strip${n === 1 ? '' : 's'} is ${v(total, 4)}.`, lines, tip: 'Common mistakes: mixing up left and right sums (they are the same only if f is flat), and using n + 1 heights for a left, right or midpoint sum. Those need exactly n heights; only the trapezium rule uses n + 1. More strips give a better answer.' };
}

export function exactIntegral(c: number[], a?: number, b?: number): SOut {
  const f = trimP(c);
  if (c.length < 1 || c.length > 7) return { error: 'Give 1 to 7 coefficients, highest power first. For 3x² + 2x + 1 type 3 2 1.' };
  const F = antiP(f), Ft = polyText(F), ft = polyText(f);
  const lines = [`f(x) = ${ft}`, 'Add 1 to each power and divide by the new power: ∫ xⁿ dx = xⁿ⁺¹ / (n + 1)', `∫ f(x) dx = ${Ft} + C`];
  if (a === undefined || b === undefined) return { answer: `∫ (${ft}) dx = ${Ft} + C.`, lines, tip: 'Common mistake: forgetting + C on an indefinite integral. Differentiate your answer to check: you must get f(x) back.' };
  const Fa = evalP(F, a), Fb = evalP(F, b), val = Fb - Fa;
  lines.push(`F(b) = F(${sf(b, 5)}) = ${v(Fb, 5)} and F(a) = F(${sf(a, 5)}) = ${v(Fa, 5)}`, `∫ from ${sf(a, 5)} to ${sf(b, 5)} = F(b) − F(a) = ${q(Fb)} − ${q(Fa)} = ${v(val, 5)}`, 'The constant C cancels in a definite integral, so it is left out.');
  return { answer: `∫ from ${sf(a, 5)} to ${sf(b, 5)} of (${ft}) dx = ${v(val, 5)}${val < 0 ? ' (negative: the curve is mostly below the x-axis)' : ''}.`, lines, tip: 'Common mistake: F(a) − F(b) the wrong way round. It is always upper limit minus lower limit. Also, a negative answer is a signed area; area itself is positive, so split at the roots first.' };
}

export function areaBetween(fc: number[], gc: number[], a?: number, b?: number): SOut {
  const f = trimP(fc), g = trimP(gc), n = Math.max(f.length, g.length), pad = (p: Poly) => [...Array(n - p.length).fill(0), ...p];
  const h = trimP(pad(f).map((x, k) => x - pad(g)[k]));
  if (h.length === 1 && h[0] === 0) return { error: 'The two curves are the same, so the area between them is 0.' };
  const roots = realRoots(h), ht = polyText(h), lines = [`f(x) = ${polyText(f)} and g(x) = ${polyText(g)}`, `f(x) − g(x) = ${ht}`];
  let lo: number, hi: number;
  if (a === undefined || b === undefined) {
    if (roots.length < 2) return { error: 'These curves meet fewer than twice, so they do not enclose an area. Type a and b to find the area on an interval.' };
    lo = roots[0]; hi = roots[roots.length - 1]; lines.push(`They cross where f(x) = g(x), at x = ${roots.map((r) => v(r)).join(', ')}. Use the outer crossings as the limits.`);
  } else { if (!(a < b)) return { error: 'The start a must be smaller than the end b.' }; lo = a; hi = b; }
  const cuts = [lo, ...roots.filter((r) => r > lo + 1e-9 && r < hi - 1e-9), hi], H = antiP(h);
  let area = 0;
  for (let k = 0; k < cuts.length - 1; k++) {
    const part = evalP(H, cuts[k + 1]) - evalP(H, cuts[k]);
    area += Math.abs(part);
    lines.push(`From ${v(cuts[k])} to ${v(cuts[k + 1])}: ∫(f − g) dx = ${v(part, 5)}, ${part >= 0 ? 'f is above g' : 'g is above f'}, area ${v(Math.abs(part), 5)}`);
  }
  lines.push(`Total area = ${v(area, 5)} square units`);
  return { answer: `The area between the curves is ${v(area, 4)} square units.`, lines, tip: 'Common mistake: integrating f − g across a crossing point. Where the curves swap places the signed parts cancel, so split at every crossing and add the positive areas.' };
}

const fnOpts: [string, string][] = [['poly', 'Polynomial (type the coefficients)'], ...Object.entries(FUNS).map(([k, x]) => [k, x.label] as [string, string])];
export const RIEMANN_SPEC: SSpec = {
  id: 'riemann',
  finds: [['sum', 'Left, right, midpoint or trapezium sum'], ['exact', 'Integral of a polynomial'], ['area', 'Area between two polynomial curves']],
  fields: [
    { k: 'fn', label: 'Function f(x)', kind: 'choice', options: fnOpts, def: 'poly', show: (c) => c.find === 'sum' },
    { k: 'co', label: 'Coefficients of f(x), highest power first', kind: 'list', neg: true, ph: 'e.g. 1 0 0 for x²', show: (c) => (c.find === 'sum' && c.ch.fn === 'poly') || c.find === 'exact' || c.find === 'area' },
    { k: 'go', label: 'Coefficients of g(x), highest power first', kind: 'list', neg: true, ph: 'e.g. 1 0 for x', show: (c) => c.find === 'area' },
    { k: 'meth', label: 'Kind of sum', kind: 'choice', options: [['left', 'Left'], ['right', 'Right'], ['mid', 'Midpoint'], ['trap', 'Trapezium']], def: 'left', show: (c) => c.find === 'sum' },
    { k: 'a', label: 'From a', neg: true, ph: 'e.g. 0', optional: true, show: (c) => c.find !== 'sum' },
    { k: 'b', label: 'To b', neg: true, ph: 'e.g. 2', optional: true, show: (c) => c.find !== 'sum' },
    { k: 'sa', label: 'From a', neg: true, ph: 'e.g. 0', show: (c) => c.find === 'sum' },
    { k: 'sb', label: 'To b', neg: true, ph: 'e.g. 2', show: (c) => c.find === 'sum' },
    { k: 'n', label: 'Number of strips n', ph: 'e.g. 4', show: (c) => c.find === 'sum' },
  ],
  presets: [
    { name: 'Left sum of x² on [0, 2], 4 strips', find: 'sum', ch: { fn: 'poly', meth: 'left' }, vals: { co: '1 0 0', sa: '0', sb: '2', n: '4' } },
    { name: 'Trapezium rule for 1/x on [1, 2], 5 strips', find: 'sum', ch: { fn: 'recip', meth: 'trap' }, vals: { sa: '1', sb: '2', n: '5' } },
    { name: '∫ (3x² + 2x + 1) dx from 0 to 2', find: 'exact', vals: { co: '3 2 1', a: '0', b: '2' } },
    { name: 'Area between y = 4 − x² and y = x', find: 'area', vals: { co: '-1 0 4', go: '1 0' } },
  ],
  solve: (i: Record<string, SIn>, c) => {
    if (c.find === 'sum') {
      const id = c.ch.fn ?? 'poly';
      if (id === 'poly') { const co = i.co.list; return riemannSum((x) => evalP(co, x), polyText(co), i.sa.v, i.sb.v, i.n.v, c.ch.meth ?? 'left'); }
      return riemannSum(FUNS[id].f, FUNS[id].text, i.sa.v, i.sb.v, i.n.v, c.ch.meth ?? 'left');
    }
    if (i.a.blank !== i.b.blank) return { error: 'For limits give both a and b, or leave both blank.' };
    const a = i.a.blank ? undefined : i.a.v, b = i.b.blank ? undefined : i.b.v;
    if (c.find === 'exact') return exactIntegral(i.co.list, a, b);
    return areaBetween(i.co.list, i.go.list, a, b);
  },
};
