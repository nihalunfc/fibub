// Live problems for d- and f-block elements.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

// [ion as HTML, d electrons]
const IONS = [['Sc<sup>3+</sup>', 0], ['Ti<sup>3+</sup>', 1], ['V<sup>3+</sup>', 2], ['Cr<sup>3+</sup>', 3], ['Mn<sup>2+</sup>', 5], ['Mn<sup>3+</sup>', 4], ['Fe<sup>2+</sup>', 6], ['Fe<sup>3+</sup>', 5], ['Co<sup>2+</sup>', 7], ['Ni<sup>2+</sup>', 8], ['Cu<sup>2+</sup>', 9], ['Cu<sup>+</sup>', 10], ['Zn<sup>2+</sup>', 10], ['V<sup>4+</sup>', 1], ['Cr<sup>2+</sup>', 4]];

export default {
  'df-spin-moment': {
    title: 'spin-only magnetic moment of a 3d ion',
    make(r) {
      const i = Math.floor(r() * IONS.length), [ion, d] = IONS[i];
      const un = d <= 5 ? d : 10 - d, answer = Math.sqrt(un * (un + 2));
      return { i, d,
        q: `<p>What is the spin-only magnetic moment of a free ${ion} ion (or the ion in a weak-field, high-spin complex)?</p>`,
        answer, unit: 'BM', tol: 0.005, abs: 0.01,
        hint: 'Write the 3d count (4s electrons leave first), fill the five d boxes singly before pairing, count unpaired electrons n, then μ = √(n(n + 2)).',
        solution: steps(`${ion} has 3d<sup>${d}</sup>.`, `Unpaired electrons n = ${un}.`, `μ = √(${un} × ${un + 2}) = <b>${n(answer)} BM</b>.`) };
    },
    // count unpaired by filling boxes one electron at a time
    verify: (x) => { const b = [0, 0, 0, 0, 0]; for (let e = 0; e < x.d; e++) b[e % 5]++; const u = b.filter((k) => k === 1).length; return Math.sqrt(u * u + 2 * u); },
  },
  'df-permanganate': {
    title: 'permanganate titration of iron(II) or oxalate',
    make(r) {
      const fe = r() < 0.5, V2 = pick(r, 10, 25, 1), M2 = pick(r, 0.02, 0.2, 0.01), M1 = pick(r, 0.01, 0.05, 0.002);
      const e2 = fe ? 1 : 2, answer = (M2 * V2 * e2) / (5 * M1);
      return { V2, M2, M1, e2,
        q: `<p>${V2} mL of ${M2} M ${fe ? 'FeSO<sub>4</sub>' : 'oxalic acid (H<sub>2</sub>C<sub>2</sub>O<sub>4</sub>)'} is titrated with ${M1} M KMnO<sub>4</sub> in dilute H<sub>2</sub>SO<sub>4</sub>. What volume of KMnO<sub>4</sub> is needed?</p>`,
        answer, unit: 'mL', tol: 0.005,
        hint: `In acid MnO₄⁻ gains 5 electrons (→ Mn²⁺). ${fe ? 'Fe²⁺ loses 1 (→ Fe³⁺).' : 'Each C₂O₄²⁻ loses 2 (→ 2CO₂).'} Electrons given = electrons taken.`,
        solution: steps(`Electrons from the reducing agent = ${M2} × ${V2} × ${e2} = ${n(M2 * V2 * e2, 4)} mmol.`, `Each MnO₄⁻ takes 5: mmol of MnO₄⁻ = ${n((M2 * V2 * e2) / 5, 4)}.`, `V = ${n((M2 * V2 * e2) / 5, 4)} / ${M1} = <b>${n(answer)} mL</b>.`) };
    },
    // mole ratio from the balanced equation: 1 MnO₄⁻ : 5 Fe²⁺, or 2 MnO₄⁻ : 5 C₂O₄²⁻
    verify: (x) => (x.e2 === 1 ? (x.M2 * x.V2) / 5 : (x.M2 * x.V2 * 2) / 5) / x.M1,
  },
  'df-dichromate-mass': {
    title: "mass of Mohr's salt oxidised by dichromate",
    make(r) {
      const V = pick(r, 10, 40, 1), M = pick(r, 0.01, 0.05, 0.005);
      const answer = (M * V * 6 * 392) / 1000;
      return { V, M,
        q: `<p>${V} mL of ${M} M K<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub> exactly oxidises the Fe<sup>2+</sup> in a sample of Mohr's salt, FeSO<sub>4</sub>·(NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub>·6H<sub>2</sub>O (M = 392 g/mol), in acid. What is the mass of the sample?</p>`,
        answer, unit: 'g', tol: 0.005,
        hint: 'Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O: each dichromate takes 6 electrons. Each Fe²⁺ gives 1.',
        solution: steps(`mmol of Cr₂O₇²⁻ = ${M} × ${V} = ${n(M * V, 4)}.`, `mmol of Fe²⁺ = 6 × ${n(M * V, 4)} = ${n(6 * M * V, 4)}.`, `Mass = ${n(6 * M * V, 4)} × 392 / 1000 = <b>${n(answer)} g</b>.`) };
    },
    // equivalents: N(dichromate) = 6M; equivalent mass of Mohr's salt = 392
    verify: (x) => ((6 * x.M) * x.V / 1000) * 392,
  },
};
