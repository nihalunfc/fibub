// Class 12 Biology, Sexual Reproduction in Flowering Plants: live problems (original fibub questions). Ids start with c12b-flower-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c12b-flower-pollen': {
    title: 'pollen grains from pollen mother cells',
    make(r) {
      const pmc = pick(r, 20, 400, 20), tree = choose(r, ['an anther lobe', 'a young anther', 'a small anther']);
      return { pmc, q: `<p>${tree[0].toUpperCase() + tree.slice(1)} has ${pmc} pollen mother cells. Every one divides by meiosis and all the cells survive. How many pollen grains are formed?</p>`, answer: pmc * 4, unit: 'pollen grains', tol: 0, abs: 0.01,
        hint: 'One meiosis makes a tetrad of four microspores, and each microspore becomes one pollen grain.',
        solution: steps(`One pollen mother cell → 4 microspores (tetrad) → 4 pollen grains.`, `${pmc} × 4 = <b>${pmc * 4}</b> pollen grains.`) };
    },
    verify: (x) => { let g = 0; for (let i = 0; i < x.pmc; i++) g += 4; return g; },
  },
  'c12b-flower-endo': {
    title: 'chromosomes in endosperm, embryo and seed coat',
    make(r) {
      const two = choose(r, [14, 20, 24, 30, 32, 42]), part = choose(r, ['endosperm', 'embryo', 'egg cell', 'primary endosperm nucleus', 'seed coat', 'one polar nucleus']);
      const ans = { endosperm: 1.5 * two, embryo: two, 'egg cell': two / 2, 'primary endosperm nucleus': 1.5 * two, 'seed coat': two, 'one polar nucleus': two / 2 }[part];
      return { two, part, q: `<p>A flowering plant has 2n = ${two} chromosomes in its leaf cells. How many chromosomes are there in a cell of the <b>${part}</b>?</p>`, answer: ans, unit: 'chromosomes', tol: 0, abs: 0.01,
        hint: 'Gametes and the cells of the embryo sac are n; the zygote and the mother plant’s tissues are 2n; the endosperm comes from one male gamete (n) fusing with two polar nuclei (n + n).',
        solution: steps(`n = ${two}/2 = ${two / 2}.`, { endosperm: 'Endosperm is 3n (n + n + n).', embryo: 'The embryo grows from the zygote: 2n.', 'egg cell': 'The egg is a gamete: n.', 'primary endosperm nucleus': 'Triple fusion makes 3n.', 'seed coat': 'The seed coat is made from the integuments of the ovule, which are mother-plant tissue: 2n.', 'one polar nucleus': 'Each polar nucleus is n.' }[part], `Answer: <b>${ans}</b> chromosomes.`) };
    },
    verify: (x) => { const nn = x.two / 2, mult = { endosperm: 3, embryo: 2, 'egg cell': 1, 'primary endosperm nucleus': 3, 'seed coat': 2, 'one polar nucleus': 1 }[x.part]; return nn * mult; },
  },
  'c12b-flower-meioses': {
    title: 'meiotic divisions needed to make seeds',
    make(r) {
      const seeds = pick(r, 8, 100, 4), ans = seeds * 1.25;
      return { seeds, q: `<p>A plant is to make ${seeds} seeds, each from a fertilised ovule. Each ovule needs one embryo sac and one pollen grain carrying the male gametes. How many meiotic divisions of mother cells (megaspore mother cells plus pollen mother cells) are needed at the very least?</p>`, answer: ans, unit: 'meioses', tol: 0, abs: 0.01,
        hint: 'One megaspore mother cell makes one functional embryo sac; one pollen mother cell makes 4 pollen grains.',
        solution: steps(`Embryo sacs: ${seeds} seeds need ${seeds} embryo sacs, so ${seeds} megaspore mother cells.`, `Pollen grains: ${seeds} are needed; each meiosis of a pollen mother cell gives 4, so ${seeds} ÷ 4 = ${seeds / 4}.`, `Total = ${seeds} + ${seeds / 4} = <b>${n(ans)}</b>.`) };
    },
    verify: (x) => { let mmc = 0, pmc = 0, grains = 0; for (let s = 0; s < x.seeds; s++) { mmc++; if (grains === 0) { pmc++; grains = 4; } grains--; } return mmc + pmc; },
  },
  'c12b-flower-gametes': {
    title: 'male gametes needed for a fruit',
    make(r) {
      const seeds = pick(r, 2, 12, 1), fruit = choose(r, ['pea pod', 'tomato', 'guava', 'papaya']);
      return { seeds, q: `<p>A ${fruit} develops with ${seeds} seeds. Each seed comes from one fertilised ovule, and every ovule received its own pollen tube. How many male gametes were used in all (counting both the one for the egg and the one for the endosperm)?</p>`, answer: 2 * seeds, unit: 'male gametes', tol: 0, abs: 0.01,
        hint: 'Double fertilisation: each ovule uses two male gametes.',
        solution: steps('In one ovule: gamete 1 + egg → zygote; gamete 2 + two polar nuclei → primary endosperm nucleus.', `${seeds} seeds × 2 = <b>${2 * seeds}</b> male gametes (from ${seeds} pollen tubes).`) };
    },
    verify: (x) => { let g = 0; for (let i = 0; i < x.seeds; i++) g += 1 + 1; return g; },
  },
  'c12b-flower-tubespeed': {
    title: 'time for a pollen tube to reach the ovule',
    make(r) {
      const L = choose(r, [2, 5, 8, 12, 20, 30]), v = pick(r, 100, 400, 50), t = L * 1e4 / v / 60;
      return { L, v, q: `<p>In a flower the style is ${L} cm long. A pollen tube grows at ${v} µm per minute. How many hours does it take to reach the ovary? (1 cm = 10 000 µm.)</p>`, answer: t, unit: 'hours', tol: 0.02,
        hint: 'Time = length ÷ speed. Change cm to µm first, then minutes to hours.',
        solution: steps(`Length = ${L} cm = ${n(L * 1e4)} µm.`, `Time = ${n(L * 1e4)} ÷ ${v} = ${n(L * 1e4 / v)} minutes.`, `÷ 60 = <b>${n(t)} hours</b>.`) };
    },
    verify: (x) => (x.L * 1e4) / (x.v * 60),
  },
};
