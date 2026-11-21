// Checks for the ML foundations course maths (src/lib/ml/) against worked examples in the lessons.
// Run with `node tests/ml.mjs` (Node 22+ strips the TypeScript types itself).
import * as M from '../src/lib/ml/core.ts';

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

if (fails) { console.error(`ml: ${fails} of ${n} checks failed`); process.exit(1); }
console.log(`ml: ${n} checks passed`);
