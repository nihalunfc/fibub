---
name: Sample chopper
num: 3028
shelf: everyday
code: T1022
section: production
title: "Sample chopper: slice a loop or break into pads and WAV files"
seoTitle: "Sample chopper: slice audio into WAV samples, free"
summary: "Open a loop, break or vocal and cut it into slices by its hits, a beat grid or by hand. Play the slices on 16 pads, then save every slice as a WAV in a ZIP, a new WAV of slices in any order, or a MIDI file for a sampler. Nothing is uploaded."
status: live
ads: false
order: 3028
icon: scissors
works: offline
updated: 2026-11-18
related: [drum-sequencer, stem-splitter, audio-trimmer, bpm-key-finder, pitch-shifter]
sources:
  - "Hit detection: spectral-flux onsets (Dixon 2006, \"Onset detection revisited\", DAFx-06) from fibub's music kit, then moved to the first sample of each attack. Tempo for the grid from the same kit (autocorrelation comb, Ellis 2007). MIDI files follow the Standard MIDI File 1.0 format (MIDI Association). Drawings are fibub's own."
flow:
  - { icon: file, label: "Open sound" }
  - { icon: scissors, label: "Slice" }
  - { icon: play, label: "Play pads" }
  - { icon: zip, label: "Save WAVs" }
---

## What it does

This tool cuts one sound into short pieces, the way producers chop a drum break or a vocal phrase: at its hits, on a beat grid, or by hand. Each slice goes on a pad. Save every slice as a WAV in one ZIP, glue chosen slices into a new WAV in any order, or save a MIDI file that plays them from a sampler.

To trim the sound first, use the [[audio-trimmer]]; to find its tempo before you chop, use the [[bpm-key-finder]]; to move a slice into another key, use the [[pitch-shifter]].

## How to use it

1. Press **Open a sound** and choose a loop, break or phrase.
2. Pick how to **Cut by** and check the markers. Drag any marker to fine-tune it.
3. Tap the pads, or press 1 2 3 4, Q W E R, A S D F, Z X C V.
4. Press **Save all slices (ZIP)**, or type an order and press **Save joined WAV**.

## What each setting does

- **Hits**: a slice at each new hit. **Sensitivity** 1 to 10; higher finds quieter hits.
- **Beat grid**: a slice every bar, beat, 1/8 or 1/16 at the **Tempo**, which is filled in from the sound.
- **By hand**: tap the waveform to add a marker. Sound before the first marker is left out.
- **Fade in / Fade out**: a short fade at each end so the slice starts and stops without a click.
- **Normalise** raises the slice so its loudest point is −0.3 dB; **Reverse** plays it backwards.
- **Slices to join**: pad numbers in order, such as `1 2 1 3`; **Pads add to the order** builds it by tapping.
- **MIDI: slice 1 on** (More options): slice 1's note; each next slice is a semitone higher.

## Worked example

A 3.5-second test sound with seven short hits at 0.10, 0.45, 0.80, 1.30, 1.55, 2.20 and 2.90 s gives **7 slices**, each within a millisecond of its hit; the ZIP holds `clicks_01.wav` to `clicks_07.wav`. On a 120 BPM grid with a slice per beat it gives 7 slices half a second apart.

## FAQs

**Why does a slice click?** It stops partway through a wave. Raise the fade out to 10 to 20 ms.

**Which note is C1?** Here middle C (MIDI note 60) is C4, so C1 is note 24. Some samplers name octaves differently; pick C2 or C3 if your first pad is there.

**Is my sound uploaded?** No. It is opened, sliced and saved in this page.
