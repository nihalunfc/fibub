---
name: Note chart
num: 3023
shelf: everyday
code: T1038
section: music-theory
title: "Note chart: note names, MIDI numbers and frequencies in Hz"
seoTitle: "Note frequency chart: every note in Hz and MIDI number"
summary: "A table of every note from C-1 to G9 with its MIDI number, frequency in Hz, period, wavelength in air and piano key. Search by name, MIDI number or Hz, tap to hear a note, and download it as a CSV."
status: live
ads: false
order: 3023
icon: sliders
works: offline
updated: 2026-11-18
related: [instrument-tuner, eq-cheat-sheet, tuning-calculator, tone-generator, chord-scale-helper]
sources:
  - "Equal temperament: each semitone is a ratio of 2^(1/12), with A4 = 440 Hz and MIDI note 69 as the usual reference. Piano key 1 is A0 (MIDI 21) and key 88 is C8 (MIDI 108). Wavelength = speed of sound / frequency, using 343 m/s, the commonly quoted value for dry air at 20 °C (checked 2026-11-18; it changes with temperature, so check the official source for precise work)."
flow:
  - { icon: sliders, label: "A4 pitch" }
  - { icon: curve, label: "Search" }
  - { icon: play, label: "Listen" }
  - { icon: download, label: "CSV" }
---

## What it does

Music software, synthesizers and test equipment all talk about the same notes in different ways: a name such as A4, a MIDI number such as 69, or a frequency such as 440 Hz. This chart puts them side by side for every note from C-1 (8.18 Hz) to G9 (12 544 Hz), together with the length of one cycle in milliseconds, the wavelength of the sound in air and the number of the key on an 88-key piano.

Type a name, a MIDI number or a frequency in the search box and the nearest note is found and marked. To hear a note, tap its row. For tuning by ear, use the [[instrument-tuner]], and to play a steady tone at any pitch, use the [[tone-generator]].

## How to use it

1. Type into the search box: A4, C#3, 60 or 261.6 Hz.
2. Read the result line, which also shows how many cents (hundredths of a semitone) a frequency is above or below the note.
3. Tap any row to hear it, or open More options to shade the notes of a scale.
4. Press Download CSV to save the whole table.

## What each setting does

- **A4 pitch**: the frequency of A4, from 415 Hz (many baroque groups) to 466 Hz. 440 Hz is the usual standard; some orchestras use 442. Every other note moves with it.
- **Octave numbers**: in the scientific style middle C is C4. Many MIDI programs call it C3, so the same key gets a different number. The sound does not change.
- **Highlight a scale** (More options): shades every row whose note belongs to the scale you choose.

## Worked example

At A4 = 440 Hz, C4 (middle C) is MIDI 60, 261.63 Hz and piano key 40. One cycle takes 3.822 ms and the wave is 1.311 m long in 20 °C air. Searching "261.6 Hz" gives C4 and says it is 0.2 cents flat. Change A4 to 442 and C4 becomes 262.81 Hz.

## FAQs

**Why do two names appear on black keys?** C♯ and D♭ are the same pitch on a piano. Which name is right depends on the key of the music.

**Why is the wavelength approximate?** Sound travels faster in warmer air, so the number changes by about 0.2 percent for each degree.

**Do notes above the piano range matter?** MIDI runs from 0 to 127, so the table does too. A piano covers only A0 to C8, shown as keys 1 to 88.
