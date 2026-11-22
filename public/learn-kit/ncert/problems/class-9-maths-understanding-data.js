// Class 9 Maths, How Quantities Combine: Understanding Data: live problems (original fibub questions). Ids start with c9m-data-.
import { pick, choose, n, steps } from './_util.js';

const sum = (a) => a.reduce((x, y) => x + y, 0);
export default {
  'c9m-data-mean': {
    title: 'mean of a list',
    make(r) {
      const v = [pick(r, 10, 40), pick(r, 10, 40), pick(r, 10, 40), pick(r, 10, 40)];
      let last = pick(r, 10, 40); while ((sum(v) + last) % 5) last++;
      const d = [...v, last], ctx = choose(r, ['runs scored in five innings', 'marks in five tests', 'rupees spent on chai on five days']);
      return { d, q: `<p>The ${ctx} are ${d.join(', ')}. Find the mean.</p>`, answer: sum(d) / 5, abs: 0.01, tol: 0, unit: '',
        hint: 'Mean = sum of the values ÷ how many values there are.',
        solution: steps(`Sum = ${d.join(' + ')} = ${sum(d)}.`, `Mean = ${sum(d)} ÷ 5 = <b>${sum(d) / 5}</b>.`) };
    },
    verify: (p) => p.d.reduce((a, b, i) => a + (b - a) / (i + 1), 0),
  },
  'c9m-data-median': {
    title: 'median of an even list',
    make(r) {
      const d = Array.from({ length: 6 }, () => pick(r, 5, 60));
      return { d, q: `<p>Find the median of ${d.join(', ')}.</p>`, answer: 0, abs: 0.01, tol: 0, unit: '', ...(() => { const s = [...d].sort((a, b) => a - b), m = (s[2] + s[3]) / 2; return { answer: m, hint: 'Line the numbers up in order. With 6 values the median is the mean of the 3rd and 4th.', solution: steps(`In order: ${s.join(', ')}.`, `The middle two are ${s[2]} and ${s[3]}: median = (${s[2]} + ${s[3]}) ÷ 2 = <b>${m}</b>.`) }; })() };
    },
    verify: (p) => { const s = p.d.slice().sort((a, b) => b - a); return (s[2] + s[3]) / 2; },
  },
  'c9m-data-missing': {
    title: 'find the missing value',
    make(r) {
      const m = pick(r, 25, 60), v = [pick(r, 10, 30), pick(r, 10, 30), pick(r, 10, 30), pick(r, 10, 30)], x = 5 * m - sum(v);
      return { m, v, x, q: `<p>The mean of five numbers is ${m}. Four of them are ${v.join(', ')}. Find the fifth number.</p>`, answer: x, abs: 0.01, tol: 0, unit: '',
        hint: 'Total of all five = 5 × mean. Subtract the four you know.',
        solution: steps(`Total of five numbers = 5 × ${m} = ${5 * m}.`, `Fifth = ${5 * m} − ${sum(v)} = <b>${x}</b>.`) };
    },
    verify: (p) => (p.v.reduce((a, b) => a + b, 0) + p.x) / 5 === p.m ? p.x : NaN,
  },
  'c9m-data-combine': {
    title: 'combined mean of two groups',
    make(r) {
      const n1 = pick(r, 10, 40), n2 = pick(r, 10, 40), m1 = pick(r, 40, 80), m2 = pick(r, 40, 80);
      return { n1, n2, m1, m2, q: `<p>Section A has ${n1} students with a mean mark of ${m1}. Section B has ${n2} students with a mean mark of ${m2}. Find the mean mark of all ${n1 + n2} students together (to 2 decimal places).</p>`, answer: (n1 * m1 + n2 * m2) / (n1 + n2), abs: 0.01, tol: 0.001, unit: '',
        hint: 'Do not average the two means. Find the total marks of each section first.',
        solution: steps(`Total marks A = ${n1} × ${m1} = ${n1 * m1}; B = ${n2} × ${m2} = ${n2 * m2}.`, `Combined mean = ${n1 * m1 + n2 * m2} ÷ ${n1 + n2} = <b>${n((n1 * m1 + n2 * m2) / (n1 + n2), 5)}</b>.`) };
    },
    verify: (p) => p.m1 + (p.n2 / (p.n1 + p.n2)) * (p.m2 - p.m1),
  },
  'c9m-data-freqmean': {
    title: 'mean from a frequency table',
    make(r) {
      const f = [pick(r, 1, 8), pick(r, 1, 8), pick(r, 1, 8), pick(r, 1, 8), pick(r, 1, 8)], x = [0, 1, 2, 3, 4], N = sum(f), fx = f.map((a, i) => a * x[i]);
      return { f, x, q: `<p>Goals in ${N} matches: 0 goals in ${f[0]} matches, 1 goal in ${f[1]}, 2 goals in ${f[2]}, 3 goals in ${f[3]}, 4 goals in ${f[4]}. Find the mean number of goals per match (2 decimal places).</p>`, answer: sum(fx) / N, abs: 0.01, tol: 0.001, unit: '',
        hint: 'Mean = sum of f × x ÷ sum of f.',
        solution: steps(`f × x: ${fx.join(', ')}; total ${sum(fx)}. Total matches ${N}.`, `Mean = ${sum(fx)} ÷ ${N} = <b>${n(sum(fx) / N, 4)}</b>.`) };
    },
    verify: (p) => { let a = 0, b = 0; for (let i = 0; i < 5; i++) { a += p.f[i] * p.x[i]; b += p.f[i]; } return a / b; },
  },
  'c9m-data-classfreq': {
    title: 'read a frequency table',
    make(r) {
      const f = [pick(r, 2, 9), pick(r, 3, 12), pick(r, 4, 14), pick(r, 3, 12), pick(r, 1, 8)], N = sum(f), k = pick(r, 1, 3);
      return { f, k, q: `<p>Marks of ${N} students are grouped: 0–10: ${f[0]}, 10–20: ${f[1]}, 20–30: ${f[2]}, 30–40: ${f[3]}, 40–50: ${f[4]}. (A mark of 10 goes into 10–20.) How many students scored ${k * 10} or more?</p>`, answer: sum(f.slice(k)), abs: 0.01, tol: 0, unit: '',
        hint: `Add the frequencies of the classes that start at ${k * 10} or above.`,
        solution: steps(`Classes from ${k * 10} upward: ${f.slice(k).join(' + ')}.`, `Total = <b>${sum(f.slice(k))}</b>.`) };
    },
    verify: (p) => p.f.reduce((a, v, i) => a + (i * 10 >= p.k * 10 ? v : 0), 0),
  },
};
