---
name: EV range
num: 1810
shelf: vehicles
code: T899
section: vehicle-running
title: "EV range estimator: how far an electric car goes with speed, cold and load"
summary: "Estimate an electric vehicle's real range from battery size and rated consumption, with editable effects for speed, outside temperature, heater or AC and load, plus charging time."
status: live
ads: false
order: 1810
icon: sliders
works: offline
updated: 2026-11-10
related: [ev-vs-petrol, fuel-cost, tyre-pressure]
sources:
  - "Range = usable battery kWh / consumption x 100. The speed, temperature, heater and load multipliers are typical, rounded figures chosen by fibub from the general pattern seen in public EV tests; real cars differ by model, tyres and wind, so every factor is editable. Rated consumption comes from your car's own label or test result (check the official source for your region). Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Battery" }
  - { icon: curve, label: "Factors" }
  - { icon: check, label: "Range" }
---

## What it does

A car's rated range comes from a lab test in mild weather at gentle speeds. This tool starts with your battery size and rated consumption, then adds the things that change it in real life: how fast you drive, how cold or hot it is, whether the heater or AC is on, and how heavily the car is loaded.

Each factor is shown as a number you can change, and the result shows the range with and without them. You can also type a charger power to see how long a charge takes. To compare running costs with a petrol car use [[ev-vs-petrol]], and [[tyre-pressure]] helps with one more cause of lost range.

## How to use it

1. Type the usable battery size in kWh and the rated consumption in kWh per 100 km.
2. Choose your speed and the outside temperature, and tick heater or AC and a heavy load if they apply.
3. Edit any factor if you know better, for example from your own trip data.
4. Add a charger power and the start and end charge percent to see the charging time.

## What each setting does

- **Factors**: each is a multiplier on consumption. 1.20 means 20% more energy per km.
- **Speed**: motorway speeds use much more energy because air resistance grows with speed squared.
- **Cold**: batteries are less efficient and the cabin needs heat.
- **Charging time**: energy added divided by charger power; real charging slows near full, so treat it as a minimum.

## Worked example

60 kWh at 16 kWh/100 km with every factor at 1.00 gives 60 / 16 x 100 = 375 km. At 120 km/h (x1.40) and -5 °C (x1.30) with the heater (x1.10) consumption rises to 16 x 2.0 = 32 kWh/100 km, and the range falls to about 187 km.

## FAQs

**Why is my real range lower?** Speed, cold, hills, wind and tyre choice. Try editing the factors from your own trips.

**What is usable capacity?** The part of the battery the car lets you use, which is less than the label number on some cars.

**How much to charge to?** Many people charge to 80% for daily use; the tool lets you set both ends.

Figures are estimates, not a promise. Plan long trips with the car's own range display.
