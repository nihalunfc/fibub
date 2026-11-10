---
name: Parallel-plate capacitor lab
num: 1047
shelf: learn
code: L22
section: school-physics
title: "Parallel-plate capacitor lab: plate area, gap, dielectric slab, battery connected or disconnected"
summary: "Change the plate area and the gap of a parallel-plate capacitor, slide a dielectric slab in and out, and connect or disconnect the battery. Watch the capacitance, charge, voltage, stored energy and field change, and see two capacitors combined in series and in parallel."
status: live
ads: false
order: 1047
icon: sliders
works: offline
updated: 2026-11-09
related: [capacitor-inductor-calculator, field-line-plotter, electrostatics-solver, lcr-phasors]
sources:
  - "Parallel-plate capacitor C = K ε₀ A / d, a slab partly inserted as two capacitors in parallel, a slab of thickness t as C = ε₀ A / (d − t + t/K), Q = CV, U = ½CV², E = V/d, and capacitors in series and parallel: standard physics results."
  - "ε₀ = 8.8541878188 × 10⁻¹² F/m (CODATA 2022 recommended value)."
  - "Checked by hand calculation, the formula's limits (no slab, full slab, a conducting slab) and the energy identities U = ½CV² = Q²/2C = ½QV."
flow:
  - { icon: sliders, label: "Set plates" }
  - { icon: shrink, label: "Slide slab" }
  - { icon: link, label: "Battery" }
  - { icon: check, label: "Check" }
---

## What it does

A parallel-plate capacitor is two metal plates with a gap between them. Connect a battery and charge flows on to one plate and off the other until the voltage across the gap matches the battery. This lab lets you change everything that matters and see what happens:

- the **plate area** (bigger plates hold more charge at the same voltage);
- the **gap** between the plates (a smaller gap gives a bigger capacitance);
- a **dielectric slab** with a dielectric constant K that you slide in part of the way or all the way;
- the **battery**, which you can connect or disconnect.

The picture shows the plates, the slab, the + and − charges (more of them where the slab is) and the field arrows. The page gives the capacitance, charge, voltage, stored energy and field, the formula with your numbers, and a sentence on what stays fixed. A second panel combines two capacitors in series and in parallel on a battery.

It follows the Class 12 Physics chapter on electrostatic potential and capacitance (the parallel-plate capacitor, the effect of a dielectric, combining capacitors, energy stored in a capacitor). For more shapes of capacitor (coaxial cables, spheres) use the [[capacitor-inductor-calculator]]; to see the field of charges in the plane, try the [[field-line-plotter]].

## How to use it

1. Slide the **battery voltage**, the **plate area** (25 to 400 cm²) and the **gap** (0.5 to 10 mm).
2. Set the slab's **dielectric constant** K and slide it **in** from 0% to 100%.
3. Tap **Disconnect the battery** to open the switch. The charge is now trapped on the plates. Change the slab or the gap and see the voltage change instead of the charge. Tap again to connect.
4. In **Two capacitors together**, type C₁, C₂ (in microfarads) and a battery voltage to see the total capacitance, the charges, the voltages and the energy for series and for parallel.

## Worked example

The page starts with plates of 100 cm² (0.01 m²) 2.0 mm apart on 6 V. C = ε₀ A / d = 8.85 × 10⁻¹² × 0.01 / 0.002 = 44.3 pF. The charge is Q = CV = 266 pC, the energy ½CV² = 797 pJ and the field V/d = 3 kV/m.

Now disconnect the battery and slide a K = 4 slab all the way in. C becomes 4 × 44.3 = 177 pF, the charge stays 266 pC, so V = Q/C = 1.5 V and the energy falls to 199 pJ. The missing energy went into pulling the slab in. Do the same with the battery connected and V stays 6 V while Q rises to 1.06 nC.

For two capacitors of 4 µF and 12 µF on 12 V: in series C = 4 × 12 / 16 = 3 µF, each has 36 µC, and the voltages are 9 V and 3 V. In parallel C = 16 µF and both get 12 V.

## Tips

- The field between the plates is V/d, whether or not the slab is in, when the slab fills the gap.
- With a slab, more charge sits on the part of the plates next to it, because the slab's own charges partly cancel the field.
- Capacitors in series share charge; in parallel they share voltage. (Resistors are the other way round.)

## FAQ

**Is this a real material?** The slab is any material with the dielectric constant you choose; no material data is used.

**Why does the energy go down when the slab goes in with the battery off?** The plates pull the slab in, doing work on it. With the battery on, the battery supplies extra energy, so the stored energy goes up.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.
