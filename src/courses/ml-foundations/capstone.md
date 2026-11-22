---
title: 'Capstone: predict shop sales from a CSV'
seoTitle: 'ML project walkthrough: predict shop sales from a CSV'
summary: 'The whole course in one project: frame the question, clean and split the data, set a baseline, fit linear regression, a tree and a random forest, compare them fairly and explain the winner. Run it live and change the data.'
minutes: 35
updated: 2026-11-22
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
sources:
  - 'James, G., Witten, D., Hastie, T., Tibshirani, R. and Taylor, J. (2023), An Introduction to Statistical Learning with Applications in Python, Springer, chapters 2, 5 and 8 https://www.statlearning.com/'
  - 'Hyndman, R. J. and Athanasopoulos, G. (2021), Forecasting: Principles and Practice, 3rd edition, chapter 5 (evaluating forecast accuracy) https://otexts.com/fpp3/'
  - 'scikit-learn user guide: cross-validation, evaluating estimator performance https://scikit-learn.org/stable/modules/cross_validation.html'
---

**Module 11 · about 35 minutes · read first: 2.5, 3.5, 6.3, 7.2.** You'll be able to run a small prediction project from question to explanation, compare models fairly on held-out data, and report the result in plain words.

<div class="bigidea">A good project is not the fanciest model: it is a clear question, an honest test on days the model never saw, a baseline to beat, and an answer someone can act on.</div>

## 1. Why this matters

Real projects are rarely about one model. They are about asking the right question, keeping the test honest, beating a simple guess and explaining the answer to someone who will act on it.

This lesson puts the whole course together on one realistic job. A shop owner wants to plan staff and stock from a forecast of tomorrow's sales.

## 2. The project, step by step

1. **Frame it.** Predict one day's sales (a number, so regression) from what is known the day before: the weather forecast, whether it is a weekend, whether a promotion runs. Judge it by **mean absolute error** (MAE), the average miss: "we miss by about 30 sales a day" is something an owner understands.
2. **Look and clean** (Lessons 2.2 and 2.4). Check each column's range, missing values and outliers. Plot sales against temperature: here, sales rise with warmth, then drop on very hot days.
3. **Split first** (Lesson 2.5). Hold back the last 100 days as a test set, and don't touch them until the end. For dates, keep the test days *after* the training days, as they will be in real use.
4. **Baseline.** Predict the average of the training days for every day. This is the "do nothing clever" guess every model must beat.
5. **Fit three models:** linear regression (Lesson 3.4), a decision tree of depth 4 (Lesson 5.4), a random forest (Lesson 6.3). Tune settings with cross-validation on the training days only (Lesson 7.2).
6. **Compare on the test days,** once.
7. **Explain** with the linear weights and the forest's feature importance (Lesson 6.4), and say how sure you are.

<!--fig:capstone-->

**Everyday picture:** a driving test. You practise on any roads you like, but the examiner picks a route you have never driven. Passing on your practice street proves nothing.

Watch the scoring step on five test days, with a forecast and the baseline side by side:

<div class="steps">
<div class="step"><p><b>The test days.</b> Actual sales on 5 days the model never saw: <b>320, 410, 290, 450, 380</b>. The training-day average, our baseline guess, is 340 every day.</p></div>
<div class="step"><p><b>The forecast.</b> The model predicted <b>300, 430, 300, 420, 360</b>.</p></div>
<div class="step"><p><b>The misses.</b> Actual minus forecast, sign dropped: <b>20, 20, 10, 30, 20</b>. Total 100, so the model's MAE = 100 ÷ 5 = <b>20</b> sales a day.</p></div>
<div class="step"><p><b>The baseline's misses.</b> |320 − 340| = 20, then 70, 50, 110, 40. Total 290, so the baseline's MAE = <b>58</b>.</p></div>
<div class="step"><p><b>The verdict.</b> The model cuts the error from 58 to 20: (58 − 20) ÷ 58 = <b>66 %</b> less. Worth using, and easy to explain to the owner.</p></div>
</div>

<div class="problem" data-problem="capstone-mae"></div>

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

<div class="meaning">

<dl>
<dt>y<sub>i</sub></dt><dd>what really happened on test day i (actual sales)</dd>
<dt>ŷ<sub>i</sub></dt><dd>what the model forecast for that day ("y-hat")</dd>
<dt>|y<sub>i</sub> − ŷ<sub>i</sub>|</dt><dd>the miss on that day, ignoring whether it was too high or too low</dd>
<dt>m</dt><dd>how many test days there are</dd>
<dt>σ√(2/π) ≈ 0.8σ</dt><dd>the floor: the smallest average miss any model can reach when daily sales wobble randomly by σ</dd>
<dt>Physical meaning</dt><dd>MAE is the number of loaves you will bake too many or too few on a typical day. It turns model quality into stock and staff: an MAE of 28 means planning with a buffer of about 30 sales, and no model can push it below the random wobble of the days themselves.</dd>
</dl>

</div>

Try it: set a 3-point gap, then slide the number of questions from 20 to 5000 and press Run 100 tests.

<figure class="fig" data-fig="@ai-bench-noise"><figcaption>A benchmark score is a measurement with error. With few questions a small lead is often just luck; with thousands the better model reliably ranks first. Always ask how many questions.</figcaption></figure>

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

<div class="problem" data-problem="capstone-skill"></div>

Now slide the training days down to 20. The forest's error rises to about 51 and the single tree's to about 87, worse than the baseline, while linear regression holds at about 36. With little data, simple wins.

<div class="myth">

**"The model with the lowest error on the training days is the best."** Training error rewards memorising. A deep tree can score almost 0 on the days it learned from and still miss badly tomorrow. Only the error on days held back from every choice you made tells you how the model will do in real use.

</div>

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

<div class="keypoints">

- Frame the question first: what to predict, from what is known in advance, judged by an error the owner understands (MAE).
- Split before you look closely, and for dates keep the test days after the training days.
- Always beat a baseline, such as the training average; a low error means little until you compare.
- Compare models once, on the held-out days; with little data, the simple model often wins.
- Report in plain words: how far off, what drives the answer, and what to do with it.

</div>
