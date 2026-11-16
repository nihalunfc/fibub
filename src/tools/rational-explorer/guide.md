---
name: Rational explorer
num: 2131
shelf: learn
code: L326
section: school-maths
title: "Rational functions: asymptotes, holes and intercepts"
summary: "Build a rational function from its zeros and poles and see its vertical and horizontal asymptotes, holes and intercepts update on the graph as you slide."
status: live
ads: false
order: 2131
icon: sliders
works: offline
updated: 2026-11-16
related: [polynomial-zeros, function-gallery, limit-zoom]
sources:
  - "Rational function behaviour (asymptotes, holes, end behaviour) is standard algebra. Grade levels follow the Ontario Ministry of Education course topics for MHF4U; check the official curriculum for the current wording. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Set" }
  - { icon: curve, label: "See" }
  - { icon: check, label: "Check" }
---

## What it does

A rational function is one polynomial divided by another. This tool lets you build one from its factors: the zeros on top, the poles on the bottom, and a scale k. The graph shows the curve, dashed lines for asymptotes, and an open circle wherever a factor cancels and leaves a hole. A list underneath gives the vertical asymptotes, holes, horizontal asymptote and intercepts.

Where the bottom is zero but the top is not, the graph shoots off to infinity: a vertical asymptote. Where a factor appears on both top and bottom it cancels, leaving a single missing point instead. Far to the left and right the curve settles towards a horizontal asymptote that depends on the degrees of top and bottom. To practise the factors themselves, use [[polynomial-zeros]]; to see why the ends level off, try [[limit-zoom]]; and [[function-gallery]] shows other families side by side.

## How to use it

1. Slide the zeros z₁ and z₂ (the top) and the poles p₁ and p₂ (the bottom).
2. Watch the equation and the graph change. Dashed vertical lines are vertical asymptotes.
3. Tick "Linear numerator" to drop the second zero, so the top has a lower degree than the bottom.
4. Set a zero equal to a pole to see a hole appear where an asymptote was.
5. Read the list under the graph, then try "Check yourself".

## What each setting does

- **Zeros**: where the top is zero, so the graph crosses the x axis (unless it is cancelled by a pole).
- **Poles**: where the bottom is zero. These are vertical asymptotes, unless a matching zero cancels them into a hole.
- **Scale k**: stretches the curve and sets the horizontal asymptote when the degrees are equal. A negative k flips it.
- **Linear numerator**: with a lower degree on top, the horizontal asymptote is y = 0.

## Worked example

f(x) = (x + 2)(x − 3) / ((x + 1)(x − 2)), the tool's starting graph. The poles x = −1 and x = 2 are vertical asymptotes. The zeros x = −2 and x = 3 are x-intercepts. The degrees match and k = 1, so the horizontal asymptote is y = 1. The y-intercept is (2)(−3) / ((1)(−2)) = −6 / −2 = 3.

## FAQs

**Why is there a hole and not an asymptote?** If (x − a) is on top and bottom it cancels everywhere except x = a itself, where the function is undefined: one missing point, not a break to infinity.

**Why does the horizontal asymptote change?** It depends on the degrees. A lower degree on top gives y = 0, equal degrees give y = the ratio of leading numbers (here k), and a higher degree on top has none.

**Does this follow the Ontario curriculum?** It covers the usual Grade 12 Advanced Functions (MHF4U) work on rational functions. fibub is not part of the Ontario government; check the official curriculum for the current course wording.

**Are my numbers saved?** No. Everything is worked out in your browser and nothing is stored or sent.
