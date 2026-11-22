// NEET UG Biology: Biotechnology and its applications (NCERT Class 12, 2023 rationalised book). All questions original fibub work.
import { pick, int, choose, fmt, shuffleOpts, numOpts, g } from '../_entrance.js';

const items = [];
const groups = {};
let n = 0, pos = 0;
const POS = [1, 3, 0, 2];
const nid = () => `ba-${String(++n).padStart(3, '0')}`;
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
mc(1, 'GM crops', 'Organisms whose genes have been altered by manipulation are called', 'genetically modified organisms (GMOs)', ['hybrid varieties', 'mutants of nature', 'clones'], 'GM plants, bacteria, fungi and animals are GMOs, because their genes were changed with the tools of recombinant DNA technology.');
mc(1, 'GM crops', 'Golden rice is a GM variety which is enriched with', 'vitamin A', ['vitamin C', 'iron only', 'vitamin D'], 'Golden rice has been engineered to make a precursor of vitamin A, which helps tackle the nutritional deficiency in people eating mainly rice.');
mc(1, 'Bt toxin', 'Bt toxin is obtained from the bacterium', '<i>Bacillus thuringiensis</i>', ['<i>Agrobacterium tumefaciens</i>', '<i>Escherichia coli</i>', '<i>Thermus aquaticus</i>'], 'Bt stands for <i>Bacillus thuringiensis</i>. It makes proteins that kill certain insects.');
mc(1, 'Bt toxin', 'The Bt toxin is coded by a gene called', 'cry', ['rop', 'ori', 'lacZ'], 'Bt toxin proteins are encoded by <i>cry</i> genes. For example, cryIAc controls cotton bollworms.');
mc(1, 'Bt toxin', 'Bt cotton is resistant to', 'bollworms', ['nematodes only', 'bacterial blight', 'drought'], 'The <i>cry</i> genes cryIAc and cryIIAb in Bt cotton protect it against cotton bollworms.');
mc(1, 'RNAi', 'RNA interference (RNAi) is a method of', 'silencing a specific mRNA', ['cutting DNA at palindromes', 'copying DNA in a tube', 'joining Okazaki fragments'], 'A complementary double-stranded RNA binds to a particular mRNA and prevents it from being translated.');
mc(1, 'RNAi', 'The nematode which infects the roots of tobacco plants and reduces their yield is', '<i>Meloidogyne incognita</i>', ['<i>Bacillus thuringiensis</i>', '<i>Wuchereria bancrofti</i>', '<i>Ascaris lumbricoides</i>'], 'RNAi was used to make tobacco plants that resist this root-knot nematode.');
mc(1, 'insulin', 'Human insulin is made of two polypeptide chains, called', 'chain A and chain B', ['chain &alpha; and chain &beta;', 'heavy and light chain', 'chain C and chain D'], 'The two chains of insulin are A and B and they are joined by disulphide bridges.');
mc(1, 'insulin', 'Before genetic engineering, insulin for diabetics was obtained from', 'slaughtered cattle and pigs', ['bacteria only', 'plants', 'human blood'], 'Animal insulin could cause allergy or foreign-protein reactions in some patients. Genetic engineering gave a human insulin made in bacteria.');
mc(1, 'insulin', 'The first company to produce human insulin using recombinant DNA technology in 1983 was', 'Eli Lilly', ['Monsanto', 'Pfizer', 'Bayer'], 'Eli Lilly made the DNA sequences for chains A and B and put them in plasmids of <i>E. coli</i>.');
mc(1, 'gene therapy', 'The first clinical gene therapy was given in 1990 to a four-year-old girl with', 'adenosine deaminase (ADA) deficiency', ['cystic fibrosis', 'phenylketonuria', 'sickle-cell anaemia'], 'ADA deficiency affects the immune system. The gene therapy tried to supply a working ADA gene.');
mc(1, 'gene therapy', 'Gene therapy means', 'correcting a gene defect by delivering a normal gene into cells', ['making a protein from a gene in bacteria', 'killing cancer cells with gene gun only', 'cloning an animal'], 'Gene therapy inserts a normal gene into the individual or embryo to take over the work of the defective one.');
mc(1, 'diagnosis', 'ELISA is based on the principle of', 'antigen-antibody interaction', ['DNA-RNA hybridisation only', 'restriction cutting', 'gel sieving'], 'ELISA detects an infection by the antigen of the pathogen or by the antibodies made against it.');
mc(1, 'diagnosis', 'Which technique is used to detect HIV in suspected AIDS patients at an early stage?', 'PCR', ['Gram staining', 'Widal test only', 'Biolistics'], 'PCR amplifies even a very small amount of the virus\'s nucleic acid, so it can be detected before symptoms appear.');
mc(1, 'transgenic animals', 'More than 95% of all transgenic animals are', 'mice', ['cows', 'sheep', 'rabbits'], 'Mice are small, breed fast and their genetics is well known, so most transgenic animals made are mice.');
mc(1, 'transgenic animals', 'The first transgenic cow, Rosie (1997), produced milk rich in the human protein', '&alpha;-lactalbumin', ['insulin', '&alpha;-1-antitrypsin', 'ADA'], 'Rosie\'s milk contained human &alpha;-lactalbumin (2.4 g per litre), making it more balanced for human babies.');
mc(1, 'ethics', 'The committee set up by the Government of India to decide on the safety of GM research and release of GM organisms is', 'GEAC', ['ICMR', 'CSIR', 'NCERT'], 'GEAC is the Genetic Engineering Approval Committee.');
mc(1, 'ethics', 'Use of bio-resources by companies without proper authorisation from the countries and people concerned is called', 'biopiracy', ['biofortification', 'bioremediation', 'biomagnification'], 'Biopiracy takes biological knowledge or material without permission or compensation to the people who developed it.');
mc(1, 'ethics', 'A patent on basmati rice was granted in 1997 by the', 'US Patent and Trademark Office', ['Indian Patent Office', 'European Patent Office', 'World Health Organization'], 'An American company was granted rights on basmati rice lines, though the rice was derived from Indian farmers\' varieties.');
mc(1, 'GM crops', 'Which of these is an advantage of GM crops?', 'reduced use of chemical pesticides', ['increased use of fertilisers', 'higher post-harvest losses', 'lower nutritional value'], 'Pest-resistant GM crops can be grown with less insecticide. GM crops can also reduce post-harvest loss and be made more nutritious.');
mc(1, 'transgenic animals', 'A transgenic animal is one whose DNA has been manipulated to', 'carry and express an extra (foreign) gene', ['lose its mitochondria', 'have no genes', 'show only mutations of nature'], 'Transgenic animals have a foreign gene added and working in them.');

// ---------------------------------------------------------------- Level 2
mc(2, 'GM crops', 'Which one is NOT a purpose of making a crop genetically modified?', 'making the crop depend more on chemical fertilisers', ['tolerance to cold, drought, salt and heat', 'pest resistance', 'enhanced nutritional value'], 'GM crops are meant for stress tolerance, reduced pesticide use, better mineral use and better nutrition. More dependence on fertilisers would be the opposite aim.');
mc(2, 'GM crops', 'GM crops can help reduce post-harvest losses, for example by', 'delaying ripening and spoilage', ['making fruits ripen all at once', 'adding more water', 'making the plant a perennial'], 'Some GM crops are modified for slower spoilage, which reduces loss between harvest and market.');
mc(2, 'Bt toxin', 'The Bt toxin in the bacterium exists as', 'an inactive protoxin in crystals', ['an active toxin', 'a lipid', 'an RNA'], 'The protein is made as an inactive protoxin. It becomes active only in the gut of the insect.');
mc(2, 'Bt toxin', 'The Bt protoxin gets activated in the insect gut because of', 'the alkaline pH of the gut', ['the acid in the stomach', 'bile salts', 'the heat of the gut'], 'The alkaline pH of the insect gut dissolves the crystals, and the protoxin is converted into an active toxin.');
mc(2, 'Bt toxin', 'After activation, the Bt toxin kills the insect by', 'creating pores in the cells of the midgut, causing swelling and lysis', ['blocking photosynthesis in the insect', 'digesting its DNA', 'stopping its eggs'], 'The active toxin binds to the midgut epithelial cells and makes pores. The cells swell and burst and the insect dies.');
mc(2, 'Bt toxin', 'The Bt toxin does NOT kill the <i>Bacillus</i> itself because', 'it is formed in an inactive (protoxin) form inside the bacterium', ['the bacterium is immune by its genes only', 'the toxin is a carbohydrate', 'the bacterium is anaerobic'], 'The toxin is inactive in the bacterium and gets activated only in the alkaline gut of the insect.');
mc(2, 'Bt toxin', 'The gene cryIAb controls the', 'corn borer', ['cotton bollworm', 'nematode', 'mosquito only'], 'cryIAc and cryIIAb act on cotton bollworms and cryIAb on the corn borer.');
mc(2, 'Bt toxin', 'Bt toxin genes have been cloned from the bacterium and expressed in plants. This gives resistance to insects without using', 'insecticides', ['water', 'sunlight', 'fertiliser'], 'The plant makes its own toxin, which works like a built-in pesticide.');
mc(2, 'RNAi', 'RNAi works by', 'a double-stranded RNA binding to the mRNA of a gene and preventing its translation', ['cutting the DNA at a palindrome', 'adding a methyl group to DNA only', 'making the cell produce more mRNA'], 'The dsRNA is complementary to the mRNA, so the mRNA is silenced and no protein is made.');
mc(2, 'RNAi', 'In the transgenic tobacco, the nematode-specific gene is introduced so that the host cells make', 'both sense and antisense RNA', ['only sense RNA', 'only DNA', 'a Bt toxin'], 'Sense and antisense RNA are complementary and form a dsRNA, which triggers RNAi against the nematode\'s mRNA.');
mc(2, 'RNAi', 'The vector used to introduce the nematode-specific genes into tobacco plants was', '<i>Agrobacterium</i> vectors', ['retrovirus', 'bacteriophage', 'pBR322 only'], 'Agrobacterium vectors carry the genes into the host plant cells, which then make the RNAs.');
mc(2, 'RNAi', 'Natural sources of complementary RNA that start RNAi include', 'infection by viruses with RNA genomes and mobile genetic elements (transposons) that replicate via an RNA intermediate', ['bacterial ribosomes', 'plasma membranes', 'only chloroplasts'], 'RNAi is a natural defence of eukaryotic cells against such genetic elements.');
mc(2, 'insulin', 'Insulin is made in the human body first as a', 'prohormone with an extra stretch called C peptide', ['a single mature chain', 'a lipid', 'only a short signal'], 'Proinsulin has chains A and B plus the C peptide. The C peptide is removed during maturation.');
mc(2, 'insulin', 'Chain A of insulin has 21 amino acids and chain B has', '30 amino acids', ['21 amino acids', '51 amino acids', '86 amino acids'], 'Mature insulin has 21 + 30 = 51 amino acids.');
mc(2, 'insulin', 'In the production of genetically engineered insulin by <i>E. coli</i>, the chains A and B are', 'produced separately and then joined by disulphide bonds', ['made together as one polypeptide with C peptide', 'made by the human pancreas', 'joined by peptide bonds only'], 'Separate DNA sequences for chain A and chain B were put into plasmids. The chains were extracted and combined by disulphide bonds.');
mc(2, 'insulin', 'A main advantage of recombinant human insulin over animal insulin is that it', 'does not cause the allergic or immune reactions caused by foreign protein', ['is cheaper in all countries', 'contains the C peptide', 'is made of one chain'], 'Human insulin made in bacteria is identical in structure to human insulin, so fewer immune reactions occur.');
mc(2, 'gene therapy', 'ADA deficiency affects which system of the body?', 'the immune system', ['the circulatory system', 'the nervous system', 'the excretory system'], 'ADA is crucial for the immune system to function. In its absence, the child is very prone to infections.');
mc(2, 'gene therapy', 'In the ADA gene therapy, a functional ADA cDNA was introduced into the patient\'s', 'lymphocytes using a retroviral vector', ['red blood cells using Ti plasmid', 'skin cells using a gene gun', 'neurons using a bacteriophage'], 'Lymphocytes were grown in culture, given the gene by a retroviral vector and returned to the patient.');
mc(2, 'gene therapy', 'ADA gene therapy through lymphocytes is not a permanent cure because', 'lymphocytes are not immortal, so periodic infusion is needed', ['the retrovirus kills the cell', 'the ADA gene is lost in the first hour', 'the gene is deleted from the vector'], 'The cells carrying the gene die after some time, so the infusions have to be repeated. A permanent cure would need the gene to be put into early embryonic cells.');
mc(2, 'diagnosis', 'Why is PCR used for early detection of diseases?', 'it can amplify the nucleic acid of a pathogen present in very low amount', ['it gives colour to the antibody', 'it kills the pathogen', 'it removes the symptoms'], 'Conventional tests need a lot of antigen or antibody. PCR makes millions of copies from a tiny amount of nucleic acid.');
mc(2, 'diagnosis', 'In diagnosis by a gene probe, the probe is', 'a single-stranded DNA or RNA tagged with a radioactive molecule, complementary to the gene to be detected', ['a double-stranded plasmid', 'an enzyme', 'an antibody tagged with colour'], 'The probe hybridises with its complementary DNA in a clone of cells, and autoradiography shows the position.');
mc(2, 'diagnosis', 'In ELISA, an infection can be detected by', 'the presence of antigens or of antibodies against the pathogen', ['the presence of restriction enzymes', 'the absence of all proteins', 'the pH of the urine'], 'ELISA is based on antigen-antibody interaction, either detecting the antigen of the pathogen or the antibody made against it.');
mc(2, 'transgenic animals', 'Transgenic mice were developed to test the safety of', 'polio vaccine', ['insulin', 'Bt cotton', 'Golden rice'], 'If successful, the test would replace the use of monkeys.');
mc(2, 'transgenic animals', 'The human protein &alpha;-1-antitrypsin, made in transgenic animals, is used to treat', 'emphysema', ['diabetes', 'ADA deficiency', 'malaria'], 'Emphysema is a lung condition. &alpha;-1-antitrypsin protects the lungs.');
mc(2, 'transgenic animals', 'Transgenic animals are used in toxicity testing because they', 'are made more sensitive to toxic substances than normal animals, so tests take less time', ['do not feel pain', 'are immune to all poisons', 'grow faster than bacteria'], 'The animals respond quickly to harmful chemicals, giving results in a shorter time.');
mc(2, 'transgenic animals', 'Transgenic animals serve as disease models for', 'cancer, cystic fibrosis, rheumatoid arthritis and Alzheimer\'s disease', ['only plant diseases', 'only bacterial infection', 'none of these'], 'Transgenic models help scientists to understand the disease and to test drugs.');
mc(2, 'ethics', 'The use of bio-resources without authorisation and compensation was a concern in the patenting of', 'basmati rice, turmeric and neem products', ['Bt cotton and Bt corn only', 'insulin and ADA', 'Rosie and polio vaccine'], 'Patents were granted on products or uses based on traditional Indian knowledge of basmati, turmeric (wound healing) and neem, and these became cases of biopiracy.');
mc(2, 'ethics', 'Why do we need GEAC?', 'GM organisms could have unpredictable effects when released into the ecosystem', ['to produce GM crops', 'to give prizes to scientists', 'to patent turmeric'], 'GEAC looks into the validity of GM research and the safety of introducing GM organisms for public use.');
mc(2, 'ethics', 'Indian farmers grow more than 27 documented varieties of', 'basmati', ['wheat', 'maize', 'cotton'], 'India has a rich variety of basmati rice, which is important in the story of its patent.');
mc(2, 'GM crops', 'GM crops with higher efficiency of mineral usage help to', 'prevent early exhaustion of fertility of the soil', ['increase the salt in soil', 'cause rain', 'kill earthworms'], 'If the plant uses minerals more efficiently, the soil keeps its fertility for longer.');
mc(2, 'transgenic animals', 'Which one is a use of a transgenic animal in studying normal physiology?', 'studying how a gene regulates growth, such as insulin-like growth factor', ['making rice more nutritious', 'producing Bt toxin', 'testing a Ti plasmid'], 'By adding or changing a gene, we can see its effect on the body\'s development.');
mc(2, 'biopiracy', 'Turmeric was patented in the USA for its use in', 'healing wounds', ['curing fever', 'repelling insects', 'making dyes only'], 'Because the use was long known in India, the patent was challenged and revoked.');
mc(2, 'biopiracy', 'A patent is a right granted by a government to', 'an inventor, giving the sole right to prevent others from making or using the invention without permission', ['everyone, to copy the work', 'only farmers', 'only the government'], 'A patent gives an exclusive right for a period. Biopiracy cases arise when it is granted for something that already exists in tradition.');

// ---------------------------------------------------------------- Level 3
mc(3, 'Bt toxin', 'Which sequence correctly describes how Bt toxin from a Bt cotton leaf kills a bollworm?', 'insect eats the leaf, the protoxin dissolves in the alkaline gut and turns active, binds midgut cells, forms pores, cells swell and burst', ['insect eats the leaf, acid in the gut activates the toxin, which blocks protein synthesis in all cells', 'toxin enters the insect through the skin and cuts its DNA', 'the toxin is made only after the insect dies'], 'The order is: ingestion, solubilisation at alkaline pH and activation, binding to epithelial cells, pore formation, swelling and lysis, death.', 'Activation needs alkaline pH, not acid.');
mc(3, 'Bt toxin', 'Why is Bt toxin generally harmless to humans who eat Bt crops?', 'the human gut is not alkaline enough and lacks the specific binding sites for activated toxin', ['Bt toxin is destroyed by cooking only', 'humans have no midgut', 'Bt toxin works only in plants'], 'The toxin needs an alkaline gut to become active and special midgut receptors to bind. These conditions are not found in the human gut.', 'Human gut with stomach acid is the opposite of the alkaline insect gut.');
mc(3, 'Bt toxin', 'Which statement about Bt cotton is correct?', 'the plant itself produces the toxin from a <i>cry</i> gene put into it', ['the plant is sprayed with bacteria every week', 'the toxin is made only by the insect', 'it resists nematodes by RNAi'], 'Bt cotton carries a <i>cry</i> gene from <i>Bacillus thuringiensis</i> and makes the toxin in its own cells, so it acts as a built-in pesticide.');
mc(3, 'Bt toxin', 'Bt toxins are produced as protoxins in the bacterium. Where would you expect the bacterium to store them?', 'as crystals that dissolve only in an alkaline medium', ['dissolved in the cytoplasm as active toxin', 'in the cell wall as lipids', 'as free RNA'], 'The crystalline protoxin is inactive. It needs the alkaline pH of the insect gut to dissolve and become active.');
mc(3, 'RNAi', 'In RNAi in tobacco plants, which mRNA is silenced?', 'the mRNA of the nematode (<i>Meloidogyne incognita</i>)', ['the mRNA of the tobacco plant\'s own growth genes', 'the mRNA of Bt toxin', 'all mRNAs of the plant'], 'The dsRNA is made against a nematode-specific gene. When the nematode feeds on the root, the dsRNA enters and silences its mRNA. The nematode then cannot survive.', 'The plant makes the dsRNA, but its target is the parasite\'s mRNA.');
mc(3, 'RNAi', 'The sense RNA and the antisense RNA made in the transgenic plant form a dsRNA because', 'they are complementary to each other', ['both are identical', 'they are both DNA', 'they carry the same codons'], 'The antisense RNA is complementary to the sense RNA. Their base pairing makes a double-stranded RNA, which triggers silencing.');
mc(3, 'RNAi', 'RNAi was used to protect tobacco from the root-knot nematode mainly because', 'the parasite needs a specific mRNA for its survival in the host', ['the nematode has no mRNA', 'the plant is resistant to Bt', 'nematodes digest dsRNA'], 'Silencing a key gene of the nematode prevents its growth in the roots.');
mc(3, 'insulin', 'Why was the C peptide NOT included in the genetically engineered human insulin made in <i>E. coli</i> by Eli Lilly?', 'mature insulin has only chains A and B, so only these two were made and joined', ['C peptide is toxic to bacteria', 'C peptide makes insulin cheaper', 'C peptide is made by bacteria'], 'In humans, the C peptide is removed during maturation. The company made the A and B chains separately and joined them by disulphide bonds.');
mc(3, 'insulin', 'In the 1983 method for making human insulin in bacteria, two DNA sequences were made, which correspond to', 'chain A and chain B of insulin', ['chain A and C peptide', 'proinsulin and mature insulin', 'the &alpha; and &beta; globin chains'], 'One sequence codes for chain A and the other for chain B. They were put in separate plasmids and the chains made were combined later.');
mc(3, 'gene therapy', 'Enzyme replacement therapy for ADA deficiency is not completely curative because', 'the injected enzyme has to be given again and again', ['the enzyme is toxic', 'the enzyme cannot enter the blood', 'the gene is deleted from the enzyme'], 'The patient does not make ADA, so the injections must be repeated. Gene therapy aims to make the body produce it.');
mc(3, 'gene therapy', 'A permanent cure of ADA deficiency by gene therapy is possible if the ADA gene is introduced into', 'cells at an early embryonic stage', ['mature red blood cells', 'the digestive juices', 'bone fragments'], 'Embryonic cells divide and pass the gene to all their descendants, including the cells of the immune system.');
mc(3, 'diagnosis', 'Why can PCR detect HIV earlier than an ELISA that looks for antibodies?', 'PCR detects the viral nucleic acid directly, before antibodies have formed', ['PCR detects the antibodies earlier', 'ELISA kills the virus', 'PCR is done at body temperature'], 'Antibodies appear some time after infection. Viral nucleic acid is present at once and can be amplified.');
mc(3, 'diagnosis', 'In diagnosis with a labelled probe followed by autoradiography, the clone having the mutated gene', 'does not show up on the film because the probe is not complementary to it', ['shows a strong signal', 'shows a signal in a different colour', 'breaks the film'], 'The probe has the sequence complementary to the normal gene. It hybridises only with the normal gene, so the mutated gene gives no signal.', 'A mutated gene is the one that is missing on the film.');
mc(3, 'diagnosis', 'Conventional tests of serum and urine are not enough for early diagnosis because they', 'detect the disease only when a large amount of the pathogen or its product is present', ['are too accurate', 'need no body fluids', 'work only on plants'], 'By the time the pathogen or the antibodies reach detectable levels, the disease may have advanced. PCR and probes detect much earlier.');
mc(3, 'transgenic animals', 'Why are transgenic mice and not monkeys the choice for testing the safety of a vaccine?', 'mice can be made sensitive to the vaccine\'s agent and are small and cheap, so testing can replace use of monkeys', ['monkeys can never get the polio', 'mice are always immune', 'mice are plants'], 'A transgenic mouse can be made to carry the human receptor for the virus. This allows safety testing on mice and would replace the use of monkeys.');
mc(3, 'transgenic animals', 'Which of the following is a biological product made using transgenic animals?', '&alpha;-1-antitrypsin for emphysema', ['Bt toxin for bollworms', 'Taq polymerase', 'ethidium bromide'], 'Human &alpha;-1-antitrypsin can be produced in the milk of transgenic animals and is used to treat emphysema.');
mc(3, 'ethics', 'Basmati rice was patented in the USA through the claim that', 'the Indian basmati was crossed with semi-dwarf varieties and was an invention', ['it was found only in the USA', 'it was grown only for oil', 'it contains turmeric'], 'The claim ignored the fact that basmati varieties were developed by Indian farmers over many years. This was a case of biopiracy.');
mc(3, 'ethics', 'What is the main duty of GEAC?', 'to decide on the validity of GM research and the safety of introducing GM organisms for public services', ['to patent GM seeds for companies', 'to grow GM crops itself', 'to ban all research'], 'GEAC checks the safety of GM organisms before they are released.');
mc(3, 'ethics', 'Which of the following is an ethical concern about GM organisms?', 'unpredictable effects on the ecosystem when they are released', ['they always grow slowly', 'they can never be patented', 'they have no DNA'], 'Because GM organisms are altered at the gene level, their release may have effects which cannot be foreseen.');

asr(3, 'Bt toxin', 'The Bt toxin does not kill the <i>Bacillus thuringiensis</i> that makes it.', 'The toxin is formed in the bacterium as an inactive protoxin.', 0, 'Because the protoxin is inactive, the bacterium is safe. It becomes active in the alkaline gut of the insect.');
asr(3, 'Bt toxin', 'Bt toxin is activated in the gut of the insect larvae.', 'The gut of the insect has an alkaline pH.', 0, 'Alkaline pH dissolves the crystals and converts the protoxin into the active toxin.');
asr(3, 'gene therapy', 'In ADA gene therapy through lymphocytes, the patient needs repeated infusions.', 'Lymphocytes are not immortal cells.', 0, 'Since the corrected lymphocytes die after some time, the treatment has to be repeated.');
asr(3, 'transgenic animals', 'Over 95% of the transgenic animals made are mice.', 'Mice are the only animals whose genes can be changed.', 2, 'A is true. R is false because genes in cows, sheep and other animals have also been changed.');
asr(3, 'insulin', 'Mature human insulin is a single polypeptide chain of 51 amino acids.', 'Insulin is made in the body as proinsulin with a C peptide.', 3, 'A is false: mature insulin has two chains, A (21) and B (30), joined by disulphide bridges. R is true; the C peptide is removed during maturation.');
asr(4, 'diagnosis', 'PCR can detect an HIV infection earlier than tests based on antibodies.', 'PCR amplifies the viral nucleic acid, even when it is present in very low quantity.', 0, 'Antibodies appear only after some time, while the virus\'s genetic material can be detected soon after infection by amplification.');
asr(3, 'RNAi', 'RNAi silences a gene by cutting the DNA of the gene.', 'In RNAi, a dsRNA complementary to an mRNA stops its translation.', 3, 'A is false: RNAi acts on the mRNA, not on the DNA. R is true.');
asr(3, 'ethics', 'The patent on basmati rice granted in 1997 was seen as biopiracy.', 'Basmati was derived from the traditional varieties grown by Indian farmers.', 0, 'The company claimed rights on something based on farmers\' varieties and knowledge without permission or compensation.');
asr(4, 'diagnosis', 'A mutated gene clone does not give a signal when a probe made for the normal gene is used.', 'The probe has no complementarity to the mutated gene.', 0, 'Hybridisation needs a complementary sequence. The mutated gene does not pair with the probe, so there is no signal on the film.');

stm(3, 'Bt toxin', 'Cry proteins make pores in the midgut cells of the insect.', 'The protoxin of Bt is activated in the alkaline medium of the insect gut.', 0, 'Both are correct statements.');
stm(3, 'Bt toxin', 'The cryIAb gene controls cotton bollworms.', 'The cryIAc gene controls cotton bollworms.', 3, 'cryIAb is for the corn borer, so I is wrong. cryIAc (and cryIIAb) act on cotton bollworms, so II is correct.');
stm(3, 'RNAi', 'In the nematode-resistant tobacco, both sense and antisense RNAs are made in the host cells.', 'The dsRNA formed silences the host plant\'s own mRNA.', 2, 'I is correct. II is wrong, as the target is the mRNA of the nematode.');
stm(3, 'insulin', 'The two chains of insulin are joined by peptide bonds.', 'The two chains of insulin are joined by disulphide bridges.', 3, 'Each chain is a chain of amino acids held by peptide bonds. The two chains are linked to each other by disulphide bridges.');
stm(3, 'gene therapy', 'Introducing a gene into lymphocytes gives a permanent cure of ADA deficiency.', 'Introducing the gene into early embryonic cells could give a permanent cure.', 3, 'I is wrong, as lymphocytes do not live forever. II is correct.');
stm(3, 'diagnosis', 'ELISA works on the principle of antigen-antibody reaction.', 'ELISA can detect only nucleic acids.', 2, 'I is right. II is wrong, as ELISA detects antigens or antibodies, which are mostly proteins.');
stm(3, 'transgenic animals', 'More than 95% of transgenic animals are mice.', 'Rosie, the first transgenic cow, made milk with human &alpha;-lactalbumin.', 0, 'Both are correct.');
stm(4, 'ethics', 'A patent on basmati rice was granted in the USA in 1997.', 'Basmati rice is a variety invented abroad and unrelated to Indian farmers.', 2, 'I is correct but II is wrong: basmati came from Indian farmers\' varieties.');

match(3, 'applications', 'mba1', 'Genes, organisms and targets', ['A. cryIAc', 'B. cryIAb', 'C. <i>Meloidogyne incognita</i>', 'D. dsRNA'], ['p. Corn borer', 'q. Cotton bollworm', 'r. Root-knot nematode of tobacco', 's. Silences a specific mRNA'], 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-p, C-q, D-s'], 'cryIAc acts on cotton bollworm and cryIAb on corn borer. <i>M. incognita</i> infects tobacco roots and dsRNA silences a particular mRNA.');
match(3, 'applications', 'mba2', 'Biological products and uses', ['A. &alpha;-1-antitrypsin', 'B. Human &alpha;-lactalbumin', 'C. Humulin', 'D. ADA cDNA'], ['p. Emphysema', 'q. Milk of transgenic cow Rosie', 'r. Diabetes', 's. Immune deficiency'], 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'], '&alpha;-1-antitrypsin treats emphysema, human &alpha;-lactalbumin is in Rosie\'s milk, Humulin (recombinant human insulin) is for diabetes and ADA cDNA is for ADA deficiency.');
match(4, 'diagnosis', 'mba3', 'Diagnostic methods and principles', ['A. ELISA', 'B. PCR', 'C. Gene probe with autoradiography', 'D. Serum and urine analysis'], ['p. Amplification of nucleic acid', 'q. Detection only after much pathogen or antibody builds up', 'r. Antigen-antibody reaction', 's. Hybridisation with a labelled single strand'], 'A-r, B-p, C-s, D-q', ['A-p, B-r, C-s, D-q', 'A-r, B-p, C-q, D-s', 'A-s, B-p, C-r, D-q'], 'ELISA uses antigen-antibody reaction, PCR amplifies nucleic acid, a probe hybridises with its complementary sequence and conventional tests detect disease only late.');
match(4, 'biopiracy', 'mba4', 'Patent and ethics terms', ['A. Basmati', 'B. Turmeric', 'C. Neem', 'D. GEAC'], ['p. Wound-healing use', 'q. Crossed with semi-dwarf varieties and claimed as invention', 'r. Pesticidal and fungicidal use', 's. Approves GM research and release in India'], 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-p, C-q, D-s'], 'Basmati was claimed by crossing with semi-dwarf varieties, turmeric is known for wound healing and neem for pesticidal properties. GEAC is the Indian body for safety approval of GMOs.');

pass('bap1', 'Silencing a nematode', 'In a field experiment, tobacco plants were engineered to make a sense RNA and an antisense RNA of a gene that the root-knot nematode <i>Meloidogyne incognita</i> needs to live. The genes were put into the plants using <i>Agrobacterium</i> vectors. Roots of transgenic and normal plants were infected with the nematode.');
pq('bap1', 3, 'RNAi', 'Why are both sense and antisense RNAs made in the transgenic plants?', 'they pair to make a dsRNA which starts RNA interference', ['they are translated into the Bt toxin', 'they cut the nematode DNA', 'they make the plant resistant to antibiotics'], 'The complementary strands form dsRNA. This triggers silencing of the matching mRNA of the nematode.');
pq('bap1', 3, 'RNAi', 'What is expected in the transgenic plants?', 'the nematode cannot survive in the roots', ['the plants die', 'the nematode grows faster', 'the plants make insulin'], 'Silencing of the vital gene of the parasite means that the nematode cannot establish itself and the plant is protected.');
pq('bap1', 4, 'RNAi', 'Which natural phenomenon is the basis of this method?', 'a defence by which cells silence mRNA using complementary RNA', ['replication of plasmid DNA', 'splicing of introns', 'the Bt protoxin activation'], 'RNAi is a natural mechanism in eukaryotes in which a complementary dsRNA binds an mRNA and silences it. It is started by RNA viruses and transposons that replicate through RNA.');

pass('bap2', 'Making insulin in bacteria', 'Human insulin has two chains: chain A with 21 amino acids and chain B with 30 amino acids. In humans, it is made as proinsulin, which includes a C peptide that is removed. For the 1983 process, two DNA sequences were prepared separately, each placed in a plasmid and put into <i>E. coli</i>.');
pq('bap2', 3, 'insulin', 'How many amino acids are present in mature human insulin?', '51', ['21', '30', '81'], 'Total = 21 + 30 = 51. The C peptide is not part of the mature hormone.');
pq('bap2', 3, 'insulin', 'How were the two chains made in the bacteria turned into active insulin?', 'by joining them with disulphide bridges', ['by joining them with the C peptide', 'by a restriction enzyme', 'by a PCR run'], 'The separately produced chains A and B were extracted and combined by creating disulphide bonds.');
pq('bap2', 4, 'insulin', 'How many peptide bonds are there in the two chains of mature insulin together?', '49', ['51', '50', '47'], 'A chain of n amino acids has n - 1 peptide bonds. Chain A: 20, chain B: 29. Total = 49. The disulphide bonds are not peptide bonds.', 'Two chains means 2 fewer bonds than 51 amino acids.');

pass('bap3', 'An early detection test', 'A patient is suspected of having a viral infection, but has no symptoms yet and no antibodies in the blood. The lab uses PCR on a blood sample that has about 20 copies of the viral DNA. The test shows a positive result only when there are at least 10<sup>6</sup> copies. Assume perfect doubling in each cycle.');
pq('bap3', 4, 'PCR diagnosis', 'What is the minimum number of cycles required for a positive result?', '16', ['15', '20', '17'], '20 &times; 2<sup>n</sup> &ge; 10<sup>6</sup> gives 2<sup>n</sup> &ge; 50 000. 2<sup>15</sup> = 32 768 (too small) and 2<sup>16</sup> = 65 536. So n = 16.', 'Remember to divide by the starting copy number.');
pq('bap3', 3, 'diagnosis', 'Why would an ELISA for antibodies be negative at this stage?', 'the body has not yet made antibodies against the virus', ['ELISA can detect only DNA', 'the virus is not an antigen', 'antibodies are made only after PCR'], 'ELISA detects antibodies or antigen. Early in infection, antibodies have not been made.');
pq('bap3', 3, 'diagnosis', 'Which feature of PCR makes this early detection possible?', 'amplification of a very small amount of nucleic acid', ['cutting of proteins', 'staining of the cell wall', 'heating of the blood to 100 &deg;C'], 'PCR makes a huge number of copies from a few molecules, so even a low viral load is detectable.');

// numeric items
nat(2, 'insulin', 'How many amino acids make up mature human insulin (chain A + chain B)?', 51, 'Chain A has 21 and chain B has 30 amino acids. 21 + 30 = 51.');
nat(3, 'insulin', 'How many peptide bonds are there in mature human insulin (both chains)? Do not count disulphide bridges.', 49, 'Peptide bonds = (21 - 1) + (30 - 1) = 20 + 29 = 49.', null, 'Bonds are one fewer than amino acids in each chain.');
nat(4, 'insulin', 'A synthetic gene for chain B of insulin (30 amino acids) is made with codons for each amino acid and one stop codon. How many nucleotides are in the coding sequence?', 93, 'Idea: each codon is 3 nucleotides. 30 amino acids + 1 stop = 31 codons. 31 &times; 3 = 93 nucleotides.', null, 'Do not forget the stop codon.');
nat(4, 'insulin', 'A synthetic gene for chain A of insulin (21 amino acids) is made with codons for each amino acid and one stop codon. How many nucleotides are in the coding sequence?', 66, '21 + 1 = 22 codons. 22 &times; 3 = 66 nucleotides.');
nat(2, 'transgenic animals', 'Out of 2000 transgenic animals in a laboratory survey, 95% are mice. How many are mice?', 1900, '95% of 2000 = 0.95 &times; 2000 = 1900.');
nat(3, 'transgenic animals', 'A transgenic cow makes milk with 2.4 g of human &alpha;-lactalbumin per litre. How many grams of the protein are present in 50 litres of milk?', 120, '2.4 &times; 50 = 120 g.', 'g');
nat(3, 'Bt toxin', 'How many different <i>cry</i> genes are listed for the Bt crops in NCERT: cryIAc, cryIIAb and cryIAb?', 3, 'The three genes are cryIAc, cryIIAb and cryIAb.');
nat(3, 'Bt toxin', 'On 20 hectares of cotton the yield without protection would be 25 quintals per hectare. Bollworms destroy 30% of the crop in the normal field, and 5% in the Bt field. How many quintals more does the Bt field give?', 125, 'Idea: Bt field loses 5%, the normal field 30%. Difference = 25% of the total potential yield. Total potential = 20 &times; 25 = 500 quintals. 25% of 500 = 125 quintals.', 'quintals');
nat(3, 'transgenic animals', 'A transgenic mouse carries the transgene on only one of its two chromosomes (hemizygous). It is crossed with a non-transgenic mouse. In a litter of 8 pups, how many are expected to carry the transgene?', 4, 'Half of the gametes of the hemizygous parent carry the transgene, so 1/2 of the pups carry it. 8 &times; 1/2 = 4.');
nat(4, 'transgenic animals', 'Two hemizygous transgenic mice are crossed. What percentage of their offspring are expected to carry at least one copy of the transgene?', 75, 'Treat the transgene as an allele T. Tt &times; Tt gives 1 TT : 2 Tt : 1 tt. At least one copy in 3/4 = 75%.', '%', 'Offspring with one copy and with two copies both count.');
nat(5, 'transgenic animals', 'Two unlinked transgenes, X and Y, each hemizygous, are present in a mouse (so it is XxYy in terms of presence or absence). It is crossed with a non-transgenic mouse. What percentage of offspring carry both transgenes?', 25, 'Each transgene passes to half of the pups independently. 1/2 &times; 1/2 = 1/4 = 25%.', '%');
nat(5, 'transgenic animals', 'Two mice, each hemizygous for X and for Y (unlinked), are crossed. What percentage of offspring carry at least one copy of X AND at least one copy of Y? Give the answer to two decimals.', 56.25, 'For each transgene the chance of at least one copy is 3/4. Independent, so (3/4)<sup>2</sup> = 9/16 = 56.25%.', '%', null, 0.01);
nat(4, 'PCR diagnosis', 'A blood sample has 8 copies of a viral gene. The PCR test is positive at 10<sup>7</sup> copies or more. What is the minimum number of cycles needed?', 21, '8 &times; 2<sup>n</sup> &ge; 10<sup>7</sup> gives 2<sup>n</sup> &ge; 1 250 000. 2<sup>20</sup> = 1 048 576 (too small); 2<sup>21</sup> = 2 097 152. So n = 21.');
nat(4, 'diagnosis', 'In a two-fold serial dilution, serum is first diluted 1 in 20 and each next well has half the antibody of the one before. The last well with a positive ELISA is the 6th well. What is the reciprocal of the dilution in that well (the titre)?', 640, 'Dilutions are 20, 40, 80, 160, 320, 640 for wells 1 to 6. The 6th well is 1 in 640.');
nat(4, 'RNAi', 'A sense RNA of 600 nucleotides pairs completely with its antisense RNA to form a dsRNA. How many nucleotides are in the dsRNA in total?', 1200, 'Both strands have 600 nucleotides, so 600 + 600 = 1200. There are 600 base pairs.', null, 'Count both strands.');
nat(3, 'gene therapy', 'Lymphocytes (5 &times; 10<sup>6</sup>) are grown in culture and double every day for 4 days before infusion. How many cells are there at the end of day 4?', 80000000, '4 doublings = 2<sup>4</sup> = 16. 5 &times; 10<sup>6</sup> &times; 16 = 8 &times; 10<sup>7</sup>.');

// ---------------------------------------------------------------- Level 4
mc(4, 'Bt toxin', 'Bt toxins are specific to certain insect groups. Which set lists groups that different Bt strains act on?', 'beetles (coleopterans), moths and caterpillars (lepidopterans) and flies and mosquitoes (dipterans)', ['only birds and fish', 'only earthworms', 'only plants and fungi'], 'Different Bt strains make different Cry proteins. They are active against coleopterans (beetles), lepidopterans (tobacco budworm, armyworm) and dipterans (flies, mosquitoes).');
mc(4, 'Bt toxin', 'A farmer grows Bt cotton and still finds that tobacco roots in his neighbouring field are infected with root-knot nematodes. The reason is that', 'Bt toxin does not act on nematodes; RNAi would be needed', ['Bt toxin kills only plants', 'the nematodes eat the toxin and become stronger', 'the nematodes are not parasites'], 'Cry proteins act on insects with an alkaline gut and specific receptors. Nematode resistance was achieved by RNAi, which is a different method.', 'Both are "pest control by biotechnology", but they use different mechanisms.');
mc(4, 'Bt toxin', 'Which pair is correctly matched?', 'cryIIAb - cotton bollworm', ['cryIAb - cotton bollworm', 'cryIAc - corn borer', 'cryIAb - root-knot nematode'], 'cryIAc and cryIIAb act on cotton bollworms. cryIAb acts on the corn borer. Nematodes are handled by RNAi, not by a cry gene.');
mc(4, 'Bt toxin', 'The <i>cry</i> gene from <i>Bacillus</i> has been put into the cotton plant using a vector. Which vector is most likely used to transfer it into cotton, a dicot?', 'the disarmed Ti plasmid of <i>Agrobacterium tumefaciens</i>', ['a retrovirus', 'pBR322 alone', 'a bacteriophage'], 'Cotton is a dicot, so <i>Agrobacterium</i> with a disarmed Ti plasmid can be used. A retrovirus is for animal cells.', null);
mc(4, 'RNAi', 'A student says RNAi and Bt cotton both protect plants from pests. Which statement is a real difference?', 'in RNAi the plant makes dsRNA that silences a gene of the pest, in Bt cotton the plant makes a protein toxin', ['Bt cotton uses RNA, RNAi uses protein', 'RNAi kills the plant\'s own cells', 'Bt works through the host\'s mRNA'], 'A protein (Cry toxin) is the active agent in Bt cotton. In RNAi the active agent is RNA that blocks translation of the pest\'s mRNA.');
mc(4, 'RNAi', 'Which of the following is a natural source of the complementary RNA that triggers RNAi in cells?', 'a virus with an RNA genome', ['a ribosome', 'a restriction enzyme', 'the cell wall'], 'RNA viruses and transposons replicating through RNA intermediates make dsRNA, which the cell uses to start silencing as a defence.');
mc(4, 'gene therapy', 'Which vector was used to put the functional ADA cDNA into the patient\'s lymphocytes?', 'a retroviral vector', ['Ti plasmid', 'pBR322', 'gene gun'], 'Retroviruses enter animal cells and integrate their genome into host DNA. A disarmed retrovirus carries the gene in.', 'The Ti plasmid is for plants.');
mc(4, 'gene therapy', 'Arrange the steps of ADA gene therapy of 1990: (i) a functional ADA cDNA is introduced into lymphocytes with a retroviral vector, (ii) lymphocytes are grown in culture outside the body, (iii) modified lymphocytes are returned to the patient, (iv) lymphocytes are taken from the blood of the patient.', '(iv), (ii), (i), (iii)', ['(iv), (i), (ii), (iii)', '(ii), (iv), (i), (iii)', '(iv), (ii), (iii), (i)'], 'Blood lymphocytes are taken, grown in culture, given the ADA cDNA through the vector, and then returned.', 'The gene is put into the cells before they are returned, and after they are grown in culture.');
mc(4, 'diagnosis', 'ELISA stands for', 'enzyme-linked immunosorbent assay', ['enzyme-labelled immune serum analysis', 'electrophoresis-linked immunological sequencing assay', 'enzyme-linked inhibitor serum assay'], 'The test uses an enzyme linked to an antibody or antigen that gives a visible colour when the antigen-antibody reaction has occurred.');
mc(4, 'diagnosis', 'A probe was made for a mutant sequence (not the normal one). A clone carrying the mutant gene is tested by hybridisation and autoradiography. The result is', 'a signal appears for the clone with the mutant gene', ['no signal appears for the mutant clone', 'the film is blank for all clones', 'a signal appears only for the normal clone'], 'The probe is complementary to the mutant sequence. It will hybridise to the mutant clone, so that clone appears on the film.', 'The usual case in NCERT uses a probe for the normal gene, so the mutant clone is missing. Here the probe design is reversed.');
mc(4, 'transgenic animals', 'Transgenic animals have been designed to produce human proteins useful against', 'phenylketonuria and cystic fibrosis', ['malaria and cholera only', 'colour blindness and sickle-cell anaemia', 'none of the human diseases'], 'The biological products from transgenic animals include medicines for diseases such as PKU and cystic fibrosis.');
mc(4, 'transgenic animals', 'Which of the following is NOT a use of transgenic animals?', 'making a plant resistant to bollworms', ['finding out how a gene works in normal development', 'making disease models for Alzheimer\'s', 'toxicity testing of chemicals'], 'Resistance of a plant to an insect is a GM crop application, not a transgenic animal use.');
mc(4, 'ethics', 'Why do cases of biopiracy create problems for developing countries?', 'a company can get exclusive rights over a traditional resource or knowledge without paying the people who developed it', ['patents expire at once', 'resources are destroyed in the lab', 'all crops become GM'], 'Biopiracy takes the benefit away from the countries and communities concerned. Patents on basmati, turmeric and neem were challenged for this reason.');
mc(4, 'ethics', 'Which of the following is a concern with the patenting of a biological resource?', 'the invention may be an already-known traditional use', ['the invention is always harmful', 'the patent is valid forever', 'it needs no examination'], 'The turmeric patent for wound healing was challenged because the use was already known in India, so there was no novelty.');
mc(4, 'GM crops', 'Which is a GM crop trait mentioned in the textbook that improves human nutrition?', 'rice enriched with vitamin A', ['pesticide-sprayed rice', 'rice with no starch', 'rice with extra stems'], 'Golden rice has been made to produce a precursor of vitamin A.');
mc(4, 'GM crops', 'Which of these is NOT a benefit expected from tailor-made GM plants as sources for industry?', 'plants which grow on air alone', ['starch of better quality', 'fuels', 'pharmaceuticals'], 'GM plants can provide alternative resources like starches, fuels and pharmaceuticals, but they do not grow without water and nutrients.');
mc(4, 'insulin', 'Which statement about insulin made by recombinant DNA technology is correct?', 'chains A and B were produced separately in <i>E. coli</i> and later combined', ['the bacterium made proinsulin and removed the C peptide', 'chain A and chain B were joined by the C peptide', 'insulin was cut from pig pancreas and treated with ligase'], 'In the 1983 method the chains were produced separately. The chains were then joined by disulphide bonds.');
mc(4, 'mixed', 'The gene for a human protein is cloned in a bacterial vector. A scientist uses a probe and PCR to confirm that the vector carries the gene. Which two techniques from the principles chapter are being used?', 'PCR for amplification and nucleic acid hybridisation for detection', ['gel gun and gene gun', 'only heat shock', 'only Taq cloning'], 'PCR can amplify the gene to check its presence and a labelled probe finds the complementary sequence.');

asr(4, 'Bt toxin', 'Bt cotton reduces the need for chemical insecticides.', 'The plant itself produces the insecticidal protein from the introduced cry gene.', 0, 'The cry gene in the plant means that insects that feed on it are affected without any spray.');
asr(4, 'RNAi', 'In RNAi, the production of both sense and antisense RNAs is needed in the host plant.', 'Sense and antisense RNAs are complementary and form dsRNA.', 0, 'The dsRNA is what starts the silencing. A single strand alone does not form it.');
asr(4, 'ethics', 'Turmeric patent in the USA was challenged and revoked.', 'The use of turmeric for wound healing was already known in India.', 0, 'The use was traditional knowledge, so the patent claim lacked novelty.');
stm(4, 'GM crops', 'GM crops can be made tolerant to cold, drought, salt and heat.', 'GM crops always need more chemical pesticides than ordinary crops.', 2, 'I is correct. II is wrong, since pest-resistant GM crops need less pesticide.');
stm(4, 'transgenic animals', 'Transgenic animals can be made more sensitive to toxic substances for quicker safety testing.', 'A transgenic mouse may replace the monkey in polio vaccine safety testing.', 0, 'Both are uses described in the textbook.');
stm(4, 'diagnosis', 'In a probe test, a clone with a mutation in the target gene does not appear on the photographic film.', 'The probe has no complementarity to the mutated sequence.', 0, 'The probe is complementary to the normal gene, which is why the mutated one is missing on the film.');

match(4, 'applications', 'mba5', 'Technology and its example', ['A. Pest resistance by a bacterial protein', 'B. Pest resistance by silencing mRNA', 'C. Replacing a defective gene function', 'D. Recombinant hormone from bacteria'], ['p. Gene therapy for ADA deficiency', 'q. Humulin', 'r. Bt cotton', 's. Transgenic tobacco against <i>Meloidogyne</i>'], 'A-r, B-s, C-p, D-q', ['A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p', 'A-p, B-s, C-r, D-q'], 'Bt cotton makes the bacterial Cry protein; RNAi in tobacco silences the nematode mRNA; ADA gene therapy supplies a functional gene; Humulin is recombinant human insulin.');

pass('bap4', 'A breeding programme', 'A line of transgenic mice carries one copy of a transgene (T) on one chromosome of a pair (hemizygous, T/-). The other chromosome of the pair has no transgene. The transgene is not linked to any other gene studied here and behaves like a dominant allele for presence.');
pq('bap4', 4, 'transgenic', 'A T/- mouse is crossed with a normal mouse. What fraction of the pups carries the transgene?', '1/2', ['1/4', '3/4', 'all'], 'A hemizygous parent makes two kinds of gametes, T and no-T, in equal numbers. The normal parent gives only no-T gametes, so half the pups are T/-.');
pq('bap4', 4, 'transgenic', 'Two T/- mice are crossed. What fraction of the pups carries at least one copy?', '3/4', ['1/2', '1/4', '2/3'], 'T/- &times; T/- gives 1 T/T : 2 T/- : 1 -/-. Three of four pups have at least one copy.');
pq('bap4', 5, 'transgenic', 'Among pups that carry the transgene from the cross T/- &times; T/-, what fraction are homozygous (T/T)?', '1/3', ['1/4', '1/2', '2/3'], 'Pups with a copy: 1 T/T + 2 T/- = 3. One of these 3 is T/T, so the fraction is 1/3.', 'The denominator is the group of pups that carry the transgene, not all pups.');

// ---------------------------------------------------------------- Level 5
mc(5, 'Bt toxin', 'Which one of the following steps in Bt action does NOT happen in the insect midgut?', 'the Cry gene is transcribed from the insect DNA', ['dissolving of the crystals at alkaline pH', 'activation of the protoxin', 'binding to the epithelial cells and making pores'], 'The <i>cry</i> gene belongs to the bacterium (or the Bt crop). The insect does not make the protein. Solubilisation, activation, binding and pore formation occur in the insect gut.', 'The insect is the victim, not the producer.');
mc(5, 'RNAi', 'A researcher makes a transgenic plant that produces only the sense RNA of a nematode gene (no antisense RNA). Which result is most likely?', 'little or no silencing of the nematode gene, since no dsRNA is formed', ['strong silencing as with dsRNA', 'the plant makes Bt toxin', 'the nematode is killed by the DNA'], 'RNAi needs a double-stranded RNA. A sense strand alone has nothing complementary to pair with, unless some antisense RNA is also made.');
mc(5, 'insulin', 'Which of these is a correct statement about the insulin that Eli Lilly prepared in 1983?', 'the two chains were produced in separate steps and joined by creating disulphide bonds', ['chain A and chain B were made as one polypeptide joined by peptide bonds', 'the C peptide was joined to chain A', 'the chains were produced in the human pancreas'], 'The process used two DNA sequences, one for each chain. The gene products were joined chemically through disulphide bonds.', 'Do not mix the natural route (proinsulin, C peptide) with the engineered one.');
mc(5, 'gene therapy', 'Which of the following reasons explains why enzyme-replacement and gene therapy of ADA deficiency both need to be repeated in some form?', 'enzyme must be injected again and again, and lymphocytes with the gene are not immortal', ['the retrovirus is destroyed at birth', 'the ADA enzyme is a hormone with a short half-life only', 'the gene is not expressed ever'], 'The injected enzyme gets used up and the modified lymphocytes die. Both treatments are therefore not a one-time cure.');
mc(5, 'diagnosis', 'Which statement correctly compares PCR and ELISA in diagnosing AIDS?', 'PCR detects the nucleic acid of the virus, ELISA detects antigen or antibody against it', ['both detect only nucleic acids', 'ELISA detects nucleic acid, PCR detects antibodies', 'both detect only antibodies'], 'PCR amplifies viral nucleic acid. ELISA is an antigen-antibody method. The first is useful earlier in the infection.', 'ELISA tests the immune side (antibody) or the pathogen\'s proteins; PCR tests genetic material.');
mc(5, 'transgenic animals', 'Which statement about transgenic animals is NOT correct?', 'they are made only by crossing two normal varieties', ['they express a foreign gene', 'over 95% of them are mice', 'they are used to test chemical safety'], 'Transgenic animals are made by putting a foreign gene into the animal. Crossing normal varieties gives hybrids, not transgenics.');
mc(5, 'ethics', 'A multinational company has patented a use of a plant extract that Indian communities have known for ages. Which action best fits the idea in the textbook?', 'challenge the patent as biopiracy, as was done for turmeric and basmati', ['accept the patent since it is legal', 'burn the crop', 'claim the patent for the company'], 'Biopiracy is the taking of bio-resources and the knowledge about them without permission and without fair payment. The patent on turmeric was revoked after it was challenged.');
mc(5, 'ethics', 'GEAC is concerned with', 'the validity of GM research and the safety of GM organisms for public services', ['patents on basmati only', 'testing the speed of PCR', 'approving drugs of any kind'], 'The Genetic Engineering Approval Committee is Government of India\'s body for GM research and the release of GM organisms.');
mc(5, 'mixed', 'A student says Bt cotton is a hybrid and not a GM crop. What is the best correction?', 'Bt cotton carries a gene (cry) from another organism; a hybrid is made by crossing two plants of the same kind', ['Bt cotton has no new gene', 'hybrids are always GM', 'GM crops are made by crossing cotton with Bt bacteria'], 'GM crops have a gene put in with the tools of rDNA technology, even from a different species. Hybrids come from sexual crosses.');
mc(5, 'mixed', 'In the 1990 ADA gene therapy, the cDNA and not a genomic gene was put into the vector because', 'a cDNA is made from mRNA, has no introns and is short enough for the retroviral vector', ['cDNA is double-stranded RNA', 'a genomic gene is not DNA', 'cDNA has more introns'], 'The cDNA is a copy of the mature mRNA, so it has the coding sequence without introns, and fits in the vector.');
mc(5, 'mixed', 'Which of the following correctly joins the idea of RNAi with the central dogma?', 'the mRNA is the target, and its translation into protein is blocked', ['DNA is cut so that RNA is not made', 'the ribosome is made of dsRNA', 'tRNA is converted to DNA'], 'RNAi acts after transcription. A dsRNA binds and silences the specific mRNA, so the protein is not made.');

nat(4, 'insulin', 'A student calculates how many water molecules are released when the amino acids of chains A and B of insulin join to form the two chains. (One water per peptide bond; do not count disulphide bridges.)', 49, 'Water molecules = peptide bonds = (21 - 1) + (30 - 1) = 49.');
nat(4, 'gene therapy', 'ADA deficiency is an autosomal recessive condition. Two carrier parents have 12 children. How many are expected to be affected?', 3, 'Idea: carrier &times; carrier gives 1/4 affected. 12 &times; 1/4 = 3.', null, 'The probability is for each child; the expected number is just a mean.');
nat(5, 'RNAi', 'A transgene produces a 400-nucleotide sense RNA, and the antisense RNA is the exact complement. How many base pairs are in the dsRNA?', 400, 'Each base of the sense strand pairs with one base of the antisense strand, so there are 400 base pairs (800 nucleotides in all).', 'bp');
nat(5, 'transgenic animals', 'A line of mice is homozygous for a transgene (T/T). It is crossed with a normal mouse. In a litter of 9 pups, how many are expected to carry the transgene?', 9, 'The homozygote gives only T gametes, so all pups are T/- . All 9 carry the transgene.');

// ---------------------------------------------------------------- templates
const SENSE_BASES = 'ACGU';
const CR = { A: 'U', U: 'A', G: 'C', C: 'G' };
const rcR = (s) => [...s].reverse().map((c) => CR[c]).join('');
const compR = (s) => [...s].map((c) => CR[c]).join('');
const rndR = (rng, k) => Array.from({ length: k }, () => SENSE_BASES[Math.floor(rng() * 4)]).join('');
const lj = (x) => x.toLocaleString('en-US').replace(/,/g, ' ');

const gens = [
  {
    id: 'ba-g01', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'insulin',
    make(rng) {
      const which = choose(rng, ['A', 'B', 'both']);
      const len = which === 'A' ? 21 : which === 'B' ? 30 : 51;
      const quantity = choose(rng, ['aa', 'peptide', 'nt']);
      const chains = which === 'both' ? 2 : 1;
      const label = which === 'both' ? 'chain A and chain B together' : `chain ${which}`;
      let q, ans, sol;
      if (quantity === 'aa') { q = `How many amino acids are in ${label} of mature human insulin? (Chain A has 21 and chain B has 30.)`; ans = len; sol = `Idea: add the chain lengths. ${which === 'both' ? '21 + 30' : len} = ${len}.`; }
      else if (quantity === 'peptide') { q = `How many peptide bonds are there within ${label} of mature human insulin? (Chain A: 21 amino acids, chain B: 30.)`; ans = len - chains; sol = `Idea: a chain of n amino acids has n - 1 peptide bonds. For ${label}: ${len} - ${chains} = ${ans}.`; }
      else { q = `A synthetic gene codes for ${label} of insulin (chain A: 21 amino acids, chain B: 30), with one stop codon for each chain. How many nucleotides are in its coding sequence?`; ans = (len + chains) * 3; sol = `Idea: one codon (3 nucleotides) per amino acid plus one stop codon per chain. Codons = ${len} + ${chains} = ${len + chains}. Nucleotides = ${len + chains} &times; 3 = ${ans}.`; }
      return { which, quantity, len, chains, q, answer: ans, tol: 0, sol };
    },
    verify(p) { return p.quantity === 'aa' ? p.len : p.quantity === 'peptide' ? p.len - p.chains : 3 * p.len + 3 * p.chains; },
  },
  {
    id: 'ba-g02', type: 'nat', level: 4, format: 'integer', exams: ['neet'], sub: 'PCR diagnosis',
    make(rng) {
      const s = choose(rng, [1, 2, 5, 10, 20, 50, 100]);
      const k = int(rng, 5, 9);
      const T = 10 ** k;
      let n = 0, x = s; while (x < T) { x *= 2; n++; }
      return { s, k, T, n, q: `A blood sample has ${s} copies of a viral DNA. A PCR test reads positive when at least 10<sup>${k}</sup> copies are present. Assuming perfect doubling, what is the minimum number of cycles needed?`, answer: n, tol: 0, sol: `Idea: find the smallest n with ${s} &times; 2<sup>n</sup> &ge; 10<sup>${k}</sup>. After ${n - 1} cycles: ${lj(s * 2 ** (n - 1))} copies (too few). After ${n} cycles: ${lj(s * 2 ** n)} copies (enough). So n = ${n}.` };
    },
    verify(p) { return Math.ceil(Math.log2(p.T / p.s) - 1e-12); },
  },
  {
    id: 'ba-g03', type: 'nat', level: 3, format: 'numeric', exams: ['neet'], sub: 'transgenic breeding',
    make(rng) {
      const N = choose(rng, [8, 12, 16, 20, 24, 40, 80, 100]);
      const cross = choose(rng, [
        ['a hemizygous transgenic mouse (T/-) is crossed with a normal mouse', 1 / 2, 'half of the gametes of the T/- parent carry the transgene and the normal parent gives none, so 1/2 of the pups are T/-'],
        ['two hemizygous transgenic mice (T/- &times; T/-) are crossed and all pups with at least one copy are counted', 3 / 4, 'T/- &times; T/- gives 1 T/T : 2 T/- : 1 -/-, so 3/4 carry at least one copy'],
        ['two hemizygous transgenic mice (T/- &times; T/-) are crossed and only pups homozygous for the transgene are counted', 1 / 4, 'T/- &times; T/- gives 1 T/T : 2 T/- : 1 -/-, so 1/4 are T/T'],
        ['a homozygous transgenic mouse (T/T) is crossed with a normal mouse', 1, 'every gamete of T/T carries the transgene, so all pups are T/-'],
      ]);
      const [desc, f, why] = cross;
      return { N, f, q: `In a litter of ${N} pups, how many are expected to carry the transgene when ${desc}? (Count only the pups described.)`, answer: N * f, tol: 0.01, sol: `Idea: write the gametes and the cross. ${why[0].toUpperCase() + why.slice(1)}. Expected pups = ${N} &times; ${f} = ${fmt(N * f, 4)}.` };
    },
    verify(p) { return p.N * p.f; },
  },
  {
    id: 'ba-g04', type: 'nat', level: 4, format: 'numeric', exams: ['neet'], sub: 'transgenic breeding',
    make(rng) {
      const n = int(rng, 2, 4);
      const mode = choose(rng, ['testcross', 'selfcross']);
      const f = mode === 'testcross' ? 0.5 ** n : 0.75 ** n;
      const desc = mode === 'testcross' ? `crossed with a normal mouse, what percentage of pups carry all ${n} transgenes` : `crossed with another mouse of the same kind, what percentage of pups carry at least one copy of each of the ${n} transgenes`;
      return { n, mode, f, q: `A mouse is hemizygous for each of ${n} unlinked transgenes. If it is ${desc}? Give the answer to two decimals.`, answer: +(f * 100).toFixed(2), tol: 0.01, unit: '%', sol: mode === 'testcross' ? `Idea: each transgene is passed on to half of the pups, independently. All ${n}: (1/2)<sup>${n}</sup> = ${fmt(f, 4)} = ${(f * 100).toFixed(2)}%.` : `Idea: for each transgene the chance of at least one copy is 3/4 in a hemizygous &times; hemizygous cross, and the genes are independent. (3/4)<sup>${n}</sup> = ${fmt(f, 4)} = ${(f * 100).toFixed(2)}%.` };
    },
    verify(p) { return +((p.mode === 'testcross' ? Math.pow(0.5, p.n) : Math.pow(3 / 4, p.n)) * 100).toFixed(2); },
  },
  {
    id: 'ba-g05', type: 'nat', level: 3, format: 'numeric', exams: ['neet'], sub: 'Bt crops',
    make(rng) {
      const ha = choose(rng, [10, 20, 25, 40, 50, 100]);
      const y = choose(rng, [15, 20, 25, 30]);
      const a = choose(rng, [20, 25, 30, 40]);
      const b = choose(rng, [2, 5, 8, 10]);
      const tot = ha * y;
      const saved = (tot * (a - b)) / 100;
      return { ha, y, a, b, saved, q: `Without any damage, a cotton field of ${ha} hectares would give ${y} quintals per hectare. Bollworms destroy ${a}% of the crop in an ordinary field and ${b}% in a Bt cotton field. How many quintals more does the Bt field give?`, answer: saved, tol: 0.01, unit: 'quintals', sol: `Idea: the difference in loss is ${a} - ${b} = ${a - b}% of the potential yield. Potential yield = ${ha} &times; ${y} = ${tot} quintals. ${a - b}% of ${tot} = ${fmt(saved, 5)} quintals.` };
    },
    verify(p) { return p.ha * p.y * p.a / 100 - p.ha * p.y * p.b / 100; },
  },
  {
    id: 'ba-g06', type: 'nat', level: 3, format: 'numeric', exams: ['neet'], sub: 'transgenic animals',
    make(rng) {
      const conc = choose(rng, [1.2, 2.4, 3.6, 4.8]);
      const L = choose(rng, [10, 20, 25, 50, 80]);
      const d = int(rng, 2, 7);
      return { conc, L, d, q: `A transgenic cow gives ${L} litres of milk a day. The milk has ${conc} g of a human protein per litre. How many grams of the protein can be collected in ${d} days?`, answer: +(conc * L * d).toFixed(2), tol: 0.01, unit: 'g', sol: `Idea: protein per day = concentration &times; volume = ${conc} &times; ${L} = ${fmt(conc * L, 5)} g. For ${d} days: ${fmt(conc * L, 5)} &times; ${d} = ${fmt(conc * L * d, 6)} g.` };
    },
    verify(p) { return +(p.conc * p.L * p.d).toFixed(2); },
  },
  {
    id: 'ba-g07', type: 'nat', level: 4, format: 'integer', exams: ['neet'], sub: 'ELISA',
    make(rng) {
      const start = choose(rng, [10, 20, 40, 50, 100]);
      const w = int(rng, 3, 9);
      return { start, w, q: `Serum is diluted two-fold again and again in the wells of an ELISA plate. Well 1 has a dilution of 1 in ${start}, and each next well has half the serum of the one before. The last well that gives a positive colour is well ${w}. What is the titre (the reciprocal of the dilution in that well)?`, answer: start * 2 ** (w - 1), tol: 0, sol: `Idea: the dilution doubles in each next well. Well ${w} is ${w - 1} doublings after well 1. Titre = ${start} &times; 2<sup>${w - 1}</sup> = ${start * 2 ** (w - 1)}.` };
    },
    verify(p) { let x = p.start; for (let i = 1; i < p.w; i++) x *= 2; return x; },
  },
  {
    id: 'ba-g08', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'RNAi',
    make(rng) {
      const L = choose(rng, [200, 300, 400, 500, 600, 800, 1000]);
      const ask = choose(rng, ['bp', 'nt']);
      return { L, ask, q: `A sense RNA of ${L} nucleotides is made in a plant, together with a full-length complementary antisense RNA. When they pair to form a dsRNA, how many ${ask === 'bp' ? 'base pairs' : 'nucleotides in total'} does the dsRNA have?`, answer: ask === 'bp' ? L : 2 * L, tol: 0, sol: `Idea: each base in the sense strand pairs with one base of the antisense strand. Base pairs = ${L}. Total nucleotides = 2 &times; ${L} = ${2 * L}. Asked for ${ask === 'bp' ? 'base pairs: ' + L : 'total nucleotides: ' + 2 * L}.` };
    },
    verify(p) { return p.ask === 'bp' ? p.L : p.L + p.L; },
  },
  {
    id: 'ba-g09', type: 'nat', level: 3, format: 'integer', exams: ['neet'], sub: 'gene therapy',
    make(rng) {
      const N0 = choose(rng, [1, 2, 4, 5]) * 1e6;
      const d = int(rng, 2, 6);
      return { N0, d, q: `Lymphocytes from a patient are grown in culture before gene transfer. There are ${lj(N0)} cells at the start and the number doubles every day. How many cells are present after ${d} days?`, answer: N0 * 2 ** d, tol: 0, sol: `Idea: doubling each day, so cells = start &times; 2<sup>days</sup> = ${lj(N0)} &times; ${2 ** d} = ${lj(N0 * 2 ** d)}.` };
    },
    verify(p) { let x = p.N0; for (let i = 0; i < p.d; i++) x *= 2; return x; },
  },
  {
    id: 'ba-g10', type: 'nat', level: 3, format: 'numeric', exams: ['neet'], sub: 'ADA deficiency',
    make(rng) {
      const N = choose(rng, [4, 8, 12, 16, 20, 40]);
      return { N, q: `ADA deficiency is an autosomal recessive condition. Two parents who are both carriers have ${N} children over the years. About how many of the children are expected to be affected?`, answer: N / 4, tol: 0.01, sol: `Idea: carrier &times; carrier (Aa &times; Aa) gives 1 AA : 2 Aa : 1 aa, so 1/4 of the children are affected (aa). Expected = ${N} &times; 1/4 = ${N / 4}.` };
    },
    verify(p) { return p.N * 0.25; },
  },
  {
    id: 'ba-g11', type: 'mcq', level: 2, format: 'single', exams: ex(2), sub: 'cry genes',
    make(rng) {
      const pairs = [['cryIAc', 'cotton bollworm'], ['cryIIAb', 'cotton bollworm'], ['cryIAb', 'corn borer']];
      const [gene, pest] = choose(rng, pairs);
      const pool = ['cotton bollworm', 'corn borer', 'root-knot nematode', 'aphids on mustard'];
      const o = shuffleOpts(rng, pest, pool.filter((x) => x !== pest));
      return { gene, pest, q: `Which pest is controlled by the Bt gene ${gene}?`, options: o.options, answer: o.answer, sol: `Idea: cryIAc and cryIIAb act on cotton bollworms and cryIAb acts on the corn borer. Root-knot nematodes are tackled by RNAi, not by a cry gene. For ${gene} the pest is the ${pest}.` };
    },
    verify(p) { return p.options.indexOf(p.pest); },
  },
  {
    id: 'ba-g12', type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'RNAi',
    make(rng) {
      const k = int(rng, 6, 9);
      const s = rndR(rng, k);
      const right = rcR(s);
      const wr = [...new Set([compR(s), s, [...s].reverse().join('')])].filter((x) => x !== right);
      while (wr.length < 3) { const t = rndR(rng, k); if (t !== right && !wr.includes(t)) wr.push(t); }
      const o = shuffleOpts(rng, `5\'-${right}-3\'`, wr.slice(0, 3).map((x) => `5\'-${x}-3\'`));
      return { s, q: `A plant makes a sense RNA 5\'-${s}-3\' of a nematode gene. The antisense RNA that pairs completely with it, written 5\' to 3\', is`, options: o.options, answer: o.answer, sol: `Idea: pair A-U and G-C, then reverse so that the strand reads 5\' to 3\'. Pairing gives 3\'-${compR(s)}-5\'. Reversed: 5\'-${right}-3\'. This antisense and the sense RNA form the dsRNA that triggers RNAi.`, trap: 'The two RNA strands are antiparallel, and RNA has U in place of T.' };
    },
    verify(p) { return p.options.findIndex((o) => o === `5\'-${rcR(p.s)}-3\'`); },
  },
  {
    id: 'ba-g13', type: 'mcq', level: 2, format: 'single', exams: ex(2), sub: 'biological products',
    make(rng) {
      const rows = [['&alpha;-1-antitrypsin made by a transgenic animal', 'emphysema'], ['human insulin from <i>E. coli</i> (Humulin)', 'diabetes mellitus'], ['ADA cDNA put into lymphocytes', 'ADA deficiency (immune deficiency)'], ['human &alpha;-lactalbumin in the milk of Rosie', 'nutritionally balanced milk for human babies'], ['a transgenic mouse used for testing', 'safety of polio vaccine']];
      const [what, use] = choose(rng, rows);
      const o = shuffleOpts(rng, use, rows.map((r) => r[1]).filter((x) => x !== use).slice(0, 3));
      return { what, use, q: `The main use of ${what} is for`, options: o.options, answer: o.answer, sol: `Idea: remember each product with its use. ${what[0].toUpperCase() + what.slice(1)}: ${use}. The other options are the uses of the other products.` };
    },
    verify(p) { return p.options.indexOf(p.use); },
  },
  {
    id: 'ba-g14', type: 'mcq', level: 3, format: 'single', exams: ex(3), sub: 'molecular diagnosis',
    make(rng) {
      const rows = [
        ['detect HIV genetic material in a person who was infected a few days ago and has no antibodies yet', 'PCR', 'PCR amplifies the small amount of viral nucleic acid directly, so it can detect infection before antibodies appear'],
        ['detect antibodies made against a pathogen in a serum sample', 'ELISA', 'ELISA is based on the antigen-antibody reaction and can detect antibodies or antigens'],
        ['find which cell clone contains a mutated gene using a labelled single-stranded DNA and a photographic film', 'a labelled probe with autoradiography', 'a probe hybridises with its complementary sequence and autoradiography shows where it bound'],
        ['detect a gene mutation present in a small tissue sample from a cancer patient', 'PCR', 'PCR makes many copies of the gene so that the mutation can be examined'],
      ];
      const [sit, ans, why] = choose(rng, rows);
      const pool = ['PCR', 'ELISA', 'a labelled probe with autoradiography', 'gel electrophoresis alone', 'Gram staining'];
      const o = shuffleOpts(rng, ans, pool.filter((x) => x !== ans).slice(0, 3));
      return { sit, ans, q: `Which method would you choose to ${sit}?`, options: o.options, answer: o.answer, sol: `Idea: match the method with what it detects. ${why[0].toUpperCase() + why.slice(1)}. So the answer is ${ans}.` };
    },
    verify(p) { return p.options.indexOf(p.ans); },
  },
  {
    id: 'ba-g15', type: 'mcq', level: 2, format: 'single', exams: ex(2), sub: 'biopiracy',
    make(rng) {
      const rows = [['basmati rice', 'a US patent granted in 1997 on lines made by crossing Indian basmati with semi-dwarf varieties'], ['turmeric', 'a US patent on its use for healing wounds, later revoked'], ['neem', 'a patent on its pesticidal or fungicidal use, based on traditional Indian knowledge']];
      const [res, claim] = choose(rng, rows);
      const o = shuffleOpts(rng, claim, rows.map((r) => r[1]).filter((x) => x !== claim).concat(['a government grant for Bt cotton seed']).slice(0, 3));
      return { res, claim, q: `Which of the following describes a biopiracy case concerning ${res}?`, options: o.options, answer: o.answer, sol: `Idea: biopiracy is the use of a bio-resource or traditional knowledge without permission or compensation. For ${res}: ${claim}. The other options belong to the other resources or are not about biopiracy.` };
    },
    verify(p) { return p.options.indexOf(p.claim); },
  },
];

export default { topic: 'biotech-applications', groups, items, gens };
