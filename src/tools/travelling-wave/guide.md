---
name: Travelling wave
num: 1063
shelf: learn
code: L27
section: school-physics
title: "Travelling wave: y = A sin(kx − ωt), wave speed v = ω/k, one particle tracked, superposition, standing waves and beats"
summary: "Watch a wave move along a string while one particle just goes up and down. Change the amplitude, wavelength, period and direction; add a second wave to see superposition and standing waves; and hear beats between two close tones."
status: live
ads: false
order: 1063
icon: curve
works: offline
updated: 2026-11-16
related: [shm-circle, standing-waves, doppler-beats, sound-wave-visualiser]
sources:
  - "Travelling waves y = A sin(kx ∓ ωt), k = 2π/λ, ω = 2π/T, v = ω/k = λ/T, the principle of superposition, standing waves 2A sin kx cos ωt with nodes λ/2 apart, interference of two waves going the same way, and beats |f₁ − f₂|: standard physics."
  - "Checked against an independent Python calculation and the textbook identities for standing waves and beats, written for the tests."
flow:
  - { icon: sliders, label: "Set wave" }
  - { icon: eye, label: "Track one" }
  - { icon: curve, label: "Add waves" }
  - { icon: check, label: "Check" }
---

## What it does

A wave is a pattern that moves while the stuff it moves through stays where it is. This page draws a wave travelling along a string, y = A sin(kx − ωt), and marks one particle of the string in orange: it only bobs up and down as the wave passes. Change the **amplitude**, **wavelength**, **period** and **direction** and the equation is rewritten with your numbers. Two more views show what happens when waves meet: **Two waves** adds a second wave (superposition), which makes a **standing wave** when equal waves go opposite ways, and **Beats** shows and plays two close notes that swell and fade.

It follows the school topic of waves: Class 11 Physics, Waves (transverse and longitudinal waves, displacement relation y = A sin(kx − ωt), amplitude and phase, wavelength and wave number, period and angular frequency, the speed of a travelling wave, superposition, reflection and standing waves, beats). Before this, see [[shm-circle]] for the up-and-down motion of each particle; afterwards, [[standing-waves]] works out the notes of strings and pipes and [[doppler-beats]] covers the Doppler effect.

## How to use it

1. **One wave**: move the sliders. A is the height of a crest, λ the distance from crest to crest, and T the time for one full up-and-down of a particle. Choose the direction: kx − ωt moves right, kx + ωt moves left.
2. Move the **tracked particle** slider to follow a different point of the string. Its height is shown under the picture.
3. **Two waves**: set the second wave's amplitude, wavelength, direction and phase. Thin lines are the two waves; the thick line is their sum. With equal waves going opposite ways, the dots mark the **nodes** that never move.
4. **Beats**: set two tones a few hertz apart. The picture shows one second of sound at one place, with the loud–soft envelope. Press **Play the beats** to hear them (nothing plays until you press).
5. **Pause** stops the picture so you can study one moment.

## Solve my numbers

Have a problem from your book? The **Solve my numbers** box at the top takes your own numbers and shows the answer in one sentence, then the working the way an exam marks it (formula, substitution with units, result). Choose what you want to find: the wave speed from f and λ (v = f λ) or from the period (v = λ/T), the wavelength or frequency, the full wave equation y = A sin(kx ∓ ωt) with k, ω and the speed filled in, the displacement and velocity of one particle at a chosen x and t, the beat frequency of two tones, the harmonics of a string fixed at both ends (with nodes and antinodes counted) and the wave speed on a stretched string, v = √(F/μ). Boxes take common units (cm, m, km/h, kHz, MHz, g/m); a unit box converts for you and the converted line is shown. Tap a worked example to fill the numbers, change them, and the answer follows. The page tells you the common slip for each problem, such as using 1/λ instead of 2π/λ for k, or calculator in degrees instead of radians. Zero, negative or impossible entries (a harmonic that is not a whole number) give a plain message, never NaN.

## Worked example

With the page as it opens: A = 5 cm, λ = 2 m, T = 1 s, moving right. The wave number is k = 2π / 2 = 3.142 rad/m and the angular frequency is ω = 2π / 1 = 6.283 rad/s, so y(x, t) = 5 sin(3.142 x − 6.283 t) cm. The wave speed is v = ω / k = 2 m/s, but the orange particle never moves sideways: its top speed up and down is Aω = 31.42 cm/s.

In **Two waves**, with a second wave of 5 cm and 2 m going left, the sum is a standing wave: nodes every λ/2 = 1 m and antinodes swinging to 10 cm. In **Beats**, tones of 440 Hz and 444 Hz give |440 − 444| = 4 beats a second, a loud moment every 0.25 s, at a pitch of about 442 Hz.

## Check yourself

Five questions with fresh numbers: the speed and wavelength from an equation y = A sin(kx − ωt), the frequency from the speed and wavelength, the number of beats between two tuning forks, and which way a wave travels from the sign in its equation. Nothing is saved.

## Tips

- Wave speed (how fast the pattern moves) and particle speed (how fast a bit of string moves up and down) are different things.
- On one string every wave travels at the same speed, so when you change the second wave's wavelength, its period changes with it.
- Musicians tune by listening for beats: as two notes get closer, the beats slow down and vanish when they match.

## FAQ

**Why does the standing wave not move along?** The two waves carry energy in opposite directions, so the pattern stays put: y = 2A sin kx cos ωt. Each point swings with its own amplitude, zero at the nodes.

**What does the phase slider do?** It shifts the second wave along by part of a wavelength. Going the same way, a phase of 180° makes equal waves cancel; going opposite ways it slides the nodes along.

**Is this from NCERT?** No. It is an independent study aid that follows the same school topics, with its own pictures and numbers.

**What is the wave speed if I know the frequency and wavelength?** Multiply them: v = f λ, for example 256 Hz × 1.3 m = 333 m/s; type your own numbers into Solve my numbers for the working.
