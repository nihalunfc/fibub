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

  // ---------- Module 6 ----------
  'test-t-stat': {
    title: 'the test statistic for a supplier\'s claim',
    make(r) {
      const claim = pick(r, 250, 1000, 50), nn = [16, 25, 36, 49, 64, 100][pick(r, 0, 5)], s = pick(r, 3, 12), d = pick(r, -4, 4, 0.1) || -2;
      const xbar = +(claim + d).toFixed(1), se = s / Math.sqrt(nn), answer = (xbar - claim) / se;
      return {
        q: `<p>A supplier claims packs weigh <b>${claim} g</b> on average. You weigh ${nn} packs: mean <b>${xbar} g</b>, SD <b>${s} g</b>. What is the test statistic t = (x̄ − claim) ÷ SE?</p>`,
        answer, unit: '', tol: 0.003, abs: 0.005,
        hint: 'SE = SD ÷ √n. Then the gap between your mean and the claim, divided by SE.',
        solution: steps(`SE = ${s} ÷ √${nn} = ${n(se)}.`, `t = (${xbar} − ${claim}) ÷ ${n(se)} = <b>${n(answer)}</b>.`,
          Math.abs(answer) > 2 ? 'More than about 2 SEs from the claim: evidence against it at the 5 % level.' : 'Within about 2 SEs: the data are compatible with the claim.'),
        claim, xbar, s, nn,
      };
    },
    verify: (p) => (p.xbar - p.claim) * Math.sqrt(p.nn) / p.s,
  },
  'p-value-two-sided': {
    title: 'two-sided p-value from a z-score',
    make(r) {
      const z = pick(r, 0.5, 3.5, 0.05), answer = 2 * (1 - phi(z));
      return {
        q: `<p>A conversion test gives z = <b>${n(z)}</b>. What is the two-sided p-value? Give a decimal.</p>`,
        answer, unit: '', tol: 0.01, abs: 0.0002,
        hint: 'Find the area beyond z in one tail of the standard normal, then double it for "either direction".',
        solution: steps(`Area above ${n(z)}: ${n(1 - phi(z), 4)}.`, `Two-sided: × 2 = <b>${n(answer)}</b>.`, answer < 0.05 ? 'Below 0.05.' : 'Not below 0.05.'),
        z,
      };
    },
    verify: (p) => { let s = 0, N = 20000, h = 12 / N; for (let i = 0; i < N; i++) { const x = p.z + (i + 0.5) * h; s += Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI) * h; } return 2 * s; },
  },
  'welch-t': {
    title: 'Welch t for two baskets',
    make(r) {
      const m1 = pick(r, 30, 50, 0.1), m2 = m1 + pick(r, 0.5, 6, 0.1), s1 = pick(r, 15, 30), s2 = pick(r, 15, 30), n1 = pick(r, 100, 600, 50), n2 = pick(r, 100, 600, 50);
      const se = Math.sqrt(s1 * s1 / n1 + s2 * s2 / n2), answer = (m2 - m1) / se;
      return {
        q: `<p>Mobile baskets: mean $${n(m1, 4)}, SD $${s1}, n = ${n1}. Desktop: mean $${n(m2, 4)}, SD $${s2}, n = ${n2}. What is Welch's t for desktop − mobile?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'SE = √(s₁²/n₁ + s₂²/n₂). t = (difference in means) ÷ SE.',
        solution: steps(`${s1}²/${n1} = ${n(s1 * s1 / n1)}; ${s2}²/${n2} = ${n(s2 * s2 / n2)}.`, `SE = √(${n(s1 * s1 / n1)} + ${n(s2 * s2 / n2)}) = ${n(se)}.`, `t = ${n(m2 - m1)} ÷ ${n(se)} = <b>${n(answer)}</b>.`),
        m1, m2, s1, s2, n1, n2,
      };
    },
    verify: (p) => (p.m2 - p.m1) / Math.hypot(p.s1 / Math.sqrt(p.n1), p.s2 / Math.sqrt(p.n2)),
  },
  'power-two-means': {
    title: 'power of a planned test',
    make(r) {
      const s = pick(r, 20, 50, 5), d = pick(r, 2, 8), nn = pick(r, 200, 2000, 100);
      const se = s * Math.sqrt(2 / nn), answer = phi(d / se - 1.96);
      return {
        q: `<p>Orders average about $60 with SD <b>$${s}</b>. A change is worth it if it lifts the average by <b>$${d}</b>. You plan <b>${nn}</b> orders per group and a two-sided test at 5 %. If the lift is exactly $${d}, what is the power? Give a decimal.</p>`,
        answer, unit: '', tol: 0.01, abs: 0.002,
        hint: 'SE of the difference = SD × √(2/n). Power ≈ Φ(lift ÷ SE − 1.96).',
        solution: steps(`SE = ${s} × √(2/${nn}) = ${n(se)}.`, `Lift in SEs: ${d} ÷ ${n(se)} = ${n(d / se)}.`, `Power ≈ Φ(${n(d / se)} − 1.96) = Φ(${n(d / se - 1.96)}) = <b>${n(answer)}</b>.`,
          answer < 0.8 ? 'Below 80 %: the test would often miss a real lift of this size.' : 'At least 80 %: a sensible plan.'),
        s, d, nn,
      };
    },
    verify: (p) => { // simulate the decision rule with the exact normal distribution of the observed difference
      const se = p.s * Math.sqrt(2 / p.nn); let s = 0, N = 20000, lo = 1.96 * se, h = (p.d + 12 * se - lo) / N;
      for (let i = 0; i < N; i++) { const x = lo + (i + 0.5) * h; s += Math.exp(-(((x - p.d) / se) ** 2) / 2) / (se * Math.sqrt(2 * Math.PI)) * h; } return s;
    },
  },
  'chi-square-2x2': {
    title: 'chi-square for a 2 × 2 table',
    make(r) {
      const a = pick(r, 40, 150, 5), b = pick(r, 20, 100, 5), c = pick(r, 40, 150, 5), d = pick(r, 20, 100, 5);
      const O = [[a, b], [c, d]], R = [a + b, c + d], C = [a + c, b + d], N = a + b + c + d;
      let x = 0; const parts = [];
      for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const E = (R[i] * C[j]) / N; const t = (O[i][j] - E) ** 2 / E; x += t; parts.push(n(t, 3)); }
      return {
        q: `<p>Renewals by plan:</p>${table(['', 'Renewed', 'Left'], [['Basic', a, b], ['Pro', c, d]])}<p>What is the chi-square statistic for "plan and renewal are unrelated"?</p>`,
        answer: x, unit: '', tol: 0.005, abs: 0.002,
        hint: 'Expected = row total × column total ÷ grand total for each cell; then add (O − E)² ÷ E over the four cells.',
        solution: steps(`Row totals ${R.join(', ')}; column totals ${C.join(', ')}; grand total ${N}.`, `Cell terms (O − E)²/E: ${parts.join(', ')}.`, `χ² = <b>${n(x)}</b> with 1 df${x > 3.84 ? ': above 3.84, so p < 0.05.' : ': below 3.84, so p > 0.05.'}`),
        a, b, c, d,
      };
    },
    verify: (p) => { const N = p.a + p.b + p.c + p.d; return N * (p.a * p.d - p.b * p.c) ** 2 / ((p.a + p.b) * (p.c + p.d) * (p.a + p.c) * (p.b + p.d)); },
  },
  'anova-f': {
    title: 'the F ratio for three groups',
    make(r) {
      const g = [0, 1, 2].map(() => { const c = pick(r, 4, 14); return Array.from({ length: 4 }, () => c + pick(r, -3, 3)); });
      const all = g.flat(), gm = mean(all), ms = g.map(mean);
      const ssb = sum(ms.map((m) => 4 * (m - gm) ** 2)), ssw = sum(g.map((x, i) => sum(x.map((v) => (v - ms[i]) ** 2)))) || 1;
      if (ssw === 1 && !sum(g.map((x, i) => sum(x.map((v) => (v - ms[i]) ** 2))))) g[0][0] += 1;
      const ms2 = g.map(mean), gm2 = mean(g.flat()), B = sum(ms2.map((m) => 4 * (m - gm2) ** 2)), W = sum(g.map((x, i) => sum(x.map((v) => (v - ms2[i]) ** 2))));
      const answer = (B / 2) / (W / 9);
      return {
        q: `<p>Weekly units under three shelf placements, 4 stores each:</p>${table(['Placement', 'Stores'], [['A', g[0].join(', ')], ['B', g[1].join(', ')], ['C', g[2].join(', ')]])}<p>What is the ANOVA F ratio?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'SS between = Σ 4 × (group mean − grand mean)², df 2. SS within = squared gaps from each group\'s own mean, df 9. F = (SSB/2) ÷ (SSW/9).',
        solution: steps(`Group means ${ms2.map((m) => n(m)).join(', ')}; grand mean ${n(gm2)}.`, `SS between = ${n(B)}; MS = ${n(B / 2)}.`, `SS within = ${n(W)}; MS = ${n(W / 9)}.`, `F = <b>${n(answer)}</b>${answer > 4.26 ? ' (above 4.26, the 5 % cut-off for 2 and 9 df).' : ' (below 4.26: not clear at 5 %).'}`),
        g,
      };
    },
    verify: (p) => { // total SS minus within SS gives between SS
      const all = p.g.flat(), gm = mean(all), tot = sum(all.map((v) => (v - gm) ** 2)), W = sum(p.g.map((x) => { const m = mean(x); return sum(x.map((v) => (v - m) ** 2)); }));
      return ((tot - W) / 2) / (W / 9);
    },
  },
  'mann-whitney-u': {
    title: 'how often does B beat A?',
    make(r) {
      const used = new Set(), draw = () => { let v = pick(r, 1, 60); while (used.has(v)) v++; used.add(v); return v; }; // distinct values, no ties
      const A = Array.from({ length: pick(r, 3, 5) }, draw), B = Array.from({ length: pick(r, 3, 5) }, draw);
      let u = 0; for (const b of B) for (const a of A) if (b > a) u++;
      return {
        q: `<p>Minutes on a help page. Group A: <b>${A.join(', ')}</b>. Group B: <b>${B.join(', ')}</b>. Of all A-B pairs, in how many is the B value larger? (That count is Mann-Whitney U for B.)</p>`,
        answer: u, unit: 'pairs', tol: 0, abs: 0.01,
        hint: `There are ${A.length} × ${B.length} = ${A.length * B.length} pairs. For each B value, count the A values below it.`,
        solution: steps(...B.map((b) => `${b} beats ${A.filter((a) => b > a).length} of the A values.`), `U = <b>${u}</b> of ${A.length * B.length} pairs: a random B beats a random A ${n((100 * u) / (A.length * B.length))} % of the time.`),
        A, B,
      };
    },
    verify: (p) => { // rank-sum route: U_B = R_B − n_B(n_B + 1)/2
      const all = [...p.A.map((v) => [v, 0]), ...p.B.map((v) => [v, 1])].sort((x, y) => x[0] - y[0]);
      const RB = all.reduce((s, x, i) => s + (x[1] ? i + 1 : 0), 0); return RB - (p.B.length * (p.B.length + 1)) / 2;
    },
  },
  'family-wise': {
    title: 'chance of at least one false win',
    make(r) {
      const k = pick(r, 2, 30), a = [0.05, 0.1, 0.01][pick(r, 0, 2)], answer = 1 - (1 - a) ** k;
      return {
        q: `<p>You test <b>${k}</b> independent segments, each at α = <b>${a}</b>, and in truth none of them has any effect. What is the chance that at least one comes out "significant"? Give a decimal.</p>`,
        answer, unit: '', tol: 0.003,
        hint: 'Chance a single test stays quiet: 1 − α. All of them stay quiet: (1 − α)^k. At least one false win: 1 minus that.',
        solution: steps(`All ${k} quiet: (1 − ${a})^${k} = ${n((1 - a) ** k, 4)}.`, `At least one false win: 1 − ${n((1 - a) ** k, 4)} = <b>${n(answer)}</b>.`, `Bonferroni would test each at ${a} ÷ ${k} = ${n(a / k, 3)}.`),
        k, a,
      };
    },
    verify: (p) => { let q = 0; for (let j = 1; j <= p.k; j++) { let c = 1; for (let i = 1; i <= j; i++) c = c * (p.k - j + i) / i; q += c * p.a ** j * (1 - p.a) ** (p.k - j); } return q; },
  },
  'cohens-d': {
    title: 'effect size in standard deviations',
    make(r) {
      const s = pick(r, 10, 60, 5), d = pick(r, 0.2, 8, 0.05), answer = d / s;
      return {
        q: `<p>A new search lifts average weekly spend by <b>$${n(d)}</b>. Spend per user has an SD of <b>$${s}</b>. What is Cohen's d?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'd = difference ÷ SD.',
        solution: steps(`d = ${n(d)} ÷ ${s} = <b>${n(answer)}</b>.`, answer < 0.2 ? 'Below 0.2: a small effect per person, which can still be valuable across many users.' : answer < 0.5 ? 'Around small to medium.' : 'Medium or larger.'),
        s, d,
      };
    },
    verify: (p) => p.d * (1 / p.s),
  },
};
