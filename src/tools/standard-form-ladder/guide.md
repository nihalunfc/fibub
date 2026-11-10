---
name: Standard form
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
updated: 2026-11-10
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

Numbers like 384400000 and 0.00072 need careful zero counting. **Standard form** writes every number as **a × 10ⁿ**, with a from 1 up to (not including) 10 and n a whole number. This page:

- turns a typed number into standard form, with arrows showing the decimal point hopping;
- explains the sign of n: big numbers get a positive n, small numbers a negative n;
- turns a × 10ⁿ back into an ordinary number;
- places your number on a **powers-of-ten ladder** from a proton to the universe;
- compares two sizes by dividing the fronts and subtracting the powers.

A **Level** switch adds Class 11: significant figures and order of magnitude.

It fits Class 8 Mathematics, *power play* (powers of 10, very large and small numbers). For the rules behind it see [[exponent-laws]]; for fast growth, [[doubling-power]]; to format real data, the [[scientific-notation-formatter]].

## How to use it

1. Type a number such as 0.00072, 384,400,000 or 6.02e23.
2. Read the standard form and the hop picture.
3. In **And back again**, type a and n.
4. On the ladder, tap a thing to load its size.
5. In **How many times bigger?**, pick two things.

## A worked example

384400000 m, the Moon's distance: the point moves 8 places left, so it is 3.844 × 10⁸. It sits between the Earth (1.274 × 10⁷ m) and the Sun (1.392 × 10⁹ m) in width. It has 4 significant figures, and order of magnitude 10⁹ because 3.844 > √10.

Back again: 2.5 × 10⁻⁶ moves the point 6 places left to give 0.0000025. Earth to Sun over Earth to Moon is (1.496 ÷ 3.844) × 10³ ≈ 3.89 × 10², about 389 times farther.

## Check yourself

Five fresh questions: big and small numbers into standard form, one back to ordinary form, a multiplication and a "how many times bigger". Nothing is saved.

## FAQ

**Why must a be less than 10?** So every number has exactly one standard form. 38.44 × 10⁷ is the same number but not in standard form.

**Why does 12000 have 2 significant figures?** Trailing zeros may only be place holders, so they are not counted.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
