---
name: Derivative slope
num: 1181
shelf: learn
section: school-maths
title: "Derivative slope"
summary: "Drag two points on a curve and shrink the gap h: the secant line turns into the tangent and its slope settles on f′(x). See the slope graph f′(x) drawn under f(x), a table of slopes from both sides, first-principles working for xⁿ and sin x, corners where there is no derivative, and fresh practice questions."
status: live
ads: false
order: 1181
icon: curve
works: offline
updated: 2026-11-09
related: [function-grapher, symbolic-algebra, numerical-methods]
sources:
  - "Standard calculus: the derivative as the limit of [f(a + h) − f(a)] / h, the binomial theorem and sin A − sin B = 2 cos((A + B)/2) sin((A − B)/2). Written for fibub; no textbook text, figures or exercises are used."
  - "Checked against sympy 1.14: derivatives, second derivatives and antiderivatives of the ready-made functions at three points, the expansions of (x + h)ⁿ for n = 1 to 6, and a typed function's derivative."
flow:
  - { icon: curve, label: "Pick f(x)" }
  - { icon: pointer, label: "Drag P, Q" }
  - { icon: sliders, label: "Shrink h" }
  - { icon: target, label: "Slope f′" }
---

## What it shows

The derivative of a function at a point is the slope of the curve there: how steeply it climbs or falls. This page lets you *see* that number appear. Two points sit on the curve: **P** at x = a and **Q** a small step h further along. The straight line through them is a **secant**, and its slope is

slope of PQ = [f(a + h) − f(a)] / h.

As you slide Q towards P (h → 0), the secant swings round and lands on the **tangent** at P, the dashed orange line. The number it settles on is the derivative f′(a). Under the main picture, the **slope graph** draws f′(x) for every x, so you can see that the slope of x² is 2x, the slope of sin x is cos x and the slope of eˣ is eˣ itself.

It follows the school topics of limits and derivatives in Class 11 maths and continuity and differentiability in Class 12 maths. Before this, the idea of a limit is easiest to see with a [[function-grapher]]; afterwards, the [[symbolic-algebra]] tool differentiates any expression for you, and [[numerical-methods]] shows how computers estimate slopes.

## How to use it

1. **Pick a function** from the list (x², x³ − 3x, sin x, cos x, eˣ, ln x, √x, |x|, 1/x), or choose *My own…* and type one, such as `x^3/3 - x` or `sin(x)/x`. Use `^` for powers, `sqrt( )`, `abs( )`, `e^x` and brackets after sin, cos and tan.
2. **Move P**: drag along the picture or use the *Point P* slider.
3. **Shrink h**: use the *Gap h* slider, drag Q itself, or press **Slide Q to P** to watch h fall from about 1 to 0.001.
4. Tick **Q on the left** to make h negative and come at P from the other side.
5. Read the **formula line**: it fills in your numbers, such as [f(2) − f(1)] / 1 = (4 − 1) / 1 = 3.

The **Level** switch adds Class 12 detail: the left-hand and right-hand slopes and whether the function is differentiable at P.

## What each part means

- **Slope of PQ**: the secant slope for the h you chose.
- **Tangent slope f′(a)**: the exact derivative for the ready-made functions (worked out numerically for a typed one).
- **Gap to the tangent**: how far the secant slope still is from f′(a). It shrinks roughly in step with h.
- **Tangent line at P**: y − f(a) = f′(a)(x − a), written as y = mx + c.
- **The table** lists the secant slope for h = 1, 0.1, 0.01, 0.001 and 0.0001 from both sides. When both columns head for the same number, the derivative exists.
- **From first principles** writes out the working for xⁿ (n from 1 to 6, using the binomial theorem) and for sin x (using the sum-to-product formula and the limit sin θ / θ → 1).

## Worked example

Take f(x) = x² and put P at x = 1. With h = 1, Q is at x = 2 and the slope of PQ is (4 − 1) / 1 = 3. With h = 0.1 it is (1.21 − 1) / 0.1 = 2.1; with h = 0.01, 2.01; with h = 0.001, 2.001. From the left (h = −0.1) the slopes are 1.9, 1.99, 1.999. Both sides close in on **2**, which is f′(1) = 2 × 1. The tangent at P is y = 2x − 1.

## Corners: when there is no derivative

Choose |x| and put P at 0. From the right every secant has slope 1, from the left −1. The two sides never agree, so there is no single tangent: |x| is continuous at 0 but **not differentiable** there. Switch the Level to Class 12 to see the left-hand and right-hand slopes side by side.

## Check yourself

At the bottom are five short questions with fresh numbers every time: a derivative of a quadratic, a secant slope, the power rule, a trig derivative and a corner. Type an answer (fractions like 3/4 are fine), press Check, and open the working if you want to see the steps. Nothing is saved.

## FAQ

**Why not just put h = 0?** Then Q sits on P and the slope is 0/0, which means nothing. The derivative is what the slope *approaches* as h gets close to 0, which is why limits come first.

**Why does the slope graph of 1/x stop at 0?** The function is not defined at x = 0, so it has no slope there either.

**Is this the same as my textbook?** The ideas are the standard ones taught in school maths everywhere. The examples and pictures here are made for this page; it is an independent study aid.
