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
};
