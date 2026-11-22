---
title: 'Conditional probability and Bayes: the base-rate trap'
summary: 'Why a 90 %-accurate fraud alert can be wrong most of the time. Bayes'' rule as a count of 1,000 cases, the base rate, and how to turn P(flag | fraud) into the number you actually want, P(fraud | flag).'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'A churn model flags 80 % of customers who will leave and 10 % of those who will stay. 5 % of customers leave. Roughly what share of flagged customers will actually leave?'
    choices: ['80 %', 'About 30 %', '5 %']
    ans: 1
    why: 'Of 1,000 customers, 50 leave (40 flagged) and 950 stay (95 flagged). 40 ÷ 135 ≈ 30 %. The many stayers produce more false flags than the few leavers produce true ones.'
  - q: 'What is the base rate in a Bayes problem?'
    choices: ['The accuracy of the test', 'How common the thing is before you see any evidence', 'The false alarm rate']
    ans: 1
    why: 'The base rate (prior) is P(condition) before the test: here, the share of transactions that are fraud. Ignoring it is the base-rate fallacy.'
  - q: 'Which change raises P(fraud | flagged) the most when fraud is rare?'
    choices: ['Catching a few more fraud cases (higher sensitivity)', 'Fewer false alarms on honest transactions', 'Neither matters']
    ans: 1
    why: 'When fraud is rare, honest transactions vastly outnumber fraud, so even a small false alarm rate dominates the flagged pile. Cutting false alarms helps most.'
sources:
  - 'OpenIntro Statistics, 4th edition (Diez, Cetinkaya-Rundel, Barr), Section 3.2 Conditional probability https://www.openintro.org/book/os/'
  - 'Gigerenzer, G. and Hoffrage, U. (1995), How to improve Bayesian reasoning without instruction: frequency formats, Psychological Review 102(4), 684-704 https://doi.org/10.1037/0033-295X.102.4.684'
---

**Module 2 · about 25 minutes · school maths.** You'll be able to explain the base-rate trap, apply Bayes' rule with a table of counts, and judge alerts, tests and models by the number that matters.

<div class="bigidea">How often an alert is right depends as much on how rare the problem is as on how good the alert is.</div>

**In everyday terms:** a smoke alarm that goes off whenever you make toast catches every fire, yet most of its alarms are toast. When fires are rare, even a good alarm cries wolf more often than not.

## 1. Two different questions

A fraud alert catches 90 % of fraud. Someone's transaction is flagged. What is the chance it is fraud? Most people say "90 %". The real answer can be under 20 %.

The confusion is between two conditional probabilities (Lesson 2.1):

- `$P(\text{flag} \mid \text{fraud})$`: of fraud cases, how many get flagged. This is the alert's **sensitivity** (or recall). The vendor quotes this.
- `$P(\text{fraud} \mid \text{flag})$`: of flagged cases, how many are fraud. This is what the team reviewing alerts lives with (it's the **precision**, the same idea as in ML foundations Lesson 4.5).

They are linked through the **base rate**: how common fraud is in the first place.

<!--fig:bayes-grid-->

## 2. Count 1,000 cases

The easiest way to do Bayes is to imagine 1,000 cases and fill in a table. Fraud rate 1 %, sensitivity 90 %, false alarm rate 5 %:

| | Flagged | Not flagged | Total |
|---|---|---|---|
| Fraud | 9 | 1 | 10 |
| Honest | 49.5 | 940.5 | 990 |
| Total | 58.5 | 941.5 | 1,000 |

P(fraud | flagged) = 9 ÷ 58.5 ≈ **15 %**. Out of every 100 alerts, about 85 are false alarms. The alert isn't bad; fraud is simply rare, so the 5 % of a big honest pile outweighs 90 % of a small fraud pile.

Raise the fraud rate in the simulation to 20 % and the same alert becomes right most of the time. The quality of a flag depends on where you use it.

## 3. Bayes' rule

The table, written as a formula:

```math
P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B)}
```

where `$P(B)$` is the total chance of B over every way it can happen:

```math
P(B) = P(B \mid A)\,P(A) + P(B \mid \text{not } A)\,P(\text{not } A)
```

`$P(A)$` is the **prior** (base rate), `$P(B \mid A)$` the **likelihood** of the evidence, and `$P(A \mid B)$` the **posterior**: what you believe after seeing the evidence.

## 4. Where analysts meet this

- **Alerts and anomaly detectors:** most alarms on rare events are false. Size review teams for the false ones.
- **Model scores:** a churn or fraud model with great recall can still have low precision on a rare outcome. Report both.
- **Medical-style screening** of anything rare: defects, fake reviews, bots.
- **"Most X are Y" claims:** "most accidents happen near home" mostly reflects that most driving happens near home. Always ask for the base rate.
- **A/B testing:** Lesson 7.7 uses Bayes to turn test data into "the chance B is better than A".

<div class="meaning">

<dl>
<dt>Base rate P(fraud)</dt><dd>How common the thing is before any test: 1 in 100, 1 in 1,000.</dd>
<dt>Sensitivity P(flag | fraud)</dt><dd>Share of real cases the test catches.</dd>
<dt>False positive rate P(flag | no fraud)</dt><dd>Share of innocent cases the test wrongly flags.</dd>
<dt>P(fraud | flag)</dt><dd>What the person holding the alert wants to know: given a flag, how likely is it real?</dd>
<dt>Physical meaning</dt><dd>Bayes' rule is a head count. Out of everyone flagged, how many are real cases and how many are innocent ones caught by mistake? When innocents vastly outnumber cases, even a small mistake rate floods the flagged pile with them.</dd>
</dl>

</div>

<div class="myth">

**"The test is 95 % accurate, so a flag is 95 % likely to be right."** With 3 % faulty units, a flag is right only about 59 % of the time in the worked example, because 2 % of the huge pile of good units is still a lot of units.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Start with 10,000 units.</b> 3 % are faulty: 300 faulty, 9,700 good.</div>
<div class="step"><b>Run the check on the faulty ones.</b> It catches 95 %: 285 flagged, 15 missed.</div>
<div class="step"><b>Run it on the good ones.</b> It wrongly flags 2 %: 194 good units flagged.</div>
<div class="step"><b>Gather everything flagged.</b> 285 + 194 = 479 units in the flagged pile.</div>
<div class="step"><b>Ask the real question.</b> Of the 479 flagged, 285 are faulty: 285 ÷ 479 ≈ 59.5 %. Four flags in ten are false alarms.</div>
</div>

<div class="problem" data-problem="bayes-flag"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the strength of evidence depends on how surprising it would be if the claim were false, *and* on how likely the claim was to begin with.

**Equation:** `$P(A \mid B) = \dfrac{P(B \mid A)\,P(A)}{P(B \mid A)\,P(A) + P(B \mid \neg A)\,P(\neg A)}$`

**Odds form** (handy for quick sums): posterior odds = prior odds × likelihood ratio, with likelihood ratio `$P(B \mid A) / P(B \mid \neg A)$`. Here: prior odds 1 : 99, likelihood ratio 0.9 ÷ 0.05 = 18, posterior odds 18 : 99 ≈ 1 : 5.5, which is about 15 %.

**Analogy:** a smoke alarm that goes off whenever you make toast. It almost never misses a fire, but nearly every alarm you hear is toast, because toast is far more common than fire.
</details>

## 5. Worked example

*Made-up numbers.* A quality check flags 95 % of faulty units and wrongly flags 2 % of good units. 3 % of units are faulty. A unit is flagged. What's the chance it's faulty?

Per 10,000 units:

- Faulty: 300. Flagged: 0.95 × 300 = **285**.
- Good: 9,700. Wrongly flagged: 0.02 × 9,700 = **194**.
- All flagged: 285 + 194 = 479.
- P(faulty | flagged) = 285 ÷ 479 ≈ **59.5 %**.

So about 4 in 10 flagged units are fine. If scrapping a unit is expensive, add a second check on flagged units; the base rate among flagged units is now 59.5 %, so a second positive is far more convincing (try the sum: about 99 %).

## 6. Practice

1. A spam filter catches 98 % of spam and wrongly flags 1 % of real email. 20 % of email is spam. What share of flagged emails are spam?
2. Same filter, but only 1 % of email is spam. Recompute.
3. A vendor says their alert is "99 % accurate". What two extra numbers do you need before you trust a flag?

<details>
<summary>Answers</summary>

1. Per 1,000: spam 200, flagged 196; real 800, flagged 8. 196 ÷ 204 ≈ 96 %.
2. Spam 10, flagged 9.8; real 990, flagged 9.9. 9.8 ÷ 19.7 ≈ 50 %.
3. The base rate (how common the thing is where you will use it), and the separate sensitivity and false alarm rates. "Accuracy" can be 99 % for an alert that never flags anything, if the event is rare enough.
</details>

**Try it on your own data:** the [[probability-tree]] draws Bayes problems as branches; the confusion matrix in the ML course ([precision and recall](/learn/courses/ml-foundations/confusion-matrix/)) is the same table for model predictions.

**New words:** *sensitivity*, *false alarm (false positive) rate*, *precision*, *base rate*, *prior*, *likelihood*, *posterior*, *Bayes' rule*, *base-rate fallacy*.

<div class="keypoints">

- P(flag | fraud) and P(fraud | flag) are different numbers; reports often confuse them.
- Work Bayes with counts: imagine 10,000 cases and split them by the base rate first.
- Rare problems make false alarms common, even for accurate tests.
- Judge alerts and models by precision (share of flags that are real) as well as by accuracy.

</div>
