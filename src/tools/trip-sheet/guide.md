---
name: Trip sheet
num: 1803
shelf: money
code: T893
section: trucking
title: "Truck trip sheet: freight, diesel, tolls, driver bata and profit per trip"
summary: "Fill in a truck trip sheet with freight, advance, diesel fills, tolls, driver bata and loading charges to get km run, km per litre, total cost, profit and the balance due to the driver. Print it or save a PDF."
status: live
ads: true
order: 1803
icon: table
works: offline
updated: 2026-11-10
related: [eway-bill-validity, fuel-cost, mileage-log]
sources:
  - "Sums only: cost = diesel + tolls + bata + loading and unloading + other; profit = freight - cost; balance due to the driver = bata + expenses the driver paid - advance. The sheet layout is fibub's own."
flow:
  - { icon: pencil, label: "Trip" }
  - { icon: wallet, label: "Expenses" }
  - { icon: coin, label: "Profit" }
  - { icon: download, label: "Print" }
---

## What it does

A trip sheet is the record a truck owner keeps for every run: where the truck went, what the party pays, what the driver was given and what was spent on the way. This one does the sums as you type. It shows the kilometres run, the truck's kilometres per litre, the total cost, the profit on the trip and how much is still owed to the driver, or how much the driver should give back from the advance.

When it is done, print it for the driver and owner to sign, or download a PDF for your files. Before the trip, [[eway-bill-validity]] tells you how long the e-way bill lasts; [[fuel-cost]] estimates the diesel in advance, and [[mileage-log]] keeps a running log of many trips.

## How to use it

1. Type the vehicle number, driver, route, dates and odometer readings.
2. Enter the freight and the advance handed to the driver.
3. Add each diesel fill as litres and price per litre.
4. Enter tolls, the daily bata, loading charges and anything else.
5. Tick what the driver paid from the advance, then print or download.

## What each setting does

- **Freight**: what the party pays for the trip.
- **Advance**: cash given to the driver at the start, used for expenses on the road.
- **Driver bata**: the daily allowance for food and stay. The dates fill in the number of days (both ends counted); change it if you agreed otherwise.
- **Paid by the driver**: ticked expenses came out of the advance, so they count towards what the driver has used. Diesel is often paid by card or on the pump's credit, so it starts unticked.
- **Keep this trip sheet**: off by default. When ticked, the sheet stays in this browser only; Clear removes it.

## Worked example

Freight 40,000 with an advance of 10,000. Diesel: one fill of 150 litres at 95, which is 14,250. Tolls 2,500 and bata of 500 for 3 days, 1,500. Total cost is 18,250 and the profit is 21,750. Over 900 km the truck did 6.00 km per litre. The driver paid the tolls and has the bata due, 4,000 in all, so the driver gives back 6,000 of the advance.

## FAQs

**Does profit include the truck's EMI, tyres or insurance?** No. This is the trip's direct cost. Fixed costs are spread over the month's trips.

**Can I use miles or gallons?** The sums work in any unit, but the labels say km and litres.
