---
name: LCOE calculator
num: 676
shelf: science
section: energy-and-power-systems
title: "LCOE calculator"
summary: "Work out the levelised cost of energy of a solar, wind, gas or any other plant from capital cost, fixed and variable O&M, fuel, output loss, discount rate, lifetime and capacity factor, with a yearly cash-flow table, a cost breakdown and a tornado chart. Nothing is uploaded."
status: live
ads: true
order: 676
icon: currency
works: offline
updated: 2026-11-09
related: [home-battery-sizing, load-flow, lca-compare, solar-pv-yield, wind-energy-yield, npv-irr-calculator, inflation-calculator, carbon-footprint]
sources:
  - "Own code: the standard LCOE definition (present value of lifetime costs divided by present value of lifetime energy) and the capital recovery factor, as found in energy economics textbooks."
  - "Checked against a separate NumPy calculation on the three example plants and five random input sets (agreement to 1 part in 10 billion), and against the annuity formula when there is no output loss or cost rise."
  - "The example plants (solar, wind, gas) are made-up round numbers for fibub, not market prices, study results or agency figures."
flow:
  - { icon: pencil, label: "Costs" }
  - { icon: percent, label: "Discount" }
  - { icon: currency, label: "LCOE" }
  - { icon: chart, label: "Tornado" }
---

## What it does

The levelised cost of energy (LCOE) is the price per MWh at which a power plant would exactly pay back everything it costs over its life, once money in the future is discounted. It lets you compare plants with very different cost patterns: a solar farm that costs a lot up front and almost nothing to run, against a gas plant that is cheaper to build but burns fuel every hour.

LCOE = (capital + Σ discounted yearly costs) ÷ Σ discounted yearly energy

This calculator gives:

- the **LCOE** per MWh and per kWh, and a **shortcut** value from the capital recovery factor;
- how it splits into **capital, fixed O&M, variable O&M and fuel**;
- a **tornado chart**: the LCOE when each input moves up and down by the same share, biggest effect at the top;
- the **cash flow** year by year (energy, each cost, discount factor and present values), as a table and a CSV.

Get the yearly energy from the [[solar-pv-yield|solar PV yield estimator]] or the [[wind-energy-yield|wind turbine yield calculator]], and test the investment with the [[npv-irr-calculator]].

## How to use it

1. Pick an example plant to start from (all made up), then type your own values. Use one currency throughout.
2. **Capital cost** is the overnight cost per kW, spent at year 0. **Fixed O&M** is per kW per year; **variable O&M** per MWh generated.
3. **Fuel**: price per GJ of fuel times the **heat rate** (GJ of fuel burned per MWh of electricity). Set the heat rate to 0 for wind, solar and hydro.
4. **Capacity factor** sets the energy: MW × 8,760 hours × capacity factor in year 1. **Output loss** lowers it each year (solar panels lose roughly half a percent a year).
5. **Discount rate**: use a real rate if costs are in today's money, or a nominal rate together with a cost rise equal to inflation.

Energy and running costs are counted at the end of each year; there is no build period, tax, subsidy, debt structure or end-of-life cost.

## Worked example

The made-up solar farm: 50 MW, 1,000 per kW, 15 per kW per year fixed O&M, no fuel, 22 % capacity factor, 0.5 % output loss a year, 7 % discount rate, 30 years. It makes 96,360 MWh in year 1 and 2,690,676 MWh over its life (1,139,584 MWh discounted). The present value of all costs is 59,306,781, so the **LCOE is 52.04 per MWh** (0.0520 per kWh): 43.88 from capital and 8.17 from fixed O&M. The capital recovery factor at 7 % over 30 years is 0.08059, and the shortcut LCOE (no output loss) is 49.60. The tornado shows the capacity factor matters most: ±20 % moves the LCOE from 65.05 to 43.37.

The made-up gas plant comes to 71.05 per MWh, of which 46.42 is fuel, so its fuel price and heat rate top the tornado.

## FAQ

**Why is LCOE not the whole story?** It ignores when the energy comes (solar at noon is worth less than power on a winter evening), grid costs and backup. Use it to compare like with like.

**Is my data uploaded?** No. Everything runs in your browser and works offline.

For study and planning; check real projects with your own quotes and a qualified adviser.
