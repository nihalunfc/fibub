---
title: 'Principles of inheritance and variation'
seoTitle: 'Principles of inheritance and variation: NEET biology'
summary: 'Mendel''s experiments and laws, monohybrid, dihybrid and test crosses, incomplete dominance, codominance and multiple alleles (ABO), pleiotropy, polygenic traits, the chromosomal theory, linkage and recombination, sex determination, mutation, pedigree analysis, and Mendelian and chromosomal disorders, with the ratios and traps NEET asks most.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'The phenotypic ratio of a dihybrid test cross (AaBb × aabb) with independent assortment is:'
    choices: ['9:3:3:1', '1:1:1:1', '3:1', '1:2:1']
    ans: 1
    why: 'AaBb makes four gamete types in equal numbers (AB, Ab, aB, ab); aabb makes only ab, so the four offspring classes appear 1:1:1:1.'
  - q: 'A man of blood group A and a woman of group B have a child of group O. What are the parents'' genotypes?'
    choices: ['IᴬIᴬ and IᴮIᴮ', 'Iᴬi and Iᴮi', 'IᴬIᴮ and ii', 'Iᴬi and IᴮIᴮ']
    ans: 1
    why: 'An O child is ii, so each parent must carry i. The parents are Iᴬi and Iᴮi.'
  - q: 'Turner''s syndrome has the karyotype:'
    choices: ['47, XXY', '45, X0', '47, +21', '47, XYY']
    ans: 1
    why: 'Turner''s syndrome comes from the loss of one X: 45 chromosomes, X0. Females are sterile with rudimentary ovaries. 47, XXY is Klinefelter''s; 47, +21 is Down''s.'
sources:
  - 'NCERT Biology Class 12 (2023 rationalised), chapter Principles of inheritance and variation: topics followed, no text copied'
  - 'National Medical Commission, NEET (UG) syllabus: Genetics and evolution https://www.nmc.org.in'
  - 'Mendel G. (1866), Versuche über Pflanzen-Hybriden, Verhandlungen des naturforschenden Vereines in Brünn 4, 3-47; English translation at https://www.mendelweb.org'
---

**Biology · Class 12 · about 34 minutes.** By the end you will be able to predict the offspring of any one-gene or two-gene cross, recognise each departure from Mendel's ratios, read a pedigree, explain linkage and sex determination, and name the cause and karyotype of each genetic disorder in the syllabus.

<div class="bigidea">Each trait is controlled by a pair of factors (genes), one from each parent. The pair separates when gametes form, and each gamete gets one at random. Every ratio in genetics is just counting those random gametes; every "exception" is a rule about how the two alleles behave together or how genes sit on chromosomes.</div>

## 1. Mendel and his laws

Gregor Mendel crossed garden peas for seven years (1856 to 1863). Peas were ideal: many true-breeding lines, clear contrasting traits, and self-pollination that can be controlled. He followed **seven pairs of contrasting traits** (such as tall and dwarf stem, round and wrinkled seed, yellow and green seed, violet and white flower) and, crucially, counted large numbers of offspring.

Crossing true-breeding tall (TT) with dwarf (tt): all F1 plants are tall (Tt). Selfing F1 gives F2 in the ratio **3 tall : 1 dwarf** (phenotype) and **1 TT : 2 Tt : 1 tt** (genotype). From this:

1. **Law of dominance**: in a heterozygote one allele (dominant) is expressed, the other (recessive) is hidden.
2. **Law of segregation**: the two alleles separate at gamete formation, so each gamete is pure (gets only one).
3. **Law of independent assortment** (from dihybrid crosses): genes for different traits separate independently of each other.

The dihybrid cross RRYY × rryy gives all round yellow F1 (RrYy); F2 shows **9:3:3:1** (round yellow : round green : wrinkled yellow : wrinkled green). The **test cross** (crossing with the homozygous recessive) shows the genotype of a dominant-looking plant: 1:1 means it was heterozygous, all dominant means homozygous.

<figure class="fig" data-fig="punnett-square"><figcaption>Punnett squares for the crosses NEET uses. Each box is one equally likely pairing of gametes; colours show phenotypes.</figcaption></figure>

<div class="problem" data-problem="inh-cross"></div>

Choose the cross, set the number of offspring and press Run again several times. Then try the linked cross.

<figure class="fig" data-fig="@bio-dihybrid-sim"><figcaption>Small samples wobble around the ratio; large ones settle near it. The 9:3:3:1 ratio needs independent genes: linked genes give only the parental classes.</figcaption></figure>

## 2. When the 3:1 changes

- **Incomplete dominance**: the heterozygote is in between. Snapdragon (dog flower): RR red × rr white → Rr pink; F2 is **1 red : 2 pink : 1 white**, so phenotype and genotype ratios are the same.
- **Codominance**: both alleles show fully. Human ABO blood groups: gene I with three alleles, Iᴬ and Iᴮ (codominant, each adds a different sugar to the red cell surface) and i (adds none, recessive). Three alleles give **6 genotypes and 4 phenotypes** (A, B, AB, O). A gene with more than two alleles in a population is a case of **multiple alleles**; any one person still carries only two.
- **Pleiotropy**: one gene affects several traits. Phenylketonuria (one enzyme missing, with effects on the brain, skin and hair) is the classic case. Pea starch grain size is a neat example: BB gives large grains (round seed), bb small grains (wrinkled), and Bb intermediate grains, so for grain size Bb shows incomplete dominance while for seed shape it shows complete dominance. Dominance depends on which trait you look at.
- **Polygenic inheritance**: several genes add small effects, giving a smooth range, such as human skin colour or height. With three genes (A, B, C) the number of dominant alleles from 0 to 6 sets the shade.

<div class="myth">

**"A dominant allele is the common or stronger one."** Dominance only means it shows in the heterozygote, often because the recessive allele makes a faulty or no product. Many dominant alleles are rare, and many recessive ones are common.

</div>

Pick parent genotypes and see which blood groups the children can have.

<figure class="fig" data-fig="@bio-blood-groups"><figcaption>IA and IB are codominant (the heterozygote shows both), and i is recessive: this is multiple alleles plus codominance in one example.</figcaption></figure>

## 3. Chromosomes, linkage and recombination

Mendel's work (1865) was ignored until 1900, when de Vries, Correns and von Tschermak found it again. Sutton and Boveri then noticed that chromosomes behave like Mendel's factors: they come in pairs, separate at meiosis, and pairs assort independently. This is the **chromosomal theory of inheritance**. T. H. Morgan proved it using the fruit fly *Drosophila melanogaster* (short life cycle of about two weeks, many offspring, easy to grow, clear male and female, visible variations).

Morgan found that some genes on the same chromosome stay together far more than 9:3:3:1 predicts. This is **linkage**. Crossing over at meiosis can separate them, producing **recombinants**. Tightly linked genes give few recombinants (for example about 1.3% for yellow body and white eye), loosely linked ones many (37.2% for white eye and miniature wing). Alfred Sturtevant, Morgan's student, used the recombination frequency as a measure of distance: **1% recombination = 1 map unit (1 centimorgan)**. This gave the first genetic maps.

<div class="problem" data-problem="inh-map"></div>

## 4. Sex determination

Henking (1891) saw a nucleus structure that went into only half the sperm in an insect; he called it the X body. It was the sex chromosome.

| System | Female | Male | Example |
|---|---|---|---|
| XX-XO | XX | XO (one fewer chromosome) | grasshopper |
| XX-XY | XX | XY | humans, *Drosophila* |
| ZW-ZZ | ZW (female heterogametic) | ZZ | birds |
| Haplodiploid | diploid (from fertilised egg) | haploid (unfertilised egg, by parthenogenesis) | honey bee |

In humans the father's sperm decides the sex. A male honey bee (drone) has no father and cannot have sons, but has a grandfather.

## 5. Mutation and pedigrees

A **mutation** changes the DNA. A **point mutation** changes one base, as in sickle cell anaemia; **frameshift** mutations come from inserting or deleting bases. Chromosomal changes (loss, gain or rearrangement of segments) are often linked to cancer. **Mutagens** include UV light and chemicals.

**Pedigree analysis** traces a trait through a family with standard symbols: squares for males, circles for females, filled for affected, a horizontal line for mating, and a double line for marriage between relatives (consanguineous). A trait that skips generations and appears in children of unaffected parents is recessive; one that appears in every generation with every affected child having an affected parent is usually dominant; one seen mostly in males and passed through carrier mothers is X-linked recessive.

Switch between the three modes of inheritance and turn on the genotypes.

<figure class="fig" data-fig="@bio-pedigree"><figcaption>Look for the clue in each: two normal parents with an affected child (autosomal recessive), an affected parent in every generation (dominant), mainly affected sons through carrier mothers (X-linked recessive).</figcaption></figure>

## 6. Genetic disorders

**Mendelian disorders** (single gene):

| Disorder | Pattern | What goes wrong |
|---|---|---|
| Haemophilia | X-linked recessive | a clotting protein is missing; a small cut keeps bleeding. Seen in descendants of Queen Victoria. Affected females are very rare. |
| Colour blindness | X-linked recessive | red or green cone defect; about 8% of males, 0.4% of females |
| Sickle cell anaemia | autosomal recessive | glutamic acid replaced by valine at the sixth position of the β-globin chain (GAG → GUG); red cells sickle at low oxygen. HbᴬHbˢ carriers are healthy. |
| Phenylketonuria | autosomal recessive | the enzyme that turns phenylalanine into tyrosine is missing; phenylalanine and its products build up and harm the brain |
| Thalassemia | autosomal recessive | too few globin chains made (α-thalassemia: genes HBA1, HBA2 on chromosome 16; β-thalassemia: HBB on chromosome 11). A quantitative problem, whereas sickle cell is a qualitative (wrong protein) problem. |

**Chromosomal disorders** (whole chromosomes gained or lost, usually by failure of chromatids to separate, called non-disjunction; gain or loss of one chromosome is **aneuploidy**, a whole extra set is **polyploidy**, common in plants):

- **Down's syndrome**: trisomy 21 (47 chromosomes). Short, small round head, furrowed tongue, partly open mouth, broad palm with a single crease, slow physical, motor and mental development. Described by Langdon Down (1866).
- **Klinefelter's syndrome**: 47, XXY. Male with overall masculine development but some feminine features (such as breast development, gynaecomastia); sterile.
- **Turner's syndrome**: 45, X0. Female, sterile with rudimentary ovaries, short, lacks secondary sexual characters.

<div class="meaning">
<dl>
<dt>Allele</dt><dd>one version of a gene; a diploid has two per gene</dd>
<dt>Homozygous / heterozygous</dt><dd>two same alleles (TT, tt) / two different alleles (Tt)</dd>
<dt>Genotype / phenotype</dt><dd>the alleles present / the trait you see</dd>
<dt>Test cross</dt><dd>cross with the homozygous recessive to reveal an unknown genotype</dd>
<dt>Map unit (cM)</dt><dd>1% recombinant offspring</dd>
<dt>Physical meaning</dt><dd>A ratio is a count of equally likely gamete meetings. Change how alleles show (dominance) and the phenotype groups merge or split; put genes on one chromosome and the gametes are no longer equally likely.</dd>
</dl>
</div>

<div class="keypoints">

- Mendel: 7 pea traits; laws of dominance, segregation, independent assortment. Monohybrid F2 3:1 (1:2:1), dihybrid 9:3:3:1, test crosses 1:1 and 1:1:1:1.
- Incomplete dominance: 1:2:1 phenotype (snapdragon). Codominance and multiple alleles: ABO, 6 genotypes, 4 phenotypes.
- Pleiotropy: one gene, many effects (PKU); polygenic: many genes, one smooth trait (skin colour).
- Chromosomal theory: Sutton and Boveri; Morgan's linkage in *Drosophila*; Sturtevant: 1% recombination = 1 cM.
- Sex: XX-XO grasshopper, XX-XY humans, ZW birds (female ZW), haplodiploid honey bee.
- X-linked recessive: haemophilia, colour blindness. Autosomal recessive: sickle cell (Glu → Val at 6), PKU, thalassemia.
- Down 47 (+21), Klinefelter 47 XXY, Turner 45 X0.

</div>
