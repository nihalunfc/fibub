// Class 10 Science, Control and Coordination: live problems (original fibub questions). Ids start with c10s-ctrl-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c10s-ctrl-speed': {
    title: 'time for a nerve impulse',
    make(r) {
      const d = pick(r, 0.5, 1.8, 0.1), v = pick(r, 50, 120, 10);
      return { d, v, q: `<p>A nerve impulse travels along a motor neuron that is ${n(d)} m long at ${v} m/s. How long does it take, in milliseconds?</p>`, answer: (d / v) * 1000, unit: 'ms', tol: 0.01,
        hint: 'Time = distance ÷ speed. Multiply the answer in seconds by 1000.',
        solution: steps(`t = ${n(d)} ÷ ${v} = ${n(d / v)} s.`, `= <b>${n((d / v) * 1000)} ms</b>.`) };
    },
    verify: (x) => x.d / (x.v / 1000),
  },
  'c10s-ctrl-ruler': {
    title: 'reaction time from the ruler drop',
    make(r) {
      const d = pick(r, 8, 30, 1);
      return { d, q: `<p>In a ruler drop test a student catches the ruler after it has fallen ${d} cm. Taking g = 9.8 m/s², what is the student’s reaction time in milliseconds?</p>`, answer: Math.sqrt((2 * d / 100) / 9.8) * 1000, unit: 'ms', tol: 0.02,
        hint: 'The ruler falls from rest: d = ½gt². Solve for t, using d in metres.',
        solution: steps(`d = ${d} cm = ${n(d / 100)} m.`, `t = √(2d/g) = √(2 × ${n(d / 100)} ÷ 9.8) = ${n(Math.sqrt((2 * d / 100) / 9.8))} s.`, `Reaction time = <b>${n(Math.sqrt((2 * d / 100) / 9.8) * 1000)} ms</b>.`) };
    },
    verify: (x) => (Math.sqrt(2 * 9.8 * (x.d / 100)) / 9.8) * 1000,
  },
  'c10s-ctrl-fall': {
    title: 'how far the ruler falls',
    make(r) {
      const t = pick(r, 150, 300, 10);
      return { t, q: `<p>A student has a reaction time of ${t} ms. How far, in cm, does a ruler fall before she catches it? (g = 9.8 m/s².)</p>`, answer: 0.5 * 9.8 * (t / 1000) ** 2 * 100, unit: 'cm', tol: 0.02,
        hint: 'd = ½gt² with t in seconds.',
        solution: steps(`t = ${t} ms = ${n(t / 1000)} s.`, `d = ½ × 9.8 × ${n(t / 1000)}² = ${n(0.5 * 9.8 * (t / 1000) ** 2)} m = <b>${n(0.5 * 9.8 * (t / 1000) ** 2 * 100)} cm</b>.`) };
    },
    verify: (x) => { const v = 9.8 * (x.t / 1000); return ((v * v) / (2 * 9.8)) * 100; },
  },
  'c10s-ctrl-reflex': {
    title: 'reflex versus brain pathway',
    make(r) {
      const v = pick(r, 50, 100, 10), L1 = pick(r, 6, 14, 2) / 10, L2 = L1 + pick(r, 10, 20, 2) / 10;
      return { v, L1, L2, q: `<p>A reflex arc has a total nerve path of ${n(L1)} m and 2 synapses. A voluntary action through the brain has a path of ${n(L2)} m and 5 synapses. Impulses travel at ${v} m/s and each synapse adds a delay of 0.5 ms. How many milliseconds longer does the brain route take?</p>`, answer: ((L2 - L1) / v) * 1000 + 3 * 0.5, unit: 'ms', tol: 0.02,
        hint: 'Time = path ÷ speed + (number of synapses × 0.5 ms). Work out both and subtract.',
        solution: steps(`Reflex: ${n(L1)} ÷ ${v} = ${n(L1 / v * 1000)} ms, plus 2 × 0.5 = 1 ms, total ${n(L1 / v * 1000 + 1)} ms.`, `Brain: ${n(L2)} ÷ ${v} = ${n(L2 / v * 1000)} ms, plus 5 × 0.5 = 2.5 ms, total ${n(L2 / v * 1000 + 2.5)} ms.`, `Difference = <b>${n(((L2 - L1) / v) * 1000 + 1.5)} ms</b>.`) };
    },
    verify: (x) => (x.L2 / x.v * 1000 + 5 * 0.5) - (x.L1 / x.v * 1000 + 2 * 0.5),
  },
  'c10s-ctrl-glucose': {
    title: 'blood sugar units',
    make(r) {
      const g = pick(r, 70, 180, 5);
      return { g, q: `<p>A fasting blood glucose test gives ${g} mg/dL. Glucose has a molar mass of 180.16 g/mol and 1 dL = 0.1 L. What is the concentration in mmol/L?</p>`, answer: (g * 10) / 180.16, unit: 'mmol/L', tol: 0.02,
        hint: 'mg/dL × 10 = mg/L. Then divide by the molar mass (mg per mmol is the same number as g per mol).',
        solution: steps(`${g} mg/dL = ${g * 10} mg/L.`, `Concentration = ${g * 10} ÷ 180.16 = <b>${n((g * 10) / 180.16)} mmol/L</b>. (A fasting value of 7.0 mmol/L or more suggests diabetes.)`) };
    },
    verify: (x) => x.g / 18.016,
  },
  'c10s-ctrl-iodine': {
    title: 'iodine from iodised salt',
    make(r) {
      const m = pick(r, 3, 12, 1), ppm = choose(r, [15, 20, 30]);
      return { m, ppm, q: `<p>Iodised salt has ${ppm} mg of iodine in every kilogram of salt (${ppm} ppm). A person eats ${m} g of this salt a day. How many micrograms (µg) of iodine is that? What fraction of the 150 µg adult daily need does it meet? Give the micrograms.</p>`, answer: ppm * m, unit: 'µg', tol: 0.01,
        hint: 'ppm in mg/kg is the same as µg/g. Multiply by the grams of salt eaten.',
        solution: steps(`${ppm} mg/kg = ${ppm} µg per gram of salt.`, `Iodine = ${ppm} × ${m} = <b>${ppm * m} µg</b>, which is ${n((ppm * m) / 150 * 100)}% of 150 µg.`) };
    },
    verify: (x) => (x.m / 1000) * x.ppm * 1000,
  },
};
