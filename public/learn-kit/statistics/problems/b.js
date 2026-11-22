// Live problems for Statistics for analysts, part b: Modules 4-6 (see ../problems.js).
import { pick, n, steps, table } from './util.js';
import { phi } from './a.js';

const sum = (a) => a.reduce((s, v) => s + v, 0);
const mean = (a) => sum(a) / a.length;
const sd = (a) => { const m = mean(a); return Math.sqrt(sum(a.map((v) => (v - m) ** 2)) / (a.length - 1)); };
/** 97.5th percentile of t for these degrees of freedom (standard tables). */
export const T975 = { 4: 2.776, 5: 2.571, 7: 2.365, 9: 2.262, 11: 2.201, 14: 2.145, 19: 2.093, 24: 2.064, 29: 2.045 };
/** t density, for checking the table by numerical integration. */
const tdens = (x, v) => { const g = (z) => { // log-gamma (Lanczos)
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = z, t = z + 5.5; t -= (z + 0.5) * Math.log(t); let s = 1.000000000190015; for (const k of c) s += k / ++y; return -t + Math.log(2.5066282746310005 * s / z); };
  return Math.exp(g((v + 1) / 2) - g(v / 2)) / Math.sqrt(v * Math.PI) * (1 + x * x / v) ** (-(v + 1) / 2); };
export const tUpper = (t, v) => { let s = 0, N = 40000, h = (t + 400) / N; for (let i = 0; i < N; i++) s += tdens(-400 + (i + 0.5) * h, v) * h; return 1 - s; };

export default {
  // ---------- Module 4 ----------
  'sampling-wobble': {
    title: 'typical sampling error of a survey share',
    make(r) {
      const nn = pick(r, 200, 2000, 100), p = pick(r, 0.2, 0.8, 0.01), answer = 100 * Math.sqrt((p * (1 - p)) / nn);
      return {
        q: `<p>A random sample of <b>${nn}</b> customers finds <b>${n(p * 100)} %</b> want same-day delivery. What is the typical sampling error (the standard error) in percentage points?</p>`,
        answer, unit: 'points', tol: 0.005,
        hint: 'SE = √(p × (1 − p) ÷ n), then × 100 to turn it into points.',
        solution: steps(`p(1 − p) = ${n(p)} × ${n(1 - p)} = ${n(p * (1 - p), 4)}.`, `÷ ${nn} = ${n((p * (1 - p)) / nn, 4)}; square root = ${n(answer / 100, 4)}.`, `About <b>±${n(answer)} points</b>; roughly 95 % of samples land within twice that.`),
        nn, p,
      };
    },
    verify: (q) => Math.sqrt(q.p * (1 - q.p) * 10000 / q.nn),
  },
  'bias-weight': {
    title: 'how far off is the survey average?',
    make(r) {
      const sh = [pick(r, 40, 60), pick(r, 15, 25)]; sh.push(100 - sh[0] - sh[1]); // happy, neutral, unhappy %
      const sc = [4.5, 3, 1.5], rr = [pick(r, 25, 40), pick(r, 15, 25), pick(r, 5, 12)];
      const truth = sum(sh.map((s, i) => s * sc[i])) / 100, rep = sh.map((s, i) => s * rr[i]), surv = sum(rep.map((x, i) => x * sc[i])) / sum(rep);
      const answer = surv - truth;
      return {
        q: `<p>Guests are ${sh[0]} % happy (score 4.5), ${sh[1]} % neutral (3) and ${sh[2]} % unhappy (1.5). They answer a survey at rates of ${rr[0]} %, ${rr[1]} % and ${rr[2]} %. By how much does the survey average <b>overstate</b> the true average score?</p>`,
        answer, unit: 'points', tol: 0.005,
        hint: 'True average: weight scores by guest shares. Survey average: weight them by replies (share × reply rate) instead.',
        solution: steps(`True: (${sh[0]} × 4.5 + ${sh[1]} × 3 + ${sh[2]} × 1.5) ÷ 100 = ${n(truth)}.`, `Replies per 100 guests: ${rep.map((x) => n(x / 100)).join(', ')}.`,
          `Survey: ${n(surv)}. Overstated by <b>${n(answer)}</b>, and asking more guests would not fix it.`),
        sh, rr, sc,
      };
    },
    verify: (p) => { const w = p.sh.map((s, i) => s * p.rr[i]); return w.reduce((a, x, i) => a + x * p.sc[i], 0) / sum(w) - p.sh.reduce((a, s, i) => a + s * p.sc[i], 0) / 100; },
  },
  'clt-daily': {
    title: 'how much does a daily average wobble?',
    make(r) {
      const s = pick(r, 3, 15), nn = [25, 100, 144, 225, 400, 625, 900][pick(r, 0, 6)], answer = s / Math.sqrt(nn);
      return {
        q: `<p>Single transactions at a café have an SD of <b>$${s}</b>. A day has <b>${nn}</b> transactions. What is the SD of the day's <b>average</b> transaction?</p>`,
        answer, unit: '$', tol: 0.002,
        hint: 'SD of an average = SD of single values ÷ √n.',
        solution: steps(`√${nn} = ${Math.sqrt(nn)}.`, `${s} ÷ ${Math.sqrt(nn)} = <b>$${n(answer)}</b>. Averages are √${nn} = ${Math.sqrt(nn)} times steadier than single sales.`),
        s, nn,
      };
    },
    verify: (p) => Math.sqrt((p.s * p.s) / p.nn),
  },
  'se-difference': {
    title: 'standard error of a difference in conversion',
    make(r) {
      const nA = pick(r, 2000, 10000, 500), nB = nA, pA = pick(r, 2, 8, 0.1) / 100, pB = pA + pick(r, 0, 1.5, 0.1) / 100;
      const sA = Math.sqrt((pA * (1 - pA)) / nA), sB = Math.sqrt((pB * (1 - pB)) / nB), answer = 100 * Math.hypot(sA, sB);
      return {
        q: `<p>Version A converted <b>${n(pA * 100)} %</b> of ${nA.toLocaleString('en-CA')} visitors; version B <b>${n(pB * 100)} %</b> of ${nB.toLocaleString('en-CA')}. What is the standard error of the difference B − A, in percentage points?</p>`,
        answer, unit: 'points', tol: 0.005,
        hint: 'Find each SE with √(p(1 − p)/n), then combine: √(SE_A² + SE_B²).',
        solution: steps(`SE_A = ${n(sA * 100)} points; SE_B = ${n(sB * 100)} points.`, `SE of difference = √(${n(sA * 100)}² + ${n(sB * 100)}²) = <b>${n(answer)}</b> points.`,
          `The difference, ${n((pB - pA) * 100)} points, is ${n((pB - pA) / Math.hypot(sA, sB))} SEs.`),
        pA, pB, nA, nB,
      };
    },
    verify: (p) => 100 * Math.sqrt(p.pA * (1 - p.pA) / p.nA + p.pB * (1 - p.pB) / p.nB),
  },
  'bootstrap-count': {
    title: 'how often is a value left out of a resample?',
    make(r) {
      const nn = pick(r, 5, 40), answer = (1 - 1 / nn) ** nn;
      return {
        q: `<p>A bootstrap resample draws <b>${nn}</b> values from your ${nn}, with replacement. What is the chance that one particular order (say the biggest) does <b>not</b> appear in a resample at all? Give a decimal.</p>`,
        answer, unit: '', tol: 0.002,
        hint: 'Each draw misses it with chance (1 − 1/n). There are n independent draws.',
        solution: steps(`One draw misses it: 1 − 1/${nn} = ${n(1 - 1 / nn, 4)}.`, `All ${nn} draws miss it: ${n(1 - 1 / nn, 4)}^${nn} = <b>${n(answer)}</b>.`,
          'For large n this tends to e⁻¹ ≈ 0.368: about a third of resamples leave out any given value, which is why big orders make bootstrap means jump.'),
        nn,
      };
    },
    verify: (p) => Math.exp(p.nn * Math.log1p(-1 / p.nn)),
  },
  // ---------- Module 5 ----------
  'ci-mean': {
    title: '95 % interval for a mean (upper end)',
    make(r) {
      const df = [4, 5, 7, 9, 11, 14, 19, 24, 29][pick(r, 0, 8)], nn = df + 1, m = pick(r, 1, 6, 0.1), s = pick(r, 1, 4, 0.1);
      const se = s / Math.sqrt(nn), t = T975[df], answer = m + t * se;
      return {
        q: `<p>${nn} stores tried a new display. Mean weekly sales lift: <b>${n(m)} %</b>, sample SD <b>${n(s)} %</b>. The t value for ${df} degrees of freedom at 95 % is ${t}. What is the <b>upper end</b> of the 95 % confidence interval?</p>`,
        answer, unit: '%', tol: 0.003,
        hint: 'SE = s ÷ √n; margin = t × SE; upper end = mean + margin.',
        solution: steps(`SE = ${n(s)} ÷ √${nn} = ${n(se)}.`, `Margin = ${t} × ${n(se)} = ${n(t * se)}.`, `Interval: ${n(m - t * se)} % to <b>${n(answer)} %</b>.`),
        m, s, nn, df,
      };
    },
    verify: (p) => { // find t by bisection on the t distribution itself, then rebuild the interval
      let lo = 1.5, hi = 4; for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; tUpper(mid, p.df) > 0.025 ? (lo = mid) : (hi = mid); }
      return p.m + ((lo + hi) / 2) * p.s / Math.sqrt(p.nn);
    },
  },
  'ci-proportion': {
    title: 'margin of error of a survey share',
    make(r) {
      const nn = pick(r, 200, 1500, 50), x = Math.round(nn * pick(r, 0.2, 0.8, 0.01)), p = x / nn, answer = 100 * 1.96 * Math.sqrt((p * (1 - p)) / nn);
      return {
        q: `<p><b>${x}</b> of <b>${nn}</b> customers said they like the new menu. What is the 95 % margin of error (Wald), in percentage points?</p>`,
        answer, unit: 'points', tol: 0.005,
        hint: 'p̂ = x ÷ n; SE = √(p̂(1 − p̂)/n); margin = 1.96 × SE.',
        solution: steps(`p̂ = ${x} ÷ ${nn} = ${n(p, 4)}.`, `SE = √(${n(p, 4)} × ${n(1 - p, 4)} ÷ ${nn}) = ${n(answer / 196, 4)}.`, `Margin = 1.96 × SE = <b>±${n(answer)} points</b>: ${n(p * 100 - answer)} % to ${n(p * 100 + answer)} %.`),
        x, nn,
      };
    },
    verify: (q) => { const p = q.x / q.nn; return 196 * Math.sqrt(p * (1 - p) / q.nn); },
  },
  'ci-difference': {
    title: 'interval for the difference between two regions (lower end)',
    make(r) {
      const a = pick(r, 35, 50, 0.1), d = pick(r, 0.5, 5, 0.1), b = a + d, ma = pick(r, 1, 3, 0.1), mb = pick(r, 1, 3, 0.1);
      const se = Math.hypot(ma / 1.96, mb / 1.96), answer = d - 1.96 * se;
      return {
        q: `<p>North's average basket is $${n(a, 4)} (95 % CI ± $${n(ma)}); South's is $${n(b, 4)} (± $${n(mb)}). Build the 95 % interval for South − North. What is its <b>lower end</b>? (Negative means the interval includes 0.)</p>`,
        answer, unit: '$', tol: 0.005, abs: 0.01,
        hint: 'Each SE = margin ÷ 1.96. SE of the difference = √(SE₁² + SE₂²). Lower end = difference − 1.96 × SE.',
        solution: steps(`SEs: ${n(ma / 1.96)} and ${n(mb / 1.96)}; SE of difference = ${n(se)}.`, `Difference = ${n(d)}.`,
          `Lower end = ${n(d)} − 1.96 × ${n(se)} = <b>${n(answer)}</b>${answer > 0 ? ': above 0, so South is clearly higher.' : ': the interval includes 0.'}`),
        d, ma, mb,
      };
    },
    verify: (p) => p.d - Math.sqrt(p.ma ** 2 + p.mb ** 2),
  },
  'sample-size-mean': {
    title: 'how many people to survey?',
    make(r) {
      const s = pick(r, 20, 120, 5), E = pick(r, 2, 15), answer = Math.ceil(((1.96 * s) / E) ** 2);
      return {
        q: `<p>You want average weekly spend to within <b>±$${E}</b> at 95 % confidence. Spend varies with SD about <b>$${s}</b>. How many completed responses do you need? (Round up.)</p>`,
        answer, unit: 'responses', tol: 0, abs: 1.01,
        hint: 'n = (1.96 × σ ÷ margin)², rounded up to a whole person.',
        solution: steps(`1.96 × ${s} ÷ ${E} = ${n((1.96 * s) / E, 5)}.`, `Squared: ${n(((1.96 * s) / E) ** 2, 6)}; round up: <b>${answer}</b>.`),
        s, E,
      };
    },
    verify: (p) => { let k = 1; while (1.96 * p.s / Math.sqrt(k) > p.E) k++; return k; },
  },
};
