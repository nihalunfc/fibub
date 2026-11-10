---
name: Derivative steps
num: 1467
shelf: learn
section: school-maths
title: "Derivative steps"
summary: "Type a function such as x² sin x, (x + 1)/(x − 1), sin(x²) or xˣ and see its derivative with every step: which rule is used at each part (power, product, quotient, chain, eˣ, ln, trig, inverse trig, logarithmic differentiation), worked from the inside out, then f and f′ drawn together with the tangent at any point."
status: live
ads: false
order: 1467
icon: sigma
works: offline
updated: 2026-11-09
related: [chain-rule, derivative-slope, maxima-minima, symbolic-algebra]
sources:
  - "Standard differentiation rules (sum, constant multiple, power, product, quotient, chain, the derivatives of eˣ, aˣ, ln x, the trig and inverse trig functions, and logarithmic differentiation). Written for fibub; no textbook text, figures or exercises are used."
  - "Checked against sympy 1.14: the derivatives of 25 school functions at x = 0.3, 0.7 and 0.9, and against fibub's own symbolic algebra engine at eight more points."
flow:
  - { icon: pencil, label: "Type f(x)" }
  - { icon: sigma, label: "Rules" }
  - { icon: check, label: "f′(x)" }
  - { icon: curve, label: "Graph" }
---

## What it does

Type a function of x and this page differentiates it the way you would on paper. It splits the function into parts, names the rule it uses for each part (sum rule, power rule, product rule, quotient rule, chain rule and the standard derivatives of eˣ, ln x, sin, cos, tan and the inverse trig functions), writes the working with the pieces filled in, and puts them together into one simplified answer. Underneath, f(x) and f′(x) are drawn on the same axes, with the tangent at a point you choose.

The steps run **from the inside out**: the small derivatives come first, and the last step is the whole function. That is the order in which you can check each line, because every line only uses derivatives already found above it.

It follows limits and derivatives in Class 11 maths (the sum, product and quotient rules, and the derivatives of xⁿ, sin x and cos x) and continuity and differentiability in Class 12 maths (the chain rule, eˣ, ln x, inverse trig and logarithmic differentiation). If the chain rule feels like magic, the [[chain-rule]] page shows it as linked gears; [[derivative-slope]] shows what a derivative means as a slope, and [[maxima-minima]] puts the answer to work.

## How to use it

1. **Pick the Level.** *Class 11* shows examples that use the Class 11 rules; *Class 12* adds the chain rule, eˣ, ln, inverse trig and xˣ. Any function you type works at either level.
2. **Type f(x)** or tap an example. Use `^` for powers, brackets after function names (`sin(x)`, `ln(x^2 + 1)`, `sqrt(x)`, `atan(x)`), `e^(3x)` for e to the power 3x, and `|x - 2|` for absolute value. `2x` and `x sin(x)` mean multiply.
3. **Read the answer** and the steps. Each step shows the rule in bold and then the working.
4. **Slide a** to move the point on the graph. The facts show f(a), the slope f′(a) and the tangent line there.

## The rules it uses

- **Sum rule**: the derivative of a sum is the sum of the derivatives.
- **Constant multiple**: d/dx [c·g] = c·g′.
- **Power rule**: d/dx xⁿ = n xⁿ⁻¹, for any constant n (so √x and 1/x are covered too).
- **Product rule**: d/dx [u·v] = u′v + uv′.
- **Quotient rule**: d/dx [u/v] = (v·u′ − u·v′)/v².
- **Chain rule**: d/dx f(g(x)) = f′(g(x))·g′(x). A power of a bracket, such as (2x + 1)⁵, uses it as n uⁿ⁻¹ · u′.
- **Logarithmic differentiation** for a variable power such as xˣ: take ln of both sides first.

## Worked example

Type `x^2 sin(x)`. The page finds d/dx[x²] = 2x by the power rule and d/dx[sin x] = cos x, then uses the product rule with u = x² and v = sin x: f′(x) = 2x sin x + x² cos x. At a = 1, f′(1) = 2 sin 1 + cos 1 ≈ 1.6829 + 0.5403 = 2.2232, so the curve is rising there and the tangent is y = 2.223x − 1.382.

Now tap `(x + 1)/(x − 1)`. With u = x + 1 and v = x − 1, both u′ and v′ are 1, so f′ = [(x − 1) − (x + 1)]/(x − 1)² = −2/(x − 1)². It is negative everywhere it exists: the graph falls on both sides of x = 1.

## FAQ

**Why does my answer look different?** There are many correct ways to write a derivative. The page simplifies, but 2x sin x + x² cos x and x(2 sin x + x cos x) are the same thing. Check by putting a number in both.

**What is sec²?** sec x = 1/cos x, so the page writes sec²(2x) in the step and 1/cos²(2x) in the answer.

**Why does |x| give x/|x|?** That is +1 for positive x and −1 for negative x; at x = 0 there is no derivative.

**Is this page part of NCERT?** No. fibub is independent. It follows the topics of the Class 11 and 12 maths syllabus and uses none of the textbook's text or exercises.
