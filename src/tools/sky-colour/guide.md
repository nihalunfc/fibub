---
name: Sky colour
num: 1007
shelf: learn
section: school-physics
title: "Sky colour"
summary: "Move the sun from overhead to the horizon and see why the sky is blue, why the sun turns red at sunset, why clouds are white and why the Moon's sky is black, with the scattering law worked out."
status: live
ads: false
order: 1007
icon: star
works: offline
updated: 2026-11-09
related: [prism-dispersion, eye-defects, snell-law]
sources:
  - "Rayleigh scattering strength ∝ 1/λ⁴ and the Tyndall effect: standard school physics as taught in Class 10 science. Air path relative to overhead: 1/sin(altitude), and near the horizon the Kasten and Young (1989) formula 1/(sin h + 0.50572 (h + 6.07995°)^−1.6364)."
  - "On-screen colours use a simplified teaching model: three wavelengths (450, 550, 680 nm), an overhead optical depth of 0.22 at 450 nm (a rounded value), and made-up strengths for haze and cloud. They show the idea, not a measured sky."
  - "Checked against an independent Python calculation of (λ₁/λ₂)⁴ and the air-mass formula."
flow:
  - { icon: sliders, label: "Move the sun" }
  - { icon: eye, label: "Sky colour" }
  - { icon: chart, label: "1/λ⁴ law" }
  - { icon: check, label: "Check" }
---

## What it does

Sunlight contains every colour. On its way through the air, a little of it bounces off the air molecules in all directions: this is **scattering**. Molecules are far smaller than the wavelength of light, and for such tiny scatterers the strength goes as **1/λ⁴** (Rayleigh scattering), so short-wavelength blue light is scattered several times more than long-wavelength red light. That scattered blue light reaches your eyes from every part of the sky.

This tool lets you move the sun across the sky and change what the light meets, to see four everyday puzzles explained:

- **Blue sky**: blue is scattered much more than red.
- **Red sunrise and sunset**: near the horizon sunlight crosses many times more air, so most of its blue is scattered away before it reaches you.
- **White clouds**: water drops are much bigger than the wavelength and scatter all colours about equally (the **Tyndall effect** with large particles).
- **Black sky on the Moon**: no air, no scattering.

It follows the Class 10 Science chapter on the human eye and the colourful world (scattering of light, Tyndall effect, colour of the sky and of the sun at sunrise and sunset). Before this, see how a prism separates colours in [[prism-dispersion]]; for how light bends rather than scatters, see [[snell-law]].

## How to use it

1. Move the **sun's height** from 90° (overhead) down to 0° (on the horizon).
2. Choose **what scatters the light**: air molecules, fine smoke or haze, cloud droplets, or no air at all.
3. Read the sky's colour, how much more blue scatters than red, how long the sunlight's path through the air is, and what share of blue and red light still reaches you directly.
4. The graph shows the scattering strength across the spectrum, with blue (450 nm) and red (700 nm) marked.

## Worked example

With the sun **60°** high and clear air, blue light at 450 nm is scattered (700/450)⁴ = **5.86 times** more than red light at 700 nm. The sunlight crosses about **1.15 times** the overhead thickness of air; in this model about **78%** of its blue light and **95%** of its red light come straight through, and the scattered blue fills the sky.

Lower the sun to **5°**. The path is now about **10 times** longer, only about **10%** of the blue gets through directly but about **65%** of the red does, so the sun looks orange-red. At the horizon the path is almost 38 times the overhead one.

## Things to notice

- Violet is scattered even more than blue, but sunlight has less violet and our eyes are less sensitive to it, so the sky looks blue rather than violet.
- Smoke and haze have bigger particles, which scatter the colours more evenly: polluted skies look pale and whitish.
- The "danger" colour for signals is red because red light is scattered least and travels furthest through fog and smoke.

## Check yourself

Questions with fresh numbers each time on the 1/λ⁴ ratio and the length of the sun's path through the air. **Show working** reveals the steps. Nothing is saved or sent anywhere.

## FAQ

**Why is the sun white or yellowish at noon, not blue-less?** Overhead its light crosses the least air, so only a small share of the blue is lost.

**Why are clouds sometimes grey?** Thick clouds let little light through from above, so their undersides are in their own shadow.

**Are the colours on screen exact?** No: they come from a three-colour teaching model with rounded values. The ratios and path lengths in the numbers are exact for the stated formulas.

This is a teaching model for school physics. It is not connected to NCERT or any exam board.
