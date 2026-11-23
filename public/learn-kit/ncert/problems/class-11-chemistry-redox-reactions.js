// Class 11 Chemistry, Chapter 7 Redox Reactions: live problems (original fibub questions). Ids start with c11c-redox-.
import { pick, choose, n, steps } from './_util.js';

// [formula, element, atoms of that element, total of the other atoms, charge on the species]
const OX = [['KMnO₄', 'Mn', 1, -7, 0], ['K₂Cr₂O₇', 'Cr', 2, -12, 0], ['H₂SO₄', 'S', 1, -6, 0], ['MnO₄²⁻', 'Mn', 1, -8, -2], ['NO₃⁻', 'N', 1, -6, -1], ['H₃PO₄', 'P', 1, -5, 0], ['Cr₂O₇²⁻', 'Cr', 2, -14, -2], ['ClO₃⁻', 'Cl', 1, -6, -1], ['Na₂S₂O₃', 'S', 2, -4, 0], ['NH₄⁺', 'N', 1, 4, 1]];
const EL = [['Cr₂O₇²⁻ → Cr³⁺', 6, 3, 2], ['MnO₄⁻ → Mn²⁺', 7, 2, 1], ['ClO₃⁻ → Cl⁻', 5, -1, 1], ['Fe²⁺ → Fe³⁺', 2, 3, 1], ['S₂O₃²⁻ → S₄O₆²⁻ (S: +2 → +2.5)', 2, 2.5, 2], ['H₂S → SO₂ (S: −2 → +4)', -2, 4, 1], ['2Cl⁻ → Cl₂', -1, 0, 2], ['NO₃⁻ → NO (N: +5 → +2)', 5, 2, 1]];
const AG = [['Fe₂O₃ + 3CO → 2Fe + 3CO₂', 'Fe', 3, 0], ['2KI + Cl₂ → 2KCl + I₂', 'I', -1, 0], ['Zn + 2HCl → ZnCl₂ + H₂', 'Zn', 0, 2], ['MnO₂ + 4HCl → MnCl₂ + Cl₂ + 2H₂O', 'Mn', 4, 2], ['SO₂ + 2H₂S → 3S + 2H₂O', 'S in SO₂', 4, 0], ['2Na + Cl₂ → 2NaCl', 'Na', 0, 1]];
const HC = [['Zn²⁺/Zn', -0.76], ['Fe²⁺/Fe', -0.44], ['Cu²⁺/Cu', 0.34], ['Ag⁺/Ag', 0.80], ['Mg²⁺/Mg', -2.37], ['Ni²⁺/Ni', -0.25]];
export default {
  'c11c-redox-oxnum': {
    title: 'oxidation number of an element in a compound',
    make(r) {
      const [f, el, cnt, others, q] = choose(r, OX), x = (q - others) / cnt;
      return { f, el, cnt, others, chg: q, q: `<p>Find the oxidation number of ${el} in ${f}.</p>`, answer: x, abs: 0.01, tol: 0.01,
        hint: 'The numbers of all atoms add up to the charge on the species (0 if it is neutral). Use O = −2, H = +1, K or Na = +1.',
        solution: steps(`The other atoms add up to ${others}.`, `${cnt} × (${el}) + (${others}) = ${q}`, `Oxidation number of ${el} = <b>${x > 0 ? '+' : ''}${n(x)}</b>.`) };
    },
    verify: (x) => { for (let v = -10; v <= 10; v += 0.5) if (Math.abs(x.cnt * v + x.others - x.chg) < 1e-9) return v; return NaN; },
  },
  'c11c-redox-electrons': {
    title: 'electrons transferred',
    make(r) {
      const [lab, a, b, cnt] = choose(r, EL), e = Math.abs(b - a) * cnt;
      return { a, b, cnt, q: `<p>How many electrons are transferred per formula unit in the change <b>${lab}</b>? (The number of atoms that change is ${cnt}; the numbers shown are oxidation numbers.)</p>`, answer: e, tol: 0.01,
        hint: 'Electrons = (change in oxidation number per atom) × (number of atoms that change).',
        solution: steps(`Change per atom = ${a} → ${b}, that is ${n(Math.abs(b - a))}.`, `${cnt} atom${cnt > 1 ? 's' : ''} × ${n(Math.abs(b - a))} = <b>${n(e)} e⁻</b>.`) };
    },
    verify: (x) => { let t = 0; for (let i = 0; i < x.cnt; i++) t += x.b - x.a; return Math.abs(t); },
  },
  'c11c-redox-agent': {
    title: 'change in oxidation number',
    make(r) {
      const [eq, el, a, b] = choose(r, AG), d = Math.abs(b - a);
      return { a, b, q: `<p>In the reaction <b>${eq}</b>, the oxidation number of ${el} changes from ${a} to ${b}. By how many units does it change?</p>`, answer: d, abs: 0.01, tol: 0.01,
        hint: 'Subtract the lower oxidation number from the higher one.',
        solution: steps(`${el}: ${a} → ${b}.`, `Change = |${b} − (${a})| = <b>${d}</b> unit${d === 1 ? '' : 's'}.`, `${b > a ? `It rose, so ${el} is oxidised (a reducing agent).` : `It fell, so ${el} is reduced (an oxidising agent).`}`) };
    },
    verify: (x) => Math.max(x.a, x.b) - Math.min(x.a, x.b),
  },
  'c11c-redox-moles': {
    title: 'Fe²⁺ oxidised by permanganate',
    make(r) {
      const m = choose(r, [0.79, 1.58, 3.16, 0.395, 0.632]);
      return { m, q: `<p>${m} g of KMnO₄ (molar mass 158 g/mol) reacts completely with Fe²⁺ in acid: MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O. How many moles of Fe²⁺ are oxidised?</p>`, answer: 5 * m / 158, unit: 'mol', tol: 0.01,
        hint: 'Moles of KMnO₄ = mass ÷ 158. The equation shows 5 Fe²⁺ for each MnO₄⁻.',
        solution: steps(`Moles of KMnO₄ = ${m} ÷ 158 = ${n(m / 158, 3)} mol.`, `Moles of Fe²⁺ = 5 × ${n(m / 158, 3)} = <b>${n(5 * m / 158, 3)} mol</b>.`) };
    },
    verify: (x) => x.m / (158 / 5),
  },
  'c11c-redox-ecell': {
    title: 'standard cell voltage',
    make(r) {
      const pairs = [[0, 2], [1, 3], [4, 2], [5, 3], [0, 3], [4, 1]], [a, c] = choose(r, pairs), E = HC[c][1] - HC[a][1];
      return { a, c, q: `<p>A cell is made from ${HC[a][0]} (E° = ${HC[a][1]} V) and ${HC[c][0]} (E° = ${HC[c][1]} V). The metal higher in the series is oxidised. Find E°<sub>cell</sub> in volts.</p>`, answer: E, unit: 'V', tol: 0.01,
        hint: 'The half-cell with the higher E° is the cathode. E°cell = E°(cathode) − E°(anode).',
        solution: steps(`Reduction (cathode): ${HC[c][0]}; oxidation (anode): ${HC[a][0]}.`, `E°cell = ${HC[c][1]} − (${HC[a][1]}) = <b>${n(E)} V</b>.`) };
    },
    verify: (x) => Math.abs(HC[x.c][1] - HC[x.a][1]),
  },
  'c11c-redox-titr': {
    title: 'redox titration: volume of KMnO₄',
    make(r) {
      const cF = choose(r, [0.05, 0.1, 0.15, 0.2]), cK = choose(r, [0.02, 0.04]), VF = choose(r, [20, 25, 50]);
      return { cF, cK, VF, q: `<p>${VF} mL of Fe²⁺ solution of concentration ${cF} M is titrated with ${cK} M KMnO₄ in acid (MnO₄⁻ : Fe²⁺ = 1 : 5). Find the volume of KMnO₄ needed to reach the end point.</p>`, answer: (VF * cF) / 5 / cK, unit: 'mL', tol: 0.01,
        hint: 'Moles of Fe²⁺ = M × V. Moles of MnO₄⁻ = one fifth of that. Then V = moles ÷ M.',
        solution: steps(`Fe²⁺ = ${cF} × ${VF} = ${n(cF * VF)} mmol.`, `MnO₄⁻ = ${n(cF * VF)} ÷ 5 = ${n(cF * VF / 5)} mmol.`, `Volume = ${n(cF * VF / 5)} ÷ ${cK} = <b>${n(VF * cF / 5 / cK)} mL</b>.`) };
    },
    verify: (x) => { const nFe = (x.cF * x.VF) / 1000, nMn = nFe / 5; return (nMn / x.cK) * 1000; },
  },
};
