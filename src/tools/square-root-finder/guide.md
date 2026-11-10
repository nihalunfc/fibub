---
name: Square root finder
num: 1232
shelf: learn
code: L111
section: school-maths
title: "Square root finder: prime factors, odd-number subtraction, estimation and long division, step by step"
summary: "Type a number and find its square root four ways with every step shown: pair up prime factors (with the simplest surd form), subtract odd numbers, estimate between two squares and improve the guess, or use the long division method for decimals."
status: live
ads: false
order: 1232
icon: calculator
works: offline
updated: 2026-11-09
related: [square-cube-builder, hcf-lcm-venn, identity-tiles, pythagoras-proofs]
sources:
  - "Square roots by prime factorisation, by repeated subtraction of odd numbers, by estimation between squares, by Heron's (Babylonian) method x → (x + n/x)/2 and by the long division method are standard school arithmetic. Wording, pictures and examples are fibub's own."
  - "Long division digits checked with exact integer arithmetic against Python's math.isqrt for every whole number to 100,000 and for decimals such as 2, 10 and 12.25."
flow:
  - { icon: pencil, label: "Number" }
  - { icon: sliders, label: "Method" }
  - { icon: table, label: "Steps" }
  - { icon: check, label: "Root" }
---

## What it does

The **square root** of a number is what you multiply by itself to get it: √49 = 7 because 7 × 7 = 49. Picture a square with that area: the square root is the length of its side. This page finds square roots four ways and shows every step, so you can follow the method rather than just press a button.

- **Prime factors**: split the number into primes and pair up equal ones. One prime from each pair multiplies to the root. If a prime is left without a partner, the number is not a perfect square, and the page writes the root in its simplest **surd** form, like √72 = 6√2.
- **Odd numbers**: take away 1, 3, 5, 7, ... in turn. Landing exactly on 0 means a perfect square, and the number of steps is the root (because the first n odd numbers add up to n²).
- **Estimate**: find the two square numbers either side, share out the gap for a first guess, then improve it with **new guess = (guess + number ÷ guess) ÷ 2**. Each step roughly doubles the number of correct digits.
- **Long division**: the pencil-and-paper method that gives one digit at a time, and also works for decimals.

It follows Class 8 Maths, a square and a cube (square roots by prime factorisation, repeated subtraction and estimation), and helps with surds in Class 9 (simplifying √72 = 6√2). For pictures of squares and cubes growing, open the [[square-cube-builder]]; for prime factor trees, [[hcf-lcm-venn]]; and for where square roots turn up in right triangles, the [[pythagoras-proofs]] playground.

## How to use it

1. Type a number in the box (whole or decimal, like 7056 or 12.25), or tap a quick example.
2. The picture shows a square of that area and a number line with the two nearest square numbers. The big line gives the root, or says it is not a perfect square.
3. Pick a **method**: **Prime factors**, **Odd numbers**, **Estimate** or **Long division**. The steps update as you type.

## Worked example

The page opens with **7056**.

- Prime factors: 7056 = (2 × 2) × (2 × 2) × (3 × 3) × (7 × 7). Every prime is in a pair, so √7056 = 2 × 2 × 3 × 7 = **84**.
- Odd numbers: 7056 − 1 = 7055, 7055 − 3 = 7052, ... after 84 subtractions it reaches exactly 0.
- Long division: pairs 70 | 56. The biggest digit whose square fits in 70 is 8 (64), leaving 6. Bring down 56 to get 656; the divisor is 2 × 8 = 16, and 164 × 4 = 656 exactly. So √7056 = 84.

Now try **40**: it lies between 36 = 6² and 49 = 7², so the first guess is 6 + 4 ÷ 13 = 6.3077. One improving step gives 6.324573 and the next 6.324555, already right to six decimal places. And **72** = (2 × 2) × (3 × 3) × 2: the last 2 has no partner, so √72 = 2 × 3 × √2 = 6√2 ≈ 8.4853.

## Check yourself

Five fresh questions: the root of a perfect square, the number of odd-number steps, a simplest surd form, the two whole numbers a root lies between, and the root of a decimal. Nothing is saved.

## FAQ

**Why can a square root not end in a remainder?** For a perfect square, every method ends exactly. If the long division keeps leaving a remainder, the root is an irrational number whose decimals never end or repeat, like √2 = 1.41421356...

**Which method should I use in an exam?** Prime factors for perfect squares you can factor; long division for big numbers and decimals; estimation to check that an answer is sensible.

**Is this from the NCERT book?** It covers the same topics with fibub's own pictures and examples. fibub is not part of NCERT.
