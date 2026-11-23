// Class 11 Maths, Statistics: live problems (original fibub questions). Ids start with c11m-stat-.
import { pick, choose, n, steps } from './_util.js';

const SETS = [[4, 7, 9, 12, 13, 17], [3, 5, 8, 8, 11, 15], [10, 12, 15, 18, 20, 25], [2, 6, 7, 9, 14, 18], [5, 9, 9, 13, 16, 20], [6, 8, 11, 12, 15, 24], [1, 4, 6, 10, 12, 17], [7, 7, 10, 14, 18, 22]];
const MID = [15, 25, 35, 45, 55], FREQS = [[4, 6, 10, 8, 2], [3, 7, 9, 6, 5], [2, 5, 12, 7, 4], [6, 8, 8, 5, 3], [1, 4, 9, 10, 6]];
const mean = (d) => d.reduce((a, b) => a + b, 0) / d.length;
export default {
  'c11m-stat-md': {
    title: 'mean deviation about the mean',
    make(r) {
      const D = choose(r, SETS), m = mean(D), md = D.reduce((a, b) => a + Math.abs(b - m), 0) / D.length;
      return { D, q: `<p>Find the mean deviation about the mean of ${D.join(', ')} (a decimal to 3 places).</p>`, answer: md, unit: '', tol: 0.01,
        hint: 'Find the mean, then average the absolute deviations |x − mean|.',
        solution: steps(`Mean = ${D.reduce((a, b) => a + b, 0)}/${D.length} = ${n(m, 5)}.`, `|x − mean|: ${D.map((x) => n(Math.abs(x - m), 4)).join(', ')}.`, `Mean deviation = ${n(md * D.length, 5)}/${D.length} = <b>${n(md, 4)}</b>.`) };
    },
    // the signed deviations add to 0, so the mean deviation is twice the sum of the positive ones, divided by n
    verify: (p) => { const m = mean(p.D); return (2 * p.D.filter((x) => x > m).reduce((a, x) => a + (x - m), 0)) / p.D.length; },
  },
  'c11m-stat-var': {
    title: 'variance of ungrouped data',
    make(r) {
      const D = choose(r, SETS), m = mean(D), v = D.reduce((a, x) => a + (x - m) ** 2, 0) / D.length;
      return { D, q: `<p>Find the variance (population, dividing by n) of ${D.join(', ')} (a decimal to 3 places).</p>`, answer: v, unit: '', tol: 0.01,
        hint: 'σ² = Σ(x − mean)²/n. Or use the shortcut Σx²/n − mean².',
        solution: steps(`Mean = ${n(m, 5)}.`, `Squared deviations: ${D.map((x) => n((x - m) ** 2, 4)).join(', ')}.`, `σ² = ${n(v * D.length, 5)}/${D.length} = <b>${n(v, 4)}</b>.`) };
    },
    // shortcut: mean of squares minus square of mean
    verify: (p) => p.D.reduce((a, x) => a + x * x, 0) / p.D.length - mean(p.D) ** 2,
  },
  'c11m-stat-sd': {
    title: 'standard deviation',
    make(r) {
      const D = choose(r, SETS), m = mean(D), v = D.reduce((a, x) => a + (x - m) ** 2, 0) / D.length;
      return { D, q: `<p>Find the standard deviation of ${D.join(', ')} (a decimal to 2 places).</p>`, answer: Math.sqrt(v), unit: '', tol: 0.01,
        hint: 'Variance first, then its square root.',
        solution: steps(`Mean = ${n(m, 5)}; variance = ${n(v, 5)}.`, `σ = √${n(v, 5)} = <b>${n(Math.sqrt(v), 4)}</b>.`) };
    },
    // variance equals half the average of the squared gaps between every pair of values (all ordered pairs)
    verify: (p) => { let s = 0; for (const a of p.D) for (const b of p.D) s += (a - b) ** 2; return Math.sqrt(s / (2 * p.D.length ** 2)); },
  },
  'c11m-stat-grouped': {
    title: 'mean of grouped data',
    make(r) {
      const F = choose(r, FREQS), N = F.reduce((a, b) => a + b, 0), m = F.reduce((a, f, i) => a + f * MID[i], 0) / N;
      return { F, q: `<p>Marks 10–20, 20–30, 30–40, 40–50, 50–60 had frequencies ${F.join(', ')}. Find the mean mark using class marks (2 decimal places).</p>`, answer: m, unit: '', tol: 0.005,
        hint: 'Class marks are 15, 25, 35, 45, 55. Mean = Σfx / Σf.',
        solution: steps(`n = ${N}. Σfx = ${F.map((f, i) => `${f}×${MID[i]}`).join(' + ')} = ${F.reduce((a, f, i) => a + f * MID[i], 0)}.`, `Mean = ${F.reduce((a, f, i) => a + f * MID[i], 0)}/${N} = <b>${n(m, 4)}</b>.`) };
    },
    // assumed mean A = 35, step h = 10: mean = A + h Σ f y / n
    verify: (p) => { const N = p.F.reduce((a, b) => a + b, 0); return 35 + (10 * p.F.reduce((a, f, i) => a + f * (i - 2), 0)) / N; },
  },
  'c11m-stat-shift': {
    title: 'standard deviation after changing every value',
    make(r) {
      const D = choose(r, SETS), m = pick(r, 2, 5), k = pick(r, 1, 20), mu = mean(D), sd = Math.sqrt(D.reduce((a, x) => a + (x - mu) ** 2, 0) / D.length);
      return { D, m, k, q: `<p>The values ${D.join(', ')} are each multiplied by ${m} and then ${k} is added to each. Find the standard deviation of the new values (2 decimal places).</p>`, answer: m * sd, unit: '', tol: 0.01,
        hint: 'Adding k changes no distances between values; multiplying by m multiplies them by m. So new SD = m × old SD.',
        solution: steps(`Old mean ${n(mu, 5)}; old SD = ${n(sd, 5)}.`, `Adding ${k} does not change the SD.`, `Multiplying by ${m} multiplies it: ${m} × ${n(sd, 5)} = <b>${n(m * sd, 4)}</b>.`) };
    },
    // actually transform the data and recompute
    verify: (p) => { const T = p.D.map((x) => x * p.m + p.k), t = mean(T); return Math.sqrt(T.reduce((a, x) => a + (x - t) ** 2, 0) / T.length); },
  },
  'c11m-stat-cv': {
    title: 'coefficient of variation',
    make(r) {
      const mu = pick(r, 20, 90, 5), sd = pick(r, 2, 12);
      return { mu, sd, q: `<p>A batsman's scores have mean ${mu} and standard deviation ${sd}. Find the coefficient of variation in percent (1 decimal place).</p>`, answer: (sd / mu) * 100, unit: '%', tol: 0.01,
        hint: 'CV = (σ / mean) × 100.',
        solution: steps(`CV = ${sd}/${mu} × 100.`, `= <b>${n((sd / mu) * 100, 4)}%</b>.`) };
    },
    // the same thing written as sd out of every 100 units of mean
    verify: (p) => (100 * p.sd) / p.mu,
  },
};
