// Live problems for Molecular basis of inheritance.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

const PAIR = { A: 'T', T: 'A', G: 'C', C: 'G' };
export default {
  'mol-chargaff': {
    title: 'base percentages from Chargaff\'s rule',
    make(r) {
      const given = 'ATGC'[Math.floor(r() * 4)], pct = pick(r, 12, 38);
      const others = 'ATGC'.split('').filter((b) => b !== given && b !== PAIR[given]);
      const ask = r() < 0.5 ? PAIR[given] : others[Math.floor(r() * 2)];
      const answer = ask === PAIR[given] ? pct : 50 - pct;
      return { given, pct, ask,
        q: `<p>A double-stranded DNA sample has ${pct}% ${given}. What percentage of its bases are ${ask}?</p>`,
        answer, unit: '%', tol: 0, abs: 0.01,
        hint: 'In double-stranded DNA, A = T and G = C, so A + G = T + C = 50%.',
        solution: steps(`${given} pairs with ${PAIR[given]}, so ${PAIR[given]} = ${pct}%.`, `Together ${given} + ${PAIR[given]} = ${2 * pct}%, leaving ${100 - 2 * pct}% for the other pair, split equally: ${50 - pct}% each.`, `So ${ask} = <b>${answer}%</b>.`) };
    },
    verify: (x) => (x.ask === PAIR[x.given] ? x.pct : (100 - 2 * x.pct) / 2),
  },
  'mol-dna-length': {
    title: 'length of a DNA molecule from its base pairs',
    make(r) {
      const cases = [['the <i>E. coli</i> genome', 4.6e6, 'mm', 1e3], ['a phage λ genome', 48502, 'µm', 1e6], ['a human diploid cell (all chromosomes)', 6.6e9, 'm', 1], ['a plasmid', pick(r, 2000, 12000, 500), 'µm', 1e6]];
      const [what, bp, unit, k] = cases[Math.floor(r() * cases.length)];
      const answer = bp * 0.34e-9 * k;
      return { bp, k,
        q: `<p>The distance between two neighbouring base pairs in B-DNA is 0.34 nm. About how long is the DNA of ${what}, which has ${n(bp, 4)} base pairs? Give the answer in ${unit}.</p>`,
        answer, unit, tol: 0.01,
        hint: 'Length = number of base pairs × 0.34 nm, and 1 nm = 10⁻⁹ m.',
        solution: steps(`Length = ${n(bp, 4)} × 0.34 × 10⁻⁹ m = ${n(bp * 0.34e-9, 3)} m.`, `In ${unit}: <b>${n(answer)} ${unit}</b>.`) };
    },
    verify: (x) => (x.bp / 1e9) * 0.34 * x.k,
  },
  'mol-codons': {
    title: 'mRNA length for a protein',
    make(r) {
      const aa = pick(r, 50, 600), withStop = r() < 0.6, answer = 3 * aa + (withStop ? 3 : 0);
      return { aa, withStop,
        q: `<p>A protein has ${aa} amino acids. What is the smallest number of nucleotides in the part of its mRNA that is read by the ribosome, from the start codon ${withStop ? 'up to and including the stop codon' : 'up to the last amino acid codon (leave out the stop codon)'}?</p>`,
        answer, unit: 'nucleotides', tol: 0, abs: 0.5,
        hint: 'Each amino acid needs one codon of three bases. The start codon AUG codes for methionine, so it is one of the amino acid codons. The stop codon codes for none.',
        solution: steps(`${aa} amino acids × 3 = ${3 * aa} nucleotides.`, withStop ? 'Add 3 for the stop codon (UAA, UAG or UGA).' : 'No stop codon to add.', `Total = <b>${answer}</b>.`) };
    },
    verify: (x) => (x.aa + (x.withStop ? 1 : 0)) * 3,
  },
};
