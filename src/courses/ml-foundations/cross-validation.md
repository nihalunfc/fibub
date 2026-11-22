---
title: Cross-validation
seoTitle: 'k-fold cross-validation explained, with a simulation'
summary: 'One train/test split gives one lucky or unlucky score. k-fold cross-validation uses every row for testing once and gives k scores, an average and a spread. Run the folds yourself and learn the variants for groups and time.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'In 5-fold cross-validation, each row is used for testing:'
    choices: ['Once', 'Five times', 'Never']
    ans: 0
    why: The rows are cut into 5 folds; each fold is the test set in exactly one of the 5 rounds.
  - q: 'Why report the spread of the k scores, not just the mean?'
    choices: ['It shows how much the score depends on which rows were tested', 'It is required by law', 'It makes the model better']
    ans: 0
    why: Two models whose means differ by less than the spread may not really differ at all.
  - q: Your data are daily sales over three years. Which validation is right?
    choices: ['Shuffled 10-fold', 'Train on earlier periods, test on later ones (time-series split)', 'Leave-one-out']
    ans: 1
    why: Shuffling lets the model learn from the future to predict the past, which flatters it (Lesson 7.4).
sources:
  - 'James, Witten, Hastie, Tibshirani and Taylor (2023), An Introduction to Statistical Learning with Applications in Python, Springer, Section 5.1 (cross-validation) https://www.statlearning.com/'
  - 'scikit-learn user guide, Cross-validation: evaluating estimator performance https://scikit-learn.org/stable/modules/cross_validation.html'
  - 'Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, Springer, Section 7.10'
---

**Module 7 · about 20 minutes · read first: 2.5, 7.1.** You'll be able to run k-fold cross-validation, report its result properly, and choose grouped or time-based folds when the data need them.

<div class="bigidea">Instead of trusting one test, take turns: every slice of the data gets to be the test once, and you judge the model by all the scores together.</div>

## 1. Why this matters

Almost every model choice (which model, which depth, which columns) is made by comparing validation scores. With one small validation set, the luck of which rows landed in it can be bigger than the difference you are trying to measure. It's like judging a student on a single ten-question quiz: one bad day and the verdict is wrong. Cross-validation makes those comparisons trustworthy, and it appears in nearly every data-science job advert.

## 2. k-fold cross-validation

A **fold** is one slice of your rows. "k" is just the number of slices.

1. Shuffle the rows and cut them into `$k$` equal folds (usually 5 or 10).
2. For round `$i = 1, \dots, k$`: train on all folds except fold `$i$`, then test on fold `$i$`.
3. Report the average of the `$k$` scores and their standard deviation (how spread out they are).

Every row is tested exactly once, by a model that never saw it. And every row helps train `$k - 1$` of the models.

### Watch it happen

<div class="steps" data-fig="cross-validation-folds">
<div class="step"><p><b>Round 1.</b> Cut the data into 5 folds. Train on folds 2 to 5, test on fold 1. Accuracy: 82 %.</p></div>
<div class="step"><p><b>Round 2.</b> Now fold 2 sits out. A fresh model trains on folds 1, 3, 4 and 5 and scores 86 % on fold 2.</p></div>
<div class="step"><p><b>Round 3.</b> Fold 3 is the test: 80 %. Notice how much one fold's score can move. A single split could have shown any of these.</p></div>
<div class="step"><p><b>Round 4.</b> Fold 4 is the test: 84 %.</p></div>
<div class="step"><p><b>Round 5.</b> Fold 5 is the test: 83 %. Every row has now been tested exactly once.</p></div>
<div class="step"><p><b>Sum up.</b> Mean = (82 + 86 + 80 + 84 + 83) ÷ 5 = 83 %. Spread (sd) ≈ 2.2 points. Report "83 % ± 2.2", not just 83.</p></div>
</div>

<!--fig:kfold-->

Once the choice is made, retrain the chosen model on all the training data. A separate test set, kept out of the whole process, gives the final number (Lesson 2.5).

<div class="problem" data-problem="cross-validation-sd"></div>

<div class="meaning">

<dl>
<dt>k</dt><dd>how many slices (folds) the data are cut into, and so how many models are trained</dd>
<dt>s₁ … sₖ</dt><dd>the score of each round, on the fold that model never saw</dd>
<dt>s̄ (mean)</dt><dd>the typical score: your best guess of how the model does on new data</dd>
<dt>sd</dt><dd>how much the score moves depending on which rows were tested</dd>
<dt>Physical meaning</dt><dd>It's a fair exam. A teacher splits the question bank into five quizzes so every question is asked once. A student who scores 83 ± 2 really knows the subject; a rival at 84 ± 3 is not clearly better.</dd>
</dl>

</div>

Try it: pick the line, then degree 9, and slide the number of examples. Watch training and test error meet or stay apart.

<figure class="fig" data-fig="@ai-learning-curves"><figcaption>A line is too simple (both errors stay high: more data will not help). A flexible model has a big gap that shrinks as data grows (more data helps). No model gets below the noise floor.</figcaption></figure>

## 3. Choosing the folds

Plain shuffled folds assume every row is a separate, independent case. When that isn't true, the folds must follow the data:

- **Stratified folds** keep the class balance the same in every fold. Important when one class is rare, like fraud (Lesson 4.5).
- **Grouped folds** keep all rows of one group (a patient, a customer, a store) in the same fold, so the model is never tested on someone it has already met.
- **Time-series folds** always train on the past and test on the period after it, moving forward through time, like a weather forecaster who can only use yesterday to predict tomorrow.
- **Leave-one-out** (`$k = n$`, one row per fold): uses the most data, but is slow and its estimate can be noisy. 5 or 10 folds are usually better.

<div class="problem" data-problem="cross-validation-rows"></div>

<div class="myth">

**"Cross-validation replaces the test set."** Cross-validation is for *choosing*: comparing models and settings. Once you have picked the winner by its cross-validated score, that score is a little flattering, because you picked the best of several. The final, honest number still comes from a test set that was kept out of the whole process.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** estimate how a model trained on data like yours will do on new data, using every row once as new data.

**The estimate:** with fold scores `$s_1, \dots, s_k$`,

```math
\bar{s} = \frac{1}{k}\sum_{i=1}^{k} s_i, \qquad \text{sd} = \sqrt{\frac{1}{k-1}\sum_{i=1}^{k}(s_i - \bar{s})^2}
```

**Bigger `$k$`:** each model trains on more data (`$(k-1)/k$` of it), so the estimate is less pessimistic, but the models overlap more and it takes `$k$` times the training. The folds share training rows, so the scores are not independent and the sd understates the true uncertainty a little.

**Analogy:** a teacher who splits the question bank into five quizzes and makes sure every question is in exactly one quiz, instead of judging a student on a single quiz.

**Try it:** fold accuracies 0.82, 0.86, 0.80, 0.84, 0.83. Mean and sd? (Mean 0.83. Deviations −0.01, 0.03, −0.03, 0.01, 0: squares add to 0.002; sd = √(0.002/4) ≈ 0.022.)
</details>

Try it: set a 3-point gap, then slide the number of questions from 20 to 5000 and press Run 100 tests.

<figure class="fig" data-fig="@ai-bench-noise"><figcaption>A benchmark score is a measurement with error. With few questions a small lead is often just luck; with thousands the better model reliably ranks first. Always ask how many questions.</figcaption></figure>

## 4. Worked example

*Made-up numbers.* Two models for predicting late deliveries, 5-fold cross-validation, accuracy in %:

| fold | 1 | 2 | 3 | 4 | 5 | mean | sd |
|---|---|---|---|---|---|---|---|
| logistic regression | 81 | 84 | 79 | 83 | 82 | 81.8 | 1.9 |
| random forest | 85 | 86 | 83 | 87 | 85 | 85.2 | 1.5 |

The forest wins in every fold, by 3.4 points on average, about twice the spread. A single split could have shown fold 3's forest (83) against fold 2's logistic regression (84) and pointed the wrong way.

## 5. Practice

1. In the simulation, reshuffle a few times. Which moves more: single fold scores or the mean?
2. With 1,000 rows and 10 folds, how many rows does each model train on?
3. Hospital data has several visits per patient. How should the folds be made?

<details>
<summary>Answers</summary>

1. Single fold scores jump around; the mean moves much less.
2. 900.
3. Grouped by patient, so all of a patient's visits are in the same fold.
</details>

**Try it on your own data:** the [[small-model-trainer]] reports test accuracy on a held-out part of your CSV; change its random seed a few times and watch how much one split's score moves.

**New words:** *cross-validation*, *fold*, *k-fold*, *stratified*, *grouped folds*, *time-series split*, *leave-one-out*.

<div class="keypoints">

- k-fold cross-validation cuts the data into k folds; each fold is the test set once, so every row is tested by a model that never saw it.
- Report the mean and the spread of the k scores; differences smaller than the spread may be luck.
- Use stratified folds for rare classes, grouped folds when rows come in groups, and time-ordered folds for data in time.
- Cross-validation is for choosing; the final score still comes from an untouched test set.

</div>
