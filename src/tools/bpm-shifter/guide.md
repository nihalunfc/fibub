---
name: Tempo matcher
num: 3023
shelf: everyday
code: T1025
section: dj-mixing
title: "Tempo matcher: pitch fader percent to match two BPMs"
seoTitle: "Tempo matcher: pitch fader % to match two BPMs"
summary: "Tap the beat or type two BPM values and see the pitch fader percent that matches them, which fader ranges allow it, the key you will hear without key lock, and half-time or double-time matches. Nothing is uploaded."
status: live
ads: false
order: 3023
icon: sliders
works: offline
updated: 2026-11-18
related: [harmonic-mixing, phrase-counter, bpm-key-finder, audio-speed, pitch-shifter, delay-reverb-calculator]
sources:
  - "Percent change = new BPM / old BPM - 1. Pitch change without key lock = 12 x log2(new BPM / old BPM) semitones, because one octave is a doubling of speed and has 12 semitones. Keys and the wheel codes (8A = A minor) follow the common circle-of-fifths mixing wheel; fibub is not affiliated with the owners of the Camelot or Open Key names. The compatibility wording is fibub's own (checked 2026-11-18). Fader ranges differ between players, so check yours."
flow:
  - { icon: pointer, label: "Tap or type" }
  - { icon: sliders, label: "Match" }
  - { icon: check, label: "Key check" }
---

## What it does

To beat-match, you speed one track up or down until its BPM equals the other's. This tool tells you how far to move the pitch fader, whether your player's fader range is wide enough, and, if you give the keys, what key the track will be in afterwards and whether it still blends with the track that is playing.

It also handles half time and double time, so an 87 BPM track can sit with a 174 BPM one, and prints a table of BPM for every fader step. To get the BPM and key of your files first, use the [[bpm-key-finder]]; to plan a whole running order, use the [[harmonic-mixing]] planner.

## How to use it

1. Tap the **Tap** button along with a song, then press **Use as track A** or **Use as track B**. Or type the BPM values.
2. Read the fader percent. A plus moves the fader towards faster.
3. Optional: type each track's key in any notation (8A, 1m, Am, A minor).
4. Check the half-time and double-time rows.
5. Open **More options** for the BPM table.

## What each setting does

- **Tap**: averages your last 8 taps; a pause over 2 seconds starts again. Stability is how even your taps were.
- **Fader ranges**: the common ±6, ±8, ±10, ±16 and ±50% ranges, listed as holding the change or too small.
- **Semitones**: the pitch change if key lock is off.
- **Key and compatible hint**: key lock off means the key moves to the nearest semitone; the tool also shows how many cents off it is.

## Worked example

Track A is 124 BPM, track B is 128 BPM. Fader: +3.23%, which fits every range from ±6% up. Without key lock the pitch rises 0.55 semitones. A track in 8A is then heard close to 8A pitched up a semitone, which is 3A, so the hint compares 3A with track B's key.

## FAQs

**Does the key move if key lock is on?** No. With key lock the key stays as it was; the numbers here describe a player without it.

**Why does a small change still move the key?** The pitch changes by 12 × log2 of the speed ratio, so even 3% is about half a semitone, enough to sound off against the other track.

**What if two tracks are far apart?** Look at the half-time and double-time rows; one often needs almost no change.
