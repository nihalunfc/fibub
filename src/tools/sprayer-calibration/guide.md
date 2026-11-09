---
name: Sprayer calibration calculator
num: 387
shelf: science
section: agronomy-and-soil-science
title: "Sprayer calibration calculator: boom spray volume (L/ha or gal/acre) from nozzle flow, speed and spacing, catch test and product per tank"
summary: "Work out a boom sprayer's spray volume from nozzle flow, travel speed and nozzle spacing, or the nozzle flow and pressure a volume needs. Check every nozzle with a catch test, use the 1/128-acre method, and see how far a tank goes and how much product goes in each tank for the label rate you type."
status: live
ads: true
order: 387
icon: sliders
works: offline
updated: 2026-11-09
related: [seeding-rate-calculator, fertiliser-blend-calculator, irrigation-scheduler, soil-test-interpreter, field-trial-designer, disease-progress-audpc, leaf-disease-severity, unit-converter]
sources:
  - "Spray volume = nozzle flow ÷ area swept per minute (600 × L/min ÷ (km/h × m), or 5940 × gal/min ÷ (mph × inches)); flow proportional to the square root of pressure; the 1/128-acre method (128 fl oz in a US gallon). Standard calibration arithmetic with exact unit conversions."
  - "No product rates are bundled or suggested: the user types the rate from the product label."
  - "Checked against a Python calculation from first principles and the US 5940 rule (they agree exactly), and numpy for the catch-test statistics. The example values are made up."
flow:
  - { icon: sliders, label: "Nozzles" }
  - { icon: clock, label: "Speed" }
  - { icon: check, label: "Catch test" }
  - { icon: calculator, label: "Per tank" }
---

## What it does

A boom sprayer puts down a spray volume (litres per hectare or gallons per acre) set by three things: how much each nozzle gives per minute, how fast you drive, and how far apart the nozzles are. Each nozzle sprays a strip one nozzle-spacing wide, so

**spray volume (L/ha) = 600 × nozzle flow (L/min) ÷ (speed (km/h) × spacing (m))**,

or, in US units, gal/acre = 5940 × gal/min ÷ (mph × spacing in inches). This page does those sums both ways and the checks that go with them.

For the seed drill, use the [[seeding-rate-calculator]]; for granular fertiliser, the [[fertiliser-blend-calculator]].

## How to use it

1. **Application rate.** Pick the units, then either work out the spray volume from the nozzle flow, or the nozzle flow you need for a spray volume. Add the nozzle's rated flow and pressure from the nozzle or its chart to see the pressure that gives your flow (flow rises with the square root of pressure).
2. **Speed.** Speedometers and wheel slip mislead, so time the sprayer over a measured distance in the field at spraying gear and engine speed, and press **Use this speed**.
3. **Catch test.** With the sprayer running at spraying pressure, catch from every nozzle for the same time and type the volumes along the boom. Nozzles more than your tolerance (10 % is a common rule of thumb) from the mean are flagged for cleaning or replacing. **Use the mean flow above** puts the measured flow into the rate.
4. **Tank and product.** Give the tank size, the field area and the product rate **from the label**. The page shows the area one tank covers, how many tanks the field needs with the size of the last part tank, and the product in each.

In US units the **1/128-acre method** is also shown: drive the course length for your nozzle spacing, catch from one nozzle for that time, and the fluid ounces caught equal the gallons per acre.

## Worked example

The page opens with made-up values: 24 nozzles at 50 cm, each giving 1.2 L/min at 8 km/h. The **spray volume is 180.0 L/ha** (19.24 gal/acre); the boom is 12 m wide and covers 9.60 ha per hour at full speed. If the nozzle is rated 1.0 L/min at 3 bar, 1.2 L/min needs 4.32 bar. A 100 m run in 45 s is 8.00 km/h.

The catch test of six nozzles over 60 s has a mean of 1.181 L/min; nozzle 4 gives 11.1 % less than the mean and is flagged. A 3,000 L tank covers 16.67 ha, so 47 ha takes 2 full tanks and a last one of 2,460 L. If you type a label rate of 1.5 L/ha (only a number to show the sums, not a rate for any product), each full tank takes 25 L of product and the last one 20.5 L.

## FAQ

**Does it tell me how much product to use?** No. The rate always comes from the product label and local rules; this page only multiplies.

**Why measure instead of using the chart?** Worn nozzles flow more, blocked ones less, and the pressure at the nozzle is lower than at the gauge. Calibrate at the start of each season and when you change nozzles.

**Is anything uploaded?** No. Everything runs in your browser and works offline. For study and planning, not a substitute for professional judgement.
