// #633 Smith chart. Γ, VSWR, return loss, mismatch loss and the lossless-line input impedance checked against numpy
// (complex arithmetic, embedded below). Matching networks checked directly: every L-network and stub solution must turn
// the load into exactly Z0, and Pozar (Microwave Engineering, 4th ed.) example 5.1 (200 − j100 Ω to 100 Ω at 500 MHz:
// 0.92 pF with 39.0 nH, or 46.1 nH with 2.61 pF).
import { mismatch, lineZin, lMatch, stubMatch, component, gamma, zFromGamma, lineArc, rCircle, xArc, abs, inv, add } from '../../src/lib/sci/eng-smith.ts';

const REF = [{"zl": [60, -80], "z0": 50, "l": 0.1, "g": [0.40540540540540543, -0.43243243243243235], "vswr": 3.9109760166217753, "rl": 4.542583717601582, "ml": 1.8799048235538895, "zin": [16.86262472491755, -26.99441988777969]}, {"zl": [200, -100], "z0": 100, "l": 0.3, "g": [0.39999999999999997, -0.20000000000000004], "vswr": 2.6180339887498945, "rl": 6.989700043360188, "ml": 0.969100130080564, "zin": [49.624728665208764, 49.24230807412499]}, {"zl": [10, 5], "z0": 50, "l": 0.25, "g": [-0.6551724137931035, 0.13793103448275862], "vswr": 5.052060979868452, "rl": 3.4845464559211914, "ml": 2.582780152430315, "zin": [200.00000000000003, -99.99999999999994]}, {"zl": [75, 0], "z0": 50, "l": 0.125, "g": [0.2, 0.0], "vswr": 1.4999999999999998, "rl": 13.979400086720375, "ml": 0.17728766960431602, "zin": [46.15384615384616, -19.230769230769237]}, {"zl": [1, 40], "z0": 75, "l": 0.37, "g": [-0.5455531453362256, 0.8134490238611713], "vswr": 96.33628636203007, "rl": 0.18033083807887412, "ml": 13.906996533259111, "zin": [0.8679556790394216, -25.418386842561134]}];
const close = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
const near = (a, b, tol = 1e-9) => Math.hypot(a[0] - b[0], a[1] - b[1]) <= tol * Math.max(1, Math.hypot(b[0], b[1]));

export default async (check) => {
  for (const R of REF) {
    const m = mismatch(R.zl, R.z0);
    check(`smith: ${R.zl[0]}${R.zl[1] < 0 ? '−' : '+'}j${Math.abs(R.zl[1])} Ω on ${R.z0} Ω: Γ, VSWR, return and mismatch loss = numpy`, near(m.gamma, R.g) && close(m.vswr, R.vswr) && close(m.returnLoss, R.rl) && close(m.mismatchLoss, R.ml));
    check(`smith: input impedance after ${R.l} λ = numpy`, near(lineZin(R.zl, R.z0, R.l), R.zin, 1e-9));
    const arc = lineArc(m.gamma, R.l);
    check(`smith: Γ rotated along the line gives the same impedance (${R.l} λ)`, near(zFromGamma(arc[arc.length - 1], R.z0), R.zin, 1e-9));
  }
  // Pozar example 5.1.
  { const s = lMatch([200, -100], 100); const c = s.map((x) => [component('B', x.B, 500e6), component('X', x.X, 500e6)]);
    check('smith: Pozar 5.1 two shunt-first solutions', s.length === 2 && s.every((x) => x.topology === 'shunt-first'));
    check('smith: Pozar 5.1 solution 1: B 0.0029 S, X 122.4 Ω, 0.92 pF and 39.0 nH (X/ω; the book rounds to 38.8)', close(s[0].B, 0.0029, 0.01) && close(s[0].X, 122.47, 1e-4) && c[0][0].type === 'C' && Math.abs(c[0][0].value * 1e12 - 0.92) < 0.005 && c[0][1].type === 'L' && Math.abs(c[0][1].value * 1e9 - 38.98) < 0.01);
    check('smith: Pozar 5.1 solution 2: B −0.0069 S, X −122.4 Ω, 46.1 nH and 2.61 pF', close(s[1].B, -0.0069, 0.01) && c[1][0].type === 'L' && Math.abs(c[1][0].value * 1e9 - 46.1) < 0.05 && c[1][1].type === 'C' && Math.abs(c[1][1].value * 1e12 - 2.6) < 0.015); }
  // Every solution matches, for loads all over the chart.
  const loads = [[200, -100], [60, -80], [10, 5], [25, 0], [30, 60], [5, -200], [49, 1], [120, 300], [80, 0]];
  for (const z of loads) {
    const ls = lMatch(z, 50);
    check(`smith: L-networks for ${z[0]}${z[1] < 0 ? '−' : '+'}j${Math.abs(z[1])} Ω all give 50 Ω (${ls.length} solutions)`, ls.length >= 2 && ls.every((x) => near(x.zin, [50, 0], 1e-9)));
    const ss = stubMatch(z, 50);
    check(`smith: shunt stubs for ${z[0]}${z[1] < 0 ? '−' : '+'}j${Math.abs(z[1])} Ω: Y(d) has G = 1/50 and both stub kinds cancel B`, ss.length >= 1 && ss.every((s) => {
      const y = inv(s.zAtStub), yo = [0, Math.tan(2 * Math.PI * s.open) / 50], ys = [0, -1 / Math.tan(2 * Math.PI * s.short) / 50];
      return close(y[0], 0.02, 1e-9) && close(y[1], s.B, 1e-9) && near(add(y, yo), [0.02, 0], 1e-8) && near(add(y, ys), [0.02, 0], 1e-8) && s.d >= 0 && s.d < 0.5 && s.open >= 0 && s.open < 0.5 && s.short >= 0 && s.short < 0.5;
    }));
  }
  { const s = lMatch([25, 0], 50); check('smith: a load below Z0 gets the series-first network', s.some((x) => x.topology === 'series-first')); }
  { const s = stubMatch([50, 30], 50); check('smith: a load with R = Z0 uses the special case', s.length === 1 && near(add(inv(s[0].zAtStub), [0, Math.tan(2 * Math.PI * s[0].open) / 50]), [0.02, 0], 1e-8)); }
  check('smith: quarter-wave transformer 100 Ω on 50 Ω line gives 25 Ω', near(lineZin([100, 0], 50, 0.25), [25, 0], 1e-9));
  check('smith: matched load, Γ = 0, infinite return loss', mismatch([50, 0], 50).mag === 0 && mismatch([50, 0], 50).returnLoss === Infinity);
  check('smith: chart circles lie inside the unit circle and r-circles pass through Γ = 1', rCircle(1).every((p) => abs(p) <= 1 + 1e-12) && xArc(-0.5).every((p) => abs(p) <= 1 + 1e-12) && near(rCircle(2)[0], [1, 0], 1e-12) && near(gamma([0, 1], 1), [0, 1], 1e-12));
};
