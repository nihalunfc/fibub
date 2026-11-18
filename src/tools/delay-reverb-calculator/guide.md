---
name: Delay calculator
num: 3039
shelf: everyday
code: T1033
section: production
title: "Delay calculator: BPM to delay time in ms and Hz"
summary: "Type or tap a BPM and see delay times in milliseconds for every note value, dotted and triplet, plus reverb pre-delay, decay and compressor attack and release starting points."
status: live
ads: false
order: 3039
icon: clock
works: offline
updated: 2026-11-18
related: [lfo-rate-calculator, bpm-shifter, metronome, room-acoustics]
sources:
  - "Note lengths follow from the tempo: a quarter note lasts 60,000 / BPM milliseconds, and a dotted note is 1.5 times and a triplet two thirds of the straight note. Pre-delay, decay, attack and release values are common mixing starting points, not standards. Checked 2026-11-18."
flow:
  - { icon: clock, label: "Tap BPM" }
  - { icon: table, label: "Read times" }
  - { icon: copy, label: "Copy" }
---

## What it does

A delay that repeats in time with the music sounds tight; one that does not sounds like a mistake. This tool turns a speed in beats per minute (BPM) into the delay time in milliseconds (ms) for every note value from a whole note down to a 64th, in straight, dotted and triplet versions. Type the BPM or tap it in time with the track, then copy a single time or the whole table into your delay plug-in.

It also gives starting points for reverb pre-delay (the gap before the reverb starts), reverb decay (so the tail ends on a beat or at the bar line) and compressor attack and release that sit with the groove. These are starting points, not rules. Find a steady speed with the [[metronome]], then use the [[lfo-rate-calculator]] for modulation at the same tempo, and the [[room-acoustics]] tool to see how a real room decays.

## How to use it

1. Type the BPM, or press **Tap tempo** several times in time with the music.
2. Read the table: rows are note values, columns are straight, dotted and triplet. Tap a time to copy it.
3. Press **Copy table** to copy everything as tab-separated text for a spreadsheet or notes.
4. Open **More options** for the same times in samples at 44.1 kHz and 48 kHz.

## What each part does

- **Straight, dotted, triplet**: dotted is one and a half times as long, triplet is two thirds as long.
- **Pre-delay**: the time between the dry sound and the start of the reverb. A short one (a 1/64 or 1/128 note) keeps the sound clear.
- **Decay**: how long the tail lasts. Choosing a length equal to a 1/4 note, 1/2 note or bar makes the tail finish on the grid.
- **Attack and release**: how fast a compressor grabs and lets go. Short attacks catch the hit; the release should finish before the next hit you want untouched.

## Worked example

At 120 BPM a quarter note is 500 ms. A dotted eighth is 375 ms, and an eighth triplet is 166.67 ms. A 1/64 pre-delay is 31.25 ms, and a one-bar decay in 4/4 is 2,000 ms. At 44.1 kHz 500 ms is 22,050 samples.

## FAQs

**Why does the answer differ from my plug-in?** Some plug-ins round to whole milliseconds or show a different note name. Use the nearest value and listen.

**Should the reverb tail really end on the beat?** Not always. It is a way to keep a mix tidy at fast tempos. If it sounds better longer, make it longer.

**Does it work offline?** Yes. Nothing you type leaves your device.
