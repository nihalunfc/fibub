---
title: "How to find the area between two curves (with a worked example)"
summary: "Find where the curves cross, take the top curve minus the bottom one, and integrate between the crossing points. Worked example with y = x + 2 and y = x², plus checks."
tools: [riemann-sums, function-grapher, integration-coach]
updated: 2026-11-10
sources:
  - "Area between curves as the definite integral of the top curve minus the bottom curve, and Archimedes' result that a parabolic segment has area (b − a)³/6 for y = x²: standard school calculus."
---

To find the area between two curves, solve f(x) = g(x) for the crossing points a and b, then integrate (top curve − bottom curve) from a to b; if the curves swap places, split at each crossing and add the pieces as positive numbers. The **Area between curves** view of the [[riemann-sums]] page finds the crossings, shades the region and gives the area, so you can check your working.

## What you need

- **The two equations** as y = something in x, such as y = x + 2 and y = x².
- **The limits**: the crossing points, or two x values from the question.
- **Antiderivatives** of the terms: the integral of xⁿ is xⁿ⁺¹ / (n + 1).
- **Which curve is on top.** Put an x between the limits into both; the bigger answer is on top.

## Step by step

The formula is

Area = ∫ from a to b of [f(x) − g(x)] dx, where f is the upper curve and g the lower one.

Each thin strip has height f(x) − g(x) and width dx; the integral adds them all. If the curves cross inside the interval, f − g changes sign, so integrate each piece separately and take its size: in effect, integrate |f(x) − g(x)|.

With the tool:

1. Open the Riemann sums page and press **Area between curves** at the top.
2. Type the first curve in the **Type f(x)** box and the second in **Second curve g(x)**. Use ^ for powers, so x² is `x^2`.
3. Leave **Use the points where the curves cross as a and b** ticked. The page looks for crossings between x = −10 and 10 and fills in **From a** and **To b**. Untick it to type limits from your question.
4. Read the line under the graph, then the facts list: it gives the **Area between the curves** (always positive), the plain ∫ (f − g) dx, and each piece with its start, end and which curve is on top.

## A worked example

Find the area enclosed by y = x + 2 and y = x².

- **Crossings.** Set x² = x + 2, so x² − x − 2 = 0, which factors as (x − 2)(x + 1) = 0. The curves meet at x = −1 and x = 2.
- **Which is on top?** Try x = 0: the line gives 2 and the parabola gives 0, so the line is above.
- **Set up.** Area = ∫ from −1 to 2 of (x + 2 − x²) dx.
- **Antiderivative.** F(x) = x²/2 + 2x − x³/3.
- **At x = 2:** 2 + 4 − 8/3 = 10/3.
- **At x = −1:** 1/2 − 2 + 1/3 = −7/6.
- **Subtract.** 10/3 − (−7/6) = 20/6 + 7/6 = 27/6 = **4.5 square units**.

Typed into the tool, `x + 2` and `x^2` give crossings at −1 and 2 and an area of 4.5, in one piece with f on top.

**When the curves swap.** Try f = `x^3` and g = `x`. They cross three times, at −1, 0 and 1. From −1 to 0 the cubic is on top, and from 0 to 1 the line is. Each piece has area 0.25, so the enclosed area is **0.5**. The plain integral of (x³ − x) from −1 to 1 is 0, because the pieces cancel; the tool shows both numbers, which is why you split at the middle crossing.

## Check your answer

- **Archimedes' shortcut.** For the parabola y = x² and any straight line that cuts it at x = a and x = b, the area between them is (b − a)³ / 6. Here (2 − (−1))³ / 6 = 27/6 = 4.5, the same as the integral.
- **Box it in.** The region fits in a 3 by 4 rectangle (x from −1 to 2, y from 0 to 4), so the area must be under 12.
- **Numbers.** In the **Riemann sums** view, pick **My own…** and type `x + 2 - x^2` from −1 to 2. The strips close in on 4.5 as n grows.
- **Sign.** A negative answer means you took bottom minus top; flip the order.

To see both curves on large axes before you start, draw them in the [[function-grapher]]. If the antiderivative is the hard part, the [[integration-coach]] suggests a method and walks through it.

## Questions people ask

**Do I need to know which curve is on top?**
It keeps each piece positive. Get it the wrong way round and only the sign flips, so taking the absolute value rescues you.

**What if the area is between a curve and the x axis?**
Use y = 0 as the second curve (type `0` as g(x)). Parts below the axis then count as positive, unlike a plain definite integral.

**Can I integrate with respect to y instead?**
Yes, and it can be easier for a sideways parabola such as x = y²: use right curve minus left curve, with limits on the y axis. The tool works in x, so swap the letters to check it.
