---
name: Carrier concentration
num: 862
shelf: science
section: semiconductors-and-electronics-materials
title: "Carrier concentration"
summary: "Work out the intrinsic carrier density, the electron and hole densities and the Fermi level of a doped semiconductor at any temperature. The band gap follows Varshni's formula, Nc and Nv come from your effective masses, and charge neutrality is solved with dopants that are only partly ionised, using the Fermi-Dirac integral so heavy doping is right too. Plots show the freeze-out, extrinsic and intrinsic regions."
status: live
ads: true
order: 862
icon: sigma
works: offline
updated: 2026-11-09
related: [blackbody-calculator, altermagnet-bands, plot-maker, band-structure, hall-effect, tauc-plot, solar-cell-iv, physical-constants]
sources:
  - "Varshni's band-gap formula, the effective density of states, the Fermi-Dirac integral F½ and charge neutrality with partly ionised dopants are standard semiconductor physics; the code is written by fibub and checked in the tests against mpmath (polylog) and SciPy (quad, brentq, physical constants)."
  - "The example materials (silicon-like, germanium-like, GaAs-like) use rounded values made up to behave like those materials. They are not reference data; type your own."
flow:
  - { icon: flask, label: "Material" }
  - { icon: sliders, label: "Doping" }
  - { icon: target, label: "Fermi level" }
  - { icon: chart, label: "n and p vs T" }
---

## What it does

How many free electrons and holes does a piece of semiconductor have, and where does the Fermi level sit? The answer depends on the band gap, the temperature, and how many donor and acceptor atoms have given up their carriers. This page works it out the way a device physics course does, but without the usual shortcuts:

- **Band gap against temperature.** Eg(T) = Eg0 − αT²/(T + β), Varshni's formula, with your own Eg0, α and β.
- **Effective densities of states.** Nc = 2(2π mₑ* kT/h²)^{3/2} and the same for Nv with the hole mass, from the density-of-states effective masses you give.
- **Intrinsic density.** nᵢ = √(Nc Nv) e^(−Eg/2kT), and the intrinsic level Ei.
- **Fermi level from charge neutrality.** n + NA⁻ = p + ND⁺ is solved exactly. Donors at a depth Ed below the conduction band are ionised by ND⁺ = ND / (1 + g_D e^((EF − Ed)/kT)), and acceptors the same way. So the page shows freeze-out at low temperature, where the dopants keep their carriers, and compensation when both kinds are present.
- **Degenerate doping.** n = Nc F½(η) with the Fermi-Dirac integral, so the numbers stay right when the Fermi level reaches a band. Switch to Boltzmann statistics to see the textbook shortcut and how far it is off.
- **Temperature sweep.** Plots of n, p and nᵢ, and of EF between the band edges, mark where freeze-out ends (90 % of the net doping ionised) and where the material turns intrinsic (nᵢ passes the net doping).

Get the band gap from an absorption spectrum with the [[tauc-plot|Tauc plot tool]], and check your doping against measurements with the [[hall-effect|Hall effect calculator]].

## How to use it

1. **Material.** Pick an example or type your gap at 0 K, Varshni α and β, and the electron and hole effective masses.
2. **Doping.** Type the donor and acceptor densities in cm⁻³ (1e16 means 10¹⁶), how deep each level is, and its degeneracy factor (2 for donors and 4 for acceptors are usual).
3. **Temperature.** Set the temperature for the numbers, and the range for the plots.
4. Read the Fermi level, n, p and the share of dopants ionised; download the sweep as CSV or the report as PNG, PDF or Word.

The small box at the bottom gives F½(η) for any reduced energy η = (EF − Ec)/kT, next to the Boltzmann value e^η.

## Worked example

The page opens with the silicon-like example: Eg0 = 1.17 eV, α = 0.5 meV/K, β = 650 K, mₑ* = 1.1, mₕ* = 0.8, and 10¹⁶ cm⁻³ donors 0.045 eV below the conduction band, at 300 K.

- Eg(300 K) = 1.17 − 0.0005 × 300² / 950 = **1.1226 eV**.
- Nc = **2.895 × 10¹⁹** and Nv = **1.796 × 10¹⁹ cm⁻³**, so nᵢ = **8.477 × 10⁹ cm⁻³**.
- Charge neutrality puts EF **0.206 eV below Ec**. Then n = **9.961 × 10¹⁵ cm⁻³** (99.6 % of the donors are ionised) and p = **7.213 × 10³ cm⁻³**.
- Below about **132 K** less than 90 % of the donors are ionised (freeze-out); above about **655 K** nᵢ passes 10¹⁶ and the material turns intrinsic.

At 77 K the same sample has only about 37 % of its donors ionised, so n is about 3.7 × 10¹⁵ cm⁻³: the "all donors ionised" shortcut would be almost three times too high.

## Tips

- **Degenerate doping.** In the GaAs-like example with 10¹⁹ donors, EF sits about 0.48 kT above Ec. Only about 5 % of the donors are ionised, and Fermi-Dirac gives n ≈ 5.1 × 10¹⁷ where Boltzmann gives 6.2 × 10¹⁷: about 20 % too many. At such doping the gap also narrows and the donor levels merge into a band; this simple model leaves that out, so treat it as a guide.
- **Compensation.** With both donors and acceptors, only |ND − NA| gives carriers, and freeze-out starts at a different temperature from either dopant alone.
- **Your masses.** For silicon-type bands with several valleys, use the density-of-states mass that already includes them, not the conductivity mass.

## FAQ

**Why do my numbers differ a little from a textbook table?** Textbook tables use their own measured masses and gaps, and some let the masses change with temperature. Type their values to compare.

**Why is Ei not exactly midgap?** Ei = Eg/2 + (3/4) kT ln(mₕ*/mₑ*): it moves towards the band with the lighter mass.

**Is anything sent anywhere?** No. Everything is worked out in your browser.
