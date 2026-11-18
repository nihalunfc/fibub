---
name: Sample chopper
num: 3022
shelf: everyday
code: T1022
section: production
title: "Sample chopper: slice a loop or break into pads and WAV files"
seoTitle: "Sample chopper: slice audio into WAV samples, free"
summary: "Open a loop, break or vocal and cut it into slices by its hits, a beat grid or by hand. Play the slices on 16 pads, then save every slice as a WAV in a ZIP, a new WAV of slices in any order, or a MIDI file for a sampler. Nothing is uploaded."
status: live
ads: false
order: 3022
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

This tool cuts one sound into short pieces, the way producers chop a drum break or a vocal phrase. It finds the hits for you, lays a beat grid over the sound, or lets you place every cut by hand. Each slice goes on a pad you can tap, and you can save every slice as its own WAV file in one ZIP, glue chosen slices into a new WAV in any order, or save a MIDI file that plays the slices back from a sampler.

To trim the sound first, use the [[audio-trimmer]]; to find its tempo and key before you chop, use the [[bpm-key-finder]]; to move a slice into another key, use the [[pitch-shifter]].

## How to use it

1. Press **Open a sound** and choose a loop, break or phrase.
2. Pick how to **Cut by**, and look at the markers on the waveform. Drag any marker to fine-tune it.
3. Tap the pads (or press 1 2 3 4, Q W E R, A S D F, Z X C V) to hear the slices.
4. Press **Save all slices (ZIP)**, or type an order and press **Save joined WAV**.

## What each setting does

- **Hits (transients)**: a slice starts at each new hit. **Sensitivity** 1 to 10; higher finds quieter hits.
- **Beat grid**: a slice every bar, beat, 1/8 or 1/16 at the **Tempo** (filled in from the sound). **Grid starts at** (More options) moves the grid.
- **By hand**: tap the waveform to add a marker; **Delete marker** removes the selected one.
- **Zoom** and **Scroll**: look closer at the waveform to place markers exactly.
- **Fade in / Fade out**: a short fade at each end of the slice so it starts and stops without a click.
- **Normalise**: raises the slice so its loudest point is −0.3 dB. **Reverse** plays it backwards.
- **Slices to join**: pad numbers in the order you want, such as `1 2 1 3`; tick **Pads add to the order** to build it by tapping.
- **MIDI: slice 1 on**: the note for slice 1; each next slice is a semitone higher.

Sound before the first marker is left out of the slices.

## Worked example

A 3.5-second test sound with seven short hits at 0.10, 0.45, 0.80, 1.30, 1.55, 2.20 and 2.90 s gives **7 slices**, each starting within a millisecond of its hit. The ZIP holds `clicks_01.wav` to `clicks_07.wav`. On a beat grid at 120 BPM with one slice per beat, the same sound gives 7 slices half a second apart.

## FAQs

**Why does a slice click?** It starts or ends partway through a wave. Raise the fade in to 2 to 5 ms or the fade out to 10 to 20 ms.

**Which note is C1?** This tool counts middle C (MIDI note 60) as C4, so C1 is note 24. Some samplers name notes an octave differently; pick C2 or C3 if your first pad is there.

**Is my sound uploaded?** No. It is opened, sliced and saved in this page.
