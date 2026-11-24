---
title: "One locus for ToBRFV tolerance in tomato: how strong is the 1:2:1 evidence?"
summary: "A 2026 study mapped tolerance to tomato brown rugose fruit virus to chromosome 8 and backed it with three segregation tests. We recompute all three in fibub's Mendelian chi-square tool and ask what 128 plants can really rule out."
tools: [mendelian-chi-square, punnett-square, hardy-weinberg-tester]
updated: 2026-11-24
sources:
  - "Mariani, A., Marconi, G., Manilia, G., Gallo, C. A., Bocchini, M., Echenique, V., Schiappa, A. and Albertini, E. (2026), Identification of a Major-Effect Locus on Tomato Chromosome 8 Associated with Tolerance to Tomato Brown Rugose Fruit Virus (ToBRFV), Plants 15(22): 3632, doi:10.3390/plants15223632. Licence CC BY, checked on the MDPI article page, 2026-11-24. Values used here: 128 F2 plants phenotyped, 94 tolerant (73.4 %) and 34 susceptible (26.6 %) at 21 days after inoculation, with chi-square 0.167 and p = 0.683 against 3 : 1; 110 plants genotyped (18 excluded, 3 for an uncertain phenotype and 15 for DNA quality or quantity), 28 susceptible, 56 heterozygous and 26 homozygous for the LA1777 allele, chi-square 0.109 and p = 0.947 against 1 : 2 : 1, and 26 against 56 among tolerant plants, chi-square 0.098 and p = 0.755 against 1 : 2; 78 significant variants, all on chromosome 8, in a 3.40 Mb interval (SL4.0ch08:57,633,008-61,033,348); lead marker SL4.0ch08_58258671 with p = 8.20 × 10⁻¹⁴, effect 4.43 and standard error 0.59; genome-wide threshold p < 5 × 10⁻⁸; symptomatic plants 19.5 % at 7 days and 27.3 % at 14 days."
  - "Pearson's chi-square goodness-of-fit test (K. Pearson 1900) and the exact binomial and multinomial tests: standard statistics, run here with the Mendelian chi-square tool's own code. Critical values with 1 degree of freedom: 3.84 at the 5 % level; with 2 degrees of freedom: 5.99."
paper:
  title: "Identification of a Major-Effect Locus on Tomato Chromosome 8 Associated with Tolerance to Tomato Brown Rugose Fruit Virus (ToBRFV)"
  authors: "Mariani A, Marconi G, Manilia G, Gallo CA, Bocchini M, Echenique V, Schiappa A, Albertini E"
  journal: "Plants"
  year: 2026
  doi: "10.3390/plants15223632"
  url: "https://www.mdpi.com/2223-7747/15/22/3632"
  licence: "CC BY"
  reviewed: true
---

Tomato brown rugose fruit virus went from a new disease in 2014 to a worldwide greenhouse problem, and breeders need a source of resistance they can move into cultivated tomato. A 2026 paper in *Plants* reports one: a single major locus on chromosome 8, inherited from the wild relative *Solanum habrochaites* LA1777, found by phenotyping 128 F2 plants and genotyping 110 of them. The genetics case rests on three segregation tests, and all three are small enough to redo by hand. We recomputed every one with the [[mendelian-chi-square]], and then asked the question a p-value of 0.947 does not answer: what else would these counts have accepted? Work out the ratio a cross should give with the [[punnett-square]], and test allele frequencies in a breeding population with the [[hardy-weinberg-tester]].

## The paper in brief

The authors crossed a cultivated tomato with the wild *S. habrochaites* accession LA1777, inoculated the F2 generation with the virus, and scored symptoms at 7, 14 and 21 days. Symptoms appeared slowly: **19.5 % of plants were symptomatic at 7 days, 27.3 % at 14 days**, and by 21 days the split settled at **94 tolerant to 34 susceptible** out of 128.

They then genotyped 110 of those plants by sequencing (18 were dropped, 3 for an uncertain phenotype and 15 for poor DNA) and ran an association scan. **78 variants passed the genome-wide threshold, all of them on chromosome 8**, inside a 3.40 Mb interval, with the strongest marker at **p = 8.20 × 10⁻¹⁴** and an effect of 4.43 symptom units. The genotypes at that marker split **28 susceptible : 56 heterozygous : 26 homozygous for the LA1777 allele**, and tolerance tracked the presence of at least one LA1777 allele. The authors conclude one dominant major-effect locus, and they offer CAPS markers inside the interval for breeders.

## Checked with the tools

Every number in this section comes from the same code that runs the Mendelian chi-square page: the chi-square goodness-of-fit test, its per-class contributions, and the **exact** binomial or multinomial test that needs no large-sample approximation.

**Step 1: all three of the paper's tests reproduce exactly.**

| Test | Observed | Expected | χ² | df | p (chi-square) | p (exact) |
|---|---|---|---|---|---|---|
| Phenotypes at 21 days, 3 : 1 | 94 : 34 | 96 : 32 | **0.1667** | 1 | **0.6831** | 0.6834 |
| Genotypes of tolerant plants, 1 : 2 | 26 : 56 | 27.33 : 54.67 | **0.0976** | 1 | **0.7548** | 0.8154 |
| All three genotypes, 1 : 2 : 1 | 28 : 56 : 26 | 27.5 : 55 : 27.5 | **0.1091** | 2 | **0.9469** | 0.9679 |

The paper reports 0.167 / 0.683, 0.098 / 0.755 and 0.109 / 0.947. Those match to the last digit printed, and no class has an expected count under 5, so the chi-square p-values are trustworthy here. The exact tests agree and are, as usual, slightly more forgiving.

**Step 2: a high p-value is not strong evidence for a ratio.** This is the part worth spending time on. A chi-square test can only reject; it never confirms. So we took the same 94 : 34 split and tested it against other ratios a one-gene or two-gene story could produce:

| Rival ratio | Expected | χ² | p | Verdict at 5 % |
|---|---|---|---|---|
| 3 : 1 (one dominant gene) | 96 : 32 | 0.167 | 0.683 | accepted |
| 2 : 1 (one gene, one class lost) | 85.33 : 42.67 | 2.641 | **0.104** | also accepted |
| 13 : 3 | 104 : 24 | 5.128 | 0.024 | rejected |
| 5 : 1 | 106.67 : 21.33 | 9.025 | 0.0027 | rejected |
| 9 : 7 (two complementary genes) | 72 : 56 | 15.365 | 0.0001 | rejected |
| 1 : 1 (test cross) | 64 : 64 | 28.125 | < 0.0001 | rejected |

So 128 plants comfortably reject the two-gene and test-cross patterns, which is the real work the test does here, but they **cannot separate 3 : 1 from 2 : 1**. Turning it round, a 3 : 1 test on 128 plants accepts any count of tolerant plants from **87 to 105** (86 to 105 by the exact test), a window 19 plants wide. Figure 1 shows the whole curve.

<!-- fig:window -->
<!-- /fig:window -->

This is not a criticism of the paper: it reports the genotype test too, and that is the stronger piece of evidence, because a 1 : 2 : 1 split of actual marker genotypes rules out far more than a phenotype ratio can. It is a caution about reading a phenotype p-value of 0.68 as proof of a single dominant gene on its own.

**Step 3: could the 18 ungenotyped plants have changed the genotype test?** The 1 : 2 : 1 test used 110 of the 128 plants. We added the missing 18 back in every possible way, splitting them between two classes, and repeated the test (**our sensitivity check**, not something the paper does). The 1 : 2 : 1 ratio stays accepted at the 5 % level as long as **no more than 15 of the 18 were susceptible**; the worst case, with 16 or more susceptible, drops p to **0.016**. Since only about a quarter of the population was susceptible, a draw of 16 susceptible plants out of 18 is far-fetched, so the conclusion is robust to the exclusions.

<!-- fig:excluded -->
<!-- /fig:excluded -->

**Step 4: the two genotype tests are not independent.** The paper's 1 : 2 test among tolerant plants (26 : 56) is a slice of the same 110 plants as the 1 : 2 : 1 test, so its p-value of 0.755 is not extra evidence on top of 0.947. The useful way to read them is as a decomposition: the 1 : 2 : 1 test asks whether the three genotype classes come in Mendelian proportions, and the 1 : 2 test asks whether, among the plants that were tolerant, the two tolerant genotypes came in the 1 : 2 proportions dominance predicts. Each contributes a different piece. In the 1 : 2 : 1 test the biggest single contribution to χ² is the homozygous tolerant class, and even that is only 0.0818 of the total 0.1091.

| Check | Paper | Tool |
|---|---|---|
| 3 : 1 phenotype test | χ² 0.167, p 0.683 | χ² 0.1667, p 0.6831, exact 0.6834 |
| 1 : 2 among tolerant | χ² 0.098, p 0.755 | χ² 0.0976, p 0.7548, exact 0.8154 |
| 1 : 2 : 1 genotype test | χ² 0.109, p 0.947 | χ² 0.1091, p 0.9469, exact 0.9679 |
| Can 2 : 1 be ruled out? | not discussed | no: p = 0.104 on the same counts |
| Effect of the 18 exclusions | not discussed | verdict holds unless 16 or more were susceptible |

## How we made the graphs

Both figures and every number above come from `scripts/blog-figures/tobrfv-tolerance-tomato-chromosome-8-segregation-chi-square.mjs` in fibub's public code. It imports `chiGof` and `exactGof` from `src/lib/sci/mendel.ts`, the maths behind the [[mendelian-chi-square]] page.

- `chiGof(obs, ratio)` returns the expected counts, χ², the degrees of freedom, the p-value, each class's contribution and a flag when an expected count is under 5.
- `exactGof(obs, ratio)` adds up the probability of every outcome no more likely than the one observed: a binomial test for two classes, a full multinomial enumeration for three.
- Figure 1 sweeps the tolerant count from 74 to 124 out of 128 and runs both tests at each value. Figure 2 adds the 18 excluded plants back in all 19 possible splits between two genotype classes.
- All counts come from the paper's text. The rival ratios, the acceptance window and the 18-plant sensitivity check are **ours**; the paper does not report them.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/mendelian-chi-square.mjs`, which pins the test against SciPy and against an independent enumeration in Python:

- Nine crosses are checked against `scipy.stats.chisquare` to 10⁻¹⁰ on χ² and 10⁻⁸ on the p-value, including 290 : 102 : 95 : 33 against 9 : 3 : 3 : 1 (χ² 0.3008547008547009, p 0.9598676540654922) and 72 : 28 against 3 : 1 (χ² 0.48, p 0.4884223166225936).
- The exact tests are checked against `scipy.stats.binomtest` for two classes and a Python enumeration of every multinomial outcome for three or four, agreeing to 10⁻⁸; for example 22 : 51 : 27 against 1 : 2 : 1 gives an exact p of 0.7716075084304339.
- Expected counts, per-class contributions and the small-expected-count warning are checked on 70 : 10 against 15 : 1, and the exact test must refuse politely when there are too many possible outcomes.
- New with this article: 94 : 34 against 3 : 1 must give χ² 0.16666667 and p 0.68309 with an exact p of 0.68343; 28 : 56 : 26 against 1 : 2 : 1 must give χ² 0.10909091 and p 0.94692; and the same 94 : 34 against 2 : 1 must give p 0.10418, above 0.05.

## Check it yourself

On the [[mendelian-chi-square]] page:

1. Set *Expected ratio* to **3 : 1 (monohybrid, dominant)**, rename the *Class names (commas)* to **Tolerant, Susceptible**, and type *Observed counts* **94, 34**. Leave *Significance level* at **0.05** and tick the exact test.
2. You should see **χ² = 0.1667, df 1, p = 0.6831**, expected counts 96 and 32, a critical value of 3.84, and an exact binomial p of **0.6834**. The ratio fits.
3. Now choose **My own ratio** and type **2:1** in the *Ratio* box, keeping the same counts: **χ² = 2.641, p = 0.1042**. Still above 0.05, so these 128 plants cannot tell 3 : 1 from 2 : 1. Type **13:3** and p drops to **0.0235**, which is rejected.
4. Switch *Expected ratio* to **1 : 2 : 1 (monohybrid, incomplete dominance)**, set the class names to **Susceptible, Heterozygous, Homozygous tolerant** and the counts to **28, 56, 26**: **χ² = 0.1091, df 2, p = 0.9469**, with an exact multinomial p of **0.9679**. Look at the *Each class* table: the homozygous class carries 75 % of the (tiny) χ².
5. To repeat our sensitivity check, change the counts to **44, 66, 26** (16 of the 18 excluded plants assumed susceptible and 2 heterozygous): p falls to **0.0162** and the ratio is rejected. Try **32, 70, 26** instead and it is accepted again.

## What researchers can use it for

- **Reproduce a paper's segregation statistics** in under a minute, which is the quickest possible check that counts and conclusions match.
- **Test the rivals, not just the hypothesis**: type the other ratios a cross could give and see which ones the data actually exclude.
- **Decide how many plants to score**: the acceptance window of Figure 1 shows directly what a given population size can resolve, before the seed goes in the tray.
- **Check robustness to dropped samples**, as in Step 3, by adding the missing individuals back in the least favourable split.
- **Use the exact test when a class is rare**, for instance when a recessive class is expected fewer than five times, where the chi-square p-value is unreliable.

## The fine print

- We used only the counts printed in the paper's text; we did not refit the association scan or the CAPS markers.
- The 18-plant sensitivity check and the rival-ratio table are our own additions and are not claims about the paper.
- Tolerance here means fewer and milder symptoms, not immunity: the paper scores symptom severity, and a tolerant plant can still carry the virus.
- A high p-value never proves a ratio. It means the counts cannot tell that ratio from the truth, which is a weaker statement.
