---
title: "Social priming replications: effect sizes shrink from d = 0.72 to 0.14"
summary: "A 2024 review of 70 replications of social priming studies finds effects shrink by about four fifths. We put its Cohen's d values through fibub's effect size and power maths."
tools: [effect-size-converter, sample-size, hypothesis-tests]
updated: 2026-11-24
sources:
  - "Mac Giolla, E., Karlsson, S., Neequaye, D. and Bergquist, M. (2024), Evaluating the Replicability of Social Priming Studies, Meta-Psychology 8, doi:10.15626/MP.2022.3308. Licence CC BY 4.0 (Creative Commons Attribution), checked on the Meta-Psychology article page, 2026-11-24. Values used here: 70 close replications of 49 original findings; originals 3,087 participants, mean N 63, median 57; replications 30,372 participants, mean N 434, median 126; mean Cohen's d 0.72 (originals) and 0.14 (replications); 12 of 70 replications significant in the original direction; 66 of 70 smaller than the original; original effect inside the replication's 95 % interval in 17 of 70; pooled replication d 0.07 (all), 0.40 (18 same-lab replications) and 0.002 (52 independent-lab replications)."
  - "Effect size formulas and intervals: Borenstein, M., Hedges, L. V., Higgins, J. P. T. and Rothstein, H. R. (2009), Introduction to Meta-Analysis, Wiley, chapters 4 and 7; Lakens, D. (2013), Frontiers in Psychology 4: 863. Power of the t test: Cohen, J. (1988), Statistical Power Analysis for the Behavioral Sciences, 2nd ed."
paper:
  title: "Evaluating the Replicability of Social Priming Studies"
  authors: "Mac Giolla E, Karlsson S, Neequaye D, Bergquist M"
  journal: "Meta-Psychology"
  year: 2024
  doi: "10.15626/MP.2022.3308"
  url: "https://conferences.lnu.se/index.php/metapsychology/article/view/3308"
  licence: "CC BY 4.0"
  reviewed: true
---

**Social priming** is the idea that a brief, often unnoticed cue, such as words about old age or a picture of money, can change how people behave afterwards. It was one of the most famous findings in social psychology, and one of the first to wobble when labs tried to repeat the studies. A 2024 paper in *Meta-Psychology* gathered every close replication of social priming studies it could find, 70 replications of 49 original findings, and compared them with the originals. This article puts the paper's effect sizes through the [[effect-size-converter]] and the power maths of the [[sample-size]] tool to show what the shrinking numbers mean in plain terms; the [[hypothesis-tests]] tool runs the t tests behind them on raw data.

## The paper in brief

The authors searched for replications that copied an original study's method as closely as possible, then compared each pair. They measured every result as **Cohen's d**, the difference between the two groups' averages in units of their standard deviation (d = 0.2 is usually called small, 0.5 medium, 0.8 large).

The originals were small, with a median of **57 participants**, and their effects were large: a mean **d = 0.72**. The replications were bigger (median **126** participants) and their mean effect was **d = 0.14**. Only **12 of 70** replications found a significant effect in the original direction, and **66 of 70** found a smaller effect than the original. Pooled together, the replications give **d = 0.07**. The striking split is by who did the replication: **18 replications by the original authors' labs** pooled to **d = 0.40**, while **52 by independent labs** pooled to **d = 0.002**, essentially zero.

## Checked with the tools

The paper gives summary values, not each study's group sizes, so we put its **mean effects and median sample sizes** into the tools, splitting each sample into two equal groups (**our assumption**). This is a recomputation from stated summaries, not a re-analysis of the 70 studies.

**Step 1: what each d means.** The [[effect-size-converter]] turns d into easier measures. The **probability of superiority** is the chance that a random person from the primed group scores higher than a random person from the control group:

| Effect | d | 95 % interval (at the median N) | r | Probability of superiority |
|---|---|---|---|---|
| Originals, mean (N = 57) | 0.72 | 0.18 to 1.26 | 0.344 | 69.5 % |
| Replications, mean (N = 126) | 0.14 | −0.21 to 0.49 | 0.070 | 53.9 % |
| Same-lab replications, pooled | 0.40 | 0.05 to 0.75 (if N = 126) | 0.198 | 61.1 % |
| Independent replications, pooled | 0.002 | −0.35 to 0.35 (if N = 126) | 0.001 | 50.1 % |

In words: the originals implied that the primed person beats the control person about 7 times in 10; the independent replications say it is a coin toss. The pooled values come from many studies, so their real intervals are much narrower than the single-study intervals shown here.

**Step 2: why small originals report large effects.** With 57 people in two groups, an effect must be at least **d = 0.53** to reach p < .05; with 126 people the bar is 0.35. The originals' mean of 0.72 (with a spread of only 0.19 between studies, in the paper) sits just above the bar for their sample size (Figure 1). That is the pattern expected when only significant results get published: small studies can only "succeed" by overestimating, so the published effects cluster just over the line. The typical original interval, 0.18 to 1.26, is also wide enough to include the same-lab pooled value of 0.40.

<!-- fig:crit -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="The line is the smallest Cohen's d that gives p below .05 for N people. At the originals' median N of 57 it is 0.53; their mean d of 0.72 sits just above it, with a 95 % interval of 0.18 to 1.26. The typical replication (N 126, d 0.14) has an interval of -0.21 to 0.49." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>The smallest d that reaches p &lt; .05</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">The smallest d that reaches p &lt; .05</text><line x1="58" x2="546" y1="214.9" y2="214.9" style="stroke:var(--line)"/><text x="52" y="218.9" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="156" y2="156" style="stroke:var(--line)"/><text x="52" y="160" text-anchor="end" style="fill:var(--muted)">0.5</text><line x1="58" x2="546" y1="97.1" y2="97.1" style="stroke:var(--line)"/><text x="52" y="101.1" text-anchor="end" style="fill:var(--muted)">1</text><line x1="160.7" x2="160.7" y1="262" y2="266" style="stroke:var(--muted)"/><text x="160.7" y="279" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="289.2" x2="289.2" y1="262" y2="266" style="stroke:var(--muted)"/><text x="289.2" y="279" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="417.6" x2="417.6" y1="262" y2="266" style="stroke:var(--muted)"/><text x="417.6" y="279" text-anchor="middle" style="fill:var(--muted)">300</text><line x1="546" x2="546" y1="262" y2="266" style="stroke:var(--muted)"/><text x="546" y="279" text-anchor="middle" style="fill:var(--muted)">400</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Total sample size N (two equal groups)</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Cohen's d</text><line x1="58" x2="546" y1="214.9" y2="214.9" style="stroke:var(--muted);stroke-dasharray:4 4"/><path d="M58 104.2L63.1 115.1L68.3 123.4L73.4 129.9L78.5 135.2L83.7 139.5L88.8 143.3L94 146.5L99.1 149.3L104.2 151.8L109.4 154L114.5 156L119.6 157.9L124.8 159.5L129.9 161.1L135.1 162.5L140.2 163.8L145.3 165L150.5 166.1L155.6 167.2L160.7 168.1L165.9 169.1L171 169.9L176.1 170.7L181.3 171.5L186.4 172.3L191.6 173L196.7 173.7L201.8 174.4L207 175L212.1 175.6L217.2 176.1L222.4 176.6L227.5 177.1L232.7 177.7L237.8 178.1L242.9 178.6L248.1 179L253.2 179.4L258.3 179.8L263.5 180.3L268.6 180.6L273.7 181L278.9 181.3L284 181.7L289.2 182L294.3 182.4L299.4 182.7L304.6 183L309.7 183.3L314.8 183.6L320 183.9L325.1 184.1L330.3 184.4L335.4 184.7L340.5 185L345.7 185.2L350.8 185.4L355.9 185.7L361.1 185.9L366.2 186.2L371.3 186.4L376.5 186.5L381.6 186.7L386.8 187L391.9 187.2L397 187.3L402.2 187.6L407.3 187.8L412.4 187.9L417.6 188.2L422.7 188.3L427.9 188.5L433 188.6L438.1 188.9L443.3 189L448.4 189.1L453.5 189.3L458.7 189.4L463.8 189.6L468.9 189.8L474.1 189.9L479.2 190L484.4 190.2L489.5 190.4L494.6 190.5L499.8 190.6L504.9 190.7L510 190.9L515.2 191L520.3 191.1L525.5 191.2L530.6 191.3L535.7 191.5L540.9 191.6L546 191.7" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round"/><circle cx="105.5" cy="130.1" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="194.1" cy="198.4" r="5" style="fill:var(--c-tools);opacity:1"/><path d="M105.5 193.7L105.5 66.5" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M194.1 239.6L194.1 157.2" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--muted);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">p = .05 line</text><circle cx="175.4" cy="36" r="4" style="fill:var(--c-blog)"/><text x="186.4" y="40" style="fill:var(--muted)">Originals (mean d, median N)</text><circle cx="403" cy="36" r="4" style="fill:var(--c-tools)"/><text x="414" y="40" style="fill:var(--muted)">Replications</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The smallest Cohen's d that a two-group study of N people can report as significant (grey), with the originals' mean effect at their median sample size and the replications' mean effect at theirs, each with its 95 % interval from the Effect size converter's maths. Summary values from the paper; equal group sizes are our assumption.</figcaption></figure>
<!-- /fig:crit -->

**Step 3: power.** **Power** is the chance a study finds a real effect of a given size. A typical original with 57 people has a **76.1 %** chance of significance if the true effect really were 0.72, but **31.7 %** if it were 0.40 and **4.5 %** (in the original direction) if it were 0.07 (Figure 2). If the true effect were 0.40, finding it 80 % of the time would take **100 per group**; for the replications' mean of 0.14, **802 per group**; for the pooled 0.07, **3,205 per group**. Most replications, with a median of 126 people in total, were themselves too small to detect anything but a medium effect.

<!-- fig:power -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 260" role="img" aria-label="Chance that a two-group study with 57 people reaches p &lt; .05: 4.5 % if the true d is 0.07, 31.7 % if 0.40, 76.1 % if 0.72." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Power of a typical original study (N = 57)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Power of a typical original study (N = 57)</text><line x1="58" x2="546" y1="214" y2="214" style="stroke:var(--line)"/><text x="52" y="218" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="177.6" y2="177.6" style="stroke:var(--line)"/><text x="52" y="181.6" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="141.2" y2="141.2" style="stroke:var(--line)"/><text x="52" y="145.2" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="104.8" y2="104.8" style="stroke:var(--line)"/><text x="52" y="108.8" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="68.4" y2="68.4" style="stroke:var(--line)"/><text x="52" y="72.4" text-anchor="end" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="58" y1="214" y2="218" style="stroke:var(--muted)"/><text x="58" y="231" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="139.3" x2="139.3" y1="214" y2="218" style="stroke:var(--muted)"/><text x="139.3" y="231" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="220.7" x2="220.7" y1="214" y2="218" style="stroke:var(--muted)"/><text x="220.7" y="231" text-anchor="middle" style="fill:var(--muted)">0.4</text><line x1="302" x2="302" y1="214" y2="218" style="stroke:var(--muted)"/><text x="302" y="231" text-anchor="middle" style="fill:var(--muted)">0.6</text><line x1="383.3" x2="383.3" y1="214" y2="218" style="stroke:var(--muted)"/><text x="383.3" y="231" text-anchor="middle" style="fill:var(--muted)">0.8</text><line x1="464.7" x2="464.7" y1="214" y2="218" style="stroke:var(--muted)"/><text x="464.7" y="231" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="546" x2="546" y1="214" y2="218" style="stroke:var(--muted)"/><text x="546" y="231" text-anchor="middle" style="fill:var(--muted)">1.2</text><line x1="58" x2="546" y1="214" y2="214" style="stroke:var(--muted)"/><text x="302" y="252" text-anchor="middle" style="fill:var(--ink)">True effect size d</text><text transform="translate(14 123) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Chance of p &lt; .05 (%)</text><line x1="58" x2="546" y1="68.4" y2="68.4" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="63.400000000000006" text-anchor="end" style="fill:var(--muted)">80 %</text><line x1="86.5" x2="86.5" y1="32" y2="214" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="90.5" y="44" text-anchor="start" style="fill:var(--muted)">0.07 all</text><line x1="220.7" x2="220.7" y1="32" y2="214" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="224.7" y="58" text-anchor="start" style="fill:var(--muted)">0.40 same lab</text><line x1="350.8" x2="350.8" y1="32" y2="214" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="354.8" y="72" text-anchor="start" style="fill:var(--muted)">0.72 originals</text><path d="M66.1 208.5L74.3 207.6L82.4 206.5L90.5 205.3L98.7 203.8L106.8 202.2L114.9 200.4L123.1 198.3L131.2 196.2L139.3 193.6L147.5 191.1L155.6 188.2L163.7 184.9L171.9 181.6L180 178L188.1 174L196.3 170L204.4 165.6L212.5 161L220.7 156.3L228.8 151.4L236.9 146.5L245.1 141.2L253.2 135.9L261.3 130.6L269.5 125.2L277.6 119.9L285.7 114.4L293.9 109.2L302 103.9L310.1 98.8L318.3 93.9L326.4 89L334.5 84.2L342.7 79.7L350.8 75.5L358.9 71.3L367.1 67.5L375.2 63.9L383.3 60.6L391.5 57.5L399.6 54.6L407.7 51.8L415.9 49.5L424 47.3L432.1 45.3L440.3 43.6L448.4 42L456.5 40.6L464.7 39.3L472.8 38.2L480.9 37.3L489.1 36.4L497.2 35.6L505.3 35.1L513.5 34.5L521.6 34.2L529.7 33.8L537.9 33.5L546 33.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="252" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Statistical power of a two-group study with 57 people, from the Sample size tool's maths, against the true effect. The dashed lines mark the paper's pooled replication effects and the originals' mean.</figcaption></figure>
<!-- /fig:power -->

| Check | Paper | Our tool result |
|---|---|---|
| Originals: mean d and typical N | 0.72, median N 57 | needs d ≥ 0.53 for p < .05 at N 57 |
| Replication mean d at median N | 0.14, N 126 | interval −0.21 to 0.49: not significant |
| Share of replications significant | 12 of 70 (17 %) | power 4.5 % at d 0.07, 31.7 % at d 0.40 (N 57) |
| Independent labs, pooled d | 0.002 | probability of superiority 50.1 % |

## How we made the graphs

The script `scripts/blog-figures/social-priming-replications-effect-size-shrinkage-cohens-d.mjs` in fibub's public code calls `convert` from `src/lib/sci/effsize.ts` (the [[effect-size-converter]]) for each d, its interval, r and the probability of superiority, and `powerT` and `solveN` from `src/lib/sci/power.ts` (the [[sample-size]] tool) for power and sample sizes. The p = .05 line uses `tInv` from `src/lib/sci/stats.ts`: d = t(0.975, N − 2) × √(1/n₁ + 1/n₂).

All effect sizes and sample sizes come from the paper's text. Splitting each N into two equal groups, and using the median N of 126 for the pooled replication effects, are **our assumptions**.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/effect-size-converter.mjs`, which checks every conversion against an independent Python version:

- d = 0.5 with 50 per group must give the interval 0.1019 to 0.8981, Hedges' g 0.4962 and r 0.2449, as worked out in Python from Borenstein et al. (2009).
- On random data (NumPy seed 11), d from an independent t must equal the pooled-SD d of the data, and r must equal SciPy's `pointbiserialr`.
- Round trips d → r → d, d → log odds ratio → d and d → Cliff's delta → d must return the starting value.
- New with this article: d = 0.72 with groups of 28 and 29 must give a 95 % interval of 0.184 to 1.256 and a probability of superiority of 0.6947, and the p = .05 threshold for 57 people must be d = 0.531.

## Check it yourself

On the [[effect-size-converter]]:

1. Set *Start from* to **Cohen's d** and type **0.72** in *Value of d*.
2. Type **28** in *Group 1 size* and **29** in *Group 2 size* (the originals' median of 57, split in two). Leave *Confidence level* on **95 %**.
3. The big line reads **Cohen's d = 0.72 ≈ r = 0.3441 ≈ Odds ratio = 3.691**. In the table, *Cohen's d* has the interval **0.1842 to 1.256** and *Probability of superiority* reads **0.6947**.
4. Now set *Start from* to **t statistic, two separate groups**, type **0.79** as the t value and **63** in both group sizes (the replications' mean effect at their median size): d comes out about **0.1408**, with an interval from **−0.2089 to 0.4904** that spans zero.
5. On the [[sample-size]] tool, ask for the group size that gives 80 % power for d = 0.14: about 800 per group.

## What researchers can use it for

- **Read a replication against its original**: convert both results to d with intervals in the [[effect-size-converter]] and see whether the original falls inside the replication's interval.
- **Plan a replication big enough to be informative**: size it for a realistic effect, not the original's, with the [[sample-size]] tool.
- **Translate effects for readers**: the probability of superiority turns d = 0.72 or 0.14 into a chance anyone understands.
- **Check a reported t test**: convert t and group sizes to d, and recompute p from raw data in [[hypothesis-tests]].
- **Teach the winner's curse**: show students the p = .05 line and why small significant studies overestimate effects.

## The fine print

- We used the paper's mean effects and median sample sizes; individual studies vary a lot, and the paper's own analyses use each study's real numbers.
- Equal group sizes are our assumption; unequal groups give slightly wider intervals.
- The intervals in Step 1 are for a single study of the stated size; the paper's pooled estimates are more precise than that.
- Our power figures count only significance in the original direction (the tool's convention, like R's default), which is the relevant quantity for a replication.
- The paper's abstract, results text and tables give slightly different pooled values for the same-lab and independent groups; we used the values of its main meta-analysis (0.07, 0.40 and 0.002).
