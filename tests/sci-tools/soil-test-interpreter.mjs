// #382 soil test interpreter: lime from charge balance, checked against an independent Python sum (moles of H+
// in the layer, CaCO3 + 2H+ -> Ca2+ + CO2 + H2O, CaCO3 100.087 g/mol) and hand-worked numbers.
import { limeNeed, ecce, productFor, soilMass, caco3ForCharge, TON_AC_PER_T_HA, parseRanges, rate, EXAMPLE_RANGES } from '../../src/lib/sci/soiltest.ts';

export default async (check) => {
  const near = (a, b, rel = 1e-4) => Math.abs(a - b) <= rel * Math.max(1, Math.abs(b));
  check('soil: 15 cm at 1.3 g/cm³ is 1,950 t/ha of soil', near(soilMass(15, 1.3), 1950, 1e-12));
  check('soil: 1 cmol(+)/kg in 1,000 t/ha needs 500.4 kg CaCO3', near(caco3ForCharge(1, 1000), 500.43));
  { const r = limeNeed({ method: 'bs', cec: 15, bsNow: 60, bsTarget: 80, depthCm: 15, bulkDensity: 1.3 });
    check('soil: base saturation 60 -> 80 % at CEC 15 needs 2,927.5 kg/ha CaCO3 (Python 2927.54)', near(r.charge, 3, 1e-12) && near(r.caco3, 2927.5418)); }
  check('soil: ECCE 95 % CCE × 85 % fineness = 80.75 %', near(ecce(95, 85), 80.75, 1e-12));
  check('soil: product for 2,927.5 kg CaCO3 at ECCE 80.75 % is 3,625.4 kg (Python 3625.44)', near(productFor(2927.5418, 80.75), 3625.4388));
  check('soil: moisture raises the product weight (10 % water)', near(productFor(1000, 100, 10), 1111.111));
  { const r = limeNeed({ method: 'buffer', ph: 5.6, target: 6.5, bufferCap: 2.5, depthCm: 15, bulkDensity: 1.3 });
    check('soil: buffer capacity 2.5 cmol/kg per pH, 5.6 -> 6.5, needs 2,195.7 kg/ha (Python 2195.66)', near(r.caco3, 2195.6564)); }
  { const r = limeNeed({ method: 'factor', ph: 5.6, target: 6.5, factor: 2, refDepthCm: 15, depthCm: 20 });
    check('soil: lime factor 2 t/ha per pH unit for 15 cm, scaled to 20 cm: 2,400 kg/ha', near(r.caco3, 2400, 1e-12)); }
  check('soil: no lime when pH is above the target', limeNeed({ method: 'buffer', ph: 7, target: 6.5, bufferCap: 2, depthCm: 15, bulkDensity: 1.3 }).caco3 === 0);
  check('soil: 1 t/ha = 0.44609 short tons/ac', near(TON_AC_PER_T_HA, 0.4460896, 1e-6));
  { const { rows, bad } = parseRanges(EXAMPLE_RANGES + '\nnonsense line');
    check('soil: example ranges parse (6 rows, 1 bad line)', rows.length === 6 && bad.length === 1 && rows[0].name === 'Phosphorus (P)' && rows[0].unit === 'mg/kg' && rows[4].value === 1.4);
    const r = rows.map(rate);
    check('soil: ratings low / ok / low / ok / ok / low', r.map((x) => x.cls).join() === 'low,ok,low,ok,ok,low');
    check('soil: P 12 is 60 % of the bottom of 20-40', r[0].text === 'Low, 60 % of the bottom' && near(r[1].pct, (100 * 30) / 130)); }
  check('soil: above the range is high', rate({ name: 'x', value: 50, low: 10, high: 40, unit: '' }).text === 'High, 125 % of the top');
  check('soil: tab-separated rows with decimal commas, and plain commas', parseRanges('Zn\t1,5\t1\t3\tmg/kg').rows[0]?.value === 1.5 && parseRanges('Zn,1.5,1,3').rows[0]?.high === 3);
};
