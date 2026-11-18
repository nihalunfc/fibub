---
name: Set planner
num: 3032
shelf: everyday
code: T1026
section: dj-mixing
title: "Set planner: how many tracks you need and an energy plan for your DJ set"
summary: "Work out how many tracks fill your DJ set, see a timeline with clock times, and shape an energy curve with suggested BPM ranges. Print it or download CSV. Free, on your device."
status: live
ads: false
order: 3032
icon: calendar
works: offline
updated: 2026-11-18
related: [harmonic-mixing, phrase-counter, crowd-energy-log, gig-fee-calculator]
sources:
  - "Track count: each track after the first adds its length minus the overlap; the count is rounded up. Energy presets and the BPM suggestion (low energy at the low end of your range, high energy at the top) are fibub's own rules of thumb, not a standard. Written 2026-11-18."
flow:
  - { icon: calendar, label: "Set times" }
  - { icon: curve, label: "Shape" }
  - { icon: download, label: "Print" }
---

## What it does

Before a gig it helps to know how many tracks you need and where the set should rise and fall. Enter when you start and finish, how long your tracks run on average, and how much they overlap when you mix. The planner tells you how many tracks to prepare and when each one starts on the clock.

Under that is an energy curve you can drag, from 1 (calm) to 10 (peak). Each part of the night gets a suggested energy and BPM range, so you can pull tracks into crates that fit. Paste your own track list and it is placed on the timeline with running clock times. Check tempo and key matches with [[harmonic-mixing]], plan transitions with the [[phrase-counter]] and review the night with the [[crowd-energy-log]].

## How to use it

1. Set **Start** and **End** (it can run past midnight).
2. Pick the **Slot**: warm-up, peak time, closing or all night. This loads a matching curve.
3. Choose **Average track length**, or **BPM and bars** to work it out from the tempo.
4. Drag the dots on the curve, or press a preset button.
5. Press **Print** or **Download CSV**.

## What each setting does

- **Overlap**: seconds the next track starts before the current one ends.
- **BPM range** (More options): the lowest and highest tempo you play. Low-energy parts get the low end, high-energy parts the top.
- **Track list**: one track per line. Add a length like 5:30 at the end of a line; without one the average is used.
- **Remember on this device**: off by default. Kept in this browser only; **Clear** removes it.

## Worked example

A set from 21:00 to 23:00 is 120 min = 7,200 s. With 4:00 tracks (240 s) and a 30 s overlap, each new track adds 210 s. The first track covers 240 s, so (7,200 - 30) / 210 = 34.1, rounded up to 35 tracks. The last one starts at 34 x 210 = 7,140 s, which is 22:59.

## FAQs

**Why round up?** So you do not run out of music. The last track may run slightly past the end time.

**Are the BPM ranges rules?** No. They are a starting suggestion spread across your range. Your crowd and genre decide.

**Is anything uploaded?** No. It all runs in your browser.
