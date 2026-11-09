---
name: Sound wave visualiser
num: 1061
shelf: learn
section: school-physics
title: "Sound wave visualiser: see compressions and rarefactions, wavelength = v/f, hear the note, echoes and SONAR"
summary: "Watch air particles bunch into compressions and spread into rarefactions as a sound passes. Slide the frequency and amplitude, switch to water or steel, hear the note, and work out echo distances and sea depth with SONAR."
status: live
ads: false
order: 1061
icon: sliders
works: offline
updated: 2026-11-09
related: [standing-waves, doppler-beats, ultrasound-calculator]
sources:
  - "Sound as a longitudinal wave, v = fλ, T = 1/f, speed of sound in an ideal gas v = √(γRT/M) (Laplace), pressure amplitude Δp₀ = ρvωs₀, intensity I = Δp₀²/(2ρv), sound level 10 log₁₀(I/10⁻¹² W/m²), echo and SONAR d = vt/2: standard physics."
  - "Gas constant R = 8.314462618 J/(mol K) (CODATA 2018, exact); molar mass of dry air 0.0289647 kg/mol; γ = 1.4. Speeds in water (about 1,480 m/s) and steel (about 5,900 m/s) are rounded general values."
  - "Checked against an independent Python calculation (math module) written for the tests."
flow:
  - { icon: sliders, label: "Frequency" }
  - { icon: eye, label: "Watch" }
  - { icon: ruler, label: "Wavelength" }
  - { icon: check, label: "Check" }
---

## What it does

Sound is a wave of squeezes and stretches in the air. This page shows rows of air particles as a sound passes through them: where they crowd together is a **compression** (higher pressure, marked C) and where they spread apart is a **rarefaction** (lower pressure, marked R). One particle is coloured so you can see the key idea: each particle only moves back and forth about its own place, while the pattern travels on. Change the **frequency** and **amplitude**, warm or cool the air, or send the sound through water or steel, and the numbers update with the formula filled in. Press **Play the sound** to hear the note. A second picture shows **echoes** and **SONAR**.

It follows the school topics on sound: Class 9 Science, Sound (production and propagation of sound, longitudinal waves, frequency, amplitude, speed, echo and SONAR), and Class 11 Physics, Waves (speed of sound in a gas, the displacement and pressure waves). Before this, try [[standing-waves]] for notes on strings and pipes; afterwards [[doppler-beats]] shows how motion changes pitch, and [[ultrasound-calculator]] goes further with ultrasound.

## How to use it

1. Move the **Frequency** slider (100 to 1,000 Hz). The bunches get closer as the frequency rises, because the wavelength λ = v / f gets shorter.
2. Move the **Amplitude** slider. The particles swing further and the bunches get tighter, which you hear as a louder sound, but the wavelength stays the same.
3. Pick what the sound **travels through**. In air, the temperature slider changes the speed. Water and steel use rounded speeds.
4. Press **Play the sound** to hear the note (it starts quietly; press again to stop). Nothing plays until you press.
5. Use **Pause** to freeze the picture and look at one compression.
6. Switch the **Level** to **Class 11** to see the speed worked out from v = √(γRT/M), the wave number k, the angular frequency ω, the pressure amplitude, the intensity and the sound level in decibels.

### Echoes and SONAR
Slide the **distance to a wall**. The page works out the time for the sound to go there and back, t = 2d / v, and tells you whether it is long enough (at least 0.1 s) to hear as a separate echo. The **SONAR** slider is the time a ship waits for the echo from the sea bed; the depth is d = v t / 2.

## Worked example

With the page as it opens: 500 Hz in air at 20 °C. The speed is v = √(1.4 × 8.314 × 293.15 / 0.02896) = 343.2 m/s, so the wavelength is λ = 343.2 / 500 = 0.6865 m and the time period is T = 1 / 500 s = 2 ms. On the Class 11 level, with an amplitude of 0.5 µm, the pressure amplitude is 0.649 Pa, the intensity 5.10 × 10⁻⁴ W/m² and the sound level about 87.1 dB.

For the echo, a wall 34 m away sends the sound back after 2 × 34 / 343.2 = 0.198 s, so you hear a separate echo. For SONAR, an echo after 2 s in sea water at 1,500 m/s means the sea is 1,500 × 2 / 2 = 1,500 m deep.

## Check yourself

At the bottom are five short questions with fresh numbers each time: wavelength, frequency, time period, the distance to a cliff from an echo, and sea depth from SONAR. Type your answer and press **Check**; the working appears when you get it right or ask for it. Nothing is saved.

## Tips

- The picture is slowed down 250 times and the particle movement is enlarged thousands of times. Real air particles move less than a thousandth of a millimetre in ordinary speech.
- Sound needs a medium. In a vacuum there are no particles to push, so there is no sound.
- The speed of sound depends on the medium and its temperature, not on the frequency or the loudness.

## FAQ

**Why do the bunches move but the coloured particle does not travel?** A wave carries energy, not the air itself. Each particle passes the push on to the next one and then moves back.

**Why can I not hear some frequencies?** Most people hear from about 20 Hz to 20,000 Hz; the range shrinks with age, and small speakers play low notes poorly.

**Is this from NCERT?** No. It is an independent study aid that follows the same school topics, with its own pictures and numbers.
