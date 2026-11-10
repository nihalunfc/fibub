---
name: Series and parallel
num: 1042
shelf: learn
code: L17
section: school-physics
title: "Series and parallel"
summary: "Drag four resistors into series, into a parallel box or out of the circuit. The page works out the equivalent resistance step by step, shows the current splitting with moving dots, and gives the voltage, current and power for each resistor, plus the energy used in kWh and its cost."
status: live
ads: false
order: 1042
icon: sliders
works: offline
updated: 2026-11-09
related: [ohms-law-lab, circuit-simulator, resistor-colour-code]
sources:
  - "Resistors in series (R = R₁ + R₂ + ...) and in parallel (1/R = 1/R₁ + 1/R₂ + ...), P = VI = I²R, energy in kWh, and Kirchhoff's junction and loop rules with a battery's internal resistance: standard school physics results."
  - "The price per kWh is a made-up example that you can change; no tariff data is used."
  - "Checked against an independent Python script (fractions for exact parallel sums, then the currents, voltages and powers) and hand-worked examples such as 6 Ω ∥ 3 Ω = 2 Ω."
flow:
  - { icon: pointer, label: "Drag" }
  - { icon: calculator, label: "Work out" }
  - { icon: eye, label: "Watch flow" }
  - { icon: currency, label: "Bill" }
---

## What it does

This page is a circuit board with four resistors and a battery. Drag a resistor onto the top wire and it is in **series**: the same current goes through it and everything else. Drag it into the box below and it joins the **parallel** bank: it gets the same voltage as the others in the box and takes its own share of the current. Drag it down to the tray and it is out of the circuit.

As you build, the page works out the **equivalent resistance** one step at a time (series part, parallel part, total), then the current from the battery, the voltage across the parallel box, the current in each branch and the power. Dots move round the wires, faster where more current flows, so you can see the current split at a junction and join up again.

It follows the Class 10 Science electricity topics (resistors in series and in parallel, the heating effect, electric power and the kilowatt hour) and, with the Level switch on Class 12, the Class 12 Physics current electricity topics (internal resistance, terminal voltage, Kirchhoff's rules). If you have not met V = IR yet, start with the [[ohms-law-lab]]; to try bigger circuits with switches and other parts, go on to the [[circuit-simulator]].

## How to use it

1. Choose the **battery** voltage. 230 V is the voltage of house wiring in India, for working out appliance power and bills.
2. **Drag** the resistors R1 to R4 around the picture, or use the table under it: type each resistance in ohms and pick Series, Parallel or Not used.
3. Read **Worked out step by step**. The table under it gives the voltage across, the current through and the power in each resistor.
4. In **Energy and the bill**, type how many hours a day the circuit is on, for how many days, and the price of one unit (1 kWh). The page gives the energy and the cost.
5. Switch the **Level** to Class 12 to give the battery an internal resistance r. The page then shows the terminal voltage, the volts lost inside the battery and Kirchhoff's loop rule with your numbers.

## Worked example

The page starts with R1 = 10 Ω on the top wire, R2 = 10 Ω and R3 = 15 Ω in the parallel box, and a 6 V battery.

- Parallel box: 1/R_p = 1/10 + 1/15 = 0.1667 per Ω, so R_p = 6 Ω.
- Total: R = 10 + 6 = 16 Ω.
- Current: I = 6 / 16 = 375 mA. R1 has 3.75 V across it; the parallel box has 2.25 V.
- The 375 mA splits: 225 mA through R2 and 150 mA through R3, and 225 + 150 = 375.
- Power: 6 V × 0.375 A = 2.25 W. On for 5 hours a day for 30 days, that is 0.338 kWh, which costs about ₹2.36 at ₹7 a unit.

## Tips

- In series the total is always bigger than the biggest resistor; in parallel it is always smaller than the smallest one.
- For two resistors in parallel, product over sum is a quick shortcut: 6 × 3 / (6 + 3) = 2 Ω.
- If nothing is in the circuit the page warns about a short circuit, which is what a fuse protects a house from.

## FAQ

**Why are houses wired in parallel?** Each appliance gets the full 230 V and can be switched on or off without affecting the others. In series, one switched-off lamp would turn everything off.

**Is the price per unit real?** No, ₹7 is only a starting example. Type the rate from your own bill.

**Is anything saved?** No. The circuit and your answers stay on this page and are gone when you close it.
