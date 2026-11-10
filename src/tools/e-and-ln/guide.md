---
name: e and ln
num: 1468
shelf: learn
code: L305
section: school-maths
title: "e and ln"
summary: "Slide the base of y = aˣ and watch slope ÷ height stay the same at every point; find the one base, e = 2.718…, where the slope equals the height. Meet the same e in compound interest and in 1 + 1 + 1/2! + …, and see ln x as the mirror of eˣ with slope 1/x."
status: live
ads: false
order: 1468
icon: curve
works: offline
updated: 2026-11-09
related: [derivative-slope, chain-rule, derivative-steps, log-scale-calculator]
sources:
  - "Standard results: d/dx aˣ = aˣ ln a, e = lim (1 + 1/n)ⁿ = Σ 1/k!, ln x as the inverse of eˣ, d/dx ln x = 1/x. Written for fibub; no textbook text, figures or exercises are used."
  - "Checked against mpmath (30 digits, shipped with sympy 1.14): ln 2, ln 3, ln 2.5 and ln 10, (1 + 1/n)ⁿ for n from 1 to a million, partial sums of Σ 1/k!, the value of e and slopes of 2ˣ."
flow:
  - { icon: sliders, label: "Base a" }
  - { icon: curve, label: "Slope" }
  - { icon: target, label: "Find e" }
  - { icon: percent, label: "Interest" }
---

## What it shows

Every exponential curve y = aˣ has a neat habit: its slope at any point is a fixed multiple of its height there. For y = 2ˣ the slope is always about 0.693 times the height; for y = 3ˣ it is about 1.099 times. Somewhere between 2 and 3 there is a base where the multiple is exactly 1, so the slope *equals* the height everywhere. That base is **e = 2.71828…**, and that is why calculus prefers eˣ to every other exponential: it is its own derivative.

The page shows this three ways. The main picture draws y = aˣ with a bar for the height at P and a blue step for the rise of the tangent over 1 unit, so you can compare them by eye. The interest box finds the same e in money: 1 rupee at 100 % a year, compounded more and more often, grows to (1 + 1/n)ⁿ, which creeps up to e. And the mirror picture shows ln x, the reflection of eˣ in the line y = x, whose slope at x is 1/x.

It follows exponential and logarithmic functions in Class 11 maths and the derivatives of eˣ, aˣ and ln x in continuity and differentiability in Class 12 maths. Start from the idea of a slope in [[derivative-slope]]; afterwards, the [[chain-rule]] handles e^(3x) and ln(x² + 1), and [[derivative-steps]] differentiates any mix of them with the working shown.

## How to use it

1. **Level.** *Class 11* keeps to the picture and the interest, and works the slope out from a small step h. *Class 12* writes the derivative rule d/dx aˣ = aˣ ln a, draws eˣ faintly for comparison and adds the ln x mirror card.
2. **Slide the base a** from 1.2 to 4. Read *Slope ÷ height*: it changes with a but not with P.
3. **Move P** with its slider or by dragging along the picture. Height and slope both change; their ratio does not.
4. Press **Find the base where slope = height**. The base glides to 2.718 and the page names it.
5. **Slide n** in the interest box from 1 to a million and watch the money approach e. The table shows how slowly the gap closes.
6. In the mirror card, **move the point on ln x** and compare the two slopes.

## Worked example

With a = 2 and P at x = 1, the height is 2¹ = 2. The tangent's slope is 2 × ln 2 = 2 × 0.6931 = 1.3863, so slope ÷ height = 0.6931. Move P to x = −1: the height is 0.5, the slope 0.3466, and the ratio is still 0.6931. Now press the button: at a = e the ratio is 1, and at x = 1 the height and slope are both 2.7183.

In the interest box, n = 12 (monthly) gives (1 + 1/12)¹² = 2.613035, n = 365 gives 2.714567, and n = 1,000,000 gives 2.718280, just 0.0000014 short of e.

## Tips

- ln a is just the name for the "slope ÷ height" number of aˣ. That is why ln 2 ≈ 0.693 and ln e = 1.
- Because ln x is the mirror of eˣ, at x = 2 its slope is 1/2: the mirror point on eˣ has height 2, so slope 2, and mirrored slopes flip to their reciprocals.
- Any exponential can be rewritten with e: aˣ = e^(x ln a).

## FAQ

**Why not just use base 10?** You can, but then every derivative carries an extra factor ln 10 ≈ 2.3026. With base e that factor is 1.

**Is e exactly 2.718?** No, it never ends or repeats: 2.718281828459045…

**Is this page part of NCERT?** No. fibub is independent. It follows the topics of the Class 11 and 12 maths syllabus and uses none of the textbook's text or exercises.
