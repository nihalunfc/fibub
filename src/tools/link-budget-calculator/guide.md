---
name: Link budget calculator
num: 59
shelf: science
section: spaceflight-and-astrodynamics
title: "Link budget calculator: CubeSat and radio link margin, EIRP, path loss, C/N0 and Eb/N0"
summary: "Work out whether a radio link will close: a CubeSat downlink, a ground station or a point-to-point link. Gives EIRP, free-space loss, G/T, C/N0, Eb/N0, the margin, the fastest data rate and the margin through a satellite pass."
status: live
ads: true
order: 12
icon: sliders
works: offline
updated: 2026-11-08
related: [radio-telescope-calculator, orbit-transfer-calculator, rocket-equation, uncertainty-calculator]
sources:
  - "Physical constants: CODATA recommended values (NIST)."
flow:
  - { icon: sliders, label: "Radio" }
  - { icon: ruler, label: "Distance" }
  - { icon: check, label: "Margin" }
---

## What it does

A link budget adds up every gain and loss between a transmitter and a receiver to see whether enough signal arrives to decode the data. It is the first sum in any satellite, CubeSat or long-range radio design. This calculator works it through line by line, from transmit power and antenna gains to free-space loss, noise and the energy per bit. It gives the margin left over, the fastest data rate that would still work, and a chart of the margin through a satellite pass from horizon to overhead.

To see when the satellite passes over your station, use the [[satellite-tracker]]; for the receiving dish itself, the [[radio-telescope-calculator]].

## How to use it

1. Pick an **example** or type your own **frequency**.
2. For a satellite, type its **altitude** and the **elevation** you want to plan for. Low elevations are the worst case, as the satellite is furthest away. Or type a fixed **distance**.
3. Fill in the **transmitter**: power in watts, antenna gain in dBi, and cable losses.
4. Fill in the **receiver**: antenna gain, or a dish size and efficiency, plus cable losses and the **system noise temperature**.
5. Add **path losses**: atmosphere and rain, polarisation mismatch (3 dB for linear against circular), and pointing.
6. Type the **data rate**, the **modulation** and the bit error rate you need, and an **implementation loss** for real hardware.

## How it is worked out

- EIRP = transmit power + antenna gain − losses (dBW).
- Free-space path loss = 20 log₁₀(4πdf/c).
- Dish gain = 10 log₁₀(η (πDf/c)²).
- C/N₀ = EIRP − path and other losses + G/T − Boltzmann's constant (−228.6 dBW/K/Hz).
- Eb/N₀ = C/N₀ − 10 log₁₀(data rate).
- The required Eb/N₀ comes from the bit error rate formulas: BPSK and QPSK need 9.6 dB for 1 error in 100,000 bits, coherent FSK 12.6 dB and non-coherent FSK 13.4 dB. Coded links need less: choose "My own" and type the value from your coder's data sheet.
- Margin = Eb/N₀ − required − implementation loss. Aim for at least 3 dB, and more for links that fade.

## Worked example

A CubeSat 500 km up sends 1 W at 437 MHz from a dipole (0 dBi, 1 dB cable loss) using non-coherent GFSK at 9600 bit/s. At 10° elevation it is 1,695 km away and the path loss is 149.8 dB. A 12 dBi Yagi with 1.5 dB of feed loss, a 500 K system, 3 dB of polarisation mismatch, 1 dB pointing and 0.5 dB atmospheric loss give a C/N₀ of 56.8 dB-Hz and an Eb/N₀ of 16.9 dB. Against 13.4 dB required and 2 dB implementation loss, the margin is only +1.6 dB. That is enough when the satellite is higher, but marginal near the horizon. The same CubeSat at S-band with 2 W, a 6 dBi patch and a 3 m dish reaches 1 Mbit/s with 9.3 dB to spare.

## Frequently asked questions

**What noise temperature should I use?** About 150 to 300 K at L and S band with a good low-noise amplifier, and 500 to 1000 K at VHF and UHF, where man-made noise is high.

**Does it include Doppler or fading?** No. Add a few dB of margin for fading and make sure your receiver tracks the Doppler shift.

**Is anything sent anywhere?** No. Everything runs in your browser and works offline.
