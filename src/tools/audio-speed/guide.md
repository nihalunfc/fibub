---
name: Audio speed
num: 2401
shelf: everyday
code: T971
section: video-audio
title: "Audio speed: speed up or slow down audio, with or without changing the pitch"
seoTitle: "Change audio speed, keep the pitch, free online tool"
seoDescription: "Speed up or slow down a song, podcast or voice note from 0.25× to 4×, keeping the pitch or not. Saves MP3 or WAV. Nothing is uploaded."
summary: "Speed up or slow down a song, podcast, lecture or voice note from 0.25× to 4×. Keep the pitch so voices sound natural, or let it change like a record. Nothing is uploaded."
status: live
ads: false
order: 2401
icon: sliders
works: offline
updated: 2026-11-16
related: [pitch-shifter, audio-trimmer, audio-converter, video-speed]
sources:
  - "Time-stretching by WSOLA (Verhelst and Roelands, 'An overlap-add technique based on waveform similarity', ICASSP 1993); resampling with a windowed-sinc filter. Code is fibub's own working, checked in tests/audio.mjs."
  - "MP3 saving with LAME via lamejs (LGPL-3.0, credited in NOTICE)."
flow:
  - { icon: file, label: "Open sound" }
  - { icon: sliders, label: "Set speed" }
  - { icon: play, label: "Listen" }
  - { icon: download, label: "Download" }
---

## What it does

This tool plays a sound file faster or slower and saves the result. Lectures and podcasts at 1.25× or 1.5× save time; music at 0.75× is easier to learn by ear; a dance or workout track can be nudged to the tempo you need. It works on MP3, WAV, M4A, OGG and FLAC files, and on the sound of a video, all inside your browser.

By default it keeps the pitch, so a voice at double speed still sounds like the same person, only quicker. Untick **Keep the pitch** and it works like a record or tape played at the wrong speed: faster is higher, slower is deeper. To change the key without changing the speed, use the [[pitch-shifter]]; to cut the result down, open it in the [[audio-trimmer]]; to speed up a whole video, use [[video-speed]].

## How to use it

1. Press **Open a sound file** (or drop one on the box).
2. Choose a **Speed**, or **Other…** to type any speed from 0.25 to 4.
3. Press **Play the result** to hear it, and **Play the original** to compare.
4. Choose **Save as** and press **Download**.

## What each setting does

- **Speed**: how many times faster it plays. 2× halves the length, 0.5× doubles it.
- **Keep the pitch**: on, the sound is stretched or squeezed in time only (WSOLA: short overlapping pieces are moved and lined up so the waves join smoothly). Off, it is simply resampled, so pitch moves with speed: 2× is one octave up, 1.25× is about 3.9 semitones up.
- **Save as**: MP3 at several bit rates, or WAV (16 or 24-bit). WAV keeps every detail; MP3 is about a tenth of the size.

## Worked example

A 30-minute lecture at 1.5× becomes 20 minutes, and the lecturer's voice keeps its pitch. A 440 Hz tone (the A above middle C) at 2× with the pitch kept is still 440 Hz, and half as long; with **Keep the pitch** off it becomes 880 Hz. The checks for this page measure exactly that with the pitch finder used by the [[instrument-tuner]].

## FAQs

**Does it sound as good as the original?** Speech sounds natural from about 0.5× to 2×. Music with strong chords can sound a little "phasey" at large changes, as with any time-stretcher; small changes (0.9× to 1.25×) are hard to notice.

**Is there a length limit?** Files up to 500 MB. A 3-minute song takes a second or two on a phone.

**Is my file uploaded?** No. It is read and processed on this device, and nothing is sent anywhere.
