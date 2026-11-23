// Class 11 Chemistry, Chapter 7 Redox Reactions: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { choose } from '../_util.js';
const m = maker('rx');
const r3 = (x) => +x.toPrecision(3);

export default {
  topic: 'redox-reactions', name: 'Redox Reactions', n: 7,
  items: [
    m.mcq(1, 'concept', '<p>In terms of electrons, oxidation is:</p>', 'loss of electrons', ['gain of electrons', 'gain of protons', 'loss of neutrons'], '<p>OIL RIG: Oxidation Is Loss, Reduction Is Gain, of electrons.</p>'),
    m.mcq(1, 'concept', '<p>A reducing agent is a substance that:</p>', 'loses electrons and is itself oxidised', ['gains electrons and is itself reduced', 'loses electrons and is itself reduced', 'gains electrons and is itself oxidised'], '<p>The reducing agent supplies the electrons that reduce the other substance, so it is oxidised.</p>'),
    m.mcq(1, 'oxnum', '<p>The oxidation number of oxygen in H₂O₂ is:</p>', '−1', ['−2', '0', '+1'], '<p>In a peroxide the O–O bond means each O is −1 (H is +1, so 2(+1) + 2x = 0, x = −1).</p>'),
    m.mcq(2, 'oxnum', '<p>The oxidation number of Mn in KMnO₄ is:</p>', '+7', ['+2', '+4', '+6'], '<p>+1 + x + 4(−2) = 0 gives x = +7.</p>'),
    m.mcq(2, 'oxnum', '<p>The oxidation number of sulphur in Na₂S₂O₃ is:</p>', '+2', ['+4', '+6', '−2'], '<p>2(+1) + 2x + 3(−2) = 0 gives 2x = 4, x = +2 (an average over the two S atoms, which are really −1 and +5).</p>'),
    m.mcq(2, 'oxnum', '<p>Hydrogen has oxidation number −1 in:</p>', 'NaH', ['H₂O', 'HCl', 'NH₃'], '<p>In metal hydrides hydrogen is more electronegative than the metal, so it is −1.</p>'),
    m.mcq(2, 'oxnum', '<p>Oxygen has a positive oxidation number in:</p>', 'OF₂', ['H₂O₂', 'Na₂O₂', 'KO₂'], '<p>Fluorine is more electronegative than oxygen, so in OF₂ oxygen is +2.</p>'),
    m.mcq(2, 'types', '<p>Which is a disproportionation reaction?</p>', '2H₂O₂ → 2H₂O + O₂', ['2Mg + O₂ → 2MgO', 'Zn + CuSO₄ → ZnSO₄ + Cu', 'CaCO₃ → CaO + CO₂'], '<p>In H₂O₂ oxygen is −1; it goes to −2 (in H₂O) and 0 (in O₂): the same element is oxidised and reduced.</p>'),
    m.mcq(2, 'types', '<p>Which of these is NOT a redox reaction?</p>', 'AgNO₃ + NaCl → AgCl + NaNO₃', ['2Na + Cl₂ → 2NaCl', 'Zn + 2HCl → ZnCl₂ + H₂', '2KClO₃ → 2KCl + 3O₂'], '<p>All oxidation numbers stay the same in the precipitation reaction, so no electrons move.</p>'),
    m.mcq(2, 'balancing', '<p>In MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O, the number of electrons gained by one MnO₄⁻ is:</p>', '5', ['1', '2', '7'], '<p>Mn goes from +7 to +2, a decrease of 5.</p>'),
    m.mcq(3, 'balancing', '<p>When Cr₂O₇²⁻ is reduced to Cr³⁺ in acid, the number of electrons needed per Cr₂O₇²⁻ is:</p>', '6', ['3', '2', '12'], '<p>Each Cr goes +6 → +3 (3 electrons) and there are two Cr atoms: 6 electrons.</p>'),
    m.mcq(3, 'balancing', '<p>In the balanced equation x MnO₄⁻ + y I⁻ + 4H₂O → 2MnO₂ + 3I₂ + 8OH⁻, the values of x and y are:</p>', '2 and 6', ['1 and 3', '3 and 2', '2 and 3'], '<p>Mn needs 3e⁻ per atom, each I⁻ gives 1e⁻: for 2 Mn, 6e⁻ are needed, so 6 I⁻ (and 2 MnO₄⁻).</p>'),
    m.mcq(2, 'series', '<p>Which metal does not liberate hydrogen from dilute HCl?</p>', 'copper', ['zinc', 'iron', 'magnesium'], '<p>Copper lies below hydrogen in the electrochemical series (E° = +0.34 V), so it cannot reduce H⁺.</p>'),
    m.mcq(2, 'series', '<p>An iron nail dipped in copper sulphate solution becomes coated with copper because:</p>', 'iron is more reactive than copper and reduces Cu²⁺', ['copper is more reactive than iron', 'iron is reduced', 'the solution is acidic'], '<p>Fe → Fe²⁺ + 2e⁻ and Cu²⁺ + 2e⁻ → Cu: iron is the reducing agent.</p>'),
    m.mcq(1, 'cell', '<p>In a galvanic cell, electrons flow through the external wire from:</p>', 'the anode to the cathode', ['the cathode to the anode', 'the salt bridge to the cathode', 'the electrolyte to the anode'], '<p>The anode is where oxidation releases electrons; they go to the cathode where reduction consumes them.</p>'),
    m.mcq(3, 'titration', '<p>In the titration of Fe²⁺ with KMnO₄ in acid, the end point is shown by:</p>', 'the first permanent pink colour', ['the solution turning colourless', 'a white precipitate', 'the solution turning blue'], '<p>KMnO₄ acts as its own indicator: its purple colour disappears while Fe²⁺ remains, and the first excess drop gives a permanent pink.</p>'),
    m.mcq(3, 'concept', '<p>Which change represents oxidation of the italicised atom?</p>', 'Fe²⁺ → Fe³⁺', ['MnO₄⁻ → Mn²⁺', 'Cl₂ → 2Cl⁻', 'Cu²⁺ → Cu'], '<p>Oxidation raises the oxidation number: Fe goes +2 → +3. The other three are reductions.</p>'),
    m.ar(2, 'oxnum', 'The oxidation number of an element in its free state is zero.', 'An atom in the free state has not lost or gained any electron share.', 0, '<p>Both true and R explains A: nothing is more electronegative than itself in a bond with its own kind.</p>'),
    m.ar(3, 'types', 'Disproportionation needs an element in an intermediate oxidation state.', 'A species at the highest oxidation state of an element can only be reduced.', 1, '<p>Both statements are true, but R is about a different case. A species in an intermediate state can both gain and lose electrons, which is why it can disproportionate.</p>'),
    m.ar(3, 'oxnum', 'The oxidation number of Fe in Fe₃O₄ is a fraction.', 'Fe₃O₄ contains iron in two different oxidation states, so +8/3 is an average.', 0, '<p>Both true and R explains A: two Fe³⁺ and one Fe²⁺ average to +8/3.</p>'),
    m.ar(3, 'balancing', 'In a balanced redox equation the total charge on the left equals that on the right.', 'Electrons lost by the reducing agent are gained by the oxidising agent.', 0, '<p>Both true and R explains A: because electrons are neither created nor destroyed, charge is conserved.</p>'),
    m.ar(2, 'concept', 'Oxidation can occur without any oxygen being involved.', 'Oxidation is defined as a loss of electrons.', 0, '<p>Both true and R explains A: 2Na + Cl₂ → 2NaCl has no oxygen, yet sodium is oxidised.</p>'),
    m.nat(2, 'oxnum', '<p>Find the oxidation number of chromium in the dichromate ion Cr₂O₇²⁻.</p>', () => 6, 0, '<p>2x + 7(−2) = −2, so 2x = 12, x = +6.</p>'),
    m.nat(3, 'balancing', '<p>How many moles of Fe²⁺ are oxidised by 0.01 mol of MnO₄⁻ in acid?</p>', () => 0.05, 0.01, '<p>MnO₄⁻ : Fe²⁺ = 1 : 5, so 0.01 × 5 = 0.05 mol.</p>'),
    m.nat(3, 'series', '<p>E°(Zn²⁺/Zn) = −0.76 V and E°(Ag⁺/Ag) = +0.80 V. Find E°cell (in V) of the cell with these two electrodes.</p>', () => 1.56, 0.01, '<p>E°cell = 0.80 − (−0.76) = 1.56 V.</p>'),
    m.nat(3, 'titration', '<p>25 mL of 0.10 M Fe²⁺ needs how many mL of 0.020 M KMnO₄ in acid?</p>', () => 25, 0.01, '<p>Fe²⁺ = 2.5 mmol; MnO₄⁻ = 0.5 mmol; V = 0.5/0.020 = 25 mL.</p>'),
    m.msq(3, 'types', '<p>Which of these reactions are redox reactions? (Choose all that apply.)</p>', ['2H₂ + O₂ → 2H₂O', 'CaCO₃ → CaO + CO₂', 'Zn + CuSO₄ → ZnSO₄ + Cu', 'HCl + NaOH → NaCl + H₂O'], [0, 2], '<p>Only the first and third involve changes in oxidation number. Decomposition of CaCO₃ and neutralisation leave every oxidation number unchanged.</p>'),
    m.msq(3, 'oxnum', '<p>Which statements about oxidation numbers are correct? (Choose all that apply.)</p>', ['N in NH₄⁺ is −3', 'S in H₂SO₄ is +6', 'Cl in ClO₃⁻ is +7', 'C in CO is +2'], [0, 1, 3], '<p>Cl in ClO₃⁻ is +5 (x − 6 = −1), so the third is false.</p>'),
  ],
  gens: [
    { id: 'rx-g01', type: 'nat', level: 2, exams: ['board'], sub: 'oxnum',
      make(rng) { const c = choose(rng, [['KMnO₄', 'Mn', 1, -7, 0], ['K₂Cr₂O₇', 'Cr', 2, -12, 0], ['H₂SO₄', 'S', 1, -6, 0], ['ClO₃⁻', 'Cl', 1, -6, -1], ['MnO₄²⁻', 'Mn', 1, -8, -2], ['H₃PO₄', 'P', 1, -5, 0]]); const x = (c[4] - c[3]) / c[2]; return { c, q: `<p>Find the oxidation number of ${c[1]} in ${c[0]}.</p>`, answer: x, tol: 0, sol: `<p>The other atoms add up to ${c[3]}, so ${c[2]}x + (${c[3]}) = ${c[4]} and x = ${x}.</p>` }; },
      verify: (p) => { for (let v = -10; v <= 10; v++) if (p.c[2] * v + p.c[3] === p.c[4]) return v; return NaN; } },
    { id: 'rx-g02', type: 'nat', level: 3, exams: ['board'], sub: 'titration',
      make(rng) { const cF = choose(rng, [0.05, 0.1, 0.15, 0.2]), cK = choose(rng, [0.02, 0.04]), VF = choose(rng, [20, 25, 50]); const V = VF * cF / 5 / cK; return { cF, cK, VF, q: `<p>${VF} mL of ${cF} M Fe²⁺ is titrated with ${cK} M KMnO₄ in acid. Find the volume of KMnO₄ in mL needed for the end point.</p>`, answer: +V.toFixed(4), tol: 0.01, unit: 'mL', sol: `<p>Fe²⁺ = ${r3(VF * cF)} mmol; MnO₄⁻ = ${r3(VF * cF / 5)} mmol; V = ${r3(V)} mL.</p>` }; },
      verify: (p) => ((p.cF * p.VF) / 1000 / 5 / p.cK) * 1000 },
    { id: 'rx-g03', type: 'nat', level: 2, exams: ['board'], sub: 'series',
      make(rng) { const E = [['Zn', -0.76], ['Fe', -0.44], ['Cu', 0.34], ['Ag', 0.80], ['Mg', -2.37]]; const [a, c] = choose(rng, [[0, 2], [1, 3], [4, 2], [0, 3], [4, 1]]); const V = E[c][1] - E[a][1]; return { a, c, E, q: `<p>E° values: ${E[a][0]}²⁺/${E[a][0]} = ${E[a][1]} V and ${E[c][0]} half-cell = ${E[c][1]} V. Find E°cell (in V) when these form a galvanic cell.</p>`, answer: r3(V), tol: 0.01, unit: 'V', sol: `<p>E°cell = ${E[c][1]} − (${E[a][1]}) = ${r3(V)} V.</p>` }; },
      verify: (p) => Math.abs(p.E[p.c][1] - p.E[p.a][1]) },
  ],
};
