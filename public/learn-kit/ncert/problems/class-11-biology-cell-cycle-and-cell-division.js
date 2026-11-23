// Class 11 Biology, Cell Cycle and Cell Division: live problems (original fibub questions). Ids start with c11b-cycle-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11b-cycle-dna': {
    title: 'DNA amount through division',
    make(r) {
      const g1 = choose(r, [4, 6, 7, 8, 10]), [stage, f] = choose(r, [['in G2, before mitosis', 2], ['in each daughter cell after mitosis', 1], ['in each cell after meiosis I', 1], ['in each gamete after meiosis II', 0.5], ['at metaphase of mitosis', 2]]);
      return { g1, stage, f, q: `<p>A diploid cell has ${g1} pg of DNA in G1. How much DNA (in pg) is there ${stage}?</p>`, answer: g1 * f, unit: 'pg', tol: 0.01,
        hint: 'DNA doubles in S phase. Mitosis gives two cells with the G1 amount. Meiosis I halves the chromosome number but each chromosome still has two chromatids, so the amount per cell is the G1 amount; meiosis II halves it again.',
        solution: steps(`G1 = ${g1} pg. After S phase (G2, metaphase) = ${g1 * 2} pg.`, 'After mitosis each daughter is back to the G1 amount; after meiosis I each cell has the G1 amount too; after meiosis II each gamete has half of G1.', `Answer ${stage}: <b>${n(g1 * f)} pg</b>.`) };
    },
    verify: (x) => (x.stage.includes('G2') || x.stage.includes('metaphase') ? x.g1 * 2 : x.stage.includes('gamete') ? x.g1 / 2 : x.g1),
  },
  'c11b-cycle-chromatids': {
    title: 'chromosomes and chromatids',
    make(r) {
      const N2 = choose(r, [4, 8, 14, 20, 24, 46]);
      return { N2, q: `<p>A body cell of an organism has ${N2} chromosomes (2n). How many chromatids are there in one cell at metaphase of mitosis?</p>`, answer: 2 * N2, unit: 'chromatids', tol: 0.01,
        hint: 'After S phase every chromosome has two sister chromatids.',
        solution: steps(`Chromosomes = ${N2}, each with 2 sister chromatids.`, `Chromatids = 2 × ${N2} = <b>${2 * N2}</b>.`, 'At anaphase the centromeres split and each chromatid becomes a chromosome.') };
    },
    verify: (x) => x.N2 + x.N2,
  },
  'c11b-cycle-gametes': {
    title: 'kinds of gametes',
    make(r) {
      const k = pick(r, 3, 12);
      return { k, q: `<p>An organism has ${k} pairs of chromosomes. Ignoring crossing over, how many different kinds of gametes can one individual make by independent assortment?</p>`, answer: 2 ** k, unit: 'kinds', tol: 0.01,
        hint: 'Each pair can go either way, so the choices multiply: 2 × 2 × ... (once for each pair).',
        solution: steps(`Each of the ${k} pairs has 2 ways to line up.`, `Kinds = 2^${k} = <b>${n(2 ** k)}</b>.`) };
    },
    verify: (x) => Array.from({ length: x.k }).reduce((a) => a * 2, 1),
  },
  'c11b-cycle-growth': {
    title: 'cells after repeated division',
    make(r) {
      const T = choose(r, [2, 3, 4, 6]), D = choose(r, [12, 24, 36, 48]);
      return { T, D, q: `<p>One cell divides by mitosis every ${T} hours. If no cell dies, how many cells are there after ${D} hours?</p>`, answer: 2 ** (D / T), unit: 'cells', tol: 0.01,
        hint: 'Number of divisions = time ÷ time for one cycle. Each division doubles the number of cells.',
        solution: steps(`Divisions = ${D} ÷ ${T} = ${D / T}.`, `Cells = 2^${D / T} = <b>${n(2 ** (D / T))}</b>.`) };
    },
    verify: (x) => { let c = 1; for (let t = x.T; t <= x.D; t += x.T) c *= 2; return c; },
  },
  'c11b-cycle-index': {
    title: 'how long is M phase?',
    make(r) {
      const T = choose(r, [16, 20, 24, 30]), pct = choose(r, [2.5, 4, 5, 6]);
      return { T, pct, q: `<p>In a growing tissue every cell cycle takes ${T} hours. A count under the microscope finds ${pct} % of the cells in M phase (mitosis and cytokinesis). Estimate how many hours M phase lasts.</p>`, answer: T * pct / 100, unit: 'h', tol: 0.02,
        hint: 'The share of cells seen in a phase is about the share of the cycle that the phase lasts.',
        solution: steps(`Duration of M = fraction in M × cycle time = ${pct} % of ${T} h.`, `= ${pct} ÷ 100 × ${T} = <b>${n(T * pct / 100)} h</b>.`) };
    },
    verify: (x) => (x.pct / 100) * x.T,
  },
};
