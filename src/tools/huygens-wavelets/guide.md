---
name: Huygens wavelets
num: 1423
shelf: learn
code: L277
section: school-physics
title: "Huygens' principle: wavelets, wavefronts and Snell's law from refraction and reflection"
summary: "Watch a plane wavefront reach a boundary: every point it touches sends out a little wavelet, and the line that touches them all is the new wavefront. Change the angle and the two media and see Snell's law, the law of reflection and total internal reflection come out of the drawing."
status: live
ads: false
order: 1423
icon: eye
works: offline
updated: 2026-11-09
related: [snell-law, double-slit, travelling-wave]
sources:
  - "Huygens' principle and the derivation of Snell's law sin i / sin r = v₁ / v₂ = n₂ / n₁ and of the law of reflection from secondary wavelets: standard wave optics, as taught in Class 12 physics. Speed of light c = 299 792 458 m/s (SI definition), shown rounded as 2.998 × 10⁸ m/s."
  - "Refractive indices are rounded general values (air 1.00, water 1.33, glass 1.50, diamond 2.42)."
  - "Checked against Snell's law (Python math.asin) and by geometry: the drawn wavefront is tangent to every wavelet (distance from each centre equals its radius, to 10⁻⁹)."
flow:
  - { icon: pointer, label: "Wavefront" }
  - { icon: target, label: "Wavelets" }
  - { icon: curve, label: "New front" }
  - { icon: calculator, label: "Snell's law" }
---

## What it does

Christiaan Huygens pictured light as a wave and suggested a simple rule: **every point on a wavefront acts as a source of small secondary wavelets**, and a moment later the new wavefront is the surface that touches all of them. With that rule alone you can explain why light reflects at equal angles and why it bends when it enters glass.

This tool shows the rule at work. A flat (plane) wavefront arrives at an angle at the boundary between two media. The left end touches first and starts a wavelet; the touching point slides to the right, starting more wavelets as it goes. Because light is slower in the denser medium, those wavelets grow more slowly, and the straight line that touches them all, the **refracted wavefront**, is tilted. Its angle obeys **Snell's law**. It follows the Class 12 Physics chapter on wave optics (Huygens' principle, refraction and reflection of plane waves). The ray picture of the same bend is in [[snell-law]]; the same wavelets spreading from two slits make the fringes in [[double-slit]].

## How to use it

1. Choose **Refraction** or **Reflection**.
2. Set the **angle of incidence i** and the **top** and **bottom media**.
3. Drag **Time** from 0 to 100% of τ (the time the wavefront takes to sweep from A to C), or press **Play**.
4. Change how many **wavelets** are drawn: a single straight line still touches all of them.
5. Read the result: the angle of the new wavefront, the speeds, and the working that turns the drawing into Snell's law.

## Worked example

The page opens with light going from air into glass at i = 40°. In air v₁ = 2.998 × 10⁸ m/s; in glass v₂ = c / 1.50 = 1.999 × 10⁸ m/s.

In time τ the far end of the wavefront travels BC = v₁τ in air, while the wavelet from A grows to AE = v₂τ in glass. Both triangles share the side AC, so sin i = BC / AC and sin r = AE / AC, which gives sin r = (v₂ / v₁) sin i = 0.667 × 0.643 = 0.4285, and **r = 25.4°**. That is exactly Snell's law, 1.00 × sin 40° = 1.50 × sin 25.4°. The wavelength in glass is also 0.667 times the wavelength in air, since the frequency stays the same.

## Things to notice

- Going into a slower medium the wavefront turns so that the ray bends **towards** the normal; into a faster one, away from it.
- From water into air at 60°, sin r would be 1.15: impossible. The wavelets in air run ahead of the contact point and no line can touch them all. That is total internal reflection.
- In reflection the wavelets grow at the incoming speed, so AE = BC and the angles are equal.

## Check yourself

Four questions with fresh numbers: a refraction angle, a speed in a medium, a wavelength in glass, and a refractive index from two angles. Nothing is saved or sent anywhere.

## FAQ

**Why are only half circles drawn?** Huygens' wavelets would spread backwards too, but no light goes backwards in practice; later work by Fresnel and Kirchhoff explained why. Only the forward half is drawn.

**Is a wavefront the same as a ray?** No. A wavefront joins points that vibrate in step; rays are the lines at right angles to it, showing which way the light travels.

**Does the frequency change at the boundary?** No. The speed and wavelength change together; the frequency is set by the source.
