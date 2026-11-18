---
name: Key finder
num: 3020
shelf: everyday
code: T1023
section: dj-library
title: "Key finder: find the BPM and key of a song, with Camelot code and beat grid"
seoTitle: "Song key and BPM finder with Camelot code, free"
summary: "Open a song to see its tempo (BPM) with a beat grid, its key with the runner-up and a confidence, and the keys that mix well with it. Tap along to check the tempo, or let it listen through the microphone. Nothing is uploaded."
status: live
ads: false
order: 3020
icon: search
works: offline
updated: 2026-11-18
related: [track-analyser, harmonic-mixing, metronome, pitch-shifter, instrument-tuner]
sources:
  - "Tempo: spectral-flux onsets (Dixon 2006, DAFx-06) and an autocorrelation comb (Ellis 2007, J. New Music Research 36(1)), refined over the whole track. Key: chroma correlated with the Krumhansl-Kessler (Krumhansl 1990) and Temperley (Music Perception 17(1), 1999) key profiles. Wheel codes follow the widely published circle-of-fifths layout; fibub is not affiliated with their owners. Mix scores are fibub's own."
flow:
  - { icon: file, label: "Open song" }
  - { icon: wave, label: "Beat grid" }
  - { icon: search, label: "Key" }
  - { icon: check, label: "Mixes with" }
---

## What it does

Open one song and this tool finds its tempo in beats per minute (BPM) and its musical key. It draws the waveform with a line on every beat, so you can see whether the grid sits on the kicks, and lets you play from any point. The key comes with a confidence and the runner-up, which is often the relative major or minor. Below it is the list of keys that blend with it in a DJ mix.

No file? Press **Listen with the microphone** and play the music nearby; the key is estimated over 15 seconds. To check a whole folder at once, use the [[track-analyser]]; to move a song into a key that fits, use the [[pitch-shifter]].

## How to use it

1. Press **Open a track** and choose a song.
2. Read the tempo and key. If the tempo is half or twice what you feel, press **½ half** or **×2 double**.
3. Tap the waveform to hear any point; the lines should land on the beats.
4. Tap **Tap on each beat** along with the music to double-check the BPM.

## What each setting does

- **Key notation**: Camelot wheel codes (8A), Open Key codes (1m) or musical names (A minor).
- **Listen for** (More options, listen mode): how many seconds to listen, 5 to 60.
- **Tuning of A4**: for music tuned away from 440 Hz.

## Worked example

A 16-second test file of A minor chords (Am, Dm, E, F) with a click on every beat at 120 BPM reads **120.0 BPM** with 32 beat lines, and **8A · A minor** with C major (8B) as runner-up. The list of keys that mix well starts with 8A (same key), then 7A, 8B and 9A, then the diagonal step 9B and the +2 energy boost 10A. Press ×2 and it reads 240.0.

## FAQs

**Why does the key say "Runner-up: C major"?** A minor and C major use the same seven notes; only which note feels like home differs.

**Is the microphone sound recorded?** No. It is analysed in the page as it arrives and is never saved or sent.

**Why is the BPM half what I expected?** Some songs can be counted at two speeds. The half and double buttons switch.
