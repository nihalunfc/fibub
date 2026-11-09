// #1102 Lewis structures. Checked against the Lewis structures, formal charges and resonance forms found in
// general chemistry texts for 29 molecules and ions: valence electron totals, bond orders (N≡N, O=C=O, H–C≡N,
// C≡O with C −1 and O +1), formal charges (O₃ centre +1, NH₄⁺ N +1, octet SO₄²⁻ S +2), 3 resonance forms for NO₃⁻
// and CO₃²⁻ (average bond order 4/3), 2 for O₃, SO₂ and HNO₃, incomplete octet for BF₃, expanded octets for PCl₅,
// SF₆ and XeF₄, and the odd electron in NO₂.
import { EXAMPLES, solve, evaluate, averageOrders, star, totalValence, fcText } from '../../src/lib/sci/lewis.ts';

export default async (check) => {
  const S = (id, ex = false) => solve(EXAMPLES.find((e) => e.id === id), ex);
  const one = (id, ex) => S(id, ex).forms[0];
  const fc = (id, ex) => one(id, ex).fc.map(fcText).join(',');
  check('lewis: valence totals', ['h2o:8', 'co2:16', 'no3:24', 'co3:24', 'so4:32', 'nh4:8', 'no2:17', 'xef4:36', 'pcl5:40', 'cn:10'].every((s) => { const [id, v] = s.split(':'); return totalValence(EXAMPLES.find((e) => e.id === id)) === +v; }));
  check('lewis: N2 triple, O2 double, Cl2 single', one('n2').orders[0] === 3 && one('o2').orders[0] === 2 && one('cl2').orders[0] === 1 && one('n2').lone.join() === '2,2');
  check('lewis: CO2 O=C=O, no charges', one('co2').orders.join() === '2,2' && fc('co2') === '0,0,0' && S('co2').forms.length === 1);
  check('lewis: HCN H–C≡N', one('hcn').orders.join() === '1,3' && one('hcn').lone.join() === '0,0,2');
  check('lewis: CO triple with C −1, O +1', one('co').orders[0] === 3 && fc('co') === '−1,+1');
  check('lewis: CN⁻ triple, C −1', one('cn').orders[0] === 3 && fc('cn') === '−1,0');
  check('lewis: H2O, NH3 lone pairs', one('h2o').lone[0] === 4 && one('nh3').lone[0] === 2 && one('ch4').lone[0] === 0);
  check('lewis: ethene C=C, ethyne C≡C, methanal C=O', one('c2h4').orders[0] === 2 && one('c2h2').orders[1] === 3 && one('ch2o').orders[0] === 2);
  check('lewis: O3 two resonance forms, centre +1', S('o3').forms.length === 2 && one('o3').fc[0] === 1 && one('o3').fc.reduce((a, b) => a + b, 0) === 0);
  const no3 = S('no3');
  check('lewis: NO3⁻ three resonance forms, N +1, average bond order 4/3', no3.forms.length === 3 && no3.forms.every((f) => f.fc[0] === 1) && averageOrders(no3.forms).every((o) => Math.abs(o - 4 / 3) < 1e-12));
  check('lewis: CO3²⁻ three forms, charges add to −2', S('co3').forms.length === 3 && one('co3').fc.reduce((a, b) => a + b, 0) === -2);
  check('lewis: SO2 octet two forms; expanded one form O=S=O', S('so2').forms.length === 2 && S('so2', true).forms.length === 1 && S('so2', true).forms[0].orders.join() === '2,2');
  check('lewis: SO4²⁻ octet S +2; expanded S 0 with 6 forms, average 1.5', fc('so4') === '+2,−1,−1,−1,−1' && S('so4', true).forms.length === 6 && one('so4', true).fc[0] === 0 && averageOrders(S('so4', true).forms).every((o) => Math.abs(o - 1.5) < 1e-12));
  check('lewis: NH4⁺ N +1', fc('nh4') === '+1,0,0,0,0');
  check('lewis: HNO3 two forms', S('hno3').forms.length === 2 && one('hno3').fc[0] === 1);
  check('lewis: N2O main form N≡N–O, minor N=N=O', one('n2o').orders.join() === '3,1' && S('n2o').others.some((f) => f.orders.join() === '2,2'));
  check('lewis: BF3 incomplete octet, no charges', one('bf3').orders.join() === '1,1,1' && one('bf3').shell[0] === 6 && fc('bf3') === '0,0,0,0');
  check('lewis: NO2 radical with 7 on N', one('no2').shell[0] === 7 && S('no2').forms.length === 2);
  check('lewis: PCl5 10, SF6 12, XeF4 12 electrons on the centre', one('pcl5').shell[0] === 10 && one('sf6').shell[0] === 12 && one('xef4').shell[0] === 12 && one('xef4').lone[0] === 4);
  const all = EXAMPLES.every((m) => S(m.id).forms.length > 0 && S(m.id).forms.every((f) => f.fc.reduce((a, b) => a + b, 0) === m.charge));
  check(`lewis: all ${EXAMPLES.length} examples solve and formal charges add up to the charge`, all && EXAMPLES.every((m) => S(m.id).forms[0].fc.reduce((a, b) => a + b, 0) === m.charge));
  // Hand-placed bonds: problems are reported.
  const h2o = EXAMPLES.find((e) => e.id === 'h2o'), co2 = EXAMPLES.find((e) => e.id === 'co2');
  check('lewis: C with only single bonds in CO2 is short of an octet', evaluate(co2, [1, 1]).problems.some((p) => p.includes('C (atom 1) has only 4')));
  check('lewis: C with triple + double has 10, impossible', evaluate(co2, [3, 2]).problems.some((p) => p.includes('more than 8 is impossible')));
  check('lewis: good water', evaluate(h2o, [1, 1]).ok);
  const ccl4 = star('x', 'CCl₄', 'C', ['Cl', 'Cl', 'Cl', 'Cl']);
  check('lewis: built CCl4', solve(ccl4).forms[0].fc.every((f) => f === 0) && solve(ccl4).valence === 32);
  check('lewis: impossible skeleton gives no forms', solve(star('x', 'CH₅', 'C', ['H', 'H', 'H', 'H', 'H'])).forms.length === 0);
};
