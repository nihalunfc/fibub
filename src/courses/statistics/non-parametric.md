---
title: 'When the data is not normal: rank tests'
summary: 'Rank tests replace values with their positions in order, so outliers and skew lose their grip: Mann-Whitney U for two groups, Wilcoxon signed-rank for paired data, Kruskal-Wallis for several groups. When to use them, and what they actually test.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'What does a rank test do with the value 300 in the list 3, 5, 6, 300?'
    choices: ['Removes it', 'Gives it rank 4, the same as if it were 7', 'Doubles its weight']
    ans: 1
    why: 'Only order matters. 300 is simply the largest, so its extremeness no longer distorts the test.'
  - q: 'Which test is the rank-based version of the paired t-test?'
    choices: ['Mann-Whitney U', 'Wilcoxon signed-rank', 'Kruskal-Wallis']
    ans: 1
    why: 'Wilcoxon signed-rank ranks the sizes of the paired differences and compares the positive and negative ranks.'
  - q: 'When is a t-test still fine on skewed data?'
    choices: ['Never', 'When samples are large, because the means are close to normal by the central limit theorem', 'Only with exactly 30 values']
    ans: 1
    why: 'The t-test is about means. With hundreds of values per group, sample means are close to normal even when the raw data is skewed.'
sources:
  - 'Hollander, M., Wolfe, D. A. and Chicken, E. (2014), Nonparametric Statistical Methods, 3rd edition, Wiley'
  - 'Mann, H. B. and Whitney, D. R. (1947), On a Test of Whether one of Two Random Variables is Stochastically Larger than the Other, Annals of Mathematical Statistics 18(1), 50-60 https://doi.org/10.1214/aoms/1177730491'
---

**Module 6 · about 20 minutes · no new maths.** You'll be able to choose a rank test, explain how it handles outliers, and say what it tests.

<div class="bigidea">Rank tests replace each value with its place in the line-up, so a single huge value counts only as "the biggest" and cannot swamp the result.</div>

**In everyday terms:** judging a race by finishing order instead of times. If one runner stops for a picnic, their time is ridiculous but their place is simply "last". The ranking still says who was generally faster.

## 1. Why ranks

t-tests compare means, and means are pulled about by outliers and long tails. With small samples of skewed data (session times, spend, waiting times), one extreme value can decide the result. **Rank tests** (non-parametric tests) replace each value by its position in the sorted data, so the biggest value is just "the biggest", however big.

<!--fig:rank-test-->

Drag B's top value to 300. The mean difference balloons, yet the t-test's p-value gets *worse*, because that one value inflates B's standard deviation even more. The Mann-Whitney test doesn't move: B's values are still mostly above A's.

## 2. The three tests

| Situation | t-based test | Rank test |
|---|---|---|
| Two independent groups | Welch t | **Mann-Whitney U** (Wilcoxon rank-sum) |
| Paired / before-after | Paired t | **Wilcoxon signed-rank** |
| Three or more groups | One-way ANOVA | **Kruskal-Wallis** |

**Mann-Whitney U, in words:** pool both groups and rank everything. If the groups are alike, their average ranks should be similar. U counts, over all pairs (one from each group), how often a value from one group beats one from the other. U / (n₁n₂) is directly "the chance a random B beats a random A", a handy effect size.

## 3. What they test (careful)

Rank tests don't test means. Mann-Whitney tests whether values in one group tend to be larger than in the other (**stochastic dominance**). If the two groups have the same shape and spread, that's the same as a difference in medians. Report medians and the "probability of superiority", not means.

## 4. When to use which

- **Small samples (under ~30 per group) of skewed data or with outliers:** rank test.
- **Ordinal data** (ratings 1 to 5, satisfaction levels): rank test; means of ratings are debatable.
- **Large samples and you care about the mean** (revenue per visitor, where totals matter): t-test or bootstrap. The mean is what drives revenue, and the CLT protects you.
- Rank tests lose only a little power when the data really is normal (about 5 %), so they're a safe choice when unsure.

<div class="meaning">

<dl>
<dt>Rank</dt><dd>Position after sorting all values together: 1 for the smallest.</dd>
<dt>Mann-Whitney U</dt><dd>For two groups: counts how often a value from one group beats a value from the other.</dd>
<dt>Wilcoxon signed-rank</dt><dd>For paired data: ranks the sizes of the differences.</dd>
<dt>Kruskal-Wallis</dt><dd>For three or more groups: the rank version of ANOVA.</dd>
<dt>Physical meaning</dt><dd>U ÷ (n₁ × n₂) is the probability that a random member of one group beats a random member of the other: a plain-language effect size managers understand.</dd>
</dl>

</div>

<div class="myth">

**"Rank tests compare medians."** Strictly they compare whole distributions: whether one group tends to have larger values. They line up with medians only when the two groups have the same shape.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The data.</b> Minutes on a help page: A = 3, 5, 9; B = 6, 10, 12, 40.</div>
<div class="step"><b>Pool and rank.</b> 3(1), 5(2), 6(3), 9(4), 10(5), 12(6), 40(7). The 40 is simply rank 7.</div>
<div class="step"><b>Add A's ranks.</b> 1 + 2 + 4 = 7.</div>
<div class="step"><b>U.</b> U_A = 7 − 3 × 4 ÷ 2 = 1. Of the 12 A-B pairs, A wins only 1.</div>
<div class="step"><b>Read.</b> A random B beats a random A 11 times in 12 (92 %). Exact p ≈ 0.11 with samples this small.</div>
</div>

<div class="problem" data-problem="mann-whitney-u"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** ranks keep the order of the data and throw away the distances, so no single value can dominate.

**Mann-Whitney:** with rank sum `$R_1$` for group 1, `$U_1 = R_1 - n_1(n_1+1)/2$` and `$U_2 = n_1 n_2 - U_1$`. For larger samples, under the null `$U$` is roughly normal with mean `$n_1n_2/2$` and SD `$\sqrt{n_1 n_2 (n_1+n_2+1)/12}$` (with a correction for ties).

**In code:** Python `scipy.stats.mannwhitneyu(b, a)`, `wilcoxon(after, before)`, `kruskal(a, b, c)`. Excel has no built-in; rank with `RANK.AVG` and use the formulas above.
</details>

## 5. Worked example

*Made-up numbers.* Minutes on a help page: A = 3, 5, 9; B = 6, 10, 12, 40.

- Pool and rank: 3(1), 5(2), 6(3), 9(4), 10(5), 12(6), 40(7).
- A's ranks: 1, 2, 4. R_A = 7. U_A = 7 − 3 × 4 ÷ 2 = **1**. U_B = 3 × 4 − 1 = **11**.
- Of the 12 A–B pairs, B wins 11: the probability a random B beats a random A is 11/12 ≈ **92 %**.
- With samples this small, use exact tables: two-sided p ≈ **0.11**. Suggestive, not conclusive.
- The 40 counts only as "the largest". With a t-test, it would inflate B's SD so much that p would be about 0.24.

## 6. Practice

1. Rank the values 7, 2, 9, 2, 5 (ties share the average rank).
2. Which test for: customer ratings 1–5 for two app versions, 25 people each?
3. A test of revenue per visitor with 50,000 per group: rank test or t-test?

<details>
<summary>Answers</summary>

1. 2 and 2 share ranks 1 and 2 → 1.5 each; 5 → 3; 7 → 4; 9 → 5. So 4, 1.5, 5, 1.5, 3.
2. Mann-Whitney (ordinal ratings, modest samples).
3. Usually a t-test (or bootstrap) on the mean: revenue totals depend on the mean, and with 50,000 per group the CLT makes it reliable.
</details>

**Try it on your own data:** the [[hypothesis-tests]] tool includes Mann-Whitney, Wilcoxon and Kruskal-Wallis, and the [[bootstrap-permutation]] tool offers permutation tests that also avoid the normal assumption.

**New words:** *non-parametric test*, *rank*, *Mann-Whitney U*, *Wilcoxon signed-rank*, *Kruskal-Wallis*, *probability of superiority*, *ordinal data*.

<div class="keypoints">

- Rank tests work on order, so outliers and skew lose their grip.
- Two groups: Mann-Whitney U; paired: Wilcoxon signed-rank; 3+ groups: Kruskal-Wallis.
- U ÷ (n₁n₂) = probability a random value from one group beats the other.
- Use them for small or skewed samples; with large normal-ish data t-tests are slightly more powerful.

</div>
