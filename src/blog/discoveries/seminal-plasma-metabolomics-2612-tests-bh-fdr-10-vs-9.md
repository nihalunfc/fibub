---
title: "89 nominal metabolite hits, none after FDR: what noise gives"
summary: "A seminal plasma metabolomics study tested 2,612 metabolites in 10 against 9 men and found none after correction. We show that pure noise gives about 89 nominal hits."
tools: [metabolite-volcano-pca, randomisation-list, calibration-curve]
updated: 2026-11-24
sources:
  - "Xu J, Guo L, Xiong L, Li J, Wu P, Ma Y, Yang J, Du Y (2026), Exploratory seminal plasma metabolomics and independent HPLC-UV evaluation in men with impaired semen quality, Frontiers in Endocrinology 17, doi:10.3389/fendo.2026.1909718. Licence CC BY 4.0 (Crossref record, checked 2026-11-24; the publisher page text did not show a licence line); no update-to entry in Crossref. Values used here: discovery cohort of 10 men with impaired semen quality and 9 normozoospermic controls (untargeted LC-MS/MS); 2,612 putatively annotated metabolites tested; nominal screen of p < 0.05 with fold change at least 1.5 or at most 0.67 gave 89 metabolites (22 higher, 67 lower in the impaired group); no metabolite reached Benjamini-Hochberg q < 0.05; HPLC-UV cohort of 18 against 18, with 2-HMBA median 358 (controls) against 211 (impaired) ug/mL, p = 0.030, q = 0.060, post hoc AUC 0.713 (95 % CI 0.540 to 0.886) and cytidine p = 0.812, q = 0.812; discovery-cohort post hoc AUCs 0.900 (2-HMBA) and 0.889 (cytidine). The authors call the findings exploratory and not validated biomarkers. Group sizes and statistics only; no data table is reproduced here."
paper:
  title: "Exploratory seminal plasma metabolomics and independent HPLC-UV evaluation in men with impaired semen quality"
  authors: "Xu J, Guo L, Xiong L, Li J, Wu P, Ma Y, Yang J, Du Y"
  journal: "Frontiers in Endocrinology"
  year: 2026
  doi: "10.3389/fendo.2026.1909718"
  url: "https://www.frontiersin.org/articles/10.3389/fendo.2026.1909718/full"
  licence: "CC BY 4.0"
  reviewed: true
---

Untargeted metabolomics measures thousands of small molecules at once, which makes it easy to find something in a small study, and just as easy to find nothing real. A 2026 study in Frontiers in Endocrinology compared seminal plasma from 10 men with impaired semen quality and 9 controls across 2,612 annotated metabolites, found 89 that passed a nominal screen, and then reported that **none** survived a false-discovery-rate correction. The authors present it honestly as exploratory. This article puts numbers on why: with 10 against 9 samples, how many "hits" does a table with nothing in it give, and what does a real difference have to look like before the correction lets it through? The maths is in the [[metabolite-volcano-pca]] tool; for planning groups see [[randomisation-list]], and for the quantitative side of a measured peak, [[calibration-curve]].

## The paper in brief

In the discovery cohort the researchers ran **untargeted LC-MS/MS** on 10 men with impaired semen quality and 9 men with normal semen quality. They kept **2,612 putatively annotated metabolites** and screened for a fold change of at least 1.5 in either direction and a nominal p below 0.05. That gave **89 metabolites**, 22 higher and 67 lower in the impaired group. After Benjamini-Hochberg correction, **no single metabolite had q below 0.05**. Pathway analyses pointed to nucleotide and nucleoside processes as ideas to follow up.

An independent HPLC-UV cohort of 18 against 18 men measured two candidates. **2-HMBA** was lower in the impaired group (median 211 against 358 micrograms per millilitre), with p = 0.030 but q = 0.060 after correction, and an area under the curve (AUC) of 0.713. **Cytidine** showed no difference (p = 0.812, q = 0.812). The authors say plainly that these are hypothesis-generating signals, not biomarkers.

## Checked with the tools

All tables below are **made-up** (simulated by our script) and run through the same Welch t-tests and Benjamini-Hochberg correction as the [[metabolite-volcano-pca]] tool. Nothing here is the study's data, which we do not have.

**Step 1: the paper's two q-values, by hand.** With two tests, Benjamini-Hochberg multiplies the smaller p by 2 and the larger by 1 (then keeps the order). So p = 0.030 becomes **q = 0.060** and p = 0.812 stays **0.812**. The tool's correction gives exactly these, which matches the paper's two published q-values and tells us the HPLC-UV step corrected over just two metabolites, not over the whole table.

**Step 2: how many hits does noise give?** We built tables of 2,612 metabolites, 10 against 9 samples, where the groups do not differ at all, and let the noise (the standard deviation of log2 intensity) vary. Averaging 8 tables per point, the number passing the paper's screen rises with the noise and **reaches 89 at a log2 standard deviation of about 0.67**, which means individual readings typically differ from the metabolite's level by a factor of about 1.6. The ceiling is the 5 % of all tests that fall below p = 0.05 by chance: about 125 raw hits in our tables, against 131 expected.

<!-- fig:noise -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 265" role="img" aria-label="Made-up tables of 2,612 metabolites with no real group difference, 10 against 9 samples. The number passing a nominal screen of p below 0.05 and fold change of at least 1.5 either way rises with the noise and reaches 89 at a log2 standard deviation near 0.65, and flattens out near 125, about 5 percent of the tests." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Pure noise can give the paper's 89 hits</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Pure noise can give the paper's 89 hits</text><line x1="58" x2="546" y1="219" y2="219" style="stroke:var(--line)"/><text x="52" y="223" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="152.2" y2="152.2" style="stroke:var(--line)"/><text x="52" y="156.2" text-anchor="end" style="fill:var(--muted)">50</text><line x1="58" x2="546" y1="85.4" y2="85.4" style="stroke:var(--line)"/><text x="52" y="89.4" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="58" y1="219" y2="223" style="stroke:var(--muted)"/><text x="58" y="236" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="155.6" x2="155.6" y1="219" y2="223" style="stroke:var(--muted)"/><text x="155.6" y="236" text-anchor="middle" style="fill:var(--muted)">0.4</text><line x1="253.2" x2="253.2" y1="219" y2="223" style="stroke:var(--muted)"/><text x="253.2" y="236" text-anchor="middle" style="fill:var(--muted)">0.6</text><line x1="350.8" x2="350.8" y1="219" y2="223" style="stroke:var(--muted)"/><text x="350.8" y="236" text-anchor="middle" style="fill:var(--muted)">0.8</text><line x1="448.4" x2="448.4" y1="219" y2="223" style="stroke:var(--muted)"/><text x="448.4" y="236" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="546" x2="546" y1="219" y2="223" style="stroke:var(--muted)"/><text x="546" y="236" text-anchor="middle" style="fill:var(--muted)">1.2</text><line x1="58" x2="546" y1="219" y2="219" style="stroke:var(--muted)"/><text x="302" y="257" text-anchor="middle" style="fill:var(--ink)">Noise (SD of log2 intensity)</text><text transform="translate(14 125.5) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Metabolites passing the screen</text><line x1="58" x2="546" y1="100.1" y2="100.1" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="95.1" text-anchor="end" style="fill:var(--muted)">paper: 89 hits</text><line x1="58" x2="546" y1="44.6" y2="44.6" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="39.6" text-anchor="end" style="fill:var(--muted)">5 % of 2,612 = 131</text><path d="M58 219L106.8 219L155.6 212.6L204.4 180.5L253.2 127.5L302 90.2L350.8 70.6L399.6 59.2L448.4 55.2L546 53.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="257" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Hits from a table with nothing in it. The curve is the average of 8 made-up tables per point; the paper's 89 sits on it at a plausible noise level, and the ceiling is 5 % of the tests.</figcaption></figure>
<!-- /fig:noise -->

So the paper's 89 nominal hits are **exactly what a null table gives** at ordinary biological noise. In our noise-only tables the smallest corrected q averages **0.65**, and none of the 8 tables had any metabolite below 0.05. That agrees with the paper's finding of no survivors, and it is a measure of how little the nominal screen alone tells us.

**Step 3: what could have survived?** With 2,612 tests, one test must reach p below about **1.9 x 10^-5** (0.05 divided by 2,612) to be sure of q below 0.05 on its own. To see what that asks of the data, we hid **100 real differences** among the 2,612 tests at the same noise, and counted how many pass.

| True fold change (log2 / factor) | Real differences found at raw p < 0.05 | Found at q < 0.05 |
|---|---|---|
| 0.5 (1.4x) | 34 % | 0 % |
| 1.0 (2x) | 86 % | 14 % |
| 1.5 (2.8x) | 99.6 % | 82 % |
| 2.0 (4x) | 100 % | 99 % |

<!-- fig:power -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 283" role="img" aria-label="With the same noise, a hundred metabolites truly raised by a given fold change are hidden among 2,612 tests. Raw p below 0.05 finds most of them at a log2 fold change of 1 (a factor of 2), while the false-discovery-rate filter finds 14 percent at 1, 82 percent at 1.5 (a factor of 2.8) and nearly all at 2 (a factor of 4)." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>What 10 against 9 can find among 2,612 tests</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">What 10 against 9 can find among 2,612 tests</text><line x1="58" x2="546" y1="237" y2="237" style="stroke:var(--line)"/><text x="52" y="241" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="199.6" y2="199.6" style="stroke:var(--line)"/><text x="52" y="203.6" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="162.2" y2="162.2" style="stroke:var(--line)"/><text x="52" y="166.2" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="124.8" y2="124.8" style="stroke:var(--line)"/><text x="52" y="128.8" text-anchor="end" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="87.4" y2="87.4" style="stroke:var(--line)"/><text x="52" y="91.4" text-anchor="end" style="fill:var(--muted)">0.8</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="58" y1="237" y2="241" style="stroke:var(--muted)"/><text x="58" y="254" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="155.6" x2="155.6" y1="237" y2="241" style="stroke:var(--muted)"/><text x="155.6" y="254" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="253.2" x2="253.2" y1="237" y2="241" style="stroke:var(--muted)"/><text x="253.2" y="254" text-anchor="middle" style="fill:var(--muted)">1.5</text><line x1="350.8" x2="350.8" y1="237" y2="241" style="stroke:var(--muted)"/><text x="350.8" y="254" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="448.4" x2="448.4" y1="237" y2="241" style="stroke:var(--muted)"/><text x="448.4" y="254" text-anchor="middle" style="fill:var(--muted)">2.5</text><line x1="546" x2="546" y1="237" y2="241" style="stroke:var(--muted)"/><text x="546" y="254" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="58" x2="546" y1="237" y2="237" style="stroke:var(--muted)"/><text x="302" y="275" text-anchor="middle" style="fill:var(--ink)">True fold change (log2)</text><text transform="translate(14 143.5) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Share of 100 real differences found</text><path d="M58 174.2L155.6 75.4L253.2 50.7L350.8 50L448.4 50L546 50" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 237L155.6 210.4L253.2 82.9L350.8 51.5L448.4 50L546 50" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">raw p &lt; 0.05</text><line x1="170.4" x2="182.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="186.4" y="40" style="fill:var(--muted)">FDR q &lt; 0.05</text><text class="fibub-mark" x="546" y="275" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. How large a real difference must be to survive the correction with 10 against 9 samples and 2,612 tests, in made-up tables with 100 real differences hidden.</figcaption></figure>
<!-- /fig:power -->

With 10 against 9 and this noise, a metabolite must be about **2.8 times higher or lower** to be found reliably after correction, and a doubling is found only one time in seven. Smaller shifts, which are the usual size in a human biofluid, cannot pass, however real they are. The "no survivors" result is therefore not evidence of no differences; it is evidence the study was small.

**Step 4: the HPLC-UV step, and what AUC says.** The 2-HMBA result of AUC 0.713 in 18 against 18 corresponds to a Mann-Whitney p of about **0.029** by the normal approximation (our arithmetic), matching the paper's 0.030. The discovery-cohort AUCs of 0.900 and 0.889 in 10 against 9 correspond to p of about 0.003 and 0.004: striking for one metabolite, but far above the 1.9 x 10^-5 needed across 2,612 tests, which is how a high AUC and a q above 0.05 can sit together.

| Check | Paper says | Tool or our arithmetic gives |
|---|---|---|
| BH of p = 0.030 and 0.812 | q = 0.060 and 0.812 | 0.060 and 0.812 |
| Nominal hits in 2,612 tests | 89 | 89 from pure noise at log2 SD 0.67 |
| Raw p < 0.05 by chance | not stated | about 125 (131 expected) |
| Smallest p for q < 0.05 | not stated | 1.9 x 10^-5 |
| p from AUC 0.713, 18 against 18 | 0.030 | about 0.029 |

## How we made the graphs

The charts and numbers come from `scripts/blog-figures/seminal-plasma-metabolomics-2612-tests-bh-fdr-10-vs-9.mjs` in fibub's public code. It calls `compare` (which runs `welch` on log2 values and then `bh`) from `src/lib/sci/mbvolcano.ts`, the maths behind the [[metabolite-volcano-pca]] tool, and `normCdf` from `src/lib/sci/distributions.ts` for the AUC arithmetic. From the paper: the group sizes 10 and 9, the 2,612 tests, the fold change cut 1.5, the 89 hits, the two HPLC-UV p and q values and the AUCs. **Ours:** the table model (a log2 mean for each metabolite around 10 with a spread of 3, plus independent noise), the noise levels, the 100 hidden real differences, and every random seed. The tables are **simulated**.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/metabolite-volcano-pca.mjs`, which pins the table reader, the missing-value rules, the Benjamini-Hochberg step-up, Welch's test and the PCA against NumPy and pandas. New with this article, it also checks that p = 0.030 and 0.812 give q = 0.060 and 0.812, and that our seed-1 null table of 2,612 metabolites (10 against 9) keeps giving 160 raw p below 0.05, 115 passing the paper's screen and a smallest q of 0.585.

## Check it yourself

On the [[metabolite-volcano-pca]] page, with the built-in example (12 metabolites, 4 against 4):

1. Leave the example table in the box and set *Significant when* to **raw p**, *is below* **0.05** and *and fold change at least (x)* **1**: six metabolites pass.
2. Switch *Significant when* to **FDR q (Benjamini-Hochberg)**: still six, because with only 12 tests the correction is mild. Citrate shows p of about **0.0167** and q of about **0.033**, which is p times 12 over its rank of 6.
3. Set *and fold change at least (x)* to **2**: five remain, since Citrate's fold change is 0.80.
4. Now think of 2,612 rows instead of 12: the same correction would multiply the p-values by up to 2,612 over their rank, which is why 10 against 9 samples cannot pass.

## What researchers can use it for

- **Judge a small omics study before you run it.** Decide the smallest fold change you care about, then use a simulation like ours to see if your group size can find it after correction.
- **Report both numbers.** Give the nominal count and the corrected count, as this paper does, so readers see how much of the list is chance.
- **Audit a published table.** The tool recomputes q from p (it must be p times the number of tests over the rank, then made monotone) so a reported q that does not follow from the stated number of tests is easy to spot.
- **Choose between a screen and a test.** If a list of nominal hits is only for generating ideas, say so, as the authors did; confirm with an independent method in a second cohort.
- **Teach multiple testing** with a table of random numbers that still gives "significant" lists.

## The fine print

- Our tables are **simulated** with a lognormal model and independent metabolites. Real metabolites are correlated, which changes the spread of the number of chance hits but not the average.
- The noise level of 0.67 (log2) is **our assumption**, tuned so that noise alone gives the paper's 89 nominal hits. It shows that 89 is plausible under no differences, not that there were none.
- The paper's analyses (including its pathway work and the choice of which p-values were corrected) may differ in detail from the plain Welch and Benjamini-Hochberg steps we used.
- The AUC-to-p step uses the normal approximation to the Mann-Whitney test with no ties; the paper's own p-values come from its own software.
- This article is about statistics. It is not medical advice or a statement about male fertility.
