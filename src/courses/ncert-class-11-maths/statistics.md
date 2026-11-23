---
title: Statistics
seoTitle: 'Statistics Class 11 notes: variance and deviation'
summary: 'Class 11 Statistics with animations: range, mean deviation, variance and SD for raw and grouped data, shift and scale, and coefficient of variation.'
minutes: 90
updated: 2026-11-23
quiz:
  - q: 'The mean of 3, 5, 8, 9, 10, 13, 14, 18 is 10. Their mean deviation about the mean is:'
    choices: ['3.75', '30', '0', '4.58']
    ans: 0
    why: 'The absolute deviations are 7, 5, 2, 1, 0, 3, 4, 8, which add to 30. Divide by n = 8: 30/8 = 3.75.'
  - q: 'Every value in a data set is multiplied by 4 and then 7 is added. The standard deviation:'
    choices: ['is multiplied by 4', 'is multiplied by 4 and then 7 is added', 'stays the same', 'is multiplied by 16']
    ans: 0
    why: 'Adding 7 slides all values together and changes no gaps. Multiplying by 4 stretches every gap by 4, so the SD becomes 4 times as large (the variance 16 times).'
  - q: 'Class A has mean 60, SD 9; class B has mean 40, SD 8. Which is more consistent?'
    choices: ['A, CV = 15%', 'B, CV = 20%', 'B, because its SD is smaller', 'They are equally consistent']
    ans: 0
    why: 'CV = SD ÷ mean × 100: A gives 15%, B gives 20%. The smaller CV means more consistent.'
sources:
  - 'NCERT Class 11 Mathematics, Chapter 13 “Statistics” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Pearson, K. (1894), introduction of the term standard deviation; standard formulae for mean deviation, variance and coefficient of variation as in any statistics text (e.g. Freedman, Pisani and Purves, Statistics, Norton). Every numerical example was recomputed in code.'
---

**Maths · Class 11 · Chapter 13 · about 90 minutes.** By the end you will be able to measure how spread out data is with the range, the mean deviation, the variance and the standard deviation (for raw and grouped data), predict what happens when you shift or scale the data, and compare the consistency of two sets with the coefficient of variation.

<div class="bigidea">A mean tells you where the middle of the data is, but not how scattered it is. Two cricketers can both average 40 runs: one scores 38, 41, 40, 42 every time and the other scores 0, 100, 5, 55. Measures of dispersion capture that difference with one number. The big idea is to measure each value's distance from the centre and then average those distances, either as plain gaps (mean deviation) or as squares (variance).</div>

## 1. Why do we need a measure of spread?

Two bus routes both take 30 minutes on average. On route A the trips take 28, 30, 31, 31. On route B they take 10, 20, 40, 50. You would trust route A to reach school on time. The average is the same; the **spread** is not. Statistics gives us several ways to measure spread. All of them compare each value with a centre (usually the mean) or with the other values.

The easiest is the **range**: the largest value minus the smallest. Route A has range `$31 - 28 = 3$`, route B has `$50 - 10 = 40$`. The range is quick but uses only two values, so one wild value changes it completely. Better measures use every value.

## 2. Mean deviation

The **deviation** of a value `$x$` from the mean `$\bar x$` is `$x - \bar x$`. If you add the deviations of all values you always get 0 (the positives and the negatives balance), so that sum is useless. Two fixes: drop the signs, or square them. Dropping signs gives the **mean deviation**:

```math
\text{MD} = \frac{\sum |x_i - \bar x|}{n}
```

Drag the dots in the figure below. Each blue bar is a deviation; its length does not depend on the side. Squeeze the dots together and watch every measure shrink.

<figure class="fig" data-fig="c11m-stat-dots"><figcaption>Seven draggable dots. The orange bars are the deviations from the mean; the shaded band is the mean plus or minus one standard deviation. Range, mean deviation, variance and SD update as you drag.</figcaption></figure>

The mean deviation can be taken about **any** point `$a$`: `$\dfrac{\sum |x_i - a|}{n}$`. NCERT-style questions use the mean or the median. Slide the centre point below and notice which place makes the total of the bars smallest.

<figure class="fig" data-fig="c11m-stat-meandev"><figcaption>Mean deviation about a movable centre c. The total of the bars is smallest when c is the median. Choose data set B to see how one big value drags the mean away.</figcaption></figure>

**Worked example.** Find the mean deviation about the mean of `$3, 5, 8, 9, 10, 13, 14, 18$`. The mean is `$80/8 = 10$`. The absolute deviations are `$7, 5, 2, 1, 0, 3, 4, 8$`, which add to 30. So MD `$= 30/8 = 3.75$`.

For data with frequencies, weight each term: `$\text{MD} = \dfrac{\sum f_i |x_i - \bar x|}{\sum f_i}$`. For grouped data (classes), use the **class mark**, the middle of the class, as `$x_i$`.

<div class="problem" data-problem="c11m-stat-md"></div>

## 3. Variance and standard deviation

The other fix for the signs problem is to square the deviations. Their average is the **variance** `$\sigma^2$`:

```math
\sigma^2 = \frac{\sum (x_i - \bar x)^2}{n}, \qquad \sigma = \sqrt{\sigma^2}
```

The **standard deviation** `$\sigma$` is the square root of the variance. Why take the root? Squaring changes the units (metres become square metres); the square root brings them back, so a standard deviation of 4.58 for marks is 4.58 marks.

Think of each squared deviation as a real square whose side is the distance from the mean. The variance is the **average area** of those squares. Slide the controls to see what a shift and a stretch do to the squares:

<figure class="fig" data-fig="c11m-stat-variance"><figcaption>One square per value, with side equal to its distance from the mean. Add k to all values: the squares do not change. Multiply all values by m: every side is m times longer, so the SD is m times larger and the variance m² times.</figcaption></figure>

<div class="steps" data-fig="c11m-stat-varsteps">
<div class="step">Step 1: the mean. Σx = 80 and n = 8, so mean = 10.</div>
<div class="step">Step 2: the deviations x − mean: −7, −5, −2, −1, 0, 3, 4, 8 (they add to 0, always).</div>
<div class="step">Step 3: the mean deviation: (7 + 5 + 2 + 1 + 0 + 3 + 4 + 8) ÷ 8 = 3.75.</div>
<div class="step">Step 4: square the deviations: 49, 25, 4, 1, 0, 9, 16, 64 (sum 168).</div>
<div class="step">Step 5: the variance is their average: 168 ÷ 8 = 21.</div>
<div class="step">Step 6: the standard deviation is the square root: √21 ≈ 4.58.</div>
<div class="step">Shortcut check: variance = Σx²/n − mean² = 968/8 − 100 = 21.</div>
</div>

<div class="meaning">
<dl>
<dt>`$\bar x$`</dt><dd>the mean, the balance point of the data.</dd>
<dt>`$x_i - \bar x$`</dt><dd>the deviation: how far, and on which side, value `$i$` is from the mean.</dd>
<dt>`$\sigma^2$`</dt><dd>the variance: the average squared deviation. Its unit is the unit of the data squared.</dd>
<dt>`$\sigma$`</dt><dd>the standard deviation: the typical distance from the mean, in the data's own unit.</dd>
</dl>
</div>

A shortcut that saves a lot of subtraction: expand the square and use `$\sum x_i = n\bar x$`, which gives

```math
\sigma^2 = \frac{\sum x_i^2}{n} - \bar x^2
```

"The mean of the squares minus the square of the mean". For frequency data, `$\sigma^2 = \dfrac{\sum f_i x_i^2}{n} - \bar x^2$` where `$n = \sum f_i$`.

<div class="problem" data-problem="c11m-stat-var"></div>

<div class="problem" data-problem="c11m-stat-sd"></div>

<div class="myth">

**"The standard deviation is the same as the mean deviation."** They are different numbers. For the data 3, 5, 8, 9, 10, 13, 14, 18 the mean deviation is 3.75 but the standard deviation is 4.58. The SD squares first, so it gives more weight to values far from the mean, and it is always at least as large as the mean deviation. Also be careful to divide by `$n$`, the number of values, in this chapter.

</div>

## 4. Spread of grouped data

When data come as a frequency table with classes such as 10–20, 20–30, ..., we do not know each exact value, so we use the **class mark** (the middle of the class) for every value in that class. Then `$\bar x = \dfrac{\sum f_i x_i}{n}$` and `$\sigma^2 = \dfrac{\sum f_i (x_i - \bar x)^2}{n}$`. Drag the bar tops in the histogram to change the class frequencies and see the mean and SD respond.

<figure class="fig" data-fig="c11m-stat-grouped"><figcaption>A histogram of five classes. Drag a bar's top to change its frequency. The orange line is the mean; the green band is the mean plus or minus one standard deviation.</figcaption></figure>

With big class marks, the arithmetic is heavy. The **step-deviation method** makes it light: choose an assumed mean `$A$` (a class mark near the middle), let `$h$` be the class width and set `$y_i = \dfrac{x_i - A}{h}$`. Then

```math
\bar x = A + h\,\frac{\sum f_i y_i}{n}, \qquad \sigma^2 = h^2\left[\frac{\sum f_i y_i^2}{n} - \left(\frac{\sum f_i y_i}{n}\right)^2\right]
```

Step through an example with five classes:

<div class="steps" data-fig="c11m-stat-groupsteps">
<div class="step">Marks 10–20, 20–30, 30–40, 40–50, 50–60 with frequencies 4, 6, 10, 8, 2 (n = 30). Class marks 15, 25, 35, 45, 55.</div>
<div class="step">Assume A = 35 and h = 10, so y = (x − 35)/10 = −2, −1, 0, 1, 2.</div>
<div class="step">Σfy = −8 − 6 + 0 + 8 + 4 = −2.</div>
<div class="step">The mean = 35 + 10(−2/30) = 34.33.</div>
<div class="step">Σfy² = 16 + 6 + 0 + 8 + 8 = 38.</div>
<div class="step">The variance = 100 × (38/30 − (1/15)²) = 126.22.</div>
<div class="step">The standard deviation = √126.22 ≈ 11.23 marks.</div>
</div>

<!--fig:tool grouped-data-stats-->

Try the [Spread explorer](/learn/spread-explorer/) with your own numbers, or look at a whole [distribution](/science/distribution-explorer/).

<div class="problem" data-problem="c11m-stat-grouped"></div>

## 5. What happens if every value is changed?

Suppose every mark is increased by 5 (a grace bonus). The mean goes up by 5; nobody moved relative to anyone else, so the range, the mean deviation and the SD do not change. Now suppose every value is multiplied by 3 (changing from a test out of 20 to one out of 60). All gaps become 3 times larger: the mean, range, mean deviation and SD all become 3 times larger, and the variance becomes 9 times larger. In short, for new values `$y = ax + b$`:

```math
\bar y = a\bar x + b, \qquad \sigma_y = |a|\,\sigma_x, \qquad \sigma_y^2 = a^2\sigma_x^2
```

The shift `$b$` affects only the mean. Use the figure of the squares above to confirm.

<div class="problem" data-problem="c11m-stat-shift"></div>

## 6. Comparing two series: coefficient of variation

Which is more consistent: a batsman who scores 60 ± 9 or one who scores 40 ± 8? The SD is in runs, and 8 runs matters more when the mean is only 40. For a fair comparison we measure the spread **relative to the mean**. The **coefficient of variation** is

```math
\text{CV} = \frac{\sigma}{\bar x} \times 100\ \%
```

A smaller CV means more consistent data. Here the first batsman has `$9/60 = 15\%$` and the second `$8/40 = 20\%$`, so the first is more consistent, even though his SD is bigger. Move the sliders: you can make a set with a larger SD that is nevertheless more consistent.

<figure class="fig" data-fig="c11m-stat-cv"><figcaption>Two sets of marks drawn as bell curves. The one with the smaller coefficient of variation is more consistent, which is not always the one with the smaller standard deviation.</figcaption></figure>

<div class="problem" data-problem="c11m-stat-cv"></div>

<!--fig:tool spread-explorer-->

<div class="history">

- **1801:** William Playfair publishes bar charts and line graphs of Britain's trade, the start of drawing data.
- **1894:** Karl Pearson introduces the term "standard deviation".
- **1920s:** Ronald Fisher builds the variance into the analysis of farm experiments at Rothamsted.
- **Today:** quality control in factories tracks the SD of bolt lengths to catch problems early.

</div>

<div class="keypoints">

- Range = largest − smallest: simple, but it uses only two values.
- Mean deviation `$= \sum f|x - \bar x|/n$`; about the median it is the smallest possible.
- Variance `$\sigma^2 = \sum f(x - \bar x)^2/n = \sum fx^2/n - \bar x^2$`; standard deviation `$\sigma = \sqrt{\sigma^2}$`.
- For grouped data use class marks; the step-deviation method uses `$y = (x - A)/h$`.
- If `$y = ax + b$`: `$\sigma_y = |a|\sigma_x$`; adding a constant does not change the spread.
- `$\text{CV} = \sigma/\bar x \times 100$`: the smaller CV is the more consistent series.
- Beyond the syllabus: the sample variance (dividing by `$n - 1$`), skewness and kurtosis appear in later courses.

</div>

Going further for JEE/NEET: [Statistics](/learn/courses/engineering-entrance/statistics/) has the exam-level problems on combined mean and variance and corrected data.
