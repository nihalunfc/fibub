---
name: Countdown timer
num: 2047
shelf: everyday
code: T930
section: classroom
title: "Countdown timer and stopwatch for the classroom, full screen"
summary: "A big-digit countdown timer with 1, 2, 5, 10 and 15 minute buttons or any time you type, an amber warning near the end and a beep, plus a stopwatch with laps. Full screen for a projector."
status: live
ads: false
order: 2047
icon: clock
works: offline
updated: 2026-11-10
related: [study-timer, group-maker]
sources:
  - "fibub's own working. The time is read from your device's clock."
flow:
  - { icon: sliders, label: "Pick a time" }
  - { icon: clock, label: "Count down" }
  - { icon: check, label: "Time is up" }
---

## What it does

A timer you can put on a projector or whiteboard: big digits, quick buttons for 1, 2, 5, 10 and 15 minutes, or any time you type. The digits turn amber near the end so the room can see time is running out, then red with a beep when time is up. A second tab is a stopwatch with laps, for races, experiments or timed reading.

Everything runs in your browser and nothing is saved. To split the class into teams first, use the [[group-maker]]; for your own study sessions with breaks, try the [[study-timer]].

## How to use it

1. In **Countdown**, press a quick button or type minutes and seconds. 5 minutes is set to start with.
2. Press **Start**. **Pause** stops the clock and **Resume** carries on.
3. Press **Full screen** to fill the screen with the digits. Press Esc or **Leave full screen** to go back.
4. **Reset** puts the time back to what you set.
5. In **Stopwatch**, press **Start**, then **Lap** to note each split. **Reset** clears the time and the laps.

## What each setting does

- **Minutes and Seconds**: the countdown length, up to 999 minutes; seconds from 0 to 59.
- **Turn amber in the last (seconds)**: when the digits change colour. 30 seconds is the starting value; 0 turns the warning off.
- **Beep when time is up**: four short beeps made by your browser.
- **Lap**: the stopwatch table shows each lap's own time and the running total, newest at the top.

## Worked example

Type 1 minute and 30 seconds: the screen shows 1:30. Press Start, and one second later it reads 1:29. At 0:30 the digits go amber, and at 0:00 they go red, "Time is up" appears and it beeps. In the stopwatch, laps pressed at 12.40 s and 25.10 s show lap times of 0:12.40 and 0:12.70 with totals 0:12.40 and 0:25.10.

## FAQs

**Does it keep time in a background tab?** Yes. It reads the clock rather than counting ticks, so it stays right even when the browser slows the page.

**Why did it not beep?** Browsers allow sound only after you press a button on the page. Pressing Start counts, so check the box and your volume.

**Can I show hours?** Yes. Type 90 minutes and it shows 1:30:00.
