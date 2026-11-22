import { pick, int, choose, fmt, shuffleOpts, numOpts, g } from '../_entrance.js';

const items = [];
const groups = {};
let n = 0, pos = 0;
const POS = [2, 0, 3, 1];
const PFX = 'bm';
const nid = () => `${PFX}-${String(++n).padStart(3, '0')}`;
const ex = () => ['neet'];
const AR = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const ST = ['Both Statement I and Statement II are correct', 'Both Statement I and Statement II are incorrect', 'Statement I is correct but Statement II is incorrect', 'Statement I is incorrect but Statement II is correct'];
function mc(level, sub, q, correct, wrongs, sol, trap, format = 'single') {
  const p = POS[pos++ % 4];
  const options = [...wrongs];
  options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format, exams: ex(level), sub, q, options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function ms(level, sub, q, options, answer, sol, trap) {
  items.push({ id: nid(), type: 'msq', level, format: 'multi', exams: ex(level), sub, q, options, answer, sol, ...(trap ? { trap } : {}) });
}
function asr(level, sub, A, R, ans, sol, trap) {
  items.push({ id: nid(), type: 'mcq', level, format: 'assertion', exams: ex(level), sub, q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AR, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function stm(level, sub, s1, s2, ans, sol, trap) {
  items.push({ id: nid(), type: 'mcq', level, format: 'statements', exams: ex(level), sub, q: `<b>Statement I:</b> ${s1}<br><b>Statement II:</b> ${s2}`, options: ST, answer: ans, sol, ...(trap ? { trap } : {}) });
}
function match(level, sub, key, title, list1, list2, correct, wrongs, sol, trap) {
  groups[key] = { title, list1, list2 };
  const p = POS[pos++ % 4];
  const options = [...wrongs]; options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format: 'match', exams: ex(level), sub, group: key, q: 'Match List I with List II and choose the correct code.', options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function pass(key, title, passage) { groups[key] = { title, passage }; }
function pq(key, level, sub, q, correct, wrongs, sol, trap) {
  const p = POS[pos++ % 4];
  const options = [...wrongs];
  options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format: 'passage', exams: ex(level), sub, group: key, q, options, answer: p, sol, ...(trap ? { trap } : {}) });
}
function nat(level, sub, q, answer, sol, unit, trap, tol = 0) {
  items.push({ id: nid(), type: 'nat', level, format: tol ? 'numeric' : 'integer', exams: ex(level), sub, q, answer, tol, ...(unit ? { unit } : {}), sol, ...(trap ? { trap } : {}) });
}

// ---------------------------------------------------------------- Level 1
mc(1, 'chemical composition', 'A living tissue is ground in cold trichloroacetic acid and strained through a cheesecloth. The liquid that passes through is called the', 'acid-soluble pool', ['acid-insoluble pool', 'retentate', 'ash fraction'], 'The strained liquid (filtrate) holds small molecules such as amino acids, sugars and nucleotides. This is the acid-soluble pool. What stays on the cloth is the acid-insoluble fraction (retentate).');
mc(1, 'proteins', 'How many different amino acids are commonly found in proteins?', '20', ['10', '12', '64'], 'Proteins are built from 20 types of amino acids. The number 64 is the count of codons, not amino acids.');
mc(1, 'proteins', 'The bond that joins two amino acids in a protein is the', 'peptide bond', ['glycosidic bond', 'phosphodiester bond', 'ester bond'], 'The carboxyl group of one amino acid joins the amino group of the next, with loss of a water molecule. This C-N link is the peptide bond.');
mc(1, 'polysaccharides', 'The monomer unit of starch is', 'glucose', ['fructose', 'ribose', 'N-acetyl glucosamine'], 'Starch is a long chain of glucose units joined by glycosidic bonds.');
mc(1, 'polysaccharides', 'Cotton fibre and paper are made mainly of', 'cellulose', ['starch', 'glycogen', 'chitin'], 'Plant cell walls are rich in cellulose, a polymer of glucose. Cotton is almost pure cellulose, and paper is made from plant pulp.');
mc(1, 'nucleic acids', 'The sugar found in DNA is', 'deoxyribose', ['ribose', 'glucose', 'fructose'], 'DNA has 2\'-deoxyribose, which lacks the oxygen on carbon 2. RNA has ribose.');
mc(1, 'nucleic acids', 'The nitrogen base that is present in RNA but not in DNA is', 'uracil', ['thymine', 'cytosine', 'guanine'], 'RNA has A, G, C and U. DNA has A, G, C and T. Uracil replaces thymine in RNA.');
mc(1, 'enzymes', 'Most enzymes are', 'proteins', ['carbohydrates', 'lipids', 'nucleotides only'], 'Nearly all enzymes are proteins. Some RNA molecules (ribozymes) also act as catalysts, but they are the exception.');
mc(1, 'enzymes', 'The part of an enzyme to which the substrate binds is the', 'active site', ['allosteric dock', 'cofactor', 'apoenzyme'], 'The active site is a crevice or pocket made by the folding of the protein chain. The substrate fits here and is changed into the product.');
mc(1, 'polysaccharides', 'The main storage polysaccharide of animals is', 'glycogen', ['starch', 'inulin', 'cellulose'], 'Animals store glucose as glycogen in liver and muscle. Plants store it as starch.');
mc(1, 'proteins', 'The most abundant protein in the animal world is', 'collagen', ['RuBisCO', 'insulin', 'haemoglobin'], 'Collagen forms the intercellular ground substance of connective tissue and is the most abundant animal protein. RuBisCO is the most abundant protein in the whole biosphere.', 'Do not mix up "animal world" and "whole biosphere".');
mc(1, 'proteins', 'The most abundant protein in the whole biosphere is', 'RuBisCO', ['collagen', 'actin', 'keratin'], 'RuBisCO, the enzyme that fixes carbon dioxide in the Calvin cycle, is present in huge amounts in all green plants and is the most abundant protein on Earth.');
mc(1, 'nucleic acids', 'A nitrogen base linked to a pentose sugar is called a', 'nucleoside', ['nucleotide', 'nucleosome', 'nucleolus'], 'Base + sugar = nucleoside (for example, adenosine). Base + sugar + phosphate = nucleotide (for example, adenylic acid).');
mc(1, 'enzymes', 'Enzymes that join two molecules using energy from ATP belong to the class', 'ligases', ['lyases', 'hydrolases', 'transferases'], 'Ligases (class 6) form bonds such as C-O, C-S and C-N between molecules, and they need ATP.');
mc(1, 'lipids', 'Fats and oils are made by combining fatty acids with', 'glycerol', ['glucose', 'amino acids', 'ribose'], 'A glyceride is glycerol esterified with one, two or three fatty acids. Triglycerides are the common fats and oils.');

// ---------------------------------------------------------------- Level 2
mc(2, 'metabolites', 'Which one of these is a secondary metabolite?', 'Morphine', ['Glucose', 'Alanine', 'Adenine'], 'Morphine is an alkaloid. Alkaloids, flavonoids, rubber, essential oils, antibiotics, pigments, gums and spices are secondary metabolites. Glucose, alanine and adenine are primary metabolites with known roles in growth.');
mc(2, 'polysaccharides', 'Inulin is a polymer of', 'fructose', ['glucose', 'galactose', 'ribose'], 'Inulin is a fructose polymer. It is a plant storage polysaccharide found in the roots of dahlia and chicory.');
mc(2, 'polysaccharides', 'Chitin, which is a complex polysaccharide, is found in', 'exoskeleton of arthropods', ['plant cell wall', 'liver of mammals', 'bacterial capsule only'], 'Chitin is a polymer of N-acetyl glucosamine, an amino-sugar. It forms the exoskeleton of arthropods (and also the fungal cell wall). Plant cell walls have cellulose.');
nat(2, 'proteins', 'A linear polypeptide is made of 51 amino acids. How many peptide bonds does it contain?', 50, 'Idea: a linear chain of n amino acids has n - 1 peptide bonds. For n = 51, the number is 51 - 1 = 50.', '', 'A ring-shaped (cyclic) peptide of n units would have n bonds, but proteins are linear.');
mc(2, 'enzymes', 'Coenzymes are mostly derived from', 'vitamins', ['steroids', 'fatty acids', 'nucleic acids'], 'Many coenzymes are made from vitamins. NAD and NADP contain niacin, a B vitamin. Thiamine, riboflavin and others also give coenzymes.');
mc(2, 'enzymes', 'Zinc is a cofactor required for the activity of', 'carboxypeptidase', ['catalase', 'peroxidase', 'succinic dehydrogenase'], 'Carboxypeptidase needs Zn<sup>2+</sup>. This is a metal ion cofactor. Catalase and peroxidase have haem (a prosthetic group).');
mc(2, 'enzymes', 'Haem is the prosthetic group of the enzyme', 'catalase', ['carboxypeptidase', 'amylase', 'trypsin'], 'Haem is tightly bound to peroxidase and catalase. A prosthetic group is a cofactor attached firmly to the apoenzyme.');
mc(2, 'enzymes', 'Which class of enzymes breaks bonds by adding water?', 'Hydrolases', ['Lyases', 'Isomerases', 'Transferases'], 'Hydrolases (class 3) cleave ester, glycosidic and peptide bonds using water. Lyases break bonds by other means and leave double bonds.');
mc(2, 'enzymes', 'Enzymes that remove groups from substrates by means other than hydrolysis, leaving double bonds, are', 'lyases', ['hydrolases', 'ligases', 'oxidoreductases'], 'Lyases (class 4) cleave C-C, C-O and C-N bonds without water, forming double bonds. Example: a decarboxylase.');
mc(2, 'enzymes', 'Interconversion of optical, geometric or positional isomers is catalysed by', 'isomerases', ['transferases', 'lyases', 'ligases'], 'Isomerases (class 5) rearrange atoms inside a molecule, for example glucose-6-phosphate to fructose-6-phosphate.');
mc(2, 'enzymes', 'Dehydrogenases belong to the class', 'oxidoreductases', ['transferases', 'hydrolases', 'lyases'], 'Oxidoreductases (class 1) catalyse oxidation-reduction between two substrates, S reduced + S\' oxidised. Dehydrogenases are a typical example.');
mc(2, 'enzymes', 'An enzyme that moves a group other than hydrogen from one substrate to another is a', 'transferase', ['hydrolase', 'isomerase', 'oxidoreductase'], 'Transferases (class 2) transfer a group G (not hydrogen) between substrates, e.g. a transaminase moves an amino group.');
mc(2, 'lipids', 'Palmitic acid has how many carbon atoms including the carboxyl carbon?', '16', ['14', '18', '20'], 'Palmitic acid is a saturated fatty acid with 16 carbons: the COOH carbon plus a 15-carbon chain.');
mc(2, 'lipids', 'Arachidonic acid is a fatty acid with how many carbon atoms?', '20', ['16', '18', '22'], 'Arachidonic acid has 20 carbon atoms, including the carboxyl carbon.');
mc(2, 'lipids', 'Lecithin is an example of a', 'phospholipid', ['glycolipid', 'steroid', 'wax'], 'Phospholipids have a phosphate group and an organic base (choline in lecithin) in addition to fatty acids. They are important in cell membranes.');
mc(2, 'enzymes', 'Malonate stops the working of succinic dehydrogenase because it', 'resembles succinate and competes for the active site', ['denatures the enzyme', 'removes the cofactor permanently', 'binds to the product'], 'Malonate looks like the substrate succinate, so it binds the active site and blocks it. This is competitive inhibition and can be reversed by adding more substrate.');
mc(2, 'enzymes', 'At very low temperature, enzymes are', 'temporarily inactive but not destroyed', ['permanently denatured', 'broken into amino acids', 'working at maximum rate'], 'Low temperature slows molecules and the enzyme is inactive, but its structure is not lost, so it recovers on warming. High temperature denatures it.');
mc(2, 'enzymes', 'The Michaelis constant K<sub>m</sub> is the', 'substrate concentration at which the reaction velocity is half of V<sub>max</sub>', ['enzyme concentration at which velocity is maximum', 'velocity at saturating substrate', 'concentration of inhibitor that stops the reaction'], 'K<sub>m</sub> is read from the velocity curve: find V<sub>max</sub>/2 and read the substrate concentration. A low K<sub>m</sub> means high affinity of the enzyme for its substrate.');
mc(2, 'proteins', 'The right-handed coil with 3.6 amino acids per turn is a feature of the', 'secondary structure of proteins', ['primary structure of proteins', 'tertiary structure of proteins', 'DNA double helix'], 'The alpha-helix is a secondary structure, held by hydrogen bonds. Primary structure is only the amino acid sequence.');
mc(2, 'proteins', 'Adult human haemoglobin has', 'four polypeptide subunits, two alpha and two beta', ['two polypeptide subunits', 'four identical subunits', 'a single folded chain'], 'Haemoglobin shows quaternary structure: 2 &alpha; + 2 &beta; chains, each with a haem group.');
mc(2, 'chemical composition', 'Lipids appear in the acid-insoluble fraction of tissue extract mainly because', 'cell membranes break into vesicles that do not dissolve', ['they are very large polymers', 'they are proteins', 'they contain nucleic acids'], 'Lipids are not true macromolecules (their masses are below 1000 Da). Membrane fragments form insoluble vesicles during grinding, so they are found in the acid-insoluble fraction.', 'Students often say "lipids are macromolecules". They are not strictly so.');
mc(2, 'polysaccharides', 'A starch solution turns blue-black with iodine because', 'iodine gets held inside the helical coils of starch', ['iodine reacts with glycosidic bonds', 'starch is a protein', 'iodine oxidises glucose'], 'Starch forms helical secondary structures that trap I<sub>2</sub> molecules, giving a blue colour. Cellulose has no complex helices, so it gives no blue colour.');
mc(2, 'nucleic acids', 'Hydrogen bonds between guanine and cytosine number', 'three', ['two', 'one', 'four'], 'G pairs with C by three hydrogen bonds; A pairs with T by two.');
mc(2, 'metabolism', 'Conversion of glucose into lactic acid in a skeletal muscle in ten steps is an example of', 'catabolism', ['anabolism', 'transcription', 'photosynthesis'], 'Glycolysis-type breakdown of glucose to lactic acid releases energy, so it is a catabolic pathway. Anabolic pathways build molecules and use energy.');

// ---------------------------------------------------------------- Level 3
mc(3, 'enzymes', 'Which statement about enzymes is NOT correct?', 'They shift the equilibrium of a reversible reaction towards the products', ['They lower the activation energy of the reaction', 'They are not used up in the reaction they catalyse', 'Their activity changes with pH and temperature'], 'Enzymes make a reaction reach equilibrium sooner, but the equilibrium position (the ratio of products to substrate) stays the same. The other three statements are true.', 'A catalyst changes the speed, never the equilibrium.');
mc(3, 'chemical composition', 'The ash left when a dry tissue is burnt in a flame contains mainly', 'inorganic elements such as calcium and magnesium', ['amino acids and sugars', 'nucleotides', 'lipids and proteins'], 'Burning removes carbon compounds as gases. What remains (ash) holds inorganic elements (and their oxides and salts), for example calcium and magnesium.');
mc(3, 'proteins', 'Which protein and function pair is NOT correctly matched?', 'Insulin - enzyme', ['Trypsin - enzyme', 'GLUT-4 - glucose transport into cells', 'Collagen - intercellular ground substance'], 'Insulin is a hormone, not an enzyme. Trypsin is a digestive enzyme, GLUT-4 carries glucose into cells and collagen gives strength to the matrix.');
mc(3, 'proteins', 'The amino acid whose R group is just a hydrogen atom is', 'glycine', ['alanine', 'serine', 'valine'], 'Glycine, R = H, is the simplest amino acid. Alanine has R = CH<sub>3</sub> and serine has R = CH<sub>2</sub>OH.');
mc(3, 'proteins', 'Which one is an acidic amino acid?', 'Glutamic acid', ['Lysine', 'Valine', 'Alanine'], 'Glutamic acid (and aspartic acid) have a second carboxyl group, so they are acidic. Lysine has an extra amino group (basic). Valine and alanine are neutral.');
mc(3, 'proteins', 'In solution, an amino acid can carry both a positive and a negative charge at a particular pH. Such a dipolar ion is called', 'a zwitterion', ['a coenzyme', 'an ionophore', 'a prosthetic group'], 'The amino group picks up H<sup>+</sup> (NH<sub>3</sub><sup>+</sup>) and the carboxyl group gives up H<sup>+</sup> (COO<sup>-</sup>). The molecule is overall neutral. This is the zwitterionic form.');
mc(3, 'polysaccharides', 'In a glycogen molecule drawn as a chain, the right end is the', 'reducing end and the left end is non-reducing', ['non-reducing end and the left end is reducing', 'branching end only', 'end where only fructose is present'], 'By NCERT convention the right end of the chain is the reducing end, and the left end is the non-reducing end. Branches add more non-reducing ends.');
mc(3, 'enzymes', 'Which biomolecule is an exception to the statement "all enzymes are proteins"?', 'Ribozyme', ['Zymogen', 'Apoenzyme', 'Holoenzyme'], 'Ribozymes are RNA molecules with catalytic activity. Zymogen, apoenzyme and holoenzyme are protein forms of an enzyme.');
mc(3, 'enzymes', 'In the presence of a competitive inhibitor, the enzyme shows', 'the same V<sub>max</sub> but a higher apparent K<sub>m</sub>', ['a lower V<sub>max</sub> and the same K<sub>m</sub>', 'a lower V<sub>max</sub> and a lower K<sub>m</sub>', 'a higher V<sub>max</sub> and the same K<sub>m</sub>'], 'The inhibitor and substrate compete for the same site. A high substrate concentration out-competes the inhibitor, so V<sub>max</sub> can still be reached, but more substrate is needed to reach V<sub>max</sub>/2, so K<sub>m</sub> (apparent) rises.', 'A drop in V<sub>max</sub> is the sign of non-competitive inhibition.');
mc(3, 'enzymes', 'Enzymes from organisms living in hot springs are useful in industry because they', 'remain active at high temperatures (thermostable)', ['do not need a substrate', 'are not made of protein', 'work only at low pH'], 'Thermophilic organisms make enzymes whose structure does not unfold at high temperature. Taq polymerase used in PCR is an example.');
mc(3, 'nucleic acids', 'Which one of the following is a nucleoside?', 'Thymidine', ['Thymidylic acid', 'Guanylic acid', 'Cytidylic acid'], 'A nucleoside has base + sugar only. Thymidine is a nucleoside. The "-ylic acid" names (thymidylic, guanylic, cytidylic) are nucleotides, which carry a phosphate as well.');
mc(3, 'nucleic acids', 'Two adjacent nucleotides in a polynucleotide chain are joined by a', 'phosphodiester bond', ['N-glycosidic bond', 'peptide bond', 'hydrogen bond'], 'The phosphate of one nucleotide links the 3\' carbon of one sugar and the 5\' carbon of the next through two ester bonds: a 3\'-5\' phosphodiester bond. The N-glycosidic bond joins base and sugar inside one nucleoside.');
mc(3, 'nucleic acids', 'Which one is a purine?', 'Guanine', ['Cytosine', 'Thymine', 'Uracil'], 'Adenine and guanine are purines (two rings). Cytosine, thymine and uracil are pyrimidines (one ring).');
mc(3, 'metabolites', 'Choose the pair of secondary metabolites that are used as drugs.', 'Vinblastin and curcumin', ['Abrin and ricin', 'Carotenoids and anthocyanins', 'Rubber and gums'], 'Vinblastin (anticancer) and curcumin are drugs. Abrin and ricin are toxins, carotenoids and anthocyanins are pigments, and rubber and gums are polymeric substances.');
mc(3, 'metabolism', 'Which of the following is an anabolic process?', 'Formation of a protein from amino acids', ['Glucose to lactic acid in muscle', 'Digestion of starch in the gut', 'Breakdown of glycogen to glucose'], 'Anabolic pathways build complex molecules from simple ones and use energy. The other three break larger molecules into smaller ones (catabolism).');
mc(3, 'metabolism', 'The living state is best described as', 'a non-equilibrium steady state', ['a state of chemical equilibrium', 'a state with no reactions', 'a state with decreasing entropy and no energy input'], 'Metabolic reactions inside cells never reach equilibrium, since reactants are supplied and products used all the time. Concentrations stay steady because of constant energy flow. At equilibrium no work can be done, and that is death.', 'Steady state is not the same as equilibrium.');
mc(3, 'chemical composition', 'Compared with the earth\'s crust, living tissue has a much higher percentage of', 'carbon', ['silicon', 'aluminium', 'sodium'], 'The comparison of elements shows carbon, hydrogen and nitrogen are far more abundant in living tissue than in the crust, where silicon and aluminium are common.');
mc(3, 'enzymes', 'The energy difference between the substrate and the transition state is the', 'activation energy', ['free energy change of the reaction', 'heat of the reaction', 'binding energy of ATP'], 'The substrate must climb an energy hill to reach the transition state; the height of the hill is the activation energy. An enzyme lowers this height. The difference between substrate and product levels is the overall energy change, which enzymes leave unchanged.');
mc(3, 'enzymes', 'Carbonic anhydrase catalyses the reaction', 'CO<sub>2</sub> + H<sub>2</sub>O &rarr; H<sub>2</sub>CO<sub>3</sub>', ['glucose + ATP &rarr; glucose-6-phosphate', 'H<sub>2</sub>O<sub>2</sub> &rarr; H<sub>2</sub>O + O<sub>2</sub>', 'fumarate + H<sub>2</sub>O &rarr; malate'], 'Carbonic anhydrase speeds the carbonic acid formation (and its reverse) in red cells; one enzyme works at about 600,000 molecules per second. The second option is catalase, and the last one is fumarase.');
mc(3, 'proteins', 'The secondary structure of a protein is held together mainly by', 'hydrogen bonds', ['peptide bonds', 'phosphodiester bonds', 'glycosidic bonds'], 'Hydrogen bonds between the backbone groups hold alpha-helices and beta-sheets. Peptide bonds make the primary structure.');
mc(3, 'proteins', 'A disulfide bridge between two cysteine residues helps to stabilise the', 'tertiary structure', ['primary structure only', 'DNA structure', 'glycosidic structure'], 'S-S links between side chains are one of the forces that hold the 3-D folding of a chain (tertiary structure) and sometimes hold subunits together in quaternary structure. The primary structure is made by peptide bonds.');
mc(3, 'proteins', 'The end of a polypeptide chain with a free amino group is called the', 'N-terminal end', ['C-terminal end', 'reducing end', '5\' end'], 'A protein has an N-terminal (free NH<sub>2</sub>) and a C-terminal (free COOH) end. The first amino acid is at the N-terminal.');
mc(3, 'enzymes', 'NAD and NADP contain which vitamin?', 'Niacin', ['Riboflavin', 'Vitamin C', 'Vitamin K'], 'NAD and NADP are coenzymes made from the vitamin niacin. They carry hydrogen and electrons in oxidoreductions.');
mc(3, 'polysaccharides', 'The reaction in which glucose units are joined into starch releases', 'one water molecule for every glycosidic bond', ['carbon dioxide', 'ammonia', 'one ATP per bond'], 'Glycosidic bonds form by dehydration (condensation), removing one H<sub>2</sub>O for each bond. It costs energy; it does not release ATP.');
mc(3, 'polysaccharides', 'Which one of these polysaccharides contains nitrogen?', 'Chitin', ['Starch', 'Cellulose', 'Glycogen'], 'Chitin has N-acetyl glucosamine units, an amino-sugar. Starch, cellulose and glycogen are polymers of glucose only, so they have only C, H and O.');
ms(3, 'polysaccharides', 'Which of these are polymers of glucose? (one or more correct)', ['Starch', 'Glycogen', 'Cellulose', 'Inulin', 'Chitin'], [0, 1, 2], 'Starch, glycogen and cellulose are all glucose polymers. Inulin is made of fructose and chitin of N-acetyl glucosamine.', 'Inulin and chitin are common wrong picks.');
ms(3, 'metabolites', 'Which of these are secondary metabolites? (one or more correct)', ['Rubber', 'Morphine', 'Curcumin', 'Glycine', 'Alanine'], [0, 1, 2], 'Rubber (polymeric substance), morphine (alkaloid) and curcumin (spice and drug) are secondary metabolites. Glycine and alanine are amino acids, which are primary metabolites.');
asr(3, 'enzymes', 'The inhibition of succinic dehydrogenase by malonate can be overcome by adding more succinate.', 'Malonate competes with succinate for the active site of the enzyme.', 0, 'Malonate resembles succinate and occupies the active site. More succinate increases the chance that the substrate, not the inhibitor, binds, so the inhibition falls. R explains A.');
asr(3, 'polysaccharides', 'Cellulose does not give blue colour with iodine.', 'Cellulose does not form the complex helical structure that holds iodine molecules.', 0, 'Starch forms helices and holds I<sub>2</sub> to give blue. Cellulose chains are straight and form bundles of fibres, with no coil to hold iodine. R is the reason for A.');
asr(3, 'chemical composition', 'Lipids are found in the acid-insoluble fraction of a tissue extract.', 'Lipids are macromolecules with molecular weight above ten thousand daltons.', 2, 'A is true: membrane fragments are retained in the acid-insoluble fraction. R is false: lipids have small molecular weights (below 1000 Da) and are not strictly macromolecules.', 'The textbook line says "with the exception of lipids".');
stm(3, 'proteins', 'The N-terminal amino acid of a polypeptide has a free amino group.', 'One water molecule is released for each peptide bond formed.', 0, 'Both are correct. The chain begins with the free NH<sub>2</sub> and each condensation of COOH with NH<sub>2</sub> loses one H<sub>2</sub>O.');
stm(3, 'polysaccharides', 'Chitin is a homopolymer of glucose.', 'Cellulose is a polymer of glucose.', 3, 'Statement I is wrong: chitin is made of N-acetyl glucosamine. Statement II is correct.');
stm(3, 'enzymes', 'A prosthetic group is tightly bound to the apoenzyme.', 'A coenzyme is tightly bound to the apoenzyme throughout the reaction and cannot be separated.', 2, 'Statement I is correct (for example haem). Statement II is wrong: coenzymes are only loosely or transiently bound, and the catalytic cycle needs them in a temporary association.', 'Prosthetic group = tight; coenzyme = transient.');
match(3, 'enzymes', 'mA', 'Cofactors', ['A. Metal ion cofactor', 'B. Prosthetic group', 'C. Coenzyme', 'D. Apoenzyme'], ['p. Haem in peroxidase', 'q. NAD', 'r. Zn<sup>2+</sup> in carboxypeptidase', 's. Protein part of a holoenzyme'], 'A-r, B-p, C-q, D-s', ['A-p, B-r, C-q, D-s', 'A-r, B-q, C-p, D-s', 'A-s, B-p, C-q, D-r'], 'Zinc in carboxypeptidase is a metal ion cofactor (A-r). Haem is tightly bound, so it is a prosthetic group (B-p). NAD is an organic coenzyme (C-q). The protein part alone is the apoenzyme (D-s).');
match(3, 'enzymes', 'mB', 'Classes of enzymes', ['A. Oxidoreductases', 'B. Transferases', 'C. Lyases', 'D. Ligases'], ['p. Join molecules using ATP', 'q. Move a group other than hydrogen', 'r. Remove groups leaving double bonds', 's. Include dehydrogenases'], 'A-s, B-q, C-r, D-p', ['A-q, B-s, C-r, D-p', 'A-s, B-q, C-p, D-r', 'A-r, B-q, C-s, D-p'], 'Dehydrogenases are oxidoreductases (A-s). Transferases move a group (B-q). Lyases break bonds without water and leave a double bond (C-r). Ligases need ATP to join (D-p).');
match(3, 'proteins', 'mC', 'Proteins and their functions', ['A. Collagen', 'B. Trypsin', 'C. Insulin', 'D. GLUT-4'], ['p. Enzyme', 'q. Hormone', 'r. Carrier of glucose into cells', 's. Intercellular ground substance'], 'A-s, B-p, C-q, D-r', ['A-p, B-s, C-q, D-r', 'A-s, B-q, C-p, D-r', 'A-s, B-p, C-r, D-q'], 'Collagen forms the ground substance (A-s), trypsin is an enzyme (B-p), insulin is a hormone (C-q) and GLUT-4 carries glucose (D-r).');
match(3, 'polysaccharides', 'mD', 'Polysaccharides', ['A. Inulin', 'B. Chitin', 'C. Glycogen', 'D. Cellulose'], ['p. Cotton fibres', 'q. Polymer of fructose', 'r. Contains N-acetyl glucosamine', 's. Stored in liver and muscle'], 'A-q, B-r, C-s, D-p', ['A-r, B-q, C-s, D-p', 'A-q, B-r, C-p, D-s', 'A-s, B-r, C-q, D-p'], 'Inulin is made of fructose (A-q). Chitin has an amino-sugar (B-r). Glycogen is the animal store in liver and muscle (C-s). Cotton is nearly pure cellulose (D-p).');
nat(3, 'proteins', 'A protein has two polypeptide chains. One has 30 amino acids and the other has 40. How many peptide bonds are there in all?', 68, 'Idea: a linear chain of n residues has n - 1 bonds. So (30 - 1) + (40 - 1) = 29 + 39 = 68. In general, bonds = total residues - number of chains = 70 - 2 = 68.', '', 'Do not use 70 - 1 = 69; the two chains are separate.');
nat(3, 'enzymes', 'An enzyme has V<sub>max</sub> = 100 &micro;mol/min and K<sub>m</sub> = 2 mM. What is its velocity (in &micro;mol/min) at a substrate concentration of 6 mM?', 75, 'Use v = V<sub>max</sub> [S] / (K<sub>m</sub> + [S]) = 100 &times; 6 / (2 + 6) = 600 / 8 = 75 &micro;mol/min.', '&micro;mol/min', 'At [S] = K<sub>m</sub> the velocity is exactly half of V<sub>max</sub>, so the answer must be above 50 here.');
nat(3, 'chemical composition', 'A 250 g sample of fresh tissue has proteins making up 15% of its fresh weight. What mass of protein (in g) does it contain?', 37.5, 'Mass = 15% of 250 g = 0.15 &times; 250 = 37.5 g.', 'g', 'Percentage by fresh weight, not by dry weight.', 0.01);
nat(3, 'nucleic acids', 'A double-stranded DNA fragment has 500 base pairs. How many nucleotides does it contain in all?', 1000, 'Each base pair has two nucleotides, one on each strand. So 500 &times; 2 = 1000 nucleotides.', '', 'The answer is not 500 since that counts only one strand.');

// ---------------------------------------------------------------- Passages
pass('bmP1', 'Velocity of an enzyme at different substrate concentrations', 'A student measured the initial velocity (v) of an enzyme-catalysed reaction at fixed enzyme concentration and different substrate concentrations [S]. The values were: [S] = 1, 2, 4, 8 and 20 mM gave v = 20, 33.3, 50, 66.7 and 83.3 &micro;mol/min. The curve rises steeply at first and then flattens, with V<sub>max</sub> = 100 &micro;mol/min.');
pq('bmP1', 3, 'enzyme kinetics', 'The K<sub>m</sub> of this enzyme is', '4 mM', ['8 mM', '50 mM', '100 mM'], 'K<sub>m</sub> is the [S] at which v = V<sub>max</sub>/2 = 50 &micro;mol/min. From the table this is [S] = 4 mM.', 'K<sub>m</sub> is a concentration, not a velocity.');
pq('bmP1', 4, 'enzyme kinetics', 'The velocity at [S] = 12 mM will be', '75 &micro;mol/min', ['80 &micro;mol/min', '66.7 &micro;mol/min', '90 &micro;mol/min'], 'v = V<sub>max</sub>[S]/(K<sub>m</sub> + [S]) = 100 &times; 12/(4 + 12) = 1200/16 = 75 &micro;mol/min. It must be between 66.7 (8 mM) and 83.3 (20 mM), which fits.');
pq('bmP1', 5, 'enzyme kinetics', 'A competitive inhibitor is added so that apparent K<sub>m</sub> doubles. The velocity at [S] = 4 mM is then', '33.3 &micro;mol/min', ['50 &micro;mol/min', '25 &micro;mol/min', '66.7 &micro;mol/min'], 'A competitive inhibitor leaves V<sub>max</sub> unchanged (100) and doubles K<sub>m</sub> to 8 mM. Then v = 100 &times; 4/(8 + 4) = 400/12 = 33.3 &micro;mol/min.', 'Using V<sub>max</sub> = 50 would be the non-competitive pattern.');

pass('bmP2', 'Building a tripeptide', 'A student joins three amino acids to make a tripeptide Gly-Ala-Ser, written with the N-terminal amino acid first. The molecular masses of the free amino acids are: glycine 75, alanine 89 and serine 105 (in daltons). The mass of water is 18.');
pq('bmP2', 2, 'peptide bond', 'How many water molecules are released when the tripeptide is formed?', '2', ['1', '3', '0'], 'Three amino acids make two peptide bonds. Each bond formation removes one water molecule. So two water molecules are released.');
pq('bmP2', 3, 'peptide bond', 'The free amino group (NH<sub>2</sub>) of the tripeptide is found on', 'glycine', ['alanine', 'serine', 'all three amino acids'], 'The N-terminal amino acid, the first one written, keeps its free amino group. That is glycine. Serine at the C-terminal end keeps the free COOH group. Alanine in the middle has both groups used in peptide bonds.');
pq('bmP2', 4, 'peptide bond', 'The molecular mass of the tripeptide is', '233 Da', ['269 Da', '251 Da', '287 Da'], 'Add the three masses: 75 + 89 + 105 = 269. Subtract the 2 waters released: 269 - 2 &times; 18 = 233 Da.', '269 forgets that water is lost.');

pass('bmP3', 'Analysing a liver sample', 'A student grinds 10 g of fresh liver in cold trichloroacetic acid and strains it through a cheesecloth. She analyses (i) the filtrate, (ii) the residue left on the cloth, and (iii) a separate dried portion of liver that she burns completely.');
pq('bmP3', 3, 'chemical composition', 'The filtrate (i) will mainly contain', 'amino acids, sugars and nucleotides', ['DNA and proteins', 'polysaccharides and RNA', 'only inorganic ash'], 'The filtrate is the acid-soluble pool of small molecules (micromolecules, below about 1000 Da). Large molecules such as DNA, RNA, proteins and polysaccharides do not pass through.');
pq('bmP3', 3, 'chemical composition', 'The residue (ii) will mainly contain', 'proteins, nucleic acids, polysaccharides and lipids', ['only proteins', 'amino acids and sugars', 'water and mineral ions'], 'The acid-insoluble fraction has four types of organic compounds: proteins, nucleic acids, polysaccharides and lipids (as membrane fragments).');
pq('bmP3', 4, 'chemical composition', 'Which statement about (iii) is correct?', 'Carbon compounds are lost as gases and the ash holds inorganic matter', ['The ash holds all the proteins', 'The ash is the same as the acid-soluble pool', 'No ash remains because tissue is purely organic'], 'Burning oxidises organic compounds to CO<sub>2</sub>, water vapour and other gases. The mineral elements and their oxides stay as ash. So the ash tells us the inorganic composition.');

// ---------------------------------------------------------------- Level 4
mc(4, 'enzymes', 'A non-competitive inhibitor lowers the rate of an enzyme reaction. Its effect is', 'lower V<sub>max</sub> with K<sub>m</sub> unchanged', ['higher K<sub>m</sub> with V<sub>max</sub> unchanged', 'higher V<sub>max</sub> with lower K<sub>m</sub>', 'lower K<sub>m</sub> with unchanged V<sub>max</sub>'], 'A non-competitive inhibitor binds elsewhere than the active site, so part of the enzyme is out of action. Extra substrate cannot fix that, so V<sub>max</sub> falls. The affinity of the working enzyme for substrate is unchanged, so K<sub>m</sub> stays.', 'This is the opposite pattern of competitive inhibition.');
mc(4, 'enzymes', 'Enzyme X has K<sub>m</sub> = 0.1 mM and enzyme Y has K<sub>m</sub> = 5 mM for the same substrate. Which conclusion is correct?', 'X has the higher affinity and reaches half of its V<sub>max</sub> at a lower [S]', ['Y has the higher affinity for the substrate', 'X must have a higher V<sub>max</sub> than Y', 'Y is working at its V<sub>max</sub> at 5 mM'], 'A lower K<sub>m</sub> means that the enzyme is half-saturated at a lower [S], so it binds the substrate more tightly. K<sub>m</sub> tells nothing about V<sub>max</sub>. At [S] = K<sub>m</sub>, Y works at only half of its V<sub>max</sub>.');
mc(4, 'enzymes', 'A drug that looks like the natural substrate of a bacterial enzyme and blocks its active site is acting as a', 'competitive inhibitor', ['non-competitive inhibitor', 'coenzyme', 'prosthetic group'], 'Competitive inhibitors that are close in structure to the substrate occupy the active site. Such inhibitors are used in medicine to control bacterial pathogens.');
mc(4, 'enzymes', 'A solution of an enzyme is boiled and cooled, and its activity does not return. The most likely reason is', 'the three-dimensional structure unfolded permanently but peptide bonds remained', ['all peptide bonds were broken', 'the substrate was destroyed', 'the cofactor became a coenzyme'], 'High heat breaks the weak bonds (hydrogen bonds and others) that keep the folded shape, so the active site is lost. The primary structure (peptide bonds) stays. On cooling, the chain does not refold correctly. Low temperature only slows the enzyme, and it recovers.', 'Denaturation is not hydrolysis.');
mc(4, 'enzymes', 'Pepsin works best at about pH 2 and shows almost no activity at pH 8 because', 'the change in pH alters the ionisation of groups and the shape of the active site', ['pepsin gets hydrolysed at pH 8', 'pH 8 removes the peptide bonds', 'water is not available at pH 8'], 'Each enzyme has an optimum pH. Away from it, side chains gain or lose charge and the shape of the active site changes, so the substrate no longer fits.');
mc(4, 'polysaccharides', 'Humans cannot digest cellulose because they', 'lack the enzyme that breaks the &beta;-1,4 glycosidic bonds', ['have no amylase', 'have no peptide bonds', 'have cellulose only in the stomach'], 'Cellulose is a glucose polymer with &beta; linkages. Human enzymes break only the &alpha; links of starch and glycogen. Cellulose passes through as dietary fibre.');
mc(4, 'polysaccharides', 'Branch points in glycogen and amylopectin are made by', '&alpha;-1,6 glycosidic bonds', ['&beta;-1,4 bonds', 'peptide bonds', 'hydrogen bonds'], 'Main chains are joined by &alpha;-1,4 links. A branch begins at an &alpha;-1,6 link. Amylose, the unbranched part of starch, has only &alpha;-1,4 links.');
mc(4, 'proteins', 'How many different tripeptides can be made from the 20 amino acids if the same amino acid may be used more than once?', '8000', ['6840', '60', '400'], 'Each of the three positions can be filled in 20 ways: 20 &times; 20 &times; 20 = 8000. The number 6840 (= 20 &times; 19 &times; 18) is when no amino acid is repeated.', 'Sequence matters: Gly-Ala and Ala-Gly are different.');
mc(4, 'enzymes', 'In a plot of velocity against substrate concentration, the curve becomes flat at high [S] because', 'all active sites of the enzyme molecules are occupied', ['the enzyme is denatured by the substrate', 'the product has inhibited the enzyme', 'the substrate has been used up'], 'At low [S] more substrate means more ES complexes. At high [S] every enzyme molecule is working at full capacity, so the velocity reaches V<sub>max</sub>. Only more enzyme can raise it.');
mc(4, 'nucleic acids', 'In a nucleotide, the phosphate group is esterified to', 'the 5\' hydroxyl of the pentose sugar', ['the 1\' carbon of the sugar', 'the nitrogen base', 'the 2\' carbon of ribose only'], 'The base is on C1\' of the sugar (N-glycosidic link) and the phosphate is joined to the 5\'-OH by a phosphoester link.');
mc(4, 'lipids', 'In a phospholipid bilayer of a membrane, the fatty acid chains are', 'inside, facing each other away from water', ['on the outside, towards water', 'cross-linked by peptide bonds', 'in the aqueous region only'], 'Phospholipids have a polar (water-loving) head and non-polar fatty acid tails. In water the tails pack into the middle of the bilayer and the heads face the water on both sides.');
mc(4, 'metabolism', 'A poison that blocks succinic dehydrogenase in a tissue would cause accumulation of', 'succinate', ['fumarate', 'oxaloacetate', 'pyruvate'], 'Succinic dehydrogenase (an oxidoreductase) turns succinate into fumarate. If it is blocked, its substrate succinate builds up and fumarate falls. This is why malonate is used in experiments on the Krebs cycle.', 'Mixed with respiration.');
mc(4, 'nucleic acids', 'DNA ligase seals a break in a DNA strand by forming a', 'phosphodiester bond using energy', ['hydrogen bond between bases', 'peptide bond', 'glycosidic bond'], 'Ligases (class 6) join molecules using energy, here by making the phosphodiester bond between the 3\'-OH and the adjacent 5\' phosphate. Hydrogen bonds are broken by helicase.', 'Mixed with molecular basis of inheritance.');
mc(4, 'chemical composition', 'A student finds a compound of molecular weight about 150,000 Da in a tissue extract. In which fraction of the TCA experiment is it likely to be found?', 'The acid-insoluble fraction', ['The acid-soluble pool', 'The ash', 'The filtrate'], 'Biomacromolecules (above about 10,000 Da) are in the acid-insoluble fraction. The acid-soluble pool has micromolecules, below 1000 Da.');
mc(4, 'enzymes', 'When a chelating agent removes the Zn<sup>2+</sup> from carboxypeptidase, activity is lost. The most likely explanation is that', 'the metal ion cofactor was needed for catalysis', ['the enzyme was a ribozyme', 'the active site was filled by a coenzyme', 'the protein was hydrolysed'], 'Cofactors are non-protein parts essential for catalysis. Without them the apoenzyme is inactive; adding the metal ion back would restore the holoenzyme.');
mc(4, 'enzymes', 'The lysosomal enzymes (acid hydrolases, optimum pH about 5) are far less active if they leak into the cytoplasm of pH 7.2. This is because', 'enzyme activity depends on the pH around it', ['they get converted to ribozymes', 'cytoplasm has no water', 'the substrates are absent in cells'], 'Each enzyme has an optimum pH. A pH shift changes the charge on the side chains and the shape of the active site. This shows a safety feature of the cell.', 'Mixed with cell chapter.');
mc(4, 'proteins', 'In sickle-cell anaemia, valine replaces glutamic acid at position 6 of the &beta; chain of haemoglobin. The level of protein structure first changed is the', 'primary structure', ['quaternary structure only', 'secondary structure only', 'none, because the gene is unchanged'], 'The change is in the amino acid sequence, which is the primary structure. That in turn changes folding and clumping of haemoglobin molecules.', 'Mixed with inheritance.');
mc(4, 'polysaccharides', 'Which statement explains why starch and cellulose, both polymers of glucose, differ in properties?', 'They differ in the glycosidic linkage and in the shape of the chain', ['Cellulose is a polymer of fructose', 'Starch has peptide bonds', 'Cellulose has no glycosidic bonds'], 'Starch has &alpha;-glucose with coiled chains and branches. Cellulose has &beta;-glucose with straight chains. Both are glucose polymers with glycosidic bonds.');
nat(4, 'polysaccharides', 'A glycogen molecule has 1000 glucose residues and 49 branches. How many glycosidic bonds does it have in all (&alpha;-1,4 and &alpha;-1,6 together)?', 999, 'Idea: any connected arrangement of n units without a ring needs n - 1 links, branched or not. So 1000 - 1 = 999 bonds (950 &alpha;-1,4 and 49 &alpha;-1,6).', '', 'Branching does not add extra bonds; each unit but one is attached once.');
nat(4, 'polysaccharides', 'The same glycogen molecule has 49 branch points. How many non-reducing ends does it have?', 50, 'Idea: the chain has one reducing end. Every branch creates one extra free end. Non-reducing ends = 1 + 49 = 50.', '', 'There is one reducing end per molecule, however many branches.');
nat(4, 'nucleic acids', 'A DNA fragment has 100 base pairs with 40% G + C. How many hydrogen bonds hold the two strands together?', 240, 'GC pairs = 40, AT pairs = 60. G-C has 3 hydrogen bonds and A-T has 2. Total = 40 &times; 3 + 60 &times; 2 = 120 + 120 = 240.', '', 'Percent GC is of the whole DNA (of the pairs), not of a strand.');
nat(4, 'nucleic acids', 'How many phosphodiester bonds are there in a linear double-stranded DNA of 500 base pairs?', 998, 'Each strand of 500 nucleotides has 499 phosphodiester bonds. Two strands give 2 &times; 499 = 998.', '', '1000 - 1 = 999 is wrong since the two strands are not joined by this bond.');
nat(4, 'proteins', 'The average mass of an amino acid is 128 Da. What is the approximate mass (in Da) of a linear polypeptide of 100 amino acids? Water is 18 Da.', 11018, 'Mass = 100 &times; 128 - 99 &times; 18 = 12800 - 1782 = 11018 Da.', 'Da', 'There are 99 water molecules lost, not 100.');
nat(4, 'enzymes', 'An enzyme has V<sub>max</sub> = 100 units. Its velocity is 40 units at [S] = 3 mM. What is K<sub>m</sub> in mM?', 4.5, 'Rearrange v = V<sub>max</sub>[S]/(K<sub>m</sub> + [S]) to K<sub>m</sub> = [S](V<sub>max</sub>/v - 1) = 3 &times; (100/40 - 1) = 3 &times; 1.5 = 4.5 mM.', 'mM', '', 0.01);
nat(4, 'enzymes', 'An enzyme has K<sub>m</sub> = 5 mM. At what [S] (in mM) will the velocity be 80% of V<sub>max</sub>?', 20, '0.8 = [S]/(5 + [S]) gives 0.8 &times; 5 + 0.8[S] = [S], so 4 = 0.2[S] and [S] = 20 mM. The velocity is 50% at 5 mM, but reaching 80% needs four times K<sub>m</sub>.', 'mM', 'Do not scale linearly: 80% does not need 8 mM.');
nat(4, 'enzymes', 'A reaction rate is 4 units at 25 &deg;C. For this enzyme the rate doubles for each 10 &deg;C rise (Q<sub>10</sub> = 2) up to its optimum at 45 &deg;C. What is the rate at 45 &deg;C?', 16, 'A rise of 20 &deg;C is two doublings: 4 &times; 2 &times; 2 = 16 units (4 &times; 2<sup>20/10</sup>).', 'units');
nat(4, 'enzymes', 'Carbonic anhydrase converts about 600,000 molecules per second. How many molecules does one enzyme molecule convert in 2 milliseconds?', 1200, '600,000 &times; 0.002 = 1200 molecules.', '', '2 ms is 0.002 s.');
nat(4, 'nucleic acids', 'In a double-stranded DNA, thymine is 22% of the bases. What percentage is guanine?', 28, 'A = T = 22%, so A + T = 44%. G + C = 56%, with G = C = 28%.', '%', 'Chargaff: A = T and G = C.');
ms(4, 'enzymes', 'Which of these are correct about enzymes? (one or more correct)', ['Heat denatures most enzymes by unfolding the active site', 'A competitive inhibitor raises the apparent K<sub>m</sub>', 'A non-competitive inhibitor lowers V<sub>max</sub>', 'Enzymes alter the equilibrium constant of a reaction'], [0, 1, 2], 'The first three are correct. Enzymes never change the equilibrium constant.');
ms(4, 'chemical composition', 'Which of these will be found in the acid-soluble pool of a tissue? (one or more correct)', ['Glucose', 'Glycine', 'Adenylic acid', 'RNA', 'A protein'], [0, 1, 2], 'Glucose, an amino acid and a nucleotide are micromolecules, soluble in the acid. RNA and proteins are macromolecules and stay in the acid-insoluble fraction.');
asr(4, 'enzymes', 'A reaction with a negative free energy change may still be very slow without a catalyst.', 'The speed of a reaction depends on the activation energy barrier, not on the sign of the free energy change.', 0, 'An exergonic reaction can release energy but still needs to cross an energy barrier. Enzymes lower the barrier. R explains A.');
asr(4, 'enzymes', 'In non-competitive inhibition, adding more substrate cannot bring back the original V<sub>max</sub>.', 'The inhibitor binds at a site other than the active site and takes a part of the enzyme out of action.', 0, 'The working enzyme concentration is reduced by the inhibitor, so the maximum rate is lower however much substrate is added. R is the reason.');
asr(4, 'metabolites', 'Secondary metabolites are not directly needed for growth and normal functions.', 'Secondary metabolites are present in all organisms and a cell cannot live without them.', 2, 'A is true. R is false: primary metabolites (amino acids, sugars) are found in all living cells and are needed; secondary metabolites are found in only some plants, fungi and microbes.');
asr(4, 'proteins', 'The R group of every amino acid is a methyl group.', 'The R group differs among amino acids and decides their properties.', 3, 'A is false: glycine has H, alanine has CH<sub>3</sub>, serine has CH<sub>2</sub>OH, and so on. R is true.');
stm(4, 'enzymes', 'Competitive inhibition lowers V<sub>max</sub> of an enzyme.', 'Non-competitive inhibition raises the K<sub>m</sub> of an enzyme.', 1, 'Competitive inhibition raises apparent K<sub>m</sub> and leaves V<sub>max</sub> the same. Non-competitive inhibition lowers V<sub>max</sub> and leaves K<sub>m</sub> the same. So both statements are wrong (the two are swapped).');
stm(4, 'polysaccharides', 'Starch, glycogen and cellulose differ in linkage and in branching.', 'Amylopectin is branched while amylose is not.', 0, 'Both correct. Cellulose has &beta; links and no branches; glycogen is highly branched; amylopectin is branched and amylose is a straight &alpha;-1,4 chain.');
stm(4, 'nucleic acids', 'A phosphodiester bond joins two nucleotides, and an N-glycosidic bond joins a base to a sugar.', 'In a nucleotide the phosphate is attached to the 3\' carbon of the sugar.', 2, 'Statement I is correct. In II, the phosphate in a nucleotide is esterified to the 5\' hydroxyl; 3\' is where the next nucleotide joins.');
mc(4, 'mixed concepts', 'How many of the following statements are correct? (i) Prosthetic groups are parts of holoenzymes. (ii) Haemoglobin shows quaternary structure. (iii) Cellulose is digested by human enzymes. (iv) K<sub>m</sub> is the concentration of enzyme.', 'Only two', ['Only one', 'Only three', 'All four'], '(i) and (ii) are correct. (iii) is wrong because humans lack cellulase. (iv) is wrong because K<sub>m</sub> is a substrate concentration.', '', 'statements');
match(4, 'metabolites', 'mE', 'Secondary metabolites', ['A. Alkaloids', 'B. Pigments', 'C. Toxins', 'D. Polymeric substances'], ['p. Ricin', 'q. Anthocyanin', 'r. Morphine', 's. Rubber'], 'A-r, B-q, C-p, D-s', ['A-q, B-r, C-p, D-s', 'A-r, B-p, C-q, D-s', 'A-r, B-q, C-s, D-p'], 'Morphine is an alkaloid (A-r), anthocyanin is a pigment (B-q), ricin is a toxin (C-p), and rubber is a polymeric substance (D-s).');

// ---------------------------------------------------------------- Level 5
mc(5, 'polysaccharides', 'A glycogen molecule has 80 branches. The number of reducing ends and the number of non-reducing ends are respectively', '1 and 81', ['80 and 1', '81 and 1', '1 and 80'], 'A single reducing end occurs at the start of the main chain. Each branch gives a new free non-reducing end. So non-reducing ends = 80 + 1 = 81.', 'Do not say that the reducing ends increase with branches.');
mc(5, 'proteins', 'Gly-Ala and Ala-Gly are', 'different dipeptides because the peptide bond has direction', ['the same dipeptide', 'two forms of a zwitterion', 'a nucleoside and a nucleotide'], 'In Gly-Ala, glycine carries the free NH<sub>2</sub> (N-terminal) and alanine has the free COOH. In Ala-Gly it is reversed. They are different molecules with the same composition.');
mc(5, 'enzymes', 'Initial rate is measured for an enzyme with and without an inhibitor at [S] much higher than K<sub>m</sub>. The rates are the same. The inhibitor is most probably', 'competitive', ['non-competitive', 'a coenzyme', 'a product of the reaction at high concentration'], 'At very high [S], a competitive inhibitor is out-competed and V<sub>max</sub> is reached. A non-competitive inhibitor would still lower the rate.', 'This is the finest check between the two types.');
mc(5, 'enzymes', 'In a reaction S &rarr; P, free energy of S is 50 kJ, of P is 30 kJ and of the transition state is 90 kJ without enzyme. With the enzyme, the transition state is at 65 kJ. The activation energy with the enzyme and the free energy change are respectively', '15 kJ and -20 kJ', ['40 kJ and -20 kJ', '35 kJ and +20 kJ', '15 kJ and -45 kJ'], 'Activation energy with enzyme = 65 - 50 = 15 kJ (without it: 90 - 50 = 40 kJ). Free energy change = 30 - 50 = -20 kJ, unchanged by the enzyme.', 'The enzyme changes only the hill, not the levels of S and P.');
mc(5, 'chemical composition', 'Which correctly describes micromolecules and macromolecules of the cell?', 'Micromolecules are below about 1000 Da and are in the acid-soluble pool; macromolecules (except lipids) are above about 10,000 Da and are in the acid-insoluble fraction', ['Micromolecules are above 10,000 Da and in the acid-insoluble fraction', 'All lipids are above 10,000 Da and soluble in acid', 'Macromolecules are found in the filtrate'], 'Biomolecules are grouped by size and by where they appear in the TCA experiment. Lipids are an exception: they are small but come out in the insoluble fraction as membrane pieces.');
mc(5, 'enzymes', 'A student mixes an enzyme with a substrate and a fixed amount of a non-competitive inhibitor and then doubles the enzyme concentration. Which is correct?', 'V<sub>max</sub> rises as more enzyme is present, as the inhibitor is now a smaller fraction', ['V<sub>max</sub> does not change at all', 'K<sub>m</sub> doubles', 'The inhibition becomes competitive'], 'V<sub>max</sub> is proportional to the amount of active enzyme. With more enzyme, a fixed amount of inhibitor can disable only part of it, so V<sub>max</sub> goes up.', 'The inhibitor type does not change by adding enzyme.');
mc(5, 'metabolism', 'Which is a correct statement about metabolic pathways?', 'Many steps of anabolic and catabolic pathways are catalysed by different enzymes in a sequence, and a given metabolite may link to more than one pathway', ['A single enzyme carries out a whole pathway', 'Anabolic pathways release energy and catabolic ones use it', 'Metabolites in the cell never change'], 'Pathways are chains of reactions, each step with its own enzyme. Catabolic pathways release energy (stored as ATP) and anabolic pathways use it. Metabolite concentrations stay steady because of continuous turnover.');
mc(5, 'proteins', 'A protein has two identical subunits and each subunit has one disulfide bridge between its own two cysteines. Which statement is correct?', 'The disulfide bridges help the tertiary structure and the protein has quaternary structure', ['The protein has only primary structure', 'The protein has no tertiary structure', 'Disulfide bridges here are peptide bonds'], 'A bridge between cysteines in the same chain stabilises its folding (tertiary). Having more than one subunit means it has quaternary structure.');
mc(5, 'nucleic acids', 'Which of the following has the greatest number of phosphate groups in a single nucleotide?', 'ATP', ['AMP', 'Adenosine', 'Adenine'], 'ATP has three phosphate groups. AMP has one. Adenosine (base + sugar) and adenine (only the base) have none.', 'Adenosine is the nucleoside, adenylic acid is AMP.');
nat(5, 'enzymes', 'An enzyme has V<sub>max</sub> = 100 units and K<sub>m</sub> = 2 mM. A competitive inhibitor (concentration 3 mM, K<sub>i</sub> = 1.5 mM) is added. Apparent K<sub>m</sub> = K<sub>m</sub>(1 + [I]/K<sub>i</sub>). What is the velocity (in units) at [S] = 6 mM?', 50, 'Apparent K<sub>m</sub> = 2 &times; (1 + 3/1.5) = 2 &times; 3 = 6 mM. V<sub>max</sub> stays 100. v = 100 &times; 6/(6 + 6) = 50 units.', 'units', 'Without inhibitor the velocity would be 75.');
nat(5, 'enzymes', 'A non-competitive inhibitor with [I] = K<sub>i</sub> lowers V<sub>max</sub> to V<sub>max</sub>/(1 + [I]/K<sub>i</sub>). For an enzyme with V<sub>max</sub> = 100 units and K<sub>m</sub> = 4 mM, find the velocity at [S] = 4 mM in the presence of the inhibitor.', 25, 'V<sub>max</sub> with inhibitor = 100/(1 + 1) = 50. K<sub>m</sub> is unchanged at 4 mM. At [S] = K<sub>m</sub>, v = half of the new V<sub>max</sub> = 25 units.', 'units', 'Here K<sub>m</sub> stays at 4 mM.');
asr(5, 'proteins', 'Gly-Ala and Ala-Gly are different dipeptides.', 'The peptide bond has a direction, so the N-terminal and C-terminal ends differ.', 0, 'Same amino acids, different order, so different free amino and free carboxyl ends. R explains A.');
stm(5, 'enzymes', 'Increasing the substrate concentration can cancel the effect of a competitive inhibitor.', 'The same is true for a non-competitive inhibitor.', 2, 'I is correct (the inhibitor is out-competed). II is incorrect: a non-competitive inhibitor does not use the active site, so more substrate does not remove its effect.');

// ---------------------------------------------------------------- Templates
const gens = [
  {
    id: 'bm-g01', type: 'nat', level: 2, format: 'integer', exams: ['neet'], sub: 'peptide bond',
    make(rng) {
      const nAA = int(rng, 8, 120); const mode = int(rng, 0, 2);
      let q, answer, how;
      if (mode === 0) { q = `A linear polypeptide has ${nAA} amino acids. How many peptide bonds does it have?`; answer = nAA - 1; how = `A linear chain of n units has n - 1 bonds: ${nAA} - 1 = ${answer}.`; }
      else if (mode === 1) { q = `How many water molecules are released when ${nAA} amino acids join to make one linear polypeptide?`; answer = nAA - 1; how = `One water is lost for each peptide bond, and a chain of ${nAA} units has ${nAA} - 1 = ${answer} bonds.`; }
      else { q = `A linear polypeptide contains ${nAA - 1} peptide bonds. How many amino acids does it have?`; answer = nAA; how = `Bonds = n - 1, so n = bonds + 1 = ${nAA - 1} + 1 = ${answer}.`; }
      return { nAA, mode, q, answer, tol: 0, sol: `Idea: each peptide bond joins two neighbours and releases one water. ${how}` };
    },
    verify(p) { return p.mode === 2 ? (p.nAA - 1) + 1 : p.nAA - 1; },
  },
  {
    id: 'bm-g02', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'peptide bond',
    make(rng) {
      const k = int(rng, 2, 4); const lens = Array.from({ length: k }, () => int(rng, 20, 160));
      const tot = lens.reduce((a, b) => a + b, 0);
      const names = ['A', 'B', 'C', 'D'];
      const list = lens.map((l, i) => `chain ${names[i]} with ${l}`).join(', ');
      const answer = tot - k;
      return { lens, k, q: `A protein is made of ${k} separate polypeptide chains: ${list} amino acids. How many peptide bonds does it contain in all?`, answer, tol: 0, sol: `Idea: each separate linear chain of n residues has n - 1 bonds. Total bonds = total residues - number of chains = ${tot} - ${k} = ${answer}.`, trap: 'The chains are not joined to each other by peptide bonds.' };
    },
    verify(p) { return p.lens.reduce((a, l) => a + (l - 1), 0); },
  },
  {
    id: 'bm-g03', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'peptide bond',
    make(rng) {
      const nAA = int(rng, 5, 40); const cyc = int(rng, 0, 1);
      const answer = cyc ? nAA : nAA - 1;
      return { nAA, cyc, q: `${cyc ? 'A cyclic (ring-shaped) peptide' : 'A linear peptide'} is made from ${nAA} amino acids. How many water molecules were lost during its formation?`, answer, tol: 0, sol: `Idea: one water is lost per peptide bond. ${cyc ? `In a ring the last unit also joins the first, so bonds = n = ${nAA}.` : `In a line, bonds = n - 1 = ${nAA - 1}.`} So ${answer} molecules of water were lost.`, trap: 'A ring has one more bond than a chain of the same size.' };
    },
    verify(p) { return p.cyc ? p.nAA : p.nAA - 1; },
  },
  {
    id: 'bm-g04', type: 'nat', level: 4, format: 'integer', exams: ['neet'], sub: 'proteins',
    make(rng) {
      const AA = [['glycine', 75], ['alanine', 89], ['serine', 105], ['valine', 117], ['leucine', 131], ['phenylalanine', 165]];
      const n = int(rng, 3, 5);
      const chosen = Array.from({ length: n }, () => choose(rng, AA));
      const sum = chosen.reduce((a, c) => a + c[1], 0);
      const answer = sum - 18 * (n - 1);
      return { chosen, n, q: `A linear peptide is made from these amino acids (masses in Da): ${chosen.map((c) => `${c[0]} ${c[1]}`).join(', ')}. Each loses water on joining (water = 18 Da). What is the mass of the peptide in Da?`, answer, tol: 0, unit: 'Da', sol: `Idea: peptide mass = sum of the free amino acid masses minus the water lost. Sum = ${sum}. Bonds = ${n} - 1 = ${n - 1}, so water lost = ${n - 1} &times; 18 = ${18 * (n - 1)}. Mass = ${sum} - ${18 * (n - 1)} = ${answer} Da.`, trap: 'Subtract water for n - 1 bonds, not for n amino acids.' };
    },
    verify(p) { return p.chosen.reduce((a, c) => a + c[1] - 18, 0) + 18; },
  },
  {
    id: 'bm-g05', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'polysaccharides',
    make(rng) {
      const nG = int(rng, 20, 2000); const br = int(rng, 0, 15) * 2 + int(rng, 0, 1); const ask = int(rng, 0, 2);
      let q, answer, how;
      const head = `A glycogen-like molecule has ${nG} glucose units and ${br} branch points.`;
      if (ask === 0) { q = `${head} How many glycosidic bonds does it have in all?`; answer = nG - 1; how = `Every unit except one is attached once to the rest, so bonds = n - 1 = ${answer}, whatever the branching.`; }
      else if (ask === 1) { q = `${head} How many non-reducing ends does it have?`; answer = br + 1; how = `One chain end is reducing. Each branch adds one more free non-reducing end, so ${br} + 1 = ${answer}.`; }
      else { q = `${head} How many of its glycosidic bonds are the main-chain type (not the branching type)?`; answer = nG - 1 - br; how = `Total bonds = ${nG - 1}. Of these, ${br} are branch links, so main-chain bonds = ${nG - 1} - ${br} = ${answer}.`; }
      return { nG, br, ask, q, answer, tol: 0, sol: `Idea: count bonds as one fewer than the units, and ends as branches + 1. ${how}`, trap: 'Branching does not add a bond beyond n - 1.' };
    },
    verify(p) { return p.ask === 0 ? p.nG - 1 : p.ask === 1 ? p.br + 1 : (p.nG - 1) - p.br; },
  },
  {
    id: 'bm-g06', type: 'nat', level: 3, format: 'numeric', exams: ['neet'], sub: 'enzyme kinetics',
    make(rng) {
      const Vmax = choose(rng, [60, 80, 100, 120, 150, 200]); const Km = choose(rng, [1, 2, 4, 5, 10]); const S = choose(rng, [1, 2, 3, 4, 5, 8, 10, 15, 20]);
      const answer = +((Vmax * S) / (Km + S)).toFixed(2);
      return { Vmax, Km, S, q: `An enzyme has V<sub>max</sub> = ${Vmax} &micro;mol/min and K<sub>m</sub> = ${Km} mM. What is the initial velocity (in &micro;mol/min) at [S] = ${S} mM?`, answer, tol: 0.01, unit: '&micro;mol/min', sol: `Use v = V<sub>max</sub>[S]/(K<sub>m</sub> + [S]) = ${Vmax} &times; ${S}/(${Km} + ${S}) = ${Vmax * S}/${Km + S} = ${answer} &micro;mol/min.`, trap: S === Km ? 'At [S] = K<sub>m</sub> the velocity is exactly half of V<sub>max</sub>.' : 'The velocity can never exceed V<sub>max</sub>.' };
    },
    verify(p) { return +(p.Vmax / (1 + p.Km / p.S)).toFixed(2); },
  },
  {
    id: 'bm-g07', type: 'nat', level: 4, format: 'numeric', exams: ['neet'], sub: 'enzyme kinetics',
    make(rng) {
      const k = choose(rng, [0.5, 1, 2, 3, 4]); const Km = choose(rng, [2, 3, 4, 5, 6, 8]); const S = +(Km * k).toFixed(2);
      const Vmax = 60 * (1 + k) * (k === 0.5 ? 2 : 1);
      const v = +((Vmax * S) / (Km + S)).toFixed(4);
      return { Vmax, Km, S, v, q: `An enzyme has V<sub>max</sub> = ${Vmax} units. At [S] = ${S} mM its velocity is ${fmt(v, 4)} units. Find K<sub>m</sub> in mM.`, answer: Km, tol: 0.01, unit: 'mM', sol: `Rearrange v = V<sub>max</sub>[S]/(K<sub>m</sub> + [S]) to K<sub>m</sub> = [S](V<sub>max</sub>/v - 1). Here V<sub>max</sub>/v = ${Vmax}/${fmt(v, 4)} = ${fmt(Vmax / v, 4)}, so K<sub>m</sub> = ${S} &times; ${fmt(Vmax / v - 1, 4)} = ${Km} mM.` };
    },
    verify(p) { return +(p.S * (p.Vmax / p.v - 1)).toFixed(2); },
  },
  {
    id: 'bm-g08', type: 'nat', level: 4, format: 'numeric', exams: ['neet'], sub: 'enzyme kinetics',
    make(rng) {
      const f = choose(rng, [0.6, 0.75, 0.8, 0.9]); const Km = choose(rng, [2, 3, 4, 5, 10]);
      const answer = +((Km * f) / (1 - f)).toFixed(3);
      return { f, Km, q: `An enzyme has K<sub>m</sub> = ${Km} mM. At what substrate concentration (in mM) does it work at ${f * 100}% of its V<sub>max</sub>?`, answer, tol: 0.01, unit: 'mM', sol: `Put v/V<sub>max</sub> = ${f} in v/V<sub>max</sub> = [S]/(K<sub>m</sub> + [S]). Then [S] = K<sub>m</sub> &times; f/(1 - f) = ${Km} &times; ${f}/${+(1 - f).toFixed(2)} = ${answer} mM.`, trap: 'Reaching a high fraction of V<sub>max</sub> needs many times K<sub>m</sub>.' };
    },
    verify(p) { return +(p.Km / (1 / p.f - 1)).toFixed(3); },
  },
  {
    id: 'bm-g09', type: 'mcq', level: 3, format: 'single', exams: ['neet'], sub: 'enzyme inhibition',
    make(rng) {
      const cases = [
        ['an inhibitor that closely resembles the substrate and binds to the active site', 'V<sub>max</sub> unchanged, K<sub>m</sub> increases', 'It is competitive: more substrate out-competes the inhibitor, so V<sub>max</sub> can still be reached, but a higher [S] is needed for half-V<sub>max</sub>, so apparent K<sub>m</sub> rises.'],
        ['an inhibitor that binds at a site other than the active site and cannot be removed by adding substrate', 'V<sub>max</sub> decreases, K<sub>m</sub> unchanged', 'It is non-competitive: some enzyme is put out of action, so V<sub>max</sub> falls. The affinity of the working enzyme for substrate is unchanged, so K<sub>m</sub> stays the same.'],
        ['malonate acting on succinic dehydrogenase', 'V<sub>max</sub> unchanged, K<sub>m</sub> increases', 'Malonate is a competitive inhibitor (it looks like succinate), so V<sub>max</sub> stays and apparent K<sub>m</sub> rises.'],
        ['an inhibitor whose effect is overcome by raising the substrate concentration', 'V<sub>max</sub> unchanged, K<sub>m</sub> increases', 'Relief by more substrate is the sign of competitive inhibition: V<sub>max</sub> same, apparent K<sub>m</sub> higher.'],
      ];
      const [who, correct, why] = choose(rng, cases);
      const pool = ['V<sub>max</sub> unchanged, K<sub>m</sub> increases', 'V<sub>max</sub> decreases, K<sub>m</sub> unchanged', 'V<sub>max</sub> increases, K<sub>m</sub> unchanged', 'V<sub>max</sub> decreases, K<sub>m</sub> decreases'];
      const o = shuffleOpts(rng, correct, pool.filter((x) => x !== correct));
      return { correctText: correct, q: `In the presence of ${who}, an enzyme shows`, options: o.options, answer: o.answer, sol: `Idea: identify the inhibitor type first. ${why} So the answer is: ${correct}.`, trap: 'Competitive changes K<sub>m</sub>; non-competitive changes V<sub>max</sub>.' };
    },
    verify(p) { return p.options.indexOf(p.correctText); },
  },
  {
    id: 'bm-g10', type: 'nat', level: 5, format: 'numeric', exams: ['neet'], sub: 'enzyme kinetics',
    make(rng) {
      const Km = choose(rng, [1, 2, 4]); const m = choose(rng, [1, 2, 3]); const Ki = choose(rng, [0.5, 1, 2]); const I = +(m * Ki).toFixed(2);
      const Kapp = Km * (1 + m); const c = choose(rng, [1, 2, 3]); const S = Kapp * c; const Vmax = choose(rng, [60, 120, 240]);
      const answer = +((Vmax * S) / (Kapp + S)).toFixed(2);
      return { Km, I, Ki, S, Vmax, q: `An enzyme has V<sub>max</sub> = ${Vmax} units and K<sub>m</sub> = ${Km} mM. A competitive inhibitor is added at [I] = ${I} mM (K<sub>i</sub> = ${Ki} mM), with apparent K<sub>m</sub> = K<sub>m</sub>(1 + [I]/K<sub>i</sub>). Find the velocity (in units) at [S] = ${S} mM.`, answer, tol: 0.01, unit: 'units', sol: `Apparent K<sub>m</sub> = ${Km} &times; (1 + ${I}/${Ki}) = ${Km} &times; ${1 + m} = ${Kapp} mM. V<sub>max</sub> stays ${Vmax}. v = ${Vmax} &times; ${S}/(${Kapp} + ${S}) = ${answer} units. Without the inhibitor it would be ${fmt((Vmax * S) / (Km + S), 4)}.`, trap: 'A competitive inhibitor does not change V<sub>max</sub>.' };
    },
    verify(p) { const Kapp = p.Km * (1 + p.I / p.Ki); return +((p.Vmax * p.S) / (Kapp + p.S)).toFixed(2); },
  },
  {
    id: 'bm-g11', type: 'nat', level: 4, format: 'integer', exams: ['neet'], sub: 'enzyme activity',
    make(rng) {
      const r0 = choose(rng, [2, 3, 5, 6]); const q10 = choose(rng, [2, 3]); const T0 = choose(rng, [10, 15, 20]); const steps = int(rng, 1, 3); const T1 = T0 + steps * 10;
      return { r0, q10, steps, q: `For an enzyme, the rate rises ${q10}-fold for every 10 &deg;C rise in temperature (below its optimum, which is above ${T1} &deg;C). The rate is ${r0} units at ${T0} &deg;C. What is the rate at ${T1} &deg;C?`, answer: r0 * q10 ** steps, tol: 0, unit: 'units', sol: `The rise is ${T1 - T0} &deg;C, which is ${steps} step(s) of 10 &deg;C. Rate = ${r0} &times; ${q10}<sup>${steps}</sup> = ${r0 * q10 ** steps} units.`, trap: 'The rise does not continue beyond the optimum; the enzyme denatures.' };
    },
    verify(p) { let r = p.r0; for (let i = 0; i < p.steps; i++) r *= p.q10; return r; },
  },
  {
    id: 'bm-g12', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'nucleic acids',
    make(rng) {
      const bp = choose(rng, [20, 40, 50, 100, 200, 500]); const gc = choose(rng, [20, 30, 40, 50, 60]);
      const nGC = (bp * gc) / 100; const nAT = bp - nGC;
      return { bp, gc, q: `A double-stranded DNA fragment has ${bp} base pairs, and ${gc}% of its base pairs are G-C. How many hydrogen bonds hold its two strands together?`, answer: 3 * nGC + 2 * nAT, tol: 0, sol: `G-C pairs = ${nGC}, A-T pairs = ${nAT}. G-C has 3 hydrogen bonds and A-T has 2. Total = ${nGC} &times; 3 + ${nAT} &times; 2 = ${3 * nGC + 2 * nAT}.`, trap: 'The percentage is of base pairs, not of single bases.' };
    },
    verify(p) { return p.bp * 2 + (p.bp * p.gc) / 100; },
  },
  {
    id: 'bm-g13', type: 'nat', level: 2, format: 'integer', exams: ['neet'], sub: 'nucleic acids',
    make(rng) {
      const a = int(rng, 15, 35); const what = int(rng, 0, 2);
      const names = [['adenine', 'thymine'], ['thymine', 'adenine'], ['adenine', 'guanine']];
      let q, answer, how;
      if (what === 0) { q = `In a double-stranded DNA, adenine is ${a}% of the bases. What percentage is guanine?`; answer = 50 - a; how = `T = A = ${a}%, so A + T = ${2 * a}%. G + C = ${100 - 2 * a}%, and G = C = ${answer}%.`; }
      else if (what === 1) { q = `In a double-stranded DNA, guanine is ${a}% of the bases. What percentage is thymine?`; answer = 50 - a; how = `C = G = ${a}%, so G + C = ${2 * a}%. A + T = ${100 - 2 * a}%, so T = ${answer}%.`; }
      else { q = `In a double-stranded DNA, thymine is ${a}%. What is the percentage of purines (A + G)?`; answer = 50; how = 'In double-stranded DNA each purine pairs with a pyrimidine, so purines = pyrimidines = 50%, whatever the value of T.'; }
      return { a, what, q, answer, tol: 0, unit: '%', sol: `Idea: Chargaff's rule, A = T and G = C. ${how}`, trap: 'Valid only for double-stranded DNA.' };
    },
    verify(p) { return p.what === 2 ? 100 - 50 : (100 - 2 * p.a) / 2; },
  },
  {
    id: 'bm-g14', type: 'nat', level: 4, format: 'integer', exams: ['neet'], sub: 'nucleic acids',
    make(rng) {
      const bp = int(rng, 20, 900); const k = int(rng, 0, 2);
      const qs = [[`How many phosphodiester bonds are in a linear double-stranded DNA of ${bp} base pairs?`, 2 * (bp - 1), `Each strand has ${bp} nucleotides and ${bp} - 1 bonds, so two strands have 2 &times; ${bp - 1} = ${2 * (bp - 1)}.`], [`How many nucleotides are in a double-stranded DNA of ${bp} base pairs?`, 2 * bp, `Each base pair has 2 nucleotides: 2 &times; ${bp} = ${2 * bp}.`], [`How many phosphodiester bonds are in one single-stranded RNA of ${bp} nucleotides?`, bp - 1, `A chain of ${bp} units has ${bp} - 1 = ${bp - 1} bonds.`]];
      return { bp, k, q: qs[k][0], answer: qs[k][1], tol: 0, sol: `Idea: a bond joins each pair of neighbouring nucleotides in a chain. ${qs[k][2]}`, trap: 'Count each strand separately.' };
    },
    verify(p) { return p.k === 0 ? (p.bp - 1) * 2 : p.k === 1 ? p.bp + p.bp : p.bp - 1; },
  },
  {
    id: 'bm-g15', type: 'nat', level: 2, format: 'numeric', exams: ['neet'], sub: 'chemical composition',
    make(rng) {
      const comps = [['water', 80], ['proteins', 15], ['carbohydrates', 3], ['lipids', 2], ['nucleic acids', 6], ['ions', 1]];
      const [nm, pc] = choose(rng, comps); const M = choose(rng, [20, 40, 50, 80, 100, 200, 500]);
      const answer = +((M * pc) / 100).toFixed(2);
      return { M, pc, q: `In a model cell, ${nm} make up ${pc}% of the cell mass. How many grams of ${nm} are there in ${M} g of such cells?`, answer, tol: 0.01, unit: 'g', sol: `Mass = ${pc}% of ${M} g = ${pc}/100 &times; ${M} = ${answer} g.` };
    },
    verify(p) { return +((p.pc / 100) * p.M).toFixed(2); },
  },
  {
    id: 'bm-g16', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'enzyme activity',
    make(rng) {
      const k = choose(rng, [1000, 5000, 20000, 600000]); const t = choose(rng, [0.001, 0.002, 0.005, 0.01, 2]);
      const answer = Math.round(k * t);
      return { k, t, q: `One molecule of an enzyme converts ${k.toLocaleString('en-US')} substrate molecules per second. How many substrate molecules does it convert in ${t} s?`, answer, tol: 0, sol: `Number converted = rate &times; time = ${k} &times; ${t} = ${answer}.`, trap: 'Check that the time is in seconds.' };
    },
    verify(p) { return Math.round(p.k * p.t); },
  },
  {
    id: 'bm-g17', type: 'mcq', level: 3, format: 'single', exams: ['neet'], sub: 'proteins',
    make(rng) {
      const n = int(rng, 2, 4); const rep = int(rng, 0, 1);
      const names = ['', '', 'dipeptides', 'tripeptides', 'tetrapeptides'];
      let ans = 1, ans2 = 1; for (let i = 0; i < n; i++) { ans *= 20; ans2 *= 20 - i; }
      const val = rep ? ans : ans2; const other = rep ? ans2 : ans;
      const correct = String(val);
      const o = shuffleOpts(rng, correct, [String(other), String(20 * n), String(n ** 20)]);
      return { n, rep, correctText: correct, q: `How many different ${names[n]} can be built from the 20 protein amino acids if ${rep ? 'an amino acid may be used more than once' : 'no amino acid is repeated in a peptide'}? (The order matters.)`, options: o.options, answer: o.answer, sol: `Idea: multiply the choices for each position. ${rep ? `Each of the ${n} positions has 20 choices: 20<sup>${n}</sup> = ${val}.` : `The choices fall by one at each position: ${Array.from({ length: n }, (_, i) => 20 - i).join(' &times; ')} = ${val}.`} The other options come from allowing or forbidding repeats, adding instead of multiplying, or swapping base and power.`, trap: 'Order matters: Gly-Ala is not Ala-Gly.' };
    },
    verify(p) { return p.options.indexOf(p.correctText); },
  },
];

export default { topic: 'cell-biomolecules', groups, items, gens };
