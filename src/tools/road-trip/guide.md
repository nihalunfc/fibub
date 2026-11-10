---
name: Road trip
num: 1807
shelf: money
code: T896
section: vehicle-running
title: "Road trip planner: driving time, breaks, fuel stops, cost and arrival time"
summary: "Plan a drive from legs with distance and average speed: total time with breaks, fuel stops from your tank size, fuel cost, tolls and the time you will arrive."
status: live
ads: false
order: 1807
icon: compass
works: offline
updated: 2026-11-10
related: [fuel-cost, trip-splitter, vehicle-routing]
sources:
  - "Driving time = distance / average speed for each leg. A break is added after every full block of driving hours (none at the very end). Fuel = distance x economy; conversions: 1 mile = 1.609344 km, 1 US gallon = 3.785411784 L, 1 UK gallon = 4.54609 L. Drawings are fibub's own."
flow:
  - { icon: pencil, label: "Legs" }
  - { icon: clock, label: "Breaks" }
  - { icon: coin, label: "Fuel" }
  - { icon: check, label: "Arrival" }
---

## What it does

Maps give you a time for the road. This tool adds what maps leave out: the breaks you need, the stops to refuel and what the whole trip will cost. You say how far each leg is and how fast you expect to go, how often you stop and how thirsty your vehicle is.

You get the total time, the fuel stops, the fuel and toll cost, and the time you will arrive from your start time. For a single drive look at [[fuel-cost]], to share the bill between travellers use [[trip-splitter]], and [[vehicle-routing]] helps plan stops for many deliveries.

## How to use it

1. Enter each leg's distance and your average speed on it. Use the add button for more legs.
2. Set how often you take a break and for how long.
3. Choose your fuel economy unit and type the economy, tank size, fuel price and any tolls.
4. Pick the start time and read the result.

## What each setting does

- **Break every / Break length**: a break is added after each full block of driving. A trip of exactly 6 hours with a break every 2 hours has 2 breaks, not 3, because you are already there.
- **Tank size and Keep in reserve**: the tool assumes you start with a full tank and refuel when only the reserve is left. The number of stops is how many refills the trip needs.
- **Minutes per fuel stop**: added to the total time for each stop. Set it to 0 if you refuel during a break.

## Worked example

600 km at 80 km/h is 7 h 30 m of driving. With a 15 minute break every 2 hours you stop after 2, 4 and 6 hours: 3 breaks, 45 minutes. The total is 8 h 15 m, so leaving at 08:00 you arrive at 16:15. At 7 L per 100 km you need 42 L, which fits a 50 L tank with no fuel stop, and at 1.50 a litre the fuel costs 63.00.

## FAQs

**What average speed should I use?** Use your real average, not the speed limit. Town, hills and traffic pull it down; 70 to 80 km/h is common for mixed roads.

**Does this follow rest rules for lorry drivers?** No. Professional drivers have legal limits on hours; check the official rules for your region.

**Is the arrival time my local time?** It is the start time you typed plus the trip time, so if you cross a time zone, adjust by hand.
