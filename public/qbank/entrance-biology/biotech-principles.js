// NEET UG Biology: Biotechnology: principles and processes (NCERT Class 12, 2023 rationalised book). All questions original fibub work.
import { pick, int, choose, fmt, shuffleOpts, numOpts, g } from '../_entrance.js';

const items = [];
const groups = {};
let n = 0, pos = 0;
const POS = [1, 3, 0, 2];
const nid = () => `bp-${String(++n).padStart(3, '0')}`;
const ex = (level) => (level <= 3 ? ['neet', 'cuet'] : ['neet']);
const AR = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const ST = ['Both Statement I and Statement II are correct', 'Both Statement I and Statement II are incorrect', 'Statement I is correct but Statement II is incorrect', 'Statement I is incorrect but Statement II is correct'];
function mc(level, sub, q, correct, wrongs, sol, trap, format = 'single') {
  const p = POS[pos++ % 4];
  const options = [...wrongs];
  options.splice(p, 0, correct);
  items.push({ id: nid(), type: 'mcq', level, format, exams: ex(level), sub, q, options, answer: p, sol, ...(trap ? { trap } : {}) });
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
  items.push({ id: nid(), type: 'nat', level, format: tol ? 'numeric' : 'integer', exams: ['neet'], sub, q, answer, tol, ...(unit ? { unit } : {}), sol, ...(trap ? { trap } : {}) });
}

// ---------------------------------------------------------------- Level 1
mc(1, 'principles', 'Which of these is one of the two core techniques that gave birth to modern biotechnology?', 'Genetic engineering', ['Tissue grafting', 'Selective breeding', 'Fermentation by wild yeast alone'], 'The two core techniques are genetic engineering (altering the genetic material and introducing it into a host) and bioprocess engineering (keeping a sterile environment so only the desired microbe or cell grows in large quantity).');
mc(1, 'principles', 'Maintaining a sterile (contamination-free) environment so that only the desired microbe grows in large quantity is part of', 'bioprocess engineering', ['gene cloning only', 'tissue culture only', 'natural selection'], 'Bioprocess engineering looks after the sterile conditions and large-scale growth of the cells that make the product. Without it, an engineered microbe would be overgrown by contaminants.');
mc(1, 'enzymes', 'The enzymes called "molecular scissors" of genetic engineering are', 'restriction endonucleases', ['DNA ligases', 'DNA polymerases', 'reverse transcriptases'], 'Restriction endonucleases cut DNA at specific sequences. Ligases are the "molecular glue" that join cut pieces.');
mc(1, 'enzymes', 'The enzyme that joins two cut DNA fragments by forming phosphodiester bonds is', 'DNA ligase', ['restriction endonuclease', 'exonuclease', 'Taq polymerase'], 'DNA ligase seals the nick between the sugar of one nucleotide and the phosphate of the next, joining the vector and the insert.');
mc(1, 'enzymes', 'The first restriction endonuclease to be isolated was', 'Hind II', ['EcoR I', 'Bam H I', 'Taq I'], 'Hind II was isolated first and was found to always cut DNA at a particular six-base-pair sequence. EcoRI is the best-known example but was not the first.');
mc(1, 'enzymes', 'The recognition sequence of EcoRI is', '5\'-GAATTC-3\'', ['5\'-GGATCC-3\'', '5\'-AAGCTT-3\'', '5\'-CTGCAG-3\''], 'EcoRI recognises GAATTC and cuts between G and A on each strand. GGATCC belongs to BamHI, AAGCTT to HindIII and CTGCAG to PstI.');
mc(1, 'enzymes', 'In the name EcoRI, the first letter "E" stands for', 'the genus <i>Escherichia</i>', ['the species <i>coli</i>', 'the strain RY13', 'the order of discovery'], 'The first letter is the genus (Escherichia), the next two letters the species (coli), then R for the strain RY13, and the Roman numeral I for the first enzyme isolated from that strain.');
mc(1, 'vectors', 'A plasmid is', 'a small circular extra-chromosomal DNA that replicates on its own in bacteria', ['a linear chromosome of bacteria', 'a protein coat of a virus', 'a kind of ribosome'], 'Plasmids are circular double-stranded DNA molecules separate from the main chromosome, with their own origin of replication. This is why they work as vectors.');
mc(1, 'PCR', 'The DNA polymerase used in PCR is called Taq polymerase because it comes from the bacterium', '<i>Thermus aquaticus</i>', ['<i>Escherichia coli</i>', '<i>Bacillus thuringiensis</i>', '<i>Agrobacterium tumefaciens</i>'], '<i>Thermus aquaticus</i> lives in hot springs, so its polymerase survives the high temperature used to separate DNA strands.');
mc(1, 'PCR', 'PCR stands for', 'polymerase chain reaction', ['protein chain reaction', 'plasmid cloning reaction', 'polynucleotide ligase reaction'], 'PCR copies a chosen stretch of DNA again and again with a DNA polymerase, so the amount of that stretch doubles in each cycle.');
mc(1, 'gel electrophoresis', 'In gel electrophoresis, DNA fragments move towards the', 'anode (positive electrode)', ['cathode (negative electrode)', 'middle of the gel', 'both electrodes equally'], 'DNA carries negative charges on its phosphate groups, so it is pulled towards the positive electrode, the anode.');
mc(1, 'gel electrophoresis', 'Separated DNA bands in an agarose gel are made visible by staining with', 'ethidium bromide and viewing under UV light', ['Gram stain in daylight', 'iodine solution under red light', 'methylene blue under infrared'], 'Ethidium bromide binds DNA and glows orange under UV light. Staining without UV exposure does not show the bands properly.');
mc(1, 'gel electrophoresis', 'Agarose, the gel material used in DNA electrophoresis, is obtained from', 'sea weeds', ['bacterial cell walls', 'animal bones', 'wheat starch'], 'Agarose is a natural polymer extracted from sea weeds. It forms a sieve of tiny pores through which DNA moves.');
mc(1, 'host', 'To make bacterial cells "competent" to take up recombinant DNA, they are treated with a specific concentration of a divalent cation such as', 'calcium', ['sodium', 'potassium', 'iron'], 'Calcium ions increase the pore size in the cell wall and membrane, so that DNA can pass in during the heat shock.');
mc(1, 'host', 'The heat shock given to competent bacteria with recombinant DNA is at', '42 &deg;C', ['4 &deg;C', '25 &deg;C', '100 &deg;C'], 'The mixture is first kept on ice, then placed at 42 &deg;C for a short time, and returned to ice. The temperature change helps DNA enter the cell.');
mc(1, 'host', 'A gene gun (biolistics) is mainly used to introduce DNA into', 'plant cells', ['bacterial cells', 'red blood cells', 'viruses'], 'Gold or tungsten particles coated with DNA are shot at high velocity into plant cells. Micro-injection is the method for animal cells.');
mc(1, 'bioreactor', 'The most common type of bioreactor used to grow cells in large volume is', 'the stirred-tank type', ['a flask kept still', 'a Petri dish', 'a test tube rack'], 'The stirred-tank bioreactor is a large vessel with an agitator for even mixing and oxygen supply. Flasks are fine for small cultures, not for industry.');
mc(1, 'vectors', 'The vector used to transfer genes into dicot plants is a modified', 'Ti plasmid of <i>Agrobacterium tumefaciens</i>', ['pBR322 of <i>E. coli</i>', 'retrovirus', 'bacteriophage lambda'], 'The tumour-inducing (Ti) plasmid of this soil bacterium is disarmed so it no longer causes tumours, and is used as a cloning vector for plants.');
mc(1, 'vectors', 'The sequence in a vector from where replication starts is called', 'the origin of replication (ori)', ['the selectable marker', 'the cloning site', 'the promoter'], 'The ori is needed for the vector to copy itself, and it also decides how many copies of the plasmid are made inside the cell.');
mc(1, 'principles', 'The first recombinant DNA was constructed in 1972 by', 'Stanley Cohen and Herbert Boyer', ['Watson and Crick', 'Hershey and Chase', 'Jacob and Monod'], 'They linked an antibiotic resistance gene to a plasmid vector and moved it into <i>E. coli</i>, where it was copied.');
mc(1, 'isolation', 'Purified DNA is made to come out of solution as fine white threads by adding', 'chilled ethanol', ['concentrated acid', 'distilled water', 'protease'], 'DNA is insoluble in cold ethanol, so it precipitates as thread-like strands that can be spooled out.');
mc(1, 'downstream', 'Separation and purification of the product after the biosynthetic stage is called', 'downstream processing', ['upstream processing', 'transformation', 'insertional inactivation'], 'Downstream processing includes separation, purification, formulation with preservatives, clinical trials and quality control before marketing.');

// ---------------------------------------------------------------- Level 2
mc(2, 'enzymes', 'Which statement correctly separates exonucleases from endonucleases?', 'Exonucleases remove nucleotides from the ends of DNA; endonucleases cut at specific positions within the DNA', ['Exonucleases cut inside the DNA; endonucleases remove nucleotides from the ends', 'Exonucleases join DNA; endonucleases separate strands', 'Both cut only at the ends of DNA'], 'The prefix exo means outside (the ends) and endo means inside. Restriction enzymes used in cloning are endonucleases.');
mc(2, 'enzymes', 'Sticky (cohesive) ends are called so because', 'the single-stranded overhangs can base-pair with complementary overhangs', ['they stick to the gel', 'they bind protein tightly', 'they are rich in sulphur'], 'A staggered cut leaves short unpaired stretches. Any two molecules cut with the same enzyme have complementary overhangs, so they can pair and then be joined by ligase.');
mc(2, 'enzymes', 'A palindromic nucleotide sequence in DNA is one in which', 'the base sequence reads the same on both strands when each is read in the 5\' to 3\' direction', ['all bases are purines', 'the two strands have identical base sequences read left to right', 'only A and T are present'], 'Take GAATTC: the complementary strand, read 5\' to 3\', is also GAATTC. In a word palindrome like "MADAM" the letters read the same backwards, here it is the two strands that match.', 'The strands are complementary, not identical when both are read left to right.');
mc(2, 'enzymes', 'EcoRI cuts the DNA double helix', 'between G and A on each strand, leaving four-base overhangs', ['between T and T on both strands, leaving blunt ends', 'only on one strand', 'at the ends of the DNA molecule'], 'EcoRI cuts G^AATTC on both strands. The cuts are staggered, so each fragment has a 5\' AATT overhang, which is a sticky end.');
mc(2, 'enzymes', 'Restriction enzymes are naturally made by bacteria as a defence against', 'bacteriophages', ['antibiotics', 'plant toxins', 'ultraviolet rays'], 'The enzymes were first found as a system that restricts the growth of bacteriophage. A companion enzyme adds methyl groups to the host\'s own DNA and protects it.');
mc(2, 'vectors', 'A good cloning vector needs', 'an origin of replication, a selectable marker and cloning sites', ['only a selectable marker', 'only restriction sites', 'only a promoter'], 'The ori lets it replicate, the marker helps to pick out transformed cells and the cloning sites are where foreign DNA is inserted.');
mc(2, 'vectors', 'Why should a cloning vector have only ONE recognition site for the restriction enzyme used?', 'otherwise the enzyme would cut the vector into several pieces', ['otherwise the vector cannot replicate at all', 'otherwise the antibiotic will not enter the cell', 'because ligase needs a single site'], 'More than one site would chop the vector into fragments, and the foreign DNA would not be carried in a single piece.');
mc(2, 'vectors', 'The role of a selectable marker in a vector is to', 'help select the transformed cells and eliminate the non-transformants', ['increase the copy number of the vector', 'cut the foreign DNA', 'express the foreign gene'], 'Markers such as genes for resistance to ampicillin, chloramphenicol, tetracycline or kanamycin let only the transformed cells grow on a medium with that antibiotic.');
mc(2, 'vectors', 'Which gene is commonly used as a selectable marker in <i>E. coli</i> vectors?', 'a gene for ampicillin resistance', ['a gene for insulin', 'a gene for cellulase', 'a gene for ribosomal RNA'], 'Cells carrying the resistance gene survive on a medium with ampicillin. Those without it die, so only the transformed cells remain.');
mc(2, 'vectors', 'pBR322 was named after', 'the scientists Bolivar and Rodriguez who built it', ['a place in Brazil', 'its 322 genes', 'the bacterium <i>Bacillus</i> strain 322'], 'In pBR322, p stands for plasmid and B and R for Bolivar and Rodriguez; 322 is the number for the particular plasmid they made.');
mc(2, 'vectors', 'Insertional inactivation means', 'a gene stops working because foreign DNA has been inserted into it', ['a gene stops working because its promoter is missing', 'a plasmid is destroyed by the host', 'a restriction enzyme loses its activity'], 'If the foreign DNA is inserted inside a marker gene, that gene\'s product is no longer made, which lets us tell recombinants from non-recombinants.');
mc(2, 'vectors', 'In pBR322 the <i>rop</i> gene codes for', 'proteins involved in the replication of the plasmid', ['ampicillin resistance', 'tetracycline resistance', 'the cloning site'], 'The <i>rop</i> gene is part of the replication machinery. The marker genes are ampR and tetR.');
mc(2, 'vectors', 'In blue-white screening, a recombinant colony is', 'white, because the lacZ gene (&beta;-galactosidase) is inactivated', ['blue, because the gene is active', 'white, because the plasmid is absent', 'blue, because the ampicillin is broken down'], 'With the chromogenic substrate, an intact enzyme makes a blue colour. If foreign DNA sits in the lacZ gene, no enzyme is made and the colony stays white.', 'White colonies are NOT cells without plasmid; those would not grow on the ampicillin plate at all.');
mc(2, 'vectors', 'In the Ti plasmid used for plant transformation, the tumour-causing genes are', 'removed (the plasmid is disarmed)', ['made more active', 'copied twice', 'transferred to animals'], 'The T-DNA is modified so that it delivers the gene of interest without causing crown-gall tumours.');
mc(2, 'vectors', 'Which vector is made harmless and used to deliver genes into animal cells?', 'a disarmed retrovirus', ['the Ti plasmid', 'pBR322', 'a Taq polymerase gene'], 'Retroviruses can integrate their genetic material into animal cells efficiently. The disease-causing genes are removed before use.');
mc(2, 'host', 'DNA cannot easily enter a bacterial cell because DNA is', 'a hydrophilic, large and charged molecule that cannot cross the cell membrane', ['a lipid that dissolves in the cell wall', 'always degraded outside the cell', 'much smaller than the membrane pores'], 'The membrane is lipid-rich and DNA is hydrophilic, so the cell must be made competent for DNA uptake.');
mc(2, 'host', 'In micro-injection, recombinant DNA is injected directly into the', 'nucleus of an animal cell', ['cell wall of a plant', 'cytoplasm of a bacterium', 'cell membrane of a virus'], 'A fine glass needle delivers DNA into the nucleus of an animal cell, for example an egg.');
mc(2, 'isolation', 'To release DNA from fungal cells the cells are treated with', 'chitinase', ['lysozyme', 'cellulase', 'ribonuclease'], 'Fungal cell walls contain chitin. Bacteria need lysozyme, and plant cells cellulase.');
mc(2, 'isolation', 'To get rid of RNA from the cell lysate while isolating DNA, we add', 'ribonuclease', ['protease', 'lipase', 'cellulase'], 'Ribonuclease breaks RNA. Protease removes proteins. DNA is left behind and is precipitated by ethanol.');
mc(2, 'PCR', 'The correct order of the steps in each PCR cycle is', 'denaturation, annealing, extension', ['annealing, denaturation, extension', 'extension, annealing, denaturation', 'denaturation, extension, annealing'], 'Heat first separates the strands (denaturation), then primers bind (annealing), then the polymerase adds nucleotides (extension).');
mc(2, 'PCR', 'Primers used in PCR are', 'short chemically synthesised oligonucleotides complementary to the ends of the target region', ['long RNA molecules complementary to the whole genome', 'restriction enzymes', 'fragments of DNA ligase'], 'A pair of primers marks the start of the region to be copied, one for each strand, so the polymerase can extend them.');
mc(2, 'PCR', 'Why is a thermostable polymerase used in PCR?', 'it is not destroyed at the high temperature that separates the DNA strands', ['it works only at 0 &deg;C', 'it can copy RNA', 'it joins fragments without primers'], 'A normal polymerase would lose activity at each denaturation step, and fresh enzyme would be needed every cycle.');
mc(2, 'gel electrophoresis', 'In an agarose gel, the DNA fragments that move farthest from the wells are the', 'smallest ones', ['largest ones', 'ones with most GC content only', 'ones with the same charge only'], 'The gel acts as a sieve. Smaller fragments pass through the pores more easily, so they travel farther in the same time.');
mc(2, 'gel electrophoresis', 'The step of cutting out a DNA band from the gel and extracting it is called', 'elution', ['annealing', 'transformation', 'lysis'], 'After staining, the band is cut out and the DNA is eluted. The purified fragment can be used to construct recombinant DNA.');
mc(2, 'bioreactor', 'Which of the following is NOT usually present in a bioreactor?', 'a gel comb to separate DNA', ['an agitator system', 'a foam control system', 'a temperature and pH control system'], 'A bioreactor has an agitator, oxygen delivery system, foam control, temperature and pH control and a sampling port. A comb is part of an electrophoresis tank.');
mc(2, 'bioreactor', 'Bioreactors used in industry can process culture volumes of about', '100-1000 litres', ['1-10 millilitres', '10-50 microlitres', 'only 1 litre'], 'They allow large-scale cell culture, so that enough product is made to sell.');
mc(2, 'bioreactor', 'In a sparged stirred-tank bioreactor, "sparging" means', 'bubbling sterile air through the culture', ['heating the culture rapidly', 'adding antibiotics', 'removing the product continuously'], 'Air is bubbled in as fine bubbles and the stirrer breaks them up, so oxygen reaches all cells and the culture is evenly mixed.');
mc(2, 'downstream', 'Before a recombinant protein is marketed it must go through', 'formulation with preservatives, clinical trials and quality control', ['only cloning', 'only transformation', 'only gel electrophoresis'], 'Downstream processing makes the product safe and stable. For drugs, clinical trials are done and strict quality control follows.');
mc(2, 'principles', 'Which one is NOT a basic step of recombinant DNA technology?', 'Meiotic crossing over of the vector', ['Identification of DNA with the desirable gene', 'Introduction of the identified DNA into a host', 'Maintenance of the DNA in the host and its transfer to progeny'], 'The three steps are identification, introduction and maintenance. A vector does not undergo meiosis.');
mc(2, 'principles', 'The tools of recombinant DNA technology are', 'restriction enzymes, polymerases, ligases, vectors and the host organism', ['only plasmids and phages', 'only enzymes', 'microscopes and centrifuges only'], 'The five tools in NCERT are the cutting enzymes, polymerases that copy DNA, ligases that join, vectors that carry and a host to grow the DNA.');
mc(2, 'enzymes', 'Restriction enzymes were first isolated in 1963 because they', 'restricted the growth of bacteriophage in <i>E. coli</i>', ['joined DNA fragments', 'digested proteins', 'repaired the bacterial wall'], 'Two enzymes were isolated from <i>E. coli</i>. One added methyl groups to DNA while the other cut DNA, and the second one is the restriction endonuclease.');
mc(2, 'enzymes', 'In the name HindIII, the roman numeral III shows', 'the order in which the enzyme was isolated from that strain', ['the number of cuts it makes', 'the length of the recognition site', 'the number of species'], 'The numerals give the order of isolation of enzymes from the same strain of bacteria. They do not tell about the sequence or cuts.');
mc(2, 'vectors', 'Which pair of genes in pBR322 gives antibiotic resistance?', 'ampR and tetR', ['rop and ori', 'lacZ and rop', 'cry and ori'], 'The plasmid has genes for resistance to ampicillin (ampR) and tetracycline (tetR). <i>rop</i> codes for a replication protein.');

// ---------------------------------------------------------------- Level 3
mc(3, 'vectors', 'A foreign gene is ligated into the BamHI site (inside the tetracycline-resistance gene) of pBR322 and the plasmid is put into <i>E. coli</i> cells that have no resistance genes. Cells with the recombinant plasmid will', 'grow on ampicillin but not on tetracycline', ['grow on tetracycline but not on ampicillin', 'grow on both antibiotics', 'grow on neither'], 'The insert breaks the tetR gene, so tetracycline resistance is lost (insertional inactivation). The ampR gene is intact, so the cells survive on ampicillin only.', 'Cells with the plasmid and no insert would grow on both; this is how recombinants are told apart.');
mc(3, 'vectors', 'A foreign DNA fragment is cloned at the PstI site of pBR322 (inside ampR). Transformed cells which have the recombinant plasmid are expected to', 'grow on tetracycline but not on ampicillin', ['grow on ampicillin but not on tetracycline', 'grow on neither', 'grow on both'], 'PstI lies in ampR. The insert inactivates ampicillin resistance, while tetR still works.');
mc(3, 'vectors', 'On an agar plate containing ampicillin and a chromogenic substrate, which cells would NOT form any colony?', 'cells that took up no plasmid', ['cells with a plasmid without insert', 'cells with a recombinant plasmid', 'cells with a plasmid that has an insert in lacZ'], 'Without a plasmid there is no ampicillin resistance, so these cells die. Cells with plasmid grow, blue if no insert and white if recombinant.', 'Do not confuse "white colony" with "no colony".');
mc(3, 'vectors', 'A vector without insert (self-ligated) in blue-white screening gives', 'blue colonies on the ampicillin plate with substrate', ['white colonies', 'no colonies', 'red colonies'], 'The lacZ gene remains intact and &beta;-galactosidase turns the substrate blue. The recombinants have lacZ interrupted and stay white.');
mc(3, 'enzymes', 'Human DNA and a plasmid are both cut with EcoRI and the pieces are mixed with DNA ligase. This works because', 'all the fragments have the same complementary sticky ends', ['EcoRI cuts only human DNA', 'ligase makes the ends blunt', 'plasmids never have sticky ends'], 'EcoRI leaves AATT overhangs on every fragment, whichever DNA it came from. The overhangs pair by hydrogen bonds and ligase seals the backbone.');
mc(3, 'enzymes', 'Which of these is NOT true of restriction endonucleases?', 'They cut at random places along the DNA', ['They recognise specific base sequences', 'They cut both strands of the helix', 'They cut the sugar-phosphate backbone'], 'Each enzyme scans the DNA and cuts only at its own recognition site, hence the name restriction enzyme. Random cutting would be useless for cloning.');
mc(3, 'enzymes', 'The enzyme that protects a bacterium\'s own DNA from its restriction enzyme is', 'a methylase that adds methyl groups to the DNA', ['a ligase that joins it', 'an exonuclease that digests it', 'a protease that coats it'], 'The host DNA is methylated at the recognition sequence, so the bacterium\'s own restriction enzyme does not cut it, while unmethylated phage DNA is cut.');
mc(3, 'PCR', 'If a mesophilic DNA polymerase from <i>E. coli</i> were used in PCR in place of Taq, the likely problem is that', 'the enzyme would be inactivated at the high temperature of denaturation', ['the primers would not anneal', 'the DNA would not be negatively charged', 'the extension step would be skipped automatically'], 'Taq survives about 94 &deg;C. A normal enzyme would be denatured in the first cycle, so fresh enzyme would be needed after each cycle.');
mc(3, 'PCR', 'In PCR the number of target DNA copies grows as', 'a geometric series, doubling in each cycle', ['a straight line, adding a fixed number each cycle', 'a decrease, as primers get used', 'a constant after the first cycle'], 'Each new strand becomes a template in the next cycle, so the amount doubles. After n cycles one molecule gives about 2<sup>n</sup> molecules.');
mc(3, 'PCR', 'Which component of the PCR mixture decides WHICH region of the DNA is amplified?', 'the pair of primers', ['Taq polymerase', 'the free nucleotides', 'the buffer'], 'The polymerase only extends from a primer that has paired. The primers fix the two ends of the amplified region.');
mc(3, 'host', 'In the heat shock method, the cells and DNA are first kept on ice. The main purpose of the ice step is to', 'let DNA stick to the cell surface before the heat shock', ['kill the non-competent cells', 'cut the DNA', 'activate the polymerase'], 'DNA sticks to the treated surface while cold, then the quick rise to 42 &deg;C helps it to enter the cells, and the return to ice completes the uptake.');
mc(3, 'host', 'Which of the following methods is used to introduce DNA into the nucleus of an animal cell without any vector?', 'micro-injection', ['biolistics (gene gun)', 'Ca<sup>2+</sup> heat shock', 'disarmed Ti plasmid'], 'A very fine needle puts DNA directly into the nucleus. The gene gun is for plant cells, heat shock for bacteria and the Ti plasmid works through <i>Agrobacterium</i> for dicot plants.');
mc(3, 'isolation', 'To obtain pure DNA from a plant leaf, the correct combination of treatments is', 'cellulase to break the wall, ribonuclease to remove RNA, protease to remove proteins, then chilled ethanol', ['lysozyme, lipase, then boiling', 'chitinase, amylase, then water', 'trypsin, then acid, then distillation'], 'Cellulase digests the plant cell wall. After the DNA is released, RNA is digested by ribonuclease and proteins by protease. Chilled ethanol finally precipitates the DNA.');
mc(3, 'bioreactor', 'In a stirred-tank bioreactor the agitator mainly', 'mixes the contents evenly and spreads the oxygen supplied', ['cuts the DNA of the cells', 'removes the product', 'cools the culture below 0 &deg;C'], 'Even mixing keeps nutrients, cells and oxygen uniformly distributed. Temperature, pH and foam are controlled by separate systems.');
mc(3, 'bioreactor', 'Why is a foam control system included in a bioreactor?', 'foam from aeration and stirring can block air outlets and carry cells out', ['to heat the culture', 'to make DNA move to the anode', 'to cut off oxygen'], 'Aerated, stirred protein-rich cultures foam easily. An anti-foam system keeps the vessel working properly.');
mc(3, 'gel electrophoresis', 'A circular plasmid is cut by EcoRI at exactly one site. The gel will show', 'one band for a linear molecule of the full plasmid length', ['two bands', 'no band', 'one band of half the plasmid length'], 'A single cut opens the ring into one linear molecule of the same total length. Only one band appears.', 'The number of fragments from a circular DNA equals the number of cuts, not cuts + 1.');
mc(3, 'gel electrophoresis', 'A linear DNA of 10 kb is cut by an enzyme at two sites. The gel will show', 'three fragments whose lengths add up to 10 kb', ['two fragments adding up to 10 kb', 'three fragments each of 10 kb', 'one fragment of 20 kb'], 'Each cut in a linear molecule adds one piece, so two cuts give three fragments. The total length is always conserved.');
mc(3, 'principles', 'Which statement about bioprocess engineering is correct?', 'It allows the cells to be grown in large quantity in sterile conditions so that the product is made in bulk', ['It cuts the DNA at specific sites', 'It is used to sequence genomes only', 'It is done only in test tubes'], 'The recombinant cell must be grown in large volume to get a useful amount of product. This needs a sterile, controlled environment such as a bioreactor.');
mc(3, 'host', 'A recombinant plasmid is added to a mixture of bacteria. Why do the bacteria need to be treated with calcium chloride before the heat shock?', 'to make them competent so that DNA can pass through the pores', ['to cut the plasmid', 'to give them antibiotic resistance', 'to digest the cell wall completely'], 'Divalent calcium raises the efficiency with which DNA enters through the pores in the cell wall. Without it, uptake is very poor.');

asr(3, 'PCR', 'Taq polymerase is the enzyme of choice in PCR.', 'Taq polymerase remains active at the high temperature used to separate the DNA strands.', 0, 'A is true and R is its exact reason. The enzyme comes from <i>Thermus aquaticus</i> and is thermostable, so it is not destroyed at every denaturation step.');
asr(3, 'gel electrophoresis', 'DNA fragments in an agarose gel move towards the positive electrode.', 'The phosphate groups make DNA negatively charged.', 0, 'The negative charge of DNA makes it move towards the anode. The reason explains the assertion.');
asr(3, 'host', 'Bacterial cells are treated with calcium ions before transformation.', 'Calcium ions increase the pore size of the cell wall and membrane for easier DNA entry.', 0, 'A and R are true, and R explains A. The cells become competent.');
asr(3, 'vectors', 'A cloning vector must have only one recognition site for the restriction enzyme used for cloning.', 'DNA ligase can join only blunt ends of DNA.', 2, 'A is true: more sites would fragment the vector. R is false: ligase joins both blunt and sticky ends (sticky ends are easier). So A is true and R is false.', 'Do not treat any true-sounding line as the reason; check R by itself.');
asr(3, 'enzymes', 'Exonucleases are used in cloning to cut DNA at specific sequences.', 'Exonucleases remove nucleotides from the ends of DNA.', 3, 'A is false. The enzymes that cut at specific internal sites are restriction endonucleases. R is a true description of exonucleases.');
asr(4, 'vectors', 'On a plate with ampicillin and a chromogenic substrate, white colonies are taken as recombinant colonies.', 'Insertion of foreign DNA into the lacZ gene prevents the formation of &beta;-galactosidase.', 0, 'The foreign DNA breaks the enzyme gene, so no blue colour. White colonies still grew on ampicillin, so they carry the plasmid and an insert. R explains A.');
asr(4, 'gel electrophoresis', 'Cutting a circular plasmid with one restriction enzyme at one site gives a linear molecule.', 'A circular DNA has no free ends, so the number of fragments equals the number of cuts.', 0, 'One cut opens the ring into one linear piece. The reason about no free ends and fragments = cuts explains this.');
asr(4, 'bioreactor', 'A stirred-tank bioreactor has an agitator.', 'In a sparged reactor, sterile air is bubbled into the culture.', 1, 'Both are true. But the air is bubbled in for oxygen supply, and the agitator is there to mix and spread that oxygen; R does not explain why the agitator is present by itself, so R is not the correct explanation.');
asr(4, 'host', 'A gene gun can be used to transfer genes to plant cells.', 'Plant cells are totipotent.', 1, 'Both are true statements. Biolistics works by firing DNA-coated gold or tungsten particles at high speed; totipotency only explains why a transformed cell can grow into a plant, not why the gun works.');

stm(3, 'enzymes', 'Restriction enzymes cut DNA at palindromic sequences.', 'A palindromic sequence in DNA reads the same on both strands when each is read in the 5\' to 3\' direction.', 0, 'Both are correct and they go together. GAATTC is an example.');
stm(3, 'enzymes', 'EcoRI produces blunt ends.', 'EcoRI cuts the two strands between G and A at different positions, leaving single-stranded overhangs.', 3, 'Statement I is wrong: the cuts are staggered and give sticky ends. Statement II is correct.');
stm(3, 'PCR', 'DNA ligase is needed in each PCR cycle.', 'Primers pair with the denatured template strands during annealing.', 3, 'PCR uses a polymerase and primers, no ligase is added. So I is wrong and II is correct.');
stm(4, 'gel electrophoresis', 'Larger DNA fragments move faster through an agarose gel.', 'Ethidium bromide stained DNA bands can be seen in ordinary visible light with no UV exposure.', 1, 'Both are wrong: smaller fragments move faster, and bands are seen as orange under UV light.');
stm(3, 'vectors', 'Insertion of a gene in the PstI site of pBR322 inactivates the ampicillin resistance gene.', 'Such recombinant cells would grow on a tetracycline medium but not on an ampicillin medium.', 0, 'PstI lies within ampR. Cells with an insert lose ampicillin resistance but keep tetracycline resistance.');
stm(4, 'vectors', 'The Ti plasmid is used as a vector in dicot plants.', 'The tumour-inducing genes of the Ti plasmid are retained in the vector so that the gene is transferred.', 2, 'The Ti plasmid is disarmed: the tumour-forming genes are removed. So II is wrong.');
stm(3, 'isolation', 'Lysozyme is used to break the cell wall of plant cells.', 'Cellulase is used to break the cell wall of plant cells.', 3, 'Lysozyme digests the bacterial cell wall. Plant cells need cellulase, and fungi need chitinase.');

match(3, 'isolation', 'mbp1', 'Enzymes used to isolate DNA', ['A. Lysozyme', 'B. Cellulase', 'C. Chitinase', 'D. Ribonuclease'], ['p. Plant cell wall', 'q. Bacterial cell wall', 'r. Fungal cell wall', 's. RNA of the lysate'], 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-q, C-p, D-s'], 'Lysozyme breaks bacterial walls, cellulase plant walls, chitinase fungal walls and ribonuclease removes RNA.');
match(3, 'enzymes', 'mbp2', 'Restriction enzymes and the organisms they come from', ['A. EcoRI', 'B. HindIII', 'C. BamHI', 'D. Taq polymerase'], ['p. <i>Haemophilus influenzae</i>', 'q. <i>Bacillus amyloliquefaciens</i>', 'r. <i>Escherichia coli</i>', 's. <i>Thermus aquaticus</i>'], 'A-r, B-p, C-q, D-s', ['A-p, B-r, C-q, D-s', 'A-r, B-q, C-p, D-s', 'A-s, B-p, C-q, D-r'], 'The first letters of the names give the genus and species: Eco - <i>E. coli</i>, Hin - <i>H. influenzae</i>, Bam - <i>B. amyloliquefaciens</i>. Taq is the polymerase of <i>T. aquaticus</i>; it is not a restriction enzyme but the name follows the same genus-species idea.', 'Taq is a DNA polymerase, not a restriction enzyme; it is included here only for the organism.');
match(4, 'host', 'mbp3', 'Gene transfer methods', ['A. Biolistics', 'B. Micro-injection', 'C. Calcium chloride and heat shock', 'D. Disarmed retrovirus'], ['p. Gold or tungsten particles coated with DNA', 'q. Needle into the nucleus of an animal cell', 'r. Treatment at 42 &deg;C after cold incubation', 's. Vector for animal cells'], 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'], 'Biolistics uses coated microparticles; micro-injection uses a fine needle; heat shock follows calcium treatment of bacteria and retroviral vectors deliver genes into animal cells.');
match(4, 'PCR', 'mbp4', 'PCR steps', ['A. Denaturation', 'B. Annealing', 'C. Extension', 'D. One complete cycle'], ['p. Primers pair with the template', 'q. Double helix is separated by heat', 'r. Taq adds nucleotides to the primers', 's. Target amount doubles'], 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-r, C-p, D-s', 'A-q, B-p, C-s, D-r'], 'Heat separates the strands, primers pair at lower temperature, Taq extends, and each cycle doubles the target.');

pass('bpp1', 'Plasmid digestion', 'A circular plasmid of 6.0 kb has one EcoRI site and two BamHI sites. Digestion with BamHI alone gives two fragments of 2.5 kb and 3.5 kb. The EcoRI site lies inside the 3.5 kb BamHI fragment, and divides it into a 1.0 kb piece and a 2.5 kb piece.');
pq('bpp1', 3, 'gel electrophoresis', 'How many fragments does the double digest (EcoRI + BamHI) give?', 'Three', ['Two', 'Four', 'Five'], 'Together there are three cut sites on a circular molecule, so three fragments: 2.5 kb, 2.5 kb and 1.0 kb. A circle with n cuts gives n pieces.');
pq('bpp1', 4, 'gel electrophoresis', 'How many separate bands will be seen in the gel lane of the double digest?', 'Two, one of them twice as intense', ['Three equal bands', 'One band', 'Four bands'], 'The two 2.5 kb fragments move together, so there are two bands: 2.5 kb (double dose, stronger) and 1.0 kb.', 'Count bands and fragments separately: equal sizes co-migrate.');
pq('bpp1', 3, 'gel electrophoresis', 'Which fragment of the double digest travels the farthest in the gel?', 'the 1.0 kb fragment', ['the 2.5 kb fragments', 'the 3.5 kb fragment', 'all travel the same distance'], 'Smaller fragments pass through the gel pores faster, so the 1.0 kb piece runs the farthest. The 3.5 kb fragment is no longer present after the double digest.');

pass('bpp2', 'Selecting transformed bacteria', 'A ligation mixture of pBR322 cut at the BamHI site with a foreign DNA fragment is added to competent <i>E. coli</i> cells that carry no resistance genes. All cells are spread on ampicillin plates. 200 colonies grow. The colonies are transferred by replica plating to plates with tetracycline, and 160 of them also grow there.');
pq('bpp2', 4, 'selection', 'How many of the 200 colonies carry a recombinant plasmid?', '40', ['160', '200', '0'], 'The foreign DNA is in the tetR gene, so recombinants lose tetracycline resistance. 200 - 160 = 40 colonies grow on ampicillin only, and these are recombinants.', 'The 160 that also grow on tetracycline have plasmids without an insert.');
pq('bpp2', 3, 'selection', 'Why did no untransformed cell form a colony on the first plate?', 'They have no ampicillin-resistance gene and are killed by the antibiotic', ['They lack the ori', 'They were killed by the heat shock only', 'They cannot make &beta;-galactosidase'], 'Only cells that took in a plasmid carry ampR and survive. The antibiotic selects the transformed cells.');
pq('bpp2', 4, 'selection', 'The tetracycline-positive colonies most likely contain', 'a vector that closed without taking in the insert', ['the recombinant plasmid with an intact tetR', 'a plasmid with a deleted ori', 'viral DNA'], 'Tetracycline resistance is intact only if no insert interrupted tetR. So these cells have self-closed vector.');

pass('bpp3', 'PCR run', 'One double-stranded target DNA molecule is amplified by PCR with a suitable pair of primers and Taq polymerase. Each cycle (denaturation, annealing, extension) takes 3 minutes. Assume every cycle works perfectly.');
pq('bpp3', 3, 'PCR', 'How many copies of double-stranded DNA are present after 10 cycles?', '1024', ['100', '512', '2048'], 'The count doubles every cycle: 2<sup>10</sup> = 1024.', 'Some students use 2 &times; 10 = 20 or 10<sup>2</sup>; the growth is exponential.');
pq('bpp3', 3, 'PCR', 'How long do 10 cycles take?', '30 minutes', ['10 minutes', '3 minutes', '60 minutes'], 'Time = 10 cycles &times; 3 min = 30 minutes.');
pq('bpp3', 4, 'PCR', 'If the target is amplified for many more cycles, the yield eventually stops rising exponentially mainly because', 'primers, nucleotides and active enzyme are used up', ['the DNA becomes positively charged', 'the primers stick to the gel', 'Taq polymerase turns into a ligase'], 'Reagents become limiting and the template strands start to re-anneal with each other, so the curve flattens (plateau).');

// numeric items
nat(2, 'restriction', 'A linear DNA molecule has 3 recognition sites for an enzyme. How many fragments are formed on complete digestion?', 4, 'Idea: each cut in a linear molecule makes one extra piece. Fragments = cuts + 1 = 3 + 1 = 4.');
nat(2, 'restriction', 'A circular plasmid has 4 recognition sites for an enzyme. How many fragments are formed on complete digestion?', 4, 'Idea: a circle has no ends, so each cut adds a piece only after the ring opens. Fragments = number of cuts = 4.', null, 'Do not add 1 for circular DNA.');
nat(3, 'restriction', 'A restriction enzyme has a 4-base recognition sequence. On average, one site is expected in every how many base pairs of random DNA?', 256, 'Idea: the chance of a particular base at each of the 4 positions is 1/4. Chance of the whole sequence = (1/4)<sup>4</sup> = 1/256. So one site per 4<sup>4</sup> = 256 bp.', 'bp');
nat(3, 'restriction', 'A 6-base cutter is used on random DNA of 24 576 bp. How many recognition sites are expected on average?', 6, 'Idea: one site per 4<sup>6</sup> = 4096 bp. Sites = 24576 / 4096 = 6.');
nat(3, 'restriction', 'How many different 6-base-pair palindromic recognition sequences are possible? (Hint: the first three bases fix the other three.)', 64, 'Idea: in a palindrome the last three bases are the complement of the first three, in reverse. The first three bases can be chosen in 4<sup>3</sup> = 64 ways, so 64 palindromes.');
nat(2, 'restriction', 'The six-base EcoRI site leaves a single-stranded overhang of how many bases on each fragment end?', 4, 'EcoRI cuts G^AATTC on each strand. The overhang is AATT, which is four bases.');
nat(2, 'PCR', 'One double-stranded DNA molecule is amplified for 8 cycles with perfect efficiency. How many copies are formed?', 256, 'Idea: copies double each cycle. 2<sup>8</sup> = 256.');
nat(3, 'PCR', 'What is the minimum number of PCR cycles needed to make more than one million copies of a target from a single template molecule?', 20, 'Idea: find the smallest n with 2<sup>n</sup> &gt; 10<sup>6</sup>. 2<sup>19</sup> = 524 288 (too few) and 2<sup>20</sup> = 1 048 576 (enough). So n = 20.');
nat(3, 'PCR', 'A reaction starts with 5 template molecules. After how many cycles will there be 5120 copies?', 10, 'Idea: copies = 5 &times; 2<sup>n</sup> = 5120, so 2<sup>n</sup> = 1024 and n = 10.');
nat(3, 'PCR', 'A PCR machine runs 30 cycles of 2.5 minutes each. How many minutes will the full run take?', 75, 'Time = 30 &times; 2.5 = 75 minutes.', 'min');
nat(3, 'PCR', 'How many different primers are needed to amplify one chosen stretch of double-stranded DNA?', 2, 'One primer pairs with each strand at the opposite ends of the target (forward and reverse), so two primers.');
nat(3, 'gel electrophoresis', 'A linear 8.0 kb DNA is cut into three fragments. Two fragments measure 3.2 kb and 1.5 kb. What is the size of the third fragment (kb)?', 3.3, 'Idea: the fragments add up to the total. 8.0 - 3.2 - 1.5 = 3.3 kb.', 'kb', null, 0.01);
nat(3, 'gel electrophoresis', 'A circular plasmid of 7.5 kb is cut at two sites and gives a 2.4 kb fragment and one more. What is the size of the other fragment (kb)?', 5.1, 'Idea: a circle cut twice gives two pieces that add up to the whole. 7.5 - 2.4 = 5.1 kb.', 'kb', null, 0.01);
nat(3, 'selection', 'In a blue-white screen, 240 colonies grew on the ampicillin plate and 36 of them were blue. What percentage of colonies are recombinant (white)?', 85, 'Idea: white colonies are recombinant. White = 240 - 36 = 204. 204/240 &times; 100 = 85%.', '%');
nat(4, 'transformation', 'A student transformed competent cells with 50 ng (0.05 &micro;g) of plasmid and obtained 1500 colonies. What is the transformation efficiency in colonies per &micro;g of DNA?', 30000, 'Idea: efficiency = colonies / micrograms DNA = 1500 / 0.05 = 30 000 colonies per &micro;g.', 'colonies per &micro;g');
nat(3, 'restriction', 'Lambda phage DNA (linear) has 5 EcoRI sites. How many fragments are formed on complete digestion?', 6, 'Linear DNA: fragments = sites + 1 = 6.');
nat(4, 'restriction', 'A linear DNA has 2 sites for enzyme X and 3 different sites for enzyme Y, and none of the five sites coincide. How many fragments are formed after digestion with both enzymes together?', 6, 'Idea: count all cuts: 2 + 3 = 5. For linear DNA, fragments = 5 + 1 = 6.', null, 'Count the cuts of both enzymes together, not separately.');
nat(4, 'restriction', 'The same five distinct sites (2 for enzyme X and 3 for enzyme Y) lie on a circular plasmid. How many fragments after digestion with both enzymes?', 5, 'Circular: fragments = cuts = 5.');
nat(5, 'PCR', 'Starting from one double-stranded template, how many double-stranded molecules of EXACTLY the target length exist after 5 perfectly efficient PCR cycles?', 22, 'Idea: after n cycles there are 2<sup>n</sup> double-stranded molecules in all. Only 2n of them still contain a strand that is longer than the target (the two original molecules plus the products of the first cycles); every other molecule is exactly the target length. Exact-length molecules = 2<sup>n</sup> - 2n = 32 - 10 = 22.', null, 'The first products are longer than the target; exact-length products first appear in cycle 3, so cycle 1 and 2 give zero.');
nat(5, 'PCR', 'Starting from three template molecules (double-stranded), how many copies would be present after 25 perfectly efficient cycles?', 100663296, 'Copies = 3 &times; 2<sup>25</sup> = 3 &times; 33 554 432 = 100 663 296.');
nat(4, 'vectors', 'pBR322 is 4361 bp long. A 1.2 kb (1200 bp) insert is ligated into it. How many kb is the recombinant plasmid, to two decimals?', 5.56, 'Idea: sizes add. 4361 + 1200 = 5561 bp = 5.56 kb.', 'kb', null, 0.01);
nat(4, 'restriction', 'A random DNA of 8192 bp is cut by a 6-base cutter. About how many recognition sites are expected on average?', 2, 'Sites = 8192 / 4096 = 2.');

// ---------------------------------------------------------------- Level 4
mc(4, 'enzymes', 'Which of the following 6-base sequences (written 5\' to 3\') is a palindromic recognition sequence?', 'CTGCAG', ['CTGCAA', 'GAATTT', 'ATGCAA'], 'Check by writing the complementary strand and reading it 5\' to 3\'. For CTGCAG the complement read 5\' to 3\' is CTGCAG again, so it is a palindrome (PstI site). In the other three the two strands read differently.', 'Do not just look for a mirror image of the letters; the second strand must be read 5\' to 3\'.');
mc(4, 'enzymes', 'The DNA strand 5\'-ATGGCCTA-3\' is paired with a complementary strand. Read in its own 5\' to 3\' direction, the complementary strand is', '5\'-TAGGCCAT-3\'', ['5\'-TACCGGAT-3\'', '5\'-ATGGCCTA-3\'', '5\'-UACCGGAU-3\''], 'Pair the bases: A-T, T-A, G-C, G-C, C-G, C-G, T-A, A-T gives 3\'-TACCGGAT-5\'. Reading from the other end, 5\' to 3\', gives TAGGCCAT.', 'TACCGGAT is correct but written 3\' to 5\'.');
mc(4, 'enzymes', 'A DNA fragment with EcoRI sticky ends cannot be joined by base pairing of overhangs to a vector cut with BamHI because', 'the single-stranded overhangs of the two enzymes are not complementary', ['EcoRI fragments have no phosphate groups', 'BamHI leaves blunt ends only', 'ligase works only on circular DNA'], 'EcoRI leaves AATT overhangs and BamHI leaves GATC overhangs. These cannot pair, so the same enzyme (or a compatible pair) must be used for the vector and the insert.');
mc(4, 'vectors', 'A scientist inserts a gene in a restriction site which lies outside both the ampR and tetR genes of a plasmid. Transformed cells will', 'grow on both antibiotics, so recombinants cannot be picked by antibiotic resistance alone', ['grow on neither antibiotic', 'grow only on ampicillin', 'grow only on tetracycline'], 'No marker is inactivated. Both resistance genes still work in recombinant and non-recombinant cells, so another way (such as colour) is needed.');
mc(4, 'vectors', 'Why must ampicillin be present in the plate used for blue-white screening?', 'it kills the cells which did not take up any plasmid', ['it makes the substrate blue', 'it makes the vector replicate', 'it increases the pore size'], 'Both blue and white colonies come from cells with a plasmid carrying ampR. Ampicillin removes cells without a plasmid, so that colour can be used to separate recombinant from non-recombinant plasmids.');
mc(4, 'vectors', 'A plasmid with a deletion of its ori is put into bacteria. The most likely result is that', 'the plasmid will not replicate and will be lost as cells divide', ['it will replicate more quickly', 'the cells will turn blue', 'the plasmid will integrate into the cell wall'], 'Without an ori there is no replication start point, so the plasmid cannot be copied and is diluted out.');
mc(4, 'vectors', 'Which feature of a vector helps in controlling the number of copies of the vector in the cell?', 'ori', ['selectable marker', 'cloning site', 'recognition site for ligase'], 'The ori sequence is where replication starts and it also determines the copy number of the plasmid.');
mc(4, 'vectors', 'Agrobacterium-mediated gene transfer works best for dicots because', '<i>Agrobacterium</i> naturally infects dicot plants and moves its T-DNA into their cells', ['monocots lack cell walls', 'dicot cells have no nucleus', 'Ti plasmid replicates only in animals'], '<i>Agrobacterium tumefaciens</i> is a natural genetic engineer of dicots, delivering a segment of its Ti plasmid. Monocots were harder to transform by this route, so other methods like the gene gun are used.');
mc(4, 'PCR', 'In the annealing step of PCR the temperature is lowered mainly so that', 'the primers can pair with their complementary sequences on the single-stranded template', ['the polymerase can be destroyed', 'the DNA can re-form the double helix fully', 'the nucleotides turn into primers'], 'At the lower temperature, short primers form hydrogen bonds with the template ends. The polymerase then extends from these primers.', 'Do not mix up annealing (primers pair) with extension (nucleotides added).');
mc(4, 'mixed', 'In PCR, new DNA strands are made in the', '5\' to 3\' direction by adding nucleotides at the 3\' end of the primer', ['3\' to 5\' direction by adding nucleotides at the 5\' end', 'both directions at the same time', '5\' to 3\' direction by adding nucleotides at the 5\' end of the primer'], 'Every DNA polymerase needs a free 3\'-OH group and extends only at the 3\' end. This is why primers are needed.');
mc(4, 'gel electrophoresis', 'Two DNA fragments of 500 bp and 5000 bp are run on the same agarose gel for a short time. Which is true?', 'the 500 bp fragment is closer to the anode end of the gel', ['the 5000 bp fragment travels farther', 'both fragments stay in the well', 'both travel the same distance'], 'The shorter fragment moves through the sieve-like gel faster and travels farther towards the positive end.');
mc(4, 'gel electrophoresis', 'Which sequence of steps best describes how a DNA fragment is purified for cloning?', 'cut with restriction enzyme, run on agarose gel, stain and view under UV, cut out the band and elute', ['stain with Gram stain, boil, centrifuge', 'run on gel, then cut with ethanol', 'add ligase, then run on gel, then stain'], 'Cutting is first, then separation on the gel; ethidium bromide staining and UV light show the bands; the band is cut out and the DNA eluted.');
mc(4, 'bioreactor', 'A bioreactor is preferred over a shake flask for industrial production mainly because it', 'allows large volumes with control of temperature, pH and oxygen', ['gives more genes per cell', 'stops cells from dividing', 'lets us skip downstream processing'], 'A bioreactor gives optimal growth conditions (temperature, pH, substrate, salts, vitamins, oxygen) and handles large volumes, so the product is made in bulk.');
mc(4, 'downstream', 'A recombinant protein is to be sold as a drug. Which is the correct order after culture in the bioreactor?', 'separation and purification, formulation with preservatives, clinical trials, quality control', ['clinical trials, then culture, then purification', 'formulation, culture, separation', 'quality control, then gel electrophoresis, then ligation'], 'Downstream processing begins with separation and purification of the product, then formulation (with preservatives), then clinical trials and quality control tests.');
mc(4, 'isolation', 'Chilled ethanol is added to the cell lysate after protease and ribonuclease treatment. What do we see?', 'fine thread-like DNA that can be spooled out', ['clear solution with no change', 'blue colour in solution', 'red precipitate of protein only'], 'DNA is insoluble in cold ethanol and appears as fine, white threads which can be removed with a glass rod.');
mc(4, 'principles', 'Why is recombinant DNA technology said to be possible only after the discovery of restriction enzymes and the invention of vectors?', 'cutting at specific sites and carrying the DNA into a host which can replicate it were both needed', ['viruses were missing before', 'DNA could not be seen without them', 'bacteria were unknown'], 'Specific cutting gives defined fragments and the vector (with an ori) provides replication in the host.');
mc(4, 'vectors', 'Which one of these is NOT a feature that makes pBR322 a good vector?', 'its large size of several hundred kb', ['an origin of replication', 'two antibiotic-resistance markers', 'unique restriction sites in marker genes'], 'pBR322 is small (4361 bp), which helps handling. Its ori, markers and unique sites make selection possible.');
mc(4, 'host', 'During heat shock, the recombinant DNA gets into the competent bacterial cell most likely through', 'pores in the cell wall and membrane, widened by calcium treatment', ['the flagellum', 'the nucleus', 'spores'], 'The temperature jump helps DNA pass through the pores which calcium ions have made larger.');

asr(4, 'PCR', 'In PCR, one cycle of denaturation, annealing and extension doubles the number of target copies.', 'Each newly formed DNA strand acts as a template in the next cycle.', 0, 'Because new strands are used as templates again, copying is exponential, so the doubling is explained.');
asr(5, 'PCR', 'The very first PCR cycle does not make any DNA molecule exactly equal to the target length.', 'The first-cycle products start at the primer but have no fixed end because the polymerase runs on beyond the other primer site.', 0, 'In cycle 1 each new strand runs on past the target end, as there is no second primer site on the new strand yet. Exact-length strands are made first in cycle 2 and exact double strands in cycle 3. R explains A.');
asr(5, 'vectors', 'On a plate with ampicillin but WITHOUT any chromogenic substrate, recombinant and non-recombinant colonies cannot be told apart by appearance.', 'The lacZ product only gives a colour when it acts on a chromogenic substrate.', 0, 'The enzyme is made or not made inside the cells, but with no substrate the colonies look alike. R explains A.');
asr(4, 'enzymes', 'A restriction enzyme which recognises a 4-base site cuts DNA more often than one which recognises a 6-base site.', 'On average a given 4-base sequence occurs once in 256 bp, and a 6-base sequence once in 4096 bp.', 0, 'Shorter sites occur more frequently by chance. The numbers in R give 4<sup>4</sup> and 4<sup>6</sup> as the average spacing.');
stm(4, 'vectors', 'In pBR322, a foreign gene inserted at the BamHI site inactivates the tetracycline-resistance gene.', 'Cells with such a recombinant plasmid will die in the presence of ampicillin.', 2, 'BamHI is inside tetR, so tetracycline resistance is lost. But ampR is intact, so cells survive on ampicillin. Statement II is wrong.');
stm(4, 'PCR', 'Taq polymerase can be reused through the cycles because it is not denatured at high temperature.', 'DNA polymerase adds nucleotides to the 5\' end of a primer.', 2, 'I is correct. II is wrong: nucleotides are added at the 3\' end of the primer.', 'II mirrors the correct line with the end swapped.');
stm(5, 'host', 'Calcium chloride treatment makes bacterial cells resistant to ampicillin.', 'Taq polymerase was isolated from the thermophilic bacterium <i>Thermus aquaticus</i>.', 3, 'Calcium makes cells competent (more DNA uptake) but gives no resistance, so I is wrong. II is correct.', 'Competent is not the same as resistant.');

// ---------------------------------------------------------------- Level 5
mc(5, 'principles', 'Arrange the steps of making a recombinant protein: (i) ligation of the DNA fragment into a vector, (ii) isolation of DNA, (iii) transfer of the recombinant DNA into the host, (iv) cutting DNA with restriction enzymes, (v) culture of host cells in a bioreactor, (vi) amplification of the gene by PCR, (vii) downstream processing.', '(ii), (iv), (vi), (i), (iii), (v), (vii)', ['(ii), (iv), (i), (vi), (iii), (v), (vii)', '(iv), (ii), (vi), (i), (v), (iii), (vii)', '(ii), (vi), (iv), (i), (iii), (vii), (v)'], 'DNA is isolated, cut, the desired gene is amplified by PCR, ligated into the vector, introduced into the host, the host is cultured in large volume and then the product is purified (downstream).', 'The gene is amplified before ligation into the vector, not afterwards.');
mc(5, 'vectors', 'A plasmid carries ampR and a lacZ gene with a cloning site inside lacZ. Competent cells with no plasmid (and which form white colonies on substrate) are spread on a plate WITHOUT ampicillin but with substrate. Which colonies appear?', 'white (untransformed and recombinant) and blue (non-recombinant) colonies', ['only blue colonies', 'only white recombinant colonies', 'no colonies'], 'Without ampicillin, cells that never took up a plasmid also survive, and they are white because they have no working lacZ in this host. So white colonies are no longer proof of a recombinant plasmid.', 'Ampicillin is what makes "white = recombinant" valid.');
mc(5, 'vectors', 'Which of these insertion sites in pBR322 gives colonies that are tetracycline-resistant but ampicillin-sensitive?', 'PstI', ['BamHI', 'SalI', 'a site in the <i>rop</i> gene region only'], 'PstI and PvuI lie in ampR. BamHI and SalI lie in tetR, so insertion there gives ampicillin-resistant, tetracycline-sensitive cells.');
mc(5, 'mixed', 'A researcher uses the Ti plasmid to transfer a gene but forgets to remove the T-DNA tumour genes. The likely result is', 'transformed plant cells form a tumour (crown gall) instead of growing normally', ['animal cells will form tumours', 'no DNA will be transferred', 'the plasmid becomes a retrovirus'], 'The wild-type T-DNA carries genes that make the plant cell divide and produce opines. Disarming removes these genes.');
mc(5, 'enzymes', 'A linear 12 kb DNA has recognition sites for enzyme A at 2 kb and 9 kb, and for enzyme B at 5 kb (all measured from the left end). The shortest fragment after a digest with A and B together is', '2 kb', ['3 kb', '4 kb', '5 kb'], 'The cuts are at 2, 5 and 9 kb, so the fragments are 0-2 (2 kb), 2-5 (3 kb), 5-9 (4 kb) and 9-12 (3 kb). The shortest is 2 kb.', 'Remember the two ends of the DNA at 0 and 12 kb when listing the fragments.');
mc(5, 'vectors', 'A 4.0 kb circular vector has one EcoRI site (position 0) and one HindIII site 1.0 kb clockwise from it. A 2.0 kb EcoRI insert, with one HindIII site 0.5 kb from one of its ends, is ligated into the EcoRI site. A HindIII digest of one recombinant gives fragments of 1.5 kb and 4.5 kb. This means that', 'the insert went in with its HindIII site 1.5 kb from the vector EcoRI site that lies at position 0', ['the insert went in with its HindIII site 0.5 kb from the junction at position 0', 'the vector has no insert', 'the insert is absent but the vector is doubled'], 'Total size is 6.0 kb. The vector HindIII site is 1.0 kb past the insert, at 3.0 kb. Orientation 1 puts the insert site at 0.5 kb: fragments 2.5 and 3.5 kb. Orientation 2 puts it at 1.5 kb: fragments 1.5 and 4.5 kb. The observed 1.5 + 4.5 fits orientation 2.', 'A single-enzyme cloning gives insert in either orientation; a second enzyme is used to tell which.');
mc(5, 'enzymes', 'A vector and an insert were both cut with EcoRI only and ligated. Which statement is correct?', 'the insert can join in either orientation, and the vector can also close on itself without an insert', ['the insert can join in only one orientation', 'the vector cannot close on itself', 'the ligase will break the sticky ends'], 'Both EcoRI ends of the insert are identical, so it can go in either way. The two ends of the cut vector are also complementary to each other, so it can re-close without an insert.', 'Using two different enzymes would give directional cloning.');
mc(5, 'enzymes', 'The overhanging ends made by EcoRI are held together only by weak hydrogen bonds. The function of DNA ligase then is to', 'form phosphodiester bonds in the sugar-phosphate backbone, making the join permanent', ['add new hydrogen bonds between all bases', 'cut the overhangs', 'add methyl groups'], 'Hydrogen bonds between the four base pairs of the overhang are weak. Ligase seals the nicks with phosphodiester bonds.');
mc(5, 'enzymes', 'EcoRI cuts the top strand 5\'-G^AATTC-3\'. The bottom strand of the same site, read 3\' to 5\', is CTTAAG. Where is the cut on the bottom strand?', 'between A and G at the right-hand end: 3\'-CTTAA^G-5\'', ['between C and T at the left end', 'in the middle between T and T', 'there is no cut on the bottom strand'], 'The bottom strand read 5\' to 3\' is also GAATTC and is cut between G and A. Written 3\' to 5\' that is CTTAA^G. The two cuts are staggered by four bases, giving AATT overhangs.');
mc(5, 'mixed', 'Which of these is a difference between DNA copying in a PCR tube and DNA replication in a cell?', 'PCR uses short synthetic primers and heat to separate strands, while the cell uses RNA primers and helicase', ['PCR makes RNA, the cell makes DNA', 'PCR copies the whole genome, the cell copies a short region', 'PCR needs no polymerase'], 'In PCR the strands are separated by heating and the primers are chemically made DNA. In the cell helicase unwinds the helix and RNA primers are made by primase.');
mc(5, 'mixed', 'A plant cell which has received a gene through the disarmed Ti plasmid grows into a whole transgenic plant on a culture medium. This is possible because', 'plant cells are totipotent', ['plant cells have no cell wall', 'Ti plasmid makes the cell a stem cell of animals', 'Taq polymerase is active in the medium'], 'Totipotency is the ability of a living plant cell to regenerate into a complete plant. It is why transformed single cells can be used for creating transgenic plants.');
mc(5, 'mixed', 'Large vessels used in industries to produce antibiotics and enzymes by growing microbes are essentially', 'bioreactors (fermentors)', ['gel tanks', 'thermal cyclers', 'protoplast fusers'], 'The large-scale growth of microbes in a vessel with controlled mixing, oxygen, temperature and pH is the same idea as a bioreactor used for recombinant products.');
mc(5, 'restriction', 'An enzyme recognising an 8-base site is used on random DNA. On average the spacing between two sites is about', '65 536 bp', ['4096 bp', '256 bp', '16 384 bp'], 'Average spacing is 4<sup>8</sup> = 65 536 bp, since each added base multiplies the length by 4.', 'Each extra base multiplies the spacing by 4, not by 2.');
mc(5, 'principles', 'Which pair of technique and purpose is correctly matched?', 'Gel electrophoresis, separating DNA fragments by size', ['PCR, cutting DNA at palindromes', 'Biolistics, introducing DNA into bacteria by heat', 'Downstream processing, making plasmids replicate'], 'Gel electrophoresis separates fragments by size. PCR amplifies DNA, biolistics is used on plant cells and downstream processing purifies the product.');

nat(4, 'PCR', 'Ten template molecules are to be amplified to more than 10<sup>9</sup> copies. What is the minimum number of cycles needed?', 27, 'Need 10 &times; 2<sup>n</sup> &gt; 10<sup>9</sup>, so 2<sup>n</sup> &gt; 10<sup>8</sup>. 2<sup>26</sup> = 67 108 864 (too small), 2<sup>27</sup> = 134 217 728. So n = 27.');
nat(4, 'bioreactor', 'A culture doubles every 20 minutes during its log phase. If a 1000 L bioreactor starts with 10<sup>3</sup> cells per mL, how many cells per mL are there after 2 hours of growth?', 64000, 'Idea: 2 hours = 120 min = 6 doublings. Cells = 10<sup>3</sup> &times; 2<sup>6</sup> = 64 000 per mL.', 'cells/mL');
nat(5, 'restriction', 'A random genome fragment of 48 500 bp is cut by a six-base restriction enzyme. What is the average expected number of sites, to two decimals?', 11.84, 'Expected sites = 48 500 / 4096 = 11.84.', null, null, 0.01);
nat(5, 'restriction', 'A restriction enzyme is expected to cut a random DNA once every 1024 bp on average. How many bases does its recognition site have? (assume each base is equally likely)', 5, 'Spacing = 4<sup>k</sup> = 1024 gives k = 5 (4<sup>5</sup> = 1024).');

// ---------------------------------------------------------------- templates
const CUT = [['EcoRI', 'Escherichia', 'coli'], ['HindIII', 'Haemophilus', 'influenzae'], ['BamHI', 'Bacillus', 'amyloliquefaciens'], ['SalI', 'Streptomyces', 'albus'], ['PvuI', 'Proteus', 'vulgaris'], ['TaqI', 'Thermus', 'aquaticus'], ['SmaI', 'Serratia', 'marcescens'], ['ClaI', 'Caryophanon', 'latum']];
const COMP = { A: 'T', T: 'A', G: 'C', C: 'G' };
const rc = (s) => [...s].reverse().map((c) => COMP[c]).join('');
const comp = (s) => [...s].map((c) => COMP[c]).join('');
const BASES = 'ACGT';
const rndSeq = (rng, k) => Array.from({ length: k }, () => BASES[Math.floor(rng() * 4)]).join('');
const C2 = (a, b) => { let r = 1; for (let i = 1; i <= b; i++) r = (r * (a - b + i)) / i; return Math.round(r); };

const gens = [
  {
    id: 'bp-g01', type: 'nat', level: 2, format: 'integer', exams: ['neet'], sub: 'restriction fragments',
    make(rng) {
      const s = int(rng, 1, 7);
      const circ = rng() < 0.5;
      const ans = circ ? s : s + 1;
      return { s, circ, q: `A ${circ ? 'circular plasmid' : 'linear DNA molecule'} has ${s} recognition site${s > 1 ? 's' : ''} for a restriction enzyme. How many fragments are formed on complete digestion?`, answer: ans, tol: 0, sol: circ ? `Idea: a circular molecule has no ends, so every cut makes one piece after the ring opens. Fragments = number of cuts = ${s}.` : `Idea: in a linear molecule each cut adds one piece. Fragments = cuts + 1 = ${s} + 1 = ${ans}.` };
    },
    verify(p) { let pieces = 1; for (let i = 0; i < p.s; i++) pieces += 1; return p.circ ? pieces - 1 : pieces; },
  },
  {
    id: 'bp-g02', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'site frequency',
    make(rng) {
      const k = choose(rng, [4, 5, 6]);
      const m = int(rng, 2, 12);
      const L = m * 4 ** k;
      return { k, m, L, q: `A restriction enzyme recognises a ${k}-base-pair sequence. In a random DNA of ${L.toLocaleString('en-US').replace(/,/g, ' ')} bp, about how many recognition sites are expected on average? (All four bases are equally likely.)`, answer: m, tol: 0, sol: `Idea: any particular ${k}-base sequence occurs about once in 4<sup>${k}</sup> bases. 4<sup>${k}</sup> = ${4 ** k}. Sites = ${L} / ${4 ** k} = ${m}.` };
    },
    verify(p) { return +(p.L * (1 / 4) ** p.k).toFixed(6); },
  },
  {
    id: 'bp-g03', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'PCR copies',
    make(rng) {
      const m = choose(rng, [1, 2, 3, 4, 5]);
      const c = int(rng, 4, 15);
      return { m, c, q: `A PCR tube starts with ${m} double-stranded template molecule${m > 1 ? 's' : ''}. Assuming every cycle doubles the DNA, how many double-stranded copies are present after ${c} cycles?`, answer: m * 2 ** c, tol: 0, sol: `Idea: each cycle doubles the number. Copies = ${m} &times; 2<sup>${c}</sup> = ${m} &times; ${2 ** c} = ${m * 2 ** c}.` };
    },
    verify(p) { let x = p.m; for (let i = 0; i < p.c; i++) x *= 2; return x; },
  },
  {
    id: 'bp-g04', type: 'nat', level: 4, format: 'integer', exams: ['neet'], sub: 'PCR copies',
    make(rng) {
      const m = choose(rng, [1, 2, 4, 5, 10]);
      const n = int(rng, 8, 24);
      const T = m * 2 ** (n - 1) + int(rng, 1, m * 2 ** (n - 1));
      return { m, n, T, q: `PCR starts with ${m} template molecule${m > 1 ? 's' : ''} and doubles the DNA every cycle. What is the minimum number of cycles needed to get at least ${T.toLocaleString('en-US').replace(/,/g, ' ')} copies?`, answer: n, tol: 0, sol: `Idea: find the smallest n with ${m} &times; 2<sup>n</sup> &ge; ${T}. After ${n - 1} cycles there are ${m * 2 ** (n - 1)} copies, which is too few. After ${n} cycles there are ${m * 2 ** n}, which is enough. So n = ${n}.` };
    },
    verify(p) { let n = 0, x = p.m; while (x < p.T) { x *= 2; n++; } return n; },
  },
  {
    id: 'bp-g05', type: 'nat', level: 2, format: 'integer', exams: ['neet'], sub: 'PCR time',
    make(rng) {
      const d = choose(rng, [30, 45, 60]), a = choose(rng, [30, 45, 60]), e = choose(rng, [60, 90, 120]);
      const c = choose(rng, [20, 25, 30, 35, 40]);
      const total = (d + a + e) * c;
      return { d, a, e, c, total, q: `In a PCR program, denaturation takes ${d} s, annealing ${a} s and extension ${e} s in every cycle. How many minutes do ${c} cycles take? (Ignore the time to change temperature.)`, answer: total / 60, tol: 0.01, unit: 'min', sol: `Idea: add the three steps for one cycle, multiply by the cycles, convert to minutes. One cycle = ${d} + ${a} + ${e} = ${d + a + e} s. ${c} cycles = ${total} s = ${fmt(total / 60, 4)} min.` };
    },
    verify(p) { return (p.c * p.d + p.c * p.a + p.c * p.e) / 60; },
  },
  {
    id: 'bp-g06', type: 'nat', level: 3, format: 'numeric', exams: ['neet'], sub: 'gel band reading',
    make(rng) {
      const circ = rng() < 0.5;
      const total = pick(rng, 4, 12, 0.5);
      const k = circ ? int(rng, 3, 4) : int(rng, 3, 4);
      let parts = []; let left = total;
      for (let i = 0; i < k - 1; i++) { const max = left - (k - 1 - i) * 0.5; const v = pick(rng, 0.5, Math.max(0.5, Math.floor(max * 2) / 2 - 0.5 * 0), 0.5); const x = Math.min(v, Math.floor((left - (k - 1 - i) * 0.5) * 2) / 2); parts.push(x); left = +(left - x).toFixed(2); }
      const missing = +left.toFixed(2);
      return { circ, total, parts, missing, q: `A ${circ ? 'circular plasmid' : 'linear DNA'} of ${total} kb is digested and gives ${k} fragments on the gel. Three bands are read as ${parts.join(' kb, ')} kb${k === 3 ? '' : ''}${k > parts.length + 1 ? '' : ''}. What is the size of the remaining fragment (kb)?`.replace('Three bands are read as', `${parts.length} of the bands are read as`), answer: missing, tol: 0.01, unit: 'kb', sol: `Idea: the fragments add up to the total length, whether the molecule was linear or circular. Remaining = ${total} - (${parts.join(' + ')}) = ${missing} kb.` };
    },
    verify(p) { return +(p.total - p.parts.reduce((a, b) => a + b, 0)).toFixed(2); },
  },
  {
    id: 'bp-g07', type: 'nat', level: 3, format: 'numeric', exams: ['neet'], sub: 'gel band reading',
    make(rng) {
      const L = pick(rng, 6, 14, 1);
      const p1 = pick(rng, 1, Math.floor(L / 2), 0.5);
      const p2 = pick(rng, p1 + 1, L - 1, 0.5);
      const which = choose(rng, ['largest', 'smallest']);
      const fr = [p1, +(p2 - p1).toFixed(2), +(L - p2).toFixed(2)];
      const ans = which === 'largest' ? Math.max(...fr) : Math.min(...fr);
      return { L, p1, p2, which, q: `A linear DNA of ${L} kb has two recognition sites at ${p1} kb and ${p2} kb from its left end. After complete digestion, what is the size of the ${which} fragment (kb)? ${which === 'smallest' ? 'It travels the farthest in the gel.' : 'It stays closest to the wells.'}`, answer: ans, tol: 0.01, unit: 'kb', sol: `Idea: cut positions divide the molecule into three pieces: ${p1}, ${p2} - ${p1} = ${fr[1]} and ${L} - ${p2} = ${fr[2]} kb. The ${which} is ${ans} kb.` };
    },
    verify(p) { const a = [p.p1, p.p2 - p.p1, p.L - p.p2]; return +(p.which === 'largest' ? Math.max(...a) : Math.min(...a)).toFixed(2); },
  },
  {
    id: 'bp-g08', type: 'nat', level: 4, format: 'integer', exams: ['neet'], sub: 'gel band reading',
    make(rng) {
      const L = choose(rng, [6, 8, 9, 10, 12]);
      const k = int(rng, 3, 5);
      // choose cut positions on a circle in 0.5 kb steps, all distinct
      const cuts = new Set();
      while (cuts.size < k) cuts.add(int(rng, 1, L * 2 - 1) / 2);
      const c = [...cuts].sort((a, b) => a - b);
      const frag = c.map((x, i) => +((i === c.length - 1 ? c[0] + L - x : c[i + 1] - x)).toFixed(2));
      const bands = new Set(frag).size;
      return { L, c, frag, bands, q: `A circular plasmid of ${L} kb is cut at ${k} sites located at ${c.join(', ')} kb from a reference point. How many DISTINCT bands appear in the gel lane? (Fragments of equal size run together as one band.)`, answer: bands, tol: 0, sol: `Idea: a circle cut at ${k} places gives ${k} fragments. Their sizes are ${frag.join(', ')} kb. The number of different sizes is ${bands}, so there are ${bands} band${bands > 1 ? 's' : ''}.`, trap: 'Equal-sized fragments make a single (thicker) band.' };
    },
    verify(p) { const c = p.c; const f = []; for (let i = 0; i < c.length; i++) f.push(+(((c[(i + 1) % c.length] - c[i] + p.L) % p.L) || p.L).toFixed(2)); return new Set(f).size; },
  },
  {
    id: 'bp-g09', type: 'mcq', level: 2, format: 'single', exams: ex(2), sub: 'enzyme naming',
    make(rng) {
      const [name, genus, sp] = choose(rng, CUT);
      const first = name[0], two = name.slice(1, 3);
      const mode = choose(rng, ['genus', 'species']);
      const others = CUT.filter((x) => x[0] !== name);
      const wr = [];
      for (const o of others) { const t = mode === 'genus' ? o[1] : o[2]; if (wr.length < 3 && !wr.includes(t)) wr.push(t); }
      const correct = mode === 'genus' ? genus : sp;
      const o = shuffleOpts(rng, `<i>${correct}</i>`, wr.map((w) => `<i>${w}</i>`));
      return { name, mode, q: `The restriction enzyme ${name} is named from the bacterium <i>${genus} ${sp}</i>. In the enzyme name, the letter${mode === 'genus' ? ' "' + first + '"' : 's "' + two + '"'} stand${mode === 'genus' ? 's' : ''} for the ${mode}. Which is it?`, options: o.options, answer: o.answer, sol: `Idea: enzyme names take the first letter of the genus and the first two letters of the species, then the strain letter and a roman numeral for the order of isolation. So ${mode === 'genus' ? `"${first}" is from <i>${genus}</i>` : `"${two}" is from <i>${sp}</i>`}.`, correctText: correct };
    },
    verify(p) { return p.options.findIndex((o) => o === `<i>${p.correctText}</i>`); },
  },
  {
    id: 'bp-g10', type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'palindromes',
    make(rng) {
      const half = rndSeq(rng, 3);
      const pal = half + rc(half);
      const wrongs = new Set();
      while (wrongs.size < 3) {
        const s = rndSeq(rng, 6);
        if (s !== rc(s)) wrongs.add(s);
      }
      const o = shuffleOpts(rng, pal, [...wrongs]);
      return { pal, q: 'Which of these 6-base sequences (written 5\' to 3\') could be the recognition site of a restriction enzyme because it is palindromic?', options: o.options, answer: o.answer, sol: `Idea: write the complementary strand and read it 5\' to 3\'. If it gives the same sequence, the site is palindromic. ${pal}: its complement read 5\' to 3\' is ${rc(pal)}, the same sequence. The others change when their complement is read 5\' to 3\'.`, trap: 'The mirror image of the letters is not enough; the second strand is the complement, read 5\' to 3\'.' };
    },
    verify(p) { return p.options.findIndex((s) => s === rc(s)); },
  },
  {
    id: 'bp-g11', type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'complementary strand',
    make(rng) {
      const k = int(rng, 6, 9);
      const s = rndSeq(rng, k);
      const right = rc(s);
      const wr = [...new Set([comp(s), s, [...s].reverse().join('')])].filter((x) => x !== right);
      while (wr.length < 3) { const t = rndSeq(rng, k); if (t !== right && !wr.includes(t)) wr.push(t); }
      const o = shuffleOpts(rng, `5\'-${right}-3\'`, wr.slice(0, 3).map((x) => `5\'-${x}-3\'`));
      return { s, q: `One strand of a DNA is 5\'-${s}-3\'. Written in the usual 5\' to 3\' direction, the complementary strand is`, options: o.options, answer: o.answer, sol: `Idea: pair the bases (A-T, G-C) and then reverse the result so that it reads 5\' to 3\'. Pairing gives 3\'-${comp(s)}-5\'. Reversed it is 5\'-${right}-3\'. The other options are the plain complement read the wrong way, the same strand or the reversed strand.`, trap: 'The strands are antiparallel; the complement must be reversed.' };
    },
    verify(p) { return p.options.findIndex((o) => o === `5\'-${rc(p.s)}-3\'`); },
  },
  {
    id: 'bp-g12', type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'insertional inactivation',
    make(rng) {
      const sites = [['BamHI', 'tetR'], ['SalI', 'tetR'], ['PstI', 'ampR'], ['PvuI', 'ampR']];
      const [enz, gene] = choose(rng, sites);
      const lost = gene === 'tetR' ? 'tetracycline' : 'ampicillin';
      const kept = gene === 'tetR' ? 'ampicillin' : 'tetracycline';
      const ans = `grow on ${kept} but not on ${lost}`;
      const o = shuffleOpts(rng, ans, [`grow on ${lost} but not on ${kept}`, 'grow on both antibiotics', 'grow on neither antibiotic']);
      return { enz, gene, q: `A foreign gene is ligated into the ${enz} site of pBR322. ${enz} lies inside the ${gene} gene. The recombinant plasmid is put into <i>E. coli</i> that has no resistance of its own. Cells carrying the recombinant plasmid will`, options: o.options, answer: o.answer, sol: `Idea: insertional inactivation. The insert breaks ${gene}, so resistance to ${lost} is lost. The other marker is intact, so the cells survive on ${kept} only.`, correctText: ans };
    },
    verify(p) { return p.options.findIndex((o) => o.startsWith(p.gene === 'tetR' ? 'grow on ampicillin but' : 'grow on tetracycline but')); },
  },
  {
    id: 'bp-g13', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'blue-white screening',
    make(rng) {
      const tot = choose(rng, [100, 120, 150, 200, 250, 300, 400]);
      const white = Math.round((tot * int(rng, 4, 19) * 5) / 100);
      const blue = tot - white;
      const pct = (white / tot) * 100;
      const whole = Number.isInteger(pct);
      return { tot, white, blue, pct, whole, q: `After transformation and plating on ampicillin with a chromogenic substrate, ${tot} colonies grew and ${blue} of them were blue. How many colonies are recombinant (white)?`, answer: white, tol: 0, sol: `Idea: on an ampicillin plate with substrate, blue colonies have an intact lacZ (no insert) and white colonies have an insert. White = ${tot} - ${blue} = ${white}.` };
    },
    verify(p) { return p.tot - p.blue; },
  },
  {
    id: 'bp-g14', type: 'nat', level: 4, format: 'numeric', exams: ['neet'], sub: 'transformation',
    make(rng) {
      const ng = choose(rng, [10, 20, 25, 50, 100]);
      const col = choose(rng, [200, 300, 500, 800, 1000, 2500]);
      const eff = (col / ng) * 1000;
      return { ng, col, eff, q: `Competent cells were transformed with ${ng} ng of plasmid DNA and gave ${col} colonies on the selective plate. What is the transformation efficiency in colonies per &micro;g of DNA? (1 &micro;g = 1000 ng)`, answer: eff, tol: 1, unit: 'colonies/&micro;g', sol: `Idea: efficiency = colonies / DNA in &micro;g. ${ng} ng = ${ng / 1000} &micro;g. ${col} / ${ng / 1000} = ${eff} colonies per &micro;g.`, trap: 'Convert ng to &micro;g before dividing.' };
    },
    verify(p) { return p.col / (p.ng / 1000); },
  },
  {
    id: 'bp-g15', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'bioreactor growth',
    make(rng) {
      const td = choose(rng, [20, 30, 40, 60]);
      const k = int(rng, 2, 8);
      const N0 = choose(rng, [100, 500, 1000, 2000]);
      return { td, k, N0, q: `A bacterial culture in the log phase doubles every ${td} minutes. A bioreactor is started with ${N0} cells per mL. How many cells per mL are present after ${td * k} minutes? (Assume no cell dies.)`, answer: N0 * 2 ** k, tol: 0, unit: 'cells/mL', sol: `Idea: number of doublings = time / doubling time = ${td * k} / ${td} = ${k}. Cells = ${N0} &times; 2<sup>${k}</sup> = ${N0 * 2 ** k}.` };
    },
    verify(p) { let x = p.N0; for (let i = 0; i < p.k; i++) x *= 2; return x; },
  },
  {
    id: 'bp-g16', type: 'mcq', level: 2, format: 'single', exams: ex(2), sub: 'gel electrophoresis',
    make(rng) {
      const sizes = new Set();
      while (sizes.size < 4) sizes.add(choose(rng, [0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10]));
      const s = [...sizes];
      const mode = choose(rng, ['farthest from the wells', 'closest to the wells']);
      const ans = mode === 'farthest from the wells' ? Math.min(...s) : Math.max(...s);
      const o = shuffleOpts(rng, `${ans} kb`, s.filter((x) => x !== ans).map((x) => `${x} kb`));
      return { s, mode, ans, q: `A digest gives fragments of ${s.join(' kb, ')} kb. After electrophoresis in agarose, which fragment will be found ${mode}?`, options: o.options, answer: o.answer, sol: `Idea: the gel is a sieve, so smaller fragments run farther and larger fragments stay near the wells. The smallest is ${Math.min(...s)} kb and the largest is ${Math.max(...s)} kb. The fragment ${mode} is ${ans} kb.` };
    },
    verify(p) { return p.options.findIndex((o) => o === `${p.ans} kb`); },
  },
  {
    id: 'bp-g17', type: 'mcq', level: 2, format: 'single', exams: ex(2), sub: 'isolation of DNA',
    make(rng) {
      const cells = [['bacterial cells', 'lysozyme'], ['plant cells', 'cellulase'], ['fungal cells', 'chitinase']];
      const [c, e] = choose(rng, cells);
      const o = shuffleOpts(rng, e, cells.map((x) => x[1]).filter((x) => x !== e).concat(['ribonuclease']));
      return { c, e, q: `To release the DNA from ${c}, the cell wall is first digested with`, options: o.options, answer: o.answer, sol: `Idea: each wall has a different main component, so a different enzyme is used. Bacteria: lysozyme; plants: cellulase; fungi: chitinase. For ${c} the enzyme is ${e}. Ribonuclease only removes RNA afterwards.` };
    },
    verify(p) { return p.options.indexOf(p.e); },
  },
  {
    id: 'bp-g18', type: 'nat', level: 4, format: 'numeric', exams: ['neet'], sub: 'recombinant size',
    make(rng) {
      const vec = choose(rng, [3.0, 3.5, 4.0, 4.36, 5.0]);
      const ins = pick(rng, 0.5, 3.5, 0.1);
      const del = choose(rng, [0, 0, 0.2, 0.3]);
      return { vec, ins, del, q: `A ${vec} kb vector has a small ${del} kb stretch removed in cloning (put ${del} for none) and a ${fmt(ins, 3)} kb insert is ligated in its place. What is the size of the recombinant plasmid (kb)?`.replace(` has a small ${del} kb stretch removed in cloning (put ${del} for none) and`, del ? ` loses a ${del} kb stretch when it is cut and` : ' is cut and'), answer: +(vec - del + ins).toFixed(2), tol: 0.01, unit: 'kb', sol: `Idea: the size of the recombinant = vector - removed piece + insert = ${vec} - ${del} + ${fmt(ins, 3)} = ${(vec - del + ins).toFixed(2)} kb.` };
    },
    verify(p) { return +(p.vec - p.del + p.ins).toFixed(2); },
  },
];

export default { topic: 'biotech-principles', groups, items, gens };
