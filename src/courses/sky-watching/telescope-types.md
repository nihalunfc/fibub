---
title: "Refractors, reflectors and catadioptrics"
summary: "Telescopes come in three families: refractors use lenses, reflectors use mirrors, and catadioptrics use both. Each trades cost, size, upkeep and image quality differently."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "Which design gives the most aperture for the money?"
    choices: ["Apochromatic refractor", "Newtonian reflector", "Schmidt-Cassegrain"]
    ans: 1
    why: "A Newtonian needs only one curved mirror and a flat, so large apertures are affordable, especially on a Dobsonian mount."
  - q: "What is collimation?"
    choices: ["Cooling the telescope", "Lining up the mirrors so their optical axes match", "Cleaning the lens"]
    ans: 1
    why: "Reflectors need their mirrors aligned now and then; it takes a few minutes with a simple tool."
  - q: "Why does a Schmidt-Cassegrain fit a 2,000 mm focal length into a short tube?"
    choices: ["It folds the light path back on itself with a secondary mirror", "It uses a stronger lens", "It uses a camera"]
    ans: 0
    why: "The light goes down the tube, back up to the secondary mirror, and down again through a hole in the main mirror."
sources: []
---

**Module 4 · about 20 minutes · no maths needed.** You'll be able to name the main telescope designs, trace the light path in each, and match a design to what you want to observe.

## 1. Why this matters

Telescope shops are full of jargon: achromat, apo, Newtonian, Dob, SCT, Mak, RC. Each name describes how the light is gathered and folded. Knowing the families helps you understand specifications and choose (Lesson 4.7), and the same designs scale up to research telescopes.

## 2. Three families

<!--fig:scope-types-->

**Refractors** (lenses). An **achromat** pairs two glasses to bring red and blue roughly together; an **apochromat** ("apo") uses three elements or special low-dispersion glass for nearly perfect colour. Sharp, high-contrast images, no cooling time, no collimation, but expensive per millimetre of aperture. Small apos are the favourite astrophotography telescope.

**Reflectors** (mirrors). The **Newtonian** (Isaac Newton, 1668) uses a parabolic main mirror and a flat diagonal that sends light out of the side of the tube. On a simple swinging base, the **Dobsonian** (John Dobson, 1960s), it is the cheapest way to get a big aperture. Professional observatories use **Ritchey-Chrétien** reflectors (two hyperbolic mirrors), as in the Hubble Space Telescope, for sharp, wide, colour-free fields.

**Catadioptrics** (both). A thin corrector lens at the front plus mirrors. The **Schmidt-Cassegrain (SCT)** and **Maksutov-Cassegrain** fold a long focal length into a short tube: compact, easy to carry, good for planets and small objects, with narrower fields.

## 3. Things every design deals with

- **Central obstruction.** Reflectors and catadioptrics have a secondary mirror in the light path. It blocks a little light and moves some light from the Airy disc into the rings, slightly softening contrast on planets. Refractors have none.
- **Cooling.** A mirror warmer than the night air creates turbulence inside the tube. Big mirrors need 30 to 60 minutes outside to settle.
- **Collimation.** Mirrors must be aligned. Newtonians need a quick check each session; SCTs rarely; refractors almost never.
- **Dew.** Exposed lenses and corrector plates fog up on humid nights; dew shields and gentle heaters fix it.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the effective focal length of a two-mirror system depends on how the secondary mirror magnifies the image of the primary.

**Equation:** if the primary has focal length `$f_1$` and the convex secondary magnifies its image by `$m_2$` (typically 4 to 5 in an SCT), the system's effective focal length is

```math
F = m_2 \, f_1
```

**Central obstruction** as a fraction of area: `$(d_s/D)^2$`, where `$d_s$` is the secondary's diameter.

**Try it:** an SCT with a 200 mm f/2 primary (400 mm) and a secondary magnifying 5 times: `$F = 2000$` mm, f/10. A 70 mm secondary blocks `$(70/200)^2 = 12\%$` of the area.
</details>

## 4. Worked example

*Two 200 mm telescopes compared.* A 200 mm f/6 Newtonian (1,200 mm) and a 203 mm f/10 SCT (2,032 mm).

- Light grasp and resolution: essentially the same, set by aperture.
- With a 30 mm eyepiece: Newtonian 40×, SCT 68×. The Newtonian shows a wider field (good for big clusters and nebulae); the SCT reaches high power easily (planets).
- Tube length: about 1.2 m for the Newtonian, about 0.45 m for the SCT. The SCT is easier to carry and mount; the Newtonian costs less.

## 5. Practice

1. Which design would you choose for wide-field photos of large nebulae on a small budget? Why?
2. What is the main reason refractors stay small?
3. A 150 mm Newtonian has a 35 mm secondary. What fraction of the light does it block?

<details>
<summary>Answers</summary>

1. A small apochromatic refractor (sharp, colour-free wide fields, light enough for an affordable tracking mount), or a fast Newtonian with a coma corrector for more aperture.
2. Big lenses are very expensive to make and can only be held by their edges, so they sag.
3. `$(35/150)^2 = 5.4\%$`.
</details>

**Try it with real numbers:** compare focal ratio, field and resolution of different designs with the [[telescope-calculator]].

**New words:** *refractor*, *achromat*, *apochromat*, *Newtonian*, *Dobsonian*, *Schmidt-Cassegrain*, *Maksutov*, *Ritchey-Chrétien*, *central obstruction*, *collimation*.
