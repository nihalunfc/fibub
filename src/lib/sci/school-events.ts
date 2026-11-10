// Event algebra (Class 11 maths, probability): a sample space drawn as a grid, events A and B as sets of
// outcomes, A ∪ B, A ∩ B, A′, A − B, and the addition rule P(A ∪ B) = P(A) + P(B) − P(A ∩ B), checked by
// counting and by simulation. Plain TypeScript, no DOM.
export type Space = 'dice' | 'coin-die';
export type Outcome = { a: number; b: number };   // dice: first and second die; coin-die: a = 1 for heads, 0 tails; b = die
export function outcomes(sp: Space): Outcome[] {
  const out: Outcome[] = [];
  if (sp === 'dice') { for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) out.push({ a, b }); }
  else for (const a of [1, 0]) for (let b = 1; b <= 6; b++) out.push({ a, b });
  return out;
}
export const label = (sp: Space, o: Outcome) => (sp === 'dice' ? `(${o.a}, ${o.b})` : `${o.a ? 'H' : 'T'}${o.b}`);

const isPrime = (n: number) => n > 1 && [...Array(Math.floor(Math.sqrt(n)) + 1).keys()].slice(2).every((d) => n % d);
export type EventDef = { id: string; text: (k: number) => string; test: (o: Outcome, k: number) => boolean; k?: [number, number, number] };
export const EVENTS: Record<Space, EventDef[]> = {
  dice: [
    { id: 'sum-eq', text: (k) => `the sum is ${k}`, test: (o, k) => o.a + o.b === k, k: [2, 12, 7] },
    { id: 'sum-ge', text: (k) => `the sum is ${k} or more`, test: (o, k) => o.a + o.b >= k, k: [2, 12, 9] },
    { id: 'sum-le', text: (k) => `the sum is ${k} or less`, test: (o, k) => o.a + o.b <= k, k: [2, 12, 4] },
    { id: 'double', text: () => 'a double (both dice the same)', test: (o) => o.a === o.b },
    { id: 'first-even', text: () => 'the first die is even', test: (o) => o.a % 2 === 0 },
    { id: 'second-odd', text: () => 'the second die is odd', test: (o) => o.b % 2 === 1 },
    { id: 'has', text: (k) => `at least one die shows ${k}`, test: (o, k) => o.a === k || o.b === k, k: [1, 6, 6] },
    { id: 'first-bigger', text: () => 'the first die is bigger than the second', test: (o) => o.a > o.b },
    { id: 'sum-prime', text: () => 'the sum is a prime number', test: (o) => isPrime(o.a + o.b) },
    { id: 'product-even', text: () => 'the product is even', test: (o) => (o.a * o.b) % 2 === 0 },
  ],
  'coin-die': [
    { id: 'head', text: () => 'the coin shows heads', test: (o) => o.a === 1 },
    { id: 'tail', text: () => 'the coin shows tails', test: (o) => o.a === 0 },
    { id: 'die-even', text: () => 'the die is even', test: (o) => o.b % 2 === 0 },
    { id: 'die-ge', text: (k) => `the die shows ${k} or more`, test: (o, k) => o.b >= k, k: [1, 6, 5] },
    { id: 'die-eq', text: (k) => `the die shows ${k}`, test: (o, k) => o.b === k, k: [1, 6, 3] },
    { id: 'die-prime', text: () => 'the die shows a prime', test: (o) => isPrime(o.b) },
  ],
};
export type Op = 'union' | 'inter' | 'notA' | 'AminusB' | 'BminusA' | 'xor';
export const OPS: { id: Op; sym: string; words: string }[] = [
  { id: 'union', sym: 'A ∪ B', words: 'A or B (or both)' },
  { id: 'inter', sym: 'A ∩ B', words: 'A and B' },
  { id: 'notA', sym: 'A′', words: 'not A' },
  { id: 'AminusB', sym: 'A − B', words: 'A but not B' },
  { id: 'BminusA', sym: 'B − A', words: 'B but not A' },
  { id: 'xor', sym: '(A − B) ∪ (B − A)', words: 'exactly one of A and B' },
];
export function inOp(op: Op, a: boolean, b: boolean): boolean {
  switch (op) { case 'union': return a || b; case 'inter': return a && b; case 'notA': return !a; case 'AminusB': return a && !b; case 'BminusA': return b && !a; case 'xor': return a !== b; }
}

const gcd = (x: number, y: number): number => (y ? gcd(y, x % y) : x);
/** A count out of a total as a fraction in lowest terms: 12/36 → "1/3". */
export function frac(n: number, d: number): string { if (n === 0) return '0'; if (n === d) return '1'; const g = gcd(n, d); return `${n / g}/${d / g}`; }

export function count(sp: Space, A: (o: Outcome) => boolean, B: (o: Outcome) => boolean) {
  const all = outcomes(sp);
  const nA = all.filter(A).length, nB = all.filter(B).length, nAB = all.filter((o) => A(o) && B(o)).length, nU = all.filter((o) => A(o) || B(o)).length;
  return { n: all.length, nA, nB, nAB, nU, exclusive: nAB === 0, exhaustive: nU === all.length };
}

/** A small seeded random number generator (mulberry32), so a test can repeat a run. */
export function rng(seed: number) { let t = seed >>> 0; return () => { t = (t + 0x6d2b79f5) >>> 0; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
/** Roll the experiment `trials` times; count how often the outcome is in A ∪ B (and A, B, A ∩ B). */
export function simulate(sp: Space, A: (o: Outcome) => boolean, B: (o: Outcome) => boolean, trials: number, rand: () => number) {
  let a = 0, b = 0, ab = 0, u = 0;
  for (let i = 0; i < trials; i++) {
    const o: Outcome = sp === 'dice' ? { a: 1 + Math.floor(rand() * 6), b: 1 + Math.floor(rand() * 6) } : { a: rand() < 0.5 ? 1 : 0, b: 1 + Math.floor(rand() * 6) };
    const x = A(o), y = B(o); if (x) a++; if (y) b++; if (x && y) ab++; if (x || y) u++;
  }
  return { trials, a, b, ab, u };
}
