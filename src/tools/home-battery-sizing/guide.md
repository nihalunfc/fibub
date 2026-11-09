---
name: Home battery storage sizing
num: 675
shelf: science
section: energy-and-power-systems
title: "Home battery sizing calculator: self-consumption, grid import and export, backup hours and payback with solar"
summary: "Simulate a home battery hour by hour with your load and solar data (or a made-up template year), sweep battery sizes, and see self-consumption, grid import and export, cycles, backup hours and a recommended size. Nothing is uploaded."
status: live
ads: true
order: 675
icon: chart
works: offline
updated: 2026-11-09
related: [battery-cycling-analyser, sun-position-calculator, load-flow, solar-pv-yield, lcoe-calculator, battery-solar-sizing, wind-energy-yield]
sources:
  - "Own code: a step-by-step energy balance of load, solar and a battery with round-trip losses split equally between charging and discharging (a common simple battery model)."
  - "Checked against a separate Python re-implementation on a made-up 14-day profile for five batteries (hourly, half-hourly and quarter-hourly steps), plus energy-balance identities."
  - "The template household load shape, solar shape, cloudiness and prices are made up for fibub and labelled as examples; they are not taken from any survey, tariff or database."
flow:
  - { icon: table, label: "Load, solar" }
  - { icon: sliders, label: "Battery" }
  - { icon: chart, label: "Sweep" }
  - { icon: target, label: "Best size" }
---

## What it does

A home battery stores the solar power you would otherwise export and gives it back in the evening. This tool works out how much that helps, step by step through a year of data:

- **Self-consumption**: the share of your solar used at home rather than exported.
- **Self-sufficiency**: the share of your home's use met by your own solar and battery.
- **Grid import and export**, battery **cycles** a year and the energy **lost** to efficiency.
- **Backup**: how long the battery can run your critical loads (fridge, lights, router, heating pump) in a power cut, from full, from the backup share alone, and at the worst moment in the data.
- A **sweep** of battery sizes from 0 up to the largest you choose, with a **recommended size**: the smallest that gets most of the possible saving.
- Optional **money**: yearly bill saving and simple payback from your own prices.

Work out how much your panels make first with the [[solar-pv-yield|solar PV yield estimator]], and compare lifetime costs with the [[lcoe-calculator|LCOE calculator]].

## How to use it

1. **Profile**: start with the made-up template year (enter your daily use, solar array size and a rough solar yield), or choose **My own data** and paste or open two columns, load and solar in kW, one row per hour (or per 30 or 15 minutes). Smart meter and inverter apps usually export this.
2. **Battery**: usable capacity, power, round-trip efficiency and the share kept back for backup. The sweep keeps the same power per kWh as your battery.
3. **Recommend**: the default picks the smallest size that gives at least 90 % of the biggest cut in grid import seen in the sweep. Raise it if you want more independence, lower it to save money.

How the model works: solar first serves the home. Any surplus charges the battery (up to its power and space), then is exported. Any shortfall comes from the battery (down to the backup share), then from the grid. Losses are split equally between charging and discharging.

## Worked example

With the template (12 kWh a day, 5 kWp, 3.5 kWh per kWp per day, 40 % swing, northern hemisphere) and a 10 kWh, 5 kW battery at 90 % with 20 % kept for backup: the year has 4,376 kWh of home use and 6,388 kWh of solar. Without a battery, self-consumption is 30.5 % and self-sufficiency 44.5 %. With the battery they rise to 64.9 % and 89.7 %, grid import falls from 2,430 to 453 kWh, and the battery does 198 cycles a year. A 0.5 kW critical load runs for 19 h from full and 3.79 h from the backup share. The recommended size is **8 kWh (4 kW)**: beyond it, each extra kWh of battery saves fewer than 50 kWh a year. With the example prices (0.30 to buy, 0.08 for export, 600 per kWh of battery) the 10 kWh battery saves about 417 a year and pays back in 14.4 years.

## Tips

- A full year of real data is best: winter and summer need very different sizes.
- If the payback is longer than the battery's warranty, a smaller battery, or none, may be better value.
- The model has no time-of-use tariffs, grid charging or battery ageing.

## FAQ

**Why does a bigger battery stop helping?** On most days the solar surplus fills only so much; extra capacity sits empty.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
