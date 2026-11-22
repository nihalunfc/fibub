---
title: Statistics
seoTitle: 'Statistics: JEE maths'
summary: 'Mean, weighted and combined mean, median and mode for raw and grouped data, the empirical relation, range, mean deviation about the mean and median, variance and standard deviation by the short formula and by step deviation, the effect of change of origin and scale, coefficient of variation, combined variance, correcting a wrong observation, and the bounds on variance.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'The standard deviation of a data set is 4. If every value is multiplied by 3 and then 5 is added, the new standard deviation is:'
    choices: ['12', '17', '36', '4']
    ans: 0
    why: 'Adding 5 moves every value equally and does not change the spread. Multiplying by 3 multiplies the SD by 3: 4 × 3 = 12.'
  - q: 'The variance of 1, 2, 3, 4, 5 is:'
    choices: ['2', '3', '√2', '2.5']
    ans: 0
    why: 'Mean 3; squared deviations 4, 1, 0, 1, 4 add to 10; divided by 5 that is 2. (2.5 is what you get by dividing by n − 1, which JEE does not use.)'
  - q: 'For a moderately skewed distribution, mean 30 and median 27 give a mode of about:'
    choices: ['21', '24', '33', '28.5']
    ans: 0
    why: 'Empirical relation: mode ≈ 3 median − 2 mean = 81 − 60 = 21.'
sources:
  - 'NCERT Mathematics Class 10 and 11 (Statistics): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Statistics and probability'
---

**Maths · Class 11 · about 34 minutes.** By the end you will be able to find the centre and spread of raw and grouped data, use the quick rules for change of origin and scale, combine two groups, correct a misread observation, and spot the property-based questions that need no calculation at all.

<div class="bigidea">A data set has a centre (where the values sit) and a spread (how far they wander from that centre). Mean, median and mode are three ways to name the centre; range, mean deviation and standard deviation are ways to measure the spread. Shifting all the data moves the centre but never the spread; stretching it stretches both.</div>

## 1. Measures of centre

```math
\bar x = \frac{\sum x_i}{n}, \qquad \bar x = \frac{\sum f_ix_i}{\sum f_i} \;\text{(with frequencies)}, \qquad \bar x = \frac{n_1\bar x_1 + n_2\bar x_2}{n_1 + n_2} \;\text{(combined)}
```

<div class="meaning">
<dl>
<dt>xᵢ, fᵢ</dt><dd>the values and how often each occurs; for grouped data, xᵢ is the class mark (middle of the class)</dd>
<dt>n</dt><dd>the number of observations, n = Σfᵢ</dd>
<dt>x̄</dt><dd>the mean (arithmetic average)</dd>
<dt>σ², σ</dt><dd>the variance (mean of the squared deviations from the mean) and the standard deviation, its square root</dd>
<dt>Physical meaning</dt><dd>The mean is the balance point: if the values were equal weights on a ruler, the ruler would balance at x̄. That is why Σ(xᵢ − x̄) = 0 always.</dd>
</dl>
</div>

**Median.** Arrange the values in order. For odd n it is the middle value, the ((n + 1)/2)th; for even n the average of the (n/2)th and (n/2 + 1)th. For grouped data, find the class holding the (n/2)th value and use

```math
\text{Median} = l + \frac{\frac n2 - C}{f}\times h
```

with l the lower boundary of that class, C the cumulative frequency before it, f its frequency and h its width.

**Mode.** The most frequent value. For grouped data, in the class with the highest frequency f₁ (with f₀ and f₂ the frequencies of the classes before and after):

```math
\text{Mode} = l + \frac{f_1 - f_0}{2f_1 - f_0 - f_2}\times h
```

**Empirical relation** (for moderately skewed data): mode ≈ 3 median − 2 mean.

## 2. Measures of spread

**Range** = largest − smallest. Quick, but it uses only two values.

**Mean deviation** about a centre a: `$\text{MD}(a) = \dfrac{\sum f_i|x_i - a|}{n}$`. It is least when a is the median.

**Variance and standard deviation:**

```math
\sigma^2 = \frac{\sum f_i(x_i - \bar x)^2}{n} = \frac{\sum f_ix_i^2}{n} - \bar x^2, \qquad \sigma = \sqrt{\sigma^2}
```

The second form, "mean of squares minus square of the mean", is much quicker by hand. For grouped data with equal widths h, use **step deviation**: uᵢ = (xᵢ − A)/h with A a convenient middle value. Then x̄ = A + h·ū and σₓ = h·σᵤ.

<div class="problem" data-problem="st-var"></div>

<div class="myth">

**"Variance is the average distance from the mean."** That is the mean deviation. Variance averages the squared distances, so it is in squared units (cm², not cm) and gives far more weight to values far from the mean. The standard deviation takes the square root to come back to the original units.

</div>

## 3. Change of origin and scale

If every value is changed by y = ax + b:

| Measure | New value |
|---|---|
| mean, median, mode | a × (old) + b |
| range, mean deviation, SD | \|a\| × (old) |
| variance | a² × (old) |

Adding b moves every value by the same amount, so the distances between them do not change. Multiplying by a stretches all the distances by |a|. The **coefficient of variation** `$\text{CV} = \tfrac{\sigma}{\bar x}\times 100$` compares spreads of data sets with different means or units: the lower CV is the more consistent set.

<figure class="fig" data-fig="spread-shift"><figcaption>The top row is the data, the bottom row the data after y = ax + b. The shaded band is one standard deviation either side of the mean. Shift b and the band slides without changing width; scale a and it stretches. Drag the last value away to see an outlier pull the mean.</figcaption></figure>

## 4. Combining groups and correcting errors

**Combined variance** of two groups with sizes n₁, n₂, means x̄₁, x̄₂ and SDs σ₁, σ₂:

```math
\sigma^2 = \frac{n_1(\sigma_1^2 + d_1^2) + n_2(\sigma_2^2 + d_2^2)}{n_1 + n_2}, \qquad d_i = \bar x_i - \bar x
```

where x̄ is the combined mean. The dᵢ terms add the spread between the groups to the spread within them.

<div class="problem" data-problem="st-combined"></div>

**Wrong observation.** Rebuild the sums: Σx = n x̄ and Σx² = n(σ² + x̄²). Subtract the wrong value (and its square), add the correct one, then recompute the mean and variance.

<div class="problem" data-problem="st-wrong"></div>

**Worked example.** The mean of 5 observations is 4.4 and their variance is 8.24. Three of them are 1, 2 and 6. Find the other two. Σx = 22, so a + b = 13. Σx² = 5(8.24 + 19.36) = 138, so a² + b² = 138 − 41 = 97. Then (a + b)² − 2ab = 97 gives ab = 36, and the two values are **4 and 9**.

## 5. Useful properties and bounds

- Σ(xᵢ − x̄) = 0, and Σ(xᵢ − a)² is least when a = x̄.
- σ = 0 exactly when all values are equal.
- The first n natural numbers have mean (n + 1)/2 and variance (n² − 1)/12.
- For values between m and M, the variance is at most (M − m)²/4.
- Mean deviation ≤ standard deviation, always.
- Harmonic mean = n / Σ(1/xᵢ); it is used for average speed over equal distances.

<div class="keypoints">

- Mean Σfx/Σf; combined mean (n₁x̄₁ + n₂x̄₂)/(n₁ + n₂); mode ≈ 3 median − 2 mean.
- σ² = Σfx²/n − x̄²; step deviation: σₓ = h σᵤ.
- Mean deviation is least about the median.
- y = ax + b: centre becomes a × centre + b; SD becomes |a| SD; variance a² × variance.
- Combined variance adds d₁², d₂² for the gap between group means.
- Wrong value: fix Σx and Σx², then recompute. Natural numbers 1 to n: variance (n² − 1)/12.

</div>
