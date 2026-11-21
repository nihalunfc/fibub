// The capstone of the ML foundations course (11.1): made-up daily sales for a small shop, and a fair comparison of
// four models on the same held-out days. Plain TypeScript with no DOM, checked in tests/ml.mjs.
import { mean, type Rng } from './core.ts';
import { leastSquares } from './models.ts';
import { growTree, predictTree, forest } from './trees.ts';

export const SHOP_COLS = ['temperature (°C)', 'weekend', 'promotion', 'day of month'];

/**
 * One row per day: temperature, weekend (0/1), promotion (0/1), day of month (no real effect). Sales rise with
 * warmth up to 22 °C, fall again above 26 °C, jump at weekends and with a promotion, most with both.
 */
export function shopSales(n: number, R: Rng, noise = 30) {
  const X: number[][] = [], y: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = Math.round(R.uniform(-5, 32)), w = R.next() < 2 / 7 ? 1 : 0, p = R.next() < 0.25 ? 1 : 0, d = Math.floor(R.uniform(1, 29));
    X.push([t, w, p, d]);
    y.push(Math.round(300 + 8 * Math.min(t, 22) - 10 * Math.max(0, t - 26) + 120 * w + 60 * p + 60 * p * w + R.normal(0, noise)));
  }
  return { X, y };
}

/** Fit four models on the first `nTrain` rows and score each by mean absolute error on the `test` rows. */
export function compareModels(X: number[][], y: number[], train: number[], test: number[], R: Rng) {
  const Xt = train.map((i) => X[i]), yt = train.map((i) => y[i]);
  const mae = (f: (x: number[]) => number) => mean(test.map((i) => Math.abs(y[i] - f(X[i]))));
  const avg = mean(yt), w = leastSquares(Xt.map((x) => [1, ...x]), yt);
  const tree = growTree(Xt, yt, { kind: 'reg', maxDepth: 4, minLeaf: 5 });
  const F = forest(Xt, yt, { kind: 'reg', trees: 40, mtry: 2, R, minLeaf: 3 });
  return {
    models: [
      { name: 'Average of training days', mae: mae(() => avg) },
      { name: 'Linear regression', mae: mae((x) => [1, ...x].reduce((s, v, j) => s + v * w[j], 0)) },
      { name: 'Decision tree (depth 4)', mae: mae((x) => predictTree(tree.root, x)) },
      { name: 'Random forest (40 trees)', mae: mae((x) => F.predict(x)) },
    ],
    weights: w, importance: F.importance,
  };
}
