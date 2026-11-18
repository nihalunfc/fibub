---
name: Phrase counter
num: 3033
shelf: everyday
code: T1027
section: dj-mixing
title: "Phrase counter: bars, phrases and time to the next phrase from BPM"
summary: "Turn a BPM into seconds per beat, bar and 8, 16 or 32-bar phrase, find the time to the next phrase, convert minutes to bars, and count phrases live with a flash."
status: live
ads: false
order: 3033
icon: clock
works: offline
updated: 2026-11-18
related: [bpm-shifter, metronome, dj-set-planner, transition-timer]
sources:
  - "Beat, bar and phrase lengths follow from 60 / BPM seconds per beat, with 4 beats to a bar (4/4) and the phrase lengths of 8, 16 and 32 bars common in dance music. Arithmetic only; nothing to check against an official source. Written 2026-11-18."
flow:
  - { icon: sliders, label: "Set BPM" }
  - { icon: clock, label: "Count" }
  - { icon: check, label: "Mix" }
---

## What it does

Dance music is built in phrases: blocks of 8, 16 or 32 bars that start and end together. Mixes sound smooth when a new track starts on the first beat of a phrase. This tool turns a tempo (BPM, beats per minute) into the lengths you need: seconds per beat, per bar and per phrase, and how many phrases fit in a track.

It also tells you how long until the next phrase starts from any point in a track, converts minutes and seconds to bars and back, and has a live counter that shows beat, bar and phrase while you start it on a downbeat. If your track is at a different tempo, find the new BPM with the [[bpm-shifter]], and practise the timing with the [[metronome]] or [[transition-timer]].

## How to use it

1. Type the BPM, or press **Tap tempo** in time with the music.
2. Read the lengths and enter the track length to see how many phrases it holds.
3. For **Time to next phrase**, type where you are in the track (for example 1:10) and pick the phrase size.
4. For the live counter, press **Start** on a downbeat. Tick **Click** to hear the beat.

## What each setting does

- **BPM**: beats per minute, 20 to 300.
- **Track length**: m:ss, used to count phrases.
- **Cue time**: a point in the track, m:ss.
- **Beats per bar** (in More options): 4 for most club music, 3 for waltz time.
- **Flash every**: which phrase size makes the big flash in the live counter.
- **Click**: a quiet click on each beat, and a higher one on the first beat of a phrase.

## Worked example

At 128 BPM a beat is 60 / 128 = 0.469 s, a bar is 4 x 0.469 = 1.875 s and 32 bars take 32 x 1.875 = 60 s. A 5:00 track holds 5 phrases of 32 bars. From 1:10 (70 s) the next 32-bar phrase starts at 2:00, which is 50 s away. Two minutes is 120 / 1.875 = 64 bars.

## FAQs

**Why does my track not line up with 32 bars?** Many tracks have an intro of a different length, or a break that adds or drops a few bars. Use the cue time from the first downbeat, not from the start of the file.

**Is the live counter synced to the music?** No. It counts from the moment you press Start, so press it on a downbeat. If the music is not at a steady tempo it will drift.

**Does it work offline?** Yes. Nothing is sent anywhere.
