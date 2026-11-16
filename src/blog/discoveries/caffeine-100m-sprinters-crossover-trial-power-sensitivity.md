---
title: "Caffeine and sprint times: what a 21-sprinter crossover trial can detect"
summary: "A crossover trial finds 3 and 6 mg/kg caffeine cut 60-m sprint times. We check its power sensitivity analysis and estimate how many sprinters smaller effects would need, with fibub's sample size calculator."
tools: [sample-size, uncertainty-calculator, plot-maker]
updated: 2026-11-16
sources:
  - "Mei, T., Li, J. and Yang, X. (2026), Acute doses of 3 and 6 mg/kg caffeine produce outcome- and phase-specific improvements in male 100-m sprinters: A randomized, double-blind, placebo-controlled crossover trial, PLOS ONE 21(11): e0361864, doi:10.1371/journal.pone.0361864. Licence CC BY 4.0, checked on the journal page, 2026-11-16. Values used here, from the Methods and Results: 21 male sprinters, no dropouts; no a priori power calculation; sensitivity: 80% power for dz = 0.64 at two-sided α = 0.05 and dz = 0.76 at α = 0.0167; reductions in time vs placebo with 95% CI: 10 m, 0.056 s (0.033 to 0.078) and 0.075 s (0.053 to 0.097); 60 m, 0.123 s (0.086 to 0.160) and 0.175 s (0.138 to 0.212) for 3 and 6 mg/kg; 6 vs 3 mg/kg at 10 m 0.019 s (Holm p = 0.085)."
  - "Paired t-test power with the noncentral t distribution: Cohen, J. (1988), Statistical Power Analysis for the Behavioral Sciences, 2nd ed.; R's power.t.test."
paper:
  title: "Acute doses of 3 and 6 mg/kg caffeine produce outcome- and phase-specific improvements in male 100-m sprinters: A randomized, double-blind, placebo-controlled crossover trial"
  authors: "Mei T, Li J, Yang X"
  journal: "PLOS ONE"
  year: 2026
  doi: "10.1371/journal.pone.0361864"
  url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0361864"
  licence: "CC BY 4.0"
  reviewed: true
---

Caffeine is one of the few supplements with good evidence for helping athletes. A new trial tested it on 21 male 100-m sprinters, each of whom ran after a placebo, a moderate dose and a higher dose, on different days and without knowing which. Both doses cut sprint times, and the higher dose cut them more. A study this size raises a question every researcher should ask: how big an effect could 21 people reliably detect, and how many would a follow-up need? This article answers it with the [[sample-size]] calculator, the same maths the authors' check relies on. The [[uncertainty-calculator]] helps when you combine timing errors, and the [[plot-maker]] draws your own power curves.

This is general education about a study's statistics, not advice on taking caffeine. High doses can cause side effects; check with a doctor or sports dietitian.

## The paper in brief

The trial was **randomised, double-blind, placebo-controlled and crossover**. *Crossover* means every sprinter tried every condition, so each one is compared with himself. That removes the large differences between athletes and makes small changes easier to see. The doses were 3 and 6 mg of caffeine per kg of body weight, about 210 and 420 mg for a 70 kg sprinter.

The main results, as reductions in time against placebo:

- **10 m:** 0.056 s with 3 mg/kg, 0.075 s with 6 mg/kg.
- **60 m:** 0.123 s and 0.175 s. All were clear (p < 0.001 after correcting for several comparisons).
- **6 against 3 mg/kg:** clearly better at 30 and 60 m, but at 10 m the 0.019 s gap was not significant (p = 0.085).

Reaction time at the start and jump height also improved. The authors note that they did not calculate the sample size in advance. Instead they report a **sensitivity analysis**: the smallest effect 21 sprinters could detect with 80% power. That is the number we check.

## Checked with the tools

We used the paper's sample size, effect sizes and confidence intervals with the Sample size calculator's maths: exact power for a paired t test from the noncentral t distribution, as in R's `power.t.test`.

**Step 1: the sensitivity analysis.** The effect size for a paired design is **dz**: the mean difference divided by the standard deviation (SD) of the differences. With 21 sprinters and 80% power, the tool gives the smallest detectable dz as **0.643** at the usual 5% level, and **0.761** at 0.05 ÷ 3 = 0.0167, the stricter level for three comparisons. The paper says 0.64 and 0.76: an exact match (Figure 1).

<!-- fig:power -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="With 21 sprinters, a paired comparison has 80% power for dz of 0.64 at alpha 0.05 and 0.76 at alpha 0.0167." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Power of a 21-sprinter crossover, by effect size</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Power of a 21-sprinter crossover, by effect size</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="227.6" y2="227.6" style="stroke:var(--line)"/><text x="52" y="231.6" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="183.2" y2="183.2" style="stroke:var(--line)"/><text x="52" y="187.2" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="138.8" y2="138.8" style="stroke:var(--line)"/><text x="52" y="142.8" text-anchor="end" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="94.4" y2="94.4" style="stroke:var(--line)"/><text x="52" y="98.4" text-anchor="end" style="fill:var(--muted)">0.8</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="210.5" x2="210.5" y1="272" y2="276" style="stroke:var(--muted)"/><text x="210.5" y="289" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="363" x2="363" y1="272" y2="276" style="stroke:var(--muted)"/><text x="363" y="289" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="515.5" x2="515.5" y1="272" y2="276" style="stroke:var(--muted)"/><text x="515.5" y="289" text-anchor="middle" style="fill:var(--muted)">1.5</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Standardised difference dz (mean ÷ SD of differences)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Power</text><line x1="58" x2="546" y1="94.4" y2="94.4" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="89.4" text-anchor="end" style="fill:var(--muted)">80% power</text><line x1="254" x2="254" y1="50" y2="272" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="250" y="62" text-anchor="end" style="fill:var(--muted)">dz 0.64</text><line x1="290.2" x2="290.2" y1="50" y2="272" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="294.2" y="78" text-anchor="start" style="fill:var(--muted)">0.76</text><path d="M73.3 262.9L80.9 260.6L88.5 257.8L96.1 254.5L103.8 250.7L111.4 246.3L119 241.2L126.6 235.6L134.3 229.3L141.9 222.3L149.5 214.8L157.1 206.7L164.8 198.2L172.4 189.2L180 179.9L187.6 170.4L195.3 160.8L202.9 151.1L210.5 141.6L218.1 132.4L225.8 123.4L233.4 114.9L241 106.8L248.6 99.4L256.3 92.5L263.9 86.2L271.5 80.6L279.1 75.6L286.8 71.2L294.4 67.4L302 64.1L309.6 61.4L317.3 59L324.9 57.1L332.5 55.6L340.1 54.3L347.7 53.3L355.4 52.5L363 51.9L370.6 51.4L378.3 51L385.9 50.7L393.5 50.5L401.1 50.4L408.7 50.3L416.4 50.2L424 50.1L431.6 50.1L439.3 50.1L446.9 50L454.5 50L462.1 50L469.8 50L477.4 50L485 50L492.6 50L500.2 50L507.9 50L515.5 50L523.1 50L530.8 50" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M73.3 268.8L80.9 267.8L88.5 266.5L96.1 265L103.8 263.2L111.4 261L119 258.3L126.6 255.2L134.3 251.6L141.9 247.4L149.5 242.6L157.1 237.3L164.8 231.3L172.4 224.8L180 217.6L187.6 210L195.3 201.8L202.9 193.2L210.5 184.3L218.1 175.1L225.8 165.8L233.4 156.4L241 147.1L248.6 137.9L256.3 129L263.9 120.4L271.5 112.2L279.1 104.6L286.8 97.5L294.4 90.9L302 85L309.6 79.6L317.3 74.9L324.9 70.7L332.5 67L340.1 63.9L347.7 61.3L355.4 59L363 57.1L370.6 55.6L378.3 54.4L385.9 53.4L393.5 52.6L401.1 52L408.7 51.5L416.4 51.1L424 50.8L431.6 50.6L439.3 50.4L446.9 50.3L454.5 50.2L462.1 50.1L469.8 50.1L477.4 50.1L485 50L492.6 50L500.2 50L507.9 50L515.5 50L523.1 50L530.8 50" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">α = 0.05</text><line x1="141.6" x2="153.6" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:5 4"/><text x="157.6" y="40" style="fill:var(--muted)">α = 0.0167 (three comparisons)</text><text class="fibub-mark" x="546" y="18" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Power of a paired t test with 21 sprinters against the standardised difference, from the Sample size calculator's maths, at the usual 5% level and at 0.05 ÷ 3 for three comparisons.</figcaption></figure>
<!-- /fig:power -->

**Step 2: how big were the real effects?** A paired confidence interval is the mean ± *t* × SD ÷ √*n*. Working backwards from the 60-m interval for 3 mg/kg (0.086 to 0.160 s), the SD of the differences is about **0.081 s**, so dz ≈ **1.5**. For 6 mg/kg it is about **2.2**. These are far above 0.64, so the study had near 100% power for its main findings. This is our estimate: the paper's intervals come from its own models, not a plain paired t test.

**Step 3: the small effect it could not confirm.** At 10 m, 6 mg/kg beat 3 mg/kg by only 0.019 s. If the SD of that difference is like the 10-m SD for 3 mg/kg against placebo (about **0.049 s**, our assumption), dz ≈ **0.39**. With 21 sprinters the power to detect that is only about **39%**. To reach 80% a follow-up would need about **56 sprinters** (Figure 2). So "not significant" here means "too small for this study to see", not "no difference".

<!-- fig:need -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="Sprinters needed for 80% power fall steeply with the effect size: about 56 for dz 0.38, 21 for dz 0.64." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Sprinters needed for 80% power (paired, α = 0.05)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Sprinters needed for 80% power (paired, α = 0.05)</text><line x1="58" x2="546" y1="253.9" y2="253.9" style="stroke:var(--line)"/><text x="52" y="257.9" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="209" y2="209" style="stroke:var(--line)"/><text x="52" y="213" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="164.1" y2="164.1" style="stroke:var(--line)"/><text x="52" y="168.1" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="104.8" y2="104.8" style="stroke:var(--line)"/><text x="52" y="108.8" text-anchor="end" style="fill:var(--muted)">50</text><line x1="58" x2="546" y1="59.9" y2="59.9" style="stroke:var(--line)"/><text x="52" y="63.9" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="33.6" y2="33.6" style="stroke:var(--line)"/><text x="52" y="37.6" text-anchor="end" style="fill:var(--muted)">150</text><line x1="58" x2="58" y1="254" y2="258" style="stroke:var(--muted)"/><text x="58" y="271" text-anchor="middle" style="fill:var(--muted)">0.25</text><line x1="148.4" x2="148.4" y1="254" y2="258" style="stroke:var(--muted)"/><text x="148.4" y="271" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="238.7" x2="238.7" y1="254" y2="258" style="stroke:var(--muted)"/><text x="238.7" y="271" text-anchor="middle" style="fill:var(--muted)">0.75</text><line x1="329.1" x2="329.1" y1="254" y2="258" style="stroke:var(--muted)"/><text x="329.1" y="271" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="419.5" x2="419.5" y1="254" y2="258" style="stroke:var(--muted)"/><text x="419.5" y="271" text-anchor="middle" style="fill:var(--muted)">1.25</text><line x1="509.9" x2="509.9" y1="254" y2="258" style="stroke:var(--muted)"/><text x="509.9" y="271" text-anchor="middle" style="fill:var(--muted)">1.5</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--muted)"/><text x="302" y="292" text-anchor="middle" style="fill:var(--ink)">Standardised difference dz</text><text transform="translate(14 143) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Sprinters needed (log scale)</text><line x1="58" x2="546" y1="161" y2="161" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="156" text-anchor="end" style="fill:var(--muted)">this study: 21</text><line x1="106.7" x2="106.7" y1="32" y2="254" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="110.7" y="44" text-anchor="start" style="fill:var(--muted)">CAF6 vs CAF3, 10 m (≈0.38)</text><path d="M58 43.9L68.8 58L79.7 71.2L90.5 83L101.4 93L112.2 102.2L123.1 111.6L133.9 119.2L144.8 127.9L155.6 133.7L166.4 142.3L177.3 147.1L188.1 152.3L199 158L209.8 164.1L220.7 167.4L231.5 174.7L242.4 178.6L253.2 182.8L264 187.2L274.9 192L285.7 192L296.6 197.2L307.4 202.9L318.3 202.9L329.1 209L340 209L350.8 209L361.6 215.9L372.5 215.9L383.3 215.9L394.2 223.5L405 223.5L415.9 223.5L426.7 223.5L437.6 232.1L448.4 232.1L459.2 232.1L470.1 232.1L480.9 232.1L491.8 242.1L502.6 242.1L513.5 242.1L524.3 242.1L535.2 242.1L546 242.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="292" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Sprinters needed for 80% power in a paired design, from the Sample size calculator's maths. The marked effect is our estimate from the paper's confidence intervals.</figcaption></figure>
<!-- /fig:need -->

| Check | Paper | Tool result |
|---|---|---|
| Detectable dz, 80% power, α = 0.05 | 0.64 | 0.643 |
| Same at α = 0.0167 | 0.76 | 0.761 |
| Effect size, 60 m, 3 mg/kg | (as g, range 0.90 to 1.66 for all timed outcomes) | dz ≈ 1.5 from the CI |
| Power for 6 vs 3 mg/kg at 10 m | p = 0.085 | about 39% (our SD estimate) |
| Sprinters for 80% power at that effect | (not reported) | about 55 to 56 |

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/caffeine-100m-sprinters-crossover-trial-power-sensitivity.mjs` in fibub's public code. It calls the functions behind the [[sample-size]] calculator, from `src/lib/sci/power.ts`:

- `powerT` gives the exact power of a paired t test for a sample size, effect size and significance level;
- `solveN` finds the smallest sample size that reaches a target power;
- `tInv` from `src/lib/sci/stats.ts` gives the *t* value used to turn the paper's intervals back into SDs.

From the paper: 21 sprinters, the reported sensitivity values, and the reductions with their 95% intervals. Our assumptions, labelled in the script: the intervals are treated as paired-t intervals, and the SD of the 6 against 3 mg/kg difference at 10 m is taken to equal the SD of 3 mg/kg against placebo at 10 m.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks the power maths against R and SciPy:

- A two-group t test with effect size 0.5 needs **63.77** per group for 80% power (R's `power.t.test` gives 63.77), and 64 per group gives power **0.80146**.
- A paired t test with 10 pairs and dz = 1 has power **0.80310**, as SciPy's noncentral t gives.
- Two proportions, 50% against 75%, need **76.7** per group for 90% power.

## Check it yourself

On the [[sample-size]] calculator:

1. Set *Comparing* to **Paired or before-after means**.
2. Type **0.643** in *Difference to detect* and **1** in *Standard deviation* (so the difference is in SD units). Leave *Significance level α* on **0.05** and *Power* on **0.8**.
3. The answer reads **21 pairs**, with *Power with that n* about **0.800**: the paper's sensitivity analysis.
4. Now type **0.019** in *Difference to detect* and **0.049** in *Standard deviation*. The answer reads **55 pairs**. (Our script uses 0.0494 s and gets 56.)
5. The calculator's α menu offers 0.01, 0.05 and 0.1, so it cannot do the 0.0167 check directly. Choose **0.01** for a stricter bound: the same 0.643 then needs **32 pairs**.

## What researchers can use it for

- **Plan a crossover or before-after study:** type the smallest change that matters and the SD of the changes into the [[sample-size]] calculator.
- **Write a sensitivity analysis** when the sample size was fixed by availability, as here: find the smallest effect the study could detect.
- **Read a "not significant" result fairly:** work out the power for the effect that was seen before calling it "no effect".
- **Recover an SD from a confidence interval** in a paper, then use it to plan the next study.
- **Combine timing errors** (gate timing, reaction) with the [[uncertainty-calculator]] before deciding what difference is worth detecting.

## The fine print

- The sample size, sensitivity values and confidence intervals come from the paper. The SDs and dz values in Steps 2 and 3 are our estimates from those intervals, assuming paired-t intervals.
- The SD of the 6 against 3 mg/kg difference is an assumption; the true one could be larger or smaller, and the 56 would change with it.
- Power with several comparisons depends on the correction used; the paper uses Holm's method, which is less strict than dividing α by three.
- General education only, not advice on caffeine use.
