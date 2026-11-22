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


// ---------------------------------------------------------------- Added in the expansion (ids continue the numbering)
// L2
mc(2, 'Mendel', 'Mendel carried out his hybridisation experiments on garden pea for about', 'seven years (1856-1863)', ['two years', 'twenty years', 'one year'], 'Mendel worked from 1856 to 1863 and published in 1865. His work was ignored until 1900.');
mc(2, 'Mendel', 'Mendel\'s work was rediscovered independently in 1900 by', 'de Vries, Correns and Tschermak', ['Sutton, Boveri and Morgan', 'Watson, Crick and Wilkins', 'Haldane, Fisher and Wright'], 'Hugo de Vries, Carl Correns and Erich von Tschermak each found the same laws when they repeated similar crosses.');
mc(2, 'Mendel', 'Which of the following was NOT one of Mendel\'s pea characters?', 'Leaf shape: lobed or entire', ['Pod shape: inflated or constricted', 'Flower position: axial or terminal', 'Seed colour: yellow or green'], 'The seven characters were stem height, flower colour, flower position, pod shape, pod colour, seed shape and seed colour. Leaf shape was not studied.');
mc(2, 'Mendel', 'Which of these is the correct pair of contrasting alleles for flower position in garden pea?', 'Axial and terminal', ['Violet and white', 'Tall and dwarf', 'Green and yellow'], 'Axial and terminal describe where the flowers are borne. Violet or white is the flower colour.');
mc(2, 'laws of inheritance', 'A pea plant has genotype Tt. Its phenotype and its allele combination are respectively', 'tall and heterozygous', ['dwarf and heterozygous', 'tall and homozygous', 'dwarf and homozygous'], 'T is dominant over t, so Tt is tall. Two different alleles make it heterozygous.');
mc(2, 'laws of inheritance', 'A monohybrid F<sub>2</sub> shows a phenotypic ratio of', '3 : 1', ['1 : 2 : 1', '9 : 3 : 3 : 1', '1 : 1'], 'Three plants show the dominant trait for each plant that shows the recessive trait. The genotypic ratio is 1 : 2 : 1.');
mc(2, 'sex determination', 'In humans the female is', 'homogametic with XX', ['heterogametic with XY', 'heterogametic with ZW', 'haploid'], 'All eggs carry one X, so the female is homogametic. The male makes two types of sperm, X-bearing and Y-bearing.');
mc(2, 'chromosomal disorders', 'The chromosomal complement of a person with Down syndrome is', '47 with an extra chromosome 21', ['45 with one X', '47 with XXY', '46 normal'], 'Down syndrome is trisomy 21. XXY is Klinefelter and XO is Turner.');
mc(2, 'Mendelian disorders', 'Haemophilia is an example of', 'an X-linked recessive disorder', ['an autosomal dominant disorder', 'a Y-linked disorder', 'a disorder due to trisomy'], 'The gene lies on the X chromosome and the allele is recessive. Males, with one X, are more often affected.');
mc(2, 'Mendelian disorders', 'Sickle-cell anaemia is controlled by', 'an autosomal recessive allele', ['an X-linked recessive allele', 'a Y-linked allele', 'an autosomal dominant allele'], 'The gene is on an autosome and the disease shows only when both alleles are mutant.', 'It is not X-linked, so both sexes are equally affected.');
asr(2, 'laws of inheritance', 'In a test cross the F<sub>1</sub> hybrid is crossed with the homozygous recessive parent.', 'The recessive parent produces only one type of gamete, so the offspring show the gametes of the F<sub>1</sub>.', 0, 'The recessive plant gives only the recessive allele, so the phenotypes of the progeny reveal the F<sub>1</sub> gametes.');
asr(2, 'sex determination', 'The sex of a human baby is decided by the father.', 'The father produces two types of sperm, with X and with Y.', 0, 'The egg always carries X. A sperm with X gives a girl, and a sperm with Y a boy.');
match(2, 'Mendelian disorders', 'xm1', 'Disorder and its basis', ['A. Haemophilia', 'B. Sickle-cell anaemia', 'C. Down syndrome', 'D. Turner syndrome'], ['p. Monosomy of the X chromosome', 'q. Trisomy of chromosome 21', 'r. X-linked recessive gene', 's. Autosomal recessive gene'], 'A-r, B-s, C-q, D-p', ['A-s, B-r, C-q, D-p', 'A-r, B-s, C-p, D-q', 'A-q, B-s, C-r, D-p'], 'Haemophilia is X-linked recessive, sickle-cell autosomal recessive, Down syndrome trisomy 21 and Turner syndrome XO.');

// L3
mc(3, 'laws of inheritance', 'A cross between a tall plant and a dwarf plant gives 50 per cent tall and 50 per cent dwarf offspring. The genotype of the tall parent is', 'Tt', ['TT', 'tt', 'Either TT or Tt'], 'A 1:1 ratio is a test cross result. A tall parent that gives dwarf offspring must carry t, so it is Tt.');
mc(3, 'laws of inheritance', 'The law of segregation is also called the law of purity of gametes because', 'each gamete carries only one allele of a pair, unmixed with the other', ['gametes are always identical', 'both alleles blend in the gamete', 'the F<sub>1</sub> shows only one trait'], 'The two alleles of a pair separate in meiosis and never blend; each gamete is pure for one allele.');
mc(3, 'laws of inheritance', 'Mendel\'s law of dominance explains', 'why the F<sub>1</sub> shows only one of the two contrasting traits', ['why the F<sub>2</sub> shows 9 : 3 : 3 : 1', 'why genes are linked', 'why the sex ratio is 1 : 1'], 'The dominant allele hides the effect of the recessive allele in the heterozygote.');
mc(3, 'laws of inheritance', 'A pea plant with round yellow seeds (RrYy) is selfed. The probability that a seed is wrinkled and green is', '1/16', ['3/16', '1/4', '9/16'], 'Wrinkled green is rryy: 1/4 × 1/4 = 1/16.');
mc(3, 'laws of inheritance', 'In a dihybrid cross the number of different genotypes in the F<sub>2</sub> is', '9', ['4', '16', '3'], 'Each gene gives three genotypes (AA, Aa, aa), so 3 × 3 = 9. There are 4 phenotypes and 16 combinations.', '16 is the number of boxes in the Punnett square.');
mc(3, 'dominance', 'In pea, the gene B controls an enzyme that makes starch. Seeds with BB make large starch grains and bb seeds small grains, while Bb seeds have intermediate grains. This is an example of', 'incomplete dominance seen at the level of starch grain size, though seeds are round for BB and Bb', ['complete dominance in all respects', 'codominance', 'linkage'], 'For seed shape the allele B is dominant (BB and Bb are round). For starch grain size the Bb is intermediate, so inheritance depends on the trait studied.', 'Dominance depends on the level at which the trait is studied.');
mc(3, 'dominance', 'Which of the following shows both alleles expressed fully in the heterozygote?', 'The blood group AB', ['Pink flowers of <i>Antirrhinum</i>', 'Tall pea plants of genotype Tt', 'Round seeds of genotype Rr'], 'Codominance: I<sup>A</sup> and I<sup>B</sup> both produce their sugar. Pink flowers are intermediate, not both fully expressed.');
mc(3, 'dominance', 'The F<sub>2</sub> genotypic ratio in incomplete dominance is', '1 : 2 : 1', ['3 : 1', '9 : 3 : 3 : 1', '1 : 1'], 'Genotypic and phenotypic ratios are the same (1 red : 2 pink : 1 white) in incomplete dominance.');
mc(3, 'blood groups', 'The allele I<sup>A</sup> produces', 'the sugar A on the surface of red blood cells', ['an enzyme that removes sugar', 'no sugar at all', 'the sugar B'], 'I<sup>A</sup> codes for an enzyme that adds sugar A. I<sup>B</sup> adds sugar B. The allele i makes no sugar.');
mc(3, 'blood groups', 'A man of group AB marries a woman of group O. Their children can have blood group', 'A or B only', ['AB or O', 'A, B, AB or O', 'O only'], 'I<sup>A</sup>I<sup>B</sup> × ii gives I<sup>A</sup>i (A) and I<sup>B</sup>i (B).');
mc(3, 'blood groups', 'How many genotypes are possible in the human ABO system?', 'Six', ['Three', 'Four', 'Nine'], 'I<sup>A</sup>I<sup>A</sup>, I<sup>A</sup>i, I<sup>B</sup>I<sup>B</sup>, I<sup>B</sup>i, I<sup>A</sup>I<sup>B</sup> and ii give six genotypes and four phenotypes.');
mc(3, 'pleiotropy', 'Which is NOT an example of a single gene affecting many traits?', 'Skin colour in humans', ['Phenylketonuria', 'Sickle-cell anaemia', 'Starch synthesis in pea affecting seed shape and grain size'], 'Skin colour is polygenic (many genes, one trait). The others show pleiotropy.', 'Pleiotropy is one gene, many traits. Polygenic is many genes, one trait.');
mc(3, 'polygenic inheritance', 'In polygenic inheritance, the phenotype reflects', 'the contribution of each allele, so the effect is additive', ['only the dominant allele', 'a single gene', 'a sex-linked gene'], 'In polygenic traits like human skin colour, each contributing allele adds to the phenotype.');
mc(3, 'chromosomal theory', 'The chromosomal theory of inheritance was proposed by', 'Sutton and Boveri', ['Morgan and Sturtevant', 'Mendel and de Vries', 'Henking and Correns'], 'Walter Sutton and Theodor Boveri (1902) noted that chromosome behaviour parallels that of Mendel\'s factors.');
mc(3, 'chromosomal theory', 'Morgan chose <i>Drosophila melanogaster</i> for his experiments because', 'it can be grown on simple synthetic media, has a short life cycle of about two weeks and a clear sexual dimorphism', ['it is the only organism with sex chromosomes', 'it has very large chromosomes in every cell', 'it is a haploid insect'], 'The fruit fly breeds quickly, produces many offspring per mating, shows many visible variations and males and females differ.');
mc(3, 'linkage', 'The term "linkage" was coined by', 'Morgan', ['Mendel', 'Sturtevant', 'Sutton'], 'Morgan used the term linkage for the physical association of genes on a chromosome, and recombination for the generation of non-parental gene combinations.');
mc(3, 'linkage', 'Two genes that are tightly linked show', 'a low frequency of recombination', ['a high frequency of recombination', '50 per cent recombination for any distance', 'no parental types'], 'The closer two genes lie on a chromosome, the less often they are separated by crossing over.');
mc(3, 'sex determination', 'In grasshoppers the sex of an individual depends on', 'XX in the female and XO in the male', ['ZW in the female and ZZ in the male', 'XY in the male', 'haploid male'], 'The male has one X chromosome only (XO), so he produces two types of sperm, with and without X.');
mc(3, 'sex determination', 'The female is heterogametic in', 'birds', ['humans', '<i>Drosophila</i>', 'grasshoppers'], 'In birds the female has ZW and the male ZZ. The sex of the offspring is decided by the ovum.', 'The sex-deciding gamete differs: sperm in humans, egg in birds.');
mc(3, 'mutation', 'A change in the DNA sequence due to a change in a single base pair is called', 'a point mutation', ['a frame-shift mutation', 'aneuploidy', 'polyploidy'], 'A point mutation changes one base, like the one in sickle-cell anaemia. A frame-shift is due to the deletion or insertion of bases.');
mc(3, 'Mendelian disorders', 'Phenylketonuria is caused by a lack of the enzyme', 'phenylalanine hydroxylase', ['tyrosinase', 'insulin', 'amylase'], 'The enzyme converts phenylalanine into tyrosine. Phenylalanine builds up and is changed to phenylpyruvic acid, which affects the brain.');
mc(3, 'Mendelian disorders', 'In sickle-cell anaemia the amino acid change in the haemoglobin β-chain is', 'glutamic acid replaced by valine at the sixth position', ['valine replaced by glutamic acid', 'glycine replaced by alanine at the sixth position', 'a deletion of the sixth amino acid'], 'GAG becomes GUG in the mRNA, so Glu is replaced by Val at position 6.');
mc(3, 'chromosomal disorders', 'A male with 47 chromosomes (XXY) is expected to be', 'sterile with some feminine features', ['fertile and normal', 'a normal female', 'a short female with no ovaries'], 'In Klinefelter syndrome the person is overall masculine but has breast development and is sterile.');
mc(3, 'chromosomal disorders', 'A Turner syndrome female has', '45 chromosomes with a single X', ['47 with XXX', '47 with XXY', '46 with XY'], 'Turner syndrome is XO. The ovaries are rudimentary and secondary sexual characters are lacking.');
mc(3, 'pedigree', 'In a pedigree a double horizontal line between a male and a female shows', 'a mating between relatives (consanguineous mating)', ['an affected pair', 'a twin birth', 'a pair of unaffected parents'], 'A single line joining a square and a circle shows an ordinary mating. A double line is consanguineous.');
mc(3, 'Mendelian disorders', 'A colour-blind man marries a normal woman who is not a carrier. Their daughters will be', 'normal but carriers', ['colour blind', 'normal and not carriers', 'affected half of the time'], 'The father gives X<sup>c</sup> to all daughters. The mother gives a normal X, so the daughters are carriers.');
asr(3, 'chromosomal theory', 'Genes on the same chromosome are inherited together.', 'Crossing over may separate some linked genes.', 1, 'Both are true, but R does not explain why linked genes are inherited together; it explains why some recombinants appear.', 'R is about exceptions to A.');
asr(3, 'Mendelian disorders', 'A haemophilic girl is rare.', 'She needs a haemophilic father and a carrier or haemophilic mother.', 0, 'Both alleles must be mutant. Such a father is rarely alive long enough or the cross is rare, so haemophilic daughters are very rare.');
asr(3, 'sex determination', 'In humans the male is heterogametic.', 'The male produces two types of sperm, X-bearing and Y-bearing.', 0, 'Heterogametic means producing two kinds of gametes, so R explains A.');
asr(3, 'mutation', 'A single base deletion is usually more damaging than a base substitution.', 'A deletion shifts the reading frame of all later codons.', 0, 'A frame shift changes all the following amino acids, while a substitution changes one codon at most.');
stm(3, 'blood groups', 'The ABO gene has three alleles.', 'A person has all three alleles at once.', 2, 'A diploid person has only two alleles of any gene. Three alleles exist in the population.');
stm(3, 'chromosomal theory', 'Sutton and Boveri proposed the chromosomal theory of inheritance.', 'Morgan carried out the experiments that proved linkage in <i>Drosophila</i>.', 0, 'Both are correct. Morgan\'s work gave experimental support.');
stm(3, 'Mendelian disorders', 'Colour blindness is due to a defect in either red or green cone cells.', 'About 8 per cent of males and 0.4 per cent of females are colour blind.', 0, 'The red-green defect is X-linked, so it is far more common in males.');
stm(3, 'chromosomal disorders', 'Aneuploidy is the gain or loss of one or a few chromosomes.', 'Polyploidy is common in animals.', 2, 'Polyploidy is common in plants. Statement II is false.');
match(3, 'chromosomal theory', 'xm2', 'Scientist and contribution', ['A. Sutton and Boveri', 'B. Morgan', 'C. Sturtevant', 'D. Henking'], ['p. Observed the X body in half the sperm of some insects', 'q. Chromosomal theory of inheritance', 'r. Genetic maps based on recombination frequency', 's. Experiments on linkage in <i>Drosophila</i>'], 'A-q, B-s, C-r, D-p', ['A-s, B-q, C-r, D-p', 'A-q, B-s, C-p, D-r', 'A-r, B-s, C-q, D-p'], 'Sutton and Boveri proposed the theory, Morgan did the linkage work, Sturtevant mapped genes and Henking saw the X body.');
match(3, 'Mendelian disorders', 'xm3', 'Disorder and the defect', ['A. Phenylketonuria', 'B. Sickle-cell anaemia', 'C. Thalassemia', 'D. Colour blindness'], ['p. Reduced synthesis of a globin chain', 'q. Lack of phenylalanine hydroxylase', 'r. Defect in red or green cone cells', 's. Valine in place of glutamic acid in the β-chain'], 'A-q, B-s, C-p, D-r', ['A-s, B-q, C-p, D-r', 'A-q, B-s, C-r, D-p', 'A-p, B-s, C-q, D-r'], 'PKU lacks an enzyme, sickle-cell has the Glu-Val change, thalassemia has fewer globin chains and colour blindness is a cone defect.');
pass('xp1', 'Passage: two genes in pea', 'A pea plant with round, yellow seeds (RrYy) is crossed with a plant with wrinkled, green seeds (rryy). The progeny of 800 seeds are scored. Round yellow 210, round green 190, wrinkled yellow 195 and wrinkled green 205.');
pq('xp1', 3, 'laws of inheritance', 'The cross done here is a', 'test cross of a dihybrid', ['monohybrid cross', 'back cross of a pure line', 'dihybrid cross with F<sub>2</sub> ratio 9 : 3 : 3 : 1'], 'The recessive parent rryy crossed with the heterozygote RrYy is a test cross.');
pq('xp1', 4, 'laws of inheritance', 'The result is closest to the ratio', '1 : 1 : 1 : 1', ['9 : 3 : 3 : 1', '3 : 1', '1 : 2 : 1'], 'The four classes are about equal (800/4 = 200 each), which shows independent assortment.');
pq('xp1', 4, 'linkage', 'The result shows that the two genes are', 'on different chromosomes or far apart', ['tightly linked', 'on the X chromosome', 'in the same allele'], 'If they were tightly linked, the parental classes would be much more frequent than the recombinant ones.');
nat(3, 'laws of inheritance', 'A plant AaBbCcDd is selfed. How many different genotypes appear among the progeny?', 81, 'Each gene gives three genotypes (AA, Aa, aa): 3<sup>4</sup> = 81.', null, 'Do not use 2<sup>4</sup>, which is the number of gamete types.');
nat(3, 'laws of inheritance', 'From a dihybrid cross (RrYy × RrYy), 1280 seeds are obtained. How many are expected to be round and yellow?', 720, '9/16 × 1280 = 720.', null, 'Round yellow is the 9 class.');
nat(3, 'blood groups', 'IAi × IBi gives 40 children. How many are expected to have blood group O?', 10, 'Probability of ii = 1/2 × 1/2 = 1/4. 1/4 × 40 = 10.', null);

// L4
mc(4, 'laws of inheritance', 'In the F<sub>2</sub> of a dihybrid cross (AaBb × AaBb), what fraction of the progeny is heterozygous for both genes?', '1/4', ['1/16', '1/2', '9/16'], 'Aa is 1/2 and Bb is 1/2, so AaBb = 1/2 × 1/2 = 1/4.', 'Do not use 9/16, which is the dominant phenotype class.');
mc(4, 'laws of inheritance', 'A plant of genotype AaBbCc is selfed. The probability of an offspring being aabbcc is', '1/64', ['1/16', '1/32', '1/8'], '(1/4)<sup>3</sup> = 1/64.');
mc(4, 'laws of inheritance', 'What proportion of the F<sub>2</sub> of AaBb × AaBb is homozygous for both genes?', '1/4', ['1/16', '9/16', '3/4'], 'AA, aa each 1/4, so 1/2 homozygous for A, and the same for B. So 1/2 × 1/2 = 1/4.');
mc(4, 'laws of inheritance', 'A pea plant produces round seeds. A test cross yields 52 round and 48 wrinkled seeds. The genotype of the plant is', 'Rr', ['RR', 'rr', 'RR or rr'], 'About 1:1 means the plant produced two kinds of gametes, so it is heterozygous.');
mc(4, 'laws of inheritance', 'Which of the following crosses can give a 1 : 1 : 1 : 1 ratio for two independently assorting genes?', 'AaBb × aabb', ['AaBb × AaBb', 'AABb × aabb', 'AaBB × aabb'], 'A double heterozygote crossed with the double recessive gives four equal classes.');
mc(4, 'dominance', 'A red snapdragon is crossed with a white one and the F<sub>1</sub> plants are selfed. Which statement is correct for F<sub>2</sub>?', 'The phenotypic and genotypic ratios are both 1 : 2 : 1', ['The phenotypic ratio is 3 : 1', 'All are pink', 'The ratio is 9 : 3 : 3 : 1'], 'Incomplete dominance makes each genotype visible, so the two ratios are alike.');
mc(4, 'dominance', 'Which statement about dominance is correct?', 'A dominant allele in a heterozygote codes for a normal enzyme and masks the effect of the recessive allele', ['A recessive allele is always harmful', 'A dominant allele is always more common', 'Dominance is the same as a higher mutation rate'], 'Dominance depends on the action of the allele product and not on the frequency or harm of the allele.', 'Dominant does not mean common.');
mc(4, 'blood groups', 'A man of blood group A and a woman of group B have a child of group O. The chance that their next child is of group AB is', '1/4', ['1/2', '1/16', 'zero'], 'The parents must be I<sup>A</sup>i and I<sup>B</sup>i. I<sup>A</sup>I<sup>B</sup> = 1/2 × 1/2 = 1/4.');
mc(4, 'blood groups', 'A couple has children of blood groups A, B, AB and O. The genotypes of the parents are', 'I<sup>A</sup>i and I<sup>B</sup>i', ['I<sup>A</sup>I<sup>A</sup> and I<sup>B</sup>I<sup>B</sup>', 'I<sup>A</sup>I<sup>B</sup> and ii', 'I<sup>A</sup>i and ii'], 'To have a child with O both parents carry i. To get AB the parents carry I<sup>A</sup> and I<sup>B</sup>, so I<sup>A</sup>i × I<sup>B</sup>i.');
mc(4, 'blood groups', 'Why are group O red cells accepted by people of other groups in transfusion, as far as the surface sugars are concerned?', 'Their red cells carry neither sugar A nor sugar B', ['Their serum has no antibodies at all', 'Their red cells carry both sugars', 'They have the allele I<sup>A</sup>'], 'The allele i makes no sugar, so group O red cells have no A or B antigen to trigger a reaction. Group O serum does carry anti-A and anti-B antibodies.', 'The antigen is on the cell; the antibodies are in the serum.');
mc(4, 'polygenic inheritance', 'A cross AABBCC × aabbcc (three additive genes) gives F<sub>1</sub> AaBbCc. The F<sub>1</sub> phenotype is', 'intermediate between the two parents', ['same as AABBCC', 'same as aabbcc', 'lighter than both parents'], 'Each dominant allele adds equally; F<sub>1</sub> has three of six contributing alleles, hence an intermediate shade.');
mc(4, 'polygenic inheritance', 'In the F<sub>2</sub> of the three-gene additive cross, the phenotype with the largest proportion is the one with', 'three contributing alleles', ['six contributing alleles', 'zero contributing alleles', 'one contributing allele'], 'The distribution is bell-shaped, centred on three alleles with a probability of 20/64.');
mc(4, 'chromosomal theory', 'Which of the following supports the idea that Mendel\'s factors are on chromosomes?', 'Chromosomes occur in pairs and segregate at meiosis just as the alleles do', ['Chromosomes are made of protein', 'Genes mutate', 'Gametes have 2n chromosomes'], 'The behaviour of paired chromosomes in meiosis parallels Mendel\'s segregation of paired factors.');
mc(4, 'linkage', 'A test cross of a double heterozygote with a double recessive gives parental and recombinant classes. Which is TRUE if the genes are linked?', 'Parental classes are more frequent than recombinant classes', ['All four classes are equal', 'Recombinants are more frequent', 'Only parental classes appear'], 'Linked genes travel together unless crossing over separates them.');
mc(4, 'linkage', 'Genes that are far apart on a chromosome show', 'a higher recombination frequency, but never more than 50 per cent', ['a lower recombination frequency', 'exactly 100 per cent recombination', 'no crossing over'], 'The frequency rises with distance but, for a test cross, the maximum observed is 50 per cent (the same as independent assortment).');
mc(4, 'sex determination', 'In honeybees, which of the following is correct?', 'The queen is diploid with 32 chromosomes and the drone is haploid with 16', ['The queen and drone are both diploid', 'The drone is diploid with 32 chromosomes', 'The queen is haploid'], 'Fertilised eggs give diploid females (queen, workers). Unfertilised eggs develop into haploid males (drones) by parthenogenesis.', 'The drone is haploid; the queen and workers are diploid.');
mc(4, 'sex determination', 'The sperm of a human male are of', 'two kinds, with X or with Y, in equal numbers', ['one kind with X', 'one kind with Y', 'two kinds, with ZZ or ZW'], 'Half of the sperm carry X and half Y, so the sex ratio at conception is expected to be 1 : 1.');
mc(4, 'Mendelian disorders', 'A normal couple has a colour-blind son. The mother', 'is a carrier of the gene for colour blindness', ['is colour blind', 'has no such allele', 'must be homozygous normal'], 'The son received X<sup>c</sup> from his mother, since the father\'s X goes to the daughters. A normal mother with X<sup>c</sup> is a carrier.');
mc(4, 'Mendelian disorders', 'A carrier woman marries a colour-blind man. The probability that a daughter is colour blind is', '1/2', ['1/4', '0', '1'], 'The mother gives X or X<sup>c</sup> equally, the father gives X<sup>c</sup> to all daughters. Half the daughters are X<sup>c</sup>X<sup>c</sup>.');
mc(4, 'Mendelian disorders', 'Two phenotypically normal people marry; each had a parent with sickle-cell anaemia. The probability that their child has the disease is', '1/4', ['1/2', '1/16', '1'], 'Each has to be a carrier (Hb<sup>A</sup>Hb<sup>S</sup>), because the affected parent gave an Hb<sup>S</sup>. Carrier × carrier gives 1/4 affected.');
mc(4, 'Mendelian disorders', 'In phenylketonuria, the phenylpyruvic acid is excreted in urine because', 'it is poorly absorbed by the kidney', ['it is made in the kidney', 'it is secreted by the liver', 'the kidney is damaged'], 'Phenylalanine builds up and is converted into phenylpyruvic acid and other derivatives, which the kidney reabsorbs poorly.');
mc(4, 'Mendelian disorders', 'Which of these differs thalassemia from sickle-cell anaemia?', 'Thalassemia is a quantitative defect of globin synthesis; sickle-cell is a qualitative defect', ['Thalassemia is X-linked; sickle-cell is autosomal', 'Thalassemia is due to trisomy', 'Thalassemia is a dominant disease'], 'In thalassemia, less globin is made; in sickle-cell the globin structure changes.');
mc(4, 'chromosomal disorders', 'Failure of cytokinesis after the telophase stage of cell division results in', 'polyploidy', ['aneuploidy', 'a frame-shift mutation', 'a point mutation'], 'A cell with replicated chromosomes that fails to divide ends up with an extra set (polyploidy).');
mc(4, 'chromosomal disorders', 'Down syndrome is more frequent in children of older mothers because', 'non-disjunction at meiosis I of the oocyte becomes more likely with age', ['the father\'s age matters most', 'the mother\'s mitochondria are lost', 'alleles of chromosome 21 mutate'], 'The usual cause is a failure of separation of chromosome 21 in the oocyte.', 'Do not mistake it for a point mutation.');
mc(4, 'mutation', 'Which of these can arise from a single base-pair substitution?', 'Sickle-cell anaemia', ['Down syndrome', 'Turner syndrome', 'Klinefelter syndrome'], 'Sickle-cell anaemia comes from GAG to GUG in the β-globin gene. The other three are due to a change in chromosome number.');
mc(4, 'pedigree', 'In a pedigree of a rare trait, an affected daughter is born to normal parents. The trait is', 'autosomal recessive', ['autosomal dominant', 'X-linked dominant', 'Y-linked'], 'Normal parents with an affected daughter can only be explained by an autosomal recessive allele (a Y-linked trait cannot affect a girl, and an X-linked recessive trait needs an affected father).', 'An affected girl with a normal father rules out X-linked recessive.');
asr(4, 'linkage', 'The recombination frequency between two genes is used as a measure of the distance between them.', 'The farther apart two genes are on a chromosome, the more chances for crossing over between them.', 0, 'This was Sturtevant\'s idea. R explains A.');
asr(4, 'laws of inheritance', 'Mendel\'s law of independent assortment holds for genes on different chromosomes.', 'During meiosis the bivalents orient independently at the metaphase plate.', 0, 'The orientation is random, so different gene pairs separate independently.');
asr(4, 'sex determination', 'A drone honeybee has no father.', 'The drone develops from an unfertilised egg.', 0, 'A drone is formed by parthenogenesis from an egg that was not fertilised.');
asr(4, 'Mendelian disorders', 'An X-linked recessive disease can pass from an affected father to a son.', 'A son gets the Y chromosome from the father.', 3, 'A son receives the father\'s Y, not X, so an X-linked recessive trait cannot pass from father to son. A is false and R is true.');
stm(4, 'laws of inheritance', 'Mendel\'s results needed a large number of plants.', 'The 3 : 1 ratio comes from chance fertilisation, so it holds only for a large sample.', 0, 'Gametes combine at random, so small samples can deviate.');
stm(4, 'blood groups', 'Blood group inheritance shows both dominance and codominance.', 'I<sup>A</sup> and I<sup>B</sup> are dominant over i and codominant with each other.', 0, 'The alleles I<sup>A</sup> and I<sup>B</sup> are dominant over i. They show codominance when together.');
stm(4, 'Mendelian disorders', 'Sickle-cell anaemia heterozygotes (HbA/HbS) show no sickling at all in any condition.', 'Sickle-cell anaemia is an autosomal recessive disease.', 3, 'Carriers are usually healthy, but their red cells can sickle under low oxygen, so Statement I is wrong. Statement II is correct.');
stm(4, 'chromosomal disorders', 'Klinefelter syndrome is caused by an extra X chromosome in males.', 'Turner syndrome is caused by the absence of one X chromosome in females.', 0, 'XXY is Klinefelter, XO is Turner.');
stm(4, 'linkage', 'Tightly linked genes show less recombination.', 'Recombination between genes on different chromosomes can reach 50 per cent in a test cross.', 0, 'Independent assortment gives 50 per cent recombinants.');
mc(4, 'Mendelian disorders', 'How many of the following are autosomal recessive disorders: sickle-cell anaemia, phenylketonuria, thalassemia, haemophilia, colour blindness?', 'Three', ['Two', 'Four', 'Five'], 'Sickle-cell, PKU and thalassemia are autosomal recessive. Haemophilia and colour blindness are X-linked.', 'Do not include the X-linked ones.', 'statements');
mc(4, 'chromosomal disorders', 'How many of the following are caused by a change in chromosome number: Down syndrome, Klinefelter syndrome, Turner syndrome, phenylketonuria, thalassemia?', 'Three', ['Two', 'Four', 'Five'], 'The first three are numerical changes. PKU and thalassemia are single-gene defects.', null, 'statements');
match(4, 'blood groups', 'xm4', 'Cross and the children\'s blood groups', ['A. I<sup>A</sup>I<sup>A</sup> × I<sup>B</sup>I<sup>B</sup>', 'B. I<sup>A</sup>i × I<sup>B</sup>i', 'C. I<sup>A</sup>I<sup>B</sup> × ii', 'D. ii × ii'], ['p. Only AB', 'q. A, B, AB and O', 'r. A and B only', 's. O only'], 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'], 'Work out each cross: I<sup>A</sup>I<sup>A</sup> × I<sup>B</sup>I<sup>B</sup> gives I<sup>A</sup>I<sup>B</sup>. The heterozygous cross gives all four. AB × O gives A and B. O × O gives O.');
match(4, 'laws of inheritance', 'xm5', 'Cross and the expected ratio', ['A. Monohybrid test cross', 'B. Dihybrid F<sub>2</sub>', 'C. Incomplete dominance F<sub>2</sub>', 'D. Dihybrid test cross'], ['p. 1 : 1', 'q. 9 : 3 : 3 : 1', 'r. 1 : 2 : 1', 's. 1 : 1 : 1 : 1', 't. 3 : 1'], 'A-p, B-q, C-r, D-s', ['A-t, B-q, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-t, C-r, D-s'], 'Tt × tt gives 1 : 1. The dihybrid F<sub>2</sub> gives 9 : 3 : 3 : 1. Incomplete dominance F<sub>2</sub> gives 1 : 2 : 1. A dihybrid test cross gives 1 : 1 : 1 : 1.');
match(4, 'chromosomal disorders', 'xm6', 'Syndrome and a typical feature', ['A. Klinefelter', 'B. Turner', 'C. Down', 'D. Phenylketonuria'], ['p. Rudimentary ovaries', 'q. Gynaecomastia in a male', 'r. Characteristic palm crease', 's. Phenylpyruvic acid in urine'], 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-r, B-p, C-q, D-s'], 'Klinefelter males show breast development, Turner females have rudimentary ovaries, Down syndrome has a palm crease and PKU gives phenylpyruvic acid.');
pass('xp2', 'Passage: a family and a blood disorder', 'In a family, the parents I-1 and I-2 are both healthy but have a daughter, II-2, with a disorder in which red cells have reduced amounts of a globin chain. Their son II-1 is healthy. II-1 marries a healthy woman III-1 whose father had the same disorder.');
pq('xp2', 3, 'pedigree', 'The mode of inheritance in this family is', 'autosomal recessive', ['X-linked recessive', 'autosomal dominant', 'Y-linked'], 'Healthy parents with an affected daughter show an autosomal recessive trait.');
pq('xp2', 4, 'Mendelian disorders', 'The probability that II-1 is a carrier, given that he is healthy, is', '2/3', ['1/2', '1/4', '1'], 'Parents are carriers (Aa × Aa). A healthy child is AA (1/3) or Aa (2/3).', 'Remove the affected class aa before counting.');
pq('xp2', 5, 'Mendelian disorders', 'III-1 is a carrier for sure, because', 'her father was affected and so gave her one mutant allele', ['her mother is affected', 'she is healthy', 'she is female'], 'An affected father (aa) can only pass a. She is healthy, so she is Aa.');
pass('xp3', 'Passage: a sex-linked trait in a fly', 'In a fruit fly, white eye is an X-linked recessive trait. A white-eyed female is crossed with a red-eyed male. In the F<sub>1</sub> the females are all red-eyed and the males all white-eyed. F<sub>1</sub> flies are then crossed among themselves.');
pq('xp3', 4, 'sex-linked inheritance', 'Why are all F<sub>1</sub> males white-eyed?', 'They get their only X from the white-eyed mother', ['They get an X from the father', 'White eye is dominant', 'White eye is on the Y chromosome'], 'A male receives the Y from the father and X from the mother. The mother is X<sup>w</sup>X<sup>w</sup>.');
pq('xp3', 4, 'sex-linked inheritance', 'The F<sub>2</sub> females are expected to be', '1/2 red-eyed and 1/2 white-eyed', ['all red-eyed', 'all white-eyed', '3/4 red-eyed'], 'F<sub>1</sub> cross: X<sup>W</sup>X<sup>w</sup> × X<sup>w</sup>Y gives daughters X<sup>W</sup>X<sup>w</sup> (red) and X<sup>w</sup>X<sup>w</sup> (white) in 1 : 1.');
pq('xp3', 5, 'sex-linked inheritance', 'The F<sub>2</sub> males will be', '1/2 red-eyed and 1/2 white-eyed', ['all red-eyed', 'all white-eyed', '3/4 white-eyed'], 'The F<sub>1</sub> mother X<sup>W</sup>X<sup>w</sup> gives X<sup>W</sup> or X<sup>w</sup> equally, and the sons get Y from the father.');
nat(4, 'linkage', 'In a test cross, 2500 offspring are produced and the recombination frequency is 12 per cent. How many recombinant offspring are expected?', 300, '12/100 × 2500 = 300.', null, 'Give the number, not the per cent.');
nat(4, 'Mendelian disorders', 'In a town 2500 men are examined. About 8 per cent of males are colour blind. How many are expected to be colour blind?', 200, '8/100 × 2500 = 200.', null);
nat(4, 'blood groups', 'How many different genotypes are possible in a population for a gene that has 6 alleles (diploid organism)?', 21, 'Number = n(n + 1)/2 = 6 × 7/2 = 21.', null, 'Count the heterozygotes and the homozygotes together.');
nat(4, 'polygenic inheritance', 'In an AaBbCc × AaBbCc cross with equal, additive effect of each dominant allele, what percentage of the progeny has exactly three dominant alleles?', 31.25, 'Number of ways = 6C3 = 20, out of 4<sup>3</sup> = 64 combinations: 20/64 = 0.3125, that is 31.25 per cent.', '%', null, 0.05);

// L5
mc(5, 'Mendel', 'Which of the following is NOT a reason why Mendel\'s work remained unnoticed for about 35 years?', 'His crosses used animals, which were unfamiliar to botanists', ['Communication was poor at the time', 'His concept of factors as discrete units did not fit the idea of blending', 'His mathematical approach was new to biology'], 'Mendel used garden peas, not animals. The other reasons are those usually listed.', 'A not-true option has to be spotted among true ones.');
mc(5, 'chromosomal theory', 'Which statement about the chromosomal theory of inheritance is correct?', 'Chromosomes and genes both occur in pairs, and the two alleles of a gene pair are located on homologous sites on homologous chromosomes', ['Genes are located only on sex chromosomes', 'Chromosomes are haploid in somatic cells', 'Genes are on the cell membrane'], 'This is Sutton\'s comparison: the pairing and segregation of chromosomes match that of Mendelian factors.');
mc(5, 'linkage', 'In Morgan\'s dihybrid cross of yellow-bodied, white-eyed females with brown-bodied, red-eyed males, the F<sub>2</sub> showed few recombinants because', 'the two genes are very tightly linked on the X chromosome', ['they were on different chromosomes', 'both genes were recessive', 'the males were haploid'], 'Genes that are tightly linked rarely separate. The recombinant classes were about 1.3 per cent.', 'The 9 : 3 : 3 : 1 ratio was not found.');
mc(5, 'linkage', 'Genes P, Q and R are linked. Recombination frequencies are P-Q 8 per cent, Q-R 5 per cent and P-R 13 per cent. The order of genes is', 'P - Q - R', ['Q - P - R', 'P - R - Q', 'R - P - Q'], 'The largest distance (P-R = 13) equals the sum of the two others (8 + 5), so Q lies between P and R.');
mc(5, 'linkage', 'In a cross of AB/ab × ab/ab, 1000 progeny are produced and 80 are Ab or aB. The distance between A and B is', '8 map units', ['80 map units', '4 map units', '16 map units'], 'Recombinant fraction 80/1000 = 8 per cent, so 8 map units.', 'Count both recombinant classes.');
mc(5, 'sex determination', 'A Z-linked recessive trait in birds. A normal male (carrier) is mated to an affected female. What is expected in the progeny?', 'Half of the sons and half of the daughters are affected', ['Only daughters are affected', 'All sons are carriers', 'No chick is affected'], 'The male Z<sup>A</sup>Z<sup>a</sup> × female Z<sup>a</sup>W gives Z<sup>A</sup>Z<sup>a</sup>, Z<sup>a</sup>Z<sup>a</sup>, Z<sup>A</sup>W and Z<sup>a</sup>W in equal numbers. Half of each sex are affected.');
mc(5, 'sex determination', 'Which pair is correct for males?', 'Fruit fly: XY; grasshopper: XO', ['Fruit fly: XO; grasshopper: XY', 'Bird: ZW; fruit fly: XY', 'Honeybee drone: diploid; grasshopper: XO'], 'The fruit fly male is XY and the grasshopper male XO. The bird male is ZZ. The honeybee drone is haploid.', 'Birds reverse the pattern: the male is the homogametic sex.');
mc(5, 'Mendelian disorders', 'Which of the following correctly shows the pedigree behaviour of an X-linked recessive disorder?', 'Affected males cannot pass it to their sons but their daughters become carriers', ['Affected males pass it to all their sons', 'Affected males have only affected daughters', 'It skips males'], 'The father gives his Y to sons and his X to daughters.');
mc(5, 'Mendelian disorders', 'A woman who is a carrier of haemophilia and a normal man have four children. Which is the correct expectation per child?', 'The chance of a haemophilic child is 1/4', ['The chance of a haemophilic child is 1/2', 'All sons are affected', 'All daughters are carriers'], 'X<sup>H</sup>X<sup>h</sup> × X<sup>H</sup>Y: sons: half affected, daughters: none affected. So the per-child chance is 1/2 × 1/2 = 1/4.');
mc(5, 'chromosomal disorders', 'An egg with 24 chromosomes (n + 1) is fertilised by a normal sperm. The zygote has', '47 chromosomes', ['46 chromosomes', '48 chromosomes', '45 chromosomes'], 'n + 1 = 24, sperm 23, so 47. This is trisomy.');
mc(5, 'chromosomal disorders', 'A person with 47 chromosomes XXY can be produced by', 'non-disjunction in either parent\'s meiosis', ['non-disjunction only in the mother', 'a point mutation', 'only in the father'], 'XX egg plus Y sperm (error in the mother) or X egg plus XY sperm (error in the father) both give XXY.', 'Both parents can be the source, so choose the option that allows either.');
mc(5, 'mutation', 'A change from GAG to GAA in a codon of the sixth position of the β-globin gene leads to', 'no change in the amino acid because both codons code for glutamic acid', ['sickle-cell anaemia', 'a stop codon', 'a frame shift'], 'GAA also codes for Glu (the code is degenerate), so it is a silent mutation.', 'Sickle-cell comes from GAG to GUG.');
asr(5, 'chromosomal disorders', 'Turner syndrome females are sterile.', 'Their ovaries are rudimentary.', 0, 'Rudimentary ovaries do not make functional eggs, so they are sterile.');
asr(5, 'laws of inheritance', 'The law of segregation holds even in incomplete dominance.', 'The F<sub>2</sub> shows a 1 : 2 : 1 phenotypic ratio, which can arise only if the alleles separate in the gametes.', 0, 'The 1 : 2 : 1 ratio comes from the random union of two kinds of gametes from the F<sub>1</sub>, so the alleles must have segregated.');
stm(5, 'linkage', 'Recombination frequency can exceed 50 per cent in a test cross of two genes.', 'Genes on different chromosomes give 50 per cent recombinants.', 3, 'In a test cross, recombinants never exceed 50 per cent. Statement II is correct.');
stm(5, 'sex determination', 'A human male produces only two types of sperm in all.', 'With respect to the sex chromosomes a human male produces two types of sperm.', 3, 'With respect to sex chromosomes there are two types, but the independent assortment of 23 pairs gives a huge number of genetically different sperm. Statement I is wrong.');
mc(5, 'Mendelian disorders', 'How many of the following are correct? (a) A haemophilic woman has a haemophilic father. (b) A colour-blind woman has a colour-blind father. (c) A colour-blind son can arise from a normal father. (d) Turner syndrome is XXY.', 'Three', ['One', 'Two', 'Four'], '(a) is correct: X<sup>h</sup>X<sup>h</sup> needs an X<sup>h</sup> from the father. (b) is correct. (c) is correct, as the mother may be a carrier. (d) is wrong: Turner is XO.', 'Use the X-linked rules one by one.', 'statements');
mc(5, 'Mendelian disorders', 'How many of the following are correct? (a) Sickle-cell anaemia is X-linked. (b) Thalassemia is autosomal recessive. (c) Haemophilia shows crisscross inheritance. (d) Phenylketonuria is due to a lack of an enzyme.', 'Three', ['Two', 'Four', 'One'], '(a) is wrong: sickle-cell is autosomal. (b), (c) and (d) are correct.', 'Check each statement alone.', 'statements');
match(5, 'sex determination', 'xm7', 'Type of sex determination and a feature', ['A. XX-XY', 'B. ZW-ZZ', 'C. XX-XO', 'D. Haplodiploidy'], ['p. Male has only one X and no Y', 'q. Female is heterogametic', 'r. Unfertilised egg forms the male', 's. Sex decided by the sperm'], 'A-s, B-q, C-p, D-r', ['A-q, B-s, C-p, D-r', 'A-s, B-q, C-r, D-p', 'A-p, B-q, C-s, D-r'], 'In humans the sperm decides the sex, in birds the female is ZW, in grasshoppers the male is XO and in bees the drone develops from an unfertilised egg.');
match(5, 'chromosomal disorders', 'xm8', 'Condition and number of chromosomes in a body cell', ['A. Down syndrome', 'B. Klinefelter syndrome', 'C. Turner syndrome', 'D. Normal gamete'], ['p. 45', 'q. 47', 'r. 23', 's. 46'], 'A-q, B-q, C-p, D-r', ['A-q, B-p, C-q, D-r', 'A-s, B-q, C-p, D-r', 'A-q, B-q, C-s, D-r'], 'Down (trisomy 21) and Klinefelter (XXY) both have 47. Turner is 45. A normal gamete has 23.');
match(5, 'linkage', 'xm9', 'Term and its meaning', ['A. Linkage', 'B. Recombination', 'C. Parental type', 'D. Map unit'], ['p. Generation of non-parental gene combinations', 'q. Physical association of genes on a chromosome', 'r. 1 per cent recombination', 's. Gene combination as in the parent'], 'A-q, B-p, C-s, D-r', ['A-p, B-q, C-s, D-r', 'A-q, B-p, C-r, D-s', 'A-s, B-p, C-q, D-r'], 'Morgan defined linkage and recombination. Sturtevant used 1 per cent recombination as a map unit.');
nat(5, 'laws of inheritance', 'A gene pair is scored in 1600 F<sub>2</sub> plants of AaBb × AaBb. How many are expected to show the recessive phenotype for both traits?', 100, '1/16 × 1600 = 100.', null);
nat(5, 'Mendelian disorders', 'A carrier woman and a normal man have three children. What is the probability, as a per cent, that all three are colour-blind sons? Give the answer to two decimals.', 1.56, 'For one child: colour-blind son = 1/2 (son) × 1/2 (gets X<sup>c</sup>) = 1/4. For three children: (1/4)<sup>3</sup> = 1/64 = 1.5625 per cent, about 1.56.', '%', null, 0.01);

// top-up match
match(4, 'laws of inheritance', 'xm10', 'Genotype and the number of different gametes', ['A. AaBb', 'B. AaBbCc', 'C. AABBCc', 'D. aabb'], ['p. 8', 'q. 1', 'r. 4', 's. 2'], 'A-r, B-p, C-s, D-q', ['A-p, B-r, C-s, D-q', 'A-r, B-p, C-q, D-s', 'A-s, B-p, C-r, D-q'], 'Gametes = 2<sup>n</sup>, where n is the number of heterozygous pairs: AaBb 4, AaBbCc 8, AABBCc 2, aabb 1.');

export default { topic: 'inheritance', groups, items, gens };
