// Class 8 Maths, Tales by Dots and Lines: live problems (original fibub questions). Ids start with c8m-data-.
import { pick, choose, n, steps } from './_util.js';

const TOT = [[36, 9], [40, 14], [45, 10], [60, 24], [72, 18], [90, 35], [48, 20]];
const PERM = [3, 0, 5, 2, 6, 1, 4];
export default {
  'c8m-data-mean': {
    title: 'mean of five values',
    make(r) {
      const v = [0, 1, 2, 3, 4].map(() => pick(r, 12, 60)), answer = v.reduce((a, b) => a + b, 0) / 5;
      return { v, q: `<p>Five friends scored <b>${v.join(', ')}</b> runs in a gully cricket match. Find the mean score.</p>`, answer, unit: 'runs', tol: 0.002,
        hint: 'Mean = sum of the values ÷ how many values.',
        solution: steps(`Sum = ${v.join(' + ')} = ${v.reduce((a, b) => a + b, 0)}.`, `Mean = ${v.reduce((a, b) => a + b, 0)} ÷ 5 = <b>${n(answer, 5)} runs</b>.`) };
    },
    verify(x) { return x.v.reduce((a, b) => a + b / 5, 0); },
  },
  'c8m-data-median': {
    title: 'median of seven values',
    make(r) {
      const s = [pick(r, 5, 15)]; for (let i = 1; i < 7; i++) s.push(s[i - 1] + pick(r, 1, 9));
      const shown = PERM.map((i) => s[i]), answer = s[3];
      return { s, shown, q: `<p>The marks of seven students in a quiz were <b>${shown.join(', ')}</b>. Find the median mark.</p>`, answer, unit: 'marks', tol: 0.002,
        hint: 'Write the marks in order first. With 7 values the median is the 4th.',
        solution: steps(`In order: ${s.join(', ')}.`, `There are 7 values, so the median is the 4th one: <b>${answer}</b>.`) };
    },
    verify(x) { return x.shown.find((v) => x.shown.filter((u) => u < v).length === 3); },
  },
  'c8m-data-pie': {
    title: 'angle of a sector in a pie chart',
    make(r) {
      const [t, c] = choose(r, TOT), answer = (c / t) * 360;
      return { t, c, q: `<p>In a survey of <b>${t}</b> students, <b>${c}</b> chose “bicycle” as the way they come to school. In a pie chart, what angle at the centre should the “bicycle” sector have?</p>`, answer, unit: '°', tol: 0.002,
        hint: 'Angle = (number of students ÷ total) × 360°.',
        solution: steps(`One student is 360° ÷ ${t} = ${n(360 / t, 5)}°.`, `${c} students: ${c} × ${n(360 / t, 5)}° = <b>${n(answer, 5)}°</b>.`) };
    },
    verify(x) { return x.c * (360 / x.t); },
  },
  'c8m-data-leave': {
    title: 'mean after one value leaves',
    make(r) {
      const m = pick(r, 40, 70), x = pick(r, 20, 90), answer = (8 * m - x) / 7;
      return { m, x, q: `<p>The mean mark of 8 students is <b>${m}</b>. One student, who scored <b>${x}</b>, leaves the room. What is the mean mark of the other 7?</p>`, answer, unit: 'marks', tol: 0.002,
        hint: 'Total marks = 8 × mean. Take away the leaving student’s marks, then divide by 7.',
        solution: steps(`Total = 8 × ${m} = ${8 * m}.`, `Left: ${8 * m} − ${x} = ${8 * m - x}.`, `New mean = ${8 * m - x} ÷ 7 = <b>${n(answer, 5)}</b>.`) };
    },
    verify(x) { return x.m - (x.x - x.m) / 7; },
  },
};
