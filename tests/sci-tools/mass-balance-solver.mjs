// #664 mass and energy balance solver. Reference values from an independent NumPy calculation written for these
// tests (the same flowsheet's balance equations written out by hand and solved with numpy.linalg.solve, then the
// enthalpy balance solved the same way), plus degrees-of-freedom and closure checks.
import * as B from '../../src/lib/sci/massbal.ts';
export default async (check) => {
  const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.max(Math.abs(b), 1e-9);
  const comps = 'Component, Molar mass, cp\nN2, 28.014, 29.1\nH2, 2.016, 28.8\nNH3, 17.031, 35.1\nAr, 39.948, 20.8';
  const units = 'mixer M1: S1 + S7 -> S2\nreactor R1: S2 -> S3 | N2 + 3 H2 -> 2 NH3 | N2 0.25 | dH -92000\nseparator SEP: S3 -> S4 + S5 | NH3 0.95 | T 25\nsplitter SPL: S5 -> S6 + S7 | 0.05';
  const feeds = 'S1: N2 100, H2 300, Ar 1 | T 150';
  const r = B.solveSheet(B.parseSheet(comps, units, feeds));
  const py = { S1: [100.0, 300.0, 0.0, 1.0], S7: [247.8260869565217, 743.4782608695659, 8.672828939860779, 18.999999999999982], S2: [347.8260869565217, 1043.478260869566, 8.672828939860779, 19.999999999999982], S3: [260.86956521739125, 782.6086956521746, 182.58587241812162, 19.999999999999982], S4: [0, 0, 173.45657879721554, 0], S5: [260.86956521739125, 782.6086956521746, 9.12929362090609, 19.999999999999982], S6: [13.043478260869563, 39.13043478260873, 0.4564646810453046, 0.9999999999999991] };
  check('massbal: example has 0 degrees of freedom (28 unknowns, 28 independent equations)', r.dof === 0 && r.consistent && r.unknowns === 28 && r.rank === 28);
  check('massbal: every stream flow matches numpy.linalg.solve', Object.entries(py).every(([s, f]) => f.every((v, c) => Math.abs(r.flows[r.streams.indexOf(s)][c] - v) < 1e-9 * Math.max(1, v))));
  check('massbal: extent of reaction 86.957 kmol/h', near(r.extent.R1, 86.95652173913042, 1e-12));
  check('massbal: mass closes at every unit', Object.values(r.massCheck).every((v) => Math.abs(v) < 1e-8));
  check('massbal: argon in equals argon out of the purge (inert balance)', near(r.flows[r.streams.indexOf('S6')][3], 1, 1e-12));
  const pyT = { S1: 150.0, S7: 25.0, S2: 60.36798434816713, S3: 280.61626726499946, S4: 25.0 };
  check('massbal: temperatures match the NumPy energy balance (mixer 60.37 °C, adiabatic reactor 280.62 °C)', Object.entries(pyT).every(([s, t]) => Math.abs(r.T[s] - t) < 1e-9));
  check('massbal: separator duty matches (−9,446,350 kJ/h)', near(r.duty.SEP, -9446350.0, 1e-9) && Math.abs(r.duty.R1) < 1e-6 && Math.abs(r.duty.M1) < 1e-6);
  { const u = B.solveSheet(B.parseSheet(comps, units, ''));
    check('massbal: without the feed, 4 degrees of freedom', u.dof === 4 && u.consistent && u.freeVars.length === 4); }
  { const s = B.solveSheet(B.parseSheet(comps, units, 'S1: N2 100, H2 300, Ar 1 | T 150\nS6 total 999'));
    check('massbal: a conflicting extra specification is caught', !s.consistent); }
  { const s = B.solveSheet(B.parseSheet(comps, units, 'S1: N2 100, H2 ?, Ar 1 | T 150\nS6 H2 39.130434782608695'));
    check('massbal: a spec on the purge instead of a feed flow recovers the H2 feed (300)', s.dof === 0 && s.consistent && near(s.flows[s.streams.indexOf('S1')][1], 300, 1e-9)); }
  { const s = B.solveSheet(B.parseSheet('A\nB', 'separator X: F -> P + W | A 0.9, B 0.2', 'F: A 50, B 50'));
    check('massbal: simple separator with no energy data', near(s.flows[s.streams.indexOf('P')][0], 45, 1e-12) && near(s.flows[s.streams.indexOf('W')][1], 40, 1e-12) && s.energyNote.includes('cp')); }
  check('massbal: reaction parser', JSON.stringify(B.parseReaction('2 A + B -> 3 C', ['A', 'B', 'C'])) === JSON.stringify({ A: -2, B: -1, C: 3 }));
  let msg = ''; try { B.solveSheet(B.parseSheet('A', 'mixer M: F1 + F2 -> P\nmixer N: F2 -> Q', 'F1: A 1')); } catch (e) { msg = e.message; }
  check('massbal: a stream entering two units is refused', msg.includes('enters both'));
  msg = ''; try { B.parseSheet('A', 'pump P1: F -> G', ''); } catch (e) { msg = e.message; }
  check('massbal: unknown unit type is refused', msg.includes('Could not read the unit line'));
};
