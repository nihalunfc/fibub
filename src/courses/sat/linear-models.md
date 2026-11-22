---
title: 'Turning word problems into linear models'
seoTitle: 'SAT linear models: word problems, tables and meaning'
summary: 'Build linear models from words, tables and graphs, find rates of change and starting values, compare two plans, and answer the SAT''s favourite "what does this number mean" questions.'
minutes: 18
updated: 2026-11-22
quiz:
  - q: 'A tank holds 500 litres and drains 20 litres per minute. Which model gives the litres left after t minutes?'
    choices: ['L = 500 − 20t', 'L = 20 − 500t', 'L = 500 + 20t']
    ans: 0
    why: 'Start at 500 and lose 20 for every minute.'
  - q: 'Plan A: $40 fee + $10 a month. Plan B: $18 a month, no fee. After how many months are they equal?'
    choices: ['5', '4', '8']
    ans: 0
    why: '40 + 10m = 18m gives 40 = 8m, so m = 5.'
  - q: 'In P = 1,200 + 35w, what does 1,200 mean?'
    choices: ['The value when w = 0 (the start)', 'The change each week', 'The value after 35 weeks']
    ans: 0
    why: 'The number on its own is the starting value; the number multiplying w is the rate.'
sources:
  - 'College Board, SAT Math content domains: Algebra (public test specifications) https://satsuite.collegeboard.org/digital'
  - 'fibub SAT question bank, linear models (original questions) https://fibub.com/learn/courses/sat/linear-models/'
---

**Module 2 · about 18 minutes · read first: [2.2](/learn/courses/sat/linear-functions/), [2.3](/learn/courses/sat/systems-of-equations/).** By the end you will turn a real situation into a linear model, use it, and explain what each number in it means.

<div class="bigidea">Any situation where something changes by the same amount each step is a line: value = start + rate × steps. Find the start and the rate, and the model writes itself.</div>

## 1. Start and rate

A phone has 85% battery and loses 4% every hour of video. After h hours: B = 85 − 4h. The two numbers have meanings the SAT will ask about:

- **85** is the value at h = 0, the start.
- **−4** is the change per hour, the rate (negative because it goes down).

<figure class="fig" data-fig="graph" data-mode="line" data-m="-1" data-b="6"><figcaption>A falling line is a decreasing model: the slope is the amount lost each step, the y-intercept is where it starts.</figcaption></figure>

<div class="meaning">

<dl>
<dt>Start (intercept)</dt><dd>the value before anything happens: a fee, a first reading, a full tank</dd>
<dt>Rate (slope)</dt><dd>the change for each one unit of the input: per hour, per item, per mile; its units are "output per input"</dd>
<dt>Physical meaning</dt><dd>If the rate's units read "dollars per hour", the number goes in front of the hours. Checking units is the quickest way to spot the right model among four options.</dd>
</dl>

</div>

## 2. Models from a table

| Week | 0 | 3 | 6 | 9 |
|---|---|---|---|---|
| Savings ($) | 150 | 240 | 330 | 420 |

Each row adds 3 weeks and $90, so the rate is 90 ÷ 3 = $30 per week. The start (week 0) is 150. Model: S = 150 + 30w.

<div class="problem" data-problem="lm-g01"></div>

## 3. Comparing two plans

"When are they equal?" means set the two models equal and solve. "When is A cheaper?" means solve an inequality.

<div class="steps">
<div class="step">Gym A: $60 joining fee + $25 a month. Gym B: no fee, $35 a month.</div>
<div class="step">Costs after m months: A = 60 + 25m, B = 35m.</div>
<div class="step">Equal when 60 + 25m = 35m → 60 = 10m → <b>m = 6</b>.</div>
<div class="step">After 6 months A's lower monthly price wins: A is cheaper for anyone staying more than 6 months.</div>
</div>

<div class="problem" data-problem="lm-g02"></div>

## 4. Using a model

Once you have the model, questions ask for the value at some time ("how much is left after 12 minutes?") or the time for some value ("when is the pool empty?" means set the value to 0).

<div class="problem" data-problem="lm-g03"></div>

<div class="myth">

**"The number in front of the letter is always the starting amount."** It is the opposite: the number multiplying the letter is the <i>rate</i>. The lone number is the start. In C = 12h + 30, the hourly charge is $12 and the fixed fee is $30.

</div>

## 5. How the SAT asks it

- "What is the best interpretation of ... in this context?" (start or rate, with units).
- Choose the model from words or a table.
- When two models are equal, or when one passes the other.
- Predict a value, or the input that gives a value.

## Practice set

Ten questions on this lesson, from warm-up to hard, in the SAT's own formats (four options or a typed answer). Press New numbers for a fresh set; every question has a full worked solution.

<div class="qbank" data-bank="sat" data-topics="linear-models" data-exam="sat" data-n="10"></div>

<div class="keypoints">

- A linear model is value = start + rate × input.
- The lone number is the starting value; the number times the input is the rate per unit.
- From a table, rate = change in output ÷ change in input (watch the step size).
- "When equal" means set two models equal; "empty" or "zero" means set the value to 0.

</div>
