// Live problems for Sexual reproduction in flowering plants.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

const CELLS = [
  ['an endosperm cell', 3, 'endosperm comes from the primary endosperm nucleus: 1 male gamete (n) + 2 polar nuclei (n + n) = 3n'],
  ['a synergid', 1, 'synergids are cells of the embryo sac, which is the female gametophyte: n'],
  ['an antipodal cell', 1, 'antipodals belong to the female gametophyte: n'],
  ['a nucellus cell', 2, 'the nucellus is tissue of the parent plant (sporophyte): 2n'],
  ['a cell of the embryo', 2, 'the embryo grows from the zygote (n + n): 2n'],
  ['the generative cell of a pollen grain', 1, 'the pollen grain is the male gametophyte: n'],
  ['an integument cell', 2, 'integuments are parent (sporophyte) tissue: 2n'],
  ['a cell of the seed coat', 2, 'the seed coat comes from the integuments, which are parent tissue: 2n'],
];

export default {
  'prp-meiosis-seeds': {
    title: 'meiotic divisions needed for a number of seeds',
    make(r) {
      const seeds = pick(r, 20, 400, 4);
      const female = seeds, male = seeds / 4, answer = female + male;
      return { seeds,
        q: `<p>A plant must form ${seeds} seeds, each from one ovule fertilised by one pollen grain. What is the smallest number of meiotic divisions needed (in anthers and ovules together)?</p>`,
        answer, unit: 'meioses', tol: 0, abs: 0.5,
        hint: 'Each megaspore mother cell gives one functional megaspore, so one embryo sac. Each microspore mother cell gives four pollen grains.',
        solution: steps(`Ovules: ${seeds} embryo sacs need ${seeds} meioses (three of the four megaspores die).`, `Pollen: ${seeds} pollen grains ÷ 4 per meiosis = ${male} meioses.`, `Total = ${seeds} + ${male} = <b>${answer}</b>.`) };
    },
    verify: (x) => x.seeds * 1.25,
  },
  'prp-ploidy': {
    title: 'chromosome number in a cell of the flower or seed',
    make(r) {
      const n2 = pick(r, 8, 48, 2), [cell, f, why] = CELLS[Math.floor(r() * CELLS.length)];
      const answer = (n2 / 2) * f;
      return { n2, f,
        q: `<p>The leaf cells of a flowering plant have ${n2} chromosomes. How many chromosomes are there in ${cell}?</p>`,
        answer, unit: 'chromosomes', tol: 0, abs: 0.5,
        hint: 'Leaf cells are 2n. Find n first, then ask: is this cell from the gametophyte (n), the parent plant or embryo (2n), or the endosperm (3n)?',
        solution: steps(`2n = ${n2}, so n = ${n2 / 2}.`, `Here ${why}.`, `${f} × ${n2 / 2} = <b>${answer}</b>.`) };
    },
    verify: (x) => x.f * x.n2 / 2,
  },
};
