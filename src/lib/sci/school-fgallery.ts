// Function gallery (Class 11 maths, relations and functions): the standard real functions with their domain
// and range, and f + g, f − g, f × g and f ÷ g built from two of them. Plain TypeScript, no DOM.

export type Fn = (x: number) => number;
/** A gallery function. `inDomain` says where it is defined; `domain` and `range` are the textbook sets. */
export type GFn = { id: string; label: string; rule: string; f: Fn; inDomain: (x: number) => boolean; domain: string; range: string; note: string; jumps?: boolean; rangeBand: [number, number][]; domainBand: [number, number][] };

const all = () => true;
const INF = Infinity;
/** Greatest integer function [x]: the largest integer not more than x. */
export const gif = (x: number) => Math.floor(x + 1e-12);
/** Signum: 1 for x > 0, 0 at 0, −1 for x < 0. */
export const sgn = (x: number) => (x > 0 ? 1 : x < 0 ? -1 : 0);

export const GALLERY: GFn[] = [
  { id: 'identity', label: 'Identity', rule: 'f(x) = x', f: (x) => x, inDomain: all, domain: 'R (all real numbers)', range: 'R', note: 'Every input comes back unchanged: the line y = x.', domainBand: [[-INF, INF]], rangeBand: [[-INF, INF]] },
  { id: 'constant', label: 'Constant', rule: 'f(x) = 3', f: () => 3, inDomain: all, domain: 'R', range: '{3}', note: 'Every input gives the same output: a horizontal line.', domainBand: [[-INF, INF]], rangeBand: [[3, 3]] },
  { id: 'square', label: 'Square (polynomial)', rule: 'f(x) = x²', f: (x) => x * x, inDomain: all, domain: 'R', range: '[0, ∞), the non-negative reals', note: 'A parabola. x and −x give the same output, so it is many-one.', domainBand: [[-INF, INF]], rangeBand: [[0, INF]] },
  { id: 'cube', label: 'Cube (polynomial)', rule: 'f(x) = x³', f: (x) => x * x * x, inDomain: all, domain: 'R', range: 'R', note: 'Every real number is the cube of exactly one real number.', domainBand: [[-INF, INF]], rangeBand: [[-INF, INF]] },
  { id: 'reciprocal', label: 'Reciprocal', rule: 'f(x) = 1/x', f: (x) => 1 / x, inDomain: (x) => x !== 0, domain: 'R − {0}', range: 'R − {0}', note: 'Not defined at 0 (you cannot divide by zero), and it never reaches 0. A rectangular hyperbola.', domainBand: [[-INF, 0], [0, INF]], rangeBand: [[-INF, 0], [0, INF]] },
  { id: 'modulus', label: 'Modulus', rule: 'f(x) = |x|', f: Math.abs, inDomain: all, domain: 'R', range: '[0, ∞)', note: '|x| = x when x ≥ 0 and −x when x < 0: a V shape.', domainBand: [[-INF, INF]], rangeBand: [[0, INF]] },
  { id: 'signum', label: 'Signum', rule: 'f(x) = |x|/x for x ≠ 0, f(0) = 0', f: sgn, inDomain: all, domain: 'R', range: '{−1, 0, 1}', note: 'Only tells you the sign of x: 1 if positive, −1 if negative, 0 at 0.', jumps: true, domainBand: [[-INF, INF]], rangeBand: [[-1, -1], [0, 0], [1, 1]] },
  { id: 'gif', label: 'Greatest integer', rule: 'f(x) = [x]', f: gif, inDomain: all, domain: 'R', range: 'Z (the integers)', note: '[x] is the largest integer not more than x, so [2.7] = 2 and [−2.7] = −3. A staircase.', jumps: true, domainBand: [[-INF, INF]], rangeBand: [] },
  { id: 'sqrt', label: 'Square root', rule: 'f(x) = √x', f: Math.sqrt, inDomain: (x) => x >= 0, domain: '[0, ∞)', range: '[0, ∞)', note: 'Only defined for x ≥ 0 in the real numbers.', domainBand: [[0, INF]], rangeBand: [[0, INF]] },
  { id: 'exp', label: 'Exponential', rule: 'f(x) = 2ˣ', f: (x) => 2 ** x, inDomain: all, domain: 'R', range: '(0, ∞)', note: 'Always positive; doubles each time x goes up by 1.', domainBand: [[-INF, INF]], rangeBand: [[0, INF]] },
  { id: 'log', label: 'Logarithm', rule: 'f(x) = log₂ x', f: Math.log2, inDomain: (x) => x > 0, domain: '(0, ∞)', range: 'R', note: 'The mirror image of 2ˣ in the line y = x: defined only for x > 0.', domainBand: [[0, INF]], rangeBand: [[-INF, INF]] },
];
export const gfn = (id: string) => GALLERY.find((g) => g.id === id)!;

/** Value of a gallery function, NaN outside its domain. */
export const at = (g: GFn, x: number) => (g.inDomain(x) ? g.f(x) : NaN);

/** Simple functions to combine: linear a x + b, x², √x, 1/x, |x|. */
export type Part = { kind: 'lin' | 'sq' | 'sqrt' | 'rec' | 'abs'; a: number; b: number };
export function partFn(p: Part): Fn {
  switch (p.kind) {
    case 'lin': return (x) => p.a * x + p.b;
    case 'sq': return (x) => p.a * x * x + p.b;
    case 'sqrt': return (x) => (x >= 0 ? p.a * Math.sqrt(x) + p.b : NaN);
    case 'rec': return (x) => (x !== 0 ? p.a / x + p.b : NaN);
    case 'abs': return (x) => p.a * Math.abs(x) + p.b;
  }
}
const n = (v: number) => (Number.isInteger(v) ? String(v) : String(+v.toFixed(3))).replace('-', '−');
const plus = (b: number) => (b === 0 ? '' : b > 0 ? ` + ${n(b)}` : ` − ${n(-b)}`);
const coef = (a: number, t: string) => (a === 1 ? t : a === -1 ? `−${t}` : `${n(a)}${t}`);
export function partText(p: Part): string {
  if (p.a === 0) return n(p.b);
  switch (p.kind) {
    case 'lin': return coef(p.a, 'x') + plus(p.b);
    case 'sq': return coef(p.a, 'x²') + plus(p.b);
    case 'sqrt': return coef(p.a, '√x') + plus(p.b);
    case 'rec': return (p.a === 1 ? '1/x' : `${n(p.a)}/x`) + plus(p.b);
    case 'abs': return coef(p.a, '|x|') + plus(p.b);
  }
}
/** Where a part is defined, as a test. */
export const partDomain = (p: Part) => (x: number) => (p.kind === 'sqrt' ? x >= 0 : p.kind === 'rec' ? x !== 0 : true);

export type Op = '+' | '-' | '*' | '/';
export function combine(op: Op, f: Fn, g: Fn): Fn {
  return (x) => {
    const a = f(x), b = g(x);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
    return op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : b === 0 ? NaN : a / b;
  };
}

/** Zeros of g in [lo, hi]: sign changes (refined by bisection) and touching zeros found on a fine grid. */
export function zeros(g: Fn, lo: number, hi: number, steps = 4000): number[] {
  const out: number[] = [];
  const push = (z: number) => { const r = Math.abs(z - Math.round(z)) < 1e-7 ? Math.round(z) : z; if (!out.some((o) => Math.abs(o - r) < 1e-6)) out.push(r === 0 ? 0 : r); };
  let px = lo, pv = g(lo);
  if (pv === 0) push(lo);
  for (let i = 1; i <= steps; i++) {
    const x = lo + ((hi - lo) * i) / steps, v = g(x);
    if (v === 0) push(x);
    else if (Number.isFinite(v) && Number.isFinite(pv) && pv !== 0 && Math.sign(v) !== Math.sign(pv) && Math.abs(v - pv) < 1e3) {
      let a = px, b = x, fa = pv;
      for (let k = 0; k < 80; k++) { const m = (a + b) / 2, fm = g(m); if (fm === 0) { a = b = m; break; } if (Math.sign(fm) === Math.sign(fa)) { a = m; fa = fm; } else b = m; }
      push((a + b) / 2);
    }
    px = x; pv = v;
  }
  return out.sort((a, b) => a - b);
}

/** Domain of the combination in words. f + g, f − g and fg live where both do; f/g also needs g(x) ≠ 0. */
export function combinedDomain(op: Op, f: Part, g: Part, lo = -50, hi = 50): string {
  if (op === '/' && g.a === 0 && g.b === 0) return 'empty: g(x) = 0 for every x, so f/g is never defined';
  const needPos = (f.kind === 'sqrt' && f.a !== 0) || (g.kind === 'sqrt' && g.a !== 0);
  const E: number[] = [];
  if ((f.kind === 'rec' && f.a !== 0) || (g.kind === 'rec' && g.a !== 0)) E.push(0);
  if (op === '/') E.push(...zeros(partFn(g), needPos ? 0 : lo, hi));
  let ex = [...new Set(E.map((z) => +z.toFixed(4)))].filter((z) => !needPos || z >= 0).sort((a, b) => a - b);
  let base = needPos ? '[0, ∞)' : 'R';
  if (needPos && ex.includes(0)) { base = '(0, ∞)'; ex = ex.filter((z) => z !== 0); }
  return ex.length ? `${base} − {${ex.map(n).join(', ')}}` : base;
}
