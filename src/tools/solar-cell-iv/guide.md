---
name: Solar cell IV
num: 864
shelf: science
code: T600
section: semiconductors-and-electronics-materials
title: "Solar cell IV"
summary: "Open or paste a solar cell's I-V curve and get the open-circuit voltage, short-circuit current and current density, maximum power point, fill factor and efficiency, series and shunt resistance from the slopes, and a single-diode model fit (solved exactly with the Lambert W function) for the ideality factor, saturation current, Rs and Rsh with standard errors."
status: live
ads: false
order: 864
icon: chart
works: offline
updated: 2026-11-09
related: [carrier-concentration, tauc-plot, impedance-fitter, plot-maker, solar-pv-yield, curve-fitter, battery-solar-sizing]
sources:
  - "Isc, Voc, fill factor, efficiency and the single-diode model with its explicit Lambert W solution are standard photovoltaics; the code is written by fibub and checked in the tests against scipy.special.lambertw, pvlib (i_from_v and singlediode), NumPy and scipy.optimize.least_squares."
  - "The example curve is made up by the page from a single-diode model (Iph 150 mA, I0 1 nA, n 1.3, Rs 0.5 Ω, Rsh 300 Ω, 4 cm², 25 °C) with a little made-up noise."
  - "A file you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: file, label: "I-V data" }
  - { icon: target, label: "Voc, Isc" }
  - { icon: percent, label: "FF and η" }
  - { icon: curve, label: "Diode fit" }
---
## What it does

A solar cell's current-voltage (I-V) curve under light holds most of what there is to know about it. This page reads it the way a test lab does:

- **Short-circuit current Isc** (and the current density Jsc with the cell area), where the curve crosses 0 V.
- **Open-circuit voltage Voc**, where the current falls to zero.
- **Maximum power point**: the highest V·I along the measured curve, with Vmp and Imp.
- **Fill factor** FF = Pmax / (Voc · Isc), and **efficiency** η = Pmax / (irradiance × area).
- **Series and shunt resistance from the slopes**: −dV/dI through the points nearest Voc and nearest 0 V. Quick, but the Voc slope also contains the diode's own slope, so it is an upper limit for Rs.
- **Single-diode model fit.** The model I = Iph − I0[exp((V + IRs)/(n·Ns·kT/q)) − 1] − (V + IRs)/Rsh is solved for I exactly with the Lambert W function and fitted to every point by least squares. It gives the photocurrent, saturation current, ideality factor, series and shunt resistance, each with a standard error, and the model's own Voc, Isc, Pmax and FF.

Find the absorber's band gap with the [[tauc-plot|Tauc plot tool]], and estimate what a full panel gives over a year with the [[solar-pv-yield|solar PV yield calculator]].

## How to use it

1. Paste or open the curve: voltage in volts, then current. Pick whether the current is in A, mA or mA/cm². Either sign convention is fine.
2. Give the cell's active area and the irradiance (1000 W/m² for standard test light) for current density and efficiency.
3. For the fit, give the cell temperature and, for a module, the number of cells in series. The ideality factor is then per cell.
4. Read the figures of merit and the fit table; check the plot to see the model follows the points. Download the points, model and residuals as CSV, or the report as PNG, PDF or Word.

## Worked example

Press *Use the example*: a made-up 4 cm² cell drawn from the single-diode model with Iph = 150 mA, I0 = 1 nA, n = 1.3, Rs = 0.5 Ω and Rsh = 300 Ω at 25 °C, from −0.05 to 0.66 V with a little noise. The page reads **Isc = 149.73 mA (Jsc = 37.43 mA/cm²)**, **Voc = 0.6283 V**, **Pmax = 64.861 mW at 0.47 V**, **FF = 68.95 %** and, under 1000 W/m² on 4 cm² (400 mW), **η = 16.22 %**. The slopes give 0.7233 Ω near Voc (higher than the true 0.5 Ω, as expected) and 284.6 Ω near 0 V.

The fit gets back **n = 1.29956 ± 0.00075**, **I0 = (9.93 ± 0.11) × 10⁻¹⁰ A**, **Rs = 0.50021 ± 0.00020 Ω** and **Rsh = 300.0 ± 1.6 Ω**, with an RMS misfit of 14.53 µA: the values the curve was drawn with, within the noise.

## Tips

- Measure a little below 0 V and a little past Voc, so both crossings are inside the data and the slopes are steady.
- Noisy points near 0 V make the shunt slope jumpy; raise *Points for the slopes*.
- An ideality factor far outside 1 to 2 usually means the one-diode model is not enough (a second diode, or a barrier), or the temperature or cell count is wrong.
- The area should be the illuminated (aperture) area, as masked in the measurement, or the efficiency will be off.

## FAQ

**Why is the model's Pmax a little different from the measured one?** The measured value follows straight lines between your points; the model is a smooth curve through all of them.

**Can it fit a dark I-V curve?** No: it needs a photocurrent. Dark curves need a different fit.

**Is my data uploaded?** No. Everything happens in your browser.
