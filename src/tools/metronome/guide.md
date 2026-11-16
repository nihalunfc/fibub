---
name: Metronome
num: 2244
shelf: everyday
code: T961
section: video-audio
title: "Metronome: online metronome with tap tempo, time signatures and click track download"
summary: "A steady online metronome from 20 to 300 BPM: tap tempo, beats per bar, eighths, triplets or sixteenths, an accent on beat one, and a click track to download as WAV."
status: live
ads: false
order: 2244
icon: clock
works: offline
updated: 2026-11-16
related: [instrument-tuner, tone-generator, voice-recorder]
sources:
  - "Clicks are timed on the Web Audio clock (W3C Web Audio API) with a look-ahead scheduler. Tempo word ranges are the common ones in music theory books, which differ by a few beats per minute. Click sounds are fibub's own."
flow:
  - { icon: sliders, label: "Set BPM" }
  - { icon: clock, label: "Start" }
  - { icon: download, label: "Click track" }
---

## What it does

A metronome clicks at a steady speed so you can practise in time. This one runs in your browser at 20 to 300 beats per minute (BPM). It times each click on the sound card's own clock, booked a little ahead, so it does not drift or stutter when the page is busy. Set how many beats are in a bar, add clicks between beats, mark beat one with a higher click, or tap a tempo from a song.

You can also download a click track: a WAV file of the clicks for any number of bars, to load into a recording app or play through a PA. Tune up first with the [[instrument-tuner]], and record yourself playing along with the [[voice-recorder]].

## How to use it

1. Set the speed with the slider, the number box, the −1 and +1 buttons or **Tap tempo** (tap at least twice in time).
2. Pick **Beats in a bar** and **Clicks per beat**.
3. Press **Start** (or the space bar). The dots show where you are in the bar.
4. For a file, set **Bars** and press **Download click track**.

## What each setting does

- **BPM**: beats per minute. The Italian word beside it is the usual name for that speed (Andante is a walking pace, Allegro is fast).
- **Beats in a bar**: 4 for most pop and rock (4/4), 3 for waltzes (3/4), 6 or 12 for 6/8 and 12/8 felt in eighths, 5 or 7 for odd metres.
- **Clicks per beat**: 2 adds eighth notes, 3 triplets and 4 sixteenths. The in-between clicks are quieter and lower.
- **Higher click on the first beat**: makes the start of each bar easy to hear.
- **Sound** and **Volume**: a beep or a woodblock, and how loud.

## Worked example

At 120 BPM each beat lasts 60 ÷ 120 = 0.5 s. In 3/4 with eighths, there is a click every 0.25 s and the pattern per bar is accent, sub, beat, sub, beat, sub. Sixteen bars of 4/4 at 100 BPM last 16 × 4 × 0.6 = 38.4 s, which as a 48 kHz mono WAV is about 3.7 MB.

## FAQs

**Is it accurate?** The clicks come from the audio clock, which is accurate to well under a millisecond. Bluetooth headphones add a fixed delay (often 100 to 300 ms), so for playing along use wired headphones or the speaker.

**Why did it slow down when I switched tabs?** Browsers slow timers in hidden tabs to save battery. Keep the tab in front, or use the downloaded click track.

**Does tap tempo average?** Yes, over your last eight taps. Stop for two seconds to start a fresh count.
