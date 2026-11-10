---
name: EV vs petrol
num: 1780
shelf: money
code: T814
section: vehicle-running
title: "EV vs petrol: total cost of ownership, break-even and CO2"
summary: "Compare an electric car, a petrol car and a hybrid over the years you keep it: price, incentives, energy, upkeep, insurance, resale, break-even and rough CO2."
status: live
ads: false
order: 1780
icon: calculator
works: offline
updated: 2026-11-10
related: [fuel-cost, car-loan, electricity-cost]
sources:
  - "Total cost of ownership = price minus incentive, plus yearly energy, upkeep and insurance for each year, minus the resale value at the end. Loan interest is not included."
  - "CO2: petrol 8.887 kg per US gallon, about 2.35 kg per litre (US EPA, epa.gov greenhouse gas equivalencies, checked 2026-11-10). Electricity: the start value 0.4 kg per kWh is close to the US average of 0.39 kg (EPA eGRID); grids in Canada, the UK, India and the Gulf differ and change yearly, so check your own grid's figure at the official source."
  - "Incentives, rebates and taxes differ by country and year; check the official source."
flow:
  - { icon: coin, label: "Prices" }
  - { icon: sliders, label: "Driving" }
  - { icon: calculator, label: "Compare" }
  - { icon: chart, label: "Break-even" }
---

## What it does

Electric cars cost more to buy and less to run. This page puts numbers on that for your own driving: you enter what each vehicle costs, how far you drive and what energy costs, and it adds up the total cost of owning each one for the years you plan to keep it. A hybrid column is there as a third option and can be switched off.

It also finds the break-even point, the number of years of driving after which the electric car has saved back its higher price, and gives a rough CO2 figure per year. To add loan interest see [[car-loan]], for a detailed petrol trip see [[fuel-cost]], and for your home charging bill see [[electricity-cost]].

## How to use it

1. Fill in the price, rebate, fuel use, upkeep, insurance and resale for each vehicle.
2. Enter the kilometres a year, the years you keep the car, the petrol price and your electricity prices.
3. Say what share of charging is at home; public fast charging usually costs more.

## What each setting does

- **Incentive**: any purchase rebate or tax credit you actually qualify for.
- **Litres per 100 km / kWh per 100 km**: from the sticker. Real use is higher in winter.
- **Resale value**: the share of the price you expect to get back at the end.
- **Grid CO2**: how much CO2 your electricity makes per kWh; the tailpipe figure for petrol is fixed.

## Worked example

Over 8 years at 15,000 km a year, the example petrol car costs 55,360 in total, the hybrid 51,000 and the electric car 46,778. The electric car costs 8,000 more up front but 1,623 less each year to run, so it breaks even after about 4.9 years.

## FAQs

**Why is the total different from my loan payments?** This is the cost of ownership, not the loan. Interest, if you borrow, is extra.

**Are the defaults real?** No. They are examples; replace them with real quotes.

**Is the CO2 complete?** No. It leaves out making the car and the battery, and the fuel's own supply chain.
