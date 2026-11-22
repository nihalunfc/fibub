// Class 10 Science, Chapter 2 Acids, Bases and Salts: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('ab');
const r2 = (x) => Math.round(x * 100) / 100;

export default {
  topic: 'acids-bases-and-salts', name: 'Acids, Bases and Salts', n: 2,
  items: [
    m.mcq(1, 'indicators', '<p>Blue litmus paper dipped in dilute hydrochloric acid turns:</p>', 'red', ['stays blue', 'green', 'colourless'], '<p>Acids turn blue litmus red.</p>'),
    m.mcq(1, 'indicators', '<p>Phenolphthalein is pink in:</p>', 'sodium hydroxide solution', ['dilute hydrochloric acid', 'vinegar', 'lemon juice'], '<p>Phenolphthalein is colourless in acids and pink in bases.</p>'),
    m.mcq(2, 'indicators', '<p>A solution turns red litmus blue and phenolphthalein pink. It is most likely:</p>', 'a base', ['an acid', 'neutral', 'a salt of a strong acid and strong base'], '<p>Both tests show a base.</p>'),
    m.mcq(2, 'reactions', '<p>When zinc granules are added to dilute sulphuric acid, the gas evolved:</p>', 'burns with a pop sound', ['turns lime water milky', 'has a smell of rotten eggs', 'is brown and poisonous'], '<p>The gas is hydrogen; a burning splinter makes it burn with a squeaky pop.</p>'),
    m.mcq(2, 'reactions', '<p>Sodium carbonate reacts with dilute HCl to give a gas that turns lime water milky. The gas is:</p>', 'carbon dioxide', ['hydrogen', 'oxygen', 'chlorine'], '<p>Metal carbonates and acids give a salt, water and CO₂. CO₂ turns lime water milky because CaCO₃ forms.</p>'),
    m.mcq(2, 'reactions', '<p>The general reaction of an acid with a base is called:</p>', 'neutralisation', ['decomposition', 'displacement', 'combustion'], '<p>Acid + base → salt + water is neutralisation.</p>'),
    m.mcq(2, 'ions', '<p>Dry HCl gas does not turn dry blue litmus red because:</p>', 'H⁺ ions are produced only in the presence of water', ['HCl is not an acid', 'litmus only works on liquids that are hot', 'the gas is too heavy'], '<p>HCl needs water to ionise into H⁺ (as H₃O⁺) and Cl⁻.</p>'),
    m.mcq(2, 'ions', '<p>Which of these is a weak acid?</p>', 'ethanoic acid', ['hydrochloric acid', 'sulphuric acid', 'nitric acid'], '<p>Ethanoic acid ionises only a little in water; HCl, H₂SO₄ and HNO₃ are strong.</p>'),
    m.mcq(1, 'ph', '<p>A solution with pH 3 is:</p>', 'acidic', ['basic', 'neutral', 'a salt'], '<p>pH below 7 is acidic.</p>'),
    m.mcq(2, 'ph', '<p>Compared with a solution of pH 5, a solution of pH 3 has hydrogen ions that are:</p>', '100 times more concentrated', ['2 times more concentrated', '100 times less concentrated', 'the same'], '<p>Two pH units is a factor of 10² = 100 in [H⁺].</p>', { trap: 'pH is a log scale: 2 units is 100 times, not 2 times.' }),
    m.mcq(2, 'ph', '<p>Diluting a strong acid with a large amount of water:</p>', 'raises its pH towards 7 but never above 7', ['lowers its pH below 0', 'makes it basic', 'does not change the pH'], '<p>Dilution reduces [H⁺] so the pH rises, but water is neutral so it approaches 7 and stays below it.</p>'),
    m.mcq(2, 'ph', '<p>Tooth decay starts when the pH of the mouth falls below:</p>', '5.5', ['7.0', '8.5', '1.0'], '<p>Below about pH 5.5 the acid attacks the calcium compound in tooth enamel.</p>'),
    m.mcq(1, 'salts', '<p>The salt formed when HCl neutralises NaOH is:</p>', 'sodium chloride', ['sodium oxide', 'sodium sulphate', 'sodium carbonate'], '<p>HCl + NaOH → NaCl + H₂O.</p>'),
    m.mcq(3, 'salts', '<p>An aqueous solution of ammonium chloride (a salt of HCl and NH₄OH) is:</p>', 'acidic, pH below 7', ['neutral, pH 7', 'basic, pH above 7', 'a conductor of heat only'], '<p>Strong acid + weak base gives an acidic salt solution.</p>'),
    m.mcq(2, 'salts', '<p>Baking soda is:</p>', 'sodium hydrogencarbonate, NaHCO₃', ['sodium carbonate, Na₂CO₃', 'sodium hydroxide, NaOH', 'calcium oxide'], '<p>NaHCO₃ is mildly basic and gives CO₂ on heating.</p>'),
    m.mcq(2, 'salts', '<p>Bleaching powder is made by passing chlorine over:</p>', 'dry slaked lime, Ca(OH)₂', ['quicklime, CaO', 'limestone, CaCO₃', 'brine'], '<p>Ca(OH)₂ + Cl₂ → CaOCl₂ + H₂O.</p>'),
    m.mcq(2, 'salts', '<p>Plaster of Paris is stored in a moisture-proof container because:</p>', 'it sets into hard gypsum on contact with water', ['it burns easily', 'it dissolves in air', 'it loses its colour'], '<p>CaSO₄·½H₂O + 1½H₂O → CaSO₄·2H₂O, which is hard.</p>'),
    m.mcq(3, 'salts', '<p>The by-products of the chlor-alkali process (besides NaOH) are:</p>', 'chlorine at the anode and hydrogen at the cathode', ['oxygen and hydrogen', 'chlorine and oxygen', 'sodium metal and chlorine'], '<p>2NaCl + 2H₂O → 2NaOH + Cl₂ + H₂.</p>'),
    m.ar(2, 'ions', 'HCl is a strong acid.', 'HCl ionises almost completely in water.', 0, '<p>Both true; R explains A: strong acids split almost fully into ions.</p>'),
    m.ar(2, 'ph', 'The pH of a neutral solution at room temperature is 7.', 'In pure water [H⁺] = [OH⁻].', 0, '<p>Equal H⁺ and OH⁻ (each 10⁻⁷ mol/L) means neutral, pH 7.</p>'),
    m.ar(3, 'salts', 'Washing soda crystals are dry powders with no water in them.', 'Washing soda is Na₂CO₃·10H₂O.', 3, '<p>A is false: the crystals contain 10 molecules of water of crystallisation per unit. R is true.</p>'),
    m.ar(3, 'reactions', 'Metal carbonates react with dilute acids to give out a gas.', 'The gas is carbon dioxide.', 0, '<p>Both true and R names the gas, completing the explanation: carbonate + acid → salt + water + CO₂.</p>'),
    m.nat(1, 'ph', '<p>What is the pH of a solution whose [H⁺] is 10⁻⁴ mol/L?</p>', () => 4, 0, '<p>pH = −log 10⁻⁴ = 4.</p>'),
    m.nat(2, 'ph', '<p>If a solution has pH 9, what is [OH⁻] in mol/L expressed as the power of ten (give the exponent, e.g. −5)? (Use [H⁺][OH⁻] = 10⁻¹⁴.)</p>', () => -5, 0, '<p>pOH = 14 − 9 = 5, so [OH⁻] = 10⁻⁵ mol/L: the exponent is −5.</p>'),
    m.nat(3, 'salts', '<p>How many grams of water of crystallisation are in 500 g of CuSO₄·5H₂O? (CuSO₄ = 160, H₂O = 18.)</p>', () => (500 * 90) / 250, 0.01, '<p>Water is 5 × 18 = 90 of 250: 500 × 90/250 = 180 g.</p>', { unit: 'g' }),
    m.nat(3, 'salts', '<p>20 mL of 0.5 mol/L NaOH is neutralised by HCl of concentration 0.25 mol/L. What volume of HCl is needed, in mL?</p>', () => (20 * 0.5) / 0.25, 0, '<p>Equal amounts: 0.5 × 20 = 0.25 × V, so V = 40 mL.</p>', { unit: 'mL' }),
    m.msq(2, 'ph', '<p>Which of these have a pH below 7? (Choose all that apply.)</p>', ['lemon juice', 'vinegar', 'baking soda solution', 'stomach acid'], [0, 1, 3], '<p>Lemon juice (about 2), vinegar (about 3), stomach acid (about 1.5). Baking soda solution is mildly basic (about 8.3).</p>'),
    m.msq(3, 'salts', '<p>Which of these are made from common salt (brine)? (Choose all that apply.)</p>', ['sodium hydroxide', 'chlorine', 'baking soda', 'plaster of Paris'], [0, 1, 2], '<p>NaOH and Cl₂ come from the chlor-alkali process and baking soda from the Solvay process. POP comes from gypsum.</p>'),
  ],
  gens: [
    { id: 'ab-g01', type: 'nat', level: 2, exams: ['board'], sub: 'ph',
      make(rng) { const e = pick(rng, 1, 6); return { e, q: `<p>The hydrogen ion concentration of a solution is 10<sup>−${e}</sup> mol/L. Find its pH.</p>`, answer: e, tol: 0, sol: `<p>pH = −log 10<sup>−${e}</sup> = ${e}.</p>` }; },
      verify: (p) => -Math.log10(Math.pow(10, -p.e)) },
    { id: 'ab-g02', type: 'nat', level: 3, exams: ['board'], sub: 'salts',
      make(rng) { const M = pick(rng, 50, 800, 50); return { M, q: `<p>How many grams of anhydrous CuSO₄ are left when ${M} g of CuSO₄·5H₂O is heated until all its water is lost? (CuSO₄ = 160, H₂O = 18.)</p>`, answer: r2((M * 160) / 250), tol: 0.01, unit: 'g', sol: `<p>CuSO₄ is 160 of 250 parts: ${M} × 160/250 = ${r2((M * 160) / 250)} g.</p>` }; },
      verify: (p) => r2(p.M - (p.M * 90) / 250) },
    { id: 'ab-g03', type: 'nat', level: 3, exams: ['board'], sub: 'salts',
      make(rng) { const V = pick(rng, 10, 50, 5), c1 = choose(rng, [0.1, 0.2, 0.5]), c2 = choose(rng, [0.1, 0.25, 0.4]); return { V, c1, c2, q: `<p>${V} mL of ${c1} mol/L HCl is neutralised by ${c2} mol/L NaOH. Find the volume of NaOH needed in mL.</p>`, answer: r2((V * c1) / c2), tol: 0.01, unit: 'mL', sol: `<p>c₁V₁ = c₂V₂ → V₂ = ${c1} × ${V} ÷ ${c2} = ${r2((V * c1) / c2)} mL.</p>` }; },
      verify: (p) => r2(((p.V / 1000) * p.c1 / p.c2) * 1000) },
    { id: 'ab-g04', type: 'nat', level: 2, exams: ['board'], sub: 'ph',
      make(rng) { const a = pick(rng, 1, 5), b = a + pick(rng, 1, 5); return { a, b, q: `<p>Solution P has pH ${a} and solution Q has pH ${b}. How many times more hydrogen ions per litre does P have than Q?</p>`, answer: Math.pow(10, b - a), tol: 0.01, sol: `<p>The difference is ${b - a} pH units, so the ratio is 10<sup>${b - a}</sup> = ${Math.pow(10, b - a)}.</p>` }; },
      verify: (p) => Math.pow(10, -p.a) / Math.pow(10, -p.b) },
  ],
};
