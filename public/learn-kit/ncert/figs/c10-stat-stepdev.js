// Class 10 Statistics (step player): the step-deviation method. When all the deviations share a common factor h
// (here the class width 20), divide it out: u = (x - a) / h, so the numbers are tiny integers. The mean is
// a + h × (sum of f·u) / (sum of f).
import { tableFig, RUNS } from './c10-stat-direct.js';

export default function (host) {
  const u = RUNS.x.map((x) => (x - 50) / 20), fu = u.map((v, i) => v * RUNS.f[i]);
  return tableFig(host, {
    title: 'Step-deviation method (a = 50, h = 20)', label: 'Table for the step deviation method of finding the mean of grouped data', totRowAt: 5,
    cols: [
      { h: 'class', vals: RUNS.cls, at: 0 },
      { h: 'f', vals: RUNS.f.map(String), at: 0, tot: '40', totAt: 5 },
      { h: 'x', vals: RUNS.x.map(String), at: 1 },
      { h: 'u = (x−50)/20', vals: u.map(String), at: 3 },
      { h: 'f × u', vals: fu.map(String), at: 4, tot: '−3', totAt: 5 },
    ],
    notes: ['Same 40 batters again', 'Class marks x: 10, 30, 50, 70, 90', 'Take a = 50 and h = 20, the class width. All x − a are multiples of 20', 'u = (x − a) ÷ h gives −2, −1, 0, 1, 2: tiny whole numbers', 'f × u: 5×(−2) = −10, 9×(−1) = −9, 0, 8, 8', ['Σf = 40 and Σfu = −3', ''], ['x̄ = a + h × Σfu ÷ Σf = 50 + 20 × (−3) ÷ 40', 'x̄ = 48.5 (same answer again)']],
    hi: { 2: 2, 3: 2 },
  });
}
