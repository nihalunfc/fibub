---
title: 'The centre: mean, median and mode'
summary: 'The three averages, how to work each one out, and which to report: the mean for totals and budgets, the median for typical values with a long tail, the mode for categories.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'Order values were $20, $22, $25, $28 and $400. Which average best describes a typical order?'
    choices: ['The mean, $99', 'The median, $25', 'The mode']
    ans: 1
    why: 'The one $400 order drags the mean to $99, above four of the five orders. The median, $25, sits in the middle and ignores how extreme the top value is.'
  - q: 'A shop sold 120 units over 30 days. Finance wants to forecast next month''s total. Which average should they use?'
    choices: ['The mean (4 a day), because totals are built from means', 'The median, because it resists outliers', 'The mode']
    ans: 0
    why: 'Mean × number of days = total, so the mean is the right average whenever you need to rebuild a total. The median has no such link to the sum.'
  - q: 'What is the mode of the payment methods card, card, cash, phone, card, cash?'
    choices: ['Card', 'Cash', 'There is no mode for categories']
    ans: 0
    why: 'The mode is the most common value. Card appears 3 times. It is the only average that works for categories like these.'
sources:
  - 'OpenIntro Statistics, 4th edition, Section 2.1 Examining numerical data https://www.openintro.org/book/os/'
  - 'NIST/SEMATECH e-Handbook, 1.3.5.1 Measures of Location https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm'
---

**Module 1 · about 20 minutes · school maths.** You'll be able to work out the mean, median and mode, explain why they differ, and choose the right one for a report.

<div class="bigidea">The mean shares the total out equally, the median is the middle person, and the mode is the most common value: three different questions, three different answers.</div>

**In everyday terms:** seven friends split a restaurant bill. The mean is what each pays if they split it evenly. The median is what the friend in the middle of the price list ordered. The mode is the dish most people chose.

## 1. Why there are three averages

"Average" sounds like one number, but there are three common ones, and on real business data they can disagree wildly. Average house prices, salaries and order values are famous for this. Picking the wrong one is one of the easiest ways for a report to mislead, often by accident.

## 2. The mean

Add up all the values and divide by how many there are:

```math
\bar{x} = \frac{x_1 + x_2 + \cdots + x_n}{n} = \frac{1}{n}\sum_{i=1}^{n} x_i
```

`$\bar{x}$` (say "x bar") is the mean of a sample; `$\mu$` (mu) is the mean of a whole population. The mean has one property nothing else has: **mean × count = total**. That makes it the right average for budgets, forecasts and anything that is later added up.

Its weakness: every value pulls on it, so a single extreme value can drag it a long way.

Drag the number of bins from 3 to 40, then switch to equal-count edges.

<figure class="fig" data-fig="@data-hist-bins"><figcaption>Notice that the same data can look like one hump or two depending on the bins you choose.</figcaption></figure>


## 3. The median

Sort the values and take the middle one. With an even number of values, take the mean of the two middle ones. Half the values are below the median and half above, however extreme the ends are.

<!--fig:mean-median-->

Drag the biggest value. The mean chases it; the median hardly moves. For anything with a long tail (pay, prices, order values, time on site, delivery times), the median describes the **typical** case far better.

## 4. The mode

The most common value. It is the only average for **categories** (most common payment method, busiest day of the week) and is handy for counts (most customers buy exactly 1 item). For measurements with decimals, every value may be unique, so the mode is rarely useful there unless you first group values into bins.

## 5. Which one to report

| Situation | Report | Why |
|---|---|---|
| Totals, budgets, forecasts | Mean | Mean × count rebuilds the total |
| Typical customer, house, salary, wait | Median | Not dragged by a few extremes |
| Categories, most popular option | Mode | The only one that works |
| Both matter (e.g. order value) | Mean **and** median | The gap between them shows the skew |

A useful habit: when the mean and median are far apart, say so. "Mean order $61, median $38" tells a manager there are some very large orders worth looking at.

<div class="meaning">

<dl>
<dt>Mean x̄</dt><dd>Add everything up, divide by how many: the "equal share".</dd>
<dt>Median</dt><dd>Sort the values; the middle one. Half are below, half above.</dd>
<dt>Mode</dt><dd>The value (or category) that turns up most often.</dd>
<dt>Physical meaning</dt><dd>The mean is the balance point of a see-saw holding every value at its place; one heavy value far out tips it a long way. The median only cares about order, so a billionaire walking into a café changes the mean income enormously and the median not at all.</dd>
</dl>

</div>

<div class="myth">

**"The average customer spends the mean."** With a long tail, most customers spend less than the mean: in the worked example six of seven do. Report the median as "typical" and keep the mean for totals and budgets.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The data.</b> Seven customers spent $12, $15, $15, $18, $22, $30 and $250.</div>
<div class="step"><b>Mean.</b> Add: 362. Divide by 7: about $51.71, the equal share.</div>
<div class="step"><b>Median.</b> Already sorted; the 4th of 7 values is the middle: $18.</div>
<div class="step"><b>Mode.</b> $15 appears twice, more than any other: $15.</div>
<div class="step"><b>Why they differ.</b> The $250 customer pulls the mean up; the median does not move. Six of seven customers spent below the mean.</div>
<div class="step"><b>Report.</b> "Typical spend $18; one large order of $250." Use the mean (7 × $51.71 = $362) for the revenue forecast.</div>
</div>

<div class="problem" data-problem="centre-mean-median"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the mean is the balance point of the data (where a ruler with the values as weights would balance); the median is the halfway point by count.

**Equations:** `$\bar{x} = \frac{1}{n}\sum x_i$`. The median is the value at position `$\frac{n+1}{2}$` in sorted order.

A second way to see the difference: the mean is the number `$c$` that makes the total squared distance `$\sum (x_i - c)^2$` smallest; the median makes the total plain distance `$\sum |x_i - c|$` smallest. Squaring punishes big gaps heavily, which is why the mean chases outliers.

**Try it:** for 1, 2, 3, 4, 100, the mean is 22 and the median is 3. Which one is closer to most of the values? (The median, by a mile.)
</details>

## 6. Worked example

*Made-up numbers.* Seven customers' spend in a week: $12, $15, $15, $18, $22, $30, $250.

- **Mean:** total = 12 + 15 + 15 + 18 + 22 + 30 + 250 = 362. 362 ÷ 7 ≈ **$51.71**.
- **Median:** already sorted; 7 values, so the middle is the 4th: **$18**.
- **Mode:** $15 appears twice: **$15**.

Six of the seven customers spent less than the mean. "Average customer spend is $52" is true but describes nobody. "The typical customer spent $18, and one big customer spent $250" is the honest report. If the store wants next week's revenue, though, the mean is still the number: 7 customers × $51.71 = $362.

## 7. Practice

1. Find the mean, median and mode of 4, 8, 6, 5, 3, 8, 7, 9.
2. Ten staff earn $40k each and the owner earns $400k. Work out the mean and median pay. Which would a recruiting ad likely quote?
3. Which average would you use for (a) the most popular pizza topping, (b) typical time on a support call, (c) next quarter's total units?

<details>
<summary>Answers</summary>

1. Sum 50, n = 8, mean 6.25. Sorted 3, 4, 5, 6, 7, 8, 8, 9: median (6 + 7) ÷ 2 = 6.5. Mode 8.
2. Mean (10 × 40 + 400) ÷ 11 ≈ $72.7k; median $40k. An ad might quote the mean because it sounds better, though 10 of 11 people earn $40k.
3. (a) Mode. (b) Median (call times have a long tail). (c) Mean × number of periods.
</details>

**Try it on your own data:** the [[grouped-data-stats]] tool works out all three averages from a frequency table, and the [[csv-profiler]] shows the mean and median of every column in a file.

**New words:** *mean*, *median*, *mode*, *sample mean* `$\bar{x}$`, *population mean* `$\mu$`, *outlier*, *long tail*.

<div class="keypoints">

- Mean = total ÷ count; it uses every value and is pulled by extremes.
- Median = the middle value after sorting; it resists outliers and long tails.
- Mode = the most common value; the only average for categories.
- Typical value: median. Totals and budgets: mean. Categories: mode.

</div>
