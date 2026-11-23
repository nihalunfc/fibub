// Class 8 Science, Chapter 1 Exploring the Investigative World of Science: live problems (original fibub questions).
import { pick, choose, n, steps } from './_util.js';

export default {
  'c8s-inv-mean': {
    title: 'mean of three readings',
    make(r) {
      const base = pick(r, 12, 18, 0.5), d1 = pick(r, -0.6, 0.6, 0.2), d2 = pick(r, -0.6, 0.6, 0.2), a = +(base + d1).toFixed(1), b = +(base + d2).toFixed(1), c = +(base - d1 - d2).toFixed(1), answer = (a + b + c) / 3;
      return { a, b, c, q: `<p>Three students time a rolling toy car with a stopwatch and get ${a} s, ${b} s and ${c} s. What is the mean time?</p>`, answer, unit: 's', tol: 0.01,
        hint: 'Add the three readings and divide by 3.', solution: steps(`Sum = ${a} + ${b} + ${c} = ${n(a + b + c, 4)} s.`, `Mean = ${n(a + b + c, 4)} ÷ 3 = <b>${n(answer, 4)} s</b>.`) };
    },
    verify: (x) => x.a / 3 + x.b / 3 + x.c / 3,
  },
  'c8s-inv-swing': {
    title: 'time of one swing from 10 swings',
    make(r) {
      const T = pick(r, 1.1, 1.9, 0.1), tot = +(10 * T).toFixed(1), answer = tot / 10;
      return { tot, q: `<p>A pendulum takes ${tot} s for 10 complete swings. What is the time for one swing?</p>`, answer, unit: 's', tol: 0.01,
        hint: 'Divide the total time by the number of swings.', solution: steps(`Time for one swing = total time ÷ number of swings.`, `= ${tot} ÷ 10 = <b>${n(answer, 3)} s</b>.`) };
    },
    verify: (x) => x.tot * 0.1,
  },
  'c8s-inv-slope': {
    title: 'extension per 100 g from a graph',
    make(r) {
      const k = choose(r, [1.2, 1.5, 1.8, 2.0, 2.5]), l1 = 100, l2 = pick(r, 300, 500, 100), y1 = +(k * l1 / 100).toFixed(2), y2 = +(k * l2 / 100).toFixed(2), answer = k;
      return { l1, l2, y1, y2, q: `<p>On a graph of a spring's extension against load, one point is (${l1} g, ${y1} cm) and another is (${l2} g, ${y2} cm). The points lie on a straight line through the origin. How many cm does the spring stretch for each 100 g?</p>`, answer, unit: 'cm per 100 g', tol: 0.01,
        hint: 'Slope = change in extension ÷ change in load. Then scale it to 100 g.', solution: steps(`Change in extension = ${y2} − ${y1} = ${n(y2 - y1, 4)} cm.`, `Change in load = ${l2} − ${l1} = ${l2 - l1} g.`, `Per 100 g: ${n(y2 - y1, 4)} ÷ ${(l2 - l1) / 100} = <b>${n(answer, 3)} cm</b>.`) };
    },
    verify: (x) => (x.y2 / x.l2) * 100,
  },
  'c8s-inv-vars': {
    title: 'which variable is controlled',
    make(r) {
      const L = [
        ['how long a candle burns under different sized jars', 'size of the jar', 'time the candle burns', 'same candle and same room', 1],
        ['how far a ball rolls down ramps of different steepness', 'steepness of the ramp', 'distance rolled', 'same ball and same floor', 1],
        ['how quickly sugar dissolves at different water temperatures', 'water temperature', 'time to dissolve', 'same amount of sugar and water', 1],
      ];
      const it = choose(r, L), opts = [it[1], it[2], it[3]];
      return { it, q: `<p>A student tests <b>${it[0]}</b>. How many of these are <i>variables that the student changes on purpose</i>? Count only: (a) ${it[1]}, (b) ${it[2]}, (c) ${it[3]}. Enter the number.</p>`, answer: 1, unit: '', tol: 0, abs: 0,
        hint: 'You change one thing, measure another, and keep the rest the same.', solution: steps(`The variable changed on purpose is "${it[1]}".`, `"${it[2]}" is what is measured, and "${it[3]}" is kept the same.`, `So the answer is <b>1</b>.`) };
    },
    verify: () => 1,
  },
};
