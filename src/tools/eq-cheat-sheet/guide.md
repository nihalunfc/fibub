---
name: EQ guide
num: 3024
shelf: everyday
code: T1037
section: production
title: "EQ guide: frequency chart with instrument ranges, EQ bands and what to cut or boost"
summary: "A frequency chart from 20 Hz to 20 kHz showing EQ bands and where common instruments sit, with plain advice for each band, note names and a test tone."
status: live
ads: false
order: 3024
icon: curve
works: offline
updated: 2026-11-18
related: [audio-spectrum-analyser, note-frequency-chart, audio-mastering, tone-generator]
sources:
  - "Note names and frequencies use equal temperament with A4 = 440 Hz: f = 440 x 2^((n-69)/12), n the MIDI note number (MIDI Manufacturers Association). Instrument ranges for piano (A0 to C8), bass guitar (E1 to G4), guitar (E2 to E6) and voice (E2 to C6) are standard note ranges converted to Hz. Kick, snare, hi-hat and cymbal ranges are rough typical ranges, not measurements. Band edges follow common mixing practice and different books use slightly different edges. Harmonics are drawn up to a simple fixed limit per instrument. Checked 2026-11-18."
flow:
  - { icon: pointer, label: "Tap chart" }
  - { icon: curve, label: "Read" }
  - { icon: wave, label: "Hear it" }
---

## What it does

This is a map of the sound spectrum from 20 Hz to 20 kHz on a log axis, the way we hear pitch: each octave gets the same width. Seven coloured bands (sub, bass, low mids, mids, upper mids, presence, air) are marked, and bars show where common instruments sit: the solid part is the lowest and highest note it plays (the fundamentals), the lighter part is the overtones (harmonics) above it.

Tap the chart to choose a frequency. You get the nearest note name, the band it is in and a few common moves in plain words, such as cutting mud or adding air. They are starting points, trust your ears. To see a real recording on the same scale, use the [[audio-spectrum-analyser]], and to hear a pure tone at any pitch use the [[tone-generator]].

## How to use it

1. Tap or click anywhere on the chart, or type a frequency in hertz.
2. Read the band, the note and the suggestions below the chart.
3. Press **Play tone** to hear that frequency. It starts quiet; use the volume slider.
4. Open **More options** to see where each instrument range comes from.

## What each part does

- **Bands**: groups of frequencies with a common character. Edges vary between books, so treat them as guides.
- **Solid bars**: note range of an instrument, or a rough typical range for drums.
- **Light bars**: harmonics, which give an instrument its tone, up to a limit this page chooses.
- **Nearest note**: from f = 440 x 2^((n-69)/12), with the offset in cents.

## Worked example

Tap 440 Hz. The note is A4 with 0 cents, the band is Low mids and the page lists several instruments, including vocals, guitar and piano, as reaching it. Tap near 250 Hz and the advice is about low-mid mud: a gentle dip around 250 to 400 Hz often clears a crowded mix.

## FAQs

**Are the instrument ranges exact?** Piano, bass, guitar and voice ranges are standard note ranges converted to hertz. Drum ranges are rough typical values and change with the drum, tuning and mic.

**Which cut or boost should I use?** None is right every time. Make small moves, compare at the same volume, and trust your ears.

**Why does the tone sound quiet or missing at 20 to 40 Hz?** Many phone and laptop speakers cannot play it. Try headphones, at low volume.

**Is anything uploaded?** No, it all runs in your browser.
