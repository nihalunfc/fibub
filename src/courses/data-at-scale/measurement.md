---
title: 'Measurement: did the ads work?'
summary: 'Delivery metrics, ROAS and attribution and their bias, incrementality tests with holdout groups, lift with a confidence interval, iROAS, and marketing mix models.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: Why do attributed sales usually overstate what the ads did?
    choices: ['They count every exposed buyer, including those who would have bought anyway', 'They forget to count clicks', 'They use the wrong currency']
    ans: 0
    why: Attribution gives credit; it does not prove cause. Shoppers who were going to buy their usual brand still get counted if they saw an ad.
  - q: Exposed shoppers bought at 4.0% and the random holdout at 3.2%. What is the relative lift?
    choices: ['0.8%', '25%', '80%']
    ans: 1
    why: Relative lift = (4.0 − 3.2) ÷ 3.2 = 0.25 = 25%. The absolute lift is 0.8 percentage points.
  - q: The 95% interval for the absolute lift is −0.1 to +0.5 points. What can you say?
    choices: ['The ads definitely worked', 'The data cannot rule out zero effect, so you cannot claim a lift yet', 'The ads hurt sales']
    ans: 1
    why: The interval includes zero. A bigger test, or a longer one, is needed to tell a real effect from noise.
sources:
  - 'Johnson, G. A., Lewis, R. A. and Nubbemeyer, E. I. (2017), Ghost Ads: Improving the Economics of Measuring Online Ad Effectiveness, Journal of Marketing Research 54(6), 867-884 https://doi.org/10.1509/jmr.15.0297'
  - 'Gordon, B. R., Zettelmeyer, F., Bhargava, N. and Chapsky, D. (2019), A Comparison of Approaches to Advertising Measurement: Evidence from Big Field Experiments at Facebook, Marketing Science 38(2), 193-225 https://doi.org/10.1287/mksc.2018.1135'
  - 'Kohavi, R., Tang, D. and Xu, Y. (2020), Trustworthy Online Controlled Experiments, Cambridge University Press'
  - 'Google Meridian (open-source marketing mix modelling) documentation, developers.google.com/meridian'
---

**Module 7 · about 30 minutes · read first: 7.1, 7.2; helpful: [Statistics for analysts](/learn/courses/statistics/).** You'll be able to calculate CTR, CPM, CPC, ROAS and iROAS, explain why attribution overstates ad effects, design a holdout test, calculate lift with a 95% interval, and say what marketing mix models add.

<div class="bigidea">Attribution tells you who saw an ad and then bought; only a comparison with a similar group that saw no ads tells you how many of those purchases the ads actually caused.</div>

## 1. Level 1: delivery metrics

| Metric | Formula | Tells you |
|---|---|---|
| **Impressions** | count of ads shown | How much was delivered |
| **Viewability** | viewable impressions ÷ measured impressions | Whether ads could actually be seen |
| **CTR** (click-through rate) | clicks ÷ impressions | How appealing or relevant the ad was |
| **CPM** (cost per mille) | cost ÷ impressions × 1,000 | The price of attention |
| **CPC** (cost per click) | cost ÷ clicks | The price per visit |
| **Reach and frequency** | unique users; impressions ÷ unique users | Breadth against repetition |

These come straight from ad events: Druid for live views, BigQuery for exact billing.

## 2. Level 2: outcomes and attribution

- **Conversion rate:** purchases ÷ clicks (or ÷ exposed users).
- **Attributed sales:** sales credited to ads under an **attribution rule**.
- **ROAS** = attributed revenue ÷ ad spend.

Attribution rules decide which ad gets the credit:

| Model | Rule | Bias |
|---|---|---|
| **Last touch** | The last ad clicked or seen before buying | Over-credits ads near checkout, such as search |
| **First touch** | The first ad in the journey | Over-credits awareness ads |
| **Linear, time decay, position** | Split credit by a fixed rule | The weights are arbitrary |
| **Data-driven** | A model estimates each touch's share | Better, but still based on correlation |

Each rule also has an **attribution window** (for example a purchase within 14 days of a click or 1 day of a view). Sales of the same product, the same brand, and the brand's other products (the "halo") are usually reported separately.

The rooster crows every morning just before the sun rises. Attribution would give the rooster full credit for the sunrise. To know whether the rooster matters, you need a morning without the rooster. That is an incrementality test.

## 3. Level 3: incrementality

**Incrementality** asks: how many extra sales happened **because** of the ads? It needs a **counterfactual**, what would have happened without them, and the cleanest way to get one is an experiment.

**Designs:**

- **User-level holdout** (a randomised controlled trial): randomly split the target audience; the **control** (holdout) group is eligible but deliberately not shown the ads. A "ghost ads" design logs which control users *would* have seen an ad, for a fairer comparison. Compare purchase rates.
- **Store or region tests:** turn in-store screens on in some stores and off in matched stores, and compare with **difference-in-differences** (Lesson 7.4).
- **Synthetic control:** build a control from a weighted mix of similar stores or regions when random assignment is not possible.

The [A/B testing lessons](/learn/courses/statistics/ab-test-design/) in the Statistics course cover the experiment design in depth.

<div class="steps" data-fig="measurement-lift">
<div class="step"><b>Attribution's view.</b> 900,000 loyalty shoppers saw a coffee brand's ads and 36,000 of them (4.0%) bought it. Attribution credits all 36,000 to the ads.</div>
<div class="step"><b>The holdout.</b> A random 100,000 shoppers from the same audience saw no ads, and 3.2% of them still bought: these are loyal coffee drinkers who were going to buy anyway.</div>
<div class="step"><b>The lift.</b> Only the gap, 4.0% − 3.2% = 0.8 points, was caused by the ads. On 900,000 exposed shoppers that is 7,200 extra buyers. The other 28,800 would have bought anyway.</div>
<div class="step"><b>The money.</b> With a $12 basket and $40,000 of spend, attributed ROAS = 36,000 × 12 ÷ 40,000 = 10.8, but incremental ROAS = 7,200 × 12 ÷ 40,000 = 2.2. Still profitable, and now honest.</div>
</div>

### The maths

Write `$p_t$` and `$p_c$` for the purchase rates of the test (exposed) and control groups, and `$n_t$`, `$n_c$` for their sizes.

```math
\text{absolute lift} = p_t - p_c, \qquad \text{relative lift} = \frac{p_t - p_c}{p_c}
```

```math
\text{incremental buyers} = (p_t - p_c)\, n_t, \qquad \text{iROAS} = \frac{\text{incremental buyers} \times \text{average basket}}{\text{spend}}
```

**Is it real or noise?** The standard error of the difference between two rates, and the 95% interval:

```math
SE = \sqrt{\frac{p_t(1-p_t)}{n_t} + \frac{p_c(1-p_c)}{n_c}}, \qquad (p_t - p_c) \pm 1.96 \times SE
```

If the interval includes zero, you cannot claim a lift. Small lifts need big groups, so decide the sample size **before** the test ([how big a sample](/learn/courses/statistics/sample-size-planning/)).

<div class="problem" data-problem="measurement-iroas"></div>

<div class="problem" data-problem="measurement-interval"></div>

<div class="meaning">

<dl>
<dt>Holdout (control)</dt><dd>A random slice of the audience that is deliberately not shown the ads.</dd>
<dt>Counterfactual</dt><dd>What would have happened without the ads; the holdout estimates it.</dd>
<dt>Lift</dt><dd>The exposed rate minus the holdout rate: the part of buying the ads caused.</dd>
<dt>iROAS</dt><dd>Incremental revenue per dollar of spend: the honest return.</dd>
<dt>Physical meaning</dt><dd>A brand that cut its campaign because "only" 2.2 incremental dollars came back per dollar, after being told 10.8, was not cheated: it finally learned how many of its loyal customers would have bought anyway. That difference decides where millions of advertising dollars go each year.</dd>
</dl>

</div>

<div class="myth">

**"A higher ROAS means a better campaign."** Campaigns aimed at a brand's existing loyal buyers have huge ROAS because those shoppers buy anyway. A campaign that wins new customers can show lower ROAS but higher iROAS. Judge campaigns by incremental results.

</div>

## 4. Level 4: marketing mix modelling

**Marketing mix modelling (MMM)** fits a model to weekly or daily total sales against spend in each channel (search, social, TV, retail media), price, promotions, seasons and holidays. It includes **adstock** (an ad's effect fades over weeks, not instantly) and **saturation** (each extra dollar does less). It needs no user-level data and covers channels like TV that cannot be tracked per person. Open-source options include Google's **Meridian** and Meta's **Robyn**. Many teams **calibrate** their MMM with incrementality test results.

## 5. What measurement needs from data engineers

- Exact, de-duplicated impression and click logs, with invalid traffic removed.
- Reliable joins of exposure to purchases: identity, time windows, store transactions.
- **Holdout assignment logged by the ad server** as data, not reconstructed later.
- Reproducible test reads: frozen definitions, versioned SQL, documented exclusions.
- Privacy-safe outputs: minimum group sizes, clean rooms for brand data.

## 6. Worked example

*Made-up numbers.* Exposed: 400,000 shoppers, 9,600 buyers. Holdout: 100,000 shoppers, 2,000 buyers. Spend $25,000, average brand basket $15.

1. Rates: p<sub>t</sub> = 9,600 ÷ 400,000 = 2.4%; p<sub>c</sub> = 2,000 ÷ 100,000 = 2.0%.
2. Lift: absolute 0.4 points; relative 0.4 ÷ 2.0 = 20%.
3. SE = √(0.024 × 0.976 ÷ 400,000 + 0.02 × 0.98 ÷ 100,000) ≈ √(5.86 × 10⁻⁸ + 1.96 × 10⁻⁷) ≈ 0.000505.
4. 95% interval: 0.004 ± 1.96 × 0.000505 = 0.004 ± 0.00099, so 0.30 to 0.50 points. Zero is outside: the lift is significant.
5. Incremental buyers = 0.004 × 400,000 = 1,600; incremental revenue = 1,600 × $15 = $24,000; iROAS = 24,000 ÷ 25,000 = 0.96.
6. Attributed ROAS would have claimed 9,600 × 15 ÷ 25,000 = 5.76.

So the campaign roughly paid back its media cost in extra sales, which is a very different story from "5.76".

## 7. Practice

1. A campaign had 2,000,000 impressions, 30,000 clicks and cost $12,000. Find CTR, CPM and CPC.
2. A test's 95% interval for lift is 0.1 to 0.9 points; another's is −0.2 to 1.4 points. Which can you report as a lift?
3. Why must holdout assignment be logged by the ad server at the time, not worked out later from who saw ads?

<details>
<summary>Answers</summary>

1. CTR = 30,000 ÷ 2,000,000 = 1.5%; CPM = 12,000 ÷ 2,000,000 × 1,000 = $6; CPC = 12,000 ÷ 30,000 = $0.40.
2. Only the first: the second interval includes zero.
3. People who happen to see ads differ from those who do not (they use the app more, for example). Only the random assignment, recorded when it was made, gives two groups that are alike in everything except the ads.
</details>

**New words:** *CTR*, *CPM*, *CPC*, *viewability*, *attribution window*, *last touch*, *incrementality*, *counterfactual*, *holdout*, *lift*, *iROAS*, *marketing mix modelling*, *adstock*.

<div class="keypoints">

- Delivery metrics (impressions, CTR, CPM, CPC) describe what was shown; attribution assigns credit for sales but does not prove cause.
- Incrementality compares exposed shoppers with a random holdout: lift = p_t − p_c, incremental buyers = lift × n_t.
- Report the 95% interval: (p_t − p_c) ± 1.96 × SE. If it includes zero, there is no proven lift.
- iROAS is usually far below attributed ROAS, and it is the honest number. MMM covers channels without user-level data and is calibrated with tests.

</div>
