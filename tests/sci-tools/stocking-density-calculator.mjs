// #401 Stocking density and FCR: volumes, density, FCR, SGR and the projection checked against an independent
// Python version (numpy; cumulative feed by scipy.integrate.quad).
import { volume, biomass, maxFish, fcr, sgr, daysTo, lossRate, project } from '../../src/lib/sci/aquastock.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const V = volume({ kind: 'round', d: 4, D: 1.2 });
  check('stock: round tank 4 m × 1.2 m = 15.0796 m³', near(V, 15.079644737231007, 1e-12) && volume({ kind: 'rect', L: 10, W: 5, D: 1.5 }) === 75 && volume({ kind: 'volume', V: 8 }) === 8);
  check('stock: biomass and density (11.9366 kg/m³)', biomass(1500, 120) === 180 && near(biomass(1500, 120) / V, 11.93662073189215, 1e-12));
  check('stock: max fish at 40 kg/m³ = 5026', maxFish(40, V, 120) === 5026 && maxFish(10, 1, 100) === 100);
  check('stock: FCR 140 / (176.4 − 60 + 3) = 1.17253', near(fcr(140, 60, 176.4, 3), 1.1725293132328307, 1e-12) && Number.isNaN(fcr(10, 50, 40)));
  const s = sgr(40, 120, 60);
  check('stock: SGR 100·ln 3 / 60 = 1.83102 %/day', near(s, 1.8310204811135162, 1e-12));
  check('stock: days from 120 g to 400 g = 65.754', near(daysTo(120, 400, s), 65.75419645736308, 1e-12));
  check('stock: 1 % lost per month as a daily rate', near(1 - Math.exp(-30 * lossRate(1)), 0.01, 1e-12));
  const r = project({ count: 1500, w0: 120, sgr: s, lossPct: 1, feedPct: 2, V, days: 70, step: 7 });
  const e = r.at(-1);
  check('stock: projection rows every 7 days', r.length === 11 && r[0].day === 0 && r[0].feedCum === 0 && r[0].kg === 180);
  check('stock: day 70 as Python (432.337 g, 1465.23 fish, 633.475 kg, 42.0086 kg/m³)', near(e.w, 432.33730386336106, 1e-12) && near(e.n, 1465.2330736405286, 1e-12) && near(e.kg, 633.4749165891717, 1e-12) && near(e.density, 42.00861012495532, 1e-12) && near(e.feedDay, 12.669498331783434, 1e-12));
  check('stock: cumulative feed as scipy quad (504.556 kg)', near(e.feedCum, 504.55636392707464, 1e-10));
  { const z = project({ count: 100, w0: 10, sgr: 0, lossPct: 0, feedPct: 3, V: 1, days: 10, step: 3 }); check('stock: no growth, no loss, last day added', z.map((x) => x.day).join() === '0,3,6,9,10' && near(z.at(-1).feedCum, 0.03 * 1 * 10, 1e-12)); }
};
