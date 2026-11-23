---
title: 'Proportional Reasoning – 2'
seoTitle: 'Inverse Proportion Class 8 notes: speed and work'
summary: 'Class 8 Maths: inverse proportion, workers and days, speed and time, work done together, with graphs, a race track and step-by-step animations.'
minutes: 50
updated: 2026-11-23
quiz:
  - q: '12 workers build a wall in 10 days. How many days will 15 workers take, working at the same speed?'
    choices: ['8 days', '12.5 days', '6 days', '10 days']
    ans: 0
    why: 'The job is 12 × 10 = 120 worker-days. With 15 workers: 120 ÷ 15 = 8 days. More workers, fewer days.'
  - q: 'A car takes 4 hours at 60 km/h. At 80 km/h the same trip takes:'
    choices: ['3 hours', '5.33 hours', '4 hours', '2 hours']
    ans: 0
    why: 'Distance = 60 × 4 = 240 km. Time = 240 ÷ 80 = 3 hours.'
  - q: 'Asha does a job in 6 days and Bala in 12 days. Together they take:'
    choices: ['4 days', '9 days', '18 days', '3 days']
    ans: 0
    why: 'In one day they do 1/6 + 1/12 = 3/12 = 1/4 of the job, so the whole job takes 4 days.'
sources:
  - 'NCERT Class 8 Mathematics (Ganita Prakash), Chapter 10 “Proportional Reasoning – 2” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard school mathematics (inverse variation, time-speed-distance, time and work). Every worked example was checked a second way.'
---

**Maths · Class 8 · Chapter 10 · about 50 minutes.** By the end you will be able to tell direct from inverse proportion, solve workers-and-days and speed-and-time questions, find how long people take working together, and read the two kinds of proportion on a graph.

<div class="bigidea">Some quantities go up together (more notebooks, more rupees). Others pull in opposite directions (more workers, fewer days). In an inverse pair the product never changes: workers × days is the size of the job. Find that fixed number first, and the question solves itself.</div>

## 1. Quick recap: direct proportion

Two quantities are in **direct proportion** when one doubles as the other doubles. Four notebooks cost ₹ 100, so eight cost ₹ 200. The ratio cost ÷ notebooks is always ₹ 25. We solve such questions by the unitary method: find the value of one, then multiply.

<div class="meaning">
<dl>
<dt>Direct proportion</dt><dd>`$y = kx$`: the ratio `$y \div x$` stays the same. The graph is a straight line through the origin.</dd>
<dt>Inverse proportion</dt><dd>`$xy = k$`: the product `$x \times y$` stays the same. When `$x$` doubles, `$y$` halves.</dd>
<dt>Physical meaning</dt><dd>direct: both grow at the same rate. Inverse: one is shared out, so more sharers means a smaller share each.</dd>
</dl>
</div>

## 2. Inverse proportion: workers and days

A school wall needs painting. 6 painters finish it in 20 days. How long would 12 painters take? Twice as many painters should take half the time: 10 days. We did not need a formula: we used the idea that **the total work is fixed**. The total is 6 × 20 = 120 painter-days, and 12 painters share it as 120 ÷ 12 = 10 days.

Move the slider below. The rectangle has workers as its width and days as its height. Its area is the job, 60 worker-days, so it keeps the same area while its shape changes.

<figure class="fig" data-fig="c8-prop2-workers"><figcaption>One job of 60 worker-days. With 1 worker it takes 60 days; with 12 workers, 5 days. The curve is every shape the rectangle can take. The area never changes: workers × days = 60.</figcaption></figure>

Here is a full method, on a tank filled by pipes:

<div class="steps" data-fig="c8-prop2-steps">
<div class="step">6 identical pipes fill a tank in 20 minutes. How long will 10 pipes take?</div>
<div class="step">Draw the job as a rectangle: 6 pipes wide, 20 minutes tall.</div>
<div class="step">Its area is the job: 6 × 20 = 120 pipe-minutes. It does not change.</div>
<div class="step">With 10 pipes the rectangle is 10 wide, and the area must still be 120.</div>
<div class="step">Height = 120 ÷ 10 = 12 minutes. More pipes, less time.</div>
</div>

<div class="problem" data-problem="c8m-prop2-workers"></div>

<div class="myth">

**“More workers means more days, because there are more of them.”** Check the sense of the answer. If more people share the same job, each person does less, so the job finishes sooner. Your answer for more workers must be a smaller number of days. If it is bigger, you multiplied when you should have divided.

</div>

A second kind of inverse question: a fixed stock shared by more people. A hostel has rice for 60 students for 20 days. If 40 more students join, the rice lasts 60 × 20 ÷ 100 = 12 days. The stock is 1200 student-days.

<div class="problem" data-problem="c8m-prop2-mess"></div>

## 3. How do I decide: direct, inverse or neither?

Use two questions. Does doubling one double the other (direct)? Does doubling one halve the other (inverse)? If neither, the pair is neither. Try these situations. Each one gives you a quick check to read after you answer.

<figure class="fig" data-fig="c8-prop2-sort"><figcaption>Eight everyday pairs. Tap Direct, Inverse or Neither. The check under the picture tells you whether the ratio, the product, or neither stays fixed.</figcaption></figure>

Be careful with “neither”. A child’s height and age rise together but not in a fixed ratio. The side of a square and its area also rise together, but doubling the side makes the area four times bigger. Rising together is not enough for direct proportion.

## 4. Seeing proportion on a graph

On a graph, **direct proportion** is a straight line from the origin: `$y = kx$`. **Inverse proportion** is a curve that falls fast and then flattens, and never touches either axis: `$xy = k$`. The curve cannot touch the axes because the product would then be 0, not `$k$`.

<figure class="fig" data-fig="c8-prop2-graph"><figcaption>Switch between direct (y = 2x) and inverse (x × y = 24). Move x. In the direct case the ratio y ÷ x stays 2; in the inverse case the product x × y stays 24.</figcaption></figure>

Use the tool below to draw your own proportion tables and see the graph appear.

<!--fig:tool proportion-grapher-->

## 5. Speed, time and distance

Speed, time and distance link in one rule: **distance = speed × time**. For a **fixed distance**, speed and time are in inverse proportion: a bus that goes twice as fast takes half the time. For a fixed speed, distance and time are in direct proportion.

```math
\text{time} = \frac{\text{distance}}{\text{speed}}
```

Look at two vehicles on the same road. Change the speeds and the distance, press Play, and see who arrives first. Check that speed × time is the road length for both.

<figure class="fig" data-fig="c8-prop2-race"><figcaption>Red and Blue travel the same distance at different speeds. The faster one arrives in less time, but speed × time is the same distance for both.</figcaption></figure>

<div class="problem" data-problem="c8m-prop2-speed"></div>

Try a full race with the track tool, where you also see the effect of a head start.

<!--fig:tool race-track-->

**Changing minutes to hours.** Meera cycles at 12 km/h for 40 minutes. First change 40 minutes to 40/60 = 2/3 hour. Then distance = 12 × 2/3 = 8 km. Mixing minutes and hours is the most common slip.

## 6. Work done together

When two people work together, **their daily parts add**. This is a direct use of proportion with fractions.

<div class="steps" data-fig="c8-prop2-together">
<div class="step">Asha paints a wall in 6 days. Bala paints the same wall in 12 days. How long together?</div>
<div class="step">In one day Asha does 1/6 of the wall.</div>
<div class="step">In one day Bala does 1/12 of the wall.</div>
<div class="step">Together in one day: 1/6 + 1/12 = 3/12 = 1/4 of the wall.</div>
<div class="step">At 1/4 of the wall a day, the whole wall takes 4 days.</div>
<div class="step">Check: in 4 days Asha does 4/6 and Bala 4/12; together that is 1. It matches.</div>
</div>

```math
\text{Together: } \frac{1}{a} + \frac{1}{b} = \frac{a + b}{ab} \text{ per day, so time} = \frac{ab}{a + b}
```

A tap that fills a tank and a drain that empties it work against each other. The daily parts are subtracted: a tap filling in 6 hours and a drain emptying in 12 hours leave 1/6 − 1/12 = 1/12 of the tank per hour, so the tank fills in 12 hours.

<div class="problem" data-problem="c8m-prop2-together"></div>

<div class="history">

**Time and work in old books.** Indian mathematicians such as Aryabhata and Bhaskara II wrote problems about pipes filling cisterns and workers sharing a task more than a thousand years ago. The method was the same: find what each does in one day, and add.

</div>

<div class="keypoints">

- Direct proportion: the ratio `$y \div x$` is fixed, the graph is a straight line through the origin.
- Inverse proportion: the product `$x \times y$` is fixed, the graph is a falling curve that never touches the axes.
- Workers and days: find the job as workers × days, then divide by the new number of workers.
- Fixed distance: speed × time is constant. Change minutes to hours before using km/h.
- Work together: add the daily parts, 1/a + 1/b, then take the reciprocal. A drain subtracts.
- Check your answer: more workers or more speed must give a smaller time.

</div>

Other tools to explore: the [Proportion grapher](/learn/proportion-grapher/) and the [Race track](/learn/race-track/) work on their own too. Ready for exam-style questions? Go to [Proportional Reasoning – 2: practice questions](/learn/courses/ncert-class-8-maths/proportional-reasoning-2-practice/).
