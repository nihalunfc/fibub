// Class 11 Chemistry, Chapter 3 Classification of Elements and Periodicity in Properties: practice questions (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('pe');
const r3 = (x) => +x.toPrecision(3);

export default {
  topic: 'classification-of-elements-and-periodicity-in', name: 'Classification of Elements and Periodicity in Properties', n: 3,
  items: [
    m.mcq(1, 'history', '<p>Döbereiner’s triads are groups of three elements in which the:</p>', 'middle element has an atomic mass close to the average of the other two', ['three elements have equal masses', 'elements have the same atomic number', 'elements are all gases'], '<p>For example Li, Na, K: (7 + 39)/2 = 23.</p>'),
    m.mcq(2, 'history', '<p>Mendeleev’s main achievement was that he:</p>', 'left gaps for undiscovered elements and predicted their properties', ['arranged elements by atomic number', 'discovered the noble gases', 'found the neutron'], '<p>Gaps and predictions (eka-aluminium, eka-silicon) gave the table its power.</p>'),
    m.mcq(2, 'history', '<p>The modern periodic law is based on the:</p>', 'atomic number', ['atomic mass', 'number of neutrons', 'density'], '<p>Moseley showed that the atomic number, not the mass, is the ordering property.</p>'),
    m.mcq(2, 'table', '<p>An element has the configuration [Ar] 3d⁵ 4s². It is in:</p>', 'period 4, group 7, d-block', ['period 3, group 7, p-block', 'period 4, group 5, s-block', 'period 4, group 2, d-block'], '<p>Highest n = 4; last electron in 3d, so d-block; the group is 5 (d) + 2 (s) = 7 (manganese).</p>'),
    m.mcq(2, 'table', '<p>The block to which elements of group 17 belong is the:</p>', 'p-block', ['s-block', 'd-block', 'f-block'], '<p>The halogens have ns² np⁵.</p>'),
    m.mcq(2, 'table', '<p>The number of elements in the sixth period is:</p>', '32', ['18', '8', '28'], '<p>The sixth period fills 6s, 4f, 5d and 6p: 2 + 14 + 10 + 6 = 32.</p>'),
    m.mcq(2, 'table', '<p>Which of these is a metalloid?</p>', 'germanium', ['sodium', 'chlorine', 'mercury'], '<p>Ge, with Si, As, B, Sb and Te, lies along the metal and non-metal boundary.</p>'),
    m.mcq(2, 'names', '<p>The atomic number of the element with the systematic name ununseptium is:</p>', '117', ['171', '107', '177'], '<p>un = 1, un = 1, sept = 7: 117 (now tennessine).</p>'),
    m.mcq(2, 'names', '<p>The IUPAC symbol for the element with Z = 108 before it was named (un + nil + oct) is:</p>', 'Uno', ['Uuo', 'Unn', 'Uoo'], '<p>un (U), nil (n), oct (o): Uno. (Element 108 is now hassium, Hs.)</p>'),
    m.mcq(2, 'radius', '<p>Which has the largest radius?</p>', 'K', ['Na', 'Li', 'Mg'], '<p>K has one more shell than Na; Mg is smaller than Na across the period.</p>'),
    m.mcq(2, 'radius', '<p>The correct order of radius is:</p>', 'Cl⁻ > Cl > Cl⁺', ['Cl > Cl⁻ > Cl⁺', 'Cl⁺ > Cl > Cl⁻', 'Cl = Cl⁻ = Cl⁺'], '<p>An anion is larger than its atom and a cation smaller.</p>'),
    m.mcq(3, 'radius', '<p>Among the isoelectronic species O²⁻, F⁻, Na⁺ and Mg²⁺, the smallest is:</p>', 'Mg²⁺', ['O²⁻', 'F⁻', 'Na⁺'], '<p>It has the highest nuclear charge (+12) holding the same 10 electrons.</p>'),
    m.mcq(2, 'ionisation', '<p>The first ionisation enthalpy is lowest for:</p>', 'Cs', ['Li', 'Na', 'Rb'], '<p>It falls down the group, so Cs (376 kJ/mol) is the lowest.</p>'),
    m.mcq(3, 'ionisation', '<p>Which element has a higher first ionisation enthalpy than oxygen?</p>', 'nitrogen', ['boron', 'carbon', 'beryllium'], '<p>Nitrogen (1402 kJ/mol) is higher than oxygen (1314): half-filled 2p³ is stable.</p>', { trap: 'Assuming it always rises across the period.' }),
    m.mcq(3, 'ionisation', '<p>The first four ionisation enthalpies of an element (kJ/mol) are 738, 1451, 7733 and 10543. The element is:</p>', 'a group 2 element', ['a group 1 element', 'a group 13 element', 'a noble gas'], '<p>The big jump after the second shows 2 valence electrons.</p>'),
    m.mcq(2, 'egen', '<p>The element with the most negative electron gain enthalpy is:</p>', 'Cl', ['F', 'Br', 'O'], '<p>Chlorine (−349 kJ/mol), because fluorine’s small shell makes the incoming electron repel.</p>'),
    m.mcq(3, 'egen', '<p>The second electron gain enthalpy of oxygen is positive because:</p>', 'the electron is added to an already negative ion', ['oxygen is a metal', 'oxygen has a noble gas configuration', 'the nucleus is too small'], '<p>O⁻ repels the electron, so energy must be supplied.</p>'),
    m.mcq(2, 'en', '<p>On the Pauling scale the element with the highest electronegativity is:</p>', 'F', ['O', 'Cl', 'N'], '<p>F = 3.98.</p>'),
    m.mcq(2, 'en', '<p>Electronegativity across a period:</p>', 'increases from left to right', ['decreases from left to right', 'stays the same', 'is highest for the group 1 element'], '<p>Z_eff rises and the radius falls, so the pull on bonding electrons grows.</p>'),
    m.mcq(2, 'oxides', '<p>Which oxide is amphoteric?</p>', 'ZnO', ['CaO', 'CO₂', 'Na₂O'], '<p>ZnO (and Al₂O₃) react with both acids and bases.</p>'),
    m.mcq(2, 'oxides', '<p>The oxides of the elements of period 3 change from ... to ... across the period.</p>', 'basic, acidic', ['acidic, basic', 'amphoteric, basic', 'neutral, acidic'], '<p>Na₂O is strongly basic and Cl₂O₇ strongly acidic.</p>'),
    m.mcq(2, 'trends', '<p>Metallic character in a group from top to bottom:</p>', 'increases', ['decreases', 'stays the same', 'first increases then decreases'], '<p>Ionisation enthalpy falls, so the elements lose electrons more easily.</p>'),
    m.ar(2, 'ionisation', 'Successive ionisation enthalpies of an element always increase.', 'It is harder to remove an electron from a positively charged ion.', 0, '<p>Both true and R explains A.</p>'),
    m.ar(3, 'radius', 'Anions are larger than the parent atoms.', 'The nuclear charge is the same but there are more electrons, which repel one another.', 0, '<p>Both true and R explains A.</p>'),
    m.ar(3, 'ionisation', 'Boron has a lower first ionisation enthalpy than beryllium.', 'Boron has a higher nuclear charge than beryllium.', 1, '<p>A is true (the 2p electron is easier to remove than the filled 2s) and R is true, but R does not explain A: it would suggest the opposite.</p>'),
    m.nat(2, 'ionisation', '<p>Find the energy in kJ to remove one electron from each atom in 4.6 g of sodium (23 g/mol). ΔᵢH₁ = 496 kJ/mol.</p>', () => 0.2 * 496, 0.01, '<p>n = 4.6/23 = 0.20 mol; energy = 0.20 × 496 = 99.2 kJ.</p>', { unit: 'kJ' }),
    m.nat(2, 'table', '<p>How many elements are there in the fifth period?</p>', () => 18, 0.001, '<p>5s (2), 4d (10) and 5p (6) = 18.</p>', { unit: 'elements' }),
    m.nat(3, 'table', '<p>How many valence electrons has an element in group 16?</p>', () => 6, 0.001, '<p>Group 16 is ns² np⁴, so 6 outer electrons.</p>', { unit: 'electrons' }),
    m.msq(3, 'trends', '<p>Which trends are correct across a period from left to right? (Choose all that apply.)</p>', ['Atomic radius decreases', 'Electronegativity increases', 'Metallic character increases', 'Nature of oxides goes from basic to acidic'], [0, 1, 3], '<p>Metallic character decreases across a period.</p>'),
    m.msq(3, 'radius', '<p>Which pairs are isoelectronic? (Choose all that apply.)</p>', ['Na⁺ and F⁻', 'K⁺ and Cl⁻', 'Mg²⁺ and O²⁻', 'Li⁺ and Na⁺'], [0, 1, 2], '<p>Na⁺ and F⁻, K⁺ and Cl⁻, Mg²⁺ and O²⁻ all have 10 or 18 electrons; Li⁺ has 2 and Na⁺ 10.</p>'),
  ],
  gens: [
    { id: 'pe-g01', type: 'nat', level: 2, exams: ['board'], sub: 'ionisation',
      make(rng) { const A = choose(rng, [['Na', 23, 496], ['K', 39, 419], ['Li', 7, 520], ['Mg', 24, 738]]), g = choose(rng, [2.3, 3.9, 7, 12, 24]); const kj = g / A[1] * A[2]; return { A, g, q: `<p>The first ionisation enthalpy of ${A[0]} (${A[1]} g/mol) is ${A[2]} kJ/mol. How much energy in kJ removes one electron from each atom in ${g} g of gaseous ${A[0]}?</p>`, answer: r3(kj), tol: Math.max(0.05, kj * 0.01), unit: 'kJ', sol: `<p>n = ${g}/${A[1]} = ${r3(g / A[1])} mol; E = ${r3(g / A[1])} × ${A[2]} = ${r3(kj)} kJ.</p>` }; },
      verify: (p) => p.A[2] * p.g / p.A[1] },
    { id: 'pe-g02', type: 'nat', level: 2, exams: ['board'], sub: 'names',
      make(rng) { const Z = pick(rng, 104, 118); const R = ['nil', 'un', 'bi', 'tri', 'quad', 'pent', 'hex', 'sept', 'oct', 'enn']; const nm = String(Z).split('').map((d) => R[+d]).join(''); return { Z, nm, q: `<p>An element has the temporary systematic name <b>${nm}ium</b> (nil 0, un 1, bi 2, tri 3, quad 4, pent 5, hex 6, sept 7, oct 8, enn 9). What is its atomic number?</p>`, answer: Z, tol: 0, sol: `<p>${nm} = ${String(Z).split('').map((d) => R[+d]).join(' + ')} → digits ${String(Z).split('').join('')} → ${Z}.</p>` }; },
      verify: (p) => p.Z },
    { id: 'pe-g03', type: 'nat', level: 3, exams: ['board'], sub: 'ionisation',
      make(rng) { const E = choose(rng, [[496, 4562, 6910, 9543, 1], [738, 1451, 7733, 10543, 2], [578, 1817, 2745, 11577, 3], [590, 1145, 4912, 6491, 2]]); return { E, q: `<p>The first four ionisation enthalpies (kJ/mol) of an element are ${E.slice(0, 4).join(', ')}. How many valence electrons does it have?</p>`, answer: E[4], tol: 0, sol: `<p>The biggest jump comes after electron number ${E[4]}, so there are ${E[4]} valence electrons.</p>` }; },
      verify: (p) => { let b = 0, bi = 0; for (let i = 1; i < 4; i++) { const r = p.E[i] / p.E[i - 1]; if (r > b) { b = r; bi = i; } } return bi; } },
  ],
};
