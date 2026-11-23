// Class 11 Chemistry, Chapter 8 Organic Chemistry: Some Basic Principles and Techniques: practice questions (original fibub questions).
import { maker } from './_make.js';
import { choose } from '../_util.js';
const m = maker('og');
const r3 = (x) => +x.toPrecision(3);

export default {
  topic: 'organic-chemistry-some-basic-principles-and', name: 'Organic Chemistry: Some Basic Principles and Techniques', n: 8,
  items: [
    m.mcq(1, 'shape', '<p>The hybridisation of the carbon atoms in ethene (C₂H₄) is:</p>', 'sp²', ['sp³', 'sp', 'sp³d'], '<p>Each carbon has one double bond and two single bonds: three σ bonds around it, so sp² (planar, 120°).</p>'),
    m.mcq(2, 'shape', '<p>How many σ and π bonds are there in propyne, CH₃–C≡CH?</p>', '6 σ and 2 π', ['5 σ and 3 π', '7 σ and 1 π', '6 σ and 1 π'], '<p>Single bonds: 3 C–H on CH₃, C–C, C–H on the end = 5, plus 1 σ in the triple bond = 6σ. The triple bond has 2 π bonds.</p>'),
    m.mcq(1, 'classify', '<p>Which of these is a heterocyclic compound?</p>', 'pyridine', ['benzene', 'cyclohexane', 'toluene'], '<p>Pyridine has a nitrogen atom in the ring, so it is heterocyclic. The other rings contain only carbon.</p>'),
    m.mcq(2, 'name', '<p>The IUPAC name of CH₃CH₂CH(CH₃)CH₂OH is:</p>', '2-methylbutan-1-ol', ['3-methylbutan-4-ol', '2-ethylpropan-1-ol', 'pentan-1-ol'], '<p>The longest chain including –OH has 4 carbons (butane). –OH on C1; methyl on C2: 2-methylbutan-1-ol.</p>'),
    m.mcq(2, 'name', '<p>The IUPAC name of CH₃–CH=CH–CH₂–CH₃ is:</p>', 'pent-2-ene', ['pent-3-ene', 'pent-4-ene', 'pent-1-ene'], '<p>Number from the end that gives the double bond the lowest number: from the left it is between C2 and C3, so pent-2-ene.</p>'),
    m.mcq(3, 'name', '<p>The correct IUPAC name for CH₃CH(Cl)CH₂CH(CH₃)₂ is:</p>', '2-chloro-4-methylpentane', ['4-chloro-2-methylpentane', '2-methyl-4-chloropentane', '1-chloro-1,3-dimethylbutane'], '<p>Parent: pentane. Substituents chloro and methyl get the lowest set of numbers {2,4} either way; alphabetically chloro comes before methyl, so chloro gets the lower number: 2-chloro-4-methylpentane.</p>'),
    m.mcq(2, 'isomer', '<p>Ethanol (C₂H₅OH) and methoxymethane (CH₃OCH₃) are:</p>', 'functional group isomers', ['chain isomers', 'position isomers', 'the same compound'], '<p>Same formula C₂H₆O, different functional group (alcohol and ether).</p>'),
    m.mcq(2, 'isomer', '<p>How many chain isomers does C₅H₁₂ have?</p>', '3', ['2', '4', '5'], '<p>Pentane, 2-methylbutane and 2,2-dimethylpropane.</p>'),
    m.mcq(3, 'isomer', '<p>Which pair shows metamerism?</p>', 'CH₃OC₃H₇ and C₂H₅OC₂H₅', ['propan-1-ol and propan-2-ol', 'butane and 2-methylpropane', 'ethanol and methoxymethane'], '<p>Metamers have different alkyl groups on each side of the same functional group (ether O), here methyl+propyl against ethyl+ethyl.</p>'),
    m.mcq(1, 'fission', '<p>Homolytic fission of a bond gives:</p>', 'free radicals', ['a cation and an anion', 'two carbocations', 'two carbanions'], '<p>Each atom keeps one electron of the shared pair, so each becomes a free radical.</p>'),
    m.mcq(2, 'reagent', '<p>Which one is an electrophile?</p>', 'NO₂⁺', ['OH⁻', 'NH₃', 'CN⁻'], '<p>NO₂⁺ is electron-poor and accepts an electron pair; the others are electron-rich nucleophiles.</p>'),
    m.mcq(2, 'effect', '<p>Which is a stronger acid?</p>', 'ClCH₂COOH', ['CH₃COOH', 'CH₃CH₂COOH', 'CH₃CH₂CH₂COOH'], '<p>Chlorine’s −I effect stabilises the carboxylate ion, giving a lower pKa (2.86 against 4.76).</p>'),
    m.mcq(2, 'effect', '<p>The order of stability of carbocations is:</p>', '(CH₃)₃C⁺ > (CH₃)₂CH⁺ > CH₃CH₂⁺ > CH₃⁺', ['CH₃⁺ > CH₃CH₂⁺ > (CH₃)₂CH⁺ > (CH₃)₃C⁺', '(CH₃)₂CH⁺ > (CH₃)₃C⁺ > CH₃CH₂⁺ > CH₃⁺', 'all are equally stable'], '<p>More alkyl groups give more +I push and hyperconjugation, so 3° > 2° > 1° > methyl.</p>'),
    m.mcq(3, 'effect', '<p>The number of hyperconjugative structures (α C–H bonds) in the tert-butyl cation (CH₃)₃C⁺ is:</p>', '9', ['3', '6', '12'], '<p>Three methyl groups with three C–H each give 9 α hydrogens.</p>'),
    m.mcq(2, 'reaction', '<p>The reaction CH₃CH₂Br + alcoholic KOH → CH₂=CH₂ is:</p>', 'elimination', ['substitution', 'addition', 'rearrangement'], '<p>HBr is removed from adjacent carbons to give a double bond: elimination.</p>'),
    m.mcq(2, 'purify', '<p>Aniline (b.p. 457 K) can be separated from water by:</p>', 'steam distillation', ['sublimation', 'crystallisation', 'simple filtration'], '<p>Aniline is immiscible with water and volatile in steam, so it distils over below 373 K.</p>'),
    m.mcq(2, 'purify', '<p>Two liquids whose boiling points are 329 K and 338 K are best separated by:</p>', 'fractional distillation', ['simple distillation', 'steam distillation', 'sublimation'], '<p>The difference is only 9 K, too small for simple distillation.</p>'),
    m.mcq(2, 'chroma', '<p>In TLC, a spot moves 3.0 cm while the solvent moves 12.0 cm. Its Rf value is:</p>', '0.25', ['4.0', '0.75', '0.4'], '<p>Rf = 3.0 ÷ 12.0 = 0.25.</p>'),
    m.mcq(2, 'qual', '<p>A blood-red colour with FeCl₃ in the Lassaigne test shows the presence of:</p>', 'nitrogen and sulphur together', ['nitrogen only', 'sulphur only', 'a halogen'], '<p>SCN⁻ forms and gives [Fe(SCN)]²⁺, blood red.</p>'),
    m.mcq(3, 'qual', '<p>Before adding AgNO₃ to the sodium extract to test for halogens, we boil it with dilute HNO₃ to:</p>', 'remove CN⁻ and S²⁻ that would also give precipitates', ['oxidise the halide', 'convert NaX into HX', 'dissolve the silver halide'], '<p>Cyanide and sulphide would form AgCN and Ag₂S, which would be mistaken for halides.</p>'),
    m.ar(2, 'fission', 'Heterolytic fission of a covalent bond gives a cation and an anion.', 'In heterolytic fission both shared electrons go to one atom.', 0, '<p>Both true and R explains A.</p>'),
    m.ar(3, 'effect', 'The tert-butyl carbocation is more stable than the methyl carbocation.', 'The tert-butyl carbocation has more hyperconjugative structures.', 0, '<p>Both true and R explains A: 9 α C–H bonds help spread the charge, along with +I of three methyl groups.</p>'),
    m.ar(3, 'effect', 'All C–O bonds in the carboxylate ion are equal in length.', 'The carboxylate ion is a resonance hybrid.', 0, '<p>Both true and R explains A: the two contributing structures put the double bond on either oxygen, and the hybrid has two bonds of equal length.</p>'),
    m.ar(3, 'qual', 'Kjeldahl’s method cannot be used to estimate nitrogen in nitro compounds.', 'Nitro groups cannot be converted to ammonium sulphate by this digestion.', 0, '<p>Both true and R explains A.</p>'),
    m.nat(2, 'quant', '<p>0.30 g of a compound gives 0.44 g of CO₂ on combustion. Find the percentage of carbon.</p>', () => 40, 0.01, '<p>Mass of C = 12/44 × 0.44 = 0.12 g; % = 0.12/0.30 × 100 = 40%.</p>'),
    m.nat(3, 'quant', '<p>0.28 g of a compound gives 22.4 mL of N₂ at STP in the Dumas method (22 400 mL per mole). Find % nitrogen.</p>', () => 10, 0.01, '<p>Moles N₂ = 0.001; mass N = 0.028 g; % = 0.028/0.28 × 100 = 10%.</p>'),
    m.nat(3, 'quant', '<p>0.50 g of a compound in the Kjeldahl method gives ammonia that neutralises 20 mL of 0.10 M H₂SO₄. Find % N.</p>', () => 11.2, 0.01, '<p>Moles H₂SO₄ = 0.002; NH₃ = 0.004 mol; N = 0.056 g; % = 11.2%.</p>'),
    m.msq(3, 'effect', '<p>Which of the following show the −I effect? (Choose all that apply.)</p>', ['–NO₂', '–Cl', '–CH₃', '–COOH'], [0, 1, 3], '<p>Alkyl groups such as –CH₃ push electrons (+I). The other three pull them.</p>'),
    m.msq(3, 'purify', '<p>Which pairs can be separated by crystallisation or sublimation? (Choose all that apply.)</p>', ['camphor and sodium chloride (sublimation)', 'benzoic acid and sodium chloride (crystallisation from hot water)', 'ethanol and water (sublimation)', 'iodine and sand (sublimation)'], [0, 1, 3], '<p>Ethanol and water are liquids; sublimation does not apply to them.</p>'),
  ],
  gens: [
    { id: 'og-g01', type: 'nat', level: 2, exams: ['board'], sub: 'quant',
      make(rng) { const w = choose(rng, [0.20, 0.25, 0.30, 0.40]), co2 = choose(rng, [0.22, 0.33, 0.44, 0.55, 0.66]); const p = 12 / 44 * co2 / w * 100; return { w, co2, q: `<p>${w} g of an organic compound gives ${co2} g of CO₂ on combustion. Find % carbon.</p>`, answer: +p.toFixed(4), tol: 0.01, unit: '%', sol: `<p>C = 12/44 × ${co2} = ${r3(12 / 44 * co2)} g; % C = ${r3(p)}.</p>` }; },
      verify: (p) => (p.co2 / 44) * 12 / p.w * 100 },
    { id: 'og-g02', type: 'nat', level: 3, exams: ['board'], sub: 'quant',
      make(rng) { const w = choose(rng, [0.25, 0.30, 0.50, 0.60]), M = choose(rng, [0.05, 0.10, 0.20]), V = choose(rng, [10, 15, 20, 25]); const p = 1.4 * 2 * M * V / w; return { w, M, V, q: `<p>In Kjeldahl’s method, ${w} g of compound gives ammonia that neutralises ${V} mL of ${M} M H₂SO₄. Find % N.</p>`, answer: +p.toFixed(4), tol: 0.01, unit: '%', sol: `<p>NH₃ = 2 × ${M} × ${V}/1000 mol; N = 14 × that; % N = ${r3(p)}.</p>` }; },
      verify: (p) => (2 * p.M * p.V / 1000 * 14) / p.w * 100 },
    { id: 'og-g03', type: 'nat', level: 2, exams: ['board'], sub: 'chroma',
      make(rng) { const f = choose(rng, [8, 9, 10, 12]), s = choose(rng, [2, 3, 4.5, 6]); const rf = s / f; return { f, s, q: `<p>A spot moves ${s} cm and the solvent front ${f} cm. Find Rf.</p>`, answer: +rf.toFixed(4), tol: 0.01, sol: `<p>Rf = ${s}/${f} = ${r3(rf)}.</p>` }; },
      verify: (p) => p.s * (1 / p.f) },
    { id: 'og-g04', type: 'nat', level: 3, exams: ['board'], sub: 'quant',
      make(rng) { const h = choose(rng, [['Cl', 35.5, 143.5], ['Br', 80, 188], ['I', 127, 235]]), w = choose(rng, [0.15, 0.20, 0.30]), y = choose(rng, [0.20, 0.30, 0.40]); const p = h[1] / h[2] * y / w * 100; return { h, w, y, q: `<p>In Carius’s method ${w} g of an organic compound containing ${h[0]} gives ${y} g of Ag${h[0]} (molar mass ${h[2]}). Find % ${h[0]} (${h[0]} = ${h[1]}).</p>`, answer: +p.toFixed(4), tol: 0.01, unit: '%', sol: `<p>${h[0]} = ${h[1]}/${h[2]} × ${y} g; % = ${r3(p)}.</p>` }; },
      verify: (p) => (p.y / p.h[2]) * p.h[1] / p.w * 100 },
  ],
};
