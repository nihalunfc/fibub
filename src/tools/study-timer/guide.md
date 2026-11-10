---
name: Study timer
num: 2046
shelf: everyday
code: T929
section: classroom
title: "Study timer: Pomodoro focus and break timer"
summary: "A Pomodoro-style study timer: 25 minutes of focus, 5-minute breaks and a longer break after every four sessions. Change the lengths, auto-start the next part and hear a beep."
status: live
ads: false
order: 2046
icon: clock
works: offline
updated: 2026-11-10
related: [classroom-timer, group-maker, planner]
sources:
  - "Default lengths (25 min focus, 5 min short break, long break after 4 sessions) follow the Pomodoro Technique as described by its creator, Francesco Cirillo. The 15 min long break is a common choice within his suggested range. Timer and sounds are fibub's own working."
flow:
  - { icon: sliders, label: "Set lengths" }
  - { icon: clock, label: "Focus" }
  - { icon: check, label: "Break" }
---

## What it does

This timer splits study time into focus sessions and breaks, the way the Pomodoro Technique does: 25 minutes of work, a 5-minute break, and after every four focus sessions a longer break. It beeps at the end of each part and shows the time left in the tab title.

It runs on your device and saves nothing. To plan which subject goes in each block, use the [[planner|weekly planner]]; teachers running timed class work may prefer the [[classroom-timer]].

## How to use it

1. Check the lengths under the timer (25, 5 and 15 minutes are filled in).
2. Press **Start** (or the Space bar when you are not typing in a box).
3. Work until the beep. Press **Start** again for the break.
4. **Pause** stops the clock, **Skip** jumps to the next part, and **Reset** goes back to the first focus session.

## What each setting does

- **Focus, Short break, Long break**: the length of each part in whole minutes, from 1 to 180. A part that has not started yet takes a new length at once; a part already running keeps its time.
- **Long break after every**: how many focus sessions come before the long break (2 to 6; the usual is 4).
- **Start the next part on its own**: when ticked, breaks and focus sessions follow each other without a press.
- **Beep when a part ends**: three short beeps made by your browser. Untick it for silence.
- **Coming up**: the next eight parts, so you can see when the long break comes.

## Worked example

With the defaults, the order is focus, short break, focus, short break, focus, short break, focus, long break: 4 × 25 + 3 × 5 + 15 = 130 minutes for one full round. Set focus to 1 minute and press Start: after a second the tab title reads 0:59 Focus.

## FAQs

**Does it keep running in another tab?** Yes. It works from the clock, so it stays right even when the browser slows background tabs.

**Why no sound?** Browsers only allow sound after you press a button on the page, so press Start first. Check the beep box and your volume.

**Is my session count saved?** No. It clears when you close or reload the page.
