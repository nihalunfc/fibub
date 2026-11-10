---
name: EM wave 3D
num: 1418
shelf: learn
section: school-physics
title: "EM wave 3D"
summary: "Watch an electromagnetic wave travel: the electric field waves up and down, the magnetic field side to side, both at right angles to the direction of travel and in step. Change the wavelength from gamma rays to radio and the field strength, turn the view, and get the frequency, B₀ = E₀/c, the intensity and c = 1/√(µ₀ε₀)."
status: live
ads: false
order: 1418
icon: curve
works: offline
updated: 2026-11-09
related: [em-spectrum, displacement-current, travelling-wave, photoelectric-lab]
sources:
  - "Plane electromagnetic wave in vacuum: E ⊥ B ⊥ direction of travel, B₀ = E₀/c, c = 1/√(µ₀ε₀), f = c/λ, intensity I = ½cε₀E₀², average energy density ½ε₀E₀². Standard physics results. ε₀ = 8.8541878188 × 10⁻¹² F/m and µ₀ = 1.25663706127 × 10⁻⁶ N/A² (CODATA 2022, NIST); c = 299 792 458 m/s exactly."
  - "Checked against an independent Python script, including c computed from ε₀ and µ₀."
flow:
  - { icon: curve, label: "See E and B" }
  - { icon: sliders, label: "Wavelength" }
  - { icon: calculator, label: "f, B₀, I" }
  - { icon: check, label: "Check" }
---

## What it does

Maxwell showed that a changing electric field makes a magnetic field and a changing magnetic field makes an electric field, so the two can keep each other going and travel through empty space as a **wave**. Light, radio and X-rays are all such electromagnetic (EM) waves.

In an EM wave in empty space:

- the electric field **E** and the magnetic field **B** are at right angles to each other,
- both are at right angles to the direction the wave travels (it is a transverse wave),
- they rise and fall together (in phase), with B₀ = E₀/c,
- and the wave travels at c = 1/√(µ₀ε₀), about 3 × 10⁸ m/s, whatever its wavelength.

This page draws two wavelengths of the wave in 3D and keeps it moving. The electric field is drawn up and down, the magnetic field side to side. Turn the view to see that they stay at right angles. Slide the wavelength from 1 nm to 1 km, and the page names the band and gives the frequency and period; set the peak electric field and it gives the peak magnetic field, the intensity and the energy density.

It follows the electromagnetic waves chapter of Class 12 Physics (displacement current, sources and nature of EM waves, the EM spectrum). See where the wave's magnetic field comes from in [[displacement-current]], place your wavelength among all the others in the [[em-spectrum]], and compare with waves on a string in [[travelling-wave]].

## How to use it

1. Slide the **wavelength** (a log scale from 1 nm to 1 km). The picture always shows two wavelengths, so it looks the same for every band.
2. Slide the **peak electric field** E₀ (1 to 1000 V/m).
3. **Turn the view** to look from the side, from above at an angle, or along the wave.
4. **Pause** and **Play** the wave. If your device asks for reduced motion, it starts paused.

## Worked example

The page opens with λ = 3.02 m (an FM radio wave) and E₀ = 10 V/m.

- f = c / λ = 3 × 10⁸ / 3.02 = **99.3 MHz**, and one cycle takes T = 1/f = 10.1 ns.
- B₀ = E₀ / c = 10 / 3 × 10⁸ = **3.34 × 10⁻⁸ T**, far smaller than the Earth's field (about 5 × 10⁻⁵ T).
- I = ½ c ε₀ E₀² = ½ × 3 × 10⁸ × 8.85 × 10⁻¹² × 10² = **0.133 W/m²**.
- c = 1/√(µ₀ε₀) = 1/√(1.257 × 10⁻⁶ × 8.854 × 10⁻¹²) = 3 × 10⁸ m/s.

## Tips

- Doubling E₀ doubles B₀ but makes the intensity four times bigger, because I ∝ E₀².
- The direction of travel is along E × B: turn E towards B with your right hand and your thumb points the way the wave goes.
- In a material, EM waves travel slower than c, by the refractive index. This page is for empty space.

## FAQ

**Why is the magnetic field drawn the same size as the electric field?** They have different units, so they cannot be drawn to one scale. Both are drawn to show their shape and timing; the numbers give their real sizes.

**Does the wave need a medium?** No. EM waves travel through empty space, which is how sunlight reaches us.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.
