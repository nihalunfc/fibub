---
name: Energy balance climate model
num: 834
shelf: science
section: climatology
title: "Energy balance climate model: CO₂ forcing, climate sensitivity, ice-albedo tipping points and the one-layer greenhouse"
summary: "Move sliders for the solar constant, albedo, emissivity, CO₂, the climate feedback parameter and the ocean's heat capacity, and see the planet's equilibrium temperature, how fast it warms, the ice-albedo feedback with its two stable climates and hysteresis, and the one-layer greenhouse model."
status: live
ads: true
order: 834
icon: sliders
works: offline
updated: 2026-11-09
related: [glacier-ice, blackbody-calculator, habitable-zone-calculator, trend-analyser, koppen-climate, insolation-calculator, walter-lieth, carbon-footprint, proxy-stacker]
sources:
  - "CO₂ forcing ΔF = 5.35 ln(C/C₀) W/m²: Myhre, G., Highwood, E. J., Shine, K. P. and Stordal, F. (1998), New estimates of radiative forcing due to well mixed greenhouse gases, Geophysical Research Letters 25, 2715–2718."
  - "Zero-dimensional and one-layer models and the ice-albedo feedback as in Budyko (1969) and Sellers (1969), and in textbooks such as Hartmann, D. L., Global Physical Climatology; written into code by fibub with a smooth albedo step of its own choosing."
  - "Stefan-Boltzmann constant from CODATA (exact in the SI). Checked 2026-11-09 against SciPy (solve_ivp, brentq, minimize_scalar, fsolve) on hundreds of random planets."
  - "The starting values (albedo, emissivity, λ, mixed layer, ice albedo and its temperatures) are rounded, illustrative choices by fibub, not measurements; change them."
flow:
  - { icon: sliders, label: "Sliders" }
  - { icon: target, label: "Balance" }
  - { icon: curve, label: "Warming" }
  - { icon: chart, label: "Tipping" }
---

## What it does

A **zero-dimensional energy balance model** treats the whole Earth as one point with one temperature. Sunlight comes in, infrared heat goes out, and the temperature settles where the two match. Simple as it is, it explains why the planet is about 15 °C on average, why more CO₂ warms it, why warming takes decades, and how ice can make the climate jump between two states. This page has four parts:

- **Equilibrium**: the temperature where absorbed sunlight S(1 − α)/4 plus the CO₂ forcing equals the outgoing heat ε σ T⁴, before and after a CO₂ change, with the warming and the albedo at the new balance.
- **Warming over time**: two models side by side. The **radiative model** (C dT/dt = S(1 − α)/4 + F − ε σ T⁴) has only the Planck response (and ice if ticked). The **linear model** (C dΔT/dt = F − λΔT) uses your **climate feedback parameter λ**, which stands for all the feedbacks together (water vapour, clouds, lapse rate, ice). The ocean's mixed layer gives the heat capacity C, which sets how slowly the planet warms.
- **Ice-albedo feedback**: the albedo rises smoothly from the ice-free value to the ice-covered value as the planet cools. The page finds every equilibrium, says which are stable, and draws the **equilibrium curve against the solar constant**, with the two **tipping points** (the warm planet freezing, the frozen planet thawing) and the range where both climates are possible (**hysteresis**).
- **One-layer greenhouse model**: an atmosphere that lets sunlight through but absorbs a share εₐ of the surface's infrared. It gives the surface, atmosphere and emission temperatures and every flux.

See how orbital changes alter sunlight with the [[insolation-calculator|insolation calculator]], and compare model warming with real records in the [[trend-analyser|trend analyser]].

## How to use it

1. Move a slider or type a value in the box next to it; everything updates.
2. **Planet**: the solar constant S, the ice-free albedo α and the effective emissivity ε.
3. **CO₂ change**: the starting and new CO₂ in ppm, all at once or rising 1 % a year until the new value, the feedback parameter λ, the mixed-layer depth and how many years to run. Leave **start temperature** blank to start from the warm balance; type a cold value such as 230 K to start from a frozen planet.
4. **Ice-albedo feedback**: tick it on or off, and set the ice-covered albedo, the middle of the change and its width.
5. Download the time series or the equilibrium curve as CSV, or everything as an image, PDF or Word report.

## Worked example

With the starting values (S 1361 W/m², α 0.30, ε 0.612, ice feedback on with ice albedo 0.6 around 265 K, CO₂ doubled from 280 to 560 ppm all at once, λ 1.2 W/m²/K, 100 m mixed layer):

- The CO₂ forcing is **3.71 W/m²**.
- The radiative model's balance moves from **14.34 °C** to **15.53 °C**: only **1.19 K** of warming, because its own feedback (mostly the Planck response, 4εσT³) is about **3.16 W/m²/K**.
- The linear model with λ = 1.2 warms by **3.09 K** at equilibrium: this is the climate sensitivity for doubled CO₂. Its response time C/λ is **11 years**.
- The equilibrium curve shows two stable climates for a solar constant from about **1163 to 1314 W/m²** (with the doubled CO₂).
- The one-layer model with εₐ = 0.78 gives a surface at **14.91 °C**, an atmosphere at **−30.92 °C** and an emission temperature of **−18.57 °C**: **33.49 K** of greenhouse warming.

## Tips

- Set λ to 3.3 W/m²/K and switch the ice off: the two models then nearly agree, because the radiative model's only feedback is then the Planck response.
- Try a mixed layer of 10 m (a planet with a shallow ocean) and of 1000 m: the final warming is the same, but the time to get there changes a lot.
- With the ice on, lower S to 1250 and type a start temperature of 230 K: the planet stays frozen in sunshine that keeps today's climate warm.

## FAQ

**Is this how climate models work?** The same energy balance is at the heart of every climate model, but real models resolve the atmosphere, ocean, land and ice in three dimensions. Use this for teaching and for intuition, not for projections.

**Why does the radiative model warm less than the linear one?** Its only feedbacks are the Planck response and ice. The water-vapour and cloud feedbacks that amplify warming in the real climate are folded into λ in the linear model.

**Why can there be three equilibria?** With ice, a cooler planet reflects more sunlight, which cools it further. Between the frozen and warm balances there is an unstable one: a small nudge either way sends the planet to one of the stable states.
