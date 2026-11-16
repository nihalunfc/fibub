---
name: Log explorer
num: 2130
shelf: learn
code: L325
section: school-maths
title: "Logarithms and exponential graphs: see the inverse"
summary: "Slide the base and watch y = b^x and its inverse y = log_b x mirror each other, then check the laws of logarithms with your own numbers."
status: live
ads: false
order: 2130
icon: sliders
works: offline
updated: 2026-11-16
related: [e-and-ln, exponent-laws, doubling-power]
sources:
  - "Exponent and logarithm laws are standard results. Grade levels follow the Ontario Ministry of Education course topics for MCR3U and MHF4U; check the official curriculum for the current wording. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Set" }
  - { icon: curve, label: "See" }
  - { icon: check, label: "Check" }
---

## What it does

An exponential function such as y = 2^x multiplies by the same factor every time x goes up by one. A logarithm undoes it: log base 2 of 8 asks "2 to what power makes 8?", and the answer is 3. This tool draws both curves on one graph so you can see they are mirror images in the line y = x, and it shows the matching numbers underneath.

Slide the base to see growth (base above 1) and decay (base between 0 and 1). In Grade 12 a second card lets you type two numbers and compare both sides of the laws of logarithms. Before this, practise powers with [[exponent-laws]] and [[doubling-power]]; afterwards, meet the special base in [[e-and-ln]].

## How to use it

1. Move the base slider. The blue curve is b^x and the orange curve is log base b of x.
2. Move the x slider. A dot on each curve shows the same pair of numbers, swapped.
3. Read the sentence under the graph, for example "2^3 = 8, so log base 2 of 8 = 3".
4. In Grade 12, enter m and n and compare the pairs in the list.
5. Try "Check yourself" for a fresh question each time.

## What each setting does

- **Base b**: the number being multiplied each step. Above 1 the curve rises; between 0 and 1 it falls.
- **x**: the exponent. The tool shows b^x and the logarithm that returns x.
- **m and n (Grade 12)**: the numbers in the laws log(mn) = log m + log n, log(m/n) = log m − log n and log(m^k) = k log m.

## Worked example

Base 2, x = 3: 2^3 = 8, so log base 2 of 8 = 3. The blue dot is at (3, 8) and the orange dot is at (8, 3): the inverse swaps the coordinates. With m = 8 and n = 32 in Grade 12, log(mn) = log 256 ≈ 2.408, and log 8 + log 32 ≈ 0.903 + 1.505 = 2.408.

## FAQs

**Why can the base not be 1 or negative?** 1 to any power is 1, so it never reaches other values and has no inverse. Negative bases do not give a smooth curve.

**Why does the log curve never touch the y axis?** No power of a positive base gives 0 or a negative number, so log x only exists for x above 0.

**Does this follow the Ontario curriculum?** It covers the usual Grade 11 and Grade 12 exponent and logarithm topics (MCR3U and MHF4U). fibub is not part of the Ontario government; check the official curriculum for the current course wording.

**Are my numbers saved?** No. Everything runs in your browser and nothing is stored or sent.
