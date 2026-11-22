// Class 10 Statistics (step player): the assumed-mean method with the same 40 batters as the direct method.
// Pick any class mark a as a guess, work with the small deviations d = x - a, and correct the guess at the end:
// mean = a + (sum of f·d) / (sum of f).
import { tableFig, RUNS } from './c10-stat-direct.js';

export default function (host) {
  const d = RUNS.x.map((x) => x - 50), fd = d.map((v, i) => v * RUNS.f[i]);
  return tableFig(host, {
    title: 'Assumed mean method (a = 50)', label: 'Table for the assumed mean method of finding the mean of grouped data', totRowAt: 5,
    cols: [
      { h: 'class', vals: RUNS.cls, at: 0 },
      { h: 'f', vals: RUNS.f.map(String), at: 0, tot: '40', totAt: 5 },
      { h: 'x', vals: RUNS.x.map(String), at: 1 },
      { h: 'd = x − 50', vals: d.map(String), at: 3 },
      { h: 'f × d', vals: fd.map(String), at: 4, tot: '−60', totAt: 5 },
    ],
    notes: ['The same 40 batters', 'Class marks x again: 10, 30, 50, 70, 90', 'Assume a mean a = 50 (a middle class mark: any number works)', 'Deviations d = x − a: how far each class mark is from 50', 'Multiply: f × d. The numbers are small and easy', ['Σf = 40 and Σfd = −60', ''], ['x̄ = a + Σfd ÷ Σf = 50 + (−60) ÷ 40', 'x̄ = 48.5 (same answer!)']],
    hi: { 2: 2, 3: 2 },
    after(ctx, w, h, col, step, y0, rh) { /* the guess is marked by the highlighted row */ },
  });
}
