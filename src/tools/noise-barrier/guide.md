---
name: Noise barrier calculator
num: 160
shelf: science
code: T160
section: environmental-engineering
title: "Noise barrier attenuation calculator: insertion loss of a wall or fence by octave band (Maekawa, Fresnel number) and the dB(A) reduction"
summary: "Work out how much a noise barrier cuts the sound at a receiver. Give the heights and distances of the source, barrier and receiver and the sound spectrum without the barrier, and see the path difference, Fresnel number and insertion loss in each octave band, the A-weighted level before and after, and a drawing of the cross-section."
status: live
ads: true
order: 5
icon: ruler
works: offline
updated: 2026-11-09
related: [activated-sludge, detention-pond, gaussian-plume-calculator]
sources:
  - "Path difference and Fresnel number N = 2δ/λ: diffraction over a thin screen, standard acoustics. Barrier attenuation by the Kurze–Anderson closed-form fit to Maekawa's curve (5 + 20·lg(√(2πN)/tanh√(2πN))), or by the simpler 10·lg(3 + 20δ/λ) form used in outdoor propagation methods. Written by fibub from the formulas."
  - "A-weighting at the octave band centres as usually tabulated from the A-weighting curve, rounded to 0.1 dB."
  - "Checked in the tests against an independent NumPy implementation. The example spectrum and layout are made up."
flow:
  - { icon: ruler, label: "Section" }
  - { icon: sliders, label: "Spectrum" }
  - { icon: curve, label: "Diffraction" }
  - { icon: chart, label: "dB(A) cut" }
---

## What it does

A wall, fence or earth bank between a road (or machine) and a house works by making sound travel **over the top** instead of straight through. The extra distance it has to go, the **path difference δ**, decides how much quieter it gets. Low notes have long wavelengths and bend over a barrier easily; high notes are screened much better. So the tool works band by band.

For each octave band from 63 Hz to 8 kHz it works out the wavelength λ, the **Fresnel number** N = 2δ/λ and the **insertion loss** (how much quieter the band gets). It then adds up the A-weighted bands to give the overall level in dB(A) with and without the barrier.

For the air side of the same site, the [[gaussian-plume-calculator]] estimates how a chimney plume spreads.

## How to use it

1. **Cross-section.** Heights of the source, barrier top and receiver, measured from the same ground level, and the distances along the ground from source to barrier and barrier to receiver. For a road use the middle of the near lane, about 0.5 m up for tyre noise. For a window, use its height.
2. **Air temperature.** Sets the speed of sound (343 m/s at 20 °C), which changes the wavelengths slightly.
3. **Method.** *Kurze–Anderson* is a closed-form fit to Maekawa's measured chart; it gives 5 dB when the barrier just touches the line of sight and a little screening even when the line of sight clears the top by a small amount. *Simple* uses 10·lg(3 + 20δ/λ), the form found in outdoor sound propagation methods.
4. **Cap.** Real barriers rarely give more than about 20 dB, because sound also bends round the ends and is scattered by the air. The loss in any band is limited to this value.
5. **Spectrum.** The sound level in each octave band at the receiver without the barrier, unweighted. Leave out a band you have no data for.

## Worked example

The made-up layout: a source 0.5 m high, 10 m from a 4 m wall; a receiver 1.5 m high, 30 m beyond it. The sound over the top travels **686 mm** further than the straight line. At 15 °C, the Fresnel number at 500 Hz is 2.02. With the Kurze–Anderson method the insertion loss runs from 8.4 dB at 63 Hz to the 20 dB cap from 2 kHz up. The made-up road-like spectrum adds up to 76.5 dB(A) without the wall and 59.4 dB(A) with it: **the barrier cuts 17.2 dB(A)**. The simple method gives a 15.2 dB(A) cut.

## FAQs

**Why does a higher barrier help less than I expected?** The loss grows with the logarithm of the path difference, so each extra metre adds less. Moving the barrier closer to the source or the receiver often helps more.

**What about the ground?** Over soft ground, such as grass, sound near the ground is already quieter, and a barrier takes some of that ground effect away. That can make the real benefit smaller than shown here. The tool assumes the ground effect is the same with and without the barrier.

**Does the barrier material matter?** Not for diffraction, as long as little sound goes *through* it: a rule of thumb is a surface mass of at least about 10 kg/m² and no gaps.

**Is anything sent to a server?** No. It all runs in your browser.

For planning or legal decisions, use the method and limits your local authority requires.
