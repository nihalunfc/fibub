---
title: "A peer-led testing trial's 2 × 2 tables, rebuilt and re-tested"
summary: "A pilot randomised trial reports chi-square and Cramer's V for three yes-or-no outcomes. We rebuild all three tables from its counts, match every statistic, and show where the chi-square test should not have been used."
tools: [crosstab-chi-square, hypothesis-tests, sample-size, odds-risk-ratio]
updated: 2026-11-24
sources:
  - "Lee, J. J., Robles, G., Leyva Vera, C. A., Orellana, E. R., Graham, S. M., Nguyen, A.-M., Wei, Y., Hernandez Sanchez, A., Dombrowski, J. C. and Simoni, J. M. (2023), A Peer-Based Intervention to Increase HIV and Sexually Transmitted Infection Testing Among Latinx Immigrant Sexual Minority Men in the US Pacific Northwest: Pilot Randomized Controlled Trial Conducted During the COVID-19 Pandemic, JMIR Formative Research 7: e45871, doi:10.2196/45871. Licence: Creative Commons Attribution, taken from the publisher page's rights metadata on 2026-11-24 (the Crossref record for this DOI carries no licence field). Values used here: 50 men enrolled (30 peer group, 20 control), recruited February to December 2021; STI testing 19 of 25 against 7 of 19, Pearson chi-square 6.848 with 1 degree of freedom, p = .009 in the Results and .01 in the abstract, Cramer's V = 0.394; HIV testing 19 of 25 against 11 of 19, chi-square 1.631, p = .20, V = 0.193; motivated to use PrEP 21 of 23 (91 %) against 10 of 17 (59 %), p = .02, V = 0.385."
  - "Formulas: Pearson (1900) chi-square, Cramer (1946) V, Fisher (1922) exact test, Yates (1934) continuity correction, Haberman (1973) adjusted residuals, as implemented in src/lib/sci/crosstab.ts and checked against scipy."
paper:
  title: "A Peer-Based Intervention to Increase HIV and Sexually Transmitted Infection Testing Among Latinx Immigrant Sexual Minority Men in the US Pacific Northwest: Pilot Randomized Controlled Trial Conducted During the COVID-19 Pandemic"
  authors: "Lee JJ, Robles G, Leyva Vera CA, Orellana ER, Graham SM, Nguyen A-M, Wei Y, Hernandez Sanchez A, Dombrowski JC, Simoni JM"
  journal: "JMIR Formative Research"
  year: 2023
  doi: "10.2196/45871"
  url: "https://formative.jmir.org/2023/1/e45871"
  licence: "CC BY"
  reviewed: true
---

Most small trials report their yes-or-no results as a pair of percentages, a chi-square value and an effect size, and almost nobody checks whether those three numbers agree with each other. They can be checked, in seconds, because a 2 × 2 table is fully determined by four counts. A 2023 pilot randomised trial in *JMIR Formative Research* tested whether a peer-delivered programme raised HIV and sexually transmitted infection (STI) testing among Latinx immigrant sexual minority men in the US Pacific Northwest, and it prints all four counts for each outcome. We put them back into the [[crosstab-chi-square|cross-tab and chi-square tool]] and get its statistics back to the last digit, then use the tool to answer two questions the paper does not: does the result survive the people who dropped out of the analysis, and was the chi-square test the right one? For the general-purpose versions of the same tests, see [[hypothesis-tests]], [[odds-risk-ratio]] and [[sample-size]].

## The paper in brief

Fifty men were randomised, 30 to the peer-led programme and 20 to a control condition, and recruited between February and December 2021. The programme was delivered by trained peers and included information, motivational support, skills training and HIV self-testing kits. The trial is explicitly a **pilot**: its job was to show the design could be run, not to measure the effect precisely.

Three yes-or-no outcomes are reported with full counts. **STI testing**: 19 of 25 men in the peer group (76 %) against 7 of 19 in the control group (37 %), Pearson chi-square 6.848 on 1 degree of freedom, Cramér's V 0.394. **HIV testing**: 19 of 25 against 11 of 19 (58 %), chi-square 1.631, p = .20, V 0.193. **Being motivated to use pre-exposure prophylaxis (PrEP)**: 21 of 23 (91 %) against 10 of 17 (59 %), p = .02, V 0.385. The denominators, 25 and 19, are smaller than the 30 and 20 randomised, because some men did not complete the follow-up survey.

## Checked with the tools

The tool takes one row per person and builds the table itself, so we expanded each published 2 × 2 table back into cases (19 rows of "peer group, tested", and so on) and ran the same code the tool page runs. **Every statistic the paper reports comes back exactly.**

| Outcome | Paper | Cross-tab and chi-square tool |
|---|---|---|
| STI testing, χ² (df 1) | 6.848 | 6.848, p = 0.00888 |
| STI testing, Cramér's V | 0.394 | 0.3945 |
| HIV testing, χ² (df 1) | 1.631 | 1.631, p = 0.202 |
| HIV testing, Cramér's V | 0.193 | 0.1925 |
| PrEP motivation, Cramér's V | 0.385 | 0.3845, χ² = 5.914, p = 0.0150 |
| PrEP motivation, p | .02 | 0.0150 (Pearson), 0.0231 (Fisher's exact) |

Two small things fall out of this. First, the STI p-value is 0.00888: the paper's Results section rounds it to .009 and its abstract to .01, which is where the two differ. Second, the tool adds what the paper leaves out. For the STI table the **odds ratio is 5.43** and the adjusted standardised residual in the "peer group, tested" cell is **+2.62**, so that one cell alone is more than two and a half standard errors above what independence predicts. For HIV testing the odds ratio is 2.30 and the residual only +1.28, which is the same story the p-value of .20 tells.

**Does the STI result survive the men who left the analysis?** Five peer-group men and one control man are missing from the 25 and 19. The cautious thing to do is to count every missing man as untested, which pushes the peer group down; the generous thing is to count the five peer-group men as tested. Figure 1 walks through all six possibilities with the one control man always counted as untested. Even in the harshest case the Pearson p-value is **0.0495** and Cramér's V 0.278; by the time two of the five are counted as tested, p is 0.015. So the direction of the finding is robust, but its harshest reading sits exactly on the 0.05 line, and Fisher's exact test puts that same case at 0.082, on the other side of it.

<!-- fig:itt -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Three p-values for the STI testing table as the five peer-group men missing from the analysis are added back, from none counted as tested to all five. Even the harshest case stays at or below 0.05 for the Pearson test." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>STI testing: does the result survive the missing men?</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">STI testing: does the result survive the missing men?</text><line x1="58" x2="546" y1="236.5" y2="236.5" style="stroke:var(--line)"/><text x="52" y="240.5" text-anchor="end" style="fill:var(--muted)">0.001</text><line x1="58" x2="546" y1="182.2" y2="182.2" style="stroke:var(--line)"/><text x="52" y="186.2" text-anchor="end" style="fill:var(--muted)">0.005</text><line x1="58" x2="546" y1="158.8" y2="158.8" style="stroke:var(--line)"/><text x="52" y="162.8" text-anchor="end" style="fill:var(--muted)">0.01</text><line x1="58" x2="546" y1="104.5" y2="104.5" style="stroke:var(--line)"/><text x="52" y="108.5" text-anchor="end" style="fill:var(--muted)">0.05</text><line x1="58" x2="546" y1="81.1" y2="81.1" style="stroke:var(--line)"/><text x="52" y="85.1" text-anchor="end" style="fill:var(--muted)">0.1</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="155.6" x2="155.6" y1="252" y2="256" style="stroke:var(--muted)"/><text x="155.6" y="269" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="253.2" x2="253.2" y1="252" y2="256" style="stroke:var(--muted)"/><text x="253.2" y="269" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="350.8" x2="350.8" y1="252" y2="256" style="stroke:var(--muted)"/><text x="350.8" y="269" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="448.4" x2="448.4" y1="252" y2="256" style="stroke:var(--muted)"/><text x="448.4" y="269" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Unseen peer-group men counted as tested (of 5)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">p-value</text><line x1="58" x2="546" y1="104.5" y2="104.5" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="99.5" text-anchor="end" style="fill:var(--muted)">p = 0.05</text><path d="M58 104.8L155.6 124.3L253.2 146L350.8 170.2L448.4 197L546 227.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 87.6L155.6 109.7L253.2 133.8L350.8 159.8L448.4 170.1L546 205.3" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 83.2L155.6 100.7L253.2 120.1L350.8 141.9L448.4 166.3L546 193.6" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round;stroke-dasharray:4 3"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Pearson χ²</text><line x1="156" x2="168" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="172" y="40" style="fill:var(--muted)">Fisher's exact</text><line x1="282.8" x2="294.8" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2;stroke-dasharray:4 3"/><text x="298.8" y="40" style="fill:var(--muted)">Yates-corrected</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The STI testing comparison re-tested as the five peer-group men who dropped out of the analysis are added back, left to right, as men who were tested. Made with the Cross-tab and chi-square tool’s maths from the paper’s counts.</figcaption></figure>
<!-- /fig:itt -->

**Was the chi-square test the right one?** For STI and HIV testing, yes: the smallest expected count is 7.8 and 6.0, comfortably above the usual threshold of 5. For the PrEP table it is **3.825**, below 5, and the tool flags it. With one small expected count the chi-square approximation is optimistic: it gives p = 0.0150 where Fisher's exact test gives **0.0231**. Both are under 0.05, so the paper's conclusion stands, but the paper's reported p of .02 is closer to the exact test than to the chi-square it names. Figure 2 shows why the gap appears, by plotting both p-values for every table those row and column totals allow: Fisher's curve sits above Pearson's everywhere, and the difference grows as the table gets more extreme.

<!-- fig:exact -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Pearson and Fisher two-sided p-values for every 2 by 2 table with the PrEP outcome margins. Fisher is always the larger (more cautious) of the two, and the observed table at 21 gives 0.015 against 0.023." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>The same margins, every possible table</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">The same margins, every possible table</text><line x1="58" x2="546" y1="234.2" y2="234.2" style="stroke:var(--line)"/><text x="52" y="238.2" text-anchor="end" style="fill:var(--muted)">0.0001</text><line x1="58" x2="546" y1="189.8" y2="189.8" style="stroke:var(--line)"/><text x="52" y="193.8" text-anchor="end" style="fill:var(--muted)">0.001</text><line x1="58" x2="546" y1="145.5" y2="145.5" style="stroke:var(--line)"/><text x="52" y="149.5" text-anchor="end" style="fill:var(--muted)">0.01</text><line x1="58" x2="546" y1="114.4" y2="114.4" style="stroke:var(--line)"/><text x="52" y="118.4" text-anchor="end" style="fill:var(--muted)">0.05</text><line x1="58" x2="546" y1="101.1" y2="101.1" style="stroke:var(--line)"/><text x="52" y="105.1" text-anchor="end" style="fill:var(--muted)">0.1</text><line x1="58" x2="546" y1="56.7" y2="56.7" style="stroke:var(--line)"/><text x="52" y="60.7" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">14</text><line x1="112.2" x2="112.2" y1="252" y2="256" style="stroke:var(--muted)"/><text x="112.2" y="269" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="166.4" x2="166.4" y1="252" y2="256" style="stroke:var(--muted)"/><text x="166.4" y="269" text-anchor="middle" style="fill:var(--muted)">16</text><line x1="220.7" x2="220.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="220.7" y="269" text-anchor="middle" style="fill:var(--muted)">17</text><line x1="274.9" x2="274.9" y1="252" y2="256" style="stroke:var(--muted)"/><text x="274.9" y="269" text-anchor="middle" style="fill:var(--muted)">18</text><line x1="329.1" x2="329.1" y1="252" y2="256" style="stroke:var(--muted)"/><text x="329.1" y="269" text-anchor="middle" style="fill:var(--muted)">19</text><line x1="383.3" x2="383.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="383.3" y="269" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="437.6" x2="437.6" y1="252" y2="256" style="stroke:var(--muted)"/><text x="437.6" y="269" text-anchor="middle" style="fill:var(--muted)">21</text><line x1="491.8" x2="491.8" y1="252" y2="256" style="stroke:var(--muted)"/><text x="491.8" y="269" text-anchor="middle" style="fill:var(--muted)">22</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">23</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Peer-group men motivated to use PrEP (of 23)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Two-sided p-value</text><line x1="58" x2="546" y1="114.4" y2="114.4" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="109.4" text-anchor="end" style="fill:var(--muted)">p = 0.05</text><line x1="437.6" x2="437.6" y1="50" y2="252" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="433.6" y="62" text-anchor="end" style="fill:var(--muted)">observed</text><path d="M58 166.3L112.2 124L166.4 91.7L220.7 69L274.9 58.8L329.1 75.9L383.3 101.9L437.6 137.6L491.8 183.6L546 240.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 158.3L112.2 113.1L166.4 83L220.7 63.3L274.9 56.7L329.1 71.8L383.3 95.4L437.6 129.3L491.8 175.2L546 236.5" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Pearson χ²</text><line x1="156" x2="168" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="172" y="40" style="fill:var(--muted)">Fisher's exact</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. For the PrEP outcome’s row and column totals, the Pearson and Fisher two-sided p-values of every table that those totals allow. The dashed line marks the observed table.</figcaption></figure>
<!-- /fig:exact -->

## How we made the graphs

Both charts and every number above come from `scripts/blog-figures/peer-led-hiv-sti-testing-two-by-two-cramers-v-fisher-exact.mjs` in fibub's public code. It calls one function, `crosstab` from `src/lib/sci/crosstab.ts`, the maths behind the [[crosstab-chi-square|cross-tab and chi-square tool]]; the Pearson chi-square, likelihood-ratio G², Cramér's V, adjusted residuals, Yates correction, Fisher's exact test and the expected counts all come out of that one call.

Every input is a count stated in the paper's text: 19 and 25, 7 and 19, 11 and 19, 21 and 23, 10 and 17, and the randomised totals 30 and 20. Nothing is simulated and no data table was copied: the four counts of a 2 × 2 table are facts, and we re-derive everything else from them. The only choice we made is **our assumption** in Figure 1, that the one control man missing from the analysis was not tested; counting him as tested shifts every p-value in the figure up by roughly a factor of two.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/crosstab-chi-square.mjs`, which pins the cross-tab maths against SciPy 1.18 and statsmodels on a made-up 240-person survey:

- The 3 × 3 age-by-transport table must give Pearson χ² = 22.4554 with 4 degrees of freedom and p = 0.000163, G² = 24.2231 and Cramér's V = 0.2172, matching `scipy.stats.chi2_contingency` and `scipy.stats.contingency.association`.
- Every Pearson and adjusted standardised residual must match `statsmodels.stats.Table`, and the Yates-corrected χ² must match SciPy's own correction (2.9449, p = 0.0861 on the 2 × 2 slice).
- Fisher's exact test on the table 3, 1 over 1, 3 must give a two-sided p of 0.48571 and an odds ratio of 9, as `scipy.stats.fisher_exact` does, including the one-sided values.
- New with this article: the trial's three tables must give χ² 6.848, 1.631 and 5.914, Cramér's V 0.39450, 0.19254 and 0.38451, Fisher two-sided p 0.013656, 0.327372 and 0.023117, odds ratios 38/7, 76/33 and 7.35, and the PrEP table must report exactly one expected count below 5.

## Check it yourself

On the [[crosstab-chi-square|cross-tab and chi-square tool]], in the *Your survey data* box, clear the example and paste the trial's STI outcome as one line per man:

```
group,sti_tested
Peer,Tested
Peer,Tested
Peer,Tested
Peer,Tested
Peer,Tested
Peer,Tested
Peer,Tested
Peer,Tested
Peer,Tested
Peer,Tested
Peer,Tested
Peer,Tested
Peer,Tested
Peer,Tested
Peer,Tested
Peer,Tested
Peer,Tested
Peer,Tested
Peer,Tested
Peer,Not tested
Peer,Not tested
Peer,Not tested
Peer,Not tested
Peer,Not tested
Peer,Not tested
Control,Tested
Control,Tested
Control,Tested
Control,Tested
Control,Tested
Control,Tested
Control,Tested
Control,Not tested
Control,Not tested
Control,Not tested
Control,Not tested
Control,Not tested
Control,Not tested
Control,Not tested
Control,Not tested
Control,Not tested
Control,Not tested
Control,Not tested
Control,Not tested
```

1. Set *Rows* to **group** and *Columns* to **sti_tested**, and leave *Weight* on **None (unweighted)**.
2. The headline line reads **Pearson χ² = 6.848, p = 0.0089**. Below it you should see *Likelihood ratio G²* **6.972**, *Cramér's V* **0.394**, *Yates-corrected χ²* **5.324, p = 0.0210** and *Respondents* **44**.
3. Switch the table to **Row %** and read 76.0 % against 36.8 %, the paper's two percentages.
4. Open *Adjusted standardised residuals*: the "Peer / Tested" cell shows **+2.62** and is marked, because it is beyond ±1.96.
5. Scroll to Fisher's exact test: two-sided **p = 0.0137**, odds ratio **5.43**.
6. Now change the last 12 lines' second field from "Not tested" to "Tested" five at a time and watch the p-value climb back towards 0.05: that is Figure 1, done by hand.

## What researchers can use it for

- **Audit a published 2 × 2 table** before citing it. Type the four counts, compare the chi-square, p-value and effect size, and see at once whether the paper's rounding, test choice or effect-size formula explains any difference.
- **Decide between chi-square and Fisher's exact test** from the expected counts the tool prints, instead of from a rule of thumb. Under about 5 in any cell, report the exact test.
- **Do a missing-data sensitivity check** in a few minutes, as in Figure 1: re-run the table with the dropouts counted the worst way, and say in the paper whether the conclusion survives.
- **Read the cells, not just the table.** Adjusted residuals say which combination drives a significant chi-square, which a single p-value for a 3 × 4 table never tells you.
- **Plan the next trial.** This pilot's V of 0.39 on 44 people is a plausible effect to feed into [[sample-size]] for a full trial, remembering that pilot effect sizes are usually too large.

## The fine print

- This is a **pilot** trial of 50 men, analysed on 44 and 40 respondents. Its effect sizes carry wide uncertainty, and the paper says so.
- Our figures use the counts printed in the paper's text and Table 4. We did not have the individual data, and none was needed: a 2 × 2 table is its four counts.
- Cramér's V on a 2 × 2 table is the absolute value of the phi coefficient. Papers sometimes report phi and call it V, or vice versa; here both equal 0.394.
- The intention-to-treat reading in Figure 1 is ours, not the paper's. The paper reports a complete-case analysis and does not claim an intention-to-treat result.
- General information about statistical practice, not medical advice. Nothing here is guidance about HIV or STI testing; for that, see a clinician or a public-health service.
