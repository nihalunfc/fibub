---
name: One-one and onto tester
num: 1459
shelf: learn
section: school-maths
title: "One-one and onto function checker: horizontal line test, range, bijection and inverse on a graph"
summary: "Pick a function, a domain and a codomain, then slide a horizontal line over the graph: it meets the graph more than once where the function is not one-one, and misses it where the function is not onto. See the range, a pair of x with the same y, a value nothing maps to, and the inverse as a mirror image in y = x."
status: live
ads: false
order: 1459
icon: curve
works: offline
updated: 2026-11-09
related: [relation-checker, function-grapher, inverse-trig, unit-circle]
sources:
  - "Standard school mathematics: functions, domain, codomain and range, one-one (injective), onto (surjective) and bijective functions, the horizontal line test and inverse functions. Written for fibub; no textbook text, figures or exercises are used."
  - "Checked by hand and with sympy 1.14 (solveset for f(x) = y on each piece, function_range for the range) for the nine ready-made functions on several domains, including x² on [−1, 2], eˣ onto (0, ∞) and [0, ∞), 1/x on ℝ − {0} and x³ − 3x."
flow:
  - { icon: curve, label: "Pick f(x)" }
  - { icon: ruler, label: "Set domain" }
  - { icon: pointer, label: "Slide line" }
  - { icon: check, label: "Verdict" }
---

## What it shows

A **function** sends every x in its **domain** to exactly one y in its **codomain**. Two questions decide whether it can be undone (whether it has an inverse):

- **One-one (injective):** do different x always give different y? On a graph: no horizontal line meets the curve more than once.
- **Onto (surjective):** is every y in the codomain actually reached? On a graph: every horizontal line at a height inside the codomain meets the curve at least once. Equivalently, the **range** (the values the function really takes) equals the codomain.

A function that is both is a **bijection**, and only bijections have an inverse. The inverse's graph is the mirror image of the function's graph in the line y = x.

This page draws the function on the domain you choose, lets you slide the line y = k up and down, and gives the range, a pair of x that share a y when the function is not one-one, a y that nothing reaches when it is not onto, and the inverse. It follows relations and functions in Class 11 maths (domain, range and graphs of functions) and Class 12 maths (types of functions, composition and invertible functions). For finite sets drawn as arrow diagrams, use the [[relation-checker]]; to plot any function, the [[function-grapher]]; and to see how restricting the domain gives sin⁻¹, cos⁻¹ and tan⁻¹, go on to [[inverse-trig]].

## How to use it

1. Pick **f(x)**: 2x + 1, x², x³, x³ − 3x, |x|, eˣ, ln x, sin x or 1/x, or choose *My own…* and type a formula in x (such as `x^2 - 2x` or `sin(x)/x`) with the ends a and b of the domain.
2. Choose the **domain** (all real numbers, [0, ∞), (0, ∞), (−∞, 0], [−π/2, π/2], [0, π] or your own [a, b]) and the **codomain** (ℝ, [0, ∞), (0, ∞), [−1, 1] or *its range*).
3. Drag up and down on the picture, or use the slider, to move the line **y = k**. The page says how many times the line meets the graph and where. Green line: once. Red: more than once. Amber: not at all.
4. Read the verdict: **domain**, **range** (also drawn as a thick green bar on the y-axis), **codomain** (the shaded band), **one-one?**, **onto?** and **bijective?**
5. Press **Make it one-one** to cut the domain down to one rising or falling piece, or **Make it onto** to shrink the codomain to the range.
6. The second picture reflects the graph in y = x. When the function is a bijection the reflection (green) is the graph of f⁻¹; otherwise it is red and the page says why it is not an inverse.

## Worked example

Start with f(x) = x² from ℝ to ℝ, with the line at k = 2. The page shows that the line **meets the graph 2 times (x = −1.4142, 1.4142)**. The range is **[0, ∞)**. One-one? **No**: f(−1) = f(1) = 1. Onto? **No**: nothing maps to −1, because a square is never negative.

Now change the domain to [0, ∞): one-one becomes **Yes**, because on x ≥ 0 the curve only rises. Change the codomain to [0, ∞) as well: onto becomes **Yes**, and the function is a bijection. The second picture shows its mirror image in y = x, which is the graph of the inverse, **√x**, with domain [0, ∞).

## Things to notice

- Whether a function is one-one depends on its **domain**; whether it is onto depends on its **codomain**. The same formula can be a bijection or not.
- eˣ is onto (0, ∞) but not onto [0, ∞): it gets as close to 0 as you like but never reaches it.
- 1/x is one-one, but there is no x with 1/x = 0, so it is not onto ℝ.
- x³ has a flat point at x = 0 but still always rises, so it is one-one.

## Check yourself

Five fresh questions: an inverse value of a straight-line function, the lowest point of a range, a horizontal line count, whether a function is a bijection, and how many one-one functions there are between two finite sets. Nothing is saved.

## FAQ

**How does the page know the range exactly?** For the ready-made functions it cuts the graph at its turning points and at gaps in the domain, so that each piece only rises or only falls. Each piece covers every value between its two end values (or limits), and the range is the union of those intervals.

**And for my own formula?** It samples 4000 points on [a, b], finds the turning points and gaps from them, and then works the same way. That is a strong hint, not a proof: a very fast wiggle between two sample points could be missed.

**What is the vertical line test?** It checks that a graph is a function at all (each x gives one y). The horizontal line test checks that the function is one-one.

**Is this from my textbook?** It covers the standard school topic with its own examples. It is an independent study aid and is not part of NCERT.
