// Class 8 Maths, Proportional Reasoning 2: live problems (original fibub questions). Ids start with c8m-prop2-.
import { choose, n, steps } from './_util.js';

const WD = [[6, 20, 8], [12, 10, 15], [8, 15, 10], [5, 24, 8], [9, 20, 12], [4, 30, 10], [15, 8, 10]];
const SV = [[40, 6, 60], [30, 8, 48], [45, 4, 60], [50, 6, 75], [60, 5, 100], [80, 3, 60]];
const AB = [[12, 6], [20, 30], [10, 15], [15, 10], [24, 8], [30, 20], [18, 9]];
const ME = [[40, 30, 10], [60, 20, 20], [45, 24, 15], [50, 18, 25], [30, 40, 10], [24, 30, 12]];
export default {
  'c8m-prop2-workers': {
    title: 'workers and days (inverse proportion)',
    make(r) {
      const [w, d, w2] = choose(r, WD), answer = (w * d) / w2;
      return { w, d, w2, q: `<p><b>${w}</b> workers can paint a school building in <b>${d}</b> days. If all work at the same speed, how many days would <b>${w2}</b> workers need?</p>`, answer, unit: 'days', tol: 0.002,
        hint: 'More workers means fewer days. Workers × days stays the same.',
        solution: steps(`The job is ${w} × ${d} = ${w * d} worker-days.`, `With ${w2} workers: days = ${w * d} ÷ ${w2}.`, `= <b>${n(answer, 5)} days</b>.`) };
    },
    verify(x) { return x.d / (x.w2 / x.w); },
  },
  'c8m-prop2-speed': {
    title: 'speed and time for a fixed distance',
    make(r) {
      const [v1, t1, v2] = choose(r, SV), answer = (v1 * t1) / v2;
      return { v1, t1, v2, q: `<p>A bus goes between two towns at <b>${v1} km/h</b> and takes <b>${t1} hours</b>. How many hours will it take at <b>${v2} km/h</b>?</p>`, answer, unit: 'hours', tol: 0.002,
        hint: 'Distance = speed × time stays the same. Find the distance first.',
        solution: steps(`Distance = ${v1} × ${t1} = ${v1 * t1} km.`, `Time = ${v1 * t1} ÷ ${v2}.`, `= <b>${n(answer, 5)} hours</b>.`) };
    },
    verify(x) { return x.t1 * (x.v1 / x.v2); },
  },
  'c8m-prop2-together': {
    title: 'two people working together',
    make(r) {
      const [a, b] = choose(r, AB), answer = (a * b) / (a + b);
      return { a, b, q: `<p>Ravi can mow a lawn alone in <b>${a} hours</b> and Sita can do it alone in <b>${b} hours</b>. How many hours will they take working together?</p>`, answer, unit: 'hours', tol: 0.002,
        hint: 'Find the part of the lawn each does in one hour and add the parts.',
        solution: steps(`Ravi does 1/${a} of the lawn in an hour, Sita does 1/${b}.`, `Together: 1/${a} + 1/${b} = ${a + b}/${a * b} of the lawn per hour.`, `Time = ${a * b}/${a + b} = <b>${n(answer, 5)} hours</b>.`) };
    },
    verify(x) { return 1 / (1 / x.a + 1 / x.b); },
  },
  'c8m-prop2-mess': {
    title: 'food for a hostel (inverse proportion)',
    make(r) {
      const [s, d, m] = choose(r, ME), answer = (s * d) / (s + m);
      return { s, d, m, q: `<p>A hostel has food that lasts <b>${s}</b> students for <b>${d}</b> days. If <b>${m}</b> more students join on the first day, for how many days will the same food last?</p>`, answer, unit: 'days', tol: 0.002,
        hint: 'Total food = students × days. Divide by the new number of students.',
        solution: steps(`Food = ${s} × ${d} = ${s * d} student-days.`, `New number of students = ${s} + ${m} = ${s + m}.`, `Days = ${s * d} ÷ ${s + m} = <b>${n(answer, 5)} days</b>.`) };
    },
    verify(x) { return x.d * x.s / (x.s + x.m); },
  },
};
