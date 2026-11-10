---
name: Hearing range explorer
num: 1266
shelf: learn
section: school-physics
title: "Hearing range explorer: play tones from 20 Hz to 20 kHz and find the edges of your hearing"
summary: "Play a pure tone from 20 Hz to 20 000 Hz, made in your browser, or sweep up and down and mark where you start hearing it. See the wavelength and compare with the approximate hearing ranges of animals. Not a medical test."
status: live
ads: false
order: 1266
icon: sliders
works: offline
updated: 2026-11-09
related: [sound-wave-visualiser, echo-sonar, audio-spectrum-analyser, decibel-distance]
sources:
  - "Tones are made with the browser's Web Audio API (an oscillator); nothing is recorded. Human range 20 Hz to 20 kHz and the wave relation v = fλ are standard school physics; 343 m/s is the speed of sound in air at 20 °C."
  - "Animal ranges are rounded, approximate general-knowledge figures for comparison only; individuals and studies differ."
flow:
  - { icon: sliders, label: "Pick tone" }
  - { icon: target, label: "Play" }
  - { icon: pointer, label: "Mark it" }
  - { icon: chart, label: "Compare" }
---

## What it does

Young people can hear sounds from about **20 Hz** (a deep rumble) to **20 000 Hz** (a thin, high whine). Sounds below that are **infrasound**; above it, **ultrasound**. This page makes pure tones in your browser so you can hear the difference:

- **Play** any frequency on a log-scale slider (each step up the slider multiplies the frequency, like keys on a piano).
- **Sweep up** from 20 Hz or **sweep down** from 20 kHz, and press the button when you first hear the tone. The page shows the lowest and highest you marked, on a chart next to the approximate ranges of an elephant, a dog, a cat and a bat.
- For every tone it shows the **wavelength** in air, λ = v ÷ f.

Nothing is recorded or stored. **Turn your volume down first.** This is a science demonstration, not a hearing test: phone and laptop speakers can't play very low notes, and many headphones fade above 15 kHz.

It fits the Class 9 science chapter *Sound Waves: Characteristics and Applications* (range of hearing, infrasound and ultrasound). What a sound wave looks like is in [[sound-wave-visualiser]], echoes of sound and ultrasound are in [[echo-sonar]], and a live picture of the sounds around you is in [[audio-spectrum-analyser]].

## How to use it

1. Lower your device volume. Set **vol** low too.
2. Move the **Hz** slider or type a frequency, and press **Play**. Press **Stop** to end.
3. Press **Sweep up**; when you first hear the tone, press **I hear it / it's gone**. Do the same with **Sweep down**.
4. Look at the chart: the red line is the current tone.

## A worked example

At 1 000 Hz the wavelength in air is 343 ÷ 1 000 = 0.343 m. At 20 Hz it is 17.15 m, longer than a bus; at 20 000 Hz it is only 0.0172 m (1.7 cm). A dog whistle at 30 000 Hz is ultrasound: dogs (up to about 45 kHz) hear it, people don't.

## Tips

- Use headphones for the high end, a big speaker for the low end.
- The top of the range falls with age, which is why some teenagers hear high tones adults can't.
- Loudness is not frequency: a loud tone is not a higher one.

## FAQ

**Is anything recorded?** No. The page only plays sound; it never uses the microphone.

**Is this the NCERT book?** No. It covers the same topic with fibub's own examples. fibub is not part of NCERT.
