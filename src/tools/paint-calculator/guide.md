---
name: Paint calculator
num: 2019
shelf: everyday
code: T867
section: walls-floors
title: "Paint calculator: how much paint for a room, in litres or gallons and tins"
summary: "Work out how much paint a room needs from its size, doors, windows and coats, and which tins to buy, in litres or US gallons."
status: live
ads: false
order: 2019
icon: pencil
works: offline
updated: 2026-11-10
related: [wallpaper-calculator, drywall-calculator, tile-calculator]
sources:
  - "Area and coverage arithmetic: fibub's own working. Default coverage (10 m² per litre, 400 sq ft per US gallon) and door and window sizes are typical figures, not a standard; check the tin."
flow:
  - { icon: ruler, label: "Measure" }
  - { icon: sliders, label: "Coats" }
  - { icon: calculator, label: "Paint" }
  - { icon: check, label: "Tins" }
---

## What it does

This paint calculator works out how much paint you need for a room and which tins to buy. Give it the room size or each wall, take off the doors and windows, choose the number of coats, and it shows the area, the litres (or US gallons) and a list of tins.

Before painting new walls, the [[drywall-calculator]] counts the boards, and if one wall is getting paper instead, the [[wallpaper-calculator]] counts the rolls.

## How to use it

1. Pick metric (metres, litres) or imperial (feet, US gallons). Changing units loads the example in those units.
2. Choose **Whole room** and type length, width and wall height, or **Wall by wall** and add each wall's length and height.
3. Type how many doors and windows there are.
4. Set the coats and the coverage from your tin.

## What each setting does

- **Doors and windows**: each one is taken off the wall area. Defaults (door 1.9 m² or 21 sq ft, window 1.5 m² or 16 sq ft) are typical sizes.
- **Coats**: the area is multiplied by this.
- **Coverage per coat**: how much wall one litre or gallon covers. 10 m² per litre and 400 sq ft per gallon are common label figures: check the tin.
- **Paint the ceiling too**: in Whole room mode, adds length × width with the same coats.
- **Primer**: adds one coat of primer over the same area, at its own coverage.
- **Tins**: metric uses 5 L, 2.5 L and 1 L tins; imperial uses gallons and quarts. The rule is the fewest tins that hold enough, then the one with the least left over.

## Worked example

A room 4 m by 3.5 m with walls 2.4 m high has 2 × (4 + 3.5) × 2.4 = 36.0 m² of wall. Take off one door (1.9 m²) and one window (1.5 m²) to get 32.6 m². Two coats make 65.2 m², and at 10 m² per litre that is 6.52 L. The fewest tins that hold it are two, and 1 × 5 L + 1 × 2.5 L (7.5 L) leaves less over than 2 × 5 L.

## FAQs

**Should I buy a little extra?** The tin rule already rounds up. Keep the leftover for touch-ups.

**Why does my wall take more?** Fresh plaster, bare wood and texture soak paint up. Lower the coverage or add primer.

**Does it count trim?** No; work out skirting and frames separately.
