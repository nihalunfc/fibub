---
name: Rectifier lab
num: 1431
shelf: learn
code: L280
section: school-physics
title: "Rectifier lab: half-wave, full-wave and bridge rectifiers with a smoothing capacitor and ripple"
summary: "Turn AC into DC with diodes. See which diodes conduct in each half cycle of a half-wave, centre-tap full-wave or bridge rectifier, watch the output wave, then add a smoothing capacitor and see the ripple shrink, with the DC output, ripple frequency and ripple factor."
status: live
ads: false
order: 1431
icon: curve
works: offline
updated: 2026-11-09
related: [pn-junction, lcr-phasors, capacitor-lab, circuit-simulator]
sources:
  - "Half-wave, full-wave and bridge rectification, the averages Vm/π and 2Vm/π, the ripple estimate Vr ≈ Vm/(f_r R C) and the 0.7 V silicon diode drop are standard school physics and electronics."
  - "The step simulation (ideal diodes with a fixed drop, capacitor charging instantly and discharging through the load) was checked in the tests against an exact Python solution (scipy brentq and quad). Peak voltages, loads and capacitors are example values."
  - "Drawings are fibub's own. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: sliders, label: "Circuit" }
  - { icon: eye, label: "Diodes" }
  - { icon: curve, label: "Output" }
  - { icon: shrink, label: "Smooth it" }
---

## What it does

Mains electricity is **AC**: it pushes one way, then the other, 50 times a second. Phones, radios and LEDs need **DC**, which always pushes the same way. A diode only lets current through one way, so a few diodes can turn AC into DC. That is a **rectifier**.

- **Half-wave.** One diode. It passes the positive half of each cycle and blocks the negative half, so the load gets one pulse per cycle and nothing in between.
- **Full-wave (centre-tap).** A transformer with a tap in the middle of its secondary coil and two diodes. In each half cycle one diode conducts, so both halves reach the load the same way round: two pulses per cycle.
- **Bridge.** Four diodes in a diamond, no centre tap needed. Two diodes conduct in the positive half and the other two in the negative half; the current always goes through two of them, so 1.4 V is lost instead of 0.7 V.
- **Smoothing capacitor.** A capacitor across the load charges up at each peak and feeds the load while the input falls. The output becomes nearly steady DC with a small saw-tooth **ripple**. A bigger capacitor or a lighter load (bigger RL) gives less ripple.

Tap **Positive half** and **Negative half** to see which diodes conduct (they turn coloured). The wave plot shows the input (dashed) and the output across the load (solid) over three cycles.

This fits **Class 12 Physics: semiconductor electronics** (the diode as a rectifier, half-wave and full-wave rectifiers, filtering with a capacitor). Start with how one diode behaves in the [[pn-junction]] tool; see how a capacitor stores charge in the [[capacitor-lab]], and build any circuit of your own in the [[circuit-simulator]].

## How to use it

1. Choose **Half-wave**, **Full-wave** or **Bridge**.
2. Switch between the two half cycles to see the current path.
3. Set the peak input voltage **Vp** and the load **RL**.
4. Pick a smoothing capacitor and read the DC output, the lowest output, the ripple and the ripple factor.
5. Compare the simulated numbers with the textbook estimates under the plot.

## Worked example

Bridge, Vp = 12 V, RL = 1 kΩ, no capacitor: the peak output is 12 − 2 × 0.7 = 10.60 V. The textbook average 2Vm/π gives 6.75 V; the simulation gives 6.29 V, a little less because each pulse starts only once the input passes 1.4 V. The output drops to 0 V between pulses (ripple 10.60 V) and the ripple factor is 0.572.

Add 1000 µF. The output now stays between 10.50 V and 10.60 V: ripple 0.10 V at 100 Hz, DC output 10.55 V. The estimate Vr ≈ 10.60 / (100 × 1000 × 0.001) = 0.11 V agrees. Now lower RL to 200 Ω: the capacitor drains faster and the ripple grows to 0.47 V.

Half-wave with 1000 µF and 1 kΩ: the ripple is 0.22 V, about twice the bridge's, because the capacitor has to last a whole 20 ms cycle instead of 10 ms.

## Tips

- The ripple frequency tells you the type: 50 Hz for half-wave, 100 Hz for full-wave and bridge on 50 Hz mains.
- The estimate Vm/(f R C) only works when the ripple is small; with 100 µF and a heavy load it overestimates.
- Real supplies add a voltage regulator after the capacitor (a Zener diode is the simplest; see the p-n junction tool).

## FAQ

**Why does a bridge need four diodes when full-wave needs two?** The centre-tap circuit uses half of the transformer coil in each half cycle; the bridge uses the whole coil both times, so it needs two more diodes to steer the current.

**Is anything saved?** No. Everything runs in your browser and nothing is stored or sent.

**Is this an official textbook tool?** No. It is an independent practice page that follows the same school topics.
