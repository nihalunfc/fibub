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
};
