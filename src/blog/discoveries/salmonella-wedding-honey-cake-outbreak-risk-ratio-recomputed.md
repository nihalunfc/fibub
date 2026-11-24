---
title: "Salmonella outbreak at a wedding: honey cake risk ratio recomputed"
summary: "A 2024 outbreak study traced Salmonella at a Kazakh wedding to honey cake. We rebuild its 2 × 2 tables from the text and recompute the risk ratios with fibub's odds and risk ratio tool."
tools: [odds-risk-ratio, epi-curve, diagnostic-test-calculator]
updated: 2026-11-24
sources:
  - "Gazezova, S., Nabirova, D., Waltenburg, M., Rakhimzhanova, M., Smagul, M., Kasabekova, L. and Horth, R. (2024), Salmonellosis outbreak associated with the consumption of food at a wedding in an urban restaurant in Kazakhstan: a retrospective cohort study, BMC Infectious Diseases 24: 1464, doi:10.1186/s12879-024-10382-4. Licence CC BY 4.0 (Creative Commons Attribution 4.0 International), checked on the article page at link.springer.com, 2026-11-24. Values used here: 138 people who ate food from the event, 66 ill (attack rate 48 %); 89 % of ill and 13 % of well people ate honey cake; 45 % of ill and 11 % of well people ate leftovers; adjusted risk ratio for honey cake 7.8 (95 % CI 3.5 to 20.1) in the abstract, 8.0 (3.6 to 20.7) in the results; 50 of 66 ill people in hospital; onset 6 hours to 4 days after the event."
  - "Risk ratio interval: Katz, D., Baptista, J., Azen, S. P. and Pike, M. C. (1978), Biometrics 34: 469-474. Mantel-Haenszel risk ratio: Greenland, S. and Robins, J. M. (1985), Biometrics 41: 55-68."
paper:
  title: "Salmonellosis outbreak associated with the consumption of food at a wedding in an urban restaurant in Kazakhstan: a retrospective cohort study"
  authors: "Gazezova S, Nabirova D, Waltenburg M, Rakhimzhanova M, Smagul M, Kasabekova L, Horth R"
  journal: "BMC Infectious Diseases"
  year: 2024
  doi: "10.1186/s12879-024-10382-4"
  url: "https://link.springer.com/article/10.1186/s12879-024-10382-4"
  licence: "CC BY 4.0"
  reviewed: true
---

When dozens of wedding guests fall ill in the same week, investigators need to find out fast which dish did it. The standard method is a **retrospective cohort study**: ask everyone who ate there what they ate and whether they became ill, then compare the share who fell ill among those who ate each food with the share among those who did not. That ratio is the **risk ratio**. A 2024 paper in *BMC Infectious Diseases* used exactly this to trace a *Salmonella* outbreak in Kazakhstan to a honey cake. This article rebuilds the paper's key tables from the percentages in its text and recomputes the risk ratios with the [[odds-risk-ratio]] tool. To draw the onset dates as an outbreak curve, use the [[epi-curve]]; to judge a lab test's hits and misses, the [[diagnostic-test-calculator]].

## The paper in brief

In June 2022 a regional health department in Kazakhstan saw a rise in stomach illness among people who had eaten food from a wedding held in a restaurant. Investigators reached **138 people** who ate the food, at the wedding or as leftovers taken home; **66 became ill**, an attack rate of 48 %. Illness began between 6 hours and 4 days after the event, and 50 of the 66 ill people (76 %) were admitted to hospital. Nobody died.

Of all the foods, only **honey cake** stayed linked to illness after the authors adjusted for age, sex and the other foods in a Poisson regression: an adjusted risk ratio of **7.8** (95 % confidence interval 3.5 to 20.1). The cakes had a cream made with raw eggs and had been kept at room temperature for three days. *Salmonella* Enteritidis grew from every stool sample tested and from both cake samples. The paper's conclusion is a familiar food-safety lesson: raw-egg creams need cold storage.

## Checked with the tools

The paper gives the food tables only in a form we did not copy. Its text, though, says that **89 % of ill people and 13 % of well people ate honey cake**, and **45 % and 11 % ate leftovers**. With 66 ill and 72 well, only one whole number fits each percentage: 59 of 66 ill and 9 of 72 well ate cake; 30 of 66 ill and 8 of 72 well ate leftovers. So the 2 × 2 tables can be **rebuilt from the text**, assuming everyone answered both questions (**our assumption**).

**Step 1: the honey cake.** Among the 68 cake eaters, 59 fell ill: an attack rate of **86.8 %**. Among the 70 who did not eat it, 7 fell ill: **10.0 %**. The tool gives a crude risk ratio of **8.68** (95 % interval **4.27 to 17.63**), a risk difference of 76.8 percentage points and a Fisher exact p of about 5 × 10⁻²¹. That sits close to the paper's adjusted 7.8 (3.5 to 20.1), which is what you expect when the other foods do not confound the cake much. The **odds ratio** is 59 (exact interval 18.8 to 194.9). For a common illness like this one, the odds ratio is far larger than the risk ratio and should not be read as one.

**Step 2: the leftovers, and confounding.** People who ate leftovers fell ill at **78.9 %** against **36.0 %**: a crude risk ratio of **2.19** (1.61 to 2.99). Yet in the paper's adjusted model leftovers drop out. The likely reason is **confounding**: leftovers included the cake. To show how that works, we made up one split of the leftover eaters by cake eating that fits all the paper's totals (**our assumption**, not the paper's data). Within it, leftover eaters and other cake eaters fall ill at almost the same rate (88.2 % against 85.3 %), and the tool's Mantel-Haenszel risk ratio pooled across the two strata is **1.01** (0.82 to 1.23). A crude risk ratio of 2.19 can be explained entirely by the cake (Figure 1).

<!-- fig:forest -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 268" role="img" aria-label="Honey cake: crude risk ratio 8.68 (4.27 to 17.63) from counts rebuilt from the paper's percentages, beside the paper's adjusted 7.8 (3.5 to 20.1). Leftovers: crude 2.19, but 1.01 within cake strata in a made-up split that fits the totals." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Risk ratios with 95 % intervals (log scale)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Risk ratios with 95 % intervals (log scale)</text><line x1="139.3" x2="139.3" y1="222" y2="226" style="stroke:var(--muted)"/><text x="139.3" y="239" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="220.9" x2="220.9" y1="222" y2="226" style="stroke:var(--muted)"/><text x="220.9" y="239" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="328.8" x2="328.8" y1="222" y2="226" style="stroke:var(--muted)"/><text x="328.8" y="239" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="410.4" x2="410.4" y1="222" y2="226" style="stroke:var(--muted)"/><text x="410.4" y="239" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="492" x2="492" y1="222" y2="226" style="stroke:var(--muted)"/><text x="492" y="239" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="222" y2="222" style="stroke:var(--muted)"/><text x="302" y="260" text-anchor="middle" style="fill:var(--ink)">Risk ratio</text><text transform="translate(14 136) rotate(-90)" text-anchor="middle" style="fill:var(--ink)"></text><line x1="139.3" x2="139.3" y1="50" y2="222" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="143.3" y="62" text-anchor="start" style="fill:var(--muted)">no effect</text><path d="M310.3 74.6L477.2 74.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="393.7" cy="74.6" r="5" style="fill:var(--c-blog);opacity:1"/><path d="M286.8 115.5L492.6 115.5" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="381.2" cy="115.5" r="5" style="fill:var(--c-tools);opacity:1"/><path d="M195.5 156.5L268.1 156.5" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><circle cx="231.8" cy="156.5" r="5" style="fill:var(--ink);opacity:1"/><path d="M116.5 197.4L163.7 197.4" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round"/><circle cx="140.1" cy="197.4" r="5" style="fill:var(--muted);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Cake</text><line x1="112.8" x2="124.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="128.8" y="40" style="fill:var(--muted)">Cake adj. (paper)</text><line x1="261.2" x2="273.2" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="277.2" y="40" style="fill:var(--muted)">Leftovers</text><line x1="352" x2="364" y1="36" y2="36" style="stroke:var(--muted);stroke-width:2"/><text x="368" y="40" style="fill:var(--muted)">Leftovers in strata</text><text class="fibub-mark" x="546" y="260" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Risk ratios worked out by the Odds and risk ratio tool's maths from counts rebuilt from the paper's percentages, beside the paper's adjusted honey cake estimate. The last row uses a made-up split of the leftover eaters (our assumption) to show confounding; it is not the paper's data.</figcaption></figure>
<!-- /fig:forest -->

**Step 3: how firm is the rebuild?** The counts come from rounded percentages, so we asked what happens if the number of well cake eaters were anywhere from 5 to 15 instead of 9. The crude risk ratio moves from **9.75 to 7.29**, and the lower end of its interval never drops below 3.59 (Figure 2). The finding does not hang on one or two guests' answers.

<!-- fig:sens -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="With 59 ill cake eaters fixed, the crude risk ratio falls from 9.7 to 7.3 as the number of well cake eaters goes from 5 to 15; the lower end of its interval stays above 3.6." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Honey cake risk ratio if the count of well cake eaters were different</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Honey cake risk ratio if the count of well cake eaters were different</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--line)"/><text x="52" y="236" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="195.6" y2="195.6" style="stroke:var(--line)"/><text x="52" y="199.6" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="159.2" y2="159.2" style="stroke:var(--line)"/><text x="52" y="163.2" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="122.8" y2="122.8" style="stroke:var(--line)"/><text x="52" y="126.8" text-anchor="end" style="fill:var(--muted)">15</text><line x1="58" x2="546" y1="86.4" y2="86.4" style="stroke:var(--line)"/><text x="52" y="90.4" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">25</text><line x1="106.8" x2="106.8" y1="232" y2="236" style="stroke:var(--muted)"/><text x="106.8" y="249" text-anchor="middle" style="fill:var(--muted)">6</text><line x1="204.4" x2="204.4" y1="232" y2="236" style="stroke:var(--muted)"/><text x="204.4" y="249" text-anchor="middle" style="fill:var(--muted)">8</text><line x1="302" x2="302" y1="232" y2="236" style="stroke:var(--muted)"/><text x="302" y="249" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="399.6" x2="399.6" y1="232" y2="236" style="stroke:var(--muted)"/><text x="399.6" y="249" text-anchor="middle" style="fill:var(--muted)">12</text><line x1="497.2" x2="497.2" y1="232" y2="236" style="stroke:var(--muted)"/><text x="497.2" y="249" text-anchor="middle" style="fill:var(--muted)">14</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Well guests who ate honey cake</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Risk ratio</text><line x1="253.2" x2="253.2" y1="50" y2="232" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="257.2" y="62" text-anchor="start" style="fill:var(--muted)">9 (13 %)</text><path d="M58 161L106.8 163.1L155.6 165.1L204.4 167L253.2 168.8L302 170.6L350.8 172.4L399.6 174.1L448.4 175.8L497.2 177.4L546 178.9" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 197.1L106.8 198.1L155.6 199.1L204.4 200L253.2 200.9L302 201.8L350.8 202.7L399.6 203.5L448.4 204.3L497.2 205.1L546 205.9" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 3"/><path d="M58 87.9L106.8 92L155.6 96L204.4 99.9L253.2 103.7L302 107.3L350.8 110.9L399.6 114.4L448.4 117.7L497.2 121L546 124.2" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 3"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Risk ratio</text><line x1="156" x2="168" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:5 3"/><text x="172" y="40" style="fill:var(--muted)">95 % interval</text><text class="fibub-mark" x="546" y="270" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. How the crude honey cake risk ratio and its 95 % interval would move if the number of well guests who ate cake were 5 to 15 instead of the 9 rebuilt from the paper. The effect stays large either way.</figcaption></figure>
<!-- /fig:sens -->

| Check | Paper | Our tool result |
|---|---|---|
| Attack rate | 48 % (66 of 138) | 47.8 % |
| Honey cake risk ratio | 7.8 (3.5 to 20.1), adjusted | 8.68 (4.27 to 17.63), crude, rebuilt counts |
| Attack rate, cake eaters / others | not stated | 86.8 % / 10.0 % |
| Leftovers risk ratio | not significant after adjustment | 2.19 crude; 1.01 within cake strata (made-up split) |

## How we made the graphs

The charts and every number come from `scripts/blog-figures/salmonella-wedding-honey-cake-outbreak-risk-ratio-recomputed.mjs` in fibub's public code. It calls `single` (one 2 × 2 table: risk ratio, odds ratio, exact intervals, Fisher's test) and `stratified` (Mantel-Haenszel) from `src/lib/sci/oddsratio.ts`, the maths of the [[odds-risk-ratio]] tool.

The group sizes, percentages and the adjusted risk ratio come from the paper's text. The script finds every whole-number count that rounds to each stated percentage (there is exactly one each time). That everyone answered both food questions, and the split of leftover eaters by cake eating, are **our assumptions**.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/odds-risk-ratio.mjs`, which pins the tool against statsmodels and SciPy:

- A table of 40, 60, 20 and 80 must give an odds ratio of **2.667** with Woolf limits **1.417 to 5.020** (statsmodels), and a risk ratio of **2** with limits **1.263 to 3.167**.
- The same table's exact conditional odds ratio must be **2.653** with exact limits **1.358 to 5.313** (SciPy).
- A three-stratum example must give a Mantel-Haenszel odds ratio of **2.839** (1.694 to 4.756), as statsmodels' `StratifiedTable` does.
- New with this article: the honey cake table (59, 9, 7, 63) must give a risk ratio of **8.676** with limits **4.270 to 17.63**, matching the Katz formula written out by hand in the test.

## Check it yourself

On the [[odds-risk-ratio]] page:

1. Keep **One table** selected and set *Study design* to **Cohort or trial**. The columns change to *Ill (event)* and *Well (no event)*.
2. Type **59** and **9** in the *Exposed* row (ate honey cake) and **7** and **63** in the *Unexposed* row.
3. *Risk ratio (log method)* reads about **8.68**, with an interval of about **4.27 to 17.6**. *Odds ratio (Woolf, log method)* reads **59**.
4. Switch to **Strata (Mantel-Haenszel)** and replace the example with two lines: **Ate honey cake, 30, 4, 29, 5** and **No honey cake, 0, 4, 7, 59** (tab or comma separated). The pooled risk ratio reads about **1.01**, while the crude one is 2.19: the cake explains the leftovers.

## What researchers can use it for

- **Run a food-specific analysis** during an outbreak: one table per food, with risk ratios, exact intervals and Fisher's test, in the [[odds-risk-ratio]] tool.
- **Rebuild and check a published table** from its percentages and group sizes, as we did here, before citing it in a review.
- **Show confounding** with strata: a crude effect that vanishes within strata is the classic sign.
- **Draw the onset times** in the [[epi-curve]] tool to see whether a single meal fits (one sharp peak) or the spread looks like person-to-person spread.
- **Teach the odds ratio against the risk ratio**: with a 48 % attack rate, an odds ratio of 59 sits beside a risk ratio of 8.7.

## The fine print

- The 2 × 2 tables are rebuilt from rounded percentages and assume everyone answered; the paper's own tables may differ slightly.
- Our risk ratios are crude. The paper's 7.8 is adjusted for age, sex and other foods, so the two are not the same quantity.
- The split of leftover eaters by cake is made up to illustrate confounding; it is not data from the study.
- The paper gives the adjusted risk ratio as 7.8 (3.5 to 20.1) in its abstract and 8.0 (3.6 to 20.7) in its results; we quote the abstract.
- This is general public-health education. Report suspected food poisoning to your local health authority.
