// Plus Two entrance chemistry bank: Biomolecules (Class 12). Original fibub questions.
// Data used: [alpha] of alpha-D-glucose +112, beta-D-glucose +19, equilibrium +52.5, D-fructose -92 (degrees); sucrose +66.5; invert sugar about -20.
// pKa values (alpha-COOH, alpha-NH3+): glycine 2.34, 9.60; alanine 2.34, 9.69. Residue masses: Gly 75, Ala 89, Ser 105, Val 117, Phe 165 (as free amino acids); water 18.
// DNA: 10 base pairs per turn, 0.34 nm per base pair, A=T two H-bonds, G-C three H-bonds.

import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

let _n = 0, _c = 0;
const nid = () => `bi-${String(++_c).padStart(3, '0')}`;
const EXB = { 1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 3: ['jee-main', 'neet', 'comedk'], 4: ['jee-main', 'jee-adv', 'neet'], 5: ['jee-adv'] };
const EX = (l, t = 'mcq') => (t === 'mcq' && l <= 3 ? [...EXB[l], 'cuet'] : EXB[l]);
const A4 = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const S4 = ['Both Statement I and Statement II are correct', 'Statement I is correct but Statement II is incorrect', 'Statement I is incorrect but Statement II is correct', 'Both Statement I and Statement II are incorrect'];
const mk = (level, sub, q, right, wrongs, sol, trap) => {
  const pos = (_n++) % 4; const options = [...wrongs]; options.splice(pos, 0, right);
  return { id: nid(), type: 'mcq', level, format: 'single', exams: EX(level), sub, q, options, answer: pos, sol, ...(trap ? { trap } : {}) };
};
const nat = (level, sub, q, answer, tol, unit, sol, trap, calc) => ({ id: nid(), type: 'nat', level, format: tol === 0 ? 'integer' : 'numeric', exams: EX(level, 'nat'), sub, q, answer, tol, ...(unit ? { unit } : {}), sol, ...(trap ? { trap } : {}), ...(calc ? { calc } : {}) });
const msq = (level, sub, q, options, answer, sol, trap) => ({ id: nid(), type: 'msq', level, format: 'multi', exams: level >= 4 ? ['jee-adv'] : ['jee-adv', 'jee-main'], sub, q, options, answer, sol, ...(trap ? { trap } : {}) });
const asr = (level, sub, A, R, answer, sol, trap) => ({ id: nid(), type: 'mcq', level, format: 'assertion', exams: EX(level), sub, q: `<p><b>Assertion (A):</b> ${A}</p><p><b>Reason (R):</b> ${R}</p>`, options: A4, answer, sol, ...(trap ? { trap } : {}) });
const stm = (level, sub, s1, s2, answer, sol, trap) => ({ id: nid(), type: 'mcq', level, format: 'statements', exams: EX(level), sub, q: `<p><b>Statement I:</b> ${s1}</p><p><b>Statement II:</b> ${s2}</p>`, options: S4, answer, sol, ...(trap ? { trap } : {}) });
const cnt = (level, sub, q, options, answer, sol, trap) => ({ id: nid(), type: 'mcq', level, format: 'statements', exams: EX(level), sub, q, options, answer, sol, ...(trap ? { trap } : {}) });
const mat = (level, sub, group, q, right, wrongs, sol, trap) => ({ ...mk(level, sub, q, right, wrongs, sol, trap), format: 'match', group });
const P = (level, sub, group, q, right, wrongs, sol, trap) => ({ ...mk(level, sub, q, right, wrongs, sol, trap), format: 'passage', group });
const PN = (level, sub, group, q, answer, tol, unit, sol, trap, calc) => ({ ...nat(level, sub, q, answer, tol, unit, sol, trap, calc), format: 'passage', group });
/** rows: [q, right, [3 wrongs], sol, trap?] */
const T = (level, sub, rows) => rows.map(([q, r, w, s, t]) => mk(level, sub, q, r, w, s, t));
const gx = (id, level, type, sub, make, verify) => ({ id, type, level, exams: EX(level, type), sub, make, ...(verify ? { verify } : {}) });
const GRP = {
  m1: { title: 'Match the sugar with its description', list1: ['A. Sucrose', 'B. Maltose', 'C. Lactose', 'D. Cellulose'], list2: ['p. Two glucose units joined C1&ndash;C4 (&alpha;), reducing', 'q. Glucose and fructose joined through both anomeric carbons, non-reducing', 'r. Galactose and glucose, reducing, found in milk', 's. Long chain of &beta;-D-glucose, in cell walls'] },
  m2: { title: 'Match the vitamin with the disease caused by its deficiency', list1: ['A. Vitamin B<sub>1</sub>', 'B. Vitamin C', 'C. Vitamin D', 'D. Vitamin K'], list2: ['p. Rickets', 'q. Slow blood clotting', 'r. Beriberi', 's. Scurvy'] },
  m3: { title: 'Match the glucose reaction with its product', list1: ['A. Br<sub>2</sub> water', 'B. Concentrated HNO<sub>3</sub>', 'C. HI, heated', 'D. Phenylhydrazine (excess)'], list2: ['p. n-Hexane', 'q. Glucosazone', 'r. Gluconic acid', 's. Saccharic acid'] },
  m4: { title: 'Match the test with the observation', list1: ['A. Ninhydrin with an amino acid', 'B. Iodine with starch', 'C. Fehling with glucose', 'D. Biuret with a tripeptide'], list2: ['p. Blue-black colour', 'q. Violet colour', 'r. Red-brown precipitate of Cu<sub>2</sub>O', 's. Blue-purple colour'] },
  m5: { title: 'Match the nucleic acid unit with its class', list1: ['A. Adenine', 'B. Thymine', 'C. Uracil', 'D. Ribose'], list2: ['p. Pyrimidine found only in DNA', 'q. Purine found in both DNA and RNA', 'r. Pentose sugar of RNA', 's. Pyrimidine found only in RNA'] },
  p1: { title: 'The disaccharide X', passage: '<p>A disaccharide X has the formula C<sub>12</sub>H<sub>22</sub>O<sub>11</sub>. On acid hydrolysis it gives only D-glucose. It reduces Tollens\' reagent, and a fresh solution shows a change in optical rotation on standing.</p>' },
  p2: { title: 'A tripeptide', passage: '<p>A tripeptide on complete hydrolysis gives glycine (75), alanine (89) and phenylalanine (165), where the numbers are the molar masses of the free amino acids. Reaction of the tripeptide with Sanger\'s reagent followed by hydrolysis shows that glycine is the N-terminal residue. Carboxypeptidase releases phenylalanine first.</p>' },
  p3: { title: 'An amino acid in solution', passage: '<p>An amino acid H<sub>2</sub>N&ndash;CHR&ndash;COOH has pK<sub>a1</sub> = 2.2 (for the &ndash;COOH group) and pK<sub>a2</sub> = 9.4 (for the &ndash;NH<sub>3</sub><sup>+</sup> group). The side chain R is neutral.</p>' },
};

const H1 = [
  ...T(1, 'carbohydrates', [
    [`Carbohydrates are best described as`, `polyhydroxy aldehydes or ketones, or compounds that give them on hydrolysis`, [`polyamides of amino acids`, `esters of glycerol and fatty acids`, `polymers of nucleotides`], `<p>Glucose is a polyhydroxy aldehyde, fructose a polyhydroxy ketone, and sucrose gives both on hydrolysis.</p>`],
    [`Glucose is classified as`, `an aldohexose`, [`a ketohexose`, `an aldopentose`, `a disaccharide`], `<p>It has six carbons and an aldehyde group (CHO), so it is an aldohexose. Fructose is the ketohexose.</p>`],
    [`The molecular formula of glucose is`, `C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>`, [`C<sub>6</sub>H<sub>10</sub>O<sub>5</sub>`, `C<sub>12</sub>H<sub>22</sub>O<sub>11</sub>`, `C<sub>5</sub>H<sub>10</sub>O<sub>5</sub>`], `<p>Glucose and fructose are isomers with the formula C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>. Starch has the repeat unit C<sub>6</sub>H<sub>10</sub>O<sub>5</sub> and sucrose is C<sub>12</sub>H<sub>22</sub>O<sub>11</sub>.</p>`],
    [`Hydrolysis of sucrose gives`, `glucose and fructose`, [`glucose and galactose`, `two molecules of glucose`, `fructose and galactose`], `<p>Sucrose is a disaccharide of &alpha;-D-glucose and &beta;-D-fructose. Maltose gives two glucose, and lactose gives galactose and glucose.</p>`],
    [`The monomer unit of starch and of cellulose is`, `glucose`, [`fructose`, `galactose`, `ribose`], `<p>Both are polymers of glucose. They differ in the type of link: &alpha; in starch, &beta; in cellulose.</p>`],
    [`Milk sugar is`, `lactose`, [`maltose`, `sucrose`, `fructose`], `<p>Lactose is the sugar of milk. Maltose is malt sugar and sucrose is cane sugar.</p>`],
    [`Which of these is a polysaccharide?`, `Glycogen`, [`Sucrose`, `Maltose`, `Fructose`], `<p>Glycogen has thousands of glucose units. Sucrose and maltose are disaccharides, and fructose is a monosaccharide.</p>`],
  ]),
  ...T(1, 'proteins', [
    [`The linkage that joins two amino acids in a protein is`, `the peptide (amide) bond, &ndash;CO&ndash;NH&ndash;`, [`a glycosidic bond`, `a phosphodiester bond`, `an ester bond`], `<p>The &ndash;COOH of one amino acid joins the &ndash;NH<sub>2</sub> of the next with loss of water.</p>`],
    [`The number of amino acids that commonly occur in proteins is`, `20`, [`10`, `64`, `4`], `<p>Twenty &alpha;-amino acids are used to make proteins in living cells.</p>`],
    [`The dipolar ion form of an amino acid, H<sub>3</sub>N<sup>+</sup>&ndash;CHR&ndash;COO<sup>&minus;</sup>, is called a`, `zwitterion`, [`carbocation`, `free radical`, `carbanion only`], `<p>It carries both a positive and a negative charge with a net charge of zero.</p>`],
    [`Which of these is a fibrous protein?`, `Keratin`, [`Insulin`, `Albumin`, `Haemoglobin`], `<p>Keratin (hair, nails) is fibrous and insoluble in water. Insulin, albumin and haemoglobin are globular and soluble.</p>`],
    [`The only amino acid among these that is not optically active is`, `glycine`, [`alanine`, `serine`, `valine`], `<p>Glycine has R = H, so its &alpha;-carbon has two identical groups and is not a chiral centre.</p>`],
  ]),
  ...T(1, 'enzymes, vitamins, nucleic acids', [
    [`Enzymes are chemically`, `mostly globular proteins that act as biological catalysts`, [`all lipids`, `all carbohydrates`, `all nucleic acids`], `<p>They speed up biochemical reactions at body temperature and are very specific.</p>`],
    [`The deficiency of vitamin C causes`, `scurvy`, [`rickets`, `beriberi`, `night blindness`], `<p>Ascorbic acid is needed for collagen. Without it the gums bleed and wounds heal slowly.</p>`],
    [`Rickets in children is caused by lack of vitamin`, `D`, [`A`, `C`, `E`], `<p>Vitamin D helps the body absorb calcium. Lack of it softens and bends the bones.</p>`],
    [`Which set contains only fat-soluble vitamins?`, `A, D, E, K`, [`B, C, D, K`, `A, B, C, D`, `B<sub>1</sub>, B<sub>2</sub>, C, E`], `<p>A, D, E and K dissolve in fat and are stored in the body. B-complex and C are water soluble.</p>`],
    [`The sugar present in DNA is`, `2-deoxyribose`, [`ribose`, `glucose`, `fructose`], `<p>RNA has ribose, with an OH at C-2. DNA has deoxyribose, which lacks that OH.</p>`],
    [`The base present in RNA but not in DNA is`, `uracil`, [`thymine`, `adenine`, `cytosine`], `<p>DNA has A, G, C, T. RNA has A, G, C, U.</p>`],
    [`The hormone insulin is made in the`, `pancreas`, [`thyroid gland`, `liver`, `adrenal gland`], `<p>The &beta;-cells of the islets of Langerhans make insulin, which lowers the blood glucose level.</p>`],
  ]),
];

const H2 = [
  ...T(2, 'glucose structure', [
    [`Which fact cannot be explained by the open chain structure of glucose alone?`, `Glucose does not give the Schiff test or the NaHSO<sub>3</sub> addition product`, [`Glucose is oxidised by Tollens' reagent`, `Glucose forms an oxime with NH<sub>2</sub>OH`, `Glucose is reduced by HI to n-hexane`], `<p>An aldehyde should give Schiff's and bisulphite tests, but glucose does not, because in the ring form the &ndash;CHO is tied up in a hemiacetal. Also the existence of &alpha; and &beta; forms (mutarotation) needs the ring.</p>`],
    [`Heating glucose with HI and red phosphorus gives n-hexane. This shows that`, `all six carbon atoms are in a straight, unbranched chain`, [`glucose has a ring`, `glucose has an ester link`, `glucose contains a ketone`], `<p>Complete reduction to a straight-chain alkane proves the carbon skeleton is unbranched.</p>`],
    [`Glucose reacts with acetic anhydride to give a pentaacetate. This shows that glucose has`, `five hydroxyl groups`, [`five aldehyde groups`, `five carboxyl groups`, `one hydroxyl group`], `<p>Each &ndash;OH is acetylated, and five acetyl groups are added.</p>`],
    [`Glucose gives gluconic acid with bromine water. This shows that glucose contains`, `an aldehyde group (oxidised to &ndash;COOH) as the carbonyl`, [`a ketone group`, `a carboxylic acid`, `an amino group`], `<p>Br<sub>2</sub> water oxidises only the aldehyde end to the acid. A ketone would not be oxidised so.</p>`],
    [`Oxidation of glucose by hot concentrated HNO<sub>3</sub> gives`, `saccharic acid (a dicarboxylic acid)`, [`gluconic acid`, `n-hexane`, `glucosazone`], `<p>Both the aldehyde and the terminal CH<sub>2</sub>OH are oxidised to COOH, giving HOOC&ndash;(CHOH)<sub>4</sub>&ndash;COOH.</p>`],
    [`The pair of anomers of D-glucose differ in the configuration at`, `C-1`, [`C-2`, `C-4`, `C-5`], `<p>Anomers differ only at the new chiral centre formed on ring closure, the anomeric carbon (C-1 for glucose).</p>`],
    [`Mutarotation is the`, `slow change in the specific rotation of a freshly made sugar solution to a fixed value`, [`conversion of D to L sugar`, `change of colour with time`, `oxidation of sugar by air`], `<p>Pure &alpha;-D-glucose ([&alpha;] = +112&deg;) or pure &beta;-form (+19&deg;) changes to an equilibrium mixture, +52.5&deg;, through the open chain.</p>`],
    [`The ring form of glucose with six atoms in the ring is called`, `pyranose`, [`furanose`, `glycosidic`, `lactam`], `<p>A pyranose ring contains five carbons and one oxygen. Fructose often forms a furanose ring with five atoms.</p>`],
  ]),
  ...T(2, 'disaccharides and polysaccharides', [
    [`Sucrose is a non-reducing sugar because`, `both anomeric carbons are tied up in the glycosidic link, so there is no free hemiacetal or aldehyde`, [`it has no hydroxyl groups`, `it contains a ketone group`, `it is a polysaccharide`], `<p>The &alpha;-C1 of glucose is joined to the &beta;-C2 of fructose. The ring cannot open, so no free &ndash;CHO appears and Tollens' and Fehling's reagents are not reduced.</p>`],
    [`Maltose consists of two`, `&alpha;-D-glucose units linked from C-1 to C-4`, [`&beta;-D-glucose units linked from C-1 to C-4`, `glucose and fructose linked C-1 to C-2`, `galactose units`], `<p>Maltose is a reducing sugar, since one ring still has a free anomeric carbon.</p>`],
    [`Lactose on hydrolysis gives`, `&beta;-D-galactose and &beta;-D-glucose`, [`&alpha;-D-glucose and &beta;-D-fructose`, `two &alpha;-D-glucose`, `ribose and glucose`], `<p>Lactose is a reducing sugar, with a &beta;-1,4 link.</p>`],
    [`The part of starch that is a linear chain of &alpha;-D-glucose and is water soluble is`, `amylose`, [`amylopectin`, `cellulose`, `glycogen`], `<p>Amylose (about 15 to 20%) is unbranched with &alpha;-1,4 links. Amylopectin (80 to 85%) is branched with &alpha;-1,6 links at the branch points.</p>`],
    [`Cellulose differs from starch in that cellulose`, `has &beta;-glycosidic links, and cannot be digested by humans`, [`has &alpha;-glycosidic links`, `is made of fructose`, `is a protein`], `<p>Humans lack the enzyme that breaks &beta;-1,4 links. Ruminants digest it through bacteria in their gut.</p>`],
    [`Glycogen is stored mainly in the`, `liver and muscles`, [`bones`, `blood plasma`, `hair`], `<p>Glycogen is the animal starch, more highly branched than amylopectin.</p>`],
    [`Starch gives a blue-black colour with iodine because`, `iodine is held inside the helical amylose chain`, [`iodine reacts with the aldehyde end`, `starch reduces iodine to iodide`, `starch is a protein`], `<p>The I<sub>3</sub><sup>&minus;</sup>/I<sub>2</sub> chain fits into the helix and gives a blue complex. The colour disappears on heating.</p>`],
    [`Invert sugar is`, `an equimolar mixture of glucose and fructose, which is levorotatory`, [`pure fructose`, `a mixture of sucrose and glucose`, `dextrorotatory, like sucrose`], `<p>Sucrose is dextrorotatory (+66.5&deg;). On hydrolysis it gives glucose (+52.5&deg;) and fructose (&minus;92&deg;). The mix has an overall rotation of about &minus;20&deg;, the rotation changes sign, and so it is called inversion.</p>`],
  ]),
  ...T(2, 'proteins', [
    [`The isoelectric point of an amino acid is the pH at which`, `the net charge is zero, and the zwitterion predominates`, [`all the molecules are cations`, `the amino acid is most soluble`, `all the molecules are anions`], `<p>At the isoelectric point the molecule does not move in an electric field, and solubility is usually the least.</p>`, `Solubility is a minimum, not a maximum, at the pI.`],
    [`In strongly acidic solution, glycine exists mainly as`, `H<sub>3</sub>N<sup>+</sup>CH<sub>2</sub>COOH`, [`H<sub>2</sub>NCH<sub>2</sub>COO<sup>&minus;</sup>`, `H<sub>3</sub>N<sup>+</sup>CH<sub>2</sub>COO<sup>&minus;</sup>`, `H<sub>2</sub>NCH<sub>2</sub>COOH`], `<p>Acid protonates the carboxylate, so the ion carries only a positive charge and moves to the cathode.</p>`],
    [`The &alpha;-helix of a protein is held by`, `hydrogen bonds between the C=O and N&ndash;H groups of the backbone`, [`disulphide bridges`, `ionic bonds between side chains`, `peptide bonds`], `<p>This is secondary structure. The C=O of one residue bonds to the N&ndash;H four residues along.</p>`],
    [`The primary structure of a protein is`, `the sequence of amino acids in the chain`, [`the folding into a helix`, `the arrangement of subunits`, `the three-dimensional shape`], `<p>Secondary: helix and sheet. Tertiary: complete 3D fold. Quaternary: arrangement of subunits.</p>`],
    [`Denaturation of a protein by heat destroys`, `the secondary and tertiary structures but not the primary structure`, [`the primary structure`, `only the quaternary structure`, `the amino acid sequence and peptide bonds`], `<p>Heating egg white turns it to a white solid. The H bonds and other weak interactions break, but the peptide bonds stay.</p>`],
    [`The test that gives a purple colour with any free &alpha;-amino acid is`, `the ninhydrin test`, [`the biuret test`, `the Fehling test`, `the iodoform test`], `<p>Ninhydrin gives Ruhemann's purple with free &alpha;-amino acids. Biuret needs peptide bonds (a violet colour).</p>`],
    [`A protein has four polypeptide subunits held together. This level of structure is called`, `quaternary`, [`primary`, `secondary`, `tertiary`], `<p>Haemoglobin, with four chains, is the usual example.</p>`],
  ]),
  ...T(2, 'enzymes, vitamins, nucleic acids and hormones', [
    [`The model in which the substrate fits the active site like a key in a lock explains`, `the specificity of enzymes`, [`the speed of enzymes`, `why enzymes denature`, `why all enzymes are inhibited`], `<p>The shape of the substrate matches the active site. Induced fit is the improved model in which the site adjusts too.</p>`],
    [`An enzyme speeds up a reaction by`, `lowering the activation energy`, [`raising the temperature`, `changing &Delta;H of the reaction`, `shifting the equilibrium to the products`], `<p>Like any catalyst, an enzyme gives an easier path. It does not change &Delta;G of the reaction, or the position of equilibrium.</p>`],
    [`Pernicious anaemia is caused by deficiency of`, `vitamin B<sub>12</sub>`, [`vitamin B<sub>1</sub>`, `vitamin K`, `vitamin A`], `<p>B<sub>12</sub> (cyanocobalamin) contains cobalt. It is needed for the red blood cells.</p>`],
    [`Delayed blood clotting is a result of deficiency of`, `vitamin K`, [`vitamin E`, `vitamin D`, `vitamin C`], `<p>Vitamin K helps make clotting factors, such as prothrombin, in the liver.</p>`],
    [`Beriberi is caused by lack of`, `thiamine (vitamin B<sub>1</sub>)`, [`riboflavin (B<sub>2</sub>)`, `ascorbic acid`, `calciferol`], `<p>Thiamine deficiency affects the nerves and heart. Rice polishing removes it.</p>`],
    [`A nucleoside consists of`, `a base and a pentose sugar`, [`a base and a phosphate`, `a sugar and a phosphate`, `a base, a sugar and a phosphate`], `<p>Adding a phosphate group at C-5&prime; of the sugar gives a nucleotide.</p>`],
    [`In DNA, adenine pairs with thymine through`, `two hydrogen bonds`, [`three hydrogen bonds`, `one hydrogen bond`, `an ionic bond`], `<p>A&ndash;T has two hydrogen bonds. G&ndash;C has three.</p>`],
    [`Which of these is a purine?`, `Guanine`, [`Cytosine`, `Thymine`, `Uracil`], `<p>Adenine and guanine have two fused rings (purines). C, T and U have one ring (pyrimidines).</p>`],
    [`The nucleotides in a nucleic acid chain are joined by`, `phosphodiester linkages between C-3&prime; and C-5&prime;`, [`peptide bonds`, `glycosidic bonds between the bases`, `hydrogen bonds`], `<p>The phosphate links the 3&prime;-OH of one sugar to the 5&prime;-OH of the next. Hydrogen bonds join the two strands, not the units along one strand.</p>`],
    [`Deficiency of iodine leads to a disease due to low production of`, `thyroxine, causing goitre`, [`insulin, causing diabetes`, `adrenaline, causing scurvy`, `glucagon, causing rickets`].slice(0, 3), `<p>Thyroxine contains iodine. Without iodine, the thyroid enlarges (goitre).</p>`],
    [`Diabetes mellitus is linked to`, `too little insulin, or poor response to it`, [`too much insulin`, `lack of thyroxine`, `too much glucagon only`], `<p>Without insulin the blood glucose level rises and glucose appears in the urine.</p>`],
  ]),
];

const H3 = [
  ...T(3, 'glucose and fructose', [
    [`Both glucose and fructose give the same osazone with phenylhydrazine because`, `C-3, C-4, C-5 and C-6 have the same configuration in both, and C-1 and C-2 are changed to the same phenylhydrazone groups`, [`they have the same melting point`, `they have the same number of carbon atoms and so react alike`, `fructose is oxidised to glucose first`], `<p>The first reagent forms a hydrazone, the second oxidises the neighbouring carbon to a carbonyl, and the third forms the second hydrazone. The result does not depend on C-1 and C-2 being aldehyde or ketone and CH(OH).</p>`],
    [`Fructose, a ketose, still reduces Tollens' reagent because`, `in alkaline solution it isomerises to glucose and mannose, through an enediol`, [`it has a free aldehyde group`, `it is oxidised by air first`, `it has a COOH group`], `<p>The enediol (Lobry de Bruyn&ndash;Alberda van Ekenstein) rearrangement turns the ketose into aldoses. Also, the &alpha;-hydroxy ketone can be oxidised directly.</p>`],
    [`How many chiral carbon atoms does open-chain D-fructose have?`, `3`, [`4`, `2`, `5`], `<p>C-1 and C-6 are CH<sub>2</sub>OH, C-2 is C=O. C-3, C-4, C-5 are chiral, so 3. Glucose has 4.</p>`],
    [`D and L in D-glucose refer to`, `the configuration of the &ndash;OH on the chiral carbon farthest from the carbonyl (C-5), compared with D-glyceraldehyde`, [`the sign of the rotation of plane polarised light`, `the number of &ndash;OH groups`, `the ring size`], `<p>D and L are not related to the direction of rotation. D-fructose, for example, is levorotatory, hence the name D(&minus;)-fructose.</p>`, `D does not mean dextrorotatory.`],
    [`D-glucose and D-galactose differ at`, `C-4 only, so they are epimers`, [`C-1 only`, `C-2 only`, `all carbon atoms`], `<p>Epimers differ at one chiral centre other than the anomeric carbon. D-glucose and D-mannose are C-2 epimers.</p>`],
    [`The cyclic hemiacetal form of glucose does not react with NaHSO<sub>3</sub> chiefly because`, `the free aldehyde is present in only a very small amount at equilibrium`, [`glucose has no carbonyl at all`, `NaHSO<sub>3</sub> reacts only with ketones`, `the &ndash;OH groups block the reagent in the open chain`], `<p>More than 99% of the sugar is cyclic. The open chain is in equilibrium but only in a tiny amount, so the test is negative or weak.</p>`],
    [`Glucose reacts with excess phenylhydrazine to give an osazone. The number of moles of phenylhydrazine used per mole of glucose is`, `3 (one makes the hydrazone, one oxidises C-2, one forms the second hydrazone; one is lost as aniline and ammonia)`, [`1`, `2`, `4`], `<p>Three mol are used up, and one mole of aniline and one of ammonia are formed in addition.</p>`],
  ]),
  ...T(3, 'sugars', [
    [`Which of these gives a positive Fehling's test?`, `Maltose`, [`Sucrose`, `Starch`, `Cellulose`], `<p>Maltose has a free hemiacetal group. Sucrose has none. Starch and cellulose have only one free end, and the result is negligible.</p>`],
    [`Sucrose is hydrolysed by the enzyme`, `invertase (sucrase)`, [`maltase`, `lactase`, `amylase`], `<p>Invertase changes the sign of rotation: from +66.5&deg; to about &minus;20&deg;.</p>`],
    [`The linkage between the monosaccharide units in sucrose is`, `a glycosidic link between C-1 of &alpha;-glucose and C-2 of &beta;-fructose`, [`C-1 of &alpha;-glucose and C-4 of fructose`, `a peptide bond`, `an ester`], `<p>Both the reducing groups take part, which is why sucrose has no reducing power.</p>`],
    [`Amylopectin differs from amylose in that amylopectin`, `is branched, with &alpha;-1,6 links at the branch points`, [`has &beta;-links`, `is made of fructose`, `is linear`], `<p>Both are polymers of &alpha;-D-glucose. The branches come every 20 to 30 glucose units.</p>`],
    [`A solution of pure &alpha;-D-glucose has [&alpha;] = +112&deg;. After standing it shows +52.5&deg;. The change is because of`, `interconversion of the &alpha; and &beta; anomers through the open-chain form`, [`oxidation by dissolved oxygen`, `racemisation`, `polymerisation`], `<p>The &beta;-form (+19&deg;) forms, and the mixture settles at +52.5&deg;, about 36% &alpha; and 64% &beta;.</p>`],
    [`Which statement is correct about glucose?`, `It is dextrorotatory and has the D configuration`, [`D means it is dextrorotatory in every case`, `It has two chiral centres`, `It has a ketone group in the ring`], `<p>D-glucose is also called dextrose since it rotates the light to the right (+52.5&deg;). But the D label is about structure, not rotation.</p>`],
  ]),
  ...T(3, 'proteins', [
    [`In an alkaline solution (pH well above its pI), an amino acid in an electric field`, `moves towards the anode, as an anion`, [`moves towards the cathode`, `does not move`, `splits into two ions of opposite charge moving both ways`], `<p>Above the pI, the &ndash;NH<sub>3</sub><sup>+</sup> group loses H<sup>+</sup>, so the net charge is negative.</p>`],
    [`The pI of an amino acid with a neutral side chain is estimated as`, `the average of pK<sub>a1</sub> and pK<sub>a2</sub>`, [`pK<sub>a1</sub> &times; pK<sub>a2</sub>`, `pK<sub>a1</sub> &minus; pK<sub>a2</sub>`, `7 for all amino acids`], `<p>The zwitterion is the major form between the two pKa values, and the pI is midway.</p>`],
    [`Which amino acid contains sulphur and can form disulphide bridges?`, `Cysteine`, [`Serine`, `Alanine`, `Lysine`], `<p>Two cysteine side chains (&ndash;CH<sub>2</sub>SH) oxidise to the S&ndash;S bond, which is part of the tertiary structure. Methionine also contains S, but cannot form such bridges.</p>`],
    [`The xanthoproteic test (yellow colour with hot concentrated HNO<sub>3</sub>) is given by`, `proteins with aromatic residues such as tyrosine, phenylalanine and tryptophan`, [`all amino acids`, `glycine only`, `carbohydrates`], `<p>The benzene ring in the side chain is nitrated to give a yellow product.</p>`],
    [`How many peptide bonds are there in a linear tripeptide?`, `2`, [`3`, `1`, `4`], `<p>A chain of n amino acids has n &minus; 1 peptide bonds, and a tripeptide has 2.</p>`],
    [`Which of these is an essential amino acid for humans?`, `Valine`, [`Glycine`, `Alanine`, `Serine`], `<p>Essential amino acids cannot be made by the body: valine, leucine, isoleucine, lysine, threonine, methionine, phenylalanine, tryptophan (and arginine and histidine in some cases).</p>`],
    [`Renaturation of a denatured protein`, `is possible in some cases when the primary structure is intact and the conditions are restored`, [`is always possible with boiled egg`, `needs new peptide bonds`, `changes the amino acid sequence`], `<p>Some proteins fold back to the active form, but boiled egg white does not, because the aggregated molecules cannot find their way back.</p>`],
  ]),
  ...T(3, 'enzymes and vitamins', [
    [`The rate of an enzyme-catalysed reaction falls at a high temperature because`, `the enzyme is denatured`, [`the substrate polymerises`, `the activation energy rises`, `the products escape`], `<p>The optimum is close to body temperature (about 310 K). Above about 320 K most enzymes lose their shape and activity.</p>`],
    [`A competitive inhibitor`, `resembles the substrate and binds to the active site`, [`binds to a site far from the active site and changes its shape`, `destroys the substrate`, `is always a metal ion`], `<p>It competes with the substrate, so a high substrate concentration reduces its effect. Many drugs are enzyme inhibitors.</p>`],
    [`Which vitamin is NOT stored in the body in appreciable amounts and needs a regular supply?`, `Vitamin C`, [`Vitamin A`, `Vitamin D`, `Vitamin K`], `<p>Water-soluble vitamins (B-complex and C) are passed out in urine. The exception is B<sub>12</sub>, which is stored in the liver.</p>`],
    [`Vitamin E deficiency results in`, `fragile red blood cells and muscular weakness`, [`rickets`, `scurvy`, `beriberi`], `<p>Tocopherol is an antioxidant that protects membranes.</p>`],
    [`Night blindness and xerophthalmia result from lack of`, `vitamin A (retinol)`, [`vitamin D`, `vitamin K`, `vitamin B<sub>6</sub>`], `<p>Vitamin A forms retinal, the light-sensitive part of rhodopsin. Carrots and fish liver oil are sources.</p>`],
    [`Urease catalyses`, `the hydrolysis of urea to ammonia and carbon dioxide`, [`the hydrolysis of sucrose`, `the breakdown of starch`, `the breakdown of proteins`], `<p>(NH<sub>2</sub>)<sub>2</sub>CO + H<sub>2</sub>O &rarr; 2NH<sub>3</sub> + CO<sub>2</sub>.</p>`],
  ]),
  ...T(3, 'nucleic acids', [
    [`The ratio of purines to pyrimidines in a double-stranded DNA is`, `1 : 1, since A = T and G = C`, [`2 : 1`, `1 : 2`, `varies from species to species`], `<p>Each purine pairs with a pyrimidine. Chargaff's rule: A = T, G = C.</p>`],
    [`Which statement is true for the DNA double helix?`, `The two strands run in opposite directions and are held by hydrogen bonds`, [`The strands run in the same direction`, `The strands are held by ionic bonds between phosphates`, `The bases are on the outside`], `<p>The strands are antiparallel (5&prime;&rarr;3&prime; and 3&prime;&rarr;5&prime;). The bases are stacked inside and the sugar-phosphate backbone is on the outside.</p>`],
    [`Which type of RNA carries amino acids to the ribosome?`, `tRNA`, [`mRNA`, `rRNA`, `DNA polymerase`], `<p>Transfer RNA brings a specific amino acid. mRNA carries the code, and rRNA is part of the ribosome.</p>`],
    [`A codon is made up of`, `three nucleotides on mRNA`, [`two nucleotides`, `three amino acids`, `a base pair`], `<p>The triplet code of 64 codons specifies 20 amino acids and the stop signals.</p>`],
    [`Replication of DNA is described as semi-conservative because`, `each new DNA has one old strand and one new strand`, [`the old DNA is kept intact`, `both strands are new`, `half the genes are copied`], `<p>Each parent strand acts as a template for a new strand.</p>`],
  ]),
];

const H4 = [
  ...T(4, 'sugars', [
    [`D-glucose is treated with excess phenylhydrazine, and the osazone is compared with that from D-mannose. They are`, `the same osazone, because the two sugars differ only at C-2`, [`different osazones, since D-glucose and D-mannose differ`, `no osazone at all`, `enantiomeric osazones`], `<p>C-2 is changed to a hydrazone group in both, which destroys the difference. Glucose, mannose and fructose all give the same osazone.</p>`],
    [`The structural difference between starch and glycogen is mainly`, `the degree of branching, as glycogen is more highly branched`, [`glycogen has &beta;-links`, `starch contains fructose`, `glycogen is a protein`], `<p>Both are &alpha;-glucose polymers. Glycogen has a branch every 8 to 12 units, against about 20 to 30 in amylopectin.</p>`],
    [`When 1 mol of sucrose is hydrolysed, the number of moles of reducing sugar formed is`, `2`, [`1`, `0`, `4`], `<p>1 mol glucose and 1 mol fructose, both reducing, give 2 mol.</p>`],
    [`Which sugar is expected to show mutarotation?`, `Maltose`, [`Sucrose`, `Trehalose, a non-reducing sugar`, `Starch`], `<p>Mutarotation needs a free anomeric hydroxyl group that can open the ring. Sucrose and trehalose have none.</p>`],
  ]),
  ...T(4, 'amino acids', [
    [`For aspartic acid (pK<sub>a</sub> values 1.99, 3.90, 9.90), the isoelectric point is`, `about 2.95, the average of the two acidic pK<sub>a</sub> values`, [`about 5.9, the average of 1.99 and 9.90`, `about 6.9, the average of 3.90 and 9.90`, `7.0`], `<p>The neutral form lies between the loss of the first and the second proton (charge +1, then 0, then &minus;1 after the third). The two acid groups are pK<sub>a1</sub> = 1.99 and pK<sub>a2</sub> = 3.90, so pI = (1.99 + 3.90)/2 = 2.95.</p>`],
    [`For lysine (pK<sub>a</sub> values 2.18, 8.95, 10.53) the pI is`, `about 9.74, the average of the two higher pK<sub>a</sub> values`, [`about 5.57`, `about 6.7`, `about 2.2`], `<p>The neutral form lies between pK<sub>a2</sub> and pK<sub>a3</sub>, so pI = (8.95 + 10.53)/2 = 9.74.</p>`],
    [`At pH 7, a mixture of glycine (pI 5.97), aspartic acid (pI 2.95) and lysine (pI 9.74) is put in an electric field. The directions of migration are`, `glycine slightly to the anode, aspartic acid to the anode, lysine to the cathode`, [`all towards the cathode`, `glycine to the cathode and lysine to the anode`, `none moves`], `<p>If pH &gt; pI the amino acid is negative and goes to the anode. If pH &lt; pI it is positive and goes to the cathode.</p>`],
    [`In a peptide Ala&ndash;Gly&ndash;Ser the free &ndash;COOH group is on`, `serine`, [`alanine`, `glycine`, `all three`], `<p>By convention, the N-terminal residue (free &ndash;NH<sub>2</sub>) is written first and the C-terminal (free &ndash;COOH) last.</p>`],
    [`The peptide bond has partial double-bond character due to`, `resonance between N lone pair and the C=O, making the unit planar and rotation restricted`, [`hydrogen bonding with water`, `sp<sup>3</sup> hybridisation of N`, `ionic character`], `<p>The N lone pair is delocalised into the carbonyl. This makes the C&ndash;N bond shorter than a normal single bond and keeps the six atoms in one plane.</p>`],
  ]),
  ...T(4, 'vitamins, hormones and nucleic acids', [
    [`Which pair of hormone and its nature is correctly matched?`, `Oxytocin &ndash; polypeptide`, [`Testosterone &ndash; polypeptide`, `Thyroxine &ndash; steroid`, `Insulin &ndash; steroid`], `<p>Insulin, glucagon and oxytocin are peptides. Testosterone, oestrogen and cortisol are steroids. Thyroxine and adrenaline are amino acid derivatives.</p>`],
    [`Insulin consists of`, `two polypeptide chains (A with 21 and B with 30 amino acids) joined by disulphide bridges`, [`a single chain of 51 residues without cross links`, `four chains`, `a polysaccharide`], `<p>Two disulphide bridges join the chains between them, and one lies within chain A.</p>`],
    [`A DNA fragment contains 30% adenine. The percentage of cytosine in it is`, `20%`, [`30%`, `40%`, `70%`], `<p>A = T = 30%, so A + T = 60% and G + C = 40%, so C = 20%.</p>`],
    [`Which is NOT correct for RNA?`, `It has the base thymine`, [`It has ribose`, `It is mostly single-stranded`, `It has uracil`], `<p>Thymine (5-methyluracil) belongs to DNA.</p>`],
    [`A mononucleotide of DNA has the phosphate group linked to`, `C-5&prime; of deoxyribose`, [`C-1&prime;`, `C-2&prime;`, `the base`], `<p>The base is bonded to C-1&prime; (a &beta;-N-glycosidic link) and the phosphate to C-5&prime;.</p>`],
    [`Vitamin B<sub>12</sub> is unusual among vitamins because it`, `contains cobalt, and is the only B vitamin stored in the liver in a large amount`, [`is fat soluble`, `contains iron`, `is made by humans`], `<p>It is made only by microbes, so a strict vegan diet may lack it.</p>`],
  ]),
];

const H5 = [
  ...T(5, 'mixed', [
    [`D-glucose is oxidised with excess HNO<sub>3</sub> to saccharic acid. Compared with the same reaction on D-galactose, the products are`, `optically active for glucose, but optically inactive (meso mucic acid) for galactose`, [`both optically inactive`, `both optically active`, `optically active for galactose only`], `<p>Galactose, with the C-4 configuration inverted, gives a dicarboxylic acid with an internal plane of symmetry (meso). Glucose gives a chiral acid.</p>`],
    [`Treating D-glucose with HCN, then hydrolysing and reducing with HI, gives heptanoic acid (n-heptanoic). This sequence proves`, `the carbonyl is at the end of an unbranched six-carbon chain`, [`glucose has a ring`, `glucose has five OH groups`, `glucose is a ketone`], `<p>HCN adds to the C=O to give a cyanohydrin. Hydrolysis gives a seven-carbon acid, and reduction removes all the OH groups. Heptanoic acid (straight chain) shows that the chain is straight and the carbonyl is at the end.</p>`],
    [`A tetrapeptide contains 4 different amino acids, each used once. The number of sequences (isomeric tetrapeptides) possible is`, `24`, [`16`, `12`, `256`], `<p>4! = 24 orderings (each is a different peptide since the N-terminal and C-terminal ends differ).</p>`],
    [`A peptide gives a negative biuret test. This means that`, `it is not a tripeptide or longer, so it could be a dipeptide or an amino acid`, [`it has no amino groups`, `it is a protein`, `it has too many peptide bonds`], `<p>The biuret test needs at least two peptide bonds close together.</p>`],
    [`In a titration of glycine with NaOH starting from H<sub>3</sub>N<sup>+</sup>CH<sub>2</sub>COOH, the pH at the first half-equivalence point equals`, `pK<sub>a1</sub>, 2.34`, [`pK<sub>a2</sub>, 9.60`, `5.97`, `7.00`], `<p>At half the first equivalence point, the cationic and the zwitterionic forms are present in equal amounts, so pH = pK<sub>a1</sub>. At the first equivalence point, pH = pI = 5.97.</p>`],
    [`The specific rotation of an equimolar mixture of two anomers with [&alpha;] values of +112&deg; and +19&deg; is`, `about +65.5&deg;, and not +52.5&deg;, so the equilibrium mixture of glucose is not equimolar`, [`+93&deg;`, `+131&deg;`, `zero`], `<p>The average of 112 and 19 is 65.5&deg;. The actual equilibrium value, 52.5&deg;, is lower, so there is more of the &beta;-anomer (64%) than the &alpha; (36%).</p>`],
  ]),
];

const NAT = [
  nat(2, 'chirality', `How many chiral carbon atoms are there in the open-chain structure of D-glucose?`, 4, 0, '', `<p>CHO (C-1) is not chiral, C-2 to C-5 each carry four different groups, and C-6 is CH<sub>2</sub>OH.</p><p>Chiral carbons = <b>4</b>.</p>`, undefined, () => 6 - 2),
  nat(3, 'chirality', `Find the number of stereoisomers of an open-chain aldohexose such as glucose.`, 16, 0, '', `<p>There are 4 chiral carbons, so 2<sup>4</sup> = <b>16</b> stereoisomers (8 D and 8 L).</p>`, undefined, () => 2 ** 4),
  nat(3, 'chirality', `Find the number of stereoisomers of open-chain D-fructose type ketohexoses.`, 8, 0, '', `<p>3 chiral carbons, so 2<sup>3</sup> = <b>8</b>.</p>`, `Ketohexose has one fewer chiral carbon than aldohexose.`, () => 2 ** 3),
  nat(2, 'peptides', `Find the molar mass of the dipeptide Gly&ndash;Ala. (Gly 75, Ala 89; water 18)`, 146, 0, 'g/mol', `<p>A dipeptide is the two amino acids less one water: 75 + 89 &minus; 18 = <b>146</b>.</p>`, undefined, () => 75 + 89 - 18),
  nat(3, 'peptides', `Find the molar mass of Gly&ndash;Gly&ndash;Gly (Gly = 75, water = 18).`, 189, 0, 'g/mol', `<p>Three residues, two water molecules lost: 3 &times; 75 &minus; 2 &times; 18 = <b>189</b>.</p>`, `Subtract 18 for each peptide bond, not for each residue.`, () => 3 * 75 - 36),
  nat(3, 'peptides', `Three different amino acids are linked, using each exactly once, to form tripeptides. How many different tripeptides are possible?`, 6, 0, '', `<p>The order matters: 3! = <b>6</b>.</p>`, undefined, () => 6),
  nat(3, 'peptides', `How many different dipeptides can be made from 4 different amino acids if an amino acid may be used twice?`, 16, 0, '', `<p>Two positions, four choices each: 4 &times; 4 = <b>16</b>.</p>`, undefined, () => 4 * 4),
  nat(3, 'polysaccharides', `What mass of glucose is formed by the complete hydrolysis of 81 g of starch? (Repeat unit C<sub>6</sub>H<sub>10</sub>O<sub>5</sub> = 162 g/mol; glucose = 180 g/mol)`, 90, 0, 'g', `<p>(C<sub>6</sub>H<sub>10</sub>O<sub>5</sub>)<sub>n</sub> + nH<sub>2</sub>O &rarr; nC<sub>6</sub>H<sub>12</sub>O<sub>6</sub>. 81 g is 0.5 mol of units.</p><p>Glucose = 0.5 &times; 180 = <b>90 g</b>.</p>`, `Water adds to the mass.`, () => 81 / 162 * 180),
  nat(3, 'amino acids', `Calculate the isoelectric point of glycine, from pK<sub>a1</sub> = 2.34 and pK<sub>a2</sub> = 9.60.`, 5.97, 0.01, '', `<p>pI = (pK<sub>a1</sub> + pK<sub>a2</sub>)/2 = (2.34 + 9.60)/2 = <b>5.97</b>.</p>`, undefined, () => (2.34 + 9.60) / 2),
  nat(4, 'amino acids', `Find the pI of aspartic acid using the two acidic pK<sub>a</sub> values 2.0 and 3.9.`, 2.95, 0.01, '', `<p>The neutral zwitterion lies between the first two dissociations (+1 &rarr; 0 &rarr; &minus;1), so pI = (2.0 + 3.9)/2 = <b>2.95</b>.</p>`, `Use the two pKa values on either side of the neutral form, not the first and last.`, () => (2.0 + 3.9) / 2),
  nat(4, 'amino acids', `Find the pI of lysine with pK<sub>a</sub> values 2.18, 8.95 and 10.53.`, 9.74, 0.01, '', `<p>For a basic amino acid the net charge is zero between the last two pK<sub>a</sub> values: (8.95 + 10.53)/2 = <b>9.74</b>.</p>`, undefined, () => (8.95 + 10.53) / 2),
  nat(3, 'nucleic acids', `A double-stranded DNA fragment has 10 A&ndash;T and 15 G&ndash;C base pairs. How many hydrogen bonds hold the strands together?`, 65, 0, '', `<p>A&ndash;T: 2 bonds, so 10 &times; 2 = 20. G&ndash;C: 3 bonds, so 15 &times; 3 = 45.</p><p>Total = <b>65</b>.</p>`, undefined, () => 20 + 45),
  nat(2, 'nucleic acids', `In a sample of double-stranded DNA, adenine is 22% of the bases. What is the percentage of guanine?`, 28, 0, '%', `<p>T = A = 22%, so A + T = 44%. G + C = 56%, and G = C = <b>28%</b>.</p>`, undefined, () => (100 - 44) / 2),
  nat(3, 'nucleic acids', `A DNA segment has 1000 base pairs. How long is it, in nm, if the rise is 0.34 nm per base pair?`, 340, 0, 'nm', `<p>1000 &times; 0.34 = <b>340 nm</b>. This is also 100 turns of the helix, at 10 base pairs per turn (3.4 nm).</p>`, undefined, () => 1000 * 0.34),
  nat(3, 'optical activity', `A 10% (w/v) solution of D-glucose at equilibrium ([&alpha;] = +52.5&deg;) is placed in a 1 dm tube. Find the observed rotation in degrees.`, 5.25, 0.02, '&deg;', `<p>[&alpha;] = &alpha;/(l &times; c) with c in g/mL = 0.10 and l in dm = 1.</p><p>&alpha; = 52.5 &times; 1 &times; 0.10 = <b>5.25&deg;</b>.</p>`, `Convert 10% to 0.10 g/mL, not 10.`, () => 52.5 * 1 * 0.1),
  nat(4, 'invert sugar', `Equimolar glucose ([&alpha;] = +52.5&deg;) and fructose ([&alpha;] = &minus;92.4&deg;) are mixed. Find the specific rotation of the mixture, in degrees (they have the same molar mass).`, -19.95, 0.1, '&deg;', `<p>Equal masses and equal weights: the average is (52.5 &minus; 92.4)/2 = <b>&minus;19.95&deg;</b>, about &minus;20&deg;. That the sign changes is why the hydrolysis of sucrose is called inversion.</p>`, undefined, () => (52.5 - 92.4) / 2),
  nat(4, 'mutarotation', `At equilibrium, a glucose solution has [&alpha;] = +52.5&deg;. The pure anomers have +112&deg; (&alpha;) and +19&deg; (&beta;). Find the percentage of &alpha;-anomer, to one decimal (ignore the open chain).`, 36.0, 0.1, '%', `<p>Let x be the fraction of &alpha;: 112x + 19(1 &minus; x) = 52.5, so 93x = 33.5 and x = 0.3602.</p><p>&alpha;-anomer = <b>36.0 %</b>.</p>`, undefined, () => (52.5 - 19) / (112 - 19) * 100),
  nat(3, 'Tollens test', `What mass of silver, in g, is deposited when 18 g of glucose reacts completely with Tollens' reagent? (Glucose = 180, Ag = 108)`, 21.6, 0.1, 'g', `<p>18 g is 0.1 mol. Each aldehyde group gives 2 Ag (Ag<sup>+</sup> + e<sup>&minus;</sup>, two electrons per CHO).</p><p>Ag = 0.2 mol &times; 108 = <b>21.6 g</b>.</p>`, `Two electrons per aldehyde, so two silver atoms.`, () => 18 / 180 * 2 * 108),
  nat(3, 'sugar acetylation', `How many moles of acetic anhydride are needed to convert 2 mol of glucose into its pentaacetate?`, 10, 0, 'mol', `<p>Each glucose has 5 OH groups, and each OH uses one acetyl group (one anhydride gives one acetyl group to the sugar and the other to acetic acid).</p><p>2 &times; 5 = <b>10 mol</b>.</p>`, undefined, () => 2 * 5),
  nat(3, 'sucrose hydrolysis', `Find the mass of fructose obtained from 171 g of sucrose by complete hydrolysis (sucrose = 342, fructose = 180).`, 90, 0, 'g', `<p>171 g is 0.5 mol. One mole of sucrose gives one mole of fructose.</p><p>0.5 &times; 180 = <b>90 g</b>.</p>`, undefined, () => 171 / 342 * 180),
  nat(3, 'protein structure', `A protein has 150 amino acid residues in two separate chains. How many peptide bonds does it contain?`, 148, 0, '', `<p>Each linear chain of n residues has n &minus; 1 bonds, so total = 150 &minus; 2 = <b>148</b>.</p>`, `Subtract the number of chains.`, () => 150 - 2),
  nat(3, 'nucleic acids', `A double-stranded DNA of 50 base pairs has how many nucleotides in all?`, 100, 0, '', `<p>Each base pair has two nucleotides, so 2 &times; 50 = <b>100</b>.</p>`, undefined, () => 100),
  nat(4, 'peptides', `Find the molar mass of the tetrapeptide Gly&ndash;Ala&ndash;Ser&ndash;Val. (Gly 75, Ala 89, Ser 105, Val 117; water 18)`, 332, 0, 'g/mol', `<p>Sum = 75 + 89 + 105 + 117 = 386. Three peptide bonds lose 3 &times; 18 = 54.</p><p>Mass = 386 &minus; 54 = <b>332</b>.</p>`, undefined, () => 75 + 89 + 105 + 117 - 54),
];

const MSQ = [
  msq(3, 'carbohydrates', `Which of the following are reducing sugars?`, [`Glucose`, `Fructose`, `Maltose`, `Sucrose`], [0, 1, 2], `<p>Glucose and maltose have a free hemiacetal or aldehyde. Fructose is reducing through the enediol shift. Sucrose has both anomeric carbons in the glycosidic bond, so it is non-reducing.</p>`, `Fructose is a ketose, but it does reduce Tollens' reagent.`),
  msq(4, 'carbohydrates', `Which statements about the polysaccharides are correct?`, [`Cellulose has &beta;-1,4 links`, `Amylopectin has &alpha;-1,6 branch points`, `Glycogen is more branched than amylopectin`, `Amylose is branched`], [0, 1, 2], `<p>Amylose is the linear part of starch.</p>`),
  msq(3, 'proteins', `Which are secondary or tertiary structure features of a protein?`, [`&alpha;-helix`, `&beta;-pleated sheet`, `Disulphide bridges between cysteine residues`, `Order of amino acids`], [0, 1, 2], `<p>The order of amino acids is the primary structure.</p>`),
  msq(4, 'glucose reactions', `Which of the following reagents react with the open-chain form of glucose to give a product that supports the presence of an aldehyde group?`, [`Br<sub>2</sub> water giving gluconic acid`, `HCN giving a cyanohydrin`, `NH<sub>2</sub>OH giving an oxime`, `Acetic anhydride giving the pentaacetate`], [0, 1, 2], `<p>Bromine water, HCN and hydroxylamine react at the carbonyl group. Acetylation shows the OH groups, not the carbonyl.</p>`),
  msq(4, 'vitamins', `Which of the following vitamin&ndash;disease pairs are correct?`, [`Vitamin A &ndash; night blindness`, `Vitamin B<sub>1</sub> &ndash; beriberi`, `Vitamin D &ndash; rickets`, `Vitamin C &ndash; pernicious anaemia`], [0, 1, 2], `<p>Scurvy, not pernicious anaemia (B<sub>12</sub>), comes from lack of vitamin C.</p>`),
  msq(4, 'nucleic acids', `Which statements about DNA and RNA are correct?`, [`DNA has thymine and RNA has uracil`, `RNA is usually single-stranded`, `Both have a phosphodiester backbone`, `DNA has ribose`], [0, 1, 2], `<p>DNA has deoxyribose, with no OH at C-2&prime;.</p>`),
  msq(5, 'amino acids', `In an electric field at pH 6.0, which of these amino acids moves towards the anode? (pI: glycine 5.97; glutamic acid 3.2; arginine 10.8; aspartic acid 2.95)`, [`Glutamic acid`, `Aspartic acid`, `Arginine`, `Glycine, only very slightly`], [0, 1, 3], `<p>For pH &gt; pI, the net charge is negative, so the amino acid moves to the anode. Glutamic and aspartic acids are clearly negative. Glycine, with pI 5.97, is only slightly negative at 6.0. Arginine (pI 10.8) is positive and moves to the cathode.</p>`),
  msq(5, 'sugars', `Which of these are obtained on the hydrolysis of lactose or are related to it?`, [`&beta;-D-galactose`, `&beta;-D-glucose`, `a &beta;(1&rarr;4) linkage`, `fructose`], [0, 1, 2], `<p>Lactose is a &beta;-galactose&ndash;glucose disaccharide with a &beta;-1,4 link. There is no fructose.</p>`),
];

const ASR = [
  asr(2, 'sugars', `Sucrose does not reduce Tollens' reagent.`, `Both the anomeric carbons of glucose and fructose are used in the glycosidic bond in sucrose.`, 0, `<p>There is no free hemiacetal, so the ring cannot open to give an aldehyde. R is the reason.</p>`),
  asr(2, 'amino acids', `Amino acids have high melting points and are soluble in water.`, `Amino acids exist as zwitterions in the solid state.`, 0, `<p>The ionic dipolar structure gives strong electrostatic forces, like a salt, and so a high melting point and water solubility.</p>`),
  asr(3, 'sugars', `Fructose, a ketose, reduces Tollens' reagent.`, `In an alkaline medium, fructose changes to glucose and mannose through an enediol.`, 0, `<p>The aldoses formed can reduce Tollens' reagent. R explains A.</p>`),
  asr(3, 'proteins', `Boiling an egg changes the protein structure irreversibly.`, `The peptide bonds are broken by boiling.`, 2, `<p>A is true: denaturation. R is false: peptide bonds remain intact, and it is the H bonds and other weak interactions that break.</p>`),
  asr(3, 'glucose', `Glucose does not give the Schiff test.`, `Glucose exists mainly in the cyclic hemiacetal form and has very little free aldehyde.`, 0, `<p>Little free &ndash;CHO is present, so the test is negative; R is the reason.</p>`),
  asr(3, 'cellulose', `Humans cannot digest cellulose.`, `Cellulose is made of &alpha;-D-glucose units linked by &beta;-glycosidic bonds.`, 2, `<p>A is true: humans lack the enzyme for &beta;-1,4 links. R is false, because the units are &beta;-D-glucose (the &alpha;-units are in starch). So A is true and R is false.</p>`, `Starch: &alpha;-glucose; cellulose: &beta;-glucose.`),
  asr(3, 'vitamins', `Vitamin C must be taken regularly in the diet.`, `Vitamin C is water soluble and is passed out in the urine, not stored.`, 0, `<p>Water-soluble vitamins are not stored, so a regular supply is needed.</p>`),
  asr(4, 'DNA', `The DNA with more G&ndash;C pairs is more stable to heating.`, `G&ndash;C has three hydrogen bonds and A&ndash;T has two.`, 0, `<p>More hydrogen bonds mean that a higher temperature is needed to separate the strands.</p>`),
  asr(4, 'enzymes', `An enzyme does not change the equilibrium constant of a reaction.`, `An enzyme lowers the activation energy of both the forward and reverse reactions equally.`, 0, `<p>Equal lowering of both barriers speeds both directions equally, so K stays the same.</p>`),
  asr(4, 'amino acids', `At the isoelectric point, an amino acid has minimum solubility in water.`, `At the isoelectric point the net charge is zero, and the zwitterions attract each other in the crystal.`, 0, `<p>With no net charge, there is least repulsion between molecules and they pack and precipitate more easily. R explains A.</p>`),
  asr(4, 'DNA', `Thymine is found in DNA and not in RNA, where uracil replaces it.`, `Thymine is 5-methyluracil.`, 1, `<p>Both are true. But R does not explain why DNA and RNA use different bases; it only describes the structure.</p>`),
];

const STM = [
  stm(2, 'proteins', `Proteins are polymers of &alpha;-amino acids joined by peptide bonds.`, `Glycine is the only amino acid in proteins that is optically inactive.`, 0, `<p>Both correct: the &alpha;-carbon of glycine has two H atoms.</p>`),
  stm(2, 'carbohydrates', `Glucose and fructose are structural isomers.`, `Glucose is an aldohexose and fructose is a ketohexose.`, 0, `<p>Both are C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> with different functional groups. II is the reason for the isomerism.</p>`),
  stm(3, 'nucleic acids', `DNA contains the sugar 2-deoxyribose.`, `The base uracil is present in DNA.`, 1, `<p>I is correct. II is wrong: uracil is in RNA, and DNA has thymine.</p>`),
  stm(3, 'vitamins', `Vitamins A, D, E and K are fat soluble.`, `Vitamins B and C are stored in the body in large amounts.`, 1, `<p>I is correct. II is wrong: B and C are water soluble and are excreted, so they have to be taken regularly.</p>`),
  stm(3, 'sugars', `Maltose is a reducing sugar.`, `Maltose on hydrolysis gives glucose and fructose.`, 1, `<p>I is correct. II is wrong: maltose gives two glucose units.</p>`),
  stm(3, 'proteins', `Denaturation destroys the secondary and tertiary structures of a protein.`, `Denaturation breaks the peptide bonds.`, 1, `<p>I is correct. II is false: only the weak forces break, so the primary structure stays.</p>`),
  stm(4, 'sugars', `Starch consists of two components, amylose and amylopectin.`, `Amylopectin is the water-soluble, unbranched component.`, 1, `<p>I is correct. II is wrong: amylose is the water-soluble linear part and amylopectin is branched and insoluble.</p>`),
  stm(4, 'amino acids', `The pI of a basic amino acid like lysine is above 7.`, `The pI of an acidic amino acid like aspartic acid is below 7.`, 0, `<p>Lysine pI = 9.74 and aspartic acid pI = 2.95. Both are correct.</p>`),
  stm(4, 'enzymes', `Enzymes are specific, and work best at an optimum pH and temperature.`, `Raising the temperature always increases the rate of an enzyme reaction.`, 1, `<p>I is correct. II is wrong: above the optimum, the enzyme is denatured and the rate falls.</p>`),
  cnt(3, 'biomolecules', `How many of the following are reducing sugars: glucose, fructose, sucrose, maltose, lactose, starch?`, [`3`, `4`, `5`, `2`], 1, `<p>Glucose, fructose, maltose and lactose reduce Tollens' reagent. Sucrose has no free anomeric carbon and starch has so few free ends that it is non-reducing in practice. Count = <b>4</b>.</p>`, `Starch is classed as non-reducing.`),
  cnt(4, 'biomolecules', `How many of these are pyrimidines: adenine, thymine, cytosine, guanine, uracil?`, [`2`, `3`, `4`, `1`], 1, `<p>Thymine, cytosine and uracil have a single six-membered ring. Adenine and guanine are purines. Count = <b>3</b>.</p>`),
  cnt(4, 'biomolecules', `How many of these statements are correct? (i) Insulin is a steroid hormone. (ii) Thyroxine contains iodine. (iii) Adrenaline is a polypeptide. (iv) Testosterone is a steroid.`, [`1`, `2`, `3`, `4`], 1, `<p>(ii) and (iv) are correct. Insulin is a peptide, and adrenaline an amine from tyrosine. Count = <b>2</b>.</p>`),
];

const MATCH = [
  mat(2, 'disaccharides', 'm1', `Match each sugar in List I with its description in List II.`, `A-q, B-p, C-r, D-s`, [`A-p, B-q, C-r, D-s`, `A-q, B-p, C-s, D-r`, `A-r, B-p, C-q, D-s`], `<p>Sucrose: glucose and fructose, non-reducing (q). Maltose: two &alpha;-glucose, reducing (p). Lactose: galactose and glucose (r). Cellulose: &beta;-glucose chain (s).</p>`),
  mat(2, 'vitamins', 'm2', `Match each vitamin in List I with the deficiency disease in List II.`, `A-r, B-s, C-p, D-q`, [`A-s, B-r, C-p, D-q`, `A-r, B-s, C-q, D-p`, `A-p, B-s, C-r, D-q`], `<p>B<sub>1</sub>: beriberi (r). C: scurvy (s). D: rickets (p). K: slow clotting (q).</p>`),
  mat(3, 'glucose reactions', 'm3', `Match each reagent in List I with its product from glucose in List II.`, `A-r, B-s, C-p, D-q`, [`A-s, B-r, C-p, D-q`, `A-r, B-s, C-q, D-p`, `A-q, B-s, C-p, D-r`], `<p>Br<sub>2</sub> water: gluconic acid (r). Conc. HNO<sub>3</sub>: saccharic acid (s). HI: n-hexane (p). Excess phenylhydrazine: glucosazone (q).</p>`),
  mat(3, 'tests', 'm4', `Match each test in List I with the observation in List II.`, `A-s, B-p, C-r, D-q`, [`A-q, B-p, C-r, D-s`, `A-s, B-r, C-p, D-q`, `A-s, B-p, C-q, D-r`], `<p>Ninhydrin: blue-purple (s). Iodine and starch: blue-black (p). Fehling and glucose: red-brown Cu<sub>2</sub>O (r). Biuret: violet (q).</p>`),
  mat(4, 'nucleic acids', 'm5', `Match each unit in List I with its class in List II.`, `A-q, B-p, C-s, D-r`, [`A-p, B-q, C-s, D-r`, `A-q, B-p, C-r, D-s`, `A-s, B-p, C-q, D-r`], `<p>Adenine is a purine in DNA and RNA (q). Thymine is a pyrimidine only in DNA (p). Uracil is a pyrimidine only in RNA (s). Ribose is the sugar of RNA (r).</p>`),
];

const PASSAGES = [
  P(3, 'disaccharides', 'p1', `The disaccharide X is`, `maltose`, [`sucrose`, `lactose`, `trehalose`], `<p>It gives only glucose and is reducing, with mutarotation. Sucrose is non-reducing and gives fructose also. Lactose gives galactose. Maltose gives two glucose units.</p>`),
  P(3, 'disaccharides', 'p1', `The glycosidic bond in X links`, `C-1 of one &alpha;-glucose to C-4 of the other`, [`C-1 of glucose to C-2 of fructose`, `C-1 to C-1 of two glucose rings`, `C-1 of &beta;-galactose to C-4 of glucose`], `<p>An &alpha;(1&rarr;4) link, leaving one anomeric carbon free, so X reduces Tollens' reagent.</p>`),
  P(4, 'disaccharides', 'p1', `Complete hydrolysis of 342 g of X gives glucose of mass`, `360 g`, [`180 g`, `342 g`, `171 g`], `<p>X is C<sub>12</sub>H<sub>22</sub>O<sub>11</sub> (342 g/mol), so 342 g is 1 mol, which gives 2 mol of glucose = 2 &times; 180 = 360 g. The extra 18 g is the water added.</p>`, `Hydrolysis adds a mole of water.`),
  P(3, 'peptide sequence', 'p2', `The sequence of the tripeptide is`, `Gly&ndash;Ala&ndash;Phe`, [`Phe&ndash;Ala&ndash;Gly`, `Ala&ndash;Gly&ndash;Phe`, `Gly&ndash;Phe&ndash;Ala`], `<p>Sanger's reagent labels the N-terminal (Gly), and carboxypeptidase removes the C-terminal (Phe) first. The middle must be Ala.</p>`),
  PN(4, 'peptide sequence', 'p2', `Find the molar mass of the tripeptide, in g/mol.`, 293, 0, 'g/mol', `<p>Sum = 75 + 89 + 165 = 329. Two peptide bonds lose two water molecules, 36.</p><p>Mass = 329 &minus; 36 = <b>293</b>.</p>`, undefined, () => 75 + 89 + 165 - 36),
  P(3, 'amino acid in solution', 'p3', `The isoelectric point of the amino acid is`, `5.8`, [`2.2`, `9.4`, `11.6`], `<p>pI = (2.2 + 9.4)/2 = 5.8.</p>`),
  P(4, 'amino acid in solution', 'p3', `In an electric field at pH 2.0 this amino acid mainly`, `moves towards the cathode as H<sub>3</sub>N<sup>+</sup>&ndash;CHR&ndash;COOH`, [`moves towards the anode as H<sub>2</sub>N&ndash;CHR&ndash;COO<sup>&minus;</sup>`, `does not move`, `moves towards the anode as a zwitterion`], `<p>pH 2.0 is below pK<sub>a1</sub> = 2.2 and far below the pI, so the amino acid takes up H<sup>+</sup> and carries a net positive charge.</p>`),
  P(4, 'amino acid in solution', 'p3', `At pH 9.4, the ratio of the anionic form to the zwitterion is`, `1 : 1`, [`10 : 1`, `1 : 10`, `100 : 1`], `<p>At pH = pK<sub>a2</sub>, half of the zwitterion has lost its proton: [A<sup>&minus;</sup>] = [zwitterion] by the Henderson&ndash;Hasselbalch equation.</p>`),
];

const H5B = [
  mk(5, 'osazones', `Which set of sugars gives the same osazone with excess phenylhydrazine?`, `D-glucose, D-mannose and D-fructose`, [`D-glucose, D-galactose and D-fructose`, `D-glucose and sucrose`, `D-glucose and L-glucose and D-galactose`], `<p>An osazone keeps the configuration of C-3 to C-6 only. Glucose, mannose (C-2 epimer of glucose) and fructose have the same C-3 to C-5 configuration, so they give the same osazone. Galactose differs at C-4 and gives a different one. Sucrose does not react.</p>`, `The osazone ignores C-1 and C-2.`),
  nat(5, 'optical activity', `34.2 g of sucrose is hydrolysed completely and made up to 100 mL. Find the observed rotation in a 1 dm tube, in degrees, using [&alpha;] = +52.5&deg; for glucose and &minus;92.4&deg; for fructose (sucrose = 342, glucose = fructose = 180).`, -7.18, 0.05, '&deg;', `<p>34.2 g is 0.1 mol, so there is 0.1 mol (18 g) each of glucose and fructose in 100 mL: c = 0.18 g/mL each.</p><p>&alpha; = 52.5 &times; 1 &times; 0.18 + (&minus;92.4) &times; 1 &times; 0.18 = 9.45 &minus; 16.63 = <b>&minus;7.18&deg;</b>.</p>`, `Add the rotations of the two sugars, with their signs.`, () => 52.5 * 0.18 - 92.4 * 0.18),
  nat(5, 'charge of amino acids', `Lysine has pK<sub>a</sub> values 2.18, 8.95 and 10.53. What is the net charge of the main species at pH 1.0? (give the charge as an integer, with sign)`, 2, 0, '', `<p>pH 1.0 is below all three pK<sub>a</sub> values, so every group stays protonated: &ndash;COOH (0), &alpha;-NH<sub>3</sub><sup>+</sup> (+1), side chain NH<sub>3</sub><sup>+</sup> (+1).</p><p>Net charge = <b>+2</b>.</p>`, `Count the charge of each group.`, () => 0 + 1 + 1),
  nat(5, 'charge of amino acids', `Aspartic acid has pK<sub>a</sub> values 1.99 (&alpha;-COOH), 3.90 (side chain COOH) and 9.90 (&alpha;-NH<sub>3</sub><sup>+</sup>). What is the net charge of its main species at pH 7.0 (give the integer, with sign)?`, -1, 0, '', `<p>At pH 7.0, both COOH groups (pK<sub>a</sub> 1.99 and 3.90) have lost H<sup>+</sup>: charge &minus;2. The NH<sub>3</sub><sup>+</sup> group (pK<sub>a</sub> 9.90) is still protonated: +1.</p><p>Net charge = <b>&minus;1</b>.</p>`, undefined, () => -2 + 1),
  nat(5, 'peptides', `A cyclic peptide has 8 amino acid residues. How many water molecules are needed for its complete hydrolysis to free amino acids?`, 8, 0, '', `<p>A cyclic peptide has as many peptide bonds as residues (no free ends): 8. Each bond needs one water.</p><p>Water = <b>8</b>.</p>`, `A linear chain of 8 has only 7 bonds.`, () => 8),
  mk(5, 'glucose structure', `Glucose pentaacetate does not react with hydroxylamine. This is evidence that`, `the &ndash;CHO group is not free in the ring (cyclic hemiacetal) structure`, [`the molecule has no &ndash;OH groups`, `glucose is a ketose`, `the five acetyl groups are on carbon`], `<p>Hydroxylamine would form an oxime if a free aldehyde were present. In the acetylated ring the anomeric carbon has become an acetal-type carbon (O&ndash;Ac), so no free carbonyl is left.</p>`, `The acetyl groups sit on oxygen, including the ring-closing OH.`),
  nat(5, 'DNA', `A DNA molecule is 3.4 &mu;m long (0.34 nm per base pair). How many base pairs does it have?`, 10000, 0, '', `<p>3.4 &mu;m = 3400 nm. Base pairs = 3400/0.34 = <b>10000</b>.</p>`, `1 micrometre = 1000 nm.`, () => 3400 / 0.34),
  msq(5, 'proteins', `Which statements about amino acids and proteins are correct?`, [`Amino acids with a basic side chain have a pI above 7`, `A protein loses its secondary and tertiary structure when denatured`, `A zwitterion has equal positive and negative charges`, `The primary structure is lost on denaturation by heat`], [0, 1, 2], `<p>Heating breaks the weak forces, not the covalent peptide backbone. The primary structure remains.</p>`, `Denaturation does not hydrolyse peptide bonds.`),
  nat(5, 'enzyme kinetics', `For an enzyme following Michaelis&ndash;Menten kinetics, V<sub>max</sub> = 80 &mu;mol/min and K<sub>m</sub> = 2 mM. Find the rate at [S] = 6 mM, in &mu;mol/min, from v = V<sub>max</sub>[S]/(K<sub>m</sub> + [S]).`, 60, 0, '&mu;mol/min', `<p>v = 80 &times; 6/(2 + 6) = 480/8 = <b>60 &mu;mol/min</b>. At [S] = K<sub>m</sub> the rate would be half of V<sub>max</sub>, 40.</p>`, undefined, () => 80 * 6 / (2 + 6)),
  nat(3, 'lactose', `3.42 g of lactose (342 g/mol) is hydrolysed completely. Find the total mass of sugars (galactose plus glucose) formed, in g.`, 3.6, 0.02, 'g', `<p>3.42 g = 0.01 mol. Each mole gives one galactose and one glucose (180 g/mol each): 0.01 &times; 360 = <b>3.6 g</b>. The extra 0.18 g is the water used.</p>`, undefined, () => 0.01 * 360),
];

const FIXED = [...H1, ...H5B, ...H2, ...H3, ...H4, ...H5, ...NAT, ...MSQ, ...ASR, ...STM, ...MATCH, ...PASSAGES];

// ---------------- templates ----------------
const VIT = [['A', 'night blindness'], ['B<sub>1</sub>', 'beriberi'], ['B<sub>2</sub>', 'cracked lips and mouth sores (cheilosis)'], ['B<sub>12</sub>', 'pernicious anaemia'], ['C', 'scurvy'], ['D', 'rickets'], ['K', 'delayed blood clotting'], ['E', 'fragile red blood cells']];
const DIS = VIT.map((v) => v[1]);
const DSAC = [['sucrose', 'glucose and fructose', 'non-reducing'], ['maltose', 'two glucose units', 'reducing'], ['lactose', 'galactose and glucose', 'reducing']];
const DSAC_ALL = ['glucose and fructose', 'two glucose units', 'galactose and glucose', 'two fructose units'];
const HORM = [['insulin', 'lowers blood glucose'], ['glucagon', 'raises blood glucose'], ['thyroxine', 'controls metabolic rate; lack of iodine causes goitre'], ['adrenaline', 'prepares the body for fight or flight'], ['testosterone', 'male secondary sexual characters']];
const HORM_ALL = HORM.map((h) => h[1]);
const AAS = [['glycine', 'Gly', 75, 2.34, 9.60], ['alanine', 'Ala', 89, 2.34, 9.69], ['valine', 'Val', 117, 2.32, 9.62], ['serine', 'Ser', 105, 2.21, 9.15], ['phenylalanine', 'Phe', 165, 1.83, 9.13], ['leucine', 'Leu', 131, 2.36, 9.60]];
const SUGARS = [['aldotriose', 3, 'a'], ['aldotetrose', 4, 'a'], ['aldopentose', 5, 'a'], ['aldohexose', 6, 'a'], ['ketotetrose', 4, 'k'], ['ketopentose', 5, 'k'], ['ketohexose', 6, 'k']];
const NUC = [['adenine', 'purine'], ['guanine', 'purine'], ['cytosine', 'pyrimidine'], ['thymine', 'pyrimidine'], ['uracil', 'pyrimidine']];

const GENS = [
  gx('bi-g01', 3, 'nat', 'isoelectric point', (rng) => {
    const [nm, , , a, b] = choose(rng, AAS); const pI = (a + b) / 2;
    return { q: `${nm[0].toUpperCase() + nm.slice(1)} has pK<sub>a1</sub> = ${a} and pK<sub>a2</sub> = ${b}. Find its isoelectric point.`, answer: +pI.toFixed(3), tol: 0.01, a, b,
      sol: `<p>Neutral side chain: pI = (pK<sub>a1</sub> + pK<sub>a2</sub>)/2 = (${a} + ${b})/2 = <b>${pI.toFixed(2)}</b>.</p>`, trap: 'Average the two pKa values on either side of the zwitterion.' };
  }, (p) => (p.a + p.b) / 2),
  gx('bi-g02', 4, 'nat', 'isoelectric point of acidic and basic amino acids', (rng) => {
    const acid = rng() < 0.5; const x = pick(rng, 18, 22, 1) / 10, y = acid ? pick(rng, 36, 44, 1) / 10 : pick(rng, 88, 92, 1) / 10, z = acid ? pick(rng, 95, 101, 1) / 10 : pick(rng, 104, 108, 1) / 10; const pI = acid ? (x + y) / 2 : (y + z) / 2;
    return { q: `An ${acid ? 'acidic' : 'basic'} amino acid has pK<sub>a</sub> values ${x}, ${y} and ${z}. Find its isoelectric point.`, answer: +pI.toFixed(3), tol: 0.01, x, y, z, acid,
      sol: `<p>${acid ? 'For an acidic amino acid the neutral form lies between the first two dissociations, so pI = (pK<sub>a1</sub> + pK<sub>a2</sub>)/2' : 'For a basic amino acid the neutral form lies between the last two, so pI = (pK<sub>a2</sub> + pK<sub>a3</sub>)/2'} = (${acid ? x : y} + ${acid ? y : z})/2 = <b>${pI.toFixed(2)}</b>.</p>`, trap: 'Choose the two pKa values that surround the neutral form.' };
  }, (p) => (p.acid ? p.x + p.y : p.y + p.z) / 2),
  gx('bi-g03', 3, 'nat', 'peptide molar mass', (rng) => {
    const n = int(rng, 2, 4); const ch = []; for (let i = 0; i < n; i++) ch.push(choose(rng, AAS)); const sum = ch.reduce((s, c) => s + c[2], 0); const M = sum - 18 * (n - 1);
    return { q: `Find the molar mass of the peptide ${ch.map((c) => c[1]).join('&ndash;')} (amino acid masses: Gly 75, Ala 89, Val 117, Ser 105, Phe 165, Leu 131; water 18).`, answer: M, tol: 0, unit: 'g/mol', sum, n,
      sol: `<p>Sum of the free amino acids = ${ch.map((c) => c[2]).join(' + ')} = ${sum}. There are ${n - 1} peptide bond${n > 2 ? 's' : ''}, each losing a water of 18.</p><p>Mass = ${sum} &minus; ${18 * (n - 1)} = <b>${M}</b>.</p>`, trap: 'Subtract one water per peptide bond (n minus 1).' };
  }, (p) => p.sum - 18 * (p.n - 1)),
  gx('bi-g04', 3, 'nat', 'number of peptides', (rng) => {
    const k = int(rng, 2, 6), n = int(rng, 2, 4); const rep = rng() < 0.5; let a = 1; if (rep) a = k ** n; else { if (k < n) return { ...REP(k, n, true) }; for (let i = 0; i < n; i++) a *= (k - i); }
    return rep ? { q: `How many different ${n}-residue peptides are possible from ${k} different amino acids if each can be used any number of times?`, answer: k ** n, tol: 0, k, n, rep, sol: `<p>${n} positions, ${k} choices each: ${k}<sup>${n}</sup> = <b>${k ** n}</b>.</p>` }
      : { q: `How many different ${n}-residue peptides are possible by using ${n} of ${k} different amino acids, with no amino acid repeated?`, answer: a, tol: 0, k, n, rep, sol: `<p>Order matters: ${Array.from({ length: n }, (_, i) => k - i).join(' &times; ')} = <b>${a}</b>.</p>` };
  }, (p) => { if (p.rep) return p.k ** p.n; let a = 1; for (let i = 0; i < p.n; i++) a *= (p.k - i); return a; }),
  gx('bi-g05', 3, 'nat', 'invert sugar', (rng) => {
    const g = pick(rng, 50, 56, 0.5), f = pick(rng, -94, -88, 0.5); const a = (g + f) / 2;
    return { q: `Sucrose is hydrolysed completely to an equimolar mixture of glucose ([&alpha;] = +${g}&deg;) and fructose ([&alpha;] = ${f}&deg;). Find the specific rotation of the mixture (equal molar masses), in degrees.`, answer: +a.toFixed(2), tol: 0.05, g, f, unit: '&deg;',
      sol: `<p>Equal moles (and equal masses) mean a simple average: (${g} + (${f}))/2 = <b>${a.toFixed(2)}&deg;</b>. The sign is now negative, so the sugar is levorotatory: inversion.</p>` };
  }, (p) => (p.g + p.f) / 2),
  gx('bi-g06', 4, 'nat', 'mutarotation', (rng) => {
    const a = pick(rng, 110, 114, 1), b = pick(rng, 17, 21, 1), x = pick(rng, 25, 45, 5) / 100; const eq = a * x + b * (1 - x);
    return { q: `The pure &alpha;-anomer of a sugar has [&alpha;] = +${a}&deg; and the &beta;-anomer +${b}&deg;. At equilibrium the solution has [&alpha;] = +${eq.toFixed(2)}&deg;. Find the percentage of the &alpha;-anomer (ignore the open chain).`, answer: +(x * 100).toFixed(1), tol: 0.2, unit: '%', a, b, eq,
      sol: `<p>Let the &alpha; fraction be x: ${a}x + ${b}(1 &minus; x) = ${eq.toFixed(2)}.</p><p>x = (${eq.toFixed(2)} &minus; ${b})/(${a} &minus; ${b}) = ${((eq - b) / (a - b)).toFixed(3)}, or <b>${(x * 100).toFixed(1)} %</b>.</p>`, trap: 'Weighted average of the two rotations.' };
  }, (p) => (p.eq - p.b) / (p.a - p.b) * 100),
  gx('bi-g07', 3, 'nat', 'hydrolysis of starch', (rng) => {
    const w = pick(rng, 81, 405, 81), y = pick(rng, 60, 100, 10); const m = w / 162 * 180 * y / 100;
    return { q: `${w} g of starch is hydrolysed completely to glucose with a yield of ${y}%. Find the mass of glucose in grams (repeat unit C<sub>6</sub>H<sub>10</sub>O<sub>5</sub> = 162; glucose = 180).`, answer: +m.toFixed(2), tol: Math.max(0.05, m * 0.005), unit: 'g', w, y,
      sol: `<p>Each 162 g of starch units gives 180 g of glucose, with the water added. ${w}/162 = ${w / 162} mol of units, giving ${fmt(w / 162 * 180, 4)} g.</p><p>At ${y}% yield: <b>${m.toFixed(2)} g</b>.</p>`, trap: 'The mass of glucose is greater than the mass of starch.' };
  }, (p) => p.w * 180 / 162 * p.y / 100),
  gx('bi-g08', 3, 'nat', 'Tollens test on aldose', (rng) => {
    const n = pick(rng, 1, 9, 1) / 10; const w = n * 180; const ag = n * 2 * 108;
    return { q: `${w} g of glucose is warmed with excess Tollens' reagent. Find the mass of silver deposited in grams (glucose = 180; Ag = 108).`, answer: +ag.toFixed(1), tol: 0.2, unit: 'g', n,
      sol: `<p>Moles of glucose = ${w}/180 = ${n}. Each aldehyde gives 2 Ag (2 electrons), so Ag = ${(2 * n).toFixed(1)} mol.</p><p>Mass = ${(2 * n).toFixed(1)} &times; 108 = <b>${ag.toFixed(1)} g</b>.</p>` };
  }, (p) => p.n * 216),
  gx('bi-g09', 3, 'nat', 'DNA base composition', (rng) => {
    const a = pick(rng, 16, 34, 2); const known = rng() < 0.5; const gc = 100 - 2 * a;
    return known ? { q: `A double-stranded DNA has ${a}% adenine. Find the percentage of guanine.`, answer: gc / 2, tol: 0, unit: '%', a, k: 1, sol: `<p>T = A = ${a}%, so A + T = ${2 * a}%. G + C = ${gc}% and G = C = <b>${gc / 2} %</b>.</p>` }
      : { q: `A double-stranded DNA has ${a}% adenine. Find the percentage of purine bases (A + G).`, answer: 50, tol: 0, unit: '%', a, k: 0, sol: `<p>In double-stranded DNA, A = T and G = C, so A + G = T + C. Purines are always <b>50 %</b>.</p>`, trap: 'Chargaff: purines equal pyrimidines.' };
  }, (p) => (p.k ? (100 - 2 * p.a) / 2 : 50)),
  gx('bi-g10', 3, 'nat', 'DNA hydrogen bonds', (rng) => {
    const at = int(rng, 5, 40), gc = int(rng, 5, 40); const h = 2 * at + 3 * gc;
    return { q: `A DNA fragment has ${at} A&ndash;T pairs and ${gc} G&ndash;C pairs. How many hydrogen bonds hold the two strands together?`, answer: h, tol: 0, at, gc,
      sol: `<p>A&ndash;T has 2 bonds and G&ndash;C has 3: ${at} &times; 2 + ${gc} &times; 3 = ${2 * at} + ${3 * gc} = <b>${h}</b>.</p>` };
  }, (p) => 2 * p.at + 3 * p.gc),
  gx('bi-g11', 3, 'nat', 'DNA length', (rng) => {
    const n = pick(rng, 100, 2000, 100); const L = n * 0.34;
    return { q: `A DNA double helix has ${n} base pairs. Taking 0.34 nm per base pair and 10 base pairs per turn, find the length of the helix in nm.`, answer: +L.toFixed(1), tol: 0.1, unit: 'nm', n,
      sol: `<p>Length = ${n} &times; 0.34 = <b>${L.toFixed(1)} nm</b>, which is ${n / 10} turns of 3.4 nm each.</p>`, trap: 'Count base pairs, not nucleotides.' };
  }, (p) => p.n * 3.4 / 10),
  gx('bi-g12', 2, 'nat', 'stereoisomers of sugars', (rng) => {
    const [nm, c, t] = choose(rng, SUGARS); const ch = t === 'a' ? c - 2 : c - 3; const iso = 2 ** ch; const ask = rng() < 0.5;
    return { q: ask ? `How many chiral carbon atoms does an open-chain ${nm} (${c} carbons) have?` : `How many stereoisomers does an open-chain ${nm} (${c} carbons) have?`, answer: ask ? ch : iso, tol: 0, c, t, ask,
      sol: `<p>${t === 'a' ? 'An aldose has a CHO end and a CH<sub>2</sub>OH end, so n &minus; 2 chiral carbons.' : 'A ketose has the C=O in position 2, with CH<sub>2</sub>OH at both ends, so n &minus; 3 chiral carbons.'} Here ${c} &minus; ${t === 'a' ? 2 : 3} = ${ch}.</p><p>${ask ? `Answer: <b>${ch}</b>.` : `Stereoisomers = 2<sup>${ch}</sup> = <b>${iso}</b>.`}</p>` };
  }, (p) => { const ch = p.t === 'a' ? p.c - 2 : p.c - 3; return p.ask ? ch : 2 ** ch; }),
  gx('bi-g13', 1, 'mcq', 'vitamin deficiency', (rng) => {
    const [v, d] = choose(rng, VIT); const ws = DIS.filter((x) => x !== d).sort(() => rng() - 0.5).slice(0, 3); const { options, answer } = shuffleOpts(rng, d, ws);
    return { q: `Deficiency of vitamin ${v} causes`, options, answer, d, sol: `<p>Vitamin ${v}: <b>${d}</b>.</p>`, trap: 'Learn each vitamin with its disease and its solubility.' };
  }, (p) => p.options.indexOf(p.d)),
  gx('bi-g14', 2, 'mcq', 'disaccharides', (rng) => {
    const [nm, u, r] = choose(rng, DSAC); const ws = DSAC_ALL.filter((x) => x !== u); const { options, answer } = shuffleOpts(rng, u, ws);
    return { q: `On hydrolysis, ${nm} (a ${r} sugar) gives`, options, answer, u, sol: `<p>${nm[0].toUpperCase() + nm.slice(1)} gives <b>${u}</b>.</p>`, trap: 'Sucrose is the only non-reducing one of the three.' };
  }, (p) => p.options.indexOf(p.u)),
  gx('bi-g15', 2, 'mcq', 'hormones', (rng) => {
    const [h, f] = choose(rng, HORM); const ws = HORM_ALL.filter((x) => x !== f).slice(0, 3); const { options, answer } = shuffleOpts(rng, f, ws);
    return { q: `The main function of ${h} is to`, options, answer, f, sol: `<p>${h[0].toUpperCase() + h.slice(1)}: <b>${f}</b>.</p>` };
  }, (p) => p.options.indexOf(p.f)),
  gx('bi-g16', 1, 'mcq', 'purines and pyrimidines', (rng) => {
    const [b, c] = choose(rng, NUC); const other = c === 'purine' ? 'pyrimidine' : 'purine'; const { options, answer } = shuffleOpts(rng, c, [other, 'a pentose sugar', 'an amino acid']);
    return { q: `${b[0].toUpperCase() + b.slice(1)} is`, options, answer, c, sol: `<p>${b[0].toUpperCase() + b.slice(1)} is a <b>${c}</b>. Adenine and guanine are purines (two rings); cytosine, thymine and uracil are pyrimidines (one ring).</p>` };
  }, (p) => p.options.indexOf(p.c)),
  gx('bi-g17', 4, 'nat', 'specific rotation', (rng) => {
    const al = pick(rng, 1, 8, 0.5), l = pick(rng, 1, 2, 0.5), c = pick(rng, 5, 20, 5) / 100; const s = al / (l * c);
    return { q: `A solution of ${Math.round(c * 100)} g of a sugar in 100 mL, in a ${l} dm tube, rotates plane-polarised light by ${al}&deg;. Find the specific rotation in degrees (c in g/mL).`, answer: +s.toFixed(1), tol: Math.max(0.1, s * 0.005), unit: '&deg;', al, l, c,
      sol: `<p>[&alpha;] = &alpha;/(l &times; c) = ${al}/(${l} &times; ${c}) = <b>${s.toFixed(1)}&deg;</b>.</p>`, trap: 'c is in g/mL, and l in dm.' };
  }, (p) => p.al / (p.l * p.c)),
];
function REP(k, n) { const a = k ** n; return { q: `How many different ${n}-residue peptides are possible from ${k} different amino acids if each can be used any number of times?`, answer: a, tol: 0, k, n, rep: true, sol: `<p>${n} positions, ${k} choices each: ${k}<sup>${n}</sup> = <b>${a}</b>.</p>` }; }

export default {
  topic: 'biomolecules',
  groups: GRP,
  items: FIXED,
  gens: GENS,
};
