// Live problems for ML foundations, part c: Modules 7-9 (see ../problems.js).
import { pick, n, steps, table } from './util.js';

const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
/** Pick one item of a list with the random number generator. */
const one = (r, list) => list[Math.min(list.length - 1, Math.floor(r() * list.length))];

export default {
  // ---------- Module 7: models that hold up ----------
  'bias-variance-error': {
    title: 'split a forecast error into bias and variance',
    make(r) {
      const T = pick(r, 20, 40);
      const b = one(r, [-2, -1.5, -1, 1, 1.5, 2, 2.5, 3]);
      const d = one(r, [[0, 1, 0, -1, 0], [1, -1, 0, 1, -1], [0, 2, -1, -1, 0], [2, 0, -2, 1, -1], [-1, 3, -1, 0, -1]]);
      const preds = d.map((v) => T + b + v);
      const avg = mean(preds), bias2 = (avg - T) ** 2, vr = mean(preds.map((p) => (p - avg) ** 2));
      const answer = bias2 + vr;
      return {
        q: `<p>A bakery's model says how many dozen croissants will sell next Monday. Mondays really average <b>${T} dozen</b>. The same kind of model is trained five times, each on a different year of data, and predicts: <b>${preds.join(', ')}</b> dozen.</p><p>Work out bias² + variance (divide by 5 for the variance). This is the average squared error these models make, before noise is added.</p>`,
        answer, unit: 'dozen²', tol: 0.01,
        hint: 'First average the five predictions. Bias² is (average − truth)². Variance is the average of (prediction − average)². Add them.',
        solution: steps(
          `Average prediction: (${preds.join(' + ')}) ÷ 5 = ${n(avg, 4)}.`,
          `Bias² = (${n(avg, 4)} − ${T})² = ${n(bias2, 4)}. The models miss by ${n(Math.abs(avg - T), 3)} dozen on average, all in the same direction.`,
          `Variance = average of (prediction − ${n(avg, 4)})² = (${preds.map((p) => n((p - avg) ** 2, 3)).join(' + ')}) ÷ 5 = ${n(vr, 4)}.`,
          `Bias² + variance = <b>${n(answer, 4)} dozen²</b>. Check: the average of (prediction − ${T})² gives the same number.`),
        preds, T,
      };
    },
    verify: (p) => mean(p.preds.map((x) => (x - p.T) ** 2)),
  },
  'cross-validation-sd': {
    title: 'mean and spread of five fold scores',
    make(r) {
      const m = pick(r, 76, 90);
      const d = one(r, [[-1, 3, -3, 1, 0], [2, -2, 1, -1, 0], [0, 2, -2, 3, -3], [1, 1, -2, 2, -2], [-4, 2, 1, 0, 1]]);
      const s = d.map((v) => m + v);
      const sd = Math.sqrt(s.reduce((a, v) => a + (v - m) ** 2, 0) / 4);
      return {
        q: `<p>A model that flags late deliveries is checked with 5-fold cross-validation. Its accuracy in the five folds is <b>${s.join(' %, ')} %</b>. What is the standard deviation of the five scores (divide by k − 1 = 4)?</p>`,
        answer: sd, unit: 'percentage points', tol: 0.01,
        hint: 'Find the mean first. Then square each score\'s distance from the mean, add the squares, divide by 4 and take the square root.',
        solution: steps(
          `Mean: (${s.join(' + ')}) ÷ 5 = ${m} %.`,
          `Distances from the mean: ${d.join(', ')}. Squares: ${d.map((v) => v * v).join(', ')}, which add up to ${d.reduce((a, v) => a + v * v, 0)}.`,
          `Divide by 4: ${n(d.reduce((a, v) => a + v * v, 0) / 4, 4)}. Square root: <b>${n(sd, 3)} points</b>.`,
          `Report it as ${m} % ± ${n(sd, 2)}. A rival model needs to beat ${m} % by clearly more than that to be truly better.`),
        s,
      };
    },
    verify: (p) => { const k = p.s.length, m = mean(p.s); return Math.sqrt((p.s.reduce((a, v) => a + v * v, 0) - k * m * m) / (k - 1)); },
  },
  'cross-validation-rows': {
    title: 'how much data each fold model sees',
    make(r) {
      const k = one(r, [4, 5, 8, 10]);
      const nRows = pick(r, 30, 150) * 40;
      const answer = (nRows * (k - 1)) / k;
      return {
        q: `<p>A gym has <b>${nRows.toLocaleString('en-CA')}</b> member records and runs <b>${k}-fold</b> cross-validation to predict who will cancel. How many rows does each of the ${k} models train on?</p>`,
        answer, unit: 'rows', tol: 0.001,
        hint: `The rows are cut into ${k} equal folds. Each model is tested on one fold and trains on all the others.`,
        solution: steps(
          `One fold holds ${nRows.toLocaleString('en-CA')} ÷ ${k} = ${(nRows / k).toLocaleString('en-CA')} rows.`,
          `Each model trains on the other ${k - 1} folds: ${k - 1} × ${(nRows / k).toLocaleString('en-CA')} = <b>${answer.toLocaleString('en-CA')} rows</b>.`,
          `That is ${n(100 * (k - 1) / k, 3)} % of the data, so each fold model is almost as good as one trained on everything.`),
        k, nRows,
      };
    },
    verify: (p) => p.nRows - p.nRows / p.k,
  },
  'hyperparameters-grid-count': {
    title: 'count the models a grid search trains',
    make(r) {
      const a = pick(r, 3, 6), b = pick(r, 2, 4), c = pick(r, 2, 3), k = one(r, [3, 5, 10]);
      const answer = a * b * c * k + 1;
      return {
        q: `<p>You tune a random forest that predicts which shoppers will use a coupon. The grid tries <b>${a}</b> values of tree depth, <b>${b}</b> values of smallest leaf and <b>${c}</b> values of columns per split. Each setting is scored with <b>${k}-fold</b> cross-validation, and the winner is refitted once on all the training data. How many forests are trained in total?</p>`,
        answer, unit: 'forests', tol: 0.001,
        hint: 'A grid tries every combination: multiply the counts. Each combination is trained once per fold. Do not forget the final refit.',
        solution: steps(
          `Combinations: ${a} × ${b} × ${c} = ${a * b * c}.`,
          `Each is trained ${k} times (once per fold): ${a * b * c} × ${k} = ${a * b * c * k}.`,
          `Plus the final refit: <b>${answer} forests</b>. Add one more setting with 5 values and the count would be five times bigger, which is why big grids get slow.`),
        a, b, c, k,
      };
    },
    verify: (p) => { let t = 0; for (let i = 0; i < p.a; i++) for (let j = 0; j < p.b; j++) for (let l = 0; l < p.c; l++) t += p.k; return t + 1; },
  },
  'hyperparameters-random-hit': {
    title: 'chance that random search finds a good setting',
    make(r) {
      const N = pick(r, 10, 60, 5), pc = one(r, [2, 5, 10]);
      const answer = 100 * (1 - (1 - pc / 100) ** N);
      return {
        q: `<p>Only the best <b>${pc} %</b> of all possible settings of a model count as "great". Random search tries <b>${N}</b> settings, each drawn at random. What is the chance, in %, that at least one of them is great?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: `Work out the chance that every try misses. One try misses with chance ${1 - pc / 100}. The tries are independent, so multiply.`,
        solution: steps(
          `One try misses the best ${pc} % with chance ${1 - pc / 100}.`,
          `All ${N} tries miss: ${1 - pc / 100}<sup>${N}</sup> = ${n((1 - pc / 100) ** N, 3)}.`,
          `At least one hits: 1 − ${n((1 - pc / 100) ** N, 3)} = <b>${n(answer, 3)} %</b>. This does not depend on how many hyperparameters there are, which is why random search works so well.`),
        N, pc,
      };
    },
    verify: (p) => 100 * (1 - Math.exp(p.N * Math.log(1 - p.pc / 100))),
  },
  'data-leakage-duplicates': {
    title: 'the real score once duplicates are removed',
    make(r) {
      const s = pick(r, 20, 40, 5), aNew = pick(r, 70, 85);
      const overall = +((s * 99 + (100 - s) * aNew) / 100).toFixed(1);
      const answer = (overall * 100 - s * 99) / (100 - s);
      return {
        q: `<p>A model that sorts customer emails scores <b>${overall} %</b> on 2,000 test emails. Later you find that <b>${s} %</b> of the test emails were near-copies of training emails, and on those it scores 99 %. What is its accuracy on the genuinely new emails?</p>`,
        answer, unit: '%', tol: 0.005,
        hint: 'The overall score is a weighted average of the two kinds of email. Count correct answers: total correct minus correct copies, divided by the number of new emails.',
        solution: steps(
          `Correct overall: ${overall} % of 2,000 = ${n(overall * 20, 5)}.`,
          `Copies: ${s} % of 2,000 = ${s * 20} emails, 99 % right = ${n(s * 20 * 0.99, 5)} correct.`,
          `New emails: ${2000 - s * 20}, with ${n(overall * 20 - s * 20 * 0.99, 5)} correct, so <b>${n(answer, 3)} %</b>. That is the score to report; the leak made the model look ${n(overall - answer, 2)} points better than it is.`),
        s, overall,
      };
    },
    verify: (p) => { const N = 2000, copies = (p.s / 100) * N; return (100 * ((p.overall / 100) * N - 0.99 * copies)) / (N - copies); },
  },
  'data-leakage-scaler': {
    title: 'how far the test rows pull the mean',
    make(r) {
      const base = pick(r, 20, 60, 5);
      const train = one(r, [[-2, 0, 1, 3, -1, 2, -3, 0], [1, -1, 2, -2, 0, 3, -3, 0], [0, 0, 2, -2, 4, -4, 1, -1]]).map((v) => base + v);
      const t1 = base + pick(r, 15, 40), t2 = base + pick(r, 5, 20);
      const all = [...train, t1, t2];
      const answer = mean(all) - mean(train);
      return {
        q: `<p>Ten days of website visits (in hundreds) are to be scaled before training. The 8 training days are <b>${train.join(', ')}</b>; the 2 test days are <b>${t1}</b> and <b>${t2}</b>. Someone computes the mean on all 10 days instead of the training days only. By how much is the mean used for training too high?</p>`,
        answer, unit: 'hundred visits', tol: 0.01,
        hint: 'Work out the mean of the 8 training days, then the mean of all 10 days, and subtract.',
        solution: steps(
          `Training mean: ${train.reduce((a, v) => a + v, 0)} ÷ 8 = ${n(mean(train), 4)}.`,
          `Mean of all 10: ${all.reduce((a, v) => a + v, 0)} ÷ 10 = ${n(mean(all), 4)}.`,
          `Difference: <b>${n(answer, 3)}</b>. The test days, which the model must never see, shifted what it learned. Split first, then fit the scaler on training rows only.`),
        train, t1, t2,
      };
    },
    verify: (p) => { const m = mean(p.train); return (p.t1 + p.t2 - 2 * m) / 10; },
  },
  'fairness-tpr-gap': {
    title: 'compare true positive rates of two groups',
    make(r) {
      const RA = pick(r, 400, 800, 50), RB = pick(r, 300, 700, 50);
      const pa = pick(r, 82, 92) / 100, pb = pick(r, 62, 78) / 100;
      const a = Math.round(RA * pa), b = Math.round(RB * pb);
      const answer = 100 * (a / RA - b / RB);
      return {
        q: `<p>A loan model is tested on two groups. In group A, <b>${a}</b> of the <b>${RA}</b> people who would repay are approved. In group B, <b>${b}</b> of the <b>${RB}</b> people who would repay are approved. By how many percentage points do the true positive rates differ (A minus B)?</p>`,
        answer, unit: 'percentage points', tol: 0.005,
        hint: 'The true positive rate is the share of people who truly qualify that the model says yes to. Work it out for each group, then subtract.',
        solution: steps(
          `Group A: ${a} ÷ ${RA} = ${n(100 * a / RA, 4)} %.`,
          `Group B: ${b} ÷ ${RB} = ${n(100 * b / RB, 4)} %.`,
          `Gap: <b>${n(answer, 3)} points</b>. Equal opportunity asks for a gap near zero: a qualified person in B is turned down more often than one in A.`),
        a, b, RA, RB,
      };
    },
    verify: (p) => (100 * (p.a * p.RB - p.b * p.RA)) / (p.RA * p.RB),
  },
  'fairness-shap-linear': {
    title: 'explain one delivery-time prediction',
    make(r) {
      const w = pick(r, 1.5, 3, 0.5), km = pick(r, 3, 6), x = pick(r, 7, 14), items = pick(r, 4, 10), it = pick(r, 1, 3);
      const answer = w * (x - km);
      const f = (k, i) => 10 + w * k + 0.5 * i;
      return {
        q: `<p>An app predicts delivery time in minutes as <b>10 + ${w} × distance (km) + 0.5 × items</b>. The average order is ${km} km away with ${items} items. This order is <b>${x} km</b> away with <b>${it}</b> items. How many minutes does distance add to this prediction, compared with the average order (its SHAP value)?</p>`,
        answer, unit: 'minutes', tol: 0.001,
        hint: 'For a linear model, a column\'s contribution is its weight times (this value − average value).',
        solution: steps(
          `Distance: ${w} × (${x} − ${km}) = <b>+${n(answer, 3)} min</b>.`,
          `Items: 0.5 × (${it} − ${items}) = ${n(0.5 * (it - items), 3)} min.`,
          `Average prediction: 10 + ${w} × ${km} + 0.5 × ${items} = ${n(f(km, items), 4)} min. Add the two contributions: ${n(f(km, items), 4)} + ${n(answer, 3)} + (${n(0.5 * (it - items), 3)}) = ${n(f(x, it), 4)} min, exactly this order's prediction.`),
        w, km, x, items, it,
      };
    },
    verify: (p) => (10 + p.w * p.x + 0.5 * p.it) - (10 + p.w * p.km + 0.5 * p.it),
  },
  // ---------- Module 8: finding structure without labels ----------
  'k-means-step': {
    title: 'one round of k-means on a line',
    make(r) {
      const low = [pick(r, 1, 2), pick(r, 3, 5), pick(r, 4, 7)];
      const high = [pick(r, 12, 14), pick(r, 14, 17), pick(r, 16, 20)];
      const pts = [...low, ...high];
      const c1 = pick(r, 1, 3), c2 = c1 + one(r, [3, 5, 7]);
      const mid = (c1 + c2) / 2;
      const g1 = pts.filter((x) => x < mid), g2 = pts.filter((x) => x > mid);
      const answer = mean(g2);
      return {
        q: `<p>A bakery delivers to six cafés at these distances along one road (km): <b>${pts.join(', ')}</b>. It wants 2 delivery vans, so it runs k-means with k = 2. The two centres start at <b>${c1} km</b> and <b>${c2} km</b>. After one assign step and one update step, where is centre 2?</p>`,
        answer, unit: 'km', tol: 0.005,
        hint: `Give each café to the nearer centre (the border is halfway, at ${mid} km). Then move each centre to the average of its cafés.`,
        solution: steps(
          `Halfway between ${c1} and ${c2} is ${mid}. Cafés below go to centre 1: ${g1.join(', ')}. Cafés above go to centre 2: ${g2.join(', ')}.`,
          `Centre 1 moves to (${g1.join(' + ')}) ÷ ${g1.length} = ${n(mean(g1), 4)} km.`,
          `Centre 2 moves to (${g2.join(' + ')}) ÷ ${g2.length} = <b>${n(answer, 4)} km</b>.`,
          g1.length === 3 ? 'The next assign step changes nothing, so k-means has already finished.' : 'Now run the assign step again with the new centres, and keep going until no café switches.'),
        pts, c1, c2,
      };
    },
    verify: (p) => { const mid = (p.c1 + p.c2) / 2, tot = p.pts.reduce((a, v) => a + v, 0), g1 = p.pts.filter((x) => x < mid); return (tot - g1.reduce((a, v) => a + v, 0)) / (p.pts.length - g1.length); },
  },
  'k-means-inertia': {
    title: 'inertia of one cluster',
    make(r) {
      const cx = pick(r, 2, 8), cy = pick(r, 3, 9);
      const off = one(r, [[[1, 2], [-2, 0], [1, -2]], [[2, 1], [-1, -1], [-1, 0]], [[0, 2], [3, -1], [-3, -1]], [[1, 1], [1, -2], [-2, 1]]]);
      const pts = off.map(([a, b]) => [cx + a, cy + b]);
      const answer = off.reduce((s, [a, b]) => s + a * a + b * b, 0);
      return {
        q: `<p>A cluster of three shoppers, by (visits per month, spend in $10s): <b>${pts.map((p) => `(${p.join(', ')})`).join(', ')}</b>. Find the centre of the cluster, then its inertia: the total squared distance from each shopper to the centre.</p>`,
        answer, unit: '', tol: 0.001,
        hint: 'The centre is the average of the x values and the average of the y values. For each point, square the x gap and the y gap and add them. Then add up the three points.',
        solution: steps(
          `Centre: x = (${pts.map((p) => p[0]).join(' + ')}) ÷ 3 = ${cx}; y = (${pts.map((p) => p[1]).join(' + ')}) ÷ 3 = ${cy}.`,
          ...pts.map((p, i) => `Point ${i + 1}: (${p[0]} − ${cx})² + (${p[1]} − ${cy})² = ${off[i][0] ** 2} + ${off[i][1] ** 2} = ${off[i][0] ** 2 + off[i][1] ** 2}.`),
          `Inertia: <b>${answer}</b>. k-means tries to make the sum of this over all clusters as small as possible.`),
        pts,
      };
    },
    verify: (p) => { const mx = mean(p.pts.map((q) => q[0])), my = mean(p.pts.map((q) => q[1])); return p.pts.reduce((s, [x, y]) => s + x * x + y * y, 0) - 3 * (mx * mx + my * my); },
  },
  'choosing-k-silhouette': {
    title: 'silhouette of one customer',
    make(r) {
      const own = [pick(r, 1, 3, 0.5), pick(r, 1.5, 3.5, 0.5), pick(r, 2, 4, 0.5)];
      const o1 = [pick(r, 4, 7, 0.5), pick(r, 5, 8, 0.5), pick(r, 5, 9, 0.5)];
      const o2 = [pick(r, 6, 10, 0.5), pick(r, 7, 11, 0.5), pick(r, 8, 12, 0.5)];
      const a = mean(own), b = Math.min(mean(o1), mean(o2));
      const answer = (b - a) / Math.max(a, b);
      return {
        q: `<p>After clustering shoppers into 3 segments, take one shopper. Distances to the other members of her own segment: <b>${own.join(', ')}</b>. To the members of segment 2: <b>${o1.join(', ')}</b>. To the members of segment 3: <b>${o2.join(', ')}</b>. What is her silhouette s = (b − a) ÷ max(a, b)?</p>`,
        answer, unit: '', tol: 0.01, abs: 0.002,
        hint: 'a is the average distance to her own segment. b is the average distance to the nearest other segment: work out both other averages and keep the smaller.',
        solution: steps(
          `a = (${own.join(' + ')}) ÷ 3 = ${n(a, 4)}.`,
          `Segment 2 average: ${n(mean(o1), 4)}. Segment 3 average: ${n(mean(o2), 4)}. The nearer one gives b = ${n(b, 4)}.`,
          `s = (${n(b, 4)} − ${n(a, 4)}) ÷ ${n(Math.max(a, b), 4)} = <b>${n(answer, 3)}</b>. ${answer > 0.5 ? 'She sits snugly in her own segment.' : answer > 0.25 ? 'She belongs to her segment, but not by much.' : 'She is close to the border.'}`),
        own, o1, o2,
      };
    },
    verify: (p) => { const a = mean(p.own), b = Math.min(mean(p.o1), mean(p.o2)); return a < b ? 1 - a / b : b / a - 1; },
  },
  'hierarchical-clustering-linkage': {
    title: 'distance between two clusters',
    make(r) {
      const kind = one(r, ['single', 'complete', 'average']);
      const A = [pick(r, 8, 12), pick(r, 12, 16)];
      const B = [pick(r, 28, 31), pick(r, 31, 34), pick(r, 34, 40)];
      const ds = A.flatMap((x) => B.map((y) => y - x));
      const answer = kind === 'single' ? Math.min(...ds) : kind === 'complete' ? Math.max(...ds) : mean(ds);
      return {
        q: `<p>Shops by weekly sales (in $1,000s). Cluster 1: <b>${A.join(', ')}</b>. Cluster 2: <b>${B.join(', ')}</b>. Using <b>${kind} linkage</b>, how far apart are the two clusters?</p>`,
        answer, unit: '($1,000s)', tol: 0.005,
        hint: kind === 'single' ? 'Single linkage uses the closest pair: one shop from each cluster.' : kind === 'complete' ? 'Complete linkage uses the farthest pair: one shop from each cluster.' : 'Average linkage averages the distance over every pair: 2 × 3 = 6 pairs.',
        solution: steps(
          `All 6 pair distances: ${ds.join(', ')}.`,
          kind === 'single' ? `The closest pair is ${Math.min(...ds)} apart.` : kind === 'complete' ? `The farthest pair is ${Math.max(...ds)} apart.` : `Their average: ${ds.reduce((a, v) => a + v, 0)} ÷ 6 = ${n(mean(ds), 4)}.`,
          `So the ${kind}-linkage distance is <b>${n(answer, 4)}</b>. In a dendrogram the two clusters would join at this height.`),
        kind, A, B,
      };
    },
    verify: (p) => p.kind === 'single' ? Math.min(...p.B) - Math.max(...p.A) : p.kind === 'complete' ? Math.max(...p.B) - Math.min(...p.A) : mean(p.B) - mean(p.A),
  },
  'pca-variance-share': {
    title: 'how much a 2D picture keeps',
    make(r) {
      const l4 = pick(r, 0.1, 0.2, 0.1), l3 = pick(r, 0.3, 0.5, 0.1), l2 = pick(r, 0.6, 1, 0.1);
      const l1 = +(4 - l2 - l3 - l4).toFixed(1); // scaled columns: the variances add up to 4
      const tot = l1 + l2 + l3 + l4;
      const answer = (100 * (l1 + l2)) / tot;
      return {
        q: `<p>A shop survey has 4 scaled questions. PCA finds components with variances (eigenvalues) <b>${l1}, ${l2}, ${l3}</b> and <b>${l4}</b>. What percentage of the total variance does a 2D plot on PC1 and PC2 keep?</p>`,
        answer, unit: '%', tol: 0.005,
        hint: 'Each eigenvalue is the spread kept by that component. Add the first two and divide by the sum of all four.',
        solution: steps(
          `Total variance: ${l1} + ${l2} + ${l3} + ${l4} = ${n(tot, 4)}.`,
          `PC1 + PC2: ${l1} + ${l2} = ${n(l1 + l2, 4)}.`,
          `Share: ${n(l1 + l2, 4)} ÷ ${n(tot, 4)} = <b>${n(answer, 3)} %</b>. ${answer >= 80 ? 'A 2D scatter is a faithful picture.' : 'A 2D scatter loses a fair amount: look at PC3 too.'}`),
        l: [l1, l2, l3, l4],
      };
    },
    verify: (p) => 100 - (100 * (p.l[2] + p.l[3])) / p.l.reduce((a, v) => a + v, 0),
  },
  'pca-project': {
    title: 'a point\'s score on the first component',
    make(r) {
      const mx = pick(r, 3, 6), my = pick(r, 4, 8), x = mx + pick(r, -3, 4), y = my + pick(r, -3, 4);
      const answer = 0.6 * (x - mx) + 0.8 * (y - my);
      return {
        q: `<p>Two scaled columns, "screen rating" and "speed rating", have means ${mx} and ${my}. PCA says the first component points along <b>u = (0.6, 0.8)</b>. A customer rated the phone <b>(${x}, ${y})</b>. What is this customer's PC1 score?</p>`,
        answer, unit: '', tol: 0.005, abs: 0.01,
        hint: 'Centre the point first (subtract the means). Then take the dot product with u: multiply matching parts and add.',
        solution: steps(
          `Centred point: (${x} − ${mx}, ${y} − ${my}) = (${x - mx}, ${y - my}).`,
          `Dot product: 0.6 × ${x - mx} + 0.8 × ${y - my} = ${n(0.6 * (x - mx), 3)} + ${n(0.8 * (y - my), 3)} = <b>${n(answer, 3)}</b>.`,
          'This one number is where the customer lands on the PC1 axis: positive means more satisfied than average on both together.'),
        mx, my, x, y,
      };
    },
    verify: (p) => (3 * (p.x - p.mx) + 4 * (p.y - p.my)) / 5,
  },
  'anomaly-detection-z': {
    title: 'is this payment unusual?',
    make(r) {
      const m = pick(r, 40, 120, 5), s = pick(r, 8, 25), x = Math.round(m + s * pick(r, 1.5, 4.5, 0.1));
      const answer = (x - m) / s;
      return {
        q: `<p>A customer's card payments average <b>$${m}</b> with a standard deviation of <b>$${s}</b>. A new payment is <b>$${x}</b>. What is its z-score?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'z = (value − mean) ÷ standard deviation: how many "typical wobbles" away from normal the payment is.',
        solution: steps(
          `Distance from the mean: ${x} − ${m} = ${x - m}.`,
          `Divide by the standard deviation: ${x - m} ÷ ${s} = <b>${n(answer, 3)}</b>.`,
          answer > 3 ? 'Beyond 3, so a |z| > 3 rule flags it for a second look.' : 'Below 3, so a |z| > 3 rule lets it through.'),
        m, s, x,
      };
    },
    verify: (p) => p.x / p.s - p.m / p.s,
  },
  'anomaly-detection-false-alarms': {
    title: 'false alarms from a z-score rule',
    make(r) {
      const t = one(r, [2, 2.5, 3]), N = pick(r, 20, 200, 10) * 1000;
      const tail = { 2: 0.0455003, 2.5: 0.0124193, 3: 0.0026998 }[t];
      const answer = N * tail;
      return {
        q: `<p>A factory logs <b>${N.toLocaleString('en-CA')}</b> sensor readings a month, all perfectly normal (bell-shaped, nothing wrong). An alarm fires whenever |z| > <b>${t}</b>. About how many false alarms a month?</p>`,
        answer, unit: 'alarms', tol: 0.01,
        hint: `Under a normal curve, the share of values more than ${t} standard deviations from the mean (either side) is ${t === 2 ? 'about 4.55 %' : t === 2.5 ? 'about 1.24 %' : 'about 0.27 %'}.`,
        solution: steps(
          `Share beyond ±${t}: ${n(100 * tail, 3)} %.`,
          `${N.toLocaleString('en-CA')} × ${n(tail, 3)} = <b>${n(answer, 3)} false alarms</b>.`,
          'Nothing was wrong at all. On big data, pick the threshold by how many alerts people can check, not by habit.'),
        t, N,
      };
    },
    verify: (p) => { const f = (z) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI); let s = 0; const h = p.t / 2000; for (let i = 0; i <= 2000; i++) s += (i === 0 || i === 2000 ? 1 : i % 2 ? 4 : 2) * f(i * h); return p.N * (1 - 2 * (s * h / 3)); },
  },
  // ---------- Module 9: neural networks ----------
  'perceptron-update': {
    title: 'one perceptron correction',
    make(r) {
      const w1 = pick(r, -2, 1), w2 = pick(r, -2, 1), x1 = pick(r, 1, 3), x2 = pick(r, 1, 3);
      const b = -(Math.max(0, w1 * x1 + w2 * x2) + pick(r, 1, 3));
      const eta = one(r, [0.5, 1]);
      const z = w1 * x1 + w2 * x2 + b;
      const nw1 = w1 + eta * x1, nw2 = w2 + eta * x2, nb = b + eta;
      const answer = nw1 * x1 + nw2 * x2 + nb;
      return {
        q: `<p>A perceptron decides whether to send a customer a discount (1) or not (0). Its weights are <b>(${w1}, ${w2})</b> and its bias is <b>${b}</b>. A customer with inputs <b>(${x1}, ${x2})</b> should have got a discount. Apply the perceptron rule with learning rate η = <b>${eta}</b>, then work out the new weighted sum z for the same customer.</p>`,
        answer, unit: '', tol: 0.001, abs: 1e-6,
        hint: 'First check what it said: z = w·x + b. It should have said 1, so add η × x to the weights and η to the bias. Then compute z again with the new numbers.',
        solution: steps(
          `Old sum: ${w1} × ${x1} + ${w2} × ${x2} + (${b}) = ${z}. Below 0, so it said 0: a mistake.`,
          `Should be 1, said 0: add. New weights (${w1} + ${eta} × ${x1}, ${w2} + ${eta} × ${x2}) = (${nw1}, ${nw2}); new bias ${b} + ${eta} = ${nb}.`,
          `New sum: ${nw1} × ${x1} + ${nw2} × ${x2} + (${nb}) = <b>${n(answer, 4)}</b>. It rose by η × (${x1}² + ${x2}² + 1) = ${n(answer - z, 4)}${answer >= 0 ? ', enough to fire now' : ', not yet enough to fire; the next mistake will push it further'}.`),
        w1, w2, b, x1, x2, eta,
      };
    },
    verify: (p) => p.w1 * p.x1 + p.w2 * p.x2 + p.b + p.eta * (p.x1 ** 2 + p.x2 ** 2 + 1),
  },
  'activation-functions-sigmoid': {
    title: 'a neuron\'s sigmoid output',
    make(r) {
      const w1 = pick(r, -1, 1.5, 0.1), w2 = pick(r, -1, 1, 0.1), x1 = pick(r, 0, 3), x2 = pick(r, 0, 3), b = pick(r, -1, 0.5, 0.1);
      const z = +(w1 * x1 + w2 * x2 + b).toFixed(6);
      const answer = 1 / (1 + Math.exp(-z));
      return {
        q: `<p>An output neuron predicts whether a parcel arrives late. Weights <b>(${w1}, ${w2})</b>, bias <b>${b}</b>, inputs <b>(${x1}, ${x2})</b>. With a sigmoid activation, what probability does it give?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'z = w₁x₁ + w₂x₂ + b, then sigmoid(z) = 1 ÷ (1 + e<sup>−z</sup>).',
        solution: steps(
          `z = ${w1} × ${x1} + ${w2} × ${x2} + (${b}) = ${n(z, 4)}.`,
          `e<sup>−z</sup> = e<sup>${n(-z, 4)}</sup> = ${n(Math.exp(-z), 4)}.`,
          `sigmoid = 1 ÷ (1 + ${n(Math.exp(-z), 4)}) = <b>${n(answer, 3)}</b>: about a ${Math.round(answer * 100)} % chance of a late parcel. Its slope here is ${n(answer, 3)} × ${n(1 - answer, 3)} = ${n(answer * (1 - answer), 3)}.`),
        z,
      };
    },
    verify: (p) => (Math.tanh(p.z / 2) + 1) / 2,
  },
  'activation-functions-vanish': {
    title: 'a learning signal through many sigmoid layers',
    make(r) {
      const sv = one(r, [0.5, 0.731, 0.881, 0.953]), L = pick(r, 4, 12);
      const slope = sv * (1 - sv);
      const answer = slope ** L;
      return {
        q: `<p>A deep network uses sigmoid neurons. In every layer the neuron on our path outputs <b>${sv}</b>. Backpropagation multiplies the learning signal by the sigmoid's slope, σ × (1 − σ), once per layer. What fraction of the signal is left after <b>${L}</b> layers (ignore the weights)?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Work out the slope for one layer, then raise it to the power of the number of layers.',
        solution: steps(
          `Slope in one layer: ${sv} × ${n(1 - sv, 3)} = ${n(slope, 3)}.`,
          `After ${L} layers: ${n(slope, 3)}<sup>${L}</sup> = <b>${n(answer, 3)}</b>.`,
          `The early layers hardly learn. ReLU's slope is 1 wherever it is active, so the same path would keep the whole signal.`),
        sv, L,
      };
    },
    verify: (p) => Math.exp(p.L * Math.log(p.sv - p.sv * p.sv)),
  },
  'layers-params': {
    title: 'count a network\'s weights and biases',
    make(r) {
      const sizes = [pick(r, 3, 20), one(r, [8, 16, 32, 64]), one(r, [4, 8, 16]), one(r, [1, 3, 10])];
      let answer = 0; const parts = [];
      for (let i = 1; i < sizes.length; i++) { const c = sizes[i - 1] * sizes[i] + sizes[i]; parts.push(`${sizes[i - 1]} × ${sizes[i]} + ${sizes[i]} = ${c}`); answer += c; }
      return {
        q: `<p>A fully connected network for a store's demand forecast has layers of sizes <b>${sizes.join(' → ')}</b> (inputs, two hidden layers, outputs). How many weights and biases does it have in total?</p>`,
        answer, unit: 'parameters', tol: 0.001,
        hint: 'Between two layers, every neuron of the first connects to every neuron of the second (n<sub>in</sub> × n<sub>out</sub> weights), and each neuron of the second has one bias.',
        solution: steps(...parts.map((t, i) => `Layer ${i + 1} to ${i + 2}: ${t}.`), `Total: <b>${answer.toLocaleString('en-CA')}</b>.`),
        sizes,
      };
    },
    verify: (p) => { let t = 0; for (let i = 1; i < p.sizes.length; i++) for (let o = 0; o < p.sizes[i]; o++) t += p.sizes[i - 1] + 1; return t; },
  },
  'backpropagation-grad': {
    title: 'the gradient for the first weight',
    make(r) {
      const x = pick(r, 1, 3), w1 = pick(r, 0.2, 1, 0.1), w2 = pick(r, 0.5, 2, 0.1), b = pick(r, -1, 0.5, 0.1);
      const z1 = w1 * x, h = Math.max(0, z1), z2 = w2 * h + b, p = 1 / (1 + Math.exp(-z2));
      const answer = (p - 1) * w2 * (z1 > 0 ? 1 : 0) * x;
      return {
        q: `<p>A tiny network: input x = <b>${x}</b>; z₁ = w₁x with w₁ = <b>${w1}</b>; h = ReLU(z₁); z₂ = w₂h + b with w₂ = <b>${w2}</b>, b = <b>${b}</b>; p = sigmoid(z₂); log-loss with true answer y = 1. Find ∂L/∂w₁, the gradient for the first weight.</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Forward first to get p. The error at z₂ is p − y. Pass it back: times w₂ to reach h, times ReLU\'s slope (1 if z₁ > 0) to reach z₁, times x to reach w₁.',
        solution: steps(
          `Forward: z₁ = ${n(z1, 3)}, h = ${n(h, 3)}, z₂ = ${n(w2, 3)} × ${n(h, 3)} + (${b}) = ${n(z2, 4)}, p = ${n(p, 4)}.`,
          `Error at z₂: p − y = ${n(p - 1, 4)}.`,
          `Back to h: × w₂ = ${n((p - 1) * w2, 4)}. Back to z₁: × ReLU'(${n(z1, 3)}) = 1, still ${n((p - 1) * w2, 4)}.`,
          `To w₁: × x = ${x}, so ∂L/∂w₁ = <b>${n(answer, 3)}</b>. Negative, so gradient descent will raise w₁, which raises p towards the true answer 1.`),
        x, w1, w2, b,
      };
    },
    verify: (p) => { const L = (w1) => { const z2 = p.w2 * Math.max(0, w1 * p.x) + p.b; return Math.log(1 + Math.exp(-z2)); }; const e = 1e-5; return (L(p.w1 + e) - L(p.w1 - e)) / (2 * e); },
  },
  'training-networks-updates': {
    title: 'how many weight updates a training run makes',
    make(r) {
      const nRows = pick(r, 20, 120) * 500, B = one(r, [32, 64, 128, 256]), E = pick(r, 5, 30, 5);
      const per = Math.ceil(nRows / B);
      const answer = per * E;
      return {
        q: `<p>A network that reads product photos trains on <b>${nRows.toLocaleString('en-CA')}</b> images with mini-batches of <b>${B}</b>, for <b>${E}</b> epochs. The last batch of each epoch may be smaller. How many weight updates happen in total?</p>`,
        answer, unit: 'updates', tol: 0.0005,
        hint: 'Each batch gives one update. Divide the rows by the batch size and round up for the last, smaller batch. Then multiply by the epochs.',
        solution: steps(
          `${nRows.toLocaleString('en-CA')} ÷ ${B} = ${n(nRows / B, 5)}, rounded up: ${per} batches per epoch.`,
          `${per} × ${E} epochs = <b>${answer.toLocaleString('en-CA')} updates</b>.`,
          'Each update uses only one batch, so each step is a little noisy, but there are many of them.'),
        nRows, B, E,
      };
    },
    verify: (p) => { let u = 0; for (let e = 0; e < p.E; e++) for (let i = 0; i < p.nRows; i += p.B) u++; return u; },
  },
  'convolution-patch': {
    title: 'one value of a feature map',
    make(r) {
      const P = [0, 1, 2].map(() => [0, 1, 2].map(() => pick(r, 0, 9)));
      const K = one(r, [[[1, 0, -1], [1, 0, -1], [1, 0, -1]], [[1, 1, 1], [0, 0, 0], [-1, -1, -1]], [[1, 0, -1], [2, 0, -2], [1, 0, -1]]]);
      let answer = 0; const terms = [];
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { answer += P[i][j] * K[i][j]; if (K[i][j]) terms.push(`${P[i][j]} × ${K[i][j]}`); }
      const grid = (g) => table(['', '', ''], g.map((row) => row.map(String))).replace(/<tr><th><\/th><th><\/th><th><\/th><\/tr>/, '');
      return {
        q: `<p>A 3 × 3 patch of a greyscale photo (brightness 0 to 9) and a 3 × 3 filter:</p><p>Patch:</p>${grid(P)}<p>Filter:</p>${grid(K)}<p>What value does the filter give at this position?</p>`,
        answer, unit: '', tol: 0.001, abs: 0.5,
        hint: 'Multiply each pixel by the filter weight in the same place, then add all nine products. The zeros drop out.',
        solution: steps(
          `Non-zero products: ${terms.join(' + ').replace(/\+ (\d+) × -/g, '− $1 × ')}.`,
          `Sum: <b>${answer}</b>.`,
          answer === 0 ? 'Zero: no change in brightness in the direction this filter looks for.' : `${Math.abs(answer) >= 10 ? 'A strong' : 'A weak'} response: the brightness changes across this patch in the direction the filter checks.`),
        P, K,
      };
    },
    verify: (p) => { let s = 0; for (let k = 8; k >= 0; k--) s += p.P[Math.floor(k / 3)][k % 3] * p.K[Math.floor(k / 3)][k % 3]; return s; },
  },
  'convolution-params': {
    title: 'weights in a convolution layer',
    make(r) {
      const k = one(r, [3, 5]), cin = one(r, [1, 3, 16, 32]), cout = one(r, [8, 16, 32, 64]);
      const answer = k * k * cin * cout + cout;
      return {
        q: `<p>A convolution layer has <b>${cout}</b> filters of size <b>${k} × ${k}</b>, reading an input with <b>${cin}</b> channel${cin > 1 ? 's' : ''}${cin === 3 ? ' (red, green, blue)' : ''}. How many weights and biases does it learn, whatever the image size?</p>`,
        answer, unit: 'parameters', tol: 0.001,
        hint: 'Each filter covers k × k pixels in every input channel. Multiply by the number of filters, then add one bias per filter.',
        solution: steps(
          `One filter: ${k} × ${k} × ${cin} = ${k * k * cin} weights.`,
          `${cout} filters: ${k * k * cin} × ${cout} = ${k * k * cin * cout}, plus ${cout} biases = <b>${answer.toLocaleString('en-CA')}</b>.`,
          'The same filters slide over the whole picture, so a 4K photo needs no more weights than a thumbnail.'),
        k, cin, cout,
      };
    },
    verify: (p) => p.cout * (p.k * p.k * p.cin + 1),
  },
  'sequences-memory': {
    title: 'how much of an early word survives',
    make(r) {
      const u = one(r, [0.5, 0.7, 0.8, 0.9, 0.95]), t = pick(r, 5, 30, 5);
      const answer = 100 * u ** t;
      return {
        q: `<p>A simple recurrent network keeps a one-number memory. Each step it multiplies the old memory by <b>u = ${u}</b> before adding the new word (ignore the squashing). What percentage of the first word's signal is left after <b>${t}</b> more steps?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Each step keeps a fraction u of what was there. After t steps that is u multiplied by itself t times.',
        solution: steps(
          `Fraction left: ${u}<sup>${t}</sup> = ${n(u ** t, 3)}.`,
          `As a percentage: <b>${n(answer, 3)} %</b>.`,
          answer < 5 ? 'Practically forgotten. This is why plain RNNs struggle with long sentences, and why LSTMs and attention were invented.' : 'Still noticeable, but it keeps shrinking with every extra step.'),
        u, t,
      };
    },
    verify: (p) => 100 * Math.exp(p.t * Math.log(p.u)),
  },
  'sequences-rnn-step': {
    title: 'run a recurrent cell for three steps',
    make(r) {
      const w = one(r, [0.5, 1, 1.5]), u = one(r, [0.4, 0.6, 0.8]), xs = [pick(r, 0, 1), pick(r, 0, 2), pick(r, -1, 1)];
      let h = 0; const rows = [];
      for (const x of xs) { const z = w * x + u * h; h = Math.tanh(z); rows.push([x, n(z, 4), n(h, 4)]); }
      return {
        q: `<p>A one-number recurrent cell reads daily sales signals with h<sub>t</sub> = tanh(w × x<sub>t</sub> + u × h<sub>t−1</sub>), w = <b>${w}</b>, u = <b>${u}</b>, starting from h<sub>0</sub> = 0. The inputs are <b>${xs.join(', ')}</b>. What is h<sub>3</sub>?</p>`,
        answer: h, unit: '', tol: 0.01, abs: 0.002,
        hint: 'Go one step at a time. At each step mix the new input (times w) with the previous memory (times u), then squash with tanh.',
        solution: steps(...rows.map(([x, z, hh], i) => `Step ${i + 1}: ${w} × ${x} + ${u} × (previous h) = ${z}; tanh gives h = ${hh}.`), `So h<sub>3</sub> = <b>${n(h, 3)}</b>. It carries a faded trace of every input so far.`),
        w, u, xs,
      };
    },
    verify: (p) => { let h = 0; for (const x of p.xs) { const z = p.w * x + p.u * h; h = (Math.exp(2 * z) - 1) / (Math.exp(2 * z) + 1); } return h; },
  },
};
