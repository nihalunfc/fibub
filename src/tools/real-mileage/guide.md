---
name: Real mileage
num: 1804
shelf: money
code: T893
section: vehicle-running
title: "Real mileage calculator: km/L, L/100 km and mpg from your fill-ups"
summary: "Log your fill-ups with the full-tank method and see your real km/L, L/100 km, US and UK mpg, cost per km, a trend chart and the range left in the tank."
status: live
ads: false
order: 1804
icon: chart
works: offline
updated: 2026-11-10
related: [fuel-cost, mileage-log, ev-vs-petrol]
sources:
  - "Full-tank method: distance between two full fill-ups divided by the fuel added at the second one. Conversions: 1 mile = 1.609344 km, 1 US gallon = 3.785411784 L, 1 UK (imperial) gallon = 4.54609 L. Tank sizes are typical round numbers you can change. Drawings are fibub's own."
flow:
  - { icon: pencil, label: "Log fills" }
  - { icon: calculator, label: "Work out" }
  - { icon: curve, label: "Trend" }
  - { icon: check, label: "Range" }
---

## What it does

Maker figures for fuel use are measured in a lab. Your own number depends on traffic, load, tyres and how you drive. This tool takes the odometer and the fuel you add at each fill-up and gives you the real figure: km per litre, litres per 100 km, miles per US gallon and miles per UK gallon, plus what each kilometre costs you.

It works for a car, a two-wheeler or a truck, and for electric vehicles if you choose kWh. To price a planned journey use [[fuel-cost]], to keep a log for tax or work use [[mileage-log]], and [[ev-vs-petrol]] compares an electric vehicle with a petrol one.

## How to use it

1. Fill the tank to the click, and write down the odometer. That is your first row, ticked Full.
2. Next time, fill to the click again. Add a row with the new odometer, the fuel added and the price per unit, and keep Full ticked.
3. If you topped up part way, add that row with Full unticked. Its fuel is counted with the next full fill.
4. Read the result. Add more rows to see the trend.

## What each setting does

- **Distance in** and **Fuel in**: the units your odometer and pump use. All results are shown in the common units as well.
- **Tank or battery size** and **Tank level now**: used for the range left, which is the tank level times your average km per litre.
- **Keep my log on this device**: off by default. When ticked, your rows are stored in this browser only; "Clear saved log" removes them.

## Worked example

Odometer 10,000 at a full fill-up. At 10,450 you add 30 L and the tank is full again. That is 450 km on 30 L: 15.00 km/L, which is 6.67 L per 100 km, or about 35.3 miles per US gallon. If the fuel was 1.50 a litre, you paid 0.10 per km.

## FAQs

**Why do I need a full tank each time?** The pump only tells you what was added. When the tank is full at both ends, what was added is exactly what was used.

**Why does my figure change a lot?** Winter, short trips, roof racks and low tyre pressure all cost fuel. The chart shows whether it is a one-off or a trend.

**Can I save the log?** Download it as a CSV, or tick the keep box to store it in this browser.

Estimates only; the odometer and pump can each be a little out.
