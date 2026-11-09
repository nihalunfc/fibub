---
name: Standing waves calculator
num: 941
shelf: science
section: acoustics-and-wave-physics
title: "Standing waves calculator: string harmonics and tension, pipe resonances with end corrections, and tuning to a note"
summary: "Work out the notes a stretched string or an air column plays: the harmonic series with note names and cents, wavelengths and a picture of the first three standing waves. For pipes open at both ends, closed at one or closed at both, with end corrections. Or go the other way and find the string tension or pipe length for a target note."
status: live
ads: true
order: 4
icon: curve
works: offline
updated: 2026-11-09
related: [audio-spectrum-analyser, room-acoustics, wave-calculator]
sources:
  - "String vibration f = (n/2L)·√(T/μ) (Mersenne's laws) and air-column resonances f = n·c/2L′ or n·c/4L′: standard physics."
  - "End corrections 0.6133 × radius for an unflanged open end (Levine, H. and Schwinger, J. (1948), Physical Review 73, 383) and 0.8216 × radius for a flanged end (Rayleigh's value, refined by later authors): used as formulas."
  - "Equal-tempered notes from A4 (440 Hz by default). Densities in the material list are rounded general values."
  - "Checked against SymPy (the same formulas evaluated exactly to 15 digits). The example string and pipe are made up."
flow:
  - { icon: sliders, label: "String/pipe" }
  - { icon: curve, label: "Harmonics" }
  - { icon: target, label: "Notes" }
---

## What it does

A guitar string, a flute or a bottle you blow across all make sound the same way: a wave runs back and forth and reinforces itself only at certain frequencies, the **standing waves**. The lowest is the **fundamental** (the note you hear), and the others are its **harmonics** (overtones), which set the tone colour.

- **Strings** fixed at both ends play every harmonic: f = n·v / 2L, where the wave speed v = √(T/μ) depends on the tension T and the mass per metre μ.
- **Pipes open at both ends** (a flute) also play every harmonic, f = n·c / 2L′. **Pipes closed at one end** (a clarinet, a bottle) play only the odd ones, f = n·c / 4L′, an octave lower for the same length. L′ is the **acoustic length**: air vibrates a little beyond each open end, about 0.61 of the radius for a plain tube end.

The page lists the harmonics with the nearest **note name and cents** (hundredths of a semitone), the wavelengths, and draws the first three standing waves. In the other direction, it finds the **tension** for a string, or the **pipe length**, that gives a target note.

## How to use it

1. Choose a **string** or **air in a pipe**, and whether you want **the notes it plays** or **what gives a target note**.
2. For a string: the **vibrating length** (scale length), then either the **diameter and material** or the **mass per metre**, and the **tension** in newtons.
3. For a pipe: which **ends are open**, the **length**, the **inside diameter**, the kind of open end, and the **air temperature**.
4. For a target, type a note such as **E4**, **C#3**, **Bb2** (middle C is C4) or a frequency in Hz.
5. Download the harmonic list as CSV, or the report as an image, PDF or Word file.

## Worked example

The made-up example string is a 0.25 mm plain steel string with a 648 mm scale length, like a guitar's high E, at a tension of 70 N. Its mass is 0.3853 g per metre, waves run along it at 426.2 m/s, and the page shows a **fundamental of 328.87 Hz (E4 −4.0 cents)**: slightly flat. Switch to **What gives a target note** with E4 and it asks for **70.32 N** (7.17 kg-force).

For a pipe, choose air in a pipe: the example is 600 mm long and 19 mm across, open at both ends, at 20 °C. The end corrections add 5.83 mm at each end, so the acoustic length is 611.7 mm and the **fundamental is 280.56 Hz (C♯4 +21.0 cents)**. Close one end and it drops by about an octave to 141.63 Hz with only odd harmonics. To play A4 the open pipe would need to be 378.4 mm long.

## Tips

- Doubling the tension raises a string's pitch by only about half an octave (a factor of √2); halving the length raises it a full octave.
- Wind instruments go sharp as they warm up: the speed of sound rises about 0.6 m/s for each °C.
- A real string is slightly stiff, so its upper harmonics run a little sharp. Pianos are tuned with "stretched" octaves for this reason.

## FAQ

**Why is a pipe closed at one end an octave lower?** A closed end must be a node (no air movement) and an open end an antinode, so the fundamental fits a quarter of a wavelength into the pipe instead of a half.

**How exact is the end correction?** The 0.61 and 0.82 factors are for narrow cylinders at low frequencies. Tone holes, bells, cones and thick walls change it, so instrument makers adjust by ear. For study and planning, not a substitute for professional judgement.
