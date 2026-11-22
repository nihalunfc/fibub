---
title: 'Finding the odd one out: anomaly detection'
seoTitle: 'Anomaly detection explained: z-scores to isolation forests'
summary: 'Fraud, faults and data errors are rare and often unlabelled. Score how unusual each row is: z-scores one column at a time, or distance to its neighbours across all columns. See which oddities each method catches.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: A value has a z-score of 4. It is
    choices: ['4 standard deviations from the mean: very unusual if the data are roughly normal', '4 % of the mean', 'In the 4th quartile']
    ans: 0
    why: Under a normal curve, values beyond 3 standard deviations occur about 3 times in 1,000; beyond 4, about 6 in 100,000.
  - q: Why can z-scores on each column miss an anomaly?
    choices: ['A row can be ordinary on every column alone but unusual in combination', 'z-scores are only for text', 'They always flag too many rows']
    ans: 0
    why: A tall child of normal weight for their age is not odd on height or weight alone; the combination is what matters.
  - q: Anomaly detection is often unsupervised because
    choices: ['Anomalies are rare and new kinds keep appearing, so there are few labels to learn from', 'Labels are illegal', 'Supervised models cannot find rare classes']
    ans: 0
    why: With labels, use a classifier with care for imbalance (Lesson 4.5); without them, score unusualness.
sources:
  - 'Chandola, Banerjee and Kumar (2009), Anomaly detection: a survey, ACM Computing Surveys 41(3), 15 https://doi.org/10.1145/1541880.1541882'
  - 'Liu, Ting and Zhou (2008), Isolation forest, Eighth IEEE International Conference on Data Mining, 413-422 https://doi.org/10.1109/ICDM.2008.17'
  - 'scikit-learn user guide, Novelty and outlier detection https://scikit-learn.org/stable/modules/outlier_detection.html'
---

**Module 8 · about 20 minutes · read first: 1.6, 4.7.** You'll be able to flag outliers with z-scores, explain distance-based and isolation-based anomaly scores, and set a threshold sensibly.

<div class="bigidea">Instead of learning what every kind of trouble looks like, learn what normal looks like, and give a second look to whatever doesn't fit.</div>

## 1. Why this matters

Banks look for unusual card payments. Factories watch for sensors drifting before a breakdown. IT teams look for strange network traffic, and analysts for typing errors in data. In each case the interesting rows are rare, often unlabelled, and new kinds keep appearing. So instead of learning "what fraud looks like", we learn what normal looks like and flag what doesn't fit.

A security guard works the same way. They don't carry a list of every possible burglar; they know the regulars, and anyone who doesn't fit the usual pattern gets a second look.

## 2. One column at a time: z-scores

The **z-score** says how many standard deviations (typical wobbles) a value is from the mean (Lesson 1.6): `$z = (x - \bar{x})/s$`. A common rule flags `$\lvert z \rvert > 3$`. The box-plot rule (beyond 1.5 × IQR past the quartiles, Lesson 2.2) is a sturdier version that the outliers themselves don't distort.

<div class="problem" data-problem="anomaly-detection-z"></div>

Both look at one column at a time. Many anomalies are only odd in **combination**: a payment of an ordinary amount, at an ordinary hour, but at an hour when this card only ever makes large payments.

### Watch it happen

<div class="steps">
<div class="step"><p><b>Learn normal.</b> A card's payments average $60, with a standard deviation of $15.</p></div>
<div class="step"><p><b>A big payment.</b> $120 arrives. z = (120 − 60) ÷ 15 = 4. Four wobbles from normal: flagged.</p></div>
<div class="step"><p><b>A sneaky one.</b> $70 at 3 a.m. Amount: z = 0.67, ordinary. Hour: this card does sometimes pay at night. Each column alone looks fine.</p></div>
<div class="step"><p><b>Look at neighbours.</b> But every past 3 a.m. payment on this card was about $400 (a monthly bill paid overnight), and every $70 payment was at lunchtime. The new payment's nearest neighbours across both columns are far away: a high anomaly score.</p></div>
<div class="step"><p><b>Set the cut.</b> The fraud team can check 50 alerts a day, so the 50 highest scores of the day get a look. This one makes the list.</p></div>
</div>

## 3. Across all columns

- **Distance to neighbours:** score each row by its mean distance to its `$k$` nearest neighbours (Lesson 4.7). Lonely points score high. Works in any number of columns, after scaling.
- **Isolation forest:** grow random trees that split on random columns at random thresholds. Anomalies, being few and different, get cut off from the rest in very few splits, like the one person in a crowd wearing a bright yellow coat. Fast on large data, and a common default.
- **Reconstruction error:** squash the data with PCA (Lesson 8.4) or an autoencoder (a neural network that compresses and rebuilds), then rebuild it. Rows the compression can't rebuild well are unusual.

<!--fig:anomaly-->

## 4. Choosing the threshold

Every method gives a score; you choose where to cut. A low cut catches more anomalies and raises more false alarms. With a few labelled cases, use the precision and recall ideas of Lesson 4.5. Without them, set the cut by capacity: "the fraud team can check 50 alerts a day, so flag the top 50".

<div class="problem" data-problem="anomaly-detection-false-alarms"></div>

<div class="meaning">

<dl>
<dt>z = (x − x̄)/s</dt><dd>how many standard deviations a value sits from the mean</dd>
<dt>P(|Z| &gt; 3) ≈ 0.0027</dt><dd>even in perfectly normal data, about 3 values in 1,000 land that far out</dd>
<dt>N_k(x)</dt><dd>the k past rows most like this one</dd>
<dt>score(x)</dt><dd>the average distance to those neighbours: high means lonely, so unusual</dd>
<dt>Physical meaning</dt><dd>A night-shift nurse who knows each patient's normal. A heart rate of 110 is fine for one patient and alarming for another; the alarm should depend on what is normal for this patient, and on how many alarms the nurse can answer in a night.</dd>
</dl>

</div>

<div class="myth">

**"An anomaly is a problem."** An anomaly is just *rare*. It might be fraud, a broken sensor or a typing error; it might also be your best customer, a record sales day, or a genuine new trend. Anomaly detection says "look here", not "something is wrong". A person, or a later model with labels, decides what it means.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** model what is normal, and score each row by how badly it fits.

**z-score and the normal tail:** if values are roughly normal,

```math
P(\lvert Z \rvert > 3) \approx 0.0027
```

so a `$\lvert z \rvert > 3$` rule flags about 3 rows in 1,000 even when nothing is wrong. With a million rows that is 2,700 false alarms.

**k-NN anomaly score** for row `$\mathbf{x}$`, with `$N_k(\mathbf{x})$` its `$k$` nearest other rows:

```math
\text{score}(\mathbf{x}) = \frac{1}{k} \sum_{\mathbf{x}' \in N_k(\mathbf{x})} \lVert \mathbf{x} - \mathbf{x}' \rVert
```

**Analogy:** a security guard who knows the regulars. They don't need a list of every possible burglar; anyone who doesn't fit the usual pattern gets a second look.

**Try it:** daily sales have mean 200 and standard deviation 25. Is a day of 290 flagged by the `$\lvert z \rvert > 3$` rule? (`$z = 90/25 = 3.6$`: yes.)
</details>

## 5. Worked example

*Made-up numbers.* A warehouse sensor reports temperature every hour. Over a month: mean 4.0 °C, standard deviation 0.5 °C.

| hour | temperature | z | flagged at 3? |
|---|---|---|---|
| 10:00 | 4.3 | 0.6 | no |
| 14:00 | 5.8 | 3.6 | yes |
| 15:00 | 4.9 | 1.8 | no |
| 16:00 | 4.9 | 1.8 | no |
| 17:00 | 4.9 | 1.8 | no |

The spike at 14:00 is caught. The real problem, a fridge slowly failing and holding 4.9 °C for hours, is not: each reading alone is ordinary. A score that looks at the recent run of values (say, the mean of the last 3 hours, or distance to normal days' patterns) catches it. Choose features that describe the anomaly you care about.

## 6. Practice

1. In the simulation, which planted oddity do z-scores miss, and which method catches it?
2. Why can a `$\lvert z \rvert > 3$` rule be a problem on a million rows?
3. Why scale the columns before using distance to neighbours?

<details>
<summary>Answers</summary>

1. The small payment at a "large payments" hour; nearest-neighbour distance catches it because it is far from both usual groups.
2. Even perfectly normal data puts about 0.27 % of rows past 3: 2,700 false alarms.
3. Otherwise the column with the largest numbers decides all the distances.
</details>

**Try it on your own data:** the [[csv-profiler]] flags outliers in every column of your file; the [[box-plot-lab]] shows the fences that decide them.

**New words:** *anomaly*, *outlier*, *z-score*, *k-NN distance score*, *isolation forest*, *reconstruction error*, *false alarm*.

<div class="keypoints">

- Anomaly detection models what is normal and scores how badly each row fits, because anomalies are rare and often unlabelled.
- z-scores (and box-plot fences) check one column at a time; they miss rows that are odd only in combination.
- Distance to neighbours, isolation forests and reconstruction error score rows across all columns (scale first).
- Even normal data crosses any fixed threshold sometimes; set the cut by the cost of false alarms or by how many alerts people can check.

</div>
