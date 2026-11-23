// Class 8 Science, Chapter 4 Electricity: Magnetic and Heating Effects: live problems (original fibub questions). Ids start with c8s-elec-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c8s-elec-heat': {
    title: 'heat from a current',
    make(r) {
      const I = pick(r, 1, 5, 1), R = choose(r, [2, 4, 5, 10]), t = choose(r, [10, 30, 60]), answer = I * I * R * t;
      return { I, R, t, q: `<p>A current of ${I} A flows through a heater coil of resistance ${R} Ω for ${t} s. How much heat is produced? (H = I² R t)</p>`, answer, unit: 'J', tol: 0.01,
        hint: 'Square the current, multiply by the resistance, then by the time.', solution: steps(`I² = ${I}² = ${I * I}.`, `H = ${I * I} × ${R} × ${t}.`, `= <b>${n(answer, 5)} J</b>.`) };
    },
    verify: (x) => (x.I * x.R) * (x.I * x.t),
  },
  'c8s-elec-power': {
    title: 'current drawn by an appliance',
    make(r) {
      const P = choose(r, [460, 690, 1150, 1380, 2300]), answer = P / 230;
      return { P, q: `<p>A ${P} W appliance runs from the 230 V mains. What current does it draw?</p>`, answer, unit: 'A', tol: 0.01,
        hint: 'Use I = P ÷ V.', solution: steps(`I = P ÷ V = ${P} ÷ 230.`, `= <b>${n(answer, 3)} A</b>.`) };
    },
    verify: (x) => x.P * (1 / 230),
  },
  'c8s-elec-units': {
    title: 'electricity units used',
    make(r) {
      const P = choose(r, [60, 100, 500, 1000, 1500, 2000]), h = pick(r, 2, 10, 1), answer = P / 1000 * h;
      return { P, h, q: `<p>An appliance of ${P} W is used for ${h} hours. How many units (kWh) of electricity does it use?</p>`, answer, unit: 'units', tol: 0.01,
        hint: 'Change watts to kilowatts, then multiply by the hours.', solution: steps(`Power = ${P} W = ${n(P / 1000, 4)} kW.`, `Units = ${n(P / 1000, 4)} × ${h} = <b>${n(answer, 4)} kWh</b>.`) };
    },
    verify: (x) => x.h * x.P / 1000,
  },
  'c8s-elec-fuse': {
    title: 'will the fuse blow',
    make(r) {
      const a = choose(r, [1000, 2000]), b = choose(r, [100, 200, 460]), answer = (a + b) / 230;
      return { a, b, q: `<p>A geyser of ${a} W and appliances of ${b} W in total are switched on together on the 230 V mains. What total current flows? (A fuse rated lower than this would melt.)</p>`, answer, unit: 'A', tol: 0.01,
        hint: 'Add the powers first, then divide by 230 V.', solution: steps(`Total power = ${a} + ${b} = ${a + b} W.`, `I = ${a + b} ÷ 230 = <b>${n(answer, 3)} A</b>.`) };
    },
    verify: (x) => x.a / 230 + x.b / 230,
  },
  'c8s-elec-turns': {
    title: 'electromagnet strength model',
    make(r) {
      const N = pick(r, 20, 60, 10), I = choose(r, [0.5, 1, 1.5, 2]), answer = N * I;
      return { N, I, q: `<p>In a simple model an electromagnet's pull is proportional to (turns × current). A coil of ${N} turns carries ${I} A. What is the value of turns × current (in ampere-turns)?</p>`, answer, unit: 'A-turns', tol: 0.01,
        hint: 'Multiply the number of turns by the current.', solution: steps(`Ampere-turns = ${N} × ${I}.`, `= <b>${n(answer, 4)}</b>. Doubling either turns or current doubles the pull.`) };
    },
    verify: (x) => x.I * x.N,
  },
};
