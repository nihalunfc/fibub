// Class 9 Science (Exploration), Chapter 2 Cell: The Building Block of Life: live problems (original fibub questions). Ids start with c9s-cell-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c9s-cell-mag': {
    title: 'total magnification of a microscope',
    make(r) {
      const eye = choose(r, [5, 10, 15]), obj = choose(r, [4, 10, 40, 45, 100]), answer = eye * obj;
      return { eye, obj, q: `<p>A student uses a ${eye}× eyepiece with a ${obj}× objective lens. What is the total magnification?</p>`, answer, unit: '×', tol: 0, abs: 0.01,
        hint: 'Total magnification is the eyepiece power multiplied by the objective power.',
        solution: steps(`Total = eyepiece × objective = ${eye} × ${obj}.`, `= <b>${answer}×</b>.`) };
    },
    verify: (x) => (x.obj * x.eye),
  },
  'c9s-cell-realsize': {
    title: 'true size of a cell from its drawing',
    make(r) {
      const M = choose(r, [100, 200, 400, 500]), real = pick(r, 10, 80, 5), drawn = real * M / 1000; // mm
      return { M, real, drawn, q: `<p>Under a microscope at ${M}×, a cell appears ${n(drawn, 4)} mm long in a drawing. What is its true length in micrometres (µm)? (1 mm = 1000 µm)</p>`, answer: real, unit: 'µm', tol: 0.01,
        hint: 'True size = image size ÷ magnification. Change mm to µm by multiplying by 1000.',
        solution: steps(`Image = ${n(drawn, 4)} mm = ${n(drawn * 1000, 6)} µm.`, `True size = ${n(drawn * 1000, 6)} ÷ ${M} = <b>${real} µm</b>.`) };
    },
    verify: (x) => ((x.drawn * 1000) / x.M),
  },
  'c9s-cell-sav': {
    title: 'surface area to volume ratio of a cube-shaped cell',
    make(r) {
      const s = pick(r, 1, 12), answer = 6 / s;
      return { s, q: `<p>A cell is modelled as a cube of side ${s} µm. Find the ratio of its surface area to its volume (in µm⁻¹).</p>`, answer, unit: 'µm⁻¹', tol: 0.01,
        hint: 'Surface area of a cube = 6 × side²; volume = side³.',
        solution: steps(`Surface area = 6 × ${s}² = ${6 * s * s} µm².`, `Volume = ${s}³ = ${s ** 3} µm³.`, `Ratio = ${6 * s * s} ÷ ${s ** 3} = <b>${n(answer, 4)}</b> µm⁻¹. It falls as the cell grows.`) };
    },
    verify: (x) => (6 * x.s * x.s) / x.s ** 3,
  },
  'c9s-cell-potato': {
    title: 'percentage change in the mass of a potato strip',
    make(r) {
      const m0 = pick(r, 4, 12, 0.5), pct = choose(r, [-18, -12, -8, 6, 9, 14]), m1 = +(m0 * (1 + pct / 100)).toFixed(3);
      return { m0, m1, q: `<p>A potato strip weighs ${n(m0, 4)} g. After an hour in a solution it weighs ${n(m1, 5)} g. What is the percentage change in mass? (Give a negative number for a loss.)</p>`, answer: +(((m1 - m0) / m0) * 100).toFixed(4), unit: '%', tol: 0.01, abs: 0.05,
        hint: 'Percentage change = (new mass − old mass) ÷ old mass × 100.',
        solution: steps(`Change = ${n(m1, 5)} − ${n(m0, 4)} = ${n(m1 - m0, 4)} g.`, `Percentage change = ${n(m1 - m0, 4)} ÷ ${n(m0, 4)} × 100 = <b>${n(((m1 - m0) / m0) * 100, 4)}%</b>. A loss means the strip lost water: the solution was stronger than the cell sap.`) };
    },
    verify: (x) => ((x.m1 / x.m0 - 1) * 100),
  },
  'c9s-cell-division': {
    title: 'cells after repeated division',
    make(r) {
      const d = pick(r, 3, 10), answer = 2 ** d;
      return { d, q: `<p>One bacterial cell divides into two, each of those divides again, and so on. How many cells are there after ${d} rounds of division?</p>`, answer, unit: 'cells', tol: 0, abs: 0.01,
        hint: 'Each round doubles the number of cells.',
        solution: steps(`Each round doubles the number: 1 → 2 → 4 → …`, `After ${d} rounds: 2<sup>${d}</sup> = <b>${answer}</b> cells.`) };
    },
    verify: (x) => { let c = 1; for (let i = 0; i < x.d; i++) c *= 2; return c; },
  },
};
