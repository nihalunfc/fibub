---
name: Dark-sky calendar
num: 45
shelf: science
code: T45
section: observing
title: "Dark-sky calendar: Moon-free dark hours for every night of the year"
summary: "See a whole year of nights at once: twilight, true darkness and moonlight for your place, the Moon-free dark hours in each month, and the best nights for deep-sky observing and imaging."
status: live
ads: true
order: 60
icon: moon
works: offline
updated: 2026-11-08
related: [sky-events-calendar, sky-tonight, observing-session, sub-exposure-calculator]
sources:
  - "Sun, Moon and planet positions: astronomy-engine by Don Cross (MIT licence), accurate to about an arcminute."
  - "City coordinates and time zones: public geographic facts, typed by fibub."
flow:
  - { icon: pointer, label: "Your place" }
  - { icon: moon, label: "Each night" }
  - { icon: calendar, label: "Best dates" }
---

## What it does

Faint galaxies and nebulae need a sky that is truly dark, with the Sun well below the horizon and no Moon. How much of that you get changes through the year and with your latitude: in summer at northern latitudes it can vanish completely, and the Moon takes away a week or two of every month. This calendar draws every night of a year as one row of a picture, so you can see the dark windows at a glance and plan trips, imaging projects and star parties months ahead.

For one night in detail, open [[sky-tonight]]; for the Moon phases, eclipses and showers in a month, the [[sky-events-calendar]].

## How to use it

1. Set **your place** at the top. A nearby city is close enough; your choice is shared with the other astronomy tools.
2. Pick the **year** with the arrows.
3. Choose when the **Moon spoils the dark**: whenever it is up, or only when it is more than 10 % or 25 % lit. Imagers and visual observers of faint objects usually count any Moon; a thin crescent barely matters for many targets.
4. Read the picture: each row is a night, January at the top. Time runs left to right in local solar time, so the middle of each row is the darkest moment of the night. Black is true darkness with no Moon. Shades of grey are the three twilights, and the pale gold band is the Moon up during dark hours.
5. The table gives each month's dark hours, Moon-free dark hours, the number of nights with at least 4 Moon-free dark hours, and the best night. **Every night (CSV)** downloads astronomical dusk and dawn, dark hours, Moon-free hours and Moon phase for each night, in your place's time zone.

## How it works

The Sun and Moon positions come from astronomy-engine, accurate to about an arcminute. True darkness is the time with the Sun more than 18° below the horizon (after astronomical dusk and before astronomical dawn). Dusk and dawn are found to within a minute. Within the dark hours the Moon is checked every 10 minutes and counts as up when its centre is above the horizon.

## Worked example

For Toronto in 2027, the year has 2,977 hours of true darkness, of which 1,577 are free of the Moon. That gives 177 nights with at least 4 Moon-free dark hours. June has only 54 Moon-free dark hours in the whole month, while December has 195. In London there is no true darkness at all from late May to late July, so June has none, and in Edinburgh the gap is longer still.

## Frequently asked questions

**Why local solar time?** Clock time shifts by an hour at daylight saving changes, which would break the picture. In solar time, midnight is always the middle of the night. The CSV gives clock times.

**Does it include clouds or light pollution?** No. It shows when the sky can be dark. Use a forecast for clouds, and the sub-exposure calculator or a light pollution map for sky brightness.

**Is my location sent anywhere?** No. Everything is worked out in your browser, and the place is only kept in your browser if you ask it to remember it.
