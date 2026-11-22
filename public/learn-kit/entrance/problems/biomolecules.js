// Live problems for Biomolecules.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

const AA = [['Gly', 75], ['Ala', 89], ['Ser', 105], ['Val', 117], ['Phe', 165], ['Leu', 131], ['Cys', 121]];

export default {
  'bio-peptide-mass': {
    title: 'molar mass of a peptide',
    make(r) {
      const k = pick(r, 2, 5), seq = Array.from({ length: k }, () => AA[Math.floor(r() * AA.length)]);
      const sum = seq.reduce((s, a) => s + a[1], 0), answer = sum - 18 * (k - 1);
      return { masses: seq.map((a) => a[1]), k,
        q: `<p>What is the molar mass of the peptide ${seq.map((a) => a[0]).join('-')}? Free amino acid masses (g/mol): ${[...new Set(seq.map((a) => `${a[0]} ${a[1]}`))].join(', ')}; water 18.</p>`,
        answer, unit: 'g/mol', tol: 0, abs: 0.5,
        hint: 'Each peptide bond forms by losing one water molecule. A chain of k amino acids has k − 1 peptide bonds.',
        solution: steps(`Sum of amino acids = ${seq.map((a) => a[1]).join(' + ')} = ${sum}.`, `${k - 1} peptide bond${k > 2 ? 's' : ''}, so subtract ${k - 1} × 18 = ${18 * (k - 1)}.`, `M = <b>${answer} g/mol</b>.`) };
    },
    // residue masses: each amino acid inside a chain weighs M − 18, plus one water for the two chain ends
    verify: (x) => x.masses.reduce((s, m) => s + (m - 18), 0) + 18,
  },
  'bio-dna-hbonds': {
    title: 'hydrogen bonds and length of a DNA stretch',
    make(r) {
      const bp = pick(r, 100, 2000, 50), gc = pick(r, 30, 70, 2);
      const G = Math.round((bp * gc) / 100), A = bp - G, answer = 2 * A + 3 * G;
      return { bp, G, A,
        q: `<p>A double-stranded DNA segment has ${bp} base pairs, and ${gc}% of its base pairs are G-C. How many hydrogen bonds hold the two strands together? (A-T pairs have 2, G-C pairs have 3.) Its length is ${n(bp * 0.34, 4)} nm at 0.34 nm per base pair.</p>`,
        answer, unit: 'H-bonds', tol: 0, abs: 0.5,
        hint: 'Number of G-C pairs = base pairs × fraction G-C; the rest are A-T pairs. H-bonds = 2 × (A-T pairs) + 3 × (G-C pairs).',
        solution: steps(`G-C pairs = ${bp} × ${gc / 100} = ${G}; A-T pairs = ${bp} − ${G} = ${A}.`, `H-bonds = 2 × ${A} + 3 × ${G} = <b>${answer}</b>.`) };
    },
    verify: (x) => 2 * x.bp + x.G,
  },
};
