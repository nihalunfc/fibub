---
name: Roof calculator
num: 2026
shelf: everyday
code: T874
section: building
title: "Roof calculator: roof pitch, roof area, squares and shingle bundles"
summary: "Convert roof pitch between x:12, degrees and percent, then work out roof area from the footprint and overhang, roofing squares and shingle bundles with waste."
status: live
ads: false
order: 2026
icon: mountain
works: offline
updated: 2026-11-10
related: [stair-calculator, deck-calculator, gravel-calculator]
sources:
  - "Pitch conversions and the pitch factor √(1 + (rise ÷ run)²) are standard trigonometry; fibub's own working."
  - "A roofing square is 100 sq ft. Three bundles per square is typical for standard asphalt shingles, but the wrapper gives the true coverage."
flow:
  - { icon: compass, label: "Pitch" }
  - { icon: ruler, label: "Footprint" }
  - { icon: calculator, label: "Area" }
  - { icon: check, label: "Bundles" }
---

## What it does

This page does two roofing jobs. First it converts a roof pitch between the three ways people write it: rise per 12 (such as 6:12), degrees and percent. Then it works out the roof area from the building's footprint, the overhang and the pitch, and turns that into roofing squares and shingle bundles with a waste allowance.

It works in feet or metres and runs entirely in your browser. To plan the steps up to a porch use the [[stair-calculator]], and for an outdoor deck the [[deck-calculator]].

## How to use it

1. Type the pitch in any one of the three boxes. The other two update.
2. Choose Imperial (feet) or Metric (metres). Switching converts the sizes you typed.
3. Type the building's length and width at the walls and the overhang on each side.
4. Read the roof area, squares and bundles. **Reset example** brings the example back; **Clear** empties the sizes.

## What each setting does

- **Rise per 12**: how many units the roof rises for every 12 it runs across.
- **Degrees** and **Percent**: the same slope as an angle, and as rise ÷ run × 100.
- **Pitch factor**: √(1 + (rise ÷ run)²), how much bigger the sloped roof is than the flat area under it.
- **Overhang**: added on all four sides, so the footprint grows by twice the overhang each way.
- **Roof shape**: a gable and a hip roof of the same pitch over the same footprint have the same area, so the same factor is used. A hip roof needs more cutting, so allow more waste.
- **Extra for waste**: 10% by default for cuts and mistakes; more for roofs with many valleys.
- **Bundles per square**: 3 by default for standard shingles. One square is 100 sq ft.

## Worked example

A 6:12 pitch is 26.57° and 50%, with a pitch factor of 1.118. A house 30 × 40 ft with a 1 ft overhang has a footprint of 42 × 32 = 1,344 sq ft. Times 1.118 that is 1,502.6 sq ft of roof, or 15.03 squares. With 10% waste that is 16.53 squares, and 16.53 × 3 = 49.6 bundles, rounded up to 50. Only the bundle count is rounded, at the very end.

## FAQs

**Does it count ridge caps and starter strips?** No. Buy those by the length of the ridges, hips and eaves.

**Why round only the bundles?** Rounding the squares first would add a bundle or more you may not need.
