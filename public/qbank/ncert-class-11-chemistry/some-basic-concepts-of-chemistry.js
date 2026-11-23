// Class 11 Chemistry, Chapter 1 Some Basic Concepts of Chemistry: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('sb');
const r3 = (x) => +x.toPrecision(3);

export default {
  topic: 'some-basic-concepts-of-chemistry', name: 'Some Basic Concepts of Chemistry', n: 1,
  items: [
    m.mcq(1, 'matter', '<p>Which of these is a homogeneous mixture?</p>', 'air', ['muddy water', 'pure water', 'sulphur powder and iron filings'], '<p>Air is uniform throughout and its gases can be in any proportion. Muddy water and the powder mixture are heterogeneous; pure water is a compound.</p>'),
    m.mcq(1, 'matter', '<p>A substance that cannot be broken into simpler substances by chemical means is a(n):</p>', 'element', ['compound', 'mixture', 'solution'], '<p>That is the definition of an element.</p>'),
    m.mcq(2, 'units', '<p>The number of significant figures in 0.007040 is:</p>', '4', ['3', '6', '2'], '<p>Leading zeros do not count. 7, 0, 4 and the trailing 0 after the decimal point count: 4.</p>', { trap: 'Counting leading zeros.' }),
    m.mcq(2, 'units', '<p>12.11 + 18.0 + 1.012 is reported to the correct number of decimal places as:</p>', '31.1', ['31.122', '31.12', '31'], '<p>Addition keeps the decimal places of the least precise value (18.0, one decimal place): 31.122 rounds to 31.1.</p>'),
    m.mcq(1, 'units', '<p>Which prefix means 10⁻⁹?</p>', 'nano', ['micro', 'milli', 'pico'], '<p>nano = 10⁻⁹; micro = 10⁻⁶; milli = 10⁻³; pico = 10⁻¹².</p>'),
    m.mcq(2, 'laws', '<p>Two oxides of copper contain 79.9 % and 88.8 % copper. This illustrates the law of:</p>', 'multiple proportions', ['conservation of mass', 'constant proportions', 'gaseous volumes'], '<p>One element (copper) forms two different compounds with oxygen; the mass of Cu per gram of O is in a small whole-number ratio (4 : 8, from CuO and Cu₂O, that is 1 : 2).</p>'),
    m.mcq(2, 'laws', '<p>10 g of CaCO₃ on heating gives 5.6 g of CaO and 4.4 g of CO₂. This agrees with the law of:</p>', 'conservation of mass', ['constant proportions', 'multiple proportions', 'reciprocal proportions'], '<p>5.6 + 4.4 = 10 g: the mass before equals the mass after.</p>'),
    m.mcq(2, 'laws', '<p>Avogadro’s law states that equal volumes of all gases at the same temperature and pressure contain:</p>', 'the same number of molecules', ['the same mass', 'the same number of atoms', 'the same density'], '<p>The number of molecules, not atoms or mass, is equal.</p>'),
    m.mcq(2, 'atomic mass', '<p>Boron has isotopes ¹⁰B (20 %) and ¹¹B (80 %). Its average atomic mass is about:</p>', '10.8 u', ['10.5 u', '10.2 u', '11.0 u'], '<p>0.20 × 10 + 0.80 × 11 = 10.8 u.</p>'),
    m.mcq(1, 'mole', '<p>The number of particles in one mole is:</p>', '6.022 × 10²³', ['6.022 × 10²²', '6.022 × 10²⁴', '1.66 × 10⁻²⁴'], '<p>That is the Avogadro constant.</p>'),
    m.mcq(2, 'mole', '<p>The number of molecules in 4.4 g of CO₂ (44 g/mol) is:</p>', '6.022 × 10²²', ['6.022 × 10²³', '6.022 × 10²¹', '1.8 × 10²⁴'], '<p>n = 4.4/44 = 0.10 mol; N = 0.10 × 6.022 × 10²³ = 6.022 × 10²².</p>'),
    m.mcq(2, 'mole', '<p>How many atoms are in 0.5 mol of NH₃?</p>', '1.2 × 10²⁴', ['3.0 × 10²³', '6.0 × 10²³', '2.4 × 10²⁴'], '<p>0.5 mol × 6.022 × 10²³ = 3.01 × 10²³ molecules × 4 atoms = 1.2 × 10²⁴ atoms.</p>'),
    m.mcq(2, 'mole', '<p>At 273.15 K and 1 bar, the volume of 2 mol of any ideal gas is about:</p>', '45.4 L', ['22.7 L', '44.8 L at 1 atm only', '11.35 L'], '<p>2 × 22.7 = 45.4 L (at 1 atm and 273.15 K it would be 44.8 L, but the stated pressure here is 1 bar).</p>'),
    m.mcq(2, 'formula', '<p>A compound has the empirical formula CH and a molar mass of 78 g/mol. Its molecular formula is:</p>', 'C₆H₆', ['C₂H₂', 'C₃H₃', 'C₆H₁₂'], '<p>The empirical mass is 13; 78/13 = 6; so C₆H₆.</p>'),
    m.mcq(3, 'formula', '<p>A compound has 52.2 % C, 13.0 % H and 34.8 % O. Its empirical formula is:</p>', 'C₂H₆O', ['CH₃O', 'C₂H₄O', 'C₃H₈O'], '<p>Moles in 100 g: C 4.35, H 13.0, O 2.175. Divide by 2.175: C 2, H 6, O 1.</p>'),
    m.mcq(1, 'stoichiometry', '<p>In a balanced equation the coefficients tell us the:</p>', 'mole ratio of reactants and products', ['mass ratio only', 'number of atoms in each molecule', 'speed of reaction'], '<p>Coefficients give the mole (and for gases, volume) ratio.</p>'),
    m.mcq(2, 'stoichiometry', '<p>For 2Mg + O₂ → 2MgO, how many moles of O₂ react with 0.6 mol of Mg?</p>', '0.3 mol', ['0.6 mol', '1.2 mol', '0.15 mol'], '<p>The ratio is 2 Mg : 1 O₂, so 0.6/2 = 0.3 mol.</p>'),
    m.mcq(3, 'limiting', '<p>2 mol of Al react with 3 mol of Cl₂: 2Al + 3Cl₂ → 2AlCl₃. The limiting reagent is:</p>', 'neither; they are in the exact ratio', ['Al', 'Cl₂', 'AlCl₃'], '<p>2/2 = 1 and 3/3 = 1. Both run out together.</p>'),
    m.mcq(3, 'limiting', '<p>3.0 mol of N₂ and 6.0 mol of H₂ react: N₂ + 3H₂ → 2NH₃. The maximum moles of NH₃ formed is:</p>', '4.0', ['6.0', '2.0', '9.0'], '<p>N₂: 3.0/1 = 3.0; H₂: 6.0/3 = 2.0. H₂ is limiting, giving 6.0 × 2/3 = 4.0 mol NH₃.</p>'),
    m.mcq(2, 'concentration', '<p>The molarity of a solution of 5.85 g of NaCl (58.5 g/mol) in 250 mL of solution is:</p>', '0.4 M', ['0.1 M', '0.04 M', '4 M'], '<p>n = 0.10 mol; V = 0.25 L; M = 0.40 mol/L.</p>'),
    m.mcq(2, 'concentration', '<p>A solution has 2 mol of A and 8 mol of B. The mole fraction of A is:</p>', '0.2', ['0.25', '0.8', '0.4'], '<p>2/(2 + 8) = 0.2.</p>', { trap: 'Dividing by moles of B alone (0.25).' }),
    m.ar(2, 'concentration', 'Molarity of a solution changes with temperature.', 'Molarity involves the volume of solution, which changes with temperature.', 0, '<p>Both true and R explains A.</p>'),
    m.ar(2, 'mole', 'One mole of H₂ and one mole of He have the same mass.', 'One mole of any substance contains 6.022 × 10²³ particles.', 3, '<p>A is false: 2 g against 4 g. R is true, but equal numbers of particles do not mean equal mass.</p>'),
    m.ar(3, 'limiting', 'The limiting reagent determines the amount of product formed.', 'The limiting reagent is completely used up in the reaction.', 0, '<p>Both true and R explains A: once it is gone, the reaction stops.</p>'),
    m.nat(2, 'mole', '<p>Find the mass in grams of 0.25 mol of calcium carbonate, CaCO₃ (100 g/mol).</p>', () => 25, 0.01, '<p>m = nM = 0.25 × 100 = 25 g.</p>', { unit: 'g' }),
    m.nat(2, 'concentration', '<p>How many mL of 12 M HCl are needed to make 600 mL of 0.5 M HCl?</p>', () => 0.5 * 600 / 12, 0.01, '<p>M₁V₁ = M₂V₂: V₁ = 0.5 × 600/12 = 25 mL.</p>', { unit: 'mL' }),
    m.nat(3, 'stoichiometry', '<p>How many grams of CO₂ form when 20 g of CaCO₃ (100 g/mol) is heated completely (CaCO₃ → CaO + CO₂, CO₂ = 44 g/mol)?</p>', () => 20 / 100 * 44, 0.01, '<p>n = 0.20 mol CaCO₃ gives 0.20 mol CO₂ = 8.8 g.</p>', { unit: 'g' }),
    m.nat(3, 'formula', '<p>A hydrocarbon has 80 % carbon by mass. What is the number of hydrogen atoms in its empirical formula if there is 1 carbon atom? (C = 12, H = 1)</p>', () => (20 / 1) / (80 / 12), 0.01, '<p>Moles per 100 g: C = 6.67, H = 20. H : C = 3 : 1. Empirical formula CH₃, so 3 H atoms.</p>', { unit: 'atoms' }),
    m.msq(3, 'mole', '<p>Which samples contain 6.022 × 10²² molecules? (Choose all that apply.)</p>', ['1.8 g of H₂O (18 g/mol)', '0.2 g of H₂ (2 g/mol)', '4.4 g of CO₂ (44 g/mol)', '3.2 g of O₂ (32 g/mol)'], [0, 1, 2, 3], '<p>All of these equal 0.10 mol: 1.8/18, 0.2/2, 4.4/44 and 3.2/32.</p>'),
    m.msq(2, 'laws', '<p>Which statements about the laws of chemical combination are correct?</p>', ['Conservation of mass: total mass is unchanged in a reaction.', 'Constant proportions: a compound has the same mass ratio from any source.', 'Gas volumes in reactions are in small whole-number ratios.', 'The law of multiple proportions applies to a single compound.'], [0, 1, 2], '<p>Multiple proportions compares two or more compounds of the same elements, so the last statement is wrong.</p>'),
  ],
  gens: [
    { id: 'sb-g01', type: 'nat', level: 2, exams: ['board'], sub: 'mole',
      make(rng) { const s = choose(rng, [['H₂O', 18, 3], ['CO₂', 44, 3], ['NH₃', 17, 4], ['CH₄', 16, 5]]), g = choose(rng, [4.4, 8.8, 17, 36, 88]); const N = g / s[1] * 6.022 * s[2]; return { s, g, q: `<p>How many atoms are in ${g} g of ${s[0]} (molar mass ${s[1]} g/mol)? Give your answer in units of 10²³ atoms.</p>`, answer: r3(N), tol: Math.max(0.01, N * 0.01), unit: '× 10²³', sol: `<p>n = ${g}/${s[1]} = ${r3(g / s[1])} mol; atoms = ${r3(g / s[1])} × 6.022 × 10²³ × ${s[2]} = ${r3(N)} × 10²³.</p>` }; },
      verify: (p) => p.g / p.s[1] * p.s[2] * 6.022 },
    { id: 'sb-g02', type: 'nat', level: 3, exams: ['board'], sub: 'limiting',
      make(rng) { const a = choose(rng, [2, 4, 6, 8]), b = choose(rng, [16, 32, 64, 96]); const mol = Math.min(a / 2, b / 16); return { a, b, q: `<p>${a} g of H₂ (2 g/mol) reacts with ${b} g of O₂ (32 g/mol): 2H₂ + O₂ → 2H₂O. Find the mass of water formed in grams (H₂O = 18 g/mol).</p>`, answer: r3(mol * 18), tol: Math.max(0.05, mol * 18 * 0.01), unit: 'g', sol: `<p>n(H₂) = ${a / 2} mol gives ${a / 2} mol of water; n(O₂) = ${b / 32} mol gives ${b / 16} mol. The smaller, ${r3(mol)} mol, forms: ${r3(mol * 18)} g.</p>` }; },
      verify: (p) => Math.min(9 * p.a, 1.125 * p.b) },
    { id: 'sb-g03', type: 'nat', level: 2, exams: ['board'], sub: 'concentration',
      make(rng) { const w = pick(rng, 2, 20, 2), M = choose(rng, [40, 58.5, 98, 106]), V = choose(rng, [250, 500, 1000]); const c = (w / M) / (V / 1000); return { w, M, V, q: `<p>${w} g of a solute (molar mass ${M} g/mol) is dissolved in water to make ${V} mL of solution. Find the molarity in mol/L.</p>`, answer: r3(c), tol: Math.max(0.002, c * 0.01), unit: 'mol/L', sol: `<p>n = ${w}/${M} = ${r3(w / M)} mol; M = ${r3(w / M)}/${V / 1000} = ${r3(c)} mol/L.</p>` }; },
      verify: (p) => 1000 * p.w / (p.M * p.V) },
  ],
};
