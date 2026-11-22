---
name: Pricing recommender
num: 3087
shelf: money
code: T1068
section: small-business
title: "Pricing recommender: a suggested price for each day from bookings and competitors"
summary: "Get a suggested price for each day of a business with limited capacity, from bookings so far, last year's pace, events and competitor prices, with a reason for each."
status: live
ads: false
order: 3087
icon: coin
works: offline
updated: 2026-11-22
related: [demand-forecaster, overbooking-calculator, break-even, percentage-calculator]
sources:
  - "Pick-up forecasting and demand tiers are standard revenue-management ideas; the thresholds, adjustments and price-reaction values are fibub's own starting assumptions that you can change."
  - "The example days, prices and competitors are made up."
flow:
  - { icon: table, label: "Your days" }
  - { icon: chart, label: "Forecast" }
  - { icon: coin, label: "Price" }
  - { icon: check, label: "Plan" }
---

## What it does

If you sell something with a limited number of places, such as hotel rooms, tour seats, class places or appointment slots, the right price changes by the day. A quiet Tuesday and a nearly full Saturday should not cost the same. This tool suggests a price for each day from five things: how many you have booked, how that compares with this point last year, whether there is an event, what your competitors charge and the limits you set.

For each day it forecasts how full you will be (what you have booked now plus what last year picked up from this point, scaled by this year's pace). The forecast places the day in a demand tier, Low, Moderate, High or Compression (nearly sold out). The price then starts from the middle of your competitors' prices, moves with the tier and the booking pace, and is held inside your limits, rounded and kept between your floor and ceiling. Every suggestion comes with a plain reason, and you can untick any you do not want. Work out the number of bookings to take with the [[overbooking-calculator]], see more of the future with the [[demand-forecaster]], and check prices against costs with the [[break-even]] calculator.

## How to use it

1. **Step 1:** choose an example, then set your capacity, the lowest and highest price you will charge, the biggest change in one go and how you want to sit against competitors.
2. **Step 2:** enter one row per day with what you have booked, what you had at this point last year, the final number last year, your current price and up to four competitor prices. Paste or open a table if you have one.
3. **Step 3:** read the plan. Untick "Use it" on any day to keep today's price; the totals follow.
4. **Download** the plan as a CSV.

## What each setting does

- **Biggest change in one go:** stops large jumps. At 15%, a 100 price can only move to between 85 and 115.
- **Aim above or below competitors:** 5 means aim 5% above their middle price.
- **Tier thresholds and price change per tier:** the share of capacity that makes a day Moderate, High or Compression, and how far the price moves in each.
- **Event boost:** extra last-minute demand on event days, and the day moves up a tier.
- **How much demand reacts to price:** an assumption used only in the totals, to guess how many you would lose when you raise a price.
- **Round prices to:** the nearest whole number, 5, 0.50 or a price ending in 9.

## Worked example

You have 100 places. For one day you have 50 booked now against 40 at this point last year, and last year ended at 80. You are 25% ahead of last year's pace, so the tool expects 50 more to book (last year's gain of 40 times 1.25), a forecast of 100 and a Compression day. Three competitors charge 110, 100 and 120, so the middle is 110. The target is 110 x 1.15 x 1.06 = 134.09. Your limit is 15% above today's 100, so the suggestion is 115.

## FAQs

**Is this a guarantee of more income?** No. It follows simple rules and your own assumptions. Look at each day before you change a price.

**What if I have no competitor prices?** The tool then starts from your current price and uses the tier and pace.

**What if I have no last-year data?** Leave those boxes blank. The pace is treated as even and the forecast is just your bookings now.

**Is my data kept?** Only if you tick "Remember my numbers on this device". Nothing is sent anywhere.
