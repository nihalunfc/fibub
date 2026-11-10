---
name: Polynomial zeros
num: 1156
shelf: learn
section: school-maths
title: "Polynomial zeros"
summary: "Slide the coefficients of a linear, quadratic or cubic polynomial and see its zeros where the graph meets the x axis. Drag a zero and the polynomial rebuilds itself. The sum and product of zeros are checked against the coefficients live."
status: live
ads: false
order: 1156
icon: curve
works: offline
updated: 2026-11-09
related: [quadratic-explorer, function-grapher, symbolic-algebra]
sources:
  - "Standard algebra: zeros of polynomials and the relations between zeros and coefficients (Vieta's formulas). Written for fibub."
  - "Cubic zeros checked against numpy.roots; relations checked on 500 random cubics built from known zeros."
flow:
  - { icon: sliders, label: "Coefficients" }
  - { icon: curve, label: "Graph" }
  - { icon: target, label: "Zeros" }
  - { icon: sigma, label: "Sum, product" }
---

## What it does

A **zero** of a polynomial p(x) is a number that makes p(x) = 0. On a graph, the zeros are exactly where the curve y = p(x) meets the x axis. This page draws that curve for a linear, quadratic or cubic polynomial and marks its zeros, so you can see:

- a linear polynomial always has exactly one zero (a straight line crosses the axis once);
- a quadratic has two, one (touching) or no real zeros;
- a cubic has three or one real zero, never none;
- and the zeros are tied to the coefficients: for ax² + bx + c the zeros add to −b/a and multiply to c/a.

It covers the Class 10 chapter *polynomials* (the geometrical meaning of zeros and the relation between zeros and coefficients) and the Class 9 polynomials chapter (zeros and the value of a polynomial).

For solving quadratic equations in depth, use the [[quadratic-explorer]]. To graph higher-degree polynomials, use the [[function-grapher]]; to factor or expand them, [[symbolic-algebra]].

## How to use it

1. Choose **Linear**, **Quadratic** or **Cubic**.
2. Move the sliders for the coefficients (a is the number in front of the highest power), or type exact values.
3. The green dots are the real zeros, with their values written above.
4. When all zeros are real you can **drag a zero** along the x axis. The polynomial is rebuilt from its zeros, keeping the same a, and the sliders move to match.
5. The **Zeros and coefficients** card compares the sum and product of the zeros read from the graph with −b/a, c/a (and for a cubic, the pair-sum and −d/a).

## A worked example

The quadratic starts as x² − x − 6.

- The curve meets the x axis at −2 and 3, so the zeros are −2 and 3.
- Sum: −2 + 3 = 1, and −b/a = −(−1)/1 = 1.
- Product: −2 × 3 = −6, and c/a = −6/1 = −6.

Switch to **Cubic**: it starts as x³ − 2x² − 5x + 6 with zeros −2, 1 and 3.

- Sum: −2 + 1 + 3 = 2 = −b/a.
- Pair sum: (−2)(1) + (1)(3) + (−2)(3) = −5 = c/a.
- Product: (−2)(1)(3) = −6 = −d/a.

## What each setting does

- **a** stretches the curve and can flip it; it never moves the zeros when you change it with the zeros held (drag a zero first to see this).
- **b, c, d** move the curve; the zeros move with it.
- The graph shows x from −6 to 6 and y from −10 to 10. Zeros outside that window are still listed under the graph.

## Check yourself

Four fresh questions each time: the zeros of a quadratic, the sum and product from the coefficients, a quadratic from a given sum and product, and the sum and product of a cubic's zeros. Type the answer, press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**Why can't I drag the zeros sometimes?** When some zeros are complex they do not lie on the x axis, so there is nothing to drag. Use the sliders until all zeros are real.

**Is this from the NCERT book?** It covers the same topics with fibub's own examples and pictures. fibub is not part of NCERT.
