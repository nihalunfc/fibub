---
name: EIS fitter
num: 111
shelf: science
code: T111
section: electrochemistry-and-battery-science
title: "EIS fitter"
summary: "Paste or open an electrochemical impedance spectrum and fit an equivalent circuit (R(RC), R(RQ), Randles with Warburg diffusion, two-arc R(RQ)(RQ) or a blocking CPE) by complex non-linear least squares. Get each element with its error, the effective capacitance, time constants, exchange current density and a comparison of all circuits."
status: live
ads: true
order: 6
icon: curve
works: offline
updated: 2026-11-08
related: [cyclic-voltammetry, tafel-corrosion-rate, battery-cycling-analyser, nernst-calculator]
sources:
  - "Circuit elements and fitting: standard impedance theory (resistor, capacitor, constant phase element, semi-infinite Warburg) with modulus-weighted complex non-linear least squares."
  - "Effective capacitance of a CPE: the formula of Hsu and Mansfeld (2001)."
  - "Faraday and gas constants: CODATA (NIST)."
  - "Example spectrum: simulated by fibub."
flow:
  - { icon: table, label: "Spectrum" }
  - { icon: sliders, label: "Circuit" }
  - { icon: curve, label: "Fit" }
  - { icon: chart, label: "Nyquist" }
---

## What it does

Electrochemical impedance spectroscopy (EIS) applies a small AC signal over a range of frequencies and records the complex impedance Z = Z′ + jZ″. The result is plotted two ways. A **Nyquist plot** shows −Z″ against Z′, where each process makes a semicircle. A **Bode plot** shows |Z| and the phase against frequency. To put numbers on the processes, you fit an **equivalent circuit**.

This tool fits five common circuits:

- **R(RC):** solution resistance Rs in series with a charge-transfer resistance Rct in parallel with the double-layer capacitance C. It gives one ideal semicircle.
- **R(RQ):** the same circuit with a constant phase element (CPE) in place of the capacitor. A CPE has Z = 1/(Q(jω)^α) and gives the depressed semicircle seen on real, rough electrodes.
- **Randles, R(Q(RW)):** adds a Warburg element in series with Rct, for semi-infinite diffusion. The semicircle is followed by a 45° line at low frequency.
- **R(RQ)(RQ):** two arcs, for example a film or SEI layer plus charge transfer in a battery. The faster arc is listed first.
- **RQ:** a blocking electrode or an intact coating, with no charge transfer.

The fit is complex non-linear least squares weighted by |Z|, so each frequency counts by its relative error. It starts from several guesses read off the spectrum. You get:

- every value with its standard error
- the rms error of the fit
- the effective capacitance of each CPE (Hsu–Mansfeld)
- each arc's time constant and peak frequency
- Rct × area and the exchange current density i₀ = RT/(nF·Rct·A)
- a table that fits every circuit to your data, so you can compare them

For the same cell's voltammogram, use the [[cyclic-voltammetry]]; for corrosion currents, the [[tafel-corrosion-rate|Tafel corrosion rate]] tool.

## How to use it

1. Paste three columns or open a CSV, TSV or Excel file: frequency (Hz), Z′ and Z″ in ohms. If your file has |Z| and phase instead, choose that format.
2. The tool detects whether the third column holds Z″ or −Z″. If the arc comes out upside down, set the sign yourself.
3. Choose a circuit. Check the comparison table, and prefer the simplest circuit that fits within the noise with every value well defined.
4. Enter the electrode area to get capacitance per cm², Rct × area and i₀.

## Worked example

The example is a simulated Randles cell: Rs 20 Ω, Rct 100 Ω, Q 20 µF·s^(α−1) with α = 0.9, σ = 30 Ω·s^−½, and 0.4 % noise, measured from 100 kHz down to 30 mHz. The Randles fit returns **Rs 19.98 Ω, Rct 100.1 Ω**, Q 20.04 µF·s^(α−1), α 0.900 and σ 29.99, with a 0.08 % rms error. For a 3 mm disc (0.0707 cm²):

- the effective capacitance is 10.02 µF (142 µF/cm²)
- the time constant is 1.0 ms, so the arc peaks near 159 Hz
- i₀ is 3.6 mA/cm²

The one-arc circuits miss by about 10 %, because they cannot follow the diffusion tail. The two-arc circuit runs one resistance off to infinity, so it is flagged as not pinned down.

## Questions

**Why is my α below 0.8?** Rough or porous electrodes, uneven current distribution or a distribution of time constants all lower α. Below about 0.5, the element behaves more like diffusion than a capacitor.

**Some high-frequency points sit below the axis.** At high frequency, cable and cell inductance makes Z″ positive, so −Z″ dips below zero. Leave those points out, because none of these circuits contains an inductor.

**Is anything sent anywhere?** No. Your data stays in your browser, and the page works offline once loaded.
