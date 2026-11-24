---
title: "How precise is a six-reversal staircase, really?"
summary: "A 2026 study measures tactile memory span with a three-correct-one-wrong staircase and reports 3.84 and 4.88 items. We rebuild the procedure in fibub's threshold fitter: it aims at 79.37 % correct, and one run is worth about half an item."
tools: [staircase-threshold-fitter, signal-detection-calculator, experiment-design, sample-size]
updated: 2026-11-24
sources:
  - "Yeganeh, N., Makarov, I., Unnthorsson, R. and Kristjánsson, Á. (2026), Assessing Spatial and Spatiotemporal Tactile Working Memory Using Adaptive Staircase Procedures, Sensors 26(8): 2361, doi:10.3390/s26082361. Licence CC BY 4.0, checked in the Crossref record for the DOI and on the MDPI article page, 2026-11-24. Values used here: 10 healthy adults (7 men, 3 women), aged 26 to 40 (mean 33.6, SD 5.6); the sequence length rose by one item after three consecutive correct responses and fell by one after a single error; each staircase ran to six reversals and the threshold was the mean sequence length over those reversals; the rule is described as converging on about 79 % correct; thresholds 3.84 items (SD 0.3) for ordered recall and 4.88 items (SD 0.8) for unordered recall."
  - "Levitt, H. (1971), Transformed up-down methods in psychoacoustics, Journal of the Acoustical Society of America 49: 467-477 (the p^down = 0.5 convergence rule)."
  - "Wichmann, F. A. and Hill, N. J. (2001), The psychometric function: I. Fitting, sampling and goodness of fit, Perception and Psychophysics 63: 1293-1313 (maximum-likelihood fits and the parametric bootstrap)."
paper:
  title: "Assessing Spatial and Spatiotemporal Tactile Working Memory Using Adaptive Staircase Procedures"
  authors: "Yeganeh N, Makarov I, Unnthorsson R, Kristjánsson Á"
  journal: "Sensors"
  year: 2026
  doi: "10.3390/s26082361"
  url: "https://www.mdpi.com/1424-8220/26/8/2361"
  licence: "CC BY 4.0"
  reviewed: true
---

An **adaptive staircase** finds a person's limit without testing every level: make the task harder when they do well, easier when they fail, and the levels pile up around the limit. A 2026 paper in *Sensors* uses one to measure **tactile working memory span** — how many vibration positions on the arm a person can play back in order — and reports 3.84 items for ordered recall and 4.88 for unordered. We rebuilt the exact procedure with the maths behind the [[staircase-threshold-fitter]]: the rule's target comes out at 79.37 % correct, matching the paper's stated 79 %, and a single six-reversal run turns out to be worth about half an item. For the neighbouring jobs, see [[signal-detection-calculator]] and [[experiment-design]].

## The paper in brief

Ten adults felt sequences of vibrations delivered to the forearm and had to reproduce them, in order (Experiment 1) or in any order (Experiment 2). The **sequence length** was the staircase level: after **three correct answers in a row** it went up by one item; after **a single error** it came down by one. Each staircase ran until **six reversals** (changes of direction), and the threshold for that person was the mean sequence length at those reversals.

The results: 3.84 items (SD 0.3) for ordered recall, 4.88 (SD 0.8) when order did not matter — the familiar finding that remembering *what* is easier than remembering *what, then what*. The authors describe their rule as converging on "approximately 79 % correct".

## Checked with the tools

The [[staircase-threshold-fitter]] runs exactly these rules against a simulated observer, computes the reversal mean, and then fits a psychometric function by maximum likelihood with a bootstrap interval. One detail of bookkeeping: the tool treats a **lower** level as the harder one, while here a **longer** sequence is harder, so throughout we give it minus the sequence length and read the answers back without the minus sign.

**Step 1: where does the rule actually aim?** For a transformed up-down rule needing *d* correct answers in a row to step toward harder, the level it settles on is the one where the chance of getting *d* in a row is one half: p = 0.5^(1/d). The tool's `target` returns **0.7937** for d = 3 — so "approximately 79 %" is right, and more precisely 79.37 %. For comparison, the much more common two-correct rule aims at 70.71 %, and one-correct at 50 %. This matters when comparing spans across papers: a 79.4 % span is shorter than a 70.7 % span for the same person.

**Step 2: how precise is one run?** We built simulated observers whose true 79.4 % span is exactly 3.84 items, gave them the paper's rule, stopped at the sixth reversal and took the reversal mean — 3,000 times over. Because the paper does not state the psychometric **slope** of its task, we tried three (0.8, 1.2 and 2 per item; **our assumption**), along with a guess rate of 0 and a 2 % lapse rate:

| Assumed slope | Mean estimate | SD of the estimate | Trials per staircase |
|---|---|---|---|
| 0.8 per item | 3.45 items | 0.69 | 28.5 |
| 1.2 per item | 3.55 items | 0.55 | 27.4 |
| 2.0 per item | 3.63 items | 0.42 | 26.0 |

Two things fall out. The procedure is **cheap**: about 26 to 29 trials per person. And it is **noisy**: one run on one person pins the span to roughly ±0.4 to ±0.7 items, and it also sits 0.2 to 0.4 items low, because a staircase that starts easy spends its first reversals walking down towards the target. Figure 1 shows a single run.

<!-- fig:track -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="A simulated staircase under the paper's rule: three correct answers in a row lengthen the sequence by one item, one error shortens it. It stops at the sixth reversal, after 25 trials, and the mean of the reversals is 4.00 items against a true span of 3.84." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>One staircase, the paper's rule, six reversals</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">One staircase, the paper's rule, six reversals</text><line x1="58" x2="546" y1="226.7" y2="226.7" style="stroke:var(--line)"/><text x="52" y="230.7" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="156" y2="156" style="stroke:var(--line)"/><text x="52" y="160" text-anchor="end" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="85.3" y2="85.3" style="stroke:var(--line)"/><text x="52" y="89.3" text-anchor="end" style="fill:var(--muted)">6</text><line x1="139.3" x2="139.3" y1="262" y2="266" style="stroke:var(--muted)"/><text x="139.3" y="279" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="241" x2="241" y1="262" y2="266" style="stroke:var(--muted)"/><text x="241" y="279" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="342.7" x2="342.7" y1="262" y2="266" style="stroke:var(--muted)"/><text x="342.7" y="279" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="444.3" x2="444.3" y1="262" y2="266" style="stroke:var(--muted)"/><text x="444.3" y="279" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="546" x2="546" y1="262" y2="266" style="stroke:var(--muted)"/><text x="546" y="279" text-anchor="middle" style="fill:var(--muted)">25</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Trial</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Sequence length (items)</text><line x1="58" x2="546" y1="161.7" y2="161.7" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="156.7" text-anchor="end" style="fill:var(--muted)">true span 3.84</text><line x1="58" x2="546" y1="156" y2="156" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="151" text-anchor="end" style="fill:var(--muted)">reversal mean 4.00</text><path d="M58 226.7L78.3 226.7L98.7 226.7L119 191.3L139.3 191.3L159.7 191.3L180 156L200.3 156L220.7 156L241 120.7L261.3 156L281.7 156L302 156L322.3 120.7L342.7 120.7L363 156L383.3 191.3L403.7 191.3L424 191.3L444.3 156L464.7 156L485 156L505.3 191.3L525.7 191.3L546 191.3" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="241" cy="120.7" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="302" cy="156" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="342.7" cy="120.7" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="424" cy="191.3" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="485" cy="156" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="546" cy="191.3" r="4" style="fill:var(--c-tools);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Level</text><circle cx="125" cy="36" r="4" style="fill:var(--c-tools)"/><text x="136" y="40" style="fill:var(--muted)">Reversal</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. A simulated staircase under the paper's rule, with the Threshold fitter's maths. Three correct answers in a row add an item, one error takes one away; it stops at the sixth reversal, here after 25 trials. The mean of the six reversals, 4.00 items, is the paper's threshold measure; the true span we gave the observer was 3.84.</figcaption></figure>
<!-- /fig:track -->

**Step 3: what a between-person SD of 0.3 means.** The paper's SDs — 0.3 items for ordered recall, 0.8 for unordered — are usually read as individual differences. But each person's threshold carries the measurement noise from step 2, so some scatter appears even if everyone is identical. We simulated 2,000 studies of ten identical observers each (dropping the first two reversals, which helps), and recorded the SD each study would report:

| Assumed slope | Typical ten-person SD | 5th to 95th percentile | Chance of seeing 0.3 or less | Chance of 0.8 or more |
|---|---|---|---|---|
| 0.8 per item | 0.64 | 0.41 to 0.92 | 0.7 % | 18 % |
| 1.2 per item | 0.49 | 0.31 to 0.72 | 4 % | 2 % |
| 2.0 per item | 0.37 | 0.23 to 0.52 | 25 % | 0 % |

Both of the paper's numbers sit inside the range that ten *identical* observers would produce (Figure 2). So the data are consistent with real individual differences in tactile span, and equally consistent with none: with ten people and one staircase each, the design cannot separate them. The reported 0.3 is only likely if the underlying psychometric function is steep (around 2 per item); a shallow task would rarely give an SD that small.

<!-- fig:spread -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="For ten simulated observers with exactly the same true span, the standard deviation of their six-reversal staircase thresholds, over 2,000 simulated studies, for three assumed psychometric slopes. The paper's two reported SDs, 0.3 and 0.8 items, both fall inside this spread." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Ten identical observers still scatter</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Ten identical observers still scatter</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--line)"/><text x="52" y="266" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="217.9" y2="217.9" style="stroke:var(--line)"/><text x="52" y="221.9" text-anchor="end" style="fill:var(--muted)">0.05</text><line x1="58" x2="546" y1="173.8" y2="173.8" style="stroke:var(--line)"/><text x="52" y="177.8" text-anchor="end" style="fill:var(--muted)">0.1</text><line x1="58" x2="546" y1="129.7" y2="129.7" style="stroke:var(--line)"/><text x="52" y="133.7" text-anchor="end" style="fill:var(--muted)">0.15</text><line x1="58" x2="546" y1="85.6" y2="85.6" style="stroke:var(--line)"/><text x="52" y="89.6" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="58" y1="262" y2="266" style="stroke:var(--muted)"/><text x="58" y="279" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="151.8" x2="151.8" y1="262" y2="266" style="stroke:var(--muted)"/><text x="151.8" y="279" text-anchor="middle" style="fill:var(--muted)">0.25</text><line x1="245.7" x2="245.7" y1="262" y2="266" style="stroke:var(--muted)"/><text x="245.7" y="279" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="339.5" x2="339.5" y1="262" y2="266" style="stroke:var(--muted)"/><text x="339.5" y="279" text-anchor="middle" style="fill:var(--muted)">0.75</text><line x1="433.4" x2="433.4" y1="262" y2="266" style="stroke:var(--muted)"/><text x="433.4" y="279" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="527.2" x2="527.2" y1="262" y2="266" style="stroke:var(--muted)"/><text x="527.2" y="279" text-anchor="middle" style="fill:var(--muted)">1.25</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Standard deviation across ten observers (items)</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Share of simulated studies</text><line x1="170.6" x2="170.6" y1="50" y2="262" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="174.6" y="62" text-anchor="start" style="fill:var(--muted)">paper: 0.3</text><line x1="358.3" x2="358.3" y1="50" y2="262" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="362.3" y="76" text-anchor="start" style="fill:var(--muted)">paper: 0.8</text><path d="M76.8 262L95.5 262L114.3 262L133.1 261.6L151.8 258.5L170.6 257.6L189.4 248.8L208.2 229.4L226.9 214.8L245.7 180.4L264.5 156.6L283.2 146.9L302 153.1L320.8 160.6L339.5 177.8L358.3 207.8L377.1 208.6L395.8 225L414.6 241.3L433.4 251.9L452.2 258.5L470.9 258.9L489.7 260.7L508.5 261.6L527.2 262L546 262" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M76.8 262L95.5 262L114.3 261.1L133.1 255.8L151.8 247L170.6 222.3L189.4 195.8L208.2 147.8L226.9 122.6L245.7 107.6L264.5 149.5L283.2 169.4L302 197.2L320.8 225.8L339.5 243.9L358.3 249.2L377.1 255.8L395.8 259.8L414.6 261.6L433.4 262L452.2 261.6L470.9 262L489.7 262L508.5 262L527.2 262L546 262" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M76.8 262L95.5 262L114.3 256.7L133.1 225.8L151.8 174.2L170.6 103.7L189.4 76.3L208.2 69.3L226.9 142L245.7 206.4L264.5 240.4L283.2 251L302 255.4L320.8 261.1L339.5 261.6L358.3 262L377.1 262L395.8 262L414.6 262L433.4 262L452.2 262L470.9 262L489.7 262L508.5 262L527.2 262L546 262" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">slope 0.8</text><line x1="148.8" x2="160.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="164.8" y="40" style="fill:var(--muted)">slope 1.2</text><line x1="239.6" x2="251.6" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="255.6" y="40" style="fill:var(--muted)">slope 2</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The standard deviation of ten six-reversal thresholds when all ten observers are identical (true span 3.84 items), over 2,000 simulated studies, for three assumed psychometric slopes. Both of the paper's reported SDs sit inside the range the procedure produces on its own.</figcaption></figure>
<!-- /fig:spread -->

**Step 4: pooling the staircases pays for itself.** The same simulated ten observers generated 351 trials across 6 sequence lengths. Fitting a single psychometric function to all of them by maximum likelihood gives a span of **3.80 items** with a bootstrap standard error of **0.13** — a third of the noise of a single reversal mean, from exactly the same trials, and it also returns a slope (1.46 against the 1.2 we put in) that the reversal mean cannot give at all. For a group threshold, fit the pooled curve; keep the reversal mean for the per-person number and for a quick check.

| Check | Paper | Tool |
|---|---|---|
| Level the rule converges on | "approximately 79 %" | 79.37 % (0.5^⅓) |
| Ordered-recall threshold | 3.84 items, SD 0.3 | 0.3 is inside what 10 identical observers give (4 to 25 % of the time, depending on slope) |
| Unordered threshold | 4.88 items, SD 0.8 | 0.8 is likewise inside it (up to 18 %) |
| Precision of one run | not stated | ±0.4 to ±0.7 items, about 27 trials |
| Pooled psychometric fit | not done | 3.80 items, bootstrap SE 0.13 |

## How we made the graphs

Both charts and every number here come from `scripts/blog-figures/tactile-working-memory-staircase-threshold-79-percent.mjs` in fibub's public code. It calls `target`, `psi`, `inverse`, `simulateStair`, `reversalMean`, `group`, `fitPF`, `bootRaw` and `bootSummary` from `src/lib/sci/staircase.ts` and the seeded generator `rng` from `src/lib/sci/sdt-optim.ts` — the maths behind the [[staircase-threshold-fitter]].

The rule (three correct up, one wrong down, steps of one item, six reversals, threshold as the reversal mean), the two thresholds, the two SDs and the ten participants are stated values from the paper. The psychometric slopes, the guess and lapse rates, the start level of two items, the 1-to-9 item limits, the random seeds and the decision to drop the first two reversals in step 3 are **our assumptions**. Every observer in this article is simulated; none of the paper's trial data is public.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/staircase-threshold-fitter.mjs`, which pins the fitter and the staircases against independent references:

- a fixed eight-level data set must fit a logistic with α 4.08569097 and β 0.78564804, matching `scipy.optimize.minimize` on the same binomial likelihood, with a log-likelihood of −146.09423972;
- with the lapse rate free, λ must come out at 0.03974887 and the 75 % threshold at 3.99593029; the Weibull and cumulative-normal shapes have their own pinned values;
- the staircases are checked against scripted answers and against the convergence points of Levitt (1971) and Kaernbach (1991), so `target` must return 0.7071 for the two-correct rule and the weighted rule must return up/(up + down).
- New with this article: the paper's three-correct rule must give a target of 0.5^(1/3) = 0.79370053, and the worked example below must give a 79.4 % threshold of −3.4025 with a reversal mean of −3.625 over its last eight reversals.

## Check it yourself

On the [[staircase-threshold-fitter]], with **Simulate** chosen:

1. Under *Staircase*, set *Rule* to **1-up-3-down (79.4 %)** — the tool's name for the paper's three-correct rule. Set *Start level* **−2**, *Step down* **1**, *Step up* **1**, *Steps are* **Added (linear)**, *Trials* **120**, *Lowest level* **−9**, *Highest level* **−1**, and **untick** *Halve the steps after the 2nd and 4th reversal* (the paper kept one item throughout).
2. Under *Simulated observer*, set *True threshold α* **−5.05**, *Slope β* **1.2**, *Guess rate γ* **0**, *Lapse rate λ* **0.02**, *Random seed* **1**.
3. In the *Fit* card, leave *Shape* **Logistic**, set *Guess rate γ* **0**, *Lapse rate λ* **0.02**, *Threshold at (% correct)* **79.4**, *Bootstrap samples* **500**.
4. The *Threshold* card reads **79.4 % threshold = −3.403** (a span of 3.40 items), with *Midpoint α* **−4.95**, *Slope β* **0.9381**, *Deviance* **2.391 on 4 df**, *Trials, levels* **120, 6**, *Reversal mean* **−3.625** (last 8 reversals, after the first 2), *Staircase aims at* **79.4 % correct** and *True level at that %* **−3.841**.
5. The bootstrap finishes at a 95 % interval of about **−4.058 to −2.847** with a standard error of **0.3256**. Both estimates undershoot the true −3.841, and the interval is more than an item wide: that is the precision of one staircase, in one screen.
6. Change *Random seed* to 2, 3, 4… and watch the threshold move by a few tenths of an item each time. That spread is what step 3 above measures.

## What researchers can use it for

- **Say which percent-correct your span is.** Run [[staircase-threshold-fitter]] once with each rule and compare: the same observer gives a shorter span under a 79.4 % rule than under 70.7 %.
- **Work out how many reversals you need** before you run anyone, by simulating your own task's slope and reading the SD of the estimate.
- **Judge a reported SD.** Simulate identical observers under the published rule; if the procedure alone would give that much scatter, the paper's SD is not evidence of individual differences.
- **Pool trials and fit the curve** for any group-level threshold: same data, roughly a third of the noise, plus a slope and a bootstrap interval.
- **Plan the sample size** for a comparison of two conditions with [[sample-size]], using the measurement noise from your simulation as part of the SD, not just the between-person part.

## The fine print

- Every observer here is **simulated**. The paper's own trial-by-trial data are not published, so nothing in this article recomputes its thresholds; we recompute the properties of its *procedure*.
- The psychometric slope, guess rate and lapse rate are our assumptions, and the conclusions in step 3 depend on the slope, which is why we report three.
- The paper does not state its start level or how many reversals it dropped; a higher start or a different drop shifts the bias in step 2 (we show a start of two items and drops of 0 and 2).
- Sequence length is a whole number, so a staircase threshold is quantised in quarters or sixths of an item; that granularity is part of the noise we measure.
- Memory span is not a sensory threshold, so the psychometric function is a model of convenience here, as it is in the paper's own rule.
