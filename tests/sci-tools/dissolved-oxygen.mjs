// #841 Dissolved oxygen and plankton density. Checked 2026-11-09: solubility against gsw 3.6.23 O2sol_SP_pt on 2000
// random temperatures (−2 to 40 °C) and salinities (0 to 42): within 6e-13 µmol/kg; every unit through the pressure
// factor and density chain within 2e-15 (relative) of an independent NumPy version; density within 0.01 kg/m³ of
// TEOS-10 gsw.rho and 0.005 of Tanaka (2001) for pure water; fresh-water mg/L within 0.0021 mg/L of the separate
// Benson and Krause mg/L fit at 0.6 to 1.05 atm; Poisson limits against scipy chi2.ppf within 2e-12.
import { o2solKg, vapourAtm, pressureFactor, density, altitudeAtm, convert, saturation, satState, cellsPerLitre, fieldsVolume, perCubicMetre, towVolume, gammaP, poissonCI, lundPrecision } from '../../src/lib/sci/oxygen.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  check('oxygen: GSW O2sol_SP_pt(35, 10) = 274.5957 µmol/kg', near(o2solKg(10, 35), 274.5956644859288, 1e-12));
  check('oxygen: GSW O2sol_SP_pt(0, 10) = 352.8441, (35, 0) = 347.9029', near(o2solKg(10, 0), 352.8441227216508, 1e-12) && near(o2solKg(0, 35), 347.90287113148526, 1e-12));
  check('oxygen: pressure factor 1 at 1 atm, about P at other pressures', near(pressureFactor(15, 35, 1), 1, 1e-14) && Math.abs(pressureFactor(15, 35, 0.8) - 0.8) < 0.005);
  check('oxygen: water vapour 17 hPa at 15 °C', Math.abs(vapourAtm(15, 0) * 1013.25 - 17.04) < 0.05);
  check('oxygen: pure water density 999.10 at 15 °C, sea water 1025.97 at 15 °C S 35', Math.abs(density(15, 0) - 999.1016) < 1e-4 && Math.abs(density(15, 35) - 1025.97) < 0.01);
  check('oxygen: altitude 0 is 1 atm, 1500 m is about 0.83 atm', near(altitudeAtm(0), 1) && Math.abs(altitudeAtm(1500) - 0.8344) < 0.001);
  const s = saturation(15, 35, 1);
  check('oxygen: 15 °C, S 35: 247.8 µmol/kg, 8.13 mg/L, 5.69 mL/L', Math.abs(s.umolkg - 247.8) < 0.05 && Math.abs(s.mgL - 8.13) < 0.005 && Math.abs(s.mLL - 5.69) < 0.005);
  check('oxygen: units round trip', ['umolkg', 'umolL', 'mgL', 'mLL'].every((a) => ['umolkg', 'umolL', 'mgL', 'mLL'].every((b) => near(convert(convert(7.3, a, b, 12, 30), b, a, 12, 30), 7.3, 1e-12))));
  check('oxygen: 1 mL/L = 44.6596 µmol/L = 1.42905 mg/L', near(convert(1, 'mLL', 'umolL', 10, 0), 44.6596) && near(convert(1, 'mLL', 'mgL', 10, 0), 1.429053, 1e-6));
  const m = satState(230, 'umolkg', 15, 35, 1);
  check('oxygen: 230 µmol/kg at 15 °C S 35 is 92.8 % with AOU 17.8', Math.abs(m.pct - 92.8) < 0.05 && Math.abs(m.aou - 17.8) < 0.05);
  check('oxygen: saturated water has 100 % and AOU 0', near(satState(s.mgL, 'mgL', 15, 35, 1).pct, 100, 1e-12) && Math.abs(satState(s.mgL, 'mgL', 15, 35, 1).aou) < 1e-9);
  check('oxygen: warmer, saltier and higher all hold less', saturation(25, 35).umolkg < s.umolkg && saturation(15, 0).umolkg > s.umolkg && saturation(15, 35, 0.8).umolkg < s.umolkg);
  let bad = 0; for (const a of [[-5, 35, 1], [45, 35, 1], [10, -1, 1], [10, 50, 1], [10, 35, 0.3]]) { try { saturation(...a); } catch { bad++; } }
  check('oxygen: out-of-range inputs refused', bad === 5);
  check('oxygen: 230 cells in 1 mL, × 50 concentration = 4600 cells/L', near(cellsPerLitre(230, 1, 50), 4600));
  check('oxygen: fields volume 20 × 0.5 mm² × 1 mm = 0.01 mL', near(fieldsVolume(20, 0.5, 1), 0.01));
  check('oxygen: net tow 230 in 1/8 of the sample, 5 m³ = 368 per m³; 0.5 m net × 25 m = 4.909 m³', near(perCubicMetre(230, 1 / 8, 5), 368) && near(towVolume(0.5, 25), 4.908738521234052, 1e-12));
  let pb = 0; for (const f of [() => cellsPerLitre(-1, 1), () => cellsPerLitre(1, 0), () => perCubicMetre(1, 0, 1), () => perCubicMetre(1, 1.5, 1), () => perCubicMetre(1, 1, 0)]) { try { f(); } catch { pb++; } }
  check('oxygen: bad plankton inputs refused', pb === 5);
  check('oxygen: regularised gamma P(1, x) = 1 − e^−x', near(gammaP(1, 2), 1 - Math.exp(-2), 1e-12) && near(gammaP(5, 5), 0.5595067149347875, 1e-10));
  const [lo, hi] = poissonCI(230);
  check('oxygen: exact Poisson 95 % limits for 230 (scipy: 201.2339, 261.7244)', Math.abs(lo - 201.23385979121173) < 1e-8 && Math.abs(hi - 261.7244268017305) < 1e-8);
  check('oxygen: Poisson limits for 0 (0, 3.689) and 1 (0.0253, 5.572)', poissonCI(0)[0] === 0 && Math.abs(poissonCI(0)[1] - 3.68888) < 1e-4 && Math.abs(poissonCI(1)[0] - 0.025318) < 1e-5 && Math.abs(poissonCI(1)[1] - 5.571643) < 1e-5);
  check('oxygen: Lund precision ±10 % at 400', near(lundPrecision(400), 10) && lundPrecision(0) === Infinity);
};
