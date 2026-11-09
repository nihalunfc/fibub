// #627 battery runtime and solar sizing. Checked against an independent Python calculation of the same formulas
// (5 runtime cases with W and A loads and Peukert exponents 1 to 1.25; 3 off-grid systems), plus hand checks.
import { runtime, solar } from '../../src/lib/sci/batsolar.ts';
export default async (check) => {
  const P = {"r": [[100, 12, 60, "W", 0.9, 0.5, 1.2, 20, {"simple": 8.999999999999998, "peuk": 8.81233526124879, "I": 5.555555555555556}], [50, 12.8, 5, "A", 1, 0.9, 1.05, 20, {"simple": 9.0, "peuk": 8.69342696032361, "I": 5.0}], [7, 12, 30, "W", 0.85, 0.8, 1.25, 20, {"simple": 1.9040000000000001, "peuk": 1.118288050860053, "I": 2.9411764705882355}], [200, 24, 1200, "W", 0.92, 0.5, 1.15, 10, {"simple": 1.8399999999999999, "peuk": 1.5837805157446152, "I": 54.34782608695652}], [2.6, 3.7, 1.5, "W", 0.95, 1, 1.0, 5, {"simple": 6.092666666666667, "peuk": 6.092666666666666, "I": 0.4267425320056899}]], "s": [[[["LED lights", 10, 5, 4], ["Fridge", 60, 10, 1], ["Laptop", 45, 4, 1], ["Phone charger", 10, 2, 2], ["Fan", 35, 6, 1]], 0.9, 4.5, 0.25, 0.9, 2, 0.5, 24, 400, 12, 100, 1.25, {"daily": 1230, "arr": 449.93141289437585, "panels": 2, "bankWh": 5466.666666666667, "bankAh": 227.7777777777778, "s": 2, "p": 3, "ctrl": 41.66666666666667}], [[["LED lights", 10, 5, 4], ["Fridge", 60, 10, 1], ["Laptop", 45, 4, 1], ["Phone charger", 10, 2, 2], ["Fan", 35, 6, 1]], 1.0, 5.5, 0.2, 0.95, 1, 0.8, 12, 300, 12.8, 100, 1.25, {"daily": 1230, "arr": 294.25837320574163, "panels": 1, "bankWh": 1537.5, "bankAh": 128.125, "s": 1, "p": 2, "ctrl": 31.25}], [[["LED lights", 10, 5, 4], ["Fridge", 60, 10, 1]], 0.85, 3.0, 0.3, 0.85, 3, 0.5, 48, 550, 12, 200, 1.25, {"daily": 800, "arr": 527.2697314219807, "panels": 1, "bankWh": 5647.058823529413, "bankAh": 117.64705882352943, "s": 4, "p": 1, "ctrl": 14.322916666666668}]]};
  const close = (a, b) => Math.abs(a - b) <= 1e-12 * Math.max(1, Math.abs(b));
  let ok = 0;
  for (const [capAh, V, load, loadUnit, eff, dod, peukert, ratedH, r] of P.r) { const x = runtime({ capAh, V, load, loadUnit, eff, dod, peukert, ratedH }); if (close(x.tSimple, r.simple) && close(x.tPeukert, r.peuk) && close(x.Ibat, r.I)) ok++; }
  check(`battery-solar-sizing: ${P.r.length} runtimes match Python`, ok === P.r.length);
  ok = 0;
  for (const c of P.s) {
    const [L, invEff, psh, losses, battEff, days, dod, Vsys, panelW, battV, battAh, safety, r] = c;
    const x = solar({ loads: L.map(([name, W, h, n]) => ({ name, W, h, n })), invEff, psh, losses, battEff, days, dod, Vsys, panelW, battV, battAh, safety });
    if (close(x.daily, r.daily) && close(x.arrayW, r.arr) && x.panels === r.panels && close(x.bankWh, r.bankWh) && close(x.bankAh, r.bankAh) && x.series === r.s && x.parallel === r.p && close(x.ctrlA, r.ctrl)) ok++;
  }
  check(`battery-solar-sizing: ${P.s.length} off-grid systems match Python`, ok === P.s.length);
  { const x = runtime({ capAh: 100, V: 12, load: 120, loadUnit: 'W', eff: 1, dod: 1, peukert: 1, ratedH: 20 }); check('battery-solar-sizing: 1200 Wh at 120 W is 10 h with k = 1', close(x.tSimple, 10) && close(x.tPeukert, 10) && close(x.rateC, 0.1)); }
  { const x = runtime({ capAh: 100, V: 12, load: 5, loadUnit: 'A', eff: 0.5, dod: 1, peukert: 1.3, ratedH: 20 }); check('battery-solar-sizing: at the rated current Peukert gives the rated time; A loads ignore efficiency', close(x.tPeukert, 20) && close(x.Ibat, 5)); }
  { const a = runtime({ capAh: 100, V: 12, load: 600, loadUnit: 'W', eff: 1, dod: 1, peukert: 1.2, ratedH: 20 }); check('battery-solar-sizing: high current shortens Peukert runtime', a.tPeukert < a.tSimple && a.capEff < 100); }
  let threw = false; try { solar({ loads: [{ name: 'x', W: 10, h: 30, n: 1 }], invEff: 0.9, psh: 4, losses: 0.2, battEff: 0.9, days: 1, dod: 0.5, Vsys: 12, panelW: 100, battV: 12, battAh: 100, safety: 1.25 }); } catch { threw = true; }
  check('battery-solar-sizing: more than 24 hours a day refused', threw);
};
