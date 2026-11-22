---
title: Functions, slopes and straight lines
summary: 'A function turns an input into an output, and a straight line is the simplest one: y = mx + c. Drag two points to see slope and intercept, the two numbers every linear model learns.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'A line passes through (1, 3) and (4, 9). What is its slope?'
    choices: ['2', '3', '6']
    ans: 0
    why: Rise ÷ run = (9 − 3) ÷ (4 − 1) = 6 ÷ 3 = 2.
  - q: 'For y = 2x + 5, what does the 5 mean?'
    choices: ['The line rises 5 for each step of 1 in x', 'y is 5 when x is 0 (where the line crosses the y-axis)', 'The line ends at x = 5']
    ans: 1
    why: The intercept c is the value of y when x = 0.
  - q: 'A taxi charges $3 to start and $2 per km. Which line gives the fare y for x km?'
    choices: ['y = 3x + 2', 'y = 2x + 3', 'y = 5x']
    ans: 1
    why: The fare grows by 2 per km (slope 2) and starts at 3 when x = 0 (intercept 3).
sources:
  - 'Strang, G. (2016), Introduction to Linear Algebra, 5th ed., Wellesley-Cambridge Press, Chapter 1'
  - 'James, G., Witten, D., Hastie, T., Tibshirani, R. and Taylor, J. (2023), An Introduction to Statistical Learning with Applications in Python, Springer, Chapter 3 (simple linear regression) https://www.statlearning.com/'
  - 'Goodfellow, I., Bengio, Y. and Courville, A. (2016), Deep Learning, MIT Press, Section 5.1.4 (linear regression as w·x + b) https://www.deeplearningbook.org/'
---

**Module 1 · about 20 minutes · school maths.** You'll be able to read and write the equation of a straight line, work out a slope from two points, and say what slope and intercept mean in a real problem.

<div class="bigidea">A straight line is a starting value plus a steady rate: y = mx + c. Two numbers, and every linear model learns exactly these two.</div>

## 1. Why this matters

The first model in this course, linear regression (Module 3), is a straight line. Logistic regression (Module 4) bends a straight line into an S. Each neuron in a neural network (Module 9) starts with a straight-line sum. If you are at home with `$y = mx + c$`, you already understand the core of all three.

## 2. A function is a rule from input to output

A **function** is like a vending machine: you put one thing in, and exactly one thing comes out. We write `$y = f(x)$` and say "y is f of x". Here `$x$` is the input, `$f$` is the rule and `$y$` is the output. Examples:

- Taxi fare from distance: `$f(x) = 2x + 3$` (dollars, for `$x$` km).
- Area of a square from its side: `$f(x) = x^2$`.
- A trained model from a home's floor area to its predicted price.

A **graph** shows every input along the flat x-axis and its output up the tall y-axis.

## 3. The straight line

A straight line has the form

```math
y = m x + c
```

- `$m$` is the **slope** (also called the gradient): how much `$y$` goes up when `$x$` goes up by 1.
- `$c$` is the **intercept**: the value of `$y$` when `$x = 0$`, where the line crosses the y-axis.

Think of a phone plan: a fixed monthly fee (the intercept) plus a price per gigabyte (the slope). Use no data and you still pay the fee; each gigabyte adds the same amount.

Drag the two points below. The triangle shows the **rise** (how far up) and the **run** (how far across).

<!--fig:slope-explorer-->

Things to notice:

- Make the line flatter: the slope gets closer to 0. A flat line means x makes no difference to y.
- Make it go down to the right: the slope turns negative.
- Line the two points up vertically: the run is 0 and the slope can't be worked out (you would divide by zero).

## 4. Slope from two points

For two points `$(x_1, y_1)$` and `$(x_2, y_2)$` on the line:

```math
m = \frac{\text{rise}}{\text{run}} = \frac{y_2 - y_1}{x_2 - x_1}, \qquad c = y_1 - m\,x_1
```

The second formula comes from putting one point into `$y = mx + c$` and solving for `$c$`. Watch it with a courier's two trips:

<div class="steps">
<div class="step"><b>Two facts.</b> A 4 km trip took 17 minutes. A 10 km trip took 35 minutes. The points are (4, 17) and (10, 35).</div>
<div class="step"><b>Rise and run.</b> From the first trip to the second, time rose by 35 − 17 = 18 minutes, while distance ran 10 − 4 = 6 km.</div>
<div class="step"><b>Slope.</b> m = 18 ÷ 6 = 3 minutes per km. Each extra kilometre adds 3 minutes.</div>
<div class="step"><b>Intercept.</b> c = 17 − 3 × 4 = 5 minutes. That is the time a 0 km trip would take: loading and parking.</div>
<div class="step"><b>Use the line.</b> time = 3 × km + 5. A 7 km trip: 3 × 7 + 5 = 26 minutes.</div>
</div>

<div class="problem" data-problem="functions-and-slopes-predict"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a straight line changes at a constant rate. Its slope is the same between any two of its points.

**Equation:** `$y = mx + c$`, with `$m = \dfrac{y_2 - y_1}{x_2 - x_1}$` and `$c = y_1 - m x_1$`.

**In machine learning notation:** the same line is usually written `$\hat y = w x + b$`. The slope becomes a **weight** `$w$` (how much this input matters) and the intercept a **bias** `$b$` (the starting value). With many inputs it becomes `$\hat y = w_1 x_1 + w_2 x_2 + \dots + w_d x_d + b$`, which Lesson 1.4 writes in one short line with a dot product.

**Analogy:** a phone plan: a fixed monthly fee (the intercept) plus a price per gigabyte (the slope).

**Try it:** a line passes through (2, 7) and (6, 15). Find `$m$` and `$c$`. (`$m = (15-7)/(6-2) = 2$`; `$c = 7 - 2 \times 2 = 3$`; so `$y = 2x + 3$`.)
</details>

<div class="meaning">

<dl>
<dt>m or w (slope, weight)</dt><dd>How much the output changes for each one-unit step in the input. It has units: output units per input unit.</dd>
<dt>c or b (intercept, bias)</dt><dd>The output when the input is 0: where the line starts.</dd>
<dt>Rise ÷ run</dt><dd>How far up divided by how far across, between any two points on the line.</dd>
<dt>Physical meaning</dt><dd>A slope is a rate you can feel: dollars per kilometre, minutes per stop, $1,000s per square metre. A steep slope means the input matters a lot; a flat one means it hardly matters at all.</dd>
</dl>

</div>

## 5. Reading a slope in the real world

The slope always has **units**: units of y per unit of x.

- A price model with slope 3.1, where x is floor area in m² and y is price in $000, says each extra square metre adds about $3,100.
- A slope of −1.5 for a used car's value in $000 against its age in years says it loses about $1,500 a year. It is negative because the value goes down as age goes up.

<div class="myth">

**"The intercept always means something real."** Not always. A price model may say a flat of 0 m² costs $90,000, but nobody sells a flat with no floor. The intercept is just where the line has to start so that it fits the data that does exist. Only read meaning into it when x = 0 is a sensible case, as with the courier's loading time.

</div>

## 6. Curves are not straight, but up close they almost are

Most functions are curves, such as `$y = x^2$`. A curve has no single slope: it is steeper in some places than others. But zoom in far enough on any smooth curve and the piece you see looks straight, just as the Earth looks flat from where you stand. The slope of that tiny straight piece is the **derivative**, the idea in Lesson 1.5, and the tool that lets models learn.

## 7. Worked example

*Made-up numbers.* A delivery firm notes that a 4 km trip took 17 minutes and a 10 km trip took 35 minutes. Assuming a straight line:

- Slope: `$m = (35 - 17) / (10 - 4) = 18 / 6 = 3$` minutes per km.
- Intercept: `$c = 17 - 3 \times 4 = 5$` minutes (time for loading and parking, before any driving).
- Model: time = 3 × km + 5. A 7 km trip: 3 × 7 + 5 = 26 minutes.

With only two points the line goes through both exactly. With 200 real trips the points scatter and no line hits them all. Finding the best line through many points is Lesson 3.2.

## 8. Practice

1. Find the line through (0, 4) and (5, 14).
2. A line has slope −2 and passes through (3, 1). What is `$y$` at `$x = 5$`?
3. In `$\hat y = 0.4x + 12$`, x is hours of sunshine and `$\hat y$` is ice creams sold (hundreds). What does 0.4 mean?

<details>
<summary>Answers</summary>

1. `$m = (14-4)/(5-0) = 2$`, `$c = 4$`: `$y = 2x + 4$`.
2. From x = 3 to 5 is a run of 2, so the rise is −2 × 2 = −4: y = 1 − 4 = −3.
3. Each extra hour of sunshine goes with about 40 more ice creams.
</details>

**Try it on your own data:** plot any formula in the [[function-grapher]], or fit a line to your own points with [[scatter-best-fit]].

**New words:** *function*, *slope* or *gradient* (rise over run), *intercept*, *weight* and *bias* (slope and intercept in machine learning).

<div class="keypoints">

- A function turns each input into exactly one output: y = f(x).
- A straight line is y = mx + c: slope m (change per step of x) and intercept c (value at x = 0).
- Slope from two points is rise ÷ run; then c = y₁ − m x₁.
- In machine learning the slope is a weight w and the intercept a bias b.
- Slopes have units, and an intercept only means something if x = 0 makes sense.

</div>
