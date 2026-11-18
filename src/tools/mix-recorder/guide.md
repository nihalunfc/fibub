---
name: Mix recorder
num: 3028
shelf: everyday
code: T1021
section: dj-mixing
title: "Mix recorder: record a DJ mix online and make a tracklist with timestamps and a CUE sheet"
seoTitle: "DJ mix recorder with tracklist and CUE sheet, free"
summary: "Record your DJ set from a mixer, audio interface or browser tab, press New track as each song comes in, and save WAV plus a tracklist as text, CUE sheet or CSV. Or mark the tracks in a mix you already have. Nothing is uploaded."
status: live
ads: false
order: 3028
icon: mic
works: offline
updated: 2026-11-18
related: [crowd-energy-log, dj-set-planner, voice-recorder, loudness-normaliser, audio-trimmer]
sources:
  - "Recording by the browser's MediaStream Recording, Media Capture and Screen Capture APIs (W3C); WAV layout as published by Microsoft and IBM (1991); CUE sheet INDEX times in minutes:seconds:frames at 75 frames per second, as in the CD audio (Red Book) frame rate used by CDRWIN cue sheets."
flow:
  - { icon: mic, label: "Record" }
  - { icon: flag, label: "New track" }
  - { icon: table, label: "Tracklist" }
  - { icon: download, label: "Save" }
---

## What it does

Plug your mixer's record out into your computer, press record and play your set. Each time you bring in a new track, press **New track** (or the N key) and the time is stamped; type the artist and title first if you like. At the end you get the mix as a WAV, a smaller compressed file, and a tracklist ready for a mix upload, a CUE sheet or a spreadsheet. The recording stays in this tab and is never uploaded. To bring the finished mix to a streaming level, open the WAV in the [[loudness-normaliser]]; to cut the silence at the start, use the [[audio-trimmer]].

## How to use it

1. Choose **Record from**: an audio input (pick the interface or mixer) or a browser tab's sound (choose the tab and tick "Share tab audio").
2. Press **Start recording**. Watch the meter: if it turns red, turn the level down.
3. Press **New track** as each track starts. Fix any time or name in the list later.
4. Press **Stop**, then download the WAV, the smaller file and the tracklist.

Already have a recording? Choose **Tracklist for a recording I have**, open it, play it and press **New track** at each change, or type the times.

## What each setting does

- **Keep a WAV copy**: 16-bit stereo, about 11 MB a minute at 48 kHz. It is kept in 10-second blocks so long sets do not fill the page's memory; untick it on a phone for sets over an hour.
- **Text**: lines like `00:00 Artist – Title` (hours added once the mix passes an hour).
- **CUE sheet**: one TRACK per mark with `INDEX 01 mm:ss:ff` (75 frames a second); players and burners split the mix with it.
- **CSV**: number, start, seconds, artist, title and length.

## Worked example

You mark "Kai & Lu – Night Drive" at the start and "Ona – Static" at 3:32.4. The text reads `00:00 Kai & Lu – Night Drive` and `03:32 Ona – Static`; the CUE sheet gives track 2 `INDEX 01 03:32:30`, because 0.4 s is 30 of 75 frames.

## FAQs

**Why are echo and noise reduction off?** They are made for voices and would pump and thin out music.

**Can I lock my phone while recording?** Keep the screen on: the page asks the browser to stay awake, but phones may stop recording in the background.
