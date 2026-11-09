// #199 MOI calculator. MOI, volumes, Poisson shares (exactly k, at least k) and the MOI for a target share were
// checked against an independent Python script (60-digit Decimal Poisson sums, bisection, NumPy random cases);
// the plate plan and the example by hand: 5e7 PFU/mL × 4 µL = 2e5 PFU on 2e5 cells is MOI 1.
import { infectiousTitre, moiFrom, volumeFor, pExactly, pAtLeast, moiForShare, poissonTable, platePlan, parseMois, EXAMPLE, LN2 } from '../../src/lib/sci/moi.ts';
import { num } from '../../src/lib/sci/num.ts';

const PY = {
  p3: [0.049787068367863944, 0.14936120510359183, 0.22404180765538775, 0.22404180765538775, 0.1680313557415408, 0.10081881344492448, 0.05040940672246224, 0.021604031452483817, 0.008101511794681432, 0.002700503931560477, 0.0008101511794681432, 0.00022095032167312995],
  sf3: [1.0, 0.950212931632136, 0.8008517265285442, 0.5768099188731565, 0.35276811121776874, 0.18473675547622792, 0.08391794203130346, 0.03350853530884121, 0.011904503856357388, 0.003802992061675957, 0.0011024881301154798, 0.00029233695064733654],
  sf: { '0.1_1': 0.09516258196404043, '0.1_2': 0.004678840160444469, '0.1_3': 0.00015465307026467164, '10_1': 0.9999546000702375, '10_5': 0.970747311923039, '10_20': 0.0034543419758568078, '25_40': 0.0034435687294270697, '0.01_1': 0.009950166250831947, '50_30': 0.999083171138544 },
  solve: { '0.9_1': 2.302585092994045, '0.99_1': 4.605170185988085, '0.5_1': 0.6931471805599452, '0.9_2': 3.889720169867429, '0.5_3': 2.67406031372356, '0.95_5': 9.153519026637571, '0.63_1': 0.9942522733438668 },
  rand: [[18.756613043473962, 36, 0.0001309575027705766, 0.00025928778712317623], [26.91744189107757, 0, 2.0412844148433624e-12, 1.0], [23.272813850453353, 19, 0.05994869935471342, 0.8389989068017096], [6.76396362781785, 32, 1.617024529929873e-12, 2.030068998403679e-12], [9.01198688448765, 5, 0.060403949257647235, 0.9454394178576933], [26.207867827433894, 31, 0.047252874873812585, 0.19799437840868828]],
};

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1e-300, Math.abs(b)) || Math.abs(a - b) < 1e-15;
  const thrown = (f) => { try { f(); return ''; } catch (e) { return e.message; } };
  // The example, by hand.
  const t = infectiousTitre(5e7, 'pfu');
  check('moi: 5e7 PFU/mL × 4 µL on 2e5 cells is MOI 1', near(moiFrom(2e5, t, 4), 1));
  check('moi: MOI 3 needs 12 µL', near(volumeFor(3, 2e5, t), 12));
  check('moi: TCID50 counted as ln 2 infectious units: 17.31 µL for MOI 3 (Python)', near(infectiousTitre(5e7, 'tcid50'), 5e7 * LN2) && near(volumeFor(3, 2e5, infectiousTitre(5e7, 'tcid50')), 17.312340490667562) && near(volumeFor(3, 2e5, infectiousTitre(5e7, 'tcid50', 1)), 12));
  check('moi: TU titre is used as it is; zero volume is MOI 0', infectiousTitre(3e6, 'tu') === 3e6 && moiFrom(1e5, 3e6, 0) === 0);
  // Poisson at MOI 3 against Python.
  check('poisson: exactly k at MOI 3, k = 0 to 11 (Python)', PY.p3.every((p, k) => near(pExactly(3, k), p, 1e-12)));
  check('poisson: at least k at MOI 3, k = 0 to 11 (Python)', PY.sf3.every((p, k) => near(pAtLeast(3, k), p, 1e-11)));
  check('poisson: at least k, small and large MOIs, both tails (Python)', Object.entries(PY.sf).every(([key, p]) => { const [m, k] = key.split('_').map(Number); return near(pAtLeast(m, k), p, 1e-10); }));
  check('poisson: random MOIs and k (NumPy draw, Python)', PY.rand.every(([m, k, pe, pa]) => near(pExactly(m, k), pe, 1e-11) && near(pAtLeast(m, k), pa, 1e-10)));
  check('poisson: by hand, MOI 1 leaves e⁻¹ = 36.8 % uninfected', near(pExactly(1, 0), Math.exp(-1)) && near(pAtLeast(1, 1), 1 - Math.exp(-1)) && pExactly(0, 0) === 1 && pAtLeast(0, 1) === 0);
  // MOI for a target share.
  check('target: 90 %, 99 %, 50 % with at least 1 (−ln(1 − f), Python)', near(moiForShare(0.9), PY.solve['0.9_1']) && near(moiForShare(0.99), PY.solve['0.99_1']) && near(moiForShare(0.5), LN2) && near(moiForShare(0.63), PY.solve['0.63_1']));
  check('target: at least 2, 3 and 5 particles by bisection (Python)', near(moiForShare(0.9, 2), PY.solve['0.9_2'], 1e-10) && near(moiForShare(0.5, 3), PY.solve['0.5_3'], 1e-10) && near(moiForShare(0.95, 5), PY.solve['0.95_5'], 1e-10));
  check('target: errors for 0 %, 100 % and k = 0', /above 0 %/.test(thrown(() => moiForShare(1))) && /above 0 %/.test(thrown(() => moiForShare(0))) && /whole number/.test(thrown(() => moiForShare(0.5, 0))));
  // Table rows add up and stop at a sensible K.
  const tab = poissonTable(3);
  check('table: MOI 3 has rows 0 to 10 and "11 or more", adding up to 100 %', tab.length === 12 && tab[11].last && tab[11].k === 11 && near(tab.reduce((s, r) => s + r.exactly, 0), 1, 1e-12) && near(tab[11].exactly, PY.sf3[11], 1e-10));
  check('table: MOI 0.1 keeps the 4 rows minimum; MOI 30 stops at 40', poissonTable(0.1).length === 5 && poissonTable(30).at(-1).k === 40);
  // Plate plan, by hand: 3 wells × 200 µL × 1.1 = 660 µL of each mix.
  const plan = platePlan({ mois: [0, 0.01, 0.1, 1, 10], cells: 2e5, titrePerMl: 5e7, wells: 3, inocUl: 200, spare: 10, minUl: 2 });
  check('plate: 660 µL mix per MOI; MOI 0 is a mock', plan.every((r) => near(r.totalUl, 660)) && plan[0].virusUl === 0 && plan[0].mediumUl === 660 && /mock/.test(plan[0].warn));
  check('plate: MOI 10 = 132 µL stock + 528 µL medium, 1e7 PFU/mL working, 2e6 PFU per well', plan[4].predil === 1 && near(plan[4].virusUl, 132) && near(plan[4].mediumUl, 528) && near(plan[4].workPerMl, 1e7) && near(plan[4].perWell, 2e6));
  check('plate: MOI 1 = 13.2 µL stock', plan[3].predil === 1 && near(plan[3].virusUl, 13.2) && near(plan[3].mediumUl, 646.8) && plan[3].preStockUl === 0);
  check('plate: MOI 0.1 = 13.2 µL of a 1 : 10 predilution (2 + 18 µL)', plan[2].predil === 10 && near(plan[2].virusUl, 13.2) && near(plan[2].preStockUl, 2) && near(plan[2].preMediumUl, 18));
  check('plate: MOI 0.01 = 13.2 µL of a 1 : 100 predilution (2 + 198 µL)', plan[1].predil === 100 && near(plan[1].virusUl, 13.2) && near(plan[1].preStockUl, 2) && near(plan[1].preMediumUl, 198) && plan.slice(1).every((r) => r.ok && !r.warn));
  check('plate: % infected is 1 − e^(−MOI)', near(plan[3].infected, 1 - Math.exp(-1)) && near(plan[4].infected, PY.sf['10_1'], 1e-12) && near(plan[1].infected, PY.sf['0.01_1'], 1e-12));
  const weak = platePlan({ mois: [500], cells: 2e5, titrePerMl: 5e7, wells: 3, inocUl: 200, spare: 10, minUl: 2 });
  check('plate: a stock too weak for MOI 500 is flagged (needs 2000 µL per well)', !weak[0].ok && /too weak/.test(weak[0].warn) && /2000 µL/.test(weak[0].warn));
  const big = platePlan({ mois: [1e-5], cells: 1e3, titrePerMl: 1e10, wells: 1, inocUl: 10, spare: 0, minUl: 2 });
  check('plate: a volume still too small after a 1 : 1000 predilution warns', big[0].ok && big[0].predil === 1000 && /below your 2.00 µL/.test(big[0].warn) && /1 : 1000 steps/.test(big[0].warn));
  check('plate: bad input errors', /whole number/.test(thrown(() => platePlan({ ...EXP(), wells: 1.5 }))) && /at least one MOI/.test(thrown(() => platePlan({ ...EXP(), mois: [] }))) && /cells/.test(thrown(() => platePlan({ ...EXP(), cells: 0 }))) && /Spare/.test(thrown(() => platePlan({ ...EXP(), spare: -1 }))));
  check('moi: bad input errors', /cells/.test(thrown(() => moiFrom(0, 1, 1))) && /titre/.test(thrown(() => infectiousTitre(NaN, 'pfu'))) && /volume/.test(thrown(() => moiFrom(1, 1, -1))) && /target MOI/.test(thrown(() => volumeFor(-2, 1, 1))));
  const pm = parseMois('0.1, 1;10\n 5e-2 abc', num);
  check('parse: MOI list with commas, semicolons, new lines and an error', pm.mois.join('|') === '0.1|1|10|0.05' && pm.bad.join() === 'abc');
  check('example: values are the ones the guide uses', EXAMPLE.cells === '2e5' && EXAMPLE.titre === '5e7' && EXAMPLE.volUl === '4' && EXAMPLE.moi === '3');
};
const EXP = () => ({ mois: [1], cells: 2e5, titrePerMl: 5e7, wells: 3, inocUl: 200, spare: 10, minUl: 2 });
