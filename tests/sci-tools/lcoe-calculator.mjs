// #676 LCOE. Reference values from a separate NumPy calculation (vectorised discounting, written for this check) on the
// three made-up example plants and five random input sets, plus the capital-recovery-factor identity.
import { lcoe, crf, tornado, EXAMPLES } from '../../src/lib/sci/eng-lcoe.ts';
const REF = {"ex": {"solar": [52.04248523654033, 1139583.9498838657, 59306780.88762939], "wind": [53.135573065640585, 3512041.4055285035, 186614332.71301484], "gas": [71.05243784364365, 23914704.16885248, 1699198031.5065162]}, "rnd": [{"v": [402.6964589489447, 4097.32171176152, 41.22604488337136, 2.858013800881416, 0.6471684285798771, 4.2170576886407005, 0.4267785643359989, 0.00045275193902445166, 0.005850925287260167, 11, 0.01957107334763963], "r": 121.74051969619782}, {"v": [118.02059063324215, 2344.2534954581674, 77.93489546074044, 8.976776081085488, 10.130772451304892, 4.31645130768256, 0.4944184149853941, 0.00676689351831066, 0.007296325554966727, 49, 0.016667883507621703], "r": 123.32217087498435}, {"v": [136.45435066052067, 4434.360514674134, 5.137154984975281, 6.79181533021365, 10.441062027930041, 2.5005037767699894, 0.8163585915313009, 0.00872195468024335, 0.00222206612042529, 40, 3.5990507604859444e-05], "r": 52.85937101180398}, {"v": [252.17861881127857, 2352.335145225568, 16.26022688916518, 3.2494264457560607, 9.674583972324523, 3.4809729614493916, 0.21923086682684467, 0.006985119903183108, 0.05382529209124514, 36, 0.023968184728894018], "r": 146.8015515758449}, {"v": [118.52271219577955, 1802.9878752959455, 63.99036208439627, 5.070681389233913, 6.076620017058851, 2.5981354123544986, 0.11162902429105062, 0.009332239002254336, 0.010299094930419595, 42, 0.011036422167345501], "r": 186.58021952950315}]};
const keys = ['mw', 'capex', 'fom', 'vom', 'fuelPrice', 'heatRate', 'cf', 'degr', 'rate', 'life', 'esc'];
export default async (check) => {
  const rel = (a, b, t = 1e-10) => Math.abs(a - b) <= t * Math.abs(b);
  for (const k of ['solar', 'wind', 'gas']) {
    const r = lcoe(EXAMPLES[k].p), [L, E, C] = REF.ex[k];
    check(`lcoe: ${k} example matches NumPy (${r.lcoe.toFixed(3)} per MWh)`, rel(r.lcoe, L) && rel(r.pvMwh, E) && rel(r.pvCost, C));
    check(`lcoe: ${k} parts add up to the LCOE`, rel(r.parts.capex + r.parts.fom + r.parts.vom + r.parts.fuel, r.lcoe, 1e-12));
    check(`lcoe: ${k} cash-flow table sums to the present values`, rel(r.years.reduce((s, y) => s + y.pvCost, 0), r.pvCost, 1e-12) && r.years.length === EXAMPLES[k].p.life + 1);
  }
  REF.rnd.forEach((x, i) => { const p = Object.fromEntries(keys.map((k, j) => [k, x.v[j]])); check(`lcoe: random input set ${i + 1} matches NumPy`, rel(lcoe(p).lcoe, x.r)); });
  check('lcoe: capital recovery factor (8 %, 20 years) = 0.1018522', rel(crf(0.08, 20), 0.10185220882315059, 1e-12) && rel(crf(0, 10), 0.1, 1e-15));
  { const p = { mw: 10, capex: 2000, fom: 30, vom: 5, fuelPrice: 4, heatRate: 9, cf: 0.5, degr: 0, rate: 0.08, life: 20, esc: 0 }, r = lcoe(p);
    check(`lcoe: no degradation or escalation equals the annuity formula (${r.lcoe.toFixed(4)})`, rel(r.lcoe, r.simple, 1e-12) && rel(r.lcoe, 94.3571729786076, 1e-12)); }
  { const p = { ...EXAMPLES.solar.p, rate: 0 }, r = lcoe(p); const E = r.totalMwh;
    check('lcoe: zero discount rate = total cost / total energy', rel(r.lcoe, (p.capex * 50000 + p.fom * 50000 * 30) / E, 1e-12)); }
  const bars = tornado(EXAMPLES.gas.p, 0.2);
  check(`lcoe: tornado sorted by swing, fuel-related bars first for gas (${bars.slice(0, 2).map((b) => b.name).join(', ')})`, bars.every((b, i) => i === 0 || b.swing <= bars[i - 1].swing) && ['Fuel price', 'Heat rate', 'Capacity factor'].includes(bars[0].name));
  check('lcoe: tornado skips zero inputs (no fuel bar for solar)', !tornado(EXAMPLES.solar.p).some((b) => b.key === 'fuelPrice' || b.key === 'vom'));
  { const b = tornado(EXAMPLES.solar.p).find((x) => x.key === 'capex'); const base = lcoe(EXAMPLES.solar.p).lcoe;
    check('lcoe: capital cost bar brackets the base value', b.low < base && b.high > base && rel(b.high - base, base - b.low, 1e-9)); }
  { const b = tornado({ ...EXAMPLES.solar.p, cf: 0.9 }).find((x) => x.key === 'cf'); check('lcoe: capacity factor capped at 100 %', b.highIn === 1); }
};
