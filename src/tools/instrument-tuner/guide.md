---
name: Instrument tuner
num: 2245
shelf: everyday
code: T962
section: video-audio
title: "Instrument tuner: online guitar, bass, ukulele and violin tuner using your microphone"
summary: "Tune a guitar, bass, ukulele, violin or any instrument with your microphone: it shows the nearest note or string and how many cents sharp or flat, with A4 from 400 to 480 Hz. The sound never leaves your device."
status: live
ads: false
order: 2245
icon: mic
works: offline
updated: 2026-11-16
related: [metronome, tone-generator, audio-spectrum-analyser]
sources:
  - "Pitch found with the YIN method (A. de Cheveigné and H. Kawahara, J. Acoust. Soc. Am. 111, 1917, 2002). Equal temperament with A4 = 440 Hz (ISO 16:1975). String sets are the standard tunings. Code is fibub's own."
flow:
  - { icon: mic, label: "Listen" }
  - { icon: target, label: "Note" }
  - { icon: check, label: "In tune" }
---

## What it does

This tuner listens through your phone or computer microphone, works out the pitch of the note you play and shows the nearest note with a needle: centred and green means in tune, left means flat (too low) and right means sharp (too high). Choose your instrument to see its strings, so the tuner names the string you are nearest and measures against it. It works for voice and any instrument in chromatic mode.

Everything is worked out on your device about 15 times a second. Nothing is recorded or sent, and once the page is open it works with no internet. When you are in tune, practise in time with the [[metronome]]; to hear a long reference note, use the [[tone-generator]].

## How to use it

1. Choose your **Instrument** (or "Any note").
2. Press **Start listening** and allow the microphone.
3. Play one string at a time and let it ring. Turn the peg until the needle sits in the middle and it says "in tune".
4. Press a string button to hear its note if you want to tune by ear.

## What each setting does

- **Instrument**: Guitar E2 A2 D3 G3 B3 E4, bass E1 A1 D2 G2, ukulele G4 C4 E4 A4, violin G3 D4 A4 E5, cello C2 G2 D3 A3 (viola is the same notes an octave up). In chromatic mode it shows whichever note is nearest.
- **A4 is**: the reference pitch. 440 Hz is the standard; some orchestras use 442 or 443, and baroque groups 415.
- **Cents**: a hundredth of a semitone. Within 5 cents counts as in tune; most people cannot hear 5 cents.

## Worked example

With A4 = 440 Hz, the low E string of a guitar should be 82.41 Hz. If the tuner reads 80.0 Hz, that is 1200 × log2(80.0 ÷ 82.41) = −51 cents, half a semitone flat, so the needle sits hard left and says "too low: tighten". At 82.6 Hz it reads +4 cents: in tune. The test for this page plays a 445 Hz tone and checks that it reads A, +20 cents.

## FAQs

**It jumps between notes.** Play one string at a time, mute the others and keep the phone close. Very low bass notes need a moment to settle.

**Why does my guitar read an octave off in chromatic mode?** Some strings sound a strong overtone. Choosing Guitar makes the tuner pick the right string.

**Does it record me?** No. It only looks at the last tenth of a second of sound to find the pitch and keeps nothing.
