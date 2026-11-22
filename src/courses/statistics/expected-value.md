---
title: 'Expected value: is the promotion worth it?'
summary: 'Expected value as the long-run average of a chancy decision: coupons, warranties, stock levels and lead scoring. How to compute it, why its standard deviation matters too, and the law of large numbers that makes it work.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'A lead converts with probability 0.2 and is worth $500 if it does. What is its expected value?'
    choices: ['$500', '$100', '$20']
    ans: 1
    why: 'EV = 0.2 × $500 + 0.8 × $0 = $100. That is what each such lead is worth on average over many leads.'
  - q: 'Why can a decision with positive expected value still lose money?'
    choices: ['Expected value is often calculated wrong', 'EV is a long-run average; any single try, or a short run, can land well below it', 'Positive EV always makes money']
    ans: 1
    why: 'EV describes the average over many repetitions. A small number of tries can easily come out badly, which is why the spread (SD) of the outcome matters too.'
  - q: 'An extended warranty costs $40. The chance of a $300 repair is 8 %. What is the expected value of buying it, for the customer?'
    choices: ['+$24', '−$16', '+$40']
    ans: 1
    why: 'Expected payout = 0.08 × $300 = $24, minus the $40 price = −$16. The seller expects to keep $16 per warranty on average.'
sources:
  - 'OpenIntro Statistics, 4th edition (Diez, Cetinkaya-Rundel, Barr), Section 3.4 Random variables (expectation) https://www.openintro.org/book/os/'
  - 'Blitzstein, J. and Hwang, J. (2019), Introduction to Probability, 2nd edition, Chapter 4 Expectation https://projects.iq.harvard.edu/stat110'
---

**Module 2 · about 20 minutes · school maths.** You'll be able to compute expected value and its standard deviation, use them to compare business options, and explain why the long run matters.

<div class="bigidea">The expected value is what a chancy choice pays per try on average over many tries, so it is the number to compare options with when you will repeat the choice.</div>

**In everyday terms:** a coin game that pays $3 on heads and nothing on tails is worth $1.50 a go in the long run. You never win $1.50 on a single toss, yet after 1,000 tosses you will have close to $1,500.

## 1. Deciding under chance

Many business choices are bets: send a coupon or not, stock 50 units or 80, chase this lead or that one. Each option has several possible outcomes with different chances. **Expected value (EV)** turns each option into one number: what it pays **on average**, if you made the same choice many times.

## 2. The formula

Multiply each outcome by its probability and add:

```math
E[X] = \sum_i x_i \, p_i
```

A lead worth $500 that converts 20 % of the time has EV = 0.2 × 500 + 0.8 × 0 = $100. If a sales rep has 50 such leads, expect about 50 × $100 = $5,000.

EV is the mean of a random variable (Lesson 3.1 makes that precise), so it shares the mean's strength: **EVs add up**. The EV of a portfolio of leads, campaigns or products is the sum of their EVs.

## 3. Run it many times

<!--fig:ev-sim-->

With a few hundred customers, the line for the worse option can sit above the better one for a while. Only over thousands of customers does each line settle on its EV. This is the **law of large numbers**, and it is why EV is the right guide for decisions you repeat often (pricing, promotions, credit limits) and a weaker guide for one-off bets.

## 4. Spread matters too

Two options can share an EV and carry very different risk. The **standard deviation** of the outcome measures that:

```math
\text{SD}(X) = \sqrt{\sum_i p_i\,(x_i - E[X])^2}
```

A $100 sure payment and a 1 % chance of $10,000 both have EV $100, but the second is far riskier. Businesses that cannot survive a bad run (small firms, tight cash flow) should weigh the SD, not just the EV.

<div class="meaning">

<dl>
<dt>Outcomes x</dt><dd>The possible results, in money or units.</dd>
<dt>Probabilities p</dt><dd>How likely each result is; they add up to 1.</dd>
<dt>E[X] = Σ p·x</dt><dd>Weight each result by its chance and add up: the long-run average per try.</dd>
<dt>SD of X</dt><dd>How far a single try usually lands from E[X]: the risk.</dd>
<dt>Physical meaning</dt><dd>Expected value is the balance point of all the possible outcomes, each weighted by how often it happens. Businesses that repeat a decision thousands of times (coupons, warranties, stock) live on that average; a person making the choice once also cares about the spread.</dd>
</dl>

</div>

<div class="myth">

**"The expected value is the most likely result."** A $10 coupon with an EV of $2.40 per customer never pays $2.40 to anyone: each customer gives $30 or $0. EV is a long-run average, not a typical single outcome.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The choice.</b> Send a $10-off coupon or not? Each sale makes $40 profit before any discount.</div>
<div class="step"><b>No coupon.</b> 5 % buy. EV per customer = 0.05 × $40 = $2.00.</div>
<div class="step"><b>Coupon.</b> 8 % buy, but each sale now makes $30. EV = 0.08 × $30 = $2.40.</div>
<div class="step"><b>Scale up.</b> To 10,000 customers: $20,000 against $24,000. The coupon wins by $4,000.</div>
<div class="step"><b>Check the assumptions.</b> Would some of the 8 % have bought anyway at full price? That "cannibalisation" is the first thing to test (Module 7).</div>
</div>

<div class="problem" data-problem="expected-value-coupon"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the expected value is the probability-weighted average outcome. Over many independent repetitions, the average result gets closer and closer to it.

**Equations:** `$E[X] = \sum x_i p_i$`; `$\text{Var}(X) = \sum p_i (x_i - E[X])^2$`; for n independent repeats, total EV is `$n\,E[X]$` and the SD of the total is `$\sqrt{n}\,\text{SD}(X)$`. The total's spread grows only like `$\sqrt{n}$` while the EV grows like `$n$`, so the result becomes predictable as a *share* of the total.

**Analogy:** an insurer cannot predict whose house will burn, but with a million policies it can predict the total claims within a few percent.
</details>

## 5. Worked example

*Made-up numbers.* Should a shop send a $10-off coupon? Each sale makes $40 profit before any discount.

| Option | Buy rate | Profit per sale | EV per customer |
|---|---|---|---|
| No coupon | 5 % | $40 | 0.05 × 40 = **$2.00** |
| Coupon | 8 % | $40 − $10 = $30 | 0.08 × 30 = **$2.40** |

The coupon wins by $0.40 per customer: on 50,000 customers, about $20,000. But the result is sensitive: at a 6.5 % buy rate with the coupon, EV = 0.065 × 30 = $1.95, and it loses. You would need a test (Module 7) to know the real buy rate before rolling it out.

**Hidden costs:** this EV ignores customers who would have bought anyway but now use the coupon. That is exactly why "no coupon" sales are counted at full profit: always compare against what would have happened without the change.

## 6. Practice

1. A raffle sells 1,000 tickets at $5 for one $2,000 prize. What is a ticket's EV?
2. A store can stock 60 units (profit $300 if demand is high, chance 0.3; $200 if normal, 0.5; −$50 if low, 0.2). What is the EV?
3. Option A: $50 for sure. Option B: 50 % chance of $0 and 50 % of $100. Same EV? Which has the bigger SD?

<details>
<summary>Answers</summary>

1. 0.001 × 2,000 − 5 = 2 − 5 = −$3 per ticket.
2. 0.3 × 300 + 0.5 × 200 + 0.2 × (−50) = 90 + 100 − 10 = $180.
3. Both $50. A has SD 0; B has SD 50 (each outcome is 50 from the mean).
</details>

**Try it on your own data:** the [[probability-tree]] works out the expected value of a decision with several stages.

**New words:** *expected value*, *payoff*, *law of large numbers*, *risk*, *standard deviation of an outcome*.

<div class="keypoints">

- E[X] = sum of (outcome × probability): the long-run average per try.
- Compare options by EV when the decision is repeated many times.
- The SD of the outcome measures risk; two options with equal EV can differ a lot in it.
- The law of large numbers: the average of many tries settles near the EV.

</div>
