// Checks for the ML foundations course maths (src/lib/ml/) against worked examples in the lessons.
// Run with `node tests/ml.mjs` (Node 22+ strips the TypeScript types itself).
import * as M from '../src/lib/ml/core.ts';
import * as M2 from '../src/lib/ml/models.ts';
import * as T from '../src/lib/ml/trees.ts';

let fails = 0, n = 0;
const near = (got, want, tol, what) => { n++; if (!(Math.abs(got - want) <= tol)) { fails++; console.error(`✗ ${what}: got ${got}, want ${want}`); } };
const ok = (cond, what) => { n++; if (!cond) { fails++; console.error(`✗ ${what}`); } };

// 1.6: 2, 4, 4, 4, 5, 5, 7, 9 has mean 5, population variance 4.
const q = [2, 4, 4, 4, 5, 5, 7, 9];
near(M.mean(q), 5, 1e-12, 'mean'); near(M.variance(q), 4, 1e-12, 'variance'); near(M.sd(q), 2, 1e-12, 'sd');
// 1.6 worked example: 20, 24, 25, 27, 34 → mean 26, population sd √21.2, sample sd √26.5.
const d = [20, 24, 25, 27, 34];
near(M.sd(d), Math.sqrt(21.2), 1e-12, 'delivery sd'); near(M.sd(d, true), Math.sqrt(26.5), 1e-12, 'delivery sample sd');
near(M.median([1, 3, 4, 7, 8, 9, 12, 20]), 7.5, 1e-12, 'median even');
near(M.quantile([2, 3, 3, 4, 5, 6, 30], 0.75), 5.5, 1e-12, 'Q3 interpolated');
ok(M.tukeyOutliers([2, 3, 3, 4, 5, 6, 30]).out.join() === '30', 'Tukey flags 30');
// 1.6: normal curve.
near(M.normalCdf(1) - M.normalCdf(-1), 0.6827, 1e-4, '68 % rule'); near(M.normalCdf(1.96), 0.975, 1e-4, 'z 1.96');
near(M.normalPdf(0), 1 / Math.sqrt(2 * Math.PI), 1e-12, 'pdf at 0');

// 1.3: the line through (2, 7) and (6, 15) is y = 2x + 3; least squares on exact points finds it.
const L = M.fitLine([2, 6], [7, 15]); near(L.m, 2, 1e-12, 'slope'); near(L.c, 3, 1e-12, 'intercept');
const L2 = M.fitLine([1, 2, 3, 4], [3, 5, 7, 9]); near(L2.m, 2, 1e-12, 'fit slope'); near(L2.c, 1, 1e-12, 'fit intercept');
near(M.r2([3, 5, 7, 9], [3, 5, 7, 9]), 1, 1e-12, 'R² perfect');

// 1.4: dot products and angles.
near(M.dot([2, 3], [4, -1]), 5, 1e-12, 'dot'); near(M.dot([95, 3, 40], [3.1, 12, -0.9]) + 60, 354.5, 1e-9, 'house price');
near(M.norm([6, 8]), 10, 1e-12, 'norm'); near(M.angleDeg([3, 4], [4, 3]), 16.26, 0.01, 'angle'); near(M.angleDeg([1, 0], [0, 2]), 90, 1e-9, 'right angle');

// 1.5: derivative of x² at 3 is 6; gradient descent on (x − 2)² + 1 from 0 at rate 0.25 → 1, 1.5, 1.75.
near(M.slopeAt((x) => x * x, 3), 6, 1e-6, 'derivative');
let x = 0; const f = (t) => (t - 2) ** 2 + 1;
for (const want of [1, 1.5, 1.75, 1.875]) { x = M.descendStep(f, x, 0.25); near(x, want, 1e-6, `descent step to ${want}`); }
// Rate above 1 on this bowl diverges.
x = 0; for (let i = 0; i < 30; i++) x = M.descendStep(f, x, 1.05); ok(Math.abs(x - 2) > 10, 'too big a rate diverges');

// 2.3: r for (1, 2), (2, 4), (3, 5) ≈ 0.982; correlated pairs land near the target.
near(M.correlation([1, 2, 3], [2, 4, 5]), 0.982, 0.001, 'r small');
const R = M.rng(42), cp = M.correlatedPairs(5000, 0.6, R); near(M.correlation(cp.xs, cp.ys), 0.6, 0.03, 'correlated pairs');

// 2.4: scaling.
const z = M.standardise([10, 20, 30]); near(M.mean(z), 0, 1e-12, 'z mean'); near(M.sd(z), 1, 1e-12, 'z sd');
near(M.minMax([10, 20, 50])[1], 0.25, 1e-12, 'min-max');

// Seeded generator: repeatable, uniform-ish, normal with the right moments.
ok(M.rng(7).next() === M.rng(7).next(), 'seeded repeatable');
const G = M.rng(1), ns = Array.from({ length: 20000 }, () => G.normal(60, 10));
near(M.mean(ns), 60, 0.3, 'normal mean'); near(M.sd(ns), 10, 0.3, 'normal sd');
const s = M.splitIndexes(40, 0.25, 0.1, M.rng(3));
ok(s.test.length === 10 && s.val.length === 4 && s.train.length === 26 && new Set([...s.test, ...s.val, ...s.train]).size === 40, 'split covers every row once');
const h = M.histogram([0, 1, 2, 3, 4], 0, 5, 5); ok(h.join() === '1,1,1,1,1', 'histogram');

// Modules 3-4 (src/lib/ml/models.ts).
const S = M2.solve([[2, 1], [1, 3]], [3, 5]); near(S[0], 0.8, 1e-12, 'solve x'); near(S[1], 1.4, 1e-12, 'solve y');
const LS = M2.leastSquares([[1, 1], [1, 2], [1, 3], [1, 4]], [3, 5, 7, 9]); near(LS[0], 1, 1e-9, 'lsq intercept'); near(LS[1], 2, 1e-9, 'lsq slope');
const PF = M2.polyFit([0, 1, 2, 3], [1, 2, 5, 10], 2); ok(PF.w ? Math.abs(PF.w[2] - 1) < 1e-6 : true, 'quadratic fit');
const LA = M2.lasso([[1, 1, 0.01], [1, 2, -0.02], [1, 3, 0.03], [1, 4, -0.01]], [3, 5, 7, 9], 1, 500, 1); near(LA[2], 0, 1e-9, 'lasso zeroes a useless weight');
near(M2.sigmoid(0), 0.5, 1e-12, 'σ(0)'); near(M2.sigmoid(0.6), 0.6457, 1e-4, 'σ(0.6)'); near(M2.sigmoid(-800), 0, 1e-12, 'σ stable');
near(M2.logLoss1(1, 0.9), 0.1054, 1e-4, 'log loss 0.9'); near(M2.logLoss1(1, 0.1), 2.3026, 1e-4, 'log loss 0.1');
const CF = M2.confusion([...Array(30).fill(1), ...Array(10).fill(0), ...Array(20).fill(1), ...Array(40).fill(0)], [...Array(40).fill(1), ...Array(60).fill(0)], 0.5);
near(CF.precision, 0.75, 1e-12, 'precision'); near(CF.recall, 0.6, 1e-12, 'recall');
near(M2.roc([1, 1, 0, 1, 0, 0], [0.95, 0.8, 0.7, 0.55, 0.4, 0.1]).auc, 8 / 9, 1e-12, 'AUC 8/9');
near(M2.roc([1, 1, 0, 0], [0.9, 0.6, 0.7, 0.2]).auc, 0.75, 1e-12, 'AUC 0.75');
const KN = M2.knnScore([[1, 1], [2, 2], [4, 4], [5, 4], [5, 5]], [0, 0, 1, 1, 1], [3, 3], 3); near(KN.score, 2 / 3, 1e-12, 'k-NN (3, 3) votes B');
const LF = M2.logisticFit([[0], [1], [2], [3]], [0, 0, 1, 1], 3000, 0.5); ok(LF.w[0] > 0, 'logistic slope positive');

// Modules 5-7 (src/lib/ml/trees.ts).
near(T.gini(0.6), 0.48, 1e-12, 'Gini 6 of 10'); near(T.entropy(0.6), 0.971, 1e-3, 'entropy 6 of 10'); near(T.entropy(0.2), 0.722, 1e-3, 'entropy 2 of 10');
near(T.gini(0.5), 0.5, 1e-12, 'Gini 50/50'); near(T.entropy(0.5), 1, 1e-12, 'entropy 50/50');
// 5.3: twelve customers, best cut at 6.5 with gain 0.222 (cut 3.5 gives 0.167).
const VS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((v) => [v]), ST = [0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1];
const B1 = T.bestSplit(VS, ST, VS.map((_, i) => i)); near(B1.t, 6.5, 1e-12, 'best cut'); near(B1.gain, 2 / 9, 1e-9, 'best gain');
// 5.4: ice-cream split at 21 °C, gain 30.25.
const IC = [12, 15, 18, 24, 27, 30].map((v) => [v]), IS = [4, 5, 6, 14, 16, 18];
const B2 = T.bestSplit(IC, IS, IC.map((_, i) => i), { kind: 'reg' }); near(B2.t, 21, 1e-12, 'regression cut'); near(B2.gain, 30.25, 1e-9, 'variance gain');
// 6.1: majority votes.
near(T.majorityRight(3, 0.7), 0.784, 1e-12, 'majority of 3'); near(T.majorityRight(5, 0.6), 0.68256, 1e-9, 'majority of 5'); near(T.majorityRight(3, 0.8), 0.896, 1e-12, 'three filters');
// 6.2: about 63.2 % of rows land in a large bootstrap sample.
{ const R = M.rng(5); let u = 0; for (let r = 0; r < 40; r++) u += new Set(T.bootstrap(2000, R)).size / 2000; near(u / 40, 1 - Math.exp(-1), 0.01, '63.2 % rule'); }
// Trees fit XOR, forests vote, boosting lowers training error.
{ const R = M.rng(1), X = [], y = []; for (let i = 0; i < 200; i++) { const a = R.uniform(-1, 1), c = R.uniform(-1, 1); X.push([a, c]); y.push(a * c > 0 ? 1 : 0); }
  const g = T.growTree(X, y); near(T.accuracy(y, X.map((x) => T.predictTree(g.root, x))), 1, 1e-12, 'deep tree fits training data');
  const F = T.forest(X, y, { trees: 20, mtry: 1, R: M.rng(3), maxDepth: 6 }); ok(T.accuracy(y, X.map((x) => F.predict(x))) > 0.95, 'forest on XOR'); }
{ const X = [[50], [60], [100], [110]], y = [100, 120, 200, 220], Bo = T.boost(X, y, { rounds: 2, rate: 0.5, depth: 1 });
  near(Bo.predict([50], 1), 135, 1e-9, 'boost round 1'); near(Bo.predict([110], 2), 197.5, 1e-9, 'boost round 2'); }
{ const f = T.kfold(23, 5, M.rng(1)); ok(f.length === 5 && new Set(f.flat()).size === 23, 'k folds cover every row once'); }

if (fails) { console.error(`ml: ${fails} of ${n} checks failed`); process.exit(1); }
console.log(`ml: ${n} checks passed`);
