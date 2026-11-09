// #641 beam calculator: closed-form textbook cases (Roark / Gere beam tables, formulas only) and an independent
// NumPy/SciPy solution (reactions as unknowns, M(x) by statics, double integration of M/EI on 400,001 points).
import { solveBeam, sectionProps } from '../../src/lib/sci/eng-beam.ts';
export default async (check) => {
  const near = (a, b, rel = 1e-6) => Math.abs(a - b) <= rel * Math.max(1e-12, Math.abs(b));
  const L = 6, EI = 2e7, w = 10e3, P = 5e3;
  let r = solveBeam(L, EI, [{ x: 0, kind: 'pin' }, { x: L, kind: 'pin' }], [{ kind: 'dist', x: 0, x2: L, w, w2: w }]);
  check('beam: simply supported UDL deflection 5wL^4/384EI', near(-r.vmax.v, 5 * w * L ** 4 / 384 / EI) && r.vmax.x === 3);
  check('beam: simply supported UDL moment wL^2/8 and reactions wL/2', near(r.Mmax.M, w * L * L / 8) && near(r.reactions[0].R, w * L / 2) && near(r.Vabs.V * Math.sign(r.Vabs.V), w * L / 2));
  check('beam: end slope wL^3/24EI', near(-r.theta[0], w * L ** 3 / 24 / EI, 1e-6));
  r = solveBeam(L, EI, [{ x: 0, kind: 'pin' }, { x: L, kind: 'pin' }], [{ kind: 'point', x: 2, P }]);
  { const a = 2, b = 4; check('beam: off-centre point load, deflection under load Pa²b²/3EIL', near(-r.v[r.x.indexOf(2)], P * a * a * b * b / 3 / EI / L) && near(r.Mmax.M, P * a * b / L)); }
  r = solveBeam(L, EI, [{ x: 0, kind: 'fixed' }], [{ kind: 'point', x: L, P }]);
  check('beam: cantilever tip load PL^3/3EI and wall moment PL', near(-r.vmax.v, P * L ** 3 / 3 / EI) && near(r.Mmin.M, -P * L) && near(r.reactions[0].M, -P * L));
  r = solveBeam(L, EI, [{ x: 0, kind: 'fixed' }], [{ kind: 'dist', x: 0, x2: L, w, w2: w }]);
  check('beam: cantilever UDL wL^4/8EI', near(-r.vmax.v, w * L ** 4 / 8 / EI));
  r = solveBeam(L, EI, [{ x: 0, kind: 'fixed' }], [{ kind: 'moment', x: L, C: 4e3 }]);
  check('beam: cantilever end moment ML^2/2EI', near(Math.abs(r.vmax.v), 4e3 * L * L / 2 / EI));
  r = solveBeam(L, EI, [{ x: 0, kind: 'fixed' }, { x: L, kind: 'fixed' }], [{ kind: 'dist', x: 0, x2: L, w, w2: w }]);
  check('beam: fixed-fixed UDL wL^4/384EI, ends wL^2/12, mid wL^2/24', near(-r.vmax.v, w * L ** 4 / 384 / EI) && near(r.Mmin.M, -w * L * L / 12) && near(r.Mmax.M, w * L * L / 24));
  r = solveBeam(L, EI, [{ x: 0, kind: 'fixed' }, { x: L, kind: 'pin' }], [{ kind: 'dist', x: 0, x2: L, w, w2: w }]);
  check('beam: propped cantilever UDL, prop 3wL/8, wall wL^2/8', near(r.reactions[1].R, 3 * w * L / 8) && near(r.Mmin.M, -w * L * L / 8) && near(r.Mmax.M, 9 * w * L * L / 128, 1e-6));
  r = solveBeam(L, EI, [{ x: 0, kind: 'pin' }, { x: L, kind: 'pin' }], [{ kind: 'dist', x: 0, x2: L, w: 0, w2: w }]);
  check('beam: triangular load Mmax wL^2/(9√3) at L/√3', near(r.Mmax.M, w * L * L / (9 * Math.sqrt(3)), 1e-6) && Math.abs(r.Mmax.x - L / Math.sqrt(3)) < 1e-3);
  // Against the NumPy/SciPy double-integration solution.
  const cases = [
    [8, 4.2e6, [{ x: 1, kind: 'pin' }, { x: 6, kind: 'pin' }], [{ kind: 'point', x: 0, P: 5000 }, { kind: 'dist', x: 1, x2: 8, w: 4000, w2: 4000 }, { kind: 'moment', x: 3, C: 6000 }, { kind: 'point', x: 8, P: 3000 }], [12000, 24000], -0.0057460, 7000, -14000],
    [5, 1.5e6, [{ x: 0, kind: 'fixed' }, { x: 5, kind: 'pin' }], [{ kind: 'dist', x: 0, x2: 5, w: 0, w2: 12000 }, { kind: 'point', x: 2, P: 7000 }], [19044, -24220, 17956], -0.0195915, 15217.489, -24220],
    [7, 9e6, [{ x: 0, kind: 'fixed' }, { x: 7, kind: 'fixed' }], [{ kind: 'dist', x: 2, x2: 5, w: 8000, w2: 3000 }, { kind: 'moment', x: 4, C: -5000 }], [10073.63, -15918.37, 6426.37, 11903.15], -0.0030275, 11277.02, -15918.37],
    [4, 2e6, [{ x: 0, kind: 'pin' }, { x: 2, kind: 'pin' }, { x: 4, kind: 'pin' }], [{ kind: 'dist', x: 0, x2: 4, w: 6000, w2: 6000 }, { kind: 'point', x: 3, P: 2000 }], [4312.5, 16375, 5312.5], -0.00037827, 2351.888, -3375],
  ];
  cases.forEach(([L, EI, s, l, R, v, Mx, Mn], i) => {
    const q = solveBeam(L, EI, s, l), got = q.reactions.flatMap((x) => (x.kind === 'fixed' ? [x.R, x.M] : [x.R]));
    check(`beam: NumPy case ${i + 1} reactions`, got.length === R.length && got.every((g, j) => Math.abs(g - R[j]) < 0.02 + 1e-5 * Math.abs(R[j])));
    check(`beam: NumPy case ${i + 1} deflection and moments`, near(q.vmax.v, v, 1e-4) && near(q.Mmax.M, Mx, 1e-5) && near(q.Mmin.M, Mn, 1e-5) && q.check < 1e-6);
  });
  let threw = false; try { solveBeam(5, 1e6, [{ x: 2, kind: 'pin' }], [{ kind: 'point', x: 1, P: 1 }]); } catch { threw = true; }
  check('beam: one pin alone is a mechanism', threw);
  // Sections.
  let s = sectionProps({ kind: 'rect', b: 100, h: 200 });
  check('beam: rectangle I = bh³/12, Z = bh²/6', near(s.I, 100 * 200 ** 3 / 12) && near(s.Z, 100 * 200 * 200 / 6) && s.k === 1.5);
  s = sectionProps({ kind: 'circle', d: 50 });
  check('beam: solid round I = πd⁴/64, shear factor 4/3', near(s.I, Math.PI * 50 ** 4 / 64) && near(s.k, 4 / 3));
  s = sectionProps({ kind: 'circle', d: 50, di: 49.999 });
  check('beam: thin tube shear factor → 2', Math.abs(s.k - 2) < 1e-3);
  s = sectionProps({ kind: 'I', h: 300, bf: 150, tf: 10, tw: 7 });
  check('beam: I-section from plates', near(s.I, (150 * 300 ** 3 - 143 * 280 ** 3) / 12) && near(s.A, 2 * 1500 + 280 * 7));
};
