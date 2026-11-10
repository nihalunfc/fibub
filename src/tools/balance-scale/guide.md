---
name: Balance equations
num: 1250
shelf: learn
section: school-maths
title: "Balance equations"
summary: "Put x boxes and 1-weights on a two-pan balance, then solve the equation one move at a time: take the same from both pans or share both into equal groups until x is alone. Slide a guess to see the beam tip."
status: live
ads: false
order: 1250
icon: target
works: offline
updated: 2026-11-09
related: [algebra-tricks, linear-pair-solver, symbolic-algebra, identity-tiles]
sources:
  - "Solving linear equations by doing the same operation to both sides is standard school algebra. The pictures, equations and questions were written for fibub."
  - "Checked against Python's fractions.Fraction for every equation with 0 to 9 boxes and 0 to 30 weights on each side (solution, no solution, or every x)."
flow:
  - { icon: pencil, label: "Equation" }
  - { icon: target, label: "Balance" }
  - { icon: scissors, label: "Same moves" }
  - { icon: check, label: "x alone" }
---

## What it does

An equation is a balance. The left side and the right side weigh the same, and the job is to find the hidden weight of one box, **x**. On this page each **x box** is a blue square and each **1-weight** is a small orange disc. The equation 3x + 5 = x + 13 is three boxes and five weights on the left pan, one box and thirteen weights on the right.

You solve it the way you would with a real balance: whatever you do, do it to **both pans**, so the beam stays level.

- **− 1 from each** or **− all 1s you can**: lift the same weights off both pans.
- **− x from each**: lift a box off both pans.
- **Share into ... groups**: split both pans into equal groups and keep one group (this is dividing both sides).
- **Swap pans**: x = 4 is the same as 4 = x.

When a single box sits alone opposite some weights, you have solved it. A **guess** slider shows what happens when you try a value: the beam tips towards the heavier pan, and it is level only at the answer.

It follows the Class 8 maths chapter *Algebra Play*. Number tricks that lead to the same algebra are in [[algebra-tricks]], and two equations at once are in [[linear-pair-solver]].

## How to use it

1. Type the equation in the four boxes: x's and 1s on the left, x's and 1s on the right. Or press **New equation**.
2. Press the move buttons. Each move is written in the list under the scale with the new equation.
3. Stuck? Press **Hint**. Made a mess? **Start again**.
4. Move the **x** slider (or type a value) to test a guess. The text shows what each pan weighs.

## A worked example

Start with **3x + 5 = x + 13**.

1. **− x from each**: 2x + 5 = 13.
2. **− all 1s you can** (5 from each): 2x = 8.
3. **Share into 2 groups**: x = 4.

Check with the slider at x = 4: the left pan weighs 3 × 4 + 5 = 17, the right pan 4 + 13 = 17. Level. At x = 2 the left pan weighs 11 and the right 15, so the beam tips right and the page says "Too small".

## Tips

- Take the boxes off first, until only one pan has boxes. Then take the loose weights off that pan. Then share.
- If the boxes can't be shared evenly (3x = 7), the answer is a fraction: x = 7/3. The page tells you when this happens.
- 2x + 4 = 2x + 4 balances for every x; 2x + 4 = 2x + 6 never balances. Both happen when the boxes cancel completely.
- This picture only shows positive amounts. Equations with minus signs work the same way on paper: add the same to both sides.

## Check yourself

Four fresh questions each time: two equations to solve, one with a fraction answer, and a check of a guess. Nothing is saved.

## FAQ

**Why can't I take 1 off when one pan is empty?** Then you would take from only one side, and the balance (the equation) would no longer be true.

**Is this the NCERT book?** No. It covers the same topic with fibub's own pictures and questions. fibub is not part of NCERT.
