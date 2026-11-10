---
name: CTD cast viewer
num: 208
shelf: science
code: T208
section: physical-oceanography
title: "CTD cast viewer: temperature and salinity profiles, T-S diagram, mixed layer depth and N²"
summary: "Paste or open a CTD cast as CSV and see temperature, salinity, density, oxygen and fluorescence against depth, a T-S diagram with lines of equal density, the mixed layer depth by a temperature or density threshold, the buoyancy frequency N² and the thermocline. Splits the downcast from the upcast and bins to 1 m. Your file stays in your browser."
status: live
ads: false
order: 208
icon: chart
works: offline
updated: 2026-11-09
related: [skew-t-sounding, ocean-currents, wave-calculator, plot-maker]
sources:
  - "Downcast and upcast split, depth binning, threshold mixed layer depth, gradients, N² = (g/ρ₀) dρ/dz and the thermocline as the steepest temperature fall are standard methods, written by fibub and checked in the tests against an independent NumPy script on the example and five random casts."
  - "Density uses a simple linear equation of state with rounded starting values (ρ₀ 1027 kg/m³, α 0.0002 per °C, β 0.0008 per g/kg, T₀ 10 °C, S₀ 35) chosen by fibub, not copied from any standard; it is not TEOS-10. The 0.2 °C and 0.03 kg/m³ thresholds and the 10 m reference are round, editable starting points."
  - "The example cast is made up by the page; it is not a real measurement."
  - "A file you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: file, label: "Cast CSV" }
  - { icon: sliders, label: "Settings" }
  - { icon: chart, label: "Profiles" }
  - { icon: table, label: "Mixed layer" }
---

## What it does

A CTD (conductivity, temperature, depth) is lowered through the sea on a wire and records many scans a second. This page turns an exported cast into the plots and numbers an oceanographer looks at first:

- **Downcast and upcast.** The cast is split at the deepest scan. The downcast is usually the cleaner half, because the sensors meet undisturbed water; the upcast can be drawn too, dashed, to spot sensor lag or water that changed.
- **Bins.** Scans are averaged into depth bins (1 m by default), the usual first step before any analysis.
- **Profiles.** Temperature, salinity, density (as σ = ρ − 1000), N² and, when the file has them, oxygen and fluorescence, each against depth with the surface at the top.
- **T-S diagram.** Temperature against salinity, with dashed lines of equal density, so water masses and mixing lines stand out.
- **Mixed layer depth.** Where temperature first moves more than a set step (0.2 °C) away from its value at a reference depth (10 m), or where density first rises by more than its step (0.03 kg/m³). Both are shown; pick which one goes on the plots.
- **Stratification.** The buoyancy frequency N² = (g/ρ₀) dρ/dz says how strongly the water resists being mixed. The page gives its peak, N in cycles per hour and the buoyancy period. The thermocline is the depth where temperature falls fastest.
- **Density** comes from a **simple linear equation of state** with editable round values. It is an approximation, not TEOS-10, and it has no pressure term, so treat it as a guide to the shape of the profile.

For the same view of the atmosphere, try the [[skew-t-sounding|Skew-T sounding plotter]]; for surface flows see the [[ocean-currents|ocean currents tool]], and for waves the [[wave-calculator|wave calculator]].

## How to use it

1. **Cast CSV.** Paste the cast or open a CSV or text file. A header row lets the page find the columns by name: pressure (dbar) or depth (m), temperature (°C), salinity, and optional oxygen and fluorescence. The note under the box says which columns were used. Without a header, say whether the first column is pressure or depth.
2. **Settings.** Choose the downcast, upcast or all scans, the bin size, how far apart bins are for gradients (4 m smooths noise), and the mixed layer rule. Change the linear equation of state if your water is far from 10 °C and 35.
3. **Profiles.** Read the plots, the T-S diagram and the facts. Dashed lines mark the mixed layer and the thermocline.
4. **Mixed layer** and the rest go into the binned profile CSV and a PNG, PDF or Word report.

## Worked example

The example is a made-up summer cast to 250 dbar (248 m): 1,493 scans, a downcast every 0.25 dbar and an upcast every 0.5 dbar. With the downcast, 1 m bins and the starting values, the page shows:

- temperature at 10 m is 17.869 °C; it is 0.2 °C colder at **20.2 m**, the mixed layer by temperature;
- the mixed layer by density is shallower, **16.3 m**, because salinity starts rising before temperature falls (the surface water is fresher);
- the thermocline is at **40.0 m**, falling 0.394 °C per metre;
- N² peaks at **9.35 × 10⁻⁴ s⁻²** at 39 m, that is about 17.5 cycles per hour, a buoyancy period of 3.42 minutes.

Pick the upcast and the temperature mixed layer moves to 20.9 m: the made-up upcast reads as if the sensor lagged 1.5 m, so everything shifts down. The fluorescence peak (chlorophyll) sits at 45 m, just under the thermocline, and the oxygen minimum near 157 m.

## Tips

- Clean the cast first (drop the surface soak, remove spikes) in the instrument software; the page averages, it does not despike.
- A deeper reference depth (say 20 m) skips daytime surface warming that would otherwise make the mixed layer look shallow.
- Compare casts with the same thresholds; mixed layer depths from different rules are not comparable.

## FAQ

**Why not TEOS-10?** It needs large coefficient tables. A linear equation is quick to understand and good enough to see where density changes; for publication densities, use TEOS-10 software.

**Is pressure the same as depth?** Nearly: here depth = pressure × 10⁴ / (ρ₀ g), about 0.993 m per dbar, which ignores compression and latitude.

**Is my file stored?** No. It is read in this page and never leaves your device.
