---
name: Snell's law
num: 1003
shelf: learn
code: L3
section: school-physics
title: "Snell's law"
summary: "Aim a ray of light at the boundary between air, water, glass or diamond and see it bend by Snell's law, find the critical angle and total internal reflection, the sideways shift through a glass slab, and why a pool looks shallower than it is."
status: live
ads: false
order: 1003
icon: eye
works: offline
updated: 2026-11-09
related: [lens-ray-diagram, fibre-optic-calculator, mirror-ray-diagram]
sources:
  - "Snell's law n₁ sin i = n₂ sin r, n = c/v, critical angle sin C = n₂/n₁, lateral shift d = t sin(i − r)/cos r and apparent depth = real depth/n: standard school optics, as taught in Class 10 and Class 12 physics. Refractive indices are rounded general values (air 1.00, water 1.33, ice 1.31, kerosene 1.44, crown glass 1.52, dense flint 1.65, diamond 2.42); c = 299 792 458 m/s (SI definition)."
  - "Checked against an independent Python calculation (math.asin) for refraction, critical angles, slab shift and apparent depth."
flow:
  - { icon: sliders, label: "Pick media" }
  - { icon: pointer, label: "Aim the ray" }
  - { icon: eye, label: "See it bend" }
  - { icon: calculator, label: "Formula" }
---

## What it does

Light travels at different speeds in different materials, so a ray that crosses a boundary at a slant changes direction: it **refracts**. This tool lets you aim a ray at the boundary between two materials and see exactly how much it bends, using **Snell's law**, n₁ sin i = n₂ sin r. Three views cover the main ideas:

- **Boundary**: one ray crossing from one material to another, with the normal, the angles i and r, a faint reflected ray, and **total internal reflection** when light in a denser material meets the surface too steeply.
- **Glass slab**: the ray goes in, bends, comes out parallel to where it started, but shifted sideways by the **lateral shift** d.
- **Apparent depth**: a coin in water looks closer to the surface than it is.

It follows the Class 10 Science chapter on light (refraction, refractive index, the glass slab) and the Class 12 Physics chapter on ray optics (Snell's law, total internal reflection, apparent depth). Next, see refraction at curved surfaces in [[lens-ray-diagram]], or how total internal reflection carries light down a glass thread in [[fibre-optic-calculator]].

## How to use it

1. Choose a view: **Boundary**, **Glass slab** or **Apparent depth**.
2. Pick the materials from the lists, or tick **Type my own index** and type any refractive index from 1 to 4.
3. Change the **angle of incidence** with the slider or by dragging in the top half of the picture. **Swap the two media** sends the light the other way.
4. Read the result, the numbers and the worked formula below. **Class 12** adds the speed of light in each material and the critical-angle working.

## Worked example

The page opens with light going from **air (1.00) into crown glass (1.52)** at i = 40°. Then sin r = 1.00 × sin 40° / 1.52 = 0.4229, so **r = 25.0°**: the ray bends towards the normal, by 15.0°. The relative index n₂₁ = 1.52.

Press **Swap** so the light goes from glass into air. At 40° it still escapes, bent away to 77.7°. Push the angle to 42° and it cannot get out: sin r would be 1.017, more than 1, so the light is **totally internally reflected**. The critical angle shows as 41.1° (sin C = 1/1.52).

In **Glass slab** view with a 5 cm slab at 40°, the ray is shifted sideways by **d = 1.43 cm**. In **Apparent depth** view, a coin under 100 cm of water seems only **75.2 cm** deep, raised by 24.8 cm.

## Things to notice

- Going into a denser material (bigger n), light slows down and bends **towards** the normal; going out it bends **away**.
- At i = 0 (straight on) there is no bending at all, whatever the materials.
- Total internal reflection only happens going from a denser into a rarer material, and only beyond the critical angle.
- The slab shift is zero at 0° and grows with the angle and the thickness.

## Check yourself

Four questions with fresh numbers each time: angles of refraction, refractive index from two angles, critical angles, apparent depth and the speed of light in a material. Press **Check**, and **Show working** for the steps. Nothing is saved or sent anywhere.

## FAQ

**Why does a straw look bent in a glass of water?** Light from the part under water bends as it leaves the surface, so that part seems higher than it is: the same effect as apparent depth.

**Why is there always a faint reflected ray?** Some light reflects at every boundary. Only beyond the critical angle does all of it reflect.

**Is the index the same for all colours?** Not quite: glass bends violet light a little more than red, which is how a prism splits white light.

This is a teaching model for school optics. It is not connected to NCERT or any exam board.
