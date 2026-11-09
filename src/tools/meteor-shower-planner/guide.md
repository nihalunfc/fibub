---
name: Meteor shower planner
num: 50
shelf: science
section: observing
title: "Meteor shower planner: how many meteors an hour you'll see, and when"
summary: "Pick a shower such as the Perseids or Geminids and see how many meteors an hour to expect from your place and sky, hour by hour, where the Moon will be, and how much moonless dark time each night around the peak has."
status: live
ads: true
order: 70
icon: star
works: offline
updated: 2026-11-08
related: [sky-events-calendar, dark-sky-calendar, sky-tonight, observing-log, light-pollution-calculator, object-altitude, star-trail-exposure, observing-session]
sources:
  - "Sun, Moon and planet positions: astronomy-engine by Don Cross (MIT licence), accurate to about an arcminute."
  - "City coordinates and time zones: public geographic facts, typed by fibub."
  - "Meteor shower dates, rates and radiants: typical values from the International Meteor Organization's shower calendar, rounded."
  - "Rate formula: the standard IMO correction for radiant altitude and limiting magnitude."
flow:
  - { icon: pointer, label: "Your place" }
  - { icon: star, label: "Shower" }
  - { icon: clock, label: "Best hours" }
---

## What it does

A shower's headline number, its zenithal hourly rate (ZHR), is what one observer would see under a perfect sky with the radiant straight overhead. Real nights are never that kind. This planner corrects the ZHR for your place and your sky, hour by hour through the night, so you know when to go out and what to expect. It also shows where the Moon is, the moonless dark hours on the nights either side of the peak, and lists every major shower of the coming year with its best rate from where you are.

Check the Moon and darkness across the year with the [[dark-sky-calendar]], and note what you saw in the [[observing-log]].

## How to use it

1. Set **your place** at the top. It is shared with the other astronomy tools.
2. Pick a **shower**. The planner starts on the next one to come.
3. Choose **your sky**: the faintest stars you can see overhead. A dark country sky shows stars to about magnitude 6.5, suburbs about 5, a city about 3.
4. Read the result: the best time and rate, a chart through the night, an hour-by-hour table with the radiant's height and the Moon, and the moonless dark hours on the five nights around the peak.

## How it works

For each half hour from sunset to sunrise, the planner finds the radiant's altitude h and uses the International Meteor Organization's formula: HR = ZHR × sin(h) / r^(6.5 − LM), where LM is your limiting magnitude and r the shower's population index, which says how many more faint meteors there are than bright ones. Rates count only once the Sun is 12° below the horizon. Peak dates, ZHRs and population indices are typical values from the IMO's calendar; the exact peak moves by up to a day from year to year.

## Worked example

The Perseids have a ZHR of about 100 and a population index of 2.2. With the radiant 60° up under a rural sky (limiting magnitude 6.0), the rate is 100 × sin 60° / 2.2^0.5 ≈ 58 meteors an hour. From a suburb (5.0) the same hour gives about 27, and from a city (3.0) about 5. That is why getting away from lights matters more than anything else. The radiant climbs all night, so the best hours are usually just before dawn.

## Frequently asked questions

**Does it count the Moon?** It shows whether the Moon is up and how much of it is lit, but the rates assume a moonless sky. A bright Moon can easily halve what you see; plan for the hours after moonset.

**Why can I see meteors before the radiant rises?** A few "earthgrazers" skim the atmosphere when the radiant is near the horizon. They are rare but long and spectacular.

**Is my location sent anywhere?** No. Everything is worked out in your browser and works offline.
