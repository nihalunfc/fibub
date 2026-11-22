---
title: 'Probability and conditional probability'
seoTitle: 'SAT probability and conditional probability, explained'
summary: 'Probability as favourable over possible, complements, independent events, expected counts and conditional probability from two-way tables, the SAT''s favourite version.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'P(rain) = 0.3. P(no rain) =?'
    choices: ['0.7', '0.3', '1.3']
    ans: 0
    why: 'Complements add to 1.'
  - q: 'A fair coin is tossed twice. P(two heads) =?'
    choices: ['1/4', '1/2', '1/3']
    ans: 0
    why: 'Independent events multiply: 1/2 × 1/2.'
  - q: '"Given that the person is a teen" tells you to:'
    choices: ['divide by the number of teens', 'divide by everyone', 'multiply by the number of teens']
    ans: 0
    why: 'The condition shrinks the group you are choosing from to the teens.'
sources:
  - 'College Board, SAT Math content domains: Problem-solving and data analysis (public test specifications) https://satsuite.collegeboard.org/digital'
  - 'fibub SAT question bank, probability (original questions) https://fibub.com/learn/courses/sat/probability/'
---

**Module 4 · about 15 minutes · read first: [4.4 Two-way tables](/learn/courses/sat/two-variable-data/).** By the end you will find any SAT probability by counting the right group.

<div class="bigidea">Probability = favourable outcomes ÷ possible outcomes, when every outcome is equally likely. Almost every SAT probability mistake is dividing by the wrong group.</div>

## 1. Counting

A bag has 5 red, 3 blue and 2 green marbles. P(blue) = 3 ÷ 10 = 0.3. Probabilities run from 0 (impossible) to 1 (certain).

<div class="problem" data-problem="pb-g01"></div>

## 2. Conditional probability: shrink the group

<div class="steps">
<div class="step">A survey: 40 adults like a menu and 20 do not; 30 teens like it and 10 do not. 100 people in all.</div>
<div class="step">P(a random person likes it) = (40 + 30) ÷ 100 = 0.7.</div>
<div class="step">"Given that the person is a teen": the group shrinks to the 40 teens.</div>
<div class="step">P(likes it, given teen) = 30 ÷ 40 = <b>0.75</b>. Same top number as before for teens, smaller bottom number.</div>
</div>

<div class="problem" data-problem="pb-g02"></div>

<div class="meaning">

<dl>
<dt>Complement</dt><dd>"not A"; P(not A) = 1 − P(A)</dd>
<dt>Independent</dt><dd>one result does not change the other's chances (two coin tosses); then P(A and B) = P(A) × P(B)</dd>
<dt>Conditional</dt><dd>"given that", "of those who", "among the": the group you divide by is only the people who meet the condition</dd>
<dt>Physical meaning</dt><dd>A probability of 0.02 means about 2 in every 100 in the long run: in 5,000 tries, expect about 100.</dd>
</dl>

</div>

## 3. Expected counts and independent events

<div class="problem" data-problem="pb-g03"></div>

<div class="problem" data-problem="pb-g04"></div>

<div class="myth">

**"After five tails, heads is due."** A fair coin has no memory: each toss is still 1/2. Long-run frequencies settle down because the number of tosses grows, not because the coin corrects itself.

</div>

**Try it:** Change the three probabilities and light up each event.

<figure class="fig" data-fig="@tp-prob-tree"><figcaption>Multiply down a path, add across paths; A given B is one leaf divided by the total of B's leaves.</figcaption></figure>

## Practice set

Ten questions on this lesson, from warm-up to hard, in the SAT's own formats (four options or a typed answer). Press New numbers for a fresh set; every question has a full worked solution.

<div class="qbank" data-bank="sat" data-topics="probability" data-exam="sat" data-n="10"></div>

<div class="keypoints">

- P = favourable ÷ possible (equally likely outcomes).
- P(not A) = 1 − P(A).
- Independent events: multiply.
- "Given", "of those", "among": divide by the size of that group only.

</div>
