---
title: What machine learning needs from a data platform
summary: 'Training and serving, features and labels, point-in-time correctness, leakage, and the training-serving skew that quietly breaks models.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: A training row is "as of" 1 October. Which feature value is allowed?
    choices: ['Purchases in the 30 days up to 30 September', 'Purchases in the whole of October', 'The customer''s current total spend today']
    ans: 0
    why: A feature may use only what was known on the as-of date. October purchases and today's totals include the future, which is leakage.
  - q: What is training-serving skew?
    choices: ['The model is trained on too few rows', 'The features the live system computes differ from the ones the model was trained on', 'The server is in a different country']
    ans: 1
    why: If training features come from warehouse SQL and the live app recomputes them differently (time zones, refunds, rounding), the model meets inputs it never learned from.
  - q: A fraud check must answer within 50 milliseconds while the customer waits. Which serving style fits?
    choices: ['Nightly batch scoring into a table', 'Online inference with features from a low-latency store', 'A weekly report']
    ans: 1
    why: Batch scores are hours old. A request-time decision needs online inference, with features read from a fast store such as Bigtable or Redis.
sources:
  - 'Sculley, D. et al. (2015), Hidden Technical Debt in Machine Learning Systems, Advances in Neural Information Processing Systems 28'
  - 'Kaufman, S., Rosset, S., Perlich, C. and Stitelman, O. (2012), Leakage in Data Mining: Formulation, Detection, and Avoidance, ACM Transactions on Knowledge Discovery from Data 6(4) https://doi.org/10.1145/2382577.2382579'
  - 'Google Cloud documentation: Vertex AI Feature Store overview (cloud.google.com/vertex-ai/docs)'
  - 'Huyen, C. (2022), Designing Machine Learning Systems, O''Reilly, Chapters 5 to 8'
---

**Module 6 · about 25 minutes · read first: 3.3; helpful: [Machine learning foundations](/learn/courses/ml-foundations/).** You'll be able to describe the machine learning lifecycle from the data side, build a training row without leaking the future, choose batch or online serving, and explain how platforms stop training-serving skew.

<div class="bigidea">A model is only as good as the rows it learns from, so a platform for machine learning must give each training row only what was known at that moment, and feed the live model features computed exactly the same way.</div>

## 1. The lifecycle, seen from the data

1. **Frame the problem:** predict what, for whom, and what action follows? ("Score each loyalty member's chance of buying a coffee brand next week, to choose who gets an offer.")
2. **Collect and label data:** the history of who bought what, with the **label**, the answer the model must learn (did they buy?).
3. **Build features:** the numbers the model learns from (purchases in the last 30 days, days since last visit, share of spend on coffee).
4. **Train and evaluate:** fit models and compare them on rows they did not see ([train, validation and test sets](/learn/courses/ml-foundations/train-test-split/)).
5. **Deploy:** **batch** predictions (score everyone nightly and write a table) or **online** predictions (score inside a request, in milliseconds).
6. **Monitor and retrain:** watch whether the inputs, the predictions and the business results drift, and retrain on a schedule or when quality falls.

A data platform's job is to make steps 2, 3, 5 and 6 reliable and repeatable. That is where most of the real effort in machine learning goes.

Think of a restaurant kitchen. The model is the chef; features are the prepared ingredients. If the morning prep cook dices onions one way (training) and the evening cook slices them another way (serving), the dish tastes different, even with the same chef and recipe. A feature platform is one prep standard that every shift follows.

## 2. Features, labels and time

A **training set** is a table of rows: (entity, as-of time, features, label). The **entity** is what you predict for, here a loyalty member.

| member | as_of_date | buys_30d | days_since_visit | coffee_share | **label: bought_next_7d** |
|---|---|---|---|---|---|
| m42 | 2026-10-01 | 6 | 2 | 0.12 | 1 |
| m42 | 2026-10-08 | 4 | 5 | 0.10 | 0 |

The rule that matters most is **point-in-time correctness**: every feature value in a row must be what was known **on that row's as-of date**, never later. A normal SQL join to a "current" feature table quietly copies tomorrow's knowledge into yesterday's row. Feature platforms provide **point-in-time joins** (also called "as of" joins) that pick, for each row, the latest value before its date.

<div class="steps" data-fig="what-ml-needs-pit">
<div class="step"><b>The raw history.</b> Member m42 bought on ten days across October and November. Every purchase is an event with a date.</div>
<div class="step"><b>A training row.</b> We want the row "as of Nov 16": would m42 buy in the next 7 days? Everything left of the dashed line was known that morning; everything right of it was not.</div>
<div class="step"><b>The correct feature.</b> buys_30d counts purchases from Oct 17 to Nov 15 only: 5 purchases.</div>
<div class="step"><b>The leak.</b> A careless join to "purchases in November" counts 6, and three of them happened after Nov 16. In training the model learns from the future; live, the future is never there, and accuracy falls.</div>
<div class="step"><b>The next row.</b> As of Nov 23, the 30-day window slides a week to the right. Each training row gets its own window.</div>
</div>

<div class="problem" data-problem="what-ml-needs-pit"></div>

**Leakage** is the commonest reason a model that tested brilliantly fails in real use. Typical sources: future data, IDs or codes that secretly encode the outcome, and columns that are only filled in after the event (a "refund reason" column predicts refunds perfectly). The ML course has a full lesson on it: [Data leakage](/learn/courses/ml-foundations/data-leakage/).

<div class="meaning">

<dl>
<dt>Entity</dt><dd>The thing a prediction is about: a shopper, a store, a product, a card.</dd>
<dt>Label</dt><dd>The answer the model learns to predict, taken from what happened after the as-of time.</dd>
<dt>Feature</dt><dd>A number about the entity, computed only from data before the as-of time.</dd>
<dt>Point-in-time join</dt><dd>A join that gives each training row the feature values as they were on its date.</dd>
<dt>Physical meaning</dt><dd>A coupon model that scored 95% in testing but sends offers to the wrong shoppers in real life usually saw the answer during training: one feature was counted up to the end of the month, after the coupon went out. Point-in-time joins are the guard rail that stops a model from "remembering the future".</dd>
</dl>

</div>

Press Run the checks, then switch checks off and lower the stop threshold.

<figure class="fig" data-fig="@data-dq-gate"><figcaption>Notice which bad rows slip through when a check is off, and when the gate stops the whole load.</figcaption></figure>


## 3. Two ways to serve predictions

| | **Batch inference** | **Online inference** |
|---|---|---|
| When | Nightly or hourly | During each request |
| Delay | Minutes to hours | Tens of milliseconds |
| Features from | The warehouse or lake | An **online store** (Bigtable, Redis, DynamoDB) |
| Examples | Weekly offer targeting, demand forecasts | Fraud checks, "recommended for you", ad ranking |
| Platform needs | BigQuery, Spark, Airflow | Streaming features, fast stores, model endpoints |

Start with batch whenever the decision can wait. It is far cheaper and easier to check.

## 4. Training-serving skew

If training features are built in BigQuery SQL and the live app recomputes them in Java, they will differ in small ways: time zones, whether refunds count, rounding, what "last 30 days" means at midnight. The model then sees inputs it never learned from. Fixes:

- **Define each feature once** and compute it for both paths from the same code (a feature store, or shared transformation code).
- **Log the features actually served** and compare them with the training data.
- **Monitor drift** in inputs and outputs, and alert when they move.

<div class="myth">

**"A better algorithm will fix a model that works in testing but not live."** Almost always the gap is the data: leakage in training, or features computed differently in serving. Check point-in-time joins and compare served features with training features before touching the algorithm.

</div>

## 5. What machine learning teams ask of data engineers

- **History:** raw events kept, not only daily totals, so features can be rebuilt with new definitions.
- **Time-correct snapshots** for training.
- **Fresh features** for online models.
- **Lineage:** which data and which code trained which model.
- **Quality checks** before training (the same tests you met in [Pipeline to Dashboard](/learn/courses/etl/quality-gates/)).
- **Cheap compute** for experiments.

These are what job postings mean by "data platforms supporting AI/ML workloads". The next lesson shows the tools that package them.

## 6. Try it

For a model that predicts whether a shopper will redeem a coupon within 7 days of receiving it, write down the entity, the as-of time, the label and five features. Then mark one feature that could leak and say how to fix it.

<details>
<summary>One answer, and what to check</summary>

Entity: shopper. As of: the moment the coupon was sent. Label: redeemed within 7 days of sending. Features: visits in the last 30 days; spend in the coupon's category in the last 90 days; coupons redeemed ÷ received in the last 180 days; days since last purchase; distance to the nearest store. Leak risk: "total spend this month" computed at month end includes days after the coupon was sent; compute it only up to the send time.

**Check:** every feature has a time window that ends at the as-of time, and the label's window starts there.
</details>

**New words:** *entity*, *label*, *feature*, *as-of date*, *point-in-time join*, *leakage*, *batch inference*, *online inference*, *online store*, *training-serving skew*, *drift*.

<div class="keypoints">

- A training row is (entity, as-of time, features, label); features may use only data from before the as-of time, the label only data after it.
- Point-in-time joins give each row the feature values as they were on its date; normal joins to current tables leak the future.
- Batch inference scores on a schedule from the warehouse; online inference scores per request from a fast online store. Prefer batch when the decision can wait.
- Training-serving skew comes from computing features two different ways. Define features once, log what was served and watch for drift.

</div>
