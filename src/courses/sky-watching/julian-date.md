---
title: "Universal Time and the Julian date"
summary: "Astronomers record times in Universal Time and count days with the Julian date: one number that makes it easy to subtract two moments. Learn to convert a calendar date and why the day starts at noon."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "What is the Julian date of the J2000.0 epoch (1 January 2000, 12:00 UT)?"
    choices: ["2451545.0", "2000.0", "51544.5"]
    ans: 0
    why: "J2000.0 is JD 2451545.0. 51544.5 is its modified Julian date."
  - q: "Why does the Julian day begin at noon?"
    choices: ["So that a whole night of European observations had a single date", "Because of daylight saving time", "It was a mistake"]
    ans: 0
    why: "Astronomers in Europe preferred not to change the date in the middle of an observing night."
  - q: "What is the modified Julian date (MJD)?"
    choices: ["JD − 2400000.5", "JD + 0.5", "The number of the day in the year"]
    ans: 0
    why: "MJD = JD − 2400000.5: smaller numbers, and the day starts at midnight."
sources:
  - "Julian date algorithm: J. Meeus, Astronomical Algorithms, 2nd ed. (1998), chapter 7"
---

**Module 2 · about 20 minutes · arithmetic.** You'll be able to record observation times in UT, convert a calendar date and time to a Julian date and back, and find the time between two observations.

## 1. Why this matters

Variable-star observers, exoplanet hunters and meteor counters all log times as Julian dates. A transit time of JD 2460123.4567 can be compared across countries and centuries with a simple subtraction, which is what a period search ([Astronomy 5.2](/learn/courses/astronomy/periodograms/)) needs. Data archives ([Astronomy 5.6](/learn/courses/astronomy/open-archives/)) and FITS headers ([Astronomy 5.5](/learn/courses/astronomy/fits-python/)) use JD or MJD everywhere.

## 2. Universal Time

Clock time depends on your time zone and on daylight saving, which makes it a poor way to share observations. Astronomers use **Universal Time (UT)**, which is essentially the time at Greenwich with no daylight saving. Toronto in winter is UT − 5 h; India is UT + 5 h 30 min.

(For precise work there are several flavours: UTC, which your phone keeps, with leap seconds; UT1, which follows Earth's actual spin; and TT and TDB, smooth time scales used for orbits. For logging observations UTC is fine.)

## 3. One number for every moment

The **Julian date (JD)** counts days, with decimals for the time of day, from noon UT on 1 January 4713 BC (proleptic Julian calendar), a date chosen in 1583 by Joseph Scaliger so that several old calendar cycles all start together. Every moment in recorded history has a positive JD.

- The day starts at **noon UT**, so a European observing night does not change date at midnight.
- **J2000.0**, the reference epoch for modern catalogues, is JD 2451545.0.
- The **modified Julian date** `$\text{MJD} = \text{JD} - 2400000.5$` gives smaller numbers and starts the day at midnight.

<!--fig:jd-converter-->

Things to notice:

- Set 12:00 and 00:00 on the same date: they differ by 0.5 days, and the JD ends in .0 at noon and .5 at midnight.
- Pick 1 and 2 March in a leap year and a normal year: the JD step is always exactly 1. JD ignores months and leap years, which is the point.

<details class="maths" open>
<summary>Maths and principle</summary>

**Meeus's method** for a Gregorian date (year `$Y$`, month `$M$`, day `$D$` with the time as a fraction of a day):

1. If `$M \le 2$`, set `$Y \to Y - 1$` and `$M \to M + 12$` (treat January and February as months 13 and 14, so the leap day comes at the end of the year).
2. `$A = \lfloor Y/100 \rfloor$`, `$B = 2 - A + \lfloor A/4 \rfloor$`.
3. Then

```math
JD = \lfloor 365.25\,(Y + 4716) \rfloor + \lfloor 30.6001\,(M + 1) \rfloor + D + B - 1524.5
```

`$\lfloor x \rfloor$` means "round down to a whole number". The 30.6001 averages the months' lengths; the extra 0.0001 avoids a rounding error.

**Elapsed time:** the days between two events is just `$JD_2 - JD_1$`.
</details>

## 4. Worked example

*Sputnik 1 was launched on 4 October 1957 at about 19:28 UT* (Meeus uses this date as his example). The time is `$19.47/24 = 0.811$` day, so `$D = 4.811$`.

- October is month 10, so no change: `$Y = 1957$`, `$M = 10$`.
- `$A = 19$`, `$B = 2 - 19 + 4 = -13$`.
- `$\lfloor 365.25 \times 6673 \rfloor = 2437313$`; `$\lfloor 30.6001 \times 11 \rfloor = 336$`.
- `$JD = 2437313 + 336 + 4.811 - 13 - 1524.5 = 2436116.31$`.

From launch to J2000.0: `$2451545.0 - 2436116.31 = 15428.69$` days, about 42.2 years.

## 5. Practice

1. What is the MJD of JD 2460000.5?
2. Two minima of a variable star were logged at JD 2460312.6125 and JD 2460315.0875. If no minima were missed between them, what is the period?
3. You observe at 22:00 local time in Toronto in January. What is the UT?

<details>
<summary>Answers</summary>

1. `$2460000.5 - 2400000.5 = 60000$`.
2. `$2460315.0875 - 2460312.6125 = 2.475$` days.
3. Toronto is UT − 5 h in winter, so 03:00 UT the next day.
</details>

**Try it with real numbers:** convert between calendar dates, JD, MJD, sidereal time and other time systems with [[astro-time]].

**New words:** *Universal Time*, *UTC*, *Julian date*, *modified Julian date*, *epoch*.
