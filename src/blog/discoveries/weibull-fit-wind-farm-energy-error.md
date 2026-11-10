---
title: "Does a Weibull fit misjudge wind farm energy? Wind data processing for AEP"
summary: "A 2025 Energies study compared ways of turning wind records into annual energy for offshore farms. See what it found, and test fit against raw data in your browser."
tools: [wind-energy-yield, distribution-explorer, lcoe-calculator]
updated: 2026-11-10
sources:
  - "Gonzalez-Rodriguez AG, Riega-Medina JM, Ruano-Ruano I, Muñoz-Diez JV (2025), Energies 18(13): 3402, the paper described here."
  - "Weibull distribution, log-law wind profile and annual energy as the power curve averaged over the wind distribution: standard wind energy engineering."
  - "The 40 wind readings and the 8 MW generic turbine in the worked example are made up by fibub."
paper:
  title: "Practices and Considerations in Wind Data Processing for Accurate and Efficient Wind Farm Energy Calculation"
  authors: "Gonzalez-Rodriguez AG, Riega-Medina JM, Ruano-Ruano I, Muñoz-Diez JV"
  journal: "Energies"
  year: 2025
  doi: "10.3390/en18133402"
  url: "https://www.mdpi.com/1996-1073/18/13/3402"
  licence: "CC BY"
  reviewed: true
---

Before a wind farm is financed, someone has to say how many megawatt-hours it will make in a typical year: the annual energy production, or AEP. A common shortcut squeezes years of wind readings into just two numbers, the shape k and scale of a Weibull distribution, and computes the energy from those. A Spanish team asked how much accuracy that shortcut and other processing choices cost, using wind data for offshore farms, in a paper in Energies in June 2025. This page explains the study and shows how to compare a Weibull fit with the raw readings yourself in the [[wind-energy-yield]] tool, after looking at the fitted curve's shape in the [[distribution-explorer]].

## What they found

The headline is that the usual maximum-likelihood Weibull fit (they used the standard fitting routine in MATLAB) tends to **underestimate** the power a turbine would make from the same wind. The authors found smaller errors when they chose the Weibull parameters by sweeping through possible values and scoring each pair against the energy from a typical power curve, rather than against the wind speeds alone. In other words, the "best" fit for the wind is not always the best fit for the energy, because a turbine's output depends most on the middle band of speeds between cut-in and rated power. They also looked at how splitting the wind by direction sector and choosing among several turbine models changes the estimate.

## Why it matters

Energy is roughly proportional to the cube of wind speed below rated power, so a small misfit in the speed distribution becomes a larger error in energy, and a larger one again in revenue. A few per cent of AEP can decide whether a project is financed or what price it bids in an auction. Reanalysis data and long time series are now easy to get, so a study that weighs the convenience of a two-number summary against direct use of the series helps analysts choose a method on purpose instead of by habit.

## How they did it

The team used MERRA-2 reanalysis winds (a global weather model's reconstruction of past conditions) for 2004 to 2006, roughly 158,000 records at 10-minute spacing, at a reference height of 10 m. Speeds were carried up to hub height with a logarithmic profile and a sea-surface roughness of 0.001 m. One farm's time series (Anholt, in Denmark) was used for the Weibull work, with parameters for 13 offshore farms in a supporting file. Energy was computed for several commercial turbines from 3.45 to 8 MW and the 10 MW DTU reference design, plus an average power curve built from 17 pitch-controlled machines and scaled to 10 MW.

## Check it yourself with fibub

The wind energy yield tool works out the energy both ways at once when you give it readings: from its maximum-likelihood Weibull fit, and from the readings directly. The 40 speeds below are **made up** to have two wind regimes, a calm one and a windy one, which a single Weibull curve cannot match well. They are in m/s at 10 m.

3.1, 3.6, 4.0, 4.2, 4.4, 4.5, 4.7, 4.8, 5.0, 5.1, 5.3, 5.5, 5.6, 5.8, 6.0, 6.3, 4.1, 4.6, 4.9, 5.2, 8.8, 9.4, 9.9, 10.2, 10.5, 10.8, 11.0, 11.3, 11.6, 12.0, 12.4, 12.9, 13.5, 14.2, 9.6, 10.4, 11.1, 11.8, 12.6, 15.0

1. **Paste the readings.** Choose **My wind speeds**, and paste the numbers one per line. The mean is 8.14 m/s.
2. **Carry them to the hub.** Measured at 10 m, hub height 110 m, height law **Log law**, roughness length 0.001 m (the value the paper used for the sea). Speeds are multiplied by about 1.26.
3. **Set the air.** Elevation 0 m and 15 °C give the standard 1.225 kg/m³.
4. **Describe the turbine.** Keep **A generic made-up curve** and type rated power 8000 kW, rotor diameter 164 m, Cp 0.45, cut-in 3 m/s and cut-out 25 m/s. Leave availability at 97 % and other losses at 10 %.
5. **Read both answers.** The fit gives k ≈ 2.533 and c ≈ 11.62 m/s at the hub, and about **44,464 MWh** gross a year, or 38,817 MWh net, a capacity factor of about 55.4 %. The line **Gross from your data directly** shows about **41,241 MWh**, about 7.3 % less than the fit.
6. **Look at the chart.** The data points bunch into two humps, while the single Weibull curve puts a lot of its weight in the gap between them, about 8 to 11 m/s at the hub. That is where the power curve climbs steeply towards full power, so the fit credits the turbine with energy the readings never deliver.

Here the fit **over**estimates, the opposite sign to the paper's finding for its sites. That is the point: the error depends on how the real wind departs from a Weibull shape and where that departure falls on the power curve. To see what the energy figure means for cost per kWh, carry the net energy into the [[lcoe-calculator]].

## The fine print

- Three years of reanalysis data are a short record for wind; year-to-year swings can be several per cent of AEP.
- Reanalysis winds are smoothed model output, not mast or lidar measurements at the site.
- The log profile with one fixed roughness ignores changes in atmospheric stability, which matter offshore.
- Wake losses between turbines, availability and electrical losses sit outside the comparison of fitting methods.
- The parameter sweep is tuned to a typical power curve, so its advantage may shrink for a turbine with a very different curve.
- Real projects use certified power curves, long-term corrected site data and independent review.
