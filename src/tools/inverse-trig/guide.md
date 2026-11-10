---
name: Inverse trig by reflection
num: 1460
shelf: learn
section: school-maths
title: "Inverse trigonometric functions: principal value calculator and graphs by reflection in y = x"
summary: "Reflect the graph of sin, cos, tan, cot, sec or cosec in the line y = x and see why only the principal branch gives a function. Type a value such as 1/2 or −sqrt(3)/2 to get the principal value in radians (as a fraction of π where it is a standard angle) and degrees, every other angle with the same ratio, and the sin⁻¹(sin θ) trap."
status: live
ads: false
order: 1460
icon: compass
works: offline
updated: 2026-11-09
related: [function-type, unit-circle, trig-ratios, derivative-slope]
sources:
  - "Standard school mathematics: inverse trigonometric functions, their domains and principal value branches (sin⁻¹ [−π/2, π/2], cos⁻¹ [0, π], tan⁻¹ (−π/2, π/2), cot⁻¹ (0, π), sec⁻¹ [0, π] − {π/2}, cosec⁻¹ [−π/2, π/2] − {0}) and their properties. Written for fibub; no textbook text, figures or exercises are used."
  - "Checked against sympy 1.14: principal values (asin, acos, atan, asec, acsc), every solution in [−2π, 2π] (solveset) and compositions such as asin(sin(5π/6)) for all six functions. sympy's acot uses a different range, so cot⁻¹ was checked as π/2 − tan⁻¹."
flow:
  - { icon: compass, label: "Pick a ratio" }
  - { icon: curve, label: "Reflect" }
  - { icon: calculator, label: "Type x" }
  - { icon: target, label: "Principal" }
---

## What it shows

sin x takes the value 1/2 at π/6, 5π/6, 13π/6 and infinitely many other angles, so "the angle whose sine is 1/2" has no single answer. To make an inverse function you keep one piece of the graph, the **principal branch**, where the function takes each of its values exactly once. Reflect that piece in the line y = x and you get the graph of the inverse function, sin⁻¹ x.

This page shows that reflection as a slide you can play, for all six ratios. It also works out **principal values** (exact, like 2π/3, when the answer is a standard angle), lists every angle from −2π to 2π with the same ratio, checks the properties that link the inverse functions, and shows the common trap: sin⁻¹(sin θ) is not always θ.

It follows inverse trigonometric functions in Class 12 maths, after the trigonometric functions of Class 11. The idea of restricting a domain to make a function one-one is in the [[function-type|one-one and onto tester]]; the [[unit-circle]] shows where the ratios come from; and the [[trig-ratios]] tool covers the standard angles.

## How to use it

1. Pick **sin, cos, tan, cot, sec or cosec**. The page gives the domain of the inverse and its principal values.
2. In the first picture, grey is the whole graph, blue is the principal branch and green is that branch mirrored in y = x. Drag the **Reflect** slider back to 0 and press **Play the reflection** to watch it turn. Tick **Reflect the whole graph** to see why the full mirror image is not a function.
3. Under **Principal value**, type x: a decimal, a fraction such as `-1/2` or an expression such as `sqrt(3)/2`. You get the principal value in radians and degrees, a check, the value at −x, the identity with its partner function and the list of all angles with the same ratio.
4. In **The trap**, slide θ (in steps of 5°) and compare sin⁻¹(sin θ) (the blue zig-zag) with θ itself (dashed).

## Worked example

With sin picked and x = 1/2, the page shows **sin⁻¹(0.5) = π/6**, that is 0.523599 radians or **30°**. The list says the angles from −2π to 2π with sin θ = 0.5 are **−11π/6, −7π/6, π/6, 5π/6**; only π/6 lies in [−π/2, π/2], so it is the principal value. It also shows sin⁻¹(−0.5) = −π/6 and sin⁻¹x + cos⁻¹x = π/2.

Now press **cos**: x changes to −1/2 and the page shows **cos⁻¹(−0.5) = 2π/3** (120°), which matches π − cos⁻¹(1/2) = π − π/3.

In the trap with sin and θ = 150° (that is 5π/6), the page says sin⁻¹(sin 5π/6) = **π/6**, not 5π/6, because 5π/6 is outside [−π/2, π/2].

## Properties shown

- sin⁻¹(−x) = −sin⁻¹x, tan⁻¹(−x) = −tan⁻¹x, cosec⁻¹(−x) = −cosec⁻¹x.
- cos⁻¹(−x) = π − cos⁻¹x, cot⁻¹(−x) = π − cot⁻¹x, sec⁻¹(−x) = π − sec⁻¹x.
- sin⁻¹x + cos⁻¹x = tan⁻¹x + cot⁻¹x = sec⁻¹x + cosec⁻¹x = π/2.
- cosec⁻¹(1/x) = sin⁻¹x and sec⁻¹(1/x) = cos⁻¹x; cot⁻¹(1/x) = tan⁻¹x for x > 0.

## Check yourself

Five fresh questions on principal values of standard angles, the sin⁻¹(sin θ) trap and sin⁻¹x + cos⁻¹x. Answers such as `pi/6` or `2pi/3` are accepted. Nothing is saved.

## FAQ

**Why is cot⁻¹(−1) = 3π/4 and not −π/4?** The school convention takes cot⁻¹ in (0, π). Some calculators and computer libraries use (−π/2, π/2] instead, so their answers differ for negative x.

**Is sin⁻¹x the same as 1/sin x?** No. sin⁻¹x is an angle; 1/sin x is cosec x, written (sin x)⁻¹.

**Is this from my textbook?** It covers the standard school topic with its own examples. It is an independent study aid and is not part of NCERT.
