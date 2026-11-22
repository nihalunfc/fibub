// Live problems for ML foundations, part a: Modules 1-3 (see ../problems.js).
import { pick, n, steps, table } from './util.js';

const sum = (a) => a.reduce((s, v) => s + v, 0);
const mean = (a) => sum(a) / a.length;

export default {
  // ---------- Module 1 ----------
  'what-is-machine-learning-cutoff': {
    title: 'count the mistakes of a cut-off rule',
    make(r) {
      const hours = [1, 2, 3, 4, 5, 6, 7, 8].map((h) => +(h + pick(r, 0, 0.5, 0.5)).toFixed(1));
      // results: mostly "more hours, more passes", with two noisy students
      const swap1 = pick(r, 1, 3), swap2 = pick(r, 5, 7);
      const passed = hours.map((_, i) => (i >= 4 ? 1 : 0));
      passed[swap1] = 1 - passed[swap1]; passed[swap2] = 1 - passed[swap2];
      const c = pick(r, 3, 6);
      const wrong = hours.filter((h, i) => (h >= c ? 1 : 0) !== passed[i]).length;
      return {
        q: `<p>A tutor tries the rule "predict <b>pass</b> if hours studied ≥ ${c}" on eight past students:</p>${table(['Hours', ...hours], [['Result', ...passed.map((p) => (p ? 'pass' : 'fail'))]])}<p>How many students does the rule get <b>wrong</b>?</p>`,
        answer: wrong, unit: 'mistakes', tol: 0, abs: 0.01,
        hint: `For each student, first write the rule's guess (pass if hours ≥ ${c}, else fail), then compare it with the real result.`,
        solution: steps(
          `Rule's guesses: ${hours.map((h) => (h >= c ? 'pass' : 'fail')).join(', ')}.`,
          `Real results: ${passed.map((p) => (p ? 'pass' : 'fail')).join(', ')}.`,
          `They differ for ${wrong} student${wrong === 1 ? '' : 's'}, so the rule makes <b>${wrong} mistake${wrong === 1 ? '' : 's'}</b>. Training would try every c and keep the one with the fewest.`),
        hours, passed, c,
      };
    },
    verify: (p) => p.hours.reduce((s, h, i) => s + Math.abs((h >= p.c ? 1 : 0) - p.passed[i]), 0),
  },
  'features-labels-models-onehot': {
    title: 'count the feature columns after one-hot encoding',
    make(r) {
      const nums = pick(r, 3, 6), cats = pick(r, 3, 8), rows = pick(r, 800, 5000, 100);
      const answer = nums + cats;
      return {
        q: `<p>A delivery firm has a table of ${rows.toLocaleString('en-CA')} past orders. To predict delivery time, it uses ${nums} number columns (such as distance and parcel weight) and one column <i>Region</i> with ${cats} different regions, one-hot encoded. How many feature columns <i>d</i> does the model see?</p>`,
        answer, unit: 'columns', tol: 0, abs: 0.01,
        hint: 'Number columns stay as they are. One-hot encoding swaps the Region column for one yes/no column per region.',
        solution: steps(
          `The ${nums} number columns stay: ${nums} columns.`,
          `Region becomes ${cats} yes/no columns, one per region.`,
          `d = ${nums} + ${cats} = <b>${answer}</b>. (The number of rows, ${rows.toLocaleString('en-CA')}, is n, not d. The label, delivery time, is not a feature.)`),
        nums, cats,
      };
    },
    verify: (p) => p.cats + p.nums,
  },
  'functions-and-slopes-predict': {
    title: 'fit a line through two trips and predict a third',
    make(r) {
      const m = pick(r, 2, 4, 0.5), c = pick(r, 3, 9), x1 = pick(r, 2, 5), x2 = x1 + pick(r, 4, 8), x3 = pick(r, 6, 15);
      const y1 = m * x1 + c, y2 = m * x2 + c, answer = m * x3 + c;
      return {
        q: `<p>A courier's log says a ${x1} km trip took ${y1} minutes and a ${x2} km trip took ${y2} minutes. Assuming time grows in a straight line with distance, how many minutes should a ${x3} km trip take?</p>`,
        answer, unit: 'minutes', tol: 0.005,
        hint: 'Slope = rise ÷ run = (change in minutes) ÷ (change in km). Then intercept = minutes − slope × km for either trip.',
        solution: steps(
          `Slope m = (${y2} − ${y1}) ÷ (${x2} − ${x1}) = ${y2 - y1} ÷ ${x2 - x1} = ${n(m)} minutes per km.`,
          `Intercept c = ${y1} − ${n(m)} × ${x1} = ${n(c)} minutes (loading and parking, before any driving).`,
          `Time for ${x3} km = ${n(m)} × ${x3} + ${n(c)} = <b>${n(answer)} minutes</b>.`),
        x1, y1, x2, y2, x3,
      };
    },
    verify: (p) => p.y1 + ((p.y2 - p.y1) * (p.x3 - p.x1)) / (p.x2 - p.x1),
  },
  'vectors-dot-product-price': {
    title: 'predict a price with a dot product',
    make(r) {
      const x = [pick(r, 50, 140, 5), pick(r, 1, 5), pick(r, 2, 60, 2)], w = [pick(r, 2, 4, 0.1), pick(r, 5, 15), -pick(r, 0.5, 1.5, 0.1)], b = pick(r, 20, 90, 10);
      const terms = x.map((v, i) => v * w[i]), answer = sum(terms) + b;
      return {
        q: `<p>A house-price model (prices in $000) has weights <b>w</b> = (${w.join(', ')}) for (floor area in m², bedrooms, age in years) and bias b = ${b}. Predict the price of the home <b>x</b> = (${x.join(', ')}). Give the answer in $000.</p>`,
        answer, unit: '$000', tol: 0.002,
        hint: 'ŷ = w · x + b: multiply each weight by its matching feature, add the three products, then add b.',
        solution: steps(
          `Products: ${w[0]} × ${x[0]} = ${n(terms[0], 4)}; ${w[1]} × ${x[1]} = ${n(terms[1], 4)}; ${w[2]} × ${x[2]} = ${n(terms[2], 4)}.`,
          `Dot product w · x = ${n(sum(terms), 5)}.`,
          `Add the bias: ${n(sum(terms), 5)} + ${b} = <b>${n(answer, 5)}</b>, about $${Math.round(answer * 1000).toLocaleString('en-CA')}.`),
        x, w, b,
      };
    },
    verify: (p) => p.b + p.x.reduce((s, v, i) => s + p.w[i] * v, 0),
  },
  'vectors-dot-product-cosine': {
    title: 'how alike are two shopping baskets?',
    make(r) {
      const a = [pick(r, 0, 4), pick(r, 1, 5), pick(r, 0, 3)], b = [pick(r, 1, 5), pick(r, 0, 4), pick(r, 1, 3)];
      const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2], la = Math.hypot(...a), lb = Math.hypot(...b), answer = dot / (la * lb);
      return {
        q: `<p>Two customers' weekly baskets are counted as (bread, milk, fruit): Asha (${a.join(', ')}) and Ben (${b.join(', ')}). What is the cosine similarity of the two baskets (from −1 to 1)?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'cos θ = (a · b) ÷ (length of a × length of b). The length is the square root of the sum of squares.',
        solution: steps(
          `Dot product: ${a[0]}×${b[0]} + ${a[1]}×${b[1]} + ${a[2]}×${b[2]} = ${dot}.`,
          `Lengths: √(${a.map((v) => v * v).join(' + ')}) = ${n(la)} and √(${b.map((v) => v * v).join(' + ')}) = ${n(lb)}.`,
          `cos θ = ${dot} ÷ (${n(la)} × ${n(lb)}) = <b>${n(answer)}</b>. Close to 1 means they buy in similar proportions, whatever the basket sizes.`),
        a, b,
      };
    },
    verify: (p) => Math.cos(Math.acos(p.a.reduce((s, v, i) => s + v * p.b[i], 0) / Math.sqrt(p.a.reduce((s, v) => s + v * v, 0) * p.b.reduce((s, v) => s + v * v, 0)))),
  },
  'derivatives-gradient-step': {
    title: 'take one gradient descent step',
    make(r) {
      const a = pick(r, 1, 3), best = pick(r, 2, 8), x0 = best + pick(r, 2, 5) * (r() < 0.5 ? -1 : 1), eta = pick(r, 0.05, 0.2, 0.05);
      const slope = 2 * a * (x0 - best), answer = x0 - eta * slope;
      return {
        q: `<p>A shop's weekly waste (in kg) depends on how many trays of bread <i>x</i> it bakes: f(x) = ${a}(x − ${best})² + 10. It bakes ${x0} trays now. Take <b>one</b> gradient descent step with learning rate ${eta}. What is the new x?</p>`,
        answer, unit: 'trays', tol: 0.002, abs: 0.001,
        hint: `The slope is f′(x) = ${2 * a}(x − ${best}) (chain rule). Then x_new = x − ${eta} × slope.`,
        solution: steps(
          `Slope at x = ${x0}: f′(${x0}) = ${2 * a} × (${x0} − ${best}) = ${slope}.`,
          `Step: x_new = ${x0} − ${eta} × (${slope}) = ${x0} ${slope > 0 ? '−' : '+'} ${n(Math.abs(eta * slope))}.`,
          `New x = <b>${n(answer)}</b>. It moved towards ${best}, the bottom of the waste curve.`),
        a, best, x0, eta,
      };
    },
    verify: (p) => { const f = (x) => p.a * (x - p.best) ** 2 + 10, h = 1e-5; return p.x0 - p.eta * (f(p.x0 + h) - f(p.x0 - h)) / (2 * h); },
  },
  'probability-basics-sd': {
    title: 'find the spread of delivery times',
    make(r) {
      const base = pick(r, 18, 30), xs = [0, 1, 2, 3, 4].map(() => base + pick(r, -6, 8));
      const m = mean(xs), gaps = xs.map((x) => x - m), answer = Math.sqrt(mean(gaps.map((g) => g * g)));
      return {
        q: `<p>Five pizza deliveries took ${xs.join(', ')} minutes. What is their (population) standard deviation, in minutes?</p>`,
        answer, unit: 'minutes', tol: 0.01,
        hint: 'Find the mean, then each gap from the mean, square the gaps, average the squares (that is the variance) and take the square root.',
        solution: steps(
          `Mean = (${xs.join(' + ')}) ÷ 5 = ${n(m)}.`,
          `Gaps: ${gaps.map((g) => n(g)).join(', ')}. Squares: ${gaps.map((g) => n(g * g)).join(', ')}.`,
          `Variance = ${n(sum(gaps.map((g) => g * g)), 4)} ÷ 5 = ${n(answer * answer)}.`,
          `Standard deviation = √${n(answer * answer)} = <b>${n(answer)} minutes</b>: a typical delivery is about that far from the average.`),
        xs,
      };
    },
    verify: (p) => { const m2 = mean(p.xs.map((x) => x * x)), m = mean(p.xs); return Math.sqrt(m2 - m * m); },
  },
  'probability-basics-se': {
    title: 'how much does an average wobble?',
    make(r) {
      const sd = pick(r, 4, 20), size = [16, 25, 36, 49, 64, 100, 400][Math.floor(r() * 7)];
      const answer = sd / Math.sqrt(size);
      return {
        q: `<p>Single customer spends at a café vary with a standard deviation of $${sd}. You average the spend of ${size} random customers. What is the standard error of that average, in dollars?</p>`,
        answer, unit: '$', tol: 0.005,
        hint: 'Standard error = σ ÷ √n.',
        solution: steps(
          `√${size} = ${Math.sqrt(size)}.`,
          `SE = ${sd} ÷ ${Math.sqrt(size)} = <b>$${n(answer)}</b>. The average of ${size} spends wobbles far less than one spend does.`),
        sd, size,
      };
    },
    verify: (p) => Math.sqrt((p.sd * p.sd) / p.size),
  },
  'ml-workflow-skill': {
    title: 'how much better than the baseline?',
    make(r) {
      const base = pick(r, 14, 30), model = pick(r, 6, base - 2);
      const answer = 1 - model / base;
      return {
        q: `<p>Always guessing the average delivery time is off by ${base} minutes on average. A new model is off by ${model} minutes on held-out orders. What is the model's skill score (0 = no better than the baseline, 1 = perfect)?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'skill = 1 − (error of model ÷ error of baseline).',
        solution: steps(
          `Error ratio: ${model} ÷ ${base} = ${n(model / base)}.`,
          `Skill = 1 − ${n(model / base)} = <b>${n(answer)}</b>. The model removes about ${Math.round(answer * 100)} % of the baseline's error.`),
        base, model,
      };
    },
    verify: (p) => (p.base - p.model) / p.base,
  },

  // ---------- Module 2 ----------
  'types-of-data-cyclic': {
    title: 'put the hours of the day on a circle',
    make(r) {
      const h1 = pick(r, 20, 23), h2 = pick(r, 0, 3);
      const P = (h) => [Math.sin((2 * Math.PI * h) / 24), Math.cos((2 * Math.PI * h) / 24)];
      const a = P(h1), b = P(h2), answer = Math.hypot(a[0] - b[0], a[1] - b[1]);
      return {
        q: `<p>A bike-share model turns the hour into two numbers, (sin(2π·hour/24), cos(2π·hour/24)), so the day wraps round a circle. How far apart (straight-line distance) are ${h1}:00 and ${String(h2).padStart(2, '0')}:00 on that circle? (As plain numbers they are ${h1 - h2} apart.)</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Work out (sin, cos) for each hour in radians, then use Pythagoras: √((Δsin)² + (Δcos)²).',
        solution: steps(
          `${h1}:00 → (${n(a[0])}, ${n(a[1])}); ${h2}:00 → (${n(b[0])}, ${n(b[1])}).`,
          `Differences: ${n(a[0] - b[0])} and ${n(a[1] - b[1])}.`,
          `Distance = √(${n((a[0] - b[0]) ** 2)} + ${n((a[1] - b[1]) ** 2)}) = <b>${n(answer)}</b>. Close together, as late night and early morning should be (the far side of the circle is 2 away).`),
        h1, h2,
      };
    },
    verify: (p) => 2 * Math.sin((Math.PI * ((p.h2 + 24 - p.h1) % 24)) / 24),
  },
  'honest-charts-truncated': {
    title: 'how much does a cut-off axis exaggerate?',
    make(r) {
      const a = pick(r, 40, 80), b = a + pick(r, 2, 8), start = a - pick(r, 2, 6);
      const answer = (b - start) / (a - start);
      return {
        q: `<p>A sales slide shows two bars: Store A sold ${a} units and Store B ${b}. The bar axis starts at ${start}, not 0. How many times longer does B's bar look than A's?</p>`,
        answer, unit: 'times', tol: 0.01,
        hint: `Each bar is drawn from ${start} up to its value, so its length is value − ${start}.`,
        solution: steps(
          `A's bar: ${a} − ${start} = ${a - start}. B's bar: ${b} − ${start} = ${b - start}.`,
          `Ratio: ${b - start} ÷ ${a - start} = <b>${n(answer)}</b> times as long.`,
          `The real ratio is ${b} ÷ ${a} = ${n(b / a)}: B sold only ${n((b / a - 1) * 100)} % more. Bars must start at zero.`),
        a, b, start,
      };
    },
    verify: (p) => 1 + (p.b - p.a) / (p.a - p.start),
  },
  'honest-charts-fence': {
    title: 'find the outlier fence',
    make(r) {
      const xs = Array.from({ length: 8 }, () => pick(r, 10, 40)).sort((x, y) => x - y);
      const q1 = (xs[1] + xs[2]) / 2, q3 = (xs[5] + xs[6]) / 2, iqr = q3 - q1, answer = q3 + 1.5 * iqr;
      return {
        q: `<p>Eight customers waited ${xs.join(', ')} minutes on a support line (already sorted). Using the middle of each half for the quartiles, what is Tukey's upper fence, above which a wait counts as an outlier?</p>`,
        answer, unit: 'minutes', tol: 0.005,
        hint: 'Lower half: the first four values; Q1 is the middle of them. Upper half: the last four; Q3 is their middle. Fence = Q3 + 1.5 × (Q3 − Q1).',
        solution: steps(
          `Q1 = (${xs[1]} + ${xs[2]}) ÷ 2 = ${n(q1)}; Q3 = (${xs[5]} + ${xs[6]}) ÷ 2 = ${n(q3)}.`,
          `IQR = ${n(q3)} − ${n(q1)} = ${n(iqr)}.`,
          `Upper fence = ${n(q3)} + 1.5 × ${n(iqr)} = <b>${n(answer)} minutes</b>. Any wait above that would be drawn as a dot beyond the whisker.`),
        xs,
      };
    },
    verify: (p) => { const s = p.xs; return 2.5 * ((s[5] + s[6]) / 2) - 1.5 * ((s[1] + s[2]) / 2); },
  },
  'correlation-causation-r': {
    title: 'work out a correlation by hand',
    make(r) {
      const xs = [1, 2, 3, 4, 5], slope = pick(r, 1, 3), ys = xs.map((x) => slope * x + pick(r, -2, 2) + 3);
      const mx = mean(xs), my = mean(ys), dx = xs.map((x) => x - mx), dy = ys.map((y) => y - my);
      const top = sum(dx.map((d, i) => d * dy[i])), sx = Math.sqrt(sum(dx.map((d) => d * d))), sy = Math.sqrt(sum(dy.map((d) => d * d)));
      const answer = top / (sx * sy);
      return {
        q: `<p>An ice-cream van logs hours of sunshine and tubs sold (in tens) on five days:</p>${table(['Sunshine (h)', ...xs], [['Tubs (tens)', ...ys]])}<p>What is the correlation coefficient r?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Subtract each column\'s mean. r = Σ(dx·dy) ÷ (√Σdx² × √Σdy²).',
        solution: steps(
          `Means: sunshine ${n(mx)}, tubs ${n(my)}.`,
          `Deviations: x ${dx.join(', ')}; y ${dy.map((d) => n(d)).join(', ')}.`,
          `Σ dx·dy = ${n(top, 4)}; √Σdx² = ${n(sx)}; √Σdy² = ${n(sy)}.`,
          `r = ${n(top, 4)} ÷ (${n(sx)} × ${n(sy)}) = <b>${n(answer)}</b>. Sun and sales move together, but that alone doesn't prove the sun causes the sales.`),
        xs, ys,
      };
    },
    verify: (p) => { const k = p.xs.length, Sx = sum(p.xs), Sy = sum(p.ys), Sxy = sum(p.xs.map((x, i) => x * p.ys[i])), Sxx = sum(p.xs.map((x) => x * x)), Syy = sum(p.ys.map((y) => y * y)); return (k * Sxy - Sx * Sy) / Math.sqrt((k * Sxx - Sx * Sx) * (k * Syy - Sy * Sy)); },
  },
  'cleaning-data-zscore': {
    title: 'put two columns on the same scale',
    make(r) {
      const m = pick(r, 30, 60), s = pick(r, 8, 16), x = m + pick(r, -25, 25);
      const answer = (x - m) / s;
      return {
        q: `<p>In a gym's training data, member age has mean ${m} years and standard deviation ${s} years. Standardise the age of a new ${x}-year-old member (find the z-score).</p>`,
        answer, unit: '', tol: 0.005, abs: 0.001,
        hint: 'z = (x − mean) ÷ standard deviation. Use the training mean and sd, even for a new member.',
        solution: steps(
          `Gap from the mean: ${x} − ${m} = ${x - m} years.`,
          `In standard deviations: ${x - m} ÷ ${s} = <b>${n(answer)}</b>. ${answer >= 0 ? 'Older' : 'Younger'} than average by ${n(Math.abs(answer))} standard deviations, a number that can now be compared with any other standardised column.`),
        m, s, x,
      };
    },
    verify: (p) => p.x / p.s - p.m / p.s,
  },
  'cleaning-data-median-fill': {
    title: 'fill a gap with the training median',
    make(r) {
      const xs = Array.from({ length: 7 }, () => pick(r, 20, 60)); xs[pick(r, 0, 6)] = pick(r, 150, 300);
      const sorted = [...xs].sort((a, b) => a - b), answer = sorted[3];
      return {
        q: `<p>A delivery table's training rows have these order values in dollars: ${xs.join(', ')}. One test row has its order value missing. Which value should fill it, if you fill with the training median?</p>`,
        answer, unit: '$', tol: 0, abs: 0.01,
        hint: 'Sort the seven training values; the median is the 4th one. (The mean would be pulled up by the very large order.)',
        solution: steps(
          `Sorted: ${sorted.join(', ')}.`,
          `The middle (4th) value is <b>$${answer}</b>. The mean, $${n(mean(xs))}, is dragged up by the one big order, so the median is the safer fill. Add a "was missing" flag too.`),
        xs,
      };
    },
    verify: (p) => [...p.xs].sort((a, b) => b - a)[3],
  },
  'train-test-split-rows': {
    title: 'how many rare cases are left to train on?',
    make(r) {
      const rows = pick(r, 5000, 20000, 1000), rate = pick(r, 2, 8), testShare = pick(r, 15, 25, 5), valShare = pick(r, 15, 25, 5);
      const pos = (rows * rate) / 100, afterTest = pos * (1 - testShare / 100), answer = afterTest * (1 - valShare / 100);
      return {
        q: `<p>An insurer has ${rows.toLocaleString('en-CA')} past claims, ${rate} % of them fraud. It holds out a stratified ${testShare} % test set, then a stratified ${valShare} % of what is left for validation. How many fraud cases remain in the training set?</p>`,
        answer, unit: 'cases', tol: 0.01,
        hint: 'Stratified means every set keeps the same fraud share. Find the fraud cases, take away the test share, then take away the validation share of the rest.',
        solution: steps(
          `Fraud cases: ${rate} % of ${rows.toLocaleString('en-CA')} = ${n(pos, 4)}.`,
          `After the test set: ${n(pos, 4)} × ${n(1 - testShare / 100)} = ${n(afterTest, 4)}.`,
          `After validation: ${n(afterTest, 4)} × ${n(1 - valShare / 100)} = <b>${n(answer, 4)}</b> fraud cases to learn from.`),
        rows, rate, testShare, valShare,
      };
    },
    verify: (p) => (p.rows * (1 - p.testShare / 100) * (1 - p.valShare / 100) * p.rate) / 100,
  },
  'train-test-split-se': {
    title: 'how much can a test score wobble?',
    make(r) {
      const nt = [50, 100, 200, 400, 800][Math.min(4, Math.floor(r() * 5))], acc = pick(r, 0.75, 0.95, 0.01);
      const answer = Math.sqrt((acc * (1 - acc)) / nt) * 100;
      return {
        q: `<p>A spam filter gets ${Math.round(acc * 100)} % of ${nt} test emails right. What is the standard error of that accuracy, in percentage points? (Use √(p(1 − p)/n).)</p>`,
        answer, unit: 'points', tol: 0.01,
        hint: `p = ${acc}, n = ${nt}. Work out √(p(1 − p)/n), then × 100 for percentage points.`,
        solution: steps(
          `p(1 − p) = ${acc} × ${n(1 - acc)} = ${n(acc * (1 - acc))}.`,
          `Divide by ${nt} and take the square root: ${n(answer / 100)}.`,
          `That is <b>${n(answer)} points</b>. A 95 % range is roughly ± ${n(2 * answer)} points: four times the test emails would halve it.`),
        nt, acc,
      };
    },
    verify: (p) => (100 * Math.sqrt(p.acc - p.acc * p.acc)) / Math.sqrt(p.nt),
  },

  // ---------- Module 3 ----------
  'linear-model-predict': {
    title: 'read and use a linear model',
    make(r) {
      const w1 = pick(r, 2, 5, 0.1), w2 = pick(r, 200, 600, 10), b = pick(r, 800, 1600, 50), ads = pick(r, 50, 400, 10), wk = r() < 0.5 ? 1 : 0;
      const answer = w1 * ads + w2 * wk + b;
      return {
        q: `<p>An online shop's model for daily sales (in $) is ŷ = ${w1} × ads + ${w2} × weekend + ${b}, where <i>ads</i> is that day's ad spend in dollars and <i>weekend</i> is 1 on Saturday or Sunday and 0 otherwise. Predict sales for a ${wk ? 'Saturday' : 'Tuesday'} with $${ads} of ads.</p>`,
        answer, unit: '$', tol: 0.002,
        hint: `Put the inputs in: ads = ${ads} and weekend = ${wk}. Multiply each by its weight, add them, then add the bias.`,
        solution: steps(
          `Ads: ${w1} × ${ads} = ${n(w1 * ads, 5)}.`,
          `Weekend: ${w2} × ${wk} = ${w2 * wk}.`,
          `Total: ${n(w1 * ads, 5)} + ${w2 * wk} + ${b} = <b>$${n(answer, 5)}</b>. Each effect simply adds on: that is what "linear" means.`),
        w1, w2, b, ads, wk,
      };
    },
    verify: (p) => [p.w1, p.w2, p.b].reduce((s, w, i) => s + w * [p.ads, p.wk, 1][i], 0),
  },
  'least-squares-slope': {
    title: 'fit the least-squares line by hand',
    make(r) {
      const xs = [1, 2, 3, 4, 5].map((x) => x * pick(r, 10, 20, 10)), m = pick(r, 2, 4, 0.5), c = pick(r, 50, 120, 10);
      const ys = xs.map((x) => m * x + c + pick(r, -20, 20, 5));
      const mx = mean(xs), my = mean(ys), dx = xs.map((x) => x - mx), dy = ys.map((y) => y - my);
      const top = sum(dx.map((d, i) => d * dy[i])), bot = sum(dx.map((d) => d * d)), answer = top / bot;
      return {
        q: `<p>Five flats:</p>${table(['Size (m²)', ...xs], [['Price ($000)', ...ys]])}<p>What is the slope of the least-squares line, in $000 per m²?</p>`,
        answer, unit: '$000 per m²', tol: 0.005,
        hint: 'Find the two means, then m = Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)².',
        solution: steps(
          `Means: x̄ = ${n(mx)}, ȳ = ${n(my, 4)}.`,
          `x − x̄: ${dx.join(', ')}. y − ȳ: ${dy.map((d) => n(d, 4)).join(', ')}.`,
          `Σ products = ${n(top, 5)}; Σ(x − x̄)² = ${n(bot, 5)}.`,
          `m = ${n(top, 5)} ÷ ${n(bot, 5)} = <b>${n(answer, 4)}</b>. The intercept is then ${n(my, 4)} − ${n(answer, 4)} × ${n(mx)} = ${n(my - answer * mx, 4)}.`),
        xs, ys,
      };
    },
    verify: (p) => { const k = p.xs.length, Sx = sum(p.xs), Sy = sum(p.ys), Sxy = sum(p.xs.map((x, i) => x * p.ys[i])), Sxx = sum(p.xs.map((x) => x * x)); return (k * Sxy - Sx * Sy) / (k * Sxx - Sx * Sx); },
  },
  'gradient-descent-step': {
    title: 'one gradient descent step on a line',
    make(r) {
      const x1 = 1, x2 = 2, y1 = pick(r, 2, 5), y2 = y1 + pick(r, 1, 4), eta = pick(r, 0.05, 0.2, 0.05);
      const gw = (2 / 2) * ((0 - y1) * x1 + (0 - y2) * x2), gb = (2 / 2) * ((0 - y1) + (0 - y2));
      const answer = 0 - eta * gw;
      return {
        q: `<p>A line ŷ = wx + b is fitted to two days of a bakery's data, (x, y) = (${x1}, ${y1}) and (${x2}, ${y2}), using the mean squared error. Start at w = 0, b = 0 and take one gradient descent step with learning rate ${eta}. What is the new w?</p>`,
        answer, unit: '', tol: 0.002,
        hint: '∂L/∂w = (2/n) Σ (ŷ − y)·x. With w = b = 0 every prediction is 0, so each error ŷ − y is just −y.',
        solution: steps(
          `Predictions 0 and 0; errors ŷ − y: −${y1} and −${y2}.`,
          `∂L/∂w = (2/2) × ((−${y1}) × ${x1} + (−${y2}) × ${x2}) = ${gw}. (And ∂L/∂b = ${gb}.)`,
          `New w = 0 − ${eta} × (${gw}) = <b>${n(answer)}</b>. The line tilts upwards, towards the data.`),
        y1, y2, eta,
      };
    },
    verify: (p) => { const L = (w) => ((w - p.y1) ** 2 + (2 * w - p.y2) ** 2) / 2, h = 1e-5; return -p.eta * (L(h) - L(-h)) / (2 * h); },
  },
  'multiple-regression-solve': {
    title: 'solve a two-input normal equation',
    make(r) {
      const w1 = pick(r, 20, 40), w2 = -pick(r, 5, 20), a = pick(r, 8, 14), d = pick(r, 4, 8), c = pick(r, 2, Math.min(6, Math.floor(Math.sqrt(a * d)) - 1));
      const e = a * w1 + c * w2, f = c * w1 + d * w2;
      return {
        q: `<p>For a price model with centred inputs size (x₁) and age (x₂), the sums are Σx₁² = ${a}, Σx₁x₂ = ${c}, Σx₂² = ${d}, Σx₁y = ${e} and Σx₂y = ${f}. The normal equation is ${a}w₁ + ${c}w₂ = ${e} and ${c}w₁ + ${d}w₂ = ${f}. What is w₁?</p>`,
        answer: w1, unit: '', tol: 0.002,
        hint: 'Eliminate w₂: multiply the first equation by ' + d + ' and the second by ' + c + ', then subtract.',
        solution: steps(
          `${d} × first: ${a * d}w₁ + ${c * d}w₂ = ${e * d}.`,
          `${c} × second: ${c * c}w₁ + ${c * d}w₂ = ${f * c}.`,
          `Subtract: ${a * d - c * c}w₁ = ${e * d - f * c}, so w₁ = <b>${n(w1)}</b>.`,
          `Then w₂ = (${f} − ${c} × ${w1}) ÷ ${d} = ${n(w2)}. Size pushes the price up; age pulls it down.`),
        a, c, d, e, f,
      };
    },
    verify: (p) => { const det = p.a * p.d - p.c * p.c; return (p.e * p.d - p.c * p.f) / det; },
  },
  'measuring-fit-rmse': {
    title: 'MAE or RMSE?',
    make(r) {
      const es = Array.from({ length: 5 }, () => pick(r, -6, 6)); es.push(pick(r, 15, 30));
      const answer = Math.sqrt(mean(es.map((e) => e * e))), mae = mean(es.map(Math.abs));
      return {
        q: `<p>A delivery-time model's errors on six test orders were ${es.join(', ')} minutes. What is its RMSE, in minutes?</p>`,
        answer, unit: 'minutes', tol: 0.005,
        hint: 'Square each error, average the squares, then take the square root.',
        solution: steps(
          `Squares: ${es.map((e) => e * e).join(', ')}. Sum = ${sum(es.map((e) => e * e))}.`,
          `Mean square: ${sum(es.map((e) => e * e))} ÷ 6 = ${n(answer * answer, 4)}.`,
          `RMSE = √${n(answer * answer, 4)} = <b>${n(answer)} minutes</b>. The MAE is only ${n(mae)}: the one big miss counts far more in RMSE.`),
        es,
      };
    },
    verify: (p) => Math.hypot(...p.es) / Math.sqrt(p.es.length),
  },
  'measuring-fit-r2': {
    title: 'how much does the model explain?',
    make(r) {
      const ys = Array.from({ length: 4 }, () => pick(r, 10, 40)), preds = ys.map((y) => y + pick(r, -4, 4));
      if (new Set(ys).size === 1) ys[0] += 10;
      const my = mean(ys), sst = sum(ys.map((y) => (y - my) ** 2)), sse = sum(ys.map((y, i) => (y - preds[i]) ** 2)), answer = 1 - sse / sst;
      return {
        q: `<p>A café's model predicted ${preds.join(', ')} sandwiches on four test days; the true sales were ${ys.join(', ')}. What is the model's R²?</p>`,
        answer, unit: '', tol: 0.005, abs: 0.002,
        hint: 'R² = 1 − SSE ÷ SST. SSE adds the squared errors of the model; SST adds the squared gaps of the true values from their mean.',
        solution: steps(
          `Mean of the true values: ${n(my)}. SST = ${ys.map((y) => n((y - my) ** 2)).join(' + ')} = ${n(sst, 4)}.`,
          `Errors: ${ys.map((y, i) => y - preds[i]).join(', ')}. SSE = ${n(sse, 4)}.`,
          `R² = 1 − ${n(sse, 4)} ÷ ${n(sst, 4)} = <b>${n(answer)}</b>.${answer < 0 ? ' Negative: worse than always guessing the mean.' : ''}`),
        ys, preds,
      };
    },
    verify: (p) => { const my = mean(p.ys); return (sum(p.ys.map((y) => (y - my) ** 2)) - sum(p.ys.map((y, i) => (y - p.preds[i]) ** 2))) / sum(p.ys.map((y) => (y - my) ** 2)); },
  },
  'polynomial-features-peak': {
    title: 'find the peak of a fitted curve',
    make(r) {
      const peak = pick(r, 24, 32), c = pick(r, 0.2, 0.5, 0.05), b = +(2 * c * peak).toFixed(4), a = -pick(r, 100, 200, 10);
      return {
        q: `<p>A café fits iced-drink sales against temperature t (°C) with a squared feature: sales = ${a} + ${b} t − ${c} t². At what temperature are sales highest?</p>`,
        answer: peak, unit: '°C', tol: 0.002,
        hint: `At the peak the slope is zero. The slope of the curve is ${b} − ${2 * c} t (Lesson 1.5).`,
        solution: steps(
          `Slope: d(sales)/dt = ${b} − 2 × ${c} t = ${b} − ${n(2 * c)} t.`,
          `Set it to zero: t = ${b} ÷ ${n(2 * c)} = <b>${n(peak)} °C</b>.`,
          `Sales there: ${a} + ${b} × ${peak} − ${c} × ${peak}² = ${n(a + b * peak - c * peak * peak, 4)} drinks. Hotter than that, people stay indoors.`),
        a, b, c,
      };
    },
    verify: (p) => { let best = 0, bv = -Infinity; for (let t = 0; t <= 50; t += 0.001) { const v = p.a + p.b * t - p.c * t * t; if (v > bv) { bv = v; best = t; } } return best; },
  },
  'overfitting-decompose': {
    title: 'split the test error into its parts',
    make(r) {
      const bias = pick(r, 1, 6), variance = pick(r, 4, 30), noise = pick(r, 2, 6);
      const answer = bias * bias + variance + noise * noise;
      return {
        q: `<p>For a delivery-time model, a study over many training sets finds: the average prediction is off by ${bias} minutes (bias), predictions vary between training sets with variance ${variance} minutes², and the delivery times themselves have random noise with standard deviation ${noise} minutes. What is the expected squared error on a new order, in minutes²?</p>`,
        answer, unit: 'minutes²', tol: 0.002,
        hint: 'Expected squared error = bias² + variance + noise². Square the bias and the noise standard deviation first.',
        solution: steps(
          `Bias² = ${bias}² = ${bias * bias}. Noise² = ${noise}² = ${noise * noise}.`,
          `Total = ${bias * bias} + ${variance} + ${noise * noise} = <b>${answer} minutes²</b> (an RMSE of about ${n(Math.sqrt(answer))} minutes).`,
          `${variance > bias * bias ? 'Variance is the biggest part you can change: the model is too jumpy, so simplify it, regularise it or add data.' : 'Bias is the biggest part you can change: the model is too simple, so give it more flexibility or better features.'} The noise part, ${noise * noise}, no model can remove.`),
        bias, variance, noise,
      };
    },
    verify: (p) => Math.hypot(p.bias, p.noise) ** 2 + p.variance,
  },
  'regularisation-ridge': {
    title: 'shrink a weight with ridge',
    make(r) {
      const w = pick(r, 2, 9, 0.5) * (r() < 0.5 ? -1 : 1), s = pick(r, 10, 50, 5), lam = pick(r, 5, 40, 5);
      const answer = (w * s) / (s + lam);
      return {
        q: `<p>For one standardised feature with Σx² = ${s}, plain least squares gives a weight of ${w}. What weight does ridge regression give with λ = ${lam}?</p>`,
        answer, unit: '', tol: 0.002,
        hint: 'For one feature, ridge scales the least-squares weight by s ÷ (s + λ), where s = Σx².',
        solution: steps(
          `Shrink factor: ${s} ÷ (${s} + ${lam}) = ${n(s / (s + lam))}.`,
          `Ridge weight: ${w} × ${n(s / (s + lam))} = <b>${n(answer)}</b>. Smaller, same sign, never exactly zero.`),
        w, s, lam,
      };
    },
    verify: (p) => p.w / (1 + p.lam / p.s),
  },
  'regularisation-lasso': {
    title: 'shrink, or drop, a weight with lasso',
    make(r) {
      const ws = [pick(r, 0.5, 6, 0.5), -pick(r, 0.5, 6, 0.5), pick(r, 0.5, 6, 0.5)], lam = pick(r, 1, 3, 0.5);
      const lasso = ws.map((w) => Math.sign(w) * Math.max(0, Math.abs(w) - lam)), answer = lasso.filter((v) => v !== 0).length;
      return {
        q: `<p>A shop's sales model has three standardised features with least-squares weights ${ws.join(', ')}. Lasso (in its simple one-feature-at-a-time form) subtracts λ′ = ${lam} from the size of each weight and clips at zero. How many features does the model still use?</p>`,
        answer, unit: 'features', tol: 0, abs: 0.01,
        hint: `New weight = sign(w) × max(0, |w| − ${lam}). A feature is dropped when its weight becomes 0.`,
        solution: steps(
          ws.map((w, i) => `${w} → ${n(lasso[i])}`).join('; ') + '.',
          `<b>${answer}</b> feature${answer === 1 ? '' : 's'} keep a non-zero weight. Lasso has done feature selection: the weak ones are gone entirely.`),
        ws, lam,
      };
    },
    verify: (p) => p.ws.reduce((k, w) => k + (Math.abs(w) > p.lam ? 1 : 0), 0),
  },
};
