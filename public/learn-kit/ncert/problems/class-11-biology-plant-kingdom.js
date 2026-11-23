// Class 11 Biology, Plant Kingdom: live problems (original fibub questions). Ids start with c11b-plantk-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11b-plantk-spores': {
    title: 'spores from a moss capsule',
    make(r) {
      const m = choose(r, [50, 100, 250, 500, 1000]);
      return { m, q: `<p>A moss capsule has ${n(m)} spore mother cells. Each divides by meiosis. How many haploid spores can the capsule release?</p>`, answer: 4 * m, unit: 'spores', tol: 0.001,
        hint: 'One meiosis gives four haploid cells.', solution: steps(`Each spore mother cell makes 4 spores.`, `${n(m)} × 4 = <b>${n(4 * m)}</b> spores.`) };
    },
    verify: (x) => { let t = 0; for (let i = 0; i < x.m; i++) t += 4; return t; },
  },
  'c11b-plantk-chrom': {
    title: 'chromosomes in a fern life cycle',
    make(r) {
      const d = choose(r, [20, 30, 50, 66, 100, 124]);
      return { d, q: `<p>The cells of a fern plant (sporophyte) have ${d} chromosomes (2n). How many chromosomes are in one cell of its prothallus?</p>`, answer: d / 2, unit: 'chromosomes', tol: 0.001,
        hint: 'The prothallus is the gametophyte: haploid (n).', solution: steps(`The sporophyte is diploid: 2n = ${d}.`, `The gametophyte is haploid, so n = ${d} ÷ 2 = <b>${d / 2}</b>.`) };
    },
    verify: (x) => x.d - x.d / 2,
  },
  'c11b-plantk-depth': {
    title: 'blue light at depth',
    make(r) {
      const d = choose(r, [10, 20, 30, 50]), k = choose(r, [0.02, 0.035, 0.05]);
      return { d, k, q: `<p>In clear sea water blue light falls by a factor of e<sup>−${k} per metre</sup>: the fraction left at depth d is e<sup>−k d</sup> with k = ${k} per metre. What percentage of surface blue light is left at ${d} m?</p>`, answer: 100 * Math.exp(-k * d), unit: '%', tol: 0.02,
        hint: 'Work out k × d, then e to the minus that, then × 100.', solution: steps(`k d = ${k} × ${d} = ${n(k * d)}.`, `e<sup>−${n(k * d)}</sup> = ${n(Math.exp(-k * d), 3)}.`, `Percentage = <b>${n(100 * Math.exp(-k * d))} %</b>.`) };
    },
    verify: (x) => { let f = 1; for (let i = 0; i < x.d; i++) f *= Math.exp(-x.k); return 100 * f; },
  },
  'c11b-plantk-pollen': {
    title: 'pollen from a pine cone',
    make(r) {
      const s = choose(r, [20, 30, 40, 60]), p = choose(r, [10, 20, 25, 50]);
      return { s, p, q: `<p>A male pine cone has ${s} scales (microsporophylls), each with 2 microsporangia. Every microsporangium has ${p} pollen mother cells and each pollen mother cell divides by meiosis into 4 pollen grains. How many pollen grains does the cone make?</p>`, answer: s * 2 * p * 4, unit: 'pollen grains', tol: 0.001,
        hint: 'Multiply: scales × 2 × pollen mother cells × 4.', solution: steps(`Microsporangia = ${s} × 2 = ${2 * s}.`, `Pollen mother cells = ${2 * s} × ${p} = ${2 * s * p}.`, `Pollen grains = ${2 * s * p} × 4 = <b>${n(8 * s * p)}</b>.`) };
    },
    verify: (x) => { let t = 0; for (let i = 0; i < x.s; i++) for (let j = 0; j < 2; j++) for (let k = 0; k < x.p; k++) t += 4; return t; },
  },
};
