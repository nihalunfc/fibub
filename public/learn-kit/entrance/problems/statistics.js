// Live problems for Statistics.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const sg = (v) => String(v).replace('-', '−');
const mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;

export default {
  'st-var': {
    title: 'variance of a small data set',
    make(r) {
      const xs = Array.from({ length: pick(r, 5, 7) }, () => pick(r, 2, 20));
      const N = xs.length, sx = xs.reduce((s, x) => s + x, 0), sxx = xs.reduce((s, x) => s + x * x, 0);
      const answer = sxx / N - (sx / N) ** 2;
      return { xs,
        q: `<p>Find the variance (divide by n) of the data ${xs.join(', ')}.</p>`,
        answer, unit: '', tol: 0.002, abs: 0.001,
        hint: 'Variance = (mean of the squares) − (square of the mean) = Σx²/n − (Σx/n)².',
        solution: steps(`n = ${N}, Σx = ${sx}, mean = ${n(sx / N, 5)}.`, `Σx² = ${sxx}, so Σx²/n = ${n(sxx / N, 6)}.`, `Variance = ${n(sxx / N, 6)} − ${n(sx / N, 5)}² = <b>${n(answer, 5)}</b>.`) };
    },
    verify: (x) => { const m = mean(x.xs); return mean(x.xs.map((v) => (v - m) ** 2)); },
  },
  'st-combined': {
    title: 'combined standard deviation of two groups',
    make(r) {
      const n1 = pick(r, 2, 30, 2), n2 = pick(r, 2, 30, 2), m1 = pick(r, 20, 60), m2 = pick(r, 20, 60), s1 = pick(r, 2, 9), s2 = pick(r, 2, 9);
      const N = n1 + n2, m = (n1 * m1 + n2 * m2) / N;
      const v = (n1 * (s1 * s1 + (m1 - m) ** 2) + n2 * (s2 * s2 + (m2 - m) ** 2)) / N, answer = Math.sqrt(v);
      return { n1, n2, m1, m2, s1, s2,
        q: `<p>Group A has ${n1} values with mean ${m1} and standard deviation ${s1}. Group B has ${n2} values with mean ${m2} and standard deviation ${s2}. Find the standard deviation of all ${N} values together.</p>`,
        answer, unit: '', tol: 0.002,
        hint: 'Find the combined mean first. Then σ² = [n₁(σ₁² + d₁²) + n₂(σ₂² + d₂²)]/(n₁ + n₂), where dᵢ = (group mean) − (combined mean).',
        solution: steps(`Combined mean = (${n1} × ${m1} + ${n2} × ${m2})/${N} = ${n(m, 5)}.`, `d₁ = ${sg(n(m1 - m, 4))}, d₂ = ${sg(n(m2 - m, 4))}.`, `σ² = [${n1}(${s1 * s1} + ${n((m1 - m) ** 2, 4)}) + ${n2}(${s2 * s2} + ${n((m2 - m) ** 2, 4)})]/${N} = ${n(v, 5)}.`, `σ = <b>${n(answer, 4)}</b>.`) };
    },
    verify: (x) => { // build real data with those means and SDs (half at mean − s, half at mean + s) and compute directly
      const d = []; for (let i = 0; i < x.n1; i++) d.push(x.m1 + (i % 2 ? x.s1 : -x.s1)); for (let i = 0; i < x.n2; i++) d.push(x.m2 + (i % 2 ? x.s2 : -x.s2));
      const m = mean(d); return Math.sqrt(mean(d.map((v) => (v - m) ** 2)));
    },
  },
  'st-wrong': {
    title: 'correct the mean and variance after a misread value',
    make(r) {
      const N = pick(r, 10, 40, 5), m = pick(r, 20, 60), s = pick(r, 3, 9), lim = Math.max(1, Math.floor(0.5 * s * Math.sqrt(N)));
      // keep the data possible: one value cannot lie further from the mean than the spread allows
      const bad = m + pick(r, 1, lim), good = m - pick(r, 1, lim);
      const sx = N * m, sxx = N * (s * s + m * m), sx2 = sx - bad + good, sxx2 = sxx - bad * bad + good * good;
      const answer = sxx2 / N - (sx2 / N) ** 2;
      return { N, m, s, bad, good,
        q: `<p>The mean and standard deviation of ${N} observations were found to be ${m} and ${s}. Later it was found that one value was copied as ${bad} instead of ${good}. Find the correct variance.</p>`,
        answer, unit: '', tol: 0.002,
        hint: 'Rebuild the sums: Σx = n × mean and Σx² = n(σ² + mean²). Remove the wrong value, add the right one, then recompute.',
        solution: steps(`Wrong sums: Σx = ${N} × ${m} = ${sx}; Σx² = ${N}(${s * s} + ${m * m}) = ${sxx}.`, `Correct sums: Σx = ${sx} − ${bad} + ${good} = ${sx2}; Σx² = ${sxx} − ${bad * bad} + ${good * good} = ${sxx2}.`, `Correct mean = ${n(sx2 / N, 5)}; variance = ${sxx2}/${N} − ${n(sx2 / N, 5)}² = <b>${n(answer, 5)}</b>.`) };
    },
    verify: (x) => { // shift-of-origin form: new variance = old variance + change in the mean of squares about the old mean
      const dm = (x.good - x.bad) / x.N; const dq = ((x.good - x.m) ** 2 - (x.bad - x.m) ** 2) / x.N;
      return x.s * x.s + dq - dm * dm;
    },
  },
};
