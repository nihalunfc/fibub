---
name: Double slit
num: 1422
shelf: learn
code: L276
section: school-physics
title: "Double slit"
summary: "See the bright and dark fringes of Young's double slit on a screen and as a graph. Change the wavelength, slit gap and screen distance and watch β = λD/d, check the path difference at any point, switch to white light, and compare with a single slit's wide central maximum."
status: live
ads: false
order: 1422
icon: eye
works: offline
updated: 2026-11-16
related: [huygens-wavelets, travelling-wave, diffraction-patterns, prism-dispersion]
sources:
  - "Fringe width β = λD/d, bright fringes at x = nβ and dark at (n − ½)β, single-slit minima a sin θ = nλ and the Fraunhofer intensity sinc²·cos²: standard wave optics, as taught in Class 12 physics."
  - "Wavelength-to-colour mapping: a common piecewise approximation for screens (after Dan Bruton's public description); colours are approximate."
  - "Checked against an independent Python calculation: β, the minima and the exact path difference with math, and the intensity curve against a numerical Huygens sum of 20 000 point sources across each slit (numpy)."
  - "The calculator uses the usual small-angle formulas and warns when x/D is above 0.1. Checked by hand: 600 nm, d = 0.25 mm, D = 1 m gives β = 2.4 mm; 600 nm, a = 0.05 mm, D = 1 m gives a central maximum 24 mm wide; the 2nd dark fringe for 650 nm, d = 1 mm, D = 2 m is at 1.95 mm."
flow:
  - { icon: sliders, label: "Set slits" }
  - { icon: eye, label: "Fringes" }
  - { icon: chart, label: "Brightness" }
  - { icon: calculator, label: "β = λD/d" }
---

## What it does

Thomas Young shone one light through two narrow slits close together. On a screen beyond, instead of two bright lines, he saw a row of evenly spaced bright and dark bands, or **fringes**. Light from the two slits travels different distances to each point; where the path difference is a whole number of wavelengths the waves arrive in step and add up (bright), and where it is a half number they cancel (dark). That was strong evidence that light is a wave.

This tool draws the fringes as they would look on the screen, plots the brightness across it, and works out the **fringe width β = λD/d** with your numbers. You can put a point P anywhere and read its path difference, switch to **white light**, or close one slit to see **single-slit diffraction**. It follows the Class 12 Physics chapter on wave optics (interference, Young's experiment, diffraction at a single slit). To see why light spreads out of a slit at all, start with [[huygens-wavelets]]; the same adding of waves on a string is in [[travelling-wave]], and a research-level version with gratings and round holes is [[diffraction-patterns]].

## How to use it

1. Pick **Double slit** or **Single slit**, and **One colour** or **White light**.
2. Slide the **wavelength λ**, the **slit separation d** (double slit only), the **slit width a** and the **distance D** to the screen.
3. Move **point P** along the screen. The red marker and the dashed line on the graph show where it is; the facts give the path difference there in wavelengths.
4. Tick **Also show the other pattern** to draw the single-slit curve under the double-slit one (or the other way round).

## Worked example

The page opens with red-orange light, λ = 600 nm, slits d = 0.25 mm apart, each a = 0.05 mm wide, and a screen D = 1 m away. Then

β = λD/d = 600 × 10⁻⁹ × 1 / 0.25 × 10⁻³ = **2.4 mm**.

The third bright fringe is 3β = **7.2 mm** from the centre and the first dark one is at β/2 = **1.2 mm**. P starts at 3.6 mm, where the path difference is d x / D = 900 nm = **1.5 λ**: a dark fringe.

Switch to a single slit of the same width: the first minima are where a sin θ = λ, so the central maximum is about 2λD/a = **24 mm** wide, ten times the double-slit fringe width. In fact the double-slit fringes sit inside this wide envelope, about 2d/a = 10 of them in the central band.

## Things to notice

- β grows with λ and D, and shrinks as d grows. That is why the experiment needs slits a fraction of a millimetre apart.
- With white light the central fringe is white (every colour has zero path difference there). The next fringes are coloured, and soon the colours overlap and wash out.
- A single slit's central maximum is twice as wide as the others and much brighter. Narrow the slit and it spreads more.

## Check yourself

Four questions with fresh numbers: a fringe width, a wavelength from the fringe width, the position of the nth bright fringe, and the width of a single slit's central maximum. Nothing is saved or sent anywhere.

## Solve your own numbers

The first card solves the standard Class 12 problems without needing the sliders. Choose what to find: the fringe width β, the wavelength, the slit separation, the screen distance, or the position of the nth bright or dark fringe. Type the other values with their units (nm, µm or Å for wavelength; mm, µm, cm or m for lengths) and the answer appears in one sentence, followed by the working: the formula β = λD/d, the conversions to metres, the numbers substituted and the result. For a bright fringe the page also gives the path difference as a whole number of wavelengths, and for a dark fringe a half-odd number.

Open **Single slit** for the central maximum: the width 2λD/a, the position of the nth dark minimum, or the wavelength, slit width or screen distance from a measured width. A slit narrower than the wavelength has no minimum, and the page says so rather than showing a wrong number. If the angle is large, a note warns that the small-angle school formula is only approximate.

The most common mistake is mixing d (the gap between the two slits) with a (the width of one slit), or leaving d in mm while the wavelength is in nm. The working shows every conversion, so you can copy it into an answer.

## FAQ

**Why are the double-slit fringes not all equally bright here?** Each slit has a width, so each one also diffracts, and its single-slit pattern acts as an envelope. With very narrow slits all fringes would be equally bright.

**Is the fringe width the same for bright and dark fringes?** Yes: the distance between two neighbouring bright fringes equals the distance between two neighbouring dark ones, β.

**Does the tool use the small-angle approximation?** The graph and screen use the exact angle. The formulas in the working use the usual school approximations, which agree to better than 0.1% here.

**How do I calculate the fringe width in Young's double slit experiment?** β = λD/d, with the wavelength, screen distance and slit separation all in metres; type them into the calculator at the top for the answer and the working.

**How wide is the central maximum of a single slit?** 2λD/a, which the Single slit calculator works out for you.
