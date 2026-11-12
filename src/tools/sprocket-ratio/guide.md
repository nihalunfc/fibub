---
name: Sprocket ratio
num: 1812
shelf: vehicles
code: T901
section: two-wheelers
title: "Sprocket ratio calculator: speed per gear and chain length for a bike"
summary: "See your motorcycle's road speed in every gear at a chosen rpm, how much a different front or rear sprocket changes it, and roughly how many chain links you need."
status: live
ads: false
order: 1812
icon: sliders
works: offline
updated: 2026-11-10
related: [engine-cc, unit-converter, fuel-cost]
sources:
  - "Road speed = (rpm / (primary x gear x rear teeth / front teeth)) x wheel circumference. Tyre circumference from a tyre size code is pi x (rim diameter + 2 x width x aspect ratio / 100). Chain links = 2C/p + (F + R)/2 + ((R - F) / (2 pi))2 x p/C, rounded up to an even number. Gear ratios and primary ratio come from your bike's spec sheet or manual. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Sprockets" }
  - { icon: curve, label: "Gears" }
  - { icon: check, label: "Speed" }
---

## What it does

On a chain-driven bike the speed you get at a given engine speed depends on three reductions: the primary drive inside the engine, the gearbox, and the front to rear sprocket ratio. This tool multiplies them together and shows the theoretical speed in every gear at the rpm you choose.

Change the front or rear sprocket and the table shows the new speed and the percent change, so you can pick quicker pull or a higher top speed before buying. A chain length note helps you buy the right chain. For the engine itself see [[engine-cc]], and for trip costs use [[fuel-cost]] or [[unit-converter]].

## How to use it

1. Type the front and rear teeth, the primary ratio and the gear ratios from the spec sheet.
2. Type the rpm you want to look at, for example peak power or cruising rpm.
3. Enter the rolling circumference, or switch to tyre size and type the numbers from the tyre wall.
4. Try other sprockets in the box below and read the change.

## What each setting does

- **Primary ratio**: the engine's own first reduction (crank to gearbox).
- **Gear ratios**: first gear to top, separated by commas.
- **New front / rear**: the sprockets you are thinking of. A bigger rear gives quicker pull and a lower top speed.
- **Chain pitch and centre distance**: used for the link count only. It is a rough estimate.

## Worked example

Front 14, rear 42 gives 3.0 : 1. With a primary ratio of 3.0 and top gear 1.0 the overall ratio is 9.0. At 6,000 rpm the wheel turns 667 times a minute, and with a 2,000 mm rolling circumference that is 80 km/h. Changing to a 45 tooth rear makes it 80 x 42 / 45 = 74.7 km/h, 6.7% lower.

## FAQs

**Does a smaller front sprocket do the same as a bigger rear?** Yes, only the ratio matters. A rear change is usually kinder to the chain, because the chain wraps around a bigger sprocket more gently.

**Why does my speedometer differ?** Tyre wear, tyre size and the speedometer's own error all shift it. A sprocket change can also shift it on some bikes.

**Is this the real top speed?** No. Wind, power and tyre slip limit the real top speed.

Check your bike maker's manual before changing sprockets.
