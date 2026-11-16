// "Solve my numbers" for the cell division page: chromosomes, chromatids and DNA in a cell at a chosen stage of
// mitosis or meiosis from the body-cell number 2n, the number of different gametes (2ⁿ) and zygotes, and the mitotic
// index and time in a stage from root tip counts. Plain maths, no DOM. Engine: src/lib/learn/solvecore-b.ts.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { MITOSIS, MEIOSIS, gameteTypes, zygoteTypes } from './celldiv.ts';

const big = (x: number) => (Number.isSafeInteger(x) ? x.toLocaleString('en') : sf(x, 4));
const TIP_CHROM = 'Common mistake: counting chromatids as chromosomes. A chromosome is counted by its centromere, so after DNA is copied the number stays 2n (the DNA doubles), and it only doubles for a moment in anaphase when the centromeres split.';
const TIP_GAM = 'Common mistake: using 2ⁿ with n as the body-cell number. Use n = the number of chromosome PAIRS = 2n ÷ 2. Crossing over adds even more variety on top of this.';
const TIP_MI = 'Common mistake: counting cells in interphase as dividing. Only prophase, metaphase, anaphase and telophase count as dividing. Count a few hundred cells for a fair estimate.';

export function cellSolve(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const f = c.find;
  if (f === 'stage') {
    const n2 = i.n2.v;
    if (!Number.isInteger(n2) || n2 < 2 || n2 % 2) return { error: 'The body-cell number 2n must be an even whole number of 2 or more (for example 46 for humans, 14 for peas).' };
    if (n2 > 1000) return { error: 'That chromosome number is too big for this page. Try a number up to 1000.' };
    const meio = c.ch.div === 'meiosis', list = meio ? MEIOSIS : MITOSIS;
    const st = list.find((x) => x.id === (meio ? c.ch.stageI : c.ch.stageM)) ?? list[0];
    const chrom = st.chrom(n2), chromatids = (st.dna * n2) / 2, per = chrom ? chromatids / chrom : 0;
    const where = st.cells > 1 ? `each of the ${st.cells} cells` : 'the cell';
    const lines = [
      `Body cell: 2n = ${n2}, so n = ${n2 / 2} (one set).`,
      `Stage: ${st.name} (${meio ? 'meiosis' : 'mitosis'}). ${st.note}`,
      `Chromosomes in ${where}: ${big(chrom)}${st.id === 'ana' ? ' (the centromeres have split, so each chromatid now counts as a chromosome: 2 × ' + n2 + ')' : ''}.`,
      `DNA: ${st.dna}C in ${where}, where 1C is the DNA of one gamete (one set of ${n2 / 2} chromosomes).`,
      `Chromatids in ${where}: ${st.dna} × ${n2 / 2} = ${big(chromatids)} (${per === 2 ? 'each chromosome has 2 sister chromatids' : 'each chromosome is a single chromatid'}).`,
    ];
    return { answer: `${st.name} of ${meio ? 'meiosis' : 'mitosis'} in a cell with 2n = ${n2}: ${big(chrom)} chromosomes in ${where}, ${st.dna}C of DNA, ${st.cells} cell${st.cells > 1 ? 's' : ''} at the end of this stage.`, lines, tip: TIP_CHROM };
  }
  if (f === 'gam') {
    const n2 = i.n2.v;
    if (!Number.isInteger(n2) || n2 < 2 || n2 % 2) return { error: 'The body-cell number 2n must be an even whole number of 2 or more (for example 46 for humans, 14 for peas).' };
    if (n2 > 2000) return { error: 'That chromosome number is too big for this page. Try a number up to 2000.' };
    const pairs = n2 / 2, g = gameteTypes(pairs), z = zygoteTypes(pairs);
    return {
      answer: `With 2n = ${n2} there are ${pairs} chromosome pairs, giving 2^${pairs} = ${big(g)} different gametes from independent assortment alone.`,
      lines: [`Pairs: n = 2n ÷ 2 = ${n2} ÷ 2 = ${pairs}.`, `Each pair can line up in 2 ways in metaphase I, so gametes = 2^n = 2^${pairs} = ${big(g)}.`, `A child gets one gamete from each parent: (2^${pairs})² = 2^${n2} = ${big(z)} different chromosome mixes.`, `Chance two gametes from the same parent are identical = 1 ÷ ${big(g)}.`],
      tip: TIP_GAM,
    };
  }
  // mi: mitotic index and time in a stage
  const tot = i.tot.v, div = i.dv.v, inp = i.inph, cyc = i.cyc && !i.cyc.blank ? i.cyc.v : 24;
  if (!Number.isInteger(tot) || tot < 1) return { error: 'The total number of cells counted must be a whole number of 1 or more.' };
  if (!Number.isInteger(div) || div < 0) return { error: 'The number of dividing cells must be a whole number, 0 or more.' };
  if (div > tot) return { error: 'You cannot have more dividing cells than cells counted. Check the two numbers.' };
  if (!(cyc > 0)) return { error: 'The length of the cell cycle must be more than 0 hours.' };
  const mi = div / tot, lines = ['Mitotic index = dividing cells ÷ all cells counted', `= ${div} ÷ ${tot} = ${sf(mi, 4)} = ${sf(mi * 100, 3)}%`];
  let ans = `The mitotic index is ${sf(mi * 100, 3)}% (${div} of ${tot} cells dividing).`;
  if (inp && !inp.blank) {
    const k = inp.v;
    if (!Number.isInteger(k) || k < 0 || k > tot) return { error: 'The cells in the stage must be a whole number from 0 up to the total counted.' };
    const h = (k / tot) * cyc;
    lines.push(`Time in the stage = (cells in the stage ÷ all cells) × cycle length = ${k} ÷ ${tot} × ${sf(cyc)} h = ${sf(h, 3)} h (${sf(h * 60, 3)} min).`);
    ans += ` A stage with ${k} cells lasts about ${sf(h, 3)} h of a ${sf(cyc)} h cycle.`;
  }
  return { answer: ans, lines, tip: TIP_MI };
}

const stageOpts = (l: typeof MITOSIS) => l.map((s) => [s.id, s.name] as [string, string]);
export const CELL_SPEC: SSpec = {
  id: 'cell',
  finds: [['stage', 'Chromosomes and DNA at a stage'], ['gam', 'Number of different gametes'], ['mi', 'Mitotic index from counts']],
  fields: [
    { k: 'n2', label: 'Chromosomes in a body cell (2n)', ph: 'e.g. 46', show: (c) => c.find !== 'mi' },
    { k: 'div', label: 'Kind of division', kind: 'choice', options: [['mitosis', 'Mitosis'], ['meiosis', 'Meiosis']], def: 'mitosis', show: (c) => c.find === 'stage' },
    { k: 'stageM', label: 'Stage (mitosis)', kind: 'choice', options: stageOpts(MITOSIS), def: 'meta', show: (c) => c.find === 'stage' && c.ch.div !== 'meiosis' },
    { k: 'stageI', label: 'Stage (meiosis)', kind: 'choice', options: stageOpts(MEIOSIS), def: 'meta1', show: (c) => c.find === 'stage' && c.ch.div === 'meiosis' },
    { k: 'tot', label: 'Cells counted in all', ph: 'e.g. 200', show: (c) => c.find === 'mi' },
    { k: 'dv', label: 'Cells that are dividing (prophase to telophase)', ph: 'e.g. 20', show: (c) => c.find === 'mi' },
    { k: 'cyc', label: 'Length of the cell cycle (hours, optional)', optional: true, ph: 'blank means 24', show: (c) => c.find === 'mi' },
    { k: 'inph', label: 'Cells in one stage (optional, for its time)', optional: true, ph: 'e.g. 10', show: (c) => c.find === 'mi' },
  ],
  presets: [
    { name: 'Human cell (2n = 46) in metaphase of mitosis', find: 'stage', vals: { n2: '46' }, ch: { div: 'mitosis', stageM: 'meta' } },
    { name: 'Human cell in anaphase of mitosis', find: 'stage', vals: { n2: '46' }, ch: { div: 'mitosis', stageM: 'ana' } },
    { name: 'Pea cell (2n = 14) at the end of meiosis I', find: 'stage', vals: { n2: '14' }, ch: { div: 'meiosis', stageI: 'telo1' } },
    { name: 'Gametes from a human (2n = 46)', find: 'gam', vals: { n2: '46' } },
    { name: '20 of 200 root tip cells dividing, 10 in prophase', find: 'mi', vals: { tot: '200', dv: '20', inph: '10' } },
  ],
  solve: (i, c) => cellSolve(i, c),
};
