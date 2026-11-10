---
name: Audio trimmer
num: 2040
shelf: everyday
code: T923
section: video-audio
title: "Audio trimmer: cut, fade and normalise an MP3 or WAV, save as WAV"
summary: "Open a sound file, drag or type the start and end, add a fade in or out, normalise the volume and save the part you keep as a WAV file. Nothing is uploaded."
status: live
ads: false
order: 2040
icon: scissors
works: offline
updated: 2026-11-10
related: [video-trimmer, audio-spectrum-analyser]
sources:
  - "WAV (RIFF WAVE, 16-bit PCM) file layout as published by Microsoft and IBM (1991); decoding by the browser's Web Audio API (W3C). Linear fades and peak normalisation are fibub's own working."
flow:
  - { icon: file, label: "Open sound" }
  - { icon: scissors, label: "Cut" }
  - { icon: sliders, label: "Fade" }
  - { icon: download, label: "Save WAV" }
---

## What it does

This tool keeps one part of a sound file and throws the rest away, such as a ringtone from a song or one answer from a voice memo. You can fade the start and end so the cut does not click, and normalise it so it plays loud without clipping. Your browser decodes the file on this device; nothing is uploaded.

The result is saved as a WAV file. MP3 export is not offered. To cut a video instead, use the [[video-trimmer]]; to see which pitches are in the sound, open it in the [[audio-spectrum-analyser]].

## How to use it

1. Press **Open a sound file** and choose an MP3, WAV, OGG, M4A or another file your browser can play.
2. Drag on the waveform to move the nearer edge of the blue part, or type the start and end in seconds.
3. Add fades or tick Normalise if you want them, then press **Play the part you keep** to listen.
4. Press **Download WAV**.

## What each setting does

- **Start and End**: the part to keep, in seconds. The end must be after the start.
- **Fade in**: the volume rises in a straight line from silence over this many seconds, so the first sample is silent.
- **Fade out**: the volume falls to silence over the last this many seconds.
- **Normalise**: turns the whole part up or down so its loudest point is −1 dB (89% of full scale), leaving room so players do not clip it.

A WAV file keeps the sample rate of the WAV you opened. Other formats are saved at 48,000 samples per second, and every channel (mono or stereo) is kept. The line under the boxes shows the WAV's size before you save.

## Worked example

A 2 second tone, mono, 44,100 samples per second. Keep 0.5 s to 1.5 s: that is 1.00 s, so the WAV holds 44,100 samples of 2 bytes, 88,200 bytes plus a 44-byte header (about 88 KB). With a 0.1 s fade in, the first 4,410 samples rise from silence, and the very first one is 0.

## FAQs

**Why is the WAV bigger than my MP3?** WAV is uncompressed: about 10 MB per stereo minute at 44,100 Hz.

**Can I keep two separate parts?** Not in one go: save one part, then open the file again for the next.
