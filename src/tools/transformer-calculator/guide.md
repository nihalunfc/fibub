---
name: Transformer calculator
num: 1417
shelf: learn
code: L271
section: school-physics
title: "Transformer calculator: turns ratio, step-up and step-down voltages, currents, efficiency and line losses"
summary: "Set the turns on the primary and secondary coils, the supply voltage, the load and the efficiency, and get the secondary voltage, both currents and the power, with the working. Then see why electricity is sent at high voltage: the same power at 230 V, 11 kV, 33 kV, 132 kV, 220 kV and 400 kV, and the heat lost in the wires."
status: live
ads: false
order: 1417
icon: calculator
works: offline
updated: 2026-11-16
related: [inductance-lab, rms-waveform, lcr-phasors, motional-emf]
sources:
  - "Ideal transformer V_s/V_p = N_s/N_p; power in = power out ÷ efficiency; line loss I²R with I = P/V (single-phase, unity power factor, a simplified model). Standard physics results."
  - "Transmission voltages 11, 33, 132, 220 and 400 kV are common standard levels on India's grid; 230 V is the nominal household supply. Real grids use three phases, so real currents and losses differ; the page shows the idea, not a design."
  - "Checked against an independent Python script."
  - "Typed-number calculator: Vp/Vs = Np/Ns, power in = power out ÷ efficiency, and loss = (P/V)² R: standard results; examples checked by hand."
flow:
  - { icon: sliders, label: "Set turns" }
  - { icon: calculator, label: "Volts, amps" }
  - { icon: chart, label: "Line loss" }
  - { icon: check, label: "Check" }
---

## What it does

A **transformer** is two coils wound on one iron core. An alternating current in the first coil (the primary) makes a changing magnetic flux in the core, and that changing flux induces an emf in the second coil (the secondary). Each turn of either coil gets the same emf, so the voltages are in the same ratio as the turns: V_s / V_p = N_s / N_p. More turns on the secondary gives a **step-up** transformer; fewer gives a **step-down** one.

A transformer cannot make energy. In an ideal one, the power in equals the power out, V_p I_p = V_s I_s, so if it steps the voltage up it steps the current down by the same factor. Real transformers lose a few percent as heat in the coils and the core, which this page includes as an efficiency.

The second card shows why this matters. Power stations send electricity over long lines. The wires have resistance, and the heat lost in them is I²R. Sending the same power P = VI at a higher voltage needs a smaller current, and the loss falls with the square of the current. The page sends your power at six voltages and shows the current and the share lost at each.

It follows the alternating current chapter of Class 12 Physics (transformers) and the induction chapter before it (mutual inductance). See how coils induce emfs in each other in the [[inductance-lab]], what "230 V rms" means in [[rms-waveform]], and AC circuits with L and C in [[lcr-phasors]].

## Solve your own numbers

The first card is for the numbers in your own question. Pick what to find: the **secondary voltage**, the **primary voltage**, the **secondary or primary turns**, or the **primary or secondary current**. Type the others (V, kV or mV; mA or A) and read the answer with the working, from Vp / Vs = Np / Ns, and whether it is step-up or step-down. For currents, add an **efficiency** to include losses, or leave it blank for an ideal transformer (power in = power out); the heat lost is shown. A non-whole number of turns is rounded for you. A second box, **Power line loss (I²R)**, takes the power sent, the line voltage and resistance and gives the current, the heat lost and the percentage lost, or finds the voltage needed to keep the loss below a chosen share. Five transformer examples and three line examples are ready in the Example lists.

## How to use it

1. Set the primary and secondary turns (50 to 2000), the primary voltage (10 to 400 V rms), the load resistance (1 to 100 Ω) and the efficiency (50 to 100%).
2. Read the secondary voltage, both currents, the power out and the power lost in the transformer.
3. In the second card, set the power to send (1 to 100 MW) and the line resistance (1 to 20 Ω). Compare the bars and the table.

## Worked example

The page opens with 1000 primary turns, 50 secondary turns, 230 V, a 10 Ω load and 90% efficiency.

- V_s = 230 × 50 / 1000 = **11.5 V** (step-down).
- I_s = 11.5 / 10 = 1.15 A, so the power out is 13.2 W.
- At 90% the primary takes 13.2 / 0.9 = 14.7 W, so I_p = 14.7 / 230 = **63.9 mA**, and 1.47 W is lost as heat.

Sending 10 MW through 5 Ω of line: at 11 kV the current is 909 A and 4.13 MW (41%) is lost. At 220 kV it is 45.5 A and only 10.3 kW (0.1%) is lost: twenty times the voltage, one four-hundredth of the loss.

## Tips

- Transformers only work with AC. A steady current makes a steady flux, which induces nothing.
- The core is made of thin insulated sheets (laminations) to cut eddy currents, one of the main losses.
- Higher voltage needs taller towers and better insulation, so grids balance loss against cost.

## FAQ

**How do I find the secondary voltage of a transformer?** Vs = Vp × Ns / Np: the voltage is in the same ratio as the turns.

**Why does the current go down when the voltage goes up?** Power is conserved (Vp Ip = Vs Is for an ideal one), so Is / Ip = Np / Ns.

**Is this how the real grid works?** In outline, yes. Real lines carry three-phase AC, and real loads are not pure resistances, so the exact numbers differ.

**Why does the 230 V row say impossible?** The current needed would make the wires lose more than the power being sent: the voltage at the far end would collapse long before that.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.
