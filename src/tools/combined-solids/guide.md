---
name: Combined solids
num: 1316
shelf: learn
code: L176
section: school-maths
title: "Surface area and volume of combined solids: cone on a hemisphere, capsule, cylinder with a cone or dome"
summary: "Pick a solid made of simple shapes (an ice-cream cone, a capsule, a toy rocket, a dome on a cylinder or a cube), slide its sizes and see the surface area with the hidden joins left out and the volume added up part by part."
status: live
ads: false
order: 1316
icon: calculator
works: offline
updated: 2026-11-09
related: [circle-sector, pythagoras-proofs, herons-formula]
sources:
  - "Standard mensuration formulas: curved surface of a cylinder 2πrh, of a cone πrl with l = √(r² + h²), of a hemisphere 2πr²; volumes πr²h, ⅓πr²h, ⅔πr³ and a³. Written for fibub."
  - "Checked against hand-worked answers (cone r 3.5, H 12 on a hemisphere with π = 22/7: area 214.5 cm², volume 243.83 cm³) and against a separate Python calculation of every shape."
flow:
  - { icon: pointer, label: "Pick shape" }
  - { icon: sliders, label: "Set sizes" }
  - { icon: eye, label: "See joins" }
  - { icon: calculator, label: "Area, volume" }
---

## What it does

Many everyday objects are two or three simple solids stuck together: an ice-cream cone with a scoop on top, a medicine capsule, a toy rocket, a tank with a domed roof, a block with a knob. This page draws five such shapes from the side and works out:

- the **total surface area**, adding the curved surface of each part and leaving out every face that is hidden where two parts join,
- the **volume**, which is simply the sum of the parts' volumes,
- the **slant height** of any cone, l = √(r² + H²).

The hidden joins are drawn as a dashed red ring and listed with a line through them, so you can see what is *not* counted. This is the step most people get wrong in exams.

It follows the Class 10 Maths chapter *surface areas and volumes* (combinations of solids) and uses the cylinder, cone and sphere formulas from Class 9.

The circle pieces come from [[circle-sector]], and the cone's slant height is [[pythagoras-proofs|Pythagoras' theorem]] in disguise.

## How to use it

1. **Pick a shape** from the five buttons. Each one loads tidy starting sizes.
2. **Slide the sizes** or type them. Only the sizes the shape needs are shown: r (radius of the round parts), h (height of the cylinder), H (height of the cone) and a (side of the cube). All are in centimetres.
3. Choose **π = 22/7, 3.14 or exact**. School answers usually use 22/7.
4. Read the **Surface area** card: one line per visible surface with your numbers filled in, then the hidden faces crossed out, then the total.
5. Read the **Volume** card, part by part and the total.

## The five shapes

- **Cone on a hemisphere** (ice cream): area = πrl + 2πr², volume = ⅓πr²H + ⅔πr³.
- **Capsule**: a cylinder with a hemisphere on each end. Area = 2πrh + 4πr², volume = πr²h + ⁴⁄₃πr³.
- **Cylinder with a cone** (rocket or tent), base included: area = πr² + 2πrh + πrl.
- **Cylinder with a dome**: area = πr² + 2πrh + 2πr².
- **Cube with a dome**: the dome adds 2πr² but covers a circle of πr² on the top face, so area = 6a² − πr² + 2πr² = 6a² + πr². The dome must fit, so 2r can be at most a.

## Worked example

The first shape starts with r = 3.5 cm and H = 12 cm, with π = 22/7. The slant height is √(3.5² + 12²) = **12.5 cm**. The cone's curved surface is 22/7 × 3.5 × 12.5 = **137.5 cm²** and the hemisphere's is 2 × 22/7 × 3.5² = **77 cm²**. The flat circle where they meet is inside, so the total surface area is **214.5 cm²**. The volume is ⅓ × 22/7 × 3.5² × 12 = 154 cm³ for the cone plus ⅔ × 22/7 × 3.5³ = 89.83 cm³ for the hemisphere, **243.83 cm³** in all.

## Tips

- Area: add only what you could paint from outside. Volume: add everything, because nothing is hidden from volume.
- Check your units: areas in cm², volumes in cm³.
- Make the capsule's h = 0 and you get a sphere, a good check on the formulas.

## FAQ

**Why is the cube's total not 6a² + 2πr²?** The dome sits on part of the top face, which is now covered. You add the dome's curved surface (2πr²) and take away the covered circle (πr²).

**Does the volume change when parts are joined?** No. Joining does not remove any material, so the volumes just add.

**Is this from the textbook?** No. The shapes and numbers are made up for practice and follow the topics of the Class 10 syllabus; fibub is not part of NCERT.

**Is anything saved?** No. Everything is worked out in your browser and nothing is stored or sent.
