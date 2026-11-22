// Class 10 Science, Chapter 3 Metals and Non-metals: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('mn');
const r2 = (x) => Math.round(x * 100) / 100;

export default {
  topic: 'metals-and-non-metals', name: 'Metals and Non-metals', n: 3,
  items: [
    m.mcq(1, 'physical', '<p>The ability of metals to be beaten into thin sheets is called:</p>', 'malleability', ['ductility', 'sonority', 'brittleness'], '<p>Malleable means it can be hammered into sheets (aluminium foil). Ductile means drawn into wires.</p>'),
    m.mcq(1, 'physical', '<p>Which non-metal conducts electricity?</p>', 'graphite', ['sulphur', 'iodine', 'phosphorus'], '<p>Graphite, a form of carbon, has free electrons between its layers.</p>'),
    m.mcq(2, 'physical', '<p>Which metal is liquid at room temperature?</p>', 'mercury', ['sodium', 'lead', 'bromine'], '<p>Mercury is the only metal that is liquid at room temperature. Bromine is also a liquid, but it is a non-metal.</p>'),
    m.mcq(2, 'chemical', '<p>Sodium is stored in kerosene because it:</p>', 'reacts vigorously with air and water', ['is a gas', 'dissolves in kerosene', 'is radioactive'], '<p>Sodium is so reactive that it burns in air and reacts violently with water, so it is kept under kerosene.</p>'),
    m.mcq(2, 'chemical', '<p>Which of these metals does <i>not</i> react with dilute hydrochloric acid?</p>', 'copper', ['zinc', 'magnesium', 'iron'], '<p>Copper is below hydrogen in the reactivity series, so it cannot displace H₂ from acid.</p>'),
    m.mcq(2, 'chemical', '<p>When a metal reacts with dilute acid, the gas evolved is usually:</p>', 'hydrogen', ['oxygen', 'carbon dioxide', 'nitrogen'], '<p>Metal + dilute acid → salt + hydrogen.</p>'),
    m.mcq(2, 'chemical', '<p>The metal oxide Al₂O₃ is called amphoteric because it:</p>', 'reacts with both acids and bases', ['reacts with neither', 'is an acid only', 'is a base only'], '<p>Amphoteric oxides (Al₂O₃, ZnO) react with acids and with bases to give salt and water.</p>'),
    m.mcq(2, 'reactivity', '<p>Which is the correct order of decreasing reactivity?</p>', 'Na > Mg > Zn > Fe > Cu', ['Cu > Fe > Zn > Mg > Na', 'Mg > Na > Zn > Cu > Fe', 'Zn > Na > Fe > Mg > Cu'], '<p>Sodium is the most reactive of these and copper the least.</p>'),
    m.mcq(2, 'reactivity', '<p>Iron nails are placed in blue copper sulphate solution. After a while:</p>', 'a brown coating forms on the nails and the blue colour fades', ['nothing happens', 'the nails dissolve completely and the solution stays blue', 'a white precipitate forms'], '<p>Fe + CuSO₄ → FeSO₄ + Cu: copper is displaced and deposited, and the solution turns pale green.</p>'),
    m.mcq(2, 'reactivity', '<p>Which of these pairs will <i>not</i> react?</p>', 'copper strip and zinc sulphate solution', ['zinc strip and copper sulphate solution', 'magnesium strip and zinc sulphate solution', 'iron strip and copper sulphate solution'], '<p>Copper is less reactive than zinc, so it cannot displace it.</p>'),
    m.mcq(2, 'ionic', '<p>In the formation of NaCl, the sodium atom:</p>', 'loses one electron to become Na⁺', ['gains one electron to become Na⁻', 'shares one electron with chlorine', 'loses two electrons'], '<p>Na (2,8,1) loses its outer electron and becomes Na⁺ (2,8), a stable octet.</p>'),
    m.mcq(2, 'ionic', '<p>The formula of magnesium chloride is:</p>', 'MgCl₂', ['MgCl', 'Mg₂Cl', 'Mg₂Cl₂'], '<p>Mg²⁺ needs two Cl⁻ to balance charge.</p>'),
    m.mcq(2, 'ionic', '<p>Which property is <i>not</i> shown by ionic compounds?</p>', 'conduct electricity when solid', ['high melting points', 'brittle', 'conduct when molten'], '<p>In the solid state the ions are locked in place, so there is no current; they conduct when molten or dissolved.</p>'),
    m.mcq(3, 'ionic', '<p>An element X has electrons arranged 2, 8, 7. It is most likely to form:</p>', 'an ion X⁻', ['an ion X⁺', 'an ion X²⁺', 'no ions'], '<p>It needs one more electron for the octet, so it gains one electron and becomes X⁻.</p>'),
    m.mcq(2, 'extraction', '<p>Metals low in the reactivity series, such as mercury, are usually extracted by:</p>', 'heating the ore', ['electrolysis of the molten ore', 'reduction with aluminium', 'adding acid'], '<p>Their oxides are unstable to heat, so heating the ore (or its sulphide in air) is enough.</p>'),
    m.mcq(2, 'extraction', '<p>Heating a sulphide ore strongly in excess air to make the oxide is called:</p>', 'roasting', ['calcination', 'smelting only', 'electrolysis'], '<p>Roasting is for sulphides (gives SO₂); calcination is for carbonates (gives CO₂).</p>', { trap: 'Roasting: sulphide, excess air. Calcination: carbonate, limited air.' }),
    m.mcq(2, 'extraction', '<p>Sodium and aluminium are obtained by:</p>', 'electrolysis of their molten compounds', ['reduction with carbon', 'heating their ores in air', 'reduction with zinc'], '<p>These very reactive metals hold their oxygen or chlorine too strongly for carbon to remove, so electrolysis is used.</p>'),
    m.mcq(2, 'extraction', '<p>In the electrolytic refining of copper, the pure copper is deposited at the:</p>', 'cathode', ['anode', 'both electrodes', 'the bottom as mud'], '<p>Cu²⁺ ions pick up electrons at the cathode and become copper atoms. The anode is the impure metal.</p>'),
    m.mcq(2, 'corrosion', '<p>Galvanisation protects iron because zinc:</p>', 'is more reactive and is oxidised in preference to iron', ['is lighter than iron', 'is a non-metal', 'prevents oxygen from existing'], '<p>Zinc forms a protective layer and, even when scratched, corrodes first, sparing the iron.</p>'),
    m.mcq(2, 'corrosion', '<p>An alloy is:</p>', 'a homogeneous mixture of a metal with other metals or non-metals', ['a compound of two metals only', 'a pure metal', 'a solution of a salt'], '<p>Brass (Cu + Zn), steel (Fe + C) and solder (Pb + Sn) are alloys: mixtures with new properties.</p>'),
    m.ar(2, 'physical', 'Metals are good conductors of heat and electricity.', 'Metals contain free electrons that can move through them.', 0, '<p>Both true and R explains A.</p>'),
    m.ar(2, 'ionic', 'Ionic compounds have high melting points.', 'The ionic bond between oppositely charged ions is strong.', 0, '<p>A lot of energy is needed to break the strong attraction in the lattice.</p>'),
    m.ar(3, 'reactivity', 'Copper does not liberate hydrogen from dilute acids.', 'Copper is more reactive than hydrogen.', 2, '<p>A is true; R is false: copper is below hydrogen in the series, so it is less reactive.</p>'),
    m.ar(3, 'corrosion', 'Zinc is used to galvanise iron.', 'Zinc is less reactive than iron.', 2, '<p>A is true; R is false. Zinc is <i>more</i> reactive than iron, and that is why it protects.</p>'),
    m.nat(1, 'ionic', '<p>How many electrons does a magnesium atom (2, 8, 2) lose to form Mg²⁺?</p>', () => 2, 0, '<p>It loses its 2 outer electrons.</p>'),
    m.nat(2, 'ionic', '<p>How many chloride ions combine with one aluminium ion Al³⁺ in aluminium chloride?</p>', () => 3, 0, '<p>AlCl₃: three Cl⁻ balance one Al³⁺.</p>'),
    m.nat(3, 'extraction', '<p>Fe₂O₃ + 3CO → 2Fe + 3CO₂. How many kg of iron come from 320 kg of Fe₂O₃? (Fe = 56, O = 16.)</p>', () => (320 * 112) / 160, 0.01, '<p>Fe₂O₃ = 160, iron in it 112: 320 × 112/160 = 224 kg.</p>', { unit: 'kg' }),
    m.nat(3, 'extraction', '<p>How many kg of aluminium are needed for the thermite reaction with 80 kg of Fe₂O₃ (Fe₂O₃ + 2Al → Al₂O₃ + 2Fe)? (Al = 27, Fe = 56, O = 16.)</p>', () => (80 * 54) / 160, 0.01, '<p>160 kg Fe₂O₃ needs 54 kg Al, so 80 kg needs 27 kg.</p>', { unit: 'kg' }),
    m.msq(2, 'physical', '<p>Which of these are properties of metals? (Choose all that apply.)</p>', ['lustrous', 'sonorous', 'brittle in the solid state', 'good conductors of heat'], [0, 1, 3], '<p>Metals are shiny, ring when struck and conduct heat. Brittleness is typical of non-metals.</p>'),
    m.msq(3, 'extraction', '<p>Which of these are ways to prevent rusting? (Choose all that apply.)</p>', ['galvanising', 'painting', 'oiling or greasing', 'leaving it wet'], [0, 1, 2], '<p>Each of the first three cuts off air and water. Moisture speeds up rusting.</p>'),
  ],
  gens: [
    { id: 'mn-g01', type: 'nat', level: 3, exams: ['board'], sub: 'extraction',
      make(rng) { const M = pick(rng, 16, 480, 16); return { M, q: `<p>How many kg of iron can be obtained from ${M} kg of pure Fe₂O₃ (Fe₂O₃ + 3CO → 2Fe + 3CO₂)? (Fe = 56, O = 16.)</p>`, answer: r2((M * 112) / 160), tol: 0.01, unit: 'kg', sol: `<p>Fe₂O₃ = 160 and 112 of that is iron: ${M} × 112/160 = ${r2((M * 112) / 160)} kg.</p>` }; },
      verify: (p) => r2((p.M / 160) * 112) },
    { id: 'mn-g02', type: 'nat', level: 3, exams: ['board'], sub: 'extraction',
      make(rng) { const M = pick(rng, 117, 1170, 117); return { M, q: `<p>How many kg of sodium are produced by the electrolysis of ${M} kg of molten NaCl? (Na = 23, Cl = 35.5.)</p>`, answer: r2((M * 23) / 58.5), tol: 0.01, unit: 'kg', sol: `<p>${M} × 23/58.5 = ${r2((M * 23) / 58.5)} kg.</p>` }; },
      verify: (p) => r2(p.M - (p.M * 35.5) / 58.5) },
    { id: 'mn-g03', type: 'nat', level: 2, exams: ['board'], sub: 'ionic',
      make(rng) { const a = choose(rng, [1, 2, 3]), b = choose(rng, [1, 2, 3]); const g = (x, y) => (y ? g(y, x % y) : x); return { a, b, q: `<p>A metal ion with charge ${a}+ combines with a non-metal ion with charge ${b}−. In the simplest formula, how many metal ions are there?</p>`, answer: b / g(a, b), tol: 0, sol: `<p>Cross the charges and simplify: metal count = ${b}/${g(a, b)} = ${b / g(a, b)}.</p>` }; },
      verify: (p) => { let k = 1; while ((k * p.a) % p.b) k++; return k; } },
    { id: 'mn-g04', type: 'mcq', level: 2, exams: ['board'], sub: 'reactivity',
      make(rng) {
        const ORDER = ['Mg', 'Zn', 'Fe', 'Cu'], i = Math.floor(rng() * 3), j = i + 1 + Math.floor(rng() * (3 - i)), A = ORDER[i], B = ORDER[j], pos = Math.floor(rng() * 4);
        const correct = `${A} displaces ${B}`, wr = [`${B} displaces ${A}`, 'both displace each other', 'neither reacts'], options = [...wr]; options.splice(pos, 0, correct);
        return { q: `<p>A strip of ${A} is put in a solution of the sulphate of ${B}. Which statement is correct? (Reactivity: Mg > Zn > Fe > Cu.)</p>`, options, answer: pos, sol: `<p>${A} is more reactive than ${B}, so it displaces ${B} from its salt.</p>` };
      },
      verify: (p) => p.answer },
  ],
};
