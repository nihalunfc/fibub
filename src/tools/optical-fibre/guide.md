---
name: Optical fibre
num: 1421
shelf: learn
code: L275
section: school-physics
title: "Optical fibre"
summary: "Send a ray of light into a glass fibre and watch it bounce along the core by total internal reflection. Bend the fibre tighter, change the core and cladding, and see when light leaks out, with the critical angle, numerical aperture and acceptance angle worked out."
status: live
ads: false
order: 1421
icon: eye
works: offline
updated: 2026-11-09
related: [snell-law, prism-dispersion, fibre-optic-calculator]
sources:
  - "Snell's law, critical angle sin C = n₂/n₁, numerical aperture NA = √(n₁² − n₂²) and acceptance angle sin θa = NA (from air): standard school and first-year optics, as taught in Class 12 physics (ray optics)."
  - "The fibre in the picture is a made-up teaching shape (core 20 units wide, one 90° bend), not to scale. Index values are rounded examples you can change."
  - "Checked against an independent Python calculation: math.asin for the angles, the bounce count x = a/tan r + 2k·a/tan r for a straight fibre, and a small-step marching ray tracer for the bent fibre."
flow:
  - { icon: pointer, label: "Aim light" }
  - { icon: sliders, label: "Bend it" }
  - { icon: eye, label: "Bounces" }
  - { icon: calculator, label: "Formula" }
---

## What it does

An optical fibre is a thin glass thread with a **core** of slightly higher refractive index wrapped in a **cladding** of lower index. Light inside the core meets the boundary at a grazing angle, bigger than the **critical angle**, so it is **totally internally reflected** every time and bounces all the way to the far end, even round gentle bends. That is how fibres carry phone calls, internet data and the light in an endoscope.

This tool traces one ray through a straight or bent fibre. You choose how steeply the light comes in, how tight the bend is and the two refractive indices, and it shows each reflection, or the point where the ray escapes. It follows the Class 12 Physics chapter on ray optics (total internal reflection and its uses, optical fibres). Before this, see a single boundary and the critical angle in [[snell-law]]; for a real telecom fibre's modes and power budget, try [[fibre-optic-calculator]].

## How to use it

1. Pick **Bent fibre** or **Straight**.
2. Slide the **angle θ** the light makes with the fibre's axis as it enters the flat end.
3. Change the **bend radius** (smaller is tighter), the **core index n₁** and the **cladding index n₂**. Cladding 1.00 means a bare glass rod in air.
4. Read the result: how many reflections it took, or where and why the light leaked out.
5. **Going further** adds the numerical aperture and the acceptance angle: the widest cone of light the fibre can take in.

## Worked example

The page opens with a core of n₁ = 1.50, cladding n₂ = 1.30, light entering at θ = 20° and a bend radius of 100. The critical angle is sin C = 1.30 / 1.50 = 0.8667, so **C = 60.1°**. Entering the glass, the ray bends to r = 13.2° from the axis, so in the straight part it hits the wall at 90° − 13.2° = **76.8°**, well above C: it is totally reflected. Even round the bend it never meets the wall more steeply than C, and it reaches the end after **4 reflections**.

Now drop the bend radius to 60 and θ to 10°: the ray hits the outside of the bend too steeply and leaks out after one reflection. In Going further, NA = √(1.50² − 1.30²) = **0.748** and the acceptance angle is **48.4°**: on the straight fibre, 45° still gets through and 50° does not.

## Things to notice

- Total internal reflection needs two things: light going from the denser medium to the less dense one, and an angle of incidence bigger than C.
- The closer n₂ is to n₁, the larger C and the smaller the acceptance angle: fewer, flatter rays are trapped.
- A sharp kink makes light leak. Real fibres have a minimum bend radius for this reason.

## Check yourself

Four questions with fresh numbers: the critical angle into air, the critical angle at a core-cladding boundary, the refractive index from a critical angle, and a numerical aperture. **Show working** shows the steps. Nothing is saved or sent anywhere.

## FAQ

**Why have a cladding at all? Glass in air traps even more light.** The cladding protects the surface: scratches, dust or a finger on bare glass would let light out. It also keeps rays at shallow angles, so pulses do not spread out as much.

**Is any light lost at a total internal reflection?** In the ideal case none at all, which is why it beats a mirror. Real fibres lose a little to absorption and scattering in the glass.

**Why does the picture look so fat?** A real core is a few to about 50 micrometres across and bends are centimetres wide. The picture squeezes this so you can see each bounce.
