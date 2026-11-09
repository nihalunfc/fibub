---
name: Room acoustics calculator
num: 938
shelf: science
section: acoustics-and-wave-physics
title: "Room acoustics calculator: room modes (axial, tangential, oblique) and reverberation time RT60 by Sabine and Eyring"
summary: "Give a rectangular room's size and what its floor, ceiling and walls are made of, and get every room mode up to the frequency you choose (axial, tangential and oblique, with the boomy clusters flagged), plus the reverberation time in six octave bands by Sabine's and Eyring's formulas, with air absorption, the Schroeder frequency and the critical distance."
status: live
ads: true
order: 1
icon: chart
works: offline
updated: 2026-11-09
related: [noise-barrier, wave-calculator, uncertainty-calculator, decibel-distance, standing-waves, speaker-box-designer, audio-spectrum-analyser, noise-dose]
sources:
  - "Rectangular room modes f = (c/2)·√((nx/L)² + (ny/W)² + (nz/H)²), the smoothed mode count and the Schroeder frequency 2000·√(T/V): standard room acoustics, for example Kuttruff, H., Room Acoustics (Taylor and Francis)."
  - "Reverberation time: Sabine, W. C. (1900) and Eyring, C. F. (1930), J. Acoust. Soc. Am. 1, 217 to 241, with the 4mV air term; Sabine's constant worked out as 24·ln 10 / c from the speed of sound."
  - "Air absorption: the pure-tone formula of ISO 9613-1:1993, used as a formula only (no tables copied)."
  - "Checked against an independent NumPy implementation (mode search, Sabine, Eyring and the ISO 9613-1 formula). The absorption coefficients offered in the lists and the example room are made up."
flow:
  - { icon: ruler, label: "Room size" }
  - { icon: sliders, label: "Surfaces" }
  - { icon: clock, label: "RT60" }
  - { icon: chart, label: "Modes" }
---

## What it does

Sound in a room does two things at once. At **low frequencies** the room behaves like an organ pipe in three directions: only certain notes, the **room modes**, fit an exact number of half-wavelengths between the walls, and those notes boom while others nearly vanish. At **higher frequencies** there are so many modes that they blur into **reverberation**, the smooth decay you hear after a clap. This calculator works out both for a rectangular (shoebox) room.

- **Modes:** every mode up to the frequency you choose, labelled **axial** (bouncing between one pair of walls, the strongest), **tangential** (two pairs) and **oblique** (all three pairs, the weakest). Pairs of modes within 0.5 % of each other are flagged, because they pile up into one loud note.
- **Reverberation time (RT60):** the time for sound to fall by 60 dB, in six octave bands from 125 Hz to 4 kHz, by **Sabine's** formula T = 0.161 V / A and by **Eyring's**, which is better when the room absorbs a lot. Both include the sound absorbed by the air itself (ISO 9613-1 formula).
- The **Schroeder frequency**, where modes give way to reverberation, the **mean free path** between reflections and the **critical distance**, where the direct sound and the reverberant sound are equally loud.

Find the low notes that build up between the walls with the [[standing-waves|standing waves calculator]], and check how loud a source is at a distance with the [[decibel-distance|decibel distance calculator]].

## How to use it

1. Type the inside **length, width and height** in metres, and the air **temperature** and **humidity**.
2. For each surface (floor, ceiling, the two end walls, the two side walls), pick a material or type six **absorption coefficients**, one for each band (125, 250, 500, 1000, 2000, 4000 Hz), separated by commas. The area of each surface is shown next to it. The listed materials are **illustrative made-up values**; for a real room use the numbers from the product's test sheet.
3. Add **extra absorption** in square metres for furniture, people and soft things, one number per band.
4. Choose how high to **list modes** (200 Hz is usual for a listening room).
5. Read the reverberation table and chart, then the mode map and list. Download the bands or modes as CSV, or the whole report as an image, PDF or Word file.

## Worked example

The made-up example is a 5 × 4 × 2.5 m room (50 m³, 85 m² of surface) at 20 °C and 50 % humidity, with a hard floor, ceiling tiles, plasterboard walls and some furniture. The page shows a reverberation time of **0.45 s (Eyring)** and **0.50 s (Sabine)** at 500 Hz to 1 kHz, with an average absorption coefficient of 0.19. The Schroeder frequency is **190 Hz** and the critical distance only **0.63 m**, so most of what a listener hears beyond arm's length is reverberant sound.

Up to 200 Hz the room has **65 modes: 11 axial, 32 tangential and 22 oblique**. The lowest is (1, 0, 0) at **34.32 Hz**, half a wavelength along the 5 m length. The (2, 0, 0) mode and the (0, 0, 1) mode both land on 68.64 Hz, because 5 m is exactly twice 2.5 m: the tool flags pairs like this. Changing the height to 2.7 m separates them.

## Tips

- Rooms whose sides are simple multiples of each other (a cube is the worst) stack modes on top of each other. Ratios such as 1 : 1.4 : 1.9 spread them out.
- Reverberation that is much longer at 125 Hz than at 1 kHz sounds boomy; bass traps or panels with an air gap behind them help.
- Absorption only works where the sound is: Sabine and Eyring both assume it is spread around the room. Treating only the ceiling of a tall hall leaves flutter echoes between bare walls.

## FAQ

**Which reverberation time should I believe?** For a lively room with little absorption (ᾱ below about 0.2) the two agree closely. For a well-treated room Eyring's is nearer the truth; Sabine's always gives the longer time.

**Why are the low modes so important in small rooms?** Below the Schroeder frequency there are too few modes to fill in the gaps, so the bass you hear changes from seat to seat.

**Is this good enough for a studio or a concert hall?** It is a sound first estimate. Irregular rooms, uneven absorption, openings and real materials need measurement or proper modelling. For study and planning, not a substitute for professional judgement.
