// #1299 Alloy mixer. Checked against Python: 65 % Cu / 35 % Zn brass by the mixing rule 1/ρ = Σ w/ρ has
// ρ = 8.2215 g/cm³; 22 carat = 91.67 % gold; 500 g of that brass holds 175 g zinc.
import { ALLOYS, DENSITY, percents, masses, density, carat, caratToPercent } from '../../src/lib/sci/alloy-school.ts';
export default async (check) => {
  const brass = ALLOYS.find((a) => a.id === 'brass');
  check('alloy: brass 8.2215 g/cm³ (Python)', Math.abs(density(brass.mix) - 8.221452930956824) < 1e-9);
  check('alloy: 500 g brass has 325 g Cu and 175 g Zn', Math.abs(masses(brass.mix, 500).Zn - 175) < 1e-9 && Math.abs(masses(brass.mix, 500).Cu - 325) < 1e-9);
  check('alloy: 22 carat is 91.67 % gold; the 22 carat recipe is 22.0 carat', Math.abs(caratToPercent(22) - 91.6667) < 1e-3 && Math.abs(carat(ALLOYS.find((a) => a.id === 'gold22').mix) - 22.008) < 1e-3);
  check('alloy: percentages are normalised', Math.abs(percents({ Cu: 2, Zn: 1 }).Cu - 66.6667) < 1e-3);
  let ok = true;
  for (const a of ALLOYS) { const p = Object.values(percents(a.mix)).reduce((s, x) => s + x, 0), d = density(a.mix), ds = Object.keys(a.mix).map((k) => DENSITY[k]); if (Math.abs(p - 100) > 1e-9 || !(d >= Math.min(...ds) - 1e-9 && d <= Math.max(...ds) + 1e-9)) ok = false; }
  check('alloy: every recipe adds to 100 % and its density lies between its metals', ok);
  check('alloy: pure metal keeps its own density', Math.abs(density({ Au: 1 }) - 19.3) < 1e-12);
};
