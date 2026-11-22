// Class 10 Statistics (step player): the median of grouped data for the 40 batters. Build the cumulative frequency
// column, find n/2 = 20, the first class whose cf is at least 20 is the median class (40–60), then
// median = l + ((n/2 - cf before) / f) × h = 40 + (20 - 14) / 14 × 20 ≈ 48.57.
import { tableFig, RUNS } from './c10-stat-direct.js';

export default function (host) {
  const cf = ['5', '14', '28', '36', '40'];
  return tableFig(host, {
    title: 'Median = l + ((n/2 − cf) ÷ f) × h', label: 'Table with cumulative frequency to find the median class and median', totRowAt: 1,
    cols: [
      { h: 'class', vals: RUNS.cls, at: 0 },
      { h: 'f', vals: RUNS.f.map(String), at: 0, tot: 'n = 40', totAt: 1 },
      { h: 'cf', vals: cf, at: 2 },
    ],
    notes: ['The runs of 40 batters, class by class', 'Total n = 40, so n ÷ 2 = 20: we want the 20th student', 'Cumulative frequency (cf): keep a running total, 5, 5+9, 14+14 ...', 'The first cf that reaches 20 is 28, in the class 40–60: the median class', ['l = 40, cf before it = 14, f = 14, h = 20', ''], ['median = 40 + (20 − 14) ÷ 14 × 20', 'median ≈ 48.57 runs']],
    hi: { 3: 2, 4: 2, 5: 2 },
    after(ctx, w, h, col, step, y0, rh) { },
  });
}
