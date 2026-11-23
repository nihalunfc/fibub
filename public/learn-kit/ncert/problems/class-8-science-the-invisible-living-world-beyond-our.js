// Class 8 Science, Chapter 2 The Invisible Living World: live problems (original fibub questions). Ids start with c8s-micro-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c8s-micro-mag': {
    title: 'total magnification',
    make(r) {
      const e = choose(r, [5, 10, 15]), o = choose(r, [4, 10, 40, 100]), answer = e * o;
      return { e, o, q: `<p>A student uses a microscope with a ${e}× eyepiece and a ${o}× objective lens. What is the total magnification?</p>`, answer, unit: '×', tol: 0.01,
        hint: 'Multiply the eyepiece power by the objective power.', solution: steps(`Total = eyepiece × objective = ${e} × ${o}.`, `= <b>${answer}×</b>.`) };
    },
    verify: (x) => x.o * x.e,
  },
  'c8s-micro-size': {
    title: 'real size from the image',
    make(r) {
      const M = choose(r, [100, 200, 400, 1000]), img = pick(r, 2, 20, 2), answer = img / M;
      return { M, img, q: `<p>A cell looks ${img} mm long through a microscope that magnifies ${M} times. What is the real length of the cell in mm?</p>`, answer, unit: 'mm', tol: 0.01,
        hint: 'Real size = image size ÷ magnification.', solution: steps(`Real size = ${img} ÷ ${M}.`, `= <b>${n(answer, 3)} mm</b>.`) };
    },
    verify: (x) => x.img * (1 / x.M),
  },
  'c8s-micro-double': {
    title: 'bacteria doubling',
    make(r) {
      const dt = choose(r, [20, 30]), k = pick(r, 2, 6, 1), time = dt * k, answer = Math.pow(2, k);
      return { dt, time, k, q: `<p>One bacterium divides into two every ${dt} minutes. Starting from one bacterium, how many are there after ${time} minutes?</p>`, answer, unit: 'bacteria', tol: 0.01,
        hint: 'Count how many doublings fit in the time, then use 2 raised to that number.', solution: steps(`Doublings = ${time} ÷ ${dt} = ${k}.`, `Number = 2<sup>${k}</sup> = <b>${answer}</b>.`) };
    },
    verify: (x) => { let c = 1; for (let i = 0; i < x.time / x.dt; i++) c *= 2; return c; },
  },
  'c8s-micro-um': {
    title: 'micrometres to millimetres',
    make(r) {
      const um = choose(r, [2, 7, 50, 70, 100, 200]), answer = um / 1000;
      return { um, q: `<p>A plant cell is ${um} micrometres (µm) wide. Write this in millimetres (1 mm = 1000 µm).</p>`, answer, unit: 'mm', tol: 0.01,
        hint: 'Divide by 1000 to change µm to mm.', solution: steps(`1 mm = 1000 µm, so mm = µm ÷ 1000.`, `${um} ÷ 1000 = <b>${n(answer, 3)} mm</b>.`) };
    },
    verify: (x) => x.um * 0.001,
  },
  'c8s-micro-fov': {
    title: 'cells across a field of view',
    make(r) {
      const fov = choose(r, [500, 1000, 2000]), cell = choose(r, [50, 100, 250]), answer = fov / cell;
      return { fov, cell, q: `<p>The circle you see in a microscope is ${fov} µm across, and each cell is ${cell} µm wide. How many cells could be lined up across the circle?</p>`, answer, unit: 'cells', tol: 0.01,
        hint: 'Divide the width of the circle by the width of one cell.', solution: steps(`Cells = ${fov} ÷ ${cell}.`, `= <b>${n(answer, 3)}</b>.`) };
    },
    verify: (x) => 1 / (x.cell / x.fov),
  },
};
