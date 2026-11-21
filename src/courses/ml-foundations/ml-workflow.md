---
title: The machine learning workflow
summary: 'Real projects follow a loop: ask a sharp question, collect and clean data, split it, train, evaluate against a simple baseline, use the model, and keep watching it. Tap through each step.'
minutes: 20
updated: 2026-11-21
quiz:
  - q: Why compare a model with a simple baseline, such as "always predict the average"?
    choices: ['To make the model look better', 'To know whether the model adds anything over a guess that needs no learning', 'Because baselines are more accurate']
    ans: 1
    why: A model that is 90 % accurate sounds good until you learn that always guessing "no" is 92 % accurate. The baseline is the bar to beat.
  - q: Where does most of the time in a real project usually go?
    choices: ['Choosing the fanciest model', 'Collecting, exploring and cleaning the data', 'Writing the final report']
    ans: 1
    why: Practitioners report that most of their time goes on getting and preparing data. Good data beats a clever model on poor data.
  - q: 'A model worked well last year but its errors are slowly growing. What is the likely cause?'
    choices: ['The model has worn out', 'The world changed, so new data no longer looks like the training data (drift)', 'The computer got slower']
    ans: 1
    why: Customer habits, prices and seasons change. Monitoring catches this drift, and retraining on recent data fixes it.
---

**Module 1 · about 20 minutes · read first: 1.1, 1.2.** You'll be able to describe the eight steps of a machine learning project, say what goes wrong at each, and plan a small project on paper.

## 1. Why this matters

Model-building is one step of eight. Most projects that fail do so before training (a vague question, the wrong data) or after it (no honest test, no one checking it later). Knowing the whole loop also tells you where each later lesson fits.

## 2. The loop

<!--fig:workflow-->

1. **Question.** Make it sharp and measurable: what exactly is predicted, for whom, when, and what counts as success? "Predict which subscribers will cancel in the next 30 days, so the support team can call the top 200 each week" is a project. "Use AI on customer data" is not.
2. **Collect data.** You need examples where the answer is already known, gathered the way the model will see them in use. If the model will run on Monday morning, it may only use what is known by Monday morning.
3. **Explore and clean.** Charts, summaries, missing values, odd codes, duplicates, outliers (Module 2). This is where most of the time goes.
4. **Split.** Lock away a test set before training (Lesson 2.5).
5. **Train.** Start simple. A straight line or a small tree first, a forest or a network only if it clearly helps.
6. **Evaluate.** Score on held-out data with a measure that fits the question (Lessons 3.5, 4.5, 4.6, 7.2), and compare with a **baseline**.
7. **Use.** A model that sits in a notebook does nothing. It might feed a dashboard, a weekly list or a button in an app.
8. **Monitor.** The world changes, the data **drifts**, and accuracy slips. Check it over time, retrain on fresh data, and sometimes go back to step 1.

## 3. Baselines: the bar to beat

A **baseline** is the answer you'd give with no model at all:

- For regression: always predict the mean (or the median) of the training labels.
- For classification: always predict the most common class.
- For time series: predict that tomorrow equals today, or equals the same day last week.

If your model can't beat the baseline clearly on test data, it isn't worth using, however clever it is. Baselines also catch a common trap: when 95 % of cases are "no", a model that is 95 % accurate may have learned nothing at all (Lesson 4.5).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a model is judged by how much it improves on the simplest guess, measured on data it never saw.

**Equation:** one common score is the improvement in error over the baseline,

```math
\text{skill} = 1 - \frac{\text{error of model}}{\text{error of baseline}}
```

Skill 0 means no better than the baseline, 1 means perfect, and a negative skill means worse than the baseline. With squared error and the mean as baseline, this is exactly the `$R^2$` of Lesson 3.5.

**Analogy:** a weather forecaster is only useful if she beats "tomorrow will be like today".

**Try it:** a model's average error is 12 minutes; always guessing the average delivery time gives 20 minutes. Skill? (`$1 - 12/20 = 0.4$`: it removes 40 % of the baseline's error.)
</details>

## 4. Worked example

*Made-up numbers.* A gym wants to keep members from leaving.

1. **Question:** each Monday, rank active members by the chance they cancel in the next 30 days, so staff can phone the top 100. Success: more of those 100 actually would have cancelled than with a random 100.
2. **Data:** 18 months of members: age, months as a member, visits in the last 4 weeks, visits in the 4 weeks before, plan type, whether they called with a complaint, and the label: cancelled within the following 30 days.
3. **Clean:** 3 % have no age (filled with the median, with a "missing" flag). Visits of 300 in a month turn out to be a card-reader fault (capped).
4. **Split:** train on the first 15 months, test on the last 3. With time data you test on the future, never on shuffled rows (Lesson 7.4).
5. **Train:** logistic regression first (Module 4), then a random forest (Module 6).
6. **Evaluate:** baseline (call 100 random members) catches 6 people who would leave. Logistic regression catches 31, the forest 34. The forest wins, but the simpler model is easier to explain to the staff, so they start with it.
7. **Use:** a list emailed each Monday.
8. **Monitor:** each month, check how many of the top 100 really cancelled. In January, after the New Year rush of sign-ups, it drops, so the model is retrained.

## 5. Practice

1. Turn "use data to help our café" into a sharp question.
2. 80 % of loan applicants in a dataset repay. What accuracy does the baseline get?
3. Why should a model of next month's sales not be tested on shuffled rows from the whole year?

<details>
<summary>Answers</summary>

1. For example: "Each evening, predict tomorrow's sandwich sales per type, so we make fewer leftovers. Success: less waste than our current fixed order without running out more often."
2. 80 %, by always predicting "repays". A useful model must beat that.
3. Shuffling lets the model learn from days after the ones it is tested on, which it could never do in real use. Train on the past, test on the future.
</details>

**New words:** *baseline*, *drift*, *skill score*, *monitoring*.

**Next, Module 2:** looking hard at data before you model it.
