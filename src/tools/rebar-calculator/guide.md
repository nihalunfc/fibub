---
name: Rebar calculator
num: 650
shelf: science
section: civil-and-structural-engineering
title: "Rebar calculator"
summary: "Count the reinforcing bars at your spacing over a slab, wall or footing, split long bars into stock lengths with your lap length, and get the total length, the weight from the steel density, the stock bars to order and a cut list to download."
status: live
ads: true
order: 650
icon: ruler
works: offline
updated: 2026-11-09
related: [concrete-mix-design, traverse-calculator, uncertainty-calculator, load-combination-helper, column-buckling, retaining-wall-check, beam-calculator, unit-converter]
sources:
  - "Bar mass from the density of steel, 7850 kg/m³, times the area of a circle π d² / 4 (general engineering fact). Bar counting, laps and first-fit-decreasing cutting are fibub's own arithmetic."
  - "No values are copied from any design code or bar schedule standard (ACI, Eurocode, IS, BS or others): cover, spacing, lap length and hooks are all entered by the user, and the example values are made up."
  - "Checked against an independent Python calculation written for the tests (mass per metre, counting loop, greedy lap split and a separate first-fit-decreasing packer)."
flow:
  - { icon: ruler, label: "Size" }
  - { icon: sliders, label: "Spacing" }
  - { icon: calculator, label: "Weight" }
  - { icon: table, label: "Cut list" }
---

## What it does

Reinforced concrete slabs, walls and footings usually carry a **mesh** of steel bars: one set running along the length and one across, at a set spacing, in one or two layers. This calculator turns that description into quantities:

- the **number of bars** in each direction, with a bar at each edge and no gap wider than your spacing,
- each bar's **length** after the cover at both ends, plus any hooks or bends,
- **laps**: when a bar is longer than a stock length, it is made from several stock bars overlapping by your lap length,
- the **total length and weight** (mass per metre = 7850 kg/m³ × π d² / 4), with an optional waste allowance,
- the number of **stock bars to order**, found by fitting the cut pieces into stock lengths (first fit, longest first),
- a **cut list** (marks, sizes, lengths and numbers) as a table, CSV, image, PDF or Word file, and a plan drawing of the mesh.

For study and planning, not a substitute for professional judgement. Check your local code and a qualified engineer, and always order from the approved bar schedule.

Get the design loads from the [[load-combination-helper|load combination helper]], and choose the concrete with the [[concrete-mix-design|concrete mix design tool]].

## How to use it

1. Pick **slab**, **wall** or **footing**. This only changes the wording and the starting number of layers (two mats for a slab, two faces for a wall, one mat for a footing); change it as you need.
2. Type the **length** and **width** (or height) in metres, the **cover** in mm (measured to the bar ends and edges), and how many identical elements there are.
3. For each direction, choose the **bar size**, the **spacing** (centre to centre) and any **extra length per end** for a hook or bend.
4. Type the **stock bar length** you can buy (often 6 m or 12 m) and the **lap length** from your drawings or code.
5. Add a **waste allowance** if you want a margin for offcuts and mistakes.

## Worked example

A made-up slab 6 m × 4.5 m with 40 mm cover, two mats of 12 mm bars at 150 mm along the length and 10 mm bars at 200 mm along the width, 12 m stock bars (the page opens with these values):

- Along the length: (4.5 − 0.08) ÷ 0.15 = 29.5, so 31 bars per mat, **62 bars** of 5.92 m. 12 mm bar weighs 0.888 kg/m, so 367.0 m weighs **325.9 kg**.
- Along the width: (6 − 0.08) ÷ 0.2 = 29.6, so 31 per mat, **62 bars** of 4.42 m, 274.0 m of 10 mm bar at 0.617 kg/m = **169.0 kg**.
- Total **494.8 kg of steel, 641.1 m of bar**, about 18.3 kg per m² of slab. Two 5.92 m bars fit in each 12 m stock bar, and two 4.42 m bars in another, so **62 stock bars** are needed.

## Tips

- If your spacing does not divide the width exactly, the calculator adds a bar so that no gap is wider than the spacing.
- Laps are placed one per stock length. In real work they are staggered, and codes limit how many laps sit at one section; follow your drawings.
- The steel area per metre (π d²/4 × 1000 ÷ spacing) is shown so you can compare it with the area your design needs.

## FAQ

**Why is the weight different from my supplier's?** Bars are rolled to a tolerance on mass, and some standards give rounded masses per metre. This tool uses the exact circle area and 7850 kg/m³.

**Does it include chairs, links or starter bars?** No. Add them as another element, or by hand.

**Can I enter the lap as so many bar diameters?** Multiply it out: a lap of 50 diameters on a 12 mm bar is 600 mm. Use the figure your code and designer give you.
