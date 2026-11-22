// Live problems for Statistics for analysts, part c: Modules 7-9 (see ../problems.js).
import { pick, n, steps, table } from './util.js';
import { phi } from './a.js';

const sum = (a) => a.reduce((s, v) => s + v, 0);
const mean = (a) => sum(a) / a.length;
const fmt = (x) => x.toLocaleString('en-CA');

export default {
  // ---------- Module 7 ----------
  'ab-weeks': {
    title: 'how many whole weeks must the test run?',
    make(r) {
      const per = pick(r, 10, 80, 5) * 1000, daily = pick(r, 2, 15, 0.5) * 1000, days = (2 * per) / daily, answer = Math.ceil(days / 7);
      return {
        q: `<p>A test needs <b>${fmt(per)}</b> users per group (two groups). <b>${fmt(daily)}</b> eligible users arrive each day. Rounding up to whole weeks, how many weeks should it run?</p>`,
        answer, unit: 'weeks', tol: 0, abs: 0.01,
        hint: 'Total users = 2 × per group. Days = total ÷ daily traffic. Weeks = days ÷ 7, rounded up.',
        solution: steps(`Total: 2 × ${fmt(per)} = ${fmt(2 * per)} users.`, `Days: ${fmt(2 * per)} ÷ ${fmt(daily)} = ${n(days)}.`, `Weeks: ${n(days)} ÷ 7 = ${n(days / 7)} → <b>${answer}</b> whole weeks, so every weekday is covered equally.`),
        per, daily,
      };
    },
    verify: (p) => { let w = 0; while (w * 7 * p.daily < 2 * p.per) w++; return w; },
  },
  'metric-per-user': {
    title: 'revenue per user, not per order',
    make(r) {
      const users = pick(r, 2000, 9000, 100), buyers = Math.round(users * pick(r, 3, 9) / 100), aov = pick(r, 30, 90), answer = (buyers * aov) / users;
      return {
        q: `<p>In group B, <b>${fmt(users)}</b> users saw the page, <b>${fmt(buyers)}</b> of them bought once each, and the average order was <b>$${aov}</b>. What is revenue per user, the primary metric?</p>`,
        answer, unit: '$', tol: 0.002,
        hint: 'Total revenue = buyers × average order. Divide by all users, including those who did not buy.',
        solution: steps(`Revenue = ${fmt(buyers)} × $${aov} = $${fmt(buyers * aov)}.`, `Per user: $${fmt(buyers * aov)} ÷ ${fmt(users)} = <b>$${n(answer)}</b>.`, 'Dividing by buyers instead would hide whether fewer people bought.'),
        users, buyers, aov,
      };
    },
    verify: (p) => (p.buyers / p.users) * p.aov,
  },
  'ab-n-rule': {
    title: 'users per group for a minimum detectable effect',
    make(r) {
      const p = pick(r, 2, 10, 0.5) / 100, rel = pick(r, 5, 20, 2.5) / 100, mde = p * rel, answer = Math.ceil((16 * p * (1 - p)) / mde ** 2);
      return {
        q: `<p>Conversion is <b>${n(p * 100)} %</b>. You want to detect a <b>${n(rel * 100)} % relative</b> lift with 80 % power at α = 5 %. Using n ≈ 16·p(1 − p) ÷ MDE², how many users per group? (Round up.)</p>`,
        answer, unit: 'users', tol: 0.001, abs: 1.01,
        hint: 'MDE in absolute terms = p × relative lift. Then plug into 16·p(1 − p) ÷ MDE².',
        solution: steps(`MDE = ${n(p)} × ${n(rel)} = ${n(mde, 4)}.`, `16 × ${n(p)} × ${n(1 - p)} = ${n(16 * p * (1 - p), 4)}.`, `÷ ${n(mde, 4)}² = <b>${fmt(answer)}</b> per group.`),
        p, rel,
      };
    },
    verify: (q) => Math.ceil(16 * (1 - q.p) / (q.p * q.rel * q.rel)),
  },
  'peeking-looks': {
    title: 'false wins from peeking',
    make(r) {
      const looks = pick(r, 2, 10), answer = 1 - 0.95 ** looks;
      return {
        q: `<p>Suppose each of <b>${looks}</b> looks at a test with no real effect were an independent 5 % chance of a false win. What would be the chance of at least one false win? (Real looks overlap, so the true figure is somewhat lower, but the direction is the lesson.) Give a decimal.</p>`,
        answer, unit: '', tol: 0.003,
        hint: 'Chance every look stays quiet: 0.95^looks. Subtract from 1.',
        solution: steps(`All quiet: 0.95^${looks} = ${n(0.95 ** looks, 4)}.`, `At least one false win: <b>${n(answer)}</b>, against 0.05 for a single planned look.`),
        looks,
      };
    },
    verify: (p) => { let s = 0; for (let k = 0; k < p.looks; k++) s += 0.05 * 0.95 ** k; return s; }, // first false win at look k+1
  },
  'ab-ci-lift': {
    title: 'the lower end of the lift\'s 95 % interval',
    make(r) {
      const nA = pick(r, 5000, 15000, 500), nB = nA + pick(r, -100, 100, 10), xA = Math.round(nA * pick(r, 3, 6, 0.1) / 100), xB = Math.round(nB * (xA / nA + pick(r, 0, 1.2, 0.05) / 100));
      const pA = xA / nA, pB = xB / nB, se = Math.sqrt((pA * (1 - pA)) / nA + (pB * (1 - pB)) / nB), answer = 100 * (pB - pA - 1.96 * se);
      return {
        q: `<p>A: <b>${fmt(xA)}</b> orders from ${fmt(nA)} visitors. B: <b>${fmt(xB)}</b> from ${fmt(nB)}. What is the <b>lower end</b> of the 95 % CI for B − A, in percentage points?</p>`,
        answer, unit: 'points', tol: 0.01, abs: 0.003,
        hint: 'Rates first. SE = √(pA(1 − pA)/nA + pB(1 − pB)/nB). Lower end = (pB − pA) − 1.96 × SE.',
        solution: steps(`pA = ${n(pA * 100, 4)} %, pB = ${n(pB * 100, 4)} %: lift ${n((pB - pA) * 100)} points.`, `SE = ${n(se * 100)} points.`, `Lower end = ${n((pB - pA) * 100)} − 1.96 × ${n(se * 100)} = <b>${n(answer)}</b>${answer > 0 ? ': above 0.' : ': the interval includes 0.'}`),
        xA, nA, xB, nB,
      };
    },
    verify: (p) => { const a = p.xA / p.nA, b = p.xB / p.nB; return 100 * (b - a) - 196 * Math.sqrt(a * (1 - a) / p.nA + b * (1 - b) / p.nB); },
  },
  'srm-chi': {
    title: 'is the split broken?',
    make(r) {
      const tot = pick(r, 20, 200, 10) * 1000, gap = pick(r, 0, 1500, 50), a = tot / 2 + gap, b = tot / 2 - gap, E = tot / 2, answer = (2 * gap * gap) / E;
      return {
        q: `<p>A planned 50/50 test ended with A = <b>${fmt(a)}</b> and B = <b>${fmt(b)}</b> users. What is the χ² statistic for the split? (Above about 10.8 means p < 0.001: a sample ratio mismatch.)</p>`,
        answer, unit: '', tol: 0.003, abs: 0.001,
        hint: 'Expected = total ÷ 2 each. χ² = (A − E)²/E + (B − E)²/E.',
        solution: steps(`Expected: ${fmt(E)} each.`, `χ² = ${fmt(gap)}²/${fmt(E)} × 2 = <b>${n(answer)}</b>.`, answer > 10.83 ? 'SRM: do not trust the result; find the cause.' : 'No sign of a broken split.'),
        a, b,
      };
    },
    verify: (p) => { const E = (p.a + p.b) / 2; return ((p.a - E) ** 2 + (p.b - E) ** 2) / E; },
  },
  'beta-posterior-mean': {
    title: 'the posterior mean of a conversion rate',
    make(r) {
      const nn = pick(r, 100, 3000, 50), x = Math.round(nn * pick(r, 2, 12, 0.5) / 100), answer = (1 + x) / (2 + nn);
      return {
        q: `<p>Version B: <b>${x}</b> buyers out of <b>${fmt(nn)}</b> visitors. With a flat Beta(1, 1) prior, the posterior is Beta(1 + ${x}, 1 + ${nn - x}). What is its mean? Give a decimal.</p>`,
        answer, unit: '', tol: 0.002,
        hint: 'The mean of Beta(a, b) is a ÷ (a + b).',
        solution: steps(`a = ${1 + x}, b = ${1 + nn - x}.`, `Mean = ${1 + x} ÷ ${2 + nn} = <b>${n(answer, 4)}</b>, slightly pulled towards 0.5 from the raw ${n(x / nn, 4)}.`),
        x, nn,
      };
    },
    verify: (p) => { // numerically integrate x * density of Beta(1+x, 1+n-x) on the log scale
      const a = 1 + p.x, b = 1 + p.nn - p.x; let num = 0, den = 0, N = 20000;
      for (let i = 0; i < N; i++) { const t = (i + 0.5) / N, w = Math.exp((a - 1) * Math.log(t) + (b - 1) * Math.log(1 - t) - ((a - 1) * Math.log(a / (a + b)) + (b - 1) * Math.log(b / (a + b)))); num += t * w; den += w; }
      return num / den;
    },
  },
  'winners-curse': {
    title: 'how much do lucky winners overstate the lift?',
    make(r) {
      const se = pick(r, 0.5, 2, 0.25), lift = pick(r, 0.5, 3, 0.25), cut = 1.96 * se;
      // mean of a normal(lift, se) truncated below at the significance cut-off
      const a = (cut - lift) / se, dens = Math.exp(-a * a / 2) / Math.sqrt(2 * Math.PI), answer = lift + se * dens / (1 - phi(a));
      return {
        q: `<p>A feature truly lifts conversion by <b>${lift} points</b>, and the test's SE is <b>${se} points</b>. Only results above 1.96 × SE = ${n(cut)} points get reported as wins. On average, what lift do the <b>reported</b> wins show?</p>`,
        answer, unit: 'points', tol: 0.01,
        hint: 'The reported results are the upper tail of a normal centred on the true lift. Their mean is lift + SE × φ(a) ÷ (1 − Φ(a)), where a = (cut-off − lift) ÷ SE.',
        solution: steps(`a = (${n(cut)} − ${lift}) ÷ ${se} = ${n(a)}.`, `φ(a) = ${n(dens, 4)}; 1 − Φ(a) = ${n(1 - phi(a), 4)} (this is the power).`,
          `Mean reported lift = ${lift} + ${se} × ${n(dens, 4)} ÷ ${n(1 - phi(a), 4)} = <b>${n(answer)}</b> points, ${n(answer / lift)} times the truth.`),
        se, lift,
      };
    },
    verify: (p) => { // integrate the upper tail directly
      const cut = 1.96 * p.se, f = (x) => Math.exp(-(((x - p.lift) / p.se) ** 2) / 2); let num = 0, den = 0, N = 40000, h = (p.lift + 12 * p.se - cut) / N;
      for (let i = 0; i < N; i++) { const x = cut + (i + 0.5) * h; num += x * f(x); den += f(x); } return num / den;
    },
  },
  // ---------- Module 8 ----------
  'pearson-r': {
    title: 'Pearson correlation of five stores',
    make(r) {
      const x = [0, 1, 2, 3, 4].map((i) => 20 + 5 * i + pick(r, -3, 3)), y = x.map((v) => Math.round(0.5 * v + pick(r, -6, 6) + 40));
      if (new Set(y).size === 1) y[0] += 2;
      const mx = mean(x), my = mean(y), sxy = sum(x.map((v, i) => (v - mx) * (y[i] - my))), sxx = sum(x.map((v) => (v - mx) ** 2)), syy = sum(y.map((v) => (v - my) ** 2)), answer = sxy / Math.sqrt(sxx * syy);
      return {
        q: `<p>Five stores:</p>${table(['Staff hours (×10)', ...x], [['Satisfaction', ...y]])}<p>What is Pearson's r?</p>`,
        answer, unit: '', tol: 0.005, abs: 0.002,
        hint: 'r = Σ(x − x̄)(y − ȳ) ÷ √(Σ(x − x̄)² × Σ(y − ȳ)²).',
        solution: steps(`x̄ = ${n(mx)}, ȳ = ${n(my)}.`, `Σ(x − x̄)(y − ȳ) = ${n(sxy)}; Σ(x − x̄)² = ${n(sxx)}; Σ(y − ȳ)² = ${n(syy)}.`, `r = ${n(sxy)} ÷ √(${n(sxx)} × ${n(syy)}) = <b>${n(answer)}</b>.`),
        x, y,
      };
    },
    verify: (p) => { // average product of z-scores (n − 1 version)
      const sd = (a) => { const m = mean(a); return Math.sqrt(sum(a.map((v) => (v - m) ** 2)) / (a.length - 1)); };
      const zx = p.x.map((v) => (v - mean(p.x)) / sd(p.x)), zy = p.y.map((v) => (v - mean(p.y)) / sd(p.y)); return sum(zx.map((v, i) => v * zy[i])) / (p.x.length - 1);
    },
  },
  'regression-ci': {
    title: '95 % interval for a slope (upper end)',
    make(r) {
      const b = pick(r, 0.5, 3, 0.05), se = pick(r, 0.2, 0.9, 0.05), nn = 20, t = 2.101, answer = b + t * se;
      return {
        q: `<p>Over ${nn} weeks, a regression of sales on ad spend gives slope <b>${n(b)}</b> (dollars of sales per dollar of ads) with SE <b>${n(se)}</b>. With ${nn - 2} degrees of freedom the 95 % t value is ${t}. What is the <b>upper end</b> of the slope's 95 % CI?</p>`,
        answer, unit: '', tol: 0.002,
        hint: 'CI = b ± t × SE.',
        solution: steps(`Margin = ${t} × ${n(se)} = ${n(t * se)}.`, `CI: ${n(b - t * se)} to <b>${n(answer)}</b>.`, b - t * se > 0 ? 'Above 0: a clear positive association (not proof of cause).' : 'Includes 0: the association is not clear.'),
        b, se,
      };
    },
    verify: (p) => p.b + 2.1009 * p.se,
  },
  'simpson-mix': {
    title: 'average order value after a mix shift',
    make(r) {
      const ret = pick(r, 60, 90), nw = pick(r, 35, 55), share = pick(r, 20, 70, 5) / 100, answer = share * ret + (1 - share) * nw;
      return {
        q: `<p>This quarter returning customers average <b>$${ret}</b> per order and new customers <b>$${nw}</b>. Returning customers place <b>${n(share * 100)} %</b> of orders. What is the overall average order value?</p>`,
        answer, unit: '$', tol: 0.002,
        hint: 'Overall = share of returning × their AOV + share of new × their AOV.',
        solution: steps(`${n(share)} × ${ret} = ${n(share * ret)}.`, `${n(1 - share)} × ${nw} = ${n((1 - share) * nw)}.`, `Overall = <b>$${n(answer)}</b>. Shift the mix and this moves even if neither group changes.`),
        ret, nw, share,
      };
    },
    verify: (p) => p.nw + p.share * (p.ret - p.nw),
  },
  'moving-average': {
    title: 'a 7-day moving average',
    make(r) {
      const base = pick(r, 150, 400, 10), pat = [-20, -10, 0, 5, 25, 45, -45], v = pat.map((d) => base + d + pick(r, -8, 8));
      const answer = mean(v);
      return {
        q: `<p>Daily orders, Monday to Sunday: <b>${v.join(', ')}</b>. What is the 7-day moving average at Sunday?</p>`,
        answer, unit: 'orders', tol: 0.002,
        hint: 'Add the seven days and divide by 7. Each weekday appears once, so the weekly pattern cancels.',
        solution: steps(`Sum = ${sum(v)}.`, `÷ 7 = <b>${n(answer, 4)}</b> orders a day.`),
        v,
      };
    },
    verify: (p) => p.v.reduce((a, x) => a + x / 7, 0),
  },
  'smoothing-step': {
    title: 'one step of exponential smoothing',
    make(r) {
      const prev = pick(r, 800, 1500, 10), actual = prev + pick(r, -150, 150, 10), a = pick(r, 0.1, 0.6, 0.1), answer = a * actual + (1 - a) * prev;
      return {
        q: `<p>Last week's forecast was <b>${fmt(prev)}</b> orders; the actual was <b>${fmt(actual)}</b>. With α = <b>${n(a)}</b>, what is the forecast for next week?</p>`,
        answer, unit: 'orders', tol: 0.001,
        hint: 'New forecast = α × actual + (1 − α) × old forecast.',
        solution: steps(`${n(a)} × ${fmt(actual)} = ${n(a * actual, 5)}.`, `${n(1 - a)} × ${fmt(prev)} = ${n((1 - a) * prev, 5)}.`, `Forecast = <b>${n(answer, 5)}</b>: the old forecast moved ${n(a * 100)} % of the way to the actual.`),
        prev, actual, a,
      };
    },
    verify: (p) => p.prev + p.a * (p.actual - p.prev),
  },
  'control-limits': {
    title: 'the upper control limit',
    make(r) {
      const v = Array.from({ length: 8 }, () => pick(r, 30, 60) / 10), mr = v.slice(1).map((x, i) => Math.abs(x - v[i])), mrbar = mean(mr) || 0.1, c = mean(v), answer = c + 2.66 * mrbar;
      return {
        q: `<p>Eight calm days of late-shipping share (%): <b>${v.map((x) => n(x)).join(', ')}</b>. Using centre + 2.66 × average moving range, what is the <b>upper control limit</b>?</p>`,
        answer, unit: '%', tol: 0.002,
        hint: 'Centre = mean of the 8 days. Moving ranges = the 7 gaps between neighbouring days (ignore the sign). Average them, × 2.66, add to the centre.',
        solution: steps(`Centre = ${n(c, 4)} %.`, `Moving ranges: ${mr.map((x) => n(x)).join(', ')}; average ${n(mrbar, 4)}.`, `UCL = ${n(c, 4)} + 2.66 × ${n(mrbar, 4)} = <b>${n(answer, 4)} %</b>.`),
        v,
      };
    },
    verify: (p) => { let s = 0; for (let i = 1; i < p.v.length; i++) s += Math.abs(p.v[i] - p.v[i - 1]); const m = s / (p.v.length - 1) || 0.1; return mean(p.v) + 2.66 * m; },
  },
  // ---------- Module 9 ----------
  'readout-orders': {
    title: 'extra orders a month from the lift',
    make(r) {
      const lift = pick(r, 0.2, 1.5, 0.05), visitors = pick(r, 50, 500, 10) * 1000, answer = (lift / 100) * visitors;
      return {
        q: `<p>The test shows a conversion lift of <b>${n(lift)} points</b>. The checkout gets <b>${fmt(visitors)}</b> visitors a month. How many extra orders a month is that, if the lift holds?</p>`,
        answer, unit: 'orders', tol: 0.002,
        hint: 'Points are per 100 visitors: extra orders = lift ÷ 100 × visitors.',
        solution: steps(`${n(lift)} ÷ 100 = ${n(lift / 100, 4)} extra orders per visitor.`, `× ${fmt(visitors)} = <b>${fmt(Math.round(answer))}</b> extra orders a month. Give the CI too: the same sum on each end of the interval.`),
        lift, visitors,
      };
    },
    verify: (p) => p.visitors * p.lift * 0.01,
  },
  'interview-margin': {
    title: 'a poll\'s margin of error, interview style',
    make(r) {
      const nn = pick(r, 400, 2500, 100), answer = 100 * 1.96 * Math.sqrt(0.25 / nn);
      return {
        q: `<p>An interviewer asks: "A poll of <b>${fmt(nn)}</b> people says 50 %. Roughly what is the 95 % margin of error, in points?"</p>`,
        answer, unit: 'points', tol: 0.005,
        hint: 'At 50 %, SE = √(0.5 × 0.5 ÷ n). Margin = 1.96 × SE.',
        solution: steps(`SE = √(0.25 ÷ ${fmt(nn)}) = ${n(Math.sqrt(0.25 / nn), 4)}.`, `Margin = 1.96 × SE = <b>±${n(answer)} points</b>. A quick check: 1 ÷ √n = ${n(100 / Math.sqrt(nn))} points.`),
        nn,
      };
    },
    verify: (p) => 98 / Math.sqrt(p.nn),
  },
  'which-test-df': {
    title: 'degrees of freedom for a chi-square table',
    make(r) {
      const rows = pick(r, 2, 6), cols = pick(r, 2, 6), answer = (rows - 1) * (cols - 1);
      return {
        q: `<p>You test whether <b>${rows}</b> customer segments differ in their choice among <b>${cols}</b> delivery options (a ${rows} × ${cols} table of counts). Which test, and how many degrees of freedom does it have?</p>`,
        answer, unit: 'df', tol: 0, abs: 0.01,
        hint: 'Categories against categories: the chi-square test of independence, with (rows − 1) × (columns − 1) df.',
        solution: steps('Both variables are categories: chi-square test of independence.', `df = (${rows} − 1) × (${cols} − 1) = <b>${answer}</b>.`),
        rows, cols,
      };
    },
    verify: (p) => p.rows * p.cols - p.rows - p.cols + 1,
  },
};
