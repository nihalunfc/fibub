---
name: Prism and dispersion
num: 1004
shelf: learn
section: school-physics
title: "Prism and dispersion: refraction through a glass prism, angle of deviation, minimum deviation and the spectrum"
summary: "Shine a ray through a glass prism and see it bend twice: the angles at both faces, the angle of deviation, the deviation graph with its minimum, and white light splitting into a spectrum from red to violet."
status: live
ads: false
order: 1004
icon: eye
works: offline
updated: 2026-11-09
related: [snell-law, lens-ray-diagram, diffraction-patterns]
sources:
  - "Prism relations r₁ + r₂ = A, δ = i + e − A and n = sin((A + δm)/2) / sin(A/2), with Snell's law at each face: standard school optics, as taught in Class 10 and Class 12 physics. Refractive indices for yellow light are rounded general values (crown 1.52, dense flint 1.65, water 1.33, diamond 2.42)."
  - "Colour dependence: Cauchy's formula n = a + b/λ² with rounded, made-up teaching values of b (not data for any real glass). Spectrum colours on screen are approximate."
  - "Checked against an independent Python calculation (math.asin) of the ray path and against a brute-force scan for the minimum deviation."
flow:
  - { icon: sliders, label: "Set prism" }
  - { icon: pointer, label: "Aim the ray" }
  - { icon: chart, label: "Deviation" }
  - { icon: eye, label: "Spectrum" }
---

## What it does

A glass prism bends light twice, once going in and once coming out, and both bends turn the ray towards the prism's base. The total turn is the **angle of deviation** δ. Because glass bends violet light a little more than red, a prism also spreads white light into a **spectrum**: this is **dispersion**, and it is how a rainbow's colours are separated too.

This tool draws a ray through a prism of any angle, gives the angles at both faces, and plots the deviation against the angle of incidence so you can find the **minimum deviation**. Switch to white light to see the spectrum fan out.

It follows the Class 10 Science chapter on the human eye and the colourful world (refraction through a prism, dispersion, the spectrum) and the Class 12 Physics chapter on ray optics (prism formula, minimum deviation). Before this, see a single bend in [[snell-law]]; for colours made by waves instead of by refraction, see [[diffraction-patterns]].

## How to use it

1. Set the **angle of incidence** i and the **prism angle** A with the sliders, and choose what the prism is made of.
2. Read the angles: r₁ at the first face, r₂ at the second, the angle of emergence e, and the deviation δ.
3. The graph shows δ for every angle of incidence that lets light out; the dot is your ray, the dashed line the minimum. **Go to minimum deviation** moves the ray there.
4. **White light** splits the ray into seven colours and gives the spread between violet and red.
5. **Class 12** adds the minimum-deviation formula and solves it for your prism.

## Worked example

The page opens with a 60° crown-glass prism (n = 1.52) and light arriving at i = 50°. Inside, sin r₁ = sin 50° / 1.52, so **r₁ = 30.3°**. Then r₂ = 60° − 30.3° = **29.7°**, and the ray leaves at **e = 48.9°**. The deviation is δ = i + e − A = 50° + 48.9° − 60° = **38.9°**.

That is already very close to the minimum: the graph's minimum for this prism is **δm = 38.9°**, reached at i = e = 49.5°, when the ray inside is parallel to the base. Switch to white light: violet (410 nm) is turned by 40.1° and red (680 nm) by 38.7°, so the spectrum spreads over about 1.4°.

## Things to notice

- Too small an angle of incidence, and the light hits the second face beyond the critical angle and cannot get out. For this prism nothing gets through below about 30°.
- A bigger prism angle or a denser glass gives a bigger deviation, and a wider spectrum.
- At minimum deviation r₁ = r₂ = A/2, which is why measuring δm in a lab gives the refractive index so neatly.

## Check yourself

Four questions with fresh numbers each time: r₂ from r₁, deviation from i and e, minimum deviation from n, and n from the minimum deviation. **Show working** reveals the steps. Nothing is saved or sent anywhere.

## FAQ

**Why does violet bend more than red?** In glass, violet light travels slightly slower than red light, so the glass has a slightly higher refractive index for it.

**Is the spectrum on screen exactly what a real prism makes?** The angles come from the prism formulas, but how much the index changes with colour uses rounded teaching values, so the spread is about right rather than exact for any particular glass.

**Why does the deviation have a minimum?** Very small and very large angles of incidence both make the light hit one face steeply, which bends it a lot. In between, the two bends share the work equally and the total turn is least.

This is a teaching model for school optics. It is not connected to NCERT or any exam board.
