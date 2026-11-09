---
name: "Historic calendar converter"
num: 415
shelf: science
section: digital-humanities
title: "Historic calendar converter: Julian, Gregorian, Hijri, Hebrew, Julian Day Number and weekday"
summary: "Convert a date between the Julian and Gregorian calendars (with the 1582 switch), the tabular Islamic (Hijri) calendar, the Hebrew calendar and the Julian Day Number, and find its day of the week. Convert a whole list and download it as CSV."
status: live
ads: true
order: 415
icon: calendar
works: offline
updated: 2026-11-09
related: [radiocarbon-calibration, astro-time, manuscript-annotator, correspondence-network, eclipse-finder]
sources:
  - "Gregorian and Julian day numbers: Fliegel and Van Flandern (1968), Communications of the ACM 11(10), and E. G. Richards in the Explanatory Supplement to the Astronomical Almanac (3rd ed., 2013). Hebrew and tabular Islamic calendars: E. M. Reingold and N. Dershowitz, Calendrical Calculations (Cambridge University Press)."
  - "Checked against the Python library convertdate on 20,000 random days from 3761 BC to AD 3200 in both directions for all four calendars, plus the weekday (163,908 checks, no differences)."
flow:
  - { icon: calendar, label: "Pick a date" }
  - { icon: convert, label: "Convert" }
  - { icon: table, label: "Each one" }
---

## What it does

Historians meet dates in many calendars. A letter from London in 1700 is dated in the Julian calendar, one from Paris in the Gregorian; a chronicle may give the Hijri year, a community record the Hebrew date. This converter puts one day into all of them at once:

- **Gregorian**, extended back before 1582 (the "proleptic" Gregorian calendar).
- **Julian**, the calendar of Julius Caesar, used across Europe until 1582 and in Britain and its colonies until 1752.
- **Historical**: Julian up to 4 October 1582, Gregorian from 15 October 1582, as in Catholic Europe.
- **Islamic (tabular Hijri)**: the arithmetic calendar of 30-year cycles, with 11 leap years in each cycle.
- **Hebrew**: the fixed arithmetic calendar, with its 19-year leap cycle and postponement rules.
- **Julian Day Number** (JDN): a plain count of days used by astronomers and in databases.
- **Day of the week**.

Put the converted dates on letters in the [[correspondence-network|correspondence network]], and note them beside the page in the [[manuscript-annotator|manuscript annotator]].

## How to use it

1. Choose the calendar your date is in, then the day, month and year. For the Julian and Gregorian calendars choose AD or BC; there is no year 0, so 1 BC is followed by AD 1.
2. The table shows the same day in every calendar. **Today** fills in today's date.
3. To convert many dates, paste them in **Convert a list**, one per line as year-month-day in the calendar chosen above (BC years as astronomical years: 0 is 1 BC, −43 is 44 BC), and download the CSV.

## Worked example

Press **Example: Shakespeare and Cervantes**. William Shakespeare died on 23 April 1616 as recorded in England, which still used the Julian calendar. The page shows that day was a **Tuesday, 3 May 1616 (Gregorian)**, JDN 2311415, 16 Rabi' al-thani 1025 AH and 16 Iyyar 5376 AM. Spain had already switched to the Gregorian calendar, so Miguel de Cervantes, who died on 22 April 1616 by Spanish reckoning, died about ten days before Shakespeare, not on the same day.

The list in the example also shows that the Battle of Hastings, 14 October 1066 (Julian), fell on a Saturday; that 3 September 1752 (Julian) is 14 September 1752 (Gregorian), the day Britain jumped to when it changed calendars; and that the Ides of March, 44 BC, entered as −43-3-15, was 13 March 44 BC in the proleptic Gregorian calendar.

## Tips and FAQ

**Why can a Hijri date differ by a day from the one I know?** In most countries the Islamic month begins when the new crescent moon is seen, or follows a national calendar such as Saudi Arabia's Umm al-Qura. The tabular calendar here is the standard arithmetic one, often used by historians; it can differ from those by one day, sometimes two. Check against an official source for religious dates.

**When does the day start?** Hebrew and Islamic days begin at sunset, so the evening before the Gregorian date shown already belongs to that day.

**Which countries used which calendar?** Spain, Portugal, Italy and Poland switched in 1582, France in December 1582, the Protestant German states in 1700, Britain and its colonies in 1752, Russia in 1918 and Greece in 1923. For other places, choose Julian or Gregorian yourself.

**What about the Malayalam (Kollam era) calendar?** It is not included yet. Its months begin with the sun's entry into each sidereal sign (sankranti), and the day a month begins depends on the exact time of that moment and a rule about the part of the day it falls in. Almanacs that use different astronomical methods can disagree by a day, and we could not check our results reliably enough, so we left it out rather than show dates that might be wrong.

**Is anything sent anywhere?** No. It is all arithmetic in your browser and works offline.
