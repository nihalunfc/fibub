---
name: Ripple tank
num: 2268
shelf: learn
code: L344
section: school-physics
title: "Ripple tank: measure wavelength, wave speed, refraction and diffraction"
summary: "Watch straight waves from a dipper, freeze them with a strobe, measure the wavelength with a ruler to find v = f x wavelength, then see refraction in a shallow region and diffraction through a gap."
status: live
ads: false
order: 2268
icon: wave
works: offline
updated: 2026-11-16
related: [travelling-wave, wave-calculator, huygens-wavelets]
sources:
  - "The wave equation v = f lambda, refraction (sin theta2 / sin theta1 = v2 / v1) and diffraction through a gap (first minimum at sin theta = lambda / a), as in the GCSE waves required practical (ripple tank), Ontario SPH3U waves and sound and NGSS HS-PS4-1. Water-wave speed uses the shallow-water approximation v = sqrt(g h) with g = 9.81 m/s2, a teaching model. The diffraction picture adds up Huygens wavelets across the gap with the Fresnel weighting 1/sqrt(lambda r). The animation is slowed to a quarter of real speed. Checked in tests/curr-physics.mjs. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Set f, depth" }
  - { icon: ruler, label: "Measure" }
  - { icon: calculator, label: "v = f x l" }
  - { icon: check, label: "Quiz" }
---

## What it does

A ripple tank is a shallow tray of water lit from above so you can see waves as bright and dark bands. A straight dipper tapping the surface makes straight wavefronts that move across the tank. Because the waves are too fast to measure by eye, schools use a strobe light that flashes at the dipper's frequency and makes the pattern look frozen.

This page lets you do the same. Set the frequency and the depth, freeze the waves, and drag a ruler across several wavefronts to find the **wavelength**. Divide the length by the number of wavefronts, multiply by the frequency, and you have the wave speed from **v = fλ**. Two extra set-ups show refraction and diffraction. Follow up with [[travelling-wave]], [[wave-calculator]] and [[huygens-wavelets]].

## How to use it

1. Set the frequency and the water depth. The speed is shown next to the depth slider.
2. Press Strobe: freeze so the pattern stands still.
3. Drag across the picture along the direction the waves travel. Set how many wavefronts you spanned, so that wavefronts are counted from one crest to another.
4. Read the wavelength and the speed v = fλ under the picture, and compare it with the true value.
5. Try Shallow region and Gap in barrier, then answer the quiz.

## What each setting does

- **Frequency:** how many waves the dipper makes each second. It stays the same everywhere in the tank.
- **Depth:** deeper water carries waves faster in this model, v = √(gh).
- **Shallow region:** a 2 mm shelf below the dashed line. The waves slow down, the wavelength shortens and the direction bends.
- **Gap width:** the opening in the barrier. Diffraction is strongest when the gap is about one wavelength.
- **Strobe and Pause:** Strobe freezes the pattern as a real strobe does. Pause stops the animation.

## Worked example

At 8 Hz and 6 mm depth the model speed is √(9.81 × 0.006) = 0.243 m/s. The wavelength is 0.243 ÷ 8 = 0.0303 m, about 3.0 cm. If you drag a ruler across 4 wavefronts, it should read about 12 cm. Then 12 ÷ 4 = 3.0 cm and v = 8 × 0.030 = 0.24 m/s. In the shallow region, at 2 mm, v = 0.14 m/s, so the wavelength becomes 1.75 cm. A wave arriving at 30 degrees refracts to sin⁻¹(0.5 × 0.14 / 0.243) = 16.7 degrees.

## FAQs

**Why does the wavelength change but not the frequency?** The dipper sets the frequency. When the speed changes, the wavelength must change to keep v = fλ.

**Why do the waves spread more through a narrow gap?** Each point in the gap acts like a new source (Huygens). A narrow gap leaves only a few sources, so the waves leave in all directions.

**Is the real tank speed equal to this one?** Real ripples are also affected by surface tension, so the numbers are a simple model.
