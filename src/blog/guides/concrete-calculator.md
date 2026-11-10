---
title: "How much concrete do I need? Slabs, footings, posts and steps"
summary: "Turn the size of a slab, footing, post hole or flight of steps into cubic metres or yards, add a waste share and count the bags of premix to buy."
tools: [concrete-calculator, concrete-mix-design, gravel-calculator, deck-calculator]
updated: 2026-11-10
sources:
  - "Box and cylinder volume formulas are standard geometry. 1 ft³ = 0.028316846592 m³ and 1 yd³ = 27 ft³ are exact definitions."
  - "Bag yields (about 0.012 m³ for a 25 kg bag, about 0.6 ft³ for an 80 lb bag) are typical figures printed on premix bags. Yields vary by brand: check the label of the bag you buy."
---

Buy too little concrete and the pour stops halfway; buy too much and you are left with heavy bags. The [[concrete-calculator]] turns the size of a slab, a footing, a set of post holes or a flight of solid steps into a volume, adds a share for waste and tells you how many bags of premix that is. It is for homeowners, gardeners and anyone pricing a small building job. Before the pour, the [[gravel-calculator]] works out the stone base underneath, and if you would rather blend cement, sand and stone yourself, [[concrete-mix-design]] gives the proportions.

## What it is

Concrete is bought by volume, so every job comes down to one question: how much space will the wet mix fill? The tool answers it with two shapes from school geometry.

A slab or footing is a box:

- V = L × W × T, where L is the length, W the width and T the thickness or depth, all in metres (or feet).

A post hole is a cylinder with the post standing in the middle, so the post's own volume is taken off:

- V = π ÷ 4 × (D² − d²) × H, where D is the hole diameter, d the post diameter and H the depth.

Solid steps are a staircase of boxes. The first step is one rise tall, the second is two rises, and so on, because each step is filled right down to the ground. With n steps, width W, rise R and tread depth G:

- V = W × R × G × (1 + 2 + ... + n) = W × R × G × n × (n + 1) ÷ 2

The answer shows in m³, yd³ and ft³. Then the waste share is added and the total divided by one bag's yield, rounding the bags up.

## How to use it

1. Press **Metric (m, mm)** or **Imperial (ft, in)**. Anything you have typed is converted, so you can measure in one and read in the other.
2. Pick a shape: **Slab**, **Footing**, **Post holes** or **Steps**. Each one opens its own boxes with a sample job filled in.
3. Type your sizes. Long sides go in metres or feet; thicknesses and diameters go in millimetres or inches.
4. Set **Extra for waste (%)**. It starts at 10.
5. Choose the bag size from 20, 25 or 30 kg, or 40, 60 or 80 lb. The yield box fills in with a typical label figure; change it to match your bag.
6. Read the large total, the volume, the volume with waste and the bag count. **Reset example** brings back the sample for that shape, and **Clear** empties the size boxes.

## A worked example

Sam is building a garden shed on a concrete base, with solid steps up to a raised path.

The base is 2.4 m long, 1.8 m wide and 100 mm thick:

- Volume: 2.4 m × 1.8 m × 0.1 m = 0.432 m³ (about 0.57 yd³)
- With 10% waste: 0.432 m³ × 1.1 = 0.4752 m³
- 25 kg bags at 0.012 m³ each: 0.4752 ÷ 0.012 = 39.6, so **40 bags**

The steps are 4 steps, 1.0 m wide, with a 170 mm rise and a 300 mm tread:

- 1 + 2 + 3 + 4 = 10
- Volume: 1.0 m × 0.17 m × 0.3 m × 10 = 0.51 m³ (about 0.67 yd³)
- With 10% waste: 0.561 m³
- 25 kg bags: 0.561 ÷ 0.012 = 46.75, so **47 bags**

The steps need more than the base, because the fourth step is four rises deep.

The tool does one shape at a time, so Sam adds the two: 0.4752 + 0.561 = 1.0362 m³, or 87 bags. At that size the tool's note suggests ready-mix from a truck, and Sam decides to get a quote.

## Where it is used

- **Garden and home jobs**: shed bases, patios, paths, fence and pergola posts, and the pads under a hot tub or a water tank.
- **Small builders and handymen**, who need a quick bag count for a quote before visiting the supplier.
- **Landscapers**, who mix shapes on one job and add the totals, as Sam did.
- **Ordering ready-mix**: suppliers sell by the cubic metre or yard, so the "with waste" figure is the number to give them on the phone.

## Common mistakes

- **Mixing up millimetres and metres.** A 100 mm slab typed as 100 m in the wrong box gives a huge answer. The tool asks for thickness in millimetres (or inches) for this reason; check the unit beside each box.
- **Measuring the plan, not the dig.** Holes and trenches end up wider and deeper than drawn. Measure after digging, or raise the waste share to 15%.
- **Forgetting the post.** For a post set in concrete, type its diameter so it is taken off. Type 0 only for a solid pier with nothing inside.
- **Trusting the default yield.** Bags of the same weight can yield different volumes. Read the bag and type its figure into the yield box.
- **Counting the gravel as concrete.** A 100 mm slab on 100 mm of stone needs 100 mm of concrete, not 200. The stone is a separate order.

## Questions people ask

**Why does the tool say 10% extra and not 0%?**
Ground is never perfectly flat, forms bow a little, and some mix stays in the barrow. Running short mid-pour is far worse than having a bag left over, which keeps for the next small repair if stored dry.

**How do I work out a round slab or an L-shaped base?**
Split an L into two rectangles and run each as a slab, then add the volumes. For a round pad, use **Post holes** with one hole, the pad's diameter, its thickness as the depth and a post diameter of 0.

**Is a cubic yard the same as a "yard of concrete"?**
Yes. When a supplier in the US or Canada says a yard, they mean a cubic yard, which is 27 ft³ or about 0.765 m³.
