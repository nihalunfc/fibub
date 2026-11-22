// Live problems for Statistics for analysts, part a: Modules 1-3 (see ../problems.js).
import { pick, n, steps, table } from './util.js';

const sum = (a) => a.reduce((s, v) => s + v, 0);
const mean = (a) => sum(a) / a.length;
const sorted = (a) => [...a].sort((x, y) => x - y);
const sd = (a) => { const m = mean(a); return Math.sqrt(sum(a.map((v) => (v - m) ** 2)) / (a.length - 1)); };
/** Quantile with linear interpolation (pandas and Excel PERCENTILE.INC). */
const quant = (a, q) => { const s = sorted(a), h = (s.length - 1) * q, lo = Math.floor(h); return s[lo] + (h - lo) * ((s[lo + 1] ?? s[lo]) - s[lo]); };
/** Standard normal CDF (Abramowitz and Stegun 26.2.17, error < 7.5e-8). */
export const phi = (z) => { const t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989423 * Math.exp(-z * z / 2); const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; };
const money = (v) => '$' + n(v, 4);

export default {
  // ---------- Module 1 ----------
  'why-statistics-wobble': {
    title: 'how many usual wobbles is this week?',
    make(r) {
      const m = pick(r, 400, 900, 10), s = pick(r, 20, 60, 5), z = pick(r, -2.5, 2.5, 0.25) || 1.5;
      const x = m + z * s, answer = (x - m) / s;
      return {
        q: `<p>A shop usually sells <b>${m}</b> items a day, and a normal day is typically <b>${s}</b> items away from that (the standard deviation). Today it sold <b>${x}</b>. How many standard deviations from normal is today? (Use a minus sign if below.)</p>`,
        answer, unit: 'SDs', tol: 0.001, abs: 0.01,
        hint: 'Find the gap from the usual level, then divide it by the usual wobble.',
        solution: steps(`Gap: ${x} − ${m} = ${x - m}.`, `Divide by the usual wobble: ${x - m} ÷ ${s} = <b>${n(answer)}</b>.`,
          Math.abs(answer) < 2 ? 'Within 2 SDs: an ordinary day, not news on its own.' : 'More than 2 SDs: unusual enough to look into.'),
        m, s, x,
      };
    },
    verify: (p) => (p.x - p.m) / p.s,
  },
  'centre-mean-median': {
    title: 'mean against median with one big order',
    make(r) {
      const v = [pick(r, 8, 14), pick(r, 14, 18), pick(r, 18, 22), pick(r, 22, 26), pick(r, 26, 32), pick(r, 32, 40), pick(r, 150, 400, 10)];
      const s = sorted(v), med = s[3], m = mean(v), answer = m - med;
      return {
        q: `<p>Seven customers spent ($): ${v.join(', ')}. How many dollars is the <b>mean</b> above the <b>median</b>?</p>`,
        answer, unit: '$', tol: 0.002,
        hint: 'Mean: add all seven and divide by 7. Median: sort them and take the 4th value.',
        solution: steps(`Total = ${sum(v)}; mean = ${sum(v)} ÷ 7 = ${n(m, 4)}.`, `Sorted: ${s.join(', ')}; the 4th value is the median, ${med}.`,
          `Mean − median = ${n(m, 4)} − ${med} = <b>${n(answer, 4)}</b>. One big order lifts the mean far above what a typical customer spends.`),
        v,
      };
    },
    verify: (p) => mean(p.v) - quant(p.v, 0.5),
  },
  'spread-sd': {
    title: 'standard deviation of five days',
    make(r) {
      const base = pick(r, 10, 40), v = Array.from({ length: 5 }, () => base + pick(r, -6, 6));
      if (new Set(v).size === 1) v[0] += 3;
      const m = mean(v), sq = v.map((x) => (x - m) ** 2), answer = sd(v);
      return {
        q: `<p>Returns at a store over five days: <b>${v.join(', ')}</b>. What is the sample standard deviation (divide by n − 1)?</p>`,
        answer, unit: 'returns', tol: 0.005,
        hint: 'Mean first. Then each gap from the mean, squared. Add the squares, divide by 4 (that is n − 1), and take the square root.',
        solution: steps(`Mean = ${sum(v)} ÷ 5 = ${n(m, 4)}.`, `Squared gaps: ${sq.map((x) => n(x, 4)).join(', ')}; sum = ${n(sum(sq), 4)}.`,
          `Variance = ${n(sum(sq), 4)} ÷ 4 = ${n(sum(sq) / 4, 4)}.`, `SD = √${n(sum(sq) / 4, 4)} = <b>${n(answer)}</b> returns.`),
        v,
      };
    },
    verify: (p) => { const m = p.v.reduce((a, b) => a + b) / 5; return Math.sqrt(p.v.reduce((a, b) => a + (b - m) * (b - m), 0) / 4); },
  },
  'shape-outliers-fence': {
    title: 'the upper fence of a box plot',
    make(r) {
      const v = sorted(Array.from({ length: 9 }, () => pick(r, 10, 40))), big = pick(r, 60, 120);
      const all = [...v, big], q1 = quant(all, 0.25), q3 = quant(all, 0.75), answer = q3 + 1.5 * (q3 - q1);
      return {
        q: `<p>Minutes to answer ten support emails, sorted: <b>${all.join(', ')}</b>. Using quartiles with interpolation (as pandas does), what is the <b>upper fence</b> Q3 + 1.5 × IQR?</p>`,
        answer, unit: 'minutes', tol: 0.002,
        hint: 'With 10 sorted values counted from position 0, Q1 sits at position 2.25 and Q3 at position 6.75: a quarter or three quarters of the way between neighbours.',
        solution: steps(`Q1 (position 2.25) = ${all[2]} + 0.25 × (${all[3]} − ${all[2]}) = ${n(q1, 4)}.`,
          `Q3 (position 6.75) = ${all[6]} + 0.75 × (${all[7]} − ${all[6]}) = ${n(q3, 4)}.`,
          `IQR = ${n(q3 - q1, 4)}; upper fence = ${n(q3, 4)} + 1.5 × ${n(q3 - q1, 4)} = <b>${n(answer, 4)}</b>.`,
          big > answer ? `${big} is beyond the fence: flag it and find out why.` : `${big} is inside the fence, so it is not flagged.`),
        all,
      };
    },
    verify: (p) => { const q1 = quant(p.all, 0.25), q3 = quant(p.all, 0.75); return q3 + 1.5 * (q3 - q1); },
  },
  'z-score-compare': {
    title: 'which region had the more unusual week?',
    make(r) {
      const mA = pick(r, 30, 60) * 1000, sA = pick(r, 3, 8) * 1000, xA = mA + pick(r, 2, 10) * 1000;
      const mB = pick(r, 10, 25) * 1000, sB = pick(r, 1, 3) * 1000 / 2 + 500, xB = mB + pick(r, 1, 6) * 1000;
      const zA = (xA - mA) / sA, zB = (xB - mB) / sB, answer = Math.max(zA, zB);
      return {
        q: `<p>North sold ${money(xA)} this week (usual ${money(mA)}, SD ${money(sA)}). South sold ${money(xB)} (usual ${money(mB)}, SD ${money(sB)}). Work out both z-scores. What is the <b>larger</b> one?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'z = (this week − usual) ÷ SD, separately for each region.',
        solution: steps(`North: (${xA} − ${mA}) ÷ ${sA} = ${n(zA)}.`, `South: (${xB} − ${mB}) ÷ ${sB} = ${n(zB)}.`,
          `The larger is <b>${n(answer)}</b>: ${zA >= zB ? 'North' : 'South'} had the more unusual week, whatever the dollar gaps say.`),
        mA, sA, xA, mB, sB, xB,
      };
    },
    verify: (p) => Math.max((p.xA - p.mA) / p.sA, (p.xB - p.mB) / p.sB),
  },

  // ---------- Module 2 ----------
  'probability-given': {
    title: 'a conditional probability from a table',
    make(r) {
      const dr = pick(r, 40, 120, 5), dk = pick(r, 300, 700, 10), nr = pick(r, 30, 90, 5), nk = pick(r, 900, 1600, 10);
      const answer = dr / (dr + dk);
      return {
        q: `<p>Last month's orders:</p>${table(['', 'Discount', 'No discount'], [['Returned', dr, nr], ['Kept', dk, nk]])}<p>What is P(returned | discount), the share of <b>discounted</b> orders that were returned? Give a decimal.</p>`,
        answer, unit: '', tol: 0.002,
        hint: 'Only look inside the Discount column: returned ÷ all discounted orders.',
        solution: steps(`Discounted orders: ${dr} + ${dk} = ${dr + dk}.`, `Returned among them: ${dr}.`,
          `P(returned | discount) = ${dr} ÷ ${dr + dk} = <b>${n(answer)}</b>. Compare: without a discount it is ${nr} ÷ ${nr + nk} = ${n(nr / (nr + nk))}.`),
        dr, dk,
      };
    },
    verify: (p) => 1 - p.dk / (p.dr + p.dk),
  },
  'bayes-flag': {
    title: 'how often is a flag right?',
    make(r) {
      const base = pick(r, 0.5, 5, 0.5) / 100, sens = pick(r, 85, 99) / 100, fpr = pick(r, 1, 5) / 100, N = 10000;
      const tp = base * N * sens, fp = (1 - base) * N * fpr, answer = tp / (tp + fp);
      return {
        q: `<p>A check catches ${n(sens * 100)} % of faulty units and wrongly flags ${n(fpr * 100)} % of good ones. ${n(base * 100)} % of units are faulty. A unit is flagged: what is the probability it is really faulty? Give a decimal.</p>`,
        answer, unit: '', tol: 0.003,
        hint: 'Imagine 10,000 units. Split them into faulty and good first, then count the flagged ones in each group.',
        solution: steps(`Faulty: ${n(base * N, 4)}; caught: ${n(base * N, 4)} × ${sens} = ${n(tp, 4)}.`,
          `Good: ${n((1 - base) * N, 5)}; wrongly flagged: × ${fpr} = ${n(fp, 4)}.`,
          `P(faulty | flag) = ${n(tp, 4)} ÷ (${n(tp, 4)} + ${n(fp, 4)}) = <b>${n(answer)}</b>.`),
        base, sens, fpr,
      };
    },
    verify: (p) => (p.sens * p.base) / (p.sens * p.base + p.fpr * (1 - p.base)),
  },
  'expected-value-coupon': {
    title: 'how much does the coupon add per customer?',
    make(r) {
      const profit = pick(r, 20, 60, 5), off = pick(r, 5, 15), p0 = pick(r, 3, 8) / 100, p1 = p0 + pick(r, 1, 5) / 100;
      const e0 = p0 * profit, e1 = p1 * (profit - off), answer = e1 - e0;
      return {
        q: `<p>Each sale makes $${profit} profit. Without a coupon ${n(p0 * 100)} % of customers buy; with a $${off}-off coupon ${n(p1 * 100)} % buy. How many dollars per customer does the coupon add to expected profit? (Negative if it loses money.)</p>`,
        answer, unit: '$', tol: 0.002, abs: 0.001,
        hint: 'EV = buy rate × profit per sale. With the coupon the profit per sale drops by the discount.',
        solution: steps(`No coupon: ${p0} × ${profit} = $${n(e0)}.`, `Coupon: ${n(p1)} × (${profit} − ${off}) = $${n(e1)}.`,
          `Difference: <b>$${n(answer)}</b> per customer${answer > 0 ? ', so the coupon pays if these rates hold' : ': the coupon loses money'}.`),
        profit, off, p0, p1,
      };
    },
    verify: (p) => p.p1 * p.profit - p.p1 * p.off - p.p0 * p.profit,
  },
  'counting-pairs': {
    title: 'comparisons among test arms',
    make(r) {
      const k = pick(r, 3, 12), answer = (k * (k - 1)) / 2;
      return {
        q: `<p>A test has <b>${k}</b> versions of a page. If you compare every version with every other version once, how many comparisons is that?</p>`,
        answer, unit: 'comparisons', tol: 0, abs: 0.01,
        hint: 'Pairs where order does not matter: kC2 = k × (k − 1) ÷ 2.',
        solution: steps(`Each of ${k} versions can be paired with ${k - 1} others: ${k} × ${k - 1} = ${k * (k - 1)}.`, `Each pair was counted twice (A-B and B-A), so halve it: <b>${answer}</b>.`),
        k,
      };
    },
    verify: (p) => { let c = 0; for (let i = 0; i < p.k; i++) for (let j = i + 1; j < p.k; j++) c++; return c; },
  },
  // ---------- Module 3 ----------
  'random-variable-mean': {
    title: 'mean of a basket-size distribution',
    make(r) {
      let w = [pick(r, 1, 6), pick(r, 1, 6), pick(r, 1, 6), pick(r, 1, 6)]; const t = sum(w);
      const pr = w.map((x) => x / t), answer = pr.reduce((s, p, i) => s + (i + 1) * p, 0);
      const ps = pr.map((p) => n(p, 3));
      return {
        q: `<p>Items per basket at a corner shop:</p>${table(['Items', 1, 2, 3, 4], [['Probability', ...ps]])}<p>What is the mean number of items per basket?</p>`,
        answer, unit: 'items', tol: 0.01,
        hint: 'Multiply each number of items by its probability, then add up.',
        solution: steps(pr.map((p, i) => `${i + 1} × ${ps[i]}`).join(' + ') + ` = <b>${n(answer)}</b> items.`),
        pr,
      };
    },
    verify: (p) => p.pr[0] + 2 * p.pr[1] + 3 * p.pr[2] + 4 * p.pr[3],
  },
  'binomial-exact': {
    title: 'chance of exactly k yeses',
    make(r) {
      const nn = pick(r, 5, 12), p = pick(r, 0.1, 0.9, 0.1), k = pick(r, 0, nn);
      const C = (a, b) => { let c = 1; for (let i = 1; i <= b; i++) c = (c * (a - b + i)) / i; return c; };
      const answer = C(nn, k) * p ** k * (1 - p) ** (nn - k);
      return {
        q: `<p>Each of <b>${nn}</b> visitors buys with probability <b>${n(p)}</b>, independently. What is the probability that exactly <b>${k}</b> of them buy?</p>`,
        answer, unit: '', tol: 0.005, abs: 1e-5,
        hint: `Use nCk × p^k × (1 − p)^(n − k) with n = ${nn}, k = ${k}.`,
        solution: steps(`${nn}C${k} = ${C(nn, k)} ways to choose which ${k} buy.`, `Each way: ${n(p)}^${k} × ${n(1 - p)}^${nn - k} = ${n(p ** k * (1 - p) ** (nn - k), 4)}.`,
          `P = ${C(nn, k)} × ${n(p ** k * (1 - p) ** (nn - k), 4)} = <b>${n(answer, 4)}</b>.`),
        nn, p, k,
      };
    },
    verify: (q) => { // add up the chance of every pattern with exactly k yeses (brute force)
      let s = 0; for (let m = 0; m < 1 << q.nn; m++) { let c = 0; for (let b = m; b; b >>= 1) c += b & 1; if (c === q.k) s += q.p ** q.k * (1 - q.p) ** (q.nn - q.k); } return s;
    },
  },
  'poisson-overload': {
    title: 'share of hours over capacity',
    make(r) {
      const lam = pick(r, 1, 6, 0.5), cap = Math.max(1, Math.round(lam) + pick(r, 0, 2));
      let term = Math.exp(-lam), cdf = term; const rows = [n(term, 4)];
      for (let k = 1; k <= cap; k++) { term *= lam / k; cdf += term; rows.push(n(term, 4)); }
      const answer = 1 - cdf;
      return {
        q: `<p>A help desk gets on average <b>${lam}</b> urgent tickets an hour (Poisson). One person can handle <b>${cap}</b> an hour. In what share of hours do more than ${cap} arrive? Give a decimal.</p>`,
        answer, unit: '', tol: 0.005,
        hint: `Add P(0) to P(${cap}) with P(k) = e^(−λ) λ^k ÷ k!, then take that from 1.`,
        solution: steps(`P(0) to P(${cap}): ${rows.join(', ')}.`, `Sum = ${n(cdf, 4)}.`, `P(more than ${cap}) = 1 − ${n(cdf, 4)} = <b>${n(answer)}</b>.`),
        lam, cap,
      };
    },
    verify: (p) => { // simulate-free check: sum the tail directly
      let t = Math.exp(-p.lam), s = 0; for (let k = 1; k < 200; k++) { t *= p.lam / k; if (k > p.cap) s += t; } return s;
    },
  },
  'normal-share-below': {
    title: 'share of bags under the label weight',
    make(r) {
      const label = pick(r, 250, 1000, 50), sigma = pick(r, 2, 8), mu = label + pick(r, 0, 12);
      const z = (label - mu) / sigma, answer = phi(z);
      return {
        q: `<p>Bags labelled ${label} g are filled with weights that are normal, mean <b>${mu} g</b> and SD <b>${sigma} g</b>. What share of bags is <b>under</b> ${label} g? Give a decimal.</p>`,
        answer, unit: '', tol: 0.01, abs: 0.0005,
        hint: 'z = (label − mean) ÷ SD, then the area to the left of z under the standard normal curve.',
        solution: steps(`z = (${label} − ${mu}) ÷ ${sigma} = ${n(z)}.`, `Area left of z = ${n(z)}: <b>${n(answer)}</b>.`),
        label, mu, sigma,
      };
    },
    verify: (p) => { // numerical integration of the normal density
      const f = (x) => Math.exp(-(((x - p.mu) / p.sigma) ** 2) / 2) / (p.sigma * Math.sqrt(2 * Math.PI)); let s = 0, a = p.mu - 12 * p.sigma, N = 20000, h = (p.label - a) / N;
      for (let i = 0; i < N; i++) s += f(a + (i + 0.5) * h) * h; return s;
    },
  },
  'exponential-wait': {
    title: 'chance of a long wait',
    make(r) {
      const m = pick(r, 2, 15), t = pick(r, 1, 30), answer = Math.exp(-t / m);
      return {
        q: `<p>Customers arrive independently, on average one every <b>${m}</b> minutes, so the wait for the next one is exponential with mean ${m}. What is the probability of waiting <b>more than ${t}</b> minutes? Give a decimal.</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'P(wait > t) = e^(−t ÷ mean).',
        solution: steps(`t ÷ mean = ${t} ÷ ${m} = ${n(t / m)}.`, `P = e^(−${n(t / m)}) = <b>${n(answer)}</b>.`),
        m, t,
      };
    },
    verify: (p) => { let s = 0, N = 20000, h = (60 * p.m) / N; for (let i = 0; i < N; i++) { const x = p.t + (i + 0.5) * h; s += Math.exp(-x / p.m) / p.m * h; } return s; },
  },
  'dist-mean-variance': {
    title: 'is this count data Poisson?',
    make(r) {
      const v = Array.from({ length: 8 }, () => pick(r, 0, 9));
      const m = mean(v), vr = sum(v.map((x) => (x - m) ** 2)) / (v.length - 1), answer = vr / m || 0;
      if (!m) v[0] = 3;
      const m2 = mean(v), vr2 = sum(v.map((x) => (x - m2) ** 2)) / (v.length - 1);
      return {
        q: `<p>Orders in eight one-hour windows: <b>${v.join(', ')}</b>. Work out the variance ÷ mean ratio (sample variance, divide by n − 1). Near 1 suggests Poisson; well above 1 suggests clumping.</p>`,
        answer: vr2 / m2, unit: '', tol: 0.005,
        hint: 'Mean first; then the sum of squared gaps divided by 7; then divide that variance by the mean.',
        solution: steps(`Mean = ${sum(v)} ÷ 8 = ${n(m2, 4)}.`, `Variance = ${n(vr2, 4)}.`, `Ratio = <b>${n(vr2 / m2)}</b> ${vr2 / m2 > 1.5 ? '(well above 1: more spread than Poisson)' : '(close enough to 1 for Poisson)'}.`),
        v,
      };
    },
    verify: (p) => { const m = mean(p.v); return sd(p.v) ** 2 / m; },
  },
};
