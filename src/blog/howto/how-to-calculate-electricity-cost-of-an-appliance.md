---
title: "How to calculate the electricity cost of an appliance"
summary: "Multiply the appliance's watts by the hours it runs, divide by 1,000 to get kWh, then multiply by your price per kWh. A space heater and a computer worked through."
tools: [electricity-cost, budget-calculator, solar-pv-yield]
updated: 2026-11-10
sources:
  - "kWh = watts × hours ÷ 1,000 (definition of the kilowatt-hour). A month taken as 730 hours, as in the tool."
  - "Electricity prices and time-of-use hours are set by each utility and change; take them from your own bill and check the official source."
  - "Example numbers worked with fibub's own src/lib/money/household.ts."
---

An appliance's running cost is its power in kilowatts times the hours it runs, which gives kilowatt-hours (kWh), times what you pay per kWh. The [[electricity-cost]] calculator does this for a whole list of appliances at once, adds the small standby draw many devices have when switched off, and gives totals per day, month and year.

## What you need

- **The power in watts (W).** It is printed on a label on the back or base, on the plug adapter, or in the manual. A plug-in power meter, sold cheaply in hardware shops, measures it directly and is the most reliable way.
- **How long it really runs.** Hours a day and days a month. For things with a thermostat, such as fridges and heaters, count only the time the motor or element is actually on, not the time it is plugged in.
- **Standby watts**, if the device has a light, clock or remote sensor that stays on. Often 1 or 2 W.
- **Your price per kWh** from your electricity bill. Prices vary a lot between countries and plans, so use your own.

## Step by step

The formulas are:

**Energy (kWh) = power (W) × hours ÷ 1,000**

**Cost = energy (kWh) × price per kWh**

- Dividing by 1,000 turns watt-hours into kilowatt-hours, the unit on your bill.
- One kWh is 1,000 W for one hour, or 100 W for ten hours.

Standby adds a second, smaller term: standby watts × the hours the device is not in use. The calculator takes a month as 730 hours (8,760 hours a year ÷ 12), so idle hours are 730 minus the hours in use.

With the calculator:

1. The table opens with a fridge and a television as examples. Remove any you do not want with the **x** at the end of the row.
2. Pick an appliance from **Add an appliance** and press **Add**. It arrives with typical figures. Choose "My own" if yours is not listed, then rename it and type the watts.
3. Change **Watts**, **Hours a day**, **Days a month** and **Standby W** in the row to match your home. The row's kWh and cost update as you type.
4. Under **Your tariff**, keep **One flat price** and type your price per kWh, or switch to **Time-of-use** and enter on-peak, mid-peak and off-peak prices with the share of your use in each. The page blends them into one average rate.
5. Add any **Fixed monthly charge** from your bill if you want the whole-bill picture.
6. Read the totals: cost per day, month and year, the kWh a month, and the price used per kWh.

## A worked example

Say a household runs a 1,500 W space heater for 5 hours a day and a 200 W desktop computer for 6 hours a day (with 2 W standby), every day for 30 days, at 0.18 per kWh.

**Space heater**

1. Per day: 1,500 × 5 ÷ 1,000 = 7.5 kWh.
2. Per month: 7.5 × 30 = 225 kWh.
3. Cost: 225 × 0.18 = **40.50 a month**.

**Desktop computer**

1. In use: 200 × 6 × 30 ÷ 1,000 = 36 kWh.
2. Hours in use a month: 6 × 30 = 180, so idle hours are 730 − 180 = 550.
3. Standby: 2 × 550 ÷ 1,000 = 1.1 kWh.
4. Total 37.1 kWh, costing 37.1 × 0.18 = **6.68 a month**.

Together that is 262.1 kWh and **47.18 a month**, about **566.14 a year**, or roughly 1.55 a day averaged over the year. The heater is responsible for more than 85 % of the cost, even though it runs fewer hours than the computer. High-wattage devices that heat things (heaters, kettles, dryers, ovens) usually dominate a bill.

If you want to see how that sits in your monthly spending, the [[budget-calculator|budget planner]] takes the total as one line, and [[solar-pv-yield]] estimates what rooftop panels could produce against it.

## Check your answer

- **Quick hourly cost.** Power in kW times price gives the cost of one hour: 1.5 kW × 0.18 = 0.27 an hour for the heater. Five hours is 1.35 a day, and 30 days is 40.50, matching the table.
- **Compare with your bill.** Your bill shows the kWh used in the period. If your appliance list adds up to far more than the whole bill, some hours are probably too high, often for fridges and heaters that cycle on and off.
- **Watts or kilowatts?** A heater at 1.5 W or a bulb at 9,000 W is a sign the decimal point slipped.

## Questions people ask

**Why does a fridge show 8 hours, not 24?** Its compressor switches on and off to hold the temperature, so it draws full power only part of the day. Eight hours is a typical figure; a power meter left on for a day tells you yours.

**Is standby worth worrying about?** One device at 1 to 2 W costs little, but a home can have twenty such devices. Switching them off at the wall adds up over a year.

**Does the cost include tax?** Only if the price you type includes it. Some bills list taxes and delivery charges separately, so check the official source, your own bill, for what is included.
