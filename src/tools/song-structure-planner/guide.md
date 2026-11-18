---
name: Song planner
num: 3025
shelf: everyday
code: T1042
section: production
title: "Song planner: song structure and arrangement timeline with section times"
summary: "Plan a song from intro, verse, chorus, drop and other sections: set bars, BPM and time signature, see the start time of every section and export the plan."
status: live
ads: false
order: 3025
icon: calendar
works: offline
updated: 2026-11-18
related: [chord-scale-helper, drum-sequencer, phrase-counter, delay-reverb-calculator]
sources:
  - "Time of a bar = beats per bar x (4 / note value) x 60 / BPM, with BPM counting quarter notes (so 4 bars of 4/4 at 120 BPM = 8 s). The genre templates are common shapes in pop, club music, hip-hop and drum and bass, written by fibub as starting points. They are not rules and real tracks vary a lot. Checked 2026-11-18."
flow:
  - { icon: pencil, label: "Add parts" }
  - { icon: clock, label: "Set tempo" }
  - { icon: download, label: "Export" }
---

## What it does

A song is easier to finish when you can see its shape. Add sections (intro, verse, pre-chorus, chorus, drop, breakdown, build, bridge, outro), give each a number of bars, and set the BPM and time signature. The planner colours a timeline bar by section and shows the time each section starts, plus the total length in bars and minutes.

Sketch the drums for it with the [[drum-sequencer]], or work out delay times for the tempo with the [[delay-reverb-calculator]].

## How to use it

1. Set **BPM** and **Time signature**.
2. Pick a **template** for a starting shape, or add sections one by one with **Add section**.
3. For each row change the type or the bars, move it with **Up** and **Down**, **Copy** it or **Delete** it.
4. Download the plan as **text**, **CSV**, or **markers** (names and start times).

## What each option does

- **BPM**: beats per minute, counted in quarter notes.
- **Time signature**: how many beats make a bar. 3/4 has bars of 3 quarter notes, 6/8 has bars of 6 eighth notes (3 quarter notes).
- **Templates**: common shapes for pop, club edits, hip-hop and drum and bass. Treat them as ideas, not rules.
- **Markers**: a CSV with a name and a time for each section start, for pasting or importing into an editor. Each editor has its own import format, so check yours.

## Worked example

At 120 BPM in 4/4 one bar lasts 2 seconds, so 4 bars is 8 seconds. Start a plan with Intro 8 bars, Verse 16 bars, Chorus 8 bars: the starts are 0:00, 0:16 and 0:48, and the total is 32 bars, 1:04.

## FAQs

**Why do bars in 6/8 sound shorter than in 4/4?** Six eighth notes are three quarter notes, so at the same BPM a 6/8 bar is shorter than a 4/4 bar.

**Can I plan a tempo change?** Not yet. The plan uses one BPM throughout.

**Is the plan saved?** No. Download it before you leave the page.
