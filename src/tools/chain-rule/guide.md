---
name: Chain rule gears
num: 1466
shelf: learn
code: L303
section: school-maths
title: "Chain rule gears: see why dy/dx = dy/du × du/dx with linked gears (interactive, Class 11 and 12)"
summary: "Build a function out of two or three links, such as sin(3x) or (sin 2x)², and turn the x gear. Each gear turns by its own rate, and dy/dx is the product of the rates, with the formula, live numbers, a small-nudge check, the graph with its tangent and fresh practice questions."
status: live
ads: false
order: 1466
icon: curve
works: offline
updated: 2026-11-09
related: [derivative-slope, limit-zoom, maxima-minima]
sources:
  - "Standard calculus: the chain rule d/dx f(g(x)) = f′(g(x)) g′(x) and the derivatives of xⁿ, sin, cos, eˣ, ln x and √x. Written for fibub; no textbook text, figures or exercises are used."
  - "Checked against sympy 1.14: dy/dx of ten two- and three-link chains at three points each, and the written forms of the link derivatives."
flow:
  - { icon: sliders, label: "Pick links" }
  - { icon: pointer, label: "Turn x" }
  - { icon: calculator, label: "Rates" }
  - { icon: check, label: "Multiply" }
---

## What it shows

Many functions are one function inside another. In y = sin(3x), first x is tripled to give u = 3x, and then y = sin u. The **chain rule** says how fast y changes with x: multiply the rates of the links,

dy/dx = dy/du × du/dx.

This page turns that into gears. The x gear drives the u gear, which drives the y gear. Each pointer shows its gear's number (a quarter turn for every 1), and the label between two gears says how far the right-hand one turns for each small turn of the left-hand one. Turn the x gear: if u moves 3 times as far as x, and y moves cos u times as far as u, then y moves 3 cos u times as far as x. That product is the slope of the graph, and the dashed tangent under the gears shows it.

It follows continuity and differentiability in Class 12 maths (derivatives of composite functions) and the first look at derivatives in Class 11. Before this page, [[derivative-slope]] shows what a slope is; after it, [[maxima-minima]] uses these derivatives to find the highest and lowest points, and [[limit-zoom]] covers the limits behind it all.

## How to use it

1. **Pick the links.** The inner link u = g(x) and the outer link y = f(u) each come from a list: k × (inside), (inside)², (inside)³, sin, cos, e^(inside), ln and √. For k × (inside), choose k.
2. **Level.** *Two links* is the usual y = f(g(x)). *Three links* adds a middle gear v, for functions like (sin 2x)² or e^(sin x²), where three rates multiply.
3. **Move x** with the slider, drag the x gear round, or press **Turn the x gear** to sweep x along by 1.
4. Read the **formula line**. It writes the chain rule with names, then with the inner expressions put in, then with today's numbers.

## What each part means

- **Rate du/dx, dy/du (and dv/du)**: each link's own derivative at the current point. A negative rate means that gear turns back while the one before it turns forward.
- **dy/dx (product)**: the chain rule answer.
- **Small nudge table**: nudge x by 0.1, 0.01 and 0.001 and work out Δy ÷ Δx directly from the function. The numbers close in on the product, which is an honest check that the rule works.
- **Graph**: y against x with the tangent at your x. A rate of 0 anywhere in the chain makes the whole slope 0, and the tangent goes flat.

## Worked example

Take y = sin(3x) at x = 0.5. The inner link is u = 3x, so u = 1.5 and du/dx = 3. The outer link is y = sin u, so y = sin 1.5 ≈ 0.997 and dy/du = cos 1.5 ≈ 0.0707. Multiply: dy/dx = 0.0707 × 3 ≈ 0.2122. The nudge table agrees: with Δx = 0.001 it gives about 0.21. Slide x to about 0.52 and cos(3x) reaches 0: the y gear stops for a moment and the graph is at the top of its wave.

## Tips

- Always write the outer derivative with the inside left alone: d/dx sin(x²) = cos(x²) × 2x, not cos(2x).
- Linear inside links just scale: the slope of f(kx) is k times f′ at kx.
- Put ln outside e^(inside) and the rates always multiply to 1, since ln(eˣ) = x.

## FAQ

**Why do the rates multiply and not add?** Because each gear scales the turn of the one before it. Scaling by 3 and then by 2 is scaling by 6.

**What happens where a link is not defined?** ln and √ need a positive inside. If the inside is zero or negative the page says the function is not defined there; move x.

**Is this page part of NCERT?** No. fibub is independent; it follows the topics of the Class 11 and 12 maths syllabus so you can practise them, and uses none of the textbook's text or exercises.
