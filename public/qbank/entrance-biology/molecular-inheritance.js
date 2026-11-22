// NEET UG Biology: Molecular basis of inheritance (NCERT Class 12, Chapter 6 in the 2023 rationalised book). All questions original fibub work.
import { pick, int, choose, fmt, shuffleOpts, numOpts, g } from '../_entrance.js';

const items = [];
const groups = {};
let n = 0, pos = 0;
const POS = [2, 0, 3, 1];
const nid = () => `mi-${String(++n).padStart(3, '0')}`;
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
  items.push({ id: nid(), type: 'nat', level, format: tol ? 'numeric' : 'integer', exams: ex(level), sub, q, answer, tol, ...(unit ? { unit } : {}), sol, ...(trap ? { trap } : {}) });
}

// ---------------------------------------------------------------- Level 1
mc(1, 'DNA structure', 'DNA is a polymer of', 'deoxyribonucleotides', ['ribonucleotides', 'amino acids', 'fatty acids'], 'A nucleotide has a nitrogenous base, a pentose sugar and a phosphate. In DNA the sugar is deoxyribose, so DNA is a polymer of deoxyribonucleotides.');
mc(1, 'DNA structure', 'The pentose sugar present in DNA is', 'deoxyribose', ['ribose', 'glucose', 'fructose'], 'Deoxyribose has no hydroxyl group at the 2&prime; carbon. Ribose, in RNA, has one.');
mc(1, 'DNA structure', 'Which pair of bases are pyrimidines in DNA?', 'Cytosine and thymine', ['Adenine and guanine', 'Adenine and thymine', 'Guanine and cytosine'], 'Adenine and guanine are purines (double ring). Cytosine, thymine (and uracil in RNA) are pyrimidines (single ring).');
mc(1, 'DNA structure', 'Adenine and thymine are held together in DNA by', 'two hydrogen bonds', ['one hydrogen bond', 'three hydrogen bonds', 'a covalent bond'], 'A pairs with T by two hydrogen bonds and G pairs with C by three.');
mc(1, 'DNA structure', 'The distance between two successive base pairs in the DNA double helix is', '0.34 nm', ['3.4 nm', '34 nm', '0.034 nm'], 'The pitch of the helix is 3.4 nm and one turn has 10 base pairs, so each base pair is 0.34 nm further along.');
mc(1, 'DNA structure', 'The double helix model of DNA was proposed in 1953 by', 'Watson and Crick', ['Griffith and Avery', 'Meselson and Stahl', 'Hershey and Chase'], 'James Watson and Francis Crick proposed it, using X-ray diffraction data of Maurice Wilkins and Rosalind Franklin.');
mc(1, 'genetic material', 'Griffith\'s experiments in 1928 were done on', '<i>Streptococcus pneumoniae</i>', ['<i>Escherichia coli</i>', 'bacteriophage T2', '<i>Neurospora</i>'], 'He used the S (smooth, virulent) and R (rough, non-virulent) strains of this bacterium and mice.');
mc(1, 'genetic material', 'In the Hershey-Chase experiment, the viral protein coat was labelled with', 'radioactive sulphur (<sup>35</sup>S)', ['radioactive phosphorus (<sup>32</sup>P)', 'radioactive carbon (<sup>14</sup>C)', 'heavy nitrogen (<sup>15</sup>N)'], 'Proteins contain sulphur but DNA does not. DNA contains phosphorus but proteins (mostly) do not.');
mc(1, 'DNA structure', 'According to Chargaff\'s rule, in double-stranded DNA', 'the amount of adenine equals the amount of thymine', ['the amount of adenine equals the amount of guanine', 'the amount of cytosine equals the amount of thymine', 'purines are more than pyrimidines'], 'A = T and G = C, so total purines (A + G) equal total pyrimidines (T + C).');
mc(1, 'replication', 'The enzyme that joins the discontinuously made DNA fragments on the lagging strand is', 'DNA ligase', ['DNA polymerase', 'RNA polymerase', 'helicase'], 'The short fragments are joined by DNA ligase to make a continuous strand.');
mc(1, 'transcription', 'The part of a transcription unit where RNA polymerase first binds is the', 'promoter', ['terminator', 'operator', 'intron'], 'The promoter lies at the 5&prime; end of the structural gene (upstream).');
mc(1, 'genetic code', 'The codon that acts as the start codon is', 'AUG', ['UAA', 'UGA', 'UUU'], 'AUG codes for methionine and also starts translation. UAA, UAG and UGA are stop codons.');
mc(1, 'genetic code', 'Which of these is NOT a stop codon?', 'UGG', ['UAA', 'UAG', 'UGA'], 'UGG codes for tryptophan. The three stop codons (UAA, UAG, UGA) have no tRNA.');
mc(1, 'translation', 'The tRNA is called the adapter molecule because it', 'reads the codon and carries the matching amino acid', ['carries the genetic code to ribosomes', 'forms the ribosome', 'joins DNA fragments'], 'Crick proposed that an adapter molecule reads the code and links it to an amino acid. This is tRNA.');
mc(1, 'lac operon', 'In the lac operon, the inducer is', 'lactose', ['glucose', 'repressor protein', 'RNA polymerase'], 'Lactose (an allolactose form inside the cell) binds the repressor and so switches the operon on.');
mc(1, 'Human Genome Project', 'The Human Genome Project was completed in', '2003', ['1953', '1990', '2013'], 'The project began in 1990 and took 13 years. It ended in 2003.');
mc(1, 'DNA fingerprinting', 'DNA fingerprinting was developed by', 'Alec Jeffreys', ['Frederick Sanger', 'Har Gobind Khorana', 'Marshall Nirenberg'], 'Alec Jeffreys used variable-number tandem repeats as probes to show differences between people.');
mc(1, 'DNA packaging', 'Histones are rich in the basic amino acids', 'lysine and arginine', ['glutamic acid and aspartic acid', 'glycine and alanine', 'cysteine and methionine'], 'These carry positive charges, so histones bind the negatively charged DNA.');
mc(1, 'DNA structure', 'A nucleotide minus its phosphate group is called a', 'nucleoside', ['nucleic acid', 'nucleosome', 'codon'], 'Nitrogenous base + sugar = nucleoside. Adding phosphate gives a nucleotide.');

// ---------------------------------------------------------------- Level 2
mc(2, 'DNA structure', 'The bond between the nitrogenous base and the pentose sugar in a nucleotide is a', 'N-glycosidic bond', ['phosphodiester bond', 'peptide bond', 'hydrogen bond'], 'Base and sugar are joined by an N-glycosidic bond. The phosphate links sugar to sugar by phosphodiester bonds and the two strands are held by hydrogen bonds.');
mc(2, 'DNA structure', 'The two strands of the DNA double helix are', 'antiparallel and complementary', ['parallel and identical', 'parallel and complementary', 'antiparallel and identical'], 'One strand runs 5&prime; to 3&prime; and the other 3&prime; to 5&prime;. The bases of one strand pair with their partner bases in the other.');
mc(2, 'DNA structure', 'In a polynucleotide chain, the 5&prime; end carries', 'a free phosphate group on the 5&prime; carbon of the terminal sugar', ['a free OH group on the 3&prime; carbon', 'a free amino group', 'a free base'], 'The end with the free phosphate is the 5&prime; end. The other end, with a free 3&prime;-OH, is the 3&prime; end.');
mc(2, 'DNA structure', 'Which feature is found in RNA but NOT in DNA?', 'Uracil and ribose', ['Thymine and deoxyribose', 'Phosphate groups', 'Adenine'], 'RNA has ribose and uracil (instead of thymine). Both nucleic acids have phosphate and adenine.');
mc(2, 'DNA packaging', 'In eukaryotes, a nucleosome contains', 'a histone octamer wrapped by about 200 bp of DNA', ['a histone tetramer and 20 bp of DNA', 'a histone octamer and 2000 bp of DNA', 'RNA wound around a histone H1'], 'The octamer has two molecules each of H2A, H2B, H3 and H4. About 200 bp of negatively charged DNA is wrapped round it.');
mc(2, 'DNA packaging', 'Which type of chromatin is lightly stained and transcriptionally active?', 'Euchromatin', ['Heterochromatin', 'Satellite DNA', 'Nucleolus'], 'Euchromatin is loosely packed and active. Heterochromatin is densely packed, dark-stained and inactive.');
mc(2, 'genetic material', 'In the Hershey-Chase experiment, the radioactivity found inside the infected bacteria came from', 'the labelled phage DNA (<sup>32</sup>P)', ['the labelled phage protein (<sup>35</sup>S)', 'both equally', 'the bacterial cell wall'], 'Only the DNA entered the cell. The protein coats (with <sup>35</sup>S) stayed outside and were shaken off in the blender.');
mc(2, 'genetic material', 'In Griffith\'s experiment, mice injected with heat-killed S bacteria together with live R bacteria', 'died, and live S bacteria were recovered from them', ['lived', 'died, and only R bacteria were recovered', 'lived with S bacteria in the blood'], 'Some "transforming principle" from the dead S cells changed the live R cells into virulent S cells.');
mc(2, 'genetic material', 'Avery, MacLeod and McCarty showed that the transforming principle is DNA because', 'treatment with DNase stopped the transformation, but proteases and RNases did not', ['proteases stopped the transformation', 'RNase stopped the transformation', 'heat made the DNA virulent'], 'They purified the substance from S cells and destroyed one class of molecule at a time. Only losing DNA stopped transformation.');
mc(2, 'replication', 'The experiment which proved semiconservative replication of DNA was done on <i>E. coli</i> using', '<sup>15</sup>N and <sup>14</sup>N isotopes of nitrogen and centrifugation', ['<sup>32</sup>P and <sup>35</sup>S isotopes and a blender', 'radioactive thymidine on <i>Vicia faba</i> roots', 'X-ray diffraction'], 'This is the Meselson and Stahl experiment, using caesium chloride density gradient centrifugation.');
mc(2, 'replication', 'DNA polymerase adds nucleotides only in the direction', '5&prime; to 3&prime;', ['3&prime; to 5&prime;', 'both directions', 'it does not need a direction'], 'It extends the 3&prime;-OH end of a growing chain. So one strand (leading) is made continuously and the other (lagging) in short pieces.');
mc(2, 'replication', 'The strand of DNA that is made in short pieces during replication is the', 'lagging strand', ['leading strand', 'coding strand', 'template strand'], 'The lagging strand has its template running 5&prime; to 3&prime;, so it is made in fragments which are later joined.');
mc(2, 'replication', 'The region in <i>E. coli</i> where replication starts is called', 'the origin of replication (ori)', ['the promoter', 'the operator', 'the terminator'], 'Replication begins at a specific sequence called the origin. A stretch of DNA with an ori can replicate on its own.');
mc(2, 'transcription', 'In a transcription unit, the terminator is located', 'at the 3&prime; end of the coding strand', ['at the 5&prime; end of the coding strand', 'between promoter and operator', 'in the middle of the structural gene'], 'Promoter: 5&prime; (upstream). Terminator: 3&prime; (downstream) end of the structural gene.');
mc(2, 'transcription', 'The strand of DNA that serves as the template for RNA synthesis has the polarity', '3&prime; to 5&prime;', ['5&prime; to 3&prime;', 'either, chosen at random', 'it has no polarity'], 'RNA polymerase reads the template 3&prime; to 5&prime; and builds RNA 5&prime; to 3&prime;. The coding strand has the same sequence as the RNA (with T for U).');
mc(2, 'transcription', 'In bacteria, the factor that helps RNA polymerase to start transcription is', 'sigma (&sigma;)', ['rho (&rho;)', 'ligase', 'primase'], '&sigma; helps in initiation and &rho; in termination.');
mc(2, 'transcription', 'In eukaryotes, the primary transcript is processed. Which is NOT part of this processing?', 'Addition of a poly-U tail', ['Splicing', 'Capping', 'Tailing with adenylate residues'], 'Introns are removed (splicing), a methylguanosine cap is added at the 5&prime; end and a poly-A tail at the 3&prime; end.');
mc(2, 'transcription', 'In eukaryotes, the sequences that are removed from hnRNA are the', 'introns', ['exons', 'promoters', 'anticodons'], 'Exons appear in the mature RNA; introns do not.');
mc(2, 'genetic code', 'The number of codons that code for amino acids is', '61', ['64', '20', '3'], '64 codons: 61 code for amino acids and 3 are stop codons.');
mc(2, 'genetic code', 'A genetic code in which one amino acid can be coded by more than one codon is called', 'degenerate', ['ambiguous', 'universal', 'overlapping'], 'Except methionine and tryptophan, all amino acids have more than one codon.');
mc(2, 'genetic code', 'The genetic code is "universal". This means', 'one codon codes for the same amino acid in nearly all organisms', ['one codon codes for many amino acids', 'there is only one codon for every amino acid', 'all codons are stop codons'], 'The code is largely the same in bacteria, plants and animals. There are a few exceptions, for example in mitochondria.');
mc(2, 'genetic code', 'Genetic code was deciphered with the help of cell-free systems and synthetic RNA by', 'Nirenberg, Khorana and Ochoa', ['Watson, Crick and Wilkins', 'Jacob and Monod', 'Hershey and Chase'], 'Nirenberg used a cell-free system, Khorana made synthetic RNA of known repeating sequence, and Ochoa made RNA with the enzyme polynucleotide phosphorylase.');
mc(2, 'tRNA', 'The anticodon of a tRNA is located on', 'the anticodon loop', ['the amino acid acceptor end', 'the 5&prime; cap', 'the poly-A tail'], 'The anticodon loop has bases that pair with a codon. The amino acid is attached to the 3&prime; end (CCA).');
mc(2, 'translation', 'Charging of tRNA (attaching an amino acid) needs', 'aminoacyl tRNA synthetase and ATP', ['DNA ligase and GTP', 'RNA polymerase and ATP', 'peptidyl transferase only'], 'The amino acid is activated in the presence of ATP and linked to its tRNA by the enzyme specific to it.');
mc(2, 'translation', 'The ribosome consists of', 'a large and a small subunit made of rRNA and proteins', ['one subunit of rRNA alone', 'DNA and histones', 'mRNA and tRNA only'], 'The small subunit binds mRNA and the large subunit has the sites where peptide bonds form.');
mc(2, 'lac operon', 'In the lac operon, the i gene codes for', 'the repressor protein', ['&beta;-galactosidase', 'permease', 'transacetylase'], 'The i (inhibitor) gene makes a repressor that binds the operator. z, y and a are the structural genes.');
mc(2, 'lac operon', 'The structural gene z in the lac operon codes for', '&beta;-galactosidase', ['permease', 'repressor', 'transacetylase'], 'It breaks lactose into galactose and glucose. Gene y codes for permease and gene a for transacetylase.');
mc(2, 'lac operon', 'In the absence of lactose, the lac operon is OFF because', 'the repressor is bound to the operator', ['RNA polymerase cannot find the promoter', 'the z gene is deleted', 'the i gene is switched off'], 'The repressor binds the operator and blocks transcription by RNA polymerase. Lactose (inducer) binds the repressor and frees the operator.');
mc(2, 'Human Genome Project', 'The human genome contains about', '3 &times; 10<sup>9</sup> base pairs', ['3 &times; 10<sup>6</sup> base pairs', '3 &times; 10<sup>12</sup> base pairs', '3 &times; 10<sup>4</sup> base pairs'], 'The Human Genome Project found about 3 billion base pairs and about 20,000 to 25,000 genes.');
mc(2, 'Human Genome Project', 'ESTs (expressed sequence tags) in the Human Genome Project are', 'all the genes that are expressed as RNA', ['the non-coding parts of the DNA', 'repeated sequences', 'proteins'], 'This method identified the genes that are expressed as RNA. The other method, sequence annotation, sequences the whole genome and later assigns functions.');
mc(2, 'DNA fingerprinting', 'DNA fingerprinting is based on', 'differences in the number of repeats of short sequences (VNTRs) between individuals', ['differences in the amino acid sequence', 'differences in the number of chromosomes', 'differences in the cell wall'], 'VNTR (variable number of tandem repeats) show polymorphism; their number differs from person to person but is inherited like Mendelian traits.');
mc(2, 'DNA fingerprinting', 'Which of these is used to transfer separated DNA fragments from a gel to a membrane in DNA fingerprinting?', 'Southern blotting', ['Northern blotting', 'Western blotting', 'Autoradiography'], 'In Southern blotting DNA fragments from the gel are transferred to a nylon or nitrocellulose membrane for hybridisation with a labelled probe.');
mc(2, 'RNA world', 'The first genetic material is thought to be RNA because RNA can', 'act both as genetic material and as a catalyst', ['only be a catalyst', 'only store information', 'replicate without any enzyme in all cells'], 'RNA can store information like DNA and can also act as an enzyme (a ribozyme). This is the basis of the "RNA world" idea.');
mc(2, 'genetic material', 'DNA is a better genetic material than RNA because', 'DNA is more stable, owing to deoxyribose and thymine', ['DNA mutates faster than RNA', 'RNA is not able to code for proteins', 'DNA is single stranded'], 'The 2&prime;-OH of RNA makes it reactive and easily degraded. Thymine also helps in repair. This is why DNA is the stable store of information.');
mc(2, 'central dogma', 'The flow of information DNA &rarr; RNA &rarr; protein is called', 'the central dogma', ['the lac operon', 'the genetic map', 'reverse transcription'], 'Francis Crick proposed it. Temin and Baltimore later found the reverse flow, RNA to DNA, in some viruses.');

// ---------------------------------------------------------------- Level 3
mc(3, 'DNA structure', 'The phosphodiester bond in a DNA strand joins', 'the 3&prime;-OH of one nucleotide to the 5&prime;-phosphate of the next', ['the 5&prime;-OH of one nucleotide to the 3&prime;-OH of the next', 'a base to the sugar of the next nucleotide', 'two bases of the opposite strands'], 'Each new nucleotide is added at the 3&prime;-OH of the growing chain, so the backbone alternates sugar and phosphate. Bases are on the inside.');
mc(3, 'DNA structure', 'The length of the DNA in a human diploid cell, with 6.6 &times; 10<sup>9</sup> bp and 0.34 nm per bp, is about', '2.2 m', ['2.2 mm', '22 cm', '2.2 &mu;m'], '6.6 &times; 10<sup>9</sup> &times; 0.34 &times; 10<sup>&minus;9</sup> m = 2.24 m. This long thread must be packed into a nucleus a few micrometres wide.', 'The answer is in metres, not millimetres (<i>E. coli</i> is about 1.4 mm).');
mc(3, 'DNA packaging', 'Which statement about DNA packaging in <i>E. coli</i> is correct?', 'The DNA is in a region called the nucleoid, organised in large loops held by proteins, with no nuclear membrane', ['The DNA is wrapped on histone octamers as in eukaryotes', 'The DNA lies in a nucleus bounded by a double membrane', 'The DNA is linear and fixed to the cell wall'], 'Bacteria have no histone octamers and no nucleus. Their DNA is negatively supercoiled and held in loops by positively charged proteins in the nucleoid.');
mc(3, 'DNA packaging', 'Metaphase chromosomes form from the nucleosome fibre because of', 'higher-order packaging that needs non-histone chromosomal (NHC) proteins', ['DNA polymerase', 'the removal of histones', 'RNA polymerase'], 'The beads-on-a-string fibre is folded into chromatin fibres, which are coiled and condensed into chromosomes at metaphase with the help of NHC proteins.');
mc(3, 'genetic material', 'In the Hershey-Chase experiment, the blender was used to', 'shake off the empty viral coats from the surface of the bacteria', ['break the bacteria', 'label the DNA', 'separate DNA from RNA'], 'After infection, the empty phage coats stick outside the cell. Blending removes them, and centrifugation separates the light coats (supernatant) from the heavier infected bacteria (pellet).');
mc(3, 'genetic material', 'Which injection would kill a mouse in Griffith\'s experiment?', 'Live S bacteria', ['Heat-killed S bacteria alone', 'Live R bacteria alone', 'Heat-killed R bacteria alone'], 'Only the S strain, with its capsule, is virulent. Heat-killed S or live R alone is harmless; the mixture (heat-killed S + live R) is also lethal because R is transformed.', 'The trick is that the mixture also kills, but each part alone is safe.');
mc(3, 'replication', 'In Meselson and Stahl\'s experiment, a sample taken after 40 minutes (two generations) showed', 'equal amounts of hybrid and light DNA', ['only hybrid DNA', 'only heavy DNA', 'only light DNA'], 'The generation time of <i>E. coli</i> is 20 minutes. After one generation all DNA was hybrid. After two it was half hybrid and half light.');
mc(3, 'replication', 'In Taylor\'s experiment on <i>Vicia faba</i> roots using radioactive thymidine, after the first replication in the radioactive medium', 'both chromatids of each chromosome were labelled', ['only one chromatid was labelled', 'no chromatid was labelled', 'both were unlabelled but the centromere was labelled'], 'Each new DNA double helix has one old unlabelled and one new labelled strand, so both chromatids carry some label. After the second replication in a non-radioactive medium only one chromatid per chromosome is labelled.', 'This was the first demonstration of semiconservative replication in eukaryotes.');
mc(3, 'replication', 'On the leading strand, DNA polymerase moves along the template in the direction', '3&prime; to 5&prime;, in the same direction as the replication fork', ['5&prime; to 3&prime;, away from the fork', '3&prime; to 5&prime;, away from the fork', '5&prime; to 3&prime;, towards the fork'], 'The new strand is made 5&prime; to 3&prime;, so the template is read 3&prime; to 5&prime;. On the leading strand this is the same direction in which the fork opens.');
mc(3, 'transcription', 'Which RNA polymerase transcribes the genes for tRNA, 5S rRNA and snRNA in eukaryotes?', 'RNA polymerase III', ['RNA polymerase I', 'RNA polymerase II', 'DNA polymerase III'], 'Pol I makes 28S, 18S and 5.8S rRNA. Pol II makes hnRNA (mRNA precursor). Pol III makes tRNA, 5S rRNA and snRNA.');
mc(3, 'transcription', 'In bacteria, translation of an mRNA can begin before its transcription is complete because', 'there is no nuclear membrane and the mRNA needs no processing', ['mRNA is translated by the RNA polymerase', 'bacteria have no ribosomes', 'the mRNA is made from tRNA'], 'The bacterial transcript needs no splicing, capping or tailing, and DNA and ribosomes lie in the same compartment. So the two processes are coupled.');
mc(3, 'transcription', 'The 5&prime; cap on eukaryotic hnRNA is made of', 'methylguanosine triphosphate', ['a poly-A stretch', 'a tRNA fragment', 'an intron'], 'The cap (methylguanosine triphosphate) is added at the 5&prime; end; the poly-A tail of 200-300 adenylate residues is added at the 3&prime; end, without a template.');
mc(3, 'transcription', 'In a eukaryotic gene, the order of events in processing the primary transcript (hnRNA) is', 'splicing, capping and tailing, giving mRNA', ['translation, splicing and capping', 'capping only', 'replication and splicing'], 'The three modifications convert hnRNA into mature mRNA, which then leaves the nucleus.');
mc(3, 'genetic code', 'The anticodon of the tRNA for the codon 5&prime;-AUG-3&prime; is', '3&prime;-UAC-5&prime;', ['3&prime;-TAC-5&prime;', '5&prime;-UAC-3&prime;', '3&prime;-AUG-5&prime;'], 'The anticodon pairs antiparallel with the codon, with U in place of T: A-U, U-A, G-C. So it reads 3&prime;-UAC-5&prime; (5&prime;-CAU-3&prime;).', 'RNA never has T; and write the polarity.');
mc(3, 'translation', 'The tRNA that starts translation carries', 'methionine (the initiator tRNA)', ['tryptophan', 'any amino acid', 'no amino acid'], 'The initiator tRNA reads the start codon AUG and carries methionine.');
mc(3, 'translation', 'Termination of translation takes place when', 'a release factor binds a stop codon in the A site', ['a tRNA with the anticodon UAA binds', 'the ribosome meets a poly-A tail', 'the mRNA is cut by DNase'], 'There are no tRNAs for the stop codons. A release factor binds the stop codon and the polypeptide is set free.');
mc(3, 'translation', 'Untranslated regions (UTRs) of mRNA are', 'sequences at the 5&prime; end before the start codon and at the 3&prime; end after the stop codon', ['introns left in the mRNA', 'the poly-A tail only', 'the anticodon'], 'UTRs are present on mRNA but not translated. They are required for efficient translation.');
mc(3, 'translation', 'Peptide bond formation in a bacterial ribosome is catalysed by', '23S rRNA acting as a ribozyme', ['a protein enzyme in the large subunit', 'tRNA', 'DNA polymerase'], 'In bacteria, the 23S rRNA of the large subunit is the enzyme (ribozyme). This supports the idea of an RNA world.');
mc(3, 'lac operon', 'When lactose is present in the medium, it acts as an inducer by', 'binding to the repressor and preventing it from binding the operator', ['binding to RNA polymerase', 'removing the promoter', 'degrading the i gene'], 'The inactivated repressor leaves the operator, so RNA polymerase transcribes the z, y and a genes.');
mc(3, 'lac operon', 'The lac operon is an example of', 'negative regulation of an inducible operon', ['positive regulation of a repressible operon', 'regulation at translation', 'regulation by splicing'], 'The repressor is a negative regulator. The operon is normally off and is switched on by an inducer.');
mc(3, 'lac operon', 'The product of gene y in the lac operon', 'increases the permeability of the cell to &beta;-galactosides', ['breaks lactose into glucose and galactose', 'acts as a repressor', 'adds an acetyl group and also hydrolyses lactose'], 'y codes for permease. z codes for &beta;-galactosidase (hydrolyses lactose), and a for transacetylase.');
mc(3, 'Human Genome Project', 'Which is NOT a goal of the Human Genome Project?', 'Making a clone of a human being', ['Identifying all the genes in human DNA', 'Storing the information in databases', 'Addressing ethical, legal and social issues'], 'The goals were to find the genes, determine the 3 billion bp sequence, store it, improve tools for analysis, transfer technologies and study ELSI. Cloning people was not a goal.');
mc(3, 'Human Genome Project', 'Which of the following is correct about the human genome?', 'Less than 2 per cent codes for proteins and repeated sequences form a large part of it', ['More than 50 per cent codes for proteins', 'There are no repeated sequences', 'The functions of all genes are known'], 'Only a small part (under 2%) codes for proteins. Repeats make up much of the genome, and the functions of over half the discovered genes are not yet known.');
mc(3, 'DNA fingerprinting', 'The correct order of steps in DNA fingerprinting is', 'isolation of DNA, digestion by restriction enzymes, gel electrophoresis, blotting, hybridisation with probe, autoradiography', ['gel electrophoresis, digestion, isolation, blotting, autoradiography, hybridisation', 'digestion, isolation, hybridisation, electrophoresis, blotting', 'hybridisation, isolation, digestion, blotting, electrophoresis, autoradiography'], 'DNA must be extracted and cut before fragments can be separated by size. They are blotted onto a membrane, hybridised to a labelled VNTR probe, and seen by autoradiography.');
mc(3, 'DNA fingerprinting', 'In a density gradient centrifuge, DNA separates into a major peak and one or more minor peaks. The minor peaks are', 'satellite DNA, made of repetitive sequences', ['RNA contamination', 'protein', 'plasmid DNA only'], 'Bulk DNA forms the major peak. The repetitive DNA forms the smaller satellite peaks because its base composition and length differ.');
mc(3, 'genetic material', 'Chargaff\'s rule (A = T, G = C) does NOT apply to the DNA of', 'bacteriophage &Phi;X174, which is single-stranded', ['<i>E. coli</i>', 'humans', 'a pea plant'], 'The rule arises from base pairing between two strands. A single-stranded DNA has no partner strand, so A need not equal T.');
asr(3, 'DNA structure', 'The two strands of DNA are said to be antiparallel.', 'One strand runs 5&prime; to 3&prime; while the other runs 3&prime; to 5&prime;.', 0, 'This is the definition. Antiparallel means opposite polarity, which is why replication of one strand has to be done in short pieces.');
asr(3, 'DNA structure', 'DNA is a more stable genetic material than RNA.', 'DNA has a hydroxyl group at the 2&prime; position of its sugar.', 2, 'A is true. R is false: DNA lacks the 2&prime;-OH, and that is the very reason for its stability (RNA has the reactive 2&prime;-OH).');
asr(3, 'genetic material', 'In the Hershey-Chase experiment, the supernatant contained <sup>35</sup>S after centrifugation.', 'Viral protein remained outside the bacterial cell.', 0, 'The labelled protein coats stayed on the surface, were shaken off by the blender and, being light, remained in the supernatant.');
asr(3, 'replication', 'The lagging strand is made in short fragments.', 'DNA polymerase can add nucleotides only to the 3&prime;-OH end of a growing strand.', 0, 'Since synthesis is only 5&prime; to 3&prime;, the strand whose template runs the other way must be made backwards in pieces, later joined by ligase.');
asr(3, 'genetic code', 'The genetic code is non-overlapping.', 'Each nucleotide of the mRNA is read as part of more than one codon.', 2, 'A is true: the code is read in successive triplets without overlap. R is false: it describes an overlapping code.');
asr(3, 'transcription', 'In eukaryotes, the mRNA is shorter than its gene.', 'Introns are removed from the primary transcript.', 0, 'The gene has exons and introns; splicing takes out the introns, so mature mRNA is shorter.');
asr(3, 'lac operon', 'A lac operon with a defective i gene produces &beta;-galactosidase even without lactose.', 'The repressor is not made and so cannot bind the operator.', 0, 'Without a functional repressor the operator is always free for RNA polymerase, so the operon is constitutively on.');
asr(3, 'translation', 'No tRNA exists for the stop codons.', 'Stop codons are recognised by release factors.', 0, 'UAA, UAG and UGA have no cognate tRNA. Release factors recognise them, which ends translation.');
asr(3, 'DNA fingerprinting', 'DNA fingerprints of a child show bands from both parents.', 'VNTR patterns are inherited from the mother and the father.', 0, 'Each child gets one set of chromosomes from each parent, so half its VNTR bands match each parent.');
stm(3, 'transcription', 'The coding strand has the same sequence as the RNA, except for U in place of T.', 'The template strand has the same sequence as the RNA.', 2, 'RNA is complementary to the template strand and identical in sequence (T to U) to the coding strand. Statement II is wrong.');
stm(3, 'replication', 'Replication in E. coli starts at a specific origin of replication.', 'DNA polymerase needs a free 3&prime;-OH end to extend.', 0, 'Both are correct. Because of this, a primer is needed to start and replication begins at ori.');
stm(3, 'genetic code', 'There are 64 codons, all coding for amino acids.', 'The genetic code is degenerate.', 3, 'Only 61 codons code for amino acids, 3 are stop codons. II is true: one amino acid can have several codons.');
stm(3, 'translation', 'The initiator tRNA carries methionine.', 'A tRNA is present for each stop codon.', 2, 'I is correct. II is wrong: no tRNA reads the stop codons.');
stm(3, 'Human Genome Project', 'The Human Genome Project was started in 1990 and completed in 2003.', 'The human genome has about 3 &times; 10<sup>9</sup> bp and nearly all of it codes for proteins.', 2, 'I is right. II is wrong because only under 2% of the genome codes for proteins.');
stm(3, 'lac operon', 'Gene i of the lac operon has its own promoter and is expressed constantly in small amounts.', 'In the lac operon the repressor is made only when lactose is present.', 2, 'The repressor is made all the time (constitutively); lactose only controls whether it is active. II is wrong.', 'Do not confuse making the repressor with its binding.');
stm(3, 'DNA packaging', 'Euchromatin is more transcriptionally active than heterochromatin.', 'Heterochromatin is lightly stained.', 2, 'I is correct. Heterochromatin is densely packed and stains dark, so II is wrong.');
match(3, 'genetic material', 'mi-m1', 'Experiments and their results', ['A. Griffith', 'B. Hershey and Chase', 'C. Meselson and Stahl', 'D. Nirenberg'], ['p. Transformation of R strain into S strain', 'q. <sup>32</sup>P of phage found inside the bacteria', 'r. Semiconservative replication of DNA by density labelling', 's. Poly-U produces polyphenylalanine'], 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'], 'Griffith saw transformation (p). Hershey-Chase showed DNA enters the cell (q). Meselson-Stahl used <sup>15</sup>N/<sup>14</sup>N (r). Nirenberg\'s cell-free system with poly-U gave phenylalanine (s).');
match(3, 'transcription', 'mi-m2', 'RNA polymerases and their products', ['A. RNA polymerase I', 'B. RNA polymerase II', 'C. RNA polymerase III', 'D. Bacterial RNA polymerase'], ['p. tRNA, 5S rRNA, snRNA', 'q. 28S, 18S and 5.8S rRNA', 'r. hnRNA (the precursor of mRNA)', 's. mRNA, tRNA and rRNA all'], 'A-q, B-r, C-p, D-s', ['A-r, B-q, C-p, D-s', 'A-q, B-r, C-s, D-p', 'A-p, B-r, C-q, D-s'], 'Pol I makes rRNAs (q). Pol II makes hnRNA (r). Pol III makes tRNA, 5S rRNA and snRNA (p). Bacteria have one polymerase for all RNAs (s).');
match(3, 'lac operon', 'mi-m3', 'Parts of the lac operon', ['A. i gene', 'B. Operator', 'C. z gene', 'D. y gene'], ['p. Codes for permease', 'q. Codes for the repressor', 'r. Binding site of the repressor', 's. Codes for &beta;-galactosidase'], 'A-q, B-r, C-s, D-p', ['A-r, B-q, C-s, D-p', 'A-q, B-r, C-p, D-s', 'A-s, B-r, C-q, D-p'], 'i makes repressor (q); the operator is where the repressor binds (r); z makes &beta;-galactosidase (s); y makes permease (p).');
match(3, 'replication', 'mi-m4', 'Enzymes and their jobs', ['A. DNA polymerase', 'B. DNA ligase', 'C. RNA polymerase', 'D. Aminoacyl tRNA synthetase'], ['p. Joins DNA fragments of the lagging strand', 'q. Adds deoxyribonucleotides to a growing chain', 'r. Makes RNA on a DNA template', 's. Charges tRNA with its amino acid'], 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-p, C-q, D-s'], 'Polymerase builds DNA (q), ligase seals nicks (p), RNA polymerase builds RNA (r), the synthetase attaches the amino acid to the tRNA (s).');
match(3, 'DNA packaging', 'mi-m5', 'Terms and meanings', ['A. Euchromatin', 'B. Heterochromatin', 'C. VNTR', 'D. EST'], ['p. Densely packed, dark-stained, inactive', 'q. Lightly stained, active', 'r. Repeat sequences used in DNA fingerprinting', 's. Genes expressed as RNA, sequenced in HGP'], 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-q, B-r, C-p, D-s'], 'Euchromatin is active (q). Heterochromatin is compact and inactive (p). VNTRs are used for fingerprinting (r). ESTs mark expressed genes (s).');
pass('mi-p1', 'A density-labelling experiment', 'Bacteria are grown for many generations in a medium containing heavy nitrogen (<sup>15</sup>N) so that all their DNA is heavy. They are then moved to a medium with ordinary <sup>14</sup>N. The generation time is 20 minutes, and DNA is extracted at 0, 20, 40 and 80 minutes and spun in a caesium chloride gradient.');
pq('mi-p1', 3, 'replication', 'The DNA extracted at 20 minutes shows', 'a single band of intermediate density', ['a single heavy band', 'a heavy and a light band', 'a single light band'], 'After one replication each molecule has one old heavy strand and one new light strand: all are hybrid.');
pq('mi-p1', 4, 'replication', 'At 80 minutes (four generations) the fraction of DNA molecules that are fully light is', '7/8', ['1/2', '3/4', '1/8'], 'After 4 generations there are 16 molecules from one original. Two of them (each carrying one old heavy strand) are hybrid and 14 are light: 14/16 = 7/8.', 'The number of hybrid molecules stays at 2; only the number of light ones grows.');
pq('mi-p1', 4, 'replication', 'If DNA replication were conservative, the DNA at 20 minutes would show', 'one heavy band and one light band, with no hybrid band', ['only a hybrid band', 'only a light band', 'only a heavy band'], 'Conservative replication leaves the old double helix intact (heavy) and makes a completely new light one. This is not what was found.');
pass('mi-p2', 'Mutants of the lac operon', 'Four bacterial strains each have a single change in the lac operon. Strain P has no functional repressor (i<sup>&minus;</sup>). Strain Q has an operator that cannot bind repressor (o<sup>c</sup>). Strain R has a non-functional z gene. Strain S has a defective promoter. Each strain has only one copy of the operon.');
pq('mi-p2', 3, 'lac operon', 'Which strains make &beta;-galactosidase even when lactose is absent?', 'P and Q', ['Q and R', 'R and S', 'P and S'], 'Without the repressor (P) or with an operator that it cannot bind (Q) the operon is always on. R makes no functional enzyme and S cannot be transcribed.');
pq('mi-p2', 4, 'lac operon', 'Which strains make NO functional &beta;-galactosidase even when lactose is present?', 'R and S', ['P and Q', 'P and R', 'Q and S'], 'R has a defective z gene (the enzyme itself is faulty), and S cannot start transcription because its promoter is defective.');
pass('mi-p3', 'From gene to protein', 'The coding strand of a short gene reads 5&prime;-ATGGCTTGGAAATAG-3&prime;. The mRNA made from it is translated with AUG = Met, GCU = Ala, UGG = Trp, AAA = Lys, and UAG = stop.');
pq('mi-p3', 3, 'transcription', 'The mRNA sequence is', '5&prime;-AUGGCUUGGAAAUAG-3&prime;', ['5&prime;-UACCGAACCUUUAUC-3&prime;', '5&prime;-ATGGCTTGGAAATAG-3&prime;', '5&prime;-CUAUUUCCAAGCCAU-3&prime;'], 'The mRNA has the same sequence as the coding strand with U in place of T. The second option has T; the first is the complement of the coding strand with its polarity wrongly labelled; the last is the complement read in reverse.');
pq('mi-p3', 3, 'translation', 'The number of amino acids in the polypeptide is', 'four', ['five', 'three', 'fifteen'], 'Codons: AUG GCU UGG AAA UAG. Four sense codons (Met-Ala-Trp-Lys), and UAG stops. The stop codon adds no amino acid.');

// ---------------------------------------------------------------- Level 4
nat(4, 'DNA structure', 'A bacterial genome has 3.0 &times; 10<sup>6</sup> base pairs. Taking 0.34 nm per base pair, the length of its DNA in millimetres is', 1.02, '3.0 &times; 10<sup>6</sup> &times; 0.34 nm = 1.02 &times; 10<sup>6</sup> nm. 10<sup>6</sup> nm = 1 mm, so the length is 1.02 mm.', 'mm', 'Remember 1 mm = 10<sup>6</sup> nm.', 0.01);
nat(4, 'DNA structure', 'A virus DNA molecule is 17 &mu;m long. Taking 0.34 nm per base pair, the number of base pairs is', 50000, '17 &mu;m = 17,000 nm. Number of bp = 17,000 / 0.34 = 50,000.', 'bp', 'Convert &mu;m to nm first (1 &mu;m = 1000 nm).');
nat(4, 'DNA packaging', 'A stretch of 2.4 &times; 10<sup>6</sup> bp of eukaryotic DNA is wound into nucleosomes with 200 bp each. The number of nucleosomes is', 12000, '2.4 &times; 10<sup>6</sup> / 200 = 12,000.', '');
nat(4, 'DNA packaging', 'In 12,000 nucleosomes (histone octamer cores only, not counting H1), the number of histone protein molecules is', 96000, 'Each octamer has 8 histone molecules (two each of H2A, H2B, H3, H4). 12,000 &times; 8 = 96,000.', '', 'H1 sits outside the core and is not part of the octamer.');
nat(4, 'Chargaff', 'A double-stranded DNA has 28 per cent thymine. The percentage of cytosine in it is', 22, 'A = T = 28%, so A + T = 56%. G + C = 44%, and G = C = 22%.', '%', 'The remaining 44% is shared by G and C, so halve it.');
nat(4, 'Chargaff', 'A DNA molecule has 2000 base pairs and 30 per cent of its bases are guanine. The number of adenine bases is', 800, 'Total bases = 4000. G = 30% = 1200, C = 1200, so A + T = 4000 &minus; 2400 = 1600, and A = T = 800.', '', 'Count bases, not base pairs.');
nat(4, 'Chargaff', 'For the same DNA (2000 bp with 1200 G and 1200 C), the total number of hydrogen bonds between the strands is', 5200, 'A-T pairs: 800, with two bonds each = 1600. G-C pairs: 1200, with three bonds each = 3600. Total = 5200.', '');
nat(4, 'genetic code', 'A coding region of mRNA is 903 nucleotides long, including the stop codon. The number of peptide bonds in the protein is', 299, '903/3 = 301 codons. The stop codon makes no amino acid, so 300 amino acids. A chain of 300 amino acids has 299 peptide bonds.', '', 'Subtract the stop codon, then subtract one more for bonds.');
nat(4, 'replication', 'One 15N-labelled (heavy) DNA double helix replicates three times in a medium with <sup>14</sup>N. The number of molecules that are fully light is', 6, 'After 3 rounds there are 2<sup>3</sup> = 8 molecules. Two of them still carry one old heavy strand (hybrid). The other 6 are fully light.', '', 'Hybrid molecules always number 2.');
nat(4, 'replication', 'The template of a lagging strand is 12,000 nucleotides long and it is copied in fragments of 1,000 nucleotides. The number of fragments is', 12, '12,000 / 1,000 = 12 fragments, to be joined by DNA ligase.', '');
nat(4, 'replication', 'A bacterial chromosome of 4.6 &times; 10<sup>6</sup> bp is copied from one origin by two forks moving in opposite directions, each copying 2000 bp per second. The time needed in minutes is about', 19.17, 'Both forks together copy 4000 bp/s. Time = 4.6 &times; 10<sup>6</sup> / 4000 = 1150 s = 19.2 min.', 'min', 'Use both forks. One fork alone would take twice as long.', 0.1);
nat(4, 'genetic code', 'A protein has 120 amino acids. The minimum number of nucleotides in the coding region of its mRNA (with the stop codon) is', 363, '120 amino acids need 120 codons = 360 nucleotides; the stop codon adds 3. Total = 363. UTRs are not counted.', '');
nat(4, 'genetic code', 'Suppose an artificial RNA used only the bases A and U, read in triplets. The number of possible codons is', 8, 'Each of the three positions has 2 choices: 2<sup>3</sup> = 8. With 4 bases it is 4<sup>3</sup> = 64.', '');
nat(4, 'DNA fingerprinting', 'A linear DNA molecule has four recognition sites for a restriction enzyme. The number of fragments after complete digestion is', 5, 'Each cut in a linear molecule adds one fragment: 4 cuts give 5 fragments. A circular DNA with 4 cuts would give 4.', '', 'Circular and linear molecules differ by one fragment.');
mc(4, 'Human Genome Project', 'If the human genome has 25,000 genes of an average length of 3,000 bp, the fraction of the 3 &times; 10<sup>9</sup> bp genome that they occupy is about', '2.5 per cent', ['25 per cent', '0.25 per cent', '50 per cent'], '25,000 &times; 3,000 = 7.5 &times; 10<sup>7</sup> bp. This divided by 3 &times; 10<sup>9</sup> is 0.025, i.e. 2.5%. Much of the genome is therefore outside the genes.');
mc(4, 'genetic material', 'In a Hershey-Chase type experiment phage with <sup>32</sup>P-DNA infects bacteria and the mixture is blended. A student finds some <sup>32</sup>P in the supernatant. A likely cause is', 'some infected bacteria burst or the DNA had not entered yet', ['DNA does not enter bacteria', 'the protein was labelled with <sup>32</sup>P', 'DNA is not the genetic material'], 'Mostly the label (<sup>32</sup>P) is in the pellet. A little in the supernatant comes from incomplete infection or broken cells. The conclusion is not changed.');
mc(4, 'replication', 'Which enzyme does NOT need a primer to start making a polynucleotide?', 'RNA polymerase', ['DNA polymerase', 'DNA ligase', 'DNA polymerase on the lagging strand'], 'RNA polymerase can start a new chain on a template without a primer. DNA polymerase can only extend an existing 3&prime;-OH end.');
mc(4, 'genetic code', 'A base substitution changes the codon UAC (tyrosine) to UAA. This is a', 'nonsense mutation that stops translation early', ['silent mutation', 'frameshift mutation', 'missense mutation'], 'UAA is a stop codon, so the protein ends at that point. A silent mutation leaves the amino acid unchanged and a missense mutation changes it to another amino acid.');
mc(4, 'genetic code', 'A deletion of three consecutive nucleotides within the coding region of a gene, away from the ends, is expected to', 'remove one amino acid, with the rest of the protein in frame', ['change all amino acids after the site', 'make no change at all', 'always produce a stop codon'], 'Three nucleotides = one codon (if in frame). The reading frame is preserved, so one amino acid is lost. Deletion of 1 or 2 bases would shift the frame.', 'Deletion of a multiple of 3 keeps the frame.');
mc(4, 'transcription', 'Which statement about a transcription unit and a gene is correct?', 'A transcription unit includes promoter and terminator, and the gene (structural) lies between them', ['The gene includes the promoter and terminator and the transcription unit is only exons', 'They are the same thing in every case', 'A transcription unit has only introns'], 'A transcription unit has three regions: promoter, structural gene and terminator. A gene is the DNA sequence coding for a polypeptide (or RNA). A transcription unit may contain more than one gene (as in bacteria).');
mc(4, 'lac operon', 'A mutation makes the repressor unable to bind lactose, but it still binds the operator tightly (super-repressor). The result is', 'no &beta;-galactosidase, even when lactose is added', ['&beta;-galactosidase always made', '&beta;-galactosidase only with lactose', 'only permease made'], 'The repressor cannot be inactivated by the inducer, so it stays on the operator and the operon cannot be switched on.');
mc(4, 'lac operon', 'A bacterium with a non-functional z gene is grown with lactose as the only sugar. The effect is', 'the cell cannot grow on lactose because it cannot break it down', ['the cell grows faster', 'the cell makes more repressor', 'the operator is deleted'], '&beta;-Galactosidase hydrolyses lactose into glucose and galactose. Without it the cell cannot use lactose as an energy source.');
mc(4, 'lac operon', 'The lac operon is said to be polycistronic because', 'one mRNA codes for three proteins (z, y and a)', ['it has three promoters', 'it has three repressors', 'it contains introns'], 'z, y and a are transcribed together as one mRNA that is translated into three different polypeptides. Many bacterial operons are like this.');
mc(4, 'DNA fingerprinting', 'In DNA fingerprinting, the probe used for hybridisation is', 'a labelled single-stranded VNTR sequence complementary to the repeats', ['an antibody', 'a restriction enzyme', 'a double-stranded plasmid'], 'The radioactive or fluorescent probe pairs with fragments carrying the repeat, so only those bands show up.');
mc(4, 'DNA fingerprinting', 'DNA fingerprints taken from a mother, a father and a child show that every band of the child matches one of the parents. This is because', 'VNTR bands are inherited from both parents, one set from each', ['DNA fingerprints change every year', 'the child has only maternal DNA', 'the child has twice the number of chromosomes'], 'One set of chromosomes is received from each parent, and the pattern of repeats along with them. Any band that matches neither parent would raise questions.');
mc(4, 'tRNA', 'Which statement about tRNA is correct?', 'It has an anticodon loop and an amino acid binding site at the 3&prime; end', ['It carries the stop codon', 'It is made of DNA', 'It has a poly-A tail'], 'tRNA has the clover-leaf form in two dimensions, with an anticodon loop and, at the 3&prime; end, a CCA tail where the amino acid is attached. In three dimensions it folds into an inverted L.', 'Both ends matter: anticodon is in the loop; the amino acid is at the end.');
mc(4, 'translation', 'In translation, a ribosome can hold at the same time', 'two tRNAs, bound to adjacent codons', ['one tRNA only', 'all the tRNAs of a cell', 'no tRNA at all'], 'The ribosome has two sites for tRNA binding, so that the peptide bond can form between amino acids of two adjacent codons.');
mc(4, 'RNA world', 'RNA viruses such as TMV mutate and evolve faster than DNA viruses mainly because', 'RNA is less stable and has a shorter life span, so its replication is less accurate', ['RNA contains thymine', 'RNA is double stranded', 'RNA viruses do not replicate'], 'The reactive 2&prime;-OH makes RNA unstable, and RNA replication is more error-prone, so changes pile up quickly.');
mc(4, 'central dogma', 'Which finding showed an exception to the central dogma?', 'Synthesis of DNA from an RNA template (reverse transcription) by Temin and Baltimore', ['Discovery of the double helix', 'Discovery of Okazaki fragments', 'Discovery of introns'], 'Reverse transcriptase makes DNA from RNA in retroviruses, so information can flow from RNA back to DNA.');
mc(4, 'transcription', 'In eukaryotes, which statement about mRNA is correct?', 'Mature mRNA is monocistronic and has a cap and a poly-A tail', ['Mature mRNA contains introns', 'Mature mRNA is made by DNA polymerase', 'Mature mRNA has no UTR'], 'Eukaryotic mRNA codes for one protein (monocistronic). It is capped, spliced and tailed. UTRs are present.');
mc(4, 'Human Genome Project', 'The Human Genome Project used bacteria and yeast to', 'clone and amplify DNA fragments in vectors (BAC and YAC) before sequencing', ['make human proteins', 'destroy the genes', 'count the chromosomes'], 'The total DNA from a cell was broken into fragments and cloned in bacterial artificial chromosomes (BAC) and yeast artificial chromosomes (YAC), then sequenced, mostly by the Sanger method.');
mc(4, 'Human Genome Project', 'Sequence annotation in the Human Genome Project means', 'sequencing the whole genome and then assigning functions to the sequences', ['sequencing only the expressed genes', 'making proteins', 'removing introns'], 'In sequence annotation, the whole DNA, coding and non-coding, is sequenced and function is assigned later. The other method (EST) first finds genes that are expressed as RNA.');
mc(4, 'mixed', 'The DNA of a person has a mutation in which GAG changes to GUG in the mRNA, causing sickle-cell anaemia. At the DNA level the change in the template strand is', 'CTC to CAC', ['GAG to GUG', 'CTC to CUC', 'GAG to GTG'], 'The mRNA GAG is made from the template strand 3&prime;-CTC-5&prime;. GUG is made from 3&prime;-CAC-5&prime;. So the template changes T to A (CTC to CAC). DNA has no U.', 'The mutation in the DNA is a T to A change in the template, not a U in DNA.');
mc(4, 'mixed', 'A bacterium divides every 20 minutes and its DNA takes 20 minutes to copy. Even so, a new round of replication can begin before the previous one ends because', 'a new fork can start at the origin while the earlier forks are still moving', ['DNA replicates in the dark', 'the cell has two chromosomes', 'RNA polymerase copies DNA'], 'There can be multiple replication forks on one chromosome. A fresh round starts at the origin before the old round is complete.');

// ---------------------------------------------------------------- Level 5
mc(5, 'genetic code', 'Khorana synthesised an RNA of repeating UC (UCUCUCUC...) and found that the polypeptide was a chain of alternating serine and leucine. Given UCU = Ser and CUC = Leu, this supports that', 'the code is a triplet and read without overlap or commas', ['the code is a doublet', 'the code is overlapping', 'a codon has four bases'], 'Reading in triplets gives UCU-CUC-UCU-CUC: Ser-Leu-Ser-Leu. A doublet code would give two alternating dipeptides; an overlapping code would give a different pattern.');
mc(5, 'genetic code', 'A repeating RNA (UUC)<sub>n</sub> directs the synthesis of three types of homopolypeptides: polyphenylalanine, polyserine and polyleucine. This is because', 'the ribosome can start reading in any of three frames', ['the code is ambiguous', 'the code has overlapping codons', 'three tRNAs bind at once'], 'In the three frames the codons are UUC (Phe), UCU (Ser) and CUU (Leu). The repeat gives one amino acid per frame.');
mc(5, 'genetic code', 'A repeating RNA (AAG)<sub>n</sub> directs the synthesis of three different homopolypeptides. Which amino acids can be included if AAG = Lys, AGA = Arg and GAA = Glu?', 'Polylysine, polyarginine and polyglutamic acid', ['Only polylysine', 'Alternating Lys-Arg-Glu chains', 'No protein, as AAG is a stop codon'], 'Frame 1: AAG AAG... = Lys. Frame 2: AGA AGA... = Arg. Frame 3: GAA GAA... = Glu. Each frame is a homopolymer.', 'Do not expect a mixed chain, since each frame repeats the same codon.');
mc(5, 'replication', 'In a Meselson-Stahl type experiment, the second-generation DNA (after 40 minutes) showed one hybrid band and one light band. A dispersive model would instead have shown', 'a single band, lighter than the hybrid', ['two bands, hybrid and light', 'a single heavy band', 'three bands'], 'In dispersive replication every molecule is a mosaic of old and new pieces, so it falls in one band that gets lighter each generation. Semiconservative replication gives hybrid + light at the second generation, as found.');
mc(5, 'transcription', 'A segment of the template strand is 5&prime;-TACGGA-3&prime;. The mRNA made from it reads', '5&prime;-UCCGUA-3&prime;', ['5&prime;-AUGCCU-3&prime;', '5&prime;-ATGCCT-3&prime;', '5&prime;-UACGGA-3&prime;'], 'The template written 5&prime;-TACGGA-3&prime; reads 3&prime;-AGGCAT-5&prime;. The mRNA is its complement, 5&prime;-UCCGUA-3&prime;. The second option contains T, the first has the wrong direction, and the last has the template\'s sequence.', 'Always note the polarity of the strand you are given.');
mc(5, 'genetic code', 'A codon on mRNA reads 5&prime;-GCU-3&prime;. The anticodon of the tRNA that decodes it, written 5&prime; to 3&prime;, is', '5&prime;-AGC-3&prime;', ['5&prime;-CGA-3&prime;', '5&prime;-UCG-3&prime;', '5&prime;-GCU-3&prime;'], 'The anticodon pairs antiparallel: 3&prime;-CGA-5&prime;. Written 5&prime; to 3&prime; this becomes 5&prime;-AGC-3&prime;.', 'The same anticodon can be written 3&prime;-CGA-5&prime; or 5&prime;-AGC-3&prime;.');
mc(5, 'Human Genome Project', 'Which of the following statements about the human genome is correct as per NCERT?', 'Chromosome 1 has the most genes (2968) and the Y chromosome has the fewest (231)', ['Chromosome Y has the most genes', 'All genes are of equal length', 'Chromosome 21 has the most genes'], 'Chromosome 1 has most genes and the Y fewest. The largest known human gene is dystrophin, with about 2.4 million bases. The average gene has about 3000 bases.');
mc(5, 'Human Genome Project', 'SNPs (single nucleotide polymorphisms) discovered in the Human Genome Project are useful because they', 'help to find chromosomal locations for disease-associated sequences and to trace human history', ['produce new genes in cells', 'code for all the proteins', 'make DNA stable'], 'About 1.4 million locations of single-base DNA differences were identified. They help to locate disease-associated genes and trace human history.');
mc(5, 'Human Genome Project', 'The nucleotide bases that are the same in all people are about', '99.9 per cent', ['50 per cent', '90 per cent', '99.99999 per cent'], 'Any two people differ in about 0.1% of the sequence, even though every person has a unique set of differences.');
mc(5, 'DNA packaging', 'A eukaryotic chromatin fibre with 200 bp per nucleosome and 1 histone H1 per nucleosome has how many histone molecules per 1000 bp?', '45', ['40', '25', '50'], '1000 bp = 5 nucleosomes. Each has 8 core histones plus 1 H1 = 9 molecules. 5 &times; 9 = 45.', 'H1 adds a ninth histone per nucleosome.');
mc(5, 'lac operon', 'A mutation in the promoter of the lac operon (it cannot bind RNA polymerase), together with a repressor that cannot bind the operator, gives', 'no transcription of z, y and a', ['continuous transcription', 'transcription with lactose only', 'transcription without lactose only'], 'Without the promoter function RNA polymerase cannot start, whatever the repressor does. The promoter mutation overrides the loss of repression.');
mc(5, 'transcription', 'Which of the following is true for both the template strand of DNA and the RNA made from it?', 'They are complementary and antiparallel', ['They are identical in sequence', 'They are parallel', 'They have the same sugar'], 'RNA pairs antiparallel with the template strand using the usual base pairing (A-U, T-A, G-C). The sugars differ (ribose in RNA).');
mc(5, 'transcription', 'The template strand of a gene has 24 per cent adenine. The mRNA made from it has what percentage of uracil?', '24 per cent', ['76 per cent', '48 per cent', '12 per cent'], 'Every A on the template pairs with U in the RNA. So the percentage of U in the mRNA equals the percentage of A in the template strand: 24%.', 'Chargaff\'s rule (A = T) applies to the double helix, not to a single strand or to RNA.');
mc(5, 'replication', 'A student says: "The leading and lagging strands are made on the same template strand." The correct view is that', 'they are made on two different template strands', ['they are made on the same template', 'both are made in short fragments', 'neither needs DNA polymerase'], 'One parent strand (3&prime;-5&prime; direction towards the fork) serves as template for the leading strand and the other for the lagging strand.');
mc(5, 'mixed', 'Which one of the following is NOT a similarity between DNA replication and transcription?', 'Both need a primer to begin', ['Both proceed in the 5&prime; to 3&prime; direction of the new chain', 'Both use a DNA template', 'Both use nucleoside triphosphates as substrates'], 'Both build the new chain 5&prime; to 3&prime; on a DNA template from nucleoside triphosphates. A primer is needed by DNA polymerase but not by RNA polymerase.');

// ---------------------------------------------------------------- Number templates
const CODON = (() => {
  const b = 'UCAG';
  const aa = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
  const t = {}; let i = 0;
  for (const x of b) for (const y of b) for (const z of b) t[x + y + z] = aa[i++];
  return t;
})();
const AA_NAME = { F: 'phenylalanine', L: 'leucine', S: 'serine', Y: 'tyrosine', C: 'cysteine', W: 'tryptophan', P: 'proline', H: 'histidine', Q: 'glutamine', R: 'arginine', I: 'isoleucine', M: 'methionine', T: 'threonine', N: 'asparagine', K: 'lysine', V: 'valine', A: 'alanine', D: 'aspartic acid', E: 'glutamic acid', G: 'glycine' };
const SENSE = Object.keys(CODON).filter((c) => CODON[c] !== '*');
const DNA_COMP = { A: 'T', T: 'A', G: 'C', C: 'G' };
const RNA_FROM_DNA_TEMPLATE = { A: 'U', T: 'A', G: 'C', C: 'G' };
const rseq = (rng, n, alpha = 'ACGT') => { let s = ''; for (let i = 0; i < n; i++) s += alpha[Math.floor(rng() * alpha.length)]; return s; };
const rev = (s) => [...s].reverse().join('');

const gens = [
  {
    id: 'mi-g01', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'Chargaff rule',
    make(rng) {
      const mode = int(rng, 0, 3);
      if (mode === 0) { const a = choose(rng, [18, 20, 22, 24, 26, 28, 30, 32, 34]); return { mode, a, q: `A double-stranded DNA has ${a} per cent adenine. What percentage of its bases is cytosine?`, answer: (100 - 2 * a) / 2, tol: 0, unit: '%', sol: `Idea: A = T and G = C. A + T = ${2 * a}%, so G + C = ${100 - 2 * a}%. Cytosine is half of this: ${(100 - 2 * a) / 2}%.` }; }
      if (mode === 1) { const g2 = choose(rng, [16, 18, 20, 22, 24, 26, 28, 30, 32]); return { mode, g2, q: `In a double-stranded DNA, guanine makes up ${g2} per cent of the bases. What percentage is thymine?`, answer: 50 - g2, tol: 0, unit: '%', sol: `Idea: G = C, so G + C = ${2 * g2}%. Then A + T = ${100 - 2 * g2}% and T = A = ${50 - g2}%.` }; }
      if (mode === 2) { const gc = choose(rng, [36, 40, 44, 48, 52, 56, 60, 64]); return { mode, gc, q: `A DNA double helix has ${gc} per cent G + C. What is the percentage of adenine?`, answer: (100 - gc) / 2, tol: 0, unit: '%', sol: `Idea: A + T = 100 &minus; ${gc} = ${100 - gc}%, and A = T, so A = ${(100 - gc) / 2}%.` }; }
      const pur = choose(rng, [20, 24, 28, 32]);
      return { mode, pur, q: `In a double-stranded DNA the percentage of guanine is ${pur}. What is the total percentage of purines (A + G)?`, answer: 50, tol: 0, unit: '%', sol: `Idea: by Chargaff's rule purines = pyrimidines, so A + G = T + C = 50% of the bases whatever the value of G (here ${pur}%).` };
    },
    verify(p) {
      const n = 10000; let A, G;
      if (p.mode === 0) { A = (p.a / 100) * n; G = (n - 2 * A) / 2; return (G / n) * 100; }
      if (p.mode === 1) { G = (p.g2 / 100) * n; const A2 = (n - 2 * G) / 2; return (A2 / n) * 100; }
      if (p.mode === 2) { const GC = (p.gc / 100) * n; return ((n - GC) / 2 / n) * 100; }
      return 50;
    },
  },
  {
    id: 'mi-g02', type: 'nat', level: 3, format: 'numeric', exams: ex(3), sub: 'DNA length',
    make(rng) {
      const m = choose(rng, [1.5, 2, 2.5, 3, 4, 4.6, 5, 6.6, 8]);
      const e = choose(rng, [4, 5, 6, 9]);
      const bp = m * 10 ** e;
      const nm = bp * 0.34;
      let unit, div, uname;
      if (nm < 1e6) { unit = 'micrometres'; div = 1e3; uname = '&mu;m'; } else if (nm < 1e9) { unit = 'millimetres'; div = 1e6; uname = 'mm'; } else { unit = 'metres'; div = 1e9; uname = 'm'; }
      const ans = +(nm / div).toPrecision(3);
      return { bp, div, q: `A DNA molecule has ${fmt(bp, 3)} base pairs. Taking 0.34 nm per base pair, what is its length in ${unit}?`, answer: ans, tol: Math.max(0.01 * ans, 0.01), unit: uname, sol: `Idea: length = number of bp &times; 0.34 nm. Length = ${fmt(bp, 3)} &times; 0.34 nm = ${fmt(nm, 4)} nm. Convert: 1 ${uname} = ${fmt(div, 1)} nm, so length = ${fmt(nm, 4)} / ${fmt(div, 1)} = ${ans} ${uname}.` };
    },
    verify(p) { return +((p.bp * 0.34) / p.div).toPrecision(3); },
  },
  {
    id: 'mi-g03', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'DNA length',
    make(rng) {
      const bp = pick(rng, 5000, 90000, 1000);
      const L = +(bp * 0.34 / 1000).toFixed(2);
      return { bp, L, q: `A virus DNA is ${L} &mu;m long. Taking 0.34 nm per base pair, how many base pairs does it contain?`, answer: bp, tol: 0, unit: 'bp', sol: `Idea: bp = length / 0.34 nm. ${L} &mu;m = ${fmt(L * 1000, 5)} nm. Number of bp = ${fmt(L * 1000, 5)} / 0.34 = ${bp}.` };
    },
    verify(p) { return Math.round((p.L * 1000) / 0.34); },
  },
  {
    id: 'mi-g04', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'nucleosomes',
    make(rng) {
      const k = pick(rng, 50, 5000, 50);
      const bp = k * 200;
      const asks = [['nucleosomes', 1, 'Each nucleosome uses about 200 bp.'], ['histone molecules in the octamer cores', 8, 'Each octamer has 8 histone molecules.'], ['molecules of histone H3 in the cores', 2, 'Each octamer has two molecules each of H2A, H2B, H3 and H4.'], ['histone H2A and H2B molecules together in the cores', 4, 'Each octamer has 2 H2A + 2 H2B = 4 of these.']];
      const [w, f, why] = choose(rng, asks);
      return { k, f, q: `A stretch of eukaryotic chromatin contains ${fmt(bp, 6)} bp of DNA wound on nucleosomes with 200 bp of DNA each. How many ${w} are present?`, answer: k * f, tol: 0, sol: `Idea: first count the nucleosomes: ${fmt(bp, 6)} / 200 = ${k}. ${why} So the number is ${k} &times; ${f} = ${k * f}.` };
    },
    verify(p) { return p.k * p.f; },
  },
  {
    id: 'mi-g05', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'codons and proteins',
    make(rng) {
      const a = int(rng, 20, 600);
      const mode = int(rng, 0, 3);
      if (mode === 0) return { mode, a, q: `A polypeptide has ${a} amino acids. What is the minimum number of nucleotides in the coding region of its mRNA, including the stop codon?`, answer: 3 * a + 3, tol: 0, sol: `Idea: each amino acid needs one codon (3 nucleotides), and one more codon is the stop codon. Nucleotides = 3 &times; ${a} + 3 = ${3 * a + 3}.` };
      if (mode === 1) return { mode, a, q: `A polypeptide has ${a} amino acids. How many peptide bonds does it contain?`, answer: a - 1, tol: 0, sol: `Idea: n amino acids in a chain are joined by n &minus; 1 peptide bonds. ${a} &minus; 1 = ${a - 1}.` };
      if (mode === 2) return { mode, a, q: `The coding region of an mRNA, including the stop codon, is ${3 * a + 3} nucleotides long. How many amino acids are in the protein?`, answer: a, tol: 0, sol: `Idea: divide by 3 to get codons, then drop the stop codon. ${3 * a + 3} / 3 = ${a + 1} codons; minus the stop codon = ${a} amino acids.` };
      return { mode, a, q: `A gene's coding region (including the stop codon) is ${3 * a + 3} base pairs long. How many tRNA molecules are used up (one per amino acid added) to make one copy of the protein?`, answer: a, tol: 0, sol: `Idea: one charged tRNA brings in each amino acid; none is needed for the stop codon. ${3 * a + 3}/3 = ${a + 1} codons, minus 1 stop = ${a} amino acids, so ${a} tRNA molecules are used.` };
    },
    verify(p) { return [3 * p.a + 3, p.a - 1, p.a, p.a][p.mode]; },
  },
  {
    id: 'mi-g06', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'Meselson-Stahl',
    make(rng) {
      const n = int(rng, 2, 6);
      const mode = int(rng, 0, 2);
      const tot = 2 ** n;
      const asks = [
        ['fully light (<sup>14</sup>N/<sup>14</sup>N)', tot - 2, 'Two molecules always keep one old heavy strand (hybrid). The rest are fully light: 2<sup>n</sup> &minus; 2.'],
        ['hybrid (<sup>15</sup>N/<sup>14</sup>N)', 2, 'The two old heavy strands are in two different molecules, so there are always exactly 2 hybrids.'],
        ['DNA strands (single strands) that still contain <sup>14</sup>N only', tot * 2 - 2, 'Total strands = 2 &times; 2<sup>n</sup>; only the 2 original strands are heavy, all others are light.'],
      ];
      const [w, a, why] = asks[mode];
      return { n, mode, q: `One DNA double helix labelled with <sup>15</sup>N on both strands is allowed to replicate ${n} times in a medium containing only <sup>14</sup>N. How many ${w} are present at the end?`, answer: a, tol: 0, sol: `Idea: replication is semiconservative. After ${n} rounds there are 2<sup>${n}</sup> = ${tot} double helices. ${why} Answer = ${a}.` };
    },
    verify(p) {
      // simulate strands
      let mols = [['H', 'H']];
      for (let i = 0; i < p.n; i++) { const nm = []; for (const m of mols) { nm.push([m[0], 'L']); nm.push([m[1], 'L']); } mols = nm; }
      if (p.mode === 0) return mols.filter((m) => m[0] === 'L' && m[1] === 'L').length;
      if (p.mode === 1) return mols.filter((m) => m[0] !== m[1]).length;
      return mols.flat().filter((s) => s === 'L').length;
    },
  },
  {
    id: 'mi-g07', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'replication',
    make(rng) {
      const f = choose(rng, [500, 1000, 1500, 2000]);
      const k = int(rng, 4, 30);
      const L = f * k;
      const mode = int(rng, 0, 2);
      const asks = [['How many fragments are made?', k, 'Number of fragments = length / fragment size'], ['How many RNA primers are needed on this template (one per fragment)?', k, 'Each fragment starts with its own primer'], ['How many joining reactions must DNA ligase carry out to make one continuous strand?', k - 1, 'k fragments need k &minus; 1 joins']];
      const [w, a, why] = asks[mode];
      return { f, k, mode, q: `During replication, the lagging strand of a stretch of ${L} nucleotides is made in fragments of ${f} nucleotides each. ${w}`, answer: a, tol: 0, sol: `Idea: ${L} / ${f} = ${k} fragments. ${why}. Answer = ${a}.` };
    },
    verify(p) { return [p.k, p.k, p.k - 1][p.mode]; },
  },
  {
    id: 'mi-g08', type: 'nat', level: 4, format: 'numeric', exams: ex(4), sub: 'replication',
    make(rng) {
      const G = choose(rng, [1.2, 2.4, 3.6, 4.6, 6, 8.4]);
      const v = choose(rng, [500, 1000, 1500, 2000]);
      const forks = choose(rng, [1, 2, 4]);
      const t = (G * 1e6) / (forks * v) / 60;
      const ans = +t.toFixed(1);
      return { G, v, forks, q: `A bacterial chromosome of ${G} million base pairs is copied by ${forks} replication fork${forks > 1 ? 's' : ''} working at the same time, each fork adding ${v} bp per second. How many minutes does replication take?`, answer: ans, tol: 0.1, unit: 'min', sol: `Idea: time = total bp / (number of forks &times; rate). Total rate = ${forks} &times; ${v} = ${forks * v} bp/s. Time = ${G * 1e6} / ${forks * v} = ${fmt((G * 1e6) / (forks * v), 5)} s = ${ans} min.` };
    },
    verify(p) { return +(((p.G * 1e6) / (p.forks * p.v)) / 60).toFixed(1); },
  },
  {
    id: 'mi-g09', type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'transcription',
    make(rng) {
      const n = int(rng, 6, 9);
      const mode = int(rng, 0, 2);
      const s = rseq(rng, n);
      let given, ask, correct;
      const rna = (x) => [...x].map((c) => RNA_FROM_DNA_TEMPLATE[c]).join('');
      if (mode === 0) { given = `3&prime;-${s}-5&prime;`; ask = 'template strand'; correct = rna(s); }
      else if (mode === 1) { given = `5&prime;-${s}-3&prime;`; ask = 'coding strand'; correct = s.replace(/T/g, 'U'); }
      else { given = `5&prime;-${s}-3&prime;`; ask = 'template strand'; correct = rev(rna(s)); }
      const wrongs = [s.replace(/T/g, 'U'), [...s].map((c) => RNA_FROM_DNA_TEMPLATE[c]).join(''), rev(s).replace(/T/g, 'U'), rev(rna(s)), s, rna(rev(s))];
      const o = shuffleOpts(rng, correct, wrongs.filter((w) => w !== correct && w.length === n));
      const lab = (x) => `5&prime;-${x}-3&prime;`;
      return { s, mode, correct, ask, q: `The ${ask} of a gene reads ${given}. Which is the mRNA transcribed from this gene, written 5&prime; to 3&prime;?`, options: o.options.map(lab), answer: o.answer, sol: mode === 0 ? `Idea: RNA is complementary and antiparallel to the template. The template is written 3&prime; to 5&prime;, so the mRNA written 5&prime; to 3&prime; is simply the base-by-base complement with U for A's partner: ${correct}.` : mode === 1 ? `Idea: the coding strand has the same sequence as the mRNA with U in place of T. So the mRNA is ${correct}.` : `Idea: the template is given 5&prime; to 3&prime;. Reverse it to read 3&prime; to 5&prime;, then take the complement: reverse = ${rev(s)}, then complement (with U) = ${correct}.` };
    },
    verify(p) {
      const rna = (x) => [...x].map((c) => RNA_FROM_DNA_TEMPLATE[c]).join('');
      let c;
      if (p.mode === 0) c = rna(p.s); else if (p.mode === 1) c = p.s.split('T').join('U'); else c = rna(rev(p.s));
      return p.options.indexOf(`5&prime;-${c}-3&prime;`);
    },
  },
  {
    id: 'mi-g10', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'translation',
    make(rng) {
      const n = int(rng, 3, 9);
      let utr5 = ''; do { utr5 = rseq(rng, int(rng, 3, 8), 'CGUA'); } while (utr5.includes('AUG') || utr5.endsWith('A') && false);
      let utr3 = ''; do { utr3 = rseq(rng, int(rng, 3, 8), 'CGUA'); } while (utr3.includes('AUG'));
      let body = '';
      for (let i = 0; i < n; i++) body += choose(rng, SENSE);
      const stop = choose(rng, ['UAA', 'UAG', 'UGA']);
      // make sure no earlier AUG appears inside utr5 or at join
      let mrna = utr5 + 'AUG' + body + stop + utr3;
      if (utr5.slice(-2) + 'AUG' !== utr5.slice(-2) + 'AUG') mrna = mrna;
      const first = mrna.indexOf('AUG');
      return { mrna, first, q: `A ribosome translates the mRNA 5&prime;-${mrna}-3&prime; starting at its first AUG and ends at the first in-frame stop codon. How many amino acids does the polypeptide have?`, answer: n + 1, tol: 0, sol: `Idea: find the first AUG, read in triplets, and stop at the stop codon. The first AUG is at position ${first + 1}. Codons from there: ${(() => { const c = []; for (let i = first; i + 3 <= mrna.length; i += 3) { const x = mrna.slice(i, i + 3); c.push(x); if (CODON[x] === '*') break; } return c.join(' '); })()}. The stop codon adds no amino acid, so the count is ${n + 1}.` };
    },
    verify(p) { let c = 0; for (let i = p.mrna.indexOf('AUG'); i + 3 <= p.mrna.length; i += 3) { if (CODON[p.mrna.slice(i, i + 3)] === '*') break; c++; } return c; },
  },
  {
    id: 'mi-g11', type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'genetic code',
    make(rng) {
      const n = int(rng, 3, 5);
      const cods = ['AUG']; for (let i = 0; i < n; i++) cods.push(choose(rng, SENSE));
      const k = int(rng, 2, n + 1);
      const target = CODON[cods[k - 1]];
      const pool = Object.keys(AA_NAME).filter((x) => x !== target);
      const wr = []; while (wr.length < 3) { const w = choose(rng, pool); if (!wr.includes(w)) wr.push(w); }
      const o = shuffleOpts(rng, AA_NAME[target], wr.map((x) => AA_NAME[x]));
      return { cods, k, q: `Using the standard genetic code, an mRNA starts 5&prime;-${cods.join('')}...-3&prime; and is read from the first AUG. Which amino acid is number ${k} in the chain? (The codons are: ${cods.join(' ')}.)`, options: o.options, answer: o.answer, sol: `Idea: read the codons in order. Codon ${k} is ${cods[k - 1]}, which codes for ${AA_NAME[target]} in the standard genetic code (AUG, the first, codes for methionine).` };
    },
    verify(p) { return p.options.indexOf(AA_NAME[CODON[p.cods[p.k - 1]]]); },
  },
  {
    id: 'mi-g12', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'genetic code',
    make(rng) {
      const mode = int(rng, 0, 1);
      if (mode === 0) { const k = int(rng, 2, 5), w = int(rng, 2, 4); return { mode, k, w, q: `A hypothetical genetic code uses ${k} different bases and reads them ${w} at a time. How many different codons are possible?`, answer: k ** w, tol: 0, sol: `Idea: each of the ${w} positions can hold any of ${k} bases, so the number of codons is ${k}<sup>${w}</sup> = ${k ** w}.` }; }
      const k = choose(rng, [2, 3, 4, 5, 6]);
      let w = 1; while (k ** w < 20) w++;
      return { mode, k, q: `A genetic code has ${k} different bases. What is the smallest codon length (number of bases per codon) that can code for 20 amino acids?`, answer: w, tol: 0, sol: `Idea: find the smallest w with ${k}<sup>w</sup> &ge; 20. ${Array.from({ length: w }, (_, i) => `${k}<sup>${i + 1}</sup> = ${k ** (i + 1)}`).join(', ')}. So w = ${w}.` };
    },
    verify(p) { if (p.mode === 0) return p.k ** p.w; let w = 0; while (p.k ** w < 20) w++; return w; },
  },
  {
    id: 'mi-g13', type: 'nat', level: 4, format: 'integer', exams: ex(4), sub: 'mutation',
    make(rng) {
      const N = int(rng, 40, 300);
      const p0 = int(rng, 5, N - 10);
      const d = int(rng, 1, 6);
      const kind = choose(rng, ['insertion', 'deletion']);
      const ans = d % 3 === 0 ? 0 : N - p0;
      return { N, p0, d, kind, q: `A gene has ${N} codons for amino acids. ${kind === 'insertion' ? 'An' : 'A'} ${kind} of ${d} nucleotide${d > 1 ? 's' : ''} occurs inside codon number ${p0}, and no stop codon is created by chance. How many of the amino acids coded AFTER codon ${p0} (codons ${p0 + 1} to ${N}) are expected to change?`, answer: ans, tol: 0, sol: `Idea: a ${kind} that is not a multiple of 3 shifts the reading frame; a multiple of 3 keeps it. Here ${d} ${d % 3 === 0 ? 'is a multiple of 3, so the frame is kept and later amino acids are unchanged (only whole amino acids near the site are gained or lost). Answer 0.' : `is not a multiple of 3, so every later codon is read in the wrong frame: ${N} &minus; ${p0} = ${N - p0} amino acids change.`}` };
    },
    verify(p) { return p.d % 3 ? p.N - p.p0 : 0; },
  },
  {
    id: 'mi-g14', type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'lac operon',
    make(rng) {
      const strains = [
        ['has no functional repressor (i<sup>&minus;</sup>)', { rep: false, op: true, pr: true, z: true }],
        ['makes a repressor that cannot bind lactose, but binds the operator (i<sup>s</sup>)', { rep: true, op: true, pr: true, z: true, noInd: true }],
        ['has an operator that the repressor cannot bind (o<sup>c</sup>)', { rep: true, op: false, pr: true, z: true }],
        ['has a defective z gene (z<sup>&minus;</sup>)', { rep: true, op: true, pr: true, z: false }],
        ['has a defective promoter (p<sup>&minus;</sup>)', { rep: true, op: true, pr: false, z: true }],
        ['is normal (wild type)', { rep: true, op: true, pr: true, z: true }],
      ];
      const k = int(rng, 0, strains.length - 1);
      const A = 'Inducible: functional &beta;-galactosidase is made only when lactose is present';
      const B = 'Constitutive: functional &beta;-galactosidase is made whether or not lactose is present';
      const C = 'Never made as a functional enzyme';
      const D = 'Made only when lactose is absent';
      const s = strains[k][1];
      let res;
      if (!s.z || !s.pr) res = C; else if (!s.rep || !s.op) res = B; else if (s.noInd) res = C; else res = A;
      const o = shuffleOpts(rng, res, [A, B, C, D].filter((x) => x !== res));
      const why = { [A]: 'The operon is under normal control, so lactose is needed to free the operator.', [B]: 'The operator is never blocked, so the operon is always on.', [C]: 'The enzyme cannot be made or cannot be switched on.' };
      return { k, s, q: `A bacterial strain has a single change in the lac operon: it ${strains[k][0]}. Which describes its &beta;-galactosidase?`, options: o.options, answer: o.answer, sol: `Idea: ask whether (1) the operator can be bound by the repressor, (2) RNA polymerase can bind the promoter and (3) the z gene is intact. For this strain: ${why[res]} So the answer is "${res}".` };
    },
    verify(p) {
      const s = p.s;
      const label = !s.z || !s.pr ? 'Never' : !s.rep || !s.op ? 'Constitutive' : s.noInd ? 'Never' : 'Inducible';
      return p.options.findIndex((o) => o.startsWith(label === 'Never' ? 'Never' : label));
    },
  },
  {
    id: 'mi-g15', type: 'mcq', level: 2, format: 'single', exams: ex(2), sub: 'genetic material',
    make(rng) {
      const cases = [
        ['live R bacteria', 'lives'],
        ['live S bacteria', 'dies'],
        ['heat-killed S bacteria', 'lives'],
        ['heat-killed S bacteria mixed with live R bacteria', 'dies'],
        ['heat-killed R bacteria mixed with heat-killed S bacteria', 'lives'],
        ['heat-killed S bacteria mixed with live R bacteria, after the S extract was treated with DNase', 'lives'],
        ['heat-killed S bacteria mixed with live R bacteria, after the S extract was treated with protease', 'dies'],
        ['heat-killed S bacteria mixed with live R bacteria, after the S extract was treated with RNase', 'dies'],
      ];
      const k = int(rng, 0, cases.length - 1);
      const L = 'The mouse lives';
      const D = 'The mouse dies and live S bacteria are found in it';
      const options0 = [L, D, 'The mouse dies and only R bacteria are found in it', 'The mouse lives and live S bacteria are found in it'];
      const correct = cases[k][1] === 'lives' ? L : D;
      const o = shuffleOpts(rng, correct, options0.filter((x) => x !== correct));
      const why = ['Live R bacteria have no capsule and are harmless.', 'Live S bacteria have a capsule and kill the mouse.', 'Heat kills the S bacteria, so they cannot cause disease.', 'The DNA of the dead S bacteria transforms live R into virulent S.', 'Neither strain is alive, so nothing can multiply.', 'DNase destroys DNA, the transforming principle, so R stays harmless.', 'Protease destroys protein only; the DNA still transforms R into S.', 'RNase destroys RNA only; the DNA still transforms R into S.'][k];
      return { k, q: `Mice are injected with ${cases[k][0]} (<i>Streptococcus pneumoniae</i>). What happens?`, options: o.options, answer: o.answer, sol: `Idea: only live S cells, or live R cells transformed by the DNA of dead S cells, cause death. ${why}` };
    },
    verify(p) {
      const dies = [false, true, false, true, false, false, true, true][p.k];
      return p.options.indexOf(dies ? 'The mouse dies and live S bacteria are found in it' : 'The mouse lives');
    },
  },
  {
    id: 'mi-g16', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'DNA fingerprinting',
    make(rng) {
      const shape = choose(rng, ['linear', 'circular']);
      const n1 = int(rng, 1, 5);
      const two = rng() < 0.5;
      const n2 = two ? int(rng, 1, 4) : 0;
      const cuts = n1 + n2;
      const frag = shape === 'linear' ? cuts + 1 : cuts;
      return { shape, n1, n2, q: `A ${shape} DNA molecule has ${n1} recognition site${n1 > 1 ? 's' : ''} for restriction enzyme 1${two ? ` and ${n2} different site${n2 > 1 ? 's' : ''} for restriction enzyme 2` : ''}. It is digested completely with ${two ? 'both enzymes together' : 'enzyme 1'}. How many fragments are produced?`, answer: frag, tol: 0, sol: `Idea: each cut in a linear molecule adds one piece; in a circular molecule the number of fragments equals the number of cuts. Number of cuts = ${n1}${two ? ` + ${n2}` : ''} = ${cuts}. ${shape === 'linear' ? `Fragments = ${cuts} + 1 = ${frag}.` : `Fragments = ${frag}.`}` };
    },
    verify(p) { const c = p.n1 + p.n2; return p.shape === 'linear' ? c + 1 : c === 0 ? 1 : c; },
  },
  {
    id: 'mi-g17', type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'tRNA',
    make(rng) {
      const cod = rseq(rng, 3, 'ACGU');
      const cm = { A: 'U', U: 'A', G: 'C', C: 'G' };
      const anti = [...cod].map((c) => cm[c]).join('');
      const lab3 = (x) => `3&prime;-${x}-5&prime;`;
      const wrongs = [`5&prime;-${anti}-3&prime;`, lab3(rev(anti)), lab3([...anti].map((c) => (c === 'U' ? 'T' : c)).join('')), `3&prime;-${cod}-5&prime;`];
      const correct = lab3(anti);
      const o = shuffleOpts(rng, correct, wrongs.filter((w) => w !== correct));
      return { cod, anti, q: `A codon on the mRNA reads 5&prime;-${cod}-3&prime;. The anticodon of the tRNA that pairs with it, written 3&prime; to 5&prime;, is`, options: o.options, answer: o.answer, sol: `Idea: the anticodon pairs antiparallel and base by base with the codon (A-U, G-C). Codon 5&prime;-${cod}-3&prime; pairs with 3&prime;-${anti}-5&prime;. Wrong choices use T (not in RNA), the wrong polarity or the reversed order.` };
    },
    verify(p) { const cm = { A: 'U', U: 'A', G: 'C', C: 'G' }; return p.options.indexOf(`3&prime;-${[...p.cod].map((c) => cm[c]).join('')}-5&prime;`); },
  },
  {
    id: 'mi-g18', type: 'nat', level: 4, format: 'numeric', exams: ex(4), sub: 'Chargaff rule',
    make(rng) {
      const a = pick(rng, 10, 35, 5), t = pick(rng, 10, 35, 5);
      const g1 = pick(rng, 10, 40, 5);
      const c = 100 - a - t - g1;
      if (c < 5 || c > 50) { return this.make(rng); }
      const ans = (a + t) / 2;
      return { a, t, g1, c, q: `One strand of a DNA double helix has ${a}% A, ${t}% T, ${g1}% G and ${c}% C. What is the percentage of A in the whole double-stranded molecule?`, answer: ans, tol: 0.01, unit: '%', sol: `Idea: A in the double helix = A on strand 1 + A on strand 2 (which equals T on strand 1), averaged over both strands. A = (${a} + ${t}) / 2 = ${ans}%.` };
    },
    verify(p) { let A1 = p.a * 10, T1 = p.t * 10; const A2 = T1, A = (A1 + A2) / 2000 * 100; return A; },
  },
  {
    id: 'mi-g19', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'DNA structure',
    make(rng) {
      const N = pick(rng, 100, 2000, 100);
      const gc = choose(rng, [30, 40, 50, 60, 70]);
      const GCpairs = (N * gc) / 100, ATpairs = N - GCpairs;
      return { N, gc, q: `A double-stranded DNA of ${N} base pairs has ${gc} per cent G + C. How many hydrogen bonds hold its two strands together?`, answer: 2 * ATpairs + 3 * GCpairs, tol: 0, sol: `Idea: A-T pairs have 2 hydrogen bonds, G-C pairs have 3. Base pairs: ${N}. G-C pairs = ${gc}% of ${N} = ${GCpairs}; A-T pairs = ${ATpairs}. Bonds = 2 &times; ${ATpairs} + 3 &times; ${GCpairs} = ${2 * ATpairs + 3 * GCpairs}.`, trap: 'The percentage refers to bases; as every pair has one G with one C, the percentage of pairs that are G-C is the same.' };
    },
    verify(p) { return 2 * p.N + (p.gc / 100) * p.N; },
  },
];

export default { topic: 'molecular-inheritance', groups, items, gens };
