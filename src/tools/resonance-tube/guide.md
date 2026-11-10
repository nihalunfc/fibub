---
name: Resonance tube practical
num: 1355
shelf: learn
section: school-physics
title: "Resonance tube virtual practical: find the speed of sound in air and the end correction with a tuning fork and a water column"
summary: "Hold a tuning fork over a tube and move the water level until the air column booms. Record the first and second resonance lengths and the tool works out the wavelength, the speed of sound and the end correction, as in the school practical, with the loudness you can see and hear."
status: live
ads: false
order: 1355
icon: ruler
works: offline
updated: 2026-11-09
related: [standing-waves, beats-lab, sound-wave-visualiser, travelling-wave]
sources:
  - "Resonance of an air column closed at one end (L + e = λ/4, 3λ/4, ...), the end correction e ≈ 0.3 × the tube's width (0.6 × its radius), v = fλ = 2f(L₂ − L₁) and the speed of sound in dry air 331.3 √(1 + T/273.15) m/s: standard school physics found in any textbook."
  - "The loudness curve is a simple teaching model of a resonance with light damping, not a measured response."
  - "Checked by hand (512 Hz at 25 °C in a 4 cm tube: λ = 67.6 cm, L₁ = 15.70 cm, L₂ = 49.50 cm) and by putting exact resonance lengths back in: v and e come back exactly."
flow:
  - { icon: sliders, label: "Water level" }
  - { icon: target, label: "Loudest" }
  - { icon: ruler, label: "L₁, L₂" }
  - { icon: calculator, label: "Speed" }
---

## What it does

Hold a ringing tuning fork over the open end of a tube that is closed at the bottom by water. At most lengths of air you hear the fork faintly, but at one particular length the tube booms: the air column is **resonating**. A standing wave fits in it, with a node at the water and an antinode just above the open end. The first resonance holds a quarter of a wavelength; the next one, half a wavelength further down, holds three quarters.

This tool is the school practical on a screen. Move the water level with the slider, the 1 mm buttons or by dragging the water. The loudness shows on a graph of the lengths you have tried, and you can hear the fork's tone grow and fade. Record the first and second resonance lengths and the tool works out the wavelength, the **speed of sound** and the **end correction**, and compares them with the expected values for the room temperature.

It follows the school topics on standing waves in air columns and the speed of sound (Class 11 Physics, waves) and the resonance tube experiment in the practical list. For the harmonics of pipes and strings see [[standing-waves]], for two forks heard together [[beats-lab]], and for how sound itself travels [[sound-wave-visualiser]].

## How to use it

1. Pick a **tuning fork**, the **room temperature** and the **tube width**.
2. Start with a short air column and lengthen it slowly. Watch the loudness dot and the trail of lengths you have tried. Tap **Hear it** to listen as you go.
3. At the loudest point, fine-tune with **− 1 mm** and **+ 1 mm**, then tap **Record as 1st resonance**.
4. Carry on down the tube to the next loud point and tap **Record as 2nd resonance**.
5. Read the wavelength, your speed of sound and your end correction. **Start again** clears everything.

## Worked example

Open the page: a **512 Hz** fork at **25 °C** with a tube **4 cm** wide. Sound travels at 331.3 × √(298.15 ÷ 273.15) = 346.1 m/s, so the wavelength is 346.1 ÷ 512 = 67.6 cm and the end correction about 0.3 × 4 = 1.2 cm. The first resonance comes at **15.7 cm** (67.6 ÷ 4 − 1.2) and the second at **49.5 cm**.

Record those two: the wavelength is 2 × (49.5 − 15.7) = **67.6 cm**, the speed of sound 512 × 0.676 = **346.1 m/s**, and the end correction (49.5 − 3 × 15.7) ÷ 2 = **1.2 cm**.

## Tips

- Using L₂ − L₁ cancels the end correction, which is hard to measure directly.
- Strike the fork on a rubber pad, never on the table, and hold it level over the tube.
- Sound speeds up by about 0.6 m/s for each degree Celsius, so note the room temperature.

## FAQ

**Why is the air column a little shorter than λ/4?** The antinode is not exactly at the open end but a little above it; that extra bit is the end correction.

**Why does the sound get loud only at certain lengths?** Only then do the reflected waves line up with the fork's waves and build up, like pushing a swing in time.

**Is anything stored or recorded?** No. The tool only plays a tone; it never uses the microphone, and nothing leaves your browser.
