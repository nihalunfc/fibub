---
title: "How to find the angle of refraction with Snell's law"
summary: "Use n₁ sin i = n₂ sin r: multiply, divide by n₂, then take inverse sine. Worked example for air into water, plus how to spot total internal reflection."
tools: [snell-law, prism-dispersion, lens-ray-diagram]
updated: 2026-11-10
sources:
  - "Snell's law n₁ sin i = n₂ sin r and the critical angle sin C = n₂/n₁: standard school and first-year university optics."
  - "Refractive indices are rounded everyday values for yellow light: air 1.00, water 1.33."
---

To find the angle of refraction, rearrange Snell's law to sin r = n₁ sin i / n₂ and take the inverse sine of the result; if that sine comes out bigger than 1, no refracted ray exists and the light is totally reflected. The [[snell-law]] page does this as you move the angle, draws the bent ray and prints the working line by line.

## What you need

- **The angle of incidence i**, in degrees. It is measured from the **normal**, the imaginary line at right angles to the surface, not from the surface itself. If a question gives the angle to the surface, subtract it from 90° first.
- **The refractive index of each material.** n₁ is where the light starts, n₂ is where it goes. Typical values are air 1.00, water 1.33 and crown glass about 1.52. A bigger n means light travels more slowly in that material.
- A calculator in **degree mode** if you want to check by hand. Radian mode is the most common reason for a wildly wrong answer.

## Step by step

1. **Open the Snell's law page and stay on Boundary.** Two other views exist (Glass slab and Apparent depth), but the plain angle question lives here.
2. **Pick the top and bottom media.** The light travels from top to bottom. For an index that is not on the list, tick **Type my own index** and enter any value from 1 to 4.
3. **Set the angle of incidence.** Use the slider (0° to 89°, in whole degrees) or drag in the top half of the picture to aim the ray.
4. **Read r.** The large line gives the angle of refraction and says whether the ray bends towards or away from the normal. The box beneath shows the working, the deviation |i − r| and, when one exists, the critical angle.
5. **Press Swap the two media** to send the light the other way, for example from water out into air.

The formula behind it all:

n₁ sin i = n₂ sin r, so sin r = (n₁ × sin i) / n₂, and r = sin⁻¹(sin r)

One rule of thumb saves a lot of errors: going into a slower (higher n) material, r is **smaller** than i; going into a faster (lower n) material, r is **larger**.

## A worked example

A torch beam in air hits a calm pond at **55°** to the normal. What angle does it make with the normal under the water?

- n₁ = 1.00 (air), n₂ = 1.33 (water), i = 55°.
- sin 55° = 0.8192.
- sin r = 1.00 × 0.8192 / 1.33 = 0.6159.
- r = sin⁻¹(0.6159) = **38.0°**.

The beam bends 17.0° towards the normal, as it should when going into the slower material. Set air on top, water below and the slider to 55°, and the page reads r = 38° (it rounds to three significant figures, so the trailing zero is dropped).

Now turn it round. A light at the bottom of the pond shines up at the surface at **50°** to the normal. Press **Swap the two media**:

- sin r = 1.33 × sin 50° / 1.00 = 1.33 × 0.7660 = 1.019.

No angle has a sine above 1, so there is no refracted ray at all. All of the light reflects back down: **total internal reflection**. The page says so and gives the critical angle for water into air, C = sin⁻¹(1/1.33) = **48.8°**. Any underwater ray steeper than that stays trapped. Move the slider below 48.8° and the ray escapes again, bent away from the normal.

Want to see the same law split white light into colours? The [[prism-dispersion]] page applies it twice, once at each face of a prism. For curved glass surfaces, the [[lens-ray-diagram]] takes over.

## Check your answer

- **Put it back in.** 1.33 × sin 38.0° = 0.8188, which matches sin 55° = 0.8192 to three figures. Both sides of Snell's law should agree.
- **Direction.** Into water, r must be smaller than i. 38.0° is less than 55°, so the bend is the right way.
- **Straight on.** At i = 0°, r is 0° whatever the materials. If your method gives anything else at 0°, the setup is wrong.
- **Too-big sines.** A sine above 1 is not a mistake to round away. It is the sign of total internal reflection, and it can only happen going from a higher n to a lower n.

## Questions people ask

**Do I measure the angle from the surface or the normal?** From the normal, every time. An angle of 30° to the surface is 60° to the normal.

**Does the colour of the light matter?** Slightly. Glass and water bend violet a little more than red, because n changes with wavelength. For school questions one rounded value of n is used.

**How do I find the refractive index from two angles?** Rearrange the same law: n₂ = n₁ sin i / sin r. With air as the first medium, that is simply sin i / sin r.
