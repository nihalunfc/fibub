// Class 12 Biology, Principles of Inheritance and Variation: live problems (original fibub questions). Ids start with c12b-inherit-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c12b-inherit-mono': {
    title: 'offspring counts from a monohybrid cross',
    make(r) {
      const N = pick(r, 40, 400, 40), cls = choose(r, [['tall plants', 3 / 4], ['dwarf plants', 1 / 4], ['heterozygous (Tt) plants', 1 / 2], ['true-breeding tall (TT) plants', 1 / 4]]);
      return { N, cls, q: `<p>Two heterozygous tall pea plants (Tt × Tt) are crossed and give ${N} offspring. How many <b>${cls[0]}</b> do you expect? (T = tall is dominant over t = dwarf.)</p>`, answer: N * cls[1], unit: 'plants', tol: 0.01,
        hint: 'Tt × Tt gives TT : Tt : tt = 1 : 2 : 1, so tall : dwarf = 3 : 1.',
        solution: steps('Gametes of each parent: ½ T and ½ t. The 2 × 2 square gives 1 TT : 2 Tt : 1 tt.', `Fraction of ${cls[0]} = ${cls[1] === 0.75 ? '3/4' : cls[1] === 0.5 ? '1/2' : '1/4'}.`, `${N} × ${cls[1]} = <b>${n(N * cls[1])}</b>.`) };
    },
    verify: (x) => { const sq = ['TT', 'Tt', 'Tt', 'tt'], f = { 'tall plants': (g) => /T/.test(g), 'dwarf plants': (g) => g === 'tt', 'heterozygous (Tt) plants': (g) => g === 'Tt', 'true-breeding tall (TT) plants': (g) => g === 'TT' }[x.cls[0]]; return x.N * sq.filter(f).length / 4; },
  },
  'c12b-inherit-di': {
    title: 'dihybrid cross counts',
    make(r) {
      const N = pick(r, 160, 1600, 160), cls = choose(r, [['round yellow', 9], ['round green', 3], ['wrinkled yellow', 3], ['wrinkled green', 1]]);
      return { N, cls, q: `<p>Pea plants heterozygous for seed shape and colour (RrYy) are crossed with each other (round R and yellow Y are dominant). Out of ${N} seeds, how many are expected to be <b>${cls[0]}</b>?</p>`, answer: N * cls[1] / 16, unit: 'seeds', tol: 0.01,
        hint: 'The ratio is 9 : 3 : 3 : 1 out of 16.',
        solution: steps('Each parent makes 4 gamete types (RY, Ry, rY, ry), so the square has 16 cells with phenotypes in the ratio 9 : 3 : 3 : 1.', `${cls[0]} is ${cls[1]} parts of 16.`, `${N} × ${cls[1]}/16 = <b>${n(N * cls[1] / 16)}</b>.`) };
    },
    verify: (x) => { const G = ['RY', 'Ry', 'rY', 'ry']; let c = 0; for (const a of G) for (const b of G) { const sh = /R/.test(a[0] + b[0]) ? 'round' : 'wrinkled', co = /Y/.test(a[1] + b[1]) ? 'yellow' : 'green'; if (`${sh} ${co}` === x.cls[0]) c++; } return x.N * c / 16; },
  },
  'c12b-inherit-prob': {
    title: 'chance that at least one child is affected',
    make(r) {
      const k = pick(r, 1, 5, 1), p = 100 * (1 - 0.75 ** k);
      return { k, q: `<p>Both parents are carriers (Aa) of an autosomal recessive disorder. What is the chance, in percent, that <b>at least one</b> of their ${k} child${k > 1 ? 'ren' : ''} is affected (aa)?</p>`, answer: p, unit: '%', tol: 0.01,
        hint: 'Each child has a 1/4 chance of aa. Find the chance that none is affected, then subtract from 1.',
        solution: steps('Chance a child is not affected = 3/4.', `Chance none of ${k} is affected = (3/4)<sup>${k}</sup> = ${n(0.75 ** k, 4)}.`, `At least one: 1 − ${n(0.75 ** k, 4)} = ${n(1 - 0.75 ** k, 4)}, which is <b>${n(p)} %</b>.`, 'Each child is an independent event: earlier children do not change the chance for the next.') };
    },
    verify: (x) => { let none = 1; for (let i = 0; i < x.k; i++) none *= 0.75; return 100 * (1 - none); },
  },
  'c12b-inherit-gametes': {
    title: 'kinds of gametes from a genotype',
    make(r) {
      const het = pick(r, 1, 5, 1), hom = pick(r, 0, 2, 1), gt = 'AaBbCcDdEe'.slice(0, 2 * het) + 'FFGG'.slice(0, 2 * hom);
      return { het, hom, q: `<p>How many different kinds of gametes can an individual of genotype <b>${gt}</b> make? (The genes assort independently.)</p>`, answer: 2 ** het, unit: 'kinds', tol: 0, abs: 0.01,
        hint: 'Each heterozygous gene gives 2 choices; a homozygous gene gives only 1.',
        solution: steps(`Heterozygous genes: ${het}; homozygous genes: ${hom}.`, `Number of types = 2<sup>${het}</sup> × 1<sup>${hom}</sup> = <b>${2 ** het}</b>.`) };
    },
    verify: (x) => { let c = 1; for (let i = 0; i < x.het; i++) c += c; return c; },
  },
  'c12b-inherit-linkage': {
    title: 'recombination frequency and map distance',
    make(r) {
      const T = choose(r, [500, 800, 1000, 2000]), pc = pick(r, 2, 40, 2), rec = Math.round(T * pc / 100);
      return { T, rec, q: `<p>In a test cross of a dihybrid with two linked genes, ${T} offspring are counted. ${rec} of them are recombinants. What is the recombination frequency in percent (which equals the distance between the genes in map units)?</p>`, answer: 100 * rec / T, unit: '%', tol: 0.01,
        hint: 'Recombination frequency = recombinants ÷ total offspring × 100. One percent is one map unit (centimorgan).',
        solution: steps(`Frequency = ${rec} ÷ ${T} × 100.`, `= <b>${n(100 * rec / T)} %</b>, so the genes are about ${n(100 * rec / T)} map units apart.`) };
    },
    verify: (x) => (x.rec / x.T) * 100,
  },
  'c12b-inherit-xlinked': {
    title: 'X-linked recessive children',
    make(r) {
      const N = pick(r, 8, 80, 8), cls = choose(r, ['affected sons', 'carrier daughters', 'normal sons', 'normal daughters']);
      return { N, cls, q: `<p>A carrier mother (X<sup>H</sup>X<sup>h</sup>) and a normal father (X<sup>H</sup>Y) have ${N} children (half sons, half daughters on average). For haemophilia (X-linked recessive) how many <b>${cls}</b> are expected?</p>`, answer: N / 4, unit: 'children', tol: 0.01,
        hint: 'Draw the 2 × 2 square: the four outcomes are equally likely.',
        solution: steps('Mother gametes X<sup>H</sup> or X<sup>h</sup>; father gametes X<sup>H</sup> or Y.', 'Children: X<sup>H</sup>X<sup>H</sup> (normal daughter), X<sup>H</sup>X<sup>h</sup> (carrier daughter), X<sup>H</sup>Y (normal son), X<sup>h</sup>Y (affected son): each ¼.', `${N} × ¼ = <b>${n(N / 4)}</b>.`) };
    },
    verify: (x) => { let c = 0; for (const m of ['H', 'h']) for (const d of ['X', 'Y']) { const t = d === 'Y' ? (m === 'h' ? 'affected sons' : 'normal sons') : (m === 'h' ? 'carrier daughters' : 'normal daughters'); if (t === x.cls) c++; } return x.N * c / 4; },
  },
};
