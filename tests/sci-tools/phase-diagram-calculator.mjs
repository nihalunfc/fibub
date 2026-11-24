// Phase diagram calculator (src/lib/sci/phase.ts): more checks beside the block in tests/sci.mjs.
// Fatty-acid eutectics for heat storage, from the worked Schröder equations of Zhou et al. (2026), Materials 19(2): 356
// (doi:10.3390/ma19020356): capric 303.65 K, 176.0 J/g, 172.26 g/mol; lauric 316.95 K, 182.0 J/g, 200.32 g/mol;
// myristic 325.45 K, 188.6 J/g, 228.37 g/mol. The paper's ternary eutectic: 290.26 K, mole ratio 57.45:28.03:14.52,
// mass ratio 52.58:29.81:17.61; pseudo-binary mass ratio 82.4:17.6.
import { eutectic, liqA, liqB, toMass } from '../../src/lib/sci/phase.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const C = [[303.65, 176.0, 172.26], [316.95, 182.0, 200.32], [325.45, 188.6, 228.37]].map(([Tm, h, M]) => ({ Tm, H: h * M, M }));
  const [ca, la, ma] = C;
  const e = eutectic(ca.Tm, ca.H, la.Tm, la.H);
  check('phase: capric-lauric ideal eutectic 293.69 K at 33.44 mol % lauric', near(e.T, 293.695, 0.005) && near(100 * e.x, 33.44, 0.01) && near(liqA(ca.Tm, ca.H, e.T), e.x, 1e-9));
  const sum = (T) => C.reduce((s, c) => s + liqB(c.Tm, c.H, T), 0);
  let lo = 250, hi = 303; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; sum(m) < 1 ? (lo = m) : (hi = m); }
  const x = C.map((c) => liqB(c.Tm, c.H, lo)), m = x.map((v, i) => v * C[i].M), M = m.reduce((s, v) => s + v, 0);
  check('phase: capric-lauric-myristic ternary eutectic 290.26 K, mole 57.45:28.03:14.52, mass 52.58:29.81:17.61 (paper)', near(lo, 290.26, 0.005) && [57.45, 28.03, 14.52].every((v, i) => near(100 * x[i], v, 0.02)) && [52.58, 29.81, 17.61].every((v, i) => near((100 * m[i]) / M, v, 0.01)));
  const EU = { Tm: e.T, H: (1 - e.x) * ca.H + e.x * la.H, M: (1 - e.x) * ca.M + e.x * la.M }, e2 = eutectic(EU.Tm, EU.H, ma.Tm, ma.H);
  check('phase: pseudo-binary (capric-lauric eutectic) + myristic gives 17.6 wt % myristic (paper 82.4:17.6)', near(100 * toMass(e2.x, EU.M, ma.M), 17.6, 0.05));
};
