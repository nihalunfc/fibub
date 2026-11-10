---
title: "How to do a Punnett square (with a worked example)"
summary: "Write each parent's gametes along two sides of a grid, fill every box, then count. A worked tall and short pea plant cross, the 3 : 1 and 1 : 2 : 1 ratios, and how to check them."
tools: [punnett-square, mendel-peas, mendelian-chi-square]
updated: 2026-11-10
sources:
  - "Mendel's laws of segregation and independent assortment, and the 3 : 1 and 1 : 2 : 1 ratios of a monohybrid cross: standard school biology."
  - "Tall and short pea plants (one gene, tall dominant) is a general textbook example; the letters and numbers here are our own."
---

To do a Punnett square, write the gametes (eggs or sperm) one parent can make across the top, the other parent's down the side, and fill each box with the two letters that meet there. Each box is one equally likely child, so counting boxes gives the ratios. The [[punnett-square]] page draws the grid, counts it and turns the counts into exact fractions.

## What you need

- **The trait and its alleles.** An allele is one version of a gene. Use a capital letter for the dominant allele (it shows whenever it is present) and the same letter in lower case for the recessive one.
- **Both parents' genotypes**, the pair of letters each one carries, such as Tt.
- **Which allele is dominant**, or whether the gene shows incomplete dominance (a blend) instead.

## Step by step

Every body cell holds two copies of each gene, one from each parent. When eggs or sperm form, the two copies separate and each gamete gets just one. That is Mendel's law of segregation, and it is the whole reason the square works.

1. Write each parent's genotype. Tt makes two kinds of gamete, T and t, in equal numbers.
2. Draw a 2 × 2 grid. Put one parent's gametes above the columns and the other's beside the rows.
3. In each box, write the row letter and the column letter together. Put the capital first by habit: Tt, not tT.
4. Count the boxes of each genotype (the letters) and each phenotype (what the plant looks like).

Because each of the four boxes has the same chance, the probability of any result is:

**chance = boxes with that result ÷ total boxes**

With the tool:

1. The page opens on a two-gene pea cross. Set **Number of genes** to 1.
2. Type the **Letter** you want, leave **How the alleles act** on Complete dominance, and pick the genotype for the **Mother** and the **Father**.
3. Type phenotype names if you like, separated by a comma, dominant first.
4. Read the square, the phenotype ratio in large type, and the two tables under it. Tap a row in a table to light up its boxes in the grid.

## A worked example

In pea plants, tall (T) is dominant over short (t). Two tall plants, both Tt, are crossed. What will the offspring look like?

**The square.** Each parent gives T or t.

| | T | t |
|---|---|---|
| **T** | TT | Tt |
| **t** | Tt | tt |

**Count the genotypes.** TT appears once, Tt twice and tt once. That is a genotype ratio of **1 : 2 : 1**, or 1/4 TT, 1/2 Tt, 1/4 tt.

**Count the phenotypes.** TT and Tt both carry a T, so both are tall. Only tt is short. Three tall boxes to one short box gives a phenotype ratio of **3 : 1**: a 3/4 (75 %) chance of tall and 1/4 (25 %) of short for each seed.

On the page, set one gene with letter T, both parents Tt, and type "Tall, Short" as the names. The large line reads **Phenotypes 3 : 1**, the facts show 4 boxes and a genotype ratio of 1 : 2 : 1, and the phenotype table lists Tall 3/4 and Short 1/4.

**Taking it one step further.** If you plant three of these seeds, what is the chance none of them is short? Each seed is a separate draw, so multiply: 3/4 × 3/4 × 3/4 = 27/64, about 42.19 %. In the **Several children** part of the page, choose "Short (1/4)" as the source of p, set 3 for the number and 0 for exactly k. It shows 27/64 (42.19 %), and the chance that at least one is short is 37/64.

## Check your answer

- **The boxes add up.** A one-gene square always has 4 boxes. Your ratio numbers should add to 4 (3 + 1, or 1 + 2 + 1).
- **The fractions add up to 1.** 1/4 + 1/2 + 1/4 = 1. If they do not, a box was missed or counted twice.
- **A ratio is a chance, not a promise.** Four seeds will not always give exactly three tall plants. Grow a few hundred and you get close to 3 : 1. The [[mendel-peas]] garden lets you grow random offspring and watch the counts settle.
- **Test real counts.** If you have counts from a real cross, the [[mendelian-chi-square]] test says whether they fit 3 : 1 well enough.

## Questions people ask

**How do I do a Punnett square for two traits?**
Each parent with two genes, such as TtRr, makes four gamete types (TR, Tr, tR, tr), so the grid is 4 × 4 with 16 boxes. Two parents that differ at both genes give the well-known 9 : 3 : 3 : 1. The page handles up to four genes in a grid, and more by multiplying the chances for each gene.

**What is a test cross?**
You cross a plant that shows the dominant trait with a short (tt) plant. If any short offspring appear, the tall parent must have been Tt. The examples list on the page includes one.

**Does the square work for blood groups?**
Yes, with a change in how the alleles act. Choose ABO blood groups, where A and B are both shown together and O is recessive.
