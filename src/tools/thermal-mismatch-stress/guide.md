---
name: Thermal mismatch
num: 852
shelf: science
section: phase-and-thermal-behaviour
title: "Thermal mismatch"
summary: "Work out the stress from different thermal expansion: the biaxial stress in a thin film on a substrate, film stress from wafer bow or curvature with Stoney's equation, the curvature and layer stresses of a bonded bimetal strip (Timoshenko), and the stress in a bar held between walls. The CTE can change linearly with temperature."
status: live
ads: true
order: 852
icon: calculator
works: offline
updated: 2026-11-09
related: [diffusion-calculator, laminate-calculator, stress-strain-analyser, thin-film-thickness, fracture-toughness-calculator, fatigue-sn-calculator, beam-calculator]
sources:
  - "Thin-film biaxial stress, Stoney's equation (Stoney 1909) and Timoshenko's bimetal formula (Timoshenko 1925, J. Opt. Soc. Am. 11, 233) in the textbook forms of Freund and Suresh, Thin Film Materials, ch. 2. fibub's code is checked in the tests against SciPy (integrate.quad, brentq) and a NumPy multilayer beam solution."
  - "The example moduli, expansion coefficients, thicknesses and temperatures are made-up round values, not data for any real material."
  - "Nothing you type is sent or stored."
flow:
  - { icon: sliders, label: "Materials" }
  - { icon: flask, label: "ΔT" }
  - { icon: sigma, label: "Stress" }
  - { icon: curve, label: "Bow" }
---

## What it does

When two bonded materials expand by different amounts as the temperature changes, neither can take its free size, and stress builds up. This page covers four everyday cases:

- **Film on a substrate.** A thin coating is held to the substrate's size in both directions, so its stress is biaxial: σ = E_f/(1 − ν_f) × (ε_s − ε_f), where ε = ∫α dT is each material's free thermal strain from the stress-free temperature T₀ (for example the deposition temperature) to the final temperature T₁. It also gives the wafer **curvature, radius and bow** from **Stoney's equation**, κ = 6σh_f(1 − ν_s)/(E_s h_s²), and checks Stoney against a full two-layer beam solution.
- **Stress from wafer bow.** Measure the bow (or radius) of a wafer before and after a film goes on, and Stoney's equation gives the film stress, σ = E_s h_s² κ / (6(1 − ν_s) h_f), and the force per width σh_f.
- **Bonded strip (bimetal).** Two layers bonded along their length bend when heated. Timoshenko's formula gives the curvature, and a force-and-moment balance gives the stress at the faces and the interface of each layer, the tip deflection of a cantilever, and the rise of a free strip.
- **Bar held between walls.** A bar with fixed ends gets σ = −E ∫α dT. With a gap it is stress-free until the gap closes; the page gives the closing temperature and compares the stress with the yield strength.

Tick **CTE changes with temperature** to use α(T) = α + slope × (T − T_ref) for every material; the thermal strain is then integrated exactly.

Check whether the stress will crack the part with the [[fracture-toughness-calculator]], and measure the film you put down with the [[thin-film-thickness]] tool.

## How to use it

1. Choose what to work out, and type the stress-free and final temperatures.
2. Type the moduli (GPa), Poisson's ratios, CTEs (ppm/K) and sizes. Positive stress is tension.
3. Read the stress, curvature and checks, and the plot of stress against temperature or through the thickness. Download everything as an image, PDF or Word file.

## Worked example

A made-up 1 µm film (E_f = 70 GPa, ν_f = 0.33, α_f = 23 ppm/K) is deposited at 300 °C on a 500 µm wafer (α_s = 3 ppm/K, E_s = 130 GPa, ν_s = 0.28) and cooled to 20 °C. The mismatch strain is (3 − 23) × 10⁻⁶ × (−280) = 5600 µε, and the biaxial modulus is 104.5 GPa, so the film carries **585.1 MPa in tension**. Stoney gives a curvature of 77.77 /km, a **radius of 12.86 m**, and a bow of 97.21 µm over 100 mm. With the CTE slopes on (0.02 and 0.004 ppm/K²) the stress rises to 650.6 MPa.

Going the other way, a bow of 50 µm over 100 mm on the same wafer and film means a radius of 25 m and a film stress of **300.9 MPa**.

A made-up bimetal strip of two 0.5 mm layers (bottom E = 140 GPa, α = 1.5 ppm/K; top E = 110 GPa, α = 19 ppm/K) heated from 20 to 120 °C bends to a radius of 382.3 mm (curvature 2.615 /m); a 50 mm cantilever tip moves 3.265 mm. A steel-like bar (E = 200 GPa, α = 12 ppm/K) with fixed ends heated by 50 K carries 120 MPa in compression.

## Tips

- Only the stress-free state matters: if a film was deposited with an intrinsic stress, add it to the thermal stress.
- Stoney assumes a film much thinner than the substrate, a bow smaller than the thickness, and an isotropic substrate; the page says when you are outside that.
- Near the free ends of a bonded strip there are peel and shear stresses at the interface that beam theory leaves out; that is where layers come apart.

## FAQ

**Why E/(1 − ν) for a film?** The film is held in both in-plane directions at once, which makes it stiffer than in a simple pull by 1/(1 − ν).

**Which sign does the bow have?** Positive bow here means the film side is concave (dished), which comes from a film in tension.

**Is my input stored?** No, all the sums happen on this page.
