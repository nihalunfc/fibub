---
title: "Beraprost and survival in dogs with stage 2 kidney disease: a Kaplan-Meier study"
summary: "A small study links beraprost to longer survival in dogs with early kidney disease. We rebuild its Kaplan-Meier curves, log-rank test and hazard ratio with fibub's survival tool."
tools: [survival-analysis, sample-size, plot-maker]
updated: 2026-11-16
sources:
  - "Mayumi, M., Matsuura, T. and Sano, T. (2026), Overall survival with beraprost in dogs with IRIS stage 2 chronic kidney disease, Frontiers in Veterinary Science 13: 1665061, doi:10.3389/fvets.2026.1665061. Licence CC BY 4.0, checked on the journal page, 2026-11-16. Values used here, from the Results: 16 treated dogs (11 deaths) and 17 historical controls (16 deaths); median overall survival 1,101 days (95% CI 324 to 1,878) and 198 days (121 to 275); log-rank P = 0.001; unadjusted hazard ratio 0.25 (0.10 to 0.59); hazard ratio adjusted for age and urine protein 0.15 (0.03 to 0.79); median ages 14.0 and 15.1 years; follow-up to 1 May 2025."
  - "Kaplan-Meier method: Kaplan, E. L. and Meier, P. (1958), JASA 53: 457. Log-rank test: Mantel, N. (1966), Cancer Chemotherapy Reports 50: 163. Cox model: Cox, D. R. (1972), JRSS B 34: 187."
  - "IRIS staging of chronic kidney disease in dogs: International Renal Interest Society, iris-kidney.com (general background only)."
paper:
  title: "Overall survival with beraprost in dogs with IRIS stage 2 chronic kidney disease"
  authors: "Mayumi M, Matsuura T, Sano T"
  journal: "Frontiers in Veterinary Science"
  year: 2026
  doi: "10.3389/fvets.2026.1665061"
  url: "https://www.frontiersin.org/journals/veterinary-science/articles/10.3389/fvets.2026.1665061/full"
  licence: "CC BY 4.0"
  reviewed: true
---

Chronic kidney disease is one of the commonest reasons older dogs die. A clinic in Japan gave 16 dogs with early (stage 2) kidney disease a drug called beraprost and followed them for up to five years. Half of them were still alive 1,101 days later; in a group of 17 earlier, untreated dogs, half had died by 198 days. Numbers like these come from **survival analysis**, the statistics of "how long until something happens". This article shows how the [[survival-analysis]] tool lets anyone rebuild that kind of result, and how to judge what a study of 33 dogs can and cannot show. To plan a bigger study, the [[sample-size]] calculator is the next step; to draw your own figures, the [[plot-maker]].

This is general education about a study's statistics, not advice about any animal's treatment. Talk to a vet.

## The paper in brief

Beraprost is a drug that widens blood vessels. It is approved for dogs and cats in some countries, and has been suggested as a way to protect the kidney's small blood vessels. The team gave it by mouth, twice a day, to 16 dogs with stage 2 disease (on the International Renal Interest Society scale, where 1 is mildest and 4 is worst). They compared them with 17 similar dogs treated at the same clinic before beraprost was used there: a **historical control** group.

The main result: median survival of **1,101 days** with beraprost against **198 days** without (log-rank P = 0.001). The **hazard ratio**, the death rate in one group divided by the rate in the other, was **0.25**: at any moment, treated dogs died at about a quarter of the rate. After allowing for age and protein in the urine, it was 0.15. Treated dogs also took longer to reach stage 3 or 4.

The authors are clear about the limits. The groups were not chosen at random and were treated at different times, the vets knew which dogs had the drug, and the control dogs were about a year older. A randomised trial is needed before anyone can say beraprost causes the longer survival.

## Checked with the tools

We do not have the individual dogs' data, so we built a **simulated** data set with the paper's group sizes, death counts and medians, ran it through the Survival analysis tool's own maths, and compared the outputs with the paper's. The simulated dogs are not the study's dogs; they show what the tool does with data shaped like this.

**Step 1: the Kaplan-Meier curves.** A Kaplan-Meier curve drops each time a dog dies, by the share of dogs still being followed that died that day. Dogs that are still alive at the end, or lost to follow-up, are **censored**: they count while they are followed, then drop out without making the curve fall. In our simulated set, 5 treated dogs and 1 control dog are censored at the end of follow-up, as in the paper. The curves cross one half at **1,104.5 days** and **198 days** (Figure 1), matching the paper's 1,101 and 198.

<!-- fig:km -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Simulated Kaplan-Meier curves: the beraprost-like group falls to one half at 1104.5 days, the control-like group at 198 days." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Kaplan-Meier curves for a simulated 16 + 17 dog study</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Kaplan-Meier curves for a simulated 16 + 17 dog study</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="217.6" y2="217.6" style="stroke:var(--line)"/><text x="52" y="221.6" text-anchor="end" style="fill:var(--muted)">0.25</text><line x1="58" x2="546" y1="163.2" y2="163.2" style="stroke:var(--line)"/><text x="52" y="167.2" text-anchor="end" style="fill:var(--muted)">0.5</text><line x1="58" x2="546" y1="108.8" y2="108.8" style="stroke:var(--line)"/><text x="52" y="112.8" text-anchor="end" style="fill:var(--muted)">0.75</text><line x1="58" x2="546" y1="54.4" y2="54.4" style="stroke:var(--line)"/><text x="52" y="58.4" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="180" x2="180" y1="272" y2="276" style="stroke:var(--muted)"/><text x="180" y="289" text-anchor="middle" style="fill:var(--muted)">500</text><line x1="302" x2="302" y1="272" y2="276" style="stroke:var(--muted)"/><text x="302" y="289" text-anchor="middle" style="fill:var(--muted)">1e+3</text><line x1="424" x2="424" y1="272" y2="276" style="stroke:var(--muted)"/><text x="424" y="289" text-anchor="middle" style="fill:var(--muted)">1.5e+3</text><line x1="546" x2="546" y1="272" y2="276" style="stroke:var(--muted)"/><text x="546" y="289" text-anchor="middle" style="fill:var(--muted)">2e+3</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Days since entry</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Share still alive</text><line x1="58" x2="546" y1="163.2" y2="163.2" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="158.2" text-anchor="end" style="fill:var(--muted)">half still alive</text><path d="M58 54.4L70.2 54.4L70.2 68L96.1 68L96.1 81.6L123.9 81.6L123.9 95.2L153.6 95.2L153.6 108.8L186.1 108.8L186.1 122.4L221.2 122.4L221.2 136L260 136L260 149.6L303.2 149.6L303.2 163.2L351.8 163.2L351.8 176.8L407.2 176.8L407.2 190.4L471.8 190.4L471.8 204L546 204" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 54.4L60.2 54.4L60.2 67.2L64.3 67.2L64.3 79.9L69 79.9L69 92.8L74.1 92.8L74.1 105.6L79.5 105.6L79.5 118.4L85.3 118.4L85.3 131.2L91.7 131.2L91.7 144L98.5 144L98.5 156.8L106.3 156.8L106.3 169.6L115.1 169.6L115.1 182.4L125.1 182.4L125.1 195.2L136.6 195.2L136.6 208L150.7 208L150.7 220.8L168 220.8L168 233.6L191.7 233.6L191.7 246.4L227.1 246.4L227.1 259.2L546 259.2" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Beraprost-like (median 1104.5 d)</text><line x1="314.4" x2="326.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="330.4" y="40" style="fill:var(--muted)">Control-like (median 198 d)</text></svg><figcaption>Figure 1. Kaplan-Meier curves from the Survival analysis tool's maths for a simulated data set with the paper's group sizes, death counts and medians. Simulated, not the study's dogs.</figcaption></figure>
<!-- /fig:km -->

**Step 2: the log-rank test.** The test asks: if both groups had the same death rate, how many deaths would each have had, given who was at risk at each moment? The control-like group had **16 deaths where 8.4 were expected**; the beraprost-like group 11 where 18.6 were expected. That gives χ² = **10.9** and p = **0.001**, the same as the paper's P = 0.001.

**Step 3: the hazard ratio.** A Cox model with one term, beraprost versus control, gives **0.27 (95% interval 0.12 to 0.61)**. The paper's unadjusted value is 0.25 (0.10 to 0.59). The small gap is expected: our dogs' death times are spread out evenly, real ones are not.

**Step 4: the interval around the median.** The tool's median for the beraprost-like group runs from 392 days to "not reached", because more than a third of the treated dogs were still alive. The paper gives 324 to 1,878 days, worked out by a different (plain standard-error) method in its software. Both say the same thing: with 16 dogs, the median is very uncertain.

**Step 5: could a study this size miss a smaller effect?** We ran 400 simulated studies of 16 + 17 dogs for each of ten true hazard ratios (Figure 2). If the true ratio is 0.25, about **95%** of studies reach p < 0.05. If it is 0.5, only about **46%** do; at 0.7, about **15%**. So a study this size can show a large effect, but a negative result from it would have said little.

<!-- fig:power -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="Simulated power of the log-rank test with 16 and 17 dogs: high for a hazard ratio of 0.25, low for modest effects such as 0.6 or 0.7." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How often 16 + 17 dogs would show a difference (simulated)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How often 16 + 17 dogs would show a difference (simulated)</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--line)"/><text x="52" y="258" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="209.6" y2="209.6" style="stroke:var(--line)"/><text x="52" y="213.6" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="165.2" y2="165.2" style="stroke:var(--line)"/><text x="52" y="169.2" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="120.8" y2="120.8" style="stroke:var(--line)"/><text x="52" y="124.8" text-anchor="end" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="76.4" y2="76.4" style="stroke:var(--line)"/><text x="52" y="80.4" text-anchor="end" style="fill:var(--muted)">0.8</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">1</text><line x1="112.2" x2="112.2" y1="254" y2="258" style="stroke:var(--muted)"/><text x="112.2" y="271" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="220.7" x2="220.7" y1="254" y2="258" style="stroke:var(--muted)"/><text x="220.7" y="271" text-anchor="middle" style="fill:var(--muted)">0.4</text><line x1="329.1" x2="329.1" y1="254" y2="258" style="stroke:var(--muted)"/><text x="329.1" y="271" text-anchor="middle" style="fill:var(--muted)">0.6</text><line x1="437.6" x2="437.6" y1="254" y2="258" style="stroke:var(--muted)"/><text x="437.6" y="271" text-anchor="middle" style="fill:var(--muted)">0.8</text><line x1="546" x2="546" y1="254" y2="258" style="stroke:var(--muted)"/><text x="546" y="271" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--muted)"/><text x="302" y="292" text-anchor="middle" style="fill:var(--ink)">True hazard ratio (beraprost vs control)</text><text transform="translate(14 143) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Share of studies with p &lt; 0.05</text><line x1="58" x2="546" y1="76.4" y2="76.4" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="71.4" text-anchor="end" style="fill:var(--muted)">80% power</text><line x1="139.3" x2="139.3" y1="32" y2="254" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="143.3" y="44" text-anchor="start" style="fill:var(--muted)">paper: 0.25</text><path d="M85.1 33.1L112.2 35.9L139.3 43.1L166.4 59.8L220.7 104.1L274.9 152.4L329.1 189.6L383.3 220.1L437.6 226.3L546 239.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="85.1" cy="33.1" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="112.2" cy="35.9" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="139.3" cy="43.1" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="166.4" cy="59.8" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="220.7" cy="104.1" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="274.9" cy="152.4" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="329.1" cy="189.6" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="383.3" cy="220.1" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="437.6" cy="226.3" r="2.2" style="fill:var(--c-tools);opacity:1"/><circle cx="546" cy="239.6" r="2.2" style="fill:var(--c-tools);opacity:1"/></svg><figcaption>Figure 2. Share of 400 simulated studies of 16 + 17 dogs in which the log-rank test from the Survival analysis tool gives p &lt; 0.05, for different true hazard ratios. Simulated.</figcaption></figure>
<!-- /fig:power -->

| Check | Paper | Tool result (simulated data) |
|---|---|---|
| Median survival, beraprost | 1,101 days | 1,104.5 days |
| Median survival, control | 198 days | 198 days |
| Log-rank test | P = 0.001 | χ² 10.9, p 0.001 |
| Hazard ratio, unadjusted | 0.25 (0.10 to 0.59) | 0.27 (0.12 to 0.61) |
| Share alive at one year | (from the curves) | 81% and 29% |

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/beraprost-dogs-chronic-kidney-disease-kaplan-meier-survival.mjs` in fibub's public code. It calls the functions that power the [[survival-analysis]] tool, from `src/lib/sci/survival.ts`:

- `kaplanMeier` for the curves, the medians and their Greenwood intervals;
- `logRank` for the observed and expected deaths and the χ² test;
- `coxPH` for the hazard ratio.

From the paper: the group sizes (16 and 17), the deaths (11 and 16) and the medians (1,101 and 198 days). Our assumptions, labelled in the script: death times follow an exponential curve with the paper's median, placed at evenly spaced points of that curve; censored dogs sit at 1,900 to 2,000 days; and, for Figure 2, dogs join over 700 days and the study ends at 2,000 days.

## How we test the maths

On every change to fibub, `tests/sci-tools/survival-analysis.mjs` (run by `tests/sci.mjs`) checks the tool against two widely used statistics libraries:

- A Kaplan-Meier example must give survival of 0.75, 0.45 and 0.2025 at times 5, 10 and 20, and a log-log interval at time 10 of 0.231108 to 0.647090, as lifelines does.
- The log-rank test on the same data must give χ² = 6.118604 and p = 0.0133766 (lifelines), and a three-group version χ² = 12.524690.
- The Cox model must match statsmodels: hazard ratio 0.338391 (interval 0.136909 to 0.836386), p = 0.018928.

## Check it yourself

On the [[survival-analysis]] tool:

1. Clear the box under *One row per subject: time, event (1 = event happened, 0 = censored), then group* and paste the 33 simulated rows below (time in days, event, group).
2. Leave *Column 3 is* on **The group**. Type **days** in *Time unit*. Leave *Interval* on **Log-log (default)** and *Level* on **95 %**.
3. The headline reads **Median survival: Beraprost 1104.5 days, Control 198 days**.
4. Under *Log-rank test*, χ² is about **10.9 (1 df)** and the p value **0.001**.
5. In the Cox model card, set *Reference group* to **Control**. The hazard ratio for Beraprost is about **0.270**, interval **0.119 to 0.612**.

```
50 1 Beraprost
156 1 Beraprost
270 1 Beraprost
392 1 Beraprost
525 1 Beraprost
669 1 Beraprost
828 1 Beraprost
1005 1 Beraprost
1204 1 Beraprost
1431 1 Beraprost
1696 1 Beraprost
1900 0 Beraprost
1925 0 Beraprost
1950 0 Beraprost
1975 0 Beraprost
2000 0 Beraprost
9 1 Control
26 1 Control
45 1 Control
66 1 Control
88 1 Control
112 1 Control
138 1 Control
166 1 Control
198 1 Control
234 1 Control
275 1 Control
322 1 Control
380 1 Control
451 1 Control
548 1 Control
693 1 Control
1950 0 Control
```

## What researchers can use it for

- **Check a paper's survival table:** rebuild data with the reported group sizes, deaths and medians in the [[survival-analysis]] tool and see whether the stated log-rank p and hazard ratio are plausible.
- **Analyse your own follow-up data** (animals, patients, machines, seedlings) without uploading anything; the data stay on your computer.
- **Plan the next study:** the simulation in Figure 2 shows why a confirmatory trial needs more animals; the [[sample-size]] calculator helps with the numbers for simpler designs.
- **Report clearly:** download the curves, the number-at-risk table and the Cox table as an image, PDF or Word file, or redraw them in the [[plot-maker]].
- **Teach censoring:** change one 0 to a 1 in the pasted data and watch how the curve and the median move.

## The fine print

- The group sizes, death counts, medians, p value and hazard ratios come from the paper's Results. Our data set is **simulated** to match them; it is not the study's data.
- Our simulated hazard ratio (0.27) is close to the paper's (0.25) but not the same, because the real death times are not evenly spread.
- The power figure assumes exponential survival and light censoring. Real studies with more dropouts would have less power.
- A historical control is not a randomised one. Differences in age, timing and care may explain part of the gap, as the authors say.
- General education only, not veterinary advice.
