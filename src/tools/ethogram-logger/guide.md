---
name: Ethogram logger
num: 315
shelf: science
section: zoology-and-animal-behaviour
title: "Ethogram logger: animal behaviour timer with time budgets and bouts (free)"
summary: "Define behaviours with one-key shortcuts, as states or point events, log a timed observation session by keyboard or tap, and get time budgets, bout counts and bout durations, event rates and a timeline. Download the log as CSV. Runs in your browser."
status: live
ads: true
order: 315
icon: clock
works: offline
updated: 2026-11-09
related: [biodiversity-indices, reliability-analysis, sample-size, field-sampling-planner, home-range-analyser, bird-song-spectrogram]
sources:
  - "Continuous (all-occurrence) recording of states and events, time budgets and bouts: Martin, P. and Bateson, P., Measuring Behaviour: An Introductory Guide (Cambridge University Press); Altmann, J. (1974), Behaviour 49: 227–267."
  - "Checked against an independent Python check on the page's made-up session (the running state sampled on a 1 ms grid with numpy; bouts listed directly)."
flow:
  - { icon: pencil, label: "Ethogram" }
  - { icon: clock, label: "Log session" }
  - { icon: chart, label: "Time budget" }
  - { icon: download, label: "CSV" }
---

## What it does

An ethogram is the list of behaviours you score when you watch an animal. This logger turns your keyboard (or the screen of a phone or tablet) into a behaviour recorder for continuous focal sampling: press a key when a behaviour starts, and the page keeps the time. When you stop, it works out the **time budget** (the share of the session spent in each state), the number of **bouts** and how long they lasted, and how often each **point event** happened, and it draws a timeline of the whole session. Everything runs in your browser; nothing is uploaded.

## How to use it

1. Write your ethogram, one behaviour per line: a **one-letter key**, the **name**, and **state** or **event**. For example "F, Foraging, state" or "C, Call, event".
2. Press **Start**. The clock runs, and a button appears for each behaviour.
3. Press a behaviour's key, or tap its button, each time it starts. Starting a state ends the state before it. Pressing the running state's key again stops it, which is useful when the animal goes out of sight. **Undo last** removes the last entry if you pressed the wrong key.
4. Press **Stop**. The results appear below. Download the log and the summary as CSV, or the report as an image, PDF or Word file.

Keys only work while the session is running and you are not typing in a box, so typing notes elsewhere is safe. Keep the tab open: the log is not stored, and reloading the page loses it.

## What each part means

- **States** last until another state starts or you stop them: resting, foraging, grooming. Only one state runs at a time.
- **Events** are moments with no length: a call, a peck, a scratch. They are counted and given as a rate per minute.
- **Time in a state**: the share of the session covered by any state. The rest is time before your first key press or after a stop.
- **Bouts**: each uninterrupted run of a state. The table gives the number of bouts and their mean, median, shortest and longest length.
- **Remember this ethogram on this device**: off by default. When ticked, only the list of behaviours is kept in this browser for next time. **Clear saved ethogram** removes it.

## Worked example

Press **Load a made-up example** to see an 11-minute session of an imaginary animal with four states and two events. It spent the most time **Foraging: 334.2 s, 50.6 % of the session, in 9 bouts** with a median bout of 42.4 s. Resting took 189.0 s (28.6 %) in 4 bouts, Vigilant 54.8 s (8.30 %) and Moving 62.0 s (9.39 %). The animal was out of sight for 20 s, logged as a stop, so 97 % of the session is in a state. There were 8 calls (0.727 per minute) and 9 scratches.

## Tips

- Keep keys easy to reach, and test your ethogram for a minute before a real session.
- Define states so they cover everything the animal does, with an "Other" state if needed, so the time budget adds up.
- For inter-observer agreement on the same session, score it separately and compare with the reliability analysis tool.

## Frequently asked questions

**Can I pause?** Press the running state's key to stop it; the time with no state is reported separately and not counted in any behaviour.

**Is it accurate enough?** Times are recorded to a tenth of a second from the browser's clock. Your reaction time is a bigger source of error, as with any manual recording.

**Is anything stored or sent?** No log is ever stored or sent. Only the ethogram list is kept, in this browser, if you tick the box.
