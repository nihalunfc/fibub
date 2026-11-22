---
title: Data, features, labels and models
summary: Rows are examples, columns are features, and the column you want to predict is the label. Learn the words used in every dataset, and how the label decides whether you need regression, classification or clustering.
minutes: 15
updated: 2026-11-22
quiz:
  - q: You want to predict a flat's monthly rent in dollars. What kind of problem is it?
    choices: ['Classification, because rent is a category', 'Regression, because the label is a number', 'Clustering, because there is no label']
    ans: 1
    why: The label (rent) is a number on a scale, so this is regression.
  - q: In a table of patients, which is the label if the task is "will this patient be readmitted within 30 days?"
    choices: ['Age', 'The number of past visits', 'A yes/no column saying whether they were readmitted']
    ans: 2
    why: The label is the answer you want to predict. Age and past visits are features the model can use to predict it.
  - q: A shop has customer purchase records but no labels, and wants to find groups of similar customers. What is this?
    choices: ['Supervised learning', 'Unsupervised learning', 'Regression']
    ans: 1
    why: With no right answers to learn from, the model can only look for structure such as groups. That is unsupervised learning (Module 8).
sources:
  - 'James, G., Witten, D., Hastie, T., Tibshirani, R. and Taylor, J. (2023), An Introduction to Statistical Learning with Applications in Python, Springer, Chapters 2 and 3 https://www.statlearning.com/'
  - 'scikit-learn user guide: Encoding categorical features (OneHotEncoder) https://scikit-learn.org/stable/modules/preprocessing.html'
  - 'Hastie, T., Tibshirani, R. and Friedman, J. (2009), The Elements of Statistical Learning, 2nd ed., Springer, Chapter 2 https://hastie.su.domains/ElemStatLearn/'
---

**Module 1 · about 15 minutes · read first: 1.1.** You'll be able to name the parts of a dataset, say which column is the label, and tell regression, classification and clustering apart.

<div class="bigidea">A dataset is a table: each row is one example, each column is a fact about it, and the one column you want to predict is the label.</div>

## 1. Why this matters

Every machine learning conversation uses the same handful of words: example, feature, label, model, prediction. Different fields use different names for the same thing (a statistician says "variable" where a data scientist says "feature"). Learn the words now and every later lesson reads easily.

## 2. The parts of a dataset

Picture a class register. Each line is a pupil, each column is a fact about that pupil, and somewhere is the exam result you would like to forecast. Most data used for learning looks exactly like that:

- Each **row** is one **example** (also called an observation, record or instance): one home, one customer, one day.
- Each **column** is one **feature** (also called a variable, attribute, input or predictor): floor area, age, day of the week.
- One column is special: the **label** (also called the target, output or response). It is the thing you want to predict.

Tap the column headings below to choose different labels.

<!--fig:feature-table-->

The same table can answer different questions. If the label is sale price, you are predicting a number. If the label is "sold within 30 days?", you are predicting yes or no. If you pick no label at all, you can still ask "which homes are alike?".

## 3. Three kinds of learning

| Kind | What you have | What it predicts | Examples | In this course |
|---|---|---|---|---|
| **Regression** (supervised) | Features and a number label | A number | Price, temperature, sales next week | Module 3 |
| **Classification** (supervised) | Features and a category label | A category, often with a probability | Spam or not, which digit, will cancel | Modules 4 to 6 |
| **Clustering and other unsupervised work** | Features only | Groups, patterns, odd cases | Customer segments, fraud that looks unusual | Module 8 |

"Supervised" means the right answers act like a teacher marking homework: the model can check itself against them. "Unsupervised" means there is no teacher, so the model can only look for patterns on its own. Language models (Module 10) use a clever trick: the label is simply the next word of real text, so nobody has to write labels by hand.

## 4. The model as a machine with dials

A model takes the features of one example and returns a prediction. Inside it are **parameters**: numbers that training adjusts, like dials on a mixing desk. It helps to picture three parts:

1. **Inputs**: the features of one example, written as a list of numbers `$\mathbf{x} = (x_1, x_2, \dots, x_d)$`. A list like this is called a **vector** (Lesson 1.4). `$d$` is how many features there are.
2. **The model**: a function `$f$` with parameters `$\theta$` (the Greek letter theta, which just means "all the dials").
3. **Output**: the prediction `$\hat y = f(\mathbf{x}; \theta)$`. Read it as "y-hat equals f of x, using dials theta".

Training is choosing `$\theta$` so that `$\hat y$` is close to the true label `$y$` on the training examples. Everything from a straight line to a language model fits this picture.

<div class="meaning">

<dl>
<dt>x (features)</dt><dd>What you know about one example, as a list of numbers: floor area, bedrooms, age.</dd>
<dt>y (label)</dt><dd>The true answer for that example, such as the price it really sold for.</dd>
<dt>ŷ (prediction)</dt><dd>The model's guess for y. The hat means "estimated".</dd>
<dt>θ (parameters)</dt><dd>The dials inside the model that training sets.</dd>
<dt>n and d</dt><dd>n is the number of rows (examples); d is the number of feature columns.</dd>
<dt>Physical meaning</dt><dd>A model is a machine you feed facts into and get a guess out of. The features are the facts you can see today; the label is the fact you will only see later (the sale price, the cancellation). Learning means using the past, where you saw both, to guess the future, where you see only the first.</dd>
</dl>

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a dataset is a table of numbers `$X$` with `$n$` rows and `$d$` feature columns, plus a label column `$\mathbf{y}$` of length `$n$`.

**Notation used in this course:**

```math
X = \begin{pmatrix} x_{11} & x_{12} & \cdots & x_{1d} \\ x_{21} & x_{22} & \cdots & x_{2d} \\ \vdots & & & \vdots \\ x_{n1} & x_{n2} & \cdots & x_{nd} \end{pmatrix}, \qquad \mathbf{y} = \begin{pmatrix} y_1 \\ y_2 \\ \vdots \\ y_n \end{pmatrix}
```

`$x_{ij}$` is the value of feature `$j$` for example `$i$`. Row `$i$` of `$X$` is the vector `$\mathbf{x}_i$`. A model is a function `$\hat{y}_i = f(\mathbf{x}_i; \theta)$`.

**Analogy:** the table is a class register. Each row is a pupil, each column a fact about them, and the label is the exam result you want to forecast.

**Try it:** the home table above has 6 rows. If sale price is the label, what are `$n$` and `$d$`? (`$n = 6$` examples and `$d = 5$` features.)
</details>

## 5. Features need to be numbers

Models do arithmetic, so every feature must end up as a number. Numbers stay as they are (after scaling, Lesson 2.4). Categories are turned into numbers, most often by **one-hot encoding**: one yes/no column per category. Think of a row of light switches, one per area, with only one switched on.

| Area | → | Area = Centre | Area = Suburb | Area = Edge |
|---|---|---|---|---|
| Centre | | 1 | 0 | 0 |
| Edge | | 0 | 0 | 1 |

Watch one raw row become the numbers a model can read:

<div class="steps">
<div class="step"><b>The raw row.</b> A home: 95 m², 3 bedrooms, 40 years old, area "Suburb", sold for $354,000.</div>
<div class="step"><b>Set the label aside.</b> We want to predict the price, so $354,000 becomes y. It is the answer, not an input.</div>
<div class="step"><b>Keep the numbers.</b> Floor area 95, bedrooms 3 and age 40 are already numbers, so they stay.</div>
<div class="step"><b>One-hot the category.</b> "Suburb" becomes three switches: Centre 0, Suburb 1, Edge 0.</div>
<div class="step"><b>The feature vector.</b> x = (95, 3, 40, 0, 1, 0). That is d = 6 numbers, ready for any model in this course.</div>
</div>

<div class="myth">

**"Just number the categories: Centre = 1, Suburb = 2, Edge = 3."** That tells the model Edge is "three times" Centre and Suburb sits exactly halfway between them, which means nothing. The model would happily learn rules based on that fake order. One-hot columns carry no fake order. Only truly ordered categories (S, M, L, or "poor, fair, good") can safely be numbered in order.

</div>

<div class="problem" data-problem="features-labels-models-onehot"></div>

## 6. Worked example

*Made-up numbers.* A hospital team wants to flag patients likely to come back within 30 days. Their table has one row per hospital stay (12,400 rows). Features: age, number of medicines, days in hospital, number of visits in the past year, and ward (one of 6 wards, one-hot encoded into 6 columns). That is 4 + 6 = 10 feature columns, so `$d = 10$`. The label is "readmitted within 30 days" (yes or no), so it is a **classification** problem. If instead they wanted "how many days until readmission", it would be **regression**. And if they had no outcome at all and wanted to find types of patients, it would be **clustering**.

## 7. Practice

1. A weather service predicts tomorrow's rainfall in millimetres. Regression or classification?
2. A bank predicts whether a card payment is fraud. What is the label, and is it regression or classification?
3. A column "City" has 4 values. How many columns does one-hot encoding make?

<details>
<summary>Answers</summary>

1. Regression: the label is an amount.
2. The label is fraud (yes or no): classification.
3. Four, one per city (some tools drop one of them, because it can be worked out from the other three).
</details>

**Try it on your own data:** open a CSV in the [[csv-profiler]] to see each column's type and gaps before you choose a label.

**New words:** *example* (a row), *feature* (an input column), *label* or *target* (the column to predict), *supervised* and *unsupervised*, *regression*, *classification*, *clustering*, *one-hot encoding*.

<div class="keypoints">

- Rows are examples, columns are features, and the column you want to predict is the label.
- A number label means regression; a category label means classification; no label means unsupervised work such as clustering.
- A model is a function ŷ = f(x; θ) with dials θ that training sets.
- Every feature must become a number; categories are one-hot encoded, not numbered 1, 2, 3.

</div>
