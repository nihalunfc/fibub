---
name: Beats lab
num: 1354
shelf: learn
code: L216
section: school-physics
title: "Beats generator: hear and see beats between two close frequencies, beat frequency |f₁ − f₂|, and find an unknown tuning fork with wax"
summary: "Play two tones a few hertz apart and hear the sound swell and fade. See each wave and their sum with its envelope, read the beat frequency, the beat period and the pitch you hear, then solve the classic puzzle: find an unknown tuning fork's frequency from beats and a blob of wax."
status: live
ads: false
order: 1354
icon: curve
works: offline
updated: 2026-11-16
related: [travelling-wave, standing-waves, resonance-tube, doppler-beats]
sources:
  - "Superposition of two waves, sin a + sin b = 2 cos((a − b)/2) sin((a + b)/2), the beat frequency |f₁ − f₂| and the tuning-fork wax-loading method: standard school physics found in any textbook."
  - "Checked against the product formula at 2000 times, the envelope bound for unequal loudness, and every case of the wax puzzle with 2 to 6 beats."
  - "Beat frequency |f₁ − f₂| and the wax rule (loading a fork lowers its frequency) are standard school physics; the Solve my numbers answers match the wax puzzle in the tool above."
flow:
  - { icon: sliders, label: "Two tones" }
  - { icon: curve, label: "Add waves" }
  - { icon: clock, label: "Beats/s" }
  - { icon: check, label: "Check" }
---

## What it does

Strike two tuning forks that are almost, but not quite, the same, and you hear a single note whose loudness swells and fades, "wah, wah, wah". These swells are **beats**. They happen because the two waves add up (**superposition**): at one moment their crests line up and the sound is loud; a little later the crest of one meets the trough of the other and they cancel. The number of swells each second is the difference between the two frequencies.

This tool draws a few milliseconds of each wave, then their sum over two beats with the swelling **envelope** dashed in red. It plays the sound so you can hear it, and gives the beat frequency, the time between swells and the pitch you actually hear. The second mode is the classic school puzzle: an unknown fork gives some beats with a known fork; work out its frequency, using wax to decide between the two possible answers.

It follows the school topics on the principle of superposition and beats (Class 11 Physics, waves). For a single moving wave see [[travelling-wave]], for waves trapped on strings and in pipes [[standing-waves]], and for measuring the speed of sound with a tuning fork [[resonance-tube]].

## How to use it

1. In **Two tones**, set the two frequencies and the loudness of the second tone. The big number is the beats per second.
2. Tap **Play the sound** to hear it for 6 seconds (turn the volume down first). Moving a slider while it plays retunes it.
3. In **Find the unknown fork**, read the beats, tap **Put wax on the unknown fork**, see whether the beats rise or fall, and type your answer. **New unknown fork** gives you another.

## Worked example

Open the page: **256 Hz** and **260 Hz**. The beat frequency is 260 − 256 = **4 Hz**, so the sound swells 4 times a second, once every **0.25 s**. The pitch you hear is the average, **258 Hz**. With both tones equally loud the sum falls to **silence** between swells; set the second tone to 50 % and the quietest point is still half as loud as one tone.

The fork puzzle: a 256 Hz fork and an unknown fork give 4 beats per second, so the unknown is 252 Hz or 260 Hz. With wax (which lowers it by 1 Hz here), suppose the beats drop to 3: the unknown moved closer to 256 Hz, so it was above it: **260 Hz**. If the beats had risen to 5, it would have been 252 Hz.

## Tips

- Musicians tune two strings by adjusting one until the beats slow down and stop.
- Beats faster than about 15 a second are no longer heard as swells, only as roughness.
- Filing the prongs of a fork makes it vibrate faster; wax makes it slower.

## Solve my numbers

Solve my numbers handles the usual beats questions. Choose the beat frequency of two notes (you also get the time between swells and the pitch you hear), the unknown tuning fork from a known fork, the beats you counted and what wax did, or how many beats you hear in a given time. For the fork puzzle, tell it how many beats you counted and in how much time (6 beats in 3 seconds is 2 per second), then whether the beats got faster or slower after waxing the unknown fork, or that you did not try wax, and it gives one answer or both possibilities. Frequencies can be in Hz, kHz, MHz or GHz. A frequently seen mistake is adding the frequencies instead of subtracting them. Equal frequencies give a message that there are no beats. Tap an example to fill the boxes.

## FAQ

**Is the beat frequency a new tone?** No. No new sound wave is made; the loudness of the average-pitch tone simply goes up and down.

**Why does the graph look like a solid band?** At hundreds of hertz there are many waves in each beat; the shape of the band is the envelope you hear as loudness.

**Is anything stored or recorded?** No. The tool only plays sound; it never uses the microphone, and nothing leaves your browser.

**How do you find the frequency of an unknown tuning fork using beats and wax?** The unknown fork is the known frequency plus or minus the beats per second; wax lowers it, so beats getting faster means it was the lower fork, found under Solve my numbers.
