---
name: Glasses prescription reader
num: 1968
shelf: documents
code: T843
section: health-logs
title: "Eyeglass prescription explained: SPH, CYL, AXIS, ADD, PD"
summary: "Type the numbers from your glasses prescription and read what each box means. Convert plus and minus cylinder, find the spherical equivalent and the near prescription, then print it. Nothing leaves your device."
status: live
ads: false
order: 1968
icon: eye
works: offline
updated: 2026-11-10
related: [visual-acuity-converter, medical-terms, health-summary-card]
sources:
  - "Prescription terms and the transposition rule (new SPH = SPH + CYL, new CYL = −CYL, new AXIS = AXIS ± 90) are standard optics arithmetic; the explanations are fibub's own wording, informed by public eye-health pages (NHS, NIH National Eye Institute, MedlinePlus). Checked 2026-11-10."
  - "Spherical equivalent = SPH + CYL ÷ 2. Results are rounded to 2 decimals, halves away from zero."
flow:
  - { icon: pencil, label: "Type values" }
  - { icon: eye, label: "Read meaning" }
  - { icon: convert, label: "Convert" }
  - { icon: download, label: "Print" }
---

## What it does

An eyeglass prescription is a small grid of numbers and short codes. This page lets you type them in and see, in plain words, what each box on your paper says. It also does the arithmetic people often ask about: writing the cylinder the other way round, the spherical equivalent, and the sphere with the near add included.

It describes the paper in front of you. It does not say what lenses you should buy or whether a prescription is right. Your optician or eye doctor does that. To compare how sharp vision is written in different systems, try [[visual-acuity-converter]]; other abbreviations are in [[medical-terms]].

## How to use it

1. Type the numbers for OD (right eye) and OS (left eye) as they appear, with their + or − signs. Leave blank boxes empty. "plano" or "DS" counts as 0.
2. Add the PD if your paper has one: a single number, or two numbers (right and left).
3. Read the cards that appear for each eye. If a number looks odd, a note lists what to check on the paper.
4. Print the page, or download it as an image, PDF or Word file.

## What each option does

- **SPH** is the main power. A minus number is the kind used for short-sightedness; a plus number is the kind used for long-sightedness.
- **CYL and AXIS** go together. The axis is a direction from 1 to 180 degrees. A cylinder with no axis gets a warning.
- **Written the other way** swaps between minus and plus cylinder: SPH + CYL, flip the CYL sign, add or take away 90 from the axis.
- **Spherical equivalent** is SPH + CYL ÷ 2.
- **ADD** is the extra near power. SPH + ADD shows the sphere with it included.
- **PRISM and BASE** give the prism power and which edge is thick.

## Worked example

Maya's right eye reads OD −2.00 −0.75 × 180. Written the other way that is −2.75 +0.75 × 90 (−2.00 + −0.75 = −2.75, the sign flips, and 180 − 90 = 90). Her spherical equivalent is −2.00 + (−0.75 ÷ 2) = −2.375, shown as −2.38.

## FAQs

**Can I turn this into a contact lens prescription?** No. Contact lens prescriptions have a base curve and diameter, and the power can differ, so they need a fitting.

**Why does it warn about 0.25 steps?** Prescriptions normally go in steps of 0.25 D. A different value is usually a typing slip.

**Is anything saved?** No. The numbers stay in the page and disappear when you close it.
