---
name: SI prefixes trainer
num: 1254
shelf: learn
code: L139
section: school-physics
title: "SI prefixes trainer: convert between nano, micro, milli, kilo, mega and giga"
summary: "Convert any measurement between SI prefixes from pico to tera by moving the decimal point, see the jump on a prefix ladder, add two measurements only when they measure the same thing, and practise with fresh questions."
status: live
ads: false
order: 1254
icon: convert
works: offline
updated: 2026-11-09
related: [sig-fig-checker, dimensional-analysis, scientific-notation-formatter, unit-converter]
sources:
  - "SI prefixes and base units: BIPM, The International System of Units (SI Brochure), 9th edition, 2019. Pictures and questions written for fibub."
  - "Checked: conversions done on the digits as text match Python's decimal module for every prefix pair and 2 000 random values."
flow:
  - { icon: pencil, label: "Value" }
  - { icon: convert, label: "Prefixes" }
  - { icon: ruler, label: "Move point" }
  - { icon: check, label: "Practise" }
---

## What it does

Scientists write very big and very small measurements with **prefixes**: a kilometre is a thousand metres, a nanometre is a billionth of a metre. Each prefix is a power of ten:

| Prefix | Symbol | Power of ten |
|---|---|---|
| giga | G | 10⁹ |
| mega | M | 10⁶ |
| kilo | k | 10³ |
| centi | c | 10⁻² |
| milli | m | 10⁻³ |
| micro | µ | 10⁻⁶ |
| nano | n | 10⁻⁹ |

This page converts a value from one prefix to another and shows the rule: work out how many powers of ten apart the two prefixes are, and **move the decimal point** that many places. A **prefix ladder** shows the jump. The page does the arithmetic on the digits themselves, so 0.1 mm never turns into 0.000099999 m.

A second box adds two measurements. It changes both to the smaller prefix first, and refuses to add things that measure different quantities, like metres and seconds. That is the **unit consistency** check every equation must pass.

It fits the Class 9 science chapter *Exploration: Entering the World of Secondary Science* (SI units) and the Class 11 physics chapter *Units and Measurement*. Rounding to the right number of figures is in [[sig-fig-checker]], and checking that both sides of an equation have the same units is in [[dimensional-analysis]].

## How to use it

1. Type a value, pick its prefix and unit, and pick the prefix to convert to.
2. Read the answer, the steps, and the same answer in standard form (like 4.5 × 10⁻⁵).
3. Follow the arrow on the ladder: going **down** to a smaller prefix makes the number bigger (point moves right); going **up** makes it smaller.
4. In **Add two measurements**, type two values with their prefixes and units.

## A worked example

The page starts with **2.5 km to cm**.

- 1 km = 10³ m and 1 cm = 10⁻² m, so 1 km = 10³ ÷ 10⁻² = 10⁵ cm.
- Move the decimal point 5 places right: 2.5 → 250 000.
- So 2.5 km = 250 000 cm = 2.5 × 10⁵ cm.

In the adding box, 1.2 km + 350 m: change 1.2 km to 1 200 m, then 1 200 + 350 = 1 550 m.

## Tips

- Capital and small letters matter: **m** is milli but **M** is mega; **k** (kilo) is always small.
- Prefixes for mass go on the **gram**, even though the SI base unit is the kilogram.
- The prefixes between kilo and milli (hecto, deca, deci, centi) are used less in science, except the centimetre.

## Check yourself

Five fresh questions: three conversions, a prefix's power of ten, and which quantities can be added. Nothing is saved.

## FAQ

**Why move the point and not multiply?** It is the same thing: multiplying by 10³ moves the decimal point 3 places right. Moving the point is quicker and avoids rounding slips.

**Is this the NCERT book?** No. It covers the same topic with fibub's own examples and questions. fibub is not part of NCERT.
