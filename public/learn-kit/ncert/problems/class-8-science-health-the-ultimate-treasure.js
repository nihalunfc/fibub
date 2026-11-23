// Class 8 Science, Chapter 3 Health: The Ultimate Treasure: live problems (original fibub questions). Ids start with c8s-health-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c8s-health-bmi': {
    title: 'body mass index',
    make(r) {
      const h = pick(r, 1.4, 1.7, 0.05), mass = pick(r, 35, 70, 1), answer = mass / (h * h);
      return { h, mass, q: `<p>A student is ${n(h, 3)} m tall and has a mass of ${mass} kg. Body mass index (BMI) is mass in kg divided by the square of the height in metres. Find the BMI.</p>`, answer, unit: 'kg/m²', tol: 0.01,
        hint: 'BMI = mass ÷ (height × height).', solution: steps(`Height squared = ${n(h, 3)} × ${n(h, 3)} = ${n(h * h, 4)} m².`, `BMI = ${mass} ÷ ${n(h * h, 4)} = <b>${n(answer, 3)} kg/m²</b>.`) };
    },
    verify: (x) => x.mass / x.h / x.h,
  },
  'c8s-health-water': {
    title: 'water needed in a week',
    make(r) {
      const L = choose(r, [1.5, 2, 2.5, 3]), d = pick(r, 3, 7, 1), answer = L * d;
      return { L, d, q: `<p>A student drinks ${L} litres of water each day. How many litres is that in ${d} days?</p>`, answer, unit: 'litres', tol: 0.01,
        hint: 'Multiply the litres per day by the number of days.', solution: steps(`Total = ${L} × ${d}.`, `= <b>${n(answer, 3)} litres</b>.`) };
    },
    verify: (x) => x.d * x.L,
  },
  'c8s-health-vac': {
    title: 'people who need vaccination',
    make(r) {
      const pop = choose(r, [200, 500, 800, 1000, 2000]), pct = choose(r, [60, 70, 80, 90]), answer = pop * pct / 100;
      return { pop, pct, q: `<p>A village has ${pop} people. Health workers want ${pct}% of them to be vaccinated so that the whole village is protected. How many people must be vaccinated?</p>`, answer, unit: 'people', tol: 0.01,
        hint: 'Find the percentage of the village population.', solution: steps(`${pct}% of ${pop} = ${pct} ÷ 100 × ${pop}.`, `= <b>${n(answer, 4)} people</b>.`) };
    },
    verify: (x) => x.pop * 0.01 * x.pct,
  },
  'c8s-health-hand': {
    title: 'germs after handwashing',
    make(r) {
      const g = choose(r, [1000, 5000, 20000]), pct = choose(r, [90, 99]), answer = g * (100 - pct) / 100;
      return { g, pct, q: `<p>There are ${n(g, 5)} germs on a student's hands. Washing with soap removes ${pct}% of them. How many are left?</p>`, answer, unit: 'germs', tol: 0.01,
        hint: 'Find what percentage is left, then take that part.', solution: steps(`Left = ${100 - pct}% of ${n(g, 5)}.`, `= <b>${n(answer, 4)} germs</b>. The rest could still multiply, so wash well and dry your hands.`) };
    },
    verify: (x) => x.g - x.g * x.pct / 100,
  },
};
