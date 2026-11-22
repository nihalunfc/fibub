// Live problems for Biomolecules and enzymes.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'bmol-mm-velocity': {
    title: 'enzyme velocity with a competitive inhibitor',
    make(r) {
      const Vmax = pick(r, 60, 200, 20), Km = pick(r, 2, 10, 1), S = pick(r, 2, 20, 2), f = pick(r, 2, 4, 1);
      const Ka = Km * f, answer = (Vmax * S) / (Ka + S);
      return { Vmax, Km, S, f,
        q: `<p>An enzyme has V<sub>max</sub> = ${Vmax} µmol/min and K<sub>m</sub> = ${Km} mM. A competitive inhibitor is added that makes the apparent K<sub>m</sub> ${f} times larger. What is the velocity at [S] = ${S} mM?</p>`,
        answer, unit: 'µmol/min', tol: 0.01,
        hint: 'A competitive inhibitor changes K<sub>m</sub> only; V<sub>max</sub> stays the same. Then use v = V<sub>max</sub>[S]/(K<sub>m</sub> + [S]).',
        solution: steps(`Apparent K<sub>m</sub> = ${f} × ${Km} = ${Ka} mM; V<sub>max</sub> stays ${Vmax}.`, `v = ${Vmax} × ${S} / (${Ka} + ${S}) = ${Vmax * S} / ${Ka + S}.`, `v = <b>${n(answer)} µmol/min</b>. (Without the inhibitor it would be ${n((Vmax * S) / (Km + S))}.)`) };
    },
    verify: (x) => x.Vmax / (1 + (x.Km * x.f) / x.S),
  },
  'bmol-peptide': {
    title: 'peptide bonds, water lost and mass of a polypeptide',
    make(r) {
      const chains = pick(r, 1, 4), per = pick(r, 20, 150, 5), avg = pick(r, 110, 130, 2);
      const total = chains * per, bonds = total - chains, answer = total * avg - bonds * 18;
      return { chains, per, avg, total,
        q: `<p>A protein has ${chains} separate linear polypeptide chain${chains > 1 ? 's' : ''}, each of ${per} amino acids. The free amino acids have an average mass of ${avg} Da. Water is 18 Da. What is the mass of the protein in Da?</p>`,
        answer, unit: 'Da', tol: 0.001,
        hint: 'A linear chain of n amino acids has n − 1 peptide bonds, and each bond releases one water molecule.',
        solution: steps(`Total amino acids = ${chains} × ${per} = ${total}.`, `Peptide bonds = ${total} − ${chains} = ${bonds}, so ${bonds} water molecules are lost.`, `Mass = ${total} × ${avg} − ${bonds} × 18 = ${total * avg} − ${bonds * 18} = <b>${answer.toLocaleString('en-IN')} Da</b>.`) };
    },
    verify: (x) => x.chains * (x.per * x.avg - (x.per - 1) * 18),
  },
  'bmol-dna-hbonds': {
    title: 'hydrogen bonds in a DNA fragment',
    make(r) {
      const bp = pick(r, 100, 2000, 50), gc = pick(r, 20, 70, 5);
      const nGC = Math.round((bp * gc) / 100), nAT = bp - nGC, answer = 3 * nGC + 2 * nAT;
      return { bp, nGC,
        q: `<p>A double-stranded DNA fragment has ${bp} base pairs, and ${gc}% of them are G–C pairs. How many hydrogen bonds hold the two strands together?</p>`,
        answer, unit: 'H bonds', tol: 0,
        hint: 'G pairs with C by three hydrogen bonds; A pairs with T by two.',
        solution: steps(`G–C pairs = ${gc}% of ${bp} = ${nGC}; A–T pairs = ${bp} − ${nGC} = ${nAT}.`, `H bonds = 3 × ${nGC} + 2 × ${nAT} = ${3 * nGC} + ${2 * nAT}.`, `= <b>${answer}</b>.`) };
    },
    verify: (x) => 2 * x.bp + x.nGC,
  },
};
