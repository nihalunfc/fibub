---
name: Concrete calculator
num: 2023
shelf: everyday
code: T871
section: building
title: "Concrete calculator: slab, footing, post hole and step volume with bags of premix"
summary: "Work out how much concrete a slab, footing, post holes or steps need in m³, yd³ and ft³, add a waste allowance and count bags of premix."
status: live
ads: false
order: 2023
icon: mountain
works: offline
updated: 2026-11-10
related: [concrete-mix-design, deck-calculator, gravel-calculator]
sources:
  - "Volume formulas for boxes and cylinders; fibub's own working."
  - "Bag yields (80 lb about 0.6 ft³, 60 lb about 0.45 ft³, 40 lb about 0.3 ft³, 25 kg about 0.012 m³) are typical values printed on premix bags. Check the label of the bag you buy."
flow:
  - { icon: sliders, label: "Pick shape" }
  - { icon: ruler, label: "Measure" }
  - { icon: calculator, label: "Volume" }
  - { icon: check, label: "Bags" }
---

## What it does

Find out how much concrete a job needs before you buy it. Pick a shape (a flat slab, a strip footing, round post holes or a flight of solid steps), type the sizes, and it shows the volume in cubic metres, cubic yards and cubic feet, the volume with a waste allowance, and how many bags of premix that is.

It works in metric or imperial, all in your browser. To choose the cement, sand and gravel for a mix yourself, use [[concrete-mix-design]]; if the concrete is for deck footings, the [[deck-calculator]] counts the boards and joists.

## How to use it

1. Choose Metric or Imperial. Switching converts what you typed.
2. Pick the shape and type its sizes. An example is filled in.
3. Set the waste allowance and the bag size.
4. Read the volume and bag count. **Reset example** brings the example back; **Clear** empties the sizes.

## What each setting does

- **Slab**: length × width × thickness, times how many.
- **Footing**: a rectangular strip or pad: length × width × depth.
- **Post holes**: the volume of each round hole minus the post standing in it (type 0 for a solid column or pier), times the number of holes.
- **Steps**: solid steps built on the ground. Step 1 is one rise high, step 2 two rises, and so on, so the volume is width × rise × tread × (1 + 2 + ... + n).
- **Extra for waste**: 5 to 10% is the usual rule of thumb for spills, uneven ground and over-dig. The default is 10%.
- **Bag size and yield**: 20, 25 or 30 kg, or 40, 60 or 80 lb. The yield fills in with a typical label value and you can change it. Bags are always rounded up.

## Worked example

A patio slab 3 m × 3 m × 100 mm is 0.9 m³. With 10% extra that is 0.99 m³.

Ten post holes 300 mm wide and 900 mm deep, each holding a 100 mm post: π/4 × (0.3² − 0.1²) × 0.9 = 0.0565 m³ per hole, 0.565 m³ for all ten.

One cubic yard is 27 ft³. With 80 lb bags at 0.6 ft³ each that is 27 ÷ 0.6 = 45 bags.

## FAQs

**When should I order ready-mix instead?** Above about 1 m³ (1.3 yd³) hand mixing is hard work. Ask local suppliers about minimum loads.

**Does it count the gravel base?** No, only the concrete.
