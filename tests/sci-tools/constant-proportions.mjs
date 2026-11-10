// #1264 Law of constant proportions lab. Element masses checked against Python with IUPAC standard atomic weights
// (H 1.008, C 12.011, O 15.999, S 32.06, Fe 55.845, Mg 24.305): 18 g water → 2.0143 g H; O per g C in CO 1.33203,
// in CO2 2.66406; O per g S in SO2 0.99807; O per g Fe in Fe2O3 0.42973.
import { COMPOUNDS, byId, split, ratio, roundedRatio, PAIRS, multiple, reading, wholeRatio } from '../../src/lib/sci/constant-proportions.ts';

export default async (check) => {
  const near = (x, y, t = 1e-4) => Math.abs(x - y) <= t * Math.max(1, Math.abs(y));
  check('18 g water: 2.0143 g H (Python)', near(split(byId('water'), 18)[0].mass, 2.0143213988343045, 1e-6));
  check('element masses add up to the sample, for every compound', COMPOUNDS.every((c) => near(split(c, 37.5).reduce((s, e) => s + e.mass, 0), 37.5, 1e-12)));
  check('ratio does not depend on the sample size', COMPOUNDS.every((c) => { const a = ratio(split(c, 1).map((e) => e.mass)), b = ratio(split(c, 900).map((e) => e.mass)); return a.every((x, i) => near(x, b[i], 1e-12)); }));
  check('textbook ratios: water 1:8, CO2 3:8, MgO 3:2, NH3 14:3, NaCl 46:71, CaCO3 10:3:12', JSON.stringify(COMPOUNDS.map(roundedRatio)) === JSON.stringify([[1, 8], [3, 8], [3, 2], [14, 3], [46, 71], [10, 3, 12]]));
  const m = Object.fromEntries(PAIRS.map((p) => [p.formulas.join('/'), multiple(p)]));
  check('CO/CO2: 1.33203 and 2.66406 g O per g C, 1 : 2', near(m['CO/CO2'].per1[0], 1.3320289734410125) && near(m['CO/CO2'].per1[1], 2.664057946882025) && m['CO/CO2'].simple.join() === '1,2');
  check('SO2/SO3 2 : 3, N2O/NO/NO2 1 : 2 : 4, FeO/Fe2O3 2 : 3, H2O/H2O2 1 : 2', m['SO2/SO3'].simple.join() === '2,3' && m['N2O/NO/NO2'].simple.join() === '1,2,4' && m['FeO/Fe2O3'].simple.join() === '2,3' && m['H2O/H2O2'].simple.join() === '1,2' && near(m['FeO/Fe2O3'].per1[1], 0.4297340854149879));
  check('balance reading: 0.01 g steps, at most one step of wobble', reading(2.0143, 0) === 2.01 && reading(2.0143, 1) === 2.02 && reading(2.0143, -1) === 2);
  check('whole ratio finder', wholeRatio([1, 2.6667]).join() === '3,8' && wholeRatio([1, 1.414], 0.001) === null);
};
