---
name: LFO rates
num: 3020
shelf: everyday
code: T1041
section: production
title: "LFO rates: BPM to LFO Hz for tempo-synced modulation"
summary: "Turn a BPM into LFO and sidechain rates in Hz for every note value, work out the nearest note for any Hz, and see the LFO shape drawn over one bar."
status: live
ads: false
order: 3020
icon: wave
works: offline
updated: 2026-11-18
related: [delay-reverb-calculator, bpm-shifter, drum-sequencer]
sources:
  - "An LFO that repeats once per note value has a rate of 1 / (length of that note in seconds); a quarter note lasts 60 / BPM seconds, a bar in 4/4 lasts four of them. Sidechain release times are common starting points, not standards. Checked 2026-11-18."
flow:
  - { icon: clock, label: "Set BPM" }
  - { icon: wave, label: "Pick note" }
  - { icon: curve, label: "See shape" }
---

## What it does

A low-frequency oscillator (LFO) is a slow wave that moves a knob for you: the volume in a tremolo, the filter in a wobble, the level in a sidechain pump. If its rate is a plain number of hertz (Hz, cycles per second) it drifts against the beat. If the rate matches a note value at the song's tempo, the movement locks to the groove.

Type or tap a BPM and the table shows the rate in Hz and the period in milliseconds for 1/1 to 1/32 notes (straight, dotted and triplet), plus two and four bars. A second box works backwards: type a rate in Hz and see which note value is closest. Use it with the [[delay-reverb-calculator]] for echo times at the same tempo.

## How to use it

1. Type the BPM or press **Tap tempo** in time with the music.
2. Read the Hz of the note value you want and type it into your plug-in, or pick a synced setting if it has one.
3. To go backwards, type a Hz value under **Hz to the nearest note**.
4. Choose a shape and a rate under **Shape over one bar** to see the wave across four beats.

## What each part does

- **Rate**: how many cycles per second. A 1/4 note LFO completes one cycle per beat.
- **Period**: how long one cycle lasts, in milliseconds.
- **Sidechain release**: the time the level takes to rise again after each kick. A half-beat release gives a clear pump; shorter is tighter.
- **Shapes**: sine is smooth, triangle is smooth with straight sides, saw ramps and snaps back, square jumps between two values.

## Worked example

At 120 BPM a bar in 4/4 lasts 2 seconds, so a 1/1 LFO runs at 0.5 Hz. A 1/4 note is 2 Hz and a 1/8 note is 4 Hz. A pump on quarter notes there has beats 500 ms apart, so a release near 250 ms (half a beat) is a good first try. A rate of 2.1 Hz is closest to 1/4, about 5% faster.

## FAQs

**Why not just use the plug-in's sync switch?** Use it when it exists. This is for plug-ins and hardware that only take Hz.

**What happens if the tempo changes?** The Hz change with it; enter the new BPM and read the table again.

**Does it work offline?** Yes, and nothing you type leaves your device.
