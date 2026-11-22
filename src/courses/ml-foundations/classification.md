---
title: Predicting a category
summary: 'Classification predicts which group something belongs to: spam or not, which digit, will this customer leave. See how it differs from regression, why models output probabilities, and why a straight line is the wrong tool for yes/no labels.'
minutes: 15
updated: 2026-11-22
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
sources:
  - 'James, Witten, Hastie and Tibshirani (2021), An Introduction to Statistical Learning, 2nd edition, Springer, Chapter 4 (Classification) https://www.statlearning.com/'
  - 'Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, Springer, Chapter 4 (Linear methods for classification)'
  - 'scikit-learn user guide: Tuning the decision threshold for class prediction https://scikit-learn.org/stable/modules/classification_threshold.html'
---

**Module 4 · about 15 minutes · read first: 1.2.** You'll be able to tell classification from regression, name binary and multi-class problems, and explain why classifiers give probabilities.

<div class="bigidea">A classifier does not just say "yes" or "no": it says how likely "yes" is, and you decide how likely is likely enough to act.</div>

## 1. Why this matters

Many of the most useful predictions are not numbers but **categories** (groups). Is this payment fraud? Is this X-ray normal? Will this machine break this week? Which shelf does this product go on? Predicting a category is called **classification**. Predicting a number, like a price, is **regression** (Module 3). This module shows the main ways to classify, starting from the straight-line model you already know.

## 2. Classification in one picture

<!--fig:reg-vs-class-->

Think of sorting post. A regression model would guess how heavy each letter is. A classifier puts each letter in a tray.

- **Binary** classification has two trays, usually coded 1 ("positive": spam, fraud, disease) and 0 ("negative"). "Positive" only means "the thing you are looking for". It is not good news.
- **Multi-class** has more than two trays: the digits 0 to 9, types of plant, which department a complaint goes to.
- **Multi-label** lets one item go in several trays at once: one photo can contain a dog and a car.

## 3. Probabilities, then decisions

A good classifier doesn't just say "spam". It says "spam, with probability 0.93". A **probability** is a number from 0 (surely not) to 1 (surely yes). You then turn it into an action with a **threshold**, a cut-off line: flag the email if `$p \ge 0.5$`, or only if `$p \ge 0.9$` when a false alarm is costly.

Keep the two steps apart. The model's job is to say how likely something is. Your job (or the business's) is to decide how much risk is worth acting on. For multi-class problems the model gives one probability per class, they add up to 1, and it usually picks the biggest.

<div class="steps">
<div class="step"><p><b>The model scores five card payments.</b> Its fraud probabilities are 0.02, 0.15, 0.48, 0.81 and 0.97.</p></div>
<div class="step"><p><b>One threshold, 0.5.</b> Payments 4 and 5 are blocked; the other three go through. Payment 3, at 0.48, slips past even though it is nearly a coin flip.</p></div>
<div class="step"><p><b>Think about costs.</b> Blocking a real customer annoys them. Missing fraud loses money. A quick "was this you?" text is cheap.</p></div>
<div class="step"><p><b>Two thresholds, three actions.</b> Above 0.9: block (payment 5). From 0.4 to 0.9: text the customer (payments 3 and 4). Below 0.4: let it through (payments 1 and 2).</p></div>
<div class="step"><p><b>Same model, better decisions.</b> Nothing about the model changed. Only the cut-off lines moved, chosen from what each mistake costs.</p></div>
</div>

<div class="meaning">

<dl>
<dt>p(x)</dt><dd>The model's probability that item x is in the positive class, written P(y = 1 | x): "the chance y is 1, given what we know about x".</dd>
<dt>t</dt><dd>The threshold: the cut-off. If p is at least t, predict 1; otherwise predict 0.</dd>
<dt>ŷ</dt><dd>"y-hat", the predicted label (the hat means "estimated").</dd>
<dt>Physical meaning</dt><dd>p is like a weather forecast of "70 % chance of rain". The threshold is your personal rule for carrying an umbrella, and it depends on how much you mind getting wet.</dd>
</dl>

</div>

The best threshold comes from costs. If acting costs a little and missing costs a lot, act even when the chance is small.

<div class="problem" data-problem="classification-threshold"></div>

## 4. Why not just use linear regression?

Code the labels as 0 and 1 and fit a straight line through them. It sort of works, but:

- A line has no ends. Its predictions run below 0 and above 1, and a "probability" of 1.3 makes no sense.
- Examples far from the border are the easiest to classify, yet they pull the line around the most, moving the border the wrong way.
- Squared error punishes a confident, correct 1.4 just as much as a wrong 0.6.

Logistic regression (Lessons 4.2 to 4.4) keeps the straight-line score but bends it through an S-shaped curve into a proper probability, and it uses a loss made for probabilities.

<div class="myth">

**"A classifier that says 0.7 is right 70 % of the time."** Only if it is **calibrated**. Many models give scores that rank cases well but are too extreme or too timid as probabilities. Check this by grouping cases the model scored about 0.7 and seeing whether about 70 % of them really were positive. If not, the scores still sort cases well, but don't read them as true chances.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a classifier estimates the probability of each class given the inputs, then a decision rule turns it into a label.

**Equations:** for binary classification,

```math
p(\mathbf{x}) = P(y = 1 \mid \mathbf{x}), \qquad \hat{y} = \begin{cases} 1 & \text{if } p(\mathbf{x}) \ge t \\ 0 & \text{otherwise} \end{cases}
```

with threshold `$t$` (often 0.5). For `$K$` classes, `$p_k(\mathbf{x}) = P(y = k \mid \mathbf{x})$` with `$\sum_k p_k = 1$`, and `$\hat{y} = \arg\max_k p_k(\mathbf{x})$` ("pick the class with the largest probability").

**Threshold from costs:** if missing a positive costs `$C_{\text{miss}}$` and acting costs `$C_{\text{act}}$`, acting pays when `$p \, C_{\text{miss}} > C_{\text{act}}$`, so `$t = C_{\text{act}} / C_{\text{miss}}$`.

**Analogy:** a weather forecast. "70 % chance of rain" is the model; whether you carry an umbrella is the decision.

**Try it:** a model gives three classes probabilities 0.2, 0.5 and 0.3. Which class does it pick, and how sure is it? (Class 2, with 50 %: not very sure.)
</details>

## 5. Worked example

*Made-up numbers.* A bank's model scores five card payments for fraud: 0.02, 0.15, 0.48, 0.81, 0.97. With threshold 0.5, payments 4 and 5 are blocked. But blocking a real customer's payment is annoying, and missing fraud costs money. So the bank uses two thresholds: above 0.9, block automatically (payment 5); between 0.4 and 0.9, send a text asking the customer to confirm (payments 3 and 4); below 0.4, let it through. One model, three actions, all from the same probabilities.

## 6. Practice

1. Binary, multi-class or multi-label? (a) Tag a news article with every topic it covers. (b) Is this email spam? (c) Which of 5 languages is this text in?
2. Why might a hospital use a threshold below 0.5 for a screening test?
3. Fitting a straight line to 0/1 labels gives a prediction of 1.3. What's wrong with that?

<details>
<summary>Answers</summary>

1. (a) Multi-label. (b) Binary. (c) Multi-class.
2. Missing a sick patient is much worse than a false alarm that leads to a second test, so they flag anyone with even a moderate probability.
3. A probability can't be more than 1. The straight line has no limits.
</details>

<div class="keypoints">

- Classification predicts a category; regression predicts a number.
- Binary has two classes, multi-class more than two, multi-label allows several at once.
- Good classifiers give a probability; a threshold turns it into an action.
- Choose the threshold from the cost of each kind of mistake, not by habit at 0.5.
- A straight line is a poor classifier: it gives impossible probabilities and is pulled about by easy, far-away points.

</div>

**Try it on your own data:** the [[small-model-trainer]] trains logistic regression, a decision tree or k-nearest neighbours on a CSV with a category column.

**New words:** *classification*, *binary*, *multi-class*, *multi-label*, *positive class*, *threshold*, *decision rule*, *calibrated*.
