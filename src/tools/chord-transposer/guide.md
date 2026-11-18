---
name: Chord transposer
num: 3024
shelf: everyday
code: T1045
section: music-theory
title: "Chord transposer: change the key of a song's chords"
seoTitle: "Chord transposer: move song chords to any key"
summary: "Paste a song with its chords, move it up or down by semitones or to a key you choose, and get a clean copy with the chords still above the right words. Includes a capo helper and sharps or flats choice."
status: live
ads: false
order: 3024
icon: sliders
works: offline
updated: 2026-11-18
related: [chord-scale-helper, chord-diagram-maker, bpm-shifter, pitch-shifter]
sources:
  - "Transposing is shifting every note name by the same number of semitones (12 semitones make an octave). Which keys are written with flats follows normal practice (F, B♭, E♭, A♭, D♭ major and their relative minors). The list of easy open shapes is a common beginner set chosen by fibub (checked 2026-11-18)."
flow:
  - { icon: pencil, label: "Paste" }
  - { icon: sliders, label: "Move" }
  - { icon: check, label: "Capo" }
  - { icon: download, label: "Save" }
---

## What it does

A song may be written in a key that is too high or low for the singer, or awkward for the instrument. The transposer moves every chord by the same number of semitones so the song fits, without touching the lyrics. It understands chords written above the words and chords written inside [brackets] in the words, and keeps each chord above the same word after the move.

It also finds the key from your chords, so you can say "move to G" instead of counting semitones, and it suggests a capo fret that turns hard shapes into easy open ones. To see how a chord is fingered, use the [[chord-diagram-maker]], and to see which chords belong to a key, use the [[chord-scale-helper]].

## How to use it

1. Paste your song. Put chords on their own line above the words, or in [brackets].
2. Use the − and + buttons, or choose a key under "Or move to the key of".
3. Check the result below. Press Copy, Print or Download .txt.
4. If you play guitar, look at the Capo helper and set a capo fret.

## What each setting does

- **Move by**: plus numbers go up, minus numbers go down. 12 is one octave and gives the same names.
- **Or move to the key of**: the starting key is guessed from the chords, and the semitone box is filled for you.
- **Sharps or flats** (More options): automatic follows the new key, so a song in B♭ gets B♭ and not A♯.
- **Original key** (More options): use it if the guessed key is wrong.
- **Capo fret**: the chord names change to the shapes you play with the capo on that fret.

## Worked example

"Am F C G" moved up 2 semitones becomes "Bm G D A". The chord F♯m7/C♯ moved down 1 becomes Fm7/C. Move "Bm G D A" with a capo on fret 7 and the shapes are Em C G D, all open chords.

## FAQs

**Does it change my lyrics?** No. Only whole words that are chord symbols on a chord line, or inside brackets, are changed.

**Why was a chord line not changed?** A line is read as chords only when every word on it is a chord. If it also holds words, put the chords in [brackets].

**Which key does it show for my song?** The key whose notes fit the most chords, and that starts or ends the song. Songs can sit between two keys, so check it.
