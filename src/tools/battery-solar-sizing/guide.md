---
name: Battery runtime and solar sizing
num: 627
shelf: science
section: electrical-and-electronics
title: "Battery runtime and off-grid solar sizing calculator: Peukert runtime, panels, battery bank and charge controller"
summary: "How long will a battery run a load, with converter efficiency, usable depth of discharge and the Peukert effect? And what does an off-grid solar system need: list your appliances to get the daily load, solar array size and number of panels, battery bank in Wh and Ah with a series and parallel layout, and the charge controller current."
status: live
ads: true
order: 627
icon: calculator
works: offline
updated: 2026-11-09
related: [battery-cycling-analyser, sun-position-calculator, solar-pv-yield, home-battery-sizing, led-resistor-calculator, lcoe-calculator, cubesat-power-budget]
sources:
  - "Battery energy (Ah × V), runtime from usable capacity, and Peukert's law t = H·(C/(I·H))^k (Peukert 1897): general electrical engineering."
  - "Off-grid sizing method (daily load ÷ peak sun hours with derating for losses and charge efficiency; battery bank = daily load × days of autonomy ÷ depth of discharge; controller current = array W ÷ system V × 1.25): common practice in solar design guides, written by fibub."
  - "All example values (battery, loads, peak sun hours, losses, efficiencies) are made up by fibub for illustration."
flow:
  - { icon: calculator, label: "Load" }
  - { icon: clock, label: "Runtime" }
  - { icon: target, label: "Sun hours" }
  - { icon: check, label: "Panels" }
---

## What it does

Two linked sums for anyone running things from batteries, from a camping fridge to a cabin with solar panels.

**Battery runtime.** From the battery's capacity (Ah or Wh) and voltage, the load (watts at the device or amps from the battery), the efficiency of any converter or inverter, and how much of the battery you are willing to use, the page gives the **runtime**. It also applies **Peukert's law**: batteries deliver less than their rated capacity when drained faster than the rate they were rated at (often 20 hours). The chart shows how runtime falls as the load rises, with and without that effect.

**Off-grid solar sizing.** List your appliances with their watts, hours a day and quantity, and the page adds up the **daily load**. Using your **peak sun hours** and allowances for losses, it sizes the **solar array** and the number of panels, the **battery bank** for the days you want to cover without sun, the **series and parallel layout** of the batteries, and the **charge controller** current.

Estimate a year's output from a roof system with the [[solar-pv-yield]] tool, and size a battery for a home on the grid with the [[home-battery-sizing]] tool.

## How to use it

1. **Runtime**: type the capacity and choose Ah or Wh, the battery voltage and the load. Set the converter efficiency (100 % for a DC load connected directly), the usable depth of discharge (about 50 % is common for lead-acid; lithium batteries are often used to 80 to 90 %) and the Peukert exponent and rated hours from the datasheet.
2. **Solar**: paste or open your appliance list (name, watts, hours per day, quantity). For things that cycle on and off, like a fridge, use the average power or the real running hours.
3. Set the **peak sun hours** for your place in the worst month you care about, the system losses, efficiencies, days of autonomy, depth of discharge, system voltage and the panel and battery you plan to use.

## Worked example

All values are made up. A 100 Ah, 12 V battery runs a 60 W load through a 90 % efficient inverter, using half its capacity. The battery supplies 5.56 A, so the simple runtime is 9 h. With a Peukert exponent of 1.2 rated at 20 hours, the page shows **About 8 h 49 min (9 h 00 min without Peukert)**.

The example appliances (lights, fridge, laptop, phone chargers and a fan) use **1230 Wh a day**. With 4.5 peak sun hours, 25 % losses, a 90 % inverter and 90 % charge efficiency, the array needs 450 W, so two 400 W panels. Two days of autonomy at 50 % depth of discharge on a 24 V system need 5467 Wh, or 228 Ah: the page shows **2 × 400 W panels, 6 × 12 V 100 Ah batteries** (2 in series × 3 in parallel), with a charge controller of at least 41.7 A.

## Good to know

- Peak sun hours change a lot with season and place. Size for the worst month you need power in.
- Battery capacity also falls in the cold and as the battery ages. Many designers add a margin on top.
- For study and planning, not a substitute for professional judgement. Cable sizes, fuses, earthing and local rules matter for safety. Check your local electrical code and a qualified installer.

## FAQ

**What is the Peukert exponent?** A number from the battery maker that says how much capacity is lost at high currents. 1 means no loss. Lead-acid batteries are typically higher than lithium.

**Why divide by the depth of discharge?** Draining a battery fully shortens its life. If you only use half, you need twice the capacity.

**MPPT or PWM controller?** The page sizes an MPPT controller by array watts ÷ battery voltage × 1.25. For a PWM controller, use the array's short-circuit current × 1.25 instead.
