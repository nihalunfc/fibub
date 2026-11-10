---
name: Divisibility test machine
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
updated: 2026-11-09
related: [hcf-lcm-venn, number-systems, number-theory-toolkit]
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

Is 98,736 divisible by 9? You could do the long division, or you could add its digits. This page runs every school divisibility rule from 2 to 11 on any whole number you type (up to 30 digits) and, more importantly, shows **why** the rules work:

- A row of buttons, one for each divisor from 2 to 11, each with a ✓ or ✗.
- Tap one to see the rule worked with your digits, and the real division (quotient and remainder) next to it, so you can trust the rule.
- A **place value picture**: for 3 and 9, each digit's value split into a multiple of 9 (999…) and the digit itself; for 11, into a multiple of 11 and ± the digit; for 2, 4, 5, 8 and 10, the places that are already multiples and the last digits that matter.
- **Digital roots**: add the digits again and again until one digit is left; that is the remainder on dividing by 9.
- **Casting out nines**: a quick check of a multiplication using digital roots.
- A table of the true remainders on dividing by 2 to 11.

It fits Class 8 Mathematics, *number play* (divisibility tests, digit sums, digital roots and number puzzles), and is useful in Class 6 and 7 for factors and multiples. To find common factors and multiples, try the [[hcf-lcm-venn]]; to write numbers in other bases, the [[number-systems]] translator.

## How to use it

1. Type a whole number or tap an example. Commas are ignored.
2. Look at the row of divisors: green ✓ means it divides exactly.
3. Tap a divisor to see its rule, the division check and the picture.
4. In **Digital root and remainders**, type a second number to check a multiplication by casting out nines.

## The rules, in one line each

- **2, 5, 10**: look at the last digit. **4**: the last two digits. **8**: the last three digits.
- **3, 9**: the digit sum. **11**: the alternating sum of the digits, starting with + at the ones.
- **6**: both 2 and 3. **7**: drop the last digit and subtract twice it; repeat.

## A worked example

The page starts with 98,736. The ones digit 6 is even (✓ 2); 36 is a multiple of 4 (✓ 4); 736 = 8 × 92 (✓ 8). The digit sum is 9 + 8 + 7 + 3 + 6 = 33, a multiple of 3 but not of 9 (✓ 3, ✗ 9), so it is also divisible by 6. From the right, 6 − 3 + 7 − 8 + 9 = 11 (✓ 11). For 7: 9873 − 12 = 9861, 986 − 2 = 984, 98 − 8 = 90, 9 − 0 = 9, not a multiple of 7 (✗). The digital root is 98736 → 33 → 6, and indeed 98,736 = 9 × 10,970 + 6.

Casting out nines with 457: the digital roots are 6 and 7, 6 × 7 = 42 → 6, and the product 45,122,352 also has digital root 6.

## Check yourself

Five fresh questions: a remainder on dividing by 9, a digital root, a missing digit for divisibility by 9, an alternating digit sum, and the digital root of a product. Type a number, press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**Does casting out nines prove a multiplication is right?** No: it catches most mistakes, but swapping two digits, for example, keeps the digital root the same.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
