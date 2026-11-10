---
name: Solids lab
num: 1290
shelf: learn
section: school-maths
title: "Solids lab: surface area and volume of a cube, cuboid, cylinder, cone, sphere and hemisphere"
summary: "Pick a cube, cuboid, cylinder, cone, sphere or hemisphere and set its size. Turn it in 3D, unfold it into its net, or pour it into a cylinder to see why a cone is a third and a sphere two thirds of its cylinder. Every formula updates with your numbers. Ends with fresh practice questions."
status: live
ads: false
order: 1290
icon: ruler
works: offline
updated: 2026-11-09
related: [circle-sector, herons-formula, pythagoras-proofs]
sources:
  - "Surface area and volume formulas for the cube, cuboid, cylinder, cone, sphere and hemisphere, and Archimedes' sphere-and-cylinder result, are standard geometry. Wording, pictures and examples are fibub's own."
  - "Checked against Python (math.pi, math.hypot) for every solid on a grid of sizes, and against hand-worked examples (cylinder r = 7, h = 10: 140π, 238π and 490π)."
flow:
  - { icon: pointer, label: "Pick solid" }
  - { icon: sliders, label: "Set size" }
  - { icon: compass, label: "Turn, unfold" }
  - { icon: calculator, label: "Formulas" }
---

## What it does

This page is a small lab for the six solids of school mensuration. For each one you set the sizes with sliders or boxes, and three views help you see where the formulas come from:

- **Turn it:** a 3D picture you can drag round to look at the solid from any side.
- **Unfold:** the net. A cuboid opens into six rectangles; a cylinder's curved surface unrolls into a rectangle 2πr long; a cone's unrolls into a sector of radius l (the slant height) with angle 360° × r ÷ l. A sphere has no flat net, so the page shows the four circles that have the same area.
- **Fill it:** water poured into a cylinder of the same radius. Three cones fill the cylinder with the same base and height, so a cone holds ⅓πr²h. A sphere fills ⅔ of the cylinder it just fits in (height 2r), the result Archimedes was proudest of; a hemisphere fills ⅔ of a cylinder of height r. For a cube or cuboid each pour adds a 1 cm layer, showing volume = base area × height.

Under the picture, the lateral or curved surface area, total surface area and volume are worked out with your numbers, both as a multiple of π and as a decimal.

It fits the Class 9 mathematics chapter on surface area and volume (cube, cuboid, cylinder, cone, sphere and hemisphere), which Class 10 builds on with combinations of solids. Arcs and sectors, which the cone's net is made of, are in [[circle-sector]]; the slant height comes from [[pythagoras-proofs|Pythagoras' theorem]].

## How to use it

1. Tap a solid at the top. Only the sizes that solid needs are shown.
2. Drag the sliders (1 to 20 cm) or type any size up to 100 cm in the boxes.
3. Pick **Turn it**, **Unfold** or **Fill it**. In Turn it, drag the picture. In Fill it, press **Pour one in** until it is full, and **Empty** to start again.
4. Read the formulas card. π is used to full accuracy, so an answer worked with 22/7 or 3.14 can differ in the last digits.

## A worked example

The page starts with a cylinder of radius 7 cm and height 10 cm.

- Curved surface = 2πrh = 2 × π × 7 × 10 = 140π ≈ 439.82 cm².
- Total surface = 2πr(r + h) = 2 × π × 7 × 17 = 238π ≈ 747.70 cm².
- Volume = πr²h = π × 49 × 10 = 490π ≈ 1 539.38 cm³ (with π = 22/7 it is exactly 1 540 cm³).

Switch to the cone with the same r = 7 and h = 10: the slant height is √(49 + 100) = √149 ≈ 12.21 cm, the curved surface πrl ≈ 268.44 cm², and the volume ⅓ × 490π ≈ 513.13 cm³, exactly a third of the cylinder. Unfold it and the sector angle is 360° × 7 ÷ 12.21 ≈ 206.4°. A sphere of radius 7 has surface 196π ≈ 615.75 cm² and volume ≈ 1 436.76 cm³.

## Check yourself

Five fresh questions each time: a cuboid's total surface area, a cylinder's volume, a cone's slant height, a sphere's volume and a cone's share of a cylinder. Answers within 1% count, so working with π or 22/7 both pass. Nothing is saved.

## FAQ

**What is the difference between curved and total surface area?** The curved (or lateral) surface is just the side: the label on a tin. The total adds the flat ends: the label plus the lid and the bottom.

**Why is the cone exactly one third?** You can see it by pouring, and prove it with calculus or by Cavalieri's principle. A pyramid is a third of its prism for the same reason.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
