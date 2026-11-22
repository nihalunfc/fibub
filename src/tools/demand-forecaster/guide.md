---
name: Demand forecaster
num: 3088
shelf: money
code: T1069
section: small-business
title: "Demand forecaster: a daily forecast of what you will sell from your own history"
summary: "Forecast daily sales or bookings for the next 30 to 90 days from your own history, with a range, an accuracy score, holidays and bookings already on the books."
status: live
ads: false
order: 3088
icon: curve
works: offline
updated: 2026-11-22
related: [pricing-recommender, overbooking-calculator, labour-productivity, trend-analyser]
sources:
  - "Method: a weekday pattern, a smoothed level or last year's season with a growth trend (Holt damped trend), special days, and a range from rolling back-tests of your own history. fibub's own implementation of standard methods."
  - "Holidays: Ontario Employment Standards, US federal holidays and UK bank holidays as widely published, checked 2026-11-22; check the official source for your area. The example history is made up."
flow:
  - { icon: table, label: "History" }
  - { icon: sliders, label: "Settings" }
  - { icon: curve, label: "Forecast" }
  - { icon: check, label: "Accuracy" }
---

## What it does

Knowing how much you will sell next week, next month or next quarter decides how many people to roster, how much stock to order and what to charge. This forecaster learns from your own daily history. Paste or open a table with a date and the number sold each day, and it gives a daily forecast for the next 30, 60 or 90 days, with a range, an accuracy score and a monthly summary.

It works for any business with daily sales or bookings: a hotel, a restaurant, a clinic, a tour operator or a shop. The method looks at three things. The weekday pattern shows that Saturdays may be 130% of an average day and Tuesdays 78%. The season comes from the same time last year when you have at least 14 months of history. Special days, such as the evening before a holiday, are found in your data and given their own lift. It then checks itself by pretending it was eight weeks ago and seeing how close it would have been, so the range is based on your own past. Use the forecast to plan staff with the [[labour-productivity]] tool, set prices with the [[pricing-recommender]], and decide how many bookings to take with the [[overbooking-calculator]].

## How to use it

1. **Step 1:** use the example, or paste or open your history. You need at least 60 days; two years is best. The columns are the date, the number sold, and optionally your capacity and the sales value.
2. **Step 2:** set your capacity going forward, how far ahead to look and which holidays to treat as special. Add your own special dates, such as festivals or local events.
3. **Read the forecast,** the chart with its 80% range, and the accuracy score.
4. **Add bookings you already have** for any day in the day-by-day table to blend them into the forecast.
5. **Download** the forecast as a CSV.

## What each setting does

- **Places you can sell a day:** the forecast never goes above this.
- **Share already booked 30 days out:** how much of a typical day you have already sold a month ahead. It is used only to blend in the bookings you type in.
- **Holidays:** Canada (Ontario), the United States or the United Kingdom publish the usual public holidays. You can also type your own dates.
- **80% range:** about eight in ten days should land inside it. It widens further ahead.

## Worked example

A seaside cafe has two years of daily sales. The forecaster finds Saturdays at about 130% of an average day, Tuesdays at about 78%, and busy summers near twice the winter. It forecasts the next 60 days at, say, 3,900 sales, 6% above the same days last year. On the last eight weeks it would have been off by about 6% on a typical day, with the real number inside the range on about 8 days in 10. That tells you to trust the month totals more than any single day.

## FAQs

**How much history do I need?** At least 60 days; 14 months or more lets it use last year's seasons.

**Why is the range so wide for later weeks?** Forecasts are less certain further ahead, and the range is measured from how wrong the method was on your own past.

**Can it know about a new competitor or a one-off event?** No. Add one-off events as special dates, and treat the forecast as a starting point.

**Is my file uploaded?** No. It is read in your browser and never leaves the device. A large file is not saved even if you ask to remember your settings.
