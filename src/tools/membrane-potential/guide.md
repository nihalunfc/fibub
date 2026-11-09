---
name: Membrane potential calculator
num: 345
shelf: science
section: neuroscience
title: "Membrane potential calculator: Nernst potentials and the Goldman-Hodgkin-Katz (GHK) equation with I-V curves"
summary: "Equilibrium (Nernst) potentials for K⁺, Na⁺, Cl⁻ and Ca²⁺ and the resting membrane potential from the Goldman-Hodgkin-Katz equation, with editable concentrations, permeability ratios and temperature, driving forces and GHK current-voltage curves. For study and teaching, not for clinical use."
status: live
ads: true
order: 345
icon: chart
works: offline
updated: 2026-11-09
related: [nernst-calculator, colligative-properties, plot-maker, hodgkin-huxley-simulator, osmolarity-calculator]
sources:
  - "Nernst equation (W. Nernst, 1889); Goldman-Hodgkin-Katz voltage and current equations (D. E. Goldman 1943; A. L. Hodgkin and B. Katz 1949). Constants F and R from CODATA (NIST). Equations only."
  - "Checked in the tests against an independent NumPy implementation, with SciPy brentq for the zero-current potential. The example concentrations are illustrative textbook-style values, made up and rounded."
flow:
  - { icon: flask, label: "Ions" }
  - { icon: sliders, label: "Permeability" }
  - { icon: calculator, label: "GHK" }
  - { icon: chart, label: "I–V curve" }
---

## What it does

A nerve cell is negative inside because its membrane lets some ions through more easily than others, and those ions are at different concentrations inside and out. This calculator works out:

- the **Nernst (equilibrium) potential** of each ion: the voltage at which that ion would stop flowing, E = (RT/zF) ln(outside/inside);
- the **membrane potential** from the **Goldman-Hodgkin-Katz (GHK) voltage equation**, which weighs K⁺, Na⁺ and Cl⁻ by how permeable the membrane is to each;
- the **driving force** on each ion (membrane potential minus its Nernst potential) and its GHK current;
- **GHK current-voltage curves** for each ion and their total.

For electrodes and batteries, use the Nernst and cell potential calculator instead; this page is about cells and ion gradients. For study and teaching, not for clinical use.

## How to use it

1. **Concentrations**: type each ion's concentration outside and inside the cell, in mmol/L.
2. **Permeability**: relative to K⁺. The "Permeabilities" list fills in a resting membrane (K⁺ : Na⁺ : Cl⁻ = 1 : 0.05 : 0.45) or the peak of an action potential (1 : 20 : 0.45), which shows how opening Na⁺ channels swings the voltage.
3. **Temperature** changes RT/F: about 26.7 mV at 37 °C and 25.3 mV at 20 °C.
4. **P of K⁺** in cm/s only sets the size of the currents.
5. Give **Ca²⁺** a permeability to include it: the classic GHK voltage equation only handles ions of one charge, so the tool then also finds the potential where all four GHK currents add to zero.

## Worked example

The illustrative example neuron at 37 °C: K⁺ 5 mM outside and 140 inside, Na⁺ 145 and 12, Cl⁻ 110 and 10, with resting permeabilities 1 : 0.05 : 0.45.

- E_K = −89.1 mV, E_Na = +66.6 mV, E_Cl = −64.1 mV, E_Ca = +132.3 mV.
- **Membrane potential (GHK) = −64.9 mV.**
- K⁺ has a driving force of +24.1 mV (it leaks out), Na⁺ −131.5 mV (it leaks in), and Cl⁻ is almost at equilibrium.
- Choosing "Spike peak" gives +51.1 mV.

## Tips

- The membrane potential always lies between the Nernst potentials of the permeant ions, closest to the most permeant one.
- Raising outside K⁺ depolarises the cell strongly; raising outside Na⁺ at rest hardly does.
- The GHK curves rectify: K⁺ carries outward current more easily than inward because there is more K⁺ inside.

## FAQ

**Why does the sum of currents not include the Na⁺/K⁺ pump?** The GHK equation describes passive leak only; the pump's small electrogenic current is left out.

**Does anything leave my device?** No. Everything is worked out in your browser.
