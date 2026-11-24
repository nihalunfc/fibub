---
title: "Waist-to-height 0.50 in preschoolers: how often it flags, and agrees with waist percentiles"
summary: "A 2026 study of 1,518 Italian 3 to 5 year olds compares waist-to-height 0.50 with a waist percentile. We recompute its means, kappas and agreement with the anthropometric indices and diagnostic tools."
tools: [anthropometric-indices, diagnostic-test-calculator, body-measures]
updated: 2026-11-24
sources:
  - "Spiezia, C., Branda, F., Almanza, A., Tomaselli, A., Di Francesco, L., Di Rosa, C., Ciccozzi, M., Morino, G. S., Khazrai, Y. M. and De Gara, L. (2026), Central adiposity in early childhood: a cross-sectional comparison of waist-to-height ratio and waist circumference percentiles, Frontiers in Pediatrics 14: 1885267, doi:10.3389/fped.2026.1885267. Licence CC BY 4.0 (the Crossref record; no correction or retraction listed; the publisher page confirms Creative Commons Attribution), checked 2026-11-24. Values used here: 1,518 children aged 3 to 5; waist-to-height ratio (WHtR) mean and SD by BMI group (normal weight 950, 0.487 and 0.032; at risk of overweight 261, 0.524 and 0.030; overweight 206, 0.521 and 0.037; obesity 101, 0.558 and 0.049); counts at WHtR 0.50 or more (304, 212, 149, 92); the 2 x 2 counts of WHtR 0.50 against the 90th percentile of waist circumference of Fernandez and colleagues in each BMI group; the paper's kappa range of 0.046 to 0.196 and overall WHtR of 0.503 with SD 0.040."
  - "Waist-to-height ratio = waist / height; kappa = (observed agreement - agreement expected by chance) / (1 - agreement expected by chance), Cohen (1960). Sensitivity and specificity with Wilson intervals from the Diagnostic test calculator."
paper:
  title: "Central adiposity in early childhood: a cross-sectional comparison of waist-to-height ratio and waist circumference percentiles"
  authors: "Spiezia C, Branda F, Almanza A, Tomaselli A, Di Francesco L, Di Rosa C, Ciccozzi M, Morino GS, Khazrai YM, De Gara L"
  journal: "Frontiers in Pediatrics"
  year: 2026
  doi: "10.3389/fped.2026.1885267"
  url: "https://www.frontiersin.org/journals/pediatrics/articles/10.3389/fped.2026.1885267/full"
  licence: "CC BY 4.0"
  reviewed: true
---

A common rule of thumb says a person's waist should be less than half their height: a **waist-to-height ratio (WHtR)** under 0.50. A 2026 paper in *Frontiers in Pediatrics* asks how that adult rule behaves in children of 3 to 5 years, by comparing it with a waist-circumference percentile for age. Its tables print enough numbers to recompute most of its results, which makes it a good example for the [[anthropometric-indices]] tool, which turns waist and height into the ratio. The agreement between the two rules is measured with the [[diagnostic-test-calculator]], and for body mass index and body surface area see the [[body-measures]] calculator. This article describes what the numbers show, not what any family should do.

## The paper in brief

The study is a secondary analysis of a school-based project in Lazio, Italy, run from late 2023 to early 2025. Of 1,542 preschool children, 1,518 had complete waist and height data (787 boys, 731 girls; mean age 4.0 years). By BMI category, 950 were normal weight, 261 at risk of overweight, 206 overweight and 101 had obesity. The overall WHtR was 0.503 (SD 0.040). The authors compare the WHtR 0.50 rule with the 90th percentile of waist circumference from a published reference, in each BMI group, and report Cohen's kappa (a measure of agreement beyond chance) between 0.046 and 0.196, which they call slight. We use the paper's own tables and add nothing from outside.

## Checked with the tools

This is a **recomputation** from the paper's printed group means, SDs and counts.

**Step 1: the overall mean and SD.** Weighting the four group means by group size gives an overall mean WHtR of **0.5027**, the paper's 0.503. Combining the within-group spread (SDs) and between-group spread gives an overall SD of **0.0402**, the paper's 0.040. So the table and the headline figure agree.

**Step 2: what 0.50 means in centimetres.** The tool's WHtR is waist divided by height. For a child 100 cm tall (about the middle of this age range; the heights of 95, 100, 105 and 110 cm are **our assumption**, as the paper's table did not print height), a ratio of 0.50 is a **waist of 50 cm** and 0.60 is 60 cm. At 95 cm the waist for 0.50 is 47.5 cm, at 105 cm 52.5 cm, at 110 cm 55 cm. Typing each pair into the tool returns exactly 0.50.

**Step 3: how many children cross 0.50.** In the normal-weight group, 304 of 950 children (**32.0 %**) have a WHtR of 0.50 or more. If WHtR were a bell curve with that group's mean (0.487) and SD (0.032), we would expect **34.2 %**; for the other groups the paper counts 81.2, 72.3 and 91.1 % and the bell curve predicts **78.8, 71.5 and 88.2 %** (Figure 1). The bell curve is a good guide in the middle but it is a little low for the highest group, so the real distribution is not a perfect bell. Because the mean WHtR of normal-weight children (0.487) is below 0.50 by only 0.4 of an SD, a large share of them sits over the cut-off however healthy they are.

<!-- fig:normal -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="The share of children with a waist-to-height ratio of 0.50 or more in each BMI group, as counted (32.0, 81.2, 72.3, 91.1 %) and as a bell curve with the group's mean and SD would predict (34.2, 78.8, 71.5, 88.2 %)." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Share at WHtR 0.50 or more: seen against a bell curve</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Share at WHtR 0.50 or more: seen against a bell curve</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--line)"/><text x="52" y="246" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="203.6" y2="203.6" style="stroke:var(--line)"/><text x="52" y="207.6" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="165.2" y2="165.2" style="stroke:var(--line)"/><text x="52" y="169.2" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="126.8" y2="126.8" style="stroke:var(--line)"/><text x="52" y="130.8" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="88.4" y2="88.4" style="stroke:var(--line)"/><text x="52" y="92.4" text-anchor="end" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">100</text><line x1="119" x2="119" y1="242" y2="246" style="stroke:var(--muted)"/><text x="119" y="259" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="241" x2="241" y1="242" y2="246" style="stroke:var(--muted)"/><text x="241" y="259" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="363" x2="363" y1="242" y2="246" style="stroke:var(--muted)"/><text x="363" y="259" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="485" x2="485" y1="242" y2="246" style="stroke:var(--muted)"/><text x="485" y="259" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">BMI group (1 = normal weight to 4 = obesity)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Share of children (%)</text><circle cx="119" cy="180.6" r="5" style="fill:var(--ink);opacity:1"/><circle cx="241" cy="86.1" r="5" style="fill:var(--ink);opacity:1"/><circle cx="363" cy="103.2" r="5" style="fill:var(--ink);opacity:1"/><circle cx="485" cy="67.1" r="5" style="fill:var(--ink);opacity:1"/><circle cx="119" cy="176.3" r="5" style="fill:var(--c-tools);opacity:1"/><circle cx="241" cy="90.7" r="5" style="fill:var(--c-tools);opacity:1"/><circle cx="363" cy="104.7" r="5" style="fill:var(--c-tools);opacity:1"/><circle cx="485" cy="72.7" r="5" style="fill:var(--c-tools);opacity:1"/><circle cx="63" cy="36" r="4" style="fill:var(--ink)"/><text x="74" y="40" style="fill:var(--muted)">Seen (paper)</text><circle cx="175.4" cy="36" r="4" style="fill:var(--c-tools)"/><text x="186.4" y="40" style="fill:var(--muted)">Bell curve from mean and SD</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Share of children at a waist-to-height ratio of 0.50 or more in each BMI group: counted (black) and predicted from the group mean and SD with a bell curve (blue).</figcaption></figure>
<!-- /fig:normal -->

**Step 4: agreement with the waist percentile.** Treat the waist 90th percentile as the reference and WHtR 0.50 as the test (a framing of ours; the paper does not call either one a gold standard). Adding the four groups' table counts gives 141 children flagged by both, 5 by the percentile only, 616 by WHtR only and 756 by neither, which is all 1,518. The percentile flags **146** children (**9.6 %**), as a 90th percentile should (about 10 %); the WHtR rule flags **757**, almost **half (49.9 %)**. The diagnostic-test tool then gives: WHtR catches **96.6 %** of the percentile's positives (sensitivity) but clears only **55.1 %** of its negatives (specificity). Of the children WHtR flags, only **18.6 %** are also flagged by the percentile (Figure 2).

<!-- fig:agree -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="Treating the waist 90th percentile as the reference, WHtR 0.50 catches 89, 97, 98, 98 % of its positives but clears only 69, 21, 34, 19 % of its negatives, by BMI group." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>WHtR 0.50 against the waist 90th percentile</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">WHtR 0.50 against the waist 90th percentile</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--line)"/><text x="52" y="246" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="203.6" y2="203.6" style="stroke:var(--line)"/><text x="52" y="207.6" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="165.2" y2="165.2" style="stroke:var(--line)"/><text x="52" y="169.2" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="126.8" y2="126.8" style="stroke:var(--line)"/><text x="52" y="130.8" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="88.4" y2="88.4" style="stroke:var(--line)"/><text x="52" y="92.4" text-anchor="end" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">100</text><line x1="119" x2="119" y1="242" y2="246" style="stroke:var(--muted)"/><text x="119" y="259" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="241" x2="241" y1="242" y2="246" style="stroke:var(--muted)"/><text x="241" y="259" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="363" x2="363" y1="242" y2="246" style="stroke:var(--muted)"/><text x="363" y="259" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="485" x2="485" y1="242" y2="246" style="stroke:var(--muted)"/><text x="485" y="259" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">BMI group (1 = normal weight to 4 = obesity)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Percent</text><circle cx="119" cy="71.3" r="5" style="fill:var(--ink);opacity:1"/><circle cx="241" cy="56.5" r="5" style="fill:var(--ink);opacity:1"/><circle cx="363" cy="54.8" r="5" style="fill:var(--ink);opacity:1"/><circle cx="485" cy="53.3" r="5" style="fill:var(--ink);opacity:1"/><circle cx="119" cy="109.3" r="5" style="fill:var(--c-tools);opacity:1"/><circle cx="241" cy="202.3" r="5" style="fill:var(--c-tools);opacity:1"/><circle cx="363" cy="177.3" r="5" style="fill:var(--c-tools);opacity:1"/><circle cx="485" cy="205.5" r="5" style="fill:var(--c-tools);opacity:1"/><circle cx="63" cy="36" r="4" style="fill:var(--ink)"/><text x="74" y="40" style="fill:var(--muted)">Catches the percentile's positives</text><circle cx="333.8" cy="36" r="4" style="fill:var(--c-tools)"/><text x="344.8" y="40" style="fill:var(--muted)">Clears the percentile's negatives</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Treating the waist-circumference 90th percentile as the reference: the share of its positives that WHtR 0.50 also flags (black) and the share of its negatives that WHtR clears (blue), by BMI group.</figcaption></figure>
<!-- /fig:agree -->

**Step 5: the paper's kappas.** From each group's 2 × 2 counts we get kappa **0.066** (normal weight), **0.046** (at risk), **0.154** (overweight) and **0.196** (obesity). The paper's range of 0.046 to 0.196 is reproduced exactly: our lowest and highest match its lowest and highest. The pooled kappa across all children is **0.18**. All are in the "slight" band. The reason is not that the two rules disagree about the same children; WHtR flags nearly everyone the percentile flags (sensitivity 97 %), but it flags about five times as many children overall (757 against 146), so agreement beyond chance is small.

| Check | Paper | Tool gives |
|---|---|---|
| Overall mean WHtR | 0.503 | 0.5027 from the four groups |
| Overall SD | 0.040 | 0.0402 |
| Normal-weight share at 0.50 or more | 32.0 % | 34.2 % from a bell curve |
| Kappa, lowest to highest group | 0.046 to 0.196 | 0.046 (at risk) to 0.196 (obesity) |
| Percentile positives | not stated overall | 146 of 1,518 (9.6 %) |
| Sensitivity and specificity of WHtR 0.50 | not stated | 96.6 % and 55.1 % |

## How we made the graphs

The script `scripts/blog-figures/preschool-waist-to-height-ratio-050-vs-waist-percentile-agreement-rome.mjs` calls `indices` from `src/lib/sci/anthro.ts` (the maths of the [[anthropometric-indices]] tool), `fromTable` from `src/lib/sci/diagtest.ts` (the [[diagnostic-test-calculator]]) and `normCdf` from `src/lib/sci/distributions.ts`. The group sizes, means, SDs, counts and the 2 × 2 tables come from the paper's Tables 1 and 3; the kappa is the standard formula coded in the script. The child heights in Step 2 and the choice of reference and test are **our assumptions**.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/anthropometric-indices.mjs`, which pins every index to hand calculations and pandas (for example, waist 84 cm and height 175 cm must give a waist-to-height ratio of 0.48). New with this article: a waist of 50 cm at a height of 100 cm must give 0.50, and the 2 × 2 table of 141, 616, 5 and 756 must give a sensitivity of 96.6 % and a specificity of 55.1 %. `tests/sci-tools/diagnostic-test-calculator.mjs` already pins those measures against statsmodels.

## Check it yourself

On the [[anthropometric-indices]] page, under *Measurements* with *One person or skeleton* selected:

1. Type **Height / stature (cm)** **100** and **Waist (cm)** **50**. The *Waist-to-height ratio* shows **0.50**.
2. Change the waist to **60**: **0.60**.

On the [[diagnostic-test-calculator]], choose the *2 × 2 table* mode:

3. Type **True positives 141**, **False positives 616**, **False negatives 5** and **True negatives 756** (the percentile as the reference, WHtR as the test).
4. You should read a *Sensitivity* of about **96.6 %**, a *Specificity* of about **55.1 %** and a *Positive predictive value* of about **18.6 %**.

## What researchers can use it for

- **Checking a paper's headline numbers** against its tables: recompute an overall mean and SD from group summaries, as in Step 1.
- **Converting a ratio cut-off into a measurable waist** for a given height before planning a field survey.
- **Seeing how much a rule flags**: a cut-off that flags half of a healthy-weight sample is a screening rule, not a diagnosis.
- **Comparing two rules** with sensitivity, specificity and kappa from one 2 × 2 table, using the [[diagnostic-test-calculator]].
- **Teaching** why a high sensitivity with a low specificity gives a low positive predictive value when most children are not at risk.

## The fine print

- We only have the paper's printed group summaries. The distribution shape (the bell-curve check) uses means and SDs and is only a rough guide.
- The paper does not state which rule is the reference; our sensitivity and specificity depend on that choice and are a way of describing agreement, not accuracy.
- Heights in Step 2 are our round numbers for the age range.
- This is a recomputation of one cross-sectional study of children in one region. It is general information, not medical or growth advice; for a child's health, ask a health professional.
