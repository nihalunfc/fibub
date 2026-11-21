---
title: Predicting a category
summary: 'Classification predicts which group something belongs to: spam or not, which digit, will this customer leave. See how it differs from regression, why models output probabilities, and why a straight line is the wrong tool for yes/no labels.'
minutes: 15
updated: 2026-11-21
quiz:
  - q: Which is a classification task?
    choices: ['Predicting tomorrow''s temperature', 'Predicting which of 10 digits a handwritten image shows', 'Predicting the price of a car']
    ans: 1
    why: The answer is one of a fixed set of categories. The other two are numbers, so they are regression.
  - q: Why do most classifiers output a probability rather than just a class?
    choices: ['Probabilities are more accurate', 'A probability tells you how sure the model is, and lets you choose a threshold that suits the cost of each mistake', 'Classes cannot be computed']
    ans: 1
    why: 'A 51 % "fraud" and a 99 % "fraud" deserve different actions. The probability lets you set the threshold for your job (Lesson 4.5).'
  - q: What goes wrong if you fit an ordinary straight line to labels coded 0 and 1?
    choices: ['Nothing', 'Predictions can go below 0 or above 1, and far-away points drag the line around', 'It always predicts 0.5']
    ans: 1
    why: A line has no limits, so it outputs impossible "probabilities", and a few extreme examples tilt it. The sigmoid of Lesson 4.2 fixes both.
---

**Module 4 · about 15 minutes · read first: 1.2.** You'll be able to tell classification from regression, name binary and multi-class problems, and explain why classifiers give probabilities.

## 1. Why this matters

Many of the most valuable predictions are categories: is this payment fraud, is this X-ray normal, will this machine fail this week, which product category does this listing belong to. Module 4 covers the main ways to do it, starting from the linear model you already know.

## 2. Classification in one picture

<!--fig:reg-vs-class-->

- **Binary** classification has two classes, usually coded 1 ("positive": spam, fraud, disease) and 0 ("negative"). "Positive" just means the class you are looking for, not that it's good news.
- **Multi-class** has more than two: digits 0 to 9, types of plant, which department a complaint goes to.
- **Multi-label** lets one example have several labels at once: a photo can contain both a dog and a car.

## 3. Probabilities, then decisions

A good classifier doesn't just say "spam". It says "spam, with probability 0.93". You then turn the probability into a decision with a **threshold**: flag if `$p \ge 0.5$`, or `$p \ge 0.9$` if a false alarm is costly. Keeping the two steps apart is useful: the model estimates how likely something is; the business decides what level of risk to act on (Lesson 4.5).

For multi-class problems, the model gives one probability per class, adding up to 1, and usually picks the largest.

## 4. Why not just use linear regression?

Code the labels as 0 and 1 and fit a straight line. It sort of works, but:

- Predictions run below 0 and above 1, which can't be probabilities.
- Examples far from the boundary, which are the easiest to classify, pull the line around, moving the boundary in the wrong direction.
- The squared error punishes a confident correct prediction of 1.4 as much as a wrong one of 0.6.

Logistic regression (Lessons 4.2 to 4.4) keeps the straight-line score but bends it through an S-curve into a proper probability, and uses a loss made for probabilities.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a classifier estimates the conditional probability of each class given the inputs, then a decision rule turns it into a label.

**Equations:** for binary classification,

```math
p(\mathbf{x}) = P(y = 1 \mid \mathbf{x}), \qquad \hat{y} = \begin{cases} 1 & \text{if } p(\mathbf{x}) \ge t \\ 0 & \text{otherwise} \end{cases}
```

with threshold `$t$` (often 0.5). For `$K$` classes, `$p_k(\mathbf{x}) = P(y = k \mid \mathbf{x})$` with `$\sum_k p_k = 1$`, and `$\hat{y} = \arg\max_k p_k(\mathbf{x})$`.

**Analogy:** a weather forecast. "70 % chance of rain" is the model; whether you carry an umbrella is the decision, and depends on how much you mind getting wet.

**Try it:** a model gives three classes probabilities 0.2, 0.5 and 0.3. Which class does it pick, and how sure is it? (Class 2, with 50 %: not very sure.)
</details>

## 5. Worked example

*Made-up numbers.* A bank's model scores five card payments for fraud: 0.02, 0.15, 0.48, 0.81, 0.97. With threshold 0.5, payments 4 and 5 are blocked. But blocking a real customer's payment is annoying, and missing fraud costs money. The bank uses two thresholds instead: above 0.9, block automatically (payment 5); between 0.4 and 0.9, send a text asking the customer to confirm (payments 3 and 4); below 0.4, let it through. One model, three actions, all from the same probabilities.

## 6. Practice

1. Binary, multi-class or multi-label? (a) Tag a news article with every topic it covers. (b) Is this email spam? (c) Which of 5 languages is this text in?
2. Why might a hospital use a threshold below 0.5 for a screening test?
3. Fitting a straight line to 0/1 labels gives a prediction of 1.3. What's wrong with that?

<details>
<summary>Answers</summary>

1. (a) Multi-label. (b) Binary. (c) Multi-class.
2. Missing a sick patient is much worse than a false alarm that leads to a second test, so they flag anyone with even a moderate probability.
3. A probability can't exceed 1. The straight line has no limits.
</details>

**Try it on your own data:** the [[small-model-trainer]] trains logistic regression, a decision tree or k-nearest neighbours on a CSV with a category column.

**New words:** *classification*, *binary*, *multi-class*, *multi-label*, *positive class*, *threshold*, *decision rule*.
