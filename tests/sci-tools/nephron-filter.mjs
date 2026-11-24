// #1305 Kidney nephron filter. Checked by hand: 125 mL/min × 1440 = 180 L/day; 1.5 L urine = 0.833 % of 180 L;
// urea 180 L × 0.3 g/L = 54 g filtered, 27 g in urine; glucose at 90 mg/dL: 1.25 dL/min × 90 × 1440 = 162 g filtered,
// none lost; threshold load 225 mg/min, Tm 375 mg/min, splay up to 525 mg/min: at 300 mg/dL 540 g filtered,
// (375 - 225)^2 / (2 × 300) = 37.5 mg/min = 54 g lost, 486 g back; at 450 mg/dL past saturation, back = Tm = 540 g, 270 g lost; sodium 25200 mmol filtered, 151.2 mmol in urine.
import { day, glucose, urineL, backShare, waterSteps, FILTRATE_L_DAY } from '../../src/lib/sci/nephron.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  check('nephron: 180 L filtered a day', FILTRATE_L_DAY === 180);
  check('nephron: urine from water drunk, at least 0.5 L', urineL(2) === 1.5 && urineL(0.5) === 0.5 && urineL(0.8) === 0.5 && urineL(4) === 3.5);
  const r = Object.fromEntries(day(2, 90).map((x) => [x.id, x]));
  check('nephron: water 99.17 % back', near(backShare(r.water) * 100, 99.16666666666667, 1e-9));
  check('nephron: urea 54 g filtered, 27 g in urine', near(r.urea.filtered, 54) && near(r.urea.urine, 27));
  check('nephron: sodium 25200 mmol filtered, 151.2 in urine', near(r.salt.filtered, 25200) && near(r.salt.urine, 151.2, 1e-6));
  check('nephron: glucose 90 mg/dL all back', near(glucose(90).filtered, 162) && glucose(90).urine === 0 && near(glucose(180).urine, 0));
  check('nephron: glucose 300 mg/dL spills 54 g (splay)', near(glucose(300).filtered, 540) && near(glucose(300).back, 486) && near(glucose(300).urine, 54));
  check('nephron: glucose 450 mg/dL saturates at Tm', near(glucose(450).back, 540) && near(glucose(450).urine, 270));
  check('nephron: proteins not filtered', r.protein.filtered === 0 && r.protein.urine === 0);
  const w = waterSteps(1.5);
  check('nephron: water steps add up', near(w.pct + w.loop + w.late + 1.5, 180) && near(w.pct, 117) && near(w.loop, 27) && near(w.late, 34.5));
};
