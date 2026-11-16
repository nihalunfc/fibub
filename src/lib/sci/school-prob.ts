// School probability (Class 12 maths): a two-stage tree with P(A), P(B | A) and P(B | A′); the joint
// probabilities, total probability P(B), Bayes' theorem P(A | B), an independence check, and the same
// numbers as whole counts out of 1000 (largest-remainder rounding so they always add to 1000). No DOM.

export function tree(pA: number, pBgA: number, pBgNA: number) {
  const AB = pA * pBgA, ANB = pA * (1 - pBgA), NAB = (1 - pA) * pBgNA, NANB = (1 - pA) * (1 - pBgNA);
  const pB = AB + NAB;
  return {
    AB, ANB, NAB, NANB, pB,
    pAgB: pB > 0 ? AB / pB : NaN,
    pAgNB: 1 - pB > 0 ? ANB / (1 - pB) : NaN,
    independent: Math.abs(pBgA - pBgNA) < 1e-12 || pA === 0 || pA === 1,
  };
}

/** Split N into whole counts in the given proportions, adding to exactly N (largest remainder). */
export function counts(props: number[], N = 1000): number[] {
  const raw = props.map((p) => p * N), base = raw.map(Math.floor);
  let left = N - base.reduce((s, x) => s + x, 0);
  const order = raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  for (let k = 0; left > 0; k++, left--) base[order[k % order.length][1]]++;
  return base;
}

// ---- Solve-my-numbers helpers (added 2026-11-16) ----

/** Read a chance typed as 0.25, 25%, 1/4 or .25. NaN when it is not a number from 0 to 1. */
export function readChance(s: string): number {
  let t = s.trim().replace(',', '.').replace('−', '-');
  if (!t) return NaN;
  let pct = false;
  if (t.endsWith('%')) { pct = true; t = t.slice(0, -1).trim(); }
  let v: number;
  const m = /^(-?\d*\.?\d+)\s*\/\s*(\d*\.?\d+)$/.exec(t);
  if (m) v = Number(m[2]) === 0 ? NaN : Number(m[1]) / Number(m[2]);
  else v = /^-?(\d+\.?\d*|\.\d+)$/.test(t) ? Number(t) : NaN;
  if (pct) v /= 100;
  return Number.isFinite(v) && v >= -1e-12 && v <= 1 + 1e-12 ? Math.min(1, Math.max(0, v)) : NaN;
}

export type BagResult = { ok: true; pA: number; pBgA: number; pBgNA: number; text: string } | { ok: false; why: string };
/** Two draws of red from a bag of red and blue marbles. A = first is red, B = second is red. */
export function bagTree(red: number, blue: number, replace: boolean): BagResult {
  if (![red, blue].every((v) => Number.isInteger(v) && v >= 0)) return { ok: false, why: 'Use whole numbers (0 or more) for the marbles.' };
  if (red + blue > 1000) return { ok: false, why: 'Use at most 1000 marbles in total.' };
  const n = red + blue;
  if (n === 0) return { ok: false, why: 'The bag is empty: add some marbles.' };
  if (!replace && n < 2) return { ok: false, why: 'Without putting the marble back you need at least 2 marbles to draw twice.' };
  const pA = red / n;
  const pBgA = replace ? red / n : red >= 1 ? (red - 1) / (n - 1) : 0;
  const pBgNA = replace ? red / n : Math.min(1, red / (n - 1));
  const text = blue === 0 ? `${red} red, 0 blue: every draw is red, so P(red first) = 1 and there is no blue-first branch.` : replace
    ? `${red} red, ${blue} blue, marble put back: P(red first) = ${red}/${n}, P(red second | red first) = ${red}/${n}, P(red second | blue first) = ${red}/${n}.`
    : `${red} red, ${blue} blue, marble kept out: P(red first) = ${red}/${n}, P(red second | red first) = ${Math.max(red - 1, 0)}/${n - 1}, P(red second | blue first) = ${red}/${n - 1}.`;
  return { ok: true, pA, pBgA, pBgNA, text };
}

/** The Bayes working with the numbers put in, one line per step, as an exam would show it. */
export function bayesWorking(pA: number, pBgA: number, pBgNA: number): string[] {
  const r = tree(pA, pBgA, pBgNA), f = (x: number) => String(parseFloat(x.toFixed(4)));
  const out = [
    `P(A ∩ B) = P(A) × P(B | A) = ${f(pA)} × ${f(pBgA)} = ${f(r.AB)}.`,
    `P(A′ ∩ B) = P(A′) × P(B | A′) = ${f(1 - pA)} × ${f(pBgNA)} = ${f(r.NAB)}.`,
    `P(B) = P(A ∩ B) + P(A′ ∩ B) = ${f(r.AB)} + ${f(r.NAB)} = ${f(r.pB)}  (total probability).`,
  ];
  out.push(Number.isNaN(r.pAgB) ? 'P(B) = 0, so P(A | B) is undefined: B can never happen.' : `P(A | B) = P(A ∩ B) / P(B) = ${f(r.AB)} / ${f(r.pB)} = ${f(r.pAgB)}  (Bayes' theorem).`);
  out.push(`Independent? P(A) × P(B) = ${f(pA * r.pB)} and P(A ∩ B) = ${f(r.AB)}: ${r.independent ? 'equal, so A and B are independent.' : 'not equal, so A and B are not independent.'}`);
  return out;
}
