// #1132 Cell division. The chromosome and DNA tables were checked against a separate step-by-step simulation
// written here (each chromosome an object with a chromatid count, copied, split and shared out between cells),
// gamete counts against the textbook 2^23 = 8,388,608 for humans, and the mitotic index against hand-worked counts.
import { MITOSIS, MEIOSIS, gameteTypes, zygoteTypes, sameGamete, mitoticIndex, phaseHours, field, tally, rng, SHARE, PHASES } from '../../src/lib/sci/celldiv.ts';

export default async (check) => {
  // independent simulation: a cell is a list of chromosomes [chromatids]; DNA per chromatid = 1C ÷ n
  function sim(n2, steps) {
    const n = n2 / 2; let cells = [Array.from({ length: n2 }, () => 1)]; const out = {};
    const dna = (c) => (c.reduce((s, x) => s + x, 0) / n); // in C units
    for (const st of steps) {
      if (st === 'copy') cells = cells.map((c) => c.map(() => 2));
      if (st === 'splitChromatids') cells = cells.map((c) => c.flatMap((x) => (x === 2 ? [1, 1] : [x]))); // anaphase: cell holds them all
      if (st === 'divideHalfChromatids') cells = cells.flatMap((c) => [c.slice(0, c.length / 2), c.slice(c.length / 2)]);
      if (st === 'divideHomologues') cells = cells.flatMap((c) => [c.slice(0, c.length / 2), c.slice(c.length / 2)]);
      out[st] = out[st] ?? []; out[st].push({ chrom: cells[0].length, dna: dna(cells[0]), cells: cells.length });
    }
    return out;
  }
  for (const n2 of [4, 8, 46]) {
    const m = sim(n2, ['copy', 'splitChromatids', 'divideHalfChromatids']);
    const by = Object.fromEntries(MITOSIS.map((s) => [s.id, s]));
    check(`division: mitosis 2n=${n2} matches simulation`, by.s.chrom(n2) === m.copy[0].chrom && by.s.dna === m.copy[0].dna && by.ana.chrom(n2) === m.splitChromatids[0].chrom && by.ana.dna === m.splitChromatids[0].dna
      && by.telo.chrom(n2) === m.divideHalfChromatids[0].chrom && by.telo.dna === m.divideHalfChromatids[0].dna && by.telo.cells === m.divideHalfChromatids[0].cells && by.g1.dna === 2);
    const z = sim(n2, ['copy', 'divideHomologues', 'splitChromatids', 'divideHalfChromatids']);
    const my = Object.fromEntries(MEIOSIS.map((s) => [s.id, s]));
    check(`division: meiosis 2n=${n2} matches simulation`, my.s.dna === z.copy[0].dna && my.telo1.chrom(n2) === z.divideHomologues[0].chrom && my.telo1.dna === z.divideHomologues[0].dna && my.telo1.cells === z.divideHomologues[0].cells
      && my.ana2.chrom(n2) === z.splitChromatids[0].chrom && my.ana2.dna === z.splitChromatids[0].dna && my.telo2.chrom(n2) === z.divideHalfChromatids[0].chrom && my.telo2.dna === z.divideHalfChromatids[0].dna && my.telo2.cells === z.divideHalfChromatids[0].cells);
  }
  check('division: humans 2n = 46 give n = 23 gametes with 1C', MEIOSIS.at(-1).chrom(46) === 23 && MEIOSIS.at(-1).dna === 1 && MITOSIS.at(-1).chrom(46) === 46);
  check('division: 2^23 = 8,388,608 kinds of human gamete', gameteTypes(23) === 8388608 && zygoteTypes(23) === 8388608 ** 2 && sameGamete(2) === 0.25);
  check('division: DNA never goes up during a division, only in S', MITOSIS.slice(3).every((s, k, a) => !k || s.dna <= a[k - 1].dna) && MEIOSIS.slice(1).every((s, k, a) => !k || s.dna <= a[k - 1].dna));
  const c = { interphase: 180, prophase: 10, metaphase: 4, anaphase: 2, telophase: 4 };
  check('division: mitotic index 20 ÷ 200 = 10 %', mitoticIndex(c) === 0.1 && mitoticIndex({ interphase: 0, prophase: 0, metaphase: 0, anaphase: 0, telophase: 0 }) === 0);
  check('division: prophase 10 of 200 cells in a 24 h cycle = 1.2 h', Math.abs(phaseHours(c, 'prophase') - 1.2) < 1e-12 && Math.abs(phaseHours(c, 'interphase', 20) - 18) < 1e-12);
  check('division: shares add to 1', Math.abs(PHASES.reduce((s, p) => s + SHARE[p], 0) - 1) < 1e-12);
  const big = tally(field(200000, rng(11)));
  check('division: large random field matches the shares', PHASES.every((p) => Math.abs(big[p] / 200000 - SHARE[p]) < 0.003) && Math.abs(mitoticIndex(big) - 0.1) < 0.003);
  check('division: seeded fields repeat', JSON.stringify(field(50, rng(4))) === JSON.stringify(field(50, rng(4))) && field(50, rng(4)).length === 50);
};
