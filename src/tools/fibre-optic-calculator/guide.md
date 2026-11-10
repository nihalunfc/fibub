---
name: Fibre optic calculator
num: 934
shelf: science
code: T669
section: optics-and-photonics
title: "Fibre optic calculator: numerical aperture, V-number, modes, dispersion and link loss budget"
summary: "From a fibre's core and cladding indices, core size and wavelength, get the numerical aperture, acceptance angle, V-number, single-mode cut-off, the guided LP modes, effective index and mode-field diameter, then pulse spreading, bandwidth and a full link power budget."
status: live
ads: true
order: 5
icon: link
works: offline
updated: 2026-11-09
related: [gaussian-beam, link-budget-calculator, uncertainty-calculator, sellmeier-fitter, polarisation-calculator, lens-ray-tracer, constellation-ber]
sources:
  - "Step-index fibre optics under weak guidance (LP modes, cut-offs at Bessel function zeros, the LP01 eigenvalue equation): Gloge, D. (1971), Applied Optics 10, 2252; Snyder, A. W. and Love, J. D., Optical Waveguide Theory; Saleh and Teich, Fundamentals of Photonics, chapter 9."
  - "Mode-field radius approximation w/a = 0.65 + 1.619 V^−1.5 + 2.879 V^−6: Marcuse, D. (1977), Bell System Technical Journal 56, 703. Modal and chromatic pulse spreading and dB power budgets: standard textbook results (for example Keiser, Optical Fiber Communications)."
  - "Checked against SciPy (jv, kv, jn_zeros, and brentq on the LP01 equation) and hand sums. The three example fibres and links use rounded, made-up values, not any manufacturer's data sheet."
flow:
  - { icon: sliders, label: "Fibre" }
  - { icon: target, label: "Modes" }
  - { icon: clock, label: "Spreading" }
  - { icon: calculator, label: "Budget" }
---

## What it does

An optical fibre traps light in its core because the core's refractive index n₁ is a little higher than the cladding's n₂. How much light it accepts, how many ways (modes) the light can travel, how much a pulse spreads out, and how far a signal can go before it is too weak are all worked out here from a few numbers.

Work out the core glass's index with the [[sellmeier-fitter|Sellmeier fitter]], and size the beam you launch into the fibre with the [[gaussian-beam|Gaussian beam calculator]].

## How to use it

1. Pick an example or type your fibre: **core index n₁**, **cladding index n₂**, **core diameter** in µm, the **wavelength**, and whether the index is a **step** or a **graded (parabolic)** profile.
2. For **pulse spreading**, give the link length, the fibre's **chromatic dispersion D** at your wavelength (from its data sheet) and the source's **spectral width**.
3. For the **power budget**, give the transmitter power and receiver sensitivity in dBm, the fibre loss in dB/km, the numbers of connector pairs and splices with their losses, and a safety margin.

## What the results mean

- **Numerical aperture** NA = √(n₁² − n₂²) sets the **acceptance angle**: light arriving within ±asin(NA) of the axis is guided.
- **V-number** V = 2πa·NA/λ (a is the core radius). A step-index fibre carries only one mode (LP01, in two polarisations) when V < 2.405; the **cut-off wavelength** is where V = 2.405.
- **Guided modes:** each LP mode stops being guided below its cut-off V, which is a zero of a Bessel function. The table lists them, and the total grows like V²/2.
- **Effective index and mode-field diameter** of the single mode: the effective index comes from solving the exact LP01 equation; the mode-field diameter uses Marcuse's Gaussian fit.
- **Modal spreading:** in a multimode fibre, steep rays travel further than straight ones. Grading the index evens out their speeds, cutting the spread by roughly Δ/8.
- **Chromatic spreading:** different colours travel at different speeds, |D| × length × spectral width.
- **Budget:** losses in dB simply add. The link works if the received power stays above the sensitivity plus the margin.

## Worked example

The default single-mode example is made up: n₁ = 1.45, n₂ = 1.445, an 8 µm core, at 1550 nm. The page gives **NA 0.120**, an acceptance half-angle of 6.91°, **V = 1.951**, so it is single-mode, with a cut-off at 1257 nm. The exact LP01 solution gives b = 0.3999 and an effective index of 1.44700; the mode-field diameter is about 10.4 µm. Over **80 km** with D = 17 ps/(nm·km) and a 0.1 nm laser, pulses spread by **136 ps** (bandwidth about 3.24 GHz). The budget: 20 dB of fibre, 1 dB of connectors and 0.8 dB of splices make **21.8 dB**, so 0 dBm in gives −21.8 dBm at the receiver: it **works with 3.2 dB to spare** after the 3 dB margin, and the longest possible link is 92.8 km.

The multimode step-index example (50 µm core, 850 nm) has V = 44.8 and 1,022 modes; modal spreading of **67.6 ns** over just 1 km limits it to a few MHz, which is why graded-index fibre (third example) is used instead.

## FAQ

**Where do I find D and the losses?** On your fibre and component data sheets. Values change with wavelength; the examples are rounded, made-up teaching values.

**Is the bit rate exact?** No. 0.44 ÷ spread and 1 ÷ (2 × spread) are rules of thumb; real links depend on the modulation format and receiver.

**Is it good enough to sign off a link?** It is for study and planning, not a substitute for professional judgement and measurement with a power meter and an OTDR.
