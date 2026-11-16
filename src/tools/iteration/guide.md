---
name: Iteration
num: 2280
shelf: learn
code: L356
section: school-maths
title: "Iteration: solving equations with x = g(x), cobweb and staircase diagrams"
summary: "Rearrange an equation to x = g(x), pick a start value and step the iteration one press at a time with a table to six decimal places and a cobweb diagram that shows whether it converges or diverges."
status: live
ads: false
order: 2280
icon: curve
works: offline
updated: 2026-11-16
related: [numerical-methods, function-grapher, quadratic-explorer]
sources:
  - "Fixed-point iteration x(n+1) = g(x(n)) and Newton-Raphson are standard numerical methods. Serves GCSE maths (higher tier, iteration), A-level pure maths (numerical methods) and general numerical methods courses; the convergence test |g'(root)| < 1 is the standard fixed-point theorem. Checked against hand-worked values in tests/curr-maths.mjs. Pictures are fibub's own."
flow:
  - { icon: pencil, label: "g(x)" }
  - { icon: play, label: "Step" }
  - { icon: curve, label: "Cobweb" }
  - { icon: check, label: "Quiz" }
---

## What it does

Many equations, like x³ + 4x − 1 = 0, have no neat formula. Iteration finds an answer by guessing and improving. Rearrange the equation into the form x = g(x), such as x = (1 − x³) ÷ 4. Choose a start value x₀, work out x₁ = g(x₀), then x₂ = g(x₁), and keep going. If the numbers settle, they have found a **root**, a value where x = g(x) exactly.

Each press of Step adds one row to the table (to six decimal places) and one more step to the diagram. The picture shows the line y = x and the curve y = g(x). The path goes up to the curve, across to the line, up to the curve again. It makes a staircase or a spiral that closes in on the root, or runs away if the rearrangement is no good. To explore more methods and graphs, see [[numerical-methods]], [[function-grapher]] and [[quadratic-explorer]].

## How to use it

1. Pick an equation and rearrangement, or choose "Type my own g(x)".
2. Set the start value x₀, then press Step, or Run 10 for ten steps at once.
3. Watch the table and the diagram, and read whether it is converging or diverging.
4. In A-level, read the slope test |g′(root)| and the comparison with Newton–Raphson.
5. Answer the quiz, which uses new numbers each time.

## What each setting does

- **Rearrangement:** different forms of the same equation behave very differently.
- **x₀:** where you start. Some starts converge to one root and some to another.
- **Step and Run 10:** how many iterations to do.
- **Diagram:** the orange path is the iteration, the green dot is the root.
- **Newton column (A-level):** the same start value, using Newton–Raphson instead.

## Worked example

Take x³ + 4x − 1 = 0 written as x = (1 − x³) ÷ 4 with x₀ = 0. Then x₁ = (1 − 0) ÷ 4 = 0.25, x₂ = (1 − 0.015625) ÷ 4 = 0.246094, and after a few more steps the value settles at 0.246263. The slope of g near the root is only about 0.045, so each step makes the error about 20 times smaller. The other rearrangement x = ∛(1 − 4x) has a slope of about −21 at the same root, so it moves away from it.

## FAQs

**Why does one rearrangement work and another fail?** It depends on how steep g is at the root. If |g′| is less than 1, errors shrink. If it is more than 1, they grow.

**What do the staircase and the spiral mean?** A staircase happens when g slopes up (between 0 and 1), a spiral when it slopes down (between −1 and 0).

**Is Newton–Raphson better?** Usually much faster, but it needs the derivative. The A-level view compares the number of steps for both.
