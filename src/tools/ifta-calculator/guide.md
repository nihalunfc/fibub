---
name: IFTA
num: 1814
shelf: money
code: T903
section: trucking
title: "IFTA calculator: quarterly fuel tax by state and province"
seoTitle: "IFTA fuel tax calculator by jurisdiction"
summary: "Work out your IFTA quarterly fuel tax: fleet MPG or km/L, taxable fuel in each state or province, tax owed or credit, and the net for the quarter, from rates you type off the IFTA table."
status: live
ads: true
order: 1814
icon: table
works: offline
updated: 2026-11-10
related: [fuel-cost, mileage-log, unit-converter]
sources:
  - "Method: average fuel consumption to two decimal places and jurisdiction columns to whole units, IFTA Procedures Manual (January 2026), https://www.iftach.org/manuals/2026/PM/Procedures%20Manual%20-%2001-01-26.pdf, checked 2026-11-10. Taxable fuel = jurisdiction distance / fleet average; net = taxable - tax-paid purchases; tax = net x rate."
  - "Rates: typed by you from the IFTA tax rate matrix, https://www.iftach.org/taxmatrix4/Taxmatrix.php, checked 2026-11-10. No rates are built in. Check the official source and your base jurisdiction's return."
flow:
  - { icon: ruler, label: "Distance" }
  - { icon: flask, label: "Fuel" }
  - { icon: percent, label: "Rates" }
  - { icon: coin, label: "Net tax" }
---

## What it does

Under the International Fuel Tax Agreement (IFTA), a carrier that runs qualified motor vehicles across US states and Canadian provinces files one fuel tax return a quarter with its base jurisdiction. Fuel tax is owed where the fuel is burned, not where it is bought, so each jurisdiction's share is worked out from the distance you drove there.

This calculator takes your fleet totals and, for each jurisdiction, the distance driven, the tax-paid fuel bought and the rate. It gives the fleet average, the taxable fuel, the net fuel and the tax owed or credited in each place, and the net for the quarter. Keep your trip distances in [[mileage-log]], and use [[unit-converter]] if your receipts mix litres and gallons.

## How to use it

1. Type the quarter and pick miles and US gallons or kilometres and litres.
2. Type the fleet's total distance in every jurisdiction and the total fuel it used.
3. Add a row for each jurisdiction: distance there, tax-paid fuel bought there, and the rate for the quarter from the IFTA tax rate matrix.
4. Read the table and the net.

## What each setting does

- **Total fleet distance and fuel**: all qualified vehicles, all jurisdictions, taxable or not. They give the fleet average.
- **Distance**: miles or km driven in that jurisdiction.
- **Fuel bought**: tax-paid fuel bought there (keep the receipts).
- **Rate**: tax per gallon or litre for that fuel type and quarter. Add a surcharge to the rate or as its own row with no fuel.

## Worked example

The fleet drove 10,000 miles on 1,600 gallons, an average of 6.25 mpg. In State A it drove 4,000 miles, so it burned 4,000 ÷ 6.25 = 640 taxable gallons there. It bought 500 gallons there, leaving 140 net gallons. At 0.30 a gallon it owes 42.00. In State B it drove 6,000 miles (960 taxable gallons) and bought 1,100, so it has 140 gallons of credit at 0.25, worth 35.00. The net for the quarter is 7.00 owed.

## FAQs

**Why is a credit possible?** You paid tax at the pump on more fuel than you burned there. The credit offsets tax owed elsewhere.

**Do I need to round?** IFTA asks for the average to two decimals and the jurisdiction columns in whole units; this tool does the same, but follow your base jurisdiction's form.

**Are interest and penalties included?** No. Late returns carry interest and a penalty of the greater of 50 or 10% of the tax.

Not tax advice.
