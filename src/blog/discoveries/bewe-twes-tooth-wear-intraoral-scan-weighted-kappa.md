---
title: "Tooth wear scoring on intraoral scans: what weighted kappa shows about BEWE and TWES 2.0"
summary: "Two examiners scored tooth wear on 246 intraoral scans with good agreement. We show with fibub's reliability tool how the weighting choice, rater bias and sample size move kappa."
tools: [reliability-analysis, sample-size, bland-altman]
updated: 2026-11-16
sources:
  - "Lorens, M. and Tomaszewska, I. (2026), A reliability assessment of the basic erosive wear examination and the tooth wear evaluation system 2.0 utilizing intraoral scan data, PLOS ONE 21(6): e0351330, doi:10.1371/journal.pone.0351330. Licence CC BY 4.0, checked on the journal page, 2026-11-16. Values used here, from the Methods and Results: 246 scans, two examiners; BEWE scores 0 to 3 per sextant, TWES 2.0 grades 0 to 4; weighted kappa for BEWE 0.760 to 0.851 across sextants, 0.841 overall and 0.868 for the total score; for TWES 2.0 0.543 to 0.761, 0.715 overall; weighting scheme not stated; one examiner generally scored higher; sample size planned against kappa0 = 0.40 with 80, 90 and 95% power, BEWE required N = 49 to 75."
  - "Cohen, J. (1960), Educational and Psychological Measurement 20: 37 (kappa); Cohen, J. (1968), Psychological Bulletin 70: 213 (weighted kappa); Fleiss, J. L., Cohen, J. and Everitt, B. S. (1969), Psychological Bulletin 72: 323 (standard error); Landis, J. R. and Koch, G. G. (1977), Biometrics 33: 159 (bands)."
  - "BEWE: Bartlett, D. W., Ganss, C. and Lussi, A. (2008), Clinical Oral Investigations 12 (Suppl 1): S65 (background only)."
paper:
  title: "A reliability assessment of the basic erosive wear examination and the tooth wear evaluation system 2.0 utilizing intraoral scan data"
  authors: "Lorens M, Tomaszewska I"
  journal: "PLOS ONE"
  year: 2026
  doi: "10.1371/journal.pone.0351330"
  url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0351330"
  licence: "CC BY 4.0"
  reviewed: true
---

Dentists grade tooth wear by eye, and two dentists do not always give the same grade. If scoring is moved from the mouth to a 3D intraoral scan, the scan can be stored and scored again later, but only if the grades are reliable. A new study had two examiners grade 246 scans with two common systems, BEWE and TWES 2.0, and measured their agreement with **weighted kappa**. This article shows how the [[reliability-analysis]] tool works out kappa from an agreement table, and how three choices that papers rarely spell out move the answer. The [[sample-size]] calculator helps plan the number of subjects, and the [[bland-altman]] tool is the right one when the two measures are numbers rather than grades.

## The paper in brief

The **Basic Erosive Wear Examination (BEWE)** gives each sixth of the mouth (a **sextant**) a score from 0 (no wear) to 3 (wear over half the surface). **TWES 2.0** is a newer system with grades 0 to 4. Two experienced examiners scored 246 adult scans independently.

For BEWE, weighted kappa ran from **0.760 to 0.851** across sextants, 0.841 overall. For TWES 2.0 it was lower, **0.543 to 0.761**, 0.715 overall. On the usual scales, BEWE agreement is good to very good, TWES 2.0 moderate to good. One examiner tended to score higher than the other. The authors planned the study to show agreement clearly above a kappa of 0.40, which needed 49 to 75 sextants for BEWE; they had about 240 per sextant.

## Checked with the tools

The paper's agreement tables are images we did not reuse, and it does not say which weights it used. So we built a **simulated** agreement table for one BEWE sextant with 246 scans (our own numbers, shaped like a typical result: most sextants score 0 or 1, rater 1 a little higher), and ran it through the Reliability analysis tool's maths.

**Step 1: what kappa measures.** The two simulated raters give the same grade on **81.3%** of sextants. But with most sextants at 0 or 1, they would agree on **32.0%** by chance alone. Kappa is the share of the remaining room they actually use: (0.813 − 0.320) ÷ (1 − 0.320) = **0.725**, 95% interval 0.653 to 0.797.

**Step 2: the weighting choice.** BEWE grades are ordered, so a 1 against a 2 is a smaller miss than a 0 against a 3. **Weighted kappa** gives partial credit for near misses. On the same table, **linear** weights give **0.791** and **quadratic** weights **0.860**. The paper's BEWE range, 0.760 to 0.851, sits between them. Without the weighting stated, a reader cannot tell which part of that spread is the raters and which is the formula. Quadratic weights give the most credit for near misses and usually the highest value.

**Step 3: a rater who scores higher.** We moved a growing share of the agreed grades one step up for rater 1 (Figure 1). At 10%, unweighted kappa falls from 0.725 to **0.615**, linear to 0.715, quadratic to 0.816. A steady bias costs unweighted kappa most. Kappa does not tell you *which* rater is higher; look at the table above and below the diagonal, as the paper did with a Wilcoxon test. In our table, rater 1 is higher on 29 sextants and lower on 17.

<!-- fig:weights -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="On one simulated table, unweighted kappa is 0.725, linear 0.791 and quadratic 0.860; all three fall as one rater drifts upwards." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Three kappas for the same simulated sextant</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Three kappas for the same simulated sextant</text><line x1="58" x2="546" y1="235" y2="235" style="stroke:var(--line)"/><text x="52" y="239" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="161" y2="161" style="stroke:var(--line)"/><text x="52" y="165" text-anchor="end" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="87" y2="87" style="stroke:var(--line)"/><text x="52" y="91" text-anchor="end" style="fill:var(--muted)">0.8</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">0%</text><line x1="180" x2="180" y1="272" y2="276" style="stroke:var(--muted)"/><text x="180" y="289" text-anchor="middle" style="fill:var(--muted)">10%</text><line x1="302" x2="302" y1="272" y2="276" style="stroke:var(--muted)"/><text x="302" y="289" text-anchor="middle" style="fill:var(--muted)">20%</text><line x1="424" x2="424" y1="272" y2="276" style="stroke:var(--muted)"/><text x="424" y="289" text-anchor="middle" style="fill:var(--muted)">30%</text><line x1="546" x2="546" y1="272" y2="276" style="stroke:var(--muted)"/><text x="546" y="289" text-anchor="middle" style="fill:var(--muted)">40%</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Share of agreed scores rater 1 marks one grade higher</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Kappa</text><line x1="58" x2="546" y1="68.1" y2="68.1" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="63.099999999999994" text-anchor="end" style="fill:var(--muted)">paper range 0.760 to 0.851</text><line x1="58" x2="546" y1="101.8" y2="101.8" style="stroke:var(--muted);stroke-dasharray:4 4"/><path d="M58 64.7L82.4 68L106.8 71.6L131.2 74.3L155.6 77.8L180 80.9L204.4 84L228.8 87.3L253.2 89.9L277.6 93.2L302 96L326.4 98.8L350.8 101.9L375.2 104.4L399.6 107.4L424 110L448.4 112.5L472.8 115.5L497.2 117.8L521.6 120.7L546 123" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 90.3L82.4 96.2L106.8 102.3L131.2 106.8L155.6 112.8L180 118.5L204.4 124L228.8 129.9L253.2 134.2L277.6 140L302 145.3L326.4 150.6L350.8 156.3L375.2 160.4L399.6 166L424 171.1L448.4 176.1L472.8 181.5L497.2 185.5L521.6 190.9L546 195.7" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 114.8L82.4 123.3L106.8 132L131.2 138.4L155.6 146.9L180 155.3L204.4 163.6L228.8 172.1L253.2 178.4L277.6 186.8L302 195L326.4 203.1L350.8 211.5L375.2 217.5L399.6 225.9L424 233.8L448.4 241.8L472.8 250L497.2 255.9L521.6 264.1L546 271.9" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Quadratic weights</text><line x1="206.4" x2="218.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="222.4" y="40" style="fill:var(--muted)">Linear weights</text><line x1="333.2" x2="345.2" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="349.2" y="40" style="fill:var(--muted)">Unweighted</text></svg><figcaption>Figure 1. Unweighted, linear and quadratic kappa from the Reliability analysis tool's maths for one simulated 246-sextant BEWE table, as one rater increasingly scores one grade higher. Simulated, not the paper's tables.</figcaption></figure>
<!-- /fig:weights -->

**Step 4: how sure is a kappa from 60 sextants?** We drew 2,000 simulated studies from the same table (Figure 2). With **60 sextants**, unweighted kappa varies with a standard deviation of **0.075**; with **246**, **0.036**. Both sizes almost always show agreement above 0.40 (97% and 100% of studies had their 95% interval above it), in line with the paper's planning. But to tell 0.76 from 0.85, the bigger sample is needed.

<!-- fig:spread -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="In 2000 simulated studies, unweighted kappa has a standard deviation of 0.075 with 60 sextants and 0.036 with 246." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Spread of unweighted kappa in repeated studies (simulated)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Spread of unweighted kappa in repeated studies (simulated)</text><line x1="58" x2="546" y1="260.1" y2="260.1" style="stroke:var(--line)"/><text x="52" y="264.1" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="212" y2="212" style="stroke:var(--line)"/><text x="52" y="216" text-anchor="end" style="fill:var(--muted)">2.5</text><line x1="58" x2="546" y1="163.9" y2="163.9" style="stroke:var(--line)"/><text x="52" y="167.9" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="115.8" y2="115.8" style="stroke:var(--line)"/><text x="52" y="119.8" text-anchor="end" style="fill:var(--muted)">7.5</text><line x1="58" x2="546" y1="67.7" y2="67.7" style="stroke:var(--line)"/><text x="52" y="71.7" text-anchor="end" style="fill:var(--muted)">10</text><line x1="109.9" x2="109.9" y1="272" y2="276" style="stroke:var(--muted)"/><text x="109.9" y="289" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="213.7" x2="213.7" y1="272" y2="276" style="stroke:var(--muted)"/><text x="213.7" y="289" text-anchor="middle" style="fill:var(--muted)">0.6</text><line x1="317.6" x2="317.6" y1="272" y2="276" style="stroke:var(--muted)"/><text x="317.6" y="289" text-anchor="middle" style="fill:var(--muted)">0.7</text><line x1="421.4" x2="421.4" y1="272" y2="276" style="stroke:var(--muted)"/><text x="421.4" y="289" text-anchor="middle" style="fill:var(--muted)">0.8</text><line x1="525.2" x2="525.2" y1="272" y2="276" style="stroke:var(--muted)"/><text x="525.2" y="289" text-anchor="middle" style="fill:var(--muted)">0.9</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Kappa</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Density</text><line x1="343.4" x2="343.4" y1="50" y2="272" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="339.4" y="62" text-anchor="end" style="fill:var(--muted)">true 0.725</text><path d="M65.8 260.1L81.4 260.1L96.9 260.1L112.5 260.1L128.1 260.1L143.7 260.1L159.2 260.1L174.8 260.1L190.4 258.8L206 260.1L221.5 258.8L237.1 256.8L252.7 247.2L268.3 227.4L283.8 189.5L299.4 153.7L315 88.3L330.6 61.9L346.1 63.2L361.7 71.5L377.3 115.8L392.9 179.3L408.4 213.9L424 242.2L439.6 253.8L455.1 258.2L470.7 258.8L486.3 260.1L501.9 260.1L517.4 260.1L533 260.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M65.8 259.5L81.4 258.8L96.9 259.5L112.5 258.2L128.1 257.6L143.7 256.8L159.2 253.8L174.8 246.1L190.4 245.3L206 236.4L221.5 233.2L237.1 219.7L252.7 211.4L268.3 187L283.8 177.4L299.4 170.2L315 178.7L330.6 151.8L346.1 153.7L361.7 177.4L377.3 151.8L392.9 179.3L408.4 190.3L424 196.6L439.6 227.4L455.1 212L470.7 231.2L486.3 246.6L501.9 246.6L517.4 254.9L533 255.7" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">246 sextants</text><line x1="170.4" x2="182.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="186.4" y="40" style="fill:var(--muted)">60 sextants</text></svg><figcaption>Figure 2. Unweighted kappa in 2000 simulated studies of 60 and of 246 sextants drawn from the same simulated table, worked out with the Reliability analysis tool's maths. Simulated.</figcaption></figure>
<!-- /fig:spread -->

| Check | Paper | Tool result (simulated table) |
|---|---|---|
| BEWE agreement, one sextant | weighted κ 0.760 to 0.851 | 0.725 unweighted, 0.791 linear, 0.860 quadratic |
| Effect of one rater scoring higher | rater 1 generally higher | 10% upward shift: κ 0.725 → 0.615 |
| Precision with 60 vs 246 sextants | planned N 49 to 75 | SD of κ 0.075 vs 0.036 |
| Agreement above κ = 0.40 | yes, all sextants | 97% of 60-sextant studies, all 246-sextant ones |

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/bewe-twes-tooth-wear-intraoral-scan-weighted-kappa.mjs` in fibub's public code. It calls `cohen` from `src/lib/sci/reliability.ts`, the function behind the *Two raters* mode of the [[reliability-analysis]] tool. It works out observed and chance agreement, kappa with no weights or with linear or quadratic weights, and the large-sample standard error for unweighted kappa.

From the paper: 246 scans, the 0 to 3 BEWE scale, the reported kappa range, the fact that one rater scored higher, and the planning value of 0.40. Our assumptions, labelled in the script: the 4 × 4 agreement table, the way the upward bias is added, and the 2,000 random studies drawn from the table.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks the reliability maths:

- A 2 × 2 table of 20, 5, 10 and 15 must give Cohen's kappa of exactly **0.4** (observed 70%, chance 50%).
- Perfect agreement on three ordered categories must give quadratic weighted kappa of exactly **1**.
- The same file pins Cronbach's alpha, Fleiss' kappa and the intraclass correlations against published worked examples.

## Check it yourself

On the [[reliability-analysis]] tool:

1. Press **Two raters**. Leave *My data is* on **A table of counts**.
2. In the box under *Counts: rows are rater 1's categories, columns rater 2's*, replace the example with the four rows below (BEWE grades 0 to 3 in order).
3. With *Weights* on **None (categories)** it reads **κ = 0.725**, *95 % interval* 0.653 to 0.797, *Observed agreement* 81.3 %, *Expected by chance* 32.0 %.
4. Switch *Weights* to **Linear (ordered)**: **κ = 0.791**. Then **Quadratic (ordered)**: **κ = 0.860**.

```
70	8	1	0
14	80	6	0
1	10	40	2
0	0	4	10
```

## What researchers can use it for

- **Report agreement fully:** give the table, the weights used and the observed agreement alongside kappa, all of which the [[reliability-analysis]] tool shows at once.
- **Compare studies fairly:** recompute kappa with the same weights before comparing a new scoring system with an old one.
- **Spot a biased rater:** read the counts above and below the diagonal, not only the kappa.
- **Plan a reliability study:** simulate the spread of kappa at a few sample sizes, or use the [[sample-size]] calculator for simpler designs.
- **Use the right tool for numbers:** for continuous measures, such as wear depth in micrometres, use [[bland-altman]] limits of agreement instead of kappa.

## The fine print

- The kappa ranges, sample size and design come from the paper. Our agreement table is **simulated** and does not reproduce any of the paper's sextants.
- The paper does not say whether its weights were linear or quadratic, so we cannot say which of our values matches its method.
- The tool gives an interval for unweighted kappa only; for weighted kappa, a bootstrap (as in Figure 2) gives one.
- This is about the statistics of the scoring, not dental advice.
