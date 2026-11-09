// #1122 Photosynthesis lab. The rates were checked against a separate Python version of the same Blackman
// model (40 random lamp distances, CO2 levels and temperatures, rounded to 1e-9), and these hand-worked cases:
// lamp 20 cm gives 25 light units (inverse square); 25 units, 0.25 % CO2, 25 °C is light-limited at 15 bubbles/min
// gross and 13 net; full light, 0.1 % CO2 at 30 °C is CO2-limited at 12; full light, 1 % at 40 °C is
// temperature-limited at 16.67. Poisson counts were checked for mean and variance over 20 000 draws.
import { lightAt, tempFactor, rate, compensation, poisson, respAt } from '../../src/lib/sci/photolab.ts';
const rng = (seed) => { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; };

const PY = [[25.0, 0.3, 10, 12.5, 11.792893219, "temperature"], [11.11111111111111, 0, 40, 4.0, 0, "co2"], [2.0408163265306123, 0.2, 35, 1.224489796, 0, "light"], [16.000000000000004, 0, 40, 4.0, 0, "co2"], [100.0, 1, 35, 33.333333333, 29.333333333, "temperature"], [4.000000000000001, 0.3, 5, 2.4, 1.9, "light"], [2.0408163265306123, 0.1, 20, 1.224489796, 0, "light"], [44.44444444444444, 0.1, 5, 8.838834765, 8.338834765, "temperature"], [100.0, 0, 45, 0, 0, "temperature"], [100.0, 0.2, 20, 20.0, 18.585786438, "co2"], [4.000000000000001, 0.5, 5, 2.4, 1.9, "light"], [1.0000000000000002, 0.05, 40, 0.6, 0, "light"], [2.0408163265306123, 0.3, 20, 1.224489796, 0, "light"], [6.25, 0.05, 20, 3.75, 2.335786438, "light"], [2.0408163265306123, 0.1, 5, 1.224489796, 0.724489796, "light"], [4.000000000000001, 1, 45, 0, 0, "temperature"], [44.44444444444444, 0.05, 25, 8.0, 6.0, "co2"], [44.44444444444444, 0.5, 30, 26.666666667, 23.838239542, "light"], [1.0000000000000002, 0.2, 45, 0, 0, "temperature"], [16.000000000000004, 0.1, 25, 9.6, 7.6, "light"], [2.0408163265306123, 1, 45, 0, 0, "temperature"], [4.000000000000001, 0.3, 5, 2.4, 1.9, "light"], [2.0408163265306123, 0.05, 35, 1.224489796, 0, "light"], [4.000000000000001, 0.5, 15, 2.4, 1.4, "light"], [6.25, 0.3, 30, 3.75, 0.921572875, "light"], [44.44444444444444, 0.2, 45, 0, 0, "temperature"], [44.44444444444444, 1, 15, 17.67766953, 16.67766953, "temperature"], [1.0000000000000002, 1, 35, 0.6, 0, "light"], [6.25, 0.2, 5, 3.75, 3.25, "light"], [2.0408163265306123, 0, 25, 1.224489796, 0, "light"], [4.000000000000001, 0.5, 15, 2.4, 1.4, "light"], [25.0, 0.3, 20, 15.0, 13.585786438, "light"], [100.0, 1, 20, 25.0, 23.585786438, "temperature"], [1.0000000000000002, 1, 45, 0, 0, "temperature"], [16.000000000000004, 0.2, 45, 0, 0, "temperature"], [6.25, 1, 50, 0, 0, "temperature"], [6.25, 0.2, 25, 3.75, 1.75, "light"], [1.0000000000000002, 0.3, 5, 0.6, 0.1, "light"], [4.000000000000001, 1, 45, 0, 0, "temperature"], [25.0, 0.3, 45, 0, 0, "temperature"]];

export default async (check) => {
  const near = (a, b, t = 1e-6) => Math.abs(a - b) <= t;
  check('photo: inverse square law', near(lightAt(10), 100) && near(lightAt(20), 25) && near(lightAt(30), 100 / 9));
  check('photo: matches the Python model on 40 cases', PY.every(([I, c, t, g, n, lim]) => { const r = rate(I, c, t); return near(r.gross, g, 1e-8) && near(r.net, n, 1e-8) && r.limit === lim; }));
  { const r = rate(25, 0.25, 25); check('photo: dim light is the limit', near(r.gross, 15) && near(r.net, 13) && r.limit === 'light'); }
  { const r = rate(100, 0.1, 30); check('photo: low CO2 is the limit', near(r.gross, 12) && r.limit === 'co2'); }
  { const r = rate(100, 1, 40); check('photo: heat is the limit above the optimum', near(r.gross, 50 / 3) && r.limit === 'temperature'); }
  check('photo: temperature factor', near(tempFactor(30), 1) && near(tempFactor(20), 0.5) && near(tempFactor(37.5), 0.5) && tempFactor(45) === 0 && tempFactor(60) === 0);
  check('photo: no bubbles in the dark', rate(0, 0.5, 25).net === 0 && rate(0, 0.5, 25).gross === 0);
  check('photo: compensation point', near(compensation(25), 2 / 0.6) && near(rate(compensation(25), 1, 25).net, 0) && near(respAt(35), 4));
  const r = rng(11), xs = Array.from({ length: 20000 }, () => poisson(7.5, r));
  const m = xs.reduce((s, v) => s + v, 0) / xs.length, v = xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length;
  check('photo: Poisson counts have mean and variance near 7.5', near(m, 7.5, 0.1) && near(v, 7.5, 0.3) && poisson(0, r) === 0);
  const big = Array.from({ length: 5000 }, () => poisson(100, r)); const mb = big.reduce((s, x) => s + x, 0) / big.length;
  check('photo: large means use the normal approximation', near(mb, 100, 0.6));
};
