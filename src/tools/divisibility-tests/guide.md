---
name: Divisibility tests
num: 1239
shelf: learn
section: school-maths
title: "Divisibility rules 2 to 11, and why they work: digit sums, digital roots and casting out nines"
summary: "Type any whole number and see the divisibility rules for 2 to 11 worked on its digits, with the true remainder alongside. A place value picture shows why the rules for 3, 9 and 11 work, plus digital roots and casting out nines."
status: live
ads: false
order: 1239
icon: check
works: offline
updated: 2026-11-10
related: [hcf-lcm-venn, number-theory-toolkit]
sources:
  - "The divisibility rules, digit sums, digital roots and casting out nines are standard number theory (place value and remainders). Wording, pictures and examples are fibub's own."
  - "Checked against Python's % operator for the example numbers and, on 3,000 random numbers of up to 30 digits, every rule's verdict against the true remainder."
flow:
  - { icon: pencil, label: "Type it" }
  - { icon: check, label: "Rules 2–11" }
  - { icon: eye, label: "See why" }
  - { icon: sigma, label: "Remainders" }
---

## What it does

Is 98,736 divisible by 9?  This page runs every school divisibility rule from 2 to 11 on any whole number you type (up to 30 digits) and, more importantly, shows **why** the rules work:

- A row of buttons, one for each divisor from 2 to 11, each with a ✓ or ✗.
- Tap one to see the rule worked with your digits, and the real division (quotient and remainder) next to it, so you can trust the rule.
- A **place value picture**: for 3 and 9, each digit's value split into a multiple of 9 and the digit itself; for 11, a multiple of 11 and ± the digit.
- **Digital roots** (add digits until one is left; the remainder on dividing by 9) and **casting out nines**, a quick check of a multiplication.

It fits Class 8 Mathematics, *number play* (divisibility tests, digit sums, digital roots and number puzzles). To find common factors and multiples, try the [[hcf-lcm-venn]]; for more number properties, the [[number-theory-toolkit]].

## How to use it

1. Type a whole number or tap an example. Commas are ignored.
2. Green ✓ means it divides exactly. Tap a divisor to see its rule and the picture.
3. In **Digital root and remainders**, type a second number to check a multiplication by casting out nines.

## A worked example

The page starts with 98,736. The ones digit 6 is even (✓ 2); 36 is a multiple of 4 (✓ 4); 736 = 8 × 92 (✓ 8). The digit sum is 9 + 8 + 7 + 3 + 6 = 33, a multiple of 3 but not of 9 (✓ 3, ✗ 9), so it is also divisible by 6. From the right, 6 − 3 + 7 − 8 + 9 = 11 (✓ 11). It is not a multiple of 7 (✗). The digital root is 98736 → 33 → 6, and indeed 98,736 = 9 × 10,970 + 6.


## Check yourself

Five fresh questions on remainders, digital roots and missing digits. Type a number, press **Check**, and open the worked answer if you need it.

## FAQ

**Does casting out nines prove a multiplication is right?** No: it catches most mistakes, but swapping two digits, for example, keeps the digital root the same.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
