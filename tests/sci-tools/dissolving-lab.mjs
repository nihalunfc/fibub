// #1226 Dissolving lab. Checked against rounded general solubility values (salt ~36.0 g/100 g at 20 °C and 39.2 at
// 100 °C, sugar ~204 at 20 °C and 487 at 100 °C, KNO3 ~31.6 at 20 °C, 110 at 60 °C and 246 at 100 °C; O2 ~14.6 mg/L
// at 0 °C, 9.1 at 20 °C; CO2 ~3.35 g/L at 0 °C, 1.69 at 20 °C) and hand-worked mass percent and molality.
import { SOLUTES, mix, capacity, crystalsOnCooling, oxygen, carbonDioxide } from '../../src/lib/sci/dissolving-j2.ts';

export default async (check) => {
  const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);
  const ref = { salt: [[20, 36.0], [100, 39.2]], sugar: [[0, 179.2], [20, 203.9], [60, 287.3], [100, 487.2]], kno3: [[0, 13.3], [20, 31.6], [40, 63.9], [60, 110], [80, 169], [100, 246]] };
  let ok = true; for (const [id, pts] of Object.entries(ref)) for (const [t, s] of pts) if (!near(SOLUTES[id].s(t), s, 0.05)) ok = false;
  check('dissolving: curves within 5% of rounded general values', ok);
  let mono = true; for (const id of Object.keys(SOLUTES)) for (let t = 0; t < 100; t++) if (SOLUTES[id].s(t + 1) <= SOLUTES[id].s(t)) mono = false;
  check('dissolving: every curve rises with temperature', mono);
  const m = mix('salt', 40, 100, 20);
  check('dissolving: 40 g salt in 100 g water at 20 °C leaves 3.64 g, 26.7% by mass', near(m.dissolved, 36.36, 1e-9) && near(m.left, 3.64, 1e-6) && m.saturated && near(m.massPct, 26.665, 1e-3));
  check('dissolving: molality of that solution = 36.36/58.44/0.1 = 6.222 mol/kg', near(m.molality, 6.2218, 1e-3));
  const u = mix('sugar', 50, 200, 20);
  check('dissolving: 50 g sugar in 200 g water is unsaturated, nothing left', !u.saturated && u.left === 0 && u.dissolved === 50 && near(u.perHundred, 25, 1e-12) && near(u.massPct, 20, 1e-12));
  check('dissolving: capacity scales with water', near(capacity('kno3', 40, 200), 2 * capacity('kno3', 40, 100), 1e-12) && near(capacity('salt', 150, 100), capacity('salt', 100, 100), 1e-12));
  check('dissolving: KNO3 cooled 60→20 °C gives about 78 g crystals per 100 g water', near(crystalsOnCooling('kno3', 100, 60, 20), 78.4, 0.02) && crystalsOnCooling('kno3', 100, 20, 60) === 0);
  check('dissolving: oxygen 14.6 mg/L at 0 °C and ~9.1 at 20 °C, falls with warming', near(oxygen(0), 14.6, 1e-9) && near(oxygen(20), 9.09, 0.02) && oxygen(30) < oxygen(20) && oxygen(40) < oxygen(30));
  check('dissolving: CO2 3.35 g/L at 0 °C and ~1.69 at 20 °C', near(carbonDioxide(0), 3.35, 1e-9) && near(carbonDioxide(20), 1.69, 0.03));
};
