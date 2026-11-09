---
name: Mendel's pea garden
num: 1124
shelf: learn
section: school-biology
title: "Mendel's pea garden: monohybrid and dihybrid crosses with random offspring, 3:1 and 9:3:3:1"
summary: "Cross tall and short pea plants, or round yellow and wrinkled green seeds, and grow 20, 100 or 1000 random children. Compare the counts with 3 : 1 and 9 : 3 : 3 : 1, see the Punnett square, and at Class 12 level add incomplete dominance, codominance (ABO) and a chi-square check."
status: live
ads: false
order: 1124
icon: table
works: offline
updated: 2026-11-09
related: [punnett-square, mendelian-chi-square, cell-explorer, hardy-weinberg-tester]
sources:
  - "Mendel's laws of segregation and independent assortment, incomplete dominance and ABO codominance are standard genetics; the crosses are written by fibub and checked in the tests against a brute-force Python enumeration with exact fractions."
  - "Chi-square p-values use the regularised incomplete gamma function, checked against standard critical values (3.841 for 1 degree of freedom, 7.815 for 3) and Mendel's own published seed counts as a worked case."
  - "Allele letters and trait names (tall/short, round/wrinkled, yellow/green peas, red/white snapdragons) are general textbook knowledge. Drawings are fibub's own. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: pencil, label: "Parents" }
  - { icon: target, label: "Grow" }
  - { icon: table, label: "Count" }
  - { icon: sigma, label: "Check" }
---

## What it does

Gregor Mendel crossed pea plants and counted their children, and found that traits are passed on as pairs of "factors" (we now call them **alleles** of a **gene**). This garden lets you repeat his experiments in seconds:

- **Height (one gene, a monohybrid cross)**: T for tall is dominant over t for short.
- **Seeds (two genes, a dihybrid cross)**: R round over r wrinkled, and Y yellow over y green.
- At **Class 12** level, two more: **snapdragon flowers**, where neither allele is dominant (red × white gives pink), and **ABO blood groups**, where A and B are both seen together (codominance) and O is recessive.

Pick two parents, choose how many children to grow, and the page draws them, counts each kind, and shows the ratio you would expect. Each child gets one allele from each parent at random, so your counts wobble around the expected ratio, just as Mendel's did. It fits **Class 10 Science: heredity** (Mendel's experiments, dominant and recessive traits, monohybrid and dihybrid crosses) and **Class 12 Biology: principles of inheritance and variation** (incomplete dominance, codominance, multiple alleles and testing ratios). Draw any cross up to four genes with [[punnett-square]], test your own counts with [[mendelian-chi-square]], see where the genes sit in the [[cell-explorer]], and follow alleles in a whole population with [[hardy-weinberg-tester]].

## How to use it

1. **Pick the level and the cross.**
2. **Pick the parents** from the lists, or tap a quick cross: *pure × pure* (the P generation), *F1 × F1* (to get the F2), or a *test cross* with the recessive parent.
3. **Pick how many children** (20, 100 or 1000). **Grow again** makes a fresh random batch.
4. **Read the counts.** The table shows each look (phenotype), how many you got, the expected chance and the expected count. The line below gives the expected genotypes.
5. **Punnett square**: the parents' gametes and every equally likely child.
6. **Class 12: chi-square check.** χ² = Σ (O − E)² ÷ E with your counts filled in, the degrees of freedom and the p-value. If p is 0.05 or more, your counts fit the expected ratio.
7. **Check yourself** gives fresh questions each time. Type fractions like 1/4 or decimals.

## Worked example

Tap *Pure tall × pure short* (TT × tt): every child is **Tt** and tall. Now tap **F1 × F1** (Tt × Tt). The Punnett square shows TT, Tt, Tt and tt, so the expected ratio is **3 tall : 1 short**, and with 100 children you expect 75 and 25. A typical run gives something like 77 : 23. At Class 12 level the page works out χ² = (77 − 75)² ÷ 75 + (23 − 25)² ÷ 25 = 0.053 + 0.160 = **0.213** with 1 degree of freedom, p = 0.644: a good fit. For seeds, *F1 × F1* (RrYy × RrYy) gives the famous **9 : 3 : 3 : 1**.

## Tips

- Small numbers mislead. With 20 children, 3 : 1 often looks like 2 : 1 or 4 : 1. Grow 1000 to see the ratio settle.
- A p-value below 0.05 happens about 1 time in 20 even when the ratio is right. Grow again before you decide.
- A test cross with tt shows what a tall plant hides: if any child is short, the tall parent was Tt.

## FAQ

**Why does F1 show only one parent's trait?** The dominant allele hides the recessive one in Tt. The recessive trait comes back in the F2 when a child gets t from both parents.

**Why are pink snapdragons 1 : 2 : 1, not 3 : 1?** With incomplete dominance the heterozygote looks different, so each genotype has its own look.

**Is this real data?** No, the children are made by the computer from the rules. Use it to see how chance and ratios work.
