---
name: Wind energy yield
num: 673
shelf: science
section: energy-and-power-systems
title: "Wind energy yield"
summary: "Paste or open wind speed readings (or give Weibull k and c, or a mean speed), correct them to hub height with the power or log law, adjust for air density, and combine with a power curve to get the annual energy production, capacity factor, full-load hours and energy by wind speed."
status: live
ads: true
order: 673
icon: chart
works: offline
updated: 2026-11-09
related: [solar-pv-yield, standard-atmosphere, propeller-thrust, lcoe-calculator, home-battery-sizing, load-flow, airfoil-calculator]
sources:
  - "Weibull distribution fitted by maximum likelihood; wind power density ½ρc³Γ(1 + 3/k); power-law and log-law wind shear; annual energy as the integral of the power curve over the wind speed distribution: Manwell, J. F., McGowan, J. G. and Rogers, A. L., Wind Energy Explained (equations only)."
  - "Air-density adjustment of the power curve by the equivalent-speed method for pitch-regulated turbines, v (ρ/ρ0)^(1/3), as described in IEC 61400-12-1 (method only, no tables)."
  - "Air density from the 1976 US Standard Atmosphere (US government, public domain), shifted to the temperature you give."
  - "Checked against SciPy: scipy.stats.weibull_min.fit (location 0) and an exact maximum-likelihood solve with brentq for the fit, and scipy.integrate.quad for the annual energy. The example wind year is made up (random Weibull draws with a fixed seed) and the generic power curve is made up, not any real turbine."
flow:
  - { icon: table, label: "Wind data" }
  - { icon: curve, label: "Weibull" }
  - { icon: mountain, label: "Hub height" }
  - { icon: calculator, label: "Energy" }
---

## What it does

How much energy a wind turbine makes depends on how often the wind blows at each speed and how much power the turbine makes at each speed. This tool puts the two together:

- **Weibull fit**: wind speeds over a year usually follow a Weibull distribution with a shape k (often 1.5 to 3) and a scale c (a little above the mean speed). The tool fits k and c to your readings by **maximum likelihood**, or takes k and c, or a mean speed and k.
- **Hub height**: wind is faster higher up. The speeds are scaled from the measurement height to the hub with the **power law** v₂ = v₁ (h₂/h₁)^α or the **log law** v₂ = v₁ ln(h₂/z0) / ln(h₁/z0).
- **Air density**: thinner air (high or hot sites) carries less power; the power curve is read at an equivalent speed v (ρ/1.225)^(1/3).
- **Annual energy production (AEP)** = 8,760 h × the average of power over the wind distribution, then times the availability and (1 − losses). Also the **capacity factor**, full-load hours, time producing, and the energy from each 1 m/s band of wind.

If you give readings, it also works out the energy from the readings directly, with no Weibull fit, so you can see how well the fit represents your site.

Compare with a rooftop array in the [[solar-pv-yield|solar PV yield estimator]], and find the cost per kWh with the [[lcoe-calculator|LCOE calculator]].

## How to use it

1. Paste wind speed readings, one per line, or **open a file** (CSV, TSV, TXT or Excel). If the speed is not in the first column, give its column number.
2. Give the **measurement height** and the **hub height**, and pick a height law and its exponent or roughness.
3. Give the site elevation and mean temperature for the air density.
4. Choose the **generic made-up power curve** (rated power, rotor diameter, Cp, cut-in and cut-out) or paste the maker's power curve.
5. Give the availability and other losses. Download the energy by wind speed as CSV, or the whole report.

## Worked example

The made-up example is a year of 8,760 hourly speeds measured at 10 m, with a made-up 2,000 kW turbine with a 100 m rotor (Cp 0.45, cut-in 3 m/s, cut-out 25 m/s) on a 100 m tower at sea level, 15 °C. The fit gives **k = 2.102 and c = 7.173 m/s** at 10 m; the power law with α = 0.143 multiplies speeds by 1.39, so c = 9.97 m/s at the hub. The gross energy is 10,309 MWh; with 97 % availability and 10 % other losses the page shows **8,999 MWh a year, a capacity factor of 51.4 %**, about 4,500 full-load hours. Using the readings directly instead of the fit gives 10,347 MWh gross, 0.37 % more.

## FAQ

**Why do calm readings (0 m/s) not enter the fit?** The Weibull likelihood cannot use a zero speed. Calms are counted as a share of the year that makes no energy.

**Is the shear exponent really constant?** No: it changes with time of day, season and stability. Measuring at two heights on your own mast is far better than a textbook value.

**Can I trust the capacity factor?** It is a study and planning estimate. Real projects use at least a year of on-site data, long-term correction, the certified power curve and wake models.
