---
name: Drywall calculator
num: 2022
shelf: everyday
code: T870
section: walls-floors
title: "Drywall calculator: sheets of drywall or plasterboard, screws, tape and compound"
summary: "Count the drywall or plasterboard sheets for a room's walls and ceiling, with waste, plus rough amounts of screws, joint tape and compound."
status: live
ads: false
order: 2022
icon: calculator
works: offline
updated: 2026-11-10
related: [paint-calculator, tile-calculator, wallpaper-calculator]
sources:
  - "Area and sheet count: fibub's own working. Screws (about 32 per 4 x 8 ft sheet, scaled by sheet area), joint tape (about 0.37 ft per sq ft, 1.2 m per m²) and compound (about 0.01 US gal per sq ft, 0.4 L per m²) are rules of thumb, fibub's own working; check the product labels."
flow:
  - { icon: ruler, label: "Measure" }
  - { icon: sliders, label: "Sheet size" }
  - { icon: calculator, label: "Sheets" }
  - { icon: check, label: "Fixings" }
---

## What it does

This drywall calculator counts the sheets you need to board a room, from its length, width and wall height, with an allowance for offcuts. In the UK and elsewhere the same boards are called plasterboard; the sums are the same. It also gives rough amounts of screws, joint tape and joint compound so you can buy everything in one trip.

Once the boards are up and filled, the [[paint-calculator]] works out the paint; for a bathroom wall, the [[tile-calculator]] counts the tiles.

## How to use it

1. Pick metric or imperial (changing units loads the example in those units).
2. Type the room length, width and wall height. Tick **Board the ceiling too** if you are doing it.
3. Type how many doors and windows to leave out.
4. Choose the sheet size you can buy.

## What each setting does

- **Doors and windows**: each one is taken off the area. Defaults are 21 sq ft (1.9 m²) per door and 16 sq ft (1.5 m²) per window.
- **Sheet size**: 4 × 8, 4 × 10 or 4 × 12 ft, or 1200 × 2400 mm. Longer sheets mean fewer joints but are heavier to lift.
- **Waste and offcuts**: added to the exact sheet count before rounding up once. 10% suits a plain room; use more for many corners and openings.
- **Screws per sheet**: about 32 for a 4 × 8 ft sheet on walls, and set to match the sheet's area when you change the size. Ceilings and some codes need closer spacing, so raise it if needed.
- **Joint tape and compound**: amounts per unit of board area. They are rules of thumb; product labels give their own coverage.

## Worked example

A room 12 by 10 ft with 8 ft walls has 2 × (12 + 10) × 8 = 352 sq ft of wall. A 4 × 8 sheet covers 32 sq ft, so exactly 11 sheets. Add 10%: 11 × 1.1 = 12.1, rounded up to **13 sheets**. Screws: 13 × 32 = **416**. Tape is about 130 ft and compound about 3.5 US gallons.

In metric, a room 3.6 by 3 m with 2.4 m walls is 31.68 m², exactly 11 sheets of 1200 × 2400 mm, and also 13 with 10% waste.

## FAQs

**Why does 12.1 become 13?** You cannot buy part of a sheet, so any fraction rounds up.

**Should I take off small windows?** Most fitters board over them and cut out, so leave small ones in as waste.
