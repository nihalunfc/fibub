// Class 10 Maths, Statistics: live problems (original fibub questions). Ids start with c10m-stat-.
import { pick, choose, n, steps } from './_util.js';

// five classes of width h starting at lo, with frequencies f
const cls = (lo, h, i) => `${lo + i * h}–${lo + (i + 1) * h}`;
const tbl = (lo, h, f, hide) => {
  const td = 'style="border:1px solid var(--line,#ccc);padding:3px 12px;text-align:center"';
  return '<table style="border-collapse:collapse;margin:8px 0"><thead><tr><th ' + td + '>Class</th><th ' + td + '>Frequency</th></tr></thead><tbody>' + f.map((v, i) => `<tr><td ${td}>${cls(lo, h, i)}</td><td ${td}>${hide === i ? 'p' : v}</td></tr>`).join('') + '</tbody></table>';
};
const marks = (lo, h, k) => Array.from({ length: k }, (_, i) => lo + h * (i + 0.5));
const randf = (r, k, a = 3, b = 14) => Array.from({ length: k }, () => pick(r, a, b));
// frequencies with a clear peak in the middle (modal class is an inside class)
const peaked = (r) => { const f = randf(r, 5, 3, 9); const m = 1 + Math.floor(r() * 3); f[m] = Math.max(...f) + pick(r, 2, 5); return f; };

export default {
  'c10m-stat-mean': {
    title: 'mean of grouped data',
    make(r) {
      const h = choose(r, [10, 20]), lo = choose(r, [0, 10, 20]), f = randf(r, 5), x = marks(lo, h, 5), N = f.reduce((s, v) => s + v, 0);
      const answer = f.reduce((s, v, i) => s + v * x[i], 0) / N;
      return { lo, h, f, q: `<p>The table shows the marks of ${N} students. Find the mean marks.</p>${tbl(lo, h, f)}`, answer, unit: 'marks', tol: 0.002,
        hint: `Class mark x = (lower + upper) ÷ 2. Mean = Σfx ÷ Σf. The class marks are ${x.join(', ')}.`,
        solution: steps(`Class marks: ${x.join(', ')}.`, `Σf = ${N} and Σfx = ${f.map((v, i) => `${v}×${x[i]}`).join(' + ')} = ${f.reduce((s, v, i) => s + v * x[i], 0)}.`, `Mean = ${f.reduce((s, v, i) => s + v * x[i], 0)} ÷ ${N} = <b>${n(answer, 4)}</b>.`) };
    },
    verify(p) { const x = marks(p.lo, p.h, 5), a = x[2], N = p.f.reduce((s, v) => s + v, 0); return a + p.f.reduce((s, v, i) => s + v * (x[i] - a), 0) / N; },
  },
  'c10m-stat-step': {
    title: 'step-deviation method',
    make(r) {
      const h = choose(r, [5, 10, 20]), lo = choose(r, [0, 20, 100]) , f = randf(r, 5), x = marks(lo, h, 5), a = x[2], N = f.reduce((s, v) => s + v, 0);
      const u = [-2, -1, 0, 1, 2], sfu = f.reduce((s, v, i) => s + v * u[i], 0), answer = a + (h * sfu) / N;
      return { lo, h, f, a, q: `<p>Use the step-deviation method with assumed mean a = ${a} (the middle class mark) to find the mean of this data of ${N} observations.</p>${tbl(lo, h, f)}`, answer, unit: '', tol: 0.002,
        hint: `u = (x − ${a}) ÷ ${h} takes the values −2, −1, 0, 1, 2. Mean = a + h × Σfu ÷ Σf.`,
        solution: steps(`u = (x − ${a}) ÷ ${h} = −2, −1, 0, 1, 2.`, `Σfu = ${f.map((v, i) => `${v}×(${u[i]})`).join(' + ')} = ${sfu}, Σf = ${N}.`, `Mean = ${a} + ${h} × ${sfu} ÷ ${N} = <b>${n(answer, 4)}</b>.`) };
    },
    verify(p) { const x = marks(p.lo, p.h, 5), N = p.f.reduce((s, v) => s + v, 0); return p.f.reduce((s, v, i) => s + v * x[i], 0) / N; },
  },
  'c10m-stat-mode': {
    title: 'mode of grouped data',
    make(r) {
      const h = choose(r, [10, 20]), lo = choose(r, [0, 10, 20]), f = peaked(r), m = f.indexOf(Math.max(...f)), l = lo + m * h;
      const answer = l + (h * (f[m] - f[m - 1])) / (2 * f[m] - f[m - 1] - f[m + 1]);
      return { lo, h, f, q: `<p>Find the mode of this data.</p>${tbl(lo, h, f)}`, answer, unit: '', tol: 0.002,
        hint: 'Modal class = highest frequency. Mode = l + h × (f1 − f0) ÷ (2f1 − f0 − f2).',
        solution: steps(`The highest frequency is ${f[m]}, so the modal class is ${cls(lo, h, m)}: l = ${l}, h = ${h}, f1 = ${f[m]}, f0 = ${f[m - 1]}, f2 = ${f[m + 1]}.`, `Mode = ${l} + ${h} × (${f[m]} − ${f[m - 1]}) ÷ (${2 * f[m]} − ${f[m - 1]} − ${f[m + 1]}).`, `Mode = <b>${n(answer, 4)}</b>.`) };
    },
    verify(p) {
      const m = p.f.indexOf(Math.max(...p.f)), l = p.lo + m * p.h, t = p.f; // crossing of the two lines, found from their equations
      const A = (x) => t[m - 1] + ((t[m] - t[m - 1]) * (x - l)) / p.h, B = (x) => t[m] + ((t[m + 1] - t[m]) * (x - l)) / p.h;
      let lo = l, hi = l + p.h; for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (A(mid) < B(mid)) lo = mid; else hi = mid; } return (lo + hi) / 2;
    },
  },
  'c10m-stat-median': {
    title: 'median of grouped data',
    make(r) {
      const h = choose(r, [10, 20]), lo = choose(r, [0, 10, 20]), f = randf(r, 5, 3, 12), N = f.reduce((s, v) => s + v, 0);
      let c = 0, mi = 0; for (let i = 0; i < 5; i++) { if (c + f[i] >= N / 2) { mi = i; break; } c += f[i]; }
      const answer = lo + mi * h + ((N / 2 - c) / f[mi]) * h;
      return { lo, h, f, q: `<p>Find the median of this data of ${N} observations.</p>${tbl(lo, h, f)}`, answer, unit: '', tol: 0.002,
        hint: 'Find n/2, build the cumulative frequency, locate the median class, then median = l + ((n/2 − cf) ÷ f) × h.',
        solution: steps(`n = ${N}, so n/2 = ${N / 2}.`, `Cumulative frequencies: ${f.map((_, i) => f.slice(0, i + 1).reduce((s, v) => s + v, 0)).join(', ')}. The median class is ${cls(lo, h, mi)}: l = ${lo + mi * h}, cf = ${c}, f = ${f[mi]}, h = ${h}.`, `Median = ${lo + mi * h} + (${N / 2} − ${c}) ÷ ${f[mi]} × ${h} = <b>${n(answer, 4)}</b>.`) };
    },
    verify(p) { // read n/2 off the cumulative polygon by straight-line interpolation between class boundaries
      const N = p.f.reduce((s, v) => s + v, 0); let c = 0;
      for (let i = 0; i < 5; i++) { const top = c + p.f[i]; if (top >= N / 2) return p.lo + p.h * (i + (N / 2 - c) / (top - c)); c = top; }
    },
  },
  'c10m-stat-missing': {
    title: 'find a missing frequency',
    make(r) {
      for (let tries = 0; tries < 60; tries++) {
        const h = 20, lo = 0, x = marks(lo, h, 5), k = [pick(r, 3, 9), pick(r, 5, 12), 0, pick(r, 4, 12), pick(r, 2, 8)], p = pick(r, 4, 14);
        const f = k.slice(); f[2] = p; const N = f.reduce((s, v) => s + v, 0), M = +(f.reduce((s, v, i) => s + v * x[i], 0) / N).toFixed(2);
        const D = k.reduce((s, v, i) => s + v * (x[i] - M), 0), p2 = D / (M - x[2]); // from sum f(x - M) = 0
        if (Math.abs(p2 - p) < 0.03) return { k, M, p, q: `<p>The mean of this data is ${M}. Find the missing frequency p.</p>${tbl(lo, h, f, 2)}`, answer: p, unit: '', tol: 0.01, abs: 0.1,
          hint: 'Write Σfx and Σf using p, then put Σfx ÷ Σf = the given mean and solve for p.',
          solution: steps(`Class marks 10, 30, 50, 70, 90. Σf = ${N - p} + p and Σfx = ${k.reduce((s, v, i) => s + v * x[i], 0)} + 50p.`, `(${k.reduce((s, v, i) => s + v * x[i], 0)} + 50p) ÷ (${N - p} + p) = ${M}.`, `Solving gives p = <b>${p}</b>.`) };
      }
      const k = [5, 8, 0, 9, 4], x = marks(0, 20, 5), f = [5, 8, 14, 9, 4], N = 40, M = +(f.reduce((s, v, i) => s + v * x[i], 0) / N).toFixed(2);
      return { k, M, p: 14, q: `<p>The mean of this data is ${M}. Find the missing frequency p.</p>${tbl(0, 20, f, 2)}`, answer: 14, unit: '', tol: 0.01, abs: 0.1, hint: 'Σfx ÷ Σf = mean.', solution: steps('Set up Σfx ÷ Σf = mean and solve for p.', `p = <b>14</b>.`) };
    },
    verify(p) { const x = marks(0, 20, 5); const A = p.k.reduce((s, v, i) => s + v * x[i], 0), S = p.k.reduce((s, v) => s + v, 0); return Math.round((p.M * S - A) / (50 - p.M)); }, // the mean is shown to 2 decimals, so round to the whole frequency
  },
  'c10m-stat-empirical': {
    title: 'mode from mean and median',
    make(r) {
      const mean = pick(r, 20, 90, 0.5), median = +(mean + pick(r, -4, -1, 0.5)).toFixed(1), answer = 3 * median - 2 * mean;
      return { mean, median, q: `<p>For a moderately skewed set of data the mean is ${mean} and the median is ${median}. Use the empirical relation to estimate the mode.</p>`, answer, unit: '', tol: 0.002, abs: 0.01,
        hint: 'Mode ≈ 3 × median − 2 × mean.', solution: steps(`Mode ≈ 3 × median − 2 × mean.`, `= 3 × ${median} − 2 × ${mean} = ${n(3 * median)} − ${n(2 * mean)}.`, `Mode ≈ <b>${n(answer, 4)}</b>.`) };
    },
    verify: (p) => p.median + 2 * (p.median - p.mean),
  },
};
