// Class 8 Science, Chapter 13 Our Home: Earth: live problems (original fibub questions). Ids start with c8s-earth-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c8s-earth-liquid': {
    title: 'liquid fresh water in a sample of Earth\'s water',
    make(r) {
      const T = choose(r, [1000, 2000, 5000, 10000]), answer = T * 0.03 * 0.31;
      return { T, q: `<p>Imagine ${n(T, 5)} litres of all the water on Earth. About 3% of it is fresh, and about 69% of the fresh water is locked up as ice. How many litres of fresh water are <b>not</b> ice?</p>`, answer, unit: 'litres', tol: 0.01,
        hint: 'First find the fresh water (3%), then the part of it that is not ice (31%).', solution: steps(`Fresh water = 3% of ${n(T, 5)} = ${n(T * 0.03, 5)} L.`, `Not ice = 31% of that = <b>${n(answer, 4)} L</b>.`) };
    },
    verify: (x) => x.T * 0.0093,
  },
  'c8s-earth-sun': {
    title: 'sunlight at another distance',
    make(r) {
      const d = choose(r, [0.5, 0.72, 1.5, 2, 4, 5]), answer = 1 / (d * d);
      return { d, q: `<p>Sunlight spreads out, so the light a planet receives is 1 ÷ d² times what Earth gets, where d is the distance from the Sun in astronomical units (Earth is at d = 1). How many times the Earth's sunlight does a planet at d = ${d} receive?</p>`, answer, unit: '× Earth', tol: 0.01,
        hint: 'Square the distance first, then take 1 divided by it.', solution: steps(`d² = ${d} × ${d} = ${n(d * d, 4)}.`, `1 ÷ ${n(d * d, 4)} = <b>${n(answer, 4)}</b> times Earth's sunlight.`) };
    },
    verify: (x) => Math.pow(x.d, -2),
  },
  'c8s-earth-lapse': {
    title: 'temperature high in the sky',
    make(r) {
      const T0 = pick(r, 20, 40, 5), h = pick(r, 4, 11, 1), answer = T0 - 6.5 * h;
      return { T0, h, q: `<p>In the troposphere the air gets about 6.5 °C colder for every km you climb. If it is ${T0} °C on the ground, what is the air temperature at ${h} km?</p>`, answer, unit: '°C', tol: 0.01, abs: 0.1,
        hint: 'Subtract 6.5 for each kilometre.', solution: steps(`Fall in temperature = 6.5 × ${h} = ${n(6.5 * h, 4)} °C.`, `${T0} − ${n(6.5 * h, 4)} = <b>${n(answer, 4)} °C</b>.`) };
    },
    verify: (x) => x.T0 - (6 * x.h + 0.5 * x.h),
  },
  'c8s-earth-pressure': {
    title: 'air pressure at a height',
    make(r) {
      const k = choose(r, [1, 2, 3]), answer = 1013 / Math.pow(2, k);
      return { k, q: `<p>Air pressure halves for about every 5.5 km you go up. Sea-level pressure is 1013 hPa. What is the pressure at a height of ${5.5 * k} km?</p>`, answer, unit: 'hPa', tol: 0.02,
        hint: 'Count how many 5.5 km steps there are, and halve that many times.', solution: steps(`${5.5 * k} ÷ 5.5 = ${k} halving${k > 1 ? 's' : ''}.`, `1013 ÷ 2^${k} = <b>${n(answer, 4)} hPa</b>.`) };
    },
    verify: (x) => { let p = 1013; for (let i = 0; i < x.k; i++) p /= 2; return p; },
  },
};
