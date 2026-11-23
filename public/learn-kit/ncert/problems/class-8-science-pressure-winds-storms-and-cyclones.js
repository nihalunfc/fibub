// Class 8 Science (Curiosity), Chapter 6 Pressure, Winds, Storms and Cyclones: live problems (original fibub questions). Ids start with c8s-press-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c8s-press-pa': {
    title: 'pressure from force and area',
    make(r) {
      const F = pick(r, 20, 400, 20), A = choose(r, [0.01, 0.02, 0.04, 0.05, 0.1]), answer = F / A;
      return { F, A, q: `<p>A box presses on the floor with a force of ${F} N over an area of ${A} m². What is the pressure on the floor?</p>`, answer, unit: 'Pa', tol: 0.01,
        hint: 'Pressure = force ÷ area, and 1 Pa = 1 N per m².', solution: steps(`p = F ÷ A = ${F} ÷ ${A}.`, `= <b>${n(answer, 4)} Pa</b>.`) };
    },
    verify: (x) => x.F * (1 / x.A),
  },
  'c8s-press-force': {
    title: 'force of the air on a surface',
    make(r) {
      const A = choose(r, [0.5, 1, 1.5, 2, 2.5]), answer = 100000 * A;
      return { A, q: `<p>Air pressure is about 100 000 Pa. What force does the air push with on a flat table top of area ${A} m²?</p>`, answer, unit: 'N', tol: 0.01,
        hint: 'Force = pressure × area.', solution: steps(`F = p × A = 100 000 × ${A}.`, `= <b>${n(answer, 6)} N</b> (about ${n(answer / 10000, 3)} tonnes of weight!). The air also pushes from below, so the table is not crushed.`) };
    },
    verify: (x) => x.A * 1e5,
  },
  'c8s-press-area': {
    title: 'area from pressure and force',
    make(r) {
      const F = pick(r, 100, 500, 50), p = choose(r, [1000, 2000, 5000, 10000]), answer = F / p;
      return { F, p, q: `<p>A force of ${F} N must produce a pressure of ${n(p, 5)} Pa. What area must it act on?</p>`, answer, unit: 'm²', tol: 0.01,
        hint: 'Rearrange p = F ÷ A to get A = F ÷ p.', solution: steps(`A = F ÷ p = ${F} ÷ ${n(p, 5)}.`, `= <b>${n(answer, 4)} m²</b>.`) };
    },
    verify: (x) => 1 / (x.p / x.F),
  },
  'c8s-press-cyclone': {
    title: 'time for a cyclone to reach the coast',
    make(r) {
      const d = pick(r, 120, 600, 40), v = choose(r, [10, 15, 20, 24, 30]), answer = d / v;
      return { d, v, q: `<p>A cyclone is ${d} km from the coast and moves towards it at ${v} km/h. After how many hours will it reach the coast?</p>`, answer, unit: 'h', tol: 0.01,
        hint: 'Time = distance ÷ speed.', solution: steps(`t = d ÷ v = ${d} ÷ ${v}.`, `= <b>${n(answer, 4)} h</b>. This is why warnings are issued a day or two before landfall.`) };
    },
    verify: (x) => x.d * (1 / x.v),
  },
};
