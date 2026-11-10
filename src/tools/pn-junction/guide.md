---
name: PN junction
num: 1430
shelf: learn
section: school-physics
title: "PN junction"
summary: "Join p-type and n-type silicon and watch the depletion layer thin in forward bias and widen in reverse bias. See the V-I curve of a silicon, germanium or Zener diode with your working point, the knee voltage, dynamic resistance, Zener breakdown and a Zener voltage regulator."
status: live
ads: false
order: 1430
icon: curve
works: offline
updated: 2026-11-09
related: [energy-bands, rectifier-lab, solar-cell-iv, ohms-law-lab]
sources:
  - "The diode equation I = Is (e^(V/ηV_T) − 1), V_T = kT/e (CODATA k/e = 8.617 × 10⁻⁵ V/K), Zener breakdown and the Zener regulator are standard physics. Barrier potentials of about 0.7 V (silicon) and 0.3 V (germanium) are the usual school values."
  - "The saturation currents (10⁻¹⁴ A and 10⁻⁸ A), the 0.5 µm zero-bias depletion width, the 5.1 V Zener with 5 Ω slope resistance and the regulator parts are made-up teaching values, not data for any real part. The maths was checked in the tests against an independent Python version."
  - "Drawings are fibub's own. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: sliders, label: "Bias" }
  - { icon: eye, label: "Junction" }
  - { icon: curve, label: "V-I curve" }
  - { icon: check, label: "Regulator" }
---

## What it does

A diode is a crystal that is p-type on one side and n-type on the other. Where they meet, free electrons from the n side fill holes on the p side. That leaves a thin **depletion layer** with no free carriers, only fixed ions: negative on the p side, positive on the n side. Their electric field makes a **barrier** (about 0.7 V in silicon, 0.3 V in germanium) that stops more carriers crossing.

- **Bias.** Slide V. With the p side joined to + (**forward bias**) the barrier drops and the layer thins; past the **knee voltage** the current shoots up. With the p side joined to − (**reverse bias**) the barrier grows, the layer widens and only a tiny leakage current flows.
- **The picture.** Holes (open circles) on the p side, free electrons (filled dots) on the n side, the depletion layer with its ions in the middle, and the battery the right way round.
- **V-I curve.** The characteristic curve of the diode with your working point. As in school graphs, the forward and reverse halves of the voltage axis have different scales.
- **Zener diode.** A heavily doped diode that breaks down at a set reverse voltage (5.1 V here) without damage. In the second card it holds a load at 5.1 V while the input changes: a **voltage regulator**.

This fits **Class 12 Physics: semiconductor electronics** (p-n junction formation, the semiconductor diode, forward and reverse bias characteristics, the Zener diode as an extension). It follows on from [[energy-bands]], where you make the p-type and n-type crystals; next, use diodes to turn AC into DC in the [[rectifier-lab]], or see a diode that makes power from light in the [[solar-cell-iv]] tool.

## How to use it

1. Pick **Silicon**, **Germanium** or **Zener 5.1 V**.
2. Move the **V** slider, or tap a quick value (−5, 0, 0.3, 0.7 V).
3. Read the current, the barrier height, the depletion layer width and the dynamic resistance (ΔV/ΔI at that point).
4. In the regulator card, move the input voltage, the series resistor R and the load RL.
5. Try the **Check yourself** questions.

## Worked example

Silicon at 0.7 V forward bias: I = 10⁻¹⁴ × (e^(0.70/0.02585) − 1) = 5.75 mA. The barrier is 0.7 − 0.7 = 0 V and the dynamic resistance is only 4.5 Ω. At 0.3 V almost nothing flows. Germanium reaches 1.1 mA already at 0.3 V, because its barrier is lower.

Now give 5 V of reverse bias. The barrier grows to 5.70 V, the depletion layer widens from 0.50 µm to 1.43 µm, and the current is only −10 fA (ten million-billionths of an amp). Switch to the Zener diode and go to −6 V: it has broken down and carries 180 mA.

Regulator: Vin = 12 V, R = 220 Ω, RL = 1000 Ω. I_R = (12 − 5.1)/220 = 31.4 mA, I_L = 5.1/1000 = 5.1 mA, so the Zener carries 26.3 mA and the load stays at 5.10 V. Lower Vin to 6 V and the output drops to 4.9 V: the Zener has stopped regulating.

## Tips

- The knee is not a sharp switch: current grows about ten times for every 60 mV, so a diode looks "off" until about 0.6 V and "on" after.
- Real reverse currents are larger than this ideal model (nanoamps for silicon, microamps for germanium) because of surface leakage and heat.
- A Zener diode is always used in reverse bias.

## FAQ

**Why does the depletion layer change width?** Forward bias pushes electrons and holes toward the joint and partly refills it; reverse bias pulls them away and uncovers more ions.

**Why do the two halves of the graph use different scales?** Forward currents are milliamps over a fraction of a volt; reverse voltages run to many volts. One scale would hide one half.

**Is anything saved?** No. Everything runs in your browser and nothing is stored or sent.

**Is this an official textbook tool?** No. It is an independent practice page that follows the same school topics.
