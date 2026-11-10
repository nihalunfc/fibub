---
name: Exponent laws
num: 1236
shelf: learn
code: L319
section: school-maths
title: "Laws of exponents: see aᵐ × aⁿ, aᵐ ÷ aⁿ, (aᵐ)ⁿ and aᵐ × bᵐ with factor tiles"
summary: "Slide the base and the exponents and watch rows of multiply and divide tiles join, cancel and repeat, so each law of exponents explains itself. Exact values check every answer; a ladder shows why a⁰ = 1 and a⁻ⁿ = 1/aⁿ."
status: live
ads: false
order: 1236
icon: sigma
works: offline
updated: 2026-11-10
related: [doubling-power, identity-tiles, scientific-notation-formatter, standard-form-ladder]
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

An exponent counts how many times you multiply by the base: 2³ = 2 × 2 × 2. This page draws each power as a row of **tiles**: solid means "× a", dashed means "÷ a". Then the laws happen in front of you:

- **aᵐ × aⁿ = aᵐ⁺ⁿ**: the rows join.
- **aᵐ ÷ aⁿ = aᵐ⁻ⁿ**: solid and dashed pairs cancel.
- **(aᵐ)ⁿ = aᵐⁿ**: n rows of m tiles.
- **aᵐ × bᵐ = (ab)ᵐ**: pair each a with a b.

Exact values check that both sides agree. A ladder of a³, a², a¹, a⁰, a⁻¹ shows why a⁰ = 1 and a⁻ⁿ = 1/aⁿ. A **Level** switch allows negative exponents for Class 9.

It fits Class 8 Mathematics, *power play* (laws of exponents). Next, see fast growth in [[doubling-power]], very large numbers in [[standard-form-ladder]], or another tile rule in [[identity-tiles]].

## How to use it

1. Pick a law.
2. Drag the sliders for **a** (and **b**) and exponents **m** and **n**, or type values.
3. Read the big line, the tiles, then "Check with values", which ends in a tick when the law holds.

## A worked example

2³ × 2⁴: 3 tiles plus 4 tiles, nothing cancels, so 2⁷. Check: 8 × 16 = 128 = 2⁷.

For 2³ ÷ 2⁴, 3 solid tiles cancel 3 of the 4 dashed ones, leaving 1 dashed: 2⁻¹ = 1/2. Check: 8 ÷ 16 = 1/2.

(2³)⁴ is 4 rows of 3 tiles: 2¹² = 4,096. And 2³ × 5³ = 10³ = 1,000.

## Common mistakes

- 2³ × 2⁴ is **not** 2¹²: rows join, they are not repeated.
- 2³ × 3⁴ cannot become one power: the bases differ.
- 2⁻³ is 1/8, not negative.

## Check yourself

Five fresh questions, one for each law and one negative exponent. Press **Check**; open the worked answer if needed. Nothing is saved.

## FAQ

**Why is a⁰ = 1?** Multiplying by nothing leaves 1. The ladder shows a¹ ÷ a = 1.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
