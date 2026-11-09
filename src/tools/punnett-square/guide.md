---
name: Punnett square and pedigree probability
num: 202
shelf: science
section: genetics
title: "Punnett square calculator: genotype and phenotype ratios, the branch method, family chances and carrier risk"
summary: "Draw a Punnett square for 1 to 4 genes (complete, incomplete and codominant dominance, ABO blood groups, X-linked traits) and get the genotype and phenotype ratios as exact fractions. Use the branch method for up to 6 genes, the binomial rule for several children, and a Bayes table for carrier risk in a family. For learning, not genetic counselling."
status: live
ads: false
order: 1
icon: table
works: offline
updated: 2026-11-09
related: [sequence-tools, primer-checker, sequence-alignment, mendelian-chi-square, pedigree-drawing-tool, hardy-weinberg-tester, linkage-map-calculator, carrier-risk, crossing-plan]
sources:
  - "The square, the ratios, the branch method, the binomial chances and the Bayes tables are written by fibub from the standard rules of Mendelian inheritance and checked in the tests against an independent brute-force Python version (300 random crosses, 0 differences) and classic textbook results worked by hand (9:3:3:1, 27:9:9:9:3:3:3:1, 1/9 and 3/32 for two partners with affected siblings, 1/5 for an X-linked carrier with two unaffected sons)."
  - "The example crosses use letters and trait names only (Mendel's yellow/green and round/wrinkled peas are general textbook knowledge). The typed carrier chance 1/50 is made up and editable; it is not a figure for any real condition or population."
  - "Nothing you enter is stored or sent anywhere."
flow:
  - { icon: pencil, label: "Parents" }
  - { icon: table, label: "Square" }
  - { icon: percent, label: "Ratios" }
  - { icon: sigma, label: "Chances" }
---

## What it does

A Punnett square lists every egg one parent can make against every sperm the other can make, so each box is an equally likely child. This page draws the square for you, counts the boxes and turns them into exact fractions, then goes further than a square can:

- **Up to 4 genes in a square** (16 × 16 boxes), and up to 6 genes by the branch method.
- **Six ways a gene can act.** *Complete dominance* (A_ looks the same as AA), *incomplete dominance* (Aa is in between, like pink flowers), *codominance* (both alleles show, written C¹C²), *ABO blood groups* (Iᴬ and Iᴮ codominant, i recessive), and *X-linked recessive* or *X-linked dominant* traits, where the father passes his X to daughters and his Y to sons, so the tables split children into females and males.
- **Ratios.** The phenotype ratio in its usual form (9 : 3 : 3 : 1), plus tables of every phenotype and genotype with the fraction, the number of boxes and the percentage. Tap a row to light up its boxes in the square.
- **Branch method.** Each gene on its own, then the product rule, with the working shown, for any child you describe: a genotype or a look for each gene, and a sex when there is an X-linked gene.
- **Several children.** The binomial rule for "exactly k of n children", at least k, at most k, none and at least one.
- **Carrier risk.** A Bayes table for an autosomal recessive condition (two unaffected partners and their unaffected children) or an X-linked recessive one (a woman and her unaffected sons).

Test whether real offspring counts fit the ratio with the [[mendelian-chi-square|Mendelian chi-square test]], and draw the family behind a carrier risk with the [[pedigree-drawing-tool]].

## How to use it

1. **Parents.** Pick an example or set the number of genes. For each gene choose a letter, how its alleles act, and the mother's and father's genotypes. Type phenotype names separated by commas if you like (for example *Yellow, Green*).
2. **Square.** Read the eggs down the side and the sperm across the top. Each box is one equally likely child.
3. **Ratios.** Read the phenotype and genotype tables, or download them as CSV.
4. **Chances.** Describe one child in the branch method, use that chance (or a phenotype, or a typed one) for several children, and try the carrier risk calculator. The Image, PDF and Word buttons save everything as a report.

## Worked example

The page opens with Mendel's two pea genes: seed colour (A, yellow over green) and seed shape (B, round over wrinkled), both parents AaBb. Each parent makes four eggs or sperm, AB, Ab, aB and ab, so the square has 16 boxes. The page shows **Phenotypes 9 : 3 : 3 : 1**: yellow and round 9/16, yellow and wrinkled 3/16, green and round 3/16, green and wrinkled 1/16, from 9 genotypes in the ratio 1 : 2 : 1 : 2 : 4 : 2 : 1 : 2 : 1. The branch method gives the green, wrinkled child as **1/4 × 1/4 = 1/16**.

Under *Several children*, with p = 1/4 (an affected child of two carriers) and 4 children, the chance that exactly 1 is affected is 4 × 1/4 × (3/4)³ = **27/64 (42.19 %)**, and at least one is 175/256 (68.36 %).

Under *Carrier risk*, both partners have an affected brother or sister, so each has a 2/3 chance of being a carrier. Before their children are counted, the chance that a child is affected is 2/3 × 2/3 × 1/4 = 1/9. They already have one unaffected child, which makes it a little less likely that both are carriers: the Bayes table gives both carriers **3/8**, each partner 5/8, and the next child affected **3/32 (1 in 11)**. Switch to *X-linked* (recessive): a woman whose mother is a carrier (1/2) and who has two unaffected sons is a carrier with chance **1/5**.

## Tips

- Use a test cross (Aa × aa, in the examples) to see why a 1 : 1 result tells you a parent was heterozygous.
- For many genes, skip the square and use the branch method: it gives the same fractions with far less work.
- The genes are taken to sort independently. Genes close together on a chromosome are linked and do not follow these ratios.

## FAQ

**Is this genetic counselling?** No. It works out textbook chances only. Real families can have new mutations, incomplete penetrance, linked genes and test results this page cannot use. Talk to a genetic counsellor or doctor about a real family.

**Why are boys and girls listed separately?** With an X-linked gene the father gives his X to every daughter and his Y to every son, so the chances differ by sex.

**Can I enter a population carrier chance?** Yes, choose *Type a chance*. The 1/50 already there is a made-up example; ask a genetics service for a real figure.
