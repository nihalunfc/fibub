---
name: GP explorer
num: 1377
shelf: learn
code: L235
section: school-maths
title: "Geometric progression explorer: nth term, sum of n terms, sum to infinity and AM ≥ GM, drawn"
summary: "Slide the first term and the common ratio of a geometric progression and watch the terms as bars and the running sum settle on a/(1 − r) when |r| < 1. AM ≥ GM is drawn in a semicircle, and compound interest and depreciation are shown as the GPs they are."
status: live
ads: false
order: 1377
icon: chart
works: offline
updated: 2026-11-09
related: [ap-explorer, limit-zoom, binomial-expansion]
sources:
  - "Standard results on geometric progressions: aₙ = a rⁿ⁻¹, Sₙ = a(rⁿ − 1)/(r − 1), S∞ = a/(1 − r) for |r| < 1, AM ≥ GM ≥ HM with GM² = AM × HM for two positive numbers, and compound growth P(1 + i/100)ⁿ. Written for fibub."
  - "Checked against term-by-term sums in Python and on 300 random progressions; the semicircle construction for the means is the classical one (the half-chord at the join is √(ab))."
flow:
  - { icon: sliders, label: "Set a and r" }
  - { icon: chart, label: "Watch sums" }
  - { icon: compass, label: "AM ≥ GM" }
  - { icon: check, label: "Practise" }
---

## What it does

In a geometric progression (GP) each term is the one before multiplied by the same number r, the **common ratio**: 8, 4, 2, 1, … has r = ½. This page draws a GP so you can see what the formulas say:

- **Terms as bars.** Change the first term a and the ratio r and the bars change at once. A negative r makes them flip up and down; r above 1 makes them grow fast.
- **The running sum** Sₙ is the black line. When |r| < 1 the terms shrink to nothing and the line levels off at the dashed **sum to infinity**, a/(1 − r). When |r| ≥ 1 there is no such line.
- **AM ≥ GM.** Two numbers a and b sit end to end as the diameter of a semicircle. The radius is their arithmetic mean (a + b)/2 and the half-chord standing at the join is their geometric mean √(ab). A half-chord can never be longer than a radius, so AM ≥ GM, with equality only when a = b. Tick the box to add the harmonic mean, with GM² = AM × HM.
- **Money as a GP.** Compound interest multiplies a sum by 1 + i/100 every year, and depreciation by 1 − i/100: both are GPs.

It follows the Class 11 chapter *sequences and series* (GP, sum to infinity, AM and GM) and the compound interest work from Class 8.

Arithmetic progressions, where you add instead of multiply, are in [[ap-explorer]]; the idea of a sum settling on a value is the limit in [[limit-zoom]], and [[binomial-expansion]] comes next in the same book.

## How to use it

1. In **Terms and sums**, set a, r and the number of terms n (up to 15) with the sliders, or type values in the boxes.
2. Read the list of terms, the nth term, the sum of n terms and the sum to infinity, all with your numbers.
3. In **AM ≥ GM**, set two positive numbers and watch the radius (AM, blue) and the half-chord (GM, green).
4. In **Money as a GP**, type a starting amount, a yearly rate and a number of years, and pick compound interest or depreciation.

## A worked example

The page starts with a = 8, r = 0.5 and n = 8.

- Terms: 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625.
- S₈ = 8 × (0.5⁸ − 1)/(0.5 − 1) = 15.9375.
- S∞ = 8/(1 − 0.5) = 16. After 8 terms the sum is still 0.0625 short of 16, exactly the size of the last term.

With a = 4 and b = 9: AM = 6.5, GM = √36 = 6 and HM = 72/13 ≈ 5.5385; 6² = 6.5 × 5.5385.

10,000 at 8 % a year for 10 years becomes 10,000 × 1.08¹⁰ ≈ 21,589.25. It first doubles after 10 whole years (the exact time is 9.006 years; the rule of 72 says 9).

## Tips

- To find r, divide any term by the one before it.
- For 0 < r < 1 use Sₙ = a(1 − rⁿ)/(1 − r): it is the same formula with both signs flipped, and avoids negatives.
- A repeating decimal like 0.333… is a GP: 3/10 + 3/100 + … with r = 1/10, so it sums to 1/3.

## Check yourself

Five fresh questions each time: a term, a sum of n terms, a sum to infinity, a geometric mean and a depreciation. Fractions like 16/3 are accepted. Nothing is saved.

## FAQ

**Why does the money part say teaching model?** Real savings and loans have tax, fees and interest added monthly or daily. Here interest is added once a year at a fixed rate so the GP is easy to see.

**Is this from the NCERT book?** It covers the same topics with fibub's own examples. fibub is not part of NCERT.
