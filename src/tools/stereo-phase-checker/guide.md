---
name: Phase checker
num: 3049
shelf: everyday
code: T1043
section: production
title: "Phase checker: stereo phase correlation and mono compatibility check"
summary: "Check a mix for phase problems: correlation over time, a goniometer, correlation by band, how much quieter it gets in mono, left/right balance and flagged out-of-phase moments. Listen in stereo, mono or side only. Nothing is uploaded."
status: live
ads: false
order: 3049
icon: wave
works: offline
updated: 2026-11-18
related: [audio-mastering, reference-ab, audio-spectrum-analyser]
sources:
  - "Correlation is the Pearson correlation of left and right in 100 ms windows. Mono loss compares ITU-R BS.1770-4 integrated loudness of the stereo mix and its mono fold-down, (L+R)/2. Bands split with second-order Butterworth filters (Audio EQ Cookbook) at 250 Hz and 4 kHz. Drawings are fibub's own."
flow:
  - { icon: file, label: "Open mix" }
  - { icon: chart, label: "Check" }
  - { icon: play, label: "Listen" }
---

## What it does

Stereo tricks such as wideners, flipped cables or two microphones at different distances can make parts of a mix cancel when left and right are added together. That happens more than you might think: phone speakers, club sound systems with mono subs and some radios play mono. This tool shows where a mix is at risk and lets you hear what drops out. It runs in your browser, so your mix is never uploaded.

Before mastering, fix what it finds, then go on to [[audio-mastering]]; to see which frequencies are involved, use the [[audio-spectrum-analyser]].

## How to use it

1. Press **Open a mix** and choose a stereo file.
2. Read the summary, the correlation graph and the flagged moments.
3. Press a flagged time to jump there, and switch between **Stereo**, **Mono** and **Side only** while it plays.

## What each reading means

- **Correlation**: +1 means both speakers get the same sound (mono), 0 means unrelated sound (very wide), and −1 means one side is flipped. Most mixes sit between +0.2 and +0.8.
- **Mono loss**: how many dB quieter the mix gets in mono, by BS.1770 loudness. "Silent in mono" means it cancels completely.
- **Balance**: which side is louder, and by how much.
- **Side vs mid**: the level of the difference signal against the sum.
- **Goniometer**: mid up, side across. A tall shape is safe; a flat shape cancels.
- **By band**: correlation below 250 Hz, from 250 Hz to 4 kHz and above 4 kHz. Bass should be close to +1.

## Worked example

A 4-second test tone is the same in both channels except from 2 to 3 seconds, where the right side is flipped. The whole-track correlation is (3 − 1) ÷ 4 = +0.50, the flagged list shows 0:02.0 to 0:03.0 at −1.00, and side vs mid is 10 log(1/3) = −4.8 dB. With the right channel flipped for the whole file, it reads −1.00 and "silent in mono".

## FAQs

**Is a negative correlation always wrong?** Short dips on reverb tails or wide effects can be fine. Long stretches, or negative bass, usually mean a polarity or timing problem.

**Does it work on mono files?** A mono file cannot cancel, so it says so.
