---
title: Correlation is not causation
summary: 'The correlation r measures how closely two columns follow a straight line. It can be fooled by one point, it misses curves, and it never proves that one thing causes the other. Set r yourself, then uncover a hidden cause.'
minutes: 20
updated: 2026-11-21
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
---

**Module 2 · about 20 minutes · read first: 1.6.** You'll be able to compute and read the correlation r, name its blind spots, and explain why a correlation in data does not mean one thing causes the other.

## 1. Why this matters

Exploring data, you'll find columns that move together. That is useful: a feature correlated with the label is a good candidate for a model. But it is easy to slide from "goes with" to "causes", and decisions built on that slide fail. A model can predict well from a correlation; it cannot tell you what will happen if you *change* something.

## 2. The correlation coefficient

Pearson's **correlation coefficient** `$r$` measures how closely points follow a straight line:

- `$r = +1$`: a perfect uphill line.
- `$r = 0$`: no straight-line pattern.
- `$r = -1$`: a perfect downhill line.

<!--fig:correlation-slider-->

Things to notice: at r = 0.3 you can barely see the pattern by eye; at 0.9 it is a clear band. And one far-away point (the button) can drag r a long way.

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
