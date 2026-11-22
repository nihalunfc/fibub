---
title: 'Cleaning: missing values, outliers and scaling'
seoTitle: 'Data cleaning: missing values, outliers and scaling'
summary: 'Real data has gaps, errors and columns on wildly different scales. Learn the safe ways to fill gaps, when to keep or fix outliers, and why distance-based models need scaling, with two simulations.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: Filling every missing value with the column mean does what to the spread?
    choices: ['Makes it larger', 'Makes it smaller, because many values now sit exactly at the centre', 'Leaves it exactly the same']
    ans: 1
    why: The filled values add rows at the mean but no distance from it, so the standard deviation shrinks.
  - q: 'Age is in years (20 to 70) and income in dollars (20,000 to 150,000). Without scaling, a distance-based model mostly uses:'
    choices: ['Age', 'Income', 'Both equally']
    ans: 1
    why: Income gaps are thousands of times bigger in number, so they swamp age in any distance.
  - q: 'What is the z-score of 85 if the mean is 70 and the standard deviation is 10?'
    choices: ['1.5', '15', '0.85']
    ans: 0
    why: z = (85 − 70) ÷ 10 = 1.5. The value is one and a half standard deviations above the mean.
sources:
  - 'Little, R. J. A. and Rubin, D. B. (2019), Statistical Analysis with Missing Data, 3rd ed., Wiley, Chapter 1 (why data are missing)'
  - 'scikit-learn user guide: Imputation of missing values https://scikit-learn.org/stable/modules/impute.html'
  - 'scikit-learn user guide: Preprocessing data (standardisation and min-max scaling) https://scikit-learn.org/stable/modules/preprocessing.html'
---

**Module 2 · about 25 minutes · read first: 1.6, 2.2.** You'll be able to choose a way to handle missing values, decide what to do with an outlier, and standardise or min-max scale a column.

<div class="bigidea">Fill gaps carefully, fix errors but keep real extremes, and put columns on the same scale, always using numbers worked out from the training rows only.</div>

## 1. Why this matters

Data scientists often say they spend most of their time cleaning. It is like washing and chopping vegetables before cooking: dull, but skip it and the meal is ruined. Models can't use blank cells, are thrown by impossible values, and many quietly favour whichever column has the biggest numbers. A few careful steps here fix more problems than any clever model later.

## 2. Missing values

First ask **why** a value is missing. If a sensor was broken at random, the gap carries no information. If customers skip the income question when their income is very high or very low, the gap itself is a clue. Then choose:

| Method | When it is reasonable | The cost |
|---|---|---|
| **Drop the rows** | Few rows affected, missing at random | You lose those rows' other columns too |
| **Drop the column** | Mostly empty, or not useful | You lose the feature |
| **Fill with mean or median** | A modest share is missing | Shrinks the spread; hides uncertainty |
| **Fill with the most common category** | Categorical columns | Over-counts that category |
| **Fill from similar rows** (k-nearest neighbours) or a model | Gaps follow a pattern | More work; can leak (see below) |
| **Add a "was missing" flag** | Always worth it alongside a fill | One extra column |

<!--fig:missing-values-->

**Important:** work out fill values (means, medians) from the **training rows only**, then apply them to the test rows. Using the whole dataset lets test information slip into training: a small case of **leakage** (Lesson 7.4).

<div class="problem" data-problem="cleaning-data-median-fill"></div>

## 3. Outliers

An outlier is a value far from the rest. Tukey's rule from Lesson 2.2 flags values beyond 1.5 IQR outside the box. Then decide which kind it is:

- **An error:** a height of 17 m, a negative age, hours typed as minutes. Fix it if you can tell what was meant, otherwise set it to missing.
- **Real but extreme:** a $40 million house, a customer with 900 orders. Keep it. If it overwhelms a squared-error model, consider **capping** (also called winsorising: set everything above the 99th percentile to the 99th percentile), using a log scale, or a model that copes (trees, Module 5).
- **The point of the study:** fraud, machine faults, rare diseases. Never delete these. Finding them is the job (Lesson 8.5).

<div class="myth">

**"Outliers are bad data, so delete them."** Some are errors, and those should be fixed. But many are real, and some are exactly what you are looking for. A fraud model trained on data with the strangest payments deleted has been taught that fraud doesn't exist. Check each outlier, fix the impossible ones, and keep the real ones.

</div>

## 4. Scaling

Columns come in different units and sizes. Models that use **distances** (k-nearest neighbours, k-means, support vector machines) or **gradient descent** (linear and logistic regression, neural networks) are thrown off by that. Pick a customer below and compare raw and scaled distances.

<!--fig:scaling-->

Two common scalings:

- **Standardisation** (z-scores): subtract the mean, divide by the standard deviation. Each column then has mean 0 and standard deviation 1.
- **Min-max scaling:** shift and stretch to the range 0 to 1.

Here is standardisation step by step, for two customers described by age and income:

<div class="steps">
<div class="step"><b>Raw gaps.</b> Customer A is 25 with income $50,000; B is 55 with $55,000. Gaps: 30 years and $5,000.</div>
<div class="step"><b>Raw distance.</b> √(30² + 5000²) ≈ 5000.09. Age adds less than 0.1: the model would barely notice a 30-year age gap.</div>
<div class="step"><b>Divide by the spreads.</b> In the training data, age has standard deviation 14 years and income $22,000. So the gaps become 30 ÷ 14 = 2.14 and 5000 ÷ 22000 = 0.23 standard deviations.</div>
<div class="step"><b>Scaled distance.</b> √(2.14² + 0.23²) ≈ 2.15. Now the age gap, which really is large, counts most.</div>
</div>

<div class="problem" data-problem="cleaning-data-zscore"></div>

Trees (Module 5) and forests don't need scaling, because they only ask "is x above or below this value?", and scaling doesn't change the order of values.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** scaling changes the units of each column so that no column dominates just because its numbers are big.

**Equations:**

```math
z = \frac{x - \bar{x}}{s} \qquad\qquad x' = \frac{x - x_{\min}}{x_{\max} - x_{\min}}
```

**Why distance needs it:** the straight-line distance between two rows is

```math
d = \sqrt{(\Delta\,\text{age})^2 + (\Delta\,\text{income})^2}
```

With a 30-year age gap and a $5,000 income gap, `$d = \sqrt{30^2 + 5000^2} \approx 5000.09$`. Age adds less than 0.1 to the distance. After standardising (say `$s_{\text{age}} = 14$` years and `$s_{\text{income}} = \$22{,}000$`), the gaps become 2.1 and 0.23, and age now counts most.

**Analogy:** comparing two runners by height in metres and weight in grams. Weight wins every argument purely because of the unit.

**Try it:** a column has min 10 and max 50. Min-max scale 20. (`$(20 - 10) / 40 = 0.25$`.)
</details>

<div class="meaning">

<dl>
<dt>x̄ and s</dt><dd>The mean and standard deviation of the column, worked out on the training rows.</dd>
<dt>z = (x − x̄) ÷ s</dt><dd>How many standard deviations a value sits above (positive) or below (negative) the average.</dd>
<dt>x′ = (x − min) ÷ (max − min)</dt><dd>Where a value sits between the smallest (0) and largest (1) in the training data.</dd>
<dt>Imputation</dt><dd>Filling a blank with a sensible stand-in, such as the training median.</dd>
<dt>Physical meaning</dt><dd>Scaling swaps each column's own units (years, dollars, grams) for one shared unit: "how unusual is this?". A z of 2 means "quite unusual" whether it is a height, a price or a temperature, so no column wins an argument just because its unit is small.</dd>
</dl>

</div>

## 5. Worked example

*Made-up numbers.* A clinic table of 2,000 patients has: age (40 blanks), weight in kg (3 values of 0, 1 of 700), blood pressure, and smoker (yes/no, 120 blanks).

1. **Weight 0 and 700:** errors. Set them to missing.
2. **Age:** 2 % missing, no pattern found. Fill with the training-set median (52) and add `age_missing`.
3. **Smoker:** 6 % missing, and the blanks are mostly from one clinic that didn't ask. Add a third category "unknown" rather than guessing "no".
4. **Scaling:** standardise age, weight and blood pressure using training means and standard deviations, because the next step uses logistic regression.

## 6. Practice

1. Standardise 130 when the mean is 100 and the standard deviation is 20.
2. Should you delete the 50 most unusual credit card payments before training a fraud model?
3. Why compute the fill value from training rows only?

<details>
<summary>Answers</summary>

1. z = (130 − 100) / 20 = 1.5.
2. No. Unusual payments are exactly what the model must learn about. Check them for errors, but keep the real ones.
3. Because the test set must stand in for future data the model has never seen. Using it to compute fills lets its information leak into training.
</details>

**Try it on your own data:** the [[csv-profiler]] counts blanks per column and flags outliers.

**New words:** *missing at random*, *imputation* (filling gaps), *missing flag*, *capping* or *winsorising*, *standardisation*, *z-score*, *min-max scaling*, *leakage*.

<div class="keypoints">

- Ask why a value is missing; fill with the median or most common value and add a "was missing" flag.
- Fix outliers that are errors; keep real extremes, and never delete the cases you are trying to find.
- Standardise (z = (x − mean) ÷ sd) or min-max scale for models that use distances or gradient descent; trees don't need it.
- Work out every fill value, mean and sd from the training rows only, to avoid leakage.

</div>
