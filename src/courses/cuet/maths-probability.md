---
title: 'Maths: probability'
seoTitle: 'Probability for CUET Maths: Bayes, random variables'
summary: 'Conditional probability, the multiplication rule and independence, total probability and Bayes'' theorem, random variables with mean and variance, with a live Bayes problem.'
minutes: 22
updated: 2026-11-22
quiz:
  - q: 'If P(A) = 0.4, P(B) = 0.5 and A, B are independent, P(A ∩ B) is:'
    choices: ['0.2', '0.9', '0.1']
    ans: 0
    why: 'Independent means P(A ∩ B) = P(A)P(B) = 0.4 × 0.5.'
  - q: 'P(A | B) is defined as:'
    choices: ['P(A ∩ B)/P(B)', 'P(A ∩ B)/P(A)', 'P(A)P(B)']
    ans: 0
    why: 'Knowing B happened shrinks the sample space to B; A must happen inside it.'
  - q: 'A random variable X takes 0 and 1 with probabilities 0.3 and 0.7. E(X) is:'
    choices: ['0.7', '0.5', '0.3']
    ans: 0
    why: 'E(X) = 0 × 0.3 + 1 × 0.7 = 0.7.'
sources:
  - 'NCERT, Mathematics Part II (Class 12), Probability'
  - 'National Testing Agency, CUET (UG) Mathematics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 8 · about 22 minutes.** By the end you will handle conditional probability, Bayes' theorem and the mean and variance of a random variable.

<div class="bigidea">Conditional probability updates a chance once you learn something. Bayes' theorem runs it backwards: from "how likely is the evidence if the cause is true" to "how likely is the cause, now that I have seen the evidence".</div>

**Everyday picture:** a medical test that is 99% accurate for a disease only 1 in 1,000 people have. If you test positive, the chance you have the disease is still only about 9%, because false positives from the 999 healthy people outnumber the one true case. Bayes' theorem is how you see this.

## 1. Conditional probability and independence

```math
P(A\mid B) = \frac{P(A\cap B)}{P(B)} \qquad P(A\cap B) = P(A)\,P(B\mid A) \qquad \text{independent} \iff P(A\cap B) = P(A)P(B)
```

## 2. Total probability and Bayes

<div class="steps" data-title="Bayes in four steps">
<div class="step"><b>List the causes</b> E₁, E₂, ... that cover all cases and do not overlap (machines A and B).</div>
<div class="step"><b>Write priors and likelihoods:</b> P(Eᵢ) and P(evidence | Eᵢ).</div>
<div class="step"><b>Total probability:</b> P(evidence) = Σ P(Eᵢ)P(evidence | Eᵢ).</div>
<div class="step"><b>Bayes:</b> P(Eᵢ | evidence) = P(Eᵢ)P(evidence | Eᵢ) ÷ P(evidence).</div>
</div>

<div class="problem" data-problem="bayes"></div>

## 3. Random variables

| Idea | Formula |
|---|---|
| Probability distribution | list of values xᵢ with P(xᵢ), all adding to 1 |
| Mean (expectation) | E(X) = Σ xᵢ pᵢ |
| Variance | Var(X) = E(X²) − [E(X)]² |
| Standard deviation | √Var(X) |

<div class="meaning">

<dl>
<dt>E(X)</dt><dd>the long-run average if you repeated the experiment many times. A fair die has E = 3.5, a value it never shows.</dd>
<dt>Var(X)</dt><dd>how spread out the outcomes are around the mean.</dd>
<dt>Mutually exclusive vs independent</dt><dd>exclusive events cannot happen together (P(A ∩ B) = 0); independent events do not affect each other. Two events with non-zero probability cannot be both.</dd>
</dl>

</div>

<div class="myth">

**"After five heads, tails is due."** Coin tosses are independent; the coin has no memory. The chance of tails on the next toss is still ½.

</div>

## 4. Practice

<div class="qbank" data-bank="entrance-maths" data-topics="probability" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- P(A|B) = P(A ∩ B)/P(B).
- Independent: P(A ∩ B) = P(A)P(B).
- Total probability, then Bayes: prior × likelihood ÷ total.
- E(X) = Σxp; Var = E(X²) − E(X)².

</div>
