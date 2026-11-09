---
name: Ocean currents calculator
num: 507
shelf: science
section: physical-oceanography
title: "Ocean currents calculator: Ekman transport and spiral, coastal upwelling, geostrophic current, thermal wind and Rossby radius"
summary: "Work out wind-driven and geostrophic ocean currents: wind stress from the bulk formula, Ekman transport, depth, surface current and spiral; coastal upwelling and Ekman pumping from wind stress curl; geostrophic current from a sea-level slope; thermal-wind current profile across two stations from density or dynamic height; Coriolis parameter and Rossby radii."
status: live
ads: true
order: 507
icon: compass
works: offline
updated: 2026-11-09
related: [wave-calculator, skew-t-sounding, psychrometric-calculator, tide-predictor, dissolved-oxygen, carbonate-system, vector-map-viewer]
sources:
  - "Ekman, V. W. (1905) On the influence of the earth's rotation on ocean currents. Arkiv för Matematik, Astronomi och Fysik 2(11); Ekman transport, depth and spiral as in standard texts such as Pond, S. and Pickard, G. L. (1983) Introductory Dynamical Oceanography, 2nd ed., and Talley, L. D. et al. (2011) Descriptive Physical Oceanography, 6th ed. (the empirical surface current and depth formulas are from Pond and Pickard)."
  - "Geostrophic balance, thermal wind, dynamic height and Rossby radii are standard results of geophysical fluid dynamics, written here as formulas by fibub."
  - "Coriolis parameter checked against the TEOS-10 Gibbs SeaWater toolbox (gsw.f); everything else against independent NumPy and SciPy versions. Example inputs, including the density section, are made up."
flow:
  - { icon: compass, label: "Latitude" }
  - { icon: sliders, label: "Wind" }
  - { icon: curve, label: "Ekman" }
  - { icon: chart, label: "Currents" }
---

## What it does

Most ocean currents near the surface are driven by the wind and steered by the Earth's rotation. This page works out the classic textbook results from a few numbers you type:

- **Coriolis parameter** f = 2Ω sin(latitude), which turns moving water to the right in the northern hemisphere and to the left in the southern.
- **Wind stress** from the bulk formula τ = ρ<sub>air</sub> C<sub>d</sub> U², with your air density and drag coefficient.
- **Ekman layer**: the transport τ/(ρ₀|f|) at 90° to the wind, the Ekman depth π√(2A<sub>z</sub>/|f|), the surface current τ/(ρ₀√(A<sub>z</sub>|f|)) at 45° to the wind, and the **Ekman spiral** drawn from above. The empirical formulas from Ekman (1905) are shown beside them.
- **Coastal upwelling**: how much of the Ekman transport goes away from (or towards) a straight coast, and the upwelling speed over a zone you choose; and **Ekman pumping** from the wind stress curl when the wind is stronger offshore.
- **Geostrophic current** from the slope of the sea surface, as satellite altimetry measures it.
- **Thermal wind**: the current profile across a section between two stations from their density (or dynamic height) profiles, relative to a level of no motion.
- **Rossby radius**: barotropic, two-layer baroclinic and from the buoyancy frequency N.

Separate out the tidal part of the flow with the [[tide-predictor|tide predictor]], and look at the waves on top with the [[wave-calculator|wave calculator]].

## How to use it

1. Type the latitude and the sea water density (1025 kg/m³ is typical).
2. Type the wind speed at 10 m and where it blows from. Change the air density, drag coefficient and eddy viscosity if you have better values; the defaults are examples.
3. For a coast, give the compass bearing from the coast out to sea and the width of the upwelling zone. For the curl, give a wind speed further offshore and the distance.
4. For the geostrophic current, type how much the sea surface rises eastward and northward over a distance.
5. For a section, paste depth, station A, station B (density in kg/m³ or dynamic height in dynamic metres), the distance and the bearing from A to B, and the level of no motion.
6. Download the report (image, PDF or Word) or the section profile as CSV.

## Worked example

At **40° N**, f = 9.37 × 10⁻⁵ s⁻¹. A 10 m/s wind from the north with ρ<sub>air</sub> = 1.22 kg/m³ and C<sub>d</sub> = 0.0013 gives τ = **0.159 N/m²**.

- Ekman transport: 0.159 ÷ (1025 × 9.37 × 10⁻⁵) = **1.65 m²/s** towards the west. With A<sub>z</sub> = 0.01 m²/s the Ekman depth is **45.9 m** and the surface current **0.16 m/s** towards the south-west (225°). The empirical formulas give 0.158 m/s and 53.6 m.
- On a coast with the sea to the west (270°), all of that transport goes offshore. Spread over 20 km it gives **upwelling of 8.25 × 10⁻⁵ m/s, about 7.1 m a day**. With 12 m/s 50 km offshore, the wind stress curl is 1.40 × 10⁻⁶ N/m³ and Ekman pumping adds about 1.25 m a day.
- A sea surface that rises 50 cm over 100 km towards the east drives a geostrophic current of **0.52 m/s towards the north**.
- The example density section (stations 50 km apart, A to B towards the east) gives **0.54 m/s towards the south** at the surface relative to no motion at 1000 m: lighter water lies to the west, on the current's right.
- For H = 4000 m, a 500 m upper layer and Δρ = 2 kg/m³, the two-layer Rossby radius is **30.9 km**; the barotropic one is 2,113 km.

## Tips

- The Ekman formulas assume a steady wind, deep water and a constant eddy viscosity. Real Ekman layers are shallower and turn less than 45°, but the transport τ/(ρ₀f) holds well.
- Near the equator f goes to zero and these balances break down; the page stops within 2°.
- Thermal wind gives only the change of current with depth. The answer depends on the level of no motion you choose, or a measured current at one depth.

## FAQ

**Why does the transport go at 90° to the wind when the surface current goes at 45°?** The current keeps turning with depth along the spiral; added up over the whole layer, the flow comes out at right angles to the wind.

**What is a dynamic metre?** A unit of geopotential: 1 dynamic metre = 10 J/kg. Differences in dynamic height between two stations divided by f and the distance give the geostrophic current.

**Which sign is the section current?** Positive is to the left of the direction from A to B, negative to the right. The page also names the compass direction.
