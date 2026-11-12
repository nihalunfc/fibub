---
name: E-way bill validity
num: 1802
shelf: vehicles
code: T891
countries: [india]
section: trucking
title: "E-way bill validity calculator: days by distance, expiry and extension"
summary: "Work out how many days an e-way bill is valid for a distance (1 day per 200 km, or per 20 km for over-dimensional cargo), the exact expiry, when you can extend it, and whether you need one."
status: live
ads: true
order: 1802
icon: calendar
works: offline
updated: 2026-11-10
related: [trip-sheet, vehicle-routing, unit-converter]
sources:
  - "Validity: Rule 138(10) of the CGST Rules, 2017, as amended from 1 January 2021: 1 day for every 200 km or part (normal cargo), 1 day for every 20 km or part (over-dimensional cargo); a day ends at midnight of the day after the vehicle details are entered; extension within 8 hours before or after expiry. E-way bill portal FAQ, docs.ewaybillgst.gov.in. Checked 2026-11-10, check the official source."
  - "Value limit: an e-way bill is needed for goods worth over 50,000 rupees (Rule 138(1)); states set their own limits for movement within the state. CBIC e-way bill FAQ and the portal FAQ. Checked 2026-11-10."
flow:
  - { icon: ruler, label: "Distance" }
  - { icon: calendar, label: "Days" }
  - { icon: clock, label: "Expiry" }
---

## What it does

An e-way bill lets goods move by road under India's GST. It is valid for a set number of days that depends on the distance: one day for every 200 km or part of 200 km, and for over-dimensional cargo one day for every 20 km or part. Type the distance and the date the vehicle details (Part B) were first entered, and you see the number of days, the exact moment it expires and the window in which the transporter can extend it.

It also tells you whether a consignment of that value needs a bill at all. To plan the stops on a long run use [[vehicle-routing]], and to record the trip's freight, diesel and driver money use [[trip-sheet]].

## How to use it

1. Type the distance from the e-way bill (the portal works it out from the PIN codes, and you can add up to 10% more).
2. Pick normal or over-dimensional cargo.
3. Pick the date Part B was first entered.
4. Type the consignment value and whether the goods cross a state border.

## What each setting does

- **Distance**: the approximate road distance. Every 200 km, or the part of 200 km left over, adds a day.
- **Cargo**: over-dimensional cargo moves slowly, so it gets one day per 20 km.
- **Part B date**: the first day ends at midnight of the next day, so the hours left on the day you start are a bonus.
- **Consignment value and movement**: over 50,000 rupees needs a bill. Many states set a higher limit for goods that stay inside the state.

## Worked example

A 450 km run of normal cargo needs 3 days (200 + 200 + 50). If Part B is entered at 3 pm on 10 November, day 1 ends at midnight at the end of 11 November and the bill is valid until midnight at the end of 13 November. The transporter can extend it from 4 pm on 13 November to 8 am on 14 November. A 45 km move of over-dimensional cargo is also 3 days (20 + 20 + 5).

## FAQs

**What if the truck breaks down?** Extend the bill on the portal within the window, giving the reason and the place, or update the vehicle number if the goods move to another truck.

**Does a holiday add a day?** No. The days run back to back.

Not legal advice; check the official source.
