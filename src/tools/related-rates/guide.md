---
name: Related rates
num: 1469
shelf: learn
section: school-maths
title: "Related rates: a ladder sliding down a wall, a balloon and a filling cone, animated with the working"
summary: "Play three classic related-rates stories (a ladder sliding down a wall, a balloon being blown up, a cone-shaped tank filling with water), change the sizes and speeds, and see the link equation differentiated with respect to time with your numbers filled in, plus a graph of the unknown rate as time goes on."
status: live
ads: false
order: 1469
icon: clock
works: offline
updated: 2026-11-09
related: [chain-rule, maxima-minima, derivative-steps, heights-distances]
sources:
  - "Standard calculus: implicit differentiation with respect to time of x² + y² = L², V = (4/3)πr³, S = 4πr² and V = (1/3)πr²h with similar triangles. Written for fibub; the stories are generic and no textbook text, figures or exercises are used."
  - "Checked against sympy 1.14: the rates found by differentiating the explicit shapes with respect to t for each story at three times, and against finite differences."
flow:
  - { icon: book, label: "Story" }
  - { icon: sliders, label: "Sizes" }
  - { icon: clock, label: "Play" }
  - { icon: calculator, label: "Rate" }
---

## What it shows

In a related-rates problem two quantities are tied together by an equation, and as time goes on both change. You know how fast one changes and want the other. The trick is to differentiate the whole equation **with respect to time t**, using the chain rule on each part, and then put in the numbers at the moment you care about.

This page has three stories, each with a moving picture:

- **Ladder**: a ladder leans on a wall; its foot slides away at a steady speed. How fast does the top fall? The link is x² + y² = L².
- **Balloon**: air is pumped into a round balloon at a steady rate. How fast does the radius grow? The link is V = (4/3)πr³.
- **Cone tank**: water pours into a cone standing on its point. How fast does the level rise? The link is V = (1/3)πr²h, with r tied to h by similar triangles.

It follows the rate of change of quantities in application of derivatives in Class 12 maths. The [[chain-rule]] page explains why d/dt (x²) = 2x·dx/dt; [[maxima-minima]] is the other big use of derivatives in the same chapter, and [[derivative-steps]] differentiates any formula for you.

## How to use it

1. **Pick a story** with the buttons.
2. **Set the sizes and speeds** with the sliders: ladder length and how fast its foot slides; the balloon's starting volume and pump rate; the cone's size and the flow of water.
3. **Move the time slider** or press **Play** to watch the story run. The facts show every quantity right now.
4. Read **The working**: the link equation, its derivative with respect to t, and the answer with today's numbers.
5. The **rate over time** graph shows how the unknown rate changes through the whole story, with an orange dot for now.

## Worked example

A 5 m ladder has its foot 3 m from the wall, sliding out at 0.5 m/s. Then y = √(25 − 9) = 4 m. Differentiating x² + y² = 25 gives 2x·dx/dt + 2y·dy/dt = 0, so dy/dt = −(x/y)·dx/dt = −(3/4) × 0.5 = −0.375 m/s: the top falls at 0.375 m/s. One second later the foot is at 3.5 m, the top at 3.571 m, and the top falls at 0.490 m/s: faster, though the foot's speed has not changed.

For the balloon starting at 500 cm³ with 100 cm³/s going in, r = ∛(3 × 500 / 4π) = 4.924 cm and dr/dt = 100 / (4π × 4.924²) = 0.3282 cm/s.

## Tips

- Draw a picture and name everything that changes with letters, not numbers. Put the numbers in only after differentiating.
- A negative rate means the quantity is getting smaller, such as the height of the ladder's top.
- In the cone, use similar triangles first to get rid of r, so V depends on h alone.

## FAQ

**Why does the ladder's top speed up without limit?** The maths says dy/dt = −(x/y)·dx/dt, which blows up as y → 0. A real ladder would leave the wall before then; the model only holds while the top stays on the wall.

**Are these real measurements?** No. They are made-up, round numbers for practice, and you can change them all.

**Is this page part of NCERT?** No. fibub is independent. It follows the topics of the Class 12 maths syllabus and uses none of the textbook's text or exercises.
