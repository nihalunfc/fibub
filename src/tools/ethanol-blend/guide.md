---
name: Ethanol blend
num: 2120
shelf: vehicles
code: T947
section: fuel-types
title: "E10 and E20 petrol: mileage and cost calculator"
summary: "Work out how much mileage you may lose on E10, E15, E20 or E85 compared with plain petrol, and what each kilometre and each month costs."
status: live
ads: false
order: 2120
icon: percent
works: offline
updated: 2026-11-12
related: [octane-guide, fuel-cost, real-mileage]
sources:
  - "Energy per litre: petrol about 32 MJ/L, ethanol about 21 MJ/L (typical published figures; both are editable). The blend's energy is the weighted average, and mileage is taken to move in proportion. Real cars often lose less, because engines tuned for ethanol run more efficiently. Blends in use as checked November 2026; check the official source. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Blend" }
  - { icon: coin, label: "Prices" }
  - { icon: chart, label: "Compare" }
---

## What it does

Ethanol holds less energy than petrol, so a litre of E20 (20% ethanol, 80% petrol) carries less energy than a litre of plain petrol. This tool does the energy sum for you, turns it into a likely new mileage, and then compares what a kilometre and a month cost on each fuel.

It is a quick estimate from energy content only. Real mileage can differ, so measure your own with [[real-mileage]], and see your yearly fuel bill with [[fuel-cost]]. If you are choosing grades too, [[octane-guide]] explains the numbers on the pump.

## How to use it

1. Pick the fuel you used before and the blend you are comparing with.
2. Type your mileage on the old fuel, in km per litre.
3. Type the price per litre of each fuel and how far you drive in a month.
4. Read the mileage drop, the new mileage and the cost per kilometre.

## What each setting does

- **Old fuel / new blend**: E0 is plain petrol. E10 is 10% ethanol, E85 is 85%. "Custom" lets you type your own percentage.
- **Mileage**: km per litre on the old fuel.
- **Price per litre**: what each fuel costs where you fill up.
- **Kilometres a month**: turns the cost per kilometre into a monthly figure.
- **Energy per litre** (under the details): change petrol and ethanol energy if you have better figures.

## Worked example

A car does 15 km/L on E0. A litre of E20 holds 0.8 x 32 + 0.2 x 21 = 29.8 MJ against 32 MJ, about 6.9% less energy. Mileage then comes to about 15 x 0.931 = 14.0 km/L.

## FAQs

**Will my real mileage drop that much?** Often by less. The energy sum is the most that the fuel itself explains, and cars built for a blend can claw some back.

**Is every car fine with E10 or E20?** No. Check the fuel flap and the manual for the blends your car is approved for. Older cars and some motorcycles are not. Rules as checked November 2026; check the official source.

**Why is E85 so different?** It holds roughly a quarter less energy than petrol, and only cars made for it should use it.
