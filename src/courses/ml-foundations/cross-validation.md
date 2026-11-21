---
title: Cross-validation
seoTitle: 'k-fold cross-validation explained, with a simulation'
summary: 'One train/test split gives one lucky or unlucky score. k-fold cross-validation uses every row for testing once and gives k scores, an average and a spread. Run the folds yourself and learn the variants for groups and time.'
minutes: 20
updated: 2026-11-21
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
---

**Module 7 · about 20 minutes · read first: 2.5, 7.1.** You'll be able to run k-fold cross-validation, report its result properly, and choose grouped or time-based folds when the data need them.

## 1. Why this matters

Almost every model choice (which model, which depth, which columns) is made by comparing validation scores. With one small validation set, the luck of which rows landed in it can be bigger than the difference you are measuring. Cross-validation makes those comparisons trustworthy, and it is a line in nearly every data-science job advert.

## 2. k-fold cross-validation

1. Shuffle the rows and cut them into `$k$` equal **folds** (usually 5 or 10).
2. For round `$i = 1, \dots, k$`: train on all folds except fold `$i$`, test on fold `$i$`.
3. Report the mean of the `$k$` scores and their standard deviation.

Every row is tested exactly once, by a model that never saw it, and every row helps train `$k - 1$` of the models.

<!--fig:kfold-->

Once the choice is made, retrain the chosen model on all the training data. A separate test set, kept out of the whole process, gives the final number (Lesson 2.5).

## 3. Choosing the folds

- **Stratified folds** keep the class balance the same in every fold; important when one class is rare (Lesson 4.5).
- **Grouped folds** keep all rows of one group (a patient, a customer, a store) in the same fold, so the model is never tested on someone it has already met.
- **Time-series folds** always train on the past and test on the period after it, moving forward through time.
- **Leave-one-out** (`$k = n$`): one row per fold. Uses the most data, but is slow and its estimate can be noisy; 5 or 10 folds are usually better.

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
