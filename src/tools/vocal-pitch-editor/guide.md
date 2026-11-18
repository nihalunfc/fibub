---
name: Pitch editor
num: 3025
shelf: everyday
code: T1019
section: production
title: "Pitch editor: correct the pitch of a vocal, note by note"
seoTitle: "Vocal pitch correction online, note by note, free"
summary: "Open a solo vocal or instrument, see every note on a piano roll, snap the notes to a key with a strength and retune time, or drag single notes up and down. Compare before and after, then save a WAV of the same length. Nothing is uploaded."
status: live
ads: false
order: 3025
icon: mic
works: offline
updated: 2026-11-18
related: [pitch-contour-tracker, pitch-shifter, instrument-tuner, chord-scale-helper, stem-splitter]
sources:
  - "Pitch tracking: YIN (de Cheveigné and Kawahara 2002, J. Acoust. Soc. Am. 111(4)). Pitch change: time-domain PSOLA (Moulines and Charpentier 1990, Speech Communication 9). Key from the notes: Krumhansl-Kessler and Temperley key profiles, as in fibub's key finder. Note splitting, strength and retune time are fibub's own. Drawings are fibub's own."
flow:
  - { icon: mic, label: "Open vocal" }
  - { icon: wave, label: "See notes" }
  - { icon: sliders, label: "Correct" }
  - { icon: download, label: "Save WAV" }
---

## What it does

This tool follows the pitch of one voice or instrument every 10 milliseconds, splits it into notes and draws a piano roll: outlined bars where you sang, filled bars where the notes will go, and the pitch line over both. It pulls notes towards the nearest note of a key, gently or fully, or you move single notes yourself. The take keeps its length and timing, and you can switch between original and corrected while it plays.

It is basic correction for monophonic parts, not a studio plug-in. To see the pitch line of a recording, use the [[pitch-contour-tracker]]; to move a whole track into another key, use the [[pitch-shifter]].

## How to use it

1. Press **Open a vocal** and choose a dry solo recording.
2. Check the **Key** and **Scale**, filled in from the notes.
3. Set **Strength** and **Retune time**, then press **Play corrected** or **Switch A/B** to compare.
4. Tap a note to select it and drag it, or use the ▲ ▼ and cents buttons.
5. Press **Save corrected WAV**.

## What each setting does

- **Strength**: how far each note moves towards its scale note; 100% lands on it, 50% goes halfway.
- **Retune time**: how quickly the pitch is pulled in, in milliseconds; 0 snaps at once and sounds robotic, 50 to 100 sounds natural.
- **Keep vibrato**: moves each note as a whole so its wobble stays; untick to iron the wobble flat.
- **Select several**: taps add notes. **Back to auto** returns selected notes to the key.
- **Dragging moves by**: whole semitones or single cents. Notes moved by hand always move fully.
- **Tuning of A4** (More options): for music not tuned to 440 Hz.

## Worked example

A 1.5-second test take sings A3 30 cents sharp, then C♯4 40 cents flat. In A major at 100% strength both notes are pulled onto A3 (220.0 Hz) and C♯4 (277.2 Hz); the saved file is exactly as long as the original. At 50% the first note moves about 15 cents down and the second about 20 cents up.

## FAQs

**Why does it sound robotic?** Lower the strength, raise the retune time or keep vibrato on. Moves of several semitones also change the voice's character.

**Can it fix a whole song?** Only a solo part; with backing music the pitch line jumps between sounds.

**Is my recording uploaded?** No. Everything runs in this page.
