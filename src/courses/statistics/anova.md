---
title: 'ANOVA: comparing three or more groups'
summary: 'One-way analysis of variance compares several group means at once by splitting total variation into between-group and within-group parts. The F ratio, the ANOVA table, follow-up comparisons and effect size η².'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'Why not just run t-tests on every pair of 5 groups?'
    choices: ['t-tests cannot compare groups', 'There are 10 pairs, and the chance of at least one false positive climbs well above 5 %', 'It takes too long']
    ans: 1
    why: 'Ten tests at 5 % each give roughly a 40 % chance of at least one false alarm. ANOVA asks one question first: do any means differ?'
  - q: 'ANOVA gives F = 1.1. What does that suggest?'
    choices: ['The group means differ a lot', 'The differences between group means are about what noise within groups would produce', 'The data is wrong']
    ans: 1
    why: 'F compares between-group variation with within-group variation. Near 1 means the group means are as spread as chance alone would make them.'
  - q: 'ANOVA is significant. What do you know?'
    choices: ['Every group differs from every other', 'At least one group mean differs from the others; follow-up tests say which', 'The largest group is best']
    ans: 1
    why: 'The F-test is an overall test. Post-hoc comparisons (with a multiple-testing correction) identify which pairs differ.'
sources:
  - 'OpenIntro Statistics, 4th edition (Diez, Cetinkaya-Rundel, Barr), Section 7.5 Comparing many means with ANOVA https://www.openintro.org/book/os/'
  - 'NIST/SEMATECH e-Handbook of Statistical Methods, 7.4.3 Are the means equal? https://www.itl.nist.gov/div898/handbook/prc/section4/prc43.htm'
---

**Module 6 · about 25 minutes · school maths.** You'll be able to run and read a one-way ANOVA, explain the F ratio, and follow up with corrected pairwise comparisons.

<div class="bigidea">ANOVA asks whether group means differ more than the scatter inside each group would explain, by comparing between-group and within-group variation.</div>

**In everyday terms:** three classes take the same test. If the class averages differ by a few marks but pupils within each class range from 20 to 90, the class makes little difference. If every class is tightly bunched and the averages are far apart, the class matters.

## 1. One question for many groups

Three store layouts, four ad creatives, five regions: are their averages really different? Pairwise t-tests multiply the chances of a false alarm (Lesson 6.8). **Analysis of variance (ANOVA)** asks one question first: is the spread of the **group means** bigger than the spread **within** groups would explain?

<!--fig:anova-sim-->

Pull the layouts apart and F grows; add noise within groups and F shrinks. The same gap between means can be convincing or meaningless depending on the noise.

## 2. Splitting the variation

Every value's distance from the grand mean splits into two parts: how far its group's mean is from the grand mean (**between**), and how far it is from its own group's mean (**within**).

```math
\underbrace{\sum (x_{ij} - \bar{x})^2}_{SS_\text{total}} = \underbrace{\sum_j n_j(\bar{x}_j - \bar{x})^2}_{SS_\text{between}} + \underbrace{\sum_j \sum_i (x_{ij} - \bar{x}_j)^2}_{SS_\text{within}}
```

Dividing each by its degrees of freedom gives **mean squares**, and their ratio is F:

```math
F = \frac{MS_\text{between}}{MS_\text{within}} = \frac{SS_\text{between}/(k-1)}{SS_\text{within}/(N-k)}
```

with `$k$` groups and `$N$` values in total. If the null (all means equal) is true, F is around 1. Large F → small p.

## 3. The ANOVA table

| Source | SS | df | MS | F | p |
|---|---|---|---|---|---|
| Between groups | `$SS_B$` | k − 1 | `$SS_B/(k-1)$` | `$MS_B/MS_W$` | from F(k − 1, N − k) |
| Within groups | `$SS_W$` | N − k | `$SS_W/(N-k)$` | | |
| Total | `$SS_T$` | N − 1 | | | |

**Effect size** `$\eta^2 = SS_B / SS_T$`: the share of all variation explained by the groups.

## 4. After a significant F

- **Post-hoc tests:** Tukey's HSD compares every pair with the right correction; or pairwise Welch t-tests with a Holm correction (Lesson 6.8).
- **Planned contrasts:** if you decided in advance to compare each new layout with the current one, test only those.

**Assumptions:** independent observations; roughly normal within groups (less important with larger groups); similar spreads. With very different spreads use **Welch's ANOVA**; with skewed small samples, the **Kruskal-Wallis** rank test (Lesson 6.7).

<div class="meaning">

<dl>
<dt>SS between</dt><dd>How far each group mean is from the grand mean, weighted by group size.</dd>
<dt>SS within</dt><dd>How far values are from their own group mean.</dd>
<dt>F = MS between ÷ MS within</dt><dd>Signal (differences between groups) over noise (scatter inside groups), each divided by its df.</dd>
<dt>Physical meaning</dt><dd>All the variation in the data is split into two piles: the part explained by which group a store is in, and the part left over. F asks whether the first pile is bigger than chance would make it.</dd>
</dl>

</div>

<div class="myth">

**"A significant F tells you which groups differ."** It says at least one mean differs. Follow up with planned comparisons or Tukey's test to find which, and correct for the number of comparisons (Lesson 6.8).

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The data.</b> Units sold under three shelf placements, 6 stores each. Means 5, 9 and 10; grand mean 8.</div>
<div class="step"><b>Between groups.</b> 6 × ((5 − 8)² + (9 − 8)² + (10 − 8)²) = 6 × 14 = 84, with 2 df: MS = 42.</div>
<div class="step"><b>Within groups.</b> Squared gaps of each store from its own group mean: 16 + 24 + 28 = 68, with 15 df: MS ≈ 4.53.</div>
<div class="step"><b>F.</b> 42 ÷ 4.53 ≈ 9.26.</div>
<div class="step"><b>Read.</b> p ≈ 0.002: placement matters, and explains about half the variation (η² ≈ 0.55). Follow-ups show eye level is below both others.</div>
</div>

<div class="problem" data-problem="anova-f"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** if all groups share one mean, the group means differ only by sampling noise, so the between-group mean square estimates the same variance as the within-group one, and F ≈ 1.

**In code:** Excel Data Analysis ToolPak → "ANOVA: Single Factor"; Python `scipy.stats.f_oneway(a, b, c)`; `statsmodels` `pairwise_tukeyhsd` for Tukey.

**Two groups:** ANOVA with k = 2 gives F = t² from the pooled t-test.
</details>

## 5. Worked example

*Made-up numbers (also checked in tests/stats.mjs).* Weekly units sold under three shelf placements, 6 stores each:

| Eye level | 6, 8, 4, 5, 3, 4 | mean 5 |
|---|---|---|
| Middle | 8, 12, 9, 11, 6, 8 | mean 9 |
| End cap | 13, 9, 11, 8, 7, 12 | mean 10 |

- Grand mean = (30 + 54 + 60) ÷ 18 = **8**.
- SS between = 6(5 − 8)² + 6(9 − 8)² + 6(10 − 8)² = 54 + 6 + 24 = **84**.
- SS within = 16 + 24 + 28 = **68** (squared gaps from each group's own mean).
- MS between = 84 ÷ 2 = 42; MS within = 68 ÷ 15 ≈ 4.53.
- F = 42 ÷ 4.53 ≈ **9.26** with (2, 15) df; p ≈ **0.0024**. η² = 84 ÷ 152 ≈ **0.55**.

At least one placement differs, and placement explains about half the variation. Follow-ups would show "eye level" is the odd one out (lower, surprisingly; worth checking which products were on test).

## 6. Practice

1. 4 groups, 40 values in total. What are the two df for F?
2. SS between = 30, SS within = 270. Find η².
3. F = 0.6. What would you conclude?

<details>
<summary>Answers</summary>

1. 3 and 36.
2. 30 ÷ 300 = 0.10.
3. No evidence the group means differ; the means are even closer than noise would typically make them.
</details>

**Try it on your own data:** the [[yield-trial-anova]] tool runs one- and two-way ANOVA with post-hoc comparisons, and the [[regression-workbench]] handles groups as categorical predictors.

**New words:** *ANOVA*, *sum of squares*, *mean square*, *F ratio*, *η² (eta squared)*, *post-hoc test*, *Tukey's HSD*, *Kruskal-Wallis*.

<div class="keypoints">

- ANOVA compares 3 or more means in one test, avoiding many t-tests.
- F = (between-group variance) ÷ (within-group variance).
- A large F means group means differ more than scatter explains.
- Follow a significant F with corrected pairwise comparisons.

</div>
