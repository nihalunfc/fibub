---
title: Probability rules with pictures
summary: 'Probability as counting: the complement, "or" and "and" rules, independence and conditional probability, shown on a grid of 100 customers so every rule is something you can count.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: '30 % of customers buy coffee, 20 % buy a pastry and 10 % buy both. What share buy coffee or a pastry?'
    choices: ['50 %', '40 %', '60 %']
    ans: 1
    why: 'P(A or B) = P(A) + P(B) − P(A and B) = 30 + 20 − 10 = 40 %. Without subtracting, the 10 % who buy both would be counted twice.'
  - q: 'Using the same numbers, what is P(pastry | coffee), the chance a coffee buyer also buys a pastry?'
    choices: ['10 %', '20 %', 'About 33 %']
    ans: 2
    why: 'P(pastry | coffee) = P(both) ÷ P(coffee) = 10 ÷ 30 ≈ 33 %. Among coffee buyers, a third take a pastry: more than the 20 % of all customers, so the two go together.'
  - q: 'A website is down 1 % of the time and the payment provider is down 2 % of the time, independently. How often are both down at once?'
    choices: ['3 %', '0.02 %', '2 %']
    ans: 1
    why: 'For independent events, P(A and B) = P(A) × P(B) = 0.01 × 0.02 = 0.0002 = 0.02 %.'
sources:
  - 'OpenIntro Statistics, 4th edition (Diez, Cetinkaya-Rundel, Barr), Chapter 3 Probability https://www.openintro.org/book/os/'
  - 'Blitzstein, J. and Hwang, J. (2019), Introduction to Probability, 2nd edition, CRC Press, Chapters 1-2 https://projects.iq.harvard.edu/stat110'
---

**Module 2 · about 20 minutes · school maths.** You'll be able to use the complement, addition and multiplication rules, tell when events are independent, and compute a conditional probability.

<div class="bigidea">A probability is a share of all the possible cases, so every rule of probability is just careful counting.</div>

**In everyday terms:** picture 100 customers standing in a hall. "The chance a customer used a coupon" is how many of the 100 did. "The chance a coupon user returned the item" means: send everyone else out of the hall, then count again.

## 1. Probability is counting

A **probability** is a number from 0 (never) to 1 (always), often written as a percentage. For data, it is usually just a share: if 40 of 100 customers bought shoes, the probability a random customer bought shoes is 0.4. Every rule below is counting in disguise, so the grid below lets you count.

<!--fig:people-grid-->

## 2. The complement

```math
P(\text{not } A) = 1 - P(A)
```

If 4 % of orders are returned, 96 % are not. Often the complement is easier to work out: "at least one of these 5 servers fails" is 1 − P(none fail).

## 3. "Or": the addition rule

```math
P(A \text{ or } B) = P(A) + P(B) - P(A \text{ and } B)
```

Adding counts everyone in A and everyone in B, so people in both get counted twice; subtract them once. If A and B cannot happen together (**mutually exclusive**, like "paid by card" and "paid by cash" for a single payment), the overlap is 0 and you just add.

## 4. "Given": conditional probability

`$P(B \mid A)$`, read "probability of B given A", restricts attention to the cases where A happened:

```math
P(B \mid A) = \frac{P(A \text{ and } B)}{P(A)}
```

On the grid: look only at the shoe buyers and count what share also bought socks. Analysts use conditional probabilities constantly, usually without the name: conversion rate *given* mobile, churn rate *given* a complaint, return rate *given* a discount.

Order matters: `$P(\text{socks} \mid \text{shoes})$` and `$P(\text{shoes} \mid \text{socks})$` are different numbers. Mixing them up is a famous error, and Lesson 2.2 is about it.

## 5. "And": the multiplication rule and independence

Rearranging the definition gives

```math
P(A \text{ and } B) = P(A) \times P(B \mid A)
```

Two events are **independent** when knowing one tells you nothing about the other: `$P(B \mid A) = P(B)$`. Then the rule simplifies to `$P(A \text{ and } B) = P(A) \times P(B)$`. Coin flips are independent. Customer purchases usually are not: people who buy shoes are more likely to buy socks. That dependence is exactly what **market basket analysis** ("customers who bought this also bought...") measures, and its "lift" is

```math
\text{lift} = \frac{P(A \text{ and } B)}{P(A)\,P(B)}
```

Lift above 1 means the items go together.

<div class="meaning">

<dl>
<dt>P(A)</dt><dd>Share of all cases where A happens, from 0 (never) to 1 (always).</dd>
<dt>P(not A) = 1 − P(A)</dt><dd>The complement: everything that is not A.</dd>
<dt>P(A or B) = P(A) + P(B) − P(A and B)</dt><dd>Add, but take away the overlap you counted twice.</dd>
<dt>P(A | B)</dt><dd>"A given B": the share of the B cases that are also A. The bar means "only look at B".</dd>
<dt>Independent</dt><dd>Knowing B tells you nothing about A: P(A | B) = P(A).</dd>
<dt>Physical meaning</dt><dd>Conditioning is zooming in. P(returned | discount) zooms in on discounted orders only and asks what share of that smaller crowd came back.</dd>
</dl>

</div>

<div class="myth">

**"P(A | B) and P(B | A) are the same thing."** The share of discounted orders that were returned (90 of 600 = 15 %) is not the share of returned orders that had a discount (90 of 150 = 60 %). Always ask: out of which group?

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The table.</b> 2,000 orders: 600 used a discount, 150 were returned, and 90 did both.</div>
<div class="step"><b>Complement.</b> P(kept) = 1 − 150/2,000 = 1 − 0.075 = 0.925.</div>
<div class="step"><b>Or.</b> P(discount or returned) = 600/2,000 + 150/2,000 − 90/2,000 = 660/2,000 = 0.33. The 90 would be counted twice without the subtraction.</div>
<div class="step"><b>Given.</b> Zoom in on the 600 discounted orders: 90 were returned, so P(returned | discount) = 0.15.</div>
<div class="step"><b>Compare.</b> Without a discount: 60 of 1,400 ≈ 0.043. Discounted orders come back about 3.5 times as often, so the two are not independent.</div>
</div>

<div class="problem" data-problem="probability-given"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** probabilities of overlapping events cannot simply be added or multiplied; you must account for the overlap, or for how one event changes the other.

**Equations:** complement `$1 - P(A)$`; or `$P(A) + P(B) - P(A \cap B)$`; given `$P(B \mid A) = P(A \cap B)/P(A)$`; and `$P(A)\,P(B \mid A)$`. (`$\cap$` means "and", `$\cup$` means "or".)

**Analogy:** P(B | A) is like filtering a table to the rows where A is true, then computing the share of B. It is literally a SQL `WHERE` followed by an average.
</details>

## 6. Worked example

*Made-up numbers.* An online shop's 2,000 orders last month:

| | Used a discount | No discount | Total |
|---|---|---|---|
| Returned | 90 | 60 | 150 |
| Kept | 510 | 1,340 | 1,850 |
| Total | 600 | 1,400 | 2,000 |

- P(returned) = 150 ÷ 2,000 = **7.5 %**.
- P(returned | discount) = 90 ÷ 600 = **15 %**. P(returned | no discount) = 60 ÷ 1,400 ≈ **4.3 %**.
- These differ a lot, so returns and discounts are **not independent**. Discount orders come back about 3.5 times as often.
- P(discount or returned) = 600/2,000 + 150/2,000 − 90/2,000 = 660 ÷ 2,000 = **33 %**.

Whether discounts *cause* returns is a different question (Lesson 8.3); the table only shows they go together.

## 7. Practice

1. 5 % of parcels are damaged. What is P(not damaged)?
2. Two independent servers each fail on 2 % of days. What is the chance at least one fails on a given day?
3. 60 % of visitors are on mobile; 3 % of mobile visitors buy. What share of all visitors are mobile buyers?

<details>
<summary>Answers</summary>

1. 95 %.
2. 1 − P(neither fails) = 1 − 0.98 × 0.98 = 1 − 0.9604 = 3.96 %.
3. P(mobile and buy) = 0.6 × 0.03 = 1.8 %.
</details>

**Try it on your own data:** the [[probability-tree]] draws "and" and "given" as branches, the [[sample-space]] builder counts outcomes for dice and cards, and [[crosstab-chi-square]] builds a table like the one above from a CSV.

**New words:** *probability*, *complement*, *mutually exclusive*, *conditional probability*, *independent*, *lift*.

<div class="keypoints">

- Probability = favourable cases ÷ all cases; a two-way table of counts makes every rule visible.
- Complement: P(not A) = 1 − P(A).
- Or: add, then subtract the overlap.
- Given: divide by the size of the group you are looking inside; P(A | B) ≠ P(B | A).
- Independent events: P(A and B) = P(A) × P(B).

</div>
