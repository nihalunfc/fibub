---
name: Double star calculator
num: 68
shelf: science
section: stellar-astrophysics
title: "Double star calculator: separation and position angle from an orbit or your own image"
summary: "Predict where the companion of a binary star will be, with separation and position angle from its orbital elements, or measure a double star on your own image by tapping the two stars."
status: live
ads: false
order: 30
icon: star
works: offline
updated: 2026-11-08
related: [radial-velocity-fitter, telescope-calculator, fits-viewer, observing-log, sky-coordinates]
flow:
  - { icon: star, label: "Pair" }
  - { icon: ruler, label: "Measure" }
  - { icon: target, label: "ρ and θ" }
---

## What it does

Double stars are described by two numbers: the **separation ρ**, the angle between the two stars in arcseconds, and the **position angle θ**, the direction of the fainter star B from the brighter star A, measured from north through east. Amateur measurements of both are still collected and used to work out binary orbits.

This calculator does two jobs. **Predict from an orbit** takes the seven orbital elements of a binary and gives ρ and θ on any date. It draws the apparent orbit as it looks on the sky, lists a 12-step ephemeris, and, with the parallax, gives the real size of the orbit and the total mass. **Measure my image** lets you open your own photo, tap the two stars (each tap snaps to the centre of the star's light), and works out ρ and θ from your camera's pixel size, focal length and orientation.

## How to use it

1. Choose **Predict from an orbit**. Pick Sirius or η Coronae Borealis, or type the elements of another binary from the Sixth Orbit Catalog: period P, periastron time T, eccentricity e, semi-major axis a in arcseconds, inclination i, node Ω and periastron argument ω.
2. Pick a **date**. Add the parallax in milliarcseconds to get the mass.
3. Or choose **Measure my image**. Open a photo, tap star A, then star B, or type their pixel positions. Enter your camera's **pixel size** and the telescope's **focal length**, and the **position angle of the image's top** (0° when north is up). Tick **mirrored** if a star diagonal flipped the view.
4. Download the results as a PNG, PDF or Word file.

## How it is worked out

For the prediction, Kepler's equation gives the eccentric anomaly, then the radius r and true anomaly ν. The position angle follows from tan(θ − Ω) = sin(ν + ω) cos i ÷ cos(ν + ω), and the separation from ρ = r cos(ν + ω) ÷ cos(θ − Ω), as in chapter 57 of Meeus's *Astronomical Algorithms*. The mass comes from Kepler's third law in solar units: M = (a/ϖ)³ ÷ P², with a and the parallax ϖ in arcseconds and P in years. For a measurement, the image scale is 206.265 × pixel size (µm) ÷ focal length (mm) arcseconds per pixel. The angle is measured from the image's top, adding its position angle.

## Worked example

Meeus's example for η Coronae Borealis (P = 41.623 years, T = 1934.008, e = 0.2763, a = 0.907″, i = 59.025°, Ω = 23.717°, ω = 219.907°) on 1 January 1980 gives **θ = 318.4°** and **ρ = 0.411″**, exactly as in the book.

For Sirius, with the orbit by Bond and colleagues (2017), the white dwarf Sirius B was closest to Sirius A, about 2.9″ away, at periastron in 1994. It reached its widest, about **11.3″** at θ ≈ 62°, in 2023, which is why it is now easier to see. With the parallax of 379.21 mas the orbit's semi-major axis is 19.8 AU, and the pair weighs **3.07 solar masses**.

## Frequently asked questions

**Why is the position angle measured towards the east, which is to the left?** That is how it looks on the sky with north up: east is to the left, because we look up at the sky from below. Position angle runs north (0°), east (90°), south (180°), west (270°).

**How do I find the orientation of my image?** Turn the drive off and let a star drift: it moves towards the west. Measure the drift direction's angle on the image; the top of the image is at that angle plus 270°. Or plate-solve the image.

**How accurate is a measurement?** A one-pixel error moves the separation by one pixel's worth of arcseconds. Averaging several images, and calibrating the scale on a wide pair with a well-known separation, both help.

**Does my image leave my device?** No. It is opened and measured in your browser, and nothing is uploaded.
