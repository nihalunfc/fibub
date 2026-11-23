// Class 11 Biology, Biological Classification: live problems (original fibub questions). Ids start with c11b-bclass-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11b-bclass-magnify': {
    title: 'magnification of a bacterium',
    make(r) {
      const um = choose(r, [1, 2, 3, 5]), mm = choose(r, [10, 15, 20, 30]);
      return { um, mm, q: `<p>A rod-shaped bacterium is ${um} µm long. In a micrograph it measures ${mm} mm. What is the magnification?</p>`, answer: mm * 1000 / um, unit: '×', tol: 0.01,
        hint: 'Magnification = image size ÷ real size. Change both to the same unit (1 mm = 1000 µm).', solution: steps(`Image = ${mm} mm = ${n(mm * 1000)} µm.`, `Magnification = ${n(mm * 1000)} ÷ ${um} = <b>${n(mm * 1000 / um)} ×</b>.`) };
    },
    verify: (x) => (x.mm / 1000) / (x.um / 1e6),
  },
  'c11b-bclass-nm': {
    title: 'viruses in a row',
    make(r) {
      const L = choose(r, [100, 200, 300, 400]), mm = choose(r, [1, 2, 5]);
      return { L, mm, q: `<p>A rod-shaped virus is ${L} nm long. How many of them placed end to end would make a line ${mm} mm long? (1 mm = 1,000,000 nm)</p>`, answer: mm * 1e6 / L, unit: 'viruses', tol: 0.01,
        hint: 'Divide the length of the line by the length of one virus, in the same unit.', solution: steps(`${mm} mm = ${n(mm * 1e6)} nm.`, `Number = ${n(mm * 1e6)} ÷ ${L} = <b>${n(mm * 1e6 / L)}</b>.`) };
    },
    verify: (x) => (x.mm * 1e-3) / (x.L * 1e-9),
  },
  'c11b-bclass-ploidy': {
    title: 'chromosomes in a fungal life cycle',
    make(r) {
      const nn = choose(r, [4, 6, 8, 10, 12]);
      return { nn, q: `<p>The haploid nuclei of a fungus have n = ${nn} chromosomes. After plasmogamy a cell contains two nuclei, one from each parent hypha. How many chromosomes are there in that whole cell? (Then karyogamy gives one nucleus with the same total.)</p>`, answer: 2 * nn, unit: 'chromosomes', tol: 0.001,
        hint: 'Two nuclei, each with n chromosomes, sit together in one cell.', solution: steps(`Each nucleus has n = ${nn}.`, `Two nuclei: ${nn} + ${nn} = <b>${2 * nn}</b> chromosomes in the cell. After karyogamy one 2n nucleus has ${2 * nn}.`) };
    },
    verify: (x) => x.nn + x.nn,
  },
  'c11b-bclass-burst': {
    title: 'phage numbers after several cycles',
    make(r) {
      const b = choose(r, [20, 50, 100]), c = choose(r, [2, 3]);
      return { b, c, q: `<p>One phage infects a bacterium and the lytic cycle releases ${b} new phages. Suppose every new phage infects a new bacterium and also releases ${b} phages. How many phages exist after ${c} complete lytic cycles, starting from one?</p>`, answer: b ** c, unit: 'phages', tol: 0.001,
        hint: 'Each cycle multiplies the number by the burst size.', solution: steps(`After 1 cycle: ${b}.`, `After ${c} cycles: ${b}<sup>${c}</sup> = <b>${n(b ** c)}</b>.`) };
    },
    verify: (x) => { let p = 1; for (let i = 0; i < x.c; i++) p *= x.b; return p; },
  },
};
