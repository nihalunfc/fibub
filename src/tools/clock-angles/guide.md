---
name: Clock and turn angles
num: 1283
shelf: learn
section: school-maths
title: "Clock and turn angles: the angle between clock hands, and turns on a compass"
summary: "Drag the minute hand and read the angle between the hands at any time, worked out from 6° a minute and 30° an hour plus 0.5° a minute. Find every time in 12 hours when the hands make a right angle (or any angle). Then turn an arrow on a compass by quarter, half and full turns, clockwise or anticlockwise, and see which way it ends up facing."
status: live
ads: false
order: 1283
icon: clock
works: offline
updated: 2026-11-09
related: [ferris-wheel, unit-circle, circle-sector, similar-triangles]
sources:
  - "Clock hand speeds (minute hand 6° per minute, hour hand 0.5° per minute), angle names and compass directions are standard school geometry, written for fibub."
  - "The times the hands make a given angle were checked against a brute-force search over every second of 12 hours (22 right angles, 11 overlaps, 11 straight lines), and at known times (3:30 → 75°, 10:10 → 115°, 9:45 → 22.5°)."
flow:
  - { icon: clock, label: "Set time" }
  - { icon: compass, label: "Angle" }
  - { icon: search, label: "Find times" }
  - { icon: check, label: "Practise" }
---

## What it does

Angles measure how much something turns. A clock is the turning machine we look at every day, and a compass tells us which way we face after a turn. This page has two parts.

**Clock hands.** Drag the long minute hand round the clock (the hour hand follows, just like a real clock) or type a time. The page shades the angle between the hands, names it (acute, right, obtuse, straight or reflex) and works it out:

- the minute hand turns 360° in 60 minutes, so **6° a minute**;
- the hour hand turns 30° in an hour, so **0.5° a minute**, and at h:m it is at **30h + 0.5m** degrees past 12;
- the angle between them is the difference, or 360° minus it if that is more than 180°.

Type any angle from 0° to 180° and the page lists **every time in 12 hours** when the hands make it, to the second.

**Turns and directions.** Start facing north, east, south or west and turn by any amount: quarter, half and three-quarter turns, or any number of degrees, clockwise (positive) or anticlockwise (negative). The arrow shows where you end up, and the steps explain why whole turns can be dropped.

It fits the Class 9 maths chapter on rotations and things that go up and down and round and round, and it is good practice for angle work in every class. The same idea of turning drives the [[ferris-wheel]] and the [[unit-circle]]; angles at the centre of a circle come back in [[circle-sector]].

## How to use it

1. In **Clock hands**, drag the long hand or type the hour and minutes.
2. Read the angle, its name and the steps. The other way round the clock is the reflex angle.
3. Type an angle under **When do the hands make this angle?** to list the times.
4. Switch to **Turns and directions**. Pick a start direction and set the turn with the slider, the box or the quick buttons.

## A worked example

At **3:30** the minute hand is at 6 × 30 = 180° and the hour hand is at 30 × 3 + 0.5 × 30 = 105°. The angle between them is 180° − 105° = **75°**, an acute angle, and the reflex angle is 285°. Many people guess 90° because the hour hand "points at 3", but by 3:30 it has moved halfway to 4.

The hands make a right angle 22 times in 12 hours. The first is at 12:16:22, not 12:15, for the same reason.

Turning: face north and make 1 ¾ turns clockwise (630°). Drop the full turn (360°) and you have turned 270° clockwise, so you face **west**.

## Tips

- The hour hand moves too! Always add 0.5° for each minute.
- The minute hand gains 5.5° a minute on the hour hand, which is why the hands meet every 65 5/11 minutes, 11 times in 12 hours.
- A turn of 270° clockwise ends in the same place as 90° anticlockwise.

## Check yourself

Four fresh questions each time: the angle between the hands at a time, how far the hour hand turns in some minutes, where you face after a turn, and an angle as a fraction of a full turn. Nothing is saved.

## FAQ

**Why only 11 meetings and not 12?** Between 11:00 and 1:00 the hands meet only once, at 12:00.

**Is this from the NCERT book?** It covers the same topic with fibub's own examples. fibub is not part of NCERT.
