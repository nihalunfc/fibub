---
name: Seawater properties and CTD cast viewer
num: 877
shelf: science
section: physical-oceanography
title: "Seawater calculator (TEOS-10) and CTD cast viewer: salinity from conductivity, density, sigma-theta, sound speed, N² and mixed layer depth"
summary: "Turn temperature, pressure and salinity or conductivity into Absolute Salinity, Conservative and potential temperature, density, σθ, sound speed and depth with the TEOS-10 equations, or paste a whole CTD cast for its profiles, T–S diagram, buoyancy frequency and mixed layer depth."
status: live
ads: true
order: 877
icon: chart
works: offline
updated: 2026-11-09
related: [carbonate-system, tide-predictor, wave-calculator, psychrometric-calculator]
sources:
  - "TEOS-10: IOC, SCOR and IAPSO (2010), The international thermodynamic equation of seawater 2010, Manuals and Guides 56, UNESCO (teos-10.org). Density, sound speed, α and β from the 75-term expression of Roquet et al. (2015, Ocean Modelling 90, 29). Practical salinity: PSS-78 (Unesco 1983, Tech. Pap. Mar. Sci. 44) with the Hill et al. (1986) extension below SP 2. Mixed layer thresholds: de Boyer Montégut et al. (2004, J. Geophys. Res. 109, C12003)."
  - "The equations are ported from the Gibbs SeaWater (GSW) Oceanographic Toolbox of TEOS-10 (GSW-C, Copyright (c) 2011, SCOR/IAPSO WG127, BSD-style licence; the notice is kept in the source file). fibub's port was checked against GSW-Python. Absolute Salinity is taken as Reference Salinity (no δSA atlas)."
  - "The example sample and cast are made up. Nothing you type or open is sent or stored."
flow:
  - { icon: sliders, label: "T, P, S" }
  - { icon: table, label: "CTD cast" }
  - { icon: calculator, label: "TEOS-10" }
  - { icon: chart, label: "Profiles" }
---

## What it does

A CTD (conductivity, temperature, depth) instrument measures conductivity, temperature and pressure on its way down through the sea. Everything else oceanographers use, such as salinity, density and the speed of sound, is worked out from those three with the international equation of seawater, TEOS-10. This page does that in your browser:

- **One water sample**: from temperature, pressure and practical salinity (or conductivity) it gives Absolute Salinity SA, Conservative Temperature Θ, potential temperature θ, in-situ density ρ, potential density σθ (σ0), the speed of sound, the thermal expansion and haline contraction coefficients α and β, and the depth in metres for your latitude.
- **A whole CTD cast**: paste or open a table with pressure, temperature and conductivity or salinity columns. Sea-Bird .cnv text works too: header lines starting with * or # are skipped, and the columns are guessed from their names (you can change them).
- **Profiles** of θ, salinity, σθ, sound speed and the buoyancy (Brunt–Väisälä) frequency N², a **T–S diagram** with lines of equal σ0, and the **mixed layer depth**.
- A CSV of every level with all the derived values, and a PDF, PNG or Word report.

## How to use it

1. For one sample, type the temperature (°C, ITS-90), the sea pressure (dbar, 0 at the surface; 1 dbar is about 1 m) and the salinity. Switch "Salinity given as" to conductivity if that is what you have; the value is converted so you keep the same water.
2. For a cast, paste it in the box or press "Open a cast". Check that the three column choices are right and say whether the salinity column is conductivity in mS/cm, conductivity in S/m (Sea-Bird c0S/m) or practical salinity.
3. Set the latitude; it changes gravity, so the depth and N².
4. Choose how the mixed layer is found. **Density** finds the first pressure below the reference level where σθ is larger than at the reference by the threshold (0.03 kg/m³ is usual). **Temperature** finds where θ has changed by the threshold either way (0.2 °C is usual). The reference level is usually 10 dbar, to stay clear of the daily warming of the top few metres.
5. Press the profile buttons to switch the plot, and download the CSV or report.

## Worked example

A made-up sample of salinity 35 at 10 °C and 1000 dbar, latitude 30°: Absolute Salinity 35.1650 g/kg, Conservative Temperature 9.8690 °C, potential temperature 9.8791 °C, in-situ density 1031.433 kg/m³, σθ 26.975 kg/m³, sound speed 1506.14 m/s, at a depth of 990.8 m. The same water has a conductivity of 38.5295 mS/cm.

The made-up cast has a warm, salty layer about 36 m thick over a thermocline. With the density threshold of 0.03 kg/m³ from 10 dbar the mixed layer is 38.0 dbar deep; the strongest stratification, N² = 1.42 × 10⁻⁴ s⁻², is at its base (37 dbar), and the sound speed is lowest (1485.68 m/s) at 510 dbar.

## Tips

- Practical salinity has no units; "psu" is a label, not a unit. Absolute Salinity is in g/kg.
- TEOS-10 adds a small correction δSA for the nutrients and carbonate in each ocean basin. This page sets it to zero (SA equals Reference Salinity), which is off by up to about 0.025 g/kg in the deep North Pacific and less elsewhere.
- Conductivity in S/m is ten times smaller than in mS/cm. If salinities come out near 3 or 350, the unit is wrong.
- Upcasts and repeated pressures are dropped: levels are sorted by pressure and each pressure is used once.

## FAQ

**Is it the same as the GSW toolbox?** Yes for the functions used here: every value matched GSW-Python to rounding in our tests.

**Why are θ and Θ different?** θ is the temperature a parcel would have if brought to the surface without exchanging heat. Θ is proportional to its heat content, which is what TEOS-10 uses for mixing and heat budgets. They differ by up to a few hundredths of a degree.

**Is this for navigation or sonar work?** It is for study and quick checks; use certified software for operational work.

**Is my data uploaded?** No. Everything runs in your browser.
