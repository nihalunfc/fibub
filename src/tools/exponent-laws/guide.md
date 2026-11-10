---
name: Exponent laws with tiles
num: 1236
shelf: learn
section: school-maths
title: "Laws of exponents: see aᵐ × aⁿ, aᵐ ÷ aⁿ, (aᵐ)ⁿ and aᵐ × bᵐ with factor tiles"
summary: "Slide the base and the exponents and watch rows of multiply and divide tiles join, cancel and repeat, so each law of exponents explains itself. Exact values check every answer; a ladder shows why a⁰ = 1 and a⁻ⁿ = 1/aⁿ."
status: live
ads: false
order: 1236
icon: sigma
works: offline
updated: 2026-11-09
related: [doubling-power, identity-tiles, scientific-notation-formatter]
sources:
  - "The laws of exponents for integer and rational exponents are standard algebra. Pictures, wording and examples are fibub's own."
  - "Checked against Python's fractions.Fraction (exact a**m * a**n, a**m / a**n, (a**m)**n and a**m * b**m) for every base 2 to 10 and every exponent from −6 to 8."
flow:
  - { icon: pointer, label: "Pick a law" }
  - { icon: sliders, label: "Set a, m, n" }
  - { icon: eye, label: "See tiles" }
  - { icon: check, label: "Check" }
---

## What it does

An exponent counts how many times you multiply by the base: 2³ = 2 × 2 × 2. This page draws every power as a row of **tiles**: a solid tile means "× a", and for negative exponents a dashed tile means "÷ a". Then the four laws of exponents happen in front of you:

- **aᵐ × aⁿ = aᵐ⁺ⁿ**: the two rows join, so the tiles add up.
- **aᵐ ÷ aⁿ = aᵐ⁻ⁿ**: dividing by aⁿ adds n dashed tiles; each solid and dashed pair cancels (crossed out), and what is left is the answer.
- **(aᵐ)ⁿ = aᵐⁿ**: n rows of m tiles, so m × n tiles.
- **aᵐ × bᵐ = (ab)ᵐ**: pair each a with a b.

Under the picture, the law is written with your numbers, the factors are written out, and the exact values are multiplied to check that both sides agree. A ladder of a³, a², a¹, a⁰, a⁻¹, a⁻² shows why a⁰ = 1 and a⁻ⁿ = 1/aⁿ: every step to the right divides by a.

The **Level** switch: Class 8 uses exponents from 0 to 8; Class 9 allows negative exponents from −6 and adds a line on fractional exponents like a^(1/2) = √a.

It fits Class 8 Mathematics, *power play* (exponents, laws of exponents and negative exponents), and Class 9 *the world of numbers* (laws of exponents for real numbers). To see what fast growth looks like, open the [[doubling-power]] page; for another picture-based algebra rule, the [[identity-tiles]].

## How to use it

1. Pick a law with the buttons at the top.
2. Drag the sliders for the base **a** (and **b** for the last law) and the exponents **m** and **n**, or type values in the boxes.
3. Read the big line, then the tiles, then the "Check with values" line: it always ends in a tick when the law holds.
4. Switch to Class 9 to use negative exponents.

## A worked example

The page starts with 2³ × 2⁴. The first row has 3 tiles of × 2, the second 4 more, and nothing cancels, so 7 tiles are left: 2³ × 2⁴ = 2³⁺⁴ = 2⁷. The values agree: 8 × 16 = 128 and 2⁷ = 128.

Now pick aᵐ ÷ aⁿ with the same numbers. The 4 dashed ÷ 2 tiles cancel 3 solid × 2 tiles, and 1 dashed tile is left: 2³ ÷ 2⁴ = 2⁻¹ = 1/2. Check: 8 ÷ 16 = 1/2.

With (aᵐ)ⁿ you get 4 rows of 3 tiles: 12 tiles, so (2³)⁴ = 2¹² = 4,096. And 2³ × 5³ = (2 × 5)³ = 10³ = 1,000.

## Common mistakes

- 2³ × 2⁴ is **not** 2¹²: the rows join, they are not repeated.
- 2³ × 3⁴ cannot be joined into one power: the tiles are different numbers.
- a⁻ⁿ is not negative: 2⁻³ = 1/8, a small positive number.

## Check yourself

Five fresh questions: one for each law and one negative exponent written as a decimal. Type a number, press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**Why is a⁰ = 1 and not 0?** Zero tiles means you never multiplied by anything, and multiplying by nothing leaves 1, not 0. The ladder shows the same: a¹ ÷ a = 1.

**Is 0⁰ allowed?** The page keeps the base at 2 or more, where everything is well defined.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
