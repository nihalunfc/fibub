// Class 8 Science (Curiosity), Chapter 5 Exploring Forces: live problems (original fibub questions). Ids start with c8s-force-.
import { pick, choose, n, steps } from './_util.js';

const PL = [['the Moon', 1.6], ['Mars', 3.7], ['Jupiter', 24.8], ['Earth', 9.8]];
export default {
  'c8s-force-weight': {
    title: 'weight from mass on a planet',
    make(r) {
      const m = pick(r, 20, 80, 5), p = choose(r, PL), answer = m * p[1];
      return { m, g: p[1], q: `<p>A student has a mass of ${m} kg. The gravitational pull on ${p[0]} is ${p[1]} N for every kg (g = ${p[1]} m/s²). What is the student's weight there?</p>`, answer, unit: 'N', tol: 0.01,
        hint: 'Weight = mass × g.', solution: steps(`W = m × g = ${m} × ${p[1]}.`, `= <b>${n(answer, 4)} N</b>.`) };
    },
    verify: (x) => x.m / (1 / x.g),
  },
  'c8s-force-net': {
    title: 'net force in a tug of war',
    make(r) {
      const a = pick(r, 200, 500, 50), b = pick(r, 100, 450, 50), answer = Math.abs(a - b);
      return { a, b, q: `<p>In a tug of war the left team pulls with ${a} N and the right team pulls with ${b} N. What is the size of the net force on the rope? (Give 0 if the forces are balanced.)</p>`, answer, unit: 'N', tol: 0.01, abs: 0.5,
        hint: 'The forces act in opposite directions, so subtract the smaller from the larger.', solution: steps(`Net force = ${Math.max(a, b)} − ${Math.min(a, b)}.`, `= <b>${answer} N</b>, towards the ${a > b ? 'left' : b > a ? 'right' : 'nobody (balanced)'} team.`) };
    },
    verify: (x) => Math.sqrt((x.a - x.b) ** 2),
  },
  'c8s-force-moon': {
    title: 'weight on the Moon from weight on Earth',
    make(r) {
      const W = pick(r, 300, 700, 50), answer = W / 9.8 * 1.6;
      return { W, q: `<p>A boy weighs ${W} N on Earth (g = 9.8 m/s²). What will he weigh on the Moon, where g = 1.6 m/s²?</p>`, answer, unit: 'N', tol: 0.01,
        hint: 'First find his mass (it does not change), then multiply by the Moon\'s g.', solution: steps(`Mass = W ÷ g = ${W} ÷ 9.8 = ${n(W / 9.8, 4)} kg (the same everywhere).`, `Weight on Moon = ${n(W / 9.8, 4)} × 1.6 = <b>${n(answer, 4)} N</b>.`) };
    },
    verify: (x) => x.W * (1.6 / 9.8),
  },
  'c8s-force-spring': {
    title: 'stretch of a spring balance',
    make(r) {
      const F1 = choose(r, [2, 4, 5]), e1 = choose(r, [3, 4, 6]) * F1 / 2, F2 = pick(r, 6, 12, 1), answer = e1 * F2 / F1;
      return { F1, e1, F2, q: `<p>A spring stretches ${e1} cm when a load of ${F1} N hangs from it. If the stretch is proportional to the load, how far will it stretch under ${F2} N?</p>`, answer, unit: 'cm', tol: 0.01,
        hint: 'Stretch per newton stays the same.', solution: steps(`Stretch per newton = ${e1} ÷ ${F1} = ${n(e1 / F1, 4)} cm/N.`, `Stretch for ${F2} N = ${n(e1 / F1, 4)} × ${F2} = <b>${n(answer, 4)} cm</b>.`) };
    },
    verify: (x) => (x.F2 / x.F1) * x.e1,
  },
};
