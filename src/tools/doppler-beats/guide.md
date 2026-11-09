---
name: Doppler and beats calculator
num: 943
shelf: science
section: acoustics-and-wave-physics
title: "Doppler effect calculator: moving source and listener, echoes, light redshift, the speed from a shift, and beat frequency"
summary: "Work out the pitch you hear from a moving siren or a moving listener (with wind), the curve of a horn driving past, the echo from a moving object for sonar, bats and radar speed guns, the redshift of light from a moving star, the speed from a measured shift, and the beats between two close tones."
status: live
ads: true
order: 6
icon: target
works: offline
updated: 2026-11-09
related: [standing-waves, audio-spectrum-analyser, redshift-calculator]
sources:
  - "Doppler effect for sound with a moving source, listener and medium, f′ = f (c + u + v_o)/(c + u − v_s); two-way echo f (c + v)/(c − v); relativistic longitudinal Doppler f √((1 + β)/(1 − β)); Mach cone sin μ = 1/M; beats |f₁ − f₂|: standard physics."
  - "Speed of sound in air 331.3 √(1 + θ/273.15) m/s; in water about 1,480 m/s (rounded); speed of light 299,792,458 m/s (exact by definition)."
  - "Checked against NumPy and SymPy, and the pass-by curve against an independent numerical solution (SciPy root finding for the emission time). The example siren and other values are made up."
flow:
  - { icon: sliders, label: "Motion" }
  - { icon: curve, label: "Shift" }
  - { icon: chart, label: "Pass-by" }
  - { icon: calculator, label: "Beats" }
---

## What it does

When a source of waves moves towards you, its crests arrive bunched up and you hear a higher pitch; moving away, they are stretched and the pitch drops. This is the **Doppler effect**. The calculator covers four everyday cases:

- **Sound** from a moving source to a moving listener, with **wind**, plus the falling pitch curve as a siren or horn **drives past**, and the **Mach number** and Mach cone when the source outruns its sound.
- **Echoes** from a moving object, where the wave is shifted twice: a bat hunting a moth, a sonar, or a **radar speed gun** (choose radio waves).
- **Light** from a moving star or object, using special relativity: the redshift z and the wavelength you see.
- **Beats** between two close tones: how many times a second the sound swells and fades.

Each Doppler case can also run backwards: give the frequency or wavelength you **measured** and it finds the **speed**.

## How to use it

1. Choose the **situation** and the **speed units** (m/s, km/h, mph, knots or km/s).
2. For sound and echoes, give the **frequency sent out** and what the waves travel through: air at a temperature, water, radio, or your own wave speed.
3. Give the **speeds** and whether each is moving **towards** or **away**. Only the part of the motion along the line between them counts.
4. Optionally give a **measured** frequency or wavelength to find the speed.
5. Download the chart data as CSV, or the report as an image, PDF or Word file.

## Worked example

The made-up example is a **700 Hz siren** on a vehicle doing **25 m/s** (90 km/h) towards a listener standing still, in air at 20 °C (sound at 343.21 m/s). The page shows **Heard: 754.99 Hz (+54.99 Hz)**, 1.31 semitones high. As it passes, the pitch falls to **652.47 Hz**, a drop of **2.53 semitones**, and the chart shows how fast it falls when it passes 20 m away. Typing 754.99 as the measured frequency gives the speed back: 25 m/s towards.

For an echo, a bat calling at 40,000 Hz at a moth closing at 2 m/s hears **40,468.91 Hz**, 468.91 Hz higher. For light, hydrogen's 656.28 nm line from a star moving away at 3,000 km/s is seen at **662.881 nm**, redshift z = 0.01006. For beats, 440 and 443 Hz give **3 beats per second**, one every 0.3333 s, at a pitch of 441.5 Hz.

## Tips

- Speed guns use the echo case with radio waves: a 10.5 GHz gun sees a shift of about 70 Hz for every m/s of the car's speed.
- For the pass-by, the pitch changes fastest at the moment of closest approach; the closer you stand, the more sudden the drop.
- To tune two strings, play them together and adjust until the beats slow down and stop.

## FAQ

**Why is the shift different for a moving source and a moving listener at the same speed?** The source moving squeezes the wavelength in the air, while a moving listener meets crests faster; the two only agree at low speeds.

**Does this work for galaxies?** For nearby objects, yes. For distant galaxies the stretching of space dominates; use the redshift calculator. For study and planning, not a substitute for professional judgement.
