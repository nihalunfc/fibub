---
title: 'Principles of inheritance and variation: question types and traps'
seoTitle: 'Inheritance and variation NEET questions and traps'
summary: 'Every way NEET asks about genetics: cross ratios and probabilities, test crosses, incomplete dominance and codominance, ABO problems, polygenic traits, linkage and map distance, sex determination, pedigrees, X-linked crosses and genetic disorders, each with a method and the usual trap. Then practise.'
minutes: 24
updated: 2026-11-22
quiz:
  - q: 'In the cross AaBbCc × AaBbCc (independent genes, complete dominance), what fraction of offspring show all three recessive traits?'
    choices: ['1/8', '1/16', '1/64', '27/64']
    ans: 2
    why: 'Each gene gives the recessive phenotype with chance 1/4, so (1/4)³ = 1/64. 27/64 is the chance of all three dominant.'
  - q: 'A colour-blind man marries a woman who is homozygous normal. Their daughters will be:'
    choices: ['all colour-blind', 'all carriers', 'half carriers', 'all normal non-carriers']
    ans: 1
    why: 'Every daughter gets her father''s only X, which carries the allele, and a normal X from her mother: all carriers with normal vision. Sons get his Y and are normal.'
  - q: 'Two genes show 12% recombinant offspring in a test cross. The distance between them is:'
    choices: ['6 cM', '12 cM', '24 cM', '88 cM']
    ans: 1
    why: '1% recombination equals 1 map unit, so 12% means 12 centimorgans.'
sources:
  - 'NCERT Biology Class 12 (2023 rationalised), chapter Principles of inheritance and variation: topics followed, no text copied; NEET question patterns studied (no questions copied)'
---

**Biology · Class 12 · about 24 minutes.** Read [Principles of inheritance and variation](/learn/courses/medical-entrance/inheritance/) first. Here you meet every question type NEET builds from this chapter, then practise.

<div class="bigidea">Genetics questions reward one habit: split a cross into single genes, solve each as a monohybrid, then multiply. Most traps come from forgetting that dominance changes the phenotype ratio, not the genotype ratio, and that linked or sex-linked genes break the simple rules.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Ratios and probabilities.</b> <i>Method:</i> one gene at a time: Aa × Aa gives 3/4 dominant, 1/4 recessive; Aa × aa gives 1/2 each. Multiply across genes. Number of gamete types = 2ⁿ for n heterozygous genes; F2 genotypes = 3ⁿ, phenotypes = 2ⁿ (complete dominance). <i>Trap:</i> drawing a 64-box square when multiplication takes ten seconds.</div>
<div class="step"><b>2. Test cross reading.</b> 1:1 means the dominant parent was heterozygous; all dominant means homozygous. <i>Trap:</i> a back cross (to either parent) is not always a test cross.</div>
<div class="step"><b>3. Incomplete and codominance.</b> Phenotype ratio becomes 1:2:1, same as genotype. <i>Trap:</i> calling ABO "incomplete dominance".</div>
<div class="step"><b>4. ABO problems.</b> <i>Method:</i> an O child means both parents carry i; an AB parent cannot have an O child. 3 alleles give 6 genotypes and 4 phenotypes.</div>
<div class="step"><b>5. Polygenic traits.</b> With n genes, 2n + 1 phenotype classes; the extreme classes are each (1/4)ⁿ in an F2 of full heterozygotes.</div>
<div class="step"><b>6. Linkage and maps.</b> Map distance = % recombinants. Distances roughly add along a chromosome. <i>Trap:</i> parental types are the largest classes, whatever their names.</div>
<div class="step"><b>7. Sex determination.</b> Which sex is heterogametic: male in XY and XO, female in ZW; honey bee males are haploid.</div>
<div class="step"><b>8. X-linked crosses and pedigrees.</b> A son's X comes from his mother; a daughter gets her father's X. Affected father → all daughters carriers. <i>Trap:</i> father to son transmission rules out X-linkage.</div>
<div class="step"><b>9. Disorders.</b> Pattern (X-linked, autosomal recessive, chromosomal), cause and karyotype. Sickle cell: Glu → Val at position 6 of β-globin, GAG → GUG.</div>
</div>

## Worked examples

**Example 1 (level 4, probability).** In AaBbCcDd × AaBbCcDd, what fraction is AaBBccDd? *Solution.* Aa: 1/2; BB: 1/4; cc: 1/4; Dd: 1/2. Multiply: 1/2 × 1/4 × 1/4 × 1/2 = **1/64**.

**Example 2 (level 4, X-linked).** A woman with normal vision whose father was colour-blind marries a colour-blind man. What fraction of their children will be colour-blind? *Solution.* She must be a carrier (XᶜX). Father XᶜY. Daughters: XᶜXᶜ or XᶜX, so half colour-blind. Sons: XᶜY or XY, half colour-blind. Overall **1/2** of all children.

**Example 3 (level 5, three-point order).** Genes P, Q and R: P to Q 8 cM, Q to R 5 cM, P to R 13 cM. What is the gene order? *Solution.* The largest distance (13) is between the two ends, and 8 + 5 = 13, so Q lies in the middle. **P – Q – R.**

**Example 4 (level 5, polygenic).** Skin colour is controlled by three genes. Two AaBbCc parents have children. What fraction will have exactly three dominant alleles? *Solution.* Six allele slots, each dominant with chance 1/2: number of ways to get 3 dominants = 6C3 = 20, out of 2⁶ = 64. **20/64 = 5/16.**

<div class="myth">

**"9:3:3:1 means 9 genotypes."** A dihybrid F2 has 9 genotypes and 4 phenotypes; 9:3:3:1 is the phenotype ratio.

</div>

<div class="meaning">
<dl>
<dt>Product rule</dt><dd>independent genes: multiply the single-gene chances</dd>
<dt>Counts</dt><dd>gametes 2ⁿ, F2 genotypes 3ⁿ, F2 phenotypes 2ⁿ (complete dominance)</dd>
<dt>Map rule</dt><dd>1% recombination = 1 cM; the two farthest genes are the ends</dd>
<dt>Physical meaning</dt><dd>Each gene is a separate coin toss at meiosis unless the genes share a chromosome (linkage) or sit on X.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-biology" data-topics="inheritance" data-mode="practice" data-exam="neet"></div>

<div class="keypoints">

- Solve one gene at a time, then multiply.
- Incomplete dominance and codominance make phenotype ratio equal genotype ratio (1:2:1).
- ABO: 3 alleles, 6 genotypes, 4 phenotypes; O child means both parents carry i.
- Map distance = % recombinants; largest distance gives the end genes.
- X-linked: sons get the X from the mother; affected fathers give carrier daughters.
- Know each disorder's pattern and karyotype.

</div>
