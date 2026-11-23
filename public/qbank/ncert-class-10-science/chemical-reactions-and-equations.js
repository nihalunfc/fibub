// Class 10 Science, Chapter 1 Chemical Reactions and Equations: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('cr');
const r2 = (x) => Math.round(x * 100) / 100;

export default {
  topic: 'chemical-reactions-and-equations', name: 'Chemical Reactions and Equations', n: 1,
  items: [
    m.mcq(1, 'equation', '<p>Which of these is a sign that a chemical change has taken place?</p>', 'a new substance with different properties is formed', ['a solid is cut into smaller pieces', 'sugar dissolves in water', 'ice turns into water'], '<p>A chemical change makes a new substance. Cutting, dissolving sugar and melting ice only change shape or state, and the original substance can be recovered.</p>'),
    m.mcq(1, 'equation', '<p>In a balanced chemical equation the total number of atoms of each element is the same on both sides. This follows from the law of:</p>', 'conservation of mass', ['conservation of charge', 'constant temperature', 'definite proportions of energy'], '<p>Atoms are neither created nor destroyed in a reaction, so mass is conserved and each element must balance.</p>'),
    m.mcq(2, 'balancing', '<p>When balancing an equation, you are allowed to change:</p>', 'the coefficients in front of formulas', ['the subscripts inside a formula', 'the symbols of the elements', 'the products that are formed'], '<p>Changing a subscript changes the substance (H₂O to H₂O₂ is water to peroxide). Only the coefficients may be changed.</p>', { trap: 'Writing H₂O₂ to balance oxygen turns water into a different compound.' }),
    m.mcq(2, 'balancing', '<p>The balanced form of Al + O₂ → Al₂O₃ is:</p>', '4Al + 3O₂ → 2Al₂O₃', ['2Al + 3O₂ → Al₂O₃', 'Al + O₂ → Al₂O₃', '2Al + O₂ → 2Al₂O₃'], '<p>4 Al and 6 O on each side: 4Al + 3O₂ → 2Al₂O₃.</p>'),
    m.mcq(1, 'types', '<p>Heating limestone, CaCO₃ → CaO + CO₂, is a:</p>', 'decomposition reaction', ['combination reaction', 'displacement reaction', 'double displacement reaction'], '<p>One compound breaks into two simpler substances: decomposition (here by heat, so thermal decomposition).</p>'),
    m.mcq(2, 'types', '<p>CaO + H₂O → Ca(OH)₂ is a combination reaction and is also:</p>', 'exothermic', ['endothermic', 'a precipitation reaction', 'a decomposition reaction'], '<p>Slaking of quicklime gives out a lot of heat, so it is exothermic.</p>'),
    m.mcq(2, 'types', '<p>Zn + CuSO₄ → ZnSO₄ + Cu is a displacement reaction because:</p>', 'zinc is more reactive than copper and takes its place in the compound', ['two compounds exchange ions', 'one compound breaks into two', 'two elements join to make one compound'], '<p>A more reactive element (Zn) displaces a less reactive one (Cu) from its salt solution.</p>'),
    m.mcq(2, 'types', '<p>When barium chloride solution is added to sodium sulphate solution a white solid forms. This is an example of:</p>', 'a double displacement (precipitation) reaction', ['a combination reaction', 'a displacement reaction', 'a thermal decomposition'], '<p>BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl: the ions swap partners and insoluble BaSO₄ is the precipitate.</p>'),
    m.mcq(2, 'redox', '<p>In the reaction CuO + H₂ → Cu + H₂O, the substance that is oxidised is:</p>', 'hydrogen', ['copper oxide', 'copper', 'water'], '<p>H₂ gains oxygen to become H₂O, so it is oxidised. CuO loses oxygen, so it is reduced.</p>', { trap: 'The substance that loses oxygen is reduced; the one that gains it is oxidised.' }),
    m.mcq(2, 'redox', '<p>A reaction in which one substance is oxidised and another is reduced at the same time is called a:</p>', 'redox reaction', ['neutralisation reaction', 'precipitation reaction', 'photolysis'], '<p>Oxidation and reduction always occur together: redox.</p>'),
    m.mcq(1, 'corrosion', '<p>Rust is mainly:</p>', 'hydrated iron(III) oxide', ['iron(II) sulphate', 'iron carbonate', 'pure iron'], '<p>Iron slowly reacts with oxygen and moisture to give hydrated iron(III) oxide, Fe₂O₃·xH₂O.</p>'),
    m.mcq(2, 'corrosion', '<p>Chips are packed in bags filled with nitrogen gas mainly to:</p>', 'stop oxygen reaching the oil and fat, so they do not turn rancid', ['make the bag lighter to carry', 'cool the chips', 'make the chips crisp by absorbing water'], '<p>Rancidity is oxidation of fats and oils. Nitrogen is unreactive and keeps oxygen out.</p>'),
    m.mcq(3, 'types', '<p>The reaction 2FeSO₄ → Fe₂O₃ + SO₂ + SO₃ (on heating) is described as:</p>', 'thermal decomposition', ['photolysis', 'electrolysis', 'double displacement'], '<p>One compound breaks into three products on heating.</p>'),
    m.mcq(3, 'balancing', '<p>When 2 g of hydrogen burns completely in oxygen to make 18 g of water, the mass of oxygen used is:</p>', '16 g', ['9 g', '20 g', '36 g'], '<p>Mass is conserved: 2 g + oxygen = 18 g, so oxygen = 16 g.</p>'),
    m.ar(2, 'redox', 'Burning of magnesium ribbon in air is an oxidation reaction.', 'Magnesium gains oxygen to form magnesium oxide.', 0, '<p>Both are true and R explains A: gaining oxygen is oxidation.</p>'),
    m.ar(2, 'balancing', 'A chemical equation must be balanced.', 'Atoms are destroyed during a chemical reaction.', 2, '<p>A is true. R is false: atoms are never destroyed, which is exactly why the equation is balanced.</p>'),
    m.ar(3, 'corrosion', 'Iron nails kept in dry air do not rust.', 'Rusting needs both air and moisture.', 0, '<p>Both are true and R explains A: with no water the nail stays unrusted.</p>'),
    m.ar(3, 'types', 'Silver chloride turns grey in sunlight.', 'Silver chloride decomposes by light into silver and chlorine.', 0, '<p>Both are true; the grey colour is the tiny grains of silver. This is photolysis.</p>'),
    m.nat(1, 'balancing', '<p>Balance Mg + O₂ → MgO. How many MgO are formed from one O₂ molecule?</p>', () => 2, 0, '<p>2Mg + O₂ → 2MgO. One O₂ gives 2 MgO.</p>'),
    m.nat(2, 'balancing', '<p>In the balanced equation C₃H₈ + O₂ → CO₂ + H₂O, what is the coefficient of O₂?</p>', () => 5, 0, '<p>C₃H₈ + 5O₂ → 3CO₂ + 4H₂O: 3 C, 8 H and 10 O on each side.</p>'),
    m.nat(2, 'balancing', '<p>How many atoms are there in 3 formula units of Ca(OH)₂ altogether?</p>', () => 15, 0, '<p>One Ca(OH)₂ has 1 + 2 + 2 = 5 atoms, so 3 × 5 = 15.</p>'),
    m.nat(3, 'types', '<p>Limestone, CaCO₃, is heated: CaCO₃ → CaO + CO₂. How many kg of CO₂ are released when 250 kg of pure limestone decomposes? (Ca = 40, C = 12, O = 16.)</p>', () => (250 * 44) / 100, 0.01, '<p>CO₂ = 44, CaCO₃ = 100, so 250 × 44/100 = 110 kg.</p>', { unit: 'kg' }),
    m.msq(3, 'types', '<p>Which of these are redox reactions? (Choose all that apply.)</p>', ['2Mg + O₂ → 2MgO', 'ZnO + C → Zn + CO', 'NaOH + HCl → NaCl + H₂O', 'Fe + CuSO₄ → FeSO₄ + Cu'], [0, 1, 3], '<p>Mg gains oxygen; ZnO loses oxygen to carbon; and Fe displaces Cu (a transfer of electrons). The neutralisation is not redox.</p>'),
    m.msq(2, 'corrosion', '<p>Which of these help to prevent iron from rusting? (Choose all that apply.)</p>', ['painting it', 'coating it with zinc (galvanising)', 'keeping it in salty water', 'greasing it'], [0, 1, 3], '<p>Paint, zinc and grease keep air and water away. Salt water speeds rusting up.</p>'),
  ],
  gens: [
    { id: 'cr-g01', type: 'nat', level: 2, exams: ['board'], sub: 'balancing',
      make(rng) { const a = pick(rng, 8, 60, 2), b = pick(rng, 4, Math.min(30, a - 2), 2); return { a, b, q: `<p>${a} g of a compound is heated and breaks into a solid and a gas. The solid weighs ${b} g. What is the mass of gas in grams (the gas has not been weighed)?</p>`, answer: a - b, tol: 0.01, unit: 'g', sol: `<p>Mass is conserved: gas = ${a} − ${b} = ${a - b} g.</p>` }; },
      verify: (p) => p.a - p.b },
    { id: 'cr-g02', type: 'nat', level: 3, exams: ['board'], sub: 'types',
      make(rng) { const M = pick(rng, 20, 400, 10); return { M, q: `<p>${M} kg of limestone (CaCO₃) is heated strongly. Find the mass of quicklime (CaO) formed, in kg. (Ca = 40, C = 12, O = 16.)</p>`, answer: r2((M * 56) / 100), tol: 0.01, unit: 'kg', sol: `<p>CaCO₃ = 100 and CaO = 56, so ${M} × 56/100 = ${r2((M * 56) / 100)} kg.</p>` }; },
      verify: (p) => r2(p.M - (p.M * 44) / 100) },
    { id: 'cr-g03', type: 'nat', level: 2, exams: ['board'], sub: 'types',
      make(rng) { const v = pick(rng, 4, 40, 2); return { v, q: `<p>In the electrolysis of water ${v} mL of hydrogen collects at the cathode. How many mL of oxygen collect at the anode?</p>`, answer: v / 2, tol: 0.01, unit: 'mL', sol: `<p>2H₂O → 2H₂ + O₂: the volume ratio H₂ : O₂ is 2 : 1, so oxygen = ${v}/2 = ${v / 2} mL.</p>` }; },
      verify: (p) => (p.v * 1) / 2 },
    { id: 'cr-g04', type: 'mcq', level: 2, exams: ['board'], sub: 'types',
      make(rng) {
        const L = [['2Mg + O₂ → 2MgO', 'combination'], ['2H₂O → 2H₂ + O₂', 'decomposition'], ['Zn + H₂SO₄ → ZnSO₄ + H₂', 'displacement'], ['AgNO₃ + NaCl → AgCl + NaNO₃', 'double displacement']];
        const i = Math.floor(rng() * 4), correct = L[i][1], wr = L.filter((_, j) => j !== i).map((x) => x[1]), pos = Math.floor(rng() * 4), options = [...wr]; options.splice(pos, 0, correct);
        return { q: `<p>What type of reaction is <b>${L[i][0]}</b>?</p>`, options, answer: pos, sol: `<p>It is a ${correct} reaction.</p>` };
      },
      verify: (p) => p.answer },
  ],
};
