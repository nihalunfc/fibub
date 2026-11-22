---
title: Train, validation and test sets
summary: 'A model must be judged on data it never saw while learning. Split the data into training, validation and test sets, fit a line to the training points, and watch how the honest test score changes from split to split.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: Why is the error on the training data not a fair measure of a model?
    choices: ['Training data is always wrong', 'The model was fitted to those exact rows, so it looks better on them than on new data', 'It is always zero']
    ans: 1
    why: A model can memorise its training rows. Only rows it never saw show how it will do on new cases.
  - q: What is the validation set for?
    choices: ['Final scoring, once, at the very end', 'Choosing between models and settings during development', 'Training the model']
    ans: 1
    why: You compare models and tune settings on the validation set, and keep the test set untouched for one final, honest score.
  - q: 'You have 2 years of daily sales and want to predict next month. How should you split?'
    choices: ['Shuffle all days and take 20 % at random as the test set', 'Train on the earlier days and test on the most recent ones', 'Test on the first month']
    ans: 1
    why: In use the model always predicts the future from the past, so the test must do the same. Shuffling lets it peek at the future.
sources:
  - 'James, G., Witten, D., Hastie, T., Tibshirani, R. and Taylor, J. (2023), An Introduction to Statistical Learning with Applications in Python, Springer, Chapter 5 (resampling methods) https://www.statlearning.com/'
  - 'Hastie, T., Tibshirani, R. and Friedman, J. (2009), The Elements of Statistical Learning, 2nd ed., Springer, Section 7.2 (training, validation and test) https://hastie.su.domains/ElemStatLearn/'
  - 'scikit-learn API: train_test_split https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html'
---

**Module 2 · about 20 minutes · read first: 1.7.** You'll be able to split a dataset into training, validation and test sets, explain why each exists, and choose a split that fits the data (random, grouped or by time).

<div class="bigidea">Judge a model only on data it never saw while learning: train on one part, tune on a second, and score once on a third that stays locked away.</div>

## 1. Why this matters

Imagine a student who memorises last year's exam answers. On last year's paper they score 100 %; on this year's they may fail. A model can do the same: fit its training rows perfectly and be useless on new ones. The only honest check is to hide some data from the model while it learns, like a teacher keeping the real exam paper locked in a drawer, and then score it on that hidden data.

## 2. Three sets

| Set | Typical share | Used for | Touched |
|---|---|---|---|
| **Training** | 60 to 80 % | Fitting the parameters | Constantly |
| **Validation** | 10 to 20 % | Choosing the model type and its settings | Many times |
| **Test** | 10 to 20 % | One final, unbiased score | Once, at the end |

Why both validation and test? Every time you look at a score and change something because of it, a little information about that data leaks into your choices. After fifty tries on the validation set, its score is flattering. The test set, looked at once, isn't.

With small datasets, setting aside a fixed validation set wastes rows. **Cross-validation** (Lesson 7.2) reuses each row for both training and validation in turns.

<div class="steps" data-fig="train-test-split-steps">
<div class="step"><b>Ten rows.</b> Here are ten flats, numbered in the order they were collected.</div>
<div class="step"><b>Shuffle.</b> Mix the order at random, so that no set ends up with only the early rows or only the late ones.</div>
<div class="step"><b>Lock away the test set.</b> Two rows go in the drawer. Nobody looks at them until the very end.</div>
<div class="step"><b>Set aside validation.</b> Two more rows are kept for comparing models and settings.</div>
<div class="step"><b>Train on the rest.</b> The model learns from six rows, is tuned on the two validation rows, and is scored once on the two test rows. (Real projects use thousands of rows, but the jobs are the same.)</div>
</div>

<div class="problem" data-problem="train-test-split-rows"></div>

## 3. Try it

<!--fig:split-shuffler-->

Things to notice:

- The **training error** is usually lower than the **test error**. The line was chosen to suit the training points.
- Each shuffle gives a different test error. With 10 test rows, a couple of unusual flats can swing the score. Bigger test sets are steadier, but leave less for training: a trade-off.

## 4. Choosing how to split

- **Random split:** fine when rows are independent (separate customers, separate homes).
- **Stratified split:** for classification with a rare class, keep the same share of each class in every set. Otherwise a test set of 50 rows might contain none of the 2 % fraud cases.
- **Grouped split:** when rows come in groups (several visits per patient, several photos per person), keep each group entirely in one set. Otherwise the model can recognise the patient instead of learning the disease.
- **Time split:** for anything over time, train on the past and test on the future. Never shuffle.

<div class="myth">

**"I only peeked at the test set a few times, so its score is still fair."** Every peek that changes a decision leaks a little of the test set into the model. Tune against it fifty times and you have, in effect, trained on it: the score flatters you. Use the validation set (or cross-validation) for all choices, and look at the test set once.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the test error estimates the **generalisation error**, the average error on new data from the same source. The training error underestimates it.

**Equations:** with a model `$f$` fitted on the training set,

```math
\text{train error} = \frac{1}{n_{\text{train}}} \sum_{i \in \text{train}} L\big(y_i, f(\mathbf{x}_i)\big)
```

```math
\text{test error} = \frac{1}{n_{\text{test}}} \sum_{i \in \text{test}} L\big(y_i, f(\mathbf{x}_i)\big)
```

where `$L$` is the loss for one row (for example the squared error `$(y - \hat y)^2$`). The test error is itself an average of random values, so it has a standard error (Lesson 1.6) that shrinks like `$1/\sqrt{n_{\text{test}}}$`: four times the test rows halve its wobble.

**Analogy:** a driving test on roads the learner has never driven. Practising on the test route would make a pass meaningless.

**Try it:** a classifier gets 46 of 50 test rows right: 92 %. Roughly how uncertain is that? (The standard error of a proportion is `$\sqrt{p(1-p)/n} = \sqrt{0.92 \times 0.08 / 50} \approx 0.038$`, so about ±4 points, and a 95 % range of roughly 84 % to 100 %.)
</details>

<div class="meaning">

<dl>
<dt>Training set</dt><dd>The rows the model learns its parameters from.</dd>
<dt>Validation set</dt><dd>Rows used to compare models and settings, many times.</dd>
<dt>Test set</dt><dd>Rows kept locked away for one final score.</dd>
<dt>Generalisation error</dt><dd>How wrong the model will be, on average, on new data it has never seen. The test error estimates it.</dd>
<dt>√(p(1 − p)/n)</dt><dd>How much a test accuracy p, measured on n rows, could wobble just by luck of which rows were picked.</dd>
<dt>Physical meaning</dt><dd>A driving test on roads the learner has never driven. Practising on the test route would make a pass meaningless; the score only means something because the roads were new.</dd>
</dl>

</div>

<div class="problem" data-problem="train-test-split-se"></div>

## 5. Worked example

*Made-up numbers.* A bank has 10,000 past loans, 300 of which were not repaid (3 %).

1. Hold out a **stratified** 20 % test set: 2,000 loans with 60 defaults, kept the same 3 %.
2. From the remaining 8,000, hold out 20 % for **validation**: 1,600 loans with 48 defaults.
3. Train on the 6,400 left (192 defaults). Try logistic regression, a tree and a forest, with a few settings each, comparing them on validation.
4. Pick the best, retrain it on training + validation (8,000 loans), and score it **once** on the test set.
5. The loans were made over 5 years, so the bank also checks a time split: train on years 1 to 4, test on year 5. The score is a little lower, which is the more realistic number for next year.

## 6. Practice

1. You tune a model 200 times against the test set and pick the best. Is its test score still honest?
2. A dataset has 40 photos each of 50 people, for a model that detects glasses. How should you split?
3. Why are training errors usually lower than test errors?

<details>
<summary>Answers</summary>

1. No. The test set has become a validation set. You need fresh data for an honest score.
2. Grouped by person: all 40 photos of a person go in the same set, so the model is tested on faces it has never seen.
3. Because the parameters were chosen to fit the training rows, including their noise.
</details>

**Try it on your own data:** the [[train-test-splitter]] splits a CSV at random, stratified or by time, in your browser.

**New words:** *training set*, *validation set*, *test set*, *generalisation error*, *stratified split*, *grouped split*, *time split*.

**Next, Module 3:** the first real model, the straight line fitted by least squares.

<div class="keypoints">

- Training rows fit the parameters, validation rows choose between models, and the test set gives one final honest score.
- Training error flatters the model; test error estimates how it will do on new data.
- Split at random for independent rows, stratified for rare classes, grouped for repeated people or items, and by time for anything over time.
- A small test set gives a wobbly score; its standard error shrinks like 1 ÷ √n.

</div>
