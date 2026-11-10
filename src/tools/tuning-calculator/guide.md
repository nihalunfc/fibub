---
name: Tuning calculator
num: 421
shelf: science
code: T309
section: musicology-and-music-acoustics
title: "Tuning calculator"
summary: "Compare tuning systems: equal temperament with any number of steps, 5-limit just intonation, Pythagorean and meantone (quarter-comma and others). Get every note's ratio, cents and frequency from your reference pitch, its deviation from 12-TET and from pure intervals, the cents between any two ratios, and hear the notes and chords. Nothing is uploaded."
status: live
ads: false
order: 421
icon: sliders
works: offline
updated: 2026-11-09
related: [wave-calculator, uncertainty-calculator, harmonics-analyser, tempo-detector, standing-waves, audio-spectrum-analyser, doppler-beats, pitch-contour-tracker]
sources:
  - "Cents (1200 × log2 of the ratio), the syntonic comma 81/80, the Pythagorean comma 3¹²/2¹⁹, chains of fifths for Pythagorean and meantone tunings, 5-limit just ratios and equal division of the octave: standard music theory and acoustics."
  - "Checked against an independent Python script (fractions and math): all Pythagorean fractions and cents, quarter-comma meantone cents (to 10⁻⁸ ¢), the reference-pitch frequencies (C4 = 264, 261.626 and 260.741 Hz with A4 = 440 in just, 12-TET and Pythagorean) and the commas."
flow:
  - { icon: sliders, label: "System" }
  - { icon: calculator, label: "Cents" }
  - { icon: table, label: "Table" }
  - { icon: chart, label: "Compare" }
---

## What it does

A tuning system decides exactly how high each note of a scale is. Modern keyboards use 12-tone equal temperament (12-TET), where every semitone is the same 100 cents, but music before about 1800, much music outside Europe, and many singers, string players and composers today use others. This calculator lays them side by side:

- **Equal temperament** with any number of steps per octave (12, 19, 24, 31, 53 ...). Each step is 1200 ÷ n cents.
- **Just intonation (5-limit)**: notes as ratios of small whole numbers (9/8, 5/4, 4/3, 3/2 ...), so chords on the tonic are beatless.
- **Pythagorean tuning**: a chain of pure 3/2 fifths. Fifths are pure; major thirds (81/64) are a syntonic comma (21.51 cents) wide.
- **Meantone**: fifths narrowed by part of the syntonic comma. Quarter-comma makes the major thirds pure 5/4.

For each note you get the ratio (as a fraction where there is one), the size in **cents** (hundredths of an equal-tempered semitone), the deviation from 12-TET, the frequency in Hz from your reference pitch, and the nearest simple just interval with the difference. A chart shows both deviations at once.

Check the overtones of a real note with the [[harmonics-analyser|harmonics analyser]], and see how a string or pipe makes its pitch with [[standing-waves|standing waves]].

## How to use it

1. Pick the **system**. For equal temperament give the steps per octave; for meantone the part of the comma; for Pythagorean and meantone the number of **fifths below the tonic**, which decides where the out-of-tune "wolf" fifth falls.
2. Pick the **tonic** and its octave, and the **reference pitch** (A4 = 440 Hz by default; baroque groups often use 415).
3. Press **▶** on a row, **Play the scale** or **Play the major triad** to hear it. Sound is made in your browser only when you press a button.
4. Use **Cents between two ratios or pitches** for any interval: two frequencies (440 and 660 Hz) or two ratios.

## Worked example

The page opens with quarter-comma meantone on C, with A4 = 440 Hz. C4 comes out at **263.18 Hz**. The major third C–E is 386.31 cents, exactly the pure 5/4, while 12-TET's third is 13.69 cents wider. The fifth is 696.58 cents, 5.38 cents narrower than pure. With the chain running from E♭ to G♯, the wolf fifth G♯–E♭ is 737.64 cents, 35.68 cents wider than pure, which is why music in this tuning avoids that interval. In the cents box, 440 Hz to 660 Hz is 701.96 cents: a pure fifth, 3/2.

## Tips

- Play the major triad in 12-TET and then in just intonation or quarter-comma meantone: the 12-TET third beats audibly with the soft (overtone) sound.
- 19-, 31- and 53-tone equal temperaments approximate meantone and just intervals well; the "Nearest just" column shows how closely.
- The CSV download keeps every value to four decimals for further work.

## FAQ

**What is a cent?** One hundredth of an equal-tempered semitone, or 1/1200 of an octave. Trained listeners notice differences of a few cents between successive tones.

**Why does the reference pitch change the tonic?** The reference note keeps its frequency, and every other note follows from the tuning. In just intonation with A4 = 440, C4 is 264 Hz, not 261.63.

**Is anything recorded or sent?** No. The page only makes sound; it uses no microphone and sends nothing.
