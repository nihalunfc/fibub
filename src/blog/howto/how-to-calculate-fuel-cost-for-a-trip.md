---
title: "How to calculate fuel cost for a trip (mpg or L/100 km)"
summary: "Divide the distance by your fuel economy to get the fuel used, then multiply by the price. Worked US and metric road-trip examples, split between passengers."
tools: [fuel-cost, trip-splitter, commute-cost]
updated: 2026-11-10
sources:
  - "Unit definitions: 1 mile = 1.609344 km, 1 US gallon = 3.785411784 L, 1 UK gallon = 4.54609 L."
  - "Example numbers worked with fibub's own src/lib/money/shopping.ts."
---

To find the fuel cost of a trip, work out how much fuel the distance needs from your car's fuel economy, then multiply that by the price per litre or gallon. The [[fuel-cost]] calculator does it in one go, takes mpg (US or UK), L/100 km or km/L as they come, and can double the distance for a round trip and split the cost between passengers.

## What you need

- **The distance.** A map app gives this; use the route you will really drive, not the straight line.
- **Your fuel economy.** The trip computer on the dashboard is a good source. Better still, fill the tank, note the distance until the next fill-up, and divide. The figure in a brochure is usually a little optimistic.
- **The fuel price**, per litre or per gallon, from a recent receipt or a station sign.
- **How many people will share**, if anyone is chipping in.

## Step by step

The formula depends on how your economy is written. With miles per gallon:

**Fuel used (gallons) = distance (miles) ÷ mpg**

**Cost = fuel used × price per gallon**

With litres per 100 km:

**Fuel used (litres) = distance (km) × L/100 km ÷ 100**

**Cost = fuel used × price per litre**

Two things trip people up. First, mpg is "higher is better", while L/100 km is "lower is better", so the formulas run in opposite directions: you divide by mpg but multiply by L/100 km. Second, a US gallon (about 3.79 L) is smaller than a UK gallon (about 4.55 L), so the same car shows a higher mpg figure in the UK.

With the calculator:

1. In **Your trip**, type the **Distance** and choose km or miles.
2. Type the **Fuel economy** and choose its unit: L/100 km, km/L, mpg (US) or mpg (UK).
3. Type the **Fuel price** and say whether it is per litre, per US gallon or per UK gallon. Mixing units is fine; the page converts everything to litres and kilometres behind the scenes.
4. Tick **Round trip** if you are coming back the same way. It doubles the distance.
5. Set **People sharing the cost**. With more than one, the result line adds a per-person share.
6. The answer appears straight away: a big cost figure, then a line with the total distance in km and the litres needed.

Further down, **Convert fuel economy** changes one economy figure into all four units, handy when you are comparing a hire car's figure with your own.

## A worked example

Three friends drive 240 miles each way to a weekend away and come back the same route. The car does 32 mpg (US), and fuel costs 3.40 per US gallon.

1. Round trip distance: 240 × 2 = 480 miles.
2. Fuel used: 480 ÷ 32 = 15 US gallons.
3. Cost: 15 × 3.40 = **51.00**.
4. Each person: 51.00 ÷ 3 = **17.00**.

The page shows "51.00 fuel cost" and underneath "772 km needs about 56.8 litres. Shared between 3: 17.00 each." That is the same trip in metric: 480 miles is 772 km, and 15 US gallons is 56.8 L.

The same sum in metric units: a couple drive 350 km each way in a car that uses 6.5 L/100 km, with fuel at 1.65 per litre.

1. Round trip: 700 km.
2. Fuel: 700 × 6.5 ÷ 100 = 45.5 L.
3. Cost: 45.5 × 1.65 = **75.08**, or **37.54** each.

If the friends also paid for parking, food and a cabin, the [[trip-splitter]] settles all the shared costs at the end with the fewest payments. For a daily drive to work, the [[commute-cost]] calculator compares the car with transit and cycling over a month or a year.

## Check your answer

- **Cost per mile or km.** In the first example, 51.00 ÷ 480 miles is about 0.11 per mile. Price per gallon divided by mpg gives the same figure (3.40 ÷ 32 = 0.106), so the two routes agree.
- **Tank check.** Most cars hold roughly 40 to 70 litres (about 10 to 18 US gallons). If your answer says a short trip uses several tanks, a unit is probably wrong, such as km typed with miles selected.
- **Gallon type.** If your result looks about 20 % off from what you expected, check you picked the right gallon. The gap between US and UK gallons is roughly that size.

## Questions people ask

**Does the cost include tolls, parking or wear on the car?** No, only fuel. Add those separately, or put the whole trip's costs into a splitter.

**Why is my real fuel use higher than the estimate?** Motorway speed, air conditioning, a roof box, heavy luggage, cold weather and hills all raise consumption. Adding 10 % as a margin is a sensible habit on a long drive.

**How should passengers split the cost fairly?** Equal shares are simplest. Some groups also add a little for the driver's time or the car's wear; agree on it before you set off.
