---
title: "Genetic crosses step by step: squares, branches and family odds"
summary: "How the Punnett square tool turns two parents' genotypes into exact ratios, then into chances for several offspring and Bayes carrier risks, with a fresh two-gene plant cross."
tools: [punnett-square, mendelian-chi-square, pedigree-drawing-tool, carrier-risk, hardy-weinberg-tester]
updated: 2026-11-10
sources:
  - "Mendel's laws of segregation and independent assortment, the product rule, the binomial rule and Bayes' theorem: standard genetics and probability."
  - "The plant cross, the six seedlings and the family in the worked example are made up. All numbers come from the tool's own code."
---

The Punnett square tool works out what children two parents can have. You set each parent's genotype for up to six genes, and it draws the grid of eggs against sperm, counts every outcome as an exact fraction, and then answers the follow-up questions a square cannot: the chance of one particular child, the odds across a whole family, and how likely someone is to be a carrier given their relatives. It is a learning aid for biology students and teachers, not genetic counselling. When you have real offspring counts, test them against the expected ratio with the [[mendelian-chi-square|Mendelian chi-square test]]; to sketch the family behind a carrier question, use the [[pedigree-drawing-tool]]; and for allele frequencies across a whole population, try the [[hardy-weinberg-tester]].

## What it is

Each parent carries two copies (alleles) of every gene and passes one to each egg or sperm. If genes sit on different chromosomes they sort independently, so a parent with two mixed genes (RrTt) makes four kinds of gamete in equal numbers: RT, Rt, rT and rt.

A **Punnett square** puts one parent's gametes down the side and the other's across the top. Every box is one equally likely child, so counting boxes gives the ratios.

How a genotype shows up as a **phenotype** (what you see) depends on the gene:

- **Complete dominance**: one copy of the dominant allele is enough (TT and Tt look the same).
- **Incomplete dominance**: the mixed genotype is in between, such as pink flowers from red and white.
- **Codominance** and **ABO blood groups**: both alleles show at once.
- **X-linked** genes: fathers pass their X only to daughters, so sons and daughters get different odds.

For big crosses the **branch method** is faster: find each gene's chance on its own, then multiply (the product rule). For a family of n children, the **binomial rule** gives the chance that exactly k have a trait with one-child chance p:

P(k) = C(n, k) × p^k × (1 − p)^(n − k)

where C(n, k) is the number of ways to choose which k children they are. **Bayes' theorem** updates a carrier chance once you know some children are unaffected.

## How to use it

1. In **The cross**, pick an example or "Your own cross", and set the **Number of genes**.
2. For each gene, type a **Letter**, choose **How the alleles act**, then pick the **Mother** and **Father** genotypes.
3. Read the **Punnett square** card: the headline phenotype ratio, the square itself, and the phenotype and genotype tables. Tap a table row to highlight its boxes, or download either table as CSV.
4. In **Branch method**, describe one kind of child gene by gene to see its chance and the working.
5. In **Several children**, pick where p comes from (typed, the child above, or a phenotype), then set the number of children and k.
6. In **Carrier risk from a family tree**, choose **Autosomal** or **X-linked**, say what is known about each person and how many unaffected children there are.

## A worked example

A gardener crosses two plants. Flower colour (R) shows incomplete dominance: RR red, Rr pink, rr white. Height (T) is completely dominant: tall over short. The mother plant is **RrTt** and the father plant is **Rrtt**.

**The square.** The mother makes four gametes (RT, Rt, rT, rt) and the father two (Rt, rt), so the square is 4 rows by 2 columns. The tool reports **Phenotypes 1 : 1 : 2 : 2 : 1 : 1**:

| Phenotype | Fraction |
|---|---|
| Red, tall | 1/8 |
| Red, short | 1/8 |
| Pink, tall | 1/4 |
| Pink, short | 1/4 |
| White, tall | 1/8 |
| White, short | 1/8 |

**Branch method.** A pink, short seedling needs Rr (1/2) and tt (1/2): 1/2 × 1/2 = **1/4**.

**Six seedlings.** With p = 1/4 and n = 6, the chance that exactly 2 are pink and short is 15 × (1/4)² × (3/4)⁴ = **1215/4096 (29.66 %)**. At least 2 is 1909/4096 (46.61 %), none is 729/4096 (17.8 %) and at least one is 3367/4096 (82.2 %).

**A carrier question.** Now a human example, for an autosomal recessive condition. Partner 1 has an affected aunt (prior carrier chance 1/3). Partner 2 has one parent who is a known carrier (1/2). They have **2 unaffected children**. Before the children are counted, both are carriers with chance 1/3 × 1/2 = 1/6, and a child would be affected with chance 1/24. Two unaffected children multiply the "both carriers" row by (3/4)² = 9/16, giving a joint of 3/32. The other rows keep their priors (1/6, 1/3, 1/3). Dividing by the total, 89/96, gives both carriers **9/89**, and the next child affected **9/356**, about **1 in 40**.

## Where it is used

- **Plant and animal breeding.** Breeders plan crosses to get a wanted mix of traits and estimate how many offspring to raise.
- **Understanding family risk.** The Bayes tables show why unaffected children lower a carrier chance.

## Common mistakes

- **Writing gametes with two copies of a gene.** Each gamete gets one allele per gene. RrTt makes RT, Rt, rT and rt, never RrT.
- **Using the 9 : 3 : 3 : 1 ratio for every two-gene cross.** It holds only for two complete-dominance genes in two double-mixed parents.
- **Forgetting order in family questions.** "Exactly 2 of 6" counts every order; "these 2 first" is a much smaller chance.
- **Assuming linked genes sort independently.** Genes close together on one chromosome travel together, so these ratios do not apply.

## Questions people ask

**Why do some crosses show a sex column?** As soon as one gene is X-linked, daughters and sons can get different alleles from the father, so the tool splits every result by sex.

**Can I trust the fractions?** They are kept as exact fractions all the way through, so there is no rounding until the percentage is shown.
