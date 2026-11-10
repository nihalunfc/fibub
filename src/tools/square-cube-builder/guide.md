---
name: Squares and cubes
num: 1229
shelf: learn
code: L108
section: school-maths
title: "Squares and cubes"
summary: "Grow a square out of odd-numbered L-shapes and a cube out of unit cubes. Test any number for being a perfect square or cube from its prime factors, find the smallest number that makes it one, and hunt numbers like 1729 that are a sum of two cubes in two ways."
status: live
ads: false
order: 1229
icon: sigma
works: offline
updated: 2026-11-09
related: [hcf-lcm-venn, identity-tiles, pythagoras-proofs, number-theory-toolkit]
sources:
  - "Squares and cubes, the sum of the first n odd numbers n², n³ − (n − 1)³ = 3n² − 3n + 1, perfect powers from prime factorisation, and the taxicab number 1729 (Hardy and Ramanujan) are standard number facts. Wording, pictures and examples are fibub's own."
  - "Taxicab numbers checked against a brute-force Python search (1729, 4104, 13832, 20683, 32832, 39312, 40033, 46683 below 50,000) and OEIS A001235."
flow:
  - { icon: sliders, label: "Pick n" }
  - { icon: eye, label: "Build it" }
  - { icon: search, label: "Test number" }
  - { icon: check, label: "Check" }
---

## What it does

A **square number** is what you get when you lay unit squares out in an n × n square: n² of them. A **cube number** is what you get when you stack unit cubes into an n × n × n cube: n³ of them. This page builds both so you can see them grow.

The square is coloured in **L-shapes**: 1 square in the corner, then 3 round it, then 5, then 7... Each L is the next odd number, which is why **1 + 3 + 5 + ... + (2n − 1) = n²**. The cube shows n layers of n² cubes, and how many new cubes wrap round it each time it grows by one: **3n² − 3n + 1**.

Below the builder, type any number to see its prime factors and whether it is a **perfect square** (every prime comes in pairs) or a **perfect cube** (every prime comes in threes), which squares or cubes it sits between, and the **smallest number to multiply or divide by** to make it one. The last card hunts **taxicab numbers**, such as 1729 = 1³ + 12³ = 9³ + 10³, the number Ramanujan famously spotted in a taxi's number plate.

It follows Class 8 Maths, a square and a cube (square numbers and their patterns, square roots by prime factorisation, cubes and cube roots, perfect cubes, the Hardy–Ramanujan number) and helps with powers in later classes. For prime factor trees, open [[hcf-lcm-venn]]; for squares built from tiles in algebra, try the [[identity-tiles]]; and for square numbers in right triangles, the [[pythagoras-proofs]] playground.

## How to use it

1. Pick **Square** or **Cube**, then set **n** from 1 to 12 with the slider, the box or the **− 1** and **+ 1** buttons.
2. Read the big line, the odd-number sum (square) or layers and shell (cube), and the table of n, n², n³ and the last digit of n² around your n.
3. Under **Is it a perfect square or cube?**, type any whole number up to a billion.
4. Under **Taxicab numbers**, press **Next taxicab number**, or type any number to see every way it can be written as a sum of two cubes.

## Worked example

With **n = 5**, the square shows 1 + 3 + 5 + 7 + 9 = 25 = 5², and going from 4² to 5² adds one L of 9 squares: 16 + 9 = 25. Switch to **Cube**: 5 layers of 25 make 125, and growing from 4³ to 5³ wraps a shell of 3 × 25 − 3 × 5 + 1 = 61 cubes: 64 + 61 = 125.

The number box starts at **1008 = 2⁴ × 3² × 7**. The 7 has no partner, so 1008 is not a perfect square: it lies between 961 = 31² and 1024 = 32². Multiply by 7 to get 7056 = 84², or divide by 7 to get 144 = 12². For a perfect cube you need 2⁶ × 3³ × 7³, so multiply by 2² × 3 × 7² = 588 to get 592,704 = 84³.

## Check yourself

Five fresh questions: a square, a cube, the sum of the first odd numbers, a cube root and the smallest multiplier for a perfect square. Nothing is saved.

## Tips

- A square never ends in 2, 3, 7 or 8, and a number ending in an odd count of zeros cannot be a square either.
- The square of an even number is even; the square of an odd number is odd. The same goes for cubes.
- To find a square root by prime factors, pair up equal primes and take one from each pair.

## FAQ

**Why only up to n = 12?** Beyond that the unit squares and cubes get too small to see on a phone. The number tester goes up to a billion.

**Is 1729 really the smallest taxicab number?** Yes, using positive cubes. With negative cubes allowed, 91 = 6³ + (−5)³ = 4³ + 3³ is smaller.

**Is this from the NCERT book?** It covers the same topics with fibub's own pictures and examples. fibub is not part of NCERT.
