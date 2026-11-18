---
name: Track mastering
num: 3021
shelf: everyday
code: T1017
section: production
title: "Track mastering: master a song online to -14 LUFS for streaming or louder for clubs"
summary: "Master a finished mix in your browser: gentle tone EQ, glue compression, stereo width and a true-peak limiter that lands on −14, −16, −23 LUFS or a loud club level. Compare before and after at matched loudness, then save WAV or MP3. Nothing is uploaded."
status: live
ads: false
order: 3021
icon: sliders
works: offline
updated: 2026-11-18
related: [loudness-normaliser, audio-repair, reference-ab, stereo-phase-checker, live-lufs-meter]
sources:
  - "ITU-R BS.1770-4 (loudness and true peak) and EBU R 128 (−23 LUFS, −1 dBTP). Streaming and podcast targets as Spotify's and YouTube's help pages and AES TD1004 give them, checked 2026-11-18; services change them, so check the official source. The club level (about −9 to −8 LUFS) is common practice, not a published standard. EQ filters from Robert Bristow-Johnson's Audio EQ Cookbook."
flow:
  - { icon: file, label: "Open track" }
  - { icon: target, label: "Target" }
  - { icon: sliders, label: "Master" }
  - { icon: download, label: "Save" }
---

## What it does

Mastering is the last step before release: small tone fixes, a little compression to hold the mix together, and a limiter that makes it loud enough without clipping. This tool does those steps on your device and keeps going until the track measures the loudness you chose (within 0.1 LU, by the ITU-R BS.1770 method) with its true peak at or under the ceiling. Unreleased music never leaves your computer.

To check the stereo image first, use the [[stereo-phase-checker]]; to judge the result against a record you like, load both into [[reference-ab]].

## How to use it

1. Press **Open a track** and choose your final mix (WAV or FLAC is best).
2. Pick where it is going, adjust the tone or width if you want, and press **Master it**.
3. Read the before and after numbers, then listen with **Original** and **Master**. Both play at the same loudness, so the louder one cannot win just by being louder.
4. Choose a format and press **Download the master**.

## What each setting does

- **Target loudness**: the integrated loudness the finished track will measure.
- **Limiter ceiling**: the highest true peak allowed, measured between samples by 4× oversampling.
- **Bass, Middle, Treble**: a low shelf, a bell and a high shelf, ±6 dB.
- **Stereo width**: 100% leaves it alone; less narrows it, more widens the sides.
- **Glue compression**: a slow, gentle 2:1 compressor on both channels together.
- **WAV 16-bit** adds TPDF dither, a very quiet noise that keeps fades smooth.

## Worked example

A 6-second loop of a kick drum and two quiet tones measures −19.5 LUFS with a true peak of −4.3 dBTP. With the streaming preset the compressor takes up to 2.5 dB off the kicks, the limiter gets 8.4 dB more level and presses up to 4.6 dB, and the master measures −14.0 LUFS at −1.0 dBTP. The club preset (−9 LUFS) needs 11 dB of limiting, so the tool warns you to listen for pumping.

## FAQs

**Is it as good as a mastering engineer?** No. It suits demos, uploads and quick releases; an engineer hears problems a meter cannot.

**Why does my club master sound quieter on Spotify?** Streaming services turn loud tracks down to about −14 LUFS, so the extra limiting only costs punch there.

**Is anything uploaded?** No. All processing runs in your browser.
