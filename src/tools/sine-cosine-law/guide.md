---
name: Sine cosine law
num: 2129
shelf: learn
code: L324
section: school-maths
title: "Sine cosine law: solve any triangle step by step"
summary: "Enter three values of a triangle and see it drawn to scale, with every missing side and angle found by the sine law or the cosine law, including the two-answer ambiguous case."
status: live
ads: false
order: 2129
icon: sliders
works: offline
updated: 2026-11-16
related: [trig-ratios, heights-distances, unit-circle]
sources:
  - "The sine law and the cosine law are standard geometry results. Grade levels follow the Ontario Ministry of Education course topics for MPM2D and MCR3U; check the official curriculum for the current wording. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Set" }
  - { icon: curve, label: "See" }
  - { icon: check, label: "Check" }
---

## What it does

Pick what you know about a triangle (two angles and a side, two sides and the angle between them, or all three sides), type the three numbers and the triangle is drawn to scale. The missing sides and angles appear at once, with the law that found them written underneath. In Grade 11 you can also pick the ambiguous case, where two sides and an angle that is not between them can fit zero, one or two different triangles.

The sine law says each side divided by the sine of its opposite angle is the same for the whole triangle. The cosine law is Pythagoras with a correction term: a² = b² + c² − 2bc cos A. Use the sine law when you know an angle and the side opposite it, and the cosine law when you know two sides and the angle between them, or all three sides. If your triangle has a right angle, try [[trig-ratios]] first, and for real-life uses see [[heights-distances]] and [[unit-circle]].

## How to use it

1. Choose "What do you know?" from the list. The three boxes change their names to match.
2. Type your three numbers. Angles are in degrees, sides in any one unit (cm, m, km).
3. Read the drawing and the list of sides and angles under it. The line above the list tells you which law was used.
4. In the ambiguous case, two buttons appear when two triangles fit. Press them to see each one.
5. Answer a question under "Check yourself". You get a fresh one each time and a worked answer.

## What each setting does

- **Two angles and a side**: finds the third angle by subtracting from 180°, then uses the sine law for the other two sides.
- **Two sides and the angle between**: uses the cosine law to find the third side, then again for another angle.
- **All three sides**: uses the cosine law three ways to find every angle. If the two short sides cannot span the longest one, it says there is no triangle.
- **Ambiguous case (Grade 11)**: the sine law gives sin B, and B can be that angle or 180° minus it.

## Worked example

Angle A = 40°, angle B = 65° and side a = 10 cm. Angle C = 180° − 40° − 65° = 75°. By the sine law, b = 10 × sin 65° / sin 40° ≈ 14.1 cm and c = 10 × sin 75° / sin 40° ≈ 15.03 cm. These are the numbers the tool shows when it opens.

## FAQs

**Why can SSA give two triangles?** Swing side a like a gate around vertex C: if it is shorter than b but long enough to reach the base, it can touch the base in two places. That is why sin B = b sin A / a gives two angles, B and 180° − B.

**Does this follow the Ontario curriculum?** The topics match the usual Grade 10 and Grade 11 trigonometry strands (MPM2D and MCR3U). fibub is not part of the Ontario government and curriculum wording changes, so check the official Ontario curriculum for your course.

**Why does my triangle not fit?** The two shorter sides must add up to more than the longest side, and two angles must add up to less than 180°.

**Are my numbers saved?** No. Everything is worked out in your browser and nothing is stored or sent.
