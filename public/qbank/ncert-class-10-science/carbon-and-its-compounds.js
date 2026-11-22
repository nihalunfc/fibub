// Class 10 Science, Chapter 4 Carbon and its Compounds: practice questions for the NCERT study course (original fibub questions).
import { maker } from './_make.js';
import { pick, choose } from '../_util.js';
const m = maker('cc');
const r2 = (x) => Math.round(x * 100) / 100;
const NM = ['meth', 'eth', 'prop', 'but', 'pent', 'hex', 'hept', 'oct', 'non', 'dec'];

export default {
  topic: 'carbon-and-its-compounds', name: 'Carbon and its Compounds', n: 4,
  items: [
    m.mcq(1, 'bonding', '<p>Carbon forms covalent compounds mainly because:</p>', 'it is difficult to gain or lose four electrons, so it shares them', ['it easily loses four electrons', 'it easily gains four electrons', 'it has only one outer electron'], '<p>Carbon has 4 outer electrons. Gaining or losing 4 needs too much energy, so it shares electrons.</p>'),
    m.mcq(1, 'bonding', '<p>The number of shared pairs of electrons in a molecule of nitrogen, N₂, is:</p>', '3', ['1', '2', '4'], '<p>Each N has 5 outer electrons and needs 3 more: a triple bond, three shared pairs.</p>'),
    m.mcq(2, 'bonding', '<p>Which property is typical of covalent compounds?</p>', 'low melting and boiling points and poor conduction of electricity', ['high melting points and good conduction when solid', 'always soluble in water', 'always hard crystals'], '<p>The forces between covalent molecules are weak, so they melt and boil easily, and they have no free ions.</p>'),
    m.mcq(2, 'bonding', '<p>How many covalent bonds does a molecule of ethene, C₂H₄, have in total?</p>', '5 (one C=C counted as one double bond plus four C–H)', ['6', '4', '3'], '<p>Four C–H single bonds and one C=C double bond: five bonds (six shared pairs).</p>', { trap: 'A double bond is one bond containing two shared pairs.' }),
    m.mcq(1, 'versatility', '<p>The ability of carbon to form long chains by bonding with itself is called:</p>', 'catenation', ['isomerism', 'allotropy', 'polymerisation'], '<p>Catenation: self-linking of atoms into chains and rings. Carbon is exceptional because its C–C bond is strong.</p>'),
    m.mcq(2, 'versatility', '<p>Butane (C₄H₁₀) and isobutane have the same formula but different structures. They are:</p>', 'structural isomers', ['allotropes', 'members of different homologous series', 'the same compound'], '<p>Same molecular formula, different arrangement of atoms: isomers.</p>'),
    m.mcq(2, 'versatility', '<p>Which is a saturated hydrocarbon?</p>', 'C₃H₈', ['C₃H₆', 'C₂H₄', 'C₂H₂'], '<p>C₃H₈ fits CₙH₂ₙ₊₂ (alkane): only single bonds.</p>'),
    m.mcq(2, 'homologous', '<p>Successive members of a homologous series differ by:</p>', 'a CH₂ unit', ['one carbon atom only', 'two hydrogens only', 'a –OH group'], '<p>Each member differs from the next by CH₂ (14 u).</p>'),
    m.mcq(2, 'homologous', '<p>The general formula of the alkynes is:</p>', 'CₙH₂ₙ₋₂', ['CₙH₂ₙ₊₂', 'CₙH₂ₙ', 'CₙHₙ'], '<p>Alkane CₙH₂ₙ₊₂, alkene CₙH₂ₙ, alkyne CₙH₂ₙ₋₂.</p>'),
    m.mcq(2, 'naming', '<p>The IUPAC name of CH₃CH₂CH₂OH is:</p>', 'propan-1-ol (propanol)', ['propanal', 'propanone', 'propanoic acid'], '<p>Three carbons (prop-), alkane with –OH: drop the e and add -ol.</p>'),
    m.mcq(2, 'naming', '<p>The functional group –COOH is called:</p>', 'carboxylic acid', ['aldehyde', 'ketone', 'alcohol'], '<p>–COOH is the carboxyl group, the carboxylic acid group.</p>'),
    m.mcq(3, 'naming', '<p>Which compound is a ketone?</p>', 'CH₃COCH₃', ['CH₃CHO', 'CH₃COOH', 'CH₃CH₂OH'], '<p>Propanone (acetone) has C=O inside the chain; CH₃CHO is an aldehyde.</p>'),
    m.mcq(2, 'reactions', '<p>Ethene reacts with hydrogen in the presence of nickel to give ethane. This is:</p>', 'an addition reaction', ['a substitution reaction', 'a combustion reaction', 'an oxidation reaction'], '<p>H₂ adds across the double bond. Unsaturated hydrocarbons undergo addition (used to turn oils into fats).</p>'),
    m.mcq(2, 'reactions', '<p>Methane reacts with chlorine in sunlight to form CH₃Cl and HCl. This is:</p>', 'a substitution reaction', ['an addition reaction', 'a combustion reaction', 'a reduction reaction'], '<p>A Cl atom replaces an H atom.</p>'),
    m.mcq(2, 'reactions', '<p>A saturated hydrocarbon burns with a clean blue flame because:</p>', 'it has a low proportion of carbon, so combustion is complete', ['it has a high proportion of carbon', 'it contains oxygen already', 'it cannot burn in air'], '<p>Saturated hydrocarbons burn completely. Unsaturated ones give a sooty yellow flame because of unburnt carbon.</p>'),
    m.mcq(2, 'reactions', '<p>Alkaline KMnO₄ or acidified K₂Cr₂O₇ converts ethanol into:</p>', 'ethanoic acid', ['ethene', 'ethane', 'ethyl ethanoate'], '<p>These are oxidising agents that add oxygen.</p>'),
    m.mcq(2, 'ethanol', '<p>Ethanol reacts with sodium to give:</p>', 'sodium ethoxide and hydrogen', ['sodium hydroxide and ethane', 'sodium carbonate and CO₂', 'no reaction'], '<p>2CH₃CH₂OH + 2Na → 2CH₃CH₂ONa + H₂.</p>'),
    m.mcq(2, 'ethanol', '<p>Heating ethanol with excess concentrated sulphuric acid at 443 K gives:</p>', 'ethene', ['ethanoic acid', 'ethyl ethanoate', 'methane'], '<p>Dehydration: CH₃CH₂OH → CH₂=CH₂ + H₂O.</p>'),
    m.mcq(2, 'ethanol', '<p>Methylated spirit (denatured alcohol) is ethanol with a poison and a dye added. Why?</p>', 'to make it unfit to drink', ['to make it burn faster', 'to make it cheaper to make', 'to make it a better solvent'], '<p>Industrial alcohol is made undrinkable so it is not misused; drinking it can cause blindness or death.</p>'),
    m.mcq(2, 'ethanoic', '<p>Pure ethanoic acid freezes in cold weather to form glassy crystals. It is called:</p>', 'glacial acetic acid', ['vinegar', 'methylated spirit', 'ester'], '<p>Glacial because it freezes at 16.6 °C.</p>'),
    m.mcq(3, 'ethanoic', '<p>The product of ethanoic acid and ethanol, in the presence of conc. H₂SO₄, has:</p>', 'a sweet fruity smell', ['a pungent vinegar smell', 'no smell', 'a rotten egg smell'], '<p>Esters are sweet smelling: CH₃COOC₂H₅ (ethyl ethanoate).</p>'),
    m.mcq(2, 'soap', '<p>In a soap molecule the hydrophobic end is the:</p>', 'long hydrocarbon tail', ['ionic head', 'sodium ion', 'water of crystallisation'], '<p>The tail avoids water and dissolves in grease; the ionic head is hydrophilic.</p>'),
    m.mcq(2, 'soap', '<p>Soap does not lather well in hard water because:</p>', 'calcium and magnesium ions form insoluble scum with it', ['hard water is acidic', 'hard water has no ions', 'soap decomposes in hard water'], '<p>Ca²⁺ and Mg²⁺ combine with soap to give an insoluble scum, so the soap is wasted.</p>'),
    m.ar(2, 'versatility', 'Carbon compounds are very numerous.', 'Carbon atoms can form long chains, branches and rings with strong C–C bonds.', 0, '<p>Both true; the second explains the first (catenation and tetravalency).</p>'),
    m.ar(3, 'reactions', 'Unsaturated hydrocarbons burn with a sooty flame.', 'They contain a higher percentage of carbon, so the carbon is not burnt completely.', 0, '<p>Both true and R explains A.</p>'),
    m.ar(3, 'soap', 'A detergent works well in hard water.', 'Detergents form insoluble precipitates with calcium ions.', 2, '<p>A is true; R is false. Detergents form soluble salts with Ca²⁺, so no scum forms.</p>'),
    m.nat(1, 'homologous', '<p>How many hydrogen atoms are in a molecule of the alkane with 6 carbon atoms?</p>', () => 14, 0, '<p>C₆H₁₄: 2n + 2 = 14.</p>'),
    m.nat(2, 'homologous', '<p>What is the molecular mass of butane, C₄H₁₀? (C = 12, H = 1.)</p>', () => 58, 0, '<p>4 × 12 + 10 = 58 u.</p>', { unit: 'u' }),
    m.nat(3, 'reactions', '<p>How many grams of CO₂ form on burning 29 g of butane, C₄H₁₀, completely? (2C₄H₁₀ + 13O₂ → 8CO₂ + 10H₂O.)</p>', () => (29 / 58) * 4 * 44, 0.01, '<p>29 g = 0.5 mol butane → 2 mol CO₂ = 88 g.</p>', { unit: 'g' }),
    m.nat(3, 'ethanoic', '<p>How many litres of CO₂ at STP (22.4 L/mol) are given by 6 g of ethanoic acid (60 g/mol) with excess sodium hydrogencarbonate?</p>', () => (6 / 60) * 22.4, 0.01, '<p>0.1 mol acid gives 0.1 mol CO₂ = 2.24 L.</p>', { unit: 'L' }),
    m.msq(2, 'reactions', '<p>Which of these are addition reactions? (Choose all that apply.)</p>', ['ethene + H₂ → ethane', 'ethene + Br₂ → dibromoethane', 'methane + Cl₂ → chloromethane + HCl', 'ethanol → ethanoic acid'], [0, 1], '<p>Addition: a double bond opens. The third is substitution, the last is oxidation.</p>'),
    m.msq(2, 'soap', '<p>Which statements about soaps are true? (Choose all that apply.)</p>', ['They are sodium or potassium salts of long-chain carboxylic acids', 'They make micelles in water', 'They form scum in hard water', 'They work equally well in hard and soft water'], [0, 1, 2], '<p>The last is false: hard water ruins soap\'s action.</p>'),
  ],
  gens: [
    { id: 'cc-g01', type: 'nat', level: 2, exams: ['board'], sub: 'homologous',
      make(rng) { const c = pick(rng, 3, 15); return { c, q: `<p>How many hydrogen atoms are there in an alkane molecule with ${c} carbon atoms?</p>`, answer: 2 * c + 2, tol: 0, sol: `<p>CₙH₂ₙ₊₂ with n = ${c}: H = ${2 * c + 2}.</p>` }; },
      verify: (p) => 4 * p.c - 2 * (p.c - 1) },
    { id: 'cc-g02', type: 'nat', level: 3, exams: ['board'], sub: 'reactions',
      make(rng) { const c = pick(rng, 1, 6), M = pick(rng, 10, 100, 10), mm = 14 * c + 2; return { c, M, q: `<p>${M} g of ${NM[c - 1]}ane (C<sub>${c}</sub>H<sub>${2 * c + 2}</sub>) burns completely. Find the mass of CO₂ formed, in grams. (C = 12, H = 1, O = 16.)</p>`, answer: r2((M / mm) * c * 44), tol: 0.01, unit: 'g', sol: `<p>Moles of alkane = ${M}/${mm}; each gives ${c} CO₂ of 44 g: ${r2((M / mm) * c * 44)} g.</p>` }; },
      verify: (p) => r2(((p.M * 12 * p.c) / (14 * p.c + 2)) * 44 / 12) },
    { id: 'cc-g03', type: 'nat', level: 3, exams: ['board'], sub: 'ethanoic',
      make(rng) { const g = pick(rng, 6, 90, 6); return { g, q: `<p>How many grams of NaHCO₃ (84 g/mol) react completely with ${g} g of ethanoic acid (60 g/mol)? CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂.</p>`, answer: r2((g / 60) * 84), tol: 0.01, unit: 'g', sol: `<p>${g}/60 mol of acid needs the same moles of NaHCO₃: ${r2((g / 60) * 84)} g.</p>` }; },
      verify: (p) => r2(p.g * 1.4) },
    { id: 'cc-g04', type: 'nat', level: 2, exams: ['board'], sub: 'bonding',
      make(rng) { const c = pick(rng, 2, 14); return { c, q: `<p>How many covalent bonds (C–C plus C–H) are in one molecule of the alkane with ${c} carbon atoms?</p>`, answer: 3 * c + 1, tol: 0, sol: `<p>C–C: ${c - 1}; C–H: ${2 * c + 2}; total ${3 * c + 1}.</p>` }; },
      verify: (p) => (4 * p.c + 2 * p.c + 2) / 2 },
  ],
};
