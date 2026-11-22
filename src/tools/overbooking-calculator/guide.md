---
name: No-show and overbooking calculator
num: 3083
shelf: money
code: T1064
section: small-business
title: "No-show and overbooking calculator: how many extra bookings to accept"
summary: "Find how many extra bookings to accept so no-shows and late cancellations do not leave places empty, with the chance and cost of turning someone away and a 14-day plan."
status: live
ads: false
order: 3083
icon: calendar
works: offline
updated: 2026-11-22
related: [demand-forecaster, pricing-recommender, large-order-quote, queueing-calculator]
sources:
  - "The chance model is standard: each booking turns up independently with the same probability, so arrivals follow a binomial law; the best level maximises expected value (value of filled places minus the cost of people turned away)."
  - "The example businesses and numbers are made up. Rules on compensation when you turn someone away differ by industry and place; check the official source."
flow:
  - { icon: pencil, label: "Numbers" }
  - { icon: coin, label: "Costs" }
  - { icon: target, label: "Risk" }
  - { icon: calendar, label: "14 days" }
---

## What it does

Every business that takes bookings loses money when people cancel late or just do not turn up. The table stays empty, the room goes unsold, the appointment slot is wasted. Overbooking means accepting a few more bookings than you have places, so those gaps get filled. The risk is the opposite problem: everyone arrives and you have to turn someone away.

This calculator finds the number of extra bookings that gives the best average result. It uses the share of bookings that cancel, the share that do not show up, what a filled place is worth to you and what it costs when you have to turn someone away. It works for hotels, restaurants, clinics, tour operators, salons and anything else with a fixed number of places. When you have the answer, check what you will charge with the [[pricing-recommender]], and see how busy you should expect to be with the [[demand-forecaster]] or the [[large-order-quote]].

## How to use it

1. **Pick an example** that looks like your business (hotel rooms, restaurant tables, clinic appointments or tour seats), or just type over the numbers.
2. **Step 1, the day's numbers:** how many places you can sell, how many bookings you have now, your cancel rate and no-show rate, and what one booking is worth.
3. **Step 2, the cost of turning someone away:** list every cost, such as a refund, a free dessert, a voucher, or the future business you may lose. Add a line for each.
4. **Step 3, your appetite for risk:** either cap the chance of turning anyone away, or ask for the best average result whatever the risk.
5. **Read the recommendation.** It gives the booking limit, how many more you can sell, the expected gain and the chance of a problem. The table shows every level so you can see why.
6. **Step 4, the next 14 days:** enter places and bookings for each day, or paste a table, and download the plan as a CSV.

## What each setting does

- **Cancel before the day, %:** the share of bookings that are cancelled between now and the day. Use your own history for the same weekday and season.
- **No-show on the day, %:** the share of the remaining bookings that never arrive.
- **Price, extra spend, cost of serving:** a filled place is worth the price plus extras minus the cost to serve it. This is what you gain from filling an empty place.
- **Cap the chance of turning anyone away:** the best average result sometimes means a problem now and then. A cap keeps that rare, and the tool picks the best level inside it.
- **Cancel and no-show boxes in the 14-day table:** leave blank to use step 1, or type a different rate for a day, such as a Saturday when people rarely no-show.

## Worked example

A restaurant has 40 tables. In its history 8% of bookings cancel and 7% of the rest do not show, so 85.6% of bookings turn up. A filled table is worth 35 (a 90 spend less a 55 food and labour cost). Turning a party away costs 65 (15 of free drinks, a 20 voucher and 30 for the future business at risk). With the risk capped at 15%, the tool recommends accepting 4 extra bookings, a limit of 44. That gives a 10.4% chance of turning anyone away, about 0.15 parties turned away a night, and an expected gain of about 105 a night compared with no overbooking. With no cap the best level would be 5 extra, a gain of about 116, but a 20.2% chance of a problem.

## FAQs

**Is overbooking legal?** Rules differ by industry and place. Airlines, hotels and package tours often have consumer rules about compensation when you turn someone away. Check the official rules that apply to you before you rely on any result.

**Why does the tool sometimes say 0 extra?** If turning someone away costs a lot more than a filled place earns, or almost everyone turns up, each extra booking is more likely to cause a problem than fill a gap.

**What if a big group cancels together?** The tool treats each booking on its own. A single large booking that can cancel all at once is not covered, so keep a buffer for those.

**Does it keep my numbers?** Only if you tick "Remember my numbers on this device". Nothing is ever sent anywhere.
