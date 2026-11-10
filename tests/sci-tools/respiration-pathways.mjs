// #1304 Aerobic and anaerobic respiration. Checked by hand against the balanced equations (C6H12O6 + 6 O2 → 6 CO2 +
// 6 H2O; → 2 C2H5OH + 2 CO2; → 2 C3H6O3) and molar masses worked from IUPAC atomic weights (glucose 180.156,
// CO2 44.009, H2O 18.015, ethanol 46.069, lactic acid 90.078): mass in = mass out to 0.05 g a mole.
import { respire, grams, glucoseFor, M } from '../../src/lib/sci/respiration.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const w = { C: 12.011, H: 1.008, O: 15.999 };
  check('respiration: molar masses from atomic weights', near(M.glucose, 6 * w.C + 12 * w.H + 6 * w.O, 0.005) && near(M.co2, w.C + 2 * w.O, 0.005) && near(M.water, 2 * w.H + w.O, 0.005) && near(M.ethanol, 2 * w.C + 6 * w.H + w.O, 0.005) && near(M.lactic, 3 * w.C + 6 * w.H + 3 * w.O, 0.005) && near(M.o2, 2 * w.O, 0.005));
  const a = respire(1, 1, 'yeast');
  check('respiration: aerobic 1 mol → 6 O2, 6 CO2, 6 H2O, 38 ATP', a.o2 === 6 && a.co2 === 6 && a.water === 6 && a.ethanol === 0 && a.atp === 38);
  const y = respire(1, 0, 'yeast'), m = respire(1, 0, 'muscle');
  check('respiration: yeast ferments to 2 ethanol + 2 CO2, 2 ATP', y.ethanol === 2 && y.co2 === 2 && y.o2 === 0 && y.atp === 2);
  check('respiration: muscle makes 2 lactic acid, no CO2', m.lactic === 2 && m.co2 === 0 && m.atp === 2);
  check('respiration: half oxygen gives 20 ATP per glucose', respire(1, 0.5, 'muscle').atpPerGlucose === 20);
  let ok = true;
  for (const org of ['yeast', 'muscle']) for (let f = 0; f <= 1.0001; f += 0.1) {
    const r = respire(2, f, org), g = grams(r), massIn = 2 * M.glucose + g.o2, massOut = g.co2 + g.water + g.ethanol + g.lactic;
    if (!near(massIn, massOut, 0.1)) ok = false;
  }
  check('respiration: mass in = mass out for every oxygen share', ok);
  check('respiration: glucose for 76 ATP is 2 aerobic, 38 anaerobic', near(glucoseFor(76, 1), 2) && near(glucoseFor(76, 0), 38));
};
