// #1228 Water cycle simulator. Tetens saturation vapour pressure checked against its published values (0.6108 kPa at
// 0 °C, about 3.17 kPa at 25 °C, about 7.38 kPa at 40 °C) and vapour density at saturation (about 23.0 g/m³ at 25 °C,
// 9.4 g/m³ at 10 °C). The box model is checked for conservation and for behaving as the science says.
import { GROUND, satVP, maxVapour, capacity, start, step, run, landWater } from '../../src/lib/sci/watercycle-j2.ts';

export default async (check) => {
  const near = (a, b, e) => Math.abs(a - b) <= e;
  check('water cycle: Tetens 0.611 kPa at 0 °C, 3.17 at 25 °C, 7.38 at 40 °C', near(satVP(0), 0.6108, 1e-9) && near(satVP(25), 3.168, 0.005) && near(satVP(40), 7.38, 0.02));
  check('water cycle: saturated air holds 23.0 g/m³ at 25 °C and 9.4 g/m³ at 10 °C', near(maxVapour(25), 23.0, 0.1) && near(maxVapour(10), 9.4, 0.1));
  check('water cycle: column capacity 30 mm at 25 °C and 17.2 mm at 16 °C', near(capacity(25), 30, 1e-9) && near(capacity(16), 17.22, 0.01));
  const p = { sun: 0.7, temp: 25, wind: 0.5, ground: 'forest' };
  let ok = true;
  for (const ground of Object.keys(GROUND)) for (const temp of [0, 15, 30, 40]) for (const wind of [0, 0.5, 1]) {
    const q = { ...p, ground, temp, wind }, s0 = start(temp), s = run(s0, q, 240);
    if (!near(landWater(s) - landWater(s0), s.fromSea - s.toSea, 1e-9) || !near(s.rain, s.runoff + s.soak, 1e-9) || [s.vapour, s.cloud, s.soil, s.river].some((x) => x < 0)) ok = false;
  }
  check('water cycle: water conserved, rain = runoff + soak, nothing negative (36 runs of 10 days)', ok);
  const d3 = run(start(25), p, 72);
  check('water cycle: page example after 3 days: rain 11.9, ran off 1.8, soaked in 10.1 mm', near(d3.rain, 11.9, 0.05) && near(d3.runoff, 1.8, 0.05) && near(d3.soak, 10.1, 0.05));
  const rain5 = (q) => run(start(q.temp), q, 120).rain;
  check('water cycle: hotter gives more rain', rain5({ ...p, temp: 35 }) > rain5(p) && rain5(p) > rain5({ ...p, temp: 15 }));
  check('water cycle: more wind and more sun give more rain', rain5({ ...p, wind: 1 }) > rain5(p) && rain5(p) > rain5({ ...p, wind: 0 }) && rain5({ ...p, sun: 1 }) > rain5(p));
  const city = run(start(25), { ...p, ground: 'city' }, 120), forest = run(start(25), p, 120);
  check('water cycle: city runs off 80%, forest 15%', near(city.runoff / city.rain, 0.8, 1e-9) && near(forest.runoff / forest.rain, 0.15, 1e-9) && forest.plants > city.plants);
  check('water cycle: no sun, no evaporation', step(start(25), { ...p, sun: 0 }).flows.evap === 0);
};
