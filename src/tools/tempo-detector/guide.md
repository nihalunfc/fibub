---
name: Rhythm and tempo detector
num: 423
shelf: science
section: musicology-and-music-acoustics
title: "Tempo detector: BPM, beat times and onsets from an audio file, with tempo candidates"
summary: "Open a recording and get its tempo in beats per minute with a list of other candidate tempos, the time of every beat and every onset (CSV), and charts of the onset strength and its autocorrelation. Works offline; the sound never leaves your device."
status: live
ads: false
order: 423
icon: clock
works: offline
updated: 2026-11-09
related: [harmonics-analyser, tuning-calculator, period-finder]
sources:
  - "Onset strength by spectral flux of log-compressed magnitude spectra (Bello et al. 2005, Böck and Widmer 2013), tempo by autocorrelation of the onset strength, and beat tracking by dynamic programming (D. P. W. Ellis, 2007, Journal of New Music Research 36, 51-60): published methods, implemented by fibub."
  - "Checked against an independent NumPy implementation on two noisy click tracks (44.1 and 22.05 kHz): onset envelope and autocorrelation to 10⁻¹³, the same onset and beat times. Click tracks at 60, 90, 97, 104, 120, 145.5, 174 and 200 BPM give back their tempo within 0.1 BPM and every click within 10 ms."
  - "The example is a click pattern made by the page, not a recording."
flow:
  - { icon: file, label: "Sound" }
  - { icon: chart, label: "Onsets" }
  - { icon: clock, label: "Tempo" }
  - { icon: table, label: "Beats" }
---

## What it does

Musicologists, dancers, DJs, music teachers and anyone transcribing music often need the tempo of a recording and the times of its beats. This detector works in three steps:

1. **Onsets**: the sound is cut into short overlapping frames (about 46 ms, every 11.6 ms at 44.1 kHz). For each frame the page measures how much the spectrum rises compared with the frame before (the **spectral flux**). Sudden rises are notes and drum hits. The peaks of this **onset strength** are listed as onsets with their times.
2. **Tempo**: the onset strength is compared with shifted copies of itself (**autocorrelation**). A steady pulse makes it match itself every beat, so the peaks of the autocorrelation are **tempo candidates**. The strongest one inside your tempo range is the detected tempo; if a pulse twice as fast is nearly as strong (95 %), that faster pulse is taken as the beat.
3. **Beats**: beat times are placed by dynamic programming, which follows strong onsets while keeping the gaps close to the beat period, so slight tempo changes are followed.

## How to use it

1. Press **Open an audio file** (WAV, MP3, OGG, FLAC or M4A). Up to 10 minutes are analysed; use **Analyse from** and **Length** to pick a section.
2. Check the **tempo range**. Music is often heard at one of two tempos a factor of 2 apart; if the result is half or double what you tap, narrow the range or press **Use** on another candidate.
3. Choose the **onset sensitivity**: high lists softer notes, low only strong ones.
4. Download the onsets or beat times as CSV, or the report as an image, PDF or Word file.

## Worked example

Press **Use the example**: a made-up 16-second click pattern at 104 BPM, with every fourth beat accented and a soft click between beats. The page reports **Tempo 104.0 BPM**, 28 beats placed, a mean beat-to-beat time of 577 ms and a spread of 6 ms (a perfectly steady pulse). It finds 55 onsets: 28 beats and 27 off-beats. The candidate list also shows 69.3 BPM (2/3 of the tempo); the off-beat pulse at 208 BPM lies outside the 60 to 200 BPM range. Raise the fastest tempo to 220 and the page picks the eighth-note pulse, 207.9 BPM, which is as strong as the beat; press **Use** on 104.0 to go back. This is the usual half-or-double choice.

## Tips

- Music with clear attacks (percussion, plucked strings, piano) gives the cleanest results. Smooth legato music with few attacks may need high sensitivity and a longer section.
- Tempo changes: look at the spread of beat gaps and the beat CSV; analyse sections separately for music that speeds up or slows down.
- The beat times line up with the start of each sound to within about one frame step (12 ms at 44.1 kHz).

## FAQ

**Why is the tempo double or half what I hear?** Both are real pulses in the music; which one people tap depends on style and taste. Narrow the range or pick the candidate you hear.

**Does it work on a live microphone?** No, it analyses files. Record with any app, then open the file.

**Is my recording uploaded?** No. The file is decoded and analysed in your browser and never sent anywhere.
