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
