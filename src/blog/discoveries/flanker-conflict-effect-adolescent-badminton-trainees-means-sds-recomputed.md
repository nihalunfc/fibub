---
title: "Flanker task in young badminton players: checking the conflict effect"
summary: "A 2026 study gives flanker reaction times for 32 badminton trainees and 30 controls. We recompute its t and d values from means and SDs, then show how noisy one person's 100-trial conflict effect must be."
tools: [reaction-time-experiments, effect-size-converter, reliability-analysis]
updated: 2026-11-24
sources:
  - "Hu, X. (2026), Cross-sectional differences in inhibitory control between adolescent badminton trainees and age-matched non-athletes: a Flanker task study, Frontiers in Psychology 17: 1881972, doi:10.3389/fpsyg.2026.1881972. Licence CC BY 4.0, taken from the Crossref record (api.crossref.org/works, checked 2026-11-24, no update-to or correction); the page text we read did not show a licence line. Only the printed means, SDs, group sizes and test values were used."
  - "Flanker task: Eriksen and Eriksen (1974), Perception and Psychophysics 16: 143-149. Reliability and the Spearman-Brown formula: standard psychometrics (see the reliability tool's guide). Cohen's d from means and SDs: Cohen (1988), Statistical Power Analysis for the Behavioral Sciences, 2nd ed."
paper:
  title: "Cross-sectional differences in inhibitory control between adolescent badminton trainees and age-matched non-athletes: a Flanker task study"
  authors: "Hu X"
  journal: "Frontiers in Psychology"
  year: 2026
  doi: "10.3389/fpsyg.2026.1881972"
  url: "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2026.1881972/full"
  licence: "CC BY 4.0"
  reviewed: true
---

In the flanker task you see five arrows and press the key for the direction of the middle one. When the outer arrows point the other way, you are slower and make more errors: that gap is the **conflict effect**, a standard measure of how well someone ignores distraction. A 2026 paper in *Frontiers in Psychology* finds a smaller conflict effect in young badminton trainees than in classmates who do not train. It prints means, SDs and group sizes, which is enough to rebuild its tests and to ask a second question: how much of a person's own conflict effect is just noise? You can run the task yourself with the [[reaction-time-experiments]]; the [[effect-size-converter]] and the [[reliability-analysis]] do the rest.

## The paper in brief

Sixty-two adolescents (about 13.5 years old on average), 32 badminton trainees and 30 non-athletes, did 100 flanker trials each, half congruent (all arrows the same) and half incongruent. The paper excluded 71 of the 6,200 trials (1.15 %). The trainees were faster in both kinds of trial and made fewer errors on incongruent trials. Their conflict effect was smaller: 56.7 ms against 94.3 ms in the controls. Among trainees, more years of training went with a smaller effect.

## Checked with the tools

**Step 1: the printed tests follow from the printed means and SDs.** For each of the six group comparisons we typed the paper's means, SDs and group sizes into the same maths as the [[effect-size-converter]] (a pooled-variance t test with Cohen's d). The results:

| Comparison | Paper: t, d | Tool: t, d |
|---|---|---|
| Congruent RT | −2.12, −0.54 | −2.12, −0.54 |
| Incongruent RT | −4.21, −1.07 | −4.21, −1.07 |
| RT conflict effect | −5.61, −1.42 | −5.60, −1.42 |
| Congruent errors | −1.49, −0.38 | −1.50, −0.38 |
| Incongruent errors | −3.93, −1.01 | −3.98, −1.01 |
| Error conflict effect | −3.62, −0.93 | −3.66, −0.93 |

All six agree to rounding. The small gaps in the error rows come from the paper using Welch's test (different variances) for two of them. The conflict effects are also what the means say: 478.20 − 421.50 = 56.70 ms for trainees and 542.60 − 448.30 = 94.30 ms for controls. The numbers hold together.

<!-- fig:tcheck -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Six points lie close to the diagonal; the paper used Welch's test for two of the error comparisons, which explains the small gaps." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Paper against tool: t values of six group comparisons</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Paper against tool: t values of six group comparisons</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">-6</text><line x1="58" x2="546" y1="227.6" y2="227.6" style="stroke:var(--line)"/><text x="52" y="231.6" text-anchor="end" style="fill:var(--muted)">-5</text><line x1="58" x2="546" y1="183.2" y2="183.2" style="stroke:var(--line)"/><text x="52" y="187.2" text-anchor="end" style="fill:var(--muted)">-4</text><line x1="58" x2="546" y1="138.8" y2="138.8" style="stroke:var(--line)"/><text x="52" y="142.8" text-anchor="end" style="fill:var(--muted)">-3</text><line x1="58" x2="546" y1="94.4" y2="94.4" style="stroke:var(--line)"/><text x="52" y="98.4" text-anchor="end" style="fill:var(--muted)">-2</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">-1</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">-6</text><line x1="155.6" x2="155.6" y1="272" y2="276" style="stroke:var(--muted)"/><text x="155.6" y="289" text-anchor="middle" style="fill:var(--muted)">-5</text><line x1="253.2" x2="253.2" y1="272" y2="276" style="stroke:var(--muted)"/><text x="253.2" y="289" text-anchor="middle" style="fill:var(--muted)">-4</text><line x1="350.8" x2="350.8" y1="272" y2="276" style="stroke:var(--muted)"/><text x="350.8" y="289" text-anchor="middle" style="fill:var(--muted)">-3</text><line x1="448.4" x2="448.4" y1="272" y2="276" style="stroke:var(--muted)"/><text x="448.4" y="289" text-anchor="middle" style="fill:var(--muted)">-2</text><line x1="546" x2="546" y1="272" y2="276" style="stroke:var(--muted)"/><text x="546" y="289" text-anchor="middle" style="fill:var(--muted)">-1</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Paper's t</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Recomputed t (pooled)</text><path d="M58 272L546 50" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:4 4"/><circle cx="436.7" cy="99.8" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="232.7" cy="192.4" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="96.1" cy="254.4" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="498.2" cy="72" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="260" cy="182.1" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="290.3" cy="168.1" r="4.5" style="fill:var(--c-tools);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--muted);stroke-width:2;stroke-dasharray:4 4"/><text x="74" y="40" style="fill:var(--muted)">equal</text><circle cx="125" cy="36" r="4" style="fill:var(--c-tools)"/><text x="136" y="40" style="fill:var(--muted)">t</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>The paper's t values for six group comparisons, recomputed from its printed means, SDs and group sizes.</figcaption></figure>
<!-- /fig:tcheck -->

**Step 2: what the SD of the conflict effect says about reaction times.** The paper gives the SD of the *difference* between incongruent and congruent times across people (22.43 ms for trainees, 30.06 ms for controls), as well as the SD of each. From the three SDs you can work out how strongly a person's two times go together: a correlation of 0.92 in the trainees and 0.89 in the controls. People who are fast on one kind of trial are fast on the other, which is the usual finding. It also means each person's conflict effect is a small difference between two big, similar numbers.

**Step 3: how noisy is a 100-trial conflict effect?** Each person's mean time rests on only 50 trials per condition, and a mean of 50 trials with a trial-to-trial SD of σ has a noise of σ/√50. The difference of two such means has noise σ√(2/50), which is **0.2 σ**. We checked that rule with the tool's own trial lists: 3,000 simulated 100-trial runs per setting, made with the flanker list generator and summarised by the tool's own effect calculation. The simulated SD of a single run's conflict effect was 8.0, 11.9, 16.0, 20.3 and 23.5 ms for trial SDs of 40, 60, 80, 100 and 120 ms, against 8, 12, 16, 20 and 24 from the rule.

The paper does not print the trial-to-trial SD (**our assumption** is a range of 30 to 150 ms). But we can ask how much of the *observed* spread of conflict effects between people survives once the noise is taken out. With a trial SD of 60 ms, the reliability of the conflict effect, the share of its variance that is real, is 0.71 in trainees and 0.84 in controls. At 80 ms it is 0.49 and 0.72, and at 100 ms it is 0.20 and 0.56. A trial SD above **112 ms** (trainees) or **150 ms** (controls) would make the noise alone larger than the whole observed spread, which cannot be, so the true trial SD must lie below those values.

<!-- fig:rel -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Reliability falls from near 1 at a trial SD of 30 ms to zero at about 112 ms for the trainees and 150 ms for the controls." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How reliable is one person's conflict effect?</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How reliable is one person's conflict effect?</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="227.6" y2="227.6" style="stroke:var(--line)"/><text x="52" y="231.6" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="183.2" y2="183.2" style="stroke:var(--line)"/><text x="52" y="187.2" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="138.8" y2="138.8" style="stroke:var(--line)"/><text x="52" y="142.8" text-anchor="end" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="94.4" y2="94.4" style="stroke:var(--line)"/><text x="52" y="98.4" text-anchor="end" style="fill:var(--muted)">0.8</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">1</text><line x1="98.7" x2="98.7" y1="272" y2="276" style="stroke:var(--muted)"/><text x="98.7" y="289" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="180" x2="180" y1="272" y2="276" style="stroke:var(--muted)"/><text x="180" y="289" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="261.3" x2="261.3" y1="272" y2="276" style="stroke:var(--muted)"/><text x="261.3" y="289" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="342.7" x2="342.7" y1="272" y2="276" style="stroke:var(--muted)"/><text x="342.7" y="289" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="424" x2="424" y1="272" y2="276" style="stroke:var(--muted)"/><text x="424" y="289" text-anchor="middle" style="fill:var(--muted)">120</text><line x1="505.3" x2="505.3" y1="272" y2="276" style="stroke:var(--muted)"/><text x="505.3" y="289" text-anchor="middle" style="fill:var(--muted)">140</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Trial-to-trial SD of reaction time (ms), our assumption</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Reliability of the 100-trial conflict effect</text><path d="M58 65.9L98.7 78.2L139.3 94.1L180 113.5L220.7 136.5L261.3 163L302 193L342.7 226.5L383.3 263.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 58.8L98.7 65.7L139.3 74.6L180 85.4L220.7 98.2L261.3 112.9L302 129.6L342.7 148.3L383.3 168.9L424 191.5L464.7 216.1L505.3 242.6L546 271.1" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Trainees</text><line x1="141.6" x2="153.6" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="157.6" y="40" style="fill:var(--muted)">Controls</text><text class="fibub-mark" x="546" y="18" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>What the paper's SDs imply: the larger the trial-to-trial noise in one person's reaction times, the less of the spread in conflict effects is real.</figcaption></figure>
<!-- /fig:rel -->

None of this changes the group difference: the t test on 62 people already includes all the noise. But it says that, for a single teenager, 100 trials give a conflict effect that is only fairly reliable at best. By the Spearman-Brown rule, doubling to 200 trials would lift a reliability of 0.5 to 0.67, and 400 trials would be needed to reach 0.8.

## How we made the graphs

Both charts and every number come from `scripts/blog-figures/flanker-conflict-effect-adolescent-badminton-trainees-means-sds-recomputed.mjs`. It calls `makeFlanker` and `summarise` from `src/lib/sci/rtexp.ts` (the trial lists and the effect calculation of the [[reaction-time-experiments]]), `independent` and `paired` from `src/lib/sci/effectsize.ts` (the [[effect-size-converter]]) and the seeded generator of `unitroot.ts`. Group means, SDs, sizes and the paper's t and d values are from the paper's Tables 2 to 4. **Our assumptions:** trial times are normal around each condition's mean, all answers are correct, and the trial SD ranges from 30 to 150 ms; the paper gives none of these.

## How we test the maths

`tests/sci-tools/reaction-time-experiments.mjs` runs on every change to fibub:

- A made-up 40-trial flanker run must give a congruent mean of 514.333 ms, an incongruent mean of 659.75 ms and a congruency effect of 145.417 ms, as pandas computes them.
- The flanker list must have exactly the requested share of congruent trials, and every answer must match the middle arrow.
- New with this article: a 100-trial list at 50 % congruent has 50 trials per condition, and 2,000 simulated runs with a trial SD of 80 ms must give a conflict-effect SD within 8 % of 0.2 × 80 = 16 ms.

## Check it yourself

On the [[reaction-time-experiments]]:

1. Press **Flanker**, set *Trials* to **100** and *Congruent trials (%)* to **50**, then press **Start** and answer every arrow (left and right arrow keys, or F and J).
2. In the results, the table *By condition* lists **50** trials for congruent and **50** for incongruent, the same design as the paper. The headline reads *Flanker effect = … ms*.
3. Press **Start** again two or three times. Your effect changes from run to run by roughly 10 to 25 ms, even though you did not change: that is the noise of 0.2 times your own trial-to-trial SD. For comparison, the paper's group means are 56.7 ms and 94.3 ms.
4. Open the [[effect-size-converter]], leave *Start from* on **Two means and standard deviations** and enter *Group 1 mean* 56.70, *SD* 22.43, size 32, *Group 2 mean* 94.29, *SD* 30.06, size 30. You should see a Cohen's d of about **−1.42**.

## What researchers can use it for

- **Audit a report**: recompute t and d from printed means and SDs, as here, to catch a typo or a mislabelled test.
- **Judge a difference score**: before using a conflict effect as an individual measure, work out its reliability with the trial SD of your own data.
- **Plan trials**: use the 0.2 σ rule and Spearman-Brown to decide how many trials a study needs per person.
- **Teach** why two means can differ clearly in a group yet one person's difference is hard to read.
- **Reproduce the design** in a classroom: 100 trials, half incongruent, answers by key.

## The fine print

- We used only the printed summary numbers. We did not have the raw data, so the correlations and reliabilities are implied by the SDs, not measured.
- The trial-to-trial SD, normal trial times and all-correct answers are our assumptions; the reliabilities depend strongly on the trial SD, which is why we show a range.
- The paper's own Welch tests and mixed model were not recomputed beyond the pooled t tests shown.
- The study is cross-sectional: it cannot say whether training causes a smaller conflict effect or whether people with smaller effects choose to train.
- The paper's abstract and Table 4 give slightly different values for two effect sizes (1.41 against 1.42, 0.91 against 0.93); our values match the table.
