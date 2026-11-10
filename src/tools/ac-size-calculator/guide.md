---
name: AC size
num: 2028
shelf: everyday
code: T876
section: heating-cooling
title: "AC size calculator: what BTU air conditioner do I need for my room?"
summary: "Size a room air conditioner from the floor area with the ENERGY STAR sizing chart, adjusted for sun, people, a kitchen, ceiling height and insulation. Shows BTU/h, kW, tons, the next common unit size and a rough heating size."
status: live
ads: false
order: 2028
icon: sliders
works: offline
updated: 2026-11-10
related: [electricity-cost, gravel-calculator, hvac-room-load]
sources:
  - "ENERGY STAR, Properly Sized Room Air Conditioners (energystar.gov, checked 2026-11-10): area bands from 100 to 2,500 sq ft, 10% less for a heavily shaded room, 10% more for a very sunny one, 600 BTU/h for each person over two and 4,000 BTU/h for a kitchen. Check the official source."
  - "Ceiling scaling above 8 ft, the ±10% for insulation, the common unit sizes and the 100 W/m² heating rule are rounded rules of thumb chosen by fibub, all editable or labelled. 1 W = 3.41214 BTU/h; 1 ton = 12,000 BTU/h."
flow:
  - { icon: ruler, label: "Room" }
  - { icon: sliders, label: "Adjust" }
  - { icon: calculator, label: "BTU/h" }
  - { icon: check, label: "Unit size" }
---

## What it does

This calculator looks up the room's floor area in the ENERGY STAR room air conditioner sizing chart, applies its adjustments and shows the cooling you need in BTU per hour, kilowatts and tons, plus the next common unit size. A second box gives a rough heating size.

It is an approximation for one room, not a full load calculation. Nothing you type leaves your browser. To see what the unit costs to run, try [[electricity-cost]]; for a detailed room load from walls and windows, use [[hvac-room-load]].

## How to use it

1. Choose feet or metres; type the floor area and ceiling height.
2. Set the sun, insulation, number of people and whether it is a kitchen.
3. Read the BTU/h figure and the next common unit size. "Reset" brings back the example.

## What each setting does

- **Room area**: picks the ENERGY STAR band (100 to 2,500 sq ft).
- **Ceiling height**: the chart assumes an ordinary ceiling; above 8 ft (2.44 m) fibub scales the figure up by height ÷ 8 ft.
- **Sun**: ENERGY STAR takes 10% off for a heavily shaded room and adds 10% for a very sunny one.
- **Insulation**: fibub's rule of thumb, 10% more for poor and 10% less for good.
- **People**: ENERGY STAR adds 600 BTU/h for each person over two who regularly uses the room.
- **Kitchen**: ENERGY STAR adds 4,000 BTU/h. Both figures are editable.
- **Watts per m²**: a rough heating rule, 100 W/m² for average insulation.

## Worked example

A 300 sq ft bedroom with an 8 ft ceiling falls in the 250 to 300 sq ft band: 7,000 BTU/h, which is 2.05 kW or 0.58 tons. The next common unit is 8,000 BTU/h. If the room is very sunny, 7,000 + 10% = 7,700 BTU/h. With three people in it instead of two, add 600: 7,600 BTU/h. For heating, 300 sq ft is 27.9 m², so at 100 W/m² about 2.79 kW.

## FAQs

**Is 20 BTU per square foot right?** It is a common shortcut, but the ENERGY STAR chart gives more for small rooms: 300 sq ft gets 7,000, not 6,000.

**How do I turn BTU/h into kW?** Divide by 3,412; one ton is 12,000 BTU/h.

**Why not just buy the biggest unit?** An oversized unit cools in short bursts and leaves the room damp.
