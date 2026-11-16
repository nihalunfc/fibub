---
title: "Fluoroquinolones for brucellosis: meta-analysis of relapse and failure"
summary: "A PLOS NTDs meta-analysis of 9 trials finds fluoroquinolone regimens fail brucellosis more often. We recheck its I², p-values and Egger tests with fibub's Meta-analysis tool."
tools: [meta-analysis]
updated: 2026-11-16
sources:
  - "Mohammadi-Sartang, M., Rafieipour, N., Afrasiabian, S., Mahmoudi, R., Moradi, Y., Karimi, M. and Servatyari, K. (2026), Efficacy and safety of fluoroquinolones in the treatment of human brucellosis: a systematic review and meta-analysis, PLOS Neglected Tropical Diseases 20(10): e0013822, doi:10.1371/journal.pntd.0013822. Licence CC BY 4.0, checked on the journal page, 2026-11-16. Values used here, from the article's text: 9 randomised trials, 602 patients, 10 to 178 per trial; therapeutic failure RR 2.11 (1.26 to 3.51), p = 0.004, 8 trials, Q = 3.02 (7 df), I² 0 %; relapse RR 1.88 (0.94 to 3.74), p = 0.07, 7 trials, Q = 4.84 (6 df); adverse events RR 0.62 (0.29 to 1.33), p = 0.22, 7 trials, Q = 12.68 (6 df), I² 52.70 %; time to defervescence MD 1.20 days (0.66 to 1.74), z = 4.36, Q = 0.12 (3 df); Egger intercepts -0.631 (-2.06 to 0.80, t = -1.08, p = 0.32), 1.81 (-0.66 to 4.28, t = 1.88, p = 0.11), 1.86 (-2.15 to 5.13, t = 1.54, p = 0.12) and -0.16 (-2.45 to 2.10, t = -0.31, p = 0.78); leave-one-out without one 2009 trial: failure RR 1.80 (0.94 to 3.43), relapse RR 2.67 (1.14 to 6.26)."
  - "DerSimonian, R. and Laird, N. (1986), Meta-analysis in clinical trials, Controlled Clinical Trials 7, 177-188; Higgins, J. P. T. and Thompson, S. G. (2002), Quantifying heterogeneity in a meta-analysis, Statistics in Medicine 21, 1539-1558 (I²); Egger, M. et al. (1997), Bias in meta-analysis detected by a simple, graphical test, BMJ 315, 629-634."
  - "Higgins, J. P. T., Thompson, S. G. and Spiegelhalter, D. J. (2009), A re-evaluation of random-effects meta-analysis, J. R. Stat. Soc. A 172, 137-159 (the prediction interval)."
  - "Reference values in fibub's tests: Python statsmodels 0.15, stats.meta_analysis (combine_effects, effectsize_2proportions, effectsize_smd)."
paper:
  title: "Efficacy and safety of fluoroquinolones in the treatment of human brucellosis: A systematic review and meta-analysis"
  authors: "Mohammadi-Sartang, M.; Rafieipour, N.; Afrasiabian, S.; Mahmoudi, R.; Moradi, Y.; Karimi, M.; Servatyari, K."
  journal: "PLOS Neglected Tropical Diseases"
  year: 2026
  doi: "10.1371/journal.pntd.0013822"
  url: "https://journals.plos.org/plosntds/article?id=10.1371/journal.pntd.0013822"
  licence: "CC BY 4.0"
  reviewed: true
---

Brucellosis is a bacterial infection people catch from goats, sheep, cattle and camels, often through unpasteurised milk or cheese. It causes long fevers and joint pain, and it is common across the Middle East, Central Asia and parts of Africa. Standard treatment combines doxycycline with rifampicin or streptomycin for six weeks or more, and relapses are common. **Fluoroquinolones** such as ciprofloxacin and ofloxacin have been tried instead, because they reach the bacteria inside cells and are taken by mouth. A new meta-analysis in PLOS Neglected Tropical Diseases pools the randomised trials. This article shows how fibub's [[meta-analysis]] tool checks the numbers a review like this reports, and what its heterogeneity and funnel-plot features tell a reader.

## The paper in brief

The authors found **9 randomised trials with 602 patients**, from 10 to 178 per trial, comparing fluoroquinolone-based regimens with standard ones. They pooled each outcome as a **risk ratio** (RR: the risk with fluoroquinolones divided by the risk with standard treatment, so above 1 means more often with fluoroquinolones).

- **Treatment failure** was about twice as common with fluoroquinolones: RR **2.11** (95 % interval 1.26 to 3.51), from 8 trials, with no sign of disagreement between them (I² = 0 %).
- **Relapse** pointed the same way, RR **1.88**, but the interval (0.94 to 3.74) includes 1, so it is not conclusive.
- **Side effects** were less common, RR **0.62**, but the interval (0.29 to 1.33) is wide and the trials disagree (I² = 52.7 %).
- **Fever** took about **1.2 days longer** to settle.

The authors conclude that fluoroquinolones should not replace standard regimens as first choice. The results lean on a few small trials: leaving out one 2009 trial makes the failure result inconclusive and the relapse result significant.

## Checked with the tools

The text gives pooled results but not each trial's counts (those are in the supplementary files), so we did two things. First, we **recomputed** the summary numbers the text states, to see that they hang together. Second, we built **seven made-up trials** to show the features a reader needs to judge a result like the side-effect one: random effects, I², tau², the prediction interval and the funnel plot. The made-up trials are ours, not the paper's.

**Step 1: do the intervals, p-values and I² agree?** A 95 % interval for a risk ratio is symmetric on the log scale, so its standard error (SE) is (ln upper − ln lower) ÷ (2 × 1.96), and its centre is √(lower × upper). From that, z = ln RR ÷ SE gives the p-value. I² is (Q − df) ÷ Q when Q is bigger than its degrees of freedom (df), and 0 otherwise. Every check matches:

| Check | Paper says | Recomputed with the tool's maths |
|---|---|---|
| Failure: centre, p | RR 2.11, p = 0.004 | 2.103, p = 0.0043 |
| Relapse: centre, p | RR 1.88, p = 0.07 | 1.875, p = 0.073 |
| Side effects: centre, p | RR 0.62, p = 0.22 | 0.621, p = 0.219 |
| Side effects: I², p of Q | 52.70 %, p = 0.05 | 52.68 %, p = 0.048 |
| Failure: p of Q = 3.02 on 7 df | 0.88 | 0.883 |
| Fever: z from MD 1.20 (0.66 to 1.74) | z = 4.36 | z = 4.36 |

<!-- fig:pooled -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 260" role="img" aria-label="Therapeutic failure RR 2.11 (1.26 to 3.51) lies wholly above 1; relapse RR 1.88 (0.94 to 3.74) and adverse events RR 0.62 (0.29 to 1.33) cross 1." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Fluoroquinolone regimens vs standard: pooled risk ratios</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Fluoroquinolone regimens vs standard: pooled risk ratios</text><line x1="58" x2="546" y1="183.7" y2="183.7" style="stroke:var(--line)"/><text x="52" y="187.7" text-anchor="end" style="fill:var(--muted)">-1</text><line x1="58" x2="546" y1="123" y2="123" style="stroke:var(--line)"/><text x="52" y="127" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="62.3" y2="62.3" style="stroke:var(--line)"/><text x="52" y="66.3" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="58" y1="214" y2="218" style="stroke:var(--muted)"/><text x="58" y="231" text-anchor="middle" style="fill:var(--muted)">0.5</text><line x1="139.3" x2="139.3" y1="214" y2="218" style="stroke:var(--muted)"/><text x="139.3" y="231" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="220.7" x2="220.7" y1="214" y2="218" style="stroke:var(--muted)"/><text x="220.7" y="231" text-anchor="middle" style="fill:var(--muted)">1.5</text><line x1="302" x2="302" y1="214" y2="218" style="stroke:var(--muted)"/><text x="302" y="231" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="383.3" x2="383.3" y1="214" y2="218" style="stroke:var(--muted)"/><text x="383.3" y="231" text-anchor="middle" style="fill:var(--muted)">2.5</text><line x1="464.7" x2="464.7" y1="214" y2="218" style="stroke:var(--muted)"/><text x="464.7" y="231" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="546" x2="546" y1="214" y2="218" style="stroke:var(--muted)"/><text x="546" y="231" text-anchor="middle" style="fill:var(--muted)">3.5</text><line x1="58" x2="546" y1="214" y2="214" style="stroke:var(--muted)"/><text x="302" y="252" text-anchor="middle" style="fill:var(--ink)">1 = failure, 2 = relapse, 3 = adverse events</text><text transform="translate(14 123) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Risk ratio (log scale: ln RR)</text><line x1="58" x2="546" y1="123" y2="123" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="118" text-anchor="end" style="fill:var(--muted)">RR = 1 (no difference)</text><circle cx="139.3" cy="77.7" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="302" cy="84.7" r="5" style="fill:var(--c-blog);opacity:1"/><circle cx="464.7" cy="152" r="5" style="fill:var(--c-blog);opacity:1"/><line x1="139.3" x2="139.3" y1="108.7" y2="46.6" style="stroke:var(--c-blog)"/><line x1="302" x2="302" y1="126.6" y2="42.9" style="stroke:var(--c-blog)"/><line x1="464.7" x2="464.7" y1="198.2" y2="105.8" style="stroke:var(--c-blog)"/></svg><figcaption>Figure 1. The paper's three pooled risk ratios with their 95 % intervals, drawn on the log scale where the intervals are symmetric. Values from the paper's text.</figcaption></figure>
<!-- /fig:pooled -->

**Step 2: the Egger tests.** Egger's test looks for **small-study effects**: if small trials show bigger benefits than large ones, perhaps because small negative trials went unpublished, a regression of each trial's effect against its precision has an intercept away from zero. The paper reports the intercept, its interval, t and p for four outcomes. With k trials the test has k − 2 degrees of freedom, so we can rebuild the interval and p from the intercept and t:

| Outcome (trials) | Paper: interval, p | Recomputed: interval, p |
|---|---|---|
| Failure (8) | −2.06 to 0.80, p = 0.32 | −2.06 to 0.80, p = 0.32 |
| Relapse (7) | −0.66 to 4.28, p = 0.11 | −0.66 to 4.28, p = 0.12 |
| Side effects (7) | −2.15 to 5.13, p = 0.12 | −1.24 to 4.96, p = 0.18 |
| Fever (4) | −2.45 to 2.10, p = 0.78 | −2.38 to 2.06, p = 0.79 |

Three of four agree to rounding (relapse gives p = 0.119 against the stated 0.11). For side effects, the paper's interval is not centred on its intercept of 1.86 (its midpoint is 1.49), and t = 1.54 on 5 df gives p = 0.18, not 0.12. Either the intercept, t or the interval has a typing slip; the conclusion (no clear small-study effect) holds either way. With only 7 trials Egger's test has little power, which is why reviewers are told not to rely on it below 10 trials.

**Step 3: what I² = 53 % means, on made-up trials.** We made seven small trials of side effects with fluoroquinolones against standard treatment, with I² near the paper's. The Meta-analysis tool gives:

- **Fixed effect** (one true effect for all trials): RR **0.595** (0.399 to 0.888), p = 0.011, apparently a clear benefit.
- **Random effects** (DerSimonian-Laird, letting the true effect vary between trials): RR **0.614** (0.308 to 1.223), p = 0.17, inconclusive. Q = 14.93 on 6 df, **I² = 59.8 %**, tau² = 0.473.
- **95 % prediction interval** (where the effect in a new trial would likely fall): **0.084 to 4.47**, from strongly protective to strongly harmful.
- **REML** and **Paule-Mandel** estimates of tau² (0.493 and 0.486) give almost the same answer here.

The fixed model gives the biggest trial 35 % of the weight; random effects spreads the weight more evenly (21 % for the same trial), which widens the interval. This is why the paper switched to random effects for side effects, and why a pooled RR of 0.62 with I² above 50 % should be read as "uncertain", not "safer". Figure 2 shows the same trials as a funnel plot: two lie just outside the funnel, which is what heterogeneity looks like.

<!-- fig:funnel -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Seven made-up trials scatter round a pooled ln RR of -0.49; two lie outside the funnel, which is what an I² of 59.8 % looks like." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Funnel plot of seven simulated trials</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Funnel plot of seven simulated trials</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="127.7" y2="127.7" style="stroke:var(--line)"/><text x="52" y="131.7" text-anchor="end" style="fill:var(--muted)">0.5</text><line x1="58" x2="546" y1="205.4" y2="205.4" style="stroke:var(--line)"/><text x="52" y="209.4" text-anchor="end" style="fill:var(--muted)">1</text><line x1="75.1" x2="75.1" y1="252" y2="256" style="stroke:var(--muted)"/><text x="75.1" y="269" text-anchor="middle" style="fill:var(--muted)">-3</text><line x1="160.7" x2="160.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="160.7" y="269" text-anchor="middle" style="fill:var(--muted)">-2</text><line x1="246.4" x2="246.4" y1="252" y2="256" style="stroke:var(--muted)"/><text x="246.4" y="269" text-anchor="middle" style="fill:var(--muted)">-1</text><line x1="332" x2="332" y1="252" y2="256" style="stroke:var(--muted)"/><text x="332" y="269" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="417.6" x2="417.6" y1="252" y2="256" style="stroke:var(--muted)"/><text x="417.6" y="269" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="503.2" x2="503.2" y1="252" y2="256" style="stroke:var(--muted)"/><text x="503.2" y="269" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">ln risk ratio (simulated trials)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Standard error</text><line x1="290.2" x2="290.2" y1="50" y2="252" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="294.2" y="62" text-anchor="start" style="fill:var(--muted)">random effects</text><circle cx="258.2" cy="136.5" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="385.4" cy="231.3" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="251.6" cy="103.3" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="385.4" cy="139" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="198.2" cy="143.2" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="365.3" cy="121.2" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="194.2" cy="208" r="4.5" style="fill:var(--c-blog);opacity:1"/><path d="M69.4 252L287.5 50L505.7 252" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Simulated trial</text><line x1="192" x2="204" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:5 4"/><text x="208" y="40" style="fill:var(--muted)">95 % funnel</text></svg><figcaption>Figure 2. Funnel plot made with the Meta-analysis tool's maths for seven made-up trials (not the paper's trials): each trial's log risk ratio against its standard error, with the 95 % funnel round the fixed-effect estimate.</figcaption></figure>
<!-- /fig:funnel -->

## How we made the graphs

The script `scripts/blog-figures/fluoroquinolones-brucellosis-meta-analysis-heterogeneity-egger.mjs` does both parts. For the recomputation it uses `normInv`, `normCdf`, `tInv` and `tTwoSided` from `src/lib/sci/stats.ts` and `chi2Sf` from `src/lib/sci/survival.ts`, the same functions the Meta-analysis tool uses for its p-values and Q test; every input is a number from the paper's text, listed in the sources. For the made-up trials it calls `parseStudies` and `metaAnalysis` from `src/lib/sci/meta.ts`, exactly what the tool runs on pasted trials. The seven trials' counts were written by fibub to give an I² near 53 % and a pooled RR near 0.6; they are not the paper's trials. The script prints every number above and writes both charts into the article.

## How we test the maths

`tests/sci-tools/meta-analysis.mjs` pins the tool to Python's statsmodels 0.15 on made-up trials. Among its checks:

- Eight trials as odds ratios: Cochran's **Q = 10.991066** (p = 0.139009) and **I² = 0.363119**; DerSimonian-Laird **tau² = 0.0967840**; random-effects **OR 0.6475 (0.4462 to 0.9397)**, p = 0.022170.
- The same trials' **prediction interval**, ln OR −1.326615 to 0.457359 (t with 6 df), and **Egger intercept −0.690683** (SE 1.199368), p = 0.585637.
- **REML tau² 0.00611016** and Paule-Mandel 0.180076; risk ratio pooling with DL tau² 0.0669058; hazard ratios entered as intervals, random HR 0.825801 (0.705450 to 0.966684).

They run on every change to the site with `npm test`.

## Check it yourself

1. Open the [[meta-analysis|Meta-analysis]] tool and press **Events**.
2. Replace the example with these seven made-up trials (study, events and total with fluoroquinolones, events and total with standard treatment):

```
Trial A	4	40	9	38
Trial B	2	15	1	14
Trial C	10	90	25	88
Trial D	7	30	4	32
Trial E	3	45	14	44
Trial F	10	60	7	62
Trial G	1	12	5	12
```

3. Set *Measure* to **Risk ratio**, *Main result* to **Random effects**, *Between-study variance* to **DerSimonian-Laird** and *Level* to **95 %**.
4. The result reads **Random effects: Risk ratio 0.614 (95 % CI 0.308 to 1.223)**. Under it: *Fixed effect* 0.595 (0.399 to 0.888), *Heterogeneity Q* 14.930 on 6 df, *I²* **59.8 %**, *95 % prediction interval* **0.084 to 4.474**, and *Egger's test* intercept 0.350.
5. Switch *Main result* to **Fixed effect** and watch the interval shrink and stop crossing 1; then try **REML** and **Paule-Mandel**.
6. For a paper that gives only pooled results, press **Effect + CI** and enter each trial's ratio and interval; the tool works out each SE from the interval, as we did in Step 1.

## What researchers can use it for

- **Recheck a review's numbers.** Enter the per-trial counts from a review's forest plot or supplement into the [[meta-analysis]] tool and compare the pooled RR, I² and tau².
- **Judge heterogeneity.** Read the prediction interval beside the confidence interval: a wide one says the effect differs from setting to setting.
- **Try the analysis choices.** Fixed against random effects, and three tau² estimators, in one click each, to see whether a conclusion depends on them.
- **Look for small-study effects** with the funnel plot and Egger's test, remembering both are weak with fewer than 10 trials.
- **Teach** evidence-based medicine with made-up trials, as here, without any patient data leaving the browser.

## The fine print

- This is general education, not medical advice. Brucellosis treatment follows national and WHO guidance; check the official source.
- Step 1 recomputes summary numbers from the paper's text. Step 3 and Figure 2 use made-up trials; none of it is the paper's trial data.
- Recomputing a p-value from a rounded interval can differ slightly in the last digit.
- We did not have the trials' counts, so we could not rerun the paper's own pooling or its leave-one-out analyses.
