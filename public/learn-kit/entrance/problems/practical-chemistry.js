// Live problems for Practical chemistry: salt analysis, titrations and tests.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'pc-oxalic-standard': {
    title: 'mass of oxalic acid for a standard solution',
    make(r) {
      const V = [100, 250, 500, 1000][Math.floor(r() * 4)], M = [0.025, 0.05, 0.1, 0.02, 0.04][Math.floor(r() * 5)];
      const answer = M * (V / 1000) * 126;
      return { V, M,
        q: `<p>You need ${V} mL of ${M} M oxalic acid solution for a titration. What mass of oxalic acid dihydrate, H<sub>2</sub>C<sub>2</sub>O<sub>4</sub>·2H<sub>2</sub>O (M = 126 g/mol), must be weighed and made up to ${V} mL in a volumetric flask?</p>`,
        answer, unit: 'g', tol: 0.005,
        hint: 'Moles needed = molarity × volume in litres. Use the molar mass of the hydrate you actually weigh (126), not of anhydrous oxalic acid (90).',
        solution: steps(`Moles = ${M} × ${V / 1000} = ${n(M * V / 1000, 4)} mol.`, `Mass = ${n(M * V / 1000, 4)} × 126 = <b>${n(answer)} g</b>.`) };
    },
    verify: (x) => (126 * x.M * x.V) / 1000,
  },
  'pc-kmno4-mohr': {
    title: 'molarity of KMnO₄ from a titration with Mohr\'s salt',
    make(r) {
      const Mm = [0.05, 0.1][Math.floor(r() * 2)], Vm = [10, 20, 25][Math.floor(r() * 3)], Vk = pick(r, 8, 24, 0.2);
      const answer = (Mm * Vm) / (5 * Vk);
      return { Mm, Vm, Vk,
        q: `<p>${Vm} mL of ${Mm} M Mohr's salt solution (Fe<sup>2+</sup>), acidified with dilute H<sub>2</sub>SO<sub>4</sub>, needs ${Vk} mL of KMnO<sub>4</sub> solution to reach a permanent pale pink. What is the molarity of the KMnO<sub>4</sub>?</p>`,
        answer, unit: 'M', tol: 0.005,
        hint: 'MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O. Moles of MnO₄⁻ = (moles of Fe²⁺)/5. KMnO₄ is its own indicator.',
        solution: steps(`mmol of Fe²⁺ = ${Mm} × ${Vm} = ${n(Mm * Vm, 4)}.`, `mmol of MnO₄⁻ = ${n(Mm * Vm, 4)}/5 = ${n((Mm * Vm) / 5, 4)}.`, `Molarity = ${n((Mm * Vm) / 5, 4)}/${Vk} = <b>${n(answer)} M</b>.`) };
    },
    // equivalents: N(KMnO₄) × V = N(Fe²⁺) × V with N = 5M for permanganate and N = M for Fe²⁺
    verify: (x) => ((x.Mm * x.Vm) / x.Vk) / 5,
  },
  'pc-water-crystal': {
    title: 'water of crystallisation from heating',
    make(r) {
      const S = [['CuSO<sub>4</sub>', 159.5, 5], ['MgSO<sub>4</sub>', 120, 7], ['BaCl<sub>2</sub>', 208, 2], ['Na<sub>2</sub>CO<sub>3</sub>', 106, 10], ['FeSO<sub>4</sub>', 152, 7], ['CaSO<sub>4</sub>', 136, 2]];
      const [f, M, x] = S[Math.floor(r() * S.length)], m = pick(r, 1, 5, 0.5);
      const anh = +((m * M) / (M + 18 * x)).toFixed(3);
      const answer = ((m - anh) / 18) / (anh / M);
      return { m, anh, M,
        q: `<p>${m} g of hydrated ${f}·xH<sub>2</sub>O is heated until its mass stops changing. The anhydrous ${f} left weighs ${anh} g (M = ${M} g/mol). Find x.</p>`,
        answer, unit: '', tol: 0.02,
        hint: 'Mass of water lost = start − end. x = (moles of water) / (moles of anhydrous salt).',
        solution: steps(`Water lost = ${m} − ${anh} = ${n(m - anh, 4)} g = ${n((m - anh) / 18, 4)} mol.`, `Anhydrous salt = ${anh}/${M} = ${n(anh / M, 4)} mol.`, `x = ${n((m - anh) / 18, 4)}/${n(anh / M, 4)} = <b>${n(answer)}</b>, so x = ${Math.round(answer)}.`) };
    },
    verify: (x) => (x.M * (x.m - x.anh)) / (18 * x.anh),
  },
};
