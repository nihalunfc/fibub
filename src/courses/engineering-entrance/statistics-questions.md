---
title: 'Statistics: question types and traps'
seoTitle: 'Statistics JEE questions: types and traps'
summary: 'Every way entrance exams test statistics: mean, weighted and combined mean, median and mode for raw and grouped data, range, mean deviation, variance and standard deviation, change of origin and scale, coefficient of variation, combined variance, wrong observations and extreme-value properties, each with its method and its trap.'
minutes: 24
updated: 2026-11-22
quiz:
  - q: 'The variance of the first 10 natural numbers is:'
    choices: ['8.25', '9.17', '5.5', '82.5']
    ans: 0
    why: 'Variance of 1, 2, …, n is (n² − 1)/12 = 99/12 = 8.25.'
  - q: 'Two data sets have means 50 and 40 and standard deviations 10 and 6. Which is more consistent?'
    choices: ['the second (CV 15%)', 'the first (CV 20%)', 'both equally', 'cannot tell']
    ans: 0
    why: 'CV = σ/mean × 100: 20% for the first and 15% for the second. The lower CV is more consistent.'
  - q: 'The mean deviation about the median of 2, 4, 6, 8, 10 is:'
    choices: ['2.4', '2', '3', '6']
    ans: 0
    why: 'Median 6; absolute deviations 4, 2, 0, 2, 4 add to 12; divided by 5 that is 2.4.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Statistics and probability; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 11 · about 24 minutes.** Read [Statistics](/learn/courses/engineering-entrance/statistics/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Statistics questions in JEE are usually about sums, not data. Turn every given mean and variance into Σx and Σx², do the change (add, remove, combine, correct), and turn the sums back. The other half are property questions: know what shifting and scaling do and you answer them in seconds.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Mean and weighted mean.</b> Σfx/Σf. <i>Trap:</i> averaging the group means when the groups have different sizes.</div>
<div class="step"><b>2. Median and mode.</b> Order first; the grouped formulas use class boundaries. <i>Trap:</i> using the class limits of a non-continuous table without adjusting.</div>
<div class="step"><b>3. Empirical relation.</b> Mode ≈ 3 median − 2 mean. <i>Trap:</i> swapping the 3 and the 2.</div>
<div class="step"><b>4. Mean deviation.</b> About the mean or the median, as asked. <i>Trap:</i> forgetting the absolute value.</div>
<div class="step"><b>5. Variance and SD.</b> Σx²/n − x̄². <i>Trap:</i> dividing by n − 1; JEE uses n.</div>
<div class="step"><b>6. Change of origin and scale.</b> Shift affects centre only; scale affects both, SD by |a|. <i>Trap:</i> a negative scale makes the SD negative (it never does).</div>
<div class="step"><b>7. Coefficient of variation.</b> σ/x̄ × 100; lower is more consistent. <i>Trap:</i> comparing SDs of sets with very different means.</div>
<div class="step"><b>8. Combined mean and variance.</b> Include the d² terms. <i>Trap:</i> just averaging the two variances.</div>
<div class="step"><b>9. Wrong or missing observations.</b> Fix Σx and Σx². <i>Trap:</i> correcting the mean but reusing the old mean inside the variance.</div>
<div class="step"><b>10. Properties and extremes.</b> σ = 0 iff all equal; variance ≤ (M − m)²/4; least Σ(x − a)² at a = x̄. <i>Trap:</i> claiming mean deviation can exceed SD.</div>
</div>

## Worked examples

**Example 1 (level 3, change of scale).** The mean and variance of x₁, …, x₁₀ are 12 and 9. Find the mean and variance of 3 − 2x₁, …, 3 − 2x₁₀. *Solution.* New mean = 3 − 2(12) = **−21**. New variance = (−2)² × 9 = **36** (SD 6). The 3 does nothing to the spread, and the minus sign disappears when squared.

**Example 2 (level 4, missing values).** The mean of 2, 4, 6, 8, x, y is 5 and the variance is 20/3. Find |x − y|. *Solution.* Σ = 30, so x + y = 10. Σx² = 6(20/3 + 25) = 190, so x² + y² = 190 − 120 = 70. Then 2xy = 100 − 70 = 30, and (x − y)² = 70 − 30 = 40. **|x − y| = 2√10.**

**Example 3 (level 4, combined).** Two groups of 50 and 100 students have mean marks 60 and 45 and SDs 8 and 6. Find the combined SD. *Solution.* Combined mean = (3000 + 4500)/150 = 50. d₁ = 10, d₂ = −5. σ² = [50(64 + 100) + 100(36 + 25)]/150 = (8200 + 6100)/150 = 95.33. **σ ≈ 9.76.** Averaging the variances (weighted by size) would give only about 45.3: the gap between the groups is most of the spread.

**Example 4 (level 5, extremes).** Ten numbers lie in [0, 6] and have mean 3. What is the largest possible variance? *Solution.* The variance is largest when the values are pushed to the ends: five 0s and five 6s give mean 3 and variance 9. Check with the bound (M − m)²/4 = 36/4 = 9. **Largest variance 9.**

<div class="myth">

**"The combined variance is the average of the two variances."** Only when both groups have the same mean. Otherwise the groups sit at different places, and the distance between them adds to the spread. That is the job of the d₁² and d₂² terms.

</div>

<div class="meaning">
<dl>
<dt>Σx = n x̄</dt><dd>turn a mean back into a total</dd>
<dt>Σx² = n(σ² + x̄²)</dt><dd>turn a variance back into a sum of squares</dd>
<dt>Physical meaning</dt><dd>Means and variances cannot be added or corrected directly, but totals can. Go back to totals, make the change, and come forward again.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="statistics" data-mode="practice"></div>

<div class="keypoints">

- Weight group means by group sizes.
- Variance divides by n; Σx²/n − x̄² is the quick form.
- y = ax + b: variance × a², SD × |a|, shift ignored.
- Lower CV means more consistent.
- Combined variance needs the d² terms; wrong values need corrected Σx and Σx².
- Variance of 1 to n is (n² − 1)/12; for values in [m, M] it is at most (M − m)²/4.

</div>
