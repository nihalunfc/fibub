// "Think of a number" tricks as algebra: every step keeps the expression in the form a·n + b, with a and b exact
// fractions, so the page can show why the answer never depends on n (a = 0) or how to read n back from the answer.
// Plain TypeScript, no DOM.

export type Frac = { p: number; q: number };
export type Op = 'add' | 'sub' | 'mul' | 'div' | 'addn' | 'subn';
export type Step = { op: Op; k: number };
/** An expression a·n + b. */
export type Lin = { a: Frac; b: Frac };

const g = (a: number, b: number): number => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
export const F = (p: number, q = 1): Frac => { if (q === 0) throw new Error('divide by zero'); if (q < 0) { p = -p; q = -q; } const d = g(p, q); return { p: p / d, q: q / d }; };
export const fadd = (x: Frac, y: Frac) => F(x.p * y.q + y.p * x.q, x.q * y.q);
export const fmul = (x: Frac, y: Frac) => F(x.p * y.p, x.q * y.q);
export const fval = (x: Frac) => x.p / x.q;
export const ftext = (x: Frac) => (x.q === 1 ? String(x.p) : `${x.p}/${x.q}`).replace('-', '−');

/** Apply one step to a·n + b. */
export function apply(e: Lin, s: Step): Lin {
  const k = F(s.k);
  switch (s.op) {
    case 'add': return { a: e.a, b: fadd(e.b, k) };
    case 'sub': return { a: e.a, b: fadd(e.b, F(-s.k)) };
    case 'mul': return { a: fmul(e.a, k), b: fmul(e.b, k) };
    case 'div': if (s.k === 0) throw new Error('divide by zero'); return { a: fmul(e.a, F(1, s.k)), b: fmul(e.b, F(1, s.k)) };
    case 'addn': return { a: fadd(e.a, F(1)), b: e.b };
    case 'subn': return { a: fadd(e.a, F(-1)), b: e.b };
  }
}

/** The expression after each step, starting with n itself. */
export function trace(steps: Step[]): Lin[] {
  const out: Lin[] = [{ a: F(1), b: F(0) }];
  for (const s of steps) out.push(apply(out[out.length - 1], s));
  return out;
}

/** The value of a·n + b for a number n. */
export const at = (e: Lin, n: number) => fval(e.a) * n + fval(e.b);

/** Text of a·n + b, written the way a student would: "2n + 10", "n", "5", "3n/2 − 1", "0". */
export function linText(e: Lin, v = 'n'): string {
  const parts: string[] = [];
  const { p, q } = e.a;
  if (p !== 0) {
    const ap = Math.abs(p), coef = ap === 1 ? v : `${ap}${v}`;
    parts.push((p < 0 ? '−' : '') + (q === 1 ? coef : `${coef}/${q}`));
  }
  if (e.b.p !== 0 || parts.length === 0) {
    const t = ftext(F(Math.abs(e.b.p), e.b.q));
    if (parts.length === 0) parts.push(ftext(e.b)); else parts.push(`${e.b.p < 0 ? '−' : '+'} ${t}`);
  }
  return parts.join(' ');
}

/** Words for a step. */
export function stepText(s: Step): string {
  switch (s.op) {
    case 'add': return `Add ${s.k}`;
    case 'sub': return `Take away ${s.k}`;
    case 'mul': return s.k === 2 ? 'Double it' : s.k === 3 ? 'Treble it' : `Multiply by ${s.k}`;
    case 'div': return s.k === 2 ? 'Halve it' : `Divide by ${s.k}`;
    case 'addn': return 'Add the number you first thought of';
    case 'subn': return 'Take away the number you first thought of';
  }
}

/** What the trick does: always the same answer, or an answer the trickster can turn back into n. */
export function verdict(e: Lin): { kind: 'constant'; value: Frac } | { kind: 'reveal'; a: Frac; b: Frac } {
  return e.a.p === 0 ? { kind: 'constant', value: e.b } : { kind: 'reveal', a: e.a, b: e.b };
}

/** Undo the trick: from the final answer back to the starting number (when a ≠ 0). */
export const reveal = (e: Lin, answer: number) => (answer - fval(e.b)) / fval(e.a);

export const TRICKS: { id: string; name: string; steps: Step[] }[] = [
  { id: 'five', name: 'Always 5', steps: [{ op: 'mul', k: 2 }, { op: 'add', k: 10 }, { op: 'div', k: 2 }, { op: 'subn', k: 0 }] },
  { id: 'three', name: 'Always 3', steps: [{ op: 'add', k: 3 }, { op: 'mul', k: 2 }, { op: 'sub', k: 2 }, { op: 'div', k: 2 }, { op: 'add', k: 1 }, { op: 'subn', k: 0 }] },
  { id: 'seven', name: 'Always 7', steps: [{ op: 'mul', k: 3 }, { op: 'add', k: 21 }, { op: 'div', k: 3 }, { op: 'subn', k: 0 }] },
  { id: 'mind', name: 'Mind reader', steps: [{ op: 'mul', k: 5 }, { op: 'add', k: 6 }, { op: 'mul', k: 4 }, { op: 'add', k: 9 }, { op: 'mul', k: 5 }] },
  { id: 'back', name: 'Back to you', steps: [{ op: 'mul', k: 4 }, { op: 'add', k: 8 }, { op: 'div', k: 4 }, { op: 'sub', k: 2 }] },
];
