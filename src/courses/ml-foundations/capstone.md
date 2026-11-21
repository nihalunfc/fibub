---
title: 'Capstone: predict shop sales from a CSV'
seoTitle: 'ML project walkthrough: predict shop sales from a CSV'
summary: 'The whole course in one project: frame the question, clean and split the data, set a baseline, fit linear regression, a tree and a random forest, compare them fairly and explain the winner. Run it live and change the data.'
minutes: 35
updated: 2026-11-21
quiz:
  - q: Why fit "the average of the training days" as a model?
    choices: ['It is the baseline: any real model must beat it to be worth anything', 'It is usually the best model', 'To fill missing values']
    ans: 0
    why: A model with a low error can still be useless if guessing the average does nearly as well.
  - q: With only 20 training days, linear regression beat the random forest. Why?
    choices: ['Flexible models need more data; with little data a simple model overfits less', 'Forests cannot predict numbers', 'Linear regression always wins']
    ans: 0
    why: This is bias and variance (Lesson 7.1). With more data the forest's flexibility pays off and it wins.
  - q: The forest ranks "day of month" at 24 % importance with 20 rows, and 4 % with 300. What does that suggest?
    choices: ['With little data, importance can come from noise; check it with more data or permutation importance', 'Day of month drives sales', 'The forest is broken']
    ans: 0
    why: Day of month has no real effect in this data. Small samples let trees split on chance patterns.
---

**Module 11 · about 35 minutes · read first: 2.5, 3.5, 6.3, 7.2.** You'll be able to run a small prediction project from question to explanation, compare models fairly on held-out data, and report the result in plain words.

## 1. Why this matters

Real projects are rarely about one model. They are about asking the right question, keeping the test honest, beating a baseline and explaining the answer to someone who will act on it. This lesson strings together the whole course on one realistic job: a shop owner wants to plan staff and stock from a forecast of tomorrow's sales.

## 2. The project, step by step

1. **Frame it.** Predict one day's sales (a number, so regression) from what is known the day before: the weather forecast, whether it is a weekend, whether a promotion runs. Judge it by mean absolute error (MAE): "we miss by about 30 sales a day" is something an owner understands.
2. **Look and clean** (Lessons 2.2 and 2.4). Check each column's range, missing values and outliers. Plot sales against temperature: here, sales rise with warmth, then drop on very hot days.
3. **Split first** (Lesson 2.5). Hold back the last 100 days as a test set, and don't touch them until the end. For dates, keep the test set *after* the training days, as it will be in real use.
4. **Baseline.** Predict the average of the training days for every day.
5. **Fit three models:** linear regression (Lesson 3.4), a decision tree of depth 4 (Lesson 5.4), a random forest (Lesson 6.3). Tune settings with cross-validation on the training days only (Lesson 7.2).
6. **Compare on the test days,** once.
7. **Explain** with the linear weights and the forest's feature importance (Lesson 6.4), and say how sure you are.

<!--fig:capstone-->

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the only fair score is on data the model and you never used to make choices.

**Mean absolute error** over the `$m$` test days:

```math
\text{MAE} = \frac{1}{m} \sum_{i=1}^{m} \lvert y_i - \hat y_i \rvert
```

**The floor:** if daily sales vary randomly around their true level by a normal spread `$\sigma$`, even a perfect model misses by

```math
\mathbb{E}\lvert \varepsilon \rvert = \sigma \sqrt{2/\pi} \approx 0.80\,\sigma
```

so with `$\sigma = 30$`, no model can average much under 24.

**Analogy:** a cooking contest judged on a dish none of the cooks has tasted. Practising on the judges' plate would win the contest and teach nothing.

**Try it:** a model's errors on 4 test days are +10, −30, +20, −20. MAE? (`$(10 + 30 + 20 + 20)/4 = 20$`.)
</details>

## 3. Worked example

The simulation at its starting settings: 150 training days, daily noise ±30, 100 test days.

| model | test MAE |
|---|---|
| Average of training days | 83.8 |
| Linear regression | 34.2 |
| Decision tree (depth 4) | 34.7 |
| Random forest (40 trees) | **28.3** |

Every model beats the baseline easily. The forest wins, close to the floor of about 24, because it can bend where the data bends: the drop above 26 °C, and the extra lift when a promotion falls on a weekend. Linear regression is not far behind and is the easiest to explain: each degree adds about 6 sales, a weekend about 141, a promotion about 84.

**The report:** "Tomorrow's sales can be forecast to within about 28 a day, on days the model never saw. Weekends and temperature matter most; a promotion adds about 80 sales; the day of the month does not matter. Recommended: the forest for planning, with the linear model's weights as the explanation."

Now slide the training days down to 20. The forest's error rises to about 51 and the single tree's to about 87, worse than the baseline, while linear regression holds at about 36. With little data, simple wins.

## 4. Practice

1. In the simulation, raise the noise to 80. What happens to every model's error, and to the gap between them?
2. With 20 training days, why might "day of month" look important to the forest?
3. Why should the test days come after the training days for a sales forecast?

<details>
<summary>Answers</summary>

1. All errors rise, to between about 63 and 70 for the three models (the floor is now about 64), and they bunch together: noise hides the patterns the flexible models could use.
2. With few rows, chance patterns look real, and trees split on them. More data, or permutation importance on held-out rows, shows it is noise.
3. In real use the model always predicts the future from the past. Mixing dates lets it learn from days after the ones it predicts: a form of leakage (Lesson 7.4).
</details>

**Try it on your own data:** load your own CSV into the [[csv-profiler]] for step 2, the [[regression-workbench]] to fit a linear model to a number column, and the [[small-model-trainer]] when the answer is a category.

**New words:** *baseline*, *mean absolute error*, *held-out test set*, *time-based split*, *model comparison*, *irreducible error*.
