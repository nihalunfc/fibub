---
title: "Rice nutrient omission trials: which gaps are big enough to believe?"
summary: "A 2025 omission trial in eastern Uganda reports that full NPK out-yields rice without phosphorus by 23 per cent. Rebuilding the ANOVA from the paper's own means and CV shows only nitrogen clears the least significant difference."
tools: [yield-trial-anova, fertiliser-blend-calculator, soil-test-interpreter]
updated: 2026-11-24
sources:
  - "Kyalo, G., Chemining'wa, G., Apunyo, P. C., Nhamo, N., Wanyama, I. and Mussgnug, F. (2025), Indigenous nutrient supply and fertilizer use efficiency in rainfed lowland rice in eastern Uganda, Frontiers in Agronomy 7: 1609528, doi:10.3389/fagro.2025.1609528. Licence CC BY (Creative Commons Attribution), checked on the Frontiers article page, 2026-11-24. Values used here: five treatments (control, NPK, PK, NK, NP) in a randomised complete block design with each of seven farmers per season as a block, 25 m² plots harvested over a central 5 m², Bugiri district, seasons 2013A, 2014A and 2014B; rates N 58.3, P 13.2 and K 49 kg/ha from urea, triple superphosphate and muriate of potash, with N split 55 + 35 + 35 kg/ha; season grain yield means, LSD at 5 % and CV % from its Table 2; dry grain yields 4.0 (NPK) and 1.7 t/ha (control) and agronomic efficiency 18 kg grain per kg N from its Tables 3 and 4; across-season text means NPK 4.83, NP 3.8, NK 3.9, PK 3.4 and control 2.8 t/ha."
  - "Methods: K. A. Gomez and A. A. Gomez, Statistical Procedures for Agricultural Research (1984), chapter 2, for the randomised complete block analysis of variance and Fisher's LSD; H.-P. Piepho (2004), Journal of Computational and Graphical Statistics 13: 456-466, for the letters that group means."
paper:
  title: "Indigenous nutrient supply and fertilizer use efficiency in rainfed lowland rice in eastern Uganda"
  authors: "Kyalo G, Chemining'wa G, Apunyo PC, Nhamo N, Wanyama I, Mussgnug F"
  journal: "Frontiers in Agronomy"
  year: 2025
  doi: "10.3389/fagro.2025.1609528"
  url: "https://www.frontiersin.org/journals/agronomy/articles/10.3389/fagro.2025.1609528/full"
  licence: "CC BY 4.0"
  reviewed: true
---

A **nutrient omission trial** is the cheapest honest way to find out what a soil is short of. You grow one plot with everything, then plots with one nutrient left out at a time, and the yield each omission costs you is what that nutrient was worth. A 2025 paper in *Frontiers in Agronomy* ran such a trial on rainfed lowland rice in Bugiri district, eastern Uganda, and reported that full NPK yielded 73 % more than no fertiliser, 40 % more than rice without nitrogen, and 23 % and 25 % more than rice without phosphorus or without potassium. This article rebuilds the analysis of variance behind those numbers with the [[yield-trial-anova]] tool, using nothing but the means, the coefficient of variation and the number of blocks that the paper itself prints. Two other tools sit either side of it: [[fertiliser-blend-calculator]] turns the stated nutrient rates into bags of urea and potash, and [[soil-test-interpreter]] reads the soil analysis that a trial like this is meant to calibrate.

## The paper in brief

Five treatments, each in a farmer's field, over three growing seasons: **control** (nothing), **NPK** (everything), **PK** (no nitrogen), **NK** (no phosphorus) and **NP** (no potassium). Seven farmers took part per season, and each farmer is a block, so the design is a randomised complete block with seven replicates and five treatments. Plots were 25 m², harvested over a central 5 m². Rates were N 58.3, P 13.2 and K 49 kg/ha from urea, triple superphosphate and muriate of potash, with nitrogen split three ways.

Yields were low and variable, as rainfed lowland rice is: a season mean of 5.6 t/ha in 2013A, 2.6 in 2014A and 3.4 in 2014B, with coefficients of variation of 28.4 %, 20.4 % and 23.3 %. The paper goes on to estimate the **indigenous nutrient supply** (what the soil gives for free: about 55 kg N, 9 kg P and 75 kg K per hectare), recovery efficiencies, and a cheaper recommended dose. The claim this article tests is the one every reader takes away: by how much does leaving out each nutrient cut the yield?

## Checked with the tools

A **least significant difference** (LSD) is the smallest gap between two treatment means that the trial's own noise lets you call real. It is fixed by three published numbers: the residual standard deviation (here the CV times the season mean), the number of blocks, and the error degrees of freedom. For this design the error has (7 − 1) × (5 − 1) = **24 degrees of freedom**, so the two-sided *t* at 5 % is **2.0639**, and LSD = 2.0639 × √(2 × error mean square ÷ 7).

**Step 1: the LSD each season's own CV implies.**

| Season | Season mean | CV | Residual SD | LSD we get | LSD published | Blocks the published LSD would need |
|---|---|---|---|---|---|---|
| 2013A | 5.6 t/ha | 28.4 % | 1.590 t/ha | **1.755** t/ha | 0.6 | about 55 |
| 2014A | 2.6 t/ha | 20.4 % | 0.530 t/ha | **0.585** t/ha | 0.74 | 4.7 |
| 2014B | 3.4 t/ha | 23.3 % | 0.792 t/ha | **0.874** t/ha | 0.95 | 6.0 |

The last two seasons nearly fit: their published LSDs are what five to six blocks would give, not seven, which is what you would see if a farmer or two dropped out and the paper still reported a single CV. The first season does not fit at all. An LSD of 0.6 t/ha with a residual standard deviation of 1.59 t/ha would need about **55 blocks**, not seven. Something in that row is a misprint.

**Step 2: run the analysis of variance.** We built a plot sheet for each season with the published treatment means, seven farms as blocks and the error mean square the published CV implies (how, and what is assumed, is under "How we made the graphs"). The F test and its p-value do not depend on the made-up plot values at all: they follow from the five means and the error mean square. The tool gives:

| Season | Treatment F | p | Means that cannot be separated |
|---|---|---|---|
| 2013A | 2.66 | **0.057** | all five share a letter |
| 2014A | 5.28 | 0.0034 | NPK = NK = NP; control = PK |
| 2014B | 3.46 | 0.023 | NPK = NP = NK; control = PK |

For 2013A the paper reports p < 0.001, but with a CV of 28.4 % and those five means the treatment effect is **not significant at 5 %**. For the other two seasons the treatments do differ, and the pattern is the same both times: **nitrogen separates, phosphorus and potassium do not.**

<!-- fig:means -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="The five treatment means in each of the three seasons, with bars half a least significant difference long each way. Where two bars overlap, the two yields cannot be told apart at the 5 per cent level." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Rice yields by nutrient omission, with the LSD</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Rice yields by nutrient omission, with the LSD</text><line x1="58" x2="546" y1="240.3" y2="240.3" style="stroke:var(--line)"/><text x="52" y="244.3" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="176.9" y2="176.9" style="stroke:var(--line)"/><text x="52" y="180.9" text-anchor="end" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="113.4" y2="113.4" style="stroke:var(--line)"/><text x="52" y="117.4" text-anchor="end" style="fill:var(--muted)">6</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">8</text><line x1="98.7" x2="98.7" y1="272" y2="276" style="stroke:var(--muted)"/><text x="98.7" y="289" text-anchor="middle" style="fill:var(--muted)">Control</text><line x1="200.3" x2="200.3" y1="272" y2="276" style="stroke:var(--muted)"/><text x="200.3" y="289" text-anchor="middle" style="fill:var(--muted)">no N</text><line x1="302" x2="302" y1="272" y2="276" style="stroke:var(--muted)"/><text x="302" y="289" text-anchor="middle" style="fill:var(--muted)">no P</text><line x1="403.7" x2="403.7" y1="272" y2="276" style="stroke:var(--muted)"/><text x="403.7" y="289" text-anchor="middle" style="fill:var(--muted)">no K</text><line x1="505.3" x2="505.3" y1="272" y2="276" style="stroke:var(--muted)"/><text x="505.3" y="289" text-anchor="middle" style="fill:var(--muted)">NPK</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Treatment</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Grain yield (t/ha)</text><circle cx="98.7" cy="170.5" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="200.3" cy="135.6" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="302" cy="107.1" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="403.7" cy="122.9" r="3.4" style="fill:var(--c-blog);opacity:1"/><circle cx="505.3" cy="88.1" r="3.4" style="fill:var(--c-blog);opacity:1"/><line x1="98.7" x2="98.7" y1="198.3" y2="142.7" style="stroke:var(--c-blog)"/><line x1="200.3" x2="200.3" y1="163.5" y2="107.8" style="stroke:var(--c-blog)"/><line x1="302" x2="302" y1="134.9" y2="79.3" style="stroke:var(--c-blog)"/><line x1="403.7" x2="403.7" y1="150.8" y2="95.1" style="stroke:var(--c-blog)"/><line x1="505.3" x2="505.3" y1="115.9" y2="60.2" style="stroke:var(--c-blog)"/><circle cx="98.7" cy="243.5" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="200.3" cy="230.8" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="302" cy="211.7" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="403.7" cy="211.7" r="3.4" style="fill:var(--c-tools);opacity:1"/><circle cx="505.3" cy="211.7" r="3.4" style="fill:var(--c-tools);opacity:1"/><line x1="98.7" x2="98.7" y1="252.7" y2="234.2" style="stroke:var(--c-tools)"/><line x1="200.3" x2="200.3" y1="240.1" y2="221.5" style="stroke:var(--c-tools)"/><line x1="302" x2="302" y1="221" y2="202.5" style="stroke:var(--c-tools)"/><line x1="403.7" x2="403.7" y1="221" y2="202.5" style="stroke:var(--c-tools)"/><line x1="505.3" x2="505.3" y1="221" y2="202.5" style="stroke:var(--c-tools)"/><circle cx="98.7" cy="218.1" r="3.4" style="fill:var(--ink);opacity:1"/><circle cx="200.3" cy="211.7" r="3.4" style="fill:var(--ink);opacity:1"/><circle cx="302" cy="186.4" r="3.4" style="fill:var(--ink);opacity:1"/><circle cx="403.7" cy="183.2" r="3.4" style="fill:var(--ink);opacity:1"/><circle cx="505.3" cy="180" r="3.4" style="fill:var(--ink);opacity:1"/><line x1="98.7" x2="98.7" y1="231.9" y2="204.2" style="stroke:var(--ink)"/><line x1="200.3" x2="200.3" y1="225.6" y2="197.9" style="stroke:var(--ink)"/><line x1="302" x2="302" y1="200.2" y2="172.5" style="stroke:var(--ink)"/><line x1="403.7" x2="403.7" y1="197.1" y2="169.3" style="stroke:var(--ink)"/><line x1="505.3" x2="505.3" y1="193.9" y2="166.2" style="stroke:var(--ink)"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">2013A</text><circle cx="125" cy="36" r="4" style="fill:var(--c-tools)"/><text x="136" y="40" style="fill:var(--muted)">2014A</text><circle cx="187" cy="36" r="4" style="fill:var(--ink)"/><text x="198" y="40" style="fill:var(--muted)">2014B</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Treatment means in the three seasons (paper, Table 2), each with a bar half a least significant difference long either way. The LSD comes from the season's own published CV and seven farms as blocks. Bars that overlap mean the two treatments cannot be separated at the 5 % level.</figcaption></figure>
<!-- /fig:means -->

**Step 3: the gaps the paper highlights are smaller than the noise.** Full NPK minus no-phosphorus is 0.60 t/ha in 2013A, 0.00 in 2014A and 0.20 in 2014B. Full NPK minus no-potassium is 1.10, 0.00 and 0.10 t/ha. Every one of those six gaps is below its season's LSD. The nitrogen gap (NPK minus PK) is 1.50, 0.60 and 1.00 t/ha, and so is the control gap (2.60, 1.00, 1.20) — those clear the LSD in the last two seasons.

<!-- fig:gaps -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="In every season the yield lost by leaving out phosphorus or potassium is smaller than the least significant difference worked out from the trial own coefficient of variation, so neither omission can be detected." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Can the P and K omissions be detected?</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Can the P and K omissions be detected?</text><line x1="58" x2="546" y1="251.8" y2="251.8" style="stroke:var(--line)"/><text x="52" y="255.8" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="201.4" y2="201.4" style="stroke:var(--line)"/><text x="52" y="205.4" text-anchor="end" style="fill:var(--muted)">0.5</text><line x1="58" x2="546" y1="150.9" y2="150.9" style="stroke:var(--line)"/><text x="52" y="154.9" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="100.5" y2="100.5" style="stroke:var(--line)"/><text x="52" y="104.5" text-anchor="end" style="fill:var(--muted)">1.5</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">2</text><line x1="98.7" x2="98.7" y1="272" y2="276" style="stroke:var(--muted)"/><text x="98.7" y="289" text-anchor="middle" style="fill:var(--muted)">2013A</text><line x1="302" x2="302" y1="272" y2="276" style="stroke:var(--muted)"/><text x="302" y="289" text-anchor="middle" style="fill:var(--muted)">2014A</text><line x1="505.3" x2="505.3" y1="272" y2="276" style="stroke:var(--muted)"/><text x="505.3" y="289" text-anchor="middle" style="fill:var(--muted)">2014B</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Season</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Difference in yield (t/ha)</text><path d="M98.7 74.7L302 192.8L505.3 163.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="98.7" cy="191.3" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="302" cy="251.8" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="505.3" cy="231.6" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="98.7" cy="140.8" r="4" style="fill:var(--ink);opacity:1"/><circle cx="302" cy="251.8" r="4" style="fill:var(--ink);opacity:1"/><circle cx="505.3" cy="241.7" r="4" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">LSD from the published CV</text><circle cx="269" cy="36" r="4" style="fill:var(--c-tools)"/><text x="280" y="40" style="fill:var(--muted)">NPK − no P</text><circle cx="367" cy="36" r="4" style="fill:var(--ink)"/><text x="378" y="40" style="fill:var(--muted)">NPK − no K</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The yield gap between full NPK and the plots without phosphorus or without potassium, against the least significant difference for that season. Every gap sits below the line.</figcaption></figure>
<!-- /fig:gaps -->

**Step 4: pool the seasons and the answer does not change.** Treating the three published season means as three blocks and the five treatments as treatments is a fair across-season test, because the residual is then exactly the treatment-by-season interaction: it asks whether a treatment's advantage holds up from season to season. The tool gives a treatment F of **11.24 on 4 and 8 degrees of freedom (p = 0.0023)**, a grand mean of 3.873 t/ha, a CV of 8.6 % and an **LSD of 0.631 t/ha**. The means come out NPK 4.533, NK 4.267, NP 4.133, PK 3.500 and control 2.933 t/ha, and the letters put **NPK, NK and NP in one group** and **PK with the control** in another. On the paper's own numbers, the rice responded to nitrogen and to nothing else.

That is not a small correction to the paper; it is the opposite reading of its 23 % and 25 % figures. It is also the reading the paper's own discussion leans towards, since it reports the soil supplying 75 kg K/ha for free and recommends cutting the potassium dose by 59 %.

**Step 5: two side checks that do pass.** The paper's agronomic efficiency of 18 kg grain per kg of nitrogen is reproduced as **(4.0 − 1.7) t/ha ÷ 125 kg N/ha = 18.4** kg grain per kg N, which tells you that the nitrogen actually applied was the **125 kg/ha** of the split doses (55 + 35 + 35), not the 58.3 kg/ha the methods state. At 58.3 kg N/ha the same yields would give 39.5 kg grain per kg N. And the stated rates, put through the [[fertiliser-blend-calculator]] as 58.3 kg N, 30.25 kg P₂O₅ and 59.03 kg K₂O per hectare, come out as **126.7 kg of urea, 65.8 kg of triple superphosphate and 118.1 kg of muriate of potash per hectare**, 310.5 kg of product in all. Read as 125 kg N/ha, the urea alone becomes 271.7 kg/ha: more than twice the fertiliser, and a very different cost.

## How we made the graphs

Every number and both charts come from `scripts/blog-figures/lowland-rice-nutrient-omission-uganda-lsd-rechecked.mjs` in fibub's public code. It calls:

- `analyse()` from `src/lib/sci/trialanova.ts`, the maths behind the [[yield-trial-anova]] tool: block, treatment and error sums of squares, F tests with p from the F distribution, CV, the standard error of a difference, Fisher's LSD and the letters that group means;
- `tInv()` from `src/lib/sci/stats.ts` for the *t* quantile, and a short bisection on it to ask how many blocks a published LSD would need;
- `blend()` and the oxide factors from `src/lib/sci/fertiliser.ts`, the maths behind the [[fertiliser-blend-calculator]].

From the paper we took the five treatment means for each season, the season mean, the CV, the published LSD, the seven farmers as blocks, the nutrient rates and the dry grain yields of its Table 3. Two things are **our assumptions**, and neither touches a result: the farm-to-farm offsets we gave the seven blocks (they change the block sum of squares only), and the random residuals, which we double-centre so that each treatment mean is exactly the published one and the error mean square is exactly the one the published CV implies. The F tests, CV, LSD and letters therefore follow from the paper's own published numbers; the plot-level yields are a scaffold, **not the paper's data**, which is not published plot by plot.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/yield-trial-anova.mjs`, which pins the analysis against Python's statsmodels and SciPy:

- on a made-up five-variety, four-block trial the block, treatment, error and total sums of squares must be 1.4735, 5.177, 0.179 and 6.8295, the treatment F 86.7654 with p 9.474 × 10⁻⁹, the CV 2.7477 % and the LSD at 5 % 0.18817, all matching `anova_lm`;
- the same data analysed as completely randomised must give an error sum of squares of 1.6525 on 15 degrees of freedom and an LSD of 0.50025, and the letters must come out `bc a d ab cd`;
- a made-up 4 × 4 Latin square must give a treatment F of 33.3967 and an LSD of 0.87229, and an incomplete square must be refused;
- with unequal replication the LSD becomes per pair: 0.78136 for a three-plot against a two-plot treatment.

New with this article: the paper's three season means analysed as a block design must give a treatment F of **11.2392 with p 0.00229**, an error mean square of **0.11217** on 8 degrees of freedom, an LSD of **0.63060** t/ha, and letters that put NPK, NK and NP together and the control with PK.

## Check it yourself

On the [[yield-trial-anova]] page you can run the across-season test on the paper's real numbers in a minute.

1. Leave *Design* on **Randomised complete block (RCBD)**.
2. Clear the plot box and paste these 15 lines (treatment, season, yield in t/ha), which are the season means of the paper's Table 2:

```
treatment	season	yield
Control	2013A	4.2
Control	2014A	1.9
Control	2014B	2.7
PK (no N)	2013A	5.3
PK (no N)	2014A	2.3
PK (no N)	2014B	2.9
NK (no P)	2013A	6.2
NK (no P)	2014A	2.9
NK (no P)	2014B	3.7
NP (no K)	2013A	5.7
NP (no K)	2014A	2.9
NP (no K)	2014B	3.8
NPK	2013A	6.8
NPK	2014A	2.9
NPK	2014B	3.9
```

3. Set *Treatment column* to **treatment**, *Block column* to **season** and *Yield column* to **yield**. Keep *Significance level* at **5 %** and *Protected LSD* ticked.
4. Under *Analysis of variance* you should see Blocks F **111.84**, Treatments F **11.24** with p **0.002**, and an error line with **8** degrees of freedom and a mean square of **0.112**.
5. The facts beside it should read *Grand mean* **3.87**, *CV* **8.6 %**, *LSD 5 %* **0.63**, *SE of a difference* **0.27** and *t (5 %, two-sided)* **2.306**.
6. Under *Treatment means*, NPK **4.53 a**, NK (no P) **4.27 a**, NP (no K) **4.13 a**, PK (no N) **3.50 b**, Control **2.93 b**. NPK shares its letter with both omissions, so neither omission is detectable; both share nothing with the control.
7. Change *Significance level* to **1 %** and the LSD grows to **0.92**. The letters loosen to Control **c**, PK **bc**, NP and NK **ab**, NPK **a**: at this stricter level even the nitrogen gap between NPK and PK is no longer clear-cut.

## What researchers can use it for

- **Check an LSD before you trust a table.** Any published LSD, CV, mean and replicate count have to agree; the [[yield-trial-anova]] tool plus one line of arithmetic settles it, and a mismatch means a typo or a different error term.
- **Size the next trial.** An omission effect of 0.2 t/ha on a 3.4 t/ha crop with a 23 % CV needs far more than seven blocks. Work backwards from the difference you want to detect before you plant.
- **Re-analyse published season means** as a block design to see whether an effect holds across seasons, which is the question a recommendation rests on.
- **Report letters, not just percentages.** A 23 % advantage sounds decisive and a shared letter says it is not; both come out of the same run.
- **Turn rates into products** with the [[fertiliser-blend-calculator]] before publishing them, which catches a mismatch between a stated rate and the doses actually applied.
- **Read the soil analysis beside the trial** with [[soil-test-interpreter]], so a nil response to potassium can be matched against the soil's own supply.

## The fine print

- The plot-level yields we feed the tool are a **scaffold**, not the paper's data. The paper publishes treatment means, LSDs and CVs, not plots.
- We read the design as the methods state it: seven farmers per season, each a block. The abstract says 27 experiments and the methods 21, so the replication may not have been seven in every season; that is exactly what the "blocks the published LSD would need" column hints at.
- Fisher's LSD is what the paper used, so we used it too. It does not control the error rate over all ten pairs; a Tukey test would separate even fewer means, which only strengthens the conclusion.
- Analysing season means tests a treatment against the treatment-by-season interaction. It is the right test for "does this hold every year", and a deliberately strict one.
- We have not rechecked the paper's indigenous nutrient supply, recovery efficiencies or economics beyond the agronomic efficiency of nitrogen.
- The paper's own text means (NPK 4.83 t/ha) differ from the average of its three season means (4.53 t/ha), so its percentage claims rest on numbers that are not in its tables.
