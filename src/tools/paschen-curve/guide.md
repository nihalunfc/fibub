---
name: Paschen curve calculator
num: 955
shelf: science
code: T690
section: plasma-physics
title: "Paschen curve calculator: breakdown voltage of a gas gap by gas, pressure and distance"
summary: "Work out the DC voltage that makes a spark jump a gap from the gas, pressure and gap with Paschen's law, find the Paschen minimum, see which gaps a given voltage can break down, and draw the curve for one gas or all of them. The A and B constants are rounded and editable."
status: live
ads: true
order: 4
icon: curve
works: offline
updated: 2026-11-09
related: [plasma-parameters, langmuir-probe, gas-law-calculator, particle-drifts, unit-converter]
sources:
  - "Paschen, F. (1889); Townsend breakdown theory as given in Raizer, Y. P., Gas Discharge Physics (Springer, 1991), chapter 7, and Lieberman and Lichtenberg, Principles of Plasma Discharges."
  - "A and B for each gas are rounded textbook values of the Townsend fit (orders of magnitude widely quoted in teaching texts), each valid only over a limited E/p range; they are editable on the page."
  - "Checked against an independent SciPy script (bounded minimisation for the minimum, Brent's method for the gap range) on the same formula."
flow:
  - { icon: flask, label: "Gas" }
  - { icon: ruler, label: "Gap" }
  - { icon: curve, label: "Curve" }
  - { icon: target, label: "Breakdown" }
---

## What it does

When the voltage across a gas gap is high enough, a few free electrons gain enough energy between collisions to ionise atoms, each new electron does the same, and an avalanche turns into a spark or glow. **Paschen's law** says that for flat electrodes this breakdown voltage depends only on the product of pressure and gap, **p × d**:

V = B p d / (ln(A p d) − ln(ln(1 + 1/γ)))

where A and B describe how the gas is ionised and γ is how many electrons each ion knocks out of the cathode. The curve has a **minimum**: below it, no DC voltage can break the gas down at any gap. To the left of the minimum, the gas is so thin that electrons rarely hit anything, so a *wider* gap breaks down more easily, which is why vacuum gaps and neon signs behave so differently from air gaps.

Once the discharge is lit, measure it with the [[langmuir-probe|Langmuir probe analyser]], and work out its basic numbers in the [[plasma-parameters|plasma parameter calculator]].

## How to use it

1. Choose the **gas**. Its rounded A and B fill in; type your own from a source you trust if you have them.
2. Set **γ** (0.01 is a common default; it depends on the cathode metal).
3. Give the **pressure** and the **gap**, in any of the units offered.
4. Optionally type a **voltage to check**: the page says which gaps it can break down at that pressure.
5. Tick **Show every gas** to compare curves.

## Worked example

The page opens on dry air at 1 atm across a 1 mm gap with γ = 0.01. p × d is 76 Torr·cm, and the breakdown voltage comes out at about **5035 V**, a field of 50.3 kV/cm. The Paschen minimum for air with these constants is **305 V at 0.836 Torr·cm**, a gap of 11 µm at this pressure. A 1000 V supply could break down gaps from 4.60 µm to 123 µm at 1 atm, so the 1 mm gap holds it. At 1 cm the voltage is 35.5 kV, the familiar "about 30 kV per cm" for air (the simple law overestimates long gaps slightly).

## Tips

- Lower the pressure and watch the operating point slide down the curve towards the minimum: that is how low-pressure lamps light with a few hundred volts.
- Paschen's law is for uniform fields. Sharp points and edges break down at much lower average fields through corona.
- At very small gaps in air (below about 10 µm) real breakdown comes from field emission, well below the curve.

## FAQ

**Why do my measured values differ?** A and B are fits over limited E/p ranges, γ depends on the electrode surface, and humidity, temperature and electrode shape all matter. Treat the result as an estimate.

**Does temperature matter?** Paschen's law really depends on gas density. For a hot gas, use the pressure scaled to room temperature: p × 293 K / T.

**Can I use this to design insulation?** No: it is for study and planning, not a substitute for professional judgement or the clearance rules in electrical safety standards.
