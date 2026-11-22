// Live problems for Redox reactions.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

// [oxidant, its n-factor, reductant, its n-factor, mol reductant per mol oxidant from the balanced equation]
const TITR = [
  ['KMnO<sub>4</sub> (acidified)', 5, 'Fe<sup>2+</sup>', 1, 5],
  ['KMnO<sub>4</sub> (acidified)', 5, 'oxalate, C<sub>2</sub>O<sub>4</sub><sup>2−</sup>', 2, 2.5],
  ['K<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub> (acidified)', 6, 'Fe<sup>2+</sup>', 1, 6],
  ['KMnO<sub>4</sub> (acidified)', 5, 'H<sub>2</sub>O<sub>2</sub>', 2, 2.5],
];
// [substance, molar mass, n-factor, note]
const EQW = [
  ['KMnO<sub>4</sub> in acid (→ Mn<sup>2+</sup>)', 158, 5], ['KMnO<sub>4</sub> in neutral solution (→ MnO<sub>2</sub>)', 158, 3],
  ['K<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub> in acid (→ Cr<sup>3+</sup>)', 294, 6], ['oxalic acid dihydrate, H<sub>2</sub>C<sub>2</sub>O<sub>4</sub>·2H<sub>2</sub>O (→ CO<sub>2</sub>)', 126, 2],
  ['Mohr\'s salt, FeSO<sub>4</sub>(NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub>·6H<sub>2</sub>O (Fe<sup>2+</sup> → Fe<sup>3+</sup>)', 392, 1],
  ['sodium thiosulfate pentahydrate, Na<sub>2</sub>S<sub>2</sub>O<sub>3</sub>·5H<sub>2</sub>O (→ S<sub>4</sub>O<sub>6</sub><sup>2−</sup>)', 248, 1],
];
const COUPLES = [['Mg<sup>2+</sup>/Mg', -2.37], ['Al<sup>3+</sup>/Al', -1.66], ['Zn<sup>2+</sup>/Zn', -0.76], ['Fe<sup>2+</sup>/Fe', -0.44], ['Ni<sup>2+</sup>/Ni', -0.25], ['Pb<sup>2+</sup>/Pb', -0.13], ['Cu<sup>2+</sup>/Cu', 0.34], ['Ag<sup>+</sup>/Ag', 0.8]];

export default {
  'rx-titration': {
    title: 'molarity from a redox titration',
    make(r) {
      const [ox, no, red, nr, ratio] = TITR[Math.floor(r() * TITR.length)];
      const Mo = pick(r, 0.01, 0.05, 0.002), Vo = pick(r, 10, 40, 0.5), Vr = pick(r, 10, 25, 5);
      const answer = (Mo * Vo * no) / (Vr * nr);
      return { Mo, Vo, Vr, ratio,
        q: `<p>${Vr} mL of a ${red} solution needs ${Vo} mL of ${n(Mo)} M ${ox} to reach the end point. Find the molarity of the ${red} solution.</p>`,
        answer, unit: 'M', tol: 0.005,
        hint: `At the end point, equivalents of oxidant = equivalents of reductant: n-factor × M × V on both sides. Here the oxidant's n-factor is ${no} and the reductant's is ${nr}.`,
        solution: steps(`Equivalents of oxidant (in milli units) = ${no} × ${n(Mo)} × ${Vo} = ${n(no * Mo * Vo, 4)}.`, `Equivalents of reductant = ${nr} × M × ${Vr}.`, `M = ${n(no * Mo * Vo, 4)} ÷ (${nr} × ${Vr}) = <b>${n(answer, 4)} M</b>.`) };
    },
    verify: (x) => (x.Mo * x.Vo * x.ratio) / x.Vr,
  },
  'rx-eq-mass': {
    title: 'mass needed for a solution of given normality',
    make(r) {
      const [name, M, nf] = EQW[Math.floor(r() * EQW.length)], N = pick(r, 0.02, 0.5, 0.01), V = pick(r, 100, 1000, 50);
      const E = M / nf, answer = (N * E * V) / 1000;
      return { M, nf, N, V,
        q: `<p>What mass of ${name} (molar mass ${M} g/mol) is needed to make ${V} mL of a ${N} N solution for redox work?</p>`,
        answer, unit: 'g', tol: 0.005,
        hint: 'Equivalent weight = molar mass ÷ n-factor (electrons gained or lost per formula unit). Mass = N × equivalent weight × V(L).',
        solution: steps(`n-factor = ${nf}, so equivalent weight E = ${M} ÷ ${nf} = ${n(E, 4)} g.`, `Mass = ${N} × ${n(E, 4)} × ${V}/1000 = <b>${n(answer, 4)} g</b>.`) };
    },
    verify: (x) => ((x.N * x.V) / 1000 / x.nf) * x.M,
  },
  'rx-emf': {
    title: 'standard cell potential from the electrochemical series',
    make(r) {
      let i = Math.floor(r() * COUPLES.length), j = Math.floor(r() * COUPLES.length); if (i === j) j = (i + 3) % COUPLES.length;
      const [a, b] = [COUPLES[i], COUPLES[j]], [an, ca] = a[1] < b[1] ? [a, b] : [b, a];
      const answer = +(ca[1] - an[1]).toFixed(2);
      return { e1: a[1], e2: b[1],
        q: `<p>Standard reduction potentials: ${a[0]} ${a[1].toFixed(2)} V and ${b[0]} ${b[1].toFixed(2)} V. A cell is built from these two half-cells so that it works on its own. Find its standard EMF in volts.</p>`,
        answer, unit: 'V', tol: 0.001, abs: 0.005,
        hint: 'The couple with the higher (more positive) reduction potential is reduced (cathode); the other is oxidised (anode). E°<sub>cell</sub> = E°<sub>cathode</sub> − E°<sub>anode</sub>.',
        solution: steps(`Cathode (reduced): ${ca[0]}, ${ca[1].toFixed(2)} V. Anode (oxidised): ${an[0]}, ${an[1].toFixed(2)} V.`, `E°<sub>cell</sub> = ${ca[1].toFixed(2)} − (${an[1].toFixed(2)}) = <b>${answer.toFixed(2)} V</b>.`, 'Positive E° means the reaction is spontaneous (ΔG° = −nFE° is negative). Do not multiply E° by the number of electrons when balancing.') };
    },
    verify: (x) => Math.abs(x.e1 - x.e2),
  },
};
