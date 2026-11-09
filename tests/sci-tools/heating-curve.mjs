// #1065 heating-curve: stages and mixtures checked against hand working in Python.
import { heatingStages, tempAt, mixTemp, iceIntoWater, C_WATER } from '../../src/lib/sci/learnheat.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const s = heatingStages(0.5, 500, -20, 120);
  check('heat: five stages', s.length === 5 && s.map((x) => x.kind).join() === 'warm,melt,warm,boil,warm');
  check('heat: Q = 21 kJ, 167 kJ, 210 kJ, 1130 kJ, 20 kJ', [21000, 167000, 210000, 1130000, 20000].every((q, i) => near(s[i].Q, q)));
  check('heat: times 42, 334, 420, 2260, 40 s (total 3096 s)', near(s[1].t0, 42) && near(s[2].t0, 376) && near(s[3].t0, 796) && near(s[4].t1, 3096));
  check('heat: temperature flat while melting', near(tempAt(s, 200).T, 0) && tempAt(s, 200).i === 1);
  check('heat: halfway through warming water = 50 °C', near(tempAt(s, 376 + 210).T, 50));
  check('heat: at t = 21 s ice is at −10 °C', near(tempAt(s, 21).T, -10));
  const s2 = heatingStages(1, 1000, -10, 50);
  check('heat: stop at 50 °C: three stages', s2.length === 3 && near(s2[2].T1, 50) && near(s2[2].t1, (21000 + 334000 + 210000) / 1000));
  check('heat: mixing 0.2 kg at 80 °C with 0.3 kg at 20 °C gives 44 °C', near(mixTemp([{ m: 0.2, c: C_WATER, T: 80 }, { m: 0.3, c: C_WATER, T: 20 }]), 44));
  check('heat: 0.5 kg iron (450) at 100 °C into 1 kg water at 20 °C = 24.07 °C', near(mixTemp([{ m: 0.5, c: 450, T: 100 }, { m: 1, c: 4200, T: 20 }]), 24.06779661016949));
  const a = iceIntoWater(0.05, 0.2, 50);
  check('heat: 50 g ice into 200 g at 50 °C: all melts, 24.095 °C', a.allMelts && near(a.T, 24.095238095238095));
  const b = iceIntoWater(0.2, 0.2, 50);
  check('heat: 200 g ice: only 125.7 g melts, stays 0 °C', !b.allMelts && b.T === 0 && near(b.melted, 0.12574850299401197));
};
