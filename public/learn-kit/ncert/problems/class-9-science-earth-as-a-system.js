// Class 9 Science, Earth as a System: live problems (original fibub questions). Ids start with c9s-earth-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c9s-earth-albedo': {
    title: 'sunlight absorbed by the Earth',
    make(r) {
      const S = choose(r, [1361, 1361, 1400]), a = pick(r, 0.2, 0.5, 0.05), answer = (S / 4) * (1 - a);
      return { S, a, q: `<p>The Sun’s energy reaching the top of the air is ${S} W/m² on a surface facing the Sun. Because the Earth is a sphere that turns, the average over the whole Earth is one quarter of this. If the Earth reflects ${Math.round(a * 100)}% of the sunlight (albedo ${n(a)}), how much sunlight is absorbed per square metre, on average?</p>`, answer, unit: 'W/m²', tol: 0.01,
        hint: 'First divide by 4 for the whole-Earth average. Then keep only the part that is not reflected: multiply by (1 − albedo).',
        solution: steps(`Average sunlight = ${S} ÷ 4 = ${n(S / 4)} W/m².`, `Absorbed = ${n(S / 4)} × (1 − ${n(a)}) = <b>${n(answer)} W/m²</b>.`) };
    },
    verify: (x) => x.S / 4 - (x.S / 4) * x.a,
  },
  'c9s-earth-co2': {
    title: 'how fast does CO₂ build up in the air',
    make(r) {
      const E = pick(r, 6, 12, 0.5), f = pick(r, 0.4, 0.6, 0.05), answer = (E * (1 - f)) / 2.13;
      return { E, f, q: `<p>People release ${n(E)} billion tonnes of carbon a year. Oceans and plants take back ${Math.round(f * 100)}% of it. The rest stays in the air. Every 2.13 billion tonnes of carbon left in the air raises the CO₂ level by 1 ppm. By how many ppm does CO₂ rise in a year?</p>`, answer, unit: 'ppm', tol: 0.01,
        hint: 'Work out the carbon that stays in the air (the part not taken back), then divide by 2.13.',
        solution: steps(`Stays in the air = ${n(E)} × (1 − ${n(f)}) = ${n(E * (1 - f))} billion tonnes.`, `Rise = ${n(E * (1 - f))} ÷ 2.13 = <b>${n(answer)} ppm</b>.`) };
    },
    verify: (x) => x.E / 2.13 - (x.E * x.f) / 2.13,
  },
  'c9s-earth-urea': {
    title: 'nitrogen in a bag of fertiliser',
    make(r) {
      const m = pick(r, 10, 100, 5), answer = (m * 28) / 60;
      return { m, q: `<p>Urea, CO(NH₂)₂, is a common fertiliser. (Atomic masses: C = 12, O = 16, N = 14, H = 1.) How many kilograms of nitrogen are in a ${m} kg bag of pure urea?</p>`, answer, unit: 'kg', tol: 0.01,
        hint: 'Find the mass of one formula unit of urea, and the mass of the two nitrogen atoms in it. The same fraction holds for the whole bag.',
        solution: steps('Mass of CO(NH₂)₂ = 12 + 16 + 2 × (14 + 2 × 1) = 60 u.', 'Nitrogen in it = 2 × 14 = 28 u, a fraction 28/60 = 0.467.', `Nitrogen in the bag = ${m} × 28/60 = <b>${n(answer)} kg</b>.`) };
    },
    verify: (x) => ((x.m * 1000) / 60) * 28 / 1000,
  },
  'c9s-earth-trees': {
    title: 'carbon locked up by trees',
    make(r) {
      const trees = pick(r, 20, 500, 10), kg = choose(r, [20, 22, 25]), answer = trees * kg * (12 / 44);
      return { trees, kg, q: `<p>A school plants ${trees} trees. Suppose each full-grown tree takes in ${kg} kg of carbon dioxide a year. CO₂ has molar mass 44 g/mol, of which carbon is 12. How many kilograms of <i>carbon</i> do the trees take in each year?</p>`, answer, unit: 'kg', tol: 0.01,
        hint: 'Find the total CO₂ first. Carbon is 12/44 of the mass of CO₂.',
        solution: steps(`Total CO₂ = ${trees} × ${kg} = ${trees * kg} kg.`, `Carbon = ${trees * kg} × 12/44 = <b>${n(answer)} kg</b>.`) };
    },
    verify: (x) => (x.trees * x.kg * 12) / 44,
  },
  'c9s-earth-lapse': {
    title: 'temperature on a mountain',
    make(r) {
      const T0 = pick(r, 24, 36, 1), h = pick(r, 500, 4000, 250), answer = T0 - 6.5 * (h / 1000);
      return { T0, h, q: `<p>In the lower air the temperature falls by about 6.5 °C for every 1000 m you climb. A town at the foot of a hill is at ${T0} °C. What is the temperature on a viewpoint ${h} m higher?</p>`, answer, unit: '°C', tol: 0.01, abs: 0.2,
        hint: 'Find how many thousands of metres you climb, multiply by 6.5, and subtract.',
        solution: steps(`Climb = ${h} m = ${n(h / 1000)} thousand metres.`, `Fall = ${n(h / 1000)} × 6.5 = ${n(6.5 * h / 1000)} °C.`, `Temperature = ${T0} − ${n(6.5 * h / 1000)} = <b>${n(answer)} °C</b>.`) };
    },
    verify: (x) => x.T0 - 0.0065 * x.h,
  },
  'c9s-earth-grid': {
    title: 'CO₂ from your electricity',
    make(r) {
      const kwh = pick(r, 50, 300, 10), f = choose(r, [0.7, 0.8]), answer = kwh * f;
      return { kwh, f, q: `<p>Burning coal and gas to make electricity releases about ${f} kg of CO₂ for every kWh (unit) supplied by India’s grid. A home uses ${kwh} units in a month. How many kilograms of CO₂ does that release?</p>`, answer, unit: 'kg', tol: 0.01,
        hint: 'Multiply the units used by the kilograms of CO₂ per unit.',
        solution: steps(`CO₂ = ${kwh} kWh × ${f} kg/kWh = <b>${n(answer)} kg</b>.`) };
    },
    verify: (x) => (x.kwh * x.f * 1000) / 1000,
  },
};
