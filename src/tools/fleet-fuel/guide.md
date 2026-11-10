---
name: Fleet fuel
num: 1819
shelf: money
code: T908
section: trucking
title: "Fleet fuel report: fuel economy per vehicle from a fuel-card CSV"
summary: "Open a fuel-card CSV on your own device to see each vehicle's fuel economy and cost per km or mile, and flag fills that look wrong: bigger than the tank, too close together, or much worse than usual."
status: live
ads: false
order: 1819
icon: chart
works: offline
updated: 2026-11-10
related: [cost-per-mile, fuel-cost, mileage-log, load-profit]
sources:
  - "Method: the full-tank method. Distance between the first and last fill divided by the fuel in every fill after the first. Flags compare each stretch with the vehicle's own median. fibub's own rules of thumb; a flag is a reason to check, not proof."
flow:
  - { icon: file, label: "Open CSV" }
  - { icon: table, label: "Map" }
  - { icon: chart, label: "Economy" }
  - { icon: flag, label: "Flags" }
---

## What it does

Fuel cards give you a long list of fills. This tool turns it into one line per vehicle: how far it went, how much fuel it used, its economy (km/L, miles per gallon) and what each km or mile cost in fuel. It also marks fills that deserve a second look, such as a fill larger than the tank or a sudden drop in economy that could be a leak, a fault or fuel going missing.

Your file is read on this device only. Nothing is uploaded and nothing is stored. When you want to turn the economy into a full running cost, use [[cost-per-mile]], and [[fuel-cost]] prices a single trip.

## How to use it

1. Open a CSV with one row per fill. Try the example button first if you like.
2. Check the column choices: vehicle, odometer, fuel quantity, amount paid, date. The tool guesses from the headings.
3. Choose kilometres or miles, and litres or gallons.
4. Set the tank size (or sizes for particular vehicles), the closeness limit and how much worse than usual counts as a flag.

## What each flag means

- **Bigger than the tank**: the fill is more than the tank size you gave. Either the tank size is wrong, two fills are one row, or fuel went elsewhere.
- **Two fills close together**: the odometer moved less than your limit since the last fill. A vehicle cannot burn much fuel in that distance.
- **Economy much worse than usual**: that stretch is more than your percentage under the vehicle's median. Needs at least three stretches.

## Worked example

A vehicle with fills at odometer 100,000 (250 L), then 200 L at 100,800, 101,600, 102,400, 103,200 and 103,760 km. Distance 3,760 km on 1,000 L gives 3.76 km/L. Each of the first four stretches gave 4.0 km/L, the last 560 / 200 = 2.8, which is 30% under the usual 4.0, so it is flagged at the 25% setting. If each 200 L fill cost 240, the fuel cost 1,200 over 3,760 km, which is 0.319 a km.

## FAQs

**What if I did not fill up every time?** Part fills spoil the method; economy over many fills is still fair, but single-stretch flags may be false alarms.

**What if the odometer is missing?** The tool needs an odometer reading to work out distance, so rows without one are skipped and counted.

**Is my file kept?** No. It stays in your browser tab and is gone when you close it.
