---
name: Driving hours
num: 1813
shelf: vehicles
code: T902
countries: [usa, canada]
section: trucking
title: "Hours of service calculator: truck driving hours left, US and Canada"
summary: "Type today's duty log and the hours used in your cycle to see how long you can still drive under US FMCSA or Canadian federal hours-of-service rules, when your 30-minute break is due and when your window closes."
status: live
ads: true
order: 1813
icon: clock
works: offline
updated: 2026-11-10
related: [fuel-cost, vehicle-routing, timesheet]
sources:
  - "US: FMCSA Summary of Hours of Service Regulations, property-carrying (11 h driving after 10 h off, 14 h window, 30-min break after 8 h driving, 60/70 h in 7/8 days, 34 h restart), https://www.fmcsa.dot.gov/regulations/hours-service/summary-hours-service-regulations, checked 2026-11-10."
  - "Canada: Commercial Vehicle Drivers Hours of Service Regulations, SOR/2005-313, ss. 12-16 and 24-28 (13 h driving, 14 h on duty, 16 h elapsed after 8 h off, 10 h off a day, cycle 1 70 h/7 days, cycle 2 120 h/14 days with 70 h before 24 h off, 36/72 h reset), https://laws-lois.justice.gc.ca/eng/regulations/SOR-2005-313/fulltext.html, checked 2026-11-10."
  - "Not an ELD. Split sleeper berth, adverse conditions, short-haul and other exemptions are left out. Check the official source. Drawings are fibub's own."
flow:
  - { icon: pencil, label: "Log" }
  - { icon: clock, label: "Clocks" }
  - { icon: flag, label: "Break" }
  - { icon: check, label: "Plan" }
---

## What it does

Truck drivers work to several clocks at once: a limit on driving, a window that runs from when you come on duty, a break rule and a weekly cycle. Type the changes in your duty status today and the hours you have already used in your cycle, and this tool shows how much time is left on each clock, which one runs out first, and when you must stop driving.

It follows the US federal rules for property-carrying drivers (FMCSA) or the Canadian federal rules for drivers south of latitude 60°. It is a planning aid, not an electronic logging device (ELD) and not legal advice. To plan the trip itself use [[vehicle-routing]], and [[fuel-cost]] prices the fuel for the miles you can still drive.

## How to use it

1. Pick the rules and your cycle.
2. Type the on-duty hours you already used in the cycle before today.
3. Add a row each time your status changed today (off duty, sleeper berth, driving, on duty not driving) with the time it started.
4. Set the time now, or press **Use the time now**, and read the clocks.

## What each setting does

- **Rules**: US federal property-carrying, or Canada federal south of 60°. State and provincial rules for trips inside one state or province can differ.
- **Cycle**: US 70 hours in 8 days or 60 in 7. Canada cycle 1 (70 hours in 7 days) or cycle 2 (120 hours in 14 days, and no more than 70 before 24 hours off).
- **Hours already used**: on-duty time (driving counts) from the earlier days of the cycle.
- **Log rows**: each row lasts until the next one. A rest of 10 hours (US) or 8 hours (Canada) in the log starts a new shift.

## Worked example

US rules. Off duty until 06:00, then driving with no stop. At 14:00 you have driven 8 hours, so the 30-minute break is due now. The 11-hour limit leaves 3 hours of driving, and the 14-hour window ends at 20:00. Under Canadian rules the same day leaves 5 hours: the 13-hour driving limit is the first to run out.

## FAQs

**Does an on-duty stop count as the 30-minute break?** Yes, in the US any 30 minutes in a row not driving counts: on duty, off duty, sleeper berth or a mix.

**Does a break pause the 14-hour window?** No. Off-duty time inside the window does not stop it.

**How do I reset my cycle?** US: 34 hours in a row off duty. Canada: 36 hours off for cycle 1, 72 hours for cycle 2.

**Is this a legal record?** No. Keep your ELD or paper log; this only helps you plan.
