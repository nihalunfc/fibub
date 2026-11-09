// #1127 Cardiac cycle. Checked against the standard textbook timing at 75 beats/min (0.8 s cycle: atrial systole
// 0.1 s, ventricular systole 0.3 s, joint diastole 0.4 s), cardiac output 70 mL × 72 /min = 5.04 L/min, heart rate
// from an R-R interval (0.8 s -> 75 /min), and for continuity and bounds of the volume and ECG curves.
import { timing, phaseAt, valves, lvVolume, ecg, sounds, strokeVolume, cardiacOutput, ejectionFraction, rateFromRR } from '../../src/lib/sci/heartcycle.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const d = timing(75);
  check('heart: textbook timing at 75 /min', near(d.T, 0.8) && near(d.atrial, 0.1) && near(d.vSys, 0.3) && near(d.diastole, 0.4));
  const f = timing(150);
  check('heart: fast rate shortens diastole most', near(f.T, 0.4) && f.diastole / f.T < d.diastole / d.T && near(f.atrial + f.vSys + f.diastole, 0.4));
  check('heart: phases in order', phaseAt(75, 0.05) === 'atrial-systole' && phaseAt(75, 0.12) === 'isovolumetric-contraction' && phaseAt(75, 0.3) === 'ejection' && phaseAt(75, 0.42) === 'isovolumetric-relaxation' && phaseAt(75, 0.6) === 'filling' && phaseAt(75, 0.85) === 'atrial-systole');
  check('heart: valves', valves('filling').av && !valves('filling').semilunar && valves('ejection').semilunar && !valves('ejection').av && !valves('isovolumetric-contraction').av && !valves('isovolumetric-contraction').semilunar);
  let lo = Infinity, hi = -Infinity, jump = 0, prev = lvVolume(75, 0, 120, 50);
  for (let t = 0.0005; t <= 0.8; t += 0.0005) { const v = lvVolume(75, t, 120, 50); lo = Math.min(lo, v); hi = Math.max(hi, v); jump = Math.max(jump, Math.abs(v - prev)); prev = v; }
  check('heart: volume runs from 50 to 120 mL with no jumps', near(lo, 50, 1e-6) && near(hi, 120, 1e-6) && jump < 1.5 && near(lvVolume(75, 0, 120, 50), lvVolume(75, 0.8, 120, 50), 0.01));
  check('heart: volume flat while all valves are shut', near(lvVolume(75, 0.11, 120, 50), 120) && near(lvVolume(75, 0.14, 120, 50), 120) && near(lvVolume(75, 0.43, 120, 50), 50));
  let peak = 0, at = 0; for (let t = 0; t < 0.8; t += 0.0005) { const v = ecg(75, t); if (v > peak) { peak = v; at = t; } }
  check('heart: R peak as the ventricles start', near(at, 0.105, 0.002) && peak > 1 && peak < 1.2);
  check('heart: lub and dub times', near(sounds(75).lub, 0.1) && near(sounds(75).dub, 0.4));
  check('heart: stroke volume, cardiac output, ejection fraction', strokeVolume(120, 50) === 70 && near(cardiacOutput(70, 72), 5.04) && near(ejectionFraction(120, 50), 70 / 120));
  check('heart: rate from R-R interval', near(rateFromRR(0.8), 75) && near(rateFromRR(0.5), 120));
};
