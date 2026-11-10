---
name: Electricity cost
num: 1779
shelf: money
code: T813
section: shopping
title: "Electricity cost calculator: what your appliances cost per day, month and year"
summary: "Add your appliances and see what each one costs to run, with a flat price or time-of-use prices, including standby power."
status: live
ads: false
order: 1779
icon: calculator
works: offline
updated: 2026-11-10
related: [solar-pv-yield, budget-calculator, fuel-cost]
sources:
  - "Cost = kilowatt-hours x price per kWh. kWh = watts x hours / 1000. A month is taken as 730 hours."
  - "Appliance watts are typical round figures, not measurements. Check the label on your appliance or use a plug-in power meter. Tariffs (including time-of-use on, mid and off-peak prices and hours) are set by your utility and change; take them from your bill or its website and check the official source."
flow:
  - { icon: sliders, label: "Appliances" }
  - { icon: coin, label: "Tariff" }
  - { icon: calculator, label: "Usage" }
  - { icon: wallet, label: "Cost" }
---

## What it does

Pick the appliances you use, say how many hours a day and days a month they run, and the page works out the kilowatt-hours (kWh) and the money each one uses, plus the total per day, month and year. It also counts standby power, the small amount many devices draw while they are off but plugged in.

You can use one flat price per kWh, or a time-of-use plan like Ontario's, where on-peak, mid-peak and off-peak hours cost different amounts. If you are thinking of solar, [[solar-pv-yield]] shows what panels could produce, [[budget-calculator|the budget planner]] puts the bill in your month, and [[fuel-cost]] does the same sum for driving.

## How to use it

1. Choose an appliance from the list and press **Add**. Add as many as you like, or pick "My own" and type its watts.
2. Change the watts, hours a day and days a month to match your home.
3. Choose your price type and type the prices from your bill.

## What each setting does

- **Watts**: how much power it draws while running. Heaters and dryers use thousands; bulbs and routers use a few.
- **Hours a day / days a month**: how long it is really on.
- **Standby W**: power drawn in the remaining hours of the month.
- **Flat price**: one price for every kWh.
- **Time-of-use**: type the three prices and the share of your use that falls in on-peak and mid-peak hours; the rest counts as off-peak. The page uses the blended price.
- **Fixed monthly charge**: delivery or connection fees that do not depend on use.

## Worked example

A fridge of 150 W running 8 hours a day for 30 days uses 36 kWh. A television of 100 W for 4 hours a day uses 12 kWh, plus 0.61 kWh of standby. Together that is 48.61 kWh a month, which at 0.15 per kWh costs 7.29.

## FAQs

**Where do I find the watts?** On the label or manual. A fridge runs its motor only part of the time, so the 8 hours here are the hours it is actually running.

**Does it include taxes?** Only if the price you type does.

**Why is my real bill higher?** Heating, cooling and the many small devices are easy to miss, and bills add fixed charges and taxes.
