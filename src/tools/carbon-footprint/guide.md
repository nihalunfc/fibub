---
name: Carbon footprint calculator
num: 505
shelf: science
section: carbon-and-energy-accounting
title: "Carbon footprint calculator: household and personal CO₂e from energy, travel, flights, food and goods, with your own factors"
summary: "Add up a household's yearly carbon footprint from electricity, heating fuel, car and transit, flights (great-circle distance from coordinates), food and goods. Every emission factor is yours to set; the defaults are rounded examples to replace with your country's official factors. See the breakdown, compare scenarios, and download CSV, PDF or Word."
status: live
ads: true
order: 505
icon: chart
works: offline
updated: 2026-11-09
related: [lca-compare, tree-carbon, budget-calculator]
sources:
  - "Footprint arithmetic (amount × emission factor, summed by category) written by fibub. No agency's factor table is included: the default factors are rounded example values chosen to show the sums, labelled on the page as examples to replace."
  - "Flight distances by Vincenty, T. (1975) Direct and inverse solutions of geodesics on the ellipsoid with application of nested equations. Survey Review 23(176), 88–93, on the WGS84 ellipsoid; checked against GeographicLib (Karney 2013) and pyproj."
  - "The example flight uses rounded public coordinates of two airports."
flow:
  - { icon: table, label: "Amounts" }
  - { icon: sliders, label: "Factors" }
  - { icon: chart, label: "Breakdown" }
  - { icon: target, label: "Compare" }
---

## What it does

A **carbon footprint** adds up the greenhouse gases caused by what a household uses in a year, written as kilograms or tonnes of **CO₂e** (carbon dioxide equivalent). Each line is simply

**amount × emission factor = kg CO₂e**

for example 4,000 kWh of electricity × 0.4 kg CO₂e per kWh = 1,600 kg. The hard part is the factor, which depends on your country, your supplier and the year. So this page does the arithmetic and leaves every factor to you:

- **Home energy**: electricity, gas, oil, wood or anything else, each as an amount and a factor.
- **Car and transit**: distance driven or travelled × a factor per km.
- **Flights**: the shortest distance over the Earth between two points you type as latitude, longitude (or a distance you type), × trips, × an optional extra percentage for real routes, × a factor per passenger-km.
- **Food**: per person, days × kg CO₂e per day for each part of the diet, multiplied by the people in the household.
- **Goods and services**: money spent × kg CO₂e per unit of currency (a spend-based estimate).
- **Breakdown** as a bar chart and table, **scenarios** to compare side by side, and downloads (CSV of every line, and an image, PDF or Word report).

**The default factors are example values. Replace them with your country's official factors.** They are rounded numbers to make the example work and are not data for any country.

## How to use it

1. Set the number of people in the household.
2. In each category, type the yearly amount and the factor from an official source. Add or remove lines as needed; you can rename items and units.
3. Add each flight with both ends' coordinates (or a distance), the number of one-way trips and whether it was a return trip.
4. Read the total and the per-person figure. The table shows each category's share.
5. Press **Keep as a scenario**, change something (fewer car km, a heat pump, a green tariff factor), and keep it again to compare.
6. Tick **Remember my numbers** if you want them here next time. It is off by default, the numbers stay in this browser on this device, and *Delete saved numbers* removes them.

## Worked example

The example household has 2 people:

- Home energy: 4,000 kWh × 0.4 + 12,000 kWh × 0.2 = **4,000 kg**.
- Car and transit: 12,000 km × 0.17 + 1,500 km × 0.05 = **2,115 kg**.
- Flights: Toronto (43.68, −79.63) to Vancouver (49.19, −123.18) is 3,354 km over the ellipsoid; there and back is 2 flights × 3,354 km × 0.15 = **1,006 kg**.
- Food: (2 + 1 + 1.5) kg per day × 365 days × 2 people = **3,285 kg**.
- Goods and services: 1,500 × 0.4 + 2,000 × 0.3 + 5,000 × 0.1 = **1,700 kg**.

The total is **12.11 t CO₂e a year**, or **6.05 t per person**. Change the electricity factor to 0.05 (a low-carbon supply) and keep it as a scenario: home energy falls to 2,600 kg and the total to 10.71 t, 12 % lower.

## Tips

- Use factors from the same source and year where you can, and note which scope they cover (some electricity factors include grid losses or upstream emissions, some do not).
- Flight factors vary between methods by a factor of two or more, mainly in whether effects of flying other than CO₂ are included. Say which you used.
- Spend-based factors are rough; they are best for seeing which categories matter, not for small changes.

## FAQ

**Why no built-in factors?** Factors are set by national agencies, change every year, and differ between countries. Putting one country's table in would give wrong answers everywhere else, so you type the ones that apply to you.

**How is the flight distance found?** With Vincenty's method on the WGS84 ellipsoid, which agrees with GeographicLib to well under a millimetre. Very nearly opposite points on the globe fall back to a sphere.

**Is anything sent anywhere?** No. Everything is worked out in your browser. If you tick *Remember my numbers*, they are kept in this browser's storage on your device only.
