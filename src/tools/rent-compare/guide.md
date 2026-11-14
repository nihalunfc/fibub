---
name: Rent compare
num: 2127
shelf: money
code: T953
section: renting
title: "Rental cost comparison: compare apartments by rent, bills and commute"
seoTitle: "Compare rental apartments: rent + bills + commute cost"
seoDescription: "Compare rentals side by side: rent, hydro, heat, internet, parking and the commute from each. Distance and travel time to work or the bus stop. Free."
summary: "Compare rental homes by what they really cost each month: rent, every bill, and the drive or bus to work, school or the stop, with distance and time from each home."
status: live
ads: false
order: 2127
icon: wallet
works: offline
updated: 2026-11-14
related: [commute-cost, budget-calculator, fuel-cost, rent-vs-buy, electricity-cost]
sources:
  - "Distances are straight lines between two points (haversine formula, Earth radius 6,371 km) times a road factor you choose (1.3 by default; roads are rarely straight). Times use typical door-to-door speeds: car 35 km/h plus 5 minutes, bus or train 20 km/h plus 10 minutes, bike 15 km/h, walking 4.8 km/h. Your own km and minutes replace them."
  - "Canadian postal code areas: the first three characters (forward sortation area) and their centre point, from GeoNames postal code data (geonames.org, CC BY 4.0), checked 2026-11-14. Full six-character postal code locations belong to Canada Post and are not included."
  - "Gas price, fare and car figures are example values only; type your own. Check your transit agency for fares and passes."
flow:
  - { icon: pencil, label: "Homes" }
  - { icon: compass, label: "Places" }
  - { icon: coin, label: "Costs" }
  - { icon: check, label: "Best home" }
---

## What it does

A cheaper rent is not always the cheaper home. This page adds up what each rental you are looking at would really cost you each month: the rent, every bill the landlord does not cover (hydro, heat, water, internet, a parking spot, tenant insurance), and the money and hours spent getting from that home to the places you go every week. It then ranks the homes from cheapest to dearest and shows how far each one is from work, school, daycare or the nearest bus stop.

It is built for renters in Ontario and the rest of Canada first. You type everything yourself, so it works for any listing site, and nothing you type is sent anywhere. Once you have picked a place, [[budget-calculator|plan the rest of your month]], check a single drive in [[commute-cost]], or weigh renting against buying with [[rent-vs-buy]].

## How to compare rental homes

1. Type a short name for each home (up to 6), its rent, and each monthly bill you would pay on top. Put 0 for anything the rent includes.
2. Give each home a location: a postal code, or for an exact spot, coordinates or a link from your map app.
3. Add the places you go: work, school, the gym, a bus stop or GO station. Pick how you get there and how many round trips you make a week.
4. Check the travel costs: gas price, your car's fuel use, the fare and any monthly pass.
5. Read the ranking. If your map app gives the real distance or minutes for a trip, type them into the distance table and they replace the estimate.

## What each setting does

- **Location**: a Canadian postal code finds the centre of its area (the first three characters, roughly 1 to 3 km across in towns, much bigger in the countryside). Coordinates such as `43.6532, -79.3832`, or a Google Maps, Apple Maps or OpenStreetMap link, give the exact spot.
- **Round trips a week**: there and back counts as one. Use 0 for a stop you only want the distance to.
- **Parking per visit**: what you pay each time you drive there, such as a downtown lot.
- **Car wear per km**: tyres, oil and repairs on top of gas. 0.05 to 0.15 a km is common.
- **Monthly pass**: bus or train fares stop counting once they pass this amount.
- **Value of an hour of your time**: 0 compares money only. Put your hourly pay, or less, to let a long commute count against a home.
- **Road distance vs straight line**: straight-line distance is multiplied by this. 1.2 to 1.4 suits most towns; type the real km for trips that matter.

## Worked example

Two homes, both with work in downtown Toronto (M5V) by car 5 days a week and a college in Mississauga (L4W) by bus twice a week, with gas at $1.40 a litre, 8.5 L/100 km, $0.10 wear per km and a $3.30 fare.

- **A. Apartment in Mississauga** (L5B): rent $2,250 plus $225 of bills. Work is about 26 km away by road, so travel costs about $304 a month. Total **$2,779**.
- **B. Basement in Brampton** (L6Y): rent $1,850 plus $255 of bills. Work is about 41 km away, so travel costs about $445. Total **$2,550**.

B is $229 a month cheaper, but it adds about 25 hours of driving a month: you save about $9.22 for each extra hour on the road. Put your time at $15 an hour and A wins.

## FAQs

**Why not use real driving directions?** Directions would mean sending your addresses to a mapping company. This page keeps everything on your device, so it estimates from the straight line; for the trips that matter, type the real km and minutes from your own map app.

**Is the postal code lookup accurate?** It finds the centre of the postal area, not the building. For an exact spot, long-press the place in your map app, copy the coordinates and paste them in.

**Where do I find hydro and heat costs?** Ask the landlord or the current tenant for recent bills, and check the lease: the Ontario Standard Lease says which utilities the tenant pays.

**Does it save my homes?** Only if you tick "Remember these homes on this device". They stay in this browser and the Clear button deletes them.
