---
name: Standard form and powers-of-ten ladder
num: 1237
shelf: learn
section: school-maths
title: "Standard form (scientific notation) converter with a powers-of-ten ladder from atoms to galaxies"
summary: "Type any number and watch the decimal point hop to write it as a × 10ⁿ, then go back again. Place it on a ladder of sizes from a proton to the observable universe, and compare two sizes with the laws of exponents."
status: live
ads: false
order: 1237
icon: ruler
works: offline
updated: 2026-11-09
related: [exponent-laws, doubling-power, scientific-notation-formatter, number-systems]
sources:
  - "Standard form, significant figures and order of magnitude are standard school mathematics and science. Wording, pictures and examples are fibub's own."
  - "Ladder sizes are well-known round figures: a proton about 1.7 × 10⁻¹⁵ m, an atom about 10⁻¹⁰ m, the Earth's diameter 12,740 km, the Moon's average distance 384,400 km, the Sun's diameter 1.392 million km, 1 astronomical unit about 1.496 × 10¹¹ m, 1 light year 9.461 × 10¹⁵ m, the Milky Way about 100,000 light years, the observable universe about 8.8 × 10²⁶ m across."
  - "Conversions are done on the typed digits as text, so they are exact; checked against Python's decimal module (Decimal(x).normalize() and its adjusted() exponent) for random numbers from 10⁻²⁰ to 10²⁰."
flow:
  - { icon: pencil, label: "Type it" }
  - { icon: pointer, label: "Point hops" }
  - { icon: ruler, label: "Ladder" }
  - { icon: check, label: "Check" }
---

## What it does

Very big and very small numbers are hard to read: 384400000 and 0.00072 need careful counting of zeros. **Standard form** (also called scientific notation) writes every number as **a × 10ⁿ**, where a is from 1 up to (not including) 10 and n is a whole number. This page:

- turns any number you type into standard form, and draws the digits with arrows showing the decimal point hopping, one place at a time;
- explains the sign of n: big numbers (the point moves left) get a positive n, small numbers (the point moves right) a negative n;
- turns a × 10ⁿ back into an ordinary number;
- puts your number on a **powers-of-ten ladder** of sizes, from a proton to the observable universe, and says what it sits between;
- compares two sizes on the ladder by dividing the fronts and subtracting the powers.

A **Level** switch adds the Class 11 view: how many **significant figures** the number has, and its **order of magnitude** (the nearest power of ten on a log scale).

It fits Class 8 Mathematics, *power play* (powers of 10, standard form, very large and very small numbers), and Class 11 Physics and Chemistry, where measurements use scientific notation and significant figures. For the rules behind the comparisons, see [[exponent-laws]]; for fast growth through the powers of ten, [[doubling-power]]; and to format real data, the [[scientific-notation-formatter]].

## How to use it

1. Type a number in the first box: an ordinary number like 0.00072 or 384400000 (commas are fine), or a form like 6.02e23 or 6.02 × 10^23.
2. Read the standard form, the hop picture (red dot: where the point is; green dot: where it goes) and the explanation.
3. In **And back again**, type a and n to get the ordinary number.
4. On the ladder, tap any thing to load its size. The orange line marks your number, read as metres.
5. In **How many times bigger?**, pick two things.

## A worked example

The page starts with 384400000, the average distance to the Moon in metres. The point moves 8 places left to give 3.844, so 384,400,000 = 3.844 × 10⁸. On the ladder it sits between the Earth (1.274 × 10⁷ m across) and the Sun (1.392 × 10⁹ m across). In the Class 11 view it has 4 significant figures (3, 8, 4, 4) and its order of magnitude is 10⁹, because 3.844 is more than √10 ≈ 3.162.

The back-again box starts with 2.5 × 10⁻⁶: move the point 6 places left to get 0.0000025. And the Earth to Sun distance divided by the Earth to Moon distance is (1.496 ÷ 3.844) × 10¹¹⁻⁸ = 0.3892 × 10³ ≈ 3.89 × 10²: the Sun is about 389 times farther away.

## Check yourself

Five fresh questions: a big number and a small number into standard form (type a and n, like 3.45, 5), one back to an ordinary number, a multiplication in standard form, and a "how many times bigger" with powers of ten. Nothing is saved.

## FAQ

**Why must a be less than 10?** So that every number has exactly one standard form. 38.44 × 10⁷ is the same number, but it is not in standard form.

**Why does 12000 have 2 significant figures but 12000.0 has 6?** Trailing zeros in a whole number might only be place holders, so they are not counted unless a decimal point shows they were measured.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
