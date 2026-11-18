---
name: Chord helper
num: 3022
shelf: everyday
code: T1034
section: music-theory
title: "Chord helper: find the chords and notes of any key"
seoTitle: "Chord helper: chords in a key, with piano and MIDI"
summary: "Pick a key and scale, or type your chords to find the key. See the scale on a piano, the chords it contains, common chord patterns for pop, house, hip-hop and more, and save a pattern as a MIDI file."
status: live
ads: false
order: 3022
icon: sliders
works: offline
updated: 2026-11-18
related: [chord-transposer, chord-diagram-maker, song-structure-planner, note-frequency-chart, interval-tools]
sources:
  - "Scales, chord formulas and Roman numerals are standard music theory, worked out by fibub's own code. Camelot codes follow the widely published mixing wheel (8B = C major, 8A = A minor); fibub is not affiliated with its owners. The genre patterns are common examples chosen by fibub, not rules (checked 2026-11-18)."
flow:
  - { icon: sliders, label: "Key" }
  - { icon: curve, label: "Chords" }
  - { icon: play, label: "Listen" }
  - { icon: download, label: "MIDI" }
---

## What it does

Every key is a set of notes, and the chords that sound right in it are built from those notes. This tool shows the notes of any key and scale on a piano keyboard, lists the chords that belong to it with their Roman numerals (I, ii, iii and so on), and lets you hear each one. It also shows the key's Camelot code, which DJs use to pick tracks that mix well.

If you only know your song's chords, switch to "Find the key from chords" and type them. Below the chords are common patterns for different styles, written in your key, which you can play and save as a MIDI file. Once you have a progression, change its key with the [[chord-transposer]] or learn the finger shapes with the [[chord-diagram-maker]].

## How to use it

1. Pick the key note and the scale, or choose "Find the key from chords" and type chords separated by spaces.
2. Look at the piano: dots mark the notes of the scale, and the large dot is the first note.
3. Tap a chord to hear it; the chord's notes are shaded on the piano.
4. Press Play or Download MIDI on any pattern.

## What each setting does

- **Scale**: major and natural minor give the usual chords. Modes (such as dorian) and harmonic or melodic minor also give chords. Pentatonic and blues scales have five or six notes, so they show notes only.
- **7th chords**: adds a fourth note to every chord.
- **Tempo and Volume** (More options): the speed of playback and of the MIDI file (one chord per bar), and how loud the notes are. The default is quiet.

## Worked example

Choose C major. The notes are C D E F G A B and the chords are C, Dm, Em, F, G, Am and B dim (I, ii, iii, IV, V, vi, vii°). The Pop pattern I–V–vi–IV becomes C – G – Am – F, and the Camelot code is 8B. Type "Am F C G" in Find mode and the best fit is A minor, whose Camelot code is 8A.

## FAQs

**Why does the key finder give several answers?** Many songs fit both a major key and its relative minor (C major and A minor share notes). The tool favours the key whose first and last chords match, and shows the next best choices.

**Are these patterns the only right ones?** No. They are common starting points. Artists change the order, add 7ths or borrow chords from other keys.

**Why does a mode show the code of another key?** Dorian on D uses the same notes as C major, so a DJ would file it under 8B.

**Does it send anything?** No. Everything runs on your device.
