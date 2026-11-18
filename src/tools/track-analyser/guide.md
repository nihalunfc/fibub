---
name: Track analyser
num: 3019
shelf: everyday
code: T1013
section: dj-library
title: "Track analyser: find the BPM, key and energy of many songs at once"
seoTitle: "BPM and key analyser for a whole music folder, free"
summary: "Choose a folder of tracks and get the BPM, musical key, Camelot code, energy (1 to 10), length and loudness of each one. Sort, find tracks that mix together, and save a CSV or playlist. Nothing is uploaded."
status: live
ads: false
order: 3019
icon: table
works: offline
updated: 2026-11-18
related: [bpm-key-finder, harmonic-mixing, music-library-cleaner, loudness-normaliser, audio-spectrum-analyser]
sources:
  - "Onsets: spectral flux (Dixon 2006, Onset detection revisited, DAFx-06). Tempo: autocorrelation with a comb over the beat's multiples (Ellis 2007, J. New Music Research 36(1)), refined over the whole track. Key: chroma correlated with the Krumhansl-Kessler profiles (Krumhansl 1990, Cognitive Foundations of Musical Pitch) and Temperley's profiles (Music Perception 17(1), 1999). Loudness: ITU-R BS.1770-4. The Camelot-style and Open Key-style codes are the widely published circle-of-fifths wheels; fibub is not affiliated with their owners. Energy 1-10 is fibub's own scale."
flow:
  - { icon: file, label: "Choose" }
  - { icon: chart, label: "Analyse" }
  - { icon: table, label: "Sort" }
  - { icon: download, label: "CSV or M3U" }
---

## What it does

DJs sort a crate by tempo and key before a gig. This tool reads a whole folder of tracks in your browser and lists each one's tempo in beats per minute (BPM), musical key, its code on the mixing wheel (8A is A minor, 8B is C major), an energy rating from 1 to 10, its length and its loudness in LUFS. The music never leaves your device; the work runs in the background, one track at a time.

Check a single track by ear, with its beat grid, in the [[bpm-key-finder]], then put the list in a good order with the [[harmonic-mixing|mix planner]].

## How to use it

1. Press **Choose tracks** or **Choose a folder** (or drop files on the box).
2. Wait while each track is read and analysed; rows appear as they finish.
3. Press a column name to sort. Choose a track under **Show tracks that mix with** to see only the keys that blend with it.
4. Download the list as a CSV or as an M3U8 playlist in the order shown.

## What each setting does

- **Key notation**: Camelot wheel codes (8A), Open Key codes (1m) or musical names (Am).
- **Show tracks that mix with**: keeps tracks in the same key, one step round the wheel, the relative major or minor, a diagonal step, or a +2 energy boost.
- **Tempo range** (More options): picks half or double tempo, so drum and bass reads 174, not 87.
- **Tuning of A4**: for music tuned away from 440 Hz.

Grey numbers mean low confidence: check them by ear.

## Worked example

Three test files: a 20-second click track at 128 BPM, chords in A minor (Am, Dm, E, F) and a C major scale. The table shows 128.0 BPM and 0:20 for the clicks, 8A for the chords and 8B for the scale. Choosing the A minor track under **Show tracks that mix with** lists the C major one as "Relative major".

## FAQs

**How is energy worked out?** It is fibub's own scale, not a standard: loudness counts most (45%), then how busy the track is (onsets per second, 25%), how bright it sounds (15%) and the tempo (15%).

**Why is the key sometimes off by one step?** Songs that change key or sit between relative keys can score close. The runner-up is in the CSV.
