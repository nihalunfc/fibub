// Class 9 Science (Exploration), Chapter 3 Tissues in Action: live problems (original fibub questions). Ids start with c9s-tis-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c9s-tis-plasma': {
    title: 'plasma volume in a blood sample',
    make(r) {
      const V = pick(r, 2, 6, 0.5), answer = +(V * 0.55).toFixed(4);
      return { V, q: `<p>Plasma makes up about 55% of the volume of blood. How many litres of plasma are in ${V} L of blood?</p>`, answer, unit: 'L', tol: 0.01,
        hint: 'Take 55% of the total volume.',
        solution: steps(`Plasma = 55% of ${V} L = 0.55 × ${V}.`, `= <b>${n(answer, 4)} L</b>.`) };
    },
    verify: (x) => x.V - 0.45 * x.V,
  },
  'c9s-tis-rbc': {
    title: 'red blood cells in a small sample',
    make(r) {
      const c = pick(r, 4.2, 5.8, 0.2), mL = pick(r, 1, 5), answer = +(c * 1000 * mL).toFixed(3);
      return { c, mL, q: `<p>A healthy adult has about ${n(c, 3)} million red blood cells in every cubic millimetre (mm³) of blood. How many million red blood cells are in ${mL} mL? (1 mL = 1000 mm³)</p>`, answer, unit: 'million cells', tol: 0.01,
        hint: 'Change mL to mm³ first, then multiply by the count per mm³.',
        solution: steps(`${mL} mL = ${mL * 1000} mm³.`, `Cells = ${n(c, 3)} million × ${mL * 1000} = <b>${n(answer, 5)} million</b> (about ${n(answer / 1000, 4)} billion).`) };
    },
    verify: (x) => (x.c * x.mL * 1000),
  },
  'c9s-tis-heart': {
    title: 'heartbeats in a day',
    make(r) {
      const bpm = pick(r, 60, 90, 2), answer = bpm * 60 * 24;
      return { bpm, q: `<p>The cardiac muscle of a resting person contracts ${bpm} times in a minute. How many beats is that in one day?</p>`, answer, unit: 'beats', tol: 0.001,
        hint: 'There are 60 minutes in an hour and 24 hours in a day.',
        solution: steps(`Minutes in a day = 60 × 24 = 1440.`, `Beats = ${bpm} × 1440 = <b>${n(answer, 6)}</b>.`) };
    },
    verify: (x) => x.bpm * 1440,
  },
  'c9s-tis-impulse': {
    title: 'time for a nerve impulse to travel',
    make(r) {
      const d = choose(r, [0.6, 0.9, 1.2, 1.5]), v = choose(r, [30, 60, 90, 120]), answer = +((d / v) * 1000).toFixed(4);
      return { d, v, q: `<p>A nerve impulse travels at ${v} m/s along a neuron from the foot to the spinal cord, a distance of ${d} m. How long does it take, in milliseconds?</p>`, answer, unit: 'ms', tol: 0.01,
        hint: 'Time = distance ÷ speed, then change seconds to milliseconds (× 1000).',
        solution: steps(`Time = ${d} ÷ ${v} = ${n(d / v, 4)} s.`, `= <b>${n(answer, 4)} ms</b>.`) };
    },
    verify: (x) => 1000 * x.d / x.v,
  },
  'c9s-tis-field': {
    title: 'cells across a microscope field',
    make(r) {
      const f = choose(r, [900, 1200, 1800]), s = choose(r, [20, 30, 45, 60, 90]), answer = f / s;
      return { f, s, q: `<p>The field of view of a microscope is ${f} µm across. Plant parenchyma cells in a row are each ${s} µm wide. About how many cells fit across the field?</p>`, answer: +answer.toFixed(3), unit: 'cells', tol: 0.02,
        hint: 'Divide the width of the field by the width of one cell.',
        solution: steps(`Number = field ÷ cell width = ${f} ÷ ${s}.`, `= <b>${n(answer, 4)}</b> cells.`) };
    },
    verify: (x) => x.f / x.s,
  },
};
