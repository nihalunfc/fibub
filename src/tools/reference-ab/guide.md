---
name: A/B compare
num: 3050
shelf: everyday
code: T1044
section: production
title: "A/B compare: compare your mix with reference tracks at matched loudness"
summary: "Load your mix and up to 3 reference tracks, match their loudness automatically (ITU-R BS.1770), switch between them in sync with keys 1 to 4, loop a part, run a blind test and compare spectra, LUFS, range, true peak, correlation and crest factor. Nothing is uploaded."
status: live
ads: false
order: 3050
icon: scale
works: offline
updated: 2026-11-18
related: [audio-mastering, stereo-phase-checker, loudness-normaliser, audio-spectrum-analyser]
sources:
  - "Loudness, loudness range and true peak by ITU-R BS.1770-4 and EBU Tech 3342 (gated integrated loudness, 4x oversampled true peak). Spectrum: Hann-windowed FFT averaged over the track. Crest factor is sample peak over RMS. Drawings are fibub's own."
flow:
  - { icon: file, label: "Open mix" }
  - { icon: file, label: "Add refs" }
  - { icon: scale, label: "Match" }
  - { icon: play, label: "Compare" }
---

## What it does

Comparing your mix with a finished record you like is the quickest way to hear what is missing. The catch is that the louder track almost always sounds better, so this tool measures every track by the ITU-R BS.1770 method and plays them all at the level of the quietest one. They play together in sync, so pressing 1, 2, 3 or 4 swaps what you hear at the same place in the song. It runs in your browser, so nothing is uploaded.

To fix what you find, go to [[audio-mastering]]; to check the stereo image of your mix, open it in the [[stereo-phase-checker]].

## How to use it

1. Press **Open your mix**, then **Add reference tracks** (1 to 3, from your own files).
2. Press **Play** and switch with the buttons or keys **1** to **4**.
3. To repeat a chorus, type its start and end and tick **Loop this part**.
4. For an honest opinion, press **Blind test**: the buttons are shuffled and named only by number until you press **Reveal**.

## What each number means

- **Loudness**: integrated loudness in LUFS.
- **Played at**: the level change used to match it to the quietest track.
- **Range**: loudness range in LU; small numbers mean a heavily compressed track.
- **True peak**: the highest point between samples, in dBTP.
- **Correlation**: +1 is mono, near 0 is very wide, below 0 cancels in mono.
- **Crest**: peak over average level in dB. Heavily limited masters have a lower crest factor than dynamic ones.
- **Average spectrum**: each track's tone over its whole length, shifted by its match, so a line that sits higher in the bass really has more bass.

## Worked example

Your mix is a steady 1 kHz test tone at −20 dBFS in both channels: it measures −20.0 LUFS, a true peak of −20.0 dBTP, correlation +1.00 and a crest factor of 3.0 dB (the value for any sine). A reference of the same tone at −10 dBFS measures −10.0 LUFS, so it plays 10.0 dB quieter and the two sound equally loud.

## FAQs

**Why match loudness?** Our ears hear a louder version as fuller and brighter. Matching takes level out of the decision.

**Is anything uploaded?** No. Your mix and the references stay on this device.
