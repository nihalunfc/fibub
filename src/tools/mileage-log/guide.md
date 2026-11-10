---
name: Mileage log
num: 1784
shelf: money
code: T818
section: pay
title: "Mileage log: track business trips and work out your mileage allowance"
summary: "Log trips by date, place, purpose and distance, see business and personal totals, work out the allowance at the Canada, US or UK rate, and download a CSV."
status: live
ads: false
order: 1784
icon: calculator
works: offline
updated: 2026-11-10
related: [rideshare-earnings, fuel-cost]
sources:
  - "Canada: 73 cents per km for the first 5,000 km and 67 cents after in the provinces, 4 cents more in the territories, the 2026 maximum tax-free allowance rates (Department of Finance Canada, canada.ca, January 2026). The CRA's own travel rate in Ontario is 62.5 cents per km from April 2026 (canada.ca). Checked 2026-11-10."
  - "United States: 72.5 cents per mile for business use in 2026; 20.5 cents medical or moving; 14 cents charity (IRS Notice 2026-10, irs.gov). Checked 2026-11-10."
  - "United Kingdom: HMRC approved mileage allowance for cars and vans is 55p a mile for the first 10,000 miles and 25p after in 2026 to 2027, up from 45p; motorbike 24p; bicycle 20p (gov.uk, checked 2026-11-10). India: no rate is built in, type your own. Rates change each year, so check the official source."
flow:
  - { icon: calendar, label: "Trips" }
  - { icon: ruler, label: "Distance" }
  - { icon: coin, label: "Rate" }
  - { icon: download, label: "CSV" }
---

## What it does

Tax offices want a record of business driving: the date, where you went, why and how far. This page is that record. Add each trip, mark it business or personal, and it keeps the totals and works out the allowance at the rate for your country. You can download the whole list as a CSV file for your accountant or a spreadsheet.

It is useful for employees paid a per-km allowance, self-employed people who track their business share, and drivers working out their costs. See [[rideshare-earnings]] for net pay as a driver and [[fuel-cost]] for what a journey uses in fuel.

## How to use it

1. Pick your country. The rates are filled in, and you can overwrite them.
2. Add each trip with its distance and type.
3. Read the totals, then download the CSV. Tick "Keep my trips" only if you want them saved on this device.

## What each setting does

- **Rate for the first band / after that**: many countries pay less after a set distance (5,000 km in Canada, 10,000 miles in the UK). Set the band to 0 for a single rate.
- **Distance unit**: kilometres for Canada and India, miles for the US and UK.
- **Keep my trips**: off by default. When on, the trips stay in this browser only, and Clear all trips removes them.

## Worked example

In Canada, a 100 km business trip at 0.73 gives an allowance of 73.00. Add a 50 km personal trip and the business share is 66.7%. Switching to the US shows 100 miles at 72.5 cents, which is 72.50.

## FAQs

**Which method should I use?** Allowance rates suit employees paid per km and some US filers. In Canada, self-employed people usually claim real costs by business share instead. Ask your tax office.

**Do I commute trips count?** Usually not; travel from home to your regular workplace is personal.

**Is my data sent anywhere?** No, it stays on this page. Not tax advice.
