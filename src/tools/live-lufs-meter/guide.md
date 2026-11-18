---
name: LUFS meter
num: 3042
shelf: everyday
code: T1036
section: production
title: "LUFS meter: live loudness meter for microphone, browser tab or file"
summary: "Watch loudness live in LUFS (ITU-R BS.1770, EBU R 128): momentary, short-term, integrated, loudness range and true peak, with a scrolling graph and −14 and −23 target lines. Measure a microphone, a browser tab's sound or a file."
status: live
ads: false
order: 3042
icon: chart
works: offline
updated: 2026-11-18
related: [loudness-normaliser, audio-mastering, hearing-timer, stereo-phase-checker]
sources:
  - "ITU-R BS.1770-4 (K-weighting, gating, true peak), EBU R 128 (−23 LUFS) and EBU Tech 3341 (momentary 400 ms, short-term 3 s) and Tech 3342 (loudness range). The −14 LUFS streaming line is the level Spotify and YouTube give on their help pages, checked 2026-11-18; services change it, so check the official source."
flow:
  - { icon: mic, label: "Pick source" }
  - { icon: play, label: "Play" }
  - { icon: chart, label: "Watch" }
---

## What it does

This is a loudness meter like the ones in broadcast and streaming studios, in your browser. It measures sound the way people hear it, in LUFS, following ITU-R BS.1770 and the EBU R 128 meter rules. You can point it at a microphone or line input, at the sound of another browser tab (a video, a stream, a web player) or at a file on your device. Nothing is recorded or sent.

For a file you already have, the [[loudness-normaliser]] measures it in one go and can fix the level; to make a track hit a target, use [[audio-mastering]].

## How to use it

1. Press **Microphone or line in**, **A browser tab's sound** (Chrome, Edge and other Chromium browsers; tick "Share tab audio") or **Play a file**.
2. Watch the numbers and the graph. The dashed lines mark −14 LUFS (streaming), −23 LUFS (broadcast) and your own target.
3. Press **Reset** to start the integrated reading again, or **Stop**.

## What each number means

- **Momentary**: the last 0.4 seconds. It jumps around.
- **Short-term**: the last 3 seconds; the best one to ride while mixing.
- **Integrated**: the whole time since you pressed Reset, with quiet parts gated out. This is the number streaming services and broadcasters judge.
- **Loudness range**: how much the short-term level moves (EBU Tech 3342).
- **True peak**: the highest point between samples, by 4× oversampling.

## Worked example

A steady 1 kHz tone at −20 dBFS reads −23.0 LUFS on every meter, the BS.1770 check value, with a true peak of −20.0 dBTP and a loudness range of 0 LU. Played from a file, this page shows exactly that.

## FAQs

**Is the microphone reading how loud the room is?** No. It is the level of the signal, which depends on the microphone and its gain. For sound levels in the room, use a calibrated sound level meter.

**Why can't I share a tab's sound?** Only Chromium browsers include tab sound when sharing, and only for tabs (not every window).

**Is anything recorded?** No. Sound is measured as it arrives and thrown away.
