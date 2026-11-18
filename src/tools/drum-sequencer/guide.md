---
name: Drum sketcher
num: 3041
shelf: everyday
code: T1035
section: production
title: "Drum sketcher: online drum machine with step grid, WAV and MIDI export"
summary: "Sketch a drum loop on a 16 or 32 step grid with synthesised kick, snare, clap, hats, tom, rim and perc, then download it as WAV or MIDI or share it as a link."
status: live
ads: false
order: 3041
icon: table
works: offline
updated: 2026-11-18
related: [song-structure-planner, metronome, sample-chopper, lfo-rate-calculator]
sources:
  - "Drum sounds are synthesised in this page from sine sweeps and filtered noise, so there are no samples. MIDI export uses drum note numbers from the General MIDI drum map (MIDI Manufacturers Association): kick 36, rim 37, snare 38, clap 39, closed hat 42, tom 45, open hat 46 and perc 47 (a second tom), on channel 10, in a Standard MIDI File with 480 ticks per quarter note. Swing is the delay of every second sixteenth note: 50% is straight and about 67% is a triplet feel. Preset patterns are generic common shapes. Checked 2026-11-18."
flow:
  - { icon: pointer, label: "Tap steps" }
  - { icon: play, label: "Play" }
  - { icon: download, label: "Export" }
---

## What it does

This is a drum machine for sketching beats. Each row is a drum (kick, snare, clap, closed hat, open hat, tom, rim, perc) and each square is a sixteenth note. Tap squares to switch hits on, press **Play** and the loop runs. The sounds are made on the spot, so nothing is downloaded and it works offline.

When the loop feels right, download it as a WAV to drop into a sampler, as a MIDI file for any drum instrument, or copy a link that holds the whole pattern. To plan where the beat goes in a track use the [[song-structure-planner]], to keep time while you play along use the [[metronome]], and to match a modulation speed to the tempo use the [[lfo-rate-calculator]].

## How to use it

1. Pick a preset or start from a blank grid and tap squares.
2. Set **BPM**, **Swing** and **Length** (16 steps is one bar, 32 steps is two bars).
3. Press **Play** (or the space bar). Changes apply while it plays.
4. Choose **Bars to export** and download the **WAV** or **MIDI**, or **Copy share link**.

## What each option does

- **Swing**: delays every second sixteenth. 50% is straight, about 67% gives a triplet shuffle.
- **Row volumes** (More options): the level of each drum, saved in the WAV and as MIDI velocity.
- **Open hat** is cut off when a closed hat follows, as on a real kit.
- **Share link**: the pattern is stored in the address after the # sign, so it is never sent to a server.

## Worked example

Choose **Four on the floor**: a kick on every beat, a clap on beats 2 and 4, and open hats between the kicks at 124 BPM. Two bars last 2 x 4 x 60 / 124 = 3.87 seconds, so a 2-bar WAV is that long at 44,100 Hz. The MIDI file has 8 kick notes (note 36) for those two bars.

## FAQs

**Why does my MIDI sound different elsewhere?** The file holds notes, not sounds. Your instrument chooses the drum sounds.

**Is the WAV loop-ready?** The tail of the last hits is folded onto the start, so it should loop without a gap.

**Are the patterns copied from records?** No, they are generic shapes.
