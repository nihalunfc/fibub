---
name: Audio repair
num: 3026
shelf: everyday
code: T1020
section: production
title: "Audio repair: remove background noise, hum and clicks from a recording"
seoTitle: "Audio repair: remove noise, hum and clicks, free online tool"
summary: "Clean up a recording in your browser: reduce hiss and fan noise from a noise sample, notch out 50 or 60 Hz mains hum, repair clicks and clipped peaks. Hear before and after, save WAV or MP3. Nothing is uploaded."
status: live
ads: false
order: 3026
icon: wave
works: offline
updated: 2026-11-18
related: [stem-splitter, audio-mastering, loudness-normaliser, audio-spectrum-analyser, audio-trimmer]
sources:
  - "Noise reduction: S. F. Boll, \"Suppression of acoustic noise in speech using spectral subtraction\", IEEE Trans. Acoustics, Speech and Signal Processing 27(2), 1979; over-subtraction and a gain floor after M. Berouti, R. Schwartz and J. Makhoul, ICASSP 1979."
  - "Hum notches: R. Bristow-Johnson, \"Cookbook formulae for audio EQ biquad filter coefficients\" (Audio EQ Cookbook). Mains frequency by country: IEC World Plugs (iec.ch), checked 2026-11-18."
  - "Clicks: autoregressive detection and interpolation as described in S. J. Godsill and P. J. W. Rayner, Digital Audio Restoration, Springer, 1998. The code is fibub's own."
flow:
  - { icon: file, label: "Open sound" }
  - { icon: wave, label: "Pick noise" }
  - { icon: sliders, label: "Repair" }
  - { icon: download, label: "Save" }
---

## What it does

Audio repair cleans the common faults in home, phone and live recordings: steady background noise (hiss, fans, air conditioning), mains hum (the low 50 or 60 Hz buzz from cables and power supplies), clicks and crackle (vinyl, bad cables, mouth clicks) and clipped peaks (flattened tops from recording too loud). It runs in your browser, so the recording is never uploaded. Before cleaning, cut the part you need with the [[audio-trimmer]]; afterwards, set the level with the [[loudness-normaliser]] or pull a song apart with the [[stem-splitter]].

## How to use it

1. Press **Open a recording**. The quietest half second is marked on the waveform as the noise sample.
2. If that part has music or speech in it, drag across a part with only background noise.
3. Tick the repairs you want and press **Repair**. **Cancel** stops it.
4. Press **Play** and switch between **Before** and **After**; the place in the recording is kept. Compare the two spectrograms.
5. Press **Save the repaired file**.

## What each setting does

- **Reduce noise by up to**: the most any sound is turned down. More is quieter but can sound hollow.
- **Noise smoothing**: averages the reduction over nearby moments so it does not twinkle ("musical noise").
- **Mains frequency**: found for you, or set 50 Hz or 60 Hz.
- **Hum harmonics**: how many overtones (100, 150, 200 Hz...) are notched as well.
- **Notch width**: narrow takes out less music; wide catches hum that wanders.
- **Click sensitivity**: how far a sample must stray from what the sound around it predicts to count as a click.
- **Repair clipped peaks**: redraws flattened tops as smooth curves, then turns the file down a little so they fit.

## Worked example

A 4-second test with a 1 kHz tone, light hiss and 50 Hz hum: the tool finds the hum at 50 Hz, the 8 notches take it down by more than 30 dB, the hiss drops by over 10 dB and the tone stays within 1 dB.

## FAQs

**Can it remove voices, music or traffic?** No. It removes steady noise and hum. Changing sounds are left alone.

**Why does speech sound watery after?** Too much reduction. Lower the amount or raise the smoothing.

**Is my recording uploaded?** No. Everything runs on your device.
