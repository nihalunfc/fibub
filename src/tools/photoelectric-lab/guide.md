---
name: Photoelectric effect lab
num: 1067
shelf: learn
code: L31
section: school-physics
title: "Photoelectric effect lab: frequency, brightness and voltage, current against voltage, stopping potential, find h and the work function"
summary: "Shine light on caesium, sodium, zinc and other metals. Change the frequency, brightness and collector voltage, watch the current, and record the stopping potential at several frequencies to measure Planck's constant and the work function from a straight line."
status: live
ads: false
order: 1067
icon: flask
works: offline
updated: 2026-11-09
related: [kinetic-theory, spectral-line-identifier, hydrogen-orbitals]
sources:
  - "Einstein's photoelectric equation K_max = hf − φ = eV₀, threshold frequency f₀ = φ/h, photon energy E = hc/λ: standard physics."
  - "Planck constant h = 6.62607015 × 10⁻³⁴ J s, elementary charge e = 1.602176634 × 10⁻¹⁹ C, speed of light c = 299,792,458 m/s (SI, exact); electron mass 9.1093837 × 10⁻³¹ kg (CODATA 2018)."
  - "Work functions are typical rounded values (caesium 2.1, potassium 2.3, sodium 2.4, zinc 4.3, copper 4.7, platinum 5.6 eV); measured values vary with the surface. The shape of the current curve is a simple teaching model written for this page."
  - "Checked against an independent Python calculation written for the tests."
flow:
  - { icon: sliders, label: "Light" }
  - { icon: chart, label: "I–V curve" }
  - { icon: ruler, label: "Fit h" }
  - { icon: check, label: "Check" }
---

## What it does

When light falls on a clean metal, it can knock electrons out of it. The surprise that led to quantum physics is *which* light does it: dim violet light can set electrons free from caesium straight away, while the brightest red light never does. Einstein explained it: light comes in packets (**photons**) of energy hf, and one photon gives all its energy to one electron. If hf is less than the **work function** φ (the energy needed to leave the metal), nothing happens, however many photons arrive. This page lets you change the **frequency**, **brightness** and **collector voltage**, watch the electrons fly, and draw the **current against voltage**. Then record the **stopping potential** at several frequencies and fit a straight line to measure **Planck's constant** and the work function yourself.

It follows the school topics on light and matter: Class 12 Physics, Dual Nature of Radiation and Matter (electron emission, the photoelectric effect, the effect of intensity, potential and frequency, Einstein's photoelectric equation, the photon), and the photoelectric effect in Class 11 Chemistry, Structure of Atom. Next, [[spectral-line-identifier]] matches the photons that atoms give out to real spectral lines, [[hydrogen-orbitals]] shows where the electron sits in an atom, and [[kinetic-theory]] is another place where energy per particle explains a whole experiment.

## How to use it

1. Pick a **metal**. Its work function is shown in the list.
2. Set the **light frequency** (the colour, or ultraviolet beyond violet) and the **brightness**.
3. Set the **collector voltage**. Positive pulls the electrons across; negative pushes them back.
4. Read the current and the working: photon energy hf, the largest kinetic energy K_max = hf − φ, and the **stopping potential** V₀.
5. In **Current against voltage**, press **Keep this curve**, change one thing, and compare.
6. In **Find Planck's constant**, press **Record V₀** at three or more frequencies. The page fits a straight line: its slope is h/e and it crosses the axes at −φ/e and the threshold frequency f₀.

## Worked example

With the page as it opens: caesium (φ ≈ 2.1 eV), light of 7.0 × 10¹⁴ Hz (428 nm, violet), brightness 60%, collector at +1 V. Each photon carries hf = 6.626 × 10⁻³⁴ × 7 × 10¹⁴ J = 2.895 eV. The fastest electrons leave with K_max = 2.895 − 2.1 = 0.795 eV (about 529 km/s), so the stopping potential is V₀ = 0.795 V. The threshold for caesium is f₀ = φ/h = 5.078 × 10¹⁴ Hz, a wavelength of 590 nm: yellow light just works, red does not.

For potassium (φ ≈ 2.3 eV), record V₀ at 6, 8, 10 and 12 × 10¹⁴ Hz: 0.181, 1.009, 1.836 and 2.663 V. The line through them has slope 4.136 × 10⁻¹⁵ V s, so h = slope × e = 6.626 × 10⁻³⁴ J s, and the work function comes out as 2.3 eV.

## Check yourself

Five questions, fresh each time: the energy of a photon, the largest kinetic energy of the electrons, the threshold wavelength of a metal, a stopping potential, and what brighter red light does. Nothing is saved.

## Tips

- Brightness changes **how many** electrons come out (the saturation current). Frequency changes **how fast** the fastest ones are (the stopping potential).
- A handy shortcut: photon energy in eV ≈ 1240 / wavelength in nm.
- Zinc, copper and platinum need ultraviolet light; that is why early experiments used ultraviolet lamps on zinc.

## FAQ

**Why does a negative voltage not stop all the electrons at once?** Electrons come out with a spread of energies, from zero up to K_max. A small negative voltage stops only the slow ones; at −V₀ even the fastest are turned back.

**Why is the line the same slope for every metal?** The slope is h/e, which is a constant of nature. Only the work function, and so the crossing points, change from metal to metal.

**Is this from NCERT?** No. It is an independent study aid that follows the same school topics, with its own pictures and numbers.
