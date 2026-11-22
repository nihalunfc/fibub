---
title: 'Data leakage: the most common mistake'
seoTitle: 'Data leakage in machine learning, with examples'
summary: 'Leakage is when a model sees during training something it will not have when used: the answer in disguise, the future, or the test rows. It makes scores too good to be true. Play spot-the-leak and learn the checklist.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'A model scores 99.8 % on a hard problem where experts manage 80 %. First suspicion?'
    choices: ['A breakthrough', 'Leakage: some column gives the answer away', 'Too little data']
    ans: 1
    why: Scores that are too good to be true usually are. Look for a column that is recorded after, or because of, the outcome.
  - q: Scaling the whole dataset before splitting into train and test is
    choices: ['Fine', 'A (small) leak: the test rows influenced the mean and spread used for training', 'Required']
    ans: 1
    why: Fit every preprocessing step on training rows only, then apply it to the test rows.
  - q: 'The safest way to avoid preprocessing leaks in cross-validation is to:'
    choices: ['Put the preprocessing inside a pipeline that is refitted in every fold', 'Preprocess everything once at the start', 'Skip cross-validation']
    ans: 0
    why: A pipeline (scaler, imputer, model) is fitted on each fold's training part only, so nothing leaks from the fold being tested.
sources:
  - 'Kaufman, Rosset, Perlich and Stitelman (2012), Leakage in data mining: formulation, detection, and avoidance, ACM Transactions on Knowledge Discovery from Data 6(4), 15 https://doi.org/10.1145/2382577.2382579'
  - 'Kapoor and Narayanan (2023), Leakage and the reproducibility crisis in machine-learning-based science, Patterns 4(9), 100804 https://doi.org/10.1016/j.patter.2023.100804'
  - 'scikit-learn user guide, Common pitfalls and recommended practices (data leakage) https://scikit-learn.org/stable/common_pitfalls.html'
---

**Module 7 · about 25 minutes · read first: 2.5, 7.2.** You'll be able to recognise the four common kinds of leakage, check a project for them, and build a leak-proof pipeline.

<div class="bigidea">If a model learns from anything it won't have on the day it is used, its test score is a lie, and the only defence is to ask when each piece of information becomes known.</div>

## 1. Why this matters

Leakage is the most common reason a model that looked brilliant in testing fails in real use. It has sunk competition winners, published medical models and business launches. It is easy to cause. It is invisible in the score, which only looks *better*. And it is caught only by thinking about **when** each piece of information becomes available.

It's like a student who saw the exam paper while revising. Great marks, no learning, and a nasty surprise at the next exam.

## 2. The four common kinds

1. **Target leakage:** a column that is caused by the outcome, or recorded after it. "Number of collection calls" predicts loan default perfectly, because collection calls only happen *after* a default.
2. **Time leakage:** training on the future to predict the past. For example, shuffling three years of daily sales into random folds, so the model learns from December to "predict" the March before it.
3. **Preprocessing leakage:** fitting a scaler, an imputer (a filler for missing values), a feature selector or a target encoder on all the data before splitting. The test rows then shape what the model learns.
4. **Duplicate or group leakage:** the same customer, patient, photo or near-identical row on both sides of the split. The test then checks memory, not learning.

<!--fig:leakage-game-->

<div class="problem" data-problem="data-leakage-duplicates"></div>

### Watch it happen: a small preprocessing leak

Ten days of website visits (in hundreds). Two of them are the test days.

<div class="steps" data-fig="data-leakage-scaler">
<div class="step"><p><b>The data.</b> Training days: 2, 4, 4, 6, 8, 6, 4, 6. Test days: 20 and 10, a busy sale weekend the model must never see.</p></div>
<div class="step"><p><b>The leak.</b> Someone scales before splitting. The mean of all ten days is 70 ÷ 10 = 7. The two test days have dragged "normal" up from 5 to 7, and the model learns with that number.</p></div>
<div class="step"><p><b>Split first.</b> Put the test days aside. The training mean is 40 ÷ 8 = 5. This is the only mean the model is allowed to know.</p></div>
<div class="step"><p><b>Apply, don't refit.</b> Scale the test days with the training mean: day 20 is 15 above normal. On the day the model is used, it will see each new day this way.</p></div>
</div>

<div class="problem" data-problem="data-leakage-scaler"></div>

## 3. The checklist

- For every column, ask: **would I know this at the moment of prediction?** If not, remove it.
- Split **first**: by time if the data are in time, by group if rows come in groups. Then do everything else.
- Put all preprocessing in a **pipeline** fitted on training rows only. scikit-learn's `Pipeline` does this inside cross-validation, refitting each step in every fold.
- Be suspicious of any single column that is much more important than the rest (Lesson 6.4).
- Be suspicious of any score that is too good for the problem. Then go and look.

<div class="meaning">

<dl>
<dt>t</dt><dd>the moment the model makes its prediction in real use</dd>
<dt>xₜ</dt><dd>the inputs that are truly known at that moment</dd>
<dt>x_j = g(y, after t)</dt><dd>a column built from the answer itself, or from things that happen later: a leak</dd>
<dt>μ (mu), σ (sigma)</dt><dd>the mean and spread a scaler uses; they must come from training rows only</dd>
<dt>Physical meaning</dt><dd>A model is used in the real world on a real day, knowing only what is known that morning. Any column or step that peeks past that morning makes testing a rehearsal with the answers written on the wall.</dd>
</dl>

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the validation set must be treated exactly like future data. Anything computed from it, or from the future, must not reach training.

**In symbols:** a model will be used at time `$t$` with inputs `$\mathbf{x}_t$` known at `$t$`. A training column `$x_j$` leaks if it depends on `$y$` or on events after `$t$`:

```math
x_j = g(y, \text{information after } t) \;\Rightarrow\; \text{leak}
```

**Why preprocessing leaks:** standardising with the mean `$\mu$` of all `$n$` rows, including the `$n_{\text{test}}$` test rows, gives a training input `$(x - \mu)/\sigma$` that carries a little information about the test rows. It is usually small for scaling, and can be large for steps that use the target, such as selecting the columns most correlated with `$y$`.

**Analogy:** a student who sees the exam paper while revising. Great marks, no learning.

**Try it:** predicting whether a customer will cancel next month. Which column leaks: "plan type", "support calls in the last 3 months", or "date of cancellation request"? (The cancellation date: it exists only for customers who already cancelled.)
</details>

<div class="myth">

**"A higher score means a better model."** Not if the score was measured unfairly. When fixing a leak, the score goes **down**, and that is good news: the new number is the one you will actually get in use. A team that celebrates 0.97 and ships it learns the truth from angry users instead.

</div>

## 4. Worked example

*A pattern seen in real projects, made-up numbers.* A hospital model predicts pneumonia from chest X-rays with an AUC of 0.97 in testing, but 0.71 at a different hospital.

The team checks:

- **Split by patient?** No: 30 % of patients had images on both sides. Re-splitting by patient: AUC 0.91.
- **What does it look at?** Heat maps show it leans on a text marker printed in the corner of portable X-rays, used for the sickest, bedridden patients: a hint about the answer, not the disease. Cropping the corners: AUC 0.86.

The honest model is still useful, but at 0.86, not 0.97. Both leaks were invisible in the score alone.

## 5. Practice

1. In the game, which story had a leak caused by the order of events in time?
2. Why is target encoding (replacing a category by the average target for that category) risky?
3. A churn model's top feature is "account closed flag". What do you do?

<details>
<summary>Answers</summary>

1. The hospital readmission story (appointments booked after discharge) and the sales story (random shuffling across years).
2. The average includes the row's own target. Compute it on training folds only, and for each row leave the row itself out.
3. Drop it: the account is closed because the customer churned. It is the answer in disguise.
</details>

**Try it on your own data:** the [[train-test-splitter]] splits your CSV into training and test files before you do anything else, the first rule of the checklist.

**New words:** *data leakage*, *target leakage*, *time leakage*, *preprocessing leakage*, *pipeline*, *group split*.

<div class="keypoints">

- Leakage: the model learns from information it will not have when it is used, so its test score is too good.
- Four common kinds: target leakage, time leakage, preprocessing leakage, and duplicates or groups split across train and test.
- For every column ask "would I know this at prediction time?"; split first, then fit every preprocessing step on training rows only, inside a pipeline.
- A score that is too good for the problem is a warning, not a win.

</div>
