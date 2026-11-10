---
title: "How to find the derivative at a point (and the tangent line)"
summary: "Differentiate first, then put the x-value into f′(x) to get the slope there, and use y − f(a) = f′(a)(x − a) for the tangent. Worked example with the chain rule."
tools: [derivative-steps, derivative-slope, chain-rule]
updated: 2026-11-10
sources:
  - "Standard differentiation rules (power, sum, chain) and the point-slope form of a straight line, as taught in Class 11 and 12 maths and first-year calculus."
---

To find the derivative at a point, work out the derivative f′(x) as a formula, then substitute the x-value you care about: the number you get is the slope of the curve at exactly that spot. The [[derivative-steps]] page does both jobs at once, showing each rule it uses and giving f′(a) and the tangent line for any point you pick.

## What you need

- **The function f(x)**, written out in full, for example (x² + 1)³ or x³ − 4x.
- **The point a**, the x-value where you want the slope. If a question gives you a point as (1, 8), the a is the first number, 1.
- **The rules of differentiation** you have met so far: the power rule, the sum rule, and for anything with a bracket raised to a power or a function inside a function, the chain rule.

## Step by step

1. **Open the derivative page and type f(x).** Use `^` for powers and brackets after function names, so (x² + 1)³ is typed `(x^2 + 1)^3`. The answer updates as you type.
2. **Read f′(x) and the steps.** Each step is labelled with the rule it uses. The list starts with the smallest pieces and ends with the whole function, so you can tick off each line against your own working.
3. **Move the a slider to your point.** It runs from −4 to 4 in steps of 0.05. Under the graph the page lists f(a), the slope f′(a) and the tangent line at a. It also tells you whether the curve is rising, falling or flat there.
4. **Write the tangent line if the question asks for it.** The tangent passes through the point (a, f(a)) with slope m = f′(a), so

   y − f(a) = f′(a)(x − a)

   Tidy it into y = mx + c, where c = f(a) − m·a.

Why does substituting into f′(x) give the slope? The derivative is the limit of (f(a + h) − f(a))/h as h shrinks to zero: the slope of a chord between two points that slide together until they become one. The formula for f′(x) packages that limit for every x at once, so you only need to plug in a. If that idea still feels slippery, [[derivative-slope]] lets you watch a secant line turn into the tangent as h gets small.

## A worked example

Find the slope of y = (x² + 1)³ at x = 1, and the equation of the tangent there.

**Differentiate.** This is a bracket raised to a power, so it needs the chain rule. Let u = x² + 1, so y = u³.

- Inside: du/dx = 2x.
- Outside: dy/du = 3u² = 3(x² + 1)².
- Chain rule: dy/dx = 3(x² + 1)² × 2x = 6x(x² + 1)².

The derivative page lists the same three moves: power rule on x², sum rule on x² + 1, then the chain rule (power) to finish, and gives f′(x) = 6x(x² + 1)².

**Substitute a = 1.**

- f(1) = (1 + 1)³ = 2³ = 8, so the point is (1, 8).
- f′(1) = 6 × 1 × (1 + 1)² = 6 × 4 = 24.

The slope at x = 1 is **24**: the curve climbs 24 units for every unit across, right at that point.

**Tangent line.** y − 8 = 24(x − 1), so y = 24x − 24 + 8, which gives **y = 24x − 16**. Set the slider to a = 1 and the page shows f(a) = 8, f′(a) = 24 and the same tangent.

A common slip here is to expand (x² + 1)³ first. That works, but it gives a six-term polynomial and many chances to drop a coefficient. The chain rule is shorter and easier to check. If the chain rule is new, the [[chain-rule]] gears picture shows why the two rates multiply.

## Check your answer

Pick a tiny step h, say h = 0.001, and work out the slope of the chord from x = 0.999 to x = 1.001:

(f(1.001) − f(0.999)) / 0.002 ≈ 24.00003

That is almost exactly 24, so the derivative is right. A sloppier check with a one-sided step of 0.1 gives about 27.9. It is in the right area but too big, because the curve bends upwards to the right of x = 1. That is why small, two-sided steps make the best check.

Two more quick tests:

- **Sign.** The graph of (x² + 1)³ is rising at x = 1, so the slope must be positive. It is.
- **Tangent touches the curve.** Put x = 1 into y = 24x − 16 and you get 8, which is f(1). A tangent that misses the point means c is wrong.

## Questions people ask

**Is the derivative at a point the same as the gradient?** Yes. For a curve, "gradient at a point", "slope at a point" and "f′(a)" all mean the slope of the tangent there.

**What if the derivative does not exist at my point?** At a sharp corner, such as |x| at x = 0, the slopes from the left and right disagree, so there is no single tangent and no derivative. The page shows |x| with a derivative of x/|x|, which has no value at 0.

**Do I need the derivative formula, or can I just use a small h?** Exams usually want the formula, the substitution and an exact answer. A small h is a handy way to check, but it only gives a close decimal, never an exact value.
