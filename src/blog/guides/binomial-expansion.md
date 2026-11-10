---
title: "Binomial expansion: expand (ax + b)ⁿ with Pascal's triangle"
summary: "How the binomial theorem multiplies out (ax + b)ⁿ, where Pascal's triangle fits in, how to find the general and middle terms, and why a Galton board gives the same numbers."
tools: [binomial-expansion, combinatorics-calculator, distribution-explorer, probability-tree]
updated: 2026-11-10
sources:
  - "The binomial theorem, Pascal's rule C(n, r) = C(n − 1, r − 1) + C(n − 1, r) and the binomial distribution: standard school and university mathematics."
  - "Worked example numbers were produced with the tool's own code (src/lib/sci/school-binomial.ts) and checked by hand."
---

Multiplying (3x − 1) by itself four times by hand takes a page of working and invites slips. The [[binomial-expansion]] tool does it in one step for any (ax + b)ⁿ, shows where each coefficient comes from in Pascal's triangle, and lets you build any single term on its own. It is written for students meeting the binomial theorem in Class 11, and for anyone who wants to check an expansion quickly. If the C(n, r) numbers are new to you, start with the [[combinatorics-calculator]]; once the expansion makes sense, the [[distribution-explorer]] and the [[probability-tree]] show how the same numbers turn into probabilities.

## What it is

A **binomial** is an expression with two parts, such as ax + b. Raising it to a whole-number power n means multiplying n copies together. Every term in the answer is made by choosing either ax or b from each bracket and multiplying the choices.

Suppose you pick b from exactly r of the n brackets and ax from the rest. That gives (ax)ⁿ⁻ʳ bʳ. The number of ways to pick which r brackets is **C(n, r)**, read "n choose r". Collect the like terms and you get the **general term**:

T(r+1) = C(n, r) × (ax)ⁿ⁻ʳ × bʳ

Here r runs from 0 to n, so there are always n + 1 terms. The label is r + 1 because the first term has r = 0.

The numbers C(n, r) form **Pascal's triangle**. Each row starts and ends with 1, and every other number is the sum of the two just above it. Row 4 is 1, 4, 6, 4, 1, so those are the coefficients of (x + y)⁴.

Two quick facts fall out of the formula. Put x = 1 and the whole expansion collapses to (a + b)ⁿ, which is the **sum of the coefficients**. And the **middle term** sits at r = n/2 when n is even; when n is odd there are two middle terms, at r = (n − 1)/2 and r = (n + 1)/2.

## How to use it

1. Type whole numbers into the **a** and **b** boxes. Each can be anything from −20 to 20; a minus sign on b is fine.
2. Move the **n** slider (0 to 12). The full expansion appears in large type straight away, with exact whole-number coefficients.
3. Look at **Pascal's triangle**. Row n is drawn in blue, and the entry for your current r is picked out in a second colour.
4. Move the **r** slider under *The general term*. The line below writes T(r+1) out in full: the C(n, r), the power of a, the power of b and the result.
5. Read the four facts beside it: the number of terms, the middle term or terms, the sum of the coefficients and the term with no x.
6. Press **Drop 100 balls** or **Drop 1000** on the Galton board, then **Empty** to clear it. The note under the board compares the middle slot with its expected share.

## A worked example

Expand (3x − 1)⁴, so a = 3, b = −1 and n = 4. Row 4 of the triangle is 1, 4, 6, 4, 1. The powers of 3x are 81x⁴, 27x³, 9x², 3x and 1. The powers of −1 are 1, −1, 1, −1, 1.

- r = 0: 1 × 81x⁴ × 1 = **81x⁴**
- r = 1: 4 × 27x³ × (−1) = **−108x³**
- r = 2: 6 × 9x² × 1 = **54x²**
- r = 3: 4 × 3x × (−1) = **−12x**
- r = 4: 1 × 1 × 1 = **1**

So (3x − 1)⁴ = 81x⁴ − 108x³ + 54x² − 12x + 1. There are 5 terms. Since n = 4 is even, the single middle term is T₃ = 54x². The sum of the coefficients is 81 − 108 + 54 − 12 + 1 = 16, and the shortcut agrees: (3 − 1)⁴ = 2⁴ = 16.

Now one term on its own. What is the coefficient of x³ in (x + 2)⁶? The power of x is 6 − r, so r = 3. T₄ = C(6, 3) × x³ × 2³ = 20 × 8 × x³ = **160x³**.

On the Galton board, set n = 6. A ball lands in slot 3 if it bounces right at exactly 3 of the 6 rows. There are C(6, 3) = 20 such paths out of 2⁶ = 64, so the expected share is 20 ÷ 64 = 0.3125, or about **31.3 %**.

## Where it is used

- **Probability.** The chance of exactly k successes in n tries, each with chance p, is C(n, k) pᵏ (1 − p)ⁿ⁻ᵏ. That is one term of the expansion of (p + (1 − p))ⁿ.
- **Approximations.** For small x, (1 + x)ⁿ is close to 1 + nx, a shortcut used to simplify physics formulas.

## Common mistakes

1. **Forgetting to raise a.** The term is C(n, r) × (ax)ⁿ⁻ʳ, not C(n, r) × a × xⁿ⁻ʳ. With a = 3 and n − r = 2, the factor is 9, not 3.
2. **Losing the sign of b.** When b is negative, bʳ is negative for odd r. Write b in brackets, (−1)³, before you multiply.
3. **Off-by-one with the term number.** T₄ means r = 3, not r = 4. Count from T₁.
4. **Reading the wrong row.** The coefficients of the fourth power come from the row that starts 1, 4, not the fourth row you can see if you count the top 1 as row 1.

## Questions people ask

**Can n be a fraction or negative?** Not in this tool. For those powers the expansion never ends, and it only works when x is small. School courses meet that series later.

**Why does the Galton board ignore a and b?** Each peg sends a ball left or right with equal chance, so it only uses the counts C(n, k). It shows the plain row of Pascal's triangle, scaled so the shares add up to 1.
