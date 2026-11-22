// Class 12 Biology, Molecular Basis of Inheritance: live problems (original fibub questions). Ids start with c12b-mol-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c12b-mol-chargaff': {
    title: 'base composition of double-stranded DNA',
    make(r) {
      const G = pick(r, 18, 34, 1), C = G;
      return { G, C, q: `<p>A sample of double-stranded DNA has ${G} % guanine. What percentage of the bases is adenine?</p>`, answer: 50 - G, unit: '%', tol: 0.01,
        hint: 'Chargaff: G pairs with C, A pairs with T. So %G = %C and %A = %T, and the four add to 100 %.',
        solution: steps(`G = C = ${G} %, so G + C = ${2 * G} %.`, `A + T = 100 − ${2 * G} = ${100 - 2 * G} %.`, `A = T, so A = <b>${n(50 - G)} %</b>.`) };
    },
    verify: (x) => (100 - x.G - x.C) / 2,
  },
  'c12b-mol-helix': {
    title: 'base pairs from the length of DNA',
    make(r) {
      const turns = pick(r, 8, 60, 4), len = turns * 3.4;
      return { turns, len, q: `<p>A piece of B-DNA is ${n(len)} nm long. The pitch of the helix is 3.4 nm and the distance between adjacent base pairs is 0.34 nm. How many base pairs does it contain?</p>`, answer: turns * 10, unit: 'bp', tol: 0.01,
        hint: 'Number of base pairs = length ÷ distance between base pairs.',
        solution: steps(`Base pairs = ${n(len)} nm ÷ 0.34 nm.`, `That is <b>${n(turns * 10)} bp</b>, or ${turns} full turns of 10 bp each.`) };
    },
    verify: (x) => (x.len / 3.4) * 10,
  },
  'c12b-mol-dnalen': {
    title: 'length of a genome',
    make(r) {
      const [name, bp] = choose(r, [['a bacterium (E. coli)', 4.6e6], ['yeast', 12.1e6], ['a human cell (haploid set)', 3.2e9], ['a bacteriophage lambda', 48502]]);
      const L = bp * 0.34e-9;
      return { name, bp, q: `<p>The genome of ${name} has ${n(bp, 3)} base pairs. If its DNA were stretched out as one double helix with 0.34 nm between base pairs, how long would it be, in millimetres?</p>`, answer: L * 1e3, unit: 'mm', tol: 0.02,
        hint: 'Length = number of base pairs × 0.34 nm. Convert nm to mm: 1 mm = 10<sup>6</sup> nm.',
        solution: steps(`Length = ${n(bp, 3)} × 0.34 nm = ${n(bp * 0.34, 4)} nm.`, `Divide by 10<sup>6</sup>: <b>${n(L * 1e3, 3)} mm</b>.`, 'The nucleus or cell is a few micrometres across, so the DNA has to be packed tightly (nucleosomes, then loops).') };
    },
    verify: (x) => x.bp * 3.4 * 1e-10 * 1000,
  },
  'c12b-mol-codons': {
    title: 'codons and amino acids',
    make(r) {
      const k = choose(r, [50, 120, 250, 330, 450, 600]), mode = choose(r, ['fwd', 'back']);
      if (mode === 'fwd') { const N = 3 * k + 3; return { mode, k, N, q: `<p>The coding region of an mRNA has ${N} nucleotides, counting the stop codon. How many amino acids are in the polypeptide it makes?</p>`, answer: k, unit: '', tol: 0, abs: 0.01, hint: 'Three nucleotides make one codon. The stop codon codes for no amino acid.', solution: steps(`Codons = ${N} ÷ 3 = ${N / 3}.`, `One is the stop codon, so amino acids = ${N / 3} − 1 = <b>${k}</b>.`) }; }
      return { mode, k, N: 0, q: `<p>A polypeptide has ${k} amino acids. What is the least number of nucleotides in the coding region of its mRNA, counting the stop codon?</p>`, answer: 3 * k + 3, unit: '', tol: 0, abs: 0.01, hint: 'Each amino acid needs one codon of 3 nucleotides, and the stop codon needs 3 more.', solution: steps(`Codons for amino acids: ${k}, so ${k} × 3 = ${3 * k} nucleotides.`, `Add the stop codon (3): <b>${3 * k + 3}</b>.`) };
    },
    verify: (x) => (x.mode === 'fwd' ? (x.N - 3) / 3 : (x.k + 1) * 3),
  },
  'c12b-mol-triplet': {
    title: 'why the code is a triplet',
    make(r) {
      const L = pick(r, 1, 5, 1);
      return { L, q: `<p>The four bases can be combined in groups of ${L}. How many different groups (codes) are possible?</p>`, answer: 4 ** L, unit: '', tol: 0, abs: 0.01,
        hint: 'Each of the positions can be any of 4 bases: 4 × 4 × ... (L times).',
        solution: steps(`Number of groups = 4<sup>${L}</sup> = <b>${4 ** L}</b>.`, '20 amino acids need at least 20 codes: groups of 1 (4) or of 2 (16) are too few, groups of 3 give 64, enough, with some to spare (the code is degenerate).') };
    },
    verify: (x) => Math.exp(x.L * Math.log(4)),
  },
  'c12b-mol-meselson': {
    title: 'hybrid DNA after several generations',
    make(r) {
      const g = pick(r, 1, 5, 1);
      return { g, q: `<p>E. coli grown for many generations in heavy nitrogen (<sup>15</sup>N) is moved to ordinary <sup>14</sup>N medium and allowed to divide ${g} time${g > 1 ? 's' : ''}. Replication is semi-conservative. What percentage of the DNA molecules is hybrid (one <sup>15</sup>N strand and one <sup>14</sup>N strand)?</p>`, answer: 200 / 2 ** g, unit: '%', tol: 0.01,
        hint: 'The two original heavy strands are never lost. How many molecules are there after g divisions, and how many of them hold an old strand?',
        solution: steps(`After ${g} division${g > 1 ? 's' : ''}: 2<sup>${g}</sup> = ${2 ** g} molecules.`, 'The 2 old heavy strands sit in 2 different molecules, each paired with a new light strand: 2 hybrid molecules.', `Fraction = 2 ÷ ${2 ** g}, so <b>${n(200 / 2 ** g)} %</b>.`) };
    },
    verify: (x) => { let strands = [['H', 'H']]; for (let i = 0; i < x.g; i++) { const nxt = []; for (const [a, b] of strands) { nxt.push([a, 'L'], [b, 'L']); } strands = nxt; } return 100 * strands.filter(([a, b]) => a !== b).length / strands.length; },
  },
  'c12b-mol-replrate': {
    title: 'time to copy a genome',
    make(r) {
      const bp = choose(r, [4.6e6, 2.0e6, 5.0e6, 3.0e6]), rate = choose(r, [500, 800, 1000]), forks = choose(r, [1, 2]);
      const t = bp / (rate * forks) / 60;
      return { bp, rate, forks, q: `<p>A bacterial chromosome has ${n(bp, 2)} base pairs. Each replication fork adds ${rate} nucleotides per second to a new strand and there ${forks === 1 ? 'is 1 fork' : 'are 2 forks, one moving each way from the origin'}. How many minutes does the copying take?</p>`, answer: t, unit: 'min', tol: 0.02,
        hint: 'Total speed = rate × number of forks (bp copied per second). Time = base pairs ÷ speed, then ÷ 60.',
        solution: steps(`Speed = ${rate} × ${forks} = ${rate * forks} bp per second.`, `Time = ${n(bp, 2)} ÷ ${rate * forks} = ${n(bp / (rate * forks), 4)} s.`, `Divide by 60: <b>${n(t)} min</b>.`) };
    },
    verify: (x) => x.bp * (1 / (x.rate * x.forks)) / 60,
  },
};
