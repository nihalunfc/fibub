---
name: Calendar maker
num: 1231
shelf: learn
code: L110
section: school-earth
title: "Calendar maker: why leap years and adhik maas exist, solar vs lunar calendars on a seasons wheel"
summary: "Run five calendars forward for any number of years and watch them slip against the seasons: 365 days only, Julian and Gregorian leap years, a pure Moon calendar and Moon months with an extra adhik maas. Includes a leap year checker and the 19-year cycle."
status: live
ads: false
order: 1231
icon: calendar
works: offline
updated: 2026-11-09
related: [moon-phase-simulator, historic-calendar-converter, kepler-orbits, sky-events-calendar]
sources:
  - "Mean tropical year 365.24219 days and mean synodic month 29.530589 days (J. Meeus, Astronomical Algorithms, 2nd edition); the Julian and Gregorian leap year rules; the 19-year Metonic cycle of 235 months. Wording, pictures and examples are fibub's own."
  - "The adhik maas rule here is a simplification (add a month when the Moon months fall more than half a month behind the seasons). Real Indian calendars decide it from the sankranti; check a panchang."
  - "Leap year counts checked against Python's calendar.isleap and calendar.leapdays."
flow:
  - { icon: sliders, label: "Years" }
  - { icon: calendar, label: "Calendars" }
  - { icon: orbit, label: "Seasons" }
  - { icon: check, label: "Check" }
---

## What it does

The Earth takes about **365.2422 days** to go once round the Sun, from one spring equinox to the next. The Moon takes about **29.5306 days** to go from one new moon to the next. Neither is a whole number of days, and a year is not a whole number of Moon months (12 of them make only 354.37 days). Every calendar has to fudge this somehow, or its dates slowly wander away from the seasons.

This page runs five ways of making a calendar side by side:

- **365 days, no leap years**: a quarter of a day short each year.
- **Julian**: a leap day every 4 years, making 365.25 days, a little too long.
- **Gregorian** (the calendar most of the world uses): no leap day in century years unless they divide by 400, making 365.2425 days.
- **12 Moon months** only (like the Hijri calendar): about 11 days short every year.
- **Moon months plus an extra month** (**adhik maas**) every two or three years, like the Indian lunisolar calendars.

Move the **years** slider and watch where the spring equinox falls in each calendar on a **seasons wheel**.

It follows Class 8 Science, keeping time with the skies (the solar year, lunar months, the Indian calendar, leap years and adhik maas), and fits geography lessons on the Earth's motion. Next, see why the Moon changes shape through the month in the [[moon-phase-simulator]]; convert real dates between Gregorian, Julian, Hijri and Hebrew calendars with the [[historic-calendar-converter]]; and for why the Earth's orbit takes the time it does, try [[kepler-orbits]].

## How to use it

1. Set **years** (0 to 500 on the slider, up to 5,000 in the box), or tap a quick button: 1, 4, 19, 33 or 400 years.
2. The wheel shows the year as a ring of months. The dashed mark is where the equinox started (about 20 March); each coloured dot is where it falls now in one calendar.
3. The table gives each calendar's year length, how far the equinox has slipped and how many years it takes to slip one day.
4. **Adhik maas** lists the years in which the lunisolar calendar adds its 13th month, and explains the 19-year cycle.
5. **Is it a leap year?** checks any year from 1 to 9999 with the Gregorian rule, and says why.

## Worked example

Run **100 years**. With no leap years the equinox arrives 24.2 days later in the calendar, so "March" weather would be turning up in April. The Julian calendar is 0.78 days out the other way (it slips one day every 128 years, which is why 10 days had to be dropped in 1582). The Gregorian calendar is only 0.03 days out and takes about 3,226 years to slip a single day. The pure Moon calendar has slipped 1,087.5 days, round the year almost three times. The lunisolar calendar has used 1,237 months, including **37 adhik maas**, and is just 5.1 days out.

Try **19 years**: 235 months, 7 of them extra, and the lunisolar calendar is back within about 2 hours of the seasons. Type **2100** into the leap year box: it divides by 100 but not by 400, so it is **not** a leap year.

## Check yourself

Five fresh questions: days in a year, leap years in a range, how far a Moon-calendar festival moves, the Julian error and days in a few Moon months. Nothing is saved.

## FAQ

**Why do Eid and Ramzan come about 11 days earlier each year?** The Hijri calendar uses 12 Moon months only, 354 or 355 days, so it runs through all the seasons in about 33 years.

**Why do Diwali and Holi stay in the same season?** Indian calendars follow Moon months but add an adhik maas about every 2.7 years to stay in step with the Sun.

**Is the adhik maas list exact?** No. It uses mean months and a simple rule. Real panchangs decide it from the true positions of the Sun and Moon.

**Is this from the NCERT book?** It covers the same topics with fibub's own pictures and examples. fibub is not part of NCERT.
