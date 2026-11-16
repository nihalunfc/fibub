---
name: Video speed
num: 2405
shelf: everyday
code: T975
section: video-audio
title: "Video speed: speed up or slow down a video, time-lapse or slow motion"
seoTitle: "Change video speed: speed up or slow down, free online tool"
summary: "Make a video play faster (1.25× to 32×, time-lapse) or slower (down to 0.1×, slow motion). Voices can keep their pitch. Nothing is uploaded."
status: live
ads: false
order: 2405
icon: clock
works: offline
updated: 2026-11-16
related: [audio-speed, video-trimmer, video-compressor]
sources:
  - "Reading, writing and converting video with Mediabunny (MPL-2.0, credited in NOTICE), using the browser's own WebCodecs encoder and decoder (W3C). Nothing is uploaded."
  - "Time-stretching by WSOLA (Verhelst and Roelands, 'An overlap-add technique based on waveform similarity', ICASSP 1993); resampling with a windowed-sinc filter. Code is fibub's own working, checked in tests/audio.mjs."
flow:
  - { icon: file, label: "Open video" }
  - { icon: sliders, label: "Set speed" }
  - { icon: convert, label: "Make" }
  - { icon: download, label: "Download" }
---

## What it does

This tool changes how fast a video plays and saves it as a new file. Speed up a long recording into a time-lapse, make a tutorial snappier at 1.25×, or slow a sports clip down to 0.5× to see the movement. It runs in your browser with its built-in video encoder, so the video is not uploaded.

The new video keeps a steady frame rate: when speeding up, frames in between are skipped; when slowing down, each frame is shown for longer. The sound follows: by default voices keep their normal pitch, or they can go high and low like a record. For the sound alone, use [[audio-speed]]; to cut the clip first, use the [[video-trimmer]]; to shrink the result, the [[video-compressor]].

## How to use it

1. Press **Open a video**.
2. Choose a **Speed**, or **Other…** to type any speed from 0.1 to 32.
3. Tick or untick **Keep voices at their normal pitch** and **Remove the sound**.
4. Press **Change the speed**, check the result in the page, then **Download**.

## What each setting does

- **Speed**: 2× halves the length; 0.5× doubles it. 8× and 16× are for time-lapses.
- **Keep voices at their normal pitch**: the sound is stretched in time without changing pitch (WSOLA). Untick it for the classic sped-up or slowed-down sound.
- **Remove the sound**: makes a silent video. Below 0.25× and above 4× the sound is always left out, since it would only be a hum or noise.

## Worked example

A 60 s video at 30 frames per second, at 2×, becomes 30 s at 30 frames per second (every second frame is used). At 0.5× it becomes 120 s, each frame shown twice. The checks for this page speed up a 2 s test clip to 2× and check that the result is 1 s long.

## FAQs

**Is it smooth slow motion?** Slow motion repeats frames; it does not invent new ones. For smooth slow motion, record at a high frame rate (many phones do 120 or 240 fps) and slow that down.

**How long does it take?** About as long as playing the new video, often less.

**Is my video uploaded?** No. Everything happens on this device.
