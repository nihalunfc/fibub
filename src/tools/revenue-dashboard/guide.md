---
name: Revenue dashboard
num: 3092
shelf: money
code: T1073
section: small-business
title: "Revenue dashboard: net revenue by sales channel, sold-out days and the weeks ahead"
summary: "One page for the whole business: net revenue after commission by sales channel, cancellations, sold-out days with the demand turned away, and a simple outlook for the next 8 weeks."
status: live
ads: false
order: 3092
icon: curve
works: offline
updated: 2026-11-22
related: [kpi-dashboard, demand-forecaster, pricing-recommender, overbooking-calculator, daily-close]
sources:
  - "Net revenue is gross revenue less the commission each channel keeps. Sold-out days are site-days at 97% or more of the places; the value of demand turned away uses your own assumption of how much more would have bought, because the tool cannot see the people who were turned away."
  - "The outlook is a plain average of each weekday over the last 8 weeks, scaled by growth against the same weeks a year earlier (kept within 25%). The example numbers are made up."
flow:
  - { icon: table, label: "Sales rows" }
  - { icon: sliders, label: "Commission" }
  - { icon: curve, label: "Dashboard" }
  - { icon: check, label: "Act" }
---

## What it does

A sale is not worth the same through every door. A booking site may keep 15% to 25%, a delivery app more, your own website or the phone nothing. This dashboard takes one row per site, channel and day, and shows what each channel really earns after its commission, how many bookings later cancel, which days you sold out, and what the next eight weeks may look like. It is meant for owners and managers who run one site or several, and it works for hotels, restaurants, clinics, tour operators, shops and any business with a limited number of places to sell each day.

The page opens on a made-up example so you can see how it works; the presets change the wording and the example channels. Then paste or open your own rows, enter how many places each site has and the commission each channel charges, and read the results. For the headline numbers by period and a budget, use the [[kpi-dashboard]]; for a day-by-day forecast, the [[demand-forecaster]]; and when you are turning people away on sold-out days, look at the [[pricing-recommender]] and the [[overbooking-calculator]].

## How to use it

1. **Step 1:** paste or open your rows: date, site, channel, number sold, revenue and (optional) number cancelled.
2. **Step 2:** choose the period and site, type the places each site has per day and each channel's commission percent, and your assumption for extra demand on sold-out days.
3. **Read the cards, the channel table, the sold-out days and the outlook.** Download the channel table or the weekly outlook as a CSV.

## What each setting does

- **Places a day**: used for use of capacity and to find sold-out days. It starts at the most you ever sold in a day.
- **Commission, %**: the share of each sale a channel keeps. Net revenue is gross revenue times one minus this.
- **Extra demand on sold-out days, %**: how much more you think a sold-out day could have sold. It is your assumption; 10% is cautious.
- **Remember my settings**: off by default. When ticked, only settings stay in this browser; your sales file is never kept.

## Worked example

A site sold 1,000 rooms for 150,000 last quarter: 600 through its own website at 150 each (90,000), and 400 through a booking site at 150 each (60,000) that keeps 18%. The booking site keeps 10,800, so net revenue is 90,000 + 49,200 = 139,200, and the net per sale on that channel is 123.00 against 150.00 on your own site. If 12 days were sold out and you think 10% more would have bought at 150, that is about 120 extra rooms, worth roughly 18,000.

## FAQs

**What counts as sold out?** A site-day at 97% or more of the places you entered.

**How accurate is the outlook?** It is a plain average, not a forecast of events or price changes. For a daily forecast with a range and an accuracy score, use the demand forecaster.

**Do I need cancellation numbers?** No. If the column is missing, cancellations show as 0%.

**Is my file uploaded?** No. It is read on your device and nothing is sent anywhere.

**What if a channel has a fixed fee instead of a percent?** Work out the average percent of its sales and enter that.
