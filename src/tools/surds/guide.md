---
name: Surds
num: 2281
shelf: learn
code: L357
section: school-maths
title: "Surds: simplify, add, multiply, expand and rationalise"
summary: "Simplify square roots with square tiles, add and multiply surds, expand brackets and rationalise denominators with the conjugate, with every step shown and a number line to check the decimal."
status: live
ads: false
order: 2281
icon: sigma
works: offline
updated: 2026-11-16
related: [irrational-proof, exponent-laws, number-line-zoom]
sources:
  - "Surds are standard school algebra: √(ab) = √a × √b, like surds, expanding brackets and rationalising with the conjugate (p + √q)(p − √q) = p² − q. Serves GCSE maths (higher tier number), A-level pure maths, Common Core HSN-RN.B.3 (sums and products of rational and irrational numbers) and Ontario MPM2D and MCR3U radicals. Checked against hand-worked values in tests/curr-maths.mjs. Pictures are fibub's own."
flow:
  - { icon: pencil, label: "Type" }
  - { icon: sigma, label: "Steps" }
  - { icon: ruler, label: "Check" }
  - { icon: check, label: "Quiz" }
---

## What it does

A **surd** is a square root that cannot be written as a whole number or a simple fraction, like √2 or √7. Leaving it as a root keeps the answer exact, because a decimal such as 1.41421 is only an approximation. Surds follow a few rules: √(ab) = √a × √b, and you can only add or subtract **like surds**, which have the same number under the root.

Choose what to do and type your numbers. To simplify √n the page finds the largest square factor and shows square tiles: n unit squares grouped into blocks that are perfect squares, so the side of a block is the number outside the root. You can also add, subtract, multiply, expand brackets such as (a + √b)(c + √d), and rationalise a denominator, each with every step written out. Why some roots can never be fractions is in [[irrational-proof]]; powers and roots together are in [[exponent-laws]], and [[number-line-zoom]] shows where these numbers sit.

## How to use it

1. Pick an operation from the menu. At A-level, expanding and rationalising also appear.
2. Type whole numbers in the boxes. The expression, steps and answer update as you type.
3. Check the number line and the "check with decimals" line: the question and the answer must match.
4. Answer the quiz. Type surds like 3√2, or 3sqrt(2) if you cannot type the root sign.

## What each setting does

- **Simplify:** finds the biggest square factor of n.
- **Add or subtract:** simplifies each term first, then combines like surds.
- **Multiply:** multiplies the numbers in front and the numbers under the roots.
- **Expand:** multiplies out two brackets, then simplifies and collects.
- **Rationalise:** removes the root from the bottom using √a ÷ √a or the conjugate.

## Worked example

Simplify √72. The largest square factor of 72 is 36, because 72 = 36 × 2. So √72 = √36 × √2 = 6√2. On the tiles, 72 squares make two blocks of 36, each 6 by 6. As a check, √72 is about 8.4853 and 6√2 is 6 × 1.41421 = 8.4853. To rationalise 1 ÷ (3 + √2), multiply top and bottom by 3 − √2: the bottom becomes 9 − 2 = 7, so the answer is (3 − √2) ÷ 7.

## FAQs

**Why not just use a calculator?** A calculator gives a decimal, but exam questions ask for the exact answer, and exact forms stay exact in later working.

**What is the conjugate?** The same two terms with the sign between them flipped. Multiplying by it makes the roots cancel because (p + √q)(p − √q) = p² − q.

**Can I add √2 and √3?** No. They are not like surds, so √2 + √3 cannot be simplified.
