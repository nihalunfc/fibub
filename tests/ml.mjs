// Checks for the ML foundations course maths (src/lib/ml/) against worked examples in the lessons.
// Run with `node tests/ml.mjs` (Node 22+ strips the TypeScript types itself).
import * as M from '../src/lib/ml/core.ts';
import * as M2 from '../src/lib/ml/models.ts';
import * as T from '../src/lib/ml/trees.ts';
import * as U from '../src/lib/ml/unsup.ts';
import * as N from '../src/lib/ml/nn.ts';
import * as X from '../src/lib/ml/text.ts';
import * as C from '../src/lib/ml/capstone.ts';

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

// Module 8 (src/lib/ml/unsup.ts).
// 8.1 worked example: centres A and D → (1.67, 9) and (9, 2), inertia 6.67.
{ const X = [[1, 9], [2, 8], [2, 10], [8, 2], [9, 3], [10, 1]];
  const s1 = U.kmeansStep(X, [[1, 9], [8, 2]]); ok(s1.lab.join() === '0,0,0,1,1,1', 'k-means assign');
  near(s1.C[0][0], 5 / 3, 1e-12, 'k-means centre 1'); near(s1.C[1][0], 9, 1e-12, 'k-means centre 2');
  const s2 = U.kmeansStep(X, s1.C); near(s2.inertia, 20 / 3, 1e-9, 'k-means inertia'); ok(s2.lab.join() === s1.lab.join(), 'k-means converged'); }
// 8.1 try it: 1, 2, 3, 10, 11, 12 from centres 1 and 2 → 2 and 11.
{ const X = [1, 2, 3, 10, 11, 12].map((v) => [v]); let C = [[1], [2]];
  const a = U.kmeansStep(X, C); near(a.C[1][0], 7.6, 1e-12, 'k-means 1-D step 1');
  const b = U.kmeansStep(X, a.C); near(b.C[0][0], 2, 1e-12, 'k-means 1-D centre'); near(b.C[1][0], 11, 1e-12, 'k-means 1-D centre 2'); }
// 8.2: silhouette for two tight, far apart groups is close to 1; random labels near 0.
{ const X = [[0, 0], [0, 1], [1, 0], [10, 10], [10, 11], [11, 10]]; ok(U.silhouette(X, [0, 0, 0, 1, 1, 1]) > 0.85, 'silhouette clear groups');
  ok(U.silhouette(X, [0, 1, 0, 1, 0, 1]) < 0.1, 'silhouette mixed labels'); }
// 8.3: average linkage on 10, 12, 30, 33, 60 merges at 2, 3, 20.5, 38.75; single linkage try-it at 1, 1, 4, 14.
{ const h = U.agglomerate([10, 12, 30, 33, 60].map((v) => [v]), 'average').map((m) => m.h);
  ok(h.map((v) => +v.toFixed(2)).join() === '2,3,20.5,38.75', 'average linkage heights ' + h.join());
  const g = U.agglomerate([0, 1, 5, 6, 20].map((v) => [v]), 'single').map((m) => m.h); ok(g.join() === '1,1,4,14', 'single linkage heights');
  const cut = U.cutTree(5, U.agglomerate([10, 12, 30, 33, 60].map((v) => [v])), 3); ok(new Set(cut).size === 3 && cut[0] === cut[1] && cut[2] === cut[3], 'cut into 3'); }
// 8.4: correlation 0.8 → PC1 keeps 90 %.
{ const R = M.rng(7), X = []; for (let i = 0; i < 4000; i++) { const a = R.normal(0, 1), e = R.normal(0, 1); X.push([a, 0.8 * a + 0.6 * e]); }
  const P = U.pca(X, 2); near(P.share[0], 0.9, 0.01, 'PC1 share'); near(Math.abs(P.comps[0][0]), Math.SQRT1_2, 0.02, 'PC1 direction'); }
// 8.5: z of 290 with mean 200, sd 25 is 3.6.
{ const z = U.zScores([0, 10]); near(z[1], 1, 1e-12, 'z-scores'); near((290 - 200) / 25, 3.6, 1e-12, 'z 3.6'); }

// Module 9 (src/lib/ml/nn.ts).
// 9.1: the perceptron learns AND by epoch 6, ending at w (2, 1), b −3.
{ const X = [[0, 0], [0, 1], [1, 0], [1, 1]], y = [0, 0, 0, 1], w = [0, 0], b = { v: 0 }; let ep = 0, wrong = 1;
  while (wrong && ep < 20) { wrong = N.perceptronEpoch(X, y, w, b); ep++; }
  ok(ep <= 7 && w.join() === '2,1' && b.v === -3, `perceptron AND (epochs ${ep}, w ${w}, b ${b.v})`); }
// 9.2 worked example at z = 1.2.
near(N.ACT.sigmoid.f(1.2), 0.769, 1e-3, 'sigmoid 1.2'); near(N.ACT.sigmoid.d(1.2), 0.178, 1e-3, 'sigmoid slope 1.2');
near(N.ACT.tanh.f(1.2), 0.834, 1e-3, 'tanh 1.2'); near(N.ACT.tanh.d(1.2), 0.305, 1e-3, 'tanh slope 1.2');
near(N.ACT.sigmoid.f(-2), 0.119, 1e-3, 'sigmoid −2'); near(N.ACT.tanh.d(-2), 0.071, 1e-3, 'tanh slope −2');
// 9.4 worked example: x 2, w1 0.5, ReLU, w2 1.5, b −0.5 → p 0.731, ∂L/∂w1 −0.807, loss 0.073 after one step at η 0.5.
{ const net = { sizes: [1, 1, 1], act: 'relu', W: [[[0.5]], [[1.5]]], B: [[0], [-0.5]] };
  near(N.forward(net, [2]).p, 0.731, 1e-3, 'backprop forward p'); const g = N.backward(net, [2], 1);
  near(g.loss, 0.313, 1e-3, 'backprop loss'); near(g.gW[1][0][0], -0.269, 1e-3, 'dL/dw2'); near(g.gW[0][0][0], -0.807, 1e-3, 'dL/dw1');
  net.W[0][0][0] -= 0.5 * g.gW[0][0][0]; net.W[1][0][0] -= 0.5 * g.gW[1][0][0]; net.B[1][0] -= 0.5 * g.gB[1][0]; // the lesson's network has no hidden bias
  near(net.W[0][0][0], 0.903, 1e-3, 'new w1'); near(N.backward(net, [2], 1).loss, 0.073, 1e-3, 'loss after one step'); }
// Gradient check on a small tanh network.
{ const net = N.makeNet([2, 3, 1], 'tanh', M.rng(2)), x = [0.3, -0.7], g = N.backward(net, x, 1), e = 1e-6;
  net.W[0][1][0] += e; const up = N.backward(net, x, 1).loss; net.W[0][1][0] -= 2 * e; const dn = N.backward(net, x, 1).loss; net.W[0][1][0] += e;
  near(g.gW[0][1][0], (up - dn) / (2 * e), 1e-6, 'gradient check'); }
// 9.3: a 2-3-1 network learns XOR.
{ const net = N.makeNet([2, 4, 1], 'tanh', M.rng(4)), X = [[0, 0], [0, 1], [1, 0], [1, 1]], y = [0, 1, 1, 0];
  for (let t = 0; t < 3000; t++) N.trainStep(net, X, y, 0.5); ok(X.every((x, i) => (N.forward(net, x).p > 0.5 ? 1 : 0) === y[i]), 'network learns XOR'); }
// 9.6 try it: [[1, 0], [0, −1]] on a 3 × 3 ramp gives −4 everywhere.
ok(N.conv2d([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[1, 0], [0, -1]]).flat().every((v) => v === -4), 'convolution −4');
ok(N.conv2d(Array.from({ length: 12 }, () => new Array(12).fill(0)), [[1, 1, 1], [1, 1, 1], [1, 1, 1]]).length === 10, 'output 10 × 10');
// 9.7 worked example: w 1, u 0.7 on 0, 1, 0, 0, 0 → 0.762, 0.488, 0.329, 0.226.
{ const h = N.rnn([0, 1, 0, 0, 0], 1, 0.7); ok(h.slice(1).map((v) => v.toFixed(3)).join() === '0.762,0.488,0.329,0.226', 'rnn echo ' + h.map((v) => v.toFixed(3))); }

// Module 10 (src/lib/ml/text.ts).
// 10.1 worked example: "great" 2.77, "screen" 0.69, "battery" 0.29, "the" 0; cosine 0.72 with counts, 0.07 with TF-IDF.
{ const D = ['the battery is great and the screen is great', 'the battery died fast and the charger is slow', 'the screen is bright and the camera is sharp', 'the charger is slow and the battery died'];
  const T = X.tfidf(D), w = (word) => T.w[0][T.vocab.indexOf(word)];
  near(w('great'), 2 * Math.log(4), 1e-12, 'tf-idf great'); near(w('screen'), Math.log(2), 1e-12, 'tf-idf screen'); near(w('battery'), Math.log(4 / 3), 1e-12, 'tf-idf battery'); near(w('the'), 0, 1e-12, 'tf-idf the');
  near(X.cosine(X.counts(D).tf[0], X.counts(D).tf[2]), 0.72, 0.005, 'cosine counts'); near(X.cosine(T.w[0], T.w[2]), 0.07, 0.005, 'cosine tf-idf');
  ok(X.cosine(T.w[1], T.w[3]) > X.cosine(T.w[1], T.w[0]), 'review 2 closest to review 4'); }
near(3 * Math.log(10 / 2), 4.83, 0.005, '10.1 try it'); near(X.cosine([1, 2, 2], [2, 1, 2]), 8 / 9, 1e-12, '10.2 cosine try it');
// 10.3: bigram counts and P(the cat sat) = 12/14 × 4/20 × 1/5.
{ const M = X.bigrams(`the cat sat on the mat. the cat ate the fish. the dog sat on the rug. the dog ate the bone.
a cat likes fish. a dog likes bones. the cat likes the sun. the dog likes the park.
the sun is warm. the park is big. the mat is warm. the fish is fresh.
the cat sleeps on the mat. the dog sleeps in the park.`);
  const P = (a, b) => (X.nextWords(M, a).find(([w]) => w === b) ?? [0, 0])[1];
  near(P('the', 'cat'), 0.2, 1e-12, 'P(cat | the)'); near(P('<s>', 'the') * P('the', 'cat') * P('cat', 'sat'), (12 / 14) * 0.2 * 0.2, 1e-12, 'P(the cat sat)');
  ok(X.nextWords(M, 'the')[0][0] === 'cat', 'most likely after the'); }
near(X.perplexity((X.crossEntropy([0.5], 0) + X.crossEntropy([0.125], 0)) / 2), 4, 1e-9, 'perplexity 4');
// Temperature: 0.5 squares the probabilities (10.7 worked example).
{ const p = X.softmax([0.55, 0.3, 0.08, 0.04, 0.03].map(Math.log), 0.5); near(p[0], 0.754, 1e-3, 'T 0.5 Canberra'); near(p[1], 0.224, 1e-3, 'T 0.5 Sydney'); }
{ const p = X.softmax([2, 0, 0]); near(p[0], 0.787, 1e-3, '10.4 try it softmax'); }
// 10.4 worked example: weights 0.576, 0.140, 0.284 and output (0.860, 0.424).
{ const I = [[1, 0], [0, 1]], A = X.attention([[1, 0]], I, I, I), q = [1, 0], K = [[2, 0], [0, 2], [1, 1]], V = [[1, 0], [0, 1], [1, 1]];
  const s = K.map((k) => X.dot(q, k) / Math.SQRT2), w = X.softmax(s), out = [0, 1].map((c) => w.reduce((t, wi, j) => t + wi * V[j][c], 0));
  near(w[0], 0.576, 1e-3, 'attention weight 1'); near(w[2], 0.284, 1e-3, 'attention weight 3'); near(out[0], 0.860, 1e-3, 'attention out x'); near(out[1], 0.424, 1e-3, 'attention out y');
  near(A.weights[0][0], 1, 1e-12, 'attention to self only');
  const Xs = [[1, 0], [0, 1], [1, 1]], C2 = X.attention(Xs, I, I, I, { causal: true }); ok(C2.weights[0][1] === 0 && C2.weights[1][2] === 0, 'causal mask');
  ok(C2.weights.every((r) => Math.abs(r.reduce((a, b) => a + b, 0) - 1) < 1e-12), 'attention rows add to 1'); }
// 10.5: layer norm of (1, 2, 3, 6).
{ const l = X.layerNorm([1, 2, 3, 6]); near(l[0], -1.069, 1e-3, 'layer norm 1'); near(l[3], 1.604, 1e-3, 'layer norm 6'); }
near(12 * 512 ** 2, 3145728, 0, 'block size');
// 10.6: losses 0.5, 0.25, 0.1, 0.8 → perplexity 3.16.
near(X.perplexity([0.5, 0.25, 0.1, 0.8].reduce((s, p) => s + X.crossEntropy([p], 0), 0) / 4), Math.sqrt(10), 1e-9, 'perplexity 3.16');
// Module 11 (src/lib/ml/capstone.ts): the forest wins with 300 days, linear wins with 20; day of month barely matters.
{ const D = C.shopSales(400, M.rng(8), 30), test = Array.from({ length: 100 }, (_, i) => 300 + i), tr = (n) => Array.from({ length: n }, (_, i) => i);
  const big = C.compareModels(D.X, D.y, tr(300), test, M.rng(2)).models.map((m) => m.mae), small = C.compareModels(D.X, D.y, tr(20), test, M.rng(2)).models.map((m) => m.mae);
  const r150 = C.compareModels(D.X, D.y, tr(150), test, M.rng(2));
  ok(big[3] < big[1] && big[1] < big[0], 'forest beats linear beats baseline (300 days)'); ok(small[1] < small[3] && small[2] > small[0], 'linear wins with 20 days, tree worse than baseline');
  near(r150.models[3].mae, 28.3, 0.05, 'capstone forest MAE'); near(r150.models[1].mae, 34.2, 0.05, 'capstone linear MAE'); ok(r150.importance[3] < 0.08, 'day of month unimportant'); }

if (fails) { console.error(`ml: ${fails} of ${n} checks failed`); process.exit(1); }
console.log(`ml: ${n} checks passed`);
