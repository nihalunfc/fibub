---
name: Clock hand angles
num: 1285
shelf: learn
code: L153
section: school-maths
title: "Clock hand angles: the angle between the hour and minute hands at any time, and when they meet"
summary: "Drag the minute hand round a clock (the hour hand follows) or type a time, and see the angle between the hands worked out step by step, how far each hand has turned, and every time in 12 hours when the hands make the angle you choose."
status: live
ads: false
order: 1285
icon: clock
works: offline
updated: 2026-11-09
related: [ferris-wheel, unit-circle, linear-pair-solver]
sources:
  - "Clock arithmetic (6° a minute for the minute hand, 0.5° a minute for the hour hand, |30h − 5.5m|) is standard school maths. Written for fibub."
  - "Checked by hand (3:30 → 75°, 9:45 → 22.5°) and against sympy: right angles 22 times in 12 hours, first at 16 4/11 minutes past 12; the hands overlap every 65 5/11 minutes."
flow:
  - { icon: pointer, label: "Drag hand" }
  - { icon: compass, label: "Angle" }
  - { icon: clock, label: "When" }
  - { icon: check, label: "Practise" }
---

## What it does

A clock is a good place to practise angles and turns. The minute hand goes round once an hour; the hour hand goes round once every 12 hours. This page shows a clock you can set by **dragging the long hand** (the short hand follows, as on a real clock) or by typing a time, and works out:

- the **smaller angle** between the hands, and the **reflex** angle the other way round,
- how far each hand points from 12, step by step,
- the shortcut **|30h − 5.5m|**,
- and every time in 12 hours when the hands make an angle you choose, such as a right angle or a straight line.

It goes with the Class 9 maths chapter on **angles, turns and rotation** and is a classic puzzle for competitive exams.

For a turning wheel whose height makes a wave, try the [[ferris-wheel]]; for angles as points on a circle, see the [[unit-circle]]. The "when do the hands meet" question is two straight lines crossing, as in the [[linear-pair-solver]].

## How to use it

1. **Drag the long (minute) hand** round the clock. Going past 12 moves the hour on, just like a real clock. You can also type **Hours** (0 to 23) and **Minutes**, or use the step and time buttons.
2. The shaded wedge is the smaller angle between the hands; its size is in the big line under the clock.
3. **How the angle is worked out** shows where each hand points and the subtraction, and the shortcut formula.
4. Under **When do the hands make an angle?** type an angle from 0° to 180°. You get every time in 12 hours when the hands are that far apart; **Set the clock to the next one** jumps there.

## A worked example

At **3:30** the minute hand points at 6, which is 30 × 6° = 180° from 12. The hour hand is half way between 3 and 4: 3 × 30° + 30 × 0.5° = 105°. The angle between them is 180° − 105° = **75°**, and the shortcut agrees: |30 × 3 − 5.5 × 30| = |90 − 165| = 75°.

At **9:45** the hands look like they overlap but they don't: the minute hand is at 270° and the hour hand at 9 × 30° + 45 × 0.5° = 292.5°, so they are **22.5°** apart.

Ask for **90°**: in 12 hours the hands are at right angles 22 times, the first at 12:16 and 22 seconds (16 4/11 minutes past 12). Ask for **0°**: they overlap 11 times in 12 hours, every 65 5/11 minutes, so after 12:00 the next is about 1:05 and 27 seconds.

## Tips

- The minute hand gains 5.5° on the hour hand every minute (6° − 0.5°). That is why the times when the hands meet are 360° ÷ 5.5° = 65 5/11 minutes apart.
- If the shortcut gives more than 180°, take it away from 360° to get the smaller angle.

## Check yourself

Four fresh questions each time: whole hours, any time, and how far each hand turns. Type a number and press **Check**. Nothing is saved.

## FAQ

**Why only 11 meetings in 12 hours, not 12?** The meeting that would be near 11:00 is really at 12:00, which is counted at the start.

**Does the clock show my time?** No. It is a model clock that you set; it does not read your device's clock.

**Is this from the NCERT book?** It covers the same ideas with fibub's own examples. fibub is not part of NCERT.
