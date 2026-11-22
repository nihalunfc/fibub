// NEET UG Biology: Principles of inheritance and variation (NCERT Class 12, Chapter 5 in the 2023 rationalised book). All questions original fibub work.
import { pick, int, choose, fmt, shuffleOpts, numOpts, g } from '../_entrance.js';

const items = [];
const groups = {};
let n = 0, pos = 0;
const POS = [2, 0, 3, 1];
const nid = () => `ih-${String(++n).padStart(3, '0')}`;
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
const I = (x) => `I<sup>${x}</sup>`;

// ---------------------------------------------------------------- Level 1
mc(1, 'Mendel', 'The scientist who is called the father of genetics for his work on pea plants is', 'Gregor Johann Mendel', ['Thomas Hunt Morgan', 'Walter Sutton', 'Hugo de Vries'], 'Mendel did hybridisation experiments on garden pea (<i>Pisum sativum</i>) and proposed the basic laws of inheritance. Morgan worked on <i>Drosophila</i>; Sutton and Boveri proposed the chromosomal theory.');
mc(1, 'Mendel', 'Mendel studied how many pairs of contrasting characters in the garden pea?', 'Seven', ['Three', 'Five', 'Fourteen'], 'He chose seven pairs of contrasting traits, such as tall and dwarf stem, round and wrinkled seed, and violet and white flowers.');
mc(1, 'Mendel', 'When pure tall and pure dwarf pea plants were crossed, all the F<sub>1</sub> plants were tall. This supports the law of', 'dominance', ['segregation', 'independent assortment', 'linkage'], 'Only one of the two contrasting traits (the dominant one) shows in the F<sub>1</sub>. This is Mendel\'s law of dominance.');
mc(1, 'monohybrid cross', 'The phenotypic ratio in the F<sub>2</sub> generation of a monohybrid cross showing complete dominance is', '3 : 1', ['1 : 2 : 1', '9 : 3 : 3 : 1', '1 : 1'], 'A Tt &times; Tt cross gives 1 TT : 2 Tt : 1 tt. TT and Tt look tall, so tall : dwarf = 3 : 1. The 1 : 2 : 1 ratio is the genotypic ratio.');
mc(1, 'monohybrid cross', 'The genotypic ratio in the F<sub>2</sub> generation of a monohybrid cross is', '1 : 2 : 1', ['3 : 1', '1 : 1', '9 : 3 : 3 : 1'], 'The genotypes in the F<sub>2</sub> are 1 homozygous dominant : 2 heterozygous : 1 homozygous recessive.');
mc(1, 'dihybrid cross', 'The F<sub>2</sub> phenotypic ratio in Mendel\'s dihybrid cross is', '9 : 3 : 3 : 1', ['3 : 1', '1 : 2 : 1', '1 : 1 : 1 : 1'], 'Two independent genes each give 3 : 1. Multiplying (3 : 1) &times; (3 : 1) gives 9 : 3 : 3 : 1.');
mc(1, 'test cross', 'A test cross is a cross between', 'an individual of unknown dominant genotype and a homozygous recessive', ['two homozygous dominant plants', 'two F<sub>2</sub> recessive plants', 'an F<sub>1</sub> plant and a homozygous dominant plant'], 'The homozygous recessive parent gives only recessive gametes, so the offspring show the gametes of the tested plant. This reveals whether it is homozygous or heterozygous.');
mc(1, 'incomplete dominance', 'Flower colour in the snapdragon (<i>Antirrhinum</i>) is an example of', 'incomplete dominance', ['complete dominance', 'codominance', 'pleiotropy'], 'Red &times; white gives pink F<sub>1</sub> plants. The heterozygote is intermediate, so neither allele is completely dominant.');
mc(1, 'multiple alleles', 'How many alleles of the I gene control the human ABO blood groups?', 'Three', ['Two', 'Four', 'Six'], 'The alleles are I<sup>A</sup>, I<sup>B</sup> and <i>i</i>. Any one person carries only two of them.');
mc(1, 'sex determination', 'The sex chromosomes of a normal human male are', 'XY', ['XX', 'XO', 'ZW'], 'Human males have 22 pairs of autosomes plus X and Y. Females have XX.');
mc(1, 'Mendelian disorders', 'Haemophilia is inherited as', 'an X-linked recessive trait', ['an autosomal dominant trait', 'a Y-linked trait', 'an autosomal recessive trait'], 'The gene lies on the X chromosome and the disease allele is recessive, so it shows far more often in males, who have one X.');
mc(1, 'chromosomal disorders', 'Down syndrome is caused by', 'trisomy of chromosome 21', ['monosomy of chromosome 21', 'loss of the Y chromosome', 'trisomy of the X chromosome'], 'A person with Down syndrome has an extra copy of chromosome 21, so 47 chromosomes in all.');
mc(1, 'chromosomal disorders', 'The karyotype of a person with Turner syndrome is', '44 autosomes + XO', ['44 autosomes + XXY', '45 autosomes + XY', '44 autosomes + XXX'], 'Turner syndrome is a monosomy: one sex chromosome (X) is missing, giving 45 chromosomes. The person is a sterile female.');
mc(1, 'Mendelian disorders', 'In sickle-cell anaemia, the amino acid glutamic acid at position 6 of the &beta;-globin chain is replaced by', 'valine', ['lysine', 'glycine', 'leucine'], 'The change of codon GAG to GUG puts valine in place of glutamic acid. This alters the shape of haemoglobin when oxygen is low.');
mc(1, 'chromosomal theory', 'The chromosomal theory of inheritance was proposed independently by', 'Sutton and Boveri', ['Mendel and Morgan', 'Watson and Crick', 'de Vries and Correns'], 'In 1902, Walter Sutton and Theodor Boveri noticed that the behaviour of chromosomes parallels that of Mendel\'s factors.');
mc(1, 'linkage', 'The organism used by T. H. Morgan for his work on linkage was', '<i>Drosophila melanogaster</i>', ['<i>Pisum sativum</i>', '<i>Neurospora crassa</i>', '<i>Escherichia coli</i>'], 'Fruit flies breed fast, produce many offspring, and show many visible variations, so Morgan used them.');
mc(1, 'sex determination', 'In birds, the sex chromosomes of the female are', 'ZW', ['ZZ', 'XX', 'XO'], 'Birds have a ZW-ZZ system: females are ZW (heterogametic) and males are ZZ.');
mc(1, 'Mendelian disorders', 'Phenylketonuria is inherited as', 'an autosomal recessive trait', ['an X-linked recessive trait', 'an autosomal dominant trait', 'a Y-linked trait'], 'The gene for phenylalanine hydroxylase is on an autosome and the disease shows only when both alleles are defective.');
mc(1, 'Mendelian disorders', 'Colour blindness is caused by a defect in', 'either the red or the green cone of the eye', ['the rod cells only', 'the blue cone only', 'the optic nerve'], 'It is an X-linked recessive disorder in which red or green cone pigment is faulty, so the person cannot tell red from green.');

// ---------------------------------------------------------------- Level 2
mc(2, 'Mendel', 'Mendel\'s work was rediscovered in 1900 by', 'de Vries, Correns and Tschermak', ['Sutton, Boveri and Morgan', 'Bateson, Punnett and Morgan', 'Watson, Crick and Wilkins'], 'Mendel published in 1866 but his work was not understood. Three scientists reached the same conclusions independently in 1900.');
mc(2, 'Mendel', 'Which one of these is NOT a reason why Mendel\'s pea experiments succeeded?', 'Pea flowers are always cross-pollinated by insects', ['The plants have many clear contrasting characters', 'Pea has a short life cycle and gives many seeds', 'Pea flowers are normally self-pollinated, so pure lines were available'], 'Pea flowers are bisexual and self-pollinating, which gave pure lines. Mendel then did artificial cross-pollination himself. Natural insect cross-pollination would have mixed the lines.');
mc(2, 'segregation', 'The law of segregation is also called the law of', 'purity of gametes', ['dominance', 'linkage', 'blending of factors'], 'The two alleles of a gene separate at gamete formation so that each gamete carries only one allele. A gamete is thus "pure" for the character.');
mc(2, 'monohybrid cross', 'A cross between a heterozygous tall pea plant (Tt) and a dwarf plant (tt) gives tall and dwarf in the ratio', '1 : 1', ['3 : 1', '1 : 2 : 1', 'All tall'], 'Tt gives T and t gametes; tt gives only t. Offspring are Tt (tall) and tt (dwarf) in equal numbers.');
mc(2, 'dihybrid cross', 'The number of different types of gametes formed by a plant with genotype AaBb is', 'four', ['two', 'three', 'sixteen'], 'Alleles assort independently: AB, Ab, aB and ab, each with probability 1/4.');
mc(2, 'dihybrid cross', 'How many different genotypes appear in the F<sub>2</sub> of a dihybrid cross between AABB and aabb?', 'nine', ['four', 'six', 'sixteen'], 'Each gene gives 3 genotypes (AA, Aa, aa), so 3 &times; 3 = 9 genotypes. These make 4 phenotypes in 16 combinations.');
mc(2, 'test cross', 'The test cross of a dihybrid RrYy with the recessive parent rryy gives the phenotypic ratio', '1 : 1 : 1 : 1', ['9 : 3 : 3 : 1', '3 : 1', '1 : 1'], 'RrYy makes four equally likely gametes and rryy makes only ry, so the four offspring types appear equally.');
mc(2, 'codominance', 'A person with blood group AB shows', 'codominance', ['incomplete dominance', 'complete dominance of I<sup>A</sup>', 'recessiveness'], 'Both I<sup>A</sup> and I<sup>B</sup> are expressed fully, so both sugar types A and B are present on the red blood cells.');
mc(2, 'multiple alleles', 'The allele <i>i</i> of the ABO system', 'does not produce any sugar', ['produces sugar A', 'produces sugar B', 'produces both sugars'], 'I<sup>A</sup> makes sugar A, I<sup>B</sup> makes sugar B, and <i>i</i> makes none. People of group O have the genotype <i>ii</i>.');
mc(2, 'multiple alleles', 'Parents of genotype I<sup>A</sup><i>i</i> and I<sup>B</sup><i>i</i> can have children of which blood groups?', 'A, B, AB and O', ['A and B only', 'AB and O only', 'A, B and AB only'], 'Gametes: I<sup>A</sup>, <i>i</i> and I<sup>B</sup>, <i>i</i>. Children: I<sup>A</sup>I<sup>B</sup> (AB), I<sup>A</sup><i>i</i> (A), I<sup>B</sup><i>i</i> (B), <i>ii</i> (O), each 25%.');
mc(2, 'pleiotropy', 'A single gene that has multiple phenotypic effects is called', 'pleiotropic', ['polygenic', 'epistatic', 'codominant'], 'Pleiotropy is one gene, many effects. Phenylketonuria is an example: one faulty gene causes mental retardation, reduced hair and skin pigment and other effects.');
mc(2, 'polygenic inheritance', 'Human skin colour is an example of', 'polygenic inheritance', ['pleiotropy', 'multiple alleles', 'sex-linked inheritance'], 'Several genes together control the trait, and each dominant allele adds to the effect. This gives a gradation of skin colours, not two classes.');
mc(2, 'chromosomal theory', 'Which fact supported the chromosomal theory of inheritance?', 'Chromosomes occur in pairs and the pairs separate in meiosis, like Mendel\'s factors', ['Chromosomes are made only of protein', 'Chromosomes number is the same in all species', 'Chromosomes are lost in gametes'], 'Homologous chromosomes pair and then segregate at meiosis, and different pairs assort independently, just as Mendel\'s alleles do.');
mc(2, 'linkage', 'Genes that lie on the same chromosome and tend to be inherited together are said to be', 'linked', ['codominant', 'epistatic', 'pleiotropic'], 'Morgan used the term linkage for the physical association of genes on a chromosome.');
mc(2, 'linkage', 'Recombinants in linked genes are produced because of', 'crossing over between non-sister chromatids', ['mutation of the alleles', 'separation of sister chromatids in anaphase II', 'independent assortment of non-homologous chromosomes'], 'Crossing over in prophase I of meiosis breaks homologous chromatids and rejoins them, mixing the linked alleles.');
mc(2, 'linkage', 'Alfred Sturtevant used the frequency of recombination between gene pairs on the same chromosome to', 'measure the distance between genes and map them', ['count the chromosomes', 'find the sex of the fly', 'locate the centromere only'], 'Genes that are far apart cross over more often, so recombination frequency works as a distance and lets genes be arranged in a genetic map.');
mc(2, 'sex determination', 'In grasshoppers the male has', 'XO sex chromosomes', ['XY sex chromosomes', 'ZW sex chromosomes', 'XX sex chromosomes'], 'Males have one X and no Y (XO), and females are XX. Males produce two types of sperm, with X and without X.');
mc(2, 'sex determination', 'In humans the sex of the child is decided by', 'the type of sperm that fertilises the egg', ['the type of egg', 'the mother\'s age', 'the number of autosomes'], 'All eggs carry X. A sperm carries X (girl) or Y (boy).');
mc(2, 'sex determination', 'In honeybees a drone is', 'haploid and develops from an unfertilised egg', ['diploid and develops from a fertilised egg', 'diploid and develops from an unfertilised egg', 'haploid and develops from a fertilised egg'], 'This is called haplodiploid sex determination: queens and workers (female) are diploid (32) and drones (male) are haploid (16).');
mc(2, 'Mendelian disorders', 'A female with haemophilia can be born only when', 'her mother is at least a carrier and her father is haemophilic', ['her mother is a carrier and her father is normal', 'both parents are normal', 'her father is a carrier'], 'She needs the disease allele on both X chromosomes: one from the father (who must be affected as he has only one X) and one from the mother.');
mc(2, 'Mendelian disorders', 'In sickle-cell anaemia the heterozygote (HbA/HbS) is', 'a carrier with mostly normal health', ['severely anaemic', 'always dead before birth', 'a female only'], 'The disease shows only in the homozygous HbS/HbS state. The heterozygote is a carrier and may show a trait only when oxygen is very low.');
mc(2, 'Mendelian disorders', 'Thalassemia differs from sickle-cell anaemia because it is', 'a quantitative defect where globin chains are made in too small amounts', ['a defect of the structure of globin', 'a sex-linked disease', 'a dominant disease'], 'Sickle-cell anaemia is a qualitative (structural) problem. Thalassemia is a quantitative problem: reduced synthesis of &alpha; or &beta; chains.');
mc(2, 'mutation', 'A sudden, heritable change in DNA sequence is called', 'a mutation', ['a recombination', 'a transcription', 'an independent assortment'], 'Mutations create new alleles. A change of one base pair is a point mutation, as in sickle-cell anaemia.');
mc(2, 'mutation', 'A deletion or insertion of one or two base pairs in a gene is called a', 'frameshift mutation', ['point substitution', 'silent mutation', 'polyploidy'], 'It shifts the reading frame of the codons after the change, so all later amino acids are altered.');
mc(2, 'pedigree', 'In a pedigree chart, a square joined to a circle by a horizontal line represents', 'a mating between a male and a female', ['two brothers', 'twins', 'a sister and her brother\'s son'], 'Squares are males, circles are females, a horizontal line between them is mating, and a vertical line leads to the offspring.');
mc(2, 'chromosomal disorders', 'Klinefelter syndrome has the chromosome constitution', '44 autosomes + XXY', ['44 autosomes + XO', '44 autosomes + XYY', '44 autosomes + XXX'], 'The extra X makes 47 chromosomes. The person is male with overall masculine development but also breast development (gynaecomastia), and is sterile.');
mc(2, 'chromosomal disorders', 'Which one is a feature of Down syndrome?', 'Short stature with a furrowed palm and mental retardation', ['Tall stature and rudimentary ovaries', 'Normal intelligence and webbed neck', 'Sterile male with breast development'], 'Down syndrome shows a small round head, furrowed tongue, partially open mouth, a palm crease and retarded physical and mental development.');
mc(2, 'chromosomal disorders', 'Gain or loss of one or a few chromosomes due to failure of separation of chromatids at cell division is called', 'aneuploidy', ['polyploidy', 'euploidy', 'translocation'], 'Aneuploidy arises from non-disjunction. Gain of a whole set (polyploidy) is a different thing.');
mc(2, 'chromosomal disorders', 'Polyploidy is common in', 'plants', ['mammals', 'birds', 'humans'], 'It results from failure of cytokinesis after telophase, which leaves cells with whole extra sets of chromosomes. It is common in plants and rare in animals.');
mc(2, 'Mendelian disorders', 'About what percentage of human males are colour blind, according to NCERT?', '8 per cent', ['0.4 per cent', '50 per cent', '25 per cent'], 'About 8% of males but only about 0.4% of females are colour blind, because females need two defective alleles.');

// ---------------------------------------------------------------- Level 3
mc(3, 'monohybrid cross', 'Among the tall plants in the F<sub>2</sub> of a Tt &times; Tt cross, the fraction that is homozygous is', '1/3', ['1/4', '1/2', '3/4'], 'F<sub>2</sub> is 1 TT : 2 Tt : 1 tt. Tall plants are TT and Tt, which are 3 parts, and only 1 of them is TT, so 1/3.', 'The 1/4 is the fraction of the whole F<sub>2</sub>, not of the tall plants.');
mc(3, 'dihybrid cross', 'In the F<sub>2</sub> of RrYy &times; RrYy, what fraction of the round-yellow seeds is homozygous for both genes?', '1/9', ['1/16', '1/4', '1/3'], 'Round-yellow is 9 of 16. Only RRYY (1 of 16) is homozygous for both. So 1/9 of the round-yellow seeds.', 'Do not divide by 16 when the question limits you to one phenotype.');
mc(3, 'test cross', 'A pea plant with round seeds is crossed with a wrinkled plant. Half the offspring are round and half wrinkled. The round parent was', 'heterozygous (Rr)', ['homozygous (RR)', 'a recessive plant', 'a plant showing codominance'], 'If the round parent were RR, all offspring would be Rr (round). A 1 : 1 ratio needs Rr &times; rr.');
mc(3, 'incomplete dominance', 'Pink snapdragons are crossed with each other. Out of 200 offspring the expected number of pink-flowered plants is', '100', ['50', '150', '200'], 'Pink (Rr) &times; pink (Rr) gives 1 red : 2 pink : 1 white. Pink is half of 200, which is 100.', 'Here the phenotypic ratio is 1 : 2 : 1, not 3 : 1.');
mc(3, 'codominance', 'Which statement distinguishes codominance from incomplete dominance?', 'In codominance both alleles are expressed fully in the heterozygote, while in incomplete dominance the heterozygote is intermediate', ['In codominance the heterozygote is intermediate, while in incomplete dominance both alleles show fully', 'Codominance shows a 3 : 1 ratio in F<sub>2</sub>', 'Incomplete dominance is shown by blood group AB'], 'AB blood group: both sugars A and B are present. Pink snapdragon: neither red nor white is complete, so an in-between colour results.');
mc(3, 'multiple alleles', 'Which of these couples can NOT have a child with blood group O?', 'AB &times; O', ['A (heterozygous) &times; B (heterozygous)', 'A (heterozygous) &times; A (heterozygous)', 'B (heterozygous) &times; O'], 'AB gives only I<sup>A</sup> or I<sup>B</sup>; O gives <i>i</i>. Children are I<sup>A</sup><i>i</i> or I<sup>B</sup><i>i</i>, never <i>ii</i>. The other couples can each give <i>i</i> from both sides.', 'AB is a group where neither parent has to be AB to have an AB child, but AB parents cannot have an O child.');
mc(3, 'multiple alleles', 'A mother has blood group O and her child has group O. Which man can be excluded as the father?', 'A man of group AB', ['A man of group A', 'A man of group B', 'A man of group O'], 'The child is <i>ii</i> and received <i>i</i> from the father. A man of group AB (I<sup>A</sup>I<sup>B</sup>) has no <i>i</i> allele, so he cannot be the father.', 'Blood groups can only exclude a father, they cannot prove who the father is.');
mc(3, 'multiple alleles', 'Which statement about multiple alleles is correct?', 'Many alleles exist in the population, but a diploid individual has only two', ['One person can have all three ABO alleles', 'Multiple alleles occupy different loci on different chromosomes', 'Multiple alleles are present only in the gametes'], 'Multiple alleles are three or more alternative forms of the same gene, found on one locus. A diploid cell holds only two.');
mc(3, 'polygenic inheritance', 'A cross between AABBCC (dark) and aabbcc (light) skin colour gives an F<sub>1</sub> of genotype AaBbCc. Its skin colour is expected to be', 'intermediate', ['as dark as AABBCC', 'as light as aabbcc', 'lighter than both parents'], 'F<sub>1</sub> has 3 dominant alleles out of 6, and each dominant allele adds to the effect, so it is midway between the two parents.');
mc(3, 'chromosomal theory', 'Sutton used which organism to show that chromosomes occur in pairs and segregate during meiosis?', 'Grasshopper', ['<i>Drosophila</i>', 'Pea', 'Maize'], 'Sutton worked on the grasshopper and united chromosome behaviour with Mendelian laws.');
mc(3, 'linkage', 'In Morgan\'s experiment on yellow-bodied white-eyed and brown-bodied red-eyed flies, only 1.3 per cent of the F<sub>2</sub> were recombinants. This shows that the two genes are', 'very tightly linked', ['on different chromosomes', 'loosely linked', 'codominant'], 'Low recombination means the genes are close together on one chromosome. Unlinked genes would give about 50% recombinants.');
mc(3, 'linkage', 'The genes for white eye and miniature wing in <i>Drosophila</i> showed 37.2% recombination, while yellow body and white eye showed 1.3%. This means', 'white and miniature are farther apart than yellow and white', ['yellow and white are farther apart', 'white and miniature are on different chromosomes', 'yellow and white are on different chromosomes'], 'The larger the recombination frequency, the greater the distance. 37.2% is much larger than 1.3%.');
mc(3, 'sex determination', 'The X body that Henking observed in half of the sperm of some insects was later called the', 'X chromosome', ['Y chromosome', 'nucleolus', 'centriole'], 'Henking (1891) saw a nuclear structure in 50% of sperm and called it the X body. Later work showed it is a chromosome that decides sex.');
mc(3, 'sex determination', 'In birds, the sex of the chick depends on', 'the type of egg (Z or W) of the female', ['the type of sperm', 'the temperature of incubation', 'the number of autosomes'], 'The female is ZW and makes two types of eggs; the male is ZZ and makes one type of sperm (Z). So the egg decides.', 'The mother decides the sex in birds, whereas the father decides it in humans.');
mc(3, 'sex determination', 'A drone honeybee has', 'a grandfather but no father', ['a father but no grandfather', 'both a father and grandfather', 'neither father nor grandfather'], 'A drone grows from an unfertilised egg of the queen, so it has no father. The queen\'s father was a drone, so it has a grandfather.');
mc(3, 'Mendelian disorders', 'A colour-blind boy is born to normal parents. The gene for colour blindness came from', 'his mother, who is a carrier', ['his father', 'both parents equally', 'his grandmother only through the Y chromosome'], 'A boy gets his only X from his mother and Y from the father. As the father is normal, the defective allele came from the mother, who must be a carrier (X<sup>c</sup>X).');
mc(3, 'Mendelian disorders', 'A haemophilic man marries a homozygous normal woman. Their children will be', 'normal sons and carrier daughters', ['haemophilic sons and carrier daughters', 'haemophilic sons and normal daughters', 'all haemophilic'], 'Father X<sup>h</sup>Y &times; mother XX. Sons get Y from father and X from mother (normal). Daughters get X<sup>h</sup> from father and X from mother (carriers).', 'Sons cannot inherit an X-linked trait from the father.');
mc(3, 'pedigree', 'Two unaffected parents have an affected child. This pattern is typical of', 'an autosomal or X-linked recessive trait', ['an autosomal dominant trait only', 'a Y-linked trait', 'a trait showing codominance'], 'Both parents carry a hidden recessive allele. A dominant trait would have shown in at least one parent.');
mc(3, 'Mendelian disorders', 'If both parents are carriers of sickle-cell anaemia, the probability that a child will have the disease is', '25 per cent', ['50 per cent', '75 per cent', '100 per cent'], 'HbA/HbS &times; HbA/HbS gives 1 HbA/HbA : 2 HbA/HbS : 1 HbS/HbS. One in four is affected.');
mc(3, 'Mendelian disorders', 'Phenylketonuria results from a lack of the enzyme that converts', 'phenylalanine into tyrosine', ['tyrosine into phenylalanine', 'glucose into glycogen', 'fibrinogen into fibrin'], 'Without phenylalanine hydroxylase, phenylalanine builds up and is converted into phenylpyruvic acid, which damages the brain and appears in urine.');
mc(3, 'Mendelian disorders', '&alpha;-Thalassemia and &beta;-thalassemia are controlled by genes on chromosomes', '16 and 11 respectively', ['11 and 16 respectively', '21 and 22 respectively', 'X and Y respectively'], 'Alpha thalassemia is controlled by two closely linked genes HBA1 and HBA2 on chromosome 16. Beta thalassemia is controlled by one gene, HBB, on chromosome 11.', 'The numbers are often swapped.');
mc(3, 'chromosomal disorders', 'Down syndrome most often arises when', 'two copies of chromosome 21 fail to separate in meiosis, forming a gamete with 24 chromosomes', ['a chromosome 21 is lost in a gamete', 'the Y chromosome is added to an egg', 'sister chromatids separate normally'], 'Non-disjunction gives a gamete with n+1 = 24 chromosomes. With a normal gamete (23) the zygote has 47, trisomy 21.');
mc(3, 'chromosomal disorders', 'If non-disjunction of one chromosome pair occurs in meiosis I of a primary oocyte, how many of the four resulting cells are normal?', 'None', ['One', 'Two', 'All four'], 'Both homologues go to one pole, so two gametes are n+1 and two are n&minus;1. None is normal.', 'If it occurs in meiosis II, two of four are normal.');
mc(3, 'chromosomal disorders', 'A woman with Turner syndrome has', '45 chromosomes and rudimentary ovaries', ['47 chromosomes and breast development', '45 chromosomes and testes', '46 chromosomes and normal ovaries'], 'XO: one X is missing. Such females are sterile, short, and lack secondary sexual characters.');
mc(3, 'chromosomal disorders', 'A male with Klinefelter syndrome is', 'sterile and may show breast development', ['fertile and tall with no other change', 'a female with rudimentary ovaries', 'always mentally normal and fertile'], 'XXY males have a masculine build but develop breasts (gynaecomastia) and are sterile.');
mc(3, 'mutation', 'Which of these is a physical mutagen?', 'UV radiation', ['Mustard gas', 'Nitrous acid', 'Colchicine'], 'UV and ionising radiation are physical mutagens. Mustard gas and nitrous acid are chemical mutagens.', 'Colchicine is mainly used to double chromosome numbers by blocking spindle formation.');
mc(3, 'mutation', 'Chromosomal aberrations are commonly observed in', 'cancer cells', ['RBCs', 'gametes of healthy people only', 'viruses'], 'In cancer cells deletions, duplications and rearrangements of chromosome parts are frequent.');
mc(3, 'independent assortment', 'The law of independent assortment holds good for genes that are', 'on different (non-homologous) chromosomes', ['tightly linked on the same chromosome', 'on the same locus', 'on sex chromosomes only'], 'Alleles of genes on different chromosomes enter gametes independently. Linked genes tend to stay together.');
mc(3, 'Mendel', 'Which statement about a dominant allele is correct?', 'It is expressed in the heterozygous condition', ['It is always more common in a population', 'It always gives a better phenotype', 'It is always present on the X chromosome'], 'Dominance only describes how an allele behaves with another allele. It says nothing about frequency or usefulness.', 'Many harmful traits are dominant and many common traits are recessive.');
mc(3, 'gametes', 'The number of different gametes from AaBbCc is', '8', ['6', '9', '27'], 'Each heterozygous gene doubles the types: 2 &times; 2 &times; 2 = 8. The number 27 is the number of F<sub>2</sub> genotypes.');
mc(3, 'mixed', 'In which stage of meiosis does crossing over, the basis of recombination of linked genes, occur?', 'Pachytene of prophase I', ['Metaphase I', 'Anaphase II', 'Zygotene'], 'Homologues pair at zygotene and form the synaptonemal complex. Crossing over takes place in pachytene, at recombination nodules.', 'Pairing is zygotene; the exchange is pachytene.');
mc(3, 'mixed', 'In sickle-cell anaemia the mutation changes mRNA codon GAG to', 'GUG', ['GAA', 'UAG', 'GGG'], 'A single base change (A to U in mRNA, A to T in the coding DNA strand) makes valine from glutamic acid. GAA still codes for glutamic acid, UAG is a stop codon.');
stm(3, 'test cross', 'A test cross is used to find the genotype of a plant showing the dominant phenotype.', 'A test cross of a homozygous dominant plant with a recessive plant gives a 1 : 1 ratio.', 2, 'Statement I is correct. For II, TT &times; tt gives all Tt, which look dominant, not a 1 : 1 ratio. A 1 : 1 ratio means the plant was heterozygous.');
stm(3, 'incomplete dominance', 'In incomplete dominance the genotypic and phenotypic ratios in F<sub>2</sub> are the same.', 'In codominance the heterozygote shows an intermediate phenotype.', 2, 'In incomplete dominance the 1 : 2 : 1 genotypes give 1 : 2 : 1 phenotypes. In codominance the heterozygote shows both parental traits, not an intermediate.');
stm(3, 'multiple alleles', 'The ABO blood group gene has six possible genotypes.', 'These six genotypes give four phenotypes (A, B, AB and O).', 0, 'Genotypes: I<sup>A</sup>I<sup>A</sup>, I<sup>A</sup><i>i</i>, I<sup>B</sup>I<sup>B</sup>, I<sup>B</sup><i>i</i>, I<sup>A</sup>I<sup>B</sup>, <i>ii</i> = 6. Phenotypes: A (2 genotypes), B (2), AB, O = 4.');
stm(3, 'Mendelian disorders', 'Haemophilia is an autosomal recessive disease.', 'A haemophilic female is rare, since she needs two defective X chromosomes.', 3, 'Haemophilia is X-linked recessive, so I is incorrect. II is correct: a female needs both X chromosomes to carry the allele.');
stm(3, 'chromosomal disorders', 'Klinefelter syndrome is a trisomy of the sex chromosomes (XXY).', 'Turner syndrome is a trisomy with 47 chromosomes.', 2, 'XXY is 47 chromosomes. Turner syndrome is a monosomy (XO, 45), so II is wrong.');
stm(3, 'sex determination', 'In birds the female is the heterogametic sex.', 'In honeybees, males are diploid and females are haploid.', 2, 'ZW females make two kinds of gametes. In honeybees it is the opposite of II: females are diploid, males (drones) are haploid.');
stm(3, 'Mendelian disorders', 'Colour blindness is controlled by a gene on the Y chromosome.', 'Colour blindness is more common in females.', 1, 'The gene is on the X chromosome, and the trait is more common in males because they have only one X. Both statements are wrong.');
asr(3, 'segregation', 'The recessive trait reappears in the F<sub>2</sub> generation of a monohybrid cross.', 'Alleles of a pair separate during gamete formation and are not blended.', 0, 'The F<sub>1</sub> (Tt) makes T and t gametes. Random union gives tt in 1/4 of the F<sub>2</sub>. Segregation explains this.');
asr(3, 'incomplete dominance', 'The F<sub>1</sub> of red &times; white snapdragon is pink.', 'Neither allele for flower colour is completely dominant over the other.', 0, 'This is incomplete dominance. The R allele gives some pigment but not enough to make the flower fully red.');
asr(3, 'codominance', 'A person with blood group AB is an example of codominance.', 'Allele <i>i</i> is dominant over both I<sup>A</sup> and I<sup>B</sup>.', 2, 'A is true: both I<sup>A</sup> and I<sup>B</sup> show. R is false: <i>i</i> is recessive to both.');
asr(3, 'sex-linked', 'X-linked recessive disorders are more frequent in males than in females.', 'Males have only one X chromosome, so a single recessive allele is expressed.', 0, 'A female must have the recessive allele on both Xs to be affected. A male needs it only on his one X.');
asr(3, 'sex determination', 'A drone honeybee produces sperm by meiosis.', 'A drone is haploid.', 3, 'A is false: a drone is already haploid, so it makes sperm by mitosis. R is true but it is the reason that meiosis cannot be used.', 'Meiosis would halve an already haploid number.');
asr(3, 'Mendelian disorders', 'Sickle-cell anaemia is called a qualitative defect of globin.', 'Only one amino acid in the &beta;-chain of haemoglobin is changed.', 0, 'The structure of the chain is altered (quality). Thalassemia is the quantitative one.');
asr(3, 'polygenic inheritance', 'Human height shows continuous variation.', 'Height is controlled by many genes, each adding a small effect.', 0, 'Many genes together give many small steps, so the distribution is continuous and bell-shaped.');
asr(3, 'linkage', 'Linked genes may still produce some recombinant offspring.', 'Crossing over can occur between two genes on the same chromosome.', 0, 'Linkage is not always complete. When a crossover falls between the two genes, new combinations are formed.');
asr(3, 'pleiotropy', 'Phenylketonuria is an example of pleiotropy.', 'A single gene mutation affects more than one trait.', 0, 'The defect in one enzyme gene leads to mental retardation, reduced pigmentation of hair and skin, and other effects.');
match(3, 'chromosomal disorders', 'ih-m1', 'Disorders and their features', ['A. Down syndrome', 'B. Klinefelter syndrome', 'C. Turner syndrome', 'D. Sickle-cell anaemia'], ['p. 45 chromosomes, XO', 'q. 47 chromosomes, XXY', 'r. Trisomy of chromosome 21', 's. Glutamic acid replaced by valine'], 'A-r, B-q, C-p, D-s', ['A-q, B-r, C-p, D-s', 'A-r, B-p, C-q, D-s', 'A-s, B-q, C-p, D-r'], 'Down is trisomy 21 (r). Klinefelter is XXY with 47 (q). Turner is XO with 45 (p). Sickle-cell is the Glu to Val change (s).');
match(3, 'Mendelian disorders', 'ih-m2', 'Disorders and their cause', ['A. Haemophilia', 'B. Phenylketonuria', 'C. &beta;-Thalassemia', 'D. Colour blindness'], ['p. Lack of phenylalanine hydroxylase', 'q. Defect in a blood-clotting protein, X-linked', 'r. Reduced &beta;-globin from the HBB gene', 's. Faulty red or green cone, X-linked'], 'A-q, B-p, C-r, D-s', ['A-s, B-p, C-r, D-q', 'A-q, B-r, C-p, D-s', 'A-p, B-q, C-r, D-s'], 'Haemophilia is a clotting-factor defect (q). PKU is the missing enzyme (p). &beta;-Thalassemia is reduced &beta;-chain from the HBB gene (r). Colour blindness is a cone pigment defect (s).');
match(3, 'sex determination', 'ih-m3', 'Sex determination types', ['A. XX-XO type', 'B. XX-XY type', 'C. ZZ-ZW type', 'D. Haplodiploidy'], ['p. Female is heterogametic', 'q. Male has one X and no Y', 'r. Male is haploid', 's. Male has X and Y'], 'A-q, B-s, C-p, D-r', ['A-s, B-q, C-p, D-r', 'A-q, B-p, C-s, D-r', 'A-r, B-s, C-p, D-q'], 'XX-XO: grasshopper males have XO (q). XX-XY: humans and <i>Drosophila</i> males have XY (s). ZW females are heterogametic in birds (p). In honeybees males are haploid (r).');
match(3, 'monohybrid cross', 'ih-m4', 'Crosses and ratios', ['A. Tt &times; Tt (complete dominance)', 'B. Rr &times; Rr (incomplete dominance)', 'C. TtYy &times; ttyy', 'D. TtYy &times; TtYy'], ['p. 1 : 2 : 1', 'q. 9 : 3 : 3 : 1', 'r. 1 : 1 : 1 : 1', 's. 3 : 1'], 'A-s, B-p, C-r, D-q', ['A-p, B-s, C-r, D-q', 'A-s, B-p, C-q, D-r', 'A-r, B-p, C-s, D-q'], 'Monohybrid phenotypes: 3 : 1 (s). Incomplete dominance: 1 : 2 : 1 (p). Dihybrid test cross: 1 : 1 : 1 : 1 (r). Dihybrid F<sub>2</sub>: 9 : 3 : 3 : 1 (q).');
pass('ih-p1', 'A family with a rare trait', 'A rare trait appears in a family. Two unaffected parents, I-1 (father) and I-2 (mother), have four children: two unaffected sons, one affected daughter and one unaffected daughter. The affected daughter marries an unaffected man who has no family history of the trait, and they have six unaffected children.');
pq('ih-p1', 3, 'pedigree', 'The most likely mode of inheritance of this trait is', 'autosomal recessive', ['autosomal dominant', 'X-linked recessive', 'Y-linked'], 'Unaffected parents have an affected child, so the allele is recessive. An affected daughter with an unaffected father cannot be X-linked recessive, because her father would need to be affected. So it is autosomal recessive.');
pq('ih-p1', 4, 'pedigree', 'The probability that the unaffected daughter of I-1 and I-2 is a carrier is', '2/3', ['1/2', '1/4', '1'], 'Parents are both Aa. Their unaffected children are AA or Aa in the ratio 1 : 2, so a carrier has probability 2/3.', 'The 1/2 forgets that the aa class is already excluded.');
pass('ih-p2', 'A test cross in a fruit fly', 'In a test cross, females heterozygous for two genes on the same chromosome (grey body and long wing, written GgLl, with G and L on one chromosome) were crossed with black-bodied, vestigial-winged males (ggll). Among 1000 offspring, 410 were grey long, 400 were black vestigial, 95 were grey vestigial and 95 were black long.');
pq('ih-p2', 3, 'recombination', 'The recombination frequency between the two genes is', '19 per cent', ['81 per cent', '9.5 per cent', '50 per cent'], 'Recombinants are grey vestigial and black long: 95 + 95 = 190 out of 1000, which is 19%.', '81% is the parental fraction.');
pq('ih-p2', 4, 'recombination', 'If the two genes had been on different chromosomes, the test cross would be expected to give the four classes in the ratio', '1 : 1 : 1 : 1', ['9 : 3 : 3 : 1', '1 : 1', '3 : 1'], 'Independent assortment gives four equal classes, 25% each, so the recombination frequency would be 50%.');
pass('ih-p3', 'A question of blood groups', 'A woman of blood group A has a child of blood group O. She says the father is a man of blood group B, who also has a blood group O father. Another man of group AB is named as a possible father.');
pq('ih-p3', 3, 'multiple alleles', 'The genotype of the child and the mother must respectively be', '<i>ii</i> and I<sup>A</sup><i>i</i>', ['I<sup>A</sup>I<sup>B</sup> and I<sup>A</sup>I<sup>A</sup>', '<i>ii</i> and I<sup>A</sup>I<sup>A</sup>', 'I<sup>A</sup><i>i</i> and <i>ii</i>'], 'The child (O) is <i>ii</i> and got one <i>i</i> from the mother. So she must be I<sup>A</sup><i>i</i>, not I<sup>A</sup>I<sup>A</sup>.');
pq('ih-p3', 4, 'multiple alleles', 'Which statement is correct?', 'The AB man cannot be the father; the B man can be the father only if he is I<sup>B</sup><i>i</i>', ['Both men can be the father', 'The B man must be I<sup>B</sup>I<sup>B</sup>', 'The AB man must be the father'], 'The child needs <i>i</i> from the father. AB (I<sup>A</sup>I<sup>B</sup>) has none, so is excluded. A group B man can carry <i>i</i> if he is I<sup>B</sup><i>i</i>; the fact that his father was O shows he got <i>i</i> from his father, so he is indeed I<sup>B</sup><i>i</i> and can be the father.', 'Blood grouping can only exclude, never prove, fatherhood.');

// ---------------------------------------------------------------- Level 2 (extra)
mc(2, 'Mendel', 'Which of these is NOT one of the seven characters Mendel studied in the pea plant?', 'Leaf margin (smooth or serrated)', ['Pod shape (inflated or constricted)', 'Flower position (axial or terminal)', 'Seed colour (yellow or green)'], 'The seven characters were stem height, flower colour, flower position, pod shape, pod colour, seed shape and seed colour.');
mc(2, 'chromosomal disorders', 'The disorder that is NOT caused by a change in the number of chromosomes is', 'sickle-cell anaemia', ['Down syndrome', 'Turner syndrome', 'Klinefelter syndrome'], 'Sickle-cell anaemia is a Mendelian (single-gene) disorder. The other three are chromosomal disorders caused by non-disjunction.');
mc(2, 'Mendelian disorders', 'Which of the following is a Mendelian disorder?', 'Phenylketonuria', ['Down syndrome', 'Klinefelter syndrome', 'Turner syndrome'], 'Mendelian disorders are caused by alteration or mutation in a single gene and follow Mendel\'s principles. PKU is one of them.');

// ---------------------------------------------------------------- Level 4
nat(4, 'dihybrid cross', 'In a cross of RrYy &times; RrYy (round R and yellow Y dominant) 3200 seeds are produced. The expected number of seeds that are wrinkled and yellow is', 600, 'Wrinkled yellow is rrY_ = 3/16 of the seeds. 3/16 &times; 3200 = 600.', '', 'Count only the plants that are rr and have at least one Y: that is 3 of the 16 boxes.');
nat(4, 'recombination', 'A test cross of a double heterozygote with a double recessive gave 1548 parental and 252 recombinant offspring. The map distance between the genes (in centimorgans) is', 14, 'Total = 1548 + 252 = 1800. Recombination frequency = 252/1800 = 0.14 = 14%. One per cent recombination is 1 map unit (1 cM), so 14 cM.', 'cM', 'Divide by the total, not by the parental number.');
mc(4, 'recombination', 'Gene A and gene B are 20 map units apart, B and C are 15 apart, and A and C are 5 apart. The gene in the middle is', 'C', ['A', 'B', 'The order cannot be found'], 'The two shortest distances add up to the longest: 5 + 15 = 20. So A and B are the end genes and C lies between them: A-C-B.');
mc(4, 'Mendelian disorders', 'A colour-blind woman marries a man with normal vision. What will be the colour vision of their children?', 'All sons colour blind and all daughters carriers', ['All sons normal and all daughters carriers', 'Half the sons colour blind and all daughters normal', 'All children colour blind'], 'Mother X<sup>c</sup>X<sup>c</sup> &times; father XY. Sons get X<sup>c</sup> from her and Y from him: colour blind. Daughters get X<sup>c</sup> and X: carriers with normal vision.');
mc(4, 'Mendelian disorders', 'A carrier woman and a normal man have children. The probability that a child (of either sex) is haemophilic is', '1/4', ['1/2', '1/8', '3/4'], 'X<sup>h</sup>X &times; XY gives XX, X<sup>h</sup>X, XY and X<sup>h</sup>Y in equal numbers. Only X<sup>h</sup>Y is affected: 1/4 of all children (1/2 of sons).', 'Do not mix "of all children" with "of sons".');
nat(4, 'Mendelian disorders', 'A normal woman whose father was colour blind marries a normal man. The percentage of their sons expected to be colour blind is', 50, 'The woman got X<sup>c</sup> from her father and is a carrier (X<sup>c</sup>X). Her sons receive X<sup>c</sup> or X with equal chance, so 50% of sons are colour blind.', '%', 'The man\'s normal vision does not matter for his sons, because he gives them Y.');
nat(4, 'Mendelian disorders', 'A colour-blind man marries a carrier woman. Out of 8 children, the expected number of colour-blind daughters is', 2, 'X<sup>c</sup>Y &times; X<sup>c</sup>X gives X<sup>c</sup>X<sup>c</sup>, X<sup>c</sup>X, X<sup>c</sup>Y and XY equally. Colour-blind daughters (X<sup>c</sup>X<sup>c</sup>) are 1/4 of children, so 2 of 8.', '', 'Half of the daughters, but only a quarter of all children.');
nat(4, 'independent assortment', 'A plant AaBbCc is selfed. The number of different phenotypic classes in the progeny, with complete dominance at every gene, is', 8, 'Each gene gives 2 phenotypes (dominant, recessive) and genes assort independently: 2 &times; 2 &times; 2 = 8 classes.', '', 'The number of genotypes is 27, not 8.');
nat(4, 'polygenic inheritance', 'Skin colour is controlled by three genes (A, B, C), each dominant allele adds equal pigment. From AaBbCc &times; AaBbCc, out of 640 offspring the expected number with exactly three dominant alleles is', 200, 'Each parent makes 8 equally likely gametes, so offspring have 6 alleles, each dominant or recessive with probability 1/2. P(exactly 3 of 6) = C(6,3)/64 = 20/64. So 640 &times; 20/64 = 200.', '', 'Count alleles, not genes.');
nat(4, 'multiple alleles', 'A gene has 5 alleles in a population. The number of possible diploid genotypes is', 15, 'With n alleles, genotypes = n(n+1)/2 = 5 &times; 6 / 2 = 15 (5 homozygous plus 10 heterozygous). For ABO, n = 3 gives 6.', '', 'Do not forget the homozygotes.');
nat(4, 'sex determination', 'A queen honeybee has 32 chromosomes in each body cell. After she mates, a fertilised egg develops into a worker. How many of the worker\'s chromosomes came from its father?', 16, 'The father is a haploid drone and his sperm carry 16 chromosomes (n). The queen gives 16 in the egg. The worker has 32 in all.', '', 'The father is haploid, so the father\'s share is n, not 2n.');
nat(4, 'Mendelian disorders', 'Among the disorders Down syndrome, Klinefelter syndrome, Turner syndrome, sickle-cell anaemia, phenylketonuria, thalassemia, haemophilia and colour blindness, the number that are Mendelian (single gene) disorders is', 5, 'Mendelian: sickle-cell anaemia, PKU, thalassemia, haemophilia and colour blindness = 5. Down, Klinefelter and Turner are chromosomal.', '', 'Thalassemia is both a Mendelian and a blood disorder.');
nat(4, 'multiple alleles', 'A man of blood group B whose father was group O marries a woman of group A whose mother was group O. The percentage chance that their first child has blood group O is', 25, 'Man: I<sup>B</sup><i>i</i> (he got <i>i</i> from his O father). Woman: I<sup>A</sup><i>i</i>. Each gives <i>i</i> with probability 1/2, so <i>ii</i> = 1/4 = 25%.', '%');
nat(4, 'multiple alleles', 'A man of group AB marries a woman of genotype I<sup>B</sup><i>i</i>. The percentage of their children expected to have blood group AB is', 25, 'Man gives I<sup>A</sup> or I<sup>B</sup>; woman gives I<sup>B</sup> or <i>i</i>. AB needs I<sup>A</sup> from him and I<sup>B</sup> from her: 1/2 &times; 1/2 = 25%.', '%', 'The children are A: 25%, AB: 25%, B: 50%.');
nat(4, 'recombination', 'In a test cross of AB/ab with ab/ab, the A and B genes are 10 cM apart. Out of 1000 offspring, how many are expected to be AB (a parental class)?', 450, 'Recombinants are 10% = 100, split equally between Ab and aB. Parentals are 900, split equally between AB and ab: 450 each.', '', 'Each class is half of its group, not the whole group.');
mc(4, 'pleiotropy', 'Which pair is correctly matched?', 'Pleiotropy: one gene affecting many traits; polygenic: many genes affecting one trait', ['Pleiotropy: many genes affecting one trait; polygenic: one gene affecting many traits', 'Pleiotropy: one gene with many alleles; polygenic: many alleles of one gene', 'Pleiotropy: two genes on one chromosome; polygenic: two genes on different chromosomes'], 'Pleiotropy (PKU) and polygenic inheritance (skin colour) are opposite in the "gene to trait" direction. Neither means the same as multiple alleles.');
mc(4, 'incomplete dominance', 'In pea, BB seeds have large starch grains, bb have small grains and Bb have intermediate grains, while seed shape shows Bb as round like BB. This shows that', 'dominance depends on the level at which the trait is studied', ['the B gene is on two chromosomes', 'seed shape shows incomplete dominance', 'the trait is polygenic'], 'At the seed shape level (round) the allele B is completely dominant. At the starch grain level the heterozygote is intermediate, so dominance is not an absolute property of an allele.');
mc(4, 'linkage', 'An F<sub>1</sub> dihybrid AaBb (A and B on one chromosome) is test crossed. The offspring appear in the ratio 42 : 8 : 8 : 42. The gene pair is', 'linked with 16 per cent recombination', ['unlinked, giving 1 : 1 : 1 : 1', 'completely linked', 'linked with 42 per cent recombination'], 'Total = 100. The 8 + 8 = 16 are recombinants, so RF = 16%. Unlinked genes would give equal classes (25 each) and complete linkage would give only two classes.');
mc(4, 'chromosomal disorders', 'An XYY male cannot come from an error in the mother\'s meiosis because', 'two Y chromosomes can only come from the father', ['Y chromosome is only in females', 'there is no sperm with two Y', 'the egg cannot give an X'], 'An egg has no Y at all. Two Y chromosomes must come from a sperm, so non-disjunction occurred in the father in meiosis II (the sister chromatids of Y fail to separate).');
mc(4, 'chromosomal disorders', 'Turner syndrome (45, XO) can arise when', 'a sperm or an egg without any sex chromosome fuses with a normal gamete', ['a sperm with XY fuses with an egg', 'two eggs fuse', 'an XX egg fuses with a Y sperm'], 'The XO zygote has only one X, so one gamete had no sex chromosome (n&minus;1, from non-disjunction) and the other carried one X.');
mc(4, 'Mendelian disorders', 'A heterozygous woman for the haemophilia allele is normal because', 'her other X chromosome carries the normal allele that makes the clotting protein', ['the Y chromosome compensates', 'haemophilia is a dominant trait', 'the allele is lost during development'], 'One normal allele is enough to make enough clotting factor. Such a female is a carrier.');
mc(4, 'dihybrid cross', 'In the F<sub>2</sub> of a cross AABB &times; aabb, the fraction of plants showing a combination of traits that was NOT present in either parent is', '3/8', ['1/8', '9/16', '1/4'], 'Parental phenotypes: dominant-dominant (9/16) and recessive-recessive (1/16). The new combinations are A_bb (3/16) and aaB_ (3/16) = 6/16 = 3/8.', 'The recessive-recessive class is a parental look even though it is a new genotype.');
mc(4, 'sex determination', 'Which statement about the ZW sex-determination system is correct?', 'A Z-linked recessive trait appears in hens that carry just one copy of the allele', ['Males are heterogametic', 'Z-linked traits are expressed more in cocks', 'Hens always get the Z chromosome from the father'], 'A hen has only one Z (ZW), so one recessive allele is enough to show the trait, just as in XY males. The hen gets her Z from her father but her W from her mother.');
mc(4, 'Mendelian disorders', 'A boy with haemophilia has normal parents. Which statement is correct?', 'His mother is a carrier and his maternal grandfather or grandmother carried the allele', ['His father is a carrier', 'His mother is haemophilic', 'The allele came from the Y chromosome'], 'He got X<sup>h</sup> from his mother. She is a carrier (X<sup>h</sup>X) and got it from one of her parents (a haemophilic father or a carrier mother).');
mc(4, 'Mendelian disorders', 'In which case will all daughters be affected by an X-linked recessive disease?', 'Affected father and affected mother', ['Affected father and normal homozygous mother', 'Normal father and carrier mother', 'Affected father and carrier mother'], 'All daughters get X<sup>d</sup> from the father only if he is affected, and also X<sup>d</sup> from the mother only if she is affected (X<sup>d</sup>X<sup>d</sup>).', 'With an affected father and carrier mother, half the daughters are affected.');
mc(4, 'segregation', 'A tall plant is selfed and gives 30 tall and 10 dwarf seedlings. The tall plant was', 'heterozygous', ['homozygous dominant', 'homozygous recessive', 'a polygenic plant'], 'A 3 : 1 ratio (30 : 10) in a selfing indicates a heterozygous parent, Tt &times; Tt.');
mc(4, 'mutation', 'A deletion of one base from the coding region of a gene is more damaging than a single base substitution because', 'it changes every codon after the deletion', ['it always creates a stop codon', 'it changes only one amino acid', 'it is not passed to the next generation'], 'A substitution changes at most one codon, but deletion moves the reading frame so all later codons are read differently.', 'A deletion of three bases would remove one amino acid and keep the frame.');
mc(4, 'mixed', 'Which of these processes explains why the same parents can produce children with different combinations of unlinked genes?', 'Random orientation of homologous pairs at metaphase I', ['DNA replication in S phase', 'Cytokinesis', 'Condensation of chromatin'], 'The way each bivalent lines up at metaphase I is random, so maternal and paternal chromosomes are shuffled into gametes. This is the physical basis of independent assortment.');
mc(4, 'mixed', 'Why can a 3 : 1 ratio in a monohybrid cross be seen only in a large sample?', 'Fertilisation is random, so small samples vary by chance', ['Alleles change in the offspring', 'Dominance weakens with numbers', 'Segregation is random only in large crosses'], 'Mendel used many plants. Each fertilisation is an independent chance event, so ratios approach 3 : 1 only as numbers grow.');

// ---------------------------------------------------------------- Level 5
nat(5, 'recombination', 'Two genes lie so far apart that a crossover forms between them in every meiocyte. The recombination frequency among the gametes is', 50, 'A single crossover involves only two of the four chromatids, so only half the gametes are recombinant. The maximum recombination frequency is therefore 50%, the same as for unlinked genes.', '%', 'Recombination frequency never exceeds 50 per cent.');
nat(5, 'Mendelian disorders', 'A normal woman whose brother has haemophilia (parents normal) marries a normal man. The percentage probability that their first child is a haemophilic son is', 12.5, 'Her mother must be a carrier, so the woman is a carrier with probability 1/2. If she is a carrier, 1/4 of all children are haemophilic sons. So 1/2 &times; 1/4 = 1/8 = 12.5%.', '%', 'Multiply the carrier probability by the chance for a carrier.', 0.01);
nat(5, 'Mendelian disorders', 'Two carriers of sickle-cell anaemia have three children. The percentage probability that exactly two are affected is', 14.06, 'Each child is affected with probability 1/4. P(exactly 2 of 3) = 3 &times; (1/4)<sup>2</sup> &times; (3/4) = 9/64 = 14.06%.', '%', 'Multiply by the 3 ways of choosing which two are affected.', 0.01);
nat(5, 'monohybrid cross', 'Two heterozygous parents (Aa &times; Aa) have four children. The percentage probability that all four show the dominant phenotype is', 31.64, 'Each child is dominant with probability 3/4. For four: (3/4)<sup>4</sup> = 81/256 = 0.3164 = 31.64%.', '%', 'Each child is independent; earlier children do not change the chance.', 0.01);
nat(5, 'Mendelian disorders', 'A colour-blind man marries a normal-vision woman whose father was colour blind. The percentage of their daughters expected to be colour blind is', 50, 'The woman is a carrier (X<sup>c</sup>X). The man gives X<sup>c</sup> to every daughter. A daughter is colour blind if she also gets X<sup>c</sup> from her mother: probability 1/2.', '%');
mc(5, 'sex determination', 'A Z-linked recessive trait is crossed: an affected cock with a normal hen. The progeny will be', 'all hens affected and all cocks carriers', ['all hens carriers and all cocks affected', 'half the hens affected and all cocks normal', 'all normal'], 'Cock Z<sup>a</sup>Z<sup>a</sup> &times; hen Z<sup>A</sup>W. Sons get Z<sup>a</sup> from father and Z<sup>A</sup> from mother (carriers). Daughters get Z<sup>a</sup> from father and W from mother (affected). This is the reverse of the pattern in humans.');
mc(5, 'chromosomal disorders', 'A woman of 22 has Down syndrome because of an extra chromosome 21 that came from her mother. In which division could the error have occurred?', 'Either meiosis I or meiosis II of oogenesis', ['Only meiosis II', 'Only mitosis of the zygote', 'Only meiosis I of the father'], 'If the extra 21 came from the mother, non-disjunction occurred in her meiosis I (homologues stuck) or meiosis II (sister chromatids stuck). The egg then had two chromosome 21 copies.');
mc(5, 'pedigree', 'A trait is passed from an affected father to all his daughters but to none of his sons, and is passed from affected mothers to half the children of both sexes. The trait is most likely', 'X-linked dominant', ['X-linked recessive', 'autosomal recessive', 'Y-linked'], 'Fathers give X to daughters and Y to sons. All daughters affected and no sons means the allele is on the X and is dominant. A Y-linked trait would pass to all sons only.');
mc(5, 'multiple alleles', 'A couple, both of blood group A, have a child with group O and another with group A. The genotypes of the parents are', 'both I<sup>A</sup><i>i</i>', ['both I<sup>A</sup>I<sup>A</sup>', 'one I<sup>A</sup>I<sup>A</sup> and one I<sup>A</sup><i>i</i>', 'I<sup>A</sup>I<sup>B</sup> and I<sup>A</sup><i>i</i>'], 'Group O child (<i>ii</i>) needs <i>i</i> from each parent. So both must be I<sup>A</sup><i>i</i>.');
mc(5, 'linkage', 'Genes P and Q are 5 map units apart on a chromosome and Q and R are 12 apart. The distance between P and R could be', '7 or 17 map units', ['Only 17 map units', 'Only 7 map units', '60 map units'], 'If Q lies between P and R: 5 + 12 = 17. If P lies between Q and R, then PR = 12 &minus; 5 = 7. Both are possible without the order.', 'Distances add only when the middle gene lies between the others.');
mc(5, 'chromosomal disorders', 'If the sister chromatids of the X chromosome fail to separate in meiosis II of one secondary oocyte, the two resulting cells are', 'one cell with XX and one cell with no X', ['two cells with XX', 'two cells with no X', 'two normal cells with X'], 'Meiosis II separates sister chromatids. If the chromatids of the X in the one secondary oocyte do not separate, one product has XX and the other none. The other secondary cell divides normally.', 'In meiosis I error all four products are abnormal. In meiosis II error half are normal.');
mc(5, 'mutation', 'A mutation changes one codon from GAG to GAA in a gene. Which result is most likely?', 'No change in the protein, since both codons code for glutamic acid', ['The protein ends early', 'Valine replaces glutamic acid', 'All later amino acids change'], 'The genetic code is degenerate: GAA and GAG both code for glutamic acid. This is a silent substitution.', 'Do not mix with GAG to GUG, which makes sickle-cell haemoglobin.');
mc(5, 'mixed', 'Which of the following is correct for the cross AaBb &times; aabb when A and B are completely linked in the F<sub>1</sub> (AB on one chromosome)?', 'Only two kinds of progeny, AaBb and aabb, appear', ['Four kinds appear equally', 'Four kinds appear in 9 : 3 : 3 : 1', 'Only AaBb appears'], 'Complete linkage means the chromosome is passed on as a unit, so the test cross gives parental types only, in a 1 : 1 ratio.');
mc(5, 'Mendel', 'A pea plant produces round yellow seeds. A test cross gives round yellow, round green, wrinkled yellow and wrinkled green in the ratio 1 : 1 : 1 : 1. The genotype of the plant is', 'RrYy', ['RRYY', 'RrYY', 'RRYy'], 'Four equal classes need four gamete types from the tested plant, so it is heterozygous for both genes. Any homozygous gene would cut the classes.');
mc(5, 'sex determination', 'Which statement is correct for sex determination in <i>Drosophila</i> and humans?', 'In both, the male is XY and the male parent decides the sex of the offspring', ['In both, the female is XY', 'In both, the female parent decides the sex', 'In both, males are XO'], 'Both have XX females and XY males; the sperm carries X or Y. In birds it is the female who decides.');

// ---------------------------------------------------------------- Number templates
// helpers: genotype strings like 'Aa'; enumerate offspring of two parents at one gene
const cross1 = (a, b) => { const r = []; for (const x of a) for (const y of b) r.push([x, y].sort().join('')); return r; };
const TRAITS = [
  ['tall', 'dwarf'], ['round-seeded', 'wrinkled-seeded'], ['yellow-seeded', 'green-seeded'], ['violet-flowered', 'white-flowered'], ['inflated-podded', 'constricted-podded'], ['axial-flowered', 'terminal-flowered'],
];
const gens = [
  {
    id: 'ih-g01', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'monohybrid cross',
    make(rng) {
      const N = choose(rng, [64, 80, 96, 120, 160, 200, 320, 400, 800, 1200]);
      const [dom, rec] = choose(rng, TRAITS);
      const cases = [
        ['Aa', 'Aa', 'dom', 3 / 4, 'Aa &times; Aa gives 1 AA : 2 Aa : 1 aa, so 3/4 show the dominant trait'],
        ['Aa', 'Aa', 'rec', 1 / 4, 'Aa &times; Aa gives 1 AA : 2 Aa : 1 aa, so 1/4 show the recessive trait'],
        ['Aa', 'Aa', 'het', 1 / 2, 'Aa &times; Aa gives 1 AA : 2 Aa : 1 aa, so 1/2 are heterozygous'],
        ['Aa', 'aa', 'dom', 1 / 2, 'Aa &times; aa gives 1 Aa : 1 aa, so 1/2 show the dominant trait'],
        ['Aa', 'aa', 'rec', 1 / 2, 'Aa &times; aa gives 1 Aa : 1 aa, so 1/2 show the recessive trait'],
        ['AA', 'Aa', 'dom', 1, 'AA &times; Aa gives 1 AA : 1 Aa, so all show the dominant trait'],
      ];
      const [p1, p2, t, f, why] = choose(rng, cases);
      const name = t === 'dom' ? `${dom} plants` : t === 'rec' ? `${rec} plants` : 'heterozygous plants';
      return { N, p1, p2, t, q: `A pea plant of genotype ${p1} (the dominant allele gives the ${dom} trait) is crossed with a plant of genotype ${p2}. Out of ${N} offspring, how many are expected to be ${name}?`, answer: N * f, tol: 0, sol: `Idea: write the Punnett square and count the fraction. ${why}. Expected number = ${N} &times; ${f === 1 ? '1' : f === 0.5 ? '1/2' : f === 0.75 ? '3/4' : '1/4'} = ${N * f}.` };
    },
    verify(p) {
      const kids = cross1(p.p1, p.p2);
      const hit = kids.filter((k) => (p.t === 'dom' ? k.includes('A') : p.t === 'rec' ? k === 'aa' : k === 'Aa')).length;
      return (p.N * hit) / kids.length;
    },
  },
  {
    id: 'ih-g02', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'dihybrid cross',
    make(rng) {
      const N = choose(rng, [16, 32, 48, 64, 96, 160, 320, 640, 1600]) * choose(rng, [1, 2]);
      const [a, b] = [choose(rng, TRAITS), choose(rng, TRAITS)];
      const cases = [['Aa', 'Aa'], ['Aa', 'aa']];
      const c1 = choose(rng, cases), c2 = choose(rng, cases);
      const w1 = choose(rng, ['dom', 'rec']), w2 = choose(rng, ['dom', 'rec']);
      const prob = (c, w) => (c[1] === 'Aa' ? (w === 'dom' ? 3 / 4 : 1 / 4) : 1 / 2);
      const P = prob(c1, w1) * prob(c2, w2);
      const bb = (x) => x.replace(/A/g, 'B').replace(/a/g, 'b');
      const fr = (x) => String(+(x * 64).toFixed(0)) + '/64';
      const desc = (t, w) => (w === 'dom' ? t[0] : t[1]);
      const geno = (c, x) => `${c[0]} &times; ${c[1]}`;
      const cnt = N * P;
      return { N, c1, c2, w1, w2, hit: cnt, q: `Two genes assort independently. Gene 1 (A, a): the cross is ${geno(c1)} (A gives the ${a[0]} trait). Gene 2 (B, b) is written the same way: the cross is ${bb(c2[0])} &times; ${bb(c2[1])} (B gives the ${b[0]} trait). Out of ${N} offspring, how many are expected to be ${desc(a, w1)} for gene 1 and ${desc(b, w2)} for gene 2?`, answer: cnt, tol: 0, sol: `Idea: treat each gene separately and multiply the probabilities. Gene 1: probability ${fmt(prob(c1, w1), 3)}. Gene 2: probability ${fmt(prob(c2, w2), 3)}. Together ${fmt(P, 4)}. Expected number = ${N} &times; ${fmt(P, 4)} = ${fmt(cnt, 5)}.` };
    },
    verify(p) {
      const one = (c, w) => { const k = cross1(c[0], c[1]); return k.filter((x) => (w === 'dom' ? x.includes('A') : x === 'aa')).length / k.length; };
      return p.N * one(p.c1, p.w1) * one(p.c2, p.w2);
    },
  },
  {
    id: 'ih-g03', type: 'nat', level: 4, format: 'integer', exams: ex(4), sub: 'trihybrid cross',
    make(rng) {
      const N = 64 * choose(rng, [1, 2, 5, 10, 15, 20]);
      const targets = [['dom', 'dominant phenotype', 3 / 4], ['rec', 'recessive phenotype', 1 / 4], ['het', 'heterozygous genotype', 1 / 2], ['hd', 'homozygous dominant genotype', 1 / 4]];
      const t = [choose(rng, targets), choose(rng, targets), choose(rng, targets)];
      const P = t[0][2] * t[1][2] * t[2][2];
      const cnt = N * P;
      const words = t.map((x, i) => `${x[1]} for gene ${'ABC'[i]}`).join(', ');
      return { N, t: t.map((x) => x[0]), q: `In a cross AaBbCc &times; AaBbCc with three independent genes, ${N} offspring are produced. How many are expected to show the ${words}?`, answer: cnt, tol: 0, sol: `Idea: for a monohybrid Aa &times; Aa, the fractions are dominant phenotype 3/4, recessive 1/4, heterozygous 1/2, homozygous dominant 1/4. Multiply the three genes: ${t.map((x) => fmt(x[2], 3)).join(' &times; ')} = ${fmt(P, 5)}. Expected number = ${N} &times; ${fmt(P, 5)} = ${cnt}.` };
    },
    verify(p) {
      const g1 = ['AA', 'Aa', 'Aa', 'aa'];
      const ok = (k, w) => (w === 'dom' ? k.includes('A') : w === 'rec' ? k === 'aa' : w === 'het' ? k === 'Aa' : k === 'AA');
      let c = 0;
      for (const x of g1) for (const y of g1) for (const z of g1) if (ok(x, p.t[0]) && ok(y, p.t[1]) && ok(z, p.t[2])) c++;
      return (p.N * c) / 64;
    },
  },
  {
    id: 'ih-g04', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'ABO blood groups',
    make(rng) {
      const GEN = ['IAIA', 'IAi', 'IBIB', 'IBi', 'IAIB', 'ii'];
      const grp = (g) => (g === 'ii' ? 'O' : g === 'IAIB' ? 'AB' : g.includes('IA') ? 'A' : 'B');
      const alleles = (g) => (g === 'ii' ? ['i', 'i'] : g === 'IAIB' ? ['IA', 'IB'] : g === 'IAi' ? ['IA', 'i'] : g === 'IBi' ? ['IB', 'i'] : g === 'IAIA' ? ['IA', 'IA'] : ['IB', 'IB']);
      let p1, p2, tgt, pct;
      for (let t = 0; t < 50; t++) {
        p1 = choose(rng, GEN); p2 = choose(rng, GEN); tgt = choose(rng, ['A', 'B', 'AB', 'O']);
        const kids = []; for (const x of alleles(p1)) for (const y of alleles(p2)) kids.push(grp([x, y].sort().join('').replace('iIA', 'IAi').replace('iIB', 'IBi').replace('IBIA', 'IAIB')));
        pct = (kids.filter((k) => k === tgt).length / 4) * 100;
        if (pct > 0 && pct < 100) break;
      }
      const show = (g) => g === 'ii' ? '<i>ii</i>' : g.replace('IA', 'I<sup>A</sup>').replace('IB', 'I<sup>B</sup>').replace(/i$/, '<i>i</i>');
      const nm = (g) => `${show(g)} (group ${grp(g)})`;
      return { p1, p2, tgt, q: `A man of genotype ${nm(p1)} and a woman of genotype ${nm(p2)} have a child. What is the percentage probability that the child has blood group ${tgt}?`, answer: pct, tol: 0, unit: '%', sol: `Idea: each parent gives one of his or her two alleles with probability 1/2. Man gives ${alleles(p1).join(' or ')}; woman gives ${alleles(p2).join(' or ')}. Four combinations, each 25%. Count those that give group ${tgt}: ${pct / 25} of 4, so ${pct}%.` };
    },
    verify(p) {
      const al = (g) => (g === 'ii' ? ['i'] : g === 'IAIB' ? ['IA', 'IB'] : g === 'IAi' ? ['IA', 'i'] : g === 'IBi' ? ['IB', 'i'] : g === 'IAIA' ? ['IA'] : ['IB']);
      const pa = (g, x) => al(g).filter((y) => y === x).length / al(g).length;
      const f = (x, y) => (x === 'i' && y === 'i' ? 'O' : (x === 'IA' && y === 'IB') || (x === 'IB' && y === 'IA') ? 'AB' : x === 'IA' || y === 'IA' ? 'A' : 'B');
      let t = 0;
      for (const x of ['IA', 'IB', 'i']) for (const y of ['IA', 'IB', 'i']) if (f(x, y) === p.tgt) t += pa(p.p1, x) * pa(p.p2, y);
      return Math.round(t * 100);
    },
  },
  {
    id: 'ih-g05', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'ABO blood groups',
    make(rng) {
      const pairs = [['IAi', 'IBi'], ['IAIB', 'IAIB'], ['IAIB', 'ii'], ['IAi', 'IAi'], ['IBi', 'IBi'], ['IAIB', 'IAi'], ['IAIB', 'IBi'], ['IAIA', 'IBIB'], ['IAi', 'ii'], ['IBi', 'ii'], ['IAIA', 'ii'], ['IAIA', 'IAIB']];
      const [a, b] = choose(rng, pairs);
      const al = (g) => (g === 'ii' ? ['i', 'i'] : g === 'IAIB' ? ['IA', 'IB'] : g === 'IAi' ? ['IA', 'i'] : g === 'IBi' ? ['IB', 'i'] : g === 'IAIA' ? ['IA', 'IA'] : ['IB', 'IB']);
      const f = (x, y) => (x === 'i' && y === 'i' ? 'O' : (x === 'IA' && y === 'IB') || (x === 'IB' && y === 'IA') ? 'AB' : x === 'IA' || y === 'IA' ? 'A' : 'B');
      const set = new Set(); for (const x of al(a)) for (const y of al(b)) set.add(f(x, y));
      const show = (g) => g === 'ii' ? '<i>ii</i>' : g.replace('IA', 'I<sup>A</sup>').replace('IB', 'I<sup>B</sup>').replace(/i$/, '<i>i</i>');
      return { a, b, q: `Parents have the genotypes ${show(a)} and ${show(b)}. How many different blood groups are possible among their children?`, answer: set.size, tol: 0, sol: `Idea: list the alleles each parent can give and combine them. Parent 1 gives ${[...new Set(al(a))].join(' or ')}; parent 2 gives ${[...new Set(al(b))].join(' or ')}. The combinations give the groups ${[...set].sort().join(', ')}, which is ${set.size} different groups.` };
    },
    verify(p) {
      const gm = (g) => new Set(g === 'ii' ? ['i'] : g === 'IAIB' ? ['IA', 'IB'] : g === 'IAi' ? ['IA', 'i'] : g === 'IBi' ? ['IB', 'i'] : g === 'IAIA' ? ['IA'] : ['IB']);
      const out = new Set();
      for (const x of gm(p.a)) for (const y of gm(p.b)) { const s = [x, y].sort().join('+'); out.add({ 'i+i': 'O', 'IA+IA': 'A', 'IA+i': 'A', 'IB+IB': 'B', 'IB+i': 'B', 'IA+IB': 'AB' }[s]); }
      return out.size;
    },
  },
  {
    id: 'ih-g06', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'sex-linked inheritance',
    make(rng) {
      const dis = choose(rng, ['haemophilia', 'red-green colour blindness']);
      let m, f, T, ans;
      for (let t = 0; t < 30; t++) {
        m = choose(rng, [['homozygous normal', 0], ['a carrier', 0.5], ['affected', 1]]);
        f = choose(rng, [['a normal man', 0], ['an affected man', 1]]);
        T = choose(rng, ['sons', 'daughters', 'carrier daughters']);
        ans = T === 'sons' ? m[1] : T === 'daughters' ? m[1] * f[1] : m[1] * (1 - f[1]) + (1 - m[1]) * f[1];
        if (ans > 0 && ans < 1) break;
      }
      const mw = m[0] === 'a carrier' ? 'a carrier' : `${m[0]}`;
      const target = T === 'sons' ? 'sons are expected to be affected' : T === 'daughters' ? 'daughters are expected to be affected' : 'daughters are expected to be carriers';
      return { m, f, T, q: `In ${dis}, an X-linked recessive disease, a woman who is ${mw} marries ${f[0]}. What percentage of their ${target}?`, answer: ans * 100, tol: 0, unit: '%', sol: `Idea: sons get the mother's X and the father's Y; daughters get the father's X and one of the mother's two Xs. The mother passes on the disease allele with probability ${m[1]}. The father passes the disease X to daughters with probability ${f[1]}. ${T === 'sons' ? `Affected sons: ${m[1]}.` : T === 'daughters' ? `Affected daughters need both: ${m[1]} &times; ${f[1]} = ${m[1] * f[1]}.` : `Carrier daughters have exactly one disease X: ${m[1]} &times; ${1 - f[1]} + ${1 - m[1]} &times; ${f[1]} = ${fmt(ans, 3)}.`} So the answer is ${ans * 100}%.` };
    },
    verify(p) {
      const mg = p.m[1] === 0 ? ['X', 'X'] : p.m[1] === 1 ? ['x', 'x'] : ['X', 'x'];
      const fx = p.f[1] === 1 ? 'x' : 'X';
      let hit = 0, tot = 0;
      for (const mx of mg) {
        if (p.T === 'sons') { tot++; if (mx === 'x') hit++; } else { tot++; const d = [fx, mx].filter((z) => z === 'x').length; if (p.T === 'daughters' ? d === 2 : d === 1) hit++; }
      }
      return (hit / tot) * 100;
    },
  },
  {
    id: 'ih-g07', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'sex-linked inheritance',
    make(rng) {
      const N = choose(rng, [8, 16, 24, 40, 64, 80, 120, 200]);
      const cases = [
        ['a carrier woman and a normal man', ['XX', 'xX'], 'X', 'haemophilic children', 'Only the X<sup>h</sup>Y son is affected: 1/4 of children'],
        ['a carrier woman and an affected man', ['xX', 'xx'], 'xY', 'affected children', 'X<sup>h</sup>X<sup>h</sup> and X<sup>h</sup>Y are affected: 1/2 of children'],
        ['a normal woman and an affected man', ['XX'], 'xY', 'affected children', 'Sons get Y and daughters get X<sup>h</sup> but are carriers, so none is affected'],
      ];
      const k = int(rng, 0, 2);
      const frac = [1 / 4, 1 / 2, 0][k];
      return { N, k, q: `Out of ${N} children of ${cases[k][0]} (X-linked recessive disease), how many are expected to be ${cases[k][3]}?`, answer: N * frac, tol: 0, sol: `Idea: list the four equally likely children. ${cases[k][4]}. Expected number = ${N} &times; ${frac === 0.25 ? '1/4' : frac === 0.5 ? '1/2' : '0'} = ${N * frac}.` };
    },
    verify(p) {
      const mums = [['X', 'x'], ['X', 'x'], ['X', 'X']][p.k]; const dads = [['X', 'Y'], ['x', 'Y'], ['x', 'Y']][p.k];
      let aff = 0, t = 0;
      for (const m of mums) for (const d of dads) { t++; const kid = [m, d]; if (kid.includes('Y')) { if (m === 'x') aff++; } else if (m === 'x' && d === 'x') aff++; }
      return (p.N * aff) / t;
    },
  },
  {
    id: 'ih-g08', type: 'nat', level: 3, format: 'numeric', exams: ex(3), sub: 'recombination',
    make(rng) {
      const tot = choose(rng, [500, 800, 1000, 1200, 1600, 2000, 2500]);
      const rf = choose(rng, [4, 5, 6.5, 8, 10, 12, 15, 17.5, 20, 24, 30, 35]);
      const rec = Math.round((tot * rf) / 100); const par = tot - rec;
      const a = Math.floor(par / 2), b = par - a, c = Math.floor(rec / 2), d = rec - c;
      const ans = +((rec / tot) * 100).toFixed(1);
      return { tot, rec, a, b, c, d, q: `A test cross of a double heterozygote gave ${a} AB, ${b} ab, ${c} Ab and ${d} aB offspring. What is the distance between genes A and B in map units (centimorgans)?`, answer: ans, tol: 0.1, unit: 'cM', sol: `Idea: recombinant classes are the new combinations, Ab and aB. Recombinants = ${c} + ${d} = ${rec}. Total = ${tot}. Recombination frequency = ${rec}/${tot} &times; 100 = ${ans}%. One per cent is one map unit, so the distance is ${ans} cM.` };
    },
    verify(p) { return +(100 - ((p.a + p.b) / p.tot) * 100).toFixed(1); },
  },
  {
    id: 'ih-g09', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'recombination',
    make(rng) {
      const N = choose(rng, [1000, 2000, 3000, 4000, 5000]);
      const rf = choose(rng, [4, 6, 8, 10, 12, 14, 16, 20, 24]);
      const kind = choose(rng, ['recombinant', 'parental']);
      const cls = kind === 'recombinant' ? ((N * rf) / 100) / 2 : (N * (100 - rf)) / 200;
      return { N, rf, kind, q: `Genes P and Q are linked and lie ${rf} map units apart. A double heterozygote PQ/pq is test crossed and ${N} offspring are counted. How many offspring of ONE ${kind} class (for example ${kind === 'recombinant' ? 'Pq' : 'PQ'}) are expected?`, answer: cls, tol: 0, sol: `Idea: ${rf} map units means ${rf}% recombinants, shared equally by two recombinant classes; the other ${100 - rf}% are parentals, shared by two parental classes. ${kind === 'recombinant' ? `Recombinants = ${N} &times; ${rf}% = ${(N * rf) / 100}; one class = ${cls}.` : `Parentals = ${N} &times; ${100 - rf}% = ${(N * (100 - rf)) / 100}; one class = ${cls}.`}` };
    },
    verify(p) { const r = p.N * (p.rf / 100); return p.kind === 'recombinant' ? r / 2 : (p.N - r) / 2; },
  },
  {
    id: 'ih-g10', type: 'nat', level: 4, format: 'integer', exams: ex(4), sub: 'gene mapping',
    make(rng) {
      const [g1, g2, g3] = choose(rng, [['y', 'w', 'm'], ['A', 'B', 'C'], ['p', 'q', 'r'], ['d', 'e', 'f']]);
      const x = int(rng, 3, 20), y = int(rng, 4, 25);
      const mode = int(rng, 0, 1);
      if (mode === 0) return { x, y, mode, q: `Genes ${g1}, ${g2} and ${g3} lie on one chromosome in that order. The distance ${g1}-${g2} is ${x} map units and ${g2}-${g3} is ${y} map units. What is the distance ${g1}-${g3}?`, answer: x + y, tol: 0, unit: 'map units', sol: `Idea: ${g2} is in the middle, so distances add. ${g1}-${g3} = ${x} + ${y} = ${x + y}.` };
      return { x, y: x + y, mode, q: `Genes ${g1}, ${g2} and ${g3} lie on one chromosome in that order. The distance ${g1}-${g3} is ${x + y} map units and ${g1}-${g2} is ${x} map units. What is the distance ${g2}-${g3}?`, answer: y, tol: 0, unit: 'map units', sol: `Idea: ${g2} is between ${g1} and ${g3}, so ${g1}-${g3} = ${g1}-${g2} + ${g2}-${g3}. Then ${g2}-${g3} = ${x + y} &minus; ${x} = ${y}.` };
    },
    verify(p) { return p.mode === 0 ? p.x + p.y : p.y - p.x; },
  },
  {
    id: 'ih-g11', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'incomplete dominance',
    make(rng) {
      const N = choose(rng, [8, 16, 40, 64, 100, 200, 400, 1000]) ;
      const cases = [
        ['two pink', 'Rr', 'Rr', 'red'], ['two pink', 'Rr', 'Rr', 'pink'], ['two pink', 'Rr', 'Rr', 'white'],
        ['a red and a pink', 'RR', 'Rr', 'red'], ['a red and a pink', 'RR', 'Rr', 'pink'], ['a white and a pink', 'rr', 'Rr', 'white'], ['a white and a pink', 'rr', 'Rr', 'pink'],
      ];
      const [who, a, b, tgt] = choose(rng, cases);
      const NN = Math.ceil(N / 4) * 4;
      const ph = (k) => (k === 'RR' ? 'red' : k === 'rr' ? 'white' : 'pink');
      const kids = cross1(a, b);
      const c = kids.filter((k) => ph(k) === tgt).length;
      return { N: NN, a, b, tgt, q: `In snapdragon, red (RR), pink (Rr) and white (rr) show incomplete dominance. A cross of ${who} plants gives ${NN} offspring. How many are expected to be ${tgt}?`, answer: (NN * c) / 4, tol: 0, sol: `Idea: the heterozygote is pink, so genotypes and phenotypes can be read directly. ${a} &times; ${b} gives ${kids.join(', ')} in equal parts. ${c} of the 4 are ${tgt}, so ${NN} &times; ${c}/4 = ${(NN * c) / 4}.` };
    },
    verify(p) { let c = 0; for (const x of p.a) for (const y of p.b) { const k = [x, y].sort().join(''); if ((k === 'RR' ? 'red' : k === 'rr' ? 'white' : 'pink') === p.tgt) c++; } return (p.N * c) / 4; },
  },
  {
    id: 'ih-g12', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'chromosomal disorders',
    make(rng) {
      const n = choose(rng, [7, 8, 10, 12, 14, 16, 19, 21, 23]);
      const types = [
        ['triploid (3n)', 3, 0, 'Three complete sets: 3n'],
        ['tetraploid (4n)', 4, 0, 'Four complete sets: 4n'],
        ['trisomic (2n + 1)', 2, 1, 'One chromosome extra: 2n + 1'],
        ['monosomic (2n &minus; 1)', 2, -1, 'One chromosome short: 2n &minus; 1'],
        ['nullisomic (2n &minus; 2)', 2, -2, 'One whole pair missing: 2n &minus; 2'],
        ['double trisomic (2n + 2)', 2, 2, 'Two different extra chromosomes: 2n + 2'],
      ];
      const [name, s, d, why] = choose(rng, types);
      return { n, s, d, q: `A diploid plant has 2n = ${2 * n} chromosomes. How many chromosomes does a ${name} plant of the same species have in each body cell?`, answer: s * n + d, tol: 0, sol: `Idea: n = ${n} is the haploid number and 2n = ${2 * n}. ${why}. So the number is ${s * n + d}.` };
    },
    verify(p) { return (p.s === 2 ? 2 * p.n : p.s * p.n) + p.d; },
  },
  {
    id: 'ih-g13', type: 'nat', level: 3, format: 'integer', exams: ex(3), sub: 'sex determination',
    make(rng) {
      const q2 = choose(rng, [16, 24, 32, 36, 48, 56]);
      const h = q2 / 2;
      const asks = [
        ['How many chromosomes are present in a body cell of a drone (male)?', h, `Drones are haploid, so n = ${h}`],
        ['How many chromosomes are present in a body cell of a worker?', q2, `Workers are female and diploid: 2n = ${q2}`],
        ['How many chromosomes are present in an egg of the queen?', h, `The egg is formed by meiosis, so it has n = ${h}`],
        ['How many chromosomes are present in a sperm of a drone?', h, `A drone is haploid and makes sperm by mitosis, so each sperm has n = ${h}`],
        ['A queen\'s egg is fertilised by a drone\'s sperm. How many chromosomes does the zygote have?', q2, `n + n = 2n = ${q2}`],
        ['How many chromosomes does a worker receive from its father?', h, `The father is a haploid drone and gives one set, n = ${h}`],
        ['An unfertilised egg of the queen develops into a new individual. How many chromosomes are in each of its body cells?', h, `It becomes a drone, which is haploid: n = ${h}`],
      ];
      const k = int(rng, 0, asks.length - 1);
      const [w, a, why] = asks[k];
      return { q2, k, q: `A queen honeybee has ${q2} chromosomes in each body cell. ${w}`, answer: a, tol: 0, sol: `Idea: queens and workers are diploid (2n = ${q2}); drones are haploid (n = ${h}). ${why}.` };
    },
    verify(p) { const n = p.q2 / 2; return [n, 2 * n, n, n, 2 * n, n, n][p.k]; },
  },
  {
    id: 'ih-g14', type: 'nat', level: 4, format: 'integer', exams: ex(4), sub: 'polygenic inheritance',
    make(rng) {
      const k = choose(rng, [2, 3]);
      const j = int(rng, 0, 2 * k);
      const unit = k === 2 ? 16 : 64;
      const N = unit * choose(rng, [1, 2, 5, 10, 25, 50]);
      const C = (a, b) => { let r = 1; for (let i = 1; i <= b; i++) r = (r * (a - b + i)) / i; return Math.round(r); };
      const cnt = (N * C(2 * k, j)) / (2 ** (2 * k));
      return { k, j, N, q: `Skin colour is controlled by ${k} genes with additive effect, and each dominant allele adds equal pigment. Two individuals heterozygous at all ${k} genes (${k === 2 ? 'AaBb' : 'AaBbCc'}) have ${N} offspring. How many are expected to carry exactly ${j} dominant allele${j === 1 ? '' : 's'}?`, answer: cnt, tol: 0, sol: `Idea: each of the ${2 * k} alleles in the offspring is dominant with probability 1/2, so the number of dominant alleles follows C(${2 * k}, j) / 2<sup>${2 * k}</sup>. For j = ${j}: C(${2 * k}, ${j}) = ${C(2 * k, j)} out of ${2 ** (2 * k)}. Expected number = ${N} &times; ${C(2 * k, j)}/${2 ** (2 * k)} = ${cnt}.` };
    },
    verify(p) {
      const g = ['AA', 'Aa', 'Aa', 'aa']; let c = 0; const total = 4 ** p.k;
      const rec = (i, dom) => { if (i === p.k) { if (dom === p.j) c++; return; } for (const x of g) rec(i + 1, dom + [...x].filter((z) => z === 'A').length); };
      rec(0, 0);
      return (p.N * c) / total;
    },
  },
  {
    id: 'ih-g15', type: 'nat', level: 4, format: 'integer', exams: ex(4), sub: 'recombination',
    make(rng) {
      const N = choose(rng, [1000, 2000, 2500, 4000, 5000]);
      const rf = choose(rng, [8, 10, 12, 16, 20, 24, 28, 32]);
      const cls = choose(rng, ['AB', 'ab', 'Ab', 'aB']);
      const parental = cls === 'AB' || cls === 'ab';
      const cnt = parental ? (N * (100 - rf)) / 200 : (N * rf) / 200;
      return { N, rf, cls, parental, q: `A plant with the A and B genes on the same chromosome in the arrangement AB/ab (coupling) is test crossed. The genes are ${rf} map units apart. Out of ${N} offspring, how many are expected to have the gametic type ${cls} from the heterozygous parent?`, answer: cnt, tol: 0, sol: `Idea: in coupling, AB and ab are parental and Ab and aB are recombinant. ${cls} is ${parental ? 'parental' : 'recombinant'}. ${parental ? `Parentals = ${100 - rf}% in all, so each class is ${(100 - rf) / 2}%.` : `Recombinants = ${rf}% in all, so each class is ${rf / 2}%.`} Number = ${N} &times; ${parental ? (100 - rf) / 2 : rf / 2}% = ${cnt}.` };
    },
    verify(p) { const fr = { AB: (1 - p.rf / 100) / 2, ab: (1 - p.rf / 100) / 2, Ab: p.rf / 200, aB: p.rf / 200 }; return Math.round(p.N * fr[p.cls]); },
  },
  {
    id: 'ih-g16', type: 'mcq', level: 2, format: 'single', exams: ex(2), sub: 'monohybrid cross',
    make(rng) {
      const [dom, rec] = choose(rng, TRAITS);
      const cases = [
        [`${dom} and ${rec} plants appear in the ratio 3 : 1`, 'Aa &times; Aa', 'A 3 : 1 ratio comes only from two heterozygous parents'],
        [`${dom} and ${rec} plants appear in the ratio 1 : 1`, 'Aa &times; aa', 'A 1 : 1 ratio needs a heterozygote crossed with a recessive homozygote'],
        [`all offspring are ${rec}`, 'aa &times; aa', 'Recessive plants breed true'],
        [`all offspring are ${dom} and one parent is a ${rec} plant`, 'AA &times; aa', 'All offspring show the dominant trait with a recessive parent only if the other parent is homozygous dominant'],
      ];
      const [what, correct, why] = choose(rng, cases);
      const all = ['Aa &times; Aa', 'Aa &times; aa', 'aa &times; aa', 'AA &times; aa', 'AA &times; Aa'];
      const o = shuffleOpts(rng, correct, all.filter((x) => x !== correct).slice(0, 3));
      return { q: `In a cross of two pea plants, ${what}. The genotypes of the parents are most likely`, options: o.options, answer: o.answer, sol: `Idea: match the ratio with the Punnett square. ${why}, so the parents are ${correct}. The other pairs give different ratios: Aa &times; Aa gives 3 : 1, Aa &times; aa gives 1 : 1, aa &times; aa gives all recessive, AA &times; aa gives all dominant, AA &times; Aa gives all dominant.` };
    },
    verify(p) { return p.answer; },
  },
  {
    id: 'ih-g17', type: 'nat', level: 4, format: 'numeric', exams: ex(4), sub: 'probability',
    make(rng) {
      const n = choose(rng, [3, 4, 5, 6]);
      const k = int(rng, 1, n);
      const p = choose(rng, [[1, 4, 'Both parents are carriers of a recessive disease, so each child is affected with probability 1/4.'], [1, 2, 'A carrier of a recessive disease marries an affected person, so each child is affected with probability 1/2.'], [3, 4, 'Both parents are heterozygous for a dominant trait, so each child shows it with probability 3/4.']]);
      const pr = p[0] / p[1];
      const C = (a, b) => { let r = 1; for (let i = 1; i <= b; i++) r = (r * (a - b + i)) / i; return Math.round(r); };
      const ans = C(n, k) * pr ** k * (1 - pr) ** (n - k) * 100;
      return { n, k, pr, q: `A couple has ${n} children. ${p[2]} What is the percentage probability that exactly ${k} of the ${n} children show the trait?`, answer: +ans.toFixed(2), tol: 0.01, unit: '%', sol: `Idea: each child is an independent trial with probability ${p[0]}/${p[1]}. The chance of exactly ${k} in ${n} is C(${n}, ${k}) &times; (${p[0]}/${p[1]})<sup>${k}</sup> &times; (${p[1] - p[0]}/${p[1]})<sup>${n - k}</sup> = ${C(n, k)} &times; ${fmt(pr ** k, 4)} &times; ${fmt((1 - pr) ** (n - k), 4)} = ${ans.toFixed(2)}%.` };
    },
    verify(p) {
      // dynamic programming over children
      let d = [1]; for (let i = 0; i < p.n; i++) { const nd = new Array(d.length + 1).fill(0); d.forEach((v, j) => { nd[j] += v * (1 - p.pr); nd[j + 1] += v * p.pr; }); d = nd; }
      return +(d[p.k] * 100).toFixed(2);
    },
  },
];

export default { topic: 'inheritance', groups, items, gens };
