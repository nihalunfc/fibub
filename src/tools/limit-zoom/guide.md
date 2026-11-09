---
name: Limit zoom
num: 1185
shelf: learn
section: school-maths
title: "Limits and continuity visualiser: zoom in on a point, left and right tables, sin x / x → 1, holes and jumps"
summary: "Zoom in on a function near a point and watch where it heads from the left and from the right, with tables of values closing in, the sector picture behind sin x / x → 1, and a Class 12 view that sorts each point as continuous, a hole, a jump, an infinite break or an endless wobble."
status: live
ads: false
order: 1185
icon: search
works: offline
updated: 2026-11-09
related: [derivative-slope, function-grapher, unit-circle, riemann-sums]
sources:
  - "Standard calculus: one-sided limits, the limit sin x / x → 1 by comparing areas, the standard limits (xⁿ − aⁿ)/(x − a) → n aⁿ⁻¹ and (eˣ − 1)/x → 1, and the definition of continuity. Written for fibub; no textbook text, figures or exercises are used."
  - "Checked against sympy 1.14: left-hand and right-hand limits of every example and of three typed functions (sympy.limit with '-' and '+')."
flow:
  - { icon: curve, label: "Pick f(x)" }
  - { icon: search, label: "Zoom in" }
  - { icon: table, label: "Both sides" }
  - { icon: check, label: "Verdict" }
---

## What it shows

The **limit** of f(x) as x approaches a is the number f(x) gets close to when x gets close to a, from both sides, whatever happens *at* a itself. Often f(a) is fine and the limit is just f(a). The interesting cases are the ones where you cannot simply put x = a in: 0/0 forms like sin x / x at 0, steps, and curves that shoot off to infinity.

This page draws the function around the point and lets you **zoom in** (down to a window of ± 0.0004). Open circles show where the graph heads from each side and a filled dot shows the value f(a), if there is one. Two tables list f(x) at x = a − 0.1, a − 0.01, … and a + 0.1, a + 0.01, … so you can watch the numbers settle (or not).

It follows limits and derivatives in Class 11 maths and continuity and differentiability in Class 12 maths. Limits are what the [[derivative-slope]] page is built on; the [[unit-circle]] page explains radians, which the sin x / x limit needs; and the [[function-grapher]] draws any curve you want to explore further.

## How to use it

1. **Pick an example**, or choose *My own…*, type f(x) (such as `(x^3 - 1)/(x - 1)`) and the point a.
2. Slide **Zoom** or press **Zoom in** to close in on the point. **Zoom out** starts again.
3. Read the **left-hand** and **right-hand limits**. If they agree, the limit exists. If they differ, or one runs off to infinity, or the values never settle, there is no limit.
4. Switch the **Level** to Class 12 to see whether f is **continuous** at a, and what kind of break it has if not.
5. For **sin x / x**, a second picture shows the sector argument: slide the angle and read the three areas.

## The kinds of point

- **Continuous**: f(a) is defined, the limit exists, and they are equal. A corner (like |x| at 0) is still continuous.
- **Removable break (a hole)**: the limit exists but f(a) is missing or different. Defining f(a) as the limit mends it.
- **Jump**: the left and right limits are different numbers, like |x| / x or the greatest integer function [x].
- **Infinite break**: the values grow without bound, like 1/x² at 0.
- **No limit (wobbles)**: the values keep moving, like sin(1/x) at 0.

## Worked example

For (x² − 4)/(x − 2) near 2 the formula gives 0/0 at x = 2. The table from the left reads 3.9, 3.99, 3.999, … and from the right 4.1, 4.01, 4.001, … so the limit is **4**. Factoring shows why: (x − 2)(x + 2)/(x − 2) = x + 2 whenever x ≠ 2, a straight line with a hole at (2, 4).

For sin x / x, at x = 0.1 the value is 0.998334 and at 0.01 it is 0.999983: the limit is **1**. The sector picture gives the reason: comparing areas, cos x < sin x / x < 1, and cos x → 1.

## How the page finds a limit

It works out f at 0.1, 0.01, … 0.000001 either side of a. If the values settle, it reports the limit (sharpened with one extrapolation step); if they grow by a large factor each step it reports ±∞; otherwise it says there is no limit. The examples were checked against exact answers from sympy. For your own functions this is a numerical estimate, which can be fooled by very strange functions, so treat it as a guide and confirm with algebra.

## Check yourself

Five fresh questions: a factorising limit, sin(kx)/x, the standard limit (xⁿ − aⁿ)/(x − a), a one-sided limit of [x], and the kind of break of 1/(x − p)². Nothing is saved.

## FAQ

**Why can a limit exist when f(a) does not?** The limit only looks at values near a, never at a itself.

**Is this from my textbook?** It covers the standard school topics with its own examples and pictures. It is an independent study aid.
