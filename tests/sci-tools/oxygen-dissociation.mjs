// #1130 Oxygen dissociation and lung volumes. Saturations were checked against a separate Python version of the
// Severinghaus (1979) equation and virtual-PO2 correction (PO2 20/40/60/100 mmHg -> 0.3198/0.7495/0.9058/0.9775;
// pH 7.2, 39 °C, PCO2 60 at 40 mmHg -> 0.5529, P50 36.95 mmHg), the textbook P50 of about 26.8 mmHg, and O2
// content 1.34 × Hb × SO2 + 0.003 × PO2 (Hb 15: 19.95 and 15.18 mL/dL). Lung capacities by hand.
import { satStandard, saturation, p50, content, shiftFactor, NORMAL, capacities, spiro, TYPICAL } from '../../src/lib/sci/hbcurve.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  check('o2: standard curve matches Python', [[20, 0.3197674419], [40, 0.7494646681], [60, 0.9057971014], [100, 0.9774653313]].every(([p, s]) => near(satStandard(p), s, 1e-9)));
  check('o2: P50 about 26.8 mmHg', near(p50(), 26.857, 0.01) && near(shiftFactor(NORMAL), 1));
  const ex = { pH: 7.2, tempC: 39, pco2: 60 };
  check('o2: Bohr shift matches Python', near(saturation(40, ex), 0.5528841739, 1e-9) && near(p50(ex), 36.95045094, 1e-6));
  check('o2: alkaline, cool, low CO2 shifts left', near(saturation(40, { pH: 7.6, tempC: 35, pco2: 30 }), 0.8798629941, 1e-9) && p50({ pH: 7.6, tempC: 35, pco2: 30 }) < p50());
  check('o2: fetal haemoglobin binds tighter (P50 near 19)', near(p50({ ...NORMAL, fetal: true }), 19, 0.2));
  check('o2: content', near(content(100, 15), 19.947053159, 1e-6) && near(content(40, 15), 15.184239829, 1e-6));
  check('o2: zero and rising', satStandard(0) === 0 && satStandard(10) < satStandard(11) && satStandard(600) < 1);
  const c = capacities(TYPICAL);
  check('lungs: capacities from volumes', c.vc === 4300 && c.tlc === 5450 && c.frc === 2200 && c.ic === 3250 && c.minute === 6000);
  let lo = Infinity, hi = -Infinity; for (let t = 0; t < 30; t += 0.01) { const v = spiro(TYPICAL, t); lo = Math.min(lo, v); hi = Math.max(hi, v); }
  check('lungs: spirogram spans residual volume to total lung capacity', near(lo, 1150, 1) && near(hi, 5450, 1) && near(spiro(TYPICAL, 0), 2200) && near(spiro(TYPICAL, 2.5), 2700));
};
