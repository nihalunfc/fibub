// #944 noise dose: the worked example in US OSHA 29 CFR 1910.95 Appendix A (110 dB for 1/4 h, 100 dB for 1/2 h,
// 90 dB for 1 1/2 h gives a dose of about 94 %), and an independent NumPy implementation for the other settings.
import { allowedHours, noiseDose, twaFromDose, doseFromTwa, lex8h, hoursLeft, parseExposures } from '../../src/lib/sci/phnoise.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const osha = { Lc: 90, q: 5, Lt: 90, Tc: 8 }, niosh = { Lc: 85, q: 3, Lt: 80, Tc: 8 };
  const r = noiseDose([{ label: 'a', L: 110, hours: 0.25 }, { label: 'b', L: 100, hours: 0.5 }, { label: 'c', L: 90, hours: 1.5 }], osha);
  check('OSHA Appendix A worked example: dose 93.75 % (≈ 94 %)', near(r.D, 93.75, 1e-12));
  check('OSHA example TWA 89.53 dB(A) = 16.61 lg(D/100) + 90', near(r.twa, 89.5344529780426, 1e-12) && Math.abs(r.twa - (16.61 * Math.log10(0.9375) + 90)) < 0.001);
  check('allowed time: 90 dB 8 h, 95 dB 4 h, 115 dB 0.25 h (5 dB exchange)', allowedHours(90, osha) === 8 && allowedHours(95, osha) === 4 && near(allowedHours(115, osha), 0.25));
  check('allowed time: 85 dB 8 h, 88 dB 4 h, 100 dB 15 min (3 dB exchange)', allowedHours(85, niosh) === 8 && near(allowedHours(88, niosh), 4) && near(allowedHours(100, niosh), 0.25));
  const ex = [{ label: 'Grinding', L: 95, hours: 1 }, { label: 'Assembly', L: 85, hours: 5 }, { label: 'Break', L: 70, hours: 1 }, { label: 'Forklift', L: 90, hours: 1 }];
  for (const [c, D, T] of [[niosh, 228.17713128869232, 88.57046262076511], [osha, 37.5, 82.92481250360578], [{ Lc: 85, q: 5, Lt: 80, Tc: 8 }, 137.5, 87.29715809318648], [{ Lc: 85, q: 3, Lt: -Infinity, Tc: 8 }, 228.56775628869232, 88.57786569722738]])
    check(`example day, ${c.Lc} dB / ${c.q} dB / threshold ${c.Lt}: dose ${D.toFixed(2)} %, TWA ${T.toFixed(2)} (NumPy)`, near(noiseDose(ex, c).D, D, 1e-12) && near(noiseDose(ex, c).twa, T, 1e-12));
  check('LEX,8h 88.57 dB(A) (NumPy) equals the 3 dB TWA with no threshold', near(lex8h(ex), 88.5683582678175, 1e-12) && Math.abs(lex8h(ex) - noiseDose(ex, { Lc: 85, q: 3, Lt: -Infinity, Tc: 8 }).twa) < 0.01);
  check('below-threshold rows add nothing', noiseDose(ex, niosh).parts[2].dose === 0 && !noiseDose(ex, niosh).parts[2].counted);
  check('TWA and dose invert each other', near(doseFromTwa(twaFromDose(137.5, osha), osha), 137.5, 1e-12));
  check('100 % dose ↔ TWA at the criterion level', near(twaFromDose(100, niosh), 85, 1e-12));
  check('time left at 95 dB after half a NIOSH dose: 0.397 h (NumPy)', near(hoursLeft(50, 95, niosh), 0.39685026299204984, 1e-12) && hoursLeft(120, 95, niosh) === 0);
  check('8-hour shift: Lavg equals TWA', near(noiseDose(ex, niosh).lavg, noiseDose(ex, niosh).twa, 1e-12));
  { const p = parseExposures('Task, level, minutes\nGrinding, 95, 60\n85\t300\nForklift; 90; 1:00\nbad, x, 5\n', 'min');
    check('parse: header skipped, labels, tabs, semicolons, h:mm', p.rows.length === 3 && p.rows[0].label === 'Grinding' && p.rows[1].hours === 5 && p.rows[2].hours === 1 && p.rows[1].label === 'Row 2' && p.bad.join() === '5'); }
  check('parse: hours unit', parseExposures('90 2.5', 'h').rows[0].hours === 2.5);
};
