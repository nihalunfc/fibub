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
  // Blog: /blog/discoveries/largemouth-bass-aquaponic-stocking-density-biomass-fcr/ (Birolo et al. 2025, Fishes).
  // 500 L tanks, bass of 109 g, 176 days, daily gains 0.69, 0.61 and 0.50 g/day, survival 73.9 %.
  {
    const V6 = volume({ kind: 'volume', V: 0.5 }), w0 = 109, days = 176;
    const sg = [0.69, 0.61, 0.5].map((g) => +sgr(w0, w0 + g * days, days).toFixed(3));
    check(`stock: the paper's three daily gains give SGR 0.425, 0.390, 0.336 %/day (${sg.join()})`, sg.join() === '0.425,0.39,0.336');
    check('stock: 28 fish of 109 g in 500 L = 6.10 kg/m³, the most 6.2 allows', near(biomass(28, w0) / V6, 6.104, 1e-3) && maxFish(6.2, V6, w0) === 28 && maxFish(3.1, V6, w0) === 14 && maxFish(4.1, V6, w0) === 18);
    const lossMonth = 100 * (1 - Math.pow(0.739, 30 / days));
    const d6 = project({ count: 28, w0, sgr: sgr(w0, w0 + 0.5 * days, days), lossPct: lossMonth, feedPct: 0.605, V: V6, days, step: 30 }).at(-1);
    check(`stock: D6 reaches 197.0 g, 8.15 kg/m³ and 3.77 kg of feed on day 176 (${d6.w.toFixed(1)}, ${d6.density.toFixed(2)}, ${d6.feedCum.toFixed(2)})`,
      near(d6.w, 197, 1e-9) && near(d6.density, 8.152648, 1e-6) && near(d6.feedCum, 3.768852, 1e-6) && near(d6.n, 20.692, 1e-3));
    check('stock: D6 FCR is 1.71 with the dead fish counted and 3.47 without', near(fcr(3.77, 3.052, 4.137, 1.12), 1.709751, 1e-6) && near(fcr(3.77, 3.052, 4.137), 3.474654, 1e-6));
    check('stock: 109 g reaches 400 g after 306, 334 and 387 days', [0.69, 0.61, 0.5].map((g) => Math.round(daysTo(w0, 400, sgr(w0, w0 + g * days, days)))).join() === '306,334,387');
  }
};
