---
title: 'Linear functions: slope, intercept and graphs'
seoTitle: 'SAT linear functions: slope, intercepts and graphs'
summary: 'What slope and y-intercept really mean, how to find the equation of a line from two points or a table, parallel and perpendicular lines, and how the SAT asks about them.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'What is the slope of the line through (1, 4) and (3, 10)?'
    choices: ['3', '1/3', '6']
    ans: 0
    why: 'Slope = (10 − 4) ÷ (3 − 1) = 6 ÷ 2 = 3.'
  - q: 'In C = 15 + 8h (the cost of h hours of bike hire), what does 8 mean?'
    choices: ['Each extra hour costs $8', 'The hire starts at $8', 'You can hire for 8 hours']
    ans: 0
    why: '8 is the slope: the cost goes up by 8 for each hour. 15 is the fixed starting cost.'
  - q: 'A line has slope 2/3. What is the slope of a line perpendicular to it?'
    choices: ['−3/2', '2/3', '3/2']
    ans: 0
    why: 'Perpendicular slopes multiply to −1: flip the fraction and change its sign.'
sources:
  - 'College Board, SAT Math content domains: Algebra (public test specifications) https://satsuite.collegeboard.org/digital'
  - 'fibub SAT question bank, linear functions (original questions) https://fibub.com/learn/courses/sat/linear-functions/'
---

**Module 2 · about 20 minutes · read first: [2.1](/learn/courses/sat/linear-equations/).** By the end you will read slope and intercept straight off an equation, a graph or a table, and write the equation of any line.

<div class="bigidea">A linear function changes by the same amount every step. That fixed amount is the slope; the starting value is the y-intercept. Together they are the whole line: y = mx + b.</div>

## 1. Slope and intercept, in everyday words

A taxi ride costs $3 to start plus $2 per mile. After 0 miles it is $3, after 1 mile $5, after 2 miles $7. Each mile adds the same $2, so the graph is a straight line:

- **y-intercept (b)** = 3: the value when x = 0, where the line crosses the y-axis.
- **slope (m)** = 2: how much y changes when x goes up by 1, the "rise over run".

Drag the sliders. Watch the dashed triangle: the run is the step to the right, the rise is how far the line climbs (or falls) in that step.

<figure class="fig" data-fig="graph" data-mode="line" data-m="2" data-b="1"><figcaption>y = mx + b. A positive slope rises left to right, a negative slope falls, zero is flat. The dots mark where the line crosses the y-axis (the intercept b) and the x-axis.</figcaption></figure>

```math
m = \frac{y_2 - y_1}{x_2 - x_1}
```

<div class="meaning">

<dl>
<dt>m</dt><dd>slope: change in y for each step of 1 in x (rise ÷ run)</dd>
<dt>b</dt><dd>y-intercept: the value of y when x = 0</dd>
<dt>(x₁, y₁), (x₂, y₂)</dt><dd>any two points on the line</dd>
<dt>Physical meaning</dt><dd>In a real-world model, m is a rate (dollars per hour, litres per minute) and b is a starting amount (a fee, a starting level). Most SAT "interpret" questions ask exactly that.</dd>
</dl>

</div>

<div class="problem" data-problem="lf-g01"></div>

## 2. Writing the equation of a line

<div class="steps">
<div class="step"><b>Question:</b> a line passes through (2, 7) and (6, 15). What is its equation?</div>
<div class="step"><b>Slope first.</b> m = (15 − 7) ÷ (6 − 2) = 8 ÷ 4 = 2.</div>
<div class="step"><b>Intercept next.</b> Put one point into y = 2x + b: 7 = 2(2) + b, so b = 3.</div>
<div class="step"><b>Answer:</b> y = 2x + 3. Check the other point: 2(6) + 3 = 15. ✓</div>
</div>

<div class="problem" data-problem="lf-g02"></div>

From a **table**, work out the slope from any two rows, but watch the step size: if x goes up by 2 each row and y goes up by 6, the slope is 6 ÷ 2 = 3, not 6. In **function notation**, f(3) = 11 just means the point (3, 11) is on the line.

<div class="problem" data-problem="lf-g03"></div>

## 3. Other forms of a line

- **Standard form** Ax + By = C, like 2x + 3y = 12. To get the slope, solve for y: y = −(2/3)x + 4. Shortcut: slope = −A/B.
- **x-intercept**: set y = 0 and solve. For 2x + 3y = 12, x = 6.

<div class="problem" data-problem="lf-g07"></div>

## 4. Parallel and perpendicular

- **Parallel** lines never meet: **same slope**, different intercepts.
- **Perpendicular** lines cross at a right angle: slopes multiply to −1. Flip the fraction and change the sign: 3/4 becomes −4/3, and −2 becomes 1/2.

<div class="problem" data-problem="lf-g05"></div>

<div class="myth">

**"The slope is the number in front of x, so in 4x + 2y = 10 the slope is 4."** That rule only works when the equation is y = mx + b. Here y = −2x + 5, so the slope is −2. Always get y alone first (or use −A/B).

</div>

## 5. How the SAT asks it

- Slope or intercept from two points, a table, a graph or a word problem.
- "What is the best interpretation of 8 in this model?" → the rate per unit (slope) or the starting amount (intercept).
- Which equation matches a graph: check the sign of the slope (up or down) and where it crosses the y-axis.
- Parallel or perpendicular slopes, or a line shifted up or down (adding k to the whole function moves it up k).

**Try it:** Drag A and B and read the distance, midpoint and slope.

<figure class="fig" data-fig="@tp-coord-points"><figcaption>The dashed legs form a right triangle; the distance is its hypotenuse.</figcaption></figure>

## Practice set

Ten questions on this lesson, from warm-up to hard, in the SAT's own formats (four options or a typed answer). Press New numbers for a fresh set; every question has a full worked solution.

<div class="qbank" data-bank="sat" data-topics="linear-functions" data-exam="sat" data-n="10"></div>

<div class="keypoints">

- y = mx + b: m is the change per step (rise ÷ run), b is the value at x = 0.
- Slope from two points: (y₂ − y₁) ÷ (x₂ − x₁), subtracting in the same order on top and bottom.
- Get y alone before reading the slope; for Ax + By = C the slope is −A/B.
- Parallel: equal slopes. Perpendicular: slopes multiply to −1.
- In models, slope is a rate and the intercept is a starting amount.

</div>
