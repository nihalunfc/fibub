// Class 11 Biology, Body Fluids and Circulation: live problems (original fibub questions). Ids start with c11b-circ-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11b-circ-output': {
    title: 'cardiac output',
    make(r) {
      const sv = pick(r, 60, 90, 5), hr = pick(r, 60, 90, 2);
      return { sv, hr, q: `<p>A heart pumps ${sv} mL of blood in each beat and beats ${hr} times a minute. What is the cardiac output in litres per minute?</p>`, answer: sv * hr / 1000, unit: 'L/min', tol: 0.01,
        hint: 'Cardiac output = stroke volume × heart rate, then change mL to litres.',
        solution: steps(`Output = ${sv} × ${hr} = ${n(sv * hr)} mL per minute.`, `= <b>${n(sv * hr / 1000)} L per minute</b>.`) };
    },
    verify: (x) => (x.hr * x.sv) / 1e3,
  },
  'c11b-circ-cycle': {
    title: 'duration of a cardiac cycle',
    make(r) {
      const hr = choose(r, [60, 72, 75, 80, 90, 100, 120]);
      return { hr, q: `<p>A person's heart rate is ${hr} beats per minute. How long, in seconds, does one cardiac cycle last?</p>`, answer: 60 / hr, unit: 's', tol: 0.01,
        hint: 'There are 60 seconds in a minute.',
        solution: steps(`Time per beat = 60 ÷ ${hr} = <b>${n(60 / hr)} s</b>.`, 'At 75 beats a minute this is the 0.8 s cycle of the textbook.') };
    },
    verify: (x) => 1 / (x.hr / 60),
  },
  'c11b-circ-stroke': {
    title: 'stroke volume from the volumes',
    make(r) {
      const edv = pick(r, 110, 150, 5), esv = pick(r, 40, 70, 5), hr = pick(r, 60, 90, 5);
      return { edv, esv, hr, q: `<p>At the end of diastole a ventricle holds ${edv} mL and at the end of systole ${esv} mL is left in it. At ${hr} beats a minute, what is the cardiac output in L/min?</p>`, answer: (edv - esv) * hr / 1000, unit: 'L/min', tol: 0.01,
        hint: 'Stroke volume = the volume before systole − the volume left after.',
        solution: steps(`Stroke volume = ${edv} − ${esv} = ${edv - esv} mL.`, `Output = ${edv - esv} × ${hr} = ${n((edv - esv) * hr)} mL = <b>${n((edv - esv) * hr / 1000)} L/min</b>.`) };
    },
    verify: (x) => (x.hr * x.edv - x.hr * x.esv) / 1000,
  },
  'c11b-circ-pulse': {
    title: 'pulse pressure',
    make(r) {
      const s = pick(r, 100, 180, 10), d = pick(r, 60, 100, 5);
      return { s, d, q: `<p>A patient's blood pressure is ${s}/${d} mm Hg. What is the pulse pressure (systolic − diastolic) in mm Hg?</p>`, answer: s - d, unit: 'mm Hg', tol: 0.01,
        hint: 'Subtract the diastolic from the systolic pressure.',
        solution: steps(`Pulse pressure = ${s} − ${d} = <b>${s - d} mm Hg</b>.`, s >= 140 || d >= 90 ? 'The pressure is at or above 140/90, which counts as hypertension.' : 'The pressure is below the hypertension limit of 140/90.') };
    },
    verify: (x) => x.s + -x.d,
  },
};
