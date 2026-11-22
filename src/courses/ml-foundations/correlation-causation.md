---
title: Correlation is not causation
summary: 'The correlation r measures how closely two columns follow a straight line. It can be fooled by one point, it misses curves, and it never proves that one thing causes the other. Set r yourself, then uncover a hidden cause.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'r = −0.9 between two columns means:'
    choices: ['Almost no relationship', 'A strong straight-line relationship where one goes up as the other goes down', 'One causes the other to fall']
    ans: 1
    why: The sign gives the direction and the size the strength. It says nothing about cause.
  - q: 'Points lie on a perfect U-shaped curve. What is r likely to be?'
    choices: ['Close to 1', 'Close to 0', 'Close to −1']
    ans: 1
    why: r only measures straight-line patterns. A symmetric U goes down then up, and the two halves cancel out.
  - q: 'Towns with more fire engines at a fire have more damage. What explains it?'
    choices: ['Fire engines cause damage', 'Bigger fires bring more engines and cause more damage (a confounder)', 'It is a coincidence']
    ans: 1
    why: The size of the fire drives both. Comparing fires of the same size would show engines reduce damage.
sources:
  - 'Anscombe, F. J. (1973), Graphs in Statistical Analysis, The American Statistician 27(1), 17-21 https://doi.org/10.1080/00031305.1973.10478966'
  - 'Pearl, J. and Mackenzie, D. (2018), The Book of Why: The New Science of Cause and Effect, Basic Books'
  - 'Freedman, D., Pisani, R. and Purves, R. (2007), Statistics, 4th ed., W. W. Norton, Chapters 1, 2, 8 and 9 (experiments, observational studies, correlation)'
---

**Module 2 · about 20 minutes · read first: 1.6.** You'll be able to compute and read the correlation r, name its blind spots, and explain why a correlation in data does not mean one thing causes the other.

<div class="bigidea">Correlation tells you two things move together in a straight-line way; only a fair experiment can tell you that changing one will change the other.</div>

## 1. Why this matters

Exploring data, you'll find columns that move together. That is useful: a feature that moves with the label is a good candidate for a model. But it is easy to slide from "goes with" to "causes", and decisions built on that slide fail. Umbrella sales and car crashes rise together, yet banning umbrellas would not make roads safer: rain drives both. A model can predict well from a correlation; it cannot tell you what will happen if you *change* something.

## 2. The correlation coefficient

Pearson's **correlation coefficient** `$r$` measures how closely points follow a straight line:

- `$r = +1$`: a perfect uphill line.
- `$r = 0$`: no straight-line pattern.
- `$r = -1$`: a perfect downhill line.

<!--fig:correlation-slider-->

Things to notice: at r = 0.3 you can barely see the pattern by eye; at 0.9 it is a clear band. And one far-away point (the button) can drag r a long way.

Here is r worked out for three days of an ice-cream van's log, (sunshine hours, tubs in tens):

<div class="steps">
<div class="step"><b>The data.</b> (1, 2), (2, 4), (3, 5). The means are 2 hours and 11/3 ≈ 3.67 tens.</div>
<div class="step"><b>Centre each column.</b> Subtract the means. Sunshine: −1, 0, +1. Tubs: −1.67, +0.33, +1.33.</div>
<div class="step"><b>Multiply pairs and add.</b> (−1)(−1.67) + 0 × 0.33 + 1 × 1.33 = 3. Positive, because sunny-above-average days are also sales-above-average days.</div>
<div class="step"><b>Scale it.</b> Divide by √(1 + 0 + 1) × √(2.78 + 0.11 + 1.78) = 1.414 × 2.160 = 3.055.</div>
<div class="step"><b>Read it.</b> r = 3 ÷ 3.055 ≈ 0.98: an almost perfect uphill line. It says nothing yet about why.</div>
</div>

<div class="problem" data-problem="correlation-causation-r"></div>

## 3. What r misses

- **Curves.** A U shape or an arch can have r near 0 though y depends completely on x.
- **Outliers.** One extreme point can create a strong r from nothing, or hide a real one.
- **Groups.** Two separate clouds can give a strong r overall even when there is no pattern inside either group, or the reverse (Simpson's paradox: a trend that flips when you split by group).
- **Steepness.** r says how *tight* the line is, not how *steep*. A nearly flat line can have r = 0.99.

So always draw the scatter plot. The statistician Francis Anscombe made four small datasets with almost identical means, variances and r of about 0.82, which look completely different when plotted.

## 4. Why correlation is not causation

When A and B move together, there are several possible stories:

1. **A causes B.** Exercise lowers resting heart rate.
2. **B causes A** (reverse causation). Do happy people exercise more, or does exercise make people happy?
3. **Something else causes both** (a **confounder**). See below.
4. **Chance.** Test enough pairs of columns and some will correlate by luck.
5. **Selection.** The data only includes some cases, which creates a pattern (studying only successful companies makes risky habits look like the key to success).

<!--fig:hidden-cause-->

The way to show cause is an **experiment**: change A on purpose, at random, for some cases and not others, and see if B follows (a randomised controlled trial or an A/B test). Randomising breaks every link with hidden causes. Without an experiment, careful methods can *adjust* for confounders you know about, but never for ones you don't.

<div class="myth">

**"A strong correlation proves cause; it's only weak ones that are doubtful."** Strength has nothing to do with it. The number of fire engines sent to a fire and the damage done are strongly correlated, because big fires get more engines and do more damage. Compare fires of the same size and more engines mean *less* damage. A tight band on a scatter plot can still be built entirely by a hidden cause.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** r is the covariance of x and y scaled by both standard deviations, so it has no units and lies between −1 and 1.

**Equation:**

```math
r = \frac{\sum_{i=1}^{n} (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum_{i}(x_i - \bar{x})^2}\ \sqrt{\sum_{i}(y_i - \bar{y})^2}}
```

The top is large and positive when points above the mean in x are also above the mean in y. With the values centred (mean subtracted), this is the cosine of the angle between the x and y columns treated as vectors (Lesson 1.4).

`$r^2$` is the share of the variation in y that a straight line on x accounts for. r = 0.6 gives `$r^2 = 0.36$`: 36 %.

**Analogy:** two people walking on a beach. Correlation says their footprints run side by side; it can't say if one is following the other or both are following the path.

**Try it:** points (1, 2), (2, 4), (3, 5). Means 2 and 11/3. Deviations x: −1, 0, 1; y: −5/3, 1/3, 4/3. Top: 5/3 + 0 + 4/3 = 3. Bottom: √2 × √(42/9) ≈ 1.414 × 2.160 ≈ 3.055. So r ≈ 0.98.
</details>

<div class="meaning">

<dl>
<dt>r</dt><dd>A score from −1 to +1 for how closely points follow a straight line: the sign gives the direction, the size the tightness.</dd>
<dt>(x − x̄)(y − ȳ)</dt><dd>Positive when a point is above average in both or below in both; negative when it is above in one and below in the other.</dd>
<dt>r²</dt><dd>The share of the ups and downs in y that a straight line on x accounts for.</dd>
<dt>Confounder</dt><dd>A hidden third thing that pushes both columns, making them move together.</dd>
<dt>Physical meaning</dt><dd>Correlation is two people walking side by side on a beach: their footprints run together, but you can't tell whether one is following the other or both are following the path. An experiment is making one of them turn left on purpose and watching whether the other turns too.</dd>
</dl>

</div>

## 5. Worked example

*Made-up numbers.* A school finds that pupils who eat breakfast score higher (r = 0.35 between "days with breakfast per week" and maths score). Should it open a breakfast club to raise scores? Possible confounders: family income (affects both breakfast and tutoring), sleep (pupils who sleep enough wake in time to eat), and commute length. Looking only at pupils from similar-income families, r drops to 0.12. A fair test would be to offer a free breakfast club in randomly chosen classes and compare scores with the others after a term. A predictive model may still use breakfast as a feature, because it helps predict scores, but the school should not claim breakfast *causes* the gain from this data alone.

## 6. Practice

1. r = 0.05 between x and y. Can y still depend strongly on x?
2. Cities with more libraries have more crime. Name a likely confounder.
3. An online shop shows a new button to a random half of visitors. Those who see it buy 3 % more. Is this correlation or causation?

<details>
<summary>Answers</summary>

1. Yes, if the relationship is curved (for example a U shape).
2. Population size: bigger cities have more of everything.
3. Causation (within the test's uncertainty): the button was assigned at random, which rules out hidden causes. This is an A/B test.
</details>

**Try it on your own data:** the [[scatter-best-fit]] tool plots two columns and gives r and the best line; the [[regression-workbench]] shows how a coefficient changes when you add a confounder as a second feature.

**New words:** *correlation coefficient*, *confounder*, *reverse causation*, *Simpson's paradox*, *randomised experiment*, *A/B test*.

<div class="keypoints">

- r runs from −1 to +1 and measures how tightly points follow a straight line, not how steep it is.
- r misses curves and is easily moved by outliers and groups, so always draw the scatter plot.
- Two columns can move together because of cause, reverse cause, a confounder, chance or selection.
- Only a randomised experiment (such as an A/B test) shows cause; correlations can still be useful for prediction.

</div>
