---
name: Crowd log
num: 3036
shelf: everyday
code: T1030
section: dj-mixing
title: "Crowd log: log crowd energy during a DJ set and see what worked"
summary: "Tap a 1 to 10 button during your set to log the crowd's energy with the time, track and a note, then see a chart, the peak, average and best and worst tracks, and export CSV."
status: live
ads: false
order: 3036
icon: chart
works: offline
updated: 2026-11-18
related: [dj-set-planner, harmonic-mixing, transition-timer]
sources:
  - "The 1 to 10 scale is your own judgement of how the room feels; there is no standard. Track scores are the average of the taps made while that track name was entered. Written 2026-11-18."
flow:
  - { icon: play, label: "Start" }
  - { icon: pointer, label: "Tap 1-10" }
  - { icon: chart, label: "Review" }
---

## What it does

After a gig you remember the highs, but not always which track or which minute caused them. This log fixes that. While you play, tap a number from 1 (empty floor) to 10 (the room is going off) whenever the energy changes. Each tap saves the elapsed time, the track name you have typed and an optional note.

When you finish you get a chart of energy across the set, the peak, the average, and the tracks that scored best and worst. The page asks your browser to keep the screen awake while logging, where the browser allows it. Plan the next night with the [[dj-set-planner]], compare it with your practice in the [[transition-timer]], and pick tracks that fit together with [[harmonic-mixing]].

## How to use it

1. Press **Start clock** when your set begins.
2. Type the current track name in **Now playing** (optional).
3. Tap a number from 1 to 10 whenever the crowd changes. Add a note first if you like.
4. Press **Download CSV** or **Print summary** afterwards.

## What each setting does

- **Now playing**: the track name attached to your next taps.
- **Note**: free text for the next tap, such as "hands up" or "floor emptied".
- **Slider** (More options): the same as the buttons, for a finer feel.
- **Remember this set on this device**: off by default. If ticked, entries stay in this browser only. **Clear** removes them.

## Worked example

You log 4, 6, 9 and 7 at 5, 20, 40 and 55 minutes. The peak is 9 at 40:00 and the average is (4 + 6 + 9 + 7) / 4 = 6.5. If track A got the 6 and the 9 its score is 7.5, and track B, which got the 4, scores 4, so A is best and B is worst.

## FAQs

**Does the clock keep running if I lock the phone?** It keeps counting from the time you started, but the screen may switch off. Where supported the page asks to keep the screen on.

**Can I edit an entry?** Entries cannot be edited, but **Undo last** removes the latest one so you can tap again.

**Is anything uploaded?** No. Nothing leaves your device.
