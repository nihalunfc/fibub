---
title: 'Median, range and standard deviation'
seoTitle: 'Median, range and standard deviation for the GMAT'
summary: 'Median and mode, range, what standard deviation measures without heavy formulas, and how adding or multiplying every value changes the mean, median, range and standard deviation.'
minutes: 14
updated: 2026-11-22
quiz:
  - q: What is the median of 3, 9, 4, 12, 7, 1?
    choices: ['5.5', '7', '6']
    ans: 0
    why: 'Sorted: 1, 3, 4, 7, 9, 12. The two middle values are 4 and 7: (4 + 7) ÷ 2 = 5.5.'
  - q: Every value in a list is multiplied by 3. The standard deviation...
    choices: ['is multiplied by 3', 'stays the same', 'is multiplied by 9']
    ans: 0
    why: 'All distances from the mean triple, so the SD triples. (The variance is multiplied by 9.)'
  - q: Which list has standard deviation 0?
    choices: ['4, 4, 4, 4', '1, 2, 3, 4', '0, 0, 1, 1']
    ans: 0
    why: 'Standard deviation is 0 only when every value is the same.'
sources:
  - 'OpenStax, Introductory Statistics 2e (CC BY 4.0), section 2.7 Measures of the spread of the data: https://openstax.org/books/introductory-statistics-2e/pages/2-7-measures-of-the-spread-of-the-data'
  - 'fibub, Statistics for analysts: The spread (range, variance, standard deviation and IQR): https://fibub.com/learn/courses/statistics/spread/'
---

**Module 5 · about 14 minutes.** By the end you will compare spreads at a glance and know how each statistic reacts when the data change.

<div class="bigidea">The mean and median say where the data sit; the range and standard deviation say how spread out they are. The GMAT tests the ideas far more than the formulas.</div>

## 1. Median and mode

- **Median:** the middle value after **sorting**. With an even count, the average of the two middle values.
- **Mode:** the value that appears most often.
- The median ignores how extreme the end values are; the mean does not. A billionaire walking into a room changes the mean wealth enormously and the median hardly at all.

<div class="problem" data-problem="sp-g01"></div>

## 2. Range and standard deviation

- **Range = largest − smallest.**
- **Standard deviation (SD)** is roughly the typical distance of a value from the mean. Formally: find each distance from the mean, square it, average the squares (that is the **variance**), then take the square root.

<figure class="fig" data-fig="dot-plot"><figcaption>The shaded band runs one standard deviation either side of the mean. Bunch the values together and it shrinks; spread them out and it grows.</figcaption></figure>

On the GMAT you will rarely calculate an SD. You will **compare** them: the list whose values sit farther from their mean has the larger SD. 1, 5, 5, 9 is more spread than 3, 4, 6, 7 even though both have mean 5.

<div class="problem" data-problem="sp-g03"></div>

## 3. What happens when you change every value

| Change to every value | Mean and median | Range and SD |
|---|---|---|
| add k | add k | unchanged |
| multiply by k | multiply by k | multiply by |k| |

<div class="steps" data-title="Worked example: a list has mean 20 and SD 4. Every value is doubled, then 5 is subtracted.">
<div class="step">Doubling: mean 40, SD 8.</div>
<div class="step">Subtracting 5: the mean moves to 35; the spread is unchanged, so SD stays 8.</div>
<div class="step">New mean <b>35</b>, new SD <b>8</b>.</div>
</div>

<div class="problem" data-problem="sp-g02"></div>

<div class="myth">

**"Adding a value equal to the mean leaves the SD unchanged."** The mean stays the same, but the SD gets <b>smaller</b>: you added a value at distance 0, which lowers the typical distance. Adding values far from the mean makes the SD bigger.

</div>

<div class="keypoints">

- Sort before finding the median; with an even count, average the middle two.
- The median resists extreme values; the mean does not.
- SD is the typical distance from the mean; variance is its square.
- Adding k to every value shifts the centre but not the spread; multiplying by k scales both.
- A value at the mean lowers the SD; values far away raise it.

</div>
