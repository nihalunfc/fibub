---
name: Jet lag planner
num: 2052
shelf: everyday
code: T935
section: reminders-travel
title: "Jet lag planner: shift your sleep before and after a flight"
summary: "Pick where you fly from and to, the date and your usual sleep: get a day-by-day plan for 3 days before and after, with bedtimes, when to seek and avoid bright light and a caffeine cut-off."
status: live
ads: false
order: 2052
icon: moon
works: offline
updated: 2026-11-10
related: [time-zone-planner, sleep-calculator, date-calculator]
sources:
  - "Eastman C.I., Burgess H.J. (2009), How to travel the world without jet lag, Sleep Medicine Clinics 4(2): moving sleep about 1 hour a day before the trip, with timed bright light (checked 2026-11-10)."
  - "CDC Yellow Book, Jet lag chapter: flying east is usually harder; morning light helps after flying east, evening light after flying west (checked 2026-11-10)."
  - "Drake C. et al. (2013), Caffeine effects on sleep taken 0, 3, or 6 hours before going to bed, J Clin Sleep Med 9(11): the reason for the 6-hour default, editable."
  - "Time zone offsets come from your browser's own time zone database (IANA). The plan's light windows are fibub's own simplification."
flow:
  - { icon: compass, label: "Zones" }
  - { icon: moon, label: "Shift sleep" }
  - { icon: eye, label: "Light" }
  - { icon: check, label: "Plan" }
---

## What it does

Jet lag happens because your body clock stays on home time after you land. The body clock can only move about an hour a day, so this page spreads the change out: 3 days before you fly, your bedtime and wake-up time move by 1 hour a day, then the rest of the change happens in the first days after you land. Flying east moves your nights earlier; flying west moves them later.

Light is the body clock's strongest signal, so each day says when to get bright light (daylight or a bright lamp) and when to keep it dim, plus a time for your last coffee or tea. The hour difference is for your flight date, daylight saving included; over 12 hours, it shifts the shorter way round. To size up the bedtimes themselves, use the [[sleep-calculator]]; to count days to the trip, try [[date-calculator]].

## How to use it

1. Pick the time zones you fly from and to, such as America/Toronto and Europe/London.
2. Pick the flight date and your usual bedtime and wake-up time.
3. Follow the table: the three days before use home time, the days after use destination time.

## What each setting does

- **Shift per day**: how far sleep moves each day, 30 to 120 minutes. One hour is the usual advice.
- **No caffeine for**: hours before bed with no coffee, tea, cola or energy drinks. 6 hours is the default.
- **Swap directions**: plans the trip home.

## Worked example

Toronto to London on 20 November 2026: London is 5 hours ahead. With a usual 23:00 to 07:00, bedtimes before the flight are 22:00, 21:00 and 20:00 Toronto time. Three days before, get bright light from 06:00 to 09:00, keep lights dim from 19:00 to 22:00 and have the last caffeine by 16:00. In London, day 1 bed is 00:00 and day 2 is back to 23:00. Flying home the other way, bedtimes move later instead: 00:00, 01:00 and 02:00 London time.

## FAQs

**What if both places use the same time?** The page says no plan is needed.

**Why avoid light at some times?** Light just after your body's low point moves the clock earlier; light before it moves it later. Light at the wrong time pushes the wrong way.

**Can I take melatonin?** Ask a doctor or pharmacist. This page gives no doses.
