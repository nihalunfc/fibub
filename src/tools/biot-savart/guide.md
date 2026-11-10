---
name: Biot–Savart field builder and Ampère's law
num: 1409
shelf: learn
section: school-physics
title: "Biot–Savart law: build the magnetic field of a wire, loop and solenoid piece by piece, plus Ampère's law"
summary: "Add up the magnetic field of a straight wire, a circular loop or a solenoid from small pieces of current, as the Biot–Savart law says, and compare with the exact formula. Graph the field along the axis. Then drag a loop among three long wires and see Ampère's law: the total of B round the loop is μ₀ times the current inside."
status: live
ads: false
order: 1409
icon: compass
works: offline
updated: 2026-11-09
related: [magnetic-field-mapper, lorentz-motion, electromagnet-builder, faraday-induction]
sources:
  - "Biot–Savart law dB = (μ₀/4π) I dl × r̂ / r², and its results for a straight wire of finite length, a circular loop on its axis and a solenoid on its axis (as a continuous current sheet); Ampère's circuital law ∮B·dl = μ₀ I_enclosed with the field μ₀I/(2πr) of a long straight wire: standard physics results."
  - "μ₀ = 1.25663706127 × 10⁻⁶ N/A² (CODATA 2022)."
  - "Checked against an independent numpy Biot–Savart sum with 200 000 elements (5 A loop of radius 10 cm at 7 cm along the axis: 17.273 µT; 20 cm wire, P 5 cm away and 3 cm up: 17.471 µT into the page) and by summing the loop formula over 200 separate turns for the solenoid."
flow:
  - { icon: sliders, label: "Pick shape" }
  - { icon: pencil, label: "Add pieces" }
  - { icon: chart, label: "Graph B" }
  - { icon: check, label: "Check" }
---

## What it does

The **Biot–Savart law** says that every short piece of a current-carrying wire makes a little magnetic field around it: dB = (μ₀/4π) I dl sin θ / r². To find the field of a whole wire, you add up the pieces. This page lets you do that adding, one piece at a time, for three shapes:

- **Straight wire:** every piece pushes the field the same way (into the page at P), so the pieces simply add. A bar chart shows that the pieces nearest P give the most.
- **Circular loop:** each piece's field at a point on the axis is tilted. Pieces on opposite sides cancel each other's sideways parts, leaving only the part along the axis. You see each piece's arrow and the running total.
- **Solenoid:** many loops side by side. The graph shows the field along the axis: flat at μ₀nI inside a long solenoid, falling to about half at each end.

The fourth mode is **Ampère's law**. Three long wires come out of or go into the page. Drag a loop among them: the field along the loop changes, but the total ∮B·dl is always μ₀ times the current inside.

It follows the Class 12 Physics chapter on moving charges and magnetism (the Biot–Savart law, the field on the axis of a circular loop, Ampère's circuital law, the solenoid). See the field lines with the [[magnetic-field-mapper]], then use the field on a moving charge with [[lorentz-motion]] or build a real coil with the [[electromagnet-builder]].

## How to use it

1. Choose **Straight wire**, **Circular loop**, **Solenoid** or **Ampère's law**.
2. Set the current and the sizes with the sliders. P is the point where the field is found.
3. For the wire and loop, slide **Pieces of wire added**, or press **Add the pieces one by one** to watch the total grow.
4. In Ampère's law, set each wire's current (positive is out of the page) and move the loop with the sliders or by dragging it on the picture.

## Worked example

A straight wire 20 cm long carries 5 A. At P, 5 cm from the middle of the wire, sin α₁ = sin α₂ = 10/√(5² + 10²) = 0.894, so B = μ₀I/(4πd) × (0.894 + 0.894) = 10⁻⁷ × 5 / 0.05 × 1.789 = **17.9 µT**, into the page. Adding the 24 pieces gives the same to within 0.02%. A very long wire would give μ₀I/(2πd) = 20.0 µT, so this short wire gives 89.4% of that.

A single loop of radius 10 cm with 5 A gives μ₀I/(2R) = **31.4 µT** at its centre. A solenoid 20 cm long with 200 turns of radius 2 cm and 5 A has n = 1000 turns per metre, so μ₀nI = **6.28 mT**; at its middle the field is 6.16 mT (98.1%), and at its ends 3.13 mT, about half.

In Ampère's law, a loop round wire A (5 A out of the page) gives ∮B·dl = μ₀ × 5 = **6.28 µT m**, wherever the loop sits.

## Tips

- The field of a piece falls as 1/r², so near pieces matter most.
- Out of the page counts as positive current for a loop followed anticlockwise.
- Ampère's law is easiest to use where the field is the same all round the loop (a long wire, a long solenoid).

## FAQ

**Why is the 24-piece loop a little low?** The pieces are short straight chords, so the polygon is slightly smaller than the circle. More pieces would close the gap.

**Do wires outside the Ampère loop matter?** They change B at every point of the loop, but their contributions add up to zero round it.

**Is this an official NCERT resource?** No. fibub is independent; the page follows the topics in the syllabus in its own words.
