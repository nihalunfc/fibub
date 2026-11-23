// Class 11 Biology, Cell: The Unit of Life: live problems (original fibub questions). Ids start with c11b-cell-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11b-cell-mag': {
    title: 'real size from a magnified image',
    make(r) {
      const img = pick(r, 20, 90, 5), mag = choose(r, [100, 400, 1000, 2000]);
      return { img, mag, q: `<p>A cheek cell appears ${img} mm long in a photograph taken at a magnification of ${n(mag)}×. What is its real length in micrometres (µm)?</p>`, answer: img * 1000 / mag, unit: 'µm', tol: 0.02,
        hint: 'Real size = image size ÷ magnification. 1 mm = 1000 µm.',
        solution: steps(`Real length = ${img} mm ÷ ${n(mag)} = ${n(img / mag, 3)} mm.`, `In µm: ${n(img / mag, 3)} × 1000 = <b>${n(img * 1000 / mag)} µm</b>.`) };
    },
    verify: (x) => 1000 * x.img / x.mag,
  },
  'c11b-cell-scalebar': {
    title: 'size from a scale bar',
    make(r) {
      const bar = choose(r, [10, 15, 20, 25]), u = choose(r, [0.5, 1, 2, 5]), m = pick(r, 12, 60, 4);
      return { bar, u, m, q: `<p>An electron micrograph has a scale bar ${bar} mm long that stands for ${u} µm. A mitochondrion measures ${m} mm on the picture. How long is it in reality, in µm?</p>`, answer: m * u / bar, unit: 'µm', tol: 0.02,
        hint: 'Find how many µm one mm of picture stands for: u ÷ bar. Then multiply by the length measured.',
        solution: steps(`1 mm on the picture = ${u} ÷ ${bar} = ${n(u / bar, 3)} µm.`, `Length = ${m} × ${n(u / bar, 3)} = <b>${n(m * u / bar, 3)} µm</b>.`) };
    },
    verify: (x) => (x.m / x.bar) * x.u,
  },
  'c11b-cell-sv': {
    title: 'surface to volume ratio of a cell',
    make(r) {
      const L = choose(r, [2, 4, 5, 10, 20, 25]);
      return { L, q: `<p>Take a cell as a cube of side ${L} µm. What is the ratio of its surface area to its volume (S/V) in µm⁻¹?</p>`, answer: 6 / L, unit: 'per µm', tol: 0.02,
        hint: 'S = 6L² (six faces), V = L³.',
        solution: steps(`S = 6 × ${L}² = ${6 * L * L} µm².`, `V = ${L}³ = ${L ** 3} µm³.`, `S/V = ${6 * L * L} ÷ ${L ** 3} = <b>${n(6 / L, 3)} per µm</b>. (In general S/V = 6/L.)`) };
    },
    verify: (x) => (6 * x.L ** 2) / x.L ** 3,
  },
  'c11b-cell-line': {
    title: 'cells along a line',
    make(r) {
      const d = choose(r, [5, 7, 8, 10]), len = choose(r, [1, 2, 5]);
      return { d, len, q: `<p>Red blood cells are about ${d} µm across. How many of them placed side by side in a row would make a line ${len} mm long (1 mm = 1000 µm)?</p>`, answer: len * 1000 / d, unit: 'cells', tol: 0.02,
        hint: 'Convert the length to µm, then divide by the width of one cell.',
        solution: steps(`${len} mm = ${n(len * 1000)} µm.`, `Number = ${n(len * 1000)} ÷ ${d} = <b>${n(len * 1000 / d)}</b>.`) };
    },
    verify: (x) => 1e3 * x.len * (1 / x.d),
  },
};
