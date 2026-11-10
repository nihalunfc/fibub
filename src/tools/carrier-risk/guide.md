---
name: Carrier risk
num: 500
shelf: science
code: T351
section: genetic-counselling
title: "Carrier risk"
summary: "Work out the chance that a relative is a carrier of an autosomal recessive or X-linked recessive condition, from her place in the family, her unaffected sons and a negative carrier test with its detection rate. Exact fractions, the prior, conditional, joint and posterior table step by step, and the risk for her children."
status: live
ads: false
order: 40
icon: calculator
works: offline
updated: 2026-11-09
related: [sequence-tools, vcf-viewer, sequence-alignment, sample-size, dental-chart, hardy-weinberg-tester, punnett-square, pedigree-drawing-tool, allele-frequency-calculator, diagnostic-test-calculator]
sources:
  - "Method: Bayes' theorem as used in genetic counselling: Young ID (2007) Introduction to Risk Calculation in Genetic Counselling, 3rd ed., Oxford University Press; Harper PS (2020) Practical Genetic Counselling, 8th ed., CRC Press; Nussbaum RL, McInnes RR, Willard HF, Thompson & Thompson Genetics in Medicine (Bayesian analysis chapter)."
  - "Prior of 2/3 for the mother of an isolated case of a lethal X-linked condition: Haldane JBS (1935) The rate of spontaneous mutation of a human gene, J Genet 31:317."
  - "Code written by fibub with exact fractions; checked against Python's fractions module on the textbook examples and 50 random cases. The 1/25 partner frequency and 90 % detection rate are rounded, made-up examples."
flow:
  - { icon: pointer, label: "Family" }
  - { icon: sliders, label: "Evidence" }
  - { icon: table, label: "Bayes table" }
  - { icon: percent, label: "Risk" }
---

## What it does

A woman whose brother has Duchenne muscular dystrophy wants to know her chance of being a carrier. Her family position gives a starting chance (the **prior**). Facts that are more likely if she is not a carrier, such as having several unaffected sons or a negative carrier test, lower it. Bayes' theorem combines them: for each possibility (carrier or not) multiply the prior by the chance of the observed facts (the **conditional** probabilities) to get the **joint** probability, then divide each joint by their sum to get the **posterior**. This tool does that in exact fractions and shows every row, so you can follow it or check your own working.

For study and teaching, not medical advice. Check with a qualified professional such as a genetic counsellor.

To look for the variant in a sequencing file, use the [[vcf-viewer]]; to check a stretch of sequence by hand, the [[sequence-tools|DNA sequence tools]].

## How to use it

1. Choose the **pattern**: X-linked recessive or autosomal recessive.
2. Choose the consultand's **position in the family**. The prior fills in (for example 1/2 for the daughter of a known carrier, 2/3 for the mother of an isolated affected son, 2/3 for an unaffected sibling of someone with an autosomal recessive condition). You can type your own prior; the position then shows "My own prior".
3. For X-linked conditions, type her number of **unaffected sons**. Each son of a carrier escapes with probability 1/2, so n unaffected sons have probability (1/2)ⁿ if she is a carrier and 1 if she is not.
4. Tick **negative carrier test** and type the test's **detection rate** (the share of carriers it finds). A carrier tests negative with probability 1 − detection rate; a non-carrier always tests negative.
5. For an isolated case, choose **Her mother and her (two generations)**. The mother's own prior, her other unaffected sons and test, and the daughter's sons and test all count together in one table with three columns.
6. For autosomal recessive conditions, describe the **partner** (population carrier frequency, known carrier, or your own prior, with an optional negative test) to get the risk for each child.
7. Download the table and steps as an image, PDF or Word file.

## Worked example

The page opens with the classic textbook case: a woman whose mother is a known carrier, so her prior is 1/2, and who has 3 unaffected sons. Conditional on being a carrier, 3 unaffected sons have probability 1/8; if she is not, 1. Joint: 1/2 × 1/8 = 1/16 against 1/2 × 1 = 1/2. Posterior: (1/16) ÷ (1/16 + 1/2) = **1/9 (11.1 %)**. Her risk of an affected son is 1/18.

For an isolated case, choose two generations: the mother's prior is 2/3 and the consultand has 2 unaffected sons. The joints are 1/12 (both carriers), 1/3 (mother only) and 1/3 (neither), so the consultand's risk is 1/9 and her mother's is 5/9.

For autosomal recessive, an unaffected sibling (2/3) with a negative test at 90 % detection has 1/6; a partner at 1/25 with a negative test has 1/241, and each child's risk is 1/6 × 1/241 × 1/4 = 1/5,784.

## Tips

- Use only facts that are independent. Do not count the affected son that makes a mother an obligate carrier as evidence again.
- The two-generation model ignores a new variant arising in the consultand herself, and germline mosaicism, as most textbook examples do.
- Carrier frequencies and detection rates differ by condition, test and ancestry. The 1/25 and 90 % shown are rounded examples: type the figures for your case.

## FAQ

**Why fractions?** Textbook answers are fractions, and exact arithmetic avoids rounding. The percentage is shown beside each one.

**Why does my obligate carrier with a negative test give an error?** With a 100 % detection rate, a carrier cannot test negative, so the facts contradict each other. Check the prior or the detection rate.

**Is anything sent anywhere?** No. Everything is worked out in your browser.
